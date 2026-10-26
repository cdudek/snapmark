---
type: milestone
change: 2026-10-26-interaction-guide-polish
milestone: interaction-guide-polish
branch: milestone/interaction-guide-polish-1
linear_milestone: none
status: planning
created: 2026-10-26
---

# Milestone: interaction-guide-polish

> After it, Snapmark has one accepted interaction guide, a capture bar that names its icons and keys, and a notes column that says what each box is for.

Kind: a milestone of one, delivered in one go: one branch, one PR, one release.

## Features

In build order. `state` is `todo`, `building`, `done <sha>` (a commit on the milestone branch), `merged` (its milestone PR merged) or `blocked: <reason>`.

| #   | Change                              | Feature                         | PR or commit | State |
| --- | ----------------------------------- | ------------------------------- | ------------ | ----- |
| 1   | 2026-10-26-interaction-guide-polish | 1.1 Interaction guide           | —            | todo  |
| 2   | 2026-10-26-interaction-guide-polish | 1.2 Capture bar labels and keys | —            | todo  |
| 3   | 2026-10-26-interaction-guide-polish | 1.3 General comment and notes   | —            | todo  |

## Milestone PRs

| #   | Branch                                 | PR  | Release | Installed |
| --- | -------------------------------------- | --- | ------- | --------- |
| 1   | `milestone/interaction-guide-polish-1` | —   | —       | —         |

## Done

- Every feature above is `merged`.
- `python3 scripts/verify_gate.py milestone 2026-10-26-interaction-guide-polish` ended `VERIFY PASS`.
- `validation.md` has no `not met` row; `findings.md` no open blocking item.

## Outcome

Written after the release: the owner's check from intent.md's success measure.

- **Measured:** <value> on <date> — **target:** every row met, the guide accepted, no icon named — **met:** <yes | no → next change>
