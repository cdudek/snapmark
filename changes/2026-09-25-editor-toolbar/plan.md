---
linear: none
bead: snap-8p1
type: plan
change: 2026-09-25-editor-toolbar
design: null
author: calvindudek@googlemail.com
status: approved
reviewed_by: calvindudek@googlemail.com (Plannotator gate)
approved_at: 2026-09-25
created: 2026-09-25
---

# Plan: Editor — icon toolbar, Reference, Esc, Dock icon, sidebar

> Replace the word toolbar with icons, make notes grow, let Esc step out, and show the Dock icon while an editor is open.

A person with no context builds from this file alone. [facts](facts.md) are for the gate, not for
the build.

## Approach

- **What changes:** the tool list moves from `src/editor.ts` into `src/tools.ts`, one list with each tool's key, name, icon (inline SVG) and meaning. The editor, the new shortcuts window and the copied prompt all read it. The toolbar draws one icon button per tool. The sidebar gets a scrolling body and a fixed footer. Text fields grow with `field-sizing: content`.
- **What stays the same:** every tool's drawing behaviour, undo, saving, session.md's format, and the rule that pressing a key again steps through its group.
- **Why this way:** with one tool list, the toolbar, the shortcuts window and the prompt cannot disagree (F12, F13). `field-sizing: content` makes a textarea fit its text in one CSS line; Electron 44's Chromium supports it.
- **Rejected:**
  - An icon font or icon package — about 19 small inline SVGs cover it, with no new dependency.
  - Growing notes with a JS resize on input — the CSS property does it with no code.

## Design changes

None.

## Files that change

