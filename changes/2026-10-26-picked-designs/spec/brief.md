---
type: design-brief
mode: sdlc
change: 2026-10-26-picked-designs
size: L
skips: {}
created: 2026-10-26
author: Claude (omr-ux:design)
status: draft
---

# Brief

The owner picked three mockup sets on 2026-10-26. This spec turns them into rules a builder can check.
The picked images are the prototype ([prototype/index.md](prototype/index.md)). Where an image and this spec disagree, the spec wins. The fix pass of 2026-10-26 applied the owner's answers (see Answers).

## Owner Asks

The words are in the change's `intent.md`, `## Asks`, verbatim. This table maps them; it does not repeat them.

| Ask | Source                  | Words (short)                                                                     | Answered by                                                                          |
| --- | ----------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| A1  | owner, chat             | "the escape while in Shift-Control-5 … didn't work"; scrolling "nothing happened" | Global Esc while the bar is open; blue Capture with ↩ (screens: Capture bar)         |
| A2  | owner, chat, screenshot | "It should automatically scroll"; "why is the button not blue?"                   | Capture Scrolling scrolls by itself; Capture is the one blue button                  |
| A3  | owner, dialog           | "Auto with manual fallback"; "Blue Capture + ↩ keycap"                            | Scrolling control, auto and manual states; Capture button                            |
| A4  | owner, chat             | "more like following mac defaults"; ⌃⇧1, 3, 4, 5 as listed                        | Global keys; menu bar capture rows; One-Shot gets ⌃⇧2 and a menu row                 |
| A5  | owner, chat, screenshot | hex code with `#`; a tab for single-shot vs session; vertical padding             | Hex fields; editor Session \| One-Shot; notes column spacing                         |
| A6  | owner, dialog           | window closes after One-Shot copy; tab; new or old session; GIFs; countdown; fps  | Editor toolbar destination; Record mode; countdown overlay; Frame Rate in Options    |
| A7  | owner, dialog           | "Around the headings … light dividers between general comment and references"     | Notes column: spacing and hairline                                                   |
| A8  | owner, dialog           | "Filmstrip + GIF"; "30 s cap"                                                     | Recording saves a filmstrip PNG and a GIF; Record stops at 30 s                      |
| A9  | owner, chat             | session window size saved, "It should be 90%"                                     | Session window opens at 90 % and remembers its size                                  |
| A10 | owner, design round 1   | "One clear next move"; not 5 or 6; One-Shot panel as is                           | Capture bar, countdown, recording control from 02-bold shots 1–4; Beautify unchanged |
| A11 | owner, recording review | "keyframes only … identical hash … keeps the timing?"                             | Key frames; GIF keeps real timing                                                    |
| A12 | owner, editor round 2   | "Toolbar Mode and Scheme Pop-up"                                                  | Editor toolbar: segmented control and session pop-up                                 |
| A13 | owner, chat             | "make sure that this all gets done"                                               | Every screen in this spec; four milestones in `decisions.json`                       |

### Earlier decisions on these screens

Found in `docs/designs/` and `docs/ux/interaction-guidelines.md`. Kept unless a row says otherwise.

| #   | Source                                    | Decision                                                            | In this change                                                                               |
| --- | ----------------------------------------- | ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| D1  | ADR capture bar, decision 3               | One-Shot lives in Options ▸ Save to                                 | Changed: a segmented control in the bar (A6, A10 shot 1). Save to leaves Options             |
| D2  | ADR capture bar, decision 4; CAP-7        | Bar options apply only to bar captures                              | Kept: the bar's Session \| One-Shot is a bar option too                                      |
| D3  | ADR capture bar, decision 6               | No recording, no Entire Screen                                      | Changed: Record is mode 6 and Full Screen mode 3 (A6, Q8); ⌃⇧3 captures the full screen (A4) |
| D4  | ADR capture bar, decision 11; WIN-2; EX-7 | The bar draws its own hover label                                   | Changed: every bar control shows its name and key, so the label retires (Q3)                 |
| D5  | ADR keys follow macOS; KEY-1              | ⌃⇧4 capture, ⌃⇧3 last area, ⌃⇧5 bar, ⌃⇧N new session                | Changed as A4 lists; ⌃⇧N unchanged                                                           |
| D6  | CAP-3                                     | Keys 1–4 pick a mode                                                | Changed: keys 1–6, matching the global digits (Q8)                                           |
| D7  | CAP-5                                     | Capture reads "Capture One-Shot" in One-Shot                        | Kept                                                                                         |
| D8  | CAP-10                                    | Timer shows seconds beside the menu bar icon                        | Kept, plus the countdown overlay (A6)                                                        |
| D9  | NTE-1, NTE-8                              | "General comment" heading; References heading only with a reference | Kept; spacing and a hairline added (A7)                                                      |
| D10 | WIN-5, editor M1 session label            | The session label opens a session menu                              | Changed: a pop-up after a Session \| One-Shot control (A12)                                  |

## Job Stories

