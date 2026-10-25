---
type: design-screens
change: 2026-10-25-mac-shortcuts
created: 2026-10-25
review: code only; no screenshots (the owner's rule)
---

# Screens

No layout changes anywhere. The change shows on screen as keys in a list, a menu, tooltips, two hints and the multi-selection border. Exact strings and their file:line are in microcopy.md.

## Keyboard Shortcuts window

### Purpose

Every key in one list (guideline Keyboard and focus, rule 4). Built in `showShortcuts()`, `src/main.ts:784`.

### Header

| Title                            | Tabs | Actions |
| -------------------------------- | ---- | ------- |
| "Keyboard shortcuts" (unchanged) | none | none    |

### Sections

| Order | Section        | Purpose                                                |
| ----- | -------------- | ------------------------------------------------------ |
| 1     | "Editor tools" | Unchanged. Built from `TOOLS`.                         |
| 2     | "Other keys"   | Every other key, in the order below. Grouped as today. |

### Lists: "Other keys", in order

Each row's "What" text (microcopy.md) says where the key works, so the list reads by place: anywhere, editor, session window.

| Order | Key      | Name                | Change                                          |
| ----- | -------- | ------------------- | ----------------------------------------------- |
| 1     | ⌃⇧4      | Capture screenshot  | key, name                                       |
| 2     | ⌃⇧3      | Capture last area   | none                                            |
| 3     | ⌃⇧5      | Capture options     | new                                             |
| 4     | ⌃⇧N      | New session         | none                                            |
| 5     | ↩ / Esc  | Capture Scrolling   | none                                            |
| 6     | Esc      | Step back           | none                                            |
| 7     | ⌫        | Delete              | what: plural                                    |
| 8     | ← ↑ → ↓  | Nudge               | new                                             |
| 9     | ⌘A       | Select all          | new                                             |
| 10    | ⌘1–⌘7    | Pick a tool         | none                                            |
| 11    | ⌘Z       | Undo                | none                                            |
| 12    | ⇧⌘Z      | Redo                | none                                            |
| 13    | ⌘S / ⌘↵  | Add to session      | key, what                                       |
| 14    | ⌘C / ⇧⌘C | Copy Image          | merges the ⇧⌘C and "Copy Image (one-shot)" rows |
| 15    | ⇧⌘S      | Save As…            | none                                            |
| 16    | ⌘W       | Discard             | none                                            |
| 17    | ← →      | Flip screenshots    | none                                            |
| 18    | ↩        | Rename session      | new                                             |
| 19    | ⌘⌫       | Remove from Session | new                                             |
| 20    | ⌘O       | Edit Again          | new                                             |

Sort: fixed, as above. Empty: never empty.

### Layout

| Zoom  | Columns                  | Widths                 | Notes                                                          |
| ----- | ------------------------ | ---------------------- | -------------------------------------------------------------- |
| 100 % | key · icon · name · what | auto; window 520 × 640 | 20 rows plus the tool rows. The window already scrolls.        |
| 150 % | same                     | same                   | `kbd` is `nowrap`; "← ↑ → ↓" is the widest key and still fits. |

### Controls, Filters

None.

### Components

| Region | Component                  | Status | Notes                      |
| ------ | -------------------------- | ------ | -------------------------- |
| row    | `row()` in `showShortcuts` | have   | same helper, new data rows |

## Menu bar menu

### Purpose

Capture on top, then the session (`menuTemplate`, `src/menu.ts:72`).

### Controls (changed rows only)

| Control             | Component              | Label                                                                                  | Key                                                                         | Disabled reason | State source               |
| ------------------- | ---------------------- | -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | --------------- | -------------------------- |
| Capture Screenshot… | `shortcut()` menu item | "Capture Screenshot…"                                                                  | ⌃⇧4 (was ⌃⇧1)                                                               | none            | `st.shortcuts.capture`     |
| Capture Last Area   | `shortcut()` menu item | "Capture Last Area"                                                                    | ⌃⇧3                                                                         | none            | `st.shortcuts.area`        |
| Capture Options     | submenu row            | "Capture Options"; "Capture Options (shortcut unavailable)" when ⌃⇧5 is not registered | sublabel "⌃⇧5" if the owner agrees (Electron draws no key on a submenu row) | none            | new `st.shortcuts.options` |
| New Session         | `shortcut()` menu item | "New Session" (under Session)                                                          | ⌃⇧N                                                                         | none            | `st.shortcuts.newSession`  |

macOS draws the keys from the accelerator, in the system font, right-aligned. Rows, icons and order do not change.

## Popup at the menu bar icon (⌃⇧5)

### Purpose

The capture options in one key, like macOS's ⇧⌘5 toolbar.

### Lists

| Order | Item               | Component        | Key  |
| ----- | ------------------ | ---------------- | ---- |
| 1     | Choose New Area…   | native menu item | none |
| 2     | Capture Window…    | native menu item | none |
| 3     | Capture Scrolling… | native menu item | none |
| 4     | separator          |                  |      |
| 5     | One-Shot Capture…  | native menu item | none |

No header, no icons: the same items as the Capture Options submenu, built from the same list. Shown with `tray.popUpContextMenu`, so it opens under the icon like the menu.

### Components

| Region     | Component                               | Status      | Notes                                          |
| ---------- | --------------------------------------- | ----------- | ---------------------------------------------- |
| popup menu | Capture Options items, `src/menu.ts:96` | new variant | the submenu's array, lifted out and used twice |

## Editor

No layout change. The one new look is the multi-selection border (no handles). Button hints stay ("Add to session ⌘↵", "Copy Image ⇧⌘C", "Save As… ⇧⌘S", "Discard ⌘W"; one-shot "Copy Image ⌘C").

### Controls (new keys on existing controls)

| Control        | Component     | Label     | Key                 | Disabled reason    | State source      |
| -------------- | ------------- | --------- | ------------------- | ------------------ | ----------------- |
| primary button | `#save`       | unchanged | ⌘↵, now also ⌘S     | while saving       | `saving`          |
| Copy Image     | `#copy`       | unchanged | ⇧⌘C, now also ⌘C    | none               | none              |
| canvas marks   | Fabric canvas | none      | arrows, ⇧arrows, ⌘A | redactions: pinned | `lockMovementX/Y` |

### Components

| Region          | Component                | Status      | Notes                                                    |
| --------------- | ------------------------ | ----------- | -------------------------------------------------------- |
| multi-selection | Fabric `ActiveSelection` | new variant | border only, `hasControls: false`; first use in Snapmark |

## Session window

No layout change. Two tooltips gain their key, as ← and → already do.

### Controls (changed only)

| Control             | Component | Label                  | Key | Disabled reason                                                                        | State source |
| ------------------- | --------- | ---------------------- | --- | -------------------------------------------------------------------------------------- | ------------ |
| name (title)        | `#title`  | the session name       | ↩   | none                                                                                   | none         |
| pencil              | `#pencil` | icon, "Rename session" | ↩   | none                                                                                   | none         |
| Edit Again          | `#edit`   | "Edit Again"           | ⌘O  | greyed for screenshots saved before marks were kept (no reason shown, F143, unchanged) | `s.editable` |
| Remove from Session | `#remove` | "Remove from Session"  | ⌘⌫  | greyed when no screenshot                                                              | `!s`         |

### Words

| Where           | Text                                                    |
| --------------- | ------------------------------------------------------- |
| grid, empty     | "No screenshots yet. Capture one with ⌃⇧4."             |
| Document, empty | "This session is empty. Capture a screenshot with ⌃⇧4." |
| tooltips        | see microcopy.md                                        |

### Components

| Region      | Component        | Status | Notes             |
| ----------- | ---------------- | ------ | ----------------- |
| header, bar | existing buttons | have   | `title` text only |
