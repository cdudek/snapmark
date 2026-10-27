---
linear: none
type: intent
change: 2026-10-27-calm-style
design: null
author: Claude (orchestrator)
status: approved
reviewed_by: Calvin Dudek
approved_at: 2026-10-27
created: 2026-10-27
---

# Intent: a calm Snapmark on the owner's design system

> Every window uses macOS's own colours, the owner's blue marks only the one main button, and nothing else shouts.

## Asks

Every request that this change answers, in the asker's own words. Never paraphrased.

| #   | Date       | Source             | Words                                                                                                                                                                                                                                                                                                                | Screen      | Resources                      |
| --- | ---------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ------------------------------ |
| A1  | 2026-10-27 | owner, chat        | "the design at the moment looks like shit. buttons with 2 rows e.g. Capture and second row the icon. the blue buttons in the ctrl + shift + 5 panel, which is also way to big in height and everything... can you migrate the design and everything to this system. https://github.com/cdudek/design-system-starter" | all         | none                           |
| A2  | 2026-10-27 | owner, chat        | "no the whole panel when perssing the ^5 shortcut should just stay in fucking system color not my colors. same for the app. just buttons etc. just buttons etc. should have my color I liked the original panel more without blue outline why does everything has a blue outline and stuff"                          | all         | none                           |
| A3  | 2026-10-27 | owner, chat        | "can we fucking revise the style. hero ui looks quite nice out of the box. the app should be calm. minimal design footprint. but obviously clear in and unmisunderstandably in its ui intentions"                                                                                                                    | all         | none                           |
| A4  | 2026-10-27 | owner, chat        | "latest design I saw in planatator is overdesigned"                                                                                                                                                                                                                                                                  | Capture bar | none                           |
| A5  | 2026-10-27 | owner, plannotator | Approved the direction: one-row bar, system surfaces, one blue button, no outlines, shortcuts in tooltips.                                                                                                                                                                                                           | all         | direction doc, mock of the bar |
| A6  | 2026-10-27 | owner, dialog      | "One change, 3 milestones (Recommended)"; "Ship them after milestone 1 (Recommended)"                                                                                                                                                                                                                                | all         | none                           |
| A7  | 2026-10-27 | owner, chat        | "can you update the design system here?" "I mean the repo that i shared"                                                                                                                                                                                                                                             | none        | design-system-starter          |

## Job stories

| #   | When …                    | I want to …                                              | So I can …                             | Evidence         |
| --- | ------------------------- | -------------------------------------------------------- | -------------------------------------- | ---------------- |
| J1  | I press ⌃⇧5               | see a small one-row bar in macOS colours                 | pick a mode without a wall of blue     | observed, A1, A2 |
| J2  | any Snapmark window opens | see exactly one blue button: the thing that happens next | know what to press without reading     | observed, A2, A3 |
| J3  | I use the app every day   | have it look calm and native, like the rest of my Mac    | stop noticing the tool and do the work | reported, A3, A4 |
| J4  | I move with Tab           | see where focus is, and only then                        | use the keyboard without rings on open | observed, A2     |

## Success measure

- **Measure:** the owner reviews every window after each milestone and marks none as loud or overdesigned. **Read in:** the milestone's screenshot review in plannotator. **Target:** zero such marks by the end of milestone 3.

## Problem

- **What is wrong or missing:** the capture bar is 2 rows and about 135 pt tall. Blue is hard-coded in 6 windows: chosen modes, labels, tabs and focus rings, besides the main button. A blue ring shows when a window opens. Controls sit in bordered boxes, and each button stacks its shortcut under its name.
- **Who feels it:** the owner, every capture.
- **Evidence:** A1–A4, and the 2026-10-27 screenshot audit (117 findings).

## Proposed outcome

- Every window is built on design-system-starter tokens, with system colours for surfaces and text.
- The owner's blue fills one button per window, and nothing else is blue.
- No outlines or bordered boxes. The chosen option is a soft grey pill.
- Focus rings show only on keyboard navigation, in macOS's focus colour.
- The capture bar is one row, about 48 pt. Shortcuts move into tooltips and menus; only ↩ stays on the main button.
- Picked-designs milestones 3 and 4 (GIF recording, auto-scroll) ship in this style after milestone 1.

## Affected users and systems

| Kind    | Name                  | How                                                      |
| ------- | --------------------- | -------------------------------------------------------- |
| users   | the owner             | every window looks different; no behaviour changes       |
| service | `snapmark-app/src/`   | every `.html` window's styles; the bar's layout and size |
| repo    | design-system-starter | its tokens and docs carry the calm rules first           |

## Constraints

- **Must not change:** what any control does, the keys, the annotation colours, and the session data.
- **Deadline:** none.
- **Rules that apply:** the owner's style rule of 2026-10-27; design-system-starter's tokens once its calm update merges; no new dependency.

## Open questions

None. The direction doc settled them on 2026-10-27.
