// Session = a folder under root holding session.md and img/NNN.png.
import fs from 'fs';
import path from 'path';

export interface ShotText {
  caption?: string;
  notes?: string[]; // numbered marker notes
  cards?: string[]; // text written on cards on the image
  moves?: number; // cut-and-move pieces
  text?: string; // the text recognised in the screenshot (ocr.ts), redacted parts as [redacted]
}

const pad = (n: number) => String(n).padStart(3, '0');
const two = (n: number) => String(n).padStart(2, '0');
const stamp = (d = new Date()) =>
  `${d.getFullYear()}-${two(d.getMonth() + 1)}-${two(d.getDate())} ${two(d.getHours())}.${two(d.getMinutes())}`;

export function list(root: string): string[] {
  if (!fs.existsSync(root)) return [];
  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((e) => e.isDirectory() && fs.existsSync(path.join(root, e.name, 'session.md')))
    .map((e) => e.name)
    .sort()
    .reverse();
}

export function create(root: string, name = stamp()): string {
  let dir = path.join(root, name);
  for (let i = 2; fs.existsSync(dir); i++) dir = path.join(root, `${name} (${i})`);
  fs.mkdirSync(path.join(dir, 'img'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'session.md'), `# ${shortName(path.basename(dir))}\n`);
  return path.basename(dir);
}

// A session folder starts with its date stamp, "2026-10-24 23.38", plus " (2)" when two began in one minute; a name
// the owner gave follows it. Folders renamed before 2026-10-25 have no stamp (ADR: session folders keep their date stamp).
const STAMPED = /^((\d{4}-\d{2}-\d{2}) (\d{2})\.(\d{2})( \(\d+\))?)(?: (.+))?$/;

// What every screen calls a session: "2026-10-24, 23:38", "2026-10-24, 23:38 (2)" or "2026-10-24 · Ledgerly Q4 review".
export function shortName(folder: string): string {
  const m = STAMPED.exec(folder);
  if (!m) return folder;
  const [, , date, h, min, same = '', name] = m;
  return name ? `${date} · ${name}` : `${date}, ${h}:${min}${same}`;
}

// The part the owner named, which the rename field shows: empty for a bare stamp, the whole folder name without one.
export const namePart = (folder: string) => {
  const m = STAMPED.exec(folder);
  return m ? (m[6] ?? '') : folder;
};

// The folder a rename to `to` gives: the stamp stays in front, and an empty name leaves the bare stamp. Null when a
// session without a stamp gets an empty name. No "/" or ":" in a folder name: Finder shows ":" as "/".
export function renamedTo(from: string, to: string): string | null {
  const name = to.trim().replace(/[/:]/g, '-');
  const kept = STAMPED.exec(from)?.[1];
  if (!kept) return name || null;
  return name ? `${kept} ${name}` : kept;
}

// Why a typed name cannot be a session's name, or null. A leading "(2)" would read as the same-minute suffix.
export function nameProblem(wanted: string): string | null {
  return /^\s*\(\d+\)/.test(wanted) ? "A name can't start with a number in brackets, like (2)." : null;
}

// Writes the flattened PNG and appends an entry to session.md. Returns the entry number. A tall screenshot's parts
// (parts.ts) go to img/NNN/ first: when a write fails, what it wrote is removed and session.md is left as it was.
export function addShot(root: string, name: string, png: Buffer, text: ShotText = {}, parts: Buffer[] = []): number {
  const dir = path.join(root, name);
  const n = nextNumber(dir);
  const one = path.join(dir, 'img', `${pad(n)}.png`);
  const folder = path.join(dir, 'img', pad(n));
  try {
    writeParts(folder, parts);
    fs.writeFileSync(one, png);
    fs.appendFileSync(path.join(dir, 'session.md'), `\n${entry(n, new Date().toTimeString().slice(0, 5), text, parts.length)}`);
  } catch (err) {
    fs.rmSync(folder, { recursive: true, force: true });
    fs.rmSync(one, { force: true });
    throw err;
  }
  return n;
}

// img/NNN/01.png onward, in order. Nothing for a screenshot that is not tall.
function writeParts(folder: string, parts: Buffer[]) {
  if (!parts.length) return;
  fs.mkdirSync(folder, { recursive: true });
  parts.forEach((p, i) => fs.writeFileSync(path.join(folder, `${two(i + 1)}.png`), p));
}

