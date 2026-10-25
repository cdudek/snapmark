// Renderer script for bar.html (classic script, like scroll.ts): the capture bar ⌃⇧5 opens. The modes are one radio
// group with roving focus; a click or an arrow chooses a mode, ↩ or Capture captures, Esc closes.
// Wrapped in a function so its names stay out of the other pages' scope.
(() => {
  const el = (id: string) => document.getElementById(id)!;
  const modes = [...document.querySelectorAll<HTMLButtonElement>('[role=radio]')];
  const [capture, options] = [el('capture'), el('options')];
  let mode: CaptureMode = 'area';
  if (/Mac/.test(navigator.platform)) document.body.classList.add('mac'); // vibrancy only on macOS

  // Only the chosen mode is in the Tab order: Close → the chosen mode → Options → Capture.
  const choose = (m: CaptureMode) => {
    mode = m;
    for (const b of modes) {
      const on = b.dataset.mode === m;
      b.setAttribute('aria-checked', String(on));
      b.tabIndex = on ? 0 : -1;
      if (on) b.focus();
    }
  };
  const name = (b: HTMLElement, text: string) => {
    b.setAttribute('aria-label', text);
    b.title = text;
  };
  const render = (s: BarInit) => {
    capture.textContent = s.label;
    name(capture, s.label);
    name(modes.find((b) => b.dataset.mode === 'last')!, `Capture Last Area · ${s.last}`);
  };

  void window.snapmark.barInit().then((s) => {
    render(s);
    choose(s.mode);
  });
  window.snapmark.onBarState(render);
  for (const b of modes) b.onclick = () => choose(b.dataset.mode as CaptureMode); // chooses; never captures (as macOS)
  el('close').onclick = () => window.snapmark.barClose();
  capture.onclick = () => window.snapmark.barCapture(mode);
  options.onclick = () => {
    const r = options.getBoundingClientRect();
    window.snapmark.barOptions(mode, { x: r.left, y: r.top, width: r.width, height: r.height });
  };
  document.addEventListener('keydown', (e) => {
    const at = modes.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === 'Escape') window.snapmark.barClose();
    else if (at >= 0 && (e.key === 'ArrowLeft' || e.key === 'ArrowRight'))
      choose(modes[(at + (e.key === 'ArrowRight' ? 1 : modes.length - 1)) % modes.length].dataset.mode as CaptureMode);
    else if (at >= 0 && e.key === 'Enter') window.snapmark.barCapture(mode);
    else return; // Space chooses a mode, ↩ and Space press Close, Options and Capture: the buttons' own behaviour
    e.preventDefault();
  });
})();
