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
  const fps = new URLSearchParams(location.search).get('fps');
  if (recording && fps) el('clock').textContent = `0:00 of 0:30 · ${fps} fps`; // until the first status (F63)
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
  window.snapmark.onScrollStatus(({ frames, height, step, mode }) => {
    const lost = step === 'lost';
    const tally = `${frames} frame${frames === 1 ? '' : 's'} · ${height.toLocaleString('en-US')} px tall`;
    count.classList.toggle('warn', lost);
    count.textContent = lost
      ? 'Lost the place: scroll back up a little'
      : {
          auto: `Scrolling · ${tally}`,
          manual: `Scroll down, then Done · ${tally}`,
          stuck: 'This area did not scroll. Scroll it yourself, then Done.',
          denied: 'Auto-scroll needs Accessibility. Turn it on in Snapmark Settings ▸ Capture.',
        }[mode];
  });
})();