// Number from both session.md and img/ so a deleted image never gets its number reused: a part link, a parts folder
// (img/007/) and one left by a stopped save (img/007.new/, img/007.old/) hold their number too.
function nextNumber(dir: string): number {
  const img = path.join(dir, 'img');
  fs.mkdirSync(img, { recursive: true });
  const existing = fs.readFileSync(path.join(dir, 'session.md'), 'utf8');
  const used = [...[...existing.matchAll(/img\/(\d+)(?:\.png|\/)/g)].map((m) => m[1]), ...fs.readdirSync(img)];
  return Math.max(0, ...used.map((s) => parseInt(s, 10) || 0)) + 1;
}

// The paragraph before a tall screenshot's parts, for the agent (spec/microcopy.md).
export const partsLine = (total: number) =>
  `This screenshot is tall, so it comes in ${total} parts. Read them top to bottom as one image; each part repeats a strip from the bottom of the part before.`;

// One session.md entry: heading, image, then the text. A tall screenshot (parts ≥ 2) has the parts line and its parts,
// one paragraph each, in place of the one image; the text follows once, after the last part.
function entry(n: number, time: string, { caption = '', notes = [], cards = [], moves = 0, text = '' }: ShotText, parts = 0): string {
  const images = parts
    ? [
        partsLine(parts),
        ...Array.from({ length: parts }, (_, i) => `![Screenshot ${n}, part ${i + 1} of ${parts}](img/${pad(n)}/${two(i + 1)}.png)`),
      ]
    : [`![Screenshot ${n}](img/${pad(n)}.png)`];
  let md = `## ${pad(n)} · ${time}\n\n${images.join('\n\n')}\n`;
  if (caption.trim()) md += `\n${caption.trim()}\n`;
  // A note is Markdown and may span lines (a heading, a list): indent its continuation lines under the
  // number, so they stay inside that numbered item.
  const refs = notes.map((t, i) => {
    const marker = `${i + 1}. `;
    const lines = (t.trim() || '_(no note)_').split('\n');
    return marker + lines.map((l, j) => (j && l ? ' '.repeat(marker.length) + l : l)).join('\n');
  });
  if (refs.length) md += `\n${refs.join('\n')}\n`;
  const extra = cards.filter((c) => c.trim()).map((c) => `- Card: ${c.trim().replace(/\s*\n\s*/g, ' / ')}`);
  if (moves)
    extra.push(
      `- Moved ${moves === 1 ? 'an element' : `${moves} elements`}: the dashed outline is where it is now, the arrow shows where it should go.`,
    );
  if (extra.length) md += `\n${extra.join('\n')}\n`;
  if (text.trim()) md += `\n${textBlock(text.trim())}\n`;
  return md;
}

export const TEXT_SUMMARY = 'Text in the screenshot';

