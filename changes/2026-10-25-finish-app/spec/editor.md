# Spec: M1 Editor polish and leftovers

Milestone 1 of `2026-10-25-finish-app`. The editor gets the toolbar and header the design mock promised, a Highlighter that shows on dark screens, and the open beads leftovers are fixed or closed. Facts F101–F135 are in [facts.md](facts.md); files and order in [plan-rows.md](plan-rows.md).

Mock: `design-explorations/2026-10-25-native-round-2/01-editor/shots/editor--in-use.png` (title row "Snapmark" with the app icon; tool captions C, ⌘1–⌘7; Undo and Redo with icons; no Copy Image or Save As… in the toolbar; "Ledgerly Q4 review · 12 screenshots ⌄" at the right).

## What is wrong today

| Ask | Today                                                                                                                                                                                                                  | Code                                                                                                                              |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| A10 | The Highlighter multiplies yellow at 45 %. Yellow × black is black, so on a dark header it is gone (1.0:1, audit F054).                                                                                                | `src/editor.ts:102-107`; `docs/ux/audits/2026-09-28/findings.md:1852`; guideline A9 `docs/ux/interaction-guidelines.md:1045-1049` |
| A8  | One `<kbd>` per group shows the plain key ("2"). The second tool of a group has no key of its own. With Single-Key Tools off the toolbar still shows "2", which does nothing. The setting never redraws the toolbar.   | `src/editor.ts:361-371`, `src/editor.ts:1193` (`onSingleKeys` only sets the variable)                                             |
| A8  | The Keyboard Shortcuts window lists "C" and "1"–"7" in both modes and never names the setting; an open one is never redrawn.                                                                                           | `src/main.ts:829-846` (`showShortcuts`)                                                                                           |
| A9  | Icons 18 px in 34 × 30 buttons; caption 10 px monospace in `--muted`; dots 6 px.                                                                                                                                       | `src/editor.html:101-144`                                                                                                         |
| A7  | Undo, Redo, Copy Image and Save As… are text buttons; the session label is plain text with no way to switch; the editor has the plain native title bar ("Snapmark — <session>"); every new editor starts on coral red. | `src/editor.html:507-511`; `src/main.ts:359-366`; `src/editor.html:516`                                                           |
| A7  | The editor has no minimum size; the toolbar scrolls sideways when narrow.                                                                                                                                              | `src/main.ts:359` (no `minWidth`), `src/editor.html:62`                                                                           |

## Decisions (defaults taken; see Questions)

