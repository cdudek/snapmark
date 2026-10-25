# Interaction

No new flow. Three existing flows change their words or one rule. Guideline references are to `docs/ux/interaction-guidelines.md` (all rules there are `proposed`) and to accepted ADRs in `docs/designs/`.

## Wireflows

### J1 Pick a session by its date

| From control   | Action | To screen or state              | Notes                                                                      |
| -------------- | ------ | ------------------------------- | -------------------------------------------------------------------------- |
| menu bar icon  | click  | menu, header shows display name | "Adding screenshots to" / "2026-10-24, 23:38 · 3 screenshots"              |
| Session        | hover  | Session ▸                       | "Current Session" line shows the display name                              |
| Switch Session | hover  | Switch Session ▸                | up to 10 rows, display names, ✓ on the current one, which is always listed |
| a row          | click  | that session is current         | as today                                                                   |

### J2 Rename a session and keep its date

| From control                   | Action     | To screen or state                   | Notes                                                   |
| ------------------------------ | ---------- | ------------------------------------ | ------------------------------------------------------- |
| session window title or pencil | click      | rename field open                    | field holds the name only; empty for an unnamed session |
| rename field                   | type, ↩    | header shows new display name        | folder becomes `<stamp> <name>`                         |
| rename field                   | Esc        | field closed, nothing changed        | as today                                                |
| Session ▸ Rename Session…      | click      | AppleScript dialog                   | default answer is the name only                         |
| dialog Rename                  | click or ↩ | menu and windows follow the new name | as today                                                |

### J3 Reach an older session

| From control     | Action | To screen or state                                                                          | Notes                                                                                  |
| ---------------- | ------ | ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Switch Session ▸ | hover  | 10 rows, separator, "Older Sessions…"                                                       | was 20 rows and "Other Session…"; the item shows only when more than 10 sessions exist |
| Older Sessions…  | click  | macOS folder panel on the sessions folder, message "Session folders start with their date." | same action as today                                                                   |
| panel Open       | click  | that session is current                                                                     | wrong folder: the notification of today                                                |

## State Tables

### Menu ▸ Session ▸ Switch Session

| State                    | Entry or trigger                                           | What the user sees                                                            | Words                                  | Actions with key        | Exit         |
| ------------------------ | ---------------------------------------------------------- | ----------------------------------------------------------------------------- | -------------------------------------- | ----------------------- | ------------ |
| default (11+ sessions)   | more than 10 sessions exist                                | 10 rows by last use, separator, Older Sessions…                               | "2026-10-24, 23:38", "Older Sessions…" | arrows, ↩ (native menu) | click or Esc |
| partial (1–10)           | 1 to 10 sessions                                           | every session, no separator, no Older Sessions…                               | display names                          | as above                | as above     |
| empty                    | no session yet                                             | Switch Session greyed: nothing to switch to; New Session is the item above it | "Switch Session" (disabled)            | none                    | —            |
| current not recent       | the current session is not among the 10 most recently used | the 10th row is the current one, ✓                                            | display name                           | as above                | as above     |
| named row                | a session with a name                                      | "2026-10-24 · Ledgerly Q4 review"                                             | display name                           | as above                | as above     |
| legacy row               | renamed before this change                                 | "Checkout review"                                                             | folder name                            | as above                | as above     |
| loading, error, disabled | n/a                                                        | the menu is built on open from the folder; nothing loads or fails             | —                                      | —                       | —            |

### Session window header and rename field

| State             | Entry or trigger                                     | What the user sees                                   | Words                                                                              | Actions with key | Exit                 |
| ----------------- | ---------------------------------------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------- | ---------------- | -------------------- |
| default           | window opens                                         | title: display name; window title the same           | "2026-10-24, 23:38 — Snapmark"                                                     | click title      | —                    |
| editing, unnamed  | click title or pencil                                | empty field, placeholder, hint                       | placeholder "Name this session"; hint "The date stays · ↩ to save · Esc to cancel" | ↩, Esc           | ↩ saves, Esc cancels |
| editing, named    | click title or pencil                                | field holds "Ledgerly Q4 review", selected           | same hint                                                                          | ↩, Esc           | as above             |
| editing, legacy   | click on a session with no stamp                     | field holds the folder name, selected                | hint "↩ to save · Esc to cancel"                                                   | ↩, Esc           | as above             |
| saved             | ↩ or click away with a new name                      | header shows the new display name                    | "2026-10-24 · Ledgerly Q4 review"                                                  | —                | default              |
| unchanged         | ↩ with the same text, or empty on an unnamed session | field closes, nothing changes                        | —                                                                                  | —                | default              |
| name removed      | ↩ with an empty field on a named session             | header shows the bare date; folder back to the stamp | "2026-10-24, 23:38"                                                                | —                | default              |
| error: empty      | ↩ with an empty field on a session with no stamp     | field stays, hint in red                             | "Enter a name."                                                                    | type, Esc        | editing              |
| error: taken      | the folder `<stamp> <name>` exists                   | field stays, hint in red                             | "2026-10-24 · Ledgerly Q4 review already exists. Choose another name."             | type, Esc        | editing              |
| loading, disabled | n/a                                                  | rename is instant and always available               | —                                                                                  | —                | —                    |

