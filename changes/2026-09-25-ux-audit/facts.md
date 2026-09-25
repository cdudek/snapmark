---
linear: none
bead: snap-0wm
type: facts
change: 2026-09-25-ux-audit
design: null
author: calvindudek@googlemail.com
status: approved
reviewed_by: calvindudek@googlemail.com (Plannotator gate)
approved_at: 2026-09-25
created: 2026-09-25
---

# Facts: UX audit of Snapmark v0.2.0

## Goal

The owner gets a complete, uncapped record of what works and what doesn't in Snapmark, judged by
the overnight-build review it is for. The audit documents only. It changes no app code, and it
touches none of the owner's data. Approving these facts approves
`docs/ux/audits/2026-09-25/briefing.md` as the audit's scope: the "go" that `ux:run` step 2 waits for.

## Acceptance criteria

### Setup (ux:run step 1, already written)

- [ ] **F1** `docs/ux/` shall hold `setup.md`, `owner-words.md`, `interaction-guidelines.md`, `sitemap.md`, `glossary-proposal.md` and `decisions.md`.
- [ ] **F2** `owner-words.md` shall quote every interface request from the build conversation verbatim, dated, grouped by topic.

### The audit (ux:run step 3)

- [ ] **F3** `docs/ux/audits/2026-09-25/findings.md` shall exist, with every finding in the shared finding format and no cap on their number.
- [ ] **F4** Every finding shall say whether it was seen on screen, read in the code, or assumed.
- [ ] **F5** Every request quoted in the briefing shall be re-checked as met, partly met, or not met.
- [ ] **F6** Findings shall start with counts by screen and impact, and a "Did not run" list.
- [ ] **F7** `sitemap.md` shall have a "Proposed" section, and `glossary-proposal.md` shall have one row per term.
- [ ] **F8** `interaction-guidelines.md` shall hold one rule per applicable rule area, each with `status: proposed`, plus the flows and the enforcement map.
- [ ] **F9** Three independent evaluators (two Claude, one Codex) shall submit before any of them sees another's notes.

<details>
<summary>Verification</summary>

- F1, F7, F8 — manual: the files exist with those sections
- F2 — manual: the owner reads `owner-words.md`
- F3, F4, F6 — manual: `findings.md`, plus `grep -c "^### F" findings.md` equals the sum of the counts at its top
- F5 — manual: one row per quote in the requests table of `findings.md`
- F9 — manual: the three evaluator files carry timestamps earlier than the merge

</details>

### Safety

- [ ] **N1** No agent shall write to `~/Documents/Snapmark/`, `~/Library/Application Support/snapmark/`, the login items or the clipboard.
- [ ] **N2** No screenshot shall show the owner's real screen. Every capture uses the mock page.
- [ ] **N3** The PR shall change files only under `docs/ux/` and `changes/2026-09-25-ux-audit/`.

<details>
<summary>Verification</summary>

- N1 — manual: `ls -la ~/Documents/Snapmark` and the state file's timestamp are unchanged after the audit
- N2 — manual: the owner looks at `shots/`
- N3 — automated: `git diff --name-only origin/main` lists only those paths

</details>

## Verification

- **Automated:** `npm run format && npm run lint && npm run typecheck && npm test` exits 0.
- **Manual:** the owner reads `findings.md`. The decision page comes next, in its own change.

## Out of scope

- Deciding anything. That is `ux:decision` (ux:run steps 6 and 7), a later change.
- Building any fix. That is ux:run step 8, after approved plans.
- Your requests for magic select, copy and paste inside the screenshot, and a UI-element palette. The audit records them as not met, and doesn't build them.

## Open questions

None.
