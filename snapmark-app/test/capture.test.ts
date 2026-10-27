import assert from 'assert';
import { execFileSync } from 'child_process';
import type { MenuItemConstructorOptions as Item } from 'electron';
import fs from 'fs';
import path from 'path';
import {
  MODES,
  FIRST,
  FPS,
  REC_CAP_MS,
  captureArgs,
  shotFiles,
  timed,
  barSize,
  barLabel,
  barOptions,
  barRing,
  checkedCapture,
  clock,
  contrast,
  destMenu,
  panelAt,
  recordStatus,
} from '../src/capture';
import { namePart } from '../src/sessions';
import type { OptionsActions } from '../src/capture';
import { SCRIPT, scrollArgs } from '../src/scroller';

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

// @F15 bar order: 1 New Area, 2 Window, 3 Full Screen, 4 Last Area, 5 Scrolling, left to right after Close, and @F59
// 6 Record; bar.html draws them in this order with these digits (replaces F202)
assert.deepStrictEqual(
  MODES.map((m) => m.id),
  ['area', 'window', 'full', 'last', 'scroll', 'record'],
  '@F15 @F59',
);
assert.deepStrictEqual(
  MODES.map((m) => m.name),
  ['New Area', 'Window', 'Full Screen', 'Last Area', 'Scrolling', 'Record'],
  '@F15 @F59',
);
const barTs = fs.readFileSync(path.join(__dirname, '../../src/bar.ts'), 'utf8');
assert.ok(barTs.includes("'123456'.indexOf(e.key)"), '@F59 the 6 key chooses Record');
const barHtml = fs.readFileSync(path.join(__dirname, '../../src/bar.html'), 'utf8');
assert.deepStrictEqual(
  [...barHtml.matchAll(/data-mode="(\w+)"[^>]*aria-label="([^"]+)"\s+aria-keyshortcuts="(\d)"/g)].map((m) => m.slice(1).join()),
  MODES.map((m, i) => `${m.id},${m.name},${i + 1}`),
  '@F15 @F18 bar.html: each mode with its name and digit',
);

// @F14 @F21 @2026-10-27-calm-style the one-row bar with its six modes: 1080 pt at 100 %, wider by the zoom as far as
// the work area allows; narrow (the modes show their icons only) where that does not fit, so on a 900 pt work area at
// 130 % nothing clips
assert.deepStrictEqual(barSize(1440), { width: 1080, narrow: false }, '@F14');
assert.deepStrictEqual(barSize(1512, 1.3), { width: 1404, narrow: false }, '@F14 130 % on a wide display');
assert.deepStrictEqual(barSize(1440, 1.3), { width: 1392, narrow: true }, '@F14 130 % where it does not fit');
assert.deepStrictEqual(barSize(1128), { width: 1080, narrow: false }, '@F14 just fits');
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
// @F12 @2026-10-27-calm-style the face names the session without its date, "To Ledgerly Q4 review"; the rows keep it.
// A session with only its stamp keeps the stamp
assert.strictEqual(namePart('2026-10-27 09.12 Ledgerly Q4 review'), 'Ledgerly Q4 review', '@F12 the name part');
assert.ok(main.includes('session: cur && { label: sessions.namePart(cur.name) || cur.label, count: cur.count },'), '@F12 the face');

// @F10 @N1 @2026-10-27-calm-style the ring is macOS's accent where it reaches 3:1 on the bar's material, light or dark;
// else null, and the bar rings in its text colour. Chromium's own -webkit-focus-ring-color is orange #e59700, 1.9:1
assert.strictEqual(barRing('007affff', false), '#007aff', '@F10 blue, light');
assert.strictEqual(barRing('0A84FFFF', true), '#0a84ff', '@F10 blue, dark');
assert.strictEqual(barRing('ffc600ff', false), null, '@N1 yellow on light is under 3:1');
assert.strictEqual(barRing('8c8c8cff', false), null, '@N1 graphite on light is under 3:1');
assert.strictEqual(barRing(undefined, false), null, '@F10 no accent off macOS');
assert.strictEqual(barRing('not a colour', true), null, '@F10 an unreadable accent');
assert.ok(contrast('#e59700', '#e5e5ea') < 3 && contrast('#000000', '#e5e5ea') >= 3 && contrast('#ffffff', '#1c1c1e') >= 3, '@N1');
assert.ok(main.includes("barRing(process.platform === 'darwin' ? systemPreferences.getAccentColor() : undefined"), '@F10 main');

