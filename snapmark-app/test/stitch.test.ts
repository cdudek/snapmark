import assert from 'assert';
import { Bitmap, stitcher } from '../src/stitch';

// A tall synthetic page: rows of "text" (random dark blocks on white) with blank gaps, never repeating.
let seed = 7;
const rand = () => (seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31;
function page(width: number, height: number): Bitmap {
  const data = new Uint8Array(width * height * 4).fill(255);
  for (let y = 0; y < height; y += 24) {
    if (rand() < 0.25) continue; // a blank line
    for (let x = 8; x < width - 8; x += 6) {
      if (rand() < 0.3) continue;
      const shade = Math.floor(rand() * 160);
      for (let yy = y + 4; yy < Math.min(height, y + 18); yy++)
        for (let xx = x; xx < x + 5; xx++) data.fill(shade, (yy * width + xx) * 4, (yy * width + xx) * 4 + 3);
    }
  }
  return { width, height, data };
}
const rows = (b: Bitmap, from: number, to: number): Bitmap => ({
  width: b.width,
  height: to - from,
  data: b.data.slice(from * b.width * 4, to * b.width * 4),
});
const stack = (...parts: Bitmap[]): Bitmap => {
  const data = new Uint8Array(parts.reduce((n, p) => n + p.data.length, 0));
  let at = 0;
  for (const p of parts) {
    data.set(p.data, at);
    at += p.data.length;
  }
  return { width: parts[0].width, height: data.length / parts[0].width / 4, data };
};
const equal = (a: Bitmap, b: Bitmap) => a.width === b.width && a.height === b.height && Buffer.from(a.data).equals(Buffer.from(b.data));

// Scrolled by hand: uneven steps, a pause (the same view twice), then to the end of the page
const doc = page(300, 2000);
const H = 400;
const offsets = [0, 37, 180, 180, 330, 650, 980, 1300, 1600]; // every step leaves at least a tenth of the view overlapping
const plain = stitcher();
const steps = offsets.map((o) => plain.add(rows(doc, o, o + H)));
assert.deepStrictEqual(steps, ['added', 'added', 'added', 'same', 'added', 'added', 'added', 'added', 'added']);
assert.ok(equal(plain.result(), doc), 'the stitched image is the whole page, every row once');
assert.strictEqual(plain.frames, 8);

// A sticky header (60 rows) and footer (30 rows) stay put while the content between them scrolls: each once
const header = rows(page(300, 60), 0, 60);
const footer = rows(page(300, 30), 0, 30);
const content = page(300, 1500);
const sticky = stitcher();
const view = (o: number) => stack(header, rows(content, o, o + H - 90), footer);
for (const o of [0, 120, 250, 450, 650, 850, 1000, 1190]) assert.strictEqual(sticky.add(view(o)), 'added', `offset ${o}`);
assert.ok(equal(sticky.result(), stack(header, rows(content, 0, 1190 + H - 90), footer)), 'header and footer appear once');

// Scrolled further than the view at once: no overlap, so the frame is skipped; scrolling back a little recovers
const jump = stitcher();
jump.add(rows(doc, 0, H));
assert.strictEqual(jump.add(rows(doc, 900, 900 + H)), 'lost');
assert.strictEqual(jump.add(rows(doc, 300, 300 + H)), 'added');
assert.ok(equal(jump.result(), rows(doc, 0, 300 + H)));

// The height limit: stops there and takes nothing more
const capped = stitcher(1000);
assert.strictEqual(capped.add(rows(doc, 0, H)), 'added');
assert.strictEqual(capped.add(rows(doc, 350, 350 + H)), 'added');
assert.strictEqual(capped.add(rows(doc, 700, 700 + H)), 'full');
assert.strictEqual(capped.add(rows(doc, 900, 900 + H)), 'full');
assert.ok(equal(capped.result(), rows(doc, 0, 1000)));

// Frames of another size (the display changed) are refused, not stitched into a torn image
assert.throws(() => plain.add(rows(doc, 0, 10)), /differ in size/);

// Fast enough for a Retina frame between grabs
const big = page(2400, 4000);
const t = Date.now();
const fast = stitcher();
for (const o of [0, 300, 700]) fast.add(rows(big, o, o + 1600));
assert.strictEqual(fast.height, 2300);
const ms = Date.now() - t;
assert.ok(ms < 1500, `3 Retina frames took ${ms} ms`);

console.log(`stitch: ok (3 Retina frames in ${ms} ms)`);
