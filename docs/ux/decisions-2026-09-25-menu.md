# Menu bar menu: decisions

The owner asked on 2026-09-25 to clean up the menu bar menu:

> "Can you optimise this dropdown? It looks terrible. The Open Session, Copy Session: what does "Open Session" even mean? The whole thing doesn't even say what it is. The order of the menu just doesn't make sense."

This file covers only the menu. The rest of the audit waits for the full decision round.

## Group 1: the menu's shape

The layout comes first: it settles the order, the labels and the headers in one answer, and every
later menu decision adds to it.

### The menu's layout, order and labels

**Decided 2026-09-25 by the owner:** "Accept (Recommended)"

- **Today:** the first line is a grey "Session: 2026-09-25 12.03 (2)". Then Capture region, New
  session, Switch session; then Open session.md, Copy session.md path, Show session folder, Copy
  prompt for AI, Export session; then Sessions folder, Change sessions folder…; then Open at login,
  Snapmark 0.2.0, Check for updates…, Quit. The app's name appears only near the bottom, greyed.
- **Recommended:** a header with the app's name; capturing first; the current session as its own
  section, with the hand-off to the AI at its top; other sessions below; settings in one submenu.

  ```
  Snapmark                                   (header)
  Capture region                      ⇧⌘1
  New session                         ⇧⌘2
  ─────────────────────────────────────
  Current session: 25 Sep 12.03 · 2 screenshots   (header)
  Copy prompt for AI
  Copy file path
  Open feedback file
  Show in Finder
  Export                                 ▸
  ─────────────────────────────────────
  Switch session                         ▸
  Settings                               ▸   Open at login ✓
                                             Sessions are saved in ~/Documents/Snapmark  (opens Finder)
                                             Change where sessions are saved…
                                             Check for updates…
                                             Version 0.2.0
  Quit Snapmark                       ⌘Q
  ```

  Before a first session, the session header reads "No session yet: press ⇧⌘1 to start one", and
  its items are disabled. Export is disabled while the session has no screenshots.

- **Why it helps you:** the menu says what it is, reads top to bottom in the order of a review, and
  each label says what happens instead of naming a file.
- **Downside:** the positions you learned change once. "session.md" no longer appears in the menu;
  the README and the copied prompt still name it.
- **Words before → after:**

  | Before                                  | After                                                    |
  | --------------------------------------- | -------------------------------------------------------- |
  | "Session: 2026-09-25 12.03 (2)" (grey)  | "Current session: 25 Sep 12.03 · 2 screenshots" (header) |
  | "Open session.md"                       | "Open feedback file"                                     |
  | "Copy session.md path"                  | "Copy file path"                                         |
  | "Show session folder"                   | "Show in Finder"                                         |
  | "Export session"                        | "Export"                                                 |
  | "Sessions folder: ~/Documents/Snapmark" | "Sessions are saved in ~/Documents/Snapmark"             |
  | "Change sessions folder…"               | "Change where sessions are saved…"                       |
  | "Snapmark 0.2.0"                        | "Version 0.2.0" (in Settings)                            |
  | "Quit"                                  | "Quit Snapmark"                                          |

