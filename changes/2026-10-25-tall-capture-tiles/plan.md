---
linear: none
type: plan
change: 2026-10-25-tall-capture-tiles
design: docs/designs/2026-10-25-adr-tall-screenshots-saved-as-parts.md
author: Claude (orchestrator)
status: draft
reviewed_by: null
approved_at: null
created: 2026-10-25
---

# Plan: tall captures as tiles

> A tall screenshot is saved as one image plus parts at up to 1280 px wide; `session.md` links the parts, everything else shows the one image.

A person with no context builds from this file alone. [intent](intent.md) and
[facts](facts.md) are for the gate, not for the build. The UX plan is in [spec/](spec/): [ia](spec/ia.md) holds the rule and the numbers, [interaction](spec/interaction.md) every flow, [screens](spec/screens.md) and [microcopy](spec/microcopy.md) every word, [validation](spec/validation.md) the review.

## Approach

- **What changes:** on save, a tall screenshot becomes one image at the part width plus overlapping parts, and its entry links the parts.
- **What stays the same:** every screenshot that is not tall, byte for byte; numbering, the count, the session window, and every key and menu item.
- **Why this way:** each part is within Claude's limits, so the agent reads the page at about its captured width. The owner still handles one screenshot.
- **Rejected:** 1568 px wide parts — slightly sharper, for about 60 % more parts and tokens (17 instead of 11 at 2560 × 16 000).
- **Rejected:** shrinking the whole image, as today — an 8000 px page arrives about 250 px wide.
- **Rejected:** a grid of tiles — a page scrolls one way, and columns cut lines of text in half.
- **Rejected:** parts only, without the one image — the session window, the PDF, Save As… and Discarded need the whole page.
- **Rejected:** cutting every image taller than 1568 px — normal tall windows read fine whole; the two-thirds rule leaves them alone.
- **Rejected:** parts in the PDF — a person would see every overlap strip twice.
- **Rejected:** a setting for part width — nobody asked for it.

The decision is recorded in [docs/designs/2026-10-25-adr-tall-screenshots-saved-as-parts.md](../../docs/designs/2026-10-25-adr-tall-screenshots-saved-as-parts.md).

## Design changes

- New ADR `docs/designs/2026-10-25-adr-tall-screenshots-saved-as-parts.md`, `status: proposed`. On plan approval: `status: accepted`, then `python3 scripts/design_index.py write`.
- `docs/ux/sitemap.md`, FINDER line: a tall screenshot adds `img/NNN/` beside `img/NNN.png` ([spec/sitemap.md](spec/sitemap.md)). No route changes.

## Where things go

| New file or kind                    | Folder                                          |
| ----------------------------------- | ----------------------------------------------- |
| part layout, a pure function        | `src/parts.ts` (no Electron, like `stitch.ts`)  |
| unit assertions (named fact blocks) | `test/parts.test.ts`, existing `test/*.test.ts` |
| smoke checks                        | `test/smoke.ts`, the `viewer` checks            |
| decision record                     | `docs/designs/`                                 |

## Feature PRs

In order. Each is one PR into `milestone/fixes`. Feature 2 is cut after feature 1 merges, because both edit `src/sessions.ts`, `src/main.ts` and `test/smoke.ts`.

| #   | Feature                                                                          | Facts               | Branch                                | State |
| --- | -------------------------------------------------------------------------------- | ------------------- | ------------------------------------- | ----- |
| 1   | Tall screenshots are saved as parts, on Add to Session and on Edit Again         | F1–F17, F24, N1, N2 | `tall-capture-tiles/1-parts-on-save`  | todo  |
| 2   | Remove, Reopen, the PDF, the ZIP and the Document tab treat it as one screenshot | F18–F23, F25        | `tall-capture-tiles/2-one-screenshot` | todo  |

## Files that change

