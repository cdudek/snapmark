// Snapmark's keys as data: the global shortcuts and the Keyboard Shortcuts window's rows, so the two never disagree.
// No Electron at runtime, so test/keys.test.ts checks it in plain Node.

// macOS's own screenshot digits with ⌃⇧ for ⇧⌘, which macOS keeps for itself (ADR 2026-10-25, keys follow macOS).
export const SHORTCUTS = {
  capture: 'Control+Shift+4', // ⇧⌘4: drag an area
  area: 'Control+Shift+3', // ⇧⌘3: no dragging
  options: 'Control+Shift+5', // ⇧⌘5: the capture options
  newSession: 'Control+Shift+N',
} as const;

export type KeyRow = [keys: string, name: string, what: string];

export const KEY_GROUPS: { title: string; rows: KeyRow[] }[] = [
  {
    title: 'Anywhere',
    rows: [
      ['⌃⇧4', 'Capture screenshot', 'drag an area, or press Space and click a window'],
      ['⌃⇧3', 'Capture last area', 'the first time, drag the area'],
      ['⌃⇧5', 'Capture options', 'a menu under the menu bar icon: Choose New Area, Capture Window, Capture Scrolling, One-Shot Capture'],
      ['⌃⇧N', 'New session', ''],
      ['↩ / Esc', 'Capture Scrolling', 'Done or cancel, while it grabs the area you scroll (menu: Capture Options)'],
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
      ['⌘S / ⌘↵', 'Add to session', 'in one-shot, ⌘S is Save As… and ⌘↵ is Copy Image'],
      [
        '⌘C / ⇧⌘C',
        'Copy Image',
        'the marked-up image, without adding it to the session; in a note only ⇧⌘C; in one-shot, at full resolution',
      ],
      ['⇧⌘S', 'Save As…', 'the marked-up image as a PNG wherever you pick, without adding it to the session'],
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
