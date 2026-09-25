import { app, BrowserWindow, Tray, Menu, clipboard, dialog, globalShortcut, ipcMain, nativeImage, shell, Notification } from 'electron';
import { execFile } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { autoUpdater } from 'electron-updater';
import * as sessions from './sessions';
import { exportPdf, exportZip } from './exporter';

const DEFAULT_ROOT = path.join(os.homedir(), 'Documents', 'Snapmark');
const SHORTCUT_CAPTURE = 'CommandOrControl+Shift+1';
const SHORTCUT_NEW = 'CommandOrControl+Shift+2';

const statePath = () => path.join(app.getPath('userData'), 'state.json');
// SNAPMARK_ROOT (tests, dev) wins over the folder chosen in the menu.
let root = process.env.SNAPMARK_ROOT || DEFAULT_ROOT;
let active: string | null = null;
let tray: Tray | null = null;
const editors = new Map<number, { image: string; root: string; session: string }>(); // keyed by webContents.id

function loadState() {
  try {
    const state = JSON.parse(fs.readFileSync(statePath(), 'utf8'));
    active = state.active;
    if (!process.env.SNAPMARK_ROOT && state.root) root = state.root;
  } catch {
    // no state yet
  }
  if (!active || !sessions.list(root).includes(active)) active = sessions.list(root)[0] || null;
}

function saveState() {
  fs.mkdirSync(path.dirname(statePath()), { recursive: true });
  fs.writeFileSync(statePath(), JSON.stringify({ active, root }));
  refreshTray();
}

export function setActive(name: string) {
  active = name;
  saveState();
}

// Point Snapmark at another folder, e.g. inside iCloud Drive or Google Drive, so sessions sync.
async function chooseRoot() {
  app.focus({ steal: true });
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: 'Choose where Snapmark keeps sessions',
    defaultPath: root,
    properties: ['openDirectory', 'createDirectory'],
  });
  if (canceled || !filePaths[0]) return;
  root = filePaths[0];
  active = sessions.list(root)[0] || null;
  saveState();
}

const tilde = (p: string) => (p.startsWith(os.homedir()) ? `~${p.slice(os.homedir().length)}` : p);

function newSession() {
  setActive(sessions.create(root));
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
  const session = active ?? sessions.create(root);
  setActive(session);
  const { width, height } = nativeImage.createFromPath(image).getSize();
  const win = new BrowserWindow({
    width: Math.min(Math.max(width / 2 + 340, 900), 1600),
    height: Math.min(Math.max(height / 2 + 120, 600), 1000),
    title: `Snapmark — ${session}`,
    webPreferences: { preload: path.join(__dirname, 'preload.js') },
  });
  editors.set(win.webContents.id, { image, root, session });
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

// Claude resizes images above 1568 px on the long edge or ~1.15 megapixels, so anything larger only
// costs upload time and disk. Retina captures are 2x, so most crops land here.
const MAX_EDGE = 1568;
const MAX_PIXELS = 1_150_000;

export function fitForAI(png: Buffer): Buffer {
  const img = nativeImage.createFromBuffer(png);
  const { width, height } = img.getSize();
  const scale = Math.min(1, MAX_EDGE / Math.max(width, height), Math.sqrt(MAX_PIXELS / (width * height)));
  if (scale === 1) return png;
  return img.resize({ width: Math.round(width * scale), height: Math.round(height * scale), quality: 'best' }).toPNG();
}

ipcMain.handle('editor:save', (e, { png, caption, notes, cards, moves }: EditorSave): number => {
  const { root: into, session } = editorFor(e.sender.id);
  const n = sessions.addShot(into, session, fitForAI(Buffer.from(png, 'base64')), { caption, notes, cards, moves });
  BrowserWindow.fromWebContents(e.sender)?.close();
  return n;
});

// Downloads in the background and notifies; the update installs on next quit. Offline or no release: log only.
function checkForUpdates() {
  autoUpdater.checkForUpdatesAndNotify().catch((e: unknown) => console.error('Update check failed:', e));
}

// Pasted into an agent's chat: points it at the session and explains the marks, so the notes need no preamble.
export function promptFor(dir: string): string {
  return [
    `Work through the visual feedback in "${path.join(dir, 'session.md')}".`,
    'Each entry is an annotated screenshot. The numbered notes below it refer to the numbered markers on the image.',
    'Red crosses and hatched areas mean remove. Green ticks and thumbs-up mean keep as is. Boxes, ellipses and arrows point at what a note is about.',
  ].join('\n');
}

async function runExport(kind: 'ZIP' | 'PDF', dir: string) {
  try {
    shell.showItemInFolder(await (kind === 'ZIP' ? exportZip(dir) : exportPdf(dir)));
  } catch (e) {
    new Notification({ title: `Snapmark: ${kind} export failed`, body: String(e) }).show();
  }
}

function refreshTray() {
  if (!tray) return;
  const list = sessions.list(root);
  const dir = active ? path.join(root, active) : null;
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
      { label: 'Copy prompt for AI', enabled: !!dir, click: () => dir && clipboard.writeText(promptFor(dir)) },
      {
        label: 'Export session',
        enabled: !!dir,
        submenu: (['ZIP', 'PDF'] as const).map((kind) => ({ label: kind, click: () => dir && void runExport(kind, dir) })),
      },
      { type: 'separator' },
      { label: `Sessions folder: ${tilde(root)}`, enabled: false },
      { label: 'Change sessions folder…', enabled: !process.env.SNAPMARK_ROOT, click: () => void chooseRoot() },
      { type: 'separator' },
      {
        label: 'Open at login',
        type: 'checkbox',
        // Only for the installed app: in development it would register the bare Electron binary.
        enabled: app.isPackaged,
        checked: app.isPackaged && app.getLoginItemSettings().openAtLogin,
        click: (item) => app.setLoginItemSettings({ openAtLogin: item.checked }),
      },
      { label: `Snapmark ${app.getVersion()}`, enabled: false },
      { label: 'Check for updates…', enabled: app.isPackaged, click: checkForUpdates },
      { label: 'Quit', role: 'quit' },
    ]),
  );
}

app.whenReady().then(() => {
  if (process.env.SNAPMARK_NO_UI) return; // test harness drives the app itself
  app.dock?.hide();
  loadState();
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
