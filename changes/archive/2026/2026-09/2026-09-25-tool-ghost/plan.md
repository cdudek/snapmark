---
linear: none
bead: snap-7po
type: plan
change: 2026-09-25-tool-ghost
design: null
author: calvindudek@googlemail.com
status: approved
reviewed_by: calvindudek@googlemail.com (Plannotator gate)
approved_at: 2026-09-25
created: 2026-09-25
archived_at: 2026-09-25
---

# Plan: Editor — a ghost of the shape follows the pointer

> Draw a faint copy of the next shape under the pointer, and an icon cursor for tools without a fixed shape.

A person with no context builds from this file alone. [facts](facts.md) are for the gate, not for
the build.

## Approach

- **What changes:** `src/editor.ts` draws the ghost on Fabric's top canvas layer (`canvas.contextTop`) on every pointer move and every tool change, from the same drawing code the real marks use. Tools without a fixed shape get a CSS cursor: the crosshair plus the tool's icon from `src/tools.ts`, as an SVG `data:` URL.
- **What stays the same:** drawing, undo, saving, the toolbar and the keys.
- **Why this way:** the top layer is not part of the scene, so the ghost cannot reach the saved image, undo, references or the unsaved-work flag (F5) by construction.
- **Rejected:** a Fabric object at low opacity — it would fire `object:added` (marking unsaved work) and would have to be filtered out of save, undo and references.

## Design changes

None.

## Files that change

| File            | Change                                                                                                            |
| --------------- | ----------------------------------------------------------------------------------------------------------------- |
| `src/editor.ts` | `drawGhost()` on `mouse:move`, `mouse:out`, `mouse:down` and in `applyTool()`; `cursorFor(tool)` for icon cursors |
| `test/smoke.ts` | checks for F1–F5                                                                                                  |

## Order of work

- [x] 1. `drawGhost()`: remember the last pointer point; clear `contextTop`; while no drag and the tool is one of F1's, draw at 45% opacity: glyphs with `drawGlyph` at the click size (`unit * 16` square), Reference as a circle of radius `unit * 6` with the next number, Card as a yellow rounded rectangle — proof: smoke reads a non-transparent `contextTop` pixel under the pointer with Box active
- [x] 2. Call it from `mouse:move` (not dragging), clear it on `mouse:out` and `mouse:down`, redraw it in `applyTool()` so a second key press changes it without moving (F2, F4) — proof: smoke presses 2 again and the pixel under the pointer changes (box edge → ellipse); `mouse:out` clears it
- [x] 3. `cursorFor()`: for Arrow, Pen, Highlighter, Spotlight, Cut & move, Redact, a 32×32 SVG cursor (crosshair + icon) with the hotspot on the crosshair; others keep `crosshair`; Select keeps `default` (F3) — proof: smoke checks `canvas.defaultCursor` starts with `url(` for Pen and is `crosshair` for Box
- [x] 4. F5 checks — proof: smoke checks the object count and the dirty flag do not change while the ghost is drawn, and the saved image pixel checks still pass
- [x] 5. Verify, PR, auto-merge, archive, close `snap-7po`, rebuild and install the app — proof: CI `check` passes

## Risks

| Risk                                                       | What we do                                                             | Where it lands |
| ---------------------------------------------------------- | ---------------------------------------------------------------------- | -------------- |
| Fabric clears `contextTop` itself during some interactions | The ghost is redrawn on every move, so a clear lasts one frame at most | step 2         |
| Pen's free drawing also paints on `contextTop`             | Pen is an icon-cursor tool; no ghost is drawn while it is active       | step 1         |
| A CSS cursor above 32 px is ignored by Chromium            | The cursor SVG is 32×32                                                | step 3         |

## Out of scope

- Discard recovery, the session window and the Markdown view (`snap-ndd`, `snap-m6j`).

## Done

- `npm run format && npm run lint && npm run typecheck && npm test` exits 0.
- `npm run smoke` passes, with checks for F1–F5.
- Every task in Order of work is ticked; departures are logged under `## Revisions`.
- Nothing outside `## Files that change` is edited, apart from archiving this folder.
- The installed app in `/Applications` is rebuilt from the merged `main`.
- Stop and report as soon as a step cannot proceed. Never work around a blocker.
- Stop after 25 turns if not met. Report what is missing.

## Goal handover

```
/goal Build changes/2026-09-25-tool-ghost/plan.md in its order of work; every outcome in
changes/2026-09-25-tool-ghost/facts.md must hold; tick tasks as they land; log departures
under ## Revisions.

Done:
- `npm run format && npm run lint && npm run typecheck && npm test` exits 0.
- `npm run smoke` passes, with checks for F1–F5.
- Every task in plan.md's Order of work is ticked; departures are logged under ## Revisions.
- Nothing outside plan.md's `## Files that change` is edited, apart from archiving the folder.
- The installed app in /Applications is rebuilt from the merged main.
- Stop and report as soon as a step cannot proceed. Never work around a blocker.
- Stop after 25 turns if not met. Report what is missing.
```

## Revisions

Only after approval. One line per change: `YYYY-MM-DD — what changed, and why`.

- 2026-09-25 — The top layer is cleared only when a ghost was drawn: Pen paints its live stroke on the same layer, and clearing it on every move would erase the stroke.
- 2026-09-25 — The Pen cursor is set through `canvas.freeDrawingCursor` as well as `defaultCursor`, because Fabric uses its own cursor in drawing mode.
