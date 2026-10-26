---
linear: none
type: facts
change: 2026-10-26-interaction-guide-polish
design: docs/designs/2026-10-25-adr-capture-bar-and-settings-window.md
author: Claude (orchestrator)
status: approved
reviewed_by: Calvin Dudek
approved_at: 2026-10-26
created: 2026-10-26
---

# Facts: interaction guide, capture bar label and keys, General comment

## Goal

Snapmark has one short interaction guide based on the Laws of UX, and the owner accepts it rule by rule. The capture bar names each icon and its key in a label above the bar, and keys 1–4 pick a mode. The editor heads its top box "General comment", and its reference notes stand 12 pt apart. The words and layouts are in [spec/screens.md](spec/screens.md).

## Acceptance criteria

The system is Snapmark. Unit facts are plain-Node assert blocks in `test/*.test.ts`, one block per fact, headed by a comment naming it (`// F9 …`). Smoke checks in `test/smoke.ts` are keyed strings. Every check runs once for the milestone (`verify_gate.py milestone`, which includes `smoke:background`), and CI runs them again on the milestone PR. Nothing runs per feature.

### Interaction guide

- [ ] **F1** (A5) `docs/ux/interaction-guidelines.md` shall hold the guide in at most 400 lines. It shall have a "How Snapmark should feel" section, rules per area and an Exceptions section. The areas are Capture, Editing, Notes, Keys, Feedback, Windows, Words and Accessibility. Screen/state: the guide file. Tag: unit `test/guide.test.ts` `// F1 the guide has its sections and fits 400 lines`.
- [ ] **F2** (A5) Every rule in the guide shall have an id, a status and a why. The why shall name a Law of UX from the kit's list. Screen/state: the guide file. Tag: unit `test/guide.test.ts` `// F2 every rule has an id, a status and a law`.
- [ ] **F3** (A5) The rules the owner accepts at the plan gate shall read `accepted` in the guide, and the rest `proposed`. Screen/state: the guide file. Tag: unit `test/guide.test.ts` `// F3 accepted rules match decisions.json guideAccepted`.
- [ ] **F4** (A5) The v0.9.0 proposal shall move to `docs/ux/audits/`. Every link to it shall resolve. Screen/state: docs. Tag: unit `tests/sdlc.test.ts` link check (existing).

### Capture bar label

- [ ] **F5** (A1, A2) When the pointer rests on a bar button for 300 ms, Snapmark shall show that button's label from the Words table. The label shall stand centred over the button, 8 pt above the bar. Screen/state: capture bar, pointer on Capture Window. Tag: smoke `viewer['F5 the label names the button under the pointer']`.
- [ ] **F6** (A1, A2) When focus moves by a key, Snapmark shall show the focused button's label. The bar opening shall show none. Screen/state: capture bar, after → and after opening. Tag: smoke `viewer['F6 the label follows the keyboard, not the opening']`.
- [ ] **F7** (A2) While the pointer rests on the label, the label shall stay. When the pointer leaves the bar and the label, or the bar captures or closes, the label shall be gone. Screen/state: capture bar, pointer on the label, after Esc and after capture. Tag: smoke `viewer['F7 the label goes with the pointer and the bar']`.
- [ ] **F8** (A1) The label window shall let clicks pass through, never take focus, and be content-protected. It shall float at the bar's level on every Space. Screen/state: capture bar, label shown. Tag: smoke `viewer['F8 the label is part of the bar, never in a capture']`.

### Capture bar keys

- [ ] **F9** (A1, A2) When 1, 2, 3 or 4 is pressed in the bar, Snapmark shall choose that mode and move focus to it. The modes in order are Capture Window, Choose New Area, Capture Last Area and Capture Scrolling. A number shall never capture. Screen/state: capture bar. Tag: smoke `viewer['F9 keys 1-4 choose a mode and never capture']`.
- [ ] **F10** (A1, A2) Each bar button shall carry `aria-keyshortcuts` as the Words table gives, and keep its `aria-label` as today. Screen/state: capture bar. Tag: smoke `viewer['F10 every bar button announces its key']`.
- [ ] **F11** (A2) The Keyboard Shortcuts window's Capture bar group shall list `1–4` "Pick a mode" first. Screen/state: Keyboard Shortcuts window. Tag: unit `test/keys.test.ts` `// F11 the capture bar group lists 1-4`.

### Editor notes column

- [ ] **F12** (A3, A4) In a session's editor, a heading "General comment" shall stand over the top box. The box's placeholder shall be "About the whole screenshot…". Its editable element's computed accessible name shall be "General comment". "General comment" and "References" shall be `h2` headings. In one-shot mode the heading shall be hidden with the box. Screen/state: editor, session and one-shot. Tag: smoke `r['F12 the top box is headed General comment']`.
- [ ] **F13** (A3, A4) Each reference note's placeholder shall be "What about <n>?". Its editable element's computed accessible name shall be "Note for reference <n>". Screen/state: editor, two references. Tag: smoke `r['F13 a note asks What about n']`.
- [ ] **F14** (A3) Reference rows shall stand 12 pt apart, within 1 pt. Screen/state: editor, three references. Tag: smoke `r['F14 notes stand 12 pt apart']`.
- [ ] **N1** (A3) Saving shall write the comment and notes to session.md as today. Screen/state: session.md. Tag: unit `test/sessions.test.ts` (existing entry tests, unchanged).

### Release

- [ ] **F15** (A1, A3, A5) The release built from this milestone shall be signed, pass Gatekeeper, and be installed for the owner from its release ZIP. Screen/state: `/Applications/Snapmark.app`. Tag: manual, `validation.md` row with the codesign and spctl output.

## Verification

- **Automated, once:** `python3 scripts/verify_gate.py milestone 2026-10-26-interaction-guide-polish` runs format, lint, typecheck, unit tests and `smoke:background`. CI runs smoke on the milestone PR, and the Release workflow runs it on macOS.
- **Validation, once:** every fact and ask gets a row in `validation.md`: expected, observed, evidence, verdict.
- **Manual:** the label over a full-screen app and with VoiceOver; the owner checks these on the installed release, quoted in `validation.md`.

## Out of scope

- The colour of Remove and Highlight marks and the swatch (A6; owner: "ignore, its already implemented").
- ⌘↩ as a capture key: ↩ already captures, and the owner named it only as an example (A1).
- Labels on other windows' icon buttons: the guide's rule covers them; they follow in later changes.
- Selling (snap-bmr.7).

## Open questions

Non-blocking, each with its default: `questions.md`.
