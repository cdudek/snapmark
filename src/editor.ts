// Renderer script (loaded by editor.html after Fabric's UMD build, no module system): keep it free of import/export.
// Every mark is a Fabric object, so it can be selected (V), moved, resized and deleted after it is drawn.
type FObject = import('fabric').FabricObject;
type Point = { x: number; y: number };
type Rect = Point & { w: number; h: number };
type GlyphKind = 'box' | 'ellipse' | 'cross' | 'hatch' | 'highlight' | 'spotlight';
type Tool = ToolId; // GROUPS, RED and YELLOW come from tools.ts, loaded first

const CARD_BG = '#fef9c3';
// Annotation colours, never the app's blue accent for anything else. Lower case, as <input type="color"> reports them.
const PALETTE: [string, string][] = [
  ['Coral red', RED],
  ['Orange', '#f76b15'],
  ['Amber', '#ffb224'],
  ['Green', '#30a46c'],
  ['Teal', '#12a594'],
  ['Cyan', '#05a2c2'],
  ['Blue', '#2492ff'],
  ['Violet', '#8b3dff'],
  ['Pink', '#ef28a7'],
  ['Graphite', '#2c2c31'],
];

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const refsEl = $<HTMLDivElement>('refs');
const colorEl = $<HTMLInputElement>('color');
const saveBtn = $<HTMLButtonElement>('save');
const toolsEl = $<HTMLSpanElement>('tools');
const mainEl = document.querySelector('main')!;
const refsLabel = $<HTMLLabelElement>('refs-label');
const undoBtn = $<HTMLButtonElement>('undo');
const redoBtn = $<HTMLButtonElement>('redo');

const canvas = new fabric.Canvas($<HTMLCanvasElement>('canvas'), {
  enableRetinaScaling: false, // the screenshot is already at device resolution
  selection: false, // one object at a time keeps undo simple
  preserveObjectStacking: true,
  uniformScaling: false,
});
// Every step goes both ways; objs are the marks a step added, so an empty new card can take its step back out.
type Step = { undo: () => void; redo: () => void; objs?: FObject[] };
const undoStack: Step[] = [];
const redoStack: Step[] = [];
const links = new WeakMap<FObject, FObject[]>(); // cut piece -> its ghost and arrow
const variant = GROUPS.map(() => 0); // last-used tool per group
let group = GROUPS.findIndex((g) => g.key === '2'); // start on Box
let unit = 2; // stroke width in image pixels, scaled to the screenshot size
let background: import('fabric').FabricImage | null = null;
let drag: { start: Point; obj: FObject | null } | null = null;
let oneShot = false; // one-shot mode: Beautify instead of References, Copy Image instead of Add to session
let beauty: Beautify = DEFAULT_BEAUTY; // one-shot mode's settings
let singleKeys = true; // Settings ▸ Single-Key Tools: off, only ⌘1–⌘7 pick tools

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

