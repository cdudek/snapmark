// Renderer script for scroll.html (classic script, like area.ts): the small control beside the area while Capture
// Scrolling grabs it, or while Record records it (scroll.html#record). Wrapped in a function so its names stay out of the other pages' scope.
(() => {
  const el = (id: string) => document.getElementById(id)!;
  const count = el('count');
  const done = (ok: boolean) => window.snapmark.scrollDone(ok);
  el('done').onclick = el('rec-done').onclick = () => done(true);
  el('cancel').onclick = el('rec-cancel').onclick = () => done(false);
  // The recording control never has the focus and takes no key: the recorded app keeps ↩ and Esc (F65)
  const recording = location.hash === '#record';
  document.body.classList.toggle('record', recording);
  if (!recording)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') done(true);
      if (e.key === 'Escape') done(false);
    });
  let said = 0;
  window.snapmark.onRecordStatus(({ clock, seconds }) => {
    el('clock').textContent = clock;
    el('clock').classList.toggle('warn', seconds >= 25);
    const tens = Math.floor(seconds / 10) * 10;
    if (tens > said) el('rec-say').textContent = `Recording, ${(said = tens)} seconds of 30`;
  });
  window.snapmark.onScrollStatus(({ frames, height, step }) => {
    const lost = step === 'lost';
    count.classList.toggle('warn', lost);
    count.textContent = lost
      ? 'Lost the place: scroll back up a little'
      : `${frames} frame${frames === 1 ? '' : 's'} · ${height.toLocaleString('en-US')} px tall`;
  });
})();
