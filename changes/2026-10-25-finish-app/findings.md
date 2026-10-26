---
type: findings
change: 2026-10-25-finish-app
---

# Findings

One section per milestone. Blocking items first, advisory after. One fix round per milestone (`docs/sdlc.md`, One go).

## Milestone 1 — Editor polish and leftovers

Review of `origin/main...milestone/finish-app-1`, code and UX lenses, plus the milestone gate. 0 Critical, 0 High, 2 Medium, 7 Low.

### Blocking

- [x] **M1-1** (Medium) `src/viewer.ts`: after Remove from a grid tile's menu, focus fell to the page, so the next ↩ started a rename (snap-c5c, guideline A4). Fixed: the grid focuses the tile that took the removed one's place, or the Screenshots tab when none is left.
- [x] **M1-2** (Medium) the branch was not Prettier-clean (12 files), so CI's `format:check` would fail. Fixed: formatted and committed.
- [x] **G1** (gate) `test/smoke.ts` declared `oneKept` twice, so `tsc` failed. Fixed: the F134 value is `oneSelected`.
- [x] **M1-3** (Low, trust boundary) `editor:color` stored whatever the page sent. Fixed: only `#rrggbb` is kept.

### Advisory

- **M1-4** (Low) the toolbar row renders 59 px, not the spec's 52.
- **M1-5** (Low) the header's `overflow-x: auto` cuts 1 px off the top of the tool buttons' focus ring.
- **M1-6** (Low) the session label is about 4.2:1 on hover, in light and dark.
- **M1-7** (Low) the selected tool icon is about 2.6:1 in light mode; it predates this milestone.
- **M1-8** (Low) in Edit Again and one-shot the session label is a disabled menu button, which screen readers call "dimmed"; the spec says plain text.
- **M1-9** (Low) if a rename fails after the folder moved, `tryRename` says "Couldn't rename" while the app still points at the old name.
- The colour panel writes `state.json` on every drag event (part of M1-3); harmless, a debounce would do.

### Owner asks during the milestone, and what the gates found in them

- [x] **A14** top bar spacing and stacked icons (42fe719); **A15–A18** hex field, Custom row, round swatch, one keycap style (5ddf377).
- [x] **G2** (gate) the toolbar smoke script declared `toolBefore` twice in one in-page script. Fixed.
- [x] **G3** (gate) the A15 check relied on `blur()`, which fires no event in a hidden smoke window. The check now dispatches it, as F127's does.
- [x] **M1 gaps** packaged LC_UUID proven on two local builds; audit findings F028, F041, F043 fixed and F025, F027 confirmed; multi-selection drag undone as one step (04e0fe0).

## Milestone 2 — Capture bar, Settings, Keyboard Shortcuts

Review of `origin/milestone/finish-app-1...milestone/finish-app-2`, code and UX lenses, plus the milestone gate (its first compile). 0 Critical, 1 High, 2 Medium, 6 Low.

### Blocking

- [x] **M2-1** (High) the chosen mode in the capture bar and the chosen Settings tab were only a 1.2–1.4:1 grey fill (WCAG 1.4.11, guideline A9). Fixed: an accent fill with a white icon and label. Bar `light-dark(#0f72db, #1f7ae0)`: 4.0:1 on the light popover, 3.5:1 on the dark one; Settings `#0f72db`: 4.7:1 on white, 4.0:1 on dark Canvas, white label 4.7:1. Focus rings sit 2 px outside, so they never merge with the fill.
- [x] **M2-2** (Medium) the bar was a fixed 520 × 52 with `margin-left: auto` on Capture, so the gap before Capture was 28–85 pt and jumped with One-Shot. Fixed: the window takes the page's preferred width (`enablePreferredSizeMode`, re-centred on every change), 56 pt high (8 + 40 + 8), 8 pt gaps everywhere, the mode group included, no auto margin.
- [x] **M2-3** (Medium, trust boundary) `settings:set` and `settings:run` took messages from any window and stored any value. Fixed: only the Settings window's webContents is heard; `checkedCapture` (`src/capture.ts`) keeps a timer of 0, 5 or 10, booleans for One-Shot and pointer, and a mode from `MODES`, in `setCapture` (so `bar:capture` and `bar:options` too) and for `state.json` on load; login and single keys need a boolean; login is never set in a development build. Unit block "M2-3 checked options" in `test/capture.test.ts`.
- [x] **M2-4** (Low) ↑ and ↓ now move in the bar's mode group, and Home and End in the Settings tab list. The F204 and F228 smoke checks press them too.
- [x] **M2-5** (Low) Settings and Keyboard Shortcuts snapped to the 8-pt rhythm: tab padding 8 × 16, column gap 8, the note button, folder path and "Taken by another app" gaps 8, sheet rows 8 pt top and bottom, the "or" gap 8.
- [x] **M2-6** (Low) the Capture Scrolling key row said "(menu: Capture Options)", a submenu that is gone. Fixed: "(capture bar, ⌃⇧5)", added to the spec's Words table.
- [x] **G2** (gate) `test/smoke.ts` declared `again` and `reopened` twice, and `oneKept` (G1, not yet on this branch), so `tsc` failed. Fixed: `barAgain`, `barReopened`, `oneSelected`.
- [x] **G3** (gate) the branch was not Prettier-clean (milestone 1 files included), so `format:check` would fail. Fixed: formatted and committed.
- [x] **G4** (gate) smoke F123 failed: the check also required the 60-character name to be cut, which F123 does not ask (milestone 1 fixed the same check; that fix is not on this branch). Fixed: the same check as milestone 1, logged under Revisions in plan.md.

