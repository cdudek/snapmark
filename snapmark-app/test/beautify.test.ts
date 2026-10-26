import assert from 'assert';
// beautify.ts is a classic script shared with the editor page, so it has no ES export to import.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { DEFAULT_BEAUTY, RATIOS, BACKDROPS, backdropStops, beautyLayout, gradientLine } = require('../src/beautify') as {
  DEFAULT_BEAUTY: Beautify;
  RATIOS: Ratio[];
  BACKDROPS: { id: string; stops: string[] }[];
  backdropStops: typeof globalThis.backdropStops;
  beautyLayout: typeof globalThis.beautyLayout;
  gradientLine: typeof globalThis.gradientLine;
};
const b = (over: Partial<Beautify> = {}): Beautify => ({ ...DEFAULT_BEAUTY, ...over });

// Auto: padding all round, in thousandths of the long edge (64 on a 2000 px image is 128 px)
assert.deepStrictEqual(beautyLayout(2000, 1000, b({ padding: 64, radius: 12, shadow: 40 })), {
  width: 2256,
  height: 1256,
  x: 128,
  y: 128,
  radius: 24,
  blur: 80,
  offsetY: 20,
});
// No padding, no ratio: the screenshot alone
assert.deepStrictEqual(
  [beautyLayout(800, 600, b({ padding: 0 }))].map(({ width, height, x, y }) => [width, height, x, y])[0],
  [800, 600, 0, 0],
);

// A ratio widens or heightens the padded canvas to fit, and the screenshot stays centred
const at = (w: number, h: number, ratio: Ratio, padding = 50) => {
  const { width, height, x, y } = beautyLayout(w, h, b({ ratio, padding }));
  return [width, height, x, y];
};
assert.deepStrictEqual(at(1000, 1000, '16:9'), [1956, 1100, 478, 50], '16:9 on a square: wider, padding grows sideways');
assert.deepStrictEqual(at(2000, 500, '16:9'), [2200, 1238, 100, 369], '16:9 on a wide strip: taller');
assert.deepStrictEqual(at(1000, 600, '1:1'), [1100, 1100, 50, 250]);
assert.deepStrictEqual(at(1000, 1000, '4:3'), [1467, 1100, 234, 50]);
assert.deepStrictEqual(at(900, 600, '3:2', 0), [900, 600, 0, 0], 'already 3:2: nothing added');
for (const r of RATIOS.filter((x) => x !== 'auto')) {
  const [rw, rh] = r.split(':').map(Number);
  for (const [w, h] of [
    [1234, 567],
    [400, 1600],
    [3456, 2234],
  ]) {
    const [width, height, x, y] = at(w, h, r);
    assert.ok(Math.abs(width / height - rw / rh) < 0.002, `${r} on ${w}×${h}`);
    const pad = Math.round((50 * Math.max(w, h)) / 1000);
    assert.ok(x >= pad && y >= pad && x + w <= width && y + h <= height, `${r} on ${w}×${h} fits`);
    assert.ok(Math.abs(width - w - 2 * x) <= 1 && Math.abs(height - h - 2 * y) <= 1, `${r} on ${w}×${h} centred`);
  }
}

// Backdrops: gradients, solids, a custom colour, none
assert.deepStrictEqual(backdropStops('cool'), ['#20f4ec', '#2492ff', '#8b3dff'], "the logo's gradient");
assert.deepStrictEqual(backdropStops('#123456'), ['#123456']);
assert.deepStrictEqual(backdropStops('none'), []);
assert.ok(BACKDROPS.length >= 6 && BACKDROPS.length <= 8);

// The gradient line runs corner to corner like CSS "to bottom right": on a square, exactly the diagonal; on any box,
// the top-left and bottom-right corners lie on its end lines
assert.deepStrictEqual(gradientLine(100, 100).map(Math.round), [0, 0, 100, 100]);
const [x0, y0, x1, y1] = gradientLine(300, 100);
const along = (px: number, py: number) => ((px - x0) * (x1 - x0) + (py - y0) * (y1 - y0)) / ((x1 - x0) ** 2 + (y1 - y0) ** 2);
assert.ok(Math.abs(along(0, 0)) < 1e-9 && Math.abs(along(300, 100) - 1) < 1e-9 && Math.abs(along(150, 50) - 0.5) < 1e-9);
assert.ok(Math.abs(along(300, 0) - 0.5) < 1e-9, 'the other two corners sit halfway');

console.log('beautify: ok');
