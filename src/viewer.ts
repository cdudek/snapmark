// Renderer script for viewer.html (classic script, like editor.ts): one session's window. Document is session.md,
// rendered and editable; Screenshots a grid of thumbnails that opens one at a time; Discarded what was thrown away
// from this session in the last 7 days. Wrapped in a function so its names stay out of editor.ts's scope.
(() => {
  const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
  const docEl = $<HTMLDivElement>('doc');
  const shotsEl = $<HTMLElement>('shots');
  const img = $<HTMLImageElement>('shot');
  const nameEl = $('name');
  const input = $<HTMLInputElement>('rename');
  const hint = $('hint');
  const menu = $('menu');
  const pad = (n: number) => String(n).padStart(3, '0');
  const views = { doc: $('doc-page'), grid: $('grid-view'), shot: shotsEl, discarded: $('discarded') };
  type View = keyof typeof views;

  let data: ViewerInit = { session: '', label: '', name: '', stamped: false, base: '', md: '', shots: [], discarded: [] };
  let field: import('./md-notes').MdField | null = null;
  let mounted = { md: '' }; // the session.md text the field was mounted with or last saved
  let edited = false; // the owner typed since the last load
  let index = 0;
  let view: View = 'doc';
  let version = 0; // in image URLs, so a screenshot replaced by Edit Again is not shown from the cache
  let menuFor = 0; // the entry the "…" menu is open for

  // The editor asks for the latest text before it appends a screenshot, so nothing typed here is lost.
  (window as unknown as { __flush: () => string | null }).__flush = () => (edited && field ? field.value() : null);

  const src = (n: number) => `img/${pad(n)}.png?v=${version}`;
  const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;

  async function load(d: ViewerInit) {
    data = d;
    version++;
    document.title = `${d.label} — Snapmark`;
    $('title').textContent = d.label;
    $('total').textContent = d.shots.length ? `· ${plural(d.shots.length, 'screenshot')}` : '';
    $('tab-discarded').hidden = !d.discarded.length;
    $('discarded-count').textContent = String(d.discarded.length);
    // Resolve img/NNN.png against the session folder. Added after the scripts loaded, so it only affects images.
    const base = document.querySelector('base') ?? document.head.appendChild(document.createElement('base'));
    base.href = d.base;
    renderGrid();
    renderDiscarded();
    index = Math.min(index, Math.max(0, d.shots.length - 1));
    if (view === 'discarded' && !d.discarded.length) view = 'doc';
    if (view === 'shot' && !d.shots.length) view = 'grid';
    show(view);
    // Only the lists changed (something discarded): keep the field, and what is being typed in it.
    if (field && d.md === mounted.md) return;
    edited = false;
    // A tall screenshot saved again keeps its part file names: never show the old parts from the cache (F21). Nothing
    // is added to session.md for it.
    window.snapmark.clearImageCache();
    docEl.replaceChildren();
    // Each save says which text it edits, so a late save from before a reload can never overwrite a new screenshot.
    const m = { md: d.md };
    mounted = m;
    field = await MdNotes.mount(docEl, d.md, {
      placeholder: 'This session is empty. Capture a screenshot with ⌃⇧4.',
      onChange: (md) => {
        edited = true;
        void window.snapmark.viewerSave(m.md, md).then((ok) => ok && (m.md = md));
      },
    });
  }

  const clone = (id: string) => ($<HTMLTemplateElement>(id).content.firstElementChild as HTMLElement).cloneNode(true) as HTMLElement;

  function renderGrid() {
    $('grid-empty').hidden = data.shots.length > 0;
    $('grid').replaceChildren(
      ...data.shots.map((s, i) => {
        const card = clone('thumb-t');
        const q = <T extends HTMLElement>(sel: string) => card.querySelector(sel) as T;
        card.dataset.n = String(s.n);
        q<HTMLImageElement>('img').src = src(s.n);
        q('.pic').setAttribute('aria-label', `Open ${s.heading}`);
        q('.pic').onclick = () => {
          index = i;
          show('shot');
        };
        q('.edit').hidden = !s.editable;
        q('.edit').onclick = () => window.snapmark.viewerEdit(s.n);
        q('.more').onclick = (e) => {
          e.stopPropagation();
          openMenu(e.currentTarget as HTMLElement, s.n);
        };
        q('.heading').textContent = s.heading;
        q('.notes').textContent = s.notes ? plural(s.notes, 'note') : 'No notes';
        return card;
      }),
    );
  }

  function renderDiscarded() {
    $('discarded-list').replaceChildren(
      ...data.discarded.map((d) => {
        const row = clone('gone-t');
        (row.querySelector('img') as HTMLImageElement).src = d.src;
        (row.querySelector('.when') as HTMLElement).textContent = d.when;
        (row.querySelector('.what') as HTMLElement).textContent = d.kind === 'capture' ? 'Closed without saving' : 'Removed from session';
        (row.querySelector('button') as HTMLButtonElement).onclick = async () => load(await window.snapmark.viewerReopen(d.dir));
        return row;
      }),
    );
  }

  function renderShot() {
    const s = data.shots[index];
    img.hidden = !s;
    if (s) img.src = src(s.n);
    $('count').textContent = s ? `${index + 1} of ${data.shots.length}` : 'No screenshots yet';
    $<HTMLButtonElement>('prev').disabled = index <= 0;
    $<HTMLButtonElement>('next').disabled = index >= data.shots.length - 1;
    $<HTMLButtonElement>('remove').disabled = !s;
    $<HTMLButtonElement>('edit').disabled = !s?.editable;
  }

  function show(v: View) {
    view = v;
    for (const [k, el] of Object.entries(views)) el.hidden = k !== v;
    $('tab-doc').setAttribute('aria-pressed', String(v === 'doc'));
    $('tab-shots').setAttribute('aria-pressed', String(v === 'grid' || v === 'shot'));
    $('tab-discarded').setAttribute('aria-pressed', String(v === 'discarded'));
    if (v === 'shot') renderShot();
    menu.hidden = true;
  }

  const step = (by: number) => {
    index = Math.max(0, Math.min(data.shots.length - 1, index + by));
    renderShot();
  };

  let removing = false; // one removal at a time, so a held ⌘⌫ never takes a second screenshot
  let lastRemoved: string | null = null; // its Discarded folder, for ⌘Z
  const remove = async (n: number | undefined) => {
    if (!n || removing) return;
    removing = true;
    try {
      const at = data.shots.findIndex((s) => s.n === n);
      const { data: d, dir } = await window.snapmark.viewerRemove(n);
      await load(d);
      lastRemoved = dir;
      $('announce').textContent = `Screenshot ${n} moved to Discarded. ⌘Z puts it back.`;
      // Focus stays in the content, never on the page: ↩ would start a rename (snap-c5c).
      // The grid focuses the tile that took the removed one's place, or the Screenshots tab when none is left.
      if (view === 'shot') img.focus();
      else if (view === 'grid') {
        const pics = $('grid').querySelectorAll<HTMLElement>('.pic');
        (pics[Math.min(at, pics.length - 1)] ?? $('tab-shots')).focus();
      }
    } finally {
      removing = false;
    }
  };

  // ⌘Z, as in Finder after ⌘⌫: the last removed screenshot comes back, shown large. Once.
  async function putBack() {
    const dir = lastRemoved;
    lastRemoved = null;
    if (!dir || !data.discarded.some((d) => d.dir === dir)) return;
    const had = new Set(data.shots.map((s) => s.n));
    await load(await window.snapmark.viewerReopen(dir));
    // Back in place, or at the end when its number was taken in the meantime.
    index = Math.max(
      0,
      data.shots.findIndex((s) => !had.has(s.n)),
    );
    show('shot');
    $('announce').textContent = `Screenshot ${data.shots[index]?.n ?? ''} is back.`;
  }

  function openMenu(at: HTMLElement, n: number) {
    const r = at.getBoundingClientRect();
    menuFor = n;
    menu.hidden = false;
    menu.style.top = `${r.bottom + 4}px`;
    menu.style.left = `${Math.max(8, r.right - menu.offsetWidth)}px`;
    $('menu-remove').focus();
  }

  // Rename in place: the title becomes a field; ↩ or clicking away saves, Esc cancels. A refused name keeps the field.
  const hintText = () =>
    data.stamped ? `${data.session.slice(0, 10)} stays in front · ↩ to save · Esc to cancel` : '↩ to save · Esc to cancel';
  function startRename() {
    input.value = data.name; // only the name: the date stays in front either way
    hint.textContent = hintText();
    hint.classList.remove('error');
    nameEl.classList.add('editing');
    input.focus();
    input.select();
  }

  const endRename = () => nameEl.classList.remove('editing');

  async function saveRename() {
    if (!nameEl.classList.contains('editing')) return;
    const why = await window.snapmark.viewerRename(input.value);
    if (why === null) return endRename();
    hint.textContent = why;
    hint.classList.add('error');
  }

  $('title').onclick = startRename;
  $('pencil').onclick = startRename;
  // ↩ and Esc hand focus back to the title; a click away leaves it where the click put it.
  input.onkeydown = (e) => {
    if (e.key === 'Enter')
      void saveRename().then(() => {
        if (!nameEl.classList.contains('editing')) $('title').focus();
      });
    if (e.key === 'Escape') {
      e.stopPropagation();
      endRename();
      $('title').focus();
    }
  };
  // A click away saves; with the field emptied it keeps the old name (↩ on an empty field still clears it to the date).
  input.onblur = () => (input.value.trim() ? void saveRename() : endRename());
  // Typing after a refused name clears the error.
  input.oninput = () => {
    if (!hint.classList.contains('error')) return;
    hint.textContent = hintText();
    hint.classList.remove('error');
  };

  $('tab-doc').onclick = () => show('doc');
  $('tab-shots').onclick = () => show('grid');
  $('tab-discarded').onclick = () => show('discarded');
  $('external').onclick = () => window.snapmark.viewerExternal();
  $('back').onclick = () => show('grid');
  $('prev').onclick = () => step(-1);
  $('next').onclick = () => step(1);
  $('edit').onclick = () => window.snapmark.viewerEdit(data.shots[index].n);
  $('remove').onclick = () => remove(data.shots[index]?.n);
  $('menu-remove').onclick = () => remove(menuFor);
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target as Node)) menu.hidden = true;
    // A button clicked with the pointer lets go of the focus, so ↩ renames instead of clicking it again.
    if (e.detail > 0) (e.target as Element).closest('button')?.blur();
  });
  document.addEventListener('keydown', (e) => {
    if (e.target instanceof HTMLElement && (e.target.isContentEditable || e.target === input)) return;
    const shown = view === 'shot' ? data.shots[index] : undefined; // the screenshot shown large
    // Finder's keys: ↩ renames, ⌘⌫ removes, ⌘Z puts back, ⌘O opens (here: Edit Again).
    const cmd = e.metaKey && !e.shiftKey && !e.repeat;
    if (e.key === 'Enter' && (e.target === document.body || e.target === document.documentElement)) {
      e.preventDefault();
      startRename();
    } else if (cmd && e.key === 'Backspace' && shown) void remove(shown.n);
    else if (cmd && e.key === 'z') {
      e.preventDefault();
      void putBack();
    } else if (cmd && e.key === 'o' && shown?.editable) {
      e.preventDefault();
      window.snapmark.viewerEdit(shown.n);
    } else if (e.key === 'Escape' && !menu.hidden) menu.hidden = true;
    else if (e.key === 'Escape' && view === 'shot') show('grid');
    else if (view === 'shot' && e.key === 'ArrowLeft') step(-1);
    else if (view === 'shot' && e.key === 'ArrowRight') step(1);
  });

  window.snapmark.onViewerReload((d) => void load(d));
  void window.snapmark.viewerInit().then(load);
})();
