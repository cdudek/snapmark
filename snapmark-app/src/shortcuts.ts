// Renderer script for shortcuts.html (classic script, like scroll.ts; tools.js loads first): the Keyboard Shortcuts
// window, after the round-1 mock. Other keys come from keys.ts KEY_GROUPS, the tools from the toolbar's own GROUPS,
// so the window never disagrees with either. Esc closes it.
// Wrapped in a function so its names stay out of the other pages' scope.
(() => {
  const make = <K extends keyof HTMLElementTagNameMap>(tag: K, className = '', text = '') => {
    const e = document.createElement(tag);
    e.className = className;
    e.textContent = text;
    return e;
  };
  // Each chord its own keycap: "⌘S / ⌘↵" and "1 or ⌘1" stay one row.
  const keys = (k: string) => {
    const td = make('td', 'keys');
    k.split(/ (or|\/) /).forEach((part, i) => td.append(i % 2 ? make('span', 'or', part) : make('kbd', '', part)));
    return td;
  };
  const row = (cells: HTMLElement[]) => {
    const tr = make('tr');
    tr.append(...cells);
    return tr;
  };

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') window.close();
  });

  void window.snapmark.shortcutsInit().then(({ groups, singleKeys }) => {
    const other = document.getElementById('other')!;
    for (const g of groups) {
      const table = make('table');
      table.append(...g.rows.map(([k, name, what]) => row([keys(k), make('td', 'name', name), make('td', 'what', what)])));
      other.append(make('h2', '', g.title), table);
    }
    document.getElementById('tool-rows')!.append(
      ...GROUPS.flatMap((g) =>
        g.tools.map((t, v) => {
          const icon = make('td', 'icon');
          icon.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${t.icon}</svg>`; // tools.ts's own markup
          return row([
            keys(toolKey(g, v, singleKeys)),
            make('td', 'again', v ? 'again' : ''),
            icon,
            make('td', 'name', t.label),
            make('td', 'what', t.tip ?? t.means ?? ''),
          ]);
        }),
      ),
    );
    document.getElementById('setting')!.textContent = singleKeysLine(singleKeys);
  });
})();
