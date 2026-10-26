// Renderer script for bar.html (classic script, like scroll.ts): the capture bar ⌃⇧5 opens. Two rows: the chosen mode's
// headline and hint with where the capture goes, then the controls. A click, an arrow or 1–5 chooses a mode; ↩ or ⌘↩
// captures, as Capture is the default button; Esc closes; ⇧⌘O switches Session and One-Shot, ⇧⌘P opens the session
// pop-up, ⌥O the Options menu. Names and keys are on the bar itself: native tooltips never show in this panel (WIN-2).
// Wrapped in a function so its names stay out of the other pages' scope.
(() => {
  const el = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
  const modes = [...document.querySelectorAll<HTMLButtonElement>('#modes [role=radio]')];
  const segs = [...document.querySelectorAll<HTMLButtonElement>('#dest [role=radio]')];
  const [capture, options, pop] = [el('capture'), el('options'), el('session')];
  const box = (b: HTMLElement) => {
    const r = b.getBoundingClientRect();
    return { x: r.left, y: r.top, width: r.width, height: r.height };
  };
  let s: BarInit | null = null;
  let mode: CaptureMode = 'area';
  if (/Mac/.test(navigator.platform)) document.body.classList.add('mac'); // vibrancy only on macOS

  // A radio group with roving focus: only the chosen one is in the Tab order.
  const check = (group: HTMLButtonElement[], on: HTMLButtonElement, focus: boolean) => {
    for (const b of group) {
      b.setAttribute('aria-checked', String(b === on));
      b.tabIndex = b === on ? 0 : -1;
    }
    if (focus) on.focus();
  };
  const head = () => {
    if (!s) return;
    [el('headline').textContent, el('hint').textContent] = s.heads[mode];
  };
  const choose = (m: CaptureMode) => {
    mode = m;
    check(
      modes,
      modes.find((b) => b.dataset.mode === m)!,
      true,
    );
    head();
  };
  const render = (next: BarInit) => {
    s = next;
    document.body.classList.toggle('narrow', s.narrow);
    el('capture-label').textContent = s.label; // "Capture One-Shot" while One-Shot is chosen (F22)
    capture.setAttribute('aria-label', s.label);
    check(segs, segs[s.oneShot ? 1 : 0], segs.includes(document.activeElement as HTMLButtonElement));
    // One-Shot captures go to no session, so the pop-up is greyed with its reason (F21)
    const cur = s.session;
    pop.setAttribute('aria-disabled', String(s.oneShot));
    const face = s.oneShot ? 'Not in a session' : !cur ? 'No session yet' : cur.count ? `${cur.label} (${cur.count})` : cur.label;
    el('session-face').textContent = face;
    pop.setAttribute('aria-label', `Session: ${face}`); // the face without its ⇧⌘P caption, which aria-keyshortcuts gives
    pop.title = !s.oneShot && cur ? `Current session: ${cur.label}` : '';
    head();
  };
  const oneShot = (on: boolean) => window.snapmark.barOneShot(on); // main answers with the new state
  const sessions = () => s && !s.oneShot && window.snapmark.barSessions(box(pop));

  void window.snapmark.barInit().then((init) => {
    render(init);
    choose(init.mode);
  });
  window.snapmark.onBarState(render);
  for (const b of modes) b.onclick = () => choose(b.dataset.mode as CaptureMode); // chooses; never captures (CAP-4)
  segs.forEach((b, i) => (b.onclick = () => oneShot(i === 1)));
  pop.onclick = sessions;
  el('close').onclick = () => window.snapmark.barClose();
  capture.onclick = () => window.snapmark.barCapture(mode);
  options.onclick = () => window.snapmark.barOptions(mode, box(options));

  document.addEventListener('keydown', (e) => {
    // The physical key, so ⌥O works although it types "ø"
    const is = (letter: string) => e.code === `Key${letter}` || e.key.toUpperCase() === letter;
    const cmd = e.metaKey || e.ctrlKey;
    const step = ({ ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 } as Record<string, number | undefined>)[e.key]; // as a radio group
    const n = !cmd && !e.altKey && e.key.length === 1 ? '12345'.indexOf(e.key) : -1;
    const [inModes, inSegs] = [modes, segs].map((g) => g.indexOf(document.activeElement as HTMLButtonElement));
    if (e.key === 'Escape') window.snapmark.barClose();
    else if (e.key === 'Enter')
      window.snapmark.barCapture(mode); // ↩ and ⌘↩, wherever the focus is (F16)
    else if (n >= 0)
      choose(modes[n].dataset.mode as CaptureMode); // a digit only chooses, as a click does (F15)
    else if (step && inModes >= 0) choose(modes[(inModes + step + modes.length) % modes.length].dataset.mode as CaptureMode);
    else if (step && inSegs >= 0) {
      segs[1 - inSegs].focus(); // two segments: either arrow moves to the other one and chooses it
      oneShot(inSegs === 0);
    } else if (e.key === 'ArrowDown' && document.activeElement === pop)
      sessions(); // ↓ opens a pop-up button, as in macOS
    else if (cmd && e.shiftKey && is('O'))
      oneShot(!s?.oneShot); // F24
    else if (cmd && e.shiftKey && is('P'))
      sessions(); // F25
    else if (e.altKey && !cmd && is('O')) options.click();
    else return; // Space presses the focused button: its own behaviour
    e.preventDefault();
  });
})();
