---
linear: none
type: facts
change: 2026-10-25-session-names
design: docs/designs/2026-09-26-adr-menu-rebuilt-from-the-2026-09.md
author: Calvin Dudek
status: approved
reviewed_by: Calvin Dudek
approved_at: 2026-10-25
created: 2026-10-25
---

# Facts: Session names that read well and keep their date

## Goal

Every screen names a session by a year-first date, such as "2026-10-24, 23:38". A rename keeps that date in front of the new name. Switch Session lists the 10 most recently used sessions, then "Older Sessions…".

## Acceptance criteria

The system is Snapmark. "Display name" and "stamp" are defined in [spec/ia.md](spec/ia.md). Facts are proven by plain-Node unit tests in `test/*.test.ts`, one assert block per fact. Smoke checks in `test/smoke.ts` are keyed strings; CI runs them headless. A tag below names the test file and its block, or the smoke check key.

### Readable dates

- [ ] **F1** (A2) The system shall show a session whose folder is a bare stamp as "2026-10-24, 23:38", keeping a " (2)" suffix. Screen/state: menu header, Current Session line, Switch Session rows. Tag: `test/sessions.test.ts` › "F1 display name".
- [ ] **F2** (A2) The session window shall show the display name in its title bar and its header. Screen/state: session window, default. Tag: smoke `viewer['F2 the session window shows the readable date']`.
- [ ] **F3** (A2) The editor shall show the display name in its toolbar label and its window title. Screen/state: editor, empty and with screenshots. Tag: smoke `viewer['F3 an open editor shows the readable name']`.
- [ ] **F4** (A2) Every notification and dialog that names a session shall use its display name. Screen/state: notifications, Clear Sessions Older Than 60 Days…. Tag: manual, verifier.
- [ ] **F5** (A2) The PDF export shall show the display name as its first heading. Screen/state: PDF export. Tag: `test/exporter.test.ts` › "F5 PDF heading".
- [ ] **F6** (A2) Where a discarded item is 7 or more days old, the Discarded tab shall label it "2026-10-18, 09:41". Screen/state: session window, Discarded tab. Tag: `test/sessions.test.ts` › "F6 whenLabel".
- [ ] **F19** (A2) The first heading of `session.md` shall be the session's display name, written when the session is created and when it is renamed. Screen/state: session.md, Document tab. Tag: `test/sessions.test.ts` › "F19 heading". (Owner at the plan gate, 2026-10-25: "Readable name".)
- [ ] **N1** (A2) The system shall never write a colon into a file or folder name. Tag: `test/sessions.test.ts` › "N1 no colon".

<details>
<summary>Verification</summary>

- F1 — `test/sessions.test.ts`: `shortName('2026-10-24 23.38')` is "2026-10-24, 23:38"; with " (2)" it is "2026-10-24, 23:38 (2)".
- F2 — smoke: a session made as `2026-10-24 23.38` opens with header "2026-10-24, 23:38" and title "2026-10-24, 23:38 — Snapmark".
- F3 — smoke: the editor on that session reads "2026-10-24, 23:38" and its title "Snapmark — 2026-10-24, 23:38".
- F4 — manual: the `omr-dev:verifier` reads every `notify(` and `showMessageBox` in `src/main.ts`; each session name goes through `sessions.shortName`.
- F5 — `test/exporter.test.ts`: `sessionHtml` of `2026-10-24 23.38 Ledgerly Q4 review` has `<h1>2026-10-24 · Ledgerly Q4 review</h1>`.
- F19 — `test/sessions.test.ts`: `create(root)` at 2026-10-24 23:38 writes `# 2026-10-24, 23:38`. After `rename(…, 'Ledgerly Q4 review')` the first line is `# 2026-10-24 · Ledgerly Q4 review`. The rest of `session.md` is unchanged.
- F6 — `test/sessions.test.ts`: `whenLabel` 7 days back reads "2026-10-18, 09:41"; Today, Yesterday and weekday labels unchanged.
- N1 — `test/sessions.test.ts`: names from `create()`, `rename()` and `saveAsName()` contain no ":"; Save As… suggests "2026-10-24 23.38 001.png".

</details>

### Rename keeps the date

- [ ] **F7** (A1) When the owner renames a stamped session, the system shall keep its stamp and " (2)" suffix before the new name. Screen/state: session window rename field, Rename Session… dialog. Tag: `test/sessions.test.ts` › "F7 rename keeps the stamp".
- [ ] **F8** (A1) The system shall show a named stamped session as "2026-10-24 · Ledgerly Q4 review". Screen/state: menu, session window, editor. Tag: smoke `viewer['F8 a renamed session keeps its date']`.
- [ ] **F9** (A1) When the rename field or dialog opens, it shall hold only the name part, empty for an unnamed session. Screen/state: rename field, editing. Tag: smoke `viewer['F9 the rename field holds only the name']`.
- [ ] **F10** (A1) If the typed name starts with a date, then the system shall still keep the session's own stamp. Screen/state: rename field. Tag: `test/sessions.test.ts` › "F10 typed date".
- [ ] **F11** (A1) When the owner saves an empty name on a named stamped session, the system shall rename it back to its bare stamp. Screen/state: rename field, name removed. Tag: `test/sessions.test.ts` › "F11 empty name".
- [ ] **F12** (A1) If a session's folder has no stamp, then the system shall show its folder name as its display name. Screen/state: every screen, legacy session. Tag: `test/sessions.test.ts` › "F12 no stamp".
- [ ] **N2** (A1) The system shall rename a session folder only when the owner renames that session. Tag: `test/sessions.test.ts` › "N2 old folders untouched".

