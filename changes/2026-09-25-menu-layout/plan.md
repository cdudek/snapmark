---
linear: none
bead: snap-om3
type: plan
change: 2026-09-25-menu-layout
design: null
author: calvindudek@googlemail.com
status: approved
reviewed_by: calvindudek@googlemail.com (Plannotator gate)
approved_at: 2026-09-25
created: 2026-09-25
---

# Plan: Menu bar menu — new layout, labels and behaviour

> Rebuild the menu bar menu in the order and words the owner chose, and make every item answer.

A person with no context builds from this file alone. [facts](facts.md) are for the gate, not for
the build.

## Approach

- **What changes:** the menu template moves out of `src/main.ts` into a pure function in `src/menu.ts`, built fresh each time the menu opens; `src/sessions.ts` gains count, short name, rename and last-use order; the editor reports whether it has unsaved work so Quit can ask.
- **What stays the same:** capture, the editor, saving, exports, the global shortcuts ⇧⌘1 and ⇧⌘2, and session.md's format.
- **Why this way:** a pure `menuTemplate(state, actions)` can be tested in Node without Electron, so labels, order and enabled flags (F1–F5, F11, F16, F17) get an automated check instead of only a manual one.
- **Rejected:**
  - Keeping `tray.setContextMenu` — macOS then shows a menu built earlier, so counts and sessions go stale (F6).
  - A custom HTML window as the menu — loses the native look and keyboard handling for no gain.
  - An Electron window for "Rename session…" — `osascript` `display dialog … default answer` gives a native text prompt in one call.

## Design changes

None.

## Files that change

| File                    | Change                                                                                                                                                                     |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/menu.ts`           | new: `MenuState`, `MenuActions`, `menuTemplate(state, actions)` — pure, `import type` from electron only                                                                   |
| `src/main.ts`           | tray pops up `menuTemplate(...)` on click; actions: copy with notification, rename, other session, missing-file check, quit guard, update answers, registered-shortcut set |
| `src/sessions.ts`       | `count(root, name)`, `shortName(name)`, `rename(root, from, to)` (folder and the `# title` line), `byLastUse(names, used)`                                                 |
| `src/preload.ts`        | `dirty(value: boolean)` → `ipcRenderer.send('editor:dirty', value)`                                                                                                        |
| `src/shared.d.ts`       | `dirty(value: boolean): void` on `window.snapmark`                                                                                                                         |
| `src/editor.ts`         | call `window.snapmark.dirty(true)` when a mark is added or the comment or a note changes, after the image has loaded                                                       |
| `test/menu.test.ts`     | new: labels, order and enabled flags for: no session · empty session · 2 screenshots · update waiting · shortcut unavailable                                               |
| `test/sessions.test.ts` | count, shortName, rename (folder and title), byLastUse                                                                                                                     |
| `package.json`          | `test` also runs `node dist/test/menu.test.js`                                                                                                                             |
| `README.md`             | the menu section rewritten to the new items                                                                                                                                |

## Order of work

