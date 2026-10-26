---
linear: none
type: plan
change: 2026-10-26-picked-designs
design: null
author: Claude (orchestrator)
status: approved
reviewed_by: Calvin Dudek
approved_at: 2026-10-26
created: 2026-10-26
---

# Plan: the capture bar, editor and recording the owner picked on 2026-10-26

> Four milestones: macOS-style keys and a clearer capture bar, an editor that shows where a screenshot goes, GIF recording with key frames, and Capture Scrolling that scrolls by itself.

A person with no context builds from this file alone. [intent](intent.md), [facts](facts.md) and [spec/](spec/brief.md) are for the gate. The words, states and layouts the build must match are in [spec/screens.md](spec/screens.md) and [spec/interaction.md](spec/interaction.md). Paths below are under `snapmark-app/` unless they start with `docs/`.

## How this is delivered (one go)

- Four milestones, from `decisions.json`. Each is a branch `milestone/picked-designs-<n>`, its own PR to `main`, and its own release.
- Inside a milestone, each feature is a commit. No checks run between features.
- Each milestone runs `verify_gate.py milestone`, validation, one fix round, then its PR with auto-merge armed.
- **Stacked:** milestone 1 is cut from `milestone/monorepo-private-1`, because the app moved into `snapmark-app/` there. Rebase onto `origin/main` once PR #97 merges.

## Milestones

### Milestone 1: capture bar, keys and countdown

After it, the owner captures with ⌃⇧1–⌃⇧5 as macOS does, closes the bar with Esc from any app, and sees one blue Capture.

| #   | Feature                                                                           | Facts       | Branch                       | State |
| --- | --------------------------------------------------------------------------------- | ----------- | ---------------------------- | ----- |
| 1.1 | Guide rules and ADRs                                                              | F33–F35     | `milestone/picked-designs-1` | done  |
| 1.2 | Global keys, menu rows, Keyboard Shortcuts, busy rule                             | F1–F10      | `milestone/picked-designs-1` | done  |
| 1.3 | Capture bar: focus, global Esc, two rows, modes 1–5, destination, Options, tokens | F11–F27, N1 | `milestone/picked-designs-1` | done  |
| 1.4 | Countdown overlay                                                                 | F28–F32     | `milestone/picked-designs-1` | todo  |

### Milestone 2: editor destination, notes, hex field, session window size

After it, the owner switches Session and One-Shot in the editor, picks any session, and pastes hex codes with `#`.

| #   | Feature                                                      | Facts       | Branch                       | State |
| --- | ------------------------------------------------------------ | ----------- | ---------------------------- | ----- |
| 2.1 | Editor destination: live switch, session pop-up, Copy closes | F36–F51, N2 | `milestone/picked-designs-2` | todo  |
| 2.2 | Notes spacing and hairline; hex fields                       | F52–F56     | `milestone/picked-designs-2` | todo  |
| 2.3 | Session window opens at 90 % and remembers its size          | F57, F58    | `milestone/picked-designs-2` | todo  |

### Milestone 3: GIF recording with key frames

After it, the owner records up to 30 s, marks the key frames, and the session holds a filmstrip PNG and a GIF.

| #   | Feature                                                                    | Facts         | Branch                       | State |
| --- | -------------------------------------------------------------------------- | ------------- | ---------------------------- | ----- |
| 3.1 | Spike: frames from `desktopCapturer` at 15 fps, a GIF from ImageIO via JXA | none (proof)  | `milestone/picked-designs-3` | todo  |
| 3.2 | Record mode, Frame Rate, picker keep, recording control, stop and cancel   | F59–F68, F81  | `milestone/picked-designs-3` | todo  |
| 3.3 | Key frames and GIF timing (pure functions)                                 | F69, F70, F77 | `milestone/picked-designs-3` | todo  |
| 3.4 | Recording editor and frame data                                            | F71–F76       | `milestone/picked-designs-3` | todo  |
| 3.5 | Session window entry, `session.md` and export                              | F78–F80       | `milestone/picked-designs-3` | todo  |

