import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { SHORTCUTS, KEY_GROUPS, shortcutsHtml } from '../src/keys';
// tools.ts is a classic script shared with the editor page, so it has no ES export to import.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { GROUPS, capFor, tipFor } = require('../src/tools') as {
  GROUPS: ToolGroup[];
  capFor: (g: ToolGroup, singleKeys: boolean) => string;
  tipFor: (g: ToolGroup, variant: number, singleKeys: boolean) => string;
};

const root = path.join(__dirname, '../..');
const read = (f: string) => fs.readFileSync(path.join(root, f), 'utf8');
const srcFiles = fs.readdirSync(path.join(root, 'src')).map((f) => `src/${f}`);
const main = read('src/main.ts');

// F1 capture key: ⌃⇧4, like macOS's ⇧⌘4
assert.strictEqual(SHORTCUTS.capture, 'Control+Shift+4');
assert.ok(main.includes('SHORTCUTS.capture'), 'main.ts registers the capture key from SHORTCUTS');

// F2 unchanged keys: ⌃⇧3 Capture Last Area, ⌃⇧N New Session; ⌃⇧5 the capture options
assert.strictEqual(SHORTCUTS.area, 'Control+Shift+3');
assert.strictEqual(SHORTCUTS.newSession, 'Control+Shift+N');
assert.strictEqual(SHORTCUTS.options, 'Control+Shift+5');
for (const k of ['area', 'newSession', 'options']) assert.ok(main.includes(`SHORTCUTS.${k}`), `main.ts registers SHORTCUTS.${k}`);

