// IPC contract between preload.ts (exposes it) and editor.ts (calls it).
interface EditorInit {
  src: string; // data: URL of the captured PNG
  session: string;
  state?: EditState; // marks and text to put back: a reopened discard, or Edit Again
  replacing?: number; // Edit Again: saving replaces this entry instead of adding one
}

// Everything on a screenshot except the screenshot, as plain data (editor.ts writes and reads the items).
interface EditState {
  caption: string;
  items: unknown[];
}

interface EditorSave {
  png: string; // base64, no data: prefix
  caption: string;
  notes: string[]; // reference notes, in reference order
  cards: string[]; // text of the cards placed on the image
  moves: number; // cut-and-move pieces
  state: EditState; // kept beside the entry for Edit Again
}

// The session viewer (viewer.html): session.md rendered and editable, and its screenshots one at a time.
interface ViewerInit {
  session: string;
  base: string; // file:// URL of the session folder, ending in "/", so img/NNN.png resolves
  md: string;
  shots: number[]; // entry numbers in session.md, in order
  editable: number[]; // entries whose marks were kept, so Edit Again can reopen them
}

interface Window {
  snapmark: {
    init(): Promise<EditorInit>;
    save(data: EditorSave): Promise<number>;
    dirty(value: boolean): void; // the editor has marks or text that are not saved yet
    stash(state: EditState): void; // the window closes without saving: keep it in Discarded (synchronous)
    viewerInit(): Promise<ViewerInit>;
    viewerSave(from: string, md: string): Promise<boolean>; // refused when session.md is no longer `from`
    viewerExternal(): void; // open session.md in the default Markdown app
    viewerRemove(n: number): Promise<ViewerInit>;
    viewerEdit(n: number): void; // Edit Again: open entry n in the editor with its marks
    onViewerReload(cb: (data: ViewerInit) => void): void; // session.md changed outside this window
  };
}

// Fabric's UMD build, loaded by editor.html before editor.js.
declare const fabric: typeof import('fabric');

// md-notes.ts, bundled by esbuild and loaded by editor.html before editor.js.
declare const MdNotes: typeof import('./md-notes');
