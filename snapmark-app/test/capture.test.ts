import assert from 'assert';
import type { MenuItemConstructorOptions as Item } from 'electron';
import fs from 'fs';
import path from 'path';
import { MODES, FIRST, captureArgs, shotFiles, timed, barSize, barLabel, barOptions, checkedCapture, destMenu } from '../src/capture';
import type { OptionsActions } from '../src/capture';

const calls: string[] = [];
const a = new Proxy({} as OptionsActions, {
  get:
    (_, key) =>
    (...args: unknown[]) =>
      calls.push([String(key), ...args].join(':')),
});
const opts = (over: Partial<CaptureOpts> = {}) => barOptions({ ...FIRST, ...over }, a);
const find = (items: Item[], label: string) => {
  const i = items.find((x) => x.label === label);
  assert.ok(i, `no item "${label}"`);
  return i;
};
const shape = (items: Item[]) => items.map((i) => (i.type === 'separator' ? '—' : `${i.type ?? 'normal'} ${i.label}`));
const click = (i: Item, item: Partial<Electron.MenuItem> = {}) => i.click!(item as never, undefined, {} as never);
const area = { x: 10, y: 40.4, width: 1280, height: 720 };

// @F4 ⌃⇧3: plain `screencapture -x` with one file per display, so each display is its own screenshot, its own editor
assert.deepStrictEqual(shotFiles('/tmp/snapmark-7', 2), ['/tmp/snapmark-7-1.png', '/tmp/snapmark-7-2.png'], '@F4 one file per display');
assert.deepStrictEqual(shotFiles('/tmp/snapmark-7', 3).length, 3, '@F4');
assert.deepStrictEqual(shotFiles('/tmp/snapmark-7'), ['/tmp/snapmark-7.png'], 'one file for every other capture');
const main = fs.readFileSync(path.join(__dirname, '../../src/main.ts'), 'utf8');
assert.ok(main.includes("desk.screencapture([...args, '-x', ...files]"), '@F4 every file goes after -x');
// The keys path passes no options, so captureArgs('full') gives no arguments (asserted below)
assert.ok(
  main.includes('screen.getAllDisplays().length);') &&
    main.includes("shoot(captureArgs('full', { pointer: !!o?.pointer }), o?.oneShot, files,") &&
    main.includes('fullScreen: () => void captureFullScreen(),'),
  '@F4 no arguments, a file per display',
);

// @F15 bar order: 1 New Area, 2 Window, 3 Full Screen, 4 Last Area, 5 Scrolling, left to right after Close; bar.html
// draws them in this order with these digits (replaces F202)
assert.deepStrictEqual(
  MODES.map((m) => m.id),
  ['area', 'window', 'full', 'last', 'scroll'],
  '@F15',
);
assert.deepStrictEqual(
  MODES.map((m) => m.name),
  ['New Area', 'Window', 'Full Screen', 'Last Area', 'Scrolling'],
  '@F15',
);
const barHtml = fs.readFileSync(path.join(__dirname, '../../src/bar.html'), 'utf8');
assert.deepStrictEqual(
  [...barHtml.matchAll(/data-mode="(\w+)"[^>]*aria-label="([^"]+)"\s+aria-keyshortcuts="(\d)"/g)].map((m) => m.slice(1).join()),
  MODES.map((m, i) => `${m.id},${m.name},${i + 1}`),
  '@F15 @F18 bar.html: each mode with its name and digit',
);

// @F14 @2026-10-27-calm-style the one-row bar: 1000 pt at 100 %, wider by the zoom as far as the work area allows;
// narrow (the modes show their icons only) where that does not fit, so on a 900 pt work area at 130 % nothing clips
assert.deepStrictEqual(barSize(1440), { width: 1000, narrow: false }, '@F14');
assert.deepStrictEqual(barSize(1440, 1.3), { width: 1300, narrow: false }, '@F14 130 % on a wide display');
assert.deepStrictEqual(barSize(1048), { width: 1000, narrow: false }, '@F14 just fits');
assert.deepStrictEqual(barSize(1000), { width: 952, narrow: true }, '@F14');
assert.deepStrictEqual(barSize(900, 1.3), { width: 852, narrow: true }, '@F14 900 pt at 130 %');

