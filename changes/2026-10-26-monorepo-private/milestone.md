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

| #   | Change                      | Feature                                    | PR or commit                               | State                            |
| --- | --------------------------- | ------------------------------------------ | ------------------------------------------ | -------------------------------- |
| 0   | 2026-10-26-monorepo-private | Owner: billing linked to `snapmark-ai`     | none                                       | done (Calvin Private N26)        |
| 1   | 2026-10-26-monorepo-private | GCP: bucket, public read, WIF, uploader    | none                                       | done (ADR › Setup)               |
| 2   | 2026-10-26-monorepo-private | Updates from the bucket; upload and prune  | bf4d120                                    | done bf4d120                     |
| 3   | 2026-10-26-monorepo-private | The app in `snapmark-app/`; root workspace | 5be9bd4, ebe2eee, 3a8f7b6, 76857cf         | done 76857cf                     |
| 4   | 2026-10-26-monorepo-private | ADR and design index                       | 9bd5f90                                    | done 9bd5f90                     |
| PR  | 2026-10-26-monorepo-private | milestone/monorepo-private-1 → main        | https://github.com/cdudek/snapmark/pull/97 | open, CI green; auto-merge armed |

## Done

- Every feature above is `done` on `milestone/monorepo-private`.
- `python3 scripts/verify_gate.py milestone 2026-10-26-monorepo-private` ends `VERIFY PASS milestone`.
- `findings.md` has no open blocking item after the one fix round.
- One PR from `milestone/monorepo-private` to the default branch, auto-merge armed.

## Outcome

Written after release (Stage 7): the success measure from `intent.md`, read where it says.

- **Measured:** <value> on <date> — **target:** <target> — **met:** <yes | no → next change>
