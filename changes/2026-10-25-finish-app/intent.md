---
linear: none
type: intent
change: 2026-10-25-finish-app
design: docs/designs/2026-10-25-adr-tall-screenshots-saved-as-parts.md
author: Claude (orchestrator)
status: approved
reviewed_by: Calvin Dudek
approved_at: 2026-10-25
created: 2026-10-25
---

# Intent: finish Snapmark, everything but selling

> Snapmark looks and works the way the approved designs promised, captures from an on-screen bar like macOS's own, and has a proper Settings window, so that the only work left before launch is selling it.

This change replaces the earlier tiles-only intent. The owner asked for everything at once (A12), so tall captures as tiles (A1–A4) are one milestone of it. It is delivered in one go: one goal, four milestones, one release each.

## Asks

Every request that this change answers, in the asker's own words. Never paraphrased.

| #   | Date       | Source                                          | Words                                                                                                                                                                                                         | Screen              | Resources                                                                                                                                                                                 |
| --- | ---------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A1  | 2026-10-24 | beads snap-bmr.10 (found by the M3 build agent) | "A 1280x8000 page arrives ~250px wide after the 1568px downscale. Split into tiles in session.md."                                                                                                            | session.md          | none                                                                                                                                                                                      |
| A2  | 2026-10-25 | PR #61 body, limits (M3 scrolling capture)      | "a very tall page is shrunk to 1568 px for the AI like every screenshot, so it arrives narrow (tiles would be a follow-up)."                                                                                  | session.md          | https://github.com/cdudek/snapmark/pull/61                                                                                                                                                |
| A3  | 2026-09-28 | owner, docs/ux/owner-words.md                   | "take a screenshot while scrolling down the area so we easily take a whole screenshot of everything and then concatenate it somehow"                                                                          | Capture, session    | none                                                                                                                                                                                      |
| A4  | 2026-10-25 | owner, chat (dialog: what is next)              | "Tall captures as tiles"                                                                                                                                                                                      | none                | none                                                                                                                                                                                      |
| A5  | 2026-10-25 | owner, chat, with three screenshots             | "Can we have it more like this, with a menu on the screen?"                                                                                                                                                   | Capture             | [today's menu](asks/2026-10-25-chat/current-capture-menu.png), [macOS bar](asks/2026-10-25-chat/macos-capture-bar.png), [its Options](asks/2026-10-25-chat/macos-capture-bar-options.png) |
| A6  | 2026-10-25 | owner, chat                                     | "If not it might be worthwhile upgrading it to Electron so we can have proper settings and everything."                                                                                                       | Settings            | none                                                                                                                                                                                      |
| A7  | 2026-10-25 | owner, chat                                     | "I want the proper UI that we were promised, which is not there yet."                                                                                                                                         | Editor, all windows | design-explorations/2026-10-25-native-round-2/, design-explorations/2026-10-24-brand-refresh/                                                                                             |
| A8  | 2026-10-25 | owner, chat                                     | "The shortcuts are not getting shown in the icon things. It still just has one."                                                                                                                              | Editor toolbar      | none                                                                                                                                                                                      |
| A9  | 2026-10-25 | owner, chat                                     | "The icons overall are quite small so it's quite hard to understand what's going on."                                                                                                                         | Editor toolbar      | none                                                                                                                                                                                      |
| A10 | 2026-10-25 | owner, chat                                     | "I think the highlight, the yellow highlighting thing, is not working. The darken thing, the highlight with the darken thing, is working but not the other stuff."                                            | Editor canvas       | none                                                                                                                                                                                      |
| A11 | 2026-10-25 | owner, chat                                     | "We also need some on-screen text function. Maybe, maybe not. Maybe let's leave the on-text screen away and all the other stuff"                                                                              | none                | none                                                                                                                                                                                      |
| A12 | 2026-10-25 | owner, chat                                     | "I want you to fucking finish this up to the point where everything but the commercialization stuff is happening (like licencing and all the stuff). I want the application to basically be pretty much done" | all                 | none                                                                                                                                                                                      |
| A13 | 2026-10-25 | beads, open and not about selling               | snap-bmr.11, snap-bmr.12, snap-bmr.15, snap-bmr.16.1, snap-bmr.17.2, snap-bmr.17.3, snap-bmr.14.3, snap-ua7, snap-c5c, snap-p7t (each issue's own words)                                                      | as each names       | `bd show <id>`                                                                                                                                                                            |

## Job stories

| #   | When …                                                    | I want to …                                                                         | So I can …                                                       | Evidence               |
| --- | --------------------------------------------------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ---------------------- |
| J1  | I save a scrolling capture of a long page into a session  | the agent to read the whole page at the width it was captured                       | it reads small text and layout as well as on a normal screenshot | reported — A1, A2      |
| J2  | I mark and note things far down a tall page               | every mark and its numbered note to stay clear and findable in what the agent reads | its feedback points at the right place                           | assumed — A1, A3       |
| J3  | I open the session window or Edit Again on a tall capture | it to stay one screenshot with one number, as it is today                           | the session, its numbering and editing work as they always did   | assumed — A3           |
| J4  | I want to capture something                               | to pick the kind of capture from a bar on the screen, as with macOS's own tool      | I see every option at once instead of hunting in a menu          | reported — A5          |
| J5  | I want to change how Snapmark behaves                     | one Settings window with everything in it                                           | I find and change settings like in any Mac app                   | reported — A6          |
| J6  | I annotate a screenshot                                   | to see big, clear tools with their keys, and every tool to work on any background   | I work fast and trust what I draw                                | reported — A8, A9, A10 |
| J7  | I use any Snapmark window                                 | it to look like the designs I approved                                              | the app feels finished and is ready to sell                      | reported — A7, A12     |

## Success measure

Snapmark has no analytics, so the measure is the owner's own check after the last release.

- **Measure:** every ask A1–A10 and A13 has a `met` row in `validation.md`. Also, the owner, using the installed release, names no screen that still looks unlike the approved designs.
- **Read in:** `changes/2026-10-25-finish-app/validation.md` and the owner's reply after install.
- **Target:** all rows `met`; no screen named. Tall captures: every image session.md links for a 1280×8000 capture is at least 1000 px wide (today about 250 px).

## Problem

- **What is wrong or missing:** the editor's highlighter cannot be seen on dark screens. Toolbar keys and icons are small and partly wrong. Several parts of the approved designs were never built. Capture starts only from a menu, and settings live in a submenu. A tall capture reaches the agent about 250 px wide.
- **Who feels it:** the owner every day, and every future buyer.
- **Evidence:** A5–A10; the gap audit and bug trace of 2026-10-25 (Highlighter: multiply blend at src/editor.ts:102-107, audit F054; keycaps: src/editor.ts:361-371; promised-but-missing list in the plan). For tiles: A1, A2.

## Proposed outcome

- Milestone 1, editor: the Highlighter shows on any background; bigger tools whose keys read right in both key modes. Also: the approved toolbar details; the open non-selling bugs fixed.
- Milestone 2, capture and settings: a capture bar like ⌘⇧5; a Settings window; the Keyboard Shortcuts window as designed.
- Milestone 3, tall captures as tiles, as already specified.
- Milestone 4, upkeep: Electron 45 and the held-back dependency updates.
- Each milestone is released and installable the day it merges.

## Affected users and systems

| Kind    | Name                                                                               | How                                                     |
| ------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------- |
| users   | the owner, later every buyer                                                       | every window changes look or behaviour                  |
| service | `src/main.ts`, `src/menu.ts`, `src/editor.*`, new capture bar and Settings windows | new windows, new menu items, toolbar and canvas changes |
| data    | session folders, settings file                                                     | tiles on save; settings move to one window, values kept |

## Constraints

- **Must not change:** saved sessions open as before; existing shortcuts keep working; screenshots that fit the limits save byte for byte as today.
- **Out of scope:** licensing, payment, trial, App Store (snap-bmr.7, .8, .13), and an on-screen text tool (A11).
- **Rules that apply:** the approved mocks in `design-explorations/`; the ADRs in `docs/designs/INDEX.md`; `docs/ux/interaction-guidelines.md`.
- **Test rules:** never capture the owner's screen and never launch Electron windows locally. Smoke runs in CI, and locally once per milestone in the background.
- **Delivery:** one goal; no checks per feature, checks and validation once per milestone; open questions go to `questions.md` and never block.

## Open questions

Non-blocking; each has a default in `questions.md` and the build goes on.