- **Question:** Use this layout and these labels?
- **Verified:** seen on screen (the owner's screenshot); read in the code.
- **You said:** the request quoted at the top of this file.

<details><summary>Supporting notes</summary>

Settles F191, F192, F193, F122, F127, F129, F130, F131, F135, and the position part of F134.
Electron 44 menus support `type: 'header'` on macOS 14 and later.

</details>

### Confirming a copy

**Decided 2026-09-25 by the owner:** "Accept (Recommended)"

- **Today:** "Copy prompt for AI" and "Copy session.md path" close the menu and nothing confirms the
  copy or says which session it was for.
- **Recommended:** a short notification: "Prompt for 25 Sep 12.03 copied. Paste it into your AI
  agent." and "Path to 25 Sep 12.03 copied."
- **Why it helps you:** you know the clipboard holds the right session before you paste.
- **Downside:** one notification per copy.
- **Alternative:** no notification; the item reads "Copied ✓" the next time the menu opens.
- **Question:** Confirm copies with a notification?
- **Verified:** read in the code.
- **You said:** no earlier request found.

<details><summary>Supporting notes</summary>F118.</details>

### A shortcut for "Copy prompt for AI"

**Decided 2026-09-25 by the owner:** "Accept (Recommended)"

- **Today:** the hand-off has no shortcut.
- **Recommended:** no global shortcut. The hand-off happens once per review, and it becomes the
  first item of the session section. ⇧⌘3, ⇧⌘4 and ⇧⌘5 are taken by macOS screenshots.
- **Why it helps you:** no new key that can clash with another app.
- **Downside:** the hand-off stays two clicks away.
- **Alternative:** ⇧⌘9 as a global shortcut.
- **Question:** Leave the hand-off without a shortcut?
- **Verified:** read in the code; macOS shortcuts from the system settings.
- **You said:** "This is also important: when I create, as I said, it needs to be shortcuts so I can just do this on the fly." — 2026-09-25. This was about capturing, not the hand-off.

<details><summary>Supporting notes</summary>F134.</details>

### Naming sessions

**Decided 2026-09-25 by the owner:** "Accept (Recommended)"

- **Today:** sessions are named by date and time; a week of reviews reads as "2026-09-25 14.02"
  lines. The only way to name one is renaming its folder in Finder.
- **Recommended:** "Rename session…" in the session section. ⇧⌘2 still starts a session at once,
  named by time.
- **Why it helps you:** "Checkout review" instead of a timestamp in the header and in Switch session,
  without slowing ⇧⌘2.
- **Downside:** easy to forget to rename.
- **Alternative:** ⇧⌘2 asks for a name, with the time pre-filled (Return keeps it).
- **Question:** Add "Rename session…" and keep ⇧⌘2 instant?
- **Verified:** read in the code.
- **You said:** "It needs to be some sort of project or session. If there's an existing session I just add to the existing session or I create a new session." — 2026-09-25

<details><summary>Supporting notes</summary>F116.</details>

## Group 2: behaviour

These change what happens, not only how the menu reads, so each gets its own question.

### Quit with open editors

**Decided 2026-09-25 by the owner:** "Accept (Recommended)"

- **Today:** Quit closes every open editor and deletes its screenshot and marks without asking.
- **Recommended:** if an editor has marks or text, Quit brings it forward and asks: "2 screenshots are not in a session yet. [Review] [Quit anyway]".
- **Downside:** Quit is no longer instant while work is open. **Alternative:** save them into the current session automatically.
- **Question:** Ask before quitting with unsaved editors?
- **You said:** no earlier request found.

<details><summary>Supporting notes</summary>F115 (High).</details>

### Reaching older sessions

**Decided 2026-09-25 by the owner:** "Accept (Recommended)"

- **Today:** Switch session lists the newest 20 by name; older ones cannot be reached from the app.
- **Recommended:** the list is ordered by last use, and ends with "Other session…", which opens a chooser in the sessions folder.
- **Downside:** a chooser is another window. **Alternative:** keep the order by date, only add "Other session…".
- **Question:** Order by last use and add "Other session…"?
- **You said:** "If there's an existing session I just add to the existing session or I create a new session." — 2026-09-25

<details><summary>Supporting notes</summary>F117 (High).</details>

### Acting on an older session without switching to it

**Decided 2026-09-25 by the owner:** "Accept (Recommended)"

- **Today:** exporting or copying last week's session means switching to it, and the next ⇧⌘1 then lands in last week's session.
- **Recommended:** each session in Switch session gets its own submenu: Make current · Copy prompt for AI · Export ▸ · Show in Finder.
- **Downside:** one level deeper; switching takes one extra hover. **Alternative:** keep one current session; everything acts on it.
- **Question:** Give each listed session its own submenu?
- **You said:** "Also I wonder what the best way of making this portable is: being able to share this as a PDF or zip it, maybe both. Having it in the cloud." — 2026-09-25

<details><summary>Supporting notes</summary>F121.</details>

### Pressing ⇧⌘2 twice

**Decided 2026-09-25 by the owner:** "Accept (Recommended)"

- **Today:** each press creates a new empty session; two presses leave "12.03" and "12.03 (2)".
- **Recommended:** while the current session is still empty, ⇧⌘2 reuses it instead of making another. A new session still creates its Markdown file at once.
- **Downside:** none known. **Alternative:** create the session on disk only when its first screenshot is added.
- **Question:** Reuse an empty current session?
- **You said:** "First I want to have the functionality that when I create a new session it creates Markdown." — 2026-09-25. The recommendation keeps this; the alternative does not.

<details><summary>Supporting notes</summary>F132.</details>

### A waiting update

**Decided 2026-09-25 by the owner:** "Accept (Recommended)"

- **Today:** a downloaded update shows one notification and installs on the next quit; the menu never says so.
- **Recommended:** "Restart to install 0.3.0" appears under the Snapmark header while an update waits.
- **Downside:** none. Updates reach the app only once releases are signed and public.
- **Question:** Show a waiting update in the menu?
- **You said:** "an auto-update" — 2026-09-25

<details><summary>Supporting notes</summary>F136.</details>

### Help and shortcuts

**Decided 2026-09-25 by the owner:** "Accept (Recommended)"

- **Today:** the editor's keys (Esc, V, ⌫, 1–7) and what each colour means are only in the README.
- **Recommended:** "Keyboard shortcuts…" in Settings opens a small Snapmark window listing every key and mark.
- **Downside:** the sheet must stay in step with the editor. **Alternative:** "Help" opens the README on GitHub (private today, so only you can open it).
- **Question:** Add an in-app shortcuts sheet?
- **You said:** "I want shortcuts, like just pressing 1, 2, 3, 4, 5 while I'm in the editor." — 2026-09-25

<details><summary>Supporting notes</summary>F128.</details>

### A session file that has gone

**Decided 2026-09-25 by the owner:** "Accept (Recommended)"

- **Today:** if the session's file or folder was moved or deleted, "Open feedback file" and "Show in Finder" do nothing.
- **Recommended:** a notification "25 Sep 12.03 is no longer in ~/Documents/Snapmark" with "Choose another session".
- **Downside:** none. **Alternative:** also offer to find where it was moved.
- **Question:** Say it is missing and offer another session?
- **You said:** no earlier request found.

<details><summary>Supporting notes</summary>F125, F126.</details>

### Where "Open feedback file" opens

**Decided 2026-09-25 by the owner:** "Accept (Recommended)"

- **Today:** it opens session.md in whatever app owns .md files, often a text editor without the images.
- **Recommended:** keep it that way. You point the AI at the file; the file is what matters.
- **Downside:** on a Mac without a Markdown viewer you see raw text. **Alternative:** a Snapmark preview window that shows the session like the PDF export.
- **Question:** Keep opening it in your Markdown app?
- **You said:** "I also wonder: where do I access the session?" — 2026-09-25

<details><summary>Supporting notes</summary>F137.</details>

## Routine fixes

**Decided 2026-09-25 by the owner:** "Apply all (Recommended)"

Corrections with no real choice, for one review:

1. The copied prompt explains every mark, in the toolbar's words, generated from the same tool list (today it leaves out cards, crossed boxes, highlight, spotlight, redaction, pen and moves).
2. "Check for updates…" always answers: "Snapmark 0.2.0 is up to date" or "Couldn't check for updates: no connection. [Try again]". Background checks stay quiet.
3. A shortcut is shown next to "Capture region" or "New session" only when macOS let Snapmark register it; otherwise "(shortcut unavailable)".
4. The menu is rebuilt each time it opens, so sessions added or removed in Finder show at once.

<details><summary>Supporting notes</summary>F119, F123, F124, F133. F122, F127, F129, F130, F131, F135 are settled by the layout decision; F126 by the missing-file decision.</details>
