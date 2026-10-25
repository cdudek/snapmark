---
type: validation
change: 2026-10-25-tall-capture-tiles
verdict: ready
status: draft
reviewed_by: null
approved_at: null
created: 2026-10-25
---

# Validation

## Verdict

ready, after one review pass and the author's fixes. The milestone process runs this once, with no loop (stages.md 2.5). The reviewer (one subagent running Nielsen, Laws of UX and a screen critique in turn, size M) found no severity 3 or 4, but returned `not-ready` on nine contradictions between spec files and five severity-2 gaps. The contradictions and three of the gaps were fixed in the spec the same day and not re-reviewed; the other gaps go to plan.md Risks. The owner sees this at the plan gate.

## Definition Of Ready

| Check      | Result | Evidence                                                                                                                       |
| ---------- | ------ | ------------------------------------------------------------------------------------------------------------------------------ |
| Activities | pass   | brief, ia, interaction, screens, conformance, microcopy, sitemap written; prototype skipped with reason in decisions.json      |
| Asks       | pass   | A1–A4 each map to a job story and a screen (table below); facts follow in Stage 2.8 and must cite them                         |
| Findings   | pass   | none at severity 3 or 4; severity 2: three fixed in the spec, two to plan.md Risks                                             |
| Laws of UX | pass   | 30 rows below; three failed checks (L12.1, L13.2, L23.2), all severity 1, carried to plan.md Risks                             |
| Concerns   | pass   | conformance deliberate inconsistencies listed; none needs an owner decision; the token cost is stated in brief.md for the gate |
| Questions  | pass   | each open question has a recommended answer; none needs the owner                                                              |
| Prototype  | n/a    | skipped: UI not risky; no image was judged                                                                                     |

## Asks To Screens To Facts

| Ask | Job story  | Screen                                       | State                                 | Fact or out of scope |
| --- | ---------- | -------------------------------------------- | ------------------------------------- | -------------------- |
| A1  | J1, J2     | `session.md` entry                           | tall                                  | facts.md (Stage 2.8) |
| A2  | J1         | `session.md` entry (part width 1280 px)      | tall                                  | facts.md (Stage 2.8) |
| A3  | J1, J2, J3 | `session.md`; session window; PDF; Discarded | tall; after Edit Again; removed, tall | facts.md (Stage 2.8) |
| A4  | J1         | `session.md` entry; ia.md part object        | tall                                  | facts.md (Stage 2.8) |

## Prototype Screenshots

| Screen | State             | 100 % | 150 % |
| ------ | ----------------- | ----- | ----- |
| none   | prototype skipped | n/a   | n/a   |

## Laws Of UX Coverage

