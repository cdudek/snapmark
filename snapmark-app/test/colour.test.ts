import assert from 'assert';
import fs from 'fs';
import path from 'path';
// tools.ts is a classic script shared with the editor page, so it has no ES export to import.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { normalizeHex, hexInput, withCustom, CUSTOM_MAX } = require('../src/tools') as {
  normalizeHex: (text: string) => string | null;
  hexInput: (text: string, pasted: boolean) => { text: string; colour: string | null };
  withCustom: (customs: string[], c: string, presets: string[]) => string[];
  CUSTOM_MAX: number;
};

// A15 hex with or without "#": both become #rrggbb
assert.strictEqual(normalizeHex('#e5484d'), '#e5484d');
assert.strictEqual(normalizeHex('e5484d'), '#e5484d');

// A15 any case: lower case, as <input type="color"> reports it
assert.strictEqual(normalizeHex('#E5484D'), '#e5484d');
assert.strictEqual(normalizeHex('3b82F6'), '#3b82f6');

// A15 3-digit shorthand doubles each digit
assert.strictEqual(normalizeHex('f0a'), '#ff00aa');
assert.strictEqual(normalizeHex('#ABC'), '#aabbcc');

// A15 spaces around a pasted code are trimmed
assert.strictEqual(normalizeHex('  #12AB9F \n'), '#12ab9f');
assert.strictEqual(normalizeHex('\t0f0 '), '#00ff00');

// A15 anything else is refused: wrong length, not hex, two "#", spaces inside, empty
for (const bad of ['', ' ', '#', 'e5484', '#e5484d0', 'zz1234', '##e5484d', 'e5 48 4d', 'rgb(1,2,3)', '#12345678', 'ggg'])
  assert.strictEqual(normalizeHex(bad), null, `"${bad}" is not a hex colour`);

// @F54 a paste drops its leading "#" at once and applies: the field reads "2492ff", with or without "#", any case, trimmed
assert.deepStrictEqual(hexInput('#2492ff', true), { text: '2492ff', colour: '#2492ff' });
assert.deepStrictEqual(hexInput('2492ff', true), { text: '2492ff', colour: '#2492ff' });
assert.deepStrictEqual(hexInput(' #2492FF \n', true), { text: '2492ff', colour: '#2492ff' });
assert.deepStrictEqual(hexInput('#f0a', true), { text: 'ff00aa', colour: '#ff00aa' });
// @F54 typing: a "#" goes at once; the colour applies at six good digits, never on the way there
assert.deepStrictEqual(hexInput('#', false), { text: '', colour: null });
assert.deepStrictEqual(hexInput('#e5', false), { text: 'e5', colour: null });
assert.deepStrictEqual(hexInput('f0a', false), { text: 'f0a', colour: null });
assert.deepStrictEqual(hexInput('e5484', false), { text: 'e5484', colour: null });
assert.deepStrictEqual(hexInput('E5484D', false), { text: 'E5484D', colour: '#e5484d' });
// @F56 a bad paste or bad typing applies nothing and is left for ↩ or blur to refuse
assert.deepStrictEqual(hexInput('#hello', true), { text: 'hello', colour: null });
assert.deepStrictEqual(hexInput('e5484z', false), { text: 'e5484z', colour: null });

// @F55 @F56 both hex fields, the annotation colour's and Beautify's beside Custom, say the same error (screens.md)
{
  const html = fs.readFileSync(path.join(__dirname, '../../src/editor.html'), 'utf8');
  for (const id of ['hex-error', 'backdrop-hex-error'])
    assert.ok(new RegExp(`<p id="${id}"[^>]*>Use 3 or 6 hex digits, like e5484d\\.</p>`).test(html), `#${id} says the hex error`);
  const ts = fs.readFileSync(path.join(__dirname, '../../src/editor.ts'), 'utf8');
  assert.strictEqual(ts.match(/= hexField\(/g)?.length, 2, 'both fields follow one set of rules');
}

// A16 Custom row: newest first, each colour once, never a preset, one row of five
{
  const presets = ['#e5484d', '#2492ff'];
  assert.strictEqual(CUSTOM_MAX, 5);
  assert.deepStrictEqual(withCustom([], '#123456', presets), ['#123456']);
  assert.deepStrictEqual(withCustom(['#111111', '#222222'], '#333333', presets), ['#333333', '#111111', '#222222']);
  assert.deepStrictEqual(withCustom(['#111111', '#222222'], '#222222', presets), ['#222222', '#111111']);
  const same = ['#111111'];
  assert.strictEqual(withCustom(same, '#e5484d', presets), same, 'a preset leaves the row as it is');
  const full = ['#000001', '#000002', '#000003', '#000004', '#000005'];
  assert.deepStrictEqual(withCustom(full, '#000006', presets), ['#000006', '#000001', '#000002', '#000003', '#000004']);
}

// @N1 selected text reaches 4.5:1 on its fill, light and dark: the chosen mode's and segment's --accent-text on
// --fill-selected, and Capture's white on --accent-fill, as bar.html defines the tokens (spec screens.md, Tokens)
{
  const css = fs.readFileSync(path.join(__dirname, '../../src/bar.html'), 'utf8');
  // [light, dark] of a token: `light-dark(#a, #b)`, or one colour for both
  const token = (name: string) => {
    const m = css.match(new RegExp(`--${name}:\\s*(?:light-dark\\((#\\w{6}),\\s*(#\\w{6})\\)|(#\\w{6}))`));
    assert.ok(m, `--${name} in bar.html`);
    return m[3] ? [m[3], m[3]] : [m[1], m[2]];
  };
  const lum = (hex: string) =>
    [1, 3, 5]
      .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
      .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
      .reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0);
  const contrast = (a: string, b: string) => (Math.max(lum(a), lum(b)) + 0.05) / (Math.min(lum(a), lum(b)) + 0.05);
  const [text, fill, blue] = [token('accent-text'), token('fill-selected'), token('accent-fill')];
  assert.deepStrictEqual(
    [text, fill, blue],
    [
      ['#0a62c2', '#6cb4ff'],
      ['#e5e5ea', '#3a3a3c'],
      ['#0f72db', '#0f72db'],
    ],
  );
  for (const [i, theme] of ['light', 'dark'].entries()) {
    assert.ok(contrast(text[i], fill[i]) >= 4.5, `@N1 ${theme}: the chosen text on its fill, ${contrast(text[i], fill[i]).toFixed(2)}:1`);
    assert.ok(contrast('#ffffff', blue[i]) >= 4.5, `@N1 ${theme}: Capture's text, ${contrast('#ffffff', blue[i]).toFixed(2)}:1`);
  }
}

console.log('colour: ok');
