import { app, BrowserWindow, Tray, Menu, clipboard, dialog, globalShortcut, ipcMain, nativeImage, shell, Notification } from 'electron';
import { execFile } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { pathToFileURL } from 'url';
import { autoUpdater } from 'electron-updater';
import * as sessions from './sessions';
import { exportPdf, exportZip } from './exporter';
import { menuTemplate, loginState, MenuActions, MenuState, SessionInfo } from './menu';
// tools.ts is a classic script shared with the editor page, so it has no ES export to import.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { GROUPS: TOOLS } = require('./tools') as { GROUPS: ToolGroup[] };

const DEFAULT_ROOT = path.join(os.homedir(), 'Documents', 'Snapmark');
// No ⌘: ⌘ keys belong to the app in front, and ⇧⌘1 sat next to Chrome's ⌘1 for tab 1 (owner, 2026-09-28).
const SHORTCUT_CAPTURE = 'Control+Shift+1';
const SHORTCUT_NEW = 'Control+Shift+2';

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
// state = marks to put back; replace = Edit Again's entry number
interface EditorWin {
  image: string;
  root: string;
  session: string;
  win: BrowserWindow;
  dirty: boolean;
  state?: EditState;
  replace?: number;
}
const editors = new Map<number, EditorWin>();
// Session viewers, keyed by webContents.id; known = the session.md text the window shows
const viewers = new Map<number, { root: string; session: string; win: BrowserWindow; known: string }>();
// The Dock icon shows while any Snapmark window is open.
const updateDock = () => (editors.size || viewers.size ? void app.dock?.show() : app.dock?.hide());

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
  // Pressing ⌃⇧2 twice must not leave empty sessions behind.
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

