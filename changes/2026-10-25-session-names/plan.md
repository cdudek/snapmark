---
linear: none
type: plan
change: 2026-10-25-session-names
design: docs/designs/2026-09-26-adr-menu-rebuilt-from-the-2026-09.md
author: Calvin Dudek
status: draft
reviewed_by: null
approved_at: null
created: 2026-10-25
---

# Plan: Session names that read well and keep their date

> Screens name sessions "2026-10-24, 23:38", a rename keeps the date, and Switch Session lists 10 then "Older Sessions…".

A person with no context builds from this file alone. [intent](intent.md) and
[facts](facts.md) are for the gate, not for the build. The UX plan is in [spec/](spec/): [screens](spec/screens.md) and [microcopy](spec/microcopy.md) hold every word, [validation](spec/validation.md) the review.

## Approach

- **What changes:** one display rule, `sessions.shortName()`, names a session on every screen; `sessions.rename()` keeps the folder's date stamp; the Switch Session submenu shows 10 rows.
- **What stays the same:** folder names of existing sessions, `session.md`'s first line, file names, sorting by last use, and every action behind a menu item.
- **Why this way:** the folder name stays the one source, so nothing new is stored and Finder, the copied path and the AI prompt agree.
- **Rejected:** a sidecar file holding the name — Finder and the prompt would show only the stamp, and it can drift.
- **Rejected:** a folder's creation date for stamp-less folders — a sync to iCloud or Google Drive resets it.
- **Rejected:** a colon in folder names, so they match the screens — Finder shows it as "/".
- **Rejected:** bulk-renaming old folders to add a stamp — touches the owner's sessions unasked.

The decision is recorded in [docs/designs/2026-10-25-adr-session-folders-keep-their-date-stamp.md](../../docs/designs/2026-10-25-adr-session-folders-keep-their-date-stamp.md).

## Design changes

- New ADR `docs/designs/2026-10-25-adr-session-folders-keep-their-date-stamp.md`, `status: proposed`. On plan approval: `status: accepted` and its last row's answer filled, then `python3 scripts/design_index.py write`.
- The design named in `design:` (menu rebuilt, 2026-09-26) needs no edit: its Milestones line already names this change.

## Where things go

No new source file. Everything lands in files that exist.

| New file or kind                    | Folder                               |
| ----------------------------------- | ------------------------------------ |
| unit assertions (named fact blocks) | `test/` in the existing `*.test.ts`  |
| smoke checks                        | `test/smoke.ts`, the `viewer` checks |
| decision record                     | `docs/designs/`                      |

## Feature PRs

In order. Each is one PR into `milestone/session-names`. Feature 2 is cut after feature 1 merges, because both edit `src/main.ts`.

| #   | Feature                                                                 | Facts                        | Branch                           | State |
| --- | ----------------------------------------------------------------------- | ---------------------------- | -------------------------------- | ----- |
| 1   | Switch Session lists 10, the current one always, then "Older Sessions…" | F13, F14, F15, F16, F17, F18 | `session-names/1-older-sessions` | todo  |
| 2   | Readable dates everywhere, and a rename keeps the date                  | F1–F12, N1, N2               | `session-names/2-readable-dates` | todo  |

## Files that change

