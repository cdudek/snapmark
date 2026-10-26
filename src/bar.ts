// Renderer script for bar.html (classic script, like scroll.ts): the capture bar ⌃⇧5 opens. The modes are one radio
// group with roving focus; a click, an arrow or 1–4 chooses a mode, ↩ or Capture captures, Esc closes.
// Wrapped in a function so its names stay out of the other pages' scope.
(() => {
  const el = (id: string) => document.getElementById(id)!;
  const modes = [...document.querySelectorAll<HTMLButtonElement>('[role=radio]')];
  const buttons = [...document.querySelectorAll<HTMLButtonElement>('button')];
  const [capture, options] = [el('capture'), el('options')];
  let mode: CaptureMode = 'area';
  if (/Mac/.test(navigator.platform)) document.body.classList.add('mac'); // vibrancy only on macOS

  // The label above the bar (tip.html): the button's name and key. Native titles never show in this panel, because
  // it never makes Snapmark the active app (guide WIN-2, EX-7).
  const KEYCAPS: Record<string, string> = { Escape: 'Esc', Enter: '↩' };
  let tipped: HTMLElement | null = null; // the button the label names, so a change of its words redraws it
  const tip = (b: HTMLElement | null) => {
    tipped = b;
    if (!b) return window.snapmark.barTip(null);
    const r = b.getBoundingClientRect();
    const key = b.getAttribute('aria-keyshortcuts') ?? '';
    window.snapmark.barTip({
      text: b.getAttribute('aria-label') ?? '',
      key: KEYCAPS[key] ?? key,
      at: { x: r.left, y: r.top, width: r.width, height: r.height },
    });
  };

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
  const render = (s: BarInit) => {
    capture.textContent = s.label;
    capture.setAttribute('aria-label', s.label);
    modes.find((b) => b.dataset.mode === 'last')!.setAttribute('aria-label', `Capture Last Area · ${s.last}`);
    if (tipped) requestAnimationFrame(() => tipped && tip(tipped)); // after the bar has its new width
  };

  void window.snapmark.barInit().then((s) => {
    render(s);
    choose(s.mode); // focus without a label: only a key or the pointer shows one (F6)
  });
  window.snapmark.onBarState(render);
  for (const b of modes) b.onclick = () => choose(b.dataset.mode as CaptureMode); // chooses; never captures (as macOS)
  el('close').onclick = () => window.snapmark.barClose();
  capture.onclick = () => window.snapmark.barCapture(mode);
  options.onclick = () => {
    tip(null);
    const r = options.getBoundingClientRect();
    window.snapmark.barOptions(mode, { x: r.left, y: r.top, width: r.width, height: r.height });
  };

  // The pointer: a label after resting 300 ms on a button, at once when one already shows; gone on a click. Leaving
  // the bar is the main process's call, since the pointer may rest on the label itself (WCAG 1.4.13).
  let shown = false;
  let wait = 0;
  let byKey = false; // the focus moved by a key (shows a label), not by the opening or a click (none)
  for (const b of buttons) {
    b.addEventListener('mouseenter', () => {
      clearTimeout(wait);
      if (shown) return tip(b);
      wait = window.setTimeout(() => {
        shown = true;
        tip(b);
      }, 300);
    });
    b.addEventListener('mouseleave', () => clearTimeout(wait)); // onto padding or a separator: no label for it
    b.addEventListener('mousedown', () => {
      clearTimeout(wait);
      shown = false;
      byKey = false; // the click's focus shows no label
      tip(null);
    });
  }
  document.documentElement.addEventListener('mouseleave', () => {
    clearTimeout(wait);
    shown = false;
    window.snapmark.barTipLeave();
  });

  // The keyboard: a label for whatever a key moved the focus to, never for the focus the bar opens with.
  document.addEventListener('focusin', (e) => {
    if (byKey && e.target instanceof HTMLButtonElement) tip(e.target);
  });
  document.addEventListener('keydown', (e) => {
    byKey = true;
    const at = modes.indexOf(document.activeElement as HTMLButtonElement);
    const step = ({ ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 } as Record<string, number | undefined>)[e.key]; // as a radio group
    const n = !e.metaKey && !e.ctrlKey && !e.altKey ? '1234'.indexOf(e.key) : -1;
    if (e.key === 'Escape') window.snapmark.barClose();
    else if ((n >= 0 && e.key.length === 1) || (at >= 0 && step)) {
      const b = n >= 0 ? modes[n] : modes[(at + step! + modes.length) % modes.length];
      choose(b.dataset.mode as CaptureMode); // a number only chooses, as a click does (F9)
      tip(b); // also when the mode already had the focus, so no focusin fires
    } else if (at >= 0 && e.key === 'Enter') window.snapmark.barCapture(mode);
    else return; // Space chooses a mode, ↩ and Space press Close, Options and Capture: the buttons' own behaviour
    e.preventDefault();
  });
})();
