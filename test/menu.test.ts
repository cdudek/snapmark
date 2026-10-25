import assert from 'assert';
import fs from 'fs';
import path from 'path';
import type { MenuItemConstructorOptions as Item } from 'electron';
import { menuTemplate, loginState, MenuActions, MenuState, MAX_LISTED } from '../src/menu';

const calls: string[] = [];
const a = new Proxy({} as MenuActions, {
  get:
    (_, key) =>
    (...args: unknown[]) =>
      calls.push([String(key), ...args].join(':')),
});
const base: MenuState = {
  current: { name: '2026-09-25 12.03', label: '25 Sep 12.03', count: 2 },
  sessions: [
    { name: '2026-09-25 12.03', label: '25 Sep 12.03', count: 2 },
    { name: 'Old', label: 'Old', count: 0 },
  ],
  root: '~/Documents/Snapmark',
  canChangeRoot: true,
  login: { enabled: true, checked: false, needsApproval: false },
  version: '0.2.0',
  canUpdate: true,
  updateWaiting: null,
  shortcuts: { capture: 'Control+Shift+1', area: 'Control+Shift+3', newSession: 'Control+Shift+N' },
  area: null,
  iconDir: '',
  hasDiscarded: false,
};
const menu = (over: Partial<MenuState> = {}) => menuTemplate({ ...base, ...over }, a);
const labels = (items: Item[]) => items.filter((i) => i.visible !== false).map((i) => (i.type === 'separator' ? '—' : i.label));
const find = (items: Item[], label: string) => {
  const i = items.find((x) => x.label === label);
  assert.ok(i, `no item "${label}"`);
  return i;
};
const sub = (i: Item) => i.submenu as Item[];
const head = (items: Item[]) => items.find((i) => i.type === 'header')!;

// Order and labels, as the owner drew it (2026-10-24): capture, the current session, then Session ▸ for the rest
assert.deepStrictEqual(labels(menu()), [
  'Adding screenshots to',
  '25 Sep 12.03 · 2 screenshots',
  'Capture Screenshot…',
  'Capture Last Area',
  'Capture Options',
  '—',
  'Open Current Session',
  'Copy Prompt for AI',
  '—',
  'Session',
  '—',
  'Settings',
  'Quit Snapmark',
]);
assert.strictEqual(head(menu()).label, 'Adding screenshots to');
assert.strictEqual(menu()[1].enabled, false, 'the session line is text, not an action');
assert.strictEqual(find(menu(), 'Quit Snapmark').accelerator, 'Command+Q');
const depth = (items: Item[]): number => Math.max(1, ...items.map((i) => (Array.isArray(i.submenu) ? 1 + depth(i.submenu) : 1)));
assert.strictEqual(depth(menu()), 3, 'Session ▸ Switch Session ▸ is the deepest');

// Discarded Screenshots: a submenu before Settings, only when there is something to reopen
assert.deepStrictEqual(labels(menu({ hasDiscarded: true })).slice(-4), ['Discarded Screenshots', '—', 'Settings', 'Quit Snapmark']);
const disc = sub(find(menu({ hasDiscarded: true }), 'Discarded Screenshots'));
find(disc, 'Reopen Last Discarded').click!({} as never, undefined, {} as never);
assert.strictEqual(calls.pop(), 'reopenLast');
find(disc, 'Reopen Discarded…').click!({} as never, undefined, {} as never);
assert.strictEqual(calls.pop(), 'reopenDiscarded');

// Capture Last Area: says the first press asks for the area; once there is one, shows its size
const last = find(menu(), 'Capture Last Area');
assert.strictEqual(last.accelerator, 'Control+Shift+3');
assert.strictEqual(last.sublabel, 'First time: drag the area');
const withArea = menu({ area: { x: 10, y: 40, width: 1800, height: 1007 } });
assert.strictEqual(find(withArea, 'Capture Last Area').sublabel, '1800 × 1007');
find(withArea, 'Capture Last Area').click!({} as never, undefined, {} as never);
assert.strictEqual(calls.pop(), 'captureArea');
find(sub(find(menu(), 'Capture Options')), 'Choose New Area…').click!({} as never, undefined, {} as never);
assert.strictEqual(calls.pop(), 'chooseArea');

