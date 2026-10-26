---
linear: none
type: intent
change: 2026-10-26-picked-designs
design: null
author: Claude (orchestrator)
status: approved
reviewed_by: Calvin Dudek
approved_at: 2026-10-26
created: 2026-10-26
---

# Intent: the capture bar, editor and recording the owner picked on 2026-10-26

> Capturing works the way macOS screenshots do and says what happens next, the editor shows where a screenshot goes, and Snapmark records short GIFs that an AI can read.

## Asks

Every request that this change answers, in the asker's own words. Never paraphrased.

| #   | Date       | Source                         | Words                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Screen                                    | Resources                                                                      |
| --- | ---------- | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------ |
| A1  | 2026-10-26 | owner, chat                    | "Okay I just tried the escape while in Shift-Control-5 and it didn't work. It basically interrupted the session. Also for the scrolling capture, is there a prerequisite that you selected something before? Because I just tried it in the browser and I clicked on it, nothing happened"                                                                                                                                                                                                                                                                     | Capture bar                               | none                                                                           |
| A2  | 2026-10-26 | owner, chat, with a screenshot | "It should automatically scroll. Everything up to the point where I had to select the scrolling area was actually good. … This capture: why is the button not blue? Technically the starting combination, I would say Command and Enter on the capture symbol, similar to the other buttons, would make it clearer because I didn't understand that I had to press capture."                                                                                                                                                                                   | Capture bar, Capture Scrolling            | none                                                                           |
| A3  | 2026-10-26 | owner, dialog                  | "Auto with manual fallback"; "Blue Capture + ↩ keycap"                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Capture bar, Capture Scrolling            | none                                                                           |
| A4  | 2026-10-26 | owner, chat                    | "also capture modes should be more like following mac defaults. also I wonder where do I to the non-session mode? it's developed but I can't see it." "Ctrl + Shift + 1 => Set new Area / Ctrl + Shift + 3 => full screen capture / Ctrl + Shift + 4 => if no area set / new session, set area first, if area set just capture selected area. / Ctrl + Shift + 5 => as is"                                                                                                                                                                                     | Global keys, menu                         | none                                                                           |
| A5  | 2026-10-26 | owner, chat, with a screenshot | "In the custom colour selector I think it would be helpful to also have the hex code there. When I paste the hex code with the # it doesn't remove the # but it should when I paste it. … Whether there is a tab in the sidebar to change between single-shot mode and session mode or something. Also I still feel the padding is not quite right here, the vertical padding specifically"                                                                                                                                                                    | Editor                                    | none                                                                           |
| A6  | 2026-10-26 | owner, dialog                  | "found it, i would wish similar to add to session that the window closes after copying it in one shot. I think overall there should be a tab though for one shot vs. session. and I should be able to start a new session or select an old session from the window. … it would be nice if we could capture GIFs for animations … If we press Shift + Control + 5 then we can have a timer. There should be a countdown, by the way, a nice little countdown. There should also be the frames per second for the GIF with a maximum of 15, down to 5, 4, or 2." | Editor, capture bar, Record               | none                                                                           |
| A7  | 2026-10-26 | owner, dialog                  | "Around the headings, and I think there should be light dividers between general comment and references?"                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Editor, notes column                      | none                                                                           |
| A8  | 2026-10-26 | owner, dialog                  | "Filmstrip + GIF (Recommended)"; "30 s cap (Recommended)"                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Record                                    | none                                                                           |
| A9  | 2026-10-26 | owner, chat                    | "The window size of the screen should also be saved. If I change the window size, I make it bigger or whatever, it should be saved by default. It should be 90%."                                                                                                                                                                                                                                                                                                                                                                                              | Session window                            | none                                                                           |
| A10 | 2026-10-26 | owner, design round 1          | "I like 'One clear next move' most. but I don't like '5-editor--session' nor the one '6-editor--one-shot'. keep the current one shot tab-menu as is design wise."                                                                                                                                                                                                                                                                                                                                                                                              | Capture bar, countdown, recording control | [round 1](../../design-explorations/2026-10-26-capture-workflow/feedback.md)   |
| A11 | 2026-10-26 | owner, recording review        | "keyframes only, I gues we can strip away images based on the identical hash or something? also when playing it keeps the timing?"                                                                                                                                                                                                                                                                                                                                                                                                                             | Record review                             | [recording](../../design-explorations/2026-10-26-recording-review/feedback.md) |
| A12 | 2026-10-26 | owner, editor round 2          | "Toolbar Mode and Scheme Pop-up"                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Editor toolbar                            | [editor](../../design-explorations/2026-10-26-editor-target/feedback.md)       |
| A13 | 2026-10-26 | owner, chat                    | "Once you're done with the mono repo can you implement the recording thing? Also I see that the new design that we set out is also not implemented so can you make sure that this all gets done?"                                                                                                                                                                                                                                                                                                                                                              | all                                       | none                                                                           |

