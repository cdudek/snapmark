// The menu bar menu as data: no Electron at runtime, so test/menu.test.ts checks it in plain Node.
import type { MenuItemConstructorOptions as Item } from 'electron';

export interface SessionInfo {
  name: string; // folder name
  label: string; // sessions.shortName(name)
  count: number; // screenshots
}

export interface MenuState {
  current: SessionInfo | null;
  sessions: SessionInfo[]; // by last use, current included
  root: string; // sessions folder, ~-shortened
  canChangeRoot: boolean;
  login: { enabled: boolean; checked: boolean; needsApproval: boolean };
  version: string;
  canUpdate: boolean;
  updateWaiting: string | null; // version downloaded and ready to install
  shortcuts: { capture: string | null; area: string | null; options: string | null; newSession: string | null }; // null = not registered
  area: Area | null; // what Capture Last Area captures; null until the first time
  iconDir: string; // folder with the menu-<name>Template.png icons ('' = no icons, e.g. in tests)
  hasDiscarded: boolean; // something closed without saving, or removed, in the last 7 days
}

export interface MenuActions {
  capture(): void;
  captureArea(): void;
  chooseArea(): void;
  captureWindow(): void;
  captureScrolling(): void;
  oneShot(): void;
  reopenLast(): void;
  reopenDiscarded(): void;
  newSession(): void;
  copyPrompt(name: string): void;
  copyPath(name: string): void;
  openFile(name: string): void;
  showInFinder(name: string): void;
  rename(name: string): void;
  exportAs(name: string, kind: 'ZIP' | 'PDF'): void;
  makeCurrent(name: string): void;
  otherSession(): void;
  chooseRoot(): void;
  clearOldSessions(): void;
  setLogin(checked: boolean): void;
  keyboardShortcuts(): void;
  checkUpdates(): void;
  installUpdate(): void;
  quit(): void;
}

export const MAX_LISTED = 20;

// macOS 13+ registers login items with SMAppService; Electron's openAtLogin can read false there while
// status is 'enabled', so either one counts. 'requires-approval' means the owner must allow it in System Settings.
export function loginState(packaged: boolean, s: { openAtLogin: boolean; status?: string }): MenuState['login'] {
  return {
    enabled: packaged, // in development it would register the bare Electron binary
    checked: packaged && (s.openAtLogin || s.status === 'enabled'),
    needsApproval: packaged && s.status === 'requires-approval',
  };
}

function shortcut(label: string, accelerator: string | null, click: () => void): Item {
  return accelerator ? { label, accelerator, click } : { label: `${label} (shortcut unavailable)`, click };
}

const plural = (n: number) => `${n} screenshot${n === 1 ? '' : 's'}`;

// The less frequent ways to capture: the Capture Options submenu, and the menu ⌃⇧5 pops at the menu bar icon.
export function captureOptions(a: MenuActions): Item[] {
  return [
    { label: 'Choose New Area…', click: () => a.chooseArea() },
    // Click one window: cropped to its edges, without the shadow macOS draws around it.
    { label: 'Capture Window…', click: () => a.captureWindow() },
    // Not the default, so no direct shortcut (owner, 2026-10-25): drag an area, scroll it, and get one tall screenshot.
    { label: 'Capture Scrolling…', click: () => a.captureScrolling() },
    { type: 'separator' },
    // The second mode (owner, 2026-10-25): one image to beautify, then copy or save; nothing goes into a session.
    { label: 'One-Shot Capture…', click: () => a.oneShot() },
  ];
}