### Milestone 4: Capture Scrolling scrolls by itself

After it, a long page scrolls itself into one screenshot, and the owner scrolls only when Snapmark cannot.

| #   | Feature                                                             | Facts        | Branch                       | State |
| --- | ------------------------------------------------------------------- | ------------ | ---------------------------- | ----- |
| 4.1 | Auto-scroll with manual fallback; scrolling control ⓧ and Done keys | F82–F86, F88 | `milestone/picked-designs-4` | todo  |
| 4.2 | Settings ▸ Capture: the Accessibility row                           | F87          | `milestone/picked-designs-4` | todo  |

## Approach

- **What changes:** the global keys, the capture bar, a countdown overlay, the editor's toolbar, recording, and auto-scroll.
- **What stays the same:** the editor's tools and marks, Beautify's design, session folders, and ⌃⇧N.
- **Why this way:** each milestone ships a whole job the owner asked for, smallest risk first.

### Keys (1.2)

- `SHORTCUTS` in `src/keys.ts` gains `newArea` (⌃⇧1), `oneShot` (⌃⇧2) and `fullScreen` (⌃⇧3). `capture` becomes ⌃⇧4 Capture Last Area.
- ⌃⇧1 calls `captureArea(true)`. ⌃⇧2 calls `shoot(['-i'], true)`, which already takes `oneShot`. ⌃⇧4 calls `captureArea()`.
- ⌃⇧3 runs plain `screencapture -x` with one file per display, as macOS does. Each file opens its own editor.
- `newSession()` sets `area = null`, so the next ⌃⇧4 asks (Q2).
- `busy()` guards every capture key, as today.
- Rejected: taking ⇧⌘3–⇧⌘5 themselves. macOS keeps them (EX-11).

### Capture bar (1.3)

- The bar stays a non-activating panel and becomes the key window when it opens. Its keys then reach the bar, never the app behind.
- While the bar is open, `globalShortcut.register('Escape')` closes it, using today's countdown pattern. Skip it when `SNAPMARK_NO_UI` is set, so smoke never steals the owner's Esc.
- Two rows: headline and destination, then the controls. Modes 1–5 now; Record joins as 6 in milestone 3.
- The bar's Session | One-Shot replaces Options ▸ Save to and drives today's `setOneShot`.
- The session pop-up reuses `editorSessionMenu`, extended with counts and Older Sessions…. A pick calls today's `makeCurrent`.
- `tip.html` and `tip.ts` go, with their IPC (Q3).
- Rejected: every bar key as a temporary global shortcut. It would steal digits, Tab and arrows from every app.

### Countdown (1.4)

- A new click-through panel, `src/countdown.html`, built like today's `tip` window: not focusable, ignores the mouse, content-protected, screen-saver level.
- `countdown()` shows it, keeps the menu bar digit, and destroys it before the 200 ms wait.

### Editor destination (2.1)

- A new IPC, `editor:destination`, flips `ed.oneShot` and `ed.session` in the main process. The page swaps the column and the primary button.
- Beautify settings travel in session mode too, so a switch needs no reload.
- One-Shot Copy closes the window; `beforeunload` keeps the capture in Discarded as "Copied One-Shot".
- ⌘C commits only when no text field has focus, as `editor.ts` guards it today.
- Rejected: reopening the editor in the other mode. It loses undo history and flickers.

### Recording (3.1–3.5)

- Frames come from `desktopCapturer` and `getUserMedia` in a hidden page, `src/recorder.html`. It draws the cropped area to a canvas at the chosen fps. Frames go to temp files.
- Rejected: repeated `screencapture -R`. It cannot reach 10–15 fps.
- The GIF is written by ImageIO through JXA, like `src/ocr.ts` does: `CGImageDestinationCreateWithURL` with `com.compuserve.gif`, per-frame `DelayTime`, `LoopCount` 0.
- Step 3.1 proves this first. If JXA cannot bridge the CF types, stop and ask the owner about a dependency (Ask tier).
- Key frames: a pure function in `src/keyframes.ts`, beside `stitch.ts`. It drops identical frames by hash, then compares downscaled copies against a threshold.
- The session stores `img/NNN.png` (filmstrip), `img/NNN.gif`, and `.edit/NNN/frames/` plus `.edit/NNN.json` for the marks.
- Rejected: decoding the GIF for Edit Again. It has 256 colours and merged frames.

