---
linear: none
type: plan
change: 2026-10-25-mac-shortcuts
design: docs/designs/2026-10-25-adr-keys-follow-macos.md
author: Calvin Dudek
status: approved
reviewed_by: Calvin Dudek
approved_at: 2026-10-25
created: 2026-10-25
---

# Plan: Shortcuts that work like macOS

> ⌃⇧3, ⌃⇧4 and ⌃⇧5 mirror macOS's screenshot keys; the editor and session window take Preview's and Finder's keys.

A person with no context builds from this file alone. [intent](intent.md) and
[facts](facts.md) are for the gate, not for the build. The UX plan is in [spec/](spec/): [interaction](spec/interaction.md) has every key per surface and state, [microcopy](spec/microcopy.md) every word, [validation](spec/validation.md) the review and the owner's answers.

## Approach

- **What changes:** one new data file, `src/keys.ts`, holds the global accelerators and the Keyboard Shortcuts rows. `main.ts` registers from it and renders from it, so the list and the keys never disagree. The editor's and session window's keydown handlers gain the new keys.
- **Multi-selection:** ⌘A builds a Fabric `ActiveSelection` with no resize or rotate handles. Its moves are recorded as a delta, applied to each mark after the selection is dropped. Undo and storing always drop the selection first, because Fabric keeps member positions relative to the selection.
- **Undo in the session window:** the window remembers the Discarded folder of its last removal. ⌘Z calls the existing `viewerReopen(dir)`. No new IPC.
- **What stays the same:** ⌘↵, ⇧⌘C, ⇧⌘S, ⌘W, ⌘Z, the tool keys, Esc closing past Select, and `selection: false` (no rubber band, no ⇧-click).
- **Rejected:** registering ⇧⌘3/4/5, which macOS keeps for itself.
- **Rejected:** keeping ⌃⇧1 as a second capture key.
- **Rejected:** resizing or rotating a multi-selection. Undo would need each mark's full transform.
- **Rejected:** a new IPC for the session window's undo.

The decision is recorded in [docs/designs/2026-10-25-adr-keys-follow-macos.md](../../docs/designs/2026-10-25-adr-keys-follow-macos.md).

## Design changes

- The ADR `docs/designs/2026-10-25-adr-keys-follow-macos.md` goes to `status: accepted` on plan approval, then `python3 scripts/design_index.py write`.
- `docs/ux/interaction-guidelines.md`, Keyboard and focus, rule 1: option (c) is chosen; rule 2 records Esc closing the editor as the owner's exception.

## Where things go

| New file or kind                        | Folder                                    |
| --------------------------------------- | ----------------------------------------- |
| key data (accelerators, shortcuts rows) | `src/keys.ts`                             |
| unit assertions for keys                | `test/keys.test.ts`, added to `npm test`  |
| unit assertions for the menu            | `test/menu.test.ts`                       |
| smoke checks                            | `test/smoke.ts`, editor and viewer checks |

## Feature PRs

One PR into `milestone/fixes`.

| #   | Feature                | Facts      | Branch                       | State |
| --- | ---------------------- | ---------- | ---------------------------- | ----- |
| 1   | Shortcuts follow macOS | F1–F20, N1 | `mac-shortcuts/1-macos-keys` | todo  |

## Files that change

