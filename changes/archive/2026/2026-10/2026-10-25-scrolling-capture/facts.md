---
linear: none
type: facts
change: 2026-10-25-scrolling-capture
design: null
author: calvin.dudek@omr.com
status: approved
reviewed_by: calvin.dudek@omr.com (roadmap and mockups, 2026-10-25)
approved_at: 2026-10-25
created: 2026-10-25
archived_at: 2026-10-25
---

# Facts: Capture Scrolling

## Goal

The owner captures a page taller than the screen in one screenshot and marks it up as usual (roadmap M3).

## Acceptance criteria

### Entry point

- [x] **F1** The menu shall offer **Capture Scrolling…** under Capture Options, after Choose New Area…, with no global shortcut.

### Flow

- [x] **F2** When the owner picks it, the screen shall dim and the owner shall drag the area, with a hint that says to drag the part that scrolls.
- [x] **F3** While the owner scrolls, Snapmark shall grab the area again and again, and a small bar outside the area shall show the frames and height so far, with Done (↩) and Cancel (Esc).
- [x] **F4** The bar shall never be inside a grabbed frame when there is room for it below or above the area.
- [x] **F5** When a step goes further than the area's height, the bar shall say so; scrolling back a little shall pick up again.

### Stitching

- [x] **F6** The stitched image shall hold every row of the page once, in order, for uneven steps and pauses.
- [x] **F7** A sticky header and a sticky footer shall appear once, at the top and at the bottom.
- [x] **F8** The image shall stop at 20,000 px, with a notification.

### Result

- [x] **F9** Done shall open the stitched image in the normal editor; Esc shall open nothing.
- [x] **F10** The editor shall fit a tall image to the window's width and scroll; marks shall land under the pointer after scrolling, and Redact shall work far down the page.
- [x] **F11** README and the Keyboard Shortcuts window shall mention it.

<details>
<summary>Verification</summary>

- F1 — automated: `test/menu.test.ts`
- F6, F7, F8, F5 (the 'lost' step) — automated: `test/stitch.test.ts`, synthetic pages cut into frames
- F3, F4, F9, F10 — automated: `test/smoke.ts` feeds synthetic frames through the live loop (`scrollCapture`), presses ↩ and Esc in the real control window
- F2 — read in the code (`area.ts`, `#scroll`); the picker itself is covered by the existing smoke check
- F11 — `grep -n "Capture Scrolling" README.md src/main.ts`

</details>

## Verification

- **Automated:** `npm run format && npm run lint && npm run typecheck && npm test` exits 0; `npm run smoke` passes.
- **Manual:** the owner scrolls a long page in a browser with the built app.

## Out of scope

- Auto-scroll (needs the Accessibility permission and a native helper).
- Sideways scrolling.
- Saving a tall page as tiles for the AI.

## Open questions

None.
