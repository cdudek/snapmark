---
type: ux-audit-findings
status: draft for the owner's reading
created: 2026-09-28
build: main at v0.9.0
briefing: briefing.md
---

# Snapmark UX audit 2026-09-28: findings

This is the merged findings document of the UX audit of Snapmark, built from `main` at v0.9.0 on
2026-09-28. Eight evaluators worked to the same
[briefing](briefing.md):

- agent 1: concepts and structure
- agent 2: navigation, layout, surfaces and states
- agent 3: controls, lists, visual design, window sizes and output for AI
- agent 4: words, vocabulary, keys and earlier requests
- agent 5: accessibility
- agents 6 and 7: independent evaluators, every lens
- agent 8: independent evaluator through Codex. Its harness could not launch the app, so it evaluated the code only.

Their 397 raw findings were merged into 229. Exact duplicates (the same problem in the same place)
became one entry that lists every source. Entries that bundled several problems were split into one
entry each. Nothing was dropped. Every finding follows the shared finding format. The main text is
for the owner; the codes, file paths, source IDs and criteria sit in each entry's supporting notes.

**How to read an entry.** "Verified" says how the problem is known:

- _Seen on screen_: a screenshot was looked at.
- _Read in the code_: the line is named in the notes. "Confirmed by a script run on the build" means
  a script drove the real app, but there is no screenshot of it.
- _Assumption, not checked_.

"Seen by 2 evaluators" or "seen by 3 evaluators" in the notes means that two or three of the
independent evaluators (6, 7, 8) found it without seeing each other's notes. Screenshots are in
`shots/`, under the evaluators' own file names. Mockups labelled "Proposal" are sketches, never the
real app.

## Counts

**By screen group and impact.** Each finding is counted once, in its group.

| Screen group                        | Critical |   High | Medium |     Low | Design choice |   Total |
| ----------------------------------- | -------: | -----: | -----: | ------: | ------------: | ------: |
| Menu bar menu                       |        0 |      1 |     11 |       7 |             0 |      19 |
| Global shortcuts                    |        0 |      1 |      2 |       2 |             1 |       6 |
| Capture region and full-screen apps |        0 |      3 |      3 |       0 |             1 |       7 |
| Area picker and Capture Same Area   |        0 |      2 |      5 |       8 |             0 |      15 |
| Editor                              |        1 |      9 |     32 |      32 |             3 |      77 |
| Session window                      |        4 |      2 |     11 |      15 |             1 |      33 |
| Keyboard Shortcuts window           |        0 |      0 |      1 |      12 |             0 |      13 |
| Notifications and dialogs           |        0 |      0 |      6 |      14 |             0 |      20 |
| session.md, prompt and exports      |        0 |      2 |      5 |       9 |             2 |      18 |
| First run, permissions and updates  |        0 |      2 |      2 |       9 |             0 |      13 |
| App-wide                            |        0 |      0 |      2 |       5 |             1 |       8 |
| **All**                             |    **5** | **22** | **80** | **113** |         **9** | **229** |

**By how it is known:**

| Verified                |                                                                           Findings |
| ----------------------- | ---------------------------------------------------------------------------------: |
| Seen on screen          |                                                                                111 |
| Read in the code        | 116 (19 of them also confirmed by a script run on the build, without a screenshot) |
| Assumption, not checked |                                                                                  2 |
| Owner's preference      |                                                                                  0 |

**By build:** all 229 findings are on `main` at v0.9.0. There were no open pull requests.

**Merging:**

- 397 source findings came in.
- 54 of them bundled several problems and were split, giving 460 source parts.
- Those 460 parts merged into 229 findings, so 231 parts were folded into another finding as
  duplicates.
- 55 findings were seen by more than one independent evaluator: 38 by two, 17 by all three.

## The briefing's four questions

### 1. New Session on ⌃⇧2

> "Also the new session is a very dangerous shortcut because it sits in between 1 and 2." — 2026-09-28

All five evaluators who looked at it agree it is dangerous (F020, seen by 3 evaluators).

**What one slip costs when the session already has screenshots:**

- The capture the reviewer meant is lost.
- A new session, named by date and minute, silently becomes the current one.
- Every later capture and "Copy Prompt for AI" go to the new session. An editor that was already
  open keeps the old one, so two screenshots taken a minute apart land in two sessions.
- The only sign is a notification that fades, and it never shows with notifications off or a Focus
  on (F172).
- The way back is the menu and Switch Session, telling "28 Sep 14.02" from "28 Sep 14.40" (F013).
  There is no Undo (F176).
- Screenshots already saved in the new session cannot be moved back (F139), and the empty session
  stays in the list for good (F225).

On an empty session the slip costs only the capture and a confusing notice (F179).

**Does New Session need a global key?** Every evaluator says no. A session starts once per piece of
work; captures happen many times an hour. The owner's "it needs to be shortcuts so I can just do this
on the fly" (2026-09-25) is met by ⌃⇧1 and ⌃⇧3.

**The options on the table:**

- **(a) No key; Capture Same Area moves to ⌃⇧2** so the two captures are neighbours (agents 1 and 6).
  This costs relearning ⌃⇧3.
- **(b) No key; ⌃⇧2 left empty as a buffer**, with ⌃⇧1 and ⌃⇧3 unchanged (agent 4).
- **(c) An optional key away from the digits:**
  - ⌃⇧N (agents 4 and 6)
  - ⌃⇧0 (agent 6)
  - ⌃⌥⇧N (agent 7)
  - one the reviewer records (agent 8, with F021)
- **With any of them:** an Undo in the new-session notification (F176; agents 4, 6 and 7).

Two related points:

- Agent 7 would also move the captures to ⌃⇧4 and ⌃⇧5 to match macOS (F022).
- A plainer destination in the editor would make any slip visible (F060, F061).

### 2. The menu, and one "Copy Session Info"

> "I think overall, X-wise, it's also quite complicated in terms of what we have in the menu. I just
> wonder whether we need just "Copy session info" when it comes with the prompt and everything, and in
> the settings you select whether you want to have the prompt with it or without it." — 2026-09-28

**The menu today (F002, seen by 3 evaluators).** It asks for up to 16 decisions at its top level:

- 11 items before the first session, 5 of them greyed
- 13 items in the usual state
- 16 items with an area set, something discarded and an update waiting

With separators and the header that is 20 to 21 rows. It has 3 submenus (Export Session, Switch
Session, Settings), one level deep. Items appear and disappear with the app's state, so the frequent
ones move (F005, F015).

**What earns its place, as the evaluators agree:** the two captures, Open Session, one copy item,
Export, Switch Session, Settings and Quit.

**What does not:**

- "Copy session.md Path" as a second copy item (F001)
- Rename Session and Show Session in Finder at the top level (F002)
- the recovery items in the top block (F006)
- Keyboard Shortcuts inside Settings (F003)
- New Session with a key (F020)

**On "Copy Session Info".** All five evaluators who weighed it want one copy item instead of two
(F001, seen by 3 evaluators). They differ on how:

- **(a) A key in the file** (agents 1 and 7). Write the key to the marks once at the top of each
  session.md. One "Copy for AI" copying a one-line prompt is then enough, and no setting is needed.
  This also gives the PDF and the ZIP their missing key (F193).
- **(b) A sublabel and a setting** (agent 4). Keep "Copy Prompt for AI" with a sublabel saying what
  it holds. Put "path only" in Settings, and let the menu label follow the setting.
- **(c) One item with ⌥** (agent 6). "Copy Path Only" sits behind ⌥. Agent 4 notes that Electron
  menus need native code for that.
- **(d) The owner's idea as proposed** (agent 8). One "Copy session info", with a Settings choice
  "Include AI instructions", provided the current mode is shown beside the item.

Agents 1, 4, 6 and 7 warn that a plain Settings switch hides what is copied at the moment of
copying. That is the owner's own complaint of 2026-09-26: "Copy what? It's not clear what's getting
copied."

Drawn proposals of about ten items: `shots/1-proposal-menu.png`,
`shots/6-menu-built-vs-proposal.png`, `shots/7-proposal-menu.png`.

### 3. Capturing from a full-screen app

> "When I take a screenshot it's going to the desktop but the actual window stays at the full screen
> browser. This is something we should fix." — 2026-09-28

**How it is known.** Read in the code, and it matches the owner's report and the audit lead's
stand-in test. No full-screen window was created in this audit (F026, seen by 3 evaluators).

**Capture region (⌃⇧1):**

- macOS's own overlay works over the full-screen browser.
- The editor then opens while Snapmark is a menu bar app. Snapmark turns on its Dock icon and pulls
  itself to the front, and macOS slides to the desktop.
- Where the editor ends up is read two ways. Agents 1 and 2 read it as left behind on the browser's
  Space, as the owner describes. Agents 6 and 7 read it as shown on a desktop Space.
- Either way the reviewer is on the desktop, and after "Add to session" nothing returns them to the
  browser.

**Capture Same Area (⌃⇧3):**

- The area picker is the one surface built to appear over full-screen apps, so the first drag
  happens in place.
- The editor then strands exactly as above, on every press.
- A press made before swiping back captures the same rectangle of the desktop (F027, seen by 2
  evaluators).
- A press while an editor is still open over the area captures Snapmark's own editor (F033).

**Related cases:**

- With the session window open, the editor opens on the desktop and the reviewer stays there (F029).
- Open Session from a full-screen app slides the same way (F030).
- Keys typed on the desktop may still reach a stranded editor (F031, an assumption).

**Recommendation on the table (agents 1, 2, 6, 7 and 8):**

- Open the editor on the Space the capture came from, the way the area picker already does.
- Do not switch Snapmark into a Dock app at that moment.
- Give focus back to the app that was in front after saving or discarding.
- Hide Snapmark's own windows for the moment of a capture (F033).

**Agent 2's alternative:** open the editor on the desktop on purpose, and bring the reviewer back to
the browser after "Add to session". This keeps the Dock icon, and costs two Space slides per capture.

Every option needs a test on a real full-screen browser.

### 4. "Not very intuitive"

> "I think everything is not very intuitive. Can we analyse and audit it with a UX audit?" — 2026-09-28

> "A user doesn't understand: he clicks on buttons and he doesn't know what they mean" — 2026-09-26

The answer is: partly intuitive.

**What works.** A first-time user can tell what the editor is for and learns each tool by hovering.
The area picker's hint teaches ⌃⇧3.

**What a first-time user cannot tell:**

- that Snapmark started at all (F209)
- why the first capture shows only the wallpaper (F210)
- how a session starts (F007)
- what "Open Session" opens (F012)
- which of two copy items to use (F001)
- where the screenshot will go, and whether "Add to session" worked (F060, F062)
- where a closed screenshot went (F058)
- that the Document tab is editable and saved (F134)
- what an empty session wants (F132)
- what the marks mean in a PDF (F193)

**What surprises a frequent user:**

- pressing a tool's key again gives its sibling (F063)
- a reference covers the thing it points at (F071)
- a few presses of Esc discard the screenshot (F051)
- a card's pointer line needs a drag nobody shows (F064)

**Help.** Help exists, but it is filed under Settings and cannot be reached from the editor (F003,
F065). It also explains tools in the agent's words (F162).

**The six plain questions.** Agents 6, 7 and 8 answered them per surface. "Confident what will
happen" is No or Partly on almost every surface. First run is No on every question rated.

## Checklist results

Each point of the shared checklist, adapted to a macOS menu bar app, as the agents who own it
recorded it. "Checked by" gives the agent numbers. Where they disagree, both results are shown.

| Area                  | #   | Point                                      | Result                                                                                                           | Checked by | Evidence                                                                                                                                                             |
| --------------------- | --- | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Navigation            | 1   | Clear first screen                         | fail                                                                                                             | 2, 8       | only a menu bar icon at first launch (F209)                                                                                                                          |
| Navigation            | 2   | Predictable menu, 7 ± 2 items              | fail                                                                                                             | 2, 8       | 11 to 16 top-level items (F002)                                                                                                                                      |
| Navigation            | 3   | Location in nested screens                 | fail (2) · pass with exception (8)                                                                               | 2, 8       | every editor titled "Snapmark" (F059); Edit Again names no entry (F100); agent 8: session names orient the windows, but a rename leaves an open editor's label stale |
| Navigation            | 4   | Search where content is heavy              | fail                                                                                                             | 2, 8       | no find in the session window (F150); older sessions only through a folder picker (F004)                                                                             |
| Navigation            | 5   | One way home, always                       | pass with exception (2) · pass (8)                                                                               | 2, 8       | the menu bar icon is always one click away; a stranded editor after a full-screen capture is the exception (F026)                                                    |
| Navigation            | 6   | Two paths to each main screen              | fail                                                                                                             | 2, 8       | session window only through Open Session; Keyboard Shortcuts only through Settings (F003, F065, F101)                                                                |
| Navigation            | 7   | Useful footer or status bar                | fail                                                                                                             | 2, 8       | the editor's footer does not name its session (F060); no save state in the session window (F134); no count in its header (F146)                                      |
| Navigation            | 8   | Helpful not-found                          | fail                                                                                                             | 2, 8       | a missing session makes saving fail silently and the menu say "No Session Yet" (F049, F009)                                                                          |
| Forms and inputs      | 1   | Visible labels on every field              | fail                                                                                                             | 3, 8       | comment field has only a placeholder (F091); notes named only by "Note for 1" (F087)                                                                                 |
| Forms and inputs      | 2   | Required fields marked                     | not applicable                                                                                                   | 3, 8       | nothing is required                                                                                                                                                  |
| Forms and inputs      | 3   | Specific errors                            | fail                                                                                                             | 3, 8       | rename errors arrive as a notification after the dialog is gone (F177); save and export failures (F049, F171)                                                        |
| Forms and inputs      | 4   | Validation before submit                   | fail                                                                                                             | 3, 8       | Rename, Other Session… and Sessions Folder… are checked only after closing (F177, F186)                                                                              |
| Forms and inputs      | 5   | Entered data kept after an error           | fail                                                                                                             | 3, 8       | Rename loses the typed name (F177); Edit Again overwrites Document-tab text (F125); a refused Document save is dropped (F126)                                        |
| Forms and inputs      | 6   | Right input type                           | pass                                                                                                             | 3, 8       | native colour well and folder dialogs, text for names                                                                                                                |
| Forms and inputs      | 7   | Autofill or suggestions                    | pass                                                                                                             | 3, 8       | Rename is prefilled with the current name                                                                                                                            |
| Forms and inputs      | 8   | Clear primary button                       | pass, with a note                                                                                                | 3, 8       | "Add to session" is filled and "Discard" outlined, but the fill is the Remove red (F095)                                                                             |
| Accessibility         | 1   | Text contrast 4.5:1                        | fail: editor, session window · pass: area picker, Keyboard Shortcuts, menu (5) · fail (8)                        | 5, 8       | placeholders 4.4:1 (F113), reference numbers on picked colours (F088), entry headings 4.4:1 (F152)                                                                   |
| Accessibility         | 2   | Control and icon contrast 3:1              | fail: editor, session window, area picker · pass: Keyboard Shortcuts, menu (5) · not checked (8)                 | 5, 8       | selected tool (F083), field edges (F114), selection handles (F082), Highlighter (F054), red on coloured grounds (F084), selected tab (F140), area edge (F044)        |
| Accessibility         | 3   | Targets 24 × 24                            | fail: editor · pass: session window, menu · n/a: area picker, Keyboard Shortcuts (5) · pass, dimensions only (8) | 5, 8       | resize handles 4.5 points (F055)                                                                                                                                     |
| Accessibility         | 4   | Everything by keyboard                     | fail: editor, area picker · pass: session window, Keyboard Shortcuts, menu (5) · fail (8)                        | 5, 8       | no mark by keyboard (F048), focus lost after choosing a tool (F056), area picker pointer-only (F034), no key opens the menu (F024)                                   |
| Accessibility         | 5   | Visible focus                              | pass: editor · fail: session window (5) · fail (8)                                                               | 5, 8       | the document has no focus indicator (F155); the toolbar destroys the focused button (F056)                                                                           |
| Accessibility         | 6   | Alt text; empty alt only on decoration     | fail: editor, session window, Keyboard Shortcuts · pass: menu (5) · fail (8)                                     | 5, 8       | canvas unnamed (F057), Screenshots-tab image marked decorative (F130), icons read as "image" (F169); document images named "Screenshot N" is a design choice (F208)  |
| Accessibility         | 7   | Language declared                          | fail on every page                                                                                               | 5, 8       | editor (F121), session window (F156), area picker (F047), Keyboard Shortcuts (F170), PDF (F206)                                                                      |
| Accessibility         | 8   | No meaning by colour alone                 | fail: editor and its output (5) · pass, limited (8)                                                              | 5, 8       | "keep" is a green box that means the same as a red one (F050)                                                                                                        |
| Accessibility         | 9   | Captions on video                          | not applicable                                                                                                   | 5, 8       | no audio or video                                                                                                                                                    |
| Accessibility         | 10  | Skip link or platform equivalent           | pass: editor, session window, Keyboard Shortcuts (5) · fail (8)                                                  | 5, 8       | landmarks exist; agent 8: no explicit keyboard route between regions                                                                                                 |
| Desktop window sizes  | 1   | Viewport meta                              | not applicable                                                                                                   | 3, 8       | desktop windows                                                                                                                                                      |
| Desktop window sizes  | 2   | Touch targets 44 × 44                      | not applicable                                                                                                   | 3, 8       | no touch; on desktop the handles are 4.5 points (F055)                                                                                                               |
| Desktop window sizes  | 3   | Text readable without zoom                 | pass, with a note (3) · not checked (8)                                                                          | 3, 8       | key captions 10 points, variant dots 6 points (F093, F094)                                                                                                           |
| Desktop window sizes  | 4   | No horizontal scroll at any size           | pass (3) · fail, as a code risk (8)                                                                              | 3, 8       | the editor header fits at 1180 and 1000; agent 8: the toolbar may scroll sideways and long names are not bounded                                                     |
| Desktop window sizes  | 5   | Standard trackpad gestures                 | fail                                                                                                             | 3, 8       | no pinch or ⌘-scroll zoom on the screenshot (F069)                                                                                                                   |
| Desktop window sizes  | 6   | Inputs suited to the device                | pass                                                                                                             | 3, 8       | pointer drawing, single keys                                                                                                                                         |
| Desktop window sizes  | 7   | Every supported window size                | pass, with notes (3) · not checked (8)                                                                           | 3, 8       | usable at 1180, 1440, 1920, 1× and 2×, light and dark; no minimum size on the session window (F148)                                                                  |
| Desktop window sizes  | 8   | Critical controls within reach             | pass                                                                                                             | 3, 8       | "Add to session" stays in view with 12 notes                                                                                                                         |
| Performance           | 1   | Time to first usable screen                | pass (3) · not checked (8)                                                                                       | 3, 8       | editor 157–292 ms, session window with 10 entries 91–131 ms                                                                                                          |
| Performance           | 2   | Largest paint under 2.5 s                  | pass (3) · not checked (8)                                                                                       | 3, 8       | as above                                                                                                                                                             |
| Performance           | 3   | Layout shift under 0.1                     | pass, with a note (3) · not checked (8)                                                                          | 3, 8       | tool icons swap inside fixed buttons                                                                                                                                 |
| Performance           | 4   | Images optimised                           | partly (3) · fail (8)                                                                                            | 3, 8       | no lazy loading in the Document tab; token cost (F207); full-size editable originals kept (F192)                                                                     |
| Performance           | 5   | Web fonts efficient                        | not applicable                                                                                                   | 3, 8       | system fonts                                                                                                                                                         |
| Performance           | 6   | No console errors                          | pass (3) · not checked (8)                                                                                       | 3, 8       | none in the editor in any run                                                                                                                                        |
| Performance           | 7   | HTTPS                                      | not applicable                                                                                                   | 3, 8       | local app                                                                                                                                                            |
| Performance           | 8   | Semantic structure                         | partly (3) · fail (8)                                                                                            | 3, 8       | "References" is not a heading (F117), canvas unnamed (F057), tables without headers (F168)                                                                           |
| Content and microcopy | 1   | Descriptive headings                       | fail (4) · pass (8)                                                                                              | 4, 8       | the session window's heading is a folder name (F222); "Other keys" mixes global and editor keys (F159); entries titled "001 · 22:30" (F199)                          |
| Content and microcopy | 2   | Buttons name their action                  | fail (4) · pass (8)                                                                                              | 4, 8       | "Review" in the quit question (F180), "Open" in folder pickers (F175, F186), "Discard" in Edit Again (F080)                                                          |
| Content and microcopy | 3   | Scannable text                             | pass (4) · pass, structure only (8)                                                                              | 4, 8       | short labels everywhere; the longest texts are the Keyboard Shortcuts descriptions                                                                                   |
| Content and microcopy | 4   | No typos or grammar errors                 | fail                                                                                                             | 4, 8       | "Restart to Update to 0.9.1" (F216), a notification without a full stop (F185), README keys (F211)                                                                   |
| Content and microcopy | 5   | One tone                                   | fail                                                                                                             | 4, 8       | the updater's stock text (F214), raw errors (F171), "Control+Shift+1" (F173), mixed case (F227), two names for capture (F224)                                        |
| Content and microcopy | 6   | Helpful empty states                       | fail                                                                                                             | 4, 8       | empty session (F132), first-run menu (F007)                                                                                                                          |
| Content and microcopy | 7   | Clear confirmation after important actions | fail                                                                                                             | 4, 8       | adding (F062), removing (F131) and starting a session (F176)                                                                                                         |
| Content and microcopy | 8   | Privacy and terms reachable                | not applicable (4) · fail (8)                                                                                    | 4, 8       | local app; agent 8: Redact does not say the clear original is kept (F192)                                                                                            |

Agents 6 and 7 cite single checklist points inside their findings (for example "clear first screen:
fail"); they agree with the table.

## Did not run

**Agent 1 · concepts and structure**

- Not scriptable; read in the code, with the menu rendered from its own data and labelled as a
  rendering:
  - the menu bar menu
  - macOS's capture overlay
  - notifications
  - native dialogs (Sessions Folder…, Other Session…, Reopen Discarded…, Rename, Quit)
  - Spaces and full-screen behaviour
  - the Dock icon, the DMG and first run
- The real global keys and any real screen capture: forbidden by the safety rules. The findings on
  capturing ahead of annotating and on full-screen apps come from the code and the owner's report,
  not reproduced.
- PDF and ZIP export output: not opened.
- Dark mode and 1× scale for its own screens: not captured. The editor at 1440 and 1920 wide: not
  captured.
- Pattern research is from knowledge, not from running the other products; lines marked "unsure"
  are uncertain. "Ocra" could not be identified.
- In one harness run the Screenshots tab opened on "2 of 3" instead of "1 of 3". It could not be
  reproduced, so it is not a finding.

**Agent 2 · navigation, layout, surfaces, states**

- Full-screen Spaces: no full-screen window was created (binding rule). Question 3 is read in the
  code, with the owner's report and the audit lead's stand-in test. Two points are assumptions: keys
  reaching a stranded editor, and where the editor lands with the session window open.
- Not scriptable; read in the code:
  - the menu bar menu
  - the capture overlay
  - notifications
  - the quit sheet
  - the three Open panels
  - the Rename dialog
  - the Dock and its window list
  - the macOS Colors panel

  The Mac menu bar's structure was printed from the running app, not pictured.

- Not run for safety: first launch, the Screen Recording permission, Check for Updates, Restart to
  Update and the update install. The effect of notifications turned off or a Focus was not tried
  either.
- Only one display: placement on a second display and "the area's display is gone" were not tried.
- Approximations:
  - ⌘R was triggered the way the stock Reload item does it, not through the key.
  - The Keyboard Shortcuts window was rendered from its markup, copied from the code.
- Not run:
  - a session folder deleted while its session window is open (read in the code only)
  - dark mode of the session window and the Keyboard Shortcuts window

**Agent 3 · controls, lists, visual design, window sizes, output for AI**

- Not scriptable: the menu bar menu, native dialogs, notifications and the macOS colour panel. The
  menu was built as data; the rest was read in the code.
- The Keyboard Shortcuts window: rendered by a script that copies the app's template line for line,
  not the app's own window.
- Dropping a file from Finder on the editor: Electron cannot synthesise a file drag, so that finding
  is an assumption.
- ⌘+ and Electron's default menu in the editor: not pressed; stated as an assumption.
- The capture itself (⌃⇧1, ⌃⇧3): never run. Timings start when the editor is asked to open.
- A real agent reading session.md: not run. Token costs are computed from the resize rule and the
  width × height ÷ 750 estimate, not measured.
- PDF and ZIP export: not exported in its runs; the PDF's content was read in the code.
- Not captured: the session window dark at 1440, the editor dark at 1920 or at 1×.
- Harness caveats:
  - The harness's note helper, followed at once by a click, can lose the note.
  - A screenshot taken right after a step can show an earlier frame. This was checked; one capture
    was redone and one stale capture replaced.

**Agent 4 · words, vocabulary, keys, earlier requests**

- Not pressed or shown: global shortcuts, the menu bar menu, notifications, native dialogs and the
  capture overlay. Their words come from the code. The menu was printed for four states, and the
  stock app menu was dumped from Electron 44.4.5.
- Whether macOS shows an open panel's title: an assumption, not checked.
- The stock app menu in the packaged app was dumped from the development build. ⌘R's effect was
  reproduced by calling the same reload the menu role calls, not by the key press.
- The installed app's repeated Screen Recording prompts (owner's report of 2026-09-25): could not be
  checked without running the installed, ad-hoc signed app.
- Figma's shortcut list was checked in its published help, not inside Figma.
- Dark mode and 1× screens for the strings: not repeated.
- Earlier UX documents were used only to re-check, never copied.

**Agent 5 · accessibility**

- No real screen reader session: VoiceOver was not run. Names, roles and states come from Chromium's
  accessibility tree; the spoken wording in the findings is inferred, not heard.
- Evaluated from the code: the menu bar menu, notifications, native dialogs and the capture overlay.
  Whether VoiceOver names the menu bar icon "Snapmark" is an assumption. The ⌃F8 route to the menu
  was not tried.
- Capture region (⌃⇧1): not pressed. That it is pointer-only was read in the code.
- Not tested:
  - text spacing
  - the session window at 400% zoom
  - dark-mode screenshots of the session window (dark contrast was computed from the tokens)
  - macOS Increase Contrast, Reduce Transparency and larger system text
  - focus return from an Edit Again editor to the session window
- Handle size at 1×: computed (about 9 points), not captured.
- Lighthouse: not run, because the pages need Snapmark's preload.

**Agent 6 · independent evaluator**

- Read in the code: the menu bar menu, notifications, native dialogs, the Dock icon, Spaces and
  first run. The menu was drawn from its own data (`shots/6-menu-built-vs-proposal.png` is a
  drawing).
- Where the reviewer lands after saving from a full-screen Space: not checked; stated as an
  assumption.
- The area picker while dragging: the harness's scripted drag gave a wrong size label and area on
  this machine. This is not reported as a product problem, and `6-area-dragging.png` is not used as
  evidence.
- Not checked: Chrome and Figma clashes with ⌃⇧1–3. Not opened: the macOS colour panel.
- Not exercised: a PDF with a really tall screenshot. Not captured: the editor at 1440 and 1920 wide.
- Contrast values and keyboard-only operation: left to agent 5.
- Auto-update and the DMG: read in the code and README only.
- The harness's text insertion failed on a note containing "**". A real keyboard typed it
  correctly, so this is a harness limit.
- Scrolling capture: left to agent 1.

**Agent 7 · independent evaluator**

- Read in the code, the README and the owner's reports; the menu was built from its data for six
  states:
  - the menu bar menu
  - notifications
  - native dialogs
  - the capture overlay
  - Spaces and full-screen apps
  - the Dock icon, the DMG, first run and auto-update
- The Keyboard Shortcuts window: rendered from the same template code in its own script.
- Capture Same Area over a real screen: not done.
- How long a new reference's note takes to get the cursor: measured between under 10 ms and about
  1 s in different runs, most likely because of throttled background windows. It is not reported as
  a finding. It is worth measuring on the owner's Mac, because letters typed before the cursor
  arrives would be lost.
- ZIP export: read in the code only. The PDF was exported and looked at.
- Keyboard-only use and the contrast of every mark colour: left to agent 5.
- Scrolling capture: left to agent 1.

**Agent 8 · independent evaluator through Codex**

- The isolated Electron harness aborted before opening a window. There are no screenshots,
  annotations or rendered mockups; its proposals are text wireframes.
- Not seen live:
  - the menu, dialogs and notifications
  - permissions and keyboard conflicts
  - VoiceOver
  - the Dock
  - multiple displays and full-screen Spaces
- Unverified: window sizes, themes, Retina scaling, performance, PDF pagination and a full contrast
  sweep.
- Not done: real screen capture, installed-app launch, update or quit, clipboard writes,
  login-item changes and user data.
- What did run: scratch-data checks, the menu enumeration, and the document writer extracted from
  the compiled app. No peer or earlier audit documents were read.

**This merge**

- The screenshots were not re-opened while merging. Every file name referenced here was checked to
  exist in `shots/`.
- Where evaluators rated one problem differently, the highest rating that the impact levels justify
  was kept. The other ratings are listed under "Seen by".

---

## Menu bar menu

### F001 · The hand-off asks the reviewer to choose between two copy items whose difference cannot be seen

- **Impact:** High · Every review ends here (reviewing an overnight build), and the reviewer has to guess what each item puts on the clipboard, although the first already contains the second.
- **Current experience:** Under "Current Session: 28 Sep 09.14 · 7 screenshots" the menu offers "Copy Prompt for AI" and "Copy session.md Path", one under the other. The prompt is 15 lines: "Work through the visual feedback in "…/session.md"." followed by a legend of every mark ("- Cross: remove this."); the path item copies only the bare path, and session.md itself explains no mark, so an agent given only the path has to guess what a hatched box means. The notifications say "Prompt for 28 Sep 09.14 copied. Paste it into your AI agent." and "Path to 28 Sep 09.14 copied.", and neither shows what was copied.
- **Visual:** `shots/1-menu-full-annotated.png` (the two items, rendered from the menu's own data, not a screenshot of macOS). Proposals: `shots/1-proposal-menu.png`, `shots/4-proposal-copy-item.png`, `shots/6-menu-built-vs-proposal.png`, `shots/7-proposal-menu.png`.
- **Recommendation:** Offer one copy item instead of two, and make what it copies visible in the menu itself. The hand-off then takes no choice, and "copy what?" is answered where the reviewer clicks.
- **Tradeoff:** Whichever single item is chosen, one of today's two uses (full prompt, bare path) gets a step further away. Alternatives from the evaluators: (a) write the legend of the marks once at the top of every session.md, so one "Copy for AI" copies a one-line prompt with the path and no setting is needed; the file then explains itself to any agent, the PDF and the ZIP, at about 150 tokens per session, and older sessions have no legend; (b) keep the name "Copy Prompt for AI" with a sublabel "path + what the marks mean", move the path-only copy to a Settings choice, and let the menu label follow that setting so it never hides what it copies; (c) one item "Copy for AI Agent" with the path-only copy as the hidden ⌥ alternate, which Snapmark's menu technology cannot show without native code; (d) the owner's "Copy Session Info" with a Settings choice of with or without the prompt, but with the current mode shown beside the item and a preview of what is copied in the session window. Four evaluators argue that a plain Settings switch hides what is copied at the moment of copying, the complaint of 2026-09-26; one accepts it if the mode stays visible.
- **Decision needed:** Which single copy item should the menu offer: the legend moved into session.md with one "Copy for AI", "Copy Prompt for AI" with a path-only Settings choice shown in the label, a path-only ⌥ alternate, or "Copy Session Info" with a visible mode?
- **Verified:** read in the code (menu data rendered; the prompt printed by the app's own function).
- **Owner's words:** "I just wonder whether we need just "Copy session info" when it comes with the prompt and everything, and in the settings you select whether you want to have the prompt with it or without it." — 2026-09-28. "The interface doesn't make sense. "Copy for AI," "Copy Paste," "Copy what?" It's not clear what's getting copied. […] A user doesn't understand: he clicks on buttons and he doesn't know what they mean" — 2026-09-26. "One thing, actually, from the menu item: I want to be able to copy and paste the path to the Markdown from the current session. I just paste it and then I can point the AI to it." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: menu bar menu, current-session group; notifications after copying; build main v0.9.0
- Broken: Nielsen 1, 2, 6, 8; Hick's law, choice overload, Occam's razor, Tesler's law (the product, not the reviewer, should carry the legend); writing ("buttons name the action and its object"; "session.md" is a file name, not the user's word)
- Code: `src/menu.ts:91-92`; `src/main.ts:403-418` (`sessionMdPath`, `promptFor`: the prompt starts with the path, legend built from `tools.ts` `means`), `src/main.ts:544-551` (notifications); `src/sessions.ts` `create` writes only `# <name>`
- Screenshots: 1-menu-full.png, 1-menu-full-annotated.png, 1-proposal-menu.png, 4-proposal-copy-item.png, 6-menu-built-vs-proposal.png, 7-proposal-menu.png
- Earlier IDs: menu audit 2026-09-26 M06 ("say how, not what you get"); glossary proposal rows "copy prompt for AI", "copy path to session.md"; decisions 2026-09-25 "Menu: no global shortcut for "Copy prompt for AI"" and 2026-09-26 menu labels "Copy Prompt for AI, Copy session.md Path"
- Other products: macOS Screenshot, CleanShot X, Shottr and Xnapper copy the image, never a prompt; CleanShot X's Quick Access overlay has one "Copy" whose content is set once in Settings; Finder uses an ⌥ alternate for a close variant ("Copy" → "Copy as Pathname"); Figma's "Copy link" is one item with no variants; no reference tool has an AI hand-off
- Seen by: 1-01 (High; legend in session.md + one "Copy for AI"), 4-05 (Medium; one "Copy Prompt for AI" + Settings path-only, label follows setting; notes Electron 44.4.5 has no `alternate` menu property), 6-05 (Medium; one item + ⌥ alternate "Copy Path Only"), 7-33 (Medium; legend in session.md + one "Copy for AI", 954 characters copied today), 8-03 (Medium; "Copy session info" with visible sublabel "Path + AI instructions" and a Settings "Include AI instructions") (seen by 3 evaluators). Prompt as copied, verbatim: "Work through the visual feedback in "…/session.md". / Each entry is an annotated screenshot. The numbered list below it holds the notes for the references (numbered circles) on the image. / What the marks mean: / - Reference: a numbered circle; its note is the item with the same number in the list under the image. / - Card: a yellow card whose text is a comment about what its line points at. / - Box: look at this element. / - Ellipse: look at this element. / - Arrow: points at the element a note is about. / - Pen: a freehand mark around or on an element: look here. / - Cross: remove this. / - Remove area: remove everything in the hatched area. / - Highlighter: a yellow highlight: look here. / - Spotlight: the image is dimmed except one clear area: focus on that area. / - Cut & move: a dashed outline with an arrow: move that element to where the arrow points. / - Redact: pixelated on purpose to hide private details; ignore it." Related: F133, F193, F184, F205.
- Guideline: none accepted yet (rule area: copy and paste; feedback and notifications)

</details>

### F002 · The menu shows up to 16 top-level items, and rare session upkeep sits at the same rank as capturing and handing off

- **Impact:** Medium · Every time the reviewer opens the menu for one of two frequent jobs (capture, hand off), they scan 11 to 16 items, a header and three submenus, with once-a-month actions mixed in.
- **Current experience:** Counted from the menu's own data: with no session yet 11 top-level items, 5 of them greyed; in the usual state (a session with screenshots and an area set) 13; with something discarded 15; with an update waiting as well 16, plus the header "Current Session: 28 Sep 09.14 · 7 screenshots" and three submenus (Export Session, Switch Session, Settings), one level deep. "Rename Session…", "Show Session in Finder", "Export Session ▸", "New Session", "Choose New Area…" and "Reopen Discarded…" sit at the same weight as "Capture Screenshot" and "Copy Prompt for AI"; the reviewer reads past Rename, Finder and Export on every visit to reach the two items they use.
- **Visual:** `shots/6-menu-built-vs-proposal.png` (16 items drawn from the menu's data, next to a labelled proposal with 10); `shots/1-menu-full-annotated.png`. Proposals: `shots/7-proposal-menu.png`, `shots/1-proposal-menu.png`.
- **Recommendation:** Keep at the top level only what the main scene uses every time: the two captures, Open Session, one copy item and Export, plus Switch Session. Move rare session upkeep one step away, so the menu drops to about ten items and the frequent ones are found at a glance.
- **Tradeoff:** Rare actions take one more step, and a reviewer who never opens the session window must learn where they went. Alternatives from the evaluators: (a) move Rename, Show in Finder and Export into the session window's header, next to the session they act on (about 11 fixed rows); (b) put Switch, New, Rename, Show in Finder and Reopen Discarded into one "Sessions" submenu (10 items); (c) group upkeep under a "Session actions ▸" submenu, or in the session window; (d) also move New Session into Switch Session, make Choose New Area the ⌥ alternate of Capture Same Area, and put both Reopen items into one submenu.
- **Decision needed:** Which of Rename Session, Show Session in Finder, Export, New Session, Choose New Area and the Reopen items may leave the top level, and should they move into the session window or into one submenu?
- **Verified:** read in the code (the menu built from its own data for four to six states).
- **Owner's words:** "Also the menu is still fucking the bows, and there are so many submenus and everything, and the language is shit. Can you fucking audit this and implement the recommendations? I want easy language and it to follow the laws of ux. also the menu is fucking verbose" — 2026-09-26. "I think overall, X-wise, it's also quite complicated in terms of what we have in the menu." — 2026-09-28

<details><summary>Supporting notes</summary>

- Where: menu bar menu, all states; build main v0.9.0
- Broken: Nielsen 8; Shneiderman consistency; Hick's law, Miller's law, choice overload, Pareto principle, chunking, serial position effect (Quit and Settings get the memorable last spots), Prägnanz; Maze: limitations in the journey; checklist navigation 2 (7±2 items)
- Code: `src/menu.ts:68-133` (current-session rows 90-100); counts from `menuTemplate()` run in Node (6's `e6/menu-dump.js`; 8's `codex/verify.cjs`, `codex/evidence.txt`)
- Screenshots: 1-menu-full.png, 1-menu-full-annotated.png, 1-proposal-menu.png, 1-proposal-session-window.png, 1-session-doc.png, 6-menu-built-vs-proposal.png, 7-proposal-menu.png
- Earlier IDs: menu audit 2026-09-26 M01, M14 (re-checked: still true, with one row more)
- Other products: CleanShot X groups captures at the top and puts history and settings below one separator each, and keeps per-capture actions (rename, show in Finder) in its history window; Xnapper keeps export and share in its editor window; Figma keeps rename and export in the file's own menu; macOS ⌘⇧5 shows capture modes plus one Options menu
- Seen by: 6-06 (counts 11 / 11 empty / 16 fullest; rare actions to the session window, New Session into Switch, Choose New Area as ⌥ alternate, Reopen into one submenu), 7-34 (counts 11 / 13 usual / 15 / 16; one "Sessions" submenu), 8-02 (6 / 12 / 16 enabled choices, 15 / 16 / 20 rows with separators; "Session actions ▸" or the session window), 1-05 (Low; the current-session block only: Rename, Finder, Export to the session window; 16 / 16 / 21 visible rows) (seen by 3 evaluators). Agent 4's earlier-requests check counted 16 top-level lines in the fullest state, 12 on first run. Related: F001, F005, F006, F133.
- Guideline: none accepted yet (rule area: dialogs, menus and popovers)

</details>

### F003 · Keyboard Shortcuts, the only help, is filed under Settings

- **Impact:** Medium · A first-time reviewer who wants the keys, which are how the owner wants to work "on the fly", does not look for help inside Settings, three clicks deep.
- **Current experience:** Menu → "Settings ▸" → "Keyboard Shortcuts" opens a window titled "Keyboard shortcuts". Settings also holds two preferences ("Open at Login", "Sessions Folder…") and an action ("Check for Updates…", sub-line "Snapmark 0.9.0"); Keyboard Shortcuts and Check for Updates are not settings. There is no Help item at the top level.
- **Visual:** `shots/1-menu-full.png` (the Settings submenu, rendered from the menu's data); `shots/6-menu-built-vs-proposal.png` (left: inside Settings ▸; right, labelled Proposal: "Keyboard Shortcuts" at the top level above Settings).
- **Recommendation:** Put "Keyboard Shortcuts" at the top level of the menu (or under a Help item), so the list of keys is one click from the menu bar icon.
- **Tradeoff:** One more top-level row in a menu the owner already finds verbose.
- **Decision needed:** Should Keyboard Shortcuts move from Settings to the top level of the menu (or a Help item)?
- **Verified:** read in the code (menu data).
- **Owner's words:** "ok can you show the shortcut keys again." — 2026-09-26. "I think everything is not very intuitive." — 2026-09-28

<details><summary>Supporting notes</summary>

- Where: menu bar menu → Settings submenu; build main v0.9.0
- Broken: Nielsen 10, 6; Jakob's law (help is not a setting); paradox of the active user; checklist navigation 6 (two paths to main screens; this one has one)
- Code: `src/menu.ts:115-130` (Settings), `src/menu.ts:128`; `src/main.ts:508-537`
- Screenshots: 1-menu-full.png, 1-shortcuts-window-full.png, 6-menu-built-vs-proposal.png, 7-keyboard-shortcuts.png
- Earlier IDs: menu audit 2026-09-26 M11 (Keyboard Shortcuts is help, not a setting); decision 2026-09-26 "Help menu removed: Keyboard Shortcuts moves into Settings" (placed it here)
- Other products: Figma and most macOS apps put Keyboard Shortcuts under Help; CleanShot X lists its shortcuts in Settings ▸ Shortcuts, where they can also be changed; Shottr in Preferences
- Seen by: 1-07 [menu depth part], 6-09 [menu part], 7-38 [menu part] (seen by 2 evaluators). Related: F065 (no route from the editor), F067.
- Guideline: none accepted yet (rule area: first run and help)

</details>

### F004 · Sessions older than the 20 most recent can be reached only through a folder picker

- **Impact:** Medium · A reviewer returning to older work (reviewing an overnight build from last week) has to remember folder names and find them in a file dialog, with no search, counts or previews.
- **Current experience:** "Switch Session ▸" lists the 20 most recently used sessions and then "Other Session…", which opens a macOS folder dialog titled "Choose a session" in the sessions folder. Picking a folder elsewhere, or one without session.md, ends in the notification "That folder is not a session in ~/Documents/Snapmark." Automatic names omit the year, so older rows can be ambiguous.
- **Visual:** No screenshot: native dialog, not scriptable. Proposal (words): "Switch Session ▸ … · All Sessions…" opening a searchable list with last-used dates and screenshot counts.
- **Recommendation:** Keep the short recent list for one-click switching, and replace the folder dialog with a searchable list of all sessions inside Snapmark (in the session window or an "All Sessions…" window).
- **Tradeoff:** A new list view to build and keep in step; the folder dialog could stay as a fallback for sessions outside the sessions folder.
- **Decision needed:** Should all sessions be listed and searchable inside Snapmark instead of being picked as folders?
- **Verified:** read in the code.
- **Owner's words:** "It needs to be some sort of project or session. If there's an existing session I just add to the existing session or I create a new session." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: menu bar menu → Switch Session → Other Session…; native open panel; build main v0.9.0
- Broken: Nielsen 5, 6; Shneiderman shortcuts; working memory, Miller's law, Postel's law; checklist navigation 4 (search where content is heavy)
- Code: `src/main.ts:490-502`; `src/menu.ts:48, 103-111` (`MAX_LISTED = 20`); `src/sessions.ts:87-90` (short names without the year)
- Screenshots: none
- Earlier IDs: none
- Other products: no directly equivalent session picker was verified
- Seen by: 7-52 (Low), 8-04 [folder chooser, no search part] (seen by 2 evaluators). 2-48 also suggested listing the sessions after the first 20 so the panel is rarely needed. Related: F013, F186.
- Guideline: none accepted yet (rule area: search and filters; lists and selection)

</details>

### F005 · Menu items appear and disappear with the app's state, so the frequent ones move

- **Impact:** Medium · The reviewer who reaches for the hand-off by position (reviewing an overnight build) lands on the wrong row whenever an update waits, an area is set or something was discarded.
- **Current experience:** On a fresh session "Copy Prompt for AI" is the 6th row. Once an area is set ("Choose New Area…" appears), something was discarded ("Reopen Last Discarded" and "Reopen Discarded…" appear) and an update waits ("Restart to Update to 0.9.1" appears above "Capture Screenshot"), it is the 10th row; "Open Session" moves from row 4 to row 8. The whole session block slides down by four rows, and back up after a restart or seven days.
- **Visual:** `shots/1-menu-first-run.png` against `shots/1-menu-full.png` (both rendered from the menu's data); `shots/6-menu-built-vs-proposal.png` (fullest state).
- **Recommendation:** Keep the rows above the session block fixed: show "Choose New Area…" always (it can read "Choose Area…" before the first time), keep "Reopen Last Discarded" as one always-present row lower in the menu (greyed when there is nothing), and move "Restart to Update" to the bottom, above Quit. The frequent items then never move.
- **Tradeoff:** A greyed row is visible even when it does nothing; the update notice is less prominent at the bottom.
- **Decision needed:** Should menu items stay in place, greyed or placed lower when they cannot act, instead of appearing and disappearing on top?
- **Verified:** read in the code (menu data for four states dumped and rendered).
- **Owner's words:** "The order of the menu just doesn't make sense." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: menu bar menu, all states; build main v0.9.0
- Broken: Nielsen 4; Shneiderman consistency; Fitts's law and Jakob's law (muscle memory for positions; macOS greys unavailable items rather than hiding them); serial position effect
- Code: `src/menu.ts:74, 81, 83-84, 97` (items with `visible: st.updateWaiting / !!st.area / st.hasDiscarded`)
- Screenshots: 1-menu-first-run.png, 1-menu-full.png, 6-menu-built-vs-proposal.png
- Earlier IDs: none
- Other products: macOS menus keep unavailable items in place and grey them (Apple HIG); CleanShot X's and Shottr's menus are fixed lists
- Seen by: 1-02, 6-07 (Low). Row counts (1-02): no session 16, empty session 16, full state 21 visible rows; top-level lines 12 → 17. Related: F002, F015.
- Guideline: none accepted yet (rule area: dialogs, menus and popovers)

</details>

### F006 · The recovery items take the top block, above the session the reviewer works in

- **Impact:** Medium · The first rows of the menu, the ones read and hit most, go to recovering discarded screenshots, a job done once in a while.
- **Current experience:** After any discard the first block reads "Capture Screenshot · Capture Same Area · Choose New Area… · Reopen Last Discarded · Reopen Discarded…", with "Restart to Update to 0.9.1" above them when an update waits. Only the two captures are frequent; the two Reopen items take rows five and six, above the session group where the eye goes next.
- **Visual:** `shots/1-menu-full-annotated.png` (the top block, rendered from the menu's data); `shots/6-menu-built-vs-proposal.png` (left, rows 5–6).
- **Recommendation:** Keep only the capture items (and "Choose New Area…") in the top block, and move recovery below the session group, next to what it belongs to.
- **Tradeoff:** Recovery right after an accidental close is one row, or one hover, further away. Alternatives from the evaluators: (a) a fixed "Reopen Last Discarded" row lower in the menu, with the full list of discarded items in the session window; (b) one "Reopen Discarded" submenu after Switch Session listing the last few discards by time and session.
- **Decision needed:** Should recovery move below the session group, as a fixed row with the full list in the session window, or as one submenu of recent discards?
- **Verified:** read in the code (menu data rendered).
- **Owner's words:** "I just wonder if we should introduce a shortcut with Escape and be able to recover it so nothing ever gets lost." — 2026-09-25. "The order of the menu just doesn't make sense." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: menu bar menu, top block after a discard; build main v0.9.0
- Broken: serial position effect; Pareto principle; Nielsen 8
- Code: `src/menu.ts:74-84` (update, capture, area, choose, reopen ×2)
- Screenshots: 1-menu-full.png, 1-menu-full-annotated.png, 6-menu-built-vs-proposal.png
- Earlier IDs: none
- Other products: CleanShot X keeps "Open History" in the lower half of its menu; macOS Screenshot puts recent captures in no menu (floating thumbnail only)
- Seen by: 1-03 [placement part; recommends a fixed row lower and the full list in the session window], 6-08 [placement part; Low; recommends one "Reopen Discarded" submenu]. The shared icon is F016. Related: F011, F174.
- Guideline: none accepted yet (rule area: dialogs, menus and popovers)

</details>

### F007 · Before the first session the menu shows "No Session Yet" over five greyed rows and never says that a capture starts one

- **Impact:** Medium · A first-time user opening the menu sees half of it dead, with no hint of what makes it come alive.
- **Current experience:** Before any session the menu reads "No Session Yet" followed by "Open Session", "Copy Prompt for AI", "Copy session.md Path", "Rename Session…" and "Show Session in Finder", all greyed. Switch Session holds only "Other Session…". The first capture then creates a session silently, named by date and time, and nothing in the menu said it would.
- **Visual:** `shots/1-menu-first-run.png` (rendered from the menu's data).

  | Where            | Before                              | After (alternative a)                                     | After (alternative b)                                  |
  | ---------------- | ----------------------------------- | --------------------------------------------------------- | ------------------------------------------------------ |
  | Menu, no session | "No Session Yet" + five greyed rows | "No session yet: capture a screenshot (⌃⇧1) to start one" | header "No Session Yet: Your First Capture Starts One" |

- **Recommendation:** Before the first session, say the next step in the menu itself, so a first-time user learns that capturing starts a session.
- **Tradeoff:** The menu changes shape between first run and later (once only). Alternatives from the evaluators: (a) replace the header and the five greyed rows with one teaching line and show the session rows once a session exists; (b) keep the rows and put the next step into the header, which makes a long header.
- **Decision needed:** Before the first session, should the menu show one teaching line instead of the header and five greyed rows, or keep the rows and reword the header?
- **Verified:** read in the code (menu data rendered for the no-session state).
- **Owner's words:** "I also wonder: where do I access the session? Is this in the toolbar of my Mac? Is this where I am supposed to see it or where would I see that?" — 2026-09-25. "The whole thing doesn't even say what it is." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: menu bar menu, no-session state; build main v0.9.0
- Broken: Nielsen 10, 8; checklist content 6 (helpful empty states); paradox of the active user
- Code: `src/menu.ts:87` (header label `'No Session Yet'`, items `enabled: on`); `src/main.ts` `openEditor` creates a session when none is current
- Screenshots: 1-menu-first-run.png
- Earlier IDs: none
- Other products: CleanShot X and Shottr show no disabled rows before the first capture; macOS Screenshot has no menu; Figma's empty file list shows one "Create new" call to action
- Seen by: 1-06 (one teaching line), 4-36 (Low; header wording). Related: F209.
- Guideline: none accepted yet (rule area: first run and help)

</details>

### F008 · Every session action works only on the current session, so acting on an older one redirects the next captures

- **Impact:** Medium · To copy, export, rename or open an older session, the reviewer must first make it current, and then forgets to switch back: the next screenshots of today's review land in last week's session.
- **Current experience:** Switch Session ▸ lists sessions with a tick on the current one; clicking one only makes it current. "Open Session", "Copy Prompt for AI", "Copy session.md Path", "Rename Session…", "Show Session in Finder" and "Export Session" all act on the current session only. Handing yesterday's session to an agent takes five clicks (menu, Switch Session, the session, menu, Copy Prompt for AI) and leaves yesterday's session as the one new captures go into; renaming an older session does the same.
- **Visual:** `shots/1-menu-full.png` (the Switch Session submenu, rendered from the menu's data).
- **Recommendation:** Separate "look at or hand off a session" from "make it the one captures go into": choosing a session in Switch Session opens its session window, where its actions live, and the window offers "Make Current" (or "Capture into This Session") as a separate, explicit step.
- **Tradeoff:** Switching becomes a two-step action (open, then Make Current). The owner rejected per-session submenus on 2026-09-26 for being too deep; this keeps one level in the menu and moves the choice into the window. Alternative: keep a click as switch and add "Open…" per session.
- **Decision needed:** Should choosing an older session open it for viewing and handing off, with making it current as a separate step?
- **Verified:** read in the code.
- **Owner's words:** "Also it's not clear that you can only rename the current session and show the current session in Finder but it's not clear what's happening." — 2026-09-26. "It needs to be some sort of project or session. If there's an existing session I just add to the existing session or I create a new session." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: menu bar menu, Switch Session and the current-session block; build main v0.9.0
- Broken: Nielsen 1, 3, 5 (a hidden mode change as a side effect), 6; mental model (viewing ≠ switching); working memory; rule area lists and selection (row actions)
- Code: `src/menu.ts:93` (rename bound to the current session), `src/menu.ts:106-108` (rows only switch), `makeCurrent`; `src/main.ts` `actions.makeCurrent = setActive`
- Screenshots: 1-menu-full.png
- Earlier IDs: decision 2026-09-25 "each listed session has its own submenu", reversed 2026-09-26; menu audit 2026-09-26 M02
- Other products: Figma has no "current file" and separates opening from anything else; CleanShot X's history opens any capture without changing where new ones go; macOS Screenshot has a single "Save to" setting separate from browsing
- Seen by: 1-09, 3-33 [rename-only-while-current part; Low]. The no-delete part of 3-33 is F225. Related: F133.
- Guideline: none accepted yet (rule area: navigation and return; lists and selection)

</details>

### F009 · When the current session's folder is gone, the menu says "No Session Yet" while captures still go to it

- **Impact:** Medium · The menu and the editor contradict each other, and the reviewer has no clue that the next capture cannot be saved.
- **Current experience:** When the current session's folder is no longer in the sessions folder (moved or deleted in Finder), the menu's header reads "No Session Yet" and "Open Session", "Copy Prompt for AI", "Copy session.md Path", "Rename Session…" and "Show Session in Finder" are greyed, though other sessions are listed under Switch Session. The next capture still opens with "→ <the missing name>" and cannot be saved. Only New Session or Switch Session gets out of it.
- **Visual:** No screenshot: the menu cannot be pictured. The editor side is in `shots/2-editor-save-missing-session-annotated.png`.
- **Recommendation:** Check the current session each time the menu opens and each time a capture starts. If it is gone, the header says so ("gone is no longer in ~/Documents/Snapmark") and the next capture starts a new session, as it does before the first session.
- **Tradeoff:** A session appears without being asked for; the header and the editor name it.
- **Decision needed:** If the current session disappears, should the next capture start a new session by itself?
- **Verified:** read in the code.
- **Owner's words:** "Also it's not clear that you can only rename the current session and show the current session in Finder but it's not clear what's happening." — 2026-09-26

<details><summary>Supporting notes</summary>

- Where: menu bar menu header, with the current session's folder missing; build main v0.9.0
- Broken: Nielsen 1, 4; checklist navigation 8 (helpful not-found)
- Code: `src/main.ts:430-433` menuState (`current` is null when `active` is not listed) versus `src/main.ts:191-193` openEditor (`opts.session ?? active`, with `active` still the missing name); `active` is re-checked only at launch (`loadState`, line 72)
- Screenshots: 2-editor-save-missing-session.png, 2-editor-save-missing-session-annotated.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 2-09. Related: F049.
- Guideline: none accepted yet (rule area: local work and external writes)

</details>

### F010 · Bringing back a discarded screenshot silently makes its old session the current one

- **Impact:** Medium · After reopening yesterday's discarded capture, every following capture of today's review goes into yesterday's session, and only the menu header shows it.
- **Current experience:** With "Session B" current, "Reopen Last Discarded" on a capture discarded in "Session A" opens the editor with "→ Session A" and switches the current session to Session A. No notification says so.
- **Visual:** No screenshot: checked by running the build (current session before reopening: Session B; after: Session A).
- **Recommendation:** Reopening puts the screenshot back into its session without changing which session new captures go into.
- **Tradeoff:** A reviewer who wants to continue in the old session has to switch explicitly.
- **Decision needed:** Should bringing back a discarded screenshot leave the current session as it is?
- **Verified:** read in the code; confirmed by a script run on the build (no screenshot).
- **Owner's words:** "If there's an existing session I just add to the existing session or I create a new session." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: menu bar menu → Reopen Last Discarded / Reopen Discarded… → editor; build main v0.9.0
- Broken: Nielsen 1 and 5 (a hidden mode change); working memory
- Code: `src/main.ts` `openEditor` calls `setActive(session)` unless replacing; `reopen` passes the old session
- Screenshots: none
- Earlier IDs: none
- Other products: none noted
- Seen by: 1-27 (script output: `active before reopen: Session B`, `active after reopen: Session A`). Related: F011, F008.
- Guideline: none accepted yet (rule area: confirmation and undo; remembered state)

</details>

### F011 · "Reopen Last Discarded" does two different things and does not say what it will bring back

- **Impact:** Medium · The reviewer cannot tell from the menu which screenshot will come back, from which session, or what will happen to it.
- **Current experience:** The item reads "Reopen Last Discarded", with no name, time or picture, next to "Reopen Discarded…". If the last thing was a screenshot closed without saving, it opens the editor with its marks, and it is added only on "Add to session". If it was a screenshot removed from a session, it goes straight back into that session, a notification says "Screenshot 1 is back in …", and the session window opens.
- **Visual:** No screenshot: native menu. Wording:

  | Where                     | Before                  | After                                                           |
  | ------------------------- | ----------------------- | --------------------------------------------------------------- |
  | Menu                      | "Reopen Last Discarded" | "Reopen Last Discarded", sublabel "closed 14:05 · 28 Sep 14.32" |
  | Menu (removed screenshot) | "Reopen Last Discarded" | "Put Back Screenshot 3 in 28 Sep 14.32"                         |

- **Recommendation:** Name what comes back in the item itself, by time and session in a sublabel (the way Capture Same Area shows its size), and say whether it reopens the editor or puts the screenshot back.
- **Tradeoff:** A longer menu line, or one more line, while something is in Discarded.
- **Decision needed:** Should the menu name what Reopen Last Discarded will bring back, and where it goes?
- **Verified:** read in the code; the removed-screenshot path seen in a script run on the build.
- **Owner's words:** "A user doesn't understand: he clicks on buttons and he doesn't know what they mean" — 2026-09-26. "I just wonder if we should introduce a shortcut with Escape and be able to recover it so nothing ever gets lost." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: menu bar menu, "Reopen Last Discarded"; build main v0.9.0
- Broken: Nielsen 6 (recognition), 1; mental model
- Code: `src/menu.ts:83`, `src/main.ts:358-369`, `553-556`
- Screenshots: none
- Earlier IDs: none
- Other products: none noted
- Seen by: 2-15, 4-33 (Low; sublabel with time and session). Related: F010, F006, F174, F223.
- Guideline: none accepted yet (rule area: confirmation and undo)

</details>

### F012 · "Open Session" still does not say what opens

- **Impact:** Medium · A first-time user expects a file to open in another app, as it once did; the item now opens Snapmark's own session window, and nothing in the menu says so.
- **Current experience:** Under "Current Session: 28 Sep 14.32 · 3 screenshots" the first item is "Open Session". It opens a window titled "2026-09-28 14.32 — Snapmark" with the tabs "Document" and "Screenshots". The owner asked what "Open Session" means on 2026-09-25; the label is unchanged.
- **Visual:** No screenshot: native menu. Wording:

  | Where | Before         | After                                            |
  | ----- | -------------- | ------------------------------------------------ |
  | Menu  | "Open Session" | "View Session", sublabel "screenshots and notes" |

- **Recommendation:** Say what the reviewer gets: the session's screenshots and notes, in Snapmark. "View" also tells it apart from "Open in Markdown App" inside the window.
- **Tradeoff:** "View" undersells that the document is editable, and a sublabel adds a line to a menu the owner calls verbose. Alternative: "Show Session Window", which names the surface rather than what is in it.
- **Decision needed:** Should "Open Session" become "View Session" (or "Show Session Window")?
- **Verified:** read in the code (menu printed).
- **Owner's words:** "Can you optimise this dropdown? It looks terrible. The Open Session, Copy Session: what does "Open Session" even mean? The whole thing doesn't even say what it is. The order of the menu just doesn't make sense." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: menu bar menu, current-session group; build main v0.9.0
- Broken: Nielsen 2; writing (buttons name the action and its object)
- Code: `src/menu.ts:90`, `src/main.ts:552`
- Screenshots: none
- Earlier IDs: none
- Other products: none noted
- Seen by: 4-27. Related: F228.
- Guideline: none accepted yet (rule area: dialogs, menus and popovers)

</details>

### F013 · Switch Session lists bare names, with no screenshot counts

- **Impact:** Low · Choosing a session to go back to, the reviewer cannot tell the empty one left by a mis-pressed New Session from the one with twelve screenshots, and must remember which dated name is which.
- **Current experience:** The submenu lists up to 20 sessions by last use, each as a short name ("28 Sep 09.12", "Checkout redesign", "27 Sep 17.40") with a tick on the current one, then "Other Session…". The count is known to the menu but shown only in the header for the current session; renamed sessions lose their date; empty sessions look like full ones.
- **Visual:** No screenshot: native menu (built from its data). Wording:

  | Where                     | Before              | After                                                            |
  | ------------------------- | ------------------- | ---------------------------------------------------------------- |
  | Switch Session row        | "Checkout redesign" | "Checkout redesign · 12" (or sublabel "12 screenshots · 27 Sep") |
  | Switch Session row, empty | "27 Sep 17.40"      | "27 Sep 17.40 · empty"                                           |

- **Recommendation:** Add the screenshot count (and the date for renamed sessions) to every row, the way the header already shows the count.
- **Tradeoff:** Longer or taller rows in a menu the owner already finds verbose.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code (menu built as data for a three-session state).
- **Owner's words:** "Also the menu is still fucking the bows, and there are so many submenus and everything, and the language is shit. Can you fucking audit this and implement the recommendations? I want easy language and it to follow the laws of ux. also the menu is fucking verbose" — 2026-09-26. "The Open Session, Copy Session: what does "Open Session" even mean? The whole thing doesn't even say what it is." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: menu bar menu → Switch Session; build main v0.9.0
- Broken: Nielsen 6, 8; working memory; rule area lists and selection
- Code: `src/menu.ts:102-112` (label only; `count` is in `SessionInfo` but unused there); `src/main.ts:428`; `src/sessions.ts:27, 88-91`
- Screenshots: 6-menu-built-vs-proposal.png (top level only)
- Earlier IDs: none
- Other products: none noted
- Seen by: 3-32, 6-61, 7-36 [counts and dates part], 8-04 [no counts or dates part; Medium as a whole] (seen by 3 evaluators). Removing empty sessions automatically is part of F225 and F176. Related: F004, F225.
- Guideline: none accepted yet (rule area: lists and selection)

</details>

### F014 · An empty current session is shown without a count

- **Impact:** Low · The reviewer cannot tell an empty session from one whose count failed to show, which matters right after a mis-pressed New Session.
- **Current experience:** With screenshots the header reads "Current Session: 28 Sep 14.03 · 7 screenshots"; when the session is empty the count is simply dropped: "Current Session: 28 Sep 14.03".
- **Visual:** No screenshot: native menu. Wording:

  | Where                      | Before                          | After                                   |
  | -------------------------- | ------------------------------- | --------------------------------------- |
  | Menu header, empty session | "Current Session: 28 Sep 14.03" | "Current Session: 28 Sep 14.03 · empty" |

- **Recommendation:** Always state the count, "empty" included.
- **Tradeoff:** None worth naming.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code (menu drawn from its data).
- **Owner's words:** "I want you to use the fucking new X, your X thing, to make it clear what's currently on." — 2026-09-26

<details><summary>Supporting notes</summary>

- Where: menu bar menu header, empty current session; build main v0.9.0
- Broken: Nielsen 1
- Code: `src/menu.ts:87-99`
- Screenshots: none
- Earlier IDs: none
- Other products: none noted
- Seen by: 6-62, 7-35 [header part] (seen by 2 evaluators). The copy-items part of 7-35 is F018. Related: F018, F020.
- Guideline: none accepted yet (rule area: feedback and notifications)

</details>

### F015 · Unavailable menu items are sometimes greyed and sometimes hidden; Export disappears while the session is empty

- **Impact:** Low · The reviewer cannot learn one rule for "not now", and a first-time user exploring an empty session cannot learn that export exists.
- **Current experience:** With an empty session "Export Session" is hidden while "Open Session", "Copy Prompt for AI" and the rest are shown; it appears after the first save. With no session, "Open Session" to "Show Session in Finder" are greyed. With no area yet "Choose New Area…" is hidden; with nothing discarded both Reopen items are hidden; in a development build "Open at Login", "Sessions Folder…" and "Check for Updates…" are greyed.
- **Visual:** `shots/1-menu-first-run.png`, `shots/1-menu-full.png` (rendered from the menu's data).
- **Recommendation:** One rule: items that belong to the menu's fixed structure are greyed when unavailable, with a reason where useful ("Export Session", sublabel "Add a screenshot first"); items that exist only in a rare state (an update waiting) are added at the bottom.
- **Tradeoff:** A few more greyed rows in early states.
- **Decision needed:** Should unavailable items in the menu's fixed structure be greyed rather than hidden (decided together with keeping menu positions stable)?
- **Verified:** read in the code (menu data for four states).
- **Owner's words:** "The order of the menu just doesn't make sense." — 2026-09-25. "Also I wonder what the best way of making this portable is: being able to share this as a PDF or zip it, maybe both." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: menu bar menu, all states; build main v0.9.0
- Broken: Nielsen 4; Shneiderman error prevention ("grey out what cannot be done now")
- Code: `src/menu.ts` `visible:` vs `enabled:` per item; `src/menu.ts:95-100` (`visible: !!cur?.count` for Export)
- Screenshots: 1-menu-first-run.png, 1-menu-full.png
- Earlier IDs: menu audit 2026-09-26 M09 (the disabled Export ▸ was then shown; the fix went to hiding, which created this inconsistency)
- Other products: none noted
- Seen by: 1-34, 6-10. Related: F005.
- Guideline: none accepted yet (rule area: dialogs, menus and popovers)

</details>

### F016 · "Reopen Discarded…" and "Show Session in Finder" share one folder icon

- **Impact:** Low · Two different actions look alike in the menu: one opens a chooser of discarded items, the other opens Finder.
- **Current experience:** "Reopen Discarded…" in the top block and "Show Session in Finder" in the session block both carry the same folder icon.
- **Visual:** `shots/1-menu-full-annotated.png` ("same icon", rendered from the menu's data); `shots/6-menu-built-vs-proposal.png`.
- **Recommendation:** Give the recovery item its own icon (or drop the item from the menu if recovery moves elsewhere).
- **Tradeoff:** None worth naming.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code (icon sheet checked).
- **Owner's words:** "I want you to use the fucking new X, your X thing, to make it clear what's currently on." — 2026-09-26

<details><summary>Supporting notes</summary>

- Where: menu bar menu, Reopen Discarded… and Show Session in Finder; build main v0.9.0
- Broken: law of similarity (one icon, two actions)
- Code: `src/menu.ts:83-84, 94` (both use `icon('finder')`); icon sheet in `assets/`
- Screenshots: 1-menu-full.png, 1-menu-full-annotated.png, 6-menu-built-vs-proposal.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 1-03 [icon part], 6-08 [icon part]. Related: F006.
- Guideline: none accepted yet (rule area: dialogs, menus and popovers)

</details>

### F017 · "(shortcut unavailable)" in the menu gives no reason and no way out

- **Impact:** Low · The reviewer learns that a key is dead but not why, or what to do about it.
- **Current experience:** When another app holds a key, the menu shows "Capture Screenshot (shortcut unavailable)", "Capture Same Area (shortcut unavailable)" or "New Session (shortcut unavailable)".
- **Visual:** No screenshot: native menu. Wording:

  | Where | Before                                      | After                                                       |
  | ----- | ------------------------------------------- | ----------------------------------------------------------- |
  | Menu  | "Capture Screenshot (shortcut unavailable)" | "Capture Screenshot", sublabel "⌃⇧1 is used by another app" |

- **Recommendation:** Keep the label clean and say the reason in the sublabel; if the keys become changeable, point the sublabel there.
- **Tradeoff:** None worth naming.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code (menu printed for that state).
- **Owner's words:** "I want easy language and it to follow the laws of ux. also the menu is fucking verbose" — 2026-09-26

<details><summary>Supporting notes</summary>

- Where: menu bar menu, the three shortcut items; build main v0.9.0
- Broken: Nielsen 9; writing (no system words)
- Code: `src/menu.ts:60-62`
- Screenshots: none
- Earlier IDs: none
- Other products: none noted
- Seen by: 4-23, 6-04 [menu label part; sublabel "No shortcut: another app uses ⌃⇧1"]. Related: F021, F173, F158.
- Guideline: none accepted yet (rule area: feedback and notifications)

</details>

### F018 · "Copy Prompt for AI" works on an empty session

- **Impact:** Low · A reviewer can paste a prompt that points the agent at a file holding only a title; the agent reports "nothing to do" and a round trip is lost.
- **Current experience:** With a current session and no screenshots the header reads "Current Session: 28 Sep 09.12" (no count), and "Open Session", "Copy Prompt for AI" and "Copy session.md Path" are all enabled, while "Export Session" is hidden.
- **Visual:** No screenshot: native menu (menu data).
- **Recommendation:** Grey the copy items until the first screenshot, the way Export is already unavailable.
- **Tradeoff:** None worth naming.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: menu bar menu, empty current session; build main v0.9.0
- Broken: Shneiderman (grey out what cannot be done now); Nielsen 5
- Code: `src/menu.ts:87-99`
- Screenshots: none
- Earlier IDs: none
- Other products: none noted
- Seen by: 7-35 [copy items part]. Related: F014, F015.
- Guideline: none accepted yet (rule area: dialogs, menus and popovers)

</details>

### F019 · "Show Session in Finder" opens the folder instead of showing it in Finder

- **Impact:** Low · On a Mac "Show in Finder" means "open the enclosing folder with this item selected"; here the reviewer lands inside the session folder, not beside its sibling sessions.
- **Current experience:** "Show Session in Finder" opens a Finder window of "2026-09-28 14.32" itself, showing its session.md and img folder.
- **Visual:** No screenshot: native menu and Finder. Wording:

  | Where | Before                   | After (keep the behaviour) | After (keep the label)                                                |
  | ----- | ------------------------ | -------------------------- | --------------------------------------------------------------------- |
  | Menu  | "Show Session in Finder" | "Open Session Folder"      | "Show Session in Finder", selecting the folder in the sessions folder |

- **Recommendation:** Make the label and the behaviour agree. Opening the folder is what the reviewer usually needs (to drag an image out), so rename the item "Open Session Folder".
- **Tradeoff:** Renaming moves away from the macOS phrase the owner already knows.
- **Decision needed:** Should the item keep opening the folder and be called "Open Session Folder", or keep its name and select the folder in Finder?
- **Verified:** read in the code.
- **Owner's words:** "Also it's not clear that you can only rename the current session and show the current session in Finder but it's not clear what's happening." — 2026-09-26

<details><summary>Supporting notes</summary>

- Where: menu bar menu, current-session group; build main v0.9.0
- Broken: rule area platform conventions; Jakob's law
- Code: `src/menu.ts:94`, `src/main.ts:558` (`shell.openPath`, not `showItemInFolder`)
- Screenshots: none
- Earlier IDs: none
- Other products: none noted
- Seen by: 4-28.
- Guideline: none accepted yet (rule area: platform conventions)

</details>

## Global shortcuts

### F020 · New Session sits on ⌃⇧2, between the two capture keys, so a slip moves the rest of the review into a new session

- **Impact:** High · Reviewing an overnight build, the reviewer presses ⌃⇧1 and ⌃⇧3 dozens of times; one slip onto the key between them starts a new session, the capture they wanted never happens, and every later capture lands in the new session, so the agent is handed half the review.
- **Current experience:** ⌃⇧1 is "Capture Screenshot", ⌃⇧3 is "Capture Same Area", and ⌃⇧2, between them, is "New Session". The menu lists them 1, 3 and, eight rows lower, 2; the Keyboard Shortcuts window lists them 1, 3, 2. With screenshots in the current session, ⌃⇧2 creates "2026-09-28 14.40", makes it current and shows one notification, "New session: 2026-09-28 14.40", which fades after a few seconds and does not appear at all with notifications off or a Focus on. Nothing is captured. The next ⌃⇧1 opens the editor with a grey "→ 2026-09-28 14.40" in its top right corner, "Add to session" files it there, and "Copy Prompt for AI" now points at the new, nearly empty session. There is no undo: getting back means the menu, "Switch Session", and telling "28 Sep 14.02" from "28 Sep 14.40" by the minute. Screenshots already added to the new session cannot be moved, and the empty session stays in the list.
- **Visual:** `shots/4-shortcuts-window-annotated.png` (the app's own list: ⌃⇧1 Capture region, ⌃⇧3 Capture same area, ⌃⇧2 New session); `shots/1-menu-full-annotated.png` (the menu order 1, 3 … 2). Proposal: `shots/4-proposal-new-session-keys.png`. The slip, step by step:

  | Step | What the reviewer does                        | What happens                                                                                  |
  | ---- | --------------------------------------------- | --------------------------------------------------------------------------------------------- |
  | 1    | Reviewing, 6 screenshots in "Checkout review" | —                                                                                             |
  | 2    | Reaches for ⌃⇧3, hits ⌃⇧2                     | a new empty session is created and made current; notification "New session: 2026-09-28 14.03" |
  | 3    | Presses ⌃⇧3 four more times, saves each       | screenshots 7–10 go to the new session as its 1–4                                             |
  | 4    | Copies the prompt for the agent               | the prompt points at the new session: four screenshots, not ten                               |

- **Recommendation:** Take the global shortcut off New Session. Starting a session happens once per piece of work; capturing happens many times a minute, and the rare action that changes where everything goes should never be the easiest one to hit by accident. New Session stays in the menu.
- **Tradeoff:** No instant key for a new session: a reviewer who starts a fresh session mid-flow goes through the menu, which bends the owner's rule that everything is done on the fly with keys. Alternatives from the evaluators: (a) move Capture Same Area to ⌃⇧2, so the two captures sit side by side and a slip between them costs one Esc; this means relearning ⌃⇧3 a day after it shipped; (b) leave ⌃⇧2 unassigned as a buffer, keep ⌃⇧1 and ⌃⇧3 exactly as they are (nothing to relearn); (c) if New Session keeps a key, give it one away from the digits: ⌃⇧N, ⌃⇧0, or ⌃⌥⇧N (a modifier the capture keys do not share), or leave it unassigned by default and let the reviewer set one; each takes that combination from every other app while Snapmark runs; (d) keep ⌃⇧2 but make it a double press ("Press ⌃⇧2 again to start a new session"): safe, but an invisible mode and slower when meant; (e) keep ⌃⇧2 and only add a way back, an Undo in the notification: the cheapest change, but every slip still loses the capture and relies on a notification the reviewer may not see. The way back is worth having whichever key is chosen.
- **Decision needed:** Should New Session lose its global key, and if a key stays, which one (⌃⇧N, ⌃⇧0, ⌃⌥⇧N, or one the reviewer sets)? Should Capture Same Area then move to ⌃⇧2, or ⌃⇧2 stay empty?
- **Verified:** read in the code (the global keys are not pressed in this audit); the editor's grey destination label seen on screen.
- **Owner's words:** "Also the new session is a very dangerous shortcut because it sits in between 1 and 2." — 2026-09-28. "This is also important: when I create, as I said, it needs to be shortcuts so I can just do this on the fly." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: global shortcuts; menu "New Session ⌃⇧2"; Keyboard Shortcuts window; notifications; editor header; build main v0.9.0. What a mis-press costs today, state by state (read in `newSession()` and `openEditor()`):

  | When ⌃⇧2 is pressed             | What happens                                                                                                    | What it costs                                                                                                    |
  | ------------------------------- | --------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
  | Current session has screenshots | A new folder named by date and minute is created and made current; notification "New session: 2026-09-28 14.40" | The intended capture did not happen; every later capture and Copy Prompt for AI go to the new session            |
  | Current session is still empty  | No new session; notification "28 Sep 14.32 is still empty, so new captures keep going there."                   | A notification to read; the intended capture did not happen                                                      |
  | An editor is open (unsaved)     | That editor keeps the session it opened with; the next capture goes to the new session                          | Two screenshots taken a minute apart land in two sessions, and the editor header is the only place that shows it |
  | Pressed twice                   | The second press hits the "still empty" rule                                                                    | No stray empty sessions from double presses (the one guard that exists)                                          |

  Getting back: menu → Switch Session ▸, pick the previous session (second from the top, told apart only by the minute). Does New Session need a global key? It is used once per piece of work; the owner's "on the fly" request (2026-09-25) is met for capture by ⌃⇧1 and ⌃⇧3. The 2026-09-25 decision "keep ⇧⌘2 instant" was made when New Session sat apart from a single capture key; Capture Same Area (v0.9.0) put it between two. Clashes of the candidates: ⌃⇧N and ⌃⇧0 are not in Chrome's published macOS shortcuts (⌘1–⌘9 for tabs, ⌃⇧PgUp/PgDn to move tabs) or Figma's (its one ⌃⇧ shortcut is ⌃⇧? for the shortcut panel); a global shortcut takes the combination from every app regardless.

- Broken: Nielsen 5 (error prevention), 3 (no undo), 1 (notification only), 4; Shneiderman error prevention and easy reversal; Fitts's law (the rare, costly target is the nearest neighbour of the frequent ones); Pareto principle; law of proximity; serial position (menu order 1, 3 … 2); selective attention (feedback where the reviewer is not looking); cognitive bias, flow; rule area keyboard and focus
- Code: `src/main.ts:31-33` (the three keys), `:110-116` (`newSession`, refuses only when the current session is empty), `:191-203` (an editor takes the current session when it opens), `:585-592` (registration), `showShortcuts` rows; `src/menu.ts:113`; no delete-session function anywhere in `src/`
- Screenshots: 4-shortcuts-window-annotated.png, 4-proposal-new-session-keys.png, 4-editor-strings.png, 1-menu-full-annotated.png, 1-shortcuts-window-full.png, 7-main-editor.png, 7-main-editor-annotated.png
- Earlier IDs: F132 (2026-09-25, empty sessions from repeated presses, since fixed by reusing an empty session)
- Other products: macOS Screenshot binds only capture modes (⌘⇧3, ⌘⇧4, ⌘⇧5), nothing destructive in that row; CleanShot X puts only capture modes on its default keys and leaves history and settings keyless; Shottr likewise binds only capture modes; none has a global key that changes where captures go; Xnapper documents configurable global shortcuts
- Seen by: 1-04 (Capture Same Area to ⌃⇧2, New Session menu only or a far key), 4-01 (⌃⇧2 left empty, ⌃⇧1/⌃⇧3 unchanged, New Session menu only or ⌃⇧N; alternatives double press, only a way back), 6-01 (no key, or ⌃⇧0 / ⌃⇧N with Undo in the notification; frees ⌃⇧2 for Capture Same Area), 7-01 (no key, or ⌃⌥⇧N with Undo in the notification), 8-01 (no default key; optional configurable one with an easy way back) (seen by 3 evaluators). Related: F176 (Undo in the notification), F060 (destination label in the editor), F061, F139, F225, F013, F021.
- Guideline: none accepted yet (rule area: keyboard and focus)

</details>

### F021 · The global shortcuts cannot be changed, so a key another app has taken is lost for good

- **Impact:** Medium · A reviewer whose ⌃⇧1, ⌃⇧2 or ⌃⇧3 is already used by another app (a window manager, a launcher, a clipboard tool), or whose fingers keep hitting the wrong one, loses the on-the-fly route, and the only fix is a new build.
- **Current experience:** The three keys are fixed. When another app holds one, a notification at launch says so once, and the menu then shows "Capture Screenshot (shortcut unavailable)". Settings holds "Open at Login", "Sessions Folder…", "Keyboard Shortcuts" (a read-only list) and "Check for Updates…"; nothing lets the reviewer pick another key or turn one off.
- **Visual:** No screenshot: menu and notification states read in the code. Proposal in words: Settings ▸ "Keyboard Shortcuts…" shows a recorder field next to Capture Screenshot, Capture Same Area and New Session ("Click and press new keys"); a clash shows "Used by another app" beside the field; each field can be set to none.
- **Recommendation:** Let the reviewer record their own key for each global action in the Keyboard Shortcuts window, including none, and let the "taken" notification and the menu's unavailable state lead there.
- **Tradeoff:** The first real settings screen, with a key recorder to build and test: recorded keys need checking against macOS's own and against other apps. Keys then differ between machines, so the keys named in the README and the hints are no longer universal. Alternatives from the evaluators: (a) fix only the wording of the notification and the menu for now and leave the keys fixed; (b) with a recorder in place, ship New Session with no key by default.
- **Decision needed:** Should the three global shortcuts be changeable in Snapmark, including turning one off?
- **Verified:** read in the code.
- **Owner's words:** "3. The shortcut Command-1 on Chrome changes the tab. How about we do something different?" — 2026-09-28. "This is also important: when I create, as I said, it needs to be shortcuts so I can just do this on the fly." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: global shortcuts; launch notification; menu; Settings ▸ Keyboard Shortcuts; build main v0.9.0
- Broken: Nielsen 7 (flexibility), 3, 9 (no way forward); Shneiderman "enable frequent users to use shortcuts"; Postel's law (accept the reviewer's key setup); checklist navigation 8
- Code: `src/main.ts:31-33` (fixed keys), `:585-592` (registration loop, notification on failure), `:441-445`, `:515-524` (Keyboard Shortcuts window); `src/menu.ts:60-62` ("(shortcut unavailable)" suffix), `:116-131` (Settings)
- Screenshots: none
- Earlier IDs: F183 (2026-09-25), still open
- Other products: CleanShot X, Shottr and Xnapper let every capture key be recorded in their settings; macOS Screenshot's keys are changed in System Settings ▸ Keyboard ▸ Keyboard Shortcuts ▸ Screenshots
- Seen by: 1-11 (recorder per row; notification opens it), 2-34 [no way to choose part], 4-24 (including "none"), 6-04 [recorder part; asks whether the wording fix is enough for now], 7-48 (New Session with no key by default), 8-28 [configuration part] (seen by 3 evaluators). Related: F017, F158, F173, F020.
- Guideline: none accepted yet (rule area: keyboard and focus)

</details>

### F022 · The capture keys sit one modifier away from macOS's own screenshot keys, with different meanings

- **Impact:** Medium · A reviewer whose fingers know macOS Screenshot and hits Command instead of Control, or the other way round, gets the other tool: a full-screen picture on the Desktop instead of an editor, or a Snapmark capture instead of a quick macOS one.
- **Current experience:** Control and Command sit next to each other. ⌃⇧3 is "Capture Same Area" in Snapmark, ⌘⇧3 is "whole screen to Desktop" in macOS, and ⌃⇧⌘3 is "whole screen to clipboard". The digits also mean different things: in macOS 4 is "a region", in Snapmark 1 is. The owner uses macOS Screenshot daily.
- **Visual:** No screenshot. The keys side by side:

  | Digit | macOS Screenshot (⌘⇧)   | Snapmark v0.9.0 (⌃⇧)            |
  | ----- | ----------------------- | ------------------------------- |
  | 1     | nothing                 | a region ("Capture Screenshot") |
  | 2     | nothing                 | New Session                     |
  | 3     | whole screen to Desktop | Capture Same Area               |
  | 4     | a region                | nothing                         |
  | 5     | the capture toolbar     | nothing                         |

- **Recommendation:** Settle the digits together with New Session's key. One way is to line them up with the meaning macOS gives them (region on ⌃⇧4, same area on ⌃⇧5, nothing on 3), so a Command/Control slip produces the same kind of capture.
- **Tradeoff:** Moving the keys again right after the owner learnt ⌃⇧1 and ⌃⇧3. The other evaluator sees no demonstrated problem, found no clash in Chrome's or Figma's published macOS shortcuts, and would keep today's keys and only name the neighbour in the Keyboard Shortcuts window ("not ⌘⇧3, which is macOS's own"), revisiting it if the keys become changeable.
- **Decision needed:** Should Snapmark's captures move to macOS's digits (region on ⌃⇧4, same area on ⌃⇧5), or keep ⌃⇧1 and ⌃⇧3 and only name the macOS neighbour in the list of keys?
- **Verified:** read in the code; the macOS key meanings are the platform's defaults, not tested here; Chrome's and Figma's published macOS shortcut lists checked.
- **Owner's words:** "3. The shortcut Command-1 on Chrome changes the tab. How about we do something different?" — 2026-09-28. "MacOsScreenshot, Figma, Ocra, Xnapper" — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: global shortcuts; build main v0.9.0
- Broken: Jakob's law, mental model; Nielsen 4 (platform consistency), 5 (error prevention)
- Code: `src/main.ts:30-33` (the comment records why ⌘ was dropped)
- Screenshots: none
- Earlier IDs: none
- Other products: CleanShot X can take over the ⌘⇧3/4/5 keys; Shottr and Xnapper use their own combinations and let you change them; Chrome's macOS list uses ⌘1–⌘9 for tabs and ⌃⇧PgUp/PgDn to move tabs; Figma's one ⌃⇧ shortcut is ⌃⇧? for the shortcut panel
- Seen by: 4-26 (Design choice; keep, mention the neighbour in the list of keys; revisit with changeable keys), 7-02 (Medium; region on ⌃⇧4, same area on ⌃⇧5, plus changeable keys). Related: F020, F021.
- Guideline: none accepted yet (rule area: platform conventions)

</details>

### F023 · "Reopen Last Discarded" has no key

- **Impact:** Low · Discarding is one key (⌘W or Esc); getting the screenshot back is two clicks in the menu bar, although the owner asked for recovery as quick as discarding.
- **Current experience:** "Reopen Last Discarded" appears in the menu once something was discarded. It has no key, and it is not in the Keyboard Shortcuts window.
- **Visual:** No screenshot: native menu. Proposal in words: menu "Reopen Last Discarded ⌃⇧Z" (a global key), or ⇧⌘T while an editor or the session window is in front (the browser habit for "reopen closed tab").
- **Recommendation:** Give Reopen Last Discarded a key, shown in the menu and in the list of keys.
- **Tradeoff:** A global key takes one more combination from every app; a key inside Snapmark works only while a Snapmark window is in front, which it is not right after a discard.
- **Decision needed:** Should Reopen Last Discarded get a key, and should it work everywhere or only inside Snapmark?
- **Verified:** read in the code.
- **Owner's words:** "I just wonder if we should introduce a shortcut with Escape and be able to recover it so nothing ever gets lost. I think that would be nice." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: menu bar menu, "Reopen Last Discarded"; Keyboard Shortcuts window; build main v0.9.0
- Broken: Nielsen 3, 7; Shneiderman easy reversal
- Code: `src/menu.ts:83`
- Screenshots: none
- Earlier IDs: none
- Other products: Chrome and Safari reopen a closed tab with ⇧⌘T
- Seen by: 4-25. Related: F011, F006, F020.
- Guideline: none accepted yet (rule area: keyboard and focus)

</details>

### F024 · No key opens Snapmark's menu

- **Impact:** Low · A keyboard-only reviewer reaches Open Session, Copy Prompt for AI and Export only through macOS's ⌃F8 (status menus) and then the arrow keys past every other menu bar icon; nothing in Snapmark opens its own menu.
- **Current experience:** The three global keys capture, capture the same area and start a session. Everything else (open, copy, export, switch, settings) is in the menu, which opens on a click of the menu bar icon. Once open, the menu works fully with the keyboard and VoiceOver.
- **Visual:** No screenshot: native menu.
- **Recommendation:** Add a global key that opens the Snapmark menu (for example ⌃⇧0, clear of the capture keys), shown in the Keyboard Shortcuts window.
- **Tradeoff:** Another global key to remember and to clash with other apps, on the row the owner is already wary of.
- **Decision needed:** Should a global key open the Snapmark menu, and which one?
- **Verified:** read in the code.
- **Owner's words:** "This is also important: when I create, as I said, it needs to be shortcuts so I can just do this on the fly." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: menu bar icon and menu; build main v0.9.0
- Broken: none strictly (WCAG 2.2 2.1.1 is met through the platform's ⌃F8 and the native menu); rule area keyboard and focus (a keyboard route for every pointer action)
- Code: `src/main.ts:577-592` (the icon opens on click and right-click; three `globalShortcut.register` calls), `src/menu.ts:68-133`
- Screenshots: none
- Earlier IDs: none
- Other products: none noted
- Seen by: 5-45. Related: F025, F020.
- Guideline: none accepted yet (rule area: keyboard and focus)

</details>

### F025 · Handing the session to the agent needs the mouse

- **Impact:** Design choice · Capture and marking are all keys, but the last step of every review (copy the prompt, paste it into the agent) needs a click on the menu bar icon and a click on an item.
- **Current experience:** The hand-off is: click the menu bar icon · click "Copy Prompt for AI" · switch to the agent · ⌘V. Three of the four steps are pointer steps; no key opens the menu or copies the prompt.
- **Visual:** No screenshot: native menu.
- **Recommendation:** Give the copy item a global key only if the owner wants the whole loop keyboard-only; it is used once per review, so the menu may be enough. If a key is added, keep it away from the capture keys.
- **Tradeoff:** One more global key to remember and to collide with other apps. A decision recorded on 2026-09-25 gave the copy item no global key.
- **Decision needed:** Should copying the session for the agent have a key?
- **Verified:** read in the code.
- **Owner's words:** "This is also important: when I create, as I said, it needs to be shortcuts so I can just do this on the fly." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: menu → "Copy Prompt for AI"; build main v0.9.0
- Broken: Shneiderman shortcuts for frequent users; Nielsen 7; project rule "everything doable on the fly with shortcuts"
- Code: `src/main.ts:585-592` (three global keys; none for copying)
- Screenshots: none
- Earlier IDs: decision 2026-09-25 "Menu: no global shortcut for "Copy prompt for AI""
- Other products: none noted
- Seen by: 6-63. Related: F001, F024, F020.
- Guideline: none accepted yet (rule area: keyboard and focus)

</details>

## Capture region and full-screen apps

### F026 · Capturing from a full-screen browser sends the reviewer to the desktop and leaves the editor behind

> **Fixed in v0.9.1** ([#48](https://github.com/cdudek/snapmark/pull/48)): the editor now opens over the full-screen app and the reviewer stays there. The entry is kept as audited on v0.9.0.

- **Impact:** High · The main scene (reviewing an overnight build) usually runs in a full-screen browser, and on its most frequent path every capture costs a trip to another Space and back: ten trips in a ten-screenshot review, and the first time it looks as if the capture failed.
- **Current experience:** The reviewer has Chrome in full screen, presses ⌃⇧1 and drags a region; macOS's capture overlay and Snapmark's area picker both work over the full-screen browser. Then the Mac slides to the desktop. The owner reports, and one reading of the code agrees, that the desktop shows no editor: the editor is open on Chrome's full-screen Space, where the reviewer just was, so they swipe back (three fingers, or ⌃→), find the editor over the browser, mark, press ⌘↵, and are back on the browser. The other reading of the code has the editor shown on the desktop Space, centred, with the browser left behind, and the reviewer still on the desktop after "Add to session", because nothing hands them back to the browser (not checked: macOS may return to the browser on its own). Either way the reviewer leaves the page for every capture. Reopening a closed capture from Discarded opens the same editor and has the same problem.
- **Visual:** `shots/2-fullscreen-today.png` (a diagram of the two Spaces drawn from the code and the owner's report, not a screenshot: no full-screen window was created in this audit). Proposal: `shots/2-fullscreen-proposal.png` (labelled "Proposal").
- **Recommendation:** Open the editor on the Space where the capture was taken, over the full-screen app, the way the area picker already does, and after save or discard hand focus back to the app that was in front before the capture. The rule for the whole flow: a capture never moves the reviewer to another Space. Check the result on a real full-screen browser before settling on a way to build it.
- **Tradeoff:** An editor floating over the full-screen page hides the page while marking. A window allowed over full-screen apps follows the reviewer to every Space until it closes, unless it is pinned back to its Space after it opens, which needs checking on macOS. The Dock icon the owner asked for would not appear while the editor sits over a full-screen app (the Dock is hidden there anyway). Alternative: open the editor on the desktop on purpose and bring the reviewer back to the browser's Space after "Add to session"; that keeps the Dock icon but costs two Space slides per capture.
- **Decision needed:** Should the editor open on top of the full-screen app the capture came from (with no Dock icon while it is there) and hand the reviewer back to that app after saving, or open on the desktop with Snapmark taking the reviewer back after "Add to session"?
- **Verified:** read in the code; the owner's report and the audit lead's stand-in test (macOS showed the desktop while the editor was not on the visible screen) agree. Not reproduced in this audit: no full-screen window was created.
- **Owner's words:** "When I take a screenshot it's going to the desktop but the actual window stays at the full screen browser. This is something we should fix." — 2026-09-28. "For whatever reason in full screen mode, the app switches to the desktop but the actual window stays where I took the screenshot." — 2026-09-28. On the Dock icon: "when the window is open there's no icon or anything at the bottom to show that it's open." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: the editor opened by Capture Screenshot (⌃⇧1 or the menu) from a full-screen app's Space; also Reopen Last Discarded for a closed capture, which uses the same editor; build main v0.9.0
- Broken: Nielsen 1 (visibility of system status), 3 (user control: the reviewer loses their place); Shneiderman closure; Laws of UX: flow, Doherty threshold (each Space slide is an animation of about a second), selective attention (the editor is where the reviewer is not looking), peak-end rule, Jakob's law (macOS Screenshot's markup stays on the current Space); Maze: limitations in the journey; checklist navigation 5 (a way back)
- Code: `src/main.ts:191-213` (`openEditor`: `new BrowserWindow(...)` shows at once, no `show: false`, while the Dock icon is hidden by `app.dock.hide()` at launch, line 573, and whenever no window is open, line 60; then `updateDock()` calls `app.dock.show()`, lines 60 and 204, and `app.focus({ steal: true })`, line 211); the area picker at `:165-167` uses `setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true, skipTransformProcessType: true })`, the editor uses nothing of the kind; `:246-258` (closes after save and gives focus back to nobody); `:367` (Reopen Last Discarded goes through `openEditor`); `:118-127`, `:133-184`. The source Space is never recorded.
- Mechanism (from the code, Electron's documentation and the owner's report; the exact macOS rule is an assumption): an app without a Dock icon may show windows over a full-screen app; when it becomes a Dock app and takes focus, macOS moves to a desktop Space for it. Electron documents that the skip flag exists because transforming the process type disturbs windows and the Dock.
- Where the editor ends up, as each evaluator read it: 1-13 and 2-01 (with the owner's report): the reviewer lands on the desktop, the editor stays on the browser's full-screen Space, and after saving the reviewer is back on the browser only because they swiped back to it. 6-13 and 7-07: the editor is shown on a desktop Space, and after saving the reviewer is left on the desktop (6-13 marks this as an assumption). 8-06: no source Space or return target is recorded at all.
- Screenshots: 2-fullscreen-today.png, 2-fullscreen-proposal.png (diagrams)
- Earlier IDs: none
- Other products: macOS Screenshot's floating thumbnail and Markup open over the full-screen app on the current Space; CleanShot X's Quick Access overlay and annotate window appear over full-screen apps; Shottr's changelog describes opening on the captured display and in the active Space (documented behaviour, not tested here)
- Seen by: 1-13 (structure side: a capture never moves the reviewer to another Space), 2-01 (owns the root cause; alternative: open on the desktop on purpose and bring the reviewer back), 6-13 [⌃⇧1 path part] (floating panel over the browser; hand focus back after save or discard), 7-07 [editor and return part] (called it routine because the owner already asked; it is a behaviour change with a real choice, so it is a decision here), 8-06 (one window-management flow; test real Spaces transitions before choosing an implementation) (seen by 3 evaluators). Audit lead's stand-in test cited by 2-01. Related: F027, F029, F030, F031, F033, F066.
- Guideline: none accepted yet (rule area: windows and Spaces)

</details>

### F027 · Capture Same Area from a full-screen browser strands the editor on every press, and a press before swiping back captures the desktop

> **Fixed in v0.9.1** ([#48](https://github.com/cdudek/snapmark/pull/48)): the editor now opens over the full-screen app and the reviewer stays there. The entry is kept as audited on v0.9.0.

- **Impact:** High · The flow the owner asked for, the same area captured again and again, is the one most likely to run in a full-screen browser, and it sends the reviewer away from the page on every press; from the second press on it can capture the wrong Space.
- **Current experience:** The first ⌃⇧3 dims the full-screen browser and shows "Drag over the area to capture. ⌃⇧3 captures it again each time. Esc cancels." right there, without leaving the browser. After the drag the capture is taken and the Mac slides to the desktop, with the editor left behind as for a normal capture. Every later ⌃⇧3 captures at once, with no picker, and strands the editor again: ten captures of the same area are ten trips to the desktop and back. The area is a fixed rectangle of the screen, so if the reviewer presses ⌃⇧3 before swiping back to the browser, it captures that rectangle of the desktop, not the page.
- **Visual:** `shots/2-fullscreen-today.png` (the Capture Same Area path, a diagram); `shots/2-area-picker.png` (the picker's own window, the one Snapmark surface that already stays on a full-screen Space).
- **Recommendation:** Apply the same change as for a normal capture to the editor that Capture Same Area opens, so ten captures in a row stay on the browser from start to end. The picker already shows how.
- **Tradeoff:** The same as for the editor over full-screen apps: an editor over the page hides it while marking, and a window allowed over full-screen apps must be kept from following the reviewer to other Spaces.
- **Decision needed:** Should the editor that Capture Same Area opens follow whatever is decided for the editor over full-screen apps, so repeated captures never leave the browser?
- **Verified:** read in the code, plus the owner's report; the picker's own window seen on screen (not over a full-screen app).
- **Owner's words:** "How about a specific area? I will have the browser open and I will select and mark a certain area. For every screenshot that I take I may want to record the same area." — 2026-09-28. "When I take a screenshot it's going to the desktop but the actual window stays at the full screen browser. This is something we should fix." — 2026-09-28

<details><summary>Supporting notes</summary>

- Where: ⌃⇧3 / Capture Same Area from a full-screen app, the first time (picker, then capture) and every later time (capture only); build main v0.9.0
- Broken: Nielsen 1, 3; Laws of UX: flow, Zeigarnik effect (the unfinished editor is out of sight), Pareto principle (the repeated path is the costly one); Maze: limitations in the journey
- Code: `src/main.ts:133-147` (`captureArea` → `shoot(['-R', …])` → `openEditor`); the picker at `:151-187` uses `setAlwaysOnTop(true, 'screen-saver')` and `setVisibleOnAllWorkspaces(…, visibleOnFullScreen: true, skipTransformProcessType: true)`, then `app.focus({ steal: true })` while Snapmark is still without a Dock icon; the picker closes, Snapmark waits 200 ms, then follows the normal capture path
- Screenshots: 2-fullscreen-today.png, 2-area-picker.png
- Earlier IDs: none
- Other products: see the editor over full-screen apps
- Seen by: 2-02 (called it routine once the editor question is decided; kept as a question here so it is decided with it), 6-13 [desktop captured part], 7-07 [desktop captured part] (seen by 2 evaluators). Flow checked: "capture the same area ten times in a row". Related: F026, F033, F037, F032.
- Guideline: none accepted yet (rule area: windows and Spaces)

</details>

### F028 · A failed capture looks exactly like a cancelled one

- **Impact:** High · Reviewing an overnight build, a capture that fails gives the reviewer no explanation and no way to recover: they cannot tell a failure from their own Esc.
- **Current experience:** When a capture produces no picture, nothing opens and nothing is said. Snapmark treats every capture that ends without a picture as if the reviewer had pressed Esc, whatever the reason.
- **Visual:** No screenshot. Wording:

  | Where                  | Before  | After                                                                                       |
  | ---------------------- | ------- | ------------------------------------------------------------------------------------------- |
  | After a failed capture | nothing | "Capture failed. No screenshot was added." with "Try Again" and "Screen Recording Settings" |
  | After Esc              | nothing | nothing (stays quiet)                                                                       |

- **Recommendation:** Tell a cancelled capture from a failed one: stay quiet after Esc, and after a failure say that nothing was added, with a way to try again and a way to the permission setting.
- **Tradeoff:** Failures have to be told apart from cancelling; reporting every capture that ends without a picture would interrupt the reviewer who cancelled on purpose.
- **Decision needed:** Should a capture that fails for any reason other than Esc say so, with a way to try again?
- **Verified:** read in the code; a failing capture was not run.
- **Owner's words:** "I'm continuously getting asked to open my screen and system audio recording stuff to add Snapmark; however Snapmark already is activated so I think that's most likely a bug" — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: Capture Screenshot and Capture Same Area, the moment after the capture; build main v0.9.0
- Broken: Nielsen 9 (recognise, diagnose, recover), 1; Shneiderman informative feedback; selective attention, peak-end rule; writing
- Code: `src/main.ts:118-123` (the completion handler ignores the process error and treats a missing file as a cancel); no permission check in this path
- Screenshots: none
- Earlier IDs: none
- Other products: Apple's screenshot instructions treat Esc as a quiet cancel, which should stay
- Seen by: 8-07. Without Screen Recording permission macOS returns the wallpaper rather than failing, which is a separate finding. Related: F210.
- Guideline: none accepted yet (rule area: errors and recovery)

</details>

### F029 · With the session window open, a capture from a full-screen app takes the reviewer to the desktop and keeps them there

- **Impact:** Medium · A reviewer who keeps the session window open while capturing is moved off the browser on every capture and has to go back by hand after each save.
- **Current experience:** While the session window is open, Snapmark already has its Dock icon, and a new window of a Dock app cannot join another app's full-screen Space. So the editor opens on the desktop and Snapmark pulls the reviewer there. The editor is visible this time, but after "Add to session" it closes and the reviewer stays on the desktop with the session window, not on the browser they were reviewing.
- **Visual:** `shots/2-fullscreen-today.png` (third path, a diagram).
- **Recommendation:** Open the editor on the capture's Space whether or not another Snapmark window is open, and after saving leave the reviewer in the app and on the Space they captured from.
- **Tradeoff:** Remembering where each capture came from adds a little to every editor.
- **Decision needed:** Should saving always leave the reviewer in the app they captured from?
- **Verified:** read in the code; where macOS places the editor is an assumption, not checked.
- **Owner's words:** "When I take a screenshot it's going to the desktop but the actual window stays at the full screen browser." — 2026-09-28

<details><summary>Supporting notes</summary>

- Where: editor opened from a full-screen app while the session window is open; build main v0.9.0
- Broken: Nielsen 3; Laws of UX: flow, Jakob's law (the capture tools the owner uses leave you where you were)
- Code: `src/main.ts:60` (the Dock icon shows while any editor or session window is open), `:191-213`
- Screenshots: 2-fullscreen-today.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 2-04. Related: F026, F030.
- Guideline: none accepted yet (rule area: windows and Spaces)

</details>

### F030 · Open Session from a full-screen app slides to the desktop the same way

- **Impact:** Medium · Opening the session window while reviewing in a full-screen browser also slides to an empty desktop and leaves the window behind.
- **Current experience:** From a full-screen browser the reviewer opens the menu and picks "Open Session". The session window is created the same way as the editor (shown while Snapmark has no Dock icon, then the Dock icon turns on and Snapmark comes to the front), so the same slide to the desktop follows, with the window left on the browser's Space.
- **Visual:** `shots/2-fullscreen-today.png` applies unchanged (a diagram).
- **Recommendation:** Treat the session window like the editor. Here the alternative, opening it on the desktop on purpose and moving the reviewer there with it, is more defensible, because the session window is a place to read, not a quick step; what must go is the window being left behind.
- **Tradeoff:** A session window over a full-screen browser covers the page being reviewed.
- **Decision needed:** Should the session window open over the full-screen app, or on the desktop with the Mac moving there with it?
- **Verified:** read in the code; not seen (no full-screen window was created).
- **Owner's words:** "For whatever reason in full screen mode, the app switches to the desktop but the actual window stays where I took the screenshot." — 2026-09-28

<details><summary>Supporting notes</summary>

- Where: menu → Open Session from a full-screen app; build main v0.9.0
- Broken: Nielsen 1, 3
- Code: `src/main.ts:266-297` (`openViewer`: `new BrowserWindow` shown at once, `updateDock()` line 283, `app.focus({ steal: true })` line 295). The Keyboard Shortcuts window (line 534) does not turn the Dock icon on, so it most likely does not move Spaces (assumption).
- Screenshots: 2-fullscreen-today.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 2-05. Related: F026, F029.
- Guideline: none accepted yet (rule area: windows and Spaces)

</details>

### F031 · While the editor is stranded on another Space, typed keys may still reach it

- **Impact:** Medium · A reviewer who cannot see the editor could discard or save it by typing, without knowing.
- **Current experience:** After a capture from a full-screen app, Snapmark is the active app and the editor is its only window, although it sits on another Space. Keys typed on the desktop, such as Esc to "get out", may reach the invisible editor: two Esc presses close it (to Discarded), ⌘↵ adds it unseen, a digit changes the tool.
- **Visual:** No screenshot: not possible without a full-screen window; the path is in `shots/2-fullscreen-today.png`.
- **Recommendation:** This goes away once the editor stays on the Space the reviewer is looking at. Until then, do not bring Snapmark to the front when its window is not on the visible Space.
- **Tradeoff:** None beyond those of the editor over full-screen apps.
- **Decision needed:** Until the editor stays on the reviewer's Space, should Snapmark stay in the background when its window is on another Space?
- **Verified:** assumption, not checked. Read in the code that Snapmark takes focus when the editor opens; whether macOS keeps a window on another Space as the one receiving keys was not tested.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor on another Space after a capture from a full-screen app; build main v0.9.0
- Broken: Nielsen 1, 5 (error prevention)
- Code: `src/main.ts:211` (`app.focus({ steal: true })`); the editor's keys at `src/editor.ts:785-807` (Esc closes from Select, ⌘↵ saves)
- Screenshots: 2-fullscreen-today.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 2-03 (called it routine once the editor question is decided; the interim change is a behaviour change, so it is a question here). Related: F026.
- Guideline: none accepted yet (rule area: keyboard and focus)

</details>

### F032 · Every capture stops for the editor, so ten in a row means ten editors

- **Impact:** Design choice · A reviewer who wants to grab ten states of a page quickly (click, ⌃⇧3, click, ⌃⇧3) must mark and save or discard each one before the next, or pile up ten editor windows.
- **Current experience:** ⌃⇧3 captures at once and opens the editor, which takes the focus away from the browser. The next state of the page can only be set up after ⌘↵ (or ⌘W) and a click back into the browser. There is no way to capture now and mark later.
- **Visual:** No screenshot. The flow per screenshot: ⌃⇧3 → the editor takes focus → mark → ⌘↵ → click the browser → change the page → ⌃⇧3. Ten screenshots: about 60 steps and ten focus switches.
- **Recommendation:** Let the reviewer choose per capture: ⌃⇧3 opens the editor as now, and a second key (or ⌥ with it) adds the plain capture straight to the session, to mark later with "Edit Again" from the session window.
- **Tradeoff:** Unmarked screenshots in the session may be handed to the agent by mistake, so they would need to show as unfinished; one more key to learn.
- **Decision needed:** Should there be a way to capture straight into the session and mark later?
- **Verified:** read in the code.
- **Owner's words:** "Basically reviewing the designs, doing a complete UX/UI review of an overnight build, providing detailed feedback on different elements." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: ⌃⇧3 and ⌃⇧1 → editor; build main v0.9.0
- Broken: Nielsen 7 (flexibility and efficiency); Shneiderman shortcuts for frequent users; Laws of UX: flow, Parkinson's law, Zeigarnik effect (unmarked captures would need to show as unfinished)
- Code: `src/main.ts:118-124` (every capture opens the editor), `:211` (takes focus)
- Screenshots: none
- Earlier IDs: none
- Other products: CleanShot X keeps captures as floating thumbnails to annotate later; macOS Screenshot shows a thumbnail and saves on its own if left alone
- Seen by: 6-15. Related: F027, F033, F066.
- Guideline: none accepted yet (rule area: capture flow)

</details>

## Area picker and Capture Same Area

### F033 · Capture Same Area captures Snapmark's own editor when one is still open over the area

- **Impact:** High · A reviewer capturing the same area ten times in a row while reviewing an overnight build gets a picture of the editor instead of the page as soon as they capture faster than they annotate.
- **Current experience:** ⌃⇧3 photographs the saved rectangle of the screen at once, whatever is in front. Each capture opens an editor centred on the screen, at least 1180 × 600 points (up to 1600 × 1000 for a Retina capture), usually right over the browser area it came from. Stepping through a flow (capture, click in the page, capture again) with the first editor still open puts that editor into the second screenshot, and nothing hides Snapmark's windows or warns that one is in the way.
- **Visual:** No screenshot: the real screen may not be captured in this audit. The editor's size and centring are visible in `shots/1-editor-empty.png` (1180 × 600, the minimum).
- **Recommendation:** Never capture Snapmark's own windows: hide open editors for the moment of the capture and show them again right after, the way macOS Screenshot never captures its own thumbnail. Ten captures in a row then always show the page.
- **Tradeoff:** Open editors vanish and come back for a fraction of a second on every capture, and a reviewer who wants to capture an editor on purpose cannot. Alternatives from the evaluators: (a) hide Snapmark's windows during every capture; (b) make ⌃⇧3 pressed inside an open editor save that editor first and then capture.
- **Decision needed:** Should Snapmark hide its own windows while it captures, or should ⌃⇧3 inside an open editor save it first and then capture?
- **Verified:** read in the code; that the editor covers the area is inferred from its size and centring, not tested on a real screen.
- **Owner's words:** "How about a specific area? I will have the browser open and I will select and mark a certain area. For every screenshot that I take I may want to record the same area." — 2026-09-28

<details><summary>Supporting notes</summary>

- Where: Capture Same Area (⌃⇧3 and the menu item) while an editor is open; also Capture Screenshot; build main v0.9.0
- Broken: Nielsen 5 (error-prone condition), 1; Laws of UX: flow, Postel's law, Tesler's law (the product should carry this, not the reviewer); Maze: limitations in the journey
- Code: `src/main.ts:133-147` (`captureArea` → `shoot`, `screencapture -R` with no window hiding), `src/main.ts:146`, `src/main.ts:196-201` (editor size, no position: centred), `src/main.ts:118-124`
- Screenshots: 1-editor-empty.png
- Earlier IDs: none
- Other products: CleanShot X "Capture Previous Area" hides its own overlay windows while capturing; macOS Screenshot hides its floating thumbnail from the next capture; Shottr closes its preview window on the next capture (unsure, not verified)
- Seen by: 1-12 [the own-editor-captured part], 6-14 [Medium; also proposed that ⌃⇧3 inside an open editor saves it first], 7-06 (seen by 2 evaluators). Related: F066 (the stacking part of 1-12), F026, F027.
- Guideline: none accepted yet (rule area: navigation and return)

</details>

### F034 · The area can be chosen only by dragging with a pointer

- **Impact:** High · A reviewer who works from the keyboard alone cannot set up Capture Same Area at all, so the repeat-capture flow for reviewing an overnight build is closed to them.
- **Current experience:** The picker opens over the screen with "Drag over the area to capture. ⌃⇧3 captures it again each time. Esc cancels." Nothing in it can take focus. After Tab, →, ↓, Enter, Space, Tab and Enter the picker was still open with no area and nothing focused; only Esc worked, and it closed the picker with no area.
- **Visual:** `shots/5-area-picker-annotated.png` (the picker; only Esc responds). Proposal: `shots/5-proposal-area-keyboard.png`.
- **Recommendation:** Open the picker with a frame already in place (the last area, or the middle half of the display) that the arrow keys move and ⌥-arrows resize (⇧ for ten times the step), Enter accepts and Esc cancels, and say so in the hint. Offer "the window under the pointer" on one key (W) for the common case of a browser window.
- **Tradeoff:** The hint grows by one line, and the ready-made frame must never be mistaken for a chosen one, so it always needs Enter.
- **Decision needed:** Should the area picker work from the keyboard (arrow keys and Enter), and should it offer "the window under the pointer"?
- **Verified:** seen on screen (the real picker window, real key events; the result was no area).
- **Owner's words:** "How about a specific area? I will have the browser open and I will select and mark a certain area. For every screenshot that I take I may want to record the same area." — 2026-09-28

<details><summary>Supporting notes</summary>

- Where: area picker (⌃⇧3 the first time, menu → Choose New Area…); build main v0.9.0
- Broken: WCAG 2.2 2.1.1 Keyboard (A); rule area keyboard and focus (a keyboard route for every pointer action)
- Code: `src/area.ts:9-33` (mouse events only; the only key is Esc at `src/area.ts:31-33`), `src/area.html:59`; Capture region (⌃⇧1) is macOS's own `screencapture -i`, which also needs a pointer (`src/main.ts:118-127`)
- Screenshots: 5-area-picker-annotated.png, 5-proposal-area-keyboard.png
- Earlier IDs: none
- Other products: macOS captures the whole screen with ⌘⇧3 from the keyboard alone, and ⌘⇧5 remembers the last selection so Return captures it again; CleanShot X and Shottr keyboard support not checked
- Seen by: 5-35; also noted in 8-13's supporting notes ("Area creation is also pointer-only"). Probe: `areaAfterKeys` focus body, box hidden, still open; `areaResult: null` after Esc. Related: F048, F039.
- Guideline: none accepted yet (rule area: keyboard and focus)

</details>

### F035 · The saved area is invisible: the menu shows only its size

- **Impact:** Medium · While reviewing an overnight build, a reviewer who presses ⌃⇧3 after moving the browser or changing displays cannot tell what will be captured, and finds out it is wrong only in the editor.
- **Current experience:** The menu's "Capture Same Area" has the sub-line "1280 × 720" (or "First time: drag the area"). Nothing shows the rectangle on screen, which display it is on, or lets the reviewer clear it, and the picker's hint says nothing about how to see or change it later. The area is kept as screen coordinates across launches and checked only for whether it still fits a connected display; the capture itself is silent.
- **Visual:** `shots/1-menu-full.png` (the sub-line, rendered from the menu's data), `shots/6-menu-built-vs-proposal.png` (row 3 sub-label), `shots/1-area-annotated.png` (the picker's hint).

  | Where                            | Before       | After (proposals)                            |
  | -------------------------------- | ------------ | -------------------------------------------- |
  | Menu, Capture Same Area sub-line | "1440 × 810" | "1440 × 810 on Built-in Retina Display"      |
  | Menu, Capture Same Area sub-line | "1512 × 857" | "1512 × 857 at top left of Built-in Display" |

- **Recommendation:** Make the saved area something the reviewer can see before or while it is used, so a wrong area is noticed before ten screenshots are taken with it.
- **Tradeoff:** Drawing the area on screen is new machinery, and a flash on every capture is visual noise for the frequent reviewer; a longer sub-line still does not show the area itself. Alternatives from the evaluators: (a) "Choose New Area…" opens with the current area drawn, ready to move or resize, and the hint says how to change it later; (b) name the display (and the corner) in the menu's sub-line; (c) outline the area briefly when ⌃⇧3 fires, or when the menu opens; (d) an optional preview, and forget the area when its display changes.
- **Decision needed:** How should the saved area be shown: drawn when choosing again, named by display in the menu, or flashed on screen when it is captured?
- **Verified:** read in the code; the picker's hint seen on screen.
- **Owner's words:** "How about a specific area? I will have the browser open and I will select and mark a certain area. For every screenshot that I take I may want to record the same area." — 2026-09-28

<details><summary>Supporting notes</summary>

- Where: menu item Capture Same Area and its sub-line; ⌃⇧3; area picker; build main v0.9.0
- Broken: Nielsen 1 visibility of system status, 5 error prevention, 6 recognition rather than recall; Laws of UX: working memory, mental model; rule area remembered state
- Code: `src/menu.ts:76-81` (sub-label `${width} × ${height}`), `src/area.ts` (starts empty every time), `src/main.ts:62-77`, `src/main.ts:120-121` (`-x`: no sound), `src/main.ts:133-146`
- Screenshots: 1-menu-full.png, 1-area.png, 1-area-annotated.png, 6-menu-built-vs-proposal.png
- Earlier IDs: none
- Other products: macOS ⌘⇧5 "Remember Last Selection" redraws the last rectangle, movable and resizable, before capturing; CleanShot X "Capture Previous Area" shows the previous frame and lets it be adjusted (from memory, unsure of the exact behaviour)
- Seen by: 1-15 [Low; open the picker with the area drawn], 4-37 [Low; display name in the sub-line], 6-12 [flash the outline when ⌃⇧3 fires, name the display], 7-32 [Low; display and corner, flash on menu open], 8-09 [optional preview, invalidate on display change] (seen by 3 evaluators). Related: F037, F041.
- Guideline: none accepted yet (rule area: remembered state)

</details>

### F036 · The area is fixed the moment the mouse is released, with no chance to adjust it

- **Impact:** Medium · A reviewer whose first drag ends a few points off (a cut-off scroll bar, half a header) repeats that wrong area in every later capture of the overnight review until they find "Choose New Area…" in the menu.
- **Current experience:** The screen dims with "Drag over the area to capture. ⌃⇧3 captures it again each time. Esc cancels." While dragging, a white outline and a size label ("300 × 200") follow the pointer; releasing the mouse saves the area and captures it at once. There are no handles and no Return to confirm, the hint does not say that releasing captures, and a click or a sliver under 8 points starts over without a word.
- **Visual:** `shots/7-area-dragging-annotated.png` (the drag, captured on release), `shots/3-area.png`, `shots/3-area-dragging.png`. Proposal, in words: after the drag, handles on the area and the hint "Return to capture and keep this area · Esc cancels".
- **Recommendation:** After the first drag, keep the area on screen with handles and capture on Return or a click inside it (Esc still cancels), as macOS's own ⌘⇧5 does; every later ⌃⇧3 stays one instant key.
- **Tradeoff:** One more key press on the first capture of an area. Alternatives from the evaluators: (a) the adjustable frame with a confirm step described above; (b) keep the one-step drag, say "releasing captures" in the hint and give "Choose New Area…" its own key.
- **Decision needed:** Should the first drag stay adjustable until Return, or keep capturing on release with a hint that says so?
- **Verified:** seen on screen (the picker and the drag); that release captures at once is read in the code.
- **Owner's words:** "How about a specific area? I will have the browser open and I will select and mark a certain area. For every screenshot that I take I may want to record the same area." — 2026-09-28

<details><summary>Supporting notes</summary>

- Where: area picker (first ⌃⇧3, or menu → Choose New Area…); build main v0.9.0
- Broken: Nielsen 3 user control, 5 error prevention, 7 flexibility (no key for choosing again); Shneiderman easy reversal; Laws of UX: Fitts's law (one precise drag in one go)
- Code: `src/area.ts:23-30` (mouseup ends the pick), `src/main.ts:133-147` and `src/main.ts:138-146` (captures straight after), `src/menu.ts:78`, `src/menu.ts:81`
- Screenshots: 2-area-picker.png, 3-area.png, 3-area-dragging.png, 6-area.png, 7-area.png, 7-area-dragging.png, 7-area-dragging-annotated.png
- Earlier IDs: none
- Other products: macOS ⌘⇧5 keeps an adjustable selection with a Capture button; CleanShot X keeps the selection adjustable and remembers the last area; Shottr's repeat-area capture shows the area before capturing (documented, not tested)
- Seen by: 2-46 [Design choice; handles until Return], 3-31 [Design choice; handles, Enter, flash the outline on reuse], 6-17 [Low; handles, Return or click inside], 7-31 [handles and a confirm step, or one-step drag plus a key for Choose New Area and "releasing captures" in the hint] (seen by 2 evaluators). The evaluator 6 dragging screenshot was not used as evidence (the scripted drag disagreed with the display scale). Related: F034, F039, F040.
- Guideline: none accepted yet (rule area: drag and drop)

</details>

### F037 · The same area is a fixed place on the screen, not a place in the browser

- **Impact:** Medium · A reviewer who thinks of "the page in my browser" gets the page cut wrongly on every ⌃⇧3 once the browser window is moved, resized or a sidebar opens.
- **Current experience:** The area is stored as screen coordinates and captured as such. The menu says only "1280 × 760", and the area is asked for again only when the display it was on is gone. Nothing tells the reviewer that the area stays put when the browser moves.
- **Visual:** No screenshot: read in the code.
- **Recommendation:** Keep screen coordinates (simple and predictable), but say so: the picker's hint and the menu's sub-line can say "this part of the screen", and showing where the area is makes a moved browser obvious.
- **Tradeoff:** The alternative, an area anchored to a window, needs window tracking and still breaks when the page scrolls inside the window.
- **Decision needed:** Is "a fixed part of the screen" the right model for Capture Same Area, or should it follow a window?
- **Verified:** read in the code.
- **Owner's words:** "I will have the browser open and I will select and mark a certain area. For every screenshot that I take I may want to record the same area." — 2026-09-28

<details><summary>Supporting notes</summary>

- Where: Capture Same Area; area picker hint; menu sub-line; build main v0.9.0
- Broken: Laws of UX: mental model; Nielsen 2 match with the real world
- Code: `src/main.ts:133-147` (`onScreen` only checks the display), `src/area.html:59` (hint)
- Screenshots: none
- Earlier IDs: none
- Other products: CleanShot X's "capture previous area" is also screen-based, and shows it before capturing; Xnapper captures a window, not a rectangle
- Seen by: 6-16. Related: F035.
- Guideline: none accepted yet (rule area: remembered state)

</details>

### F038 · The area picker opens only on the display under the pointer

- **Impact:** Medium · A reviewer with two displays whose pointer rests on the wrong screen gets the dimmed picker there and has to cancel, move the pointer and start again.
- **Current experience:** "Drag over the area to capture" appears in one overlay on the display nearest the pointer. The other display stays undimmed, and nothing says the area can only be on the dimmed one.
- **Visual:** No screenshot: only one display was available in the audit; read in the code.
- **Recommendation:** Dim every connected display and accept a drag on any of them, with Esc cancelling them all.
- **Tradeoff:** One overlay window per display, kept in step. Alternative from the evaluators: keep one overlay but name the active display and offer a key to move the picker to another display (one more step).
- **Decision needed:** Should the area picker work on every connected display at once?
- **Verified:** read in the code; multiple displays not exercised.
- **Owner's words:** "I will have the browser open and I will select and mark a certain area." — 2026-09-28

<details><summary>Supporting notes</summary>

- Where: area picker; build main v0.9.0
- Broken: Nielsen 5 error prevention, 7 flexibility; Laws of UX: Jakob's law (macOS ⌘⇧4 works on every display), Fitts's law, flow; Maze: limitations in the journey
- Code: `src/main.ts:151-164`, `src/main.ts:152` (`getDisplayNearestPoint(getCursorScreenPoint())`), `src/area.ts:9-24`
- Screenshots: none
- Earlier IDs: none
- Other products: macOS ⌘⇧4 works on every display; no equivalent multi-display picker was verified by evaluator 8
- Seen by: 6-18 [Low; dim every display], 8-08 [every display, or a keyboard display switch] (seen by 2 evaluators).
- Guideline: none accepted yet (rule area: drag and drop)

</details>

### F039 · The area picker has no click-only route

- **Impact:** Medium · A reviewer who can click but not hold and drag (a head pointer, switch control, a tremor) cannot set an area, so Capture Same Area is closed to them.
- **Current experience:** Choosing an area needs a press, a move and a release. A click without movement, or a sliver under 8 points, silently starts the picker over.
- **Visual:** `shots/5-area-picker-annotated.png` (the picker; a click leaves no area).
- **Recommendation:** Accept two clicks (first corner, then the opposite corner) as well as a drag.
- **Tradeoff:** A stray first click leaves a pending corner; show it and let Esc clear it.
- **Decision needed:** Should the area picker accept two clicks, one per corner, as well as a drag?
- **Verified:** seen on screen (a click leaves no area); read in the code.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: area picker; build main v0.9.0
- Broken: WCAG 2.2 2.5.7 Dragging Movements (AA)
- Code: `src/area.ts:23-30`
- Screenshots: 5-area-picker-annotated.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 5-36 (said routine; it is a new interaction, so it is a decision here). Related: F034, F036, F085.
- Guideline: none accepted yet (rule area: drag and drop)

</details>

### F040 · "Choose New Area…" also captures at once, but its name promises only choosing

- **Impact:** Low · A reviewer who only wants to set the area for later gets a screenshot and an editor they did not ask for, and a discarded item when they close it.
- **Current experience:** Menu → "Choose New Area…" dims the screen with "Drag over the area to capture. ⌃⇧3 captures it again each time. Esc cancels." After the drag the area is saved and captured immediately, and the editor opens.
- **Visual:** `shots/1-area-annotated.png` (the picker's hint).
- **Recommendation:** Either rename the item to what it does ("Capture New Area…"), or make it only choose (the hint then says "⌃⇧3 captures this area"). Renaming is enough if the combined action is wanted.
- **Tradeoff:** Choose-only adds a step for the reviewer who wants both.
- **Decision needed:** Should "Choose New Area…" capture right away (and be named for it), or only set the area?
- **Verified:** read in the code; the hint seen on screen.
- **Owner's words:** "For every screenshot that I take I may want to record the same area." — 2026-09-28

<details><summary>Supporting notes</summary>

- Where: menu "Choose New Area…"; area picker; build main v0.9.0
- Broken: Nielsen 2 and 6 (the label and the result differ); Laws of UX: mental model
- Code: `src/main.ts` `actions.chooseArea = () => captureArea(true)` → `pickArea` then `shoot`
- Screenshots: 1-area.png, 1-area-annotated.png
- Earlier IDs: none
- Other products: CleanShot X separates "Capture Area" from "Capture Previous Area", with no choose-only item; macOS ⌘⇧5 lets you draw the rectangle and press Capture separately ("Remember Last Selection")
- Seen by: 1-14; evaluator 8's vocabulary cross-check notes the same ("Replacement also immediately captures; its label does not state that consequence"), not as a numbered finding. Related: F036.
- Guideline: none accepted yet (rule area: dialogs, menus and popovers)

</details>

### F041 · When the area's display is gone, the picker comes back without saying why

- **Impact:** Low · A reviewer who expects ⌃⇧3 to capture at once gets the dimmed screen and the first-time hint, with no word that the saved area is no longer on any display.
- **Current experience:** The area is kept in screen points. If it no longer fits inside a connected display (an external monitor unplugged, a resolution changed), ⌃⇧3 opens the picker on the display with the pointer, with the same hint as the first time: "Drag over the area to capture. ⌃⇧3 captures it again each time. Esc cancels."
- **Visual:** `shots/2-area-picker.png` (the hint shown in both cases).

  | Where                                 | Before                                                                         | After                                                                                 |
  | ------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
  | Area picker hint, area's display gone | "Drag over the area to capture. ⌃⇧3 captures it again each time. Esc cancels." | "The last area was on a display that is not connected. Drag a new area. Esc cancels." |

- **Recommendation:** In this case the hint says what happened.
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code; the picker's hint seen on screen.
- **Owner's words:** "For every screenshot that I take I may want to record the same area." — 2026-09-28

<details><summary>Supporting notes</summary>

- Where: ⌃⇧3 with a saved area whose display is gone; area picker; build main v0.9.0
- Broken: Nielsen 1, 9
- Code: `src/main.ts:133-145` (`onScreen` check), `src/area.html:59`
- Screenshots: 2-area-picker.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 2-35 (only one display was available; the gone-display case itself was not tried). Related: F035.
- Guideline: none accepted yet (rule area: feedback and notifications)

</details>

### F042 · Dragging to the bottom edge pushes the size label off the screen

- **Impact:** Low · A reviewer whose area reaches the bottom of the display (a browser's lower edge) loses the size read-out while dragging.
- **Current experience:** A drag ending 8 points above the bottom put the label "500 × 212" at 1167–1187 points on a 1169-point screen; only a sliver of it shows.
- **Visual:** `shots/2-area-picker-drag-bottom-annotated.png`.
- **Recommendation:** Place the label inside the area, or above it, when there is no room below.
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen (the picker's own page).
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: area picker, while dragging near the bottom edge; build main v0.9.0
- Broken: Nielsen 1
- Code: `src/area.ts:19`
- Screenshots: 2-area-picker-drag-bottom.png, 2-area-picker-drag-bottom-annotated.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 2-45.
- Guideline: none accepted yet (rule area: feedback and notifications)

</details>

### F043 · The area picker tells a screen reader nothing while dragging

- **Impact:** Low · A low-vision reviewer using VoiceOver hears the window's name "Choose the area" but not the area's size as it changes, nor that the area has been set.
- **Current experience:** The hint and the size label ("300 × 200") are plain text; nothing is announced when they change, and nothing in the page has focus.
- **Visual:** `shots/5-area-dragging.png` (the size label "300 × 200"), `shots/5-area-picker-annotated.png`.
- **Recommendation:** Let the size label announce itself politely ("300 by 200 points") and announce "Area set: 300 by 200. ⌃⇧3 captures it" when the picker closes.
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen (no live region in the page).
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: area picker; build main v0.9.0
- Broken: WCAG 2.2 4.1.3 Status Messages (AA)
- Code: `src/area.html:59-61`, `src/area.ts:20`
- Screenshots: 5-area-dragging.png, 5-area-picker-annotated.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 5-37.
- Guideline: none accepted yet (rule area: feedback and notifications)

</details>

### F044 · The chosen area's edge is a 1-point white line

- **Impact:** Low · On a white page, a low-vision reviewer may not see exactly where the area being dragged ends.
- **Current experience:** The area is outlined in 1-point white and the outside is dimmed by 30%. White against the clear white inside is 1:1; clear against dimmed is 2.1:1, so only the edge of the dimming marks the area.
- **Visual:** `shots/5-area-dragging.png` (the white edge cannot be seen against the clear area).
- **Recommendation:** A two-tone edge (1 point black inside 1 point white) that reads at 3:1 on any ground.
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen (the picker page mid-drag); contrast computed from its colours.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: area picker, while dragging; build main v0.9.0
- Broken: WCAG 2.2 1.4.11 Non-text Contrast (AA)
- Code: `src/area.html:27-32`
- Screenshots: 5-area-dragging.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 5-38.
- Guideline: none accepted yet (rule area: drag and drop)

</details>

### F045 · The picker's hint promises ⌃⇧3 even when that key is unavailable

- **Impact:** Low · A reviewer whose ⌃⇧3 is owned by another app is told in the picker that the key captures the area again, while the menu says it does not.
- **Current experience:** When another app owns the key, the menu says "Capture Same Area (shortcut unavailable)", but the picker still reads "Drag over the area to capture. ⌃⇧3 captures it again each time. Esc cancels." The hint is fixed text.
- **Visual:** `shots/4-area-hint-annotated.png`.

  | Where            | Before                                                                         | After (key unavailable)                                                                                     |
  | ---------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
  | Area picker hint | "Drag over the area to capture. ⌃⇧3 captures it again each time. Esc cancels." | "Drag over the area to capture. Choose Capture Same Area in the menu bar to capture it again. Esc cancels." |

- **Recommendation:** Build the hint from the shortcuts actually registered, as the menu already does.
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code; the hint seen on screen.
- **Owner's words:** "This is also important: when I create, as I said, it needs to be shortcuts so I can just do this on the fly." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: area picker hint, with ⌃⇧3 taken by another app; build main v0.9.0
- Broken: Nielsen 1; hints that lie
- Code: `src/area.html:59` (fixed text); the menu's `shortcut()` in `src/menu.ts:60-62` is the model
- Screenshots: 4-area-hint-annotated.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 4-19 [the area picker hint part]. Related: F158 (the Keyboard Shortcuts window part), F132 (the empty session window's hint), F021.
- Guideline: none accepted yet (rule area: first run and help)

</details>

### F046 · ⌃ in the picker's hint reads like a caret "^"

- **Impact:** Low · A reviewer reading the hint sees "^⇧3", a key they cannot find on the keyboard.
- **Current experience:** At 14 points in the hint's font the Control symbol looks like a caret: "^⇧3 captures it again each time".
- **Visual:** `shots/4-area-hint-annotated.png`.
- **Recommendation:** Show key symbols in the system font at the size macOS menus draw them, or write "Control-Shift-3" in this one-sentence hint.
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen.
- **Owner's words:** "3. The shortcut Command-1 on Chrome changes the tab. How about we do something different?" — 2026-09-28

<details><summary>Supporting notes</summary>

- Where: area picker hint; build main v0.9.0
- Broken: rule area platform conventions (key symbols as macOS draws them)
- Code: `src/area.html:59`
- Screenshots: 4-area-hint-annotated.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 4-20 [the area picker part]. Related: F166 (the Keyboard Shortcuts window part).
- Guideline: none accepted yet (rule area: platform conventions)

</details>

### F047 · The area picker declares no language

- **Impact:** Low · A reviewer using VoiceOver with a non-English system voice may hear the picker's English hint read with the wrong pronunciation.
- **Current experience:** The picker's page sets no language, so VoiceOver guesses how to read the hint.
- **Visual:** No screenshot: a page setting, read from the running picker.
- **Recommendation:** Declare English on the page.
- **Tradeoff:** A future translation must update it.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen (read from the running picker page).
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: area picker; build main v0.9.0
- Broken: WCAG 2.2 3.1.1 Language of Page (A); axe-core html-has-lang
- Code: `src/area.html:2`
- Screenshots: none
- Earlier IDs: none
- Other products: none noted
- Seen by: 5-39, 8-31 [the area page part]. Probe: `areaLang: "(none)"`. Related: F121, F156, F170, F206.
- Guideline: none accepted yet (rule area: platform conventions)

</details>

## Editor

### F048 · No mark can be placed, selected, moved or resized without a pointer

- **Impact:** Critical · A reviewer who cannot use a mouse or trackpad (repetitive strain, tremor, switch or keyboard-only setup) cannot mark a screenshot at all in any scene, which is the editor's whole job.
- **Current experience:** Tab walks the nine toolbar controls, the comment field, "Discard" and "Add to session", then starts over; the image is never a stop. Pressing 2 chooses Box, but Enter, Space, the arrow keys and Tab then add nothing (no mark after six key presses). A mark drawn with the pointer can never be selected by Tab, and with it selected the arrow keys do not move it; only ⌫ works, and only on a mark the pointer selected first.
- **Visual:** `shots/5-tab-order-annotated.png` (every Tab stop marked; the image is never reached). Proposal: `shots/5-proposal-keyboard-marks.png`.
- **Recommendation:** Make the image one Tab stop with a visible keyboard crosshair: the arrow keys move it (⇧ for bigger steps), Enter places the current tool at its click size, and a second Enter finishes an arrow, a card's pointer, a cut or a redaction. In Select, Tab and ⇧Tab step through the marks, the arrow keys nudge, ⌥-arrows resize, ⌫ deletes, and each result is announced ("Box 3 placed"). This also gives the owner marks from the keyboard without reaching for the trackpad.
- **Tradeoff:** A real piece of work (a keyboard cursor layer, focus on the canvas, announcements). The quickest partial step, nudging and resizing a selected mark with the arrow keys, helps pointer users too but leaves placing a mark pointer-only. Freehand Pen drawing needs a different alternative or none.
- **Decision needed:** Should the editor be fully usable from the keyboard (placing and editing every mark except freehand), or is a pointer an accepted requirement, stated in the README?
- **Verified:** seen on screen (real key events sent to the editor; mark count and position read before and after).
- **Owner's words:** "This is also important: when I create, as I said, it needs to be shortcuts so I can just do this on the fly." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor, the image area, every tool; build main v0.9.0
- Broken: WCAG 2.2 2.1.1 Keyboard (A), 2.5.7 Dragging Movements (AA); checklist accessibility 4; Nielsen 7 flexibility; Shneiderman shortcuts for frequent users; Maze limitations in the journey
- Code: `src/editor.ts:430` (marks made only on `mouse:down`), `src/editor.ts:430-489`, `src/editor.ts:785-807` (the only editor keys: ⌘↵, ⌘W, Esc, ⌫/Delete, group keys), `src/editor.html:281` (the canvas; both Fabric canvases have tabIndex -1)
- Screenshots: 5-light-handles.png, 5-tab-order-annotated.png, 5-proposal-keyboard-marks.png
- Earlier IDs: none
- Other products: Figma moves a selection with the arrow keys (⇧ for 10 px) and Tab cycles layers, and documents keyboard tool and object workflows; macOS Preview's markup moves a selected shape with the arrow keys
- Seen by: 5-01 (probe: `keyboardOnlyObjectsAdded: 0`, `tabSelectsMark: false`, `arrowKeysMoveMark: false`), 8-13 (High; proposes a keyboard-selectable "Marks" list with "Add at centre", arrow-key movement and size controls; notes the area picker is pointer-only too). Related: F034, F085, F086, F119.
- Guideline: none accepted yet (rule area: keyboard and focus)

</details>

### F049 · Adding to a session whose folder was moved or deleted fails without a word

- **Impact:** High · A reviewer in an overnight review whose current session folder was moved, renamed or deleted in Finder (for example into iCloud Drive) can no longer add any screenshot, and nothing says why.
- **Current experience:** The current session "Moved to iCloud" had its folder moved away; after a capture, clicking "Add to session ⌘↵" does nothing visible: the window stays, the button comes back, no message, and an empty "img" folder is left behind. The editor still reads "→ Moved to iCloud" and cannot be pointed at another session. Every later capture fails the same way, and a reviewer who gives up and closes the window discards the work.
- **Visual:** `shots/2-editor-save-missing-session-annotated.png`, `shots/7-missing-session-save-annotated.png` (the editor after "Add to session": still open, no message).
- **Recommendation:** When adding fails, say so in the editor's footer next to the button, keep the editor open with its marks, and offer a way forward: "Couldn't add to Moved to iCloud: its folder is no longer in ~/Documents/Snapmark. [Add to a new session] [Choose a session…]". Show "Saving…" while it runs and do not let ⌘↵ start a second save.
- **Tradeoff:** A second line in the footer, in a rare state. Alternatives from the evaluators: offer "Add to a new session" in one click; ask which session to use; or "Retry" and "Choose another location".
- **Decision needed:** When the session is gone, should the editor offer "Add to a new session" in one click, or ask which session to use?
- **Verified:** seen on screen (a script deleted or moved the session folder while the editor was open and clicked "Add to session"; the app logged "no such file or directory … session.md").
- **Owner's words:** "It needs to be some sort of project or session. If there's an existing session I just add to the existing session or I create a new session." — 2026-09-25. "Also I wonder what the best way of making this portable is: being able to share this as a PDF or zip it, maybe both. Having it in the cloud." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor footer, "Add to session" / ⌘↵, with the current session's folder gone; setup flow "Move sessions into iCloud Drive or Google Drive"; build main v0.9.0
- Broken: Nielsen 1, 9; Shneiderman informative feedback, dialogs that yield closure; Laws of UX: Doherty threshold, peak-end rule, Zeigarnik effect; checklist forms 3, content 7, navigation 8; rule area saving and unsaved work; writing: errors as event · consequence · action
- Code: `src/editor.ts:754-778` (save re-enables the button and rethrows; nothing shows it), `src/editor.ts:785-786` (keyboard path not guarded against a second save), `src/main.ts:246-258` (editor:save → `sessions.addShot`), `src/sessions.ts:50-56` (`nextNumber` creates `img/`, then fails reading `session.md`), `src/main.ts:192` (session fixed when the editor opens); the menu handles the same case with a notification (`src/main.ts:457-462`)
- Screenshots: 2-editor-save-missing-session.png, 2-editor-save-missing-session-annotated.png, 7-missing-session-save.png, 7-missing-session-save-annotated.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 2-08 (offer "Add to a new session" or "Choose a session…"), 6-33 (Medium; "Add to New Session"; called it routine), 7-09 ("Save to a new session" or pick another; called it routine), 8-16 ("Saving…" state, "Retry" / "Choose another location"; duplicate-save timing untested) (seen by 3 evaluators). Related: F009, F061.
- Guideline: none accepted yet (rule area: saving and unsaved work)

</details>

### F050 · There is no mark for "keep this", so keep and remove can be told apart only by colour

- **Impact:** High · In a quick verdict the reviewer can mark what goes but not what stays: a green box is read by the agent as "look at this element", and a colour-blind teammate reading the PDF sees it as the same olive as a red box.
- **Current experience:** The Remove group (key 5: Cross, Remove area) is fixed red; nothing is fixed green, since Tick and Thumbs up were removed on 2026-09-25. To say "keep this" the reviewer picks green in the macOS colour panel and draws a Box, which the copied prompt still explains as "Box: look at this element"; neither the prompt nor session.md mentions colour. The product's own scene 3 still says "red remove, green approve", and a hard rule says approve marks are always green.
- **Visual:** `shots/7-verdict-annotated.png` (a green "keep" box next to red remove marks); `shots/5-redgreen-normal-annotated.png` and `shots/5-redgreen-deuteranopia-annotated.png` side by side (in a deuteranopia view the green and red boxes are one colour). Proposal: `shots/5-proposal-keep-mark.png`.
- **Recommendation:** Decide one of two directions and make the tools, the prompt and the product's rules agree. The owner's earlier words point both ways, so this is the owner's call.
- **Tradeoff:** Alternatives from the evaluators: (a) bring back one "keep" mark, a green tick with a fixed colour and its own prompt line ("Keep: leave this as it is"), as a third variant on key 5 or on its own key; it carries the meaning in its shape, so it also survives colour blindness, but it adds a toolbar slot the owner removed on purpose; (b) drop "green approve" from scene 3 and the hard rule and let a note say "keep", which is slower on the fly. One evaluator warns against restoring several approval icons; one compact mark at most.
- **Decision needed:** Should Snapmark have one "keep this" mark again (a green tick, on key 5 or its own key), or should the quick verdict mark only what goes and leave "keep" to the notes?
- **Verified:** seen on screen (real drags; the deuteranopia view simulated from the screenshot; the prompt text read in the code).
- **Owner's words:** "a tick for approving, or kind of like a thumbs up or something for approval in green" — 2026-09-25. Later: "I think we can get rid of 5. We don't need to tick and Thumbs Up." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor tools (keys 1–7), colour swatch, the copied prompt, session.md, saved images and PDF; `docs/ux/setup.md` scene 3 and hard rules; build main v0.9.0
- Broken: WCAG 2.2 1.4.1 Use of Color (A) in the output the tool produces (ATAG 2.0 B.2); project hard rule "Remove marks are always red and approve marks always green" has no approve mark to apply to; Nielsen 2, 4; Laws of UX: mental model, Von Restorff effect, choice overload; Maze: limitation in the journey (scene 3 half supported)
- Code: `src/tools.ts:59` (Box: "look at this element"), `src/tools.ts:80-93` (only Remove has a fixed colour and meaning), `src/tools.ts:24-132`, `src/main.ts:409-418` (the prompt)
- Screenshots: 1-shortcuts-window-full.png, 5-marks-backgrounds-deuteranopia.png, 5-redgreen-normal-annotated.png, 5-redgreen-deuteranopia-annotated.png, 5-proposal-keep-mark.png, 6-shortcuts-light.png, 7-verdict.png, 7-verdict-annotated.png
- Earlier IDs: decision 2026-09-25 "Tick and Thumbs up removed. Reverses the owner's earlier request for them"
- Other products: none of macOS Screenshot, Xnapper, CleanShot X or Shottr has an approve mark; Figma users react with a ✅ emoji; FigJam stamps (+1, thumbs up) carry the meaning in the shape; GitHub reviews pair a colour with an icon and a word
- Seen by: 1-19 (Medium; either direction), 5-06 (a tick, as a third variant on key 5), 6-30 (Design choice; either direction), 7-19 (Medium; either direction), 8-34 (Design choice; one compact Keep mark or a written note, never several icons) (seen by 3 evaluators)
- Guideline: none accepted yet (rule area: editing)

</details>

### F051 · Pressing Esc a few times runs straight through into discarding the screenshot

- **Impact:** High · A reviewer who uses Esc to "get out" of a note or a tool, as the owner asked for, closes the editor one press too many and loses the screenshot, its marks and its notes from view without a word.
- **Current experience:** Measured with real key events: place Reference 1, type "Button label is cut off", then Esc. Esc 1 leaves the note, Esc 2 switches to Select, Esc 3 closes the window; the screenshot went to Discarded, session.md was unchanged, and no message appeared. After the second Esc nothing warns that the next one closes the window, and holding Esc (key repeat) runs all the steps at once. The Keyboard Shortcuts window describes it as "out of the text, then deselect, then back to Select, then close".
- **Visual:** `shots/6-esc-before-third-annotated.png` (the editor after two presses: Select on, the note typed, one key from closing); `shots/7-keyboard-shortcuts-full-annotated.png` (the Esc row).
- **Recommendation:** Let Esc step back through the note, the selection and the tool, and stop at Select. Closing stays on ⌘W, the close button and "Discard", which are deliberate.
- **Tradeoff:** Reverses the owner's earlier choice that Esc on Select closes the editor; a reviewer who used Esc as a quick "throw this capture away" key needs ⌘W. Alternative from the evaluators: keep Esc closing, but only an editor with no marks and no text.
- **Decision needed:** Should Esc stop at Select and leave discarding to ⌘W, or keep closing the editor (perhaps only when it holds no marks or text)?
- **Verified:** seen on screen (scripted run with real key events: the window closed and a new Discarded folder "… · esc · not saved" appeared).
- **Owner's words:** "When I'm at a card and then I'm adding cards, if I press 5 again I can't actually get out. […] I should be getting out of this mode by pressing Escape or something." — 2026-09-25. "I just wonder if we should introduce a shortcut with Escape and be able to recover it so nothing ever gets lost." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor, keyboard, from a note or any tool; Discarded; build main v0.9.0
- Broken: Nielsen 5 error prevention, 1 visibility (the discard is silent), 3 user control; Shneiderman error prevention; Laws of UX: cognitive load (counting Esc presses), peak-end rule; rule area keyboard and focus ("which surface gets Escape")
- Code: `src/editor.ts:785-803` (Esc cascade ends in `window.close()`), `src/editor.ts:788-803`, `src/editor.ts:781-783` (unload stashes to Discarded)
- Screenshots: 6-esc-before-third.png, 6-esc-before-third-annotated.png, 7-keyboard-shortcuts-full.png, 7-keyboard-shortcuts-full-annotated.png
- Earlier IDs: decision 2026-09-25 "Esc on Select closes the editor as a recoverable discard" — answered "Esc on Select closes (Recommended)"
- Other products: Figma's Esc deselects and leaves the tool, never closes the file; macOS Preview markup leaves a mode or deselects; macOS Screenshot markup closes on Esc only after asking or saving
- Seen by: 4-15 (Design choice; stop at Select), 6-22 (stop at Select, or close only an empty editor), 7-03 (Medium; same two options) (seen by 2 evaluators). Related: F058, F163, F221.
- Guideline: none accepted yet (rule area: keyboard and focus)

</details>

### F052 · Every ordinary mark starts in the same red as "remove this"

- **Impact:** High · The reviewer in a quick verdict, the teammate reading the PDF and the agent reading the image cannot tell "remove this" from "look here" by colour, because both are the same red.
- **Current experience:** A fresh editor starts with the colour swatch on the red that the Cross and Remove area always use. A Box ("look at this element"), an ellipse, an arrow, pen strokes, reference circles, a card's stripe and pointer line and a moved piece's outline all come out in that red; only Highlighter and Spotlight have their own colours. One test review with every tool shows eight red things, two of which mean "remove"; in the exported PDF the ellipse around "Orders" and the cross over the actions column are the same red.
- **Visual:** `shots/3-review-1180-light-red-annotated.png` (eight red marks, two meaning remove); `shots/6-editor-marked-red-annotated.png` (Box and Cross in the same red); `shots/7-export-pdf-marked-annotated.png` (the PDF); `shots/1-editor-inuse-annotated.png` (the swatch).
- **Recommendation:** Keep red for the Remove group only, and start every other mark in one different colour (the swatch starts on it), so red means "remove" on the image without a legend and the owner's red/green rule holds.
- **Tradeoff:** Red is the conventional annotation colour and the most visible on most interfaces; a non-red default feels unusual at first. Alternatives from the evaluators for the new default: blue (vanishes on blue buttons such as the mock's "New order"), orange, or magenta.
- **Decision needed:** Which colour should ordinary marks start in, so red means only "remove": blue, orange or magenta?
- **Verified:** seen on screen.
- **Owner's words:** "Also again, we need more elements to be clear about what should go away and what should not." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor colour swatch default; every tool without a fixed colour; the saved image, session window and PDF; build main v0.9.0
- Broken: project hard rule "Remove marks are always red and approve marks always green" (red is not reserved); Nielsen 4; Laws of UX: law of similarity, Von Restorff effect, cognitive bias; checklist: no meaning carried by colour alone (meaning dilution rather than a WCAG 1.4.1 failure, since shapes differ)
- Code: `src/editor.html:14` (`--accent: #e11d48`), `src/editor.html:276` (colour input value `#e11d48`), `src/tools.ts:20` (`RED = '#e11d48'`), `src/editor.ts:39` (`color()` falls back to the swatch)
- Screenshots: 1-editor-inuse.png, 1-editor-inuse-annotated.png, 3-review-1180-light.png, 3-review-1180-light-red-annotated.png, 6-editor-marked.png, 6-editor-marked-red-annotated.png, 7-main-editor.png, 7-export-pdf-marked.png, 7-export-pdf-marked-annotated.png
- Earlier IDs: 2026-09-25 audit F012, F107, F077 (still true at v0.9.0)
- Other products: macOS Markup starts every shape in red but gives red no meaning; Xnapper and CleanShot X default to red or a brand accent; Figma's comments use avatar colours; none reserves red, so this would be a Snapmark rule justified by its remove meaning
- Seen by: 1-18 (the mark default part; Medium; blue or magenta), 3-01 (the marks part; orange or magenta, warns blue vanishes on blue buttons), 6-25 (Medium; blue or orange), 7-20 (Medium; blue or the product's accent) (seen by 2 evaluators). Related: F084, F095.
- Guideline: none accepted yet (rule area: editing)

</details>

### F053 · ⌘R in the editor wipes every mark off the screen

- **Impact:** High · In the main scene the editor opens in front of the browser after every capture, so ⌘R meant for the browser (reload the build under review) lands in the editor and every mark, reference and note disappears without a word.
- **Current experience:** Snapmark sets no app menu of its own, so while an editor is in front the Mac's menu bar holds the stock Electron menu, including View ▸ Reload ⌘R, Force Reload ⇧⌘R and Toggle Developer Tools ⌥⌘I. With a box, a cross and reference 1 on the capture, ⌘R reloads the editor: the capture comes back clean, Undo is greyed out, the References list is gone. A copy with the marks went to Discarded on the way out ("… · not saved"), but nothing says so, and "Add to session" now adds the clean capture. Force Reload does the same.
- **Visual:** `shots/4-reload-annotated.png` (before and after, side by side); `shots/2-editor-after-reload-annotated.png`; `shots/7-editor-after-reload-annotated.png`.
- **Recommendation:** Give Snapmark's windows their own app menu with no Reload, Force Reload or Developer Tools in a release build. An editor holds unsaved work and never needs reloading by the reviewer.
- **Tradeoff:** A small menu to maintain; the developer loses ⌘R and the menu route to Developer Tools in the packaged app (both can stay in development builds). Alternatives from the evaluators for what the menu holds: (a) only remove Reload and Force Reload from the menus Snapmark shows; (b) a full own menu: Snapmark (About, Hide, Quit), Edit (Undo and Redo wired to the editor's own undo, Cut, Copy, Paste, Select All), Window (Minimize, Close); (c) the same, plus a Help item that opens the Keyboard Shortcuts window.
- **Decision needed:** Should Snapmark ship its own app menu without Reload and Developer Tools, and should it carry a Help item for the list of keys?
- **Verified:** seen on screen (a script reloaded the editor the way the menu's Reload does: marks before 3, after 0, one new Discarded folder; the menu and its keys were read from the running app).
- **Owner's words:** "I think another thing is, if I took a screenshot, annotated it, and discarded it, it is gone. I just wonder if we should introduce a shortcut with Escape and be able to recover it so nothing ever gets lost." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor window, the Mac menu bar while an editor or the session window is in front (the Dock icon, and so the menu bar, shows then): View ▸ Reload ⌘R / Force Reload ⇧⌘R; the session window has the same items; build main v0.9.0
- Broken: Nielsen 3, 4 (platform conventions), 5; checklist platform conventions; rule area platform conventions ("standard keys"); rule area saving and unsaved work (unsaved work on every exit)
- Code: no `Menu.setApplicationMenu` anywhere in `src/`, so Electron's default menu applies; `src/editor.ts:781-783` (`beforeunload` stashes to Discarded), `src/main.ts:227-231`; after the reload `editor:init` hands back the clean image and `state` only from when the window was opened (`src/main.ts:221-224`); `src/main.ts:60` (Dock shown while a window is open)
- Default menu (Electron 44.4.5): Electron (About, Services, Hide ⌘H, Hide Others ⌥⌘H, Show All, Quit ⌘Q) · File (Close Window ⌘W) · Edit (Undo ⌘Z, Redo ⇧⌘Z, Cut, Copy, Paste, Paste and Match Style ⌥⇧⌘V, Delete, Select All, Substitutions, Speech) · View (Reload ⌘R, Force Reload ⇧⌘R, Toggle Developer Tools ⌥⌘I, Actual Size ⌘0, Zoom In ⌘+, Zoom Out ⌘-, Toggle Full Screen ⌃⌘F) · Window (Minimize ⌘M, Zoom, Bring All to Front)
- Screenshots: 2-editor-before-reload.png, 2-editor-after-reload.png, 2-editor-after-reload-annotated.png, 4-reload-before.png, 4-reload-after.png, 4-reload-annotated.png, 7-editor-after-reload.png, 7-editor-after-reload-annotated.png
- Earlier IDs: 2026-09-25 audit F182 (then an assumption; now confirmed)
- Other products: none noted
- Seen by: 2-06 (remove Reload and Force Reload from the menus), 4-10 (own app menu: Snapmark, Edit, Window), 7-10 (Medium; own app menu with a Help item for the Keyboard Shortcuts window; called it routine). Related: F067, F109, F110, F065.
- Guideline: none accepted yet (rule area: platform conventions)

</details>

### F054 · The Highlighter disappears on dark interfaces

- **Impact:** High · A reviewer marking a dark screen (a dark-mode app, a dark header or sidebar) gets a highlight that neither the agent nor a teammate can see, so the note it belongs to points at nothing.
- **Current experience:** The Highlighter blends yellow into the image by multiplying at 45%. Across the mock's near-black header the result is practically the same colour as the header (1.0:1), invisible in the saved image; over white below it, a pale yellow band (1.2:1), visible with full vision but faint for low vision.
- **Visual:** `shots/5-marks-backgrounds-annotated.png` (top left: a highlight on the dark header that cannot be seen; bottom: the same highlight on white); `shots/6-editor-marked-highlight-annotated.png` ("Highlight gone on dark").
- **Recommendation:** Keep the multiply blend on light pixels and make the highlight show on dark ones too, so the marked area reads at 3:1 on any ground.
- **Tradeoff:** Alternatives from the evaluators: (a) lighten on dark pixels (a screen blend, or a yellow fill with a thin yellow outline), which lowers the contrast of dark text under it a little; (b) always add a thin outline and keep the fill, which keeps the text intact but makes the highlight look more like a box.
- **Decision needed:** On dark screens, should the Highlighter lighten the area, or keep its fill and add an outline?
- **Verified:** seen on screen (pixels read from the editor's canvas after a real drag).
- **Owner's words:** "Help me think about how we can highlight stuff and potentially add UI elements, like being able to add a card and write on the card, so I can actually edit on the screen and drag and drop, size, and so on." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor, Highlighter (key 6), and every saved image, PDF and ZIP that carries one; scenes: sharing with a person, reviewing an overnight build on a dark-mode build; build main v0.9.0
- Broken: WCAG 2.2 1.4.11 Non-text Contrast (AA) for a graphical object needed to understand the content; checklist accessibility 2; Nielsen 1 (the mark gives no feedback where it fails); Maze: limitations in the journey
- Code: `src/editor.ts:86-91` (`globalAlpha 0.45`, `multiply`: yellow × black = black)
- Numbers (highlight result vs its ground): white 1.22, #f4f4f5 1.22, #18181b 1.02, blue #2563eb 1.40, red #dc2626 1.03
- Screenshots: 5-marks-backgrounds.png, 5-marks-backgrounds-annotated.png, 6-editor-marked.png, 6-editor-marked-highlight-annotated.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 5-05 (lighten on dark, or add an outline), 6-28 (Medium; a thin yellow outline or a screen blend; called it routine)
- Guideline: none accepted yet (rule area: editing)

</details>

### F055 · Resize handles are 4.5 points square

- **Impact:** High · Anyone with less than perfect pointer control, and most people on a trackpad, has to hit a square the size of a full stop to resize a mark or card; a miss moves the mark instead, or starts a new one.
- **Current experience:** Selecting a box shows eight hollow squares and a rotate handle. They are drawn in the screenshot's own pixels and shrink with it: on a Retina screenshot at the editor's smallest size (1180 wide) they measure 4.5 points on screen, at 1920 wide 8.5 points. The rotate handle above the mark is the same size, though no mark needs rotating.
- **Visual:** `shots/5-handles-annotated.png` (three of the nine handles boxed, zoomed 2.5×); `shots/3-handles-1180-zoom-annotated.png` (enlarged four times).
- **Recommendation:** Size the handles in screen points, not image pixels, so each has at least a 24 × 24 point hit area at any window size (drawn at about 10 points). On very small marks, hide the middle handles, as Figma does. Their colour is a separate finding.
- **Tradeoff:** Larger handles cover more of a small mark while it is selected. One evaluator also suggests dropping the rotate handle, which no mark needs.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen (handle size 13 image pixels × display scale 0.345 = 4.5 points, read from the running editor; the 1440 and 1920 sizes computed from the same rule).
- **Owner's words:** "Help me think about how we can highlight stuff and potentially add UI elements, like being able to add a card and write on the card, so I can actually edit on the screen and drag and drop, size, and so on." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor canvas, Select tool, any resizable mark (box, ellipse, cross, remove area, highlight, spotlight, card, cut piece, arrow, pen); scenes: reviewing an overnight build, a quick verdict; build main v0.9.0
- Broken: WCAG 2.2 2.5.8 Target Size (Minimum) (AA); the spacing exception does not apply, since each handle sits on the mark's own border, which is itself a target (move); Fitts's law; checklist accessibility 3
- Code: `src/editor.ts:21-26` (canvas created with Fabric defaults; `enableRetinaScaling: false`), CSS-only scaling in `fit()` at `src/editor.ts:820-826`; no `cornerSize`/`touchCornerSize` override anywhere
- Probe results: `cornerSize: 13`, `touchCornerSize: 24` (touch only), `cssScale: 0.345`, controls `ml mr mb mt tl tr bl br mtr`
- Screenshots: 3-handles-1180.png, 3-handles-1180-zoom.png, 3-handles-1180-zoom-annotated.png, 5-light-handles.png, 5-handles-annotated.png
- Earlier IDs: 2026-09-25 audit F017 (still true, same measurements)
- Other products: Figma and macOS Markup keep handles at a fixed screen size at any zoom
- Seen by: 3-03 [the size part] (Medium; about 10 points, white fill with a dark outline), 5-03 (a 24-point hit area; consider dropping the rotate handle). Related: F082, F086.
- Guideline: none accepted yet (rule area: accessibility)

</details>

### F056 · Choosing a tool from the keyboard throws focus back to the top

- **Impact:** High · A keyboard or screen reader user who presses Enter or Space on a toolbar button loses their place: focus falls to the page itself and the next Tab starts again at Select.
- **Current experience:** With focus on the Reference button, Enter chose Reference, and focus was then on nothing (the page body); a screen reader says nothing. The next Tab landed on Select, the first button. Space on Box does the same (it switched to Ellipse and dropped focus). Every tool change rebuilds the whole toolbar, so the focused button no longer exists.
- **Visual:** `shots/5-toolbar-focus-before.png` (focus ring on Reference) and `shots/5-toolbar-focus-after.png` (after Enter: no focus ring anywhere).
- **Recommendation:** Update the existing buttons (icon, label, pressed state, dots) instead of replacing them, so the focused button stays focused after Enter or Space; or, failing that, put focus back on the matching button after the rebuild.
- **Tradeoff:** None worth naming; the rebuild exists only because it was the shortest code.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen (real Enter and Space key events; the focused element read before and after).
- **Owner's words:** "This is also important: when I create, as I said, it needs to be shortcuts so I can just do this on the fly." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor toolbar, all eight tool buttons; scene: reviewing an overnight build; build main v0.9.0
- Broken: WCAG 2.2 2.4.3 Focus Order (A); 2.1.1 Keyboard (A) in effect, since each choice costs a trip back through the toolbar; Nielsen 4; Shneiderman shortcuts
- Code: `src/editor.ts:303-334` (`renderToolbar` calls `toolsEl.replaceChildren` on every `applyTool`), `src/editor.ts:318`, `src/editor.ts:226-244`
- Probe results: `beforeEnter` = button "Reference"; `afterEnterOnToolButton` = body; `afterEnterThenTab` = button "Select"; `afterSpaceOnBox` = body
- Screenshots: 5-toolbar-focus-before.png, 5-toolbar-focus-after.png
- Earlier IDs: none
- Other products: Figma documents keyboard toolbar navigation with a continuous focus route
- Seen by: 5-02, 8-11 (Medium; read in the code; update the buttons or restore focus after the rebuild). Related: F048.
- Guideline: none accepted yet (rule area: keyboard and focus)

</details>

### F057 · The screenshot has no name or description for a screen reader

- **Impact:** High · A blind or low-vision teammate using VoiceOver finds two unnamed "canvas" objects where the screenshot is, and nothing about the marks on it; the References list says "1", "2" with no link to where they are.
- **Current experience:** The editor's accessibility tree shows the main area with two unnamed canvas objects. Marks exist only as pixels. A screen reader user can type the comment and notes but cannot learn what was captured or what has been marked.
- **Visual:** `shots/5-tab-order-annotated.png` (the pink area, never reached by Tab, is also what a screen reader cannot perceive).
- **Recommendation:** Give the image area the role of an image and a name ("Screenshot from 14:32, 3 marks"), and keep a visually hidden list of marks next to it ("Box 1, top right, around 'New order'"; "Reference 2 at 40%, 60%"), updated with every change. The same list is what a keyboard route through the marks would step through.
- **Tradeoff:** Describing where a mark is in words is approximate; positions as percentages are honest and cheap.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen (the Chromium accessibility tree, read through the DevTools protocol).
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor, the image; scenes: sharing with a person, reviewing an overnight build; build main v0.9.0
- Broken: WCAG 2.2 1.1.1 Non-text Content (A), 4.1.2 Name, Role, Value (A)
- Code: `src/editor.html:281` (`<canvas id="canvas">` with no role or label; Fabric adds a second unnamed canvas)
- Probe result: `main "" > Canvas "" , Canvas ""`
- Screenshots: 5-tab-order-annotated.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 5-10. Related: F048, F087, F089.
- Guideline: none accepted yet (rule area: accessibility)

</details>

### F058 · Closing a screenshot without saving says nothing about where it went or for how long

- **Impact:** Medium · Every way out of the editor other than saving closes it without a word, so a reviewer who closed one by mistake does not know it can come back, from where, or for how long.
- **Current experience:** "Discard ⌘W", ⌘W, the window's close button and Esc all close the editor at once, even with marks and notes. The capture and its marks go to Discarded for 7 days. The only places that say so are the Keyboard Shortcuts window ("the screenshot; Reopen Last Discarded in the menu brings it back"), the README and a later recovery dialog; the menu's "Reopen Last Discarded" and "Reopen Discarded…" appear only afterwards, and old items are cleared automatically.
- **Visual:** No screenshot: nothing appears on screen when the window closes. The Discard button is in `shots/6-editor-empty-annotated.png` and `shots/7-editor-empty-1180-annotated.png`.
- **Recommendation:** After a close without saving, say once where the screenshot went, with a way back: a quiet notification "Screenshot discarded. Click to reopen it." that reopens the editor with its marks.
- **Tradeoff:** A notification per discard is noise in a fast run with deliberate discards, in a flow that already sends several. Alternatives from the evaluators: (a) a notification only when the capture had marks or text; (b) a notification only the first few times; (c) no notification, but a quiet line next to Discard, "Recoverable for 7 days", with expiry dates shown in the recovery list.
- **Decision needed:** Should closing a screenshot without saving say where it went and for how long, and should that be a notification with Reopen or a line next to the Discard button?
- **Verified:** read in the code.
- **Owner's words:** "I think another thing is, if I took a screenshot, annotated it, and discarded it, it is gone. I just wonder if we should introduce a shortcut with Escape and be able to recover it so nothing ever gets lost." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor Discard button, ⌘W, Esc, window close; menu Reopen Last Discarded; build main v0.9.0
- Broken: Nielsen 1, 3, 5, 6; Shneiderman informative feedback; Laws of UX: mental model, Zeigarnik effect (unfinished work invisible); writing: every destructive action says whether it can be undone; rule area feedback and notifications
- Code: `src/editor.ts:780-783`, `787`, `795-803`, `817`; `src/editor.html:289`; `src/main.ts:226-231` (no notification), `src/main.ts:371-378`, `553-557`, `575`; `src/menu.ts:82-84`; `src/sessions.ts:151`, `184-200` (expiry cleanup)
- Screenshots: 6-editor-empty-annotated.png, 7-editor-empty-1180-annotated.png, 2-shortcuts-window.png (the one sentence that explains it, below the fold)
- Earlier IDs: none
- Other products: macOS Screenshot leaves the thumbnail for a few seconds before it goes; Mail and Finder offer Undo after a delete; CleanShot X keeps closed captures in a bounded capture history
- Seen by: 2-13 (notification, perhaps only with marks or text or the first few times), 6-23 (notification with Reopen when there were marks; called it routine), 7-04 (notification only with marks or text; called it routine; the silent close also seen in a scripted run), 8-23 ("Recoverable for 7 days" next to Discard, expiry dates in recovery) (seen by 3 evaluators). Related: F051, F062.
- Guideline: none accepted yet (rule area: feedback and notifications)

</details>

### F059 · Every editor window is titled "Snapmark"

- **Impact:** Medium · With two or three editors open (a pile of captures, or a capture and an Edit Again), the Dock's window list, the Window menu, Mission Control, ⌘` and VoiceOver's window list show windows all called "Snapmark".
- **Current experience:** The editor window is created as "Snapmark — <session>", but the page's own title "Snapmark" replaces it once loaded, for a new capture and for Edit Again alike. The session window, by contrast, is titled "2026-09-28 14.32 — Snapmark", name first, so the two kinds of window also read differently.
- **Visual:**

  | Where                     | Before     | After                                      |
  | ------------------------- | ---------- | ------------------------------------------ |
  | Editor title, new capture | "Snapmark" | "New screenshot · 28 Sep 14.32 — Snapmark" |
  | Editor title, Edit Again  | "Snapmark" | "Screenshot 001 · 28 Sep 14.32 — Snapmark" |

  No screenshot: the title bar is outside what the harness captures.

- **Recommendation:** Title each editor by what it holds and where it goes, document first and app last, in the order the session window already uses.
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code; confirmed by a script run on the build (no screenshot).
- **Owner's words:** "Yeah one thing I noticed is that when the window is open there's no icon or anything at the bottom to show that it's open." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor window title; Dock window list; Window menu; Mission Control; build main v0.9.0
- Broken: Nielsen 1, 6; WCAG 2.2 2.4.2 Page Titled (A); Laws of UX: law of similarity; checklist navigation 3 (location on deep pages)
- Code: `src/main.ts:199` (`title: Snapmark — ${session}`), overridden by `src/editor.html:6` (`<title>Snapmark</title>`; Electron lets the page title win unless `page-title-updated` is prevented); `src/viewer.ts:21` sets `document.title` correctly
- Script: `EDITOR_TITLE: "Snapmark"`; `editorTitleAtCreate "Snapmark — probe"`, `editorTitleAfterLoad "Snapmark"`; `getTitle()` returned "Snapmark" for a new capture and for Edit Again; `windowTitle: "Snapmark"`
- Screenshots: none (title bar not captured)
- Earlier IDs: sitemap 2026-09-25 ("the page replaces it with Snapmark"), still true at v0.9.0
- Other products: macOS Markup windows are titled by file name; Xnapper and CleanShot X name annotation windows by capture name or time
- Seen by: 1-20 [the title part] (Medium; "Screenshot → 28 Sep 09.14"), 2-20 [the title part] ("28 Sep 14.32 · 14:35 — Snapmark"), 4-44 (Low), 5-19 (Low; "Mark up · <session> — Snapmark"), 6-34 (Low; "<time> · <session> — Snapmark"), 7-25 [the title part] ("Checkout review — Snapmark") (seen by 2 evaluators). Related: F066, F060.
- Guideline: none accepted yet (rule area: navigation)

</details>

### F060 · The destination session shows only as a grey "→ name", at the far end from "Add to session"

- **Impact:** Medium · After a new session, wanted or not, a Switch Session or a moved folder, nothing that stays on screen tells the reviewer where "Add to session" will put the screenshot: the notification is gone in seconds, and a first-time reviewer does not read the grey corner text as a session at all.
- **Current experience:** The toolbar ends at the top right with "→ audit" or "→ 2026-09-28 14.32": an arrow and the session's folder name in small grey type, with no word such as "session", no count, no tooltip, nothing marking a session that has no screenshots yet, and it cannot be clicked. The footer's button reads "Add to session ⌘↵" without saying which; at the smallest window size the two are about 500 pixels apart.
- **Visual:** `shots/2-editor-1180-annotated.png`, `shots/4-editor-strings-annotated.png` (box on "→ audit"), `shots/6-editor-empty-annotated.png` ("Where it saves: no label"), `shots/7-main-editor-annotated.png`. Proposals: `shots/4-proposal-new-session-keys.png` (bottom lines), `shots/7-proposal-editor-header.png`.

  | Where             | Before               | After (options from the evaluators)                                       |
  | ----------------- | -------------------- | ------------------------------------------------------------------------- |
  | Editor, footer    | "Add to session ⌘↵"  | "Adding to 28 Sep 14.32 ▾" above the buttons, or "Add to 28 Sep 14.32 ⌘↵" |
  | Editor, top right | "→ 2026-09-28 14.40" | "Adding to: 28 Sep 14.40 · new"                                           |
  | Editor, top right | "→ 2026-09-28 14.03" | "Adds to: 28 Sep 14.03 (7 screenshots)"                                   |

- **Recommendation:** Name the destination in words, with the menu's short form of the session name, and mark a session that has no screenshots yet. Whether it can also be changed from here is the next finding.
- **Tradeoff:** More words in a toolbar that already fills the window at its smallest size; a long session name needs truncating in the button. Alternatives from the evaluators: (a) move the name to the footer, next to the button that uses it, and drop it from the toolbar; (b) "Adding to: <session> · new" in the header; (c) "Adds to: <session> (7 screenshots)" in the header.
- **Decision needed:** Where should the editor name the destination (the header or next to "Add to session"), and should it show "new" or the screenshot count?
- **Verified:** seen on screen.
- **Owner's words:** "I also wonder: where do I access the session? Is this in the toolbar of my Mac? Is this where I am supposed to see it or where would I see that?" — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor header and footer; notification after ⌃⇧2; build main v0.9.0
- Broken: Nielsen 1, 6; writing rule "a disappearing message never carries the only copy of something the user needs"; writing: one name per thing; Laws of UX: law of proximity, Fitts's law (reading distance), selective attention, working memory; rule area feedback
- Code: `src/editor.ts:831` (`→ ${session}`), `src/editor.html:279` (`.session`, `margin-left: auto`, muted), `src/editor.html:289-290` (buttons), `src/main.ts:115` (notification)
- Screenshots: 2-editor-1180-annotated.png, 4-editor-strings.png, 4-editor-strings-annotated.png, 4-editor-edit-again.png, 4-proposal-new-session-keys.png, 6-editor-empty.png, 6-editor-empty-annotated.png, 7-main-editor.png, 7-main-editor-annotated.png, 7-proposal-editor-header.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 2-22 (Low; the footer; called it routine), 4-02 ("Adding to: <session> · new", optionally a picker), 6-31 (Low; "Adds to: … (7 screenshots)"; called it routine), 7-25 [the header label part] ("Adds to Checkout review · 14 screenshots") (seen by 2 evaluators). Related: F061, F059, F101, F020.
- Guideline: none accepted yet (rule area: feedback and notifications)

</details>

### F061 · The editor cannot change which session the screenshot goes to

- **Impact:** Medium · A reviewer who notices that the open screenshot is headed for the wrong session, after a slip onto New Session or a forgotten switch, must add it there and fix it later by hand, or discard it and switch in the menu.
- **Current experience:** The editor fixes its session when it opens. Switch Session or New Session in the menu bar changes the current session for the next capture only; the open editor keeps adding to the old one, and its header still says so, far from the button. The destination is plain text; the editor has no session control and no route to the session window.
- **Visual:** `shots/1-editor-inuse-annotated.png` (the session name at the top right, the only place it appears). Proposal: `shots/7-proposal-editor-header.png`.
- **Recommendation:** Make the destination a small menu ("→ 28 Sep 09.14 ▾") with the recent sessions, the current one ticked, "New Session…" and "Open Session". Choosing there changes where this screenshot goes, and only this one. When the current session changes in the menu bar while an editor is open, say so in the editor: "The current session is now X. This screenshot still goes to Y. [Move it to X]".
- **Tradeoff:** One more control in an already full toolbar or footer, and a new behaviour to test; choosing another session here must not change the current session silently.
- **Decision needed:** Should the editor let the reviewer choose the session this screenshot goes into?
- **Verified:** read in the code.
- **Owner's words:** "It needs to be some sort of project or session. If there's an existing session I just add to the existing session or I create a new session." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor header or footer; menu bar Switch Session and New Session while an editor is open; build main v0.9.0
- Broken: Nielsen 3, 6, 7; Shneiderman easy reversal; Laws of UX: mental model, Tesler's law (the user carries the cost of a wrong target); Maze: limitations in the journey; checklist navigation 5 (a way back)
- Code: `src/main.ts:191-193` (session fixed at open), `src/main.ts:561` (makeCurrent → `setActive`), `src/main.ts:110-116` (newSession); the editor's session changes only on Rename (`src/main.ts:479`); `src/editor.html` `<span class="session" id="session">`, whose text `src/editor.ts` only sets
- Screenshots: 1-editor-inuse-annotated.png, 2-editor-1180-annotated.png, 7-proposal-editor-header.png
- Earlier IDs: 2026-09-25 proposed sitemap (a session menu in the editor footer), not built
- Other products: Xnapper and CleanShot X choose the save destination in the window (Save As, destination menu); macOS Screenshot sets it in the ⌘⇧5 Options menu before capture; Linear's and Jira's capture dialogs show the target project as a picker next to the submit button
- Seen by: 1-21 [the choose-destination part] (Low; a menu button with "Open Session" last), 2-21 (the footer menu, and a line when the menu bar session changes), 6-02 [the editor-target part] (a pop-up on the label), 7-25 [the chip part] (a chip that changes the session for this capture) (seen by 2 evaluators). Related: F060, F049, F101, F139, F020.
- Guideline: none accepted yet (rule area: navigation)

</details>

### F062 · "Add to session" ends with the window vanishing, and nothing says it worked

- **Impact:** Medium · The main scene ends every capture with no sign of success, so the reviewer cannot tell an add from a close, or which number and session it went to, without opening the menu or the session.
- **Current experience:** ⌘↵ or "Add to session" greys the button for a moment and the window closes. No notification, no sound, no change to the menu bar icon; the count in the menu's header ("· 4 screenshots") goes up the next time the menu is opened. A discard looks exactly the same.
- **Visual:** No screenshot: the window is gone and nothing else appears.
- **Recommendation:** Confirm quietly, where the reviewer looks next, naming the number and the session ("Added 004 to 28 Sep 14.32"), so the two exits, added and discarded, look different.
- **Tradeoff:** A banner per capture in a run of twenty is noise; a change to the icon is quieter but easy to miss, and some people find menu bar animation distracting. Alternatives from the evaluators: (a) a short notification "Added 004 to 28 Sep 14.32" that opens the session window when clicked; (b) the menu bar icon briefly shows a tick or the new count (all four evaluators name it, and it suits the owner's quick scene); (c) a notification for the first few saves only, then the icon.
- **Decision needed:** How should Snapmark confirm an added screenshot: a notification, a tick or count on the menu bar icon, a notification for the first few only, or nothing?
- **Verified:** read in the code.
- **Owner's words:** "Yeah one thing I noticed is that when the window is open there's no icon or anything at the bottom to show that it's open." — 2026-09-25. "This is also important: when I create, as I said, it needs to be shortcuts so I can just do this on the fly." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor "Add to session ⌘↵"; menu bar icon; build main v0.9.0
- Broken: Nielsen 1; Shneiderman informative feedback, dialogs that yield closure; Laws of UX: peak-end rule; checklist content 7 (clear confirmation after important actions)
- Code: `src/main.ts:246-258` (save, then close the window; no `notify`), `src/editor.ts:756-778`
- Screenshots: none (the window is gone)
- Earlier IDs: none
- Other products: macOS Screenshot shows a thumbnail sliding into the corner; CleanShot X shows its overlay with the result; Xnapper confirms a copy with a toast
- Seen by: 2-23 (a notification, or a count badge on the icon), 4-66 (Low; the icon rather than a banner), 6-64 (Low; the icon, and a notification for the first few saves), 7-53 (Low; the icon) (seen by 2 evaluators). Related: F058, F172.
- Guideline: none accepted yet (rule area: feedback and notifications)

</details>

### F063 · Pressing the key of the tool that is already on switches to its sibling

- **Impact:** Medium · Every reviewer who presses a tool's key "to make sure" gets the other tool on that key, from the very first press: the editor opens on Box, so pressing 2 gives Ellipse, and the rhythm "1, click, type; 1, click, type" gives a reference, then a card.
- **Current experience:** Seen twice. On a fresh editor, 2 and a drag drew an ellipse where a box was meant (the ellipse at "Orders" in the main-scene run). Pressing 1, clicking, typing "First issue", then 1 and a click again switched to Card and no reference 2 appeared. The same happens on every key with two tools: 1 (Reference, Card), 2 (Box, Ellipse), 5 (Cross, Remove area), 6 (Highlighter, Spotlight), 7 (Cut & move, Redact). A key picks its group, and pressing it again while the group is on steps to the next tool, whether or not anything was drawn in between.
- **Visual:** `shots/6-color-fixed-annotated.png` ("Pressed 2 while on Box: got Ellipse"); `shots/7-key-cycles-annotated.png`; `shots/7-main-editor.png` (the ellipse at "Orders" was meant as a box).
- **Recommendation:** Let a single press keep the tool the key is showing, and step to the sibling only on a deliberate second press. The owner's "press the same button again to switch" still works; the toolbar icon and dots already show which one is on.
- **Tradeoff:** A slightly less uniform rule for a reviewer who has learnt to press twice. Alternatives from the evaluators: (a) step to the sibling only when the key is pressed again right away, within about a second or before drawing; (b) step only when nothing was drawn with the current tool since the last press, so after a mark is placed the same key keeps the same tool.
- **Decision needed:** When should pressing a tool's key again switch to its sibling: only within about a second, or only when nothing was drawn since the last press?
- **Verified:** seen on screen.
- **Owner's words:** "When I press the same button multiple times, let's say I have the 1 button, I would switch between the shapes and it would indicate it at the top." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor toolbar keys 1, 2, 5, 6, 7; build main v0.9.0
- Broken: Nielsen 4 (the same key does two things depending on hidden state), 5 error prevention; Laws of UX: mental model (a key "selects" a tool), cognitive load (the reviewer must track which tool is on before pressing its key)
- Code: `src/editor.ts:226-230` (`pickGroup`), `src/editor.ts:33` (starts on Box)
- Screenshots: 6-color-fixed.png, 6-color-fixed-annotated.png, 7-key-cycles.png, 7-key-cycles-annotated.png, 7-main-editor.png
- Earlier IDs: none
- Other products: Figma cycles only with ⇧ plus the key (⇧O, ⇧R), so a plain key always picks the same tool; macOS Preview puts siblings behind a second key or a long press
- Seen by: 6-24 (cycle only within about a second), 7-24 (cycle only when nothing was drawn since the last press) (seen by 2 evaluators). Related: F107.
- Guideline: none accepted yet (rule area: keyboard and focus)

</details>

### F064 · How to give a card a pointer line is explained nowhere on screen

- **Impact:** Medium · A reviewer who wants a card that points at something must know to press on the target and release where the card goes; a plain click, the natural first try, makes a card without a line, and there is no way to add a line afterwards.
- **Current experience:** The Card tooltip reads "Card (1) · press again for Reference". The Keyboard Shortcuts window says "a yellow card whose text is a comment about what its line points at", but not how to make the line. The gesture is described only in the README.
- **Visual:** `shots/6-editor-marked.png` (a card with its line, made by the drag); `shots/6-shortcuts-light.png` (the description without the gesture).

  | Where        | Before                                 | After                                                                                                 |
  | ------------ | -------------------------------------- | ----------------------------------------------------------------------------------------------------- |
  | Card tooltip | "Card (1) · press again for Reference" | "Card (1): click to place, or drag from what it's about to where it goes · press again for Reference" |

- **Recommendation:** Put the gesture in the tooltip and in the Keyboard Shortcuts window (a routine wording fix). Beyond the wording, two behaviour changes were proposed; they are the owner's call.
- **Tradeoff:** A longer tooltip; guidance on screen takes space and should go quiet once learnt. Alternatives from the evaluators beyond the wording: (a) let a selected card grow a line from a handle, so a card placed by a click can still point; (b) show the instruction when Card becomes active, with a preview of the line while dragging.
- **Decision needed:** Besides the tooltip, should a card be able to grow a line after it is placed, and should the line show while dragging?
- **Verified:** read in the code.
- **Owner's words:** "Help me think about how we can highlight stuff and potentially add UI elements, like being able to add a card and write on the card, so I can actually edit on the screen and drag and drop, size, and so on." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor Card tool (key 1, second press); Keyboard Shortcuts window; build main v0.9.0
- Broken: Nielsen 6, 10; Laws of UX: paradox of the active user, uniform connectedness, mental model
- Code: `src/editor.ts:460-472` (the gesture), `src/editor.ts:315-316`; `src/tools.ts:47-52` (no `tip`); README Cards section
- Script: the tooltip pattern "Reference (1) · press again for Card" read back in a run
- Screenshots: 6-editor-marked.png, 6-shortcuts-light.png
- Earlier IDs: none
- Other products: no directly matching gesture was verified
- Seen by: 6-40 (Low; tooltip and Keyboard Shortcuts window, and a handle to grow a line; called the wording routine), 8-12 (a hint when Card becomes active and a line preview while dragging) (seen by 2 evaluators). Related: F076, F085.
- Guideline: none accepted yet (rule area: editing)

</details>

### F065 · There is no way to the list of keys from inside the editor

- **Impact:** Medium · The keys are how the owner wants to work, yet a reviewer in the editor who wants the full list must leave it for the menu bar icon, then Settings, then Keyboard Shortcuts.
- **Current experience:** The editor has tooltips on the tool buttons and the key under each one ("Cross (5) · press again for Remove area"). There is no "?" button, no Help menu and no key that opens the list, so a first-time reviewer who does not know what 5 or 7 do hovers icons one by one.
- **Visual:** `shots/2-editor-1180.png` and `shots/7-editor-empty-1180.png` (no help control in the toolbar or footer); `shots/7-keyboard-shortcuts.png` (the window it could open).
- **Recommendation:** Open the Keyboard Shortcuts window from the editor. Where the list sits in the menu bar menu is a separate finding.
- **Tradeoff:** One more control in an already full toolbar. Alternatives from the evaluators: (a) a "?" button at the end of the toolbar plus ⌘/; (b) the "?" key (⇧/), which must not fire while typing in a note (the editor already ignores keys in notes).
- **Decision needed:** How should the editor open the list of keys: a "?" button with ⌘/, the "?" key, or both?
- **Verified:** seen on screen.
- **Owner's words:** "ok can you show the shortcut keys again." — 2026-09-26. "I think everything is not very intuitive." — 2026-09-28

<details><summary>Supporting notes</summary>

- Where: editor toolbar and footer; menu Settings ▸ Keyboard Shortcuts; build main v0.9.0
- Broken: Nielsen 6, 10; Laws of UX: Jakob's law (⌘/ or ⌘? for help on the Mac), paradox of the active user; checklist navigation 6 (two paths to main screens); rule area first run and help
- Code: `src/editor.html:274-280` (the header has no help control), `src/menu.ts:115-130` (Keyboard Shortcuts at `src/menu.ts:128`), `src/main.ts:508-537`
- Screenshots: 1-editor-empty.png, 2-editor-1180.png, 7-editor-empty-1180.png, 7-keyboard-shortcuts.png
- Earlier IDs: menu audit 2026-09-26 M11 (Keyboard Shortcuts is help, not a setting); decision 2026-09-26 "Help menu removed: Keyboard Shortcuts moves into Settings"
- Other products: Figma opens its shortcut panel with ⌃⇧? from anywhere in the editor; Shottr opens a shortcut sheet with "?"
- Seen by: 1-07 [the editor part] ("?" button and ⌘/), 2-42 ("?" and ⌘/; called it routine), 6-09 [the editor part] (⌘/ or a "?" button), 7-38 [the editor part] (the "?" key or ⌘/) (seen by 2 evaluators). Related: F003, F053.
- Guideline: none accepted yet (rule area: first run and help)

</details>

### F066 · A new editor opens exactly on top of the previous one, and open editors cannot be found

- **Impact:** Medium · A reviewer who captures again before finishing the last screenshot cannot see that the earlier editor is still open, and has no list to find it by.
- **Current experience:** Measured: two editors opened one after the other sat at the same place and size, the second hiding the first completely. Every editor is centred, with no position of its own. Together with the identical titles, the Dock's window list shows "Snapmark", "Snapmark", and the menu bar menu lists no open editors; the Dock icon only shows that some window is open.
- **Visual:** No screenshot: stacking cannot be shown in one picture; the measured positions are in the supporting notes. The editor's size and centring are visible in `shots/1-editor-empty.png`.
- **Recommendation:** Make a pile of editors visible as a pile, and findable.
- **Tradeoff:** Cascaded windows drift across the screen in a long run (reset the offset when no editor is open); a menu list of editors adds a row that is empty most of the time. Alternatives from the evaluators: (a) open each new editor offset from the last (cascade); (b) list open editors in the menu bar menu ("Open Editors ▸"). They can be combined.
- **Decision needed:** Should a new editor open offset from the previous one, and should the menu list the open editors?
- **Verified:** read in the code; confirmed by a script run on the build (no screenshot).
- **Owner's words:** "Yeah one thing I noticed is that when the window is open there's no icon or anything at the bottom to show that it's open." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor windows opened in a row (Capture Screenshot, Capture Same Area, Edit Again); Dock window list; menu bar menu; build main v0.9.0
- Broken: Nielsen 1, 6; Laws of UX: law of common region, Zeigarnik effect; checklist navigation 3 (location)
- Code: `src/main.ts:196-201` (`openEditor` gives no x/y, so every editor is centred on the same spot)
- Script: `editorBounds1` equals `editorBounds2` (x 130, y 189, 1540 × 792)
- Screenshots: 1-editor-empty.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 1-12 [the part about each editor opening on top of the last] (cascade), 1-20 [the no-list part] (an "Open Editors ▸" menu), 2-20 [the stacking part] (cascade; called it routine). Related: F059, F032, F033.
- Guideline: none accepted yet (rule area: navigation)

</details>

### F067 · The editor and the session window show Electron's stock menu bar menus, not Snapmark's

- **Impact:** Medium · While a Snapmark window is in front, the Mac's menu bar offers developer commands and none of Snapmark's own, so a reviewer who looks there for a command, or for the list of keys, finds the wrong ones.
- **Current experience:** Read from the running app: an app menu (About, Services, Hide, Hide Others, Show All, Quit), File (Close Window ⌘W), Edit (Undo, Redo, Cut, Copy, Paste, Paste and Match Style, Delete, Select All, Substitutions, Speech), View (Reload ⌘R, Force Reload ⇧⌘R, Toggle Developer Tools ⌥⌘I, Actual Size, Zoom In, Zoom Out, Toggle Full Screen ⌃⌘F), Window (Minimize, Zoom, Bring All to Front). There is no Help menu, no Settings, no "Add to Session", no "Discard", no "Keyboard Shortcuts" and no "Capture"; ⌘, does nothing. Toggle Full Screen puts the editor on a full-screen Space of its own, which animates away when it is saved.
- **Visual:** No screenshot: the Mac's menu bar cannot be captured by the harness. The menu is listed above as text.
- **Recommendation:** Give Snapmark's windows their own menu bar menus, built from the same tool list as the toolbar so they never disagree: Snapmark (About, Keyboard Shortcuts… ⌘/, Quit), File (Add to Session ⌘↵, Discard ⌘W), Edit (Undo and Redo, Cut, Copy, Paste for the notes), Window, Help (Keyboard Shortcuts, README).
- **Tradeoff:** One more place that lists commands, kept honest only if it is generated from the same data. Alternative from the evaluators: a smaller change that only adds Keyboard Shortcuts (⌘/) to the app menu and under Help.
- **Decision needed:** Should the editor and the session window get Snapmark's own menu bar menus with Add to Session, Discard and Keyboard Shortcuts, or only a Keyboard Shortcuts item?
- **Verified:** read in the code; confirmed by a script run on the build (no screenshot).
- **Owner's words:** "ok can you show the shortcut keys again." — 2026-09-26

<details><summary>Supporting notes</summary>

- Where: the Mac menu bar while an editor or the session window is the key window; build main v0.9.0
- Broken: Nielsen 4 (platform standards), 10 (help where the task is); Jakob's law (help and settings in the app menu); checklist platform conventions; rule area first run and help
- Code: no `Menu.setApplicationMenu` anywhere in `src/`; `src/main.ts:508-537`, `src/menu.ts:128`
- Script: the default menu printed from the running app; in the script run the app menu read "Electron", in the packaged app it carries the app's name
- Screenshots: none (menu bar not captured)
- Earlier IDs: decision 2026-09-26 "Help menu removed: Keyboard Shortcuts moves into Settings", which was about the menu bar icon's menu, not the app menu bar
- Other products: CleanShot X and Shottr show their own File and Edit menus with Save, Copy and Close in the annotate window; macOS Preview's markup lives in its own menus
- Seen by: 2-07 (full own menus), 4-12 (Low; Keyboard Shortcuts ⌘/ in the app menu and under Help). Related: F053, F109, F110, F065.
- Guideline: none accepted yet (rule area: platform conventions)

</details>

### F068 · Marks cannot be copied, pasted or duplicated

- **Impact:** Medium · A reviewer who needs the same card, box or remove mark in three places has to draw it three times, and cannot carry a mark from one screenshot to the next.
- **Current experience:** With a box selected, ⌘C and ⌘V do nothing on the image; they work only as text copy and paste in the notes. There is no Duplicate, no ⌥-drag to copy and no right-click menu. Select moves, resizes and deletes, and nothing more.
- **Visual:** No screenshot: nothing visible changes. Proposal: select a mark → Copy and Paste, or Duplicate → a new mark that can be edited.
- **Recommendation:** ⌘C and ⌘V for the selected mark (pasted a few points offset, or at the pointer), ⌘D and ⌥-drag to duplicate, within one editor and between editors. Make clear in the tooltip that Cut & move works on the screenshot's pixels, not on marks.
- **Tradeoff:** Pasted references need new numbers and empty notes, which must be clear; linked pieces must keep their connections; pasting between windows adds work.
- **Decision needed:** Should marks support copy, paste and duplicate like shapes in Keynote or Figma, within one editor only or also between editors?
- **Verified:** read in the code.
- **Owner's words:** "Basically reviewing the designs, doing a complete UX/UI review of an overnight build, providing detailed feedback on different elements. I want to be able to draw inside the screenshots, also copy and paste stuff around, and work." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor canvas, Select tool; build main v0.9.0
- Broken: rule area copy and paste; Nielsen 4, 7; Shneiderman shortcuts; Jakob's law; flow
- Code: `src/editor.ts:388-427`, `src/editor.ts:603-618`, `src/editor.ts:785-807` (key handlers; only ⌘Z, ⌘↵ and ⌘W are handled with ⌘; no `copy` or `paste` listeners); `src/tools.ts:30-33`, `118-121`
- Screenshots: none
- Earlier IDs: 2026-09-25 audit F011 (still true)
- Other products: Keynote, Figma and macOS Markup (⌘D) duplicate shapes; Figma documents keyboard object workflows
- Seen by: 3-34, 8-35 (also clarify that Cut & move works on pixels)
- Guideline: none accepted yet (rule area: copy and paste)

</details>

### F069 · The screenshot cannot be zoomed to place a mark precisely

- **Impact:** Medium · At the editor's default size a full-window capture is shown at 69% of its real size (table text about 9 points), and there is no way to enlarge it to put a reference on the right word or cross out a small icon.
- **Current experience:** The screenshot always fits the space beside the side panel. Pinch, ⌘-scroll and a zoom control do nothing to it; there is no actual-size view and no panning. The stock View menu probably still offers Zoom In, which would enlarge the whole window, toolbar and panel included, not the screenshot (assumption, not checked).
- **Visual:** `shots/3-review-1180-light.png` (a 1200-point-wide page shown 828 points wide). Proposal: "Fit | 100% | − | +" in the toolbar.
- **Recommendation:** Zoom the screenshot only, keeping Fit as the opening view: pinch and ⌘-scroll around the pointer, ⌘0 to fit, ⌘1 for 100%, the percentage shown in the toolbar, and a way to pan. Marks keep their positions on the image whatever the zoom.
- **Tradeoff:** Zoom brings panning, and Space-drag or scroll for panning must not clash with drawing; more controls and transform handling.
- **Decision needed:** Should the editor get zoom (pinch, ⌘-scroll, fit and 100%)?
- **Verified:** seen on screen.
- **Owner's words:** "Basically reviewing the designs, doing a complete UX/UI review of an overnight build, providing detailed feedback on different elements." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor canvas, every window size; build main v0.9.0
- Broken: checklist responsive 5 (standard trackpad gestures); Nielsen 7; Fitts's law; Jakob's law; aesthetic-usability effect
- Code: `src/editor.ts:819-828` (`fit()` is the only scale), no wheel or gesture handler in `src/editor.ts`; `src/editor.html:132-137`, `274-290`
- Numbers: display scale 0.345 image pixel per point for a Retina capture at 1180
- Screenshots: 3-review-1180-light.png, 3-review-1920.png
- Earlier IDs: 2026-09-25 audit F018 (still true)
- Other products: macOS Markup, Figma and Preview zoom with pinch and ⌘-scroll; Shottr documents actual-size and step zoom
- Seen by: 3-41 (quoted the owner's "like Photoshop" wish), 8-14 (read in the code; Fit, 100%, − and +). Related: F055, F106.
- Guideline: none accepted yet (rule area: editing)

</details>

### F070 · The Undo button and ⌘Z undo different things

- **Impact:** Medium · A reviewer typing a note cannot predict whether Undo takes back the last words or the whole reference with its note, because the button and its key act on different histories.
- **Current experience:** The button "Undo ⌘Z" always acts on the history of marks. The key ⌘Z pressed inside a note first undoes the typing; clicking the button there instead removes the reference and its visible note. Redo behaves the same way.
- **Visual:** No screenshot: the difference shows only in what disappears. Proposal: "Undo typing" or "Undo reference", with the button and the key using the same context.
- **Recommendation:** Make the Undo and Redo buttons follow the same context as their keys, and say what they will undo next.
- **Tradeoff:** Clicking the button moves focus out of the note, so the editor must remember where the reviewer was typing.
- **Decision needed:** Should the Undo and Redo buttons act on the same history as ⌘Z and ⇧⌘Z?
- **Verified:** read in the code.
- **Owner's words:** "1. We need an undo button." — 2026-09-28

<details><summary>Supporting notes</summary>

- Where: editor header, Undo and Redo buttons; notes and cards; build main v0.9.0
- Broken: Nielsen 3, 4; Shneiderman easy reversal; Jakob's law; law of similarity
- Code: `src/editor.ts:584-618`, `src/editor.ts:814-815`; `src/editor.html:277-278`
- Screenshots: none
- Earlier IDs: none
- Other products: how comparison apps combine text and object undo was not verified
- Seen by: 8-15. Related: F105, F109.
- Guideline: none accepted yet (rule area: undo across the app)

</details>

### F071 · A reference circle sits on top of the thing it refers to

- **Impact:** Medium · The reviewer clicks on the element they mean and the numbered circle covers it, so the agent, and a person, cannot read the element the note is about.
- **Current experience:** Clicking the "New order" button with Reference centred circle 1 on the click and hid the middle of the label, leaving "Ne… er". The reviewer has to learn to click beside the element, or move the circle afterwards with Select.
- **Visual:** `shots/6-editor-marked-ref-annotated.png` ("Hides the label").
- **Recommendation:** Let a reference point at the click instead of covering it: place the circle just above and to the left of the click with a short pointer to the spot, like a card's line, or let the reviewer press on the element and release where the number should sit.
- **Tradeoff:** The circle sits a little further from the element, and a pointer adds a line to the image.
- **Decision needed:** Should a reference point at the click instead of covering it?
- **Verified:** seen on screen.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor, Reference tool (key 1); saved image; build main v0.9.0
- Broken: Nielsen 2 (a pointer points, it does not cover); Fitts's law (the reviewer must aim beside the target); output for AI: the mark hides the evidence
- Code: `src/editor.ts:148-153` (centred on the click), `src/editor.ts:433-439`
- Screenshots: 6-editor-marked.png, 6-editor-marked-ref-annotated.png
- Earlier IDs: none
- Other products: Figma comments pin their bubble with the point at the click and the bubble offset up and right; CleanShot X's counter tool can be dragged to add a pointer
- Seen by: 6-27 (the evaluator found no request about reference placement). Related: F118, F072.
- Guideline: none accepted yet (rule area: editing)

</details>

### F072 · Right after reference 1 is placed, the image shows "2" on top of it

- **Impact:** Medium · At the exact moment the reviewer types note 1, the circle under the pointer reads "2" while the side panel says "1", because the preview of the next reference is drawn over the one just placed until the pointer moves.
- **Current experience:** Press 1 and click the image: a solid red "1" appears, the note field "Note for 1" takes the cursor, and a see-through "2" is drawn exactly on it. The saved image is correct.
- **Visual:** `shots/4-editor-strings-annotated.png` (box on the circle).
- **Recommendation:** Draw the next-reference preview only once the pointer has moved off the reference just placed.
- **Tradeoff:** The preview appears a moment later.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen.
- **Owner's words:** "Also when I press the buttons 1, 2, 3, or whatever, I would like to see the shape. Can I drag it around or just move it around with the cursor?" — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor canvas, Reference tool; build main v0.9.0
- Broken: Nielsen 1, 4 (the number on the image and in the panel disagree); a hint that misleads
- Code: `src/editor.ts:503-506` (redraw on `mouse:up`: "the next reference shows its new number"), `src/editor.ts:265-275`
- Screenshots: 4-editor-strings.png, 4-editor-strings-annotated.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 4-21 (asked it as a decision; a display fault, so routine here). Related: F071.
- Guideline: none accepted yet (rule area: editing)

</details>

### F073 · Picking a colour does not recolour the selected mark

- **Impact:** Medium · A reviewer who drew a box in the wrong colour and picks another sees the swatch change and the box stay as it was, so the only fix is to delete the box and draw it again.
- **Current experience:** Draw a box, press C, click the box, then pick blue in the colour swatch. The swatch turns blue; the selected box stays red. The next mark drawn is blue.
- **Visual:** `shots/3-colour-swatch-annotated.png`.
- **Recommendation:** When a mark is selected, a colour choice applies to that mark (one undo step) as well as to the next ones; with nothing selected it sets the colour for the next marks, as today.
- **Tradeoff:** A reviewer who selects a mark and then picks a colour "for later" recolours that mark by surprise; Undo takes it back.
- **Decision needed:** Should a colour picked while a mark is selected change that mark?
- **Verified:** seen on screen (the box's stroke read back unchanged after the swatch was set to blue).
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor, colour swatch with the Select tool; build main v0.9.0
- Broken: Nielsen 3 (user control); Jakob's law (macOS Markup, Figma and Keynote recolour the selection)
- Code: `src/editor.ts:813` (`colorEl.oninput = () => applyTool()`; nothing reads the active object)
- Numbers: stroke `#e11d48` after the swatch was set to `#2563eb`
- Screenshots: 3-colour-swatch.png, 3-colour-swatch-annotated.png
- Earlier IDs: 2026-09-25 audit F028 (still true)
- Other products: macOS Markup, Figma and Keynote recolour the selected shape from the colour control
- Seen by: 3-04. Related: F092, F120.
- Guideline: none accepted yet (rule area: editing)

</details>

### F074 · Undoing a deleted reference brings it back last, with a new number

- **Impact:** Medium · A reviewer who deletes a reference by mistake and presses ⌘Z gets it back under a different number, and every reference after it has already moved up by one, so notes that say "see 2", or are read against the numbers on screen, are now wrong.
- **Current experience:** References 1 to 4 with notes. Select 1, press ⌫, press ⌘Z. The list now reads 1 "Wrong status colour", 2 "Align totals right", 3 "Customer names are private", 4 "Rename to Revenue (net)": the restored reference is number 4 and sits last, and the circles on the image carry the same new numbers. session.md is saved in that order.
- **Visual:** `shots/3-refs-undo-annotated.png`.
- **Recommendation:** Let Undo put a reference back in its old place in the order, so it gets its old number and the others return to theirs.
- **Tradeoff:** None for the reviewer; the order has to be stored with the undo step.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen (the list read before and after in the running page).
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor, References list and the circles on the image; saved session.md; build main v0.9.0
- Broken: Nielsen 3 (undo should restore, not rearrange); Shneiderman easy reversal
- Code: `src/editor.ts:514-516` (numbers are the position among markers), `src/editor.ts:532-541` (`remove()` re-adds with `canvas.add`, which appends at the end)
- Screenshots: 3-refs-undo-redact.png, 3-refs-undo-annotated.png
- Earlier IDs: 2026-09-25 audit F029 (still true)
- Other products: none noted
- Seen by: 3-06
- Guideline: none accepted yet (rule area: undo across the app)

</details>

### F075 · A redaction drawn over a reference hides it, and its note is still sent

- **Impact:** Medium · An agent reads note 3 in session.md and finds no circle 3 on the image, because the reviewer later redacted the area it sat in; the note is either ignored or applied to the wrong place.
- **Current experience:** Reference 3 sits on the customer names; the reviewer then redacts the names. The circle disappears under the pixelation, but "3 Customer names are private" stays in the list and is saved as "3. Customer names are private".
- **Visual:** `shots/3-refs-redact-annotated.png`.
- **Recommendation:** Keep references and cards above redactions (draw redactions under all marks), so a redaction hides the screenshot and never a mark.
- **Tradeoff:** A reviewer who wants to hide a mark cannot do it with Redact; deleting the mark does that job.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen (the saved session.md read back with four notes).
- **Owner's words:** "It's basically for providing feedback to AI in a nice and token-efficient way." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor canvas, Redact (key 7 again) over any mark; saved image and session.md; build main v0.9.0
- Broken: output for AI (every note maps to one visible mark); Nielsen 5 (error prevention)
- Code: `src/editor.ts:346-350` (`canvas.add(img)` puts the redaction on top), `src/editor.ts:25` (`preserveObjectStacking: true`)
- Screenshots: 3-refs-undo-redact.png, 3-refs-redact-annotated.png
- Earlier IDs: 2026-09-25 audit F032 (still true)
- Other products: none noted
- Seen by: 3-08. Related: F192.
- Guideline: none accepted yet (rule area: output for AI)

</details>

### F076 · Cards are missing from the side panel

- **Impact:** Medium · The side panel looks like the list of everything written on the screenshot, but it drops every card, so before pressing "Add to session" the reviewer cannot read or correct all the text the agent will receive in one place.
- **Current experience:** After reference 1, reference 2 and a card saying "Load more: make it infinite scroll", the side panel lists only the two references under "References". With twelve references and two cards, the panel shows the comment and twelve notes; "Card A" and "Card B" appear only on the image. A card's text reaches session.md as "- Card: …", and changing it needs the Select tool and a double-click on the card.
- **Visual:** `shots/1-editor-inuse-annotated.png` (the card, and the panel without it); `shots/3-cards-annotated.png`.
- **Recommendation:** List cards in the side panel under the references, with a card icon instead of a number, editable there like notes and linked to their mark (selecting the line selects the card), so the panel is the complete text of the screenshot.
- **Tradeoff:** A longer panel that scrolls sooner on busy screenshots, and two places to edit a card's text.
- **Decision needed:** Should cards be listed, and editable, in the side panel with the references?
- **Verified:** seen on screen.
- **Owner's words:** "Help me think about how we can highlight stuff and potentially add UI elements, like being able to add a card and write on the card, so I can actually edit on the screen and drag and drop, size, and so on." — 2026-09-25. "In the window there should be a footer. Our footer notes in the sidebar should actually take as much space as they need." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor side panel; session.md; build main v0.9.0
- Broken: Nielsen 4, 6; levels of detail; Laws of UX: law of common region (the panel reads as "all text"), law of uniform connectedness; rule area side panels and detail pages
- Code: `src/editor.ts:719-752` (`renderRefs` covers markers only), `src/sessions.ts:70-75` (cards and moves in the entry)
- Screenshots: 1-editor-inuse.png, 1-editor-inuse-annotated.png, 1-session-doc.png, 2-editor-1180.png, 3-many-refs-1180.png, 3-cards-annotated.png
- Earlier IDs: 2026-09-25 audit F031 (still true); glossary proposal row "card" ("never called a note")
- Other products: Figma lists every comment pin in its comments panel; FigJam stickies are not listed anywhere (the Snapmark card is closer to a sticky); Xnapper and CleanShot X have text boxes and no list
- Seen by: 1-17 [the part about cards not being listed] (a card icon, editable in the panel), 2-51 [the cards part] (Low; linked to the mark), 3-22 (Low; "Card A", "Card B", editable). Related: F102, F219, F226, F064.
- Guideline: none accepted yet (rule area: side panels and detail pages)

</details>

### F077 · Closing an unchanged Edit Again files a copy under Discarded

- **Impact:** Medium · A reviewer who opens Edit Again just to look and closes it gets a "Reopen Last Discarded" for nothing, and that copy becomes the "Last Discarded", so the menu item no longer brings back the screenshot the reviewer actually threw away.
- **Current experience:** Session window → Screenshots → "Edit Again" opens the editor with "Save changes ⌘↵". Closing it with Discard, ⌘W, Esc or the close button, without changing anything, still files a Discarded item named "… · not saved". Any Edit Again closed without saving is filed the same way, changed or not.
- **Visual:** `shots/2-editor-edit-again-annotated.png` (the Edit Again editor). No screenshot of the Discarded item: the Discarded list is a Finder dialog.
- **Recommendation:** Closing an Edit Again with nothing changed leaves nothing behind; the entry is still in the session.
- **Tradeoff:** "Nothing changed" needs a reliable comparison with the opened state; a false "unchanged" would lose a small edit. For an Edit Again closed with changes, the evaluators offer: (a) ask "Save your changes to 003? [Save Changes] [Don't Save]", making Edit Again the one editor that asks on close; (b) keep the changed copy in Discarded, marked as a version of that screenshot, so reopening it offers "Save changes" to that entry.
- **Decision needed:** Should closing an unchanged Edit Again leave nothing in Discarded, and when it was changed, should Snapmark ask or keep the changed copy in Discarded?
- **Verified:** read in the code; confirmed by a script run on the build (no screenshot).
- **Owner's words:** "I think another thing is, if I took a screenshot, annotated it, and discarded it, it is gone. I just wonder if we should introduce a shortcut with Escape and be able to recover it so nothing ever gets lost. I think that would be nice." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: session window Edit Again → editor → close; menu Reopen Last Discarded; build main v0.9.0
- Broken: Nielsen 1, 3, 5; Postel's law; rule areas saving and unsaved work, confirmation and undo
- Code: `src/editor.ts:781-783` (`beforeunload` stashes on every close that is not a save), `src/main.ts:227-231` (`discardCapture` stores no entry number), `src/main.ts:340` (Edit Again opens on a temp copy)
- Script: `Discarded after closing an unchanged Edit Again: ['… · Session A · not saved']`; folder seen "2026-09-28 22.18.19 · probe · not saved"
- Screenshots: 2-editor-edit-again-annotated.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 1-26 [the part about the unchanged close] (leave no item; called the no-item change a decision), 2-14 [the same part] (leave no item; ask on a changed close), 3-38 [the same part] (Low; called it routine), 7-12 [the same part] (Low; called it routine). Related: F078, F079, F223.
- Guideline: none accepted yet (rule area: saving and unsaved work)

</details>

### F078 · A discarded Edit Again comes back as a new capture, so saving it adds a duplicate

- **Impact:** Medium · A reviewer who brings back a discarded Edit Again to finish the correction gets a second copy in the session instead, while the old entry stays as it was.
- **Current experience:** "Reopen Last Discarded" opens a discarded Edit Again as a plain editor with "Add to session ⌘↵" instead of "Save changes". Saving it appends a new entry 002 at the end of the session, and 001 is unchanged.
- **Visual:** No screenshot: checked by running the build; the script output is in the supporting notes.
- **Recommendation:** A discarded Edit Again remembers which entry it edits, so bringing it back reopens "Save changes" on that entry.
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code; confirmed by a script run on the build (no screenshot).
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: menu Reopen Last Discarded → editor → Add to session; build main v0.9.0
- Broken: Nielsen 4, 5; data integrity (a duplicate, not a loss)
- Code: `src/main.ts:227-231` (`discardCapture` keeps no `replace`), `src/main.ts:358-369` (`reopen` opens without `replace`)
- Script: `REOPENED_BUTTON: Add to session ⌘↵`; `A after saving the reopened Edit Again: [1, 2]`
- Screenshots: none
- Earlier IDs: none
- Other products: none noted
- Seen by: 1-26 [the duplicate part] (called it routine), 2-14 [the duplicate part], 3-38 [the duplicate part] (Low), 7-12 [the duplicate part] (Low). Related: F077, F010, F011.
- Guideline: none accepted yet (rule area: saving and unsaved work)

</details>

### F079 · "Save changes" in Edit Again replaces the saved screenshot for good

- **Impact:** Medium · A reviewer who reopens a saved screenshot, deletes or moves marks by mistake and presses "Save changes" cannot get the earlier version back: the image, its text and its kept marks are overwritten, and nothing goes to Discarded.
- **Current experience:** The button says "Save changes ⌘↵" and nothing more. After saving, the session.md entry, the image and the kept marks are replaced in place. Every other way of losing a screenshot in Snapmark (Discard, Remove from Session) keeps it for seven days.
- **Visual:** `shots/3-probe-editagain-annotated.png` (the button).
- **Recommendation:** File the previous version under Discarded when "Save changes" replaces it, so "Reopen Last Discarded" brings it back like any other loss.
- **Tradeoff:** Discarded fills faster with near-identical versions.
- **Decision needed:** Should "Save changes" keep the previous version in Discarded for seven days?
- **Verified:** seen on screen (the entry replaced in place in the test run).
- **Owner's words:** "I think another thing is, if I took a screenshot, annotated it, and discarded it, it is gone. I just wonder if we should introduce a shortcut with Escape and be able to recover it so nothing ever gets lost. I think that would be nice." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: Edit Again editor, "Save changes"; build main v0.9.0
- Broken: rule area confirmation and undo; Nielsen 3; the product's own "nothing gets lost" rule for Discard
- Code: `src/sessions.ts:138-147` (`replaceShot` writes over the image and text), `src/sessions.ts:130-135` (`saveEdit` writes over the kept marks), `src/main.ts:252-253`; no backup read in the code
- Screenshots: 3-probe-editagain.png, 3-probe-editagain-annotated.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 3-39 (called it routine; keeping a version is new behaviour, so a decision here). Related: F077, F125.
- Guideline: none accepted yet (rule area: confirmation and undo)

</details>

### F080 · In Edit Again, "Discard" reads as throwing the screenshot away

- **Impact:** Medium · A reviewer who opens a saved screenshot to fix one note and then changes their mind hesitates at "Discard ⌘W", because next to "Save changes" it sounds like deleting the entry.
- **Current experience:** Edit Again opens the editor with "Save changes ⌘↵" and "Discard ⌘W". Here Discard only drops the changes: the screenshot stays in the session as it was, and the edited copy is filed under Discarded. Only the Save button is relabelled for Edit Again.
- **Visual:** `shots/7-editor-edit-again-annotated.png`; `shots/4-editor-edit-again.png`.

  | Where             | Before       | After (options from the evaluators) |
  | ----------------- | ------------ | ----------------------------------- |
  | Edit Again footer | "Discard ⌘W" | "Discard Changes ⌘W" or "Cancel ⌘W" |

- **Recommendation:** Name the action by what it does in each mode.
- **Tradeoff:** Alternatives from the evaluators: (a) "Discard Changes", which names the object and keeps the word the rest of the app uses; (b) "Cancel", the shortest and the usual macOS word for leaving without saving.
- **Decision needed:** Which label should Discard carry in Edit Again: "Discard Changes" or "Cancel"?
- **Verified:** seen on screen.
- **Owner's words:** "A user doesn't understand: he clicks on buttons and he doesn't know what they mean" — 2026-09-26

<details><summary>Supporting notes</summary>

- Where: editor opened by session window → Screenshots → Edit Again; build main v0.9.0
- Broken: Nielsen 2, 4; writing: buttons name the action and its object
- Code: `src/editor.ts:832` (only Save is relabelled), `src/editor.html:289`
- Screenshots: 4-editor-edit-again.png, 7-editor-edit-again.png, 7-editor-edit-again-annotated.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 4-47 (Low; "Discard changes"), 7-11 ("Cancel"). Related: F077, F100, F227.
- Guideline: none accepted yet (rule area: writing)

</details>

### F081 · Dropping an image file on the editor probably replaces the editor with the image

- **Impact:** Medium · A reviewer who drags a PNG from Finder onto the editor, expecting to add or annotate it, most likely sees the editor turn into a bare picture with no toolbar; the capture and its marks would be filed under Discarded without a word.
- **Current experience:** Not run. The editor has no drop handling and Snapmark does not stop its windows from navigating, and Electron's default for a dropped file is to open it in the window. The editor's closing step would then file the capture under Discarded. The same holds for the session window and the Keyboard Shortcuts window.
- **Visual:** No screenshot: a real drag from Finder cannot be scripted in the harness.
- **Recommendation:** Stop every Snapmark window from navigating away. Then either accept a dropped image as a new screenshot in a new editor, with a visible "Drop to open as a new screenshot" state while dragging, or refuse it.
- **Tradeoff:** Blocking navigation costs nothing; accepting drops adds a second way into the editor.
- **Decision needed:** When an image file is dropped on the editor, should it open as a new screenshot to mark up, or be refused?
- **Verified:** assumption, not checked.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor window (also the session window and the Keyboard Shortcuts window); build main v0.9.0
- Broken: rule area drag and drop; Nielsen 5
- Code: no `will-navigate` or `setWindowOpenHandler` in `src/main.ts`; no `dragover` or `drop` listener in `src/editor.ts`; `src/editor.ts:781-783` (unload files the capture under Discarded); the missing guards are read in the code, the outcome is not run
- Screenshots: none
- Earlier IDs: 2026-09-25 audit F038 (still unguarded)
- Other products: none noted
- Seen by: 3-35. Related: F229.
- Guideline: none accepted yet (rule area: drag and drop)

</details>

### F082 · The selection frame and handles are pale blue on white (1.6:1)

- **Impact:** Medium · A low-vision reviewer cannot tell whether a mark is selected, or find its handles, on a light screenshot; a card on white is hardest (1.5:1).
- **Current experience:** A selected mark gets a one-pixel frame and hollow handles in pale blue, at 1.6:1 against white and 1.5:1 against a card's yellow. In the screenshot the handles are barely visible even with full vision.
- **Visual:** `shots/5-handles-annotated.png`; `shots/3-handles-1180-zoom-annotated.png`.
- **Recommendation:** Draw the frame and filled handles in a colour with a keyline, so they reach 3:1 on light and dark screenshots alike.
- **Tradeoff:** A strong accent-coloured frame would compete with the red marks; a neutral one avoids that. Options from the evaluators: dark grey with a thin white outline, or filled white with a dark outline.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen (colours read from the running editor; ratio computed).
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor, any selected mark; scenes: reviewing an overnight build, a quick verdict; build main v0.9.0
- Broken: WCAG 2.2 1.4.11 Non-text Contrast (AA): the selected state and the handles are user interface components
- Code: Fabric 7.4 defaults (`borderColor` and `cornerColor` rgb(178,204,255), `transparentCorners: true`), not overridden in `src/editor.ts`
- Numbers: 1.62:1 on #ffffff, 1.51:1 on the card #fef9c3, 10.95:1 on #18181b
- Screenshots: 3-handles-1180-zoom-annotated.png, 5-handles-annotated.png
- Earlier IDs: 2026-09-25 audit F017 (still true)
- Other products: Figma and macOS Markup draw handles filled, with a contrasting outline
- Seen by: 3-03 [the colour part] (filled white, dark outline), 5-04 (dark grey, white keyline). Related: F055.
- Guideline: none accepted yet (rule area: accessibility)

</details>

### F083 · The selected tool is a faint grey tile (1.3:1)

- **Impact:** Medium · A low-vision reviewer, or anyone on a bright screen, cannot see which tool is active, so the wrong mark gets drawn; the tools, used all the time, are the quietest thing in the toolbar.
- **Current experience:** The active tool's button gets a light grey fill at 1.3:1 against the white toolbar (1.3:1 in dark mode too). A screen reader does hear "pressed". The owner asked earlier to drop the red box that used to mark the active tool.
- **Visual:** `shots/5-selected-tool-annotated.png`; `shots/1-editor-empty-annotated.png`.
- **Recommendation:** Give the active tool a stronger neutral state that reaches 3:1 without bringing back the red box.
- **Tradeoff:** A dark tile is heavier in a toolbar the owner wants calm; a bar is lighter. Options from the evaluators: a dark tile with a white icon, as macOS segmented controls do; a 2-point bar under the icon in the ink colour; a filled or accented state, as in macOS Markup and Figma.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen (background read from the running editor; ratio computed).
- **Owner's words:** "Instead of having 1, 2, whatever, and then the icons above, and then having the red box around it, I would just change the icon." — 2026-09-25. "Yeah the interface looks quite busy now." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor toolbar, both themes; the same pattern in the session window's tabs; build main v0.9.0
- Broken: WCAG 2.2 1.4.11 Non-text Contrast (AA): the selected state; visual hierarchy; Von Restorff effect
- Code: `src/editor.html:103-105` (`rgb(127 127 127 / 0.22)`)
- Numbers: light #e3e3e3 on #ffffff 1.28:1; dark #37373a on #232327 1.32:1
- Screenshots: 1-editor-empty.png, 1-editor-empty-annotated.png, 5-selected-tool-annotated.png
- Earlier IDs: none
- Other products: macOS Markup and Figma show the active tool with a filled blue background
- Seen by: 1-22 [the faint active tool part] (Low; a filled or accented state), 5-14 (a dark tile or a 2-point bar). Related: F099, F140.
- Guideline: none accepted yet (rule area: accessibility)

</details>

### F084 · The default red disappears on red, blue and grey elements

- **Impact:** Medium · A box, arrow or cross drawn on a blue primary button, a red danger button or a mid-grey photo is hard to see for low-vision reviewers and teammates.
- **Current experience:** The default mark red reaches 1.1:1 against the mock's blue "New order" button, 1.0:1 against a red button and 1.2:1 against mid-grey; on white it is 4.7:1. The box around "New order" is visible only because red and blue differ in hue, which a colour-blind reader loses.
- **Visual:** `shots/5-marks-backgrounds-annotated.png` ("red on blue: 1.1:1").
- **Recommendation:** Give every stroke a thin white keyline, as the Reference circle already has, so a mark reaches 3:1 on any ground without changing its colour.
- **Tradeoff:** A keyline makes marks slightly heavier; one image pixel at the stroke's edge is enough.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen (real drags; contrast computed from the colours).
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor, Box, Ellipse, Arrow, Pen, Cross, Remove area, Cut & move outline; saved images; scenes: sharing with a person, a quick verdict; build main v0.9.0
- Broken: WCAG 2.2 1.4.11 Non-text Contrast (AA) for graphical objects in the output
- Code: `src/editor.ts:48-106` (strokes without a keyline; only the Reference circle gets a white ring, `src/editor.ts:161-163`)
- Numbers, red #e11d48 against: white 4.70, #f4f4f5 4.27, #18181b 3.77, #2563eb 1.10, #fee2e2 3.85, #dc2626 1.03, #dcfce7 4.28, #808080 1.19
- Screenshots: 5-marks-backgrounds.png, 5-marks-backgrounds-annotated.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 5-07. Related: F052, F054.
- Guideline: none accepted yet (rule area: accessibility)

</details>

### F085 · Arrow, Cut & move, Redact and a card's pointer can be made only by dragging

- **Impact:** Medium · A reviewer who can click but not hold and drag (a trackpad with a tremor, a head or eye pointer, switch control) cannot draw an arrow, cut and move an element, redact private details, or point a card at something.
- **Current experience:** A plain click with Box, Ellipse, Cross, Remove area, Highlighter or Spotlight makes a mark at a default size, so those have a single-click route. A plain click with Arrow, Cut & move or Redact makes nothing. A card made by a click has no pointer line, and there is no later way to add one.
- **Visual:** `shots/5-yellow-green-references.png` (the result of one click with each tool: boxes, a cross, a hatched area, a highlight, a spotlight dimming the image; no arrow, cut or redaction).
- **Recommendation:** Accept two clicks as the drag: the first click sets the start (shown as a dot), the second sets the end. That gives Arrow, Cut & move, Redact and the card's pointer a click route, and matches a keyboard route that would place them with Enter twice.
- **Tradeoff:** A stray first click leaves a pending start point; Esc, or a click on the same spot, clears it.
- **Decision needed:** Should Arrow, Cut & move, Redact and a card's pointer also accept two clicks, start then end?
- **Verified:** seen on screen (real single clicks with each tool; the mark count read before and after).
- **Owner's words:** "Also when I press the buttons 1, 2, 3, or whatever, I would like to see the shape. Can I drag it around or just move it around with the cursor?" — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor, Arrow (key 3), Cut & move (key 7), Redact (key 7 again), Card (key 1 again); scene: reviewing an overnight build; build main v0.9.0
- Broken: WCAG 2.2 2.5.7 Dragging Movements (AA)
- Code: `src/editor.ts:475-477` (an arrow shorter than 3 units is removed), `src/editor.ts:478-481` (`rect(start, p, false)` returns null for a click, so no cut or redaction), `src/editor.ts:465-467` (a card gets a pointer only when the release is 6 units from the press)
- Probe results: `clickOnly` = box 1, ellipse 1, arrow 0, cross 1, hatch 1, highlight 1, spotlight 1, cut 0, redact 0; `cardPointer: [false]`
- Screenshots: 5-yellow-green-references.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 5-08 (called it routine; a new way to draw is a behaviour change, so a decision here). Related: F048, F064, F086.
- Guideline: none accepted yet (rule area: accessibility)

</details>

### F086 · Moving or resizing a mark needs a drag

- **Impact:** Medium · A reviewer who can click but not drag can place a mark but never correct its position or size; they must delete it and place it again.
- **Current experience:** In Select, a mark moves only by pressing on it and dragging, and resizes only by dragging a handle 4.5 points square. There is no nudge key (the arrow keys on a selected mark leave it where it is), no click-to-move and no size field.
- **Visual:** `shots/5-handles-annotated.png`.
- **Recommendation:** Arrow keys to nudge a selected mark and ⌥-arrows to resize it, the same keys as the keyboard route for marks, give pointer users a single-click alternative too: select with a click, adjust with keys.
- **Tradeoff:** The keys alone cover most people. The evaluator also suggests ⌘-click on an empty spot to move the selected mark there, which is a hidden gesture.
- **Decision needed:** Decided with the keyboard route for marks: should the arrow keys nudge and ⌥-arrows resize a selected mark, and should ⌘-click move it?
- **Verified:** seen on screen (arrow keys on a selected mark: position unchanged).
- **Owner's words:** "Help me think about how we can highlight stuff and potentially add UI elements, like being able to add a card and write on the card, so I can actually edit on the screen and drag and drop, size, and so on." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor, Select, every mark; scenes: reviewing an overnight build, a quick verdict; build main v0.9.0
- Broken: WCAG 2.2 2.5.7 Dragging Movements (AA)
- Code: moving and resizing are Fabric's built-in drag handling; `src/editor.ts:785-807` has no arrow-key handling
- Screenshots: 5-handles-annotated.png
- Earlier IDs: none
- Other products: Figma and macOS Preview's markup move a selected shape with the arrow keys
- Seen by: 5-09 (called it routine because it follows from the keyboard finding; a behaviour change, so a decision here). Related: F048, F055, F085.
- Guideline: none accepted yet (rule area: accessibility)

</details>

### F087 · The comment and note fields have no accessible name

- **Impact:** Medium · A screen reader user tabbing into the side panel hears "edit text" twice with nothing to tell the comment from note 1, and a sighted reviewer scanning many notes loses each field's name as soon as typing starts.
- **Current experience:** The comment field's label "Comment" sits on a wrapper with no role, so it is dropped; the editable area inside is an unnamed text box. Each note field shows "Note for 1" only as a placeholder drawn by styling, gone once the reviewer types, and not linked to the numbered badge beside it. The accessibility tree lists an unnamed text box for every field.
- **Visual:** `shots/5-fields-contrast-annotated.png` (blue: an unnamed field).
- **Recommendation:** Put the name on the editable element itself: "Comment" for the first, "Note for reference 1" for each note, and keep the visible placeholder. One evaluator also asks for a persistent visible label ("Reference 1 note") that stays after typing starts.
- **Tradeoff:** None for the names; a visible label adds some height to each note.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen (the accessibility tree of the running editor).
- **Owner's words:** "when I set a mark like a reference, I want to immediately jump into the text field and start typing." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor side panel, the comment field and every reference note; scene: reviewing an overnight build; build main v0.9.0
- Broken: WCAG 2.2 4.1.2 Name, Role, Value (A), 1.3.1 Info and Relationships (A), 3.3.2 Labels or Instructions (A); Nielsen 6; Laws of UX: law of common region, law of proximity
- Code: `src/editor.html:284-286` (`aria-label="Comment"` on a generic div), `src/md-notes.ts:39-59` (placeholder as `data-placeholder` and `::before`, `src/md-notes.ts:44-46`), `src/editor.html:178-183`, `src/editor.ts:731-749`
- Probe result: `complementary "" > textbox "" editable=richtext` (comment) and `textbox ""` (note 1)
- Screenshots: 5-fields-contrast-annotated.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 5-11, 8-30 (read in the code; a persistent visible label; also name the session window's document editor). Related: F091, F111, F154.
- Guideline: none accepted yet (rule area: accessibility)

</details>

### F088 · Reference numbers are white on whatever colour is picked

- **Impact:** Medium · After picking yellow, green or white in the colour picker, the reference numbers on the image and in the notes list become hard or impossible to read, and a teammate or the agent may misread which note belongs to which circle.
- **Current experience:** A reference takes the picked colour as its fill and always draws its number in white. Yellow gives 1.5:1, green 3.3:1 (4.5:1 is needed for a number this size), and white gives white on white. The same white-on-colour badge repeats in the notes list.
- **Visual:** `shots/5-yellow-green-references-annotated.png`. Proposal: black or white number text chosen automatically.
- **Recommendation:** Choose the number's colour from the fill: dark ink on light fills, white on dark fills, whichever gives the higher contrast, with an outline where neither is enough.
- **Tradeoff:** The number's colour changes with its fill.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen (real clicks after setting the colour).
- **Owner's words:** "add a reference with text on certain elements" — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor, Reference (key 1) on the image, and its badge in References; saved image; scenes: sharing with a person, reviewing an overnight build; build main v0.9.0
- Broken: WCAG 2.2 1.4.3 Contrast (Minimum) (AA) for the badge text; 1.4.11 for the number in the saved image; law of uniform connectedness
- Code: `src/editor.ts:39`, `src/editor.ts:151-168` (white ring and number), `src/editor.ts:735-737` (the badge takes the marker's fill), `src/editor.html:238-248`, `src/editor.html:276`
- Numbers: yellow #facc15 1.5:1, green #16a34a 3.3:1; white follows directly from the values (not run)
- Screenshots: 5-yellow-green-references.png, 5-yellow-green-references-annotated.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 5-17, 8-29 (read in the code; white on white)
- Guideline: none accepted yet (rule area: accessibility)

</details>

### F089 · Changing tool, placing a mark and saving are silent to a screen reader

- **Impact:** Medium · A VoiceOver user who presses 5 hears nothing, so cannot know Cross is now active; placing a mark, undoing it or adding the screenshot to the session gives no spoken result either.
- **Current experience:** The page has no live region. The pressed state moves to another button, but that button does not have focus, so nothing is announced. "Add to session" closes the window without any message.
- **Visual:** No screenshot: nothing is shown on screen; the page was queried for live regions and none were found.
- **Recommendation:** Add one polite live region that says the outcome of each key in two or three words: "Cross", "Box 3 placed", "Undone: Box 3", "Added to Checkout review as screenshot 12".
- **Tradeoff:** Chatty for fast typists; keep each message short.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code; confirmed by a script run on the build (no screenshot).
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor, all keys; save; scene: reviewing an overnight build; build main v0.9.0
- Broken: WCAG 2.2 4.1.3 Status Messages (AA)
- Code: `src/editor.ts:226-245` (a tool change updates only the toolbar), `src/main.ts:246-258` (save closes the window, no notification)
- Probe result: `liveRegions: 0` (DOM query of the running editor)
- Screenshots: none
- Earlier IDs: none
- Other products: none noted
- Seen by: 5-18. Related: F048, F057, F062, F153.
- Guideline: none accepted yet (rule area: accessibility)

</details>

### F090 · A reference left without a note reaches the agent as "(no note)", with no warning

- **Impact:** Low · When reviewing an overnight build or sharing with a person, a numbered circle whose note was forgotten is handed on as a number with no instruction, and nothing warned the reviewer before saving.
- **Current experience:** The empty note field shows "Note for 1" in grey, which at a glance looks like a filled field. "Add to session" saves without a word, and session.md and the PDF read "1. _(no note)_" (rendered "2. (no note)"). A teammate reads it as a mistake; the agent gets a line that carries nothing.
- **Visual:** `shots/6-editor-marked.png` ("Note for 1" in the side panel), `shots/6-viewer-doc.png` ("1. (no note)"), `shots/7-export-pdf-page1-annotated.png` (the PDF line).
- **Recommendation:** Point out an empty reference note before saving: outline the empty field or show its number badge hollow while the note is empty, so the reviewer fills it or removes the reference. Keep the placeholder in the file only if they save anyway.
- **Tradeoff:** A little more visual noise in the side panel; a question at save costs a key press when an empty reference was meant (a circle used as a pointer). Alternatives from the evaluators: (a) ask once on save, "Reference 1 has no note. Add to session anyway?"; (b) no question, only a hollow badge or accent-coloured "Note for 2" while the note is empty.
- **Decision needed:** Should the editor point out references without a note before saving, and by a question or only by a visible mark?
- **Verified:** seen on screen.
- **Owner's words:** "Also when I set a mark like a reference, I want to immediately jump into the text field and start typing." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor side panel, reference notes, "Add to session"; session.md; PDF export; build main v0.9.0
- Broken: Nielsen 5 error prevention; output for AI (precise); Laws of UX: Zeigarnik effect, peak-end rule (the hand-over ends on a gap)
- Code: `src/sessions.ts:64-68` (`_(no note)_` at line 66); `src/editor.ts:740`
- Screenshots: 6-editor-marked.png, 6-viewer-doc.png, 7-export-pdf-page1.png, 7-export-pdf-page1-annotated.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 6-59 (ask once on save, or a hollow badge), 7-15 (show the empty note before saving) (seen by 2 evaluators). 6-59 notes its empty note came from the harness's text insertion; the finding is about what the app does with an empty note either way.
- Guideline: none accepted yet (rule area: saving and unsaved work)

</details>

### F091 · The comment field's only label is its placeholder

- **Impact:** Low · A first-time reviewer cannot tell whether the first field is about the whole screenshot, the session or a mark, and once they type, nothing names it at all.
- **Current experience:** The side panel starts with a field showing the grey placeholder "Add a comment…"; below it, "References" has a bold label once the first reference exists. As soon as the reviewer types, "Add a comment…" disappears and the field has no visible name.
- **Visual:** `shots/6-editor-empty-annotated.png` ("Label is only a placeholder"), `shots/4-editor-strings-annotated.png` (box on the field).

  | Where                          | Before                       | After (options from the evaluators)                                                                                                                   |
  | ------------------------------ | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
  | Editor side panel, first field | placeholder "Add a comment…" | label "Comment"; or "Comment for the agent"; or "About this screenshot", with an example placeholder such as "What should change on this screenshot?" |

- **Recommendation:** Give the field a visible label above it, as "References" has, and keep the placeholder as an example of what to write.
- **Tradeoff:** One more line of height in the side panel.
- **Decision needed:** Which label should the comment field carry: "Comment", "Comment for the agent" or "About this screenshot"?
- **Verified:** seen on screen.
- **Owner's words:** "I also wonder: commenting and references only exist if I actually add them so I think they may or may not be like a Like something." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor side panel, comment field; build main v0.9.0
- Broken: checklist forms 1 (visible labels, not placeholder-only); writing rule "placeholders never carry the label"; Nielsen 2, 6; Laws of UX: law of similarity
- Code: `src/editor.html:284-285`; `src/editor.ts:833`
- Screenshots: 2-editor-1180.png, 4-editor-strings.png, 4-editor-strings-annotated.png, 6-editor-empty.png, 6-editor-empty-annotated.png, 7-editor-empty-1180.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 2-52 ("Comment"), 4-45 ("Comment", placeholder "What should change on this screenshot?"), 6-35 ("Comment for the agent"), 7-43 ("About this screenshot") (seen by 2 evaluators). Related: F087 (accessible name), F194 (the comment in session.md).
- Guideline: none accepted yet (rule area: forms and validation)

</details>

### F092 · The colour swatch keeps showing a colour that the Remove and Highlight tools ignore

- **Impact:** Low · A reviewer who picked a colour cannot tell from the toolbar which colour the next mark will have, because the swatch stays live for tools that always draw red or yellow.
- **Current experience:** With green in the swatch, pressing 5 and drawing gives a red Cross, and pressing 6 gives a yellow highlight, while the swatch keeps showing green and stays clickable. Changing it has no effect on those tools and nothing says so; its only words are the tooltip "Color".
- **Visual:** `shots/6-color-fixed-annotated.png` ("Swatch: green", "Cross: still red", "Highlighter: still yellow"), `shots/3-colour-swatch-annotated.png` (swatch blue, Highlighter pressed), `shots/7-verdict-annotated.png` ("Well says green", "Remove tool still draws red").
- **Recommendation:** While a fixed-colour tool is on, show that tool's colour in the swatch and dim it, with the tooltip "Remove marks are always red" or "Highlighter is always yellow". The toolbar then tells the truth about the next mark.
- **Tradeoff:** The swatch changes colour as the reviewer changes tools.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen; the drawing colour read back as yellow while the swatch read blue.
- **Owner's words:** "Also again, we need more elements to be clear about what should go away and what should not." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor toolbar, colour swatch, with keys 5 (Cross, Remove area) and 6 (Highlighter, Spotlight); build main v0.9.0
- Broken: Nielsen 1 visibility of system status, 4 consistency; Shneiderman "grey out what cannot be done now"
- Code: `src/tools.ts:16` ("fixed color: the color picker does not apply"), `src/tools.ts:83`, `src/tools.ts:97`; `src/editor.ts:39` (`color()` ignores the swatch for fixed groups), `src/editor.ts:232-245` (applyTool leaves the swatch alone); `src/editor.html:276`
- Screenshots: 3-colour-swatch.png, 3-colour-swatch-annotated.png, 5-light-focus-color.png, 6-color-fixed.png, 6-color-fixed-annotated.png, 7-verdict.png, 7-verdict-annotated.png
- Earlier IDs: 2026-09-25 audit F075, F076 (still true)
- Other products: none noted
- Seen by: 3-05, 4-49 [part: silently no effect for keys 5 and 6], 5-46 [part: dim it while a fixed-colour tool is on], 6-26, 7-21 (seen by 2 evaluators). Related: F097 (the swatch's name).
- Guideline: none accepted yet (rule area: editing)

</details>

### F093 · The dots that say a key holds a second tool are 6 pixels high

- **Impact:** Low · The only sign that pressing 1, 2, 5, 6 or 7 again gives another tool reads as a smudge at arm's length and on a 1× screen, although the owner asked for this indicator.
- **Current experience:** Under each tool icon the key sits in 10-point grey monospace and, for five keys, "●○" in 6-point type. On a 1× display the dots are 6 device pixels high (about 3 pixels across), too small to tell filled from hollow.
- **Visual:** `shots/3-dots-1x-annotated.png` (1× display, enlarged three times), `shots/5-selected-tool-annotated.png`, `shots/6-editor-dark-1x-keys-annotated.png`, `shots/7-editor-1x-1180-annotated.png`.
- **Recommendation:** Make the indicator readable at a glance: at least the size of the key digit (about 8 to 11 points), with a gap between the two dots.
- **Tradeoff:** A slightly busier, slightly taller toolbar; the owner has asked both for less clutter and for this indicator. Alternatives from the evaluators: (a) larger dots, at the key digit's size or at least 8 points with a gap; (b) a small corner mark or triangle on the button itself, as design tools and macOS toolbars do; (c) the variant count as "1/2" in the caption.
- **Decision needed:** Should the indicator stay as larger dots, or become a corner mark on the button or a "1/2" in the caption?
- **Verified:** seen on screen; font sizes read from the running page.
- **Owner's words:** "ok can you show the shortcut keys again. also for cursor can we use c? for cursor? on 5 remove the second icon => rectangle with x. also i want the indicator that there are more then one option back again." — 2026-09-26

<details><summary>Supporting notes</summary>

- Where: editor toolbar captions, groups 1, 2, 5, 6, 7; 1× and 2×, light and dark; build main v0.9.0
- Broken: WCAG 1.4.11 (non-text contrast and size of an informative glyph); checklist responsive 3 (readable without zoom); Nielsen 1, 6; Fitts's law (tiny cues)
- Code: `src/editor.html:74-91` (`.dots { font-size: 6px }` at 88-91); `src/editor.ts:324-329`
- Screenshots: 3-review-1180-1x.png, 3-dots-1x-annotated.png, 3-empty-1180-light.png, 5-selected-tool-annotated.png, 6-editor-dark-1x.png, 6-editor-dark-1x-keys-annotated.png, 7-editor-empty-1180-annotated.png, 7-editor-1x-1180.png, 7-editor-1x-1180-annotated.png
- Earlier IDs: none
- Other products: Figma, Photoshop and Keynote put a small triangle in the corner of a button that holds more tools
- Seen by: 3-24 (key-digit size or corner mark), 5-22 (8 points with a gap, or "1/2"), 6-38 [part: dots; at least 4 px each], 7-42 [part: dots; at least 5 px or a corner triangle] (seen by 2 evaluators). Related: F094 (the key captions).
- Guideline: none accepted yet (rule area: first run and help)

</details>

### F094 · The key captions under the tools are small and faint

- **Impact:** Low · The reviewer relies on C and 1 to 7 to work on the fly, but the key under each icon is small grey text that is hard to read, especially on a non-Retina screen.
- **Current experience:** Under the icons the keys read "C 1 2 3 4 5 6 7" in 10-pixel grey monospace. At 1× in dark mode the row is a faint line of small grey characters.
- **Visual:** `shots/6-editor-dark-1x-keys-annotated.png`, `shots/7-editor-empty-1180-annotated.png`, `shots/7-editor-1x-1180-annotated.png`.
- **Recommendation:** Set the key captions at 11 to 12 pixels in the normal text colour, so the shortcuts the owner works by can be read at a glance.
- **Tradeoff:** A slightly taller toolbar.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen (1× dark, and 2× light).
- **Owner's words:** "ok can you show the shortcut keys again." — 2026-09-26

<details><summary>Supporting notes</summary>

- Where: editor toolbar captions; build main v0.9.0
- Broken: Nielsen 1, 6 recognition; checklist readable text (responsive 3); Laws of UX: aesthetic-usability effect, Fitts's law (tiny cues)
- Code: `src/editor.html:74-91` (10 px, muted colour)
- Screenshots: 6-editor-dark-1x.png, 6-editor-dark-1x-keys-annotated.png, 7-editor-empty-1180-annotated.png, 7-editor-1x-1180.png, 7-editor-1x-1180-annotated.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 6-38 [part: key captions], 7-42 [part: key captions] (seen by 2 evaluators). Contrast values were left to the accessibility evaluator (5 found the button key hints at 4.66:1 light). Related: F093.
- Guideline: none accepted yet (rule area: first run and help)

</details>

### F095 · The primary button "Add to session" wears the Remove red

- **Impact:** Low · In an app where red means "remove", the one safe, frequent action is the reddest control on screen, while the button that throws the screenshot away is a plain outline.
- **Current experience:** "Add to session ⌘↵" is filled with the app's accent red, the same red as the Cross and Remove area marks; "Discard ⌘W" is a plain outlined button. The same red is also the focus border of every note field and the fill of the reference badges.
- **Visual:** `shots/6-editor-empty-annotated.png` ("Primary action in the Remove red"), `shots/7-editor-empty-1180-annotated.png` ("Save uses the Remove red"), `shots/3-review-1180-light-red-annotated.png`.
- **Recommendation:** Give the primary button, and the app's accent in general (focus border, badges), a colour that does not mean "remove", such as the system blue or the app's own non-red colour; leave Discard plain.
- **Tradeoff:** The editor loses its single brand accent; changing it touches one colour token.
- **Decision needed:** Should the app's accent colour stop being the Remove red?
- **Verified:** seen on screen; colours read in the code.
- **Owner's words:** "Also again, we need more elements to be clear about what should go away and what should not." — 2026-09-25. Project hard rule: "Remove marks are always red and approve marks always green."

<details><summary>Supporting notes</summary>

- Where: editor side panel buttons; field focus borders; reference badges; build main v0.9.0
- Broken: project hard rule (red means remove); Nielsen 4; Laws of UX: law of similarity, von Restorff effect, cognitive bias (red reads as danger), aesthetic-usability effect; Jakob's law (red means destructive on macOS)
- Code: `src/editor.html:14` (`--accent: #e11d48`), `src/editor.html:265-270` (`.actions .primary`); `src/tools.ts:20` (`RED = '#e11d48'`)
- Screenshots: 1-editor-inuse.png, 1-editor-inuse-annotated.png, 3-review-1180-light.png, 3-review-1180-light-red-annotated.png, 6-editor-empty.png, 6-editor-empty-annotated.png, 7-editor-empty-1180.png, 7-editor-empty-1180-annotated.png
- Earlier IDs: 2026-09-25 audit F012, F107, F077 (cited by 3-01 for the red as a whole)
- Other products: none noted
- Seen by: 1-18 [part: primary button; rated Medium as a bundle], 3-01 [part: the accent on button, focus border and badge; rated High as a bundle], 6-37, 7-23 (seen by 2 evaluators). Related: F052 (marks default to red).
- Guideline: none accepted yet (rule area: visual consistency)

</details>

### F096 · In dark mode a dark screenshot has no edge in the editor

- **Impact:** Low · In dark mode, when the captured app has a dark header or background, the reviewer cannot see where the screenshot ends and the editor begins, so marks near the edge are placed by guesswork.
- **Current experience:** The mock's black top bar runs straight into the editor's dark grey backdrop. The soft shadow that frames the screenshot in light mode is black on near-black and disappears.
- **Visual:** `shots/3-review-1180-dark-annotated.png`, `shots/6-editor-dark-1x-edge-annotated.png` ("Screenshot edge lost on dark").
- **Recommendation:** Frame the screenshot with a 1-pixel line in the border colour (a light outline in dark mode).
- **Tradeoff:** None worth naming.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor canvas, dark mode, 1× and 2×; build main v0.9.0
- Broken: WCAG 1.4.11 (boundary of the component); Laws of UX: law of common region; Maze: visual inconsistency
- Code: `src/editor.html:138-140` (`box-shadow: 0 2px 12px rgb(0 0 0 / 0.2)`)
- Screenshots: 3-review-1180-dark.png, 3-review-1180-dark-annotated.png, 6-editor-dark-1x.png, 6-editor-dark-1x-edge-annotated.png
- Earlier IDs: 2026-09-25 audit F073 (still true)
- Other products: none noted
- Seen by: 3-02 [part: editor], 6-39. Related: F149 (the same in the session window).
- Guideline: none accepted yet (rule area: visual consistency)

</details>

### F097 · The colour swatch is named only "Color", by a hover tip

- **Impact:** Low · A first-time or screen reader user meets a red square with no word next to it, and nothing says what it colours.
- **Current experience:** A 30 × 28 point swatch sits after the tools. Its only name is the tooltip "Color", which is also what a screen reader announces; nothing says it sets the colour of the next mark, or that Remove and Highlight ignore it.
- **Visual:** `shots/5-light-focus-color.png` (the swatch with focus).

  | Where                   | Before  | After                                                                      |
  | ----------------------- | ------- | -------------------------------------------------------------------------- |
  | Swatch name and tooltip | "Color" | "Colour for the next mark (Remove is always red, Highlight always yellow)" |

- **Recommendation:** Give the swatch a real name that says what it does, and keep the swatch itself.
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen (accessibility tree "ColorWell "Color""; automated check flags a tooltip-only label).
- **Owner's words:** "Also again, we need more elements to be clear about what should go away and what should not." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor toolbar, colour input; build main v0.9.0
- Broken: WCAG 3.3.2 Labels or Instructions (tooltip-only label); axe-core best practice label-title-only
- Code: `src/editor.html:276` (`title="Color"`); `src/editor.ts:39`; `src/tools.ts:16, 83, 97`
- Screenshots: 5-light-focus-color.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 4-49 [part: the "Color" label; tooltip "Mark color (Remove is always red, Highlight always yellow)"], 5-46 [part: the name; "Colour for the next mark"]. Related: F092 (the swatch's state for fixed-colour tools).
- Guideline: none accepted yet (rule area: forms and validation)

</details>

### F098 · Shortcut hints are written in different styles in one window

- **Impact:** Low · The editor shows its keys in three styles, so the eye has to learn three ways of reading "this is a key".
- **Current experience:** Under the tool icons the key is a 10-point bold grey monospace letter ("C", "1"). "Undo ⌘Z" and "Redo ⇧⌘Z" put the key inline after the word, small and faded, and so does "Discard ⌘W"; but "Add to session ⌘↵" prints the key at full size and weight in white, as if it were part of the name.
- **Visual:** `shots/3-hints-annotated.png`, `shots/4-editor-strings-annotated.png` (box on the footer).
- **Recommendation:** One key style everywhere in the app (for example small and faded, after the label), and the same in the Keyboard Shortcuts window.
- **Tradeoff:** None worth naming.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen; styles read from the running page.
- **Owner's words:** "ok can you show the shortcut keys again." — 2026-09-26

<details><summary>Supporting notes</summary>

- Where: editor toolbar and action buttons; Keyboard Shortcuts window (its keys in 600 11 px monospace); build main v0.9.0
- Broken: Nielsen 4 consistency; Maze: design-system inconsistency
- Code: `src/editor.html:74-87`, `115-119`, `277-278`, `289-290` (Discard's key in `kbd`, the ⌘↵ plain text in the button); `src/editor.ts:832`
- Screenshots: 3-empty-1180-light.png, 3-hints-annotated.png, 4-editor-strings-annotated.png
- Earlier IDs: 2026-09-25 audit F088 (changed shape, still true)
- Other products: none noted
- Seen by: 3-25 (three styles), 4-46 (two styles on buttons)
- Guideline: none accepted yet (rule area: visual consistency)

</details>

### F099 · In the toolbar the colour swatch is the loudest control and the tools the quietest

- **Impact:** Low · The eye goes first to a control used rarely (colour), then to bordered text buttons, and last to the tools the reviewer switches between all the time.
- **Current experience:** The tools are 18-point outline icons without borders, with grey keys under them. Next to them sits a solid red 30 × 28 swatch, then "Undo ⌘Z" and "Redo ⇧⌘Z" as bordered text buttons.
- **Visual:** `shots/1-editor-empty-annotated.png`.
- **Recommendation:** Shrink the swatch to a small dot beside the tools, and show Undo and Redo as icon buttons without borders, matching the tools, so the tools carry the most weight.
- **Tradeoff:** Icon-only Undo and Redo lose their visible key hints unless those move into the tooltip.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen.
- **Owner's words:** "Yeah the interface looks quite busy now." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor toolbar, both themes; build main v0.9.0
- Broken: visual hierarchy; Laws of UX: von Restorff effect, Pareto principle (the most used controls are the least prominent)
- Code: `src/editor.html` `#tools button` (transparent border), `input[type='color']` 30 × 28, `header button` bordered
- Screenshots: 1-editor-empty.png, 1-editor-empty-annotated.png, 1-editor-inuse.png
- Earlier IDs: none
- Other products: macOS Markup and Figma show colour as a small swatch
- Seen by: 1-22 [part: swatch loudest, Undo and Redo bordered]. Related: F083 (the active tool's faint state, the other part of 1-22).
- Guideline: none accepted yet (rule area: visual consistency)

</details>

### F100 · Edit Again does not say which screenshot is being edited

- **Impact:** Low · A reviewer who opened Edit Again from the session window sees "Save changes ⌘↵" but not which entry the changes will replace.
- **Current experience:** The editor shows "→ probe" at the top right, the button "Save changes ⌘↵" and the window title "Snapmark". No "003", no time.
- **Visual:** `shots/2-editor-edit-again-annotated.png`.

  | Where                       | Before            | After                                                                  |
  | --------------------------- | ----------------- | ---------------------------------------------------------------------- |
  | Edit Again footer and title | "Save changes ⌘↵" | "Editing 003 · 14:32 in 28 Sep 14.32", button "Save Changes to 003 ⌘↵" |

- **Recommendation:** Name the entry being edited in the footer and the window title.
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor opened with Edit Again; build main v0.9.0
- Broken: Nielsen 1, 6; checklist navigation 3 (location)
- Code: `src/editor.ts:830-832`
- Screenshots: 2-editor-edit-again.png, 2-editor-edit-again-annotated.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 2-31. Related: F059 (window titles).
- Guideline: none accepted yet (rule area: navigation and return)

</details>

### F101 · The editor has no way to its session

- **Impact:** Low · From the editor the reviewer cannot open the session window, copy the prompt or see what is already in the session; the only route is the menu bar icon.
- **Current experience:** The editor names the session ("→ audit") as grey plain text; it cannot be clicked, and there is no session command anywhere in the window or its menu bar menus. After "Add to session" the window closes and nothing points to where the screenshot went.
- **Visual:** `shots/2-editor-1180-annotated.png`, `shots/1-editor-inuse-annotated.png` (the session name at the top right).
- **Recommendation:** Make the session name open a small menu with Open Session and Copy Prompt for AI, next to the session list for choosing where this screenshot goes.
- **Tradeoff:** Adds a control to a window whose job is marking.
- **Decision needed:** Should the session name in the editor open the session's commands?
- **Verified:** seen on screen; read in the code.
- **Owner's words:** "I also wonder: where do I access the session? Is this in the toolbar of my Mac? Is this where I am supposed to see it or where would I see that?" — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor toolbar, session label; build main v0.9.0
- Broken: checklist navigation 5 (a way back), 6 (two paths); Nielsen 7
- Code: `src/editor.html:279` (`<span class="session" id="session">`); `src/editor.ts:831` (sets its text only)
- Screenshots: 1-editor-inuse-annotated.png, 2-editor-1180-annotated.png
- Earlier IDs: 2026-09-25 proposed sitemap (a session menu in the editor footer), not built
- Other products: none noted
- Seen by: 1-21 [part: no route to the session; "Open Session" as the last item of a destination menu], 2-32 (Open Session, Copy Prompt for AI and the session list in one menu). Related: F060, F061.
- Guideline: none accepted yet (rule area: navigation and return)

</details>

### F102 · Moves are missing from the side panel

- **Impact:** Low · The reviewer cannot see in one place all the text the agent will receive: each cut-and-move piece gets a line in session.md but no line in the panel before saving.
- **Current experience:** The side panel holds the comment and "References" (one note per numbered circle). Each Cut & move piece is written to session.md as "- Moved an element: …", but never appears in the panel, so the reviewer only sees that line after saving.
- **Visual:** `shots/2-editor-1180.png` (the panel with one reference; the marks beside it have no line).
- **Recommendation:** List moves in the panel under the references, each linked to its mark (selecting the line selects the mark), so the panel is the text of the screenshot.
- **Tradeoff:** A longer panel on busy screenshots; it already scrolls.
- **Decision needed:** Should moves be listed in the side panel with the references?
- **Verified:** seen on screen; read in the code.
- **Owner's words:** "I also wonder: commenting and references only exist if I actually add them so I think they may or may not be like a Like something." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor side panel; session.md entry; build main v0.9.0
- Broken: rule area side panels and detail pages; Laws of UX: law of uniform connectedness; Nielsen 6
- Code: `src/editor.ts:719-752` (only markers listed); `src/sessions.ts:70-75` (cards and moves written to the entry)
- Screenshots: 2-editor-1180.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 2-51 [part: moves]. Related: F076 (cards, the other part of 2-51), F202 (how a move is written).
- Guideline: none accepted yet (rule area: side panels and detail pages)

</details>

### F103 · A selected reference does not show which note is its own

- **Impact:** Low · With several references, a reviewer who clicks a circle to fix its note has to read the number and find the row; nothing in the list reacts, and clicking a row does nothing on the image either.
- **Current experience:** Two references; reference 2 is selected (a faint square around the circle). Both rows in "References" look identical: same background, same grey border. Typing in a row does not select its circle.
- **Visual:** `shots/3-selected-reference-annotated.png`.
- **Recommendation:** Selecting a circle highlights its row; focusing a row outlines its circle on the image.
- **Tradeoff:** Moving the cursor into the note on every selection would stop the single-letter tool keys until Esc; lighting up the row without moving the cursor avoids that.
- **Decision needed:** When a reference is selected on the image, should its note only light up, or also take the cursor?
- **Verified:** seen on screen; both rows' computed background and border identical while reference 2 was active.
- **Owner's words:** "When I set a mark like a reference, I want to immediately jump into the text field and start typing." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor, References list and the canvas, Select tool; build main v0.9.0
- Broken: Laws of UX: law of uniform connectedness; Nielsen 6 recognition rather than recall
- Code: `src/editor.ts:719-752` (rows have no link back to their marker); no `selection:created` handler in `src/editor.ts`
- Screenshots: 3-selected-reference.png, 3-selected-reference-annotated.png
- Earlier IDs: 2026-09-25 audit F030 (still true)
- Other products: none noted
- Seen by: 3-07
- Guideline: none accepted yet (rule area: lists and selection)

</details>

### F104 · A reference cannot be deleted from its row in the list

- **Impact:** Low · To delete a reference the reviewer must press C, find the small circle on the image, click it and press ⌫; the row where its note is offers no way to delete it.
- **Current experience:** Each row in "References" is a number badge and a note field. There is no remove control, no right-click menu, and ⌫ in an empty note deletes text only.
- **Visual:** `shots/3-many-refs-1180.png` (twelve rows, none with a control).
- **Recommendation:** A small remove control on hover at the end of each row (and ⌫ in an already empty note) deletes the reference, as one undo step.
- **Tradeoff:** A second way to delete marks that has to stay in step with the canvas.
- **Decision needed:** Should a reference be deletable from its row in the list?
- **Verified:** seen on screen; no handler in the code.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor side panel, References; build main v0.9.0
- Broken: rule area lists and selection (row actions); Fitts's law
- Code: `src/editor.ts:731-750` (row = badge + field)
- Screenshots: 3-many-refs-1180.png
- Earlier IDs: 2026-09-25 audit F081 (still true)
- Other products: none noted
- Seen by: 3-23 (rated it routine; a new way to delete is a behaviour change, so it is asked here)
- Guideline: none accepted yet (rule area: lists and selection)

</details>

### F105 · Undo and Redo never say what they will undo

- **Impact:** Low · After a burst of marks, typing and moves, the reviewer presses Undo without knowing whether it takes back the last mark, a move or the note text.
- **Current experience:** "Undo ⌘Z" and "Redo ⇧⌘Z" are text buttons with no tooltip and no name of the step. ⌘Z first undoes typing in the focused note, then marks, which the buttons do not reflect.
- **Visual:** `shots/3-hints-annotated.png` (the two buttons).
- **Recommendation:** Name the step in the tooltip and in the Edit menu: "Undo Add Reference", "Undo Move", "Undo Typing".
- **Tradeoff:** Every undo step needs a name.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen (labels); no tooltip in the code.
- **Owner's words:** "1. We need an undo button." — 2026-09-28

<details><summary>Supporting notes</summary>

- Where: editor toolbar; build main v0.9.0
- Broken: rule area undo across the app (Undo and Redo name what they undo); Nielsen 1
- Code: `src/editor.html:277-278`; `src/editor.ts:28` (steps carry no name)
- Screenshots: 3-hints-annotated.png
- Earlier IDs: 2026-09-25 audit F084 (still true)
- Other products: macOS apps name the step in Edit → Undo (Keynote: "Undo Move")
- Seen by: 3-26. Related: F070 (button and key undo different things), F109 (the menu bar's Undo).
- Guideline: none accepted yet (rule area: undo across the app)

</details>

### F106 · A small capture on a Retina screen is shown at twice its size and looks soft

- **Impact:** Low · When the reviewer captures a small region (a button row, a chip), the editor blows it up to twice the size it had on screen, so text looks blurred and marks are placed on a magnified picture.
- **Current experience:** A 300 × 150-point region (600 × 300 pixels on Retina) opens at 600 × 300 points in the editor: each image pixel becomes a point, four screen pixels. "Orders" and "Showing 3 of 128" are visibly soft.
- **Visual:** `shots/3-small-capture-annotated.png`.
- **Recommendation:** Show a capture at most at its real size; only shrink to fit, never enlarge past 100%.
- **Tradeoff:** Small captures look small in a large window; a zoom control would let the reviewer enlarge on purpose.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen; canvas measured 600 × 300 points for a 600 × 300-pixel image at display scale 2.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor canvas, Retina displays, small captures; build main v0.9.0
- Broken: rule area visual consistency (Retina); Laws of UX: aesthetic-usability effect
- Code: `src/editor.ts:820-826` (`k = Math.min(1, …)` in image pixels, not points); `src/editor.ts:22` (`enableRetinaScaling: false`)
- Screenshots: 3-small-capture.png, 3-small-capture-annotated.png
- Earlier IDs: 2026-09-25 audit F079 (still true)
- Other products: none noted
- Seen by: 3-27. Related: F069 (zoom).
- Guideline: none accepted yet (rule area: visual consistency)

</details>

### F107 · Every new editor starts on Box in red, forgetting the tool and colour just used

- **Impact:** Low · In a run of captures where the reviewer mostly places references, each capture costs a key press to get back to the tool, and a chosen colour resets.
- **Current experience:** Each editor opens with 2 (Box) active, the first tool of every group, and the colour swatch on red.
- **Visual:** `shots/2-editor-1180.png` (Box active on opening).
- **Recommendation:** Remember the last tool, each group's last variant and the colour between captures, at least while the app runs.
- **Tradeoff:** A reviewer who left Remove active might start the next capture with a red cross by mistake; remembering only the tool group, never a destructive variant, avoids that.
- **Decision needed:** Should a new editor start on the tool you used last?
- **Verified:** read in the code.
- **Owner's words:** "This is also important: when I create, as I said, it needs to be shortcuts so I can just do this on the fly." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor on opening; build main v0.9.0
- Broken: Laws of UX: flow, Pareto principle; rule area remembered state
- Code: `src/editor.ts:32-33`; `src/editor.html:276`
- Screenshots: 2-editor-1180.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 2-43. Related: F063 (starting on Box makes the first "2" give Ellipse).
- Guideline: none accepted yet (rule area: remembered state)

</details>

### F108 · "Remove area" names a mark like a command

- **Impact:** Low · "Remove area" reads as an action ("remove the area"), where every other tool is named by its shape, and "area" already names the region of Capture Same Area.
- **Current experience:** Tooltip "Cross (5) · press again for Remove area"; Keyboard Shortcuts "5 again · Remove area"; prompt "Remove area: remove everything in the hatched area."
- **Visual:**

  | Where                               | Before        | After          |
  | ----------------------------------- | ------------- | -------------- |
  | Tooltip, Keyboard Shortcuts, prompt | "Remove area" | "Hatched area" |

- **Recommendation:** Name the tool by its shape; the red colour and the prompt give the meaning.
- **Tradeoff:** "Hatched" is a less everyday word.
- **Decision needed:** Should "Remove area" be called "Hatched area"?
- **Verified:** read in the code.
- **Owner's words:** "an X in a box or in a square with lots of X's in it" — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor toolbar tooltip (key 5 again); Keyboard Shortcuts window; copied prompt; build main v0.9.0
- Broken: writing (one vocabulary: "area" also names Capture Same Area's region and Spotlight's "clear area")
- Code: `src/tools.ts:86-90`
- Screenshots: none
- Earlier IDs: none
- Other products: none noted
- Seen by: 4-48
- Guideline: none accepted yet (rule area: writing and vocabulary)

</details>

### F109 · Edit → Undo in the menu bar does nothing to marks

- **Impact:** Low · A reviewer who reaches for the Edit menu with the pointer finds "Undo ⌘Z", clicks it, and the last mark stays; only the key and the toolbar button undo marks.
- **Current experience:** The stock "Edit → Undo" sends the page's own undo, which knows nothing of the editor's marks. Pressing ⌘Z works because the editor catches the key first. A probe had one mark before Edit → Undo and one after.
- **Visual:** No screenshot: the menu bar cannot be scripted.
- **Recommendation:** Wire the menu's Undo and Redo to the same undo the toolbar uses, as part of Snapmark's own menu bar menus.
- **Tradeoff:** None beyond giving Snapmark its own menus.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code; confirmed by a script run on the build (no screenshot).
- **Owner's words:** "1. We need an undo button." — 2026-09-28

<details><summary>Supporting notes</summary>

- Where: Mac menu bar, Edit, while an editor is in front; build main v0.9.0
- Broken: Nielsen 4 (two Undos that do different things); rule area undo across the app
- Code: `src/editor.ts:603-618` (⌘Z handled in the page); no `Menu.setApplicationMenu` in `src/`; the probe called `webContents.undo()`, which the menu role calls
- Screenshots: none
- Earlier IDs: none
- Other products: none noted
- Seen by: 4-11. Related: F067 (stock menus), F070, F105.
- Guideline: none accepted yet (rule area: undo across the app)

</details>

### F110 · "File → Close Window ⌘W" discards the screenshot, but the menu calls it closing

- **Impact:** Low · The same key is "Discard ⌘W" on the editor's button and "Close Window" in the menu bar, and the menu gives no hint that the screenshot goes to Discarded.
- **Current experience:** Editor button "Discard ⌘W"; Mac menu bar "File → Close Window ⌘W".
- **Visual:**

  | Where                         | Before            | After                   |
  | ----------------------------- | ----------------- | ----------------------- |
  | Mac menu bar, editor in front | "Close Window ⌘W" | "Discard Screenshot ⌘W" |

- **Recommendation:** In Snapmark's own menu bar menus, name ⌘W the way the editor names it.
- **Tradeoff:** None beyond giving Snapmark its own menus.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: Mac menu bar, File; editor footer; build main v0.9.0
- Broken: writing (one vocabulary for discarding)
- Code: `src/editor.html:289`; default menu role `close`
- Screenshots: none
- Earlier IDs: none
- Other products: none noted
- Seen by: 4-13. Related: F067.
- Guideline: none accepted yet (rule area: platform conventions)

</details>

### F111 · Typing on a card goes into an unnamed, hidden text box

- **Impact:** Low · A screen reader user who places a card hears only "text area" and cannot read back what the card says; the card's words exist only in the image until saved.
- **Current experience:** A new card puts focus in a hidden text area (6 × 53 points, off the card) with no name; the typed text is drawn on the image.
- **Visual:** `shots/5-dark-editor-marked.png` (the card "Move this up").
- **Recommendation:** Name the hidden text area "Card text", and list each card in a spoken list of marks next to the image.
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen (active element and accessibility tree while editing a card).
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor, Card tool (1 again); build main v0.9.0
- Broken: WCAG 4.1.2 Name, Role, Value (A)
- Code: `src/editor.ts:173-190` (Fabric Textbox; its hidden textarea is created without a label)
- Screenshots: 5-dark-editor-marked.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 5-12 (probe: focus in a textarea 6 × 53; tree `textbox "" editable=plaintext`). Related: F076.
- Guideline: none accepted yet (rule area: keyboard and focus)

</details>

### F112 · The single-key tool shortcuts cannot be turned off

- **Impact:** Low · A speech-input user or someone with a tremor can switch tools by accident whenever focus is not in a text field, with no way to turn the letter and digit keys off.
- **Current experience:** C and 1 to 7 act anywhere in the editor except inside a note, including while a toolbar button or "Discard" has focus. They are the owner's chosen way to work; there is no setting.
- **Visual:** `shots/5-selected-tool-annotated.png` (the key captions under the tools).
- **Recommendation:** Keep the keys on by default; add "Single-key tool shortcuts" (on or off) to Settings for people who need them off.
- **Tradeoff:** One more Settings item in a menu the owner already finds long.
- **Decision needed:** Is a Settings switch for the single-key tool shortcuts worth its place in the menu?
- **Verified:** seen on screen (the keys switched tools with focus on a toolbar button).
- **Owner's words:** "I want shortcuts, like just pressing 1, 2, 3, 4, 5 while I'm in the editor." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor, keys C and 1 to 7; build main v0.9.0
- Broken: WCAG 2.1.4 Character Key Shortcuts (A)
- Code: document-level key handler in `src/editor.ts`
- Screenshots: 5-selected-tool-annotated.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 5-13
- Guideline: none accepted yet (rule area: keyboard and focus)

</details>

### F113 · Placeholder text is 4.4:1 in light mode

- **Impact:** Low · The hints "Add a comment…" and "Note for 1" sit just below the minimum contrast for low-vision readers.
- **Current experience:** The muted grey placeholder on the field's light grey fill measures 4.4:1, where 4.5:1 is needed. Dark mode passes.
- **Visual:** `shots/5-fields-contrast-annotated.png`.
- **Recommendation:** Darken the muted colour slightly (or use the panel's white as the field fill) so it reaches 4.5:1.
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor side panel placeholders, light mode; build main v0.9.0
- Broken: WCAG 1.4.3 Contrast (Minimum) (AA)
- Code: `src/editor.html` colour tokens (`--bg`, `--muted`) and the field styles
- Screenshots: 5-fields-contrast-annotated.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 5-15. Related: F152 (same muted token in the session window).
- Guideline: none accepted yet (rule area: visual consistency)

</details>

### F114 · The note fields have almost no visible edge

- **Impact:** Low · A low-vision reviewer cannot see where the comment and note fields are until one has focus.
- **Current experience:** The fields are a very light grey on the white panel, with a border barely darker: 1.1:1 for the fill and 1.3:1 for the border (dark mode 1.1:1 and 1.5:1), where 3:1 is needed to find a field. The placeholders help, but disappear once typed in.
- **Visual:** `shots/5-fields-contrast-annotated.png`.
- **Recommendation:** A border at 3:1, or keep the soft fill and add a 3:1 rule under each field.
- **Tradeoff:** A slightly busier side panel.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor side panel, comment and reference notes, light and dark; build main v0.9.0
- Broken: WCAG 2.2 1.4.11 Non-text Contrast (AA)
- Code: `src/editor.html:13,165-177` (`--line #e4e4e7`; field background `var(--bg)` #f4f4f5); measured 1.10:1 and 1.27:1 (dark 1.13:1 and 1.50:1); suggested borders #8e8e96 light, #71717a dark
- Screenshots: 5-fields-contrast-annotated.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 5-16. Related: F113.
- Guideline: none accepted yet (rule area: visual consistency)

</details>

### F115 · At 400% zoom the image disappears and "Add to session" is off screen

- **Impact:** Low · A low-vision reviewer who zooms in with ⌘+ loses the image entirely at 400% on the smallest window, and the save button and the comment field are cut off.
- **Current experience:** At 200% the editor still works (the image is small but usable). At 400% the fixed-width side panel is wider than the window itself, the image area collapses to nothing, the comment field is clipped and "Add to session" sits off screen.
- **Visual:** `shots/5-editor-zoom200.png`, `shots/5-editor-zoom400-annotated.png`.
- **Recommendation:** When the window gets narrow (below about 700 points of width), stack the side panel under the image or fold it into a drawer, and give the image area a minimum height.
- **Tradeoff:** A stacked layout needs its own scroll; only people who zoom far in reach it.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen (zoom set on the running editor).
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor at 1180 × 600, zoom 200% and 400%; build main v0.9.0
- Broken: WCAG 2.2 1.4.10 Reflow (AA) for the side panel (the image itself is exempt); 1.4.4 Resize Text passes at 200%
- Code: `src/editor.html:32` (`grid-template: auto 1fr / 1fr 320px`); `src/editor.ts:820-826`
- Screenshots: 5-editor-zoom200.png, 5-editor-zoom400.png, 5-editor-zoom400-annotated.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 5-21 (probe: zoom 2 → viewport 590 × 286, canvas 238 × 133, save visible; zoom 4 → viewport 295 × 143, canvas 0 × 0, save not visible). Related: F122 (the panel's fixed width).
- Guideline: none accepted yet (rule area: layout and window sizes)

</details>

### F116 · Button names run their key symbols into the words

- **Impact:** Low · VoiceOver reads "Undo⌘Z" and "Add to session ⌘↵" as one name, with the symbols spelled out, on every visit.
- **Current experience:** The key symbols are part of each button's text: "Undo⌘Z", "Redo⇧⌘Z", "Discard ⌘W", "Add to session ⌘↵".
- **Visual:** `shots/5-light-focus-save.png`.
- **Recommendation:** Keep the symbols on screen but hide them from screen readers, and give each button its shortcut as a separate property, so VoiceOver says "Undo, button, Command Z" in its own way.
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen (accessibility tree names).
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor, Undo, Redo, Discard, Add to session; build main v0.9.0
- Broken: best practice (`aria-keyshortcuts`); WCAG 2.5.3 Label in Name is met
- Code: `src/editor.html:277-278,289-290`
- Screenshots: 5-light-focus-save.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 5-23 (probe: `button "Undo⌘Z"`, `button "Redo⇧⌘Z" disabled`, `button "Discard ⌘W"`, `button "Add to session ⌘↵"`). Related: F094 (the key captions).
- Guideline: none accepted yet (rule area: keyboard and focus)

</details>

### F117 · "References" looks like a heading but is not one

- **Impact:** Low · A screen reader user cannot jump to the references list by heading, and the title is read as stray text.
- **Current experience:** "References" is a label tied to no field; the side panel has no headings at all, and the notes are not a list.
- **Visual:** `shots/5-dark-editor-marked.png` (the "References" title).
- **Recommendation:** Make "References" a heading and the notes a list, so VoiceOver can say "References, list, 2 items".
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen (accessibility tree).
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor side panel; build main v0.9.0
- Broken: WCAG 2.2 1.3.1 Info and Relationships (A)
- Code: `src/editor.html:285-286` (tree: `LabelText ""`)
- Screenshots: 5-dark-editor-marked.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 5-24
- Guideline: none accepted yet (rule area: side panels and detail pages)

</details>

### F118 · A reference is placed on press, not on release

- **Impact:** Low · A reviewer who presses in the wrong spot cannot slide off to cancel: the numbered circle is already placed, and moving before releasing does not move it.
- **Current experience:** With Reference chosen, the circle and its note appear on the mouse press. A press, a 200-point move and a release left the reference at the press point. ⌘Z removes it, so the slip costs one key.
- **Visual:** No screenshot: the finding is about timing.
- **Recommendation:** Place the reference on release, at the release point; the ghost circle already follows the pointer, so the reviewer sees where it lands.
- **Tradeoff:** The note still takes the cursor, only a moment later, on release.
- **Decision needed:** Should a reference be placed when the mouse button is released instead of pressed?
- **Verified:** read in the code; confirmed by a script run on the build (no screenshot).
- **Owner's words:** "Also when I set a mark like a reference, I want to immediately jump into the text field and start typing." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor, Reference (1); build main v0.9.0
- Broken: WCAG 2.2 2.5.2 Pointer Cancellation (A): the action runs on the press; undo alone does not meet the criterion
- Code: `src/editor.ts:430-440`
- Screenshots: none (probe: `referenceAfterDownOnly: 1`, `referenceAfterMovingAway: 1`)
- Earlier IDs: none
- Other products: none noted
- Seen by: 5-43 (rated it routine; it changes when a mark appears, so it is asked here). Related: F124.
- Guideline: none accepted yet (rule area: pointer and drawing)

</details>

### F119 · Leaving a note or a card with the keyboard drops focus to nowhere

- **Impact:** Low · After Esc in a note, or Tab or Esc out of a card, focus lands on the page itself; a screen reader says nothing, and the next Tab starts again at the top of the toolbar.
- **Current experience:** Esc in a reference note leaves the note, and nothing then has focus. Tab out of a card ends its editing, again with nothing focused; the next Tab lands on Select.
- **Visual:** No screenshot: the finding is about focus.
- **Recommendation:** Once the image can hold keyboard focus, return focus to the image with the reference or card selected, so Esc means "back to the mark" and Tab means "next field". Until then, return focus to the matching toolbar button.
- **Tradeoff:** The full fix depends on the image being reachable by keyboard.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code; confirmed by a script run on the build (no screenshot).
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor, reference notes and cards; build main v0.9.0
- Broken: WCAG 2.2 2.4.3 Focus Order (A); no keyboard trap found (2.1.2 passes)
- Code: `src/editor.ts:788-791` (`e.target.blur()` on Esc); Fabric's Textbox exit on Tab
- Screenshots: none (probe: `focusAfterEscInNote: body`, `tabFromCard: body`, `tabFromCardAgain: Select`)
- Earlier IDs: none
- Other products: none noted
- Seen by: 5-44 (depends on 5-01). Related: F048 (the image cannot take focus), F056.
- Guideline: none accepted yet (rule area: keyboard and focus)

</details>

### F120 · Choosing a colour opens the macOS colour panel

- **Impact:** Low · To switch from red to another colour the reviewer opens a floating system panel with wheels and sliders, then closes it again; there is no quick choice of the few colours the scenes need, and no key for colour.
- **Current experience:** The swatch is a standard colour field; on macOS it opens the system colour panel. There is no key for colour.
- **Visual:** No screenshot: the panel is a system window that was not opened.
- **Recommendation:** A small pop-over with four or five fixed colours, each with a key (for example ⇧1 to ⇧5).
- **Tradeoff:** Fewer colours than the full panel.
- **Decision needed:** Should the colour choice be a short fixed palette with keys instead of the system panel?
- **Verified:** read in the code; that the system panel opens is an assumption, not checked.
- **Owner's words:** "This is also important: when I create, as I said, it needs to be shortcuts so I can just do this on the fly." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor toolbar, colour swatch; build main v0.9.0
- Broken: Nielsen 7 flexibility and efficiency; Shneiderman: shortcuts; Laws of UX: Fitts's law, flow
- Code: `src/editor.html:276`
- Screenshots: none
- Earlier IDs: none
- Other products: macOS Screenshot markup and Xnapper offer a short row of swatches; Figma's colour picker keeps a document palette
- Seen by: 6-41. Related: F092, F097, F099 (the swatch).
- Guideline: none accepted yet (rule area: toolbars and tools)

</details>

### F121 · The editor page declares no language

- **Impact:** Low · VoiceOver guesses the language for the tool names and notes; with a German system voice it may read English words with German pronunciation.
- **Current experience:** The editor's page has no language set.
- **Visual:** No screenshot: the language is not visible.
- **Recommendation:** Declare English on the editor page, and on the session window, the area picker and the Keyboard Shortcuts window in the same change.
- **Tradeoff:** A future translation has to update the declaration.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code; confirmed by a script run on the build (no screenshot).
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: editor page (also the session window, area picker and generated Keyboard Shortcuts page); build main v0.9.0
- Broken: WCAG 2.2 3.1.1 Language of Page (A)
- Code: `src/editor.html:2`; also `src/viewer.html:2`, `src/area.html:2`, `src/main.ts:528`
- Screenshots: none (probe: `htmlLang: "(none)"`)
- Earlier IDs: none
- Other products: none noted
- Seen by: 5-20, 8-31 [part: editor, session, area and shortcut pages]. Related: F206 (the PDF, the other part of 8-31).
- Guideline: none accepted yet (rule area: accessibility basics)

</details>

### F122 · The side panel keeps its full width even when it holds only an empty comment field

- **Impact:** Design choice · On the smallest window the panel takes 27% of the width while it shows "Add a comment…" and nothing else, and the screenshot is shrunk to 69% to make room; at 1000 points wide the screenshot is at 64%.
- **Current experience:** A fresh capture: the panel is a comment field at the top and the two buttons at the bottom, with about 400 points of empty space between. References appear only once a reference exists.
- **Visual:** `shots/3-empty-1180-light.png`, `shots/3-narrow-1000.png`.
- **Recommendation:** Let the panel start narrow (the comment field and the two buttons need about 240 points) and widen when references arrive, or let the reviewer collapse it.
- **Tradeoff:** A panel that changes width moves the screenshot under the pointer, which the toolbar was built to avoid for the same reason.
- **Decision needed:** Is more room for the screenshot worth a side panel that changes width?
- **Verified:** seen on screen; widths measured.
- **Owner's words:** "I also wonder: commenting and references only exist if I actually add them so I think they may or may not be like a Like something." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor side panel, every window size; build main v0.9.0
- Broken: C14; Nielsen 8 aesthetic and minimalist design
- Code: `src/editor.html:32` (`grid-template: auto 1fr / 1fr 320px`)
- Screenshots: 3-empty-1180-light.png, 3-narrow-1000.png, 3-review-1440.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 3-29. Related: F115 (the fixed width at high zoom).
- Guideline: none accepted yet (rule area: layout and window sizes)

</details>

### F123 · Reference and Card are two ways to write a note, on one key, that reach the agent differently

- **Impact:** Design choice · For every note the reviewer chooses between a Reference and a Card without a clear rule for which to use, and the agent receives them in two different forms.
- **Current experience:** Key 1 holds both. A Reference is a numbered circle whose note is typed in the side panel and becomes "1. …, 2. …" under the image in session.md. A Card is a yellow note typed on the image and becomes "- Card: Use infinite scroll here", with no number tying the text to its place. The session window shows both lists one after the other.
- **Visual:** `shots/6-viewer-doc.png` ("1. (no note) · 2. Show the currency per region" and "• Card: Use infinite scroll here" under one image).
- **Recommendation:** Decide what each is for and say it in the tooltip ("Reference: a numbered note for the agent" and "Card: a note a person reads on the image"), or number cards in the same sequence as references so the agent gets one list.
- **Tradeoff:** Merging them loses the card's on-image readability for people; keeping both keeps the choice.
- **Decision needed:** Do Reference and Card both stay, and if so, what is each one for?
- **Verified:** seen on screen.
- **Owner's words:** "Instead of numbered, it should be reference not numbered." — 2026-09-25; "Help me think about how we can highlight stuff and potentially add UI elements, like being able to add a card and write on the card" — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor key 1; session.md entry; build main v0.9.0
- Broken: Laws of UX: Hick's law, Occam's razor; Nielsen 4 consistency (two formats for one kind of content)
- Code: `src/tools.ts:37-54`; `src/sessions.ts:64-75`
- Screenshots: 6-viewer-doc.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 6-29. Related: F076 (cards missing from the side panel), F196 (two cards cannot be told apart), F226.
- Guideline: none accepted yet (rule area: toolbars and tools)

</details>

### F124 · After placing a reference, the next tool key types into its note

- **Impact:** Design choice · In a fast pass the reviewer places a reference, types, and presses 2 for a box: the "2" lands in the note. Esc is needed between every reference and the next tool.
- **Current experience:** A new reference's note takes the cursor, as the owner asked; tool keys do nothing while a note has the cursor; Esc leaves the note.
- **Visual:** `shots/7-main-editor.png`.
- **Recommendation:** Keep the cursor jump, and let Tab (or ⌘↵) inside a note end the note and go back to the image, so the rhythm is "click, type, Tab, 2". Say it in the note's placeholder ("Note for 1 · Tab to go back").
- **Tradeoff:** Another key to learn.
- **Decision needed:** Is Esc between a note and the next tool acceptable, or should Tab also leave the note?
- **Verified:** read in the code.
- **Owner's words:** "Also when I set a mark like a reference, I want to immediately jump into the text field and start typing." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor, references; build main v0.9.0
- Broken: Laws of UX: flow (a tradeoff with Nielsen 7); the owner's own preference
- Code: `src/editor.ts:437-438, 788-792`
- Screenshots: 7-main-editor.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 7-49. Related: F118, F119.
- Guideline: none accepted yet (rule area: keyboard and focus)

</details>

## Session window

### F125 · Edit Again silently throws away text fixed in the Document tab

- **Impact:** Critical · In an overnight review, a reviewer who corrects a note in the Document tab and later opens the same screenshot with Edit Again loses that correction without any sign, and the agent gets the old text.
- **Current experience:** A screenshot is saved with the reference note "Old note". In the Document tab the reviewer types, and session.md now reads "1. Old note (fixed in Document)". They then press "Edit Again" on that screenshot to move a mark: the editor shows "Old note", and "Save changes" rewrites the entry, so session.md reads "1. Old note" again. The comment and card text are overwritten the same way.
- **Visual:** `shots/3-probe-doc-edited-annotated.png` (the fix, saved in the Document tab), then `shots/3-probe-editagain-annotated.png` (Edit Again opens with the old note; "Save changes" puts it back).
- **Recommendation:** Keep one copy of each entry's text. Either Edit Again reads the entry's current text from session.md into the comment and notes before it opens, or the Document tab stops treating an entry's generated text as free text and edits it through the same fields. In both cases the newest words win.
- **Tradeoff:** Reading text back from session.md has to cope with anything the reviewer typed there (a note split into two paragraphs, a deleted number); where it cannot map text to a reference it must say so rather than guess. Free-form document editing makes any structured reconciliation harder.
- **Decision needed:** When an entry's text was changed in the Document tab, should Edit Again start from that text (and say so when it cannot match it), or should the Document tab stop allowing edits to an entry's notes?
- **Verified:** seen on screen; session.md read before and after with the real editor and session window, and reproduced separately on scratch data.
- **Owner's words:** "Also a full markdown view would be nice. including ideally editable like notion with markdown wyiwyg" — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: session window Document tab, then Screenshots tab → Edit Again → "Save changes ⌘↵"; build main v0.9.0
- Broken: rule area saving and unsaved work (one source of truth); Nielsen 5 error prevention, 4 consistency; Shneiderman easy reversal; checklist forms 5 (entered data kept); Laws of UX: mental model, law of similarity
- Code: `src/main.ts:334-341` (Edit Again reads `.edit/NNN.json`, never session.md), `src/main.ts:246-258` and `src/sessions.ts:138-147` (`replaceShot` regenerates the entry from the editor's fields), `src/viewer.ts:29-35` (Document edits write session.md only); 8-20 cites `src/main.ts:334–340,246–253`, `src/sessions.ts:124–145`, `src/editor.ts:830–841`. 8-20 evidence: `codex/verify.cjs`, `codex/evidence.txt` ("Original note" changed to "Improved document note", then replacing the entry restored the old note).
- Screenshots: 3-probe-doc-edited.png, 3-probe-doc-edited-annotated.png, 3-probe-editagain.png, 3-probe-editagain-annotated.png
- Earlier IDs: none (Edit Again and the Document tab are new since the earlier audits)
- Other products: none noted
- Seen by: 3-09 (probe script, temp folder), 8-20 (overwrite reproduced with scratch data)
- Guideline: none accepted yet (rule area: editing; saving and unsaved work)

</details>

### F126 · Typing in the Document tab is lost when session.md changes at the same moment

- **Impact:** Critical · In an overnight review where an agent, a sync client or the Markdown app writes session.md while the reviewer types in the session window, the reviewer's words disappear from the window and the file with no message.
- **Current experience:** Measured: " REVIEWER TYPED" was typed at the end of a note and shown on screen; 40 ms later another program appended "- [x] AGENT WROTE THIS" to session.md. Two seconds later the window showed the agent's line and not the typed words, and the file did not have them either. A second run with " TYPED-BY-OWNER" and one appended line gave the same result after 1.5 s; control runs with no outside write kept the typing.
- **Visual:** `shots/2-viewer-after-outside-change-annotated.png`, `shots/7-main-viewer-doc-annotated.png`. Proposal (words): a bar in the window, "session.md changed outside Snapmark. [Show the new version] [Keep mine]".
- **Recommendation:** Never drop typing. When the file changed underneath unsaved typing, keep the window's text and say so in the window, and refresh automatically only when there are no pending local changes.
- **Tradeoff:** A bar interrupts; an automatic merge is more work and can still collide. Alternatives from the evaluators: (a) keep the reviewer's text and ask with a bar, merging by itself only when the two changes touch different entries; (b) merge (an outside change is usually an appended entry), or keep the window's text and say so; (c) keep a local draft, detect the conflict before replacing anything, and reload by itself only when nothing is pending.
- **Decision needed:** When session.md changes while you type in the session window, should Snapmark keep your text and ask, or merge the two by itself?
- **Verified:** seen on screen (two script runs by two evaluators, each with a control run).
- **Owner's words:** "Also a full markdown view would be nice. including ideally editable like notion with markdown wyiwyg" — 2026-09-25. "It's basically for providing feedback to AI in a nice and token-efficient way." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: session window, Document tab, while session.md is written by another program; build main v0.9.0
- Broken: Nielsen 1 visibility, 3 user control, 5 error prevention, 9 recover from errors; Shneiderman easy reversal; checklist forms 5 (entered data kept after an error); rule areas saving and unsaved work, local work and external writes; Laws of UX: Tesler's law, working memory
- Code: `src/viewer.ts:29-35` (the window saves about 200 ms after typing and a save is refused when the file is no longer what the window loaded), `src/main.ts:313-320` (`writeViewer` returns false and nothing is shown), `src/main.ts:284-288` (the file watcher then reloads the window, replacing the typing); 8-19 cites `src/main.ts:284–287,299–304,313–325`, `src/viewer.ts:18–35,79` (reload clears the edited flag without keeping pending text)
- Screenshots: 2-viewer-after-outside-change.png, 2-viewer-after-outside-change-annotated.png, 7-main-viewer-doc.png, 7-main-viewer-doc-annotated.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 2-18 (Medium; keep the typing and ask, merge only when entries differ), 7-05 (High; merge, or keep and say so), 8-19 (preserve a draft, refresh only without pending changes; read in the code, concurrent writes not run) (seen by 2 evaluators). Related: F127, F134.
- Guideline: none accepted yet (rule area: local work and external writes)

</details>

### F127 · After the first autosave, the Document tab's next saves are refused without a word

- **Impact:** Critical · In an overnight review, a reviewer who keeps editing the Document tab sees later edits on screen that never reach session.md, so the agent is handed text the reviewer believes is saved.
- **Current experience:** The first edit in the Document tab saves. After it, the app and the window remember slightly different versions of the saved text: the file gets a final line break, the window keeps the text without it as its reference. The next save is then refused as though another program had changed the file, and nothing on screen says so; on scratch data the first save was accepted, the second refused, and the file kept "First edited document".
- **Visual:** No screenshot: this evaluator could not launch the app; the defect was reproduced by running the app's own compiled save code outside the app.
- **Recommendation:** Make the window compare against exactly what was written (the saved text, or a version marker returned by the save), so a conflict is reported only when the file really changed elsewhere; a refused edit then follows the same "keep your text" rule as an outside change.
- **Tradeoff:** The window and the writer need one shared idea of "the saved version", so that formatting clean-up never looks like a conflict. The other evaluators' runs exercised only a single save, so the effect on a longer edit has not been seen on screen.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code; reproduced with the app's own compiled save code on scratch data.
- **Owner's words:** "Also a full markdown view would be nice. including ideally editable like notion with markdown wyiwyg" — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: session window, Document tab, the second and later autosaves; build main v0.9.0
- Broken: Nielsen 5 error prevention, 1 visibility of system status; Shneiderman dialogs that yield closure; Laws of UX: mental model, Zeigarnik effect; Maze: limitations in the journey; rule area saving and unsaved work
- Code: `src/main.ts:313–319` (`writeViewer` appends a newline and compares against the window's base), `src/viewer.ts:28–34` (the renderer stores the trimmed outgoing Markdown as its next comparison base), `src/md-notes.ts:24,51–52`. Evidence: `codex/verify.cjs` runs `writeViewer` extracted from `dist/src/main.js` in an isolated Node context: first save true, second false, disk kept `"First edited document\n"`. An annotation save or a removal can flush through a different base, but that does not repair ordinary autosave or close.
- Screenshots: none
- Earlier IDs: none
- Other products: none noted
- Seen by: 8-37. The single-save runs in 2-18 (control) and 3-14 are consistent with it. Related: F126, F134.
- Guideline: none accepted yet (rule area: saving and unsaved work)

</details>

### F128 · Words typed just before the session window closes are lost

- **Impact:** Critical · In an overnight review, a reviewer who types a last correction in the Document tab and closes the window at once loses those words, and nothing says so.
- **Current experience:** Measured: " CLOSE TYPED" was typed and the window closed 30 ms later; the words were not in session.md. The same with a 150 ms pause: not in session.md. The window saves only about 200 ms after typing stops, and neither closing nor quitting writes what it holds first.
- **Visual:** No screenshot: the result is in the file, checked by a script run.
- **Recommendation:** Write the window's text when it closes and before quitting, the way the editor already does before it adds a screenshot; if that write fails, keep the window open or keep a draft.
- **Tradeoff:** Closing may wait a moment for the disk.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code; confirmed by a script run on the build (no screenshot).
- **Owner's words:** "I just wonder if we should introduce a shortcut with Escape and be able to recover it so nothing ever gets lost." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: session window, Document tab, ⌘W, the close button, Quit; build main v0.9.0
- Broken: rule area saving and unsaved work; Nielsen 5 error prevention; Shneiderman easy reversal; Laws of UX: peak-end rule, flow
- Code: `src/viewer.ts:29-35` (saves only from the debounced change listener), `src/md-notes.ts:51-53` (change notification delayed 200 ms); no `beforeunload` in `viewer.ts`; `flushViewer` exists (`src/main.ts:323-326`) but runs only before a save or a remove; 8-18 cites `src/md-notes.ts:12,51–53`, `src/viewer.ts:15–16,31–34`, `src/main.ts:289–293,323–325,598–600` (quit protection enumerates editors only)
- Screenshots: none
- Earlier IDs: none
- Other products: none noted
- Seen by: 2-19 (Low; measured at 30 ms and 150 ms), 8-18 (Critical; read in the code, close-race timing not reproduced)
- Guideline: none accepted yet (rule area: saving and unsaved work)

</details>

### F129 · Renaming an entry's heading in the Document tab cuts the screenshot off from Screenshots, Edit Again and Remove

- **Impact:** High · In an overnight review, a reviewer who gives an entry a readable name in the Document tab makes that screenshot vanish from the Screenshots tab, so it can no longer be edited again or removed from the window, and nothing says why.
- **Current experience:** The Document tab is session.md, editable in place. Changing a heading from "## 001 · 14:03" to "## Header: logo" (image and notes untouched) makes the Screenshots tab show "No screenshots yet", with "←", "→", "Edit Again" and "Remove from Session" greyed out, although the image is still in the Document and in the session folder. The menu still counts the screenshot.
- **Visual:** `shots/6-viewer-heading-renamed-annotated.png` ("No screenshots yet" for a session that still has its screenshot).
- **Recommendation:** Tie each entry to something the reviewer does not edit by accident, so a heading can say anything while the Screenshots tab, Edit Again, Remove and the menu's count keep agreeing.
- **Tradeoff:** Alternatives from the evaluators: (a) find entries by their image rather than by the exact heading text, or keep the number-and-time part of the heading read-only and let the reviewer add a title after it; (b) keep an editable title separate from a stable entry identity used by every view. Finding by image lets a heading say anything; a read-only part of a heading is unusual in a free-text editor; stable identity data adds structure to plain Markdown and needs handling for old sessions.
- **Decision needed:** Should entries be found by their image, so any heading works, or should the number and time in a heading become read-only?
- **Verified:** seen on screen (the edit applied through the window's own save call; the window reopened); the count mismatch reproduced separately on scratch data.
- **Owner's words:** "Also a full markdown view would be nice. including ideally editable like notion with markdown wyiwyg" — 2026-09-25. "Also it appears in the current session. I guess in the menu item it would be nice to see the current session screenshots and be able to flip through them, recover them, or just card them." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: session window, Document and Screenshots tabs; menu count; build main v0.9.0
- Broken: Nielsen 5 error prevention, 1 visibility, 4 consistency; Shneiderman consistency; Laws of UX: mental model (a heading is text, not a key), Postel's law; Maze: limitations in the journey
- Code: `src/sessions.ts:109-112` (entries matched by `^## (\d+) · `), `:115-120`; `src/main.ts:299-305`; 8-21 cites `src/sessions.ts:79–82,108–119`, `src/viewer.ts:18–37`, `src/main.ts:299–304`. 8-21 evidence: after changing the generated heading to a descriptive one, the menu count stayed 1 while `shots()` returned an empty list. Script: `e6/e6run.js viewer`.
- Screenshots: 6-viewer-heading-renamed-shots.png, 6-viewer-heading-renamed-annotated.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 6-42 (Medium; find by image or read-only number and time), 8-21 (High; stable entry identity) (seen by 2 evaluators)
- Guideline: none accepted yet (rule area: editing)

</details>

### F130 · The screenshot in the Screenshots tab is hidden from screen readers

- **Impact:** High · A blind or low-vision teammate flipping through a session (sharing with a person) hears "1 of 2" and the buttons but nothing about the screenshot itself: not that there is one, not its number, not its comment.
- **Current experience:** The image in the Screenshots tab carries an empty text alternative, which tells assistive technology it is decoration, so it is left out of the accessibility tree entirely. The counter gives a position, not a description, and the comment that belongs to the image is only in the Document tab.
- **Visual:** `shots/5-viewer-shots-annotated.png` (pink: the image screen readers skip).
- **Recommendation:** Give the image the entry's number and the first sentence of its comment as its text alternative ("Screenshot 1 of 2: The New order button is too close to Export CSV"), updated on every step.
- **Tradeoff:** A label cannot fully describe an arbitrary screenshot, and a long comment makes a long alternative; the first sentence is enough.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen (the image's attribute and the accessibility tree of the running session window).
- **Owner's words:** "Also it appears in the current session. I guess in the menu item it would be nice to see the current session screenshots and be able to flip through them, recover them, or just card them." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: session window, Screenshots tab, the image; build main v0.9.0
- Broken: WCAG 2.2 1.1.1 Non-text Content (A); checklist accessibility 6; Laws of UX: working memory, law of uniform connectedness
- Code: `src/viewer.html:174` (`<img id="shot" alt="">`), `src/viewer.ts:40-49`. Probe: `img.alt = ""`; the tree under `main` lists only the four buttons.
- Screenshots: 5-viewer-shots.png, 5-viewer-shots-annotated.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 5-25, 8-32 (Medium; read in the code). Related: F135.
- Guideline: none accepted yet (rule area: feedback; proposed accessibility rule "every picture has a text alternative")

</details>

### F131 · "Remove from Session" acts at once and says nothing: no Undo in the window, no word about Discarded

- **Impact:** Medium · In an overnight review, a reviewer flipping through screenshots who clicks "Remove from Session" by mistake sees the screenshot and its notes vanish with no message and no way back in the window.
- **Current experience:** One click on "Remove from Session" at "1 of 2" shows "1 of 1" and the next image; nothing else changes. The screenshot went to Discarded for 7 days, but the window never says so, and ⌘Z in the window does nothing for it. The only way back is the menu bar's "Reopen Last Discarded", which brings back the newest discarded item of any kind, so after one more discard it returns the wrong thing and the reviewer must pick a folder like "2026-09-28 22.27.26 · probe · screenshot 1" in "Reopen Discarded…".
- **Visual:** `shots/3-shots-tab-annotated.png` (before), `shots/3-viewer-empty-shots.png` (after one click), `shots/6-viewer-shots-after-remove-annotated.png`, `shots/7-viewer-after-remove-annotated.png`. Proposal (words), under the counter for a few seconds: "Screenshot 002 removed · Undo", then "Kept in Discarded for 7 days."
- **Recommendation:** Keep removing at once, but say it where it happened: a short bar with Undo in the window, ⌘Z in the session window putting that same screenshot back in its place, and a line saying it stays in Discarded for 7 days.
- **Tradeoff:** A bar that disappears must never be the only way back (the Discarded route stays), the Undo must survive the window's reload when session.md changes, and it must restore this entry, not whatever was discarded last. The other option offered is to ask before removing.
- **Decision needed:** Should Remove from Session keep acting at once with an Undo in the window, or ask first?
- **Verified:** seen on screen; the recovery path read in the code.
- **Owner's words:** "I just wonder if we should introduce a shortcut with Escape and be able to recover it so nothing ever gets lost." — 2026-09-25. "Also it appears in the current session. I guess in the menu item it would be nice to see the current session screenshots and be able to flip through them, recover them, or just card them." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: session window, Screenshots tab, "Remove from Session"; menu bar "Reopen Last Discarded"; build main v0.9.0
- Broken: Nielsen 1 visibility, 3 user control; Shneiderman easy reversal, informative feedback, dialogs that yield closure; rule area confirmation and undo, undo across the app; Laws of UX: Fitts's law (the costly button sits next to Edit Again), peak-end rule, law of proximity
- Code: `src/viewer.ts:69-72` (no confirmation, no undo), `src/main.ts:342-347`, `src/main.ts:553-556` (`reopenLast` takes the newest discard of any kind), `src/sessions.ts:236-254`; 8-22 cites `src/main.ts:342–346,553–555`, `src/sessions.ts:234–253`
- Screenshots: 1-session-shots.png, 1-session-count-after-remove-annotated.png, 2-viewer-after-remove.png, 3-shots-tab-annotated.png, 3-viewer-empty-shots.png, 6-viewer-shots-before-remove.png, 6-viewer-shots-after-remove.png, 6-viewer-shots-after-remove-annotated.png, 7-viewer-shots-tab.png, 7-viewer-after-remove.png, 7-viewer-after-remove-annotated.png
- Earlier IDs: none
- Other products: Finder's Move to Trash acts at once with ⌘Z; macOS Photos asks first and keeps removed items where they can be recovered; CleanShot X exposes a Capture History, useful but no substitute for a local Undo
- Seen by: 2-26 (said routine), 3-19 (act at once with Undo, or ask first), 4-53 (Low), 6-43 (said routine), 7-13 [no confirmation, no Undo], 8-22, 1-24 [acts without a word about Discarded] (seen by 3 evaluators). Related: F142, F144.
- Guideline: none accepted yet (rule area: confirmation and undo)

</details>

### F132 · An empty session shows only its name; the hint to capture never appears

- **Impact:** Medium · A first-time reviewer who opens a new session before capturing sees a date on a blank page and no hint of what to do.
- **Current experience:** A new session's Document tab shows only its heading, for example "2026-09-28 22.17". The window has a hint for this state, "This session is empty. Capture a screenshot with ⌃⇧1.", but it appears only when session.md is completely empty, and session.md always starts with its title line, so it never shows. The Screenshots tab says "No screenshots yet" beside four greyed buttons.
- **Visual:** `shots/2-viewer-empty-doc-annotated.png`, `shots/3-empty-session-annotated.png`, `shots/6-viewer-empty-doc-annotated.png`, `shots/7-viewer-empty-session-annotated.png`.
- **Recommendation:** Show the hint whenever the session has no screenshots, under the title in the Document tab and in the Screenshots tab, with the capture keys that are actually registered.
- **Tradeoff:** A session kept for text only would show the hint too; it must stay a quiet line, not block anything. One evaluator also offers a "Capture a region" button in the empty state.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen (the page reports the field as not empty with only the title in it).
- **Owner's words:** "I also wonder: where do I access the session? Is this in the toolbar of my Mac? Is this where I am supposed to see it or where would I see that?" — 2026-09-25. "First I want to have the functionality that when I create a new session it creates Markdown." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: session window, Document and Screenshots tabs, empty session; build main v0.9.0
- Broken: checklist content 6 (helpful empty states); Nielsen 1 visibility, 10 help; Laws of UX: goal-gradient effect, paradox of the active user
- Code: `src/viewer.ts:29-31` (placeholder), `src/md-notes.ts:46` (`data-empty` only when the whole text is blank), `src/sessions.ts:31` (every session.md starts with "# name"); 8-33 cites `src/sessions.ts:27–32`, `src/viewer.ts:29–30`, `src/md-notes.ts:45–46`, `src/viewer.html:93–96`. The hint's "⌃⇧1" is fixed text (`src/viewer.ts:30`), noted by 4-19.
- Screenshots: 2-viewer-empty-doc.png, 2-viewer-empty-doc-annotated.png, 2-viewer-empty-shots.png, 3-empty-session-viewer.png, 3-empty-session-annotated.png, 3-viewer-empty-shots.png, 4-viewer-empty-doc.png, 4-viewer-empty-doc-annotated.png, 6-viewer-empty-doc.png, 6-viewer-empty-doc-annotated.png, 6-viewer-empty-shots.png, 7-viewer-empty-session.png, 7-viewer-empty-session-annotated.png, 7-viewer-empty-shots-tab.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 2-33 (Low), 3-21 (Low), 4-50 (Low), 6-45 (Low), 7-28 (Low), 8-33 (Medium; adds a capture button) (seen by 3 evaluators). Related: F158.
- Guideline: none accepted yet (rule area: first run and help)

</details>

### F133 · The session window has no way to hand the session on

- **Impact:** Medium · In an overnight review, and when sharing with a person, the reviewer who reads the session through in its own window must go back to the menu bar to copy it for the agent or export it.
- **Current experience:** The window's header holds the session's name, "Document | Screenshots" and "Open in Markdown App". Nothing else acts on the session: no "Copy Prompt for AI", no "Copy session.md Path", no Export, no Rename, no Show in Finder. Those live only in the menu bar menu under "Current Session", which may not even be the session this window shows.
- **Visual:** `shots/1-session-doc-annotated.png`, `shots/2-viewer-shots-annotated.png`, `shots/6-viewer-doc-annotated.png` ("No hand-off: copy and export live only in the menu"), `shots/7-main-viewer-doc-annotated.png`. Proposal: `shots/1-proposal-session-window.png`, `shots/2-viewer-proposal.png`.
- **Recommendation:** Put the hand-off in the window's header, acting on the session the window shows: the copy for the agent as the one prominent button, and Export (PDF, ZIP) beside it. The end of reading becomes the moment of handing over.
- **Tradeoff:** The same actions then exist in two places (menu and window); keep the labels identical. Alternatives from the evaluators: (a) the copy as the only primary button, with Export, Rename, Show in Finder and Open in Markdown App behind one quiet "⋯" button; (b) the copy and Export in the header; (c) as (b), and move Rename and Show in Finder there from the menu.
- **Decision needed:** Should the session window carry the copy for the agent and Export, and should Rename and Show in Finder move there too?
- **Verified:** seen on screen.
- **Owner's words:** "One thing, actually, from the menu item: I want to be able to copy and paste the path to the Markdown from the current session. I just paste it and then I can point the AI to it." — 2026-09-25. "I also wonder: where do I access the session? Is this in the toolbar of my Mac? Is this where I am supposed to see it or where would I see that?" — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: session window header; menu bar → Current Session; build main v0.9.0
- Broken: Nielsen 3, 6, 7; Shneiderman dialogs that yield closure; checklist navigation 6 (two paths to main actions); Laws of UX: goal-gradient effect, Pareto principle, law of proximity
- Code: `src/viewer.html:163-170` (title, tabs, `#external` only)
- Screenshots: 1-session-doc.png, 1-session-doc-annotated.png, 1-proposal-session-window.png, 2-viewer-shots-annotated.png, 2-viewer-proposal.png, 6-viewer-doc.png, 6-viewer-doc-annotated.png, 7-main-viewer-doc.png, 7-main-viewer-doc-annotated.png
- Earlier IDs: none
- Other products: Xnapper and CleanShot X put Copy, Save and Share in the window that shows the capture; Figma puts Share and Export in the file window
- Seen by: 1-08 (alternative a), 2-24 (b), 6-44 (c), 7-17 (b; notes the menu's current session may differ from the window's) (seen by 2 evaluators). Related: F002, F008, F145.
- Guideline: none accepted yet (rule area: side panels and detail pages; navigation and return)

</details>

### F134 · The Document tab looks read-only and never says it saved

- **Impact:** Medium · In an overnight review, a reviewer cannot tell that the Document tab is editable, and one who edits it cannot tell whether the words reached session.md before handing it to the agent.
- **Current experience:** The Document tab shows session.md rendered like a read-only page: no cursor hint, no edit mode, no "Saved" or "Edited" anywhere. Any typing is written to session.md within a moment; clicking into the text is the only way to find out it is editable. A save that is refused or fails shows nothing either.
- **Visual:** `shots/6-viewer-doc.png` (nothing marks the page as editable), `shots/7-main-viewer-doc-annotated.png`. Proposal (words): header "Click to edit · saved to session.md"; states "Saving… → Saved"; on failure "Changes not saved [Retry] [Keep a copy]".
- **Recommendation:** Say once that the page is editable, and show a quiet saving, saved or not-saved state in the header, with a way to keep the text when a save fails.
- **Tradeoff:** A line of chrome in a reading view; the owner's Notion-like model shows no mode, and a status must stay quiet while all is saved.
- **Decision needed:** Should the Document tab show a quiet saving / saved / not saved state and say it can be edited?
- **Verified:** seen on screen; saving read in the code.
- **Owner's words:** "Also a full markdown view would be nice. including ideally editable like notion with markdown wyiwyg" — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: session window, Document tab; build main v0.9.0
- Broken: Nielsen 1 visibility of system status, 6 recognition, 9 recover; Shneiderman informative feedback; rule area saving and unsaved work; Laws of UX: paradox of the active user, Zeigarnik effect, selective attention
- Code: `src/viewer.ts:29-35` (autosave), `src/viewer.html:97-99` (no outline, no cursor style), `src/viewer.html:163-172`; 8-17 cites `src/viewer.ts:29–34`, `src/main.ts:313–325`, `src/viewer.html:163–183`
- Screenshots: 6-viewer-doc.png, 7-main-viewer-doc.png, 7-main-viewer-doc-annotated.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 6-49 (Low), 7-27 (Low), 8-17 (High, counting the silent refused saves that are their own findings) (seen by 3 evaluators). Related: F126, F127.
- Guideline: none accepted yet (rule area: saving and unsaved work)

</details>

### F135 · The Screenshots tab shows the picture without its number, comment or notes

- **Impact:** Medium · In an overnight review, a reviewer flipping through the session to decide what to edit again or remove sees each marked image but not what was written about it, and has to switch tabs to check.
- **Current experience:** The Screenshots tab shows one image, "1 of 1", "←", "→", "Edit Again" and "Remove from Session". The entry's heading ("001 · 22:16"), its comment and its numbered notes are not shown, so the numbered circles on the image are never explained there.
- **Visual:** `shots/3-shots-tab-annotated.png`, `shots/7-viewer-shots-tab-annotated.png`. Proposal: `shots/3-proposal-shots-tab.png` (labelled, not the real app).
- **Recommendation:** Show the entry's own text beside or under the picture (number and time, comment, notes, cards), read-only there, with Edit Again to change it.
- **Tradeoff:** The picture gets narrower (about 260 points in a 900-wide window) or shorter in a small window.
- **Decision needed:** Should the Screenshots tab show each entry's text beside its picture?
- **Verified:** seen on screen.
- **Owner's words:** "Also it appears in the current session. I guess in the menu item it would be nice to see the current session screenshots and be able to flip through them, recover them, or just card them." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: session window, Screenshots tab; build main v0.9.0
- Broken: Nielsen 6 recognition rather than recall; Laws of UX: working memory, law of proximity; C10 levels of detail
- Code: `src/viewer.html:173-182`, `src/viewer.ts:40-49` (`renderShot` sets the image and the count only)
- Screenshots: 3-review-1440-viewer.png, 3-shots-tab-annotated.png, 3-proposal-shots-tab.png, 6-viewer-shots-after-remove.png, 7-viewer-shots-tab.png, 7-viewer-shots-tab-annotated.png
- Earlier IDs: none (the tab is new)
- Other products: none noted
- Seen by: 3-16, 6-47 (Low), 7-29 (Low) (seen by 2 evaluators). Related: F130, F136.
- Guideline: none accepted yet (rule area: side panels and detail pages)

</details>

### F136 · The Screenshots tab counts by position, while everything else counts by number

- **Impact:** Medium · After any removal, the reviewer sees "3 of 3" for the screenshot that the document, the file and the agent call "004", so "see screenshot 3" points at two different images.
- **Current experience:** With entries 001 to 004, removing 001 leaves "002", "003", "004" in the document; the Screenshots tab then shows entry 004 as "3 of 3". The notification after reopening a removed one says "Screenshot 1 is back in …", by number. The Screenshots tab never shows the number or the time.
- **Visual:** `shots/1-session-count-after-remove-annotated.png`, `shots/4-viewer-shots-annotated.png`, `shots/7-viewer-shots-tab-annotated.png`.

  | Where                   | Before   | After                     |
  | ----------------------- | -------- | ------------------------- |
  | Screenshots tab counter | "3 of 3" | "Screenshot 004 · 3 of 3" |

- **Recommendation:** Show the number and the position together, in the same form everywhere (heading, tab, notifications).
- **Tradeoff:** A longer label in the bottom bar. Variants proposed: "Screenshot 004 · 3 of 3", "003 · 22:15 — 2 of 2", "002 · 1 of 2".
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen (the tab after a removal; headings read from the same window: "002 · 22:13", "003 · 22:14", "004 · 22:18").
- **Owner's words:** "Also it appears in the current session. I guess in the menu item it would be nice to see the current session screenshots and be able to flip through them, recover them, or just card them." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: session window, Screenshots tab; notifications; build main v0.9.0
- Broken: Nielsen 4 consistency; writing: one vocabulary (number styles)
- Code: `src/viewer.ts:44` (`renderShot`: `${index + 1} of ${length}`); `src/sessions.ts:60` (entry heading `## ${pad(n)}`); `src/main.ts` notification `Screenshot ${n} is back in`
- Screenshots: 1-session-count-after-remove.png, 1-session-count-after-remove-annotated.png, 4-viewer-shots.png, 4-viewer-shots-annotated.png, 7-viewer-after-remove.png, 7-viewer-small-560.png, 7-viewer-shots-tab-annotated.png
- Earlier IDs: glossary proposal row "screenshot number" (three number styles), still true
- Other products: none noted
- Seen by: 1-23, 4-51 (Low; asked as a decision), 7-30 (Low)
- Guideline: none accepted yet (rule area: lists and selection)

</details>

### F137 · Typing one character in the Document tab rewrites every entry in session.md

- **Impact:** Medium · In an overnight review, the moment the reviewer types anywhere in the Document tab every entry is rewritten in a different Markdown style, so a name copied from a note no longer matches the code the agent searches, and anything that reads the file's fixed lines stops matching.
- **Current experience:** A session with two entries. The reviewer types "!" at the end of entry 2's comment. Entry 1, untouched, changes: identifiers and multiplication signs get backslashes, its "- Card:" line becomes "* Card:", and its nested list items change from "- first" to "* first".
- **Visual:**

  | Where             | Before (written by the editor)  | After one keystroke in entry 2     |
  | ----------------- | ------------------------------- | ---------------------------------- |
  | entry 1 comment   | "see snake_case_name and 2 * 3" | "see snake\_case\_name and 2 \* 3" |
  | entry 1 card line | "- Card: Load 25 / not 3"       | "* Card: Load 25 / not 3"          |
  | entry 1 note 3    | " - first"                      | " * first"                         |

- **Recommendation:** Save only the part of session.md the reviewer changed, or make the Document tab write Markdown in the same style as the editor (dash bullets, no escaping inside words), so the file looks the same whoever wrote it.
- **Tradeoff:** Matching the editor's style exactly depends on what the Markdown library lets the app set; saving only the changed entry needs the entry boundaries to stay intact.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code; confirmed by a script run on the build (no screenshot).
- **Owner's words:** "Also a full markdown view would be nice. including ideally editable like notion with markdown wyiwyg" — 2026-09-25. "It's basically for providing feedback to AI in a nice and token-efficient way." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: session window, Document tab, any edit; build main v0.9.0
- Broken: Laws of UX: Postel's law (conservative in what you send); output-for-AI check; rule area saving and unsaved work
- Code: `src/viewer.ts:29-35` (whole-document save on every change), `src/md-notes.ts:47-59` (Milkdown commonmark serialiser with default options). Evidence: file read before and after one real keystroke in the session window (probe script, temp folder).
- Screenshots: none
- Earlier IDs: none (the Document tab is new)
- Other products: none noted
- Seen by: 3-14. Related: F195.
- Guideline: none accepted yet (rule area: editing)

</details>

### F138 · From the Document tab a screenshot cannot be edited again or removed

- **Impact:** Medium · In an overnight review, a reviewer reading entry 7 in the Document tab who wants to fix or drop it must switch to the Screenshots tab and step with the arrows to the same entry, because Edit Again and Remove live only there.
- **Current experience:** The Document tab shows every entry with its image, editable as text, with no action on any entry: clicking an image selects it as text, double-clicking does nothing, there is no menu. The Screenshots tab keeps its own position and has no list to jump from, so it does not open at the entry that was being read.
- **Visual:** `shots/2-viewer-doc.png`, `shots/3-review-1180-light-viewer.png` (no controls on the entry). Proposal: `shots/2-viewer-proposal.png` (each entry carries its actions in the Document).
- **Recommendation:** Give each entry in the Document tab its own Edit Again and Remove, shown beside the entry's heading on hover or focus, and open the Screenshots tab at the entry that was in view.
- **Tradeoff:** Controls inside an editable document can get in the way of selecting and typing; showing them only beside the heading limits that. The lighter alternative is a double-click on a screenshot that opens it in the Screenshots tab (or in Edit Again), with no controls in the text.
- **Decision needed:** Should Edit Again and Remove sit on each entry in the Document tab, or should a double-click on a screenshot open it in the Screenshots tab?
- **Verified:** seen on screen (the missing controls); the double-click behaviour and the tab's position read in the code.
- **Owner's words:** "Also it appears in the current session. I guess in the menu item it would be nice to see the current session screenshots and be able to flip through them, recover them, or just card them." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: session window, Document tab, then Screenshots tab; build main v0.9.0
- Broken: Nielsen 7 flexibility; Laws of UX: law of uniform connectedness; rule areas side panels and detail pages, lists and selection (open and edit reachable from the item)
- Code: `src/viewer.ts:40-56` (index independent of the Document), `src/viewer.ts:63-72` (actions bound only to the Screenshots bar), `src/viewer.ts:36`, `src/viewer.html:171-182`
- Screenshots: 2-viewer-doc.png, 2-viewer-shots.png, 2-viewer-proposal.png, 3-review-1180-light-viewer.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 2-25 (Medium; actions on each entry, open the tab at the entry in view), 3-18 (Low; hover actions, or double-click to open)
- Guideline: none accepted yet (rule area: lists and selection)

</details>

### F139 · A screenshot in the wrong session cannot be moved to the right one

- **Impact:** Medium · A reviewer who captured into the wrong session (after forgetting to switch) has no way to put those screenshots where they belong, so the review stays split across two files and two hand-offs.
- **Current experience:** The session window offers "Edit Again" and "Remove from Session" for each screenshot, and the menu offers "Switch Session". None of them moves a screenshot. "Remove from Session" sends it to Discarded, and "Reopen Last Discarded" puts it back into the session it came from, not the current one.
- **Visual:** No screenshot: read in the code. Proposal (words): in the Screenshots tab, a "Move to…" button beside "Remove from Session", listing the recent sessions.
- **Recommendation:** Add "Move to Session…" for a saved screenshot, so a slip can be repaired without Finder or hand-editing Markdown.
- **Tradeoff:** One more button and one more list to keep in step; a moved screenshot gets a new number in its new session.
- **Decision needed:** Should a saved screenshot be movable to another session from the session window?
- **Verified:** read in the code.
- **Owner's words:** "It needs to be some sort of project or session. If there's an existing session I just add to the existing session or I create a new session." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: session window, Screenshots tab; Discarded; build main v0.9.0
- Broken: Nielsen 3 user control and freedom; Shneiderman easy reversal; Laws of UX: Tesler's law (the user carries the cost of a wrong target); Maze: limitations in the journey
- Code: `src/main.ts:358-364` (reopen restores into the original session), `src/sessions.ts:205-232` (restore)
- Screenshots: none
- Earlier IDs: none
- Other products: Xnapper and CleanShot X keep captures in a history that can be re-exported anywhere; not a session model, so no direct comparison
- Seen by: 6-02 [moving a saved screenshot]. Related: F061 (choosing the session in the editor, the other part of 6-02).
- Guideline: none accepted yet (rule area: lists and selection)

</details>

### F140 · The selected tab is a faint grey fill (1.3:1)

- **Impact:** Medium · When sharing with a person, a low-vision reader cannot tell from the header whether Document or Screenshots is showing.
- **Current experience:** The selected tab gets the same light grey fill as the editor's selected tool: about 1.3:1 against the header in both light and dark mode. Screen readers are told it is pressed; the eye barely is.
- **Visual:** `shots/5-viewer-shots-annotated.png`, `shots/5-viewer-doc-focused-annotated.png` ("selected tab").
- **Recommendation:** The same fix as the editor's tools: a dark selected segment with light text, or a 2-point underline in the text colour.
- **Tradeoff:** None worth naming beyond the editor's.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: session window header, Document and Screenshots; build main v0.9.0
- Broken: WCAG 2.2 1.4.11 Non-text Contrast (AA): 1.28:1 on white, 1.32:1 in dark
- Code: `src/viewer.html:77-79`
- Screenshots: 5-viewer-shots-annotated.png, 5-viewer-doc-focused-annotated.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 5-27. Related: F083.
- Guideline: none accepted yet (rule area: contrast and colour)

</details>

### F141 · Focus falls off the page when the button it is on becomes unavailable

- **Impact:** Medium · When sharing with a person, a keyboard or VoiceOver user who steps to the last screenshot, or removes the last one, is dropped to nowhere and has to Tab from the top of the window again.
- **Current experience:** Pressing Space on "→" at the second-to-last screenshot shows the last one, greys out "→", and focus leaves it for the page itself. Removing the only remaining screenshot greys out "Remove from Session" with the same result. Removing one of several keeps focus on Remove, which is fine.
- **Visual:** `shots/5-viewer-shots-annotated.png` ("focus lost when it disables"), `shots/5-viewer-empty-after-remove.png`.
- **Recommendation:** When "→" greys out, move focus to "←"; when the last screenshot goes, move focus to the Document tab, or to a "No screenshots yet" message that can take focus.
- **Tradeoff:** None worth naming.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen (real Space key presses; the focused element read after each).
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: session window, Screenshots tab; build main v0.9.0
- Broken: WCAG 2.2 2.4.3 Focus Order (A)
- Code: `src/viewer.ts:45-47` (buttons disabled in place), `src/viewer.ts:69-72`. Probe: after Next at the end, focus on body, Next disabled; after removing the last, focus on body, Remove disabled.
- Screenshots: 5-viewer-shots-annotated.png, 5-viewer-empty-after-remove.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 5-29
- Guideline: none accepted yet (rule area: keyboard and focus)

</details>

### F142 · "Remove from Session" sits next to "Edit Again" and looks the same

- **Impact:** Low · In an overnight review, the one button in the session window that takes a screenshot out of the session has the same outline, weight and colour as its harmless neighbour a few points away, so a slip is easy.
- **Current experience:** The Screenshots tab's bottom bar reads "←", "1 of 2", "→", "Edit Again", "Remove from Session": five outlined controls of one size and style in the text colour, centred, 8 to 16 points apart.
- **Visual:** `shots/1-session-shots.png`, `shots/2-viewer-shots-annotated.png`, `shots/3-shots-tab-annotated.png`.
- **Recommendation:** Keep the arrows and Edit Again together and move "Remove from Session" apart (the far right of the bar, or after a divider), in the look used for removing (red text), quieter than Edit Again.
- **Tradeoff:** A red button draws some attention to the least wanted action.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen; sizes measured (Edit Again 83 × 27 points, Remove from Session 153 × 27).
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: session window, Screenshots tab bottom bar; build main v0.9.0
- Broken: visual hierarchy; Laws of UX: law of similarity (destructive looks like safe), law of proximity, serial position effect; Nielsen 5 error prevention
- Code: `src/viewer.html:175-181` (the bar), `src/viewer.html:53-66` and `:146-154` (one button style)
- Screenshots: 1-session-shots.png, 2-viewer-shots-annotated.png, 3-review-1440-viewer.png, 3-shots-tab-annotated.png
- Earlier IDs: none
- Other products: macOS Photos puts Delete apart from navigation and uses a trash icon; Figma puts destructive actions last in menus, in red
- Seen by: 1-24 [same weight as Edit Again], 2-27, 3-20. Related: F131, F145.
- Guideline: none accepted yet (rule area: buttons and actions)

</details>

### F143 · Edit Again is greyed out for some screenshots without saying why

- **Impact:** Low · In an overnight review, a reviewer who wants to change the marks on an older screenshot finds the button grey, while its tip still promises to open it with its marks.
- **Current experience:** "Edit Again" works only when the clean capture and its marks were kept. For a screenshot saved without them (older entries, or one added back without them) the button is grey, and its tip still reads "Open it in the editor with its marks".
- **Visual:** `shots/6-viewer-shots-after-remove.png` (greyed for entries saved without their marks).

  | Where                      | Before                                 | After                                                                       |
  | -------------------------- | -------------------------------------- | --------------------------------------------------------------------------- |
  | Tip on a greyed Edit Again | "Open it in the editor with its marks" | "This screenshot was saved without its marks, so it can't be edited again." |

- **Recommendation:** When the button is greyed, say why in its tip.
- **Tradeoff:** None worth naming. One evaluator also offers "Mark Up Again" on the flattened image, which would be a new action rather than a fix.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen; read in the code.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: session window, Screenshots tab, "Edit Again"; build main v0.9.0
- Broken: Nielsen 1 visibility, 9 help users recognise and diagnose
- Code: `src/viewer.ts:48`, `src/viewer.html:179`, `src/main.ts:303`
- Screenshots: 6-viewer-shots-after-remove.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 2-49 (also offers "Mark Up Again"), 4-52, 6-48
- Guideline: none accepted yet (rule area: buttons and actions)

</details>

### F144 · A screenshot put back from Discarded lands at the end of its session

- **Impact:** Low · In an overnight review, after removing and restoring screenshot 1 the session reads 002 then 001, so the order the agent reads no longer matches the order of the review.
- **Current experience:** Entries 1 and 2; remove 1; "Reopen Last Discarded". The session now lists 2, then 1. The entry keeps its number but not its place.
- **Visual:** No screenshot: the order was read from the file after a script run.
- **Recommendation:** Put a restored screenshot back where it was, between its old neighbours; it already keeps its number.
- **Tradeoff:** If entries around it were removed or reordered in the meantime, "where it was" has to fall back to number order.
- **Decision needed:** Should a restored screenshot go back to its old place in the session?
- **Verified:** read in the code; confirmed by a script run on the build (no screenshot).
- **Owner's words:** "Also it appears in the current session. I guess in the menu item it would be nice to see the current session screenshots and be able to flip through them, recover them, or just card them." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: menu bar "Reopen Last Discarded" for a screenshot removed from a session; session.md; build main v0.9.0
- Broken: Nielsen 3 (undo restores the prior state); Shneiderman easy reversal
- Code: `src/sessions.ts:229` (restore appends at the end), `src/sessions.ts:205-232`. Script: entries [1, 2] → remove 1 → reopen → [2, 1].
- Screenshots: 7-viewer-after-remove.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 2-16 (asked as a decision), 7-13 [restores at the end, not in its old place]. Related: F131, F174.
- Guideline: none accepted yet (rule area: confirmation and undo)

</details>

### F145 · In the session window's header nothing is primary

- **Impact:** Low · In an overnight review, the session window gives no clear next step: the session's name, the two tabs and "Open in Markdown App" all carry the same weight.
- **Current experience:** Header: the session name in 13-point bold, then "Document | Screenshots" and "Open in Markdown App", all bordered at the same weight. The one action a reviewer most often takes next, handing the session to the agent, is not in the window at all.
- **Visual:** `shots/1-session-shots.png`. Proposal: `shots/1-proposal-session-window.png`.
- **Recommendation:** Make the hand-off the one primary button in the header, and put "Open in Markdown App" and the less frequent actions behind one quiet "⋯" button.
- **Tradeoff:** "Open in Markdown App" moves one click further away.
- **Decision needed:** Should the session window's one primary button be the copy for the agent, with "Open in Markdown App" moved behind "⋯"? (It follows the choice about handing the session on from this window.)
- **Verified:** seen on screen.
- **Owner's words:** "One thing, actually, from the menu item: I want to be able to copy and paste the path to the Markdown from the current session. I just paste it and then I can point the AI to it." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: session window header; build main v0.9.0
- Broken: visual hierarchy; Laws of UX: law of similarity; Nielsen 8 aesthetic and minimalist design
- Code: `src/viewer.html` header (title, tabs, `#external`)
- Screenshots: 1-session-doc.png, 1-session-shots.png, 1-proposal-session-window.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 1-24 [nothing primary in the header]. Related: F133, F142.
- Guideline: none accepted yet (rule area: buttons and actions)

</details>

### F146 · The session window shows the session's name twice at the top, and no count

- **Impact:** Low · In a small window, the header's name and the document's own title take a fifth of the height before the first screenshot, and neither says how many screenshots the session holds.
- **Current experience:** Header "probe" at the left, then the document's heading "probe" in large type. At 560 × 420 the first screenshot starts below the middle of the window.
- **Visual:** `shots/2-viewer-doc.png`, `shots/2-viewer-560x420.png`.
- **Recommendation:** Let the header carry the name and the count ("28 Sep 14.32 · 7 screenshots"), and keep the document's title as the document's.
- **Tradeoff:** None worth naming.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: session window header and Document tab; build main v0.9.0
- Broken: Nielsen 8 aesthetic and minimalist design; Laws of UX: Prägnanz
- Code: `src/viewer.html:164`, `src/viewer.ts:22`
- Screenshots: 2-viewer-doc.png, 2-viewer-560x420.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 2-53
- Guideline: none accepted yet (rule area: layout and spacing)

</details>

### F147 · The session window forgets its tab, size and position

- **Impact:** Low · In an overnight review, a reviewer who works in the Screenshots tab, or who sized the window to sit beside the browser, starts over each time the window opens.
- **Current experience:** The session window always opens at 900 × 900, centred, on the Document tab, at the first screenshot.
- **Visual:** `shots/2-viewer-doc.png`.
- **Recommendation:** Remember the tab, the window's size and position, and the screenshot last shown in each session.
- **Tradeoff:** A remembered tab can surprise a reviewer who expects the Document first; remembering the last screenshot per session needs a small store.
- **Decision needed:** Should the session window reopen as it was left (tab, size, position, last screenshot shown)?
- **Verified:** read in the code.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: session window, on every open; build main v0.9.0
- Broken: rule area remembered state; Nielsen 7 flexibility
- Code: `src/main.ts:274-279` (fixed size, centred), `src/viewer.ts:13`, `src/viewer.html:166-167`
- Screenshots: 2-viewer-doc.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 2-44 (said routine)
- Guideline: none accepted yet (rule area: remembered state)

</details>

### F148 · The session window can shrink to nothing; below about 500 points its labels wrap

- **Impact:** Low · In an overnight review, a reviewer who parks the session window small beside the browser gets two-line buttons and, in the Screenshots tab, a picture cut off at the bottom.
- **Current experience:** At 420 × 360 "Open in Markdown App", "Edit Again" and "Remove from Session" wrap onto two lines, the header grows, and the screenshot runs under the button bar. The window has no minimum size.
- **Visual:** `shots/3-viewer-420x360.png`, `shots/3-viewer-shots-420x360.png`.
- **Recommendation:** Give the session window a minimum size (about 560 × 420) and let the Screenshots picture fit the space left above the bar.
- **Tradeoff:** None worth naming.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen; the window's minimum size read back as 0 × 0.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: session window, both tabs; build main v0.9.0
- Broken: checklist responsive 4 and 7; C14
- Code: `src/main.ts:274-279` (no minimum width or height), `src/viewer.html:128-145`
- Screenshots: 3-viewer-600x500.png, 3-viewer-420x360.png, 3-viewer-shots-420x360.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 3-28
- Guideline: none accepted yet (rule area: layout and spacing)

</details>

### F149 · In dark mode a dark screenshot has no edge in the session window

- **Impact:** Low · In an overnight review in dark mode, when the captured app has a dark header or background, the reviewer cannot see where the screenshot ends and the session window begins.
- **Current experience:** A capture with a black top bar runs straight into the session window's dark grey page; the shadow that frames the screenshot in light mode is black on near-black and disappears. The editor has the same problem.
- **Visual:** `shots/3-review-1180-dark-viewer.png`.
- **Recommendation:** Frame each screenshot in the session window with a thin line in the border colour (a light outline in dark mode), in both tabs.
- **Tradeoff:** None worth naming.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: session window, Document and Screenshots tabs, dark mode; build main v0.9.0
- Broken: WCAG 1.4.11 non-text contrast of the component boundary; Laws of UX: law of common region
- Code: `src/viewer.html:100-104`, `src/viewer.html:139-145`
- Screenshots: 3-review-1180-dark-viewer.png
- Earlier IDs: 2026-09-25 F073 (still true)
- Other products: none noted
- Seen by: 3-02 [session window]. Related: F096 (the editor part).
- Guideline: none accepted yet (rule area: contrast and colour)

</details>

### F150 · A long session cannot be searched

- **Impact:** Low · In an overnight review of a thirty-entry session, a reviewer looking for "the note about the export button" has to scroll the Document tab; ⌘F does nothing.
- **Current experience:** The session window has no search field and no Find command; the app's menu has no Find, and the page does not handle ⌘F itself.
- **Visual:** No screenshot: read in the code.
- **Recommendation:** ⌘F in the session window opens find-in-page for the Document tab: highlights as you type, Enter for the next match, Esc closes.
- **Tradeoff:** A new command and a small find bar to build; none worth naming for the reviewer.
- **Decision needed:** Should ⌘F find text in the session window?
- **Verified:** read in the code.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: session window, Document tab; build main v0.9.0
- Broken: rule area search and filters; checklist navigation 4 (search where content is heavy)
- Code: no `findInPage` and no `Menu.setApplicationMenu` anywhere in `src/`
- Screenshots: none
- Earlier IDs: none
- Other products: none noted
- Seen by: 3-40 (said routine)
- Guideline: none accepted yet (rule area: search and filters)

</details>

### F151 · Previous and Next are named only by arrow symbols

- **Impact:** Low · When sharing with a person, a VoiceOver user hears the step buttons announced by their symbol ("leftwards arrow") rather than "Previous screenshot"; the words exist only as a hover tip.
- **Current experience:** The buttons show "←" and "→"; that symbol is their spoken name, and "Previous (←)" / "Next (→)" is only their description.
- **Visual:** `shots/5-viewer-shots-annotated.png` (blue).
- **Recommendation:** Name them "Previous screenshot" and "Next screenshot" for assistive technology, keeping the arrows on screen.
- **Tradeoff:** None worth naming.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen (accessibility tree).
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: session window, Screenshots tab bar; build main v0.9.0
- Broken: WCAG 2.2 4.1.2 Name, Role, Value (A); 2.4.6 Headings and Labels (AA)
- Code: `src/viewer.html:176-178`. Tree: `button "←" desc="Previous (←)"`.
- Screenshots: 5-viewer-shots-annotated.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 5-26. Related: F130.
- Guideline: none accepted yet (rule area: labels and names)

</details>

### F152 · Entry headings are 4.4:1 in light mode

- **Impact:** Low · When sharing with a person, the "001 · 22:27" heading over each screenshot, and quoted text, sit just under the minimum contrast for low-vision readers.
- **Current experience:** Entry headings and block quotes use the muted grey on the light page: 4.4:1. At 16 points bold they do not count as large text. Dark mode passes (6.9:1).
- **Visual:** `shots/5-viewer-doc-focused-annotated.png` ("entry heading 4.4:1").
- **Recommendation:** Darken the muted text colour; the same change fixes the editor's placeholder text.
- **Tradeoff:** None worth naming.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: session window, Document tab, light mode; build main v0.9.0
- Broken: WCAG 2.2 1.4.3 Contrast (Minimum) (AA): muted grey #71717a on #f4f4f5 = 4.40:1
- Code: `src/viewer.html:9,12,108-112,121-126`
- Screenshots: 5-viewer-doc-focused-annotated.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 5-28. Related: F113.
- Guideline: none accepted yet (rule area: contrast and colour)

</details>

### F153 · Stepping through or removing screenshots is not announced

- **Impact:** Low · When sharing with a person, a VoiceOver user pressing "→" or "Remove from Session" hears nothing change: no "2 of 2", no word that a screenshot was removed or how to get it back.
- **Current experience:** The counter "1 of 2" updates as plain text that assistive technology is not told about; removal only changes the counter.
- **Visual:** `shots/5-viewer-shots.png` (the counter).
- **Recommendation:** Have the counter's changes read out politely, and say what Remove did and how to undo it.
- **Tradeoff:** None worth naming.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen (no live region in the page).
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: session window, Screenshots tab; build main v0.9.0
- Broken: WCAG 2.2 4.1.3 Status Messages (AA)
- Code: `src/viewer.html:177`, `src/viewer.ts:44`
- Screenshots: 5-viewer-shots.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 5-30. Related: F131.
- Guideline: none accepted yet (rule area: feedback)

</details>

### F154 · The editable document has no name

- **Impact:** Low · In an overnight review or when sharing with a person, VoiceOver announces the Document tab's editing area as "edit text" with no name, so a user does not learn it is session.md, editable, and saved as they type.
- **Current experience:** The whole session.md is one unnamed text box to assistive technology.
- **Visual:** `shots/5-viewer-doc-focused-annotated.png`.
- **Recommendation:** Name it "session.md, edited in place" (or "Session document").
- **Tradeoff:** None worth naming.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen (accessibility tree: an unnamed text box).
- **Owner's words:** "Also a full markdown view would be nice. including ideally editable like notion with markdown wyiwyg" — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: session window, Document tab; build main v0.9.0
- Broken: WCAG 2.2 4.1.2 Name, Role, Value (A)
- Code: `src/viewer.ts:29-35` (mounted without a label)
- Screenshots: 5-viewer-doc-focused-annotated.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 5-31. Related: F134.
- Guideline: none accepted yet (rule area: labels and names)

</details>

### F155 · The document shows no focus indicator

- **Impact:** Low · In an overnight review, a keyboard user who Tabs into the Document tab cannot see that the page now has focus; only a text caret appears somewhere in the first heading, and typing edits session.md.
- **Current experience:** The fourth Tab stop is the whole document; its focus outline is removed and nothing replaces it. In a screenshot taken with focus there, nothing on screen shows it.
- **Visual:** `shots/5-viewer-doc-focused-annotated.png`.
- **Recommendation:** Show a focus ring round the document column when it has keyboard focus, as the editor's note fields do with their accent border.
- **Tradeoff:** A ring round a whole page is heavy; show it only for keyboard focus.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: session window, Document tab; build main v0.9.0
- Broken: WCAG 2.2 2.4.7 Focus Visible (AA) (the caret alone, in a full-page editor, is not a reliable indicator); checklist accessibility 5
- Code: `src/viewer.html:97-99` (`#doc .ProseMirror { outline: none }`). Probe: Tab order Document, Screenshots, Open in Markdown App, document (no outline), then back to Document.
- Screenshots: 5-viewer-doc-focused-annotated.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 5-32. Related: F134.
- Guideline: none accepted yet (rule area: keyboard and focus)

</details>

### F156 · The session window declares no language

- **Impact:** Low · When sharing with a person, VoiceOver has to guess the language of the session window, so English text may be read with the wrong pronunciation rules.
- **Current experience:** The session window's page names no language.
- **Visual:** No screenshot: the page's language was read by a probe.
- **Recommendation:** Declare English as the page's language (the notes may be in any language; that is a separate choice).
- **Tradeoff:** A German note is then read with English rules; per-entry language is out of scope, and a future translation must update the declaration.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code; confirmed by a script run on the build (no screenshot).
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: session window; build main v0.9.0
- Broken: WCAG 2.2 3.1.1 Language of Page (A)
- Code: `src/viewer.html:2`. Probe result `lang: "(none)"`.
- Screenshots: none
- Earlier IDs: none
- Other products: none noted
- Seen by: 5-33, 8-31 [session page]. Related: F047, F121, F170, F206 (the same gap on the other pages).
- Guideline: none accepted yet (rule area: language and locale)

</details>

### F157 · The Document tab shows every screenshot full width, with no compact view

- **Impact:** Design choice · In an overnight review, scanning what a session says (the notes, not the pictures) means scrolling past one full-width image per entry: at 900 × 900 one entry fills the window, so a ten-shot session is about ten screens of scrolling to read ten short lists.
- **Current experience:** The session title, then per entry a grey "001 · 22:14" heading, the image at up to 820 points wide, the comment and the notes. There is no way to shrink the images, fold entries, or jump to an entry.
- **Visual:** `shots/3-review-1180-light-viewer.png` (one entry, 900 × 900).
- **Recommendation:** Offer a compact view of the same document: images as thumbnails (about 160 points) beside their text, one heading line per entry; the full view stays the default for reading one entry closely.
- **Tradeoff:** A second view to build and keep in step with editing; editing is simplest in one view.
- **Decision needed:** Is a compact view (thumbnails beside notes) worth adding to the Document tab?
- **Verified:** seen on screen.
- **Owner's words:** "Also a full markdown view would be nice. including ideally editable like notion with markdown wyiwyg" — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: session window, Document tab; build main v0.9.0
- Broken: C10 levels of detail; Laws of UX: chunking; Nielsen 7 flexibility
- Code: `src/viewer.html:87-104` (document column at most 820 wide, images full width)
- Screenshots: 3-review-1180-light-viewer.png, 3-review-1180-1x-viewer.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 3-17. Related: F135.
- Guideline: none accepted yet (rule area: side panels and detail pages)

</details>

## Keyboard Shortcuts window

### F158 · The list promises keys "anywhere" even when another app has taken them

- **Impact:** Medium · A reviewer who opens the list to learn the capture key is told ⌃⇧1 works anywhere, presses it on the fly, and nothing happens because another app owns it.
- **Current experience:** When a key could not be registered, the menu adds "(shortcut unavailable)" to its item, but the Keyboard Shortcuts window still reads "⌃⇧1 · Capture region · anywhere". The list is fixed text, written once for every case.
- **Visual:** `shots/4-shortcuts-window.png` (the list with the fixed rows).

  | Where                           | Before                            | After (key unavailable)                                       |
  | ------------------------------- | --------------------------------- | ------------------------------------------------------------- |
  | Keyboard Shortcuts, capture row | "⌃⇧1 · Capture region · anywhere" | "Capture region · shortcut unavailable: another app uses ⌃⇧1" |

- **Recommendation:** Build the list from the keys actually registered, as the menu already does, and say the way forward when one is missing.
- **Tradeoff:** None. Whether the keys can be changed at all is a separate decision in the global shortcuts section.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code; the list seen on screen.
- **Owner's words:** "This is also important: when I create, as I said, it needs to be shortcuts so I can just do this on the fly." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: Keyboard Shortcuts window, "Other keys", with ⌃⇧1 or ⌃⇧3 taken by another app; build main v0.9.0
- Broken: Nielsen 1; hints that lie
- Code: `src/main.ts:441-445, 515-524` (fixed rows at `516-518`), `585-591` (registration); the menu's `shortcut()` in `src/menu.ts:60-62` is the model
- Screenshots: 4-shortcuts-window.png, 4-area-hint-annotated.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 4-19 [the Keyboard Shortcuts window part; Low], 8-28 [the help text part; also asks for configuration, see F021], 2-34 [the window still lists the key]. Related: F021, F045, F132, F173.
- Guideline: none accepted yet (rule area: first run and help)

</details>

### F159 · The three keys that work anywhere come last, in the order 1, 3, 2, mixed with editor keys

- **Impact:** Low · A reviewer who opens the list to find the capture keys again has to read past thirteen tool rows, and then finds them filed with editor keys in the order 1, 3, 2.
- **Current experience:** The window has two tables, "Editor tools" (13 rows) and "Other keys". "Other keys" holds "⌃⇧1 Capture region · anywhere", "⌃⇧3 Capture same area", "⌃⇧2 New session", then Esc, ⌫, ⌘Z, ⇧⌘Z, ⌘↵ and ⌘W.
- **Visual:** `shots/1-shortcuts-window-annotated.png`, `shots/6-shortcuts-annotated.png`, `shots/7-keyboard-shortcuts-full-annotated.png` (the global keys buried under "Other keys").
- **Recommendation:** Three groups, in the order of use: "Anywhere" (⌃⇧1, ⌃⇧2, ⌃⇧3, in key order), "In the editor" (the tools, then Esc, ⌫, ⌘Z, ⇧⌘Z, ⌘↵, ⌘W), "In the session window".
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen (the window's page built from the app's own template; not opened from the menu).
- **Owner's words:** "ok can you show the shortcut keys again." — 2026-09-26; "This is also important: when I create, as I said, it needs to be shortcuts so I can just do this on the fly." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: Keyboard Shortcuts window; build main v0.9.0
- Broken: Nielsen 4, 8; Laws of UX: serial position, chunking
- Code: `src/main.ts:508-537` (rows at `515-525`)
- Screenshots: 1-shortcuts-window.png, 1-shortcuts-window-full.png, 1-shortcuts-window-annotated.png, 2-shortcuts-window-annotated.png, 6-shortcuts-light.png, 6-shortcuts-annotated.png, 7-keyboard-shortcuts.png, 7-keyboard-shortcuts-full.png, 7-keyboard-shortcuts-full-annotated.png
- Earlier IDs: none
- Other products: Figma's shortcut panel groups keys by place and task; CleanShot X lists its global keys on their own in Settings
- Seen by: 1-29, 2-30 [grouping], 6-51 [order, grouping], 7-39 [order] (seen by 2 evaluators). Related: F160, F161.
- Guideline: none accepted yet (rule area: first run and help)

</details>

### F160 · At its opening size the window hides ⌫, ⌘Z, ⌘↵ and ⌘W below the fold

- **Impact:** Low · A reviewer who opens the list to find how to add, discard or undo sees the tools and the three global keys, and not the keys used on every screenshot, with no sign there is more.
- **Current experience:** The window opens at 520 × 640 with 769 points of content in a 612-point view. It ends mid-row on "Esc · Step back · out of the text, then deselect, then back to Select, then close", with "then close" half hidden; ⌫, ⌘Z, ⇧⌘Z, ⌘↵ and ⌘W need scrolling.
- **Visual:** `shots/2-shortcuts-window-annotated.png`, `shots/4-shortcuts-window.png` (the bottom edge cuts the Esc row), `shots/3-shortcuts-light.png`, `shots/3-shortcuts-dark.png`.
- **Recommendation:** Open the window tall enough for the whole list (about 800 points, or sized to its content).
- **Tradeoff:** A taller window on small screens. Alternatives from the evaluators: (a) put the global keys and the add, discard and undo keys first and the tool list after; (b) regroup the list by where each key works, which also moves the everyday keys up.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen; content height measured (769 against a 612-point view).
- **Owner's words:** "ok can you show the shortcut keys again." — 2026-09-26

<details><summary>Supporting notes</summary>

- Where: Keyboard Shortcuts window at its opening size; build main v0.9.0
- Broken: Nielsen 6; information below the fold with no scroll cue
- Code: `src/main.ts:508-537`, window size at `534`
- Screenshots: 2-shortcuts-window.png, 2-shortcuts-window-annotated.png, 3-shortcuts-light.png, 3-shortcuts-dark.png, 4-shortcuts-window.png, 6-shortcuts-annotated.png, 7-keyboard-shortcuts.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 2-29, 3-30 [height], 4-18, 6-51 [fold], 7-39 [fold] (seen by 2 evaluators). Related: F159, F167.
- Guideline: none accepted yet (rule area: first run and help)

</details>

### F161 · The list leaves out the session window's and the area picker's keys

- **Impact:** Low · A reviewer flipping through screenshots in the session window, or cancelling an area, learns those keys only by accident or from a button's tooltip.
- **Current experience:** The window has two sections, "Editor tools" and "Other keys", and nothing for the session window or the area picker. ← and → (previous and next screenshot), Esc in the area picker, and "Save changes ⌘↵" in Edit Again are not listed.
- **Visual:** `shots/2-shortcuts-window-annotated.png`, `shots/7-keyboard-shortcuts-full-annotated.png`.

  | Where                                            | Before | After (added rows)                                                                |
  | ------------------------------------------------ | ------ | --------------------------------------------------------------------------------- |
  | Keyboard Shortcuts, new section "Session window" | —      | "← → Previous and next screenshot (Screenshots tab)"                              |
  | "Other keys"                                     | —      | "Esc Cancel choosing an area"; "⌘↵ Add to session, or Save changes in Edit Again" |

- **Recommendation:** List every key of every window, grouped by window.
- **Tradeoff:** A longer list, in a window that already needs scrolling at its opening size.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen; read in the code.
- **Owner's words:** "ok can you show the shortcut keys again." — 2026-09-26

<details><summary>Supporting notes</summary>

- Where: Keyboard Shortcuts window; build main v0.9.0
- Broken: Nielsen 6, 10
- Code: `src/main.ts:515-525`, `src/viewer.ts:73-77`, `src/area.ts:31-33`
- Screenshots: 2-shortcuts-window-annotated.png, 7-keyboard-shortcuts-full-annotated.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 2-30 [missing keys], 4-17, 7-39 [← → missing]. Related: F159, F160.
- Guideline: none accepted yet (rule area: first run and help)

</details>

### F162 · The tools are explained in the words written for the agent

- **Impact:** Low · A reviewer who opens the list to learn a tool reads what the agent will be told ("look at this element"), not what to do with the key, so Card, Cut & move and Spotlight stay unclear.
- **Current experience:** "1 · Reference · a numbered circle; its note is the item with the same number in the list under the image"; "2 · Box · look at this element"; "Cross · remove this"; "7 · Cut & move · a dashed outline with an arrow: move that element to where the arrow points". Only Select and Redact have words of their own ("click a mark to move, resize or delete it (⌫)", "pixelate to hide private details").
- **Visual:** `shots/4-shortcuts-window-annotated.png` (box on the description column).

  | Row          | Before                                                                                     | After                                                                   |
  | ------------ | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------- |
  | Reference    | "a numbered circle; its note is the item with the same number in the list under the image" | "click to number a spot, then type its note in the side panel"          |
  | Card         | "a yellow card whose text is a comment about what its line points at"                      | "click to place a card and type on it; drag from a spot to point at it" |
  | Box, Ellipse | "look at this element"                                                                     | "drag to frame an element"                                              |
  | Arrow        | "points at the element a note is about"                                                    | "drag from where to where"                                              |
  | Pen          | "a freehand mark around or on an element: look here"                                       | "draw freehand"                                                         |
  | Cross        | "remove this"                                                                              | "drag across what should go (always red)"                               |
  | Remove area  | "remove everything in the hatched area"                                                    | "drag over an area that should go (hatched, always red)"                |
  | Highlighter  | "a yellow highlight: look here"                                                            | "drag to highlight (always yellow)"                                     |
  | Spotlight    | "the image is dimmed except one clear area: focus on that area"                            | "drag the one area to keep bright; the rest dims"                       |
  | Cut & move   | "a dashed outline with an arrow: move that element to where the arrow points"              | "drag around an element, then drag it where it should go"               |

- **Recommendation:** Give every tool a short line for people (what to do), and keep the agent's meaning for the prompt.
- **Tradeoff:** Two texts per tool to keep in step. Alternatives from the evaluators: (a) the line for people only, with the agent's meaning kept for the prompt; (b) the line for people first, with the agent's meaning as a second part, as in "Drag a box around an element (the agent reads: look at this)".
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen.
- **Owner's words:** "A user doesn't understand: he clicks on buttons and he doesn't know what they mean" — 2026-09-26; "I don't know what Select is supposed to do." — 2026-09-25; "What does Redact do?" — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: Keyboard Shortcuts window, "Editor tools"; build main v0.9.0
- Broken: writing for the audience (their level; no system words); Nielsen 2, 10
- Code: `src/main.ts:512-514` (`t.tip ?? t.means`), `src/tools.ts:45-128`
- Screenshots: 4-shortcuts-window.png, 4-shortcuts-window-annotated.png, 7-keyboard-shortcuts-full.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 4-16, 7-40 [the agent's meaning kept as a second part]. Related: F226.
- Guideline: none accepted yet (rule area: first run and help)

</details>

### F163 · The Esc row says "then close" but not that closing discards the screenshot

- **Impact:** Low · A reviewer who learns Esc as "step back" from the list presses it once too often and loses the screenshot, because the list does not say that the last step discards it.
- **Current experience:** The row reads "Esc · Step back · out of the text, then deselect, then back to Select, then close". The last Esc closes the editor and discards the screenshot.
- **Visual:** `shots/4-shortcuts-window.png`.

  | Where                       | Before                             | After                                                                                      |
  | --------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------ |
  | Keyboard Shortcuts, Esc row | "…then back to Select, then close" | "…then back to Select, then discard the screenshot (Reopen Last Discarded brings it back)" |

- **Recommendation:** Name the consequence and the way back in the row.
- **Tradeoff:** A longer row.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen.
- **Owner's words:** "When I'm at a card and then I'm adding cards, if I press 5 again I can't actually get out. With any other thing I'm not getting out either. I'm not sure if it works but I should be getting out of this mode by pressing Escape or something." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: Keyboard Shortcuts window, "Other keys", Esc row; build main v0.9.0
- Broken: Nielsen 1, 5
- Code: `src/main.ts:519`, `src/editor.ts:795-803`
- Screenshots: 4-shortcuts-window.png, 6-shortcuts-light.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 4-14 [the Keyboard Shortcuts window part], 6-52. Related: F051, F221 (the README's Esc row).
- Guideline: none accepted yet (rule area: feedback and notifications)

</details>

### F164 · The window has no Dock icon and is easily lost behind other windows

- **Impact:** Low · A reviewer who keeps the list open beside another app loses it once it falls behind, and the only way back is the menu again.
- **Current experience:** Settings ▸ Keyboard Shortcuts opens a normal window, but the Dock icon counts only editors and session windows. With no other Snapmark window open it has no Dock icon and no ⌘Tab entry; when the last editor closes while it is open, the Dock icon goes although the window stays.
- **Visual:** `shots/2-shortcuts-window.png` (the window itself).
- **Recommendation:** Count the Keyboard Shortcuts window with the others for the Dock icon, or make it a panel that floats above the editor while both are open.
- **Tradeoff:** A Dock icon for a reference window; a floating panel may cover part of the image.
- **Decision needed:** Should the Keyboard Shortcuts window get the Dock icon like the other windows, or float above the editor as a panel?
- **Verified:** read in the code.
- **Owner's words:** "when the window is open there's no icon or anything at the bottom to show that it's open." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: Keyboard Shortcuts window, with no other Snapmark window open; build main v0.9.0
- Broken: platform conventions (a window has a Dock and ⌘Tab presence); Nielsen 1
- Code: `src/main.ts:60` (Dock icon only while `editors.size || viewers.size`), `src/main.ts:505-537`
- Screenshots: 2-shortcuts-window.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 2-28 (said routine; the Dock rule is a behaviour change, so it is a decision here). Evaluator 8's requests table also notes the help window is left out of the window count. Related: none.
- Guideline: none accepted yet (rule area: platform conventions)

</details>

### F165 · Esc does not close the Keyboard Shortcuts window

- **Impact:** Low · A reviewer who opens the list for a glance must reach for ⌘W or the close button, although the editor teaches Esc as "step back".
- **Current experience:** Esc does nothing in the Keyboard Shortcuts window (nor in the session window).
- **Visual:** No screenshot: a key that does nothing leaves nothing to show.
- **Recommendation:** Esc closes the Keyboard Shortcuts window, as macOS panels close with Esc.
- **Tradeoff:** Esc in the session window should stay inert, since that window holds editable text.
- **Decision needed:** Should Esc close the Keyboard Shortcuts window?
- **Verified:** read in the code (the window is a page with no script).
- **Owner's words:** "I should be getting out of this mode by pressing Escape or something." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: Keyboard Shortcuts window; build main v0.9.0
- Broken: platform conventions (Esc closes a panel); Nielsen 3
- Code: `src/main.ts:528-535` (a data URL page with no script)
- Screenshots: none
- Earlier IDs: none
- Other products: none noted
- Seen by: 4-64. Related: F164.
- Guideline: none accepted yet (rule area: keyboard and focus)

</details>

### F166 · ⌃ is drawn like a caret "^"

- **Impact:** Low · A reviewer reading the list sees "^⇧1", a key they cannot find on the keyboard.
- **Current experience:** The key column uses an 11-point monospace font, in which the Control symbol looks like a caret: "^⇧1 · Capture region".
- **Visual:** `shots/4-shortcuts-window.png`.
- **Recommendation:** Show key symbols in the system font at the size macOS menus draw them.
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen.
- **Owner's words:** "3. The shortcut Command-1 on Chrome changes the tab. How about we do something different?" — 2026-09-28

<details><summary>Supporting notes</summary>

- Where: Keyboard Shortcuts window, key column; build main v0.9.0
- Broken: rule area platform conventions (key symbols as macOS draws them)
- Code: `src/main.ts:531` (`kbd{font:600 11px ui-monospace}`)
- Screenshots: 4-shortcuts-window.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 4-20 [the Keyboard Shortcuts window part]. Related: F046 (the area picker part).
- Guideline: none accepted yet (rule area: platform conventions)

</details>

### F167 · The two tables use different column widths

- **Impact:** Low · A reviewer scanning the list reads two tables whose names and descriptions do not line up, so it reads as two lists rather than one.
- **Current experience:** "Editor tools" and "Other keys" each size their own columns, so the name and description columns start at different places in the two tables.
- **Visual:** `shots/3-shortcuts-light.png`.
- **Recommendation:** One table, or the same column widths in both.
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen.
- **Owner's words:** "ok can you show the shortcut keys again." — 2026-09-26

<details><summary>Supporting notes</summary>

- Where: Keyboard Shortcuts window; build main v0.9.0
- Broken: visual alignment; Gestalt: continuity
- Code: `src/main.ts:508-537`
- Screenshots: 3-shortcuts-light.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 3-30 [column widths]. Related: F160.
- Guideline: none accepted yet (rule area: visual design)

</details>

### F168 · The tables have no column headers

- **Impact:** Low · A reviewer using VoiceOver hears loose cells ("1 again", "image", "Card", "a yellow card whose…") with nothing tying key, tool and meaning together.
- **Current experience:** Both tables are laid out as plain grids with no header row, so a screen reader treats them as layout and reads the cells one by one.
- **Visual:** `shots/5-shortcuts-window-light.png`.
- **Recommendation:** Add a header row (Key · Tool · What it does); it may be visually hidden.
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen (the accessibility tree shows layout tables).
- **Owner's words:** "ok can you show the shortcut keys again." — 2026-09-26

<details><summary>Supporting notes</summary>

- Where: Keyboard Shortcuts window, both tables; build main v0.9.0
- Broken: WCAG 2.2 1.3.1 Info and Relationships (A)
- Code: `src/main.ts:510-533`
- Screenshots: 5-shortcuts-window-light.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 5-40. Related: F169.
- Guideline: none accepted yet (rule area: platform conventions)

</details>

### F169 · Each tool icon is read as "image"

- **Impact:** Low · A reviewer using VoiceOver hears "image" thirteen times while going through the tool list.
- **Current experience:** Every row of "Editor tools" starts with the tool's icon, which carries no name, so VoiceOver announces it as "image".
- **Visual:** `shots/5-shortcuts-window-light.png`.
- **Recommendation:** Hide the icons from assistive technology; the tool's name follows in the same row.
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** seen on screen.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: Keyboard Shortcuts window, "Editor tools"; build main v0.9.0
- Broken: WCAG 2.2 1.1.1 Non-text Content (A)
- Code: `src/main.ts:511`
- Screenshots: 5-shortcuts-window-light.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 5-41. Related: F168.
- Guideline: none accepted yet (rule area: platform conventions)

</details>

### F170 · The window declares no language

- **Impact:** Low · A reviewer using VoiceOver with a non-English system voice may hear the list read with the wrong pronunciation.
- **Current experience:** The window's page sets no language, so VoiceOver guesses how to read it.
- **Visual:** No screenshot: a page setting.
- **Recommendation:** Declare English on the page.
- **Tradeoff:** A future translation must update it.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code; confirmed by a script run on the build (no screenshot).
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: Keyboard Shortcuts window; build main v0.9.0
- Broken: WCAG 2.2 3.1.1 Language of Page (A); axe-core html-has-lang
- Code: `src/main.ts:528`
- Screenshots: none
- Earlier IDs: none
- Other products: none noted
- Seen by: 5-42, 8-31 [the generated help page part]. Probe: `scLang: "(none)"`. Related: F047, F121, F156, F206.
- Guideline: none accepted yet (rule area: platform conventions)

</details>

## Notifications and dialogs

### F171 · A failed export shows the raw error text

- **Impact:** Medium · When sharing with a person, a reviewer whose PDF or ZIP export fails gets a programmer's message in a passing banner, with no reason in plain words and no next step.
- **Current experience:** The notification's title is "Snapmark: PDF export failed" (or "Snapmark: ZIP export failed") and its body is the error as thrown, for example "Error: ENOENT: no such file or directory, open '…'", "Error: ENOSPC: no space left on device, write" or "Error: Command failed: zip -r -X -q …". The banner disappears after a few seconds; the menu then offers Export again with no memory of the failure.
- **Visual:** No screenshot: notifications cannot be pictured by the harness. Wording:

  | Where                             | Before                                                                          | After                                                                                                                          |
  | --------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
  | Notification, PDF, disk full      | "Snapmark: PDF export failed" / "Error: ENOSPC: no space left on device, write" | "Couldn't export the PDF" / "The disk is full. Free some space, then choose Export Session again."                             |
  | Notification, PDF, folder missing | "Snapmark: PDF export failed" / "Error: ENOENT: …"                              | "Couldn't export 28 Sep 14.32 as PDF" / "The session folder could not be written. Check that it still exists, then try again." |
  | Notification, ZIP                 | "Snapmark: ZIP export failed" / "Error: Command failed: zip …"                  | "Couldn't export the ZIP" / "The session folder may be missing or still syncing. Try again, or choose Show Session in Finder." |

- **Recommendation:** Say what failed, what it means and what to do, in the reviewer's words, and keep the raw text in a log only. The reviewer can then fix the cause and export again without guessing.
- **Tradeoff:** Known causes need mapping to sentences, and unknown ones still need a general fallback line. Alternatives from the evaluators for where the failure lives: (a) wording only, in the notification; (b) also keep the last failure visible in the menu under Export until an export succeeds; (c) a persistent message with "Retry" and "Choose export location", kept with the operation.
- **Decision needed:** Beyond plain-language wording, should a failed export stay visible (a line under Export in the menu, with Retry) until the next export succeeds?
- **Verified:** read in the code (export itself was timed: 12 screenshots to PDF in 0.3 s and to ZIP in 0.02 s).
- **Owner's words:** "Also I wonder what the best way of making this portable is: being able to share this as a PDF or zip it, maybe both." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: notification after menu → Export Session ▸ PDF or ZIP fails; build main v0.9.0
- Broken: Nielsen 9 (recognise, diagnose, recover); Shneiderman informative feedback; selective attention; writing rules "errors read event · consequence · action" and "no system words"
- Code: `src/main.ts:420-426` (notification body is the error object), `src/main.ts:397-399`
- Screenshots: none
- Earlier IDs: 2026-09-25 audit F143 (still open)
- Other products: none noted (no directly equivalent export-error presentation was verified)
- Seen by: 2-36 (Low; plain words plus the last failure kept in the menu), 4-32 [export part] (plain words, raw text in the log), 6-54 (Low; plain words, raw error in a log), 7-45 (Low; plain words), 8-26 (persistent recovery message with Retry and Choose export location) (seen by 3 evaluators). Related: F197, F213.
- Guideline: none accepted yet (rule area: feedback and notifications)

</details>

### F172 · Every confirmation and error lives only in macOS notifications

- **Impact:** Medium · A reviewer who has turned notifications off for Snapmark, or has a Focus mode on or is screen sharing, gets no sign at all that a copy, a new session or a failure happened, in every scene.
- **Current experience:** Everything that happens outside Snapmark's windows is reported only as a macOS notification titled "Snapmark": "Prompt for 28 Sep 14.32 copied. Paste it into your AI agent.", "New session: 2026-09-28 14.40", "28 Sep 14.32 is no longer in ~/Documents/Snapmark", "Control+Shift+1 is taken by another app", "A session named Checkout review already exists." and "Snapmark: PDF export failed". Nothing checks whether notifications can be shown, none of these is repeated anywhere in the app, and a banner disappears after a few seconds.
- **Visual:** No screenshot: notifications cannot be pictured by the harness.
- **Recommendation:** Keep notifications for confirmations, but put every error and warning where it happened as well (a line in the menu, the editor's footer, the session window), and give copies a quiet confirmation in the menu itself. The reviewer then never depends on a banner that may never appear.
- **Tradeoff:** More places to show state, and each one needs clearing; the menu grows while a problem is open. Alternatives from the evaluators: (a) for copies, a brief tick on the menu bar icon; (b) for copies, a "Copied" sublabel on the menu item for a few seconds; (c) for errors, a line under the item that failed; (d) for errors, a line at the top of the menu.
- **Decision needed:** Should errors and changes of state also show in the menu or the window where they happened, not only as notifications?
- **Verified:** read in the code; the effect of notification settings and Focus is an assumption, not checked.
- **Owner's words:** "The interface doesn't make sense. "Copy for AI," "Copy Paste," "Copy what?" It's not clear what's getting copied." — 2026-09-26

<details><summary>Supporting notes</summary>

- Where: all notifications (New Session, copies, missing session, rename conflict, export failure, shortcut taken, update check); build main v0.9.0
- Broken: writing rule "a disappearing message never carries the only copy of something the user needs"; rule area feedback and notifications; Nielsen 1, 9; Laws of UX: selective attention
- Code: `src/main.ts:102-106` (`notify()`), used at lines 113, 115, 361, 382, 395-398, 424, 460, 475, 500, 546, 550, 591
- Screenshots: none
- Earlier IDs: none
- Other products: none noted
- Seen by: 2-37 (menu line under the failed item, editor footer, session window; menu bar icon tick for copies), 6-53 (a line at the top of the menu for a failed export or missing session), 7-44 ("Copied" sublabel on the menu item; errors in the window that caused them) (seen by 2 evaluators). Related: F062, F171, F173.
- Guideline: none accepted yet (rule area: feedback and notifications)

</details>

### F173 · The shortcut-clash notification speaks code and gives no way forward

- **Impact:** Medium · A reviewer whose ⌃⇧1, ⌃⇧2 or ⌃⇧3 is already used by another app loses capturing on the fly, and the only sign is one passing notification in the program's key names that says nothing about what to do.
- **Current experience:** At launch the notification reads "Control+Shift+1 is taken by another app" (and the same for "Control+Shift+3" and "Control+Shift+2", one notification per key). It is shown once and is easily missed; on a first launch it is the notification that triggers macOS's own permission question. The menu then shows "Capture Screenshot (shortcut unavailable)".
- **Visual:** No screenshot: notifications cannot be pictured. Wording:

  | Where                  | Before                                    | After                                                                                                                              |
  | ---------------------- | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
  | Notification at launch | "Control+Shift+1 is taken by another app" | "⌃⇧1 is used by another app, so Capture Screenshot has no shortcut. Use the menu bar icon, or quit that app and restart Snapmark." |

- **Recommendation:** Write the keys in macOS symbols, say the consequence and the way forward, and send one notification for all keys that failed. The reviewer then knows which action lost its key and how to get it back.
- **Tradeoff:** None for the wording. The way forward depends on whether the keys become changeable: then the notification points at the setting ("Choose another in Settings ▸ Keyboard Shortcuts"); otherwise it points at the menu and the other app.
- **Decision needed:** Routine fix: no individual decision needed (where it points follows the decision on changeable shortcuts).
- **Verified:** read in the code.
- **Owner's words:** "This is also important: when I create, as I said, it needs to be shortcuts so I can just do this on the fly." — 2026-09-25. "3. The shortcut Command-1 on Chrome changes the tab. How about we do something different?" — 2026-09-28

<details><summary>Supporting notes</summary>

- Where: notification at launch; build main v0.9.0
- Broken: Nielsen 9 (recognise, diagnose, recover), 2 (match with the real world: Electron accelerator syntax), 4; writing: no system words, event · consequence · action; Laws of UX: Jakob's law (macOS apps show ⌃⇧ symbols)
- Code: `src/main.ts:585-592` (registration loop, notification at 590-591), `src/menu.ts:60-62`
- Screenshots: none
- Earlier IDs: 2026-09-25 audit F142 (same wording problem; key names changed since)
- Other products: none noted
- Seen by: 2-34 [wording, shown once] (after text points at Settings), 4-22 (after text points at the menu bar icon; one notification for all keys), 6-04 [wording] (after text points at Settings), 7-46 (Low; after text points at the menu or freeing the key) (seen by 2 evaluators). Related: F017, F021, F158.
- Guideline: none accepted yet (rule area: feedback and notifications)

</details>

### F174 · "Reopen Discarded…" is a folder picker on a hidden folder, not a list of what was discarded

- **Impact:** Medium · To bring back anything but the last discard while reviewing an overnight build, the reviewer must pick a folder by a generated name in a Finder dialog, without seeing the marked screenshot.
- **Current experience:** "Reopen Discarded…" opens a macOS folder chooser inside the hidden ".discarded" folder with the message "Screenshots closed without saving and removed from sessions, kept for 7 days." Each item is a folder named like "2026-09-28 22.19.00 · 2026-09-28 09.14 · screenshot 1" or "… · not saved", and the folders hold the clean capture, not the marked one. Picking any other folder gives a notification: "That folder is not in ~/Documents/Snapmark/.discarded."
- **Visual:** No screenshot: a native dialog, not scriptable. A folder name as created by the build: "2026-09-28 22.19.00 · 2026-09-28 09.14 · screenshot 1".
- **Recommendation:** Show Discarded inside Snapmark, in its own words and pictures: each item with a picture of the screenshot with its marks, the time and the session, and one action to bring it back. That is the Discarded tab in the session window the owner already accepted on 2026-09-25, which was not built.
- **Tradeoff:** A new list to build; captures discarded before they belonged to a session need a home outside one session's window. Alternatives from the evaluators: (a) a Discarded tab in the session window, or a small window, with thumbnails, time, session, expiry and Restore; (b) a submenu listing the last ten discards as "14:02 · Checkout review · not saved" (cheap, but the reviewer recognises the screenshot only by its time); the folder picker could stay as a fallback.
- **Decision needed:** Should Discarded become a list inside Snapmark (a tab or window with thumbnails, or a submenu of the last ten) instead of the folder picker?
- **Verified:** read in the code; the folder names were seen in the temp sessions folders of script runs.
- **Owner's words:** "I guess in the menu item it would be nice to see the current session screenshots and be able to flip through them, recover them, or just card them." — 2026-09-25. "I just wonder if we should introduce a shortcut with Escape and be able to recover it so nothing ever gets lost." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: menu → Reopen Discarded… (native open panel); build main v0.9.0
- Broken: Nielsen 6 (recognition rather than recall), 2 (the system's folders, not the reviewer's screenshots), 7; Laws of UX: mental model, Tesler's law, working memory; checklist navigation 8
- Code: `src/main.ts:371-384` (`reopenDiscarded`), `src/sessions.ts:163-174` (discard folder naming uses the full session folder name)
- Screenshots: none
- Earlier IDs: decision 2026-09-25 "Menu "Browse screenshots…": a window, ←/→ to flip, "Edit again" with editable marks, "Remove from session", discarded screenshots in their own tab", answered "Session window (Recommended)" — the tab was not built
- Other products: macOS Photos "Recently Deleted" album; Figma "Trash" list; CleanShot X capture history with thumbnails; Shottr history window
- Seen by: 1-28 (third tab of the session window or a small window, "Restore" per item), 2-17 (build the accepted Discarded tab, drop the picker), 6-11 (submenu of recent discards or a thumbnail window), 7-51 (Low; Discarded view with thumbnails or a submenu of the last ten), 8-36 (visual list with thumbnails, session names, times, expiry; keep Reopen Last Discarded) (seen by 3 evaluators). Related: F011, F187, F188, F189.
- Guideline: none accepted yet (rule area: confirmation and undo)

</details>

### F175 · Choosing a new Sessions Folder leaves every existing session behind without a word

- **Impact:** Medium · When sharing with a person, a reviewer who points Snapmark at iCloud Drive or Google Drive (the flow the README recommends) sees every earlier session vanish from Switch Session, which looks like data loss.
- **Current experience:** Settings ▸ "Sessions Folder…" (sub-line "~/Documents/Snapmark") opens a folder chooser whose only explanation is its title, "Choose where Snapmark keeps sessions", which macOS open panels may not show, with the default button "Open". After choosing, the sessions and the Discarded items stay in the old folder, the menu lists only what is in the new one, and the current session becomes the new folder's first session, or none. "Other Session…" then refuses the old ones ("That folder is not a session in ~/…"), so the only way back is to switch the folder back.
- **Visual:** No screenshot: a native dialog, not scriptable. Wording, if the behaviour stays:

  | Where                 | Before       | After                                                                                                                                                                         |
  | --------------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | Folder picker message | (none shown) | "New sessions go to the folder you choose. Sessions already in ~/Documents/Snapmark stay there and leave the Switch Session list; move them in Finder to keep them together." |
  | Button                | "Open"       | "Use This Folder"                                                                                                                                                             |

- **Recommendation:** Say what happens to the existing sessions before the change, and after it offer to bring them along ("Move 12 sessions to the new folder? Move · Leave Them"), then confirm where sessions are now saved.
- **Tradeoff:** Moving many sessions into a synced folder takes time and can fail part-way, so it needs progress and a clear partial-failure message. Alternatives from the evaluators: (a) offer to move the existing sessions after choosing, and let "Other Session…" open a session from any folder; (b) explain the consequence in the picker's message and name the button, leaving the move to Finder; (c) treat the choice as switching libraries only, state that before applying it, and offer migration as a separate action.
- **Decision needed:** When the sessions folder changes, should Snapmark offer to move the existing sessions, or only say plainly that they stay behind?
- **Verified:** read in the code; that macOS hides the panel's title is an assumption, not checked.
- **Owner's words:** "Also I wonder what the best way of making this portable is: being able to share this as a PDF or zip it, maybe both. Having it in the cloud." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: menu → Settings ▸ Sessions Folder… (native open panel); Switch Session ▸ Other Session…; build main v0.9.0
- Broken: Nielsen 1, 2, 3, 5, 9; Laws of UX: mental model, Tesler's law; rule area local work and external writes; setup flow "Move sessions into iCloud Drive or Google Drive"; checklist navigation 8
- Code: `src/main.ts:86-98` (`chooseRoot`: sets root and current session, no move, no notification; `title` only, no `message`, no `buttonLabel`), `otherSession` refuses folders outside the root, `src/menu.ts:127`
- Screenshots: none (the Settings submenu is in `1-menu-full.png`)
- Earlier IDs: sitemap 2026-09-25 "existing sessions stay behind" (still true)
- Other products: macOS Screenshot's "Other Location…" and CleanShot X's export location change only where new captures go; neither has sessions to lose, so the precedent is weak
- Seen by: 1-10 (offer to move; Other Session… from any folder), 2-50 (offer to move, confirm the new location), 4-43 (message and button wording, marked routine), 8-05 (switch libraries only, state the consequence, separate migration action). Related: F004, F186.
- Guideline: none accepted yet (rule area: local work and external writes)

</details>

### F176 · A new session cannot be undone from its notification

- **Impact:** Medium · A reviewer who started a new session by mistake while reviewing an overnight build must go to the menu and tell two sessions apart by their minute, and the empty session stays behind.
- **Current experience:** New Session shows one notification, "New session: 2026-09-28 14.40", with no action and nothing that happens on a click. Getting back means menu → Switch Session ▸ and picking the previous session, told apart from the new one only by the minute ("28 Sep 14.02" against "28 Sep 14.40"). Screenshots already added to the new session cannot be moved back, and the new, empty session stays in the list.
- **Visual:** Proposal: `shots/4-proposal-new-session-keys.png` (last line: notification "New session 28 Sep 14.40. Click to go back to 28 Sep 14.02.").
- **Recommendation:** Clicking the notification switches back to the previous session, and a new session that never received a screenshot is removed when the reviewer switches away from it. A slip then costs one click.
- **Tradeoff:** The click still depends on a notification the reviewer may not see; removing an unused empty session also removes one made on purpose to fill later (it holds only its title, so nothing is lost).
- **Decision needed:** Should a new session be reversible from its notification, and an unused empty one disappear when the reviewer switches away?
- **Verified:** read in the code.
- **Owner's words:** "Also the new session is a very dangerous shortcut because it sits in between 1 and 2." — 2026-09-28

<details><summary>Supporting notes</summary>

- Where: notification after New Session (⌃⇧2 or the menu); Switch Session; build main v0.9.0
- Broken: Nielsen 3 (user control and freedom); Shneiderman permit easy reversal of actions; rule area confirmation and undo
- Code: `src/main.ts:102-106` (`notify` takes an optional click handler), `src/main.ts:115` (none passed), `src/main.ts:110-116` (`newSession`)
- Screenshots: `4-proposal-new-session-keys.png`
- Earlier IDs: none
- Other products: none noted
- Seen by: 4-03. 6-01 and 7-01 (under the New Session key finding) also recommend an Undo in this notification. Related: F020, F225.
- Guideline: none accepted yet (rule area: confirmation and undo)

</details>

### F177 · Renaming to a taken name closes the dialog and loses what was typed

- **Impact:** Low · A reviewer who types a name that is already used gets the dialog closed, the typed name gone and a notification instead of a message beside the field, and must start again from the menu.
- **Current experience:** "Rename Session…" shows a small "Rename session" dialog with "Cancel" and "Rename". The name is checked only after the dialog has closed: a taken name gives the notification "A session named Checkout review already exists." and the dialog is gone; an empty or unchanged name does nothing at all.
- **Visual:** No screenshot: a native dialog, not scriptable. Wording:

  | Where                          | Before                                                                | After                                                                                                                       |
  | ------------------------------ | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
  | After Rename with a taken name | notification "A session named Checkout already exists." (dialog gone) | the dialog stays open with the typed name: "There is already a session called Checkout. Choose another name."               |
  | If the notification stays      | "A session named Checkout review already exists."                     | "Couldn't rename 28 Sep 14.32: a session named Checkout review already exists. Choose Rename Session… to try another name." |

- **Recommendation:** Check the name while the dialog is open and keep it open, with the typed name and the reason, until the name is valid, so a clash costs one edit instead of a trip back through the menu.
- **Tradeoff:** Keeping the dialog open needs Snapmark's own rename window instead of the system's one-line dialog. Alternatives from the evaluators: (a) validate inside the dialog and keep it open; (b) reopen the dialog with the typed name and the reason; (c) offer a free name such as "Checkout review (2)"; (d) at least reword the notification with the next step.
- **Decision needed:** When a name is taken, should the rename dialog stay open (or reopen) with the typed name, or should Snapmark offer a free name such as "Checkout review (2)"?
- **Verified:** read in the code.
- **Owner's words:** "Also it's not clear that you can only rename the current session and show the current session in Finder but it's not clear what's happening." — 2026-09-26

<details><summary>Supporting notes</summary>

- Where: menu → Rename Session… (osascript dialog) and the notification after it; build main v0.9.0
- Broken: checklist forms 3 (specific errors), 4 (validation before submit), 5 (entered data kept after an error); Nielsen 9
- Code: `src/main.ts:465-488`, `src/main.ts:475` (the notification), `src/sessions.ts:94-101`
- Screenshots: none
- Earlier IDs: none
- Other products: none noted
- Seen by: 2-47 [checked after closing] (message under the field before it closes), 3-37 [taken and empty names] (validate inside the dialog, keep it open), 4-38 (reword the notification; reopen as a behaviour change), 6-56 [taken name] (reopen the dialog with the text kept), 7-55 [taken name] (reopen with the typed name, or offer "Checkout review (2)") (seen by 2 evaluators). Related: F178, F190.
- Guideline: none accepted yet (rule area: forms and validation)

</details>

### F178 · Rename silently changes "/" and ":"

- **Impact:** Low · A reviewer who names a session "Checkout 2/3" gets "Checkout 2-3" and is never told, so the name in the menu is not the one they typed.
- **Current experience:** In "Rename Session…", "/" and ":" are replaced by "-" without a word: "Q3/Q4 review" becomes "Q3-Q4 review", "Checkout 2/3" becomes "Checkout 2-3".
- **Visual:** No screenshot: a native dialog. Wording:

  | Where                            | Before                                          | After                                                      |
  | -------------------------------- | ----------------------------------------------- | ---------------------------------------------------------- |
  | After renaming to "Checkout 2/3" | (nothing; the session is called "Checkout 2-3") | "Renamed to Checkout 2-3: / and : can't be used in names." |

- **Recommendation:** Say what changed, and why, when the name is saved (or under the field before the dialog closes), so the reviewer is never surprised by the name in the menu.
- **Tradeoff:** None worth naming.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code.
- **Owner's words:** "Also it's not clear that you can only rename the current session and show the current session in Finder but it's not clear what's happening." — 2026-09-26

<details><summary>Supporting notes</summary>

- Where: menu → Rename Session…; build main v0.9.0
- Broken: checklist forms 3 (specific errors); Nielsen 1, 9
- Code: `src/main.ts:465-488`, `src/sessions.ts:94-101`
- Screenshots: none
- Earlier IDs: none
- Other products: none noted
- Seen by: 3-37 [silent character replacement], 6-56 [silent character replacement], 7-55 [silent character replacement] (seen by 2 evaluators). Related: F177.
- Guideline: none accepted yet (rule area: forms and validation)

</details>

### F179 · "…is still empty, so new captures keep going there." does not say that nothing happened

- **Impact:** Low · A reviewer who presses New Session on an empty session (often a slip aiming at a capture) gets a sentence that explains something they did not ask about, and has to work out that no session was made.
- **Current experience:** With an empty current session, New Session refuses and shows "28 Sep 14.32 is still empty, so new captures keep going there." It uses "captures", a noun the app uses nowhere else for screenshots.
- **Visual:** No screenshot: notifications cannot be pictured. Wording:

  | Where                                         | Before                                                           | After                                                                       |
  | --------------------------------------------- | ---------------------------------------------------------------- | --------------------------------------------------------------------------- |
  | Notification, New Session on an empty session | "28 Sep 14.32 is still empty, so new captures keep going there." | "No new session: 28 Sep 14.32 has no screenshots yet, so it stays current." |

- **Recommendation:** Lead with the outcome, then the reason, in the app's own noun.
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code.
- **Owner's words:** "Also the new session is a very dangerous shortcut because it sits in between 1 and 2." — 2026-09-28

<details><summary>Supporting notes</summary>

- Where: notification from ⌃⇧2 or the menu's New Session, with an empty current session; build main v0.9.0
- Broken: Nielsen 1 (visibility of system status), 9; writing: outcome first, one vocabulary ("screenshot")
- Code: `src/main.ts:112-113`
- Screenshots: none
- Earlier IDs: none
- Other products: none noted
- Seen by: 4-04, 6-03. Related: F020, F176.
- Guideline: none accepted yet (rule area: feedback and notifications)

</details>

### F180 · The quit question does not say what quitting does to the screenshot

- **Impact:** Low · A reviewer quitting with an unfinished screenshot must choose without knowing that "Quit anyway" keeps it in Discarded for 7 days, and "Review" does not say what it shows.
- **Current experience:** The dialog reads "1 screenshot is not in a session yet." with the buttons "Review" and "Quit anyway", and no second line. "Quit anyway" closes the editors, and each capture with its marks goes to Discarded.
- **Visual:** No screenshot: a native dialog. Wording:

  | Where                     | Before                   | After                                                                                 |
  | ------------------------- | ------------------------ | ------------------------------------------------------------------------------------- |
  | Quit warning, detail line | (none)                   | "If you quit, it goes to Discarded for 7 days. Reopen Last Discarded brings it back." |
  | Buttons                   | "Review" · "Quit anyway" | "Show Screenshot" · "Quit Anyway"                                                     |

- **Recommendation:** Add the consequence as the dialog's second line and name the buttons after what they do, so the choice is informed.
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code.
- **Owner's words:** "I think another thing is, if I took a screenshot, annotated it, and discarded it, it is gone." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: Quit Snapmark / ⌘Q with an unsaved editor (native message box); build main v0.9.0
- Broken: writing rule "every confirmation says exactly what will happen and whether it can be undone"; Nielsen 1; checklist content 2 (buttons name their action)
- Code: `src/main.ts:607-614` (no `detail`)
- Screenshots: none
- Earlier IDs: none
- Other products: none noted
- Seen by: 2-11 (detail "It stays in Reopen Discarded for 7 days.", buttons Review · Quit), 4-42 (detail and buttons "Show Screenshot" · "Quit Anyway"). Related: F181, F182, F183, F212.
- Guideline: none accepted yet (rule area: dialogs, menus and popovers)

</details>

### F181 · "Review" in the quit question brings forward only the first of several editors

- **Impact:** Low · A reviewer with several unfinished screenshots who chooses "Review" sees one of them; the others stay where they were, often exactly underneath it.
- **Current experience:** The dialog counts them ("3 screenshots are not in a session yet."), but "Review" shows and focuses only the first editor.
- **Visual:** No screenshot: a native dialog.
- **Recommendation:** "Review" brings every unfinished editor forward, cascaded so each one can be seen.
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: Quit with several unsaved editors → "Review"; build main v0.9.0
- Broken: Nielsen 1; Laws of UX: Zeigarnik effect
- Code: `src/main.ts:602-605` (only `open[0].win` is shown)
- Screenshots: none
- Earlier IDs: none
- Other products: none noted
- Seen by: 2-12. Related: F180.
- Guideline: none accepted yet (rule area: dialogs, menus and popovers)

</details>

### F182 · The quit question says "not in a session yet" for an Edit Again

- **Impact:** Low · A reviewer quitting with an Edit Again window open is told the screenshot is not in a session, when it is, and only its changes are unsaved.
- **Current experience:** With an Edit Again editor open, quitting shows "1 screenshot is not in a session yet." with "Review" and "Quit anyway", the same words as for a new capture.
- **Visual:** No screenshot: a native dialog. Wording:

  | Where                        | Before                                  | After                                          |
  | ---------------------------- | --------------------------------------- | ---------------------------------------------- |
  | Quit dialog, Edit Again open | "1 screenshot is not in a session yet." | "1 screenshot has changes that are not saved." |

- **Recommendation:** Word the dialog for both cases: new screenshots not yet added, and saved screenshots with unsaved changes.
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: Quit with an Edit Again editor open; build main v0.9.0
- Broken: Nielsen 1, 2; writing: confirmations say exactly what will happen
- Code: `src/main.ts:260-263, 597-620`, `src/editor.ts:810-811`
- Screenshots: none
- Earlier IDs: none
- Other products: none noted
- Seen by: 7-54 [wording for Edit Again]. Related: F180, F183.
- Guideline: none accepted yet (rule area: dialogs, menus and popovers)

</details>

### F183 · The quit question still warns after every mark was undone

- **Impact:** Low · A reviewer who undid every mark in an editor is still asked whether to quit, as if there were work to lose.
- **Current experience:** Adding any mark flags the editor as unsaved, and nothing ever clears the flag, not even undoing every mark. An Edit Again editor is flagged the moment it opens, because it puts the old marks back. Quitting then shows "1 screenshot is not in a session yet."
- **Visual:** No screenshot: a native dialog.
- **Recommendation:** Track unsaved changes against the last saved state, so the question appears only when something would actually be lost.
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: Quit with an editor whose marks were all undone, or an unchanged Edit Again; build main v0.9.0
- Broken: Nielsen 1; writing: confirmations say exactly what will happen
- Code: `src/editor.ts:810-811` (marks set the unsaved flag; nothing clears it), `src/main.ts:260-263, 597-620`
- Screenshots: none
- Earlier IDs: none
- Other products: none noted
- Seen by: 7-54 [unsaved flag never cleared]. Related: F180, F182.
- Guideline: none accepted yet (rule area: saving and unsaved work)

</details>

### F184 · "Path to 28 Sep 14.32 copied." names the session, while the clipboard holds the file's path

- **Impact:** Low · The confirmation says one thing (the session) while the clipboard holds another (the path to session.md inside it), so a reviewer who pastes it into Finder's Go to Folder opens the file, not the folder.
- **Current experience:** After "Copy session.md Path" the notification reads "Path to 28 Sep 14.32 copied."
- **Visual:** No screenshot: notifications cannot be pictured. Wording:

  | Where                            | Before                         | After                                            |
  | -------------------------------- | ------------------------------ | ------------------------------------------------ |
  | Notification after the path copy | "Path to 28 Sep 14.32 copied." | "Copied the path to session.md in 28 Sep 14.32." |

- **Recommendation:** Name the file that was copied.
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code.
- **Owner's words:** "One thing, actually, from the menu item: I want to be able to copy and paste the path to the Markdown from the current session. I just paste it and then I can point the AI to it." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: notification after menu → Copy session.md Path; build main v0.9.0
- Broken: Nielsen 1, 2; writing: say exactly what happened
- Code: `src/main.ts:548-551`
- Screenshots: none
- Earlier IDs: none
- Other products: none noted
- Seen by: 4-06 (1-01 notes the same wording inside the copy-items finding). Related: F001, F205.
- Guideline: none accepted yet (rule area: copy and paste)

</details>

### F185 · "…is no longer in ~/Documents/Snapmark" stops mid-thought

- **Impact:** Low · A reviewer whose session folder was moved or deleted outside Snapmark is told only that it is gone: no full stop, no reason, no next step, and not that clicking the notification opens the menu.
- **Current experience:** Notification "28 Sep 14.32 is no longer in ~/Documents/Snapmark". Clicking it reopens the menu, which the text does not say.
- **Visual:** No screenshot: notifications cannot be pictured. Wording:

  | Where        | Before                                              | After                                                                                                                           |
  | ------------ | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
  | Notification | "28 Sep 14.32 is no longer in ~/Documents/Snapmark" | "28 Sep 14.32 is no longer in ~/Documents/Snapmark. It was moved or deleted outside Snapmark. Click to choose another session." |

- **Recommendation:** Finish the sentence with the reason and the way forward.
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: notification after acting on a session whose folder is missing; build main v0.9.0
- Broken: writing: event · consequence · action; checklist content 4 (grammar); Nielsen 9
- Code: `src/main.ts:458-462`
- Screenshots: none
- Earlier IDs: none
- Other products: none noted
- Seen by: 4-39. Related: F009.
- Guideline: none accepted yet (rule area: feedback and notifications)

</details>

### F186 · "Other Session…" does not say what to pick, and a wrong pick is told only afterwards

- **Impact:** Low · A reviewer reaching for an older session gets a bare folder panel with no instructions, and learns only after it closes that the folder they picked was not a session.
- **Current experience:** The panel opens at the sessions folder with the title "Choose a session" (macOS does not show panel titles), no message and the default button "Open". Picking a folder outside the sessions folder, or one without a session.md, gives the notification "That folder is not a session in ~/Documents/Snapmark." after the panel has closed. Sessions Folder… has the same missing message and "Open" button.
- **Visual:** No screenshot: a native dialog. Wording:

  | Where                           | Before                                                  | After                                                                                                        |
  | ------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
  | Panel message                   | (none)                                                  | "Pick a session folder in ~/Documents/Snapmark."                                                             |
  | Panel button                    | "Open"                                                  | "Switch to Session"                                                                                          |
  | Notification after a wrong pick | "That folder is not a session in ~/Documents/Snapmark." | "That folder isn't a Snapmark session. Choose a folder inside ~/Documents/Snapmark that holds a session.md." |

- **Recommendation:** Give the panel a message and a button that names the action, and word the refusal so it says what a session folder is.
- **Tradeoff:** None for the wording. Listing every session inside Snapmark, so the panel is rarely needed, is a separate and larger change.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: menu → Switch Session ▸ Other Session… (native open panel) and the notification after a wrong pick; the same pattern in Sessions Folder…; build main v0.9.0
- Broken: Nielsen 5, 6, 9; writing: buttons name the action
- Code: `src/main.ts:490-502` (title only, no message, default button), `src/main.ts:499-500` (notification), `src/main.ts:87-98` (Sessions Folder…)
- Screenshots: none
- Earlier IDs: none
- Other products: none noted
- Seen by: 2-48 (message and button; better, list the sessions after the first 20), 4-40 (notification wording; same missing message and "Open" button in Sessions Folder…). Related: F004, F175.
- Guideline: none accepted yet (rule area: dialogs, menus and popovers)

</details>

### F187 · A notification names the hidden folder ".discarded"

- **Impact:** Low · A reviewer who picks the wrong folder in Reopen Discarded… is told about an internal folder they never see in Finder.
- **Current experience:** After choosing a folder outside it: "That folder is not in ~/Documents/Snapmark/.discarded."
- **Visual:** No screenshot: notifications cannot be pictured. Wording:

  | Where        | Before                                                   | After                                                                             |
  | ------------ | -------------------------------------------------------- | --------------------------------------------------------------------------------- |
  | Notification | "That folder is not in ~/Documents/Snapmark/.discarded." | "That folder isn't in Discarded. Choose one of the folders the dialog opened on." |

- **Recommendation:** Use the app's word "Discarded" and say what to do.
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: notification after a wrong pick in Reopen Discarded…; build main v0.9.0
- Broken: writing: no system words; Nielsen 2, 9
- Code: `src/main.ts:382`
- Screenshots: none
- Earlier IDs: none
- Other products: none noted
- Seen by: 4-41. Related: F174.
- Guideline: none accepted yet (rule area: feedback and notifications)

</details>

### F188 · The Reopen Discarded dialog joins two kinds of screenshot with "and", and its button says "Open"

- **Impact:** Low · The dialog's one sentence reads as one kind of screenshot that is both closed and removed, and never says what to do in it.
- **Current experience:** Folder picker message: "Screenshots closed without saving and removed from sessions, kept for 7 days." The button is macOS's default "Open".
- **Visual:** No screenshot: a native dialog. Wording:

  | Where                     | Before                                                                          | After                                                                                                                              |
  | ------------------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
  | Reopen Discarded… message | "Screenshots closed without saving and removed from sessions, kept for 7 days." | "Screenshots you closed without adding, and screenshots removed from a session. Each is kept for 7 days. Choose one to reopen it." |
  | Button                    | "Open"                                                                          | "Reopen"                                                                                                                           |

- **Recommendation:** Name both kinds, say what to do, and name the button after the action.
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code.
- **Owner's words:** "I just wonder if we should introduce a shortcut with Escape and be able to recover it so nothing ever gets lost." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: menu → Reopen Discarded… (native open panel); build main v0.9.0
- Broken: writing: buttons name the action; checklist content 2
- Code: `src/main.ts:374-379` (message set, no button label)
- Screenshots: none
- Earlier IDs: none
- Other products: none noted
- Seen by: 4-34. Related: F174, F189.
- Guideline: none accepted yet (rule area: dialogs, menus and popovers)

</details>

### F189 · Discarded items are named like log lines

- **Impact:** Low · In the Reopen Discarded… picker the reviewer reads two timestamps in a row, the session's long name and "not saved", where the menu says "discarded".
- **Current experience:** Each discard is filed in a folder named like "2026-09-28 22.22.27 · 2026-09-28 14.32 · not saved" (closed without adding) or "2026-09-28 22.22.27 · Checkout review · screenshot 2" (removed from a session).
- **Visual:** No screenshot: a native dialog. Wording:

  | Where                     | Before                                                 | After                                                     |
  | ------------------------- | ------------------------------------------------------ | --------------------------------------------------------- |
  | Discarded folder, closed  | "2026-09-28 22.22.27 · 2026-09-28 14.32 · not saved"   | "28 Sep 22.22 · closed without adding · 28 Sep 14.32"     |
  | Discarded folder, removed | "2026-09-28 22.22.27 · Checkout review · screenshot 2" | "28 Sep 22.22 · screenshot 002 removed · Checkout review" |

- **Recommendation:** Time first in the short form, then what happened, then the session's short name.
- **Tradeoff:** Seconds go, so two discards in the same minute need "(2)".
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code; the names were seen in the output of a script run on the build.
- **Owner's words:** "Also it appears in the current session. I guess in the menu item it would be nice to see the current session screenshots and be able to flip through them, recover them, or just card them." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: the hidden Discarded folder as shown in the Reopen Discarded… picker; build main v0.9.0
- Broken: writing: one vocabulary, no system words; Nielsen 2
- Code: `src/sessions.ts:163-174`
- Screenshots: none
- Earlier IDs: none
- Other products: none noted
- Seen by: 4-35. Related: F174, F188.
- Guideline: none accepted yet (rule area: confirmation and undo)

</details>

### F190 · "Rename Session…" opens a dialog that is not Snapmark's own

- **Impact:** Low · The rename prompt comes from a system script runner, so it can carry a generic icon, may not come to the front, and cannot check the name before it closes.
- **Current experience:** "Rename Session…" shows "Rename session" with a text field and "Cancel" / "Rename", drawn by a system script rather than by Snapmark. A clash is refused only after the dialog closes.
- **Visual:** No screenshot: a native dialog, not scriptable.
- **Recommendation:** Rename in Snapmark's own small window, or in place in the session window's title, where the name can be checked while it is typed.
- **Tradeoff:** A little more code than the script dialog.
- **Decision needed:** Should renaming happen in Snapmark's own window (or in the session window's title) instead of the system's script dialog?
- **Verified:** read in the code; the icon and focus behaviour are an assumption, not checked.
- **Owner's words:** "Also it's not clear that you can only rename the current session and show the current session in Finder but it's not clear what's happening." — 2026-09-26

<details><summary>Supporting notes</summary>

- Where: menu → Rename Session… (osascript dialog); build main v0.9.0
- Broken: Nielsen 4, 9; checklist forms 4 (validation before submit)
- Code: `src/main.ts:465-488`
- Screenshots: none
- Earlier IDs: none
- Other products: none noted
- Seen by: 2-47 [the script dialog] (marked routine by the source; a new window is a behaviour change). Related: F177.
- Guideline: none accepted yet (rule area: dialogs, menus and popovers)

</details>

## session.md, prompt and exports

### F191 · session.md never says what was marked for removal, boxed, highlighted or pointed at

- **Impact:** High · An agent reading session.md cannot tell "remove this" from "look here" in the text: crosses, hatched areas, boxes, ellipses, arrows, pen strokes, highlights, spotlights and redactions leave no word in the text, so it must read every one of them from the picture, and a text-only read misses every removal.
- **Current experience:** One screenshot with a box, two references, a card, a cross, a hatched area, a highlight, an arrow, a pen loop, a moved piece and a redaction is saved as: the comment, "1. Make this the only primary button", "2. Round to thousands: €84k", "- Card: Load more should load 25, not 3" and "- Moved an element: …". Seven of the eleven marks are not mentioned. A quick verdict with one cross and one hatched area is saved as just "1. Keep the side nav as it is". Cards and moves get a line; removals do not. The copied prompt explains what each kind of mark means, but not which ones are on which screenshot.
- **Visual:**

  | Where                             | Before    | After (proposal)                                                                                |
  | --------------------------------- | --------- | ----------------------------------------------------------------------------------------------- |
  | session.md entry, after the notes | (nothing) | "- Marks: 2 remove (cross, hatched area) · 1 box · 1 arrow · 1 highlight · 1 pen · 1 redaction" |

  On screen: `shots/3-review-1180-light.png`, `shots/7-verdict-annotated.png`.

- **Recommendation:** End every entry with one "Marks:" line that counts the marks by kind, remove marks first. The agent then knows to look for red crosses before it opens the image, and a verdict ("remove 2 things") survives even when the image is not read.
- **Tradeoff:** About 15 to 25 tokens per entry; the line says that a mark exists, not where it is. A narrower version writes a line only for remove marks ("- Remove: 2 marks (red cross or hatched area): remove what is under them."), the way cards and moves already get one.
- **Decision needed:** Should every entry end with a count of all its marks by kind, or only with a line for the remove marks?
- **Verified:** seen on screen (session.md printed after saving).
- **Owner's words:** "It's basically for providing feedback to AI in a nice and token-efficient way." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: session.md entries; PDF export (same text); build main v0.9.0
- Broken: output-for-AI check (remove versus highlight versus card versus move from text alone); Nielsen 2; Nielsen 4 (cards and moves are written, removals are not); Tesler's law; Postel's law
- Code: `src/sessions.ts:59-77` (`entry()` writes caption, notes, cards and a move count only); `src/editor.ts:764-771` (save sends only those)
- Screenshots: 3-review-1180-light.png, 7-verdict.png, 7-verdict-annotated.png
- Earlier IDs: 2026-09-25 audit F148, F155 (still true)
- Other products: none noted
- Seen by: 3-10 (a "Marks:" count line per entry, remove first; High), 7-22 (a "Remove: N marks" line only; rated Medium and routine). Related: F193 (the key to the marks), F203.
- Guideline: none accepted yet (rule area: output for AI)

</details>

### F192 · Redact keeps the clear original in the session folder

- **Impact:** High · A reviewer who shares the session folder (a cloud folder, a copy for a teammate) can expose the very details they pixelated, because an unmarked original of every screenshot stays beside it.
- **Current experience:** The Redact tool's tooltip promises "pixelate to hide private details". On save, Snapmark keeps the unmarked screenshot in the session folder so Edit Again can reopen it. Nothing says so. The PDF and the ZIP leave these originals out.
- **Visual:**

  | Where          | Before                             | After (proposal)                                                              |
  | -------------- | ---------------------------------- | ----------------------------------------------------------------------------- |
  | Redact tooltip | "pixelate to hide private details" | "Hide details in exported images. Editable originals remain in this session." |

- **Recommendation:** Say that the originals stay, and offer a share-safe way out: a clear statement in the tooltip, and an explicit action that removes the original pixels of redacted screenshots (or a shareable copy of the session without them).
- **Tradeoff:** Removing originals ends Edit Again for those screenshots. The PDF and ZIP already leave the editable originals out.
- **Decision needed:** Should Snapmark explain that originals are kept, and offer a way to share a session without them?
- **Verified:** read in the code; no private content opened or exported.
- **Owner's words:** "Also I wonder what the best way of making this portable is: being able to share this as a PDF or zip it, maybe both. Having it in the cloud." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor, Redact (7 again); session folder; build main v0.9.0
- Broken: Nielsen 5 error prevention, Nielsen 2; mental model
- Code: `src/tools.ts:124-128`; `src/main.ts:253`; `src/sessions.ts:124-134`; `src/exporter.ts:11-16, 19-39`
- Screenshots: none
- Earlier IDs: none
- Other products: Xnapper's handling of originals was not checked
- Seen by: 8-24. It does not claim the ZIP contains the originals or that the pixelation can be reversed.
- Guideline: none accepted yet (rule area: privacy and sharing)

</details>

### F193 · The PDF and the ZIP never say what the marks mean

- **Impact:** Medium · A teammate or stakeholder who gets the PDF sees red crosses, a hatched box, red ellipses, dashed outlines with arrows and numbered circles, and has to guess which means "remove" and which means "look here"; the key exists only in the prompt the agent gets.
- **Current experience:** The PDF holds the session name, then per screenshot the heading ("001 · 22:13"), the image, the comment, the numbered notes and the card and move lines. The red cross has no text anywhere. The ZIP carries session.md and the images, with no key either.
- **Visual:** `shots/7-export-pdf-marked-annotated.png`, `shots/6-export-pages.png`.
- **Recommendation:** Carry a short key to the marks in the export: one line per kind of mark the session uses ("Red cross: remove this", "Hatched area: remove everything in it", …).
- **Tradeoff:** A few lines on every export. Where the key lives is the choice: in the PDF only (it serves the person reading it), or once at the top of session.md, so the PDF, the ZIP and any agent pointed at the file all get it.
- **Decision needed:** Should the key to the marks live in session.md itself, so every export carries it, or only in the PDF?
- **Verified:** seen on screen (the exported PDF rendered).
- **Owner's words:** "Also I wonder what the best way of making this portable is: being able to share this as a PDF or zip it, maybe both." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: menu, Export Session, PDF and ZIP; build main v0.9.0
- Broken: Nielsen 2 (a person is not the agent), Nielsen 6; Maze: limitation in the journey (sharing with a person)
- Code: `src/exporter.ts:19-45` (HTML from session.md only); `src/main.ts:409-418` (the key lives only in the prompt)
- Screenshots: 6-export-pages.png, 7-export-pdf-marked.png, 7-export-pdf-marked-annotated.png, 7-export-pdf-page1.png
- Earlier IDs: none
- Other products: Xnapper and CleanShot X export pictures only; a Figma comment export keeps the comment text next to each pin
- Seen by: 6-57 (a legend in the PDF built from the prompt's list, only the marks used), 7-14 (the key at the top of session.md, so the ZIP and the agent get it too) (seen by 2 evaluators). Related: F001 (the same key as one option for the hand-off), F191, F203.
- Guideline: none accepted yet (rule area: output for AI)

</details>

### F194 · The comment reaches session.md as an unlabelled paragraph, and the prompt never says what it is

- **Impact:** Medium · The agent and a teammate reading the PDF see a loose sentence under the image and cannot tell whether it is the reviewer's instruction, a caption or part of a note.
- **Current experience:** The editor's first field is "Add a comment…". In session.md its text appears after the image with no label ("Orders page, overnight build 214"), then the numbered notes, then "- Card: …". The copied prompt explains the numbered list and every mark, but not this paragraph, and uses the word "comment" only for a card's text.
- **Visual:**

  | Where                | Before                             | After (proposals)                                                                     |
  | -------------------- | ---------------------------------- | ------------------------------------------------------------------------------------- |
  | session.md entry     | "Orders page, overnight build 214" | "Comment: Orders page, overnight build 214"                                           |
  | or the entry heading | "## 001 · 22:13"                   | "## 001 · Orders page, overnight build 214"                                           |
  | or the copied prompt | (no line)                          | "A paragraph right under an image is the reviewer's comment on the whole screenshot." |

  On screen: `shots/1-session-doc-annotated.png`.

- **Recommendation:** Label the comment in session.md, and name it in the key to the marks, so the file says what it is without the prompt.
- **Tradeoff:** A few more tokens per entry. Making it the heading gives long headings for long comments; a prompt line alone leaves the file unlabelled for anyone without the prompt.
- **Decision needed:** Should the comment be labelled in session.md, become the entry's heading, or be explained only in the prompt?
- **Verified:** seen on screen; session.md printed by the harness.
- **Owner's words:** "It's basically for providing feedback to AI in a nice and token-efficient way." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor comment field → session.md → session window, PDF; copied prompt; build main v0.9.0
- Broken: Nielsen 2; output for AI (precision); one vocabulary ("comment" also used for card text in the prompt)
- Code: `src/sessions.ts:61` (caption written as a bare paragraph); `src/main.ts:409-418`; `src/tools.ts:51` (card described as "a comment")
- Screenshots: 1-session-doc.png, 1-session-doc-annotated.png
- Earlier IDs: glossary proposal row "comment" ("labelled Comment: in session.md or used as the heading"), not done
- Other products: none noted
- Seen by: 1-31 (label it, or make it the heading; Medium), 4-09 (a prompt line; rated Low). Related: F091 (the field's label in the editor), F199 (headings), F226 ("comment" for card text).
- Guideline: none accepted yet (rule area: output for AI)

</details>

### F195 · Notes reach session.md with backslashes in class names, sizes and brackets

- **Impact:** Medium · The agent reads "btn\_primary\_lg" and "2\*4" instead of what the reviewer typed, and may search the code for the wrong string; every added backslash also costs tokens.
- **Current experience:** A note typed with real key events and saved arrives with backslashes before underscores, asterisks and brackets. Markdown pasted into a note is escaped the same way.
- **Visual:**

  | Where              | Typed                                                              | Written to session.md                                                    |
  | ------------------ | ------------------------------------------------------------------ | ------------------------------------------------------------------------ |
  | Reference note     | `Use btn_primary_lg here, not btn_ghost; 2*4 grid <Button> [Save]` | `Use btn\_primary\_lg here, not btn\_ghost; 2\*4 grid \<Button> \[Save]` |
  | Pasted into a note | `Rename to **Create order**`                                       | `Rename to \*\*Create order\*\*`                                         |

- **Recommendation:** Write the note as typed: escape only what would change the Markdown's meaning, and keep words with an underscore inside as they are. Formatting typed as Markdown keeps working.
- **Tradeoff:** A literal asterisk at the start of a line could turn into a list item when the file is rendered.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code; confirmed by a script run on the build (no screenshot).
- **Owner's words:** "It's basically for providing feedback to AI in a nice and token-efficient way." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor notes and comment → session.md; also the session window's Document tab (same editor); build main v0.9.0
- Broken: output for AI (precise and cheap); Laws of UX: Postel's law; Nielsen 2
- Code: `src/md-notes.ts:21-24, 69` (Milkdown's serialiser output; only `<br />` cleaned)
- Screenshots: none (typed with real key events, file read back)
- Earlier IDs: none
- Other products: none noted
- Seen by: 6-36. Related: F137 (one keystroke in the Document tab rewrites every entry the same way).
- Guideline: none accepted yet (rule area: output for AI)

</details>

### F196 · Two cards on one screenshot cannot be told apart in session.md

- **Impact:** Medium · When a screenshot carries more than one card, the agent gets a list of card texts with no number and no target, so it has to guess which text belongs to which yellow card and what each card's line points at.
- **Current experience:** Two cards, "Card A" and "Card B", each with a line to a different spot, are saved as "- Card: Card A" and "- Card: Card B". The references on the same image are numbered; the cards are not numbered on the image or in the text, and the spot each line points at is not written down.
- **Visual:** `shots/3-cards-annotated.png`.
- **Recommendation:** Label cards like references (a small letter on the card, "Card A:" in the text), or merge cards into the reference list, so every piece of text on the image has one label in both places.
- **Tradeoff:** A label on the card adds a little clutter to the image the reviewer is shaping.
- **Decision needed:** Should cards carry a visible label that session.md repeats (for example "Card A")?
- **Verified:** seen on screen; session.md printed after saving.
- **Owner's words:** "Help me think about how we can highlight stuff and potentially add UI elements, like being able to add a card and write on the card, so I can actually edit on the screen and drag and drop, size, and so on." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor canvas; session.md; build main v0.9.0
- Broken: output-for-AI check (every note maps to one mark); Laws of UX: law of uniform connectedness
- Code: `src/sessions.ts:70` (`- Card: …`, no index, no target); `src/editor.ts:173-222` (a card has no label)
- Screenshots: 3-many-refs-1180.png, 3-cards-annotated.png
- Earlier IDs: 2026-09-25 audit F149, F151 (still true)
- Other products: none noted
- Seen by: 3-11. Related: F076 (cards missing from the side panel), F123 (Reference versus Card).
- Guideline: none accepted yet (rule area: output for AI)

</details>

### F197 · Export starts without showing progress

- **Impact:** Medium · After choosing PDF or ZIP, nothing shows that the export has started until Finder appears, so a reviewer may export twice or wonder whether it worked.
- **Current experience:** "PDF" or "ZIP" starts the work with no busy state. Finder appears after success. Nothing stops a second export of the same session while the first is running.
- **Visual:** Proposal: "Exporting PDF…" next to the session, then "Show exported PDF".
- **Recommendation:** Show the export's state where it was started and ignore a second export of the same session while one is running.
- **Tradeoff:** The state has to be shared with the menu. Measured today, 12 screenshots export to PDF in 0.3 seconds and to ZIP in 0.02 seconds, so a progress display would rarely be seen at current sizes; the guard against a double export costs little either way.
- **Decision needed:** Should export show its state and block a second export while one runs, given that it takes well under a second today?
- **Verified:** read in the code.
- **Owner's words:** "Also I wonder what the best way of making this portable is: being able to share this as a PDF or zip it, maybe both." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: menu, Export Session, PDF and ZIP; build main v0.9.0
- Broken: Nielsen 1 visibility of system status; Shneiderman: closure; Laws of UX: Doherty threshold, goal-gradient effect
- Code: `src/main.ts:420-425, 560`; `src/exporter.ts:12-16, 31-44`
- Screenshots: none
- Earlier IDs: none
- Other products: none noted
- Seen by: 8-25 (export not run). Counter-evidence from 2-36, which timed the export (0.3 s PDF, 0.02 s ZIP for 12 screenshots) and found progress not needed at today's sizes. Related: F198.
- Guideline: none accepted yet (rule area: feedback and status)

</details>

### F198 · A new export silently replaces the last one

- **Impact:** Low · A reviewer who exported a PDF for a stakeholder, added screenshots and exported again has overwritten the version already sent, with no hint.
- **Current experience:** Export writes "<session name>.pdf" or ".zip" into the session folder, deleting any file of that name first, then shows it in Finder.
- **Visual:** No screenshot: the finding is about the file system.
- **Recommendation:** Add the date and time of the export to the file name ("Checkout review 2026-09-28 14.03.pdf").
- **Tradeoff:** Old exports pile up in the session folder; asking where to save the first time is the other way out, at the cost of a dialog.
- **Decision needed:** Should every export be a new file?
- **Verified:** read in the code.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: menu, Export Session, PDF and ZIP; build main v0.9.0
- Broken: Nielsen 5 error prevention, Nielsen 1; rule area confirmation and undo
- Code: `src/exporter.ts:12-17` (`fs.rmSync(out)`), `:31-34`
- Screenshots: none
- Earlier IDs: none
- Other products: none noted
- Seen by: 6-60 (date and time in the name; rated routine), 7-18 (the time in the name, or ask where to save the first time) (seen by 2 evaluators). Related: F197.
- Guideline: none accepted yet (rule area: confirmation and undo)

</details>

### F199 · Entries are titled only by number and time

- **Impact:** Low · In the PDF and in session.md every entry is "001 · 22:30", so a person scanning the PDF, or an agent reporting back ("done with 003"), has no words for which screen an entry is about.
- **Current experience:** The heading is the entry number and the time; the comment, when there is one, sits under the image.
- **Visual:**

  | Where                      | Before        | After (proposal)                        |
  | -------------------------- | ------------- | --------------------------------------- |
  | session.md and PDF heading | "001 · 22:30" | "001 · 22:30 · Checkout page on mobile" |

  On screen: `shots/6-export-pages.png`.

- **Recommendation:** When the comment has a first line, add it to the heading.
- **Tradeoff:** A long first line makes a long heading, and the heading has to stay findable by the app, which uses it to find each screenshot.
- **Decision needed:** Should an entry's heading carry the first line of its comment?
- **Verified:** seen on screen.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: session.md entry headings; session window; PDF; build main v0.9.0
- Broken: checklist content (descriptive headings); Laws of UX: chunking
- Code: `src/sessions.ts:60`
- Screenshots: 6-export-pages.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 6-58 (rated routine; it changes the file's format, so it is asked here). Related: F129 (a changed heading cuts the screenshot off), F194 (the comment as the heading), F200.
- Guideline: none accepted yet (rule area: output for AI)

</details>

### F200 · Entry headings give the time but not the day

- **Impact:** Low · A session that runs over two days, or a PDF read a week later, cannot say when a screenshot was taken.
- **Current experience:** session.md, the session window and the PDF show "## 001 · 22:13". The session's name carries the day only while it is the default date and time; a renamed session ("Checkout review") loses it.
- **Visual:**

  | Where         | Before        | After (proposal)     |
  | ------------- | ------------- | -------------------- |
  | Entry heading | "001 · 22:13" | "001 · 28 Sep 22:13" |

  On screen: `shots/7-export-pdf-marked-annotated.png`.

- **Recommendation:** Write the date in the heading when it differs from the previous entry's, or always.
- **Tradeoff:** A few more characters per entry for the agent.
- **Decision needed:** Should entry headings carry the date?
- **Verified:** seen on screen.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: session.md, session window, PDF; build main v0.9.0
- Broken: Nielsen 1; checklist content (descriptive headings)
- Code: `src/sessions.ts:45, 60`
- Screenshots: 7-export-pdf-marked.png, 7-export-pdf-marked-annotated.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 7-16. Related: F199, F201.
- Guideline: none accepted yet (rule area: output for AI)

</details>

### F201 · session.md writes times two ways

- **Impact:** Low · The title says "14.32" with a dot, every screenshot heading "22:15" with a colon, so the agent and the reader see two formats in one file.
- **Current experience:** "# 2026-09-28 14.32", then "## 001 · 22:15". The same two forms appear in the menu and the notifications: "09.14" in session names, "22:13" in entry headings.
- **Visual:** `shots/4-viewer-doc.png`.
- **Recommendation:** Use the colon wherever a person or the agent reads a time (headings and display names); keep the dot only in folder names, where a colon cannot go.
- **Tradeoff:** A session's display name and its folder name then differ by one character.
- **Decision needed:** Should display names use "14:32" and keep "14.32" only for folder names?
- **Verified:** seen on screen.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: session.md title and headings; session names in the menu, editor and session window; build main v0.9.0
- Broken: Nielsen 4; writing (one format)
- Code: `src/sessions.ts:14-15, 45, 60`
- Screenshots: 4-viewer-doc.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 4-58, 1-16 [part: the two time forms]. Related: F222 (the two name forms, the other part of 1-16), F200.
- Guideline: none accepted yet (rule area: writing and vocabulary)

</details>

### F202 · A move is written as a count, not as what moved where

- **Impact:** Low · With two cut-and-move pieces on one screenshot, the text says only "Moved 2 elements", so the agent must read both from the picture and cannot check its reading against the text.
- **Current experience:** The entry reads "- Moved 2 elements: the dashed outline is where it is now, the arrow shows where it should go." Which elements moved, and from where to where, is only in the image.
- **Visual:** `shots/3-review-1180-light.png` ("Export CSV" moved left).
- **Recommendation:** Number each moved piece like a reference (a number at the arrow's head) so the reviewer can add a note to it, and write "Move 1:" with that note.
- **Tradeoff:** Another numbered thing on the image next to references and cards; worth it only if moves are common.
- **Decision needed:** Should moved pieces get a number and an optional note, like references?
- **Verified:** read in the code; confirmed by a script run on the build (no screenshot).
- **Owner's words:** "Another thing that would be nice is if I can cut out things and move them and then wherever I move the cut-out, it indicates this with an arrow or something" — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: session.md entries with Cut & move; build main v0.9.0
- Broken: output-for-AI check
- Code: `src/sessions.ts:71-74`; `src/editor.ts:770` (`moves` is a count)
- Screenshots: 3-review-1180-light.png (the move on screen; the text from the round-trip test)
- Earlier IDs: 2026-09-25 audit F152 (still true)
- Other products: none noted
- Seen by: 3-12. Related: F102 (moves missing from the side panel), F203.
- Guideline: none accepted yet (rule area: output for AI)

</details>

### F203 · The same move explanation is written into every entry with a move

- **Impact:** Low · Every entry with a move repeats "the dashed outline is where it is now, the arrow shows where it should go.", about 22 tokens each time, although the copied prompt already explains Cut & move.
- **Current experience:** In a ten-screenshot session with a move on every other entry, the sentence is sent five times.
- **Visual:**

  | Where                             | Before                                                                                           | After (proposal)                                                                                     |
  | --------------------------------- | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
  | session.md entry                  | "- Moved an element: the dashed outline is where it is now, the arrow shows where it should go." | "- Moved: 1"                                                                                         |
  | session.md, once, under the title | (nothing)                                                                                        | "Key: dashed outline = where it is now; arrow = where it should go; red cross or hatching = remove." |

- **Recommendation:** Explain the marks once, at the top of session.md, and keep entries to facts. The agent then gets the key even when it was pointed at the file with only a path and no prompt.
- **Tradeoff:** A reader looking at one entry on its own (a page of the PDF) loses the explanation next to it.
- **Decision needed:** Should the explanation of the marks move to one key at the top of session.md?
- **Verified:** read in the code; confirmed by a script run on the build (no screenshot).
- **Owner's words:** "It's basically for providing feedback to AI in a nice and token-efficient way." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: session.md; build main v0.9.0
- Broken: output-for-AI check (cost); Occam's razor
- Code: `src/sessions.ts:71-74`; the prompt's own explanation at `src/main.ts:409-418`
- Screenshots: none
- Earlier IDs: 2026-09-25 audit F154, F167 (partly still true)
- Other products: none noted
- Seen by: 3-13. Related: F001 (the key once at the top is one option for the hand-off), F193 (the key in exports), F202.
- Guideline: none accepted yet (rule area: output for AI)

</details>

### F204 · The prompt calls a screenshot an "entry"

- **Impact:** Low · The agent learns the app's words from the prompt, and "entry" appears nowhere a reviewer reads, so reviewer and agent talk about the same thing in two words ("look at screenshot 3" and "entry 3").
- **Current experience:** Second line of the copied prompt: "Each entry is an annotated screenshot."
- **Visual:**

  | Where         | Before                                                                                                                                  | After                                                                                                                                                      |
  | ------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | Copied prompt | "Each entry is an annotated screenshot. The numbered list below it holds the notes for the references (numbered circles) on the image." | "Each numbered section (## 001) is one annotated screenshot. The numbered list below the image holds the notes for its references (the numbered circles)." |

- **Recommendation:** Use "screenshot" and point at the heading the agent will see.
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code.
- **Owner's words:** "It's basically for providing feedback to AI in a nice and token-efficient way." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: copied prompt; build main v0.9.0
- Broken: writing (one vocabulary)
- Code: `src/main.ts:412`
- Screenshots: none
- Earlier IDs: none
- Other products: none noted
- Seen by: 4-08
- Guideline: none accepted yet (rule area: writing and vocabulary)

</details>

### F205 · The path is copied without quotes, though every dated session name has a space

- **Impact:** Low · Pasted into Terminal or a shell command, the copied session.md path splits in two at the space; the prompt puts the same path in quotes, the path item does not.
- **Current experience:** "Copy session.md Path" puts the bare path on the clipboard. Session names default to a date and time with a space ("2026-09-28 14.32").
- **Visual:**

  | Where     | Before                                        | After                                           |
  | --------- | --------------------------------------------- | ----------------------------------------------- |
  | Clipboard | /Users/…/Snapmark/2026-09-28 14.32/session.md | "/Users/…/Snapmark/2026-09-28 14.32/session.md" |

- **Recommendation:** Copy the path in double quotes, as the prompt already does.
- **Tradeoff:** A few fields paste the quotes literally (a Finder search box, some file dialogs).
- **Decision needed:** Should the copied path be in quotes, like the one inside the prompt?
- **Verified:** read in the code.
- **Owner's words:** "One thing, actually, from the menu item: I want to be able to copy and paste the path to the Markdown from the current session. I just paste it and then I can point the AI to it." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: clipboard after "Copy session.md Path"; build main v0.9.0
- Broken: Nielsen 4 (the prompt quotes the path, the path item does not)
- Code: `src/main.ts:549`; `src/sessions.ts:14-15` (default name with a space)
- Screenshots: none (path printed by a probe, not copied)
- Earlier IDs: none
- Other products: none noted
- Seen by: 4-07. Related: F001 (the two copy items).
- Guideline: none accepted yet (rule area: output for AI)

</details>

### F206 · The exported PDF declares no language

- **Impact:** Low · A screen reader opening the PDF guesses its language, so English notes may be read with the wrong pronunciation.
- **Current experience:** The page the PDF is printed from sets no document language.
- **Visual:** No screenshot: the language is not visible.
- **Recommendation:** Declare English in the PDF's page, in the same change as the app's own pages.
- **Tradeoff:** A future translation has to update the declaration.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: Export Session, PDF; build main v0.9.0
- Broken: WCAG 2.2 3.1.1 Language of Page (A)
- Code: `src/exporter.ts:21`
- Screenshots: none
- Earlier IDs: none
- Other products: none noted
- Seen by: 8-31 [part: the exported PDF]. Related: F121 (the app's pages, the other part of 8-31).
- Guideline: none accepted yet (rule area: accessibility basics)

</details>

### F207 · Almost every Retina screenshot costs the agent about 1,530 tokens, and the reviewer cannot choose less

- **Impact:** Design choice · In a ten-screenshot review the images are about 92% of what the agent reads, and any Retina capture larger than about 380 × 380 points is sent at the model's full size, whether its detail is needed or not.
- **Current experience:** Six of ten typical captures (a full viewport, a table, a form, a modal, two Capture Same Area shots) land at 1,440 to 1,533 tokens each. The reviewer sees nothing about size or cost anywhere.
- **Visual:**

  | Ten typical Retina captures | Today        | At 1,000 pixels on the long edge | At 1× pixels |
  | --------------------------- | ------------ | -------------------------------- | ------------ |
  | Image tokens, all ten       | about 11,300 | about 6,450                      | about 6,300  |

- **Recommendation:** Lower the default long edge to about 1,000 pixels, and keep today's size as a setting for screenshots with small text.
- **Tradeoff:** Small interface text on a full-viewport capture gets harder for the model to read at 1,000 pixels, and the reviewer would have to know when to switch.
- **Decision needed:** Should saved screenshots default to a smaller size (about 1,000 pixels on the long edge), with the current size as a setting?
- **Verified:** read in the code; token counts computed with the app's own resize rule, not measured against a model.
- **Owner's words:** "It's basically for providing feedback to AI in a nice and token-efficient way." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: every save; session.md images; PDF and ZIP; build main v0.9.0
- Broken: output-for-AI check (image size, cost); Pareto principle
- Code: `src/main.ts:233-244` (`MAX_EDGE = 1568`, `MAX_PIXELS = 1_150_000`)
- Token estimate: width × height ÷ 750 after the app's resize. Ten captures: 11,298 tokens today, 6,450 at a 1,000-pixel long edge, 6,298 at 1× pixels. Text of ten entries about 760 tokens, the copied prompt about 250; whole session about 12,300 tokens, images about 92%. The mock page (1200 × 672 points, Retina) was saved as 1433 × 802 pixels, matching the rule.
- Screenshots: none
- Earlier IDs: 2026-09-25 audit F156 (still true)
- Other products: CleanShot X has a setting to save Retina captures at 1× (from memory, not re-checked)
- Seen by: 3-15
- Guideline: none accepted yet (rule area: output for AI)

</details>

### F208 · Screenshots in the document are described only as "Screenshot 1"

- **Impact:** Design choice · A screen reader user reading session.md (in the session window, a Markdown app or the PDF) hears "Screenshot 1, image" and must read on for the comment.
- **Current experience:** Every entry's image has the text alternative "Screenshot N"; the comment follows directly below it.
- **Visual:** `shots/5-viewer-doc-focused.png`.
- **Recommendation:** Leave it, or put the comment's first sentence in the image's text alternative. Since the comment is right below, the gain is small, and it doubles those words for an agent reading session.md.
- **Tradeoff:** A longer session.md and more tokens for the agent.
- **Decision needed:** Should the image text in session.md carry the comment's first sentence, or stay "Screenshot N"?
- **Verified:** seen on screen (accessibility tree).
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: session.md; session window Document tab; PDF export; build main v0.9.0
- Broken: WCAG 2.2 1.1.1 Non-text Content (A) is met in the weak sense (a name exists); this is about usefulness
- Code: `src/sessions.ts` entry() (image written as "Screenshot N" with its file under img/)
- Screenshots: 5-viewer-doc-focused.png (tree: image "Screenshot 1")
- Earlier IDs: none
- Other products: none noted
- Seen by: 5-34. Related: F194 (the comment's label).
- Guideline: none accepted yet (rule area: accessibility basics)

</details>

## First run, permissions and updates

### F209 · The first launch shows nothing but a new menu bar icon

- **Impact:** High · A new reviewer who opens Snapmark for the first time sees no window, no message and no Dock icon, only a small icon in the menu bar that may be hidden behind the notch, and has to guess where the app went and how to capture.
- **Current experience:** Launching hides the Dock icon, adds the corner-and-dot icon with the tooltip "Snapmark" and waits. The keys appear only in the menu and the README. The menu says "No Session Yet" above disabled items, and nothing explains that the first capture creates a session or what to do if screen access is missing.
- **Visual:** No screenshot: a first launch cannot be scripted in the audit's setup. Proposal (a one-time notification or small welcome window): "Snapmark is in your menu bar. Press ⌃⇧1 to capture a region; ⌃⇧3 captures the same area each time."
- **Recommendation:** Show something once on first launch that points at the menu bar icon, gives the capture key and says that the first capture starts a session.
- **Tradeoff:** A one-time interruption; it must never repeat. Alternatives from the evaluators: (a) a notification; (b) a small welcome window; (c) a first-run panel with the shortest loop and a capture button; (d) open the menu once by itself.
- **Decision needed:** What should the first launch show: a notification, a small welcome window, or a first-run panel with a capture button?
- **Verified:** read in the code.
- **Owner's words:** "I also wonder: where do I access the session? Is this in the toolbar of my Mac? Is this where I am supposed to see it or where would I see that?" — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: first launch of the app; build main v0.9.0
- Broken: checklist navigation 1; Nielsen 1, 10; Laws of UX: paradox of the active user, Jakob's law
- Code: `src/main.ts:571-593` (ready handler: Dock hidden, tray created, nothing shown)
- Screenshots: none
- Earlier IDs: none
- Other products: CleanShot X and Shottr open a short welcome with the shortcuts and a permission step; Xnapper opens its own window.
- Seen by: 2-40 (notification or small welcome window; open the menu once), 6-20 (Medium; small welcome window), 7-50 (Medium; notification or small welcome window), 8-10 (first-run panel with the shortest loop and a capture button) (seen by 3 evaluators). Related: F007, F210, F217.
- Guideline: none accepted yet (rule area: first run and onboarding)

</details>

### F210 · Without Screen Recording permission every capture is the wallpaper, and Snapmark never says why

- **Impact:** High · A reviewer who has not granted Screen Recording (or whose grant macOS dropped after an update) captures the wallpaper and menu bar instead of the app they meant, annotates it, and gets no explanation or way to fix it.
- **Current experience:** Snapmark never checks the permission. Without it, captures contain only the wallpaper and the menu bar, and the editor opens on that image as if it were fine. Only the README says: "Grant it, then quit Snapmark from the menu bar and start it again. Without it, captures show only the wallpaper."
- **Visual:** No screenshot: the permission cannot be removed on the owner's machine. Proposal (a window before the first capture without access): "Snapmark needs Screen Recording to see other apps. [Open System Settings] Then restart Snapmark. [Restart Snapmark]"
- **Recommendation:** Check the permission at launch and before each capture; when it is missing, show a window that says what is wrong, opens the right settings pane and offers the restart.
- **Tradeoff:** Needs a check that is reliable on every macOS version the app supports; a false "missing" would nag reviewers who have granted it.
- **Decision needed:** Should Snapmark check Screen Recording itself and stop with a fix-it window, instead of opening the editor on a wallpaper-only capture?
- **Verified:** read in the code.
- **Owner's words:** "I'm continuously getting asked to open my screen and system audio recording stuff to add Snapmark; however Snapmark already is activated so I think that's most likely a bug" — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: any capture without Screen Recording permission; build main v0.9.0
- Broken: Nielsen 9, 1, 10; peak-end rule; checklist navigation 1
- Code: `src/main.ts:118-127` (capture path); no screen-permission status check anywhere in `src/`
- Screenshots: none
- Earlier IDs: none
- Other products: CleanShot X and Shottr show a permission window with a button to the settings pane.
- Seen by: 2-41 (marked routine by the source; notes the ad-hoc signature per update may explain the repeated prompts, an assumption), 6-19, 7-08 (marked routine by the source) (seen by 2 evaluators). Related: F028, F209.
- Guideline: none accepted yet (rule area: permissions and errors)

</details>

### F211 · The README still teaches ⌘⇧1 and ⌘⇧2 and leaves out ⌃⇧3

- **Impact:** Medium · A reviewer who follows the README presses ⌘⇧1, which the app no longer uses (in Chrome it switches tabs), and never learns about Capture Same Area.
- **Current experience:** Step 1 says "1. Press ⌘⇧1, drag over the part of the screen you mean." The key table lists "⌘⇧1 · Capture a region into the current session" and "⌘⇧2 · Start a new session", and has no row for ⌃⇧3. A later section about the menu already names the right keys.
- **Visual:** No screenshot: a document. Wording:

  | Where            | Before                                                                         | After                                                                                                            |
  | ---------------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
  | README step 1    | "Press ⌘⇧1, drag over the part of the screen you mean."                        | "Press ⌃⇧1, drag over the part of the screen you mean."                                                          |
  | README key table | "⌘⇧1 · Capture a region into the current session", "⌘⇧2 · Start a new session" | "⌃⇧1 · Capture Screenshot", "⌃⇧3 · Capture Same Area", "⌃⇧2 · New Session" (or the keys decided for New Session) |

- **Recommendation:** Correct the keys in the steps and the table, and add Capture Same Area.
- **Tradeoff:** A hand fix can drift again; generating the table from the app's own shortcut list keeps it right but is more work.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code.
- **Owner's words:** "a proper README about what it does and what it's for" — 2026-09-25; "The shortcut Command-1 on Chrome changes the tab. How about we do something different?" — 2026-09-28

<details><summary>Supporting notes</summary>

- Where: README, the steps and the key table; build main v0.9.0
- Broken: Maze: outdated content; Nielsen 10; checklist content 4
- Code: `README.md:15, 49, 53-56`; the real keys in `src/main.ts:31-33`
- Screenshots: none
- Earlier IDs: none
- Other products: none noted
- Seen by: 1-33 [keys] (Low), 4-60, 6-21 (Low), 7-41 [keys] (Low), 8-27 (generate the table from the shortcut definitions) (seen by 3 evaluators). Related: F020, F218.
- Guideline: none accepted yet (rule area: help and documentation)

</details>

### F212 · "Restart to Update" closes unfinished screenshots without the quit question

- **Impact:** Medium · A reviewer with an unfinished screenshot who chooses "Restart to Update" loses it to Discarded without being asked, while Quit would have asked first.
- **Current experience:** Quit asks "1 screenshot is not in a session yet." with "Review" and "Quit anyway". "Restart to Update" hands over to the updater, which closes every window first, so each unfinished screenshot goes to Discarded and the question never comes. After the restart, only "Reopen Last Discarded" brings back the most recent one.
- **Visual:** No screenshot: an update cannot be installed during the audit.
- **Recommendation:** Ask the same question before restarting, with "Restart anyway" in place of "Quit anyway".
- **Tradeoff:** One more dialog on the update path, only when something is unfinished.
- **Decision needed:** Should Restart to Update ask first, as Quit does, when a screenshot is unfinished?
- **Verified:** read in the code and in the updater's documentation; not run.
- **Owner's words:** "check once a day." — 2026-09-26

<details><summary>Supporting notes</summary>

- Where: menu → Restart to Update to 0.9.1 with an unsaved editor open; build main v0.9.0
- Broken: Nielsen 3, 5
- Code: `src/main.ts:567` (install calls `autoUpdater.quitAndInstall()`); the quit guard in `before-quit` at `src/main.ts:598-620` is bypassed because electron-updater 6.8.9's `MacUpdater.quitAndInstall` closes all windows first, and each editor's closed handler (`src/main.ts:205`) discards; installing on an ordinary Quit is safe
- Screenshots: none
- Earlier IDs: none
- Other products: none noted
- Seen by: 2-10. Related: F180.
- Guideline: none accepted yet (rule area: saving and unsaved work)

</details>

### F213 · "Check for Updates…" answers failures in developer words

- **Impact:** Low · A reviewer who checks for updates offline, or on a build without an update source, reads a code-like error and learns nothing about what to do.
- **Current experience:** The notification says "Couldn't check for updates: this build has no update feed." or "Couldn't check for updates: " followed by the raw error, such as "net::ERR_INTERNET_DISCONNECTED" or an HTTP 404 from a private repository.
- **Visual:** No screenshot: notifications cannot be pictured. Wording:

  | Where             | Before                                                       | After                                                                                                         |
  | ----------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
  | No update source  | "Couldn't check for updates: this build has no update feed." | "This copy of Snapmark can't update itself. Download new versions from the Releases page on GitHub."          |
  | Offline           | "Couldn't check for updates: net::ERR_INTERNET_DISCONNECTED" | "Couldn't check for updates: no internet connection. Snapmark tries again tomorrow."                          |
  | Any other failure | "Couldn't check for updates: " + raw error                   | "Couldn't check for updates. Snapmark will try again tomorrow. Download new versions from the Releases page." |

- **Recommendation:** Map the known failures to plain sentences with a next step, and never show the raw error.
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code.
- **Owner's words:** "check once a day." — 2026-09-26; "an auto-update" — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: menu → Check for Updates… when the check fails; build main v0.9.0
- Broken: Nielsen 9; writing: no system words
- Code: `src/main.ts:392-400` (`:395` no feed, `:397-399` raw message)
- Screenshots: none
- Earlier IDs: 2026-09-25 audit F143 (from 4-32)
- Other products: none noted
- Seen by: 4-31 (no update source), 4-32 [update check] (offline), 6-55, 7-47 (seen by 2 evaluators). Related: F171.
- Guideline: none accepted yet (rule area: permissions and errors)

</details>

### F214 · The automatic update notification speaks the updater's words and says "on exit"

- **Impact:** Low · A reviewer told an update "will be automatically installed on exit" does not learn that it can be installed now, or that the menu names the same action differently.
- **Current experience:** Title "A new update is ready to install", body "Snapmark version 0.9.1 has been downloaded and will be automatically installed on exit". The menu meanwhile shows "Restart to Update to 0.9.1".
- **Visual:** No screenshot: notifications cannot be pictured. Wording:

  | Where | Before                                                                                   | After                                                                 |
  | ----- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
  | Title | "A new update is ready to install"                                                       | "Snapmark 0.9.1 is ready"                                             |
  | Body  | "Snapmark version 0.9.1 has been downloaded and will be automatically installed on exit" | "It installs when you quit, or choose Restart to Update in the menu." |

- **Recommendation:** Replace the updater's default text with Snapmark's own, in the menu's words.
- **Tradeoff:** None. Another wording from the evaluators: "…To install now, choose Restart to Install 0.9.1 in the menu bar."
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code.
- **Owner's words:** "check once a day." — 2026-09-26

<details><summary>Supporting notes</summary>

- Where: notification after the daily automatic check downloads an update; build main v0.9.0
- Broken: Nielsen 4; writing: one tone and one vocabulary
- Code: `src/main.ts:387-389` (`checkForUpdatesAndNotify()` without its own text), `src/main.ts:401`; the default text comes from `AppUpdater.formatDownloadNotification` in electron-updater
- Screenshots: none
- Earlier IDs: none
- Other products: none noted
- Seen by: 2-39, 4-30 ("…choose Restart to Install 0.9.1 in the menu bar."). Related: F215, F216.
- Guideline: none accepted yet (rule area: feedback and notifications)

</details>

### F215 · "Check for Updates…" says "Downloading…" and never says the download finished

- **Impact:** Low · A reviewer who checked for updates by hand sees "Downloading" and then nothing, and must find the new top line in the menu to learn the update is ready.
- **Current experience:** A manual check shows "Downloading Snapmark 0.9.1…". When the download ends, the only sign is a new first menu line, "Restart to Update to 0.9.1"; the automatic check, by contrast, does notify.
- **Visual:** No screenshot: an update cannot be downloaded during the audit. Wording:

  | Where                                | Before    | After                                                            |
  | ------------------------------------ | --------- | ---------------------------------------------------------------- |
  | After a manual check's download ends | (nothing) | "Snapmark 0.9.1 is ready. Restart Snapmark to update. [Restart]" |

- **Recommendation:** Notify when the download finishes, as the automatic check does.
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code.
- **Owner's words:** "check once a day." — 2026-09-26

<details><summary>Supporting notes</summary>

- Where: menu → Check for Updates… when an update is found; build main v0.9.0
- Broken: Nielsen 1
- Code: `src/main.ts:392-401` (manual path calls `checkForUpdates()`, which does not notify, unlike `checkForUpdatesAndNotify()`; electron-updater `AppUpdater.js:286-300`)
- Screenshots: none
- Earlier IDs: none
- Other products: none noted
- Seen by: 2-38. Related: F214.
- Guideline: none accepted yet (rule area: progress and long operations)

</details>

### F216 · "Restart to Update to 0.9.1" reads "to … to"

- **Impact:** Low · The update item in the menu reads awkwardly and takes a second look to parse.
- **Current experience:** After an update downloads, the menu's first line is "Restart to Update to 0.9.1".
- **Visual:** No screenshot: the item appears only after an update has downloaded. Wording:

  | Where            | Before                       | After                      |
  | ---------------- | ---------------------------- | -------------------------- |
  | Menu, first line | "Restart to Update to 0.9.1" | "Restart to Install 0.9.1" |

- **Recommendation:** Rename the item.
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code.
- **Owner's words:** "check once a day." — 2026-09-26

<details><summary>Supporting notes</summary>

- Where: menu bar menu, first line after an update has downloaded; build main v0.9.0
- Broken: checklist content 4 (grammar)
- Code: `src/menu.ts:74`
- Screenshots: none
- Earlier IDs: none
- Other products: none noted
- Seen by: 4-29. Related: F214, F215.
- Guideline: none accepted yet (rule area: dialogs, menus and popovers)

</details>

### F217 · Opening Snapmark again from Applications or Spotlight does nothing visible

- **Impact:** Low · A reviewer who has lost the menu bar icon (behind the notch or a menu bar manager) launches Snapmark again and sees nothing happen, so it looks broken or not running.
- **Current experience:** Opening the app again while it runs shows no window, no menu and no message.
- **Visual:** No screenshot: nothing appears.
- **Recommendation:** When Snapmark is opened again, open its menu (or the current session's window) so the reviewer can see it is there.
- **Tradeoff:** None worth naming; it only runs when the reviewer opens the app on purpose.
- **Decision needed:** Should reopening Snapmark show its menu (or the current session's window)?
- **Verified:** read in the code.
- **Owner's words:** "I also wonder: where do I access the session? Is this in the toolbar of my Mac? Is this where I am supposed to see it or where would I see that?" — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: launching Snapmark from Applications or Spotlight while it runs; build main v0.9.0
- Broken: platform conventions; Nielsen 1
- Code: `src/main.ts:571-595` (no `activate` handler, no `second-instance` handler, no single-instance lock)
- Screenshots: none
- Earlier IDs: none
- Other products: none noted
- Seen by: 4-65. Related: F209.
- Guideline: none accepted yet (rule area: first run and onboarding)

</details>

### F218 · The README says the Dock icon shows only while an editor is open

- **Impact:** Low · A reviewer reading the README expects no Dock icon while a session window is open, and is confused when one appears.
- **Current experience:** The README says "It shows a Dock icon only while an editor is open." The app shows the Dock icon while an editor or a session window is open.
- **Visual:** No screenshot: a document. Wording:

  | Where  | Before                                               | After                                                               |
  | ------ | ---------------------------------------------------- | ------------------------------------------------------------------- |
  | README | "It shows a Dock icon only while an editor is open." | "It shows a Dock icon while an editor or a session window is open." |

- **Recommendation:** Correct the sentence.
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code.
- **Owner's words:** "Yeah one thing I noticed is that when the window is open there's no icon or anything at the bottom to show that it's open." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: README; build main v0.9.0
- Broken: Nielsen 10; checklist content 4
- Code: `README.md:49`; `src/main.ts:60` (the Dock update counts editors and session windows)
- Screenshots: none
- Earlier IDs: none
- Other products: none noted
- Seen by: 1-33 [Dock], 4-61, 7-41 [Dock]. Related: F211.
- Guideline: none accepted yet (rule area: help and documentation)

</details>

### F219 · The README says "marker" and "sticky note" where the app says Reference and Card

- **Impact:** Low · A reviewer reading the README meets names for the numbered circle and the card that the app never uses.
- **Current experience:** The README says "Note 2 refers to marker ② on the image." and "Card: a sticky note you type on", while the app's tools are named Reference and Card.
- **Visual:** No screenshot: a document. Wording:

  | Where         | Before                                    | After                                        |
  | ------------- | ----------------------------------------- | -------------------------------------------- |
  | README, notes | "Note 2 refers to marker ② on the image." | "Note 2 refers to reference ② on the image." |
  | README, tools | "Card: a sticky note you type on"         | "Card: a yellow card you type on"            |

- **Recommendation:** Use the app's tool names in the README.
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code.
- **Owner's words:** "Instead of numbered, it should be reference not numbered. This doesn't make any sense." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: README; build main v0.9.0
- Broken: writing: one vocabulary; Nielsen 4
- Code: `README.md:24`, `README.md:65`
- Screenshots: none
- Earlier IDs: none
- Other products: none noted
- Seen by: 4-62, 1-17 [README "sticky note"]. Related: F076, F226.
- Guideline: none accepted yet (rule area: help and documentation)

</details>

### F220 · The README says "point your agent at the session folder", while every copy gives session.md

- **Impact:** Low · The README's last step tells the reviewer to hand the folder to the agent, while the menu copies the path to session.md or a prompt, so the documented step and the app's shortest path differ.
- **Current experience:** Step 4 reads "4. Point your agent at the session folder: "Work through ~/Documents/Snapmark/2026-09-25 14.02/session.md"." The sentence says folder and then quotes a file.
- **Visual:** No screenshot: a document. Wording:

  | Where         | Before                                                                                                        | After                                                                                                                             |
  | ------------- | ------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
  | README step 4 | "4. Point your agent at the session folder: "Work through ~/Documents/Snapmark/2026-09-25 14.02/session.md"." | "4. Choose Copy Prompt for AI in the menu and paste it into your agent:" (the item's name follows the decision on the copy items) |

- **Recommendation:** Describe the menu's copy as the last step.
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code.
- **Owner's words:** "One thing, actually, from the menu item: I want to be able to copy and paste the path to the Markdown from the current session." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: README, step 4; build main v0.9.0
- Broken: Nielsen 10; checklist content 4
- Code: `README.md:18`
- Screenshots: none
- Earlier IDs: none
- Other products: none noted
- Seen by: 4-63. Related: F001.
- Guideline: none accepted yet (rule area: help and documentation)

</details>

### F221 · The README's Esc row says "then close"

- **Impact:** Low · A reviewer reading "then close" does not learn that the last Esc discards the screenshot, or that it can be brought back.
- **Current experience:** The README's key table reads "Esc · Step back · out of the text, then deselect, then back to Select, then close".
- **Visual:** No screenshot: a document. Wording:

  | Where           | Before                                                                              | After                                                                                                                                                                     |
  | --------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | README, Esc row | "Esc · Step back · out of the text, then deselect, then back to Select, then close" | "Esc · Step back · out of the text, then deselect, then back to Select, then discard the screenshot (Reopen Last Discarded brings it back)" (follows the decision on Esc) |

- **Recommendation:** Say what the last Esc does and how to undo it.
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the code.
- **Owner's words:** "When I'm at a card and then I'm adding cards, if I press 5 again I can't actually get out. With any other thing I'm not getting out either. I'm not sure if it works but I should be getting out of this mode by pressing Escape or something." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: README, key table, Esc row; build main v0.9.0
- Broken: Nielsen 10; writing: say what happens and whether it can be undone
- Code: README Esc row; `src/editor.ts:795-803`
- Screenshots: none
- Earlier IDs: none
- Other products: none noted
- Seen by: 4-14 [README]. Related: F051, F163.
- Guideline: none accepted yet (rule area: help and documentation)

</details>

## App-wide

### F222 · One session goes by two names

- **Impact:** Medium · A reviewer switching between the menu, the editor and the session window has to match "28 Sep 09.14" with "2026-09-28 09.14" to be sure the screenshot is going to the right session.
- **Current experience:** The menu says "Current Session: 28 Sep 09.14 · 7 screenshots", Switch Session lists "28 Sep 09.14", and the copy notification says "Prompt for 28 Sep 09.14 copied. Paste it into your AI agent." The editor says "→ 2026-09-28 09.14", the session window's title is "2026-09-28 09.14 — Snapmark", and session.md starts "# 2026-09-28 09.14". Notifications mix both: "New session: 2026-09-28 09.14" but "28 Sep 09.14 is still empty, so new captures keep going there."
- **Visual:** `shots/1-editor-inuse-annotated.png`, `shots/1-session-doc-annotated.png`, `shots/4-viewer-empty-doc-annotated.png`, `shots/6-viewer-empty-doc.png`.

  | Where                          | Before                          | After                       |
  | ------------------------------ | ------------------------------- | --------------------------- |
  | Editor header                  | "→ 2026-09-28 09.14"            | "Adds to 28 Sep 09.14"      |
  | Session window header          | "2026-09-28 09.14"              | "28 Sep 09.14"              |
  | Notification after New Session | "New session: 2026-09-28 09.14" | "New session: 28 Sep 09.14" |

- **Recommendation:** Use one display name wherever a person reads it, and keep the full, sortable form only for the folder in Finder.
- **Tradeoff:** The short form drops the year, and the name in Finder then differs from the one in the app. A separate idea from the evaluators: ask for a name when a new session starts.
- **Decision needed:** Should every screen show a session by its short name, keeping the full date only for the folder?
- **Verified:** seen on screen (editor, session window); menu and notifications read in the code.
- **Owner's words:** "It needs to be some sort of project or session. If there's an existing session I just add to the existing session or I create a new session." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: menu, editor header, session window title and header, notifications, session.md title; build main v0.9.0
- Broken: Nielsen 4; one vocabulary
- Code: `src/sessions.ts:88-91` (`shortName`), used in `src/main.ts:113, 361, 428, 460, 546, 550`; not used in `src/main.ts:115, 199, 277`, `src/editor.ts:831`, `src/viewer.ts:21-22`
- Screenshots: 1-editor-inuse-annotated.png, 1-session-doc-annotated.png, 1-menu-full.png, 4-viewer-empty-doc-annotated.png, 4-editor-edit-again.png, 6-editor-empty.png, 6-viewer-empty-doc.png, 7-editor-edit-again.png, 7-viewer-empty-session.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 1-16 [the name forms part; also asks for a name at New Session], 4-55, 6-32 [editor; Low], 6-46 [session window; Low], 7-26 [Low; also counts the window titles' order "Snapmark — …" against "… — Snapmark" as a third form; said routine] (seen by 2 evaluators). The time part is F201. Related: F060.
- Guideline: none accepted yet (rule area: words and vocabulary)

</details>

### F223 · "Discard", "Remove from Session" and "Reopen" name one recovery system three ways

- **Impact:** Medium · A reviewer who removes a screenshot from a session cannot tell that it is kept, where, or for how long, nor that "Reopen" can mean "put it back into the session".
- **Current experience:** The editor's button says "Discard ⌘W"; the session window's says "Remove from Session" and says nothing about keeping it. Both land in the same 7-day store. The menu offers "Reopen Last Discarded" and "Reopen Discarded…": a discarded capture opens in the editor again, while a removed screenshot goes back to the end of its session with "Screenshot 1 is back in …". The Keyboard Shortcuts window explains only the first case ("the screenshot; Reopen Last Discarded in the menu brings it back").
- **Visual:** `shots/1-session-shots.png` ("Remove from Session"), `shots/1-editor-inuse.png` ("Discard ⌘W"), `shots/1-menu-full.png` (the Reopen items).
- **Recommendation:** One noun and one verb: everything closed or removed goes to "Discarded" and comes back with "Restore" (or "Bring Back"). Say it on the button ("Remove to Discarded") or in the result ("Removed. Undo · Discarded keeps it 7 days").
- **Tradeoff:** Longer labels; "Restore" is a new word.
- **Decision needed:** Should discarding and removing share one name for where things go and one verb for bringing them back?
- **Verified:** seen on screen (buttons); read in the code (reopen behaviour, notifications).
- **Owner's words:** "if I took a screenshot, annotated it, and discarded it, it is gone. I just wonder if we should introduce a shortcut with Escape and be able to recover it so nothing ever gets lost." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor, session window, menu, notifications, Keyboard Shortcuts window; build main v0.9.0
- Broken: Nielsen 4, 2; one vocabulary; mental model
- Code: `src/main.ts` `reopen` (two kinds), `reopenDiscarded`; `src/sessions.ts` `discardCapture`, `removeShot`, `restoreShot`; `src/viewer.html` `#remove`; `src/editor.html` `#cancel`
- Screenshots: 1-session-shots.png, 1-editor-inuse.png, 1-menu-full.png
- Earlier IDs: none
- Other products: Photos: Delete → Recently Deleted → Recover; Figma: Delete → Trash → Restore; CleanShot X history: Restore (from memory, not checked)
- Seen by: 1-25. Related: F131, F058, F011.
- Guideline: none accepted yet (rule area: words and vocabulary)

</details>

### F224 · The capture action has two names: "Capture Screenshot" and "Capture region"

- **Impact:** Low · A reviewer who looks up the ⌃⇧1 key in the Keyboard Shortcuts window finds "Capture region", then looks for it in the menu and finds "Capture Screenshot".
- **Current experience:** The menu says "Capture Screenshot ⌃⇧1" and "Capture Same Area ⌃⇧3". The Keyboard Shortcuts window says "Capture region", "Capture same area" and "New session". The README says "Capture a region into the current session", and the area picker says "Drag over the area to capture."
- **Visual:** `shots/1-shortcuts-window-annotated.png`, `shots/6-shortcuts-annotated.png` ("Capture region"), `shots/1-menu-full.png` ("Capture Screenshot").
- **Recommendation:** One name, in one case, everywhere the action appears.
- **Tradeoff:** The evaluators differ on the name. Alternatives from the evaluators: (a) "Capture Screenshot", the menu's word; (b) "Capture Region", the list's word and the one the vocabulary check prefers; (c) "Capture Area", matching "Capture Same Area".
- **Decision needed:** Which name should the ⌃⇧1 action carry everywhere: "Capture Screenshot", "Capture Region" or "Capture Area"?
- **Verified:** seen on screen (Keyboard Shortcuts window); menu and README read in the code.
- **Owner's words:** "I want easy language and it to follow the laws of ux." — 2026-09-26

<details><summary>Supporting notes</summary>

- Where: menu, Keyboard Shortcuts window, README, area picker; build main v0.9.0
- Broken: Nielsen 4; one vocabulary
- Code: `src/menu.ts:75-77, 113`, `src/main.ts:516-518`, `README.md:55`
- Screenshots: 1-shortcuts-window-annotated.png, 1-menu-full.png, 6-shortcuts-light.png, 6-shortcuts-annotated.png, 7-keyboard-shortcuts-full.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 1-30 ["Capture Screenshot", or "Capture Area"], 4-56 ["Capture Screenshot"], 6-50 ["Capture Screenshot"], 7-37 ["Capture Region"] (seen by 2 evaluators). Evaluator 8's vocabulary check prefers "Capture region". Related: F227.
- Guideline: none accepted yet (rule area: words and vocabulary)

</details>

### F225 · A session can be created with one key but never deleted in Snapmark

- **Impact:** Low · A reviewer who presses ⌃⇧2 by mistake, or tries a session and abandons it, is left with it in Switch Session for good unless they delete its folder in Finder.
- **Current experience:** The menu offers New Session, Rename, Switch Session and Show Session in Finder, but no Delete, Archive or Hide. Empty sessions made by a mis-pressed key stay too; the list shows the 20 most recent.
- **Visual:** `shots/1-menu-full.png` (session items, no delete).
- **Recommendation:** "Delete Session…" in the session window, sending the session to Discarded for 7 days like a screenshot; empty sessions remove themselves when another becomes current.
- **Tradeoff:** It adds the most destructive action in the app. Alternatives from the evaluators: (a) the delete item in the session window or in the menu; (b) only let empty sessions remove themselves, with no delete item.
- **Decision needed:** Should sessions be deletable in Snapmark (recoverable through Discarded), from the session window or the menu, and should empty sessions clean themselves up?
- **Verified:** read in the code.
- **Owner's words:** "Also the new session is a very dangerous shortcut because it sits in between 1 and 2." — 2026-09-28

<details><summary>Supporting notes</summary>

- Where: menu, session items; session window; build main v0.9.0
- Broken: Nielsen 3; user control and freedom
- Code: no delete in `src/sessions.ts` or `src/main.ts`; `MAX_LISTED = 20` in `src/menu.ts`; session items at `src/menu.ts:106-108`
- Screenshots: 1-menu-full.png
- Earlier IDs: none
- Other products: Figma: Delete → Trash; CleanShot X deletes from its history
- Seen by: 1-32, 3-33 [no delete], 7-36 [empty sessions stay; asks for them to remove themselves]. Removing empty sessions on their own is also suggested in 4-03 (see F176). Related: F013, F176, F020.
- Guideline: none accepted yet (rule area: dialogs, menus and popovers)

</details>

### F226 · "Comment" means both the screenshot's comment and a card's text

- **Impact:** Low · A reviewer told that a card holds "a comment" looks for it in the comment field under the image, which is a different thing.
- **Current experience:** The field under the image says "Add a comment…" (its accessible name is "Comment"). The Card tool is described as "a yellow card whose text is a comment about what its line points at".
- **Visual:** `shots/1-editor-inuse-annotated.png`.

  | Where                 | Before                                                                | After                                                  |
  | --------------------- | --------------------------------------------------------------------- | ------------------------------------------------------ |
  | Card tool description | "a yellow card whose text is a comment about what its line points at" | "a yellow card with a note on what its line points at" |

- **Recommendation:** Keep "comment" for the text about the whole screenshot only.
- **Tradeoff:** "Note" overlaps with the reference notes. Alternatives from the evaluators: (a) "a yellow card with a note on what its line points at"; (b) "text written on the image, pointing at the element its line ends on".
- **Decision needed:** Should "comment" mean only the text for the whole screenshot?
- **Verified:** seen on screen; read in the code.
- **Owner's words:** "Help me think about how we can highlight stuff and potentially add UI elements, like being able to add a card and write on the card" — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: editor comment field; Card tool description (toolbar tooltip, Keyboard Shortcuts window, prompt); build main v0.9.0
- Broken: Nielsen 4; one vocabulary
- Code: `src/tools.ts:51`, `src/editor.ts:833`, `src/editor.html:284`
- Screenshots: 1-editor-inuse-annotated.png
- Earlier IDs: glossary proposal row "card"
- Other products: none noted
- Seen by: 4-54, 1-17 [the card called a comment part]. Related: F076, F194, F219.
- Guideline: none accepted yet (rule area: words and vocabulary)

</details>

### F227 · Title Case and sentence case mix across windows

- **Impact:** Low · A reviewer moving between windows reads "Add to session" and "Keyboard shortcuts" in one place and "Remove from Session" and "Keyboard Shortcuts" in another, so the app reads as several apps.
- **Current experience:** The menu and the session window use Title Case ("Capture Same Area", "Show Session in Finder", "Remove from Session", "Open in Markdown App", "Edit Again"). The editor uses sentence case ("Add to session", "Save changes"). The Keyboard Shortcuts window, opened from the item "Keyboard Shortcuts", is titled "Keyboard shortcuts", with rows "Capture same area" and "New session"; the quit dialog says "Quit anyway".
- **Visual:** `shots/4-viewer-shots-annotated.png`, `shots/4-editor-strings-annotated.png`.

  | Where                           | Before               | After (macOS: Title Case for buttons and menu items) |
  | ------------------------------- | -------------------- | ---------------------------------------------------- |
  | Editor primary button           | "Add to session ⌘↵"  | "Add to Session ⌘↵"                                  |
  | Edit Again primary button       | "Save changes ⌘↵"    | "Save Changes ⌘↵"                                    |
  | Keyboard Shortcuts window title | "Keyboard shortcuts" | "Keyboard Shortcuts"                                 |

- **Recommendation:** One rule: Title Case for menu items, buttons and window titles, as macOS does; sentence case for descriptions, hints and notifications.
- **Tradeoff:** Many small edits across every window.
- **Decision needed:** Should buttons and window titles follow macOS Title Case everywhere?
- **Verified:** seen on screen.
- **Owner's words:** "I want easy language and it to follow the laws of ux." — 2026-09-26

<details><summary>Supporting notes</summary>

- Where: editor, session window, Keyboard Shortcuts window, menu, quit dialog; build main v0.9.0
- Broken: platform conventions (macOS title-style capitalisation); Nielsen 4
- Code: `src/editor.html:289-290`, `src/editor.ts:832`, `src/viewer.html:166-180`, `src/main.ts:516-531, 528, 534, 611`
- Screenshots: 4-viewer-shots-annotated.png, 4-editor-strings-annotated.png, 6-editor-empty.png, 6-viewer-doc.png, 6-shortcuts-light.png
- Earlier IDs: none
- Other products: none noted
- Seen by: 4-59, 6-65 [said routine]. Related: F224.
- Guideline: none accepted yet (rule area: words and vocabulary)

</details>

### F228 · The session window calls session.md "Document"

- **Impact:** Low · A reviewer told to hand "session.md" to the agent finds a tab called "Document" and has to guess it is the same file.
- **Current experience:** The menu says "Copy session.md Path", the button's tooltip says "Open session.md in your Markdown app", and the session window's tab says "Document": three names for the one file the agent reads.
- **Visual:** No screenshot of its own; the wording:

  | Where              | Before     | After        |
  | ------------------ | ---------- | ------------ |
  | Session window tab | "Document" | "session.md" |

- **Recommendation:** Name the tab after the file the menu and the agent use.
- **Tradeoff:** A file name as a tab label reads technical. Alternatives from the evaluators: drop "session.md" from the menu and call it "Document" everywhere.
- **Decision needed:** Should the file be called "session.md" everywhere, or "Document" everywhere?
- **Verified:** seen on screen.
- **Owner's words:** "Also a full markdown view would be nice. including ideally editable like notion with markdown wyiwyg" — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: session window tabs; menu; "Open in Markdown App" tooltip; build main v0.9.0
- Broken: Nielsen 4; one vocabulary
- Code: `src/viewer.html:166-169`, `src/menu.ts:92`
- Screenshots: none
- Earlier IDs: none
- Other products: none noted
- Seen by: 4-57. Related: F001 (dropping "session.md" from the menu).
- Guideline: none accepted yet (rule area: words and vocabulary)

</details>

### F229 · An existing image cannot be brought into Snapmark

- **Impact:** Design choice · A reviewer with a screenshot a teammate sent, one taken with ⌘⇧4 before Snapmark was running, or an image on the clipboard cannot mark it up and add it to a session.
- **Current experience:** Every way into the editor starts with Snapmark's own capture. There is no Open…, no paste of an image, no drop target and no "Open with Snapmark".
- **Visual:** No screenshot: the feature does not exist.
- **Recommendation:** One way in is enough: "Paste Image as Screenshot" (⌃⇧V or a menu item) opening the editor on the clipboard image, which also covers files copied in Finder and other tools' captures.
- **Tradeoff:** Another global key or menu item, in a menu the owner already finds long; the owner scoped the first version to screenshots.
- **Decision needed:** Is marking up an image that did not come from Snapmark's capture in scope?
- **Verified:** read in the code.
- **Owner's words:** "In its first version it should just work on screenshots." — 2026-09-25

<details><summary>Supporting notes</summary>

- Where: app-wide; build main v0.9.0
- Broken: Postel's law; rule areas copy and paste, drag and drop
- Code: `src/main.ts:118-124`, `src/main.ts:358-369`, `src/main.ts:334-341` (the only callers of `openEditor`: capture, Discarded, Edit Again)
- Screenshots: none
- Earlier IDs: 2026-09-25 audit F037
- Other products: none noted
- Seen by: 3-36. Agent 1's scrolling-capture notes list a "Mark Up Image…" option; evaluator 8's flow check found no import handler and asserted no defect. Related: F081.
- Guideline: none accepted yet (rule area: copy and paste)

</details>

---

## Appendix · Scrolling capture: exploration notes

From agent 1 (concepts and structure), unchanged.

Notes for a later decision, not findings. The owner: "Is this possible without it being a Chrome
extension or something? It's not important. This shouldn't be the default. We just want to maybe
explore this." — 2026-09-28

**How others do it (from memory; details unverified)**

- CleanShot X "Scrolling Capture": the reviewer selects an area, presses Start, then scrolls (or turns on auto-scroll); CleanShot captures frames and stitches them by matching overlapping rows. Auto-scroll posts scroll events and needs the Accessibility permission. Known trouble: sticky headers and footers, lazy-loaded content, animated content. Works in any app, not only browsers.
- Shottr "Scrolling screenshot": select an area, scroll manually (auto-scroll exists in newer versions, unsure), Shottr stitches; it trims repeated fixed headers. Any app.
- macOS Screenshot: no scrolling capture. Safari and Chrome can save a whole page without an extension: Chrome DevTools command menu "Capture full size screenshot", Firefox's built-in screenshot "Save full page".
- Xnapper: no scrolling capture that I know of. Figma: not applicable.

**What Snapmark would need, without a browser extension**

- Permission: Screen Recording, which Snapmark already has. Auto-scroll would add Accessibility (posting scroll events), a second, more alarming permission prompt, plus a native helper, because Electron has no API to post global scroll events.
- Frames: `screencapture -R` per frame starts a process each time (about 100–300 ms, a guess), fine for manual scrolling at the reviewer's pace. Faster: Electron's `desktopCapturer` stream (same permission, no native code), cropped to the saved area, sampled while the reviewer scrolls.
- Stitching: compare each frame with the last by rows (hash or grey-level correlation), find the vertical offset, append only the new rows. Rows that never change across frames are a fixed header or footer: keep them once. Stop on Esc or a key, and when the offset stays zero.
- It fits Snapmark's own model: Capture Same Area already defines the rectangle; "Scroll Capture Same Area" would reuse it.
- Limits: sticky or parallax elements, lazy loading and skeletons, carousels and animations, scroll-snapping, virtualised lists (rows recycled while scrolling), horizontal scroll, very long pages (memory).
- The editor would need zoom and scrolling first: today it fits the whole image into the window, so a 1280 × 8000 page would show about 100 points wide.

**Cost for the AI**

- Snapmark already shrinks every image to at most 1568 px on the long edge and about 1.15 megapixels (Claude's own limits). A 1280 × 8000 page shrunk that way is about 250 × 1568: unreadable.
- Claude counts roughly width × height ÷ 750 tokens per image, so a readable long page must be cut into tiles of about 1.15 megapixels each, about 1,500 tokens per tile. A 1280 × 8000 page is about 10 megapixels, 9 tiles, about 14,000 tokens, against about 1,500 for one screenshot of the viewport.
- Tiles fit `session.md` as they are: one entry per tile ("## 004a · …", "## 004b · …"), marks per tile.

**Options, cheapest first**

1. Do nothing new: the reviewer already can do "Capture Same Area, scroll, Capture Same Area" (two keys per viewport, one entry each), which is tiled and token-honest by construction.
2. Accept an image from outside: "Mark Up Image…" or paste from the clipboard into the editor, so a Chrome "Capture full size screenshot" can be marked and added. No new permission, small code; needs editor zoom for tall images.
3. Manual-scroll stitching over the saved area (`desktopCapturer` frames, row matching, fixed-header trim), saved as tiles. Medium effort, no new permission.
4. Auto-scroll stitching: 3 plus scroll events, Accessibility permission and a native helper. Largest effort and a second permission.
