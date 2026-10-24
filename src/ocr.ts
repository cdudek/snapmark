// The text in a screenshot, read by macOS's own text recognition (Vision) through JavaScript for Automation, so
// Snapmark needs no helper binary: session.md gets it under the entry, and redact.ts looks in it for secrets.
import { execFile } from 'child_process';

// In image pixels, from the top left.
export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}
export interface OcrWord extends Box {
  start: number; // the word's place in its line's text
  end: number;
}
export interface OcrLine extends Box {
  text: string;
  words: OcrWord[];
}

// Vision's boxes: normalised, from the bottom left, [x, y, w, h].
interface Raw {
  width: number | string;
  height: number | string;
  lines: { text: string; box: number[]; words: { start: number; end: number; box: number[] }[] }[];
}

// Accurate recognition with language correction; a box for each line and for each word in it.
const SCRIPT = String.raw`ObjC.import('AppKit');
ObjC.import('Vision');
function run(argv) {
  const rep = $.NSImageRep.imageRepWithContentsOfFile(argv[0]);
  const req = $.VNRecognizeTextRequest.alloc.init;
  req.recognitionLevel = 0;
  req.usesLanguageCorrection = true;
  const handler = $.VNImageRequestHandler.alloc.initWithURLOptions($.NSURL.fileURLWithPath(argv[0]), $());
  if (rep.isNil() || !handler.performRequestsError($([req]), $())) throw new Error('Vision could not read the image');
  const box = (b) => [b.origin.x, b.origin.y, b.size.width, b.size.height];
  const lines = [];
  for (let i = 0; i < req.results.count; i++) {
    const obs = req.results.objectAtIndex(i);
    const cand = obs.topCandidates(1).firstObject;
    const text = cand.string.js;
    const words = [...text.matchAll(/\S+/g)].map((m) => {
      const r = cand.boundingBoxForRangeError($.NSMakeRange(m.index, m[0].length), $());
      return { start: m.index, end: m.index + m[0].length, box: box(r.isNil() ? obs.boundingBox : r.boundingBox) };
    });
    lines.push({ text, box: box(obs.boundingBox), words });
  }
  return JSON.stringify({ width: rep.pixelsWide, height: rep.pixelsHigh, lines });
}`;

const TIMEOUT = 20_000; // a 20,000 px scrolling capture takes a few seconds

// Null when there is no Vision (Linux CI) or it failed: the editor opens and saves as before, only without the text.
export function recognize(png: string): Promise<OcrLine[] | null> {
  if (process.platform !== 'darwin') return Promise.resolve(null);
  return new Promise((resolve) =>
    execFile('osascript', ['-l', 'JavaScript', '-e', SCRIPT, png], { timeout: TIMEOUT, maxBuffer: 64 << 20 }, (err, stdout) => {
      try {
        if (err) throw err;
        resolve(toPixels(JSON.parse(stdout)));
      } catch (e) {
        console.error('Text recognition failed:', e instanceof Error ? e.message : e);
        resolve(null);
      }
    }),
  );
}

export function toPixels({ width, height, lines }: Raw): OcrLine[] {
  const [W, H] = [Number(width), Number(height)];
  const px = ([x, y, w, h]: number[]): Box => ({ x: x * W, y: (1 - y - h) * H, w: w * W, h: h * H });
  return lines.map((l) => ({ text: l.text, ...px(l.box), words: l.words.map((w) => ({ start: w.start, end: w.end, ...px(w.box) })) }));
}

export const MAX_TEXT = 2000;
export const REDACTED = '[redacted]';

const overlap = (a: Box, b: Box) =>
  Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) * Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));

// A line's text with every word a quarter or more under a Redact mark as [redacted], once for a run of them.
function shown(l: OcrLine, hidden: Box[]): string {
  let [out, at] = ['', 0];
  for (const w of l.words) {
    if (!hidden.some((r) => overlap(r, w) > 0.25 * w.w * w.h)) continue;
    const gap = l.text.slice(at, w.start);
    out += at && out.endsWith(REDACTED) && !gap.trim() ? '' : gap + REDACTED;
    at = w.end;
  }
  return out + l.text.slice(at);
}

// Vision gives the text a line at a time in no set order. Reading order: rows top to bottom (a line joins a row when
// its middle is within the row's first line), each row left to right with two spaces between its pieces. Capped.
export function ocrText(lines: OcrLine[], hidden: Box[] = [], cap = MAX_TEXT): string {
  const rows: OcrLine[][] = [];
  for (const l of [...lines].sort((a, b) => a.y - b.y)) {
    const row = rows.at(-1);
    if (row && l.y + l.h / 2 < row[0].y + row[0].h) row.push(l);
    else rows.push([l]);
  }
  const text = rows
    .map((r) =>
      r
        .sort((a, b) => a.x - b.x)
        .map((l) => shown(l, hidden).trim())
        .join('  '),
    )
    .filter(Boolean)
    .join('\n');
  return text.length > cap ? `${text.slice(0, cap).trimEnd()}…` : text;
}
