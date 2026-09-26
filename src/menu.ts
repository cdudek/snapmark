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
  shortcuts: { capture: string | null; newSession: string | null }; // null = not registered
  iconDir: string; // folder with the menu-<name>Template.png icons ('' = no icons, e.g. in tests)
  hasDiscarded: boolean; // something closed without saving, or removed, in the last 7 days
}

export interface MenuActions {
  capture(): void;
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

// Every label names what it acts on; the current session's actions sit under its header (owner, 2026-09-26).
// Icons are template images, so macOS tints them for light and dark menus.
export function menuTemplate(st: MenuState, a: MenuActions): Item[] {
  const icon = (n: string) => (st.iconDir ? { icon: `${st.iconDir}/menu-${n}Template.png` } : {});
  const cur = st.current;
  const on = !!cur;
  const name = cur?.name ?? '';
  return [
    ...(st.updateWaiting ? [{ label: `Restart to Update to ${st.updateWaiting}`, ...icon('update'), click: () => a.installUpdate() }] : []),
    { ...shortcut('Capture Screenshot', st.shortcuts.capture, () => a.capture()), ...icon('capture') },
    // Shown only when there is something to bring back.
    { label: 'Reopen Last Discarded', visible: st.hasDiscarded, click: () => a.reopenLast(), ...icon('reopen') },
    { label: 'Reopen Discarded…', visible: st.hasDiscarded, click: () => a.reopenDiscarded(), ...icon('finder') },
    { type: 'separator' },
    {
      label: cur ? `Current Session: ${cur.label}${cur.count ? ` · ${plural(cur.count)}` : ''}` : 'No Session Yet',
      type: 'header',
    },
    { label: 'Open Session', enabled: on, ...icon('open'), click: () => a.openFile(name) },
    { label: 'Copy Prompt for AI', enabled: on, ...icon('prompt'), click: () => a.copyPrompt(name) },
    { label: 'Copy session.md Path', enabled: on, ...icon('path'), click: () => a.copyPath(name) },
    { label: 'Rename Session…', enabled: on, ...icon('rename'), click: () => a.rename(name) },
    { label: 'Show Session in Finder', enabled: on, ...icon('finder'), click: () => a.showInFinder(name) },
    {
      label: 'Export Session',
      visible: !!cur?.count, // nothing to export from an empty session
      ...icon('export'),
      submenu: (['PDF', 'ZIP'] as const).map((kind) => ({ label: kind, click: () => a.exportAs(name, kind) })),
    },
    { type: 'separator' },
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
    { ...shortcut('New Session', st.shortcuts.newSession, () => a.newSession()), ...icon('new') },
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
        { label: 'Check for Updates…', enabled: st.canUpdate, click: () => a.checkUpdates() },
      ],
    },
    {
      label: 'Help',
      ...icon('help'),
      submenu: [
        { label: 'Keyboard Shortcuts', click: () => a.keyboardShortcuts() },
        { label: `Snapmark ${st.version}`, enabled: false },
      ],
    },
    { label: 'Quit Snapmark', accelerator: 'Command+Q', ...icon('quit'), click: () => a.quit() },
  ];
}
