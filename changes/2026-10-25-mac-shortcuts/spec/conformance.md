---
type: spec-conformance
change: 2026-10-25-mac-shortcuts
created: 2026-10-25
mode: text only (no prototype images; code-only review, the owner's rule)
---

# Conformance

## Documents

| Document               | Status               | Path                                                                                                                              | What it could not check if missing                                              |
| ---------------------- | -------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Interaction guidelines | found                | `docs/ux/interaction-guidelines.md` (status: proposed)                                                                            |                                                                                 |
| Glossary               | found, proposal only | `docs/ux/glossary-proposal.md`                                                                                                    | no accepted glossary: words checked against the proposal, findings are advisory |
| Design system          | missing              | none (setup.md: "Design system: none")                                                                                            | no token or component-library check                                             |
| Voice rules            | missing              | none in the repo                                                                                                                  | checked against the kit's `writing.md` only                                     |
| Decisions (ADRs)       | found                | `docs/designs/2026-10-25-adr-keys-follow-macos.md`, `2026-09-25-adr-esc-on-select-closes-the-editor.md`, `2026-09-25-adr-keys.md` |                                                                                 |
| Sitemap                | found, stale on keys | `docs/ux/sitemap.md`                                                                                                              | delta in ia.md                                                                  |

## 1. Interaction model

Rules from Keyboard and focus (KF), Lists and selection (LS), Undo across the app (UA), Copy and paste (CP), Platform conventions (PC), Confirmation and undo (CU).

| Rule                                                                                                                       | Verdict                         | How this spec meets or departs                                                                                                                      |
| -------------------------------------------------------------------------------------------------------------------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| KF 1: "Global keys are for capturing only, on neighbouring keys." Option (c) "⌃⇧4 and ⌃⇧5, mirroring macOS's ⌘⇧4 and ⌘⇧5." | follows                         | ⌃⇧3, ⌃⇧4, ⌃⇧5 are neighbours and all capture. ⌃⇧N sits apart (letter, not digit), as the rule allows.                                               |
| KF 1: "All global keys can be changed in the Keyboard Shortcuts window."                                                   | departs (existing)              | No key recorder. Not asked; out of scope (brief, No-Gos).                                                                                           |
| KF 1: a session-changing key "can be undone"                                                                               | departs (existing)              | ⌃⇧N has no undo today; unchanged by this spec.                                                                                                      |
| KF 2: "Esc steps back inside a surface and stops at its resting state … discarding or closing a document is ⌘W."           | **deliberate exception**        | Esc still closes the editor one step past Select. See section 6.                                                                                    |
| KF 3: "Letter and digit keys act only while no text field has the cursor; ⌘ keys act everywhere"                           | follows, with two stated limits | ⌘S, ⇧⌘C act everywhere. ⌘C and ⌘A act on the image or marks only outside text, so text copy and select-all keep working (CP says the same).         |
| KF 3: "only keys Snapmark defines itself are active"                                                                       | follows                         | ⌘A stops the stock Edit ▸ Select All outside text (E7b).                                                                                            |
| KF 4: "one generated list, grouped by where it works … one key away (⌘/)"                                                  | partly                          | Every key is in the list. Groups stay "Editor tools" and "Other keys" as today; the where-column orders them. No ⌘/. Not generated from a registry. |
| KF 5: "arrow keys nudge the selected mark (⇧ for larger steps)"                                                            | follows                         | 1 point, ⇧ 10 points (E6).                                                                                                                          |
| KF 5: "Tab moves between marks"                                                                                            | not in scope                    | Not asked.                                                                                                                                          |
| KF focus: "closing a surface returns focus where it came from"                                                             | follows                         | Every new key keeps focus, or moves it to the surface it opens (Key map, Focus column).                                                             |
| LS: "Select, open and edit are separate: click selects, double-click or Enter opens"                                       | departs                         | In the session window ↩ renames the session (Finder's ↩ renames). There is no selection in the grid, so ↩ has nothing to open. Owner's choice (A3). |
| LS: "⌫ removes with Undo"                                                                                                  | departs (existing)              | ⌘⌫ in the session window has no ⌘Z, like the button; Discarded is the net for 7 days.                                                               |
| KF "Why it helps": "the destructive thing never is" one chord away                                                         | departs                         | ⌘⌫ removes a screenshot in one chord. Finder does the same, with ⌘Z. Owner question: ⌘Z reopens it (validation.md).                                 |
| LS: "⇧-click adds to a selection"                                                                                          | not in scope                    | ⌘A is the only route to a multi-selection (E8f).                                                                                                    |
| LS: "An undone removal puts the item back where it was, with its number."                                                  | follows (required)              | E8a requires the old stacking order on undo, so references keep their numbers. Today's single `remove()` re-adds at the end (F074).                 |
| LS: "A greyed action says why on hover and in its accessible name"                                                         | departs (existing)              | ⌘O on a greyed Edit Again is silent; the button gives no reason (F143). Unchanged.                                                                  |
| UA: "⌘Z undoes the last action in the focused window"                                                                      | follows                         | One step per nudge, per group move, per group removal.                                                                                              |
| UA: "Undo and Redo name the step"                                                                                          | departs (existing)              | Steps are unnamed today.                                                                                                                            |
| CP: "⌘C with nothing selected copies the marked image."                                                                    | follows, and goes further       | ⌘C also copies the image with marks selected, because marks cannot be copied yet. Recorded as a known future change (section 6).                    |
| PC 3: "Key symbols in the macOS order ⌃⌥⇧⌘"                                                                                | follows                         | ⌃⇧4, ⇧⌘C, ⌘⌫. The startup notification still spells "Control+Shift+4" (existing, glossary row "shortcut unavailable").                              |
| CU: removals offer Undo in their result                                                                                    | departs (existing)              | Remove from Session has no result bar; the Discarded tab count is the only trace.                                                                   |
| Editing exception: "Redactions cannot be moved or resized"                                                                 | follows                         | Arrows refused on a redaction (E6b); ⌘A leaves redactions out (E7).                                                                                 |

New behaviour no rule covers (for the next `omr-ux:decision` round):

- Multi-selection on the canvas: what it shows (border, no handles) and what it allows. Nearest rule: LS.
- A popup menu opened by a global key at the menu bar icon. Nearest rule: Dialogs, menus and popovers.
- Key auto-repeat on destructive keys is ignored (S2c). Nearest rule: Confirmation and undo.

## 2. Design system

No design system exists. No new colour, size or token. Key glyphs use the system font, as the menu and existing `kbd` hints do.

## 3. Component inventory

| Component                                          | Path                                   | Status | Callers today                                          | Implication for other screens                                                                       |
| -------------------------------------------------- | -------------------------------------- | ------ | ------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| Capture Options item list                          | `src/menu.ts:96-105`                   | adapt  | 1: `menuTemplate`                                      | Lift the array into one builder used by the submenu and the ⌃⇧5 popup, so the two never differ.     |
| `shortcut()` label helper                          | `src/menu.ts:64`                       | adapt  | 3: Capture Screenshot…, Capture Last Area, New Session | Needs a form for a submenu row (no accelerator, suffix only when unregistered) for Capture Options. |
| `MenuState.shortcuts`                              | `src/menu.ts:19`, `src/main.ts:706`    | adapt  | 2 plus `test/menu.test.ts:26`                          | Adds `options`. Test fixtures move from Control+Shift+1 to Control+Shift+4.                         |
| Global key registration loop                       | `src/main.ts:871-878`                  | adapt  | 1                                                      | Four keys. Same notification on failure.                                                            |
| `popMenu()` / `tray.popUpContextMenu`              | `src/main.ts:718`                      | have   | 2: tray click, right-click                             | Reused for the popup with the options list.                                                         |
| `picking` guard                                    | `src/main.ts:184`                      | have   | 2: `captureArea`, `captureScrolling`                   | ⌃⇧5 reads it too (G4a). Capture Scrolling's grabbing phase needs the same guard.                    |
| `showShortcuts()` `row()`                          | `src/main.ts:786`                      | have   | 1                                                      | New rows only.                                                                                      |
| Editor keydown handler                             | `src/editor.ts:945`                    | adapt  | 1                                                      | The `typing` check must also cover sliders and the colour well (E6e).                               |
| `save()`                                           | `src/editor.ts:915`                    | adapt  | 2: ⌘↵, primary button                                  | Add a `saving` guard, so ⌘S and ⌘↵ twice save once (E1a).                                           |
| `copyImage`, `saveImageAs`                         | `src/editor.ts:942-943`                | have   | 3 and 2                                                | ⌘C and one-shot ⌘S call them.                                                                       |
| `remove()` (marks)                                 | `src/editor.ts:630`                    | adapt  | 1: ⌫                                                   | Takes many marks as one step; restores stacking order on undo.                                      |
| Move undo (`before:transform` / `object:modified`) | `src/editor.ts:642-661`                | adapt  | 1 (all drags)                                          | A group move must record each mark's own place; today it records the selection box only.            |
| `undo()` / `redo()`                                | `src/editor.ts:682-695`                | adapt  | 3: buttons, ⌘Z handler                                 | Drop the selection before applying a step (E10a).                                                   |
| `stateOf()` on `beforeunload`                      | `src/editor.ts:938`                    | adapt  | 1 (every close)                                        | Drop the selection before writing the Discarded copy (E12).                                         |
| Session window buttons                             | `src/viewer.html:475-521`              | adapt  | all buttons in the window                              | Do not keep focus after a pointer click, so ↩ never repeats a click (S1d).                          |
| `relink()`                                         | `src/editor.ts:478`                    | have   | 4                                                      | Call after a nudge and after a group move, or a cut piece's arrow stays behind.                     |
| Fabric `ActiveSelection`                           | fabric                                 | new    | 0 (`selection: false`)                                 | First multi-selection in Snapmark; border only.                                                     |
| Session window keydown                             | `src/viewer.ts:189`                    | adapt  | 1                                                      | Adds ↩, ⌘⌫, ⌘O with the focus guard and `e.repeat` check.                                           |
| `startRename()`                                    | `src/viewer.ts:146`                    | have   | 2: title, pencil                                       | ↩ is the third caller.                                                                              |
| viewer `remove()`                                  | `src/viewer.ts:132`                    | have   | 2: Remove button, … menu                               | ⌘⌫ is the third caller.                                                                             |
| `viewerEdit`                                       | `src/viewer.ts:183`, `src/main.ts:579` | have   | 2: shot view button, grid button                       | ⌘O is the third caller.                                                                             |

## 4. Words

Checked against `docs/ux/glossary-proposal.md` (proposal, not accepted).

| Term in this spec                   | Glossary proposal                                 | Verdict                                                                                       |
| ----------------------------------- | ------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| "Capture screenshot" (keys window)  | **Capture Screenshot**, replaces "Capture region" | follows the word; departs in case, because the keys window keeps its sentence case (existing) |
| "Capture last area"                 | menu says "Capture Last Area"                     | follows the menu (the keys window uses sentence case today)                                   |
| "Remove from Session", "Edit Again" | same                                              | follows                                                                                       |
| "Discarded"                         | **Discarded** (the place)                         | follows                                                                                       |
| "(shortcut unavailable)"            | proposal: sublabel "⌃⇧1 is used by another app"   | departs (existing wording kept; the intent says "as today")                                   |
| "Keyboard shortcuts" window title   | proposal: Title Case                              | departs (existing, unchanged)                                                                 |
| "Nudge", "Select all"               | no entry                                          | new words; Preview and Figma use them                                                         |

## 5. Screen goals, audience, taxonomy

- Scene 1 (overnight review) is served: capture, save and tidy without the mouse.
- The hard rule "Everything must be doable on the fly with shortcuts" is served by ⌘S, ⌘C, arrows, ⌘A, ↩, ⌘⌫, ⌘O.
- No new object or name enters the taxonomy.

## 6. Deliberate inconsistencies

| Inconsistency                                                                                                                          | Rule it bends                                         | Owner's decision                                                                        | Record                                                                                   |
| -------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Esc closes the editor one step past Select                                                                                             | KF 2: Esc "stops at its resting state"; closing is ⌘W | Kept. "Esc keeps closing the editor" (A3); Discarded brings it back.                    | intent decision 2; ADR 2026-09-25 Esc on Select; add to the guidelines' Exceptions table |
| ↩ renames in the session window instead of opening; in the screenshot view ↩ acts on the session while ⌘⌫ and ⌘O act on the screenshot | LS: "double-click or Enter opens"                     | Finder's ↩ (A3). Screenshots have no names, so the session is the only thing to rename. | ADR 2026-10-25                                                                           |
| ⌘C copies the image even with marks selected                                                                                           | CP: ⌘C on a selection is for the marks (future)       | The image, until mark copy exists (recommended; see brief Open Questions).              | this spec                                                                                |
| ⌃⇧5 shown as a sublabel, not as a key beside the name                                                                                  | PC 3: key shown beside the name                       | Electron draws no key on a submenu row. Recommended: sublabel "⌃⇧5" (owner question 3). | this spec                                                                                |

## 7. Missing guidelines

- Multi-selection on the canvas (what it shows, what it allows).
- Key auto-repeat for destructive keys.
- What a key does when its button is greyed (silent today).
