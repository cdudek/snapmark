---
type: interaction-guidelines
status: proposed — nothing here is accepted
created: 2026-09-28
build: main at v0.9.0
source: UX audit 2026-09-28, evaluators e1–e8 (finding IDs are the evaluators' own, renumbered at the merge)
---

# Snapmark interaction guidelines

The shared rules for how the whole app behaves: which interaction to use, when, and why, so a
reviewer who learns an action once can predict it everywhere else. Drafted from the audit of
v0.9.0 by agent 1 (structure), using agents 2 and 3's rule-area sections, agent 4's keyboard,
focus and platform rules and wording, agent 5's sixteen accessibility rules, and the findings of
all eight evaluators. Written in `ux:guidelines` draft mode, in the structure of `rule-areas.md`; the
2026-09-25 guidelines and sitemap were used only as a structure reference.

**Every rule is `status: proposed`.** Only the owner accepts a rule. An existing behaviour, an older
document (the guidelines of 2026-09-25, the decision log) or another product doing it is never
acceptance. Where a rule reverses something the owner asked for or decided, it says so.

Screenshots show v0.9.0 as it is; anything labelled **Proposal** is a sketch and does not exist.
Paths are relative to this file (`audits/2026-09-28/shots/…`).

## The three scenes

Every rule and flow names the scene it serves (confirmed by the owner, 2026-09-25).

1. **Reviewing an overnight build.** A complete UX/UI review of what an agent built overnight: many
   screenshots in a row, captured on the fly with keys, often from a full-screen browser, handed to
   Claude Code. The main scene.
2. **Sharing with a person.** The same session as a PDF or ZIP for a teammate or stakeholder.
3. **A quick verdict.** One screenshot: mark what goes and what stays.

## Principles

Every rule traces back to one or more of these.

1. **Never lose the reviewer's words or marks.** Every way out of an editor or the session window is
   safe; a collision or a failure keeps the reviewer's text on screen with a way forward. Snapmark
   never writes over something without keeping the old version recoverable.
2. **Stay where the reviewer is.** A capture never moves the reviewer to another Space or app; the
   editor opens where they were looking, and closing it returns them there. Snapmark never captures
   its own windows.
3. **Keys capture; everything else is one deliberate, visible step.** Global keys do the frequent,
   harmless thing (capturing). Anything that changes where work goes (a new session, switching,
   reopening into a session) is explicit, shows its result where the reviewer looks, and can be
   undone.
4. **Undo where it happened; ask only when something is gone for good.** A mistake is fixed with ⌘Z or
   an Undo next to the result, not prevented with a question. A question appears only where work
   would be lost without a way back.
5. **One word, one key, one colour, one meaning.** A session has one name, a screenshot one number, a
   key one action, red one meaning (remove), and every place that shows a thing edits the same thing.
6. **Say it where the reviewer looks, in proportion.** Frequent successes get a glance-sized sign;
   removals say where things went; failures stay beside the thing that failed until resolved. A
   macOS notification is never the only copy of something the reviewer needs.
7. **The text carries the meaning, for everyone.** What a mark means is written in words, in
   `session.md` and the PDF, so an agent, a teammate or a screen reader never decodes pixels; every
   step works from the keyboard, with names, contrast and targets anyone can use.

## Rules

One rule per applicable rule area, in the order of `rule-areas.md`, then the accessibility rules.
Each rule: status, situation, today (v0.9.0, with the screens where it differs), the rule, why,
tradeoff, exceptions, example, screens it applies to, and supporting notes with the findings it
resolves.

### Editing

#### Edit a thing where it is shown, and give every piece of text one home

- **Status:** proposed
- **Situation:** changing anything after it exists: a mark on the image, a reference's note, a card's
  text, the comment, an entry in `session.md`, a session's name.
- **Today:** marks are edited on the image with Select (C): drag to move, handles to resize, ⌫ to
  delete, one mark at a time. A mark's colour cannot be changed after it is drawn; picking a colour
  with a mark selected changes only the next mark (F073). Notes and the comment are Markdown fields
  in the side panel, committed as you type; a card's text is edited on the card. The same entry text
  has two homes: the editor's saved state beside the entry, and `session.md`, which the Document tab
  edits; Edit Again then silently overwrites what was fixed in the Document tab (F125, F125). Typing
  one character in the Document tab rewrites the whole file and escapes characters
  (`snake\_case\_name`, F127/F137, F195). Renaming an entry's heading in the Document tab cuts it off from
  Screenshots, Edit Again and Remove (F129, F129). A Reference is placed on mouse press, not on release
  (F118), and the next reference's ghost "2" sits on top of the one just placed (F072). Pressing the key
  of the tool that is already on switches to its sibling (F063, F063). Session names are edited in a
  separate script dialog (F177/F190).
- **Rule:**
  - Edit in place, where the thing is shown, committed continuously, one undo step per change.
  - Every piece of text has exactly one home, and every place that shows it edits that home: the
    editor's fields and the Document tab write the same entry; Edit Again opens the entry as it is in
    `session.md` now.
  - A selection's properties are edited with the controls that create them: with a mark selected, the
    colour control recolours it (one undo step).
  - Headings that tie an entry to its image are not editable text; the entry's comment, notes and cards
    are.
  - A mark is placed when the pointer is released; a press that slides off does nothing (agent 5 rule 3).
  - A key the reviewer presses to pick a tool never leaves them on a different tool than they asked
    for: pressing the key of the active tool keeps it, and ⇧ + the key steps to the next tool in the
    group (the owner decides, see Tradeoff).
  - Writing to `session.md` changes only the part that changed and never escapes the reviewer's text.
- **Why it helps:** a fix costs one gesture in the place the reviewer is looking, and nothing the
  reviewer typed is overwritten by another view of the same text.
- **Tradeoff:** one home for entry text means the Document tab and the editor must merge rather than
  overwrite, which is more code; locking entry headings takes one freedom away from the Document tab.
  Keeping the tool on a repeated key press reverses the owner's 2026-09-25 request ("When I press the
  same button multiple times … I would switch between the shapes"): the owner decides which.
- **Exceptions:**
  - Redactions cannot be moved or resized, because moving one would uncover what it hides (editor).
  - References have a fixed size and no handles, so a session looks even (editor).
  - Freehand pen strokes stay pointer-only (see Keyboard and focus).
- **Example:** today a Document-tab fix to note 2 of screenshot 004 is thrown away when the reviewer
  opens Edit Again on 004 and saves ([annotated](audits/2026-09-28/shots/3-probe-editagain-annotated.png)). Under the
  rule, Edit Again opens with the fixed note, and saving keeps it.
- **Applies to:** editor (canvas, side panel, card), session window (Document tab), Rename Session….

<details><summary>Supporting notes</summary>

- Findings: F073, F125, F127/F137, F072, F118, F063, F195, F129, F063, F125, F129, F177/F190; key cycling decision in owner-words 2026-09-25.
- Other products: macOS Markup and Figma recolour the selection with the colour control; Figma keeps the tool when its key is pressed again and puts the sibling on ⇧ (L line, ⇧L arrow).
- Agent 3's "Editing" row is the source of the "one home" wording.

</details>

### Side panels and detail pages

#### The editor's side panel holds the whole text of the screenshot; the session window has one current entry

- **Status:** proposed
- **Situation:** the editor's right panel while marking; the session window as the session's detail page.
- **Today:** the editor's panel (320 points, always shown, even when empty, F122) holds an unlabelled
  comment field ("Add a comment…") and, from the first reference on, "References" with one note per
  reference. Cards and moves are missing, though all three reach the agent (F076/F219/F226, F076/F102, F076). A
  selected reference does not light up its note (F103). The buttons stay pinned while notes scroll
  (good). The session window has two views, Document and Screenshots, with separate positions and
  separate actions: entry actions exist only in Screenshots (F138, F138); Screenshots shows the picture
  without its number, comment or notes (F135, F135, F135); the session's name appears twice at the top
  (F146).
- **Rule:**
  - Editor panel: the comment (labelled "Comment"), then one row per reference, card and move, each
    row linked to its mark (select one, the other lights up), each with a remove control; the target
    session and the two buttons in the pinned footer.
  - Session window: one "current entry" shared by both views. In Document, each entry carries its own
    Edit Again and Remove; in Screenshots, the picture shows its number, comment and notes beside it.
    Switching views keeps the current entry.
- **Why it helps:** the reviewer checks everything an agent will read in one place before saving, and
  never loses their place between the two views of a session.
- **Tradeoff:** a longer panel; a denser Screenshots view.
- **Exceptions:** none.
- **Example:** the card "Load more: make it infinite scroll" is on the image but not in the panel
  ([annotated](audits/2026-09-28/shots/1-editor-inuse-annotated.png)); agent 3's Screenshots proposal puts the notes
  beside the picture ([Proposal](audits/2026-09-28/shots/3-proposal-shots-tab.png)).
- **Applies to:** editor side panel; session window, both tabs.

<details><summary>Supporting notes</summary>

- Findings: F076/F219/F226, F060, F138, F076/F102, F091, F146, F103, F135, F138, F076, F122, F123, F135, F135.
- Other products: Figma's comments panel lists every pin and links both ways; CleanShot X and Xnapper have no list.

</details>

### Dialogs, menus and popovers

#### Interrupt only to protect work that has no way back; the menu is short, fixed and ordered by frequency

- **Status:** proposed
- **Situation:** anything that asks the reviewer to choose: the menu bar menu, dialogs, folder panels,
  the Mac menu bar while a Snapmark window is in front.
- **Today:**
  - _Menu bar menu:_ 12 top-level rows with no session (5 of them greyed), up to 17 with an update, an
    area and something discarded; three submenus; rows appear and disappear, so "Copy Prompt for AI"
    moves between row 6 and row 10 (F005, F005). Rarely used items (Choose New Area…, both Reopen items)
    sit in the top block (F006/F016, F006/F016). The hand-off is two items whose difference is invisible (F001/F184,
    F001, F001, F001, F001). The current-session block gives Rename, Show in Finder and Export the same
    rank as the hand-off (F002). Keyboard Shortcuts is filed under Settings (F003/F065, F003/F065, F003/F065).
  - _Dialogs:_ one Snapmark dialog (the quit question: "N screenshots are not in a session yet."
    [Review] [Quit anyway]); three macOS open panels (Sessions Folder…, Other Session…, Reopen
    Discarded…) with the default "Open" button and an explanation in a title macOS may not show;
    Rename is an AppleScript dialog, checked only after it closes (F177/F190, F177/F178, F177). Restart to Update
    closes unfinished editors without the quit question (F212).
  - _Mac menu bar:_ Electron's stock menus (View ▸ Reload ⌘R, Developer Tools; Edit ▸ Undo that does not
    undo marks; no Help, no Settings) (F067, F109, F067).
- **Rule:**
  - **Menu bar menu.** Fixed rows in a fixed order; unavailable rows are greyed, never hidden; rare
    states (an update waiting) are added at the bottom, above Quit. Top level, about ten rows:
    1. Capture Screenshot · Capture Same Area (with where the area is) · Choose Area…
    2. the current session's header, **one hand-off item**, Open Session
    3. session management: New Session…, Switch Session ▸ (and, fixed, Reopen Last Discarded)
    4. Settings ▸, Keyboard Shortcuts, Quit Snapmark
       Rename, Show in Finder and Export live in the session window (see Navigation and return); the full
       Discarded list lives in the session window, not a folder panel.
  - **The hand-off item** says what it copies, and the reviewer never has to remember a mode. The
    owner chooses between: (a) the key to the marks moves into `session.md`, and one "Copy for AI" copies
    one line with the quoted path (agents 1 and 7); (b) one "Copy Prompt for AI" with a sub-line "path +
    what the marks mean", and a Settings choice "Path Only" that also changes the item's label (agent 4,
    close to the owner's "Copy session info" idea); (c) one item that copies the prompt, with path-only
    as an ⌥ alternate (agent 6).
  - **Dialogs** interrupt only where work has no way back: quitting or restarting with unsaved editors,
    closing Edit Again with changes. They are Snapmark's own, attached to the window they concern;
    the message says what happens and whether it can be undone; the buttons name the action ("Quit",
    "Restart", "Use This Folder", "Move Sessions"); Esc is the safe choice, Return the default. Input
    is checked in the dialog before it closes, and what was typed is kept.
  - **The Mac menu bar** carries Snapmark's own menus (see Platform conventions), never stock
    development items.
