---
linear: none
type: facts
change: 2026-10-26-picked-designs
design: null
author: Claude (orchestrator)
status: draft
reviewed_by: null
approved_at: null
created: 2026-10-26
---

# Facts: the capture bar, editor and recording the owner picked on 2026-10-26

## Goal

Capturing follows macOS's digits, and the capture bar always says what Capture will do. The editor shows and changes where a screenshot goes. Snapmark records short GIFs whose key frames an AI can read, and Capture Scrolling scrolls by itself. The words, states and layouts are in [spec/screens.md](spec/screens.md) and [spec/interaction.md](spec/interaction.md).

## Acceptance criteria

The system is Snapmark. Every fact cites its asks and its spec screen or state. The answers Q1–Q13 are in [spec/brief.md](spec/brief.md), Answers.

Tags: each fact's check carries `@F<n>` beside `@2026-10-26-picked-designs` in its title. Smoke checks are keyed strings in `snapmark-app/test/smoke.ts`. Unit checks are plain-Node blocks in `snapmark-app/test/*.test.ts`, headed by a comment with the same tags. Every check runs once per milestone, inside `verify_gate.py milestone`.

## Milestone 1: capture bar, keys and countdown

### Global keys

- [ ] **F1** (A4) When the owner presses ⌃⇧1, Snapmark shall open the area picker and capture the dragged area. Screen/state: area picker, default. Tag: `@F1`.
- [ ] **F2** (A4) When an area is dragged after ⌃⇧1, Snapmark shall keep it as the last area for ⌃⇧4. Screen/state: area picker. Tag: `@F2`.
- [ ] **F3** (A4) When the owner presses ⌃⇧2, Snapmark shall open macOS's capture overlay, then open the result in the editor in One-Shot. Screen/state: editor, One-Shot. Tag: `@F3`.
- [ ] **F4** (A4) When the owner presses ⌃⇧3, Snapmark shall capture every display at once, with no picker, and open one editor per display. Screen/state: editor, Session. Tag: `@F4`.
- [ ] **F5** (A4) While an area is set, when the owner presses ⌃⇧4, Snapmark shall capture that area at once. Screen/state: editor, Session. Tag: `@F5`.
- [ ] **F6** (A4) If no area is set when ⌃⇧4 is pressed, then Snapmark shall open the area picker first. Screen/state: area picker, first time. Tag: `@F6`.
- [ ] **F7** (A4) When a New Session starts, Snapmark shall forget the area, and the next ⌃⇧4 picker shall say "New session: drag the area". Screen/state: area picker, after New Session. Tag: `@F7`.
- [ ] **F8** (A4) The menu bar menu shall list the five capture rows of screens.md, in order, each with its key. Screen/state: menu bar menu. Tag: `@F8`.
- [ ] **F9** (A4) The Keyboard Shortcuts window shall list every key in screens.md's rows that this milestone ships, read from `keys.ts`. Screen/state: Keyboard Shortcuts window. Tag: `@F9`.
- [ ] **F10** (A1, A4) While a picker, countdown or capture runs, Snapmark shall ignore ⌃⇧1, ⌃⇧2, ⌃⇧3, ⌃⇧4 and ⌃⇧N. Screen/state: busy. Tag: `@F10`.

<details>
<summary>Verification</summary>

- F1, F2 — `@F1`, `@F2`: smoke, the injectable picker and capture runner, as `pickArea` tests do today.
- F3 — `@F3`: smoke, the overlay runner is swapped; the editor opens with `oneShot` true.
- F4 — `@F4`: unit `test/capture.test.ts`, the full-screen arguments name one file per display; smoke opens one editor per fake file.
- F5, F6, F7 — `@F5`–`@F7`: smoke with a fake area; `test/menu.test.ts` for the sublabel.
- F8 — `@F8`: unit `test/menu.test.ts`.
- F9 — `@F9`: unit `test/keys.test.ts`.
- F10 — `@F10`: unit `test/keys.test.ts` on the busy rule; smoke during a fake countdown.

</details>

### Capture bar

