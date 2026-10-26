// The editor's tools, in toolbar order: one list for the toolbar, the shortcuts window and the copied prompt.
// Classic script (no import/export): editor.html and shortcuts.html load it before their own scripts, and main.ts
// require()s it through the module.exports line at the end.
type ToolId =
  'select' | 'marker' | 'card' | 'box' | 'ellipse' | 'arrow' | 'pen' | 'cross' | 'hatch' | 'highlight' | 'spotlight' | 'cut' | 'redact';
interface ToolDef {
  id: ToolId;
  label: string;
  icon: string; // inner SVG markup for a 24×24, stroke-only icon
  tip?: string; // added to the tooltip after "<Name> (<key>)"
  means?: string; // what the mark tells an agent; absent for Select
}
interface ToolGroup {
  key: string;
  label: string;
  color?: string; // fixed color: the color picker does not apply
  tools: ToolDef[];
}

const RED = '#e5484d'; // coral red: remove marks, and the default annotation colour
const YELLOW = '#facc15';

// A key selects its group; pressing it again steps to the group's next tool.
const GROUPS: ToolGroup[] = [
  {
    key: 'c',
    label: 'Select',
    tools: [
      {
        id: 'select',
        label: 'Select',
        icon: '<path d="M6 3l12 9-5.5 1.2L15 19l-2.5 1-2.6-5.8L6 18z"/>',
        tip: 'click a mark to move, resize or delete it (⌫)',
      },
    ],
  },
  {
    key: '1',
    label: 'Reference',
    tools: [
      {
        id: 'marker',
        label: 'Reference',
        icon: '<rect x="5.5" y="5.5" width="13" height="13" rx="2.5" transform="rotate(45 12 12)"/><path d="M10.8 9.2L12.4 8v8"/>',
        means: 'a numbered diamond; its note is the item with the same number in the list under the image',
      },
      {
        id: 'card',
        label: 'Card',
        icon: '<path d="M4 4h16v12H11l-4 4v-4H4z"/><path d="M8 8.5h8M8 12h5"/>',
        means: 'a yellow speech bubble whose text is a comment about what its tail and line point at',
      },
    ],
  },
  {
    key: '2',
    label: 'Mark',
    tools: [
      { id: 'box', label: 'Box', icon: '<rect x="3" y="6" width="18" height="12" rx="1"/>', means: 'look at this element' },
      { id: 'ellipse', label: 'Ellipse', icon: '<ellipse cx="12" cy="12" rx="9" ry="6.5"/>', means: 'look at this element' },
    ],
  },
  {
    key: '3',
    label: 'Arrow',
    tools: [{ id: 'arrow', label: 'Arrow', icon: '<path d="M5 19L19 5M10 5h9v9"/>', means: 'points at the element a note is about' }],
  },
  {
    key: '4',
    label: 'Pen',
    tools: [
      {
        id: 'pen',
        label: 'Pen',
        icon: '<path d="M3 17c2.5-4 4.5-4 6-1.5S13 19 15 15s3.5-7 6-8"/>',
        means: 'a freehand mark around or on an element: look here',
      },
    ],
  },
  {
    key: '5',
    label: 'Remove',
    color: RED,
    tools: [
      { id: 'cross', label: 'Cross', icon: '<path d="M6 6l12 12M18 6L6 18"/>', means: 'remove this' },
      {
        id: 'hatch',
        label: 'Remove area',
        icon: '<rect x="4" y="4" width="16" height="16"/><path d="M4 11l7-7M4 18L18 4M11 20l9-9"/>',
        means: 'remove everything in the hatched area',
      },
    ],
  },
  {
    key: '6',
    label: 'Highlight',
    color: YELLOW,
    tools: [
      {
        id: 'highlight',
        label: 'Highlighter',
        icon: '<path d="M9 14l7-7 3 3-7 7H9z"/><path d="M9 14l-3 3v2h4M4 22h16"/>',
        means: 'a yellow highlight: look here',
      },
      {
        id: 'spotlight',
        label: 'Spotlight',
        icon: '<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
        means: 'the image is dimmed except one clear area: focus on that area',
      },
    ],
  },
  {
    key: '7',
    label: 'Edit image',
    tools: [
      {
        id: 'cut',
        label: 'Cut & move',
        icon: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M8.5 8.5L20 20M8.5 15.5L20 4"/>',
        means: 'a dashed outline with an arrow: move that element to where the arrow points',
      },
      {
        id: 'redact',
        label: 'Redact',
        icon: '<rect x="3" y="3" width="18" height="18" rx="2"/><path fill="currentColor" stroke="none" d="M3 3h6v6H3zM15 3h6v6h-6zM9 9h6v6H9zM3 15h6v6H3zM15 15h6v6h-6z"/>',
        tip: 'pixelate to hide private details',
        means: 'pixelated on purpose to hide private details; ignore it',
      },
    ],
  },
];

