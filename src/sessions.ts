// Session = a folder under root holding session.md and img/NNN.png.
import fs from 'fs';
import path from 'path';

export interface ShotText {
  caption?: string;
  notes?: string[];
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
export function addShot(root: string, name: string, png: Buffer, { caption = '', notes = [] }: ShotText = {}): number {
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
  const refs = notes.map((t, i) => `${i + 1}. ${t.trim() || '_(no note)_'}`);
  if (refs.length) md += `\n${refs.join('\n')}\n`;
  fs.appendFileSync(path.join(dir, 'session.md'), md);
  return n;
}
