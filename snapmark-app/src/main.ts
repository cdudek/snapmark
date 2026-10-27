import {
  app,
  BrowserWindow,
  desktopCapturer,
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
import crypto from 'crypto';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { pathToFileURL } from 'url';
import { autoUpdater } from 'electron-updater';
import * as sessions from './sessions';
import { exportPdf, exportZip } from './exporter';
import { menuTemplate, appMenu, loginState, editorSessionMenu, copyMenu, quitMessage, MenuActions, MenuState, SessionInfo } from './menu';
import { SHORTCUTS, KEY_GROUPS } from './keys';
import {
  FIRST,
  REC_CAP_MS,
  barHeads,
  barLabel,
  barOptions,
  barSize,
  captureArgs,
  checkedCapture,
  clock,
  panelAt,
  recordStatus,
  rect,
  shotFiles,
} from './capture';
import type { MenuItemConstructorOptions } from 'electron';
import { Bitmap, MAX_HEIGHT, stitcher } from './stitch';
import { fitScale, partLayout } from './parts';
import { Box, ocrText, OcrLine, recognize } from './ocr';
import { secretBoxes } from './redact';
import { keyFrames } from './keyframes';
import { writeGif } from './gif';
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
let viewerSize: { width: number; height: number } | null = null; // the size the owner last gave a session window
let beautify: Beautify | null = null; // one-shot mode's settings as last used: the one preset
let captureOpts: CaptureOpts = FIRST; // the capture bar's mode, Session | One-Shot, Timer and Show Mouse Pointer, as last used
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
  recording?: Recording; // the recording editor: its frames, which it owns like `image`
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
    viewerSize = state.viewerSize ?? null;
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
    JSON.stringify({ active, root, used, area, editorSize, viewerSize, beautify, singleKeys, color, customColors, capture: captureOpts }),
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
  tellBar(); // an open bar's session pop-up names it
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
let launching = false; // the bar has closed for a capture, which starts once the window server has dropped it
let recording = false; // Record records
let bar: BrowserWindow | null = null; // the capture bar (⌃⇧5)
const barOpen = () => !!bar && !bar.isDestroyed();
// One capture at a time: a capture key or item while one is running does nothing, ⌃⇧N included. An open bar counts
// for captures, or it would be in the picture of the macOS overlay; its session pop-up offers New Session.
const capturing = () => picking || scrolling || shooting || counting || launching || recording;
const busy = () => capturing() || barOpen();

// The same area every time, e.g. the page in a browser. The first time, after Choose New Area, or when the display
// it was on is gone, the owner drags it first.
// `o`: the capture bar's options; ⌃⇧1, ⌃⇧4 and the menu rows capture without them (F217).
const onScreen = (a: Area) =>
  screen
    .getAllDisplays()
    .some(({ bounds: b }) => a.x >= b.x && a.y >= b.y && a.x + a.width <= b.x + b.width && a.y + a.height <= b.y + b.height);
async function captureArea(choose = false, o?: CaptureOpts) {
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
  if (o?.timer && !(await countdown(o.timer, area))) return;
  shoot(captureArgs(choose ? 'area' : 'last', { pointer: !!o?.pointer }, area), o?.oneShot);
}

// ⌃⇧3, like macOS's ⇧⌘3: every display at once, no picker, one editor per display, the pointer's in front.
// `o`: the capture bar's Full Screen, with its Timer, Show Mouse Pointer and One-Shot; the ⌃⇧3 key passes none.
// shortcut: Electron's display order is taken as screencapture's (the main display first), true for two displays; match
// by bounds if a third ever lands in the wrong editor.
async function captureFullScreen(o?: CaptureOpts) {
  if (busy()) return;
  if (o?.timer && !(await countdown(o.timer))) return;
  const files = shotFiles(path.join(os.tmpdir(), `snapmark-${Date.now()}`), screen.getAllDisplays().length);
  const here = screen.getDisplayNearestPoint(screen.getCursorScreenPoint()).id;
  const top = files[screen.getAllDisplays().findIndex((d) => d.id === here)];
  shoot(captureArgs('full', { pointer: !!o?.pointer }), o?.oneShot, files, top);
}

// The global keys, as macOS's ⇧⌘1–⇧⌘5 (ADR 2026-10-25, keys follow macOS), and ⌃⇧N. Each does nothing while a capture
// runs. Exported so the smoke test presses them as globalShortcut would.
export const keyHandlers: Record<keyof typeof SHORTCUTS, () => void> = {
  newArea: () => void captureArea(true),
  oneShot: () => void (busy() || shoot(['-i'], true)), // -i: macOS's overlay; Space picks a window
  fullScreen: () => void captureFullScreen(),
  capture: () => void captureArea(),
  // while recording it is Done (F66); during a countdown it cancels (F31)
  options: () => void (stopRecording ? stopRecording(true) : cancelCountdown ? cancelCountdown() : openCaptureBar()),
  newSession: () => void (capturing() || newSession()),
};

// The bar's Timer, once the area is known (`at`; none for Full Screen): the countdown overlay and the seconds left
// beside the menu bar icon (CAP-10). Esc, taken from every app only while it counts (never in quiet runs), ⌃⇧5 and a
// click on the icon cancel: nothing is captured, and no message shows (F31). False when cancelled.
let cancelCountdown: (() => void) | null = null;
async function countdown(seconds: number, at?: Area | null, rec = false): Promise<boolean> {
  let cancelled = false;
  counting = true;
  cancelCountdown = () => void (cancelled = true);
  if (!quiet) globalShortcut.register('Escape', cancelCountdown);
  const win = countdownPanel(seconds, at, rec);
  // destroy(), synchronous unlike close(): the overlay and the digit are gone before the wait below (F30)
  const end = () => {
    if (!win.isDestroyed()) win.destroy();
    tray?.setTitle('');
  };
  try {
    for (let s = seconds; s > 0 && !cancelled; s--) {
      tray?.setTitle(String(s));
      if (s < seconds && !win.isDestroyed()) win.webContents.send('countdown:digit', s);
      for (let t = 0; t < 10 && !cancelled; t++) await new Promise((r) => setTimeout(r, 100));
    }
    end();
    if (!cancelled) await new Promise((r) => setTimeout(r, 200)); // the area picker's wait for the window server
    return !cancelled;
  } finally {
    end();
    if (!quiet) globalShortcut.unregister('Escape');
    cancelCountdown = null;
    counting = false;
  }
}

// The countdown overlay (countdown.html) over the area's display, or the pointer's for Full Screen: a click-through
// panel that never takes focus and is kept out of screen captures, built as the bar's old label was (F29). With 0
// seconds it is the area's outline alone, while Record records; `rec` says the countdown is Record's.
function countdownPanel(seconds: number, at?: Area | null, rec = false): BrowserWindow {
  const { bounds } = at ? screen.getDisplayMatching(at) : screen.getDisplayNearestPoint(screen.getCursorScreenPoint());
  const win = new BrowserWindow({
    ...bounds,
    frame: false,
    transparent: true,
    hasShadow: false,
    resizable: false,
    movable: false,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    focusable: false,
    skipTaskbar: true,
    enableLargerThanScreen: true, // over the menu bar too, as the area picker
    ...(process.platform === 'darwin' ? { type: 'panel' } : {}),
    show: false,
    webPreferences: { preload: path.join(__dirname, 'preload.js') },
  });
  win.setIgnoreMouseEvents(true);
  win.setContentProtection(true);
  win.setAlwaysOnTop(true, 'screen-saver');
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true, skipTransformProcessType: true });
  win.once('ready-to-show', () => win.showInactive());
  const local = at && { x: at.x - bounds.x, y: at.y - bounds.y, w: at.width, h: at.height };
  void win.loadFile(path.join(__dirname, 'countdown.html'), { query: strings({ s: seconds, ...local, ...(rec && { rec: 1 }) }) });
  return win;
}

