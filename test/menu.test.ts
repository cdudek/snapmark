import assert from 'assert';
import type { MenuItemConstructorOptions as Item } from 'electron';
import { menuTemplate, MenuActions, MenuState, MAX_LISTED } from '../src/menu';

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
  login: { enabled: true, checked: false },
  version: '0.2.0',
  canUpdate: true,
  updateWaiting: null,
  shortcuts: { capture: 'CommandOrControl+Shift+1', newSession: 'CommandOrControl+Shift+2' },
};
const menu = (over: Partial<MenuState> = {}) => menuTemplate({ ...base, ...over }, a);
const labels = (items: Item[]) => items.map((i) => (i.type === 'separator' ? '—' : i.label));
const find = (items: Item[], label: string) => {
  const i = items.find((x) => x.label === label);
  assert.ok(i, `no item "${label}"`);
  return i;
};
const sub = (i: Item) => i.submenu as Item[];

// Order and labels (audit 2026-09-26): short, title case, one header, two levels at most
assert.deepStrictEqual(labels(menu()), [
  'Capture',
  '—',
  '25 Sep 12.03 · 2',
  'Copy for AI',
  'Copy Path',
  'Open',
  'Export',
  '—',
  'Sessions',
  'Settings',
  'Help',
  'Quit',
]);
assert.strictEqual(menu()[2].type, 'header');
assert.strictEqual(find(menu(), 'Quit').accelerator, 'Command+Q');
const depth = (items: Item[]): number => Math.max(1, ...items.map((i) => (Array.isArray(i.submenu) ? 1 + depth(i.submenu) : 1)));
assert.strictEqual(depth(menu()), 2, 'no submenu inside a submenu');

// Header: no count on an empty session; no session at all disables the session items
assert.strictEqual(menu({ current: { name: 'e', label: 'e', count: 0 } })[2].label, 'e');
const none = menu({ current: null, sessions: [] });
assert.strictEqual(none[2].label, 'No session yet');
for (const l of ['Copy for AI', 'Copy Path', 'Open']) assert.strictEqual(find(none, l).enabled, false, l);

// Export is hidden, not disabled, while there is nothing to export
assert.strictEqual(find(menu({ current: { name: 'e', label: 'e', count: 0 } }), 'Export').visible, false);
assert.strictEqual(find(menu(), 'Export').visible, true);
find(sub(find(menu(), 'Export')), 'PDF').click!({} as never, undefined, {} as never);
assert.strictEqual(calls.pop(), 'exportAs:2026-09-25 12.03:PDF');

// Sessions: the list (current checked, click switches), capped, then the session actions
const many = Array.from({ length: 25 }, (_, i) => ({ name: `s${i}`, label: `s${i}`, count: 1 }));
const ss = sub(find(menu({ sessions: many }), 'Sessions'));
assert.strictEqual(ss.filter((i) => i.type === 'checkbox').length, MAX_LISTED);
assert.deepStrictEqual(labels(ss).slice(-5), ['—', 'New Session', 'Rename…', 'Show in Finder', 'Other…']);
const listed = sub(find(menu(), 'Sessions'));
assert.strictEqual(find(listed, '25 Sep 12.03').checked, true);
find(listed, 'Old').click!({} as never, undefined, {} as never);
assert.strictEqual(calls.pop(), 'makeCurrent:Old');
assert.strictEqual(find(listed, 'New Session').accelerator, 'CommandOrControl+Shift+2');

// Settings and Help
assert.deepStrictEqual(labels(sub(find(menu(), 'Settings'))), ['Open at Login', 'Sessions Folder…', 'Check for Updates…']);
assert.strictEqual(find(sub(find(menu(), 'Settings')), 'Sessions Folder…').sublabel, '~/Documents/Snapmark');
assert.deepStrictEqual(labels(sub(find(menu(), 'Help'))), ['Keyboard Shortcuts', 'Snapmark 0.2.0']);

// A waiting update comes first
const upd = menu({ updateWaiting: '0.4.2' });
assert.strictEqual(upd[0].label, 'Restart to Update to 0.4.2');
upd[0].click!({} as never, undefined, {} as never);
assert.strictEqual(calls.pop(), 'installUpdate');

// A shortcut is shown only when registered
const off = menu({ shortcuts: { capture: null, newSession: 'CommandOrControl+Shift+2' } });
assert.strictEqual(off[0].label, 'Capture (shortcut unavailable)');
assert.strictEqual(off[0].accelerator, undefined);

console.log('menu: ok');
