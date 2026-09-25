---
type: ux-audit-briefing
status: approved — the owner approved it with the audit facts in Plannotator, 2026-09-25
created: 2026-09-25
build: main at v0.2.0
---

# Snapmark UX audit: briefing

The one brief every audit agent gets. The audit documents; it never changes the app, the owner's
sessions, the owner's settings or the owner's screen.

## 1. Deliverables, in order

1. **Findings** — `docs/ux/audits/2026-09-25/findings.md`. Uncapped, one problem per entry, in
   the shared finding format, grouped by screen and then app-wide. Written before anything else.
2. **Sitemap** — `docs/ux/sitemap.md`: "As built" checked, "Proposed" filled in.
3. **Glossary proposal** — `docs/ux/glossary-proposal.md`: every term × every place it appears.
4. **Proposed interaction guidelines** — `docs/ux/interaction-guidelines.md`: principles, one rule
   per applicable rule area (every rule `status: proposed`), the flows, the exceptions and the
   enforcement map.
5. **Older UX documents** — none exist; nothing to mark superseded.

The decision page comes after you have read the findings (`ux:decision`), not in this audit.

## 2. The owner's words this audit answers

Every request below is re-checked on screen (check C15): met · partly · not met.

**The main scene**

> "Basically reviewing the designs, doing a complete UX/UI review of an overnight build, providing detailed feedback on different elements. I want to be able to draw inside the screenshots, also copy and paste stuff around, and work." — 2026-09-25

**Purpose and output**

> "I need a tool where I can create screenshots and augment them: draw on them · add crosses for a cross through · add nodes · put in references" — 2026-09-25

> "For instance mark something on the screen and then be able to write something in a Markdown doc where it puts the image automatically in the Markdown doc." — 2026-09-25

> "It's basically for providing feedback to AI in a nice and token-efficient way." — 2026-09-25

**Sessions**

> "It needs to be some sort of project or session. If there's an existing session I just add to the existing session or I create a new session." — 2026-09-25

> "I also wonder: where do I access the session? Is this in the toolbar of my Mac? Is this where I am supposed to see it or where would I see that?" — 2026-09-25

**Shortcuts and speed**

> "This is also important: when I create, as I said, it needs to be shortcuts so I can just do this on the fly." — 2026-09-25

> "I want shortcuts, like just pressing 1, 2, 3, 4, 5 while I'm in the editor." — 2026-09-25

> "When I press the same button multiple times, let's say I have the 1 button, I would switch between the shapes and it would indicate it at the top." — 2026-09-25

**Marks**

> "Also again, we need more elements to be clear about what should go away and what should not." — 2026-09-25

**Editing on the screenshot**

> "Help me think about how we can highlight stuff and potentially add UI elements, like being able to add a card and write on the card, so I can actually edit on the screen and drag and drop, size, and so on." — 2026-09-25

> "Another thing that would be nice is if I can cut out things and move them and then wherever I move the cut-out, it indicates this with an arrow or something" — 2026-09-25

> "In an ideal world I would like it to be like Photoshop, where you have this magic select, magic lasso, or magic select thing. Automatically it selects an element and I can increase the width or height or anything, with the text staying where it is. […] that would be super nice but not necessary. I think it would be more like being able to draw on top of it with low-fidelity elements, like select." — 2026-09-25

> "That is different UI control elements, like having a palette of very, very usual and simple UI control elements, analogue to what I would have in, let's say, materialui.com. Not as comprehensive, but basic sets and maybe shapes" — 2026-09-25

**Sharing and platform**

> "Also I wonder what the best way of making this portable is: being able to share this as a PDF or zip it, maybe both. Having it in the cloud." — 2026-09-25

> "It should work on Mac OS mainly and may also boot up on startup with options but that's secondary." — 2026-09-25

The full, grouped list is `docs/ux/owner-words.md`.

## 3. Scope

- **Build:** `main` at v0.2.0. No open pull requests.
- **Screens and states:** every row of the "Screens and states" table in `docs/ux/setup.md`:
  menu bar menu, capture overlay, editor window, notifications, sessions folder dialog,
  `session.md`, PDF export, ZIP export, first run.