<details>
<summary>Scenario — F7 and F10, where the stamp could be lost</summary>

```gherkin
Scenario: a same-minute session renamed with a typed date — proves F7, F10
  Given a session folder "2026-10-24 23.38 (2)"
  When  the owner renames it to "2026-10-25 Ledgerly"
  Then  the folder is "2026-10-24 23.38 (2) 2026-10-25 Ledgerly"
  And   it reads "2026-10-24 · 2026-10-25 Ledgerly"
```

</details>

<details>
<summary>Verification</summary>

- F7 — `test/sessions.test.ts`: `rename(root, '2026-10-24 23.38', 'Ledgerly Q4 review')` returns "2026-10-24 23.38 Ledgerly Q4 review"; the " (2)" case keeps its suffix.
- F8 — `test/sessions.test.ts` `shortName` case, and smoke: after the rename, the header reads "2026-10-24 · Ledgerly Q4 review".
- F9 — smoke: the field of `2026-10-24 23.38` opens empty; after the rename it opens with "Ledgerly Q4 review". The menu dialog: manual, verifier reads `renameFromMenu`.
- F10 — `test/sessions.test.ts`: the Gherkin scenario above.
- F11 — `test/sessions.test.ts`: `rename(root, '2026-10-24 23.38 Ledgerly Q4 review', '')` returns "2026-10-24 23.38".
- F12 — `test/sessions.test.ts`: `shortName('Checkout review')` is "Checkout review"; `rename(root, 'Checkout review', '')` is refused.
- N2 — `test/sessions.test.ts`: `list()`, `byLastUse()` and `shortName()` leave old folder names unchanged. `grep -n renameSync src/` shows only `rename()` and the discard moves.

</details>

### Switch Session

- [ ] **F13** (A4) The Switch Session submenu shall list at most 10 sessions, most recently used first. Screen/state: Switch Session, default. Tag: `test/menu.test.ts` › "F13 ten rows".
- [ ] **F14** (A4) While the current session is not among the 10 most recently used, Switch Session shall show it as the 10th row, ticked. Screen/state: Switch Session, current not recent. Tag: `test/menu.test.ts` › "F14 current listed".
- [ ] **F15** (A3) While more than 10 sessions exist, the last Switch Session item shall be "Older Sessions…", opening the session folder panel. Screen/state: Switch Session, default. Tag: `test/menu.test.ts` › "F15 Older Sessions".
- [ ] **F16** (A4) While 10 or fewer sessions exist, Switch Session shall show no "Older Sessions…" item. Screen/state: Switch Session, partial. Tag: `test/menu.test.ts` › "F16 no older".
- [ ] **F17** (A4) While no session exists, the menu shall show Switch Session greyed. Screen/state: Session ▸, empty. Tag: `test/menu.test.ts` › "F17 empty".
- [ ] **F18** (A3) When Older Sessions… opens the folder panel, the panel shall say "Session folders start with their date." Screen/state: folder panel. Tag: manual, verifier.

<details>
<summary>Verification</summary>

- F13 — `test/menu.test.ts`: 12 sessions give 10 checkbox rows in last-use order; `MAX_LISTED` is 10.
- F14 — `test/menu.test.ts`: a current session 12th by last use is the 10th row and checked.
- F15 — `test/menu.test.ts`: the last item's label is "Older Sessions…"; clicking it calls `otherSession`.
- F16 — `test/menu.test.ts`: with 3 sessions the labels hold no "Older Sessions…" and no separator.
- F17 — `test/menu.test.ts`: with none, the Switch Session item has `enabled: false`.
- F18 — manual: the verifier reads `otherSession()` in `src/main.ts` for `message: 'Session folders start with their date.'`.

</details>

## Verification

- **Automated:** `npm run format && npm run lint && npm run typecheck && npm test` exits 0. CI runs `npm run smoke` on every PR; the milestone runs `npm run smoke:background`.
- **Manual:** the owner installs the build and checks the menu, a rename and Switch Session on real sessions (intent success measure).

## Out of scope

- A5 — "put this in the backlog for the milestones": a process request, done in Stage 1 (Beads snap-bmr.14, milestone `session-names`).
- PDF and ZIP file names: they keep the folder name (no colon in file names).
- Rewriting the heading of `session.md` in sessions that are not renamed: only create and rename write it (N2).
- Bulk-renaming old folders, or inventing a date for folders with no stamp (ADR 2026-10-25).
- Sorting by anything but last use, a search in the menu, and counts in Switch Session rows.
- The window title order of the editor and the session window.

## Open questions

None open. The owner answered both on 2026-10-25. The heading is the readable name (F19). Stamp-less sessions show no date (F12).