// A page's query: every value a string.
const strings = (o: Record<string, string | number>) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, String(v)]));

// `screencapture -i` never says where its region was, so the area to repeat is dragged in Snapmark's own
// see-through window over the display with the pointer. Resolves once that window is off the screen. `mode` picks the
// hint: Capture Scrolling's, the one saying the last area's display is gone, the one after a New Session, or Record's.
// `keep`: Record's last area, shown on its display for ↩ to keep (F61).
export function pickArea(mode: '' | 'scroll' | 'gone' | 'new' | 'record' = '', keep?: Area | null): Promise<Area | null> {
  const { bounds } = keep ? screen.getDisplayMatching(keep) : screen.getDisplayNearestPoint(screen.getCursorScreenPoint());
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
  const query = keep && strings({ x: keep.x - bounds.x, y: keep.y - bounds.y, w: keep.width, h: keep.height });
  void win.loadFile(path.join(__dirname, 'area.html'), { ...(mode && { hash: mode }), ...(query && { query }) });
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
// Timer and Show Mouse Pointer apply to areas and the full screen (capture.ts timed).
async function runCapture(o: CaptureOpts) {
  if (o.mode === 'window') return void (busy() || shoot(captureArgs('window', o), o.oneShot));
  if (o.mode === 'scroll') return captureScrolling(o.oneShot);
  if (o.mode === 'full') return captureFullScreen(o);
  if (o.mode === 'record') return captureRecord(o);
  return captureArea(o.mode === 'area', o);
}

// Record (the capture bar's sixth mode): the picker on the last area, where ↩ keeps it and a drag replaces it (Q11);
// a countdown of 3, or the Timer's when longer (F62); then the recording until Done, ⌃⇧5, the menu bar icon or 30 s.
async function captureRecord(o: CaptureOpts) {
  if (busy()) return;
  const keep = area && onScreen(area) ? area : null;
  picking = true;
  const picked = await pickArea(area && !keep ? 'gone' : 'record', keep).finally(() => (picking = false));
  if (!picked) return;
  area = picked;
  areaForgotten = false;
  saveState();
  if (!(await countdown(Math.max(3, o.timer), area, true))) return;
  const r = await recordArea(area, o);
  if (r) recordings.open(r, o.oneShot);
}

// What Done hands over: the recording editor on its key frames. Swappable, so the smoke test sees the frames.
export const recordings = {
  open: (r: Recording, oneShot: boolean) => void openRecording(r, { oneShot }),
};

// The key frames (keyframes.ts): at once from the recorder's small copies; a recording reopened from Discarded has
// none, so its files are read again, for at most LIMIT_MS (F77). Frames with the same bytes are the same picture.
// shortcut: that second way blocks the main process while it reads (seconds for a long Retina recording); move it
// to a worker if reopening a recording ever feels stuck.
function findKeys(r: Recording): Recording {
  if (r.keys) return r;
  const small = (i: number) => {
    const img = nativeImage.createFromPath(r.frames[i]).resize({ width: 64 });
    return { ...img.getSize(), data: img.toBitmap() };
  };
  const { keys, evenly } = keyFrames(r.frames.length, r.thumbs ? (i) => r.thumbs![i] : small);
  const hashes = r.hashes ?? r.frames.map((f) => crypto.createHash('sha1').update(fs.readFileSync(f)).digest('hex'));
  return { ...r, thumbs: undefined, keys, evenly, hashes };
}

// The recording editor: `r`'s frames, which it owns and deletes on close, with marks to put back (`state`), and
// Edit Again's entry (`replace`).
function openRecording(r: Recording, opts: { session?: string; state?: EditState; replace?: number; oneShot?: boolean }) {
  return openEditor(r.frames[0], { ...opts, recording: findKeys(r) });
}

// The editor deletes its frames on close, so a recording kept in Discarded or a session opens on a copy.
function tempRecording(r: Recording): Recording {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'snapmark-rec-'));
  fs.cpSync(r.dir, dir, { recursive: true });
  return { ...r, dir, frames: r.frames.map((f) => path.join(dir, path.basename(f))) };
}