| File                                                                        | Change                                                                                                                                                                                                                                                                                                                                                            |
| --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/keys.ts` (new)                                                         | `SHORTCUTS` (`capture: 'Control+Shift+4'`, `area: 'Control+Shift+3'`, `options: 'Control+Shift+5'`, `newSession: 'Control+Shift+N'`); `KEY_GROUPS`: "Anywhere", "Editor", "Session window" with the rows of spec/microcopy.md                                                                                                                                     |
| `src/menu.ts`                                                               | `captureOptions(a)` exported and used by the Capture Options submenu; Capture Options sublabel "⌃⇧5", or "(shortcut unavailable)" when not registered; `MenuState.shortcuts.options`                                                                                                                                                                              |
| `src/main.ts`                                                               | registers from `SHORTCUTS`; ⌃⇧5 pops `captureOptions(actions)` at the tray; one `busy()` check (picker open or scroll capture running) guards capture, Capture Last Area, the popup and its items; a menu-open flag; `showShortcuts()` renders `KEY_GROUPS` with a heading per group                                                                              |
| `src/editor.ts`                                                             | ⌘S (session: `save()`; one-shot: Save As); ⌘C copies in both modes and keeps the selection; arrows nudge 1 point, ⇧ 10, one step each; ⌘A selects all but redactions; a multi-selection moves and removes as one step; ⌘Z and storing drop the selection first; `save()` refuses a second call and an unloaded image; sliders and the colour well count as fields |
| `src/viewer.ts`                                                             | ↩ starts renaming when no button or field has focus; ⌘⌫ removes the screenshot shown large (one at a time); ⌘Z reopens the last removal once; ⌘O is Edit Again unless greyed; buttons blur after a pointer click                                                                                                                                                  |
| `src/viewer.html`                                                           | titles "Rename (↩)", "(⌘O)", "(⌘⌫)"; empty grid text names ⌃⇧4                                                                                                                                                                                                                                                                                                    |
| `package.json`                                                              | `test` runs `node dist/test/keys.test.js`                                                                                                                                                                                                                                                                                                                         |
| `test/keys.test.ts` (new)                                                   | blocks F1, F2, F5, F19, F20                                                                                                                                                                                                                                                                                                                                       |
| `test/menu.test.ts`                                                         | fixtures use `Control+Shift+4` and `options`; blocks F3, F4                                                                                                                                                                                                                                                                                                       |
| `test/smoke.ts`                                                             | editor checks F7, F9–F14; viewer checks F15–F18                                                                                                                                                                                                                                                                                                                   |
| `README.md`, `docs/ux/setup.md`                                             | the lines in spec/microcopy.md                                                                                                                                                                                                                                                                                                                                    |
| `docs/ux/sitemap.md`                                                        | global keys: ⌃⇧4, ⌃⇧3, ⌃⇧5, ⌃⇧N; ⌃⇧5 as a way into the capture options (spec/ia.md)                                                                                                                                                                                                                                                                               |
| `docs/ux/interaction-guidelines.md`                                         | Keyboard and focus: option (c) chosen; Esc exception                                                                                                                                                                                                                                                                                                              |
| `docs/designs/2026-10-25-adr-keys-follow-macos.md`, `docs/designs/INDEX.md` | `status: accepted`                                                                                                                                                                                                                                                                                                                                                |

Words for every string are in [spec/microcopy.md](spec/microcopy.md); copy them exactly.

## Order of work

- [x] 1. Write the unit blocks first: `test/keys.test.ts` and F3, F4 in `test/menu.test.ts`. Add the file to `npm test` — proof: `npm test` fails on them.
- [x] 2. `src/keys.ts`, `src/menu.ts`, `src/main.ts` (registration, popup, busy check, shortcuts window) — proof: the unit blocks pass; `npm run typecheck` exits 0.
- [x] 3. `src/editor.ts` keys and multi-selection — proof: `npm run typecheck` exits 0; smoke checks F7, F9–F14 written.
- [x] 4. `src/viewer.ts`, `src/viewer.html` — proof: smoke checks F15–F18 written; `npm run build` exits 0.
- [x] 5. README, setup.md, sitemap.md, interaction guidelines — proof: F20 passes.
- [x] 6. ADR to `accepted`, `python3 scripts/design_index.py write` — proof: `python3 scripts/design_index.py check` exits 0.
- [x] 7. `python3 scripts/verify_gate.py feature 2026-10-25-mac-shortcuts` — proof: ends `VERIFY PASS`.
- [x] 8. Close each subagent once its report is in — proof: `ListAgents` lists none before the report to the owner.

## Risks

| Risk                                                                                                                | What we do                                                                        | Where it lands     |
| ------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ------------------ |
| **Data safety:** marks stored while a multi-selection is active land at the wrong places in Discarded or Edit Again | every path that stores (`save`, close, Discard, Quit) drops the selection first   | step 3; F14        |
| Undo after a multi-selection move puts marks back wrong (validation, severity 3)                                    | moves recorded as a delta per mark; ⌘Z drops the selection first                  | step 3; F13        |
| ⌘⌫ removes a screenshot with one chord (validation, severity 2)                                                     | ⌘Z puts it back (owner, Q2); Discarded keeps it 7 days; auto-repeat refused       | step 4; F16, F17   |
| ↩ repeats a pointer click on a focused button (validation, severity 2)                                              | session window buttons blur after a pointer click                                 | step 4; F15        |
| A capture key starts a second capture over a running one (validation, severity 2)                                   | one `busy()` check for every capture key and the popup                            | step 2; F6         |
| ⌃⇧5 over a full-screen app may show nothing at the icon (Q4)                                                        | pop at the icon; the owner checks after install; pointer placement is a follow-up | facts Out of scope |
| The owner presses ⌃⇧1 from habit and nothing happens                                                                | accepted: the owner chose no notice (Q1); the menu shows ⌃⇧4                      | accepted           |
| ⌘A then ⌫ on a tall screenshot removes marks out of view (validation, severity 2)                                   | accepted: one ⌘Z brings all back                                                  | accepted           |
| Electron, Fabric and macOS behaviour claimed from code only (validation, Did Not Run)                               | smoke checks in CI prove F7, F9–F18; the milestone runs `smoke:background` once   | steps 3, 4         |
| Smoke is never run locally (owner's rule), so F7, F9–F18 fail only in CI                                            | CI runs smoke on every PR; auto-merge waits for it                                | steps 3, 4         |

## Out of scope

As in [facts.md](facts.md), Out of scope.

## Done

What must hold, as data in [done.json](done.json). The goal below ends on the verify sentinel, so every line here is proven by a check, not by a claim.

- `python3 scripts/verify_gate.py feature 2026-10-25-mac-shortcuts` ends `VERIFY PASS` for the feature PR.
- `python3 scripts/verify_gate.py milestone 2026-10-25-mac-shortcuts` ends `VERIFY PASS` once, on the milestone.
- `src/keys.ts` contains `Control+Shift+4` and `Control+Shift+5`; `src/` contains no `Control+Shift+1`.
- F1 to F20 and N1 pass by their named check in facts.md.
- Nothing outside `## Files that change` is edited.
- Stop and report as soon as a step cannot proceed. Never work around a blocker.
- Stop after 40 turns if not met. Report what is missing.

