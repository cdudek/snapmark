---
type: milestone
change: 2026-10-25-session-names
milestone: session-names
branch: milestone/session-names
linear_milestone: snap-bmr.16 (beads)
status: building
created: 2026-10-25
---

# Milestone: session-names

> Sessions read with a year-first date, keep it when renamed, and Switch Session shows the last 10 then Older Sessions….

Kind: new, milestone 1 of project `launch` (branch `project/launch`). Changes that joined it record `milestone.slug` in their
own `decisions.json` and add their features below.

## Features

In merge order. `state` is `todo`, `building`, `merged` or `blocked: <reason>`.

| #   | Change                                   | Feature                                                                                                    | PR                                         | State  |
| --- | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------ | ------ |
| 1   | 2026-10-25-session-names (snap-bmr.14.1) | Switch Session lists 10, the current one always, then "Older Sessions…" (`session-names/1-older-sessions`) | https://github.com/cdudek/snapmark/pull/74 | merged |
| 2   | 2026-10-25-session-names (snap-bmr.14.2) | Readable dates everywhere, and a rename keeps the date (`session-names/2-readable-dates`)                  | https://github.com/cdudek/snapmark/pull/79 | merged |

## Done

- Every feature above is `merged` into `milestone/session-names`.
- `python3 scripts/verify_gate.py milestone 2026-10-25-session-names` ends `VERIFY PASS milestone`.
- `findings.md` has no open blocking item after the one fix round.
- One PR from `milestone/session-names` to `project/launch`, auto-merge armed.

## Outcome

Written after release (Stage 7): the success measure from `intent.md`, read where it says.

- **Measured:** — on — — **target:** no complaint in the first week — **met:** —
