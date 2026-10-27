// Renderer script for countdown.html (classic script, like scroll.ts): the Timer's overlay over the area's display.
// The query gives the first digit and the area in window points (none for Full Screen); main sends each next digit.
// With no digit it is Record's outline while it records; `rec` is Record's countdown.
(() => {
  const q = new URLSearchParams(location.search);
  // The page zoom: the window and the area are in points, the page in zoomed CSS pixels. About 150 % gets the larger
  // square.
  const zoom = innerWidth ? outerWidth / innerWidth : 1;
  if (zoom >= 1.4) {
    document.documentElement.style.setProperty('--zoom', String(zoom));
    document.documentElement.classList.add('zoomed');
  }
  const [x, y, w, h] = ['x', 'y', 'w', 'h'].map((k) => Number(q.get(k)) / zoom);
  const hasArea = q.has('w');
  const outline = document.getElementById('outline')!;
  const square = document.getElementById('square')!;
  const digit = document.getElementById('digit')!;
  const say = document.getElementById('say')!;
  if (hasArea) {
    Object.assign(outline.style, { left: `${x}px`, top: `${y}px`, width: `${w}px`, height: `${h}px` });
    outline.hidden = false;
  }
  // Centred on the area, or on the display for Full Screen; a small area's square overflows it but is never clipped.
  const place = () => {
    const [cx, cy] = hasArea ? [x + w / 2, y + h / 2] : [innerWidth / 2, innerHeight / 2];
    const { offsetWidth: sw, offsetHeight: sh } = square;
    square.style.left = `${Math.max(0, Math.min(cx - sw / 2, innerWidth - sw))}px`;
    square.style.top = `${Math.max(0, Math.min(cy - sh / 2, innerHeight - sh))}px`;
  };
  const show = (s: number, first = false) => {
    digit.textContent = String(s);
    digit.classList.remove('tick');
    void digit.offsetWidth; // restarts the animation for the new digit
    digit.classList.add('tick');
    say.textContent = first ? `${q.has('rec') ? 'Recording starts' : 'Capture'} in ${s} seconds. Esc cancels.` : String(s);
  };
  // No digit: the outline alone, without the dimming, while Record records the area
  if (!Number(q.get('s'))) {
    square.hidden = true;
    outline.classList.add('bare');
  } else {
    show(Number(q.get('s')), true);
    place();
    addEventListener('resize', place);
  }
  window.snapmark.onCountdown((s) => show(s));
})();
