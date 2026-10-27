// Snapmark's keys as data: the global shortcuts and the Keyboard Shortcuts window's rows (src/shortcuts.html), so the
// two never disagree.
// No Electron at runtime, so test/keys.test.ts checks it in plain Node.

// macOS's own screenshot digits with ⌃⇧ for ⇧⌘, which macOS keeps for itself (ADR 2026-10-25, keys follow macOS).
export const SHORTCUTS = {
  newArea: 'Control+Shift+1', // drag an area, capture it and keep it for ⌃⇧4
  oneShot: 'Control+Shift+2', // macOS's overlay, into a one-shot editor
  fullScreen: 'Control+Shift+3', // ⇧⌘3: every display at once
  capture: 'Control+Shift+4', // Capture Last Area: the kept area at once
  options: 'Control+Shift+5', // ⇧⌘5: the capture options
  newSession: 'Control+Shift+N',
} as const;

export type KeyRow = [keys: string, name: string, what: string];

export const KEY_GROUPS: { title: string; rows: KeyRow[] }[] = [
  {
    title: 'Anywhere',
    rows: [
      ['⌃⇧4', 'Capture Last Area', 'the first time, or after New Session, drag the area'],
      ['⌃⇧1', 'Capture New Area', 'drag an area, capture it, and keep it for ⌃⇧4'],
      ['⌃⇧3', 'Capture Full Screen', 'every display at once, one screenshot each'],
      ['⌃⇧2', 'Capture One-Shot', 'drag an area; not added to a session'],
      ['⌃⇧5', 'Capture Options', 'the capture bar; while recording, Done'],
      ['⌃⇧N', 'New Session', 'also forgets the area'],
      ['↩ / Esc', 'Done / Cancel', 'while Capture Scrolling runs'],
    ],
  },
  {
    title: 'Capture bar',
    rows: [
      ['1–6', 'Pick a mode', 'new area, window, full screen, last area, scrolling, record'],
      ['← →', 'Move between modes', 'Tab moves on to Options, Capture and Session or One-Shot'],
      ['↩ / ⌘↩', 'Capture', ''],
      ['⇧⌘O', 'Session or One-Shot', 'where the capture goes'],
      ['⇧⌘P', 'Switch Session', 'pick the current session'],
      ['⌥O', 'Options', 'Frame Rate, Timer and Show Mouse Pointer'],
      ['Esc', 'Close', 'also from another app while the bar is open'],
    ],
  },
  {
    title: 'Snapmark windows',
    rows: [
      ['⌘,', 'Settings', ''],
      ['⌘/', 'Keyboard Shortcuts', ''],
    ],
  },
  {
    title: 'Editor',
    rows: [
      ['Esc', 'Step back', 'out of the text, then deselect, then back to Select, then close'],
      ['⌫', 'Delete', 'the selected marks'],
      ['← ↑ → ↓', 'Nudge', 'the selected marks by 1 point; with ⇧, by 10'],
      ['⌘A', 'Select all', 'every mark except redactions, to move or delete them together'],
      ['⌘1–⌘7', 'Pick a tool', 'also while typing a note or card, where the plain digit types'],
      ['⌘Z', 'Undo', 'in a note, its typing first, then the marks'],
      ['⇧⌘Z', 'Redo', ''],
      ['⌘S / ⌘↩', 'Add to Session', 'in One-Shot, ⌘S is Save As… and ⌘↩ is Copy Image'],
      [
        '⌘C / ⇧⌘C',
        'Copy Image',
        'the marked-up image, without adding it to the session; in a note only ⇧⌘C; in One-Shot, at full resolution, and the editor closes',
      ],
      ['⇧⌘S', 'Save As…', 'the marked-up image as a PNG wherever you pick, without adding it to the session'],
      ['⇧⌘O', 'Session or One-Shot', 'where this screenshot goes; marks and notes stay'],
      ['⇧⌘P', 'Switch Session', 'move this screenshot to another session'],
      ['⇧⌘F', 'Show All Frames', 'in a recording, every frame or only the key frames'],
      ['⌘W', 'Discard', 'the screenshot; Reopen Last Discarded in the menu brings it back'],
    ],
  },
  {
    title: 'Session window',
    rows: [
      ['← →', 'Flip screenshots', 'one at a time; Esc goes back to the grid'],
      ['↩', 'Rename session', 'when no button or field has focus'],
      ['⌘⌫', 'Remove from Session', 'the screenshot shown large; ⌘Z puts it back, and the Discarded tab keeps it 7 days'],
      ['⌘O', 'Edit Again', 'the screenshot shown large, with its marks'],
      ['⌘Z', 'Undo', 'puts back the screenshot last removed'],
    ],
  },
];
