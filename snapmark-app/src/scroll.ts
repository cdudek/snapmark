// Renderer script for scroll.html (classic script, like area.ts): the small control beside the area while Capture
// Scrolling grabs it. Wrapped in a function so its names stay out of the other pages' scope.
(() => {
  const count = document.getElementById('count')!;
  const done = (ok: boolean) => window.snapmark.scrollDone(ok);
  document.getElementById('done')!.onclick = () => done(true);
  document.getElementById('cancel')!.onclick = () => done(false);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') done(true);
    if (e.key === 'Escape') done(false);
  });
  window.snapmark.onScrollStatus(({ frames, height, step }) => {
    const lost = step === 'lost';
    count.classList.toggle('warn', lost);
    count.textContent = lost
      ? 'Lost the place: scroll back up a little'
      : `${frames} frame${frames === 1 ? '' : 's'} · ${height.toLocaleString('en-US')} px tall`;
  });
})();
