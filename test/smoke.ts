// Drives the real editor window on a rendered mock page (never your real screen): draw each tool, add marker notes, save.
import fs from 'fs';
import os from 'os';
import path from 'path';
import { app, BrowserWindow, nativeImage } from 'electron';

const MOCK = `<body style="margin:0;font:16px system-ui;background:#fff;color:#18181b">
  <header style="height:56px;background:#18181b;color:#fff;display:flex;align-items:center;padding:0 24px">Acme Dashboard</header>
  <div style="display:flex"><nav style="width:220px;height:644px;background:#f4f4f5;padding:24px">Overview<br><br>Reports<br><br>Settings</nav>
  <main style="padding:32px"><h1>Welcome back</h1><p>Revenue is up 12% this month.</p><button style="padding:10px 18px">Export</button></main></div></body>`;

// A solid PNG of the given size, for fitForAI checks.
const big = (width: number, height: number) =>
  nativeImage.createFromBitmap(Buffer.alloc(width * height * 4, 128), { width, height }).toPNG();

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
const { openEditor, setActive, fitForAI, promptFor, sessionMdPath } = require('../src/main') as typeof import('../src/main');
const sessions = require('../src/sessions') as typeof import('../src/sessions');
const { exportPdf } = require('../src/exporter') as typeof import('../src/exporter');

// Headless Linux (xvfb) has no GPU; capturePage fails with UnknownVizError unless compositing runs on the CPU.
if (process.platform === 'linux') app.disableHardwareAcceleration();

