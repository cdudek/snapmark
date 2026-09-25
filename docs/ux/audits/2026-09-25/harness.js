/* global require, process, console, setTimeout */
/* eslint-disable @typescript-eslint/no-require-imports -- a plain Node script run by Electron, kept with the audit so it can be re-run */
// Audit harness: opens the REAL Snapmark editor (compiled dist/) on a MOCK page, runs page steps,
// screenshots the editor window. Never captures the real screen; never touches the owner's data.
//
// Run from the repo root:
//   SNAPMARK_ROOT=$(mktemp -d) OUT=/path/shot.png [W=1180 H=600] [THEME=light|dark] \
//   [STEPS=/path/steps.js] [SAVE=1] [MOCK=/path/page.html] \
//   npx electron [--force-device-scale-factor=1] <this file>
//
// STEPS is a file whose body runs inside the editor page (async). These helpers are in scope:
//   sleep(ms) · key(k, opts) · ev(type, fx, fy) · drag(key|null, [[fx,fy],...]) · note(text) · px(fx,fy)
//   and the editor's own globals (canvas, GROUPS, tool(), markers(), cards(), links, background, undoStack...).
//   Whatever the body `return`s is printed as JSON after "RESULT:".
// SAVE=1 clicks "Add to session" afterwards and prints session.md plus the saved image path.
const fs = require('fs');
const os = require('os');
const path = require('path');
const { app, BrowserWindow, nativeTheme } = require('electron');

const REPO = process.cwd();
const root = process.env.SNAPMARK_ROOT || fs.mkdtempSync(path.join(os.tmpdir(), 'snapmark-audit-'));
process.env.SNAPMARK_ROOT = root;
process.env.SNAPMARK_NO_UI = '1';
app.setPath('userData', path.join(root, '.userData')); // never the installed app's state
if (process.platform === 'linux') app.disableHardwareAcceleration();

const MOCK_APP = `<body style="margin:0;font:14px system-ui;background:#fff;color:#18181b">
<header style="height:52px;background:#18181b;color:#fff;display:flex;align-items:center;gap:24px;padding:0 20px">
 <b>Acme Ops</b><span style="opacity:.7">Dashboard</span><span style="opacity:.7">Orders</span><span style="opacity:.7">Customers</span>
 <input placeholder="Search orders" style="margin-left:auto;padding:6px 10px;border-radius:6px;border:0;width:220px"></header>
<div style="display:flex">
 <nav style="width:190px;height:650px;background:#f4f4f5;padding:18px;line-height:2.2">Overview<br><b>Orders</b><br>Returns<br>Invoices<br>Settings</nav>
 <main style="padding:24px;flex:1">
  <div style="display:flex;align-items:center;gap:12px"><h2 style="margin:0">Orders</h2>
   <button style="margin-left:auto;padding:8px 14px">Export CSV</button><button style="padding:8px 14px;background:#2563eb;color:#fff;border:0;border-radius:6px">New order</button></div>
  <div style="display:flex;gap:12px;margin:18px 0">
   <div style="flex:1;border:1px solid #e4e4e7;border-radius:8px;padding:12px">Open<br><b style="font-size:22px">128</b></div>
   <div style="flex:1;border:1px solid #e4e4e7;border-radius:8px;padding:12px">Shipped<br><b style="font-size:22px">1,042</b></div>
   <div style="flex:1;border:1px solid #e4e4e7;border-radius:8px;padding:12px">Revenue<br><b style="font-size:22px">€84,210</b></div></div>
  <table style="width:100%;border-collapse:collapse">
   <tr style="text-align:left;color:#71717a"><th>Order</th><th>Customer</th><th>Status</th><th>Total</th><th></th></tr>
   <tr><td>#1042</td><td>Jane Cooper</td><td><span style="background:#dcfce7;padding:2px 8px;border-radius:9px">Paid</span></td><td>€120.00</td><td>Edit · Delete</td></tr>
   <tr><td>#1041</td><td>Wade Warren</td><td><span style="background:#fef9c3;padding:2px 8px;border-radius:9px">Pending</span></td><td>€48.50</td><td>Edit · Delete</td></tr>
   <tr><td>#1040</td><td>Esther Howard</td><td><span style="background:#fee2e2;padding:2px 8px;border-radius:9px">Failed</span></td><td>€310.00</td><td>Edit · Delete</td></tr>
  </table>
  <p style="color:#71717a;margin-top:18px">Showing 3 of 128 · <a href="#">Load more</a></p>
 </main></div></body>`;

