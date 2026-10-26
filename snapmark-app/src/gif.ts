// A looping GIF from PNG frames, written by macOS's own ImageIO through JavaScript for Automation, as ocr.ts reads
// text, so Snapmark needs no encoder dependency. JXA bridges plain objects to the CFDictionary ImageIO wants.
import { execFile } from 'child_process';
import fs from 'fs';

export interface GifFrame {
  png: string; // a PNG file
  delay: number; // seconds this frame shows
}

// '{GIF}', 'LoopCount' and 'DelayTime' are the values of kCGImagePropertyGIFDictionary, …GIFLoopCount and …GIFDelayTime.
const SCRIPT = String.raw`ObjC.import('ImageIO');
function run(argv) {
  const frames = JSON.parse(argv[1]);
  const url = (p) => $.NSURL.fileURLWithPath(p);
  const dest = $.CGImageDestinationCreateWithURL(url(argv[0]), $('com.compuserve.gif'), frames.length, $());
  $.CGImageDestinationSetProperties(dest, $({ '{GIF}': { LoopCount: 0 } }));
  for (const f of frames) {
    const src = $.CGImageSourceCreateWithURL(url(f.png), $());
    // a NULL CF ref still comes back as a truthy Ref, so ask the source for its count
    if (Number($.CGImageSourceGetCount(src)) < 1) throw new Error('ImageIO cannot read ' + f.png);
    $.CGImageDestinationAddImage(dest, $.CGImageSourceCreateImageAtIndex(src, 0, $()), $({ '{GIF}': { DelayTime: f.delay } }));
  }
  if (!$.CGImageDestinationFinalize(dest)) throw new Error('ImageIO could not finish ' + argv[0]);
}`;

const TIMEOUT = 120_000; // 450 Retina frames, a 30 s recording at 15 fps

// Rejects off macOS, on a frame ImageIO cannot read, or a file it cannot write: the caller keeps the frames.
export function writeGif(out: string, frames: GifFrame[]): Promise<void> {
  if (process.platform !== 'darwin') return Promise.reject(new Error('GIFs are written by macOS ImageIO'));
  if (!frames.length) return Promise.reject(new Error('A GIF needs at least one frame'));
  return new Promise((resolve, reject) =>
    execFile('osascript', ['-l', 'JavaScript', '-e', SCRIPT, out, JSON.stringify(frames)], { timeout: TIMEOUT }, (err, _out, stderr) => {
      if (err) return reject(new Error(`GIF not written: ${stderr.trim() || err.message}`));
      try {
        // ImageIO labels the file GIF87a though it writes 89a's delay and loop blocks; strict readers want 89a.
        const fd = fs.openSync(out, 'r+');
        fs.writeSync(fd, '9', 4);
        fs.closeSync(fd);
        resolve();
      } catch (e) {
        reject(e);
      }
    }),
  );
}