// A reference's diamond: a rounded square turned 45° (the logo's centre) with a white number; r is from centre to tip.
function drawMarker(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, c: string, n: number) {
  const k = r * 0.25; // corner radius
  const a = (r - k) / Math.SQRT2 + k; // half side, so the rounded tips reach r
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.PI / 4);
  ctx.beginPath();
  ctx.roundRect(-a, -a, a * 2, a * 2, k);
  ctx.fillStyle = c;
  ctx.fill();
  ctx.lineWidth = unit / 2;
  ctx.strokeStyle = '#fff';
  ctx.stroke();
  ctx.restore();
  ctx.fillStyle = '#fff';
  ctx.font = `bold ${r * 0.8}px -apple-system, system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(String(n), x, y + r * 0.04);
}

// Reference: a numbered diamond. The number is its position among markers, so it renumbers after deletes and undo.
class Marker extends fabric.Circle {
  n = 0;
  note = '';
  constructor(p: Point, c: string) {
    super({ left: p.x, top: p.y, radius: unit * 8, originX: 'center', originY: 'center', fill: c });
    this.set({ objectCaching: false, hasControls: false });
  }
  _render(ctx: CanvasRenderingContext2D) {
    drawMarker(ctx, 0, 0, this.radius, String(this.fill), this.n);
  }
}

// A speech bubble's tail: a triangle on the edge of the body (half sizes hw, hh around 0,0) toward t, wound like
// roundRect (clockwise on screen) so one fill gives one outline. Null when t is inside the body.
function bubbleTail(hw: number, hh: number, t: Point, u: number): [Point, Point, Point] | null {
  const [kx, ky] = [hw / Math.abs(t.x || 1e-9), hh / Math.abs(t.y || 1e-9)];
  const k = Math.min(kx, ky); // centre-to-t scale that lands on the edge
  if (k >= 1) return null;
  const e = { x: t.x * k, y: t.y * k };
  const half = u * 5; // half the base; the base sits u inside the body, so no seam shows, and clear of the corners
  const along = (v: number, h: number, lim = Math.max(0, h - u * 3 - half)) => Math.max(-lim, Math.min(lim, v));
  const sideways = kx <= ky; // leaves through the left or right edge
  const m = sideways ? { x: Math.sign(t.x) * (hw - u), y: along(e.y, hh) } : { x: along(e.x, hw), y: Math.sign(t.y) * (hh - u) };
  // The tip stands u * 10 clear of the edge (less when the target is closer), on the way from the base to the target.
  const f = Math.min(1, (u * 11) / (sideways ? Math.abs(t.x - m.x) : Math.abs(t.y - m.y)));
  const tip = { x: m.x + (t.x - m.x) * f, y: m.y + (t.y - m.y) * f };
  const [a, b] = [-1, 1].map((s) => (sideways ? { x: m.x, y: m.y + s * half } : { x: m.x + s * half, y: m.y }));
  return (b.x - a.x) * (tip.y - a.y) - (b.y - a.y) * (tip.x - a.x) > 0 ? [a, b, tip] : [b, a, tip];
}

// Speech bubble you type on. Optionally points at a spot: its tail turns toward it and a line follows the card around.
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
    const t =
      this.pointAt && fabric.util.transformPoint(new fabric.Point(this.pointAt), fabric.util.invertTransform(this.calcTransformMatrix()));
    if (t) {
      // Line from the card centre to the target, drawn first so the bubble covers its start.
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
    ctx.roundRect(-w / 2 - p, -h / 2 - p, w + p * 2, h + p * 2, unit * 3);
    const tail = t && bubbleTail(w / 2 + p, h / 2 + p, t, unit);
    if (tail) {
      ctx.moveTo(tail[0].x, tail[0].y);
      ctx.lineTo(tail[1].x, tail[1].y);
      ctx.lineTo(tail[2].x, tail[2].y);
      ctx.closePath();
    }
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = this.accent;
    ctx.fillRect(-w / 2 - p, -h / 2 - p + unit * 3, unit * 1.2, h + p * 2 - unit * 6);
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
  if (t === 'marker') drawMarker(ctx, x, y, unit * 8, color(), markers().length + 1);
  else if (t === 'card') {
    ctx.fillStyle = CARD_BG;
    ctx.beginPath();
    ctx.roundRect(x, y, unit * 70, unit * 15, unit * 3); // a new card's size, placed from its top left
    ctx.fill();
  } else {
    const d = unit * 16; // rect()'s click size, from the pointer as its top left
    drawGlyph(ctx, t as GlyphKind, color(), x, y, d, d);
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

// ---------- annotation colour: the swatch, its presets and Custom… (the macOS colour panel) ----------

// The colour input holds the current colour; it is also Custom…, so the colour panel writes straight into it.
const swatchBtn = $<HTMLButtonElement>('swatch');
const paletteEl = $<HTMLDivElement>('palette');
const presetsEl = $<HTMLDivElement>('presets');
const presetBtns = PALETTE.map(([name, c]) => {
  const b = document.createElement('button');
  b.dataset.color = c;
  b.title = name;
  b.setAttribute('aria-label', name);
  b.style.color = c; // the swatch and its picked ring
  b.onclick = () => {
    setColor(c);
    closePalette();
  };
  return b;
});
presetsEl.replaceChildren(...presetBtns);

function setColor(c: string) {
  colorEl.value = c;
  swatchBtn.querySelector('i')!.style.background = c;
  for (const b of presetBtns) b.setAttribute('aria-pressed', String(b.dataset.color === c));
  applyTool();
}

function openPalette() {
  const r = swatchBtn.getBoundingClientRect();
  Object.assign(paletteEl.style, { left: `${r.left}px`, top: `${r.bottom + 6}px` });
  paletteEl.hidden = false;
  swatchBtn.setAttribute('aria-expanded', 'true');
  (presetBtns.find((b) => b.dataset.color === colorEl.value) ?? presetBtns[0]).focus();
}

function closePalette(refocus = true) {
  if (paletteEl.hidden) return;
  paletteEl.hidden = true;
  swatchBtn.setAttribute('aria-expanded', 'false');
  if (refocus) swatchBtn.focus();
}

swatchBtn.onclick = () => (paletteEl.hidden ? openPalette() : closePalette());
colorEl.oninput = () => setColor(colorEl.value);
// Arrows walk the two rows of five and stop here, so they never also nudge the selected mark. Esc stops here too:
// the editor's own Esc would step back a tool or close the window.
paletteEl.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') return void (e.stopPropagation(), closePalette());
  const step = ({ ArrowLeft: -1, ArrowRight: 1, ArrowUp: -5, ArrowDown: 5 } as Record<string, number>)[e.key];
  const i = presetBtns.indexOf(document.activeElement as HTMLButtonElement);
  if (!step || i < 0) return;
  e.preventDefault();
  e.stopPropagation();
  presetBtns[(i + step + presetBtns.length) % presetBtns.length].focus();
});
document.addEventListener('mousedown', (e) => {
  if (!paletteEl.contains(e.target as Node) && !swatchBtn.contains(e.target as Node)) closePalette(false);
});

// Normalise a drag rectangle; a plain click gets a default size with the click as its top left, like a drag's start.
function rect(a: Point, b: Point, clickSize = true): Rect | null {
  if (Math.hypot(b.x - a.x, b.y - a.y) < unit * 3) {
    if (!clickSize) return null;
    return { x: a.x, y: a.y, w: unit * 16, h: unit * 16 };
  }
  return { x: Math.min(a.x, b.x), y: Math.min(a.y, b.y), w: Math.abs(b.x - a.x), h: Math.abs(b.y - a.y) };
}

// Pixelated copy of the screenshot region, pinned in place: moving it would uncover what it hides.
function redact(r: Rect) {
  const img = makeRedact(r);
  canvas.add(img);
  added(img);
}

function makeRedact(r: Rect) {
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
  return img;
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
  const [ghost, arrow, piece] = makeCut(r, colorEl.value);
  canvas.add(ghost, arrow, piece);
  added(ghost, arrow, piece);
  // Lifted pieces are for moving: switch to Select with the piece picked up.
  pickGroup(GROUPS.findIndex((g) => g.key === 'c'));
  canvas.setActiveObject(piece);
}

function makeCut(r: Rect, c: string): [FObject, FObject, FObject] {
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
  return [ghost, arrow, piece];
}

canvas.on('mouse:down', ({ scenePoint: p }) => {
  const t = tool();
  if (!background || t === 'select' || t === 'pen') return;
  if (t === 'marker') {
    const m = new Marker(p, color());
    canvas.add(m);
    added(m);
    // After the event: the browser's own mousedown handling would otherwise move focus off the note again.
    setTimeout(async () => (await fields.get(m))?.focus());
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
  undoBtn.disabled = !undoStack.length;
  redoBtn.disabled = !redoStack.length;
  canvas.requestRenderAll();
}

function record(step: Step) {
  undoStack.push(step);
  redoStack.length = 0;
  after();
}

function added(...objs: FObject[]) {
  record({ objs, undo: () => canvas.remove(...objs), redo: () => canvas.add(...objs) });
}

function remove(obj: FObject) {
  const all = [...(links.get(obj) ?? []), obj];
  canvas.remove(...all);
  record({
    undo: () => {
      canvas.add(...all);
      relink(obj);
    },
    redo: () => canvas.remove(...all),
  });
}

// Several marks as one step (⌘A, then ⌫). Undo puts each back at its old place in the stack, so references keep
// their numbers.
function removeAll(objs: FObject[]) {
  canvas.discardActiveObject();
  const all = objs.flatMap((o) => [...(links.get(o) ?? []), o]);
  const at = all.map((o) => [canvas.getObjects().indexOf(o), o] as const).sort(([a], [b]) => a - b);
  canvas.remove(...all);
  record({
    undo: () => {
      for (const [i, o] of at) canvas.insertAt(i, o);
      objs.forEach(relink);
    },
    redo: () => canvas.remove(...all),
  });
}

// Moves marks by (dx, dy) image pixels, as one step. Never applied inside a multi-selection: undo and redo drop it first.
const shift = (objs: FObject[], dx: number, dy: number) => () => {
  for (const o of objs) {
    o.set({ left: o.left + dx, top: o.top + dy });
    o.setCoords();
    relink(o);
  }
};

const isRedaction = (o: FObject) => o instanceof fabric.FabricImage && !links.has(o); // pinned: moving it uncovers what it hides

// One mark selected normally; several as a selection that moves and deletes but never resizes or rotates, since undo
// records a move only.
function select(objs: FObject[]) {
  if (!objs.length) return;
  canvas.setActiveObject(objs.length === 1 ? objs[0] : new fabric.ActiveSelection(objs, { canvas, hasControls: false }));
  canvas.requestRenderAll();
}

// ⌘A: every mark but redactions, on the Select tool.
function selectAll() {
  const marks = canvas.getObjects().filter((o) => o.selectable && !isRedaction(o));
  if (!marks.length) return;
  if (tool() !== 'select') {
    group = GROUPS.findIndex((g) => g.key === 'c');
    applyTool();
  }
  select(marks);
}

// Arrow keys: the selected marks by 1 point (⇧: 10), one undo step per press.
function nudge(dx: number, dy: number) {
  const active = canvas.getActiveObject();
  if (!active || isRedaction(active)) return;
  const objs = canvas.getActiveObjects();
  if (active instanceof fabric.ActiveSelection) {
    active.set({ left: active.left + dx, top: active.top + dy });
    active.setCoords();
    objs.forEach(relink);
  } else shift(objs, dx, dy)();
  record({ undo: shift(objs, -dx, -dy), redo: shift(objs, dx, dy) });
}

let before: Record<string, unknown> | null = null;
// Position and size only: a Line's x1..y2 go stale once it is moved, so they are never restored.
const PROPS = ['left', 'top', 'width', 'height', 'scaleX', 'scaleY', 'angle'] as const;
const place = (obj: object) => Object.fromEntries(PROPS.filter((k) => k in obj).map((k) => [k, (obj as Record<string, unknown>)[k]]));
canvas.on('before:transform', ({ transform }) => (before = place(transform.target)));
// A cut piece's arrow follows it inside a multi-selection too, where the piece's own 'moving' never fires.
canvas.on('object:moving', ({ target }) => target instanceof fabric.ActiveSelection && target.getObjects().forEach(relink));
canvas.on('object:modified', ({ target }) => {
  if (target instanceof Glyph) {
    target.set({ width: target.width * target.scaleX, height: target.height * target.scaleY, scaleX: 1, scaleY: 1 });
    target.setCoords();
  }
  if (before && target instanceof fabric.ActiveSelection) {
    // A multi-selection only moves: one step that moves each of its marks back by the same distance.
    const [dx, dy] = [target.left - (before.left as number), target.top - (before.top as number)];
    const objs = target.getObjects();
    record({ undo: shift(objs, -dx, -dy), redo: shift(objs, dx, dy) });
  } else if (before) {
    const put = (p: Record<string, unknown>) => () => {
      target.set(p as Partial<FObject>);
      target.setCoords();
      relink(target);
    };
    record({ undo: put(before), redo: put(place(target)) });
  }
  before = null;
});

let textBefore = '';
canvas.on('text:editing:entered', ({ target }) => (textBefore = target.text));
canvas.on('text:editing:exited', ({ target }) => {
  if (!target.text.trim()) {
    canvas.remove(target);
    // A new card left empty is a mis-click and leaves no step; a card whose text was cleared comes back with ⌘Z.
    if (undoStack.at(-1)?.objs?.includes(target)) {
      undoStack.pop();
      after();
    } else {
      const old = textBefore;
      record({ undo: () => canvas.add(target.set({ text: old })), redo: () => canvas.remove(target) });
    }
  } else if (target.text !== textBefore) {
    const [old, now] = [textBefore, target.text];
    record({ undo: () => target.set({ text: old }), redo: () => target.set({ text: now }) });
  }
});

// Undo and redo drop the selection first: inside a multi-selection Fabric keeps its marks' positions relative to it.
function undo() {
  canvas.discardActiveObject();
  const step = undoStack.pop();
  step?.undo();
  if (step) redoStack.push(step);
  canvas.discardActiveObject();
  after();
}

function redo() {
  canvas.discardActiveObject();
  const step = redoStack.pop();
  step?.redo();
  if (step) undoStack.push(step);
  canvas.discardActiveObject();
  after();
}

// ⌘Z and ⇧⌘Z undo the typing in the field that has the cursor first. With nothing left to undo there they undo
// marks, so a reference or card placed by mistake goes with one ⌘Z although its empty note has the cursor.
// Runs in the capture phase and calls the field's undo itself, so the notes' own keymap never sees the key.
document.addEventListener(
  'keydown',
  (e) => {
    if (!e.metaKey || e.key.toLowerCase() !== 'z') return;
    const active = canvas.getActiveObject();
    if (active instanceof Card && active.isEditing && active.text.trim()) return; // the card's own text undo
    e.preventDefault(); // nor the Edit menu's Undo
    e.stopPropagation();
    const md = e.target instanceof Element ? MdNotes.fieldAt(e.target) : undefined;
    if (md && (e.shiftKey ? md.redo() : md.undo())) return;
    if (active instanceof Card && active.isEditing) return void active.exitEditing(); // an empty new card goes, with its step
    if (e.target instanceof HTMLElement && e.target.isContentEditable) e.target.blur();
    (e.shiftKey ? redo : undo)();
  },
  true,
);

// ---------- state: the marks as plain data, for Discarded and Edit Again ----------

type Item =
  | { t: 'glyph'; kind: GlyphKind; c: string; left: number; top: number; width: number; height: number; angle: number }
  | { t: 'arrow'; c: string; a: Point; b: Point }
  | { t: 'marker'; c: string; x: number; y: number; note: string }
  | {
      t: 'card';
      c: string;
      left: number;
      top: number;
      width: number;
      angle: number;
      scaleX: number;
      scaleY: number;
      text: string;
      pointAt: Point | null;
    }
  | { t: 'path'; obj: object }
  | { t: 'redact'; r: Rect }
  | { t: 'cut'; c: string; r: Rect; left: number; top: number; scaleX: number; scaleY: number; angle: number };

function itemOf(o: FObject): Item | null {
  if (o instanceof Glyph)
    return {
      t: 'glyph',
      kind: o.kind,
      c: String(o.stroke),
      left: o.left,
      top: o.top,
      width: o.width * o.scaleX,
      height: o.height * o.scaleY,
      angle: o.angle,
    };
  if (o instanceof Arrow) {
    const p = o.calcLinePoints();
    const m = o.calcTransformMatrix();
    const [a, b] = [new fabric.Point(p.x1, p.y1), new fabric.Point(p.x2, p.y2)].map((q) => fabric.util.transformPoint(q, m));
    return { t: 'arrow', c: String(o.stroke), a: { x: a.x, y: a.y }, b: { x: b.x, y: b.y } };
  }
  if (o instanceof Marker) return { t: 'marker', c: String(o.fill), x: o.left, y: o.top, note: noteOf(o) };
  if (o instanceof Card) {
    const { left, top, width, angle, scaleX, scaleY, text, pointAt, accent } = o;
    return { t: 'card', c: accent, left, top, width, angle, scaleX, scaleY, text, pointAt };
  }
  if (o instanceof fabric.Path) return { t: 'path', obj: o.toObject() };
  if (o instanceof fabric.FabricImage) {
    const r = { x: o.cropX, y: o.cropY, w: o.width, h: o.height };
    if (!links.has(o)) return { t: 'redact', r };
    const { left, top, scaleX, scaleY, angle } = o;
    return { t: 'cut', c: String(o.stroke), r, left, top, scaleX, scaleY, angle };
  }
  return null;
}

function stateOf(): EditState {
  // A multi-selection holds its marks' positions relative to itself; dropping it puts them back on the image.
  if (canvas.getActiveObject() instanceof fabric.ActiveSelection) canvas.discardActiveObject();
  const extras = new Set(canvas.getObjects().flatMap((o) => links.get(o) ?? [])); // a cut's outline and arrow
  const items = canvas
    .getObjects()
    .filter((o) => !extras.has(o))
    .map(itemOf)
    .filter(Boolean);
  return { caption: captionField?.value() ?? '', items, redacted, ...(oneShot ? { beautify: beauty } : {}) };
}

async function restore(items: Item[]) {
  for (const i of items) {
    if (i.t === 'glyph') canvas.add(new Glyph(i.kind, { x: i.left, y: i.top, w: i.width, h: i.height }, i.c).set({ angle: i.angle }));
    else if (i.t === 'arrow') canvas.add(new Arrow(i.a, i.b, i.c));
    else if (i.t === 'marker') canvas.add(Object.assign(new Marker({ x: i.x, y: i.y }, i.c), { note: i.note }));
    else if (i.t === 'card') {
      const card = new Card({ x: i.left, y: i.top }, i.pointAt, i.c);
      card.set({ text: i.text, width: i.width, angle: i.angle, scaleX: i.scaleX, scaleY: i.scaleY });
      canvas.add(card);
    } else if (i.t === 'path') canvas.add(await fabric.Path.fromObject(i.obj as never));
    else if (i.t === 'redact') canvas.add(makeRedact(i.r));
    else if (i.t === 'cut') {
      const [ghost, arrow, piece] = makeCut(i.r, i.c);
      piece.set({ left: i.left, top: i.top, scaleX: i.scaleX, scaleY: i.scaleY, angle: i.angle });
      canvas.add(ghost, arrow, piece);
      relink(piece);
    }
  }
  after();
}

// ---------- side panel, save, keys ----------

const markers = () => canvas.getObjects().filter((o): o is Marker => o instanceof Marker);
const cards = () => canvas.getObjects().filter((o): o is Card => o instanceof Card);

let shownRefs: Marker[] = [];

// Each reference's Markdown field, so a new reference can be focused once its field exists.
const fields = new WeakMap<Marker, Promise<import('./md-notes').MdField>>();
const ready = new WeakMap<Marker, import('./md-notes').MdField>(); // mounted fields, read synchronously
// A marker's note as typed right now (the fields' change events lag 200 ms behind typing).
const noteOf = (m: Marker) => ready.get(m)?.value() ?? m.note;

function renderRefs() {
  const list = markers();
  refsLabel.hidden = !list.length; // References appear with the first reference
  // Same markers in the same order: keep the rows, so a note being typed keeps focus.
  if (list.length === shownRefs.length && list.every((m, i) => m === shownRefs[i])) return;
  // Rows are rebuilt or dropped below: keep what was just typed, also when every reference goes at once (⌘A ⌫) and
  // undo brings them back.
  for (const m of shownRefs) m.note = noteOf(m);
  shownRefs = list;
  if (!list.length) return void refsEl.replaceChildren();
  refsEl.replaceChildren(
    ...list.map((m) => {
      const row = document.createElement('div');
      row.className = 'ref';
      const badge = document.createElement('b');
      badge.textContent = String(m.n);
      badge.style.setProperty('--mark', String(m.fill));
      const field = document.createElement('div');
      const mounted = MdNotes.mount(field, m.note, {
        placeholder: `Note for ${m.n}`,
        onChange: (md) => {
          m.note = md;
          markDirty();
        },
      });
      fields.set(m, mounted);
      void mounted.then((f) => ready.set(m, f));
      row.append(badge, field);
      return row;
    }),
  );
}

let saving = false; // closing after a save is not a discard

// Auto-redact: Redact marks over the emails, keys, tokens, card numbers and IBANs in the screenshot's text, added as
// one step that ⌘Z takes back. Add to session, Copy Image and Save As… wait for it, so none of it leaves the Mac.
let redacted = false; // it ran on this screenshot (kept in its state for Edit Again)
let redacting = Promise.resolve();
let quiet = false; // its marks are not the owner's unsaved work
async function autoRedact() {
  const found = await window.snapmark.secrets().catch(() => null);
  if (!found || !background) return;
  redacted = true;
  if (!found.length) return;
  const { width: W, height: H } = background;
  const marks = found.map((r) => makeRedact({ ...r, w: Math.min(r.w, W - r.x), h: Math.min(r.h, H - r.y) }));
  const note = $('redacted');
  note.textContent = `Redacted ${marks.length} sensitive item${marks.length === 1 ? '' : 's'} · ⌘Z to undo`;
  const show = (on: boolean) => {
    quiet = true;
    canvas[on ? 'add' : 'remove'](...marks);
    quiet = false;
    note.hidden = !on;
  };
  show(true);
  record({ objs: marks, undo: () => show(false), redo: () => show(true) });
}

// The marked-up image as base64 PNG: card typing ended and nothing selected. Add to session, Copy Image and Save As…
// all take it from here, so the three always match. One-shot mode puts it on its Beautify backdrop.
function flatten(): string {
  const active = canvas.getActiveObject();
  if (active instanceof fabric.Textbox && active.isEditing) active.exitEditing();
  canvas.discardActiveObject();
  canvas.renderAll();
  if (!oneShot) return canvas.toDataURL({ format: 'png', multiplier: 1 }).split(',')[1];
  return beautified(canvas.toCanvasElement(1)).toDataURL('image/png').split(',')[1];
}

// The one-shot image: the marked screenshot on its backdrop, with padding, rounded corners and shadow, at the
// screenshot's full resolution. The same layout as the preview (fit), which draws it with CSS.
function beautified(shot: HTMLCanvasElement): HTMLCanvasElement {
  const L = beautyLayout(shot.width, shot.height, beauty);
  const out = document.createElement('canvas');
  [out.width, out.height] = [L.width, L.height];
  const g = out.getContext('2d')!;
  const stops = backdropStops(beauty.backdrop);
  if (stops.length) {
    const grad = g.createLinearGradient(...gradientLine(L.width, L.height));
    stops.forEach((c, i) => grad.addColorStop(i / Math.max(1, stops.length - 1), c));
    g.fillStyle = grad;
    g.fillRect(0, 0, L.width, L.height);
  }
  g.beginPath();
  g.roundRect(L.x, L.y, shot.width, shot.height, L.radius);
  g.save();
  if (L.blur) Object.assign(g, { shadowColor: SHADOW, shadowBlur: L.blur, shadowOffsetY: L.offsetY });
  g.fillStyle = '#fff'; // casts the shadow; the screenshot covers it
  g.fill();
  g.restore();
  g.clip();
  g.drawImage(shot, L.x, L.y);
  return out;
}

async function save() {
  if (saving || !background) return; // ⌘S, ⌘↵ and the button: one save, and only once the image is there
  saveBtn.disabled = true;
  saving = true;
  await redacting;
  const png = flatten();
  const state = stateOf();
  await window.snapmark
    .save({
      png,
      caption: state.caption,
      notes: markers().map(noteOf),
      cards: cards().map((c) => c.text.trim()),
      moves: canvas.getObjects().filter((o) => links.has(o)).length,
      state,
    })
    .catch((e: unknown) => {
      saving = false;
      saveBtn.disabled = false;
      throw e;
    });
}

// Discard, ⌘W, Esc and the close button all end here: the screenshot and its marks go to Discarded for 7 days.
window.addEventListener('beforeunload', () => {
  if (!saving && background) window.snapmark.stash(stateOf());
});

const copyImage = async () => {
  if (!background) return;
  await redacting;
  window.snapmark.copyImage(flatten());
};
const ARROWS: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
const saveImageAs = () => void (background && redacting.then(() => window.snapmark.saveImageAs(flatten())));

document.addEventListener('keydown', (e) => {
  if (e.metaKey && e.key === 'Enter') return void (oneShot ? copyImage() : save()); // the primary button
  // ⇧⌘C and ⇧⌘S from anywhere, also inside a note: plain ⌘C there still copies its text.
  const k = e.metaKey && e.shiftKey && e.key.toLowerCase();
  if (k === 'c' || k === 's') {
    e.preventDefault();
    return (k === 'c' ? copyImage : saveImageAs)();
  }
  // ⌘S, as in Preview: add to the session; one-shot mode has no session, so Save As…. Also while typing.
  if (e.metaKey && !e.shiftKey && e.key === 's') {
    e.preventDefault();
    return oneShot ? saveImageAs() : void save();
  }
  if (e.metaKey && e.key === 'w') return window.close();
  const typing = e.target instanceof HTMLTextAreaElement || (e.target instanceof HTMLElement && e.target.isContentEditable);
  const field = e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement; // a slider or the colour well
  // ⌘C copies the image, unless text has the cursor (interaction guidelines, Copy and paste). The selection stays.
  if (e.metaKey && !e.shiftKey && e.key === 'c' && !typing) {
    e.preventDefault();
    const kept = canvas.getActiveObjects();
    return void copyImage().then(() => select(kept));
  }
  // ⌘1–⌘7 pick a tool from anywhere, also while a note or card has the cursor, where the plain digit types.
  const numbered = e.metaKey && /^\d$/.test(e.key) ? GROUPS.findIndex((x) => x.key === e.key) : -1;
  if (numbered >= 0) {
    e.preventDefault();
    if (typing) (e.target as HTMLElement).blur();
    return pickGroup(numbered);
  }
  if (typing) {
    // Also covers Fabric's hidden textarea while a card is being edited; Fabric handles Esc there itself.
    if (e.key === 'Escape') (e.target as HTMLElement).blur();
    return;
  }
  const active = canvas.getActiveObject();
  // A slider or the colour well keeps its own arrows and ⌘A.
  if (e.metaKey && e.key === 'a' && !field) {
    e.preventDefault(); // nor the Edit menu's Select All
    return selectAll();
  }
  const arrow = ARROWS[e.key];
  if (arrow && active && !field) {
    e.preventDefault(); // nor scroll a tall screenshot
    const by = (e.shiftKey ? 10 : 1) * window.devicePixelRatio; // points; the canvas is at device resolution
    return nudge(arrow[0] * by, arrow[1] * by);
  }
  // Esc steps back one level: a text field (above), then the selection, then the tool itself.
  if (e.key === 'Escape') {
    if (active) return void (canvas.discardActiveObject(), canvas.requestRenderAll());
    if (tool() !== 'select') {
      group = GROUPS.findIndex((x) => x.key === 'c');
      applyTool();
      return;
    }
    return window.close(); // one step past Select: close, recoverable from Discarded
  }
  if ((e.key === 'Backspace' || e.key === 'Delete') && active)
    return active instanceof fabric.ActiveSelection ? removeAll(canvas.getActiveObjects()) : remove(active);
  const g = GROUPS.findIndex((x) => x.key === e.key.toLowerCase());
  if (!e.metaKey && g >= 0 && singleKeys) pickGroup(g);
});

// Tells the main process there is work to lose, so Quit asks first. The screenshot is the background, not an object.
const markDirty = () => window.snapmark.dirty(true);
canvas.on('object:added', () => quiet || markDirty());
let captionField: import('./md-notes').MdField | null = null; // mounted once init says what it holds
undoBtn.onclick = undo;
redoBtn.onclick = redo;
saveBtn.onclick = () => (oneShot ? copyImage() : void save());
$<HTMLButtonElement>('copy').onclick = copyImage;
$<HTMLButtonElement>('save-as').onclick = saveImageAs;
$<HTMLButtonElement>('cancel').onclick = () => window.close();

// Backing store at the screenshot's full resolution, displayed scaled down to fit the window. An image so tall that
// fitting it whole would show it at under half its real size (Capture Scrolling) fits the width and scrolls instead.
// In one-shot mode the whole beautified image fits, and the Beautify frame is drawn around the canvas at its scale.
function fit() {
  if (!background) return;
  const [w, h] = [background.width, background.height];
  const L = oneShot ? beautyLayout(w, h, beauty) : null;
  const [fw, fh] = L ? [L.width, L.height] : [w, h];
  const kw = Math.min(1, (mainEl.clientWidth - 32) / fw);
  const whole = Math.min(kw, (mainEl.clientHeight - 32) / fh);
  const tall = whole * devicePixelRatio < 0.5;
  const k = tall ? kw : whole;
  Object.assign(mainEl.style, { overflowY: tall ? 'auto' : '', alignItems: tall ? 'start' : '' });
  canvas.setDimensions({ width: `${w * k}px`, height: `${h * k}px` }, { cssOnly: true });
  if (L) {
    const stops = backdropStops(beauty.backdrop);
    Object.assign(stageEl.style, { width: `${L.width * k}px`, height: `${L.height * k}px`, background: backdropCss(stops) });
    stageEl.classList.toggle('checker', !stops.length); // transparent
    Object.assign(canvas.wrapperEl.style, {
      borderRadius: `${L.radius * k}px`,
      boxShadow: L.blur ? `0 ${L.offsetY * k}px ${L.blur * k}px ${SHADOW}` : 'none',
    });
  }
  canvas.calcOffset(); // Fabric caches the canvas position; without this, clicks land offset after a resize
}

// ---------- Beautify (one-shot mode): sliders, background swatches, ratio; the last settings are the one preset ----------

const SHADOW = 'rgba(0, 0, 0, 0.4)';
const stageEl = $<HTMLDivElement>('stage');
const backdropCss = (stops: string[]) => (stops.length > 1 ? `linear-gradient(to bottom right, ${stops.join(', ')})` : (stops[0] ?? ''));
const sliders = (['padding', 'radius', 'shadow'] as const).map((key) => {
  const input = $<HTMLInputElement>(key);
  input.oninput = () => setBeauty({ [key]: Number(input.value) });
  return input;
});
const swatch = (id: string, label: string) => {
  const b = document.createElement('button');
  b.dataset.backdrop = id;
  b.title = label;
  b.setAttribute('aria-label', label);
  b.onclick = () => setBeauty({ backdrop: id });
  return b;
};
const backdropBtns = [...BACKDROPS.map((d) => swatch(d.id, d.label)), swatch('none', 'None (transparent)')];
backdropBtns.forEach((b) => (b.style.background = backdropCss(backdropStops(b.dataset.backdrop!))));
backdropBtns.at(-1)!.classList.add('checker');
// Custom…: the macOS colour panel writes straight into the hidden colour input, like the annotation palette's
const customEl = document.createElement('label');
customEl.className = 'custom';
customEl.title = 'Custom colour…';
const customInput = document.createElement('input');
customInput.type = 'color';
customInput.setAttribute('aria-label', 'Custom background colour');
customInput.oninput = () => setBeauty({ backdrop: customInput.value });
customEl.append(customInput);
$('backdrops').replaceChildren(...backdropBtns, customEl);
const ratioBtns = RATIOS.map((r) => {
  const b = document.createElement('button');
  b.textContent = r === 'auto' ? 'Auto' : r;
  b.dataset.ratio = r;
  b.onclick = () => setBeauty({ ratio: r });
  return b;
});
$('ratios').replaceChildren(...ratioBtns);

function setBeauty(change: Partial<Beautify>) {
  beauty = { ...beauty, ...change };
  renderBeauty();
  fit();
  window.snapmark.beautify(beauty);
}

function renderBeauty() {
  for (const input of sliders) {
    input.value = String(beauty[input.id as 'padding' | 'radius' | 'shadow']);
    input.previousElementSibling!.textContent = input.value; // its <output>
  }
  for (const b of backdropBtns) b.setAttribute('aria-pressed', String(b.dataset.backdrop === beauty.backdrop));
  const custom = beauty.backdrop.startsWith('#');
  if (custom) customInput.value = beauty.backdrop;
  customEl.classList.toggle('picked', custom);
  customEl.style.background = custom
    ? beauty.backdrop
    : 'conic-gradient(#e5484d, #ffb224, #30a46c, #05a2c2, #2492ff, #8b3dff, #ef28a7, #e5484d)';
  for (const b of ratioBtns) b.setAttribute('aria-pressed', String(b.dataset.ratio === beauty.ratio));
}
// Refit whenever the canvas area changes size: window resizes, and the toolbar wrapping onto a second line.
new ResizeObserver(fit).observe(mainEl);

// "Ledgerly Q4 review · 12 screenshots"; only the name while the session is empty.
const shotsLabel = (session: string, n: number) => (n ? `${session} · ${n} screenshot${n === 1 ? '' : 's'}` : session);

window.snapmark.onSession((session, count) => ($('session').textContent = shotsLabel(session, count)));
window.snapmark.onSingleKeys((on) => (singleKeys = on));
window.snapmark.init().then(async ({ src, session, count, state, replacing, oneShot: one, beautify, singleKeys: keys }) => {
  singleKeys = keys;
  $('session').textContent = shotsLabel(session, count);
  if (replacing) saveBtn.textContent = `Save changes ⌘↵`;
  if (one) {
    oneShot = true;
    beauty = { ...DEFAULT_BEAUTY, ...beautify };
    document.body.classList.add('one-shot');
    $('beautify').hidden = false;
    $('session').textContent = 'One-shot · not in a session';
    saveBtn.textContent = 'Copy Image ⌘C';
    saveBtn.title = 'Copy the image with its background, at full resolution';
    renderBeauty();
  }
  captionField = await MdNotes.mount($('caption'), state?.caption ?? '', { placeholder: 'Add a comment…', onChange: markDirty });
  background = await fabric.FabricImage.fromURL(src);
  background.set({ originX: 'left', originY: 'top', left: 0, top: 0 });
  // A tall scrolling capture counts as twice its width high: the strokes suit the part in view, not the whole page.
  unit = Math.max(2, Math.round(Math.max(background.width, Math.min(background.height, 2 * background.width)) / 400));
  canvas.setDimensions({ width: background.width, height: background.height });
  canvas.backgroundImage = background;
  canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
  fit();
  if (state) await restore(state.items as Item[]);
  applyTool();
  redacted = !!state?.redacted;
  if (!redacted) redacting = autoRedact();
});
setColor(colorEl.value); // shows it on the swatch and draws the toolbar
