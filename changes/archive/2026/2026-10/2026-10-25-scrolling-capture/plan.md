---
linear: none
type: plan
change: 2026-10-25-scrolling-capture
design: null
author: calvin.dudek@omr.com
status: approved
reviewed_by: calvin.dudek@omr.com (roadmap and mockups, 2026-10-25)
approved_at: 2026-10-25
created: 2026-10-25
archived_at: 2026-10-25
---

# Plan: Capture Scrolling

> Drag an area, scroll it, press Done: Snapmark stitches the frames into one tall screenshot in the normal editor.

## Approach

- **Frames:** `screencapture -x -R` on the area, one after another with 50 ms between, decoded with `nativeImage`. The same tool Capture Last Area uses; no new permission. `desktopCapturer` was not needed: a manual scroll is slower than a grab.
- **Stitching (`src/stitch.ts`):** each row becomes 64 grey means. Rows that did not move at the top and bottom of the view are the sticky bands. The shift between the last added frame and the new one is the one with the smallest mean difference over the moving rows, at least a tenth of them overlapping and at most 1% differing. Only the rows that scrolled in are appended, and the bottom band moves down below them. A frame with no change is skipped; one with no overlap is reported as lost and skipped. 20,000 px at most.
- **Control:** a frameless, always-on-top bar (`src/scroll.html`) below the area, else above it, else inside its bottom edge with content protection. It takes the keys (↩ Done, Esc Cancel); scrolling still reaches the window under the pointer.
- **Editor:** an image that fitting whole would show at under half its real size fits the width and scrolls. Stroke width counts a tall image as twice its width high.
- **Rejected:** a global shortcut (the owner: not the default); an outline overlay around the area (a window over the grabbed rows risks showing in them).

## Design changes

None.

## Files that change

| File                                | Change                                                                            |
| ----------------------------------- | --------------------------------------------------------------------------------- |
| `src/stitch.ts`                     | new: `stitcher()` on raw 4-byte pixels                                            |
| `test/stitch.test.ts`               | new: synthetic pages, sticky bands, lost, cap, size change, speed                 |
| `src/main.ts`                       | `captureScrolling`, `scrollCapture(area, grab)`, `grabArea`; shortcuts window row |
| `src/scroll.html`, `src/scroll.ts`  | new: the Done and Cancel bar                                                      |
| `src/preload.ts`, `src/shared.d.ts` | `scrollDone`, `onScrollStatus`, `ScrollStatus`                                    |
| `src/area.ts`                       | the hint for `#scroll`                                                            |
| `src/menu.ts`, `test/menu.test.ts`  | Capture Options ▸ Capture Scrolling…                                              |
| `src/editor.ts`                     | `fit()` for tall images; stroke width                                             |
| `test/smoke.ts`                     | synthetic frames through the live loop; ↩, Esc, editor scroll, draw, redact       |
| `package.json`                      | build copies `scroll.html`; `npm test` runs the stitch test                       |
| `README.md`                         | the menu item, its limits, the new files                                          |

## Order of work

- [x] 1. `src/stitch.ts` and its plain-Node test (F6, F7, F8) — proof: `node dist/test/stitch.test.js`
- [x] 2. Menu item and test (F1) — proof: `node dist/test/menu.test.js`
- [x] 3. Control bar, preload, area hint, `scrollCapture` loop (F2–F5, F9) — proof: smoke ↩ and Esc checks
- [x] 4. Editor fit and stroke width (F10) — proof: smoke scroll, draw and redact checks
- [x] 5. README and the Keyboard Shortcuts window (F11)
- [x] 6. Verify, PR, auto-merge

## Risks

| Risk                                                                | What we do                                                                                                                      | Where it lands |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| A flick scrolls further than the area between two grabs             | The bar says "Lost the place: scroll back up a little"; the next overlapping frame continues                                    | step 3         |
| Animations, video, lazy images, a header that turns sticky mid-page | Accepted limits, named in the README                                                                                            | accepted       |
| An area as tall as the screen leaves no room for the bar            | Bar inside the bottom edge with content protection; if macOS still captures it, it is a fixed band and lands once at the bottom | accepted       |
| A tall page is shrunk to 1568 px for the AI and gets narrow         | Named in the README; tiles are a later change                                                                                   | accepted       |

## Out of scope

- Auto-scroll, sideways scrolling, tiles for the AI.

## Done

- `npm run format && npm run lint && npm run typecheck && npm test` exits 0.
- `npm run smoke` passes, with the Capture Scrolling checks.
- Every task in Order of work is ticked; departures are logged under `## Revisions`.

## Goal handover

none — built in the same session from the approved roadmap; the diff is the deliverable.

## Revisions

- 2026-10-25 — No scroll listener in the editor: Fabric measures the canvas on every pointer event, and the smoke check draws correctly after scrolling without one.
