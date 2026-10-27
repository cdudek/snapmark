// Capture Scrolling's own scrolling: one scroll-wheel event in pixels, posted by CoreGraphics through JavaScript for
// Automation, as ocr.ts reads text and gif.ts writes GIFs, so Snapmark needs no helper binary. macOS lets an app post
// events only with Accessibility allowed (systemPreferences.isTrustedAccessibilityClient).
import { execFile } from 'child_process';

// CGEventCreateScrollWheelEvent2, not the variadic CGEventCreateScrollWheelEvent, which JXA cannot call. 0 is
// kCGScrollEventUnitPixel and kCGHIDEventTap; a negative wheel delta scrolls the content down.
export const SCRIPT = String.raw`ObjC.import('CoreGraphics');
function run(argv) {
  const [x, y, points] = argv.map(Number);
  const e = $.CGEventCreateScrollWheelEvent2($(), 0, 1, -points, 0, 0);
  $.CGEventSetLocation(e, { x, y });
  $.CGEventPost(0, e);
}`;

// osascript's arguments: `--` first, or a negative point (a display left of or above the main one) reads as an option.
export const scrollArgs = (x: number, y: number, points: number) => [
  '-l',
  'JavaScript',
  '-e',
  SCRIPT,
  '--',
  String(x),
  String(y),
  String(Math.round(points)),
];

// Scrolls what is under the screen point (x, y), in global points from the top left, down by `points`.
export function scrollAt(x: number, y: number, points: number): Promise<void> {
  if (process.platform !== 'darwin') return Promise.reject(new Error('Scroll events are posted by macOS CoreGraphics'));
  return new Promise((resolve, reject) =>
    execFile('osascript', scrollArgs(x, y, points), { timeout: 5000 }, (err, _out, stderr) =>
      err ? reject(new Error(`Could not scroll: ${stderr.trim() || err.message}`)) : resolve(),
    ),
  );
}