1. **Highlighter:** first a screen pass of the yellow at 50 %, then today's multiply at 45 %. On white the screen pass changes nothing, so a light highlight is exactly today's (253, 232, 150). On black it lifts to about (124, 93, 5), 3.4:1 against #18181b. Light text under a dark-screen highlight drops from about 18:1 to about 4:1. This is the audit's option (a), "lighten on dark pixels".
2. **Groups stay.** One button per key, as the ADRs say (`docs/designs/2026-09-25-adr-toolbar.md`, `docs/designs/2026-09-26-adr-toolbar.md`). The caption shows the key that always works, ⌘1–⌘7, like the mock. The dots stay and grow, and the tooltip names both tools of the group with their key.
3. **Select's key:** "C" while Single-Key Tools is on, "Esc" while it is off. It gets no ⌘ key (snap-bmr.17.3 item 3).
4. **Sizes:** icon 22 px, button 40 × 36, swatch 40 × 36, caption 11 px system font, weight 500, `--ink`; dots 8 px. Minimum editor window 820 × 520 points. At 820 the toolbar fits without sideways scrolling, and the session label shortens with "…".
5. **Header:** `titleBarStyle: 'hiddenInset'`, like the session window (`src/main.ts:522`). A 32 px title row holds the traffic lights at the left and the app icon plus "Snapmark" in the centre, and it drags the window. The toolbar row sits below it. The window title stays "Snapmark — <session>" for the Window menu and Mission Control.
6. **Undo and Redo:** icon buttons with no text. The name and key are in the tooltip and `aria-label`, as the brief asks. The mock shows icon, word and key; see Q2.
7. **Copy Image and Save As…** become one icon button, the macOS share glyph, named "Copy or Save". It opens a native menu (`Menu.popup`) with "Copy Image ⇧⌘C" and "Save As… ⇧⌘S". The keys work as before. One-shot mode keeps its primary "Copy Image ⌘C" button in the side panel.
8. **Session label:** a button, "<session> · 12 screenshots ⌄". It opens a native menu: the 10 recent sessions (this editor's ticked), a separator, then "New Session". A pick makes it this editor's session and the current session. In Edit Again and one-shot it is plain text, with no chevron and no menu.
9. **Colour:** the last picked annotation colour is kept in `state.json` and every new editor opens with it, also after a restart. Remove (5) and Highlight (6) keep their fixed colours.
10. **Add to session** stays solid `#0f72db`, not the gradient variant (Q4).

## Screens

### Editor, header (session mode)

| Row                                    | Left → right                                                                                            | Notes                                      |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| title row, 32 px, drags                | traffic lights · (centre) app icon 16 px + "Snapmark" 13 px semibold                                    | same icon SVG as `src/viewer.html:459`     |
| toolbar, 52 px, drags between controls | 8 tool buttons with captions · │ · colour swatch · Undo · Redo · Copy or Save · (right) session label ⌄ | controls are `-webkit-app-region: no-drag` |

| Control        | Component                                  | Label / caption                                            | Key                           | Disabled when                     | State source                      |
| -------------- | ------------------------------------------ | ---------------------------------------------------------- | ----------------------------- | --------------------------------- | --------------------------------- |
| tool button ×8 | icon button 40 × 36, 22 px icon            | caption "C"/"Esc", "⌘1"…"⌘7"; dots under keys with 2 tools | C / Esc, 1–7 (setting), ⌘1–⌘7 | never                             | `GROUPS`, `variant`, `singleKeys` |
| swatch         | 40 × 36                                    | tooltip "Annotation colour"                                | —                             | never                             | `colorEl.value`, saved colour     |
| Undo           | icon button 36 × 36                        | tooltip "Undo (⌘Z)"                                        | ⌘Z                            | nothing to undo                   | `undoStack`                       |
| Redo           | icon button 36 × 36                        | tooltip "Redo (⇧⌘Z)"                                       | ⇧⌘Z                           | nothing to redo                   | `redoStack`                       |
| Copy or Save   | icon button 36 × 36, share glyph           | tooltip "Copy Image or Save As…"                           | ⇧⌘C, ⇧⌘S (unchanged)          | never                             | —                                 |
| session label  | text button, max 260 px, ellipsis, chevron | "<session> · <n> screenshots"                              | —                             | Edit Again, one-shot (plain text) | `editor:session`                  |

### Editor, menus (native)

| Menu          | Items                                                                            |
| ------------- | -------------------------------------------------------------------------------- |
| Copy or Save  | Copy Image ⇧⌘C · Save As… ⇧⌘S (accelerators shown, `registerAccelerator: false`) |
| session label | up to 10 recent sessions, this editor's ticked · separator · New Session         |

### Keyboard Shortcuts window

Tool rows follow the setting. On: "C or Esc", "1 or ⌘1", "1 again". Off: "Esc", "⌘1", "⌘1 again". Under the tools table, one line names the setting (Words). An open window is redrawn when the setting changes.

### Session window (leftovers)

- Minimum size 720 × 480. Only the name shrinks in the header; "Open in Markdown App" stays on one line.
- The rename hint names the date. An empty field with a click away keeps the old name. Typing clears an error. The placeholder reads at 4.5:1.

## Interaction

| From                               | Action         | Result                                                                                         | Notes                                                      |
| ---------------------------------- | -------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Menu ▸ Settings ▸ Single-Key Tools | click          | every open editor redraws its captions and tooltips; an open Keyboard Shortcuts window redraws | `setSingleKeys` → `editor:single-keys` → `renderToolbar()` |
| session label ⌄                    | click          | native menu under the label                                                                    | `editor:sessions-menu` with the label's rect               |
| session menu                       | pick a session | label and count follow; that session becomes current; Add to session saves there               | `ed.session = name; setActive(name); tellEditors`          |
| session menu                       | New Session    | as the menu bar's New Session; the editor moves to the current session afterwards              | an empty current session is kept, as today (`newSession`)  |
| Copy or Save                       | click          | native menu; Copy Image / Save As… as the old buttons                                          |                                                            |
| swatch                             | pick a colour  | marks use it; it is saved; the next editor starts with it                                      | `editor:color`                                             |
| session window, rename field empty | click away     | the old name stays                                                                             | ↩ with an empty field still clears it to the bare date     |
| session window, after ⌘⌫           | ↩              | nothing renames                                                                                | focus goes to the large image (`tabindex=-1`)              |
| ⌘Z after ⌘⌫                        | —              | the screenshot comes back at its old place when its number is free                             | `restoreShot` inserts before the next higher number        |

## Words

| Where (file)                                                     | Before                                       | After                                                                                                                                                             |
| ---------------------------------------------------------------- | -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| tool caption (`src/editor.ts` `renderToolbar`)                   | "C", "1"…"7"                                 | "C" (on) / "Esc" (off), "⌘1"…"⌘7"                                                                                                                                 |
| tool tooltip, Single-Key on (`src/tools.ts` `tipFor`)            | "Box (2) · press again for Ellipse"          | "Box (2 or ⌘2) · press again for Ellipse"                                                                                                                         |
| tool tooltip, off                                                | same as on                                   | "Box (⌘2) · press ⌘2 again for Ellipse"                                                                                                                           |
| Select tooltip                                                   | "Select (C): click a mark…"                  | "Select (C or Esc): click a mark…" / "Select (Esc): click a mark…"                                                                                                |
| Undo / Redo (`src/editor.html`)                                  | "Undo ⌘Z", "Redo ⇧⌘Z"                        | icon; tooltip and aria-label "Undo (⌘Z)", "Redo (⇧⌘Z)"                                                                                                            |
| Copy or Save (`src/editor.html`)                                 | two buttons                                  | aria-label "Copy or Save"; tooltip "Copy Image or Save As…"; menu "Copy Image", "Save As…"                                                                        |
| session label tooltip                                            | none                                         | "<full session name> · Switch Session"                                                                                                                            |
| session menu (`src/menu.ts` `editorSessionMenu`)                 | none                                         | session labels, "New Session"                                                                                                                                     |
| title row                                                        | native "Snapmark — <session>"                | "Snapmark" (window title unchanged)                                                                                                                               |
| Shortcuts window line (`src/keys.ts` `shortcutsHtml`)            | none                                         | On: "Settings ▸ Single-Key Tools is on: C and 1–7 pick tools too." Off: "Settings ▸ Single-Key Tools is off: only ⌘1–⌘7 pick tools, and Esc goes back to Select." |
| quit warning, one-shot only (`src/menu.ts` `quitMessage`)        | "1 screenshot is not in a session yet."      | "1 image is not copied or saved yet." / "2 images are not copied or saved yet."                                                                                   |
| quit warning, mixed                                              | as above                                     | "3 screenshots are not saved yet."                                                                                                                                |
| quit warning, session only                                       | —                                            | unchanged                                                                                                                                                         |
| rename hint, dated (`src/viewer.ts:169`)                         | "The date stays · ↩ to save · Esc to cancel" | "2026-10-24 stays in front · ↩ to save · Esc to cancel"                                                                                                           |
| rename refused, bracket number (`src/sessions.ts` `nameProblem`) | silently read as a same-minute suffix        | "A name can't start with a number in brackets, like (2)."                                                                                                         |
| rename failed (viewer hint; menu notification)                   | silent                                       | "Couldn't rename: <system message>"                                                                                                                               |
| menu rename refused (`src/main.ts` `renameFromMenu`)             | notification only, typed name lost           | the dialog asks again: "<name> already exists. Choose another name.", the typed name filled in                                                                    |

## Beads leftovers: what M1 does with each

| Bead · item                                                                                         | Disposition                                                                                                                                                                  | Fact or step |
| --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| snap-bmr.11 Done button blue                                                                        | fix: `#done` background `#0f72db` (`src/scroll.html:51`)                                                                                                                     | F120         |
| snap-bmr.12 one-shot quit warning                                                                   | fix                                                                                                                                                                          | F121         |
| snap-bmr.15 local network prompt                                                                    | fix: own LC_UUID in an `afterPack` hook, fixed per app and arch, so the macOS choice survives updates                                                                        | F122         |
| snap-bmr.16.1 Switch Session with one session                                                       | fix: greyed when no session other than the current exists (`src/menu.ts:134`)                                                                                                | F118         |
| snap-bmr.17.1 shortcuts follow macOS                                                                | **close**: both children are closed and on main (`src/keys.ts:5-10` ⌃⇧3/4/5, Settings ▸ Single-Key Tools `src/menu.ts:186-192`, viewer ↩ ⌘⌫ ⌘O `src/viewer.ts:222-231`)      | step 1       |
| snap-bmr.17.2 #1 ⌘Z puts back in place                                                              | fix                                                                                                                                                                          | F119         |
| snap-bmr.17.2 #2 single-key setting                                                                 | close: shipped (snap-bmr.17.1.2)                                                                                                                                             | step 1       |
| snap-bmr.17.2 #3 stale docs                                                                         | fix: `docs/ux/sitemap.md:36,134,144` "Capture Same Area" → "Capture Last Area"; guideline "Today" lines `docs/ux/interaction-guidelines.md:526,832,1261` stop naming ⌃⇧1/⌃⇧2 | docs step    |
| snap-bmr.17.3 #1 keycaps per mode, redraw                                                           | fix                                                                                                                                                                          | F103–F106    |
| snap-bmr.17.3 #2 shortcuts window                                                                   | fix                                                                                                                                                                          | F109         |
| snap-bmr.17.3 #3 Select has no ⌘ key                                                                | keep Esc (owner decision), caption shows it                                                                                                                                  | F104         |
| snap-bmr.17.3 #4 smoke covers only the variable                                                     | fix: smoke drives the menu action, reads state.json and the open editor                                                                                                      | F110         |
| snap-bmr.17.3 #5 smoke's state.json folder                                                          | fix: smoke sets `userData` to its temp folder before requiring main. Today it writes `app.getPath('userData')/state.json` (`src/main.ts:37`), the dev app's real folder      | F110         |
| snap-bmr.17.3 #6 A12 text                                                                           | fix: `docs/ux/interaction-guidelines.md:1076` and enforcement row `:1470` say the setting exists and is tested                                                               | docs step    |
| snap-bmr.14.3 F010 empty name in menu rename                                                        | fix (re-ask)                                                                                                                                                                 | F125         |
| snap-bmr.14.3 F012 focus back to the title                                                          | close: `src/viewer.ts:191-198` returns focus on ↩ and Esc; covered by smoke F15                                                                                              | step 1       |
| snap-bmr.14.3 F013–F021 stale spec text                                                             | close: that spec is the session-names change record, not a live doc                                                                                                          | step 1       |
| snap-bmr.14.3 F022 long label in the editor                                                         | fix                                                                                                                                                                          | F116         |
| snap-bmr.14.3 F026 session window min size                                                          | fix                                                                                                                                                                          | F130         |
| snap-bmr.14.3 F029–F036 refused menu rename                                                         | fix                                                                                                                                                                          | F125         |
| snap-bmr.14.3 F037/F038 long names                                                                  | fix                                                                                                                                                                          | F123, F116   |
| snap-bmr.14.3 F039/F044/F045 hint names the date                                                    | fix                                                                                                                                                                          | F126         |
| snap-bmr.14.3 F040 placeholder colour                                                               | fix                                                                                                                                                                          | F129         |
| snap-bmr.14.3 F042/F047 empty field and click away                                                  | fix                                                                                                                                                                          | F127         |
| snap-bmr.14.3 F046 error stays while typing                                                         | fix                                                                                                                                                                          | F128         |
| snap-bmr.14.3 E2E gaps F025/F027/F028/F041/F043                                                     | fix as smoke assertions; the review report is not in the repo, so read it from PR 79 first (Q8)                                                                              | step 15      |
| snap-bmr.14.3 F048/F049 same-day same name                                                          | close: accepted by `docs/designs/2026-10-25-adr-session-folders-keep-their-date-stamp.md`                                                                                    | step 1       |
| snap-ua7 #1 header wraps                                                                            | fix                                                                                                                                                                          | F123         |
| snap-ua7 #2 "(n)" name                                                                              | fix: refuse                                                                                                                                                                  | F124         |
| snap-ua7 #3 rename that throws is silent                                                            | fix                                                                                                                                                                          | F125         |
| snap-ua7 #4 "Other Session…", "twenty recent sessions"                                              | fix: `docs/ux/glossary-proposal.md:18,58`, `docs/ux/interaction-guidelines.md:176,214,488,506,580,587,756` → "Older Sessions…", "the 10 most recent sessions"                | docs step    |
| snap-ua7 #5 smoke F3, F8, F13 not asserted                                                          | fix as smoke assertions                                                                                                                                                      | step 15      |
| snap-ua7 #6 old fixture labels                                                                      | fix: `test/menu.test.ts:15` "25 Sep 12.03" → `shortName` form                                                                                                                | step 15      |
| snap-c5c L2 nudge uses the window's scale                                                           | close as accepted (Q7): the capture and the editor are almost always on the same display                                                                                     | step 1       |
| snap-c5c L3 viewer guesses the removed folder                                                       | fix: `viewer:remove` returns `removeShot`'s folder                                                                                                                           | F131         |
| snap-c5c L4 guard misses `screencapture -i`                                                         | fix: a `shooting` flag in `busy()`                                                                                                                                           | F132         |
| snap-c5c L5 `menuOpen` can stick                                                                    | fix: reset after `popUpContextMenu` returns                                                                                                                                  | F133         |
| snap-c5c L6 copies drop the selection                                                               | fix                                                                                                                                                                          | F134         |
| snap-c5c tests (F13 drag, F15 with one shown, F18 `= true`, F19 titles only, grid Edit Again click) | fix as smoke and unit assertions                                                                                                                                             | step 15      |
| snap-c5c no fact for Single-Key Tools                                                               | fix: F103–F106, F109 and the Words above                                                                                                                                     | —            |
| snap-c5c done.json tags `editor[...]`                                                               | close: an archived change's record                                                                                                                                           | step 1       |
| snap-c5c UX focus after removal                                                                     | fix                                                                                                                                                                          | F135         |

## Out of scope

- Icons in the session window, the menu bar menu and the area picker (A9 is read as the editor toolbar; Q3).
- One button per tool (Q1).
- The gradient "Add to session" (Q4).
- "Older Sessions…" in the editor's session menu (Q5).
- Moving the comment and References panel, and any change to marks other than the Highlighter.

Open questions with their defaults: [questions.md](../questions.md).