// Capture Window and Capture Scrolling: under Capture Options, not the default, so no global shortcut
assert.deepStrictEqual(labels(sub(find(menu(), 'Capture Options'))), [
  'Choose New Area…',
  'Capture Window…',
  'Capture Scrolling…',
  '—',
  'One-Shot Capture…',
]);
const windowItem = find(sub(find(menu(), 'Capture Options')), 'Capture Window…');
assert.strictEqual(windowItem.accelerator, undefined);
windowItem.click!({} as never, undefined, {} as never);
assert.strictEqual(calls.pop(), 'captureWindow');
const scrolling = find(sub(find(menu(), 'Capture Options')), 'Capture Scrolling…');
assert.strictEqual(scrolling.accelerator, undefined);
scrolling.click!({} as never, undefined, {} as never);
assert.strictEqual(calls.pop(), 'captureScrolling');
// One-Shot Capture: the second mode, last under Capture Options, no global shortcut
const oneShot = find(sub(find(menu(), 'Capture Options')), 'One-Shot Capture…');
assert.strictEqual(oneShot.accelerator, undefined);
oneShot.click!({} as never, undefined, {} as never);
assert.strictEqual(calls.pop(), 'oneShot');
assert.strictEqual(find(menu(), 'Capture Screenshot…').accelerator, 'Control+Shift+1');
assert.strictEqual(menu({ shortcuts: { ...base.shortcuts, area: null } })[3].label, 'Capture Last Area (shortcut unavailable)');

// The session line: singular, no count when empty; without a session the session actions are disabled
assert.strictEqual(menu({ current: { name: 'x', label: 'x', count: 1 } })[1].label, 'x · 1 screenshot');
assert.strictEqual(menu({ current: { name: 'e', label: 'e', count: 0 } })[1].label, 'e');
const none = menu({ current: null, sessions: [] });
assert.strictEqual(head(none).label, 'No Session Yet');
assert.strictEqual(none[1].label, 'Capture Screenshot…');
for (const l of ['Open Current Session', 'Copy Prompt for AI']) assert.strictEqual(find(none, l).enabled, false, l);
for (const l of ['Rename Session…', 'Show Session in Finder', 'Copy Session File Path'])
  assert.strictEqual(find(sub(find(none, 'Session')), l).enabled, false, l);
find(menu(), 'Open Current Session').click!({} as never, undefined, {} as never);
assert.strictEqual(calls.pop(), 'openFile:2026-09-25 12.03');

// Session ▸: the current one's name, New and Switch, then what you do with it
const ses = sub(find(menu(), 'Session'));
assert.deepStrictEqual(labels(ses), [
  'Current Session',
  '25 Sep 12.03',
  'New Session',
  'Switch Session',
  '—',
  'Rename Session…',
  'Export Session',
  'Show Session in Finder',
  'Copy Session File Path',
]);
assert.strictEqual(find(ses, 'New Session').accelerator, 'Control+Shift+N');
assert.strictEqual(find(ses, 'Copy Session File Path').sublabel, 'session.md');
find(ses, 'Copy Session File Path').click!({} as never, undefined, {} as never);
assert.strictEqual(calls.pop(), 'copyPath:2026-09-25 12.03');
find(ses, 'New Session').click!({} as never, undefined, {} as never);
assert.strictEqual(calls.pop(), 'newSession');

// Export is hidden, not disabled, while there is nothing to export
assert.strictEqual(find(sub(find(menu({ current: { name: 'e', label: 'e', count: 0 } }), 'Session')), 'Export Session').visible, false);
find(sub(find(ses, 'Export Session')), 'PDF').click!({} as never, undefined, {} as never);
assert.strictEqual(calls.pop(), 'exportAs:2026-09-25 12.03:PDF');

