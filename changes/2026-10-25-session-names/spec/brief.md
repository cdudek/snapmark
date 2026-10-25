# Brief

Change `2026-10-25-session-names`, size M. Asks from [intent.md](../intent.md).

## Owner Asks

| Ask | Source                  | Words                                                                                                                                                                      | Answered by                     |
| --- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| A1  | owner, chat, 2026-10-25 | "Write down that renaming a session would still keep the timestamp."                                                                                                       | J2; rename keeps the date stamp |
| A2  | owner, chat, 2026-10-25 | "This is not nice to read, really. I think it should be the year 2 or it should be the US format, like year, year, month, months, day, day, more like a readable version." | J1; display name                |
| A3  | owner, chat, 2026-10-25 | "Instead of "other session" it should show "older sessions" or "archive" more easily to make it nice."                                                                     | J3; "Older Sessions…"           |
| A4  | owner, chat, 2026-10-25 | "I think it should only show the last 10 sessions"                                                                                                                         | J3; 10 listed                   |
| A5  | owner, chat, 2026-10-25 | "put this in the backlog for the milestones"                                                                                                                               | set aside: process, not UI      |

Earlier briefs on the same screens, found in `docs/ux/` (all `proposed`, none accepted):

- glossary proposal 2026-09-28, row "session name (display)": proposed "28 Sep 14:32". The owner's A2 and the date decision of 2026-10-25 replace it.
- interaction guidelines 2026-09-28, "no search in the menu (twenty recent sessions plus "Other Session…" is enough)". A3 and A4 replace the count and the label.
- interaction guidelines 2026-09-28, "sessions with their count and date ("Checkout review · 12 · 27 Sep")". Counts in the list are not asked now; the date part is answered by J2.

## Job Stories

| Job                                                                                                                                                       | Audience scene                 | Asks answered | Visible success                                                        |
| --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ | ------------- | ---------------------------------------------------------------------- |
| J1 When I open Switch Session after a week of reviews, I want to read each session's date at a glance, year first, so I can pick the right one.           | 1 Reviewing an overnight build | A2            | Switch Session reads "2026-10-24, 23:38", not "24 Oct 23.38"           |
| J2 When I rename a session to say what it is about, I want the date to stay with the new name, so I can still sort and find it by when it happened.       | 1 Reviewing an overnight build | A1            | the renamed session reads "2026-10-24 · Ledgerly Q4 review" everywhere |
| J3 When I look for a session from last month, I want a short list of recent ones and one clear way to older ones, so I can avoid scanning twenty entries. | 1 Reviewing an overnight build | A3, A4        | Switch Session shows 10 sessions, then "Older Sessions…"               |

## Appetite

Size: M

## No-Gos

| No-go                                      | Source                            | Reason                                                              |
| ------------------------------------------ | --------------------------------- | ------------------------------------------------------------------- |
| Bulk-renaming existing session folders     | intent.md Constraints             | the owner's real sessions; a rename on start-up could lose a folder |
| Changing how sessions open, sort or export | intent.md Constraints             | existing sessions must keep working                                 |
| A colon in any file or folder name         | macOS: Finder shows ":" as "/"    | the display form "23:38" stays on screens only                      |
| A search or filter in the menu             | interaction guidelines (proposed) | not asked; Older Sessions… is the way to the rest                   |
| A Snapmark-made picker for older sessions  | intent.md (same action as today)  | A3 asks for a clearer label, not a new screen                       |

## Visible Success

The owner opens Session ▸ Switch Session and sees ten rows that start with a year-first date, then "Older Sessions…". They rename today's session to "Ledgerly Q4 review" and see "2026-10-24 · Ledgerly Q4 review" in the menu, the session window header, the editor toolbar and the PDF title.

## Ask Map

| Ask | Status    | Where answered                                                        | Reason if set aside                                                  |
| --- | --------- | --------------------------------------------------------------------- | -------------------------------------------------------------------- |
| A1  | answered  | screens.md: Session window, Rename Session… dialog; facts F7–F12, N2  |                                                                      |
| A2  | answered  | screens.md: every screen; facts F1–F6, N1                             |                                                                      |
| A3  | answered  | screens.md: Menu ▸ Session ▸ Switch Session; facts F15, F18           |                                                                      |
| A4  | answered  | screens.md: Menu ▸ Session ▸ Switch Session; facts F13, F14, F16, F17 |                                                                      |
| A5  | set aside | facts.md Out of scope                                                 | it asked to file this work in the backlog, which Stage 1 already did |

## Open Questions

| Question                                             | Recommended answer                                                                                                | Why it matters                                                       |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| What does a session renamed before this change show? | its name only, no date: the folder holds no stamp, and a folder date is wrong after a sync (iCloud, Google Drive) | a wrong date is worse than none; decided in the ADR, gate can change |
| Does a named session show its time too?              | no: "2026-10-24 · Ledgerly Q4 review", the owner's own example                                                    | the time is still in the folder name and the session.md entries      |
