// Markdown as you type (Notion-like) for the editor's comment and reference notes.
// Bundled by esbuild into dist/src/md-notes.js as a browser script exposing `MdNotes`; editor.ts calls mount().
import { Editor, rootCtx, defaultValueCtx, editorViewCtx } from '@milkdown/kit/core';
import { commonmark, imageSchema } from '@milkdown/kit/preset/commonmark';
import { listener, listenerCtx } from '@milkdown/kit/plugin/listener';
import { history } from '@milkdown/kit/plugin/history';
import { getMarkdown } from '@milkdown/kit/utils';

export interface MdField {
  focus(): void;
  value(): string; // the Markdown now; onChange lags 200 ms behind typing, so save() reads this
}

// The field keeps Markdown: onChange gets the Markdown source after edits (debounced by Milkdown's listener).
// An empty paragraph serialises as "<br />": drop it when it is the whole field, or the first line of a list item
// ("3. # Title" would come back as "3. <br />" plus the heading).
const clean = (md: string) => (md.trim() === '<br />' ? '' : md.trim().replace(/^(\s*(?:\d+\.|[*-])) <br \/>\n+\s*/gm, '$1 '));

// Milkdown 7.22 drops an image that has no title: remark gives title null, and the schema only accepts a string.
// session.md's screenshots have none, so give them "".
const image = imageSchema.extendSchema((prev) => (ctx) => {
  const spec = prev(ctx);
  return {
    ...spec,
    parseMarkdown: {
      ...spec.parseMarkdown,
      runner: (state, node, type) => state.addNode(type, { src: node.url ?? '', alt: node.alt ?? '', title: node.title ?? '' }),
    },
  };
});

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
    .use(image)
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
