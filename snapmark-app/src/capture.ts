// The capture bar as data: its modes, the `screencapture` arguments and the Options menu. No Electron at runtime, so
// test/capture.test.ts checks it in plain Node, like menu.ts and keys.ts.
import type { MenuItemConstructorOptions as Item } from 'electron';

// Left to right in the bar, after Close (spec/capture-and-settings.md, Controls).
export const MODES: { id: CaptureMode; name: string }[] = [
  { id: 'window', name: 'Capture Window' },
  { id: 'area', name: 'Choose New Area' },
  { id: 'last', name: 'Capture Last Area' },
  { id: 'scroll', name: 'Capture Scrolling' },
];

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

// Timer and Show Mouse Pointer need the area known before `screencapture` runs: Snapmark's own picker gives it.
// Capture Window (`-i -w`) picks the window after the call, and Capture Scrolling grabs many frames.
export const appliesToArea = (mode: CaptureMode) => mode === 'area' || mode === 'last';

// `screencapture` arguments for a mode, before `-x <file>`. -C draws the pointer only in non-interactive captures
// (man screencapture), so only with -R. Capture Scrolling runs the picker and its own loop: no arguments.
export function captureArgs(mode: CaptureMode, { pointer }: { pointer: boolean }, area?: Area | null): string[] {
  if (mode === 'window') return ['-i', '-w', '-o']; // -w: a click takes a window; -o: without its shadow
  if (mode === 'scroll') return [];
  if (!area) throw new Error(`${mode} needs the area`);
  return [...(pointer ? ['-C'] : []), '-R', rect(area)];
}

// The Capture button says where the capture goes, so a One-Shot left on is never hidden (Decision 3).
export const barLabel = (o: { oneShot: boolean }) => (o.oneShot ? 'Capture One-Shot' : 'Capture');

export interface OptionsState extends CaptureOpts {
  session: string | null; // the current session's label; null: the first capture starts one
  newSession: string | null; // ⌃⇧N's accelerator; null while another app has it
}

export interface OptionsActions {
  setOneShot(on: boolean): void;
  setTimer(seconds: number): void;
  setPointer(on: boolean): void;
  newSession(): void;
}

const TIMERS: [number, string][] = [
  [0, 'None'],
  [5, '5 Seconds'],
  [10, '10 Seconds'],
];

// The Options button's native menu: where the capture goes, then how (spec, Options menu). New Session is an action,
// as ⌃⇧N; the bar stays open.
export function barOptions(st: OptionsState, a: OptionsActions): Item[] {
  const areas = appliesToArea(st.mode);
  return [
    { label: 'Save to', type: 'header' },
    {
      label: 'Current Session',
      sublabel: st.session ?? 'A new session starts',
      type: 'radio',
      checked: !st.oneShot,
      click: () => a.setOneShot(false),
    },
    { label: 'One-Shot', sublabel: 'Beautify, then copy or save', type: 'radio', checked: st.oneShot, click: () => a.setOneShot(true) },
    {
      label: 'New Session',
      ...(st.newSession ? { accelerator: st.newSession, registerAccelerator: false } : {}),
      click: () => a.newSession(),
    },
    { type: 'separator' },
    { label: areas ? 'Timer' : 'Timer (areas only)', type: 'header' },
    ...TIMERS.map(([s, label]): Item => ({ label, type: 'radio', checked: st.timer === s, enabled: areas, click: () => a.setTimer(s) })),
    { type: 'separator' },
    { label: 'Options', type: 'header' },
    {
      label: 'Show Mouse Pointer',
      type: 'checkbox',
      checked: st.pointer,
      enabled: areas,
      ...(areas ? {} : { sublabel: 'Areas only' }),
      click: (item) => a.setPointer(item.checked),
    },
  ];
}
