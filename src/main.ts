import { app, BrowserWindow, Tray, Menu, clipboard, dialog, globalShortcut, ipcMain, nativeImage, shell, Notification } from 'electron';
import { execFile } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { autoUpdater } from 'electron-updater';
import * as sessions from './sessions';
import { exportPdf, exportZip } from './exporter';
import { menuTemplate, loginState, MenuActions, MenuState, SessionInfo } from './menu';
// tools.ts is a classic script shared with the editor page, so it has no ES export to import.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { GROUPS: TOOLS } = require('./tools') as { GROUPS: ToolGroup[] };

const DEFAULT_ROOT = path.join(os.homedir(), 'Documents', 'Snapmark');
const SHORTCUT_CAPTURE = 'CommandOrControl+Shift+1';
const SHORTCUT_NEW = 'CommandOrControl+Shift+2';

const statePath = () => path.join(app.getPath('userData'), 'state.json');
// SNAPMARK_ROOT (tests, dev) wins over the folder chosen in the menu.
let root = process.env.SNAPMARK_ROOT || DEFAULT_ROOT;
let active: string | null = null;
let used: Record<string, number> = {}; // session name → last made current or saved into, epoch ms
let tray: Tray | null = null;
let updateWaiting: string | null = null;
let quitting = false; // set by "Quit anyway" so the quit guard lets go
const registered = new Set<string>(); // global shortcuts macOS let us have
// keyed by webContents.id; dirty = marks or text not saved yet
const editors = new Map<number, { image: string; root: string; session: string; win: BrowserWindow; dirty: boolean }>();

function loadState() {
  try {
    const state = JSON.parse(fs.readFileSync(statePath(), 'utf8'));
    active = state.active;
    used = state.used ?? {};
    if (!process.env.SNAPMARK_ROOT && state.root) root = state.root;
  } catch {
    // no state yet
  }
  if (!active || !sessions.list(root).includes(active)) active = sessions.list(root)[0] || null;
}

function saveState() {
  fs.mkdirSync(path.dirname(statePath()), { recursive: true });
  fs.writeFileSync(statePath(), JSON.stringify({ active, root, used }));
}

export function setActive(name: string) {
  active = name;
  used[name] = Date.now();
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

function notify(body: string, onClick?: () => void) {
  const n = new Notification({ title: 'Snapmark', body });
  if (onClick) n.on('click', onClick);
  n.show();
}

const dirOf = (name: string) => path.join(root, name);

function newSession() {
  // Pressing ⇧⌘2 twice must not leave empty sessions behind.
  if (active && fs.existsSync(dirOf(active)) && sessions.count(root, active) === 0)
    return notify(`${sessions.shortName(active)} is still empty, so new captures keep going there.`);
  setActive(sessions.create(root));
  notify(`New session: ${active}`);
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
  // 1180 px minimum fits the whole toolbar on one line.
  const win = new BrowserWindow({
    width: Math.min(Math.max(width / 2 + 340, 1180), 1600),
    height: Math.min(Math.max(height / 2 + 120, 600), 1000),
    title: `Snapmark — ${session}`,
    webPreferences: { preload: path.join(__dirname, 'preload.js') },
  });
  const id = win.webContents.id;
  editors.set(id, { image, root, session, win, dirty: false });
  void app.dock?.show(); // an open editor is visible in the Dock
  win.on('closed', () => {
    editors.delete(id);
    if (!editors.size) app.dock?.hide();
    fs.rmSync(image, { force: true });
  });
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
  used[session] = Date.now();
  saveState();
  BrowserWindow.fromWebContents(e.sender)?.close();
  return n;
});

ipcMain.on('editor:dirty', (e, value: boolean) => {
  const ed = editors.get(e.sender.id);
  if (ed) ed.dirty = value;
});

// Background check: downloads and notifies once; the update installs on next quit. Offline or no release: log only.
function checkForUpdates() {
  autoUpdater.checkForUpdatesAndNotify().catch((e: unknown) => console.error('Update check failed:', e));
}

// The owner asked, so always answer.
async function checkForUpdatesNow() {
  try {
    const r = await autoUpdater.checkForUpdates();
    if (!r) return notify("Couldn't check for updates: this build has no update feed.");
    notify(r.isUpdateAvailable ? `Downloading Snapmark ${r.updateInfo.version}…` : `Snapmark ${app.getVersion()} is up to date.`);
  } catch (e) {
    notify(`Couldn't check for updates: ${e instanceof Error ? e.message : String(e)}`);
  }
}
autoUpdater.on('update-downloaded', (info) => (updateWaiting = info.version));