- [ ] **F11** (A1) While the capture bar is open, Snapmark shall take Esc from every app and close the bar. Screen/state: capture bar, lost focus. Tag: `@F11`.
- [ ] **F12** (A1) When the capture bar opens, it shall become the key window without activating Snapmark. Screen/state: capture bar, default. Tag: `@F12`.
- [ ] **F13** (A2, A3, A10) The capture bar shall show exactly one blue filled button, "Capture ↩". Screen/state: capture bar, default. Tag: `@F13`.
- [ ] **F14** (A2, A10) The chosen mode shall show `--fill-selected`, an `--accent` icon and an `--accent-text` label. Screen/state: capture bar, each mode. Tag: `@F14`.
- [ ] **F15** (A4) When a digit 1–5 is pressed in the bar, Snapmark shall choose that mode without capturing. The order is New Area, Window, Full Screen, Last Area, Scrolling. Screen/state: capture bar. Tag: `@F15`.
- [ ] **F16** (A2, A3) When ↩ or ⌘↩ is pressed in the bar, Snapmark shall capture with the chosen mode. Screen/state: capture bar. Tag: `@F16`.
- [ ] **F17** (A2) When a mode is chosen, the bar's headline and hint shall read as screens.md's "Headline and hint per mode" table gives. Screen/state: capture bar, each mode. Tag: `@F17`.
- [ ] **F18** (A4) Each bar control shall show its name and its key on the bar, with `aria-keyshortcuts` set. Screen/state: capture bar. Tag: `@F18`.
- [ ] **F19** (A4) The drawn hover label (`tip.html`) shall be gone. Screen/state: capture bar, pointer resting. Tag: `@F19`.
- [ ] **F20** (A6, A10) The bar's headline row shall show a Session | One-Shot segmented control and the session pop-up. Screen/state: capture bar, default. Tag: `@F20`.
- [ ] **F21** (A6) While One-Shot is chosen in the bar, the pop-up shall be greyed and read "Not in a session". Screen/state: capture bar, One-Shot chosen. Tag: `@F21`.
- [ ] **F22** (A6) While One-Shot is chosen in the bar, Capture shall read "Capture One-Shot ↩". Screen/state: capture bar, One-Shot chosen. Tag: `@F22`.
- [ ] **F23** (A6) When a session is picked from the bar's pop-up, Snapmark shall make it the current session. Screen/state: session pop-up, open. Tag: `@F23`.
- [ ] **F24** (A6) When ⇧⌘O is pressed in the bar, Snapmark shall switch between Session and One-Shot. Screen/state: capture bar. Tag: `@F24`.
- [ ] **F25** (A6) When ⇧⌘P is pressed in the bar, Snapmark shall open the session pop-up. Screen/state: capture bar. Tag: `@F25`.
- [ ] **F26** (A6, A10) The Options menu shall hold Timer and Show Mouse Pointer, without Save to. Screen/state: capture bar, Options open. Tag: `@F26`.
- [ ] **F27** (A1) If the bar has less than 1000 pt of work area, then the hint shall wrap and no control shall hide. Screen/state: capture bar, narrow. Tag: `@F27`.
- [ ] **N1** (A2) Selected text in the bar and the editor shall reach 4.5:1 on its fill, in light and dark. Screen/state: capture bar and editor, chosen. Tag: `@N1`.

<details>
<summary>Verification</summary>

- F11 — `@F11`: smoke checks the bar asks for a global Esc; it is not registered in quiet runs. Manual: Esc from another app, in `validation.md`.
- F12 — `@F12`: smoke, `isFocused()` on the bar while the test window stays front.
- F13–F22, F24–F27 — `@F13`–`@F27`: smoke, the bar block (replaces F202, F9 and F10 of today).
- F23 — `@F23`: unit `test/menu.test.ts` on the shared session menu; smoke clicks a row.
- N1 — `@N1`: unit `test/colour.test.ts`, contrast of the four token pairs.

</details>

### Countdown

- [ ] **F28** (A6) When a timed bar capture starts, Snapmark shall show the countdown overlay on the area with the digit and "Esc cancels". Screen/state: countdown, default. Tag: `@F28`.
- [ ] **F29** (A6) The countdown overlay shall let clicks pass through and be content-protected. Screen/state: countdown, default. Tag: `@F29`.
- [ ] **F30** (A6) When the count reaches the end, Snapmark shall close the overlay 200 ms before the capture. Screen/state: countdown, counting. Tag: `@F30`.
- [ ] **F31** (A6) If Esc, ⌃⇧5 or a click on the menu bar icon comes during the countdown, then Snapmark shall capture nothing. Screen/state: countdown, cancelled. Tag: `@F31`.
- [ ] **F32** (A6) While Reduce Motion is on, the countdown digits shall change without scale or fade. Screen/state: countdown, Reduce Motion. Tag: `@F32`.

<details>
<summary>Verification</summary>

- F28–F32 — `@F28`–`@F32`: smoke with a 3 s Timer and a fake capture runner; F32 emulates `prefers-reduced-motion`.

</details>

### Guide and decisions

