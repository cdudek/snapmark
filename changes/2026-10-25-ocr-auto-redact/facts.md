---
linear: none
type: facts
change: 2026-10-25-ocr-auto-redact
design: null
author: calvin.dudek@omr.com
status: approved
reviewed_by: calvin.dudek@omr.com (roadmap and mockups, 2026-10-25)
approved_at: 2026-10-25
created: 2026-10-25
---

# Facts: OCR and auto-redact

## Goal

The agent reads the text a screenshot shows, and sensitive data on it is pixelated before the image leaves the Mac (roadmap M4).

## Acceptance criteria

### Text recognition

- [x] **F1** Snapmark shall read a screenshot's text with macOS's Vision (accurate, language correction on) in a child process with a timeout, starting when the editor opens and never delaying it.
- [x] **F2** Where there is no Vision (Linux) or it fails, the editor shall open and save as before, without text and without auto-redact.

### session.md

- [x] **F3** When a screenshot is added, its entry shall end with `<details><summary>Text in the screenshot</summary>` and the text in a plain-text block, rows top to bottom, each row left to right.
- [x] **F4** The text shall be capped at 2,000 characters with "…", and the block left out when there is no text.
- [x] **F5** Words under any Redact mark (the owner's or auto-redact's) shall be written as `[redacted]`, once for a run of them.
- [x] **F6** A numbered line in the text shall not count as a note in the Screenshots grid.
- [x] **F7** The Document tab shall show the block's tags as a quiet "Text in the screenshot" label and keep the block unchanged when it saves; the PDF export shall leave the block out; the ZIP keeps session.md as it is.
- [x] **F8** Copy Prompt for AI shall say what the block is and what `[redacted]` means.

### Auto-redact

- [x] **F9** When the editor opens a screenshot (any capture kind, a reopened discard, and Edit Again only when it has not run on it), Snapmark shall add Redact marks over email addresses, API keys and tokens (`sk-`, `rk_`, `ghp_`, `github_pat_`, `xox?-`, `AKIA`/`ASIA`, `AIza`, JWTs, other random strings of 32 or more characters), private key headers, Luhn-valid card numbers and valid IBANs.
- [x] **F10** The side panel shall say "Redacted N sensitive item(s) · ⌘Z to undo"; one ⌘Z shall remove all auto marks and the line, ⇧⌘Z put them back; each mark can be selected and deleted like a hand-made one.
- [x] **F11** Add to session, Copy Image and Save As… shall wait for auto-redact before they take the image.
- [x] **F12** Auto marks alone shall not count as unsaved work for the quit guard.

### Docs and tests

- [x] **F13** The patterns, the reading order and cap, and the session.md block shall have plain-Node tests; the smoke test shall check auto-redact, undo, session.md, Edit Again and the Document tab on a stubbed recognition.
- [x] **F14** README describes the text block, auto-redact and the PDF behaviour. No key changes, so the Keyboard Shortcuts window stays.
