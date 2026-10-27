// Renderer script for bar.html (classic script, like scroll.ts): the capture bar ⌃⇧5 opens. One row: Close, the modes,
// where the capture goes, Options and Capture. A click, an arrow or 1–6 chooses a mode; ↩ or ⌘↩ captures, as Capture
// is the default button; Esc closes; ⇧⌘O switches One-Shot and the last session, ⇧⌘P opens the destination pop-up, ⌥O
// the Options menu. Each control's key is in its tooltip, which the bar draws; only Capture shows its key, ↩ (F11).
// Wrapped in a function so its names stay out of the other pages' scope.
(() => {
  const el = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
  const modes = [...document.querySelectorAll<HTMLButtonElement>('#modes [role=radio]')];
  const [capture, options, dest, tip] = [el('capture'), el('options'), el('dest'), el('tip')];
  const box = (b: HTMLElement) => {
    const r = b.getBoundingClientRect();
    return { x: r.left, y: r.top, width: r.width, height: r.height };
  };
  let s: BarInit | null = null;
  let mode: CaptureMode = 'area';

  // Capture's label follows the mode: "Capture", "Start Scrolling", or "Capture One-Shot" while One-Shot is chosen
  const paintCapture = () => {
    if (!s) return;
    el('capture-label').textContent = s.labels[mode];
    capture.setAttribute('aria-label', s.labels[mode]);
    capture.dataset.tip = s.labels[mode];
  };
  // A radio group with roving focus: only the chosen one is in the Tab order. `ring`: only an arrow shows the focus
  // ring; as the bar opens, a click or a digit the focus is there for the keys but shows none (F9, F10). Chromium
  // otherwise draws the ring for a focus set by script.
  const choose = (m: CaptureMode, ring = false) => {
    mode = m;
    for (const b of modes) {
      b.setAttribute('aria-checked', String(b.dataset.mode === m));
      b.tabIndex = b.dataset.mode === m ? 0 : -1;
    }
    paintCapture();
    const b = modes.find((o) => o.dataset.mode === m)!;
    if (!ring && document.activeElement === b) b.blur(); // a digit on a ringed mode drops its ring too
    b.focus({ focusVisible: ring });
  };
  const render = (next: BarInit) => {
    s = next;
    document.body.classList.toggle('narrow', s.narrow);
    // The ring in macOS's accent where it reaches 3:1, else the text colour: -webkit-focus-ring-color is Chromium's
    // fixed orange (F10, N1)
    document.documentElement.style.setProperty('--ds-color-focus', s.ring ?? 'var(--ds-color-ink)');
    paintCapture();
    // The destination: "To <session>", or "One-Shot" (F12)
    const cur = !s.oneShot && s.session;
    el('dest-to').hidden = !cur;
    el('dest-face').textContent = s.oneShot ? 'One-Shot' : cur ? cur.label : 'No session yet';
    dest.setAttribute('aria-label', `Destination: ${cur ? `To ${cur.label}` : el('dest-face').textContent}`);
  };
  const oneShot = (on: boolean) => window.snapmark.barOneShot(on); // main answers with the new state
  const destinations = () => window.snapmark.barSessions(box(dest));

  // The tooltip: the control's name and key, after a hover's delay or at once on a keyboard focus. Drawn beside the
  // control, inside the bar, so it never clips; a key or a press hides it.
  const TIP_DELAY = 1000; // about as long as macOS waits before a tooltip
  let tipFor: HTMLElement | null = null;
  let hover = 0;
  const showTip = (b: HTMLElement) => {
    tipFor = b;
    tip.firstElementChild!.textContent = b.dataset.tip!;
    tip.lastElementChild!.textContent = b.dataset.key!;
    tip.hidden = false;
    const [r, w, gap] = [b.getBoundingClientRect(), tip.offsetWidth, 8];
    const x = r.right + gap + w <= innerWidth - gap ? r.right + gap : r.left - gap - w; // after it, else before it
    tip.style.left = `${Math.max(gap, Math.min(x, innerWidth - gap - w))}px`;
  };
  const hideTip = () => {
    clearTimeout(hover);
    tip.hidden = true;
    tipFor = null;
  };
  for (const b of document.querySelectorAll<HTMLElement>('button[data-tip]')) {
    b.addEventListener('mouseenter', () => {
      clearTimeout(hover);
      hover = window.setTimeout(() => showTip(b), TIP_DELAY);
    });
    b.addEventListener('mouseleave', () => (tipFor === b ? hideTip() : clearTimeout(hover)));
    b.addEventListener('mousedown', hideTip);
    b.addEventListener('focus', () => b.matches(':focus-visible') && showTip(b));
    b.addEventListener('blur', () => tipFor === b && hideTip());
  }

  void window.snapmark.barInit().then((init) => {
    render(init);
    choose(init.mode);
  });
  window.snapmark.onBarState(render);
  for (const b of modes) b.onclick = () => choose(b.dataset.mode as CaptureMode); // chooses; never captures (CAP-4)
  dest.onclick = destinations;
  el('close').onclick = () => window.snapmark.barClose();
  capture.onclick = () => window.snapmark.barCapture(mode);
  options.onclick = () => window.snapmark.barOptions(mode, box(options));

  document.addEventListener('keydown', (e) => {
    hideTip(); // a focus the key moves shows its own
    // The physical key, so ⌥O works although it types "ø"
    const is = (letter: string) => e.code === `Key${letter}` || e.key.toUpperCase() === letter;
    const cmd = e.metaKey || e.ctrlKey;
    const step = ({ ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 } as Record<string, number | undefined>)[e.key]; // as a radio group
    const n = !cmd && !e.altKey && e.key.length === 1 ? '123456'.indexOf(e.key) : -1;
    const inModes = modes.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === 'Escape') window.snapmark.barClose();
    else if (e.key === 'Enter')
      window.snapmark.barCapture(mode); // ↩ and ⌘↩, wherever the focus is
    else if (n >= 0)
      choose(modes[n].dataset.mode as CaptureMode); // a digit only chooses, as a click does, without the ring
    else if (step && inModes >= 0) choose(modes[(inModes + step + modes.length) % modes.length].dataset.mode as CaptureMode, true);
    else if (e.key === 'ArrowDown' && document.activeElement === dest)
      destinations(); // ↓ opens a pop-up button, as in macOS
    else if (cmd && e.shiftKey && is('O'))
      oneShot(!s?.oneShot); // One-Shot or the last session (F13)
    else if (cmd && e.shiftKey && is('P'))
      destinations(); // F13
    else if (e.altKey && !cmd && is('O')) options.click();
    else return; // Space presses the focused button: its own behaviour
    e.preventDefault();
  });
})();
