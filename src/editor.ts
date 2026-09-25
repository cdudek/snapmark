// Renderer script (loaded by editor.html after Fabric's UMD build, no module system): keep it free of import/export.
// Every mark is a Fabric object, so it can be selected (V), moved, resized and deleted after it is drawn.
type FObject = import('fabric').FabricObject;
type Point = { x: number; y: number };
type Rect = Point & { w: number; h: number };
type GlyphKind = 'box' | 'ellipse' | 'cross' | 'xbox' | 'hatch' | 'tick' | 'thumb' | 'highlight' | 'spotlight';
type Tool = GlyphKind | 'select' | 'arrow' | 'pen' | 'marker' | 'card' | 'redact' | 'cut';

const RED = '#e11d48';
const GREEN = '#16a34a';
const YELLOW = '#facc15';
const CARD_BG = '#fef9c3';
// A key selects its group; pressing it again cycles through the group's tools.
// Groups with a fixed color ignore the color picker, so "remove" is always red and "approve" always green.
const GROUPS: { key: string; label: string; color?: string; tools: { id: Tool; label: string }[] }[] = [
  {
    key: '1',
    label: 'Mark',
    tools: [
      { id: 'box', label: 'Box' },
      { id: 'ellipse', label: 'Ellipse' },
    ],
  },
  {
    key: '2',
    label: 'Draw',
    tools: [
      { id: 'arrow', label: 'Arrow' },
      { id: 'pen', label: 'Pen' },
    ],
  },
  {
    key: '3',
    label: 'Remove',
    color: RED,
    tools: [
      { id: 'cross', label: 'Cross' },
      { id: 'xbox', label: 'Crossed box' },
      { id: 'hatch', label: 'Remove area' },
    ],
  },
  {
    key: '4',
    label: 'Approve',
    color: GREEN,
    tools: [
      { id: 'tick', label: 'Tick' },
      { id: 'thumb', label: 'Thumbs up' },
    ],
  },
  {
    key: '5',
    label: 'Note',
    tools: [
      { id: 'marker', label: 'Numbered' },
      { id: 'card', label: 'Card' },
    ],
  },
  {
    key: '6',
    label: 'Highlight',
    color: YELLOW,
    tools: [
      { id: 'highlight', label: 'Highlighter' },
      { id: 'spotlight', label: 'Spotlight' },
      { id: 'redact', label: 'Redact' },
    ],
  },
  { key: '7', label: 'Move', tools: [{ id: 'cut', label: 'Cut & move' }] },
  { key: 'v', label: 'Select', tools: [{ id: 'select', label: 'Select' }] },
];

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const refsEl = $<HTMLDivElement>('refs');
const colorEl = $<HTMLInputElement>('color');
const captionEl = $<HTMLTextAreaElement>('caption');
const saveBtn = $<HTMLButtonElement>('save');
const toolsEl = $<HTMLSpanElement>('tools');
const mainEl = document.querySelector('main')!;
const HINT = 'Press 5 and click the image to add a numbered marker with a note.';

const canvas = new fabric.Canvas($<HTMLCanvasElement>('canvas'), {
  enableRetinaScaling: false, // the screenshot is already at device resolution
  selection: false, // one object at a time keeps undo simple
  preserveObjectStacking: true,
  uniformScaling: false,
});
const undoStack: (() => void)[] = [];
const links = new WeakMap<FObject, FObject[]>(); // cut piece -> its ghost and arrow
const variant = GROUPS.map(() => 0); // last-used tool per group
let group = 0;
let unit = 2; // stroke width in image pixels, scaled to the screenshot size
let background: import('fabric').FabricImage | null = null;
let drag: { start: Point; obj: FObject | null } | null = null;

const tool = (): Tool => GROUPS[group].tools[variant[group]].id;
const color = () => GROUPS[group].color ?? colorEl.value;

// ---------- shapes ----------

function line(ctx: CanvasRenderingContext2D, a: Point, b: Point) {
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
}

