---
linear: none
bead: snap-jpx
type: plan
change: 2026-09-25-copy-session-path
design: null
author: calvindudek@googlemail.com
status: approved
reviewed_by: calvindudek@googlemail.com (Plannotator gate)
approved_at: 2026-09-25
created: 2026-09-25
archived_at: 2026-09-25
---

# Plan: Copy the current session's Markdown path from the menu bar

> Add a "Copy session.md path" menu item that puts the absolute path on the clipboard.

A person with no context builds from this file alone. [facts](facts.md) are for the gate, not for
the build.

## Approach

- **What changes:** one exported function `sessionMdPath(dir)` and one menu item, directly below "Open session.md" in `src/main.ts`, that writes its result with `clipboard.writeText`.
- **What stays the same:** every other menu item, including "Copy prompt for AI", which already uses the same path inside its prompt.
- **Why this way:** `promptFor` already builds `path.join(dir, 'session.md')`. Both call one function, so the two items can never disagree about the path.
- **Rejected:**
  - Changing "Copy prompt for AI" to copy only the path — the owner asked for the path, not for the prompt to go away.
  - A global shortcut — not asked for.

## Design changes

None.

## Files that change

| File                                           | Change                                                                                           |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `src/main.ts`                                  | `export function sessionMdPath(dir)`; `promptFor` uses it; new menu item below "Open session.md" |
| `test/smoke.ts`                                | one check: `sessionMdPath` returns the absolute `<root>/smoke/session.md`                        |
| `README.md`                                    | one sentence about the new item, next to "Copy prompt for AI"                                    |
| `changes/2026-09-25-copy-session-path/plan.md` | tasks ticked                                                                                     |

## Order of work

- [x] 1. Add `sessionMdPath(dir)` and make `promptFor` use it — proof: `npm run typecheck` exits 0
- [x] 2. Add `{ label: 'Copy session.md path', enabled: !!dir, click: () => dir && clipboard.writeText(sessionMdPath(dir)) }` directly below "Open session.md" — proof: `grep -A1 "Open session.md" src/main.ts` shows it
- [x] 3. Smoke check for F1 — proof: `npm run smoke` prints `✓ session.md path is absolute`
- [x] 4. README sentence — proof: `grep "Copy session.md path" README.md`
- [x] 5. Verify, open the PR, arm auto-merge, archive the folder, close `snap-jpx` after merge — proof: CI `check` passes

## Risks

| Risk                                                         | What we do                                                                                                | Where it lands |
| ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- | -------------- |
| The menu item can't be clicked in CI                         | The path function is tested; the item itself is checked by reading the code and by the owner              | step 3, manual |
| Paths with spaces (e.g. `2026-09-25 12.03`) confuse an agent | Copy the plain path; Claude Code and shells accept it when pasted as a quoted or plain argument. Accepted | accepted       |

## Out of scope

- A global shortcut.
- Any audit finding.

## Done

- `npm run format && npm run lint && npm run typecheck && npm test` exits 0.
- `npm run smoke` passes, including `✓ session.md path is absolute`.
- `src/main.ts` has the "Copy session.md path" item directly below "Open session.md", disabled without a session.
- F1 to F3 hold by their named checks.
- Nothing outside `## Files that change` is edited, apart from archiving this folder.
- Stop and report as soon as a step cannot proceed. Never work around a blocker.
- Stop after 30 turns if not met. Report what is missing.

## Goal handover

```
/goal Build changes/2026-09-25-copy-session-path/plan.md in its order of work; every outcome in
changes/2026-09-25-copy-session-path/facts.md must hold; tick tasks as they land; log departures
under ## Revisions.

Done:
- `npm run format && npm run lint && npm run typecheck && npm test` exits 0.
- `npm run smoke` passes, including `✓ session.md path is absolute`.
- `src/main.ts` has the "Copy session.md path" item directly below "Open session.md", disabled without a session.
- F1 to F3 hold by their named checks.
- Nothing outside `## Files that change` is edited, apart from archiving this folder.
- Stop and report as soon as a step cannot proceed. Never work around a blocker.
- Stop after 30 turns if not met. Report what is missing.
```

## Revisions

Only after approval. One line per change: `YYYY-MM-DD — what changed, and why`.

- 2026-09-25 — "Open session.md" also uses `sessionMdPath`, so all three places build the path one way. Same file, no behaviour change.
