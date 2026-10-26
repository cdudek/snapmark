// electron-builder afterPack hook (snap-bmr.15): gives Snapmark's main executable its own LC_UUID. The binary is
// Electron's, with Electron's UUID, and macOS keys the local network permission on it, so Snapmark shared that choice
// with every other Electron app and lost it on update. The new UUID is fixed per app id and architecture, so it is the
// same for every release. Runs before electron-builder signs the app.
/* eslint-disable @typescript-eslint/no-require-imports */
/* global require, module */
'use strict';
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const MH_MAGIC_64 = 0xfeedfacf;
const LC_UUID = 0x1b;
const ARCHS = ['ia32', 'x64', 'armv7l', 'arm64', 'universal']; // electron-builder's Arch enum, by value

// Replaces the LC_UUID of a thin 64-bit Mach-O in `buf` with the first 16 bytes of sha256(appId + arch), marked as a
// version 4 UUID. Returns `buf`.
function setUuid(buf, appId, arch) {
  const magic = buf.readUInt32BE(0);
  // shortcut: thin only, electron-builder builds per arch; upgrade if a universal target is added
  if (magic === 0xcafebabe || magic === 0xcafebabf) throw new Error('setUuid: a fat (universal) Mach-O is not supported');
  if (buf.readUInt32LE(0) !== MH_MAGIC_64) throw new Error('setUuid: not a 64-bit Mach-O');
  const uuid = crypto
    .createHash('sha256')
    .update(appId + arch)
    .digest()
    .subarray(0, 16);
  uuid[6] = (uuid[6] & 0x0f) | 0x40; // version 4
  uuid[8] = (uuid[8] & 0x3f) | 0x80; // RFC 4122 variant
  const ncmds = buf.readUInt32LE(16);
  for (let i = 0, at = 32; i < ncmds; i++) {
    if (buf.readUInt32LE(at) === LC_UUID) {
      uuid.copy(buf, at + 8);
      return buf;
    }
    at += buf.readUInt32LE(at + 4); // cmdsize
  }
  throw new Error('setUuid: no LC_UUID load command');
}

async function afterPack(context) {
  if (context.electronPlatformName !== 'darwin') return;
  const { productFilename, id } = context.packager.appInfo;
  const exe = path.join(context.appOutDir, `${productFilename}.app`, 'Contents', 'MacOS', productFilename);
  fs.writeFileSync(exe, setUuid(fs.readFileSync(exe), id, ARCHS[context.arch]));
}

module.exports = { default: afterPack, setUuid };
