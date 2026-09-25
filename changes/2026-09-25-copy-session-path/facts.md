---
linear: none
bead: snap-jpx
type: facts
change: 2026-09-25-copy-session-path
design: null
author: calvindudek@googlemail.com
status: approved
reviewed_by: calvindudek@googlemail.com (Plannotator gate)
approved_at: 2026-09-25
created: 2026-09-25
---

# Facts: Copy the current session's Markdown path from the menu bar

## Goal

The owner copies the full path of the current session's `session.md` from the menu bar and pastes
it into an AI agent's chat. It answers the owner's request of 2026-09-25: "I want to be able to
copy and paste the path to the Markdown from the current session. I just paste it and then I can
point the AI to it."

## Acceptance criteria

- [ ] **F1** When the owner clicks "Copy session.md path" in the menu bar menu, Snapmark shall put the absolute path of the active session's `session.md` on the clipboard, and nothing else.
- [ ] **F2** While no session exists, the menu item shall be disabled.
- [ ] **F3** The item shall sit directly below "Open session.md".

<details>
<summary>Verification</summary>

- F1 — automated: `test/smoke.ts` checks the exported path function returns `<root>/<session>/session.md`, absolute
- F2, F3 — read in the code: the menu template in `src/main.ts`; manual: the owner opens the menu in the installed app

</details>

## Verification

- **Automated:** `npm run format && npm run lint && npm run typecheck && npm test` exits 0; `npm run smoke` passes.
- **Manual:** the owner clicks the item and pastes into Claude Code.

## Out of scope

- A global shortcut for it. None was asked for, and `⌘⇧1`/`⌘⇧2` are the only global keys today.
- Changing "Copy prompt for AI", which stays as it is.
- Fixing any audit finding. Those go through the decision round first.

## Open questions

None.
