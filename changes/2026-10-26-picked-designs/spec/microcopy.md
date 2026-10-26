# Microcopy

Written with `omr-dev:microcopy-write`, English only. Updated in the fix pass, 2026-10-26, with the owner's answers. Snapmark has one locale and keeps its strings inline (`keys.ts`, `menu.ts`, the `.html` files). There is no message catalogue, so no parity check applies.

Voice: WRD-1 to WRD-7 in `docs/ux/interaction-guidelines.md`. Title case on menus, buttons, tabs and window titles. Sentence case on hints, labels and messages. No "please", no exclamation marks. Errors say what happened, what it means and what to do.

Every row is new or changed. "Today" is the string it replaces, or "—".

## Global keys and the menu bar menu

| Where                       | Today                          | New                                                        | Why                            |
| --------------------------- | ------------------------------ | ---------------------------------------------------------- | ------------------------------ |
| Menu row, ⌃⇧4               | "Capture Last Area" (⌃⇧3)      | "Capture Last Area" (⌃⇧4)                                  | Same name, new key (A4)        |
| Menu row sublabel           | "First time: drag the area"    | unchanged; after New Session: "New session: drag the area" | Says why it will ask (Q2)      |
| Menu row, ⌃⇧1               | —                              | "Capture New Area…"                                        | It sets and captures (Q11)     |
| Menu row, ⌃⇧3               | —                              | "Capture Full Screen"                                      | Every display, like macOS (Q7) |
| Menu row, ⌃⇧2               | —                              | "Capture One-Shot…"                                        | A4: One-Shot must be found     |
| Menu row, ⌃⇧4 today         | "Capture Screenshot…"          | removed                                                    | Its overlay moves to ⌃⇧2 (Q1)  |
| Key taken                   | "<row> (shortcut unavailable)" | unchanged, for the new rows too                            | —                              |
| Menu bar icon, busy         | —                              | the clock "0:07" while recording; the digit while counting | CAP-10                         |
| Menu bar icon tooltip, busy | —                              | "Stop Recording" · "Cancel Countdown" · "Done Scrolling"   | Names what a click does        |

## Capture bar

| Where                          | Today                          | New                                                                                                             | Why                          |
| ------------------------------ | ------------------------------ | --------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| Close, visible label           | — (icon only)                  | "Esc"                                                                                                           | Key on screen (pick)         |
| Close, VoiceOver               | "Close"                        | "Close" (`aria-keyshortcuts` Escape)                                                                            | ACC-1                        |
| Mode 1                         | "Choose New Area" (hover)      | "New Area" · "1"                                                                                                | Matches ⌃⇧1 (Q8)             |
| Mode 2                         | "Capture Window" (hover)       | "Window" · "2"                                                                                                  | —                            |
| Mode 3                         | —                              | "Full Screen" · "3"                                                                                             | Matches ⌃⇧3 (Q8)             |
| Mode 4                         | "Capture Last Area · …"        | "Last Area" · "4"                                                                                               | Matches ⌃⇧4 (Q8)             |
| Mode 5                         | "Capture Scrolling"            | "Scrolling" · "5"                                                                                               | —                            |
| Mode 6                         | —                              | "Record" · "6"                                                                                                  | A verb, like the others      |
| Mode VoiceOver names           | as hover labels                | "Capture New Area", "Capture Window", "Capture Full Screen", "Capture Last Area", "Capture Scrolling", "Record" | Full names for a listener    |
| Headline and hint, New Area    | —                              | "Capture New Area" · "Drag to choose the area"                                                                  | —                            |
| Headline and hint, Window      | —                              | "Capture Window" · "Click a window after Capture"                                                               | —                            |
| Headline and hint, Full Screen | —                              | "Capture Full Screen" · "Every display, one screenshot each"                                                    | Q7                           |
| Headline and hint, Last Area   | —                              | "Capture Last Area" · "1280 × 720" / "No area yet: drag one after Capture"                                      | —                            |
| Headline and hint, Scrolling   | —                              | "Capture Scrolling" · "Snapmark scrolls the area for you" / "Scroll the area yourself, then Done"               | A2, A3                       |
| Headline and hint, Record      | —                              | "Record" · "1280 × 720 · up to 30 seconds · 10 fps" / "Drag an area · up to 30 seconds · 10 fps"                | A8; shows the area it reuses |
| Segments                       | —                              | "Session", "One-Shot"                                                                                           | A6, A10                      |
| Pop-up face                    | —                              | "<session> (<n>)" · empty: "<session>"                                                                          | As the pick                  |
| Pop-up face, One-Shot          | —                              | "Not in a session"                                                                                              | Why it is greyed, in place   |
| Pop-up face, no session yet    | —                              | "No session yet"                                                                                                | Not a command                |
| Pop-up tooltip                 | —                              | "Current session: <name>"                                                                                       | Says its scope (Q13)         |
| Options button                 | "Options"                      | "Options" with "⌥O" under                                                                                       | Key on screen                |
| Capture button                 | "Capture" / "Capture One-Shot" | "Capture ↩" / "Capture One-Shot ↩" (keycap)                                                                     | A3                           |
| Options group header           | "Save to"                      | removed                                                                                                         | The segments say it          |
| Options group header           | —                              | "Frame Rate"                                                                                                    | Title case in a menu         |
| Frame rate items               | —                              | "15 fps", "10 fps", "5 fps", "4 fps", "2 fps"                                                                   | A6                           |
| Timer items                    | unchanged                      | "None", "3 Seconds", "5 Seconds", "10 Seconds"                                                                  | Title case (WRD-1)           |

