---
linear: none
type: spec
change: 2026-10-27-calm-style
design: null
author: Claude (orchestrator)
status: approved
reviewed_by: Calvin Dudek
approved_at: 2026-10-27
created: 2026-10-27
---

# Screens: what changes per window

The rules for every window: system material and text colours; the accent fills the main button only; the chosen option is the `soft` pill; hover uses `soft-hover`; no border or outline at rest; the focus ring only after Tab. Controls are 32 pt tall with 8 pt radius. Text is 13 pt at weight 400, and 600 on the main button. Panels have a 12 pt radius.

## Capture bar (`bar.html`)

The approved mock, one row: ✕ | New Area · Window · Full Screen · Last Area · Scrolling · Record | To Ledgerly Q4 review ▾ · Options ▾ · **Capture ↩**.

- The headline, the hint row and the hairline go.
- Keys move into tooltips: "New Area (1)", "Destination (⇧⌘P)".
- The destination pop-up lists One-Shot, then recent sessions, then Older Sessions… and New Session. Its face is "To <session>" or "One-Shot".
- Capture's label follows the mode: Capture, Record, Start Scrolling.

## Panels (`countdown.html`, `area.html`, `scroll.html`, `recorder.html`)

- System material, following light and dark.
- The area outline is white with a dark shadow, as macOS draws it.
- Scrolling and recording: Esc is a plain icon; Done or Stop is the one blue button.

## Editor (`editor.html`)

- The chosen tool is a `soft` pill with an ink icon.
- Add to Session, or Copy in One-Shot, is the one blue button.
- Fields have no edge: a `soft` fill.
- Tools that don't fit go into a More (⋯) menu at the end of the toolbar.

## Session window (`viewer.html`)

- Selected rows use the `soft` fill. No blue text or icons.

## Settings (`settings.html`) and Keyboard Shortcuts (`shortcuts.html`)

- The tabs are a pill segmented control under the title bar, with no blue tile.
- The window grows with each tab's content.
- A switch that is on uses the accent.
