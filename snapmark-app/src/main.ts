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
import { menuTemplate, appMenu, loginState, editorSessionMenu, copyMenu, quitMessage, MenuActions, MenuState, SessionInfo } from './menu';
import { SHORTCUTS, KEY_GROUPS } from './keys';
import { FIRST, barLabel, barOptions, captureArgs, checkedCapture, rect, shotFiles } from './capture';
import type { MenuItemConstructorOptions } from 'electron';
import { Bitmap, MAX_HEIGHT, stitcher } from './stitch';
import { fitScale, partLayout } from './parts';
import { Box, ocrText, OcrLine, recognize } from './ocr';
import { secretBoxes } from './redact';
// tools.ts is a classic script shared with the editor page, so it has no ES export to import.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { GROUPS: TOOLS } = require('./tools') as { GROUPS: ToolGroup[] };

const DEFAULT_ROOT = path.join(os.homedir(), 'Documents', 'Snapmark');

const statePath = () => path.join(app.getPath('userData'), 'state.json');
// SNAPMARK_ROOT (tests, dev) wins over the folder chosen in the menu.
let root = process.env.SNAPMARK_ROOT || DEFAULT_ROOT;
let active: string | null = null;
let used: Record<string, number> = {}; // session name → last made current or saved into, epoch ms
let area: Area | null = null; // what Capture Last Area captures, in global screen points
let areaForgotten = false; // a New Session forgot the area: the next picker and the menu say so
let singleKeys = true; // Settings ▸ Single-Key Tools
let color: string | null = null; // the annotation colour last picked; every new editor starts with it
let customColors: string[] = []; // the colour panel's Custom row, newest first (withCustom in tools.ts)
let editorSize: { width: number; height: number } | null = null; // the size the owner last gave an editor window
let beautify: Beautify | null = null; // one-shot mode's settings as last used: the one preset
let captureOpts: CaptureOpts = FIRST; // the capture bar's mode, Save to, Timer and Show Mouse Pointer, as last used
let tray: Tray | null = null;
let updateWaiting: string | null = null;
let quitting = false; // set by "Quit anyway" so the quit guard lets go
const registered = new Set<string>(); // global shortcuts macOS let us have
// keyed by webContents.id; dirty = marks or text not saved yet
// state = marks to put back; replace = Edit Again's entry number; oneShot = no session ('' in session)
// text = what text recognition finds in the image
interface EditorWin {
  image: string;
  text: Promise<OcrLine[] | null>;
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
const updateDock = () => desk.dock(editors.size + viewers.size > 0);

function loadState() {
  try {
    const state = JSON.parse(fs.readFileSync(statePath(), 'utf8'));
    active = state.active;
    used = state.used ?? {};
    area = state.area ?? null;
    editorSize = state.editorSize ?? null;
    beautify = state.beautify ?? null;
    singleKeys = state.singleKeys ?? true;
    color = state.color ?? null;
    customColors = state.customColors ?? [];
    captureOpts = checkedCapture(state.capture);
    if (!process.env.SNAPMARK_ROOT && state.root) root = state.root;
  } catch {
    // no state yet
  }
  if (!active || !sessions.list(root).includes(active)) active = sessions.list(root)[0] || null;
}

function saveState() {
  fs.mkdirSync(path.dirname(statePath()), { recursive: true });
  fs.writeFileSync(
    statePath(),
    JSON.stringify({ active, root, used, area, editorSize, beautify, singleKeys, color, customColors, capture: captureOpts }),
  );
}

// Settings ▸ Single-Key Tools: plain letters and digits pick tools in the editor. WCAG 2.1.4 asks that such keys can be
// turned off; ⌘1–⌘7 keep working either way. Open editors redraw their toolbar, an open Keyboard Shortcuts window its keys.
export function setSingleKeys(on: boolean) {
  singleKeys = on;
  saveState();
  for (const ed of editors.values()) if (!ed.win.isDestroyed()) ed.win.webContents.send('editor:single-keys', on);
  if (shortcutsWin && !shortcutsWin.isDestroyed()) shortcutsWin.webContents.reload();
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

const notify = (body: string, onClick?: () => void) => desk.notify(body, onClick);

const dirOf = (name: string) => path.join(root, name);

function newSession() {
  // Pressing ⌃⇧N twice must not leave empty sessions behind.
  if (active && fs.existsSync(dirOf(active)) && sessions.count(root, active) === 0)
    return notify(`${sessions.shortName(active)} is still empty, so new captures keep going there.`);
  const made = sessions.create(root);
  // A new session is new work, so ⌃⇧4 asks for its area again (Q2)
  area = null;
  areaForgotten = true;
  setActive(made);
  notify(`New session: ${sessions.shortName(made)}`);
}

// `files`: one, or one per display for ⌃⇧3; each opens its own editor, `top` last so it is in front.
function shoot(args: string[], oneShot = false, files = shotFiles(path.join(os.tmpdir(), `snapmark-${Date.now()}`)), top = '') {
  shooting = true;
  // -x: no sound
  desk.screencapture([...args, '-x', ...files], (err, stderr) => {
    shooting = false;
    const made = files.filter((f) => fs.existsSync(f));
    if (made.length) return void made.sort((a, b) => +(a === top) - +(b === top)).forEach((f) => openEditor(f, { oneShot }));
    // No picture. Esc in macOS's overlay (-i) says nothing, and stays quiet; anything else is a failure, said so (F028).
    const why = stderr.trim() || (args.includes('-i') ? '' : (err?.message ?? 'screencapture made no image'));
    if (why)
      notify(
        `Capture failed: ${why.replace(/\.$/, '')}. No screenshot was added. Click to try again.`,
        () => busy() || shoot(args, oneShot, files, top),
      );
  });
}

let picking = false; // the area picker is open
let scrolling = false; // Capture Scrolling is grabbing what scrolls under its area
let shooting = false; // screencapture runs: its crosshair is up, or it is writing the file
let counting = false; // the capture bar's Timer counts down
let bar: BrowserWindow | null = null; // the capture bar (⌃⇧5)
const barOpen = () => !!bar && !bar.isDestroyed();
// One capture at a time: a capture key or item while one is running does nothing, ⌃⇧N included. An open bar counts
// for captures, or it would be in the picture of the macOS overlay; its Options menu offers New Session.
const capturing = () => picking || scrolling || shooting || counting;
const busy = () => capturing() || barOpen();

// The same area every time, e.g. the page in a browser. The first time, after Choose New Area, or when the display
// it was on is gone, the owner drags it first.
// `o`: the capture bar's options; ⌃⇧1, ⌃⇧4 and the menu rows capture without them (F217).
async function captureArea(choose = false, o?: CaptureOpts) {
  const onScreen = (a: Area) =>
    screen
      .getAllDisplays()
      .some(({ bounds: b }) => a.x >= b.x && a.y >= b.y && a.x + a.width <= b.x + b.width && a.y + a.height <= b.y + b.height);
  if (busy()) return; // ⌃⇧4 again while dragging, or while Capture Scrolling runs
  if (choose || !area || !onScreen(area)) {
    picking = true;
    // F041: the hint says why the picker is back when the area's display is gone
    const picked = await pickArea(!choose && area ? 'gone' : !choose && areaForgotten ? 'new' : '').finally(() => (picking = false));
    if (!picked) return;
    area = picked;
    areaForgotten = false;
    saveState();
  }
  if (o?.timer && !(await countdown(o.timer))) return;
  shoot(captureArgs(choose ? 'area' : 'last', { pointer: !!o?.pointer }, area), o?.oneShot);
}

// ⌃⇧3, like macOS's ⇧⌘3: every display at once, no picker, one editor per display, the pointer's in front.
// shortcut: Electron's display order is taken as screencapture's (the main display first), true for two displays; match
// by bounds if a third ever lands in the wrong editor.
function captureFullScreen() {
  if (busy()) return;
  const files = shotFiles(path.join(os.tmpdir(), `snapmark-${Date.now()}`), screen.getAllDisplays().length);
  const here = screen.getDisplayNearestPoint(screen.getCursorScreenPoint()).id;
  shoot([], false, files, files[screen.getAllDisplays().findIndex((d) => d.id === here)]);
}

// The global keys, as macOS's ⇧⌘1–⇧⌘5 (ADR 2026-10-25, keys follow macOS), and ⌃⇧N. Each does nothing while a capture
// runs. Exported so the smoke test presses them as globalShortcut would.
export const keyHandlers: Record<keyof typeof SHORTCUTS, () => void> = {
  newArea: () => void captureArea(true),
  oneShot: () => void (busy() || shoot(['-i'], true)), // -i: macOS's overlay; Space picks a window
  fullScreen: captureFullScreen,
  capture: () => void captureArea(),
  options: () => void openCaptureBar(),
  newSession: () => void (capturing() || newSession()),
};

// The bar's Timer, once the area is known: the seconds left beside the menu bar icon. Esc is taken from every app
// only while it counts, and cancels: nothing is captured, and no message shows. False when cancelled.
async function countdown(seconds: number): Promise<boolean> {
  let cancelled = false;
  counting = true;
  globalShortcut.register('Escape', () => (cancelled = true));
  try {
    for (let s = seconds; s > 0 && !cancelled; s--) {
      tray?.setTitle(String(s));
      for (let t = 0; t < 10 && !cancelled; t++) await new Promise((r) => setTimeout(r, 100));
    }
    return !cancelled;
  } finally {
    globalShortcut.unregister('Escape');
    tray?.setTitle('');
    counting = false;
  }
}

// `screencapture -i` never says where its region was, so the area to repeat is dragged in Snapmark's own
// see-through window over the display with the pointer. Resolves once that window is off the screen. `mode` picks the
// hint: Capture Scrolling's, the one saying the last area's display is gone, or the one after a New Session.
export function pickArea(mode: '' | 'scroll' | 'gone' | 'new' = ''): Promise<Area | null> {
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
  void win.loadFile(path.join(__dirname, 'area.html'), mode ? { hash: mode } : {});
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

// Capture Scrolling (the capture bar): the owner drags an area, then scrolls what is under it while Snapmark grabs
// the area again and again and stitches what scrolled in onto one tall screenshot (stitch.ts). Done opens the editor.
async function captureScrolling(oneShot = false) {
  if (busy()) return;
  picking = true;
  const picked = await pickArea('scroll').finally(() => (picking = false));
  if (!picked) return;
  scrolling = true;
  await scrollCapture(picked, grabArea, { oneShot }).finally(() => (scrolling = false));
}

// A capture from the bar, once it is off the screen: each mode as its menu item did, with the bar's options.
// Timer and Show Mouse Pointer apply to areas only (capture.ts).
async function runCapture(o: CaptureOpts) {
  if (o.mode === 'window') return void (busy() || shoot(captureArgs('window', o), o.oneShot));
  if (o.mode === 'scroll') return captureScrolling(o.oneShot);
  return captureArea(o.mode === 'area', o);
}

// The capture bar (⌃⇧5, Capture Options…), like macOS's ⇧⌘5: bottom centre of the display with the pointer, over
// every Space and full-screen app. A non-activating panel, so it takes keys without pulling the owner's app to the
// back. `run` is swappable so the smoke test never runs screencapture. One bar: asked again, it comes forward.
let runBar: (o: CaptureOpts) => unknown = runCapture;
export function openCaptureBar(run: (o: CaptureOpts) => unknown = runCapture): BrowserWindow | null {
  if (bar && barOpen()) {
    bar.show();
    if (!quiet) bar.focus();
    return bar;
  }
  if (busy()) return null;
  runBar = run;
  const { workArea: wa } = screen.getDisplayNearestPoint(screen.getCursorScreenPoint());
  const H = 56; // 8 + the 40 pt targets + 8
  // Bottom centre, 24 pt above the work area's bottom, clear of the Dock.
  const at = (w: number) => ({ x: Math.round(wa.x + (wa.width - w) / 2), y: Math.round(wa.y + wa.height - 24 - H), width: w, height: H });
  const win = new BrowserWindow({
    ...at(520), // until the page reports its width
    title: 'Capture Options',
    frame: false,
    transparent: true,
    hasShadow: true,
    roundedCorners: true,
    resizable: false,
    movable: false,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    ...(process.platform === 'darwin' ? { type: 'panel' } : {}),
    vibrancy: 'popover', // follows light and dark mode; 'hud' is always dark
    visualEffectState: 'active',
    show: false,
    webPreferences: { preload: path.join(__dirname, 'preload.js'), enablePreferredSizeMode: true },
  });
  bar = win;
  win.once('close', () => barTip(null, true)); // the label goes with the bar, at once, so it is never in a capture (F7, F8)
  // As wide as its content, so every gap stays 8 pt, also when the Capture label changes (F212).
  win.webContents.on('preferred-size-changed', (_e, { width }) => win.setBounds(at(width)));
  win.setContentProtection(true); // belt and braces: it closes before every capture
  win.setAlwaysOnTop(true, 'screen-saver');
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true, skipTransformProcessType: true });
  win.once('ready-to-show', () => {
    win.show();
    if (!quiet) win.focus(); // never app.focus: over a full-screen app it would slide to another Space
  });
  void win.loadFile(path.join(__dirname, 'bar.html'));
  return win;
}

const fromBar = (e: { sender: Electron.WebContents }) => !!bar && barOpen() && e.sender === bar.webContents;
const barInit = (): BarInit => ({
  ...captureOpts,
  label: barLabel(captureOpts),
  last: area ? `${area.width} × ${area.height}` : 'First time: drag the area',
});

// The bar's Options menu and the Settings window's Capture tab change the same options; an open bar shows them.
export function setCapture(change: Partial<Record<keyof CaptureOpts, unknown>>) {
  captureOpts = checkedCapture({ ...captureOpts, ...change }, captureOpts); // a bad value from a renderer is dropped
  saveState();
  if (bar && barOpen()) bar.webContents.send('bar:state', barInit());
}

// The bar's label (tip.html): a button's name and key, 8 pt above the bar, centred over the button. Its own panel,
// because the bar's window paints its material over its whole rectangle, and macOS never shows a native tooltip in
// a panel that does not make Snapmark the active app (guide WIN-2, EX-7). Clicks pass through it; it never takes focus.
let tip: BrowserWindow | null = null;
let tipNow: BarTip | null = null;
let tipSize = { width: 0, height: 0 };
let tipWatch: ReturnType<typeof setInterval> | undefined;
export const barTipWindow = () => tip;

function placeTip() {
  if (!tip || !tipNow || !bar || !barOpen() || !tipSize.width) return;
  const b = bar.getBounds();
  const wa = screen.getDisplayMatching(b).workArea;
  const { width, height } = tipSize;
  const x = Math.round(b.x + tipNow.at.x + tipNow.at.width / 2 - width / 2);
  tip.setBounds({ x: Math.min(Math.max(x, wa.x), wa.x + wa.width - width), y: b.y - 8 - height, width, height });
  if (!tip.isVisible()) tip.showInactive();
}

// close: the bar is gone, so the window goes too; otherwise it is only hidden, ready for the next button.
function barTip(t: BarTip | null, close = false) {
  clearInterval(tipWatch);
  tipNow = t;
  if (close) {
    if (tip && !tip.isDestroyed()) tip.destroy(); // synchronous, unlike close(): gone before the capture's 200 ms wait
    tip = null;
    return;
  }
  if (!t) return void (tip && !tip.isDestroyed() && tip.hide());
  if (!tip || tip.isDestroyed()) {
    const w = new BrowserWindow({
      width: 160,
      height: 24,
      frame: false,
      transparent: true,
      hasShadow: true,
      roundedCorners: true,
      resizable: false,
      movable: false,
      minimizable: false,
      maximizable: false,
      fullscreenable: false,
      focusable: false,
      skipTaskbar: true,
      ...(process.platform === 'darwin' ? { type: 'panel' } : {}),
      vibrancy: 'popover',
      visualEffectState: 'active',
      show: false,
      webPreferences: { preload: path.join(__dirname, 'preload.js'), enablePreferredSizeMode: true },
    });
    w.setIgnoreMouseEvents(true);
    w.setContentProtection(true);
    w.setAlwaysOnTop(true, 'screen-saver');
    w.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true, skipTransformProcessType: true });
    w.webContents.on('preferred-size-changed', (_e, size) => {
      tipSize = size;
      placeTip();
    });
    w.webContents.once('did-finish-load', () => tipNow && w.webContents.send('tip:show', tipNow)); // asked before it loaded
    void w.loadFile(path.join(__dirname, 'tip.html'));
    tip = w;
    tipSize = { width: 0, height: 0 };
  }
  tip.webContents.send('tip:show', { text: t.text, key: t.key });
  placeTip();
}

