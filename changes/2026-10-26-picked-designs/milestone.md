---
type: milestone
change: 2026-10-26-picked-designs
milestone: picked-designs
branch: milestone/picked-designs
linear_milestone: none
status: building
created: 2026-10-26
---

# Milestone: picked-designs

> Capturing follows macOS and says what happens next, the editor shows where a screenshot goes, and Snapmark records GIFs an AI can read.

Kind: new, in four milestones (`decisions.json` › `milestones`), each its own PR to `main` and its own release. Stacked on `milestone/monorepo-private-1` until PR #97 merges.

## Features

In build order. `state` is `todo`, `building`, `done <sha>`, `merged` or `blocked: <reason>`.

| #   | Change                    | Feature                                  | PR or commit | State |
| --- | ------------------------- | ---------------------------------------- | ------------ | ----- |
| 1   | 2026-10-26-picked-designs | Planned at the plan gate (see `plan.md`) | none         | todo  |

## Done

- Every feature above is `done` on its `milestone/picked-designs-<n>`.
- `python3 scripts/verify_gate.py milestone 2026-10-26-picked-designs` ends `VERIFY PASS milestone` per milestone.
- `findings.md` has no open blocking item after each milestone's one fix round.
- One PR per milestone to the default branch, auto-merge armed.

## Outcome

- **Measured:** <value> on <date> — **target:** 9 in 10 capture-bar opens end in a saved capture — **met:** <yes | no → next change>
