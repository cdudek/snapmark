---
linear: none
bead: snap-om3
type: facts
change: 2026-09-25-menu-layout
design: null
author: calvindudek@googlemail.com
status: approved
reviewed_by: calvindudek@googlemail.com (Plannotator gate)
approved_at: 2026-09-25
created: 2026-09-25
archived_at: 2026-09-25
---

# Facts: Menu bar menu — new layout, labels and behaviour

## Goal

The owner opens the menu bar menu and it says what it is, reads in the order of a review, and each
item says what it does. It builds the owner's menu decisions of 2026-09-25
(`docs/ux/decisions-2026-09-25-menu.md`), except the two that depend on the editor's new keys and
tool names, which go with the editor change.

## Acceptance criteria

### Layout and labels

- [ ] **F1** The menu shall show, in this order: header "Snapmark" · "Capture region" · "New session" · separator · the session header · "Copy prompt for AI" · "Copy file path" · "Open feedback file" · "Show in Finder" · "Rename session…" · "Export" ▸ · separator · "Switch session" ▸ · "Settings" ▸ · "Quit Snapmark".
- [ ] **F2** While a session is current, the session header shall read "Current session: <name> · <n> screenshot(s)", where a date-named session shows as "25 Sep 12.03".
- [ ] **F3** While no session exists, the session header shall read "No session yet: press ⇧⌘1 to start one", and the session items shall be disabled.
- [ ] **F4** While the current session has no screenshots, "Export" shall be disabled.
- [ ] **F5** "Settings" shall hold: "Open at login" · "Sessions are saved in <folder>" (opens that folder in Finder) · "Change where sessions are saved…" · "Check for updates…" · "Version <version>".
- [ ] **F6** The menu shall be rebuilt each time it opens.

### Copying

- [ ] **F7** When the owner clicks "Copy prompt for AI", Snapmark shall show the notification "Prompt for <name> copied. Paste it into your AI agent."
- [ ] **F8** When the owner clicks "Copy file path", Snapmark shall copy the absolute path of the session's session.md and show "Path to <name> copied."

### Sessions

- [ ] **F9** When the owner clicks "Rename session…" and enters a new name, Snapmark shall rename the session's folder and keep it current.
- [ ] **F10** "Switch session" shall list sessions by last use, most recent first, at most 20, then "Other session…", which opens a folder chooser in the sessions folder.
- [ ] **F11** Each listed session shall have a submenu: "Make current" · "Copy prompt for AI" · "Export" ▸ · "Show in Finder", acting on that session without making it current (except "Make current").
- [ ] **F12** When the owner presses ⇧⌘2 while the current session has no screenshots, Snapmark shall keep that session instead of creating another.
- [ ] **F13** If the current session's folder or session.md is missing when "Open feedback file" or "Show in Finder" is clicked, Snapmark shall show "<name> is no longer in <folder>", and clicking it shall open the menu.

### Quit, updates, shortcuts

- [ ] **F14** When the owner quits while an editor has marks or text, Snapmark shall bring that editor forward and ask "<n> screenshot(s) are not in a session yet." with "Review" and "Quit anyway".
- [ ] **F15** When the owner clicks "Check for updates…", Snapmark shall always answer: "Snapmark <version> is up to date", "Downloading Snapmark <version>…", or "Couldn't check for updates: <reason>".
- [ ] **F16** While a downloaded update waits, the menu shall show "Restart to install <version>" under the header.
- [ ] **F17** The menu shall show ⇧⌘1 and ⇧⌘2 next to their items only when Snapmark registered them, and "(shortcut unavailable)" otherwise.

<details>
<summary>Verification</summary>

- F1–F5, F11, F16, F17 — automated: the smoke test builds the menu template with fixed state and checks labels, order and enabled flags
- F2, F12 — automated: `test/sessions.test.ts` for the screenshot count, the short date and the empty-session check
- F9, F10 — automated: rename and last-use order in `test/sessions.test.ts`; the chooser by hand
- F6–F8, F13–F15 — manual: the owner in the installed app (menus, notifications and quit cannot be driven in CI)

</details>

## Verification

- **Automated:** `npm run format && npm run lint && npm run typecheck && npm test` exits 0; `npm run smoke` passes.
- **Manual:** the owner rebuilds, installs, and goes through the menu once.

## Out of scope

- "Keyboard shortcuts…" and a prompt that explains every mark. Both list the editor's keys and tool names, which the editor change renumbers and renames; they ship with it.
- Everything in the editor window.

## Open questions

None.