### Editor toolbar label

| State    | Entry or trigger           | What the user sees            | Words                                              | Actions with key | Exit |
| -------- | -------------------------- | ----------------------------- | -------------------------------------------------- | ---------------- | ---- |
| empty    | session has no screenshots | display name only             | "2026-10-24, 23:38"                                | none             | —    |
| default  | session has screenshots    | display name and count        | "2026-10-24 · Ledgerly Q4 review · 12 screenshots" | none             | —    |
| renamed  | rename while open          | label and window title follow | new display name                                   | none             | —    |
| one-shot | one-shot mode              | unchanged                     | "One-shot · not in a session"                      | none             | —    |

## State Diagrams

The session name state diagram is in [ia.md](ia.md). No screen here has more than three states of its own beyond the rename field above, whose states are a straight line (default → editing → saved or error).

## Elements x Interactions

| Screen           | Element              | Click             | Double-click | Drag        | Drop onto | Hover            | Right-click / More | Keys                    | Selection               | Rules                             |
| ---------------- | -------------------- | ----------------- | ------------ | ----------- | --------- | ---------------- | ------------------ | ----------------------- | ----------------------- | --------------------------------- |
| Switch Session ▸ | session row          | make current      | nothing      | nothing     | nothing   | highlight        | nothing            | arrows, ↩ (native menu) | single, ✓ marks current | native menu (A16)                 |
| Switch Session ▸ | Older Sessions… item | open folder panel | nothing      | nothing     | nothing   | highlight        | nothing            | arrows, ↩               | n/a                     | ADR menu labels name their object |
| Session window   | title                | open rename field | nothing      | nothing     | nothing   | tooltip "Rename" | nothing            | Tab then Space or ↩     | n/a                     | rename in place (proposed)        |
| Session window   | rename field         | place caret       | select word  | select text | nothing   | nothing          | system text menu   | ↩ save, Esc cancel      | text                    | as today                          |
| Editor           | session label        | nothing           | nothing      | nothing     | nothing   | nothing          | nothing            | none                    | n/a                     | as today                          |

## Action Behaviour

| Action          | Pointer route            | Keyboard route                   | Menu route                                 | Save               | Leave                  | Undo                             | Guideline                                                           |
| --------------- | ------------------------ | -------------------------------- | ------------------------------------------ | ------------------ | ---------------------- | -------------------------------- | ------------------------------------------------------------------- |
| Switch session  | click a row              | arrows and ↩ in the menu         | Session ▸ Switch Session ▸ row             | instant            | n/a                    | switch back                      | native menu, as today                                               |
| Older Sessions… | click the item           | arrows and ↩ in the menu         | Session ▸ Switch Session ▸ Older Sessions… | on Open            | Cancel                 | switch back                      | as today (was Other Session…)                                       |
| Rename          | click the title, type, ↩ | Tab to the title, Space, type, ↩ | Session ▸ Rename Session…                  | on ↩ or click away | Esc keeps the old name | rename again (no Undo, as today) | rename in place (proposed); Rename has no undo (proposed, line 283) |

## Feedback

| Action                   | Feedback                                                                   | Reason                           | Where shown               |
| ------------------------ | -------------------------------------------------------------------------- | -------------------------------- | ------------------------- |
| Rename                   | visible: header, window title, menu, editor label change                   | the new name is the confirmation | everywhere the name shows |
| Rename refused           | visible: red hint under the field                                          | the owner must pick another name | session window            |
| Rename from menu refused | notification "<display> keeps its name: a session named … already exists." | the dialog is gone by then       | notification (as today)   |
| New Session              | notification "New session: 2026-10-24, 23:38"                              | the shortcut gives no other sign | notification              |

## Errors

| Event                                         | Consequence                    | Action                                                                             |
| --------------------------------------------- | ------------------------------ | ---------------------------------------------------------------------------------- |
| The typed name is taken                       | the session keeps its old name | "2026-10-24 · Ledgerly Q4 review already exists. Choose another name."             |
| The field is empty on a session with no stamp | nothing changes                | "Enter a name." — type one or press Esc                                            |
| Older Sessions… picks a non-session folder    | nothing changes                | the notification of today: "That folder is not a session in ~/Documents/Snapmark." |

## Open Questions

| Question                                                | Recommended answer                                        | Why it matters                                                                        |
| ------------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Can the owner remove a name and get the bare date back? | yes: empty the field and press ↩ (validation, 2026-10-25) | the date never changes; a typed text that starts with a date is just part of the name |