- **Why it helps:** the menu is read by position and muscle memory; ten fixed rows ordered by use cut
  the decisions per visit, and dialogs that name their actions can be answered without reading.
- **Tradeoff:** greyed rows are visible when they do nothing; moving session actions into the session
  window puts them one step further away; a Snapmark-made rename dialog is more code than AppleScript.
- **Exceptions:** macOS's capture overlay, permission prompts and folder panels stay native (agent 5
  rule 16); folder panels get a message and a named button, not a custom replacement.
- **Example:** today ([rendered from the menu data](audits/2026-09-28/shots/1-menu-full-annotated.png)); proposals by
  agent 1 ([Proposal](audits/2026-09-28/shots/1-proposal-menu.png)), agent 7 ([Proposal](audits/2026-09-28/shots/7-proposal-menu.png)),
  agent 6 ([Proposal](audits/2026-09-28/shots/6-menu-built-vs-proposal.png)), and the copy item by agent 4
  ([Proposal](audits/2026-09-28/shots/4-proposal-copy-item.png)).
- **Applies to:** menu bar menu, quit and update questions, Sessions Folder…, Other Session…, Reopen
  Discarded…, Rename Session…, the Mac menu bar.

<details><summary>Supporting notes</summary>

- Findings: F001/F184 to F003/F065, F015, F067, F212, F180, F181, F177/F190, F004/F186, F177/F178, F001, F109, F067, F012, F007, F177, F180, F175, F001 to F174, F001, F002, F003/F065, F174, F004, F177/F178, F002, F001.
- Owner's words: "I just wonder whether we need just "Copy session info" when it comes with the prompt and everything, and in the settings you select whether you want to have the prompt with it or without it." — 2026-09-28; "also the menu is fucking verbose" — 2026-09-26.
- Reverses: the 2026-09-26 decision "Help menu removed: Keyboard Shortcuts moves into Settings" (Keyboard Shortcuts back to the top level) and the current hidden Export.
- Other products: macOS menus grey unavailable items; CleanShot X and Shottr keep fixed menus with capture modes on top; CleanShot X sets what "Copy" does once in Settings.

</details>

### Saving and unsaved work

#### The editor adds on ⌘↵ and keeps every other exit recoverable; the session window saves as you type and never drops typing

- **Status:** proposed
- **Situation:** leaving an editor; typing in the session window; anything that writes `session.md`.
- **Today:**
  - _Editor:_ nothing is saved until "Add to session" (⌘↵). Every other exit — Discard, ⌘W, Esc past
    Select, the close button, Quit anyway, Restart to Update, even ⌘R (which reloads the page and wipes
    the marks from view, F053, F053, F053) — files the capture in Discarded for 7 days, without a word
    (F058, F058, F058). Closing an unchanged Edit Again also files a copy, which comes back as a
    duplicate entry (F077/F078, F077/F078, F077/F078, F077/F078). Saving into a session whose folder was moved fails
    silently and leaves the button dead (F049, F049, F049, F049). Save changes in Edit Again replaces
    the saved screenshot for good (F079).
  - _Session window:_ autosaves about 0.2 s after typing stops, with no "saved" sign (F134, F134, F134).
    A save is refused if `session.md` changed outside meanwhile, and the window reloads, dropping the
    typing (F126/F127, F126, F126); after the first save a newline mismatch can make later saves refused
    (F127); the last keystrokes before closing are lost (F128, F128).
- **Rule:**
  - Editor: keep the explicit "Add to session ⌘↵". Every other exit is recoverable, as today, and says
    once where the screenshot went ("In Discarded for 7 days · Reopen"). An exit with nothing changed
    leaves nothing behind. Development keys (⌘R) do not exist in the release build.
  - Edit Again: "Save Changes" keeps the previous version in Discarded; closing with changes asks
    "Discard your changes to screenshot 004?" [Keep Editing] [Discard Changes].
  - A save that fails keeps the editor open with a line in its footer: event · consequence · action
    ("28 Sep 14:32 was moved or deleted. This screenshot is still here. Add it to another session…").
  - Session window: autosave with a quiet "Saved" / "Saving…" state in the header; closing writes what
    is typed first; a collision with an outside change never drops typing — it shows "session.md
    changed outside Snapmark" with [Keep Mine] [Load Theirs] (or merges when the changes do not
    overlap).
- **Why it helps:** the reviewer can close, quit or reload without thinking, and an agent writing the
  same file at the same moment never eats the reviewer's words.
- **Tradeoff:** a collision prompt in the session window is new UI; keeping previous versions of
  replaced screenshots grows Discarded.
- **Exceptions:** none.
- **Example:** after ⌘R the editor shows the clean capture with every mark gone
  ([annotated](audits/2026-09-28/shots/2-editor-after-reload-annotated.png)); a save into a moved session does nothing
  ([annotated](audits/2026-09-28/shots/2-editor-save-missing-session-annotated.png)).
- **Applies to:** editor (all exits), Edit Again, quit and restart, session window.

<details><summary>Supporting notes</summary>

- Findings: F077/F078, F053, F049 to F077/F078, F126/F127, F128, F125, F127/F137, F077/F078, F079, F053, F080, F051, F058, F049, F134, F058, F126, F049 to F077/F078, F134, F182/F183, F049 to F125, F058, F127.
- Owner's words: "if I took a screenshot, annotated it, and discarded it, it is gone. I just wonder if we should introduce a shortcut with Escape and be able to recover it so nothing ever gets lost." — 2026-09-25.
- Other products: Notion and Google Docs show "Saving…/Saved"; macOS document apps keep versions (File ▸ Revert To).

</details>

### Confirmation and undo

#### Act at once and offer Undo where it happened; ask only before what cannot be undone

- **Status:** proposed
- **Situation:** every action that removes, replaces or redirects something: Discard, Esc's last step,
  Remove from Session, Save Changes, New Session, Switch Session, Rename, Export.
- **Today:** only Quit with unsaved editors asks. Everything else acts at once: ⌫ on a mark (undoable),
  Discard and Remove from Session (to Discarded; no Undo in the window, F131, F131/F144, F131), Save Changes
  (overwrites, F079), New Session (no undo, F176/F225, F020/F176, F020/F176), Rename (no undo), exports (overwrite the
  previous PDF or ZIP silently, F198, F198). A third Esc after typing a note discards the screenshot
  (F051, F051, F051); every hint calls that step "close" (F163/F221, F163). Remove from Session looks exactly
  like Edit Again beside it (F131/F142/F145, F142, F142).
- **Rule:**
  - Recoverable actions happen at once and show their result with **Undo** in the same window (session
    window: a bar under the header; menu actions: the next menu shows "Undo New Session" as its first
    row for a minute, and the notification carries Undo).
  - Every removal and every replacement goes to Discarded, including the version replaced by Save
    Changes and the export replaced by a new export (or exports get a new name each time).
  - Esc never discards: it steps back and stops at the editor's resting state (Select, nothing
    selected); discarding is ⌘W or the Discard button (agent 4).
  - A destructive control never looks like its safe neighbour: Remove from Session is a quiet button
    set apart, and says where the screenshot goes.
  - Ask first only when the result cannot be undone, and say exactly what will be lost.
- **Why it helps:** the reviewer works at speed without questions, and nothing is ever one keystroke
  from gone.
- **Tradeoff:** an Undo bar and "Undo New Session" are new UI; Esc no longer closes the editor, which
  reverses the owner's 2026-09-25 decision "Esc on Select closes the editor as a recoverable discard".
- **Exceptions:** Quit and Restart to Update with unsaved editors keep asking, because the app is gone
  afterwards and Undo cannot live anywhere.
- **Example:** today Remove from Session acts at once and the count just drops
  ([annotated](audits/2026-09-28/shots/6-viewer-shots-after-remove-annotated.png)); proposal for the session window
  bottom bar: [Proposal](audits/2026-09-28/shots/1-proposal-session-window.png).
- **Applies to:** editor, session window, menu (New Session, Switch Session, Rename, Export), notifications.

<details><summary>Supporting notes</summary>

- Findings: F131/F142/F145, F223, F131, F142, F131, F142, F079, F176/F225, F163/F221, F051, F131, F020/F176, F051, F131, F163, F198, F020/F176, F051, F131/F144, F198, F131.
- Reverses: decision 2026-09-25 "Esc on Select closes (Recommended)".
- Other products: Figma, Google Docs and Gmail act at once with an Undo toast; macOS Photos moves deletions to "Recently Deleted"; macOS Screenshot's Esc cancels and keeps nothing (no work yet).

</details>

### Feedback and notifications

#### Say it in place, in proportion; a notification is never the only copy

- **Status:** proposed
- **Situation:** every result and every failure: adding, discarding, removing, copying, starting or
  switching a session, exporting, updating, a taken shortcut, a missing session.
- **Today:** macOS notifications for New Session ("New session: 2026-09-28 22.15"), "… is still empty, so
  new captures keep going there.", the two copies, a restored screenshot, wrong folders, a missing
  session, a taken shortcut ("Control+Shift+2 is taken by another app"), update checks and failed
  exports (raw error text). Nothing at all for Add to session (the window just closes, F062, F062,
  F062, F062), Discard (F058), Remove from Session (F131) or Switch Session. Failures inside the editor
  and the session window are silent (F049, F126/F127). Notifications can be switched off in macOS, and then
  every confirmation and error is gone (F172, F172, F172). "Check for Updates…" says "Downloading…" and
  never that it finished (F215); the automatic update speaks in the updater's words (F214, F214).
