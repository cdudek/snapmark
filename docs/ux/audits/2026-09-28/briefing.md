---
type: ux-audit-briefing
status: approved — the owner said "go", 2026-09-28
created: 2026-09-28
build: main at v0.9.0
---

# Snapmark UX audit: briefing

The one brief every audit agent gets. The audit documents; it never changes the app, the owner's
sessions, the owner's settings or the owner's screen.

## 1. Deliverables, in order

1. **Findings:** `docs/ux/audits/2026-09-28/findings.md`. Uncapped, one problem per entry, in the
   shared finding format, grouped by screen and then app-wide. Written before anything else.
2. **Sitemap:** `docs/ux/sitemap.md`, "As built" at v0.9.0 and "Proposed".
3. **Glossary proposal:** `docs/ux/glossary-proposal.md`, every term × every place it appears.
4. **Proposed interaction guidelines:** `docs/ux/interaction-guidelines.md`, redrafted from this
   audit's evidence. Principles, one rule per applicable rule area (every rule
   `status: proposed`), the flows, the exceptions and the enforcement map.
5. **Older UX documents marked superseded** with a pointer, never deleted:
   `audits/2026-09-25/findings.md`, `audits/2026-09-26-menu/findings.md`,
   `decisions-2026-09-25-editor.md`, `decisions-2026-09-25-menu.md`. The decision log
   `decisions.md` stays as it is.

The decision page comes after the owner has read the findings (`ux:decision`), not in this audit.

## 2. The owner's words this audit answers

**Today's concerns.** Each one gets its own findings with a recommendation.

> "Also the new session is a very dangerous shortcut because it sits in between 1 and 2. I think overall, X-wise, it's also quite complicated in terms of what we have in the menu. I just wonder whether we need just "Copy session info" when it comes with the prompt and everything, and in the settings you select whether you want to have the prompt with it or without it. I think everything is not very intuitive. Can we analyse and audit it with a UX audit?" — 2026-09-28

> "When I take a screenshot it's going to the desktop but the actual window stays at the full screen browser. This is something we should fix." — 2026-09-28

> "Another thing is I wonder whether it would be possible to take a screenshot while scrolling down the area so we easily take a whole screenshot of everything and then concatenate it somehow. Is this possible without it being a Chrome extension or something? It's not important. This shouldn't be the default. We just want to maybe explore this." — 2026-09-28

> "How about a specific area? I will have the browser open and I will select and mark a certain area. For every screenshot that I take I may want to record the same area." — 2026-09-28

**The menu, earlier.**

> "The interface doesn't make sense. "Copy for AI," "Copy Paste," "Copy what?" It's not clear what's getting copied. […] A user doesn't understand: he clicks on buttons and he doesn't know what they mean" — 2026-09-26

> "Also the menu is still fucking the bows, and there are so many submenus and everything, and the language is shit. Can you fucking audit this and implement the recommendations? I want easy language and it to follow the laws of ux. also the menu is fucking verbose" — 2026-09-26

**Speed.**

> "This is also important: when I create, as I said, it needs to be shortcuts so I can just do this on the fly." — 2026-09-25

Every other request in `docs/ux/owner-words.md` is re-checked on screen (check C15): met · partly
· not met.

## 3. The four questions the findings must answer

1. **New Session on `⌃⇧2`.** What does a mis-press between `⌃⇧1` and `⌃⇧3` cost? Does New
   Session need a global shortcut at all, and if so, which one?
2. **The menu.** How many items, levels and decisions does it ask for, and which ones earn their
   place? Would one "Copy Session Info", with a Settings choice of with or without the prompt,
   replace Copy Prompt for AI and Copy session.md Path? Weigh it against the alternatives.
3. **Capturing from a full-screen app.** Where do the editor and the reviewer end up, during
   and after the edit, for Capture region and for Capture Same Area? Known so far: macOS shows the
   desktop while the editor window is not on the screen the reviewer looks at.
4. **"Not very intuitive."** Can a first-time user tell what each surface is for and what each
   control does without reading anything (the six plain questions, first run and help)?

**Exploration, not a finding:** a scrolling capture that stitches a long page, without a
browser extension. Covered by pattern research (C18): how the owner's tools and CleanShot X or
Shottr do it, what it would need in Snapmark (permissions, stitching, limits), as notes for a
later decision.

## 4. Scope

- **Build:** `main` at v0.9.0. No open pull requests.
- **Screens and states:** every row of the "Screens and states" table in `docs/ux/setup.md`:
  menu bar menu, capture region, area picker, Capture Same Area, editor, session window, Keyboard
  Shortcuts window, notifications, native dialogs, `session.md`, PDF and ZIP export, first run.