// Opens the editor on a screenshot file, which it owns and deletes on close. `session` is where it saves (default:
// the current one); `state` puts marks back; `replace` makes saving replace that entry (Edit Again).
export function openEditor(image: string, opts: { session?: string; state?: EditState; replace?: number } = {}): BrowserWindow {
  const session = opts.session ?? active ?? sessions.create(root);
  if (!opts.replace) setActive(session);
  const { width, height } = nativeImage.createFromPath(image).getSize();
  // 1180 px minimum fits the whole toolbar on one line.
  const win = new BrowserWindow({
    width: Math.min(Math.max(width / 2 + 340, 1180), 1600),
    height: Math.min(Math.max(height / 2 + 120, 600), 1000),
    title: `Snapmark — ${session}`,
    webPreferences: { preload: path.join(__dirname, 'preload.js') },
  });
  const id = win.webContents.id;
  editors.set(id, { image, root, session, win, dirty: false, state: opts.state, replace: opts.replace });
  updateDock();
  win.on('closed', () => {
    editors.delete(id);
    updateDock();
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
  const { image, session, state, replace } = editorFor(e.sender.id);
  return { src: `data:image/png;base64,${fs.readFileSync(image, 'base64')}`, session, state, replacing: replace };
});

// Sent synchronously while the window unloads without a save, so the capture is kept before the window is gone.
ipcMain.on('editor:stash', (e, state: EditState) => {
  const ed = editors.get(e.sender.id);
  if (ed && fs.existsSync(ed.image)) sessions.discardCapture(ed.root, ed.session, ed.image, JSON.stringify(state));
  e.returnValue = null;
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

ipcMain.handle('editor:save', async (e, { png, caption, notes, cards, moves, state }: EditorSave): Promise<number> => {
  const { root: into, session, image, replace } = editorFor(e.sender.id);
  for (const v of viewers.values()) if (v.root === into && v.session === session) await flushViewer(v);
  const out = fitForAI(Buffer.from(png, 'base64'));
  const text = { caption, notes, cards, moves };
  // Edit Again on an entry removed in the meantime adds it back as a new one.
  const n = replace && sessions.replaceShot(into, session, replace, out, text) ? replace : sessions.addShot(into, session, out, text);
  sessions.saveEdit(into, session, n, fs.readFileSync(image), JSON.stringify(state));
  used[session] = Date.now();
  saveState();
  BrowserWindow.fromWebContents(e.sender)?.close();
  return n;
});

ipcMain.on('editor:dirty', (e, value: boolean) => {
  const ed = editors.get(e.sender.id);
  if (ed) ed.dirty = value;
});

// Snapmark's own window for a session: session.md rendered and editable, and its screenshots one at a time.
export function openViewer(name: string, into = root): BrowserWindow {
  const open = [...viewers.values()].find((v) => v.root === into && v.session === name);
  if (open) {
    open.win.show();
    app.focus({ steal: true });
    return open.win;
  }
  const dir = path.join(into, name);
  const win = new BrowserWindow({
    width: 900,
    height: 900,
    title: `${name} — Snapmark`,
    webPreferences: { preload: path.join(__dirname, 'preload.js') },
  });
  const id = win.webContents.id;
  const v = { root: into, session: name, win, known: '' };
  viewers.set(id, v);
  updateDock();
  // session.md changed outside this window (a new screenshot, an agent, another app): show the new text.
  const watcher = fs.watch(dir, (_event, file) => {
    if (file !== 'session.md' || !fs.existsSync(path.join(dir, file))) return;
    if (fs.readFileSync(path.join(dir, file), 'utf8') !== v.known) win.webContents.send('viewer:reload', viewerData(v));
  });
  win.on('closed', () => {
    watcher.close();
    viewers.delete(id);
    updateDock();
  });
  win.loadFile(path.join(__dirname, 'viewer.html'));
  app.focus({ steal: true });
  return win;
}

function viewerData(v: { root: string; session: string; known: string }): ViewerInit {
  const dir = path.join(v.root, v.session);
  v.known = fs.readFileSync(path.join(dir, 'session.md'), 'utf8');
  const shots = sessions.shots(v.root, v.session);
  const editable = shots.filter((n) => fs.existsSync(sessions.editFiles(v.root, v.session, n).json));
  return { session: v.session, base: `${pathToFileURL(dir).href}/`, md: v.known, shots, editable };
}

function viewerFor(id: number) {
  const v = viewers.get(id);
  if (!v) throw new Error(`No viewer for webContents ${id}`);
  return v;
}

function writeViewer(v: { root: string; session: string; known: string }, from: string, md: string): boolean {
  const file = path.join(v.root, v.session, 'session.md');
  if (fs.readFileSync(file, 'utf8') !== from) return false;
  const text = `${md.trimEnd()}\n`;
  v.known = text;
  fs.writeFileSync(file, text);
  return true;
}

// Text typed in the last 200 ms has not reached onChange yet: take it from the window before session.md changes.
async function flushViewer(v: { root: string; session: string; win: BrowserWindow; known: string }) {
  const md: unknown = await v.win.webContents.executeJavaScript('window.__flush && window.__flush()').catch(() => null);
  if (typeof md === 'string') writeViewer(v, v.known, md);
}

ipcMain.handle('viewer:init', (e): ViewerInit => viewerData(viewerFor(e.sender.id)));
ipcMain.handle('viewer:save', (e, from: string, md: string): boolean => writeViewer(viewerFor(e.sender.id), from, md));
ipcMain.on('viewer:external', (e) => {
  const v = viewerFor(e.sender.id);
  void shell.openPath(sessionMdPath(path.join(v.root, v.session)));
});
ipcMain.on('viewer:edit', (e, n: number) => {
  const v = viewerFor(e.sender.id);
  const f = sessions.editFiles(v.root, v.session, n);
  if (!fs.existsSync(f.json)) return;
  const open = [...editors.values()].find((ed) => ed.root === v.root && ed.session === v.session && ed.replace === n);
  if (open) return void open.win.show();
  openEditor(tempCopy(f.png), { session: v.session, state: JSON.parse(fs.readFileSync(f.json, 'utf8')), replace: n });
});
ipcMain.handle('viewer:remove', async (e, n: number): Promise<ViewerInit> => {
  const v = viewerFor(e.sender.id);
  await flushViewer(v);
  sessions.removeShot(v.root, v.session, n);
  return viewerData(v);
});

// The editor deletes its image on close, so it always gets a copy.
function tempCopy(file: string): string {
  const tmp = path.join(os.tmpdir(), `snapmark-${Date.now()}.png`);
  fs.copyFileSync(file, tmp);
  return tmp;
}

// ---------- Discarded: closed screenshots and removed entries, kept 7 days ----------

export function reopen(d: sessions.Discarded) {
  if (d.kind === 'shot') {
    const n = sessions.restoreShot(root, d);
    notify(`Screenshot ${n} is back in ${sessions.shortName(d.session)}.`);
    openViewer(d.session);
    return;
  }
  const state = JSON.parse(fs.readFileSync(path.join(d.dir, 'state.json'), 'utf8')) as EditState;
  const session = sessions.list(root).includes(d.session) ? d.session : undefined;
  openEditor(tempCopy(path.join(d.dir, 'image.png')), { session, state });
  fs.rmSync(d.dir, { recursive: true, force: true }); // closing it again makes a new one
}

async function reopenDiscarded() {
  const top = path.join(root, '.discarded');
  app.focus({ steal: true });
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: 'Reopen Discarded',
    message: `Screenshots closed without saving and removed from sessions, kept for ${sessions.KEEP_DAYS} days.`,
    defaultPath: top,
    properties: ['openDirectory'],
  });
  if (canceled || !filePaths[0]) return;
  const d = sessions.discarded(root).find((x) => x.dir === path.resolve(filePaths[0]));
  if (!d) return notify(`That folder is not in ${tilde(top)}.`);
  reopen(d);
}

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
    hasDiscarded: sessions.discarded(root).length > 0,
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
    // A viewer watches its folder, which just moved: reopen it on the new name.
    for (const v of viewers.values())
      if (v.root === root && v.session === name) {
        v.win.close();
        openViewer(to);
      }
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
    ['⌃⇧1', 'Capture region', 'anywhere'],
    ['⌃⇧2', 'New session', 'anywhere'],
    ['Esc', 'Step back', 'out of the text, then deselect, then back to Select, then close'],
    ['⌫', 'Delete', 'the selected mark'],
    ['⌘Z', 'Undo', 'in a note, its typing first, then the marks'],
    ['⇧⌘Z', 'Redo', ''],
    ['⌘↵', 'Add to session', ''],
    ['⌘W', 'Discard', 'the screenshot; Reopen Last Discarded in the menu brings it back'],
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
  openFile: (name) => exists(name, 'session.md') && void openViewer(name),
  reopenLast: () => {
    const [last] = sessions.discarded(root);
    if (last) reopen(last);
  },
  reopenDiscarded: () => void reopenDiscarded(),
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
  sessions.discarded(root); // deletes what is older than 7 days
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
