import assert from 'assert';
import fs from 'fs';
import os from 'os';
import path from 'path';
import * as sessions from '../src/sessions';

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'snapmark-test-'));
const a = sessions.create(root, 'demo');
assert.strictEqual(sessions.create(root, 'demo'), 'demo (2)'); // no clobbering
assert.deepStrictEqual(sessions.list(root), ['demo (2)', 'demo']);

assert.strictEqual(sessions.addShot(root, a, Buffer.from('x'), { caption: 'Login page', notes: ['Wrong label', ''] }), 1);
fs.rmSync(path.join(root, a, 'img', '001.png'));
assert.strictEqual(sessions.addShot(root, a, Buffer.from('y')), 2); // numbering survives deletes

const md = fs.readFileSync(path.join(root, a, 'session.md'), 'utf8');
assert.match(md, /^# demo\n/);
assert.match(md, /!\[Screenshot 1\]\(img\/001\.png\)\n\nLogin page\n\n1\. Wrong label\n2\. _\(no note\)_\n/);
assert.match(md, /img\/002\.png/);
console.log('sessions: ok');
