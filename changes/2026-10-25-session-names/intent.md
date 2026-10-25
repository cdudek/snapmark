---
linear: none
type: intent
change: 2026-10-25-session-names
design: docs/designs/2026-09-26-adr-menu-rebuilt-from-the-2026-09.md
author: Calvin Dudek
status: approved
reviewed_by: Calvin Dudek
approved_at: 2026-10-25
created: 2026-10-25
---

# Intent: Session names that read well and keep their date

> The owner can tell sessions apart at a glance by a readable date, renamed sessions keep that date, and Switch Session shows only what is recent.

## Asks

| #   | Date       | Source                                     | Words                                                                                                                                                                      | Screen                               | Resources |
| --- | ---------- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ | --------- |
| A1  | 2026-10-25 | owner, chat, with a screenshot of the menu | "Write down that renaming a session would still keep the timestamp."                                                                                                       | menu ▸ Session, session window title | none      |
| A2  | 2026-10-25 | owner, chat                                | "This is not nice to read, really. I think it should be the year 2 or it should be the US format, like year, year, month, months, day, day, more like a readable version." | menu, session window, editor toolbar | none      |
| A3  | 2026-10-25 | owner, chat                                | "Instead of "other session" it should show "older sessions" or "archive" more easily to make it nice."                                                                     | menu ▸ Session ▸ Switch Session      | none      |
| A4  | 2026-10-25 | owner, chat                                | "I think it should only show the last 10 sessions"                                                                                                                         | menu ▸ Session ▸ Switch Session      | none      |
| A5  | 2026-10-25 | owner, chat                                | "put this in the backlog for the milestones"                                                                                                                               | none                                 | none      |

## Job stories

| #   | When …                                        | I want to …                                                 | So I can …                                             | Evidence          |
| --- | --------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------ | ----------------- |
| J1  | I open Switch Session after a week of reviews | to read each session's date at a glance, year first         | pick the right one without decoding "2026-10-24 23.38" | reported — A2     |
| J2  | I rename a session to say what it is about    | the date to stay with the new name                          | still sort and find it by when it happened             | reported — A1     |
| J3  | I look for a session from last month          | a short list of recent ones and one clear way to older ones | not scan twenty entries                                | reported — A3, A4 |

## Success measure

Snapmark has no analytics, so the measure is the owner's own check after install.

- **Measure:** owner complaints about session names or the switch list.
- **Read in:** docs/ux/owner-words.md.
- **Target:** none in the first week after release.

## Problem

- **What is wrong or missing:** session dates read "24 Oct 23.38". A rename drops the date. Switch Session lists 20.
- **Who feels it:** the owner, every time they switch or rename a session.
- **Evidence:** A1–A4, with the owner's menu screenshot of 2026-10-25.

## Proposed outcome

- Session dates read year first with a normal clock time, e.g. "2026-10-24, 23:38", everywhere a session is named.
- A renamed session keeps its date, e.g. "2026-10-24 · Ledgerly Q4 review".
- Switch Session lists the 10 most recently used sessions, then "Older Sessions…".

## Affected users and systems

| Kind    | Name                                      | How                                                                                     |
| ------- | ----------------------------------------- | --------------------------------------------------------------------------------------- |
| users   | the owner                                 | reads and renames sessions in the menu, the session window and the editor               |
| service | `src/sessions.ts`                         | display name, rename keeps the date                                                     |
| service | `src/menu.ts`                             | 10 listed, "Older Sessions…"                                                            |
| data    | session folders under the sessions folder | folder names of new and renamed sessions may change form; existing folders keep working |

## Constraints

- **Must not change:** existing sessions open, sort and export as before; no bulk folder renames; the session.md heading follows the folder name as today.
- **Deadline:** none
- **Rules that apply:** owner's words (docs/ux/owner-words.md); menu ADR 2026-09-26 "Menu labels name their object".

## Decisions at confirmation

1. Date format: "2026-10-24, 23:38" (owner, 2026-10-25).
2. Label: "Older Sessions…" (owner, 2026-10-25).

## Open questions

None. Both decisions are recorded above.
