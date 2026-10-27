---
linear: none
type: plan
change: 2026-10-27-calm-style
design: null
author: Claude (orchestrator)
status: approved
reviewed_by: Calvin Dudek
approved_at: 2026-10-27
created: 2026-10-27
---

# Plan: a calm Snapmark on the owner's design system

> Three milestones: the tokens and a one-row capture bar, then the panels with recording and auto-scroll, then the big windows.

A person with no context builds from this file alone. [intent](intent.md) and [facts](facts.md) are for the gate. The look per window is in [spec/screens.md](spec/screens.md). Paths are under `snapmark-app/` unless they start with `docs/` or `scripts/`.

## How this is delivered (one go)

- One `/goal` builds the three milestones in order. Each is on `milestone/calm-style-<n>`, cut from the one before.
- Per feature: write its tests, build, commit. No checks between features.
- Per milestone: the gate once, with smoke in the background and in CI. Validation, one findings section, then the owner's screenshot review.
- **UX findings go to the owner and are never auto-fixed.** Correctness bugs and failing tests are fixed in the one fix round.
- Each milestone's PR goes to `main` with auto-merge, and releases.

## Milestones

### Milestone 1: tokens and the one-row capture bar

- [x] 1.1 Tokens: `scripts/sync-tokens.mjs`, `design/product.json`, `design/tokens.lock.json`, `src/tokens.css`. F1, F2.
- [x] 1.2 Every window loads `tokens.css` and sets `data-surface="system"`. F3.
- [x] 1.3 The one-row bar: layout, chosen pill, one blue button, tooltips, the destination pop-up. F4–F15.
- [x] 1.4 Focus: no ring on open, the system ring after Tab, in the bar. F9, F10.

### Milestone 2: pop-up panels, recording and auto-scroll

- [x] 2.1 Countdown, area picker and scrolling control in the calm style. F16–F19, F22.
- [x] 2.2 Rebase picked-designs milestones 3 and 4 onto this branch, and restyle the recorder and recording control. F20.
- [x] 2.3 Record joins the bar as its sixth mode. F21.

### Milestone 3: editor, session window, Settings and Keyboard Shortcuts

- [ ] 3.1 Editor: pill tools, one blue button, edgeless fields, the More menu. F23–F26, F31.
- [ ] 3.2 Session window. F23–F25.
- [ ] 3.3 Settings and Keyboard Shortcuts: pill tabs, a window that grows, accent switches. F27, F28.
- [ ] 3.4 Zoom stops at 130 %, and every window fits. No colour literals left. F29, F30, N1.

## Approach

### Tokens (1.1)

- `scripts/sync-tokens.mjs` fetches design-system-starter at a pinned commit into a temp folder. It runs `node scripts/build-tokens.mjs --product <design/product.json>` there, then copies `tokens.css` into `src/`.
- The first line of `tokens.css` names the commit. `design/tokens.lock.json` holds the commit and the file's sha256.
- `test/style.test.ts` fails when `tokens.css` doesn't match the lock (F2). Updating the system means bumping the commit and rerunning the script.
- `design/product.json` sets the accent to `#0f72db` with white `on-accent`. Nothing else is overridden.
- No new dependency: the script uses `git` and Node only.

### Windows (1.2, 2.1, 3.x)

- Each window's `<style>` drops its own `--accent*`, `--fill-selected`, `--hairline` and hex values. It uses `--ds-*` names instead.
- One shared rule in `tokens.css` covers focus: `:focus-visible` only, `--ds-focus` colour, 2 px, offset 2.
- Windows that focus a control on open keep doing so for the keys. The ring stays hidden because the focus is programmatic and the window was opened by mouse or shortcut, not Tab. If Chromium still shows it, the window focuses its body instead and the first Tab lands on the first control.

### Capture bar (1.3)

