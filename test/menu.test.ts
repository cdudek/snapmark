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
  shortcuts: { capture: 'Control+Shift+1', newSession: 'Control+Shift+2' },
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

// Order and labels: every label names what it acts on (owner, 2026-09-26); two levels at most
assert.deepStrictEqual(labels(menu()), [
  'Capture Screenshot',
  '—',
  'Current Session: 25 Sep 12.03 · 2 screenshots',
  'Open Session',
  'Copy Prompt for AI',
  'Copy session.md Path',
  'Rename Session…',
  'Show Session in Finder',
  'Export Session',
  '—',
  'Switch Session',
  'New Session',
  '—',
  'Settings',
  'Quit Snapmark',
]);
assert.strictEqual(
  menu().findIndex((i) => i.type === 'header'),
  4,
  'the header follows Capture and the two hidden Reopen items',
);
assert.strictEqual(find(menu(), 'Quit Snapmark').accelerator, 'Command+Q');
const depth = (items: Item[]): number => Math.max(1, ...items.map((i) => (Array.isArray(i.submenu) ? 1 + depth(i.submenu) : 1)));
assert.strictEqual(depth(menu()), 2, 'no submenu inside a submenu');

// Discarded screenshots: two items under Capture, only when there is something to reopen
assert.deepStrictEqual(labels(menu({ hasDiscarded: true })).slice(0, 4), [
  'Capture Screenshot',
  'Reopen Last Discarded',
  'Reopen Discarded…',
  '—',
]);
find(menu({ hasDiscarded: true }), 'Reopen Last Discarded').click!({} as never, undefined, {} as never);
assert.strictEqual(calls.pop(), 'reopenLast');
find(menu({ hasDiscarded: true }), 'Reopen Discarded…').click!({} as never, undefined, {} as never);
assert.strictEqual(calls.pop(), 'reopenDiscarded');

// Header: singular, no count when empty; without a session the session items are disabled
assert.strictEqual(head(menu({ current: { name: 'x', label: 'x', count: 1 } })).label, 'Current Session: x · 1 screenshot');
assert.strictEqual(head(menu({ current: { name: 'e', label: 'e', count: 0 } })).label, 'Current Session: e');
const none = menu({ current: null, sessions: [] });
assert.strictEqual(head(none).label, 'No Session Yet');
for (const l of ['Open Session', 'Copy Prompt for AI', 'Copy session.md Path', 'Rename Session…', 'Show Session in Finder'])
  assert.strictEqual(find(none, l).enabled, false, l);

// Export is hidden, not disabled, while there is nothing to export
assert.strictEqual(find(menu({ current: { name: 'e', label: 'e', count: 0 } }), 'Export Session').visible, false);
find(sub(find(menu(), 'Export Session')), 'PDF').click!({} as never, undefined, {} as never);
assert.strictEqual(calls.pop(), 'exportAs:2026-09-25 12.03:PDF');

// Switch Session: the list (current ticked, click switches), capped, then Other Session…
const many = Array.from({ length: 25 }, (_, i) => ({ name: `s${i}`, label: `s${i}`, count: 1 }));
const ss = sub(find(menu({ sessions: many }), 'Switch Session'));
assert.strictEqual(ss.filter((i) => i.type === 'checkbox').length, MAX_LISTED);
assert.deepStrictEqual(labels(ss).slice(-2), ['—', 'Other Session…']);
const listed = sub(find(menu(), 'Switch Session'));
assert.strictEqual(find(listed, '25 Sep 12.03').checked, true);
find(listed, 'Old').click!({} as never, undefined, {} as never);
assert.strictEqual(calls.pop(), 'makeCurrent:Old');
assert.strictEqual(find(menu(), 'New Session').accelerator, 'Control+Shift+2');

// Settings holds what Help used to: the shortcuts, and the version under Check for Updates (no Help menu, owner 2026-09-26)
assert.deepStrictEqual(labels(sub(find(menu(), 'Settings'))), [
  'Open at Login',
  'Sessions Folder…',
  'Keyboard Shortcuts',
  'Check for Updates…',
]);
assert.strictEqual(find(sub(find(menu(), 'Settings')), 'Check for Updates…').sublabel, 'Snapmark 0.2.0');
assert.strictEqual(find(sub(find(menu(), 'Settings')), 'Sessions Folder…').sublabel, '~/Documents/Snapmark');

// A waiting update comes first; a shortcut is shown only when registered
const upd = menu({ updateWaiting: '0.4.2' });
assert.strictEqual(upd[0].label, 'Restart to Update to 0.4.2');
upd[0].click!({} as never, undefined, {} as never);
assert.strictEqual(calls.pop(), 'installUpdate');
const off = menu({ shortcuts: { capture: null, newSession: 'Control+Shift+2' } });
assert.strictEqual(off[0].label, 'Capture Screenshot (shortcut unavailable)');
assert.strictEqual(off[0].accelerator, undefined);

// Icons: every top-level item except the header has one, and every icon file exists at 1x and 2x
const withIcons = menu({ iconDir: path.join(__dirname, '../../assets'), updateWaiting: '1.0.0' });
for (const i of withIcons.filter((x) => x.type !== 'separator' && x.type !== 'header')) {
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
