// Recording: picks the key frames of a recording for the filmstrip, and times the GIF so it plays at the real speed.
// Plain pixels in and out, no Electron, so test/keyframes.test.ts checks it in plain Node.
import crypto from 'crypto';
import { Bitmap } from './stitch';

export const MAX_KEYS = 24; // Q5
export const LIMIT_MS = 15_000; // past this, the editor opens with evenly spaced frames (F77)

const COLS = 64; // a frame is compared as a grid of grey means, 64 cells across: blind to single-pixel noise
const TOL = 8; // grey levels a cell may differ by and still count as unchanged

// The frame as a grid of COLS × rows grey means, the rows following the frame's aspect.
function thumb({ width, height, data }: Bitmap): Uint8Array {
  const rows = Math.max(1, Math.round((COLS * height) / width));
  const sum = new Float64Array(COLS * rows);
  const count = new Uint32Array(COLS * rows);
  for (let y = 0, i = 0; y < height; y++) {
    const row = Math.floor((y * rows) / height) * COLS;
    for (let x = 0; x < width; x++, i += 4) {
      const cell = row + Math.floor((x * COLS) / width);
      sum[cell] += data[i] + data[i + 1] + data[i + 2];
      count[cell] += 3;
    }
  }
  return Uint8Array.from(sum, (s, k) => (count[k] ? Math.round(s / count[k]) : 0));
}

// How much changed between two frames: the number of cells that differ by more than TOL.
function changed(a: Uint8Array, b: Uint8Array): number {
  let n = 0;
  for (let k = 0; k < a.length; k++) if (Math.abs(a[k] - b[k]) > TOL) n++;
  return n;
}

// Up to `max` of n frames, evenly spaced, the first and the last among them.
export function evenlySpaced(n: number, max = MAX_KEYS): number[] {
  if (n <= max) return Array.from({ length: n }, (_, i) => i);
  return Array.from({ length: max }, (_, i) => Math.round((i * (n - 1)) / (max - 1)));
}

export interface KeyFrames {
  keys: number[]; // frame indices, in order
  evenly: boolean; // finding them took over LIMIT_MS, so `keys` are evenly spaced instead
  hashes: (string | undefined)[]; // each frame's hash, for gifTiming; undefined for frames not read in time
}

// The key frames of `count` frames, read one at a time so a 30 s recording is never in memory at once: the first, then
// every frame that differs from the last key frame by more than a threshold of changed cells, which includes the
// settled last frame when it is a new picture. Identical frames go by hash before any comparing. Over MAX_KEYS, the
// threshold rises over the frames between until MAX_KEYS or fewer remain; at most every cell changed, so it ends with
// the first and the last frame alone.
export function keyFrames(
  count: number,
  read: (i: number) => Bitmap,
  { now = Date.now, limit = LIMIT_MS }: { now?: () => number; limit?: number } = {},
): KeyFrames {
  const start = now();
  const hashes: (string | undefined)[] = new Array(count).fill(undefined);
  const thumbs: Uint8Array[] = [];
  const index: number[] = []; // for each distinct-from-its-predecessor frame, its index
  for (let i = 0; i < count; i++) {
    const frame = read(i);
    hashes[i] = crypto.createHash('sha1').update(frame.data).digest('hex');
    if (!i || hashes[i] !== hashes[i - 1]) {
      thumbs.push(thumb(frame));
      index.push(i);
    }
    if (now() - start > limit) return { keys: evenlySpaced(count), evenly: true, hashes };
  }
  const end = thumbs.length - 1;
  const pick = (threshold: number) => {
    const keys = [0];
    for (let k = 1, last = 0; k < end; k++) if (changed(thumbs[k], thumbs[last]) > threshold) keys.push((last = k));
    // the settled last frame stays at any threshold, whenever it is a new picture
    if (end > 0 && changed(thumbs[end], thumbs[keys[keys.length - 1]]) > 0) keys.push(end);
    return keys;
  };
  let threshold = 0;
  let keys = pick(threshold);
  while (keys.length > MAX_KEYS) keys = pick((threshold = Math.max(threshold + 1, Math.ceil(threshold * 1.25))));
  return { keys: keys.map((k) => index[k]), evenly: false, hashes };
}

// The GIF's frames: identical frames in a row merge into one, and every kept frame shows until the next kept one
// (the last until `end`), so the GIF plays at the recording's real timing. `times` and `end` are seconds from the
// start. GIF delays are whole hundredths, so the clock is rounded, not each delay: the total stays the real length.
export function gifTiming(times: number[], end: number, hashes: (string | undefined)[]): { frame: number; delay: number }[] {
  const kept = times.map((_, i) => i).filter((i) => !i || hashes[i] === undefined || hashes[i] !== hashes[i - 1]);
  const cs = (t: number) => Math.round(t * 100);
  return kept.map((frame, k) => ({ frame, delay: (cs(k + 1 < kept.length ? times[kept[k + 1]] : end) - cs(times[frame])) / 100 }));
}
