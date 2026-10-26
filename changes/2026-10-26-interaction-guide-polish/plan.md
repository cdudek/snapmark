---
linear: none
type: plan
change: 2026-10-26-interaction-guide-polish
design: docs/designs/2026-10-25-adr-capture-bar-and-settings-window.md
author: Claude (orchestrator)
status: approved
reviewed_by: Calvin Dudek
approved_at: 2026-10-26
created: 2026-10-26
---

# Plan: interaction guide, capture bar label and keys, General comment

> One milestone in one go: the guide first, then the capture bar's label and keys, then the notes column. Checked, validated and released once.

A person with no context builds from this file alone. [intent](intent.md), [facts](facts.md), [spec/screens.md](spec/screens.md) and the draft guide `docs/ux/interaction-guidelines.md` are for the gate.

## At this gate: accepting the guide

The draft guide in `docs/ux/interaction-guidelines.md` is part of this gate. **Every rule you do not annotate is accepted.** Annotate a rule to change or reject it. After approval, `decisions.json` `guideAccepted` lists the accepted rule ids, and feature 1.1 sets their status to `accepted` (F3).

## How this is delivered (one go)

- One `/goal` (below) builds the milestone. The owner pastes it once.
- Features are commits. **No check, lint or test runs per feature or per commit.** The proof of each step is checked once, at the milestone's end.
- At the end, once: `verify_gate.py milestone`, the UX and code reviews, and validation of every fact and ask in `validation.md`. The gate runs format, lint, typecheck, unit tests and `smoke:background`. Then one fix round, one PR to `main`, auto-merge, one release, installed on the owner's Mac.
- Questions never block: `questions.md` holds each with the default taken.

## Milestones

| #   | Branch                                 | What a user can do after it                                                                                                                           | Features, in order                                                                     | Facts      |
| --- | -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ---------- |
| 1   | `milestone/interaction-guide-polish-1` | Read one accepted guide for how Snapmark behaves; name every capture bar icon and its key; pick a mode with 1–4; see which box is the general comment | 1.1 interaction guide · 1.2 capture bar label and keys · 1.3 General comment and notes | F1–F15, N1 |

## Approach

- **Guide (A5):** the draft is written before the gate, so the owner accepts it here, not in a later round. It replaces the 1,475-line v0.9.0 proposal, which moves to `docs/ux/audits/` unchanged.
- **Label (A1, A2):** a second, small panel window owned by the bar. It is transparent and frameless, ignores the pointer, and is content-protected. It floats at the bar's level on every Space. The bar's page sends `bar:tip` with the text, the key and the button's rectangle. The main process places it 8 pt above the bar, centred on the button, inside the work area. It closes with the bar.
  - Rejected: native `title` tooltips. macOS shows them only in the active app, and the bar never activates Snapmark (spec "As built"); that is why the owner saw none.
  - Rejected: drawing the label inside the bar window. The bar's window paints the popover material over its whole rectangle, so a taller window would show a grey strip above the bar.
- **Keys (A2):** the bar page's keydown handler maps `1`–`4` to `choose()`, which already moves focus. The label shows because focus moved by a key.
- **Notes (A3, A4):** a heading `#caption-label` "General comment" goes before `#caption`, styled like `#refs-label`. One-shot mode hides it with the box. The placeholder and accessible name change. `#refs` becomes a flex column with a 12 px gap.

## Design changes

- `docs/designs/2026-10-25-adr-capture-bar-and-settings-window.md`: add the label window and keys 1–4 to its Decision section, in place, then `python3 scripts/design_index.py write`.

## Where things go

| New file             | Folder  | Why there                                                            |
| -------------------- | ------- | -------------------------------------------------------------------- |
| `src/tip.html`       | `src/`  | every window's page lives in `src/` and is copied by `npm run build` |
| `src/tip.ts`         | `src/`  | the page's classic script, like `src/bar.ts`                         |
| `test/guide.test.ts` | `test/` | unit tests are plain-Node files in `test/`                           |

## Files that change

