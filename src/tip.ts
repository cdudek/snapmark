// Renderer script for tip.html (classic script, like bar.ts): the capture bar's label, a name and its key.
(() => {
  if (/Mac/.test(navigator.platform)) document.body.classList.add('mac'); // vibrancy only on macOS
  window.snapmark.onTip(({ text, key }) => {
    document.getElementById('text')!.textContent = text;
    document.getElementById('key')!.textContent = key;
  });
})();
