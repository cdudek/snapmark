import assert from 'assert';
import { ocrText, OcrLine, recognize, toPixels } from '../src/ocr';

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

// A line with a box per word, laid out left to right from x
const at = (text: string, x: number, y: number, h = 20): OcrLine => {
  const words = [...text.matchAll(/\S+/g)].map((m) => ({
    start: m.index,
    end: m.index + m[0].length,
    x: x + m.index * 10,
    y,
    w: m[0].length * 10,
    h,
  }));
  return { text, x, y, w: text.length * 10, h, words };
};

// Reading order: rows top to bottom, each left to right, whatever order Vision gave them in
const lines = [at('Right column', 400, 202), at('Footer', 20, 400), at('Account settings', 20, 40), at('Left column', 20, 200, 24)];
assert.strictEqual(ocrText(lines), 'Account settings\nLeft column  Right column\nFooter');

// Words under a Redact mark become [redacted], once for a run of them
const card = at('Card 4242 4242 4242 4242 expires 12/28', 20, 100);
const over = { x: 65, y: 95, w: 200, h: 30 }; // the four groups of digits
assert.strictEqual(ocrText([card], [over]), 'Card [redacted] expires 12/28');
assert.strictEqual(ocrText([card], [{ x: 20, y: 100, w: 4, h: 20 }]), 'Card 4242 4242 4242 4242 expires 12/28'); // a sliver of "Card"
assert.strictEqual(ocrText([at('mail me@example.com', 20, 0)], [{ x: 60, y: 0, w: 200, h: 20 }]), 'mail [redacted]');

// Capped, with an ellipsis; empty when there is no text
assert.strictEqual(ocrText([at('x'.repeat(2500), 0, 0)]), `${'x'.repeat(2000)}…`);
assert.strictEqual(ocrText([at('abc def', 0, 0)], [], 4), 'abc…');
assert.strictEqual(ocrText([]), '');

// No Vision off macOS: nothing, and no error
if (process.platform !== 'darwin') void recognize('/nope.png').then((r) => assert.strictEqual(r, null));

console.log('ocr: ok');
