---
linear: none
type: facts
change: 2026-10-25-session-window
design: null
author: calvin.dudek@omr.com
status: approved
reviewed_by: calvin.dudek@omr.com (roadmap M1b and the round-2 mockups, 2026-10-25)
approved_at: 2026-10-25
created: 2026-10-25
archived_at: 2026-10-25
---

# Facts: the session window's new look and features (roadmap M1b)

## Goal

The session window looks like the approved Native mockups
(`design-explorations/2026-10-25-native-round-2/02-session-window/`) and lets the owner rename the
session in place, see every screenshot as a grid, and bring back what was discarded from it.

## Acceptance criteria

### Look

- [x] **F1** App UI accents (selected segment, primary buttons, focus ring, hovered thumbnail outline, rename field) are brand blue #2492FF; the old rose #e11d48 is gone from the window. Light and dark mode both.
- [x] **F2** The note numbers under each screenshot in Document are coral red #E5484D, the annotation colour.
- [x] **F3** The header shows the app icon, the session name, a pencil on hover, "· N screenshots" (singular for 1, nothing for 0), then Document | Screenshots | Discarded N (hidden when N is 0) and Open in Markdown App.

### Rename in place

- [x] **F4** Clicking the name or the pencil turns it into a field with the name selected and the hint "↩ to save · Esc to cancel".
- [x] **F5** ↩ (or clicking away) renames through the same logic as the menu's Rename Session…: folder, session.md title, current session, open editors, open session windows and the window title.
- [x] **F6** An empty or taken name shows an inline message and keeps the field open; Esc cancels.
- [x] **F7** The menu's Rename Session… still works.

### Screenshots

- [x] **F8** The Screenshots tab is a grid of every entry in session.md (4 per row at the default width, responsive), each with its heading and note count.
- [x] **F9** Hover shows Edit Again (when the marks were kept) and "…" ▸ Remove from Session, which behave as before.
- [x] **F10** Clicking a thumbnail opens the one-at-a-time view (←, "1 of N", →, Edit Again, Remove from Session); Esc and "‹ All Screenshots" go back to the grid.

### Discarded

- [x] **F11** The Discarded tab lists this session's discarded screenshots from the last 7 days, newest first: thumbnail, when ("Today, 22:10", "Yesterday, 18:02", "Mon, 09:41"), what ("Closed without saving" / "Removed from session") and a brand-blue Reopen with the existing reopen behaviour, under "Discarded screenshots are kept for 7 days."
- [x] **F12** Discarded screenshots follow their session through a rename.
- [x] **F13** The menu's Discarded Screenshots ▸ still lists everything, across sessions.

### Document

- [x] **F14** The Document tab still edits session.md in place; a change to the Discarded list alone does not reload the text being typed.