// The pointer left the bar: the label stays while the pointer is on it, on the 8 pt strip under it, or back on the
// bar (WCAG 1.4.13), and goes once it is anywhere else.
export function keepsTip(t: Electron.Rectangle, b: Electron.Rectangle, p: Electron.Point) {
  const inside = (r: Electron.Rectangle) => p.x >= r.x && p.x < r.x + r.width && p.y >= r.y && p.y < r.y + r.height;
  return inside({ x: t.x, y: t.y, width: t.width, height: b.y - t.y }) || inside(b);
}

function leaveTip() {
  clearInterval(tipWatch);
  if (!tip || !tipNow || !bar || !barOpen()) return; // tipNow, not isVisible(): a label still loading counts too
  tipWatch = setInterval(() => {
    if (!tip || !bar || !barOpen()) return barTip(null);
    if (!keepsTip(tip.getBounds(), bar.getBounds(), screen.getCursorScreenPoint())) barTip(null);
  }, 100);
}

ipcMain.on('bar:tip', (e, t: BarTip | null) => fromBar(e) && barTip(t));
ipcMain.on('bar:tip-leave', (e) => fromBar(e) && leaveTip());

ipcMain.handle('bar:init', (): BarInit => barInit());
ipcMain.on('bar:close', (e) => fromBar(e) && bar!.close());
// Capture: the bar closes, then the mode runs once the window server has dropped it (the area picker's wait), so the
// bar is never in the screenshot (F205).
ipcMain.on('bar:capture', (e, mode: CaptureMode) => {
  if (!fromBar(e)) return;
  const [win, run] = [bar!, runBar];
  setCapture({ mode });
  const o = captureOpts;
  win.once('closed', () => setTimeout(() => void run(o), 200));
  win.close();
});
ipcMain.on('bar:options', (e, mode: CaptureMode, at: Area) => {
  if (!fromBar(e)) return;
  setCapture({ mode });
  const cur = menuState().current;
  const items = barOptions(
    { ...captureOpts, session: cur?.label ?? null, newSession: registered.has(SHORTCUTS.newSession) ? SHORTCUTS.newSession : null },
    {
      setOneShot: (oneShot) => setCapture({ oneShot }),
      setTimer: (timer) => setCapture({ timer }),
      setPointer: (pointer) => setCapture({ pointer }),
      newSession,
    },
  );
  popUnder(bar!, items, at);
});

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
export async function scrollCapture(a: Area, grab = grabArea, opts: { oneShot?: boolean } = {}): Promise<BrowserWindow | null> {
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
  return openEditor(tmp, { oneShot: opts.oneShot });
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
    // At the minimum size the toolbar still fits on one line (F108).
    minWidth: 820,
    minHeight: 520,
    title: `Snapmark — ${oneShot ? 'One-shot' : sessions.shortName(session)}`,
    // The page draws its own title row, with the traffic lights in it, like the session window.
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 12, y: 10 },
    webPreferences: { preload: path.join(__dirname, 'preload.js') },
  });
  const id = win.webContents.id;
  // Read while the editor loads: auto-redact and session.md wait for it, opening the editor never does.
  const text = desk.recognize(image);
  editors.set(id, { image, text, root, session, win, dirty: false, state: opts.state, replace: opts.replace, oneShot });
  win.once('focus', updateDock);
  win.on('page-title-updated', (e) => e.preventDefault()); // editor.html's <title> would replace the session name
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
  const picked = color ?? undefined;
  if (oneShot)
    return {
      src,
      session,
      count: 0,
      state,
      oneShot,
      beautify: state?.beautify ?? beautify ?? undefined,
      singleKeys,
      color: picked,
      customColors,
    };
  return {
    src,
    session: sessions.shortName(session),
    count: sessions.count(into, session),
    state,
    replacing: replace,
    singleKeys,
    color: picked,
    customColors,
  };
});

