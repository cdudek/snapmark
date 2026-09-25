---
linear: none
bead: snap-8p1
type: facts
change: 2026-09-25-editor-toolbar
design: null
author: calvindudek@googlemail.com
status: approved
reviewed_by: calvindudek@googlemail.com (Plannotator gate)
approved_at: 2026-09-25
created: 2026-09-25
---

# Facts: Editor — icon toolbar, Reference, Esc, Dock icon, sidebar

## Goal

The owner opens the editor and sees every tool as a small icon. Notes take the space they need,
Esc gets them out of any tool, and the Dock shows an editor is open. It builds the owner's eight
editor decisions of 2026-09-25 (`docs/ux/decisions-2026-09-25-editor.md`), plus the two menu
decisions that list the editor's keys and names.

## Acceptance criteria

### Toolbar

- [ ] **F1** The toolbar shall show one icon button per tool, with no tool names as text, grouped by key with the key under each group.
- [ ] **F2** The groups shall be, in order: V Select · 1 Reference, Card · 2 Box, Ellipse · 3 Arrow, Pen · 4 Cross, Crossed box, Remove area · 5 Tick, Thumbs up · 6 Highlighter, Spotlight · 7 Cut & move, Redact.
- [ ] **F3** When the owner hovers a tool, the editor shall show "<Name> (<key>)"; Select adds "click a mark to move, resize or delete it (⌫)" and Redact adds "pixelate to hide private details".
- [ ] **F4** When the owner clicks a tool icon, that tool shall become active; pressing a group's key shall select the group, and pressing it again the group's next tool.
- [ ] **F5** "Reference" shall replace "Numbered" and "numbered marker" in the toolbar, the sidebar hint, the README and the copied prompt.

### Esc

- [ ] **F6** When the owner presses Esc, the editor shall step back one level: out of a text field, else deselect a mark, else back to Select.

### Sidebar

- [ ] **F7** Each reference note shall grow to fit its text, with no text cut off.
- [ ] **F8** Discard and "Add to session" shall stay visible at the bottom of the sidebar while the notes above them scroll.
- [ ] **F9** The References heading and list shall appear only once a reference exists.
- [ ] **F10** The comment shall be a one-line field, placeholder "Add a comment…", that grows as the owner types.

### Dock

- [ ] **F11** While any editor is open, Snapmark shall show its Dock icon, and hide it when the last editor closes.

### Moved from the menu change

- [ ] **F12** The menu's Settings shall have "Keyboard shortcuts…", which opens a window listing every key and tool.
- [ ] **F13** The copied prompt shall say what every tool that leaves a mark means, in the toolbar's names.

<details>
<summary>Verification</summary>

- F1–F4, F6–F10 — automated: the smoke test drives the real editor (icons, order, tooltips, clicks, keys, Esc, note height against its text, footer in view, sections hidden)
- F5, F13 — automated: the smoke test reads the editor's tool list and checks every name is in the prompt, and that no "Numbered" remains in the editor or prompt
- F11, F12 — read in the code; manual: the owner in the installed app

</details>

## Verification

- **Automated:** `npm run format && npm run lint && npm run typecheck && npm test` exits 0; `npm run smoke` passes.
- **Manual:** the owner rebuilds, installs, and opens one capture.

## Out of scope

- Other audit findings about the editor (discard without asking, ⌘W, redaction under cut and move). They wait for the full decision round.
- session.md's format: its reference notes are a numbered list with no tool name in it.

## Open questions

None.
