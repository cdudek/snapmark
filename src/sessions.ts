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
  const img = path.join(dir, 'img');
  fs.mkdirSync(img, { recursive: true });
  // Number from both session.md and img/ so a deleted image never gets its number reused.
  const existing = fs.readFileSync(path.join(dir, 'session.md'), 'utf8');
  const used = [...[...existing.matchAll(/img\/(\d+)\.png/g)].map((m) => m[1]), ...fs.readdirSync(img)];
  const n = Math.max(0, ...used.map((s) => parseInt(s, 10) || 0)) + 1;
  fs.writeFileSync(path.join(img, `${pad(n)}.png`), png);

  const time = new Date().toTimeString().slice(0, 5);
  let md = `\n## ${pad(n)} · ${time}\n\n![Screenshot ${n}](img/${pad(n)}.png)\n`;
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
  fs.appendFileSync(path.join(dir, 'session.md'), md);
  return n;
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

// Takes entry n out of session.md and moves its image to <root>/.discarded/, so it can come back.
// Returns the folder it went to, or null if there is no such entry.
export function removeShot(root: string, name: string, n: number): string | null {
  const dir = path.join(root, name);
  const mdPath = path.join(dir, 'session.md');
  const md = fs.readFileSync(mdPath, 'utf8');
  const start = md.search(new RegExp(`^## ${pad(n)} · `, 'm'));
  if (start < 0) return null;
  const next = md.slice(start + 1).search(/^## \d+ · /m);
  const end = next < 0 ? md.length : start + 1 + next;
  const to = path.join(root, '.discarded', `${Date.now()}-${name}-${pad(n)}`);
  fs.mkdirSync(to, { recursive: true });
  fs.writeFileSync(path.join(to, 'entry.md'), md.slice(start, end).trim() + '\n');
  const img = path.join(dir, 'img', `${pad(n)}.png`);
  if (fs.existsSync(img)) fs.renameSync(img, path.join(to, 'image.png'));
  fs.writeFileSync(mdPath, (md.slice(0, start).trimEnd() + '\n' + md.slice(end).replace(/^\n+/, '\n')).replace(/\n{3,}/g, '\n\n'));
  return to;
}
