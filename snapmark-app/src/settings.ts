// Renderer script for settings.html (classic script, like scroll.ts): the Settings window's three tabs. Every change
// goes to the main process at once; the window reads its data again whenever it comes forward.
// Wrapped in a function so its names stay out of the other pages' scope.
(() => {
  const el = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
  const box = (id: string) => el<HTMLInputElement>(id);
  const button = (id: string) => el<HTMLButtonElement>(id);
  const s = window.snapmark;

  // The toolbar: a tab list. The window is titled after the tab shown, and opens on the one shown last.
  const tabs = [...document.querySelectorAll<HTMLButtonElement>('[role=tab]')];
  const show = (tab: HTMLButtonElement, focus = false) => {
    for (const t of tabs) {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      el(t.getAttribute('aria-controls')!).hidden = !on;
    }
    document.title = tab.textContent!.trim();
    if (focus) tab.focus();
    try {
      localStorage.setItem('settings-tab', tab.id);
    } catch {
      // no storage: it opens on General next time
    }
  };
  let first = tabs[0];
  try {
    first = tabs.find((t) => t.id === localStorage.getItem('settings-tab')) ?? first;
  } catch {
    // no storage: General
  }
  show(first);
  for (const t of tabs) t.onclick = () => show(t);
  el('tabs').addEventListener('keydown', (e) => {
    const at = tabs.indexOf(document.activeElement as HTMLButtonElement);
    const to = (
      { ArrowRight: at + 1, ArrowLeft: at - 1 + tabs.length, Home: 0, End: tabs.length - 1 } as Record<string, number | undefined>
    )[e.key];
    if (at < 0 || to === undefined) return;
    e.preventDefault();
    show(tabs[to % tabs.length], true);
  });

  const render = (d: SettingsInit) => {
    box('login').checked = d.login.checked;
    box('login').disabled = !d.login.enabled;
    el('login-wait').hidden = !d.login.needsApproval;
    el('login-dev').hidden = d.login.enabled;
    el('root').textContent = d.root;
    button('change').disabled = !d.canChangeRoot;
    el('root-env').hidden = d.canChangeRoot;
    el('version').textContent = `Snapmark ${d.version}`;
    button('updates').disabled = !d.canUpdate;
    el('updates-dev').hidden = d.canUpdate;
    box(d.capture.oneShot ? 'oneshot' : 'current').checked = true;
    el<HTMLSelectElement>('timer').value = String(d.capture.timer);
    box('pointer').checked = d.capture.pointer;
    el('scrolls').textContent = d.scrolls
      ? 'Capture Scrolling scrolls by itself.'
      : 'Capture Scrolling needs Accessibility to scroll by itself.';
    button('accessibility').hidden = d.scrolls;
    box('single').checked = d.singleKeys;
    el('keys').replaceChildren(
      ...d.keys.map(({ cap, name, taken }) => {
        const li = document.createElement('li');
        const kbd = document.createElement('kbd');
        kbd.textContent = cap;
        li.append(kbd, name);
        if (taken) {
          const note = document.createElement('span');
          note.className = 'taken';
          note.textContent = 'Taken by another app';
          li.append(note);
        }
        return li;
      }),
    );
  };
  // The window is as big as the tab shown, at any zoom: main sizes it to the page, so nothing clips or scrolls (F27,
  // F29). Again when a tab, a note or the zoom changes the page.
  const fit = () => s.settingsFit(document.body.offsetWidth, Math.ceil(document.body.getBoundingClientRect().height));
  new ResizeObserver(fit).observe(document.body);
  window.addEventListener('resize', fit);

  const load = () => void s.settingsInit().then(render);
  load();
  // Login or Accessibility approval given in System Settings, or an option changed in the capture bar, shows when the window comes back.
  window.addEventListener('focus', load);

  const set = (key: SettingsKey, value: boolean | number) => void s.settingsSet(key, value).then(render);
  box('login').onchange = () => set('login', box('login').checked);
  box('current').onchange = () => set('oneShot', false);
  box('oneshot').onchange = () => set('oneShot', true);
  el<HTMLSelectElement>('timer').onchange = () => set('timer', Number(el<HTMLSelectElement>('timer').value));
  box('pointer').onchange = () => set('pointer', box('pointer').checked);
  box('single').onchange = () => set('singleKeys', box('single').checked);
  for (const [id, what] of [
    ['change', 'chooseRoot'],
    ['clear', 'clearOld'],
    ['updates', 'checkUpdates'],
    ['login-items', 'loginItems'],
    ['accessibility', 'accessibility'],
    ['all', 'shortcuts'],
  ] as const)
    button(id).onclick = () => void s.settingsRun(what).then(render);
})();