| #   | Law                        | Verdict     | Failed checks | Evidence                                                                                   |
| --- | -------------------------- | ----------- | ------------- | ------------------------------------------------------------------------------------------ |
| L1  | Aesthetic-Usability        | pass        | –             | no new style; parts reuse `#doc img` (`src/viewer.html:210`)                               |
| L2  | Choice Overload            | n/a         | –             | no choice added; a part-width setting is a No-Go                                           |
| L3  | Chunking                   | pass        | –             | one paragraph per part under the entry heading, after the parts line                       |
| L4  | Cognitive Bias             | n/a         | –             | no decision, default or consent                                                            |
| L5  | Cognitive Load             | pass        | –             | each new element (parts line, parts) has a job; no new text style                          |
| L6  | Doherty Threshold          | pass        | –             | timings n/a until built; save time of a 20 000 px page is a plan risk                      |
| L7  | Fitts's Law                | n/a         | –             | no pointer target added or moved                                                           |
| L8  | Flow                       | pass        | –             | ⌘↩ and ⌘S unchanged; no confirmation added                                                 |
| L9  | Goal-Gradient              | n/a         | –             | no multi-step task                                                                         |
| L10 | Hick's Law                 | n/a         | –             | no decision point added                                                                    |
| L11 | Jakob's Law                | pass        | –             | plain Markdown images, `entry()`, `MdNotes` reused                                         |
| L12 | Common Region              | fail → risk | L12.1         | in the Document tab each part has its own border and shadow, so 11 parts read as 11 images |
| L13 | Proximity                  | fail → risk | L13.2         | the gap between parts equals the gap before the comment                                    |
| L14 | Prägnanz                   | n/a         | –             | no graphic or new layout                                                                   |
| L15 | Similarity                 | pass        | –             | parts look like the one image                                                              |
| L16 | Uniform Connectedness      | n/a         | –             | no grouped controls                                                                        |
| L17 | Mental Model               | pass        | –             | "screenshot" kept; "part" added with a glossary row proposed                               |
| L18 | Miller's Law               | n/a         | –             | nothing to hold between screens                                                            |
| L19 | Occam's Razor              | pass        | –             | no setting; the repeated strip is explained once                                           |
| L20 | Paradox of the Active User | pass        | –             | the parts line is help in place                                                            |
| L21 | Pareto                     | pass        | –             | J1–J3 from A1–A4; one default, no setting                                                  |
| L22 | Parkinson's Law            | n/a         | –             | no input or time limit                                                                     |
| L23 | Peak-End                   | fail → risk | L23.2         | a failed save shows no message (existing F049), kept by this change                        |
| L24 | Postel's Law               | pass        | –             | fixed template; the PDF swap now keys on part links, so edited entries print right         |
| L25 | Selective Attention        | n/a         | –             | no new message                                                                             |
| L26 | Serial Position            | pass        | –             | the parts line comes first                                                                 |
| L27 | Tesler's Law               | pass        | –             | width, rule and overlap all set by the app                                                 |
| L28 | Von Restorff               | n/a         | –             | no emphasis added                                                                          |
| L29 | Working Memory             | n/a         | –             | no state carried across views                                                              |
| L30 | Zeigarnik                  | pass        | –             | "part i of n" says more follow                                                             |

Other principles: B4 (a failed save says nothing) fails, carried with L23.2; B5 (Edit Again all or nothing) failed and is fixed in the spec.

## Deliberate Inconsistencies

| Rule                                         | Where                        | Why                                                                      | Owner decision needed                                                 |
| -------------------------------------------- | ---------------------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| one screenshot shows as one image            | Document tab shows the parts | it is `session.md` as the agent reads it                                 | no: recommended in brief.md                                           |
| guideline token note (F207)                  | tall entries in `session.md` | about 15,800 tokens for an 8000 px page, up to about 39,600 at 20 000 px | no: J1 and A4 ask for it; the cost is stated in brief.md for the gate |
| the same pixels twice on disk and in the ZIP | `img/NNN.png` and `img/NNN/` | people need the whole page, the agent needs the parts                    | no                                                                    |
| PDF renders `session.md`                     | the PDF prints the one image | intent: one screenshot in the PDF                                        | no                                                                    |
| Copy Image gives what Add to Session saves   | clipboard                    | the clipboard holds one image                                            | no                                                                    |

## Findings

