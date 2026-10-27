---
type: validation
change: 2026-10-27-calm-style
design: null
linear: none
author: Claude (orchestrator)
status: draft
created: 2026-10-27
---

# Validation: 2026-10-27-calm-style

Every fact and ask, checked against the built app on `milestone/calm-style-<n>`. Each milestone appends its own section.

## Milestone 1

Checked on `milestone/calm-style-1` at `1e46df2`, 2026-10-27.

- **Gate:** `VERIFY PASS milestone 2026-10-27-calm-style 1e46df2`. Format, lint, typecheck, `npm test` and `npm run smoke:background` all print `ok`.
- **Screenshots:** 56 shots of the capture bar, from the window's own pixels (`webContents.capturePage`). Light and dark, 100 % and 130 %.
- The run was in the background. Snapmark never took the front.
- Shots are flattened on a flat grey (light `#e5e5ea`, dark `#1c1c1e`). The live bar shows the frosted window material instead.
- Shot names below are `capture-bar--<state>--<theme>--<zoom>.png` in the owner's review folder.

| Fact or ask | Expected                                                             | Observed                                                                                                                 | Evidence                                                                                  | Verdict                                                      |
| ----------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| F1          | `tokens.css` is the starter build at 3048d42, with Snapmark's accent | The first line names the repo and 3048d42. The accent is `#0f72db`. Source check only                                    | `test/style.test.ts @F1`; gate `ok check-4: npm test`                                     | met                                                          |
| F2          | A `tokens.css` that differs from the lock fails the check            | The check compares the file's sha256 with `tokens.lock.json`. Source check only                                          | `test/style.test.ts @F2`; gate `ok check-4`                                               | met                                                          |
| F3          | Every window loads `tokens.css` and sets `data-surface="system"`     | All eight pages load `tokens.css`, then `surface.js`, first. It sets the attribute on macOS only (Q1). Source check only | `test/style.test.ts @F3`; gate `ok check-4`                                               | met                                                          |
| F4          | One row, at most 56 pt tall at 100 %                                 | One row of controls. The bar is 48 pt tall at 100 %                                                                      | `test/smoke.ts @F4`; gate `ok check-5`; every shot's manifest size is 48 pt               | met                                                          |
| F5          | Icon and name side by side, no key caption                           | Each mode shows its icon left of its name on one line. No caption anywhere                                               | `test/smoke.ts @F5`; gate `ok check-5`; `default-session--light--100`                     | met                                                          |
| F6          | Only Capture is filled with the accent; nothing else is the accent   | Capture alone is blue, in all five modes. No icon, label, border or outline is blue at rest                              | `test/smoke.ts @F6`; gate `ok check-5`; the five `mode-*` shots                           | met                                                          |
| F7          | The chosen mode is the `soft` pill in normal text colour             | Each chosen mode shows a grey pill and ink text, light and dark                                                          | `test/smoke.ts @F7`; gate `ok check-5`; the five `mode-*` shots                           | met                                                          |
| F8          | No border or outline on any control at rest                          | No control has a border or outline when the bar opens                                                                    | `test/smoke.ts @F8`; gate `ok check-5`; `default-session` shots                           | met                                                          |
| F9          | No focus ring when the bar opens                                     | Focus sits on the chosen mode without a ring                                                                             | `test/smoke.ts @F9`; gate `ok check-5`; `default-no-session` and `default-session` shots  | met                                                          |
| F10         | After Tab, a 2 pt ring in the system focus colour, 2 pt outside      | After Tab the destination shows a 2 pt ring, 2 pt out. Light: orange `#e59700`. Dark: pale blue `#99c8ff`                | `test/smoke.ts @F10`; `after-tab` shots; computed colours in the screens log              | partly met: this Mac's focus colour is blue, the ring is not |
| F11         | Each control's key is in its tooltip; only Capture shows ↩           | Every button's `title` names its key. Capture alone shows ↩. Whether the tooltip appears on hover is unchecked (Q4)      | `test/keys.test.ts @F11`; `test/smoke.ts @F11`; gate `ok check-4`, `ok check-5`           | partly met: tooltip display unproven                         |
| F12         | One pop-up reading "To <session> ▾" or "One-Shot ▾"; One-Shot first  | The face reads "To 2026-10-27 · Ledgerly…" or "One-Shot". The pop-up's first item is One-Shot                            | `test/capture.test.ts @F12`; `test/smoke.ts @F12`; `dest-face` shots; `native-menus.json` | met                                                          |
| F13         | The pop-up, ⇧⌘O and ⇧⌘P do what v0.24.0's segment and pop-up did     | A pick changes the session or One-Shot. ⇧⌘O switches both ways. ⇧⌘P opens the pop-up                                     | `test/smoke.ts @F13` (two checks); gate `ok check-5`                                      | met                                                          |
| F14         | On a 900 pt work area at 130 %, every control sits inside the window | The bar is 852 pt wide, modes show icons only, and nothing is cut                                                        | `test/capture.test.ts @F14`; `test/smoke.ts @F14`; `narrow-900pt-work-area--*--130`       | met                                                          |
| F15         | `bar.html` has no colour literal                                     | No hex, colour function or named colour. Its colours are `--ds-*` tokens. Source check only                              | `test/style.test.ts @F15`; gate `ok check-4`                                              | met                                                          |
| N1          | Text 4.5:1 and the focus ring 3:1, light and dark                    | Capture's label passes. "To" is `#808080`: 3.2:1 light, 4.3:1 dark on the shot's grey. The light ring is 1.9:1           | `test/colour.test.ts @N1`; pixels of `default-session` and `after-tab` shots              | not met                                                      |
| N2          | Every v0.24.0 check still passes, except logged replaced styles      | The full unit and smoke runs pass. The replaced checks are listed in plan.md Revisions 1.3                               | gate `ok check-4`, `ok check-5`; plan.md Revisions                                        | met                                                          |
| A1          | One row, smaller, on the owner's design system                       | The bar is one 48 pt row, built from the starter's tokens (F1, F2, F4, F5, F14)                                          | F1, F2, F4, F5, F14                                                                       | met for the bar; other windows are milestones 2 and 3        |
| A2          | System colours, the owner's blue on buttons only, no blue outlines   | System surfaces and text, one blue button, no outline at rest (F3, F6–F9). The ring's colour is wrong in light (F10)     | F3, F6–F10                                                                                | partly met                                                   |
| A3          | Calm and minimal, yet clear                                          | One row, no captions, one filled button. The chosen mode is a quiet grey pill                                            | F4–F8; `default-session` shots                                                            | met for the bar                                              |
| A5          | The approved direction and mock                                      | Matches the mock in layout and colour. The destination shows the date and cuts the name; keys rely on tooltips           | F4–F12; `default-session` shots beside `bar-calm.png`                                     | partly met                                                   |
| A7          | Snapmark on the shared design system repo                            | `tokens.css` is the pinned starter build; the bar uses only its tokens                                                   | F1, F2, F15                                                                               | met                                                          |

Verdicts: 17 met, 4 partly met, 1 not met. A6 starts in milestone 2.

The findings are in [findings.md](findings.md), milestone 1.
