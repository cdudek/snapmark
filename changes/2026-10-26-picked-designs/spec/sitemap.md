# Snapmark sitemap: change 2026-10-26-picked-designs

Written by `omr-ux:sitemap-create diff`, scoped to this change. The whole-app `docs/ux/sitemap.md` (v0.9.0) is not touched now. The PR that builds each milestone updates it.

**Result: no address moves; places are added and entries change.** Snapmark is an Electron menu bar app. Its places are panels, windows, menus and global keys, none with an address. So there are no redirects. The one "moved address" is a global key: ⌃⇧4, ⌃⇧3 and ⌃⇧5's neighbours change meaning (see Keys that change).

## As built

Read from `snapmark-app/src/` on `milestone/picked-designs-1` at `2bde678` (2026-10-26). One locale (en). Only the places this change touches.

### Places in scope

| Place                   | Label (en)                                               | Type     | Tabs -> header primary                                   | Reached from                                       | Source                                           |
| ----------------------- | -------------------------------------------------------- | -------- | -------------------------------------------------------- | -------------------------------------------------- | ------------------------------------------------ |
| Global keys             | ⌃⇧4, ⌃⇧3, ⌃⇧5, ⌃⇧N                                       | entry    | - -> none                                                | any app                                            | `src/keys.ts:6-11`, `src/main.ts:1300`           |
| Menu bar: capture rows  | Capture Screenshot…, Capture Last Area, Capture Options… | menu     | - -> none                                                | menu bar icon                                      | `src/menu.ts:98-105`                             |
| Capture bar             | "Capture Options" (window title)                         | panel    | - -> Capture                                             | ⌃⇧5; Capture Options…                              | `src/main.ts:319`, `src/bar.html:104-140`        |
| Capture bar hover label | name and key                                             | panel    | - -> none                                                | pointer rest, key focus                            | `src/tip.html`, `src/bar.ts:13-26`               |
| Area picker             | hint                                                     | panel    | - -> none                                                | ⌃⇧3 first time; bar New Area, Last Area, Scrolling | `src/main.ts:258`, `src/area.html`               |
| Timer (menu bar digits) | seconds beside the icon                                  | status   | - -> none                                                | bar Options ▸ Timer                                | `src/main.ts:237-254`                            |
| Scrolling control       | "Scroll down, then Done"                                 | panel    | - -> Done                                                | bar Scrolling                                      | `src/main.ts:507-532`, `src/scroll.html`         |
| Editor                  | "Snapmark — <session>"                                   | record   | - -> Add to session / Copy Image                         | every capture; Edit Again; Reopen Discarded        | `src/main.ts:571`, `src/editor.html:678-762`     |
| Editor session menu     | 10 sessions, New Session                                 | menu     | - -> none                                                | editor session label                               | `src/main.ts:677-693`, `src/menu.ts:196-212`     |
| Session window          | "<session> — Snapmark"                                   | record   | Document; Screenshots; Discarded -> Open in Markdown App | Open Current Session; notifications                | `src/main.ts:838-855`, `src/viewer.html:501-506` |
| Settings ▸ Capture      | Capture                                                  | settings | General; Capture; Shortcuts -> none                      | Settings…, ⌘,                                      | `src/main.ts:1181`, `src/settings.html:139-179`  |
| Keyboard Shortcuts      | Keyboard Shortcuts                                       | settings | - -> none                                                | ⌘/                                                 | `src/main.ts:1171`, `src/keys.ts:13-72`          |

**Redirects:** none (no addresses).

### Error pages

| Where | What it shows | Way back |
| ----- | ------------- | -------- |
| none  | —             | —        |

## E-mail and external links

| Mail, notification or link     | Leads to                | Source                |
| ------------------------------ | ----------------------- | --------------------- |
| "Capture failed…" notification | tries the capture again | `src/main.ts:193-198` |

## Proposed

**Status: proposed, 2026-10-26.** Nothing here is accepted until the plan gate approves it.

### The principles it rests on

| Principle                                 | What it forces here                                                     |
| ----------------------------------------- | ----------------------------------------------------------------------- |
| Jakob's Law: macOS's digits (A4, KEY-1)   | ⌃⇧1, ⌃⇧3, ⌃⇧4, ⌃⇧5 mean what A4 lists; ⌃⇧2 for One-Shot                 |
| Visibility: One-Shot must be found (A4)   | One-Shot gets a menu row, a key, and a segment in bar and editor        |
| Von Restorff: one blue next move (A2, A3) | Capture, Done and the editor's primary are the only blue fills          |
| CAP-2: never in the picture               | Countdown and recording control are content-protected, outside the area |

### Places added

| Place                     | Label (en)              | Type   | Header primary | Reached from                    | Why                    |
| ------------------------- | ----------------------- | ------ | -------------- | ------------------------------- | ---------------------- |
| Countdown overlay         | "3" · "Esc cancels"     | panel  | none           | bar Record; any bar Timer       | J5, A6                 |
| Recording control         | "0:07 of 0:30 · 10 fps" | panel  | Done           | countdown, in Record            | J5, A8                 |
| Recording editor          | "Snapmark — <session>"  | record | Add to Session | Done; Edit Again on a recording | J6, A11                |
| Session pop-up in the bar | "<session> (<n>)"       | menu   | none           | capture bar                     | J4, A6, 02-bold shot 1 |