- `docs/ux/interaction-guidelines.md` (new guide) and `docs/ux/audits/2026-09-28/interaction-guidelines-proposal.md` (moved proposal). No doc links to an anchor in the old file, so no other doc changes.
- `src/md-notes.ts` (a `label` option that names the editable element).
- `src/bar.html`, `src/bar.ts`, `src/main.ts` (label window, IPC, close with the bar), `src/preload.ts` and `src/shared.d.ts` (the `barTip` call), `src/tip.html`, `src/tip.ts`, `package.json` (`build` copies `tip.html`).
- `src/keys.ts` (Capture bar group row `1–4`).
- `src/editor.html`, `src/editor.ts` (heading, placeholder, accessible name, gap).
- `test/smoke.ts` for F5–F10 and F12–F14. A4 replaces the words "Add a comment…", so the old check `comment is one line` reads the new placeholder.
- `test/keys.test.ts` (F11), `test/guide.test.ts` (F1–F3).
- `docs/designs/2026-10-25-adr-capture-bar-and-settings-window.md`, `docs/designs/INDEX.md`.
- `changes/2026-10-26-interaction-guide-polish/*`.

## Order of work

- [x] 1.1 Interaction guide: set accepted rules from `decisions.json` `guideAccepted` to `accepted`; write `test/guide.test.ts` (F1–F3); commit. Proof at the end: unit tests pass.
- [x] 1.2 Capture bar label and keys: smoke checks F5–F10 first. Then `tip.html`/`tip.ts`, the window and `bar:tip` in `main.ts`, keys 1–4 and `aria-keyshortcuts` in `bar.*`. Then the `1–4` row in `keys.ts` with F11's unit test, and the ADR's Decision section; commit. Proof at the end: smoke F5–F10 and unit F11.
- [x] 1.3 General comment and notes: smoke checks F12–F14 first. Then `editor.html`/`editor.ts`, `h2` headings, and the `label` option in `md-notes.ts`. Update the old placeholder check; commit. Proof at the end: smoke F12–F14, unit N1.

### At the milestone's end

- [ ] a. `python3 scripts/verify_gate.py milestone 2026-10-26-interaction-guide-polish` — proof: ends `VERIFY PASS milestone 2026-10-26-interaction-guide-polish <sha>`, `<sha>` = `git rev-parse HEAD`. It runs `smoke:background`, the milestone's one local E2E run.
- [x] b. In parallel: `omr-ux:review` on the bar and the notes column (headless shots only), `omr-dev:pr-review`, `omr-dev:accessibility-audit`. Proof: one `findings.md` section.
- [ ] c. Validation: one row per fact and per ask in `validation.md` (expected, observed, evidence, verdict). Proof: no `not met` row after the fix round.
- [x] d. One fix round on the blocking findings; rerun a.
- [ ] e. PR `milestone/interaction-guide-polish-1` → `main`, title `feat(capture): the capture bar names its icons and keys, and the editor heads its General comment`, `findings.md` and `validation.md` linked. Then `gh pr merge --squash --auto`. Ask the owner first if a Critical or High is deferred.
- [ ] f. When it merges and the release is out, install it from the release ZIP, signature and Gatekeeper checked. Say the version, close snap-bmr.17.4, and mark the rows `merged` in `milestone.md`.

## Risks

| Risk                                                                          | What we do                                                                                                                                                                 |
| ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A second panel over a full-screen app slides to another Space or steals focus | the same window options as the bar (`type: 'panel'`, `showInactive()`, never `focus()`); owner checks on install                                                           |
| The label shows in a capture                                                  | content protection, and it closes with the bar, which closes before every capture (F8, F7)                                                                                 |
| Hover events never reach a panel that is not key                              | the bar is focused when it opens (`win.focus()`), so it is key; F5 proves the hover path in smoke                                                                          |
| The guide grows long again                                                    | F1 caps it at 400 lines                                                                                                                                                    |
| Spec check (`spec/validation.md`, one pass): 4 High, 9 Medium, 9 Low          | the 4 High are fixed in the spec now: `h2` headings, named note fields, the name on the editable, a hoverable label. Medium and Low go to the milestone's UX review        |
| No brief, IA, interaction or conformance file                                 | no new screen or route, so no brief or IA; the interaction is in `spec/screens.md`; conformance is against the guide this gate accepts, at the milestone's `omr-ux:review` |

