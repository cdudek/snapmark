---
linear: none
type: intent
change: 2026-10-25-tall-capture-tiles
design: docs/designs/2026-10-25-adr-tall-screenshots-saved-as-parts.md
author: Claude (orchestrator)
status: approved
reviewed_by: Calvin Dudek
approved_at: 2026-10-25
created: 2026-10-25
---

# Intent: tall captures as tiles

> A tall scrolling capture reaches the AI agent at full width, so it can read the page and the marks on it, as it can for any normal screenshot.

## Asks

Every request that this change answers, in the asker's own words. Never paraphrased.

| #   | Date       | Source                                          | Words                                                                                                                                | Screen           | Resources                                  |
| --- | ---------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ---------------- | ------------------------------------------ |
| A1  | 2026-10-24 | beads snap-bmr.10 (found by the M3 build agent) | "A 1280x8000 page arrives ~250px wide after the 1568px downscale. Split into tiles in session.md."                                   | session.md       | none                                       |
| A2  | 2026-10-25 | PR #61 body, limits (M3 scrolling capture)      | "a very tall page is shrunk to 1568 px for the AI like every screenshot, so it arrives narrow (tiles would be a follow-up)."         | session.md       | https://github.com/cdudek/snapmark/pull/61 |
| A3  | 2026-09-28 | owner, docs/ux/owner-words.md                   | "take a screenshot while scrolling down the area so we easily take a whole screenshot of everything and then concatenate it somehow" | Capture, session | none                                       |
| A4  | 2026-10-25 | owner, chat (dialog: what is next)              | "Tall captures as tiles"                                                                                                             | none             | none                                       |

## Job stories

| #   | When …                                                    | I want to …                                                                         | So I can …                                                       | Evidence          |
| --- | --------------------------------------------------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ----------------- |
| J1  | I save a scrolling capture of a long page into a session  | the agent to read the whole page at the width it was captured                       | it reads small text and layout as well as on a normal screenshot | reported — A1, A2 |
| J2  | I mark and note things far down a tall page               | every mark and its numbered note to stay clear and findable in what the agent reads | its feedback points at the right place                           | assumed — A1, A3  |
| J3  | I open the session window or Edit Again on a tall capture | it to stay one screenshot with one number, as it is today                           | the session, its numbering and editing work as they always did   | assumed — A3      |

## Success measure

Snapmark has no analytics, so the measure is read from a saved session.

- **Measure:** the width of every image session.md links for a saved 1280×8000 scrolling capture.
- **Read in:** the session folder, by a unit test and the CI smoke test.
- **Target:** at least 1000 px wide (today about 250 px), from the first release with this change.

## Problem

- **What is wrong or missing:** a saved tall capture is shrunk as a whole to Claude's image limit. An 8000 px page arrives about 250 px wide, and the agent cannot read its text.
- **Who feels it:** the owner, through the agent that reads session.md.
- **Evidence:** A1 and A2; `fitForAI` in src/main.ts scales the whole image by its longest edge.

## Proposed outcome

- A tall capture in session.md reads at about the width it was captured, top to bottom, in order.
- The agent can tell that the pieces are one screenshot, in which order, and where each note's number sits.
- Screenshots that already fit are saved exactly as today.
- In the session window, the numbering, Edit Again, Remove from Session, Save As, PDF and ZIP export still treat a tall capture as one screenshot.

## Affected users and systems

| Kind    | Name                                                | How                                                        |
| ------- | --------------------------------------------------- | ---------------------------------------------------------- |
| users   | the owner and the AI agent reading session.md       | a tall capture arrives readable                            |
| service | `src/main.ts` save path (`fitForAI`, `editor:save`) | a tall image is saved as tiles instead of one shrunk image |
| data    | session folder `img/` and `session.md` entries      | a tall entry links several images                          |

## Constraints

- **Must not change:** how a screenshot that fits the limits is saved. Entry numbers are never reused. Recognised text is stored once per entry.
- **Must hold:** Redact marks and auto-redact reach every tile, because tiles are cut from the flattened, redacted image.
- **Deadline:** none.
- **Rules that apply:** Claude's image limit: 1568 px on the long edge or about 1.15 megapixels (src/main.ts). `MAX_HEIGHT` is 20 000 px (src/stitch.ts).
- **Test rules:** never capture the owner's screen and never launch Electron windows locally. Smoke runs in CI, or once per milestone in the background.

## Open questions

None. The UX plan settles how tiles appear in session.md and the session window, and asks only if that needs the owner.