// @F12 @2026-10-27-calm-style the destination pop-up: One-Shot first, checked while chosen, then the session rows it is
// given; One-Shot picked turns One-Shot on
const sessionRows: Item[] = [
  { label: 'Ledgerly Q4 review (3)', type: 'checkbox', checked: true },
  { type: 'separator' },
  { label: 'New Session' },
];
const picked: boolean[] = [];
const dests = (oneShot: boolean) => destMenu(oneShot, sessionRows, (on) => picked.push(on));
assert.deepStrictEqual(
  shape(dests(false)),
  ['checkbox One-Shot', '—', 'checkbox Ledgerly Q4 review (3)', '—', 'normal New Session'],
  '@F12',
);
assert.deepStrictEqual([dests(false)[0].checked, dests(true)[0].checked], [false, true], '@F12 One-Shot checked while chosen');
assert.deepStrictEqual([dests(false)[0].accelerator, dests(false)[0].registerAccelerator], ['Shift+Command+O', false], '@F13 ⇧⌘O shown');
click(dests(false)[0]);
assert.deepStrictEqual(picked, [true], '@F13 One-Shot picked');

// F210 screencapture arguments: each mode as its menu item did; Full Screen is ⌃⇧3's, with -C for the pointer
assert.deepStrictEqual(captureArgs('window', { pointer: false }), ['-i', '-w', '-o'], 'F210 window');
assert.deepStrictEqual(captureArgs('area', { pointer: false }, area), ['-R', '10,40,1280,720'], 'F210 area');
assert.deepStrictEqual(captureArgs('last', { pointer: false }, area), ['-R', '10,40,1280,720'], 'F210 last');
assert.deepStrictEqual(captureArgs('scroll', { pointer: false }), [], 'F210 scroll uses the picker');
assert.deepStrictEqual(captureArgs('full', { pointer: false }), [], '@F4 F210 full: no arguments');
assert.deepStrictEqual(captureArgs('full', { pointer: true }), ['-C'], 'F210 full with the pointer');
assert.throws(() => captureArgs('last', { pointer: false }, null), 'F210 an area mode needs the area');

// @F26 Options menu: Timer and Show Mouse Pointer, the current choices checked; no Save to (the bar's destination pop-up
// replaces it) and no New Session (the session pop-up has it)
assert.deepStrictEqual(
  shape(opts()),
  ['header Timer', 'radio None', 'radio 3 Seconds', 'radio 5 Seconds', 'radio 10 Seconds', '—', 'checkbox Show Mouse Pointer'],
  '@F26',
);
const checked = (items: Item[]) => items.filter((i) => i.checked).map((i) => i.label);
assert.deepStrictEqual(checked(opts()), ['None'], '@F26 first time');
assert.deepStrictEqual(checked(opts({ oneShot: true, timer: 5, pointer: true })), ['5 Seconds', 'Show Mouse Pointer'], '@F26');
assert.deepStrictEqual(checked(opts({ timer: 3 })), ['3 Seconds'], '@F26');
for (const [label, call] of [
  ['None', 'setTimer:0'],
  ['3 Seconds', 'setTimer:3'],
  ['5 Seconds', 'setTimer:5'],
  ['10 Seconds', 'setTimer:10'],
]) {
  click(find(opts(), label));
  assert.strictEqual(calls.pop(), call, `@F26 ${label}`);
}
click(find(opts(), 'Show Mouse Pointer'), { checked: true });
assert.strictEqual(calls.pop(), 'setPointer:true', '@F26');
assert.deepStrictEqual(calls, [], '@F26 nothing else');

// @F22 Capture One-Shot: the Capture button says where the capture goes (F212, CAP-5)
assert.strictEqual(barLabel({ oneShot: true }), 'Capture One-Shot', '@F22');
assert.strictEqual(barLabel({ oneShot: false }), 'Capture', '@F22');

// F215 pointer: -C in New Area, Last Area and Full Screen, never in Window
assert.deepStrictEqual(captureArgs('area', { pointer: true }, area), ['-C', '-R', '10,40,1280,720'], 'F215 area');
assert.ok(captureArgs('last', { pointer: true }, area).includes('-C'), 'F215 last');
assert.ok(!captureArgs('window', { pointer: true }).includes('-C'), 'F215 window');

// F216 CAP-6: Timer and Show Mouse Pointer greyed, never hidden, in Window and Scrolling; they keep their names
assert.deepStrictEqual(
  MODES.map((m) => timed(m.id)),
  [true, false, true, true, false],
  'F216',
);
for (const [mode, name] of [
  ['window', 'Window'],
  ['scroll', 'Scrolling'],
] as const) {
  const items = opts({ mode });
  assert.deepStrictEqual(shape(items), shape(opts()), `F216 ${mode}: the same items`);
  for (const l of ['None', '3 Seconds', '5 Seconds', '10 Seconds', 'Show Mouse Pointer'])
    assert.strictEqual(find(items, l).enabled, false, `F216 ${mode} ${l}`);
  assert.strictEqual(find(items, 'Show Mouse Pointer').sublabel, `Not for ${name}`, `F216 ${mode}`);
}
for (const mode of ['area', 'full', 'last'] as const) {
  const items = opts({ mode });
  for (const l of ['None', '3 Seconds', '5 Seconds', '10 Seconds', 'Show Mouse Pointer'])
    assert.strictEqual(find(items, l).enabled, true, `F216 ${mode} ${l}`);
  assert.strictEqual(find(items, 'Show Mouse Pointer').sublabel, undefined, `F216 ${mode}`);
}