| File                 | Change                                                                                                                                                        |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/tools.ts`       | new classic script: `GROUPS` in the new order (V, 1–7), each tool `{ id, label, icon, means }`; also sets `module.exports` when loaded by Node                |
| `src/shared.d.ts`    | the `ToolGroup` type, and `declare const GROUPS` for the renderer                                                                                             |
| `src/editor.ts`      | drop its own `GROUPS`; icon toolbar with a tooltip per tool; click picks the tool; Esc steps back; References shown only once one exists; "Reference" wording |
| `src/editor.html`    | load `tools.js`; toolbar CSS for icon groups with the key under each; sidebar = scrolling body + footer; `field-sizing: content`; one-line comment            |
| `src/shortcuts.html` | new: a small page that loads `tools.js` and lists every key, icon, name and meaning, plus the global and editor keys                                          |
| `src/main.ts`        | Dock icon shown while editors are open; "Keyboard shortcuts…" window; `promptFor` builds its mark key from `GROUPS`                                           |
| `src/menu.ts`        | "Keyboard shortcuts…" in Settings, and `keyboardShortcuts` in `MenuActions`                                                                                   |
| `test/menu.test.ts`  | Settings expects "Keyboard shortcuts…"                                                                                                                        |
| `test/smoke.ts`      | keys follow the new order; new checks for F1–F10 and F13                                                                                                      |
| `package.json`       | `build` also copies `src/shortcuts.html` to `dist/src/`                                                                                                       |
| `README.md`          | the key table and wording updated to the new order, icons and "Reference"                                                                                     |

## Order of work

- [ ] 1. `src/tools.ts` + `shared.d.ts`; `editor.html` loads `tools.js` before `editor.js`; `editor.ts` uses the shared `GROUPS` — proof: `npm run typecheck` exits 0 and `npm run smoke` passes with its keys moved to the new order (Box on 2, Arrow on 3, Cross on 4, Tick on 5, Reference on 1, Highlight on 6, Cut & move on 7, Redact on 7 again)
- [ ] 2. Icon toolbar: a group per key with its tools as icon buttons and the key under them; the active tool pressed; clicking an icon selects that tool; tooltip "<Name> (<key>)", with the Select and Redact extras (F1–F4) — proof: smoke checks every tool has a button with an `<svg>` and no visible text, the group order, one tooltip, and a click
- [ ] 3. "Reference" wording in the editor hint, README and prompt; no "Numbered" left (F5) — proof: smoke checks the editor page and `promptFor` contain no "Numbered"
- [ ] 4. Esc: in a text field → blur; else a selection → deselect; else → Select (F6) — proof: smoke presses Esc with Card active and checks the tool is Select
- [ ] 5. Sidebar: body scrolls, footer holds Discard and "Add to session"; notes and comment use `field-sizing: content`; the comment is one line with "Add a comment…"; References heading and list only once a reference exists (F7–F10) — proof: smoke types a five-line note and checks `scrollHeight <= clientHeight + 1`, checks the footer's buttons stay inside the window with ten references, and checks References is hidden before the first reference
- [ ] 6. Dock: `app.dock.show()` when an editor opens; `app.dock.hide()` when the last one closes (F11) — proof: read in the code; manual
- [ ] 7. "Keyboard shortcuts…" in Settings opens `shortcuts.html` in a 520×640 window (F12) — proof: `test/menu.test.ts` for the item; the window by hand
- [ ] 8. `promptFor` writes one line per tool with a meaning, from `GROUPS` (F13) — proof: smoke checks every tool label except Select appears in `promptFor`
- [ ] 9. README key table and wording — proof: `grep -n "Reference" README.md`
- [ ] 10. Verify, PR, auto-merge, archive, close `snap-8p1`, rebuild and install the app — proof: CI `check` passes; the installed app shows the icon toolbar

## Risks

| Risk                                                                       | What we do                                                                                                                                                | Where it lands |
| -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `tools.ts` must work both as a browser classic script and as a Node module | It declares `GROUPS` at top level and ends with `if (typeof module !== 'undefined') module.exports = GROUPS;`; both paths are exercised by the smoke test | step 1, step 8 |
| The CSP blocks inline SVG                                                  | Inline `<svg>` in the DOM is markup, not a resource; the CSP stays as it is                                                                               | step 2         |
| Hand-drawn icons read badly at 16 px                                       | Simple 24-unit strokes; the owner judges them in the installed app and names any to redraw                                                                | manual         |
| Moving keys breaks the owner's habits                                      | Owner decision of 2026-09-25; README and the shortcuts window show the new keys                                                                           | accepted       |
| `app.dock.show()` briefly flashes a Dock icon on every capture             | It shows only while the editor is open, as decided                                                                                                        | accepted       |

## Out of scope

- The other editor findings (discard without asking, ⌘W, redaction under cut and move): the full decision round.
- session.md's format.

## Done

- `npm run format && npm run lint && npm run typecheck && npm test` exits 0.
- `npm run smoke` passes, with checks for F1–F10 and F13.
- Every task in Order of work is ticked; departures are logged under `## Revisions`.
- Nothing outside `## Files that change` is edited, apart from archiving this folder.
- The installed app in `/Applications` is rebuilt from the merged `main`.
- Stop and report as soon as a step cannot proceed. Never work around a blocker.
- Stop after 40 turns if not met. Report what is missing.

## Goal handover

```
/goal Build changes/2026-09-25-editor-toolbar/plan.md in its order of work; every outcome in
changes/2026-09-25-editor-toolbar/facts.md must hold; tick tasks as they land; log departures
under ## Revisions.

Done:
- `npm run format && npm run lint && npm run typecheck && npm test` exits 0.
- `npm run smoke` passes, with checks for F1–F10 and F13.
- Every task in plan.md's Order of work is ticked; departures are logged under ## Revisions.
- Nothing outside plan.md's `## Files that change` is edited, apart from archiving the folder.
- The installed app in /Applications is rebuilt from the merged main.
- Stop and report as soon as a step cannot proceed. Never work around a blocker.
- Stop after 40 turns if not met. Report what is missing.
```

## Revisions

Only after approval. One line per change: `YYYY-MM-DD — what changed, and why`.