// F210 screencapture arguments: each mode as its menu item did; Full Screen is ⌃⇧3's, with -C for the pointer
assert.deepStrictEqual(captureArgs('window', { pointer: false }), ['-i', '-w', '-o'], 'F210 window');
assert.deepStrictEqual(captureArgs('area', { pointer: false }, area), ['-R', '10,40,1280,720'], 'F210 area');
assert.deepStrictEqual(captureArgs('last', { pointer: false }, area), ['-R', '10,40,1280,720'], 'F210 last');
assert.deepStrictEqual(captureArgs('scroll', { pointer: false }), [], 'F210 scroll uses the picker');
assert.deepStrictEqual(captureArgs('full', { pointer: false }), [], '@F4 F210 full: no arguments');
assert.deepStrictEqual(captureArgs('full', { pointer: true }), ['-C'], 'F210 full with the pointer');
assert.throws(() => captureArgs('last', { pointer: false }, null), 'F210 an area mode needs the area');

// @F26 Options menu: Timer and Show Mouse Pointer, the current choices checked; no Save to (the bar's destination pop-up
// replaces it) and no New Session (the session pop-up has it). @F60 Frame Rate comes first: 15, 10, 5, 4, 2 fps
assert.deepStrictEqual(
  shape(opts()),
  [
    'header Frame Rate',
    'radio 15 fps',
    'radio 10 fps',
    'radio 5 fps',
    'radio 4 fps',
    'radio 2 fps',
    '—',
    'header Timer',
    'radio None',
    'radio 3 Seconds',
    'radio 5 Seconds',
    'radio 10 Seconds',
    '—',
    'checkbox Show Mouse Pointer',
  ],
  '@F26 @F60',
);
const checked = (items: Item[]) => items.filter((i) => i.checked).map((i) => i.label);
assert.deepStrictEqual(checked(opts()), ['10 fps', 'None'], '@F26 @F60 first time: 10 fps');
assert.deepStrictEqual(checked(opts({ oneShot: true, timer: 5, pointer: true })), ['10 fps', '5 Seconds', 'Show Mouse Pointer'], '@F26');
assert.deepStrictEqual(checked(opts({ timer: 3, fps: 15 })), ['15 fps', '3 Seconds'], '@F26 @F60');
// @F60 Frame Rate is greyed unless Record is chosen, and keeps its names
const rates = (items: Item[]) => items.filter((i) => / fps$/.test(i.label ?? ''));
assert.deepStrictEqual(FPS, [15, 10, 5, 4, 2], '@F60');
assert.strictEqual(FIRST.fps, 10, '@F60 10 by default');
for (const m of MODES)
  assert.ok(
    rates(opts({ mode: m.id })).every((i) => i.enabled === (m.id === 'record')),
    `@F60 ${m.id}`,
  );
for (const f of FPS) {
  click(find(opts({ mode: 'record' }), `${f} fps`));
  assert.strictEqual(calls.pop(), `setFps:${f}`, `@F60 ${f} fps`);
}
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
assert.strictEqual(barLabel({ mode: 'area', oneShot: true }), 'Capture One-Shot', '@F22');
assert.strictEqual(barLabel({ mode: 'area', oneShot: false }), 'Capture', '@F22');
// @2026-10-27-calm-style and follows the mode (spec screens.md): Start Scrolling, Record; One-Shot still says One-Shot
assert.deepStrictEqual(
  MODES.map((m) => barLabel({ mode: m.id, oneShot: false })),
  ['Capture', 'Capture', 'Capture', 'Capture', 'Start Scrolling', 'Record'],
  'Capture follows the mode',
);
assert.strictEqual(barLabel({ mode: 'scroll', oneShot: true }), 'Capture One-Shot', '@F22 One-Shot in Scrolling');
assert.strictEqual(barLabel({ mode: 'record', oneShot: true }), 'Capture One-Shot', '@F22 One-Shot in Record');

// F215 pointer: -C in New Area, Last Area and Full Screen, never in Window
assert.deepStrictEqual(captureArgs('area', { pointer: true }, area), ['-C', '-R', '10,40,1280,720'], 'F215 area');
assert.ok(captureArgs('last', { pointer: true }, area).includes('-C'), 'F215 last');
assert.ok(!captureArgs('window', { pointer: true }).includes('-C'), 'F215 window');

