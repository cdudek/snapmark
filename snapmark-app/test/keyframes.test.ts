import assert from 'assert';
import { Bitmap } from '../src/stitch';
import { MAX_KEYS, evenlySpaced, gifTiming, keyFrames } from '../src/keyframes';

// A 256×144 frame, white, with the first `cells` 4×4 squares (row after row) painted in `shade`.
const W = 256;
const H = 144;
function frame(cells = 0, shade = 0, base = 255): Bitmap {
  const data = new Uint8Array(W * H * 4).fill(base);
  for (let c = 0; c < cells; c++) {
    const [cx, cy] = [(c % 64) * 4, Math.floor(c / 64) * 4];
    for (let y = cy; y < cy + 4; y++) data.fill(shade, (y * W + cx) * 4, (y * W + cx + 4) * 4);
  }
  return { width: W, height: H, data };
}
const run = (frames: Bitmap[], now?: () => number) => keyFrames(frames.length, (i) => frames[i], now && { now });

// @F69 The first frame, every frame that changed, and the settled last frame
const [a, b, c] = [frame(), frame(200), frame(200, 0, 0)];
const typed = run([a, a, a, b, b, frame(200, 0, 254), b, c, c]);
assert.deepStrictEqual(typed.keys, [0, 3, 7], '@F69 a repeated frame and a one-grey-level flicker are not key frames');
assert.strictEqual(typed.evenly, false);
assert.strictEqual(new Set(typed.hashes).size, 4, '@F69 identical frames share a hash, the flicker has its own');
assert.deepStrictEqual(run([a, a, b, b, c]).keys, [0, 2, 4], '@F69 a change in the last frame keeps it');
assert.deepStrictEqual(run([a, a, a, a]).keys, [0], '@F69 nothing changed: the first frame only, the last is the same picture');
assert.deepStrictEqual(run([a]).keys, [0]);

// @F69 At most 24: 180 frames that each change a little more, the threshold rises until 24 or fewer remain
const filling = Array.from({ length: 180 }, (_, k) => frame(k + 1));
const capped = run(filling);
assert.ok(capped.keys.length <= MAX_KEYS && capped.keys.length >= 20, `@F69 ${capped.keys.length} key frames of 180`);
assert.strictEqual(capped.keys[0], 0, '@F69 the first frame stays');
const gaps = capped.keys.slice(1).map((k, i) => k - capped.keys[i]);
assert.ok(Math.max(...gaps) - Math.min(...gaps) <= 1, `@F69 even change gives even gaps: ${gaps}`);
assert.ok(run(filling.slice(0, MAX_KEYS)).keys.length === MAX_KEYS, '@F69 24 changed frames all stay');

// @F77 Over 15 s finding key frames: up to 24 evenly spaced frames, the first and the last among them
let clock = 0;
const slow = run(
  Array.from({ length: 40 }, () => a),
  () => (clock += 1000),
);
assert.strictEqual(slow.evenly, true, '@F77 the slow path says so');
assert.strictEqual(slow.keys.length, MAX_KEYS, '@F77');
assert.deepStrictEqual([slow.keys[0], slow.keys[23]], [0, 39], '@F77 first and last');
assert.ok(
  slow.keys.every((k, i) => !i || k > slow.keys[i - 1]),
  '@F77 in order, no frame twice',
);
assert.deepStrictEqual(evenlySpaced(5), [0, 1, 2, 3, 4], '@F77 under 24 frames: all of them');
assert.deepStrictEqual(evenlySpaced(47), [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46]);
clock = 0;
assert.strictEqual(run([a, b, c], () => (clock += 1000)).evenly, false, '@F77 under 15 s: real key frames');

// @F70 The GIF merges identical frames in a row and sums their delays: each shows until the next different one
assert.deepStrictEqual(
  gifTiming([0, 0.1, 0.2, 0.3, 0.4, 0.5], 0.6, ['a', 'a', 'b', 'b', 'b', 'a']),
  [
    { frame: 0, delay: 0.2 },
    { frame: 2, delay: 0.3 },
    { frame: 5, delay: 0.1 },
  ],
  '@F70 runs merge; the same picture later is its own frame',
);
assert.deepStrictEqual(gifTiming([0, 0.5], 2, ['a', 'a']), [{ frame: 0, delay: 2 }], '@F70 the last frame shows until the end');
assert.strictEqual(gifTiming([0, 0.1], 0.2, [undefined, undefined]).length, 2, '@F70 frames never hashed are never merged');
// 2 s at 15 fps: GIF delays are whole hundredths, rounded on the clock so the total stays the real 2 s
const fps15 = gifTiming(
  Array.from({ length: 30 }, (_, i) => i / 15),
  2,
  Array.from({ length: 30 }, (_, i) => String(i)),
);
const total = fps15.reduce((s, f) => s + f.delay, 0);
assert.ok(Math.abs(total - 2) < 1e-9, `@F70 the GIF plays for ${total} s`);
assert.ok(
  fps15.every((f) => f.delay === 0.06 || f.delay === 0.07),
  '@F70 each frame about 1/15 s',
);
// The real recorder's frames: the hashes keyFrames found feed the GIF
assert.deepStrictEqual(
  gifTiming([0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8], 0.9, typed.hashes).map((f) => f.frame),
  [0, 3, 5, 6, 7],
);

console.log(`keyframes: ok (${capped.keys.length} key frames of 180)`);
