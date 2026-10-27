import assert from 'assert';
import fs from 'fs';
import path from 'path';
import type { MenuItemConstructorOptions as Item } from 'electron';
import {
  menuTemplate,
  appMenu,
  loginState,
  editorSessionMenu,
  copyMenu,
  quitMessage,
  MenuActions,
  MenuState,
  MAX_LISTED,
} from '../src/menu';
import type { EditorSessionActions } from '../src/menu';
import { SHORTCUTS } from '../src/keys';

const calls: string[] = [];
const a = new Proxy({} as MenuActions, {
  get:
    (_, key) =>
    (...args: unknown[]) =>
      calls.push([String(key), ...args].join(':')),
});
const base: MenuState = {
  current: { name: '2026-09-25 12.03', label: '2026-09-25, 12:03', count: 2 },
  sessions: [
    { name: '2026-09-25 12.03', label: '2026-09-25, 12:03', count: 2 },
    { name: 'Old', label: 'Old', count: 0 },
  ],
  updateWaiting: null,
  shortcuts: { ...SHORTCUTS },
  area: null,
  areaForgotten: false,
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
  '2026-09-25, 12:03 · 2 screenshots',
  'Capture Last Area',
  'Capture New Area…',
  'Capture Full Screen',
  'Capture One-Shot…',
  'Capture Options…',
  '—',
  'Open Current Session',
  'Copy Prompt for AI',
  '—',
  'Session',
  '—',
  'Settings…',
  'Quit Snapmark',
]);
assert.strictEqual(head(menu()).label, 'Adding screenshots to');
assert.strictEqual(menu()[1].enabled, false, 'the session line is text, not an action');
assert.strictEqual(find(menu(), 'Quit Snapmark').accelerator, 'Command+Q');
const depth = (items: Item[]): number => Math.max(1, ...items.map((i) => (Array.isArray(i.submenu) ? 1 + depth(i.submenu) : 1)));
assert.strictEqual(depth(menu()), 3, 'Session ▸ Switch Session ▸ is the deepest');

// Discarded Screenshots: a submenu before Settings, only when there is something to reopen
assert.deepStrictEqual(labels(menu({ hasDiscarded: true })).slice(-4), ['Discarded Screenshots', '—', 'Settings…', 'Quit Snapmark']);
const disc = sub(find(menu({ hasDiscarded: true }), 'Discarded Screenshots'));
find(disc, 'Reopen Last Discarded').click!({} as never, undefined, {} as never);
assert.strictEqual(calls.pop(), 'reopenLast');
find(disc, 'Reopen Discarded…').click!({} as never, undefined, {} as never);
assert.strictEqual(calls.pop(), 'reopenDiscarded');

// @F8 the five capture rows of screens.md, in order, each with its key, each doing what its key does
const captureRows = menu().slice(2, 7);
assert.deepStrictEqual(
  captureRows.map((i) => [i.label, i.accelerator]),
  [
    ['Capture Last Area', 'Control+Shift+4'],
    ['Capture New Area…', 'Control+Shift+1'],
    ['Capture Full Screen', 'Control+Shift+3'],
    ['Capture One-Shot…', 'Control+Shift+2'],
    ['Capture Options…', 'Control+Shift+5'],
  ],
  '@F8',
);
for (const [i, call] of ['captureArea', 'captureNewArea', 'captureFullScreen', 'captureOneShot', 'captureBar'].entries()) {
  captureRows[i].click!({} as never, undefined, {} as never);
  assert.strictEqual(calls.pop(), call, `@F8 ${captureRows[i].label}`);
}
assert.ok(!labels(menu()).includes('Capture Screenshot…'), '@F8 Capture Screenshot… leaves (Q1)');
// Capture Last Area's sublabel: the area's size; with none, the first time or after a New Session (@F7)
assert.strictEqual(find(menu(), 'Capture Last Area').sublabel, 'First time: drag the area');
assert.strictEqual(find(menu({ areaForgotten: true }), 'Capture Last Area').sublabel, 'New session: drag the area', '@F7');
assert.strictEqual(find(menu({ area: { x: 10, y: 40, width: 1800, height: 1007 } }), 'Capture Last Area').sublabel, '1800 × 1007');
assert.strictEqual(menu({ shortcuts: { ...base.shortcuts, capture: null } })[2].label, 'Capture Last Area (shortcut unavailable)');

