// Renderer script for viewer.html (classic script, like editor.ts): one session's session.md, rendered and
// editable, and its screenshots one at a time. Wrapped in a function so its names stay out of editor.ts's scope.
(() => {
  const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
  const docEl = $<HTMLDivElement>('doc');
  const shotsEl = $<HTMLElement>('shots');
  const img = $<HTMLImageElement>('shot');
  const pad = (n: number) => String(n).padStart(3, '0');

  let data: ViewerInit = { session: '', base: '', md: '', shots: [], editable: [] };
  let field: import('./md-notes').MdField | null = null;
  let edited = false; // the owner typed since the last load
  let index = 0;

  // The editor asks for the latest text before it appends a screenshot, so nothing typed here is lost.
  (window as unknown as { __flush: () => string | null }).__flush = () => (edited && field ? field.value() : null);

  async function load(d: ViewerInit) {
    data = d;
    edited = false;
    document.title = `${d.session} — Snapmark`;
    $('title').textContent = d.session;
    // Resolve img/NNN.png against the session folder. Added after the scripts loaded, so it only affects images.
    const base = document.querySelector('base') ?? document.head.appendChild(document.createElement('base'));
    base.href = d.base;
    docEl.replaceChildren();
    // Each save says which text it edits, so a late save from before a reload can never overwrite a new screenshot.
    let known = d.md;
    field = await MdNotes.mount(docEl, d.md, {
      placeholder: 'This session is empty. Capture a screenshot with ⇧⌘1.',
      onChange: (md) => {
        edited = true;
        void window.snapmark.viewerSave(known, md).then((ok) => ok && (known = md));
      },
    });
    index = Math.min(index, Math.max(0, d.shots.length - 1));
    renderShot();
  }

  function renderShot() {
    const n = data.shots[index];
    img.hidden = !n;
    if (n) img.src = `img/${pad(n)}.png`;
    $('count').textContent = n ? `${index + 1} of ${data.shots.length}` : 'No screenshots yet';
    $<HTMLButtonElement>('prev').disabled = index <= 0;
    $<HTMLButtonElement>('next').disabled = index >= data.shots.length - 1;
    $<HTMLButtonElement>('remove').disabled = !n;
    $<HTMLButtonElement>('edit').disabled = !data.editable.includes(n);
  }

  function show(mode: 'doc' | 'shots') {
    docEl.hidden = mode !== 'doc';
    shotsEl.hidden = mode !== 'shots';
    $('tab-doc').setAttribute('aria-pressed', String(mode === 'doc'));
    $('tab-shots').setAttribute('aria-pressed', String(mode === 'shots'));
  }

  const step = (by: number) => {
    index = Math.max(0, Math.min(data.shots.length - 1, index + by));
    renderShot();
  };

  $('tab-doc').onclick = () => show('doc');
  $('tab-shots').onclick = () => show('shots');
  $('external').onclick = () => window.snapmark.viewerExternal();
  $('prev').onclick = () => step(-1);
  $('next').onclick = () => step(1);
  $('edit').onclick = () => window.snapmark.viewerEdit(data.shots[index]);
  $('remove').onclick = async () => {
    const n = data.shots[index];
    if (n) await load(await window.snapmark.viewerRemove(n));
  };
  document.addEventListener('keydown', (e) => {
    if (shotsEl.hidden || (e.target instanceof HTMLElement && e.target.isContentEditable)) return;
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });

  window.snapmark.onViewerReload((d) => void load(d));
  void window.snapmark.viewerInit().then(load);
})();
