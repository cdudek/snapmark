// Renderer script (loaded by editor.html, no module system): keep it free of import/export.
type Point = { x: number; y: number };
type Rect = Point & { w: number; h: number };
type BoxTool = 'box' | 'ellipse' | 'cross' | 'xbox' | 'hatch' | 'tick' | 'thumb';
type Tool = BoxTool | 'pen' | 'arrow' | 'marker';
type Shape =
  | ({ type: BoxTool; color: string } & Rect)
  | { type: 'pen'; color: string; points: Point[] }
  | { type: 'arrow'; color: string; from: Point; to: Point }
  | ({ type: 'marker'; color: string; note: string } & Point);

const RED = '#e11d48';
const GREEN = '#16a34a';
// Key N selects group N; pressing it again cycles through that group's variants.
// Groups with a fixed color ignore the color picker, so "remove" is always red and "approve" always green.
const GROUPS: { label: string; color?: string; tools: { id: Tool; label: string }[] }[] = [
  {
    label: 'Mark',
    tools: [
      { id: 'box', label: 'Box' },
      { id: 'ellipse', label: 'Ellipse' },
    ],
  },
  {
    label: 'Draw',
    tools: [
      { id: 'arrow', label: 'Arrow' },
      { id: 'pen', label: 'Pen' },
    ],
  },
  {
    label: 'Remove',
    color: RED,
    tools: [
      { id: 'cross', label: 'Cross' },
      { id: 'xbox', label: 'Crossed box' },
      { id: 'hatch', label: 'Remove area' },
    ],
  },
  {
    label: 'Approve',
    color: GREEN,
    tools: [
      { id: 'tick', label: 'Tick' },
      { id: 'thumb', label: 'Thumbs up' },
    ],
  },
  { label: 'Marker', tools: [{ id: 'marker', label: 'Numbered' }] },
];

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const canvas = $<HTMLCanvasElement>('canvas');
const ctx = canvas.getContext('2d')!;
const refsEl = $<HTMLDivElement>('refs');
const colorEl = $<HTMLInputElement>('color');
const captionEl = $<HTMLTextAreaElement>('caption');
const saveBtn = $<HTMLButtonElement>('save');
const toolsEl = $<HTMLSpanElement>('tools');
const img = new Image();
const shapes: Shape[] = [];
const HINT = 'Press 5 and click the image to add a numbered marker with a note.';
const variant = GROUPS.map(() => 0); // last-used variant per group
let group = 0;
let drag: { start: Point; shape: Shape } | null = null;
let unit = 2; // stroke width in image pixels, scaled to the screenshot size

const tool = (): Tool => GROUPS[group].tools[variant[group]].id;

function pickGroup(g: number) {
  if (g === group) variant[g] = (variant[g] + 1) % GROUPS[g].tools.length;
  group = g;
  renderToolbar();
}

function renderToolbar() {
  toolsEl.replaceChildren(
    ...GROUPS.map((g, i) => {
      const b = document.createElement('button');
      b.setAttribute('aria-pressed', String(i === group));
      if (g.color) b.style.setProperty('--tool', g.color);
      const name = document.createElement('span');
      name.textContent = `${g.tools[variant[i]].label}`;
      const dots = document.createElement('span');
      dots.className = 'dots';
      dots.textContent = g.tools.length > 1 ? g.tools.map((_, v) => (v === variant[i] ? '●' : '○')).join('') : '';
      const kbd = document.createElement('kbd');
      kbd.textContent = String(i + 1);
      b.append(kbd, name, dots);
      b.title = `${g.label}: ${g.tools.map((t) => t.label).join(' → ')}`;
      b.onclick = () => pickGroup(i);
      return b;
    }),
  );
}

function toImage(e: PointerEvent): Point {
  const r = canvas.getBoundingClientRect();
  return { x: ((e.clientX - r.left) * canvas.width) / r.width, y: ((e.clientY - r.top) * canvas.height) / r.height };
}

function line(a: Point, b: Point) {
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
}

