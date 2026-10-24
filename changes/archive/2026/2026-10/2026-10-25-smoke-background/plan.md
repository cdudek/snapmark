---
linear: none
type: plan
change: 2026-10-25-smoke-background
design: null
author: calvin.dudek@omr.com
status: approved
reviewed_by: calvin.dudek@omr.com (owner's words, 2026-10-25; beads snap-bmr.9)
approved_at: 2026-10-25
created: 2026-10-25
archived_at: 2026-10-25
---

# Plan: the smoke test runs without taking focus

## Approach

The existing test switch `SNAPMARK_NO_UI` already marks a test run. Under it, `main.ts` skips `app.focus` (one
`focusApp()` helper replaces the ten calls), skips `updateDock`, and sets the accessory activation policy. Windows
still open with `show()`: an app that is not active orders its window in without becoming key app, so the checks
keep driving the real windows with `sendInputEvent`. Measured before the change: the baseline run put Electron in
front within the first second.

## Files that change

- `src/main.ts`: `quiet`, `focusApp()`, `updateDock` and the `whenReady` branch.
- `test/smoke-background.sh`, `package.json` (`smoke:background`), `README.md`.

## Order of work

- [x] Poll script, run against the old code: Electron took the front.
- [x] The switch in `main.ts`; poll script passes with TextEdit in front.
- [x] npm script and README.

## Risks

- `win.focus()` in `smoke.ts` asks macOS to activate without ignoring other apps, which does nothing while another
  app is active; with no active app at all it could still bring Snapmark forward, and the poll script would say so.
- CI (Linux, xvfb) has no frontmost app; `setActivationPolicy` is macOS only and called optionally.

## Done

- `npm run format && npm run lint && npm run typecheck && npm test && npm run smoke:background` pass.
- CI's `xvfb-run -a npm run smoke` passes.

## Goal handover

none — built in one session by the implementing agent against this plan; no /goal run.

## Revisions