// M2-3 checked options: what a renderer or state.json sends is kept only if valid (timer 0, 3, 5 or 10; booleans; a known
// mode)
const was: CaptureOpts = { mode: 'last', oneShot: true, timer: 5, pointer: true };
assert.deepStrictEqual(checkedCapture(undefined), FIRST, 'M2-3 no state');
assert.deepStrictEqual(
  checkedCapture({ mode: 'full', oneShot: false, timer: 3, pointer: false }, was),
  { mode: 'full', oneShot: false, timer: 3, pointer: false },
  'M2-3 valid',
);
assert.deepStrictEqual(checkedCapture({ mode: 'everything', oneShot: 1, timer: 3600, pointer: 'yes' }, was), was, 'M2-3 invalid');
assert.deepStrictEqual(checkedCapture({ timer: -5 }), FIRST, 'M2-3 negative timer');
assert.deepStrictEqual(checkedCapture({ timer: '5' }), FIRST, 'M2-3 timer string');

// @F11 while the bar is open, Esc is a global shortcut that closes it, given back when the bar closes; never in quiet
// (SNAPMARK_NO_UI) runs, so the tests never take the owner's Esc. @F12 the panel takes the key focus when it opens.
const opener = main.slice(
  main.indexOf('export function openCaptureBar'),
  main.indexOf('\n}\n', main.indexOf('export function openCaptureBar')),
);
assert.ok(opener.includes("if (!quiet) globalShortcut.register('Escape', () => barOpen() && bar!.close());"), '@F11 registered');
assert.ok(opener.includes("win.once('closed', () => quiet || globalShortcut.unregister('Escape'));"), '@F11 given back');
assert.ok(opener.includes("type: 'panel'") && /win\.show\(\);\s+win\.focus\(\);/.test(opener), '@F12 a panel, focused when shown');

// @F19 the drawn hover label is gone: no tip page, no IPC for it, nothing copies it into the build
const src = path.join(__dirname, '../../src');
assert.ok(!fs.existsSync(path.join(src, 'tip.html')) && !fs.existsSync(path.join(src, 'tip.ts')), '@F19 no tip page');
assert.ok(!/tip:show|bar:tip|barTip/.test(main + fs.readFileSync(path.join(src, 'preload.ts'), 'utf8')), '@F19 no tip IPC');
const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../../package.json'), 'utf8'));
assert.ok(!pkg.scripts.build.includes('tip.html'), '@F19 the build copies no tip page');

// @F28 the countdown page is built; @F31 while it counts, Esc is a global shortcut that cancels, given back after (never
// in quiet runs, so smoke checks ⌃⇧5 and the icon, and Esc is checked here and by hand); @F29 its panel lets clicks
// through, never takes focus and is content-protected; @F30 it is destroyed before the 200 ms wait
assert.ok(pkg.scripts.build.includes('src/countdown.html') && fs.existsSync(path.join(src, 'countdown.ts')), '@F28 countdown page');
const counter = main.slice(main.indexOf('async function countdown('), main.indexOf('\n}\n', main.indexOf('function countdownPanel(')));
assert.ok(counter.includes("if (!quiet) globalShortcut.register('Escape', cancelCountdown);"), '@F31 Esc registered');
assert.ok(counter.includes("if (!quiet) globalShortcut.unregister('Escape');"), '@F31 Esc given back');
assert.ok(main.includes('options: () => void (cancelCountdown ? cancelCountdown() : openCaptureBar())'), '@F31 ⌃⇧5 cancels');
assert.ok(main.includes("tray.on('click', iconClick);"), '@F31 the icon cancels');
assert.ok(
  [
    'focusable: false',
    'win.setIgnoreMouseEvents(true);',
    'win.setContentProtection(true);',
    "win.setAlwaysOnTop(true, 'screen-saver');",
  ].every((s) => counter.includes(s)),
  '@F29 click-through, never focused, content-protected',
);
assert.ok(/end\(\);\s+if \(!cancelled\) await new Promise\(\(r\) => setTimeout\(r, 200\)\);/.test(counter), '@F30 destroyed, then 200 ms');

console.log('capture: ok');
