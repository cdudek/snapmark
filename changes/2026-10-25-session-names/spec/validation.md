---
type: validation
change: 2026-10-25-session-names
verdict: ready
status: draft
reviewed_by: null
approved_at: null
created: 2026-10-25
---

# Validation

## Verdict

ready, after one review pass and the author's fixes. The milestone process runs this once, with no loop (stages.md 2.5). The reviewer returned `not-ready` on one severity-3 finding and one contradiction, both about rename. Both were fixed in the spec the same day and not re-reviewed; the owner sees this at the plan gate.

## Definition Of Ready

| Check      | Result         | Evidence                                                                                              |
| ---------- | -------------- | ----------------------------------------------------------------------------------------------------- |
| Activities | pass           | brief, ia, interaction, screens, conformance written; prototype skipped with reason in decisions.json |
| Asks       | pass           | A1–A4 map to a job story, a screen and facts; A5 to Out of scope (table below)                        |
| Findings   | pass after fix | the one severity 3 is fixed in the spec; none at 4                                                    |
| Laws of UX | pass           | 30 rows below; the four failed checks are fixed or carried to plan.md Risks                           |
| Concerns   | pass           | conformance deliberate inconsistencies listed; one needs the owner (session.md heading)               |
| Questions  | pass           | each open question has a recommended answer                                                           |
| Prototype  | n/a            | skipped: UI not risky; no image was judged                                                            |

## Asks To Screens To Facts

| Ask | Job story | Screen                                                      | State                                       | Fact or out of scope  |
| --- | --------- | ----------------------------------------------------------- | ------------------------------------------- | --------------------- |
| A1  | J2        | session window rename field; Rename Session… dialog         | editing, saved, name removed                | F7–F12, N2            |
| A2  | J1        | menu, session window, editor, notifications, PDF, Discarded | default                                     | F1–F6, N1             |
| A3  | J3        | Session ▸ Switch Session ▸                                  | default (11+ sessions)                      | F15, F18              |
| A4  | J3        | Session ▸ Switch Session ▸                                  | default, partial, empty, current not recent | F13, F14, F16, F17    |
| A5  | none      | none                                                        | none                                        | facts.md Out of scope |

## Prototype Screenshots

| Screen | State             | 100 % | 150 % |
| ------ | ----------------- | ----- | ----- |
| none   | prototype skipped | n/a   | n/a   |

## Laws Of UX Coverage

| #   | Law                        | Verdict      | Failed checks | Evidence                                                                                       |
| --- | -------------------------- | ------------ | ------------- | ---------------------------------------------------------------------------------------------- |
| L1  | Aesthetic-Usability        | n/a          | –             | no build yet                                                                                   |
| L2  | Choice Overload            | fail → risk  | L2.4          | two same-day sessions with one name read alike; plan.md Risks                                  |
| L3  | Chunking                   | n/a          | –             | no multi-part information                                                                      |
| L4  | Cognitive Bias             | n/a          | –             | no consent, money or defaults                                                                  |
| L5  | Cognitive Load             | pass         | –             | rename field holds only the name                                                               |
| L6  | Doherty Threshold          | n/a          | –             | no build yet                                                                                   |
| L7  | Fitts's Law                | n/a          | –             | no new pointer target                                                                          |
| L8  | Flow                       | pass         | –             | the new name shows everywhere at once                                                          |
| L9  | Goal-Gradient              | n/a          | –             | no multi-step task                                                                             |
| L10 | Hick's Law                 | pass         | –             | 10 rows and one rare item                                                                      |
| L11 | Jakob's Law                | pass         | –             | native menu, dialog and panel                                                                  |
| L12 | Common Region              | n/a          | –             | no container added                                                                             |
| L13 | Proximity                  | n/a          | –             | text changes in place                                                                          |
| L14 | Prägnanz                   | n/a          | –             | no graphics                                                                                    |
| L15 | Similarity                 | pass         | –             | errors are words, not only red                                                                 |
| L16 | Uniform Connectedness      | n/a          | –             | no grouped controls                                                                            |
| L17 | Mental Model               | fail → fixed | L17.2, L17.5  | rename never changes the date; Older Sessions… only when older ones exist; panel message added |
| L18 | Miller's Law               | pass         | –             | nothing to hold in mind                                                                        |
| L19 | Occam's Razor              | pass         | –             | placeholder and hint each have a job                                                           |
| L20 | Paradox of the Active User | fail → fixed | L20.2         | no sessions: Switch Session is greyed; New Session sits above it                               |
| L21 | Pareto                     | pass         | –             | J1 4 moves, J3 6                                                                               |
| L22 | Parkinson's Law            | pass         | –             | no time limit                                                                                  |
| L23 | Peak-End                   | fail → risk  | L23.2         | a refused rename from the menu loses the typed text, as today; plan.md Risks                   |
| L24 | Postel's Law               | fail → fixed | L24.2         | a typed leading date no longer replaces the stamp                                              |
| L25 | Selective Attention        | pass         | –             | feedback is the renamed title                                                                  |
| L26 | Serial Position            | pass         | –             | most recent first                                                                              |
| L27 | Tesler's Law               | pass         | –             | the system keeps the date                                                                      |
| L28 | Von Restorff               | n/a          | –             | no emphasis added                                                                              |
| L29 | Working Memory             | pass         | –             | Current Session line shows where captures go                                                   |
| L30 | Zeigarnik                  | pass         | –             | Older Sessions… signals more                                                                   |