function draw(s: Shape, n: number) {
  ctx.strokeStyle = ctx.fillStyle = s.color;
  ctx.lineWidth = unit;
  ctx.lineCap = ctx.lineJoin = 'round';
  ctx.beginPath();
  switch (s.type) {
    case 'box':
      ctx.strokeRect(s.x, s.y, s.w, s.h);
      break;
    case 'ellipse':
      ctx.ellipse(s.x + s.w / 2, s.y + s.h / 2, s.w / 2, s.h / 2, 0, 0, Math.PI * 2);
      ctx.stroke();
      break;
    case 'pen':
      s.points.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
      ctx.stroke();
      break;
    case 'arrow': {
      const angle = Math.atan2(s.to.y - s.from.y, s.to.x - s.from.x);
      const head = unit * 6;
      line(s.from, s.to);
      for (const side of [-1, 1]) {
        line(s.to, { x: s.to.x - head * Math.cos(angle + side * 0.45), y: s.to.y - head * Math.sin(angle + side * 0.45) });
      }
      ctx.stroke();
      break;
    }
    case 'xbox':
      ctx.strokeRect(s.x, s.y, s.w, s.h);
    // falls through: a crossed box is a box plus a cross
    case 'cross':
      ctx.lineWidth = unit * 1.5;
      line({ x: s.x, y: s.y }, { x: s.x + s.w, y: s.y + s.h });
      line({ x: s.x + s.w, y: s.y }, { x: s.x, y: s.y + s.h });
      ctx.stroke();
      break;
    case 'hatch': {
      // "Remove area": tinted fill, border, dense criss-cross hatching clipped to the box.
      ctx.save();
      ctx.globalAlpha = 0.15;
      ctx.fillRect(s.x, s.y, s.w, s.h);
      ctx.globalAlpha = 1;
      ctx.strokeRect(s.x, s.y, s.w, s.h);
      ctx.beginPath();
      ctx.rect(s.x, s.y, s.w, s.h);
      ctx.clip();
      ctx.beginPath();
      ctx.lineWidth = unit / 2;
      const gap = unit * 6;
      for (let d = -s.h; d < s.w; d += gap) {
        line({ x: s.x + d, y: s.y }, { x: s.x + d + s.h, y: s.y + s.h });
        line({ x: s.x + d + s.h, y: s.y }, { x: s.x + d, y: s.y + s.h });
      }
      ctx.stroke();
      ctx.restore();
      break;
    }
    case 'tick':
      ctx.lineWidth = unit * 2;
      ctx.moveTo(s.x + s.w * 0.1, s.y + s.h * 0.55);
      ctx.lineTo(s.x + s.w * 0.4, s.y + s.h * 0.85);
      ctx.lineTo(s.x + s.w * 0.9, s.y + s.h * 0.15);
      ctx.stroke();
      break;
    case 'thumb': {
      // Green disc with a white 👍 so it reads as "approved" on any background.
      const r = Math.min(s.w, s.h) / 2;
      const c = { x: s.x + s.w / 2, y: s.y + s.h / 2 };
      ctx.arc(c.x, c.y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = `${r * 1.1}px "Apple Color Emoji", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('👍', c.x, c.y + r * 0.08);
      break;
    }
    case 'marker': {
      const r = unit * 6;
      ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = unit / 2;
      ctx.strokeStyle = '#fff';
      ctx.stroke();
      ctx.fillStyle = '#fff';
      ctx.font = `bold ${r * 1.1}px -apple-system, system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(n), s.x, s.y + r * 0.05);
    }
  }
}

const markers = () => shapes.filter((s): s is Extract<Shape, { type: 'marker' }> => s.type === 'marker');

function render() {
  ctx.drawImage(img, 0, 0);
  let n = 0;
  shapes.forEach((s) => draw(s, s.type === 'marker' ? ++n : 0));
}