### Advisory

- **M2-7** (Low) the spec gives the ⌃⇧5 key-list row two wordings (`spec/capture-and-settings.md:143` and `:224`); the code follows `:224`.
- **M2-8** (Low) if registering the timer's global Esc fails, nothing says so, and the countdown cannot be cancelled.
- **M2-9** (Low) the Settings window's text, the sessions folder path and the version included, cannot be selected.

## Milestone 3 — Tall captures as tiles

Review of `origin/milestone/finish-app-2...milestone/finish-app-3`, checked against facts.md M3 (F1–F25, N1, N2), the specs and the ADR, plus the milestone gate (the first compile of milestones 2–3 on this branch). 0 Critical, 1 High, 0 Medium, 4 Low.

### Blocking

- [x] **M3-1** (High) Edit Again that changed only the marks rewrote `session.md` byte for byte, so the watcher never reloaded the session window and `clearImageCache()` never ran: the old parts, thumbnail and large view stayed on screen (F21). Fixed: `editor:save` sends a forced `viewer:reload` (`ViewerInit.images`) after an Edit Again save, and the viewer remounts on it even when the text is unchanged; the image cache is now cleared after the old `<img>` elements are removed.
- [x] **M3-2** (Low) `replaceShot` was not all-or-nothing after the parts were written. Fixed: the old parts move to `img/NNN.old/`, the new ones take their place, then the one image and `session.md` are written, and the old parts go last; any failure puts the parts, the one image and `session.md` back. A stale `.old` left by a crash goes back when its folder is missing; `restoreShot` treats `NNN.new`/`NNN.old` as taken, `nextNumber` already did. New unit check "all or nothing" (a read-only `session.md`).
- [x] **M3-3** (Low) the tall rule was decided on the captured size but `cutParts` decided again on the scaled one, so 71 sizes near the two-thirds line (e.g. 1362 × 2151) were saved as one 2.6 MP image with no parts. Fixed: `partLayout` decides on the size scaled to the part width, and `fitForAI` resizes a tall capture to the layout's own size. Checked over 1.58 M sizes (300–5120 × 200–30 000): `fitForAI` and `cutParts` never disagree; every spec/ia.md row keeps its result (F3).
- [x] **M3-4** (Low) the F5 test compared the diamond with its own overlap formula. Fixed: it measures the overlap `partLayout(w, 20 × w)` makes, for every width 200–5120.
- [x] **M3-5** (Low) nothing checked that a wider-than-1280 tall capture is scaled. Fixed: a new N1 smoke check, outside the timed span: a 2560 × 20 000 capture's one image is 1280 × 10 000 and its 13 parts are 1280 wide and at most 898 high.
- [x] **G4** (gate) `test/smoke.ts` declared `tall`, `t0`, `again`, `reopened` and `oneKept` twice, and passed the session where a window was typed, so `tsc` failed. Fixed: `tallSession`, `cutStart`, and the names milestones 1 and 2 chose (`barAgain`, `barReopened`, `oneSelected`), so the branches merge cleanly. No check removed.
- [x] **G6** (gate, milestone 1 code) F123 failed: the session window's header is a grid item without `min-width: 0`, so a long name widened the header past the window (at 900 pt, "Open in Markdown App" ended at 1071 pt) instead of shortening. Fixed in `src/viewer.html`. The check also asserted the 60-character name is cut at 1100 pt, where it fits (446 of 451 px); it now asserts at 1100 pt that the button keeps one line inside the window and the tabs and buttons keep their full width, and at 900 pt the same with the name cut. Fails on the milestone 1 fix commit too (`ed0deb6`).
- [x] **G7** (gate, milestone 1 check) F127 failed 2 of 6 smoke runs: in the hidden run the session window has no system focus, so the test's `f.blur()` fired no blur event whenever another window held Electron's focus. Fixed in the test: it dispatches the blur event the click away causes; the assertion is unchanged. 3 runs in a row passed.
- [x] **G5** (gate) the branch was not Prettier-clean (milestone 1 and 2 files included), so `format:check` would fail. Fixed: formatted and committed.

### Advisory

- F21 is still checked by hand only: no smoke check saves a marks-only Edit Again and looks at the session window.
- A crash between moving the old parts to `.old` and writing `session.md` leaves the entry linking a missing folder until that entry is saved again (the next `replaceShot` puts `.old` back); an in-process failure is fully rolled back.
- Not measured beyond the smoke: N1's budget on slower Macs, and Chromium's PDF page split of a 1280 × 8000 one image (interaction.md:86 accepts it).
