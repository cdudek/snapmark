// Capture Scrolling: stitches frames of one screen area, grabbed while the owner scrolls, into one tall image.
// Plain pixels in and out, no Electron, so test/stitch.test.ts checks it in plain Node.

export interface Bitmap {
  width: number;
  height: number;
  data: Uint8Array; // 4 bytes per pixel, row after row; the channel order (RGBA or BGRA) passes through unchanged
}

// What one frame did: 'added' new rows, the 'same' view as before, 'lost' (no overlap with the last frame, e.g. scrolled
// too far at once, or up), or 'full': the image reached its height limit and takes no more.
export type Step = 'added' | 'same' | 'lost' | 'full';

export const MAX_HEIGHT = 20_000; // pixels; Chromium's canvas holds up to 32 767 a side, and the editor keeps two of them

const BINS = 64; // a row is compared as 64 grey means, each over a strip of columns: blind to single-pixel noise
const TOL = 8; // grey levels a bin may differ by and the row still counts as the same

// Each row as BINS grey means.
function profile({ width, height, data }: Bitmap): Float32Array {
  const out = new Float32Array(height * BINS);
  const bin = new Uint16Array(width).map((_, x) => Math.floor((x * BINS) / width));
  const per = new Float32Array(BINS);
  for (const b of bin) per[b]++;
  for (let y = 0, i = 0; y < height; y++)
    for (let x = 0; x < width; x++, i += 4) out[y * BINS + bin[x]] += data[i] + data[i + 1] + data[i + 2];
  for (let y = 0; y < height; y++) for (let b = 0; b < BINS; b++) if (per[b]) out[y * BINS + b] /= 3 * per[b];
  return out;
}

// Row i of a against row j of b: the mean and the largest grey difference over the bins.
function rowDiff(a: Float32Array, i: number, b: Float32Array, j: number): [mean: number, max: number] {
  let [sum, max] = [0, 0];
  for (let k = 0; k < BINS; k++) {
    const d = Math.abs(a[i * BINS + k] - b[j * BINS + k]);
    sum += d;
    if (d > max) max = d;
  }
  return [sum / BINS, max];
}
const sameRow = (a: Float32Array, i: number, b: Float32Array, j: number) => rowDiff(a, i, b, j)[1] <= TOL;

// How far the content moved up from `prev` to `cur`: new row y shows old row y + dy, for the rows between the fixed
// bands (`top` rows that stayed put above, `bottom` below). The shift with the smallest mean difference wins, the
// smaller shift on a tie; it must leave a tenth of the moving rows overlapping, of which 1% at most may differ.
function shift(cur: Float32Array, prev: Float32Array, height: number, top: number, bottom: number): number | null {
  const moving = height - top - bottom;
  const minOverlap = Math.max(8, Math.ceil(moving / 10));
  let [best, bestScore] = [0, Infinity];
  for (let dy = 1; moving - dy >= minOverlap; dy++) {
    const n = moving - dy;
    let [sum, off] = [0, 0];
    let y = top;
    for (; y < top + n; y++) {
      const [mean, max] = rowDiff(cur, y, prev, y + dy);
      sum += mean;
      if (max > TOL) off++;
      if (sum >= bestScore * n || off > n / 100) break; // cannot win any more
    }
    if (y === top + n) [best, bestScore] = [dy, sum / n];
  }
  return best || null;
}

export function stitcher(maxHeight = MAX_HEIGHT) {
  let width = 0;
  let frameHeight = 0;
  let prev: Float32Array | null = null; // the last frame that was added; the stitched image ends with its rows
  const chunks: Uint8Array[] = []; // the stitched rows, in runs copied from the frames
  let height = 0;
  let frames = 0;
  const stride = () => width * 4;

  const append = (f: Bitmap, from: number, to: number) => {
    to = Math.min(to, from + maxHeight - height);
    chunks.push(f.data.slice(from * stride(), to * stride()));
    height += to - from;
  };
  // Drops the last n rows: the fixed band at the bottom, which the next frame brings again below the new rows.
  const trim = (n: number) => {
    height -= n;
    while (n > 0) {
      const rows = chunks[chunks.length - 1].length / stride();
      if (rows <= n) chunks.pop();
      else chunks[chunks.length - 1] = chunks[chunks.length - 1].subarray(0, (rows - n) * stride());
      n -= rows;
    }
  };

  function add(f: Bitmap): Step {
    if (height >= maxHeight) return 'full';
    const cur = profile(f);
    if (!prev) {
      [width, frameHeight] = [f.width, f.height];
      append(f, 0, f.height);
    } else {
      if (f.width !== width || f.height !== frameHeight) throw new Error('The frames differ in size.');
      let top = 0;
      while (top < frameHeight && sameRow(cur, top, prev, top)) top++;
      if (top === frameHeight) return 'same';
      // Rows that did not move at the top (a sticky header) are already in from the first frame; rows that did not
      // move at the bottom (a sticky footer) are the image's last rows, and move down below what scrolled in.
      let bottom = 0;
      while (sameRow(cur, frameHeight - 1 - bottom, prev, frameHeight - 1 - bottom)) bottom++;
      const dy = shift(cur, prev, frameHeight, top, bottom);
      if (!dy) return 'lost';
      trim(bottom);
      append(f, frameHeight - bottom - dy, frameHeight);
    }
    prev = cur;
    frames++;
    return height >= maxHeight ? 'full' : 'added';
  }

  function result(): Bitmap {
    const data = new Uint8Array(height * stride());
    let at = 0;
    for (const c of chunks) {
      data.set(c, at);
      at += c.length;
    }
    return { width, height, data };
  }

  return {
    add,
    result,
    get height() {
      return height;
    },
    get frames() {
      return frames;
    },
  };
}
