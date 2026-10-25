import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { MAX_EDGE, MAX_PIXELS, PART_WIDTH, partLayout } from '../src/parts';
import { MAX_HEIGHT } from '../src/stitch';

// The two tables in spec/ia.md: width, height, and the parts it makes (0 = not tall, saved as before).
const ROWS: [number, number, number][] = [
  [1280, 8000, 11],
  [2560, 16_000, 11],
  [2560, 1600, 0],
  [1000, 1200, 0],
  [600, 1600, 0],
  [900, 1700, 0],
  [2560, 3200, 0],
  [2560, 4000, 0],
  [2160, 3840, 3],
  [600, 3000, 2],
  [2560, 20_000, 13],
  [1280, 20_000, 26],
  [4000, 1000, 0],
];
const overlapAt = (w: number) => Math.max(40, w / 10);

// F2 part size: the screenshot's width, at most 1280 px, within 1568 px and 1,150,000 pixels
for (const [w, h] of ROWS) {
  const l = partLayout(w, h);
  if (!l) continue;
  assert.strictEqual(l.width, Math.min(w, PART_WIDTH), `F2 part width of ${w} × ${h}`);
  for (const p of l.parts) {
    assert.ok(p.height <= MAX_EDGE, `F2 part height of ${w} × ${h}`);
    assert.ok(l.width * p.height <= MAX_PIXELS, `F2 part pixels of ${w} × ${h}`);
  }
}

// F3 tall rule: tall only when fitting it whole leaves it narrower than two-thirds of its part width
for (const [w, h, n] of ROWS) assert.strictEqual(partLayout(w, h)?.parts.length ?? 0, n, `F3 ${w} × ${h}`);
assert.strictEqual(partLayout(2560, 4000), null, 'F3 scenario: 858 ≥ 853, saved whole');
assert.strictEqual(partLayout(2160, 3840)?.parts.length, 3, 'F3 scenario: 804 < 853, 3 parts');

// F4 overlap: each part after the first begins max(40 px, part width ÷ 10) above the end of the part before;
// the parts are one height and the last ends at the bottom edge
for (const [w, h, want] of [
  [1280, 8000, 128],
  [600, 3000, 60],
  [300, 3000, 40],
]) {
  const l = partLayout(w, h)!;
  assert.ok(l, `F4 ${w} × ${h} is tall`);
  assert.strictEqual(overlapAt(l.width), want, `F4 overlap at ${l.width}`);
  l.parts.forEach((p, i) => {
    assert.strictEqual(p.height, l.parts[0].height, `F4 one height, ${w} × ${h}`);
    if (!i) return assert.strictEqual(p.y, 0, 'F4 the first begins at the top');
    const before = l.parts[i - 1];
    const over = before.y + before.height - p.y;
    if (i < l.parts.length - 1) assert.strictEqual(over, want, `F4 overlap of part ${i + 1}, ${w} × ${h}`);
    else assert.ok(over >= want, `F4 the last overlaps at least as much, ${w} × ${h}`);
  });
  const last = l.parts.at(-1)!;
  assert.strictEqual(last.y + last.height, l.height, `F4 the last ends at the bottom edge, ${w} × ${h}`);
}

// F5 diamond whole: for capture widths 200 to 5120 px, the overlap is taller than a numbered diamond (16 × unit, unit
// as the editor sets it for a tall image), measured at the part width
const editor = fs.readFileSync(path.join(__dirname, '../../src/editor.ts'), 'utf8');
assert.ok(
  editor.includes('unit = Math.max(2, Math.round(Math.max(background.width, Math.min(background.height, 2 * background.width)) / 400));'),
  'F5 the editor still sizes marks this way; update the formula below with it',
);
for (let w = 200; w <= 5120; w++) {
  const unit = Math.max(2, Math.round((2 * w) / 400)); // a tall image: min(height, 2 × width) is 2 × width
  const l = partLayout(w, 20 * w)!; // 20 × w is tall at every width here, and keeps min(height, 2 × width) = 2 × width
  const overlap = l.parts[0].y + l.parts[0].height - l.parts[1].y; // the overlap partLayout makes
  const diamond = (16 * unit * l.width) / w;
  assert.ok(overlap > diamond, `F5 at ${w} px: overlap ${overlap} > diamond ${diamond}`);
}

// F10 1280×8000: 11 parts of 1280 × 844
const f10 = partLayout(1280, 8000)!;
assert.deepStrictEqual(
  [f10.width, f10.height, f10.parts.length, ...new Set(f10.parts.map((p) => p.height))],
  [1280, 8000, 11, 844],
  'F10 1280×8000',
);
assert.ok(f10.width >= 1000, 'F10 every part at least 1000 px wide');

// N2 at most 99 parts: the tallest scrolling capture makes 26; a layout of more than 99 throws
assert.strictEqual(partLayout(1280, MAX_HEIGHT)!.parts.length, 26, 'N2 1280 × MAX_HEIGHT');
assert.throws(() => partLayout(1280, 80_000), /at most 99/, 'N2 more than 99 parts throws');

console.log('parts: ok');
