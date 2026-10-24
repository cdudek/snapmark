---
linear: none
type: intent
change: 2026-10-25-window-capture-copy-save
design: null
author: calvin.dudek@omr.com
status: approved
reviewed_by: calvin.dudek@omr.com (roadmap and mockups, 2026-10-25)
approved_at: 2026-10-25
created: 2026-10-25
archived_at: 2026-10-25
---

# Intent: Window capture, Copy Image and Save As (roadmap M2)

## Problem

- **Today:** one window needs a hand-dragged region, which never lands exactly on its edges.
- **Today:** a marked-up image can only leave the editor by going into the session; pasting it into a chat or ticket, or keeping it as a file, is not possible.
- **The owner (2026-10-25):** "We can add watermark text, even save as, and just copy it."

## Proposed outcome

- **Capture Options ▸ Capture Window…:** click one window; it opens in the editor cropped to its edges.
- **Copy Image (⇧⌘C) and Save As… (⇧⌘S) in the editor:** the marked-up image to the clipboard or a PNG file, without adding it to the session.

## Affected users and systems

- **Users:** the owner, sharing a marked screenshot outside an AI session.
- **Systems:** the menu, `screencapture`, the editor toolbar and keys, the main process (clipboard, save dialog).

## Constraints

- **Not the default:** no global shortcut for window capture; Add to session stays the primary action.
- **Plain ⌘C keeps copying text** in notes, cards and the comment.
- **Same image:** what is copied or saved matches what Add to session saves.

## Open questions

None.
