---
linear: none
type: facts
change: 2026-10-27-no-screen-text
design: null
author: Claude (orchestrator)
status: approved
reviewed_by: Calvin Dudek
approved_at: 2026-10-27
created: 2026-10-27
---

# Facts: no recognised text under screenshots

## Goal

A saved entry holds the image, the marks and the owner's words, and no text read off the image. Pixelating private data still works.

## Acceptance criteria

The system is Snapmark. Tags: each check carries `@F<n>` beside `@2026-10-27-no-screen-text` in its title. Unit checks live in `snapmark-app/test/sessions.test.ts` and `exporter.test.ts`; rendering checks in `snapmark-app/test/smoke.ts`.

## Milestone 1: drop the text block

- [ ] **F1** (A1, A2) When a screenshot is added to a session, its entry in session.md shall have no "Text in the screenshot" block. Screen/state: session.md, new entry. Tag: `@F1`.
- [ ] **F2** (A1, A2) When Edit Again saves an entry, the entry shall have no recognised text. Screen/state: session.md, edited entry. Tag: `@F2`.
- [ ] **F3** (A1) The note for the AI at the top of session.md shall not mention recognised text. Screen/state: session.md, header. Tag: `@F3`.
- [ ] **F4** (A2) When a screenshot shows private data, Snapmark shall still pixelate it, as in v0.24.0. Screen/state: editor, redaction. Tag: `@F4`.
- [ ] **F5** (A2) Entries already on disk shall stay byte for byte as they are. Screen/state: session.md, old entry. Tag: `@F5`.