### Auto-scroll (4.1, 4.2)

- JXA posts `CGEventCreateScrollWheelEvent2` in pixel units, under 90 % of the area height, then waits before each grab.
- `stitch.ts` `add()` already says `same`; two in a row end the capture.
- `systemPreferences.isTrustedAccessibilityClient(false)` decides auto or manual.

## Design changes

All in milestone 1, feature 1.1. Then `python3 scripts/design_index.py write`.

- `docs/designs/2026-10-25-adr-keys-follow-macos.md`: the Decision lists ⌃⇧1–⌃⇧5 as A4 gives. Add `amended_by` for the new ADR.
- `docs/designs/2026-10-25-adr-capture-bar-and-settings-window.md`: decisions 3, 6 and 11 change. One-Shot moves to a segmented control. Record and Full Screen join. The drawn label goes.
- New `docs/designs/2026-10-26-adr-recording-key-frames.md`: Record, key frames, filmstrip plus GIF, the 30 s cap, and the keys while recording.
- `docs/ux/interaction-guidelines.md`: add CAP-12, CAP-13, REC-1, REC-2, KEY-7 and ACC-6, as spec/conformance.md words them. Update KEY-1, CAP-1, CAP-3, CAP-9, CAP-10, WIN-2, WIN-4, EX-7 and EX-10. The owner accepts them at this gate.
- `docs/ux/sitemap.md`: each milestone PR updates the whole-app sitemap for what it ships.

## Where things go

| New file                                 | Folder               | Why there                                       |
| ---------------------------------------- | -------------------- | ----------------------------------------------- |
| `countdown.html`, `countdown.ts`         | `snapmark-app/src/`  | every window's page lives in `src/`             |
| `recorder.html`, `recorder.ts`           | `snapmark-app/src/`  | the hidden capture page                         |
| `keyframes.ts`                           | `snapmark-app/src/`  | pure logic beside `stitch.ts`                   |
| `gif.ts`                                 | `snapmark-app/src/`  | the JXA ImageIO writer, beside `ocr.ts`         |
| `scroller.ts`                            | `snapmark-app/src/`  | the JXA scroll-event poster                     |
| `keyframes.test.ts`                      | `snapmark-app/test/` | plain-Node unit tests live in `test/`           |
| `2026-10-26-adr-recording-key-frames.md` | `docs/designs/`      | decisions live there                            |
| the 3.1 spike script                     | `snapmark-app/test/` | `spike-gif.ts`, kept as a unit test of `gif.ts` |

## Files that change