// Pasted into an agent's chat: points it at the session and explains the marks, so the notes need no preamble.
// The one place the Markdown path is built, so "Copy session.md path" and the AI prompt never disagree.
export function sessionMdPath(dir: string): string {
  return path.resolve(dir, 'session.md');
}

export function promptFor(dir: string): string {
  return [
    `Work through the visual feedback in "${sessionMdPath(dir)}".`,
    'Each entry is an annotated screenshot. The numbered list below it holds the notes for the references (numbered circles) on the image.',
    'What the marks mean:',
    ...TOOLS.flatMap((g) => g.tools)
      .filter((t) => t.means)
      .map((t) => `- ${t.label}: ${t.means}.`),
  ].join('\n');
}

async function runExport(kind: 'ZIP' | 'PDF', dir: string) {
  try {
    shell.showItemInFolder(await (kind === 'ZIP' ? exportZip(dir) : exportPdf(dir)));
  } catch (e) {
    new Notification({ title: `Snapmark: ${kind} export failed`, body: String(e) }).show();
  }
}

const info = (name: string): SessionInfo => ({ name, label: sessions.shortName(name), count: sessions.count(root, name) });

function menuState(): MenuState {
  const list = sessions.list(root);
  return {
    current: active && list.includes(active) ? info(active) : null,
    sessions: sessions.byLastUse(list, used).map(info),
    root: tilde(root),
    canChangeRoot: !process.env.SNAPMARK_ROOT,
    login: loginState(app.isPackaged, app.getLoginItemSettings()),
    version: app.getVersion(),
    canUpdate: app.isPackaged,
    updateWaiting,
    shortcuts: {
      capture: registered.has(SHORTCUT_CAPTURE) ? SHORTCUT_CAPTURE : null,
      newSession: registered.has(SHORTCUT_NEW) ? SHORTCUT_NEW : null,
    },
    iconDir: path.join(__dirname, '../../assets'),
  };
}

// Built on every open, so counts and sessions changed in Finder are never stale.
function popMenu() {
  tray?.popUpContextMenu(Menu.buildFromTemplate(menuTemplate(menuState(), actions)));
}

// A session moved or deleted outside Snapmark: say so instead of doing nothing.
function exists(name: string, file = ''): boolean {
  if (fs.existsSync(path.join(dirOf(name), file))) return true;
  notify(`${sessions.shortName(name)} is no longer in ${tilde(root)}`, popMenu);
  return false;
}

// Native text prompt; Cancel makes osascript exit non-zero, which changes nothing.
function renameSession(name: string) {
  const script = [
    'on run argv',
    'text returned of (display dialog "Rename session" default answer (item 1 of argv) buttons {"Cancel", "Rename"} default button "Rename")',
    'end run',
  ];
  execFile('osascript', [...script.flatMap((l) => ['-e', l]), name], (err, stdout) => {
    const wanted = stdout?.trim();
    if (err || !wanted || wanted === name) return;
    const to = sessions.rename(root, name, wanted);
    if (!to) return notify(`A session named ${wanted} already exists.`);
    if (active === name) active = to;
    used[to] = used[name] ?? Date.now();
    delete used[name];
    for (const ed of editors.values()) if (ed.root === root && ed.session === name) ed.session = to;
    saveState();
  });
}

async function otherSession() {
  app.focus({ steal: true });
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: 'Choose a session',
    defaultPath: root,
    properties: ['openDirectory'],
  });
  const dir = filePaths[0];
  if (canceled || !dir) return;
  if (path.dirname(dir) !== path.resolve(root) || !fs.existsSync(path.join(dir, 'session.md')))
    return notify(`That folder is not a session in ${tilde(root)}.`);
  setActive(path.basename(dir));
}

const esc = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;');
let shortcutsWin: BrowserWindow | null = null;