// Grouped as the owner drew it (2026-10-24): capture on top, the current session's everyday actions next,
// everything else about sessions under Session. Icons are template images, so macOS tints them for light and dark menus.
export function menuTemplate(st: MenuState, a: MenuActions): Item[] {
  const icon = (n: string) => (st.iconDir ? { icon: `${st.iconDir}/menu-${n}Template.png` } : {});
  const cur = st.current;
  const on = !!cur;
  const name = cur?.name ?? '';
  // A header line plus a greyed line under it: plain text, not something to click.
  const heading = (title: string, line: string | null): Item[] => [
    { label: title, type: 'header' },
    ...(line ? [{ label: line, enabled: false }] : []),
  ];
  return [
    ...(st.updateWaiting ? [{ label: `Restart to Update to ${st.updateWaiting}`, ...icon('update'), click: () => a.installUpdate() }] : []),
    ...(cur
      ? heading('Adding screenshots to', `${cur.label}${cur.count ? ` · ${plural(cur.count)}` : ''}`)
      : heading('No Session Yet', null)),
    { ...shortcut('Capture Screenshot…', st.shortcuts.capture, () => a.capture()), ...icon('capture') },
    {
      ...shortcut('Capture Last Area', st.shortcuts.area, () => a.captureArea()),
      sublabel: st.area ? `${st.area.width} × ${st.area.height}` : 'First time: drag the area',
      ...icon('area'),
    },
    {
      // macOS draws no key on a row that opens a submenu, so ⌃⇧5 is its sublabel.
      ...(st.shortcuts.options ? { label: 'Capture Options', sublabel: '⌃⇧5' } : { label: 'Capture Options (shortcut unavailable)' }),
      ...icon('choose'),
      submenu: captureOptions(a),
    },
    { type: 'separator' },
    { label: 'Open Current Session', enabled: on, ...icon('open'), click: () => a.openFile(name) },
    { label: 'Copy Prompt for AI', enabled: on, ...icon('prompt'), click: () => a.copyPrompt(name) },
    { type: 'separator' },
    {
      label: 'Session',
      ...icon('switch'),
      submenu: [
        ...heading('Current Session', cur?.label ?? 'None yet'),
        { ...shortcut('New Session', st.shortcuts.newSession, () => a.newSession()), ...icon('new') },
        {
          label: 'Switch Session',
          ...icon('switch'),
          submenu: [
            ...st.sessions
              .slice(0, MAX_LISTED)
              .map((s): Item => ({ label: s.label, type: 'checkbox', checked: s.name === cur?.name, click: () => a.makeCurrent(s.name) })),
            ...(st.sessions.length ? [{ type: 'separator' } as Item] : []),
            { label: 'Other Session…', click: () => a.otherSession() },
          ],
        },
        { type: 'separator' },
        { label: 'Rename Session…', enabled: on, ...icon('rename'), click: () => a.rename(name) },
        {
          label: 'Export Session',
          visible: !!cur?.count, // nothing to export from an empty session
          ...icon('export'),
          submenu: (['PDF', 'ZIP'] as const).map((kind) => ({ label: kind, click: () => a.exportAs(name, kind) })),
        },
        { label: 'Show Session in Finder', enabled: on, ...icon('finder'), click: () => a.showInFinder(name) },
        { label: 'Copy Session File Path', sublabel: 'session.md', enabled: on, ...icon('path'), click: () => a.copyPath(name) },
      ],
    },
    // Shown only when there is something to bring back.
    {
      label: 'Discarded Screenshots',
      visible: st.hasDiscarded,
      ...icon('reopen'),
      submenu: [
        { label: 'Reopen Last Discarded', click: () => a.reopenLast() },
        { label: 'Reopen Discarded…', click: () => a.reopenDiscarded() },
      ],
    },
    { type: 'separator' },
    {
      label: 'Settings',
      ...icon('settings'),
      submenu: [
        {
          label: 'Open at Login',
          type: 'checkbox',
          enabled: st.login.enabled,
          checked: st.login.checked,
          ...(st.login.needsApproval ? { sublabel: 'Allow in System Settings → Login Items' } : {}),
          click: (item) => a.setLogin(item.checked),
        },
        { label: 'Sessions Folder…', sublabel: st.root, enabled: st.canChangeRoot, click: () => a.chooseRoot() },
        { label: 'Clear Sessions Older Than 60 Days…', click: () => a.clearOldSessions() },
        { label: 'Keyboard Shortcuts', click: () => a.keyboardShortcuts() },
        { label: 'Check for Updates…', sublabel: `Snapmark ${st.version}`, enabled: st.canUpdate, click: () => a.checkUpdates() },
      ],
    },
    { label: 'Quit Snapmark', accelerator: 'Command+Q', ...icon('quit'), click: () => a.quit() },
  ];
}
