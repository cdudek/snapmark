---
type: milestone
change: 2026-10-27-online-release-1
milestone: online-release-1
branch: milestone/online-release-1-1
project: project/online-release-1
linear_milestone: none
ticket: snap-70l
status: planning
created: 2026-10-27
---

# Milestone: online-release-1

> A team gives exact feedback on running UI in Chrome or on the Mac, decides together, and hands it to a coding agent through MCP, all running locally.

Kind: new, in project `online-release-1`. Seven milestones; 2 to 6 build in parallel after 1, and 7 after 2. Each milestone names its repo; milestones in `snapmark-desktop` merge into `project/online-release-1`, the others into their own repo's `main`.

## Features

Filled at the plan gate (Stage 4).

| #   | Change                      | Feature            | PR or commit | State |
| --- | --------------------------- | ------------------ | ------------ | ----- |
| 1   | 2026-10-27-online-release-1 | planned in plan.md | none         | todo  |

## Done

- Every feature is `done` on its milestone branch.
- `python3 scripts/verify_gate.py milestone 2026-10-27-online-release-1` ends `VERIFY PASS milestone` per milestone.
- `findings.md` has no open blocking item after the one fix round.
- One PR per milestone into its parent.

## Outcome

Written after release (Stage 7): the success measure from `intent.md`.

- **Measured:** <value> on <date> — **target:** 20 full loops in two weeks, median at most 1.5 review rounds — **met:** <yes | no → next change>
