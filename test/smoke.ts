// Drives the real editor window on a rendered mock page (never your real screen): draw each tool, add marker notes, save.
import fs from 'fs';
import os from 'os';
import path from 'path';
import { app, BrowserWindow, nativeImage } from 'electron';

const MOCK = `<body style="margin:0;font:16px system-ui;background:#fff;color:#18181b">
  <header style="height:56px;background:#18181b;color:#fff;display:flex;align-items:center;padding:0 24px">Acme Dashboard</header>
  <div style="display:flex"><nav style="width:220px;height:644px;background:#f4f4f5;padding:24px">Overview<br><br>Reports<br><br>Settings</nav>
  <main style="padding:32px"><h1>Welcome back</h1><p>Revenue is up 12% this month.</p><button style="padding:10px 18px">Export</button></main></div></body>`;

// Samples one pixel and returns [r, g, b].
function pixel(file: string, fx: number, fy: number, dx = 0, dy = 0): number[] {
  const img = nativeImage.createFromPath(file);
  const { width, height } = img.getSize();
  const [b, g, r] = img.crop({ x: Math.round(width * fx + dx), y: Math.round(height * fy + dy), width: 1, height: 1 }).toBitmap();
  return [r, g, b];
}

// main.ts reads these at import time, so set them before requiring it.
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'snapmark-smoke-'));
process.env.SNAPMARK_NO_UI = '1';
process.env.SNAPMARK_ROOT = root;
const { openEditor, setActive } = require('../src/main') as typeof import('../src/main');
const sessions = require('../src/sessions') as typeof import('../src/sessions');

setTimeout(() => {
  console.log('smoke: TIMEOUT');
  app.exit(1);
}, 30000);
app
  .whenReady()
  .then(async () => {
    const mock = new BrowserWindow({ width: 1200, height: 700 }); // must be visible: Linux cannot capture hidden windows
    await mock.loadURL(`data:text/html,${encodeURIComponent(MOCK)}`);
    const shot = path.join(root, 'mock.png');
    fs.writeFileSync(shot, (await mock.webContents.capturePage()).toPNG());
    mock.destroy();
    const shotSize = nativeImage.createFromPath(shot).getSize();
    const shotCopy = path.join(root, 'mock-copy.png'); // openEditor deletes its input on close
    fs.copyFileSync(shot, shotCopy);
    setActive(sessions.create(root, 'smoke'));
    const win = openEditor(shot);
    await new Promise<void>((r) => win.webContents.once('did-finish-load', () => r()));
    const js = `(async () => {
    await new Promise((r) => setTimeout(r, 300));
    const c = document.getElementById('canvas');
    const b = c.getBoundingClientRect();
    const ev = (type, fx, fy) => c.dispatchEvent(new PointerEvent(type, { clientX: b.left + b.width * fx, clientY: b.top + b.height * fy, pointerId: 1, bubbles: true }));
    const drag = (key, pts) => { document.dispatchEvent(new KeyboardEvent('keydown', { key })); ev('pointerdown', ...pts[0]); pts.slice(1).forEach((p) => ev('pointermove', ...p)); ev('pointerup', ...pts.at(-1)); };
    drag('1', [[.05,.05],[.25,.25]]);                 // box
    drag('1', [[.3,.05],[.45,.25]]);                  // 1 again -> ellipse
    drag('2', [[.5,.1],[.65,.2]]);                    // arrow
    drag('2', [[.1,.7],[.2,.8],[.3,.7],[.4,.8]]);     // 2 again -> pen
    drag('3', [[.7,.05],[.8,.2]]);                    // cross
    drag('3', [[.82,.05],[.95,.2]]);                  // crossed box
    drag('3', [[.05,.35],[.3,.6]]);                   // remove area
    drag('4', [[.7,.7],[.8,.85]]);                    // tick
    drag('4', [[.85,.7],[.95,.88]]);                  // thumbs up
    document.dispatchEvent(new KeyboardEvent('keydown', { key: '5' }));
    drag('5', [[.5,.5]]); document.activeElement.value = 'Button is misaligned'; document.activeElement.dispatchEvent(new Event('input'));
    document.activeElement.blur();
    drag('5', [[.6,.45]]); document.activeElement.value = 'Typo here'; document.activeElement.dispatchEvent(new Event('input'));
    document.getElementById('caption').value = 'Smoke test caption';
  })()`;
    await win.webContents.executeJavaScript(js);
    await new Promise((r) => setTimeout(r, 500)); // let the canvas repaint before capturing
    fs.writeFileSync(path.join(root, 'editor.png'), (await win.webContents.capturePage()).toPNG());
    await win.webContents.executeJavaScript(`document.getElementById('save').click()`);
    await new Promise((r) => setTimeout(r, 800));
    const md = fs.readFileSync(path.join(root, 'smoke', 'session.md'), 'utf8');
    const out = path.join(root, 'smoke', 'img', '001.png');
    const unit = Math.max(2, Math.round(Math.max(shotSize.width, shotSize.height) / 400));
    const [r1, g1, b1] = pixel(out, 0.5, 0.5, -unit * 6 * 0.6); // left side of marker 1, beside its digit
    const thumbR = Math.min(0.1 * shotSize.width, 0.18 * shotSize.height) / 2; // thumbs-up dragged over 10% x 18% of the image
    const [r2, g2, b2] = pixel(out, 0.9, 0.79, 0, thumbR * 0.85); // bottom of the green disc, below the emoji
    const checks: Record<string, boolean> = {
      'image saved': fs.existsSync(out),
      'mock is not blank': pixel(shotCopy, 0.02, 0.02).join() !== pixel(shotCopy, 0.5, 0.5).join(),
      'same size as capture': JSON.stringify(nativeImage.createFromPath(out).getSize()) === JSON.stringify(shotSize),
      'marker drawn red': r1 > 180 && g1 < 90 && b1 < 120,
      'approve drawn green': g2 > 120 && r2 < 90,
      'markdown has image': md.includes('img/001.png'),
      'markdown has caption': md.includes('Smoke test caption'),
      'markdown has numbered notes': md.includes('1. Button is misaligned\n2. Typo here'),
    };
    console.log(md);
    console.log(`root: ${root}`);
    for (const [name, pass] of Object.entries(checks)) console.log(`${pass ? '✓' : '✗'} ${name}`);
    const ok = Object.values(checks).every(Boolean);
    console.log(ok ? 'smoke: ok' : `smoke: FAILED (${[r1, g1, b1]} / ${[r2, g2, b2]})`);
    app.exit(ok ? 0 : 1);
  })
  .catch((e: unknown) => {
    console.error(e);
    console.log('smoke: FAILED');
    app.exit(1);
  });
