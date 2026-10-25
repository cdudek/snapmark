import assert from 'assert';
import { execFileSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import * as sessions from '../src/sessions';
import { exportZip, sessionHtml } from '../src/exporter';

(async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'snapmark-export-'));
  const name = sessions.create(root, 'export demo');
  const dir = path.join(root, name);
  sessions.addShot(root, name, Buffer.from('png'), { caption: 'Header', notes: ['Too tall'], text: 'Sign in' });
  fs.writeFileSync(path.join(dir, `${name}.pdf`), 'old export'); // must not end up in the zip

  const zip = await exportZip(dir);
  assert.strictEqual(zip, path.join(dir, 'export demo.zip'));
  const listing = execFileSync('unzip', ['-Z1', zip], { encoding: 'utf8' }).trim().split('\n').sort();
  assert.deepStrictEqual(listing, ['img/', 'img/001.png', 'session.md']);
  await exportZip(dir); // re-export replaces, never nests
  assert.ok(!execFileSync('unzip', ['-Z1', zip], { encoding: 'utf8' }).includes('.zip'));

  const html = sessionHtml(dir);
  assert.match(html, /<h1>export demo<\/h1>/);
  assert.match(html, /<img src="img\/001\.png" alt="Screenshot 1">/);
  assert.match(html, /<li>Too tall<\/li>/);
  assert.ok(html.includes('<details><summary>Text in the screenshot</summary>') && html.includes('details { display: none; }')); // not in the PDF

  // F5 PDF heading: the display name, also for a session.md that still has its folder name on top
  const named = sessions.create(root, '2026-10-24 23.38 Ledgerly Q4 review');
  fs.writeFileSync(path.join(root, named, 'session.md'), `# ${named}\n\nSome text\n`);
  const pdfHtml = sessionHtml(path.join(root, named));
  assert.match(pdfHtml, /<h1>2026-10-24 · Ledgerly Q4 review<\/h1>/);
  assert.match(pdfHtml, /<title>2026-10-24 · Ledgerly Q4 review<\/title>/); // the PDF's own title
  assert.ok(pdfHtml.includes('Some text'));
  // Only a heading on the first line is replaced, and "$&" in a name stays as typed
  const dollar = sessions.create(root, '2026-10-24 23.39 Q4 $& costs');
  assert.match(sessionHtml(path.join(root, dollar)), /<h1>2026-10-24 · Q4 \$&amp; costs<\/h1>/);
  fs.writeFileSync(path.join(root, dollar, 'session.md'), `Intro\n\n# My own heading\n`);
  assert.match(sessionHtml(path.join(root, dollar)), /<h1>My own heading<\/h1>/);
  console.log('exporter: ok');
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
