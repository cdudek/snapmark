---
linear: none
bead: snap-7po
type: facts
change: 2026-09-25-tool-ghost
design: null
author: calvindudek@googlemail.com
status: approved
reviewed_by: calvindudek@googlemail.com (Plannotator gate)
approved_at: 2026-09-25
created: 2026-09-25
archived_at: 2026-09-25
---

# Facts: Editor — a ghost of the shape follows the pointer

## Goal

When the owner presses 1, 2, 3… they see what they are about to draw before they click, and
pressing the key again shows the next shape at once. It builds the owner's decision of 2026-09-25:
"Ghost shape".

## Acceptance criteria

### The ghost

- [ ] **F1** While Box, Ellipse, Cross, Crossed box, Remove area, Tick, Thumbs up, Reference or Card is active and the pointer is over the image, a faint copy of the shape at its click size shall follow the pointer.
- [ ] **F2** When the owner presses the group's key again, the copy shall change to the next tool's shape at once, without moving the pointer.
- [ ] **F3** While Arrow, Pen, Highlighter, Spotlight, Cut & move or Redact is active, the pointer shall show that tool's icon beside the crosshair.
- [ ] **F4** When the pointer leaves the image, a drag starts, or Select is active, the copy shall disappear.

### Nothing leaks

- [ ] **F5** The copy shall never be in the saved image, the undo history or the references list, and shall not count as unsaved work.

<details>
<summary>Verification</summary>

- F1, F2, F4, F5 — automated: the smoke test moves the pointer over the image, reads the top canvas layer under it, presses the key again, and checks the saved image, the object count and the dirty flag
- F3 — automated: the smoke test checks the canvas cursor is an icon for Pen and the crosshair for Box

</details>

## Verification

- **Automated:** `npm run format && npm run lint && npm run typecheck && npm test` exits 0; `npm run smoke` passes.
- **Manual:** the owner rebuilds, installs, and presses 1–7 over a capture.

## Out of scope

- Discard recovery, the session window and the Markdown view: their own changes (`snap-ndd`, `snap-m6j`).

## Open questions

None.
