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
assert.strictEqual(sessions.saveAsName(root, a), 'demo 004.png'); // the next entry: 001–003 are taken
assert.strictEqual(sessions.saveAsName(root, a, 2), 'demo 002.png'); // Edit Again: the entry it replaces
assert.strictEqual(sessions.saveAsName(root, sessions.create(root, '2026-09-25 12.03')), '25 Sep 12.03 001.png');
assert.strictEqual(sessions.rename(root, 'demo (2)', '  '), null);
assert.strictEqual(sessions.rename(root, 'demo (2)', 'demo'), null); // taken
assert.strictEqual(sessions.rename(root, 'demo (2)', 'Checkout/review'), 'Checkout-review');
assert.match(fs.readFileSync(path.join(root, 'Checkout-review', 'session.md'), 'utf8'), /^# Checkout-review\n/);
assert.deepStrictEqual(sessions.byLastUse(['c', 'b', 'a'], { a: 2, b: 1 }), ['a', 'b', 'c']);

// Markdown notes that span lines stay inside their numbered item
const nm = sessions.create(root, 'md-notes');
sessions.addShot(root, nm, Buffer.from('m'), { notes: ['# Title\n\n- item\n\n**bold**', 'plain'] });
assert.match(fs.readFileSync(path.join(root, nm, 'session.md'), 'utf8'), /\n1\. # Title\n\n {3}- item\n\n {3}\*\*bold\*\*\n2\. plain\n/);

// The text in the screenshot goes last, collapsed, as plain text; no block when there is none
const tx = sessions.create(root, 'text');
sessions.addShot(root, tx, Buffer.from('t'), { notes: ['a'], cards: ['c'], text: '1. Orders\nEmail: [redacted]\n' });
sessions.addShot(root, tx, Buffer.from('u'), { caption: 'No text', text: '  ' });
const txMd = fs.readFileSync(path.join(root, tx, 'session.md'), 'utf8');
assert.ok(
  txMd.includes(
    '1. a\n\n- Card: c\n\n<details><summary>Text in the screenshot</summary>\n\n```text\n1. Orders\nEmail: [redacted]\n```\n\n</details>\n\n## 002',
  ),
  txMd,
);
assert.ok(!txMd.slice(txMd.indexOf('## 002')).includes('<details>'));
assert.deepStrictEqual(
  sessions.entries(txMd).map((e) => e.notes),
  [1, 0],
  'a numbered line in the text is not a note',
);
assert.strictEqual(sessions.textBlock('run `npm ci` or ```x```').split('\n')[2], '````text'); // a fence longer than any in the text

// Removing a screenshot keeps the rest of session.md and moves the image aside
const rm = sessions.create(root, 'remove');
[1, 2, 3].forEach((i) => sessions.addShot(root, rm, Buffer.from(String(i)), { caption: `Shot ${i}` }));
assert.deepStrictEqual(sessions.shots(root, rm), [1, 2, 3]);
const gone = sessions.removeShot(root, rm, 2)!;
assert.deepStrictEqual(sessions.shots(root, rm), [1, 3]);
const left = fs.readFileSync(path.join(root, rm, 'session.md'), 'utf8');
assert.ok(left.includes('Shot 1') && left.includes('Shot 3') && !left.includes('Shot 2'), left);
assert.ok(!left.includes('\n\n\n'), 'no blank-line pile-up');
assert.ok(fs.existsSync(path.join(gone, 'image.png')) && fs.readFileSync(path.join(gone, 'entry.md'), 'utf8').includes('Shot 2'));
assert.ok(!fs.existsSync(path.join(root, rm, 'img', '002.png')));
assert.strictEqual(sessions.removeShot(root, rm, 9), null);
assert.ok(!sessions.list(root).includes('.discarded'), 'the discarded folder is not a session');

// Discarded folders are readable, carry their meta, and a removed entry comes back
const [gd] = sessions.discarded(root);
assert.strictEqual(gd.dir, gone);
assert.deepStrictEqual([gd.kind, gd.session, gd.n], ['shot', rm, 2]);
assert.ok(path.basename(gone).endsWith(` · ${rm} · screenshot 2`), gone);
assert.strictEqual(sessions.restoreShot(root, gd), 2);
assert.deepStrictEqual(sessions.shots(root, rm), [1, 3, 2]);
assert.ok(fs.existsSync(path.join(root, rm, 'img', '002.png')) && !fs.existsSync(gone));
assert.ok(fs.readFileSync(path.join(root, rm, 'session.md'), 'utf8').includes('Shot 2'));

// A number taken in the meantime: the entry comes back under the next free number
sessions.removeShot(root, rm, 3);
assert.strictEqual(sessions.addShot(root, rm, Buffer.from('4'), { caption: 'Shot 4' }), 3); // the freed number
const back = sessions.restoreShot(root, sessions.discarded(root)[0]);
assert.strictEqual(back, 4);
const restored = fs.readFileSync(path.join(root, rm, 'session.md'), 'utf8');
assert.ok(
  restored.includes('## 004 · ') &&
    restored.includes('![Screenshot 4](img/004.png)') &&
    fs.existsSync(path.join(root, rm, 'img', '004.png')),
);

// Edit again: the clean screenshot and state travel with the entry through remove and restore
sessions.saveEdit(root, rm, 1, Buffer.from('clean'), '{"items":[]}');
const moved = sessions.removeShot(root, rm, 1)!;
assert.ok(fs.existsSync(path.join(moved, 'original.png')) && fs.existsSync(path.join(moved, 'state.json')));
assert.strictEqual(sessions.restoreShot(root, sessions.discarded(root)[0]), 1);
assert.strictEqual(fs.readFileSync(sessions.editFiles(root, rm, 1).json, 'utf8'), '{"items":[]}');

// replaceShot keeps the number, the time and the other entries
const before = fs.readFileSync(path.join(root, rm, 'session.md'), 'utf8');
const time = /^## 002 · (.*)$/m.exec(before)![1];
assert.ok(sessions.replaceShot(root, rm, 2, Buffer.from('new'), { caption: 'Shot 2 again', notes: ['a'] }));
const after = fs.readFileSync(path.join(root, rm, 'session.md'), 'utf8');
assert.ok(after.includes(`## 002 · ${time}\n`) && after.includes('Shot 2 again') && after.includes('1. a') && !after.includes('Shot 2\n'));
assert.ok(after.includes('Shot 4') && after.includes('Shot 1') && !after.includes('\n\n\n'), after);
assert.strictEqual(fs.readFileSync(path.join(root, rm, 'img', '002.png'), 'utf8'), 'new');
assert.strictEqual(sessions.replaceShot(root, rm, 42, Buffer.from(''), {}), false);

// A capture closed without saving is kept with its marks; after 7 days it is gone
const cap = path.join(root, 'cap.png');
fs.writeFileSync(cap, 'png');
const kept = sessions.discardCapture(root, rm, cap, '{"caption":"c"}');
assert.deepStrictEqual(sessions.discarded(root)[0].kind, 'capture');
assert.ok(fs.existsSync(path.join(kept, 'image.png')) && fs.existsSync(path.join(kept, 'state.json')));
fs.mkdirSync(path.join(root, '.discarded', 'stray'));
assert.strictEqual(sessions.discarded(root, Date.now() + 8 * 86_400_000).length, 0);
assert.deepStrictEqual(fs.readdirSync(path.join(root, '.discarded')), [], 'old and stray folders are deleted');
// The session window's Discarded tab: only this session's, and they follow a rename
fs.writeFileSync(cap, 'png');
sessions.discardCapture(root, rm, cap, '{}');
const other = sessions.create(root, 'other');
sessions.addShot(root, other, Buffer.from('o'));
sessions.removeShot(root, other, 1);
assert.deepStrictEqual(
  sessions.discardedIn(root, rm).map((d) => d.kind),
  ['capture'],
);
assert.deepStrictEqual(
  sessions.discardedIn(root, other).map((d) => [d.kind, d.n]),
  [['shot', 1]],
);
assert.strictEqual(sessions.rename(root, other, 'other renamed'), 'other renamed');
assert.strictEqual(sessions.discardedIn(root, other).length, 0);
const followed = sessions.discardedIn(root, 'other renamed');
assert.strictEqual(followed.length, 1);
assert.strictEqual(sessions.restoreShot(root, followed[0]), 1); // back into the renamed folder, not a new "other"
assert.ok(!fs.existsSync(path.join(root, other)));

// Entries for the Screenshots grid: heading and note count
assert.deepStrictEqual(
  sessions.entries(
    '# s\n\n## 001 · 23:38\n\n![](img/001.png)\n\nCaption\n\n1. a\n   1. nested\n2. b\n\n- Card: c\n\n## 004 · 23:41\n\nNo notes\n',
  ),
  [
    { n: 1, heading: '001 · 23:38', notes: 2 },
    { n: 4, heading: '004 · 23:41', notes: 0 },
  ],
);

// "Today, 22:10", "Yesterday, 18:02", "Mon, 09:41", and a date once the weekday would repeat
const now = new Date(2026, 9, 25, 23, 0).getTime(); // Sun 25 Oct 2026
assert.strictEqual(sessions.whenLabel(new Date(2026, 9, 25, 22, 10).getTime(), now), 'Today, 22:10');
assert.strictEqual(sessions.whenLabel(new Date(2026, 9, 24, 18, 2).getTime(), now), 'Yesterday, 18:02');
assert.strictEqual(sessions.whenLabel(new Date(2026, 9, 19, 9, 41).getTime(), now), 'Mon, 09:41');
assert.strictEqual(sessions.whenLabel(new Date(2026, 9, 18, 9, 41).getTime(), now), '18 Oct, 09:41');
assert.strictEqual(sessions.whenLabel(new Date(2026, 9, 24, 23, 59).getTime(), new Date(2026, 9, 25, 0, 1).getTime()), 'Yesterday, 23:59');

// olderThan: by the later of last use and session.md's last change
const stale = sessions.create(root, 'stale');
const day = 86_400_000;
fs.utimesSync(path.join(root, stale, 'session.md'), new Date(Date.now() - 90 * day), new Date(Date.now() - 90 * day));
assert.ok(sessions.olderThan(root, 60, {}).includes(stale), 'untouched for 90 days');
assert.ok(!sessions.olderThan(root, 60, { [stale]: Date.now() - 10 * day }).includes(stale), 'used 10 days ago');
assert.ok(!sessions.olderThan(root, 60, {}).includes(a), 'just written');
console.log('sessions: ok');
