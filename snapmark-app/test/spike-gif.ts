// Spike 3.1, kept as gif.ts's unit test: three solid PNGs become a looping GIF, and ImageIO reads back the frames
// and delays that went in.
import assert from 'assert';
import { execFileSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import zlib from 'zlib';
import { writeGif } from '../src/gif';

// A w×h PNG of one RGB colour, from Node's own zlib.
function png(file: string, w: number, h: number, rgb: number[]) {
  const chunk = (type: string, data: Buffer) => {
    const body = Buffer.concat([Buffer.from(type), data]);
    const out = Buffer.alloc(body.length + 8);
    out.writeUInt32BE(data.length);
    body.copy(out, 4);
    out.writeUInt32BE(zlib.crc32(body), body.length + 4);
    return out;
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w);
  ihdr.writeUInt32BE(h, 4);
  ihdr.set([8, 2], 8); // 8-bit RGB
  const row = Buffer.from([0, ...Array.from({ length: w }, () => rgb).flat()]); // filter byte, then pixels
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  fs.writeFileSync(
    file,
    Buffer.concat([
      signature,
      chunk('IHDR', ihdr),
      chunk('IDAT', zlib.deflateSync(Buffer.concat(Array(h).fill(row)))),
      chunk('IEND', Buffer.alloc(0)),
    ]),
  );
}

// What ImageIO reads from a GIF: the frame count, the file's loop count and each frame's delay.
const READ = String.raw`ObjC.import('ImageIO');
function run(argv) {
  const src = $.CGImageSourceCreateWithURL($.NSURL.fileURLWithPath(argv[0]), $());
  const props = (ref) => ObjC.deepUnwrap(ObjC.castRefToObject(ref))['{GIF}'];
  const count = $.CGImageSourceGetCount(src);
  const delays = [];
  for (let i = 0; i < count; i++) delays.push(props($.CGImageSourceCopyPropertiesAtIndex(src, i, $())).DelayTime);
  return JSON.stringify({ count, loop: props($.CGImageSourceCopyProperties(src, $())).LoopCount, delays });
}`;

async function main() {
  if (process.platform !== 'darwin') {
    await assert.rejects(writeGif('/nope.gif', [{ png: '/nope.png', delay: 1 }]));
    console.log('spike-gif: skipped (no ImageIO off macOS)');
    return;
  }
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'snapmark-gif-'));
  try {
    const delays = [0.1, 0.5, 1.0];
    const frames = [
      [255, 0, 0],
      [0, 255, 0],
      [0, 0, 255],
    ].map((rgb, i) => {
      const file = path.join(dir, `${i}.png`);
      png(file, 16, 12, rgb);
      return { png: file, delay: delays[i] };
    });
    const gif = path.join(dir, 'out.gif');
    await writeGif(gif, frames);
    assert.strictEqual(fs.readFileSync(gif).subarray(0, 6).toString(), 'GIF89a');

    const back = JSON.parse(execFileSync('osascript', ['-l', 'JavaScript', '-e', READ, gif], { encoding: 'utf8' }));
    assert.strictEqual(Number(back.count), 3, 'three frames');
    assert.strictEqual(back.loop, 0, 'loops for ever');
    back.delays.forEach((d: number, i: number) => assert.ok(Math.abs(d - delays[i]) <= 0.01, `frame ${i + 1}: ${d} s, not ${delays[i]} s`));

    // A frame ImageIO cannot read fails the write; it never leaves a GIF short of a frame
    await assert.rejects(writeGif(path.join(dir, 'bad.gif'), [...frames, { png: path.join(dir, 'missing.png'), delay: 1 }]), /cannot read/);
    assert.ok(!fs.existsSync(path.join(dir, 'bad.gif')), 'no partial GIF');
    await assert.rejects(writeGif(path.join(dir, 'no', 'such', 'folder.gif'), frames), /could not finish/);
    await assert.rejects(writeGif(path.join(dir, 'none.gif'), []));
    console.log(`spike-gif: ok (${back.count} frames, delays ${back.delays.join(', ')} s)`);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

void main().catch((e) => {
  console.error(e);
  process.exit(1);
});
