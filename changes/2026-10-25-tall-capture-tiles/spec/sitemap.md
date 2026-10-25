# Snapmark sitemap: change 2026-10-25-tall-capture-tiles

Written by `omr-ux:sitemap-create diff`, scoped to this change. The whole-app `docs/ux/sitemap.md` is not touched now; the PR that builds the change updates its Finder line.

**Result: no route change.** Snapmark is an Electron menu bar app: its places are windows, tabs, menus and files, none with an address. This change adds no window, tab, menu item, dialog or notification. It adds one folder per tall screenshot inside the session folder, which the as-built sitemap lists under FINDER.

## As built

Read from `src/menu.ts`, `src/main.ts`, `src/viewer.html` and `src/sessions.ts` on `tall-capture-tiles/intent` at `764a2be` (2026-10-25). One locale (en). Only the places this change touches.

### Places in scope

| Place                             | Label (en)             | Type   | Tabs -> header primary                                   | Reached from                                   | Source                                                          |
| --------------------------------- | ---------------------- | ------ | -------------------------------------------------------- | ---------------------------------------------- | --------------------------------------------------------------- |
| Session window                    | "<session> — Snapmark" | record | Document; Screenshots; Discarded -> Open in Markdown App | menu Open Current Session; Reopen notification | `src/main.ts:508`, `src/menu.ts:116`, `src/viewer.html:484-488` |
| Menu ▸ Export Session ▸ PDF / ZIP | PDF / ZIP              | export | - -> none                                                | menu                                           | `src/menu.ts:139-142`                                           |
| Menu ▸ Copy Prompt for AI         | Copy Prompt for AI     | action | - -> none                                                | menu                                           | `src/menu.ts:117`, `src/main.ts:686`                            |
| Menu ▸ Copy Session File Path     | Copy Session File Path | action | - -> none                                                | menu                                           | `src/menu.ts:145`                                               |
| Finder: session folder            | `<session>/`           | files  | - -> none                                                | Finder; Copy Session File Path                 | `src/sessions.ts:1`, `:28-34`, `:37-43`                         |

**Redirects:** none (no addresses).

### Error pages

| Where | What it shows | Way back |
| ----- | ------------- | -------- |
| none  | —             | —        |

## E-mail and external links

| Mail, notification or link | Leads to | Source |
| -------------------------- | -------- | ------ |
| none                       | —        | —      |

## Proposed

**Status: proposed, 2026-10-25.** Nothing here is accepted until the plan gate approves it.

### The principles it rests on

| Principle                               | What it forces here                                                         |
| --------------------------------------- | --------------------------------------------------------------------------- |
| One screenshot, one number (intent, J3) | no new place for parts; they live in a folder under the screenshot's number |

### Pages whose content changes

| Page                     | Change                                                        | Why                                    |
| ------------------------ | ------------------------------------------------------------- | -------------------------------------- |
| Session window, Document | a tall entry shows a parts line and its parts                 | J1; `session.md` as the agent reads it |
| PDF export               | a tall entry shows the one image, sharper than today          | J3, scene 2                            |
| Finder: session folder   | `img/NNN/01.png …` beside `img/NNN.png` for a tall screenshot | J1, A1                                 |

## Changes from as built

| #   | Change                                                                                                                                             | Why (job story, law, owner's words, finding) | Findings |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- | -------- |
| 1   | FINDER line: "session folder = session.md · img/NNN.png · .edit/" becomes "session.md · img/NNN.png (and img/NNN/ for a tall screenshot) · .edit/" | J1; A1 "Split into tiles in session.md"      | none     |

## Redirects

None: no address moves.

| Old address | New address | Carries |
| ----------- | ----------- | ------- |
| none        | —           | —       |

## E-mail links that change

None.

## Checks

Returned to `omr-ux:design`; nothing new to check. SM-1 to SM-12: no place added, removed, moved or renamed, so no finding. The parts folder is not a place a person navigates to; it is reached only through `session.md`.
