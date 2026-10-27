// The capture bar as data: its modes, the `screencapture` arguments and the Options menu. No Electron at runtime, so
// test/capture.test.ts checks it in plain Node, like menu.ts and keys.ts.
import type { MenuItemConstructorOptions as Item } from 'electron';

// Left to right in the bar, after Close; the digit is the place (spec screens.md, Controls). The digits match the global
// keys where they share a meaning: 1 New Area (⌃⇧1), 3 Full Screen (⌃⇧3), 4 Last Area (⌃⇧4).
export const MODES: { id: CaptureMode; name: string }[] = [
  { id: 'area', name: 'New Area' },
  { id: 'window', name: 'Window' },
  { id: 'full', name: 'Full Screen' },
  { id: 'last', name: 'Last Area' },
  { id: 'scroll', name: 'Scrolling' },
  { id: 'record', name: 'Record' },
];

// Record's Options ▸ Frame Rate, 10 by default (ADR 2026-10-26, recording key frames); a recording lasts 30 s at most.
export const FPS = [15, 10, 5, 4, 2];
export const REC_CAP_MS = 30_000;

// The recording control's clock (spec screens.md, Recording control): "0:07", and its status "0:07 of 0:30 · 10 fps".
export const clock = (ms: number) => {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};
export const recordStatus = (ms: number, fps: number) => `${clock(ms)} of ${clock(REC_CAP_MS)} · ${fps} fps`;

// Where the recording control goes, so it is never in a frame (F68): 16 pt below the area, centred on it; else above
// it; else at the display's bottom edge beside the area; else inside the area's bottom edge (a full-display area).
// `wa` is the area's display's work area; all in global points.
export function panelAt(a: Area, wa: Area, width: number, height: number, gap = 16): Area {
  const clamp = (x: number) => Math.round(Math.max(wa.x, Math.min(x, wa.x + wa.width - width)));
  const at = (x: number, y: number) => ({ x: clamp(x), y: Math.round(y), width, height });
  const centred = a.x + (a.width - width) / 2;
  if (a.y + a.height + gap + height <= wa.y + wa.height) return at(centred, a.y + a.height + gap);
  if (a.y - gap - height >= wa.y) return at(centred, a.y - gap - height);
  const edge = wa.y + wa.height - gap - height;
  if (a.x + a.width + gap + width <= wa.x + wa.width) return at(a.x + a.width + gap, edge);
  if (a.x - gap - width >= wa.x) return at(a.x - gap - width, edge);
  return at(centred, a.y + a.height - gap - height);
}

// The one-row bar's width on a display's work area: 1080 pt at 100 % with six modes, as the mock, wider by the page's zoom (`zoom`; the View menu's
// ⌘+ steps through 1.2, 1.44, …) as far as the work area allows. Where it does not fit, the bar is narrow: the modes
// show their icons only (names in their tooltips), so no control clips (F14).
export const barSize = (workWidth: number, zoom = 1) => {
  const want = Math.round(1080 * zoom);
  return { width: Math.min(want, workWidth - 48), narrow: want > workWidth - 48 };
};

// The first time the bar opens (F207).
export const FIRST: CaptureOpts = { mode: 'area', oneShot: false, timer: 0, pointer: false, fps: 10 };

// Capture options as they arrive from a renderer or state.json: each field kept only if valid, else `was`'s (M2-3).
export function checkedCapture(c: Partial<Record<keyof CaptureOpts, unknown>> | undefined, was = FIRST): CaptureOpts {
  const bool = (v: unknown, or: boolean) => (typeof v === 'boolean' ? v : or);
  return {
    mode: MODES.find((m) => m.id === c?.mode)?.id ?? was.mode,
    oneShot: bool(c?.oneShot, was.oneShot),
    timer: TIMERS.find(([s]) => s === c?.timer)?.[0] ?? was.timer,
    pointer: bool(c?.pointer, was.pointer),
    fps: FPS.find((f) => f === c?.fps) ?? was.fps,
  };
}

export const rect = (a: Area) => [a.x, a.y, a.width, a.height].map(Math.round).join(',');

// Timer and Show Mouse Pointer need the area known before `screencapture` runs: Snapmark's own picker gives it, and
// Full Screen is every display. Capture Window (`-i -w`) picks the window after the call, and Capture Scrolling grabs
// many frames (CAP-6). Record's countdown is the Timer's when longer than 3; its frames come from macOS's screen
// capture, which draws the pointer as it is, so Show Mouse Pointer is not Record's (questions.md).
export const timed = (mode: CaptureMode) => mode !== 'window' && mode !== 'scroll';
const pointed = (mode: CaptureMode) => timed(mode) && mode !== 'record';

