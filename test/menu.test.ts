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

// F1 order and labels
assert.deepStrictEqual(labels(menu()), [
  'Snapmark',
  'Capture region',
  'New session',
  '—',
  'Current session: 25 Sep 12.03 · 2 screenshots',
  'Copy prompt for AI',
  'Copy file path',
  'Open feedback file',
  'Show in Finder',
  'Rename session…',
  'Export',
  '—',
  'Switch session',
  'Settings',
  'Quit Snapmark',
]);
assert.strictEqual(menu()[0].type, 'header');
assert.strictEqual(find(menu(), 'Quit Snapmark').accelerator, 'Command+Q');

// F2 singular count
const one = { name: 'x', label: 'x', count: 1 };
assert.strictEqual(menu({ current: one })[4].label, 'Current session: x · 1 screenshot');
assert.strictEqual(menu()[4].type, 'header');

// F3 no session: header text and disabled session items
const none = menu({ current: null, sessions: [] });
assert.strictEqual(none[4].label, 'No session yet: press ⇧⌘1 to start one');
for (const l of ['Copy prompt for AI', 'Copy file path', 'Open feedback file', 'Show in Finder', 'Rename session…', 'Export'])
  assert.strictEqual(find(none, l).enabled, false, l);

// F4 export disabled while empty, enabled with screenshots
assert.strictEqual(find(menu({ current: { name: 'e', label: 'e', count: 0 } }), 'Export').enabled, false);
assert.strictEqual(find(menu(), 'Export').enabled, true);

// F5 settings
assert.deepStrictEqual(labels(sub(find(menu(), 'Settings'))), [
  'Open at login',
  'Sessions are saved in ~/Documents/Snapmark',
  'Change where sessions are saved…',
  'Keyboard shortcuts…',
  'Check for updates…',
  'Version 0.2.0',
]);
find(sub(find(menu(), 'Settings')), 'Sessions are saved in ~/Documents/Snapmark').click!({} as never, undefined, {} as never);
assert.strictEqual(calls.pop(), 'openRoot');

// F10 order kept, capped at MAX_LISTED, ends with "Other session…"
const many = Array.from({ length: 25 }, (_, i) => ({ name: `s${i}`, label: `s${i}`, count: 1 }));
const sw = labels(sub(find(menu({ sessions: many }), 'Switch session')));
assert.strictEqual(sw.length, MAX_LISTED + 2);
assert.deepStrictEqual(sw.slice(0, 2), ['s0', 's1']);
assert.deepStrictEqual(sw.slice(-2), ['—', 'Other session…']);
assert.deepStrictEqual(labels(sub(find(menu({ sessions: [] }), 'Switch session'))), ['Other session…']);

// F11 per-session submenu acts on that session, not the current one
const old = find(sub(find(menu(), 'Switch session')), 'Old');
assert.deepStrictEqual(labels(sub(old)), ['Make current', 'Copy prompt for AI', 'Export', 'Show in Finder']);
find(sub(old), 'Copy prompt for AI').click!({} as never, undefined, {} as never);
assert.strictEqual(calls.pop(), 'copyPrompt:Old');
assert.strictEqual(find(sub(old), 'Export').enabled, false); // Old has no screenshots
const cur = find(sub(find(menu(), 'Switch session')), '25 Sep 12.03 (current)');
assert.strictEqual(find(sub(cur), 'Make current').enabled, false);

// F16 waiting update right under the header
const upd = menu({ updateWaiting: '0.3.0' });
assert.strictEqual(upd[1].label, 'Restart to install 0.3.0');
upd[1].click!({} as never, undefined, {} as never);
assert.strictEqual(calls.pop(), 'installUpdate');

// F17 shortcut shown only when registered
const off = menu({ shortcuts: { capture: null, newSession: 'CommandOrControl+Shift+2' } });
assert.strictEqual(off[1].label, 'Capture region (shortcut unavailable)');
assert.strictEqual(off[1].accelerator, undefined);
assert.strictEqual(off[2].accelerator, 'CommandOrControl+Shift+2');

console.log('menu: ok');
