---
type: ux-audit-findings
status: merged — awaiting the owner's decisions
created: 2026-09-25
build: main at v0.2.0
sources: eight agents (1 concepts, 2 navigation and states, 3 controls and output for AI, 4 words and keys, 5 accessibility, 6 and 7 independent evaluators, 8 independent evaluator run through Codex, code-only)
---

# Snapmark UX audit: findings

## Summary

Snapmark v0.2.0 does its core loop: capture with ⌘⇧1, mark up with number keys, "Add to session", and a Markdown file with images that an agent can read. The eight agents found 190 distinct problems after exact duplicates were merged. Five are critical. Three ways out of the editor (⌘W, the Discard button and the window's close button) throw away a marked-up screenshot without asking. A failed save leaves a dead button with no message. Cut & move can bring back pixels that were redacted. The most common High findings are these. Pointing marks default to the same red that means "remove". Pressing a tool's key again switches tools, so the first 1 draws an ellipse and the second 5 makes a card. session.md never says in words what should go and what should stay, and does not number cards. Marks cannot be copied or pasted, which is the owner's own request. The canvas has no zoom and cannot be used from the keyboard. Sessions can't be named, and only 20 are reachable from the menu. The largest group of findings is words and feedback: four names for the numbered marker, no confirmation after saving or copying the prompt, raw error text, and no help inside the app. Of the owner's 26 requests, 12 are met, 11 are partly met (copy and paste of marks is the missing half of the main scene), 2 are not met (the UI palette, and the newly asked "copy the path to the session's Markdown"), and one is a list of tools with nothing to check.

## Counts by surface and impact

| Surface                | Critical |   High | Medium |    Low | Design choice |   Total |
| ---------------------- | -------: | -----: | -----: | -----: | ------------: | ------: |
| Editor window          |        5 |     13 |     49 |     38 |             9 |     114 |
| Menu bar menu          |        0 |      3 |     11 |      9 |             1 |      24 |
| Capture overlay        |        0 |      3 |      0 |      0 |             0 |       3 |
| Notifications          |        0 |      0 |      2 |      0 |             0 |       2 |
| Sessions folder dialog |        0 |      0 |      1 |      3 |             0 |       4 |
| session.md output      |        0 |      3 |      8 |     10 |             0 |      21 |
| PDF export             |        0 |      0 |      3 |      3 |             0 |       6 |
| ZIP export             |        0 |      0 |      1 |      1 |             0 |       2 |
| First run and install  |        0 |      1 |      2 |      0 |             0 |       3 |
| App-wide               |        0 |      1 |      5 |      5 |             0 |      11 |
| **Total**              |    **5** | **24** | **82** | **69** |        **10** | **190** |

Added after the audit, 2026-09-25: three menu bar menu findings from the owner's comment on the menu (F191–F193, all Medium), and four editor findings from the owner's comments on the editor (F194–F197: two Medium, two Low). The counts above are the audit's.

When agents gave the same merged problem different impacts, the merge keeps the highest one given. The supporting notes list every impact given.

## Counts by verified status

| Verified                | Findings |
| ----------------------- | -------: |
| seen on screen          |      105 |
| read in the code        |       78 |
| assumption, not checked |        6 |
| owner's preference      |        1 |
| **Total**               |  **190** |

Counted by each finding's first evidence: "seen on screen" also covers findings that were read in the code as well.

## Build audited

`main` at v0.2.0 (the compiled `dist/`), no open pull requests. The editor ran on the mock "Acme Ops" page through the smoke harness. The menu, capture overlay, notifications, native dialogs, first run and exports were evaluated from the code.

## Checklist results

Merged from agents 2 (navigation), 3 (forms, window sizes, performance), 4 (content), 5 (accessibility) and 8 (the whole checklist, code-only). Where the code-only evaluator wrote "not checked" and another agent measured, the measurement is used. One contradiction was settled: "location on deep pages" is **partly**, not pass. The window's title is replaced by "Snapmark" when the page loads (seen on screen; `<title>` in the editor page).

| Area          | Point                                | Result                                                                                   | Evidence and findings                                                                                           |
| ------------- | ------------------------------------ | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Navigation    | Clear first screen                   | Fail                                                                                     | Nothing appears on first launch; the menu starts "Session: —" (F177, F127)                                      |
| Navigation    | Predictable menu, 7±2                | Partly                                                                                   | 13 active items plus 3 information lines, in sensible groups                                                    |
| Navigation    | Location on deep pages               | Partly                                                                                   | Faint "→ session" in the editor; window title lost (F070, F069)                                                 |
| Navigation    | Search where content is heavy        | Not applicable                                                                           | No content-heavy list; the 20-session list may need it later (F117)                                             |
| Navigation    | Home goes home                       | Partly                                                                                   | The menu bar icon is always there, but open editors cannot be reached from it (F181)                            |
| Navigation    | Two paths to main screens            | Fail                                                                                     | session.md only from the menu; older sessions only from Finder (F044, F117)                                     |
| Navigation    | Useful status area                   | Fail                                                                                     | No save or export result, no session count (F020, F129)                                                         |
| Navigation    | Helpful not-found                    | Fail                                                                                     | A missing session.md or folder fails silently (F125, F126, F133)                                                |
| Forms         | Visible labels                       | Fail                                                                                     | Note fields rely on the placeholder (F064)                                                                      |
| Forms         | Required fields marked               | Not applicable                                                                           | Nothing is required                                                                                             |
| Forms         | Specific errors                      | Fail                                                                                     | A failed save shows nothing; export errors are raw (F004, F143)                                                 |
| Forms         | Validation before submit             | Fail (minor)                                                                             | Empty notes are not flagged (F085)                                                                              |
| Forms         | Data kept after an error             | Partly                                                                                   | The window stays open on failure but cannot retry (F004)                                                        |
| Forms         | Right input type                     | Pass                                                                                     | Native colour well, text areas, native folder picker                                                            |
| Forms         | Autofill or suggestions              | Not applicable                                                                           | Free-text feedback                                                                                              |
| Forms         | Clear primary button                 | Pass                                                                                     | "Add to session" is filled and bold; Discard sits next to it at the same size (F091)                            |
| Accessibility | Text contrast 4.5:1                  | Fail                                                                                     | Pressed Tick and Highlight labels, pressed key digits, placeholders (F054, F055, F095, F096)                    |
| Accessibility | Control contrast 3:1                 | Fail                                                                                     | Field and button edges 1.27:1 (F065)                                                                            |
| Accessibility | Targets 24 × 24                      | Fail for canvas handles; pass for every button                                           | F017                                                                                                            |
| Accessibility | Full keyboard operation              | Fail                                                                                     | No keyboard placement, selection or capture (F014, F015, F141)                                                  |
| Accessibility | Visible focus                        | Partly                                                                                   | The focus ring is visible (seen), but focus is lost after a tool change (F052)                                  |
| Accessibility | Image alternatives                   | Fail                                                                                     | Canvas unnamed; alt text generic (F016, F158)                                                                   |
| Accessibility | Language declared                    | Fail                                                                                     | Editor and PDF (F099, F174)                                                                                     |
| Accessibility | No colour-only meaning               | Pass on the image (shapes differ); fail in the text                                      | Remove and approve are absent from session.md (F148); red is also the default for pointing marks (F012)         |
| Accessibility | Captions                             | Not applicable                                                                           | No video                                                                                                        |
| Accessibility | Skip link or equivalent              | Not applicable                                                                           | Three regions, Tab reaches the side panel in about 10 stops; the canvas gap is covered by the keyboard findings |
| Window sizes  | Viewport meta                        | Not applicable                                                                           | Desktop Electron window                                                                                         |
| Window sizes  | Readable text                        | Pass                                                                                     | 13 px interface text at every size                                                                              |
| Window sizes  | No horizontal scroll                 | Fail below 1180 px                                                                       | The minimum is not enforced (F042)                                                                              |
| Window sizes  | Standard gestures                    | Fail                                                                                     | No pinch or ⌘+ zoom, no arrow-key nudge (F018, F063)                                                            |
| Window sizes  | Inputs suited to the device          | Pass                                                                                     | Pointer drawing plus keys                                                                                       |
| Window sizes  | Every supported size                 | Pass at 1180, 1440 and 1920, 1× and 2×, light and dark; fail below 1180 and at 200% zoom | F042, F061                                                                                                      |
| Window sizes  | Critical controls within reach       | Partly                                                                                   | "Add to session" scrolls away with about ten markers (F039)                                                     |
| Performance   | Time to first usable screen          | Pass                                                                                     | About 100 ms to first paint after load (measured twice on the mock)                                             |
| Performance   | Largest paint                        | Pass                                                                                     | Screenshot ready well under 500 ms                                                                              |
| Performance   | Layout shift                         | Fail (minor)                                                                             | Toolbar buttons change width when cycling (F078)                                                                |
| Performance   | Images optimised                     | Partly                                                                                   | Capped at the model's limits; no smaller option (F156)                                                          |
| Performance   | Fonts                                | Pass                                                                                     | System fonts only                                                                                               |
| Performance   | No console errors                    | Pass                                                                                     | Only "fabric WebGL: max texture size 16384"                                                                     |
| Performance   | HTTPS                                | Not applicable                                                                           | Local files; update check only                                                                                  |
| Performance   | Semantic structure                   | Pass, with a caveat                                                                      | Header, main and aside present; no headings in the editor                                                       |
| Content       | Descriptive headings                 | Partly                                                                                   | "References" holds notes; entry headings are number and time (F185, F163)                                       |
| Content       | Buttons name their action            | Partly                                                                                   | "Discard" names no object (F090)                                                                                |
| Content       | Scannable text                       | Pass                                                                                     | Short labels; the prompt is three sentences                                                                     |
| Content       | No typos                             | Pass                                                                                     | "Select: Select" is a duplicate, not a typo (F092)                                                              |
| Content       | One tone                             | Fail                                                                                     | Two notifications use code words (F142, F143)                                                                   |
| Content       | Helpful empty states                 | Fail                                                                                     | The one hint can be wrong; "Session: —" (F023, F127)                                                            |
| Content       | Confirmation after important actions | Fail                                                                                     | Save, copy prompt and update check are silent; discard never confirms (F020, F118, F123, F001)                  |
| Content       | Privacy and terms                    | Not applicable                                                                           | Local-only, no account                                                                                          |

## The owner's earlier requests

One row per quote in the owner's-words file. Every quote dates from 2026-09-25. The last request (copying the path) was added after the agents started and was checked in the code at the merge.

| Owner's words                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Verdict           | What is there now                                                                                                                                                   | Findings                                             |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| "I need a tool where I can create screenshots and augment them: draw on them · add crosses for a cross through · add nodes · put in references"                                                                                                                                                                                                                                                                                                                                                | Met               | ⌘⇧1 capture; pen, box, ellipse, arrow; Cross and Crossed box; numbered markers with a References list ("nodes" read as markers)                                     | F185                                                 |
| "For instance mark something on the screen and then be able to write something in a Markdown doc where it puts the image automatically in the Markdown doc."                                                                                                                                                                                                                                                                                                                                   | Met               | "Add to session" appends the image and the notes to session.md                                                                                                      | F155                                                 |
| "Also in a nutshell, it should then create a Markdown document including the images."                                                                                                                                                                                                                                                                                                                                                                                                          | Met               | session.md plus img/NNN.png per session                                                                                                                             | —                                                    |
| "It's basically for providing feedback to AI in a nice and token-efficient way."                                                                                                                                                                                                                                                                                                                                                                                                               | Partly            | Images capped at the model's limits; the prompt explains some marks. Remove, approve, card targets and moves are not in the text; images are 96% of the cost        | F148, F149, F151, F152, F150, F154, F156, F119, F159 |
| "It needs to be some sort of project or session. If there's an existing session I just add to the existing session or I create a new session."                                                                                                                                                                                                                                                                                                                                                 | Partly            | New session ⌘⇧2 and Switch session work; sessions carry only timestamps, only 20 are reachable, open editors keep their old session                                 | F116, F117, F021, F043                               |
| "First I want to have the functionality that when I create a new session it creates Markdown. I can add screenshots to the Markdown and augment the Markdown: draw into the image, comment on it, and add a reference with text on certain elements, pretty much that."                                                                                                                                                                                                                        | Met               | New session writes session.md at once; comment, marker notes and cards exist                                                                                        | F184, F132                                           |
| "I also wonder: where do I access the session? Is this in the toolbar of my Mac? Is this where I am supposed to see it or where would I see that?"                                                                                                                                                                                                                                                                                                                                             | Partly            | Menu bar menu: "Session: X", Open session.md, Show session folder. The editor shows only a faint "→ X"; no count, no first-run hint, no view of earlier screenshots | F013, F044, F177, F129, F137                         |
| "This is also important: when I create, as I said, it needs to be shortcuts so I can just do this on the fly."                                                                                                                                                                                                                                                                                                                                                                                 | Partly            | Global ⌘⇧1/⌘⇧2 and tool keys exist; shortcuts cannot be changed, a clash is reported once, tool keys stop after a marker, no keyboard placement, ⌘W loses work      | F183, F142, F022, F014, F001                         |
| "I want shortcuts, like just pressing 1, 2, 3, 4, 5 while I'm in the editor."                                                                                                                                                                                                                                                                                                                                                                                                                  | Met               | Keys 1–7 and V pick tools (seen)                                                                                                                                    | F009, F008                                           |
| "When I press the same button multiple times, let's say I have the 1 button, I would switch between the shapes and it would indicate it at the top."                                                                                                                                                                                                                                                                                                                                           | Met               | Cycling works and the button shows the tool name and dots (seen); it also traps the first 1 and the second 5                                                        | F009, F008, F023, F024                               |
| "Also I want to have different shapes."                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Met               | Box, ellipse, arrow, pen, cross, crossed box, hatched area, tick, thumbs up, highlighter, spotlight                                                                 | —                                                    |
| "Also again, we need more elements to be clear about what should go away and what should not. Maybe: an X in a box or in a square with lots of X's in it · a tick for approving, or kind of like a thumbs up or something for approval in green"                                                                                                                                                                                                                                               | Partly            | Crossed box, hatched area, tick and thumbs up in fixed colours (seen). Red is not reserved for remove, and session.md does not say what goes and what stays         | F012, F027, F148, F024                               |
| "Help me think about how we can highlight stuff and potentially add UI elements, like being able to add a card and write on the card, so I can actually edit on the screen and drag and drop, size, and so on."                                                                                                                                                                                                                                                                                | Partly            | Highlighter, spotlight, cards with pointers, move and resize with Select (seen). No UI elements; tiny handles; spotlights and the highlighter have defects          | F066, F017, F033, F035, F031                         |
| "Another thing that would be nice is if I can cut out things and move them and then wherever I move the cut-out, it indicates this with an arrow or something"                                                                                                                                                                                                                                                                                                                                 | Met               | Cut & move leaves a dashed outline and an arrow (seen). It can show redacted pixels, and moves are written only as a count                                          | F005, F152, F153                                     |
| "Also I wonder what the best way of making this portable is: being able to share this as a PDF or zip it, maybe both. Having it in the cloud."                                                                                                                                                                                                                                                                                                                                                 | Partly            | ZIP and PDF export (read in the code); cloud only by choosing a synced folder, which leaves old sessions behind; the PDF has no key to the marks                    | F144, F169, F121                                     |
| "It should work on Mac OS mainly and may also boot up on startup with options but that's secondary."                                                                                                                                                                                                                                                                                                                                                                                           | Partly            | macOS menu bar app with "Open at login"; no start-up options                                                                                                        | F139                                                 |
| "In its first version it should just work on screenshots. In a second version it should also work as a Chrome extension or something, which I connect to my desktop app."                                                                                                                                                                                                                                                                                                                      | Met for version 1 | Screenshots only; extension planned                                                                                                                                 | —                                                    |
| "If you would design an icon how would you design it? What other potential directions would you go in if you would make it rather abstract? I don't want to have it literal, like a scissor or something"                                                                                                                                                                                                                                                                                      | Met               | Abstract corner-and-dot icon                                                                                                                                        | —                                                    |
| "I added the app icon with a gradient and also added another icon for the menu bar so we have a nice icon there"                                                                                                                                                                                                                                                                                                                                                                               | Met               | Template tray icon tinted for light and dark (read in the code)                                                                                                     | —                                                    |
| "One thing, actually, from the menu item: I want to be able to copy and paste the path to the Markdown from the current session. I just paste it and then I can point the AI to it."                                                                                                                                                                                                                                                                                                           | Not met           | No "copy path" item; "Copy prompt for AI" puts the path inside a three-line prompt                                                                                  | F120, F118                                           |
| "I want to have: versioning · releases so it's downloadable · a DMG that's built and can be installed by dragging and dropping it to Applications · an auto-update · a proper README about what it does and what it's for"                                                                                                                                                                                                                                                                     | Partly            | Versioning, releases, DMG and README exist; auto-update cannot install until the app is signed; one README contradiction                                            | F178, F123, F190                                     |
| "defer delveoper-id to later. do the rest in the meantime"                                                                                                                                                                                                                                                                                                                                                                                                                                     | Met               | Deferred; the README explains the Open Anyway step                                                                                                                  | F179                                                 |
| "Basically reviewing the designs, doing a complete UX/UI review of an overnight build, providing detailed feedback on different elements. I want to be able to draw inside the screenshots, also copy and paste stuff around, and work."                                                                                                                                                                                                                                                       | Partly            | Drawing and many marks work; copy and paste of marks and images does not; closing loses work                                                                        | F011, F037, F001, F180, F018                         |
| "In an ideal world I would like it to be like Photoshop, where you have this magic select, magic lasso, or magic select thing. Automatically it selects an element and I can increase the width or height or anything, with the text staying where it is. It recognises different layers of it and there's a bit of intelligence, I guess, that would be super nice but not necessary. I think it would be more like being able to draw on top of it with low-fidelity elements, like select." | Partly            | Low-fidelity drawing and Select exist; no magic select (not required)                                                                                               | F108, F112                                           |
| "That is different UI control elements, like having a palette of very, very usual and simple UI control elements, analogue to what I would have in, let's say, materialui.com. Not as comprehensive, but basic sets and maybe shapes"                                                                                                                                                                                                                                                          | Not met           | Shapes and cards only                                                                                                                                               | F066, F067                                           |
| "MacOsScreenshot, Figma, Ocra, Xnapper"                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Not applicable    | A list of tools in use, used for comparison in the notes; "Ocra" could not be identified                                                                            | —                                                    |

Contradictions between agents' verdicts, settled from the evidence:

- "It needs to be some sort of project or session…": one agent said met and two said partly. It is **partly**, because of the 20-session limit and timestamp-only names (read in the code).
- "When I press the same button…": the agents said met, or met with a trap. It is **met**, and the trap is filed as a finding.
- "Another thing … cut out things": the code-only evaluator said partly. It is **met**, because the request itself works on screen. The redaction and move-text defects are filed separately.
- "It should work on Mac OS mainly … boot up on startup with options": verdicts were met, partly and implemented. It is **partly**: "Open at login" exists and there are no options.

## Did not run

- **Menu bar menu, capture overlay, notifications, native folder dialog, Finder reveal, updater, first run, DMG and Gatekeeper.** These are not scriptable, and the safety rules forbid them (no real screen capture, no global shortcuts, no login items, no clipboard writes). Every agent evaluated them from the code and the README, and marked those findings "read in the code".
- **The Codex evaluator was code-only.** Electron aborted (SIGABRT) in its sandbox, so it saw no screen. All 37 of its findings are read in the code. Some behaviours were exercised with the compiled functions and mocked dependencies: the save rejection, card clearing, delete and undo, and the Markdown serializer. It produced no annotated screenshots.
- **Closing the editor with ⌘W, the Discard button or the window's close button, and Quit.** One harness run proved ⌘W. The others would end the harness run and were read in the code.
- **Two editors at once.** The harness opens one window, so stacking and save order were read in the code.
- **Screen Recording permission missing, first run from the DMG, update available.** These cannot be reproduced without changing the owner's system settings or a release to point at.
- **Real exports.** No PDF or ZIP was opened or checked: pagination, tall images, PDF tags, archive contents. The PDF and ZIP findings come from the code.
- **A real multi-entry session.** The harness makes a new session folder per run. Ten runs were joined by hand into one ten-entry session.md for the token estimate; the real app appends to the active session.
- **Small and very large captures.** These were simulated in the page, because the harness always captures a 1200 × 700 mock. Real 5K text legibility was calculated, not seen.
- **Clipboard image paste, dropping a real file from Finder, the Electron default menu keys (⌘R, ⌥⌘I, ⌘Q), right-click menus, and Space or Enter on a focused button.** Synthetic events cannot trigger them. They are marked read in the code or assumption.
- **Esc inside a card being typed.** The synthetic Esc did not end editing, so the library's own handling is unconfirmed and not reported.
- **VoiceOver itself.** Names and roles come from Chromium's accessibility tree, and what VoiceOver says is inferred. Increase Contrast, Reduce Transparency and forced colours were not toggled. Colour-blindness was judged from luminance ratios and shapes, not simulated.
- **Real ⌘+ zoom.** 200% was set on the window from the harness. Whether a user can reach zoom was not tested.
- **Window sizes.** The accessibility and wording agents checked 1180 × 600 only. The navigation and controls agents covered 1440 and 1920, 1× and 2×, and dark mode. Evaluator 7 ran 1920 at 1× only.
- **Other apps' use of ⌘⇧1 and ⌘⇧2** on the owner's Mac was not checked, because pressing global shortcuts is forbidden.
- **Real agent token cost.** No receiving model was run; the cost is estimated from image sizes.
- **Ocra.** No product by that name could be identified. Xnapper claims come from its product page, not from using it. No live comparisons were made with any other product.
- **Postel's law probes.** Odd folder names, non-ASCII names and a full disk were not tried, apart from a read-only folder and a deleted session file.

# Findings

## Editor window

### F001 · ⌘W throws away the screenshot and every mark without asking

- **Impact:** Critical — anyone who presses ⌘W after marking up a screenshot loses every mark, note and the screenshot itself, with no warning and no way back.
- **Current experience:** One agent drew a cross, placed marker 1 and typed "important note", then pressed ⌘W: the window closed at once, nothing was written to the session, and the captured image was deleted from disk. On macOS ⌘W means "put this window away", and here it sits beside ⌘Z and ⌘↵, which people press all the time.
- **Visual:** No screenshot of a closed window can exist; the evidence is the harness result (two objects on the canvas, then the window destroyed, and an empty image folder) and `4-textkeys.png`. Proposal: a sheet "Discard this screenshot? 3 marks and 1 note will be lost. [Keep editing] [Discard]", shown only when something was drawn or typed; an untouched screenshot still closes at once.
- **Recommendation:** When the canvas, a note or the comment has changed, ask before closing, with "Keep editing" as the default. The fast path for a bad capture stays one key.
- **Tradeoff:** One more key press for a deliberate discard. The alternative is no question but a way to reopen the last discarded screenshot, which never interrupts but is more to build.
- **Decision needed:** Should leaving an editor that has marks ask first, or should discarding stay instant and become undoable instead?
- **Verified:** seen on screen (harness run: ⌘W after drawing closed the window, nothing saved, image gone) and read in the code.
- **Owner's words:** "Basically reviewing the designs, doing a complete UX/UI review of an overnight build, providing detailed feedback on different elements." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor window, ⌘W; build main v0.2.0
- Broken: Nielsen 3 (user control), Nielsen 5 (error prevention); Shneiderman "permit easy reversal"; Jakob's law (⌘W is "close", not "delete"); Zeigarnik effect; rule area saving and unsaved work
- Code: `src/editor.ts:613` (⌘W → `window.close()`, no dirty check), `src/main.ts:84` (image deleted on `closed`)
- Screenshots: 4-textkeys.png; steps `e2steps/cmdw.js`
- Other products: macOS Screenshot markup asks before throwing away edits; Xnapper keeps a capture history; Figma autosaves.
- Seen by: 2-01, 3-19, 4-03, 6-01, 7-01, 8-01 — seen by 3 of 3 independent evaluators. Impact given: Critical (2-01, 8-01), High (3-19, 4-03, 6-01, 7-01); the merge keeps the highest.
- Related: F002, F003, F007, F006

</details>

### F002 · The "Discard" button throws away every mark without asking

- **Impact:** Critical — a click on "Discard ⌘W" after minutes of marking loses the whole annotated screenshot, and it cannot be brought back.
- **Current experience:** "Discard ⌘W" sits beside "Add to session ⌘↵" at the foot of the side panel. Clicking it closes the window immediately; the captured image is deleted as the window closes.
- **Visual:** `6-a-discard.png` (the button, labelled), `7-review.png` (bottom right). Proposal: the same "Discard this screenshot and its 6 marks? · Keep editing · Discard" question as for ⌘W, only when there is something to lose.
- **Recommendation:** Route the button through the same check as ⌘W, so every way out behaves the same.
- **Tradeoff:** One extra click for a deliberate discard.
- **Decision needed:** Should the Discard button ask first when the screenshot has marks or text?
- **Verified:** read in the code; the button and its label seen on screen.
- **Owner's words:** "This is also important: when I create, as I said, it needs to be shortcuts so I can just do this on the fly." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor side panel, Discard button
- Broken: Nielsen 3, Nielsen 5; Shneiderman easy reversal
- Code: `src/editor.ts:630` (`cancel.onclick = () => window.close()`), `src/main.ts:84`
- Screenshots: 6-empty.png, 6-a-discard.png, 7-review.png, 3-empty-1180-light.png
- Seen by: 2-01, 3-19, 4-03, 6-01, 7-01, 8-01 — seen by 3 of 3 independent evaluators
- Related: F001, F091

</details>

### F003 · The window's red close button throws away every mark without asking

- **Impact:** Critical — closing the editor from its title bar loses all marks and the screenshot, the same as ⌘W, through a different door.
- **Current experience:** The editor window has no close handling. Clicking the red traffic light closes it at once and the temporary screenshot is deleted.
- **Visual:** No screenshot (the title bar is outside what the harness captures). Proposal: the same "Discard this screenshot?" sheet attached to the window.
- **Recommendation:** Route the close button through the same check as ⌘W and Discard.
- **Tradeoff:** Same as ⌘W: one more click for a deliberate close.
- **Decision needed:** Should the window's close button ask first when the screenshot has marks or text?
- **Verified:** read in the code.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor window title bar
- Broken: Nielsen 5; platform conventions (closing a window with unsaved work)
- Code: `src/main.ts:77-86` (no `close` or `beforeunload` handling), `src/main.ts:84`
- Seen by: 2-02, 3-19, 4-03, 6-01, 7-01, 8-01 — seen by 3 of 3 independent evaluators

</details>

### F004 · When saving fails, nothing is shown and "Add to session" goes dead

- **Impact:** Critical — if the session cannot be written (folder moved, cloud folder not synced, disk full, no permission), the user gets no message, cannot retry, and the only way out is Discard, which loses the work.
- **Current experience:** One agent made the session's image folder read-only, another deleted the session's Markdown file; both then pressed "Add to session ⌘↵". The window stayed open, the button stopped working but looked exactly as before, and no message appeared. The error went only to the developer console ("EACCES: permission denied", "ENOENT: no such file or directory … session.md").
- **Visual:** `2-save-failed-ann.png` ("Save failed here: no message, button now dead"), `7-savefail-annotated.png`. Proposal, at the foot of the side panel: "⚠ Could not add to '2026-09-25 09.14': the folder is read-only. [Try again] [Choose another session…]".
- **Recommendation:** Catch the failure, name the session and the reason in plain words next to the button, turn the button back on, and offer another session. The marks stay on screen.
- **Tradeoff:** A small error area in the side panel for a rare case. A failed image write and a failed Markdown append need telling apart, so a retry does not add the entry twice.
- **Decision needed:** When saving fails, should the editor offer to save into another (or a new) session, as well as trying again?
- **Verified:** seen on screen (two harness runs: read-only image folder, deleted session file) and read in the code.
- **Owner's words:** "Also I wonder what the best way of making this portable is: being able to share this as a PDF or zip it, maybe both. Having it in the cloud." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor, Add to session; main process save
- Broken: Nielsen 9 (recover from errors), Nielsen 1; Shneiderman informative feedback; peak-end rule; checklist forms 3
- Code: `src/editor.ts:596-609` (no try/catch, button never re-enabled), `src/main.ts:114-119`, `src/sessions.ts:46-49` (reads session.md, can throw)
- Screenshots: 2-save-failed.png, 2-save-failed-ann.png, 7-savefail.png, 7-savefail-annotated.png; codex check `8-behavior-results.json` (`buttonDisabled: true` after a rejected write)
- Seen by: 2-05, 3-20, 6-04, 7-02, 8-02 — seen by 3 of 3 independent evaluators. Impact given: Critical (2-05), High (7-02, 8-02), Medium (3-20, 6-04); the merge keeps the highest.

</details>

### F005 · Cut & move can show pixels that were already redacted

- **Impact:** Critical — information the reviewer deliberately hid (a customer name, a key) can reappear in the saved image, the PDF and the ZIP sent to someone else.
- **Current experience:** "Redact" lays a pixelated copy over the screenshot. "Cut & move" then lifts its piece from the original screenshot, not from what is visible. Cutting an area that includes a redaction and dragging it away shows the unredacted pixels in the moved piece, and that piece is what gets saved.
- **Visual:** No screenshot (the only agent that found it could not launch the app). Proposal: "Redact a region → cut across it → the moved piece stays pixelated".
- **Recommendation:** Make every derived image respect redactions: cut pieces are taken from the screenshot with redactions applied, and the flattened export is checked the same way.
- **Tradeoff:** Redactions become part of the pixels a cut takes; undoing a redaction afterwards cannot un-pixelate a piece already cut.
- **Decision needed:** Should a redaction apply to anything cut from that area later, even if the redaction is undone afterwards?
- **Verified:** read in the code (confirmed at the merge: both Redact and Cut & move build their image from the untouched screenshot).
- **Owner's words:** "Also I wonder what the best way of making this portable is: being able to share this as a PDF or zip it, maybe both. Having it in the cloud." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor canvas, Redact (key 6, third tool) followed by Cut & move (key 7); saved PNG, PDF, ZIP; scene: sharing with a person
- Broken: Nielsen 5; mental model; trust in local work and exports
- Code: `src/editor.ts:357-375` (redact: `new fabric.FabricImage(background!.getElement(), { cropX, cropY … })` plus Pixelate filter), `src/editor.ts:408-417` (cut piece: same untouched `background.getElement()`, no filter), `src/editor.ts:603` (save flattens the canvas)
- Other products: Xnapper presents redaction as hiding sensitive information; this supports the expectation, not a claim about its implementation.
- Seen by: 8-12 — seen by 1 of 3 independent evaluators (the code-only evaluator); not rendered because Electron did not launch there
- Related: F104

</details>

### F006 · A discarded screenshot cannot be recovered

- **Impact:** High — a mis-pressed ⌘W or Discard cannot be undone, because the captured image is deleted from disk the moment the window closes; if the build has changed since, the screen cannot be captured again.
- **Current experience:** After ⌘W the temporary screenshot file was gone from the test folder. The menu has no "Reopen last screenshot".
- **Visual:** Harness file listing after ⌘W: only the session folder remains, the captured image is gone. Proposal: menu item "Reopen last screenshot" under "Capture region".
- **Recommendation:** Keep the last few discarded captures for a while (for example until the next day) and offer "Reopen last screenshot" in the menu bar menu.
- **Tradeoff:** Screenshots linger in a temporary folder and need a clean-up rule.
- **Decision needed:** Do you want a "Reopen last screenshot" item, and how long should discarded captures be kept?
- **Verified:** seen on screen (file listing after the harness run) and read in the code.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor close; menu bar menu
- Broken: Shneiderman easy reversal; rule area confirmation and undo
- Code: `src/main.ts:84` (`win.on('closed', () => fs.rmSync(image))`)
- Other products: Xnapper and CleanShot keep a capture history.
- Seen by: 2-04; the same recovery route is offered as an alternative in 6-01, 7-01 and 8-01 (draft on close)

</details>

### F007 · ⌘W discards the screenshot even while you are typing a note

- **Impact:** High — a reflexive ⌘W while the cursor is in "Comment" or a marker note throws away the whole capture.
- **Current experience:** The key handler checks ⌘W before it checks whether a text field has focus. With "Half-written comment" typed in Comment, one ⌘W on the field closed the editor. Every other editor key (numbers, Backspace) is correctly left to the field.
- **Visual:** `4-textkeys.png` (harness counted one close call from ⌘W in the Comment field). Before: ⌘W in a note = discard. After: ⌘W in a field goes through the same question as everywhere else, or does nothing.
- **Recommendation:** Treat ⌘W inside a text field like any other editor key, or route it through the discard question.
- **Tradeoff:** None worth naming.
- **Decision needed:** Should ⌘W inside a text field do nothing, or ask like ⌘W elsewhere?
- **Verified:** seen on screen (harness counted the close) and read in the code.
- **Owner's words:** "This is also important: when I create, as I said, it needs to be shortcuts so I can just do this on the fly." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor, Comment and note fields
- Broken: Nielsen 5; mode error
- Code: `src/editor.ts:613` (⌘W) runs before the text-field branch at `:614`
- Screenshots: 4-textkeys.png
- Seen by: 4-03, 6-02 — seen by 1 of 3 independent evaluators

</details>

### F008 · Pressing 5 again for the next marker makes an empty card instead

- **Impact:** High — in the main scene, a reviewer placing several numbered markers in a row gets an empty sticky card on the second one and loses the rhythm.
- **Current experience:** Press 5, click: marker 1 appears and the button reads "5 Numbered". Press 5 again and click: the button now reads "5 Card" and an empty yellow card opens for typing. Pressing the key of the group that is already active moves to its next tool, so "press 5, click" only works the first time. One agent's own test script fell into this trap.
- **Visual:** `4-press5-twice-annotated.png` (marker 1, then an empty card, the button reading "Card"), `1-a-review.png`.
- **Recommendation:** Pressing the key of the tool that is already active keeps that tool; cycling moves to a separate gesture (Shift plus the number, or two quick presses). Then "press 5, click" means the same thing every time.
- **Tradeoff:** You asked for "press the same button multiple times … switch between the shapes"; this changes that gesture.
- **Decision needed:** When a tool is already active, should pressing its number keep it, with Shift+number (or a quick double press) to cycle?
- **Verified:** seen on screen.
- **Owner's words:** "When I press the same button multiple times, let's say I have the 1 button, I would switch between the shapes and it would indicate it at the top." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor, key 5 (Numbered → Card); the same mechanism for every group
- Broken: Nielsen 4 (same key, two meanings by hidden state), Nielsen 5; Jakob's law; mode error
- Code: `src/editor.ts:305-309` (`pickGroup` cycles when `g === group`)
- Screenshots: 4-press5-twice.png, 4-press5-twice-annotated.png, 1-review.png, 1-a-review.png; harness `{"first":"marker","second":"card"}`
- Other products: Figma: pressing R again keeps Rectangle, alternatives in a dropdown; macOS Screenshot markup: separate buttons, no cycling; Xnapper: one key per tool.
- Seen by: 1-01, 4-01
- Related: F009, F023

</details>

### F009 · Pressing 1 in a fresh editor draws an ellipse, not a box

- **Impact:** High — the first key most reviewers press gives the wrong shape, on every screenshot.
- **Current experience:** The editor opens with "1 Box" already highlighted; the README says "1 Box". Pressing 1 and dragging gives an ellipse, and the button now reads "1 Ellipse". Returning to a group later also picks whatever was used last in it, not its first tool.
- **Visual:** `7-review-annotated.png` ("Pressed 1 for Box: got Ellipse"), `1-a-names.png` ("1 Box" already on at open).
- **Recommendation:** Open the editor with no tool picked (or with Select), so the first press of any number always picks that group's first tool; or make the first press always pick the group's first tool and only a repeat cycle.
- **Tradeoff:** Opening with no tool means one key press before the first mark. Time-based cycling is invisible and harder to explain.
- **Decision needed:** Should the first press of a number always give that group's first tool, with cycling only on a repeated press?
- **Verified:** seen on screen.
- **Owner's words:** "When I press the same button multiple times, let's say I have the 1 button, I would switch between the shapes and it would indicate it at the top." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor toolbar, keys 1–7 at open
- Broken: Nielsen 4; mental model; law of similarity
- Code: `src/editor.ts:91` (`group = 0` at start), `:305-309`, `:90` (last-used variant remembered)
- Screenshots: 7-review.png, 7-review-annotated.png, 1-empty.png, 1-a-names.png
- Seen by: 1-01, 7-04 — seen by 1 of 3 independent evaluators. Impact given: High (1-01), Medium (7-04).

</details>

### F010 · Clearing the text of an existing card deletes the card, and Undo cannot bring it back

- **Impact:** High — a reviewer rewording a card who selects all its text, deletes it and clicks away loses the card and its old text for good.
- **Current experience:** An empty card is always treated as a mis-click: when text editing ends with no text, the card is removed. For a card that already existed, no undo step is recorded, so ⌘Z does not restore it or its previous text.
- **Visual:** Proposal: "Existing card cleared → the card stays, empty and selected; ⌘Z restores the old text".
- **Recommendation:** Treat a new empty card and an existing card that was emptied differently; make either removal undoable.
- **Tradeoff:** An emptied card may stay on the image until deleted on purpose.
- **Decision needed:** Should clearing an existing card leave an empty card, or delete it with an undo step?
- **Verified:** read in the code (confirmed at the merge).
- **Owner's words:** "Help me think about how we can highlight stuff and potentially add UI elements, like being able to add a card and write on the card, so I can actually edit on the screen and drag and drop, size, and so on." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor canvas, card text editing
- Broken: Nielsen 3; Shneiderman easy reversal; mental model
- Code: `src/editor.ts:542-545` (`if (!target.text.trim()) canvas.remove(target)` with no undo entry)
- Evidence: codex isolated callback left zero objects and zero new undo entries (`8-behavior-results.json`)
- Seen by: 8-03 — seen by 1 of 3 independent evaluators. Not a contradiction with F082: a new empty card leaves a dead undo step; an existing emptied card leaves none. Both follow from the same lines.

</details>

### F011 · Marks cannot be copied, pasted or duplicated

- **Impact:** High — the owner's main scene asks to "copy and paste stuff around"; placing the same cross, tick, card or cut piece three times means drawing it three times.
- **Current experience:** With a box selected, ⌘C then ⌘V, and ⌘D, left the object count at 1. The editor's keys are ⌘↵, ⌘W, ⌘Z, Esc, ⌫, 1–7 and V; there is no copy, paste, duplicate or Option-drag.
- **Visual:** `1-probe.png` (object count unchanged after ⌘C, ⌘V and ⌘D). Proposal: ⌘C/⌘V pastes the selected mark offset by a few pixels; ⌘D duplicates it.
- **Recommendation:** Support ⌘C, ⌘V and ⌘D (and Option-drag) for the selected mark and for cut pieces, as undoable steps. A pasted marker takes the next number and gets an empty note row.
- **Tradeoff:** Pasted markers renumber; pasted card pointers and cut pieces need a rule for their links.
- **Decision needed:** Should marks be copyable within one screenshot only, or also between screenshots open at the same time?
- **Verified:** seen on screen (object count measured in the page) and read in the code.
- **Owner's words:** "I want to be able to draw inside the screenshots, also copy and paste stuff around, and work." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor canvas, Select
- Broken: Nielsen 7; Shneiderman shortcuts; Jakob's law; Maze journey limitation; owner request
- Code: `src/editor.ts:611-625` (no C, V or D handling); no `copy` or `paste` listener in `src/`
- Screenshots: 1-probe.png; harness `{"before":1,"afterCopyPasteDup":1}`
- Other products: macOS Screenshot markup, Figma and Xnapper copy and duplicate annotations with ⌘C, ⌘V and ⌘D; Figma pastes across files.
- Seen by: 1-24, 3-22, 4-06, 6-16, 7-21, 8-06 — seen by 3 of 3 independent evaluators
- Related: F037, F036

</details>

### F012 · Boxes, arrows, markers and cards are drawn in the same red that means "remove"

- **Impact:** High — in the quick verdict and for the agent reading the image, a red box that means "look here" looks like a red cross that means "remove"; the copied prompt even says red means remove.
- **Current experience:** The colour swatch starts at the exact red of the Remove group. Box, ellipse, arrow, pen, numbered markers, card stripes and card pointers are all drawn in it. On one capture, a red box around the header actions and a red cross over "Export CSV" are the same colour. The prompt for the agent says "Red crosses and hatched areas mean remove."
- **Visual:** `3-ann-red-clash.png` (box, cross and active button, same red), `6-a-red-meanings.png` (A red box "look here", B red cross "remove", C red marker), `7-review-annotated.png`, `4-verdict-annotated.png`, `1-a-colour.png`.
- **Recommendation:** Keep red for Remove only: pointing marks start in a colour no fixed-meaning group uses (for example blue or violet).
- **Tradeoff:** Red is the classic annotation colour and the app's own accent; some reviewers will pick it by hand anyway. Existing sessions stay red.
- **Decision needed:** Should red be reserved for "remove", with boxes, arrows, markers and cards starting in another colour?
- **Verified:** seen on screen and read in the code.
- **Owner's words:** "Also again, we need more elements to be clear about what should go away and what should not." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor colour swatch default; groups 1 Mark, 2 Draw, 5 Note; saved images
- Broken: project hard rule "Remove marks are always red and approve marks always green" (kept literally, but red is not exclusive); Nielsen 4; law of similarity; Von Restorff effect; WCAG 1.4.1 passes only because of shapes (risk if a plain box means remove)
- Code: `src/editor.html:183` (`<input type="color" value="#e11d48">`), `src/editor.html:14` (`--accent: #e11d48`), `src/editor.ts:9` (`RED = '#e11d48'`), `:97`, `src/main.ts:131` (prompt)
- Screenshots: 1-colour.png, 1-a-colour.png, 3-size-1920x1080-2x.png, 3-ann-red-clash.png, 3-alltools-1180-light.png, 4-verdict-annotated.png, 5-marks-light.png, 6-review.png, 6-a-red-meanings.png, 6-review-dark.png, 7-review-annotated.png
- Other products: macOS Screenshot markup defaults to red for all shapes but gives red no meaning; Figma and Xnapper use a neutral accent for pointers and selection.
- Seen by: 1-08, 3-01, 4-17, 5-17, 6-05, 7-05 — seen by 2 of 3 independent evaluators. Impact given: High (1-08, 3-01, 4-17, 6-05, 7-05), Design choice (5-17).
- Related: F027, F077, F107

</details>

### F013 · The editor shows almost nothing about the session it adds to

- **Impact:** High — on the tenth capture of an overnight review, the reviewer cannot see which entry this will be, what the earlier ones said, or that the session is the right one.
- **Current experience:** The toolbar ends with "→ <session name>" in muted grey. There is no entry number, no count of entries so far, no view of earlier entries, and no way to open session.md or copy the prompt from the editor.
- **Visual:** `1-a-names.png` ("→ audit" boxed). Proposal `1-proposal-editor.png`: a session strip with earlier entries as thumbnails, the number this one will get, and "Copy prompt" and "Open".
- **Recommendation:** Show the session name, the entry number this will become, and small thumbnails of earlier entries in the editor.
- **Tradeoff:** Less room for the canvas at 1180 px; more to build.
- **Decision needed:** Should the editor show the session so far (name, count, earlier entries), or stay a single-screenshot window?
- **Verified:** seen on screen.
- **Owner's words:** "I also wonder: where do I access the session? Is this in the toolbar of my Mac? Is this where I am supposed to see it or where would I see that?" — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor header
- Broken: Nielsen 1; goal-gradient effect
- Code: `src/editor.html:185`, `src/editor.ts:644`, `src/main.ts:80`
- Screenshots: 1-a-names.png, 1-proposal-editor.png
- Other products: macOS: a floating thumbnail after each capture; Figma: the file's pages always visible; Xnapper: a history of recent captures (reported).
- Seen by: 1-17

</details>

### F014 · There is no keyboard way to put a mark on the screenshot

- **Impact:** High — someone who cannot use a pointer cannot do the product's core job at all, and fast reviewers cannot stay on the keys.
- **Current experience:** Tab moves through the eight tool buttons, "Color", "Undo", "Comment", the notes, "Discard" and "Add to session", then wraps; the screenshot is never focused. Choosing "5 Numbered" by key works, but the hint then says "Press 5 and click the image…": there is no way to place anything without a click.
- **Visual:** `5-a-canvas-unnamed.png` (the area Tab never reaches). Proposal `5-p-keyboard-marks.png`: the screenshot takes focus, arrow keys move a crosshair, Shift+arrows size it, Enter places the current tool.
- **Recommendation:** Make the screenshot focusable. With focus there, a crosshair moves with the arrow keys; Enter places a click-size mark; Enter, arrows, Enter draws a sized box, arrow or card.
- **Tradeoff:** New input code in the editor; slower than a pointer for most people. The freehand pen can stay pointer-only.
- **Decision needed:** Should every tool except Pen be usable without a pointer, even if that adds a keyboard crosshair mode?
- **Verified:** seen on screen (Tab order logged from real key presses) and read in the code.
- **Owner's words:** "This is also important: when I create, as I said, it needs to be shortcuts so I can just do this on the fly." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor canvas, all tools of groups 1–7
- Broken: WCAG 2.1.1 Keyboard (A); checklist accessibility 4; Nielsen 7
- Code: `src/editor.ts:432-490` (all placement in `mouse:down`/`mouse:up`), `src/editor.html:187` (canvas, no tabindex)
- Screenshots: 5-tab-end.png, 5-a-canvas-unnamed.png, 5-p-keyboard-marks.png
- Other products: Figma documents keyboard canvas navigation; macOS Screenshot markup has no keyboard placement either.
- Seen by: 4-05, 5-01, 8-08 — seen by 1 of 3 independent evaluators

</details>

### F015 · Marks already on the screenshot cannot be selected from the keyboard

- **Impact:** High — a keyboard-only user cannot fix a mark in the wrong place except by undoing everything after it.
- **Current experience:** V picks "Select", but selecting a mark needs a click. There is no key to go from one mark to the next.
- **Visual:** `5-a-handles.png` (a selected cross; only a pointer can get it there). Proposal `5-p-keyboard-marks.png`, right-hand "Marks" list where each row selects its mark.
- **Recommendation:** With Select active and the screenshot focused, Tab and Shift+Tab step through the marks; or list all marks in the side panel, each row selecting its mark.
- **Tradeoff:** Tab inside the screenshot changes what Tab means there; a list is more code but also gives screen readers a text form of the marks.
- **Decision needed:** Keyboard selection inside the screenshot, a list of marks in the side panel, or both?
- **Verified:** read in the code; Backspace on a selection seen on screen.
- **Owner's words:** "Help me think about how we can highlight stuff and potentially add UI elements, like being able to add a card and write on the card, so I can actually edit on the screen and drag and drop, size, and so on." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor, Select tool
- Broken: WCAG 2.1.1 (A)
- Code: `src/editor.ts:611-625` (no mark-to-mark navigation), `:318` (`skipTargetFind` except for Select)
- Screenshots: 5-handles.png, 5-a-handles.png
- Seen by: 4-05, 5-02, 8-08 — seen by 1 of 3 independent evaluators
- Related: F063, F016

</details>

### F016 · The screenshot and every mark on it are invisible to screen readers

- **Impact:** High — a VoiceOver user hears an unnamed canvas and cannot know what was captured or what has been drawn; only numbered markers show up, through their note fields.
- **Current experience:** The accessibility tree has two unnamed canvas nodes. After drawing two crosses, a tick, a thumbs up, a highlight, two markers and a card, the only traces are "Note for 1", "Note for 2" and the card's unnamed hidden text field.
- **Visual:** `5-a-canvas-unnamed.png`. Proposal `5-p-keyboard-marks.png`: the screenshot named "Screenshot, 8 marks" and a "Marks" list naming each one ("Cross (remove)", "Tick (approve)", "Card: …").
- **Recommendation:** Name the screenshot with its mark count and add a text list of marks to the side panel, each with its kind and its note or card text.
- **Tradeoff:** More text in the side panel; it can start collapsed.
- **Decision needed:** Should the side panel list every mark, not only numbered markers?
- **Verified:** seen on screen (accessibility tree read after drawing).
- **Owner's words:** "Also again, we need more elements to be clear about what should go away and what should not." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor canvas and side panel
- Broken: WCAG 1.1.1 (A), 4.1.2 (A), 1.3.1 (A)
- Code: `src/editor.html:187`, `src/editor.ts:565-594` (only markers become rows)
- Screenshots: 5-marks-light.png, 5-a-canvas-unnamed.png
- Seen by: 5-06 (the code-only evaluator makes the same point in its checklist: "editor canvas lacks an equivalent accessible annotation representation")

</details>

### F017 · Selection handles are tiny and pale, so resizing is guesswork

- **Impact:** High — resizing a box, card or cut piece is part of the core job ("drag and drop, size"), and the handles are 3–9 px wide in a pale translucent blue.
- **Current experience:** Handle size shrinks with the canvas scale: about 4.5 px at the 1180-wide window on Retina, about 9 px at 1×, 5.9 px at 1440, 8.5 px at 1920, and 2.8 px for a 5K capture. On a small capture it flips: 13 px handles cover a 30 px box completely. A selected card shows only a faint outline.
- **Visual:** `3-ann-handles.png` (zoomed), `3-selcard-zoom.png` (selected card, frame barely visible), `3-ann-small.png` (handles bigger than the box), `5-a-handles.png`.
- **Recommendation:** Draw handles at a fixed on-screen size (about 10–12 px visible with a 24 px hit area), solid border and white fill, whatever the zoom; give the selected object a clear 1.5–2 px outline; hide the middle handles on very small objects.
- **Tradeoff:** Larger handles overlap small marks.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen; sizes measured in the page.
- **Owner's words:** "Help me think about how we can highlight stuff and potentially add UI elements, like being able to add a card and write on the card, so I can actually edit on the screen and drag and drop, size, and so on." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor canvas, Select
- Broken: WCAG 2.5.8 Target Size (AA); Fitts's law; checklist accessibility 3
- Code: Fabric's default `cornerSize` 13 canvas pixels; the canvas is shown CSS-scaled (`src/editor.ts:633-639`), and `:82-87` sets no `cornerSize`
- Screenshots: 3-handles.png, 3-handles-zoom.png, 3-ann-handles.png, 3-selcard.png, 3-selcard-zoom.png, 3-size-small-1180.png, 5-handles.png, 5-a-handles.png
- Seen by: 3-12, 5-23. The two sizes reported (4.5 px and about 9 px) are the same window at 2× and 1×, not a contradiction. Impact given: High (3-12), Low (5-23).

</details>

### F018 · The screenshot cannot be zoomed

- **Impact:** High — on a full-window capture at the minimum window size, table text is a few pixels high and markers land imprecisely; detailed review is the owner's main scene.
- **Current experience:** The image is always fitted to the window and never enlarged; pinch, ⌘+ and ⌘− do nothing on the canvas.
- **Visual:** `6-review.png` (1180 × 600) next to `6-review-1920.png` (the same marks, much larger targets); `7-wide1920-1x.png`. Proposal: "[−] [100% ▾] [+] [Fit]" under the screenshot.
- **Recommendation:** Fit on open, then ⌘+ / ⌘− / ⌘0 and pinch to zoom, with space-drag to pan.
- **Tradeoff:** Zoom and pan add state the user must keep track of, and pointer coordinates must stay right while zoomed.
- **Decision needed:** Is zoom needed for detailed reviews, or are captures expected to stay small regions?
- **Verified:** read in the code; the size difference between window widths seen on screen.
- **Owner's words:** "Basically reviewing the designs, doing a complete UX/UI review of an overnight build, providing detailed feedback on different elements." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor canvas
- Broken: Fitts's law; Jakob's law; Nielsen 7; checklist responsive 5 (standard gestures)
- Code: `src/editor.ts:633-639` (scale ≤ 1 only)
- Screenshots: 6-review.png, 6-review-1920.png, 7-wide1920-1x.png
- Other products: Figma and Xnapper zoom with ⌘+ and pinch; macOS Screenshot markup zooms with pinch.
- Seen by: 6-19, 7-24, 8-07 — seen by 3 of 3 independent evaluators. Impact given: High (8-07), Medium (6-19), Low (7-24).

</details>

### F019 · Pressing ⌘↵ twice adds the same screenshot twice

- **Impact:** Medium — a double press (likely, since saving gives no feedback) writes two identical entries, and the agent works through the same feedback twice.
- **Current experience:** In a test run, two ⌘↵ presses in a row produced "## 001" and "## 002" with two identical images. The key calls save directly and ignores that the button is already disabled.
- **Visual:** Harness output: "## 001 · 15:21 / ![Screenshot 1](img/001.png) / ## 002 · 15:21 / ![Screenshot 2](img/002.png)".
- **Recommendation:** Ignore further saves while one is running, for the key as well as the button.
- **Tradeoff:** None worth naming.
- **Decision needed:** Should a second ⌘↵ while saving be ignored? (Recommended: yes.)
- **Verified:** seen on screen (files and session.md after the run) and read in the code.
- **Owner's words:** "It's basically for providing feedback to AI in a nice and token-efficient way." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor, ⌘↵
- Broken: Nielsen 5
- Code: `src/editor.ts:612` (⌘↵ calls `save()` unconditionally), `:597`
- Steps: `e2steps/double.js`
- Seen by: 2-06, 8-02 (notes that the key "can still call save independently") — seen by 1 of 3 independent evaluators

</details>

### F020 · After "Add to session" the window just vanishes, with no entry number or confirmation

- **Impact:** Medium — in a run of many captures the reviewer cannot tell whether the last one landed, which number it got, or in which session, without opening session.md.
- **Current experience:** On success the editor closes. The entry number is returned to the editor and thrown away; there is no notification, no sound and no change in the menu.
- **Visual:** No screen exists to capture (the window is gone). Proposal: a quiet notification "Added 004 to 2026-09-25 14.30 · Open session.md", replacing the previous one, or a brief flash of the menu bar icon.
- **Recommendation:** Confirm each save once, briefly, with the number, the session and a way to open it.
- **Tradeoff:** A notification per save can feel noisy over 20–30 captures; a menu bar flash is quieter but easier to miss.
- **Decision needed:** How should a successful save be confirmed: a notification, a menu bar flash, a count in the menu, or nothing?
- **Verified:** read in the code.
- **Owner's words:** "I also wonder: where do I access the session? Is this in the toolbar of my Mac? Is this where I am supposed to see it or where would I see that?" — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor → menu bar app
- Broken: Nielsen 1; Shneiderman "dialogs that yield closure", informative feedback; peak-end rule; WCAG 4.1.3 Status Messages (applied to the app); checklist content 7
- Code: `src/main.ts:114-119` (returns `n`, then closes the window), `src/editor.ts:602` (result unused)
- Other products: macOS shows a floating thumbnail; Xnapper shows a "Saved" toast; CleanShot shows an overlay.
- Seen by: 1-28, 2-07, 3-21, 5-27, 6-03, 7-27, 8-15 — seen by 3 of 3 independent evaluators

</details>

### F021 · An open editor keeps saving into the session it started in, after you switch or start a new one

- **Impact:** Medium — a reviewer who presses ⌘⇧2 or picks another session while an editor is open expects the screenshot to go there; it goes to the old one.
- **Current experience:** Each editor fixes its session and folder when it opens. The notification "New session: 2026-09-25 15.20" appears, yet the open editor still shows "→ 2026-09-25 09.14" and saves there. After "Change sessions folder…" an open editor still writes to the old folder.
- **Visual:** `2-empty-1180-ann.png` ("The only sign of the target session").
- **Recommendation:** Pick one rule and show it: either open editors follow the active session (and their label updates), or they stay put and the switch says "Open editors still go to …".
- **Tradeoff:** Following the active session can move a screenshot the user meant for the old session.
- **Decision needed:** When you switch or start a session while an editor is open, should that editor follow, or stay with the session it was captured for?
- **Verified:** read in the code.
- **Owner's words:** "It needs to be some sort of project or session. If there's an existing session I just add to the existing session or I create a new session." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor; menu New session, Switch session, Change sessions folder…
- Broken: Nielsen 1, Nielsen 4; mental model; rule area navigation and return
- Code: `src/main.ts:73-83` (`editors.set(… { image, root, session })` at open), `:115`, `:59-62`, `:44-55`
- Seen by: 2-09, 7-26 — seen by 1 of 3 independent evaluators

</details>

### F022 · After placing a marker, tool keys are typed into its note

- **Impact:** Medium — in the main rhythm "5, click, type, 3, drag", the 3 lands in the note and the tool stays on Numbered.
- **Current experience:** Placing a marker moves the cursor into its "Note for 1" field, which saves a click. Every number key and V then goes into the note until Esc or a click on the image; nothing on screen says so, and the README mentions Esc only as "Deselect".
- **Visual:** `6-mode-error.png` (marker 1, focus in its note), `4-textkeys.png`. Proposal: the note placeholder reads "Note for 1 · Esc to go back to the tools".
- **Recommendation:** Keep the jump into the note, and name the way back in the field; consider ⌘1–⌘7 as tool keys that work from inside text fields too.
- **Tradeoff:** ⌘+number is a second set of shortcuts and weakens the "just press 1" promise.
- **Decision needed:** Should tool keys also work while you type a note, with ⌘ plus the number, or only after Esc?
- **Verified:** seen on screen (scripted key press: tool stayed "marker") and read in the code.
- **Owner's words:** "I want shortcuts, like just pressing 1, 2, 3, 4, 5 while I'm in the editor." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor, note fields (also Comment)
- Broken: mode error; flow; Nielsen 6, Nielsen 7; paradox of the active user
- Code: `src/editor.ts:439` (focus to the note), `:614-618` (keys ignored in text areas)
- Screenshots: 6-mode-error.png, 4-textkeys.png, 7-review.png
- Seen by: 4-04, 6-13, 7-16 — seen by 2 of 3 independent evaluators

</details>

### F023 · The only hint says "Press 5" even when 5 now gives a card

- **Impact:** Medium — after using a card once, a reviewer who follows the hint gets a card, not a marker.
- **Current experience:** The References panel says "Press 5 and click the image to add a numbered marker with a note." Key 5 remembers the last tool used in its group; after a card, pressing 5 from another tool selects Card again and the hint stays the same.
- **Visual:** `4-hint-annotated.png` (A: "5 Card" active; B: the hint still promising a numbered marker). Before: "Press 5 and click the image to add a numbered marker with a note." After: true in every state, for example "Choose 5 Numbered, then click the image. Each marker gets a note here."
- **Recommendation:** Make the hint true in every tool state, or settle the key behaviour so it is.
- **Tradeoff:** A hint that depends on state is longer to read.
- **Decision needed:** Should the hint change with the tool state, or wait for the decision on how number keys cycle?
- **Verified:** seen on screen.
- **Owner's words:** "I want shortcuts, like just pressing 1, 2, 3, 4, 5 while I'm in the editor." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor, References panel empty state
- Broken: C17 (hints that lie); Nielsen 1, Nielsen 6; cognitive load
- Code: `src/editor.ts:80` (`HINT`), `:90` (variant remembered per group), `src/editor.html:192`
- Screenshots: 4-hint.png, 4-hint-annotated.png; harness `{"afterCycle":"card","afterReturn":"card"}`
- Seen by: 4-02, 8-14 — seen by 1 of 3 independent evaluators
- Related: F008

</details>

### F024 · The toolbar never says what the groups mean ("Remove", "Approve", "Note")

- **Impact:** Medium — the product's core idea (red goes, green stays) is not stated anywhere in the editor; the toolbar reads as a list of shapes.
- **Current experience:** Each button shows its key and current tool: "1 Box", "2 Arrow", "3 Cross", "4 Tick", "5 Numbered", "6 Highlighter", "7 Cut & move", "V Select". The group names Mark, Draw, Remove, Approve, Note, Highlight and Move appear only in hover tooltips ("Remove: Cross → Crossed box → Remove area"). After a card, button 5 reads "5 Card" and the word "Note" appears nowhere.
- **Visual:** `1-empty.png` (toolbar), `6-a-cards.png` ("Group name 'Note' replaced by 'Card'"). Proposal `1-proposal-editor.png`: a small group name above each tool name, or "3 Remove · Cross ●○○".
- **Recommendation:** Show the group name permanently, with the current tool as the secondary label.
- **Tradeoff:** Wider buttons; the toolbar already fills 1180 px exactly.
- **Decision needed:** Should the toolbar show what each group means (Remove, Approve…) as well as the current tool?
- **Verified:** seen on screen; tooltip text read in the code.
- **Owner's words:** "Also again, we need more elements to be clear about what should go away and what should not." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor toolbar
- Broken: Nielsen 6 (recognition over recall), Nielsen 2; mental model
- Code: `src/editor.ts:325-344` (label = tool label, `title` = group label)
- Screenshots: 1-empty.png, 1-proposal-editor.png, 6-review.png, 6-cards.png, 6-a-cards.png
- Other products: macOS Screenshot markup: icon buttons, no groups; Figma: grouped dropdowns, the group name on hover only; Xnapper: icons with number badges.
- Seen by: 1-02, 4-20, 6-09 — seen by 1 of 3 independent evaluators
- Related: F113

</details>

### F025 · Most tools are hidden behind repeated key presses, with only dots as a clue

- **Impact:** Medium — sixteen tools sit behind eight buttons; Pen is the second press of "2 Arrow", Spotlight the second of "6 Highlighter", and a reviewer must already know they exist.
- **Current experience:** Only the "●○○" dots hint that a button has more tools; their names are only in a hover tooltip. The label changes under the pointer as you cycle.
- **Visual:** `6-highlight-group.png` ("6 Redact ○○●"). Proposal: a small popover on long-press, or a compact second line listing the group's tools by name.
- **Recommendation:** Make every tool visible at least once: a popover or a second line with the group's tools.
- **Tradeoff:** More visible choices (Hick's law) against less to remember.
- **Decision needed:** Should each group's tools be visible (popover or second line), or stay reachable only by cycling?
- **Verified:** seen on screen.
- **Owner's words:** "I want shortcuts, like just pressing 1, 2, 3, 4, 5 while I'm in the editor." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor toolbar
- Broken: Nielsen 6; paradox of the active user; chunking; Hick's law
- Code: `src/editor.ts:15-71`
- Screenshots: 6-highlight-group.png
- Other products: macOS Screenshot markup shows every shape in one popover.
- Seen by: 6-10 (first half) — seen by 1 of 3 independent evaluators

</details>

### F026 · Redact is hidden as the third tool under "Highlight"

- **Impact:** Medium — hiding private data before sharing and drawing attention are opposite intents; a reviewer looking for "hide" must know to press 6 three times, and the button turns highlight-yellow.
- **Current experience:** Key 6 cycles "Highlighter → Spotlight → Redact"; the tooltip calls the group "Highlight". With Redact active the button reads "6 Redact ○○●" on a dark-yellow fill.
- **Visual:** `1-a-colour.png`, `7-cycle.png` ("6 Redact ○○●"), `6-highlight-group.png`.
- **Recommendation:** Give Redact its own key (for example 8, "Hide"), or group it with Cut & move as "edit the image".
- **Tradeoff:** One more key; the owner asked for 1–5 and the toolbar already reaches 7.
- **Decision needed:** Should Redact move out of the Highlight group, and to which key?
- **Verified:** seen on screen.
- **Owner's words:** "Help me think about how we can highlight stuff and potentially add UI elements, like being able to add a card and write on the card, so I can actually edit on the screen and drag and drop, size, and so on." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor toolbar, group 6
- Broken: mental model; law of common region (grouped by look, not meaning)
- Code: `src/editor.ts:59-68`
- Screenshots: 1-a-colour.png, 4-empty.png, 6-highlight-group.png, 7-cycle.png
- Other products: Xnapper has redact as its own tool and auto-redacts emails and keys; macOS Screenshot markup and Figma have none.
- Seen by: 1-11, 4-19, 6-10 (second half), 7-13 — seen by 2 of 3 independent evaluators. Impact given: Medium (1-11, 6-10), Low (4-19, 7-13).

</details>

### F027 · The colour picker lets a box or marker be the approve green

- **Impact:** Medium — a green box or arrow looks exactly like an approve mark to a person and to the agent, which is told green means "keep as is".
- **Current experience:** Choosing green and dragging a box around the header buttons gives a box in the same green as the Tick next to it; a green numbered marker matches too. Nothing warns.
- **Visual:** `6-green-box.png` (green box and green tick side by side), `1-a-colour.png` (green ellipse and marker beside a green tick). Proposal: the picker offers a short neutral palette without the remove red and approve green.
- **Recommendation:** Restrict pointing marks to colours with no meaning.
- **Tradeoff:** Less freedom; some reviewers colour-code their own categories.
- **Decision needed:** Should the colours for boxes, arrows, markers and cards exclude the remove red and the approve green?
- **Verified:** seen on screen.
- **Owner's words:** "Also again, we need more elements to be clear about what should go away and what should not. Maybe: … a tick for approving, or kind of like a thumbs up or something for approval in green" — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor colour picker
- Broken: Nielsen 5; law of similarity; project hard rule on red and green
- Code: `src/editor.ts:97`, `src/editor.html:183`
- Screenshots: 6-green-box.png, 1-colour.png, 1-a-colour.png
- Seen by: 1-08, 6-06 — seen by 1 of 3 independent evaluators

</details>

### F028 · Changing the colour does not recolour the selected mark

- **Impact:** Medium — a reviewer who drew a box in the wrong colour has to delete it and draw it again.
- **Current experience:** With a box selected, choosing blue leaves the box red; the new colour applies only to the next mark.
- **Visual:** None on screen; measured on the selected object (stroke still "#e11d48" after choosing "#2563eb").
- **Recommendation:** When a mark with a free colour is selected, the picker recolours it as an undoable step; fixed-colour marks ignore it.
- **Tradeoff:** The picker then has two jobs (this mark and the next), which is usual in drawing tools.
- **Decision needed:** Should the colour picker recolour the selected mark?
- **Verified:** seen on screen (measured on the selected object) and read in the code.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor colour picker, Select
- Code: `src/editor.ts:627` (`colorEl.oninput = () => applyTool()` only)
- Other products: macOS Screenshot markup, Figma and Xnapper recolour the selection.
- Seen by: 3-14

</details>

### F029 · Deleting a marker and undoing brings it back with a different number

- **Impact:** Medium — after delete and undo, numbers no longer follow the order the reviewer placed them, so a note that says "see 1" points at the wrong marker.
- **Current experience:** Three markers with notes; select 1, press ⌫, then ⌘Z. The marker returns to its place but now shows "3", and its note "Customer column too narrow" moves to the bottom of References as 3. The note stays with its marker; the numbering changes.
- **Visual:** `3-ann-renumber.png`, `7-renumber-annotated.png` ("was 1; back as 3 after undo").
- **Recommendation:** Undo puts an object back at its original place in the stacking order, so numbering returns exactly to what it was.
- **Tradeoff:** None for the user.
- **Decision needed:** Should undo restore a marker to its original number? (Recommended: yes.)
- **Verified:** seen on screen and read in the code.
- **Owner's words:** "First I want to have the functionality that when I create a new session it creates Markdown. I can add screenshots to the Markdown and augment the Markdown: draw into the image, comment on it, and add a reference with text on certain elements, pretty much that." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor, markers, Undo
- Broken: Nielsen 3; Shneiderman easy reversal; working memory
- Code: `src/editor.ts:507-515` (undo calls `canvas.add(...all)`, which appends), `:496-499` (numbers come from stack order)
- Screenshots: 3-renumber.png, 3-ann-renumber.png, 7-renumber.png, 7-renumber-annotated.png; codex check `[A,B,C]` → `[A,C,B]`
- Seen by: 3-08, 7-06, 8-05 — seen by 2 of 3 independent evaluators. The code-only evaluator's note that "text remains attached to its marker" agrees with what the others saw.

</details>

### F030 · Selecting a marker does not show its note, and a note does not show its marker

- **Impact:** Medium — with more than five markers the reviewer matches numbers by eye to edit the right note or find the right disc.
- **Current experience:** In Select, clicking marker 1 gives it a faint frame; its References row does not change or scroll. Typing in a note does not highlight its disc.
- **Visual:** `3-selmarker.png` (marker 1 selected, its row unchanged). Proposal: "Select note 8 ↔ highlight marker 8", the row scrolled into view.
- **Recommendation:** Link the two: selecting a marker highlights its row; focusing a row highlights its marker.
- **Tradeoff:** Moving focus into the note on select means number keys type into it; highlighting without focusing avoids that.
- **Decision needed:** Should selecting a marker focus its note, or only highlight the row?
- **Verified:** seen on screen and read in the code.
- **Owner's words:** "Basically reviewing the designs, doing a complete UX/UI review of an overnight build, providing detailed feedback on different elements." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor canvas and References
- Broken: Nielsen 1; law of common region; uniform connectedness; working memory
- Code: `src/editor.ts:565-594` (rows have no link back; no `selection:created` listener)
- Screenshots: 3-selmarker.png
- Seen by: 3-10, 8-30 — seen by 1 of 3 independent evaluators

</details>

### F031 · Cards are missing from the side panel

- **Impact:** Medium — with three cards on the image the panel still says there are no notes, so it is not a complete list of what the entry will say.
- **Current experience:** Cards are written to session.md but never listed in the side panel; their text can only be read and edited on the image. With two cards placed, the panel still shows "Press 5 and click the image to add a numbered marker with a note."
- **Visual:** `6-a-cards.png` ("3 cards on image, panel says none"), `7-card2.png`.
- **Recommendation:** List cards under the markers ("Card: Load more should be a button"), editable there, and mention both in the hint.
- **Tradeoff:** A longer panel on busy screenshots.
- **Decision needed:** Should the side panel list every piece of text that goes into the entry, cards included?
- **Verified:** seen on screen.
- **Owner's words:** "First I want to have the functionality that when I create a new session it creates Markdown. I can add screenshots to the Markdown and augment the Markdown: draw into the image, comment on it, and add a reference with text on certain elements, pretty much that." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor side panel
- Broken: Nielsen 1, Nielsen 6; law of common region
- Code: `src/editor.ts:565-594` (only markers become rows)
- Screenshots: 6-cards.png, 6-a-cards.png, 7-card2.png
- Seen by: 6-12, 7-18 — seen by 2 of 3 independent evaluators

</details>

### F032 · A redaction drawn after a marker hides the marker, but the text still lists it

- **Impact:** Medium — the agent reads "2. _(no note)_" and looks for a number 2 that is not in the image.
- **Current experience:** In a ten-shot test session, marker 2 sat inside an area redacted afterwards. The saved image shows only marker 1; the text lists "1. Row hover missing" and "2. _(no note)_". Any mark under a later redaction disappears the same way, because the redaction is laid on top of everything drawn before it.
- **Visual:** `3-ann-redact-hides-marker.png`; `010.png` in the `3-session10` folder.
- **Recommendation:** Keep redactions directly above the screenshot and below every mark.
- **Tradeoff:** A mark drawn over a redaction stays visible, which is what a reviewer expects.
- **Decision needed:** Should redactions always sit beneath the marks? (Recommended: yes.)
- **Verified:** seen on screen.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor canvas, Redact; saved image and session.md
- Code: `src/editor.ts:357-375` (`canvas.add(img)` appends on top), `:85` (`preserveObjectStacking: true`)
- Screenshots: 3-ann-redact-hides-marker.png, 3-session10/010.png
- Seen by: 3-06

</details>

### F033 · A second spotlight darkens the first, so nothing is lit

- **Impact:** Medium — a reviewer cannot spotlight two things on one screenshot; both areas end up grey.
- **Current experience:** Each spotlight dims everything outside its own box, including the other spotlight's opening. With two, both "clear" areas measured flat grey (115 of 255) instead of white.
- **Visual:** `3-ann-spotlight.png`, `6-a-spotlight-two.png` (both regions labelled "dimmed by spotlight N"), `7-card2-annotated.png`.
- **Recommendation:** Draw all spotlights on one shared dimming layer with several openings.
- **Tradeoff:** Undo and delete must update the shared layer.
- **Decision needed:** Should several spotlights share one dimming layer? (Recommended: yes.)
- **Verified:** seen on screen (pixel values measured).
- **Owner's words:** "Help me think about how we can highlight stuff and potentially add UI elements, like being able to add a card and write on the card, so I can actually edit on the screen and drag and drop, size, and so on." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor, Spotlight (group 6)
- Broken: Nielsen 5; mental model; law of Prägnanz; Maze journey limitation
- Code: `src/editor.ts:171-182` (each spotlight fills the whole canvas outside its box)
- Screenshots: 3-spot.png, 3-ann-spotlight.png, 6-spotlight-two.png, 6-a-spotlight-two.png, 7-card2.png, 7-card2-annotated.png
- Seen by: 3-27, 6-14, 7-09 (first half) — seen by 2 of 3 independent evaluators

</details>

### F034 · A spotlight also dims the reviewer's own earlier marks

- **Impact:** Medium — cards, markers and crosses drawn before a spotlight sink into the grey and are hard to read in the saved image.
- **Current experience:** Anything drawn before the spotlight sits under its dimming layer; anything drawn after sits on top. The card "Right-align totals" and marker 1 became hard to read.
- **Visual:** `3-ann-spotlight.png` (card and marker dimmed), `3-alltools-1180-light.png`, `7-card2-annotated.png`.
- **Recommendation:** Keep the dimming layer directly above the screenshot and below all marks.
- **Tradeoff:** A spotlight can no longer dim a mark on purpose, which nobody is likely to want.
- **Decision needed:** Should spotlights always sit beneath the marks? (Recommended: yes.)
- **Verified:** seen on screen.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor, Spotlight
- Code: `src/editor.ts:85` (`preserveObjectStacking`), `:171-182`
- Screenshots: 3-ann-spotlight.png, 3-alltools-1180-light.png, 7-card2-annotated.png
- Seen by: 3-28, 7-09 (second half) — seen by 1 of 3 independent evaluators

</details>

### F035 · The highlighter disappears on dark interfaces and is faint on white

- **Impact:** Medium — on dark headers, sidebars or dark-mode apps a highlight leaves no visible trace, so the reviewer thinks it failed.
- **Current experience:** The highlighter multiplies 45% yellow into the pixels. On the mock's dark header a pixel went from (24, 24, 27) to (24, 22, 16); on white it becomes a pale #fde896, 1.22:1 against white.
- **Visual:** `3-highlight-dark-ui-crop.png` (the header strip barely changes), `5-a-marks-on-colour.png`.
- **Recommendation:** Always draw a thin solid yellow outline around a highlight, and on dark pixels switch to a lightening blend.
- **Tradeoff:** An outline looks less like a real highlighter pen; the blend switch must depend on brightness.
- **Decision needed:** Should a highlight always show its edge, so it reads on dark interfaces too?
- **Verified:** seen on screen (pixels measured).
- **Owner's words:** "Help me think about how we can highlight stuff and potentially add UI elements, like being able to add a card and write on the card, so I can actually edit on the screen and drag and drop, size, and so on." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor, Highlighter (group 6); saved image
- Broken: WCAG 1.4.11 Non-text Contrast (AA)
- Code: `src/editor.ts:165-170`
- Screenshots: 3-highlight-dark-ui.png, 3-highlight-dark-ui-crop.png, 5-marks-on-colour.png, 5-a-marks-on-colour.png
- Seen by: 3-29, 5-16

</details>

### F036 · Only one mark can be selected at a time

- **Impact:** Medium — moving a card with its marker, or deleting five stray marks, takes one action per object.
- **Current experience:** In Select, dragging across empty canvas selects nothing and Shift-click adds nothing; the harness returned 0 selected after a drag. The code chose one-at-a-time to keep undo simple.
- **Visual:** `1-probe.png` (nothing selected after a drag across the canvas).
- **Recommendation:** Allow Shift-click and drag-to-select, with a group move or delete as one undo step.
- **Tradeoff:** More undo bookkeeping, which is why it was left out.
- **Decision needed:** Is moving or deleting several marks at once worth a more complex undo?
- **Verified:** seen on screen (harness) and read in the code.
- **Owner's words:** "Help me think about how we can highlight stuff and potentially add UI elements, like being able to add a card and write on the card, so I can actually edit on the screen and drag and drop, size, and so on." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor, Select
- Broken: Nielsen 7; Jakob's law
- Code: `src/editor.ts:84` (`selection: false // one object at a time keeps undo simple`); harness `{"rubberBandSelected":0,"selectionOpt":false}`
- Screenshots: 1-probe.png
- Other products: macOS Screenshot markup: Shift-click several shapes; Figma: marquee and Shift-click.
- Seen by: 1-25, 3-26, 6-16, 7-22, 8-06 — seen by 3 of 3 independent evaluators

</details>

### F037 · An image on the clipboard cannot be pasted into the editor or a session

- **Impact:** Medium — a screenshot taken another way, or an element copied from Figma or another capture, cannot be marked up or dropped in; capturing is the only way in.
- **Current experience:** There is no paste handling in the editor and no "Mark up clipboard image" in the menu.
- **Visual:** Proposal: ⌘V in an open editor pastes the image as a movable piece; a menu item "Mark up clipboard image" opens the editor on it.
- **Recommendation:** Accept clipboard images: as a movable piece in an open editor, and as a new screenshot from the menu.
- **Tradeoff:** A new input path to test with large images; reading the clipboard is separate from the editor's own mark clipboard.
- **Decision needed:** Should Snapmark accept images from the clipboard, as a piece, as a new screenshot, or both?
- **Verified:** read in the code.
- **Owner's words:** "Basically reviewing the designs, doing a complete UX/UI review of an overnight build, providing detailed feedback on different elements. I want to be able to draw inside the screenshots, also copy and paste stuff around, and work." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor; menu bar menu
- Code: `src/editor.ts` has no `paste` listener; `src/main.ts:150-165` has no such item
- Other products: Xnapper lists file and clipboard import; Figma pastes images onto the canvas.
- Seen by: 1-24 (second half), 3-23, 6-16 — seen by 1 of 3 independent evaluators. Not tried on screen: the audit's safety rules forbid touching the clipboard.

</details>

### F038 · Dropping an image file on the editor may replace the editor and lose the marks

- **Impact:** Medium — if it happens as expected, dragging a file onto the editor by mistake navigates the window to that file and throws away the marks.
- **Current experience:** The editor has no drop handling and the main process does not block navigation. Chromium's default for a file dropped on such a page is to open it in that window.
- **Visual:** None.
- **Recommendation:** Block navigation in editor windows; then decide whether a dropped image becomes a piece on this screenshot or a new screenshot.
- **Tradeoff:** None for the guard; accepting drops is a new feature.
- **Decision needed:** Should images be droppable into the editor, and if so, as a piece on this screenshot or as a new one?
- **Verified:** assumption, not checked (the harness could not perform a real drop from Finder; the missing handlers were read in the code).
- **Owner's words:** "Help me think about how we can highlight stuff and potentially add UI elements, like being able to add a card and write on the card, so I can actually edit on the screen and drag and drop, size, and so on." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor window
- Code: no `drop`, `dragover` or `will-navigate` handling anywhere in `src/`; `src/main.ts:77-82`
- Seen by: 3-24 (the code-only evaluator also found no external image-drop path)

</details>

### F039 · With about ten markers, "Add to session" scrolls out of sight

- **Impact:** Medium — in the main scene the main action and Discard sit inside the scrolling side panel; with many notes at the minimum window size they are below the fold.
- **Current experience:** With 12 markers at 1180 × 600 the side panel scrolls (670 px of content in 527 px) and the Add and Discard buttons are cut off at the bottom.
- **Visual:** `2-many-markers-ann.png` ("Add to session is scrolled below the fold"). Proposal: buttons pinned to the panel foot; only the References list scrolls.
- **Recommendation:** Pin the buttons to the bottom of the panel and let only the References list scroll.
- **Tradeoff:** Slightly less room for notes.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen.
- **Owner's words:** "Basically reviewing the designs, doing a complete UX/UI review of an overnight build, providing detailed feedback on different elements." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor side panel
- Broken: Fitts's law; Nielsen 1; checklist responsive 8
- Code: `src/editor.html:115-123` (the whole `aside` scrolls), `:157-161`
- Screenshots: 2-many-markers.png, 2-many-markers-ann.png; `asideScroll 670, asideClient 527`
- Seen by: 2-14

</details>

### F040 · With many markers the Comment field shrinks to one clipped line

- **Impact:** Medium — once References is long, the screenshot's comment is squeezed to a sliver cut through the middle, unreadable and hard to type into.
- **Current experience:** With 12 markers, scrolled to the top, "What is this screenshot about?" shows only the top half of one line.
- **Visual:** `2-many-markers-top-ann.png` ("Comment squeezed to one clipped line").
- **Recommendation:** Keep the Comment field at its full height; let only References scroll.
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor side panel
- Code: `src/editor.html:115-123` (flex column lets the textarea shrink), `:127-136`
- Screenshots: 2-many-markers-top.png, 2-many-markers-top-ann.png
- Seen by: 2-15

</details>

### F041 · A long card runs off the bottom of the image and is cut off

- **Impact:** Medium — a card with a few sentences grows past the image edge; the hidden lines are missing from the saved image, so a person reading the PDF sees half a card.
- **Current experience:** A card near the bottom with a 60-word text ends 300 px below the image; the last lines ("and Load more should…") are clipped by the canvas. session.md still gets the full text.
- **Visual:** `2-long-card-ann.png` ("Card runs off the image: the saved PNG cuts it").
- **Recommendation:** Keep cards inside the image: move the card up as it grows past the edge, or widen it.
- **Tradeoff:** A card that moves while typing can surprise; widening keeps it in place.
- **Decision needed:** When a card outgrows the image, should it move up, grow wider, or stay and warn?
- **Verified:** seen on screen (editor); the clipping in the saved image read in the code.
- **Owner's words:** "Help me think about how we can highlight stuff and potentially add UI elements, like being able to add a card and write on the card, so I can actually edit on the screen and drag and drop, size, and so on." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor canvas, Card; saved image
- Code: `src/editor.ts:252-270` (fixed width, grows down), `:603` (export at canvas size)
- Screenshots: 2-long-card.png, 2-long-card-ann.png; `cardBottom 1641, imgH 1344`
- Seen by: 2-16

</details>

### F042 · The editor window can be made narrower than its toolbar, hiding Undo and the session name

- **Impact:** Medium — the code says 1180 px is needed for the toolbar but sets no minimum; below it, Undo and the session name slide out of view behind a scroll with no visible scrollbar.
- **Current experience:** At 1000 px wide with the longer tool names showing, the toolbar overflows by 42 px. At 900 px the toolbar ends at "V Select" and half the colour well; "Undo ⌘Z" and "→ audit" are off screen.
- **Visual:** `2-narrow-900-ann.png`, `3-ann-toolbar-900.png`, `6-a-narrow.png`, `7-narrow900-annotated.png` ("Undo + session cut off").
- **Recommendation:** Set the window's minimum size to 1180 × 600, or compact the toolbar to key-only buttons below that width.
- **Tradeoff:** A hard minimum is awkward on a small screen split in two; a compact toolbar is more work.
- **Decision needed:** Should the editor refuse to get narrower than its toolbar, or should the toolbar compact itself?
- **Verified:** seen on screen and read in the code.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor window
- Broken: checklist responsive 4 and 7; Nielsen 6 (hidden controls)
- Code: `src/main.ts:76-82` (comment "1180 px minimum fits the whole toolbar on one line", no `minWidth`/`minHeight`), `src/editor.html:42-43` (`overflow-x: auto`)
- Screenshots: 2-narrow-900.png, 2-narrow-900-ann.png, 3-ann-toolbar-900.png, 3-long-900.png, 3-long-1000.png, 6-narrow.png, 6-a-narrow.png, 7-narrow900.png, 7-narrow900-annotated.png; `headerScroll 997 > headerClient 900`
- Seen by: 2-17, 3-31, 6-21, 7-10, 8-35 — seen by 3 of 3 independent evaluators. Impact given: Medium (3-31, 7-10, 8-35), Low (2-17, 6-21).

</details>

### F043 · The target session cannot be changed from the editor

- **Impact:** Medium — to put this screenshot in another session the reviewer must leave the editor, open the menu bar, switch, and capture again.
- **Current experience:** Top right reads "→ audit" in the test (a real session reads "→ 2026-09-25 14.30"), muted grey, not clickable.
- **Visual:** `6-empty.png`, `7-empty-light.png` (top right). Proposal: "Adding to: 2026-09-25 14.30 ▾" opening a list of recent sessions and "New session…".
- **Recommendation:** Make the session label a menu that picks or starts the session this screenshot goes to.
- **Tradeoff:** A picker in the editor invites mid-flow decisions, and the header is already full at 1180 px.
- **Decision needed:** Should the editor let you pick or start the session a screenshot goes to?
- **Verified:** seen on screen and read in the code.
- **Owner's words:** "It needs to be some sort of project or session. If there's an existing session I just add to the existing session or I create a new session." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor header
- Broken: Nielsen 3, Nielsen 6; selective attention
- Code: `src/editor.ts:644`, `src/main.ts:73`, `src/editor.html:94-97`
- Screenshots: 6-empty.png, 7-empty-light.png
- Seen by: 6-24, 7-25 — seen by 2 of 3 independent evaluators

</details>

### F044 · There is no way from the editor to the session it writes to

- **Impact:** Medium — to check the session after a few screenshots the reviewer has to leave the editor for the menu bar; the editor never links to session.md or its folder.
- **Current experience:** "→ audit" is plain text.
- **Visual:** `2-empty-1180-ann.png`. Proposal: the session label opens a small menu "Open session.md · Show folder · Copy prompt for AI".
- **Recommendation:** Make the session label a way into the session.
- **Tradeoff:** An interactive element in a toolbar focused on tools.
- **Decision needed:** Should the editor's session label open the session (and its prompt)?
- **Verified:** seen on screen and read in the code.
- **Owner's words:** "I also wonder: where do I access the session? Is this in the toolbar of my Mac? Is this where I am supposed to see it or where would I see that?" — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor header
- Broken: checklist navigation 6 (two paths to main screens)
- Code: `src/editor.html:185`
- Seen by: 2-30

</details>

### F045 · The editor has no help and no list of its keys

- **Impact:** Medium — apart from tooltips and one hint, nothing teaches V, ⌫, Esc, pressing a number again, the card pointer or what Cut & move does; the README says it, the app does not.
- **Current experience:** The only teaching text is "Press 5 and click the image to add a numbered marker with a note." There is no "?" and no shortcut sheet.
- **Visual:** `2-empty-1180.png`, `7-empty-light.png`. Proposal: a "?" in the toolbar opening a one-screen key list.
- **Recommendation:** One short key list reachable with "?", kept in step with the README.
- **Tradeoff:** One more thing to keep up to date as keys change.
- **Decision needed:** Should the editor have a "?" key list?
- **Verified:** seen on screen and read in the code.
- **Owner's words:** "I want shortcuts, like just pressing 1, 2, 3, 4, 5 while I'm in the editor." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor
- Broken: Nielsen 10; paradox of the active user; rule area first run and help
- Code: `src/editor.html:192`, `src/editor.ts:80`, `:339`
- Other products: Figma exposes a shortcut panel through Help and a key.
- Seen by: 2-32, 6-46, 7-19, 8-22 — seen by 3 of 3 independent evaluators
- Related: F128, F105

</details>

### F046 · How to make a card point at something is nowhere in the app

- **Impact:** Medium — the pointer line is the card's most useful feature, but its gesture (press on the target, release where the card goes) is only in the README.
- **Current experience:** Pressing 5 twice and clicking gives a card with no pointer; nothing explains that dragging adds one, or in which direction. The hint still speaks only of markers.
- **Visual:** `6-cards.png` (one card with a pointer, two without). Proposal: with Card active the hint reads "Click to place a card. Drag from the element to where the card goes to add a pointer."
- **Recommendation:** Make the panel hint follow the active tool, one line per tool.
- **Tradeoff:** A changing hint may go unread; experts will stop reading it.
- **Decision needed:** Should each tool show a one-line "how to use" hint while it is active?
- **Verified:** seen on screen and read in the code.
- **Owner's words:** "Help me think about how we can highlight stuff and potentially add UI elements, like being able to add a card and write on the card, so I can actually edit on the screen and drag and drop, size, and so on." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor, side panel hint, Card tool
- Broken: paradox of the active user; Nielsen 6, Nielsen 10
- Code: `src/editor.ts:80`, `:466-474`, `src/editor.html:192`
- Screenshots: 6-cards.png
- Seen by: 6-11, 7-19 — seen by 2 of 3 independent evaluators

</details>

### F047 · There is no redo

- **Impact:** Medium — one ⌘Z too many loses a mark for good; ⌘⇧Z does nothing on the canvas.
- **Current experience:** The toolbar has "Undo ⌘Z" only. The undo history is a stack of steps thrown away once used.
- **Visual:** `7-empty-light.png` (toolbar). Proposal: "[Undo ⌘Z] [Redo ⇧⌘Z]".
- **Recommendation:** Add Redo on ⌘⇧Z, the macOS standard.
- **Tradeoff:** Each step must work in both directions, more code than today's one-way steps.
- **Decision needed:** Should the editor have Redo, sharing one history with Undo?
- **Verified:** read in the code; toolbar seen on screen.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor
- Broken: Nielsen 3; Jakob's law; Shneiderman easy reversal
- Code: `src/editor.ts:88`, `:552-556`, `:611-625` (no Shift+⌘Z branch; with Shift the key is "Z", which matches nothing)
- Other products: macOS Screenshot markup, Figma and Xnapper redo on ⌘⇧Z; Apple documents ⇧⌘Z as Redo.
- Seen by: 3-17, 4-37, 6-17, 7-07, 8-04 — seen by 3 of 3 independent evaluators. Impact given: Medium (7-07, 8-04), Low (3-17, 4-37, 6-17).

</details>

### F048 · ⌘Z does not cover note text, the comment or a colour change

- **Impact:** Medium — what ⌘Z undoes depends on where the keyboard focus is, which a reviewer cannot see.
- **Current experience:** Outside a text field, ⌘Z undoes adding, deleting, moving and resizing marks, and card text. Note text and the comment are undone only by the field's own ⌘Z while that field is focused. Colour changes and discarding are never undoable.
- **Visual:** None; measured in the page.
- **Recommendation:** Write down in the guidelines what ⌘Z covers, and bring note and comment edits into the editor's history once the field is left.
- **Tradeoff:** Text undo must be grouped sensibly, not per keystroke.
- **Decision needed:** Should leaving a note or the comment make its edit part of the editor's undo history?
- **Verified:** seen on screen (measured in the page) and read in the code.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor
- Code: `src/editor.ts:611-619` (⌘Z skipped in text areas), `:589` (note text written straight to the marker)
- Seen by: 3-16 (first half)
- Related: F049, F082

</details>

### F049 · A note's own undo history is lost when a marker is added or deleted

- **Impact:** Medium — an earlier note edit can become unrecoverable after placing or removing another marker.
- **Current experience:** When the marker list changes, every note field is rebuilt, so each field's native undo history is thrown away; note edits are not in the editor's own history either.
- **Visual:** Proposal: "Edit note 1 → add marker 2 → ⌘Z still restores the note edit".
- **Recommendation:** Keep note fields stable across changes, and include note edits in the undo policy.
- **Tradeoff:** Undo must not step through every keystroke.
- **Decision needed:** Should undo stay local while a note is focused and become part of the editor's history after leaving it?
- **Verified:** read in the code.
- **Owner's words:** "For instance mark something on the screen and then be able to write something in a Markdown doc where it puts the image automatically in the Markdown doc." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor, References
- Broken: Nielsen 3; Shneiderman easy reversal
- Code: `src/editor.ts:575-589` (`refsEl.replaceChildren` when the list changes), `:614-619`
- Seen by: 8-36 — seen by 1 of 3 independent evaluators

</details>

### F050 · Editing a card's text again needs Select first

- **Impact:** Medium — to fix a typo on a card the reviewer must press V, then double-click; with the Card tool still active, a click on the card makes a new card on top.
- **Current experience:** In Select a double-click enters editing; with any drawing tool it does not, because drawing tools never pick up existing objects.
- **Visual:** `3-typing.png` (a card being typed right after it was created).
- **Recommendation:** A double-click on a card edits it, whatever tool is active.
- **Tradeoff:** A double-click can no longer draw a default-size mark on top of a card.
- **Decision needed:** Should a double-click on a card edit it from any tool?
- **Verified:** seen on screen (measured in the page) and read in the code.
- **Owner's words:** "Help me think about how we can highlight stuff and potentially add UI elements, like being able to add a card and write on the card, so I can actually edit on the screen and drag and drop, size, and so on." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor canvas, Card
- Code: `src/editor.ts:318` (`skipTargetFind` for every drawing tool)
- Screenshots: 3-typing.png
- Seen by: 3-37

</details>

### F051 · Mark size follows the capture's pixel count, not what is on screen

- **Impact:** Medium — on a small capture card text is half the height of the app's text and markers are small; on a full-window capture the same card is 1.5× the app's text.
- **Current experience:** Small capture (600 × 300 px): stroke 2 px, marker 24 px across, card text 14 px, beside 28 px app text. Full window (2400 × 1344 px): stroke 6 px, marker 72 px, card text 42 px, beside 28 px app text.
- **Visual:** `3-ann-small.png` and `3-saved-small.png`, next to `3-saved-large-5k.png`.
- **Recommendation:** Size marks from the display scale, so card text matches the app's body text at any capture size, with a floor and a ceiling.
- **Tradeoff:** On a very large capture, marks become small relative to the whole image.
- **Decision needed:** Should marks be sized from the screen's text size instead of the capture's size?
- **Verified:** seen on screen; sizes measured in the page.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor canvas, every mark
- Code: `src/editor.ts:647` (`unit = max(2, round(longEdge / 400))`), marker `:231`, card `:261-265`
- Screenshots: 3-ann-small.png, 3-saved-small.png, 3-saved-large-5k.png
- The small capture was simulated in the page (the harness always captures a 1200 × 700 mock).
- Seen by: 3-32

</details>

### F052 · Choosing a tool with the keyboard throws focus back to the start

- **Impact:** Medium — a keyboard or VoiceOver user who presses Space on a tool button loses their place; the next Tab starts again at "1 Box".
- **Current experience:** Tab to "2 Arrow", press Space: the tool changes, and focus lands on the page itself. The same happens when a toolbar button has focus and a number key is pressed. The whole toolbar is rebuilt on every change.
- **Visual:** `5-a-focus-loss.png`; key log: Tab → "2 Arrow"; Space → focus on the page, tool = Arrow; Tab → "1 Box".
- **Recommendation:** Update the existing buttons in place, so focus stays on the pressed button.
- **Tradeoff:** None for users.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen (real key presses, focus logged) and read in the code.
- **Owner's words:** "When I press the same button multiple times, let's say I have the 1 button, I would switch between the shapes and it would indicate it at the top." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor toolbar
- Broken: WCAG 2.4.3 Focus Order (A), 4.1.2 (A)
- Code: `src/editor.ts:325-344` (`toolsEl.replaceChildren` on every `applyTool`)
- Screenshots: 5-space-on-tool.png, 5-a-focus-loss.png
- Seen by: 5-05, 8-09 — seen by 1 of 3 independent evaluators

</details>

### F053 · A card's text cannot be edited again from the keyboard

- **Impact:** Medium — once you leave a card, fixing a typo needs a double-click.
- **Current experience:** A new card opens for typing. After Esc or a click elsewhere, no key opens a selected card for editing.
- **Visual:** Before: select a card, press Enter: nothing. After: Enter on a selected card opens it for typing; Esc leaves.
- **Recommendation:** Enter on a selected card starts editing, as Enter renames a selected item in Finder.
- **Tradeoff:** Depends on being able to select a card from the keyboard.
- **Decision needed:** Should Enter on a selected card start editing it?
- **Verified:** read in the code.
- **Owner's words:** "Help me think about how we can highlight stuff and potentially add UI elements, like being able to add a card and write on the card, so I can actually edit on the screen and drag and drop, size, and so on." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor, Card
- Broken: WCAG 2.1.1 (A)
- Code: `src/editor.ts:466-473` (`enterEditing` only on creation), `:611-625` (no Enter handling)
- Seen by: 5-03
- Related: F015

</details>

### F054 · The pressed "Tick" button has white text below the contrast minimum

- **Impact:** Medium — the label of the active tool, the thing you check before drawing, is hard to read on green.
- **Current experience:** Pressed "4 Tick" or "4 Thumbs up" is white on #16a34a at 3.3:1; 13 px regular text needs 4.5:1.
- **Visual:** `5-a-pressed-green.png`. Before: #fff on #16a34a (3.3:1). After: #fff on #15803d (about 5.0:1).
- **Recommendation:** A darker green for the pressed button only; the mark keeps its green.
- **Tradeoff:** The button green and the mark green differ slightly.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen; ratio computed.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor toolbar, group 4 pressed
- Broken: WCAG 1.4.3 Contrast (Minimum) (AA); checklist accessibility 1
- Code: `src/editor.ts:10`, `:330`, `src/editor.html:71-75`
- Screenshots: 5-marks-on-colour.png, 5-a-pressed-green.png
- Seen by: 5-10 (green half), 6-23, 8-11 — seen by 2 of 3 independent evaluators

</details>

### F055 · The pressed Highlight button has white text below the contrast minimum

- **Impact:** Medium — when Highlighter, Spotlight or Redact is active, its label is white on amber at about 2.9:1.
- **Current experience:** "6 Redact ○○●" is white on #ca8a04.
- **Visual:** `6-a-redact-button.png`. Before: #fff on #ca8a04 (2.94:1). After: #18181b on the amber (about 7:1) or on #facc15 (11.6:1).
- **Recommendation:** Dark text on the amber pressed button.
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen; ratio computed.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor toolbar, group 6 pressed
- Broken: WCAG 1.4.3 (AA)
- Code: `src/editor.ts:330` (yellow group uses `#ca8a04`), `src/editor.html:71-75`
- Screenshots: 6-a-redact-button.png
- Seen by: 5-10 (yellow half), 6-22, 8-11 — seen by 2 of 3 independent evaluators

</details>

### F056 · A marker in a light colour has a white number nobody can read

- **Impact:** Medium — pick yellow, cyan or any light colour and the numbers disappear on the image, in the saved picture and on the side-panel badge.
- **Current experience:** The marker number and badge are always white: on yellow (#facc15) 1.53:1, on cyan 1.81:1.
- **Visual:** `5-a-yellow-marker.png`. After: the number turns #18181b when the marker colour is light.
- **Recommendation:** Choose black or white text from the marker colour's brightness, on the marker and the badge.
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor canvas (Numbered marker), side-panel badge, saved image
- Broken: WCAG 1.4.3 (badge), 1.4.11 (marker)
- Code: `src/editor.ts:241-247`, `:584`, `src/editor.html:143-153`
- Screenshots: 5-handles-yellow-marker.png, 5-a-yellow-marker.png
- Seen by: 5-14

</details>

### F057 · Crosses, ticks and boxes have no outline, so they fade on coloured interface parts

- **Impact:** Medium — marks often go on buttons and badges; a red cross on a blue button is 1.1:1 and a green tick 1.57:1, so they are told apart only by hue, which fails for colour-blind readers.
- **Current experience:** Numbered markers have a white ring and read everywhere. Crosses, ticks, boxes, ellipses and arrows are bare lines. On the mock's blue "New order" button the red cross nearly vanishes.
- **Visual:** `5-a-marks-on-colour.png`. Proposal: each line mark drawn over a thin white (or dark) halo, as the marker already has.
- **Recommendation:** Draw a one-unit halo under every line mark.
- **Tradeoff:** Marks look slightly heavier and can crowd tight interfaces.
- **Decision needed:** Should every line mark get a thin halo in the saved image?
- **Verified:** seen on screen; ratios computed.
- **Owner's words:** "Also again, we need more elements to be clear about what should go away and what should not." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor canvas, saved image
- Broken: WCAG 1.4.11 (AA) for the graphics that carry the verdict
- Code: `src/editor.ts:106-185`, `:214-224`
- Screenshots: 5-marks-on-colour.png, 5-marks-light.png, 5-marks-dark.png, 5-a-marks-on-colour.png
- Seen by: 5-15

</details>

### F058 · Arrow, Redact and Cut & move can only be made by dragging

- **Impact:** Medium — people with a tremor, or using a head pointer or click-only voice commands, cannot make an arrow, redact an area or cut a piece.
- **Current experience:** Box, crosses, ticks, highlight and spotlight make a default-size mark on a plain click. Arrow removes itself on a click; Redact and Cut & move do nothing on a click; a card's pointer needs a drag.
- **Visual:** Before: click with "7 Cut & move" → nothing. Proposal: click once for the start, click again for the end, Esc to cancel.
- **Recommendation:** Let every drag-drawn tool also work as click, then click.
- **Tradeoff:** Two clicks are slower than one drag and need a visible "waiting for the end point" state.
- **Decision needed:** Should every tool also work with two clicks instead of a drag?
- **Verified:** read in the code.
- **Owner's words:** "Another thing that would be nice is if I can cut out things and move them and then wherever I move the cut-out, it indicates this with an arrow or something" — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor canvas, Arrow (2), Redact (6), Cut & move (7), Card pointer (5)
- Broken: WCAG 2.5.7 Dragging Movements (AA)
- Code: `src/editor.ts:476-482` (arrow removed on click; redact and cut use `rect(…, false)`), `:347-354`
- Seen by: 5-21

</details>

### F059 · Moving and resizing marks only works by dragging

- **Impact:** Medium — the same users can place a mark but never move it or change its size; a cut piece, whose whole purpose is to be moved, can only be dragged.
- **Current experience:** A selected mark shows handles; the only way to move or resize is to drag.
- **Visual:** `5-a-handles.png`. Proposal: arrow keys move the selected mark, Option+arrows resize it.
- **Recommendation:** Provide a non-drag way (keyboard moves and resizing).
- **Tradeoff:** Depends on keyboard selection being possible.
- **Decision needed:** Should selected marks be movable and resizable with the keyboard?
- **Verified:** read in the code; handles seen on screen.
- **Owner's words:** "Help me think about how we can highlight stuff and potentially add UI elements, like being able to add a card and write on the card, so I can actually edit on the screen and drag and drop, size, and so on." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor canvas, Select, Cut & move
- Broken: WCAG 2.5.7 (AA)
- Code: `src/editor.ts:520-538` (all changes come from drag transforms)
- Screenshots: 5-handles.png, 5-a-handles.png
- Seen by: 5-22
- Related: F063, F015

</details>

### F060 · Backspace deletes the selected mark even when focus is on another control

- **Impact:** Medium — a keyboard user who tabs to "Discard" and presses Backspace deletes a mark they may not see is selected.
- **Current experience:** With a cross selected and focus moved to "Discard ⌘W", Backspace removed the cross. The same happens with focus on the colour well or any tool button.
- **Visual:** `5-a-backspace.png` (the cross gone; focus on Discard).
- **Recommendation:** Handle Backspace and Delete only when the screenshot has focus.
- **Tradeoff:** A pointer user who clicked a mark and then a toolbar button must click the mark again before deleting.
- **Decision needed:** Should Backspace delete a mark only when the screenshot has focus?
- **Verified:** seen on screen (real key presses).
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor
- Broken: WCAG 3.2.2 On Input (A) in spirit; 2.1.4 relates
- Code: `src/editor.ts:620-622`
- Screenshots: 5-handles-yellow-marker.png, 5-a-backspace.png
- Seen by: 5-24

</details>

### F061 · At 200% zoom half the toolbar, including Undo, goes off the right edge

- **Impact:** Medium — a low-vision user who enlarges the editor loses tools 6 to V, the colour well, Undo and the session name, and the screenshot shrinks to 238 px wide.
- **Current experience:** At 200% the toolbar needs 997 of 590 px and scrolls sideways with no scrollbar; the side panel keeps its full width. Whether a user can reach zoom at all is unclear, since the app sets no menu of its own.
- **Visual:** `5-a-zoom200.png`.
- **Recommendation:** Let the toolbar wrap or shrink labels to keys at large zoom, narrow the side panel in proportion, and add View › Zoom In/Out/Actual Size on purpose.
- **Tradeoff:** A wrapping toolbar moves the screenshot when it wraps; the code avoids wrapping for that reason.
- **Decision needed:** At large text sizes, should the toolbar wrap onto two lines or shrink labels to keys?
- **Verified:** seen on screen (zoom factor 2 set on the window); whether users can reach zoom is an assumption, not checked.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor at 1180 × 600, zoom 200%
- Broken: WCAG 1.4.4 Resize Text (AA), 1.4.10 Reflow (AA)
- Code: `src/editor.html:32`, `:42-43`; no `Menu.setApplicationMenu` in `src/main.ts`
- Screenshots: 5-zoom200.png, 5-a-zoom200.png
- Seen by: 5-29

</details>

### F062 · Typing on a card goes into a hidden, unnamed text field

- **Impact:** Medium — VoiceOver announces an unnamed edit field while the user writes on a card.
- **Current experience:** The drawing library puts an invisible text area into the page for card typing, with no label and no link to the card.
- **Visual:** Before: hidden text area with no name. After: named "Card text".
- **Recommendation:** Name the hidden text area "Card text" when editing starts.
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen (DOM read while a card was being typed).
- **Owner's words:** "Help me think about how we can highlight stuff and potentially add UI elements, like being able to add a card and write on the card, so I can actually edit on the screen and drag and drop, size, and so on." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor canvas, Card
- Broken: WCAG 4.1.2 (A)
- Code: `src/editor.ts:466-473`; Fabric's `hiddenTextarea` (opacity 0, z-index −999)
- Seen by: 5-20

</details>

### F063 · Arrow keys do not nudge a selected mark

- **Impact:** Medium — placing a box tightly around a control needs a steady hand; there is no fine positioning, and no non-drag way to move a mark.
- **Current experience:** With a box selected, → did not move it (position 718.8 before and after).
- **Visual:** `4-nudge.png`.
- **Recommendation:** Arrow keys move the selected mark by one screen pixel, Shift+arrow by ten.
- **Tradeoff:** More key handling to keep out of text fields.
- **Decision needed:** Should arrow keys move the selected mark?
- **Verified:** seen on screen (measured in the page) and read in the code.
- **Owner's words:** "This is also important: when I create, as I said, it needs to be shortcuts so I can just do this on the fly." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor, Select
- Broken: checklist responsive 5; WCAG 2.1.1 and 2.5.7 alternatives
- Code: `src/editor.ts:611-625`
- Screenshots: 4-nudge.png; harness `{"arrowNudge":{"before":718.84,"after":718.84}}`
- Other products: macOS Screenshot markup, Figma and Xnapper nudge with the arrow keys.
- Seen by: 3-25, 4-05, 5-02, 8-08 — seen by 1 of 3 independent evaluators. Impact given: Medium (4-05), Low (3-25).

</details>

### F064 · Note fields are labelled only by their placeholder

- **Impact:** Medium — once a note is typed its only label ("Note for 1") disappears, and the "References" heading is a label tied to nothing, so assistive technology cannot name the fields.
- **Current experience:** "Comment" is correctly tied to its field. "References" is not tied to anything. Each note field's name comes from the placeholder; the number badge is not linked.
- **Visual:** `3-alltools-1180-light.png` (side panel). Before: "References" label, field placeholder "Note for 1". After: a heading "References" and each field labelled "Note for marker 1".
- **Recommendation:** Make the heading a heading and give each field a persistent label tied to its badge.
- **Tradeoff:** A little more panel space.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen (accessibility tree and DOM).
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor side panel
- Broken: WCAG 1.3.1 (A), 3.3.2 (A), 4.1.2 (A); checklist forms 1
- Code: `src/editor.html:191` (`<label>References</label>`), `src/editor.ts:585-590`
- Seen by: 3-38, 5-19, 8-10 — seen by 1 of 3 independent evaluators. Impact given: Medium (8-10), Low (3-38, 5-19).

</details>

### F065 · Text fields and buttons have edges too faint to see

- **Impact:** Medium — people with low vision cannot make out the Comment field or the outline buttons against the panel.
- **Current experience:** Field and button borders are 1.27:1 against the white panel (1.5:1 in dark) and the field fill 1.1:1; controls need 3:1 for the edge that identifies them.
- **Visual:** `5-a-field-edges.png`. Before: border #e4e4e7 on #fff. After: border #8a8a93 (3.4:1 light, 4.6:1 dark); dividers keep #e4e4e7.
- **Recommendation:** A separate, darker token for control borders.
- **Tradeoff:** A slightly heavier look.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen; ratios computed from the tokens.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor toolbar and side panel, light and dark
- Broken: WCAG 1.4.11 (AA); checklist accessibility 2
- Code: `src/editor.html:9-23`, `:54`, `:131`, `:162-169`
- Seen by: 5-13, 8-37 — seen by 1 of 3 independent evaluators. Impact given: Medium (8-37), Low (5-13).

</details>

### F066 · There is no palette of simple UI elements

- **Impact:** Medium — proposing "put a button here" or "this should be a dropdown" means drawing a box and writing a card; the palette the owner asked for does not exist.
- **Current experience:** Tools stop at box, ellipse, arrow, pen, cross, crossed box, hatched area, tick, thumbs up, marker, card, highlighter, spotlight, redact and cut & move.
- **Visual:** Proposal: a key (for example 8, "UI") cycling Button · Input · Checkbox · Toggle · Dropdown, each a grey low-fidelity shape with editable text, so nobody mistakes it for real UI.
- **Recommendation:** Start with five or six low-fidelity elements behind one key.
- **Tradeoff:** A large new tool set in a toolbar already full at 1180 px; the agent must learn to read sketched controls.
- **Decision needed:** Is a small palette of low-fidelity UI elements wanted in the next version, and which elements first?
- **Verified:** read in the code; toolbar seen on screen.
- **Owner's words:** "That is different UI control elements, like having a palette of very, very usual and simple UI control elements, analogue to what I would have in, let's say, materialui.com. Not as comprehensive, but basic sets and maybe shapes" — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor toolbar
- Broken: owner request not met; Maze journey limitation; Miller's law tradeoff
- Code: `src/editor.ts:15-71`
- Other products: Figma has full components; Excalidraw-style low-fidelity libraries are the closer analogue.
- Seen by: 1-26 (first half), 6-58, 7-23 — seen by 2 of 3 independent evaluators. Impact given: Medium (1-26), Design choice (6-58, 7-23).

</details>

### F067 · There is no plain text label outside a card

- **Impact:** Medium — writing a short label on the image ("wrong font", "→ 24 px") means a whole sticky card.
- **Current experience:** The only on-image text is a card: a yellow note with a coloured stripe.
- **Visual:** Proposal: a Text tool (for example the second tool of key 2) placing plain text in the mark colour.
- **Recommendation:** Add a plain text tool.
- **Tradeoff:** One more tool; its text must also reach session.md.
- **Decision needed:** Should there be a plain text tool as well as cards?
- **Verified:** read in the code.
- **Owner's words:** "Help me think about how we can highlight stuff and potentially add UI elements, like being able to add a card and write on the card, so I can actually edit on the screen and drag and drop, size, and so on." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor toolbar
- Code: `src/editor.ts:15-71`
- Other products: macOS Screenshot markup and Xnapper both have a text tool.
- Seen by: 1-26 (second half)

</details>

### F068 · A disabled "Add to session" button looks exactly like an enabled one

- **Impact:** Low — while saving, or after a failed save, the reviewer cannot tell whether the click registered, which invites a second press.
- **Current experience:** After the click the button is switched off but keeps its full red fill, white text and the label "Add to session ⌘↵".
- **Visual:** `2-save-failed.png` (disabled) is identical to `2-empty-1180.png` (enabled); `7-savefail-annotated.png`. Before: "Add to session ⌘↵". After: a dimmed button reading "Adding…".
- **Recommendation:** Give the disabled state a visible look, and read "Adding…" while saving.
- **Tradeoff:** None worth naming.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor, primary button
- Broken: Nielsen 1; Shneiderman error prevention; rule area progress
- Code: `src/editor.html:162-177` (no `:disabled` style), `src/editor.ts:597`
- Screenshots: 2-save-failed.png, 2-empty-1180.png, 7-savefail.png, 7-savefail-annotated.png
- Seen by: 2-08, 7-03 — seen by 1 of 3 independent evaluators

</details>

### F069 · The editor window's title is just "Snapmark", not the session

- **Impact:** Low — in Mission Control, the Window menu and VoiceOver's window list every editor reads "Snapmark", so two open editors cannot be told apart.
- **Current experience:** The window is created with the title "Snapmark — <session>", but the page's own title "Snapmark" replaces it as soon as it loads.
- **Visual:** Harness reading of the window title: "Snapmark". Before: "Snapmark". After: "Snapmark — 2026-09-25 09.14".
- **Recommendation:** Keep the session name in the window title.
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen (title read by the harness) and read in the code.
- **Owner's words:** "I also wonder: where do I access the session? Is this in the toolbar of my Mac? Is this where I am supposed to see it or where would I see that?" — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor window title
- Broken: WCAG 2.4.2 Page Titled (A); checklist navigation 3
- Code: `src/main.ts:80` (title set) vs `src/editor.html:6` (`<title>Snapmark</title>` replaces it on load)
- Seen by: 2-10, 5-31. Contradiction settled: the code-only evaluator's checklist marked "location on deep pages" as a pass because the window is given a session title; two agents read the live title as "Snapmark", and the page `<title>` in the code explains why. The title the user sees is "Snapmark".

</details>

### F070 · The session a screenshot goes to is a faint label in the far corner

- **Impact:** Low — the one clue to where this screenshot will land is small, grey and at the opposite corner from the button that writes to it, so it is easy to add to the wrong session.
- **Current experience:** Top right of the toolbar, in muted grey: "→ audit". Nothing near "Add to session" names the session.
- **Visual:** `2-empty-1180-ann.png`. Proposal: the button reads "Add to 2026-09-25 09.14 ⌘↵", or a line above the buttons "Goes to: 2026-09-25 09.14".
- **Recommendation:** Name the session next to the action that writes to it.
- **Tradeoff:** Long session names need truncating in a button.
- **Decision needed:** Should the session name sit on or above the Add button instead of the toolbar corner?
- **Verified:** seen on screen.
- **Owner's words:** "I also wonder: where do I access the session? Is this in the toolbar of my Mac? Is this where I am supposed to see it or where would I see that?" — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor header and side panel foot
- Broken: law of proximity; Nielsen 1
- Code: `src/editor.html:94-97`, `:185`, `src/editor.ts:644`
- Seen by: 2-11

</details>

### F071 · The session label is an arrow and a name, with no word saying what it is

- **Impact:** Low — "→ 2026-09-25 14.03" does not say it is the session this screenshot goes to.
- **Current experience:** Top right reads "→ 2026-09-25 14.03" (the test run shows "→ audit").
- **Visual:** `4-empty-annotated.png` (B). Before: "→ 2026-09-25 14.03". After: "Session: 2026-09-25 14.03", the menu's own wording.
- **Recommendation:** Use the same words as the menu.
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen.
- **Owner's words:** "I also wonder: where do I access the session? Is this in the toolbar of my Mac? Is this where I am supposed to see it or where would I see that?" — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor header
- Broken: Nielsen 2
- Code: `src/editor.ts:644`
- Screenshots: 4-empty-annotated.png, 6-empty.png, 7-empty-light.png
- Seen by: 4-22, 6-24, 7-25 — seen by 2 of 3 independent evaluators

</details>

### F072 · A second editor opens exactly on top of the first

- **Impact:** Low — a second capture taken while an editor is open appears in the same spot and hides the first, which looks as if it was replaced.
- **Current experience:** Every editor is created without a position.
- **Visual:** No screenshot (the harness opens one editor). Proposal: each new editor offset 24 px down and right, like document windows.
- **Recommendation:** Cascade new editors.
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code; the exact placement is an assumption, not checked.
- **Owner's words:** "This is also important: when I create, as I said, it needs to be shortcuts so I can just do this on the fly." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor window placement
- Code: `src/main.ts:77-82` (no `x`/`y`)
- Seen by: 2-12

</details>

### F073 · In dark mode a dark screenshot has no visible edge

- **Impact:** Low — when the captured app has a dark header, the image merges with the editor background and the reviewer cannot see where it ends.
- **Current experience:** The image's shadow is invisible on the dark background; the mock's black header blends into the surround.
- **Visual:** `2-empty-dark.png`, `7-empty-dark-annotated.png`.
- **Recommendation:** A thin light outline around the image in dark mode.
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor canvas, dark appearance
- Broken: law of common region
- Code: `src/editor.html:112-114`
- Screenshots: 2-empty-dark.png, 7-empty-dark.png, 7-empty-dark-annotated.png
- Seen by: 2-34, 7-14 — seen by 1 of 3 independent evaluators

</details>

### F074 · The toolbar is live before the screenshot has loaded

- **Impact:** Low — for a large capture there may be a moment when the tools look ready but the canvas is blank and clicks do nothing.
- **Current experience:** The toolbar renders at once; clicks on the canvas are ignored until the image is ready.
- **Visual:** No screenshot (the harness waits for the image). Proposal: a grey placeholder with "Loading screenshot…".
- **Recommendation:** Show a loading state on the canvas.
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code; the length of the gap is an assumption, not checked.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor on open
- Code: `src/editor.ts:434` (ignores clicks without a background), `:643-654`
- Performance check: first paint about 100 ms after load on the mock, so the gap was not visible there.
- Seen by: 2-35

</details>

### F075 · The colour swatch does nothing for Remove, Approve and Highlight, and does not say so

- **Impact:** Low — a reviewer picks blue, draws a cross and gets red, with no sign the swatch had no effect.
- **Current experience:** With Cross, Tick, Highlighter, Spotlight or Redact active, the swatch stays enabled and keeps showing the free colour; the mark comes out red, green or yellow.
- **Visual:** `1-a-colour.png` (Redact active, swatch red), `3-spot.png`, `6-a-redact-button.png` ("Colour still offered, ignored here"), `7-empty-light.png`. After: the swatch shows the group's colour, dimmed, with the tooltip "Remove marks are always red".
- **Recommendation:** While a fixed-colour group is active, show its colour in the swatch and disable it with that tooltip.
- **Tradeoff:** The control's enabled state changes with the tool.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen and read in the code.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor toolbar, colour input
- Broken: Shneiderman error prevention (grey out what cannot be done now); Nielsen 1; WCAG 4.1.2 (state)
- Code: `src/editor.ts:14`, `:97` (`GROUPS[group].color ?? colorEl.value`), `:627`
- Screenshots: 1-a-colour.png, 3-spot.png, 6-highlight-group.png, 6-a-redact-button.png, 7-empty-light.png
- Seen by: 1-10, 3-15, 5-18, 6-07, 7-12, 8-32 — seen by 3 of 3 independent evaluators

</details>

### F076 · The colour picker is named only "Color"

- **Impact:** Low — a screen-reader user hears "Color, colour well" with no hint of what it colours, and sighted users see an unlabelled square.
- **Current experience:** The swatch has no visible label; its tooltip and accessible name are "Color".
- **Visual:** Before: "Color". After: "Mark colour".
- **Recommendation:** Name it "Mark colour".
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen (accessibility tree).
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor toolbar
- Broken: WCAG 2.4.6 Headings and Labels (AA), 4.1.2 (A)
- Code: `src/editor.html:183` (`title="Color"`)
- Seen by: 5-18, 7-12 — seen by 1 of 3 independent evaluators

</details>

### F077 · A moved piece gets a red dashed outline and a red arrow, the colour of "remove"

- **Impact:** Low — "Cut & move" proposes a move, but its dashed outline, arrow and frame are drawn in the free colour, red by default, so it reads as an area marked for removal.
- **Current experience:** After cutting a region and dragging it, the dashed outline where it was, the arrow and the piece's frame are all red.
- **Visual:** `6-a-red-meanings.png` (label D), `1-a-review.png`.
- **Recommendation:** Give moves their own fixed colour, as Remove and Approve have.
- **Tradeoff:** One more fixed colour to learn.
- **Decision needed:** Should moves have a fixed colour of their own?
- **Verified:** seen on screen.
- **Owner's words:** "Another thing that would be nice is if I can cut out things and move them and then wherever I move the cut-out, it indicates this with an arrow or something" — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor, group 7 Cut & move
- Broken: law of similarity; Nielsen 4
- Code: `src/editor.ts:396` (`const c = colorEl.value`)
- Screenshots: 6-review.png, 6-a-red-meanings.png, 1-review.png, 1-a-review.png
- Seen by: 1-08 (cut-outline part), 6-08 — seen by 1 of 3 independent evaluators

</details>

### F078 · Toolbar buttons change width as you cycle tools, so the buttons after them move

- **Impact:** Low — anyone aiming with the pointer finds the targets have moved: pressing 1 from "Box" to "Ellipse" moves Undo 17 px; cycling 3 to "Remove area" moves "4 Tick" from about 518 px to 590 px.
- **Current experience:** Each button shows the current tool's name, and the names differ in length.
- **Visual:** `3-empty-1180-light.png` compared with `3-alltools-1180-light.png`; `7-empty-light.png` compared with `7-cycle.png`.
- **Recommendation:** Give each group button a fixed width set by its longest tool name.
- **Tradeoff:** A slightly wider toolbar.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen (positions measured).
- **Owner's words:** "When I press the same button multiple times, let's say I have the 1 button, I would switch between the shapes and it would indicate it at the top." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor toolbar
- Broken: Fitts's law; Nielsen 4; checklist performance 3 (layout shift)
- Code: `src/editor.ts:325-344`; `#tools button` has no width
- Seen by: 3-30, 7-11 — seen by 1 of 3 independent evaluators

</details>

### F079 · Small captures are shown at double size on Retina, so they look soft

- **Impact:** Low — a small capture is shown at twice its real size, each screenshot pixel as 2 × 2 screen pixels, so text looks blurred and bigger than on the real screen.
- **Current experience:** A 600 × 300 px capture is shown at 600 × 300 points, which is 1200 × 600 device pixels.
- **Visual:** `3-size-small-1180.png`.
- **Recommendation:** Size the canvas in device pixels, so a capture is at most 1:1 with the screen.
- **Tradeoff:** Small captures then look small, and fine marking would need zoom.
- **Decision needed:** Should small captures show at their real size, or magnified as now?
- **Verified:** seen on screen.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor canvas, small captures
- Code: `src/editor.ts:83` (`enableRetinaScaling: false`), `:636` (`k ≤ 1` in CSS pixels)
- Seen by: 3-33

</details>

### F080 · A marker is centred on the click and covers what it points at

- **Impact:** Low — the marker hides the word or control it is about; in saved images "3 of" in "Showing 3 of 128" and the "Failed" pill are covered.
- **Current experience:** Clicking the text you want to flag drops a filled disc right over it; the disc cannot be resized.
- **Visual:** `3-renumber.png` (markers 2 and 3 cover "Failed" and "3 of"), `3-saved-large-5k.png`.
- **Recommendation:** Place the disc up and to the left of the click, with a short tail to the exact point, like comment pins.
- **Tradeoff:** A tail adds a small element; the badge sits a little away from its target.
- **Decision needed:** Should markers sit beside the clicked point, with a tail, instead of on top of it?
- **Verified:** seen on screen.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor canvas, Numbered marker
- Code: `src/editor.ts:231` (centred on the click), `:232` (`hasControls: false`)
- Other products: Figma comment pins anchor by their tip.
- Seen by: 3-09

</details>

### F081 · Notes cannot be deleted from the References list

- **Impact:** Low — to remove a note the reviewer must find its disc, press V, click the disc and press ⌫; order can only change by deleting and re-placing markers.
- **Current experience:** A row is a badge and a text field, with no delete control and no drag handle.
- **Visual:** `3-renumber.png` (side panel).
- **Recommendation:** A remove control on each row that deletes the marker, with Undo.
- **Tradeoff:** One more control per row.
- **Decision needed:** Should each References row have its own delete control?
- **Verified:** seen on screen and read in the code.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor side panel
- Code: `src/editor.ts:579-592`
- Seen by: 3-11

</details>

### F082 · An empty new card leaves an undo step that does nothing

- **Impact:** Low — after a mis-click with the Card tool, the next ⌘Z seems to do nothing, which reads as "undo is broken".
- **Current experience:** A card placed and left empty disappears as intended, but its creation stays in the history; the next ⌘Z uses up that step with no visible change.
- **Visual:** No visible change; harness result before undo: 0 objects, 1 undo step; after: 0 objects, 0 steps (`7-emptycard.png`).
- **Recommendation:** When an empty new card is removed, remove its undo step too.
- **Tradeoff:** None.
- **Decision needed:** Should removing an empty new card also remove its undo step? (Recommended: yes.)
- **Verified:** seen on screen (harness result) and read in the code.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor, Card, Undo
- Broken: Nielsen 1; Shneiderman informative feedback
- Code: `src/editor.ts:470` (`added(card)`), `:543-545` (removed without popping)
- Screenshots: 7-emptycard.png
- Seen by: 3-16 (second half), 7-08 — seen by 1 of 3 independent evaluators

</details>

### F083 · Undo looks available when there is nothing to undo

- **Impact:** Low — on a fresh capture "Undo ⌘Z" looks fully enabled, and clicking it does nothing.
- **Current experience:** The Undo button is never disabled.
- **Visual:** `3-empty-1180-light.png`, `6-empty.png`.
- **Recommendation:** Disable the button when the history is empty.
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor toolbar
- Broken: Shneiderman error prevention; Nielsen 1
- Code: `src/editor.html:184`, `src/editor.ts:628`
- Seen by: 3-18 (first half), 6-18 — seen by 1 of 3 independent evaluators

</details>

### F084 · Undo never says what it will undo

- **Impact:** Low — after several actions a reviewer cannot tell whether the next click undoes a move or brings back a deleted mark.
- **Current experience:** The button always reads "Undo ⌘Z".
- **Visual:** Proposal: tooltip "Undo move" / "Undo delete marker 3"; "[Undo: Move card ⌘Z]".
- **Recommendation:** Name the pending action in the tooltip.
- **Tradeoff:** Each history step needs a name.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor toolbar
- Code: `src/editor.ts:88` (history is a list of unnamed functions)
- Seen by: 3-18 (second half), 8-04 — seen by 1 of 3 independent evaluators

</details>

### F085 · A marker with no note is saved without a word of warning

- **Impact:** Low — a marker the reviewer meant to explain reaches the agent as a bare number.
- **Current experience:** Marker 3 left empty; "Add to session" saves at once; nothing in the editor marks the empty row.
- **Visual:** `6-review.png` ("Note for 3" empty). Proposal: empty rows show a muted "No note yet" and an outline; optionally the first ⌘↵ focuses the empty note and a second ⌘↵ saves anyway.
- **Recommendation:** Flag empty notes in the panel before saving, never block.
- **Tradeoff:** A marker without a note can be deliberate; a pause on save slows the expert.
- **Decision needed:** Should empty notes only be flagged, or should the first save stop on them?
- **Verified:** seen on screen.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor side panel, save
- Broken: Nielsen 5; checklist forms 4
- Code: `src/editor.ts:596-609`, `src/sessions.ts:54`
- Screenshots: 6-review.png
- Seen by: 3-07, 6-31, 7-31 — seen by 2 of 3 independent evaluators
- Related: F159

</details>

### F086 · Esc does not cancel a shape you are halfway through drawing

- **Impact:** Low — a reviewer who starts a drag in the wrong place has to finish it and then undo.
- **Current experience:** Mouse down, drag, Esc, release: the box is still added (object count 1 → 2). Esc only deselects.
- **Visual:** Harness run recorded with `4-nudge.png`.
- **Recommendation:** Esc during a drag removes the preview and adds nothing.
- **Tradeoff:** None.
- **Decision needed:** Should Esc cancel a drag in progress? (Recommended: yes.)
- **Verified:** seen on screen (harness result).
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor canvas
- Code: `src/editor.ts:621` (Esc only discards the active object), `:432-490`; harness check `escMidDrag`
- Other products: Figma and Preview cancel a drag with Esc.
- Seen by: 4-07

</details>

### F087 · A clicked toolbar button may keep focus, so Space and Enter repeat it

- **Impact:** Low — after clicking "Undo", Space may undo again; after clicking a tool, Enter may cycle it.
- **Current experience:** Toolbar buttons are ordinary buttons with no handling to drop focus after a click.
- **Visual:** None.
- **Recommendation:** Tool buttons and Undo do not take focus on a click, so keys go back to the image; Tab still reaches them.
- **Tradeoff:** None for keyboard users, who still reach them with Tab.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** assumption, not checked (standard button behaviour; synthetic key events could not trigger it; the toolbar is also rebuilt on each change, which may drop focus anyway).
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor toolbar
- Code: `src/editor.ts:340`, `:628`
- Seen by: 4-08

</details>

### F088 · Shortcut hints are written three different ways

- **Impact:** Low — "Undo ⌘Z" (small grey key), "Discard ⌘W" (key style with a leading space), "Add to session ⌘↵" (plain text, same weight as the label).
- **Current experience:** As above, top bar and bottom right.
- **Visual:** `4-empty-annotated.png` (A, C, D), `6-empty.png`. After: one style, the label then a muted key.
- **Recommendation:** One key style everywhere.
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor buttons
- Broken: Maze visual inconsistency; Shneiderman consistency
- Code: `src/editor.html:184`, `:194-195`
- Seen by: 4-23 (first half), 6-26 — seen by 1 of 3 independent evaluators

</details>

### F089 · Deleting (⌫) and deselecting (Esc) are not shown anywhere in the editor

- **Impact:** Low — two keys the editor relies on are only in the README.
- **Current experience:** No tooltip, hint or button mentions ⌫ or Esc.
- **Visual:** `4-empty-annotated.png`. After: the Select tooltip reads "Select, move, resize or delete a mark (⌫)".
- **Recommendation:** Show ⌫ in the Select tooltip and both keys in the key list.
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor
- Broken: C17 (keys without hints); Nielsen 6
- Seen by: 4-23 (second half)

</details>

### F090 · "Discard" does not say what it throws away

- **Impact:** Low — next to "Add to session", "Discard" could mean the marks, the note or the screenshot.
- **Current experience:** The button reads "Discard ⌘W".
- **Visual:** Before: "Discard ⌘W". After: "Discard screenshot ⌘W".
- **Recommendation:** Name the object.
- **Tradeoff:** A slightly wider button.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor side panel
- Broken: checklist content 2
- Code: `src/editor.html:194`
- Seen by: 4-24

</details>

### F091 · "Discard" sits next to "Add to session", at the same size

- **Impact:** Low — a slip lands on the button that throws the work away, which today cannot be undone.
- **Current experience:** "Discard ⌘W" and "Add to session ⌘↵" share one row, each half the width, 8 px apart.
- **Visual:** `7-review.png` (bottom right). Proposal: Discard as a quieter text button, away from the primary action.
- **Recommendation:** Make Discard quieter and move it away from Add to session.
- **Tradeoff:** Discard is harder to find, which is the point.
- **Decision needed:** Should Discard become a quieter button placed away from Add to session?
- **Verified:** seen on screen.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor side panel foot
- Broken: Fitts's law; Nielsen 5; serial position
- Code: `src/editor.html:193-196`
- Seen by: 7-20 — seen by 1 of 3 independent evaluators

</details>

### F092 · Two tooltips repeat themselves: "Select: Select" and "Move: Cut & move"

- **Impact:** Low — the single-tool groups' tooltips say nothing about what the tool does.
- **Current experience:** Tooltips read "Select: Select" and "Move: Cut & move".
- **Visual:** Before: "Select: Select". After: "Select, move, resize or delete a mark (⌫)". Before: "Move: Cut & move". After: "Cut & move: drag around an element, then drag it where it should go".
- **Recommendation:** Tooltips say what the tool does and, for groups, how to cycle.
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen (tooltip text read in the page).
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor toolbar, V and 7
- Broken: checklist content 4 (duplicate)
- Code: `src/editor.ts:339`
- Seen by: 4-20 (tooltip part)

</details>

### F093 · The remove tools are named by shape, except "Remove area", named by meaning

- **Impact:** Low — "Cross", "Crossed box", then "Remove area"; the prompt calls it "hatched areas" and the README "Remove area (hatched)".
- **Current experience:** Key 3 cycles "Cross → Crossed box → Remove area".
- **Visual:** Before: "Remove area". After: "Hatched area".
- **Recommendation:** Name all three by shape; the group already gives the meaning.
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen (tool names read in the page).
- **Owner's words:** "Also again, we need more elements to be clear about what should go away and what should not. Maybe: an X in a box or in a square with lots of X's in it" — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor toolbar, group 3; prompt; README
- Code: `src/editor.ts:39`, `src/main.ts:131`, README
- Seen by: 4-21

</details>

### F094 · Screen readers read the variant dots as "black circle white circle"

- **Impact:** Low — VoiceOver users hear "3 Cross black circle white circle white circle" and must work out that it means "first of three".
- **Current experience:** Each tool button's accessible name is its key, label and dots, for example "3 Cross ●○○"; the cycle is only in the hover tooltip.
- **Visual:** `5-a-dots.png`. Before: "3 Cross ●○○". After: "Remove: Cross, 1 of 3", with the key announced as its shortcut and the dots hidden from screen readers.
- **Recommendation:** Hide the dots from assistive technology and name the button "<group>: <tool>, <n> of <total>".
- **Tradeoff:** None for sighted users.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen (accessibility tree).
- **Owner's words:** "When I press the same button multiple times, let's say I have the 1 button, I would switch between the shapes and it would indicate it at the top." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor toolbar
- Broken: WCAG 1.1.1 (A), 4.1.2 (A); 2.5.3 Label in Name kept if the visible label stays in the name
- Code: `src/editor.ts:331-339`
- Seen by: 5-09

</details>

### F095 · On the pressed tool button the key digit and the dots are too faint

- **Impact:** Low — the key you just pressed ("3") and the variant dots fade into the button colour on every pressed tool, red included.
- **Current experience:** The digit is white at 70% opacity, 11 px: 2.88:1 on red, 2.34:1 on green, 2.18:1 on dark yellow. The dots are white at 80%, 8 px: 3.41, 2.64 and 2.42:1.
- **Visual:** `5-a-pressed-green.png`. Before: 70% white. After: full white on the corrected button colours; dots at least 10 px.
- **Recommendation:** Drop the opacity on the pressed button's key and dots.
- **Tradeoff:** The key looks as strong as the label; weight or size can still separate them.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen; ratios computed from the code.
- **Owner's words:** "I want shortcuts, like just pressing 1, 2, 3, 4, 5 while I'm in the editor." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor toolbar, pressed state
- Broken: WCAG 1.4.3 (AA)
- Code: `src/editor.html:76-88`
- Seen by: 5-11

</details>

### F096 · Placeholder text in the Comment and note fields is too faint, worse in dark mode

- **Impact:** Low — "What is this screenshot about?" and "Note for 1" are hard to read, most of all in dark mode.
- **Current experience:** The placeholder is the browser's default grey #757575 in both modes: 4.19:1 on the light field, 3.85:1 on the dark field.
- **Visual:** `5-a-placeholder-dark.png`. Before: #757575 on #18181b (3.85:1). After: placeholder from the muted token, #52525b in light (7.0:1), #a1a1aa in dark (6.9:1).
- **Recommendation:** Set the placeholder colour from the tokens and declare light and dark colour schemes so native parts follow the mode.
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen; values from computed styles.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor side panel, both modes
- Broken: WCAG 1.4.3 (AA)
- Code: `src/editor.html:8-24`, `:127-136` (no `::placeholder`, no `color-scheme`)
- Screenshots: 5-marks-dark.png, 5-a-placeholder-dark.png
- Seen by: 5-12

</details>

### F097 · Single-key tool shortcuts cannot be turned off and act from anywhere outside a text field

- **Impact:** Low — Voice Control or dictation users, and anyone with a stray key press, switch tools by accident whenever focus is on a button or the colour well.
- **Current experience:** 1–7 and V switch tools whenever focus is not in a text field.
- **Visual:** Before: keys act anywhere outside text fields. After: keys act while the screenshot or the toolbar has focus.
- **Recommendation:** Keep the keys, but only when the screenshot or toolbar has focus; that alone meets the accessibility rule.
- **Tradeoff:** After typing, Esc or a click on the screenshot is needed before keys work, which is already true inside text fields.
- **Decision needed:** Should the number keys work only when the screenshot or the toolbar has focus?
- **Verified:** read in the code.
- **Owner's words:** "I want shortcuts, like just pressing 1, 2, 3, 4, 5 while I'm in the editor." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor
- Broken: WCAG 2.1.4 Character Key Shortcuts (A)
- Code: `src/editor.ts:611-625`
- Seen by: 5-25

</details>

### F098 · Nothing is announced when the tool changes or a mark is added

- **Impact:** Low — a VoiceOver user pressing 3 three times hears nothing, so cannot tell Cross from Crossed box from Remove area.
- **Current experience:** The label changes visually; there is no live region, and because the buttons are rebuilt, even the pressed state is never announced.
- **Visual:** Before: silence. After: a polite announcement "Remove: Crossed box, 2 of 3" on each tool change and "Cross added" after a mark.
- **Recommendation:** One visually hidden live region for tool changes and added or deleted marks.
- **Tradeoff:** Chatty for fast drawers; keep messages short.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code; the accessibility tree has no live region.
- **Owner's words:** "When I press the same button multiple times, let's say I have the 1 button, I would switch between the shapes and it would indicate it at the top." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor
- Broken: WCAG 4.1.3 Status Messages (AA)
- Code: `src/editor.ts:305-344`
- Seen by: 5-26

</details>

### F099 · The editor does not declare its language

- **Impact:** Low — VoiceOver may read the interface and the user's notes with the wrong voice or pronunciation.
- **Current experience:** The editor page has no language set.
- **Visual:** Before: no language. After: English declared.
- **Recommendation:** Declare English on the editor page.
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen (language read as empty) and read in the code.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor window
- Broken: WCAG 3.1.1 Language of Page (A); checklist accessibility 7
- Code: `src/editor.html:2`
- Seen by: 5-30 (editor half), 8-31 — seen by 1 of 3 independent evaluators

</details>

### F100 · A card covers the screenshot beneath it, and that content is lost in the saved image

- **Impact:** Low — a card placed near its target hides the very interface it is about; once saved the image is flat, so the agent never sees what was under it.
- **Current experience:** The card "Pointing at New order" covers "Pending" and "€48.50". It can be moved with V, but nothing suggests it.
- **Visual:** `6-a-cards.png` ("Card hides 'Pending', '€48.50'").
- **Recommendation:** Place new cards off the target by default (the pointer already reaches back), or make cards slightly transparent while not selected.
- **Tradeoff:** Transparent cards are harder to read.
- **Decision needed:** Should a new card avoid covering the element it points at?
- **Verified:** seen on screen.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor, Card
- Broken: Nielsen 5; output for AI
- Code: `src/editor.ts:252-301`
- Screenshots: 6-cards.png, 6-a-cards.png
- Seen by: 6-15 — seen by 1 of 3 independent evaluators

</details>

### F101 · To adjust a mark you must leave your tool, press V, then come back

- **Impact:** Low — drawing tools ignore existing marks, so clicking a box you just drew starts a new one; every adjustment costs two extra key presses.
- **Current experience:** With Box active, clicking on an existing box starts a new box. Only Select (V) moves or resizes.
- **Visual:** Proposal: holding ⌘ while a drawing tool is active switches to Select temporarily.
- **Recommendation:** A temporary Select modifier.
- **Tradeoff:** Drawing on top of a mark then needs care.
- **Decision needed:** Should holding ⌘ switch to Select temporarily?
- **Verified:** read in the code.
- **Owner's words:** "Help me think about how we can highlight stuff and potentially add UI elements, like being able to add a card and write on the card, so I can actually edit on the screen and drag and drop, size, and so on." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor, all drawing tools
- Broken: Nielsen 7; flow
- Code: `src/editor.ts:318`
- Other products: Figma holds ⌘ for direct select; macOS Screenshot markup lets you drag any shape at any time.
- Seen by: 6-20 — seen by 1 of 3 independent evaluators

</details>

### F102 · The side panel puts the screenshot comment above the marker notes

- **Impact:** Low — the marker notes are the main text in the main scene, but the four-line Comment box comes first and References starts halfway down at 600 px.
- **Current experience:** Panel order: "Comment" (4 rows, "What is this screenshot about?"), "References", then the buttons.
- **Visual:** `1-empty.png`.
- **Recommendation:** Put marker notes first and make the comment a one-line field that grows.
- **Tradeoff:** The comment is where context goes; a smaller box may get less use.
- **Decision needed:** Should marker notes come before the comment in the side panel?
- **Verified:** seen on screen.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor side panel
- Code: `src/editor.html:188-196`
- Seen by: 1-30

</details>

### F103 · Cut & move switches the tool to Select by itself

- **Impact:** Low — after lifting one piece, pressing on the image to cut a second grabs or misses instead; it is the only tool that changes the tool.
- **Current experience:** After the drag the toolbar jumps to "V Select" with the piece picked up; to cut again, press 7 again.
- **Visual:** `1-review.png` ("V Select" active after the cut).
- **Recommendation:** Keep Cut & move active: a press inside a lifted piece moves it, a press outside starts a new cut.
- **Tradeoff:** A tool that does two things depending on where you press.
- **Decision needed:** Should Cut & move stay active after a cut?
- **Verified:** seen on screen.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor, group 7
- Code: `src/editor.ts:427-429`
- Seen by: 1-32

</details>

### F104 · Redaction strength is fixed and may leave large text readable

- **Impact:** Low — large headings or numbers may stay legible through the fixed pixelation in a PDF sent outside.
- **Current experience:** Redact pixelates with fixed blocks (at least 8 px); there is no solid-fill option.
- **Visual:** Proposal: Redact fills a solid block, or scales the block size to the selection height.
- **Recommendation:** Make redaction unreadable at any text size.
- **Tradeoff:** A solid block hides layout context the agent might need.
- **Decision needed:** Should Redact be a solid block instead of pixelation?
- **Verified:** assumption, not checked (not tested on large text).
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor Redact; PDF and ZIP exports
- Code: `src/editor.ts:371` (`blocksize: Math.max(8, unit * 5)`)
- Other products: Xnapper and CleanShot offer solid redaction as well as blur.
- Seen by: 6-50 — seen by 1 of 3 independent evaluators
- Related: F005

</details>

### F105 · Tool help lives only in pointer-hover tooltips

- **Impact:** Low — keyboard and VoiceOver users never get the tooltips ("Remove: Cross → Crossed box → Remove area"), and the one written hint vanishes after the first marker.
- **Current experience:** Tool names and cycles are hover tooltips only; there is no persistent key line.
- **Visual:** Before: hover-only tooltip. After: the cycle exposed as the button's description, and a short "Keys" line or "?" in the side panel that stays.
- **Recommendation:** Expose each group's cycle as the button's description, and keep a short key list reachable without hovering.
- **Tradeoff:** A little permanent text in the panel.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code; seen on screen.
- **Owner's words:** "I want shortcuts, like just pressing 1, 2, 3, 4, 5 while I'm in the editor." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor toolbar, side panel
- Broken: WCAG 3.3.2 (A); 3.2.6 Consistent Help passes only because there is no help anywhere
- Code: `src/editor.ts:80`, `:339`, `:565-574`
- Seen by: 5-34

</details>

### F106 · Each editor starts from scratch: tool and colour are not remembered

- **Impact:** Design choice — in a run of captures every editor opens on "1 Box" in red, even if every earlier screenshot used markers and blue.
- **Current experience:** Group, per-group tool and colour are set fresh on each open.
- **Visual:** `2-empty-1180.png` ("1 Box" pressed on every open).
- **Recommendation:** Remember the last tool and colour across editors.
- **Tradeoff:** A fixed starting point is predictable; remembering is faster for repeat work, and interacts with how the first key press behaves.
- **Decision needed:** Should a new editor start on the last tool and colour you used, or always on Box?
- **Verified:** read in the code.
- **Owner's words:** "I want shortcuts, like just pressing 1, 2, 3, 4, 5 while I'm in the editor." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor on open
- Code: `src/editor.ts:90-91`, `src/editor.html:183`
- Seen by: 2-31

</details>

### F107 · The app's accent colour is the Remove red

- **Impact:** Design choice — no demonstrated failure, but "Add to session", the pressed tool fill (even for Select) and every marker badge share the colour that means "remove".
- **Current experience:** "Add to session ⌘↵" is a solid red button; the active "1 Box" and "V Select" fill red; marker badges are red.
- **Visual:** `1-empty.png`, `1-review.png`, `3-ann-red-clash.png` (Select button red).
- **Recommendation:** Give the app its own neutral accent so red always means remove.
- **Tradeoff:** Loses the brand-like red; needs a new token for light and dark.
- **Decision needed:** Should the app's accent move away from the Remove red?
- **Verified:** seen on screen.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor toolbar and side panel
- Code: `src/editor.html:14`, `:172-177`, `src/editor.ts:9`
- Other products: macOS uses system blue for the default button; Figma blue for selection; Xnapper blue or purple.
- Seen by: 1-09, 3-01 (pressed-state part)

</details>

### F108 · There is no "magic select" of an element

- **Impact:** Design choice — the owner called it "super nice but not necessary"; Cut & move lifts exactly the rectangle the reviewer drags.
- **Current experience:** Cut & move does not find element edges.
- **Visual:** None; behaviour only.
- **Recommendation:** Later: snap the cut rectangle to nearby element edges before anything like layer recognition.
- **Tradeoff:** Image analysis cost and wrong guesses on busy screens.
- **Decision needed:** Is edge-snapping for Cut & move worth doing before the UI palette?
- **Verified:** read in the code.
- **Owner's words:** "In an ideal world I would like it to be like Photoshop, where you have this magic select, magic lasso, or magic select thing. Automatically it selects an element and I can increase the width or height or anything, with the text staying where it is. It recognises different layers of it and there's a bit of intelligence, I guess, that would be super nice but not necessary." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor, Cut & move
- Code: `src/editor.ts:395-430`
- Other products: macOS Preview has "Smart Lasso" and "Instant Alpha".
- Seen by: 1-27 (the code-only evaluator's request table records the same as not met, optional)

</details>

### F109 · Two ways to attach text to a spot behave and export differently

- **Impact:** Design choice — a marker's text is typed in the side panel and written as a numbered line; a card's text is typed on the image and written as an unnumbered "Card:" line; nothing guides which to use.
- **Current experience:** Both live under key 5 ("Numbered → Card"). A marker sends focus to the panel; a card opens a text box on the image.
- **Visual:** `1-a-review.png` (marker 1 with a panel note; a card on the image).
- **Recommendation:** Decide the roles (markers for what should change, text off the image; cards for text shown on the image) and say so in the hint and the prompt, or merge them into one object with a "show on image" switch.
- **Tradeoff:** Guidance only, or a bigger merge.
- **Decision needed:** Are markers and cards two different jobs, or should they become one object?
- **Verified:** seen on screen.
- **Owner's words:** "Help me think about how we can highlight stuff and potentially add UI elements, like being able to add a card and write on the card, so I can actually edit on the screen and drag and drop, size, and so on." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor, group 5
- Code: `src/editor.ts:435-441`, `:466-474`
- Other products: Figma separates comments (off canvas) from text and stickies (on canvas).
- Seen by: 1-29

</details>

### F110 · Markers cannot be resized

- **Impact:** Design choice — marker size is fixed by the capture's pixel size; on a dense table it covers neighbouring rows.
- **Current experience:** A selected marker shows a frame but no handles.
- **Visual:** `3-selmarker.png`.
- **Recommendation:** Keep a fixed size, but tie it to what is on screen rather than the capture's pixel count.
- **Tradeoff:** Resizable markers make a session look uneven.
- **Decision needed:** Should marker size stay fixed?
- **Verified:** seen on screen and read in the code.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor canvas
- Code: `src/editor.ts:232` (`hasControls: false`)
- Seen by: 3-13

</details>

### F111 · Stroke weights differ from mark to mark

- **Impact:** Design choice — the tick is four times as heavy as the hatching and twice a box, so marks look like different kits and the verdict marks look more important.
- **Current experience:** Relative to the base stroke: hatching and spotlight border 0.5×; box, ellipse, arrow, pen and card pointer 1×; cross diagonals 1.5×; tick 2×.
- **Visual:** `3-alltools-1180-light.png`, `3-size-1920x1080-2x.png`.
- **Recommendation:** Two weights: regular for pointing marks, heavy for verdict marks; hatching stays thin as a fill.
- **Tradeoff:** The heavy tick is easy to spot, which may be wanted.
- **Decision needed:** Should verdict marks be deliberately heavier than pointing marks, with only two weights?
- **Verified:** seen on screen and read in the code.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor canvas, every mark
- Code: `src/editor.ts:109-180`
- Seen by: 3-34

</details>

### F112 · Nothing can be hidden to see the screenshot under the marks

- **Impact:** Design choice — with ten or more marks the reviewer cannot check what is under a card or spotlight without moving or deleting it.
- **Current experience:** Everything is always shown; there are no layers and no "hide marks" key.
- **Visual:** `3-alltools-1180-light.png`.
- **Recommendation:** Hold a key (for example the backslash key) to hide all marks while it is down.
- **Tradeoff:** One more key to learn.
- **Decision needed:** Is a "peek under the marks" key worth adding?
- **Verified:** seen on screen and read in the code.
- **Owner's words:** "In an ideal world I would like it to be like Photoshop, where you have this magic select, magic lasso, or magic select thing. Automatically it selects an element and I can increase the width or height or anything, with the text staying where it is. It recognises different layers of it and there's a bit of intelligence, I guess, that would be super nice but not necessary." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor canvas
- Seen by: 3-39

</details>

### F113 · The toolbar already fills the 1180 px minimum, with no room to grow

- **Impact:** Design choice — every proposal that adds a word to the toolbar (group names, a session picker) pushes the colour and Undo off screen at the minimum width.
- **Current experience:** At 1180 px the toolbar's content is exactly 1180 px wide.
- **Visual:** `6-empty.png`.
- **Recommendation:** Decide the toolbar's budget before adding labels: icons with keys, or Undo and colour moved into the side panel.
- **Tradeoff:** Icons explain themselves less well than words.
- **Decision needed:** Should the toolbar stay words-only, or move to icons to make room?
- **Verified:** seen on screen (header scroll width 1180 of 1180).
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor toolbar
- Broken: Miller's law; Tesler's law
- Seen by: 6-25 — seen by 1 of 3 independent evaluators

</details>

### F114 · Notes are typed far from the marker they describe

- **Impact:** Design choice — for every note the eye moves from the marker to a field 300–1000 px away on the right.
- **Current experience:** Marker 3 at the bottom middle of the image; "Note for 3" in the right panel.
- **Visual:** `7-review.png`.
- **Recommendation:** Keep the panel (it is also the list), but show a small inline field next to a new marker, mirrored into the panel.
- **Tradeoff:** More on the canvas, which may cover what is being marked.
- **Decision needed:** Is typing notes in the side panel what you want, or should the note field appear next to the marker?
- **Verified:** seen on screen.
- **Owner's words:** "First I want to have the functionality that when I create a new session it creates Markdown. I can add screenshots to the Markdown and augment the Markdown: draw into the image, comment on it, and add a reference with text on certain elements, pretty much that." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor side panel
- Broken: law of proximity; Fitts's law
- Other products: Figma comments open next to the pin; macOS Screenshot markup text sits on the image.
- Seen by: 7-17 — seen by 1 of 3 independent evaluators

</details>

### F194 · The numbered marker, the most used note, sits fifth in the toolbar

- **Impact:** Low — the tool for pointing at an element and writing about it is the fifth of eight buttons.
- **Current experience:** Order: 1 Mark · 2 Draw · 3 Remove · 4 Approve · 5 Note (Numbered → Card) · 6 Highlight · 7 Move · V Select.
- **Recommendation:** Put the note group first.
- **Decision needed:** Should the note group move to key 1?
- **Verified:** read in the code; reported by the owner.
- **Owner's words:** "I think Numbered should be further in the front." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor window
- Found by: the owner, 2026-09-25, after the audit
- Code: `src/editor.ts:15-71` (GROUPS)

</details>

### F195 · Esc never leaves a tool, so Card keeps making cards

- **Impact:** Medium — with Card active every click makes a new card; Esc only stops typing or deselects, and the only way out is V or another key.
- **Current experience:** Esc leaves a text field, or deselects. It never changes the tool. Pressing 5 again only cycles Numbered ↔ Card.
- **Recommendation:** Esc, when nothing is being typed or selected, goes back to Select.
- **Decision needed:** Should Esc go back to Select?
- **Verified:** read in the code; reported by the owner.
- **Owner's words:** "When I'm at a card and then I'm adding cards, if I press 5 again I can't actually get out. With any other thing I'm not getting out either. I'm not sure if it works but I should be getting out of this mode by pressing Escape or something." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor window
- Found by: the owner, 2026-09-25, after the audit
- Code: `src/editor.ts:611-625` (Esc), `:305-309` (cycle), `:466-473` (card on click)

</details>

### F196 · Reference note fields stay two lines high and cut off longer notes

- **Impact:** Medium — a note longer than two lines is clipped mid-line; the reviewer must drag the corner handle to read it.
- **Current experience:** Each note field is created with two rows and never grows; the sidebar scrolls as a whole.
- **Recommendation:** Each note field grows to fit its text; the sidebar scrolls; the buttons stay in a footer.
- **Decision needed:** Routine fix, confirmed with the owner.
- **Verified:** read in the code; reported by the owner.
- **Owner's words:** "Our footer notes in the sidebar should actually take as much space as they need. At the moment the text box is kind of shrunk, like it's ellipsing. Why? Technically the sidebar can also be scrollable." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor window
- Found by: the owner, 2026-09-25, after the audit
- Code: `src/editor.ts:586` (`rows = 2`), `src/editor.html:122,135`

</details>

### F197 · The Comment field and References heading take space before anything is added

- **Impact:** Low — an empty four-line Comment box and a References heading with a hint fill the sidebar before the reviewer writes anything.
- **Current experience:** "Comment" and a 4-row field, then "References" with "Press 5 and click the image to add a numbered marker with a note." are always shown.
- **Recommendation:** Show References only once a reference exists; make the comment a one-line field that grows.
- **Decision needed:** Should the sidebar show sections only when they are used?
- **Verified:** read in the code; reported by the owner.
- **Owner's words:** "I also wonder: commenting and references only exist if I actually add them" — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor window
- Found by: the owner, 2026-09-25, after the audit
- Code: `src/editor.html:189-192`, `src/editor.ts:567-573`

</details>

## Menu bar menu

### F115 · Quit closes every open editor and loses its marks without asking

- **Impact:** High — someone who quits Snapmark (or whose Mac restarts) with an editor open behind other windows loses that screenshot and its marks without a word.
- **Current experience:** The menu's "Quit" uses the standard quit role. No check looks for open editors; they all close and their screenshots are deleted. Because editors have no Dock icon, it is easy to forget one is open.
- **Visual:** Menu as read in the code: "… Snapmark 0.2.0 · Check for updates… · Quit". Proposal: "2 screenshots are not in a session yet. [Review] [Quit anyway]".
- **Recommendation:** On quit, if any editor has marks or text, bring it forward and ask, with the same question as closing an editor.
- **Tradeoff:** Quit is no longer instant while work is open.
- **Decision needed:** Should Quit stop and show unsaved editors, or save them into their session automatically?
- **Verified:** read in the code.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: menu bar menu, Quit; ⌘Q in the editor (through Electron's default menu, not checked)
- Broken: Nielsen 5; rule area saving and unsaved work; platform conventions
- Code: `src/main.ts:180` (`role: 'quit'`), no `before-quit` handler, `:84`
- Seen by: 2-03, 4-10

</details>

### F116 · Sessions are named only by date and time, and cannot be named or renamed in the app

- **Impact:** High — after a week of overnight reviews, "Switch session" lists lines like "2026-09-25 14.02"; nobody can tell which was the checkout review.
- **Current experience:** "New session" (⌘⇧2) creates a folder named by the time; the notification says "New session: 2026-09-25 14.30" and the menu "Session: 2026-09-25 14.30". The only way to name one is renaming its folder in Finder, which also moves it to the top of the list, because the list is sorted by name.
- **Visual:** Proposal: "New session…" asks for an optional name with the time pre-filled (Return keeps it); the menu gains "Rename session…"; the list shows "Checkout review · 25 Sep".
- **Recommendation:** Let the reviewer name a session when creating it, or rename it later from the menu.
- **Tradeoff:** A prompt slows ⌘⇧2 by one Return; a rename item does not, but is easy to forget.
- **Decision needed:** Should sessions be nameable, and if so, when they are created, afterwards, or both?
- **Verified:** read in the code.
- **Owner's words:** "It needs to be some sort of project or session. If there's an existing session I just add to the existing session or I create a new session." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: menu, New session, Switch session; ⌘⇧2; notification
- Broken: Nielsen 2, Nielsen 6; working memory; mental model
- Code: `src/sessions.ts:14-15` (timestamp), `:27-33` (create), `:23-24` (sorted by name, reversed), `src/main.ts:59-62`, `:149-156`
- Other products: Figma and Xnapper name documents; macOS screenshots are timestamped but live in Finder.
- Seen by: 1-20, 4-29, 6-37, 7-35, 8-16 — seen by 3 of 3 independent evaluators. Impact given: High (6-37), Medium (1-20, 4-29, 7-35, 8-16).

</details>

### F117 · "Switch session" shows only 20 sessions, and older ones cannot be reached from the app

- **Impact:** High — after a month of daily sessions, older ones cannot be made active, exported, opened or copied as a prompt from Snapmark; only Finder reaches them, and nothing says they exist.
- **Current experience:** The submenu lists the first 20 folders in reverse name order, with no "More…" item.
- **Visual:** Proposal: "… 20 items · ───── · Other session… · Show all sessions in Finder".
- **Recommendation:** Add a last item that reaches every session (a chooser opened in the sessions folder), and say how many are hidden.
- **Tradeoff:** A chooser is another window.
- **Decision needed:** Should the menu offer "Other session…" to reach every session, and should the recent list be ordered by last use or by date?
- **Verified:** read in the code.
- **Owner's words:** "It needs to be some sort of project or session. If there's an existing session I just add to the existing session or I create a new session." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: menu, Switch session
- Broken: Nielsen 3; C3 dead end; checklist navigation 6; Maze journey limitation
- Code: `src/main.ts:155` (`list.slice(0, 20)`), `src/sessions.ts:17-25`
- Contradiction settled: one agent described the list as "the 20 newest"; the code sorts folder names and reverses them, which is newest first only while every name is a timestamp. A renamed folder such as "Checkout review" sorts above every dated one.
- Other products: Figma: recents plus search; Xnapper: searchable history (reported).
- Seen by: 1-19, 2-26, 6-39, 7-36, 8-17 — seen by 3 of 3 independent evaluators. Impact given: High (8-17), Medium (1-19, 2-26), Low (6-39, 7-36).

</details>

### F118 · "Copy prompt for AI" gives no sign that anything was copied

- **Impact:** Medium — this is the hand-off moment of the main scene; the menu closes and nothing confirms the clipboard holds the prompt, or for which session.
- **Current experience:** Click, the menu closes, silence. The clipboard changes invisibly.
- **Visual:** Proposal: a notification "Prompt for 'Checkout review' copied: paste it into Claude Code", or the item reading "Prompt copied ✓" the next time the menu opens.
- **Recommendation:** Confirm the copy briefly and name the session.
- **Tradeoff:** One more notification for a frequent action.
- **Decision needed:** Should "Copy prompt for AI" confirm with a notification, or with a changed menu label?
- **Verified:** read in the code.
- **Owner's words:** "It's basically for providing feedback to AI in a nice and token-efficient way." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: menu, Copy prompt for AI
- Broken: Nielsen 1; Shneiderman feedback and closure; peak-end rule; WCAG 4.1.3 (applied to the app); checklist content 7
- Code: `src/main.ts:160` (`clipboard.writeText(promptFor(dir))`, nothing else)
- Seen by: 2-18, 4-31, 5-28, 6-40, 7-34, 8-33 — seen by 3 of 3 independent evaluators. Impact given: Medium (2-18, 6-40, 7-34), Low (4-31, 5-28, 8-33).

</details>

### F119 · The copied prompt explains only some of the marks

- **Impact:** Medium — the agent is told about crosses, hatched areas, ticks, thumbs up, boxes, ellipses and arrows, but not about cards, crossed boxes, the highlighter, spotlight, redaction, pen strokes or moves, so it guesses; a pixelated block may be read as a design request.
- **Current experience:** The copied text reads: "Red crosses and hatched areas mean remove. Green ticks and thumbs-up mean keep as is. Boxes, ellipses and arrows point at what a note is about." The last sentence promises a link between shapes and notes that session.md does not make.
- **Visual:** Before: the three lines above. After: "Red crosses, crossed boxes and hatched areas: remove. Green ticks and thumbs up: approved, keep as is. Yellow highlight: look here. A dimmed image with one clear area: focus on that area. Pixelated areas are hidden on purpose; ignore them. Yellow cards carry a comment about what their line points at. A dashed outline with an arrow: move that element to where the arrow points."
- **Recommendation:** Generate the prompt's key from the same list of tools as the toolbar, in the toolbar's words, so no tool is left out.
- **Tradeoff:** A slightly longer prompt, pasted once per session.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code.
- **Owner's words:** "It's basically for providing feedback to AI in a nice and token-efficient way." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: menu, Copy prompt for AI (clipboard text)
- Broken: Nielsen 2; Maze outdated content; output-for-AI check
- Code: `src/main.ts:127-133`
- Seen by: 1-15, 4-18, 6-41, 7-33 — seen by 2 of 3 independent evaluators

</details>

### F120 · There is no way to copy the path to the current session's Markdown

- **Built:** 2026-09-25 as "Copy session.md path", below "Open session.md" (the owner's request, before any decision round). Its label is part of the menu layout decision.

- **Impact:** Medium — the owner wants to paste the file's path into an agent and point it there; today the only route is the full prompt, which carries the path inside three sentences, or Finder.
- **Current experience:** The menu has "Open session.md", "Show session folder" and "Copy prompt for AI". None copies just the path. "Copy prompt for AI" puts on the clipboard: 'Work through the visual feedback in "…/session.md".' followed by two more lines.
- **Visual:** Proposal: a menu item "Copy path to session.md" directly under "Copy prompt for AI", confirmed like the prompt copy.
- **Recommendation:** Add "Copy path to session.md" for the active session.
- **Tradeoff:** One more menu item beside a similar one; the path alone gives the agent no key to the marks unless session.md carries one.
- **Decision needed:** Should the menu get "Copy path to session.md", and should it sit next to or replace "Copy prompt for AI"?
- **Verified:** read in the code (checked at the merge; no agent re-checked this request, which was added after they started).
- **Owner's words:** "One thing, actually, from the menu item: I want to be able to copy and paste the path to the Markdown from the current session. I just paste it and then I can point the AI to it." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: menu bar menu
- Code: `src/main.ts:158-160` (Open, Show, Copy prompt), `:127-133` (prompt text holds the path)
- Seen by: merge step only (request added to the owner's words after the agents started)
- Related: F154 (a key inside session.md makes the bare path enough)

</details>

### F121 · Exporting or copying an older session first makes it the capture target

- **Impact:** Medium — sending last week's session as a PDF means switching to it, and the next ⌘⇧1 then lands in last week's session unless the reviewer switches back.
- **Current experience:** "Open session.md", "Show session folder", "Copy prompt for AI" and "Export session" act only on the active session. "Switch session" is the only way to point them elsewhere, and it also changes where new captures go.
- **Visual:** Proposal: each session in the list has its own submenu: Open · Copy prompt · Export ▸ · Make active.
- **Recommendation:** Separate "work on this session" from "do something with that session".
- **Tradeoff:** Deeper submenus.
- **Decision needed:** Should actions on an older session be possible without making it the active one?
- **Verified:** read in the code.
- **Owner's words:** "Also I wonder what the best way of making this portable is: being able to share this as a PDF or zip it, maybe both. Having it in the cloud." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: menu bar menu
- Code: `src/main.ts:145-165`
- Seen by: 1-21

</details>

### F122 · "Show session folder" and "Sessions folder" differ by one letter and mean different folders

- **Impact:** Medium — a reviewer moving sessions to iCloud can pick the wrong one.
- **Current experience:** The menu has "Show session folder" (this session) and, two groups lower, "Sessions folder: ~/Documents/Snapmark" and "Change sessions folder…" (where all sessions live).
- **Visual:** Before → after: "Show session folder" → "Show in Finder" (under the session items); "Sessions folder: ~/Documents/Snapmark" → "Sessions are saved in ~/Documents/Snapmark"; "Change sessions folder…" → "Change where sessions are saved…".
- **Recommendation:** Keep "session folder" for the one session and describe the parent as a place.
- **Tradeoff:** Longer labels.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code.
- **Owner's words:** "I also wonder: where do I access the session? Is this in the toolbar of my Mac? Is this where I am supposed to see it or where would I see that?" — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: menu bar menu
- Broken: Nielsen 4; one meaning per word; labels that differ by one letter
- Code: `src/main.ts:159`, `:167-168`
- Seen by: 1-07 (wording part), 4-13

</details>

### F123 · "Check for updates…" says nothing when there is no update or the check fails

- **Impact:** Medium — the owner clicks it and nothing happens; up to date, offline and failed all look the same.
- **Current experience:** The check notifies only when an update is found; errors go to the developer log ("Update check failed: …").
- **Visual:** Proposal: "Snapmark 0.2.0 is up to date" / "Couldn't check for updates: no connection. [Try again]".
- **Recommendation:** Always answer a manual check; keep automatic background checks quiet.
- **Tradeoff:** Manual and automatic checks need different feedback.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code.
- **Owner's words:** "I want to have: versioning · releases so it's downloadable · a DMG that's built and can be installed by dragging and dropping it to Applications · an auto-update · a proper README about what it does and what it's for" — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: menu, Check for updates… (installed app only)
- Broken: Nielsen 1, Nielsen 9; Shneiderman closure
- Code: `src/main.ts:121-124` (`checkForUpdatesAndNotify().catch(console.error)`), `:179`
- Seen by: 2-25 (first half), 6-52, 7-39 (first half), 8-25 — seen by 3 of 3 independent evaluators. Impact given: Medium (6-52, 7-39, 8-25), Low (2-25).

</details>

### F124 · The menu still shows ⌘⇧1 next to "Capture region" when the shortcut could not be registered

- **Impact:** Medium — when another app owns ⌘⇧1, the menu keeps promising a shortcut that does nothing, and the passing warning is long gone.
- **Current experience:** "Capture region ⌘⇧1" and "New session ⌘⇧2" are always shown with their keys, whether or not registering them worked.
- **Visual:** Before: "Capture region ⌘⇧1". After: "Capture region (shortcut unavailable)".
- **Recommendation:** Show a shortcut in the menu only when it is registered, and say when it is not.
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code.
- **Owner's words:** "This is also important: when I create, as I said, it needs to be shortcuts so I can just do this on the fly." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: menu, Capture region, New session
- Broken: C17 (hints that lie); rule area feedback ("essential information never lives only in a disappearing message")
- Code: `src/main.ts:150-151` (accelerators always set), `:194-199` (registration result only notified)
- Seen by: 2-22 (menu part), 4-11 (menu part)

</details>

### F125 · "Open session.md" does nothing if the file has gone

- **Impact:** Medium — if the active session's file was moved, deleted or not yet synced, the item silently fails.
- **Current experience:** The result of the system open call is ignored; the item stays enabled as long as a session name is set.
- **Visual:** Proposal: notification "session.md is missing from 2026-09-25 09.14. [Show sessions folder] [Choose another session]".
- **Recommendation:** Report the missing file and offer a route back to an available session.
- **Tradeoff:** Files must be checked at use time.
- **Decision needed:** Should Snapmark offer to locate a moved session, or only say it is missing?
- **Verified:** read in the code.
- **Owner's words:** "I also wonder: where do I access the session? Is this in the toolbar of my Mac? Is this where I am supposed to see it or where would I see that?" — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: menu, Open session.md
- Broken: Nielsen 9; checklist navigation 8 (helpful not-found)
- Code: `src/main.ts:158` (`shell.openPath` result ignored), `:29` (existence checked only at launch)
- Seen by: 2-28, 8-34 — seen by 1 of 3 independent evaluators. Impact given: Medium (8-34), Low (2-28).

</details>

### F126 · "Show session folder" does nothing if the folder has gone

- **Impact:** Medium — the same silent failure as opening the file, for the folder.
- **Current experience:** The result of the system open call is ignored.
- **Visual:** Proposal: "This session is no longer in its saved place. [Choose another session]".
- **Recommendation:** Report the missing folder and offer another session.
- **Tradeoff:** As above.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code.
- **Owner's words:** "I also wonder: where do I access the session? Is this in the toolbar of my Mac? Is this where I am supposed to see it or where would I see that?" — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: menu, Show session folder
- Code: `src/main.ts:159`
- Seen by: 8-34 — seen by 1 of 3 independent evaluators

</details>

### F127 · Before the first session the menu says only "Session: —"

- **Impact:** Medium — a new user sees a greyed "Session: —" and four greyed items, with no hint that the first capture starts a session.
- **Current experience:** First line "Session: —"; "Open session.md", "Show session folder", "Copy prompt for AI" and "Export session" are disabled. The first ⌘⇧1 silently creates a session named by date and time.
- **Visual:** Before: "Session: —". After: "No session yet: press ⌘⇧1 to capture and start one".
- **Recommendation:** Replace the dash with the next step.
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code.
- **Owner's words:** "I also wonder: where do I access the session? Is this in the toolbar of my Mac? Is this where I am supposed to see it or where would I see that?" — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: menu, first line; first run
- Broken: checklist navigation 1, content 6; Nielsen 10; paradox of the active user
- Code: `src/main.ts:149`, `:73` (session created silently on first capture)
- Seen by: 2-24, 4-30, 6-45, 7-42 — seen by 2 of 3 independent evaluators. Impact given: Medium (2-24), Low (4-30, 6-45, 7-42).

</details>

### F128 · The menu has no Help or list of shortcuts

- **Impact:** Medium — shortcuts for the editor (Esc, V, ⌫, the card gesture) and what each colour means are only in the README on GitHub, with no way there from the app.
- **Current experience:** No "Help" or "Keyboard shortcuts" item in the menu bar menu.
- **Visual:** Proposal: "Keyboard shortcuts…" and "Help" (opening the README) at the bottom of the menu.
- **Recommendation:** One in-app shortcut sheet reachable from the menu, and a link to the README.
- **Tradeoff:** One more item; documentation must stay in step with behaviour.
- **Decision needed:** Should help open a compact in-app sheet, or the README?
- **Verified:** read in the code.
- **Owner's words:** "I also wonder: where do I access the session? Is this in the toolbar of my Mac? Is this where I am supposed to see it or where would I see that?" — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: menu bar menu
- Broken: Nielsen 10; paradox of the active user
- Code: `src/main.ts:147-181`
- Seen by: 2-32 (menu part), 6-46 (menu part), 8-22 (menu part) — seen by 2 of 3 independent evaluators. Impact given: Medium (2-32, 8-22), Low (6-46).

</details>

### F129 · The menu does not show how many screenshots the current session has

- **Impact:** Low — mid-review the reviewer cannot see how many screenshots are collected, or tell an empty session from one with twelve entries.
- **Current experience:** "Session: 2026-09-25 14.02". No count, no last entry time.
- **Visual:** Before: "Session: 2026-09-25 14.02". After: "Session: 2026-09-25 14.02 · 7 screenshots".
- **Recommendation:** Add the entry count to the first line.
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code.
- **Owner's words:** "I also wonder: where do I access the session? Is this in the toolbar of my Mac? Is this where I am supposed to see it or where would I see that?" — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: menu, first line
- Broken: Nielsen 1; goal-gradient effect
- Code: `src/main.ts:149`
- Seen by: 1-18 (count part), 7-37, 8-15 (count part) — seen by 2 of 3 independent evaluators

</details>

### F130 · The active session is shown as a greyed-out line

- **Impact:** Low — the most important state in the menu looks disabled.
- **Current experience:** First line "Session: 2026-09-25 14.02" is a disabled item.
- **Visual:** Before: grey line. After: a normal-weight header, or a line that opens session.md.
- **Recommendation:** Make the line readable as a header, or clickable to open the session.
- **Tradeoff:** A disabled first line is a common macOS menu-bar pattern; a clickable one is less expected.
- **Decision needed:** Should the session line open the session when clicked?
- **Verified:** read in the code.
- **Owner's words:** "I also wonder: where do I access the session? Is this in the toolbar of my Mac? Is this where I am supposed to see it or where would I see that?" — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: menu, first line
- Code: `src/main.ts:149` (`enabled: false`)
- Seen by: 1-18 (look part)

</details>

### F131 · The folder where all sessions live cannot be opened from the menu

- **Impact:** Low — "Sessions folder: ~/Documents/Snapmark" is a disabled label; to see all sessions the reviewer must find the folder in Finder by hand.
- **Current experience:** The line is greyed out and does nothing.
- **Visual:** Before: "Sessions folder: ~/Documents/Snapmark" (grey). After: "All sessions: ~/Documents/Snapmark" opening Finder.
- **Recommendation:** Make the line open the sessions folder in Finder.
- **Tradeoff:** None.
- **Decision needed:** Should the sessions-folder line open that folder in Finder?
- **Verified:** read in the code.
- **Owner's words:** "I also wonder: where do I access the session? Is this in the toolbar of my Mac? Is this where I am supposed to see it or where would I see that?" — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: menu, sessions-folder line
- Code: `src/main.ts:167` (`enabled: false`)
- Seen by: 1-07 (openable part)

</details>

### F132 · Each press of "New session" makes a new empty session

- **Impact:** Low — pressing ⌘⇧2 by mistake or twice leaves empty dated sessions in "Switch session", pushing real ones toward the 20-item limit; there is no delete.
- **Current experience:** Each press creates a folder with a session.md and a notification; two presses in one minute give "2026-09-25 14.30" and "2026-09-25 14.30 (2)".
- **Visual:** Proposal: create the folder on the first save, or reuse the current session while it is still empty.
- **Recommendation:** Create sessions only when the first screenshot is added, or reuse an empty current session.
- **Tradeoff:** "New session" then has nothing to open until the first capture; the owner expected a Markdown file when a session is created.
- **Decision needed:** Should a new session exist on disk only once its first screenshot is added?
- **Verified:** read in the code.
- **Owner's words:** "First I want to have the functionality that when I create a new session it creates Markdown. I can add screenshots to the Markdown and augment the Markdown: draw into the image, comment on it, and add a reference with text on certain elements, pretty much that." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: menu New session, ⌘⇧2
- Broken: Nielsen 5; Occam's razor
- Code: `src/main.ts:59-62`, `src/sessions.ts:27-33`
- Seen by: 1-33, 6-38 — seen by 1 of 3 independent evaluators

</details>

### F133 · The session list goes stale when sessions change outside Snapmark

- **Impact:** Low — a session added, renamed or removed in Finder or by a sync service does not show in "Switch session" until Snapmark itself changes something; a removed active session makes the next save fail.
- **Current experience:** The menu is rebuilt only when Snapmark saves its own state.
- **Visual:** None; menu read in the code.
- **Recommendation:** Rebuild the menu each time it opens, and check the active session still exists before opening an editor.
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code.
- **Owner's words:** "Also I wonder what the best way of making this portable is: being able to share this as a PDF or zip it, maybe both. Having it in the cloud." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: menu, Switch session
- Broken: checklist navigation 8
- Code: `src/main.ts:32-36` (`refreshTray` only from `saveState`), `:143-183`, `:29`
- Seen by: 2-27

</details>

### F134 · "Copy prompt for AI", the hand-off step, has no shortcut and sits mid-menu

- **Impact:** Low — at the end of a review the step that hands the session to the agent is the sixth item of the menu, with no key.
- **Current experience:** Order: Session label, Capture region ⌘⇧1, New session ⌘⇧2, Switch session ▸, —, Open session.md, Show session folder, Copy prompt for AI, Export session ▸.
- **Visual:** Before: third item of the second group. After: directly under Capture region, with a free shortcut.
- **Recommendation:** Move it up and give it a global shortcut.
- **Tradeoff:** Another global shortcut that can collide with other apps.
- **Decision needed:** Should "Copy prompt for AI" get a global shortcut?
- **Verified:** read in the code.
- **Owner's words:** "This is also important: when I create, as I said, it needs to be shortcuts so I can just do this on the fly." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: menu bar menu
- Code: `src/main.ts:148-165`
- Seen by: 1-31

</details>

### F135 · An empty session can be exported

- **Impact:** Low — "Export session" is enabled on a session with no screenshots and produces a PDF with only the title.
- **Current experience:** The item is enabled whenever a session exists.
- **Visual:** After: disabled, "Export session (no screenshots yet)".
- **Recommendation:** Disable export until there is an entry.
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: menu, Export session
- Broken: Shneiderman error prevention
- Code: `src/main.ts:161-165` (`enabled: !!dir`)
- Seen by: 6-49 — seen by 1 of 3 independent evaluators

</details>

### F136 · A downloaded update is not shown in the menu

- **Impact:** Low — when an update exists, the updater's own notification appears once and it installs on next quit; nothing in the menu says an update is waiting.
- **Current experience:** No menu item changes after an update downloads.
- **Visual:** Proposal: menu item "Restart to install 0.3.0".
- **Recommendation:** Show a pending update in the menu with a restart action.
- **Tradeoff:** None.
- **Decision needed:** Should a downloaded update appear in the menu as "Restart to install"?
- **Verified:** read in the code.
- **Owner's words:** "I want to have: versioning · releases so it's downloadable · a DMG that's built and can be installed by dragging and dropping it to Applications · an auto-update · a proper README about what it does and what it's for" — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: menu; updater notification
- Code: `src/main.ts:121-124`, `:179`
- Seen by: 2-25 (second half)

</details>

### F137 · "Open session.md" opens whatever app owns .md files, often without the images

- **Impact:** Low — on many Macs that is a text editor showing raw Markdown, so "where do I see my session?" is not answered by the app.
- **Current experience:** The item hands session.md to the system's default app.
- **Visual:** Proposal: "Preview session" rendering the same page as the PDF export in a window; "Open session.md" kept for the text.
- **Recommendation:** Offer a rendered preview alongside the raw file.
- **Tradeoff:** One more window to maintain.
- **Decision needed:** Should the app show a rendered preview of the session?
- **Verified:** assumption, not checked (depends on the Mac's default app).
- **Owner's words:** "I also wonder: where do I access the session? Is this in the toolbar of my Mac? Is this where I am supposed to see it or where would I see that?" — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: menu, Open session.md
- Broken: Nielsen 1; mental model
- Code: `src/main.ts:158`, `src/exporter.ts:19-28` (the HTML for a preview already exists)
- Seen by: 6-44 — seen by 1 of 3 independent evaluators

</details>

### F138 · Every hand-off asks the agent to work through the whole session again

- **Impact:** Design choice — after the agent fixed entries 1–6 and the reviewer added 7–10, the next prompt makes it re-read, and possibly re-apply, 1–6.
- **Current experience:** One prompt: "Work through the visual feedback in …/session.md." There is no notion of done or new entries.
- **Visual:** Proposal: "Copy prompt for new entries (7–10)" beside the full prompt.
- **Recommendation:** Track the last handed-over entry and offer a prompt for the new ones.
- **Tradeoff:** More state and one more menu item.
- **Decision needed:** Should the hand-off be able to cover only entries added since the last one?
- **Verified:** read in the code.
- **Owner's words:** "Basically reviewing the designs, doing a complete UX/UI review of an overnight build, providing detailed feedback on different elements." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: menu, Copy prompt for AI
- Broken: Zeigarnik effect; token cost
- Code: `src/main.ts:127-133`
- Seen by: 6-42 — seen by 1 of 3 independent evaluators

</details>

### F191 · The menu never says what it is: no app name at the top, only a grey session line

- **Impact:** Medium — opening the menu, the first thing shown is a greyed "Session: 2026-09-25 12.03 (2)"; the word Snapmark appears only near the bottom, greyed, as "Snapmark 0.2.0".
- **Current experience:** First line "Session: 2026-09-25 12.03 (2)" (disabled). No title, no sign of which app the menu belongs to among the other menu bar icons.
- **Visual:** Before: "Session: 2026-09-25 12.03 (2)" as the first line. After: a section header "Snapmark" at the top, with the session in its own labelled section below.
- **Recommendation:** Open the menu with the app's name as a section header, and group the rest under labelled headers.
- **Tradeoff:** One more line.
- **Decision needed:** Part of the menu layout decision.
- **Verified:** seen on screen (owner's screenshot, 2026-09-25).
- **Owner's words:** "Can you optimise this dropdown? It looks terrible. The Open Session, Copy Session: what does "Open Session" even mean? The whole thing doesn't even say what it is. The order of the menu just doesn't make sense." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: menu bar menu
- Found by: the owner, 2026-09-25, after the audit
- Code: `src/main.ts` `refreshTray` menu template; Electron 44 supports `type: 'header'` and `sublabel` on macOS 14+

</details>

### F192 · The menu's order does not follow the work: capture, look at the session, hand it to the AI, manage

- **Impact:** Medium — the hand-off items sit between "Open session.md" and "Export session", "New session" sits between capturing and the session's own items, and settings, version and quit share one group.
- **Current experience:** Order: Session label · Capture region ⇧⌘1 · New session ⇧⌘2 · Switch session ▸ · — · Open session.md · Copy session.md path · Show session folder · Copy prompt for AI · Export session ▸ · — · Sessions folder: ~/Documents/Snapmark · Change sessions folder… · — · Open at login · Snapmark 0.2.0 · Check for updates… · Quit.
- **Visual:** Proposal in the menu layout decision.
- **Recommendation:** Order by the review loop: capture first, then the hand-off to the AI, then the current session, then other sessions, then settings and quit.
- **Tradeoff:** People who learned the current positions relearn them once.
- **Decision needed:** Part of the menu layout decision.
- **Verified:** seen on screen (owner's screenshot, 2026-09-25).
- **Owner's words:** "Can you optimise this dropdown? It looks terrible. The Open Session, Copy Session: what does "Open Session" even mean? The whole thing doesn't even say what it is. The order of the menu just doesn't make sense." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: menu bar menu
- Found by: the owner, 2026-09-25, after the audit
- Related: F134 (Copy prompt sits mid-menu), F122

</details>

### F193 · Menu labels name a file ("session.md") instead of what the reviewer gets

- **Impact:** Medium — "Open session.md" and "Copy session.md path" make the reviewer know the file's name to understand the item; the owner asked what "Open session" even means.
- **Current experience:** "Open session.md", "Copy session.md path", "Show session folder" — three items built around file and folder names.
- **Visual:** Before → after: "Open session.md" → "Open feedback file"; "Copy session.md path" → "Copy file path"; "Show session folder" → "Show in Finder" — all under a "Current session" header, so each label needs no "session".
- **Recommendation:** Name each item by what happens, and let the section header carry "session".
- **Tradeoff:** The file name disappears from the menu; the README and the copied prompt still name it.
- **Decision needed:** Part of the menu layout decision.
- **Verified:** seen on screen (owner's screenshot, 2026-09-25).
- **Owner's words:** "Can you optimise this dropdown? It looks terrible. The Open Session, Copy Session: what does "Open Session" even mean? The whole thing doesn't even say what it is. The order of the menu just doesn't make sense." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: menu bar menu
- Found by: the owner, 2026-09-25, after the audit
- Related: F122, F137; glossary-proposal.md

</details>

## Capture overlay

### F139 · Without Screen Recording permission, captures show only the wallpaper and the app never says why

- **Impact:** High — the first capture of every new user opens an editor on the desktop picture instead of the app they selected, as if all were fine; the fix (grant permission, quit, restart) is only in the README.
- **Current experience:** Snapmark calls the system capture and opens whatever image comes back. It never checks the permission and never points to System Settings.
- **Visual:** Proposal: before capturing, if permission is missing, "Snapmark needs Screen Recording to see your apps. [Open System Settings] — then [Restart Snapmark]".
- **Recommendation:** Check the permission at launch and before capturing; if missing, explain it, open the right settings pane and offer a restart.
- **Tradeoff:** A first-run window in an app that otherwise has none; permission behaviour must be tested across macOS versions.
- **Decision needed:** Should Snapmark detect a missing Screen Recording permission and walk the user through it?
- **Verified:** read in the code; the wallpaper-only result is from the README and setup notes, not run.
- **Owner's words:** "It should work on Mac OS mainly and may also boot up on startup with options but that's secondary." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: capture (⌘⇧1, menu Capture region); first run
- Broken: Nielsen 9, Nielsen 10; peak-end rule; paradox of the active user
- Code: `src/main.ts:64-70` (no permission check); README install step 4
- Other products: CleanShot and Xnapper open a permission guide with a restart button.
- Seen by: 2-23, 6-55, 7-46, 8-19 — seen by 3 of 3 independent evaluators

</details>

### F140 · A failed capture looks the same as pressing Esc

- **Impact:** High — if the system capture fails for any reason, nothing happens at all, blocking the core job without a word.
- **Current experience:** The capture callback ignores the process error and only checks whether an image file exists; no file is treated as the user pressing Esc.
- **Visual:** Proposal: "Capture failed. No screenshot was taken. [Try again] [Help]"; a deliberate Esc stays quiet.
- **Recommendation:** Tell cancellation apart from failure and give a plain message for failure.
- **Tradeoff:** Errors need classifying so a deliberate cancel never alarms.
- **Decision needed:** Should a failed capture say so, and should repeated failures open troubleshooting help?
- **Verified:** read in the code (confirmed at the merge).
- **Owner's words:** "This is also important: when I create, as I said, it needs to be shortcuts so I can just do this on the fly." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: capture overlay return
- Broken: Nielsen 1, Nielsen 9; Shneiderman feedback; flow
- Code: `src/main.ts:66-69` (`execFile('screencapture', …, () => { if (fs.existsSync(tmp)) openEditor(tmp); })` — the error argument is not read)
- Seen by: 8-20 — seen by 1 of 3 independent evaluators

</details>

### F141 · Capturing needs a pointer: there is no keyboard-only way to take a screenshot

- **Impact:** High — a keyboard-only user can press ⌘⇧1 but cannot finish the capture, so the whole flow is closed before the editor opens.
- **Current experience:** "Capture region" runs the system's interactive capture, which needs a drag for a region, or Space and a click for a window. The menu offers no whole-screen or front-window capture.
- **Visual:** Before: menu "Capture region ⌘⇧1" only. After: also "Capture screen" and "Capture front window", each with a shortcut.
- **Recommendation:** Add "Capture screen" and "Capture front window", both one command with no pointer.
- **Tradeoff:** Two more items and shortcuts; whole-screen captures are larger images.
- **Decision needed:** Should Snapmark offer a capture that needs no pointer (whole screen or front window), and with what shortcut?
- **Verified:** read in the code.
- **Owner's words:** "This is also important: when I create, as I said, it needs to be shortcuts so I can just do this on the fly." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: menu bar menu, capture overlay
- Broken: WCAG 2.1.1 (A), applied to the app as a whole
- Code: `src/main.ts:64-70` (`screencapture -i -x` only), `:150`
- Other products: macOS Screenshot has ⌘⇧3 for the whole screen with no pointer.
- Seen by: 5-04

</details>

## Notifications

### F142 · The shortcut-conflict notification speaks code and offers no way out

- **Impact:** Medium — if another app owns ⌘⇧1 (several screenshot tools do), the main shortcut is dead, and the only sign is one passing notification in internal key names.
- **Current experience:** At launch, title "Snapmark", body "CommandOrControl+Shift+1 is taken by another app". It disappears, and nothing in the app lets the reviewer choose another key.
- **Visual:** Before: "CommandOrControl+Shift+1 is taken by another app". After: "⌘⇧1 is used by another app, so Capture region has no shortcut. Use the menu bar icon, or choose another shortcut."
- **Recommendation:** macOS key symbols, the consequence, and the way forward.
- **Tradeoff:** None for the wording.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code.
- **Owner's words:** "This is also important: when I create, as I said, it needs to be shortcuts so I can just do this on the fly." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: notification at launch
- Broken: Nielsen 2, Nielsen 9; writing (no system words; event · consequence · action); WCAG 3.3.1, 3.3.3
- Code: `src/main.ts:198` (`${key} is taken by another app`), `:11-12`
- Seen by: 2-22 (notification part), 4-11 (wording part), 5-35 (shortcut half), 6-56, 7-40, 8-21 — seen by 3 of 3 independent evaluators

</details>

### F143 · A failed export shows the raw error, and the notification disappears

- **Impact:** Medium — when a PDF or ZIP export fails, the reviewer gets a programmer's message, no next step, and a banner that vanishes after a few seconds.
- **Current experience:** Title "Snapmark: PDF export failed" (or ZIP); the body is the error object as text, for example "Error: Command failed: zip -r -X -q …" or "Error: ENOSPC: no space left on device, write".
- **Visual:** Before: "Snapmark: ZIP export failed / Error: Command failed: zip -r -X -q …". After: "Couldn't export the PDF: the disk is full. Free some space, then export again." (or "The session folder is missing or still syncing…").
- **Recommendation:** Map the common failures (no space, folder gone, no permission) to plain sentences with an action; keep the raw text in a log.
- **Tradeoff:** Unknown errors still need a generic fallback.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code.
- **Owner's words:** "Also I wonder what the best way of making this portable is: being able to share this as a PDF or zip it, maybe both. Having it in the cloud." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: notification after menu Export session › PDF or ZIP
- Broken: Nielsen 9; writing; rule area feedback; WCAG 3.3.1, 3.3.3
- Code: `src/main.ts:135-141` (`body: String(e)`)
- Seen by: 2-20, 4-12, 5-35 (export half), 6-47, 7-45, 8-24 — seen by 3 of 3 independent evaluators. Impact given: Medium (2-20, 4-12, 6-47, 8-24), Low (5-35, 7-45).

</details>

## Sessions folder dialog

### F144 · "Change sessions folder…" leaves every existing session behind without saying so

- **Impact:** Medium — the owner picks an iCloud Drive folder to sync his sessions; the menu then lists only what is in the new folder, and the old sessions seem to have vanished.
- **Current experience:** The dialog points Snapmark at another folder. Nothing is moved; the old sessions stay in the old folder and disappear from "Switch session". The README says it "moves new sessions elsewhere", which reads like "moves sessions".
- **Visual:** Before: "Change sessions folder…". Proposal: after the pick, "Move your 12 existing sessions to iCloud Drive/Snapmark too? [Move] [Leave them]", or rename the action "Use another sessions folder…" with a line saying existing sessions stay where they are.
- **Recommendation:** Offer to move existing sessions, or at least say before switching that they stay behind and where.
- **Tradeoff:** Moving files into a syncing folder is a real write with failure cases (disk full, sync conflicts).
- **Decision needed:** When the folder changes, should Snapmark offer to move existing sessions, or only warn that they stay?
- **Verified:** read in the code and the README.
- **Owner's words:** "Also I wonder what the best way of making this portable is: being able to share this as a PDF or zip it, maybe both. Having it in the cloud." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: menu Change sessions folder…, native folder dialog
- Broken: Nielsen 1, Nielsen 2; mental model; Tesler's law
- Code: `src/main.ts:44-55`, `:167-168`; README "Change sessions folder… moves new sessions elsewhere"
- Seen by: 1-22, 6-51, 7-38 (first half), 8-18 — seen by 3 of 3 independent evaluators

</details>

### F145 · Changing the sessions folder silently switches the active session

- **Impact:** Low — after the change the next capture goes to the newest session in the new folder (or a new one), and nothing says so.
- **Current experience:** No message; the menu's first line changes quietly to the new folder's newest session or "Session: —".
- **Visual:** Proposal: notification "Sessions now in ~/Library/Mobile Documents/…/Snapmark. Active: 2026-09-20 18.02."
- **Recommendation:** Confirm the new folder and the new active session.
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code.
- **Owner's words:** "Also I wonder what the best way of making this portable is: being able to share this as a PDF or zip it, maybe both. Having it in the cloud." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: after the folder dialog
- Code: `src/main.ts:53-54` (`active = sessions.list(root)[0] || null`)
- Seen by: 2-29, 7-38 (second half) — seen by 1 of 3 independent evaluators

</details>

### F146 · The folder dialog's explanation is never shown

- **Impact:** Low — the sentence "Choose where Snapmark keeps sessions" is set as the window title, which macOS open panels do not display, so the reviewer sees a plain Finder panel.
- **Current experience:** A standard open panel with no message.
- **Visual:** Before: no message. After: "Choose where Snapmark saves sessions. Pick a folder in iCloud Drive or Google Drive to sync them."
- **Recommendation:** Put the sentence in the dialog's message.
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code; that macOS hides the title is an assumption, not checked.
- **Owner's words:** "Also I wonder what the best way of making this portable is: being able to share this as a PDF or zip it, maybe both. Having it in the cloud." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: native folder dialog
- Code: `src/main.ts:46-50` (`title` set; no `message`)
- Seen by: 4-32 (message part)

</details>

### F147 · The folder dialog's button says "Open"

- **Impact:** Low — choosing where sessions are saved ends with a button that says "Open", which does not describe the action.
- **Current experience:** The system default button label.
- **Visual:** Before: "Open". After: "Use this folder".
- **Recommendation:** Set the button label.
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: native folder dialog
- Code: `src/main.ts:46-50` (no `buttonLabel`)
- Seen by: 4-32 (button part)

</details>

## session.md output

### F148 · session.md never says what was crossed out or approved

- **Impact:** High — the product's point is "what goes and what stays", yet an agent reading session.md cannot tell remove from approve from the text; it must find the marks in the picture, and the only key to the colours is in a clipboard prompt that may never be pasted.
- **Current experience:** In a ten-shot test session, entry 002 has a red cross over the Status column and a green tick; its text is only "Orders table" and "1. Column headers are grey on grey; raise contrast". Entry 004 contains nothing but approvals; its text is only the comment. An entry with a green box, a tick, a red box and a cross was saved as the image line alone.
- **Visual:** `002.png` and `004.png` in the `3-session10` folder; `5-marks-light.png`. Proposal `5-p-session-text.png`. Before: "Orders table · 1. Column headers are grey on grey; raise contrast". After: "Orders table · Remove: 1 cross (right third) · Keep: 1 tick (left) · 1. Column headers are grey on grey; raise contrast".
- **Recommendation:** Write one line per entry that lists the fixed-meaning marks by kind and rough position; ideally let remove and approve marks take a number and a note like markers.
- **Tradeoff:** A few more tokens per entry; a count without a note tells the agent less than a note would; numbered verdict marks add labels to the image.
- **Decision needed:** Should remove and approve marks be written into session.md as text, and should they be able to carry a note?
- **Verified:** seen on screen (session.md printed by the harness and images checked).
- **Owner's words:** "Also again, we need more elements to be clear about what should go away and what should not." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: session.md entry format; PDF; scene: quick verdict
- Broken: output-for-AI check (remove vs approve from text alone: no); WCAG 1.1.1, 1.3.1 (in the PDF); checklist accessibility 8; Nielsen 2
- Code: `src/editor.ts:602-608` (save sends notes, cards and a move count only), `src/sessions.ts:52-61`, `src/main.ts:127-133` (the key exists only in the prompt)
- Screenshots: 3-session10/002.png, 003.png, 004.png, session.md; 5-marks-light.png, 5-p-session-text.png; 6-green-box.png; 7-review.png
- Seen by: 3-02, 5-08, 6-29, 7-28, 8-27 — seen by 3 of 3 independent evaluators

</details>

### F149 · Cards have no number, so their text cannot be matched to the card on the image

- **Impact:** High — with two or three cards on one screenshot, the agent reads "- Card: …" lines and cannot tell which card on the image each is.
- **Current experience:** Cards are drawn without a number and listed in stacking order: "- Card: Card by click", "- Card: Pointing at New order", "- Card: Third card".
- **Visual:** `1-a-review.png` (card on the image, no number), `6-cards.png`. Before: "- Card: Load more should be a button". After: cards numbered in the same series as markers (or A, B…), the label drawn on the card and written in the text.
- **Recommendation:** Label cards on the image and in the text.
- **Tradeoff:** A label on each card adds ink to the image; a second numbering scheme if letters are used.
- **Decision needed:** Should cards carry a label on the image and in session.md, and share the markers' numbers or use letters?
- **Verified:** seen on screen (saved session.md).
- **Owner's words:** "It's basically for providing feedback to AI in a nice and token-efficient way." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: session.md, cards; editor canvas
- Broken: output-for-AI (every note maps to exactly one mark: only by reading the picture); uniform connectedness; Nielsen 2
- Code: `src/sessions.ts:56`, `src/editor.ts:606`
- Screenshots: 1-review.png, 1-a-review.png, 6-cards.png, 7-card.png, 7-card2.png
- Other products: Figma numbers comment pins.
- Seen by: 1-12, 3-03, 6-28, 7-29, 8-28 — seen by 3 of 3 independent evaluators

</details>

### F150 · A note with several lines breaks the numbered list, so notes get the wrong numbers

- **Impact:** High — the agent or a PDF reader can receive a different note number from the one on the screenshot.
- **Current experience:** Each note is prefixed with its number, but further lines are written without indentation. "Status pill colours are not explained⏎Add a legend" becomes "2. Status pill colours are not explained / Add a legend / 3. _(no note)_" on three unindented lines. A note containing its own numbered list rendered as four top-level items for two markers; the second marker's note showed as number four.
- **Visual:** Codex fixture `8-generated-session.md` and `8-generated-session.html`. Proposal: "1. Marker one's note" with indented sub-lines, "2. Marker two's note" stays second.
- **Recommendation:** Write multi-line notes as correctly nested Markdown, or join lines, so each marker's note stays one list item.
- **Tradeoff:** Notes need a stated policy: plain text, or Markdown with escaping.
- **Decision needed:** Should notes be kept as plain text (lines joined or indented), or allow Markdown with proper nesting?
- **Verified:** seen on screen (saved session.md) and read in the code; the compiled writer and a Markdown renderer were also exercised.
- **Owner's words:** "It's basically for providing feedback to AI in a nice and token-efficient way." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: session.md, numbered notes; PDF
- Broken: output-for-AI (note ↔ marker mapping); Postel's law; uniform connectedness; Maze consistency (cards join lines, notes do not)
- Code: `src/sessions.ts:54` (notes not joined) vs `:56` (cards joined with " / "), `src/exporter.ts:19-20`
- Evidence: `8-generated-session.md`, `8-generated-session.html`, `8-code-checks.cjs` in the codex folder
- Seen by: 6-32, 8-26 — seen by 2 of 3 independent evaluators. Impact given: High (8-26), Low (6-32).

</details>

### F151 · A card's pointer target is never written down

- **Impact:** Medium — a card that points at the New order button is written the same as a card that points at nothing; the agent must find the line in the image.
- **Current experience:** Two cards, both with pointer lines, came out as "- Card: Make this the only primary button" and "- Card: Replace with infinite scroll". Only the card's text is sent when saving, not whether or where it points.
- **Visual:** `3-handles.png` (card with a pointer line); `7-card2.png`. Proposal: "A (points at the button top right): Make this the only primary button".
- **Recommendation:** Write whether a card points, and at roughly where (or at which marker).
- **Tradeoff:** Position words are approximate; slightly longer lines.
- **Decision needed:** Should a card's line in session.md say what it points at, and should cards be able to point at a marker?
- **Verified:** seen on screen.
- **Owner's words:** "Help me think about how we can highlight stuff and potentially add UI elements, like being able to add a card and write on the card, so I can actually edit on the screen and drag and drop, size, and so on." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: session.md, cards
- Broken: output-for-AI; uniform connectedness
- Code: `src/editor.ts:606` (only `c.text.trim()` sent), `:252-285` (pointer stored on the card), `src/sessions.ts:56`
- Screenshots: 3-handles.png, 3-session10/006.png, 7-card2.png
- Seen by: 1-12, 3-03, 7-29, 8-28 — seen by 2 of 3 independent evaluators

</details>

### F152 · Moves are written only as a count

- **Impact:** Medium — with one move the agent must find the dashed outline in the image; with two, "Moved 2 elements" does not say which piece belongs to which outline or what moved.
- **Current experience:** "- Moved an element: the dashed outline is where it is now, the arrow shows where it should go." Nothing numbers the piece, the outline or the arrow.
- **Visual:** `005.png` in the `3-session10` folder; `1-a-review.png`. Proposal: moves labelled M1, M2 on the image, and "M1. Move: the Status header, from the table to the right of Total" in the text, with a note field per move.
- **Recommendation:** Treat a move like a marker: a label and an optional note.
- **Tradeoff:** One more row type in the side panel and one more note to type.
- **Decision needed:** Should each move get its own label and optional note?
- **Verified:** seen on screen (saved session.md); multi-move wording read in the code.
- **Owner's words:** "Another thing that would be nice is if I can cut out things and move them and then wherever I move the cut-out, it indicates this with an arrow or something" — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: session.md; editor side panel
- Broken: output-for-AI; Nielsen 2
- Code: `src/sessions.ts:57-60`, `src/editor.ts:607` (only a count sent)
- Screenshots: 3-session10/005.png, 1-a-review.png
- Seen by: 1-13, 3-04, 6-30, 7-30, 8-29 (notes) — seen by 3 of 3 independent evaluators

</details>

### F153 · A cut piece that was never moved is reported as a move

- **Impact:** Medium — the session can tell the agent to act on a move that never happened.
- **Current experience:** Creating a cut piece counts it as a move at once. Saving before dragging it still writes "Moved an element…", though the arrow is invisible and the piece sits where it was.
- **Visual:** Proposal: "Cut selected → waiting for a destination"; only after it is dragged: "Move recorded".
- **Recommendation:** Write a move only after the piece has actually moved.
- **Tradeoff:** Needs a small tolerance for tiny drags.
- **Decision needed:** Should an unmoved cut be left out of session.md silently, or should saving ask the reviewer to finish it?
- **Verified:** read in the code (confirmed at the merge).
- **Owner's words:** "Another thing that would be nice is if I can cut out things and move them and then wherever I move the cut-out, it indicates this with an arrow or something" — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: Cut & move; session.md
- Broken: Nielsen 1, Nielsen 2; Zeigarnik effect
- Code: `src/editor.ts:607` (`moves` = every piece with links), `:390` (arrow only visible after moving), `src/sessions.ts:57-60`
- Seen by: 8-29 — seen by 1 of 3 independent evaluators

</details>

### F154 · session.md has no key to what the marks mean

- **Impact:** Medium — an agent or teammate who gets session.md, the ZIP or the PDF without the copied prompt has nothing saying a cross means remove and a tick means keep.
- **Current experience:** The meaning of the marks is only in the text "Copy prompt for AI" puts on the clipboard. session.md starts "# <session name>" and goes straight to the entries.
- **Visual:** Before: "# audit" then entries. After: "# audit" then one line: "Marks: red cross or hatched = remove · green tick or thumbs up = keep · numbered circle = note below · card = text on the image · dashed outline + arrow = move".
- **Recommendation:** Write a one-line key under the session heading when the session is created, generated from the same list as the prompt.
- **Tradeoff:** A few tokens per session.
- **Decision needed:** Should every session.md start with a one-line key to the marks?
- **Verified:** read in the code.
- **Owner's words:** "It's basically for providing feedback to AI in a nice and token-efficient way." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: session.md header (and so the ZIP)
- Code: `src/sessions.ts:31`, `src/main.ts:127-133`
- Seen by: 1-14, 3-02 (legend part), 8-27 (legend part) — seen by 1 of 3 independent evaluators
- Related: F169, F120

</details>

### F155 · Boxes, arrows, highlights and pen strokes leave no trace in the text

- **Impact:** Medium — anything pointed at with a box, ellipse, arrow, highlight or pen stroke exists only in pixels; the note explaining it must sit on a separate marker and nothing ties the two.
- **Current experience:** Entry 010 has an arrow at the Edit · Delete column; its text lists only two markers. Entry 001 has a box around the header actions; its text mentions only markers 1 and 2. The prompt says "Boxes, ellipses and arrows point at what a note is about", but no text says which.
- **Visual:** `010.png` and `001.png` in the `3-session10` folder.
- **Recommendation:** Let a box, ellipse or arrow take a number and a note on request, or list those marks in the entry's summary line.
- **Tradeoff:** Numbering every shape clutters the image; numbering only on request avoids that.
- **Decision needed:** Should shapes be able to carry a numbered note of their own?
- **Verified:** seen on screen.
- **Owner's words:** "For instance mark something on the screen and then be able to write something in a Markdown doc where it puts the image automatically in the Markdown doc." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: session.md
- Broken: output-for-AI (every note maps to one mark)
- Code: `src/editor.ts:602-608`
- Screenshots: 3-session10/001.png, 010.png
- Seen by: 3-05, 6-29 (pointing-mark part), 7-28 (pointing-mark part) — seen by 2 of 3 independent evaluators

</details>

### F156 · Images are 96% of a session's token cost, and nothing helps keep that down

- **Impact:** Medium — the owner asked for "token-efficient"; a realistic ten-capture session costs about 10,000 image tokens and 360 text tokens, and each full-window Retina capture about 1,530 tokens whatever it shows.
- **Current experience:** Captures are shrunk only to the model's own ceiling (1568 px on the long edge, about 1.15 megapixels), so Snapmark saves nothing below what the model would do anyway. Empty space around the marks is kept.
- **Visual:** The token table in the appendix; the `3-session10` folder.
- **Recommendation:** Offer a smaller image size for review sessions (for example a 1000 px long edge, about 750 tokens for 16:9, half the cost), and optionally crop to the marked area plus a margin.
- **Tradeoff:** Smaller images lose fine detail; pixel-level feedback needs full size, so this should be a choice.
- **Decision needed:** Should Snapmark save smaller images by default, with full size as an option?
- **Verified:** seen on screen (measured on the saved files).
- **Owner's words:** "It's basically for providing feedback to AI in a nice and token-efficient way." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: saved images, session.md
- Code: `src/main.ts:101-112` (`fitForAI` limits equal the model's own)
- Estimate: tokens ≈ width × height / 750 after the model's resize; text ≈ characters / 3.8
- Seen by: 3-35 (the code-only evaluator measured only serialization: 2,631 bytes for a ten-entry fixture, no real images)

</details>

### F157 · A full-screen capture on a large display becomes too small to read after resizing

- **Impact:** Medium — a 5K full-screen capture is shrunk to 28%; 13 pt interface text ends up about 7 px tall, which an agent cannot reliably read, and nothing warns.
- **Current experience:** The saved image is 1430 × 804 px. The test mock was scaled up, so its text stayed readable; the 7 px figure is calculated for real interface text.
- **Visual:** `3-saved-large-5k.png`. Proposal, in the side panel: "This capture will be scaled to 28%: small text may not be readable. Capture a smaller area?"
- **Recommendation:** Warn when a capture will be shrunk below about half.
- **Tradeoff:** One more message on large captures.
- **Decision needed:** Should the editor warn when a capture will be scaled down a lot?
- **Verified:** assumption, not checked, for real interface text; the resize factor was measured.
- **Owner's words:** "It's basically for providing feedback to AI in a nice and token-efficient way." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: saved image; editor side panel
- Code: `src/main.ts:106-112`
- Seen by: 3-36

</details>

### F158 · Every image has the alt text "Screenshot 1", "Screenshot 2" …

- **Impact:** Medium — a teammate reading the PDF or Markdown with a screen reader, and an agent that reads text before images, learn nothing from the alt text.
- **Current experience:** Each entry is "![Screenshot 1](img/001.png)", even for an entry with nine marks; the comment sits right below the image but not in the alt text.
- **Visual:** `5-p-session-text.png`. Before: "![Screenshot 1](img/001.png)". After: "![Screenshot 1: Orders page. Remove: 'Dashboard' link. Keep: 'Paid' badge. 1 marker, 1 card.](img/001.png)".
- **Recommendation:** Build the alt text from what the entry already knows: the comment's first line and a short count of marks by kind.
- **Tradeoff:** Longer image lines cost a few tokens per entry.
- **Decision needed:** Should the alt text carry the comment and a summary of the marks, or only the comment?
- **Verified:** seen on screen (session.md printed by the harness).
- **Owner's words:** "It's basically for providing feedback to AI in a nice and token-efficient way." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: session.md, PDF
- Broken: WCAG 1.1.1 (A); checklist accessibility 6
- Code: `src/sessions.ts:52`
- Seen by: 5-07, 7-32 (alt-text part) — seen by 1 of 3 independent evaluators

</details>

### F159 · A marker with no note is written as "_(no note)_"

- **Impact:** Low — for the agent it is a line it cannot act on; in the PDF a reader sees "(no note)" in italics, which looks like an error.
- **Current experience:** "3. _(no note)_" and "4. _(no note)_" in a test entry.
- **Visual:** Before: "2. _(no note)_". After: "2. (marker only: see the image)", or the line left out while keeping the numbers.
- **Recommendation:** Decide whether an unnoted marker means something; if so, say what; if not, write less.
- **Tradeoff:** Leaving the line out breaks the one-to-one numbering between image and list.
- **Decision needed:** Should a marker without a note still appear in session.md, and with what words?
- **Verified:** seen on screen (harness output).
- **Owner's words:** "It's basically for providing feedback to AI in a nice and token-efficient way." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: session.md
- Code: `src/sessions.ts:54`
- Seen by: 3-07, 4-25, 6-31, 7-31 — seen by 2 of 3 independent evaluators
- Related: F085

</details>

### F160 · The comment is written into session.md without a label

- **Impact:** Low — the agent sees a bare paragraph between the image and the numbered notes and must infer that it is the reviewer's overall remark.
- **Current experience:** "Orders dashboard, overnight build" appears as a plain line under the image.
- **Visual:** Before: "Orders dashboard, overnight build". After: "**Comment:** Orders dashboard, overnight build", or the comment used as the entry heading.
- **Recommendation:** Label the comment, or use it as the entry's heading.
- **Tradeoff:** A few tokens per entry.
- **Decision needed:** Should the comment be labelled, or become the entry's title?
- **Verified:** seen on screen (saved session.md).
- **Owner's words:** "First I want to have the functionality that when I create a new session it creates Markdown. I can add screenshots to the Markdown and augment the Markdown: draw into the image, comment on it, and add a reference with text on certain elements, pretty much that." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: session.md
- Broken: Nielsen 2; output-for-AI
- Code: `src/sessions.ts:53`
- Seen by: 1-34, 6-34 — seen by 1 of 3 independent evaluators

</details>

### F161 · Line breaks on a card become " / ", which collides with slashes in the text

- **Impact:** Low — "Make this a filter / not a link" cannot be told from a card that literally says "filter / link".
- **Current experience:** session.md: "- Card: Make this a filter / not a link".
- **Visual:** Harness session.md output.
- **Recommendation:** Keep a card's lines as an indented block under "- Card:", or join them with a space.
- **Tradeoff:** A block takes more lines.
- **Decision needed:** Should card line breaks become an indented block or a plain space?
- **Verified:** seen on screen (harness output).
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: session.md, cards
- Code: `src/sessions.ts:56`
- Seen by: 4-26

</details>

### F162 · A comment starting with "#" becomes a heading that breaks the session's structure

- **Impact:** Low — typing "# Orders page overnight build" as the comment produces a top-level heading after the entry heading, in the Markdown, the PDF and for the agent.
- **Current experience:** Saved: "## 001 · 15:20", the image, then "# Orders page overnight build".
- **Visual:** `6-a-comment-heading.png`. After: the comment written as literal text.
- **Recommendation:** Escape leading Markdown block syntax in comments and notes.
- **Tradeoff:** Reviewers who want Markdown in comments lose it.
- **Decision needed:** Should comments and notes be written as literal text, or allow Markdown?
- **Verified:** seen on screen (saved session.md).
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor Comment; session.md; PDF
- Broken: Postel's law
- Code: `src/sessions.ts:53`
- Screenshots: 6-review.png, 6-a-comment-heading.png
- Seen by: 6-33 — seen by 1 of 3 independent evaluators

</details>

### F163 · Entry headings are a number and a time only

- **Impact:** Low — in a long session "## 001 · 14:03 … ## 010 · 14:41" gives the reviewer, a PDF reader and the agent nothing to navigate by.
- **Current experience:** "# <session>" then one "## 001 · 15:21" per entry; the heading levels are right, the words are empty.
- **Visual:** Before: "## 001 · 15:21". After: "## 001 · Orders table: status colours (15:21)".
- **Recommendation:** Put the comment's first line, cut to about 60 characters, in the heading when there is one.
- **Tradeoff:** The comment appears twice unless the body skips its first line.
- **Decision needed:** Should each entry's heading carry the first line of its comment?
- **Verified:** seen on screen (session.md printed by the harness).
- **Owner's words:** "It's basically for providing feedback to AI in a nice and token-efficient way." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: session.md, PDF outline
- Broken: WCAG 2.4.6 Headings and Labels (AA); chunking; checklist content 1
- Code: `src/sessions.ts:52`
- Seen by: 5-33, 6-35, 7-32 (heading part) — seen by 2 of 3 independent evaluators

</details>

### F164 · Entry headings carry a time but no date

- **Impact:** Low — a session kept open over several days has entries "## 004 · 09:12" with no day.
- **Current experience:** "## 001 · 15:20".
- **Visual:** Before: "## 004 · 09:12". After: "## 004 · 26 Sep 09:12" when the day differs from the session's.
- **Recommendation:** Add the date when it differs from the session's.
- **Tradeoff:** Slightly longer headings.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: session.md
- Code: `src/sessions.ts:51-52`
- Seen by: 7-32 (date part) — seen by 1 of 3 independent evaluators

</details>

### F165 · Time is written "14.03" in the session name and "14:03" in each heading

- **Impact:** Low — two formats for one thing in the same file and the same menu.
- **Current experience:** "# 2026-09-25 14.03", then "## 001 · 14:03". The dot is there because a colon cannot go in a macOS folder name.
- **Visual:** Before: "14.03" / "14:03". After: one format in both.
- **Recommendation:** Use one time format, or name sessions by date plus a word the reviewer types.
- **Tradeoff:** "14.03" reads less like a time.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen (harness output) and read in the code.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: session.md, menu, notifications
- Broken: Nielsen 4
- Code: `src/sessions.ts:14-15`, `:51-52`
- Seen by: 4-27, 6-36 — seen by 1 of 3 independent evaluators

</details>

### F166 · One screenshot is numbered three ways: "001", "Screenshot 1" and "img/001.png"

- **Impact:** Low — a person talking to the agent may say "screenshot 1" or "001"; both work, but the file shows both.
- **Current experience:** "## 001 · 14:03" / "![Screenshot 1](img/001.png)".
- **Visual:** Before: "## 001 · 14:03". After: "## Screenshot 1 · 14:03", keeping 001 only in the file name.
- **Recommendation:** One number style in headings and alt text.
- **Tradeoff:** Headings no longer sort as text, which does not matter inside one file.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen (harness output).
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: session.md
- Code: `src/sessions.ts:52`
- Seen by: 4-28

</details>

### F167 · The move line is unclear about what "now" means

- **Impact:** Low — "the dashed outline is where it is now" can mean now on this image or now in the build; the agent must infer that the arrow runs from the outline to the piece.
- **Current experience:** "- Moved an element: the dashed outline is where it is now, the arrow shows where it should go."
- **Visual:** Before: the line above. After: "- Move: the dashed outline marks where the element is today; the arrow points to where it should go."
- **Recommendation:** As above.
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen (harness output).
- **Owner's words:** "Another thing that would be nice is if I can cut out things and move them and then wherever I move the cut-out, it indicates this with an arrow or something" — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: session.md
- Code: `src/sessions.ts:57-60`
- Seen by: 4-35

</details>

### F168 · Screenshots are numbered in the order they are saved, not taken

- **Impact:** Low — with two editors open, whichever is saved first gets the lower number, so session.md may not follow the order the screens were reviewed in.
- **Current experience:** The entry number is assigned when saving.
- **Visual:** None. Proposal: number by capture time, or show "#7" in the editor as soon as it opens.
- **Recommendation:** Decide the order and show the number early.
- **Tradeoff:** Reserving numbers at capture leaves gaps when an editor is discarded.
- **Decision needed:** Should entries follow capture order or save order?
- **Verified:** read in the code.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: session.md numbering
- Code: `src/sessions.ts:46-48`
- Seen by: 2-33

</details>

## PDF export

### F169 · The PDF for a teammate has no key to what the marks mean

- **Impact:** Medium — a person reading the PDF gets headings, images and notes, but nothing saying red cross = remove, green tick = approve, or what the dashed outline is; the agent gets that key through the prompt, the person does not.
- **Current experience:** The PDF is session.md rendered as it is: the session name as the title, then the entries.
- **Visual:** Proposal: a short "How to read this" key under the title, in the same words as the prompt.
- **Recommendation:** Start every PDF with the key to the marks.
- **Tradeoff:** A little more text at the top of every PDF.
- **Decision needed:** Should exported PDFs start with a key to the marks?
- **Verified:** read in the code.
- **Owner's words:** "Also I wonder what the best way of making this portable is: being able to share this as a PDF or zip it, maybe both. Having it in the cloud." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: PDF export; scene: sharing with a person
- Code: `src/exporter.ts:19-28`
- Seen by: 4-33, 1-14 (PDF part)

</details>

### F170 · The PDF has no structure for screen readers

- **Impact:** Medium — a teammate using a screen reader gets a flat PDF with no headings, no lists and no image descriptions.
- **Current experience:** The PDF is printed without the tagged-PDF option.
- **Visual:** Before: untagged PDF. After: tagged PDF with headings, lists and alt text.
- **Recommendation:** Print a tagged PDF.
- **Tradeoff:** Slightly larger files.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code; the PDF itself was not opened.
- **Owner's words:** "Also I wonder what the best way of making this portable is: being able to share this as a PDF or zip it, maybe both. Having it in the cloud." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: PDF export
- Broken: WCAG 1.3.1 (A), 1.1.1 (A) as applied to PDFs
- Code: `src/exporter.ts:38` (`printToPDF({ pageSize: 'A4', printBackground: true })`, no `generateTaggedPDF`)
- Seen by: 5-32 (tagging part)

</details>

### F171 · PDF export shows nothing while it runs

- **Impact:** Medium — for a long session the PDF takes a few seconds; the menu closes and nothing happens until Finder opens, so the reviewer may export again.
- **Current experience:** Export › PDF renders in a hidden window; no progress and no notification until Finder reveals the file.
- **Visual:** Proposal: the menu item reads "Exporting PDF…" (disabled) until done, then "PDF exported. [Show in Finder]".
- **Recommendation:** Show that an export is running, and ignore a second export of the same kind until it ends.
- **Tradeoff:** A status place must stay findable after the menu closes.
- **Decision needed:** Should export progress show in the menu item, or in a notification?
- **Verified:** read in the code.
- **Owner's words:** "Also I wonder what the best way of making this portable is: being able to share this as a PDF or zip it, maybe both. Having it in the cloud." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: menu Export session › PDF
- Broken: Nielsen 1; Doherty threshold; rule area progress
- Code: `src/main.ts:135-141`, `src/exporter.ts:31-45`
- Seen by: 2-19, 7-43 (PDF part), 8-23 (PDF part) — seen by 2 of 3 independent evaluators. Impact given: Medium (8-23), Low (2-19, 7-43).

</details>

### F172 · Exporting the PDF again silently replaces the one already shared

- **Impact:** Low — a PDF sent to a teammate is replaced by the next export under the same name; anyone opening it from a synced folder sees it change.
- **Current experience:** "<session>.pdf" in the session folder is rewritten on every export.
- **Visual:** Proposal: add the export time or entry count to the name ("2026-09-25 14.30 · 10 shots.pdf"), or keep overwriting and say "Replaced the earlier export".
- **Recommendation:** Decide whether exports are snapshots or always the latest, and say so.
- **Tradeoff:** Timed names pile up files in the session folder.
- **Decision needed:** Should each PDF export be a new file, or replace the last one as today?
- **Verified:** read in the code.
- **Owner's words:** "Also I wonder what the best way of making this portable is: being able to share this as a PDF or zip it, maybe both. Having it in the cloud." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: PDF export
- Broken: Nielsen 5; rule area local work and external writes
- Code: `src/exporter.ts:32` (same name), `:39` (overwrites)
- Seen by: 2-21, 6-48, 7-44 — seen by 2 of 3 independent evaluators

</details>

### F173 · The PDF has no title

- **Impact:** Low — the PDF's document title is empty, so a viewer or screen reader shows the file name or nothing.
- **Current experience:** The page the PDF is printed from has no title.
- **Visual:** Before: title blank. After: title = session name.
- **Recommendation:** Give the export page the session name as its title.
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: PDF export
- Broken: WCAG 2.4.2 (A) as applied to PDFs
- Code: `src/exporter.ts:21` (no `<title>`)
- Seen by: 5-32 (title part)

</details>

### F174 · The PDF does not declare its language

- **Impact:** Low — a screen reader may read the PDF with the wrong voice or pronunciation.
- **Current experience:** The export page has no language set.
- **Visual:** Before: no language. After: English declared.
- **Recommendation:** Declare English on the export page.
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: PDF export
- Broken: WCAG 3.1.1 (A)
- Code: `src/exporter.ts:21`
- Seen by: 5-30 (PDF half)

</details>

## ZIP export

### F175 · ZIP export shows nothing while it runs

- **Impact:** Medium — the menu closes and nothing happens until Finder opens; a second click starts a second export.
- **Current experience:** No progress or busy state; completion only by Finder revealing the file.
- **Visual:** Proposal: "Exporting ZIP…" (disabled) until done.
- **Recommendation:** Show that the export is running and ignore repeats until it ends.
- **Tradeoff:** As for the PDF.
- **Decision needed:** Should export progress show in the menu item, or in a notification?
- **Verified:** read in the code.
- **Owner's words:** "Also I wonder what the best way of making this portable is: being able to share this as a PDF or zip it, maybe both. Having it in the cloud." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: menu Export session › ZIP
- Broken: Nielsen 1; Doherty threshold
- Code: `src/main.ts:135-141`, `src/exporter.ts:12-16`
- Seen by: 7-43 (ZIP part), 8-23 (ZIP part) — seen by 2 of 3 independent evaluators. Impact given: Medium (8-23), Low (7-43).

</details>

### F176 · Exporting the ZIP again silently replaces the earlier one

- **Impact:** Low — a ZIP already sent is replaced by the next under the same name, with no warning.
- **Current experience:** "<session>.zip" is deleted and rewritten on every export.
- **Visual:** Proposal: as for the PDF, a time or count in the name, or "Replaced the earlier export".
- **Recommendation:** Decide whether exports are snapshots or always the latest, and say so.
- **Tradeoff:** Old exports pile up.
- **Decision needed:** Should each ZIP export be a new file, or replace the last one as today?
- **Verified:** read in the code.
- **Owner's words:** "Also I wonder what the best way of making this portable is: being able to share this as a PDF or zip it, maybe both. Having it in the cloud." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: ZIP export
- Code: `src/exporter.ts:13-14` (`fs.rmSync(out)` then rewrite)
- Seen by: 2-21, 6-48, 7-44 — seen by 2 of 3 independent evaluators

</details>

## First run and install

### F177 · On first launch nothing appears: no window, no Dock icon, no hint

- **Impact:** High — after "Open Anyway" Snapmark starts as a small corner-and-dot icon among the menu bar icons, possibly behind the notch, with no word about where it lives or about ⌘⇧1.
- **Current experience:** The app hides its Dock icon, builds the menu and waits. The README says "It lives in the menu bar as the corner-and-dot icon."
- **Visual:** Proposal: on first launch only, a notification "Snapmark is in your menu bar. Press ⌘⇧1 to capture a region.", or a small window with the two shortcuts and "Capture now".
- **Recommendation:** A one-time first-run hint naming where the app lives and the capture shortcut.
- **Tradeoff:** One extra notification or window, once.
- **Decision needed:** What should the first launch show: a notification, or a small welcome window?
- **Verified:** read in the code.
- **Owner's words:** "I also wonder: where do I access the session? Is this in the toolbar of my Mac? Is this where I am supposed to see it or where would I see that?" — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: first run
- Broken: Nielsen 1, Nielsen 10; paradox of the active user; selective attention; checklist navigation 1
- Code: `src/main.ts:185-200`
- Seen by: 6-54, 7-47 — seen by 2 of 3 independent evaluators. Impact given: High (6-54), Medium (7-47).

</details>

### F178 · Updates are offered but cannot install on the current unsigned build

- **Impact:** Medium — per the README, macOS refuses updates for ad-hoc signed apps, yet the menu offers "Check for updates…" and a downloaded update announces it will install on quit, then does not.
- **Current experience:** The owner deferred signing; "Check for updates…" stays enabled in every installed build and never says automatic install cannot work.
- **Visual:** Proposal: until signing is done, the item reads "Updates: download from GitHub…" and opens the releases page, or an available update says "Version 0.3.0 is available. Download it from GitHub (automatic updates need a signed build)".
- **Recommendation:** Do not promise an automatic install the app cannot perform.
- **Tradeoff:** Updating by hand until signing lands.
- **Decision needed:** Until the app is signed, should the menu link to the releases page instead of checking?
- **Verified:** read in the code and the README; not run.
- **Owner's words:** "defer delveoper-id to later. do the rest in the meantime" — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: menu Check for updates…, updater notification; installed app
- Broken: Nielsen 1, Nielsen 9
- Code: `src/main.ts:121-124`; README "Auto-update"
- Seen by: 6-53, 7-39 (unsigned part) — seen by 2 of 3 independent evaluators

</details>

### F179 · Installing needs a trip to System Settings to get past macOS's security block

- **Impact:** Medium — a first-time user, or a teammate the owner shares the app with, meets a macOS warning that the app cannot be checked, which reads as unsafe.
- **Current experience:** The README tells the user to open System Settings › Privacy & Security › Open Anyway. Signing was deferred by the owner.
- **Visual:** None (system dialog). Proposal: a picture of the "Open Anyway" button in the README and on the release page.
- **Recommendation:** Keep this as a known cost until signing, and make the step easier to follow with a picture.
- **Tradeoff:** Signing costs a yearly Apple Developer fee.
- **Decision needed:** Signing stays deferred as you asked; should the README and release page show a picture of the Open Anyway step until then?
- **Verified:** owner's preference (the deferral); the install step read in the README.
- **Owner's words:** "defer delveoper-id to later. do the rest in the meantime" — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: DMG, first launch
- Broken: Nielsen 10; trust
- Code: README install step 3
- Seen by: 7-48 — seen by 1 of 3 independent evaluators (the code-only evaluator respected the deferral and did not raise it)

</details>

## App-wide

### F180 · A saved screenshot cannot be reopened, corrected or removed in the app

- **Impact:** High — noticing after capture 8 that capture 3 marked the wrong button means capturing again and leaving a stale entry; a typo in a note can be fixed only by editing the Markdown by hand, and the marks are flattened into the image for good.
- **Current experience:** "Add to session" writes a flat image and appends text, then closes. Nothing in the app reopens an entry, edits its notes, deletes it or reorders it; the capture itself is deleted when the editor closes.
- **Visual:** Proposal `1-proposal-editor.png` (earlier entries, "click to reopen"); menu "Edit last screenshot" and "Remove last screenshot".
- **Recommendation:** Keep the marks as data next to each image so an entry can be reopened in the editor and saved over itself; at least allow removing the last entry.
- **Tradeoff:** More files per session and an update path for session.md, not just appends.
- **Decision needed:** Should saved screenshots stay editable within a session, or at least the last one?
- **Verified:** read in the code.
- **Owner's words:** "Basically reviewing the designs, doing a complete UX/UI review of an overnight build, providing detailed feedback on different elements." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor ↔ session; menu bar menu
- Broken: Nielsen 3; Shneiderman easy reversal; navigation and return
- Code: `src/sessions.ts:36-64` (append only), `src/editor.ts:596-609`, `src/main.ts:84`, `:143-183`
- Other products: macOS Screenshot markup keeps edits until the thumbnail is dismissed; Figma keeps everything editable; Xnapper and CleanShot reopen from history (reported).
- Seen by: 1-23, 6-43, 8-13 — seen by 2 of 3 independent evaluators. Impact given: High (1-23, 8-13), Medium (6-43).

</details>

### F181 · An editor that falls behind other windows has no way back

- **Impact:** Medium — Snapmark hides its Dock icon, so an editor behind the app being reviewed is not in the Dock and the menu does not list it; the screenshot seems lost, and is lost for good on Quit.
- **Current experience:** The menu shows "Session: …, Capture region, New session, Switch session, …" but nothing about screenshots waiting in open editors.
- **Visual:** Proposal (menu): "Open editors (2) ▸ 15:20 · 15:24".
- **Recommendation:** List open editors in the menu bar menu, or show the Dock icon while an editor is open.
- **Tradeoff:** A Dock icon that comes and goes can feel busy; a menu list is quieter.
- **Decision needed:** Should open editors be reachable from the menu bar menu, from the Dock, or both?
- **Verified:** read in the code; the ⌘Tab behaviour is an assumption, not checked.
- **Owner's words:** "I also wonder: where do I access the session? Is this in the toolbar of my Mac? Is this where I am supposed to see it or where would I see that?" — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: app-wide (menu bar menu, Dock, window list)
- Broken: checklist navigation 5; Nielsen 6
- Code: `src/main.ts:187` (`app.dock?.hide()`), `:147-181`
- Seen by: 2-13

</details>

### F182 · The editor may inherit Electron's stock menu shortcuts, including Reload

- **Impact:** Medium, if confirmed — ⌘R would reload the editor and wipe every mark; ⌥⌘I would open developer tools in the shipped app.
- **Current experience:** The app never sets its own application menu, so Electron installs its default one (Reload ⌘R, Force Reload ⇧⌘R, Toggle Developer Tools ⌥⌘I, Close Window ⌘W, Quit ⌘Q, Edit). With the Dock icon hidden that menu may not be visible, but its keys may still work.
- **Visual:** None; needs a hand test in the installed app.
- **Recommendation:** Set a minimal menu of the app's own: Edit (Undo, Cut, Copy, Paste, Select All), View zoom on purpose, Close ⌘W, Quit; no Reload or developer tools.
- **Tradeoff:** A little more code to keep.
- **Decision needed:** Should the editor have its own minimal menu without Reload and developer tools?
- **Verified:** assumption, not checked (read in the code: no application menu is set; Electron's documented default menu).
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor windows, app-wide keys
- Broken: rule area platform conventions
- Code: no `Menu.setApplicationMenu` in `src/main.ts`; `:187`
- Seen by: 4-09, 1 (sitemap note 7: "whether its key equivalents … still fire in the editor was not checked")

</details>

### F183 · The two global shortcuts cannot be changed

- **Impact:** Medium — if ⌘⇧1 or ⌘⇧2 collides with another tool the reviewer uses, capturing on the fly is gone for good; there is no setting.
- **Current experience:** Both are fixed in the code; the menu shows them but they cannot be edited.
- **Visual:** Proposal: menu "Shortcuts…" with two recorder fields; after a clash, "Capture shortcut unavailable: ⌘⇧1. [Change shortcut]".
- **Recommendation:** Let the reviewer rebind both shortcuts.
- **Tradeoff:** The first settings screen in an app that has none; user shortcuts need validation.
- **Decision needed:** Should the capture and new-session shortcuts be changeable?
- **Verified:** read in the code.
- **Owner's words:** "This is also important: when I create, as I said, it needs to be shortcuts so I can just do this on the fly." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: global shortcuts; menu bar menu
- Broken: Nielsen 7; Shneiderman shortcuts
- Code: `src/main.ts:11-12`
- Other products: macOS Screenshot shortcuts are editable in System Settings; Xnapper and CleanShot let you record your own.
- Seen by: 4-11 (change part), 6-57, 7-41, 8-21 — seen by 3 of 3 independent evaluators. Impact given: Medium (4-11, 6-57, 8-21), Design choice (7-41).

</details>

### F184 · "Note" means three different things

- **Impact:** Medium — the reviewer and the agent see "note" for the key-5 group, for a marker's text and for a card, which behave and export differently.
- **Current experience:** Key 5's group is "Note" (tooltip "Note: Numbered → Card"). A marker's field says "Note for 1". The README calls a card "a sticky note you type on". The prompt says "The numbered notes below it refer to the numbered markers". A card's text is written as "- Card: …", not a note.
- **Visual:** `1-a-names.png`. Before: group "Note", "Note for 1", card "a sticky note". After: "note" only for a marker's text; the group named by what it adds; a card only a "card".
- **Recommendation:** Reserve "note" for the text of a numbered marker.
- **Tradeoff:** Renaming touches the README, prompt and toolbar at once.
- **Decision needed:** Should "note" mean only the text of a numbered marker?
- **Verified:** read in the code; hint text seen on screen.
- **Owner's words:** "First I want to have the functionality that when I create a new session it creates Markdown. I can add screenshots to the Markdown and augment the Markdown: draw into the image, comment on it, and add a reference with text on certain elements, pretty much that." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: toolbar tooltip, References panel, README, copied prompt
- Broken: one meaning per word; Nielsen 4
- Code: `src/editor.ts:52-57`, `:588`, `src/main.ts:130`
- Other products: Figma separates "comments" (pinned remarks) from FigJam "stickies".
- Seen by: 1-04, 6-27 (note part)

</details>

### F185 · The numbered marker goes by four names

- **Impact:** Medium — the main object of the main scene is called something different in the toolbar, the hint, the panel and the output, so a first-time user cannot tell whether a "reference", a "numbered" and a "note" are one thing or three.
- **Current experience:** Toolbar "5 Numbered" (an adjective with no noun); tooltip "Note: Numbered → Card"; hint "add a numbered marker with a note"; panel heading "References"; field "Note for 1"; prompt "numbered notes … numbered markers"; session.md an unlabelled "1. …". The owner's own words were "references" and "nodes".
- **Visual:** `1-a-names.png` ("Numbered" and "References" boxed), `4-empty-annotated.png`, `4-verdict-annotated.png`, `6-review.png`, `7-review.png`. Proposal: "5 Marker"; heading "Notes" (or "References" everywhere); field "Note for marker 1".
- **Recommendation:** One noun for the numbered circle and one for its text, used in the toolbar, panel, hint, README, prompt and session.md.
- **Tradeoff:** "References" is the owner's own word; dropping it moves away from how he first described it.
- **Decision needed:** Which words should name the numbered circle and its list: marker and notes, or reference?
- **Verified:** seen on screen and read in the code.
- **Owner's words:** "I need a tool where I can create screenshots and augment them: draw on them · add crosses for a cross through · add nodes · put in references" — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: toolbar button 5 and tooltip, side panel heading and fields, hint, README, prompt, session.md
- Broken: Nielsen 4; Shneiderman consistency; one vocabulary; checklist content 1
- Code: `src/editor.ts:55` ("Numbered"), `:80`, `:588`, `src/editor.html:189-192` ("References"), `src/main.ts:130`, `src/sessions.ts:54`
- Other products: CleanShot-style tools say "counter" or "step"; Figma's numbered pins are "comments".
- Seen by: 1-05, 4-15, 4-16, 6-27, 7-15 — seen by 2 of 3 independent evaluators. The code-only evaluator's vocabulary table reaches the same conclusion ("excess terminology for one workflow").

</details>

### F186 · One saved screenshot has several names: screenshot, entry, shot, capture

- **Impact:** Low — the words drift between the editor, the prompt and the README, so the reviewer and the agent read different words for the same thing.
- **Current experience:** Menu "Capture region"; editor "What is this screenshot about?"; session.md alt text "Screenshot 1"; prompt "Each entry is an annotated screenshot"; README "Discard the screenshot" and "captures"; button "Add to session" names none.
- **Visual:** Before: capture / screenshot / entry / image. After: "screenshot" for the thing, "capture" only as the verb; prompt "Each numbered section is one annotated screenshot".
- **Recommendation:** Two words (the thing and the action) used everywhere, settled in the glossary.
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code; the placeholder seen on screen.
- **Owner's words:** "I need a tool where I can create screenshots and augment them: draw on them · add crosses for a cross through · add nodes · put in references" — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: menu, editor, session.md, prompt, README
- Broken: one meaning per word
- Code: `src/main.ts:130`, `:150`, `src/sessions.ts:52`, `src/editor.html:190`, `:195`
- Seen by: 1-06, 4-14

</details>

### F187 · "Mark" names both one tool group and every annotation

- **Impact:** Low — a reader cannot tell whether "mark" means a box or ellipse, or anything drawn.
- **Current experience:** Key 1's group is "Mark" (Box, Ellipse) in its tooltip. The README says "Mark it: a box, an arrow, a cross…" and "Select: move, resize or delete (⌫) any mark"; the product is Snapmark.
- **Visual:** Before: group "Mark" (Box, Ellipse). After: group "Shape" or "Point at"; "mark" kept for anything drawn.
- **Recommendation:** Keep "mark" as the umbrella word and rename group 1.
- **Tradeoff:** One more word to settle in the glossary.
- **Decision needed:** Should "mark" stay the general word for anything drawn, with group 1 renamed to "Shape"?
- **Verified:** read in the code and the README.
- **Owner's words:** "For instance mark something on the screen and then be able to write something in a Markdown doc where it puts the image automatically in the Markdown doc." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: toolbar tooltip, README
- Broken: one word, two meanings
- Code: `src/editor.ts:18`; README "Mark it:", "any mark"
- Other products: Apple calls the feature "Markup"; Xnapper says "annotations".
- Seen by: 1-03, 4-20 (rename part)

</details>

### F188 · "Approve" and "keep" name the same mark

- **Impact:** Low — the tooltip calls the green group "Approve", the prompt "keep as is", the README "keep this".
- **Current experience:** As above; the owner uses both "approving" and "what should not [go away]".
- **Visual:** Before: Approve / keep as is / keep this. After: one word everywhere, for example "approve" with "approved: keep as is" in the prompt.
- **Recommendation:** Pick one word.
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code and the README.
- **Owner's words:** "Also again, we need more elements to be clear about what should go away and what should not. Maybe: … a tick for approving, or kind of like a thumbs up or something for approval in green" — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: toolbar tooltip, prompt, README
- Code: `src/editor.ts:44`, `src/main.ts:131`
- Seen by: 1-16, 4-18 (wording part)

</details>

### F189 · Right-click does nothing anywhere in the editor

- **Impact:** Low — on macOS right-clicking a text field offers Cut, Copy, Paste and spelling; here the Comment and note fields may show no menu, and a mark offers no Delete or Duplicate.
- **Current experience:** No context menu is set up.
- **Visual:** None.
- **Recommendation:** The standard text menu in fields; on a mark, Delete, Duplicate and Bring to front.
- **Tradeoff:** More menus to keep in step with the keys.
- **Decision needed:** Should marks have a right-click menu?
- **Verified:** read in the code (no context-menu handling); that nothing appears is an assumption, not checked.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor fields and canvas
- Broken: rule area platform conventions
- Code: no `context-menu` handling in `src/main.ts` or `src/editor.ts`
- Seen by: 4-36

</details>

### F190 · The README says "no export step", and there is an Export menu

- **Impact:** Low — a first-time reader of "One plain Markdown file per session. No app, no account, no export step." then finds "Export session → ZIP / PDF".
- **Current experience:** As above, in "Why it is token-efficient".
- **Visual:** Before: "No app, no account, no export step." After: "Your agent reads it directly: no app, no account, no export needed."
- **Recommendation:** Reword the sentence.
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code (README).
- **Owner's words:** "I want to have: versioning · releases so it's downloadable · a DMG that's built and can be installed by dragging and dropping it to Applications · an auto-update · a proper README about what it does and what it's for" — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: README
- Code: `README.md:25` vs `:81`
- Seen by: 4-34

</details>

## Appendix: the agents' tables, de-duplicated

Finding numbers point to the entries above. "Code" means read in the code, "screen" seen on screen.

### A1 · Concepts: how each object and action appears in each place (C1)

| Concept                      | Editor                                                                        | Menu bar menu                                                                                          | session.md                                    | Copied prompt                               | README                                       | Where it differs                                                                     |
| ---------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | --------------------------------------------- | ------------------------------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------ |
| Session                      | "→ name" (muted, far right); window title lost                                | "Session: name" (disabled), "New session", "Switch session" (20 max), "Export session"                 | "# name"                                      | path only                                   | session, current session, session folder     | timestamp names (F116); old sessions unreachable (F117); editor fixed at open (F021) |
| Screenshot / entry           | "What is this screenshot about?", "Add to session", "Discard"                 | "Capture region"                                                                                       | "## 001 · 14:03", "Screenshot 1", img/001.png | "Each entry is an annotated screenshot"     | "Capture a region", "Discard the screenshot" | four names (F186); three numbers (F166); not reopenable (F180)                       |
| Mark (any drawing)           | group 1 "Mark" (tooltip)                                                      | —                                                                                                      | —                                             | —                                           | "Mark it…", "any mark"                       | umbrella and group (F187)                                                            |
| Remove marks                 | "3 Cross / Crossed box / Remove area", fixed red; group name only in tooltip  | —                                                                                                      | not mentioned                                 | "Red crosses and hatched areas mean remove" | "a cross for 'remove this'"                  | meaning hidden (F024); red not exclusive (F012); not in text (F148)                  |
| Approve marks                | "4 Tick / Thumbs up", fixed green                                             | —                                                                                                      | not mentioned                                 | "keep as is"                                | "keep this"                                  | approve vs keep (F188); green allowed elsewhere (F027)                               |
| Numbered marker              | "5 Numbered", panel "References", "Note for 1"                                | —                                                                                                      | "1. …", "_(no note)_"                         | "numbered notes", "numbered markers"        | "Numbered marker"                            | four names (F185); second 5 gives Card (F008); renumbers on undo (F029)              |
| Card                         | "Card" (second tool of 5); yellow, stripe in the free colour                  | —                                                                                                      | "- Card: text", no number, no target          | not mentioned                               | "a sticky note you type on"                  | unnumbered (F149); target lost (F151); not in panel (F031)                           |
| Comment                      | "Comment", 4 rows, first in panel                                             | —                                                                                                      | unlabelled paragraph                          | —                                           | —                                            | unlabelled (F160); "#" becomes a heading (F162)                                      |
| Cut & move                   | "7 Cut & move" (group "Move"); switches to Select; outline in the free colour | —                                                                                                      | "Moved an element / N elements…"              | not mentioned                               | "Cut & move", "dashed outline"               | count only (F152); unmoved counted (F153); can show redacted pixels (F005)           |
| Highlight, Spotlight, Redact | "6 Highlighter → Spotlight → Redact", yellow fill                             | —                                                                                                      | not mentioned                                 | not mentioned                               | described                                    | Redact misplaced (F026); prompt gap (F119)                                           |
| Sessions folder              | —                                                                             | "Show session folder" (one session) vs "Sessions folder: ~/…" (disabled) and "Change sessions folder…" | —                                             | —                                           | "moves new sessions elsewhere"               | one letter apart (F122); not openable (F131); leaves sessions behind (F144)          |
| Export                       | —                                                                             | "Export session ▸ ZIP · PDF", active session only                                                      | —                                             | —                                           | "Export session → ZIP / PDF"                 | active only (F121); no progress (F171); raw errors (F143)                            |
| Hand to the agent            | —                                                                             | "Copy prompt for AI", no feedback, no shortcut                                                         | —                                             | three lines with the path                   | described                                    | silent (F118); no path-only copy (F120)                                              |

Actions:

| Action       | Menu             | Editor                     | Keys        | Output                 | Where it differs                               |
| ------------ | ---------------- | -------------------------- | ----------- | ---------------------- | ---------------------------------------------- |
| Capture      | "Capture region" | —                          | ⌘⇧1         | nothing until saved    | needs a pointer (F141); failures silent (F140) |
| New session  | "New session"    | —                          | ⌘⇧2         | "# name" file at once  | empty sessions pile up (F132)                  |
| Pick tool    | —                | toolbar buttons            | 1–7, V      | —                      | a key pressed again cycles (F009, F008)        |
| Save         | —                | "Add to session ⌘↵"        | ⌘↵          | appends an entry       | no confirmation (F020); double save (F019)     |
| Discard      | —                | "Discard ⌘W", close button | ⌘W          | nothing; image deleted | no question (F001, F002, F003)                 |
| Undo         | —                | "Undo ⌘Z"                  | ⌘Z          | —                      | no redo (F047)                                 |
| Delete mark  | —                | none visible               | ⌫ in Select | —                      | no hint (F089)                                 |
| Copy / paste | —                | none                       | none        | —                      | impossible (F011)                              |
| Reopen entry | —                | —                          | —           | —                      | impossible (F180)                              |

### A2 · Jobs × surfaces (C4)

works · clumsy · broken · impossible · — (not the place for it)

| Job                                          | Menu                                                        | Editor toolbar                    | Canvas                                  | Side panel               | session.md                                | Export           | Overall    |
| -------------------------------------------- | ----------------------------------------------------------- | --------------------------------- | --------------------------------------- | ------------------------ | ----------------------------------------- | ---------------- | ---------- |
| Point precisely at an element                | —                                                           | clumsy: first 1 gives Ellipse     | clumsy: no zoom, tiny handles           | —                        | works (image + numbers)                   | works            | clumsy     |
| Say what should change                       | —                                                           | clumsy: second 5 gives Card       | works (cards)                           | works (marker notes)     | clumsy: cards unnumbered                  | works            | clumsy     |
| Mark remove vs keep                          | —                                                           | clumsy: meaning hidden            | clumsy: other marks can be red or green | —                        | broken: not in the text                   | clumsy: no key   | clumsy     |
| Propose a different layout                   | —                                                           | works                             | works for one piece; switches to Select | —                        | clumsy: moves as a count                  | works            | clumsy     |
| Draw low-fidelity UI elements                | —                                                           | impossible                        | box, pen and card only                  | —                        | —                                         | —                | impossible |
| Copy and paste inside or between screenshots | —                                                           | —                                 | impossible; single selection            | —                        | —                                         | —                | impossible |
| Review 10+ screens in one sitting            | works (⌘⇧1 on the fly)                                      | works                             | works                                   | clumsy with many markers | clumsy: no progress view, no confirmation | —                | clumsy     |
| Hand a session to the agent                  | clumsy: no feedback, no shortcut, partial key, no path copy | —                                 | —                                       | —                        | works (plain file)                        | works (ZIP)      | clumsy     |
| Share with a person                          | clumsy: active session only                                 | —                                 | —                                       | —                        | clumsy: no key to the marks               | works (PDF, ZIP) | clumsy     |
| Revisit and fix an earlier capture           | impossible                                                  | impossible                        | impossible (flattened)                  | impossible               | text by hand only                         | —                | impossible |
| Find an old session                          | broken past 20; date names only                             | —                                 | —                                       | —                        | —                                         | —                | broken     |
| Recover from a mistake                       | —                                                           | clumsy: no redo, renumbering undo | broken: close loses work                | —                        | —                                         | —                | broken     |

Main-scene step count, one entry with two notes: ⌘⇧1 · drag region · 1 (gives Ellipse; press 1 again for Box) · drag · 5 · click · type note · Esc (not shown anywhere) · 5 (gives Card) · 5 · click · type · ⌘↵. About 12–14 actions, two of them traps.

### A3 · Every way in and out (C5)

| From                        | Action                                       | To                                                             | Unsaved marks                        | Verified | Finding    |
| --------------------------- | -------------------------------------------- | -------------------------------------------------------------- | ------------------------------------ | -------- | ---------- |
| anywhere                    | ⌘⇧1 / menu "Capture region"                  | macOS capture overlay                                          | n/a                                  | code     | F141       |
| capture overlay             | drag region / Space + click window           | editor, bound to the active session (created silently if none) | n/a                                  | code     | F127       |
| capture overlay             | Esc, or a failed capture                     | nothing; the two look the same                                 | n/a                                  | code     | F140       |
| editor                      | "Add to session" / ⌘↵                        | window closes; entry appended; no confirmation                 | saved                                | screen   | F020       |
| editor                      | ⌘↵ twice                                     | two identical entries                                          | saved twice                          | screen   | F019       |
| editor                      | save fails                                   | window stays, button dead, no message                          | kept on screen; only exit is Discard | screen   | F004       |
| editor                      | ⌘W (also inside a text field)                | closes, no question                                            | **lost; image deleted**              | screen   | F001, F007 |
| editor                      | "Discard ⌘W" button                          | closes, no question                                            | **lost**                             | code     | F002       |
| editor                      | window close button                          | closes, no question                                            | **lost**                             | code     | F003       |
| editor                      | Esc                                          | deselects, or leaves a text field; never closes                | kept                                 | screen   | —          |
| editor open                 | ⌘⇧1 again                                    | second editor on top of the first                              | both kept                            | code     | F072       |
| editor open                 | ⌘⇧2, Switch session, Change sessions folder… | the open editor still saves to its old session and folder      | kept, old session                    | code     | F021       |
| editor open                 | menu Quit                                    | all editors close                                              | **lost**                             | code     | F115       |
| editor behind other windows | —                                            | no Dock, no menu list                                          | stranded                             | code     | F181       |
| menu                        | Open session.md                              | default Markdown app; silent if missing                        | n/a                                  | code     | F125, F137 |
| menu                        | Show session folder                          | Finder; silent if missing                                      | n/a                                  | code     | F126       |
| menu                        | Copy prompt for AI                           | clipboard, no feedback                                         | n/a                                  | code     | F118       |
| menu                        | Export session → ZIP / PDF                   | Finder with the file selected; failure = raw notification      | n/a                                  | code     | F171, F143 |
| editor                      | route to session.md                          | none                                                           | —                                    | screen   | F044       |
| saved entry                 | back into the editor                         | none                                                           | —                                    | code     | F180       |

### A4 · Where things open (C9)

| Surface                      | Trigger                            | Where / fit                                                                | Stacking                                       | Esc                                   | Enter                             | Verified      |
| ---------------------------- | ---------------------------------- | -------------------------------------------------------------------------- | ---------------------------------------------- | ------------------------------------- | --------------------------------- | ------------- |
| Menu bar menu                | click the icon                     | macOS menu under the icon                                                  | one                                            | closes                                | activates                         | code          |
| Switch session submenu       | hover                              | radio items, first 20 by reversed name                                     | on the menu                                    | closes                                | picks                             | code          |
| Export session submenu       | hover                              | ZIP, PDF                                                                   | on the menu                                    | closes                                | picks                             | code          |
| Capture overlay              | ⌘⇧1 / menu                         | system interactive capture, full screen                                    | above all                                      | cancels, no editor                    | —                                 | code          |
| Editor window                | after capture                      | centred, 1180–1600 × 600–1000 from the image size, no minimum; takes focus | new windows stack exactly on top; no Dock icon | deselect or leave field; never closes | ⌘↵ saves, also inside text fields | screen + code |
| Card text editing            | Card tool click or drag            | on the canvas, grows downward past the image                               | inside the editor                              | ends editing (library)                | new line                          | screen        |
| Sessions folder dialog       | "Change sessions folder…"          | native open panel; app pulled to front; title not shown; button "Open"     | modal to the app                               | cancel, nothing changes               | open                              | code          |
| Notification: new session    | ⌘⇧2 / menu                         | macOS banner "New session: name"                                           | system                                         | —                                     | —                                 | code          |
| Notification: export failed  | export error                       | banner with the raw error                                                  | system                                         | —                                     | —                                 | code          |
| Notification: shortcut taken | launch                             | banner with the internal key name                                          | system                                         | —                                     | —                                 | code          |
| Notification: update         | updater                            | the updater's own banner                                                   | system                                         | —                                     | —                                 | code          |
| Finder                       | after ZIP/PDF; Show session folder | Finder window                                                              | —                                              | —                                     | —                                 | code          |
| Markdown app                 | Open session.md                    | the default app for .md                                                    | —                                              | —                                     | —                                 | code          |
| Clipboard                    | Copy prompt for AI                 | invisible                                                                  | —                                              | —                                     | —                                 | code          |

### A5 · Every state (C16)

| Screen     | State                             | What the user sees                                                                                            | Verified | Finding    |
| ---------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------- | -------- | ---------- |
| Menu       | no session yet                    | "Session: —", four items greyed                                                                               | code     | F127       |
| Menu       | active session                    | "Session: name", no count                                                                                     | code     | F129       |
| Menu       | more than 20 sessions             | first 20 only                                                                                                 | code     | F117       |
| Menu       | session removed outside           | stale list; save fails later                                                                                  | code     | F133, F004 |
| Menu       | development build                 | "Open at login" and "Check for updates…" disabled; "Change sessions folder…" disabled when a test root is set | code     | —          |
| Menu       | update available / none / offline | updater banner / nothing / nothing                                                                            | code     | F136, F123 |
| First run  | first launch                      | nothing visible but the icon                                                                                  | code     | F177       |
| First run  | Screen Recording missing          | wallpaper-only image, no explanation                                                                          | code     | F139       |
| App        | shortcut taken                    | passing banner; the menu still shows the key                                                                  | code     | F142, F124 |
| Editor     | loading                           | live toolbar, blank canvas                                                                                    | code     | F074       |
| Editor     | empty canvas                      | image; hint "Press 5 and click…"                                                                              | screen   | F023       |
| Editor     | 12 markers                        | panel scrolls; actions below the fold; Comment collapses                                                      | screen   | F039, F040 |
| Editor     | long notes / long comment         | two-row notes and four-row comment clip their text, resizable by hand                                         | screen   | —          |
| Editor     | long card                         | runs past the image bottom                                                                                    | screen   | F041       |
| Editor     | saving                            | button disabled but unchanged                                                                                 | screen   | F068       |
| Editor     | save failed                       | no message, dead button                                                                                       | screen   | F004       |
| Editor     | saved                             | window vanishes                                                                                               | code     | F020       |
| Editor     | narrower than 1180                | toolbar clipped                                                                                               | screen   | F042       |
| Editor     | 1440, 1920, 1× and 2×             | fits; at 1920 the actions sit far from the tools                                                              | screen   | —          |
| Editor     | dark appearance                   | dark image edge lost                                                                                          | screen   | F073       |
| Editor     | 200% zoom                         | half the toolbar off screen                                                                                   | screen   | F061       |
| Export     | running                           | nothing                                                                                                       | code     | F171, F175 |
| Export     | failed                            | raw error banner                                                                                              | code     | F143       |
| Export     | success                           | Finder reveal; the previous file replaced                                                                     | code     | F172, F176 |
| Clipboard  | prompt copied                     | nothing                                                                                                       | code     | F118       |
| session.md | missing                           | Open does nothing                                                                                             | code     | F125       |

### A6 · Controls (C7), sizes at 1180 × 600, Retina, light

| Control        | Label shown                                     | Tooltip / name                                | Key                             | Size                                                         | Notes                                                                     |
| -------------- | ----------------------------------------------- | --------------------------------------------- | ------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------- |
| Tool 1         | "1 Box ●○"                                      | "Mark: Box → Ellipse"                         | 1                               | 80 × 27                                                      | width changes with the tool (F078); pressed fill is the remove red (F107) |
| Tool 2         | "2 Arrow ●○"                                    | "Draw: Arrow → Pen"                           | 2                               | 94 × 27                                                      |                                                                           |
| Tool 3         | "3 Cross ●○○"                                   | "Remove: Cross → Crossed box → Remove area"   | 3                               | 101 × 27                                                     | red                                                                       |
| Tool 4         | "4 Tick ●○"                                     | "Approve: Tick → Thumbs up"                   | 4                               | 83 × 27                                                      | green; pressed label 3.3:1 (F054)                                         |
| Tool 5         | "5 Numbered ●○"                                 | "Note: Numbered → Card"                       | 5                               | 121 × 27                                                     |                                                                           |
| Tool 6         | "6 Highlighter ●○○"                             | "Highlight: Highlighter → Spotlight → Redact" | 6                               | 133 × 27                                                     | dark yellow; label 2.94:1 (F055)                                          |
| Tool 7         | "7 Cut & move"                                  | "Move: Cut & move"                            | 7                               | 111 × 27                                                     | no dots                                                                   |
| Select         | "V Select"                                      | "Select: Select"                              | V                               | 79 × 27                                                      | tooltip repeats (F092)                                                    |
| Colour well    | red swatch, no visible label                    | "Color"                                       | none                            | 30 × 28                                                      | ignored by groups 3, 4, 6 (F075); does not recolour the selection (F028)  |
| Undo           | "Undo ⌘Z"                                       | —                                             | ⌘Z (not in text fields)         | 72 × 27                                                      | enabled when empty (F083); no redo (F047)                                 |
| Comment        | label "Comment"                                 | placeholder "What is this screenshot about?"  | Esc leaves; ⌘↵ saves            | 295 × 74, resizable                                          | collapses with many markers (F040)                                        |
| Note fields    | number badge                                    | placeholder "Note for N"                      | focus jumps here after a marker | about 260 × 2 rows                                           | no delete (F081); no link to the marker (F030); no label (F064)           |
| Discard        | "Discard ⌘W"                                    | —                                             | ⌘W, also the close button       | 144 × 34                                                     | no question (F002)                                                        |
| Add to session | "Add to session ⌘↵"                             | —                                             | ⌘↵, also in text fields         | 144 × 34, filled                                             | disabled look identical (F068)                                            |
| Canvas handles | 8 plus rotate (marker: none; redaction: locked) | —                                             | —                               | 4.5 / 5.9 / 8.5 px at 1180 / 1440 / 1920 on 2×; 2.8 px on 5K | F017                                                                      |

Button heights were measured as 27 px by one agent and 28 px by another. Both are above the 24 px minimum.

### A7 · Keys × surfaces (C17)

| Key           | Menu bar menu             | Editor: image focused                                   | Editor: Comment or note  | Editor: card being typed                 | Hint shown?         | Finding                                                      |
| ------------- | ------------------------- | ------------------------------------------------------- | ------------------------ | ---------------------------------------- | ------------------- | ------------------------------------------------------------ |
| ⌘⇧1           | "Capture region" (global) | capture                                                 | capture                  | capture                                  | menu, README        | shown even when not registered (F124); not changeable (F183) |
| ⌘⇧2           | "New session" (global)    | new session                                             | new session              | new session                              | menu, README        | same                                                         |
| 1–7           | —                         | pick group; again = next tool                           | types the digit          | types the digit                          | toolbar             | F009, F008, F022                                             |
| V             | —                         | Select                                                  | types v                  | types v                                  | toolbar             | —                                                            |
| Ctrl+1–7      | —                         | also picks the tool                                     | —                        | —                                        | no                  | harmless, undocumented                                       |
| ⌘Z            | —                         | undo last mark action                                   | the field's own undo     | text undo                                | "Undo ⌘Z"           | F048                                                         |
| ⌘⇧Z           | —                         | nothing                                                 | text redo                | text redo                                | no                  | F047                                                         |
| ⌘↵            | —                         | Add to session                                          | Add to session           | Add to session                           | "Add to session ⌘↵" | works everywhere                                             |
| ⌘W            | —                         | discard, no question                                    | **discard, no question** | discard, no question                     | "Discard ⌘W"        | F001, F007                                                   |
| ⌘Q            | Quit                      | quits, editors lost                                     | same                     | same                                     | menu                | F115                                                         |
| ⌘R, ⌥⌘I       | —                         | Electron default menu, assumed                          | same                     | same                                     | no                  | F182                                                         |
| ⌘C / ⌘V / ⌘D  | —                         | nothing for marks                                       | text copy and paste      | text copy and paste                      | no                  | F011                                                         |
| Esc           | closes the menu           | deselects; does not cancel a drag                       | leaves the field         | ends card editing (library, unconfirmed) | README only         | F086, F089                                                   |
| ⌫ / Delete    | —                         | deletes the selected mark, also when a button has focus | deletes text             | deletes text                             | README only         | F060, F089                                                   |
| Arrow keys    | menu navigation           | nothing                                                 | caret                    | caret                                    | —                   | F063                                                         |
| Tab           | —                         | the image is not in the order                           | next field               | stays in the card                        | —                   | F014, F015                                                   |
| Space / Enter | activate                  | may repeat the last clicked button (assumed)            | text                     | text                                     | —                   | F087                                                         |
| Right-click   | opens the tray menu       | nothing                                                 | nothing (assumed)        | nothing                                  | —                   | F189                                                         |

Pointer-only actions: place any mark, draw an arrow or pen stroke, cut a region, select a mark, move or resize a mark, point a card at something, choose a colour in the macOS colour panel, and capture a region.

### A8 · Token cost of a ten-shot session (from the output-for-AI check)

Ten test captures of different sizes with realistic marks, joined into one session. Tokens ≈ width × height / 750 after the model's resize; text ≈ characters / 3.8.

| Entry     | Image (px) | Image tokens | Marks drawn                  | What the text says                                                        |
| --------- | ---------- | ------------ | ---------------------------- | ------------------------------------------------------------------------- |
| 001       | 1433 × 802 | 1,532        | box, 2 markers               | comment + 2 notes; the box is not mentioned                               |
| 002       | 1200 × 360 | 576          | cross, tick, marker          | "Orders table" + 1 note; remove and keep not mentioned                    |
| 003       | 1200 × 600 | 960          | remove area, marker          | 1 note; the remove area not mentioned                                     |
| 004       | 1433 × 802 | 1,532        | 2 ticks                      | only the typed comment                                                    |
| 005       | 1200 × 800 | 1,280        | cut and move                 | comment + "Moved an element…"                                             |
| 006       | 1000 × 420 | 560          | 2 cards with pointers        | 2 "Card:" lines, not placed                                               |
| 007       | 1400 × 300 | 560          | highlighter, 3 markers       | 3 notes; the highlighter not mentioned                                    |
| 008       | 200 × 100  | 27           | 1 marker                     | 1 note                                                                    |
| 009       | 1433 × 802 | 1,532        | 3 markers, cross, tick, card | comment + 3 notes + card; cross and tick not mentioned                    |
| 010       | 1568 × 697 | 1,457        | 2 markers, arrow, redaction  | "1. Row hover missing / 2. _(no note)_"; marker 2 hidden by the redaction |
| **Total** |            | **≈ 10,000** |                              | text 1,387 characters ≈ **360 tokens**                                    |

Add about 80 tokens for "Copy prompt for AI", pasted once. That makes **about 10,450 tokens per session, of which about 96% is images.** A full-window Retina capture costs about 1,530 tokens, and a 1× capture of the same window about 1,075. The biggest saving is a smaller default long edge: about 1000 px roughly halves the image tokens (F156). Cropping to the marked area saves more. After that come a one-line list of marks per entry and a key at the top of session.md (F148, F154), labels for cards and moves (F149, F152), and dropping the per-entry time, which an agent does not need.

The four output-for-AI questions:

| Question                                                                                              | Answer                                                                                                                                                                                                                                                                                 |
| ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Does every note map to exactly one mark?                                                              | Numbered notes: yes, but numbers change after delete and undo (F029), multi-line notes break the list (F150), and a redaction can hide a marker (F032). Cards: only by reading the picture (F149). The comment belongs to no mark. Boxes, arrows and highlights carry no notes (F155). |
| Can an agent tell remove from approve, a card from a marker, a move from a mark, from the text alone? | Remove from approve: **no** (F148). A card from a marker: **yes** ("- Card:" against "1."). A move: **partly**. It is a count only, and it can report a move that did not happen (F152, F153).                                                                                         |
| Is the image size right?                                                                              | It matches the model's own ceiling, so nothing is wasted on upload. It is larger than a review needs, and very large captures become unreadable (F156, F157).                                                                                                                          |
| What would make it cheaper or clearer?                                                                | See the paragraph above the table.                                                                                                                                                                                                                                                     |

### A9 · Vocabulary: term × place (C12)

| Term                                   | Menu                                                                    | Editor                                                                                    | session.md                             | Prompt                               | Notifications              | README                               | Clash                               |
| -------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | -------------------------------------- | ------------------------------------ | -------------------------- | ------------------------------------ | ----------------------------------- |
| session                                | "Session: X", "New session", "Switch session", "Export session"         | "Add to session", "→ X" (no word)                                                         | "# X"                                  | path only                            | "New session: X"           | session                              | editor shows no word (F071)         |
| session folder / sessions folder       | "Show session folder" / "Sessions folder: …", "Change sessions folder…" | —                                                                                         | —                                      | —                                    | —                          | both                                 | one letter apart (F122)             |
| screenshot / entry / shot / capture    | "Capture region"                                                        | "What is this screenshot about?"                                                          | "Screenshot 1", "## 001"               | "Each entry…"                        | —                          | "Discard the screenshot", "captures" | F186, F166                          |
| comment                                | —                                                                       | "Comment"                                                                                 | unlabelled paragraph                   | —                                    | —                          | example only                         | F160                                |
| note / references / marker / numbered  | —                                                                       | "Note for 1", group "Note", heading "References", tool "Numbered", hint "numbered marker" | "1. …", "_(no note)_"                  | "numbered notes", "numbered markers" | —                          | "Numbered marker", "a note each"     | F185, F184                          |
| card                                   | —                                                                       | "Card"                                                                                    | "- Card: …"                            | missing                              | —                          | "a sticky note you type on"          | F184, F119                          |
| mark                                   | —                                                                       | group 1 "Mark" (tooltip)                                                                  | —                                      | —                                    | —                          | "mark it up", "any mark"             | F187                                |
| remove / cross / crossed box / hatched | —                                                                       | group "Remove", "Cross", "Crossed box", "Remove area"                                     | —                                      | "Red crosses and hatched areas"      | —                          | "Remove area (hatched)"              | F093, F012                          |
| approve / keep                         | —                                                                       | group "Approve", "Tick", "Thumbs up"                                                      | —                                      | "keep as is", "thumbs-up"            | —                          | "keep this"                          | F188                                |
| highlight / spotlight / redact         | —                                                                       | "Highlighter", "Spotlight", "Redact" (Highlight group)                                    | —                                      | missing                              | —                          | described                            | F026, F119                          |
| cut & move / move                      | —                                                                       | "Cut & move", group "Move"                                                                | "Moved an element: … dashed outline …" | missing                              | —                          | "Cut & move", "dashed outline"       | F167                                |
| select                                 | —                                                                       | "Select", tooltip "Select: Select"                                                        | —                                      | —                                    | —                          | "Select: move, resize or delete"     | F092                                |
| discard                                | —                                                                       | "Discard ⌘W"                                                                              | —                                      | —                                    | —                          | "Discard the screenshot"             | F090                                |
| colour                                 | —                                                                       | tooltip "Color"                                                                           | —                                      | "Red … Green"                        | —                          | "always red / green"                 | F076; the interface uses US "Color" |
| update                                 | "Check for updates…"                                                    | —                                                                                         | —                                      | —                                    | the updater's own          | "Auto-update"                        | F123                                |
| time                                   | —                                                                       | —                                                                                         | "# … 14.03", "## … 14:03"              | —                                    | "New session: … 14.03"     | both                                 | F165                                |
| shortcut                               | "⌘⇧1"                                                                   | —                                                                                         | —                                      | —                                    | "CommandOrControl+Shift+1" | "⌘⇧1"                                | F142                                |