- `bar.html`: one flex row, as in the approved mock. The headline, hint row, hairline and `.key` captions go.
- The Session | One-Shot segment and the session pop-up become one pop-up, using the menu `bar.ts` already builds. One-Shot is its first item.
- `capture.ts` `barSize`: the new height and width. It keeps the narrow-screen fallback (labels hide before anything clips).

### Picked-designs 3 and 4 (2.2)

- Rebase `milestone/picked-designs-4` onto `milestone/calm-style-1` once milestone 1 merges. Then merge it into `milestone/calm-style-2`.
- Their own facts F59–F88 keep their tests. Only their styles change.

## Where things go

- Tokens: `snapmark-app/src/tokens.css`, a generated file that is never hand-edited.
- Its source and lock: `snapmark-app/design/`.
- The sync script: `scripts/sync-tokens.mjs`.
- Style checks: `snapmark-app/test/style.test.ts`. Rendering checks: `snapmark-app/test/smoke.ts`.

## Files that change

- New: `scripts/sync-tokens.mjs`, `snapmark-app/design/product.json`, `snapmark-app/design/tokens.lock.json`, `snapmark-app/src/tokens.css`, `snapmark-app/test/style.test.ts`.
- Styles: `snapmark-app/src/{bar,area,countdown,scroll,recorder,editor,viewer,settings,shortcuts}.html`.
- Logic: `bar.ts` (one destination pop-up, tooltips), `capture.ts` (`barSize`), `main.ts` (zoom cap, focus on open), `editor.ts` (the More menu), `settings.ts` (window grows).
- Tests: `test/smoke.ts`, `test/capture.test.ts`, `test/keys.test.ts`, only where they encode a replaced style.
- Docs: `snapmark-app/README.md` and `docs/ux/setup.md`, for the new look and the token source.

## Order of work

1. Milestone 1: 1.1, 1.2, 1.3, 1.4, then the gate and the owner's screenshot review.
2. Milestone 2: 2.1, 2.2, 2.3, cut from milestone 1, then the same.
3. Milestone 3: 3.1, 3.2, 3.3, 3.4, cut from milestone 2, then the same.

## Risks

- **Focus ring on open.** Chromium may treat the bar's opening focus as keyboard focus. The fallback in Approach covers it; F9 proves it.
- **Vibrancy with `transparent` surfaces.** On Linux CI there's no material. The tokens' web greys apply when `data-surface` is unset there, so smoke still renders.
- **Rebasing picked-designs 3 and 4.** Their styles conflict with milestone 1's. The plan resolves conflicts to the calm style, and keeps their behaviour and tests.
- **Editor More menu.** It is new behaviour, small: the overflow tools move into a menu. Keys still reach every tool.

## Out of scope

- Words and labels. The 16 wording findings of the audit wait for a later change.
- The Settings and updates rework (snap-bmr.25). It builds on this change's Settings.
- Annotation colours and marks.

## Done

The criteria as data are in [done.json](done.json).

- `python3 scripts/verify_gate.py milestone 2026-10-27-calm-style` ends `VERIFY PASS` once per milestone.
- F1 to F31, N1 and N2 pass by their tagged checks.
- `validation.md` has a row per fact and ask, with no `not met` row.
- The owner has reviewed each milestone's screenshots before its PR merges.
- Nothing outside `## Files that change` is edited.
- Stop and report as soon as a step cannot proceed. Never work around a blocker.
- Stop after 200 turns if not met. Report what is missing.

## Goal handover

