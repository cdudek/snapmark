# Screens

Only what changes. Layout, sections and components of every screen stay as built. Final words are in [microcopy.md](microcopy.md); the Words tables below use them.

The display name rule, used on every screen below:

| Folder name                               | Display name                    |
| ----------------------------------------- | ------------------------------- |
| `2026-10-24 23.38`                        | 2026-10-24, 23:38               |
| `2026-10-24 23.38 (2)`                    | 2026-10-24, 23:38 (2)           |
| `2026-10-24 23.38 Ledgerly Q4 review`     | 2026-10-24 · Ledgerly Q4 review |
| `2026-10-24 23.38 (2) Ledgerly Q4 review` | 2026-10-24 · Ledgerly Q4 review |
| `Checkout review` (no stamp)              | Checkout review                 |

The stamp is `YYYY-MM-DD HH.MM` plus its same-minute suffix ` (2)` when present; rename never changes it.

File names (Save As…, PDF, ZIP) use the folder name, never the display name: macOS shows a colon in a file name as "/".

## Menu ▸ header and Session ▸

### Purpose

Act on sessions from the menu bar (setup.md: Menu bar menu).

### Header

| Title                   | Tabs | Actions          |
| ----------------------- | ---- | ---------------- |
| "Adding screenshots to" | none | none (grey line) |

### Sections

| Order | Section                                     | Purpose                          |
| ----- | ------------------------------------------- | -------------------------------- |
| 1     | header and its grey line                    | where captures go                |
| 2     | Session ▸ "Current Session" header and line | which session the actions act on |

### Layout

| Zoom  | Columns | Widths      | Notes                                                                   |
| ----- | ------- | ----------- | ----------------------------------------------------------------------- |
| 100 % | 1       | native menu | macOS sizes the menu to its widest row; a long name widens it, as today |
| 150 % | 1       | native menu | system text size; nothing Snapmark controls                             |

### Lists

| List | Columns | Sort | Empty |
| ---- | ------- | ---- | ----- |
| none |         |      |       |

### Controls

| Control  | Component | Label | Key | Disabled reason | State source |
| -------- | --------- | ----- | --- | --------------- | ------------ |
| none new |           |       |     |                 |              |

### Filters

| Filter | Default | Options | Clear behaviour |
| ------ | ------- | ------- | --------------- |
| none   |         |         |                 |

### Words

| Where                          | Text                                            |
| ------------------------------ | ----------------------------------------------- |
| header grey line, with shots   | 2026-10-24, 23:38 · 3 screenshots               |
| header grey line, named        | 2026-10-24 · Ledgerly Q4 review · 3 screenshots |
| Session ▸ Current Session line | 2026-10-24, 23:38                               |

### Components

| Region       | Component                    | Status | Notes             |
| ------------ | ---------------------------- | ------ | ----------------- |
| header lines | `heading()` in `src/menu.ts` | have   | text only changes |

## Menu ▸ Session ▸ Switch Session ▸

### Purpose

Make another session current; reach older ones (J1, J3).

### Header

| Title          | Tabs | Actions |
| -------------- | ---- | ------- |
| Switch Session | none | none    |

### Sections

| Order | Section                                                             | Purpose              |
| ----- | ------------------------------------------------------------------- | -------------------- |
| 1     | up to 10 session rows, ✓ on the current, which is always among them | the recent ones (A4) |
| 2     | separator, only when Older Sessions… shows                          | as today             |
| 3     | Older Sessions…, only when more than 10 sessions exist              | the rest (A3)        |

### Layout

| Zoom  | Columns | Widths      | Notes           |
| ----- | ------- | ----------- | --------------- |
| 100 % | 1       | native menu | 12 rows at most |
| 150 % | 1       | native menu | as 100 %        |

### Lists

| List         | Columns         | Sort                                                                                                                                                                 | Empty                                    |
| ------------ | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| session rows | display name, ✓ | last use, newest first; never-used ones after, in folder-name order Z to A (as built, `list()`); the current session replaces the 10th row when it is not among them | no rows: Switch Session itself is greyed |

### Controls