| Job | Story                                                                                                                                                     | Audience scene           | Asks answered | Visible success                                                            |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ | ------------- | -------------------------------------------------------------------------- |
| J1  | When the capture bar is open and I change my mind, I want to press Esc and have the bar close, so I can go back to my work.                               | 1, reviewing a build     | A1            | Esc closes the bar from any app; the app behind gets no Esc                |
| J2  | When I pick a mode in the bar, I want to see which is chosen and that Capture or ↩ starts it, so I can capture without guessing.                          | 1                        | A2, A3, A10   | One blue button reads "Capture ↩"; the chosen mode has a grey fill         |
| J3  | When I capture from the keyboard, I want ⌃⇧1, 3, 4, 5 to work like macOS's digits, so I can skip learning a second set.                                   | 1                        | A4            | The menu bar menu lists the five keys; each does what A4 says              |
| J4  | When I mark up a screenshot, I want to see and change Session or One-Shot and which session, so I can send it to the right place.                         | 1 and 3, a quick verdict | A5, A6, A12   | The toolbar shows "Session \| One-Shot" and "Ledgerly Q4 review (6) ⌄"     |
| J5  | When a bug only shows while something moves, I want to record a short GIF after a countdown, so I can show the AI the motion.                             | 1                        | A6, A8, A10   | 3, 2, 1, then a recording control counting to 0:30                         |
| J6  | When the AI reads a recording, I want only the frames that changed, with their times, so I can let it see what happened.                                  | 1                        | A11, A8       | The editor shows "4 key frames of 32", each frame labelled "0.4 s"         |
| J7  | When I capture a page longer than the screen, I want Snapmark to scroll it for me, so I can capture long pages in one go.                                 | 1                        | A1, A2, A3    | The page scrolls by itself; without Accessibility, I scroll and press Done |
| J8  | When I write notes or set a colour, I want room around headings, a divider and a hex field that takes `#`, so I can read and set things without fiddling. | 1, 3                     | A5, A7, A9    | "#e5484d" pasted reads e5484d; a hairline sits above References            |

## Appetite

Size: L, four milestones (`decisions.json`): M1 capture bar, keys and countdown; M2 editor destination, notes, hex, window size; M3 recording; M4 auto-scroll.

## No-Gos

| No-go                                                                  | Source                    | Reason                                                  |
| ---------------------------------------------------------------------- | ------------------------- | ------------------------------------------------------- |
| Change the One-Shot side panel (Beautify) design                       | A10; intent Constraints   | "keep the current one shot tab-menu as is design wise"  |
| Use 02-bold shots 5 and 6 (editor) in any form                         | A10                       | Rejected by the owner                                   |
| Session \| One-Shot tabs in the notes column, or session buttons there | editor-target brief; A12  | Round 1 felt cluttered; the toolbar pop-up was picked   |
| One-Shot as an item in the session pop-up                              | editor-target feedback    | "One-Shot is the segmented control, not a menu item"    |
| Change annotation colours, or use blue for marks                       | EDT-7, EDT-8; intent      | Colours carry meaning the agent reads                   |
| Change ⌃⇧N                                                             | KEY-1; A4; intent         | "⌃⇧N New Session unchanged"                             |
| Any Snapmark window, countdown or control in a capture or a recording  | CAP-2                     | The picture shows the screen as you saw it              |
| A new dependency for the GIF                                           | intent, Open questions    | Answered: macOS ImageIO                                 |
| Auto-scroll in the App Store build                                     | intent Constraints        | The sandbox has no Accessibility                        |
| A video timeline, trimming or a scrubber                               | recording-review 03 notes | Not asked; key frames were picked over a scrubber       |
| Captions on key frames ("Spinner appears")                             | this spec                 | Snapmark cannot know them; frames carry their time only |
| A second blue filled button in any panel                               | A2, A3; EDT-8             | Von Restorff: one blue thing is the next move           |

## Visible Success

- The owner presses ⌃⇧5, then Esc, while a browser is in front. The bar closes; the browser does nothing.
- The bar shows one blue "Capture ↩". The chosen mode has a grey fill and a blue icon.
- ⌃⇧1 asks for an area and captures it. ⌃⇧4 captures it again. After ⌃⇧N, ⌃⇧4 asks first.
- ⌃⇧3 captures the full screen at once, one screenshot per display, like macOS. ⌃⇧2 lets the owner drag an area for a One-Shot.
- Record shows the last area to keep or redraw, a big 3, 2, 1, then "0:07 of 0:30 · 10 fps" below it.
- The bar's digits match the global ones: 1 New Area, 3 Full Screen, 4 Last Area.
- After Done, the editor shows the key frames, each labelled with its time, and "4 key frames of 32".
- The session holds a filmstrip PNG for the AI and a GIF that plays at the real speed.
- The editor toolbar ends with "Session | One-Shot" and "Ledgerly Q4 review (6) ⌄".
- One-Shot's Copy closes the editor, as Add to Session does.
- Capture Scrolling scrolls the page by itself in the direct build.
- The notes column has more room above each heading and a hairline above References.
- Pasting "#2492ff" into a hex field gives 2492ff. Beautify's custom backdrop has a hex field.
- The session window opens at 90 % of the screen and keeps the size the owner gives it.

