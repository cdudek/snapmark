---
linear: none
type: intent
change: 2026-10-27-no-screen-text
design: null
author: Claude (orchestrator)
status: approved
reviewed_by: Calvin Dudek
approved_at: 2026-10-27
created: 2026-10-27
---

# Intent: no recognised text under screenshots

> A saved screenshot is the image, the marks and the owner's own words. Snapmark adds no text read off the image.

## Asks

| #   | Date       | Source                                      | Words                                                                 | Screen     | Resources |
| --- | ---------- | ------------------------------------------- | --------------------------------------------------------------------- | ---------- | --------- |
| A1  | 2026-10-27 | owner, chat, with a screenshot of the block | "I dont want text in the screenshots"                                 | session.md | none      |
| A2  | 2026-10-27 | owner, dialog                               | "Drop the block (Recommended)"; "Own small change, now (Recommended)" | session.md | none      |

## Job stories

| #   | When …                    | I want to …                              | So I can …                             | Evidence     |
| --- | ------------------------- | ---------------------------------------- | -------------------------------------- | ------------ |
| J1  | I hand a session to an AI | give it only the images and my own notes | keep other people's messages out of it | reported, A1 |

## Success measure

- **Measure:** "Text in the screenshot" blocks in session.md entries saved after the release. **Read in:** the owner's session folders. **Target:** zero by 2026-11-03.

## Problem

- **What is wrong or missing:** every entry ends with the text macOS read off the image. It copies chat messages, names and times from whatever was on screen.
- **Who feels it:** the owner, and whoever reads the session.
- **Evidence:** A1.

## Proposed outcome

- New entries in session.md have no "Text in the screenshot" block. Exports and the AI note have none either.
- Text recognition stays only to find private data to pixelate, as today.

## Affected users and systems

| Kind    | Name                | How                                     |
| ------- | ------------------- | --------------------------------------- |
| users   | the owner           | shorter entries, no copied screen text  |
| service | `snapmark-app/src/` | `sessions.ts`, `main.ts`, `exporter.ts` |

## Constraints

- **Must not change:** auto-redaction of private data; entries already on disk.
- **Deadline:** none.
- **Rules that apply:** no new dependency.

## Open questions

None.
