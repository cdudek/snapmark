---
type: milestone
change: 2026-10-25-finish-app
milestone: finish-app
branch: milestone/finish-app-<n>
linear_milestone: none
status: merged
created: 2026-10-25
---

# Milestones: finish-app

> After the last one, Snapmark is finished but for selling: the approved look, a capture bar, Settings, readable tall captures, Electron 45.

Kind: new, delivered in one go: four milestones, each its own branch, PR and release.

## Features

In build order. `state` is `todo`, `building`, `done <sha>` (a commit on the milestone branch), `merged` (its milestone PR merged) or `blocked: <reason>`.

| #   | Change                | Feature                                        | PR or commit | State          |
| --- | --------------------- | ---------------------------------------------- | ------------ | -------------- |
| 1   | 2026-10-25-finish-app | M1.1 Highlighter shows on dark screens         | c02e5a7      | merged f9666b1 |
| 2   | 2026-10-25-finish-app | M1.2 Toolbar keys and size                     | 873a777      | merged f9666b1 |
| 3   | 2026-10-25-finish-app | M1.3 Editor header like the mock               | d4fccd7      | merged f9666b1 |
| 4   | 2026-10-25-finish-app | M1.4 Session window and rename leftovers       | 5019430      | merged f9666b1 |
| 5   | 2026-10-25-finish-app | M1.5 Small fixes                               | 112f8b1      | merged f9666b1 |
| 6   | 2026-10-25-finish-app | M1.6 Own LC_UUID                               | 0340156      | merged f9666b1 |
| 7   | 2026-10-25-finish-app | M2.1 Capture bar                               | 94e24d8      | merged 4384bf6 |
| 8   | 2026-10-25-finish-app | M2.2 Settings window                           | d66da47      | merged 4384bf6 |
| 9   | 2026-10-25-finish-app | M2.3 Keyboard Shortcuts window                 | cb5eec3      | merged 4384bf6 |
| 10  | 2026-10-25-finish-app | M3.1 Parts on save                             | b830a5f      | merged 77a0b77 |
| 11  | 2026-10-25-finish-app | M3.2 One screenshot everywhere                 | b149f78      | merged 77a0b77 |
| 12  | 2026-10-25-finish-app | M4.1 Electron 45, vitest 5, Dependabot updates | 224f14d      | merged 0146d80 |

## Milestone PRs

| #   | Branch                   | PR  | Release    | Installed         |
| --- | ------------------------ | --- | ---------- | ----------------- |
| 1   | `milestone/finish-app-1` | #86 | v0.19.0    | 0.21.0 (with 1–3) |
| 2   | `milestone/finish-app-2` | #89 | v0.20.0    | 0.21.0 (with 1–3) |
| 3   | `milestone/finish-app-3` | #90 | v0.21.0    | 0.21.0 (with 1–3) |
| 4   | `milestone/finish-app-4` | #91 | next patch | after its release |

## Done

- Every feature above is `merged`.
- `python3 scripts/verify_gate.py milestone 2026-10-25-finish-app` ended `VERIFY PASS` for each milestone.
- `validation.md` has no `not met` row; `findings.md` no open blocking item.

## Outcome

Written after the last release: the owner's check from intent.md's success measure.

- **Measured:** <value> on <date> — **target:** every row met, no screen named — **met:** <yes | no → next change>
