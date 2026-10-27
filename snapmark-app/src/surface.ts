// Every window's first script, in its <head> so it runs before the first paint (classic script, like bar.ts). On macOS
// the tokens' system block applies: system colours and the window's vibrancy material (tokens.css, data-surface). Linux,
// where CI runs the smoke test, has no material and keeps the tokens' web greys (F3).
if (/Mac/.test(navigator.platform)) document.documentElement.dataset.surface = 'system';
