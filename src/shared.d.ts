// IPC contract between preload.ts (exposes it) and editor.ts (calls it).
interface EditorInit {
  src: string; // data: URL of the captured PNG
  session: string;
}

interface EditorSave {
  png: string; // base64, no data: prefix
  caption: string;
  notes: string[]; // numbered marker notes, in marker order
  cards: string[]; // text of the cards placed on the image
  moves: number; // cut-and-move pieces
}

interface Window {
  snapmark: {
    init(): Promise<EditorInit>;
    save(data: EditorSave): Promise<number>;
    dirty(value: boolean): void; // the editor has marks or text that are not saved yet
  };
}

// Fabric's UMD build, loaded by editor.html before editor.js.
declare const fabric: typeof import('fabric');
