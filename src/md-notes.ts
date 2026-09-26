// Markdown as you type (Notion-like) for the editor's comment and reference notes.
// Bundled by esbuild into dist/src/md-notes.js as a browser script exposing `MdNotes`; editor.ts calls mount().
import { Editor, rootCtx, defaultValueCtx, editorViewCtx } from '@milkdown/kit/core';
import { commonmark } from '@milkdown/kit/preset/commonmark';
import { listener, listenerCtx } from '@milkdown/kit/plugin/listener';
import { history } from '@milkdown/kit/plugin/history';
import { getMarkdown } from '@milkdown/kit/utils';

export interface MdField {
  focus(): void;
  value(): string; // the Markdown now; onChange lags 200 ms behind typing, so save() reads this
}

// The field keeps Markdown: onChange gets the Markdown source after edits (debounced by Milkdown's listener).
const clean = (md: string) => (md.trim() === '<br />' ? '' : md.trim()); // an emptied field serialises as a lone break

export async function mount(
  el: HTMLElement,
  value: string,
  { placeholder, onChange }: { placeholder: string; onChange: (md: string) => void },
): Promise<MdField> {
  el.classList.add('md');
  el.dataset.placeholder = placeholder;
  el.dataset.empty = String(!value.trim());
  const editor = await Editor.make()
    .config((ctx) => {
      ctx.set(rootCtx, el);
      ctx.set(defaultValueCtx, value);
      ctx.get(listenerCtx).markdownUpdated((_, md) => {
        onChange(clean(md));
      });
    })
    .use(commonmark)
    .use(listener)
    .use(history)
    .create();
  // The placeholder follows every keystroke, not the debounced listener.
  el.addEventListener('input', () => (el.dataset.empty = String(!el.textContent?.trim())));
  return {
    focus: () => editor.action((ctx) => ctx.get(editorViewCtx).focus()),
    value: () => clean(editor.action(getMarkdown())),
  };
}
