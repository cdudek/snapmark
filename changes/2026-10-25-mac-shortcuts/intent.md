---
linear: none
type: intent
change: 2026-10-25-mac-shortcuts
design: docs/designs/2026-10-25-adr-keys-follow-macos.md
author: Calvin Dudek
status: approved
reviewed_by: Calvin Dudek
approved_at: 2026-10-25
created: 2026-10-25
---

# Intent: Shortcuts that work like macOS

> The owner presses the keys their Mac already taught them: the screenshot digits 3, 4 and 5, and the Preview and Finder keys inside Snapmark's windows.

## Asks

| #   | Date       | Source      | Words                                                                                                                            | Screen                              | Resources |
| --- | ---------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- | --------- |
| A1  | 2026-10-25 | owner, chat | "I think we should have the shortcut mechanics close to what the default mac short cuts are."                                    | global keys, editor, session window | none      |
| A2  | 2026-10-25 | owner, chat | "can you make a proposal before implementing it now?"                                                                            | none                                | none      |
| A3  | 2026-10-25 | owner, chat | "ok go" — to the proposal: ⌃⇧4, ⌃⇧3, ⌃⇧5, ⌃⇧N; editor ⌘S, ⌘C, arrows, ⌘A; session window ↩, ⌘⌫, ⌘O; Esc keeps closing the editor | global keys, editor, session window | none      |

## Job stories

| #   | When …                                     | I want to …                                          | So I can …                                          | Evidence      |
| --- | ------------------------------------------ | ---------------------------------------------------- | --------------------------------------------------- | ------------- |
| J1  | I want a screenshot while reviewing a page | press the digit macOS uses for an area, with ⌃ for ⌘ | capture without thinking which number Snapmark uses | reported — A1 |
| J2  | I have marked up a screenshot              | save with ⌘S and copy with ⌘C, as in Preview         | finish without looking for a button                 | reported — A1 |
| J3  | a mark sits a few pixels off               | nudge it with the arrow keys                         | place it exactly without dragging                   | reported — A1 |
| J4  | I look through a session's screenshots     | rename, discard and reopen with Finder's keys        | tidy a session without the mouse                    | reported — A1 |

## Success measure

Snapmark has no analytics, so the measure is the owner's own use after install.

- **Measure:** owner complaints about a shortcut that does not do what macOS taught them.
- **Read in:** docs/ux/owner-words.md.
- **Target:** none in the first week after release.

## Problem

- **What is wrong or missing:** capture is ⌃⇧1, a number macOS never uses for screenshots. The editor saves only with ⌘↩. Marks cannot be nudged.
- **Who feels it:** the owner, on every capture and every saved screenshot.
- **Evidence:** A1; the audit of 2026-09-28 (F022) found the keys one modifier away from macOS's.

## Proposed outcome

- ⌃⇧4 captures an area, ⌃⇧3 captures the last area, ⌃⇧5 opens the capture options, ⌃⇧N starts a new session.
- In the editor ⌘S saves and ⌘C copies the image. Arrow keys nudge marks and ⌘A selects them all.
- In the session window ↩ renames the session, ⌘⌫ discards the open screenshot and ⌘O edits it again.

## Affected users and systems

| Kind    | Name            | How                                                               |
| ------- | --------------- | ----------------------------------------------------------------- |
| users   | the owner       | presses the global keys and the window keys                       |
| service | `src/main.ts`   | registers ⌃⇧4, ⌃⇧3, ⌃⇧5 and ⌃⇧N; lists keys in Keyboard Shortcuts |
| service | `src/menu.ts`   | shows the new keys; the capture options as their own popup menu   |
| service | `src/editor.ts` | ⌘S, ⌘C, arrow keys, ⌘A                                            |
| service | `src/viewer.ts` | ↩, ⌘⌫, ⌘O                                                         |

## Constraints

- **Must not change:** ⌃⇧N, ⌘↩, ⇧⌘C, ⇧⌘S, ⌘W, ⌘Z, the tool keys, and Esc closing the editor one step past Select.
- **Never:** register ⇧⌘3, ⇧⌘4 or ⇧⌘5, which macOS keeps for itself.
- **Deadline:** none
- **Rules that apply:** owner's words (docs/ux/owner-words.md); interaction guidelines, Keyboard and focus, option (c).

## Decisions at confirmation

1. ⌃⇧4 replaces ⌃⇧1; ⌃⇧1 is freed (owner, 2026-10-25).
2. Esc keeps closing the editor one step past Select; Discarded brings it back (owner, 2026-10-25).
3. The change joins milestone `fixes` (owner, 2026-10-25).

## Open questions

None. The decisions are recorded above.
