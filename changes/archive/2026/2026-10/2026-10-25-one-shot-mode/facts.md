---
linear: none
type: facts
change: 2026-10-25-one-shot-mode
design: null
author: calvin.dudek@omr.com
status: approved
reviewed_by: calvin.dudek@omr.com (roadmap and mockups, 2026-10-25)
approved_at: 2026-10-25
created: 2026-10-25
archived_at: 2026-10-25
---

# Facts: One-shot mode

## Goal

The owner captures one screenshot, makes it look finished and copies or saves it, without a session (roadmap M5).

## Acceptance criteria

### Entry

- [x] **F1** The menu shall offer **One-Shot Capture…** last under Capture Options, after a separator, with no global shortcut.
- [x] **F2** When the owner picks it, a dragged region shall open in the editor in one-shot mode; Esc shall open nothing.

### The one-shot editor

- [x] **F3** It shall have the same tools and marks as session mode.
- [x] **F4** The side panel shall show **Beautify** instead of the comment and References: Padding, Rounded corners and Shadow sliders with their values, 10 backgrounds (8 presets, None, a custom colour) and Ratio (Auto, 4:3, 3:2, 16:9, 1:1).
- [x] **F5** The canvas shall preview the result as the settings change.
- [x] **F6** A ratio shall set the whole image's aspect ratio, the screenshot centred and the padding grown to fill.
- [x] **F7** The last settings shall be remembered (in the app's state file) and used by the next one-shot.

### Actions

- [x] **F8** There shall be no Add to session; **Copy Image** shall be the main button, on ⌘C (when no text has the cursor), ⇧⌘C and ⌘↵; **Save As…** on ⇧⌘S suggests `Snapmark <date> <time>.png`.
- [x] **F9** Copy and Save As shall give the beautified image at the screenshot's full resolution, not the 1568 px AI size.
- [x] **F10** Nothing shall be written to a session, and no session shall be created or made current.
- [x] **F11** Closing it (Discard, ⌘W, Esc) shall keep it in Discarded; reopened, it comes back in one-shot mode with its settings.

### Session mode and docs

- [x] **F12** Session mode shall behave as before (its smoke checks pass unchanged).
- [x] **F13** README (including the corrected ⌃⇧ shortcuts table) and the Keyboard Shortcuts window shall describe it.

<details>
<summary>Verification</summary>

- F1 — automated: `test/menu.test.ts`
- F2 — read in the code: `captureOneShot` runs `screencapture -i` through the same `shoot()` as Capture Screenshot; never run against the owner's screen
- F4, F5, F8, F9, F10, F11, F7 — automated: `test/smoke.ts` (one-shot section), in CI
- F6 — automated: `test/beautify.test.ts` (layout maths), `test/smoke.ts` (output size and corner pixels)
- F3, F12 — the existing smoke checks run unchanged against session mode
- F13 — `grep -n "One-Shot\|⌃⇧" README.md src/main.ts`

</details>

## Verification

- **Automated:** `npm run format && npm run lint && npm run typecheck && npm test` exits 0; CI's smoke run passes.
- **Manual:** the owner makes a one-shot, copies it into a slide, and saves one.

## Out of scope

- Watermark text, a preset gallery, background images, portrait ratios, a global shortcut, switching an open screenshot between modes.

## Open questions

None.