// F218 Capture Options…: one row with ⌃⇧5 beside it, opening the capture bar, in place of the submenu
const options = find(menu(), 'Capture Options…');
assert.strictEqual(options.accelerator, 'Control+Shift+5', 'F218');
assert.strictEqual(options.submenu, undefined, 'F218 no submenu');
assert.strictEqual(options.sublabel, undefined, 'F218 the key shows beside it');
options.click!({} as never, undefined, {} as never);
assert.strictEqual(calls.pop(), 'captureBar', 'F218');
const noOptions = menu({ shortcuts: { ...base.shortcuts, options: null } })[6];
assert.strictEqual(noOptions.label, 'Capture Options… (shortcut unavailable)', 'F218');
assert.strictEqual(noOptions.accelerator, undefined, 'F218');
noOptions.click!({} as never, undefined, {} as never);
assert.strictEqual(calls.pop(), 'captureBar', 'F218 the bar stays reachable from the menu');
assert.ok(
  menu().every((i) => !Array.isArray(i.submenu) || i.label !== 'Capture Options'),
  'F218 the Capture Options submenu is gone',
);

// The session line: singular, no count when empty; without a session the session actions are disabled
assert.strictEqual(menu({ current: { name: 'x', label: 'x', count: 1 } })[1].label, 'x · 1 screenshot');
assert.strictEqual(menu({ current: { name: 'e', label: 'e', count: 0 } })[1].label, 'e');
const none = menu({ current: null, sessions: [] });
assert.strictEqual(head(none).label, 'No Session Yet');
assert.strictEqual(none[1].label, 'Capture Last Area');
for (const l of ['Open Current Session', 'Copy Prompt for AI']) assert.strictEqual(find(none, l).enabled, false, l);
for (const l of ['Rename Session…', 'Show Session in Finder', 'Copy Session File Path'])
  assert.strictEqual(find(sub(find(none, 'Session')), l).enabled, false, l);
find(menu(), 'Open Current Session').click!({} as never, undefined, {} as never);
assert.strictEqual(calls.pop(), 'openFile:2026-09-25 12.03');

