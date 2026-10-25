---
type: design-microcopy
change: 2026-10-25-mac-shortcuts
created: 2026-10-25
languages: [en]
---

# Microcopy

Every string this change adds or changes, exact, English only. Line numbers are from the branch as of 2026-10-25. Key symbols in the macOS order ⌃⌥⇧⌘ (Platform conventions, rule 3). Strings not listed stay as they are.

## Keyboard Shortcuts window, "Other keys"

`src/main.ts:791-807`, the `other` array. Columns are the `row()` arguments: key, name, what. Order as listed; it replaces the whole array.

Owner, 2026-10-25 (Q5): the rows sit under three headings instead of "Other keys". "Anywhere" holds rows 1–5. "Editor" holds rows 6–16. "Session window" holds rows 17–21. The "in the session window, " prefix is dropped from rows 17–21, since the heading says it.

| #   | Key      | Name                | What                                                                                                           | Change                                          |
| --- | -------- | ------------------- | -------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| 1   | ⌃⇧4      | Capture screenshot  | anywhere; drag an area, or press Space and click a window                                                      | was ⌃⇧1 "Capture region" "anywhere"             |
| 2   | ⌃⇧3      | Capture last area   | anywhere; the first time, drag the area                                                                        | none                                            |
| 3   | ⌃⇧5      | Capture options     | anywhere; a menu under the menu bar icon: Choose New Area, Capture Window, Capture Scrolling, One-Shot Capture | new                                             |
| 4   | ⌃⇧N      | New session         | anywhere                                                                                                       | none                                            |
| 5   | ↩ / Esc  | Capture Scrolling   | Done or cancel, while it grabs the area you scroll (menu: Capture Options)                                     | none                                            |
| 6   | Esc      | Step back           | out of the text, then deselect, then back to Select, then close                                                | none                                            |
| 7   | ⌫        | Delete              | the selected marks                                                                                             | was "the selected mark"                         |
| 8   | ← ↑ → ↓  | Nudge               | the selected marks by 1 point; with ⇧, by 10                                                                   | new                                             |
| 9   | ⌘A       | Select all          | every mark except redactions, to move or delete them together                                                  | new                                             |
| 10  | ⌘1–⌘7    | Pick a tool         | also while typing a note or card, where the plain digit types                                                  | none                                            |
| 11  | ⌘Z       | Undo                | in a note, its typing first, then the marks                                                                    | none                                            |
| 12  | ⇧⌘Z      | Redo                | (empty)                                                                                                        | none                                            |
| 13  | ⌘S / ⌘↵  | Add to session      | in one-shot, ⌘S is Save As… and ⌘↵ is Copy Image                                                               | was ⌘↵, what empty                              |
| 14  | ⌘C / ⇧⌘C | Copy Image          | the marked-up image, without adding it to the session; in a note only ⇧⌘C; in one-shot, at full resolution     | merges the ⇧⌘C and "Copy Image (one-shot)" rows |
| 15  | ⇧⌘S      | Save As…            | the marked-up image as a PNG wherever you pick, without adding it to the session                               | none                                            |
| 16  | ⌘W       | Discard             | the screenshot; Reopen Last Discarded in the menu brings it back                                               | none                                            |
| 17  | ← →      | Flip screenshots    | in the session window, one at a time; Esc goes back to the grid                                                | none                                            |
| 18  | ↩        | Rename session      | in the session window, when no button or field has focus                                                       | new                                             |
| 19  | ⌘⌫       | Remove from Session | in the session window, the screenshot shown large; ⌘Z puts it back, and the Discarded tab keeps it 7 days      | new                                             |
| 20  | ⌘O       | Edit Again          | in the session window, the screenshot shown large, with its marks                                              | new                                             |
| 21  | ⌘Z       | Undo                | in the session window, puts back the screenshot last removed                                                   | new (owner, Q2)                                 |

The "Editor tools" section (`TOOLS`) does not change.

## Menu bar menu

| Where                           | Before                                    | After                                                                                             |
| ------------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `src/menu.ts:87`, accelerator   | Capture Screenshot… ⌃⇧1                   | Capture Screenshot… ⌃⇧4 (drawn by macOS from `Control+Shift+4`)                                   |
| `src/menu.ts:94`, label         | "Capture Options"                         | "Capture Options" when ⌃⇧5 is registered; "Capture Options (shortcut unavailable)" when it is not |
| `src/menu.ts:94`, sublabel      | none                                      | "⌃⇧5" while ⌃⇧5 is registered (Q3)                                                                |
| `src/main.ts:877`, notification | "Control+Shift+1 is taken by another app" | template unchanged; reads "Control+Shift+4 …" or "Control+Shift+5 …"                              |

## Popup at the menu bar icon (⌃⇧5)

The same four labels as `src/menu.ts:97-104`, from the same list:

1. "Choose New Area…"
2. "Capture Window…"
3. "Capture Scrolling…"
4. separator
5. "One-Shot Capture…"

## Session window

| Where                              | Before                                                  | After                                                   |
| ---------------------------------- | ------------------------------------------------------- | ------------------------------------------------------- |
| `src/viewer.html:475`, `title`     | "Rename"                                                | "Rename (↩)"                                            |
| `src/viewer.html:476`, `title`     | "Rename"                                                | "Rename (↩)" (its `aria-label` "Rename session" stays)  |
| `src/viewer.html:495`              | "No screenshots yet. Capture one with ⌃⇧1."             | "No screenshots yet. Capture one with ⌃⇧4."             |
| `src/viewer.html:505`, `title`     | "Open it in the editor with its marks"                  | "Open it in the editor with its marks (⌘O)"             |
| `src/viewer.html:506`, new `title` | none                                                    | "Move it to Discarded for 7 days (⌘⌫)"                  |
| `src/viewer.ts:57`, placeholder    | "This session is empty. Capture a screenshot with ⌃⇧1." | "This session is empty. Capture a screenshot with ⌃⇧4." |

