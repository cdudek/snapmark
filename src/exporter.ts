// Turns a session folder into something you can hand over: a ZIP (Markdown + images) or a PDF.
import { BrowserWindow } from 'electron';
import { execFile } from 'child_process';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { marked } from 'marked';
import { shortName } from './sessions';

const run = promisify(execFile);

// <session>/<name>.zip with session.md and img/ only, so earlier exports are never nested inside.
export async function exportZip(dir: string): Promise<string> {
  const out = path.join(dir, `${path.basename(dir)}.zip`);
  fs.rmSync(out, { force: true });
  await run('zip', ['-r', '-X', '-q', out, 'session.md', 'img'], { cwd: dir });
  return out;
}

export function sessionHtml(dir: string): string {
  // The first heading is the display name, also in a session.md that still starts with its folder name.
  const title = shortName(path.basename(dir)).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const body = marked
    .parse(fs.readFileSync(path.join(dir, 'session.md'), 'utf8'), { async: false })
    .replace(/<h1>[^]*?<\/h1>/, `<h1>${title}</h1>`);
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  body { font: 12pt -apple-system, system-ui, sans-serif; color: #18181b; margin: 0; }
  h1 { font-size: 20pt; margin: 0 0 12pt; }
  h2 { font-size: 13pt; margin: 22pt 0 6pt; color: #52525b; break-after: avoid; }
  img { max-width: 100%; border: 1px solid #e4e4e7; border-radius: 4px; break-inside: avoid; }
  ol { padding-left: 18pt; } li { margin: 3pt 0; }
  details { display: none; } /* the text in a screenshot is for agents; the reader has the image */
</style></head><body>${body}</body></html>`;
}

// <session>/<name>.pdf, rendered by Chromium so it matches what the Markdown shows.
export async function exportPdf(dir: string): Promise<string> {
  const out = path.join(dir, `${path.basename(dir)}.pdf`);
  const html = path.join(dir, '.snapmark-export.html'); // a file, so relative img/ paths resolve
  fs.writeFileSync(html, sessionHtml(dir));
  const win = new BrowserWindow({ show: false });
  try {
    await win.loadFile(html);
    const pdf = await win.webContents.printToPDF({ pageSize: 'A4', printBackground: true });
    fs.writeFileSync(out, pdf);
    return out;
  } finally {
    win.destroy();
    fs.rmSync(html, { force: true });
  }
}