## Job stories

| #   | When …                                       | I want to …                                                                       | So I can …                                                | Evidence              |
| --- | -------------------------------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------- | --------------------- |
| J1  | the capture bar is open and I change my mind | press Esc and have the bar close                                                  | go back to my work without breaking anything              | observed, A1          |
| J2  | I pick a mode in the capture bar             | see which mode is chosen and that Capture or ↩ starts it                          | capture without guessing                                  | observed, A2, A3      |
| J3  | I capture from the keyboard                  | use ⌃⇧1, 3, 4, 5 the way macOS uses ⇧⌘ plus the digits                            | not learn a second set of keys                            | reported, A4          |
| J4  | I mark up a screenshot                       | see and change whether it goes to a session or One-Shot, and which session        | send it to the right place without the menu bar           | reported, A5, A6, A12 |
| J5  | a bug only shows while something moves       | record a short GIF at a frame rate I choose, after a countdown                    | show the AI the motion, not just one frame                | reported, A6, A8      |
| J6  | the AI reads a recording                     | get only the frames where something changed, with their times                     | let it see what happened without 32 near-identical frames | reported, A11         |
| J7  | I capture a page longer than the screen      | have Snapmark scroll it for me, and scroll myself when it cannot                  | capture long pages in one go                              | observed, A2, A3      |
| J8  | I write notes or set a colour                | have room around the headings, a divider, and a hex field that takes a pasted `#` | read and set things without fiddling                      | reported, A5, A7      |

## Success measure

- **Measure:** of the owner's captures in the week after release, the share that ends in a saved screenshot or recording rather than a cancelled bar. **Read in:** the session folders (`session.md` entries) against the capture-bar opens in the app log. **Target:** at least 9 in 10 by 2026-11-09.

## Problem

- **What is wrong or missing:** Esc in the capture bar reaches the app behind it. The bar does not show what Capture does. One-Shot and session choice are hidden in menus. There is no way to record motion.
- **Who feels it:** the owner, every capture.
- **Evidence:** A1, A2, A5, A6.

## Proposed outcome

- Esc closes the capture bar; Capture is the one blue button, with its ↩ key.
- The global keys follow macOS's digits as A4 lists them, and One-Shot has its own key and menu item.
- The editor's toolbar shows Session or One-Shot and which session, and lets me pick an older one or start a new one.
- Snapmark records a GIF of an area, after a 3-2-1 countdown, at 15, 10, 5, 4 or 2 fps, for at most 30 s.
- The session gets the key frames as one filmstrip for the AI and the GIF for people, at its real speed.
- Capture Scrolling scrolls by itself, and falls back to my own scrolling.
- The notes column breathes, the hex field takes `#`, and the session window remembers its size.

## Affected users and systems

| Kind    | Name                | How                                                              |
| ------- | ------------------- | ---------------------------------------------------------------- |
| users   | the owner           | new keys, a clearer bar, a new Record mode, a new editor control |
| service | `snapmark-app/src/` | capture bar, keys, editor, session window, a recorder            |
| data    | session folders     | GIFs and filmstrip PNGs become session entries                   |

## Constraints

- **Must not change:** the One-Shot side panel's design (A10); annotation colours; ⌃⇧N for New Session (KEY-1).
- **Deadline:** none.
- **Rules that apply:** `docs/ux/interaction-guidelines.md` and the capture-bar ADR. Dependency changes are Ask-tier; a GIF encoder may need one. The App Store sandbox has no Accessibility, so auto-scroll is for the direct build.

## Open questions

1. Recording needs a GIF encoder. Answered 2026-10-26: "macOS ImageIO (Recommended)", no new dependency.
