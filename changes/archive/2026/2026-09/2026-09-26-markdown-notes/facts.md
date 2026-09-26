---
linear: none
bead: snap-m6j
type: facts
change: 2026-09-26-markdown-notes
design: null
author: calvindudek@googlemail.com
status: approved
reviewed_by: calvindudek@googlemail.com (Plannotator gate)
approved_at: 2026-09-26
created: 2026-09-26
archived_at: 2026-09-26
---

# Facts: Markdown as you type in the editor's notes

## Goal

The owner writes the comment and reference notes like in Notion: typing `# ` makes a heading,
`- ` a list, `**bold**` bold, and session.md keeps it as Markdown. It builds the first half of the
owner's decision of 2026-09-25, "Notes + session view"; the session document view ships with the
session window (`snap-ndd`), which it lives in, and reuses this editor.

## Acceptance criteria

### Typing

- [ ] **F1** When the owner types `# `, `## `, `### `, `- `, `1. ` or `> ` at the start of a line in the comment or a reference note, the field shall turn that line into a heading, list or quote at once.
- [ ] **F2** When the owner types `**text**`, `*text*` or `` `text` ``, the field shall show it bold, italic or as code.
- [ ] **F3** Cards on the image shall stay plain text.

### Saving

- [ ] **F4** session.md shall get the notes as Markdown source, never HTML.
- [ ] **F5** A reference note with more than one line shall stay inside its numbered item in session.md, so a heading or list in a note does not break the numbered list.

### Nothing that works today breaks

- [ ] **F6** A new reference shall still take typing at once; fields shall still grow with their text; Esc shall still leave the field; ⌘↵ shall still save; tool keys shall not fire while typing.

<details>
<summary>Verification</summary>

- F1, F2, F4, F6 — automated: the smoke test types into the fields with real key events, checks the formatted elements, saves, and reads session.md
- F5 — automated: `test/sessions.test.ts` checks a multi-line note is indented under its number
- F3 — read in the code (cards are Fabric text, untouched)

</details>

## Verification

- **Automated:** `npm run format && npm run lint && npm run typecheck && npm test` exits 0; `npm run smoke` passes.
- **Manual:** the owner rebuilds, installs, and types a heading and a list into a note.

## Out of scope

- The session document view: with the session window (`snap-ndd`).
- A formatting toolbar or slash menu: Markdown syntax only.

## Open questions

None.
