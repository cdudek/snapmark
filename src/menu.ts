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
  login: { enabled: boolean; checked: boolean };
  version: string;
  canUpdate: boolean;
  updateWaiting: string | null; // version downloaded and ready to install
  shortcuts: { capture: string | null; newSession: string | null }; // null = not registered
}

export interface MenuActions {
  capture(): void;
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

function shortcut(label: string, accelerator: string | null, click: () => void): Item {
  return accelerator ? { label, accelerator, click } : { label: `${label} (shortcut unavailable)`, click };
}

// Short labels in macOS title case, one header, at most two levels (audit of 2026-09-26).
export function menuTemplate(st: MenuState, a: MenuActions): Item[] {
  const cur = st.current;
  const on = !!cur;
  const name = cur?.name ?? '';
  return [
    ...(st.updateWaiting ? [{ label: `Restart to Update to ${st.updateWaiting}`, click: () => a.installUpdate() }] : []),
    shortcut('Capture', st.shortcuts.capture, () => a.capture()),
    { type: 'separator' },
    { label: cur ? `${cur.label}${cur.count ? ` · ${cur.count}` : ''}` : 'No session yet', type: 'header' },
    { label: 'Copy for AI', enabled: on, click: () => a.copyPrompt(name) },
    { label: 'Copy Path', enabled: on, click: () => a.copyPath(name) },
    { label: 'Open', enabled: on, click: () => a.openFile(name) },
    {
      label: 'Export',
      visible: !!cur?.count, // nothing to export from an empty session
      submenu: (['PDF', 'ZIP'] as const).map((kind) => ({ label: kind, click: () => a.exportAs(name, kind) })),
    },
    { type: 'separator' },
    {
      label: 'Sessions',
      submenu: [
        ...st.sessions
          .slice(0, MAX_LISTED)
          .map((s): Item => ({ label: s.label, type: 'checkbox', checked: s.name === cur?.name, click: () => a.makeCurrent(s.name) })),
        ...(st.sessions.length ? [{ type: 'separator' } as Item] : []),
        shortcut('New Session', st.shortcuts.newSession, () => a.newSession()),
        { label: 'Rename…', enabled: on, click: () => a.rename(name) },
        { label: 'Show in Finder', enabled: on, click: () => a.showInFinder(name) },
        { label: 'Other…', click: () => a.otherSession() },
      ],
    },
    {
      label: 'Settings',
      submenu: [
        {
          label: 'Open at Login',
          type: 'checkbox',
          enabled: st.login.enabled,
          checked: st.login.checked,
          click: (item) => a.setLogin(item.checked),
        },
        { label: 'Sessions Folder…', sublabel: st.root, enabled: st.canChangeRoot, click: () => a.chooseRoot() },
        { label: 'Check for Updates…', enabled: st.canUpdate, click: () => a.checkUpdates() },
      ],
    },
    {
      label: 'Help',
      submenu: [
        { label: 'Keyboard Shortcuts', click: () => a.keyboardShortcuts() },
        { label: `Snapmark ${st.version}`, enabled: false },
      ],
    },
    { label: 'Quit', accelerator: 'Command+Q', click: () => a.quit() },
  ];
}
