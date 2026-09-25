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
  openRoot(): void;
  chooseRoot(): void;
  setLogin(checked: boolean): void;
  checkUpdates(): void;
  installUpdate(): void;
  quit(): void;
}

export const MAX_LISTED = 20;

const plural = (n: number) => `${n} screenshot${n === 1 ? '' : 's'}`;

function shortcut(label: string, accelerator: string | null, click: () => void): Item {
  return accelerator ? { label, accelerator, click } : { label: `${label} (shortcut unavailable)`, click };
}

function exportMenu(s: SessionInfo, a: MenuActions): Item {
  return {
    label: 'Export',
    enabled: s.count > 0,
    submenu: (['ZIP', 'PDF'] as const).map((kind) => ({ label: kind, click: () => a.exportAs(s.name, kind) })),
  };
}

export function menuTemplate(st: MenuState, a: MenuActions): Item[] {
  const cur = st.current;
  const on = !!cur;
  const name = cur?.name ?? '';
  return [
    { label: 'Snapmark', type: 'header' },
    ...(st.updateWaiting ? [{ label: `Restart to install ${st.updateWaiting}`, click: () => a.installUpdate() }] : []),
    shortcut('Capture region', st.shortcuts.capture, () => a.capture()),
    shortcut('New session', st.shortcuts.newSession, () => a.newSession()),
    { type: 'separator' },
    {
      label: cur ? `Current session: ${cur.label} · ${plural(cur.count)}` : 'No session yet: press ⇧⌘1 to start one',
      type: 'header',
    },
    { label: 'Copy prompt for AI', enabled: on, click: () => a.copyPrompt(name) },
    { label: 'Copy file path', enabled: on, click: () => a.copyPath(name) },
    { label: 'Open feedback file', enabled: on, click: () => a.openFile(name) },
    { label: 'Show in Finder', enabled: on, click: () => a.showInFinder(name) },
    { label: 'Rename session…', enabled: on, click: () => a.rename(name) },
    cur ? exportMenu(cur, a) : { label: 'Export', enabled: false },
    { type: 'separator' },
    {
      label: 'Switch session',
      submenu: [
        ...st.sessions.slice(0, MAX_LISTED).map((s): Item => ({
          label: s.name === cur?.name ? `${s.label} (current)` : s.label,
          submenu: [
            { label: 'Make current', enabled: s.name !== cur?.name, click: () => a.makeCurrent(s.name) },
            { label: 'Copy prompt for AI', click: () => a.copyPrompt(s.name) },
            exportMenu(s, a),
            { label: 'Show in Finder', click: () => a.showInFinder(s.name) },
          ],
        })),
        ...(st.sessions.length ? [{ type: 'separator' } as Item] : []),
        { label: 'Other session…', click: () => a.otherSession() },
      ],
    },
    {
      label: 'Settings',
      submenu: [
        {
          label: 'Open at login',
          type: 'checkbox',
          enabled: st.login.enabled,
          checked: st.login.checked,
          click: (item) => a.setLogin(item.checked),
        },
        { label: `Sessions are saved in ${st.root}`, click: () => a.openRoot() },
        { label: 'Change where sessions are saved…', enabled: st.canChangeRoot, click: () => a.chooseRoot() },
        { label: 'Check for updates…', enabled: st.canUpdate, click: () => a.checkUpdates() },
        { label: `Version ${st.version}`, enabled: false },
      ],
    },
    { label: 'Quit Snapmark', accelerator: 'Command+Q', click: () => a.quit() },
  ];
}