- **Rule:**
  - A frequent success gets a glance-sized sign that does not interrupt: after Add to session, the menu
    bar icon shows a brief tick and the new count, and the next menu's header shows "· 8 screenshots".
  - A discard or remove says once where it went, with a way back, where it happened (session window bar;
    for a closed editor, the menu's fixed Reopen row plus one notification).
  - A failure shows where it happened and stays until resolved (editor footer, a line at the top of the
    menu, a bar in the session window), written event · consequence · action, never raw error text.
  - Notifications are for things that happen out of sight (a copy, a background update, a taken shortcut
    at launch) and always have an in-app twin (the menu line) for when notifications are off.
  - Key names in messages use the symbols (⌃⇧2), never code names.
- **Why it helps:** the reviewer knows the screenshot landed, where a closed one went, and what failed,
  without watching the corner of the screen.
- **Tradeoff:** an icon badge and in-menu status lines are small new pieces of UI; fewer notifications
  mean less reassurance for a reviewer who liked them.
- **Exceptions:** Copy for AI keeps its notification, because the clipboard cannot show anything.
- **Example:** today a failed save leaves the editor as if nothing happened
  ([annotated](audits/2026-09-28/shots/7-missing-session-save-annotated.png)).
- **Applies to:** menu bar icon and menu, editor, session window, notifications, update.

<details><summary>Supporting notes</summary>

- Findings: F049, F058, F126/F127, F062, F131, F021/F158/F173 to F214, F060, F179, F184, F173, F214 to F171/F213, F185 to F187, F131, F062, F179, F017/F021/F173, F049, F172 to F213, F062, F172 to F213, F062, F028, F049, F171.
- Agent 2's "Feedback and notifications" default is the source of this rule.
- Other products: CleanShot X shows a Quick Access thumbnail after each capture; macOS Screenshot a floating thumbnail; Dropbox and 1Password badge their menu bar icon.

</details>

### Progress and long operations

#### Under a second show nothing; over a second show progress on the control that started it, and say when it is done

- **Status:** proposed
- **Situation:** export, the update download, moving sessions to a new folder, a future scrolling capture.
- **Today:** almost nothing is long: the editor shows its capture 0.2–0.6 s after opening; exporting 12
  screenshots takes about 0.3 s (PDF) and 0.02 s (ZIP); the picker waits 0.2 s before capturing (agent
  2's timings). Export shows nothing while it runs (F197). The one long job, the update download, says
  "Downloading…" and then nothing (F215).
- **Rule:** under a second, show nothing. Over a second, show progress on the control that started it
  (the menu item reads "Exporting PDF…" and is greyed; the session window's button shows a spinner) and
  say when it is done. A job that can partly fail (moving sessions, F175, F175) reports what moved and
  what did not, and can be retried.
- **Why it helps:** the reviewer is never unsure whether a long job is still running.
- **Tradeoff:** none worth naming at today's speeds.
- **Exceptions:** none.
- **Example:** Check for Updates… → notification "Downloading Snapmark 0.9.1…" → silence; under the rule
  the menu's first row reads "Downloading 0.9.1…" and then "Restart to Update (0.9.1)".
- **Applies to:** export, update, Sessions Folder…, scrolling capture if built.

<details><summary>Supporting notes</summary>

- Findings: F175, F215, F175, F197.
- Other products: macOS Finder shows progress in the item itself; CleanShot X's scrolling capture shows a live frame counter.

</details>

### Navigation and return

#### The reviewer ends where they started, and every window names what it holds and links to its session

- **Status:** proposed
- **Situation:** moving between the app being reviewed, the capture, the editor, the session window and
  back; opening anything that is already open.
- **Today:** the menu bar menu is the only hub. Each capture opens its own editor, centred, exactly on
  top of any editor already open (F059/F066). From a full-screen browser the editor stays on that Space while
  the Mac slides to the desktop, so the reviewer lands on an empty desktop and must swipe back (F026,
  F026 to F030, F026/F027, F026/F027, F026); the next Capture Same Area can then photograph the desktop. Every
  editor window is titled "Snapmark" (F059/F066, F059/F066, F059, F059, F059). The editor names its session only
  as "→ 2026-09-28 09.14" at the far top right and cannot reach it (F061/F101, F060, F101, F060, F060, F059/F060/F061).
  The session window cannot hand off, export or rename (F133, F133, F133, F133). Every session action
  works only on the current session, so looking at an older one redirects the next captures (F008,
  F004/F013). Opening a session window or the Keyboard Shortcuts window that is already open brings it
  forward (good).
- **Rule:**
  - A capture never moves the reviewer: the editor opens over the app and Space the capture came from
    (the way the area picker already does), and when it closes — added or discarded — focus goes back to
    that app.
  - A new editor opens offset from an open one, so a pile is visible as a pile.
  - Every window's title names what it holds, document first, in the session's one name: "Screenshot →
    28 Sep 14:32 — Snapmark", "Screenshot 004 · 28 Sep 14:32 — Snapmark" (Edit Again), "28 Sep 14:32 —
    Snapmark" (session window).
  - The editor names its target session next to "Add to session" and can open it or choose another
    session for this screenshot only.
  - The session window is where a session's actions live: Copy for AI (primary), Export, Rename, Show in
    Finder, Open in Markdown App, Discarded. It works for any session. Choosing a session in Switch
    Session opens it; making it current is its own, explicit step ("Capture into This Session").
  - Opening anything already open brings it forward.
- **Why it helps:** in the main scene the reviewer stays in the browser from the first capture to the
  last, and can always tell and reach where each screenshot goes.
- **Tradeoff:** an editor floating over a full-screen app covers the page being reviewed; separating
  "open" from "make current" adds a step to switching.
- **Exceptions:** the session window may open on the desktop, because it is a place to read, but the
  Mac then goes there with it (agent 2).
- **Example:** today and proposal for a full-screen capture
  ([Proposal](audits/2026-09-28/shots/2-fullscreen-proposal.png)); the session window with its actions
  ([Proposal](audits/2026-09-28/shots/1-proposal-session-window.png), agent 2's [Proposal](audits/2026-09-28/shots/2-viewer-proposal.png)).
- **Applies to:** editor, session window, area picker, Keyboard Shortcuts window, menu (Switch Session).

<details><summary>Supporting notes</summary>

- Findings: F133, F008, F026, F059/F066, F061/F101, F026 to F030, F059/F066 to F133, F100, F101, F060, F059, F059, F026/F027, F060, F059, F133, F026/F027, F133, F059/F060/F061, F004/F013, F026.
- Owner's words: "When I take a screenshot it's going to the desktop but the actual window stays at the full screen browser. This is something we should fix." — 2026-09-28.
- Other products: macOS Screenshot's thumbnail and Markup stay on the full-screen Space; CleanShot X's overlay and annotate window appear over full-screen apps; Figma titles windows by file name.

</details>

### Lists and selection

#### Click selects, double-click or Enter opens, ⌫ removes with Undo; every row says what makes it different

- **Status:** proposed
- **Situation:** Switch Session, the References list, the session window's screenshots and entries,
  Discarded, marks on the canvas.
- **Today:** Switch Session lists up to 20 sessions by last use as bare names ("28 Sep 09.14"): no counts,
  no dates for renamed ones, empty ones included (F013, F013, F013/F225); click makes it current. On the
  canvas one mark at a time (multi-select off), click to select, no keyboard selection (F048/F119). A
  reference row cannot be deleted from the list (F104); a selected reference does not show its row
  (F103); an undone deleted reference comes back last with a new number (F074). Screenshots are shown
  one at a time, counted by position ("3 of 3") while `session.md` numbers them (F136, F136, F136).
  Discarded is a folder panel (F174, F174, F174, F174, F174). Edit Again is greyed for older screenshots
  without saying why (F143, F143, F143).
- **Rule:**
  - Select, open and edit are separate: click selects, double-click or Enter opens or edits, ⌫ removes
    with Undo, and every row action is also reachable from the keyboard.
  - A selection on the image lights up its row and back; ⇧-click adds to a selection.
  - An undone removal puts the item back where it was, with its number.
  - Every row shows what makes it different: sessions with their count and date ("Checkout review · 12 ·
    27 Sep"), screenshots with their number and position ("Screenshot 004 · 3 of 3"), Discarded items
    with a thumbnail, time and session.
  - A greyed action says why on hover and in its accessible name ("Edit Again: marks were not kept for
    screenshots saved before 0.7").
  - A session can be deleted from its window (to Discarded, 7 days, with Undo), and an empty session
    that another session replaces removes itself, so Switch Session holds only real work.
- **Why it helps:** the reviewer recognises the right session or screenshot instead of decoding a
  timestamp, and never loses track of which note belongs to which mark.
- **Tradeoff:** longer rows in the menu; multi-select adds states to test.
- **Exceptions:** none.
- **Example:** "3 of 3" for the screenshot `session.md` calls 004
  ([annotated](audits/2026-09-28/shots/1-session-count-after-remove-annotated.png)).
- **Applies to:** menu (Switch Session), editor (canvas, References), session window, Discarded.

<details><summary>Supporting notes</summary>

- Findings: F136, F174, F225, F174, F143, F074, F103, F104, F013, F008/F225, F136, F143, F048/F119, F174, F143, F013, F014, F136, F013/F225, F174, F174.
- Agent 3's "Lists and selection" default is the source; C8 table in e3.

</details>

### Forms and validation

#### Check at the field before anything closes, keep what was typed, and label every field

- **Status:** proposed
- **Situation:** the comment and notes, a card, Rename Session, the folder panels, the area picker.
- **Today:** the comment field's only label is its placeholder "Add a comment…" (F091, F091, F091, F091);
  reference fields lose their "Note for 1" label once typing starts (F087). Rename is checked after its
  dialog has closed: a taken name gives a notification and the typed name is lost; "/" and ":" are
  replaced silently (F177/F178, F177, F177/F178, F177/F178). Other Session… and Sessions Folder… are checked after the
  panel closes (F004/F186, F004). An area under 8 × 8 starts over silently. An empty note is saved as
  "_(no note)_" (F090, F090).
- **Rule:**
  - Every field has a visible label ("Comment", "Note 1"); placeholders only suggest ("What should
    change here?").
  - Input is checked in the field while the surface is open: a taken name is flagged under the field,
    with the typed name kept; a character that cannot be used is shown as it will be saved.
  - Enter submits single-line fields, ⌘↵ multi-line ones; Esc cancels a dialog, leaves a field without
    reverting it.
  - Folder panels say what to pick in their message and grey what cannot be picked.
  - An empty note is left out of `session.md` (the reference stands for itself), not written as a
    placeholder.
- **Why it helps:** mistakes are caught where they are made, and no typing is thrown away.
- **Tradeoff:** a Snapmark-made rename field (in the session window header) replaces the AppleScript
  dialog, which is more code.
- **Exceptions:** none.
- **Example:** the comment field without a label ([annotated](audits/2026-09-28/shots/7-editor-empty-1180-annotated.png)).
- **Applies to:** editor side panel, Rename Session, Other Session…, Sessions Folder…, `session.md`.

<details><summary>Supporting notes</summary>

- Findings: F004/F186, F091, F177/F178, F177, F091, F087, F091, F177/F178, F090, F090, F091, F004, F177/F178, F087.
- Agent 3's "Forms and validation" default is the source.

</details>

### Keyboard and focus

#### Global keys capture; Esc steps back and stops; letters act only outside text; every key is in one list one key away

- **Status:** proposed
- **Situation:** every key in every Snapmark surface, and where focus goes when a surface opens or closes.
- **Today:** every Snapmark window takes focus when it opens. A new reference moves the cursor into its
  note (the owner's request, met); a new card starts in typing mode. Single-letter and digit keys are
  suspended in text fields; ⌘ keys always act, including the stock ⌘R, which wipes the marks (F053). Esc
  steps back through four levels in the editor and ends by discarding (F163/F221, F051); it cancels the area
  picker; it does nothing in the session window or the Keyboard Shortcuts window (F165). Global keys:
  ⌃⇧1 capture, ⌃⇧2 New Session, ⌃⇧3 Capture Same Area — New Session between the two captures (F020,
  F020, F020/F176, F020/F176, F020), one modifier away from macOS's own ⌘⇧3/4/5 (F022, F022), and none of them can
  be changed (F021, F021, F017/F021/F173, F021). Choosing a tool from the keyboard throws focus to the top of the
  page (F056, F056). No keyboard route for moving marks or for any menu action (F048/F119, F025); the key list
  lives under Settings and misses the session window's and area picker's keys (F161, F159). Right after
  a reference, the next tool key types into its note (F124).
- **Rule** (agent 4's five points):
  1. Global keys are for capturing only, on neighbouring keys. Actions that change which session is
     current are menu actions; if one gets a key, it sits apart from the capture keys and can be undone.
     The owner chooses the keys: (a) ⌃⇧1 capture, ⌃⇧2 Capture Same Area, New Session without a key
     (agents 1 and 6); (b) ⌃⇧1 and ⌃⇧3 as today with ⌃⇧2 left empty as a buffer, New Session optionally
     ⌃⇧N (agent 4); (c) ⌃⇧4 and ⌃⇧5, mirroring macOS's ⌘⇧4 and ⌘⇧5 (agent 7). All global keys can be
     changed in the Keyboard Shortcuts window.
  2. Esc steps back inside a surface and stops at its resting state; transient surfaces (the area
     picker, the Keyboard Shortcuts window) close on Esc; discarding or closing a document is ⌘W.
  3. Letter and digit keys act only while no text field has the cursor; ⌘ keys act everywhere, and only
     keys Snapmark defines itself are active (no stock Reload or developer tools in release builds).
  4. Every key is shown in one generated list, grouped by where it works ("Anywhere", "In the editor",
     "In the session window", "In the area picker"), built from the keys actually registered, and that
     list is one key away (⌘/) from any Snapmark window.
  5. Every frequent pointer action has a key: arrow keys nudge the selected mark (⇧ for larger steps),
     Tab moves between marks (see the accessibility rules for placing).
     Focus: choosing a tool keeps focus on the tool (or the image); leaving a note or card returns focus to
     its mark; closing a surface returns focus where it came from (agent 5 rules 4 and 5).
- **Why it helps:** the frequent thing is always one chord away, the destructive thing never is, and the
  reviewer can learn every key from one place.
- **Tradeoff:** moving a global key re-teaches a key that shipped one day ago; Esc no longer closes the
  editor (reverses the owner's 2026-09-25 decision); a key recorder is new UI.
- **Exceptions:** placing a mark and dragging the area stay pointer actions by default (the job is
  pointing); the accessibility rules add keyboard routes for both. The editor keeps single-key tools
  (a Figma-like canvas convention, the owner's request).
- **Example:** the shortcuts list today puts the three keys that work anywhere last
  ([annotated](audits/2026-09-28/shots/1-shortcuts-window-annotated.png)); agent 4's key proposal
  ([Proposal](audits/2026-09-28/shots/4-proposal-new-session-keys.png)).
- **Applies to:** global keys, editor, session window, area picker, Keyboard Shortcuts window, menu.

<details><summary>Supporting notes</summary>

- Findings: F020, F003/F065, F021, F159, F020, F053, F067, F163/F221, F051, F161 to F045/F158, F072 to F022, F165, F048/F119, F056, F112, F119, F024, F020/F176, F017/F021/F173, F051, F159/F160, F025, F020/F176, F022, F051, F159/F160/F161, F021, F124, F020, F056, F034/F048, F021/F158.
- Owner's words: "Also the new session is a very dangerous shortcut because it sits in between 1 and 2." — 2026-09-28; "it needs to be shortcuts so I can just do this on the fly." — 2026-09-25.
- Agent 4's key × screen map (e4, C17) lists every key today.
- Other products: CleanShot X, Shottr and Xnapper bind only capture modes globally and let every key be recorded; Figma opens its shortcut panel with ⌃⇧?.

</details>

### Search and filters

#### No search in the menu; find-in-page in the session window; revisit when sessions outgrow twenty

- **Status:** proposed
- **Situation:** finding an older session; finding a note in a long session.
- **Today:** none anywhere. Switch Session shows the 20 most recently used sessions; older ones only
  through a Finder folder panel (F004/F013). ⌘F does nothing in the session window (F150).
- **Rule:** no search in the menu (twenty recent sessions plus "Other Session…" is enough). Find in
  page in the session window: ⌘F, matches as you type, Enter for the next, Esc clears and returns focus.
  Revisit a session filter only if sessions routinely exceed twenty.
- **Why it helps:** a long review can be checked for a word before it is handed off.
- **Tradeoff:** none worth naming.
- **Exceptions:** none.
- **Example:** a 30-screenshot session: ⌘F "Delete" jumps between the three notes that mention it.
- **Applies to:** session window; menu (Switch Session, Other Session…).

<details><summary>Supporting notes</summary>

- Findings: F150, F004/F013; agent 3's "Search and filters" default.

</details>

### Undo across the app

#### ⌘Z undoes the last action in the front window, names it, and Discarded is the net for everything else

- **Status:** proposed
- **Situation:** any action the reviewer wants back, in any window.
- **Today:** editor: ⌘Z / ⇧⌘Z and buttons, one history for marks, the focused note's own typing first;
  colour changes leave no step; the Undo button and ⌘Z behave differently inside a note (F070); the Mac
  menu bar's Edit ▸ Undo does nothing to marks (F109). Session window: the Document's own typing history
  only; Remove from Session has no undo. Menu actions: none undoable. Discarded (7 days, reached from
  the menu) is the app-wide net. Undo never names its step (F105).
- **Rule:** ⌘Z undoes the last action in the focused window, including Remove from Session and Save
  Changes; the Undo button, ⌘Z and Edit ▸ Undo do the same thing; Undo and Redo name the step ("Undo
  Move Card", "Undo Remove Screenshot 004"); actions that cannot be undone say so before they run;
  Discarded stays the net for anything closed, removed or replaced, and menu actions offer Undo in
  their result (see Confirmation and undo).
- **Why it helps:** one habit (⌘Z) works everywhere, and the reviewer sees what it will undo.
- **Tradeoff:** named steps need a name for every action.
- **Exceptions:** exports and copies are not undone (nothing is lost); a new export keeps the old one.
- **Example:** Undo ⌘Z in the editor's toolbar reads "Undo" whatever it undoes
  ([annotated](audits/2026-09-28/shots/3-hints-annotated.png)).
- **Applies to:** editor, session window, Mac menu bar, menu actions.

<details><summary>Supporting notes</summary>

- Findings: F074, F131, F105, F079, F109, F070, F131; agent 3's "Undo across the app" default.

</details>

### Copy and paste

#### Marks copy, paste and duplicate like any object; an image pasted into Snapmark becomes a screenshot

- **Status:** proposed
- **Situation:** reusing a mark; bringing in an image from elsewhere; putting a marked image into a chat
  or ticket.
- **Today:** text copies and pastes normally in the notes, the comment and the Document tab. Marks cannot
  be copied, pasted or duplicated (F068, F068). An image cannot be pasted into the editor or a session
  (F229). The menu writes the prompt or the path to the clipboard.
- **Rule:** ⌘C, ⌘V, ⌘D and ⌥-drag work on marks, within and between editors (a pasted reference takes
  the next number and an empty note). Pasting an image when no text field has the cursor, or "Mark Up
  Clipboard Image" in the menu, opens it as a new screenshot. Text pasted into a note stays plain
  Markdown. ⌘C with nothing selected copies the marked image.
- **Why it helps:** the owner asked to "copy and paste stuff around"; a repeated mark (the same box on
  three buttons) costs one keystroke.
- **Tradeoff:** a pasted image of unknown size needs the editor's zoom (see Capturing).
- **Exceptions:** Redact cannot be pasted elsewhere (it would show a pixelated copy of another place).
- **Example:** three identical boxes around three buttons: draw one, ⌘D twice, drag each into place.
- **Applies to:** editor, menu.

<details><summary>Supporting notes</summary>

- Findings: F068, F229, F068. Owner's words: "I want to be able to draw inside the screenshots, also copy and paste stuff around, and work." — 2026-09-25.
- Other products: macOS Markup, Figma and CleanShot X all copy, paste and duplicate annotations.

</details>

### Drag and drop

#### Keep the canvas drags, give every drag a click and a keyboard route, and handle what is dropped

- **Status:** proposed
- **Situation:** drawing, moving and resizing marks; the card's pointer; Cut & move; the area picker;
  files dropped from Finder; dragging the marked image out.
- **Today:** dragging on the image draws the current tool; with Select it moves marks and handles resize;
  a card gets its pointer only by pressing on the target and releasing where the card goes, a gesture
  shown nowhere (F064, F064); Cut & move lifts and drags a piece; the area picker is one drag, captured
  on release with no chance to adjust (F036, F036, F036, F036). Arrow, Cut & move, Redact and the card's
  pointer can only be made by dragging (F085). Nothing can be dragged out of Snapmark. Dropped files are
  not handled, and a dropped image probably replaces the editor page (F081, assumption).
- **Rule:**
  - Keep the canvas drags. Every drag also has a two-click route (press = first click, release = second)
    and a keyboard route (arrows move, Enter confirms) — agent 5 rule 2.
  - The area picker shows the dragged rectangle with handles and a "Capture" button (Return) before it
    captures; Esc cancels.
  - A card's pointer is offered on the card itself: a handle on its edge to drag to the target.
  - Navigation by drop is blocked in every window; a dropped image opens as a new screenshot; an
    unreadable file says so in place.
  - Dragging the marked image out of the editor or the Screenshots tab gives the PNG.
- **Why it helps:** the gestures stay fast for the pointer, become possible without it, and the area can
  be fixed before it is committed.
- **Tradeoff:** an adjust step before the first Capture Same Area adds one keypress (once per area).
- **Exceptions:** freehand pen strokes stay pointer-only (a path cannot be clicked).
- **Example:** the area captured the moment the mouse is released
  ([annotated](audits/2026-09-28/shots/7-area-dragging-annotated.png)); agent 5's click and key route for the area
  ([Proposal](audits/2026-09-28/shots/5-proposal-area-keyboard.png)).
- **Applies to:** editor canvas, area picker, every window (drop), session window (drag out).

<details><summary>Supporting notes</summary>

- Findings: F042, F036, F036, F081, F229, F085, F086, F034, F039, F036, F064, F036, F064.
- Other products: macOS ⌘⇧5 shows the rectangle with handles and a Capture button; CleanShot X lets captures be dragged out from its overlay.

</details>

### Media playback

**Not applicable:** Snapmark has no audio or video (briefing, section 5). The scrolling-capture
exploration does not change that.

### Platform conventions

#### A Mac app: its own app menu, macOS words and key symbols, windows titled by what they hold

- **Status:** proposed
- **Situation:** the Mac menu bar while a Snapmark window is in front; labels, case and key symbols;
  window titles; standard keys; relaunching.
- **Today:** Electron's stock app menu (File with only Close Window, which discards the screenshot, F110;
  View with Reload ⌘R and Developer Tools; Edit ▸ Undo that does not reach marks; no Help; no Settings…
  ⌘,) (F067, F109, F067). The tray menu follows Title Case; the editor's buttons use sentence case, the
  session window Title Case, the Keyboard Shortcuts window sentence case (F227, F227). ⌃ is drawn like
  "^" in the area picker and the shortcuts window (F046/F166); key hints are styled two ways (F098, F098,
  F116). "Show Session in Finder" opens the folder instead of revealing it (F019). Editor windows are all
  titled "Snapmark". Relaunching the running app does nothing (F217). Folder panels explain themselves
  in a title macOS does not show and keep the default "Open" button (F175).
- **Rule** (agent 4's seven points):
  1. Snapmark's own app menu: Snapmark (About, Settings… ⌘,, Keyboard Shortcuts ⌘/, Hide, Quit), Edit wired
     to the editor's undo, Window, Help; no development items in release builds.
  2. Title Case for menu items, buttons and window titles; sentence case for descriptions, hints and
     notifications.
  3. Key symbols in the macOS order ⌃⌥⇧⌘, drawn in the system font; the key hint is shown beside the
     name, not spelled into it.
  4. Window titles name the document first: "28 Sep 14:32 — Snapmark", "Screenshot 004 · 28 Sep 14:32 —
     Snapmark".
  5. "Show in Finder" reveals the item; "Open … Folder" opens it. Ellipsis only when more input follows.
  6. Dialogs carry their explanation in the message and name their button after the action ("Use This
     Folder", "Reopen").
  7. Relaunching the running app opens its menu.
- **Why it helps:** the reviewer's Mac habits (⌘,, Help, ⌘Z from the menu bar, Show in Finder) work as
  everywhere else.
- **Tradeoff:** Title Case on the editor's buttons changes the owner's current "Add to session".
- **Exceptions:** the editor keeps single-key tools (a Figma-like canvas convention, the owner's
  request).
- **Example:** the stock View menu's Reload wipes the marks ([annotated](audits/2026-09-28/shots/4-reload-annotated.png)).
- **Applies to:** Mac menu bar, every window, menu bar menu, dialogs, README.

<details><summary>Supporting notes</summary>

- Findings: F067, F098, F053 to F110, F046/F166, F019, F180 to F059, F098, F227, F165, F217, F116, F227.
- Agent 4's "Platform conventions" rule is the source, point for point.

</details>

### Local work and external writes

#### The reviewer's words are never dropped, a failed write says so in place, and what Snapmark keeps on disk is what the reviewer expects

- **Status:** proposed
- **Situation:** Snapmark writes `session.md`, `img/`, `.edit/`, `.discarded/`, exports and the clipboard;
  others write `session.md` too (an agent, the Markdown app, a sync service); sessions can live in a
  cloud folder.
- **Today:** the session window reloads in place when `session.md` changes outside, and typing made at
  that moment is dropped (F126/F127, F126, F126). A save into a folder moved away fails silently (F049, F049).
  Changing the sessions folder leaves sessions and Discarded behind, unreachable (F175, F175, F175,
  F175). The session window loses the last keystrokes on close (F128, F128). Redact pixelates the saved
  image but keeps the clear original in the session folder for Edit Again (F192). Exports replace the
  previous one silently (F198, F198).
- **Rule:**
  - A write that collides keeps the reviewer's text and asks (see Saving); a write that fails says so in
    place with a way forward; a change from outside shows in place (as today).
  - Changing the sessions folder offers to move the sessions, reports what moved, and keeps the old
    folder reachable through "Other Session…".
  - Closing a window writes what it holds first.
  - Anything the reviewer redacted is redacted everywhere Snapmark keeps it: the clear original for Edit
    Again is kept outside the shared session folder (or the redaction is burnt in and Edit Again keeps
    only the marks), and the README says what is kept where.
  - A new export gets a new name (or keeps the old one in Discarded).
- **Why it helps:** sharing a session folder (scene 2) or letting an agent edit it (scene 1) never costs
  the reviewer text, work or privacy.
- **Tradeoff:** keeping originals outside the session folder means Edit Again does not travel with a
  copied folder.
- **Exceptions:** the clipboard is overwritten by design (copy items), and says so.
- **Example:** typing in the Document tab while an agent writes the file
  ([annotated](audits/2026-09-28/shots/2-viewer-after-outside-change-annotated.png)).
- **Applies to:** session window, editor, Sessions Folder…, export, Redact, the session folder.

<details><summary>Supporting notes</summary>

- Findings: F175, F049, F009, F126/F127, F128, F175, F175, F198, F126, F049, F198, F175, F128, F126, F192, F127.
- Agent 2's "Local work and external writes" default is the source; the Redact point is from F192.

</details>

### Connection to external systems

**Not applicable:** Snapmark connects to nothing except the daily update check (briefing, section 5).
A cloud sessions folder is the operating system's sync, covered by Local work and external writes.

### Remembered state

#### Remember what a run of captures repeats and what the reviewer arranged, never a destructive tool

- **Status:** proposed
- **Situation:** the tool and colour between captures; window sizes, positions and tabs; the current
  session; the area.
- **Today:** remembered across launches: the current session, the sessions folder, when each session
  was last used, the area. Not remembered: the tool and colour between captures (every editor starts on
  Box in red, F107), the session window's tab, size, position and entry (F147), the Keyboard Shortcuts
  window's size. Discarded items: 7 days. The source Space of a capture is not recorded (F026).
- **Rule:** remember the last tool group and colour for the next capture while Snapmark runs; remember
  each window's size, position and tab globally, and the last entry shown per session; record the app
  and Space each capture came from, to return there (see Navigation and return).
- **Why it helps:** ten captures in a row need the same tool and colour ten times; the session window
  opens as the reviewer left it.
- **Tradeoff:** a remembered tool can surprise a reviewer who expects a fresh start.
- **Exceptions:** never start a capture on a destructive variant (Remove area, Redact) by memory; fall
  back to its group's first tool.
- **Example:** after nine highlighted captures the tenth editor opens on Highlighter, not Box.
- **Applies to:** editor, session window, Keyboard Shortcuts window, capture.

<details><summary>Supporting notes</summary>

- Findings: F107, F147, F026; agent 2's "Remembered state" default.

</details>

### First run and help

#### Say once where Snapmark lives and how to capture; catch a missing permission before a capture is wasted; help is one key away

- **Status:** proposed
- **Situation:** the first launch, the first capture, learning the keys, empty states.
- **Today:** the first launch shows only a small menu bar icon, possibly behind the notch (F209, F209,
  F209, F209). Without Screen Recording permission every capture is the wallpaper, with no explanation
  (F210, F210, F210). Help is the tooltips, the key under each tool, the picker's hint and the Keyboard
  Shortcuts window under Settings; no Help menu, no key for help, no route from the editor (F003/F065, F065,
  F003/F065, F003/F065). The empty session's hint ("This session is empty. Capture a screenshot with ⌃⇧1.") never
  shows (F132, F132, F132, F132, F132, F132). The first-run menu shows "No Session Yet" over five greyed
  rows (F007, F007). The README teaches ⌘⇧1 and ⌘⇧2 (F211/F218, F211, F211, F211/F218, F211).
- **Rule:**
  - The first launch opens the menu once (or shows one small window) saying where Snapmark lives and the
    two capture keys.
  - Snapmark checks Screen Recording before the first capture and, if it is missing, shows the steps
    ([Open System Settings] then [Quit & Reopen]) instead of a wallpaper capture.
  - Help is one key away everywhere (⌘/) and in the Mac menu bar's Help menu; the list opens on the keys
    that work anywhere.
  - Every empty state teaches the next step, in the window where it is seen ("No screenshots yet. Press
    ⌃⇧1 to capture one.").
  - Tooltips, hints and the README are generated from, or checked against, the same key list.
- **Why it helps:** the first useful screenshot happens without reading the README.
- **Tradeoff:** a first-launch sign is shown once and then never again; a reviewer who misses it still
  has the menu.
- **Exceptions:** none.
- **Example:** an empty session's window shows only its date
  ([annotated](audits/2026-09-28/shots/3-empty-session-annotated.png)).
- **Applies to:** first launch, first capture, menu, editor, session window, Keyboard Shortcuts window,
  README.

<details><summary>Supporting notes</summary>

- Findings: F007, F003/F065, F211/F218, F132, F209 to F065, F132, F007, F132, F211, F003/F065, F210 to F211, F132, F210, F132, F003/F065, F211/F218, F209, F209, F211, F132.
- Other products: CleanShot X and Shottr open a short welcome window on first launch and walk through the Screen Recording permission.

</details>

### Motion

#### No decorative motion; motion only to explain a change of place, and never to move the reviewer between Spaces

- **Status:** proposed
- **Situation:** anything that animates.
- **Today:** Snapmark's pages have no animation. The motion the reviewer sees is macOS's: windows opening
  and closing, and the Space slide when an editor or session window opens from a full-screen app (F026),
  which moves the reviewer away from their work.
- **Rule:** no decorative motion. Motion only to explain a change of place (a screenshot flying into the
  menu bar icon after Add to session, if built), short, and off under macOS's Reduce Motion. Never a
  Space slide as a side effect of a capture.
- **Why it helps:** nothing distracts from the review, and the one sign of success is readable at a
  glance.
- **Tradeoff:** none.
- **Exceptions:** none.
- **Example:** today's Space slide after a full-screen capture ([Proposal](audits/2026-09-28/shots/2-fullscreen-proposal.png)).
- **Applies to:** editor, session window, menu bar icon.

<details><summary>Supporting notes</summary>

- Findings: F026, F062; agent 5 rule 15; agent 2's "Motion" default.

</details>

### Capturing (product-specific)

#### Capturing never captures Snapmark, never loses the reviewer's place, and shows what it will capture

- **Status:** proposed
- **Situation:** Capture Screenshot, Capture Same Area, the area picker, ten captures in a row.
- **Today:** Capture Same Area photographs Snapmark's own editor when one is still open over the area
  (F033/F066, F033, F033), and each new editor opens exactly on top of the last. The area is a fixed place on
  the screen, not a place in the browser (F037), shown only by its size, "1280 × 720" (F035, F035, F035,
  F035, F035); "Choose New Area…" also captures at once (F040). The picker opens only on the display
  under the pointer (F038, F038) and captures on release (see Drag and drop). A failed capture looks
  like a cancelled one (F028). Every capture stops for an editor, so ten in a row means ten editors
  (F032). The editor fits the image to the window with no zoom (F069, F069), and a small capture on a
  Retina screen is shown at twice its size and looks soft (F106).
- **Rule:**
  - Snapmark hides its own windows for the moment of a capture and brings them back after.
  - Capture Same Area names where the area is ("1280 × 720 · Built-in Display, top left") and "Choose
    Area…" opens the picker with the current area drawn, movable and resizable, on every display.
  - A capture that fails says so; Esc stays silent.
  - The editor can zoom (⌘+, ⌘−, ⌘0 for fit, pinch) and shows a small capture at its real size.
  - The owner decides whether a "Capture Only" variant (⌃⇧ + the key with ⌥) adds the screenshot to the
    session unmarked, without an editor, for fast runs (F032).
- **Why it helps:** "capture the same area ten times in a row" works at the reviewer's pace, and the
  reviewer can check the area before trusting it.
- **Tradeoff:** windows vanish for a fraction of a second on each capture.
- **Exceptions:** macOS's capture overlay (Capture Screenshot) is the system's and stays as it is.
- **Example:** the menu shows only the area's size ([annotated](audits/2026-09-28/shots/1-menu-full-annotated.png)).
- **Applies to:** global keys, menu, area picker, editor.

<details><summary>Supporting notes</summary>

- Findings: F033/F066, F040, F035, F106, F069, F035, F035, F033 to F038, F033, F035, F028 to F035, F069.
- Owner's words: "For every screenshot that I take I may want to record the same area." — 2026-09-28.
- Other products: CleanShot X "Capture Previous Area" and macOS ⌘⇧5 "Remember Last Selection"; CleanShot X "Capture and save without the overlay" option for fast runs.

</details>

### The session file (product-specific: output for AI and for people)

#### `session.md` explains itself: the key to the marks, labelled text, marks in words, one number and one time format

- **Status:** proposed
- **Situation:** what an agent reads (scene 1) and what a person reads in the PDF or ZIP (scene 2).
- **Today:** the file holds "# <folder name>", then per entry "## 001 · 22:13", the image ("Screenshot 1"),
  the comment as an unlabelled paragraph (F194, F194, F226), numbered notes ("_(no note)_" when empty),
  "- Card: …" lines, and a 95-character move sentence repeated in every entry with a move (F203). It
  never says what was marked for removal, boxed, highlighted or pointed at (F191, F191); two cards cannot
  be told apart (F196); a move is a count (F202); headings give the time but not the day (F199, F200).
  The key to the marks exists only in the copied prompt, so the PDF and the path alone carry none (F001/F184,
  F193, F193). The prompt calls a screenshot an "entry" (F204). Almost every Retina capture costs the
  agent about 1,530 tokens (F207).
- **Rule:**
  - The key to the marks is written once at the top of `session.md` (and printed on the PDF's first
    page).
  - Each entry is headed by its number, day and time ("## 004 · 28 Sep 14:32") and, when there is one,
    the comment, labelled ("Comment: …") or used as the heading (owner decides).
  - A "Marks:" line lists what the image carries in words ("Marks: 1 cross (remove), 1 box, 2 references,
    1 card A → Load more"); cards are lettered with what they point at; a move says what moved where.
  - One number format everywhere ("Screenshot 004"), one time format ("14:32").
  - An empty note is left out; notes are written exactly as typed.
  - The image size stays within the model's limits; a smaller default (1,000 px long edge) is the
    owner's choice (F207).
- **Why it helps:** an agent acts on the text without guessing, a person reads the PDF without the app,
  and the hand-off item can shrink to one line (see Dialogs, menus and popovers).
- **Tradeoff:** the key costs about 150 tokens once per session; the "Marks:" line a few tokens per entry.
- **Exceptions:** none.
- **Example:** today's entry and its unlabelled comment ([annotated](audits/2026-09-28/shots/1-session-doc-annotated.png));
  the PDF without a key ([annotated](audits/2026-09-28/shots/7-export-pdf-marked-annotated.png)).
- **Applies to:** `session.md`, the session window's Document tab, PDF and ZIP export, the copied prompt.

<details><summary>Supporting notes</summary>

- Findings: F001/F184, F194, F191 to F203, F207, F205 to F194, F226, F201, F195, F193 to F090, F193 to F200, F191.
- Owner's words: "It's basically for providing feedback to AI in a nice and token-efficient way." — 2026-09-25.
- Agent 3's "Output for AI" table (e3) has the token arithmetic.

</details>

### Accessibility rules

Agent 5's sixteen rules, each written so it can be checked, each tied to the rule area it belongs to.
They apply on top of the area rules above. WCAG 2.2 AA is the bar.

#### A1 · Every pointer action has a keyboard route (keyboard and focus)

- **Status:** proposed
- **Today:** no mark can be placed, selected, moved or resized without a pointer; the area can only be
  dragged; no key opens Snapmark's menu (F048/F119, F034, F024, F034/F048).
- **Rule:** the image is one Tab stop with a keyboard cursor: arrows move it, Enter places the current
  tool (twice for tools with a start and an end), Tab cycles through marks, arrows nudge the selected
  mark, ⌥-arrows resize it, ⌫ deletes. The area picker takes the same keys. A global key (owner's choice)
  opens the menu.
- **Why / tradeoff:** a reviewer without a pointer, or with a tired wrist, can do the whole job; the
  canvas needs a visible keyboard cursor.
- **Exceptions:** freehand pen strokes.
- **Example:** [Proposal](audits/2026-09-28/shots/5-proposal-keyboard-marks.png).
- **Applies to:** editor canvas, area picker, menu.

#### A2 · Every drag has a click route (drag and drop)

- **Status:** proposed
- **Today:** arrows, cuts, redactions, card pointers and the capture area exist only as drags (F085, F086,
  F039).
- **Rule:** two clicks stand for press and release.
- **Why / tradeoff:** WCAG 2.5.7; a click-click mode must not break the fast drag.
- **Exceptions:** pen strokes.
- **Applies to:** editor canvas, area picker.

#### A3 · Act on release, not on press (editing)

- **Status:** proposed
- **Today:** a Reference is placed on press (F118).
- **Rule:** a press that slides off does nothing; every mark is committed on release.
- **Applies to:** editor canvas.

#### A4 · Focus never falls to nowhere (keyboard and focus)

- **Status:** proposed
- **Today:** choosing a tool throws focus to the top (F056, F056); Next at the last screenshot and
  Remove on the last one drop focus to the page (F141); leaving a note or card drops focus (F119).
- **Rule:** a control acted on keeps focus; if it disappears or is disabled, focus moves to a named
  neighbour; leaving a note or card returns focus to its mark.
- **Example:** [annotated](audits/2026-09-28/shots/5-tab-order-annotated.png).
- **Applies to:** editor, session window.

#### A5 · Focus lands where the work is when a surface opens, and returns when it closes (keyboard and focus)

- **Status:** proposed
- **Today:** see agent 5's focus table (e5): the editor opens with focus on the page body; the session
  window on the body; the area picker and the Keyboard Shortcuts window have nothing focusable.
- **Rule:** the editor opens on the image (once it can hold focus) or the first tool; the session window
  on the tab it opened with; the area picker on its frame; closing a surface returns focus to where it
  came from (for the editor: the app and Space of the capture).
- **Applies to:** editor, session window, area picker, Keyboard Shortcuts window.

#### A6 · Every control and field has a name in words (dialogs and menus, forms)

- **Status:** proposed
- **Today:** the comment and note fields have no accessible name (F087); the card's text box is unnamed
  and hidden (F111); ← and → are named by symbols (F151); the colour well only by a hover tip (F092/F097); key
  symbols run into button names (F116); "References" looks like a heading but is not one (F117).
- **Rule:** icons, arrows and swatches get a spoken name; placeholders never serve as the only name;
  shortcuts are exposed as key-shortcut properties, not spelled into the name; headings are headings.
- **Applies to:** every Snapmark window.

#### A7 · Every picture has a text alternative, decoration none (feedback)

- **Status:** proposed
- **Today:** the screenshot being marked has no name (F057); the Screenshots tab's picture is hidden from
  screen readers (F130, F130); images in the document are "Screenshot 1" (F208); tool icons in the
  shortcuts window read as "image" (F169).
- **Rule:** the image being marked, the screenshot in the Screenshots tab and each image in the document
  carry their number and comment; each mark is in a spoken list; icons next to a word are hidden.
- **Applies to:** editor, session window, Keyboard Shortcuts window, `session.md`.

#### A8 · Every result is spoken (feedback)

- **Status:** proposed
- **Today:** changing tool, placing a mark, stepping through or removing screenshots, and the area's size
  while dragging are silent to a screen reader (F089, F153, F043).
- **Rule:** one polite live region per window announces: tool chosen, mark placed or removed, undo, saved
  into which session, screenshot n of m, area size.
- **Applies to:** editor, session window, area picker.

#### A9 · Contrast in light and dark, measured (visual; applies to every area)

- **Status:** proposed
- **Today:** selection frame and handles 1.6:1 (F082); selected tool 1.3:1 (F083); placeholder 4.4:1
  (F113); note field edges 1.1–1.3:1 (F114); white numbers on any picked colour (F088, F088); selected
  tab 1.3:1 (F140); entry headings 4.4:1 (F152); the area's edge a 1-point white line (F044); the
  Highlighter disappears on dark screens (F054, F054); the default red disappears on red, blue and grey
  elements (F084); a dark screenshot has no edge in dark mode (F096/F149, F096).
- **Rule:** text 4.5:1 including placeholders and muted greys; states, field edges, focus and selection
  handles 3:1; marks carry a keyline so they read at 3:1 on any ground; reference numbers pick black or
  white for contrast; the Highlighter stays visible on dark screens.
- **Example:** [annotated](audits/2026-09-28/shots/5-marks-backgrounds-annotated.png).
- **Applies to:** every Snapmark window and every mark.

#### A10 · Meaning is never colour alone (editing)

- **Status:** proposed
- **Today:** "keep" and "remove" can only be told apart by colour (F050); there is no keep mark (F050,
  F050, F050, F050); every mark starts in the remove red (F052/F095, F052/F095, F052, F052).
- **Rule:** every verdict has its own shape (cross = remove, and a tick = keep if the owner brings the
  approve mark back), and the text names the shape; colour only repeats it. Red is kept for remove.
- **Example:** [annotated](audits/2026-09-28/shots/5-redgreen-deuteranopia-annotated.png), [Proposal](audits/2026-09-28/shots/5-proposal-keep-mark.png).
- **Applies to:** editor, `session.md`, PDF.

#### A11 · Targets at least 24 × 24 points on screen (visual)

- **Status:** proposed
- **Today:** resize handles are 4.5 points square (F055/F082, F055); the "more than one tool" dots are 6
  points (F093, F093); key captions are tiny (F093/F094, F093/F094).
- **Rule:** every target, including canvas handles, is at least 24 × 24 points measured on screen, not
  in image pixels.
- **Example:** [annotated](audits/2026-09-28/shots/5-handles-annotated.png).
- **Applies to:** editor canvas, toolbar.

#### A12 · Single-key shortcuts stay out of text fields and can be switched off (keyboard and focus)

- **Status:** proposed
- **Today:** tool keys are suspended in text fields (good) but cannot be switched off (F112); right after
  a reference, a tool key types into its note (F124).
- **Rule:** single-key shortcuts act only when no text field has the cursor, and a setting turns them off
  (or requires a modifier).
- **Applies to:** editor.

#### A13 · Every page declares its language; every window title names the task and the session (platform conventions)

- **Status:** proposed
- **Today:** no page declares a language (F121, F156, F047, F170, F047/F121/F156/F170/F206); every editor is "Snapmark" (F059).
- **Rule:** `lang` on every page; window titles as in Platform conventions point 4.
- **Applies to:** every Snapmark window.

#### A14 · Usable at 200% zoom; side panels stack at 400% (side panels)

- **Status:** proposed
- **Today:** at 400% the image disappears and "Add to session" is off screen (F115); the session window
  wraps and cuts the picture below about 500 points (F148).
- **Rule:** every window works at 200%; at 400% the side panel stacks under the image and the primary
  button stays reachable; windows have a minimum size that keeps them usable.
- **Example:** [annotated](audits/2026-09-28/shots/5-editor-zoom400-annotated.png).
- **Applies to:** editor, session window.

#### A15 · Motion respects Reduce Motion (motion)

- **Status:** proposed
- **Today:** nothing animates.
- **Rule:** anything added later is off under `prefers-reduced-motion`.
- **Applies to:** every Snapmark window.

#### A16 · Native first (platform conventions)

- **Status:** proposed
- **Today:** the menu, folder panels and notifications are native (good); the rename dialog is AppleScript.
- **Rule:** menus, dialogs and notifications stay native, which keeps them keyboard- and
  VoiceOver-accessible without extra work; a Snapmark-made surface (the Discarded list, the rename field)
  meets A1–A14.
- **Applies to:** menu, dialogs, notifications.

<details><summary>Supporting notes for A1–A16</summary>

- Source: e5 "Accessibility rules the proposed interaction guidelines must include", rules 1–16, verbatim in substance.
- Evidence: e5 axe-core pass, WCAG criterion table, keyboard-only walk and focus table.
- WCAG: 2.1.1 (A1), 2.5.7 (A2), 2.5.2 (A3), 2.4.3 and 2.4.11 (A4, A5), 4.1.2 and 1.3.1 (A6), 1.1.1 (A7), 4.1.3 (A8), 1.4.3 and 1.4.11 (A9), 1.4.1 (A10), 2.5.8 (A11), 2.1.4 (A12), 3.1.1 and 2.4.2 (A13), 1.4.4 and 1.4.10 (A14), 2.3.3 (A15).

</details>

## Flows

The rules working together, step by step, with the pointer and the keyboard route. Each flow names its
scene, what happens today (with the step count and what breaks), and the proposed flow. The minimum set
of `rule-areas.md` comes first (media playback is not applicable), then the flows of `setup.md`, then
the three from the briefing. "M" is the menu bar menu.

### F1 · Rename a session from the list (scene 1)

- **Today:** only the current session can be renamed: M → Switch Session ▸ the session (it becomes
  current) → M → Rename Session… → AppleScript dialog → type → Rename. A taken name closes the dialog,
  shows a notification and loses the typing (F177/F178, F177). 6 steps plus a side effect.
- **Proposed:**

| #   | Pointer                                              | Keyboard                   | Sees                                                                                            |
| --- | ---------------------------------------------------- | -------------------------- | ----------------------------------------------------------------------------------------------- |
| 1   | M → Switch Session ▸ "Checkout review · 12 · 27 Sep" | (menu by the menu key, A1) | the session window opens; current session unchanged                                             |
| 2   | click the name in the window header                  | Tab to the name, Enter     | the name becomes a field, selected                                                              |
| 3   | type "Checkout v2"                                   | same                       | a taken name is flagged under the field; typing kept                                            |
| 4   | click away or Return                                 | Return; Esc cancels        | the header, the title, the menu and `session.md` show the new name; "Undo Rename" in the window |

- **Rules:** Editing, Forms and validation, Navigation and return, Confirmation and undo.

### F2 · Leave work unsaved: an editor with marks, the session window mid-typing (scene 1)

- **Today:** Discard, ⌘W, Esc past Select, the close button, ⌘R, Quit anyway and Restart to Update all
  file the capture in Discarded without a word (F053, F212, F058); Restart asks nothing. Closing the
  session window drops the last 0.2 s of typing (F128); an outside write drops typing (F126/F127).
- **Proposed:**

| #   | Pointer                                   | Keyboard | Sees                                                                                                                                                           |
| --- | ----------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | editor with 3 marks: Discard              | ⌘W       | closes; the menu bar icon shows nothing; M's fixed row "Reopen Last Discarded" is enabled; one notification "Screenshot kept in Discarded for 7 days · Reopen" |
| 2   | (Esc, three times)                        | Esc × 3  | text → selection → Select; then nothing more (Esc never discards)                                                                                              |
| 3   | M → Quit Snapmark with the editor open    | ⌘Q       | sheet on the editor: "1 screenshot is not in a session. Quitting keeps it in Discarded for 7 days." [Cancel] [Quit]                                            |
| 4   | session window: type, then close at once  | ⌘W       | the typing is written first; nothing lost                                                                                                                      |
| 5   | an agent writes `session.md` while typing | —        | bar: "session.md changed outside Snapmark" [Keep Mine] [Load Theirs]                                                                                           |

- **Rules:** Saving and unsaved work, Confirmation and undo, Feedback, Keyboard and focus.

### F3 · Compare and edit several screenshots and their marks (scene 1)

- **Today:** M → Open Session → Screenshots → ← → one at a time without notes (F135) → Edit Again (no
  entry number, F100) → edit → Save changes (overwrites for good, F079; drops Document-tab fixes, F125).
  Several marks: one at a time, pointer only.
- **Proposed:**

| #   | Pointer                 | Keyboard                             | Sees                                                                                |
| --- | ----------------------- | ------------------------------------ | ----------------------------------------------------------------------------------- |
| 1   | M → Open Session        | (menu key)                           | session window on the tab it had, at the last entry shown                           |
| 2   | Screenshots             | ⌘2                                   | the picture with "Screenshot 004 · 3 of 12", its comment and notes beside it        |
| 3   | ← →                     | ← →                                  | next entry; the Document keeps the same current entry                               |
| 4   | Edit Again              | ⌘E                                   | editor titled "Screenshot 004 · 28 Sep 14:32"; notes as in `session.md` now         |
| 5   | ⇧-click two boxes, drag | Tab to a box, ⇧Tab adds, arrows move | both move; one undo step                                                            |
| 6   | Save Changes            | ⌘↵                                   | back in the session window on 004; "Saved · Undo" (the old version is in Discarded) |

- **Rules:** Side panels, Lists and selection, Editing, Saving, Undo, Navigation.

### F4 · Remove something and get it back (scene 1)

- **Today:** Remove from Session acts at once, no word (F131); the way back is M → Reopen Last Discarded,
  which brings back whatever was discarded last and puts it at the end (F011, F144). Older items: a
  folder panel over a hidden folder (F174).
- **Proposed:**

| #   | Pointer                                                         | Keyboard | Sees                                                                  |
| --- | --------------------------------------------------------------- | -------- | --------------------------------------------------------------------- |
| 1   | Screenshots tab, on 004: Remove from Session (quiet, far right) | ⌫        | "Screenshot 004 removed · Undo · In Discarded for 7 days" bar         |
| 2   | Undo                                                            | ⌘Z       | 004 back in its place, same number                                    |
| 3   | days later: Discarded tab                                       | ⌘3       | thumbnails, time, session; "Restore" per item                         |
| 4   | Restore                                                         | Enter    | back in its session, at its number if free; current session unchanged |

- **Rules:** Confirmation and undo, Lists and selection, Undo across the app.

### F5 · Share with a person: export a PDF or ZIP — success, failure, partial (scene 2)

- **Today:** M → Export Session ▸ PDF → Finder opens with `<name>.pdf` selected (replacing the last one
  silently, F198). Failure: a notification with the raw error (F171/F197, F171/F213). The PDF has no key to the
  marks (F193). Only the current session; hidden while empty. 3 steps.
- **Proposed:**

| #   | Pointer                            | Keyboard | Sees                                                                                                                                           |
| --- | ---------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | session window → ⋯ → Export ▸ PDF  | ⌘⇧E      | (over a second) "Exporting PDF…" on the button                                                                                                 |
| 2   | —                                  | —        | success: Finder with "Checkout review 2026-09-28 14.40.pdf" selected; the PDF opens with the key to the marks                                  |
| 3   | failure                            | —        | a bar in the session window: "The PDF could not be written: the disk is full. Nothing was changed. Free some space and try again." [Try Again] |
| 4   | partial (ZIP with a missing image) | —        | "ZIP made without screenshot 007 (its image is missing)." [Show in Finder]                                                                     |

- **Rules:** Progress, Feedback, Local work and external writes, The session file.

### F6 · Find an older session, act on it, come back (scene 1)

- **Today:** M → Switch Session ▸ bare names (F013/F225) → click makes it current (F008) → act from M →
  switch back. Older than twenty: a folder panel that accepts almost nothing (F004). 5+ steps and a side
  effect.
- **Proposed:**

| #   | Pointer                                              | Keyboard                 | Sees                                                                |
| --- | ---------------------------------------------------- | ------------------------ | ------------------------------------------------------------------- |
| 1   | M → Switch Session ▸ "Checkout review · 12 · 27 Sep" | menu key, arrows, Return | its session window opens; today's session stays current             |
| 2   | ⌘F "Delete"                                          | ⌘F                       | matches highlighted as you type                                     |
| 3   | Copy for AI                                          | ⌘⇧C                      | "Copied: the path to Checkout review"                               |
| 4   | close the window                                     | ⌘W                       | back where the reviewer was; next ⌃⇧1 still goes to today's session |

- **Rules:** Navigation and return, Search and filters, Lists and selection.

### F7 · Drag files in from Finder, including one that cannot be read (scene 1)

- **Today:** dropped files are not handled; a dropped image probably replaces the editor page (F081,
  assumption); an existing image cannot be brought in at all (F229).
- **Proposed:**

| #   | Pointer                                           | Keyboard                         | Sees                                                                                               |
| --- | ------------------------------------------------- | -------------------------------- | -------------------------------------------------------------------------------------------------- |
| 1   | drop `mock.png` on the menu bar icon or an editor | M → Mark Up Image… (or paste ⌘V) | a new editor on that image, target = current session                                               |
| 2   | drop `notes.pdf`                                  | —                                | in place: "notes.pdf is not an image Snapmark can mark up (PNG, JPEG, HEIC)." nothing else changes |
| 3   | drop three images                                 | —                                | three editors, offset, each titled by its file name                                                |

- **Rules:** Drag and drop, Copy and paste, Feedback, Navigation.

### F8 · The session folder goes missing mid-review, and comes back (scene 2; stands in for "lose the connection")

- **Today:** a cloud folder offline or a session moved in Finder: Add to session does nothing, the button
  goes dead (F049, F049); the menu says "No Session Yet" (F009).
- **Proposed:**

| #   | Pointer                          | Keyboard | Sees                                                                                                                                                  |
| --- | -------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Add to session                   | ⌘↵       | footer: "28 Sep 14:32 is not in ~/Library/Mobile Documents/…/Snapmark right now. The screenshot is still here." [Try Again] [Add to Another Session…] |
| 2   | M                                | —        | first line: "28 Sep 14:32 is missing" [Locate…]                                                                                                       |
| 3   | the folder syncs back; Try Again | ⌘↵       | added; the usual sign on the menu bar icon                                                                                                            |

- **Rules:** Local work and external writes, Feedback, Saving.

### F9 · First launch up to the first saved screenshot (all scenes)

- **Today:** install, Gatekeeper "Open Anyway", launch: only a small menu bar icon (F209); ⌃⇧1 (learned
  from the README, which says ⌘⇧1, F211) → Screen Recording prompt → the capture is the wallpaper
  (F210) → quit and relaunch → ⌃⇧1 → drag → mark → ⌘↵ → the window vanishes (F062). 10+ steps.
- **Proposed:**

| #   | Pointer              | Keyboard  | Sees                                                                                                         |
| --- | -------------------- | --------- | ------------------------------------------------------------------------------------------------------------ |
| 1   | open Snapmark        | —         | the menu opens once below the icon: "Snapmark lives here. ⌃⇧1 captures, ⌃⇧2 captures the same area."         |
| 2   | Capture Screenshot   | ⌃⇧1       | Screen Recording missing: a small window with [Open System Settings] and [Quit & Reopen], before any capture |
| 3   | after reopening      | ⌃⇧1, drag | editor on the capture, over the app it came from                                                             |
| 4   | mark, Add to session | ⌘↵        | tick and "1" on the menu bar icon; the session was created and named "28 Sep 14:32"                          |

- **Rules:** First run and help, Feedback, Navigation.

### F10 · Capture, mark, save, capture the next one (scene 1)

- **Today:** ⌃⇧1, drag, mark, ⌘↵ — 3 steps plus marking; the window vanishes without a sign (F062);
  every editor starts on Box in red (F107).
- **Proposed:**

| #   | Pointer          | Keyboard                | Sees                                                      |
| --- | ---------------- | ----------------------- | --------------------------------------------------------- |
| 1   | —                | ⌃⇧1, drag               | editor over the browser, on the tool and colour used last |
| 2   | mark, type notes | 1, click, type; 5, drag | notes and cards listed in the panel                       |
| 3   | Add to session   | ⌘↵                      | back in the browser; tick and count on the menu bar icon  |
| 4   | —                | ⌃⇧1                     | next capture                                              |

- **Rules:** Navigation, Feedback, Remembered state, Capturing.

### F11 · Start a new session and switch back to an older one (scene 1)

- **Today:** ⌃⇧2 anywhere (between the two capture keys) → notification only; switching back: M → Switch
  Session ▸ a timestamp. A slip costs the rest of the review (F020, F020, F020/F176, F020/F176).
- **Proposed:**

| #   | Pointer                                                                           | Keyboard                                                          | Sees                                                                             |
| --- | --------------------------------------------------------------------------------- | ----------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| 1   | M → New Session…                                                                  | (no global key, or the owner's chosen key away from the captures) | a name field, "28 Sep 14:32" filled in; Return keeps it                          |
| 2   | type "Checkout review", Return                                                    | same                                                              | M header "Checkout review"; the next menu offers "Undo New Session" for a minute |
| 3   | later: M → Switch Session ▸ "Onboarding · 7 · 27 Sep" → Capture into This Session | menu key, arrows                                                  | header shows Onboarding; notification-free; Undo available                       |

- **Rules:** Keyboard and focus, Confirmation and undo, Lists and selection.

### F12 · Hand a session to an agent with the least steps (scene 1)

- **Today:** M → choose between "Copy Prompt for AI" and "Copy session.md Path" (F001/F184) → notification →
  switch to the agent → ⌘V → Return. 2 clicks + paste; the path alone carries no key to the marks; from
  the session window it is impossible (F133); for an older session it takes 5 clicks and changes the
  current session (F008).
- **Proposed:**

| #   | Pointer                                                  | Keyboard                   | Sees                                                                                                                     |
| --- | -------------------------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| 1   | M → Copy for AI (or the session window's primary button) | ⌘⇧C in any Snapmark window | notification "Copied: the path to Checkout review"                                                                       |
| 2   | agent: paste, Return                                     | ⌘V, Return                 | one line: `Work through the visual feedback in "…/Checkout review/session.md".`; the key to the marks is inside the file |

2 steps in Snapmark from the menu, 1 from any Snapmark window, for any session.

- **Rules:** Dialogs, menus and popovers (the hand-off item), The session file, Navigation.

### F13 · Move sessions into iCloud Drive or Google Drive — partial completion (scene 2)

- **Today:** M → Settings ▸ Sessions Folder… → panel ("Open") → the current session becomes the new
  folder's first; all earlier sessions stay behind, unreachable (F175, F175). 5 steps, no word.
- **Proposed:**

| #   | Pointer                         | Keyboard             | Sees                                                                                                          |
| --- | ------------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------- |
| 1   | M → Settings ▸ Sessions Folder… | ⌘, → Sessions Folder | panel: "Choose where Snapmark keeps sessions" [Use This Folder]                                               |
| 2   | pick iCloud Drive/Snapmark      | —                    | "Move your 14 sessions there too?" [Move] [Leave Them]                                                        |
| 3   | Move                            | Return               | "Moving 14 sessions…" on the item                                                                             |
| 4   | partial                         | —                    | "Moved 13 of 14. Onboarding could not be moved (a file is open in another app)." [Try Again] [Show in Finder] |

- **Rules:** Progress, Local work and external writes, Dialogs.

### F14 · Mark what goes and what stays on one screenshot (scene 3)

- **Today:** goes: 5, drag (red cross). Stays: no mark; colour swatch → macOS colour panel → green → 2 →
  drag, which the agent reads as "look at this element" (F050, F050, F050). Every other mark is the same
  red as remove (F052/F095).
- **Proposed** (if the owner brings back an approve mark):

| #   | Pointer                                   | Keyboard                     | Sees                                                                                |
| --- | ----------------------------------------- | ---------------------------- | ----------------------------------------------------------------------------------- |
| 1   | 5, drag over the promo banner             | 5, then the canvas keys (A1) | red cross; panel row "Remove: promo banner"                                         |
| 2   | ⇧5 (or the approve key), click the header | same                         | green tick; row "Keep"                                                              |
| 3   | Add to session                            | ⌘↵                           | `session.md`: "Marks: 1 cross (remove), 1 tick (keep)"; the PDF's key explains both |

- **Rules:** Editing, Accessibility A10, The session file.

### F15 · Cut an element and move it where it should go (scene 1)

- **Today:** 7, drag around it (switches to Select with the piece picked up), drag the piece — 3 steps,
  works; `session.md` says only "Moved an element" (F202).
- **Proposed:** the same three steps, with a keyboard route (7, Enter at two corners, arrows to move,
  Enter), and `session.md` writing "Move M1: the 'New order' button → next to the title".
- **Rules:** Drag and drop, Accessibility A1–A2, The session file.

### F16 · Place a card that points at an element, then move the card (scene 1)

- **Today:** 1, 1 (Card), press on the target and release where the card goes (a gesture shown nowhere,
  F064, F064), type, C, drag. 6 steps; the card is missing from the panel (F076/F219/F226).
- **Proposed:**

| #   | Pointer                              | Keyboard                         | Sees                                                                            |
| --- | ------------------------------------ | -------------------------------- | ------------------------------------------------------------------------------- |
| 1   | ⇧1 (Card), click where the card goes | ⇧1, arrows, Enter                | a card, typing; a pointer handle on its edge                                    |
| 2   | type                                 | type                             | text; the panel lists "Card A"                                                  |
| 3   | drag the handle to the target        | Tab to the handle, arrows, Enter | the line follows; `session.md`: "Card A → 'Load more': make it infinite scroll" |
| 4   | drag the card                        | C, Tab to it, arrows             | the line stays on its target                                                    |

- **Rules:** Drag and drop, Side panels, The session file.

### F17 · Fix a mistake: undo, select, delete (all scenes)

- **Today:** ⌘Z (1) or C, click, ⌫ (3); works. Undo does not name its step (F105); the Undo button and
  ⌘Z differ inside a note (F070); Edit ▸ Undo in the Mac menu bar does nothing to marks (F109).
- **Proposed:** ⌘Z, the Undo button and Edit ▸ Undo do the same thing and say "Undo Move Card"; C, Tab to
  the mark (or click), ⌫, with ⌘Z bringing it back in place with its number.
- **Rules:** Undo across the app, Lists and selection, Accessibility A1.

### F18 · Capture the same area ten times in a row (scene 1, from the briefing)

- **Today:** ⌃⇧3 → drag in the picker (first time) → mark → ⌘↵; then 9 × (⌃⇧3, mark, ⌘↵): 21 steps plus
  marking. Broken when capturing ahead of annotating (the open editor is captured, F033/F066); from a
  full-screen browser each capture strands the reviewer on the desktop, and the next ⌃⇧3 captures the
  desktop (F026/F027).
- **Proposed:**

| #   | Pointer | Keyboard                                   | Sees                                                                            |
| --- | ------- | ------------------------------------------ | ------------------------------------------------------------------------------- |
| 1   | —       | ⌃⇧2 (or the owner's Capture Same Area key) | first time: the picker; drag; handles to adjust; Return captures                |
| 2   | mark    | keys                                       | editor over the browser, on the last tool and colour                            |
| 3   | —       | ⌘↵                                         | back in the browser; count on the icon                                          |
| 4   | —       | same key × 9                               | each capture hides Snapmark's windows; editors that are still open stack offset |

1 + 2 × 10 = 21 steps, none of them a hunt; optionally "Capture Only" for runs that are marked later.

- **Rules:** Capturing, Navigation, Keyboard and focus, Remembered state.

### F19 · Capture from a full-screen browser and come back (scene 1, from the briefing)

- **Today:** ⌃⇧1, drag → macOS slides to the desktop, the editor stays on the browser's Space → swipe back
  → mark → ⌘↵ → back in the browser. 4 steps per screenshot plus a search (F026, F026).
- **Proposed:** ⌃⇧1, drag → the editor opens over the browser on its Space → mark → ⌘↵ → the browser.
  3 steps, no Space change ([Proposal](audits/2026-09-28/shots/2-fullscreen-proposal.png)).
- **Rules:** Navigation and return, Motion, Keyboard and focus (A5).

## Exceptions, in one place

| Exception                                                                 | Rule it bends              | Why                                                   | Screens            |
| ------------------------------------------------------------------------- | -------------------------- | ----------------------------------------------------- | ------------------ |
| Redactions cannot be moved or resized                                     | Editing                    | moving one would uncover what it hides                | editor             |
| References have a fixed size, no handles                                  | Editing                    | an even look across a session                         | editor             |
| Freehand pen strokes are pointer-only                                     | Keyboard and focus, A1, A2 | a path cannot be typed or clicked                     | editor             |
| Quit and Restart to Update ask first                                      | Confirmation and undo      | the app is gone afterwards; Undo cannot live anywhere | quit sheet         |
| Copy for AI keeps its notification                                        | Feedback                   | the clipboard cannot show anything                    | menu               |
| The session window may open on the desktop                                | Navigation and return      | it is a place to read; the Mac goes there with it     | session window     |
| macOS's capture overlay, permission prompts and folder panels stay native | Dialogs, A16               | the system's own, accessible as they are              | capture, first run |
| Single-key tools in the editor                                            | Platform conventions       | a canvas convention, the owner's request              | editor             |
| Never start on a destructive tool by memory                               | Remembered state           | a remembered Remove area or Redact would surprise     | editor             |
| Redact cannot be pasted                                                   | Copy and paste             | it would show a pixelated copy of another place       | editor             |

## Enforcement map

For every rule: the one shared component or test that would make breaking it impossible, whether it
exists today, and what would have to be built. A rule is **not enforced** unless a component or test
enforces the proposed behaviour today; a test that asserts today's (different) behaviour counts as not
enforced and is named, because it will have to change. `ux:conformance` reads this map.

What exists today: `test/menu.test.ts` (menu labels, order, depth, icons, as data), `test/sessions.test.ts`
(the `session.md` format, numbering, Discarded, restore), `test/exporter.test.ts` (ZIP contents, PDF HTML),
`test/smoke.ts` (drives the real editor: every tool, notes, Esc, Edit Again, Discarded, the area picker,
the session window), and `src/tools.ts` (one tool list feeding the toolbar, the Keyboard Shortcuts window
and the prompt).

| Rule                                                                             | Enforced by (proposed)                                                                                                                                                                                                                             | Exists?                                                                                  | To build                                                                                                      |
| -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Editing: edit in place, one home for text                                        | an entry-store module that both the editor and the Document tab write through; smoke step "fix a note in Document → Edit Again shows it"; a test that a one-character edit changes one line of `session.md`                                        | **not enforced**                                                                         | the entry store; two smoke steps; a `sessions.test.ts` case for minimal writes and no escaping                |
| Side panels: panel lists every text; one current entry                           | panel built from the same item list `stateOf()` saves; smoke assertion "rows = references + cards + moves"                                                                                                                                         | **not enforced**                                                                         | panel renderer over all items; one smoke assertion                                                            |
| Dialogs, menus and popovers: fixed, short menu; one hand-off item; named buttons | `menu.test.ts` rewritten: row positions identical across all states, ≤ 11 top-level rows, one copy item; a shared dialog helper that requires a message and action-named buttons                                                                   | **not enforced** (`menu.test.ts` asserts today's order and hidden rows)                  | rewrite `menu.test.ts`; dialog helper; Snapmark app menu template                                             |
| Saving and unsaved work                                                          | a smoke step per exit (⌘W, Esc, close, ⌘R, Quit, Restart): marks recoverable, nothing filed when unchanged; a save-conflict test in the session window                                                                                             | **not enforced** (smoke covers Esc-to-Discarded only, today's behaviour)                 | smoke steps; conflict handling and its test; remove stock Reload                                              |
| Confirmation and undo                                                            | one "result bar with Undo" component used by every removal; smoke: Remove → ⌘Z restores in place                                                                                                                                                   | **not enforced** (Discarded restore is tested in `sessions.test.ts`: partly)             | the bar component; undo for Remove and Save Changes; smoke step                                               |
| Feedback and notifications                                                       | one `report(event, consequence, action)` helper that writes the in-app line and, optionally, a notification; a lint that forbids `new Notification` elsewhere and raw `String(e)` in messages                                                      | **not enforced**                                                                         | the helper; a grep check in CI                                                                                |
| Progress and long operations                                                     | a `withProgress(control, job)` wrapper used by export, update and folder moves                                                                                                                                                                     | **not enforced**                                                                         | the wrapper                                                                                                   |
| Navigation and return                                                            | one `openEditor` that records the source app and Space and returns there on close, and joins the full-screen Space; window titles from one `titleFor(kind, session, n)`; smoke: second editor offset                                               | **not enforced**                                                                         | Space handling (needs a check on a real full-screen Space); `titleFor`; smoke assertion on titles and offsets |
| Lists and selection                                                              | row builders for sessions and screenshots that always include count/date or number/position; smoke: Undo restores a reference with its number                                                                                                      | **not enforced**                                                                         | builders; smoke step                                                                                          |
| Forms and validation                                                             | a Snapmark name field with inline validation (replacing the AppleScript dialog); a11y test that every field has a visible label                                                                                                                    | **not enforced**                                                                         | the field; the label check (see A6)                                                                           |
| Keyboard and focus                                                               | one key registry (global and in-window) that builds the Keyboard Shortcuts window, the tooltips and the README table; a test that global keys are only capture actions and neighbours; smoke: Esc × 5 never closes the editor; no stock menu roles | **partly** (`tools.ts` feeds the tool rows; global and other keys are hard-coded)        | the registry; tests; key recorder                                                                             |
| Search and filters                                                               | find-in-page in the session window; smoke: ⌘F finds a note                                                                                                                                                                                         | **not enforced**                                                                         | find bar                                                                                                      |
| Undo across the app                                                              | one command history per window with named steps; the Edit menu wired to it; smoke: the button, ⌘Z and Edit ▸ Undo undo the same step                                                                                                               | **not enforced**                                                                         | named steps; menu wiring                                                                                      |
| Copy and paste                                                                   | mark serialisation reused from `itemOf()`/`restore()` for ⌘C/⌘V; smoke: copy a box, paste, one more mark                                                                                                                                           | **not enforced** (the serialisation exists for Discarded and Edit Again)                 | clipboard handlers; paste-image route                                                                         |
| Drag and drop                                                                    | a canvas input layer that turns drags, click-pairs and keys into the same commands; `will-navigate` blocked in every window; smoke: two clicks make an arrow                                                                                       | **not enforced**                                                                         | input layer; navigation guard                                                                                 |
| Platform conventions                                                             | a Snapmark app menu template tested like the tray menu; a case check on every label (Title Case for menus, buttons, titles); key symbols from one formatter                                                                                        | **not enforced**                                                                         | template, case check, formatter                                                                               |
| Local work and external writes                                                   | the entry store (above) with conflict detection; a test that closing the session window flushes; a test that redacted pixels never exist unredacted inside the session folder                                                                      | **not enforced**                                                                         | flush-on-close; redaction storage change; tests                                                               |
| Remembered state                                                                 | a small `remember` module for tool, colour, window bounds and tab; test that a destructive variant is never restored                                                                                                                               | **not enforced**                                                                         | the module; one test                                                                                          |
| First run and help                                                               | a first-run flag and window; a permission check before capture; smoke: empty session shows its hint                                                                                                                                                | **not enforced**                                                                         | first-run window; permission check; fix the empty-state placeholder                                           |
| Motion                                                                           | a CSS rule that wraps every animation in `prefers-reduced-motion: no-preference`                                                                                                                                                                   | **not enforced** (no animation exists, so nothing breaks it today)                       | the rule, when the first animation is added                                                                   |
| Capturing                                                                        | `shoot()` hides Snapmark's windows and restores them; picker opens with the current area; smoke: capture with an editor open does not include it (needs a stand-in capture)                                                                        | **not enforced**                                                                         | hide/restore; picker pre-fill; zoom in the editor                                                             |
| The session file                                                                 | `sessions.test.ts` rewritten: key at the top, labelled comment, "Marks:" line, lettered cards, no "_(no note)_", day in headings; `fitForAI` limits (exist)                                                                                        | **partly** (image limits enforced by `fitForAI`; the format test asserts today's format) | new format and its test                                                                                       |
| A1 Keyboard route for every pointer action                                       | smoke drives one of each tool by keys only                                                                                                                                                                                                         | **not enforced**                                                                         | canvas keyboard cursor; smoke step                                                                            |
| A2 Click route for every drag                                                    | smoke: arrow, cut, redact, card pointer, area by two clicks                                                                                                                                                                                        | **not enforced**                                                                         | input layer (above)                                                                                           |
| A3 Act on release                                                                | smoke: press on the canvas, move off, release → no mark                                                                                                                                                                                            | **not enforced**                                                                         | change Reference to release                                                                                   |
| A4 Focus never falls to nowhere                                                  | smoke: after Enter on each tool button and after Next at the last screenshot, `document.activeElement` is a named control                                                                                                                          | **not enforced**                                                                         | focus management; smoke assertions                                                                            |
| A5 Focus on open and close                                                       | smoke: focus target when each window opens                                                                                                                                                                                                         | **not enforced**                                                                         | smoke assertions                                                                                              |
| A6 Names in words                                                                | smoke reads the DevTools accessibility tree: every button and field has a non-empty name; axe-core in CI                                                                                                                                           | **not enforced**                                                                         | aria labels; axe step                                                                                         |
| A7 Text alternatives                                                             | axe-core `image-alt`; smoke: the Screenshots tab image has alt with its number                                                                                                                                                                     | **not enforced**                                                                         | alt text; axe step                                                                                            |
| A8 Results spoken                                                                | smoke: a live region exists and changes after tool change and mark placement                                                                                                                                                                       | **not enforced**                                                                         | live regions                                                                                                  |
| A9 Contrast, measured                                                            | a token contrast table checked in CI (light and dark); axe-core colour-contrast                                                                                                                                                                    | **not enforced**                                                                         | tokens; the check                                                                                             |
| A10 Never colour alone                                                           | the approve mark decision; `session.md` "Marks:" line test                                                                                                                                                                                         | **not enforced**                                                                         | approve mark (if chosen); format test                                                                         |
| A11 Targets ≥ 24 points                                                          | smoke: Fabric handle size ÷ display scale ≥ 24                                                                                                                                                                                                     | **not enforced**                                                                         | handle sizing                                                                                                 |
| A12 Single keys out of text, switchable                                          | the editor's one key handler (skips text fields today); a setting and a test                                                                                                                                                                       | **partly** (the handler skips text fields; no off switch, no test)                       | the setting; a smoke assertion                                                                                |
| A13 Language and titles                                                          | axe-core `html-has-lang`; `titleFor` test                                                                                                                                                                                                          | **not enforced**                                                                         | `lang` attributes; `titleFor`                                                                                 |
| A14 200% and 400% zoom                                                           | smoke at zoom factor 2 and 4: primary button in view                                                                                                                                                                                               | **not enforced**                                                                         | stacking layout; minimum window sizes                                                                         |
| A15 Reduce Motion                                                                | the CSS rule under Motion                                                                                                                                                                                                                          | **not enforced** (nothing animates)                                                      | as Motion                                                                                                     |
| A16 Native first                                                                 | Electron's native `Menu`, `dialog` and `Notification` for menus, panels and notifications                                                                                                                                                          | **yes, by construction** (the rename dialog is AppleScript, also native)                 | keep; Snapmark-made surfaces meet A1–A14                                                                      |