// F216 CAP-6: Timer and Show Mouse Pointer greyed, never hidden, in Window and Scrolling; they keep their names
assert.deepStrictEqual(
  MODES.map((m) => timed(m.id)),
  [true, false, true, true, false, true],
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
// Record takes the Timer (a countdown longer than 3); macOS's screen capture draws the pointer, so the option is not Record's
const recItems = opts({ mode: 'record' });
for (const l of ['None', '3 Seconds', '5 Seconds', '10 Seconds']) assert.strictEqual(find(recItems, l).enabled, true, `Record ${l}`);
assert.strictEqual(find(recItems, 'Show Mouse Pointer').enabled, false, 'Record: no pointer option');
assert.strictEqual(find(recItems, 'Show Mouse Pointer').sublabel, 'Not for Record', 'Record: no pointer option');

// M2-3 checked options: what a renderer or state.json sends is kept only if valid (timer 0, 3, 5 or 10; booleans; a known
// mode)
const was: CaptureOpts = { mode: 'last', oneShot: true, timer: 5, pointer: true, fps: 5 };
assert.deepStrictEqual(checkedCapture(undefined), FIRST, 'M2-3 no state');
assert.deepStrictEqual(
  checkedCapture({ mode: 'record', oneShot: false, timer: 3, pointer: false, fps: 15 }, was),
  { mode: 'record', oneShot: false, timer: 3, pointer: false, fps: 15 },
  'M2-3 valid',
);
assert.deepStrictEqual(checkedCapture({ mode: 'everything', oneShot: 1, timer: 3600, pointer: 'yes', fps: 60 }, was), was, 'M2-3 invalid');
assert.deepStrictEqual(
  checkedCapture({ mode: 'area', oneShot: false, timer: 0, pointer: false }),
  FIRST,
  'M2-3 a state from before Record: 10 fps',
);
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
assert.ok(
  main.includes(
    'void (stopRecording ? stopRecording(true) : doneScrolling ? doneScrolling() : cancelCountdown ? cancelCountdown() : openCaptureBar())',
  ),
  '@F31 ⌃⇧5 cancels; @F66 @F88 while recording or scrolling it is Done',
);
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

// @F62 Record counts 3, 2, 1, or the Timer's when longer, as "Recording starts in 3 seconds", then records at the
// chosen frame rate; @F61 after the picker on the last area, whose ↩ keeps it
const recorder = main.slice(main.indexOf('async function captureRecord('), main.indexOf('\n}\n', main.indexOf('function recordPanel(')));
assert.ok(recorder.includes('if (!(await countdown(Math.max(3, o.timer), area, true))) return;'), '@F62 a countdown of 3 first');
assert.ok(recorder.includes('const r = await recordArea(area, o);'), '@F62 then the recording, at o.fps');
assert.ok(recorder.includes("pickArea(area && !keep ? 'gone' : 'record', keep)"), '@F61 the picker shows the last area');
const countdownTs = fs.readFileSync(path.join(src, 'countdown.ts'), 'utf8');
assert.ok(countdownTs.includes("`${q.has('rec') ? 'Recording starts' : 'Capture'} in ${s} seconds. Esc cancels.`"), '@F62 its words');
const areaTs = fs.readFileSync(path.join(src, 'area.ts'), 'utf8');
assert.ok(
  areaTs.includes("'↩ records this area. Drag to choose another. Esc cancels.'") &&
    areaTs.includes("'Drag over the area to record. Esc cancels.'") &&
    areaTs.includes("if (e.key === 'Enter' && kept && box.classList.contains('kept')) window.snapmark.areaDone(kept);"),
  '@F61 ↩ keeps the area; a drag replaces it',
);
// @F63 the clock: "0:07 of 0:30 · 10 fps", and "0:07" beside the menu bar icon
assert.strictEqual(recordStatus(7400, 10), '0:07 of 0:30 · 10 fps', '@F63');
assert.strictEqual(recordStatus(0, 15), '0:00 of 0:30 · 15 fps', '@F63');
assert.strictEqual(clock(65_000), '1:05', '@F63');
// @F63 the panel sits outside the area: 16 pt below, centred; else above; else at the display's bottom edge beside the
// area; else inside its bottom edge
const wa = { x: 0, y: 25, width: 1440, height: 875 };
const at = (a: Area) => panelAt(a, wa, 600, 64);
assert.deepStrictEqual(at({ x: 400, y: 100, width: 400, height: 300 }), { x: 300, y: 416, width: 600, height: 64 }, '@F63 below');
assert.deepStrictEqual(at({ x: 400, y: 500, width: 400, height: 380 }), { x: 300, y: 420, width: 600, height: 64 }, '@F63 above');
assert.deepStrictEqual(at({ x: 0, y: 25, width: 700, height: 875 }), { x: 716, y: 820, width: 600, height: 64 }, '@F63 beside');
assert.deepStrictEqual(at({ x: 0, y: 25, width: 1440, height: 875 }), { x: 420, y: 820, width: 600, height: 64 }, '@F63 inside');
assert.deepStrictEqual(at({ x: 1300, y: 100, width: 100, height: 100 }), { x: 840, y: 216, width: 600, height: 64 }, '@F63 on screen');
// @F64 a recording lasts 30 s at most, then stops as Done does
assert.strictEqual(REC_CAP_MS, 30_000, '@F64');
assert.ok(recorder.includes("if (ms >= cap) return finish('done');") && recorder.includes("if (t >= cap) return finish('done');"), '@F64');
// @F65 no key is taken while recording: the recording code registers no shortcut, and its panel never takes focus
assert.ok(!recorder.includes('globalShortcut'), '@F65 no global key');
assert.ok(recorder.includes('focusable: false') && recorder.includes('win.showInactive()'), '@F65 the panel never takes focus');
const scrollTs = fs.readFileSync(path.join(src, 'scroll.ts'), 'utf8');
assert.ok(
  scrollTs.includes('if (!recording)') && scrollTs.includes("location.hash === '#record'"),
  '@F65 the recording control handles no key',
);
// @F66 Done, ⌃⇧5 and the menu bar icon stop and keep; @F67 ⓧ puts the frames in Discarded
assert.ok(main.includes('export const iconClick = () =>\n  stopRecording ? stopRecording(true) :'), '@F66 the icon is Done');
assert.ok(recorder.includes("finish(ok ? 'done' : 'cancel')") && recorder.includes('sessions.discardRecording(root, session, r);'), '@F67');
// @F68 the outline and the panel are content-protected, and the recorder page never shows
assert.ok(recorder.includes('parts.push(countdownPanel(0, a));') && recorder.includes('win.setContentProtection(true);'), '@F68');
assert.ok(/rec = new BrowserWindow\(\{\s+show: false,/.test(recorder) && !/rec\.show/.test(recorder), '@F68 the recorder never shows');
// @F81 a failed grab stops, keeps nothing and says so
assert.ok(
  recorder.includes("notify(`Recording failed: ${how.failed.replace(/\\.$/, '')}. Nothing was added. Click to try again.`"),
  '@F81 the words',
);
// The recorder page is built; each frame is written to its own file as it comes, never held (plan, Risks)
assert.ok(pkg.scripts.build.includes('src/recorder.html') && fs.existsSync(path.join(src, 'recorder.ts')), 'recorder page');
assert.ok(recorder.includes('.then(() => fs.promises.writeFile(file, png))'), 'a file per frame, at once, in order, off the main thread');

// @F82 on a display left of or above the main one the points are negative: they reach the script as numbers, not as
// osascript options ("illegal option -- 1"). The event is built and read back, never posted.
const scrollArgv = scrollArgs(-1440, -20, 300.4);
assert.deepStrictEqual(scrollArgv.slice(4), ['--', '-1440', '-20', '300'], '@F82 `--` before the numbers');
if (process.platform === 'darwin') {
  const readBack = SCRIPT.replace(
    '$.CGEventPost(0, e);',
    'const p = $.CGEventGetLocation(e); return JSON.stringify([p.x, p.y, Number($.CGEventGetIntegerValueField(e, 96))]);',
  );
  assert.notStrictEqual(readBack, SCRIPT, 'the read-back replaces the post');
  const argv = scrollArgv.map((a) => (a === SCRIPT ? readBack : a));
  assert.deepStrictEqual(JSON.parse(execFileSync('osascript', argv, { encoding: 'utf8' })), [-1440, -20, -300], '@F82 negative x, y');
}

console.log('capture: ok');
