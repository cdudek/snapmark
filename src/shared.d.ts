// IPC contract between preload.ts (exposes it) and editor.ts (calls it).
interface EditorInit {
  src: string; // data: URL of the captured PNG
  session: string;
  count: number; // screenshots already in the session
  state?: EditState; // marks and text to put back: a reopened discard, or Edit Again
  replacing?: number; // Edit Again: saving replaces this entry instead of adding one
  oneShot?: boolean; // one-shot mode: Beautify, then copy or save; no session
  beautify?: Beautify; // one-shot: the settings to start from (the reopened discard's, else the last used)
  singleKeys: boolean; // Settings ▸ Single-Key Tools; off, a plain letter or digit picks no tool and ⌘1–⌘7 still do
  color?: string; // the annotation colour last picked in any editor, also before a restart
  customColors: string[]; // the colour panel's Custom row, newest first, kept in state.json
}

// Everything on a screenshot except the screenshot, as plain data (editor.ts writes and reads the items).
interface EditState {
  caption: string;
  items: unknown[];
  beautify?: Beautify; // only in one-shot mode, so a discarded one-shot reopens as one
  redacted?: boolean; // auto-redact ran on it, so Edit Again does not add back marks the owner deleted
}

interface EditorSave {
  png: string; // base64, no data: prefix
  caption: string;
  notes: string[]; // reference notes, in reference order
  cards: string[]; // text of the cards placed on the image
  moves: number; // cut-and-move pieces
  state: EditState; // kept beside the entry for Edit Again
}

// The session window (viewer.html): session.md rendered and editable, its screenshots, and what was discarded from it.
interface ViewerInit {
  session: string; // folder name
  label: string; // display name: "2026-10-24, 23:38" or "2026-10-24 · Ledgerly Q4 review"
  name: string; // what the rename field starts with: the owner's name for it, empty for a bare date stamp
  stamped: boolean; // the folder starts with its date stamp, which a rename keeps
  base: string; // file:// URL of the session folder, ending in "/", so img/NNN.png resolves
  md: string;
  shots: ViewerShot[]; // the entries in session.md, in order
  discarded: ViewerDiscarded[]; // this session's, newest first
}

interface ViewerShot {
  n: number;
  heading: string; // "001 · 23:38"
  notes: number;
  editable: boolean; // its marks were kept, so Edit Again can reopen it
}

interface ViewerDiscarded {
  dir: string; // identifies it for Reopen
  src: string; // file:// URL of its image
  kind: 'capture' | 'shot'; // closed without saving, or removed from the session
  when: string; // "Today, 22:10"
}

// A part of the screen in points, as `screencapture -R` takes it: global coordinates for Capture Last Area, window
// coordinates when the area picker (area.html) sends it.
interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Capture Scrolling's control (scroll.html), after each frame: what the stitched image holds and what the frame did.
interface ScrollStatus {
  frames: number;
  height: number; // pixels
  step: import('./stitch').Step;
}

// The capture bar (bar.html, ⌃⇧5): what it captures, where it goes and how. Kept in state.json under `capture`.
type CaptureMode = 'window' | 'area' | 'last' | 'scroll';
interface CaptureOpts {
  mode: CaptureMode;
  oneShot: boolean; // Save to: One-Shot, else Current Session
  timer: number; // seconds after the area is known: 0, 5 or 10
  pointer: boolean; // Show Mouse Pointer (areas only)
}

interface BarInit extends CaptureOpts {
  label: string; // the Capture button: "Capture" or "Capture One-Shot"
  last: string; // Capture Last Area's suffix: "1280 × 720" or "First time: drag the area"
}

