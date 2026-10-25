# Interaction

No new control, key, dialog or notification. One-shot mode is unchanged: it never saves into a session (`editor:save` refuses it), and its Save As… and Copy Image stay at full resolution (`outImage`). What changes is what Add to Session, Edit Again, Remove from Session, Reopen and Export do with a tall screenshot's files. Guideline references are to `docs/ux/interaction-guidelines.md` (all rules there are `proposed`) and to accepted ADRs in `docs/designs/`. The numbers and the rule for "tall" are in [ia.md](ia.md).

## Wireflows

### J1 Hand a long page to the agent at its width

| From control                        | Action                  | To screen or state                     | Notes                                                                                           |
| ----------------------------------- | ----------------------- | -------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Capture Options ▸ Capture Scrolling | drag an area, scroll, ↩ | editor on the stitched page            | as today (fits the width and scrolls)                                                           |
| editor Add to Session               | click, ⌘↩ or ⌘S         | editor closes; entry 007 in session.md | tall: `img/007.png` (whole page at 1280 px wide) and `img/007/01.png` … `11.png`; else as today |
| menu Copy Prompt for AI             | click                   | prompt on the clipboard                | unchanged: the parts line in `session.md` tells the agent how to read the parts                 |
| the agent                           | reads `session.md`      | reads the parts line, then 11 images   | each image within Claude's limits, so none is shrunk again                                      |

### J2 A note far down the page stays findable

| From control          | Action                     | To screen or state                 | Notes                                                                                                                                                           |
| --------------------- | -------------------------- | ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| editor Reference tool | click anywhere on the page | numbered diamond placed            | as today                                                                                                                                                        |
| editor Add to Session | click, ⌘↩ or ⌘S            | parts cut from the flattened image | a diamond on a cut line is whole in one of the two parts: the overlap (128 px at 1280) is taller than a diamond; other marks continue across the repeated strip |
| `session.md`          | the agent reads note 3     | finds diamond 3 in part 7          | the notes are listed once, after the last part, as today                                                                                                        |

### J3 It stays one screenshot

| From control                            | Action          | To screen or state                                    | Notes                                                                                                                               |
| --------------------------------------- | --------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| menu header                             | open menu       | "· 7 screenshots"                                     | counts `img/*.png`; the parts folder is not counted                                                                                 |
| editor toolbar label                    | —               | "<session> · 7 screenshots"                           | same count                                                                                                                          |
| session window Screenshots tab          | open            | one thumbnail for 007                                 | the one image; sharper than today                                                                                                   |
| a thumbnail                             | click           | large view "7 of 7"                                   | the whole page, small, as today                                                                                                     |
| Edit Again (⌘O)                         | click           | editor "Save changes" on the clean capture, full size | `.edit/007.png`, as today                                                                                                           |
| editor Save changes                     | click, ⌘↩ or ⌘S | entry 007 written again                               | new parts written to `img/007.new/` first, then the one image and the entry, then the folders swap; nothing links to a missing part |
| Remove from Session (⌘⌫ or "…")         | click           | entry gone; Discarded tab shows it                    | the entry, the one image, the parts and the .edit files move to Discarded together                                                  |
| ⌘Z, or Discarded ▸ Reopen               | click           | entry back at the end                                 | number kept unless taken; when renumbered, every part link and alt text follows the new number                                      |
| Document tab                            | open            | the entry with its parts line and its parts           | `session.md` as the agent reads it                                                                                                  |
| Document tab                            | type            | saved as you type                                     | the parts links are kept as written; Edit Again writes them again                                                                   |
| menu Export Session ▸ PDF               | click           | Finder with the PDF selected                          | the PDF shows the one image in place of the parts, and leaves the parts line out                                                    |
| menu Export Session ▸ ZIP               | click           | Finder with the ZIP selected                          | `session.md` and `img/` with the parts, so another agent reads it the same way                                                      |
| editor Save As… (⇧⌘S), Copy Image (⇧⌘C) | click           | a PNG file, or the clipboard                          | the one image as Add to Session saves it (whole page at 1280 px wide), not the parts                                                |

## State Tables

### `session.md` entry (what the agent reads)

