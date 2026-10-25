---
linear: none
type: facts
change: 2026-10-25-mac-shortcuts
design: docs/designs/2026-10-25-adr-keys-follow-macos.md
author: Calvin Dudek
status: approved
reviewed_by: Calvin Dudek
approved_at: 2026-10-25
created: 2026-10-25
---

# Facts: Shortcuts that work like macOS

## Goal

Snapmark's keys follow macOS. ⌃⇧3, ⌃⇧4 and ⌃⇧5 mirror ⇧⌘3, ⇧⌘4 and ⇧⌘5. The editor saves, copies, nudges and selects all as Preview does. The session window renames, removes, undoes and reopens as Finder does.

## Acceptance criteria

The system is Snapmark. Every key, surface and state is in [spec/interaction.md](spec/interaction.md); every word is in [spec/microcopy.md](spec/microcopy.md). Unit facts are plain-Node assert blocks in `test/*.test.ts`, one block per fact. Smoke checks in `test/smoke.ts` are keyed strings; CI runs them headless on every PR, never locally.

### Global keys

- [ ] **F1** (A1, A3) The system shall register ⌃⇧4 for Capture Screenshot…, and the menu shall show it on that row. Screen/state: menu, default. Tag: `test/keys.test.ts` › "F1 capture key".
- [ ] **F2** (A3) The system shall keep ⌃⇧3 for Capture Last Area and ⌃⇧N for New Session. Screen/state: menu, default. Tag: `test/keys.test.ts` › "F2 unchanged keys".
- [ ] **F3** (A1, A3) When the owner presses ⌃⇧5, the system shall show the Capture Options items as a menu at the menu bar icon. Screen/state: popup, open. Tag: `test/menu.test.ts` › "F3 capture options popup".
- [ ] **F4** (A3) While ⌃⇧5 is registered, Capture Options shall show the sublabel "⌃⇧5"; while it is not, its label shall end "(shortcut unavailable)". Screen/state: menu, default and unavailable. Tag: `test/menu.test.ts` › "F4 options sublabel".
- [ ] **F5** (A3) The system shall not register ⌃⇧1, nor ⇧⌘3, ⇧⌘4 or ⇧⌘5. Screen/state: none. Tag: `test/keys.test.ts` › "F5 freed keys".
- [ ] **F6** (A1) While the area picker is open or Capture Scrolling is running, ⌃⇧3, ⌃⇧4, ⌃⇧5 and the popup's items shall do nothing. Screen/state: busy. Tag: manual, verifier reads the busy check in `src/main.ts`.

### Editor

- [ ] **F7** (A3) When the owner presses ⌘S in session mode, the editor shall add to the session, as ⌘↵ does. This holds while typing too. Screen/state: editor, nothing selected and typing. Tag: smoke `editor['F7 ⌘S adds to the session']`.
- [ ] **F8** (A3) When the owner presses ⌘S in one-shot mode, the editor shall open Save As…, as ⇧⌘S does. Screen/state: one-shot editor. Tag: manual, verifier reads the keydown handler in `src/editor.ts`.
- [ ] **F9** (A3) When the owner presses ⌘C with no text cursor, the editor shall copy the marked-up image in both modes, and keep the selection. Screen/state: editor, nothing selected and many selected. Tag: smoke `editor['F9 ⌘C copies the image']`.
- [ ] **F10** (A3) When the owner presses an arrow key, the editor shall move the selected marks 1 point, or 10 with ⇧. Each press is one undo step. Screen/state: editor, one selected and many selected. Tag: smoke `editor['F10 arrows nudge']`.
- [ ] **F11** (A3) While text has the cursor, arrow keys and ⌘A shall act on the text, not on the marks. Screen/state: editor, typing. Tag: smoke `editor['F11 keys stay in the text']`.
- [ ] **F12** (A3) When the owner presses ⌘A, the editor shall select every mark except redactions. With no such mark, nothing changes. Screen/state: editor, empty and nothing selected. Tag: smoke `editor['F12 ⌘A selects all marks']`.
- [ ] **F13** (A3) While several marks are selected, a drag, an arrow key or ⌫ shall be one undo step. ⌘Z puts each mark back in place. Screen/state: editor, many selected. Tag: smoke `editor['F13 a multi-selection is one step']`.
- [ ] **F14** (A3) When the editor closes or saves with several marks selected, the stored marks shall keep their places on the image. Screen/state: editor, many selected, then closed. Tag: smoke `editor['F14 a selection is dropped before storing']`.