| Severity | Location                                              | Finding                                                                                                                                              | Status                                                                                                             |
| -------- | ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| 2        | interaction.md Edit Again; conformance `replaceShot`  | Edit Again deleted the old parts before writing the new ones: a failed write left links to missing parts                                             | fixed in spec: new parts to `img/NNN.new/`, then image and entry, then swap; Errors row added                      |
| 2        | screens.md Document tab                               | after Edit Again the Document tab may show cached old parts (same file names; only the grid uses `?v=`, `src/viewer.ts:23`)                          | state "after Edit Again" added; plan.md Risks: the build checks it and fixes it in the viewer, never in session.md |
| 2        | screens.md PDF; conformance `sessionHtml`             | the PDF swap was undefined for entries edited in the Document tab                                                                                    | fixed in spec: keyed on the part links; unit test with an edited entry                                             |
| 2        | brief.md; conformance (F207)                          | the worst-case token cost was not stated                                                                                                             | fixed in spec: stated in brief.md for the gate; plan.md Risks checks the per-request image cap of Claude Code      |
| 2        | conformance "Add to Session, time"                    | resizing and encoding a 2560 × 20 000 page runs in the main process and may pass a second, freezing the menu                                         | plan.md Risks: measure the 2560 × 20 000 case; if over a second, the guideline's progress on the button            |
| 1        | ia.md State Diagrams                                  | entries saved before this change: Edit Again turns an old tall entry into parts                                                                      | fixed in spec; plan.md: a test                                                                                     |
| 1        | brief.md J2                                           | the intent's "every mark" was narrowed to diamonds without saying so                                                                                 | fixed in spec: diamonds whole; other marks continue across the repeated strip; card text in "- Card:"              |
| 1        | screens.md Document tab layout                        | each part framed separately, with the paragraph gap (L12.1, L13.2)                                                                                   | plan.md Risks: a CSS-only tighter gap between consecutive part images is allowed; otherwise as specified           |
| 1        | conformance `restoreShot`                             | a leftover `img/NNN/` alone did not count as taken, so Reopen could fail midway                                                                      | fixed in spec                                                                                                      |
| 1        | intent success measure                                | a plain-Node test cannot measure saved widths; the smoke test's tall flow never saves                                                                | plan.md: a smoke step saves a tall capture and checks every linked part is at least 1000 px wide                   |
| 1        | interaction.md Errors                                 | a failed save still shows no message (F049, L23.2)                                                                                                   | plan.md Risks: out of scope, linked follow-up                                                                      |
| 1        | Reopen Discarded… panel                               | a removed tall screenshot's folder holds `parts/`; picking it was refused                                                                            | fixed in spec: a pick of `parts` counts as its parent                                                              |
| 1        | spec as a whole                                       | one-shot mode not mentioned                                                                                                                          | fixed in spec: unchanged                                                                                           |
| 1        | ia.md part file names                                 | two digits tied to `MAX_HEIGHT`                                                                                                                      | fixed in spec: the layout test asserts at most 99 parts                                                            |
| 1        | brief.md, conformance                                 | 1568 vs 1280 cost was wrong ("40 % more", "30 % lower")                                                                                              | fixed: 17 parts instead of 11, about 60 % more; 1280 about 40 % lower                                              |
| 1        | interaction.md J2                                     | "wider than" a diamond; the overlap is a height                                                                                                      | fixed: "taller than a diamond"                                                                                     |
| 1        | decisions.json, brief.md, interaction.md, conformance | contradictions: skip reason said no words change; A3 job stories; example counts (9, 4, 7); Fits ↔ Tall "does not happen"; "no number"; Undo wording | fixed in spec                                                                                                      |
| 0        | ZIP                                                   | the same pixels ship twice (one image and parts)                                                                                                     | accepted                                                                                                           |
| 0        | `session.md` entry order                              | the comment and notes come after all the parts                                                                                                       | accepted: today's order                                                                                            |
| 0        | Document tab ⌫ on a part                              | deleting a part link drops it for the agent silently; Edit Again brings it back                                                                      | accepted: as today for the one image                                                                               |

## Decisions Needed

None that only the owner can answer. To confirm at the plan gate, each with the recommended answer the spec uses:

| Question                     | Recommended answer                                                       | Why it matters                                                   |
| ---------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| Part width                   | the capture's width, at most 1280 px                                     | 1568 reads a little sharper for about 60 % more tokens           |
| Token cost of a tall page    | accept: about 15,800 tokens for 8000 px, up to about 39,600 at 20 000 px | the owner's job is a token-efficient hand-off; A4 asks for parts |
| Document tab shows the parts | yes, as the agent reads them                                             | one image there needs a custom editor node                       |

## Did Not Run

| Check                                                 | Reason                                                                           |
| ----------------------------------------------------- | -------------------------------------------------------------------------------- |
| visual pass and `visual-check.py`                     | no images: prototype skipped                                                     |
| second review round                                   | one pass by the milestone process; fixes not re-reviewed                         |
| Claude's image cap per request                        | not checked against current docs; plan.md Risks                                  |
| Chromium printing a 1280 × 8000 image across A4 pages | not observed; setup.md lists "tall images across pages" as an existing PDF state |
