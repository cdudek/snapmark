// Renderer script for bar.html (classic script, like scroll.ts): the capture bar ⌃⇧5 opens. One row: Close, the modes,
// where the capture goes, Options and Capture. A click, an arrow or 1–5 chooses a mode; ↩ or ⌘↩ captures, as Capture
// is the default button; Esc closes; ⇧⌘O switches One-Shot and the last session, ⇧⌘P opens the destination pop-up, ⌥O
// the Options menu. Each control's key is in its tooltip; only Capture shows its key, ↩ (F11).
// Wrapped in a function so its names stay out of the other pages' scope.
(() => {
  const el = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
  const modes = [...document.querySelectorAll<HTMLButtonElement>('#modes [role=radio]')];
  const [capture, options, dest] = [el('capture'), el('options'), el('dest')];
  const box = (b: HTMLElement) => {
    const r = b.getBoundingClientRect();
    return { x: r.left, y: r.top, width: r.width, height: r.height };
  };
  let s: BarInit | null = null;
  let mode: CaptureMode = 'area';

  // A radio group with roving focus: only the chosen one is in the Tab order.
  const choose = (m: CaptureMode) => {
    mode = m;
    for (const b of modes) {
      b.setAttribute('aria-checked', String(b.dataset.mode === m));
      b.tabIndex = b.dataset.mode === m ? 0 : -1;
    }
    modes.find((b) => b.dataset.mode === m)!.focus();
  };
  const render = (next: BarInit) => {
    s = next;
    document.body.classList.toggle('narrow', s.narrow);
    el('capture-label').textContent = s.label; // "Capture One-Shot" while One-Shot is chosen
    capture.setAttribute('aria-label', s.label);
    // The destination: "To <session>", or "One-Shot" (F12)
    const cur = !s.oneShot && s.session;
    el('dest-to').hidden = !cur;
    el('dest-face').textContent = s.oneShot ? 'One-Shot' : cur ? cur.label : 'No session yet';
    dest.setAttribute('aria-label', `Destination: ${cur ? `To ${cur.label}` : el('dest-face').textContent}`);
  };
  const oneShot = (on: boolean) => window.snapmark.barOneShot(on); // main answers with the new state
  const destinations = () => window.snapmark.barSessions(box(dest));

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
    // The physical key, so ⌥O works although it types "ø"
    const is = (letter: string) => e.code === `Key${letter}` || e.key.toUpperCase() === letter;
    const cmd = e.metaKey || e.ctrlKey;
    const step = ({ ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 } as Record<string, number | undefined>)[e.key]; // as a radio group
    const n = !cmd && !e.altKey && e.key.length === 1 ? '12345'.indexOf(e.key) : -1;
    const inModes = modes.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === 'Escape') window.snapmark.barClose();
    else if (e.key === 'Enter')
      window.snapmark.barCapture(mode); // ↩ and ⌘↩, wherever the focus is
    else if (n >= 0)
      choose(modes[n].dataset.mode as CaptureMode); // a digit only chooses, as a click does
    else if (step && inModes >= 0) choose(modes[(inModes + step + modes.length) % modes.length].dataset.mode as CaptureMode);
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
