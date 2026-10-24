---
linear: none
type: facts
change: 2026-10-25-editor-native-look
design: null
author: calvin.dudek@omr.com
status: approved
reviewed_by: calvin.dudek@omr.com (roadmap and mockups, 2026-10-25)
approved_at: 2026-10-25
created: 2026-10-25
archived_at: 2026-10-25
---

# Facts: the editor's Native look (roadmap M1a)

## Goal

The editor separates app from feedback: app controls in brand blue, marks in the colour the owner picks, with the
shapes of the Native mockup. Builds `docs/roadmap.md` M1 (editor half).

## Acceptance criteria

### Colour systems

- [ ] **F1** "Add to session", the active tool, focus rings and selected states shall use brand blue `#2492FF`; nothing in the app UI uses `#e11d48`.
- [ ] **F2** The editor shall follow the system light or dark appearance with the same tokens.

### Annotation palette

- [ ] **F3** The colour swatch shall show the current annotation colour and open a popover with ten presets in two rows of five (coral red `#E5484D` default, orange, amber, green, teal, cyan, blue, violet, pink, graphite), a divider and "Custom…".
- [ ] **F4** Picking a preset shall make the next mark use it; marks already drawn keep their colour.
- [ ] **F5** "Custom…" shall open the macOS colour panel (`<input type="color">`).
- [ ] **F6** The popover shall be keyboard reachable (arrows move between presets, Enter picks) and Esc shall close it without stepping back in the editor.
- [ ] **F7** Remove marks (Cross, Remove area) shall always be coral red `#E5484D`.

### Shapes

- [ ] **F8** References shall be diamonds (a rounded square turned 45°) in the annotation colour with a white number, on the canvas, in the saved PNG and as the badge beside each note.
- [ ] **F9** A card with a pointer shall be a speech bubble: a rounded body with a tail on the edge toward what it points at; its line, text and yellow stay.
- [ ] **F10** The Keyboard Shortcuts window, the copied prompt and the README shall describe diamonds and speech bubbles, not circles and sticky notes.

### Screenshot count

- [ ] **F11** The toolbar's right side shall show "<session> · N screenshots" ("1 screenshot"; only the name when 0), the count coming from the main process.
- [ ] **F12** While an editor is open, its label and window title shall follow a rename of its session and changes to the count (a save, a remove, a reopen).

### Contrast

- [ ] **F13** Filled buttons with white text ("Add to session"; in the session window the selected segment, Reopen, Edit Again and menu highlights) shall use the darker brand blue `#0F72DB` (`--accent-fill`, 4.7:1); `#2492FF` (`--accent`) stays for tints, outlines, focus rings and icons, with the same token names in both windows.

<details>
<summary>Verification</summary>

- F1, F2 — automated: smoke reads the active tool's blue tint; manual: the owner looks in light and dark.
- F3–F7 — automated: smoke opens the palette, counts ten presets and Custom…, picks violet and checks the next box is violet, checks Esc closes it and the tool stays, checks a cross is coral red.
- F8 — automated: smoke samples the saved PNG inside the diamond's tip and outside its side; the badge is checked for its colour.
- F9 — automated: smoke checks the bubble tail geometry points toward the target.
- F10 — automated: smoke checks the prompt says "numbered diamonds".
- F11 — automated: smoke reads the label with 0 and 1 screenshots and the plural form.
- F12 — automated: smoke keeps an editor open while a screenshot is reopened and the session renamed, and reads its label and title.
- F13 — automated: smoke reads "Add to session" as `rgb(15, 114, 219)`.

</details>

## Verification

- **Automated:** `npm run format && npm run lint && npm run typecheck && npm test` exits 0; `npm run smoke` passes.
- **Manual:** the owner opens one capture in light and dark mode.

## Out of scope

- The session window (M1b), the toolbar's ⌘-digit captions and icon Undo/Redo from the mockup, the logo gradient button.
- Remembering the picked colour across editor windows (not done today).

## Open questions

None.
