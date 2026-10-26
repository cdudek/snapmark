import assert from 'assert';
import fs from 'fs';
import path from 'path';

// The interaction guide (docs/ux/interaction-guidelines.md): short, every rule tied to a Law of UX, accepted by the owner.
const root = path.join(__dirname, '../..');
const guide = fs.readFileSync(path.join(root, 'docs/ux/interaction-guidelines.md'), 'utf8');
const lines = guide.split('\n');

// The 30 laws on lawsofux.com, as the kit's laws-of-ux.md lists them.
const LAWS = [
  'Aesthetic-Usability Effect', 'Choice Overload', 'Chunking', 'Cognitive Bias', 'Cognitive Load', 'Doherty Threshold',
  "Fitts's Law", 'Flow', 'Goal-Gradient Effect', "Hick's Law", "Jakob's Law", 'Law of Common Region', 'Law of Proximity',
  'Law of Prägnanz', 'Law of Similarity', 'Law of Uniform Connectedness', 'Mental Model', "Miller's Law", "Occam's Razor",
  'Paradox of the Active User', 'Pareto Principle', "Parkinson's Law", 'Peak-End Rule', "Postel's Law", 'Selective Attention',
  'Serial Position Effect', "Tesler's Law", 'Von Restorff Effect', 'Working Memory', 'Zeigarnik Effect',
];

// F1 the guide has its sections and fits 400 lines
assert.ok(lines.length <= 400, `the guide is ${lines.length} lines`);
assert.ok(guide.includes('\n## 1. How Snapmark should feel\n'), 'How Snapmark should feel');
assert.ok(guide.includes('\n## 3. Exceptions\n'), 'Exceptions');
for (const area of ['Capture', 'Editing', 'Notes', 'Keys', 'Feedback', 'Windows', 'Words', 'Accessibility'])
  assert.ok(guide.includes(`\n### ${area}\n`), `rules for ${area}`);

// F2 every rule has an id, a status and a law
const rules = [...guide.split('\n## 3. Exceptions')[0].matchAll(/^- \*\*([A-Z]{3}-\d+) \((accepted|proposed)\)\.\*\*.*\n {2}- \*\*Why:\*\* ([^.]+)\./gm)];
const heads = guide.split('\n## 3. Exceptions')[0].match(/^- \*\*[A-Z]{3}-\d+ /gm) ?? [];
assert.ok(rules.length >= 40 && rules.length === heads.length, `${heads.length} rules, ${rules.length} with a status and a why`);
for (const [, id, , law] of rules) assert.ok(LAWS.includes(law), `${id}: "${law}" is not a Law of UX`);

// F3 accepted rules match decisions.json guideAccepted
const changes = path.join(root, 'changes');
const folder = [path.join(changes, '2026-10-26-interaction-guide-polish')]
  .concat(fs.existsSync(path.join(changes, 'archive')) ? fs.readdirSync(path.join(changes, 'archive'), { recursive: true, encoding: 'utf8' }).map((f) => path.join(changes, 'archive', f)) : [])
  .find((f) => f.endsWith('2026-10-26-interaction-guide-polish') && fs.existsSync(path.join(f, 'decisions.json')))!;
const accepted: string[] = JSON.parse(fs.readFileSync(path.join(folder, 'decisions.json'), 'utf8')).guideAccepted;
const marked = [...guide.matchAll(/^- \*\*((?:[A-Z]{3}|EX)-\d+) \((accepted|proposed)\)/gm)];
assert.deepStrictEqual(
  marked.filter((m) => m[2] === 'accepted').map((m) => m[1]),
  marked.map((m) => m[1]).filter((id) => accepted.includes(id)),
  'a rule reads accepted exactly when the owner accepted it',
);
assert.ok(accepted.every((id) => marked.some((m) => m[1] === id)), 'every accepted id is in the guide');

console.log(`guide: ok (${rules.length} rules, ${accepted.length} accepted)`);
