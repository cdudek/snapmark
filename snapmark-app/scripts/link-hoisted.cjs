// editor.html loads Fabric from ../../node_modules relative to dist/src/, which is right inside the
// packaged app.asar. npm workspaces hoist fabric to the repo root, so in development the build links it
// back into snapmark-app/node_modules/. The packaged app is unchanged: electron-builder packs from the lockfile.
/* eslint-disable @typescript-eslint/no-require-imports */
/* global require, __dirname */
const fs = require('fs');
const path = require('path');

const target = path.join(__dirname, '..', 'node_modules', 'fabric');
const hoisted = path.join(__dirname, '..', '..', 'node_modules', 'fabric');
if (!fs.existsSync(target) && fs.existsSync(hoisted)) {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.symlinkSync(path.relative(path.dirname(target), hoisted), target, 'dir');
}
