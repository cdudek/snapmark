---
linear: none
type: facts
change: 2026-10-27-calm-style
design: null
author: Claude (orchestrator)
status: approved
reviewed_by: Calvin Dudek
approved_at: 2026-10-27
created: 2026-10-27
---

# Facts: a calm Snapmark on the owner's design system

## Goal

Every window takes its colours, sizes and shapes from design-system-starter. Surfaces and text use macOS system colours. The owner's blue fills one button per window, plus checkboxes and switches that are on. Nothing has an outline until the owner presses Tab. The capture bar is one row. Nothing a control does changes. The look per window is in [spec/screens.md](spec/screens.md).

## Acceptance criteria

The system is Snapmark. Every fact cites its asks and its window.

Tags: each fact's check carries `@F<n>` beside `@2026-10-27-calm-style` in its title. Rendering checks are keyed strings in `snapmark-app/test/smoke.ts`. Source checks are plain-Node blocks in `snapmark-app/test/style.test.ts`. Every check runs once per milestone, inside `verify_gate.py milestone`.

"Accent" means the brand blue `#0f72db` (`--ds-color-accent`). "At rest" means no hover, no press and no keyboard focus.

## Milestone 1: tokens and the one-row capture bar

- [ ] **F1** (A1, A7) `snapmark-app/src/tokens.css` shall be the design-system-starter build at commit 3048d42, with Snapmark's accent. Its first line names that commit. Screen/state: none. Tag: `@F1`.
- [ ] **F2** (A1, A7) If `tokens.css` differs from the hash in `snapmark-app/design/tokens.lock.json`, then the check shall fail. Screen/state: none. Tag: `@F2`.
- [ ] **F3** (A2) Every window shall load `tokens.css` and set `data-surface="system"` on its root. Screen/state: every window. Tag: `@F3`.
- [ ] **F4** (A1, A5) The capture bar shall be one row, at most 56 pt tall at 100 %. Screen/state: capture bar, default. Tag: `@F4`.
- [ ] **F5** (A1, A5) Each mode button shall show its icon and name side by side on one line. No shortcut caption shall show under or beside it. Screen/state: capture bar. Tag: `@F5`.
- [ ] **F6** (A2, A3) In the capture bar, only Capture shall have the accent as a fill. No icon, label, border or outline shall be the accent. Screen/state: capture bar, every mode. Tag: `@F6`.
- [ ] **F7** (A2, A3) The chosen mode shall have the `soft` fill and normal text colour. Screen/state: capture bar, every mode. Tag: `@F7`.
- [ ] **F8** (A2) At rest, no control in the bar shall have a border or an outline. Screen/state: capture bar, just opened. Tag: `@F8`.
- [ ] **F9** (A2) When the bar opens, no focus ring shall show. Screen/state: capture bar, just opened. Tag: `@F9`.
- [ ] **F10** (A2) When the owner presses Tab, the focused control shall show a 2 pt ring in the system focus colour, 2 pt outside it. Screen/state: capture bar, after Tab. Tag: `@F10`.
- [ ] **F11** (A3, A5) Each control's key shall be in its tooltip. Capture alone shall show ↩. Screen/state: capture bar, hover. Tag: `@F11`.
- [ ] **F12** (A5) The destination shall be one pop-up reading "To <session> ▾", or "One-Shot ▾". Its first item shall be One-Shot. Screen/state: capture bar, Session and One-Shot. Tag: `@F12`.
- [ ] **F13** (A5) Picking in the pop-up, ⇧⌘O and ⇧⌘P shall do what the segment and pop-up do in v0.24.0. Screen/state: capture bar. Tag: `@F13`.
- [ ] **F14** (A1) On a 900 pt work area at 130 %, every bar control shall sit inside the window. Screen/state: capture bar, narrow. Tag: `@F14`.
- [ ] **F15** (A7) `bar.html` shall use no colour literal. Its colours shall come from `--ds-*` tokens. Screen/state: none. Tag: `@F15`.

## Milestone 2: pop-up panels, recording and auto-scroll

- [ ] **F16** (A2) The countdown, area picker, scrolling control and recording control shall use the system material and system text colours, in light and dark. Screen/state: each panel, light and dark. Tag: `@F16`.
- [ ] **F17** (A2, A3) Each panel shall fill at most one control with the accent: Done or Stop. Screen/state: scrolling and recording control. Tag: `@F17`.
- [ ] **F18** (A2) The area outline on screen shall be white with a dark shadow, not blue. Screen/state: area picker, countdown. Tag: `@F18`.
- [ ] **F19** (A2) At rest, no panel control shall have a border or outline. On open, no focus ring shall show. Screen/state: each panel, just opened. Tag: `@F19`.
- [ ] **F20** (A6) Picked-designs milestones 3 and 4 shall ship in this style. Their facts shall pass by their own tags. Screen/state: Record, Capture Scrolling. Tag: `@F20`.
- [ ] **F21** (A6) The capture bar shall gain Record as its sixth mode, and stay one row at most 56 pt tall. Screen/state: capture bar, Record. Tag: `@F21`.
- [ ] **F22** (A7) The panels' `.html` files shall use no colour literal. Screen/state: none. Tag: `@F22`.

## Milestone 3: editor, session window, Settings and Keyboard Shortcuts

- [ ] **F23** (A2, A3) Each of these windows shall fill at most one button, its main action, with the accent. Screen/state: each window, default. Tag: `@F23`.
- [ ] **F24** (A2) The chosen tool, tab and row shall have the `soft` fill and normal text colour. No icon or label shall be the accent. Screen/state: editor toolbar, Settings tabs, session list. Tag: `@F24`.
- [ ] **F25** (A2) At rest, no control shall have a border or outline, and no focus ring shall show on open. Screen/state: each window, just opened. Tag: `@F25`.
- [ ] **F26** (A1) At the editor's minimum size, tools that do not fit shall move into a More menu. No tool shall be clipped. Screen/state: editor, minimum size. Tag: `@F26`.
- [ ] **F27** (A1, A3) Settings shall show its tabs as a pill segmented control. The window shall grow to fit each tab, with no clipping and no scroll at 100 % and 130 %. Screen/state: Settings, every tab. Tag: `@F27`.
- [ ] **F28** (A2) A checkbox or switch that is on shall fill with the accent, with a white mark. Screen/state: Settings, editor. Tag: `@F28`.
- [ ] **F29** (A1) Page zoom shall stop at 130 %. Every window shall fit at 100 % and 130 % with nothing outside it. Screen/state: every window, 130 %. Tag: `@F29`.
- [ ] **F30** (A7) No `.html` file in `snapmark-app/src/` shall use a colour literal, except the annotation palette. Screen/state: none. Tag: `@F30`.
- [ ] **F31** (A1) The annotation colours and marks shall be exactly as in v0.24.0. Screen/state: editor, marks. Tag: `@F31`.

## Non-functional

- [ ] **N1** (A2) Text on every surface shall meet 4.5:1, and the focus ring 3:1, in light and dark. Tag: `@N1`.
- [ ] **N2** (A1) Every check that passed in v0.24.0 shall still pass, except checks for replaced styles, logged under the plan's Revisions. Tag: `@N2`.