| Control         | Component            | Label           | Key                | Disabled reason   | State source                                     |
| --------------- | -------------------- | --------------- | ------------------ | ----------------- | ------------------------------------------------ |
| Switch Session  | native submenu item  | Switch Session  | arrows, ↩ (native) | no session exists | `MenuState.sessions` empty                       |
| session row     | native checkbox item | display name    | arrows, ↩ (native) | never disabled    | `MenuState.sessions`                             |
| Older Sessions… | native item          | Older Sessions… | arrows, ↩ (native) | never disabled    | shown when `MenuState.sessions` has more than 10 |

### Filters

| Filter | Default | Options | Clear behaviour |
| ------ | ------- | ------- | --------------- |
| none   |         |         |                 |

### Words

| Where                | Text                                   |
| -------------------- | -------------------------------------- |
| row                  | 2026-10-24, 23:38                      |
| named row            | 2026-10-24 · Ledgerly Q4 review        |
| last item            | Older Sessions…                        |
| folder panel message | Session folders start with their date. |

### Components

| Region          | Component                         | Status      | Notes                |
| --------------- | --------------------------------- | ----------- | -------------------- |
| submenu         | `menuTemplate()` in `src/menu.ts` | have        | `MAX_LISTED` 20 → 10 |
| Older Sessions… | same item, `a.otherSession()`     | new variant | label only           |

## Rename Session… dialog

### Purpose

Rename the current session from the menu (J2).

### Header

| Title               | Tabs | Actions         |
| ------------------- | ---- | --------------- |
| (AppleScript, none) | none | Cancel · Rename |

### Sections

| Order | Section    | Purpose             |
| ----- | ---------- | ------------------- |
| 1     | prompt     | says the date stays |
| 2     | text field | the name only       |

### Layout

| Zoom  | Columns | Widths        | Notes  |
| ----- | ------- | ------------- | ------ |
| 100 % | 1       | system dialog | native |
| 150 % | 1       | system dialog | native |

### Lists

| List | Columns | Sort | Empty |
| ---- | ------- | ---- | ----- |
| none |         |      |       |

### Controls

| Control    | Component          | Label  | Key  | Disabled reason | State source                     |
| ---------- | ------------------ | ------ | ---- | --------------- | -------------------------------- |
| text field | AppleScript field  | —      | type | never           | the name part of the folder name |
| Cancel     | AppleScript button | Cancel | Esc  | never           | —                                |
| Rename     | AppleScript button | Rename | ↩    | never           | —                                |

### Filters

| Filter | Default | Options | Clear behaviour |
| ------ | ------- | ------- | --------------- |
| none   |         |         |                 |

### Words

| Where                         | Text                                                                              |
| ----------------------------- | --------------------------------------------------------------------------------- |
| prompt, stamped session       | Name this session. The date 2026-10-24 stays in front.                            |
| prompt, session with no stamp | Rename session                                                                    |
| field, unnamed                | (empty)                                                                           |
| field, named                  | Ledgerly Q4 review                                                                |
| refused (notification)        | 2026-10-24, 23:38 keeps its name: 2026-10-24 · Ledgerly Q4 review already exists. |

### Components

| Region | Component                           | Status      | Notes                     |
| ------ | ----------------------------------- | ----------- | ------------------------- |
| dialog | `renameFromMenu()` in `src/main.ts` | new variant | prompt and default answer |

## Session window header

### Purpose

Read, edit and rename one session (setup.md: Session window).

### Header

| Title                         | Tabs                               | Actions         |
| ----------------------------- | ---------------------------------- | --------------- |
| display name, click to rename | Document · Screenshots · Discarded | pencil (rename) |

### Sections

| Order | Section            | Purpose               |
| ----- | ------------------ | --------------------- |
| 1     | name and count     | which session this is |
| 2     | rename field, hint | while editing         |

### Layout

| Zoom  | Columns | Widths   | Notes                                                    |
| ----- | ------- | -------- | -------------------------------------------------------- |
| 100 % | 1       | as built | a longer display name ellipsizes as the title does today |
| 150 % | 1       | as built | as 100 %                                                 |

### Lists

| List           | Columns               | Sort         | Empty      |
| -------------- | --------------------- | ------------ | ---------- |
| Discarded rows | thumbnail, kind, when | newest first | tab hidden |

### Controls

