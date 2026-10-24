---
linear: none
type: plan
change: 2026-10-25-session-window
design: null
author: calvin.dudek@omr.com
status: approved
reviewed_by: calvin.dudek@omr.com (roadmap M1b and the round-2 mockups, 2026-10-25)
approved_at: 2026-10-25
created: 2026-10-25
archived_at: 2026-10-25
---

# Plan: the session window's new look and features (roadmap M1b)

## Approach

Keep the window's structure (one `ViewerInit` from main, a classic renderer script) and widen what main sends:
entries with heading, note count and whether Edit Again can open them, and this session's discarded items with a
ready-made date label. Rename and Reopen are two new IPC calls that reuse the menu's rename and `reopen()`.

## Files that change

- `src/sessions.ts`: `entries()` (heading and note count per entry), `whenLabel()`, `discardedIn()`; `rename()`
  moves the session's discarded items along.
- `src/main.ts`: `renameSession()` split from the AppleScript prompt so the window can call it; a renamed window is
  watched again instead of closed and reopened; `viewer:rename`, `viewer:reopen`; a closed editor refreshes its
  session's window; the window uses a hidden-inset title bar; one row in Keyboard Shortcuts.
- `src/shared.d.ts`, `src/preload.ts`: the new `ViewerInit` shape and the two calls.
- `src/viewer.html`, `src/viewer.ts`: header, segmented tabs, grid, "…" menu, one-at-a-time view with a way back,
  Discarded list, rename field. Brand blue for app UI, coral red for note numbers.
- `test/sessions.test.ts`, `test/smoke.ts`, `README.md`.

## Order of work

- [x] Pure logic in `sessions.ts` with unit tests (entries, whenLabel, discardedIn, rename moves discards).
- [x] Main and IPC: rename, reopen, reload after a discard, watcher follows a rename.
- [x] Renderer: header and tabs, grid and menu, single view, Discarded, rename in place.
- [x] Smoke checks: grid count, Edit Again from the grid, Remove via "…", Discarded + Reopen, rename ↩ / taken / Esc.
- [x] README and Keyboard Shortcuts.

## Risks

- The editor is changed in parallel by another agent; this change does not touch `src/editor.*` or `src/tools.ts`.
- Reloads must not drop typing in Document: a reload whose session.md is unchanged keeps the mounted field.

## Out of scope

- Undo Rename and Undo Remove (interaction guidelines F1, Confirmation and undo).
- Updating the "→ session" label inside an already open editor after a rename (it lives in `editor.ts`); the editor
  still saves into the renamed session, as with the menu's rename before.

## Done

- `npm run format && npm run lint && npm run typecheck && npm test && npm run smoke` pass.
- Every fact in `facts.md` holds, checked by the smoke test or the unit tests where it is behaviour.

## Goal handover

none — built in one session by the implementing agent against this plan; no /goal run.

## Revisions
