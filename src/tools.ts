// The editor's tools, in toolbar order: one list for the toolbar, the shortcuts window and the copied prompt.
// Classic script (no import/export): editor.html and shortcuts.html load it before their own scripts, and main.ts
// require()s it through the module.exports line at the end.
type ToolId =
  | 'select'
  | 'marker'
  | 'card'
  | 'box'
  | 'ellipse'
  | 'arrow'
  | 'pen'
  | 'cross'
  | 'xbox'
  | 'hatch'
  | 'highlight'
  | 'spotlight'
  | 'cut'
  | 'redact';
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

const RED = '#e11d48';
const YELLOW = '#facc15';

// A key selects its group; pressing it again steps to the group's next tool.
const GROUPS: ToolGroup[] = [
  {
    key: 'v',
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
        icon: '<circle cx="12" cy="12" r="9"/><path d="M10.5 8.5L12.5 7v10"/>',
        means: 'a numbered circle; its note is the item with the same number in the list under the image',
      },
      {
        id: 'card',
        label: 'Card',
        icon: '<path d="M4 4h16v11l-5 5H4z"/><path d="M15 20v-5h5M8 9h8M8 13h5"/>',
        means: 'a yellow card whose text is a comment about what its line points at',
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
        id: 'xbox',
        label: 'Crossed box',
        icon: '<rect x="4" y="4" width="16" height="16"/><path d="M4 4l16 16M20 4L4 20"/>',
        means: 'remove this',
      },
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

if (typeof module !== 'undefined') module.exports = { GROUPS };
