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
  updateWaiting: string | null; // version downloaded and ready to install
  shortcuts: { capture: string | null; area: string | null; options: string | null; newSession: string | null }; // null = not registered
  area: Area | null; // what Capture Last Area captures; null until the first time
  iconDir: string; // folder with the menu-<name>Template.png icons ('' = no icons, e.g. in tests)
  hasDiscarded: boolean; // something closed without saving, or removed, in the last 7 days
}

export interface MenuActions {
  capture(): void;
  captureArea(): void;
  captureBar(): void; // Capture Options… (⌃⇧5): the capture bar
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
  settings(): void; // Settings… (⌘,): the Settings window
  keyboardShortcuts(): void; // ⌘/ in the app menu, and Settings ▸ Shortcuts ▸ Show All Shortcuts
  installUpdate(): void;
  quit(): void;
}

export const MAX_LISTED = 10;

// The quit warning: one-shot images are never in a session, so they are counted as not copied or saved.
export function quitMessage(inSession: number, oneShot: number): string {
  const n = inSession + oneShot;
  const is = n === 1 ? 'is' : 'are';
  if (!oneShot) return `${n} screenshot${n === 1 ? '' : 's'} ${is} not in a session yet.`;
  if (!inSession) return `${n} image${n === 1 ? '' : 's'} ${is} not copied or saved yet.`;
  return `${n} screenshots are not saved yet.`;
}

// The most recently used sessions; the current one takes the last row when it is older than those.
const recent = (sessions: SessionInfo[], cur: SessionInfo | null) => {
  const top = sessions.slice(0, MAX_LISTED);
  const own = cur && sessions.find((s) => s.name === cur.name);
  return own && !top.includes(own) ? [...top.slice(0, MAX_LISTED - 1), own] : top;
};

// macOS 13+ registers login items with SMAppService; Electron's openAtLogin can read false there while
// status is 'enabled', so either one counts. 'requires-approval' means the owner must allow it in System Settings.
export interface LoginState {
  enabled: boolean; // false in a development build, which would register the bare Electron binary
  checked: boolean;
  needsApproval: boolean;
}

export function loginState(packaged: boolean, s: { openAtLogin: boolean; status?: string }): LoginState {
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
    // The less frequent ways to capture live in the capture bar, as macOS's ⇧⌘5 (ADR capture bar and Settings window).
    { ...shortcut('Capture Options…', st.shortcuts.options, () => a.captureBar()), ...icon('choose') },
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
          enabled: st.sessions.some((s) => s.name !== cur?.name), // greyed while there is nothing to switch to
          ...icon('switch'),
          submenu: [
            ...recent(st.sessions, cur).map((s): Item => ({
              label: s.label,
              type: 'checkbox',
              checked: s.name === cur?.name,
              click: () => a.makeCurrent(s.name),
            })),
            ...(st.sessions.length > MAX_LISTED
              ? [{ type: 'separator' } as Item, { label: 'Older Sessions…', click: () => a.otherSession() }]
              : []),
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
    // Everything that was the Settings submenu is in the Settings window (ADR capture bar and Settings window).
    { label: 'Settings…', accelerator: 'Command+,', ...icon('settings'), click: () => a.settings() },
    { label: 'Quit Snapmark', accelerator: 'Command+Q', ...icon('quit'), click: () => a.quit() },
  ];
}

// Snapmark's own app menu, the smallest one that gives ⌘, and ⌘/ while an editor or session window is in front.
// File, Edit, View and Window stay Electron's stock roles, so ⌘C, ⌘V, ⌘W and the rest keep working.
export function appMenu(a: Pick<MenuActions, 'settings' | 'keyboardShortcuts'>): Item[] {
  return [
    {
      label: 'Snapmark',
      submenu: [
        { role: 'about', label: 'About Snapmark' },
        { type: 'separator' },
        { label: 'Settings…', accelerator: 'Command+,', click: () => a.settings() },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide', label: 'Hide Snapmark' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit', label: 'Quit Snapmark' },
      ],
    },
    { role: 'fileMenu' },
    { role: 'editMenu' },
    { role: 'viewMenu' },
    { role: 'windowMenu' },
  ];
}

// The editor's session label (spec M1): the 10 recent sessions, this editor's ticked, then New Session. A pick moves
// the editor's screenshot to that session and makes it the current one.
export interface EditorSessionActions {
  moveTo(name: string): void;
  newSession(): void;
}

export function editorSessionMenu(st: MenuState, session: string, a: EditorSessionActions): Item[] {
  const own = st.sessions.find((s) => s.name === session) ?? null;
  return [
    ...recent(st.sessions, own).map((s): Item => ({
      label: s.label,
      type: 'checkbox',
      checked: s.name === session,
      click: () => a.moveTo(s.name),
    })),
    { type: 'separator' },
    {
      label: 'New Session',
      ...(st.shortcuts.newSession ? { accelerator: st.shortcuts.newSession, registerAccelerator: false } : {}),
      click: () => a.newSession(),
    },
  ];
}

// The editor's Copy or Save button: the two buttons it replaces. The keys are the editor page's own, so the menu only
// shows them.
export function copyMenu(a: { copyImage(): void; saveAs(): void }): Item[] {
  return [
    { label: 'Copy Image', accelerator: 'Shift+Command+C', registerAccelerator: false, click: () => a.copyImage() },
    { label: 'Save As…', accelerator: 'Shift+Command+S', registerAccelerator: false, click: () => a.saveAs() },
  ];
}
