// Drives the real editor window on a rendered mock page (never your real screen): draw each tool, add marker notes, save.
import fs from 'fs';
import os from 'os';
import path from 'path';
import { app, BrowserWindow, nativeImage, nativeTheme, screen } from 'electron';

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
// state.json goes to the temp folder, never the dev app's real user data folder (F110)
app.setPath('userData', path.join(root, 'userData'));
const {
  openEditor,
  openViewer,
  reopen,
  setActive,
  fitForAI,
  cutParts,
  promptFor,
  sessionMdPath,
  pickArea,
  scrollCapture,
  desk,
  setSingleKeys,
  menuItems,
  moveEditor,
  openCaptureBar,
  barTipWindow,
  setCapture,
  openSettings,
  showShortcuts,
} = require('../src/main') as typeof import('../src/main');
// Never the owner's clipboard, never a dialog that waits for a click: Copy Image and Save As… land here.
let copied: Buffer | null = null;
let offered = '';
const savedAs = path.join(root, 'saved-as.png');
desk.copyImage = async (png) => void (copied = png);
desk.savePath = async (_win, opts) => {
  offered = opts.defaultPath ?? '';
  return { canceled: false, filePath: savedAs };
};
desk.recognize = async () => null; // as on Linux, where there is no Vision; the auto-redact checks feed their own text
// Never a notification on the owner's screen, never their clipboard, never a real screencapture: kept here instead.
const notes: { body: string; onClick?: () => void }[] = [];
desk.notify = (body, onClick) => void notes.push({ body, onClick });
let copiedText = '';
desk.copyText = (text) => void (copiedText = text);
desk.screencapture = (_args, done) => done(new Error('no screencapture in the smoke test'), '');
const sessions = require('../src/sessions') as typeof import('../src/sessions');
const { exportPdf } = require('../src/exporter') as typeof import('../src/exporter');

// Headless Linux (xvfb) has no GPU; capturePage fails with UnknownVizError unless compositing runs on the CPU.
if (process.platform === 'linux') app.disableHardwareAcceleration();
// Electron 45 on macOS: a window behind another app's sometimes has no frame yet (UnknownVizError); repaint, try once more.
const capture = (wc: Electron.WebContents) =>
  wc.capturePage().catch(async () => {
    wc.invalidate();
    await new Promise((r) => setTimeout(r, 500));
    return wc.capturePage();
  });

