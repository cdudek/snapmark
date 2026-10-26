import assert from 'assert';
import fs from 'fs';
import path from 'path';

// The interaction guide (docs/ux/interaction-guidelines.md): short, every rule tied to a Law of UX, accepted by the owner.
const root = path.join(__dirname, '../../..'); // the repo root, above snapmark-app/
const guide = fs.readFileSync(path.join(root, 'docs/ux/interaction-guidelines.md'), 'utf8');
const lines = guide.split('\n');

// The 30 laws on lawsofux.com, as the kit's laws-of-ux.md lists them.
const LAWS = [
  'Aesthetic-Usability Effect',
  'Choice Overload',
  'Chunking',
  'Cognitive Bias',
  'Cognitive Load',
  'Doherty Threshold',
  "Fitts's Law",
  'Flow',
  'Goal-Gradient Effect',
  "Hick's Law",
  "Jakob's Law",
  'Law of Common Region',
  'Law of Proximity',
  'Law of Prägnanz',
  'Law of Similarity',
  'Law of Uniform Connectedness',
  'Mental Model',
  "Miller's Law",
  "Occam's Razor",
  'Paradox of the Active User',
  'Pareto Principle',
  "Parkinson's Law",
  'Peak-End Rule',
  "Postel's Law",
  'Selective Attention',
  'Serial Position Effect',
  "Tesler's Law",
  'Von Restorff Effect',
  'Working Memory',
  'Zeigarnik Effect',
];

// F1 the guide has its sections and fits 400 lines
assert.ok(lines.length <= 400, `the guide is ${lines.length} lines`);
assert.ok(guide.includes('\n## 1. How Snapmark should feel\n'), 'How Snapmark should feel');
assert.ok(guide.includes('\n## 3. Exceptions\n'), 'Exceptions');
for (const area of ['Capture', 'Editing', 'Notes', 'Keys', 'Feedback', 'Windows', 'Words', 'Accessibility'])
  assert.ok(guide.includes(`\n### ${area}\n`), `rules for ${area}`);

// F2 every rule has an id, a status and a law
const rules = [
  ...guide.split('\n## 3. Exceptions')[0].matchAll(/^- \*\*([A-Z]{3}-\d+) \((accepted|proposed)\)\.\*\*.*\n {2}- \*\*Why:\*\* ([^.]+)\./gm),
];
const heads = guide.split('\n## 3. Exceptions')[0].match(/^- \*\*[A-Z]{3}-\d+ /gm) ?? [];
assert.ok(rules.length >= 40 && rules.length === heads.length, `${heads.length} rules, ${rules.length} with a status and a why`);
for (const [, id, , law] of rules) assert.ok(LAWS.includes(law), `${id}: "${law}" is not a Law of UX`);

// F3 accepted rules match decisions.json guideAccepted
const changes = path.join(root, 'changes');
const folder = [path.join(changes, '2026-10-26-interaction-guide-polish')]
  .concat(
    fs.existsSync(path.join(changes, 'archive'))
      ? fs.readdirSync(path.join(changes, 'archive'), { recursive: true, encoding: 'utf8' }).map((f) => path.join(changes, 'archive', f))
      : [],
  )
  .find((f) => f.endsWith('2026-10-26-interaction-guide-polish') && fs.existsSync(path.join(f, 'decisions.json')))!;
const accepted: string[] = JSON.parse(fs.readFileSync(path.join(folder, 'decisions.json'), 'utf8')).guideAccepted;
// The rules change 2026-10-26-picked-designs added; the owner accepted them at its plan gate (@F33).
const picked = ['CAP-12', 'CAP-13', 'REC-1', 'REC-2', 'KEY-7', 'ACC-6'];
accepted.push(...picked);
const marked = [...guide.matchAll(/^- \*\*((?:[A-Z]{3}|EX)-\d+) \((accepted|proposed)\)/gm)];
assert.deepStrictEqual(
  marked.filter((m) => m[2] === 'accepted').map((m) => m[1]),
  marked.map((m) => m[1]).filter((id) => accepted.includes(id)),
  'a rule reads accepted exactly when the owner accepted it',
);
assert.ok(
  accepted.every((id) => marked.some((m) => m[1] === id)),
  'every accepted id is in the guide',
);

const rule = (id: string) => lines.find((l) => l.startsWith(`- **${id} (`)) ?? '';

