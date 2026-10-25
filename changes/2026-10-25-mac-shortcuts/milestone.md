---
type: milestone
change: 2026-10-25-mac-shortcuts
milestone: fixes
branch: milestone/fixes
linear_milestone: snap-bmr.17 (beads)
status: building
created: 2026-10-25
---

# Milestone: fixes

> Shortcuts follow macOS, and the small fixes found since v0.16.0 land together.

Kind: new, milestone 2 of project `launch` (branch `project/launch`). Changes that joined it record `milestone.slug` in their
own `decisions.json` and add their features below.

## Features

In merge order. `state` is `todo`, `building`, `merged` or `blocked: <reason>`.

| #   | Change                                      | Feature                                                                                                             | PR                                         | State  |
| --- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ | ------ |
| 1   | 2026-10-25-mac-shortcuts (snap-bmr.17.1.1)  | Shortcuts follow macOS, with Single-Key Tools (`mac-shortcuts/1-macos-keys-reland`; re-lands #76 and #77, reverted) | https://github.com/cdudek/snapmark/pull/78 | merged |
| 2   | 2026-10-25-tall-capture-tiles (snap-bmr.10) | Tall scrolling captures reach the agent as full-width tiles (features set by its plan)                              | —                                          | todo   |

## Done

- Every feature above is `merged` into `milestone/fixes`.
- `python3 scripts/verify_gate.py milestone 2026-10-25-mac-shortcuts` ends `VERIFY PASS milestone`.
- `findings.md` has no open blocking item after the one fix round.
- One PR from `milestone/fixes` to `project/launch`, auto-merge armed.

## Outcome

Written after release (Stage 7): the success measure from `intent.md`, read where it says.

- **Measured:** — on — — **target:** no complaint in the first week — **met:** —
