import {
  app,
  BrowserWindow,
  Tray,
  Menu,
  clipboard,
  ClipboardItem,
  dialog,
  globalShortcut,
  ipcMain,
  nativeImage,
  screen,
  shell,
  Notification,
} from 'electron';
import type { IpcMainEvent } from 'electron';
import { execFile } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { pathToFileURL } from 'url';
import { autoUpdater } from 'electron-updater';
import * as sessions from './sessions';
import { exportPdf, exportZip } from './exporter';
import { menuTemplate, loginState, MenuActions, MenuState, SessionInfo } from './menu';
import { Bitmap, MAX_HEIGHT, stitcher } from './stitch';
// tools.ts is a classic script shared with the editor page, so it has no ES export to import.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { GROUPS: TOOLS } = require('./tools') as { GROUPS: ToolGroup[] };

const DEFAULT_ROOT = path.join(os.homedir(), 'Documents', 'Snapmark');
// No ⌘: ⌘ keys belong to the app in front, and ⇧⌘1 sat next to Chrome's ⌘1 for tab 1 (owner, 2026-09-28).
const SHORTCUT_CAPTURE = 'Control+Shift+1';
const SHORTCUT_NEW = 'Control+Shift+N';
const SHORTCUT_AREA = 'Control+Shift+3';

const statePath = () => path.join(app.getPath('userData'), 'state.json');
// SNAPMARK_ROOT (tests, dev) wins over the folder chosen in the menu.
let root = process.env.SNAPMARK_ROOT || DEFAULT_ROOT;
let active: string | null = null;
let used: Record<string, number> = {}; // session name → last made current or saved into, epoch ms
let area: Area | null = null; // what Capture Last Area captures, in global screen points
let editorSize: { width: number; height: number } | null = null; // the size the owner last gave an editor window
let beautify: Beautify | null = null; // one-shot mode's settings as last used: the one preset
let tray: Tray | null = null;
let updateWaiting: string | null = null;
let quitting = false; // set by "Quit anyway" so the quit guard lets go
const registered = new Set<string>(); // global shortcuts macOS let us have
// keyed by webContents.id; dirty = marks or text not saved yet
// state = marks to put back; replace = Edit Again's entry number; oneShot = no session ('' in session)
interface EditorWin {
  image: string;
  root: string;
  session: string;
  win: BrowserWindow;
  dirty: boolean;
  state?: EditState;
  replace?: number;
  oneShot?: boolean;
}
const editors = new Map<number, EditorWin>();
// Session windows, keyed by webContents.id; known = the session.md text the window shows
interface Viewer {
  root: string;
  session: string;
  win: BrowserWindow;
  known: string;
  watcher?: fs.FSWatcher;
}
const viewers = new Map<number, Viewer>();
// Tests (SNAPMARK_NO_UI) run many times a day beside the owner's apps: Snapmark never takes the front or a Dock icon.
const quiet = !!process.env.SNAPMARK_NO_UI;
const focusApp = () => quiet || app.focus({ steal: true });
// The Dock icon shows while any Snapmark window is open. A new window turns it on only once it has focus: turned
// on first, Snapmark becomes a Dock app while another app is full screen, and macOS slides to the desktop, leaving
// the window behind on the full-screen Space (owner, 2026-09-28).
const updateDock = () => quiet || (editors.size || viewers.size ? void app.dock?.show() : app.dock?.hide());

function loadState() {
  try {
    const state = JSON.parse(fs.readFileSync(statePath(), 'utf8'));
    active = state.active;
    used = state.used ?? {};
    area = state.area ?? null;
    editorSize = state.editorSize ?? null;
    beautify = state.beautify ?? null;
    if (!process.env.SNAPMARK_ROOT && state.root) root = state.root;
  } catch {
    // no state yet
  }
  if (!active || !sessions.list(root).includes(active)) active = sessions.list(root)[0] || null;
}

function saveState() {
  fs.mkdirSync(path.dirname(statePath()), { recursive: true });
  fs.writeFileSync(statePath(), JSON.stringify({ active, root, used, area, editorSize, beautify }));
}

export function setActive(name: string) {
  active = name;
  used[name] = Date.now();
  saveState();
}

