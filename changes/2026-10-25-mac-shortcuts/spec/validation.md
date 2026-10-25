---
type: validation
change: 2026-10-25-mac-shortcuts
verdict: ready
status: draft
reviewed_by: null
approved_at: null
created: 2026-10-25
---

# Validation

## Verdict

ready

One reviewer ran three lenses (Nielsen, all 30 Laws of UX, a screen critique), as size M asks. It found two severity-3 gaps and contradictions between files. All were fixed in the spec in one pass. The fixes were not re-reviewed: this run was one pass, no loop. Five owner questions remain; each has a recommended answer and none blocks the build.

## Definition Of Ready

| Check      | Result | Evidence                                                                                                                                     |
| ---------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Activities | pass   | brief, ia (delta only), interaction, screens, conformance, microcopy written; prototype skipped: code-only review, no visual change to draw. |
| Asks       | pass   | A1 to A3 and E1 to E3 map to job stories and screens below. Facts follow in `facts.md` (sdlc mode, next stage).                              |
| Findings   | pass   | No open severity 3 or 4. Both severity-3 findings fixed (E10a, E12).                                                                         |
| Laws of UX | pass   | All 30 rows and B rows filled.                                                                                                               |
| Concerns   | pass   | Conformance departures fixed or listed below for the owner.                                                                                  |
| Questions  | pass   | Five questions, each with a recommended answer.                                                                                              |
| Prototype  | n/a    | Skipped: no images (code-only; the owner's rule against screen capture).                                                                     |

## Asks To Screens To Facts

| Ask | Job story      | Screen                                           | State                | Fact or out of scope    |
| --- | -------------- | ------------------------------------------------ | -------------------- | ----------------------- |
| A1  | J1, J2, J3, J4 | menu, popup, editor, session window, keys window | Key map G, E, S rows | facts.md (next stage)   |
| A2  | none (process) | none                                             | none                 | answered by the ADR     |
| A3  | J1 to J4       | as A1                                            | every Key map row    | facts.md (next stage)   |
| E1  | J1             | popup                                            | G4                   | facts.md: no direct key |
| E2  | J1, J2         | popup, editor                                    | G4, E3               | facts.md                |
| E3  | J1             | none                                             | ⌃⇧2 unbound          | facts.md                |

## Prototype Screenshots

| Screen | State | 100 %                                       | 150 % |
| ------ | ----- | ------------------------------------------- | ----- |
| all    | all   | skip -- code-only review, no screen capture | skip  |

## Laws Of UX Coverage

| #   | Law                        | Verdict            | Failed checks | Evidence                                                                     |
| --- | -------------------------- | ------------------ | ------------- | ---------------------------------------------------------------------------- |
| L1  | Aesthetic-Usability        | pass               |               | No new colours or sizes; the multi-selection uses Fabric's border.           |
| L2  | Choice Overload            | fail, accepted (0) | L2.1          | Popup has 4 items and no default: a launch list, like macOS's ⇧⌘5.           |
| L3  | Chunking                   | fail, open (Q5)    | L3.4, L3.6    | 20 key rows under one heading.                                               |
| L4  | Cognitive Bias             | n/a                |               | No default, consent or number.                                               |
| L5  | Cognitive Load             | pass               |               | Keys only; no new elements.                                                  |
| L6  | Doherty Threshold          | pass               |               | Save guard stated (E1a). Timing: no build yet.                               |
| L7  | Fitts's Law                | n/a                |               | No pointer target added.                                                     |
| L8  | Flow                       | pass (fixed)       | L8.4          | ⌘C now keeps the selection (E4).                                             |
| L9  | Goal-Gradient              | n/a                |               | No multi-step task.                                                          |
| L10 | Hick's Law                 | pass               |               | 4 options, same order as the submenu, one level.                             |
| L11 | Jakob's Law                | fail, open (Q1)    | L11.8         | macOS digits followed; ⌃⇧1 goes silent with no notice.                       |
| L12 | Common Region              | pass               |               | One border round a multi-selection.                                          |
| L13 | Proximity                  | n/a                |               | No layout added.                                                             |
| L14 | Prägnanz                   | n/a                |               | No icons or graphics.                                                        |
| L15 | Similarity                 | pass               |               | Existing selected style, without handles.                                    |
| L16 | Uniform Connectedness      | n/a                |               | No grouped controls.                                                         |
| L17 | Mental Model               | fail, accepted (1) | L17.1         | Keys window keeps its sentence case; glossary wants Title Case (existing).   |
| L18 | Miller's Law               | n/a                |               | Nothing carried between screens.                                             |
| L19 | Occam's Razor              | pass (fixed)       | L19.3         | Copy Image rows merged into one.                                             |
| L20 | Paradox of the Active User | fail, open (Q3)    | L20.3         | ⌃⇧5 not in the menu until the sublabel is agreed.                            |
| L21 | Pareto                     | pass               |               | Capture is one chord; J1 to J4 from the owner.                               |
| L22 | Parkinson's Law            | n/a                |               | No time limit.                                                               |
| L23 | Peak-End                   | fail, accepted (1) | L23.1         | ⌘S ends with the window closing, as ⌘↵ today (F062).                         |
| L24 | Postel's Law               | n/a                |               | No input format.                                                             |
| L25 | Selective Attention        | fail, open (Q2)    | L25.1, L25.2  | ⌘⌫ feedback is a similar screenshot and counts at the edges.                 |
| L26 | Serial Position            | pass               |               | Most used keys first in the list and popup.                                  |
| L27 | Tesler's Law               | fail, accepted (1) | L27.5         | Refused keys are silent; recorded as a missing guideline.                    |
| L28 | Von Restorff               | n/a                |               | No emphasis added.                                                           |
| L29 | Working Memory             | fail, accepted (2) | L29.3         | ⌘A covers marks out of view; stated in E7c, one ⌘Z restores all.             |
| L30 | Zeigarnik                  | pass (fixed)       | L30.1, L30.3  | Discarded copy now drops the selection first (E12).                          |
| B1  | Response time              | n/a                |               | No build yet.                                                                |
| B2  | Recognition over recall    | fail, open (Q3)    |               | ⌃⇧5 sublabel pending; ⌘S and ⌘C only in the list and README.                 |
| B3  | Progressive disclosure     | pass               |               | One-level popup.                                                             |
| B4  | Error messages             | fail, accepted (1) |               | "Control+Shift+4 is taken by another app" has no next step; kept "as today". |
| B5  | Prevention, undo           | fail, open (Q2)    |               | ⌘⌫ has no ⌘Z; Discarded is the net.                                          |
| B6  | Forms                      | n/a                |               | No form.                                                                     |
| B7  | Shneiderman                | fail, open (Q2)    |               | Easy reversal for ⌘⌫.                                                        |
| B8  | Signifiers                 | pass               |               | No handles signals no resizing.                                              |
| B9  | Figure-ground              | pass               |               | Native menu.                                                                 |
| B10 | Status on the object       | pass               |               | Primary button disabled while saving.                                        |
| B11 | User control               | pass               |               | Esc closes the popup; Esc closing the editor is the owner's exception.       |
| B12 | Deceptive design           | n/a                |               | No consent.                                                                  |
| B13 | Keyboard, focus            | pass (fixed)       |               | S1d and the narrowed field rule remove the focus traps.                      |
| B14 | Which to cite              | n/a                |               |                                                                              |

## Deliberate Inconsistencies

| Rule                                              | Where                 | Why                                            | Owner decision needed           |
| ------------------------------------------------- | --------------------- | ---------------------------------------------- | ------------------------------- |
| KF 2: Esc stops at the resting state              | editor, Esc on Select | Owner keeps it (A3); Discarded brings it back. | no, decided 2026-10-25          |
| LS: Enter opens                                   | session window, ↩     | Finder's ↩ renames (A3).                       | no, decided 2026-10-25          |
| CP: ⌘C on a selection is for marks                | editor, ⌘C            | Marks cannot be copied yet.                    | confirm (brief, Open Questions) |
| KF: the destructive thing is never one chord away | session window, ⌘⌫    | Finder's ⌘⌫ (A3); Discarded keeps it 7 days.   | Q2                              |
| PC 3: key beside the name                         | menu, Capture Options | Electron draws no key on a submenu row.        | Q3                              |

## Findings

| Severity | Location                   | Finding                                                                             | Status                                       |
| -------- | -------------------------- | ----------------------------------------------------------------------------------- | -------------------------------------------- |
| 3        | interaction.md E10         | ⌘Z with several marks selected would put marks back at the wrong places.            | fixed: E10a                                  |
| 3        | interaction.md, closing    | ⌘W, close or Quit with several marks selected would store moved marks in Discarded. | fixed: E12                                   |
| 2        | interaction.md G4d         | ⌃⇧5 over a full-screen app was left undecided.                                      | open: Q4, and a build check                  |
| 2        | interaction.md G4b         | "macOS holds the keyboard" was an unverified guard.                                 | fixed: menu-open flag                        |
| 2        | interaction.md G1, G3      | ⌃⇧4 and ⌃⇧3 could start a capture over a running one.                               | fixed: G1b, G3a, Busy term                   |
| 2        | interaction.md E4          | ⌘C dropped a ⌘A selection.                                                          | fixed: reselect after copy                   |
| 2        | interaction.md S1          | ↩ after clicking Remove would remove another screenshot.                            | fixed: S1d                                   |
| 2        | interaction.md Terms       | "Control has focus" refused arrows after clicking a tool button.                    | fixed: narrowed to fields                    |
| 2        | interaction.md S2          | ⌘⌫ is one chord, with no ⌘Z and weak feedback.                                      | open: Q2                                     |
| 2        | screens.md keys list       | 20 rows under one heading; KF 4 asks for groups by place.                           | open: Q5                                     |
| 2        | interaction.md G2          | After the update, ⌃⇧1 silently does nothing.                                        | open: Q1                                     |
| 2        | interaction.md E7          | ⌘A then ⌫ on a tall screenshot removes marks out of view.                           | accepted: E7c, one ⌘Z                        |
| 1        | brief.md, screens.md       | ⌃⇧5 appears nowhere in the menu.                                                    | open: Q3                                     |
| 1        | interaction.md E1b         | Claim that ⌘↵ checks the image was wrong.                                           | fixed                                        |
| 1        | interaction.md E6          | Nudge did not say the page must not scroll.                                         | fixed                                        |
| 1        | interaction.md Terms       | Two definitions of "1 point".                                                       | fixed: one                                   |
| 1        | microcopy.md               | Keys window mixes sentence and Title Case.                                          | accepted: existing style                     |
| 1        | microcopy.md               | Two "Copy Image" rows.                                                              | fixed: merged                                |
| 1        | interaction.md "Refused"   | Refused keys say nothing.                                                           | accepted; missing guideline                  |
| 1        | interaction.md Feedback    | ⌘S feedback is the window closing.                                                  | accepted: as ⌘↵ (F062)                       |
| 1        | microcopy.md, notification | "Control+Shift+4 is taken" names no next step.                                      | accepted: intent says as today               |
| 1        | microcopy.md, README       | README 107-109 said "No shortcut" beside ⌃⇧5.                                       | fixed                                        |
| 1        | microcopy.md, setup.md     | setup.md:60 still said ⌃⇧2.                                                         | fixed; guidelines option (c) is for the plan |
| 1        | conformance.md section 6   | In the screenshot view ↩ acts on the session.                                       | recorded                                     |
| 0        | screens.md popup           | No default item.                                                                    | accepted                                     |

Contradictions fixed: brief row ids, ia.md "only the key changes", screens.md "no visible change" and its column note, conformance word verdict, viewer.ts line numbers. The ADR still says `status: proposed` although the owner said "ok go": for the plan to update.

## Decisions

Answered 2026-10-25. The owner answered Q1, Q2 and Q5 in a dialog; the orchestrator took the recommended answer for the rest.

| Question                                    | Answer                                                                                      | By whom      |
| ------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------ |
| Q1. Tell the owner once that capture moved? | No notice. The menu and the Keyboard Shortcuts window show ⌃⇧4.                             | owner        |
| Q2. ⌘Z in the session window after ⌘⌫?      | Yes: ⌘Z puts back the last screenshot ⌘⌫ removed, as Finder does (interaction.md S5).       | owner        |
| Q3. Show ⌃⇧5 on Capture Options?            | Yes, as the sublabel "⌃⇧5" while the key is registered.                                     | orchestrator |
| Q4. ⌃⇧5 over a full-screen app?             | Pop at the menu bar icon. A build check; if nothing shows, a follow-up pops at the pointer. | orchestrator |
| Q5. Group the keys window by place?         | Yes: "Anywhere", "Editor", "Session window", with the same row helper.                      | owner        |
| Brief: ⌘C with a mark selected              | The image, until mark copy exists.                                                          | orchestrator |
| Brief: primary button hint                  | Keep "Add to session ⌘↵".                                                                   | orchestrator |

## Did Not Run

| Check                            | Reason                                                                                                                                                                                        |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Re-review of the fixes           | One pass, no loop (this run's brief). The fixes are spec text; a reviewer has not re-read them.                                                                                               |
| Prototype and visual pass        | No images: code-only review, no screen capture (the owner's rule).                                                                                                                            |
| Behaviour claims needing the app | Electron keeping focus on a clicked button, macOS swallowing hotkeys while a menu is open, Fabric's relative positions inside a selection, the tray popup in full screen. Check in the build. |
