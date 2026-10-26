---
linear: none
type: intent
change: 2026-10-26-interaction-guide-polish
design: docs/designs/2026-10-25-adr-capture-bar-and-settings-window.md
author: Claude (orchestrator)
status: approved
reviewed_by: Calvin Dudek
approved_at: 2026-10-26
created: 2026-10-26
---

# Intent: one interaction guide, and the capture bar and comment box that follow it

> Snapmark has one short interaction guide, grounded in the Laws of UX, that says how the app should feel and behave. The capture bar and the editor's comment box are the first screens brought in line with it.

## Asks

Every request that this change answers, in the asker's own words. Never paraphrased.

| #   | Date       | Source                                                 | Words                                                                                                                                                                                                                     | Screen                 | Resources                                                                      |
| --- | ---------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- | ------------------------------------------------------------------------------ |
| A1  | 2026-10-26 | owner, chat, on the installed 0.21.1                   | "works now, but symbols are confusing, could use tooltips, shortcuts, e.g. escape button or enter or cmd plus enter or something"                                                                                        | Capture bar            | [the bar's key](asks/2026-10-26-chat/capture-bar-key.png)                      |
| A2  | 2026-10-26 | owner, dialog: how the bar explains its icons and keys | "Tooltip above the bar + keys (Recommended)"                                                                                                                                                                              | Capture bar            | none                                                                           |
| A3  | 2026-10-26 | owner, chat, with a screenshot of the editor           | "Can we leave more spacing between the different references and also make sure that the comment at the top has "global comment" or something like "in general"? It would be nice to have good UX writing.."            | Editor, notes column   | [comment and references](asks/2026-10-26-chat/comment-and-references.png)      |
| A4  | 2026-10-26 | owner, dialog: how the comment box and notes read      | "Heading 'General comment' (Recommended)"                                                                                                                                                                                 | Editor, notes column   | none                                                                           |
| A5  | 2026-10-26 | owner, dialog: which ticket                            | "can we have proper ux / ui interaction writing so its clear how the app generally should behave using laws of ux? generally thinking about how the app should feel and be used"                                         | all                    | none                                                                           |
| A6  | 2026-10-26 | owner, chat, with a screenshot of the editor           | "color of the drawings is not matching the selected color"                                                                                                                                                                | Editor canvas          | [Remove marks](asks/2026-10-26-chat/remove-marks-colour.png)                   |

A2 and A4 picked these options, as the dialogs worded them:

- A2: hovering over an icon, or moving to it with the arrows, shows a label above the bar, such as "Capture Window 1". New keys 1–4 pick a mode; ↩ captures and Esc closes, as now.
- A4: a heading "General comment" over the box, with the placeholder "About the whole screenshot…". Each note says "What about 1?", and there is 12 pt between notes where today they touch.

A6: the owner answered "ignore, its already implemented" when asked what the swatch should do, so it is out of scope.

## Job stories

| #   | When …                                              | I want to …                                                                  | So I can …                                          | Evidence           |
| --- | --------------------------------------------------- | ---------------------------------------------------------------------------- | --------------------------------------------------- | ------------------ |
| J1  | the capture bar is open and I don't know an icon    | to see its name and its key without clicking                                 | I pick the right capture the first time             | reported — A1, A2  |
| J2  | I use the capture bar often                         | to pick a mode and capture from the keyboard                                 | I capture without reaching for the mouse            | reported — A1, A2  |
| J3  | I write feedback in the editor                      | to see at once which box is about the whole screenshot and which about a mark | my notes land in the right place for the agent      | reported — A3, A4  |
| J4  | I scan a list of reference notes                    | each note to stand apart from its neighbours                                 | I find and edit the right note quickly              | reported — A3      |
| J5  | anyone, me or an agent, changes a Snapmark screen   | one short guide that says how Snapmark behaves and why                       | every screen feels like the same app                | reported — A5      |

## Success measure

Snapmark has no analytics, so the measure is the owner's own check on the release.

- **Measure:** every ask A1–A5 has a `met` row in `validation.md`. The owner accepts the interaction guide, and names no icon on the capture bar they can't identify.
- **Read in:** `changes/2026-10-26-interaction-guide-polish/validation.md` and the owner's reply after install.
- **Target:** all rows `met`; the guide's `status` is `accepted`; no icon named.

## Problem

- **What is wrong or missing:** the capture bar shows icons with no visible names or keys. Its tooltips exist but never appear, because the bar is a panel that macOS never makes active. The editor's top box reads "Add a comment…" with no hint that it covers the whole screenshot. The reference notes sit flush against each other. The interaction guidelines are 1,475 lines long and were written for v0.9.0. None of their rules has been accepted, so nothing tells a builder how the app should feel.
- **Who feels it:** the owner every day, every future buyer, and every agent that builds a screen.
- **Evidence:** A1, A3, A5. The bar's titles are in `src/bar.html` lines 105–139. "Note for" is in `src/editor.ts:989`. `docs/ux/interaction-guidelines.md` has `status: proposed — nothing here is accepted`.

## Proposed outcome

- A short interaction guide in `docs/ux/interaction-guidelines.md`, current to v0.21.1. It has a few principles for how Snapmark should feel, and rules per area: capture, editing, notes, keys, feedback, windows and words. Each rule cites the Law of UX behind it. The owner accepts it, rule by rule. The long v0.9.0 proposal moves to the audit folder it came from.
- The capture bar shows a label above it for the icon under the pointer or the keyboard focus: the name and its key. Keys 1–4 pick a mode. ↩ and Esc stay as they are.
- The editor's notes column gets a heading "General comment" with the placeholder "About the whole screenshot…". Each reference note reads "What about 1?", and there is 12 pt between notes.
- One milestone, one release, installed for the owner.

## Affected users and systems

| Kind    | Name                                                         | How                                                   |
| ------- | ------------------------------------------------------------ | ----------------------------------------------------- |
| users   | the owner, later every buyer                                 | the bar explains itself; the notes column reads clearly |
| service | `src/bar.html`, `src/bar.ts`, `src/main.ts`, `src/editor.*`, `src/keys.ts` | label above the bar, new keys, new words and spacing    |
| docs    | `docs/ux/interaction-guidelines.md`, `docs/ux/audits/`       | the guide is replaced by a short, accepted one        |

## Constraints

- **Must not change:** what a capture does; the bar's ← → ↩ Esc keys; saved sessions and their notes; the session.md format the agent reads.
- **Out of scope:** the colour of Remove and Highlight marks (A6, owner: "ignore, its already implemented"); selling (snap-bmr.7).
- **Rules that apply:** the Capture bar ADR; `docs/designs/INDEX.md`; the Laws of UX; the new guide once accepted.
- **Test rules:** never capture the owner's screen and never launch Electron windows locally. Smoke runs in CI, and locally once for the milestone in the background.
- **Delivery:** one goal, one milestone; checks and validation once; questions go to `questions.md` and never block.

## Open questions

None yet. Any that come up go to `questions.md` with the default taken.