// Point Snapmark at another folder, e.g. inside iCloud Drive or Google Drive, so sessions sync.
async function chooseRoot() {
  focusApp();
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

const OLD_DAYS = 60;

// Settings → Clear Sessions Older Than 60 Days…: asks first, then moves them to the Trash, so a mistake can be undone
// in Finder. The current session and any session open in a window are never cleared.
async function clearOldSessions() {
  const open = new Set([...editors.values(), ...viewers.values()].filter((w) => w.root === root).map((w) => w.session));
  const old = sessions.olderThan(root, OLD_DAYS, used).filter((n) => n !== active && !open.has(n));
  focusApp();
  if (!old.length) return notify(`No session is older than ${OLD_DAYS} days.`);
  const shown = old.slice(0, 10).map(sessions.shortName).join('\n') + (old.length > 10 ? `\n… and ${old.length - 10} more` : '');
  const { response } = await dialog.showMessageBox({
    type: 'warning',
    message: `Move ${old.length} session${old.length === 1 ? '' : 's'} not used for ${OLD_DAYS} days to the Trash?`,
    detail: shown,
    buttons: ['Move to Trash', 'Cancel'],
    defaultId: 1,
    cancelId: 1,
  });
  if (response !== 0) return;
  for (const n of old) {
    await shell.trashItem(dirOf(n));
    delete used[n];
  }
  saveState();
  notify(`Moved ${old.length} old session${old.length === 1 ? '' : 's'} to the Trash.`);
}

const tilde = (p: string) => (p.startsWith(os.homedir()) ? `~${p.slice(os.homedir().length)}` : p);

function notify(body: string, onClick?: () => void) {
  const n = new Notification({ title: 'Snapmark', body });
  if (onClick) n.on('click', onClick);
  n.show();
}

const dirOf = (name: string) => path.join(root, name);

function newSession() {
  // Pressing ⌃⇧N twice must not leave empty sessions behind.
  if (active && fs.existsSync(dirOf(active)) && sessions.count(root, active) === 0)
    return notify(`${sessions.shortName(active)} is still empty, so new captures keep going there.`);
  setActive(sessions.create(root));
  notify(`New session: ${active}`);
}

function shoot(args: string[], oneShot = false) {
  const tmp = path.join(os.tmpdir(), `snapmark-${Date.now()}.png`);
  // -x: no sound
  execFile('screencapture', [...args, '-x', tmp], () => {
    if (fs.existsSync(tmp)) openEditor(tmp, { oneShot }); // missing file = user pressed Esc
  });
}

// -i: interactive region (space toggles window mode)
const capture = () => shoot(['-i']);
// One-Shot Capture…: the same region capture, opened in one-shot mode
const captureOneShot = () => shoot(['-i'], true);
// -w: only windows, so a click takes the window under the pointer; -o: without its shadow, a clean crop to the window's
// edges (the shadow is transparent padding the marks and the AI do not need)
const captureWindow = () => shoot(['-i', '-w', '-o']);

let picking = false;

// The same area every time, e.g. the page in a browser. The first time, after Choose New Area, or when the display
// it was on is gone, the owner drags it first.
async function captureArea(choose = false) {
  const onScreen = (a: Area) =>
    screen
      .getAllDisplays()
      .some(({ bounds: b }) => a.x >= b.x && a.y >= b.y && a.x + a.width <= b.x + b.width && a.y + a.height <= b.y + b.height);
  if (choose || !area || !onScreen(area)) {
    if (picking) return; // ⌃⇧3 again while dragging
    picking = true;
    const picked = await pickArea().finally(() => (picking = false));
    if (!picked) return;
    area = picked;
    saveState();
  }
  shoot(['-R', rect(area)]);
}

const rect = (a: Area) => [a.x, a.y, a.width, a.height].map(Math.round).join(',');

// `screencapture -i` never says where its region was, so the area to repeat is dragged in Snapmark's own
// see-through window over the display with the pointer. Resolves once that window is off the screen.
export function pickArea(scroll = false): Promise<Area | null> {
  const { bounds } = screen.getDisplayNearestPoint(screen.getCursorScreenPoint());
  const win = new BrowserWindow({
    ...bounds,
    frame: false,
    transparent: true,
    hasShadow: false,
    resizable: false,
    movable: false,
    fullscreenable: false,
    enableLargerThanScreen: true, // over the menu bar too
    show: false,
    webPreferences: { preload: path.join(__dirname, 'preload.js') },
  });
  win.setAlwaysOnTop(true, 'screen-saver');
  // Over a full-screen browser as well, instead of switching away from its Space.
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true, skipTransformProcessType: true });
  win.once('ready-to-show', () => {
    win.show();
    focusApp();
  });
  void win.loadFile(path.join(__dirname, 'area.html'), scroll ? { hash: 'scroll' } : {});
  return new Promise((resolve) => {
    let picked: Area | null = null;
    const done = (e: IpcMainEvent, a: Area | null) => {
      if (e.sender !== win.webContents) return;
      picked = a && { ...a, x: a.x + bounds.x, y: a.y + bounds.y };
      win.close();
    };
    ipcMain.on('area:done', done);
    win.on('closed', () => {
      ipcMain.off('area:done', done);
      // ponytail: a fixed 200 ms for the window server to drop the overlay; wait on a frame if captures ever show it.
      setTimeout(() => resolve(picked), 200);
    });
  });
}