// The caption under a group's button: the key that always picks it, ⌘1–⌘7. Select has no ⌘ key (snap-bmr.17.3):
// C while Settings ▸ Single-Key Tools is on, Esc while it is off.
function capFor(g: ToolGroup, singleKeys: boolean): string {
  if (g.key === 'c') return singleKeys ? 'C' : 'Esc';
  return `⌘${g.key}`;
}

// Every key that picks the group in the current mode: "2 or ⌘2", "⌘2"; Select "C or Esc", "Esc".
function keysFor(g: ToolGroup, singleKeys: boolean): string {
  if (!singleKeys) return capFor(g, false);
  return g.key === 'c' ? 'C or Esc' : `${g.key} or ⌘${g.key}`;
}

// "Box (2 or ⌘2) · press again for Ellipse"; with single keys off "Box (⌘2) · press ⌘2 again for Ellipse".
function tipFor(g: ToolGroup, variant: number, singleKeys: boolean): string {
  const t = g.tools[variant];
  const next = g.tools[(variant + 1) % g.tools.length];
  const again = singleKeys ? 'press again' : `press ${capFor(g, false)} again`;
  return `${t.label} (${keysFor(g, singleKeys)})${t.tip ? `: ${t.tip}` : ''}` + (g.tools.length > 1 ? ` · ${again} for ${next.label}` : '');
}

// A hex code as typed or pasted into the colour panel: with or without "#", 3 or 6 digits, any case, spaces around it.
// "#E5484D", "e5484d", " f00 " → "#e5484d", "#e5484d", "#ff0000"; anything else is null.
function normalizeHex(text: string): string | null {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(text.trim());
  if (!m) return null;
  const digits = m[1].length === 3 ? [...m[1]].map((d) => d + d).join('') : m[1];
  return `#${digits.toLowerCase()}`;
}

// A hex field as the owner types or pastes into it (HEX-1): a leading "#" goes at once. A paste applies any good code
// and reads as its six digits; typing applies only at six good digits, so "e54" on the way to "e5484d" never flashes a
// colour. Nothing here is an error: that waits for ↩ or blur. "#2492ff" pasted → "2492ff", "#2492ff".
function hexInput(text: string, pasted: boolean): { text: string; colour: string | null } {
  const t = (pasted ? text.trim() : text).replace(/^#/, '');
  const c = normalizeHex(t);
  if (pasted) return { text: c ? c.slice(1) : t, colour: c };
  return { text: t, colour: /^[0-9a-f]{6}$/i.test(t) ? c : null };
}

// The colour panel's Custom row: one row of five, newest first, each colour once, never a preset.
const CUSTOM_MAX = 5;
function withCustom(customs: string[], c: string, presets: string[]): string[] {
  if (presets.includes(c)) return customs;
  return [c, ...customs.filter((x) => x !== c)].slice(0, CUSTOM_MAX);
}

// The Keyboard Shortcuts window's key for a tool: every key that picks it in the current mode; a group's later tools
// are that key pressed again ("1", or "⌘1" with single keys off), with "again" beside it.
function toolKey(g: ToolGroup, variant: number, singleKeys: boolean): string {
  return variant ? (singleKeys ? g.key : `⌘${g.key}`) : keysFor(g, singleKeys);
}

// The Keyboard Shortcuts window's line under the tools: which mode the keys above are in.
function singleKeysLine(on: boolean): string {
  return on
    ? 'Settings ▸ Shortcuts ▸ Pick tools with single keys is on: C and 1–7 pick tools too.'
    : 'Settings ▸ Shortcuts ▸ Pick tools with single keys is off: only ⌘1–⌘7 pick tools, and Esc goes back to Select.';
}

if (typeof module !== 'undefined')
  module.exports = { GROUPS, capFor, tipFor, normalizeHex, hexInput, withCustom, CUSTOM_MAX, toolKey, singleKeysLine };