// Session ▸: the current one's name, New and Switch, then what you do with it
const ses = sub(find(menu(), 'Session'));
assert.deepStrictEqual(labels(ses), [
  'Current Session',
  '2026-09-25, 12:03',
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
assert.strictEqual(find(listed, '2026-09-25, 12:03').checked, true);
find(listed, 'Old').click!({} as never, undefined, {} as never);
assert.strictEqual(calls.pop(), 'makeCurrent:Old');

// F219 Settings… and ⌘,: the menu row and the app menu open the Settings window; the app menu keeps the stock roles
const settingsRow = find(menu(), 'Settings…');
assert.strictEqual(settingsRow.accelerator, 'Command+,', 'F219');
settingsRow.click!({} as never, undefined, {} as never);
assert.strictEqual(calls.pop(), 'settings', 'F219');
const app = appMenu(a);
assert.strictEqual(app[0].label, 'Snapmark', 'F219 the Snapmark menu first');
const snapmark = sub(app[0]);
const appSettings = find(snapmark, 'Settings…');
assert.strictEqual(appSettings.accelerator, 'Command+,', 'F219');
appSettings.click!({} as never, undefined, {} as never);
assert.strictEqual(calls.pop(), 'settings', 'F219');
assert.deepStrictEqual(
  app.slice(1).map((i) => i.role),
  ['fileMenu', 'editMenu', 'viewMenu', 'windowMenu'],
  'F219 File, Edit, View and Window stay stock, so ⌘C, ⌘V and ⌘W keep working',
);
assert.deepStrictEqual(
  snapmark.filter((i) => i.role).map((i) => i.role),
  ['about', 'services', 'hide', 'hideOthers', 'unhide', 'quit'],
  'F219 the Snapmark menu keeps Hide and Quit',
);

// F233 ⌘/: Keyboard Shortcuts in the app menu, under Settings…
const appShortcuts = find(snapmark, 'Keyboard Shortcuts');
assert.strictEqual(appShortcuts.accelerator, 'Command+/', 'F233');
assert.strictEqual(snapmark.indexOf(appShortcuts), snapmark.indexOf(appSettings) + 1, 'F233');
appShortcuts.click!({} as never, undefined, {} as never);
assert.strictEqual(calls.pop(), 'keyboardShortcuts', 'F233');

// F226 Settings…: one row, no Settings submenu, last before Quit
assert.ok(
  menu().every((i) => !(Array.isArray(i.submenu) && /^Settings/.test(i.label ?? ''))),
  'F226 no Settings submenu',
);
assert.deepStrictEqual(labels(menu()).slice(-2), ['Settings…', 'Quit Snapmark'], 'F226');
assert.strictEqual(settingsRow.submenu, undefined, 'F226');

// A waiting update comes first; a shortcut is shown only when registered
const upd = menu({ updateWaiting: '0.4.2' });
assert.strictEqual(upd[0].label, 'Restart to Update to 0.4.2');
upd[0].click!({} as never, undefined, {} as never);
assert.strictEqual(calls.pop(), 'installUpdate');
const off = menu({ shortcuts: { ...base.shortcuts, oneShot: null } });
assert.strictEqual(off[5].label, 'Capture One-Shot… (shortcut unavailable)');
assert.strictEqual(off[5].accelerator, undefined);

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
// F222 approval: while macOS waits for the owner's approval, Settings says so
assert.deepStrictEqual(loginState(true, { openAtLogin: false, status: 'requires-approval' }), {
  enabled: true,
  checked: false,
  needsApproval: true,
});

// F113 Copy or Save menu: Copy Image ⇧⌘C and Save As… ⇧⌘S, which do what the two buttons did
// The same recording proxy, for the editor's own menus
const ed = a as unknown as EditorSessionActions & { copyImage(): void; saveAs(): void };
const share = copyMenu(ed);
assert.deepStrictEqual(
  share.map((i) => [i.label, i.accelerator, i.registerAccelerator]),
  [
    ['Copy Image', 'Shift+Command+C', false],
    ['Save As…', 'Shift+Command+S', false],
  ],
  'F113',
);
share[0].click!({} as never, undefined, {} as never);
assert.strictEqual(calls.pop(), 'copyImage', 'F113');
share[1].click!({} as never, undefined, {} as never);
assert.strictEqual(calls.pop(), 'saveAs', 'F113');
// @F76 a recording's Copy or Save menu: Copy Filmstrip, Copy GIF, Save As…, Save GIF As… (screens.md)
const gifCalls: string[] = [];
const recShare = copyMenu(ed, { copyGif: () => void gifCalls.push('copyGif'), saveGifAs: () => void gifCalls.push('saveGifAs') });
assert.deepStrictEqual(
  recShare.map((i) => i.label),
  ['Copy Filmstrip', 'Copy GIF', 'Save As…', 'Save GIF As…'],
  '@F76',
);
recShare[0].click!({} as never, undefined, {} as never);
assert.strictEqual(calls.pop(), 'copyImage', '@F76 Copy Filmstrip copies the marked image');
recShare[1].click!({} as never, undefined, {} as never);
recShare[3].click!({} as never, undefined, {} as never);
assert.deepStrictEqual(gifCalls, ['copyGif', 'saveGifAs'], '@F76');

// F114, @F23 the session pop-up, shared by the editor and the capture bar: at most 10 sessions with their counts, the
// given one ticked, then a separator, Older Sessions… and New Session
const edMenu = editorSessionMenu(
  { ...base, sessions: [...many(12).slice(0, 1), { name: 'b', label: 'B', count: 3 }, ...many(12).slice(1)] },
  'b',
  ed,
);
const edRows = edMenu.filter((i) => i.type === 'checkbox');
assert.strictEqual(edRows.length, 10, 'F114 @F42 at most 10');
assert.deepStrictEqual(
  edRows.filter((i) => i.checked).map((i) => i.label),
  ['B (3)'],
  'F114 @F23 @F42 b ticked, with its count',
);
assert.deepStrictEqual(labels(edMenu).slice(-3), ['—', 'Older Sessions…', 'New Session'], 'F114 @F23 @F42');
find(edMenu, 'B (3)').click!({} as never, undefined, {} as never);
assert.strictEqual(calls.pop(), 'moveTo:b', 'F114 @F23 a pick hands over that session (the bar makes it current)');
find(edMenu, 'Older Sessions…').click!({} as never, undefined, {} as never);
assert.strictEqual(calls.pop(), 'older', '@F23 Older Sessions… opens the folder panel');
find(edMenu, 'New Session').click!({} as never, undefined, {} as never);
assert.strictEqual(calls.pop(), 'newSession', 'F114');
assert.strictEqual(find(edMenu, 'New Session').accelerator, 'Control+Shift+N', '@F23 @F42 New Session shows ⌃⇧N');
// An empty session: the name without a count
assert.deepStrictEqual(
  labels(editorSessionMenu(base, '2026-09-25 12.03', ed)).slice(0, 2),
  ['2026-09-25, 12:03 (2)', 'Old'],
  '@F23 @F42 counts; none for an empty session',
);
// The bar's pop-up picks make the session current (main.ts wires moveTo to setActive, the menu bar's makeCurrent)
const mainTs = fs.readFileSync(path.join(__dirname, '../../src/main.ts'), 'utf8');
assert.ok(
  mainTs.includes('const pick = { moveTo: setActive, older: () => void otherSession(), newSession };') &&
    mainTs.includes("editorSessionMenu(menuState(), active ?? '', pick)") &&
    mainTs.includes('makeCurrent: setActive,'),
  '@F23 a pick in the bar makes the session current',
);
// The editor's session 15th by last use still shows, ticked, as the 10th row
const lateEd = editorSessionMenu({ ...base, sessions: many(15) }, 's14', ed).filter((i) => i.type === 'checkbox');
assert.deepStrictEqual([lateEd.length, lateEd[9].label, lateEd[9].checked], [10, 's14 (1)', true], 'F114');

// F118 one session: Switch Session is greyed while no session other than the current one exists
const only = { name: 'solo', label: 'solo', count: 1 };
assert.strictEqual(find(sub(find(menu({ current: only, sessions: [only] }), 'Session')), 'Switch Session').enabled, false, 'F118');
assert.strictEqual(
  find(sub(find(menu({ current: only, sessions: [only, { name: 'two', label: 'two', count: 0 }] }), 'Session')), 'Switch Session').enabled,
  true,
  'F118',
);
const soloMenu = editorSessionMenu({ ...base, current: only, sessions: [only] }, 'solo', ed);
assert.deepStrictEqual(labels(soloMenu), ['solo (1)', '—', 'Older Sessions…', 'New Session'], 'F118 editor menu');
assert.ok(soloMenu[0].checked && soloMenu.every((i) => i.enabled !== false), 'F118 the one session ticked, nothing greyed');

// F121 quit warning: one-shot images count as images not copied or saved yet (spec.md Words)
assert.strictEqual(quitMessage(0, 1), '1 image is not copied or saved yet.', 'F121 one-shot only');
assert.strictEqual(quitMessage(0, 2), '2 images are not copied or saved yet.', 'F121 one-shot only');
assert.strictEqual(quitMessage(1, 2), '3 screenshots are not saved yet.', 'F121 mixed');
assert.strictEqual(quitMessage(2, 0), '2 screenshots are not in a session yet.', 'F121 session only, as today');
assert.strictEqual(quitMessage(1, 0), '1 screenshot is not in a session yet.', 'F121 session only, as today');

console.log('menu: ok');
