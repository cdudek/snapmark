---
linear: none
type: intent
change: 2026-10-25-one-shot-mode
design: null
author: calvin.dudek@omr.com
status: approved
reviewed_by: calvin.dudek@omr.com (roadmap and mockups, 2026-10-25)
approved_at: 2026-10-25
created: 2026-10-25
archived_at: 2026-10-25
---

# Intent: One-shot mode (roadmap M5)

## Problem

- **Today:** every screenshot goes into a session, at the AI's size. A screenshot meant for people (slides, a chat, a post) has nowhere to go and no way to look finished.
- **The owner (2026-10-25):** "you create a screenshot and make it look nice. You can add padding inside, rounded corners, a shadow, and a background … so you can copy it into presentations. We can specify the ratio … Generally I would like to keep the app simple … if we can switch between different modes, like session mode and one-shot mode, why not?"
- **Research (docs/market/2026-10-25-feature-comparison.md):** beautify in one-shot mode only, one preset, skip watermark.

## Proposed outcome

- **Capture Options ▸ One-Shot Capture…** captures a region and opens the editor in one-shot mode.
- **Beautify** in the side panel: padding, rounded corners, shadow, background, ratio, with a live preview; the last settings are the one preset.
- **Copy Image** (main button, ⌘C) and **Save As…** give the beautified image at full resolution; nothing goes into a session.

## Affected users and systems

- **Users:** the owner, sharing a screenshot with people.
- **Systems:** the menu, the editor (panel, preview, flatten, keys), the main process (copy, save, state, discard).

## Constraints

- **Session mode stays exactly as it is.**
- **Two colour systems:** the panel's controls are app UI in brand blue; backgrounds are content.
- **No new global shortcut** unless clearly free and safe (⌃⇧2 is not).
- **No watermark, one preset, no gallery.**

## Open questions

None.
