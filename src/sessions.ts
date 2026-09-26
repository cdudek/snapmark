// Session = a folder under root holding session.md and img/NNN.png.
import fs from 'fs';
import path from 'path';

export interface ShotText {
  caption?: string;
  notes?: string[]; // numbered marker notes
  cards?: string[]; // text written on cards on the image
  moves?: number; // cut-and-move pieces
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
  fs.writeFileSync(path.join(dir, 'session.md'), `# ${path.basename(dir)}\n`);
  return path.basename(dir);
}

// Writes the flattened PNG and appends an entry to session.md. Returns the entry number.
export function addShot(
  root: string,
  name: string,
  png: Buffer,
  { caption = '', notes = [], cards = [], moves = 0 }: ShotText = {},
): number {
  const dir = path.join(root, name);
  const n = nextNumber(dir);
  fs.writeFileSync(path.join(dir, 'img', `${pad(n)}.png`), png);
  fs.appendFileSync(path.join(dir, 'session.md'), `\n${entry(n, new Date().toTimeString().slice(0, 5), { caption, notes, cards, moves })}`);
  return n;
}

// Number from both session.md and img/ so a deleted image never gets its number reused.
function nextNumber(dir: string): number {
  const img = path.join(dir, 'img');
  fs.mkdirSync(img, { recursive: true });
  const existing = fs.readFileSync(path.join(dir, 'session.md'), 'utf8');
  const used = [...[...existing.matchAll(/img\/(\d+)\.png/g)].map((m) => m[1]), ...fs.readdirSync(img)];
  return Math.max(0, ...used.map((s) => parseInt(s, 10) || 0)) + 1;
}

// One session.md entry: heading, image, then the text.
function entry(n: number, time: string, { caption = '', notes = [], cards = [], moves = 0 }: ShotText): string {
  let md = `## ${pad(n)} · ${time}\n\n![Screenshot ${n}](img/${pad(n)}.png)\n`;
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
  return md;
}