| Control      | Component       | Label / placeholder             | Key                | Disabled reason | State source              |
| ------------ | --------------- | ------------------------------- | ------------------ | --------------- | ------------------------- |
| title        | `#title` button | display name                    | Tab, Space or ↩    | never           | `ViewerInit` display name |
| rename field | `#rename` input | placeholder "Name this session" | ↩ save, Esc cancel | never           | the name part             |
| hint         | `#hint`         | see Words                       | —                  | —               | stamped or not            |

### Filters

| Filter | Default | Options | Clear behaviour |
| ------ | ------- | ------- | --------------- |
| none   |         |         |                 |

### Words

| Where                          | Text                                                                 |
| ------------------------------ | -------------------------------------------------------------------- |
| window title                   | 2026-10-24, 23:38 — Snapmark                                         |
| header title, named            | 2026-10-24 · Ledgerly Q4 review                                      |
| rename field placeholder       | Name this session                                                    |
| name removed (empty field, ↩)  | header back to "2026-10-24, 23:38"                                   |
| hint, stamped session          | The date stays · ↩ to save · Esc to cancel                           |
| hint, no stamp                 | ↩ to save · Esc to cancel                                            |
| error, empty                   | Enter a name.                                                        |
| error, taken                   | 2026-10-24 · Ledgerly Q4 review already exists. Choose another name. |
| Discarded row, 7 days or older | 2026-10-18, 09:41                                                    |

### Components

| Region       | Component                          | Status      | Notes                                              |
| ------------ | ---------------------------------- | ----------- | -------------------------------------------------- |
| title, field | `src/viewer.html`, `src/viewer.ts` | new variant | reads display name and name part from `ViewerInit` |

## Editor toolbar label and window title

### Purpose

Show where the screenshot goes (setup.md: Editor window).

### Header

| Title                                    | Tabs | Actions |
| ---------------------------------------- | ---- | ------- |
| window title "Snapmark — <display name>" | none | none    |

### Sections

| Order | Section          | Purpose           |
| ----- | ---------------- | ----------------- |
| 1     | `#session` label | where it is added |

### Layout

| Zoom  | Columns  | Widths   | Notes                                        |
| ----- | -------- | -------- | -------------------------------------------- |
| 100 % | as built | as built | at 1180 px the label may ellipsize, as today |
| 150 % | as built | as built | as 100 %                                     |

### Lists

| List | Columns | Sort | Empty |
| ---- | ------- | ---- | ----- |
| none |         |      |       |

### Controls

| Control | Component | Label | Key | Disabled reason | State source |
| ------- | --------- | ----- | --- | --------------- | ------------ |
| none    |           |       |     |                 |              |

### Filters

| Filter | Default | Options | Clear behaviour |
| ------ | ------- | ------- | --------------- |
| none   |         |         |                 |

### Words

| Where        | Text                                             |
| ------------ | ------------------------------------------------ |
| label, empty | 2026-10-24, 23:38                                |
| label, shots | 2026-10-24 · Ledgerly Q4 review · 12 screenshots |
| window title | Snapmark — 2026-10-24, 23:38                     |

### Components

| Region | Component                                                          | Status | Notes                       |
| ------ | ------------------------------------------------------------------ | ------ | --------------------------- |
| label  | `#session` in `src/editor.html`, `shotsLabel()` in `src/editor.ts` | have   | main sends the display name |

## Notifications and dialogs that name a session

| Where                                   | Text                                                                |
| --------------------------------------- | ------------------------------------------------------------------- |
| New Session                             | New session: 2026-10-24, 23:38                                      |
| New Session while empty                 | 2026-10-24, 23:38 is still empty, so new captures keep going there. |
| removed screenshot reopened             | Screenshot 3 is back in 2026-10-24 · Ledgerly Q4 review.            |
| session missing                         | 2026-10-24, 23:38 is no longer in ~/Documents/Snapmark              |
| Clear Sessions Older Than 60 Days… list | one display name per line                                           |

## PDF export

| Where             | Text                                                  |
| ----------------- | ----------------------------------------------------- |
| PDF first heading | 2026-10-24 · Ledgerly Q4 review                       |
| PDF file name     | 2026-10-24 23.38 Ledgerly Q4 review.pdf (folder name) |
| ZIP file name     | 2026-10-24 23.38 Ledgerly Q4 review.zip (folder name) |

`session.md` keeps `# <folder name>` as its first line, as the intent's constraint says. Only the PDF's rendered heading shows the display name.
