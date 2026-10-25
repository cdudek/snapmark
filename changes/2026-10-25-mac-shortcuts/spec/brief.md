---
type: design-brief
mode: sdlc
change: 2026-10-25-mac-shortcuts
size: M
design: docs/designs/2026-10-25-adr-keys-follow-macos.md
created: 2026-10-25
review: code only (no app launch, no screen capture: the owner's rule)
---

# Brief

## Owner Asks

Copied from `intent.md` `## Asks`. E1 to E3 are earlier owner decisions on the same keys, found in archived changes.

| Ask | Source                                              | Words                                                                                                                            | Answered by                         |
| --- | --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| A1  | owner, chat, 2026-10-25                             | "I think we should have the shortcut mechanics close to what the default mac short cuts are."                                    | J1, J2, J3, J4                      |
| A2  | owner, chat, 2026-10-25                             | "can you make a proposal before implementing it now?"                                                                            | the ADR, approved before this spec  |
| A3  | owner, chat, 2026-10-25                             | "ok go" — to the proposal: ⌃⇧4, ⌃⇧3, ⌃⇧5, ⌃⇧N; editor ⌘S, ⌘C, arrows, ⌘A; session window ↩, ⌘⌫, ⌘O; Esc keeps closing the editor | the whole key map in interaction.md |
| E1  | archived change 2026-10-25-scrolling-capture        | "Not the default: a menu item under Capture Options, no global shortcut."                                                        | ⌃⇧5 opens a menu; no direct key     |
| E2  | archived change 2026-10-25-window-capture-copy-save | "Not the default: no global shortcut for window capture; Add to session stays the primary action."                               | ⌃⇧5 opens a menu; ⌘↵ stays          |
| E3  | archived change 2026-10-25-one-shot-mode            | "No new global shortcut unless clearly free and safe (⌃⇧2 is not)."                                                              | ⌃⇧2 stays unbound                   |

## Job Stories

| Job | Story                                                                                                                                                                          | Audience scene                  | Asks answered | Visible success                                                   |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------- | ------------- | ----------------------------------------------------------------- |
| J1  | When I want a screenshot while reviewing a page, I want to press the digit macOS uses for an area, with ⌃ for ⌘, so I can capture without thinking which number Snapmark uses. | 1. Reviewing an overnight build | A1, A3        | ⌃⇧4 opens the capture overlay; ⌃⇧5 shows the capture options.     |
| J2  | When I have marked up a screenshot, I want to save with ⌘S and copy with ⌘C, as in Preview, so I can finish without looking for a button.                                      | 1. Reviewing an overnight build | A1, A3        | ⌘S adds it to the session; ⌘C puts the image on the clipboard.    |
| J3  | When a mark sits a few pixels off, I want to nudge it with the arrow keys, so I can place it exactly without dragging.                                                         | 1. Reviewing an overnight build | A1, A3        | Each arrow press moves the selected mark one point; ⌘Z undoes it. |
| J4  | When I look through a session's screenshots, I want to rename, discard and reopen with Finder's keys, so I can tidy a session without the mouse.                               | 1. Reviewing an overnight build | A1, A3        | ↩ opens the name field; ⌘⌫ discards; ⌘O opens the editor.         |

## Appetite

Size: M. One behaviour across three surfaces, no new screen or route.

## No-Gos

| No-go                                                 | Source              | Reason                                                    |
| ----------------------------------------------------- | ------------------- | --------------------------------------------------------- |
| Register ⇧⌘3, ⇧⌘4 or ⇧⌘5                              | intent, Constraints | macOS keeps them for itself.                              |
| Change ⌃⇧N, ⌘↵, ⇧⌘C, ⇧⌘S, ⌘W, ⌘Z or the tool keys     | intent, Constraints | They already work and the owner uses them.                |
| Stop Esc from closing the editor                      | intent, decision 2  | The owner keeps it; Discarded brings the screenshot back. |
| Keep ⌃⇧1 as a second capture key                      | ADR, Rejected       | Two keys for one action.                                  |
| A direct global key for Window, Scrolling or One-Shot | E1, E2              | Not the default; they stay one menu choice away.          |
| Bind ⌃⇧2                                              | E3                  | Not free and safe.                                        |
| Resize or rotate handles on a multi-selection         | ADR, Consequences   | Move and remove only.                                     |
| A key recorder, ⇧-click or drag-to-select             | not asked           | Out of scope; guideline items for a later change.         |
| Copying or pasting marks                              | not asked           | ⌘C copies the image only (see interaction.md).            |

## Visible Success

- The owner presses ⌃⇧4 and the capture overlay appears. ⌃⇧1 does nothing.
- ⌃⇧5 pops the four capture options under the menu bar icon.
- In the editor, ⌘S adds the screenshot to the session and closes the editor.
- ⌘C copies the marked-up image, and the usual notification says so.
- The arrow keys move a selected mark. ⌘A selects every mark.
- In the session window, ↩ opens the name field. ⌘⌫ sends the shown screenshot to Discarded. ⌘O opens it in the editor.
- The Keyboard Shortcuts window, the README and the empty-session hints all show ⌃⇧4.

## Ask Map

| Ask | Status   | Where answered                                              | Reason if set aside |
| --- | -------- | ----------------------------------------------------------- | ------------------- |
| A1  | answered | interaction.md, Key map; screens.md                         |                     |
| A2  | answered | the ADR, approved 2026-10-25 ("ok go")                      |                     |
| A3  | answered | interaction.md, Key map rows G1 to G5, E1 to E12, S1 to S4  |                     |
| E1  | honoured | interaction.md, ⌃⇧5 popup: a menu, not a direct capture key |                     |
| E2  | honoured | as E1; ⌘↵ unchanged                                         |                     |
| E3  | honoured | ⌃⇧2 stays unbound                                           |                     |

## Open Questions

| Question                                                          | Recommended answer                                                                                                 | Why it matters                                                           |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| With a mark selected, does ⌘C copy the image or (later) the mark? | The image, for now. Revisit when mark copy and paste is built.                                                     | The Copy and paste guideline gives ⌘C on a selection to the mark.        |
| Should the menu show ⌃⇧5 next to Capture Options?                 | Yes, as the sublabel "⌃⇧5". Electron draws no key on a submenu row, but Capture Last Area already uses a sublabel. | ⌃⇧5 is otherwise learned only from the list.                             |
| Should the editor's primary button show ⌘S instead of ⌘↵?         | No. Keep "Add to session ⌘↵"; ⌘↵ still works and the owner listed it as unchanged.                                 | ⌘S is then learned from Preview habit and the Keyboard Shortcuts window. |