| State                           | Entry or trigger                              | What the agent sees                                                  | Words                                                             | Actions with key | Exit                |
| ------------------------------- | --------------------------------------------- | -------------------------------------------------------------------- | ----------------------------------------------------------------- | ---------------- | ------------------- |
| fits (default)                  | Add to Session, image not tall                | heading, one image, comment, notes, cards, text                      | `image “Screenshot 7” → img/007.png`                              | —                | —                   |
| tall                            | Add to Session, image tall                    | heading, parts line, parts 1 to n, then comment, notes, cards, text  | parts line; `image “Screenshot 7, part 1 of 11” → img/007/01.png` | —                | Edit Again, Remove  |
| tall, no text found             | no text recognition (Linux smoke, failed OCR) | as tall, without the "Text in the screenshot" block                  | as above                                                          | —                | —                   |
| tall, renumbered                | Reopen when the old number was taken          | as tall under the new number                                         | "## 012 · 14:32", "Screenshot 12, part 1 of 11", `img/012/01.png` | —                | —                   |
| edited by the owner             | Document tab typing, or another app           | whatever was written; parts links kept unless the owner deletes them | —                                                                 | —                | Edit Again rewrites |
| loading, empty, error, disabled | n/a                                           | a file; nothing loads. Empty session: no entries, as today           | —                                                                 | —                | —                   |

### Session window, Document tab

| State                    | Entry or trigger                  | What the user sees                                                                                                                                         | Words      | Actions with key         | Exit |
| ------------------------ | --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------ | ---- |
| entry, fits              | as today                          | heading, image, text                                                                                                                                       | as today   | type (saved as you type) | —    |
| entry, tall              | a tall screenshot                 | heading, the parts line, the parts stacked one per paragraph, then the text                                                                                | parts line | as above                 | —    |
| empty                    | no entries                        | as today                                                                                                                                                   | as today   | —                        | —    |
| changed outside          | session.md written elsewhere      | reloads, as today                                                                                                                                          | —          | —                        | —    |
| after Edit Again         | Save changes on a tall screenshot | the new parts, never the old ones from the image cache (parts keep their file names; the grid busts its cache with `?v=`, the Document tab does not today) | parts line | as above                 | —    |
| loading, error, disabled | n/a                               | as today                                                                                                                                                   | —          | —                        | —    |

### Session window, Screenshots tab

| State                           | Entry or trigger  | What the user sees                                          | Words                    | Actions with key | Exit |
| ------------------------------- | ----------------- | ----------------------------------------------------------- | ------------------------ | ---------------- | ---- |
| grid, tall                      | a tall screenshot | one thumbnail, the top of the page (`object-position: top`) | "007 · 14:32", "3 notes" | click, "…" menu  | —    |
| large, tall                     | thumbnail clicked | the whole page fitted in the stage, as today                | "7 of 7"                 | ← →, ⌘O, ⌘⌫, Esc | Esc  |
| empty, loading, error, disabled | n/a               | as today                                                    | as today                 | as today         | —    |

### Session window, Discarded tab

| State         | Entry or trigger           | What the user sees     | Words                  | Actions with key | Exit   |
| ------------- | -------------------------- | ---------------------- | ---------------------- | ---------------- | ------ |
| removed, tall | Remove from Session on 007 | one row, the one image | "Removed from session" | Reopen, ⌘Z       | Reopen |
| others        | as today                   | as today               | as today               | as today         | —      |

### PDF export

| State | Entry or trigger  | What the person sees                                                                            | Words                   | Actions with key | Exit |
| ----- | ----------------- | ----------------------------------------------------------------------------------------------- | ----------------------- | ---------------- | ---- |
| fits  | as today          | as today                                                                                        | as today                | —                | —    |
| tall  | a tall screenshot | the one image at page width, across pages, as Chromium prints a tall image today; no parts line | heading, comment, notes | —                | —    |

## State Diagrams

The screenshot's own state diagram (fits, tall, removed) is in [ia.md](ia.md). No screen gains more than three states of its own.

## Elements x Interactions

Only the elements a tall screenshot touches. Everything else is as built.

| Screen          | Element                   | Click                          | Double-click | Drag    | Drop onto | Hover   | Right-click / More       | Keys                       | Selection | Rules                      |
| --------------- | ------------------------- | ------------------------------ | ------------ | ------- | --------- | ------- | ------------------------ | -------------------------- | --------- | -------------------------- |
| Document tab    | a part image              | places the caret beside it     | nothing      | nothing | nothing   | nothing | system text menu         | ⌫ deletes it, as any image | text      | as today for the one image |
| Document tab    | parts line                | places the caret               | selects word | selects | nothing   | nothing | system text menu         | type                       | text      | plain paragraph            |
| Screenshots tab | thumbnail of a tall shot  | large view                     | nothing      | nothing | nothing   | nothing | "…": Remove from Session | Tab, Space or ↩            | single    | as today                   |
| Screenshots tab | large view of a tall shot | nothing                        | nothing      | nothing | nothing   | nothing | nothing                  | ← → ⌘O ⌘⌫ Esc              | n/a       | as today                   |
| Discarded tab   | row of a tall shot        | nothing; Reopen button reopens | nothing      | nothing | nothing   | nothing | nothing                  | Tab, Space                 | n/a       | as today                   |

