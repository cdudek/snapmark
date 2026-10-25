import assert from 'assert';
import type { MenuItemConstructorOptions as Item } from 'electron';
import { MODES, FIRST, captureArgs, appliesToArea, barLabel, barOptions } from '../src/capture';
import type { OptionsActions, OptionsState } from '../src/capture';

const calls: string[] = [];
const a = new Proxy({} as OptionsActions, {
  get:
    (_, key) =>
    (...args: unknown[]) =>
      calls.push([String(key), ...args].join(':')),
});
const base: OptionsState = { ...FIRST, session: '2026-10-25 · Ledgerly', newSession: 'Control+Shift+N' };
const opts = (over: Partial<OptionsState> = {}) => barOptions({ ...base, ...over }, a);
const find = (items: Item[], label: string) => {
  const i = items.find((x) => x.label === label);
  assert.ok(i, `no item "${label}"`);
  return i;
};
const click = (i: Item, item: Partial<Electron.MenuItem> = {}) => i.click!(item as never, undefined, {} as never);
const area = { x: 10, y: 40.4, width: 1280, height: 720 };

// F202 bar order: the four modes, left to right after Close
assert.deepStrictEqual(
  MODES.map((m) => m.id),
  ['window', 'area', 'last', 'scroll'],
  'F202',
);
assert.deepStrictEqual(
  MODES.map((m) => m.name),
  ['Capture Window', 'Choose New Area', 'Capture Last Area', 'Capture Scrolling'],
  'F202',
);

// F210 screencapture arguments: each mode as its menu item did
assert.deepStrictEqual(captureArgs('window', { pointer: false }), ['-i', '-w', '-o'], 'F210 window');
assert.deepStrictEqual(captureArgs('area', { pointer: false }, area), ['-R', '10,40,1280,720'], 'F210 area');
assert.deepStrictEqual(captureArgs('last', { pointer: false }, area), ['-R', '10,40,1280,720'], 'F210 last');
assert.deepStrictEqual(captureArgs('scroll', { pointer: false }), [], 'F210 scroll uses the picker');
assert.throws(() => captureArgs('last', { pointer: false }, null), 'F210 an area mode needs the area');

// F211 Options menu: Save to, Timer, Show Mouse Pointer, the current choices checked
const shape = (items: Item[]) => items.map((i) => (i.type === 'separator' ? '—' : `${i.type ?? 'normal'} ${i.label}`));
assert.deepStrictEqual(
  shape(opts()),
  [
    'header Save to',
    'radio Current Session',
    'radio One-Shot',
    'normal New Session',
    '—',
    'header Timer',
    'radio None',
    'radio 5 Seconds',
    'radio 10 Seconds',
    '—',
    'header Options',
    'checkbox Show Mouse Pointer',
  ],
  'F211',
);
assert.strictEqual(find(opts(), 'Current Session').sublabel, '2026-10-25 · Ledgerly', 'F211 the session it goes to');
assert.strictEqual(find(opts({ session: null }), 'Current Session').sublabel, 'A new session starts', 'F211');
assert.strictEqual(find(opts(), 'One-Shot').sublabel, 'Beautify, then copy or save', 'F211');
const checked = (items: Item[]) => items.filter((i) => i.checked).map((i) => i.label);
assert.deepStrictEqual(checked(opts()), ['Current Session', 'None'], 'F211 first time');
assert.deepStrictEqual(checked(opts({ oneShot: true, timer: 5, pointer: true })), ['One-Shot', '5 Seconds', 'Show Mouse Pointer'], 'F211');
assert.deepStrictEqual(checked(opts({ timer: 10 })), ['Current Session', '10 Seconds'], 'F211');
for (const [label, call] of [
  ['Current Session', 'setOneShot:false'],
  ['One-Shot', 'setOneShot:true'],
  ['None', 'setTimer:0'],
  ['5 Seconds', 'setTimer:5'],
  ['10 Seconds', 'setTimer:10'],
]) {
  click(find(opts(), label));
  assert.strictEqual(calls.pop(), call, `F211 ${label}`);
}
click(find(opts(), 'Show Mouse Pointer'), { checked: true });
assert.strictEqual(calls.pop(), 'setPointer:true', 'F211');

// F212 Capture One-Shot: the Capture button says where the capture goes
assert.strictEqual(barLabel({ oneShot: true }), 'Capture One-Shot', 'F212');
assert.strictEqual(barLabel({ oneShot: false }), 'Capture', 'F212');

// F213 New Session: starts one as ⌃⇧N does, and nothing else (the bar stays open)
const fresh = find(opts(), 'New Session');
assert.strictEqual(fresh.accelerator, 'Control+Shift+N', 'F213 shows ⌃⇧N');
assert.strictEqual(fresh.registerAccelerator, false, 'F213 the global key is main.ts’s, not the menu’s');
assert.strictEqual(find(opts({ newSession: null }), 'New Session').accelerator, undefined, 'F213');
click(fresh);
assert.deepStrictEqual(calls.splice(0), ['newSession'], 'F213 no close');

// F215 pointer: -C in Choose New Area and Capture Last Area, never in Capture Window
assert.deepStrictEqual(captureArgs('area', { pointer: true }, area), ['-C', '-R', '10,40,1280,720'], 'F215 area');
assert.ok(captureArgs('last', { pointer: true }, area).includes('-C'), 'F215 last');
assert.ok(!captureArgs('window', { pointer: true }).includes('-C'), 'F215 window');

// F216 areas only: Timer and Show Mouse Pointer greyed in Capture Window and Capture Scrolling
assert.deepStrictEqual(
  MODES.map((m) => appliesToArea(m.id)),
  [false, true, true, false],
  'F216',
);
for (const mode of ['window', 'scroll'] as const) {
  const items = opts({ mode });
  assert.ok(items.some((i) => i.type === 'header' && i.label === 'Timer (areas only)'), `F216 ${mode} header`);
  for (const l of ['None', '5 Seconds', '10 Seconds', 'Show Mouse Pointer']) assert.strictEqual(find(items, l).enabled, false, `F216 ${mode} ${l}`);
  assert.strictEqual(find(items, 'Show Mouse Pointer').sublabel, 'Areas only', `F216 ${mode}`);
  for (const l of ['Current Session', 'One-Shot', 'New Session']) assert.notStrictEqual(find(items, l).enabled, false, `F216 ${mode} ${l}`);
}
for (const mode of ['area', 'last'] as const) {
  const items = opts({ mode });
  for (const l of ['None', '5 Seconds', '10 Seconds', 'Show Mouse Pointer']) assert.strictEqual(find(items, l).enabled, true, `F216 ${mode} ${l}`);
  assert.strictEqual(find(items, 'Show Mouse Pointer').sublabel, undefined, `F216 ${mode}`);
}

console.log('capture: ok');
