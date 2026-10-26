---
type: milestone
change: 2026-10-26-monorepo-private
milestone: monorepo-private
branch: milestone/monorepo-private
linear_milestone: none
status: building
created: 2026-10-26
---

# Milestone: monorepo-private

> Snapmark's code lives in one private repo with the app in `snapmark-app/`, and every installed copy still updates itself.

Kind: milestone of one. Changes that joined it record `milestone.slug` in their own `decisions.json` and add their features below.

## Features

In build order. `state` is `todo`, `building`, `done <sha>` (one go: a commit on the milestone branch), `merged` (feature PRs) or `blocked: <reason>`.

| #   | Change                      | Feature                                  | PR or commit | State |
| --- | --------------------------- | ---------------------------------------- | ------------ | ----- |
| 1   | 2026-10-26-monorepo-private | Planned at the plan gate (see `plan.md`) | none         | todo  |

## Done

- Every feature above is `done` on `milestone/monorepo-private`.
- `python3 scripts/verify_gate.py milestone 2026-10-26-monorepo-private` ends `VERIFY PASS milestone`.
- `findings.md` has no open blocking item after the one fix round.
- One PR from `milestone/monorepo-private` to the default branch, auto-merge armed.

## Outcome

Written after release (Stage 7): the success measure from `intent.md`, read where it says.

- **Measured:** <value> on <date> — **target:** <target> — **met:** <yes | no → next change>