### Session window

- [ ] **F15** (A3) When the owner presses ↩ with no button or field focused, the session window shall start renaming the session. Screen/state: session window, grid and one screenshot. Tag: smoke `viewer['F15 ↩ renames']`.
- [ ] **F16** (A3) When the owner presses ⌘⌫ on a screenshot shown large, the session window shall move it to Discarded. The grid ignores it. Screen/state: session window, one screenshot and grid. Tag: smoke `viewer['F16 ⌘⌫ removes the open screenshot']`.
- [ ] **F17** (A3) When the owner presses ⌘Z after a removal, the session window shall put the last removed screenshot back, once. Screen/state: session window, after a removal. Tag: smoke `viewer['F17 ⌘Z puts it back']`.
- [ ] **F18** (A3) When the owner presses ⌘O on a screenshot shown large, the session window shall open it in the editor. A greyed Edit Again ignores it. Screen/state: session window, one screenshot. Tag: smoke `viewer['F18 ⌘O edits again']`.

### Words

- [ ] **F19** (A1, A3) The Keyboard Shortcuts window shall list every key under "Anywhere", "Editor" and "Session window", in the rows of spec/microcopy.md. Screen/state: Keyboard Shortcuts window. Tag: `test/keys.test.ts` › "F19 key list".
- [ ] **F20** (A1) No screen, hint or README line shall name ⌃⇧1. Screen/state: empty session hints, README, setup.md. Tag: `test/keys.test.ts` › "F20 no old key".

### Unchanged

- [ ] **N1** (A3) The editor's other keys shall work as before. Esc still closes the editor one step past Select. Screen/state: editor. Tag: the existing smoke checks pass unchanged.

<details>
<summary>Verification</summary>

- F1, F2, F5 — `test/keys.test.ts`: `SHORTCUTS` holds `Control+Shift+4`, `Control+Shift+3`, `Control+Shift+5` and `Control+Shift+N`; `src/main.ts` registers only those; no `Control+Shift+1` or `Command+Shift+3/4/5` anywhere in `src/`.
- F3 — `test/menu.test.ts`: `captureOptions(a)` labels equal the Capture Options submenu labels; clicking each calls its action.
- F4 — `test/menu.test.ts`: with `shortcuts.options` set, the item has sublabel "⌃⇧5"; with `null`, the label ends "(shortcut unavailable)".
- F6 — manual: the verifier reads one busy check guarding `capture`, `captureArea` and the popup.
- F7 — smoke: a mark, then ⌘S; the editor closes and the session gains one screenshot.
- F9 — smoke: ⌘C; `clipboard.readImage()` is not empty and the selection is unchanged.
- F10, F13 — smoke: positions before and after; one ⌘Z per press restores them.
- F14 — smoke: `stateOf()` after ⌘A and a nudge equals the absolute positions.
- F15 to F18 — smoke on a session with two screenshots, using `sendInputEvent`.
- F19, F20 — `test/keys.test.ts` reads `KEY_GROUPS` and greps `src/`, `README.md` and `docs/ux/setup.md`.

</details>

## Verification

- **Automated:** `npm run format && npm run lint && npm run typecheck && npm test` exits 0. CI runs `npm run smoke` on every PR; the milestone runs `npm run smoke:background` once.
- **Manual:** the owner installs the build and presses ⌃⇧4, ⌃⇧5, ⌘S, an arrow key and ⌘⌫ (intent success measure).

## Out of scope

- A2 — "make a proposal before implementing": a process request, done in chat before A3.
- Taking ⇧⌘3, ⇧⌘4 or ⇧⌘5 themselves (ADR 2026-10-25, Rejected).
- A notice that ⌃⇧1 moved (owner, Q1: no notice).
- Copying and pasting marks with ⌘C and ⌘V.
- ⇧-click and rubber-band multi-selection.
- Recording one's own keys in the Keyboard Shortcuts window.
- Popping ⌃⇧5 at the pointer over a full-screen app: a follow-up if the build shows nothing at the icon.

## Open questions

None. The owner answered Q1, Q2 and Q5 on 2026-10-25 (spec/validation.md, Decisions).
