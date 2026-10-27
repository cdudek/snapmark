---
linear: none
type: plan
change: 2026-10-27-no-screen-text
design: null
author: Claude (orchestrator)
status: approved
reviewed_by: Calvin Dudek
approved_at: 2026-10-27
created: 2026-10-27
---

# Plan: no recognised text under screenshots

> One milestone of one feature: entries stop carrying the text read off the image. Auto-redaction keeps using recognition.

[intent](intent.md) and [facts](facts.md) are for the gate. Paths are under `snapmark-app/`.

## How this is delivered (one go)

- One milestone, `milestone/no-screen-text-1`, cut from `origin/main`. One feature, one commit, the gate once, one PR with auto-merge.

## Milestones

### Milestone 1: drop the text block

- [x] 1.1 Stop writing recognised text; remove the block's code and its AI note line. F1–F5.

## Approach

- `main.ts`: the save no longer passes `text` to the entry. Recognition still runs for `redact.ts`.
- `sessions.ts`: `textBlock`, `TEXT_SUMMARY` and the entry's `text` field go. The reader that splits at `<details>` stays, so old entries still parse.
- `main.ts`: the AI note's line about "Text in the screenshot" goes.
- `exporter.ts`: its `details { display: none }` rule stays, so old entries still export without their text.
- `ocr.ts`: `ocrText` goes if nothing else uses it. `recognize` stays.

## Where things go

- Code: `src/main.ts`, `src/sessions.ts`, `src/ocr.ts`.
- Checks: `test/sessions.test.ts`, `test/exporter.test.ts`, `test/smoke.ts`.

## Files that change

- `src/main.ts`, `src/sessions.ts`, `src/ocr.ts`.
- `test/sessions.test.ts`, `test/exporter.test.ts`, `test/smoke.ts`, `test/ocr.test.ts` where they encode the block.
- `snapmark-app/README.md` and `docs/ux/setup.md` if they describe the block.

## Order of work

1. Feature 1.1, then the gate, then the PR.

## Risks

- **Edit Again reads old entries.** The reader keeps splitting at `<details>`, so an old block never leaks into the notes.
- **Calm-style milestone 2 touches `main.ts`.** The changes are far apart; whichever merges second rebases.

## Out of scope

- Rewriting entries already saved. Their blocks stay, and exports still hide them.

## Done

The criteria as data are in [done.json](done.json).

- `python3 scripts/verify_gate.py milestone 2026-10-27-no-screen-text` ends `VERIFY PASS`.
- F1 to F5 pass by their tagged checks.
- Nothing outside `## Files that change` is edited.

## Goal handover

The calm-style goal stays active. This change is built under it, between that change's milestone gates, by the owner's "Own small change, now".

## Revisions

- `sessions.test.ts`: the block-writing and `textBlock` fence checks become F1, F2, F5; F8 no longer expects the block.
- `ocr.test.ts`: the `ocrText` checks (reading order, `[redacted]`, cap) go with `ocrText`.
- `exporter.test.ts`: the hidden-block check now writes an old entry by hand (F5).
- `smoke.ts`: "session.md gets the text" becomes F1; the viewer checks append an old block by hand.
- `smoke.ts`: "prompt explains the text in the screenshot" becomes F3, its opposite.
- `README.md`: the text bullet, the example block and the `[redacted]` sentence go.
