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
  sessions.addShot(root, name, Buffer.from('png'), { caption: 'Header', notes: ['Too tall'] });
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
  console.log('exporter: ok');
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