## Deliberate Inconsistencies

| Rule                                                           | Where                               | Why                                       | Owner decision needed               |
| -------------------------------------------------------------- | ----------------------------------- | ----------------------------------------- | ----------------------------------- |
| "everywhere a session is named" (intent)                       | `session.md` first line, file names | intent constraint; no colon in file names | yes: confirm at the plan gate       |
| display names on screens                                       | Older Sessions… folder panel        | native panel lists folder names           | no: the panel message explains them |
| window title order: "<name> — Snapmark" vs "Snapmark — <name>" | session window vs editor            | as built; not asked                       | no: plan.md Risks                   |

## Findings

| Severity | Location                                         | Finding                                                                    | Status                                                                         |
| -------- | ------------------------------------------------ | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| 3        | conformance.md `rename()`; interaction.md        | a typed leading date replaced the stamp, against "The date stays" and A1   | fixed in spec: rename never changes the stamp; an empty field removes the name |
| 2        | ia.md, screens.md                                | the " (2)" suffix on rename was undefined                                  | fixed: the suffix is part of the stamp                                         |
| 2        | microcopy.md, Switch Session rows                | same-day sessions with one name read alike                                 | plan.md Risks, accepted                                                        |
| 2        | interaction.md, Switch Session partial and empty | "Older Sessions…" shown with nothing older; empty list had no next step    | fixed: item only above 10; Switch Session greyed when empty                    |
| 2        | screens.md, sort                                 | last use is per Mac; a synced session from another Mac sorts as never used | plan.md Risks: sort unchanged by the intent's constraint                       |
| 2        | screens.md, ✓ on current                         | the current session could fall outside the 10                              | fixed: always listed                                                           |
| 2        | ia.md J3, panel                                  | the folder panel shows raw folder names                                    | fixed: deliberate inconsistency with a panel message                           |
| 2        | interaction.md, menu rename refused              | the typed name is lost after a refusal                                     | plan.md Risks, as today                                                        |
| 1        | brief.md Ask Map                                 | cited facts.md before it existed                                           | fixed: facts.md written next                                                   |
| 1        | screens.md, sort wording                         | "newest folder first" was not the built order                              | fixed: states the built order                                                  |
| 1        | brief.md Open Questions                          | sessions renamed before this change show no date                           | to the owner at the gate (ADR item 6)                                          |
| 1        | screens.md, menu layout                          | a long name widens the menu                                                | plan.md Risks, as today                                                        |
| 1        | microcopy.md, window titles                      | the two windows put the name on different sides                            | plan.md Risks, as today                                                        |
| 1        | microcopy.md, taken error                        | named the bare text, not the session it clashes with                       | fixed: names the taken session's display name                                  |
| 1        | `sessions.rename()`                              | ":" and "/" become "-" silently                                            | plan.md Risks, as today                                                        |
| 1        | editor label                                     | "·" separates date, name and count                                         | plan.md Risks, accepted                                                        |

## Decisions Needed

| Question                                                         | Recommended answer                                                    | Why it matters                              |
| ---------------------------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------- |
| Does `session.md` keep "# 2026-10-24 23.38 …" as its first line? | yes, as the intent's constraint says; the PDF shows the readable name | the agent and the path read the folder name |
| What do sessions renamed before this change show?                | their name only, no date                                              | no reliable date exists for them            |

## Did Not Run

| Check                             | Reason                                                   |
| --------------------------------- | -------------------------------------------------------- |
| visual pass and `visual-check.py` | no images: prototype skipped                             |
| second review round               | one pass by the milestone process; fixes not re-reviewed |