// Built from the same tool list as the toolbar, so the two never disagree. No script, so the page needs no CSP exception.
function showShortcuts() {
  if (shortcutsWin && !shortcutsWin.isDestroyed()) return shortcutsWin.focus();
  const row = (keys: string, icon: string, name: string, what: string) =>
    `<tr><td><kbd>${keys}</kbd></td><td>${icon && `<svg viewBox="0 0 24 24">${icon}</svg>`}</td><td><b>${esc(name)}</b></td><td>${esc(what)}</td></tr>`;
  const tools = TOOLS.flatMap((g) =>
    g.tools.map((t, v) => row(v ? `${g.key.toUpperCase()} again` : g.key.toUpperCase(), t.icon, t.label, t.tip ?? t.means ?? '')),
  ).join('');
  const other = [
    ['⇧⌘1', 'Capture region', 'anywhere'],
    ['⇧⌘2', 'New session', 'anywhere'],
    ['Esc', 'Step back', 'out of the text, then deselect, then back to Select'],
    ['⌫', 'Delete', 'the selected mark'],
    ['⌘Z', 'Undo', ''],
    ['⌘↵', 'Add to session', ''],
    ['⌘W', 'Discard', 'the screenshot'],
  ]
    .map(([k, n, w]) => row(k, '', n, w))
    .join('');
  const html = `<!doctype html><meta charset="utf-8"><title>Keyboard shortcuts</title><style>
    :root{color-scheme:light dark;font:13px -apple-system,system-ui,sans-serif}body{margin:16px}
    h2{font-size:13px;margin:16px 0 6px}table{border-collapse:collapse;width:100%}td{padding:4px 6px;vertical-align:middle}
    kbd{font:600 11px ui-monospace,monospace;white-space:nowrap}
    svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
    </style><h2>Editor tools</h2><table>${tools}</table><h2>Other keys</h2><table>${other}</table>`;
  shortcutsWin = new BrowserWindow({ width: 520, height: 640, title: 'Keyboard shortcuts' });
  void shortcutsWin.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);
  app.focus({ steal: true });
}

const actions: MenuActions = {
  capture,
  newSession,
  copyPrompt: (name) => {
    clipboard.writeText(promptFor(dirOf(name)));
    notify(`Prompt for ${sessions.shortName(name)} copied. Paste it into your AI agent.`);
  },
  copyPath: (name) => {
    clipboard.writeText(sessionMdPath(dirOf(name)));
    notify(`Path to ${sessions.shortName(name)} copied.`);
  },
  openFile: (name) => exists(name, 'session.md') && void shell.openPath(sessionMdPath(dirOf(name))),
  showInFinder: (name) => exists(name) && void shell.openPath(dirOf(name)),
  rename: renameSession,
  exportAs: (name, kind) => void runExport(kind, dirOf(name)),
  makeCurrent: setActive,
  otherSession: () => void otherSession(),
  chooseRoot: () => void chooseRoot(),
  setLogin: (checked) => app.setLoginItemSettings({ openAtLogin: checked }),
  keyboardShortcuts: showShortcuts,
  checkUpdates: () => void checkForUpdatesNow(),
  installUpdate: () => autoUpdater.quitAndInstall(),
  quit: () => app.quit(),
};

app.whenReady().then(() => {
  if (process.env.SNAPMARK_NO_UI) return; // test harness drives the app itself
  app.dock?.hide();
  loadState();
  // "Template" in the file name makes macOS tint the icon for light and dark menu bars; @2x is picked up automatically.
  tray = new Tray(path.join(__dirname, '../../assets/trayTemplate.png'));
  tray.setToolTip('Snapmark');
  tray.on('click', popMenu);
  tray.on('right-click', popMenu);
  if (app.isPackaged) {
    checkForUpdates();
    setInterval(checkForUpdates, 24 * 60 * 60 * 1000); // a menu bar app runs for days: check once a day, not only at start
  }
  for (const [key, fn] of [
    [SHORTCUT_CAPTURE, capture],
    [SHORTCUT_NEW, newSession],
  ] as const) {
    if (globalShortcut.register(key, fn)) registered.add(key);
    else notify(`${key} is taken by another app`);
  }
});

app.on('window-all-closed', () => {}); // menu bar app: keep running

// Quit (menu, ⌘Q, restart, update) must not silently throw away screenshots that are not in a session yet.
app.on('before-quit', (e) => {
  const open = [...editors.values()].filter((ed) => ed.dirty && !ed.win.isDestroyed());
  if (quitting || !open.length) return;
  e.preventDefault();
  const first = open[0].win;
  first.show();
  first.focus();
  app.focus({ steal: true });
  const n = open.length;
  void dialog
    .showMessageBox(first, {
      type: 'warning',
      message: `${n} screenshot${n === 1 ? ' is' : 's are'} not in a session yet.`,
      buttons: ['Review', 'Quit anyway'],
      defaultId: 0,
      cancelId: 0,
    })
    .then(({ response }) => {
      if (response !== 1) return;
      quitting = true;
      app.quit();
    });
});
app.on('will-quit', () => globalShortcut.unregisterAll());
