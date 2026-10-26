// Renderer script for area.html (classic script, like editor.ts): drag out the area Capture Last Area keeps capturing,
// or the one Capture Scrolling grabs while the owner scrolls (area.html#scroll).
// Wrapped in a function so its names stay out of editor.ts's scope.
(() => {
  const el = (id: string) => document.getElementById(id)!;
  const [hint, box, size, say] = [el('hint'), el('box'), el('size'), el('say')];
  if (location.hash === '#scroll') hint.textContent = 'Drag over the part that scrolls, then scroll it. Esc cancels.';
  if (location.hash === '#gone') hint.textContent = 'The last area was on a display that is not connected. Drag a new area. Esc cancels.';
  let start: { x: number; y: number } | null = null;
  let area: Area | null = null;

  document.addEventListener('mousedown', (e) => {
    start = { x: e.clientX, y: e.clientY };
    hint.hidden = true;
    document.body.classList.add('dragging');
  });
  document.addEventListener('mousemove', (e) => {
    if (!start) return;
    const [x, y] = [Math.min(start.x, e.clientX), Math.min(start.y, e.clientY)];
    area = { x, y, width: Math.abs(e.clientX - start.x), height: Math.abs(e.clientY - start.y) };
    Object.assign(box.style, { left: `${x}px`, top: `${y}px`, width: `${area.width}px`, height: `${area.height}px` });
    Object.assign(size.style, { left: `${x}px`, top: `${y + area.height + 6}px` });
    size.textContent = `${area.width} × ${area.height}`;
    say.textContent = `${area.width} by ${area.height} points`; // F043: a screen reader hears the size as it changes
    box.hidden = size.hidden = false;
  });
  document.addEventListener('mouseup', () => {
    if (area && area.width >= 8 && area.height >= 8) {
      say.textContent = `Area set: ${area.width} by ${area.height} points.`;
      return window.snapmark.areaDone(area);
    }
    // A click, or a sliver: start over.
    start = area = null;
    box.hidden = size.hidden = true;
    hint.hidden = false;
    document.body.classList.remove('dragging');
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') window.snapmark.areaDone(null);
  });
})();