- [ ] **F33** (A13) The interaction guide shall hold CAP-12, CAP-13, REC-1, REC-2, KEY-7 and ACC-6 as accepted rules. Screen/state: `docs/ux/interaction-guidelines.md`. Tag: `@F33`.
- [ ] **F34** (A4, A13) The guide's KEY-1, CAP-1, CAP-3, CAP-9, CAP-10, WIN-2, WIN-4, EX-7 and EX-10 shall state this change's keys and bar. Screen/state: the guide. Tag: `@F34`.
- [ ] **F35** (A13) `docs/designs/` shall hold the amended capture-bar and keys ADRs and a new recording ADR, listed in `INDEX.md`. Screen/state: docs. Tag: `@F35`.

<details>
<summary>Verification</summary>

- F33, F34 — `@F33`, `@F34`: unit `test/guide.test.ts`.
- F35 — `@F35`: `tests/sdlc.test.ts` design-index check, and the ADR files exist.

</details>

## Milestone 2: editor destination, notes, hex field, window size

### Editor destination

- [ ] **F36** (A5, A12) The editor toolbar shall end with a Session | One-Shot segmented control, then a pop-up reading "<session> (<n>)". Screen/state: editor toolbar, Session. Tag: `@F36`.
- [ ] **F37** (A5, A6) When One-Shot is chosen in the editor, Snapmark shall show Beautify and "Copy Image ⌘C", keeping every mark. Screen/state: editor toolbar, One-Shot. Tag: `@F37`.
- [ ] **F38** (A5) When Session is chosen again, the general comment and reference notes shall return unchanged. Screen/state: editor toolbar, Session. Tag: `@F38`.
- [ ] **F39** (A6) When Copy Image is used in One-Shot, Snapmark shall copy the image and close the editor. Screen/state: editor, One-Shot. Tag: `@F39`.
- [ ] **F40** (A6) After a One-Shot Copy, Discarded shall keep the capture for 7 days as "Copied One-Shot". Screen/state: Discarded. Tag: `@F40`.
- [ ] **F41** (A6) While a text field has focus, ⌘C shall copy text and leave the editor open. Screen/state: editor, One-Shot, note focused. Tag: `@F41`.
- [ ] **F42** (A6, A12) The session pop-up shall list up to 10 recent sessions with counts and ✓, then Older Sessions…, then New Session ⌃⇧N. Screen/state: session pop-up, default. Tag: `@F42`.
- [ ] **F43** (A6) When a session is picked in the editor, Snapmark shall move the screenshot there and make it current at once. Screen/state: session pop-up. Tag: `@F43`.
- [ ] **F44** (A6) If the picked session's folder is gone, then Snapmark shall keep the old session and show the move error under the pop-up. Screen/state: editor toolbar, moving failed. Tag: `@F44`.
- [ ] **F45** (A5) While the editor is in One-Shot or Edit Again, the session pop-up shall be greyed with its reason. Screen/state: editor toolbar, One-Shot and Edit Again. Tag: `@F45`.
- [ ] **F46** (A5) When ⇧⌘O is pressed in the editor, Snapmark shall switch between Session and One-Shot. Screen/state: editor. Tag: `@F46`.
- [ ] **F47** (A5) When ⇧⌘P is pressed in the editor, Snapmark shall open the session pop-up. Screen/state: editor. Tag: `@F47`.
- [ ] **F48** (A5) When a segment is clicked, Snapmark shall return focus to the canvas, so the arrows still nudge marks. Screen/state: editor, a mark selected. Tag: `@F48`.
- [ ] **F49** (A5, A6) While One-Shot holds notes, the editor shall show "Notes stay with Session. They are not copied." Screen/state: notes column, One-Shot. Tag: `@F49`.
- [ ] **F50** (A6) When a One-Shot image is copied or saved, Snapmark shall leave the reference numbers out of it. Screen/state: editor, One-Shot. Tag: `@F50`.
- [ ] **F51** (A5) The primary buttons shall read "Add to Session ⌘↩" and, in Edit Again, "Save Changes ⌘↩". Screen/state: editor footer. Tag: `@F51`.
- [ ] **N2** (A5) At the 820 × 520 minimum, the editor toolbar shall fit on one line. Screen/state: editor toolbar, narrow. Tag: `@N2`.

<details>
<summary>Verification</summary>

