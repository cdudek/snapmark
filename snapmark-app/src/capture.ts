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
];

// The bar's headline and hint for each mode (spec screens.md, Headline and hint per mode).
// shortcut: Capture Scrolling always gives the manual hint, true until auto-scroll lands in milestone 4, which picks
// the hint by the Accessibility permission.
export const barHeads = (area: Area | null): Record<CaptureMode, [headline: string, hint: string]> => ({
  area: ['Capture New Area', 'Drag to choose the area'],
  window: ['Capture Window', 'Click a window after Capture'],
  full: ['Capture Full Screen', 'Every display, one screenshot each'],
  last: ['Capture Last Area', area ? `${area.width} × ${area.height}` : 'No area yet: drag one after Capture'],
  scroll: ['Capture Scrolling', 'Scroll the area yourself, then Done'],
});

// The bar's width on a display's work area: 960 pt, or narrower under 1000 pt, where the hint wraps under the headline
// and the destination shrinks, so no control hides (F27). At about 150 % (`zoom`, the page's zoom factor; the View
// menu's ⌘+ steps through 1.44 and 1.58) it is narrow too, and wider by the zoom as far as the work area allows.
export const barSize = (workWidth: number, zoom = 1) => ({
  width: Math.min(Math.round(960 * zoom), workWidth - 48),
  narrow: workWidth < 1000 || zoom >= 1.4,
});

// The first time the bar opens (F207).
export const FIRST: CaptureOpts = { mode: 'area', oneShot: false, timer: 0, pointer: false };

// Capture options as they arrive from a renderer or state.json: each field kept only if valid, else `was`'s (M2-3).
export function checkedCapture(c: Partial<Record<keyof CaptureOpts, unknown>> | undefined, was = FIRST): CaptureOpts {
  const bool = (v: unknown, or: boolean) => (typeof v === 'boolean' ? v : or);
  return {
    mode: MODES.find((m) => m.id === c?.mode)?.id ?? was.mode,
    oneShot: bool(c?.oneShot, was.oneShot),
    timer: TIMERS.find(([s]) => s === c?.timer)?.[0] ?? was.timer,
    pointer: bool(c?.pointer, was.pointer),
  };
}

export const rect = (a: Area) => [a.x, a.y, a.width, a.height].map(Math.round).join(',');

// Timer and Show Mouse Pointer need the area known before `screencapture` runs: Snapmark's own picker gives it, and
// Full Screen is every display. Capture Window (`-i -w`) picks the window after the call, and Capture Scrolling grabs
// many frames (CAP-6).
export const timed = (mode: CaptureMode) => mode !== 'window' && mode !== 'scroll';

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

// The Capture button says where the capture goes, so a One-Shot left on is never hidden (CAP-5); the bar draws its ↩
// keycap beside it.
export const barLabel = (o: { oneShot: boolean }) => (o.oneShot ? 'Capture One-Shot' : 'Capture');

export interface OptionsActions {
  setTimer(seconds: number): void;
  setPointer(on: boolean): void;
}

const TIMERS: [number, string][] = [
  [0, 'None'],
  [3, '3 Seconds'],
  [5, '5 Seconds'],
  [10, '10 Seconds'],
];

// The Options button's native menu: how to capture. Where the capture goes is the bar's Session | One-Shot, so Save to
// is gone (F26). An option the mode cannot use is greyed, never hidden, and keeps its name (CAP-6).
export function barOptions(st: CaptureOpts, a: OptionsActions): Item[] {
  const on = timed(st.mode);
  return [
    { label: 'Timer', type: 'header' },
    ...TIMERS.map(([s, label]): Item => ({ label, type: 'radio', checked: st.timer === s, enabled: on, click: () => a.setTimer(s) })),
    { type: 'separator' },
    {
      label: 'Show Mouse Pointer',
      type: 'checkbox',
      checked: st.pointer,
      enabled: on,
      ...(on ? {} : { sublabel: `Not for ${MODES.find((m) => m.id === st.mode)!.name}` }),
      click: (item) => a.setPointer(item.checked),
    },
  ];
}
