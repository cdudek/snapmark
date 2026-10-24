---
linear: none
type: plan
change: 2026-10-25-window-capture-copy-save
design: null
author: calvin.dudek@omr.com
status: approved
reviewed_by: calvin.dudek@omr.com (roadmap and mockups, 2026-10-25)
approved_at: 2026-10-25
created: 2026-10-25
archived_at: 2026-10-25
---

# Plan: Window capture, Copy Image and Save As

> Capture one window with a clean crop; copy or save the marked-up image without adding it to the session.

## Approach

- **Window capture:** `shoot(['-i', '-w', '-o'])`, the same temp file and Esc handling as Capture Screenshot. `-w` allows only window selection, so a click takes one window. `-o` drops the shadow: it is transparent padding the marks and the AI do not need.
- **One image:** the editor's new `flatten()` ends card typing, drops the selection and renders the PNG; Add to session, Copy Image and Save As… all call it, and main runs `fitForAI` on each.
- **Clipboard:** Electron 44's `clipboard.write` with an `image/png` `ClipboardItem` (`writeImage` is gone).
- **Save dialog:** a sheet on the editor window, default name from `sessions.saveAsName` (the next entry number, or the Edit Again entry's); a bare name, so macOS opens the folder used last.
- **Test seam:** `desk` in `main.ts` holds the clipboard write and the dialog; the smoke test swaps both, so it never touches the owner's clipboard or waits on a dialog.
- **Rejected:** binding plain ⌘C (the guidelines reserve it for marks); `-l <windowid>` (needs a window list and a picker of our own).

## Design changes

None.

## Files that change

| File                                       | Change                                                                  |
| ------------------------------------------ | ----------------------------------------------------------------------- |
| `src/menu.ts`, `test/menu.test.ts`         | Capture Options ▸ Capture Window…                                       |
| `src/main.ts`                              | `captureWindow`, `desk`, `editor:copy`, `editor:saveAs`, shortcuts rows |
| `src/sessions.ts`, `test/sessions.test.ts` | `saveAsName`                                                            |
| `src/editor.ts`, `src/editor.html`         | `flatten()`, the two buttons, ⇧⌘C and ⇧⌘S                               |
| `src/preload.ts`, `src/shared.d.ts`        | `copyImage`, `saveImageAs`                                              |
| `test/smoke.ts`                            | stubs, ⇧⌘C in a note, Save As… button, byte comparison                  |
| `README.md`                                | the menu item, the keys, the buttons                                    |

## Order of work

- [x] 1. Menu item and test (F1) — proof: `node dist/test/menu.test.js`
- [x] 2. `captureWindow` (F2)
- [x] 3. `saveAsName` and its test (F5) — proof: `node dist/test/sessions.test.js`
- [x] 4. `flatten()`, buttons, keys, IPC, `desk` (F3–F7) — proof: smoke checks in CI
- [x] 5. README and the Keyboard Shortcuts window (F8)
- [x] 6. Verify, PR, auto-merge

## Risks

| Risk                                                          | What we do                                                        | Where it lands |
| ------------------------------------------------------------- | ----------------------------------------------------------------- | -------------- |
| `screencapture -w` behaves differently on a full-screen Space | Same `shoot()` path as Capture Screenshot, which handles it today | accepted       |
| A copy at AI size is smaller than the Retina original         | The brief asks for the exact saved image; named in the README     | accepted       |
| Save As… fails to write (permissions, full disk)              | A notification names the file and the reason                      | step 4         |

## Out of scope

- ⌘C on marks, a window-capture shortcut.

## Done

- `npm run format && npm run lint && npm run typecheck && npm test` exits 0.
- CI's smoke run passes, with the Copy Image and Save As… checks.
- Every task in Order of work is ticked; departures are logged under `## Revisions`.

## Goal handover

none — built in the same session from the approved roadmap; the diff is the deliverable.

## Revisions

None.