// Switch Session: the 10 most recently used (current ticked, click switches), then Older Sessions… (owner, 2026-10-25)
const many = (n: number) => Array.from({ length: n }, (_, i) => ({ name: `s${i}`, label: `s${i}`, count: 1 }));
const switchOf = (over: Partial<MenuState>) => sub(find(sub(find(menu(over), 'Session')), 'Switch Session'));
// F13 ten rows: at most 10, in last-use order
const twelve = switchOf({ sessions: many(12), current: many(12)[0] });
assert.strictEqual(MAX_LISTED, 10);
assert.deepStrictEqual(
  twelve.filter((i) => i.type === 'checkbox').map((i) => i.label),
  many(10).map((s) => s.label),
  'F13',
);
// F14 current listed: a current session 12th by last use is the 10th row, ticked
const late = switchOf({ sessions: many(12), current: many(12)[11] });
const rows = late.filter((i) => i.type === 'checkbox');
assert.strictEqual(rows.length, 10, 'F14');
assert.strictEqual(rows[9].label, 's11', 'F14');
assert.strictEqual(rows[9].checked, true, 'F14');
assert.strictEqual(rows.filter((i) => i.checked).length, 1, 'F14');
// F15 Older Sessions: the last item above 10 sessions, opening the folder panel
assert.deepStrictEqual(labels(twelve).slice(-2), ['—', 'Older Sessions…'], 'F15');
find(twelve, 'Older Sessions…').click!({} as never, undefined, {} as never);
assert.strictEqual(calls.pop(), 'otherSession', 'F15');
// F16 no older: 10 or fewer sessions show no Older Sessions… and no separator
assert.deepStrictEqual(labels(switchOf({ sessions: many(3), current: many(3)[0] })), ['s0', 's1', 's2'], 'F16');
assert.strictEqual(labels(switchOf({ sessions: many(10), current: many(10)[0] })).length, 10, 'F16');
// F17 empty: no session, Switch Session greyed
assert.strictEqual(find(sub(find(menu({ current: null, sessions: [] }), 'Session')), 'Switch Session').enabled, false, 'F17');
const listed = sub(find(ses, 'Switch Session'));
assert.strictEqual(find(listed, '25 Sep 12.03').checked, true);
find(listed, 'Old').click!({} as never, undefined, {} as never);
assert.strictEqual(calls.pop(), 'makeCurrent:Old');

// Settings holds what Help used to: the shortcuts, and the version under Check for Updates (no Help menu, owner 2026-09-26)
assert.deepStrictEqual(labels(sub(find(menu(), 'Settings'))), [
  'Open at Login',
  'Sessions Folder…',
  'Clear Sessions Older Than 60 Days…',
  'Keyboard Shortcuts',
  'Check for Updates…',
]);
assert.strictEqual(find(sub(find(menu(), 'Settings')), 'Check for Updates…').sublabel, 'Snapmark 0.2.0');
find(sub(find(menu(), 'Settings')), 'Clear Sessions Older Than 60 Days…').click!({} as never, undefined, {} as never);
assert.strictEqual(calls.pop(), 'clearOldSessions');
assert.strictEqual(find(sub(find(menu(), 'Settings')), 'Sessions Folder…').sublabel, '~/Documents/Snapmark');

// A waiting update comes first; a shortcut is shown only when registered
const upd = menu({ updateWaiting: '0.4.2' });
assert.strictEqual(upd[0].label, 'Restart to Update to 0.4.2');
upd[0].click!({} as never, undefined, {} as never);
assert.strictEqual(calls.pop(), 'installUpdate');
const off = menu({ shortcuts: { ...base.shortcuts, capture: null } });
assert.strictEqual(off[2].label, 'Capture Screenshot… (shortcut unavailable)');
assert.strictEqual(off[2].accelerator, undefined);

// Icons: every action at the top and in Session ▸ has one (headers and their text lines do not), and every file exists at 1x and 2x
const withIcons = menu({ iconDir: path.join(__dirname, '../../assets'), updateWaiting: '1.0.0', hasDiscarded: true });
const actions = (items: Item[]) => items.filter((x) => x.type !== 'separator' && x.type !== 'header' && x.enabled !== false);
for (const i of [...actions(withIcons), ...actions(sub(find(withIcons, 'Session')))]) {
  assert.ok(typeof i.icon === 'string', `no icon for ${i.label}`);
  assert.ok(fs.existsSync(i.icon as string) && fs.existsSync((i.icon as string).replace('.png', '@2x.png')), `missing ${i.icon}`);
}

// Open at Login is ticked when macOS reports it on either way, and says when it waits for approval
assert.deepStrictEqual(loginState(true, { openAtLogin: false, status: 'enabled' }), { enabled: true, checked: true, needsApproval: false });
assert.deepStrictEqual(loginState(true, { openAtLogin: true, status: 'not-registered' }).checked, true);
assert.deepStrictEqual(loginState(true, { openAtLogin: false, status: 'not-registered' }).checked, false);
assert.deepStrictEqual(loginState(false, { openAtLogin: true, status: 'enabled' }), {
  enabled: false,
  checked: false,
  needsApproval: false,
});
const wait = find(
  sub(find(menu({ login: loginState(true, { openAtLogin: false, status: 'requires-approval' }) }), 'Settings')),
  'Open at Login',
);
assert.strictEqual(wait.checked, false);
assert.strictEqual(wait.sublabel, 'Allow in System Settings → Login Items');
const ticked = find(sub(find(menu({ login: loginState(true, { openAtLogin: false, status: 'enabled' }) }), 'Settings')), 'Open at Login');
assert.strictEqual(ticked.checked, true);

console.log('menu: ok');
