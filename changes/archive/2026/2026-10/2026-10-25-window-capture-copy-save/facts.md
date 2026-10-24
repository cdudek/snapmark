---
linear: none
type: facts
change: 2026-10-25-window-capture-copy-save
design: null
author: calvin.dudek@omr.com
status: approved
reviewed_by: calvin.dudek@omr.com (roadmap and mockups, 2026-10-25)
approved_at: 2026-10-25
created: 2026-10-25
archived_at: 2026-10-25
---

# Facts: Window capture, Copy Image and Save As

## Goal

The owner captures one window cleanly, and takes a marked-up image out of the editor without adding it to the session (roadmap M2).

## Acceptance criteria

### Window capture

- [x] **F1** The menu shall offer **Capture Window…** under Capture Options, between Choose New Area… and Capture Scrolling…, with no global shortcut.
- [x] **F2** When the owner picks it, a click on a window shall open that window in the editor, cropped to its edges without the macOS window shadow; Esc shall open nothing.

### Copy Image

- [x] **F3** ⇧⌘C and a **Copy Image** button in the editor shall put the marked-up image on the clipboard and say so with a notification.
- [x] **F4** ⇧⌘C shall work while a note has the cursor; plain ⌘C shall keep copying text.

### Save As…

- [x] **F5** ⇧⌘S and a **Save As…** button shall open the native save dialog, suggesting the entry name the screenshot would get ("Ledgerly Q4 review 013.png"), and write a PNG there.

### Both

- [x] **F6** The copied and saved image shall be byte for byte the image Add to session saves.
- [x] **F7** Neither shall add an entry to the session.
- [x] **F8** README and the Keyboard Shortcuts window shall list them.

<details>
<summary>Verification</summary>

- F1 — automated: `test/menu.test.ts`
- F2 — read in the code (`captureWindow` runs `screencapture -i -w -o` through the same `shoot()` as Capture Screenshot); never run against the owner's screen
- F3, F4, F6, F7 — automated: `test/smoke.ts` presses ⇧⌘C inside a note and clicks Save As…, with the clipboard write and the dialog stubbed, then compares bytes with `img/001.png`
- F5 — automated: `test/sessions.test.ts` (`saveAsName`), `test/smoke.ts` (the suggested name)
- F8 — `grep -n "⇧⌘C\|Capture Window" README.md src/main.ts`

</details>

## Verification

- **Automated:** `npm run format && npm run lint && npm run typecheck && npm test` exits 0; CI's smoke run passes.
- **Manual:** the owner captures a window, copies and saves an image with the built app.

## Out of scope

- ⌘C copying marks (interaction guidelines, Copy and paste: proposed).
- A global shortcut for window capture.

## Open questions

None.