// Done (true) or ⓧ (false) while Record records: ⌃⇧5 and the menu bar icon are Done too (F66).
// Resolves once the frames are where they go.
let stopRecording: ((keep: boolean) => Promise<unknown>) | null = null;

// Records `a` at `o.fps` until Done, ⌃⇧5, the menu bar icon or `cap` (30 s, F64), into one PNG file per frame,
// written as each comes from recorder.html. Takes no key (F65). ⓧ puts the frames in Discarded (F67); a failed grab
// stops, keeps nothing and says so (F81). Resolves to the recording Done keeps, else null.
export function recordArea(a: Area, o: { fps: number; oneShot?: boolean }, cap = REC_CAP_MS): Promise<Recording | null> {
  // The outline and the panel are content-protected and the recorder never shows, so no Snapmark window is in a frame (F68).
  // A setup that throws leaves nothing behind and Snapmark not busy, so every capture still works.
  let dir = '';
  const parts: BrowserWindow[] = [];
  try {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'snapmark-rec-'));
    parts.push(countdownPanel(0, a));
    parts.push(recordPanel(a, o.fps));
  } catch (err) {
    for (const w of parts) if (!w.isDestroyed()) w.destroy();
    if (dir) fs.rmSync(dir, { recursive: true, force: true });
    notify(`Recording failed: ${err instanceof Error ? err.message : String(err)}. Nothing was added. Click to try again.`, () =>
      busy() ? undefined : void captureRecord({ ...captureOpts, mode: 'record' }),
    );
    return Promise.resolve(null);
  }
  const [outline, panel] = parts;
  recording = true;
  const [frames, times]: [string[], number[]] = [[], []];
  const [thumbs, hashes]: [Bitmap[], string[]] = [[], []];
  const { id, bounds: b } = screen.getDisplayMatching(a);
  let rec: BrowserWindow | null = null;
  let started = 0; // when the first frame came
  let pending = false; // Done before the first frame: it stops on that frame, so a recording has one
  let ended = false;
  let written: Promise<unknown> = Promise.resolve(); // the frame files, written one after another off the main thread
  let lost = ''; // why a frame could not be written
  return new Promise((resolve) => {
    const finish = (how: 'done' | 'cancel' | { failed: string }) => {
      if (ended) return written;
      if (how === 'done' && !frames.length) return ((pending = true), written);
      ended = true;
      clearInterval(tick);
      ipcMain.off('recorder:frame', onFrame);
      ipcMain.off('recorder:failed', onFailed);
      ipcMain.off('scroll:done', onPanel);
      for (const w of [rec, panel, outline]) if (w && !w.isDestroyed()) w.destroy();
      tray?.setTitle('');
      stopRecording = null;
      recording = false;
      const r: Recording = { dir, frames, times, end: Math.min(cap, Date.now() - started) / 1000, fps: o.fps, thumbs, hashes };
      return (written = written.then(() => settle(lost ? { failed: lost } : how, r)));
    };
    const settle = (how: 'done' | 'cancel' | { failed: string }, r: Recording) => {
      // The key frames come from the small copies at once, so "Finding key frames…" never shows (FBK-6: past 400 ms)
      if (how === 'done') return resolve(findKeys(r));
      if (how !== 'cancel')
        notify(`Recording failed: ${how.failed.replace(/\.$/, '')}. Nothing was added. Click to try again.`, () =>
          busy() ? undefined : void captureRecord({ ...captureOpts, mode: 'record' }),
        );
      else if (frames.length) {
        try {
          // the session the recording editor would have used, made as it would be in Session mode (openEditor)
          const session = o.oneShot ? 'one-shot' : (active ?? sessions.create(root));
          if (!o.oneShot) setActive(session);
          sessions.discardRecording(root, session, r);
          for (const v of viewers.values()) if (v.root === root && v.session === session) reloadViewer(v); // its Discarded tab
        } catch (err) {
          notify(`Couldn't keep the recording in Discarded: ${err instanceof Error ? err.message : String(err)}`);
        }
      }
      fs.rmSync(dir, { recursive: true, force: true });
      resolve(null);
    };
    const failed = (err: unknown) => finish({ failed: err instanceof Error ? err.message : String(err) });
    const onFrame = (e: IpcMainEvent, t: unknown, png: unknown, thumb: unknown) => {
      if (ended || e.sender !== rec?.webContents || typeof t !== 'number' || !Number.isFinite(t) || !(png instanceof Uint8Array)) return;
      if (!(thumb instanceof Uint8Array) || !thumb.length || thumb.length % 256) return; // 64 pixels wide, RGBA
      if (t >= cap) return finish('done');
      const file = path.join(dir, `${String(frames.length).padStart(4, '0')}.png`);
      written = written
        .then(() => fs.promises.writeFile(file, png))
        .catch((err: unknown) => {
          lost ||= err instanceof Error ? err.message : String(err);
          void failed(err);
        });
      frames.push(file);
      times.push(t / 1000);
      thumbs.push({ width: 64, height: thumb.length / 256, data: thumb });
      hashes.push(crypto.createHash('sha1').update(png).digest('hex'));
      started ||= Date.now() - t;
      if (pending) finish('done');
    };
    const onFailed = (e: IpcMainEvent, reason: unknown) => e.sender === rec?.webContents && finish({ failed: String(reason) });
    const onPanel = (e: IpcMainEvent, ok: boolean) => e.sender === panel.webContents && finish(ok ? 'done' : 'cancel');
    ipcMain.on('recorder:frame', onFrame);
    ipcMain.on('recorder:failed', onFailed);
    ipcMain.on('scroll:done', onPanel);
    stopRecording = (keep) => finish(keep ? 'done' : 'cancel');
    // The clock on the panel and beside the menu bar icon; at the cap it stops as Done does. No first frame in 10 s
    // is a failed grab, so a recorder that never starts cannot keep Snapmark busy.
    const opened = Date.now();
    const tick = setInterval(() => {
      const ms = started && Date.now() - started;
      if (ms >= cap) return finish('done');
      if (!started && Date.now() - opened > 10_000) return failed(new Error('no picture came from the screen'));
      if (!panel.isDestroyed())
        panel.webContents.send('record:status', { clock: recordStatus(ms, o.fps), seconds: ms / 1000 } satisfies RecordStatus);
      tray?.setTitle(clock(ms));
    }, 100);
    desk.screenSource(id).then((source) => {
      if (ended) return;
      rec = new BrowserWindow({
        show: false,
        webPreferences: { preload: path.join(__dirname, 'preload.js'), backgroundThrottling: false },
      });
      rec.webContents.on('render-process-gone', (_e, d) => failed(new Error(`the recorder stopped (${d.reason})`)));
      const query = strings({ source, x: a.x - b.x, y: a.y - b.y, w: a.width, h: a.height, bw: b.width, bh: b.height, fps: o.fps });
      void rec.loadFile(path.join(__dirname, 'recorder.html'), { query });
    }, failed);
  });
}

