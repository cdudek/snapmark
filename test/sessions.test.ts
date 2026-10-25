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
assert.strictEqual(sessions.saveAsName(root, a), 'demo 004.png'); // the next entry: 001–003 are taken
assert.strictEqual(sessions.saveAsName(root, a, 2), 'demo 002.png'); // Edit Again: the entry it replaces
assert.strictEqual(sessions.rename(root, 'demo (2)', '  '), null);
assert.strictEqual(sessions.rename(root, 'demo (2)', 'demo'), null); // taken
assert.strictEqual(sessions.rename(root, 'demo (2)', 'Checkout/review'), 'Checkout-review');
assert.match(fs.readFileSync(path.join(root, 'Checkout-review', 'session.md'), 'utf8'), /^# Checkout-review\n/);
assert.deepStrictEqual(sessions.byLastUse(['c', 'b', 'a'], { a: 2, b: 1 }), ['a', 'b', 'c']);

// F1 display name: year first with a clock time, the same-minute suffix kept
assert.strictEqual(sessions.shortName('2026-10-24 23.38'), '2026-10-24, 23:38');
assert.strictEqual(sessions.shortName('2026-10-24 23.38 (2)'), '2026-10-24, 23:38 (2)');
assert.strictEqual(sessions.shortName('2026-10-24 23.38 Ledgerly Q4 review'), '2026-10-24 · Ledgerly Q4 review'); // F8
assert.strictEqual(sessions.shortName('2026-10-24 23.38 (2) Ledgerly Q4 review'), '2026-10-24 · Ledgerly Q4 review');
assert.strictEqual(sessions.namePart('2026-10-24 23.38'), ''); // F9: the rename field starts empty
assert.strictEqual(sessions.namePart('2026-10-24 23.38 (2) Ledgerly Q4 review'), 'Ledgerly Q4 review');

// F12 no stamp: a folder renamed before this change shows as it is, and keeps working
assert.strictEqual(sessions.shortName('Checkout review'), 'Checkout review');
assert.strictEqual(sessions.namePart('Checkout review'), 'Checkout review');
assert.strictEqual(sessions.renamedTo('Checkout review', ''), null); // no stamp to fall back on: "Enter a name."
assert.strictEqual(sessions.renamedTo('Checkout review', 'Checkout v2'), 'Checkout v2');

// F19 heading: session.md starts with the display name, from create and from rename
const st = sessions.create(root, '2026-10-24 23.38');
const head = (n: string) => fs.readFileSync(path.join(root, n, 'session.md'), 'utf8').split('\n')[0];
assert.strictEqual(head(st), '# 2026-10-24, 23:38');
sessions.addShot(root, st, Buffer.from('p'), { caption: 'Body stays' });

// F7 rename keeps the stamp, and its same-minute suffix
const st2 = sessions.create(root, '2026-10-24 23.38');
assert.strictEqual(st2, '2026-10-24 23.38 (2)');
assert.strictEqual(sessions.rename(root, st, 'Ledgerly Q4 review'), '2026-10-24 23.38 Ledgerly Q4 review');
assert.strictEqual(head('2026-10-24 23.38 Ledgerly Q4 review'), '# 2026-10-24 · Ledgerly Q4 review'); // F19
assert.ok(fs.readFileSync(path.join(root, '2026-10-24 23.38 Ledgerly Q4 review', 'session.md'), 'utf8').includes('Body stays'));

// F10 typed date: the typed text is the name; the session's own stamp stays in front
assert.strictEqual(sessions.rename(root, st2, '2026-10-25 Ledgerly'), '2026-10-24 23.38 (2) 2026-10-25 Ledgerly');
assert.strictEqual(sessions.shortName('2026-10-24 23.38 (2) 2026-10-25 Ledgerly'), '2026-10-24 · 2026-10-25 Ledgerly');

// F11 empty name: a named stamped session goes back to its bare stamp; an unnamed one is unchanged
assert.strictEqual(sessions.rename(root, '2026-10-24 23.38 Ledgerly Q4 review', '  '), '2026-10-24 23.38');
assert.strictEqual(head('2026-10-24 23.38'), '# 2026-10-24, 23:38');
assert.strictEqual(sessions.rename(root, '2026-10-24 23.38', ''), null);

// F19 only a title on the first line is replaced; a "# " line the owner wrote further down stays
const own = sessions.create(root, '2026-10-24 07.00');
fs.writeFileSync(path.join(root, own, 'session.md'), 'Intro\n\n# My own heading\n');
assert.strictEqual(sessions.rename(root, own, 'Mine'), '2026-10-24 07.00 Mine');
assert.strictEqual(fs.readFileSync(path.join(root, '2026-10-24 07.00 Mine', 'session.md'), 'utf8'), 'Intro\n\n# My own heading\n');

// A change of case only is a rename, not "already exists" (macOS's disk ignores case)
assert.strictEqual(sessions.rename(root, '2026-10-24 07.00 Mine', 'mine'), '2026-10-24 07.00 mine');
assert.ok(sessions.list(root).includes('2026-10-24 07.00 mine'));

// N1 no colon: in a folder from rename, or a file name from Save As…
assert.strictEqual(sessions.rename(root, '2026-10-24 23.38', 'Review: 10:30'), '2026-10-24 23.38 Review- 10-30');
assert.strictEqual(
  sessions.saveAsName(root, '2026-10-24 23.38 (2) 2026-10-25 Ledgerly'),
  '2026-10-24 23.38 (2) 2026-10-25 Ledgerly 001.png',
);
assert.strictEqual(sessions.saveAsName(root, sessions.create(root, '2026-10-24 09.14')), '2026-10-24 09.14 001.png');
assert.ok(!sessions.list(root).some((n) => n.includes(':')));

// N2 old folders untouched: listing, sorting and naming never rename a folder
const listed = sessions.list(root);
sessions.byLastUse(listed, {});
listed.forEach((n) => sessions.shortName(n));
assert.deepStrictEqual(sessions.list(root), listed);

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
assert.deepStrictEqual(sessions.shots(root, rm), [1, 2, 3]); // back in place (F119)
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

// F6 whenLabel: "Today, 22:10", "Yesterday, 18:02", "Mon, 09:41", and a year-first date once the weekday would repeat
const now = new Date(2026, 9, 25, 23, 0).getTime(); // Sun 25 Oct 2026
assert.strictEqual(sessions.whenLabel(new Date(2026, 9, 25, 22, 10).getTime(), now), 'Today, 22:10');
assert.strictEqual(sessions.whenLabel(new Date(2026, 9, 24, 18, 2).getTime(), now), 'Yesterday, 18:02');
assert.strictEqual(sessions.whenLabel(new Date(2026, 9, 19, 9, 41).getTime(), now), 'Mon, 09:41');
assert.strictEqual(sessions.whenLabel(new Date(2026, 9, 18, 9, 41).getTime(), now), '2026-10-18, 09:41');
assert.strictEqual(sessions.whenLabel(new Date(2026, 9, 24, 23, 59).getTime(), new Date(2026, 9, 25, 0, 1).getTime()), 'Yesterday, 23:59');

// olderThan: by the later of last use and session.md's last change
const stale = sessions.create(root, 'stale');
const day = 86_400_000;
fs.utimesSync(path.join(root, stale, 'session.md'), new Date(Date.now() - 90 * day), new Date(Date.now() - 90 * day));
assert.ok(sessions.olderThan(root, 60, {}).includes(stale), 'untouched for 90 days');
assert.ok(!sessions.olderThan(root, 60, { [stale]: Date.now() - 10 * day }).includes(stale), 'used 10 days ago');
assert.ok(!sessions.olderThan(root, 60, {}).includes(a), 'just written');
// F119 back in place: a removed screenshot that returns under its old number goes before the first higher number;
// when its number was taken it goes to the end under the next one, as before
const bp = sessions.create(root, 'back in place');
[1, 2, 3].forEach((i) => sessions.addShot(root, bp, Buffer.from(String(i)), { caption: `Shot ${i}` }));
sessions.removeShot(root, bp, 2);
assert.strictEqual(sessions.restoreShot(root, sessions.discardedIn(root, bp)[0]), 2, 'F119');
const bpMd = fs.readFileSync(path.join(root, bp, 'session.md'), 'utf8');
assert.deepStrictEqual(
  [...bpMd.matchAll(/^## (\d+) · /gm)].map((m) => m[1]),
  ['001', '002', '003'],
  'F119 headings in order',
);
assert.ok(bpMd.indexOf('Shot 1') < bpMd.indexOf('Shot 2') && bpMd.indexOf('Shot 2') < bpMd.indexOf('Shot 3'), 'F119 text in order');
assert.ok(!bpMd.includes('\n\n\n'), 'F119 no blank-line pile-up');
sessions.removeShot(root, bp, 3);
assert.strictEqual(sessions.addShot(root, bp, Buffer.from('n'), { caption: 'New 3' }), 3); // 3 is taken again
assert.strictEqual(sessions.restoreShot(root, sessions.discardedIn(root, bp)[0]), 4, 'F119 taken: the next number');
assert.deepStrictEqual(sessions.shots(root, bp), [1, 2, 3, 4], 'F119 taken: at the end');

// F124 bracket number refused: a name starting with "(n)" would read as the same-minute suffix
assert.strictEqual(sessions.nameProblem('(2) Ledgerly'), "A name can't start with a number in brackets, like (2).", 'F124');
assert.strictEqual(sessions.nameProblem('  (12)Ledgerly'), "A name can't start with a number in brackets, like (2).", 'F124');
assert.strictEqual(sessions.nameProblem('Ledgerly (2)'), null, 'F124');
assert.strictEqual(sessions.nameProblem('(draft) Ledgerly'), null, 'F124');
const mainSrc = fs.readFileSync(path.join(__dirname, '../../src/main.ts'), 'utf8');
// Both renames go through tryRename, which asks nameProblem first
const tryRenameSrc = mainSrc.slice(
  mainSrc.indexOf('async function tryRename'),
  mainSrc.indexOf('\n}\n', mainSrc.indexOf('async function tryRename')),
);
assert.ok(tryRenameSrc.includes('sessions.nameProblem(wanted)'), 'F124 tryRename uses nameProblem');
assert.ok(/'viewer:rename'[\s\S]{0,200}tryRename\(/.test(mainSrc), 'F124 viewer:rename uses it');
assert.ok(/function renameFromMenu[\s\S]*?tryRename\(/.test(mainSrc), 'F124 renameFromMenu uses it');

// ---------- Milestone 3: a tall screenshot is saved as its one image plus parts ----------
const tl = sessions.create(root, 'tall');
const tlImg = path.join(root, tl, 'img');
const tlMd = () => fs.readFileSync(path.join(root, tl, 'session.md'), 'utf8');
const bufs = (k: number, tag: string) => Array.from({ length: k }, (_, i) => Buffer.from(`${tag}${i + 1}`));
const names = (k: number) => Array.from({ length: k }, (_, i) => `${String(i + 1).padStart(2, '0')}.png`);
const entryOf = (md: string, n: number) => {
  const from = md.indexOf(`## ${String(n).padStart(3, '0')} · `);
  const next = md.indexOf('\n## ', from + 1);
  return md.slice(from, next < 0 ? md.length : next);
};
const linksIn = (md: string) => [...md.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g)].map((m) => ({ alt: m[1], src: m[2] }));
for (let i = 1; i <= 6; i++) sessions.addShot(root, tl, Buffer.from(`fit${i}`));
const tallText = { caption: 'Pricing table overflows.', notes: ['Cut off here', 'Should be bold'], cards: ['Bigger'], text: 'Sign in' };
assert.strictEqual(sessions.addShot(root, tl, Buffer.from('one'), tallText, bufs(11, 'p')), 7);
const seven = entryOf(tlMd(), 7);

// F1 tall entry: its parts are img/007/01.png onward, linked in order, one paragraph each
assert.deepStrictEqual(fs.readdirSync(path.join(tlImg, '007')).sort(), names(11), 'F1 tall entry: the part files');
assert.strictEqual(fs.readFileSync(path.join(tlImg, '007', '11.png'), 'utf8'), 'p11', 'F1 tall entry: in order');
assert.deepStrictEqual(
  linksIn(seven).map((l) => l.src),
  names(11).map((f) => `img/007/${f}`),
  'F1 tall entry: linked in order',
);
assert.ok(/\.png\)\n\n!\[Screenshot 7, part 2 of 11\]/.test(seven), 'F1 tall entry: one paragraph each');
assert.strictEqual(fs.readFileSync(path.join(tlImg, '007.png'), 'utf8'), 'one', 'F1 tall entry: the one image beside them');

// F6 parts line: the paragraph after the heading names the number of parts
const LINE_11 =
  'This screenshot is tall, so it comes in 11 parts. Read them top to bottom as one image; each part repeats a strip from the bottom of the part before.';
assert.strictEqual(seven.split('\n\n')[1], LINE_11, 'F6 parts line');
assert.strictEqual(sessions.partsLine(2), LINE_11.replace('11 parts', '2 parts'), 'F6 parts line with 2');

// F7 alt text: "Screenshot 7, part 1 of 11" to "Screenshot 7, part 11 of 11"
assert.deepStrictEqual(
  linksIn(seven).map((l) => l.alt),
  Array.from({ length: 11 }, (_, i) => `Screenshot 7, part ${i + 1} of 11`),
  'F7 alt text',
);

// F8 text once: comment, notes, cards and the recognised text once each, after the last part; only notes count as notes
const afterParts = seven.indexOf('img/007/11.png');
for (const s of ['Pricing table overflows.', '1. Cut off here\n2. Should be bold', '- Card: Bigger', 'Text in the screenshot']) {
  assert.strictEqual(seven.split(s).length, 2, `F8 text once: ${s}`);
  assert.ok(seven.indexOf(s) > afterParts, `F8 text once, after the last part: ${s}`);
}
assert.strictEqual(sessions.entries(tlMd()).find((e) => e.n === 7)!.notes, 2, 'F8 text once: entries() counts the notes only');
sessions.addShot(root, tl, Buffer.from('one'), { caption: 'No text found' }, bufs(2, 'n'));
assert.ok(!entryOf(tlMd(), 8).includes('<details>') && entryOf(tlMd(), 8).includes('No text found'), 'F8 text once: tall with no text');

// F11 fits unchanged: without parts, today's entry exactly, and no parts folder
const fit = sessions.create(root, 'fits');
sessions.addShot(root, fit, Buffer.from('f'), { caption: 'Fits', notes: ['a'] });
const fitMd = fs.readFileSync(path.join(root, fit, 'session.md'), 'utf8');
const fitTime = /^## 001 · (\d\d:\d\d)$/m.exec(fitMd)![1];
assert.strictEqual(fitMd, `# fits\n\n## 001 · ${fitTime}\n\n![Screenshot 1](img/001.png)\n\nFits\n\n1. a\n`, 'F11 fits unchanged');
assert.deepStrictEqual(fs.readdirSync(path.join(root, fit, 'img')), ['001.png'], 'F11 fits unchanged: no parts folder');

// F12 counted once: one fitting and one tall screenshot are 2
const both = sessions.create(root, 'counted');
sessions.addShot(root, both, Buffer.from('f'));
sessions.addShot(root, both, Buffer.from('t'), {}, bufs(3, 't'));
assert.strictEqual(sessions.count(root, both), 2, 'F12 counted once');

// F13 number kept: with img/001.png deleted and img/001/ kept, the next number is 2
const kept13 = sessions.create(root, 'kept');
sessions.addShot(root, kept13, Buffer.from('t'), {}, bufs(2, 'k'));
fs.rmSync(path.join(root, kept13, 'img', '001.png'));
fs.writeFileSync(path.join(root, kept13, 'session.md'), '# kept\n'); // no link to go by either
assert.strictEqual(sessions.addShot(root, kept13, Buffer.from('n')), 2, 'F13 number kept');

// F16 failed write: a part that cannot be written leaves session.md, the one image and the old parts as they were
const broken = [Buffer.from('a'), undefined as unknown as Buffer];
const snapshot = () =>
  JSON.stringify([
    tlMd(),
    fs.readdirSync(tlImg).sort(),
    fs.readFileSync(path.join(tlImg, '007.png'), 'utf8'),
    fs.readdirSync(path.join(tlImg, '007')).map((f) => fs.readFileSync(path.join(tlImg, '007', f), 'utf8')),
  ]);
const unchanged = snapshot();
assert.throws(() => sessions.addShot(root, tl, Buffer.from('x'), {}, broken), 'F16 failed write: Add to Session fails');
assert.strictEqual(snapshot(), unchanged, 'F16 failed write: Add to Session leaves everything, no new part file');
assert.throws(() => sessions.replaceShot(root, tl, 7, Buffer.from('y'), {}, broken), 'F16 failed write: Save changes fails');
assert.strictEqual(snapshot(), unchanged, 'F16 failed write: Save changes leaves everything, no img/007.new/');

// F15 Edit Again: 3 new parts over 11 old leave exactly 01.png to 03.png, linked; no img/007.new/ stays
assert.ok(sessions.replaceShot(root, tl, 7, Buffer.from('one again'), { caption: 'Again' }, bufs(3, 'q')), 'F15 Edit Again');
assert.deepStrictEqual(fs.readdirSync(path.join(tlImg, '007')).sort(), names(3), 'F15 Edit Again: only the new parts');
assert.strictEqual(fs.readFileSync(path.join(tlImg, '007', '01.png'), 'utf8'), 'q1', 'F15 Edit Again: the new parts');
assert.deepStrictEqual(
  linksIn(entryOf(tlMd(), 7)).map((l) => l.src),
  names(3).map((f) => `img/007/${f}`),
  'F15 Edit Again: the entry links 3',
);
assert.ok(entryOf(tlMd(), 7).includes(sessions.partsLine(3)) && !fs.existsSync(path.join(tlImg, '007.new')), 'F15 Edit Again: no .new');
assert.deepStrictEqual(sessions.shots(root, tl), [1, 2, 3, 4, 5, 6, 7, 8], 'F15 Edit Again keeps the other entries');
// Saved again so it now fits: the old parts go with it
assert.ok(sessions.replaceShot(root, tl, 8, Buffer.from('fits now'), {}));
assert.ok(!fs.existsSync(path.join(tlImg, '008')) && entryOf(tlMd(), 8).includes('![Screenshot 8](img/008.png)'), 'tall → fits');

// F17 old entry: an entry with only the one-image link gets the parts line and parts when saved again as tall
assert.ok(entryOf(tlMd(), 1).includes('![Screenshot 1](img/001.png)'));
assert.ok(sessions.replaceShot(root, tl, 1, Buffer.from('whole page'), {}, bufs(2, 'o')), 'F17 old entry');
const old17 = entryOf(tlMd(), 1);
assert.ok(
  old17.includes(sessions.partsLine(2)) &&
    linksIn(old17).map((l) => l.src).join() === 'img/001/01.png,img/001/02.png' &&
    fs.readdirSync(path.join(tlImg, '001')).length === 2,
  'F17 old entry',
);

// F18 remove: the parts go to Discarded with the screenshot, as parts/01.png onward
const rt = sessions.create(root, 'tall removed');
const rtImg = path.join(root, rt, 'img');
const rtMd = () => fs.readFileSync(path.join(root, rt, 'session.md'), 'utf8');
for (let i = 1; i <= 6; i++) sessions.addShot(root, rt, Buffer.from(`fit${i}`));
sessions.addShot(root, rt, Buffer.from('one'), { caption: 'Tall seven' }, bufs(11, 'r'));
const removed7 = sessions.removeShot(root, rt, 7)!;
assert.ok(!fs.existsSync(path.join(rtImg, '007')) && !fs.existsSync(path.join(rtImg, '007.png')), 'F18 remove: img/007/ is gone');
assert.deepStrictEqual(fs.readdirSync(path.join(removed7, 'parts')).sort(), names(11), 'F18 remove: the parts are in Discarded');
assert.strictEqual(fs.readFileSync(path.join(removed7, 'parts', '01.png'), 'utf8'), 'r1', 'F18 remove');

// F19 reopen renumbers: entry 7 removed, a new screenshot took 7, four more followed; it comes back as 12
assert.strictEqual(sessions.addShot(root, rt, Buffer.from('new7')), 7);
for (let i = 8; i <= 11; i++) sessions.addShot(root, rt, Buffer.from(`fit${i}`));
assert.strictEqual(sessions.restoreShot(root, sessions.discardedIn(root, rt)[0]), 12, 'F19 reopen renumbers: entry 12');
const twelve = entryOf(rtMd(), 12);
assert.deepStrictEqual(
  linksIn(twelve),
  names(11).map((f, i) => ({ alt: `Screenshot 12, part ${i + 1} of 11`, src: `img/012/${f}` })),
  'F19 reopen renumbers: links and alt texts',
);
assert.ok(twelve.includes(sessions.partsLine(11)) && twelve.includes('Tall seven'), 'F19 reopen renumbers: the rest of the entry');
assert.deepStrictEqual(fs.readdirSync(path.join(rtImg, '012')).sort(), names(11), 'F19 reopen renumbers: the part files');
assert.strictEqual(fs.readFileSync(path.join(rtImg, '012', '11.png'), 'utf8'), 'r11', 'F19 reopen renumbers: the same parts');
assert.ok(!fs.existsSync(path.join(rtImg, '007')) && !entryOf(rtMd(), 7).includes('part'), 'F19 the new 7 is untouched');
// Reopened under its own number, the paths stay
sessions.removeShot(root, rt, 12);
assert.strictEqual(sessions.restoreShot(root, sessions.discardedIn(root, rt)[0]), 12, 'F19 own number');
assert.ok(linksIn(entryOf(rtMd(), 12))[0].src === 'img/012/01.png' && fs.readdirSync(path.join(rtImg, '012')).length === 11, 'F19 own number');
// A leftover img/012/ alone counts as taken
sessions.removeShot(root, rt, 12);
fs.mkdirSync(path.join(rtImg, '012'));
assert.strictEqual(sessions.restoreShot(root, sessions.discardedIn(root, rt)[0]), 13, 'F19 a leftover img/012/ counts as taken');
assert.ok(linksIn(entryOf(rtMd(), 13)).every((l) => l.src.startsWith('img/013/')) && fs.readdirSync(path.join(rtImg, '013')).length === 11);

console.log('sessions: ok');