const { openEditor, setActive } = require(path.join(REPO, 'dist/src/main.js'));
const sessions = require(path.join(REPO, 'dist/src/sessions.js'));

const HELPERS = `
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const up = () => document.querySelector('.upper-canvas');
const ev = (type, fx, fy) => { const b = up().getBoundingClientRect(); up().dispatchEvent(new MouseEvent(type, { clientX: b.left + b.width * fx, clientY: b.top + b.height * fy, button: 0, buttons: type === 'mouseup' ? 0 : 1, bubbles: true })); };
const key = (k, opts = {}) => document.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, ...opts }));
const drag = (k, pts) => { if (k) key(k); ev('mousedown', ...pts[0]); pts.slice(1).forEach((p) => ev('mousemove', ...p)); ev('mouseup', ...pts.at(-1)); };
const note = (text) => { document.activeElement.value = text; document.activeElement.dispatchEvent(new Event('input')); document.activeElement.blur(); };
const px = (fx, fy) => { canvas.renderAll(); return Array.from(canvas.lowerCanvasEl.getContext('2d').getImageData(Math.round(canvas.width * fx), Math.round(canvas.height * fy), 1, 1).data); };
`;

setTimeout(() => {
  console.log('HARNESS: TIMEOUT');
  app.exit(1);
}, 60000);
app
  .whenReady()
  .then(async () => {
    if (process.env.THEME === 'dark' || process.env.THEME === 'light') nativeTheme.themeSource = process.env.THEME;
    const mock = new BrowserWindow({ width: 1200, height: 700 });
    const html = process.env.MOCK ? fs.readFileSync(process.env.MOCK, 'utf8') : MOCK_APP;
    await mock.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent('<meta charset="utf-8">' + html)}`);
    await new Promise((r) => setTimeout(r, 300));
    const shot = path.join(root, `mock-${Date.now()}.png`);
    fs.writeFileSync(shot, (await mock.webContents.capturePage()).toPNG());
    mock.destroy();
    setActive(sessions.create(root, process.env.SESSION || 'audit'));
    const win = openEditor(shot);
    if (process.env.W && process.env.H) win.setSize(Number(process.env.W), Number(process.env.H));
    win.webContents.on('console-message', (e) => console.log('[page]', e.message));
    await new Promise((r) => win.webContents.once('did-finish-load', () => r()));
    const body = process.env.STEPS ? fs.readFileSync(process.env.STEPS, 'utf8') : '';
    const result = await win.webContents.executeJavaScript(
      `(async () => { ${HELPERS} for (let i = 0; i < 50 && !background; i++) await sleep(100); await sleep(300); ${body} })()`,
    );
    if (result !== undefined) console.log('RESULT:', JSON.stringify(result));
    win.webContents.invalidate();
    await new Promise((r) => setTimeout(r, 500));
    if (process.env.OUT) {
      fs.writeFileSync(process.env.OUT, (await win.webContents.capturePage()).toPNG());
      console.log('SHOT:', process.env.OUT);
    }
    if (process.env.SAVE) {
      await win.webContents.executeJavaScript(`document.getElementById('save').click()`);
      await new Promise((r) => setTimeout(r, 800));
      const dir = path.join(root, process.env.SESSION || 'audit');
      console.log('SESSION_MD_BEGIN\n' + fs.readFileSync(path.join(dir, 'session.md'), 'utf8') + '\nSESSION_MD_END');
      console.log('SAVED_IMG_DIR:', path.join(dir, 'img'));
    }
    app.exit(0);
  })
  .catch((e) => {
    console.error(e);
    app.exit(1);
  });
