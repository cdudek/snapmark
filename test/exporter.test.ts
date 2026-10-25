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

  // F22 PDF one image: a tall entry prints its one image, without its parts or the parts line, also after a hand edit
  const tall = sessions.create(root, 'tall export');
  const tallDir = path.join(root, tall);
  const parts = [1, 2, 3].map((i) => Buffer.from(`part${i}`));
  sessions.addShot(root, tall, Buffer.from('one'), { caption: 'Long page', notes: ['Here'] }, parts);
  const oneImageOnly = (html: string, why: string) => {
    const imgs = [...html.matchAll(/<img [^>]*>/g)].map((m) => m[0]);
    assert.deepStrictEqual(imgs, ['<img src="img/001.png" alt="Screenshot 1">'], `${why}: one image tag`);
    assert.ok(!html.includes('img/001/') && !html.includes('This screenshot is tall'), `${why}: no parts, no parts line`);
    assert.ok(html.includes('Long page') && html.includes('<li>Here</li>'), `${why}: the rest of the entry`);
  };
  oneImageOnly(sessionHtml(tallDir), 'F22 PDF one image');
  const md = fs.readFileSync(path.join(tallDir, 'session.md'), 'utf8');
  fs.writeFileSync(
    path.join(tallDir, 'session.md'),
    md
      .replace('](img/001/01.png)\n\n', '](img/001/01.png)\n') // two parts in one paragraph
      .replace('Screenshot 1, part 3 of 3', 'the bottom') // an alt text rewritten
      .replace('Long page', 'Long page, edited'),
  );
  oneImageOnly(sessionHtml(tallDir), 'F22 PDF one image after a hand edit');

  // F23 ZIP parts: session.md, the one image and every part
  const tallZip = execFileSync('unzip', ['-Z1', await exportZip(tallDir)], { encoding: 'utf8' }).trim().split('\n');
  for (const f of ['session.md', 'img/001.png', 'img/001/01.png', 'img/001/02.png', 'img/001/03.png'])
    assert.ok(tallZip.includes(f), `F23 ZIP parts: ${f}`);
  console.log('exporter: ok');
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
