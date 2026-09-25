// IPC contract between preload.ts (exposes it) and editor.ts (calls it).
interface EditorInit {
  src: string; // data: URL of the captured PNG
  session: string;
}

interface EditorSave {
  png: string; // base64, no data: prefix
  caption: string;
  notes: string[];
}

interface Window {
  snapmark: {
    init(): Promise<EditorInit>;
    save(data: EditorSave): Promise<number>;
  };
}