// The recording control (scroll.html#record) beside the area: never focused, so the recorded app keeps every key (F65).
function recordPanel(a: Area, fps: number): BrowserWindow {
  const win = new BrowserWindow({
    ...panelAt(a, screen.getDisplayMatching(a).workArea, 600, 64),
    frame: false,
    transparent: true,
    resizable: false,
    movable: false,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    focusable: false,
    acceptFirstMouse: true, // it is never the key window, so every click must reach ⓧ and Done
    skipTaskbar: true,
    ...(process.platform === 'darwin' ? { type: 'panel' } : {}),
    show: false,
    webPreferences: { preload: path.join(__dirname, 'preload.js') },
  });
  win.setContentProtection(true);
  win.setAlwaysOnTop(true, 'screen-saver');
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true, skipTransformProcessType: true });
  win.once('ready-to-show', () => win.showInactive());
  void win.loadFile(path.join(__dirname, 'scroll.html'), { hash: 'record', query: { fps: String(fps) } }); // the clock's fps from the start (F63)
  return win;
}

// The capture bar (⌃⇧5, Capture Options…), like macOS's ⇧⌘5: bottom centre of the display with the pointer, over
// every Space and full-screen app. A non-activating panel that becomes the key window, so its keys reach the bar and
// never the app behind, which stays active (CAP-13). `run` is swappable so the smoke test never runs screencapture.
// One bar: asked again, it comes forward.
let runBar: (o: CaptureOpts) => unknown = runCapture;
let barNarrow = false;
export function openCaptureBar(run: (o: CaptureOpts) => unknown = runCapture): BrowserWindow | null {
  if (bar && barOpen()) {
    bar.show();
    bar.focus();
    return bar;
  }
  if (busy()) return null;
  runBar = run;
  const { workArea: wa } = screen.getDisplayNearestPoint(screen.getCursorScreenPoint());
  const { width, narrow } = barSize(wa.width);
  barNarrow = narrow;
  // Bottom centre, 24 pt above the work area's bottom, clear of the Dock (WIN-3).
  const at = (w: number, h: number) => ({
    x: Math.round(wa.x + (wa.width - w) / 2),
    y: Math.round(wa.y + wa.height - 24 - h),
    width: w,
    height: h,
  });
  const win = new BrowserWindow({
    ...at(width, 132), // until the page reports its height
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
  // As tall as its content, so a hint that wraps grows the bar instead of hiding a control (F27).
  win.webContents.on('preferred-size-changed', (_e, { height }) => win.setBounds(at(win.getBounds().width, height)));
  // The page's zoom is known once it loads: at about 150 % the bar is narrow and wider (F27).
  // shortcut: a zoom changed while the bar is open shows the next time it opens; follow it live if the bar ever stays up.
  win.webContents.once('did-finish-load', () => {
    const fit = barSize(wa.width, win.webContents.getZoomFactor());
    barNarrow = fit.narrow;
    win.setBounds(at(fit.width, win.getBounds().height));
    tellBar();
  });
  win.setContentProtection(true); // belt and braces: it closes before every capture
  win.setAlwaysOnTop(true, 'screen-saver');
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true, skipTransformProcessType: true });
  win.once('ready-to-show', () => {
    win.show();
    win.focus(); // a panel takes the keys without activating Snapmark; never app.focus, which would leave a full-screen Space
  });
  // Esc closes the bar from every app while it is open, also after a click took the focus elsewhere (CAP-12, EX-7).
  // Never in quiet runs, which would take the owner's Esc while the tests run beside their apps.
  if (!quiet) globalShortcut.register('Escape', () => barOpen() && bar!.close());
  win.once('closed', () => quiet || globalShortcut.unregister('Escape'));
  void win.loadFile(path.join(__dirname, 'bar.html'));
  return win;
}

