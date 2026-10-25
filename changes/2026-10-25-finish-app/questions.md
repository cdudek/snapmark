---
type: questions
change: 2026-10-25-finish-app
---

# Questions

Open questions never block the build (`docs/sdlc.md`, One go). Each has the default the build takes. When the owner answers, the answer is copied here word for word, and it becomes an ask of the next milestone.

## Milestone 1 — Editor polish and leftovers

None blocks the build. Each has the default taken above.

1. **A8, "It still just has one":** does it mean one button per tool, so every tool shows at once? Default: keep the groups (two ADRs). The caption shows ⌘N, the dots show two tools, and the tooltip names both.
2. **Undo and Redo:** the brief says icons with the name in the tooltip. The mock shows icon, word and key. Default: icon only, which saves about 110 px.
3. **A9, "icons overall":** the editor toolbar only, or also the session window and the menu? Default: the editor toolbar.
4. **Gradient Add to session** (`editor--in-use-gradient.png`)? Default: solid `#0f72db`. White text on the gradient's cyan end fails 4.5:1.
5. **Editor session menu:** add "Older Sessions…"? Default: no; the menu bar has it.
6. **Highlighter on dark:** lighten (default) or keep the fill and add an outline (the audit's option b)?
7. **snap-c5c L2 nudge:** close as accepted (default), or pass the capture's display scale to the editor?
8. **snap-bmr.14.3 E2E gaps F025/F027/F028/F041/F043:** the PR 79 review report is not in the repo, and `gh api …/pulls/79/comments` returns 0. Default: the builder reads the review from PR 79's checks or the review run before writing the smoke assertions, and stops to ask if it cannot be found.
9. **Copy or Save:** is "Copy or Save" with the share glyph the right name? Default: yes. "Share" would suggest the macOS share sheet, which Snapmark does not have.
10. **snap-bmr.14.3 E2E gaps F025/F027/F028/F041/F043 (build, step 15):** PR 79 has no review and no comment (`gh pr view 79 --json reviews,comments` returns both empty), and the bead names only the IDs. Which flows were they? Default taken: smoke covers the session-window rename flows the code shows that had no check: session.md's title follows a rename, ↩ on an emptied field goes back to the bare date, the window title follows a rename (snap-ua7 F8), an editor on an empty session (snap-ua7 F3), Switch Session by last use (snap-ua7 F13), plus F123 and F125–F131. Name the five and they become an ask of milestone 2.

## Milestone 2 — Capture bar, Settings, Keyboard Shortcuts

Each has a default taken; none blocks the build.

1. **Name of the menu row.** "Capture Options…" (the word the menu, the key list and the ADR already use) or "Show Capture Bar"? Default: "Capture Options…".
2. **One-Shot: a destination or a button?** Default: Options ▸ Save to, with the Capture button reading "Capture One-Shot", so a window or scrolling capture can be one-shot too. The other way: a fifth button, area only, as today.
3. **Clipboard only, no editor (macOS's "Clipboard")?** Default: not added; macOS's ⌃⇧⌘4 does it, and Snapmark is for marking up. One-Shot then ⌘↵ copies.
4. **Entire Screen mode?** Default: not added; nobody asked, and Capture Last Area covers repeats.
5. **Should ⌃⇧4 and ⌃⇧3 follow the bar's options, like macOS's ⇧⌘4?** Default: no. A one-shot or a timer left on would change the everyday keys without a sign.
6. **Click on a mode: choose, or capture at once?** Default: choose, as macOS; ↩ or Capture captures. One click less is the other way.
7. **Keyboard Shortcuts as its own row in the menu bar menu** (proposed sitemap)? Default: no; ⌘/ and Settings ▸ Shortcuts reach it, and the menu stays short.
8. **Timer for Capture Window?** Default: greyed; `screencapture -i -w` cannot wait after the click. A later change could pick the window with Snapmark's own picker.
9. **Remove the stock View menu (Reload, Developer Tools) now?** Default: no, a separate change; M2 adds only the Snapmark menu.

## Answers

None yet.