setTimeout(() => {
  console.log('smoke: TIMEOUT');
  app.exit(1);
}, 150000); // the whole suite; it grows with each milestone and runs slower on a busy machine
app
  .whenReady()
  .then(async () => {
    const mock = new BrowserWindow({ width: 1200, height: 700 }); // must be visible: Linux cannot capture hidden windows
    await mock.loadURL(`data:text/html,${encodeURIComponent(MOCK)}`);
    await new Promise((r) => setTimeout(r, 300)); // first paint
    const shot = path.join(root, 'mock.png');
    fs.writeFileSync(shot, (await capture(mock.webContents)).toPNG());
    mock.destroy();
    const shotSize = nativeImage.createFromPath(shot).getSize();
    const shotCopy = path.join(root, 'mock-copy.png'); // openEditor deletes its input on close
    fs.copyFileSync(shot, shotCopy);
    const why: Record<string, unknown> = {}; // what some checks saw, printed when the suite fails
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
    // WCAG contrast of two [r, g, b] colours
    const lum = (c) => c.slice(0, 3).map((v) => (v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4).reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0);
    const contrast = (a, b) => (Math.max(lum(a), lum(b)) + 0.05) / (Math.min(lum(a), lum(b)) + 0.05);
    // Notes are Markdown fields (contenteditable). A new reference's field is mounted and focused a moment after the click.
    const note = async (text) => { for (let i = 0; i < 50 && !document.activeElement?.closest?.('#refs .md'); i++) await sleep(20); document.execCommand('insertText', false, text); document.activeElement.blur(); };
    const setMd = (el, lines) => { el.querySelector('.ProseMirror').focus(); document.execCommand('selectAll'); lines.forEach((l, i) => { if (i) document.execCommand('insertParagraph'); document.execCommand('insertText', false, l); }); };
    const r = {};
    // Header like the mock (F111–F113): a title row that drags, icon Undo and Redo, one Copy or Save button
    r['F111 title row'] = (() => { const t = document.querySelector('.titlebar'); return !!t && t.textContent.trim() === 'Snapmark' && !!t.querySelector('svg') && getComputedStyle(t).getPropertyValue('-webkit-app-region') === 'drag'; })();
    r['F112 Undo and Redo are icons'] = [['undo', 'Undo (⌘Z)'], ['redo', 'Redo (⇧⌘Z)']].every(([id, name]) => { const b = document.getElementById(id); return !!b.querySelector('svg') && b.textContent.trim() === '' && b.title === name && b.getAttribute('aria-label') === name; });
    r['F113 one Copy or Save button'] = !document.getElementById('copy') && !document.getElementById('save-as') && !!document.getElementById('share');
    r['References hidden before the first reference'] = document.getElementById('refs-label').hidden && !document.querySelector('#refs .md');
    key('a', { metaKey: true });
    const emptyRefused = !canvas.getActiveObject(); // F12: ⌘A with no marks does nothing

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

    // F102 needs white under the highlight. The mock's layout moves when a small display shrinks its window (the macOS
    // release runner gave 239 grey at a fixed spot), so find a white patch first: one read of the canvas, every pixel
    // of a 0.15 × 0.05 patch at 250 or more.
    const white = (() => {
      canvas.renderAll();
      const el = canvas.lowerCanvasEl, { data } = el.getContext('2d').getImageData(0, 0, el.width, el.height);
      const ok = (fx, fy) => { for (let y = Math.round(fy * el.height); y < (fy + .05) * el.height; y += 2) for (let x = Math.round(fx * el.width); x < (fx + .15) * el.width; x += 2) { const i = (y * el.width + x) * 4; if (data[i] < 250 || data[i + 1] < 250 || data[i + 2] < 250) return false; } return true; };
      for (let fy = .2; fy < .9; fy += .02) for (let fx = .05; fx < .8; fx += .02) if (ok(fx, fy)) return [fx, fy];
      return null;
    })();
    const [wx, wy] = white ?? [.25, .3];
    drag('6', [[wx, wy],[wx + .15, wy + .05]]);       // highlighter
    const lit = px(wx + .07, wy + .02);
    console.log('F102', JSON.stringify({ white, lit }));
    r['F102 a highlight over white is as before'] = !!white && [253, 232, 150].every((v, i) => Math.abs(lit[i] - v) <= 2);
    const dark = px(.37, .04);
    drag(null, [[.30,.02],[.45,.06]]);                // over the mock's dark header
    r['F101 a highlight over the dark header reads at 3:1'] = contrast(px(.37, .04), dark) >= 3;
    key('z', { metaKey: true });
    const corner = px(.02, .98);
    drag('6', [[.45,.25],[.55,.35]]);                 // spotlight
    r.spotlightDims = px(.02, .98)[0] < corner[0] * 0.7;
    key('z', { metaKey: true });
    r.undoRemovesSpotlight = px(.02, .98).join() === corner.join();
    r['Undo and Redo buttons follow the history'] = !document.getElementById('undo').disabled && !document.getElementById('redo').disabled;
    key('z', { metaKey: true, shiftKey: true });
    r['⇧⌘Z redoes the spotlight'] = px(.02, .98)[0] < corner[0] * 0.7 && document.getElementById('redo').disabled;
    key('z', { metaKey: true });
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
    const stackOk = (b, i) => { const g = GROUPS[i], svg = b.querySelector('svg'), ref = document.createElementNS('http://www.w3.org/2000/svg', 'g'); ref.innerHTML = g.tools[variant[i]].icon; return svg.querySelector(':scope > .front').innerHTML === ref.innerHTML && svg.querySelectorAll('.back').length === (g.tools.length > 1 ? 1 : 0); };
    r['toolbar: key under each button, a stacked icon (current tool in front) where a key has more tools, no dots'] = [...document.querySelectorAll('#tools .cap')].every((c, i) => { const g = GROUPS[i]; return c.children.length === 1 && c.textContent === capFor(g, true) && c.querySelector('kbd').textContent === capFor(g, true); }) && btns.every(stackOk) && !document.querySelector('#tools .dots') && !/[●○]/.test(document.getElementById('tools').textContent);
    r['F103 captions read C, ⌘1–⌘7'] = [...document.querySelectorAll('#tools .cap kbd')].map((k) => k.textContent).join() === 'C,⌘1,⌘2,⌘3,⌘4,⌘5,⌘6,⌘7';
    const css = (sel, pseudo) => getComputedStyle(document.querySelector(sel), pseudo);
    r['F107 toolbar sizes'] = css('#tools svg').width === '22px' && css('#tools svg').height === '22px' && css('#tools button').width === '40px' && css('#tools button').height === '36px' && css('#tools .cap').fontSize === '11px' && css('#tools .cap').color === getComputedStyle(document.body).color;
    pick('box');
    const tb = () => document.querySelector('#tools [data-group="2"]');
    r['toolbar: active button has a blue tint and a blue icon (#0f72db light, 3.8:1 on the tint)'] = tb().getAttribute('aria-pressed') === 'true' && getComputedStyle(tb()).backgroundColor.startsWith('rgba(36, 146, 255') && getComputedStyle(tb()).color === (matchMedia('(prefers-color-scheme: dark)').matches ? 'rgb(36, 146, 255)' : 'rgb(15, 114, 219)');
    r['"Add to session" is the darker brand blue, for white text'] = getComputedStyle(document.getElementById('save')).backgroundColor === 'rgb(15, 114, 219)';
    r['toolbar: tooltip names the tool, key and next tool'] = tb().title === 'Box (2 or ⌘2) · press again for Ellipse' && document.querySelector('#tools [data-group="3"]').title === 'Arrow (3 or ⌘3)';
    key('2');
    r['toolbar: pressing the key again swaps the icon'] = tool() === 'ellipse' && tb().dataset.tool === 'ellipse' && stackOk(tb(), group);
    document.querySelector('#tools [data-group="4"]').click();
    r['toolbar: click picks the tool'] = tool() === 'pen';
    r['keys: Arrow on 3, Pen on 4, crosses on 5'] = ['3:arrow', '4:pen', '5:cross'].every((k) => { const [key, id] = k.split(':'); return GROUPS.find((g) => g.key === key).tools[0].id === id; });
    r['no Tick, Thumbs up or Crossed box anywhere'] = !GROUPS.flatMap((g) => g.tools).some((t) => ['tick', 'thumb', 'xbox'].includes(t.id));
    // Palette: ten presets and Custom…, the next mark takes the pick, Esc closes it and nothing else
    const sw = document.getElementById('swatch'), pal = document.getElementById('palette');
    const presets = [...document.querySelectorAll('#presets button')];
    pick('box'); sw.click();
    r['palette: the swatch opens ten presets, coral red picked, then Custom…'] = !pal.hidden && presets.length === 10 && presets[0].dataset.color === '#e5484d' && presets[0].getAttribute('aria-pressed') === 'true' && document.activeElement === presets[0] && !!pal.querySelector('.custom input[type="color"]') && pal.querySelector('.custom').textContent.trim() === 'Custom…';
    document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }));
    r['palette: arrows move between the presets'] = document.activeElement === presets[5];
    document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    r['palette: Esc closes it, back on the swatch, the tool stays'] = pal.hidden && document.activeElement === sw && tool() === 'box';
    sw.click(); presets.find((b) => b.title === 'Violet').click();
    r['palette: a pick closes it and shows on the swatch'] = pal.hidden && sw.querySelector('i').style.background === 'rgb(139, 61, 255)';
    drag(null, [[.7,.05],[.8,.15]]);
    r['palette: the next mark uses the picked colour'] = canvas.getObjects().at(-1).stroke === '#8b3dff';
    drag('5', [[.82,.05],[.9,.12]]);
    r['palette: remove marks stay coral red'] = canvas.getObjects().at(-1).stroke === '#e5484d';
    key('z', { metaKey: true }); key('z', { metaKey: true });
    sw.click(); presets[0].click(); // back to coral red
    // A15: the hex field takes a code with or without "#", 3 or 6 digits, any case, spaces around it; Enter or leaving it
    // applies it; a bad code says so and changes nothing, and keys typed there never pick a tool
    const hex = document.getElementById('hex'), hexErr = document.getElementById('hex-error');
    const typeHex = (v, enter) => { hex.focus(); hex.value = v; hex.dispatchEvent(new Event('input', { bubbles: true })); if (enter) hex.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true })); else { hex.blur(); hex.dispatchEvent(new FocusEvent('blur')); } };
    const customRow = () => [...document.querySelectorAll('#customs button')].map((b) => b.dataset.color).join();
    sw.click();
    const shown = hex.value === 'e5484d' && document.querySelector('#palette .hex').textContent.trim().startsWith('#') && customRow() === '' && document.querySelectorAll('#customs .slot').length === 5;
    typeHex('  #12AB9F ', false);
    const byBlur = colorEl.value === '#12ab9f' && hexErr.hidden && !pal.hidden;
    typeHex('F0A', true);
    const byEnter = colorEl.value === '#ff00aa' && pal.hidden;
    const toolBefore = tool(), marksBefore = canvas.getObjects().length;
    canvas.setActiveObject(canvas.getObjects().at(-1)); // so a stray Backspace would show
    sw.click(); typeHex('zz12', true);
    const refused = colorEl.value === '#ff00aa' && !pal.hidden && !hexErr.hidden && hex.getAttribute('aria-invalid') === 'true' && document.activeElement === hex;
    ['3', 'c', 'Backspace'].forEach((k) => hex.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true })));
    const noTool = tool() === toolBefore && canvas.getObjects().length === marksBefore;
    canvas.discardActiveObject();
    hex.value = 'zz1'; hex.dispatchEvent(new Event('input', { bubbles: true }));
    const cleared = hexErr.hidden && !hex.hasAttribute('aria-invalid');
    hex.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
    r['A15 a hex code with or without #, 3 or 6 digits, any case, trimmed; a bad one says so and changes nothing'] = shown && byBlur && byEnter && refused && noTool && cleared && pal.hidden && colorEl.value === '#ff00aa';
    // A16: one row of custom colours under the two rows of presets, newest first, no presets, no repeats; the panel
    // opens on the colour picked last
    sw.click(); typeHex('e5484d', true); // a preset typed as hex stays out of the row
    const noPreset = colorEl.value === '#e5484d' && customRow() === '#ff00aa,#12ab9f';
    sw.click(); typeHex('12ab9f', true); // again: moves to the front, once
    const order = customRow() === '#12ab9f,#ff00aa' && document.querySelectorAll('#customs .slot').length === 3;
    sw.click();
    const opensOnIt = document.activeElement.closest('#customs') && document.activeElement.dataset.color === '#12ab9f' && document.activeElement.getAttribute('aria-pressed') === 'true';
    const rows = [...document.querySelectorAll('#palette .swatches')].map((g) => g.id).join() === 'presets,customs' && document.getElementById('customs-label').textContent === 'Custom' && !!pal.querySelector('.custom input[type="color"]');
    r['A16 two rows of presets, then a Custom row: newest first, no presets, no repeats; opens on the last pick'] = noPreset && order && !!opensOnIt && rows;
    // A17: the swatch and every dot in the panel are one 24 px circle, and the picked colour wears the same ring in both
    const swDot = sw.querySelector('i');
    const dot = (el) => { const s = getComputedStyle(el); return [s.width, s.height, s.borderRadius].join(); };
    const ring = (el) => { const s = getComputedStyle(el); return [s.outlineStyle, s.outlineWidth, s.outlineOffset, s.outlineColor].join(); };
    const picked = pal.querySelector('.swatches [aria-pressed="true"]'), other = pal.querySelector('.swatches [aria-pressed="false"]');
    r['A17 one 24 px circle for the swatch and the panel, one ring on the picked colour'] = dot(swDot) === '24px,24px,50%' && [...pal.querySelectorAll('.swatches > *')].every((b) => dot(b) === '24px,24px,50%') && ring(swDot) === ring(picked) && ring(picked).startsWith('solid,2px,2px') && getComputedStyle(other).outlineWidth === '0px';
    document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
    sw.click(); presets[0].click(); // back to coral red; the Custom row stays for the A16 check in the next editor
    // A18: one keycap style. Every key the editor shows is a <kbd> at 11 px, weight 500, in the system font, in the
    // colour of its text (a disabled button's in --muted), at 4.5:1 or more; under every icon button, after the label of every text button
    const kbds = [...document.querySelectorAll('kbd')];
    const keyStyle = (k) => { const s = getComputedStyle(k); return [s.fontSize, s.fontWeight, s.fontFamily.split(',')[0].trim()].join(); };
    const rgb = (c) => c.match(/[0-9.]+/g).slice(0, 3).map(Number);
    const ink = (k, ground) => contrast(rgb(getComputedStyle(k).color), rgb(getComputedStyle(ground).backgroundColor)) >= 4.5;
    const iconBtns = [...document.querySelectorAll('#tools button'), document.getElementById('undo'), document.getElementById('redo')];
    const below = (b) => { const c = b.parentElement.querySelector(':scope > .cap'), br = b.getBoundingClientRect(), cr = c.getBoundingClientRect(); return !!c.querySelector('kbd') && cr.top >= br.bottom && Math.abs(cr.left + cr.right - br.left - br.right) < 2; };
    const textBtns = [document.getElementById('cancel'), document.getElementById('save')];
    const after = (b) => { const k = b.lastElementChild, kr = k.getBoundingClientRect(), br = b.getBoundingClientRect(); return k.tagName === 'KBD' && b.firstChild.nodeType === 3 && kr.top > br.top && kr.bottom < br.bottom; };
    const heights = (els) => new Set(els.map((e) => e.getBoundingClientRect().height + '/' + getComputedStyle(e).paddingTop + '/' + getComputedStyle(e).paddingLeft)).size === 1;
    r['A18 one keycap style: 11 px, 500, system glyphs, its text colour at 4.5:1; under icon buttons, after text labels'] =
      kbds.length === 12 && kbds.every((k) => keyStyle(k) === '11px,500,-apple-system' && getComputedStyle(k).color === getComputedStyle(k.parentElement).color) &&
      iconBtns.every(below) && iconBtns.every((b) => ink(b.parentElement.querySelector('.cap kbd'), document.querySelector('header'))) &&
      textBtns.every((b) => after(b) && ink(b.querySelector('kbd'), b)) &&
      document.getElementById('save').textContent === 'Add to session ⌘↵' && document.getElementById('cancel').textContent === 'Discard ⌘W' &&
      heights([...document.querySelectorAll('header button')].filter((b) => b.id !== 'session')) && heights(textBtns);
    r['toolbar shows the session name alone while it is empty, then the count'] = document.getElementById('session').textContent === 'smoke' && shotsLabel('Ledgerly Q4 review', 12) === 'Ledgerly Q4 review · 12 screenshots' && shotsLabel('s', 1) === 's · 1 screenshot';
    const tail = bubbleTail(50, 20, { x: -200, y: -100 }, 2);
    r['card: the bubble tail leaves the top edge toward its target; none when the target is inside'] = !!tail && tail[2].y < -20 && tail[2].x < tail[0].x && tail[0].y === -18 && bubbleTail(50, 20, { x: 10, y: 5 }, 2) === null;
    r['no "Numbered" in the editor'] = !/numbered marker|Numbered/.test(document.body.innerText + GROUPS.flatMap((g) => g.tools.map((t) => t.label + (t.tip ?? ''))).join(' '));
    // Sidebar (F7-F10): fields grow with their text; the buttons stay in view while the body scrolls
    const cap = document.getElementById('caption');
    const oneLine = cap.clientHeight;
    r['comment is one line, "About the whole screenshot…"'] = cap.dataset.placeholder === 'About the whole screenshot…' && cap.dataset.empty === 'true' && oneLine < 50;
    const capHead = document.getElementById('caption-label');
    r['F12 the top box is headed General comment'] =
      capHead?.tagName === 'H2' && capHead.textContent === 'General comment' && !capHead.hidden && capHead.nextElementSibling === cap &&
      document.getElementById('refs-label').tagName === 'H2' && getComputedStyle(capHead).fontWeight === getComputedStyle(document.getElementById('refs-label')).fontWeight &&
      cap.querySelector('[contenteditable]').getAttribute('aria-labelledby') === 'caption-label';
    setMd(cap, ['a', 'b', 'c', 'd', 'e']); await sleep(50);
    r['comment grows as you type'] = cap.clientHeight > oneLine * 2 && cap.dataset.empty === 'false';
    const ref1 = document.querySelector('#refs .md');
    setMd(ref1, ['line', 'line', 'line', 'line', 'line', 'a long reference note that wraps inside the sidebar more than once']); await sleep(50);
    r['reference note shows all its text'] = ref1.scrollHeight <= ref1.clientHeight + 1 && ref1.clientHeight > oneLine * 3;
    r['References shown once one exists'] = !document.getElementById('refs-label').hidden;
    r['reference badge is a diamond in its marker colour'] = (() => { const s = getComputedStyle(document.querySelector('#refs .ref b'), '::before'); return s.backgroundColor === 'rgb(229, 72, 77)' && s.transform !== 'none'; })();
    setMd(ref1, Array(60).fill('x')); await sleep(50);
    const sb = document.getElementById('save').getBoundingClientRect();
    r['buttons stay in view while notes scroll'] = sb.bottom <= window.innerHeight && sb.top > 0 && document.querySelector('aside .body').scrollHeight > document.querySelector('aside .body').clientHeight;
    await sleep(100); setMd(ref1, ['Button is misaligned']); await sleep(100);
    r['restored reference note'] = ref1.textContent === 'Button is misaligned'; document.activeElement.blur();
    ref1.querySelector('.ProseMirror').focus();
    const toolBeforeNote = tool();
    document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: '2', bubbles: true }));
    r['tool keys do nothing while typing a note'] = tool() === toolBeforeNote;
    document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: '3', metaKey: true, bubbles: true, cancelable: true }));
    r['⌘3 picks Arrow from inside a note and leaves the note'] = tool() === 'arrow' && !document.activeElement?.closest?.('.md');
    ref1.querySelector('.ProseMirror').focus();
    document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    r['Esc leaves the note field'] = !document.activeElement?.closest?.('.md');
    key('1'); if (tool() !== 'card') key('1');
    const steps = undoStack.length, cardsBefore = cards().length;
    drag(null, [[.8,.8]]); key('z', { metaKey: true });
    r['⌘Z on a new empty card removes it and leaves no step'] = cards().length === cardsBefore && undoStack.length === steps;
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
    r['ghost: box follows the pointer, as its top left'] = top(cx, cy + d) > 0 && top(cx, cy) > 0 && top(cx - d, cy + d) === 0;
    key('2'); // Box -> Ellipse without moving
    r['ghost: pressing the key again shows the next shape'] = tool() === 'ellipse' && top(cx, cy) === 0 && top(cx, cy + d) > 0;
    up.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }));
    r['ghost: gone when the pointer leaves'] = top(cx, cy + d) === 0;
    ev('mousemove', .5, .5); key('c');
    r['ghost: gone on Select'] = top(cx, cy + d) === 0;
    canvas.off('object:added', count);
    r['ghost: never in the scene, undo or unsaved work'] = adds === 0 && canvas.getObjects().length === objs && undoStack.length === undos;
    pick('box'); drag(null, [[.5,.5]]);
    const clicked = canvas.getObjects().at(-1);
    r['click: the box starts at the pointer, where the ghost was'] = Math.abs(clicked.left - cx) < unit && Math.abs(clicked.top - cy) < unit && clicked.width === d * 2;
    key('z', { metaKey: true });
    pick('pen');
    const penCursor = canvas.freeDrawingCursor;
    pick('box');
    r['icon cursor for Pen, crosshair for Box'] = penCursor.startsWith('url(') && canvas.defaultCursor === 'crosshair';
    key('c');

    // F10–F14: arrows, ⌘A and a multi-selection, each taken back with ⌘Z so the saved image stays as drawn
    const dpr = window.devicePixelRatio;
    const marks = () => canvas.getObjects().filter((o) => o.selectable && !isRedaction(o));
    const round = (v) => Math.round(v * 100) / 100;
    const places = () => JSON.stringify(canvas.getObjects().map((o) => [round(o.left), round(o.top)]));
    canvas.discardActiveObject();
    const placed0 = places(), nums = markers().map((m) => m.n).join();
    const box = marks().find((o) => o instanceof Glyph);
    const [x0, y0, undos0] = [box.left, box.top, undoStack.length];
    canvas.setActiveObject(box);
    key('ArrowRight'); key('ArrowDown', { shiftKey: true });
    const nudged = box.left === x0 + dpr && box.top === y0 + 10 * dpr && undoStack.length === undos0 + 2;
    key('z', { metaKey: true });
    const oneBack = box.left === x0 + dpr && box.top === y0;
    key('z', { metaKey: true });
    r['F10 arrows nudge'] = nudged && oneBack && places() === placed0;
    canvas.setActiveObject(box);
    sw.click(); // the palette walks its swatches with the arrows, and they stop there
    document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }));
    r['palette: arrows never also nudge the selected mark'] = box.left === x0 && undoStack.length === undos0;
    document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));

    canvas.setActiveObject(box);
    const capText = cap.querySelector('.ProseMirror');
    capText.focus();
    const inText = (k, o = {}) => document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true, ...o }));
    inText('ArrowRight'); inText('a', { metaKey: true });
    r['F11 keys stay in the text'] = box.left === x0 && canvas.getActiveObject() === box;
    capText.blur();

    // Settings ▸ Single-Key Tools off (WCAG 2.1.4): a plain digit picks no tool, ⌘ with it still does
    singleKeys = false;
    const t0 = tool();
    key('3');
    const plainIgnored = tool() === t0;
    key('3', { metaKey: true });
    r['Single-Key Tools off: only ⌘1–⌘7 pick tools'] = plainIgnored && tool() === 'arrow';
    singleKeys = true;
    key('c');

    key('5'); // a drawing tool: ⌘A switches to Select
    key('a', { metaKey: true });
    const all = canvas.getActiveObject();
    r['F12 ⌘A selects all marks'] = emptyRefused && tool() === 'select' && all instanceof fabric.ActiveSelection &&
      all.getObjects().length === marks().length && !all.getObjects().some(isRedaction) && canvas.getObjects().some(isRedaction);

    const undos1 = undoStack.length;
    key('ArrowRight');
    const groupStep = undoStack.length === undos1 + 1;
    const stored = stateOf().items;
    r['F14 a selection is dropped before storing'] = !canvas.getActiveObject() &&
      stored.some((i) => i.t === 'glyph' && round(i.left) === round(x0 + dpr) && round(i.top) === round(y0));
    key('z', { metaKey: true });
    const movedBack = places() === placed0;
    key('a', { metaKey: true }); key('Backspace');
    const removed = marks().length === 0 && undoStack.length === undos1 + 1;
    key('z', { metaKey: true });
    r['F13 a multi-selection is one step'] = groupStep && movedBack && removed && places() === placed0 && markers().map((m) => m.n).join() === nums;

    // F13, F14: with three or more references, each note asks "What about n?" and the rows stand 12 pt apart. The
    // references added here are undone again, so what follows sees the session as before.
    document.activeElement?.blur?.();
    const refsBefore = document.querySelectorAll('#refs .ref').length;
    let refsAdded = 0; // names unique in this page script: it is one scope, and tsc never sees it
    for (const fx of [.05, .1, .15]) {
      if (document.querySelectorAll('#refs .ref').length >= 3) break;
      key('1'); if (tool() !== 'marker') key('1');
      drag(null, [[fx, .92]]); refsAdded++; await sleep(150); document.activeElement?.blur?.();
    }
    const refRows = [...document.querySelectorAll('#refs .ref')];
    const refGaps = refRows.slice(1).map((row, i) => row.getBoundingClientRect().top - refRows[i].getBoundingClientRect().bottom);
    r['F13 a note asks What about n'] =
      refRows.length >= 2 && refRows.every((row) => row.querySelector('.md').dataset.placeholder === 'What about ' + row.querySelector('b').textContent + '?');
    r['F14 notes stand 12 pt apart'] = refRows.length >= 3 && refGaps.every((g) => Math.abs(g - 12) <= 1);
    console.log('F13 F14 ' + JSON.stringify({ rows: refRows.length, gaps: refGaps, refsAdded }));
    for (let i = 0; i < refsAdded; i++) key('z', { metaKey: true });
    await sleep(100);
    r['F13/F14 the added references are undone'] = document.querySelectorAll('#refs .ref').length === refsBefore;
    setMd(cap, ['Smoke test caption']); document.activeElement.blur();
    return r;
  })()`;
    const inPage: Record<string, boolean> = await win.webContents.executeJavaScript(js);
    inPage['F111 title row'] &&= win.getTitle() === 'Snapmark — smoke'; // the window title stays, for the Window menu
    // F12, F13: the names a screen reader hears, from Chromium's own accessibility tree, on the editable elements
    const dbg = win.webContents.debugger;
    dbg.attach('1.3');
    await dbg.sendCommand('Accessibility.enable');
    const { nodes } = (await dbg.sendCommand('Accessibility.getFullAXTree')) as {
      nodes: { role?: { value: string }; name?: { value: string } }[];
    };
    dbg.detach();
    const fieldNames = nodes.filter((n) => n.role?.value === 'textbox').map((n) => n.name?.value ?? '');
    const refNums: string[] = await win.webContents.executeJavaScript(
      `[...document.querySelectorAll('#refs .ref b')].map((b) => b.textContent)`,
    );
    console.log('F12 F13 names', JSON.stringify({ fieldNames, refNums }));
    inPage['F12 the top box is headed General comment'] &&= fieldNames.includes('General comment');
    inPage['F13 a note asks What about n'] &&= refNums.length > 0 && refNums.every((n) => fieldNames.includes(`Note for reference ${n}`));
    // F106: Settings ▸ Single-Key Tools redraws an open editor's captions and tooltips, without reopening it
    const toolbarSays = (cap: string, tip: string) =>
      win.webContents.executeJavaScript(`(async () => {
        const ok = () => document.querySelector('#tools .cap kbd').textContent === ${JSON.stringify(cap)} && document.querySelector('#tools [data-group="2"]').title === ${JSON.stringify(tip)};
        for (let i = 0; i < 10 && !ok(); i++) await new Promise((r) => setTimeout(r, 100));
        return ok();
      })()`);
    setSingleKeys(false);
    const redrawnOff = await toolbarSays('Esc', 'Box (⌘2) · press ⌘2 again for Ellipse');
    setSingleKeys(true);
    inPage['F106 the setting redraws the toolbar'] = redrawnOff && (await toolbarSays('C', 'Box (2 or ⌘2) · press again for Ellipse'));
    // F110: the setting (Settings ▸ Shortcuts ▸ Pick tools with single keys calls setSingleKeys; F225 clicks it) saves
    // to state.json in the temp folder and tells the editor
    setSingleKeys(false);
    const stateFile = path.join(root, 'userData', 'state.json');
    const savedOff = fs.existsSync(stateFile) && JSON.parse(fs.readFileSync(stateFile, 'utf8')).singleKeys === false;
    const editorOff = await win.webContents.executeJavaScript(
      `(async () => { for (let i = 0; i < 10 && singleKeys; i++) await new Promise((r) => setTimeout(r, 100)); return singleKeys === false; })()`,
    );
    setSingleKeys(true);
    inPage['F110 the setting reaches state.json and the editor'] = savedOff && editorOff;
    // F108: at the minimum size the toolbar shows every control without scrolling sideways; the session label shortens
    const [w0, h0] = win.getSize();
    win.setSize(820, 520);
    await new Promise((r) => setTimeout(r, 300));
    inPage['F108 the toolbar fits at 820 points'] =
      JSON.stringify(win.getMinimumSize()) === JSON.stringify([820, 520]) &&
      (await win.webContents.executeJavaScript(
        `(() => { const h = document.querySelector('header'); return h.scrollWidth <= h.clientWidth && getComputedStyle(document.getElementById('session')).textOverflow === 'ellipsis'; })()`,
      ));
    win.setSize(w0, h0);
    await new Promise((r) => setTimeout(r, 300));
    // Real input events (not synthetic DOM ones) include the browser's default mousedown handling, which moved focus.
    const at = await win.webContents.executeJavaScript(`(() => {
      group = GROUPS.findIndex((g) => g.key === '1'); variant[group] = 0; applyTool();
      const b = document.querySelector('.upper-canvas').getBoundingClientRect();
      return { x: Math.round(b.left + b.width * .8), y: Math.round(b.top + b.height * .3) };
    })()`);
    win.focus();
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const click = async () => {
      win.webContents.sendInputEvent({ type: 'mouseDown', x: at.x, y: at.y, button: 'left', clickCount: 1 });
      win.webContents.sendInputEvent({ type: 'mouseUp', x: at.x, y: at.y, button: 'left', clickCount: 1 });
      await sleep(300);
    };
    const inNote = `!!document.activeElement?.isContentEditable && !!document.activeElement.closest('#refs .md')`;
    const refs = (): Promise<number> => win.webContents.executeJavaScript('markers().length');
    const cmdZ = async (shift = false) => {
      const ev: Omit<Electron.KeyboardInputEvent, 'type'> = { keyCode: shift ? 'Z' : 'z', modifiers: shift ? ['meta', 'shift'] : ['meta'] };
      win.webContents.sendInputEvent({ type: 'keyDown', ...ev });
      win.webContents.sendInputEvent({ type: 'keyUp', ...ev }); // or the next typed character counts as ⌘ + that key
      await sleep(200);
    };
    // snap-c5c F13: two marks dragged with the real mouse move together as one step; one ⌘Z puts both back
    const pair = await win.webContents.executeJavaScript(`(() => {
      group = GROUPS.findIndex((g) => g.key === 'c'); variant[group] = 0; applyTool();
      const two = canvas.getObjects().filter((o) => o instanceof Glyph).slice(0, 2);
      window.pair = two;
      const at = JSON.stringify(two.map((o) => [o.left, o.top]));
      select(two);
      const c = fabric.util.transformPoint(canvas.getActiveObject().getCenterPoint(), canvas.viewportTransform);
      const b = document.querySelector('.upper-canvas').getBoundingClientRect(), k = b.width / canvas.getWidth();
      return { x: Math.round(b.left + c.x * k), y: Math.round(b.top + c.y * k), at, steps: undoStack.length };
    })()`);
    win.webContents.sendInputEvent({ type: 'mouseDown', x: pair.x, y: pair.y, button: 'left', clickCount: 1 });
    for (let i = 1; i <= 5; i++)
      win.webContents.sendInputEvent({
        type: 'mouseMove',
        x: pair.x + i * 8,
        y: pair.y + i * 6,
        button: 'left',
        modifiers: ['leftbuttondown'],
      });
    win.webContents.sendInputEvent({ type: 'mouseUp', x: pair.x + 40, y: pair.y + 30, button: 'left', clickCount: 1 });
    await sleep(300);
    const pairNow = `(() => { canvas.discardActiveObject(); return JSON.stringify({ at: pair.map((o) => [o.left, o.top]), steps: undoStack.length }); })()`;
    const dragged2 = JSON.parse(await win.webContents.executeJavaScript(pairNow));
    const was = JSON.parse(pair.at) as number[][];
    const [dx, dy] = [dragged2.at[0][0] - was[0][0], dragged2.at[0][1] - was[0][1]];
    const movedTogether =
      dx > 0 &&
      dy > 0 &&
      dragged2.at.every((p: number[], i: number) => Math.abs(p[0] - was[i][0] - dx) < 0.01 && Math.abs(p[1] - was[i][1] - dy) < 0.01);
    await cmdZ();
    const undone2 = JSON.parse(await win.webContents.executeJavaScript(pairNow));
    why.F13 = { pair, dragged2, undone2 };
    inPage['snap-c5c F13: two marks dragged with the mouse are one step, one ⌘Z puts both back'] =
      movedTogether &&
      dragged2.steps === pair.steps + 1 &&
      undone2.at.every((p: number[], i: number) => Math.abs(p[0] - was[i][0]) < 0.01 && Math.abs(p[1] - was[i][1]) < 0.01) &&
      undone2.steps === pair.steps;
    await win.webContents.executeJavaScript(`group = GROUPS.findIndex((g) => g.key === '1'); variant[group] = 0; applyTool();`);
    await click();
    const placed = await refs();
    await cmdZ();
    inPage['⌘Z in a new reference’s empty note removes the reference'] =
      (await refs()) === placed - 1 && !(await win.webContents.executeJavaScript(inNote));
    await click();
    inPage['a new reference is ready to type into'] = await win.webContents.executeJavaScript(inNote);
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
    const noteText = (): Promise<string | null> =>
      win.webContents.executeJavaScript(`document.activeElement?.closest?.('.md')?.textContent ?? null`);
    const [typed, count] = [await noteText(), await refs()];
    await cmdZ();
    const [undone, countAfter] = [await noteText(), await refs()];
    await cmdZ(true);
    inPage['⌘Z in a note undoes its typing, not a mark; ⇧⌘Z redoes it'] =
      countAfter === count && undone !== null && undone !== typed && (await noteText()) === typed;
    win.webContents.invalidate(); // capturePage can return a stale frame for a window that is not in front
    await new Promise((r) => setTimeout(r, 500)); // let the canvas repaint before capturing
    fs.writeFileSync(path.join(root, 'editor.png'), (await capture(win.webContents)).toPNG());
    // Copy Image (⇧⌘C, from inside the note) and Save As… (⇧⌘S): the image Add to session saves, and no entry
    await win.webContents.executeJavaScript(
      `document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'c', metaKey: true, shiftKey: true, bubbles: true, cancelable: true }))`,
    );
    await win.webContents.executeJavaScript(
      `document.dispatchEvent(new KeyboardEvent('keydown', { key: 's', metaKey: true, shiftKey: true, bubbles: true, cancelable: true }))`,
    );
    for (let i = 0; i < 30 && !(copied && fs.existsSync(savedAs)); i++) await new Promise((r) => setTimeout(r, 100));
    const notAdded = sessions.count(root, 'smoke') === 0;
    // F9: plain ⌘C outside the text copies the image too, and the marks stay selected
    const shiftCopied = copied;
    copied = null;
    const keptMarks: number = await win.webContents.executeJavaScript(`(() => {
      document.activeElement.blur();
      select(canvas.getObjects().filter((o) => o.selectable && !isRedaction(o)));
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'c', metaKey: true, bubbles: true, cancelable: true }));
      return canvas.getActiveObjects().length;
    })()`);
    for (let i = 0; i < 30 && !copied; i++) await new Promise((r) => setTimeout(r, 100));
    inPage['F9 ⌘C copies the image'] =
      !!copied && keptMarks > 1 && (await win.webContents.executeJavaScript('canvas.getActiveObjects().length')) === keptMarks;
    // F134: ⇧⌘C and the Copy or Save menu's Copy Image keep the selected marks selected, as ⌘C does
    const keepsTwo = async (copy: () => unknown) => {
      copied = null;
      await win.webContents.executeJavaScript(
        `document.activeElement.blur(); select(canvas.getObjects().filter((o) => o.selectable && !isRedaction(o)).slice(0, 2));`,
      );
      await copy();
      for (let i = 0; i < 30 && !copied; i++) await sleep(100);
      return !!copied && (await win.webContents.executeJavaScript('canvas.getActiveObjects().length')) === 2;
    };
    const keptByKeys = await keepsTwo(() =>
      win.webContents.executeJavaScript(
        `document.dispatchEvent(new KeyboardEvent('keydown', { key: 'c', metaKey: true, shiftKey: true, bubbles: true, cancelable: true }))`,
      ),
    );
    const keptByMenu = await keepsTwo(() => win.webContents.send('editor:share', 'copy')); // what the menu item sends
    await win.webContents.executeJavaScript('canvas.discardActiveObject()');
    copied = shiftCopied; // the ⇧⌘C check below compares that copy
    // F7: ⌘S adds to the session as ⌘↵ does, here while the caption has the cursor
    await win.webContents.executeJavaScript(`(() => {
      document.querySelector('#caption .ProseMirror').focus();
      document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 's', metaKey: true, bubbles: true, cancelable: true }));
    })()`);
    for (let i = 0; i < 30 && sessions.count(root, 'smoke') === 0; i++) await new Promise((r) => setTimeout(r, 100));
    inPage['F7 ⌘S adds to the session'] = sessions.count(root, 'smoke') === 1;
    await new Promise((r) => setTimeout(r, 800));
    const md = fs.readFileSync(path.join(root, 'smoke', 'session.md'), 'utf8');
    const out = path.join(root, 'smoke', 'img', '001.png');
    const added = fs.existsSync(out) ? fs.readFileSync(out) : Buffer.alloc(0); // Edit Again replaces it further down
    const unit = Math.max(2, Math.round(Math.max(shotSize.width, shotSize.height) / 400));
    const outSize = nativeImage.createFromPath(out).getSize();
    const k = outSize.width / shotSize.width; // saved image may be downscaled for AI
    const tip = unit * 8 * k; // a reference's centre-to-tip in the saved image
    const red = ([r, g, b]: number[]) => r > 180 && g < 90 && b < 120;
    const [r1, g1, b1] = pixel(out, 0.5, 0.5, -tip * 0.45); // left side of marker 1, beside its digit
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
    viewer['header counts the screenshots'] = await waitFor(`document.getElementById('total').textContent === '· 2 screenshots'`);
    await inView(`document.getElementById('tab-shots').click(); document.activeElement.blur();`);
    viewer['the Screenshots grid has a thumbnail per screenshot, with heading and notes'] = await waitFor(
      `[...document.querySelectorAll('#grid .thumb')].map((t) => t.querySelector('.notes').textContent).join() === '3 notes,No notes' && /^001 · \\d\\d:\\d\\d$/.test(document.querySelector('#grid .heading').textContent)`,
    );
    await inView(`document.querySelector('#grid .thumb .pic').click();`);
    view.webContents.sendInputEvent({ type: 'keyDown', keyCode: 'Right' });
    viewer['a thumbnail opens one at a time; → flips to the next screenshot'] = await waitFor(
      `document.getElementById('count').textContent === '2 of 2' && document.getElementById('shot').src.includes('img/002.png')`,
    );
    view.webContents.sendInputEvent({ type: 'keyDown', keyCode: 'Escape' });
    viewer['Esc goes back to the grid'] = await waitFor(
      `!document.getElementById('grid-view').hidden && document.getElementById('shots').hidden`,
    );
    await inView(`document.querySelectorAll('#grid .thumb .more')[1].click(); document.getElementById('menu-remove').click();`);
    viewer['Remove from Session (… menu) takes it out'] = await waitFor(`document.querySelectorAll('#grid .thumb').length === 1`);
    viewer['the removed screenshot is kept in .discarded'] =
      !smokeMd().includes('Second shot') &&
      fs.readdirSync(path.join(root, '.discarded')).some((d) => d.endsWith(' · smoke · screenshot 2'));
    // Finder's keys in the session window, as real key events (F17, F16; F18 opens Edit Again below)
    const keyIn = (keyCode: string, modifiers: Electron.KeyboardInputEvent['modifiers'] = []) => {
      view.webContents.sendInputEvent({ type: 'keyDown', keyCode, modifiers });
      view.webContents.sendInputEvent({ type: 'keyUp', keyCode, modifiers });
    };
    const thumbs = () => inView(`return document.querySelectorAll('#grid .thumb').length`);
    await inView(`document.activeElement.blur();`);
    keyIn('z', ['meta']);
    const putBack = await waitFor(`document.getElementById('count').textContent === '2 of 2' && !document.getElementById('shots').hidden`);
    keyIn('z', ['meta']); // once only
    await new Promise((r) => setTimeout(r, 300));
    viewer['F17 ⌘Z puts it back'] = putBack && smokeMd().includes('Second shot') && (await thumbs()) === 2;
    keyIn('Backspace', ['meta']);
    const removedByKey = (await waitFor(`document.getElementById('count').textContent === '1 of 1'`)) && !smokeMd().includes('Second shot');
    keyIn('Escape');
    keyIn('Backspace', ['meta']); // the grid has no screenshot shown large
    await new Promise((r) => setTimeout(r, 300));
    viewer['F16 ⌘⌫ removes the open screenshot'] = removedByKey && (await thumbs()) === 1;
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
    // F131: ⌘Z after ⌘⌫ puts back the screenshot ⌘⌫ removed, also when a newer discard exists (an editor closed unsaved)
    await inView(`document.querySelector('#grid .thumb .pic').click(); document.activeElement.blur();`);
    keyIn('Backspace', ['meta']);
    const removedOne = await waitFor(`document.querySelectorAll('#grid .thumb').length === 0`);
    fs.copyFileSync(shotCopy, path.join(root, 'newer.png'));
    const newer = openEditor(path.join(root, 'newer.png'), { session: 'smoke' });
    await new Promise<void>((r) => newer.webContents.once('did-finish-load', () => r()));
    await loaded(newer);
    newer.close();
    for (let i = 0; i < 30 && !newer.isDestroyed(); i++) await sleep(100);
    const newerKept = sessions.discardedIn(root, 'smoke').find((d) => d.kind === 'capture');
    await inView(`document.activeElement.blur();`);
    keyIn('z', ['meta']);
    viewer['F131 ⌘Z puts back the one removed'] =
      removedOne &&
      !!newerKept &&
      (await waitFor(
        `document.querySelectorAll('#grid .thumb').length === 1 && document.getElementById('count').textContent === '1 of 1'`,
      )) &&
      JSON.stringify(sessions.shots(root, 'smoke')) === '[1]';
    if (newerKept) fs.rmSync(newerKept.dir, { recursive: true, force: true }); // the Discarded tab checks below count one
    viewer['Edit Again is offered for a saved screenshot'] = await waitFor(`!document.querySelector('#grid .thumb .edit').hidden`);
    let windows = BrowserWindow.getAllWindows();
    // The grid's Edit Again button opens the editor too (snap-c5c)
    await inView(`document.querySelector('#grid .thumb .edit').click();`);
    const fromGrid = await nextWindow(windows);
    await new Promise<void>((r) => fromGrid.webContents.once('did-finish-load', () => r()));
    await loaded(fromGrid);
    viewer["snap-c5c the grid's Edit Again button opens the editor"] =
      fromGrid.webContents.getURL().endsWith('editor.html') &&
      (await inWin(fromGrid, `return document.getElementById('save').textContent`)).startsWith('Save changes');
    fromGrid.destroy();
    await sleep(300);
    windows = BrowserWindow.getAllWindows();
    // F18: ⌘O on the screenshot shown large is Edit Again
    await inView(`document.querySelector('#grid .thumb .pic').click();`);
    keyIn('o', ['meta']);
    const again = await nextWindow(windows);
    await new Promise<void>((r) => again.webContents.once('did-finish-load', () => r()));
    viewer['F18 ⌘O edits again'] = again.webContents.getURL().endsWith('editor.html');
    await loaded(again);
    const restored = JSON.parse(await inWin(again, counts));
    viewer['Edit Again restores references, cards, moves, comment and notes'] =
      JSON.stringify(restored) === JSON.stringify([3, 2, 1, 'Smoke test caption', 'Button is misaligned']);
    viewer['Edit Again shows the session and its count'] =
      (await inWin(again, `return document.getElementById('session').textContent`)) === 'smoke · 1 screenshot';
    viewer['Edit Again says it saves changes'] = (await inWin(again, `return document.getElementById('save').textContent`)).startsWith(
      'Save changes',
    );
    // F115: Edit Again (and one-shot, below) shows the session as plain text, with no chevron and no menu
    const noSessionMenu = (w: BrowserWindow) =>
      inWin(w, `const s = document.getElementById('session'); return s.disabled && !s.querySelector('.chevron');`);
    const noMenuAgain = await noSessionMenu(again);
    await inWin(again, `captionField.focus();`);
    for (const ch of 'Edited ') again.webContents.sendInputEvent({ type: 'char', keyCode: ch });
    await new Promise((r) => setTimeout(r, 300));
    await inWin(again, `document.getElementById('save').click();`);
    for (let i = 0; i < 30 && !smokeMd().includes('Edited Smoke test caption'); i++) await new Promise((r) => setTimeout(r, 100));
    viewer['saving Edit Again replaces the entry in place'] =
      smokeMd().includes('Edited Smoke test caption') && JSON.stringify(sessions.shots(root, 'smoke')) === '[1]';
    // An editor left open on the session follows its count and its name
    fs.copyFileSync(shotCopy, path.join(root, 'open.png'));
    const watching = openEditor(path.join(root, 'open.png'), { session: 'smoke' });
    await new Promise<void>((r) => watching.webContents.once('did-finish-load', () => r()));
    await loaded(watching);
    const label = (text: string) =>
      inWin(
        watching,
        `for (let i = 0; i < 30 && document.getElementById('session').textContent !== ${JSON.stringify(text)}; i++) await new Promise((r) => setTimeout(r, 100)); return document.getElementById('session').textContent === ${JSON.stringify(text)};`,
      );
    viewer['an open editor shows the count'] = await label('smoke · 1 screenshot');
    // Discarded tab: this session's removed screenshot, and Reopen puts it back
    await inView(`document.getElementById('tab-discarded').click();`);
    viewer['Discarded tab lists the removed screenshot'] = await waitFor(
      `document.getElementById('discarded-count').textContent === '1' && document.querySelector('#discarded-list .what').textContent === 'Removed from session' && document.querySelector('#discarded-list .when').textContent.startsWith('Today, ')`,
    );
    await inView(`document.querySelector('#discarded-list button').click();`);
    viewer['Reopen puts it back in the session'] =
      (await waitFor(`document.getElementById('tab-discarded').hidden && document.querySelectorAll('#grid .thumb').length === 2`)) &&
      smokeMd().includes('Second shot');
    viewer['an open editor follows the count when a screenshot comes back'] = await label('smoke · 2 screenshots');
    // F135: after ⌘⌫ in the large view, ↩ does not start a rename: the large image has the focus
    await inView(`document.querySelector('#grid .thumb .pic').click(); document.activeElement.blur();`);
    keyIn('Backspace', ['meta']);
    const oneLeft = await waitFor(`document.getElementById('count').textContent === '1 of 1'`);
    keyIn('Return');
    await sleep(300);
    viewer['F135 ↩ after a removal does not rename'] =
      oneLeft &&
      (await inView(
        `return getComputedStyle(document.getElementById('rename')).display === 'none' && document.activeElement === document.getElementById('shot');`,
      ));
    keyIn('z', ['meta']);
    viewer['F119 ⌘Z puts it back in its place'] = await waitFor(
      `document.querySelectorAll('#grid .thumb').length === 2 && document.getElementById('count').textContent === '1 of 2' && document.getElementById('shot').src.includes('img/001.png')`,
    );
    // F15: ↩ with nothing focused starts renaming, as in Finder, also with a screenshot shown large; Esc cancels it
    const largeShown = await inView(`return !document.getElementById('shots').hidden;`);
    await inView(`document.activeElement.blur();`);
    keyIn('Return');
    viewer['F15 ↩ renames'] = await waitFor(
      `getComputedStyle(document.getElementById('rename')).display !== 'none' && document.activeElement === document.getElementById('rename')`,
    );
    viewer['snap-c5c F15 ↩ renames with a screenshot shown large'] = largeShown && viewer['F15 ↩ renames'];
    keyIn('Escape');
    await new Promise((r) => setTimeout(r, 200));
    // Rename in place: ↩ saves (the folder moves, the window follows), a taken name keeps the field, Esc cancels
    sessions.create(root, 'taken');
    const rename = async (to: string, key: 'Return' | 'Escape') => {
      await inView(`document.getElementById('title').click(); document.getElementById('rename').value = ${JSON.stringify(to)};`);
      view.webContents.sendInputEvent({ type: 'keyDown', keyCode: key });
      await new Promise((r) => setTimeout(r, 300));
    };
    const fieldOpen = `getComputedStyle(document.getElementById('rename')).display !== 'none'`;
    await inView(`document.getElementById('title').click();`);
    viewer['clicking the title opens the name, selected'] = await inView(
      `const f = document.getElementById('rename'); return ${fieldOpen} && document.activeElement === f && f.selectionStart === 0 && f.selectionEnd === 5 && f.value === 'smoke';`,
    );
    await rename('taken', 'Return');
    viewer['a taken name says so and keeps the field'] =
      (await inView(`return ${fieldOpen} && document.getElementById('hint').textContent.includes('already exists');`)) &&
      fs.existsSync(path.join(root, 'smoke'));
    // F128: typing after a refused name clears the error
    view.webContents.sendInputEvent({ type: 'char', keyCode: 'x' });
    viewer['F128 typing clears the error'] = await waitFor(
      `!document.getElementById('hint').classList.contains('error') && !document.getElementById('hint').textContent.includes('already exists')`,
    );
    // F125: a rename that fails (here: no permission) says why under the field
    const realRename = sessions.rename;
    (sessions as { rename: typeof realRename }).rename = () => {
      throw new Error('EACCES');
    };
    await rename('smoke elsewhere', 'Return');
    viewer['F125 a failed rename says why'] = await waitFor(
      `document.getElementById('hint').textContent === "Couldn't rename: EACCES" && document.getElementById('hint').classList.contains('error')`,
    );
    (sessions as { rename: typeof realRename }).rename = realRename;
    await rename('smoke renamed', 'Escape');
    viewer['Esc cancels the rename'] =
      (await inView(`return !(${fieldOpen}) && document.getElementById('title').textContent === 'smoke';`)) &&
      !fs.existsSync(path.join(root, 'smoke renamed'));
    // F127: an emptied field and a click away keep the name. The click away is the field's blur event: blur() does
    // nothing when another app has taken the focus from this window, as a parallel test run can.
    await inView(
      `document.getElementById('title').click(); document.getElementById('rename').value = ''; document.getElementById('rename').dispatchEvent(new FocusEvent('blur'));`,
    );
    await sleep(300);
    viewer['F127 an empty field and a click away keep the name'] =
      (await inView(`return !(${fieldOpen}) && document.getElementById('title').textContent === 'smoke';`)) &&
      fs.readFileSync(path.join(root, 'smoke', 'session.md'), 'utf8').startsWith('# smoke\n');
    // F129: the rename field's placeholder reads at 4.5:1 on the field, light and dark
    const placeholderContrast = () =>
      inView(`document.getElementById('title').click(); const f = document.getElementById('rename'); f.value = '';
        await new Promise((r) => setTimeout(r, 200));
        const rgb = (c) => c.match(/[\\d.]+/g).slice(0, 3).map(Number);
        const lum = (c) => c.map((v) => (v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4).reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0);
        const [a, b] = [lum(rgb(getComputedStyle(f, '::placeholder').color)), lum(rgb(getComputedStyle(f).backgroundColor))];
        f.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);`);
    nativeTheme.themeSource = 'light';
    const lightRatio: number = await placeholderContrast();
    nativeTheme.themeSource = 'dark';
    const darkRatio: number = await placeholderContrast();
    nativeTheme.themeSource = 'system';
    viewer['F129 placeholder contrast'] = lightRatio >= 4.5 && darkRatio >= 4.5;
    // F130: the session window never shrinks below 720 × 480
    viewer['F130 minimum size'] = JSON.stringify(view.getMinimumSize()) === JSON.stringify([720, 480]);
    await rename('smoke renamed', 'Return');
    viewer['↩ renames the session folder and the window'] =
      (await waitFor(`!(${fieldOpen}) && document.getElementById('title').textContent === 'smoke renamed'`)) &&
      fs.existsSync(path.join(root, 'smoke renamed', 'session.md')) &&
      !fs.existsSync(path.join(root, 'smoke')) &&
      view.getTitle() === 'smoke renamed — Snapmark';
    viewer['an open editor follows the rename'] =
      (await label('smoke renamed · 2 screenshots')) && watching.getTitle() === 'Snapmark — smoke renamed';
    // F116: a long name shortens with "…" in an open editor's label; its tooltip has the full name
    const long = 'Ledgerly Q4 review of checkout, payments, refunds and the new order page, take 2';
    await rename(long, 'Return');
    inPage['F116 a long name shortens'] =
      (await label(`${long} · 2 screenshots`)) &&
      (await inWin(
        watching,
        `const s = document.getElementById('session'); return s.scrollWidth > s.clientWidth && s.title.startsWith(${JSON.stringify(long)});`,
      ));
    await rename('smoke', 'Return'); // back, for the checks below
    viewer['renamed back'] = await waitFor(`document.getElementById('title').textContent === 'smoke'`);
    // F123: at 1100 points a 60-character name leaves "Open in Markdown App" on one line; only the name shortens
    view.setSize(1100, 900);
    const sixty = 'Ledgerly Q4 review of checkout, payments and refunds, take 2';
    await rename(sixty, 'Return');
    const headerFits =
      (await waitFor(`document.getElementById('title').textContent === ${JSON.stringify(sixty)}`)) &&
      (await inView(
        `const r = document.createRange(); r.selectNodeContents(document.getElementById('external')); const others = [...document.querySelectorAll('header button, header [role=tab]')].filter((b) => !b.contains(document.getElementById('title'))); return r.getClientRects().length === 1 && others.every((b) => b.scrollWidth <= b.clientWidth + 1);`,
      ));
    // The button keeps one line inside the window, the tabs and buttons keep their full width, and only the name is cut
    // (with "…") when it does not fit: at 1100 the 60 characters may just fit, so it is measured again at 900 too.
    const onlyNameShortens = (mustCut: boolean) =>
      inView(`const ext = document.getElementById('external'); const r = document.createRange(); r.selectNodeContents(ext);
        const t = document.getElementById('title');
        const whole = [...document.querySelectorAll('header > button, .tabs > button')].filter((b) => !b.hidden).every((b) => b.scrollWidth <= b.clientWidth);
        return r.getClientRects().length === 1 && ext.getBoundingClientRect().right <= innerWidth && whole &&
          getComputedStyle(t).textOverflow === 'ellipsis' && (${mustCut} ? t.scrollWidth > t.clientWidth : true);`);
    const fitsAt1100 = headerFits && (await onlyNameShortens(false));
    view.setSize(900, 900);
    await sleep(200);
    viewer['F123 a long name never wraps the buttons'] = fitsAt1100 && (await onlyNameShortens(true));
    await rename('smoke', 'Return');
    await waitFor(`document.getElementById('title').textContent === 'smoke'`);
    watching.destroy();
    view.close();

    // A date-stamped session reads as a date, and a rename keeps the date in front
    const stamped = sessions.create(root, '2026-10-24 23.38');
    sessions.addShot(root, stamped, fs.readFileSync(out), { caption: 'Dated shot' });
    const dated = openViewer(stamped, root);
    await new Promise<void>((r) => dated.webContents.once('did-finish-load', () => r()));
    const inDated = (js: string) => dated.webContents.executeJavaScript(`(async () => { ${js} })()`);
    const datedTitle = (text: string) =>
      inDated(
        `for (let i = 0; i < 50 && document.getElementById('title').textContent !== ${JSON.stringify(text)}; i++) await new Promise((r) => setTimeout(r, 100)); return document.getElementById('title').textContent === ${JSON.stringify(text)};`,
      );
    viewer['F2 the session window shows the readable date'] =
      (await datedTitle('2026-10-24, 23:38')) && dated.getTitle() === '2026-10-24, 23:38 — Snapmark';
    fs.copyFileSync(shotCopy, path.join(root, 'dated.png'));
    const datedEditor = openEditor(path.join(root, 'dated.png'), { session: stamped });
    await new Promise<void>((r) => datedEditor.webContents.once('did-finish-load', () => r()));
    await loaded(datedEditor);
    viewer['F3 an open editor shows the readable name'] =
      (await inWin(datedEditor, `return document.getElementById('session').textContent`)).startsWith('2026-10-24, 23:38') &&
      datedEditor.getTitle() === 'Snapmark — 2026-10-24, 23:38';
    datedEditor.destroy();
    // snap-ua7 F3: an editor on an empty dated session shows only its readable name
    const bare = sessions.create(root, '2026-10-24 09.05');
    fs.copyFileSync(shotCopy, path.join(root, 'bare.png'));
    const bareEditor = openEditor(path.join(root, 'bare.png'), { session: bare });
    await new Promise<void>((r) => bareEditor.webContents.once('did-finish-load', () => r()));
    await loaded(bareEditor);
    viewer['snap-ua7 F3 an editor on an empty session shows only its readable name'] =
      (await inWin(bareEditor, `return document.getElementById('session').textContent`)) === '2026-10-24, 09:05' &&
      bareEditor.getTitle() === 'Snapmark — 2026-10-24, 09:05';
    bareEditor.destroy();
    await inDated(`document.getElementById('title').click();`);
    // F126: renaming a dated session, the hint names the date that stays
    viewer['F126 the hint names the date'] = await inDated(
      `return document.getElementById('hint').textContent.startsWith('2026-10-24 stays in front');`,
    );
    const emptyField = await inDated(`return document.getElementById('rename').value === '';`);
    await inDated(`document.getElementById('rename').value = 'Ledgerly Q4 review';`);
    dated.webContents.sendInputEvent({ type: 'keyDown', keyCode: 'Return' });
    viewer['F8 a renamed session keeps its date'] =
      (await datedTitle('2026-10-24 · Ledgerly Q4 review')) && fs.existsSync(path.join(root, '2026-10-24 23.38 Ledgerly Q4 review'));
    viewer['snap-ua7 F8 the window title follows the rename'] = dated.getTitle() === '2026-10-24 · Ledgerly Q4 review — Snapmark';
    viewer["snap-bmr.14.3 gap: session.md's title follows the rename"] = fs
      .readFileSync(path.join(root, '2026-10-24 23.38 Ledgerly Q4 review', 'session.md'), 'utf8')
      .startsWith('# 2026-10-24 · Ledgerly Q4 review\n');
    await inDated(`document.getElementById('title').click();`);
    viewer['F9 the rename field holds only the name'] =
      emptyField && (await inDated(`return document.getElementById('rename').value === 'Ledgerly Q4 review';`));
    await inDated(`document.getElementById('rename').value = '';`);
    dated.webContents.sendInputEvent({ type: 'keyDown', keyCode: 'Return' });
    viewer['snap-bmr.14.3 gap: ↩ on an emptied field goes back to the bare date'] =
      (await datedTitle('2026-10-24, 23:38')) && fs.existsSync(path.join(root, '2026-10-24 23.38', 'session.md'));
    dated.close();

    // Esc on Select closes an editor without saving; it is kept in Discarded, and reopens with its marks
    fs.copyFileSync(shotCopy, path.join(root, 'discard.png'));
    const gone = openEditor(path.join(root, 'discard.png'));
    await new Promise<void>((r) => gone.webContents.once('did-finish-load', () => r()));
    await loaded(gone);
    await inWin(gone, `canvas.add(new Marker({ x: 50, y: 50 }, '#e5484d')); after();`);
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

    // Capture Last Area's picker: a drag in its see-through window gives the area in screen points; Esc gives none
    const display = screen.getDisplayNearestPoint(screen.getCursorScreenPoint()).bounds;
    const pickWith = async (act: (w: BrowserWindow) => void) => {
      const before = BrowserWindow.getAllWindows();
      const picked = pickArea();
      const w = await nextWindow(before);
      for (let i = 0; i < 50 && w.webContents.isLoading(); i++) await new Promise((r) => setTimeout(r, 100));
      act(w);
      return picked;
    };
    const dragged = await pickWith((w) => {
      w.webContents.sendInputEvent({ type: 'mouseDown', x: 100, y: 120, button: 'left', clickCount: 1 });
      w.webContents.sendInputEvent({ type: 'mouseMove', x: 400, y: 320, button: 'left', modifiers: ['leftbuttondown'] });
      w.webContents.sendInputEvent({ type: 'mouseUp', x: 400, y: 320, button: 'left', clickCount: 1 });
    });
    viewer['area picker: a drag gives the area in screen points'] =
      JSON.stringify(dragged) === JSON.stringify({ x: display.x + 100, y: display.y + 120, width: 300, height: 200 });
    const cancelled = await pickWith((w) => w.webContents.sendInputEvent({ type: 'keyDown', keyCode: 'Escape' }));
    viewer['area picker: Esc gives no area and closes the picker'] =
      cancelled === null && !BrowserWindow.getAllWindows().some((w) => w.webContents.getURL().endsWith('area.html'));

    // snap-bmr.14.3 F027, F028, F041, F043 (UX audit 2026-09-28): the capture items, with screencapture stubbed
    const shots: string[][] = [];
    let fail: string | null = null; // what a failing screencapture writes to stderr; '' is Esc in macOS's overlay
    const dock: boolean[] = [];
    const dockOnOpen: boolean[] = []; // did opening the editor turn the Dock on, before the editor had focus
    desk.dock = (on) => void dock.push(on);
    desk.screencapture = (args, done) => {
      shots.push(args);
      if (fail !== null) return done(new Error('Command failed: screencapture'), fail);
      fs.copyFileSync(shotCopy, args.at(-1)!);
      const n = dock.length;
      done(null, ''); // opens the editor, synchronously: no event has reached it yet
      dockOnOpen.push(dock.length > n);
    };
    type Item = Electron.MenuItemConstructorOptions;
    const item = (label: string, items: Item[] = menuItems()) => items.find((i) => i.label?.startsWith(label))!;
    const press = (label: string, items?: Item[]) => item(label, items).click!({} as never, undefined, {} as never);
    const loadedWindow = async (before: BrowserWindow[]) => {
      const w = await nextWindow(before);
      for (let i = 0; i < 50 && (w.webContents.isLoading() || !w.webContents.getURL()); i++) await sleep(100);
      return w;
    };
    let spoken = '';
    const pickerOpen = () => BrowserWindow.getAllWindows().some((w) => w.webContents.getURL().endsWith('area.html'));
    // F043: while dragging, a polite live region says the size the label shows. Compared with the label, not with
    // fixed numbers: the pointer over the see-through picker can move the drag while the page is read.
    const speaking = await pickWith((w) => {
      w.webContents.sendInputEvent({ type: 'mouseDown', x: 100, y: 120, button: 'left', clickCount: 1 });
      w.webContents.sendInputEvent({ type: 'mouseMove', x: 400, y: 320, button: 'left', modifiers: ['leftbuttondown'] });
      void w.webContents
        .executeJavaScript(
          `(async () => { const s = document.getElementById('say'); for (let i = 0; i < 30 && !s.textContent; i++) await new Promise((r) => setTimeout(r, 50));
            return [s.getAttribute('aria-live'), getComputedStyle(s).width, s.textContent === document.getElementById('size').textContent.replace(' × ', ' by ') + ' points', /^\\d+ by \\d+ points$/.test(s.textContent)].join('|'); })()`,
        )
        .then((v) => {
          spoken = v;
          w.webContents.sendInputEvent({ type: 'keyDown', keyCode: 'Escape' });
        });
    });
    viewer['snap-bmr.14.3 F043: the area picker speaks the size while dragging'] = speaking === null && spoken === 'polite|1px|true|true';
    // The capture bar, loaded: its chosen mode is drawn
    const barReady = async (w: BrowserWindow) => {
      for (let i = 0; i < 50 && w.webContents.isLoading(); i++) await sleep(100);
      await inWin(
        w,
        `for (let i = 0; i < 50 && !document.querySelector('[aria-checked="true"]'); i++) await new Promise((r) => setTimeout(r, 100));`,
      );
    };

    // Capture Scrolling: frames of a synthetic 8200-row page under a fixed header go through the live loop; ↩ in its
    // control stitches them into the editor, which fits the width and scrolls. Esc cancels without an editor.
    const [PW, PH, VIEW, TOP] = [600, 8200, 600, 40];
    const shade = (x: number, y: number) => (y < TOP ? 30 : 60 + (((((x / 12) | 0) * 73856093) ^ (((y / 10) | 0) * 19349663)) % 190));
    const frame = (o: number) => {
      const data = Buffer.alloc(PW * VIEW * 4, 255);
      for (let y = 0; y < VIEW; y++)
        for (let x = 0; x < PW; x++) data.fill(shade(x, y < TOP ? y : y + o), (y * PW + x) * 4, (y * PW + x) * 4 + 3);
      return { width: PW, height: VIEW, data };
    };
    const offsets = Array.from({ length: (PH - VIEW) / 400 + 1 }, (_, i) => i * 400);
    const scrollArea = { x: display.x + 100, y: display.y + 100, width: 300, height: 200 };
    let ctlBounds: Electron.Rectangle | null = null;
    let doneColour = ''; // F120
    const fakeGrab = (frames: number[], key: string) => {
      let [i, sent] = [0, false];
      return async () => {
        await new Promise((r) => setTimeout(r, 20));
        const ctl = BrowserWindow.getAllWindows().find((w) => w.webContents.getURL().endsWith('scroll.html'));
        // From the last frame on, until the control has loaded: on a busy machine it may still be loading at that frame
        if (!sent && i >= frames.length - 1 && ctl && !ctl.webContents.isLoading()) {
          sent = true;
          ctlBounds = ctl.getBounds();
          doneColour = await ctl.webContents.executeJavaScript(`getComputedStyle(document.getElementById('done')).backgroundColor`);
          ctl.webContents.sendInputEvent({ type: 'keyDown', keyCode: key });
        }
        return frame(frames[Math.min(i++, frames.length - 1)]);
      };
    };
    const tall = await scrollCapture(scrollArea, fakeGrab(offsets, 'Return'));
    viewer['Capture Scrolling: ↩ opens the stitched page in the editor'] = !!tall;
    viewer['F120 Done is the dark blue'] = doneColour === 'rgb(15, 114, 219)';
    if (tall) {
      await new Promise<void>((r) => (tall.webContents.isLoading() ? tall.webContents.once('did-finish-load', () => r()) : r()));
      await loaded(tall);
      const seen = JSON.parse(
        await inWin(
          tall,
          `const c = document.createElement('canvas'); [c.width, c.height] = [background.width, background.height];
          const g = c.getContext('2d'); g.drawImage(background.getElement(), 0, 0);
          const at = (x, y) => g.getImageData(x, y, 1, 1).data[0];
          return JSON.stringify({ w: background.width, h: background.height, px: [at(5, 5), at(301, 4321), at(599, 8199)],
            scrolls: mainEl.scrollHeight > mainEl.clientHeight + 100, fitsWidth: canvas.upperCanvasEl.getBoundingClientRect().width <= mainEl.clientWidth });`,
        ),
      );
      viewer['Capture Scrolling: the whole page, the header once'] =
        seen.w === PW && seen.h === PH && JSON.stringify(seen.px) === JSON.stringify([shade(5, 5), shade(301, 4321), shade(599, 8199)]);
      viewer['the editor fits a tall image to the width and scrolls'] = seen.scrolls && seen.fitsWidth;
      // Scrolled down, a box lands where it is drawn, and Redact still pixelates far below the first screen
      const drawn = JSON.parse(
        await inWin(
          tall,
          `mainEl.scrollTop = 3000; await new Promise((r) => setTimeout(r, 100));
          const up = document.querySelector('.upper-canvas'); const b = up.getBoundingClientRect(); const k = background.width / b.width;
          const y = mainEl.getBoundingClientRect().top + 150;
          for (const [type, dx, dy] of [['mousedown', 100, 0], ['mousemove', 200, 60], ['mouseup', 200, 60]])
            up.dispatchEvent(new MouseEvent(type, { clientX: b.left + dx, clientY: y + dy, button: 0, buttons: type === 'mouseup' ? 0 : 1, bubbles: true }));
          const box = canvas.getObjects().at(-1);
          const r = makeRedact({ x: 0, y: 6000, w: 240, h: 120 });
          const c = r.getElement(); const g = c.getContext ? c.getContext('2d') : null;
          return JSON.stringify({ boxTop: box.top, want: (y - b.top) * k, k, block: g && [g.getImageData(1, 1, 1, 1).data[0], g.getImageData(13, 13, 1, 1).data[0]] });`,
        ),
      );
      viewer['a tall image: a box drawn after scrolling lands under the pointer'] = Math.abs(drawn.boxTop - drawn.want) < 4 * drawn.k;
      // Two pixels in one pixelated block match, and are not blank, where the page itself differs
      viewer['a tall image: Redact pixelates far down the page'] =
        shade(1, 6001) !== shade(13, 6013) && drawn.block?.[0] > 0 && drawn.block[0] === drawn.block[1];
      tall.destroy();
    }
    const b = ctlBounds as Electron.Rectangle | null;
    viewer['Capture Scrolling: the control sits outside the grabbed area'] =
      !!b && (b.y >= scrollArea.y + scrollArea.height || b.y + b.height <= scrollArea.y);
    windows = BrowserWindow.getAllWindows();
    const cancelled2 = await scrollCapture(scrollArea, fakeGrab([0, 400], 'Escape'));
    const extra = () => BrowserWindow.getAllWindows().some((w) => !windows.includes(w) || w.webContents.getURL().endsWith('scroll.html'));
    for (let t = 0; t < 30 && extra(); t++) await new Promise((r) => setTimeout(r, 100)); // the control closes a moment after
    viewer['Capture Scrolling: Esc cancels, no editor, control gone'] = cancelled2 === null && !extra();

    // The capture bar (F201–F208, F212, N201), with a swapped runner: screencapture never runs
    const runs: { o: CaptureOpts; barGone: boolean }[] = [];
    const barUp = () => BrowserWindow.getAllWindows().filter((w) => w.getTitle() === 'Capture Options');
    const runner = (o: CaptureOpts) =>
      void runs.push({ o, barGone: !BrowserWindow.getAllWindows().some((w) => w.webContents.getURL().endsWith('bar.html')) });
    const keyTo = (w: BrowserWindow, keyCode: string, modifiers: Electron.KeyboardInputEvent['modifiers'] = []) => {
      w.webContents.sendInputEvent({ type: 'keyDown', keyCode, modifiers });
      w.webContents.sendInputEvent({ type: 'keyUp', keyCode, modifiers });
    };
    // The Options menu as main builds it: with desk.popup swapped, a click on Options hands over its items (F207, F223)
    let popped: Item[] = [];
    const realPopup = desk.popup;
    desk.popup = (_w, items) => void (popped = items);
    const optionsOf = async (w: BrowserWindow) => {
      popped = [];
      await inWin(w, `document.getElementById('options').click();`);
      for (let i = 0; i < 20 && !popped.length; i++) await sleep(50);
      return popped;
    };
    const pick = (items: Item[], label: string, checked = true) =>
      items.find((i) => i.label === label)!.click!({ checked } as Electron.MenuItem, undefined, {} as Electron.KeyboardEvent);
    const ticked = (items: Item[]) =>
      items
        .filter((i) => i.checked)
        .map((i) => i.label)
        .join();
    const t0 = Date.now();
    const barWin = openCaptureBar(runner)!;
    const shownIn = await new Promise<number>((r) => barWin.once('ready-to-show', () => r(Date.now() - t0)));
    console.log(`N201: the bar showed in ${shownIn} ms`);
    viewer['N201 the bar shows within 1 s'] = shownIn < 1000;
    await barReady(barWin);
    const wa = screen.getDisplayNearestPoint(screen.getCursorScreenPoint()).workArea;
    const bb = barWin.getBounds();
    viewer["F201 the capture bar opens bottom-centre on the pointer's display"] =
      Math.abs(bb.x + bb.width / 2 - (wa.x + wa.width / 2)) <= 1 && Math.abs(wa.y + wa.height - 24 - (bb.y + bb.height)) <= 1;
    viewer['F202 the bar shows its seven controls in order'] =
      (await inWin(
        barWin,
        `return JSON.stringify([...document.querySelectorAll('button')].map((b) => b.getAttribute('aria-label').split(' · ')[0]))`,
      )) === JSON.stringify(['Close', 'Capture Window', 'Choose New Area', 'Capture Last Area', 'Capture Scrolling', 'Options', 'Capture']);
    viewer['F203 every bar control is named; the modes are a radio group'] =
      barWin.getTitle() === 'Capture Options' &&
      (await inWin(
        barWin,
        `const named = [...document.querySelectorAll('button, [role=radio]')].every((b) => (b.getAttribute('aria-label') ?? '').trim() !== '');
        const g = document.querySelector('[role=radiogroup]');
        return named && document.title === 'Capture Options' && g.getAttribute('aria-label') === 'Mode' &&
          g.querySelectorAll('[role=radio]').length === 4 && g.querySelectorAll('[aria-checked="true"]').length === 1 &&
          document.querySelector('[aria-label^="Capture Last Area · "]')?.getAttribute('aria-label') === 'Capture Last Area · First time: drag the area';`,
      ));
    // The label above the bar (F5–F10): its own panel, shown by the pointer or a key, never by the opening
    const tipShown = () => {
      const t = barTipWindow();
      return !!t && !t.isDestroyed() && t.isVisible();
    };
    const tipSays = async () => {
      for (let i = 0; i < 20 && !tipShown(); i++) await sleep(50);
      await sleep(150); // the text and its preferred size land a moment after
      const t = barTipWindow();
      return t && tipShown() ? ((await inWin(t, `return document.body.innerText.replace(/\\s+/g, ' ').trim()`)) as string) : '';
    };
    const centredOver = async (mode: string) => {
      const r = JSON.parse(
        await inWin(barWin, `return JSON.stringify(document.querySelector('[data-mode="${mode}"]').getBoundingClientRect())`),
      );
      const [t, b] = [barTipWindow()!.getBounds(), barWin.getBounds()];
      return Math.abs(t.x + t.width / 2 - (b.x + r.left + r.width / 2)) <= 1 && t.y + t.height === b.y - 8;
    };
    const atOpening = tipShown();
    await inWin(barWin, `document.querySelector('[data-mode="window"]').dispatchEvent(new MouseEvent('mouseenter'));`);
    await sleep(150);
    const notYet = tipShown(); // the label waits 300 ms
    const hovered = await tipSays();
    viewer['F5 the label names the button under the pointer'] = !notYet && hovered === 'Capture Window 1' && (await centredOver('window'));
    console.log('F5', JSON.stringify({ notYet, hovered }));
    const tw = barTipWindow()!;
    viewer['F8 the label is part of the bar, never in a capture'] =
      !tw.isFocusable() && tw.isContentProtected() && tw.isAlwaysOnTop() && tw.isVisibleOnAllWorkspaces() && !barWin.isDestroyed();
    // F7: leaving the bar keeps the label while the pointer is on it (here: the label moved under the pointer), and
    // drops it once the pointer is elsewhere
    const p = screen.getCursorScreenPoint();
    tw.setBounds({ ...tw.getBounds(), x: p.x - 10, y: p.y - 5 });
    await inWin(barWin, `document.documentElement.dispatchEvent(new MouseEvent('mouseleave'));`);
    await sleep(350);
    const staysOnIt = tipShown();
    tw.setBounds({ ...tw.getBounds(), x: p.x + 400 > screen.getPrimaryDisplay().bounds.width ? p.x - 600 : p.x + 400 });
    await sleep(350);
    const goneElsewhere = !tipShown();
    // F6 and F9: a key shows the focused button's label; 1–4 only choose a mode
    keyTo(barWin, '4');
    const afterFour = await tipSays();
    const fourChose = await inWin(
      barWin,
      `return document.querySelector('[aria-checked="true"]').dataset.mode + '|' + document.activeElement.dataset.mode`,
    );
    keyTo(barWin, '1');
    const afterOne = await tipSays();
    const oneChose = await inWin(
      barWin,
      `return document.querySelector('[aria-checked="true"]').dataset.mode + '|' + document.activeElement.dataset.mode`,
    );
    keyTo(barWin, 'Right');
    const afterRight = await tipSays();
    viewer['F6 the label follows the keyboard, not the opening'] =
      !atOpening && afterFour === 'Capture Scrolling 4' && afterRight.startsWith('Choose New Area 2') && (await centredOver('area'));
    viewer['F9 keys 1-4 choose a mode and never capture'] =
      fourChose === 'scroll|scroll' &&
      oneChose === 'window|window' &&
      afterOne === 'Capture Window 1' &&
      runs.length === 0 &&
      !barWin.isDestroyed();
    viewer['F10 every bar button announces its key'] =
      (await inWin(
        barWin,
        `return JSON.stringify([...document.querySelectorAll('button')].map((b) => [b.id || b.dataset.mode, b.getAttribute('aria-keyshortcuts')]))`,
      )) ===
      JSON.stringify([
        ['close', 'Escape'],
        ['window', '1'],
        ['area', '2'],
        ['last', '3'],
        ['scroll', '4'],
        ['options', null],
        ['capture', 'Enter'],
      ]);
    console.log('F6 F7 F9', JSON.stringify({ atOpening, staysOnIt, goneElsewhere, afterFour, afterOne, afterRight, fourChose, oneChose }));
    await inWin(barWin, `document.querySelector('[data-mode="area"]').focus();`); // back where the bar opened, for F207's checks
    const barSays = () =>
      inWin(
        barWin,
        `return document.querySelector('[aria-checked="true"]').dataset.mode + '|' + document.activeElement.getAttribute('aria-label').split(' · ')[0]`,
      );
    const firstTime = await barSays();
    const firstOptions = ticked(await optionsOf(barWin));
    const barAgain = openCaptureBar(runner);
    viewer['F206 one bar at a time'] = barAgain === barWin && barUp().length === 1;
    viewer['F208 the bar is on top on every Space'] = barWin.isAlwaysOnTop() && barWin.isVisibleOnAllWorkspaces();
    // ← → (and ↓ ↑, as a radio group) move between the modes, wrapping; Tab goes Close → the chosen mode → Options →
    // Capture; ↩ on a mode captures
    const moves: string[] = [];
    for (const k of ['Right', 'Left', 'Left', 'Left', 'Right', 'Right', 'Right', 'Down', 'Up']) {
      keyTo(barWin, k);
      await sleep(80);
      moves.push(await barSays());
    }
    const tabs: string[] = [];
    for (const m of [['shift'], [], [], [], ['shift'], ['shift']] as Electron.KeyboardInputEvent['modifiers'][]) {
      keyTo(barWin, 'Tab', m);
      await sleep(80);
      tabs.push(((await barSays()) as string).split('|')[1]);
    }
    // Save to, Timer and Show Mouse Pointer chosen in the Options menu, as the owner clicks them
    const chosen = await optionsOf(barWin);
    pick(chosen, 'One-Shot');
    pick(chosen, '5 Seconds');
    pick(chosen, 'Show Mouse Pointer');
    keyTo(barWin, 'Return');
    for (let i = 0; i < 30 && !runs.length; i++) await sleep(100);
    const arrowsOk =
      JSON.stringify(moves) ===
      JSON.stringify([
        'last|Capture Last Area',
        'area|Choose New Area',
        'window|Capture Window',
        'scroll|Capture Scrolling',
        'window|Capture Window',
        'area|Choose New Area',
        'last|Capture Last Area',
        'scroll|Capture Scrolling',
        'last|Capture Last Area',
      ]);
    const tabsOk =
      JSON.stringify(tabs) === JSON.stringify(['Close', 'Capture Last Area', 'Options', 'Capture', 'Options', 'Capture Last Area']);
    viewer['F205 the bar is gone when the capture starts'] = runs.length === 1 && runs[0].barGone;
    const tipGoneOnCapture = !barTipWindow();
    // Reopened: on the mode last used; Esc closes it without capturing
    const barReopened = openCaptureBar(runner)!;
    await barReady(barReopened);
    const lastUsed = await inWin(barReopened, `return document.querySelector('[aria-checked="true"]').dataset.mode`);
    const reLabel = await inWin(barReopened, `return document.getElementById('capture').textContent`);
    const reOptions = ticked(await optionsOf(barReopened));
    const saved = JSON.stringify(JSON.parse(fs.readFileSync(path.join(root, 'userData', 'state.json'), 'utf8')).capture);
    const lastOpts = JSON.stringify({ mode: 'last', oneShot: true, timer: 5, pointer: true });
    viewer['F207 the bar remembers the last mode'] =
      firstTime === 'area|Choose New Area' &&
      firstOptions === 'Current Session,None' &&
      JSON.stringify(runs[0]?.o) === lastOpts &&
      lastUsed === 'last' &&
      reLabel === 'Capture One-Shot' &&
      reOptions === 'One-Shot,5 Seconds,Show Mouse Pointer' &&
      saved === lastOpts;
    keyTo(barReopened, '3');
    const tipBeforeEsc = await tipSays();
    keyTo(barReopened, 'Escape');
    for (let i = 0; i < 30 && !barReopened.isDestroyed(); i++) await sleep(100);
    viewer['F7 the label goes with the pointer and the bar'] =
      staysOnIt && goneElsewhere && tipGoneOnCapture && tipBeforeEsc.startsWith('Capture Last Area') && !barTipWindow();
    console.log('F7', JSON.stringify({ staysOnIt, goneElsewhere, tipGoneOnCapture, tipBeforeEsc }));
    viewer['F204 arrows pick, Return captures, Esc closes'] =
      arrowsOk && tabsOk && runs.length === 1 && runs[0].o.mode === 'last' && barReopened.isDestroyed() && !barUp().length;
    // One-Shot: a scrolling capture opens in one-shot mode, never in a session
    const oneShotScroll = await scrollCapture(scrollArea, fakeGrab([0, 400], 'Return'), { oneShot: true });
    viewer['F212 a one-shot scrolling capture opens in one-shot mode'] = oneShotScroll?.getTitle() === 'Snapmark — One-shot';
    oneShotScroll?.destroy();
    setCapture({ mode: 'area', oneShot: false, timer: 0, pointer: false }); // as the first time again

    // Choose New Area: the capture bar's first-time mode, then Capture: the picker, a drag, then the capture. After the
    // bar's checks, which need the first time with no area yet (F203).
    const chooseBar = openCaptureBar()!;
    await barReady(chooseBar);
    let windowsNow = BrowserWindow.getAllWindows();
    await inWin(chooseBar, `document.getElementById('capture').click();`);
    const chooser = await loadedWindow(windowsNow);
    windowsNow = BrowserWindow.getAllWindows();
    chooser.webContents.sendInputEvent({ type: 'mouseDown', x: 100, y: 120, button: 'left', clickCount: 1 });
    chooser.webContents.sendInputEvent({ type: 'mouseMove', x: 400, y: 320, button: 'left', modifiers: ['leftbuttondown'] });
    chooser.webContents.sendInputEvent({ type: 'mouseUp', x: 400, y: 320, button: 'left', clickCount: 1 });
    const repeats = [await loadedWindow(windowsNow)];
    // F027: Capture Last Area again and again: the same rectangle at once, no picker, each time an editor that turns the
    // Dock on only once it has focus (turned on first, macOS leaves a full-screen browser for the desktop)
    for (let i = 0; i < 2; i++) {
      windowsNow = BrowserWindow.getAllWindows();
      press('Capture Last Area');
      repeats.push(await loadedWindow(windowsNow));
    }
    const rects = shots.map((a) => a.slice(0, 3).join(' '));
    const dockAfterFocus = repeats.every((w) => {
      const n = dock.length;
      w.emit('focus'); // what macOS sends when the reviewer gets to it; once only, so no harm if it came already
      return dock.length > n ? dock.at(-1) === true : dock.includes(true);
    });
    viewer['snap-bmr.14.3 F027: Capture Last Area repeats the area at once, the editor waits for focus before the Dock'] =
      rects.join() ===
        Array(3)
          .fill(`-R ${display.x + 100},${display.y + 120},300,200 -x`)
          .join() &&
      repeats.every((w) => w.webContents.getURL().endsWith('editor.html')) &&
      !pickerOpen() &&
      dockOnOpen.join() === 'false,false,false' &&
      dockAfterFocus;
    why.F027 = { rects, urls: repeats.map((w) => w.webContents.getURL()), picker: pickerOpen(), dockOnOpen, dock, dockAfterFocus };
    repeats.forEach((w) => w.destroy());
    // F041: with the area's display gone, the picker says so
    const realDisplays = screen.getAllDisplays; // Electron's screen hands out its methods bound
    screen.getAllDisplays = () => [];
    windowsNow = BrowserWindow.getAllWindows();
    press('Capture Last Area');
    const gonePicker = await loadedWindow(windowsNow);
    screen.getAllDisplays = realDisplays;
    const goneHint = await gonePicker.webContents.executeJavaScript(`document.getElementById('hint').textContent`);
    const goneClosed = new Promise<void>((r) => gonePicker.once('closed', () => r()));
    gonePicker.webContents.sendInputEvent({ type: 'keyDown', keyCode: 'Escape' });
    await goneClosed;
    await sleep(400); // the picker's promise resolves 200 ms after 'closed'; until then a capture key does nothing
    viewer['snap-bmr.14.3 F041: with the display gone, the picker says why'] =
      goneHint === 'The last area was on a display that is not connected. Drag a new area. Esc cancels.' && shots.length === 3;
    // F028: a failed capture says so and offers to try again; Esc in macOS's overlay stays quiet
    notes.length = 0;
    windowsNow = BrowserWindow.getAllWindows();
    fail = 'could not create image from rect\n';
    press('Capture Last Area');
    const failed = notes.map((n) => n.body);
    notes[0]?.onClick?.();
    const retried = shots.length === 5;
    fail = '';
    press('Capture Screenshot');
    await sleep(300);
    viewer['snap-bmr.14.3 F028: a failed capture says so and tries again on a click; Esc stays quiet'] =
      failed.join() === 'Capture failed: could not create image from rect. No screenshot was added. Click to try again.' &&
      retried &&
      notes.length === 2 &&
      shots.at(-1)!.includes('-i') &&
      BrowserWindow.getAllWindows().length === windowsNow.length;
    why.F028 = {
      failed,
      retried,
      notes: notes.map((n) => n.body),
      shots: shots.slice(3),
      now: BrowserWindow.getAllWindows().length,
      was: windowsNow.length,
    };
    fail = null;

    // The Settings window (F219–F225, F228)
    const settingsReady = async (w: BrowserWindow) => {
      for (let i = 0; i < 50 && w.webContents.isLoading(); i++) await sleep(100);
      await inWin(
        w,
        `for (let i = 0; i < 50 && !document.getElementById('version').textContent; i++) await new Promise((r) => setTimeout(r, 100));`,
      );
    };
    const firstSettings = openSettings();
    viewer['F219 one Settings window'] = openSettings() === firstSettings;
    await settingsReady(firstSettings);
    viewer['F219 one Settings window'] &&=
      BrowserWindow.getAllWindows().filter((w) => w.webContents.getURL().endsWith('settings.html')).length === 1;
    const tabNames = await inWin(
      firstSettings,
      `return [...document.querySelectorAll('[role=tab]')].map((t) => t.textContent.trim()).join()`,
    );
    await inWin(firstSettings, `document.getElementById('tab-capture').click();`);
    await sleep(200);
    const titled = firstSettings.getTitle();
    firstSettings.destroy();
    const set = openSettings();
    await settingsReady(set);
    const openedOn = await inWin(set, `return document.querySelector('[aria-selected="true"]').textContent.trim()`);
    viewer['F220 three tabs; the title names the tab'] =
      tabNames === 'General,Capture,Shortcuts' && titled === 'Capture' && openedOn === 'Capture' && set.getTitle() === 'Capture';
    // General: the four settings, in a development build with login and updates greyed
    await inWin(set, `document.getElementById('tab-general').click();`);
    const general = JSON.parse(
      await inWin(
        set,
        `const p = document.getElementById('general');
        const shown = (c) => !c.closest('[hidden]');
        return JSON.stringify({
          controls: [...p.querySelectorAll('input, button')].filter(shown).map((c) => (c.labels?.[0] ?? c).textContent.trim()),
          version: document.getElementById('version').textContent,
          greyed: document.getElementById('login').disabled && document.getElementById('updates').disabled,
          notes: [...p.querySelectorAll('#login-dev, #updates-dev')].filter(shown).map((n) => n.textContent.trim()),
        });`,
      ),
    );
    viewer['F221 General holds the four settings'] =
      JSON.stringify(general.controls) ===
        JSON.stringify(['Open Snapmark at login', 'Change…', 'Clear Sessions Older Than 60 Days…', 'Check for Updates…']) &&
      general.version === `Snapmark ${app.getVersion()}`;
    viewer['F222 a development build greys login and updates'] =
      general.greyed && JSON.stringify(general.notes) === JSON.stringify(['Only in the installed app.', 'Only in the installed app.']);
    // Capture: the bar's options; One-Shot here makes the bar's button read Capture One-Shot
    // Capture: the bar's options. One-Shot, 10 Seconds and the pointer chosen here reach the bar; chosen back in the bar's
    // Options menu, Settings shows them when it comes forward (its focus listener, F227)
    await inWin(set, `document.getElementById('tab-capture').click(); document.getElementById('oneshot').click();`);
    await sleep(200);
    await inWin(set, `const t = document.getElementById('timer'); t.value = '10'; t.dispatchEvent(new Event('change'));`);
    await sleep(200);
    await inWin(set, `document.getElementById('pointer').click();`);
    await sleep(200);
    const oneShotBar = openCaptureBar(runner)!;
    await barReady(oneShotBar);
    const oneShotLabel = await inWin(oneShotBar, `return document.getElementById('capture').textContent`);
    const fromSettings = await optionsOf(oneShotBar);
    pick(fromSettings, 'Current Session');
    pick(fromSettings, 'None');
    pick(fromSettings, 'Show Mouse Pointer', false);
    await sleep(200);
    const backLabel = await inWin(oneShotBar, `return document.getElementById('capture').textContent`);
    oneShotBar.destroy();
    desk.popup = realPopup;
    await inWin(set, `window.dispatchEvent(new Event('focus'));`);
    await sleep(200);
    const settingsShows = await inWin(
      set,
      `return [document.getElementById('current').checked, document.getElementById('timer').value, document.getElementById('pointer').checked].join()`,
    );
    viewer['F223 Capture tab and bar share their options'] =
      oneShotLabel === 'Capture One-Shot' &&
      ticked(fromSettings) === 'One-Shot,10 Seconds,Show Mouse Pointer' &&
      backLabel === 'Capture' &&
      settingsShows === 'true,0,false';
    // Shortcuts: the four global keys, each taken here (quiet mode registers none); Show All Shortcuts opens the list
    await inWin(set, `document.getElementById('tab-shortcuts').click();`);
    const keyRows = await inWin(
      set,
      `return JSON.stringify([...document.querySelectorAll('#keys li')].map((li) => [li.querySelector('kbd').textContent, li.textContent.includes('Taken by another app')]))`,
    );
    const beforeAll = BrowserWindow.getAllWindows();
    await inWin(set, `document.getElementById('all').click();`);
    const allKeys = await nextWindow(beforeAll);
    viewer['F224 Shortcuts tab lists the keys'] =
      keyRows ===
        JSON.stringify([
          ['⌃⇧4', true],
          ['⌃⇧3', true],
          ['⌃⇧5', true],
          ['⌃⇧N', true],
        ]) && /keyboard shortcuts/i.test(allKeys.getTitle());
    allKeys.destroy();
    // Pick tools with single keys off reaches a new editor
    await inWin(set, `document.getElementById('single').click();`);
    await sleep(200);
    fs.copyFileSync(shotCopy, path.join(root, 'single.png'));
    const singleOff = openEditor(path.join(root, 'single.png'), { session: 'smoke' });
    await new Promise<void>((r) => singleOff.webContents.once('did-finish-load', () => r()));
    await loaded(singleOff);
    viewer['F225 single keys off reaches the editor'] =
      !(await inWin(set, `return document.getElementById('single').checked`)) && (await inWin(singleOff, `return singleKeys === false`));
    singleOff.destroy();
    setSingleKeys(true);
    // Every control is named and in the Tab order; → moves between tabs, wrapping; End and Home go to the last and first
    const named = await inWin(
      set,
      `const all = [...document.querySelectorAll('input, select, button')];
      return all.every((c) => c.labels?.length || (c.getAttribute('aria-label') ?? '').trim() || (c.tagName === 'BUTTON' && c.textContent.trim())) &&
        all.every((c) => c.tabIndex >= 0 || c.getAttribute('role') === 'tab');`,
    );
    await inWin(set, `document.querySelector('[aria-selected="true"]').focus();`);
    const tabMoved: string[] = [];
    for (const k of ['Right', 'End', 'Home']) {
      keyTo(set, k);
      await sleep(100);
      tabMoved.push(
        await inWin(
          set,
          `return document.querySelector('[aria-selected="true"]').textContent.trim() + '|' + document.activeElement.textContent.trim()`,
        ),
      );
    }
    viewer['F228 Settings controls are labelled and reachable'] =
      named && JSON.stringify(tabMoved) === JSON.stringify(['General|General', 'Shortcuts|Shortcuts', 'General|General']);
    set.destroy();

    // The Keyboard Shortcuts window (F229–F235): its own page, two columns as in the round-1 mock, Esc closes it
    const keysWin = showShortcuts();
    viewer['F233 one Keyboard Shortcuts window'] = showShortcuts() === keysWin;
    for (let i = 0; i < 50 && keysWin.webContents.isLoading(); i++) await sleep(100);
    await inWin(
      keysWin,
      `for (let i = 0; i < 50 && !document.querySelector('#tool-rows tr'); i++) await new Promise((r) => setTimeout(r, 100));`,
    );
    viewer['F233 one Keyboard Shortcuts window'] &&=
      BrowserWindow.getAllWindows().filter((w) => w.webContents.getURL().endsWith('shortcuts.html')).length === 1;
    viewer['F229 Keyboard Shortcuts is its own page'] =
      keysWin.webContents.getURL().endsWith('shortcuts.html') && keysWin.getTitle() === 'Keyboard Shortcuts';
    keysWin.setSize(980, 680);
    await sleep(200);
    const sheet = JSON.parse(
      await inWin(
        keysWin,
        `const [o, t] = ['other', 'tools'].map((id) => document.getElementById(id).getBoundingClientRect());
        const toolRows = [...document.querySelectorAll('#tool-rows tr')];
        const cap = (k) => { const c = getComputedStyle(k); return parseFloat(c.borderTopWidth) > 0 && parseFloat(c.borderTopLeftRadius) > 0; };
        const cells = [...document.querySelectorAll('td.keys')];
        return JSON.stringify({
          sameTop: Math.abs(o.top - t.top) <= 2,
          right: t.left >= o.right,
          icons: toolRows.length > 0 && toolRows.every((r) => !!r.querySelector('svg')),
          caps: cells.length > 0 && cells.every((c) => c.querySelectorAll('kbd').length > 0 && [...c.querySelectorAll('kbd')].every(cap)),
          rows: document.querySelectorAll('tr').length,
          names: [...document.querySelectorAll('#other table')].flatMap((t) => [...t.querySelectorAll('td.name')].map((n) => t.previousElementSibling.textContent + '|' + n.textContent)),
          tools: [...document.querySelectorAll('#tool-rows td.name')].map((n) => n.textContent),
        });`,
      ),
    );
    const { KEY_GROUPS } = require('../src/keys') as typeof import('../src/keys');
    const { GROUPS: everyTool } = require('../src/tools') as { GROUPS: ToolGroup[] };
    const keyNames = KEY_GROUPS.flatMap((g) => g.rows.map(([, n]) => `${g.title}|${n}`));
    const toolNames = everyTool.flatMap((g) => g.tools.map((t) => t.label));
    viewer['F230 two columns as in the round-1 mock'] = sheet.sameTop && sheet.right && sheet.icons;
    viewer['F231 every key is a keycap'] = sheet.caps;
    viewer['F232 every key and tool listed once'] =
      sheet.rows === keyNames.length + toolNames.length &&
      JSON.stringify(sheet.names) === JSON.stringify(keyNames) &&
      JSON.stringify(sheet.tools) === JSON.stringify(toolNames);
    nativeTheme.themeSource = 'dark';
    await sleep(300);
    const darkLum: number = await inWin(
      keysWin,
      `const c = getComputedStyle(document.body).backgroundColor.match(/[\\d.]+/g).slice(0, 3).map(Number);
      return c.map((v) => (v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4).reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0);`,
    );
    nativeTheme.themeSource = 'system';
    viewer['F235 Keyboard Shortcuts turns dark'] = darkLum < 0.2;
    keyTo(keysWin, 'Escape');
    for (let i = 0; i < 30 && !keysWin.isDestroyed(); i++) await sleep(100);
    viewer['F234 Esc closes Keyboard Shortcuts'] = keysWin.isDestroyed();

    // One-shot mode: Beautify instead of References, no Add to session; ⌘C copies the marked screenshot on its
    // backdrop at full resolution; nothing goes into a session; closing keeps it in Discarded; the settings are remembered
    const { beautyLayout } = require('../src/beautify') as { beautyLayout: typeof globalThis.beautyLayout };
    const sessionsBefore = JSON.stringify(sessions.list(root).map((n) => [n, sessions.count(root, n)]));
    fs.copyFileSync(shotCopy, path.join(root, 'one.png'));
    const one = openEditor(path.join(root, 'one.png'), { oneShot: true });
    await new Promise<void>((r) => one.webContents.once('did-finish-load', () => r()));
    await loaded(one);
    const panel = JSON.parse(
      await inWin(
        one,
        `const shown = (id) => getComputedStyle(document.getElementById(id)).display !== 'none';
        return JSON.stringify({
          beautify: !document.getElementById('beautify').hidden && shown('beautify'),
          noRefs: !shown('refs') && !shown('caption'),
          noHeading: !shown('caption-label'),
          noAdd: !document.body.innerText.includes('Add to session'),
          primary: document.getElementById('save').textContent,
          values: ['padding', 'radius', 'shadow'].map((id) => document.getElementById(id).value + '=' + document.querySelector('output[for="' + id + '"]').textContent).join(),
          backdrops: document.querySelectorAll('#backdrops > *').length,
          ratios: [...document.querySelectorAll('#ratios button')].map((b) => b.textContent).join(),
        });`,
      ),
    );
    viewer['one-shot: the Beautify panel replaces References and the comment'] = panel.beautify && panel.noRefs;
    inPage['F115 no session menu in Edit Again or one-shot'] = noMenuAgain && (await noSessionMenu(one));
    inPage['F12 the top box is headed General comment'] &&= panel.noHeading; // hidden with the box in one-shot mode
    viewer['one-shot: no Add to session; Copy Image is the main button'] = panel.noAdd && panel.primary === 'Copy Image ⌘C';
    viewer['one-shot: sliders show their values; 10 backgrounds; Auto 4:3 3:2 16:9 1:1'] =
      panel.values === '64=64,12=12,40=40' && panel.backdrops === 10 && panel.ratios === 'Auto,4:3,3:2,16:9,1:1';
    const shotUnit = Math.max(2, Math.round(Math.max(shotSize.width, Math.min(shotSize.height, 2 * shotSize.width)) / 400));
    const preview = JSON.parse(
      await inWin(
        one,
        `canvas.add(new Marker({ x: background.width / 2, y: background.height / 2 }, '#e5484d')); after();
        const set = (el, v) => { el.value = v; el.dispatchEvent(new Event('input')); };
        set(document.getElementById('padding'), '100');
        set(document.querySelector('#backdrops input[type="color"]'), '#123456');
        [...document.querySelectorAll('#ratios button')].find((b) => b.textContent === '16:9').click();
        const s = document.getElementById('stage').getBoundingClientRect();
        return JSON.stringify({ ratio: s.width / s.height, bg: getComputedStyle(document.getElementById('stage')).backgroundColor });`,
      ),
    );
    viewer['one-shot: the preview shows the backdrop at the chosen ratio'] =
      Math.abs(preview.ratio - 16 / 9) < 0.02 && preview.bg === 'rgb(18, 52, 86)';
    // Its own stubs, so the session-mode checks below still see their copy and file
    const got = { copy: null as Buffer | null, offered: '' };
    const oneSaved = path.join(root, 'one-shot-saved.png');
    desk.copyImage = async (png) => void (got.copy = png);
    desk.savePath = async (_win, opts) => {
      got.offered = opts.defaultPath ?? '';
      return { canceled: false, filePath: oneSaved };
    };
    await inWin(one, `document.dispatchEvent(new KeyboardEvent('keydown', { key: 'c', metaKey: true, bubbles: true, cancelable: true }));`);
    for (let i = 0; i < 30 && !got.copy; i++) await new Promise((r) => setTimeout(r, 100));
    const oneCopy = got.copy;
    const oneFile = path.join(root, 'one-shot-copied.png');
    if (oneCopy) fs.writeFileSync(oneFile, oneCopy);
    const L = beautyLayout(shotSize.width, shotSize.height, { padding: 100, radius: 12, shadow: 40, backdrop: '#123456', ratio: '16:9' });
    const near = (a: number[], b: number[]) => a.every((v, i) => Math.abs(v - b[i]) <= 2);
    viewer['one-shot: ⌘C copies at full resolution, the canvas at the ratio'] =
      !!oneCopy && JSON.stringify(nativeImage.createFromPath(oneFile).getSize()) === JSON.stringify({ width: L.width, height: L.height });
    viewer['one-shot: the copied image has the backdrop in its corners'] =
      !!oneCopy && near(pixel(oneFile, 0, 0, 2, 2), [18, 52, 86]) && near(pixel(oneFile, 1, 1, -3, -3), [18, 52, 86]);
    viewer['one-shot: the screenshot and its marks sit centred on it'] =
      !!oneCopy && red(pixel(oneFile, (L.x + shotSize.width / 2) / L.width, (L.y + shotSize.height / 2) / L.height, -shotUnit * 8 * 0.45));
    await inWin(
      one,
      `document.dispatchEvent(new KeyboardEvent('keydown', { key: 's', metaKey: true, shiftKey: true, bubbles: true, cancelable: true }));`,
    );
    for (let i = 0; i < 30 && !fs.existsSync(oneSaved); i++) await new Promise((r) => setTimeout(r, 100));
    viewer['one-shot: Save As… writes the same image, named Snapmark <date time>'] =
      /^Snapmark \d{4}-\d\d-\d\d \d\d\.\d\d\.\d\d\.png$/.test(got.offered) &&
      !!oneCopy &&
      fs.existsSync(oneSaved) &&
      fs.readFileSync(oneSaved).equals(oneCopy);
    // F134: one-shot ⌘↵ copies and keeps the selected marks selected
    got.copy = null;
    const oneSelected = await inWin(
      one,
      `canvas.add(new Marker({ x: 40, y: 40 }, '#e5484d')); after();
      select(canvas.getObjects().filter((o) => o instanceof Marker));
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', metaKey: true, bubbles: true, cancelable: true }));
      await new Promise((r) => setTimeout(r, 500));
      const n = canvas.getActiveObjects().length;
      canvas.discardActiveObject();
      return n;`,
    );
    for (let i = 0; i < 30 && !got.copy; i++) await sleep(100);
    inPage['F134 every copy keeps the selection'] = keptByKeys && keptByMenu && oneSelected === 2 && !!got.copy;
    viewer['one-shot: nothing is added to any session'] =
      JSON.stringify(sessions.list(root).map((n) => [n, sessions.count(root, n)])) === sessionsBefore;
    for (const key of ['Escape', 'Escape']) {
      one.webContents.sendInputEvent({ type: 'keyDown', keyCode: key });
      await new Promise((r) => setTimeout(r, 200));
    }
    for (let i = 0; i < 30 && !one.isDestroyed(); i++) await new Promise((r) => setTimeout(r, 100));
    const [oneKept] = sessions.discarded(root);
    viewer['one-shot: Esc, Esc closes it into Discarded with its settings'] =
      one.isDestroyed() &&
      oneKept?.session === 'one-shot' &&
      JSON.parse(fs.readFileSync(path.join(oneKept.dir, 'state.json'), 'utf8')).beautify?.ratio === '16:9';
    fs.copyFileSync(shotCopy, path.join(root, 'two.png'));
    const two = openEditor(path.join(root, 'two.png'), { oneShot: true });
    await new Promise<void>((r) => two.webContents.once('did-finish-load', () => r()));
    await loaded(two);
    viewer['one-shot: the next one starts from the last settings'] =
      (await inWin(
        two,
        `return document.getElementById('padding').value === '100' && document.querySelector('#ratios [aria-pressed="true"]').textContent === '16:9' && document.querySelector('#backdrops .custom').classList.contains('picked');`,
      )) === true;
    two.destroy();
    // Auto-redact and the text in the screenshot, from a stubbed text recognition: words 9 px a character
    const word = (start: number, end: number, x: number, y: number) => ({ start, end, x, y, w: (end - start) * 9, h: 18 });
    desk.recognize = async () => [
      {
        text: 'Revenue is up 12%',
        x: 260,
        y: 140,
        w: 153,
        h: 18,
        words: [word(0, 7, 260, 140), word(8, 10, 332, 140), word(11, 13, 359, 140), word(14, 17, 386, 140)],
      },
      { text: 'Mail jane.doe@example.com', x: 260, y: 100, w: 225, h: 18, words: [word(0, 4, 260, 100), word(5, 25, 305, 100)] },
    ];
    const autoMarks = `canvas.getObjects().filter((o) => o.filters?.length).map((o) => [o.cropX, o.cropY, o.width, o.height].join()).join(' ')`;
    const redactLine = `document.getElementById('redacted')`;
    fs.copyFileSync(shotCopy, path.join(root, 'ocr.png'));
    const scan = openEditor(path.join(root, 'ocr.png'), { session: 'smoke' });
    await new Promise<void>((r) => scan.webContents.once('did-finish-load', () => r()));
    await loaded(scan);
    const auto = JSON.parse(
      await inWin(
        scan,
        `for (let i = 0; i < 30 && ${redactLine}.hidden; i++) await new Promise((r) => setTimeout(r, 100));
        const shown = [${autoMarks}, ${redactLine}.textContent, ${redactLine}.hidden];
        undo(); const undone = [${autoMarks}, ${redactLine}.hidden];
        redo(); const redone = [${autoMarks}, ${redactLine}.hidden];
        return JSON.stringify({ shown, undone, redone });`,
      ),
    );
    viewer['auto-redact pixelates the email, padded, and says so in the side panel'] =
      JSON.stringify(auto.shown) === JSON.stringify(['302,97,186,24', 'Redacted 1 sensitive item · ⌘Z to undo', false]);
    viewer['⌘Z takes auto-redact back in one step, ⇧⌘Z puts it back'] =
      JSON.stringify(auto.undone) === JSON.stringify(['', true]) &&
      JSON.stringify(auto.redone) === JSON.stringify(['302,97,186,24', false]);
    const before = sessions.shots(root, 'smoke');
    await inWin(scan, `document.getElementById('save').click();`);
    for (let i = 0; i < 30 && sessions.shots(root, 'smoke').length === before.length; i++) await new Promise((r) => setTimeout(r, 100));
    const scanned = sessions.shots(root, 'smoke').at(-1)!;
    const block = '<details><summary>Text in the screenshot</summary>\n\n```text\nMail [redacted]\nRevenue is up 12%\n```\n\n</details>';
    viewer['session.md gets the text in the screenshot, in reading order, redacted'] =
      smokeMd().includes(block) && !smokeMd().includes('jane.doe');
    // Edit Again: auto-redact ran already, so a deleted mark stays deleted; here the saved mark comes back alone
    const ef = sessions.editFiles(root, 'smoke', scanned);
    fs.copyFileSync(ef.png, path.join(root, 'ocr-again.png'));
    const reopened = openEditor(path.join(root, 'ocr-again.png'), {
      session: 'smoke',
      state: JSON.parse(fs.readFileSync(ef.json, 'utf8')),
      replace: scanned,
    });
    await new Promise<void>((r) => reopened.webContents.once('did-finish-load', () => r()));
    await loaded(reopened);
    viewer['Edit Again does not auto-redact again'] =
      (await inWin(reopened, `await new Promise((r) => setTimeout(r, 500)); return ${autoMarks} + '|' + ${redactLine}.hidden;`)) ===
      '302,97,186,24|true';
    reopened.destroy();
    desk.recognize = async () => null;
    // The session window shows the block's tags as a quiet label and keeps the block as it is
    const textView = openViewer('smoke', root);
    await new Promise<void>((r) => textView.webContents.once('did-finish-load', () => r()));
    viewer['the Document tab shows "Text in the screenshot" as a label, not raw HTML'] = await textView.webContents.executeJavaScript(
      `(async () => {
        for (let i = 0; i < 50 && !document.querySelector('#doc span[data-type="html"]'); i++) await new Promise((r) => setTimeout(r, 100));
        const open = document.querySelector('#doc span[data-type="html"][data-value^="<details>"]');
        const close = document.querySelector('#doc span[data-type="html"][data-value="</details>"]');
        const p = close?.closest('p');
        return !!open && getComputedStyle(open).fontSize === '0px' && getComputedStyle(open, '::before').content === '"Text in the screenshot"' &&
          !!p && getComputedStyle(p).display === 'none' && !!document.querySelector('#doc pre')?.textContent.includes('Mail [redacted]');
      })()`,
    );
    viewer['the Document tab keeps the block as it is when it saves'] = (
      await textView.webContents.executeJavaScript(`MdNotes.fieldAt(document.getElementById('doc')).value()`)
    ).includes(block);
    textView.close();
    // An editor on a copy of the mock, loaded
    const openOn = async (file: string, opts: Parameters<typeof openEditor>[1] = {}) => {
      fs.copyFileSync(shotCopy, path.join(root, file));
      const w = openEditor(path.join(root, file), opts);
      await new Promise<void>((r) => w.webContents.once('did-finish-load', () => r()));
      await loaded(w);
      return w;
    };
    // F117: the colour picked in one editor is the next editor's, also after a restart (state.json)
    const firstColour = await openOn('colour-1.png', { session: 'smoke' });
    await inWin(
      firstColour,
      `document.getElementById('swatch').click(); [...document.querySelectorAll('#presets button')].find((b) => b.title === 'Violet').click();`,
    );
    await sleep(200); // the pick reaches the main process before the window goes
    firstColour.destroy();
    const nextColour = await openOn('colour-2.png', { session: 'smoke' });
    inPage['F117 the next editor keeps the colour'] =
      (await inWin(nextColour, `return colorEl.value`)) === '#8b3dff' &&
      JSON.parse(fs.readFileSync(path.join(root, 'userData', 'state.json'), 'utf8')).color === '#8b3dff';
    // A16: the Custom row reaches state.json and the next editor; the main process keeps only up to five #rrggbb
    await inWin(nextColour, `window.snapmark.customColors(['red']); window.snapmark.customColors(Array(6).fill('#000000'));`);
    await sleep(200);
    inPage['A16 the Custom row is kept in state.json, checked at the IPC boundary'] =
      (await inWin(nextColour, `return [...document.querySelectorAll('#customs button')].map((b) => b.dataset.color).join()`)) ===
        '#12ab9f,#ff00aa' &&
      JSON.stringify(JSON.parse(fs.readFileSync(path.join(root, 'userData', 'state.json'), 'utf8')).customColors) ===
        '["#12ab9f","#ff00aa"]';
    await inWin(nextColour, `setColor('#e5484d');`); // back to coral red
    await sleep(200);
    nextColour.destroy();
    // F114: the session label's menu moves the editor to another session, which becomes current; ⌘S saves there
    const moved = sessions.create(root, 'moved');
    const mover = await openOn('move.png', { session: 'smoke' });
    moveEditor(mover, moved);
    const movedLabel = await inWin(
      mover,
      `for (let i = 0; i < 30 && document.getElementById('session').textContent !== 'moved'; i++) await new Promise((r) => setTimeout(r, 100)); return document.getElementById('session').textContent === 'moved';`,
    );
    const movedTitle = mover.getTitle();
    const nowCurrent = (menuItems()[1] as { label?: string }).label;
    await inWin(
      mover,
      `document.dispatchEvent(new KeyboardEvent('keydown', { key: 's', metaKey: true, bubbles: true, cancelable: true }));`,
    );
    for (let i = 0; i < 30 && sessions.count(root, moved) === 0; i++) await sleep(100);
    inPage['F114 the label switches the session'] =
      movedLabel && movedTitle === 'Snapmark — moved' && nowCurrent === 'moved' && sessions.count(root, moved) === 1;
    // snap-ua7 F13: the menu's Switch Session lists the sessions by last use
    setActive('smoke');
    await sleep(20);
    setActive(moved);
    const submenu = (items: Electron.MenuItemConstructorOptions[], label: string) =>
      items.find((i) => i.label === label)!.submenu as Electron.MenuItemConstructorOptions[];
    const switchRows = submenu(submenu(menuItems(), 'Session'), 'Switch Session').filter((i) => i.type === 'checkbox');
    viewer['snap-ua7 F13 Switch Session lists the sessions by last use'] =
      switchRows[0]?.label === 'moved' && !!switchRows[0]?.checked && switchRows[1]?.label === 'smoke';
    // snap-bmr.14.3 F025 (UX audit 2026-09-28): the hand-off stays a menu item with no global key (ADR 2026-09-25
    // menu-3); it copies the current session's prompt and names the session
    const promptItem = menuItems().find((i) => i.label === 'Copy Prompt for AI')!;
    notes.length = 0;
    promptItem.click!({} as never, undefined, {} as never);
    viewer["snap-bmr.14.3 F025: Copy Prompt for AI copies the session's prompt and names it, with no global key"] =
      !promptItem.accelerator &&
      promptItem.enabled === true &&
      copiedText === promptFor(path.join(root, moved)) &&
      notes.map((n) => n.body).join() === `Prompt for ${moved} copied. Paste it into your AI agent.`;
    // Milestone 3, tall captures: in their own session, so the smoke session's counts stay as they are
    const tallSession = sessions.create(root, 'smoke-tall');
    setActive(tallSession);
    fs.writeFileSync(path.join(root, 'tall.png'), big(1280, 8000));
    const tallEd = openEditor(path.join(root, 'tall.png'), { session: tallSession });
    await new Promise<void>((r) => tallEd.webContents.once('did-finish-load', () => r()));
    await loaded(tallEd);
    await inWin(
      tallEd,
      `document.dispatchEvent(new KeyboardEvent('keydown', { key: 's', metaKey: true, bubbles: true, cancelable: true }));`,
    );
    for (let i = 0; i < 100 && sessions.count(root, tallSession) === 0; i++) await sleep(100);
    await sleep(300);
    const tallMd = () => fs.readFileSync(path.join(root, tallSession, 'session.md'), 'utf8');
    const sizeOf = (f: string) => nativeImage.createFromPath(path.join(root, tallSession, f)).getSize();
    const linked = [...tallMd().matchAll(/!\[[^\]]*\]\((img\/[^)]+)\)/g)].map((m) => m[1]);
    viewer['F10 a saved 1280×8000 capture links parts at least 1000 px wide'] =
      linked.length === 11 && linked.every((f) => f.startsWith('img/001/') && sizeOf(f).width >= 1000);
    viewer['F14 the one image is the whole page at 1280 px'] = JSON.stringify(sizeOf('img/001.png')) === '{"width":1280,"height":8000}';
    const page = big(2560, 20_000);
    const cutStart = performance.now();
    const cut = cutParts(fitForAI(page));
    const ms = Math.round(performance.now() - cutStart);
    console.log(`N1 scaled and cut 2560 × 20000 into ${cut.length} parts in ${ms} ms`);
    viewer['N1 a 2560×20000 capture is cut in under 1 s'] = cut.length === 13 && ms < 1000;
    // Outside the timed span: a wider-than-1280 capture is scaled to the part width, and so are its parts
    const sizeIn = (png: Buffer) => nativeImage.createFromBuffer(png).getSize();
    viewer['N1 a 2560 px wide capture is scaled: one image 1280×10000, parts 1280 wide and at most 898 high'] =
      JSON.stringify(sizeIn(fitForAI(page))) === '{"width":1280,"height":10000}' &&
      cut.every((p) => sizeIn(p).width === 1280 && sizeIn(p).height <= 898);
    // F25: typing at the end of the Document tab keeps every part link as written
    const partLinks = () =>
      tallMd()
        .match(/!\[[^\]]*\]\(img\/001\/\d+\.png\)/g)
        ?.join('\n') ?? '';
    const linksBefore = partLinks();
    const tallView = openViewer(tallSession, root);
    await new Promise<void>((r) => tallView.webContents.once('did-finish-load', () => r()));
    await tallView.webContents.executeJavaScript(`(async () => {
      for (let i = 0; i < 50 && !document.querySelector('#doc img[src^="img/001/"]'); i++) await new Promise((r) => setTimeout(r, 100));
      const p = [...document.querySelectorAll('#doc p')].pop(); const r = document.createRange(); r.selectNodeContents(p); r.collapse(false);
      getSelection().removeAllRanges(); getSelection().addRange(r); p.closest('[contenteditable]').focus();
    })()`);
    for (const ch of ' typed in the Document tab') tallView.webContents.sendInputEvent({ type: 'char', keyCode: ch });
    for (let i = 0; i < 30 && !tallMd().includes('typed in the Document tab'); i++) await sleep(100);
    viewer['F25 typing keeps the part links'] =
      tallMd().includes('typed in the Document tab') && linksBefore.split('\n').length === 11 && partLinks() === linksBefore;
    tallView.close();
    setActive(moved);
    const checks: Record<string, boolean> = {
      ...inPage,
      ...viewer,
      'card drawn yellow': r3 > 235 && g3 > 225 && b3 > 150 && b3 < 225,
      'pdf exported': fs.readFileSync(pdf).subarray(0, 5).toString() === '%PDF-' && fs.statSync(pdf).size > 20_000,
      'image saved': fs.existsSync(out),
      'Copy Image and Save As… add nothing to the session': notAdded,
      'Copy Image (⇧⌘C) copies the image Add to session saves': !!copied && copied.equals(added),
      'Save As… writes the image Add to session saves': fs.existsSync(savedAs) && fs.readFileSync(savedAs).equals(added),
      'Save As… suggests the entry it would become': offered === 'smoke 001.png',
      'mock is not blank': pixel(shotCopy, 0.02, 0.02).join() !== pixel(shotCopy, 0.5, 0.5).join(),
      'prompt explains every mark': (() => {
        const p = promptFor(root);
        const { GROUPS: all } = require('../src/tools') as { GROUPS: ToolGroup[] };
        return all.flatMap((g) => g.tools).every((t) => t.id === 'select' || p.includes(`- ${t.label}: `));
      })(),
      'prompt has no Tick or Thumbs up': !/Tick|Thumbs/.test(promptFor(root)),
      'prompt says Reference, not Numbered':
        promptFor(root).includes('references (numbered diamonds)') && !/Numbered|numbered marker/.test(promptFor(root)),
      'fits AI limits': Math.max(outSize.width, outSize.height) <= 1568 && outSize.width * outSize.height <= 1_150_000,
      'aspect kept': Math.abs(outSize.width / outSize.height - shotSize.width / shotSize.height) < 0.01,
      'small image untouched': fitForAI(big(800, 600)).equals(big(800, 600)),
      'large image shrunk':
        JSON.stringify(nativeImage.createFromBuffer(fitForAI(big(3000, 1000))).getSize()) === JSON.stringify({ width: 1568, height: 523 }),
      'marker drawn red': r1 > 180 && g1 < 90 && b1 < 120,
      // A circle of the same size would cover the second point; a diamond's side passes inside it.
      'marker is a diamond: red at its top tip, not beyond its side':
        red(pixel(out, 0.5, 0.5, 0, -tip * 0.88)) && !red(pixel(out, 0.5, 0.5, tip * 0.66, tip * 0.66)),
      'session.md path is absolute':
        sessionMdPath(path.join(root, 'smoke')) === path.resolve(root, 'smoke', 'session.md') && path.isAbsolute(sessionMdPath('rel')),
      'prompt explains the text in the screenshot': promptFor(root).includes('"Text in the screenshot" under an entry'),
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
    if (!ok) console.log('why:', JSON.stringify(why));
    console.log(ok ? 'smoke: ok' : `smoke: FAILED (${[r1, g1, b1]})`);
    app.exit(ok ? 0 : 1);
  })
  .catch((e: unknown) => {
    console.error(e);
    console.log('smoke: FAILED');
    app.exit(1);
  });