## Area picker

| Where                   | Today                                                                          | New                                                                  |
| ----------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------- |
| Hint, area              | "Drag over the area to capture. ⌃⇧3 captures it again each time. Esc cancels." | "Drag over the area to capture. ⌃⇧4 captures it again. Esc cancels." |
| Hint, after New Session | —                                                                              | "New session: drag the area. ⌃⇧4 captures it again. Esc cancels."    |
| Hint, record, area set  | —                                                                              | "↩ records this area. Drag to choose another. Esc cancels."          |
| Hint, record, no area   | —                                                                              | "Drag over the area to record. Esc cancels."                         |

## Countdown overlay

| Where     | New                                                                                  |
| --------- | ------------------------------------------------------------------------------------ |
| Digit     | "3", "2", "1"                                                                        |
| Line      | "Esc cancels"                                                                        |
| VoiceOver | "Recording starts in 3 seconds. Esc cancels." / "Capture in 3 seconds. Esc cancels." |

## Recording control

| Where      | New                                                | Note                             |
| ---------- | -------------------------------------------------- | -------------------------------- |
| Cancel     | ⓧ, VoiceOver "Cancel recording"                    | Into Discarded                   |
| Status     | "0:07 of 0:30 · 10 fps"                            | A clock while it runs            |
| Done       | "Done"                                             | Label stays while processing     |
| Hint       | "⌃⇧5 stops"                                        | No plain key is taken (Q9)       |
| Processing | "Finding key frames…"                              | Replaces the status, past 400 ms |
| VoiceOver  | "Recording, 10 seconds of 30"; "Recording stopped" | every 10 s; on stop              |

## Scrolling control

| Where         | Today                            | New                                                                                             |
| ------------- | -------------------------------- | ----------------------------------------------------------------------------------------------- |
| Starting      | "Starting…"                      | unchanged                                                                                       |
| Auto          | —                                | "Scrolling · 12 frames · 4,200 px tall"                                                         |
| Manual        | "Scroll down, then Done" + count | "Scroll down, then Done · 3 frames · 1,800 px tall"                                             |
| Fell back     | —                                | "This area did not scroll. Scroll it yourself, then Done."                                      |
| No permission | —                                | "Auto-scroll needs Accessibility. Turn it on in Snapmark Settings ▸ Capture." (once per launch) |
| Cancel        | "Cancel" button                  | ⓧ, VoiceOver "Cancel"; Esc as today                                                             |

## Settings ▸ Capture

| Where               | New                                                          |
| ------------------- | ------------------------------------------------------------ |
| Status, allowed     | "Capture Scrolling scrolls by itself."                       |
| Status, not allowed | "Capture Scrolling needs Accessibility to scroll by itself." |
| Status, App Store   | "This version cannot scroll for you."                        |
| Button              | "Open Accessibility Settings…"                               |

## Editor