| File                                                                                                                             | Change                                                                                                          |
| -------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `docs/ux/interaction-guidelines.md`                                                                                              | new and changed rules (1.1)                                                                                     |
| `docs/designs/2026-10-25-adr-keys-follow-macos.md`                                                                               | keys as A4 (1.1)                                                                                                |
| `docs/designs/2026-10-25-adr-capture-bar-and-settings-window.md`                                                                 | decisions 3, 6, 11 (1.1)                                                                                        |
| `docs/designs/2026-10-26-adr-recording-key-frames.md`                                                                            | new (1.1)                                                                                                       |
| `docs/designs/INDEX.md`                                                                                                          | regenerated (1.1)                                                                                               |
| `docs/ux/sitemap.md`                                                                                                             | per milestone                                                                                                   |
| `snapmark-app/package.json`                                                                                                      | `build` copies the new pages and drops `tip.html`; `test` runs `keyframes.test.js`. Scripts only, no dependency |
| `snapmark-app/src/keys.ts`                                                                                                       | new keys and rows (1.2, 1.3, 2.1, 3.4)                                                                          |
| `snapmark-app/src/menu.ts`                                                                                                       | five capture rows; session menu counts and Older Sessions…; Copy or Save for recordings                         |
| `snapmark-app/src/main.ts`                                                                                                       | key registration, bar focus and Esc, countdown, destination IPC, recorder, viewer size, auto-scroll             |
| `snapmark-app/src/capture.ts`                                                                                                    | modes, full-screen arguments, Frame Rate, no Save to                                                            |
| `snapmark-app/src/shared.d.ts`                                                                                                   | `CaptureMode`, `CaptureOpts.fps`, new IPC types                                                                 |
| `snapmark-app/src/preload.ts`                                                                                                    | new IPC calls                                                                                                   |
| `snapmark-app/src/bar.html`, `bar.ts`                                                                                            | two rows, labels, digits 1–6, destination, keys                                                                 |
| `snapmark-app/src/tip.html`, `tip.ts`                                                                                            | deleted (1.3)                                                                                                   |
| `snapmark-app/src/countdown.html`, `countdown.ts`                                                                                | new (1.4)                                                                                                       |
| `snapmark-app/src/scroll.html`, `scroll.ts`                                                                                      | shared panel: ⓧ, clock, Done (3.2, 4.1)                                                                         |
| `snapmark-app/src/area.html`, `area.ts`                                                                                          | hints; Record keeps the last area (1.2, 3.2)                                                                    |
| `snapmark-app/src/editor.html`, `editor.ts`                                                                                      | destination, notes spacing, hex, recording canvas                                                               |
| `snapmark-app/src/tools.ts`                                                                                                      | hex parse on paste                                                                                              |
| `snapmark-app/src/sessions.ts`                                                                                                   | recording entries, `.gif`, frame data                                                                           |
| `snapmark-app/src/viewer.html`, `viewer.ts`                                                                                      | recording entry, Play; window size (2.3, 3.5)                                                                   |
| `snapmark-app/src/exporter.ts`                                                                                                   | recordings in PDF and ZIP                                                                                       |
| `snapmark-app/src/settings.html`, `settings.ts`                                                                                  | Accessibility row (4.2)                                                                                         |
| `snapmark-app/src/stitch.ts`                                                                                                     | stop after two `same` (4.1)                                                                                     |
| `snapmark-app/src/recorder.html`, `recorder.ts`, `keyframes.ts`, `gif.ts`, `scroller.ts`                                         | new                                                                                                             |
| `snapmark-app/test/keys.test.ts`, `menu.test.ts`                                                                                 | the old key assertions (F1, F2, F5, F20, F217, F236) change with the keys. This change owns them                |
| `snapmark-app/test/capture.test.ts`, `colour.test.ts`, `guide.test.ts`, `sessions.test.ts`, `exporter.test.ts`, `stitch.test.ts` | new blocks per fact                                                                                             |
| `snapmark-app/test/keyframes.test.ts`, `spike-gif.ts`                                                                            | new                                                                                                             |
| `snapmark-app/test/smoke.ts`                                                                                                     | bar, countdown, editor, recording and scrolling blocks; the one-shot block splits                               |

## Order of work

Each step has a proof. No checks run between features; the proofs run at the milestone gate.

### Milestone 1

- [x] 1. Write the guide rules and the three ADRs; regenerate the index. Proof: `python3 scripts/design_index.py write` leaves no diff, and `@F33`–`@F35` pass.
- [x] 2. Keys, menu rows, busy rule, area reset. Proof: `@F1`–`@F10` pass.
- [x] 3. The bar: focus, global Esc, rows, modes, destination, Options, tokens; delete `tip`. Proof: `@F11`–`@F27` and `@N1` pass.
- [ ] 4. The countdown overlay. Proof: `@F28`–`@F32` pass.
- [ ] 5. Gate. Proof: `python3 scripts/verify_gate.py milestone 2026-10-26-picked-designs` ends `VERIFY PASS`.

### Milestone 2

- [ ] 6. Destination IPC, toolbar controls, pop-up, Copy closes, ⌘C guard. Proof: `@F36`–`@F51` and `@N2` pass.
- [ ] 7. Notes spacing and hex fields. Proof: `@F52`–`@F56` pass.
- [ ] 8. Session window size. Proof: `@F57`, `@F58` pass.
- [ ] 9. Gate. Proof: `VERIFY PASS milestone`.

