import assert from 'assert';
import { recognize, toPixels } from '../src/ocr';

// Vision's normalised boxes from the bottom left become pixels from the top left
const [line] = toPixels({
  width: '1000',
  height: '500',
  lines: [{ text: 'Hi you', box: [0.1, 0.8, 0.2, 0.1], words: [{ start: 3, end: 6, box: [0.2, 0.8, 0.1, 0.1] }] }],
});
assert.deepStrictEqual(
  {
    ...line,
    y: Math.round(line.y),
    h: Math.round(line.h),
    words: line.words.map((w) => ({ ...w, y: Math.round(w.y), h: Math.round(w.h) })),
  },
  { text: 'Hi you', x: 100, y: 50, w: 200, h: 50, words: [{ start: 3, end: 6, x: 200, y: 50, w: 100, h: 50 }] },
);

// No Vision off macOS: nothing, and no error
if (process.platform !== 'darwin') void recognize('/nope.png').then((r) => assert.strictEqual(r, null));

console.log('ocr: ok');