The grid card's Edit Again (`src/viewer.html:520`) keeps its title: ⌘O does not work in the grid.

## Editor

No string changes. The buttons keep "Add to session ⌘↵", "Save changes ⌘↵", "Copy Image ⇧⌘C", "Save As… ⇧⌘S", "Discard ⌘W" and one-shot "Copy Image ⌘C" (`src/editor.html:505-538`, `src/editor.ts:1095,1102`).

## README

| Where                                           | Before                                                                      | After                                                                                                                                      |
| ----------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `README.md:15`                                  | "1. Press `⌃⇧1`, drag over the part of the screen you mean."                | "1. Press `⌃⇧4`, drag over the part of the screen you mean."                                                                               |
| `README.md:66`                                  | "\| `⌃⇧1` \| Capture a region into the current session \|"                  | "\| `⌃⇧4` \| Capture a region into the current session \|"                                                                                 |
| after `README.md:67`                            | none                                                                        | "\| `⌃⇧5` \| Show the capture options as a menu under the menu bar icon \|"                                                                |
| after `README.md:84` (the Esc row)              | none                                                                        | "\| `←` `↑` `→` `↓` \| Nudge the selected marks 1 point; with `⇧`, 10 points \|"                                                           |
| after the new nudge row                         | none                                                                        | "\| `⌘A` \| Select every mark except redactions, to move or delete them together \|"                                                       |
| `README.md:88`                                  | "\| `⌘↵` \| Add to session \|"                                              | "\| `⌘S` / `⌘↵` \| Add to session (in one-shot, `⌘S` is Save As… and `⌘↵` Copy Image) \|"                                                  |
| `README.md:92`                                  | "\| `⌘C` \| One-shot mode only: Copy Image, when no text has the cursor \|" | "\| `⌘C` \| Copy Image, when no text has the cursor \|"                                                                                    |
| `README.md:100`                                 | "⇧⌘C works inside a note too; plain ⌘C there still copies the text."        | "Outside a note, plain ⌘C copies the image too. Inside a note, ⌘C copies the text and ⇧⌘C still copies the image."                         |
| `README.md:105`                                 | "**Capture Screenshot…** (⌃⇧1)."                                            | "**Capture Screenshot…** (⌃⇧4)."                                                                                                           |
| new line before `README.md:107`                 | none                                                                        | "- **Capture Options** holds the less frequent ways to capture. ⌃⇧5 shows the same items as a menu under the menu bar icon, from any app." |
| `README.md:107`                                 | "No shortcut, like Capture Scrolling."                                      | "No direct shortcut, like Capture Scrolling; ⌃⇧5 shows it."                                                                                |
| `README.md:108`                                 | "There is no shortcut, on purpose: it is not the everyday capture."         | "There is no direct shortcut, on purpose: it is not the everyday capture. ⌃⇧5 shows it."                                                   |
| `README.md:109`                                 | "No shortcut."                                                              | "No direct shortcut; ⌃⇧5 shows it."                                                                                                        |
| `README.md:109`                                 | "**Save As…** (⇧⌘S) suggests"                                               | "**Save As…** (⌘S or ⇧⌘S) suggests"                                                                                                        |
| `README.md:110`                                 | "click the name (or the pencil) to rename it in place"                      | "click the name (or the pencil), or press ↩, to rename it in place"                                                                        |
| `README.md:110`, after "goes back to the grid." | none                                                                        | "There, ⌘O is **Edit Again** and ⌘⌫ is **Remove from Session**; ⌘Z puts the last removed screenshot back."                                 |

`README.md:17` ("Press `⌘↵`") stays: it matches the button the first-time reader sees.

## docs/ux/setup.md

| Where                                | Before                                                                                | After                                                                                                          |
| ------------------------------------ | ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `docs/ux/setup.md:53`, states        | "… · development build (updates and Open at Login disabled)"                          | "… · development build (updates and Open at Login disabled) · capture options popup (⌃⇧5)"                     |
| `docs/ux/setup.md:54`                | "`⌃⇧1` or the menu"                                                                   | "`⌃⇧4` or the menu"                                                                                            |
| `docs/ux/setup.md:60`, notifications | "new session (`⌃⇧2`)"                                                                 | "new session (`⌃⇧N`)"                                                                                          |
| `docs/ux/setup.md:66`                | "global shortcuts `⌃⇧1` (capture), `⌃⇧2` (new session) and `⌃⇧3` (capture same area)" | "global shortcuts `⌃⇧4` (capture), `⌃⇧3` (capture last area), `⌃⇧5` (capture options) and `⌃⇧N` (new session)" |
| `docs/ux/setup.md:82`                | "Never press `⌃⇧1`, `⌃⇧2` or `⌃⇧3`, and never run `screencapture`."                   | "Never press `⌃⇧3`, `⌃⇧4`, `⌃⇧5` or `⌃⇧N`, and never run `screencapture`."                                     |

## Unchanged on purpose

- `src/area.html:59`: "⌃⇧3 captures it again each time." Still true.
- "(shortcut unavailable)" wording and the startup notification template: the intent says "as today".