- F36–F41, F43–F51, N2 — `@F36`–`@F51`, `@N2`: smoke, the editor block. The one-shot block is split so Copy closing its window ends that block (replaces today's F113–F115 sequence).
- F42 — `@F42`: unit `test/menu.test.ts`.

</details>

### Notes column and hex fields

- [ ] **F52** (A5, A7) Each notes heading shall have 20 pt above it and 8 pt below it, within 1 pt. Screen/state: notes column. Tag: `@F52`.
- [ ] **F53** (A7) While a reference exists, a 1 px hairline shall stand 20 pt above "References". Screen/state: notes column, with references. Tag: `@F53`.
- [ ] **F54** (A5) When "#2492ff" is pasted into a hex field, the field shall read "2492ff" and apply that colour. Screen/state: hex field, pasted. Tag: `@F54`.
- [ ] **F55** (A5) Beautify's Background shall have a hex field beside Custom, with the same rules as the annotation one. Screen/state: Beautify. Tag: `@F55`.
- [ ] **F56** (A5) If a hex field holds a bad value on ↩ or blur, then it shall show the hex error from screens.md. Screen/state: hex field, error. Tag: `@F56`.

<details>
<summary>Verification</summary>

- F52, F53 — `@F52`, `@F53`: smoke, measured like today's F14.
- F54–F56 — `@F54`–`@F56`: unit `test/colour.test.ts` for the parser; smoke pastes into both fields.

</details>

### Session window size

- [ ] **F57** (A9) When the session window opens for the first time, it shall fill 90 % of the work area, centred. Screen/state: session window, first open. Tag: `@F57`.
- [ ] **F58** (A9) When the owner resizes the session window, Snapmark shall open it at that size next time, never larger than the display. Screen/state: session window, later opens. Tag: `@F58`.

<details>
<summary>Verification</summary>

- F57, F58 — `@F57`, `@F58`: smoke, as the editor's size check does today.

</details>

## Milestone 3: GIF recording with key frames

### Recording

- [ ] **F59** (A6) The capture bar shall show Record as mode 6, chosen by the 6 key. Screen/state: capture bar, Record chosen. Tag: `@F59`.
- [ ] **F60** (A6) Options ▸ Frame Rate shall offer 15, 10, 5, 4 and 2 fps, 10 by default, greyed unless Record is chosen. Screen/state: capture bar, Options open. Tag: `@F60`.
- [ ] **F61** (A6) While an area is set, when Record captures, the picker shall show that area; ↩ keeps it and a drag replaces it. Screen/state: area picker, record. Tag: `@F61`.
- [ ] **F62** (A6) When the area is confirmed, Snapmark shall count 3, 2, 1 and then record at the chosen frame rate. Screen/state: countdown. Tag: `@F62`.
- [ ] **F63** (A8) While recording, a panel outside the area shall show ⓧ, "0:07 of 0:30 · 10 fps" and Done. Screen/state: recording control, default. Tag: `@F63`.
- [ ] **F64** (A8) When 30 s have been recorded, Snapmark shall stop as Done does. Screen/state: recording control. Tag: `@F64`.
- [ ] **F65** (A6) While recording, Snapmark shall take no plain key from any app. Screen/state: recording control. Tag: `@F65`.
- [ ] **F66** (A6) When Done, ⌃⇧5 or the menu bar icon is used while recording, Snapmark shall stop and keep the recording. Screen/state: recording control. Tag: `@F66`.
- [ ] **F67** (A6) When ⓧ is clicked while recording, Snapmark shall put the recording in Discarded. Screen/state: recording control, cancelled. Tag: `@F67`.
- [ ] **F68** (A6) No Snapmark window shall appear in a recorded frame. Screen/state: recording control. Tag: `@F68`.
- [ ] **F69** (A11) The key frames shall be the first frame, every frame that changed, and the settled last frame, at most 24. Screen/state: recording editor. Tag: `@F69`.
- [ ] **F70** (A11) The GIF shall merge identical frames in a row and sum their delays, so it plays at the real timing. Screen/state: GIF. Tag: `@F70`.
- [ ] **F71** (A8) When Add to Session is used, the session shall gain the marked filmstrip PNG and the GIF. Screen/state: session folder. Tag: `@F71`.
- [ ] **F72** (A11) The recording editor shall show the facts line and each frame's time, as screens.md gives. Screen/state: recording editor, default. Tag: `@F72`.
- [ ] **F73** (A11) When ⇧⌘F is pressed, the recording editor shall switch between key frames and all frames. Screen/state: recording editor, all frames. Tag: `@F73`.
- [ ] **F74** (A11) A mark shall belong to the frame where it starts, clipped to it, and that frame shall always be saved. Screen/state: recording editor, marked extra frame. Tag: `@F74`.
- [ ] **F75** (A8) The session shall keep the frames, their times and the marks as data, so Edit Again reopens them. Screen/state: Edit Again on a recording. Tag: `@F75`.
- [ ] **F76** (A6, A8) While a recording is in One-Shot, the primary button shall be "Copy Filmstrip ⌘C", copying the marked PNG. Screen/state: recording editor, One-Shot. Tag: `@F76`.
- [ ] **F77** (A11) If finding key frames takes over 15 s, then Snapmark shall open the editor with up to 24 evenly spaced frames. Screen/state: recording editor, evenly spaced. Tag: `@F77`.
- [ ] **F78** (A8) A recording's `session.md` entry shall read as screens.md gives, with each reference's time. Screen/state: session.md. Tag: `@F78`.
- [ ] **F79** (A8, A11) The session window shall show a recording's filmstrip and its GIF, which Space plays and pauses. Screen/state: session window, recording entry. Tag: `@F79`.
- [ ] **F80** (A8) A PDF export shall hold a recording's filmstrip, and a ZIP export its GIF too. Screen/state: export. Tag: `@F80`.
- [ ] **F81** (A6) If a screen grab fails while recording, then Snapmark shall stop and show "Recording failed: <reason>. Nothing was added. Click to try again." Screen/state: recording control, error. Tag: `@F81`.

<details>
<summary>Verification</summary>

- F69, F70 — `@F69`, `@F70`: unit `test/keyframes.test.ts` on the pure key-frame and GIF-delay functions.
- F71, F75, F78 — `@F71`, `@F75`, `@F78`: unit `test/sessions.test.ts` with a fake recording.
- F80 — `@F80`: unit `test/exporter.test.ts`.
- The rest — smoke with an injected frame source, never the owner's screen.
- F65, F68 — manual too, on the installed release, in `validation.md`.

</details>

## Milestone 4: Capture Scrolling scrolls by itself

### Auto-scroll

- [ ] **F82** (A2, A3) Where Accessibility is allowed, Capture Scrolling shall scroll the area down by itself, starting where it is. Screen/state: scrolling control, auto. Tag: `@F82`.
- [ ] **F83** (A2) When two grabs in a row match, Snapmark shall stop scrolling and open the editor. Screen/state: scrolling control, auto. Tag: `@F83`.
- [ ] **F84** (A3) If the area did not move after 2 tries, then Snapmark shall switch to manual and say why. Screen/state: scrolling control, fell back. Tag: `@F84`.
- [ ] **F85** (A3) When the owner scrolls during auto-scroll, Snapmark shall switch to manual. Screen/state: scrolling control, owner took over. Tag: `@F85`.
- [ ] **F86** (A3) If Accessibility is not allowed, then the scrolling control shall run manual and say how to allow it, once per launch. Screen/state: scrolling control, no permission. Tag: `@F86`.
- [ ] **F87** (A3) Settings ▸ Capture shall show whether Capture Scrolling can scroll by itself, with "Open Accessibility Settings…" when it cannot. Screen/state: Settings ▸ Capture. Tag: `@F87`.
- [ ] **F88** (A1, A3) The scrolling control shall have ⓧ; ↩, ⌃⇧5 and the menu bar icon shall mean Done. Screen/state: scrolling control. Tag: `@F88`.

<details>
<summary>Verification</summary>

- F82–F86 — `@F82`–`@F86`: smoke with the injectable `grab` and a fake scroller; unit `test/stitch.test.ts` for the stop rule.
- F87, F88 — `@F87`, `@F88`: smoke.
- F82 — manual too, on the installed direct build, in `validation.md`.

</details>

## Verification

- **Automated, once per milestone:** `python3 scripts/verify_gate.py milestone 2026-10-26-picked-designs` runs format, lint, typecheck, unit tests and `smoke:background`. CI runs smoke again on each milestone PR.
- **Validation, once per milestone:** every fact and ask of that milestone gets a row in `validation.md`: expected, observed, evidence, verdict.
- **Manual:** global Esc from another app, recording a real page, and auto-scroll in a browser. The owner checks these on the installed release.

## Out of scope

- In-app toasts. Feedback stays as today: macOS notifications for Copy (EX-9) and failures.
- A video timeline, trimming or a scrubber. The owner picked key frames over a scrubber.
- Captions on key frames. Frames carry their time only.
- Auto-scroll in an App Store build. Its sandbox has no Accessibility.
- Tab keys ⌘1–⌘3 in the session window, seen in a mockup. Not asked.
- A design system file. It is proposed in spec/conformance.md, not built here.
- Any change to the Beautify panel's design (A10). Only a hex field is added beside Custom.
- A new dependency for the GIF. ImageIO is the answer; a fallback would be asked first.
- A13 is answered by all four milestones together; it adds no fact of its own.

## Open questions

None. Every question is answered in [spec/brief.md](spec/brief.md), Answers.
