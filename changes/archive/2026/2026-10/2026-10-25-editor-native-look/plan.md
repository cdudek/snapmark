---
linear: none
type: plan
change: 2026-10-25-editor-native-look
design: null
author: calvin.dudek@omr.com
status: approved
reviewed_by: calvin.dudek@omr.com (roadmap and mockups, 2026-10-25)
approved_at: 2026-10-25
created: 2026-10-25
archived_at: 2026-10-25
---

# Plan: the editor's Native look (roadmap M1a)

> App UI in brand blue, annotations in a picked colour from ten presets, diamond references, speech-bubble cards, and
> the session's screenshot count in the toolbar.

## Approach

- **What changes:** `editor.html` gets macOS-style tokens (light and dark) with `--accent: #2492ff` for app UI only. The
  visible `<input type="color">` becomes a swatch button with a popover of presets; the input stays as the source of the
  colour and as "Custom…" (a label around it, so a click or Enter opens the colour panel). The marker and its ghost share
  one diamond drawing. The card's background draws a tail on the edge toward `pointAt`. `EditorInit` gains `count`.
- **What stays the same:** every tool's behaviour, saved state format, per-mark colour, fixed colours of Remove and
  Highlight groups, the card's line, text and yellow.
- **Rejected:** a popover inside the header (its `overflow-x: auto` clips it), so the popover is `position: fixed`.

## Design changes

None.

## Files that change

| File              | Change                                                            |
| ----------------- | ----------------------------------------------------------------- |
| `src/editor.html` | tokens, blue accent, swatch + palette popover, diamond badges     |
| `src/editor.ts`   | palette, `drawMarker`, bubble tail, `shotsLabel`                  |
| `src/tools.ts`    | `RED = #e5484d`, diamond and bubble icons and wording             |
| `src/main.ts`     | `count` in `editor:init`; prompt says "numbered diamonds"         |
| `src/shared.d.ts` | `EditorInit.count`                                                |
| `test/smoke.ts`   | palette, diamond, bubble, count checks; blue tint; prompt wording |
| `README.md`       | key table wording for Reference, Card and the palette             |

## Order of work

- [x] 1. Tokens and blue accent in `editor.html` (F1, F2) — proof: smoke reads the blue tint
- [x] 2. Palette popover and `RED` (F3–F7) — proof: smoke palette checks
- [x] 3. Diamond marker and badge (F8) — proof: smoke PNG samples
- [x] 4. Speech-bubble card (F9) — proof: smoke tail check and "card drawn yellow"
- [x] 5. Count in the toolbar (F11) — proof: smoke label checks
- [x] 6. Wording in tools, prompt, README (F10) — proof: smoke prompt check
- [x] 7. Verify, PR, auto-merge, archive

## Risks

| Risk                                            | What we do                                                  | Where it lands |
| ----------------------------------------------- | ----------------------------------------------------------- | -------------- |
| Esc in the popover closes the editor            | the popover handles Esc and stops it before the document's  | step 2         |
| White on `#2492FF` is 3.3:1 for the button text | semibold 13px; the owner chose the brand blue in the mockup | accepted       |

## Out of scope

- The session window (M1b) and the rest of the mockup's toolbar (⌘-digit captions, icon Undo/Redo).

## Goal handover

none — built directly by the implementation agent in this PR; the owner approved the scope through the roadmap and mockups (2026-10-25).

## Done

Every fact F1–F11 holds; `npm run format && npm run lint && npm run typecheck && npm test && npm run smoke` passes; the
PR is merged.

## Revisions

None.
