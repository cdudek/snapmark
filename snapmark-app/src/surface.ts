// Every window's first script, in its <head> so it runs before the first paint (classic script, like bar.ts). On macOS
// the tokens' system block applies: system colours and the window's vibrancy material (tokens.css, data-surface). Linux,
// where CI runs the smoke test, has no material and keeps the tokens' web greys (F3).
if (/Mac/.test(navigator.platform)) document.documentElement.dataset.surface = 'system';
// The focus ring: macOS's accent where main passes it as `ring` (it reaches 3:1), else the text colour; never
// -webkit-focus-ring-color, which Chromium draws in its own orange (F10, F25, N1). The bar sets its own (bar.ts).
document.documentElement.style.setProperty('--ds-color-focus', new URLSearchParams(location.search).get('ring') || 'var(--ds-color-ink)');