const fromBar = (e: { sender: Electron.WebContents }) => !!bar && barOpen() && e.sender === bar.webContents;
const barInit = (): BarInit => {
  const cur = menuState().current;
  return {
    ...captureOpts,
    label: barLabel(captureOpts),
    heads: barHeads(area, captureOpts.fps),
    session: cur && { label: cur.label, count: cur.count },
    narrow: barNarrow,
  };
};
function tellBar() {
  if (bar && barOpen()) bar.webContents.send('bar:state', barInit());
}

// The bar's Options menu, its Session | One-Shot and the Settings window's Capture tab change the same options; an
// open bar shows them.
export function setCapture(change: Partial<Record<keyof CaptureOpts, unknown>>) {
  captureOpts = checkedCapture({ ...captureOpts, ...change }, captureOpts); // a bad value from a renderer is dropped
  saveState();
  tellBar();
}

ipcMain.handle('bar:init', (): BarInit => barInit());
ipcMain.on('bar:close', (e) => fromBar(e) && bar!.close());
// Capture: the bar closes, then the mode runs once the window server has dropped it (the area picker's wait), so the
// bar is never in the screenshot (F205).
ipcMain.on('bar:capture', (e, mode: CaptureMode) => {
  if (!fromBar(e)) return;
  const [win, run] = [bar!, runBar];
  setCapture({ mode });
  const o = captureOpts;
  launching = true; // the 200 ms between bar and capture are busy too (F10)
  win.once('closed', () =>
    setTimeout(() => {
      launching = false;
      void run(o);
    }, 200),
  );
  win.close();
});
ipcMain.on('bar:options', (e, mode: CaptureMode, at: Area) => {
  if (!fromBar(e)) return;
  setCapture({ mode });
  const items = barOptions(captureOpts, {
    setFps: (fps) => setCapture({ fps }),
    setTimer: (timer) => setCapture({ timer }),
    setPointer: (pointer) => setCapture({ pointer }),
  });
  popUnder(bar!, items, at);
});
// Session | One-Shot replaces Options ▸ Save to (F20, F24).
ipcMain.on('bar:one-shot', (e, oneShot: boolean) => fromBar(e) && setCapture({ oneShot }));
// The session pop-up, shared with the editor: a pick makes that session current, as the menu bar's makeCurrent (F23).
// One-Shot captures go to no session, so it does not open then (F21).
ipcMain.on('bar:sessions', (e, at: Area) => {
  if (!fromBar(e) || captureOpts.oneShot) return;
  const pick = { moveTo: setActive, older: () => void otherSession(), newSession };
  popUnder(bar!, editorSessionMenu(menuState(), active ?? '', pick), at);
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
// it in one-shot mode, which has no session and never makes or changes one. `recording` opens the recording editor on
// its frames (`image` is its first), which it owns instead.
// An editor or session window opens centred on the screen with the pointer: at 90 % of it the first time, then at the
// size the owner last gave that kind of window, never larger than that screen.
function openingBounds(remembered: { width: number; height: number } | null) {
  const { workArea: wa } = screen.getDisplayNearestPoint(screen.getCursorScreenPoint());
  const want = remembered ?? { width: wa.width * 0.9, height: wa.height * 0.9 };
  const [width, height] = [Math.min(want.width, wa.width), Math.min(want.height, wa.height)].map(Math.round);
  return { x: Math.round(wa.x + (wa.width - width) / 2), y: Math.round(wa.y + (wa.height - height) / 2), width, height };
}

export function openEditor(
  image: string,
  opts: { session?: string; state?: EditState; replace?: number; oneShot?: boolean; recording?: Recording } = {},
): BrowserWindow {
  const { oneShot, recording } = opts;
  const session = oneShot ? '' : (opts.session ?? active ?? sessions.create(root));
  if (!opts.replace && !oneShot) setActive(session);
  const win = new BrowserWindow({
    ...openingBounds(editorSize),
    // At the minimum size the toolbar still fits on one line (F108).
    minWidth: 820,
    minHeight: 520,
    title: editorTitle(session),
    // The page draws its own title row, with the traffic lights in it, like the session window.
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 12, y: 10 },
    webPreferences: { preload: path.join(__dirname, 'preload.js') },
  });
  const id = win.webContents.id;
  // Read while the editor loads: auto-redact and session.md wait for it, opening the editor never does. Not for a
  // recording: its filmstrip is not one picture until it is saved.
  const text = recording ? Promise.resolve(null) : desk.recognize(image);
  editors.set(id, { image, text, root, session, win, dirty: false, state: opts.state, replace: opts.replace, oneShot, recording });
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
    fs.rmSync(recording ? recording.dir : image, { recursive: true, force: true });
  });
  win.loadFile(path.join(__dirname, 'editor.html'));
  focusApp();
  return win;
}