### Milestone 3

- [ ] 10. Spike: 15 fps frames from a test page, and a 3-frame GIF with set delays. Proof: `test/spike-gif.ts` reads back three frames and their delays.
- [ ] 11. Record mode, panel, stop and cancel. Proof: `@F59`–`@F68`, `@F81` pass.
- [ ] 12. Key frames and GIF timing. Proof: `@F69`, `@F70`, `@F77` pass.
- [ ] 13. Recording editor and frame data. Proof: `@F71`–`@F76` pass.
- [ ] 14. Session window, `session.md`, export. Proof: `@F78`–`@F80` pass.
- [ ] 15. Gate. Proof: `VERIFY PASS milestone`.

### Milestone 4

- [ ] 16. Auto-scroll, fallback, panel keys. Proof: `@F82`–`@F86`, `@F88` pass.
- [ ] 17. Settings row. Proof: `@F87` passes.
- [ ] 18. Gate. Proof: `VERIFY PASS milestone`.

## Risks

| Risk                                                                      | What we do                                                                                       | Where it lands |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | -------------- |
| JXA may not bridge ImageIO's CF types for a GIF                           | Prove it first; on failure stop and ask the owner about a dependency (Ask tier)                  | step 10        |
| `desktopCapturer` may not hold 15 fps on a Retina area                    | Measure in the spike; scale to 1× before saving if needed, and say so in Revisions               | step 10        |
| 450 Retina frames are about 2.9 GB raw                                    | Write each frame to a temp file at once; never hold them in memory                               | step 11        |
| Frame data makes session folders large                                    | Measure one 30 s recording; if over 100 MB, store non-key frames as JPEG and log it in Revisions | step 13        |
| A global Esc in smoke would steal the owner's Esc                         | Skip the registration when `SNAPMARK_NO_UI` is set; F11 is also checked by hand                  | step 3         |
| The bar may not stay the key window after a click elsewhere               | Global Esc is the backup (A1); a click on the bar refocuses it                                   | step 3         |
| The toolbar must still fit at 820 pt (F108 today) with two new controls   | Shrink order from spec/screens.md; `@N2` measures it                                             | step 6         |
| Old key assertions in `keys.test.ts` and `menu.test.ts` fail              | Change them in the same commit as the keys; they encode the old keys this change replaces        | step 2         |
| The one-shot smoke block runs ⌘C, then ⇧⌘S, then ⌘↵ on one window         | Split it: Copy now closes the window                                                             | step 6         |
| Auto-scroll events land in the wrong window                               | Post at the area's centre; stop on the first `lost`                                              | step 16        |
| Validation finding accepted: blue means chosen, next move and outline     | Accepted: the macOS accent convention                                                            | accepted       |
| Validation finding accepted: "One-Shot" shows three times in the bar      | Accepted: CAP-5 names the outcome                                                                | accepted       |
| Validation finding accepted: Show All Frames was not asked for            | Accepted (Q12 default)                                                                           | accepted       |
| Validation finding accepted: the panel may sit inside a full-display area | Accepted: content-protected, outside when there is room                                          | accepted       |
| Validation finding accepted: recordings sit under the "Screenshots" tab   | Accepted: an existing place                                                                      | accepted       |
| Orchestrator defaults Q2–Q6, Q11–Q13 may not be what the owner wants      | The owner confirms them at this gate                                                             | gate           |

## Out of scope

- Everything in facts.md's `## Out of scope`.
- The design system file proposed in spec/conformance.md.
- Re-drawing the prototype; the picked mockups stay the reference.

## Done

The criteria as data are in [done.json](done.json).