// Capture Scrolling (Capture Options ▸): the owner drags an area, then scrolls what is under it while Snapmark grabs
// the area again and again and stitches what scrolled in onto one tall screenshot (stitch.ts). Done opens the editor.
async function captureScrolling() {
  if (picking) return;
  picking = true;
  const picked = await pickArea(true).finally(() => (picking = false));
  if (picked) await scrollCapture(picked);
}

// One frame of the area, as `screencapture -R` gives it: Retina displays give 2x pixels.
function grabArea(a: Area): Promise<Bitmap> {
  const tmp = path.join(os.tmpdir(), `snapmark-frame-${Date.now()}.png`);
  return new Promise((resolve, reject) =>
    execFile('screencapture', ['-x', '-R', rect(a), tmp], (err) => {
      const img = nativeImage.createFromPath(tmp);
      fs.rmSync(tmp, { force: true });
      if (err || img.isEmpty()) return reject(err ?? new Error('screencapture made no image'));
      resolve({ ...img.getSize(), data: img.toBitmap() });
    }),
  );
}

// Grabs `a` until Done (↩) or Cancel (Esc) in a small control beside it, then opens the stitched image in the editor.
// `grab` is swappable so the smoke test feeds synthetic frames through the same loop. Resolves to the editor, if any.
export async function scrollCapture(a: Area, grab = grabArea): Promise<BrowserWindow | null> {
  const [W, H, GAP] = [380, 48, 8];
  const { workArea: wa } = screen.getDisplayMatching({ x: a.x, y: a.y, width: a.width, height: a.height });
  // Below the area, else above it, else inside its bottom edge (an area as tall as the screen).
  const below = a.y + a.height + GAP;
  const y = below + H <= wa.y + wa.height ? below : a.y - GAP - H >= wa.y ? a.y - GAP - H : a.y + a.height - H - GAP;
  const ctl = new BrowserWindow({
    x: Math.round(Math.max(wa.x, Math.min(a.x, wa.x + wa.width - W))),
    y: Math.round(y),
    width: W,
    height: H,
    frame: false,
    transparent: true,
    resizable: false,
    fullscreenable: false,
    show: false,
    webPreferences: { preload: path.join(__dirname, 'preload.js') },
  });
  ctl.setContentProtection(true); // kept out of screen captures where macOS allows it, for the inside-the-area case
  ctl.setAlwaysOnTop(true, 'screen-saver');
  ctl.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true, skipTransformProcessType: true });
  ctl.once('ready-to-show', () => {
    ctl.show();
    focusApp(); // ↩ and Esc reach the control; scrolling still goes to the window under the pointer
  });
  void ctl.loadFile(path.join(__dirname, 'scroll.html'));

  let stop: 'done' | 'cancel' | null = null;
  const onDone = (e: IpcMainEvent, ok: boolean) => {
    if (e.sender === ctl.webContents) stop ??= ok ? 'done' : 'cancel';
  };
  ipcMain.on('scroll:done', onDone);
  ctl.on('closed', () => (stop ??= 'cancel'));
  const st = stitcher();
  try {
    while (stop !== 'cancel') {
      const last = stop === 'done'; // one more frame after Done: the owner may have scrolled just before pressing it
      const step = st.add(await grab(a));
      if (!ctl.isDestroyed()) ctl.webContents.send('scroll:status', { frames: st.frames, height: st.height, step } satisfies ScrollStatus);
      if (step === 'full') {
        notify(`Stopped at ${MAX_HEIGHT.toLocaleString('en-US')} px, the tallest a screenshot gets.`);
        stop = 'done';
        break;
      }
      if (last) break;
      await new Promise((r) => setTimeout(r, 50)); // leaves the CPU some air between grabs
    }
  } catch (e) {
    stop = 'cancel';
    notify(`Capture Scrolling stopped: ${e instanceof Error ? e.message : String(e)}`);
  } finally {
    ipcMain.off('scroll:done', onDone);
    if (!ctl.isDestroyed()) ctl.close();
  }
  if (stop !== 'done' || !st.frames) return null;
  const { width, height, data } = st.result();
  const tmp = path.join(os.tmpdir(), `snapmark-${Date.now()}.png`);
  fs.writeFileSync(tmp, nativeImage.createFromBitmap(Buffer.from(data.buffer, data.byteOffset, data.length), { width, height }).toPNG());
  return openEditor(tmp);
}