### Places removed

| Place                   | Why                                                     |
| ----------------------- | ------------------------------------------------------- |
| Capture bar hover label | Every bar control shows its name and key (Q3, answered) |
| Options ▸ Save to       | The segmented control shows it                          |

### Pages whose content changes

| Page                   | Change                                                                                                                                                                          | Why                |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| Menu bar: capture rows | Five rows: Capture Last Area ⌃⇧4, Capture New Area… ⌃⇧1, Capture Full Screen ⌃⇧3, Capture One-Shot… ⌃⇧2, Capture Options… ⌃⇧5. While busy, a click on the icon stops or cancels | A4, Q9, Q11        |
| Capture bar            | Two rows; headline; modes 1–6 matching the global digits; Session \| One-Shot; pop-up; blue Capture ↩                                                                           | A1–A3, A6, A10, Q8 |
| Scrolling control      | Scrolls by itself; manual fallback; Esc hint instead of a Cancel button                                                                                                         | A2, A3             |
| Editor toolbar         | Session \| One-Shot and a session pop-up replace the session label                                                                                                              | A12                |
| Editor session menu    | Counts in brackets; Older Sessions…                                                                                                                                             | A6, A12            |
| Editor notes column    | Spacing; hairline above References                                                                                                                                              | A7                 |
| Session window         | 90 % first size, remembered; recording entries with Play                                                                                                                        | A8, A9             |
| Settings ▸ Capture     | Capture Scrolling permission row                                                                                                                                                | A3, J7             |
| Keyboard Shortcuts     | New rows for ⌃⇧1, ⌃⇧2, ⌃⇧3, 1–6, ⌥O, ⇧⌘O, ⇧⌘P, ⇧⌘F, Space                                                                                                                       | KEY-6              |

## Changes from as built

| #   | Change                                                                       | Why (job story, law, owner's words, finding)                            | Findings      |
| --- | ---------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ------------- |
| 1   | ⌃⇧4 means Capture Last Area (was Capture Screenshot…, the macOS overlay)     | J3; A4 "if area set just capture selected area"                         | none          |
| 2   | ⌃⇧3 means Capture Full Screen, every display at once (was Capture Last Area) | J3; A4; owner: "⌃⇧3 should just capture the full screen, like the mac." | none          |
| 3   | ⌃⇧1 Capture New Area… added: sets the area and captures                      | J3; A4 "Set new Area"; Q11                                              | none          |
| 4   | ⌃⇧2 Capture One-Shot… added; carries the macOS overlay (drag)                | A4 "where do I [get] to the non-session mode?"; Q1                      | none          |
| 9   | Bar mode 3 Full Screen added; bar digits match the global ones               | Q8                                                                      | none          |
| 5   | Menu row "Capture Screenshot…" removed                                       | ⌃⇧4 no longer opens the overlay                                         | none          |
| 6   | Countdown overlay, recording control, recording editor added                 | J5, J6; A6, A8, A11                                                     | none          |
| 7   | Capture bar hover label removed                                              | names on screen                                                         | Q3 (answered) |
| 8   | Editor session label becomes Session \| One-Shot plus a pop-up               | J4; A12                                                                 | none          |

## Keys that change

A key is Snapmark's only "address". Each change is said once, in the Keyboard Shortcuts window and the menu.

| Old key | Old meaning         | New meaning           | Carries                                      |
| ------- | ------------------- | --------------------- | -------------------------------------------- |
| ⌃⇧4     | Capture Screenshot… | Capture Last Area     | the overlay moves to ⌃⇧2 (One-Shot)          |
| ⌃⇧3     | Capture Last Area   | Capture Full Screen   | the last area moves to ⌃⇧4; the area is kept |
| —       | —                   | ⌃⇧1 Capture New Area… | —                                            |
| —       | —                   | ⌃⇧2 Capture One-Shot… | —                                            |

## Redirects

None: no address moves.

| Old address | New address | Carries |
| ----------- | ----------- | ------- |
| none        | —           | —       |

## E-mail links that change

None. The "Capture failed…" notification retries whatever key or row started it.

## Checks

Returned to `omr-ux:design`.

| Id    | Result                                                                                                                                                                            |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SM-1  | pass: every new panel exits by Esc, Done or the editor's commit                                                                                                                   |
| SM-2  | pass: each new place is reached from the bar or a key                                                                                                                             |
| SM-3  | finding, Low: the recording editor has one way in from a new capture (Done). Edit Again is the second. Accepted                                                                   |
| SM-4  | pass after the rename: "Capture Area" (pick) and "Capture Last Area" would have named one place two ways; "New Area" fixes it                                                     |
| SM-5  | pass                                                                                                                                                                              |
| SM-6  | n/a: no addresses                                                                                                                                                                 |
| SM-7  | pass: "Capture Last Area" in menu, keys window and bar headline                                                                                                                   |
| SM-8  | pass: each panel names its primary (Capture, Done, Add to Session) or none                                                                                                        |
| SM-9  | n/a                                                                                                                                                                               |
| SM-10 | n/a                                                                                                                                                                               |
| SM-11 | finding, Medium: two keys change meaning (⌃⇧3, ⌃⇧4). No redirect is possible. Muscle memory breaks once, as in the 2026-10-25 key change. Said in the menu and Keyboard Shortcuts |
| SM-12 | pass                                                                                                                                                                              |