| File                                                                                      | PR  | Change                                                                                                                                                                                                                                                                          |
| ----------------------------------------------------------------------------------------- | --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/parts.ts` (new)                                                                      | 1   | `MAX_EDGE`, `MAX_PIXELS` (moved from `src/main.ts`), `PART_WIDTH = 1280`; `partLayout(width, height)` returns `{ width, parts: { y, height }[] }` for a tall image (already scaled to the part width), else `null`; throws above 99 parts                                       |
| `test/parts.test.ts` (new)                                                                | 1   | fact blocks F2, F3, F4, F5, F10, N2, from the spec/ia.md tables                                                                                                                                                                                                                 |
| `package.json`                                                                            | 1   | `test` script runs `node dist/test/parts.test.js` after `stitch.test.js`; no dependency change                                                                                                                                                                                  |
| `src/main.ts`                                                                             | 1   | `fitForAI()`: a tall image is scaled to the part width only, otherwise unchanged; new exported `cutParts(png)`: `nativeImage.crop()` per layout row, `[]` when not tall; `editor:save` passes `cutParts(out)` to `addShot` and `replaceShot`; `outImage` unchanged              |
| `src/sessions.ts`                                                                         | 1   | `entry()` takes the part count: 0 writes today's entry, n ≥ 2 the parts line and n part links; `addShot(…, parts?)` writes `img/NNN/` first and removes it on failure; `replaceShot(…, parts?)` writes `img/NNN.new/`, then the one image and the entry, then swaps the folders |
| `test/sessions.test.ts`                                                                   | 1   | fact blocks F1, F6, F7, F8, F11, F12, F13, F15, F16, F17                                                                                                                                                                                                                        |
| `test/smoke.ts`                                                                           | 1   | checks F10, F14 and N1 in their own session `smoke-tall`, then `setActive` back, so the `smoke` session's counts are unchanged                                                                                                                                                  |
| `docs/ux/sitemap.md`                                                                      | 1   | FINDER line adds `img/NNN/` (parts of a tall screenshot)                                                                                                                                                                                                                        |
| `docs/designs/2026-10-25-adr-tall-screenshots-saved-as-parts.md`, `docs/designs/INDEX.md` | 1   | `status: accepted` once approved                                                                                                                                                                                                                                                |
| `src/sessions.ts`                                                                         | 2   | `removeShot()` moves `img/NNN/` to the Discarded folder as `parts/`; `restoreShot()` counts a leftover `img/<old>/` as taken, moves `parts/` back, and renumbers part paths and alt texts                                                                                       |
| `src/main.ts`                                                                             | 2   | `reopenDiscarded()`: a pick named `parts` resolves to its parent folder                                                                                                                                                                                                         |
| `src/exporter.ts`                                                                         | 2   | `sessionHtml()`, before `marked`: per number, the first part link becomes the one-image link, the other part links go, and the parts-line paragraph goes; keyed on the links, so hand-edited entries print right                                                                |
| `src/preload.ts`, `src/shared.d.ts`, `src/viewer.ts`                                      | 2   | `clearImageCache()` (`webFrame.clearCache()`), called in the viewer's `load()` before the Document tab mounts a changed `session.md`; never a query string in `session.md`                                                                                                      |
| `test/sessions.test.ts`                                                                   | 2   | fact blocks F18, F19                                                                                                                                                                                                                                                            |
| `test/exporter.test.ts`                                                                   | 2   | fact blocks F22, F23                                                                                                                                                                                                                                                            |
| `test/smoke.ts`                                                                           | 2   | check F25 in the `smoke-tall` session's window                                                                                                                                                                                                                                  |

Words for every string are in [spec/microcopy.md](spec/microcopy.md); copy them exactly.

## Order of work

Feature 1 (`tall-capture-tiles/1-parts-on-save`):

- [ ] 1. Write `test/parts.test.ts` (F2, F3, F4, F5, F10, N2) and add it to the `test` script — proof: `npm test` fails on them.
- [ ] 2. Write `src/parts.ts` — proof: the `test/parts.test.ts` blocks pass.
- [ ] 3. Write the F1, F6, F7, F8, F11, F12, F13, F15, F16, F17 blocks in `test/sessions.test.ts` — proof: `npm test` fails on them.
- [ ] 4. `src/sessions.ts`: `entry`, `addShot`, `replaceShot` — proof: those blocks pass.
- [ ] 5. `src/main.ts`: `fitForAI`, `cutParts`, `editor:save` — proof: `npm run typecheck` exits 0; `grep -n "cutParts(out)" src/main.ts` prints the save line (F9); `outImage` still calls `fitForAI` (F24).
- [ ] 6. Smoke checks F10, F14, N1 in `test/smoke.ts` — proof: `npm run build` exits 0. CI's smoke run passes them on the PR; never run locally.
- [ ] 7. FINDER line in `docs/ux/sitemap.md` — proof: `grep -n "img/NNN/" docs/ux/sitemap.md` prints it.
- [ ] 8. ADR to `accepted`, `python3 scripts/design_index.py write` — proof: `python3 scripts/design_index.py check` exits 0.
- [ ] 9. `python3 scripts/verify_gate.py feature 2026-10-25-tall-capture-tiles` — proof: ends `VERIFY PASS`.

Feature 2 (`tall-capture-tiles/2-one-screenshot`, cut after feature 1 merges):

- [ ] 10. Write the F18, F19 blocks in `test/sessions.test.ts` and F22, F23 in `test/exporter.test.ts` — proof: `npm test` fails on F18, F19 and F22.
- [ ] 11. `src/sessions.ts`: `removeShot`, `restoreShot` — proof: F18, F19 pass.
- [ ] 12. `src/exporter.ts`: `sessionHtml` — proof: F22, F23 pass.
- [ ] 13. `src/main.ts`: `reopenDiscarded` — proof: `grep -n "'parts'" src/main.ts` prints the parent fallback (F20).
- [ ] 14. `src/preload.ts`, `src/shared.d.ts`, `src/viewer.ts`: `clearImageCache` — proof: `npm run typecheck` exits 0; `grep -n clearImageCache src/viewer.ts` prints the call in `load()` (F21).
- [ ] 15. Smoke check F25 — proof: `npm run build` exits 0; CI's smoke run passes it.
- [ ] 16. `python3 scripts/verify_gate.py feature 2026-10-25-tall-capture-tiles` — proof: ends `VERIFY PASS`.
- [ ] 17. Close each subagent once its report is in — proof: `ListAgents` lists none before the report to the owner.

## Risks

| Risk                                                                                                                                            | What we do                                                                                                                                                          | Where it lands        |
| ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| **Data safety:** Edit Again deletes the old parts before the new ones are written, so a failed write links to missing parts (validation, sev 2) | fixed in the spec: new parts go to `img/NNN.new/`, then the one image and the entry, then the swap; a failure removes `img/NNN.new/` and changes nothing else       | step 4; F15, F16      |
| **Data safety:** a failed Add to Session leaves half-written parts in `img/`                                                                    | parts are written before `session.md`; a failure removes `img/NNN/`, and the editor stays open as today                                                             | step 4; F16           |
| Scaling and cutting a 2560 × 20 000 page runs in the main process and may take over a second, freezing the menu (validation, sev 2)             | the smoke bench measures it on every PR (N1). If it fails, stop and ask: progress on Add to Session (the guideline) or a new number. Never loosen N1 alone          | step 6; N1            |
| The Document tab shows cached old parts after Edit Again: parts keep their file names, and only the grid uses `?v=` (validation, sev 2)         | clear the renderer's image cache in the viewer's `load()` before it mounts a changed `session.md`; nothing is added to `session.md`                                 | step 14; F21          |
| Claude's per-request image count: a session with four 20 000 px screenshots holds 104 parts                                                     | accepted for this change. The Claude API allowed up to 100 images per request and claude.ai fewer; not re-verified. A beads follow-up if an agent refuses a session | accepted; follow-up   |
| Token cost: about 15,800 tokens for an 8000 px page, up to about 39,600 at 20 000 px, against 1,530 today (guideline note F207)                 | the owner confirms at the plan gate (spec/validation.md Decisions Needed); the ADR records it                                                                       | gate                  |
| The success measure cannot be read in plain Node, and the smoke test's tall flow never saved (validation, sev 1)                                | a smoke step saves a 1280 × 8000 capture and checks every linked image is at least 1000 px wide; the unit test checks the layout                                    | step 6; F10           |
| Entries saved before this change: Edit Again turns an old tall entry into parts (validation, sev 1)                                             | fixed in the spec; a unit test                                                                                                                                      | step 4; F17           |
| A leftover `img/NNN/` did not count as taken, so Reopen could fail midway (validation, sev 1)                                                   | fixed in the spec: `restoreShot` counts it as taken                                                                                                                 | step 11; F19          |
| The Reopen Discarded… panel refused a pick of the `parts` folder (validation, sev 1)                                                            | fixed in the spec: the parent folder counts as the pick                                                                                                             | step 13; F20          |
| The PDF swap was undefined for entries edited in the Document tab (validation, sev 2)                                                           | fixed in the spec: the swap keys on the part links; a unit test with an edited entry                                                                                | step 12; F22          |
| In the Document tab each part has its own border, with the paragraph gap, so 11 parts read as 11 images (validation L12.1, L13.2, sev 1)        | accepted as specified. A CSS-only tighter gap between part images in `src/viewer.html` is the allowed fix if the owner asks                                         | accepted              |
| A failed save still shows no message (F049, validation L23.2, sev 1)                                                                            | out of scope: an existing gap, kept as today; a beads follow-up                                                                                                     | facts.md Out of scope |
| The Markdown editor may rewrite part paragraphs when the owner types elsewhere                                                                  | a smoke check types in the Document tab and reads `session.md` back                                                                                                 | step 15; F25          |
| Chromium printing a 1280 × 8000 image across A4 pages was not observed (validation, Did Not Run)                                                | accepted: a tall image prints across pages today; the milestone's PDF state check looks at it                                                                       | milestone             |
| Smoke is never run locally (owner's rule), so F10, F14, F25 and N1 fail only in CI                                                              | CI runs smoke on every PR; auto-merge waits for it; the milestone runs `smoke:background`                                                                           | steps 6, 15           |
| CI's Linux runner is slower than a Mac, so N1 may fail there while a Mac passes                                                                 | the bench prints its milliseconds; a failure stops and asks, as above                                                                                               | step 6                |
| Between the two PRs, removing a tall screenshot on `milestone/fixes` leaves `img/NNN/` behind                                                   | accepted: the milestone branch is never released between them; feature 2 follows feature 1                                                                          | feature 2             |
| The same pixels ship twice, on disk and in the ZIP (validation, sev 0)                                                                          | accepted                                                                                                                                                            | accepted              |
| At approval, `tests/sdlc.test.ts` reads the example image links in `spec/*.md` as missing files and fails `npm test`                            | before `verify_gate.py approve`, write those examples so they are not Markdown image links; the words stay                                                          | gate                  |

## Out of scope

- Every item in facts.md `## Out of scope`.
- The glossary row and interaction guideline for "part" ([spec/conformance.md](spec/conformance.md) Missing guidelines).

## Done

What must hold, as data in [done.json](done.json). The goal below ends on the verify sentinel, so every line here is proven by a check, not by a claim.

- `python3 scripts/verify_gate.py feature 2026-10-25-tall-capture-tiles` ends `VERIFY PASS` for every feature PR.
- `python3 scripts/verify_gate.py milestone 2026-10-25-tall-capture-tiles` ends `VERIFY PASS` once, on milestone `fixes`.
- `src/parts.ts` contains `PART_WIDTH = 1280`.
- F1 to F25, N1 and N2 pass by their named check in facts.md.
- Nothing outside `## Files that change` is edited.
- Stop and report as soon as a step cannot proceed. Never work around a blocker.
- Stop after 40 turns per feature if not met. Report what is missing.

## Goal handover

Filled from `templates/goal/feature.txt`, turns from `sdlc.json` `goal.featureTurns` (40). The owner's test rule replaces the template's E2E sentence: smoke runs in CI only.

Feature 1:

```
/goal Deliver feature 1 of change 2026-10-25-tall-capture-tiles per changes/2026-10-25-tall-capture-tiles/plan.md (Feature PRs) and facts.md. Run `python3 scripts/verify_gate.py feature 2026-10-25-tall-capture-tiles` after each task group and at the end; paste its full output. Met only when its last line is `VERIFY PASS feature 2026-10-25-tall-capture-tiles <sha>` and <sha> equals `git rev-parse HEAD` printed right after. Also met, as a stop-and-ask, when it ends `VERIFY BLOCKED`: read changes/2026-10-25-tall-capture-tiles/verify/report.md to the engineer. Never edit protected paths (facts.md, done.json, lock.json, baselines, allowlists, sdlc.json checks). Do not run E2E or smoke locally per feature: CI runs smoke on the PR; never launch Electron, never wait on background work. After opening the PR, run `omr-ux:review` on it (unless sdlc.json ux is off) and fix its Critical and High findings before arming auto-merge; never defer one without asking the engineer. Tick plan tasks as they land; log departures under ## Revisions. Stop after 40 turns and report.
```

Feature 2:

```
/goal Deliver feature 2 of change 2026-10-25-tall-capture-tiles per changes/2026-10-25-tall-capture-tiles/plan.md (Feature PRs) and facts.md. Run `python3 scripts/verify_gate.py feature 2026-10-25-tall-capture-tiles` after each task group and at the end; paste its full output. Met only when its last line is `VERIFY PASS feature 2026-10-25-tall-capture-tiles <sha>` and <sha> equals `git rev-parse HEAD` printed right after. Also met, as a stop-and-ask, when it ends `VERIFY BLOCKED`: read changes/2026-10-25-tall-capture-tiles/verify/report.md to the engineer. Never edit protected paths (facts.md, done.json, lock.json, baselines, allowlists, sdlc.json checks). Do not run E2E or smoke locally per feature: CI runs smoke on the PR; never launch Electron, never wait on background work. After opening the PR, run `omr-ux:review` on it (unless sdlc.json ux is off) and fix its Critical and High findings before arming auto-merge; never defer one without asking the engineer. Tick plan tasks as they land; log departures under ## Revisions. Stop after 40 turns and report.
```

## Revisions

Only after approval. One line per change: `YYYY-MM-DD — what changed, and why`.