// "Snapmark — <session>"; One-Shot has no session ('').
const editorTitle = (session: string) => `Snapmark — ${session ? sessions.shortName(session) : 'One-Shot'}`;

function editorFor(id: number) {
  const ed = editors.get(id);
  if (!ed) throw new Error(`No editor for webContents ${id}`);
  return ed;
}

ipcMain.handle('editor:init', (e): EditorInit => {
  const { image, root: into, session, state, replace, oneShot, recording: r } = editorFor(e.sender.id);
  const src = r ? '' : `data:image/png;base64,${fs.readFileSync(image, 'base64')}`;
  return {
    src,
    ...(r && {
      recording: {
        size: nativeImage.createFromPath(image).getSize(),
        times: r.times,
        end: r.end,
        fps: r.fps,
        keys: r.keys ?? [0],
        evenly: !!r.evenly,
        ids: r.hashes ?? r.frames,
      },
    }),
    ...(oneShot
      ? { session, count: 0, oneShot }
      : { session: sessions.shortName(session), count: sessions.count(into, session), replacing: replace }),
    state,
    // In Session too, so a switch to One-Shot needs no reload
    beautify: state?.beautify ?? beautify ?? undefined,
    singleKeys,
    color: color ?? undefined,
    customColors,
  };
});

// A recording's frame as its file holds it: the page reads only the ones it shows.
ipcMain.handle('editor:frame', (e, i: unknown): Promise<Buffer> => {
  const r = editorFor(e.sender.id).recording;
  if (!r || !Number.isInteger(i) || (i as number) < 0 || (i as number) >= r.frames.length) throw new Error(`No frame ${String(i)}`);
  return fs.promises.readFile(r.frames[i as number]);
});

