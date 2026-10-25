import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { SHORTCUTS, KEY_GROUPS } from '../src/keys';

const root = path.join(__dirname, '../..');
const read = (f: string) => fs.readFileSync(path.join(root, f), 'utf8');
const srcFiles = fs.readdirSync(path.join(root, 'src')).map((f) => `src/${f}`);
const main = read('src/main.ts');

// F1 capture key: ⌃⇧4, like macOS's ⇧⌘4
assert.strictEqual(SHORTCUTS.capture, 'Control+Shift+4');
assert.ok(main.includes('SHORTCUTS.capture'), 'main.ts registers the capture key from SHORTCUTS');

// F2 unchanged keys: ⌃⇧3 Capture Last Area, ⌃⇧N New Session; ⌃⇧5 the capture options
assert.strictEqual(SHORTCUTS.area, 'Control+Shift+3');
assert.strictEqual(SHORTCUTS.newSession, 'Control+Shift+N');
assert.strictEqual(SHORTCUTS.options, 'Control+Shift+5');
for (const k of ['area', 'newSession', 'options']) assert.ok(main.includes(`SHORTCUTS.${k}`), `main.ts registers SHORTCUTS.${k}`);

// F5 freed keys: ⌃⇧1 is no longer Snapmark's, and macOS's own ⇧⌘3/4/5 never were
for (const f of srcFiles) {
  const s = read(f);
  assert.ok(!/Control\+Shift\+1\b/.test(s), `${f} names Control+Shift+1`);
  assert.ok(!/(Command|CommandOrControl|Cmd)\+Shift\+[345]\b/.test(s), `${f} registers a macOS screenshot key`);
}
assert.ok(!/['"]Control\+Shift\+\w['"]/.test(main), 'main.ts takes every global key from SHORTCUTS');

// F19 key list: three groups by where the key works, in the rows of spec/microcopy.md
assert.deepStrictEqual(
  KEY_GROUPS.map((g) => g.title),
  ['Anywhere', 'Editor', 'Session window'],
);
const keys = (title: string) => KEY_GROUPS.find((g) => g.title === title)!.rows.map(([k]) => k);
assert.deepStrictEqual(keys('Anywhere'), ['⌃⇧4', '⌃⇧3', '⌃⇧5', '⌃⇧N', '↩ / Esc']);
assert.deepStrictEqual(keys('Editor'), ['Esc', '⌫', '← ↑ → ↓', '⌘A', '⌘1–⌘7', '⌘Z', '⇧⌘Z', '⌘S / ⌘↵', '⌘C / ⇧⌘C', '⇧⌘S', '⌘W']);
assert.deepStrictEqual(keys('Session window'), ['← →', '↩', '⌘⌫', '⌘O', '⌘Z']);
for (const g of KEY_GROUPS) for (const r of g.rows) assert.strictEqual(r.length, 3, `${r[0]}: key, name, what`);
assert.ok(main.includes('KEY_GROUPS'), 'the Keyboard Shortcuts window renders KEY_GROUPS');

// F20 no old key: no screen, hint or doc still tells the owner to press ⌃⇧1
for (const f of [...srcFiles, 'README.md', 'docs/ux/setup.md']) assert.ok(!read(f).includes('⌃⇧1'), `${f} still names ⌃⇧1`);

console.log('keys: ok');