## Ask Map

| Ask | Status   | Where answered                                                                                        | Reason if set aside |
| --- | -------- | ----------------------------------------------------------------------------------------------------- | ------------------- |
| A1  | answered | interaction.md: Capture bar (Esc), Scrolling control; screens.md: Capture bar                         | —                   |
| A2  | answered | interaction.md: Scrolling control; screens.md: Capture bar, Scrolling control                         | —                   |
| A3  | answered | interaction.md: Scrolling control (auto, manual); screens.md: Capture button                          | —                   |
| A4  | answered | ia.md: Global keys; interaction.md: Global keys; screens.md: Menu bar capture rows                    | —                   |
| A5  | answered | screens.md: Annotation colour palette, Beautify, Editor toolbar, Notes column                         | —                   |
| A6  | answered | screens.md: Editor toolbar, Capture bar (Record, Frame Rate), Countdown overlay; interaction.md: Copy | —                   |
| A7  | answered | screens.md: Notes column                                                                              | —                   |
| A8  | answered | interaction.md: Recording control, Recording editor; screens.md: Session window                       | —                   |
| A9  | answered | screens.md: Session window, Layout                                                                    | —                   |
| A10 | answered | prototype/index.md; screens.md: Capture bar, Countdown overlay, Recording control                     | —                   |
| A11 | answered | interaction.md: Recording editor; screens.md: Recording editor                                        | —                   |
| A12 | answered | screens.md: Editor toolbar, Session pop-up                                                            | —                   |
| A13 | answered | all files; four milestones                                                                            | —                   |

## Answers

The owner answered five questions on 2026-10-26. The orchestrator set the rest to the recommended answer. Every answer is now in the spec.

| #   | Question                                                  | Answer                                                                                                                   | Source                                                                      |
| --- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| Q1  | What does ⌃⇧2 One-Shot capture?                           | macOS's overlay: drag an area (Space still picks a window). Then the editor opens in One-Shot.                           | owner, 2026-10-26: "Drag an area, then One-Shot (Recommended)"              |
| Q2  | When is the session "new" for ⌃⇧4?                        | Any New Session forgets the area. The next ⌃⇧4 asks for one. Switching sessions keeps it.                                | default, orchestrator 2026-10-26                                            |
| Q3  | Retire the bar's drawn hover label (WIN-2, EX-7)?         | Yes. Names and keys are on the bar.                                                                                      | default, orchestrator 2026-10-26                                            |
| Q4  | Which area does Record use?                               | Superseded by Q11: Record's picker opens on the last area.                                                               | default, orchestrator 2026-10-26                                            |
| Q5  | How many key frames at most?                              | 24 picked automatically. Marked frames always join on top.                                                               | default, orchestrator 2026-10-26                                            |
| Q6  | Does the pop-up always list Older Sessions…?              | Always, as picked.                                                                                                       | default, orchestrator 2026-10-26                                            |
| Q7  | ⌃⇧3: which display?                                       | Every display at once, like macOS ⇧⌘3: no picker, no bar, no choice. One screenshot per display, each in its own editor. | owner, 2026-10-26: "⌃⇧3 should just capture the full screen, like the mac." |
| Q8  | Do the bar's digits match the global ⌃⇧ digits?           | Yes: 1 New Area, 2 Window, 3 Full Screen, 4 Last Area, 5 Scrolling, 6 Record.                                            | owner, 2026-10-26: "Yes, match (Recommended)"                               |
| Q9  | While recording, do plain ↩ and Esc stop and cancel?      | No. Done by the Done button, ⌃⇧5 or the menu bar icon. Cancel by the panel's ⓧ, into Discarded.                          | owner, 2026-10-26: "No, Done/⌃⇧5/menu icon (Recommended)"                   |
| Q10 | What does One-Shot copy for a recording?                  | The marked filmstrip PNG: "Copy Filmstrip". Copy GIF is in Copy or Save.                                                 | owner, 2026-10-26: "Marked filmstrip PNG (Recommended)"                     |
| Q11 | Does ⌃⇧1 only set the area, or set it and capture?        | Set and capture, named "Capture New Area…". Record's picker opens on the last area: ↩ keeps it, a drag replaces it.      | default, orchestrator 2026-10-26                                            |
| Q12 | Keep Show All Frames?                                     | Keep it, on ⇧⌘F, which never types a character.                                                                          | default, orchestrator 2026-10-26                                            |
| Q13 | Keep the bar's session pop-up, though it is not bar-only? | Keep it. Its tooltip says "Current session".                                                                             | default, orchestrator 2026-10-26                                            |

Q8 adds Full Screen as bar mode 3, so the bar's digits match ⌃⇧1, ⌃⇧3 and ⌃⇧4. macOS's own bar has Entire Screen too.

No question is open.