- `python3 scripts/verify_gate.py milestone 2026-10-26-picked-designs` ends `VERIFY PASS` once per milestone.
- F1 to F88, N1 and N2 pass by their tagged checks.
- `validation.md` has a row per fact and ask, with no `not met` row.
- `tip.html` and `tip.ts` no longer exist; `countdown.html` and `recorder.html` exist.
- `docs/designs/2026-10-26-adr-recording-key-frames.md` exists and `INDEX.md` lists it.
- Nothing outside `## Files that change` is edited.
- Stop and report as soon as a step cannot proceed. Never work around a blocker.
- Stop after 200 turns if not met. Report what is missing.

## Goal handover

The kit's `templates/goal/run.txt`, filled, with this repo's rules added. The branches are stacked on `milestone/monorepo-private-1` until PR #97 merges.

```
/goal Deliver change 2026-10-26-picked-designs in one go per changes/2026-10-26-picked-designs/plan.md and facts.md: every milestone in ## Milestones, in order, each on its own branch milestone/picked-designs-<n> cut from the previous one (the first from origin/main), so building never waits for a merge. Per feature: write the tests for its facts, build in the plan's folders, commit; run no checks, no lint and no tests between features, and start the next feature at once. An open question never stops the build: write it to changes/2026-10-26-picked-designs/questions.md with the default you took, tell the engineer in one line, and carry on; an answer that arrives becomes an ask of the next milestone. Per milestone, once its features are committed: run `python3 scripts/verify_gate.py milestone 2026-10-26-picked-designs` and the Stage 6 checks once on the milestone diff, then validate every fact and ask of that milestone against the built app into changes/2026-10-26-picked-designs/validation.md (expected, observed, evidence, verdict), one findings.md section, one fix round, rerun the gate and paste its full output, open the PR milestone/picked-designs-<n> -> main and arm auto-merge (ask first when a Critical or High is deferred); a later milestone opens its PR once the previous one has merged, after `git rebase --onto origin/main milestone/picked-designs-<n-1>`, and keeps building meanwhile. Met only when every milestone's PR is merged or open with auto-merge armed, the last gate line is `VERIFY PASS milestone 2026-10-26-picked-designs <sha>` with <sha> equal to `git rev-parse HEAD`, validation.md has no `not met` row and findings.md no open blocking item. Also met, as a stop-and-ask, on `VERIFY BLOCKED`: summarize changes/2026-10-26-picked-designs/verify/report.md for the engineer. Never edit protected paths (facts.md, done.json, lock.json, baselines, allowlists, sdlc.json checks) or accept baselines. Tick plan tasks as they land; log departures under ## Revisions. Stop after 200 turns and report. Repo rules: milestone 1 is cut from milestone/monorepo-private-1, not origin/main, until PR #97 merges; then rebase every milestone branch onto origin/main. Never launch Electron windows or capture the owner's screen locally; smoke runs only inside the milestone gate (`smoke:background`) and in CI. No dependency changes: if the milestone 3 spike shows ImageIO via JXA cannot write the GIF, stop and ask. After each release, install it for the owner from the release ZIP (signature and Gatekeeper checked) and say which version is installed. Close each subagent once its report is in.
```

## Revisions

- 1.1: `test/guide.test.ts` F3 (accepted rules match `guideAccepted`) also counts the six rules this change's gate accepted (CAP-12, CAP-13, REC-1, REC-2, KEY-7, ACC-6), listed in the test with `@F33`; otherwise F3 would reject any rule added after the interaction-guide-polish gate. EX-7 keeps its id and now records the global Esc (it bends WIN-4), since the drawn label it excused is retired (Q3).
- 1.3: tests that encoded the replaced bar changed with it, as the facts say they replace them. `test/capture.test.ts` F202, F211 and F216 now hold `@F15`, `@F26` and CAP-6 for the five modes; its `@F4` source check follows ⌃⇧3 through `captureArgs('full')`, still no arguments. `test/menu.test.ts` F114 and F118 read the shared pop-up's counts and Older Sessions…. `test/keys.test.ts` F236's bar rows and keys follow the new bar. In `test/smoke.ts` the bar block replaces F202, F203, F9, F10 and the drawn label's F5–F8, and F223 switches One-Shot with the segment instead of Options ▸ Save to. `settings.html` gains the 3 Seconds timer (questions.md).
