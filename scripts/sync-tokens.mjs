#!/usr/bin/env node
// Builds snapmark-app/src/tokens.css from design-system-starter at a pinned commit and Snapmark's design/product.json,
// and records the commit and the file's sha256 in design/tokens.lock.json (test/style.test.ts checks both, F1 F2).
// To take a newer system: bump COMMIT, run `npm run tokens`, commit the three files. Needs git and Node only.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = 'https://github.com/cdudek/design-system-starter';
const COMMIT = '3048d42';

const app = join(dirname(fileURLToPath(import.meta.url)), '..', 'snapmark-app');
const tmp = mkdtempSync(join(tmpdir(), 'design-system-starter-'));
const run = (cmd, args) => execFileSync(cmd, args, { cwd: tmp, stdio: ['ignore', 'ignore', 'inherit'] });
try {
  run('git', ['clone', '--quiet', `${REPO}.git`, '.']);
  run('git', ['checkout', '--quiet', COMMIT]);
  // The starter's own CLI; it writes only into its dist/, inside the temp clone.
  run('node', ['scripts/build-tokens.mjs', '--product', join(app, 'design', 'product.json')]);
  const css = `/* ${REPO} at ${COMMIT}, built by scripts/sync-tokens.mjs from snapmark-app/design/product.json */\n${readFileSync(join(tmp, 'dist', 'tokens.css'), 'utf8')}`;
  writeFileSync(join(app, 'src', 'tokens.css'), css);
  const sha256 = createHash('sha256').update(css).digest('hex');
  writeFileSync(join(app, 'design', 'tokens.lock.json'), JSON.stringify({ repo: REPO, commit: COMMIT, sha256 }, null, 2) + '\n');
  console.log(`tokens.css: ${REPO} at ${COMMIT}, sha256 ${sha256}`);
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
