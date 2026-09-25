// Renderer script (loaded by editor.html after Fabric's UMD build, no module system): keep it free of import/export.
// Every mark is a Fabric object, so it can be selected (V), moved, resized and deleted after it is drawn.
type FObject = import('fabric').FabricObject;
type Point = { x: number; y: number };
type Rect = Point & { w: number; h: number };
type GlyphKind = 'box' | 'ellipse' | 'cross' | 'hatch' | 'highlight' | 'spotlight';
type Tool = ToolId; // GROUPS, RED and YELLOW come from tools.ts, loaded first

const CARD_BG = '#fef9c3';

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const refsEl = $<HTMLDivElement>('refs');
const colorEl = $<HTMLInputElement>('color');
const captionEl = $<HTMLTextAreaElement>('caption');
const saveBtn = $<HTMLButtonElement>('save');
const toolsEl = $<HTMLSpanElement>('tools');
const mainEl = document.querySelector('main')!;
const refsLabel = $<HTMLLabelElement>('refs-label');

const canvas = new fabric.Canvas($<HTMLCanvasElement>('canvas'), {
  enableRetinaScaling: false, // the screenshot is already at device resolution
  selection: false, // one object at a time keeps undo simple
  preserveObjectStacking: true,
  uniformScaling: false,
});
const undoStack: (() => void)[] = [];
const links = new WeakMap<FObject, FObject[]>(); // cut piece -> its ghost and arrow
const variant = GROUPS.map(() => 0); // last-used tool per group
let group = GROUPS.findIndex((g) => g.key === '2'); // start on Box
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

// Reference: a numbered circle. The number is its position among markers, so it renumbers after deletes and undo.
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
  canvas.defaultCursor = canvas.freeDrawingCursor = cursorFor(t);
  if (t !== 'select') canvas.discardActiveObject();
  canvas.requestRenderAll();
  renderToolbar();
  drawGhost(); // a second key press shows the next shape without moving the pointer
}

// ---------- ghost: what the next click will draw ----------

const GHOSTS: Tool[] = ['box', 'ellipse', 'cross', 'hatch', 'marker', 'card'];
let pointer: Point | null = null; // last pointer position over the image, in image pixels
let ghostShown = false; // Pen paints its stroke on the same layer, so clear it only when a ghost is there

// Drawn on Fabric's top layer, which is not part of the scene: it never reaches the saved image, undo or references.
function drawGhost() {
  const ctx = canvas.contextTop;
  if (ghostShown) canvas.clearContext(ctx);
  ghostShown = false;
  const t = tool();
  if (!pointer || drag || !background || !GHOSTS.includes(t)) return;
  ghostShown = true;
  const { x, y } = pointer;
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 0.45;
  if (t === 'marker') {
    const r = unit * 6;
    ctx.fillStyle = color();
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${r * 1.1}px -apple-system, system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(markers().length + 1), x, y + r * 0.05);
  } else if (t === 'card') {
    ctx.fillStyle = CARD_BG;
    ctx.beginPath();
    ctx.roundRect(x, y, unit * 70, unit * 15, unit * 2); // a new card's size, placed from its top left
    ctx.fill();
  } else {
    const d = unit * 8; // rect()'s click size
    drawGlyph(ctx, t as GlyphKind, color(), x - d, y - d, d * 2, d * 2);
  }
  ctx.restore();
}

// Tools without a fixed shape show their icon beside the crosshair; the hotspot is the crosshair's centre.
function cursorFor(t: Tool): string {
  if (t === 'select') return 'default';
  if (GHOSTS.includes(t)) return 'crosshair';
  const icon = GROUPS.flatMap((g) => g.tools).find((x) => x.id === t)!.icon;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
    <path d="M8 1v14M1 8h14" stroke="#fff" stroke-width="3"/><path d="M8 1v14M1 8h14" stroke="#111" stroke-width="1"/>
    <rect x="13" y="13" width="18" height="18" rx="4" fill="#fff" stroke="#111" stroke-width="0.5"/>
    <g transform="translate(15 15) scale(0.583)" fill="none" stroke="#111" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${icon}</g>
  </svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}") 8 8, crosshair`;
}

