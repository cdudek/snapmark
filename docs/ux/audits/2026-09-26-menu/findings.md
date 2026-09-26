# Menu bar menu audit, 2026-09-26

**Scope:** the menu bar menu of v0.3.0/v0.4.0 as the owner saw it (screenshot, 2026-09-26), read against `src/menu.ts`.
**Method, scaled down on purpose:** one evaluator (Claude) through Nielsen's heuristics, the Laws of UX and macOS menu conventions, instead of the full eight-agent audit. The owner asked to audit and implement; the surface is one menu of 20 items.
**Owner's words (2026-09-26):** "the menu is still fucking the bows, and there are so many submenus and everything, and the language is shit. Can you fucking audit this and implement the recommendations? I want easy language and it to follow the laws of ux. also the menu is fucking verbose". "the bows" could not be read with confidence.

## As built

```
Snapmark                                       (grey header)
Capture region                         ⇧⌘1
New session                            ⇧⌘2
─────────
Current session: 26 Sep 08.43 · 0 screenshots  (grey header)
Copy prompt for AI
Copy file path
Open feedback file
Show in Finder
Rename session…
Export                                  ▸  (disabled: no screenshots)
─────────
Switch session                          ▸  each session ▸ Make current / Copy prompt for AI / Export ▸ / Show in Finder
Settings                                ▸  Open at login / Sessions are saved in ~/Documents/Snapmark /
                                            Change where sessions are saved… / Keyboard shortcuts… /
                                            Check for updates… / Version 0.3.0
Quit Snapmark                          ⌘Q
```

20 labels at the top two levels, 3 submenus, menus nested 3 deep, 2 grey headers.

## Findings

| #   | Finding                                                                                                                                                            | Impact | Law or heuristic                                                                                             |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------ | ------------------------------------------------------------------------------------------------------------ |
| M01 | Twelve top-level lines for a job that is mostly "capture, then hand to the AI"; every open of the menu reads past items used once a month (Rename, Show in Finder) | High   | Hick's law, choice overload, Nielsen 8                                                                       |
| M02 | Sessions are reached three levels deep (Switch session ▸ session ▸ Export ▸); submenus that open submenus are slow and easy to lose with the pointer               | High   | Fitts's law, Nielsen 7                                                                                       |
| M03 | "New session" sits with capture, "Switch session" and "Rename session…" sit elsewhere: one object (session) is split across three groups                           | Medium | Law of proximity, chunking                                                                                   |
| M04 | Labels carry words the context already gives: "Capture region", "Rename session…", "Current session: …", "Quit Snapmark"; the menu reads long                      | Medium | Nielsen 8, Occam's razor                                                                                     |
| M05 | "Open feedback file" invents a term the app uses nowhere else; the file is the session                                                                             | Medium | Nielsen 2 and 4 (one vocabulary)                                                                             |
| M06 | "Copy prompt for AI" and "Copy file path" say how, not what you get: the owner pastes "the session" into an agent either way                                       | Low    | Nielsen 2                                                                                                    |
| M07 | Two grey headers look like disabled items; the "Snapmark" header repeats what the menu bar icon already says                                                       | Medium | Nielsen 8, aesthetic-usability; conflicts with the owner's 2026-09-25 request that the menu "say what it is" |
| M08 | "26 Sep 08.43 · 0 screenshots": the count is noise when it is 0 and the date format is not a name                                                                  | Low    | Nielsen 8                                                                                                    |
| M09 | A disabled "Export ▸" is shown on an empty session: a dead item with an arrow                                                                                      | Low    | Nielsen 8, error prevention done as clutter                                                                  |
| M10 | Settings is a submenu of six lines, one a sentence ("Sessions are saved in ~/Documents/Snapmark") and one a disabled version number                                | Medium | Choice overload, Nielsen 8                                                                                   |
| M11 | "Keyboard shortcuts…" is help, not a setting                                                                                                                       | Low    | Nielsen 10, Jakob's law (Help belongs under Help or About)                                                   |
| M12 | Sentence case ("Check for updates…") where macOS menus use title case ("Check for Updates…")                                                                       | Low    | Jakob's law, Nielsen 4                                                                                       |
| M13 | "Check for updates…" is a first-level concern of a rarely used action, now that updates install by themselves                                                      | Low    | Nielsen 8                                                                                                    |
| M14 | The session's actions are not grouped by frequency: "Copy prompt for AI" (every review) sits beside "Rename session…" (rarely)                                     | Medium | Serial position effect, Pareto                                                                               |

## Proposed menu

```
Capture                                ⇧⌘1
─────────
Checkout review · 3                          the current session, as a header ("· 3" only when not empty)
Copy for AI                                  prompt + path of the current session
Copy Path                                    only the path
Open                                         session.md in your Markdown app
Export                                  ▸  PDF · ZIP                 (hidden while empty)
─────────
Sessions                                ▸  ✓ Checkout review · 25 Sep 14.02 · …   (click = switch)
                                            ─ · New Session ⇧⌘2 · Rename… · Show in Finder · Other…
Settings                                ▸  Open at Login ✓ · Sessions Folder… · Check for Updates…
Help                                    ▸  Keyboard Shortcuts · Snapmark 0.4.1
Quit                                   ⌘Q
```

Top level: 10 lines (from 12), 2 levels deep at most (from 3), 1 header (from 2), every label 1–2 words.

The two changes that reverse earlier owner decisions (2026-09-25): the per-session submenus go (M02), and the "Snapmark" header goes (M07).