setTimeout(() => {
  console.log('smoke: TIMEOUT');
  app.exit(1);
}, 30000);
app
  .whenReady()
  .then(async () => {
    const mock = new BrowserWindow({ width: 1200, height: 700 }); // must be visible: Linux cannot capture hidden windows
    await mock.loadURL(`data:text/html,${encodeURIComponent(MOCK)}`);
    await new Promise((r) => setTimeout(r, 300)); // first paint
    const shot = path.join(root, 'mock.png');
    fs.writeFileSync(shot, (await mock.webContents.capturePage()).toPNG());
    mock.destroy();
    const shotSize = nativeImage.createFromPath(shot).getSize();
    const shotCopy = path.join(root, 'mock-copy.png'); // openEditor deletes its input on close
    fs.copyFileSync(shot, shotCopy);
    setActive(sessions.create(root, 'smoke'));
    const win = openEditor(shot);
    win.webContents.on('console-message', (e) => console.log('[page]', (e as unknown as { message: string }).message));
    await new Promise<void>((r) => win.webContents.once('did-finish-load', () => r()));
    // Runs inside the editor page; its top-level bindings (canvas, Card, links, background) are in scope.
    const js = `(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    for (let i = 0; i < 50 && !background; i++) await sleep(100);
    await sleep(200);
    const up = document.querySelector('.upper-canvas');
    // Fabric listens for mouse events (enablePointerEvents is off by default).
    // Measured per event: the canvas may be refitted between steps.
    const ev = (type, fx, fy) => {
      const b = up.getBoundingClientRect();
      up.dispatchEvent(new MouseEvent(type, { clientX: b.left + b.width * fx, clientY: b.top + b.height * fy, button: 0, buttons: type === 'mouseup' ? 0 : 1, bubbles: true }));
    };
    const key = (k, opts = {}) => document.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, ...opts }));
    const drag = (k, pts) => { if (k) key(k); ev('mousedown', ...pts[0]); pts.slice(1).forEach((p) => ev('mousemove', ...p)); ev('mouseup', ...pts.at(-1)); };
    const px = (fx, fy) => { canvas.renderAll(); return Array.from(canvas.lowerCanvasEl.getContext('2d').getImageData(Math.round(canvas.width * fx), Math.round(canvas.height * fy), 1, 1).data); };
    const note = (text) => { document.activeElement.value = text; document.activeElement.dispatchEvent(new Event('input')); document.activeElement.blur(); };
    const r = {};
    r['References hidden before the first reference'] = document.getElementById('refs-label').hidden && !document.querySelector('#refs textarea');

    drag(null, [[.05,.05],[.2,.2]]);                  // box (the starting tool)
    drag('2', [[.22,.05],[.35,.2]]);                  // 2 again -> ellipse
    drag('3', [[.4,.1],[.5,.2]]);                     // arrow
    drag('3', [[.05,.85],[.15,.9],[.25,.85],[.3,.9]]); // pen
    drag('4', [[.55,.05],[.62,.15]]);                 // cross
    drag('4', [[.64,.05],[.72,.15]]);                 // crossed box
    drag('4', [[.05,.3],[.2,.45]]);                   // remove area
    drag('5', [[.75,.05],[.8,.15]]);                  // tick
    drag('5', [[.85,.7],[.95,.88]]);                  // thumbs up
    drag('1', [[.5,.5]]); note('Button is misaligned'); // reference 1
    drag(null, [[.6,.45]]); note('Typo here');          // reference 2
    drag('1', [[.3,.62],[.36,.7]]);                   // 1 again -> card, pointing from where the press started
    const card = canvas.getActiveObject();
    card.set({ text: 'Make this bigger' });
    card.exitEditing();
    r.cardWithPointer = card instanceof Card && card.text === 'Make this bigger' && !!card.pointAt;

    drag('6', [[.25,.3],[.4,.35]]);                   // highlighter
    const corner = px(.02, .98);
    drag('6', [[.45,.25],[.55,.35]]);                 // spotlight
    r.spotlightDims = px(.02, .98)[0] < corner[0] * 0.7;
    key('z', { metaKey: true });
    r.undoRemovesSpotlight = px(.02, .98).join() === corner.join();
    key('7'); drag('7', [[.28,.2],[.45,.28]]);        // 7 twice -> redact the 'Revenue' line
    r.redacted = canvas.getObjects().some((o) => o.filters?.length === 1);

    key('v');
    drag(null, [[.12,.12]]);                          // click the box
    r.selectsBox = canvas.getActiveObject()?.kind === 'box';
    const before = canvas.getObjects().length;
    key('Backspace');
    r.deleteRemoves = canvas.getObjects().length === before - 1;
    key('z', { metaKey: true });
    r.undoRestoresDelete = canvas.getObjects().length === before;

    key('7'); drag('7', [[.05,.55],[.15,.65]]);       // 7 was left on Redact, so twice -> cut; lifts the piece and switches to Select
    drag(null, [[.1,.6],[.2,.62],[.27,.52]]);         // drag the piece away
    const piece = canvas.getObjects().find((o) => links.has(o));
    const [ghost, arrow] = links.get(piece) ?? [];
    r.pieceMoved = !!piece && Math.abs(piece.left - ghost.left) > 50;
    r.moveArrowFollows = !!arrow && arrow.visible && Math.hypot(arrow.x2 - arrow.x1, arrow.y2 - arrow.y1) > 20;

    // Icon toolbar (F1-F4)
    const btns = [...document.querySelectorAll('#tools button')];
    r['toolbar: one icon button per tool, no text'] = btns.length === GROUPS.flatMap((g) => g.tools).length && btns.every((b) => b.querySelector('svg') && b.textContent.trim() === '');
    r['toolbar: groups V 1-7 in order'] = [...document.querySelectorAll('#tools .group > kbd')].map((k) => k.textContent).join('') === 'V1234567';
    r['toolbar: tooltip names tool and key'] = document.querySelector('[data-tool=pen]').title === 'Pen (3)' && document.querySelector('[data-tool=redact]').title === 'Redact (7): pixelate to hide private details' && document.querySelector('[data-tool=select]').title.startsWith('Select (V): click a mark');
    document.querySelector('[data-tool=ellipse]').click();
    r['toolbar: click picks the tool'] = tool() === 'ellipse' && document.querySelector('[data-tool=ellipse]').getAttribute('aria-pressed') === 'true';
    key('3'); const t1 = tool(); key('3');
    r['no "Numbered" in the editor'] = !/numbered marker|Numbered/.test(document.body.innerText + GROUPS.flatMap((g) => g.tools.map((t) => t.label + (t.tip ?? ''))).join(' '));
    r['keys step through a group'] = t1 === 'pen' && tool() === 'arrow';
    // Sidebar (F7-F10): fields grow with their text; the buttons stay in view while the body scrolls
    const cap = document.getElementById('caption');
    const oneLine = cap.clientHeight;
    r['comment is one line, "Add a comment…"'] = cap.rows === 1 && cap.placeholder === 'Add a comment…';
    cap.value = 'a\\nb\\nc\\nd\\ne'; cap.dispatchEvent(new Event('input'));
    r['comment grows as you type'] = cap.clientHeight > oneLine * 2 && cap.scrollHeight <= cap.clientHeight + 1;
    const ta = document.querySelector('#refs textarea');
    const kept = ta.value;
    ta.value = 'line\\n'.repeat(5) + 'a long reference note that wraps inside the sidebar more than once';
    r['reference note shows all its text'] = ta.scrollHeight <= ta.clientHeight + 1 && ta.clientHeight > oneLine * 3;
    r['References shown once one exists'] = !document.getElementById('refs-label').hidden;
    ta.value = 'x\\n'.repeat(60);
    const sb = document.getElementById('save').getBoundingClientRect();
    r['buttons stay in view while notes scroll'] = sb.bottom <= window.innerHeight && sb.top > 0 && document.querySelector('aside .body').scrollHeight > document.querySelector('aside .body').clientHeight;
    ta.value = kept;
    // Esc steps back one level (F6): with Card active and a card selected, Esc deselects, then goes to Select
    key('1'); if (tool() !== 'card') key('1');
    drag(null, [[.7,.75]]); const c = canvas.getActiveObject(); c?.set({ text: 'Esc test' }); c?.exitEditing?.(); // an empty card deletes itself
    const hadCard = canvas.getActiveObject() instanceof Card;
    key('Escape'); const deselected = !canvas.getActiveObject() && tool() === 'card';
    key('Escape');
    r['Esc: deselect, then back to Select'] = hadCard && deselected && tool() === 'select';

    // Ghost (F1-F5): a faint copy of the next shape follows the pointer, on the top layer only
    const top = (x, y) => canvas.contextTop.getImageData(Math.round(x), Math.round(y), 1, 1).data[3];
    const objs = canvas.getObjects().length, undos = undoStack.length;
    let adds = 0; const count = () => adds++; canvas.on('object:added', count);
    document.querySelector('[data-tool=box]').click();
    ev('mousemove', .5, .5);
    const [cx, cy, d] = [canvas.width * .5, canvas.height * .5, unit * 8];
    r['ghost: box follows the pointer'] = top(cx - d, cy) > 0 && top(cx - d, cy - d) > 0;
    key('2'); // Box -> Ellipse without moving
    r['ghost: pressing the key again shows the next shape'] = tool() === 'ellipse' && top(cx - d, cy - d) === 0 && top(cx - d, cy) > 0;
    up.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }));
    r['ghost: gone when the pointer leaves'] = top(cx - d, cy) === 0;
    ev('mousemove', .5, .5); key('v');
    r['ghost: gone on Select'] = top(cx - d, cy) === 0;
    canvas.off('object:added', count);
    r['ghost: never in the scene, undo or unsaved work'] = adds === 0 && canvas.getObjects().length === objs && undoStack.length === undos;
    document.querySelector('[data-tool=pen]').click();
    const penCursor = canvas.freeDrawingCursor;
    document.querySelector('[data-tool=box]').click();
    r['icon cursor for Pen, crosshair for Box'] = penCursor.startsWith('url(') && canvas.defaultCursor === 'crosshair';
    key('v');

    document.getElementById('caption').value = 'Smoke test caption';
    return r;
  })()`;
    const inPage: Record<string, boolean> = await win.webContents.executeJavaScript(js);
    win.webContents.invalidate(); // capturePage can return a stale frame for a window that is not in front
    await new Promise((r) => setTimeout(r, 500)); // let the canvas repaint before capturing
    fs.writeFileSync(path.join(root, 'editor.png'), (await win.webContents.capturePage()).toPNG());
    await win.webContents.executeJavaScript(`document.getElementById('save').click()`);
    await new Promise((r) => setTimeout(r, 800));
    const md = fs.readFileSync(path.join(root, 'smoke', 'session.md'), 'utf8');
    const out = path.join(root, 'smoke', 'img', '001.png');
    const unit = Math.max(2, Math.round(Math.max(shotSize.width, shotSize.height) / 400));
    const outSize = nativeImage.createFromPath(out).getSize();
    const k = outSize.width / shotSize.width; // saved image may be downscaled for AI
    const [r1, g1, b1] = pixel(out, 0.5, 0.5, -unit * 6 * 0.6 * k); // left side of marker 1, beside its digit
    const thumbR = Math.min(0.1 * shotSize.width, 0.18 * shotSize.height) / 2; // thumbs-up dragged over 10% x 18% of the image
    const [r2, g2, b2] = pixel(out, 0.9, 0.79, 0, thumbR * 0.85 * k); // bottom of the green disc, below the emoji
    const pdf = await exportPdf(path.join(root, 'smoke'));
    const [r3, g3, b3] = pixel(out, 0.36, 0.7, unit * 2 * k, -unit * 2 * k); // card padding, above its text
    const checks: Record<string, boolean> = {
      ...inPage,
      'card drawn yellow': r3 > 235 && g3 > 225 && b3 > 150 && b3 < 225,
      'pdf exported': fs.readFileSync(pdf).subarray(0, 5).toString() === '%PDF-' && fs.statSync(pdf).size > 20_000,
      'image saved': fs.existsSync(out),
      'mock is not blank': pixel(shotCopy, 0.02, 0.02).join() !== pixel(shotCopy, 0.5, 0.5).join(),
      'prompt explains every mark': (() => {
        const p = promptFor(root);
        const { GROUPS: all } = require('../src/tools') as { GROUPS: ToolGroup[] };
        return all.flatMap((g) => g.tools).every((t) => t.id === 'select' || p.includes(`- ${t.label}: `));
      })(),
      'prompt says Reference, not Numbered':
        promptFor(root).includes('references (numbered circles)') && !/Numbered|numbered marker/.test(promptFor(root)),
      'fits AI limits': Math.max(outSize.width, outSize.height) <= 1568 && outSize.width * outSize.height <= 1_150_000,
      'aspect kept': Math.abs(outSize.width / outSize.height - shotSize.width / shotSize.height) < 0.01,
      'small image untouched': fitForAI(big(800, 600)).equals(big(800, 600)),
      'large image shrunk':
        JSON.stringify(nativeImage.createFromBuffer(fitForAI(big(3000, 1000))).getSize()) === JSON.stringify({ width: 1568, height: 523 }),
      'marker drawn red': r1 > 180 && g1 < 90 && b1 < 120,
      'approve drawn green': g2 > 120 && r2 < 90,
      'session.md path is absolute':
        sessionMdPath(path.join(root, 'smoke')) === path.resolve(root, 'smoke', 'session.md') && path.isAbsolute(sessionMdPath('rel')),
      'prompt points at session.md': promptFor(path.join(root, 'smoke')).includes(`"${path.join(root, 'smoke', 'session.md')}"`),
      'markdown has card': md.includes('- Card: Make this bigger'),
      'markdown has move': md.includes('- Moved an element'),
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
