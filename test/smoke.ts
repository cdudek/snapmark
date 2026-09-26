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
const { openEditor, openViewer, reopen, setActive, fitForAI, promptFor, sessionMdPath } =
  require('../src/main') as typeof import('../src/main');
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
    // Notes are Markdown fields (contenteditable). A new reference's field is mounted and focused a moment after the click.
    const note = async (text) => { for (let i = 0; i < 50 && !document.activeElement?.closest?.('#refs .md'); i++) await sleep(20); document.execCommand('insertText', false, text); document.activeElement.blur(); };
    const setMd = (el, lines) => { el.querySelector('.ProseMirror').focus(); document.execCommand('selectAll'); lines.forEach((l, i) => { if (i) document.execCommand('insertParagraph'); document.execCommand('insertText', false, l); }); };
    const r = {};
    r['References hidden before the first reference'] = document.getElementById('refs-label').hidden && !document.querySelector('#refs .md');

    drag(null, [[.05,.05],[.2,.2]]);                  // box (the starting tool)
    drag('2', [[.22,.05],[.35,.2]]);                  // 2 again -> ellipse
    drag('3', [[.4,.1],[.5,.2]]);                     // arrow
    drag('4', [[.05,.85],[.15,.9],[.25,.85],[.3,.9]]); // pen
    drag('5', [[.55,.05],[.62,.15]]);                 // cross
    drag('5', [[.05,.3],[.2,.45]]);                   // remove area
    drag('1', [[.5,.5]]); await note('Button is misaligned'); // reference 1
    drag(null, [[.6,.45]]); await note('Typo here');          // reference 2
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

    key('c');
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

    // Toolbar (F1-F6): one icon per key showing the current tool, soft tint, no text
    const pick = (id) => { group = GROUPS.findIndex((g) => g.tools.some((t) => t.id === id)); variant[group] = GROUPS[group].tools.findIndex((t) => t.id === id); applyTool(); };
    const btns = [...document.querySelectorAll('#tools button')];
    r['toolbar: one icon button per key, C 1-7, no text in the buttons'] = btns.map((b) => b.dataset.group).join('') === 'c1234567' && btns.every((b) => b.querySelector('svg') && b.textContent.trim() === '');
    r['toolbar: key under each button, dots where a key has more tools'] = [...document.querySelectorAll('#tools .cap')].every((c, i) => { const g = GROUPS[i], d = c.querySelector('.dots')?.textContent ?? ''; return c.querySelector('kbd').textContent === g.key.toUpperCase() && (g.tools.length > 1 ? d.length === g.tools.length && d.split('●').length === 2 : d === ''); });
    pick('box');
    const tb = () => document.querySelector('#tools [data-group="2"]');
    r['toolbar: active button has a soft grey tint'] = tb().getAttribute('aria-pressed') === 'true' && getComputedStyle(tb()).backgroundColor.startsWith('rgba(127, 127, 127');
    r['toolbar: tooltip names the tool, key and next tool'] = tb().title === 'Box (2) · press again for Ellipse' && document.querySelector('#tools [data-group="3"]').title === 'Arrow (3)';
    key('2');
    r['toolbar: pressing the key again swaps the icon'] = tool() === 'ellipse' && tb().dataset.tool === 'ellipse';
    document.querySelector('#tools [data-group="4"]').click();
    r['toolbar: click picks the tool'] = tool() === 'pen';
    r['keys: Arrow on 3, Pen on 4, crosses on 5'] = ['3:arrow', '4:pen', '5:cross'].every((k) => { const [key, id] = k.split(':'); return GROUPS.find((g) => g.key === key).tools[0].id === id; });
    r['no Tick, Thumbs up or Crossed box anywhere'] = !GROUPS.flatMap((g) => g.tools).some((t) => ['tick', 'thumb', 'xbox'].includes(t.id));
    r['no "Numbered" in the editor'] = !/numbered marker|Numbered/.test(document.body.innerText + GROUPS.flatMap((g) => g.tools.map((t) => t.label + (t.tip ?? ''))).join(' '));
    // Sidebar (F7-F10): fields grow with their text; the buttons stay in view while the body scrolls
    const cap = document.getElementById('caption');
    const oneLine = cap.clientHeight;
    r['comment is one line, "Add a comment…"'] = cap.dataset.placeholder === 'Add a comment…' && cap.dataset.empty === 'true' && oneLine < 50;
    setMd(cap, ['a', 'b', 'c', 'd', 'e']); await sleep(50);
    r['comment grows as you type'] = cap.clientHeight > oneLine * 2 && cap.dataset.empty === 'false';
    const ref1 = document.querySelector('#refs .md');
    setMd(ref1, ['line', 'line', 'line', 'line', 'line', 'a long reference note that wraps inside the sidebar more than once']); await sleep(50);
    r['reference note shows all its text'] = ref1.scrollHeight <= ref1.clientHeight + 1 && ref1.clientHeight > oneLine * 3;
    r['References shown once one exists'] = !document.getElementById('refs-label').hidden;
    setMd(ref1, Array(60).fill('x')); await sleep(50);
    const sb = document.getElementById('save').getBoundingClientRect();
    r['buttons stay in view while notes scroll'] = sb.bottom <= window.innerHeight && sb.top > 0 && document.querySelector('aside .body').scrollHeight > document.querySelector('aside .body').clientHeight;
    await sleep(100); setMd(ref1, ['Button is misaligned']); await sleep(100);
    r['restored reference note'] = ref1.textContent === 'Button is misaligned'; document.activeElement.blur();
    ref1.querySelector('.ProseMirror').focus();
    const toolBefore = tool();
    document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: '2', bubbles: true }));
    r['tool keys do nothing while typing a note'] = tool() === toolBefore;
    document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    r['Esc leaves the note field'] = !document.activeElement?.closest?.('.md');
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
    pick('box');
    ev('mousemove', .5, .5);
    const [cx, cy, d] = [canvas.width * .5, canvas.height * .5, unit * 8];
    r['ghost: box follows the pointer'] = top(cx - d, cy) > 0 && top(cx - d, cy - d) > 0;
    key('2'); // Box -> Ellipse without moving
    r['ghost: pressing the key again shows the next shape'] = tool() === 'ellipse' && top(cx - d, cy - d) === 0 && top(cx - d, cy) > 0;
    up.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }));
    r['ghost: gone when the pointer leaves'] = top(cx - d, cy) === 0;
    ev('mousemove', .5, .5); key('c');
    r['ghost: gone on Select'] = top(cx - d, cy) === 0;
    canvas.off('object:added', count);
    r['ghost: never in the scene, undo or unsaved work'] = adds === 0 && canvas.getObjects().length === objs && undoStack.length === undos;
    pick('pen');
    const penCursor = canvas.freeDrawingCursor;
    pick('box');
    r['icon cursor for Pen, crosshair for Box'] = penCursor.startsWith('url(') && canvas.defaultCursor === 'crosshair';
    key('c');

    setMd(cap, ['Smoke test caption']); document.activeElement.blur();
    return r;
  })()`;
    const inPage: Record<string, boolean> = await win.webContents.executeJavaScript(js);
    // Real input events (not synthetic DOM ones) include the browser's default mousedown handling, which moved focus.
    const at = await win.webContents.executeJavaScript(`(() => {
      group = GROUPS.findIndex((g) => g.key === '1'); variant[group] = 0; applyTool();
      const b = document.querySelector('.upper-canvas').getBoundingClientRect();
      return { x: Math.round(b.left + b.width * .8), y: Math.round(b.top + b.height * .3) };
    })()`);
    win.focus();
    win.webContents.sendInputEvent({ type: 'mouseDown', x: at.x, y: at.y, button: 'left', clickCount: 1 });
    win.webContents.sendInputEvent({ type: 'mouseUp', x: at.x, y: at.y, button: 'left', clickCount: 1 });
    await new Promise((r) => setTimeout(r, 300));
    inPage['a new reference is ready to type into'] = await win.webContents.executeJavaScript(
      `!!document.activeElement?.isContentEditable && !!document.activeElement.closest('#refs .md')`,
    );
    // Markdown as you type (F1, F2), with real key events: the field's input rules only see real typing.
    const type = (text: string) => [...text].forEach((ch) => win.webContents.sendInputEvent({ type: 'char', keyCode: ch }));
    const enter = () => {
      win.webContents.sendInputEvent({ type: 'keyDown', keyCode: 'Return' });
      win.webContents.sendInputEvent({ type: 'char', keyCode: '\r' });
      win.webContents.sendInputEvent({ type: 'keyUp', keyCode: 'Return' });
    };
    type('# Title');
    enter();
    type('- item');
    enter();
    enter();
    type('**bold**');
    await new Promise((r) => setTimeout(r, 300));
    inPage['notes: # heading, - list and **bold** format as you type'] = await win.webContents.executeJavaScript(
      `(() => { const f = document.activeElement?.closest('.md'); return !!f && !!f.querySelector('h1') && !!f.querySelector('li') && !!f.querySelector('strong') && !f.textContent.includes('**'); })()`,
    );
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
    const pdf = await exportPdf(path.join(root, 'smoke'));
    const [r3, g3, b3] = pixel(out, 0.36, 0.7, unit * 2 * k, -unit * 2 * k); // card padding, above its text
    // The session viewer: session.md rendered with its image, editable, and screenshots one at a time
    const view = openViewer('smoke', root);
    await new Promise<void>((r) => view.webContents.once('did-finish-load', () => r()));
    const inView = (js: string) => view.webContents.executeJavaScript(`(async () => { ${js} })()`);
    const waitFor = (cond: string) =>
      inView(`for (let i = 0; i < 50 && !(${cond}); i++) await new Promise((r) => setTimeout(r, 100)); return !!(${cond});`);
    const viewer: Record<string, boolean> = {};
    viewer['viewer shows the screenshot inline'] = await waitFor(`document.querySelector('#doc img[src^="img/"]')?.naturalWidth > 0`);
    viewer['viewer shows the caption'] = await waitFor(`document.getElementById('doc').textContent.includes('Smoke test caption')`);
    await inView(
      `const p = [...document.querySelectorAll('#doc p')].pop(); const r = document.createRange(); r.selectNodeContents(p); r.collapse(false); getSelection().removeAllRanges(); getSelection().addRange(r); p.closest('[contenteditable]').focus();`,
    );
    for (const ch of ' viewer edit') view.webContents.sendInputEvent({ type: 'char', keyCode: ch });
    const smokeMd = () => fs.readFileSync(path.join(root, 'smoke', 'session.md'), 'utf8');
    for (let i = 0; i < 30 && !smokeMd().includes('viewer edit'); i++) await new Promise((r) => setTimeout(r, 100));
    viewer['typing in the viewer saves session.md'] = smokeMd().includes('viewer edit');
    viewer['a viewer edit keeps the screenshot link'] = smokeMd().includes('![Screenshot 1](img/001.png)');
    viewer['viewer keeps the entry headings'] = JSON.stringify(sessions.shots(root, 'smoke')) === '[1]';
    sessions.addShot(root, 'smoke', fs.readFileSync(out), { caption: 'Second shot' });
    viewer['viewer reloads when a screenshot is added'] = await waitFor(
      `document.getElementById('doc').textContent.includes('Second shot')`,
    );
    viewer['the viewer edit survives the new screenshot'] = smokeMd().includes('viewer edit') && smokeMd().includes('Second shot');
    await inView(`document.getElementById('tab-shots').click(); document.activeElement.blur();`);
    view.webContents.sendInputEvent({ type: 'keyDown', keyCode: 'Right' });
    viewer['→ flips to the next screenshot'] = await waitFor(
      `document.getElementById('count').textContent === '2 of 2' && document.getElementById('shot').src.endsWith('img/002.png')`,
    );
    await inView(`document.getElementById('remove').click();`);
    viewer['Remove from Session takes it out'] = await waitFor(`document.getElementById('count').textContent === '1 of 1'`);
    viewer['the removed screenshot is kept in .discarded'] =
      !smokeMd().includes('Second shot') &&
      fs.readdirSync(path.join(root, '.discarded')).some((d) => d.endsWith(' · smoke · screenshot 2'));
    // Edit Again: the saved screenshot reopens with its marks, and saving replaces the entry
    const nextWindow = async (before: BrowserWindow[]) => {
      for (let i = 0; i < 50; i++) {
        const w = BrowserWindow.getAllWindows().find((x) => !before.includes(x));
        if (w) return w;
        await new Promise((r) => setTimeout(r, 100));
      }
      throw new Error('no new window');
    };
    const inWin = (w: BrowserWindow, js: string) => w.webContents.executeJavaScript(`(async () => { ${js} })()`);
    const loaded = (w: BrowserWindow) =>
      inWin(
        w,
        `for (let i = 0; i < 50 && !(background && captionField); i++) await new Promise((r) => setTimeout(r, 100)); await new Promise((r) => setTimeout(r, 300));`,
      );
    const counts = `return JSON.stringify([markers().length, cards().length, canvas.getObjects().filter((o) => links.has(o)).length, captionField.value(), markers().map(noteOf)[0]])`;
    viewer['Edit Again is offered for a saved screenshot'] = await waitFor(`!document.getElementById('edit').disabled`);
    let windows = BrowserWindow.getAllWindows();
    await inView(`document.getElementById('edit').click();`);
    const again = await nextWindow(windows);
    await new Promise<void>((r) => again.webContents.once('did-finish-load', () => r()));
    await loaded(again);
    const restored = JSON.parse(await inWin(again, counts));
    viewer['Edit Again restores references, cards, moves, comment and notes'] =
      JSON.stringify(restored) === JSON.stringify([3, 2, 1, 'Smoke test caption', 'Button is misaligned']);
    viewer['Edit Again says it saves changes'] = (await inWin(again, `return document.getElementById('save').textContent`)).startsWith(
      'Save changes',
    );
    await inWin(again, `captionField.focus();`);
    for (const ch of 'Edited ') again.webContents.sendInputEvent({ type: 'char', keyCode: ch });
    await new Promise((r) => setTimeout(r, 300));
    await inWin(again, `document.getElementById('save').click();`);
    for (let i = 0; i < 30 && !smokeMd().includes('Edited Smoke test caption'); i++) await new Promise((r) => setTimeout(r, 100));
    viewer['saving Edit Again replaces the entry in place'] =
      smokeMd().includes('Edited Smoke test caption') && JSON.stringify(sessions.shots(root, 'smoke')) === '[1]';
    view.close();

    // Esc on Select closes an editor without saving; it is kept in Discarded, and reopens with its marks
    fs.copyFileSync(shotCopy, path.join(root, 'discard.png'));
    const gone = openEditor(path.join(root, 'discard.png'));
    await new Promise<void>((r) => gone.webContents.once('did-finish-load', () => r()));
    await loaded(gone);
    await inWin(gone, `canvas.add(new Marker({ x: 50, y: 50 }, '#e11d48')); after();`);
    for (const key of ['Escape', 'Escape']) {
      gone.webContents.sendInputEvent({ type: 'keyDown', keyCode: key });
      await new Promise((r) => setTimeout(r, 200));
    }
    for (let i = 0; i < 30 && !gone.isDestroyed(); i++) await new Promise((r) => setTimeout(r, 100));
    const [kept] = sessions.discarded(root);
    viewer['Esc, Esc closes the editor'] = gone.isDestroyed();
    viewer['the closed screenshot is kept in Discarded'] =
      kept?.kind === 'capture' && JSON.parse(fs.readFileSync(path.join(kept.dir, 'state.json'), 'utf8')).items.length === 1;
    windows = BrowserWindow.getAllWindows();
    reopen(kept);
    const back = await nextWindow(windows);
    await new Promise<void>((r) => back.webContents.once('did-finish-load', () => r()));
    await loaded(back);
    viewer['Reopen brings it back with its marks'] = JSON.parse(await inWin(back, counts))[0] === 1 && !fs.existsSync(kept.dir);
    back.destroy();
    const checks: Record<string, boolean> = {
      ...inPage,
      ...viewer,
      'card drawn yellow': r3 > 235 && g3 > 225 && b3 > 150 && b3 < 225,
      'pdf exported': fs.readFileSync(pdf).subarray(0, 5).toString() === '%PDF-' && fs.statSync(pdf).size > 20_000,
      'image saved': fs.existsSync(out),
      'mock is not blank': pixel(shotCopy, 0.02, 0.02).join() !== pixel(shotCopy, 0.5, 0.5).join(),
      'prompt explains every mark': (() => {
        const p = promptFor(root);
        const { GROUPS: all } = require('../src/tools') as { GROUPS: ToolGroup[] };
        return all.flatMap((g) => g.tools).every((t) => t.id === 'select' || p.includes(`- ${t.label}: `));
      })(),
      'prompt has no Tick or Thumbs up': !/Tick|Thumbs/.test(promptFor(root)),
      'prompt says Reference, not Numbered':
        promptFor(root).includes('references (numbered circles)') && !/Numbered|numbered marker/.test(promptFor(root)),
      'fits AI limits': Math.max(outSize.width, outSize.height) <= 1568 && outSize.width * outSize.height <= 1_150_000,
      'aspect kept': Math.abs(outSize.width / outSize.height - shotSize.width / shotSize.height) < 0.01,
      'small image untouched': fitForAI(big(800, 600)).equals(big(800, 600)),
      'large image shrunk':
        JSON.stringify(nativeImage.createFromBuffer(fitForAI(big(3000, 1000))).getSize()) === JSON.stringify({ width: 1568, height: 523 }),
      'marker drawn red': r1 > 180 && g1 < 90 && b1 < 120,
      'session.md path is absolute':
        sessionMdPath(path.join(root, 'smoke')) === path.resolve(root, 'smoke', 'session.md') && path.isAbsolute(sessionMdPath('rel')),
      'prompt points at session.md': promptFor(path.join(root, 'smoke')).includes(`"${path.join(root, 'smoke', 'session.md')}"`),
      'markdown has card': md.includes('- Card: Make this bigger'),
      'markdown has move': md.includes('- Moved an element'),
      'markdown has image': md.includes('img/001.png'),
      'markdown has caption': md.includes('Smoke test caption'),
      'notes saved as Markdown, inside their numbered item':
        md.includes('3. # Title') && /\n {3}[-*] item\n/.test(md) && md.includes('\n   **bold**'),
      'markdown has numbered notes': md.includes('1. Button is misaligned\n2. Typo here'),
    };
    console.log(md);
    console.log(`root: ${root}`);
    for (const [name, pass] of Object.entries(checks)) console.log(`${pass ? '✓' : '✗'} ${name}`);
    const ok = Object.values(checks).every(Boolean);
    console.log(ok ? 'smoke: ok' : `smoke: FAILED (${[r1, g1, b1]})`);
    app.exit(ok ? 0 : 1);
  })
  .catch((e: unknown) => {
    console.error(e);
    console.log('smoke: FAILED');
    app.exit(1);
  });
