// A tall screenshot is saved as one image at the part width plus overlapping parts, each within Claude's limits, so
// the agent reads the page at about its captured width (ADR: tall screenshots saved as parts). No Electron: tested in
// plain Node, like stitch.ts.

// Claude resizes images above 1568 px on the long edge or ~1.15 megapixels, so anything larger only costs upload time
// and disk. Retina captures are 2x, so most crops land here.
export const MAX_EDGE = 1568;
export const MAX_PIXELS = 1_150_000;
export const PART_WIDTH = 1280;
export const MAX_PARTS = 99; // part files have two digits: 01.png … 99.png

// The scale that fits an image whole within both limits; 1 when it already fits.
export const fitScale = (width: number, height: number) =>
  Math.min(1, MAX_EDGE / Math.max(width, height), Math.sqrt(MAX_PIXELS / (width * height)));

export interface Layout {
  width: number; // the part width: the image is scaled to it first
  height: number; // the image's height at that width
  parts: { y: number; height: number }[]; // top to bottom, at that width
}

// Null when fitting the image whole leaves it at least two-thirds as wide as its parts: it is not tall, and is saved
// as before. Otherwise the fewest parts of one height that cover it, each beginning `overlap` above the end of the part
// before (more where the last one is pushed up to end at the bottom edge).
export function partLayout(width: number, height: number): Layout | null {
  const partWidth = Math.min(width, PART_WIDTH);
  if (width * fitScale(width, height) >= (2 / 3) * partWidth) return null;
  const h = Math.round((height * partWidth) / width);
  const overlap = Math.max(40, Math.round(partWidth / 10)); // taller than a numbered diamond (8 % of the width)
  const most = Math.min(MAX_EDGE, Math.floor(MAX_PIXELS / partWidth));
  const n = Math.ceil((h - overlap) / (most - overlap));
  if (n > MAX_PARTS) throw new Error(`A ${width} × ${height} screenshot would make ${n} parts; at most ${MAX_PARTS} are allowed`);
  const each = Math.ceil((h + (n - 1) * overlap) / n);
  const parts = Array.from({ length: n }, (_, i) => ({ y: i === n - 1 ? h - each : i * (each - overlap), height: each }));
  return { width: partWidth, height: h, parts };
}