## Action Behaviour

| Action              | Pointer route               | Keyboard route    | Menu route                       | Save                                                                                     | Leave                | Undo                                  | Guideline                                                   |
| ------------------- | --------------------------- | ----------------- | -------------------------------- | ---------------------------------------------------------------------------------------- | -------------------- | ------------------------------------- | ----------------------------------------------------------- |
| Add to Session      | Add to Session button       | ⌘↩, ⌘S            | none (editor)                    | one image, parts, entry; all or none (parts written first)                               | ⌘W discards (7 days) | Remove from Session (⌘Z puts it back) | ADR "Discard keeps the screenshot and its marks for 7 days" |
| Edit Again          | Edit Again button           | ⌘O                | "…" has no Edit Again (as today) | on Save changes: new parts beside the old, then the entry, then the swap; all or nothing | close: Discarded     | none (overwrites, as today, F079)     | "Edit a thing where it is shown" (proposed)                 |
| Remove from Session | Remove button, "…" ▸ Remove | ⌘⌫                | "…" menu                         | instant; files moved, never deleted                                                      | n/a                  | ⌘Z once; Reopen for 7 days            | ADR "Discard keeps …"; Finder keys (ADR keys follow macOS)  |
| Reopen              | Reopen button               | ⌘Z (last removed) | menu Reopen Discarded…           | instant; number kept unless taken                                                        | n/a                  | Remove again                          | ADR "Discard keeps …"                                       |
| Export PDF / ZIP    | menu item                   | none (menu)       | Export Session ▸ PDF / ZIP       | a file in the session folder                                                             | n/a                  | delete the file                       | as today                                                    |
| Save As… / Copy     | toolbar buttons             | ⇧⌘S, ⇧⌘C          | none (editor)                    | the one image; not in the session                                                        | Cancel               | n/a                                   | as today ("It is not in the session.")                      |

## Feedback

| Action               | Feedback                                                                | Reason                                                | Where shown          |
| -------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------- | -------------------- |
| Add to Session, tall | silent, as for any screenshot: the editor closes; the count goes up one | parts are for the agent; the owner's job is unchanged | menu, session window |
| Document tab         | visible: the parts line and the parts                                   | the owner sees exactly what the agent gets            | Document tab         |
| Remove, Reopen       | as today ("Screenshot 7 moved to Discarded. ⌘Z puts it back.")          | one screenshot                                        | session window       |

## Errors

| Event                                                                                            | Consequence                                                                                                           | Action                                                                                                                                                        |
| ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Writing a part fails (disk full, folder gone)                                                    | Add to Session fails before `session.md` changes; the editor stays open with the marks and Add to Session works again | as today for the one image: no message (the editor's `save()` re-enables the button); parts already written are deleted, so nothing half-made stays in `img/` |
| Writing a part fails during Edit Again                                                           | Save changes fails; the entry, its one image and its old parts stay as they were; the editor stays open               | as for Add to Session: the half-written `img/007.new/` is deleted; Save changes works again                                                                   |
| Reopen Discarded… panel: the owner picks the `parts` folder inside a removed screenshot's folder | the panel would not match a Discarded folder                                                                          | the parent folder counts as the pick, so the screenshot comes back as if its folder was picked                                                                |
| The owner deletes part links in the Document tab                                                 | the agent no longer sees those parts; the files stay in `img/007/`                                                    | none needed: Edit Again writes the links again; Remove and Reopen move the files                                                                              |
| The parts folder is missing when the entry is removed                                            | nothing is lost that was there                                                                                        | Remove moves what exists, as it does for a missing one image today                                                                                            |

## Open Questions

| Question                                                 | Recommended answer                                                                           | Why it matters                                                 |
| -------------------------------------------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Should Copy Prompt for AI also explain parts?            | no: the parts line sits in the entry, so `session.md` read without the prompt explains it    | one home for the explanation; the prompt stays the same length |
| Should the PDF show the parts, as `session.md` has them? | no: the one image, as the intent asks ("PDF … still treat a tall capture as one screenshot") | a person would see each overlap strip twice                    |
