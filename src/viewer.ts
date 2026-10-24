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

  let data: ViewerInit = { session: '', base: '', md: '', shots: [], discarded: [] };
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
    document.title = `${d.session} — Snapmark`;
    $('title').textContent = d.session;
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
    docEl.replaceChildren();
    // Each save says which text it edits, so a late save from before a reload can never overwrite a new screenshot.
    const m = { md: d.md };
    mounted = m;
    field = await MdNotes.mount(docEl, d.md, {
      placeholder: 'This session is empty. Capture a screenshot with ⌃⇧1.',
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

  const remove = async (n: number | undefined) => {
    if (n) await load(await window.snapmark.viewerRemove(n));
  };

  function openMenu(at: HTMLElement, n: number) {
    const r = at.getBoundingClientRect();
    menuFor = n;
    menu.hidden = false;
    menu.style.top = `${r.bottom + 4}px`;
    menu.style.left = `${Math.max(8, r.right - menu.offsetWidth)}px`;
    $('menu-remove').focus();
  }

  // Rename in place: the title becomes a field; ↩ or clicking away saves, Esc cancels. A refused name keeps the field.
  function startRename() {
    input.value = data.session;
    hint.textContent = '↩ to save · Esc to cancel';
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
  input.onkeydown = (e) => {
    if (e.key === 'Enter') void saveRename();
    if (e.key === 'Escape') {
      e.stopPropagation();
      endRename();
    }
  };
  input.onblur = () => void saveRename();

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
  });
  document.addEventListener('keydown', (e) => {
    if (e.target instanceof HTMLElement && (e.target.isContentEditable || e.target === input)) return;
    if (e.key === 'Escape' && !menu.hidden) menu.hidden = true;
    else if (e.key === 'Escape' && view === 'shot') show('grid');
    else if (view === 'shot' && e.key === 'ArrowLeft') step(-1);
    else if (view === 'shot' && e.key === 'ArrowRight') step(1);
  });

  window.snapmark.onViewerReload((d) => void load(d));
  void window.snapmark.viewerInit().then(load);
})();