```
/goal Deliver change 2026-10-27-calm-style in one go per changes/2026-10-27-calm-style/plan.md and facts.md: every milestone in ## Milestones, in order, each on its own branch milestone/calm-style-<n> cut from the previous one (the first from origin/main), so building never waits for a merge. Per feature: write the tests for its facts, build in the plan's folders, commit; run no checks, no lint and no tests between features, and start the next feature at once. An open question never stops the build: write it to changes/2026-10-27-calm-style/questions.md with the default you took, tell the engineer in one line, and carry on. Per milestone, once its features are committed: run `python3 scripts/verify_gate.py milestone 2026-10-27-calm-style` once, validate every fact and ask of that milestone into changes/2026-10-27-calm-style/validation.md (expected, observed, evidence, verdict), write findings.md; fix only correctness bugs and failing tests in one fix round, and put every UX finding plus the milestone's screenshots in front of the owner in plannotator and wait for their notes before changing any look; rerun the gate and paste its full output, open the PR milestone/calm-style-<n> -> main and arm auto-merge once the owner has reviewed. A later milestone opens its PR once the previous one has merged, after `git rebase --onto origin/main milestone/calm-style-<n-1>`, and keeps building meanwhile. Met when every milestone's PR is merged or open with auto-merge armed, the last gate line is `VERIFY PASS milestone 2026-10-27-calm-style <sha>` with <sha> equal to `git rev-parse HEAD`, validation.md has no `not met` row and findings.md no open blocking item. Also met, as a stop-and-ask, on `VERIFY BLOCKED`: summarize changes/2026-10-27-calm-style/verify/report.md for the engineer. Never edit protected paths (facts.md, done.json, lock.json, baselines, allowlists, sdlc.json checks). Tick plan tasks as they land; log departures under ## Revisions. Stop after 200 turns and report. Repo rules: work in the worktree .worktrees/calm-style; use /usr/bin/git. Never launch Electron windows or capture the owner's screen locally; smoke runs only inside the milestone gate (`smoke:background`) and in CI. No dependency changes. After each release, say which version shipped and how to install it. Close each subagent once its report is in.
```

## Revisions

- 1.1: these files were outside Files that change.
  - Root `package.json` gains `npm run tokens`.
  - `snapmark-app/package.json` copies `tokens.css` into `dist/src/`, and runs `test/style.test.ts` in `npm test`.
  - `.prettierignore` skips the generated `tokens.css`, so its sha256 holds.
- 1.2: new `snapmark-app/src/surface.ts`. Every window loads it in `<head>`, before the first paint, with CSP unchanged.
  - It sets `data-surface="system"` on macOS. The shared preload can run before `<html>` exists, so it can't.
  - `tokens.css` has no focus rule, so each window carries its own `:focus-visible` rule on `--ds-color-focus`.
- 1.3: `src/shared.d.ts` was outside Files that change. `BarInit` loses `heads`, as the headline and hint row go.
  - `capture.ts` loses `barHeads` and gains `destMenu`.
  - Record (F21) joins in milestone 2, so the bar has five modes for now.
- 1.3: checks for replaced styles were rewritten.
  - `test/capture.test.ts`: @F17 (headline and hint) is gone; @F27 `barSize` became @F14.
  - `test/keys.test.ts`: @F18 key order and the ⇧⌘O and ⇧⌘P captions became @F11 tooltips.
  - `test/smoke.ts`: @F14, @F17, @F18, @F20–@F24 and @F27 became @F4–@F8 and @F11–@F14.
  - `test/smoke.ts`: F204's Tab order now runs through the destination.
- 1.4: headless Chromium 151 draws the ring for a script focus before any click.
  - So the bar focuses its chosen mode with `focus({ focusVisible: false })`. The keys still work; the ring waits for Tab.
  - The body-focus fallback is not needed.
- Milestone 1 gate: `test/menu.test.ts` @F23 read the old bar pick's source line.
  - It now reads the pop-up's `moveTo`, still `setActive`, and its `editorSessionMenu` call.
- Milestone 1 gate: `test/colour.test.ts` @N1 read the old bar tokens.
  - It now checks Capture's on-accent label on the accent fill from `tokens.css`, light and dark.
- Milestone 1 gate: `tests/sdlc.test.ts` asks for `## Order of work`, and each spec file or a recorded skip.
  - The plan gains Order of work. `decisions.json` records the skipped spec files and why.
  - `intent.md` links its resources in the folder. A4's words join A3, since no fact cites A4 alone.