## Goal handover

Filled from `templates/goal/feature.txt`, turns from `sdlc.json` `goal.featureTurns` (40).

```
/goal Deliver feature 1 of change 2026-10-25-mac-shortcuts per changes/2026-10-25-mac-shortcuts/plan.md (Feature PRs) and facts.md. Run `python3 scripts/verify_gate.py feature 2026-10-25-mac-shortcuts` after each task group and at the end; paste its full output. Met only when its last line is `VERIFY PASS feature 2026-10-25-mac-shortcuts <sha>` and <sha> equals `git rev-parse HEAD` printed right after. Also met, as a stop-and-ask, when it ends `VERIFY BLOCKED`: read changes/2026-10-25-mac-shortcuts/verify/report.md to the engineer. Never edit protected paths (facts.md, done.json, lock.json, baselines, allowlists, sdlc.json checks). Run E2E in this worktree's own slot, in the foreground; never wait on background work. After opening the PR, run `omr-ux:review` on it (unless sdlc.json ux is off) and fix its Critical and High findings before arming auto-merge. Tick plan tasks as they land; log departures under ## Revisions. Stop after 40 turns and report.
```

## Revisions

Only after approval. One line per change: `YYYY-MM-DD — what changed, and why`.

- 2026-10-25 — Step 8 added: subagents are closed when their report is in, never left open (owner).
- 2026-10-25 — spec/validation.md set to approved; the plan gate covered it, but its status was missed at approval.
- 2026-10-25 — decisions.json records the prototype skip the guardrail asks for: no risky UI, as spec/validation.md says.
- 2026-10-25 — Keys window rows under "Anywhere" drop the "anywhere;" prefix, as rows 17–21 drop theirs.
- 2026-10-25 — README adds one line saying the digits are macOS's own, so the new keys explain themselves.
- 2026-10-25 — UX review of #76: no Critical. Fixed five High: palette arrows nudged the mark, two missing `lang`, a live region for ⌘⌫ and ⌘Z, icons hidden from VoiceOver.
- 2026-10-25 — UX review leftovers go to beads snap-bmr.17.2: ⌘Z order and stale key docs.
- 2026-10-25 — The sixth High, single-key tools that cannot be turned off, ships as feature PR 2: Settings ▸ Single-Key Tools. The goal asks every High fixed.
- 2026-10-25 — `.gitignore` ignores `__pycache__/`: the gate's own scripts leave it, and the gate refuses uncommitted files.
