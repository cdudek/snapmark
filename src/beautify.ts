// One-shot mode's Beautify: the marked screenshot on a backdrop, with padding, rounded corners and a shadow, on a
// canvas of a chosen aspect ratio. Pure maths and data, so the editor's live preview and the copied image agree.
// Classic script (no import/export), like tools.ts: editor.html loads it before editor.js, and the tests require()
// it through the module.exports line at the end.
type Ratio = 'auto' | '4:3' | '3:2' | '16:9' | '1:1';
interface Beautify {
  padding: number; // 0–200, thousandths of the screenshot's long edge
  radius: number; // 0–50, the same unit
  shadow: number; // 0–100, the same unit (blur)
  backdrop: string; // a BACKDROPS id, 'none' (transparent), or a custom '#rrggbb'
  ratio: Ratio;
}

const DEFAULT_BEAUTY: Beautify = { padding: 64, radius: 12, shadow: 40, backdrop: 'cool', ratio: 'auto' };
const RATIOS: Ratio[] = ['auto', '4:3', '3:2', '16:9', '1:1'];

// The logo's gradients, brand colours from the annotation palette, and neutrals. One stop is a solid colour.
const BACKDROPS: { id: string; label: string; stops: string[] }[] = [
  { id: 'cool', label: 'Snapmark blue', stops: ['#20f4ec', '#2492ff', '#8b3dff'] },
  { id: 'pink', label: 'Pink', stops: ['#fa6cff', '#ef28a7'] },
  { id: 'dusk', label: 'Violet', stops: ['#8b3dff', '#ef28a7'] },
  { id: 'sea', label: 'Teal', stops: ['#12a594', '#05a2c2'] },
  { id: 'sun', label: 'Amber', stops: ['#ffb224', '#f76b15'] },
  { id: 'graphite', label: 'Graphite', stops: ['#4a4a52', '#2c2c31'] },
  { id: 'light', label: 'Soft light', stops: ['#f5f5f7', '#dcdce3'] },
  { id: 'white', label: 'White', stops: ['#ffffff'] },
];

// The colours a backdrop is drawn with: none for 'none', one for a solid or custom colour, two or more for a gradient.
function backdropStops(backdrop: string): string[] {
  if (backdrop.startsWith('#')) return [backdrop];
  return BACKDROPS.find((b) => b.id === backdrop)?.stops ?? [];
}

// The output canvas for a w × h screenshot: its size, where the screenshot sits, and the corner radius and shadow in
// output pixels. Sizes scale with the long edge, so a small crop and a Retina full screen look alike. A ratio widens or
// heightens the canvas around the padded screenshot, which stays centred: the padding grows to fill.
function beautyLayout(w: number, h: number, b: Beautify) {
  const s = Math.max(w, h) / 1000;
  const pad = Math.round(b.padding * s);
  let [width, height] = [w + 2 * pad, h + 2 * pad];
  if (b.ratio !== 'auto') {
    const [rw, rh] = b.ratio.split(':').map(Number);
    if (width * rh < height * rw) width = Math.round((height * rw) / rh);
    else height = Math.round((width * rh) / rw);
  }
  const blur = b.shadow * s;
  return { width, height, x: Math.round((width - w) / 2), y: Math.round((height - h) / 2), radius: b.radius * s, blur, offsetY: blur / 4 };
}

// CSS's "to bottom right" on a width × height box, as a canvas gradient line: the first and last colours land exactly
// on the top-left and bottom-right corners, so the copied image matches the preview.
function gradientLine(width: number, height: number): [number, number, number, number] {
  const n = Math.hypot(width, height);
  const d = (width * height) / n; // half the line's length
  const [ux, uy] = [height / n, width / n];
  const [cx, cy] = [width / 2, height / 2];
  return [cx - ux * d, cy - uy * d, cx + ux * d, cy + uy * d];
}

if (typeof module !== 'undefined') module.exports = { DEFAULT_BEAUTY, RATIOS, BACKDROPS, backdropStops, beautyLayout, gradientLine };