// F5 freed keys: ⌃⇧1 is no longer Snapmark's, and macOS's own ⇧⌘3/4/5 never were
for (const f of srcFiles) {
  const s = read(f);
  assert.ok(!/Control\+Shift\+1\b/.test(s), `${f} names Control+Shift+1`);
  assert.ok(!/(Command|CommandOrControl|Cmd)\+Shift\+[345]\b/.test(s), `${f} registers a macOS screenshot key`);
}
assert.ok(!/['"]Control\+Shift\+\w['"]/.test(main), 'main.ts takes every global key from SHORTCUTS');

// F19 key list: three groups by where the key works, in the rows of spec/microcopy.md
assert.deepStrictEqual(
  KEY_GROUPS.map((g) => g.title),
  ['Anywhere', 'Editor', 'Session window'],
);
const keys = (title: string) => KEY_GROUPS.find((g) => g.title === title)!.rows.map(([k]) => k);
assert.deepStrictEqual(keys('Anywhere'), ['⌃⇧4', '⌃⇧3', '⌃⇧5', '⌃⇧N', '↩ / Esc']);
assert.deepStrictEqual(keys('Editor'), ['Esc', '⌫', '← ↑ → ↓', '⌘A', '⌘1–⌘7', '⌘Z', '⇧⌘Z', '⌘S / ⌘↵', '⌘C / ⇧⌘C', '⇧⌘S', '⌘W']);
assert.deepStrictEqual(keys('Session window'), ['← →', '↩', '⌘⌫', '⌘O', '⌘Z']);
for (const g of KEY_GROUPS) for (const r of g.rows) assert.strictEqual(r.length, 3, `${r[0]}: key, name, what`);
assert.ok(main.includes('shortcutsHtml(TOOLS'), 'the Keyboard Shortcuts window renders shortcutsHtml');
assert.ok(shortcutsHtml(GROUPS, true).includes('<h2>Session window</h2>'), 'the Keyboard Shortcuts window renders KEY_GROUPS');

// F20 no old key: no screen, hint or doc still tells the owner to press ⌃⇧1
for (const f of [...srcFiles, 'README.md', 'docs/ux/setup.md']) assert.ok(!read(f).includes('⌃⇧1'), `${f} still names ⌃⇧1`);

// F103 captions: ⌘1 to ⌘7 under groups 1 to 7, whatever the Single-Key Tools setting
for (const on of [true, false])
  assert.deepStrictEqual(
    GROUPS.slice(1).map((g) => capFor(g, on)),
    ['⌘1', '⌘2', '⌘3', '⌘4', '⌘5', '⌘6', '⌘7'],
    `F103 captions, single keys ${on ? 'on' : 'off'}`,
  );
assert.strictEqual(GROUPS.length, 8, 'F103 eight groups');

// F104 Select caption: "C" while Single-Key Tools is on, "Esc" while it is off
assert.strictEqual(capFor(GROUPS[0], true), 'C', 'F104');
assert.strictEqual(capFor(GROUPS[0], false), 'Esc', 'F104');

// F105 tooltips: the tool, every key that picks it in the current mode, and the group's other tool (spec.md Words)
const tips = (on: boolean) => GROUPS.flatMap((g) => g.tools.map((_, v) => tipFor(g, v, on)));
assert.deepStrictEqual(tips(true), [
  'Select (C or Esc): click a mark to move, resize or delete it (⌫)',
  'Reference (1 or ⌘1) · press again for Card',
  'Card (1 or ⌘1) · press again for Reference',
  'Box (2 or ⌘2) · press again for Ellipse',
  'Ellipse (2 or ⌘2) · press again for Box',
  'Arrow (3 or ⌘3)',
  'Pen (4 or ⌘4)',
  'Cross (5 or ⌘5) · press again for Remove area',
  'Remove area (5 or ⌘5) · press again for Cross',
  'Highlighter (6 or ⌘6) · press again for Spotlight',
  'Spotlight (6 or ⌘6) · press again for Highlighter',
  'Cut & move (7 or ⌘7) · press again for Redact',
  'Redact (7 or ⌘7): pixelate to hide private details · press again for Cut & move',
]);
assert.deepStrictEqual(tips(false), [
  'Select (Esc): click a mark to move, resize or delete it (⌫)',
  'Reference (⌘1) · press ⌘1 again for Card',
  'Card (⌘1) · press ⌘1 again for Reference',
  'Box (⌘2) · press ⌘2 again for Ellipse',
  'Ellipse (⌘2) · press ⌘2 again for Box',
  'Arrow (⌘3)',
  'Pen (⌘4)',
  'Cross (⌘5) · press ⌘5 again for Remove area',
  'Remove area (⌘5) · press ⌘5 again for Cross',
  'Highlighter (⌘6) · press ⌘6 again for Spotlight',
  'Spotlight (⌘6) · press ⌘6 again for Highlighter',
  'Cut & move (⌘7) · press ⌘7 again for Redact',
  'Redact (⌘7): pixelate to hide private details · press ⌘7 again for Cut & move',
]);

// F109 shortcuts window: the tool keys of the current mode and a line naming the setting; an open window redraws
const on = shortcutsHtml(GROUPS, true);
const off = shortcutsHtml(GROUPS, false);
assert.ok(on.includes('<kbd>1 or ⌘1</kbd>') && on.includes('<kbd>C or Esc</kbd>') && on.includes('<kbd>1 again</kbd>'), 'F109 on');
assert.ok(on.includes('Settings ▸ Single-Key Tools is on: C and 1–7 pick tools too.'), 'F109 on line');
assert.ok(off.includes('<kbd>⌘1</kbd>') && off.includes('<kbd>Esc</kbd>') && off.includes('<kbd>⌘1 again</kbd>'), 'F109 off');
assert.ok(off.includes('Settings ▸ Single-Key Tools is off: only ⌘1–⌘7 pick tools, and Esc goes back to Select.'), 'F109 off line');
assert.ok(!off.includes('<kbd>1</kbd>') && !off.includes('<kbd>C'), 'F109 off: no bare key');
// F19 rows (snap-c5c): every row of the key list is in the window, with its key, name and what, in order
let from = 0;
for (const g of KEY_GROUPS)
  for (const [k, n, w] of g.rows) {
    const at = on.indexOf(`<tr><td><kbd>${k}</kbd></td><td></td><td><b>${n}</b></td><td>${w}</td></tr>`, from);
    assert.ok(at >= from, `F19 row ${k} ${n}`);
    from = at;
  }
const setter = main.slice(main.indexOf('function setSingleKeys'), main.indexOf('\n}\n', main.indexOf('function setSingleKeys')));
assert.ok(setter.includes('shortcutsWin') && setter.includes('loadURL'), 'F109 setSingleKeys redraws an open Keyboard Shortcuts window');

console.log('keys: ok');