// The page is not trusted to send a colour: only #rrggbb is kept in state.json.
const isHex = (c: unknown): c is string => typeof c === 'string' && /^#[0-9a-f]{6}$/i.test(c);
ipcMain.on('editor:color', (_e, c: unknown) => {
  if (!isHex(c)) return;
  color = c;
  saveState();
});
ipcMain.on('editor:custom-colors', (_e, list: unknown) => {
  if (!Array.isArray(list) || list.length > 5 || !list.every(isHex)) return;
  customColors = list;
  saveState();
});

// Moves an open editor's screenshot to another session, which becomes the current one: the session label's menu.
export function moveEditor(win: BrowserWindow, name: string) {
  const ed = editors.get(win.webContents.id);
  if (!ed || ed.oneShot || ed.replace) return; // Edit Again and one-shot have no session menu
  ed.root = root;
  ed.session = name;
  setActive(name);
  tellEditors(root, name);
}

// Native menus under a control in the editor's header or the capture bar; `at` is the control's box in window points.
const popUnder = (...a: Parameters<typeof desk.popup>) => desk.popup(...a);

ipcMain.on('editor:sessions-menu', (e, at: Area) => {
  const ed = editors.get(e.sender.id);
  if (!ed || ed.oneShot || ed.replace) return;
  const moveTo = (name: string) => moveEditor(ed.win, name);
  popUnder(
    ed.win,
    editorSessionMenu(menuState(), ed.session, {
      moveTo,
      // As the menu bar's New Session; an empty current session is kept, and the editor moves to it either way.
      newSession: () => {
        newSession();
        if (active) moveTo(active);
      },
    }),
    at,
  );
});