// One icon button per key, showing the group's current tool; pressing the key again swaps the icon.
// Under it: the key, and one dot per tool when the key holds more than one (the filled dot is the current tool).
function renderToolbar() {
  toolsEl.replaceChildren(
    ...GROUPS.map((g, i) => {
      const t = g.tools[variant[i]];
      const next = g.tools[(variant[i] + 1) % g.tools.length];
      const wrap = document.createElement('div');
      wrap.className = 'group';
      const b = document.createElement('button');
      b.dataset.group = g.key;
      b.dataset.tool = t.id;
      b.setAttribute('aria-label', t.label);
      b.setAttribute('aria-pressed', String(i === group));
      b.title =
        `${t.label} (${g.key.toUpperCase()})${t.tip ? `: ${t.tip}` : ''}` + (g.tools.length > 1 ? ` · press again for ${next.label}` : '');
      b.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${t.icon}</svg>`; // static markup from tools.ts
      b.onclick = () => pickGroup(i);
      const cap = document.createElement('div');
      cap.className = 'cap';
      const kbd = document.createElement('kbd');
      kbd.textContent = g.key.toUpperCase();
      cap.append(kbd);
      if (g.tools.length > 1) {
        const dots = document.createElement('span');
        dots.className = 'dots';
        dots.textContent = g.tools.map((_, v) => (v === variant[i] ? '●' : '○')).join('');
        cap.append(dots);
      }
      wrap.append(b, cap);
      return wrap;
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
  pickGroup(GROUPS.findIndex((g) => g.key === 'c'));
  canvas.setActiveObject(piece);
}

canvas.on('mouse:down', ({ scenePoint: p }) => {
  const t = tool();
  if (!background || t === 'select' || t === 'pen') return;
  if (t === 'marker') {
    const m = new Marker(p, color());
    canvas.add(m);
    added(m);
    // After the event: the browser's own mousedown handling would otherwise move focus off the note again.
    setTimeout(() => refsEl.querySelector<HTMLTextAreaElement>('.ref:last-child textarea')?.focus());
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

// Registered after the drawing handlers, so they see the drag state those handlers just set.
canvas.on('mouse:move', ({ scenePoint: p }) => {
  if (drag) return;
  pointer = { x: p.x, y: p.y };
  drawGhost();
});
canvas.on('mouse:down', () => {
  pointer = null;
  drawGhost();
});
canvas.on('mouse:up', ({ scenePoint: p }) => {
  pointer = { x: p.x, y: p.y };
  drawGhost(); // the next reference shows its new number
});
canvas.on('mouse:out', () => {
  pointer = null;
  drawGhost();
});

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
  refsLabel.hidden = !list.length; // References appear with the first reference
  if (!list.length) {
    shownRefs = [];
    refsEl.replaceChildren();
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
      ta.rows = 1; // grows with its text (field-sizing: content)
      ta.value = m.note;
      ta.placeholder = `Note for ${m.n}`;
      ta.oninput = () => {
        m.note = ta.value;
        markDirty();
      };
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
  // Esc steps back one level: a text field (above), then the selection, then the tool itself.
  if (e.key === 'Escape') {
    if (active) return void (canvas.discardActiveObject(), canvas.requestRenderAll());
    if (tool() !== 'select') {
      group = GROUPS.findIndex((x) => x.key === 'c');
      applyTool();
    }
    return;
  }
  if ((e.key === 'Backspace' || e.key === 'Delete') && active) return remove(active);
  const g = GROUPS.findIndex((x) => x.key === e.key.toLowerCase());
  if (!e.metaKey && g >= 0) pickGroup(g);
});

// Tells the main process there is work to lose, so Quit asks first. The screenshot is the background, not an object.
const markDirty = () => window.snapmark.dirty(true);
canvas.on('object:added', markDirty);
captionEl.addEventListener('input', markDirty);
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
