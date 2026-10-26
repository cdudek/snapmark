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

const esc = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;');

// The Keyboard Shortcuts window: the tools in the keys of the current mode (Settings ▸ Single-Key Tools), a line
// naming the setting, then KEY_GROUPS. Built from the toolbar's own tool list, so the two never disagree. No script,
// so the page needs no CSP exception.
export function shortcutsHtml(groups: ToolGroup[], singleKeys: boolean): string {
  const row = (keys: string, icon: string, name: string, what: string) =>
    `<tr><td><kbd>${keys}</kbd></td><td>${icon && `<svg viewBox="0 0 24 24" aria-hidden="true">${icon}</svg>`}</td><td><b>${esc(name)}</b></td><td>${esc(what)}</td></tr>`;
  // On: "C or Esc", "1 or ⌘1", "1 again". Off: "Esc", "⌘1", "⌘1 again".
  const first = (g: ToolGroup) => (g.key === 'c' ? (singleKeys ? 'C or Esc' : 'Esc') : singleKeys ? `${g.key} or ⌘${g.key}` : `⌘${g.key}`);
  const tools = groups
    .flatMap((g) =>
      g.tools.map((t, v) => row(v ? `${singleKeys ? g.key : `⌘${g.key}`} again` : first(g), t.icon, t.label, t.tip ?? t.means ?? '')),
    )
    .join('');
  const setting = singleKeys
    ? 'Settings ▸ Single-Key Tools is on: C and 1–7 pick tools too.'
    : 'Settings ▸ Single-Key Tools is off: only ⌘1–⌘7 pick tools, and Esc goes back to Select.';
  // The other keys, grouped by where they work (owner, 2026-10-25).
  const other = KEY_GROUPS.map(
    (g) => `<h2>${esc(g.title)}</h2><table>${g.rows.map(([k, n, w]) => row(k, '', n, w)).join('')}</table>`,
  ).join('');
  return `<!doctype html><html lang="en"><meta charset="utf-8"><title>Keyboard shortcuts</title><style>
    :root{color-scheme:light dark;font:13px -apple-system,system-ui,sans-serif}body{margin:16px}
    h2{font-size:13px;margin:16px 0 6px}table{border-collapse:collapse;width:100%}td{padding:4px 6px;vertical-align:middle}
    kbd{font:600 11px ui-monospace,monospace;white-space:nowrap}p{margin:8px 6px 0;color:GrayText}
    svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
    </style><h2>Editor tools</h2><table>${tools}</table><p>${esc(setting)}</p>${other}`;
}
