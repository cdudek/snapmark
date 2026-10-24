---
linear: none
type: facts
change: 2026-10-25-smoke-background
design: null
author: calvin.dudek@omr.com
status: approved
reviewed_by: calvin.dudek@omr.com (owner's words, 2026-10-25; beads snap-bmr.9)
approved_at: 2026-10-25
created: 2026-10-25
archived_at: 2026-10-25
---

# Facts: the smoke test runs without taking focus (beads snap-bmr.9)

## Goal

"Can we also make sure that the tests run without the application having focus or always switching to focus mode
so I can continue with my browser?" (owner, 2026-10-25). Agents run the smoke test many times a day.

## Acceptance criteria

- [x] **F1** Under `SNAPMARK_NO_UI` (set by `test/smoke.ts` and the audit harness) Snapmark never calls
      `app.focus`, never shows a Dock icon and runs as an accessory app.
- [x] **F2** `npm run smoke:background` runs the smoke test while polling the frontmost app every 200 ms, stops the
      run and fails the moment Electron or Snapmark is in front, and passes only on `smoke: ok`.
- [x] **F3** The full smoke suite passes with every existing check while TextEdit stays frontmost.
- [x] **F4** Production (no `SNAPMARK_NO_UI`) behaves as before: every `app.focus({ steal: true })` and the Dock
      icon logic are unchanged.
