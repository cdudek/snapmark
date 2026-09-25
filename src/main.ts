import { app, BrowserWindow, Tray, Menu, globalShortcut, ipcMain, nativeImage, shell, Notification } from 'electron';
import { execFile } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { autoUpdater } from 'electron-updater';
import * as sessions from './sessions';

export const ROOT = process.env.SNAPMARK_ROOT || path.join(os.homedir(), 'Documents', 'Snapmark');
const SHORTCUT_CAPTURE = 'CommandOrControl+Shift+1';
const SHORTCUT_NEW = 'CommandOrControl+Shift+2';

const statePath = () => path.join(app.getPath('userData'), 'state.json');
let active: string | null = null;
let tray: Tray | null = null;
const editors = new Map<number, { image: string; session: string }>(); // keyed by webContents.id

function loadActive() {
  try {
    active = JSON.parse(fs.readFileSync(statePath(), 'utf8')).active;
  } catch {
    // no state yet
  }
  if (!active || !sessions.list(ROOT).includes(active)) active = sessions.list(ROOT)[0] || null;
}

export function setActive(name: string) {
  active = name;
  fs.mkdirSync(path.dirname(statePath()), { recursive: true });
  fs.writeFileSync(statePath(), JSON.stringify({ active }));
  refreshTray();
}

function newSession() {
  setActive(sessions.create(ROOT));
  new Notification({ title: 'Snapmark', body: `New session: ${active}` }).show();
}

function capture() {
  const tmp = path.join(os.tmpdir(), `snapmark-${Date.now()}.png`);
  // -i: interactive region (space toggles window mode), -x: no sound
  execFile('screencapture', ['-i', '-x', tmp], () => {
    if (fs.existsSync(tmp)) openEditor(tmp); // missing file = user pressed Esc
  });
}

export function openEditor(image: string): BrowserWindow {
  const session = active ?? sessions.create(ROOT);
  setActive(session);
  const { width, height } = nativeImage.createFromPath(image).getSize();
  const win = new BrowserWindow({
    width: Math.min(Math.max(width / 2 + 340, 900), 1600),
    height: Math.min(Math.max(height / 2 + 120, 600), 1000),
    title: `Snapmark — ${session}`,
    webPreferences: { preload: path.join(__dirname, 'preload.js') },
  });
  editors.set(win.webContents.id, { image, session });
  win.on('closed', () => fs.rmSync(image, { force: true }));
  win.loadFile(path.join(__dirname, 'editor.html'));
  app.focus({ steal: true });
  return win;
}

function editorFor(id: number) {
  const ed = editors.get(id);
  if (!ed) throw new Error(`No editor for webContents ${id}`);
  return ed;
}

ipcMain.handle('editor:init', (e): EditorInit => {
  const { image, session } = editorFor(e.sender.id);
  return { src: `data:image/png;base64,${fs.readFileSync(image, 'base64')}`, session };
});

ipcMain.handle('editor:save', (e, { png, caption, notes }: EditorSave): number => {
  const { session } = editorFor(e.sender.id);
  const n = sessions.addShot(ROOT, session, Buffer.from(png, 'base64'), { caption, notes });
  BrowserWindow.fromWebContents(e.sender)?.close();
  return n;
});

// Downloads in the background and notifies; the update installs on next quit. Offline or no release: log only.
function checkForUpdates() {
  autoUpdater.checkForUpdatesAndNotify().catch((e: unknown) => console.error('Update check failed:', e));
}

function refreshTray() {
  if (!tray) return;
  const list = sessions.list(ROOT);
  const dir = active ? path.join(ROOT, active) : null;
  tray.setContextMenu(
    Menu.buildFromTemplate([
      { label: `Session: ${active || '—'}`, enabled: false },
      { label: 'Capture region', accelerator: SHORTCUT_CAPTURE, click: capture },
      { label: 'New session', accelerator: SHORTCUT_NEW, click: newSession },
      {
        label: 'Switch session',
        enabled: list.length > 0,
        submenu: list.slice(0, 20).map((s) => ({ label: s, type: 'radio', checked: s === active, click: () => setActive(s) })),
      },
      { type: 'separator' },
      { label: 'Open session.md', enabled: !!dir, click: () => dir && shell.openPath(path.join(dir, 'session.md')) },
      { label: 'Show session folder', enabled: !!dir, click: () => dir && shell.openPath(dir) },
      { type: 'separator' },
      { label: `Snapmark ${app.getVersion()}`, enabled: false },
      { label: 'Check for updates…', enabled: app.isPackaged, click: checkForUpdates },
      { label: 'Quit', role: 'quit' },
    ]),
  );
}

app.whenReady().then(() => {
  if (process.env.SNAPMARK_NO_UI) return; // test harness drives the app itself
  app.dock?.hide();
  loadActive();
  // "Template" in the file name makes macOS tint the icon for light and dark menu bars; @2x is picked up automatically.
  tray = new Tray(path.join(__dirname, '../../assets/trayTemplate.png'));
  tray.setToolTip('Snapmark');
  refreshTray();
  if (app.isPackaged) checkForUpdates();
  for (const [key, fn] of [
    [SHORTCUT_CAPTURE, capture],
    [SHORTCUT_NEW, newSession],
  ] as const) {
    if (!globalShortcut.register(key, fn)) new Notification({ title: 'Snapmark', body: `${key} is taken by another app` }).show();
  }
});

app.on('window-all-closed', () => {}); // menu bar app: keep running
app.on('will-quit', () => globalShortcut.unregisterAll());