function drawGlyph(ctx: CanvasRenderingContext2D, kind: GlyphKind, c: string, x: number, y: number, w: number, h: number) {
  ctx.save();
  ctx.strokeStyle = ctx.fillStyle = c;
  ctx.lineWidth = unit;
  ctx.lineCap = ctx.lineJoin = 'round';
  ctx.beginPath();
  switch (kind) {
    case 'box':
      ctx.strokeRect(x, y, w, h);
      break;
    case 'ellipse':
      ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
      ctx.stroke();
      break;
    case 'xbox':
      ctx.strokeRect(x, y, w, h);
    // falls through: a crossed box is a box plus a cross
    case 'cross':
      ctx.lineWidth = unit * 1.5;
      line(ctx, { x, y }, { x: x + w, y: y + h });
      line(ctx, { x: x + w, y }, { x, y: y + h });
      ctx.stroke();
      break;
    case 'hatch': {
      // "Remove area": tinted fill, border, dense criss-cross hatching clipped to the box.
      ctx.globalAlpha = 0.15;
      ctx.fillRect(x, y, w, h);
      ctx.globalAlpha = 1;
      ctx.strokeRect(x, y, w, h);
      ctx.beginPath();
      ctx.rect(x, y, w, h);
      ctx.clip();
      ctx.beginPath();
      ctx.lineWidth = unit / 2;
      for (let d = -h; d < w; d += unit * 6) {
        line(ctx, { x: x + d, y }, { x: x + d + h, y: y + h });
        line(ctx, { x: x + d + h, y }, { x: x + d, y: y + h });
      }
      ctx.stroke();
      break;
    }
    case 'tick':
      ctx.lineWidth = unit * 2;
      ctx.moveTo(x + w * 0.1, y + h * 0.55);
      ctx.lineTo(x + w * 0.4, y + h * 0.85);
      ctx.lineTo(x + w * 0.9, y + h * 0.15);
      ctx.stroke();
      break;
    case 'thumb': {
      // Green disc with a 👍 so it reads as "approved" on any background.
      const r = Math.min(w, h) / 2;
      ctx.arc(x + w / 2, y + h / 2, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = `${r * 1.1}px "Apple Color Emoji", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('👍', x + w / 2, y + h / 2 + r * 0.08);
      break;
    }
    case 'highlight':
      // Multiply keeps the text underneath readable, like a real highlighter.
      ctx.globalAlpha = 0.45;
      ctx.globalCompositeOperation = 'multiply';
      ctx.fillRect(x, y, w, h);
      break;
    case 'spotlight': {
      // Dim everything except this rectangle. Drawn far past the box; the canvas edge clips it.
      const far = 1e5;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
      ctx.rect(-far, -far, far * 2, far * 2);
      ctx.rect(x, y, w, h);
      ctx.fill('evenodd');
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = unit / 2;
      ctx.strokeRect(x, y, w, h);
      break;
    }
  }
  ctx.restore();
}

// Rectangle-based marks. Resizing changes width/height (not scale) so stroke widths stay constant.
class Glyph extends fabric.Rect {
  kind: GlyphKind;
  constructor(kind: GlyphKind, r: Rect, c: string) {
    super({ left: r.x, top: r.y, width: r.w, height: r.h, originX: 'left', originY: 'top', fill: 'transparent', stroke: c });
    this.set({ strokeWidth: 0, objectCaching: false }); // drawn by _render, which paints past the bounding box
    this.kind = kind;
  }
  _render(ctx: CanvasRenderingContext2D) {
    drawGlyph(ctx, this.kind, String(this.stroke), -this.width / 2, -this.height / 2, this.width, this.height);
  }
}

function arrowHead(ctx: CanvasRenderingContext2D, from: Point, to: Point, c: string) {
  const angle = Math.atan2(to.y - from.y, to.x - from.x);
  const head = unit * 6;
  ctx.save();
  ctx.strokeStyle = c;
  ctx.lineWidth = unit;
  ctx.lineCap = 'round';
  ctx.beginPath();
  for (const side of [-1, 1])
    line(ctx, to, { x: to.x - head * Math.cos(angle + side * 0.45), y: to.y - head * Math.sin(angle + side * 0.45) });
  ctx.stroke();
  ctx.restore();
}

class Arrow extends fabric.Line {
  constructor(a: Point, b: Point, c: string) {
    super([a.x, a.y, b.x, b.y], { stroke: c, strokeWidth: unit, strokeLineCap: 'round' });
    this.set({ objectCaching: false });
  }
  _render(ctx: CanvasRenderingContext2D) {
    super._render(ctx);
    const p = this.calcLinePoints();
    arrowHead(ctx, { x: p.x1, y: p.y1 }, { x: p.x2, y: p.y2 }, String(this.stroke));
  }
}

// Numbered circle. The number is its position among markers, so it renumbers after deletes and undo.
class Marker extends fabric.Circle {
  n = 0;
  note = '';
  constructor(p: Point, c: string) {
    super({ left: p.x, top: p.y, radius: unit * 6, originX: 'center', originY: 'center', fill: c });
    this.set({ objectCaching: false, hasControls: false });
  }
  _render(ctx: CanvasRenderingContext2D) {
    const r = this.radius;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fillStyle = String(this.fill);
    ctx.fill();
    ctx.lineWidth = unit / 2;
    ctx.strokeStyle = '#fff';
    ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${r * 1.1}px -apple-system, system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(this.n), 0, r * 0.05);
  }
}

// Sticky note you type on. Optionally points at a spot with a line that follows the card around.
class Card extends fabric.Textbox {
  pointAt: Point | null;
  accent: string;
  constructor(at: Point, pointAt: Point | null, c: string) {
    super('', {
      left: at.x,
      top: at.y,
      originX: 'left',
      originY: 'top',
      width: unit * 70,
      fontSize: unit * 7,
      fontFamily: '-apple-system, system-ui, sans-serif',
      fill: '#18181b',
      padding: unit * 4,
    });
    this.set({ objectCaching: false, backgroundColor: CARD_BG });
    this.pointAt = pointAt;
    this.accent = c;
  }
  _renderBackground(ctx: CanvasRenderingContext2D) {
    const p = this.padding;
    const [w, h] = [this.width, this.height];
    if (this.pointAt) {
      // Line from the card centre to the target, drawn first so the card covers its start.
      const t = fabric.util.transformPoint(new fabric.Point(this.pointAt), fabric.util.invertTransform(this.calcTransformMatrix()));
      ctx.save();
      ctx.strokeStyle = ctx.fillStyle = this.accent;
      ctx.lineWidth = unit;
      ctx.beginPath();
      line(ctx, { x: 0, y: 0 }, t);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(t.x, t.y, unit * 1.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
    ctx.shadowBlur = unit * 3;
    ctx.shadowOffsetY = unit;
    ctx.fillStyle = String(this.backgroundColor);
    ctx.beginPath();
    ctx.roundRect(-w / 2 - p, -h / 2 - p, w + p * 2, h + p * 2, unit * 2);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = this.accent;
    ctx.fillRect(-w / 2 - p, -h / 2 - p + unit * 2, unit * 1.2, h + p * 2 - unit * 4);
    ctx.restore();
  }
}

// ---------- tools ----------

function pickGroup(g: number) {
  if (g === group) variant[g] = (variant[g] + 1) % GROUPS[g].tools.length;
  group = g;
  applyTool();
}

function applyTool() {
  const t = tool();
  canvas.isDrawingMode = t === 'pen';
  if (canvas.freeDrawingBrush) {
    canvas.freeDrawingBrush.color = color();
    canvas.freeDrawingBrush.width = unit;
  }
  canvas.skipTargetFind = t !== 'select'; // drawing tools always draw, even on top of other marks
  canvas.defaultCursor = t === 'select' ? 'default' : 'crosshair';
  if (t !== 'select') canvas.discardActiveObject();
  canvas.requestRenderAll();
  renderToolbar();
}

function renderToolbar() {
  toolsEl.replaceChildren(
    ...GROUPS.map((g, i) => {
      const b = document.createElement('button');
      b.setAttribute('aria-pressed', String(i === group));
      if (g.color) b.style.setProperty('--tool', g.color === YELLOW ? '#ca8a04' : g.color);
      const kbd = document.createElement('kbd');
      kbd.textContent = g.key.toUpperCase();
      const name = document.createElement('span');
      name.textContent = g.tools[variant[i]].label;
      const dots = document.createElement('span');
      dots.className = 'dots';
      dots.textContent = g.tools.length > 1 ? g.tools.map((_, v) => (v === variant[i] ? '●' : '○')).join('') : '';
      b.append(kbd, name, dots);
      b.title = `${g.label}: ${g.tools.map((t) => t.label).join(' → ')}`;
      b.onclick = () => pickGroup(i);
      return b;
    }),
  );
}

// Normalise a drag rectangle; a plain click gets a default size centred on the click.
function rect(a: Point, b: Point, clickSize = true): Rect | null {
  if (Math.hypot(b.x - a.x, b.y - a.y) < unit * 3) {
    if (!clickSize) return null;
    const d = unit * 8;
    return { x: a.x - d, y: a.y - d, w: d * 2, h: d * 2 };
  }
  return { x: Math.min(a.x, b.x), y: Math.min(a.y, b.y), w: Math.abs(b.x - a.x), h: Math.abs(b.y - a.y) };
}

// Pixelated copy of the screenshot region, pinned in place: moving it would uncover what it hides.
function redact(r: Rect) {
  const img = new fabric.FabricImage(background!.getElement(), {
    left: r.x,
    top: r.y,
    originX: 'left',
    originY: 'top',
    cropX: r.x,
    cropY: r.y,
    width: r.w,
    height: r.h,
    lockMovementX: true,
    lockMovementY: true,
    hasControls: false,
  });
  img.filters = [new fabric.filters.Pixelate({ blocksize: Math.max(8, unit * 5) })];
  img.applyFilters();
  canvas.add(img);
  added(img);
}

// The point where the line from a box's centre towards `to` leaves the box.
function edge(box: FObject, to: Point): Point {
  const c = box.getCenterPoint();
  const [hw, hh] = [box.getScaledWidth() / 2, box.getScaledHeight() / 2];
  const [dx, dy] = [to.x - c.x, to.y - c.y];
  const k = Math.min(hw / Math.abs(dx || 1e-9), hh / Math.abs(dy || 1e-9), 1);
  return { x: c.x + dx * k, y: c.y + dy * k };
}

function relink(piece: FObject) {
  const [ghost, arrow] = links.get(piece) ?? [];
  if (!ghost || !(arrow instanceof Arrow)) return;
  const [a, b] = [edge(ghost, piece.getCenterPoint()), edge(piece, ghost.getCenterPoint())];
  arrow.set({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, visible: Math.hypot(b.x - a.x, b.y - a.y) > unit * 4 });
  arrow.setCoords();
}

// Lifts a region off the screenshot: the origin gets a dashed ghost, and an arrow follows the piece.
function cut(r: Rect) {
  const c = colorEl.value;
  const ghost = new fabric.Rect({ left: r.x, top: r.y, width: r.w, height: r.h, originX: 'left', originY: 'top' });
  ghost.set({
    fill: 'rgba(255, 255, 255, 0.6)',
    stroke: c,
    strokeWidth: unit / 2,
    strokeDashArray: [unit * 3, unit * 2],
    selectable: false,
    evented: false,
  });
  const arrow = new Arrow({ x: r.x, y: r.y }, { x: r.x, y: r.y }, c);
  arrow.set({ selectable: false, evented: false, visible: false });
  const piece = new fabric.FabricImage(background!.getElement(), {
    left: r.x,
    top: r.y,
    originX: 'left',
    originY: 'top',
    cropX: r.x,
    cropY: r.y,
    width: r.w,
    height: r.h,
  });
  piece.set({
    stroke: c,
    strokeWidth: unit / 2,
    shadow: new fabric.Shadow({ color: 'rgba(0, 0, 0, 0.35)', blur: unit * 4, offsetY: unit }),
  });
  links.set(piece, [ghost, arrow]);
  for (const ev of ['moving', 'scaling'] as const) piece.on(ev, () => relink(piece));
  canvas.add(ghost, arrow, piece);
  added(ghost, arrow, piece);
  // Lifted pieces are for moving: switch to Select with the piece picked up.
  pickGroup(GROUPS.findIndex((g) => g.key === 'v'));
  canvas.setActiveObject(piece);
}

canvas.on('mouse:down', ({ scenePoint: p }) => {
  const t = tool();
  if (!background || t === 'select' || t === 'pen') return;
  if (t === 'marker') {
    const m = new Marker(p, color());
    canvas.add(m);
    added(m);
    refsEl.querySelector<HTMLTextAreaElement>('.ref:last-child textarea')?.focus();
    return;
  }
  let obj: FObject | null = null;
  if (t === 'arrow') obj = new Arrow(p, p, color());
  else if (t === 'redact' || t === 'cut')
    obj = new Glyph('box', { ...p, w: 0, h: 0 }, color()); // preview frame
  else if (t !== 'card') obj = new Glyph(t, { ...p, w: 0, h: 0 }, color());
  if (obj) canvas.add(obj);
  drag = { start: { x: p.x, y: p.y }, obj };
});

canvas.on('mouse:move', ({ scenePoint: p }) => {
  if (!drag?.obj) return;
  if (drag.obj instanceof Arrow) drag.obj.set({ x2: p.x, y2: p.y });
  else {
    const r = rect(drag.start, p, false) ?? { ...drag.start, w: 0, h: 0 };
    drag.obj.set({ left: r.x, top: r.y, width: r.w, height: r.h });
  }
  canvas.requestRenderAll();
});

canvas.on('mouse:up', ({ scenePoint: p }) => {
  if (!drag) return;
  const { start, obj } = drag;
  drag = null;
  const t = tool();
  if (t === 'card') {
    // Press on what the card is about, release where the card goes. A plain click makes a card without a pointer.
    const card = new Card(p, Math.hypot(p.x - start.x, p.y - start.y) > unit * 6 ? start : null, color());
    canvas.add(card);
    added(card);
    canvas.setActiveObject(card);
    card.enterEditing();
    return;
  }
  if (!obj) return;
  if (obj instanceof Arrow) {
    if (Math.hypot(p.x - start.x, p.y - start.y) < unit * 3) canvas.remove(obj);
    else added(obj);
  } else if (t === 'redact' || t === 'cut') {
    canvas.remove(obj);
    const r = rect(start, p, false);
    if (r) (t === 'redact' ? redact : cut)(r);
  } else {
    const r = rect(start, p)!;
    obj.set({ left: r.x, top: r.y, width: r.w, height: r.h });
    added(obj);
  }
  obj.setCoords();
  canvas.requestRenderAll();
});

canvas.on('path:created', ({ path }) => added(path));

// ---------- history ----------

function after() {
  markers().forEach((m, i) => (m.n = i + 1));
  renderRefs();
  canvas.requestRenderAll();
}

function added(...objs: FObject[]) {
  undoStack.push(() => canvas.remove(...objs));
  after();
}

function remove(obj: FObject) {
  const all = [...(links.get(obj) ?? []), obj];
  canvas.remove(...all);
  undoStack.push(() => {
    canvas.add(...all);
    relink(obj);
  });
  after();
}

let before: Record<string, unknown> | null = null;
// Position and size only: a Line's x1..y2 go stale once it is moved, so they are never restored.
const PROPS = ['left', 'top', 'width', 'height', 'scaleX', 'scaleY', 'angle'] as const;
canvas.on('before:transform', ({ transform }) => {
  const o = transform.target as unknown as Record<string, unknown>;
  before = Object.fromEntries(PROPS.filter((k) => k in o).map((k) => [k, o[k]]));
});
canvas.on('object:modified', ({ target }) => {
  if (target instanceof Glyph) {
    target.set({ width: target.width * target.scaleX, height: target.height * target.scaleY, scaleX: 1, scaleY: 1 });
    target.setCoords();
  }
  if (before) {
    const snapshot = before;
    undoStack.push(() => {
      target.set(snapshot as Partial<FObject>);
      target.setCoords();
      relink(target);
    });
  }
  before = null;
});

let textBefore = '';
canvas.on('text:editing:entered', ({ target }) => (textBefore = target.text));
canvas.on('text:editing:exited', ({ target }) => {
  if (!target.text.trim()) {
    canvas.remove(target); // an empty card is a mis-click
    after();
  } else if (target.text !== textBefore) {
    const old = textBefore;
    undoStack.push(() => target.set({ text: old }));
  }
});

function undo() {
  undoStack.pop()?.();
  canvas.discardActiveObject();
  after();
}

// ---------- side panel, save, keys ----------

const markers = () => canvas.getObjects().filter((o): o is Marker => o instanceof Marker);
const cards = () => canvas.getObjects().filter((o): o is Card => o instanceof Card);

let shownRefs: Marker[] = [];

function renderRefs() {
  const list = markers();
  if (!list.length) {
    shownRefs = [];
    const p = document.createElement('p');
    p.className = 'hint';
    p.textContent = HINT;
    refsEl.replaceChildren(p);
    return;
  }
  // Same markers in the same order: keep the rows, so a note being typed keeps focus.
  if (list.length === shownRefs.length && list.every((m, i) => m === shownRefs[i])) return;
  shownRefs = list;
  refsEl.replaceChildren(
    ...list.map((m) => {
      const row = document.createElement('div');
      row.className = 'ref';
      const badge = document.createElement('b');
      badge.textContent = String(m.n);
      badge.style.background = String(m.fill);
      const ta = document.createElement('textarea');
      ta.rows = 2;
      ta.value = m.note;
      ta.placeholder = `Note for ${m.n}`;
      ta.oninput = () => (m.note = ta.value);
      row.append(badge, ta);
      return row;
    }),
  );
}

async function save() {
  saveBtn.disabled = true;
  const active = canvas.getActiveObject();
  if (active instanceof fabric.Textbox && active.isEditing) active.exitEditing();
  canvas.discardActiveObject();
  canvas.renderAll();
  await window.snapmark.save({
    png: canvas.toDataURL({ format: 'png', multiplier: 1 }).split(',')[1],
    caption: captionEl.value,
    notes: markers().map((m) => m.note),
    cards: cards().map((c) => c.text.trim()),
    moves: canvas.getObjects().filter((o) => links.has(o)).length,
  });
}

document.addEventListener('keydown', (e) => {
  if (e.metaKey && e.key === 'Enter') return void save();
  if (e.metaKey && e.key === 'w') return window.close();
  if (e.target instanceof HTMLTextAreaElement) {
    // Also covers Fabric's hidden textarea while a card is being edited; Fabric handles Esc there itself.
    if (e.key === 'Escape') e.target.blur();
    return;
  }
  if (e.metaKey && e.key === 'z') return undo();
  const active = canvas.getActiveObject();
  if (e.key === 'Escape') return void (canvas.discardActiveObject(), canvas.requestRenderAll());
  if ((e.key === 'Backspace' || e.key === 'Delete') && active) return remove(active);
  const g = GROUPS.findIndex((x) => x.key === e.key.toLowerCase());
  if (!e.metaKey && g >= 0) pickGroup(g);
});

colorEl.oninput = () => applyTool();
$<HTMLButtonElement>('undo').onclick = undo;
saveBtn.onclick = () => void save();
$<HTMLButtonElement>('cancel').onclick = () => window.close();

// Backing store at the screenshot's full resolution, displayed scaled down to fit the window.
function fit() {
  if (!background) return;
  const [w, h] = [background.width, background.height];
  const k = Math.min(1, (mainEl.clientWidth - 32) / w, (mainEl.clientHeight - 32) / h);
  canvas.setDimensions({ width: `${w * k}px`, height: `${h * k}px` }, { cssOnly: true });
  canvas.calcOffset(); // Fabric caches the canvas position; without this, clicks land offset after a resize
}
// Refit whenever the canvas area changes size: window resizes, and the toolbar wrapping onto a second line.
new ResizeObserver(fit).observe(mainEl);

window.snapmark.init().then(async ({ src, session }) => {
  $('session').textContent = `→ ${session}`;
  background = await fabric.FabricImage.fromURL(src);
  background.set({ originX: 'left', originY: 'top', left: 0, top: 0 });
  unit = Math.max(2, Math.round(Math.max(background.width, background.height) / 400));
  canvas.setDimensions({ width: background.width, height: background.height });
  canvas.backgroundImage = background;
  canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
  fit();
  applyTool();
});
renderToolbar();