// Session | One-Shot in the editor: the same window switches, so its marks and undo stay (plan 2.1). Back in Session
// it goes to the current session, as a new editor would. Edit Again saves back into its entry and never switches.
ipcMain.handle('editor:destination', (e, one: unknown) => {
  const ed = editorFor(e.sender.id);
  if (!ed.replace && typeof one === 'boolean') {
    ed.oneShot = one;
    ed.root = root;
    ed.session = one ? '' : (active ?? sessions.create(root));
    if (!one) setActive(ed.session);
    ed.win.setTitle(editorTitle(ed.session));
  }
  const { root: into, session, oneShot } = ed;
  return oneShot ? { session: '', count: 0 } : { session: sessions.shortName(session), count: sessions.count(into, session) };
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
  // Its folder went (Finder, another Mac): stay in the old session and say so under the pop-up (F44)
  if (!sessions.list(root).includes(name)) return void ed.win.webContents.send('editor:move-error', sessions.shortName(name));
  ed.root = root;
  ed.session = name;
  setActive(name);
  tellEditors(root, name);
}

// Native menus under a control in the editor's header or the capture bar; `at` is the control's box in window points.
// `at` comes from a renderer: anything but four finite numbers is dropped.
const popUnder = (...[win, items, at]: Parameters<typeof desk.popup>) => {
  const { x, y, width, height } = Object(at) as Area;
  if ([x, y, width, height].every(Number.isFinite)) desk.popup(win, items, at);
};

ipcMain.on('editor:sessions-menu', (e, at: Area) => {
  const ed = editors.get(e.sender.id);
  if (!ed || ed.oneShot || ed.replace) return;
  const moveTo = (name: string) => moveEditor(ed.win, name);
  popUnder(
    ed.win,
    editorSessionMenu(menuState(), ed.session, {
      moveTo,
      older: () => void otherSession().then((name) => name && moveTo(name)),
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
  const gif = ed.recording && { copyGif: () => void copyGif(ed), saveGifAs: () => void saveGifAs(ed) };
  popUnder(ed.win, copyMenu({ copyImage: send('copy'), saveAs: send('saveAs') }, gif || undefined), at);
});

// Copy or Save ▸ Copy GIF and Save GIF As…: the recording's GIF, without marks, at the real timing.
const errText = (err: unknown) => (err instanceof Error ? err.message : String(err)).replace(/\.$/, '');
async function copyGif(ed: EditorWin) {
  const tmp = path.join(os.tmpdir(), `snapmark-${Date.now()}.gif`);
  try {
    await writeGif(tmp, sessions.gifFrames(ed.recording!));
    await desk.copyGif(fs.readFileSync(tmp));
    notify('GIF copied.');
  } catch (err) {
    notify(`Couldn't copy the GIF: ${errText(err)}. Try Save GIF As….`);
  } finally {
    fs.rmSync(tmp, { force: true });
  }
}
async function saveGifAs(ed: EditorWin) {
  const { canceled, filePath } = await desk.savePath(ed.win, {
    defaultPath: ed.oneShot ? `Snapmark ${new Date().toLocaleString('sv-SE').replace(/:/g, '.')}.gif` : `${ed.session} recording.gif`,
    filters: [{ name: 'GIF image', extensions: ['gif'] }],
  });
  if (canceled || !filePath) return;
  try {
    await writeGif(filePath, sessions.gifFrames(ed.recording!));
    notify(`Saved ${path.basename(filePath)}.`, () => shell.showItemInFolder(filePath));
  } catch (err) {
    notify(`Couldn't save ${path.basename(filePath)}: ${errText(err)}`);
  }
}

ipcMain.on('editor:beautify', (e, settings: Beautify) => {
  if (!editors.get(e.sender.id)?.oneShot) return;
  beautify = settings;
  saveState();
});

// Sent synchronously while the window unloads without a save, so the capture is kept before the window is gone.
// copied: Copy Image closed a One-Shot, which Discarded lists as "Copied One-Shot" (F40).
ipcMain.on('editor:stash', (e, state: EditState, copied: unknown) => {
  const ed = editors.get(e.sender.id);
  if (ed && fs.existsSync(ed.image)) {
    const [into, as, kept, closedByCopy] = [
      ed.root,
      ed.oneShot ? 'one-shot' : ed.session,
      JSON.stringify(state),
      !!ed.oneShot && copied === true,
    ];
    if (ed.recording) sessions.discardRecording(into, as, ed.recording, kept, closedByCopy);
    else sessions.discardCapture(into, as, ed.image, kept, closedByCopy);
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
  const { root: into, session, image, replace, oneShot, text: read, recording: rec } = editorFor(e.sender.id);
  if (oneShot) throw new Error('A one-shot screenshot is never added to a session');
  for (const v of viewers.values()) if (v.root === into && v.session === session) await flushViewer(v);
  const out = fitForAI(Buffer.from(png, 'base64'));
  // What is under a Redact mark, the owner's or auto-redact's, never reaches session.md either.
  const hidden = state.items.flatMap((i) => ((i as { t?: string }).t === 'redact' ? [(i as { r: Box }).r] : []));
  const lines = await read;
  const text = { caption, notes, cards, moves, text: lines ? ocrText(lines, hidden) : '' };
  // Cut from the flattened image, so Redact marks and auto-redact reach every part (F9).
  const parts = cutParts(out);
  // A recording: the filmstrip, its GIF and its frames, where every marked frame is kept sharp as a key frame (F74)
  const marked = state.items.flatMap((i) => (typeof (i as { f?: unknown }).f === 'number' ? [(i as { f: number }).f] : []));
  // shortcut: encoded here, in the main process, one frame after another: seconds for 30 s of changing Retina frames.
  // Move it to the recorder page or a worker if Add to Session ever feels stuck.
  const jpeg = (f: string) => nativeImage.createFromPath(f).toJPEG(85);
  // Edit Again on an entry removed in the meantime adds it back as a new one.
  const n = rec
    ? await sessions.addRecording(into, session, out, text, parts, rec, state, { replace, keep: [...(rec.keys ?? []), ...marked], jpeg })
    : replace && sessions.replaceShot(into, session, replace, out, text, parts)
      ? replace
      : sessions.addShot(into, session, out, text, parts);
  if (!rec) sessions.saveEdit(into, session, n, fs.readFileSync(image), JSON.stringify(state));
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
      ed.win.setTitle(editorTitle(name));
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
  // The GIF as macOS's own GIF type, which Electron passes as a raw pasteboard format
  copyGif: (gif: Buffer) =>
    clipboard.write([
      new ClipboardItem({ 'electron application/osclipboard;format="com.compuserve.gif"': new Blob([new Uint8Array(gif)]) }),
    ]),
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
  // Record's picture of a display: its desktopCapturer source, which recorder.html plays. The smoke test's is 'test'.
  screenSource: async (display: number): Promise<string> => {
    const all = await desktopCapturer.getSources({ types: ['screen'], thumbnailSize: { width: 0, height: 0 } });
    const s = all.find((x) => x.display_id === String(display)) ?? (all.length === 1 ? all[0] : undefined);
    if (!s) throw new Error('macOS gave no picture of that display');
    return s.id;
  },
};

// Copy Image and Save As…: in session mode the image exactly as Add to session would save it, without adding it to the
// session; in one-shot mode the beautified image at full (Retina) resolution, for people rather than an AI.
const outImage = (ed: EditorWin, png: string) => (ed.oneShot ? Buffer.from(png, 'base64') : fitForAI(Buffer.from(png, 'base64')));

ipcMain.handle('editor:copy', async (e, png: string) => {
  const ed = editorFor(e.sender.id);
  await desk.copyImage(outImage(ed, png));
  notify(ed.recording ? 'Filmstrip copied.' : ed.oneShot ? 'Image copied.' : 'Marked-up image copied. It is not in the session.');
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
    ...openingBounds(viewerSize),
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
  const keepSize = () => {
    const [w, h] = win.getSize();
    viewerSize = { width: w, height: h };
    saveState();
  };
  win.on('resized', keepSize);
  win.on('close', keepSize); // Zoom and window tiling may not send 'resized'
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
  const shots = sessions.entries(v.known).map((e) => {
    const facts = sessions.recordingFacts(v.root, v.session, e.n);
    const gif = !!facts && fs.existsSync(sessions.recordingFiles(v.root, v.session, e.n).gif);
    return { ...e, editable: fs.existsSync(sessions.editFiles(v.root, v.session, e.n).json), ...(facts && { recording: { facts, gif } }) };
  });
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
  const state = JSON.parse(fs.readFileSync(f.json, 'utf8')) as EditState;
  // A recording reopens on its frames, their times and its marks (F75)
  const rec = sessions.editedRecording(v.root, v.session, n);
  if (rec) {
    let copy: Recording;
    try {
      copy = tempRecording(rec);
    } catch (err) {
      return notify(`Couldn't open recording ${n} again: ${errText(err)}`);
    }
    return void openRecording(copy, { session: v.session, state, replace: n });
  }
  openEditor(tempCopy(f.png), { session: v.session, state, replace: n });
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
  if (d.recording) {
    // The recording editor, on a copy of its frames, with the marks it was closed with
    const kept = path.join(d.dir, 'state.json');
    const state = fs.existsSync(kept) ? (JSON.parse(fs.readFileSync(kept, 'utf8')) as EditState) : undefined;
    const session = sessions.list(into).includes(d.session) ? d.session : undefined;
    openRecording(tempRecording(sessions.discardedRecording(d)), { session, state, oneShot: d.session === 'one-shot' });
    fs.rmSync(d.dir, { recursive: true, force: true });
    return;
  }
  if (d.kind === 'shot') {
    const what = fs.existsSync(path.join(d.dir, 'image.gif')) ? 'Recording' : 'Screenshot'; // a removed recording keeps its GIF
    const n = sessions.restoreShot(into, d);
    notify(`${what} ${n} is back in ${sessions.shortName(d.session)}.`);
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
// A click on the menu bar icon: the menu, or during a countdown, cancel (F31). Exported for the smoke test, which has no icon.
// While recording a click is Done, and shows no menu (F66).
export const iconClick = () => (stopRecording ? stopRecording(true) : cancelCountdown ? cancelCountdown() : popMenu());

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

// Resolves to the session made current, or null.
async function otherSession(): Promise<string | null> {
  focusApp();
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: 'Choose a session',
    message: 'Session folders start with their date.',
    defaultPath: root,
    properties: ['openDirectory'],
  });
  const dir = filePaths[0];
  if (canceled || !dir) return null;
  if (path.dirname(dir) !== path.resolve(root) || !fs.existsSync(path.join(dir, 'session.md'))) {
    notify(`That folder is not a session in ${tilde(root)}.`);
    return null;
  }
  setActive(path.basename(dir));
  return path.basename(dir);
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
  // Recording frames a crash or a forced quit left behind; an open editor's are deleted when it closes
  const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
  for (const f of fs.readdirSync(os.tmpdir()).filter((f) => f.startsWith('snapmark-rec-'))) {
    const dir = path.join(os.tmpdir(), f);
    try {
      if (fs.statSync(dir).mtimeMs < dayAgo) fs.rmSync(dir, { recursive: true, force: true });
    } catch {
      // gone already, or not ours to delete
    }
  }
  // "Template" in the file name makes macOS tint the icon for light and dark menu bars; @2x is picked up automatically.
  tray = new Tray(path.join(__dirname, '../../assets/trayTemplate.png'));
  tray.setToolTip('Snapmark');
  tray.on('click', iconClick);
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
  // A recording that runs goes to Discarded, as ⓧ does, once its last frames are written; then the quit goes on
  if (stopRecording) return void (e.preventDefault(), stopRecording(false).finally(() => app.quit()));
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