// The recognised text, last in the entry: collapsed where Markdown renders HTML (GitHub, the PDF export hides it), as
// a plain-text block inside, so nothing in it reads as Markdown. The fence is longer than any backtick run in the text.
export function textBlock(text: string): string {
  const fence = '`'.repeat(Math.max(3, ...[...text.matchAll(/`+/g)].map((m) => m[0].length + 1)));
  return `<details><summary>${TEXT_SUMMARY}</summary>\n\n${fence}text\n${text}\n${fence}\n\n</details>`;
}

// Screenshots in a session = PNGs in its img/ folder.
export function count(root: string, name: string): number {
  const img = path.join(root, name, 'img');
  return fs.existsSync(img) ? fs.readdirSync(img).filter((f) => f.endsWith('.png')).length : 0;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const ymd = (d: Date) => `${d.getFullYear()}-${two(d.getMonth() + 1)}-${two(d.getDate())}`;

// "Today, 22:10", "Yesterday, 18:02", "Mon, 09:41"; a week back or more "2026-10-18, 09:41", so no weekday repeats.
export function whenLabel(at: number, now = Date.now()): string {
  const d = new Date(at);
  const midnight = (t: Date) => new Date(t.getFullYear(), t.getMonth(), t.getDate()).getTime();
  const days = Math.round((midnight(new Date(now)) - midnight(d)) / 86_400_000); // round: DST days are 23 or 25 h
  const day = days === 0 ? 'Today' : days === 1 ? 'Yesterday' : days < 7 ? DAYS[d.getDay()] : ymd(d);
  return `${day}, ${two(d.getHours())}:${two(d.getMinutes())}`;
}

// Save As…'s suggested file name, after the folder and the entry the screenshot would become (n, or the next one):
// "2026-10-24 23.38 Ledgerly Q4 review 013.png". The folder name, not the display name: no colon in a file name.
export function saveAsName(root: string, name: string, n?: number): string {
  return `${name} ${pad(n ?? nextNumber(path.join(root, name)))}.png`;
}

// Renames the folder, keeping its date stamp, and the session.md title. Returns the new name, or null if it is empty,
// unchanged or taken.
export function rename(root: string, from: string, to: string): string | null {
  const name = renamedTo(from, to);
  // A change of case only is not taken: macOS's disk ignores case, so the folder found is this session's own.
  if (!name || name === from) return null;
  if (name.toLowerCase() !== from.toLowerCase() && fs.existsSync(path.join(root, name))) return null;
  fs.renameSync(path.join(root, from), path.join(root, name));
  const md = path.join(root, name, 'session.md');
  fs.writeFileSync(
    md,
    // Only a heading on the first line is the title: a "# " line further down is the owner's own.
    fs.readFileSync(md, 'utf8').replace(/^# .*/, () => `# ${shortName(name)}`),
  );
  // Its discarded screenshots go with it: they stay in its Discarded tab, and Reopen puts them back here.
  for (const d of discardedIn(root, from)) {
    const meta = path.join(d.dir, 'meta.json');
    fs.writeFileSync(meta, JSON.stringify({ ...JSON.parse(fs.readFileSync(meta, 'utf8')), session: name }));
  }
  return name;
}

// Sessions untouched for `days`: the later of their last use in Snapmark and session.md's last change.
export function olderThan(root: string, days: number, used: Record<string, number>, now = Date.now()): string[] {
  const cutoff = now - days * 86_400_000;
  return list(root).filter((n) => Math.max(used[n] ?? 0, fs.statSync(path.join(root, n, 'session.md')).mtimeMs) < cutoff);
}

// Most recently used first; sessions never used keep list()'s newest-first order after them.
export function byLastUse(names: string[], used: Record<string, number>): string[] {
  return [...names].sort((a, b) => (used[b] ?? 0) - (used[a] ?? 0));
}

// Entry numbers in session.md, in order ("## 003 · 14:02" → 3).
export function shots(root: string, name: string): number[] {
  return entries(fs.readFileSync(path.join(root, name, 'session.md'), 'utf8')).map((e) => e.n);
}

// The entries of a session.md, in order: number, heading ("003 · 14:02") and how many numbered notes it has.
export function entries(md: string): { n: number; heading: string; notes: number }[] {
  const heads = [...md.matchAll(/^## ((\d+) · .*)$/gm)];
  return heads.map((m, i) => ({
    n: parseInt(m[2], 10),
    heading: m[1],
    notes:
      md
        .slice(m.index, heads[i + 1]?.index ?? md.length)
        .split('\n<details>')[0]
        .match(/^\d+\. /gm)?.length ?? 0, // not the text's lines
  }));
}

// Where entry n starts and ends in session.md, or null if there is no such entry.
function section(md: string, n: number): [number, number] | null {
  const start = md.search(new RegExp(`^## ${pad(n)} · `, 'm'));
  if (start < 0) return null;
  const next = md.slice(start + 1).search(/^## \d+ · /m);
  return [start, next < 0 ? md.length : start + 1 + next];
}

// ---------- Edit again: the clean screenshot and its marks, kept beside each entry ----------

// <session>/.edit/NNN.png is the screenshot before marks, NNN.json the marks and text (the editor's EditState).
export function editFiles(root: string, name: string, n: number) {
  const dir = path.join(root, name, '.edit');
  return { png: path.join(dir, `${pad(n)}.png`), json: path.join(dir, `${pad(n)}.json`) };
}

export function saveEdit(root: string, name: string, n: number, original: Buffer, state: string) {
  const f = editFiles(root, name, n);
  fs.mkdirSync(path.dirname(f.png), { recursive: true });
  fs.writeFileSync(f.png, original);
  fs.writeFileSync(f.json, state);
}

// Replaces entry n's image and text, keeping its number and time. Returns false if the entry is gone. All or nothing:
// new parts go to img/NNN.new/ first; then the old parts move to img/NNN.old/, the new ones take their place, and the
// one image and the entry are written; the old parts go last. Any failure puts every file back as it was. No parts:
// the old ones go.
export function replaceShot(root: string, name: string, n: number, png: Buffer, text: ShotText, parts: Buffer[] = []): boolean {
  const mdPath = path.join(root, name, 'session.md');
  const md = fs.readFileSync(mdPath, 'utf8');
  const at = section(md, n);
  if (!at) return false;
  const time = /^## \d+ · (.*)$/m.exec(md.slice(at[0]))![1];
  const folder = path.join(root, name, 'img', pad(n));
  const one = `${folder}.png`;
  const fresh = `${folder}.new`;
  const old = `${folder}.old`;
  // Left by a save that stopped midway: old parts whose folder is gone go back; anything else is stale.
  if (fs.existsSync(old) && !fs.existsSync(folder)) fs.renameSync(old, folder);
  for (const f of [fresh, old]) fs.rmSync(f, { recursive: true, force: true });
  try {
    writeParts(fresh, parts);
  } catch (err) {
    fs.rmSync(fresh, { recursive: true, force: true });
    throw err;
  }
  const oneBefore = fs.existsSync(one) ? fs.readFileSync(one) : null;
  try {
    if (fs.existsSync(folder)) fs.renameSync(folder, old);
    if (parts.length) fs.renameSync(fresh, folder);
    fs.writeFileSync(one, png);
    fs.writeFileSync(mdPath, md.slice(0, at[0]) + entry(n, time, text, parts.length) + (at[1] < md.length ? '\n' + md.slice(at[1]) : ''));
  } catch (err) {
    if (parts.length && !fs.existsSync(fresh)) fs.rmSync(folder, { recursive: true, force: true }); // the new parts were in
    fs.rmSync(fresh, { recursive: true, force: true });
    if (fs.existsSync(old)) fs.renameSync(old, folder);
    if (oneBefore) fs.writeFileSync(one, oneBefore);
    if (fs.readFileSync(mdPath, 'utf8') !== md) fs.writeFileSync(mdPath, md);
    throw err;
  }
  fs.rmSync(old, { recursive: true, force: true });
  return true;
}

// ---------- Discarded: kept 7 days in <root>/.discarded/, one folder each ----------

export const KEEP_DAYS = 7;

// kind "capture": a screenshot closed without saving (image.png is the clean capture, state.json its marks).
// kind "shot": an entry removed from a session (entry.md, image.png, parts/ for a tall one, and original.png +
// state.json when kept).
export interface Discarded {
  dir: string;
  kind: 'capture' | 'shot';
  session: string;
  n?: number;
  copied?: boolean; // a One-Shot that Copy Image closed: "Copied One-Shot", so it is not mistaken for a discard
  at: number; // epoch ms
}

function discardDir(root: string, meta: Omit<Discarded, 'dir' | 'at'>): string {
  const at = Date.now();
  const d = new Date(at);
  const what = meta.copied ? 'Copied One-Shot' : meta.kind === 'capture' ? 'not saved' : `screenshot ${meta.n}`;
  // Readable in Finder: "2026-09-26 13.05.12 · <session> · screenshot 2"
  const base = path.join(root, '.discarded', `${stamp(d)}.${two(d.getSeconds())} · ${meta.session} · ${what}`);
  let dir = base;
  for (let i = 2; fs.existsSync(dir); i++) dir = `${base} (${i})`;
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'meta.json'), JSON.stringify({ ...meta, at }));
  return dir;
}

// A screenshot closed without saving: keep the clean capture and its marks. Returns the folder.
export function discardCapture(root: string, session: string, image: string, state: string, copied = false): string {
  const dir = discardDir(root, { kind: 'capture', session, ...(copied && { copied }) });
  fs.copyFileSync(image, path.join(dir, 'image.png'));
  fs.writeFileSync(path.join(dir, 'state.json'), state);
  return dir;
}

// Newest first. Folders older than KEEP_DAYS, and folders that are not ours, are deleted.
export function discarded(root: string, now = Date.now()): Discarded[] {
  const top = path.join(root, '.discarded');
  if (!fs.existsSync(top)) return [];
  const all: Discarded[] = [];
  for (const name of fs.readdirSync(top)) {
    const dir = path.join(top, name);
    let meta: Omit<Discarded, 'dir'> | null = null;
    try {
      meta = JSON.parse(fs.readFileSync(path.join(dir, 'meta.json'), 'utf8'));
    } catch {
      // not a discard folder
    }
    if (meta && now - meta.at < KEEP_DAYS * 86_400_000) all.push({ ...meta, dir });
    else if (fs.statSync(dir).isDirectory()) fs.rmSync(dir, { recursive: true, force: true });
  }
  return all.sort((a, b) => b.at - a.at);
}

// One session's discarded screenshots: editors closed without saving while it was current, and entries removed from it.
export const discardedIn = (root: string, session: string, now = Date.now()) => discarded(root, now).filter((d) => d.session === session);

// Puts a removed entry back in its session (recreated if it is gone): in place, before the first entry with a higher
// number, or at the end under the next number when its old one was taken in the meantime. Returns its number.
export function restoreShot(root: string, d: Discarded): number {
  const dir = path.join(root, d.session);
  if (!fs.existsSync(path.join(dir, 'session.md'))) {
    fs.mkdirSync(path.join(dir, 'img'), { recursive: true });
    fs.writeFileSync(path.join(dir, 'session.md'), `# ${shortName(d.session)}\n`);
  }
  const old = d.n!;
  const img = path.join(dir, 'img');
  // A parts folder left behind holds its number too, so moving the parts back can never fail midway.
  const taken =
    shots(root, d.session).includes(old) ||
    [`${pad(old)}.png`, pad(old), `${pad(old)}.new`, `${pad(old)}.old`].some((f) => fs.existsSync(path.join(img, f)));
  const n = taken ? nextNumber(dir) : old;
  const text = fs
    .readFileSync(path.join(d.dir, 'entry.md'), 'utf8')
    .replace(`## ${pad(old)} · `, `## ${pad(n)} · `)
    .replace(`![Screenshot ${old}](img/${pad(old)}.png)`, `![Screenshot ${n}](img/${pad(n)}.png)`)
    .replaceAll(`[Screenshot ${old}, part `, `[Screenshot ${n}, part `)
    .replaceAll(`](img/${pad(old)}/`, `](img/${pad(n)}/`);
  fs.mkdirSync(img, { recursive: true });
  fs.renameSync(path.join(d.dir, 'image.png'), path.join(img, `${pad(n)}.png`));
  if (fs.existsSync(path.join(d.dir, 'parts'))) fs.renameSync(path.join(d.dir, 'parts'), path.join(img, pad(n)));
  if (fs.existsSync(path.join(d.dir, 'state.json')))
    saveEdit(
      root,
      d.session,
      n,
      fs.readFileSync(path.join(d.dir, 'original.png')),
      fs.readFileSync(path.join(d.dir, 'state.json'), 'utf8'),
    );
  const mdPath = path.join(dir, 'session.md');
  const md = fs.readFileSync(mdPath, 'utf8');
  const later = [...md.matchAll(/^## (\d+) · /gm)].find((m) => parseInt(m[1], 10) > n);
  fs.writeFileSync(
    mdPath,
    later ? `${md.slice(0, later.index).trimEnd()}\n\n${text.trim()}\n\n${md.slice(later.index)}` : `${md.trimEnd()}\n\n${text.trim()}\n`,
  );
  fs.rmSync(d.dir, { recursive: true, force: true });
  return n;
}

// Takes entry n out of session.md and moves it to <root>/.discarded/, so it can come back.
// Returns the folder it went to, or null if there is no such entry.
export function removeShot(root: string, name: string, n: number): string | null {
  const dir = path.join(root, name);
  const mdPath = path.join(dir, 'session.md');
  const md = fs.readFileSync(mdPath, 'utf8');
  const at = section(md, n);
  if (!at) return null;
  const [start, end] = at;
  const to = discardDir(root, { kind: 'shot', session: name, n });
  fs.writeFileSync(path.join(to, 'entry.md'), md.slice(start, end).trim() + '\n');
  const img = path.join(dir, 'img', `${pad(n)}.png`);
  if (fs.existsSync(img)) fs.renameSync(img, path.join(to, 'image.png'));
  const parts = path.join(dir, 'img', pad(n)); // a tall screenshot's parts go with it
  if (fs.existsSync(parts)) fs.renameSync(parts, path.join(to, 'parts'));
  const edit = editFiles(root, name, n);
  if (fs.existsSync(edit.json)) {
    fs.renameSync(edit.png, path.join(to, 'original.png'));
    fs.renameSync(edit.json, path.join(to, 'state.json'));
  }
  fs.writeFileSync(mdPath, (md.slice(0, start).trimEnd() + '\n' + md.slice(end).replace(/^\n+/, '\n')).replace(/\n{3,}/g, '\n\n'));
  return to;
}
