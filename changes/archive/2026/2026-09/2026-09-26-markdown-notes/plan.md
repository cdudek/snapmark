---
linear: none
bead: snap-m6j
type: plan
change: 2026-09-26-markdown-notes
design: null
author: calvindudek@googlemail.com
status: approved
reviewed_by: calvindudek@googlemail.com (Plannotator gate)
approved_at: 2026-09-26
created: 2026-09-26
archived_at: 2026-09-26
---

# Plan: Markdown as you type in the editor's notes

> Replace the comment and reference-note textareas with a small Markdown editor that formats as you type and saves Markdown.

A person with no context builds from this file alone. [facts](facts.md) are for the gate, not for
the build.

## Approach

- **What changes:** a new `src/md-notes.ts` wraps Milkdown (ProseMirror with CommonMark, history and a change listener) behind `mount(el, value, { placeholder, onChange })`, returning `focus()`. esbuild bundles it into `dist/src/md-notes.js` as a browser script exposing `MdNotes`, loaded by `editor.html` before `editor.js`. The comment and each reference note use it; `editor.ts` keeps their Markdown in variables that `save()` sends.
- **What stays the same:** cards (Fabric text), the canvas, tools, the save IPC shape, and every shortcut.
- **Why this way:** Milkdown reads and writes Markdown natively, so session.md gets Markdown source with no HTML conversion (F4); its CommonMark preset has the input rules for `#`, `-`, `1.`, `>`, `**`, `*` and `` ` `` (F1, F2). A trial bundle was 373 KB.
- **Rejected:**
  - TipTap — stores HTML/JSON, needs a separate Markdown round-trip extension.
  - EasyMDE — styles the syntax but keeps the `#` characters visible, not Notion-like.
  - Vditor — heavier, and loads its parser from a CDN by default, which the page's CSP blocks.

## Design changes

None.

## Files that change

| File                    | Change                                                                                                                                                      |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `package.json`          | devDependencies `@milkdown/kit`, `esbuild`; `build` also bundles `src/md-notes.ts` to `dist/src/md-notes.js`                                                |
| `package-lock.json`     | the new packages                                                                                                                                            |
| `src/md-notes.ts`       | new: `mount(el, value, { placeholder, onChange })` → `{ focus() }`                                                                                          |
| `src/shared.d.ts`       | `declare const MdNotes: typeof import('./md-notes')`                                                                                                        |
| `src/editor.html`       | load `md-notes.js`; `#caption` becomes a div; styles for the editor fields and the placeholder                                                              |
| `src/editor.ts`         | mount the comment and each note; `caption` and `m.note` hold Markdown; key handling treats the editor like a text field; a new reference focuses its editor |
| `src/sessions.ts`       | continuation lines of a note indented under its number (F5)                                                                                                 |
| `test/sessions.test.ts` | multi-line note check                                                                                                                                       |
| `test/smoke.ts`         | real key typing for F1, F2, F4; sidebar and focus checks moved from textareas to the editor fields (F6)                                                     |
| `README.md`             | one sentence on Markdown in notes                                                                                                                           |

## Order of work

- [x] 1. Add the packages; `src/md-notes.ts`; build script bundles it — proof: `npm run build` writes `dist/src/md-notes.js` and `npm run typecheck` exits 0
- [x] 2. `editor.html` and `editor.ts`: mount the comment and notes; placeholder "Add a comment…" and "Note for N"; Esc blurs, tool keys ignored, ⌘↵ saves while in an editor; a new reference focuses its editor after the click (F3, F6) — proof: `npm run smoke` passes its existing focus, Esc and save checks
- [x] 3. `sessions.addShot`: indent note continuation lines by three spaces (F5) — proof: `node dist/test/sessions.test.js` passes the new check
- [x] 4. Smoke: type `# Title`, Enter, `- item`, Enter twice, `**bold**` into a reference note with real key events; check an `h1`, a `li` and a `strong` in the field and `# Title`, `- item`, `**bold**` in session.md; move the sidebar checks to the editor fields (F1, F2, F4, F6) — proof: `npm run smoke` passes
- [x] 5. README — proof: `grep -n "Markdown as you type" README.md`
- [x] 6. Verify, PR, auto-merge, archive, close `snap-m6j` only if the session view is split into `snap-ndd`, rebuild and install the signed app — proof: CI `check` passes

## Risks

| Risk                                                                                           | What we do                                                                            | Where it lands |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | -------------- |
| Milkdown's Markdown output differs from what was typed (e.g. `*` for `-` bullets)              | Accepted when it is valid Markdown; the smoke test checks the exact forms that matter | step 4         |
| Its keymap takes ⌘↵ or Esc before the page sees them                                           | Our handler listens on `document` in the capture phase                                | step 2         |
| A new reference's editor is not in the DOM yet when focus is asked for                         | Focus after the refs render, and the real-input smoke check covers it                 | step 2         |
| The CommonMark preset's "code block" rule turns a line starting with three backticks into code | Accepted: that is Markdown                                                            | accepted       |

## Out of scope

- The session document view: with the session window (`snap-ndd`).
- A formatting toolbar or slash menu.

## Done

- `npm run format && npm run lint && npm run typecheck && npm test` exits 0.
- `npm run smoke` passes, with checks for F1, F2, F4 and F6.
- Every task in Order of work is ticked; departures are logged under `## Revisions`.
- Nothing outside `## Files that change` is edited, apart from archiving this folder.
- The installed app in `/Applications` is rebuilt from the merged `main`.
- Stop and report as soon as a step cannot proceed. Never work around a blocker.
- Stop after 30 turns if not met. Report what is missing.

## Goal handover

```
/goal Build changes/2026-09-26-markdown-notes/plan.md in its order of work; every outcome in
changes/2026-09-26-markdown-notes/facts.md must hold; tick tasks as they land; log departures
under ## Revisions.

Done:
- `npm run format && npm run lint && npm run typecheck && npm test` exits 0.
- `npm run smoke` passes, with checks for F1, F2, F4 and F6.
- Every task in plan.md's Order of work is ticked; departures are logged under ## Revisions.
- Nothing outside plan.md's `## Files that change` is edited, apart from archiving the folder.
- The installed app in /Applications is rebuilt from the merged main.
- Stop and report as soon as a step cannot proceed. Never work around a blocker.
- Stop after 30 turns if not met. Report what is missing.
```

## Revisions

Only after approval. One line per change: `YYYY-MM-DD — what changed, and why`.

- 2026-09-26 — `MdField` also has `value()`: Milkdown reports changes 200 ms after typing, so `save()` and the notes re-render read each field directly; otherwise ⌘↵ right after typing would have saved a note without its last letters.
- 2026-09-26 — The placeholder follows a plain `input` event on the field instead of the debounced listener, for the same reason.
- 2026-09-26 — The key handler did not need the capture phase: the editor lets ⌘↵ and Esc bubble; the smoke test checks both.
- 2026-09-26 — `esbuild` runs with `--log-level=warning` so the build stays quiet.
