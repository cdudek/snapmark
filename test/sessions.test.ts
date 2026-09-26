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

sessions.addShot(root, a, Buffer.from('z'), { cards: ['Make this\nbigger', '  '], moves: 2 });
const md3 = fs.readFileSync(path.join(root, a, 'session.md'), 'utf8');
assert.match(md3, /- Card: Make this \/ bigger\n- Moved 2 elements: the dashed outline/);
assert.ok(!md3.includes('- Card: \n'), 'blank cards are skipped');

// Menu helpers
assert.strictEqual(sessions.count(root, a), 2); // 001.png was deleted; 002 and 003 remain
assert.strictEqual(sessions.count(root, 'nope'), 0);
assert.strictEqual(sessions.shortName('2026-09-25 12.03'), '25 Sep 12.03');
assert.strictEqual(sessions.shortName('2026-01-05 09.14 (2)'), '5 Jan 09.14 (2)');
assert.strictEqual(sessions.shortName('Checkout review'), 'Checkout review');
assert.strictEqual(sessions.rename(root, 'demo (2)', '  '), null);
assert.strictEqual(sessions.rename(root, 'demo (2)', 'demo'), null); // taken
assert.strictEqual(sessions.rename(root, 'demo (2)', 'Checkout/review'), 'Checkout-review');
assert.match(fs.readFileSync(path.join(root, 'Checkout-review', 'session.md'), 'utf8'), /^# Checkout-review\n/);
assert.deepStrictEqual(sessions.byLastUse(['c', 'b', 'a'], { a: 2, b: 1 }), ['a', 'b', 'c']);

// Markdown notes that span lines stay inside their numbered item
const nm = sessions.create(root, 'md-notes');
sessions.addShot(root, nm, Buffer.from('m'), { notes: ['# Title\n\n- item\n\n**bold**', 'plain'] });
assert.match(fs.readFileSync(path.join(root, nm, 'session.md'), 'utf8'), /\n1\. # Title\n\n {3}- item\n\n {3}\*\*bold\*\*\n2\. plain\n/);
console.log('sessions: ok');
