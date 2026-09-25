---
linear: none
bead: snap-64x
type: plan
change: 2026-09-25-adopt-sdlc
design: null
author: calvindudek@googlemail.com
status: approved
reviewed_by: calvindudek@googlemail.com (Plannotator gate)
approved_at: 2026-09-25
created: 2026-09-25
---

# Plan: Adopt the AI-native SDLC in Snapmark, with Beads as tracker

> Install the change chain, its hooks and its guardrail test, and track work in Beads.

A person with no context builds from this file alone. [facts](facts.md) are for the gate, not for
the build.

## Approach

- **What changes:** the repo gains `sdlc.json`, seven Claude Code hooks, the change template, `docs/sdlc.md` and a guardrail test in `npm test`. Beads becomes the tracker.
- **What stays the same:** the app, CI, the release workflow, and the `main` ruleset that requires the `check` job.
- **Why this way:** one owner, so no tiers and no Claude review. Beads, because Snapmark is personal and lives outside the OMR Linear workspace.
- **Write first, and say so:** `adopt.py` generates every file, so the artifact exists before the gate. The gate approves the diff as it stands.
- **Rejected:**
  - Linear — personal project in a work workspace.
  - Claude PR review — needs an API key secret and costs tokens on every PR.

## Design changes

None.

## Files that change

| File                                                           | Change                                                                                     |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `sdlc.json`                                                    | new: npm commands, `main`, `tiers: false`, `claude: false`, only the dependency block rule |
| `.claude/settings.json`, `.claude/hooks/*.sh`                  | new: the seven SDLC hooks, plus the `bd prime` hook from `bd init`                         |
| `.gitignore`                                                   | tracks `.claude/settings.json` and the hooks                                               |
| `docs/sdlc.md`, `CLAUDE.md`, `REVIEW.md`, `AGENTS.md`          | new: how the chain and Beads work here                                                     |
| `.github/ISSUE_TEMPLATE/*`, `.github/PULL_REQUEST_TEMPLATE.md` | new templates                                                                              |
| `tests/sdlc.test.ts`                                           | new guardrail test                                                                         |
| `package.json`, `package-lock.json`                            | `vitest` dev dependency; `npm test` runs the guardrail; `sdlc:tools` script                |
| `changes/2026-09-25-adopt-sdlc/`                               | this change                                                                                |

## Order of work

- [x] 1. Write `sdlc.json` for this repo, then run `adopt.py --preset node` — proof: the files above exist
- [x] 2. `bd init --prefix snap`; create `snap-64x` and `snap-0wm` — proof: `bd list` shows both
- [x] 3. Stage and run verify — proof: `npm test` shows 27 passed in `tests/sdlc.test.ts`
- [ ] 4. Open the PR, arm auto-merge — proof: CI `check` passes on the PR
- [ ] 5. Archive the folder once the PR is green — proof: `changes/archive/2026/2026-09/2026-09-25-adopt-sdlc/` exists
- [ ] 6. Close `snap-64x` after merge — proof: `bd show snap-64x` says closed

## Risks

| Risk                                                                       | What we do                                                       | Where it lands |
| -------------------------------------------------------------------------- | ---------------------------------------------------------------- | -------------- |
| CI has no `vitest` run for the guardrail beyond `npm test`                 | `npm test` runs it, and CI runs `npm test`                       | step 3         |
| The Beads database is local only, so it's lost with the laptop             | Accepted for a personal project; Dolt remotes can sync it later  | accepted       |
| Hooks block dependency installs, so later changes that need a package stop | That is the rule: a human adds the package and says so in the PR | accepted       |

## Out of scope

- Claude PR review and Ship/Show/Ask tiers.
- Syncing Beads anywhere.
- The UX audit (`snap-0wm`), which is its own change.

## Done

- `npm run format && npm run lint && npm run typecheck && npm test` exits 0.
- `sdlc.json` contains `"tiers": false` and `"claude": false`.
- F1 to F6 hold by their named checks.
- Nothing outside `## Files that change` is edited.
- Stop and report as soon as a step cannot proceed. Never work around a blocker.

## Goal handover

none — the artifact is this PR's diff. `adopt.py` wrote every file before the gate, so there is no
build left to hand over.

## Revisions

Only after approval. One line per change: `YYYY-MM-DD — what changed, and why`.
