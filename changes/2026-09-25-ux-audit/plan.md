---
linear: none
bead: snap-0wm
type: plan
change: 2026-09-25-ux-audit
design: null
author: calvindudek@googlemail.com
status: approved
reviewed_by: calvindudek@googlemail.com (Plannotator gate)
approved_at: 2026-09-25
created: 2026-09-25
---

# Plan: UX audit of Snapmark v0.2.0

> Run the approved briefing as an eight-agent audit and merge its output into the `docs/ux/` files.

A person with no context builds from this file alone. [facts](facts.md) are for the gate, not for
the build.

## Approach

- **What changes:** new files under `docs/ux/audits/2026-09-25/`, plus filled-in `sitemap.md`, `glossary-proposal.md` and `interaction-guidelines.md`.
- **What stays the same:** every file outside `docs/ux/` and this change folder. The app is not touched.
- **Why this way:** the `ux:audit` skill, run exactly as `docs/ux/audits/2026-09-25/briefing.md` says: findings first, three blind evaluators, and the guidelines drafted only after every agent has finished.
- **Gate first, write after:** this plan describes the audit. The `/goal` below runs it.
- **Rejected:**
  - A single-agent audit — fewer lenses and no independent evaluators.
  - Auditing the owner's real sessions — the briefing forbids it.

## Design changes

None.

## Files that change

| File                                        | Change                                                                    |
| ------------------------------------------- | ------------------------------------------------------------------------- |
| `docs/ux/audits/2026-09-25/findings.md`     | new: the merged, uncapped findings                                        |
| `docs/ux/audits/2026-09-25/evaluators/*.md` | new: each agent's own notes, copied in after the merge                    |
| `docs/ux/audits/2026-09-25/shots/*.png`     | new: screenshots of the mock page in the editor, annotated                |
| `docs/ux/sitemap.md`                        | "Proposed" section filled in                                              |
| `docs/ux/glossary-proposal.md`              | one row per term                                                          |
| `docs/ux/interaction-guidelines.md`         | principles, one proposed rule per applicable area, flows, enforcement map |
| `changes/2026-09-25-ux-audit/plan.md`       | tasks ticked, revisions logged                                            |

## Order of work

- [ ] 1. Build once: `npm ci && npm run build`, and confirm `npm run smoke` passes — proof: `smoke: ok`
- [ ] 2. Write `common.md` in a scratch folder outside the repo: briefing path, build folder, how to launch the editor on the mock page with `SNAPMARK_ROOT` set, safety rules, output paths — proof: the file exists
- [ ] 3. Record the owner's data before starting: `ls -la ~/Documents/Snapmark` and the `stat` of `~/Library/Application Support/snapmark/state.json` — proof: both saved to the scratch folder
- [ ] 4. Start agents 1–7 in one message, and agent 8 (Codex, `codex exec`) in the background; each writes only to its own scratch file and to `shots/` — proof: eight output files
- [ ] 5. Merge into `findings.md`: exact duplicates only, split bundles, number F001 upward by screen then app-wide, counts at the top, "Did not run" listed — proof: the heading count matches the totals
- [ ] 6. Agent 1, phase 2: `ux:guidelines draft` into `interaction-guidelines.md`, plus the proposed sitemap; agent 4's glossary into `glossary-proposal.md` — proof: F7 and F8 hold
- [ ] 7. Copy the evaluator notes and shots into `docs/ux/audits/2026-09-25/` — proof: files exist
- [ ] 8. Safety check: repeat the records from step 3 and compare — proof: no difference (N1)
- [ ] 9. Verify, open the PR, arm auto-merge, archive the folder — proof: CI `check` passes

## Risks

| Risk                                                                              | What we do                                                                                    | Where it lands  |
| --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | --------------- |
| Agents cannot script the menu bar menu, capture overlay, notifications or dialogs | Evaluate those from `src/main.ts`, labelled "read in the code"; list them under "Did not run" | step 5          |
| Two agents launching Electron at once collide on the temp state folder            | Each agent gets its own `SNAPMARK_ROOT` and runs the compiled `dist/` without rebuilding      | steps 1, 2      |
| Codex cannot launch the app                                                       | It evaluates the code and says so first, as the skill allows                                  | step 4          |
| An agent captures the real screen by pressing a global shortcut                   | `common.md` forbids it; the mock page is the only capture source; the owner checks `shots/`   | steps 2, 7 (N2) |
| The chain-gate hook refuses writes outside `docs/**` and `changes/**`             | The audit writes only there; scratch files live outside the repo                              | accepted        |

## Out of scope

- Deciding anything, and the decision page (ux:run steps 6 and 7).
- Changing app code (ux:run step 8).

## Done

- `npm run format && npm run lint && npm run typecheck && npm test` exits 0.
- `docs/ux/audits/2026-09-25/findings.md` exists and F3–F6 hold.
- F7, F8 and F9 hold.
- N1, N2 and N3 hold: the step 8 comparison shows no difference, and `git diff --name-only origin/main` lists only `docs/ux/**` and `changes/2026-09-25-ux-audit/**`.
- Every task in this plan's `## Order of work` is ticked, or its blocker is named under `## Revisions`.
- Stop and report as soon as a step cannot proceed. Never work around a blocker.
- Stop after 120 turns if not met. Report what is missing.

## Goal handover

```
/goal Build changes/2026-09-25-ux-audit/plan.md in its order of work; every outcome in
changes/2026-09-25-ux-audit/facts.md must hold; tick tasks as they land; log departures under
## Revisions. Run the audit with the ux:audit skill against
docs/ux/audits/2026-09-25/briefing.md.

Done:
- `npm run format && npm run lint && npm run typecheck && npm test` exits 0.
- `docs/ux/audits/2026-09-25/findings.md` exists and F3–F6 hold.
- F7, F8 and F9 hold.
- N1, N2 and N3 hold: the step 8 comparison shows no difference, and `git diff --name-only origin/main` lists only `docs/ux/**` and `changes/2026-09-25-ux-audit/**`.
- Every task in this plan's `## Order of work` is ticked, or its blocker is named under `## Revisions`.
- Stop and report as soon as a step cannot proceed. Never work around a blocker.
- Stop after 120 turns if not met. Report what is missing.
```

## Revisions

Only after approval. One line per change: `YYYY-MM-DD — what changed, and why`.
