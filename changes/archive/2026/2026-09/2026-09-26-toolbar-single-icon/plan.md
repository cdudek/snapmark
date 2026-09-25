---
linear: none
bead: snap-uvp
type: plan
change: 2026-09-26-toolbar-single-icon
design: null
author: calvindudek@googlemail.com
status: approved
reviewed_by: calvindudek@googlemail.com (Plannotator gate)
approved_at: 2026-09-26
created: 2026-09-26
archived_at: 2026-09-26
---

# Plan: Editor toolbar — one icon per key, Arrow and Pen split, approve marks removed

> Show one icon per key, give Arrow and Pen their own keys, and remove Tick and Thumbs up.

A person with no context builds from this file alone. [facts](facts.md) are for the gate, not for
the build.

## Approach

- **What changes:** `src/tools.ts` gets the new groups (Arrow on 3, Pen on 4, Remove on 5) without Tick and Thumbs up. `renderToolbar()` draws one button per group showing the current tool's icon. The CSS drops the key labels and uses a soft grey tint for the active button.
- **What stays the same:** every remaining tool's drawing, the ghost, Esc, the sidebar, and pressing a key again for the group's next tool.
- **Why this way:** the toolbar, shortcuts window and copied prompt all read `GROUPS`, so regrouping there updates all three; removing the two tools there removes them everywhere.
- **Rejected:** keeping Tick and Thumbs up's drawing code for old sessions — saved screenshots are flat images and never need it.

## Design changes

None.

## Files that change

| File              | Change                                                                                                        |
| ----------------- | ------------------------------------------------------------------------------------------------------------- |
| `src/tools.ts`    | new groups; `tick` and `thumb` removed from `ToolId` and `GROUPS`; `GREEN` removed                            |
| `src/editor.ts`   | `renderToolbar()` one button per group; `tick` and `thumb` removed from `GlyphKind`, `drawGlyph` and `GHOSTS` |
| `src/editor.html` | toolbar CSS: no key labels, soft grey tint for the active button                                              |
| `test/smoke.ts`   | keys follow the new order; tick, thumbs up and their green-pixel check removed; checks for F1–F6              |
| `README.md`       | key table and the "green tick" wording                                                                        |

## Order of work

- [x] 1. `tools.ts` new groups and removals; `editor.ts` type and drawing removals — proof: `npm run typecheck` exits 0
- [x] 2. `renderToolbar()`: one button per group, `data-group` = key, icon of the current tool, `aria-pressed` on the active group, tooltip "<Name> (<key>)" plus "press again for <next>"; CSS tint `rgb(127 127 127 / 0.22)` and no `kbd` (F1–F4) — proof: smoke checks 8 buttons in order V1234567, no text, the tint, the tooltip, and the icon changing after pressing 2 twice
- [x] 3. Smoke keys: arrow 3, pen 4, crosses 5; tick and thumbs up drags and the "approve drawn green" check removed; the F6 check that no tool is `tick` or `thumb` and the prompt has neither (F5, F6) — proof: `npm run smoke` passes
- [x] 4. README — proof: `grep -n "Thumbs" README.md` finds nothing
- [x] 5. Verify, PR, auto-merge, archive, close `snap-uvp`, rebuild and install the signed app — proof: CI `check` passes

## Risks

| Risk                                             | What we do                                                                  | Where it lands |
| ------------------------------------------------ | --------------------------------------------------------------------------- | -------------- |
| Hidden tools are harder to discover again        | Tooltips say "press again for <next>"; Keyboard shortcuts… lists every tool | step 2         |
| The owner's habit of 4 for crosses changes again | Owner decision of 2026-09-25; README and the shortcuts window show the keys | accepted       |

## Out of scope

- Markdown as you type (`snap-m6j`); discard recovery and the session window (`snap-ndd`).

## Done

- `npm run format && npm run lint && npm run typecheck && npm test` exits 0.
- `npm run smoke` passes, with checks for F1–F6.
- Every task in Order of work is ticked; departures are logged under `## Revisions`.
- Nothing outside `## Files that change` is edited, apart from archiving this folder.
- The installed app in `/Applications` is rebuilt from the merged `main`.
- Stop and report as soon as a step cannot proceed. Never work around a blocker.
- Stop after 25 turns if not met. Report what is missing.

## Goal handover

```
/goal Build changes/2026-09-26-toolbar-single-icon/plan.md in its order of work; every outcome in
changes/2026-09-26-toolbar-single-icon/facts.md must hold; tick tasks as they land; log departures
under ## Revisions.

Done:
- `npm run format && npm run lint && npm run typecheck && npm test` exits 0.
- `npm run smoke` passes, with checks for F1–F6.
- Every task in plan.md's Order of work is ticked; departures are logged under ## Revisions.
- Nothing outside plan.md's `## Files that change` is edited, apart from archiving the folder.
- The installed app in /Applications is rebuilt from the merged main.
- Stop and report as soon as a step cannot proceed. Never work around a blocker.
- Stop after 25 turns if not met. Report what is missing.
```

## Revisions

Only after approval. One line per change: `YYYY-MM-DD — what changed, and why`.

- 2026-09-26 — Clicking a toolbar button now works like its key (a second click steps to the next tool), since each key has one button.
- 2026-09-26 — The smoke test picks tools with a `pick(id)` helper instead of clicking per-tool buttons, which no longer exist; its old "keys step through a group" check (Pen/Arrow on 3) became "pressing the key again swaps the icon" on 2.