- **Scenes:** every finding and flow names the scene it hurts: reviewing an overnight build,
  sharing with a person, or a quick verdict.
- **Window sizes:** the editor at its 1180 × 600 minimum, 1440 and 1920 wide; the session window
  at 900 × 900 and smaller; Retina (2×) and 1×; light and dark.
- **How screens are captured:** the editor and the session window run on a mock page through a
  harness with `SNAPMARK_ROOT` set to a temp folder. The area picker is driven the way the smoke
  test does it. The menu bar menu, macOS's capture overlay, notifications, native dialogs and
  Spaces cannot be scripted: evaluate them from the code and the owner's reports, and mark those
  findings "read in the code".
- **Safety, binding for every agent:**
  - Never write to `~/Documents/Snapmark/`, `~/Library/Application Support/snapmark/`, the login
    items, or the clipboard.
  - Never capture the owner's real screen: no `screencapture`, never press `⌃⇧1`, `⌃⇧2` or `⌃⇧3`.
  - Never quit, restart or update the installed Snapmark.
  - Write only to temp folders and to the audit's scratch folder.

## 5. The checks

- **C1–C19** from `ux:audit`, adapted to Snapmark:
  - C3 includes the global shortcuts as entry points, next to the menu.
  - C5 is the path capture → editor → session → the next capture, including from a full-screen app.
  - C8 covers every list: Switch Session, References in the editor, the session window's
    screenshots.
  - C17 covers the global shortcuts (neighbours, mis-press cost, clashes with the apps the owner
    uses: Chrome, Figma) and every key in the editor and the session window.
  - C18 compares against the owner's own tools (macOS Screenshot, Figma, Ocra as written,
    Xnapper), plus CleanShot X and Shottr for the menu, Capture Same Area and scrolling capture.
- **Every lens** in `lenses.md`: Nielsen, Shneiderman, the 30 Laws of UX, Maze, the six plain
  questions, writing and vocabulary.
- **Every point of `checklist.md`,** adapted to a macOS desktop app.
- **Every rule area** in `rule-areas.md`. Two are not applicable: media playback (no media) and
  connection to external systems (none yet). Search and filters is checked for the session lists.
- **Every flow:** the minimum set in `rule-areas.md` that applies, the flows in `setup.md`, and
  three more: capture the same area ten times in a row; capture from a full-screen browser and
  come back to it; hand a session to an agent with the least steps.
- **Output for AI:** re-check that `session.md` is precise and cheap for an agent to act on.

## 6. The team

Eight agents, all started together after the go. Each gets this briefing, a shared `common.md`,
its checks, the finding format and its own output file outside the repo.

| Agent                                       | Checks                                                                                                                                                                                                 |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1 Concepts and structure                    | C1–C4, C18 and the scrolling-capture notes. After everyone else has finished: the proposed guidelines, flows, enforcement map and proposed sitemap                                                     |
| 2 Navigation, layout, surfaces, states      | C5, C6, C9, C16; rule areas: navigation, side panels, dialogs and menus, feedback, progress, local work and external writes, remembered state, first run and help, motion; the full-screen question    |
| 3 Controls, lists, visual, sizes            | C7, C8, C10, C13, C14; rule areas: editing, saving, confirmation and undo, lists and selection, forms, search and filters, undo across the app, copy and paste, drag and drop; the output-for-AI check |
| 4 Words, vocabulary, keys, earlier requests | C11, C12, C15, C17; rule areas: keyboard and focus, platform conventions; the glossary proposal; the New Session and Copy Session Info questions                                                       |
| 5 Accessibility                             | WCAG 2.2 on the editor, the session window, the area picker and the menu; keyboard-only use of every tool; contrast of every mark colour                                                               |
| 6, 7 Independent evaluators                 | Every lens on the whole app, without seeing anyone else's notes                                                                                                                                        |
| 8 Independent evaluator: Codex              | The same, through the Codex CLI. If it cannot launch the app, it evaluates the code and says so first                                                                                                  |

Evaluators 6, 7 and 8 never see each other's notes, or anyone's findings, until all three have
submitted.

## 7. The finding format

Every finding follows `references/finding-format.md`. In short:

- **What goes wrong, and for whom,** with the exact words on screen.
- **An annotated screenshot,** plus a labelled "Proposal" mockup when layout or behaviour
  should change.
- **The recommendation and its tradeoff.**
- **One plain question for the owner,** or "routine fix".
- **Whether it was seen on screen, read in the code, or assumed.**
- **The owner's earlier words, quoted.**

There's no cap on the number of findings. Codes, file paths and numbers stay in the supporting
notes.