// Opens the editor on a screenshot file, which it owns and deletes on close. `session` is where it saves (default:
// the current one); `state` puts marks back; `replace` makes saving replace that entry (Edit Again); `oneShot` opens
// it in one-shot mode, which has no session and never makes or changes one.
export function openEditor(
  image: string,
  opts: { session?: string; state?: EditState; replace?: number; oneShot?: boolean } = {},
): BrowserWindow {
  const { oneShot } = opts;
  const session = oneShot ? '' : (opts.session ?? active ?? sessions.create(root));
  if (!opts.replace && !oneShot) setActive(session);
  // 90% of the screen with the pointer, or the size the owner last gave an editor, never larger than that screen.
  const { workArea: wa } = screen.getDisplayNearestPoint(screen.getCursorScreenPoint());
  const want = editorSize ?? { width: wa.width * 0.9, height: wa.height * 0.9 };
  const [width, height] = [Math.min(want.width, wa.width), Math.min(want.height, wa.height)].map(Math.round);
  const win = new BrowserWindow({
    x: Math.round(wa.x + (wa.width - width) / 2),
    y: Math.round(wa.y + (wa.height - height) / 2),
    width,
    height,
    title: `Snapmark — ${oneShot ? 'One-shot' : session}`,
    webPreferences: { preload: path.join(__dirname, 'preload.js') },
  });
  const id = win.webContents.id;
  editors.set(id, { image, root, session, win, dirty: false, state: opts.state, replace: opts.replace, oneShot });
  win.once('focus', updateDock);
  win.on('resized', () => {
    const [w, h] = win.getSize();
    editorSize = { width: w, height: h };
    saveState();
  });
  win.on('closed', () => {
    editors.delete(id);
    updateDock();
    fs.rmSync(image, { force: true });
  });
  win.loadFile(path.join(__dirname, 'editor.html'));
  focusApp();
  return win;
}

function editorFor(id: number) {
  const ed = editors.get(id);
  if (!ed) throw new Error(`No editor for webContents ${id}`);
  return ed;
}

ipcMain.handle('editor:init', (e): EditorInit => {
  const { image, root: into, session, state, replace, oneShot } = editorFor(e.sender.id);
  const src = `data:image/png;base64,${fs.readFileSync(image, 'base64')}`;
  if (oneShot) return { src, session, count: 0, state, oneShot, beautify: state?.beautify ?? beautify ?? undefined };
  return { src, session, count: sessions.count(into, session), state, replacing: replace };
});

ipcMain.on('editor:beautify', (e, settings: Beautify) => {
  if (!editors.get(e.sender.id)?.oneShot) return;
  beautify = settings;
  saveState();
});