// Screenshots in a session = PNGs in its img/ folder.
export function count(root: string, name: string): number {
  const img = path.join(root, name, 'img');
  return fs.existsSync(img) ? fs.readdirSync(img).filter((f) => f.endsWith('.png')).length : 0;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// "2026-09-25 12.03 (2)" → "25 Sep 12.03 (2)"; a name the owner gave stays as it is.
export function shortName(name: string): string {
  const m = /^\d{4}-(\d{2})-(\d{2}) (\d{2}\.\d{2})( \(\d+\))?$/.exec(name);
  return m ? `${Number(m[2])} ${MONTHS[Number(m[1]) - 1]} ${m[3]}${m[4] ?? ''}` : name;
}

// Renames the folder and the session.md title. Returns the new name, or null if it is empty, unchanged or taken.
export function rename(root: string, from: string, to: string): string | null {
  const name = to.trim().replace(/[/:]/g, '-');
  if (!name || name === from || fs.existsSync(path.join(root, name))) return null;
  fs.renameSync(path.join(root, from), path.join(root, name));
  const md = path.join(root, name, 'session.md');
  fs.writeFileSync(md, fs.readFileSync(md, 'utf8').replace(/^# .*$/m, `# ${name}`));
  return name;
}

// Most recently used first; sessions never used keep list()'s newest-first order after them.
export function byLastUse(names: string[], used: Record<string, number>): string[] {
  return [...names].sort((a, b) => (used[b] ?? 0) - (used[a] ?? 0));
}

// Entry numbers in session.md, in order ("## 003 · 14:02" → 3).
export function shots(root: string, name: string): number[] {
  const md = fs.readFileSync(path.join(root, name, 'session.md'), 'utf8');
  return [...md.matchAll(/^## (\d+) · /gm)].map((m) => parseInt(m[1], 10));
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

// Replaces entry n's image and text, keeping its number and time. Returns false if the entry is gone.
export function replaceShot(root: string, name: string, n: number, png: Buffer, text: ShotText): boolean {
  const mdPath = path.join(root, name, 'session.md');
  const md = fs.readFileSync(mdPath, 'utf8');
  const at = section(md, n);
  if (!at) return false;
  const time = /^## \d+ · (.*)$/m.exec(md.slice(at[0]))![1];
  fs.writeFileSync(path.join(root, name, 'img', `${pad(n)}.png`), png);
  fs.writeFileSync(mdPath, md.slice(0, at[0]) + entry(n, time, text) + (at[1] < md.length ? '\n' + md.slice(at[1]) : ''));
  return true;
}

// ---------- Discarded: kept 7 days in <root>/.discarded/, one folder each ----------

export const KEEP_DAYS = 7;

// kind "capture": a screenshot closed without saving (image.png is the clean capture, state.json its marks).
// kind "shot": an entry removed from a session (entry.md, image.png, and original.png + state.json when kept).
export interface Discarded {
  dir: string;
  kind: 'capture' | 'shot';
  session: string;
  n?: number;
  at: number; // epoch ms
}

function discardDir(root: string, meta: Omit<Discarded, 'dir' | 'at'>): string {
  const at = Date.now();
  const d = new Date(at);
  const what = meta.kind === 'capture' ? 'not saved' : `screenshot ${meta.n}`;
  // Readable in Finder: "2026-09-26 13.05.12 · <session> · screenshot 2"
  const base = path.join(root, '.discarded', `${stamp(d)}.${two(d.getSeconds())} · ${meta.session} · ${what}`);
  let dir = base;
  for (let i = 2; fs.existsSync(dir); i++) dir = `${base} (${i})`;
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'meta.json'), JSON.stringify({ ...meta, at }));
  return dir;
}

// A screenshot closed without saving: keep the clean capture and its marks. Returns the folder.
export function discardCapture(root: string, session: string, image: string, state: string): string {
  const dir = discardDir(root, { kind: 'capture', session });
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

// Puts a removed entry back at the end of its session (recreated if it is gone). Returns its number, which is
// the old one unless that number was taken in the meantime.
export function restoreShot(root: string, d: Discarded): number {
  const dir = path.join(root, d.session);
  if (!fs.existsSync(path.join(dir, 'session.md'))) {
    fs.mkdirSync(path.join(dir, 'img'), { recursive: true });
    fs.writeFileSync(path.join(dir, 'session.md'), `# ${d.session}\n`);
  }
  const old = d.n!;
  const taken = shots(root, d.session).includes(old) || fs.existsSync(path.join(dir, 'img', `${pad(old)}.png`));
  const n = taken ? nextNumber(dir) : old;
  const text = fs
    .readFileSync(path.join(d.dir, 'entry.md'), 'utf8')
    .replace(`## ${pad(old)} · `, `## ${pad(n)} · `)
    .replace(`![Screenshot ${old}](img/${pad(old)}.png)`, `![Screenshot ${n}](img/${pad(n)}.png)`);
  fs.mkdirSync(path.join(dir, 'img'), { recursive: true });
  fs.renameSync(path.join(d.dir, 'image.png'), path.join(dir, 'img', `${pad(n)}.png`));
  if (fs.existsSync(path.join(d.dir, 'state.json')))
    saveEdit(
      root,
      d.session,
      n,
      fs.readFileSync(path.join(d.dir, 'original.png')),
      fs.readFileSync(path.join(d.dir, 'state.json'), 'utf8'),
    );
  const mdPath = path.join(dir, 'session.md');
  fs.writeFileSync(mdPath, `${fs.readFileSync(mdPath, 'utf8').trimEnd()}\n\n${text.trim()}\n`);
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
  const edit = editFiles(root, name, n);
  if (fs.existsSync(edit.json)) {
    fs.renameSync(edit.png, path.join(to, 'original.png'));
    fs.renameSync(edit.json, path.join(to, 'state.json'));
  }
  fs.writeFileSync(mdPath, (md.slice(0, start).trimEnd() + '\n' + md.slice(end).replace(/^\n+/, '\n')).replace(/\n{3,}/g, '\n\n'));
  return to;
}