## Out of scope

- Every item under facts.md `## Out of scope`.

## Done

What must hold, as data in [done.json](done.json).

- `python3 scripts/verify_gate.py milestone 2026-10-26-interaction-guide-polish` ends `VERIFY PASS`.
- `validation.md` has a `met` row for every fact F1–F15, N1 and every ask A1–A5.
- `findings.md` has no open blocking item.
- The PR to `main` is merged or open with auto-merge armed; once released, the owner's Mac runs it.
- Nothing outside `## Files that change` is edited.

## Goal handover

The kit's `templates/goal/run.txt` (fixed 2026-10-26: met once the PR is merged or armed), with this repo's rules added.

```
/goal Deliver change 2026-10-26-interaction-guide-polish in one go per changes/2026-10-26-interaction-guide-polish/plan.md and facts.md: every milestone in ## Milestones, in order, each on its own branch milestone/interaction-guide-polish-<n> cut from the previous one (the first from origin/main), so building never waits for a merge. Per feature: write the tests for its facts, build in the plan's folders, commit; run no checks, no lint and no tests between features, and start the next feature at once. An open question never stops the build: write it to changes/2026-10-26-interaction-guide-polish/questions.md with the default you took, tell the engineer in one line, and carry on; an answer that arrives becomes an ask of the next milestone. Per milestone, once its features are committed: run `python3 scripts/verify_gate.py milestone 2026-10-26-interaction-guide-polish` and the Stage 6 checks once on the milestone diff, then validate every fact and ask of that milestone against the built app into changes/2026-10-26-interaction-guide-polish/validation.md (expected, observed, evidence, verdict), one findings.md section, one fix round, rerun the gate and paste its full output, open the PR milestone/interaction-guide-polish-<n> -> main and arm auto-merge (ask first when a Critical or High is deferred); a later milestone opens its PR once the previous one has merged, after `git rebase --onto origin/main milestone/interaction-guide-polish-<n-1>`, and keeps building meanwhile. Met only when every milestone's PR is merged or open with auto-merge armed, the last gate line is `VERIFY PASS milestone 2026-10-26-interaction-guide-polish <sha>` with <sha> equal to `git rev-parse HEAD`, validation.md has no `not met` row and findings.md no open blocking item. Also met, as a stop-and-ask, on `VERIFY BLOCKED`: summarize changes/2026-10-26-interaction-guide-polish/verify/report.md for the engineer. Never edit protected paths (facts.md, done.json, lock.json, baselines, allowlists, sdlc.json checks) or accept baselines. Tick plan tasks as they land; log departures under ## Revisions. Stop after 200 turns and report. Repo rules: never launch Electron windows or capture the owner's screen locally; smoke runs only inside the milestone gate (`smoke:background`) and in CI. No dependency changes. After the release, install it for the owner from the release ZIP (signature and Gatekeeper checked) and say which version is installed. Close each subagent once its report is in.
```

## Revisions

Only after approval. One line per change: `YYYY-MM-DD — what changed, and why`.

- 2026-10-26 — 1.2: the label stays while the pointer rests on it by polling the pointer from the main process (`leaveTip`), not by `setIgnoreMouseEvents(true, { forward: true })` as the spec named. Same outcome (F7), and the page needs no pointer events from a window that lets clicks through.
- 2026-10-26 — 1.2: the bar's buttons lost their `title` attributes. macOS never showed them, and the drawn label replaces them.
- 2026-10-26 — 1.2: `test/keys.test.ts` F236's Capture bar rows now start with the `1–4` row (F11). The old assertion listed the rows before this change.
- 2026-10-26 — 1.3: the smoke check `comment is one line` now reads the new placeholder, since A4 replaced the words "Add a comment…".
- 2026-10-26 — fix round (findings M3, M4): `← →` reads "Move between modes", so it no longer repeats "Pick a mode". The notes column's headings sit 4 px from their box, with 20 px before References.
- 2026-10-26 — F7's smoke check: "stays while the pointer rests on it" is checked on the rule `keepsTip` at fixed points, and the real path is checked wherever the pointer is. Moving the label under the real pointer failed on the owner's Mac, because macOS keeps windows off the menu bar.