- **Scenes:** every finding and flow names the scene it hurts: reviewing an overnight build,
  sharing with a person, or a quick verdict.
- **Window sizes:** the editor at its 1180 × 600 minimum, 1440 and 1920 wide; Retina (2×) and 1×;
  light and dark system appearance.
- **How screens are captured:** the editor runs on the mock page from `test/smoke.ts` via the
  smoke harness, with `SNAPMARK_ROOT` set to a temp folder. The menu bar menu, capture overlay,
  notifications and native dialogs cannot be driven by a script: evaluate them from
  `src/main.ts` and mark those findings "read in the code".
- **Safety, binding for every agent:**
  - Never write to `~/Documents/Snapmark/`, `~/Library/Application Support/snapmark/`, the login
    items, or the clipboard.
  - Never capture the owner's real screen. Never press the global shortcuts.
  - Write only to temp folders and to the audit's scratch folder.

## 4. The checks

- **C1–C19** from `ux:audit`, adapted to Snapmark:
  - C5 is the path capture → editor → `session.md` → back to the next capture.
  - C8 covers the two lists that exist: Switch session, and References in the editor.
  - C10 covers the editor and the Markdown entry: what each shows, and what a user would want to
    show or hide.
  - C18 compares against the owner's own tools: macOS Screenshot markup, Figma, Ocra (as the
    owner wrote it), Xnapper.
- **Every lens** in `lenses.md`: Nielsen, Shneiderman, the 30 Laws of UX, Maze, the six plain
  questions, writing and vocabulary.
- **Every point of `checklist.md`,** adapted to a macOS desktop app.
- **Every rule area** in `rule-areas.md`. Three are not applicable: search and filters, media
  playback, and connection to external systems. They're checked only to confirm they still
  don't apply, since the Chrome extension is planned.
- **Every flow:** the minimum set in `rule-areas.md` that applies, plus the ten Snapmark flows in
  `setup.md`.
- **Output for AI, as its own check.** Is `session.md` precise and cheap for an agent to act on?
  - Does every note map to exactly one mark?
  - Can an agent tell remove from approve, a card from a marker, and a move from a mark, from the
    text alone?
  - Is the image size right?
  - What does a real 10-shot review session cost, and what would make it cheaper?

## 5. The team

Eight agents, all started together after the go. Each gets this briefing, a shared `common.md`,
its checks, the finding format and its own output file outside the repo.

| Agent                                       | Checks                                                                                                                                                                                  |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 Concepts and structure                    | C1–C4, C18. After everyone else has finished: the proposed guidelines, flows, enforcement map and proposed sitemap                                                                      |
| 2 Navigation, layout, surfaces, states      | C5, C6, C9, C16; rule areas: navigation, side panels, dialogs and menus, feedback, progress, local work and external writes, remembered state, first run and help, motion               |
| 3 Controls, lists, visual, sizes            | C7, C8, C10, C13, C14; rule areas: editing, saving, confirmation and undo, lists and selection, forms, undo across the app, copy and paste, drag and drop; plus the output-for-AI check |
| 4 Words, vocabulary, keys, earlier requests | C11, C12, C15, C17; rule areas: keyboard and focus, platform conventions; the glossary proposal                                                                                         |
| 5 Accessibility                             | WCAG 2.2 on the editor and the menu, keyboard-only use of every tool, contrast of every mark colour                                                                                     |
| 6, 7 Independent evaluators                 | Every lens on the whole app, without seeing anyone else's notes                                                                                                                         |
| 8 Independent evaluator: Codex              | The same, run through the Codex CLI. If it cannot launch the app, it evaluates the code and says so first                                                                               |

Evaluators 6, 7 and 8 never see each other's notes, or anyone's findings, until all three have
submitted.

## 6. The finding format

Every finding follows `references/finding-format.md`. In short:

- **What goes wrong, and for whom,** with the exact words on screen.
- **An annotated screenshot,** plus a labelled "Proposal" mockup when layout or behaviour
  should change.
- **The recommendation and its tradeoff.**
- **One plain question for you,** or "routine fix".
- **Whether it was seen on screen, read in the code, or assumed.**
- **Your earlier words, quoted.**

There's no cap on the number of findings. Codes, file paths and numbers stay in the supporting
notes.
