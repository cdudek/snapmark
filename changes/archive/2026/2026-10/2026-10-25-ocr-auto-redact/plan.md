---
linear: none
type: plan
change: 2026-10-25-ocr-auto-redact
design: null
author: calvin.dudek@omr.com
status: approved
reviewed_by: calvin.dudek@omr.com (roadmap and mockups, 2026-10-25)
approved_at: 2026-10-25
created: 2026-10-25
archived_at: 2026-10-25
---

# Plan: OCR and auto-redact

> Vision reads the screenshot while the editor loads; main finds the secrets and the editor pixelates them with its own Redact marks; session.md gets the text with the redacted words left out.

## Approach

- **Recognition (`src/ocr.ts`):** JXA, not a Swift CLI. `osascript -l JavaScript` with `ObjC.import('Vision')` runs `VNRecognizeTextRequest` (level accurate, language correction on) and returns, per line, the text, its box and a box per word (`boundingBoxForRange`). Tried on synthetic images: about 0.5–0.8 s, German umlauts and IBANs read right. No binary to compile, ship in `extraResources` or sign; `osascript` is already used for Rename. Runs in `execFile` with a 20 s timeout; off macOS it returns null. Boxes come normalised from the bottom left and are turned into pixels in TypeScript (`toPixels`), so the conversion is tested.
- **Detection (`src/redact.ts`):** regexes plus checks (Luhn, IBAN mod 97, a randomness test for unprefixed tokens: mixed case and digits, ≥ 4 bits entropy a character, few slashes). A secret's box covers the whole words it touches, padded.
- **Flow:** `openEditor` starts recognition and keeps the promise. The editor, once loaded, asks `editor:secrets` and adds the marks as one undo step; `EditState.redacted` records that it ran, so Edit Again does not repeat it. Save, Copy and Save As await it. `editor:save` awaits the same promise and writes `ocrText(lines, redact marks)` into the entry.
- **Display:** session.md keeps `<details>` (collapsed on GitHub and in Markdown previews); the Document tab hides the raw tags with CSS on Milkdown's `span[data-type=html]` and shows a label; the PDF hides `details`.
- **Rejected:** a Swift CLI (build step, signing, notarisation for no gain); OCR of the flattened image to leave redacted text out (pixelation might still be read; the marks are exact); a setting (detection is quiet on ordinary UI text in the tests).

## Design changes

None.

## Files that change

| File                                       | Change                                                                 |
| ------------------------------------------ | ---------------------------------------------------------------------- |
| `src/ocr.ts`                               | new: JXA Vision script, `recognize`, `toPixels`, `ocrText`             |
| `src/redact.ts`                            | new: patterns, `findSecrets`, `secretBoxes`                            |
| `test/ocr.test.ts`, `test/redact.test.ts`  | new: plain-Node tests                                                  |
| `src/main.ts`                              | recognition per editor, `editor:secrets`, text into the entry, prompt  |
| `src/sessions.ts`, `test/sessions.test.ts` | `ShotText.text`, `textBlock`, notes count ignores the block            |
| `src/editor.ts`, `src/editor.html`         | `autoRedact`, side panel line, save/copy/save-as wait                  |
| `src/preload.ts`, `src/shared.d.ts`        | `secrets()`, `EditState.redacted`                                      |
| `src/viewer.html`                          | code block style, the block's label                                    |
| `src/exporter.ts`, `test/exporter.test.ts` | PDF hides the block                                                    |
| `test/smoke.ts`                            | stubbed recognition: marks, undo, session.md, Edit Again, Document tab |
| `package.json`, `README.md`                | `npm test` runs the new tests; the features and files                  |

## Order of work

- [x] 1. Prove JXA + Vision on a synthetic PNG (decides JXA vs Swift) — proof: recognised lines and word boxes
- [x] 2. `ocr.ts`, `redact.ts` and their tests (F1, F4, F5, F9) — proof: `node dist/test/redact.test.js`, `ocr.test.js`
- [x] 3. session.md block and notes count (F3, F6) — proof: `sessions.test.js`
- [x] 4. main and editor wiring (F2, F10–F12), Document tab and PDF (F7), prompt (F8) — proof: smoke checks
- [x] 5. README (F14)
- [x] 6. Verify, PR, auto-merge

## Risks

| Risk                                                                | What we do                                                                      | Where it lands |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------- | -------------- |
| False positives on ordinary text (paths, hashes, phone numbers)     | Negative cases in the test; randomness needs mixed case, digits, few slashes    | step 2         |
| A secret Vision misreads or splits across lines is missed           | Accepted: auto-redact helps, the owner still sees the image before it leaves    | accepted       |
| Milkdown rewrites the `<details>` block when the Document tab saves | Smoke check that the field's Markdown keeps the block                           | step 4         |
| Save waits on a slow recognition                                    | 20 s timeout, then it saves without text                                        | step 4         |
| App Store sandbox (spike snap-bmr.8) may not allow `osascript`      | Then Vision moves into the app (a native module or helper); noted for the spike | later          |

## Out of scope

- A setting, OCR for screenshots added before this change, search over sessions.

## Done

- `npm run format && npm run lint && npm run typecheck && npm test` exits 0.
- CI's smoke run passes, with the auto-redact and text checks.
- Every task in Order of work is ticked; departures are logged under `## Revisions`.

## Goal handover

none — built in the same session from the approved roadmap; the diff is the deliverable.

## Revisions
