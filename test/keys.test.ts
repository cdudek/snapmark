import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { SHORTCUTS, KEY_GROUPS } from '../src/keys';
// tools.ts is a classic script shared with the editor page, so it has no ES export to import.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { GROUPS, capFor, tipFor, toolKey, singleKeysLine } = require('../src/tools') as {
  GROUPS: ToolGroup[];
  capFor: (g: ToolGroup, singleKeys: boolean) => string;
  tipFor: (g: ToolGroup, variant: number, singleKeys: boolean) => string;
  toolKey: (g: ToolGroup, variant: number, singleKeys: boolean) => string;
  singleKeysLine: (on: boolean) => string;
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

// F236 key groups (replaces F19): Anywhere, Capture bar, Snapmark windows, Editor and Session window, with the rows of
// spec/microcopy.md and spec/capture-and-settings.md, in order
assert.deepStrictEqual(
  KEY_GROUPS.map((g) => g.title),
  ['Anywhere', 'Capture bar', 'Snapmark windows', 'Editor', 'Session window'],
  'F236',
);
const keys = (title: string) => KEY_GROUPS.find((g) => g.title === title)!.rows.map(([k]) => k);
assert.deepStrictEqual(keys('Anywhere'), ['⌃⇧4', '⌃⇧3', '⌃⇧5', '⌃⇧N', '↩ / Esc'], 'F236');
assert.deepStrictEqual(
  KEY_GROUPS[0].rows[2],
  ['⌃⇧5', 'Capture options', 'the capture bar: window, new area, last area or scrolling, and where it goes'],
  'F236',
);
assert.deepStrictEqual(
  KEY_GROUPS[1].rows,
  [
    ['← →', 'Pick a mode', 'Tab moves on to Options and Capture'],
    ['↩', 'Capture', ''],
    ['Esc', 'Close', ''],
  ],
  'F236 Capture bar',
);
assert.deepStrictEqual(
  KEY_GROUPS[2].rows,
  [
    ['⌘,', 'Settings', ''],
    ['⌘/', 'Keyboard Shortcuts', ''],
  ],
  'F236 Snapmark windows',
);
assert.deepStrictEqual(keys('Editor'), ['Esc', '⌫', '← ↑ → ↓', '⌘A', '⌘1–⌘7', '⌘Z', '⇧⌘Z', '⌘S / ⌘↵', '⌘C / ⇧⌘C', '⇧⌘S', '⌘W'], 'F236');
assert.deepStrictEqual(keys('Session window'), ['← →', '↩', '⌘⌫', '⌘O', '⌘Z'], 'F236');
for (const g of KEY_GROUPS) for (const r of g.rows) assert.strictEqual(r.length, 3, `F236 ${r[0]}: key, name, what`);

// F229 no data URL: the Keyboard Shortcuts window is its own page, src/shortcuts.html, with KEY_GROUPS from shortcuts:init
assert.ok(!main.includes('data:text/html'), 'F229 no data: URL');
assert.ok(main.includes("loadFile(path.join(__dirname, 'shortcuts.html'))"), 'F229 loads shortcuts.html');
assert.ok(main.includes("ipcMain.handle('shortcuts:init', (): ShortcutsInit => ({ groups: KEY_GROUPS, singleKeys }))"), 'F229');
const page = read('src/shortcuts.html');
assert.ok(page.indexOf('src="tools.js"') > 0 && page.indexOf('src="tools.js"') < page.indexOf('src="shortcuts.js"'), 'F229 tools.js first');
assert.ok(page.includes("content=\"default-src 'self'; style-src 'self' 'unsafe-inline'\""), 'F229 CSP as area.html');

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
const toolKeys = (on: boolean) => GROUPS.flatMap((g) => g.tools.map((_, v) => toolKey(g, v, on)));
assert.deepStrictEqual(
  toolKeys(true),
  ['C or Esc', '1 or ⌘1', '1', '2 or ⌘2', '2', '3 or ⌘3', '4 or ⌘4', '5 or ⌘5', '5', '6 or ⌘6', '6', '7 or ⌘7', '7'],
  'F109 on',
);
assert.deepStrictEqual(
  toolKeys(false),
  ['Esc', '⌘1', '⌘1', '⌘2', '⌘2', '⌘3', '⌘4', '⌘5', '⌘5', '⌘6', '⌘6', '⌘7', '⌘7'],
  'F109 off: no bare key',
);
assert.strictEqual(singleKeysLine(true), 'Settings ▸ Shortcuts ▸ Pick tools with single keys is on: C and 1–7 pick tools too.', 'F109');
assert.strictEqual(
  singleKeysLine(false),
  'Settings ▸ Shortcuts ▸ Pick tools with single keys is off: only ⌘1–⌘7 pick tools, and Esc goes back to Select.',
  'F109',
);
const script = read('src/shortcuts.ts');
assert.ok(script.includes('toolKey(g, v, singleKeys)') && script.includes('singleKeysLine(singleKeys)'), 'F109 the window uses them');

// F201 ⌃⇧5 opens the bar: the options key opens the capture bar, and the popup menu is gone
assert.ok(main.includes('[SHORTCUTS.options, () => void openCaptureBar()]'), 'F201 ⌃⇧5 opens the bar');
assert.ok(!main.includes('popOptions'), 'F201 no popup menu');
assert.ok(main.includes("loadFile(path.join(__dirname, 'bar.html'))"), 'F201 the bar is bar.html');

// F217 keys unchanged: the bar's options never reach ⌃⇧4, ⌃⇧3 and ⌃⇧N
assert.deepStrictEqual(
  { ...SHORTCUTS },
  { capture: 'Control+Shift+4', area: 'Control+Shift+3', options: 'Control+Shift+5', newSession: 'Control+Shift+N' },
  'F217',
);
assert.ok(main.includes('[SHORTCUTS.capture, capture]'), 'F217 ⌃⇧4');
assert.ok(main.includes('[SHORTCUTS.area, () => void captureArea()]'), 'F217 ⌃⇧3 without the bar’s options');
assert.ok(main.includes('[SHORTCUTS.newSession, newSession]'), 'F217 ⌃⇧N');
assert.ok(main.includes("const capture = () => void (busy() || shoot(['-i']));"), 'F217 ⌃⇧4 is screencapture -i');

const setter = main.slice(main.indexOf('function setSingleKeys'), main.indexOf('\n}\n', main.indexOf('function setSingleKeys')));
assert.ok(setter.includes('shortcutsWin') && setter.includes('reload()'), 'F109 setSingleKeys redraws an open Keyboard Shortcuts window');

console.log('keys: ok');