// Sent synchronously while the window unloads without a save, so the capture is kept before the window is gone.
ipcMain.on('editor:stash', (e, state: EditState) => {
  const ed = editors.get(e.sender.id);
  if (ed && fs.existsSync(ed.image)) {
    sessions.discardCapture(ed.root, ed.oneShot ? 'one-shot' : ed.session, ed.image, JSON.stringify(state));
    for (const v of viewers.values()) if (v.root === ed.root && v.session === ed.session) reloadViewer(v); // its Discarded tab
  }
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
  const { root: into, session, image, replace, oneShot } = editorFor(e.sender.id);
  if (oneShot) throw new Error('A one-shot screenshot is never added to a session');
  for (const v of viewers.values()) if (v.root === into && v.session === session) await flushViewer(v);
  const out = fitForAI(Buffer.from(png, 'base64'));
  const text = { caption, notes, cards, moves };
  // Edit Again on an entry removed in the meantime adds it back as a new one.
  const n = replace && sessions.replaceShot(into, session, replace, out, text) ? replace : sessions.addShot(into, session, out, text);
  sessions.saveEdit(into, session, n, fs.readFileSync(image), JSON.stringify(state));
  tellEditors(into, session);
  used[session] = Date.now();
  saveState();
  BrowserWindow.fromWebContents(e.sender)?.close();
  return n;
});

// Open editors show their session's name and screenshot count: told again after a rename, an add, a remove or a reopen.
function tellEditors(into: string, name: string) {
  for (const ed of editors.values())
    if (ed.root === into && ed.session === name && !ed.win.isDestroyed()) {
      ed.win.setTitle(`Snapmark — ${name}`);
      ed.win.webContents.send('editor:session', name, sessions.count(into, name));
    }
}

// Out of the owner's sight, and swapped by the smoke test, which must not touch the clipboard or wait on a dialog.
export const desk = {
  copyImage: (png: Buffer) => clipboard.write([new ClipboardItem({ 'image/png': new Blob([new Uint8Array(png)], { type: 'image/png' }) })]),
  savePath: (win: BrowserWindow, opts: Electron.SaveDialogOptions) => dialog.showSaveDialog(win, opts),
};

// Copy Image and Save As…: in session mode the image exactly as Add to session would save it, without adding it to the
// session; in one-shot mode the beautified image at full (Retina) resolution, for people rather than an AI.
const outImage = (ed: EditorWin, png: string) => (ed.oneShot ? Buffer.from(png, 'base64') : fitForAI(Buffer.from(png, 'base64')));

ipcMain.handle('editor:copy', async (e, png: string) => {
  const ed = editorFor(e.sender.id);
  await desk.copyImage(outImage(ed, png));
  notify(ed.oneShot ? 'Image copied.' : 'Marked-up image copied. It is not in the session.');
});

ipcMain.handle('editor:saveAs', async (e, png: string): Promise<string | null> => {
  const ed = editorFor(e.sender.id);
  const { root: into, session, replace, win, oneShot } = ed;
  const { canceled, filePath } = await desk.savePath(win, {
    // A bare name: macOS opens the folder used last. One-shot: "Snapmark 2026-10-25 14.03.12.png", local time.
    defaultPath: oneShot
      ? `Snapmark ${new Date().toLocaleString('sv-SE').replace(/:/g, '.')}.png`
      : sessions.saveAsName(into, session, replace),
    filters: [{ name: 'PNG image', extensions: ['png'] }],
  });
  if (canceled || !filePath) return null;
  try {
    fs.writeFileSync(filePath, outImage(ed, png));
  } catch (err) {
    notify(`Couldn't save ${path.basename(filePath)}: ${err instanceof Error ? err.message : String(err)}`);
    return null;
  }
  notify(`Saved ${path.basename(filePath)}.${oneShot ? '' : ' It is not in the session.'}`, () => shell.showItemInFolder(filePath));
  return filePath;
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
    focusApp();
    return open.win;
  }
  const win = new BrowserWindow({
    width: 1100,
    height: 900,
    title: `${name} — Snapmark`,
    // The header holds the title, the tabs and the traffic lights, like a native macOS window.
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 18, y: 19 },
    webPreferences: { preload: path.join(__dirname, 'preload.js') },
  });
  const id = win.webContents.id;
  const v: Viewer = { root: into, session: name, win, known: '' };
  viewers.set(id, v);
  watch(v);
  win.once('focus', updateDock);
  win.on('closed', () => {
    v.watcher?.close();
    viewers.delete(id);
    updateDock();
  });
  win.loadFile(path.join(__dirname, 'viewer.html'));
  focusApp();
  return win;
}

