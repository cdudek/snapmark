---
linear: none
type: intent
change: 2026-10-25-scrolling-capture
design: null
author: calvin.dudek@omr.com
status: approved
reviewed_by: calvin.dudek@omr.com (roadmap and mockups, 2026-10-25)
approved_at: 2026-10-25
created: 2026-10-25
archived_at: 2026-10-25
---

# Intent: Capture Scrolling (roadmap M3)

## Problem

- **Today:** a page taller than the screen needs one capture per screen, one entry each.
- **The owner (2026-09-28, 2026-10-25):** "take a screenshot while scrolling down the area so we easily take a whole screenshot of everything and then concatenate it somehow … without it being a Chrome extension … This shouldn't be the default."

## Proposed outcome

- **Capture Options ▸ Capture Scrolling…:** drag an area, scroll the content under it, press Done; one tall screenshot opens in the normal editor and goes into the session like any other.

## Affected users and systems

- **Users:** the owner, reviewing long pages.
- **Systems:** the menu, the area picker, a new control window, a new stitching module, the editor's fit to the window.

## Constraints

- **No browser extension, no new permission:** frames come from `screencapture -R`, which Snapmark already uses.
- **Not the default:** a menu item under Capture Options, no global shortcut.
- **No heavy dependency:** stitching is plain TypeScript on raw pixels.

## Open questions

None. Tiles for the AI (a tall page shrunk to 1568 px is narrow) are left for a later change.
