---
linear: none
type: plan
change: 2026-10-25-one-shot-mode
design: null
author: calvin.dudek@omr.com
status: approved
reviewed_by: calvin.dudek@omr.com (roadmap and mockups, 2026-10-25)
approved_at: 2026-10-25
created: 2026-10-25
archived_at: 2026-10-25
---

# Plan: One-shot mode

> Capture → beautify → copy or save one image, at full resolution, with no session.

## Approach

- **One flag:** `openEditor(image, { oneShot: true })` makes no session and never changes the current one; the editor learns the mode from `editor:init`.
- **Pure layout:** `src/beautify.ts` (a classic script, like `tools.ts`) holds the settings type, the backgrounds and `beautyLayout(w, h, settings)`: output size, screenshot position, radius and shadow. Sizes are thousandths of the screenshot's long edge, so a small crop and a Retina full screen look alike. Tested in plain Node.
- **Preview with CSS, output with a 2D canvas, same numbers:** the Fabric canvas keeps the screenshot's coordinates (marks, Redact and Cut are untouched); a `#stage` around it gets the backdrop, size and padding, and Fabric's wrapper the radius and shadow. `flatten()` in one-shot mode draws the marked screenshot onto a new canvas with the same layout. `gradientLine()` makes the canvas gradient match CSS's `to bottom right`.
- **Full resolution:** main skips `fitForAI` for one-shot copies and saves.
- **One preset:** every change goes to main (`editor:beautify`) and into `state.json` beside the editor size; the next one-shot starts from it.
- **Discard:** the stashed state carries the settings, so a reopened one-shot comes back in one-shot mode. Its Discarded folder is named after `one-shot`.
- **Keys:** ⌘C copies the image only in one-shot mode and only when no text has the cursor (interaction guidelines, Copy and paste: "⌘C with nothing selected copies the marked image"); ⌘↵ runs the main button.
- **Rejected:** growing the Fabric canvas by the padding (every mark's coordinates and Redact's crop would shift); a mode toggle in the editor (more states for little use); a global shortcut (no ⌃⇧ key is clearly free and safe).

## Design changes

None.

## Files that change

| File                                       | Change                                                                     |
| ------------------------------------------ | -------------------------------------------------------------------------- |
| `src/beautify.ts`, `test/beautify.test.ts` | settings, backgrounds, layout and gradient maths, and their test           |
| `src/menu.ts`, `test/menu.test.ts`         | Capture Options ▸ One-Shot Capture…                                        |
| `src/main.ts`                              | `oneShot` editors, full-size copy and save, the preset, discard, shortcuts |
| `src/editor.ts`, `src/editor.html`         | Beautify panel, preview, beautified flatten, keys                          |
| `src/preload.ts`, `src/shared.d.ts`        | `beautify`, `oneShot` in init and state                                    |
| `test/smoke.ts`                            | one-shot checks                                                            |
| `README.md`, `package.json`                | docs and the ⌃⇧ table; the new unit test in `npm test`                     |

## Order of work

- [x] 1. `beautify.ts` and its test (F6) — proof: `node dist/test/beautify.test.js`
- [x] 2. Menu item and test (F1) — proof: `node dist/test/menu.test.js`
- [x] 3. Main: one-shot editors, copy, save, preset, discard (F2, F7–F11)
- [x] 4. Editor: panel, preview, flatten, keys (F3–F8)
- [x] 5. Smoke checks (F4–F11) — proof: CI
- [x] 6. README and Keyboard Shortcuts (F13)
- [x] 7. Verify, PR, auto-merge

## Risks

| Risk                                                        | What we do                                                                                | Where it lands |
| ----------------------------------------------------------- | ----------------------------------------------------------------------------------------- | -------------- |
| Preview and output disagree                                 | One layout function for both; the smoke test checks the output's size, corners and centre | step 5         |
| A full-resolution copy of a huge capture is slow or too big | One-shot captures a region, never a scrolling page                                        | accepted       |
| Session mode changes by accident                            | Every session path is unchanged behind `if (!oneShot)`; its smoke checks run unchanged    | step 5         |

## Out of scope

- Watermark, preset gallery, mode toggle, global shortcut.

## Done

- `npm run format && npm run lint && npm run typecheck && npm test` exits 0.
- CI's smoke run passes, with the one-shot checks.
- Every task in Order of work is ticked; departures are logged under `## Revisions`.

## Goal handover

none — built in the same session from the approved roadmap; the diff is the deliverable.

## Revisions

None.