| File                                                                                            | PR  | Change                                                                                                                                                                                                                                                                                                                                     |
| ----------------------------------------------------------------------------------------------- | --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/menu.ts`                                                                                   | 1   | `MAX_LISTED` 10; the current session replaces the 10th row when it is not among them; "Older Sessions…" and its separator only above 10; Switch Session `enabled: false` with no session                                                                                                                                                   |
| `test/menu.test.ts`                                                                             | 1   | fact blocks F13–F17; fixture labels in the new form ("2026-09-25, 12:03")                                                                                                                                                                                                                                                                  |
| `src/main.ts`                                                                                   | 1   | `otherSession()`: panel `message: 'Session folders start with their date.'` (F18)                                                                                                                                                                                                                                                          |
| `docs/ux/sitemap.md`                                                                            | 1   | as-built Switch Session lines: 10 rows, "Older Sessions…" (spec/ia.md § Sitemap)                                                                                                                                                                                                                                                           |
| `src/sessions.ts`                                                                               | 2   | stamp regex `YYYY-MM-DD HH.MM( (n))?( name)?`; `shortName()` display rule; new `namePart()` and `renamedTo(from, to)`; `rename()` keeps the stamp, empty name gives the bare stamp; `saveAsName()` uses the folder name; `whenLabel()` dated branch year first                                                                             |
| `src/main.ts`                                                                                   | 2   | display name in `openViewer` and `openEditor` titles, `tellEditors`, editor init, every `notify(` that names a session; `viewer:rename` uses `namePart`, "Enter a name." only with no stamp, taken error names the taken session; `renameFromMenu` prompt and default answer, passed as argv; `viewerData` adds `label`, `name`, `stamped` |
| `src/shared.d.ts`                                                                               | 2   | `ViewerInit` gains `label`, `name`, `stamped`                                                                                                                                                                                                                                                                                              |
| `src/viewer.ts`                                                                                 | 2   | title and `document.title` from `label`; field starts with `name`; hint "The date stays · ↩ to save · Esc to cancel" when `stamped`                                                                                                                                                                                                        |
| `src/viewer.html`                                                                               | 2   | `#rename` placeholder "Name this session"                                                                                                                                                                                                                                                                                                  |
| `src/exporter.ts`                                                                               | 2   | `sessionHtml()` renders the first heading as the display name; `session.md` untouched                                                                                                                                                                                                                                                      |
| `test/sessions.test.ts`                                                                         | 2   | fact blocks F1, F6, F7, F10, F11, F12, N1, N2; old `shortName` and `saveAsName` expectations updated                                                                                                                                                                                                                                       |
| `test/exporter.test.ts`                                                                         | 2   | fact block F5                                                                                                                                                                                                                                                                                                                              |
| `test/smoke.ts`                                                                                 | 2   | checks F2, F3, F8, F9 on a session made as `2026-10-24 23.38`; the legacy `smoke` checks stay                                                                                                                                                                                                                                              |
| `docs/designs/2026-10-25-adr-session-folders-keep-their-date-stamp.md`, `docs/designs/INDEX.md` | 2   | `status: accepted` once approved                                                                                                                                                                                                                                                                                                           |

Words for every string are in [spec/microcopy.md](spec/microcopy.md); copy them exactly.

## Order of work

Feature 1 (`session-names/1-older-sessions`):

- [ ] 1. Write the F13–F17 blocks in `test/menu.test.ts` first — proof: `npm test` fails on them.
- [ ] 2. Change `menuTemplate()` in `src/menu.ts` — proof: F13–F17 pass in `npm test`.
- [ ] 3. Add the panel message in `otherSession()` — proof: `grep -n "Session folders start with their date" src/main.ts` prints one line (F18).
- [ ] 4. Update the two Switch Session lines in `docs/ux/sitemap.md` — proof: `grep -c "Other Session" docs/ux/sitemap.md` drops by two.
- [ ] 5. `python3 scripts/verify_gate.py feature 2026-10-25-session-names` — proof: ends `VERIFY PASS`.

Feature 2 (`session-names/2-readable-dates`, cut after feature 1 merges):

- [ ] 6. Write the F1, F6, F7, F10, F11, F12, N1, N2 blocks in `test/sessions.test.ts` and F5 in `test/exporter.test.ts` — proof: `npm test` fails on them.
- [ ] 7. `src/sessions.ts`: stamp regex, `shortName`, `namePart`, `renamedTo`, `rename`, `saveAsName`, `whenLabel` — proof: the unit blocks pass.
- [ ] 8. `src/exporter.ts` heading — proof: F5 passes.
- [ ] 9. `src/shared.d.ts`, `src/main.ts`, `src/viewer.ts`, `src/viewer.html` — proof: `npm run typecheck` exits 0; `grep -n "notify(" src/main.ts` shows every session name through `sessions.shortName` (F4).
- [ ] 10. Smoke checks F2, F3, F8, F9 in `test/smoke.ts` — proof: `npm run build` exits 0. CI's smoke run passes them on the PR; never run locally.
- [ ] 11. ADR to `accepted`, `python3 scripts/design_index.py write` — proof: `python3 scripts/design_index.py check` exits 0.
- [ ] 12. `python3 scripts/verify_gate.py feature 2026-10-25-session-names` — proof: ends `VERIFY PASS`.

## Risks

| Risk                                                                                                          | What we do                                                                                                                             | Where it lands                      |
| ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| **Data safety:** a rename moves one of the owner's real session folders                                       | same single `fs.renameSync` as today, only the target string changes; a taken target is refused before the move; no rename at start-up | step 7; F7, F11, N2                 |
| Data safety: a folder renamed back and forth loses its open windows, `used` entry or discarded items          | `renameSession()` already moves all three; unchanged                                                                                   | smoke rename checks (existing)      |
| A typed name that starts with a date replaces the stamp (validation, severity 3)                              | fixed in the spec: the stamp never changes; the typed text is the name                                                                 | F10                                 |
| Same-day sessions given one name read alike in the menu (validation L2.4)                                     | accepted: rare, the owner chose the names; their folders differ by time                                                                | accepted                            |
| Last use is per Mac; with a synced folder, a session made on the other Mac sorts as never used (validation)   | accepted: the intent says sessions sort as before; Older Sessions… reaches it                                                          | accepted                            |
| A refused rename from the menu loses the typed text (validation L23.2)                                        | accepted, as today; the session window's field keeps it                                                                                | accepted                            |
| A long name widens the native menu; "·" both splits date and name and name and count (validation, severity 1) | accepted, as today                                                                                                                     | accepted                            |
| The editor and session window put the name on opposite sides of their titles (validation, severity 1)         | out of scope: not asked                                                                                                                | facts.md Out of scope               |
| ":" and "/" in a typed name become "-" silently                                                               | accepted, as today; keeps colons out of folder names (N1)                                                                              | N1                                  |
| AppleScript prompt built from a session name could break the script                                           | pass prompt and default answer as `argv` items, never inside the script text                                                           | step 9                              |
| A case-only rename ("ledgerly" → "Ledgerly") is refused as taken on macOS's case-insensitive disk             | accepted, as today                                                                                                                     | accepted                            |
| Smoke is never run locally (owner's rule), so F2, F3, F8, F9 fail only in CI                                  | CI runs smoke on every PR; auto-merge waits for it; the milestone runs `smoke:background`                                              | step 10                             |
| The glossary and guideline proposals still say "28 Sep 14:32" and "twenty … Other Session…"                   | left as proposals; the next `omr-ux:guidelines` round takes the ADR                                                                    | accepted                            |
| The owner may want `session.md`'s first line readable too                                                     | asked at the gate; the recommendation keeps the folder name (intent constraint)                                                        | spec/validation.md Decisions Needed |

## Out of scope

- A5, the backlog request: done in Stage 1.
- `session.md`'s first line, PDF and ZIP file names, discarded folder names in Finder.
- Sorting changes, menu search, counts in Switch Session rows, a Snapmark-made picker for older sessions.

## Done

What must hold, as data in [done.json](done.json). The goal below ends on the verify sentinel, so every line here is proven by a check, not by a claim.

- `python3 scripts/verify_gate.py feature 2026-10-25-session-names` ends `VERIFY PASS` for every feature PR.
- `python3 scripts/verify_gate.py milestone 2026-10-25-session-names` ends `VERIFY PASS` once, on the milestone.
- `src/menu.ts` contains `MAX_LISTED = 10` and `'Older Sessions…'`.
- F1 to F18, N1 and N2 pass by their named check in facts.md.
- Nothing outside `## Files that change` is edited.
- Stop and report as soon as a step cannot proceed. Never work around a blocker.
- Stop after 40 turns per feature if not met. Report what is missing.

## Goal handover

Filled from `templates/goal/feature.txt`, turns from `sdlc.json` `goal.featureTurns` (40).

Feature 1:

```
/goal Deliver feature 1 of change 2026-10-25-session-names per changes/2026-10-25-session-names/plan.md (Feature PRs) and facts.md. Run `python3 scripts/verify_gate.py feature 2026-10-25-session-names` after each task group and at the end; paste its full output. Met only when its last line is `VERIFY PASS feature 2026-10-25-session-names <sha>` and <sha> equals `git rev-parse HEAD` printed right after. Also met, as a stop-and-ask, when it ends `VERIFY BLOCKED`: read changes/2026-10-25-session-names/verify/report.md to the engineer. Never edit protected paths (facts.md, done.json, lock.json, baselines, allowlists, sdlc.json checks). Run E2E in this worktree's own slot, in the foreground; never wait on background work. After opening the PR, run `omr-ux:review` on it (unless sdlc.json ux is off) and fix its Critical and High findings before arming auto-merge. Tick plan tasks as they land; log departures under ## Revisions. Stop after 40 turns and report.
```

Feature 2:

```
/goal Deliver feature 2 of change 2026-10-25-session-names per changes/2026-10-25-session-names/plan.md (Feature PRs) and facts.md. Run `python3 scripts/verify_gate.py feature 2026-10-25-session-names` after each task group and at the end; paste its full output. Met only when its last line is `VERIFY PASS feature 2026-10-25-session-names <sha>` and <sha> equals `git rev-parse HEAD` printed right after. Also met, as a stop-and-ask, when it ends `VERIFY BLOCKED`: read changes/2026-10-25-session-names/verify/report.md to the engineer. Never edit protected paths (facts.md, done.json, lock.json, baselines, allowlists, sdlc.json checks). Run E2E in this worktree's own slot, in the foreground; never wait on background work. After opening the PR, run `omr-ux:review` on it (unless sdlc.json ux is off) and fix its Critical and High findings before arming auto-merge. Tick plan tasks as they land; log departures under ## Revisions. Stop after 40 turns and report.
```

## Revisions

Only after approval. One line per change: `YYYY-MM-DD — what changed, and why`.
