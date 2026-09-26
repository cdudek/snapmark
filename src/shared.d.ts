// IPC contract between preload.ts (exposes it) and editor.ts (calls it).
interface EditorInit {
  src: string; // data: URL of the captured PNG
  session: string;
}

interface EditorSave {
  png: string; // base64, no data: prefix
  caption: string;
  notes: string[]; // reference notes, in reference order
  cards: string[]; // text of the cards placed on the image
  moves: number; // cut-and-move pieces
}

// The session viewer (viewer.html): session.md rendered and editable, and its screenshots one at a time.
interface ViewerInit {
  session: string;
  base: string; // file:// URL of the session folder, ending in "/", so img/NNN.png resolves
  md: string;
  shots: number[]; // entry numbers in session.md, in order
}

interface Window {
  snapmark: {
    init(): Promise<EditorInit>;
    save(data: EditorSave): Promise<number>;
    dirty(value: boolean): void; // the editor has marks or text that are not saved yet
    viewerInit(): Promise<ViewerInit>;
    viewerSave(from: string, md: string): Promise<boolean>; // refused when session.md is no longer `from`
    viewerExternal(): void; // open session.md in the default Markdown app
    viewerRemove(n: number): Promise<ViewerInit>;
    onViewerReload(cb: (data: ViewerInit) => void): void; // session.md changed outside this window
  };
}

// Fabric's UMD build, loaded by editor.html before editor.js.
declare const fabric: typeof import('fabric');

// md-notes.ts, bundled by esbuild and loaded by editor.html before editor.js.
declare const MdNotes: typeof import('./md-notes');
