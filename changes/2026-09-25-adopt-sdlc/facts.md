---
linear: none
bead: snap-64x
type: facts
change: 2026-09-25-adopt-sdlc
design: null
author: calvindudek@googlemail.com
status: approved
reviewed_by: calvindudek@googlemail.com (Plannotator gate)
approved_at: 2026-09-25
created: 2026-09-25
---

# Facts: Adopt the AI-native SDLC in Snapmark, with Beads as tracker

## Goal

Every later change in Snapmark runs through the chain: a change folder, facts, an approved plan,
one PR that auto-merges on green CI. Work is tracked in Beads, not Linear, because Snapmark is a
personal repo outside the OMR workspace. It is one change because the hooks, the guardrail test
and the tracker only make sense together.

## Acceptance criteria

### The chain

- [ ] **F1** The repo shall have `sdlc.json` with `tiers: false`, `claude: false`, `defaultBranch: main` and npm commands.
- [ ] **F2** When a change folder has no `decisions.json`, the chain-gate hook shall refuse writes to that folder.
- [ ] **F3** When anyone runs `npm install <package>` in a Claude Code session, the bash gate shall block it with the dependency message.
- [ ] **F4** The guardrail test shall run inside `npm test` and pass.

<details>
<summary>Verification</summary>

- F1 — automated: `tests/sdlc.test.ts`
- F2, F3 — automated: `tests/sdlc.test.ts` runs the hooks with piped payloads
- F4 — automated: `npm test` exits 0

</details>

### The tracker

- [ ] **F5** Beads shall hold one issue per change, with prefix `snap`.
- [ ] **F6** Every change file shall carry its Beads id as `bead:` in the frontmatter, with `linear: none`.

<details>
<summary>Verification</summary>

- F5 — manual: `bd list` shows `snap-64x` (this change) and `snap-0wm` (the UX audit)
- F6 — manual: this folder's frontmatter

</details>

## Verification

- **Automated:** `npm run format && npm run lint && npm run typecheck && npm test` exits 0, in CI on the PR too.
- **Manual:** the owner approves this file and `plan.md` in Plannotator.

## Out of scope

- Claude PR review workflows and the Ship/Show/Ask tiers — off by the owner's choice; switch on in `sdlc.json` later.
- Syncing Beads to GitHub — the Beads database stays local, in the main checkout's `.beads/`.
- The UX audit itself — its own change, tracked as `snap-0wm`.

## Open questions

None.