| Where                           | Today                                | New                                                                                      | Why                             |
| ------------------------------- | ------------------------------------ | ---------------------------------------------------------------------------------------- | ------------------------------- |
| Segments                        | —                                    | "Session", "One-Shot"                                                                    | A12                             |
| Session pop-up face             | "Ledgerly Q4 review · 6 screenshots" | "Ledgerly Q4 review (6)"                                                                 | A12 pick                        |
| Session pop-up tooltip          | "<session> · Switch Session"         | "<full name> · Switch Session"                                                           | One name with the menu bar      |
| Pop-up face, One-Shot           | "One-shot · not in a session"        | "Not in a session"                                                                       | The segment says One-Shot       |
| Segmented tooltip, Edit Again   | —                                    | "Edit Again saves back into <session>."                                                  | Disabled reason                 |
| One-Shot with notes             | —                                    | "Notes stay with Session. They are not copied."                                          | Notes are hidden                |
| Move error                      | notification                         | "Couldn't move to <session>: its folder is gone. Choose another session or New Session." | In the editor, with a next step |
| Window title, One-Shot          | "Snapmark — One-shot"                | "Snapmark — One-Shot"                                                                    | Case                            |
| Primary, Session                | "Add to session ⌘↵"                  | "Add to Session ⌘↩"                                                                      | WRD-1                           |
| Primary, Edit Again             | "Save changes ⌘↵"                    | "Save Changes ⌘↩"                                                                        | WRD-1                           |
| Primary, One-Shot               | "Copy Image ⌘C"                      | unchanged                                                                                | —                               |
| Primary, One-Shot recording     | —                                    | "Copy Filmstrip ⌘C"                                                                      | Q10                             |
| Copy or Save menu, recording    | "Copy Image", "Save As…"             | "Copy Filmstrip", "Copy GIF", "Save As…", "Save GIF As…"                                 | —                               |
| Copy notifications              | "Image copied."                      | "Image copied." · "Filmstrip copied." · "GIF copied."                                    | EX-9                            |
| Beautify reason, recording      | —                                    | "Beautify works on screenshots only."                                                    | Disabled with reason            |
| Session pop-up menu items       | 10 names, "New Session"              | "<name> (<n>)", "Older Sessions…", "New Session"                                         | A12                             |
| Discarded list, copied One-Shot | —                                    | "Copied One-Shot"                                                                        | Not mistaken for a discard      |

## Recording editor

| Where           | New                                               |
| --------------- | ------------------------------------------------- |
| Facts line      | "Recording · 3.2 s · 10 fps · 4 key frames of 32" |
| Facts, slow     | "… · evenly spaced"                               |
| Frame label     | "0.4 s"                                           |
| Toggle          | "Show All Frames" · "Show Key Frames" (⇧⌘F)       |
| Toggle disabled | "All 4 frames are key frames"                     |
| Reference time  | "0.4 s"                                           |

## Notes and hex fields

| Where               | Today                    | New                                                     |
| ------------------- | ------------------------ | ------------------------------------------------------- |
| Beautify custom hex | —                        | field with "#" drawn; VoiceOver "Background hex colour" |
| Hex error (both)    | "Use 3 or 6 hex digits." | "Use 3 or 6 hex digits, like e5484d."                   |

## Session window and session.md

| Where                   | New                                                                            |
| ----------------------- | ------------------------------------------------------------------------------ |
| Entry badge             | "Recording" · "Screenshot"                                                     |
| Entry facts             | "3.2 s · 10 fps · 4 key frames of 32"                                          |
| Entry labels            | "Filmstrip · for the AI" · "GIF · for people"                                  |
| GIF button              | "Play" · "Pause" (Space)                                                       |
| GIF missing             | "The GIF is missing. The filmstrip is still in the session."                   |
| `session.md` entry line | "Recording 3.2 s at 10 fps. Key frames: 0.0 s, 0.4 s, 2.4 s, 3.2 s (4 of 32)." |
| `session.md` GIF link   | "GIF: 007.gif"                                                                 |
| `session.md` reference  | "1 (0.4 s): <note>"                                                            |

## Keyboard Shortcuts window

The rows are in [screens.md](screens.md), Keyboard Shortcuts window. `keys.ts` stays their one source (KEY-6).

## Errors

| Where                  | New                                                                                           |
| ---------------------- | --------------------------------------------------------------------------------------------- |
| Recording grab failed  | "Recording failed: <reason>. Nothing was added. Click to try again."                          |
| Recording save failed  | "Couldn't save the recording: <reason>. Your marks are still here. Try Add to Session again." |
| Move to session failed | "Couldn't move to <session>: its folder is gone. Choose another session or New Session."      |
| Copy failed            | "Couldn't copy the filmstrip: <reason>. Try Save As… (⇧⌘S)."                                  |
