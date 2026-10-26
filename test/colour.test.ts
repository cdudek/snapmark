import assert from 'assert';
// tools.ts is a classic script shared with the editor page, so it has no ES export to import.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { normalizeHex, withCustom, CUSTOM_MAX } = require('../src/tools') as {
  normalizeHex: (text: string) => string | null;
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

console.log('colour: ok');