// session.md changed outside the window (a new screenshot, an agent, another app): show the new text. Watched again
// after a rename, since the folder moved.
function watch(v: Viewer) {
  v.watcher?.close();
  const dir = path.join(v.root, v.session);
  v.watcher = fs.watch(dir, (_event, file) => {
    if (file !== 'session.md' || !fs.existsSync(path.join(dir, file))) return;
    if (fs.readFileSync(path.join(dir, file), 'utf8') !== v.known) reloadViewer(v);
  });
}

const reloadViewer = (v: Viewer) => v.win.webContents.send('viewer:reload', viewerData(v));

function viewerData(v: { root: string; session: string; known: string }): ViewerInit {
  const dir = path.join(v.root, v.session);
  v.known = fs.readFileSync(path.join(dir, 'session.md'), 'utf8');
  const shots = sessions.entries(v.known).map((e) => ({ ...e, editable: fs.existsSync(sessions.editFiles(v.root, v.session, e.n).json) }));
  const discarded = sessions.discardedIn(v.root, v.session).map((d) => ({
    dir: d.dir,
    src: pathToFileURL(path.join(d.dir, 'image.png')).href,
    kind: d.kind,
    when: sessions.whenLabel(d.at),
  }));
  return { session: v.session, base: `${pathToFileURL(dir).href}/`, md: v.known, shots, discarded };
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
  tellEditors(v.root, v.session);
  return viewerData(v);
});
ipcMain.handle('viewer:rename', async (e, wanted: string): Promise<string | null> => {
  const v = viewerFor(e.sender.id);
  const name = wanted.trim();
  if (!name) return 'Enter a name.';
  if (name === v.session) return null;
  await flushViewer(v); // the title line in session.md changes
  return renameSession(v.session, name, v.root) ? null : `A session named ${name} already exists.`;
});
ipcMain.handle('viewer:reopen', async (e, dir: string): Promise<ViewerInit> => {
  const v = viewerFor(e.sender.id);
  const d = sessions.discardedIn(v.root, v.session).find((x) => x.dir === dir);
  if (d) {
    await flushViewer(v); // a removed screenshot goes back into session.md
    reopen(d, v.root);
    tellEditors(v.root, v.session);
  }
  return viewerData(v);
});

// The editor deletes its image on close, so it always gets a copy.
function tempCopy(file: string): string {
  const tmp = path.join(os.tmpdir(), `snapmark-${Date.now()}.png`);
  fs.copyFileSync(file, tmp);
  return tmp;
}

// ---------- Discarded: closed screenshots and removed entries, kept 7 days ----------

export function reopen(d: sessions.Discarded, into = root) {
  if (d.kind === 'shot') {
    const n = sessions.restoreShot(into, d);
    notify(`Screenshot ${n} is back in ${sessions.shortName(d.session)}.`);
    openViewer(d.session, into);
    return;
  }
  const state = JSON.parse(fs.readFileSync(path.join(d.dir, 'state.json'), 'utf8')) as EditState;
  const session = sessions.list(into).includes(d.session) ? d.session : undefined;
  openEditor(tempCopy(path.join(d.dir, 'image.png')), { session, state, oneShot: !!state.beautify });
  fs.rmSync(d.dir, { recursive: true, force: true }); // closing it again makes a new one
}