// `screencapture` arguments for a mode, before `-x <file>`. -C draws the pointer only in non-interactive captures
// (man screencapture), so only with -R or the full screen. Capture Scrolling runs the picker and its own loop: no
// arguments.
export function captureArgs(mode: CaptureMode, { pointer }: { pointer: boolean }, area?: Area | null): string[] {
  if (mode === 'window') return ['-i', '-w', '-o']; // -w: a click takes a window; -o: without its shadow
  if (mode === 'scroll') return [];
  if (mode === 'full') return pointer ? ['-C'] : []; // every display, one file each (shotFiles)
  if (!area) throw new Error(`${mode} needs the area`);
  return [...(pointer ? ['-C'] : []), '-R', rect(area)];
}

// Where `screencapture` writes, after `-x`: one file, or one per display for ⌃⇧3, which it fills in display order
// (man screencapture), as macOS's ⇧⌘3 makes one screenshot per display.
export const shotFiles = (base: string, displays = 1) =>
  displays > 1 ? Array.from({ length: displays }, (_, i) => `${base}-${i + 1}.png`) : [`${base}.png`];

// The Capture button follows the mode (spec screens.md: Capture, Record, Start Scrolling) and says where the capture
// goes, so a One-Shot left on is never hidden (CAP-5); the bar draws its ↩ keycap beside it.
const VERBS: Partial<Record<CaptureMode, string>> = { scroll: 'Start Scrolling', record: 'Record' };
export const barLabel = (o: { mode: CaptureMode; oneShot: boolean }) => (o.oneShot ? 'Capture One-Shot' : (VERBS[o.mode] ?? 'Capture'));

// The bar's focus ring (F10, N1): macOS's accent colour (systemPreferences.getAccentColor, "rrggbbaa") where it reaches
// 3:1 on the bar's material, else null and the bar rings in its text colour. Chromium draws -webkit-focus-ring-color
// as its own fixed orange #e59700 unless the embedder sets one, and Electron does not. The material is measured on
// the greys the screenshots flatten it onto.
export function barRing(accent: string | undefined, dark: boolean): string | null {
  if (!accent || !/^[0-9a-f]{6}/i.test(accent)) return null;
  const ring = `#${accent.slice(0, 6).toLowerCase()}`;
  return contrast(ring, dark ? '#1c1c1e' : '#e5e5ea') >= 3 ? ring : null;
}

// WCAG 2.2's contrast ratio of two #rrggbb colours
export function contrast(a: string, b: string): number {
  const lum = (hex: string) =>
    [1, 3, 5]
      .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
      .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
      .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

export interface OptionsActions {
  setFps(fps: number): void;
  setTimer(seconds: number): void;
  setPointer(on: boolean): void;
}

const TIMERS: [number, string][] = [
  [0, 'None'],
  [3, '3 Seconds'],
  [5, '5 Seconds'],
  [10, '10 Seconds'],
];

// The Options button's native menu: how to capture. Where the capture goes is the bar's destination pop-up, so Save to
// is gone (F26). An option the mode cannot use is greyed, never hidden, and keeps its name (CAP-6); Frame Rate is
// Record's only (F60).
export function barOptions(st: CaptureOpts, a: OptionsActions): Item[] {
  const on = timed(st.mode);
  const rec = st.mode === 'record';
  return [
    { label: 'Frame Rate', type: 'header' },
    ...FPS.map((f): Item => ({ label: `${f} fps`, type: 'radio', checked: st.fps === f, enabled: rec, click: () => a.setFps(f) })),
    { type: 'separator' },
    { label: 'Timer', type: 'header' },
    ...TIMERS.map(([s, label]): Item => ({ label, type: 'radio', checked: st.timer === s, enabled: on, click: () => a.setTimer(s) })),
    { type: 'separator' },
    {
      label: 'Show Mouse Pointer',
      type: 'checkbox',
      checked: st.pointer,
      enabled: pointed(st.mode),
      ...(pointed(st.mode) ? {} : { sublabel: `Not for ${MODES.find((m) => m.id === st.mode)!.name}` }),
      click: (item) => a.setPointer(item.checked),
    },
  ];
}

// The destination pop-up: One-Shot first, checked while chosen, then the session rows the editor's pop-up has
// (menu.ts editorSessionMenu) (F12). ⇧⌘O is shown, not registered: the bar page takes it.
export const destMenu = (oneShot: boolean, sessions: Item[], setOneShot: (on: boolean) => void): Item[] => [
  {
    label: 'One-Shot',
    type: 'checkbox',
    checked: oneShot,
    accelerator: 'Shift+Command+O',
    registerAccelerator: false,
    click: () => setOneShot(true),
  },
  { type: 'separator' },
  ...sessions,
];