// @F33 the guide holds CAP-12, CAP-13, REC-1, REC-2, KEY-7 and ACC-6 as accepted rules, worded as spec/conformance.md
const worded: Record<string, string> = {
  'CAP-12': 'Esc is taken from every app while the bar or a countdown is open, and only then. A recording takes no plain key.',
  'CAP-13': 'The capture bar is a key, non-activating panel: its keys never reach the app behind.',
  'REC-1':
    'A recording keeps the first, every changed and the settled last frame, at most 24, plus marked frames; the GIF keeps real timing.',
  'REC-2': 'A mark belongs to the frame where it starts and is clipped to it.',
  'KEY-7': 'New editor keys use ⌘ chords, never a plain ⌥ letter, which types a character.',
  'ACC-6': 'Every status line in a capture panel, and every inline error, is a polite live region.',
};
for (const id of picked) assert.strictEqual(rule(id), `- **${id} (accepted).** ${worded[id]}`, `${id} reads accepted, as worded`);
assert.ok(guide.includes('\n### Recording\n\n- **REC-1'), 'REC rules in a Recording section');

// @F34 KEY-1, CAP-1, CAP-3, CAP-9, CAP-10, WIN-2, WIN-4, EX-7 and EX-10 state this change's keys and bar
const states: Record<string, string[]> = {
  'KEY-1': ['⌃⇧1 Capture New Area…', '⌃⇧2 Capture One-Shot…', '⌃⇧3 Capture Full Screen', '⌃⇧4 Capture Last Area', '⌃⇧5 capture bar', '⌃⇧N'],
  'CAP-1': ['⌃⇧1 to ⌃⇧5'],
  'CAP-3': ['keys 1–6', '1 New Area, 2 Window, 3 Full Screen, 4 Last Area, 5 Scrolling, 6 Record'],
  'CAP-9': ['scrolls the area by itself', 'falls back to your own scrolling', 'ⓧ'],
  'CAP-10': ['overlay', '⌃⇧1–⌃⇧4 and ⌃⇧N do nothing'],
  'WIN-2': ['name and key under its icon', 'draws no hover label'],
  'WIN-4': ['CAP-12'],
  'EX-7': ['take Esc from every app'],
  'EX-10': ["⌃⇧2 uses macOS's own capture overlay"],
};
for (const [id, words] of Object.entries(states)) for (const w of words) assert.ok(rule(id).includes(w), `${id} states "${w}"`);
assert.ok(!/⌃⇧3 (captures the )?last area|⌃⇧4 capture,/.test(guide), 'no rule keeps the old ⌃⇧3 and ⌃⇧4');

// @F35 docs/designs holds the amended keys and capture-bar ADRs and a new recording ADR, listed in INDEX.md
const designs = path.join(root, 'docs/designs');
const adr = (id: string) => fs.readFileSync(path.join(designs, `${id}.md`), 'utf8');
const NEW = '2026-10-26-adr-recording-key-frames';
const keysAdr = adr('2026-10-25-adr-keys-follow-macos');
const barAdr = adr('2026-10-25-adr-capture-bar-and-settings-window');
const recAdr = adr(NEW);
for (const k of [
  '⌃⇧1 Capture New Area…',
  '⌃⇧2 Capture One-Shot…',
  '⌃⇧3 Capture Full Screen',
  '⌃⇧4 Capture Last Area',
  '⌃⇧5 opens the capture bar',
])
  assert.ok(keysAdr.includes(k), `keys ADR lists ${k}`);
for (const a of [keysAdr, barAdr]) assert.match(a, new RegExp(`^amended_by: \\[.*${NEW}.*\\]$`, 'm'), 'amended by the recording ADR');
assert.ok(barAdr.includes('3. **Buttons choose what to capture; a Session | One-Shot segmented control'), 'bar ADR decision 3');
assert.ok(barAdr.includes('6. **Full Screen and Record join the bar'), 'bar ADR decision 6');
assert.ok(barAdr.includes('11. **The bar names each mode under its icon') && barAdr.includes('`tip.html`) goes'), 'bar ADR decision 11');
assert.match(recAdr, /^status: accepted$/m, 'recording ADR accepted');
for (const w of ['Record', 'key frames', 'filmstrip', 'GIF', '30 s', 'Keys while recording'])
  assert.ok(recAdr.includes(w), `recording ADR covers ${w}`);
assert.ok(fs.readFileSync(path.join(designs, 'INDEX.md'), 'utf8').includes(`](${NEW}.md)`), 'INDEX.md lists the recording ADR');

console.log(`guide: ok (${rules.length} rules, ${accepted.length} accepted)`);