async function reopenDiscarded() {
  const top = path.join(root, '.discarded');
  focusApp();
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
// The one place the Markdown path is built, so "Copy Session File Path" and the AI prompt never disagree.
export function sessionMdPath(dir: string): string {
  return path.resolve(dir, 'session.md');
}

export function promptFor(dir: string): string {
  return [
    `Work through the visual feedback in "${sessionMdPath(dir)}".`,
    'Each entry is an annotated screenshot. The numbered list below it holds the notes for the references (numbered diamonds) on the image.',
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
      area: registered.has(SHORTCUT_AREA) ? SHORTCUT_AREA : null,
      newSession: registered.has(SHORTCUT_NEW) ? SHORTCUT_NEW : null,
    },
    area,
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

// Renames the folder and everything that points at it: the current session, open editors and session windows.
// Returns the new name, or null if the name is empty, unchanged or taken (sessions.rename).
function renameSession(name: string, wanted: string, into = root): string | null {
  const to = sessions.rename(into, name, wanted);
  if (!to) return null;
  if (into === root) {
    if (active === name) active = to;
    used[to] = used[name] ?? Date.now();
    delete used[name];
    saveState();
  }
  for (const ed of editors.values()) if (ed.root === into && ed.session === name) ed.session = to;
  tellEditors(into, to);
  for (const v of viewers.values())
    if (v.root === into && v.session === name) {
      v.session = to;
      watch(v);
      reloadViewer(v);
    }
  return to;
}

// Rename Session… in the menu: native text prompt; Cancel makes osascript exit non-zero, which changes nothing.
function renameFromMenu(name: string) {
  const script = [
    'on run argv',
    'text returned of (display dialog "Rename session" default answer (item 1 of argv) buttons {"Cancel", "Rename"} default button "Rename")',
    'end run',
  ];
  execFile('osascript', [...script.flatMap((l) => ['-e', l]), name], async (err, stdout) => {
    const wanted = stdout?.trim();
    if (err || !wanted || wanted === name) return;
    for (const v of viewers.values()) if (v.root === root && v.session === name) await flushViewer(v);
    if (!renameSession(name, wanted)) notify(`A session named ${wanted} already exists.`);
  });
}

async function otherSession() {
  focusApp();
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
    ['⌃⇧3', 'Capture last area', 'anywhere; the first time, drag the area'],
    ['⌃⇧N', 'New session', 'anywhere'],
    ['↩ / Esc', 'Capture Scrolling', 'Done or cancel, while it grabs the area you scroll (menu: Capture Options)'],
    ['Esc', 'Step back', 'out of the text, then deselect, then back to Select, then close'],
    ['⌫', 'Delete', 'the selected mark'],
    ['⌘1–⌘7', 'Pick a tool', 'also while typing a note or card, where the plain digit types'],
    ['⌘Z', 'Undo', 'in a note, its typing first, then the marks'],
    ['⇧⌘Z', 'Redo', ''],
    ['⌘↵', 'Add to session', ''],
    ['⇧⌘C', 'Copy Image', 'the marked-up image, without adding it to the session'],
    ['⇧⌘S', 'Save As…', 'the marked-up image as a PNG wherever you pick, without adding it to the session'],
    ['⌘C', 'Copy Image (one-shot)', 'the beautified image at full resolution, when no text has the cursor; ⇧⌘C works too'],
    ['⌘W', 'Discard', 'the screenshot; Reopen Last Discarded in the menu brings it back'],
    ['← →', 'Flip screenshots', 'in the session window, one at a time; Esc goes back to the grid'],
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
  focusApp();
}

const actions: MenuActions = {
  capture,
  captureArea: () => void captureArea(),
  chooseArea: () => void captureArea(true),
  captureWindow,
  captureScrolling: () => void captureScrolling(),
  oneShot: captureOneShot,
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
  rename: renameFromMenu,
  exportAs: (name, kind) => void runExport(kind, dirOf(name)),
  makeCurrent: setActive,
  otherSession: () => void otherSession(),
  chooseRoot: () => void chooseRoot(),
  clearOldSessions: () => void clearOldSessions(),
  setLogin: (checked) => app.setLoginItemSettings({ openAtLogin: checked }),
  keyboardShortcuts: showShortcuts,
  checkUpdates: () => void checkForUpdatesNow(),
  installUpdate: () => autoUpdater.quitAndInstall(),
  quit: () => app.quit(),
};

app.whenReady().then(() => {
  if (quiet) return void app.setActivationPolicy?.('accessory'); // test harness drives the app itself
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
    [SHORTCUT_AREA, () => void captureArea()],
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
  focusApp();
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
