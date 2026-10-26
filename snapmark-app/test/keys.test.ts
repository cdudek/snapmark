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

// Keys follow macOS (ADR 2026-10-25, as A4 gives them): ⌃⇧1–⌃⇧5 for ⇧⌘1–⇧⌘5, and ⌃⇧N. Replaces F1, F2, F5 and F217.
assert.deepStrictEqual(
  { ...SHORTCUTS },
  {
    newArea: 'Control+Shift+1',
    oneShot: 'Control+Shift+2',
    fullScreen: 'Control+Shift+3',
    capture: 'Control+Shift+4',
    options: 'Control+Shift+5',
    newSession: 'Control+Shift+N',
  },
  '@F1 @F3 @F4 @F5 the keys',
);
// macOS's own ⇧⌘3/4/5 are never Snapmark's; main.ts takes every global key from SHORTCUTS and registers them all
for (const f of srcFiles)
  assert.ok(!/(Command|CommandOrControl|Cmd)\+Shift\+[345]\b/.test(read(f)), `${f} registers a macOS screenshot key`);
assert.ok(!/['"]Control\+Shift\+\w['"]/.test(main), 'main.ts takes every global key from SHORTCUTS');
assert.ok(
  main.includes('Object.entries(SHORTCUTS)') && main.includes('globalShortcut.register(key, keyHandlers[name])'),
  'every key registered',
);
// What each key does: @F1 ⌃⇧1 picks a new area and captures it, @F3 ⌃⇧2 macOS's overlay in One-Shot, @F4 ⌃⇧3 every
// display, @F5 ⌃⇧4 the last area, ⌃⇧5 the capture bar (F201), ⌃⇧N a new session
const handlers = main.slice(main.indexOf('export const keyHandlers'), main.indexOf('\n};\n', main.indexOf('export const keyHandlers')));
for (const line of [
  'newArea: () => void captureArea(true),',
  "oneShot: () => void (busy() || shoot(['-i'], true)),",
  'fullScreen: () => void captureFullScreen(),',
  'capture: () => void captureArea(),',
  'options: () => void (cancelCountdown ? cancelCountdown() : openCaptureBar()),',
  'newSession: () => void (capturing() || newSession()),',
])
  assert.ok(handlers.includes(line), `keyHandlers: ${line}`);
// @F7 a New Session forgets the area, so the next ⌃⇧4 asks, saying why
const fresh = main.slice(main.indexOf('function newSession'), main.indexOf('\n}\n', main.indexOf('function newSession')));
assert.ok(fresh.includes('area = null;') && fresh.includes('areaForgotten = true;'), '@F7 newSession forgets the area');
assert.ok(main.includes("pickArea(!choose && area ? 'gone' : !choose && areaForgotten ? 'new' : '')"), '@F7 the picker says why');
const areaPage = read('src/area.ts');
assert.ok(areaPage.includes("hint.textContent = 'New session: drag the area. ⌃⇧4 captures it again. Esc cancels.'"), '@F7 hint');
assert.ok(
  read('src/area.html').includes('<div id="hint">Drag over the area to capture. ⌃⇧4 captures it again. Esc cancels.</div>'),
  '@F1 @F6 the picker hint names ⌃⇧4',
);

// @F10 busy: while a picker, countdown or capture runs, ⌃⇧1, ⌃⇧2, ⌃⇧3, ⌃⇧4 and ⌃⇧N do nothing. The open bar is busy for
// the capture keys only: its session pop-up offers New Session with ⌃⇧N.
assert.ok(main.includes('const capturing = () => picking || scrolling || shooting || counting;'), '@F10');
assert.ok(main.includes('const busy = () => capturing() || barOpen();'), '@F10');
for (const fn of ['async function captureArea', 'function captureFullScreen']) {
  const body = main.slice(main.indexOf(fn), main.indexOf('\n}\n', main.indexOf(fn)));
  assert.ok(body.includes('if (busy()) return;'), `@F10 ${fn} does nothing while busy`);
}

// F236 key groups (replaces F19): Anywhere, Capture bar, Snapmark windows, Editor and Session window, with the rows of
// spec/microcopy.md and spec/capture-and-settings.md, in order
assert.deepStrictEqual(
  KEY_GROUPS.map((g) => g.title),
  ['Anywhere', 'Capture bar', 'Snapmark windows', 'Editor', 'Session window'],
  'F236',
);
const keys = (title: string) => KEY_GROUPS.find((g) => g.title === title)!.rows.map(([k]) => k);
// @F9 the Keyboard Shortcuts window's Anywhere rows: screens.md's global keys, in its order and words; each ⌃⇧ row is a
// key in SHORTCUTS, and every key has its row. ⌃⇧5's "while recording or scrolling, Done" waits for milestones 3 and 4.
assert.deepStrictEqual(
  KEY_GROUPS[0].rows,
  [
    ['⌃⇧4', 'Capture Last Area', 'the first time, or after New Session, drag the area'],
    ['⌃⇧1', 'Capture New Area', 'drag an area, capture it, and keep it for ⌃⇧4'],
    ['⌃⇧3', 'Capture Full Screen', 'every display at once, one screenshot each'],
    ['⌃⇧2', 'Capture One-Shot', 'drag an area; not added to a session'],
    ['⌃⇧5', 'Capture Options', 'the capture bar'],
    ['⌃⇧N', 'New Session', 'also forgets the area'],
    ['↩ / Esc', 'Done / Cancel', 'while Capture Scrolling runs'],
  ],
  '@F9',
);
assert.deepStrictEqual(
  keys('Anywhere')
    .filter((k) => k.startsWith('⌃⇧'))
    .map((k) => `Control+Shift+${k.slice(2)}`)
    .sort(),
  Object.values(SHORTCUTS).sort(),
  '@F9 one row per global key',
);
// Settings ▸ Shortcuts lists the same global keys, from these rows
assert.ok(main.includes("keys: KEY_GROUPS[0].rows\n    .filter(([k]) => k.startsWith('⌃⇧'))"), '@F9 Settings ▸ Shortcuts');
// F11 the capture bar group lists 1-4 (first, before F236's rows)
assert.deepStrictEqual(
  KEY_GROUPS[1].rows,
  [
    ['1–5', 'Pick a mode', 'new area, window, full screen, last area, scrolling'],
    ['← →', 'Move between modes', 'Tab moves on to Options, Capture and Session or One-Shot'],
    ['↩ / ⌘↩', 'Capture', ''],
    ['⇧⌘O', 'Session or One-Shot', 'where the capture goes'],
    ['⇧⌘P', 'Session pop-up', 'pick the current session'],
    ['⌥O', 'Options', 'Timer and Show Mouse Pointer'],
    ['Esc', 'Close', 'also from another app while the bar is open'],
  ],
  '@F18 F236 Capture bar',
);
// @F18 the bar's controls carry the keys the group lists, in bar order: the destination row, then Esc, 1–5, Options and
// Capture
const bar = read('src/bar.html');
assert.deepStrictEqual(
  [...bar.matchAll(/aria-keyshortcuts="([^"]+)"/g)].map((m) => m[1]),
  ['Shift+Meta+O', 'Shift+Meta+O', 'Shift+Meta+P', 'Escape', '1', '2', '3', '4', '5', 'Alt+O', 'Enter Meta+Enter'],
  '@F18 the bar buttons carry the keys the group lists',
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

// F20 no old key: no screen or hint still tells the owner ⌃⇧3 captures the last area, or ⌃⇧4 drags a region
for (const f of srcFiles) assert.ok(!/⌃⇧3 captures|Capture Screenshot…/.test(read(f)), `${f} still names an old key`);

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
assert.ok(!main.includes('popOptions'), 'F201 no popup menu');
assert.ok(main.includes("loadFile(path.join(__dirname, 'bar.html'))"), 'F201 the bar is bar.html');

const setter = main.slice(main.indexOf('function setSingleKeys'), main.indexOf('\n}\n', main.indexOf('function setSingleKeys')));
assert.ok(setter.includes('shortcutsWin') && setter.includes('reload()'), 'F109 setSingleKeys redraws an open Keyboard Shortcuts window');

console.log('keys: ok');