- Milestone 1 gate: the smoke's editor checks failed behind a full-screen app window: covered windows stop rendering.
  - `test/smoke.ts` turns background throttling off for every window it opens. No app code changes.
- Milestone 1 gate: @F10's check read the focus token as `color`, which computes another colour than the ring.
  - It now reads every token as an outline colour, as the ring draws it.
- Milestone 1 gate: the smoke limit rises from 150 to 240 s. Unthrottled windows reached 145 s before its last block.
- Milestone 1 gate: the @F32 countdown read keeps its last digit when the countdown closes mid-read. Unthrottled timing exposed the race.
- Milestone 1 review: the revisions move out of the Goal handover's code block, under their own heading.
- Milestone 1 review, finding 1: Chromium draws `-webkit-focus-ring-color` as its fixed orange `#e59700`. Electron sets no system colour for it.
  - `main.ts` passes `systemPreferences.getAccentColor()` through `capture.ts` `barRing`. Under 3:1, the ring takes the text colour.
  - `BarInit` gains `ring`, and `label` becomes `labels`, one per mode, as Capture's label follows the mode.
- Milestone 1 review, finding 4: the bar draws its tooltips in its own page, beside the control. No `title` attributes remain.
  - `test/keys.test.ts` and `test/smoke.ts` @F11 read `data-tip` and `data-key` instead of `title`.
- Milestone 1 review: smoke @F12 and @F13 expect the face without its date, and "Start Scrolling" while Scrolling is chosen.
- Milestone 1 review: `test/capture.test.ts` imports `namePart` from `sessions.ts` for the face's name.
- After merge: the release runner's small screen made the bar narrow, so `@F5` read no names. It now lifts `narrow` while it measures.
- After merge: smoke clicks Capture after its script answers, as on Linux the closing bar disposed the frame before the answer arrived.
- 2.2: picked-designs 3 and 4 (12 commits) were replayed with a rebase onto milestone/calm-style-2. They bring their own files, as 2.2 asks.
- 2.2: conflicts went to the calm style. Their `barHeads` goes with milestone 1's headline and hint row: Record's hint and F82's "Snapmark scrolls the area for you".
  - Their checks of it go too: capture.test.ts @F17, @F59 and @F82 on `barHeads`, and the two-row bar checks in smoke.ts.
  - The scrolling control's status line still says who scrolls.
- 2.2: their two-row bar.html, bar.ts and bar checks keep milestone 1's calm bar. Record joins it in 2.3.
- 2.2: `src/countdown.ts`, outside Files that change: Record's outline drops the dimming by a class, as the dimming is now a layer.
- 2.2: `src/recorder.html` is a new window: it loads the tokens, and @F3's list gains it.
- 2.2: @F63's check reads the recording dot as the `--ds-color-error` token, not the literal reds.
- 2.2: the smoke's calm panel helper is `calmLook`, as their recording block has a `panelLook`.
- 2.2: 2.1's area and countdown comments said "grey", which @F22 reads as a colour name. The words changed.
- 2.2, rebased on milestone 1's fixes: the scrolling and recording controls ring as the bar does (finding 1). `src/scroll.ts`, outside Files that change, sets the ring `main.ts` passes in its query.
- 2.3: the bar is 1080 pt at 100 % with six modes, as the mock. capture.test.ts @F14's widths change with it.
- 2.3: picked-designs' @F59 and @F60 smoke checks read the chosen mode and the ticked frame rate, not the headline and hint.
- 2.3, rebased on milestone 1's fixes: Record's tooltip is the bar's drawn one, "Record" and 6, and Capture reads "Record" through `capture.ts`'s `VERBS`. The @F11, @F21 and label checks read it.
- Milestone 2 gate: smoke windows are fully transparent and click-through, so a background run never draws over the owner's apps.
