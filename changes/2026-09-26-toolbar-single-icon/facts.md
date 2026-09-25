---
linear: none
bead: snap-uvp
type: facts
change: 2026-09-26-toolbar-single-icon
design: null
author: calvindudek@googlemail.com
status: approved
reviewed_by: calvindudek@googlemail.com (Plannotator gate)
approved_at: 2026-09-26
created: 2026-09-26
---

# Facts: Editor toolbar — one icon per key, Arrow and Pen split, approve marks removed

## Goal

The toolbar is quiet: one icon per key, showing only the tool that is on, with a soft tint for the
active one. Arrow and Pen each get their own key, and Tick and Thumbs up are gone. It builds the
owner's decisions of 2026-09-25, toolbar round 2 (`docs/ux/decisions.md`).

## Acceptance criteria

### Toolbar

- [ ] **F1** The toolbar shall show one icon button per key: V, 1, 2, 3, 4, 5, 6, 7, in that order, with no key numbers and no tool names as text.
- [ ] **F2** Each button shall show the icon of its group's current tool; when the owner presses the key again, the button shall show the next tool's icon.
- [ ] **F3** The active button shall have a soft grey background, not the tool colour.
- [ ] **F4** Hovering a button shall show "<Name> (<key>)", plus "press again for <next tool>" when the group has more than one tool.

### Keys

- [ ] **F5** The keys shall be: V Select · 1 Reference → Card · 2 Box → Ellipse · 3 Arrow · 4 Pen · 5 Cross → Crossed box → Remove area · 6 Highlighter → Spotlight · 7 Cut & move → Redact.
- [ ] **F6** Tick and Thumbs up shall not exist: no key, no icon, no shortcut row, and no line in the copied prompt.

<details>
<summary>Verification</summary>

- F1–F6 — automated: the smoke test reads the toolbar (8 buttons, order, no text, tint), presses 2 twice and checks the icon changes, reads a tooltip, and checks the prompt and tool list have no Tick or Thumbs up

</details>

## Verification

- **Automated:** `npm run format && npm run lint && npm run typecheck && npm test` exits 0; `npm run smoke` passes.
- **Manual:** the owner rebuilds, installs, and opens one capture.

## Out of scope

- Markdown as you type in the notes and the session document view (`snap-m6j`).
- Discard recovery and the session window (`snap-ndd`).
- Screenshots already saved with ticks or thumbs up keep them; they are pixels in the image.

## Open questions

None.