// Copy or Save: the page copies or saves, since only it can flatten the marks.
ipcMain.on('editor:share-menu', (e, at: Area) => {
  const ed = editors.get(e.sender.id);
  if (!ed) return;
  const send = (what: 'copy' | 'saveAs') => () => void (ed.win.isDestroyed() || ed.win.webContents.send('editor:share', what));
  popUnder(ed.win, copyMenu({ copyImage: send('copy'), saveAs: send('saveAs') }), at);
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

// The one image: fitted whole within Claude's limits (parts.ts), or, for a tall screenshot, the whole page scaled to
// the part width only, so its parts can be cut from it at that width.
export function fitForAI(png: Buffer): Buffer {
  const img = nativeImage.createFromBuffer(png);
  const { width, height } = img.getSize();
  const tall = partLayout(width, height);
  const scale = tall ? tall.width / width : fitScale(width, height);
  if (scale === 1) return png;
  const size = tall ?? { width: Math.round(width * scale), height: Math.round(height * scale) }; // tall: the layout's own size
  return img.resize({ width: size.width, height: size.height, quality: 'best' }).toPNG();
}

// A tall screenshot's parts, cut top to bottom from its one image (fitForAI's output); [] when it is not tall.
export function cutParts(png: Buffer): Buffer[] {
  const img = nativeImage.createFromBuffer(png);
  const { width, height } = img.getSize();
  const layout = partLayout(width, height);
  return layout ? layout.parts.map((p) => img.crop({ x: 0, y: p.y, width, height: p.height }).toPNG()) : [];
}

// Auto-redact: where the screenshot's text holds an email, a key or token, a card number or an IBAN (redact.ts).
// Null when there is no text recognition, so the editor tries again on Edit Again.
ipcMain.handle('editor:secrets', async (e): Promise<Box[] | null> => {
  const lines = await editorFor(e.sender.id).text;
  return lines && secretBoxes(lines);
});

ipcMain.handle('editor:save', async (e, { png, caption, notes, cards, moves, state }: EditorSave): Promise<number> => {
  const { root: into, session, image, replace, oneShot, text: read } = editorFor(e.sender.id);
  if (oneShot) throw new Error('A one-shot screenshot is never added to a session');
  for (const v of viewers.values()) if (v.root === into && v.session === session) await flushViewer(v);
  const out = fitForAI(Buffer.from(png, 'base64'));
  // What is under a Redact mark, the owner's or auto-redact's, never reaches session.md either.
  const hidden = state.items.flatMap((i) => ((i as { t?: string }).t === 'redact' ? [(i as { r: Box }).r] : []));
  const lines = await read;
  const text = { caption, notes, cards, moves, text: lines ? ocrText(lines, hidden) : '' };
  // Cut from the flattened image, so Redact marks and auto-redact reach every part (F9).
  const parts = cutParts(out);
  // Edit Again on an entry removed in the meantime adds it back as a new one.
  const n =
    replace && sessions.replaceShot(into, session, replace, out, text, parts) ? replace : sessions.addShot(into, session, out, text, parts);
  sessions.saveEdit(into, session, n, fs.readFileSync(image), JSON.stringify(state));
  // Only the marks changed: session.md is the same text, so the watcher never reloads; show the new image anyway (F21).
  if (n === replace)
    for (const v of viewers.values())
      if (v.root === into && v.session === session) v.win.webContents.send('viewer:reload', { ...viewerData(v), images: true });
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
      ed.win.setTitle(`Snapmark — ${sessions.shortName(name)}`);
      ed.win.webContents.send('editor:session', sessions.shortName(name), sessions.count(into, name));
    }
}

// Out of the owner's sight, and swapped by the smoke test, which must not touch the clipboard, the Dock or the screen,
// show a notification or wait on a dialog or a native menu, and runs on Linux, where there is no text recognition.
export const desk = {
  recognize,
  popup: (win: BrowserWindow, items: MenuItemConstructorOptions[], at: Area) =>
    Menu.buildFromTemplate(items).popup({ window: win, x: Math.round(at.x), y: Math.round(at.y + at.height) }),
  copyImage: (png: Buffer) => clipboard.write([new ClipboardItem({ 'image/png': new Blob([new Uint8Array(png)], { type: 'image/png' }) })]),
  copyText: (text: string): void => void clipboard.writeText(text),
  savePath: (win: BrowserWindow, opts: Electron.SaveDialogOptions) => dialog.showSaveDialog(win, opts),
  notify: (body: string, onClick?: () => void) => {
    const n = new Notification({ title: 'Snapmark', body });
    if (onClick) n.on('click', onClick);
    n.show();
  },
  // The capture itself; `done` gets screencapture's error and what it wrote to stderr.
  screencapture: (args: string[], done: (err: Error | null, stderr: string) => void): void =>
    void execFile('screencapture', args, (err, _out, stderr) => done(err, String(stderr ?? ''))),
  dock: (on: boolean) => quiet || (on ? void app.dock?.show() : app.dock?.hide()),
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
    minWidth: 720,
    minHeight: 480,
    title: `${sessions.shortName(name)} — Snapmark`,
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
  const name = sessions.namePart(v.session);
  return {
    session: v.session,
    label: sessions.shortName(v.session),
    name,
    stamped: name !== v.session, // the date stays when it is renamed
    base: `${pathToFileURL(dir).href}/`,
    md: v.known,
    shots,
    discarded,
  };
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
// Also says which Discarded folder it went to, so ⌘Z puts back exactly that one.
ipcMain.handle('viewer:remove', async (e, n: number): Promise<{ data: ViewerInit; dir: string | null }> => {
  const v = viewerFor(e.sender.id);
  await flushViewer(v);
  const dir = sessions.removeShot(v.root, v.session, n);
  tellEditors(v.root, v.session);
  return { data: viewerData(v), dir };
});

// Why a rename to `wanted` did not happen, for the session window's hint and the menu's dialog; null when it did, or
// when the name is unchanged.
async function tryRename(name: string, wanted: string, into: string): Promise<string | null> {
  const problem = sessions.nameProblem(wanted);
  if (problem) return problem;
  const to = sessions.renamedTo(name, wanted);
  if (!to) return 'Enter a name.'; // only a session without a date stamp can end up with no name
  if (to === name) return null;
  for (const v of viewers.values()) if (v.root === into && v.session === name) await flushViewer(v); // its title line changes
  try {
    return renameSession(name, wanted, into) ? null : `${sessions.shortName(to)} already exists. Choose another name.`;
  } catch (err) {
    return `Couldn't rename: ${err instanceof Error ? err.message : String(err)}`; // the folder moved, or no permission
  }
}

ipcMain.handle('viewer:rename', (e, wanted: string): Promise<string | null> => {
  const v = viewerFor(e.sender.id);
  return tryRename(v.session, wanted, v.root);
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
  // The parts folder inside a removed tall screenshot's folder counts as picking that folder (F20).
  const picked = path.resolve(filePaths[0]);
  const dir = path.basename(picked) === 'parts' ? path.dirname(picked) : picked;
  const d = sessions.discarded(root).find((x) => x.dir === dir);
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
    `"${sessions.TEXT_SUMMARY}" under an entry is the text recognised on the image, top to bottom; [redacted] is private data pixelated on it.`,
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
    updateWaiting,
    shortcuts: Object.fromEntries(
      Object.entries(SHORTCUTS).map(([k, key]) => [k, registered.has(key) ? key : null]),
    ) as MenuState['shortcuts'],
    area,
    areaForgotten,
    iconDir: path.join(__dirname, '../../assets'),
    hasDiscarded: sessions.discarded(root).length > 0,
  };
}

// The menu bar menu as it is right now; built on every open, so counts and sessions changed in Finder are never stale.
export const menuItems = () => menuTemplate(menuState(), actions);
const popMenu = () => tray?.popUpContextMenu(Menu.buildFromTemplate(menuItems()));

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
// Prompt and default answer go in as argv, never into the script text, so no session name can break the script.
// A refused, empty or failed name asks again, with the reason as the prompt and the typed name filled in.
function renameFromMenu(name: string, why?: string, typed?: string) {
  const stamped = sessions.namePart(name) !== name;
  const prompt = why ?? (stamped ? `Name this session. The date ${name.slice(0, 10)} stays in front.` : 'Rename session');
  const script = [
    'on run argv',
    'text returned of (display dialog (item 1 of argv) default answer (item 2 of argv) buttons {"Cancel", "Rename"} default button "Rename")',
    'end run',
  ];
  execFile('osascript', [...script.flatMap((l) => ['-e', l]), prompt, typed ?? sessions.namePart(name)], async (err, stdout) => {
    if (err) return;
    const wanted = stdout?.trim() ?? '';
    const problem = await tryRename(name, wanted, root);
    if (problem) renameFromMenu(name, problem, wanted);
  });
}

async function otherSession() {
  focusApp();
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: 'Choose a session',
    message: 'Session folders start with their date.',
    defaultPath: root,
    properties: ['openDirectory'],
  });
  const dir = filePaths[0];
  if (canceled || !dir) return;
  if (path.dirname(dir) !== path.resolve(root) || !fs.existsSync(path.join(dir, 'session.md')))
    return notify(`That folder is not a session in ${tilde(root)}.`);
  setActive(path.basename(dir));
}

let shortcutsWin: BrowserWindow | null = null;

// The key list (⌘/ in any Snapmark window, Settings ▸ Shortcuts ▸ Show All Shortcuts): src/shortcuts.html draws
// KEY_GROUPS and the toolbar's own tool list, so the three never disagree. One window, brought forward if open; Esc and
// ⌘W close it.
export function showShortcuts(): BrowserWindow {
  if (shortcutsWin && !shortcutsWin.isDestroyed()) {
    shortcutsWin.show();
    focusApp();
    return shortcutsWin;
  }
  const win = (shortcutsWin = new BrowserWindow({
    width: 980,
    height: 680,
    minWidth: 560,
    minHeight: 400,
    title: 'Keyboard Shortcuts',
    webPreferences: { preload: path.join(__dirname, 'preload.js') },
  }));
  void win.loadFile(path.join(__dirname, 'shortcuts.html'));
  focusApp();
  return win;
}

ipcMain.handle('shortcuts:init', (): ShortcutsInit => ({ groups: KEY_GROUPS, singleKeys }));

// The Settings window (Settings… ⌘,): General, Capture and Shortcuts, as a macOS Settings window. One window, brought
// forward if open; the page reads its data again whenever it comes forward.
let settingsWin: BrowserWindow | null = null;
export function openSettings(): BrowserWindow {
  if (settingsWin && !settingsWin.isDestroyed()) {
    settingsWin.show();
    focusApp();
    return settingsWin;
  }
  const win = (settingsWin = new BrowserWindow({
    width: 560,
    height: 420,
    useContentSize: true,
    resizable: false,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    title: 'Settings', // the page names the tab shown
    webPreferences: { preload: path.join(__dirname, 'preload.js') },
  }));
  void win.loadFile(path.join(__dirname, 'settings.html'));
  focusApp();
  return win;
}

const settingsInit = (): SettingsInit => ({
  login: loginState(app.isPackaged, app.getLoginItemSettings()),
  root: tilde(root),
  canChangeRoot: !process.env.SNAPMARK_ROOT,
  version: app.getVersion(),
  canUpdate: app.isPackaged,
  singleKeys,
  // The Keyboard Shortcuts window's global keys (keys.ts), ⌃⇧4 standing for Control+Shift+4
  keys: KEY_GROUPS[0].rows
    .filter(([k]) => k.startsWith('⌃⇧'))
    .map(([cap, name]) => ({ cap, name, taken: !registered.has(`Control+Shift+${cap.slice(2)}`) })),
  capture: captureOpts,
});

// Every window shares one preload: only the Settings window may change settings (M2-3).
const fromSettings = (e: { sender: Electron.WebContents }) =>
  !!settingsWin && !settingsWin.isDestroyed() && e.sender === settingsWin.webContents;
ipcMain.handle('settings:init', () => settingsInit());
ipcMain.handle('settings:set', (e, key: SettingsKey, value: unknown): SettingsInit => {
  if (!fromSettings(e)) return settingsInit();
  if (key === 'oneShot' || key === 'timer' || key === 'pointer')
    setCapture({ [key]: value }); // drops a bad value
  else if (typeof value !== 'boolean') return settingsInit();
  else if (key === 'singleKeys')
    setSingleKeys(value); // open editors hear it
  // Never in a development build: it would register the bare Electron binary (loginState).
  else if (key === 'login' && app.isPackaged) app.setLoginItemSettings({ openAtLogin: value });
  return settingsInit();
});
// What the Settings submenu's items did, now buttons in the window.
ipcMain.handle('settings:run', async (e, what: SettingsRun): Promise<SettingsInit> => {
  if (!fromSettings(e)) return settingsInit();
  if (what === 'chooseRoot') await chooseRoot();
  else if (what === 'clearOld') await clearOldSessions();
  else if (what === 'checkUpdates') await checkForUpdatesNow();
  else if (what === 'loginItems') await shell.openExternal('x-apple.systempreferences:com.apple.LoginItems-Settings.extension');
  else if (what === 'shortcuts') showShortcuts();
  return settingsInit();
});

const actions: MenuActions = {
  captureArea: keyHandlers.capture,
  captureNewArea: keyHandlers.newArea,
  captureFullScreen: keyHandlers.fullScreen,
  captureOneShot: keyHandlers.oneShot,
  captureBar: keyHandlers.options,
  newSession,
  copyPrompt: (name) => {
    desk.copyText(promptFor(dirOf(name)));
    notify(`Prompt for ${sessions.shortName(name)} copied. Paste it into your AI agent.`);
  },
  copyPath: (name) => {
    desk.copyText(sessionMdPath(dirOf(name)));
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
  settings: () => void openSettings(),
  keyboardShortcuts: showShortcuts,
  installUpdate: () => autoUpdater.quitAndInstall(),
  quit: () => app.quit(),
};

app.whenReady().then(() => {
  // Snapmark's own app menu (Settings… ⌘,), shown while one of its windows is in front; set before the quiet return
  // so the smoke test has it too.
  Menu.setApplicationMenu(Menu.buildFromTemplate(appMenu(actions)));
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
  for (const [name, key] of Object.entries(SHORTCUTS) as [keyof typeof SHORTCUTS, string][]) {
    if (globalShortcut.register(key, keyHandlers[name])) registered.add(key);
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
  const oneShots = open.filter((ed) => ed.oneShot).length;
  void dialog
    .showMessageBox(first, {
      type: 'warning',
      message: quitMessage(open.length - oneShots, oneShots),
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