function renderRefs() {
  const list = markers();
  if (!list.length) {
    const p = document.createElement('p');
    p.className = 'hint';
    p.textContent = HINT;
    refsEl.replaceChildren(p);
    return;
  }
  refsEl.replaceChildren(
    ...list.map((m, i) => {
      const row = document.createElement('div');
      row.className = 'ref';
      const badge = document.createElement('b');
      badge.textContent = String(i + 1);
      badge.style.background = m.color;
      const ta = document.createElement('textarea');
      ta.rows = 2;
      ta.value = m.note;
      ta.placeholder = `Note for ${i + 1}`;
      ta.oninput = () => (m.note = ta.value);
      row.append(badge, ta);
      return row;
    }),
  );
}

// Normalise a drag rectangle; a plain click gets a default size centred on the click.
function rect(a: Point, b: Point): Rect {
  if (Math.hypot(b.x - a.x, b.y - a.y) < unit * 3) {
    const d = unit * 8;
    return { x: a.x - d, y: a.y - d, w: d * 2, h: d * 2 };
  }
  return { x: Math.min(a.x, b.x), y: Math.min(a.y, b.y), w: Math.abs(b.x - a.x), h: Math.abs(b.y - a.y) };
}

canvas.addEventListener('pointerdown', (e) => {
  canvas.setPointerCapture(e.pointerId);
  const p = toImage(e);
  const color = GROUPS[group].color ?? colorEl.value;
  const t = tool();
  if (t === 'marker') {
    shapes.push({ type: 'marker', color, ...p, note: '' });
    render();
    renderRefs();
    refsEl.querySelector<HTMLTextAreaElement>('.ref:last-child textarea')?.focus();
    return;
  }
  const shape: Shape =
    t === 'pen'
      ? { type: 'pen', color, points: [p] }
      : t === 'arrow'
        ? { type: 'arrow', color, from: p, to: p }
        : { type: t, color, ...p, w: 0, h: 0 };
  drag = { start: p, shape };
  shapes.push(shape);
});

canvas.addEventListener('pointermove', (e) => {
  if (!drag) return;
  const p = toImage(e);
  const s = drag.shape;
  if (s.type === 'pen') s.points.push(p);
  else if (s.type === 'arrow') s.to = p;
  else Object.assign(s, rect(drag.start, p));
  render();
});

canvas.addEventListener('pointerup', (e) => {
  if (!drag) return;
  const s = drag.shape;
  const p = toImage(e);
  if (s.type === 'arrow' && Math.hypot(p.x - s.from.x, p.y - s.from.y) < unit * 3)
    shapes.pop(); // a click is not an arrow
  else if (s.type !== 'pen' && s.type !== 'arrow') Object.assign(s, rect(drag.start, p));
  drag = null;
  render();
});

function undo() {
  const s = shapes.pop();
  render();
  if (s?.type === 'marker') renderRefs();
}

async function save() {
  saveBtn.disabled = true;
  const png = canvas.toDataURL('image/png').split(',')[1];
  await window.snapmark.save({ png, caption: captionEl.value, notes: markers().map((m) => m.note) });
}

document.addEventListener('keydown', (e) => {
  if (e.metaKey && e.key === 'Enter') return void save();
  if (e.target instanceof HTMLTextAreaElement) {
    if (e.key === 'Escape') e.target.blur();
    return;
  }
  if (e.key === 'Escape') return window.close();
  if (e.metaKey && e.key === 'z') return undo();
  const g = Number(e.key) - 1;
  if (!e.metaKey && g >= 0 && g < GROUPS.length) pickGroup(g);
});

$<HTMLButtonElement>('undo').onclick = undo;
saveBtn.onclick = () => void save();
$<HTMLButtonElement>('cancel').onclick = () => window.close();

window.snapmark.init().then(({ src, session }) => {
  $('session').textContent = `→ ${session}`;
  img.onload = () => {
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    unit = Math.max(2, Math.round(Math.max(img.naturalWidth, img.naturalHeight) / 400));
    render();
  };
  img.src = src;
});
renderToolbar();
