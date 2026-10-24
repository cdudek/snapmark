---
linear: none
type: intent
change: 2026-10-25-ocr-auto-redact
design: null
author: calvin.dudek@omr.com
status: approved
reviewed_by: calvin.dudek@omr.com (roadmap and mockups, 2026-10-25)
approved_at: 2026-10-25
created: 2026-10-25
archived_at: 2026-10-25
---

# Intent: OCR and auto-redact (roadmap M4)

## Problem

- **Today:** the agent reads the text in a screenshot off pixels, shrunk to the AI's size limits; small UI text gets lost. Emails, keys and tokens on screen go into the session, to the clipboard and into exports unless the owner remembers to draw a Redact mark over each.
- **Roadmap M4 (agreed 2026-10-25):** "the text in a screenshot goes into session.md next to the notes, so the agent can read what the image shows" and "finds emails, keys and tokens and pixelates them before an image leaves the Mac (copy, Save As, export)".

## Proposed outcome

- **Text in session.md:** each entry ends with a collapsed _Text in the screenshot_ block, in reading order, capped, with `[redacted]` where a Redact mark hides it.
- **Auto-redact:** when the editor opens a screenshot, the existing Redact marks land on detected secrets, visible, deletable and undoable as one step, with a quiet line in the side panel.

## Affected users and systems

- **Users:** the owner, and the agents reading the sessions.
- **Systems:** main (text recognition in a child process), the editor (marks, side panel), `session.md` writing, the session window's Document tab, the PDF export, the copied prompt.

## Constraints

- **No new heavy dependency:** macOS's Vision through `osascript -l JavaScript`; no helper binary to build or sign.
- **Never blocks opening the editor;** off the main thread, with a timeout; a no-op on Linux CI, where the smoke test stubs it.
- **No setting** unless detection turns out noisy.

## Open questions

None.
