---
id: 2026-10-25-adr-keys-follow-macos
title: 'Keys follow macOS: ⌃⇧ plus the screenshot digits, Preview and Finder keys in the windows'
type: adr
status: accepted
created: 2026-10-25
supersedes: []
superseded_by: []
amended_by: [2026-10-25-adr-capture-bar-and-settings-window]
tags: [ux, keys]
---

# Keys follow macOS

## Context

Snapmark captured with ⌃⇧1 and repeated the last area with ⌃⇧3. macOS uses ⇧⌘3 for the whole screen, ⇧⌘4 for an area and ⇧⌘5 for the screenshot options. The owner asked for "the shortcut mechanics close to what the default mac short cuts are" (2026-10-25). The interaction guidelines listed this as option (c) under Keyboard and focus.

## Decision

- Global keys keep macOS's digits and use ⌃⇧ for ⇧⌘, which macOS keeps for itself:
  - ⌃⇧4 Capture Screenshot… (was ⌃⇧1, now free).
  - ⌃⇧3 Capture Last Area.
  - ⌃⇧5 shows the capture options as a menu.
  - ⌃⇧N New Session, unchanged.
- The editor uses Preview's keys: ⌘S saves into the session (in one-shot mode it is Save As…), ⌘C copies the image when no text has the cursor, the arrow keys nudge the selected marks by 1 point (⇧ by 10), and ⌘A selects every mark.
- The session window uses Finder's keys: ↩ renames the session, ⌘⌫ moves the open screenshot to Discarded, ⌘O opens it in the editor again.
- Esc still closes the editor one step past Select; Discarded brings the screenshot back (owner, 2026-10-25).

## Rejected

- Taking ⇧⌘3, ⇧⌘4 and ⇧⌘5 themselves: it works only after the owner turns macOS's own keys off in System Settings. A later setting can offer it.
- ⌃ for "to the clipboard", as macOS does: Snapmark's chords would need four keys.
- Keeping ⌃⇧1 as a second capture key: two keys for one action, and 1 sits nowhere near macOS's digits.

## Consequences

- The owner re-learns one key, ⌃⇧1 to ⌃⇧4, once.
- ⌘A makes a multi-selection possible for the first time. It can be moved and removed as one step, but not resized or rotated.

## Milestones

- fixes: changes/2026-10-25-mac-shortcuts

| Date       | Decision                                             | Answer (quoted) | By whom   |
| ---------- | ---------------------------------------------------- | --------------- | --------- |
| 2026-10-25 | Keys follow macOS, as proposed in chat on 2026-10-25 | "ok go"         | the owner |