// The Settings window (settings.html): what its three tabs show.
interface SettingsInit {
  login: { enabled: boolean; checked: boolean; needsApproval: boolean }; // menu.ts loginState
  root: string; // sessions folder, ~-shortened
  canChangeRoot: boolean; // false while SNAPMARK_ROOT sets it
  version: string;
  canUpdate: boolean; // false in a development build
  singleKeys: boolean;
  keys: { cap: string; name: string; taken: boolean }[]; // the four global keys; taken: another app has it
  capture: CaptureOpts; // the capture bar's options
}
type SettingsKey = 'login' | 'singleKeys' | 'oneShot' | 'timer' | 'pointer';
type SettingsRun = 'chooseRoot' | 'clearOld' | 'checkUpdates' | 'loginItems' | 'shortcuts';

// The Keyboard Shortcuts window (shortcuts.html): keys.ts KEY_GROUPS; the tools come from tools.js on the page.
interface ShortcutsInit {
  groups: { title: string; rows: [keys: string, name: string, what: string][] }[];
  singleKeys: boolean; // the tool keys of the current mode
}

interface Window {
  snapmark: {
    shortcutsInit(): Promise<ShortcutsInit>;
    settingsInit(): Promise<SettingsInit>;
    settingsSet(key: SettingsKey, value: boolean | number): Promise<SettingsInit>;
    settingsRun(what: SettingsRun): Promise<SettingsInit>; // resolves once it is done (a dialog closed)
    barInit(): Promise<BarInit>;
    barCapture(mode: CaptureMode): void; // closes the bar, then runs the mode
    barOptions(mode: CaptureMode, at: Area): void; // the Options menu under `at` (window points), for the chosen mode
    barClose(): void;
    onBarState(cb: (s: BarInit) => void): void; // an option changed in the Options menu or in Settings
    areaDone(area: Area | null): void; // the area picker: the dragged area, or null for Esc
    scrollDone(ok: boolean): void; // Capture Scrolling: Done (true) or Cancel (false)
    onScrollStatus(cb: (status: ScrollStatus) => void): void;
    init(): Promise<EditorInit>;
    save(data: EditorSave): Promise<number>;
    copyImage(png: string): Promise<void>; // base64 PNG to the clipboard, not into the session
    saveImageAs(png: string): Promise<string | null>; // base64 PNG to a file the owner picks; null when cancelled
    beautify(settings: Beautify): void; // one-shot: remember the settings as the one preset
    secrets(): Promise<{ x: number; y: number; w: number; h: number }[] | null>; // auto-redact's areas; null: no text recognition
    dirty(value: boolean): void; // the editor has marks or text that are not saved yet
    stash(state: EditState): void; // the window closes without saving: keep it in Discarded (synchronous)
    onSession(cb: (session: string, count: number) => void): void; // the editor's session was renamed or its count changed
    onSingleKeys(cb: (on: boolean) => void): void; // Settings ▸ Single-Key Tools changed while the editor is open
    color(c: string): void; // the owner picked an annotation colour: the next editor starts with it
    customColors(list: string[]): void; // the Custom row changed: up to five #rrggbb, newest first
    sessionsMenu(at: Area): void; // the session label's menu, under `at` (window points)
    shareMenu(at: Area): void; // the Copy or Save menu, under `at`
    onShare(cb: (what: 'copy' | 'saveAs') => void): void; // picked in the Copy or Save menu
    viewerInit(): Promise<ViewerInit>;
    viewerSave(from: string, md: string): Promise<boolean>; // refused when session.md is no longer `from`
    viewerExternal(): void; // open session.md in the default Markdown app
    viewerRemove(n: number): Promise<{ data: ViewerInit; dir: string | null }>; // dir: its Discarded folder, for ⌘Z
    viewerEdit(n: number): void; // Edit Again: open entry n in the editor with its marks
    viewerRename(name: string): Promise<string | null>; // null when renamed (or unchanged), else why not
    viewerReopen(dir: string): Promise<ViewerInit>; // a discarded screenshot: back into the session, or into an editor
    onViewerReload(cb: (data: ViewerInit) => void): void; // session.md changed outside this window
  };
}

// Fabric's UMD build, loaded by editor.html before editor.js.
declare const fabric: typeof import('fabric');

// md-notes.ts, bundled by esbuild and loaded by editor.html before editor.js.
declare const MdNotes: typeof import('./md-notes');
