import assert from 'assert';
import crypto from 'crypto';
// after-pack.cjs is electron-builder's CommonJS hook, outside the TypeScript sources.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { setUuid } = require('../../scripts/after-pack.cjs') as { setUuid: (buf: Buffer, appId: string, arch: string) => Buffer };

// A minimal thin 64-bit Mach-O: the 32-byte header, a 16-byte command, LC_UUID (24 bytes), then the rest of the file.
function machO(): Buffer {
  const b = Buffer.alloc(32 + 16 + 24 + 32);
  b.writeUInt32LE(0xfeedfacf, 0); // MH_MAGIC_64
  b.writeUInt32LE(0x0100000c, 4); // CPU_TYPE_ARM64
  b.writeUInt32LE(2, 12); // MH_EXECUTE
  b.writeUInt32LE(2, 16); // ncmds
  b.writeUInt32LE(16 + 24, 20); // sizeofcmds
  b.writeUInt32LE(0x2, 32); // some other command
  b.writeUInt32LE(16, 36);
  b.writeUInt32LE(0x1b, 48); // LC_UUID
  b.writeUInt32LE(24, 52);
  b.fill(0xab, 56, 72); // Electron's UUID
  b.fill(0x5a, 72); // the rest of the file
  return b;
}
const uuidOf = (b: Buffer) => b.subarray(56, 72).toString('hex');

// F122 own LC_UUID: different from Electron's, the same on every release of one architecture, nothing else touched
const original = machO();
const arm = setUuid(Buffer.from(original), 'com.cdudek.snapmark', 'arm64');
assert.notStrictEqual(uuidOf(arm), uuidOf(original), 'F122 the UUID changes');
assert.strictEqual(uuidOf(setUuid(Buffer.from(original), 'com.cdudek.snapmark', 'arm64')), uuidOf(arm), 'F122 the same every time');
assert.notStrictEqual(uuidOf(setUuid(Buffer.from(original), 'com.cdudek.snapmark', 'x64')), uuidOf(arm), 'F122 differs for x64');
assert.ok(
  arm.subarray(0, 56).equals(original.subarray(0, 56)) && arm.subarray(72).equals(original.subarray(72)),
  'F122 the rest of the buffer is unchanged',
);
const want = Buffer.from(crypto.createHash('sha256').update('com.cdudek.snapmarkarm64').digest().subarray(0, 16));
want[6] = (want[6] & 0x0f) | 0x40;
want[8] = (want[8] & 0x3f) | 0x80;
assert.strictEqual(uuidOf(arm), want.toString('hex'), 'F122 sha256(appId + arch), version 4');
const fat = Buffer.alloc(64);
fat.writeUInt32BE(0xcafebabe, 0); // FAT_MAGIC
assert.throws(() => setUuid(fat, 'com.cdudek.snapmark', 'arm64'), /fat/, 'F122 a fat (universal) binary throws');

console.log('uuid: ok');