- [ ] 1. `sessions.ts`: `count`, `shortName` ("2026-09-25 12.03" → "25 Sep 12.03", "2026-09-25 12.03 (2)" → "25 Sep 12.03 (2)", any other name unchanged), `rename`, `byLastUse` — proof: `npm test` passes the new asserts in `test/sessions.test.ts`
- [ ] 2. `menu.ts` with the exact labels of facts F1–F5, F10, F11, F16, F17 — proof: `node dist/test/menu.test.js` passes
- [ ] 3. `main.ts`: `tray.on('click')` and `tray.on('right-click')` call `tray.popUpContextMenu(Menu.buildFromTemplate(menuTemplate(...)))`; remove `setContextMenu` — proof: `npm run typecheck` exits 0
- [ ] 4. `main.ts`: copy notifications (F7, F8); "Rename session…" via `osascript` (F9; cancel or empty name changes nothing); state.json gains `used: {name: epochMs}`, set on make-current and on save (F10); "Other session…" opens `dialog.showOpenDialog` at the sessions folder and accepts only a folder with session.md (F10); per-session submenu actions take the session's folder, not `active` (F11) — proof: typecheck; F9 and F10 order by the tests in step 1
- [ ] 5. `newSession` keeps the current session when `count === 0` and notifies "<name> is still empty, so new captures keep going there." (F12) — proof: `test/sessions.test.ts` covers `count`; the branch is read in the code
- [ ] 6. Missing folder or session.md → notification "<name> is no longer in <folder>"; its `click` pops up the menu (F13) — proof: manual
- [ ] 7. Quit guard: preload `dirty`, editor calls it; `before-quit` finds dirty editors, shows the first, asks with `dialog.showMessageBox` "Review" / "Quit anyway"; "Quit anyway" sets a flag and quits (F14). Quit item becomes `{ label: 'Quit Snapmark', accelerator: 'Command+Q', click: () => app.quit() }` — proof: the smoke test still passes (the editor's `dirty` call must not break it); quit by hand
- [ ] 8. Updates: the manual check calls `autoUpdater.checkForUpdates()` and always notifies — up to date / downloading / "Couldn't check for updates: <message>"; background checks stay quiet; `update-downloaded` sets the waiting version, and "Restart to install <version>" calls `autoUpdater.quitAndInstall()` (F15, F16) — proof: `test/menu.test.ts` for the item; notifications by hand
- [ ] 9. Registered shortcuts kept in a `Set`; the menu shows the accelerator only when registered, else appends " (shortcut unavailable)" (F17) — proof: `test/menu.test.ts`
- [ ] 10. README menu section — proof: `grep -n "Copy file path" README.md`
- [ ] 11. Verify, PR, auto-merge, archive, close `snap-om3` — proof: CI `check` passes

## Risks

| Risk                                                                                | What we do                                                                                            | Where it lands |
| ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | -------------- |
| `type: 'header'` renders as a plain item on macOS 13 or older                       | Accepted: still readable; the owner runs macOS 15                                                     | accepted       |
| `popUpContextMenu` on click changes how the icon highlights                         | Check by hand after install; if it looks wrong, keep `setContextMenu` and rebuild on `menu-will-show` | manual, step 3 |
| Renaming the current session while an editor is open saves into the old folder name | Editors store the session name; rename also updates every open editor's entry in `editors`            | step 4         |
| Quit guard blocks shutdown or restart of the Mac                                    | "Quit anyway" is one click; macOS shows the app as blocking and the owner can choose                  | accepted       |
| Menus, notifications and quit cannot be driven in CI                                | Template logic is tested in Node; the rest is a manual pass by the owner                              | step 2, manual |

## Out of scope

- "Keyboard shortcuts…" and a prompt that explains every mark: they ship with the editor change (`snap-8p1`).
- Any other editor change.
- Signing, notarizing and a public release host.

## Done

- `npm run format && npm run lint && npm run typecheck && npm test` exits 0.
- `npm run smoke` passes.
- `test/menu.test.ts` checks F1–F5, F10, F11, F16, F17 and passes.
- Every task above is ticked; departures are logged under `## Revisions`.
- Nothing outside `## Files that change` is edited, apart from archiving this folder.
- Stop and report as soon as a step cannot proceed. Never work around a blocker.
- Stop after 40 turns if not met. Report what is missing.

## Goal handover

```
/goal Build changes/2026-09-25-menu-layout/plan.md in its order of work; every outcome in
changes/2026-09-25-menu-layout/facts.md must hold; tick tasks as they land; log departures
under ## Revisions.

Done:
- `npm run format && npm run lint && npm run typecheck && npm test` exits 0.
- `npm run smoke` passes.
- `test/menu.test.ts` checks F1–F5, F10, F11, F16, F17 and passes.
- Every task in plan.md's Order of work is ticked; departures are logged under ## Revisions.
- Nothing outside plan.md's `## Files that change` is edited, apart from archiving the folder.
- Stop and report as soon as a step cannot proceed. Never work around a blocker.
- Stop after 40 turns if not met. Report what is missing.
```

## Revisions

Only after approval. One line per change: `YYYY-MM-DD — what changed, and why`.
