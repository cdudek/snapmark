---
type: milestone
change: 2026-10-25-finish-app
milestone: finish-app
branch: milestone/finish-app-<n>
linear_milestone: none
status: building
created: 2026-10-25
---

# Milestones: finish-app

> After the last one, Snapmark is finished but for selling: the approved look, a capture bar, Settings, readable tall captures, Electron 45.

Kind: new, delivered in one go: four milestones, each its own branch, PR and release.

## Features

In build order. `state` is `todo`, `building`, `done <sha>` (a commit on the milestone branch), `merged` (its milestone PR merged) or `blocked: <reason>`.

| #   | Change                | Feature                                        | PR or commit | State |
| --- | --------------------- | ---------------------------------------------- | ------------ | ----- |
| 1   | 2026-10-25-finish-app | M1.1 Highlighter shows on dark screens         | c02e5a7      | done c02e5a7 |
| 2   | 2026-10-25-finish-app | M1.2 Toolbar keys and size                     | 873a777      | done 873a777 |
| 3   | 2026-10-25-finish-app | M1.3 Editor header like the mock               | —            | todo  |
| 4   | 2026-10-25-finish-app | M1.4 Session window and rename leftovers       | —            | todo  |
| 5   | 2026-10-25-finish-app | M1.5 Small fixes                               | —            | todo  |
| 6   | 2026-10-25-finish-app | M1.6 Own LC_UUID                               | —            | todo  |
| 7   | 2026-10-25-finish-app | M2.1 Capture bar                               | —            | todo  |
| 8   | 2026-10-25-finish-app | M2.2 Settings window                           | —            | todo  |
| 9   | 2026-10-25-finish-app | M2.3 Keyboard Shortcuts window                 | —            | todo  |
| 10  | 2026-10-25-finish-app | M3.1 Parts on save                             | —            | todo  |
| 11  | 2026-10-25-finish-app | M3.2 One screenshot everywhere                 | —            | todo  |
| 12  | 2026-10-25-finish-app | M4.1 Electron 45, vitest 5, Dependabot updates | —            | todo  |

## Milestone PRs

| #   | Branch                   | PR  | Release | Installed |
| --- | ------------------------ | --- | ------- | --------- |
| 1   | `milestone/finish-app-1` | —   | —       | —         |
| 2   | `milestone/finish-app-2` | —   | —       | —         |
| 3   | `milestone/finish-app-3` | —   | —       | —         |
| 4   | `milestone/finish-app-4` | —   | —       | —         |

## Done

- Every feature above is `merged`.
- `python3 scripts/verify_gate.py milestone 2026-10-25-finish-app` ended `VERIFY PASS` for each milestone.
- `validation.md` has no `not met` row; `findings.md` no open blocking item.

## Outcome

Written after the last release: the owner's check from intent.md's success measure.

- **Measured:** <value> on <date> — **target:** every row met, no screen named — **met:** <yes | no → next change>
