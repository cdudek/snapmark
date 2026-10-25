---
linear: none
type: facts
change: 2026-10-25-finish-app
design: docs/designs/2026-10-25-adr-tall-screenshots-saved-as-parts.md
author: Claude (orchestrator)
status: draft
reviewed_by: null
approved_at: null
created: 2026-10-25
---

# Facts: finish Snapmark, everything but selling

## Goal

Snapmark looks and works the way the approved designs promised. It captures from an on-screen bar, has a Settings window, and reads tall captures at full width. Four milestones, each released when it merges. The words and layouts are in [spec/editor.md](spec/editor.md), [spec/capture-and-settings.md](spec/capture-and-settings.md) and, for tiles, [spec/ia.md](spec/ia.md) and its siblings.

## Acceptance criteria

The system is Snapmark. Unit facts are plain-Node assert blocks in `test/*.test.ts`, one block per fact. Smoke checks in `test/smoke.ts` are keyed strings. Every check runs once per milestone (`verify_gate.py milestone`, which includes `smoke:background`), and CI runs them again on the milestone PR. Nothing runs per feature.

## Milestone 1 — Editor polish and leftovers

The system is Snapmark. Words are in `spec.md` Words. Unit facts are plain-Node assert blocks in `test/*.test.ts`, one block per fact, headed by a comment naming the fact (`// F103 …`). Smoke checks in `test/smoke.ts` are keyed strings. The editor page's are `r[...]`, the window-level ones `inPage[...]`, and the session-window ones `viewer[...]`. CI runs smoke headless on every PR; the milestone runs `npm run smoke:background` once.

### Highlighter

- [ ] **F101** (A10, A9) The Highlighter shall show over a dark area at 3:1 or more against that area. Screen/state: editor, highlight over #18181b. Tag: smoke `r['F101 a highlight over the dark header reads at 3:1']`.
- [ ] **F102** (A10) The Highlighter shall leave a white pixel at (253, 232, 150), within 2 per channel, as today. Screen/state: editor, highlight over white. Tag: smoke `r['F102 a highlight over white is as before']`.

<details>
<summary>Verification</summary>

- F101: smoke drags key 6 over the mock's dark header (x .30–.45, y .02–.06). It reads `px(.37, .04)` before and after, and computes the WCAG contrast of the two in the page. It is at least 3.
- F102: smoke reads the existing highlight at `px(.32, .32)` (white ground). Each channel is within 2 of (253, 232, 150).

</details>

### Toolbar keys and size

- [ ] **F103** (A8, A13 snap-bmr.17.3) The toolbar shall show ⌘1 to ⌘7 under the buttons of groups 1 to 7, whatever the Single-Key Tools setting. Screen/state: editor toolbar, setting on and off. Tag: `test/keys.test.ts` › "F103 captions" and smoke `r['F103 captions read C, ⌘1–⌘7']`.
- [ ] **F104** (A8, A13 snap-bmr.17.3) While Single-Key Tools is on, the Select caption shall read "C"; while it is off, "Esc". Screen/state: editor toolbar. Tag: `test/keys.test.ts` › "F104 Select caption".
- [ ] **F105** (A8) Each tool's tooltip shall name the tool, every key that picks it in the current mode, and the group's other tool. The words are in spec.md. Screen/state: editor toolbar, hover. Tag: `test/keys.test.ts` › "F105 tooltips".
- [ ] **F106** (A8, A13 snap-bmr.17.3) When Single-Key Tools changes, every open editor shall redraw its captions and tooltips without reopening. Screen/state: editor open, menu Settings. Tag: smoke `r['F106 the setting redraws the toolbar']`.
- [ ] **F107** (A9) The toolbar shall draw tool icons at 22 px in 40 × 36 buttons, with 11 px captions in the text colour. Screen/state: editor toolbar, light and dark. Tag: smoke `r['F107 toolbar sizes']`.
- [ ] **F108** (A9, A7) At the editor's minimum size of 820 × 520 points, the toolbar shall show every control without scrolling sideways. Screen/state: editor at minimum size. Tag: smoke `inPage['F108 the toolbar fits at 820 points']`.
- [ ] **F109** (A13 snap-bmr.17.3) The Keyboard Shortcuts window shall list the tool keys of the current mode and name the setting. An open window shall redraw when the setting changes. Screen/state: Keyboard Shortcuts window, on and off. Tag: `test/keys.test.ts` › "F109 shortcuts window".
- [ ] **F110** (A13 snap-bmr.17.3) When the owner clicks Settings ▸ Single-Key Tools, the system shall save the setting and tell every open editor. It is saved to `state.json` in the user data folder. The smoke test's user data folder shall be inside its temp folder. Screen/state: menu Settings. Tag: smoke `inPage['F110 the setting reaches state.json and the editor']`.

<details>
<summary>Verification</summary>

- F103, F104, F105: `test/keys.test.ts` requires `src/tools.ts`. It checks `capFor(group, on)` and `tipFor(group, variant, on)` for all 8 groups in both modes against the spec.md Words table. Smoke reads the eight `#tools .cap kbd` texts: "C", then "⌘1" to "⌘7".
- F106: smoke calls the exported `setSingleKeys(false)`. Within 1 s the Select caption reads "Esc" and the Box tooltip reads "Box (⌘2) · press ⌘2 again for Ellipse". Then `setSingleKeys(true)` turns them back.
- F107: smoke reads computed styles. `#tools svg` is 22 × 22, `#tools button` is 40 × 36, and `.cap` has `font-size` 11px and the colour of `body`.
- F108: smoke calls `win.setSize(820, 520)` and checks `win.getMinimumSize()` is [820, 520]. After a resize tick, `header.scrollWidth <= header.clientWidth`, and `#session` has `text-overflow: ellipsis`.
- F109: `test/keys.test.ts` checks `shortcutsHtml(GROUPS, true)` has "1 or ⌘1" and the "is on" line. It checks `shortcutsHtml(GROUPS, false)` has "⌘1", "Esc" and the "is off" line and no bare `<kbd>1</kbd>`. A grep shows `setSingleKeys` in `src/main.ts` reloads an open `shortcutsWin`.
- F110: smoke sets `app.setPath('userData', path.join(root, 'userData'))` before it requires main. It clicks the menu's Single-Key Tools item, built from `menuTemplate(menuState(), actions)`, then reads `root/userData/state.json` (`singleKeys: false`) and the open editor's `singleKeys` variable.

</details>

### Editor header like the mock

- [ ] **F111** (A7) The editor window shall show a title row with the app icon and "Snapmark" above the toolbar, with the traffic lights in it. The row shall drag the window. Screen/state: editor, session and one-shot. Tag: smoke `r['F111 title row']`.
- [ ] **F112** (A7) Undo and Redo shall be icon buttons with no visible text, named "Undo (⌘Z)" and "Redo (⇧⌘Z)" in their tooltip and accessible name. Screen/state: editor toolbar. Tag: smoke `r['F112 Undo and Redo are icons']`.
- [ ] **F113** (A7) When the owner clicks Copy or Save, the system shall show a menu with Copy Image ⇧⌘C and Save As… ⇧⌘S. These items do what the two buttons did. Screen/state: editor toolbar. Tag: `test/menu.test.ts` › "F113 Copy or Save menu" and smoke `r['F113 one Copy or Save button']`.
- [ ] **F114** (A7) When the owner picks a session from the session label's menu, the system shall make it the editor's session and the current one. The label shall show its name and count. Screen/state: editor, session mode. Tag: `test/menu.test.ts` › "F114 editor session menu" and smoke `inPage['F114 the label switches the session']`.
- [ ] **F115** (A7) While the editor is in Edit Again or one-shot mode, the session label shall show no chevron and open no menu. Screen/state: editor, Edit Again and one-shot. Tag: smoke `inPage['F115 no session menu in Edit Again or one-shot']`.
- [ ] **F116** (A13 snap-bmr.14.3 F022, F037) If the session name does not fit, then the label shall shorten it with "…". Its tooltip shall show the full name. Screen/state: editor, 80-character name. Tag: smoke `inPage['F116 a long name shortens']`.
- [ ] **F117** (A7) When the owner picks an annotation colour, every editor opened after that, also after a restart, shall start with it. Screen/state: editor, second window. Tag: smoke `inPage['F117 the next editor keeps the colour']`.
- [ ] **F118** (A13 snap-bmr.16.1) While no session other than the current one exists, Switch Session shall be greyed out. Screen/state: menu bar menu, Session ▸; editor session menu. Tag: `test/menu.test.ts` › "F118 one session".

<details>
<summary>Verification</summary>

- F111: smoke reads `.titlebar` text "Snapmark", the icon `svg` in it, and computed `-webkit-app-region: drag`. `win.getTitle()` still reads "Snapmark — smoke" (the native-look F12 check stays).
- F112: smoke checks `#undo` and `#redo` have an `svg`, empty `textContent`, and `title` and `aria-label` as in spec.md.
- F113: `test/menu.test.ts` checks `copyMenu(actions)` labels and accelerators. Smoke checks `#copy` and `#save-as` are gone and `#share` exists. Copy and Save As run by ⇧⌘C and ⇧⌘S (`test/smoke.ts:355`, `:765` switch from `.click()` to the keys).
- F114: `test/menu.test.ts` checks `editorSessionMenu(state, 'b', actions)`: at most 10 sessions, 'b' ticked, then a separator and "New Session". Smoke calls the exported `moveEditor(win, name)`. `#session` then reads the other session's label and count, and ⌘S adds the screenshot to that session (`sessions.count` goes up by 1).
- F115: smoke opens Edit Again (existing ⌘O flow) and a one-shot editor. `#session` is `disabled` and has no `.chevron`.
- F116: smoke renames the session to 80 characters; `#session` `scrollWidth > clientWidth` and its `title` holds the full name.
- F117: smoke picks Violet in one editor, closes it, and opens the next. Its `colorEl.value` is "#8b3dff", and `root/userData/state.json` has `color: "#8b3dff"`.
- F118: `test/menu.test.ts` builds the menu with one session that is current; Switch Session is `enabled: false`. With two it is enabled. `editorSessionMenu` with one session lists it ticked and greys nothing else.

</details>

### Session window and rename

- [ ] **F119** (A13 snap-bmr.17.2) When a removed screenshot returns under its old number, the system shall put its entry back before the first higher-numbered entry. Screen/state: session window, ⌘Z and Reopen. Tag: `test/sessions.test.ts` › "F119 back in place".
- [ ] **F123** (A13 snap-ua7, snap-bmr.14.3 F037/F038) At 1100 points wide, a 60-character session name shall leave "Open in Markdown App" on one line. Only the name shortens. Screen/state: session window header. Tag: smoke `viewer['F123 a long name never wraps the buttons']`.
- [ ] **F124** (A13 snap-ua7) If a typed name starts with a number in brackets, then the system shall refuse it and say why. Screen/state: rename field, menu Rename Session…. Tag: `test/sessions.test.ts` › "F124 bracket number refused".
- [ ] **F125** (A13 snap-ua7, snap-bmr.14.3 F010, F029–F036) If a rename is refused or fails, then the system shall say why. In the session window it says why under the field; from the menu it asks again with the typed name filled in. Screen/state: rename refused, rename throws. Tag: smoke `viewer['F125 a failed rename says why']`; menu: manual, the verifier reads `renameFromMenu` in `src/main.ts`.
- [ ] **F126** (A13 snap-bmr.14.3 F039/F044/F045) While a dated session is renamed, the hint shall name the date that stays. Screen/state: rename field open. Tag: smoke `viewer['F126 the hint names the date']`.
- [ ] **F127** (A13 snap-bmr.14.3 F042/F047) If the rename field is empty when it loses focus, then the system shall keep the old name. Screen/state: rename field, click away. Tag: smoke `viewer['F127 an empty field and a click away keep the name']`.
- [ ] **F128** (A13 snap-bmr.14.3 F046) When the owner types after a refused name, the error shall clear. Screen/state: rename field, error shown. Tag: smoke `viewer['F128 typing clears the error']`.
- [ ] **F129** (A13 snap-bmr.14.3 F040) The rename field's placeholder shall read at 4.5:1 or more on its field. Screen/state: rename field, empty, light and dark. Tag: smoke `viewer['F129 placeholder contrast']`.
- [ ] **F130** (A13 snap-bmr.14.3 F026) The session window shall not shrink below 720 × 480 points. Screen/state: session window. Tag: smoke `viewer['F130 minimum size']`.
- [ ] **F131** (A13 snap-c5c L3) When the owner presses ⌘Z after ⌘⌫, the system shall put back the screenshot that ⌘⌫ removed. This holds even when a newer discard exists. Screen/state: session window. Tag: smoke `viewer['F131 ⌘Z puts back the one removed']`.
- [ ] **F135** (A13 snap-c5c) When a removal in the session window ends, ↩ shall not start a rename. Screen/state: session window, large view after ⌘⌫. Tag: smoke `viewer['F135 ↩ after a removal does not rename']`.

<details>
<summary>Verification</summary>

- F119: `test/sessions.test.ts`: entries 1, 2, 3; remove 2, restore it; headings read 001, 002, 003 in that order. When 2 was taken, it goes to the end as 4, as today.
- F124: `nameProblem('(2) Ledgerly')` is the spec.md sentence; `nameProblem('Ledgerly (2)')` is null. `viewer:rename` and `renameFromMenu` use it.
- F125: smoke stubs `sessions.rename` to throw "EACCES"; the hint reads "Couldn't rename: EACCES" with class `error`. Menu: the verifier reads `renameFromMenu`. A refused or thrown rename calls the dialog again with the reason as prompt and `wanted` as the default answer.
- F126: smoke opens rename on a dated session: the hint starts "2026-10-24 stays in front".
- F127: smoke empties the field and blurs it; the session keeps its name and `session.md` its title.
- F128: smoke types a taken name and presses ↩; the error shows. One more key clears `#hint.error`.
- F129: smoke reads `getComputedStyle(input, '::placeholder').color` and the input background, and computes 4.5 or more.
- F130: smoke checks `view.getMinimumSize()` is [720, 480].
- F131: smoke removes screenshot 1 with ⌘⌫, closes an editor without saving (a newer discard), then presses ⌘Z; screenshot 1 is back.
- F135: smoke presses ⌘⌫ then ↩; `#rename` is not shown and `document.activeElement` is the large image.

</details>

### Small fixes

- [ ] **F120** (A13 snap-bmr.11) Capture Scrolling's Done button shall be #0f72db with white text. Screen/state: Capture Scrolling control. Tag: smoke `viewer['F120 Done is the dark blue']`, next to the Capture Scrolling checks (`test/smoke.ts:654`).
- [ ] **F121** (A13 snap-bmr.12) If the owner quits with unsaved editors, then the warning shall count one-shot images as images not copied or saved yet. The words are in spec.md. Screen/state: quit warning, one-shot only and mixed. Tag: `test/menu.test.ts` › "F121 quit warning".
- [ ] **F122** (A13 snap-bmr.15) The packaged app's main executable shall carry its own LC_UUID, different from Electron's and the same for every release of one architecture. Screen/state: packaged app. Tag: `test/uuid.test.ts` › "F122 own LC_UUID"; manual, the owner sees no local network prompt on the next release.
- [ ] **F132** (A13 snap-c5c L4) While a `screencapture -i` capture runs, a capture key or menu item shall do nothing. Screen/state: crosshair open. Tag: manual, the verifier reads `shoot` and `busy` in `src/main.ts`.
- [ ] **F133** (A13 snap-c5c L5) When the menu bar menu closes, ⌃⇧5 shall open the capture options again, even if the close event never came. Screen/state: menu bar menu. Tag: manual, the verifier reads `popUp` in `src/main.ts`.
- [ ] **F134** (A13 snap-c5c L6) When the owner copies with ⇧⌘C, the Copy Image item or one-shot ⌘↵, the selected marks shall stay selected. This is as with ⌘C. Screen/state: editor, marks selected. Tag: smoke `r['F134 every copy keeps the selection']`.

<details>
<summary>Verification</summary>

- F120: smoke reads the scroll control's `#done` computed background `rgb(15, 114, 219)`.
- F121: `test/menu.test.ts` checks four messages.
  - `quitMessage(0, 1)`: "1 image is not copied or saved yet."
  - `quitMessage(0, 2)`: "2 images …"
  - `quitMessage(1, 2)`: "3 screenshots are not saved yet."
  - `quitMessage(2, 0)`: as today.
- F122: `test/uuid.test.ts` builds a minimal 64-bit Mach-O buffer with one LC_UUID and runs `setUuid(buf, 'com.cdudek.snapmark', 'arm64')`. The UUID changes, is the same on a second run, differs for x64, and the rest of the buffer is unchanged. A fat (universal) buffer throws. At the milestone, `npm run dist` then `dwarfdump --uuid` differs between `release/mac-arm64/Snapmark.app/Contents/MacOS/Snapmark` and `node_modules/electron/dist/Electron.app/Contents/MacOS/Electron`, and `codesign --verify --deep --strict` exits 0.
- F132: the verifier reads `shoot`. A `shooting` flag is set before `execFile('screencapture', …)` and cleared in its callback, and `busy()` reads it.
- F133: the verifier reads `popUp`. `menuOpen = false` follows `tray.popUpContextMenu(menu)`, which returns when the menu closes on macOS.
- F134: smoke selects two marks and presses ⇧⌘C; `canvas.getActiveObjects().length` is 2 afterwards. Same for the menu's Copy Image action and one-shot ⌘↵.

</details>

## Milestone 2 — Capture bar, Settings window, Keyboard Shortcuts window

The system is Snapmark. Every word is in [spec.md](spec.md) (Words tables and tabs); copy them exactly. Unit facts are plain-Node assert blocks in `test/*.test.ts`, one block per fact, its comment starting with the fact id. Smoke checks in `test/smoke.ts` are keyed strings in the `viewer` record, starting with the fact id. CI runs smoke headless on Linux (xvfb) on every PR, and on macOS in the release workflow; never locally. What neither can check is named per fact and in spec.md "What CI can and cannot check".

### Capture bar

- [ ] **F201** (A5) When the owner presses ⌃⇧5 or picks Capture Options… in the menu bar menu, the system shall show the capture bar. It sits centred at the bottom of the display with the pointer. Screen/state: capture bar, opened. Tag: smoke `viewer['F201 the capture bar opens bottom-centre on the pointer's display']`; `test/keys.test.ts` › "F201 ⌃⇧5 opens the bar".
- [ ] **F202** (A5) The capture bar shall hold, left to right: Close, Capture Window, Choose New Area, Capture Last Area, Capture Scrolling, Options, Capture. Screen/state: capture bar. Tag: `test/capture.test.ts` › "F202 bar order"; smoke `viewer['F202 the bar shows its seven controls in order']`.
- [ ] **F203** (A5) Every control in the bar shall have the name in spec.md. The four modes shall be one radio group that says which mode is chosen. Screen/state: capture bar, VoiceOver. Tag: smoke `viewer['F203 every bar control is named; the modes are a radio group']`. Speech itself: owner at the milestone.
- [ ] **F204** (A5) While the bar is open, ← and → shall move between modes, ↩ shall capture, and Esc shall close the bar. In the open bar, Tab shall move between Close, the chosen mode, Options and Capture. Screen/state: capture bar, keyboard. Tag: smoke `viewer['F204 arrows pick, Return captures, Esc closes']`.
- [ ] **F205** (A5) When the owner captures from the bar, the system shall close the bar before the capture starts. Screen/state: capture bar → capture. Tag: smoke `viewer['F205 the bar is gone when the capture starts']`.
- [ ] **F206** (A5) If a capture is running, then ⌃⇧5 shall do nothing. While the bar is open, ⌃⇧5 shall bring it forward and never open a second one, and ⌃⇧4 and ⌃⇧3 shall do nothing. Screen/state: capture bar, busy. Tag: smoke `viewer['F206 one bar at a time']`; manual, verifier reads `busy()` in `src/main.ts`.
- [ ] **F207** (A5) The bar shall open on the mode, Save to, Timer and Show Mouse Pointer last used. The first time, it shall open on Choose New Area, Current Session, None and off. Screen/state: capture bar, reopened. Tag: smoke `viewer['F207 the bar remembers the last mode']`.
- [ ] **F208** (A5) The bar shall float above every window on every Space, full-screen apps included. Screen/state: capture bar over a full-screen app. Tag: smoke `viewer['F208 the bar is on top on every Space']` (`isAlwaysOnTop()`, `isVisibleOnAllWorkspaces()`). Over a full-screen app without a Space switch, and the owner's app keeping focus: owner at the milestone.
- [ ] **F209** (A5) The bar shall use the system's translucent material and follow light and dark mode. Screen/state: capture bar, light and dark. Tag: manual, verifier reads `vibrancy: 'popover'` in `openCaptureBar`; owner at the milestone. Linux has no vibrancy.
- [ ] **F210** (A5) Each mode shall capture as its menu item did. That is: Capture Window as Capture Window…, Choose New Area as Choose New Area…, Capture Last Area as ⌃⇧3, Capture Scrolling as Capture Scrolling…. Screen/state: each mode. Tag: `test/capture.test.ts` › "F210 screencapture arguments".
- [ ] **F211** (A5) The Options button shall open a native menu with Save to, Timer and Show Mouse Pointer, the current choices checked. Save to holds Current Session, One-Shot and New Session; Timer holds None, 5 Seconds and 10 Seconds. Screen/state: Options menu. Tag: `test/capture.test.ts` › "F211 Options menu".
- [ ] **F212** (A5) Where Save to is One-Shot, a capture from the bar shall open in one-shot mode, never in a session. The Capture button shall read "Capture One-Shot". Screen/state: capture bar, One-Shot; editor, one-shot. Tag: `test/capture.test.ts` › "F212 Capture One-Shot"; smoke `viewer['F212 a one-shot scrolling capture opens in one-shot mode']`.
- [ ] **F213** (A5) When the owner picks New Session in Options, the system shall start a new session as ⌃⇧N does, and keep the bar open. Screen/state: Options menu, New Session. Tag: `test/capture.test.ts` › "F213 New Session".
- [ ] **F214** (A5) Where a Timer is set, the system shall wait that many seconds after the area is known. It shall show the seconds left beside the menu bar icon. When the owner presses Esc, it shall capture nothing. Screen/state: menu bar icon, counting. Tag: manual, verifier reads `runCapture` in `src/main.ts`. No tray in smoke.
- [ ] **F215** (A5) Where Show Mouse Pointer is on, the system shall capture the pointer in Choose New Area and Capture Last Area (`screencapture -C`). Screen/state: area capture. Tag: `test/capture.test.ts` › "F215 pointer".
- [ ] **F216** (A5) While the mode is Capture Window or Capture Scrolling, the system shall grey Timer and Show Mouse Pointer, with the words in spec.md. Screen/state: Options menu, window and scrolling. Tag: `test/capture.test.ts` › "F216 areas only".
- [ ] **F217** (A5) The bar's options shall apply only to captures from the bar. ⌃⇧4, ⌃⇧3 and ⌃⇧N shall keep their keys and do what they do today. Screen/state: global keys. Tag: `test/keys.test.ts` › "F217 keys unchanged".
- [ ] **F218** (A5) The menu bar menu shall show "Capture Options…" with ⌃⇧5 beside it in place of the Capture Options submenu. It shall say "(shortcut unavailable)" when another app has ⌃⇧5. Screen/state: menu bar menu. Tag: `test/menu.test.ts` › "F218 Capture Options…".
- [ ] **N201** (A5) The system shall show the bar within 1 second of being asked. Tag: smoke `viewer['N201 the bar shows within 1 s']` (prints the milliseconds).

<details>
<summary>Scenario — F205, where the bar could end up in the picture</summary>

```gherkin
Scenario: the bar is never in the screenshot — proves F205
  Given the capture bar is open on Capture Last Area
  When  the owner presses Return
  Then  the bar window is closed
  And   only then does the mode run
```

</details>

<details>
<summary>Verification</summary>

- F201 — smoke: `openCaptureBar()`; its bounds are centred on `workArea` of the display under the pointer (±1 pt). The bottom edge is 24 pt above the work area's bottom. Unit: `main.ts` registers `SHORTCUTS.options` with `openCaptureBar`, and `popOptions` is gone.
- F202 — unit: `MODES` ids are `window, area, last, scroll`. Smoke: the bar's focusable controls' `aria-label`s, in DOM order, are the seven names.
- F203 — smoke: every `button` and `[role=radio]` has a non-empty `aria-label`. The modes sit in `[role=radiogroup]`, exactly one `aria-checked="true"`; the window's accessible name is "Capture Options".
- F204 — smoke: `sendInputEvent` → moves `aria-checked`, Tab order, Return calls the swapped runner, Esc closes the window without calling it.
- F205 — smoke: `openCaptureBar(run)` with a runner that records whether a window loading `bar.html` still exists when it is called; it must not.
- F206 — smoke: two `openCaptureBar()` calls give one bar window. Manual: `busy()` includes the bar and the countdown.
- F207 — smoke: after a run on Capture Last Area, a new bar opens with Capture Last Area checked. With no `capture` in state, Choose New Area.
- F208 — smoke on both runners: `isAlwaysOnTop()` and `isVisibleOnAllWorkspaces()` are true.
- F209 — manual, as tagged.
- F210 — unit: `captureArgs('window', …)` is `['-i','-w','-o']`; `area` and `last` are `['-R','x,y,w,h']`; `scroll` uses the picker, no arguments.
- F211 — unit: `barOptions(state, a)` labels and types (header, radio, checkbox) as in spec.md; `checked` follows the state; clicks call the actions.
- F212 — unit: `barLabel({ oneShot: true })` is "Capture One-Shot", else "Capture". Smoke: `scrollCapture(area, fakeGrab, { oneShot: true })` opens an editor whose `editor:init` has `oneShot: true`.
- F213 — unit: the New Session item calls `a.newSession` and has no `close` side effect.
- F214 — manual: the verifier reads `runCapture`: `tray.setTitle` per second, `globalShortcut.register('Escape', …)` only while counting, unregistered in `finally`.
- F215 — unit: `captureArgs('area', { pointer: true }, a)` contains `-C`; `'window'` never does.
- F216 — unit: in `barOptions` for `window` and `scroll`, the Timer radios and the checkbox have `enabled: false`. The header reads "Timer (areas only)" and the checkbox's sublabel "Areas only".
- F217 — unit: `SHORTCUTS` values unchanged; `main.ts` still registers `[SHORTCUTS.capture, capture]` and `[SHORTCUTS.area, …captureArea()]`; `shoot(['-i'])` unchanged.
- F218 — unit: the row's label, `accelerator: 'Control+Shift+5'`, no `submenu`; with `options: null`, "Capture Options… (shortcut unavailable)"; click calls `captureBar`.
- N201 — smoke: time from `openCaptureBar()` to `ready-to-show`, under 1000 ms.

</details>

### Settings window

- [ ] **F219** (A6) When the owner picks Settings… in the menu bar menu or presses ⌘, in any Snapmark window, Snapmark shall open the Settings window. If it is already open, the system shall bring it forward. Screen/state: Settings window. Tag: `test/menu.test.ts` › "F219 Settings… and ⌘,"; smoke `viewer['F219 one Settings window']`.
- [ ] **F220** (A6) The Settings window shall show the tabs General, Capture and Shortcuts as a toolbar. It shall title itself after the tab shown and open on the tab last shown. Screen/state: Settings, each tab. Tag: smoke `viewer['F220 three tabs; the title names the tab']`.
- [ ] **F221** (A6) General shall hold Open Snapmark at login, Sessions folder with Change…, Clear Sessions Older Than 60 Days… and Check for Updates…. The version shows beside Check for Updates…, and each shall do what its Settings submenu item did. Screen/state: Settings, General. Tag: smoke `viewer['F221 General holds the four settings']`; manual, verifier reads the `settings:run` mapping in `src/main.ts`.
- [ ] **F222** (A6) While Open at Login waits for approval, General shall say so and offer Open Login Items Settings. In a development build, Open at Login and Check for Updates… shall be greyed with a note. The note reads "Only in the installed app." Screen/state: Settings, General, approval and development. Tag: `test/menu.test.ts` › existing `loginState` blocks; smoke `viewer['F222 a development build greys login and updates']`. Approval: verifier and owner.
- [ ] **F223** (A6) Capture shall show Save to, Timer and Show mouse pointer, the same settings as the bar's Options menu. Screen/state: Settings, Capture. Tag: smoke `viewer['F223 Capture tab and bar share their options']`.
- [ ] **F224** (A6) Shortcuts shall hold Pick tools with single keys, the four global keys and Show All Shortcuts. Any global key not registered shall show "Taken by another app". Screen/state: Settings, Shortcuts. Tag: smoke `viewer['F224 Shortcuts tab lists the keys']`.
- [ ] **F225** (A6) When the owner turns Pick tools with single keys off, every open and new editor shall stop picking tools with plain keys. This works as Single-Key Tools did. Screen/state: Settings, Shortcuts; editor. Tag: smoke `viewer['F225 single keys off reaches the editor']`.
- [ ] **F226** (A6) The menu bar menu shall show one row "Settings…" with ⌘, beside it and no Settings submenu. Screen/state: menu bar menu. Tag: `test/menu.test.ts` › "F226 Settings…".
- [ ] **F227** (A6) When the Settings window comes forward, it shall show the current settings, including a change made in the bar or System Settings. Screen/state: Settings, refocused. Tag: manual, verifier reads the `focus` listener in `src/settings.ts`.
- [ ] **F228** (A6) Every Settings control shall have a label VoiceOver reads and be reached with Tab; ← and → shall move between tabs. Screen/state: Settings, keyboard. Tag: smoke `viewer['F228 Settings controls are labelled and reachable']`.

<details>
<summary>Verification</summary>

- F219 — unit: `menuTemplate` row "Settings…", `accelerator: 'Command+,'`, click calls `settings`. `appMenu(a)` has "Settings…" with `Command+,` under the Snapmark menu, and keeps the `fileMenu`, `editMenu`, `viewMenu`, `windowMenu` roles. Smoke: two `openSettings()` calls give one window.
- F220 — smoke: `[role=tab]` labels are General, Capture, Shortcuts; clicking Capture sets `getTitle()` to "Capture"; a new window opens on Capture.
- F221 — smoke: the General tab's labelled controls are the four in spec.md, with "Snapmark <version>". Manual: `chooseRoot`, `clearOld`, `checkUpdates` call `chooseRoot()`, `clearOldSessions()`, `checkForUpdatesNow()`.
- F222 — unit: today's `loginState` blocks stay. Smoke (unpackaged, so a development build): the login checkbox and Check for Updates… are disabled and the note reads "Only in the installed app."
- F223 — smoke: choose One-Shot in Capture, open the bar: its Capture button reads "Capture One-Shot".
- F224 — smoke: four rows ⌃⇧4, ⌃⇧3, ⌃⇧5, ⌃⇧N. In quiet mode no key is registered, so each says "Taken by another app". Show All Shortcuts opens the Keyboard Shortcuts window.
- F225 — smoke: clicking the checkbox off, then `openEditor`: `editor:init` gives `singleKeys: false`.
- F226 — unit: no item has a `submenu` labelled Settings; the menu's labels end `…, 'Settings…', 'Quit Snapmark'`.
- F227 — manual, as tagged.
- F228 — smoke: every `input`, `select` and `button` has a `label` or `aria-label`; ArrowRight on the tab list moves `aria-selected`.

</details>

### Keyboard Shortcuts window

- [ ] **F229** (A7) The system shall load the Keyboard Shortcuts window from `src/shortcuts.html`, never from a `data:` URL. Screen/state: Keyboard Shortcuts window. Tag: `test/keys.test.ts` › "F229 no data URL"; smoke `viewer['F229 Keyboard Shortcuts is its own page']`.
- [ ] **F230** (A7) The window shall show two columns, as in the round-1 mock: Other keys on the left and Editor tools on the right. Other keys are grouped by where they work. Each tool shows its key, icon, name and what it does. Screen/state: Keyboard Shortcuts, 980 pt wide. Tag: smoke `viewer['F230 two columns as in the round-1 mock']`.
- [ ] **F231** (A7) Every key shall show as a keycap. Screen/state: Keyboard Shortcuts. Tag: smoke `viewer['F231 every key is a keycap']`.
- [ ] **F232** (A7) The window shall list every row of `KEY_GROUPS` and every tool in `tools.ts`, and no other row. Screen/state: Keyboard Shortcuts. Tag: smoke `viewer['F232 every key and tool listed once']`.
- [ ] **F233** (A7) When the owner presses ⌘/ in any Snapmark window or picks Show All Shortcuts in Settings, the system shall open the window. If it is already open, the system shall bring it forward. Screen/state: Keyboard Shortcuts, from editor, session window, Settings. Tag: `test/menu.test.ts` › "F233 ⌘/"; smoke `viewer['F233 one Keyboard Shortcuts window']`.
- [ ] **F234** (A7) When the owner presses Esc in the Keyboard Shortcuts window, the system shall close it. Screen/state: Keyboard Shortcuts, Esc. Tag: smoke `viewer['F234 Esc closes Keyboard Shortcuts']`.
- [ ] **F235** (A7) The window shall follow light and dark mode. Screen/state: Keyboard Shortcuts, dark. Tag: smoke `viewer['F235 Keyboard Shortcuts turns dark']`.
- [ ] **F236** (A5, A7) `KEY_GROUPS` shall hold the groups Anywhere, Capture bar, Snapmark windows, Editor and Session window, with the rows in spec.md. Screen/state: Keyboard Shortcuts. Tag: `test/keys.test.ts` › "F236 key groups".

<details>
<summary>Verification</summary>

- F229 — unit: `main.ts` contains no `data:text/html` and loads `shortcuts.html`. Smoke: the window's URL ends with `shortcuts.html`; its title is "Keyboard Shortcuts".
- F230 — smoke at 980 × 680: the "Other keys" and "Editor tools" sections share a top edge (±2 px). Editor tools sits to the right, and each tool row holds an `svg`.
- F231 — smoke: every key cell is a `kbd` with a border wider than 0 and a radius above 0.
- F232 — smoke: the number of key rows equals the `KEY_GROUPS` rows plus the tools; every name appears once.
- F233 — unit: `appMenu(a)` has "Keyboard Shortcuts" with `Command+/`, click calls `keyboardShortcuts`. Smoke: two `showShortcuts()` calls give one window.
- F234 — smoke: `sendInputEvent` Escape; the window is destroyed.
- F235 — smoke: `nativeTheme.themeSource = 'dark'`; the body's background luminance is below 0.2; back to `'system'` after.
- F236 — unit: the titles and keys, in order; every row has three fields.

</details>

### Verification, milestone 2

- **Automated:** `npm run format && npm run lint && npm run typecheck && npm test` exits 0. CI runs `npm run smoke` on every PR under xvfb on Linux; the release workflow runs it on macOS. The milestone runs `npm run smoke:background` once.
- **Manual, owner at the milestone:**
  - ⌃⇧5 over a full-screen browser opens the bar there without a Space switch, and the browser keeps focus.
  - The bar is translucent in light and dark mode.
  - VoiceOver reads each control.
  - A 5-second timer counts in the menu bar, and Esc cancels it.
  - Show Mouse Pointer puts the pointer in a Capture Last Area shot.
  - ⌘, and ⌘/ work in the editor and in the Document tab.

## Milestone 3 — Tall captures as tiles

The system is Snapmark. "Tall", "part", "parts line" and "one image" are defined in [spec/ia.md](spec/ia.md); the decision is in the [ADR](../../docs/designs/2026-10-25-adr-tall-screenshots-saved-as-parts.md). Every word is in [spec/microcopy.md](spec/microcopy.md). Unit facts are plain-Node assert blocks in `test/*.test.ts`, one block per fact. Smoke checks in `test/smoke.ts` are keyed strings; CI runs them headless on every PR, never locally.

### Parts for the agent

- [ ] **F1** (A1, A4) When the owner adds a tall screenshot, the system shall save its parts as `img/NNN/01.png` onward, linked in order. Screen/state: `session.md` entry, tall. Tag: `test/sessions.test.ts` › "F1 tall entry".
- [ ] **F2** (A1, A2) The system shall make every part the screenshot's width, at most 1280 px, within 1568 px and 1,150,000 pixels. Screen/state: `session.md` entry, tall. Tag: `test/parts.test.ts` › "F2 part size".
- [ ] **F3** (A1, A4) The system shall treat a screenshot as tall only when fitting it whole leaves it narrower than two-thirds of its part width. Screen/state: `session.md` entry, fits and tall. Tag: `test/parts.test.ts` › "F3 tall rule".
- [ ] **F4** (A1) Each part after the first shall begin max(40 px, part width ÷ 10) above the end of the part before. Screen/state: `session.md` entry, tall. Tag: `test/parts.test.ts` › "F4 overlap".
- [ ] **F5** (A1, A3) The overlap shall be taller than a numbered diamond, so every diamond shows whole in at least one part. Screen/state: `session.md` entry, tall. Tag: `test/parts.test.ts` › "F5 diamond whole".
- [ ] **F6** (A1) A tall entry shall show the parts line, naming its number of parts, before the first part. Screen/state: `session.md` entry, tall. Tag: `test/sessions.test.ts` › "F6 parts line".
- [ ] **F7** (A1) Each part's alt text shall read "Screenshot 7, part 1 of 11", with that entry's number and count. Screen/state: `session.md` entry, tall. Tag: `test/sessions.test.ts` › "F7 alt text".
- [ ] **F8** (A3) The system shall write a tall entry's comment, notes, cards and recognised text once, after the last part. Screen/state: `session.md` entry, tall and tall with no text. Tag: `test/sessions.test.ts` › "F8 text once".
- [ ] **F9** (A1, A3) The system shall cut parts from the flattened image, so Redact marks and auto-redact reach every part. Screen/state: `session.md` entry, tall. Tag: manual, verifier reads `editor:save` in `src/main.ts`.
- [ ] **F10** (A1, A2) When the owner saves a 1280 × 8000 capture, every image its entry links shall be at least 1000 px wide. Screen/state: `session.md` entry, tall. Tag: smoke `viewer['F10 a saved 1280×8000 capture links parts at least 1000 px wide']` and `test/parts.test.ts` › "F10 1280×8000".
- [ ] **F11** (A1, A3) While a screenshot is not tall, the system shall save its image and entry as today, byte for byte. Screen/state: `session.md` entry, fits. Tag: `test/sessions.test.ts` › "F11 fits unchanged".
- [ ] **N1** (A1) The system shall scale and cut a 2560 × 20 000 capture in under 1 second. Tag: smoke `viewer['N1 a 2560×20000 capture is cut in under 1 s']`.
- [ ] **N2** (A1) The system shall never make more than 99 parts of one screenshot. Tag: `test/parts.test.ts` › "N2 at most 99 parts".

<details>
<summary>Scenario — F3, where a normal screenshot must stay whole</summary>

```gherkin
Scenario: the two-thirds rule — proves F3
  Given a 2560 × 4000 screenshot, which fits whole at 858 px wide
  And   a 2160 × 3840 screenshot, which fits whole at 804 px wide
  When  each is added to a session
  Then  the first is saved whole, because 858 ≥ 853 (two-thirds of 1280)
  And   the second is saved in 3 parts
```

</details>

<details>
<summary>Verification</summary>

- F1 — `test/sessions.test.ts`: `addShot` with 11 part buffers writes `img/007/01.png` to `img/007/11.png`; the entry links them in that order, one paragraph each.
- F2 — `test/parts.test.ts`: for every row of the spec/ia.md tables, `partWidth` ≤ 1280, part height ≤ 1568 and `partWidth × height` ≤ 1,150,000.
- F3 — `test/parts.test.ts`: every row of the two spec/ia.md tables; the scenario above.
- F4 — `test/parts.test.ts`: overlap 128 at 1280, 60 at 600, 40 at 300; parts one height; the last ends at the bottom edge.
- F5 — `test/parts.test.ts`: for capture widths 200 to 5120 px, the overlap beats `16 × unit` at the part width (`unit` from `src/editor.ts`).
- F6 — `test/sessions.test.ts`: the paragraph after the heading is the spec/microcopy.md parts line with "11"; with 2 parts it says "2".
- F7 — `test/sessions.test.ts`: alt texts read "Screenshot 7, part 1 of 11" to "Screenshot 7, part 11 of 11".
- F8 — `test/sessions.test.ts`: caption, notes, cards and "Text in the screenshot" each appear once, after the last part; `entries()` counts the notes only.
- F9 — manual: the verifier reads `editor:save`; parts come from the saved one image, which is the flattened PNG.
- F10 — smoke: a 1280 × 8000 PNG saved with ⌘S into its own session. Its entry links 11 images, each at least 1000 px wide. Unit: the layout of 1280 × 8000 is 11 parts of 1280 × 844.
- F11 — `test/sessions.test.ts`: `addShot` without parts writes today's entry exactly. Smoke keeps 'small image untouched' and 'large image shrunk'.
- N1 — smoke: `fitForAI` and `cutParts` on a 2560 × 20 000 PNG; the check prints the milliseconds.
- N2 — `test/parts.test.ts`: the layout of 1280 × `MAX_HEIGHT` has 26 parts; any layout with more than 99 throws.

</details>

### One screenshot

- [ ] **F12** (A3) The menu count and the editor label shall count a tall screenshot once. Screen/state: menu header, editor toolbar. Tag: `test/sessions.test.ts` › "F12 counted once".
- [ ] **F13** (A3) The system shall never give a tall screenshot's number to a new screenshot. Screen/state: `session.md`, numbering. Tag: `test/sessions.test.ts` › "F13 number kept".
- [ ] **F14** (A3) The system shall save a tall screenshot's one image as the whole page at the part width. Screen/state: Screenshots tab, large view, Discarded tab. Tag: smoke `viewer['F14 the one image is the whole page at 1280 px']`.
- [ ] **F15** (A3) When Edit Again saves a tall screenshot, the system shall replace its parts and entry, keeping none of the old parts. Screen/state: editor, Save changes. Tag: `test/sessions.test.ts` › "F15 Edit Again".
- [ ] **F16** (A3) If writing a part fails, then the system shall leave `session.md`, the one image and any old parts unchanged. Screen/state: editor, failed save. Tag: `test/sessions.test.ts` › "F16 failed write".
- [ ] **F17** (A3) When Edit Again saves an entry made before this change and now tall, the system shall write it with parts. Screen/state: editor, Save changes. Tag: `test/sessions.test.ts` › "F17 old entry".
- [ ] **F18** (A3) When the owner removes a tall screenshot, the system shall move its parts to Discarded with it. Screen/state: Screenshots tab, removed. Tag: `test/sessions.test.ts` › "F18 remove".
- [ ] **F19** (A3) When the owner reopens a tall screenshot under a new number, the system shall renumber every part file, link and alt text. Screen/state: Discarded tab, Reopen. Tag: `test/sessions.test.ts` › "F19 reopen renumbers".
- [ ] **F20** (A3) If the owner picks a removed screenshot's `parts` folder in Reopen Discarded…, then the system shall reopen that screenshot. Screen/state: Reopen Discarded… panel. Tag: manual, verifier reads `reopenDiscarded` in `src/main.ts`.
- [ ] **F21** (A3) When Edit Again saves a tall screenshot, the Document tab shall show the new parts, never cached old ones. Screen/state: Document tab, after Edit Again. Tag: manual, verifier reads the viewer's reload path.
- [ ] **F22** (A3) The PDF export shall show a tall screenshot as its one image, without its parts or the parts line. Screen/state: PDF export, tall and edited. Tag: `test/exporter.test.ts` › "F22 PDF one image".
- [ ] **F23** (A3) The ZIP export shall hold `session.md`, the one image and every part. Screen/state: ZIP export. Tag: `test/exporter.test.ts` › "F23 ZIP parts".
- [ ] **F24** (A3) In session mode, Save As… and Copy Image shall give the one image, not the parts. Screen/state: editor, session mode. Tag: manual, verifier reads `outImage` in `src/main.ts`.
- [ ] **F25** (A3) While the owner types in the Document tab, the system shall keep every part link as written. Screen/state: Document tab, typing. Tag: smoke `viewer['F25 typing keeps the part links']`.

<details>
<summary>Scenario — F19, where a renumbered part could keep its old path</summary>

```gherkin
Scenario: a tall screenshot comes back under a new number — proves F19
  Given entry 7 has 11 parts and was removed
  And   a new screenshot took number 7
  When  the owner reopens the removed screenshot
  Then  it comes back as entry 12 with parts img/012/01.png to img/012/11.png
  And   its alt texts read "Screenshot 12, part 1 of 11" to "Screenshot 12, part 11 of 11"
```

</details>

<details>
<summary>Verification</summary>

- F12 — `test/sessions.test.ts`: a session with one fitting and one tall screenshot has `count()` 2.
- F13 — `test/sessions.test.ts`: with `img/007.png` deleted and `img/007/` kept, the next number is 8.
- F14 — smoke: after the F10 save, `img/NNN.png` is 1280 × 8000.
- F15 — `test/sessions.test.ts`: `replaceShot` with 3 new parts over 11 old ones leaves exactly `01.png` to `03.png`, the entry links 3, and no `img/007.new/` stays.
- F16 — `test/sessions.test.ts`: for `addShot` and `replaceShot`, a failed part write leaves `session.md`, `img/007.png` and the old parts byte for byte. No new part file stays.
- F17 — `test/sessions.test.ts`: an entry with only the one-image link gets the parts line and parts after `replaceShot` with parts.
- F18 — `test/sessions.test.ts`: after `removeShot`, `img/007/` is gone and the Discarded folder holds `parts/01.png` onward.
- F19 — `test/sessions.test.ts`: the scenario above; reopened under its own number, the paths stay; a leftover `img/007/` alone counts as taken.
- F20 — manual: the verifier reads `reopenDiscarded`; a pick named `parts` resolves to its parent folder.
- F21 — manual: the verifier reads `load()` in `src/viewer.ts`; the image cache is cleared before the Document tab mounts again.
- F22 — `test/exporter.test.ts`: `sessionHtml` of a tall entry has one image tag, for `img/001.png`, none for `img/001/`, and no parts line. The same holds after a hand edit.
- F23 — `test/exporter.test.ts`: the ZIP listing holds `img/001.png` and `img/001/01.png` onward.
- F24 — manual: the verifier reads `outImage`; session mode returns `fitForAI`, the one image.
- F25 — smoke: in the F10 session's window, typing at the end of the Document tab keeps all 11 part links in `session.md`.

</details>

## Milestone 4 — Electron 45 and dependency updates

Dependency changes are Ask-tier in this repo. The owner's plan approval is the ask for exactly the packages named here; the milestone PR carries the `ask` label. No package is added or removed.

- [ ] **F401** (A13 snap-p7t) The app shall build, pass its unit tests and pass the smoke suite on Electron 45. Screen/state: every window, smoke. Tag: CI `smoke` on the milestone PR and `npm run smoke:background` once.
- [ ] **F402** (A13 snap-p7t) The test runner shall be vitest 5, with every existing test passing unchanged. Tag: `npm test`.
- [ ] **F403** (A13 snap-p7t) The updates of Dependabot #63 and of the open Dependabot PRs #70, #71, #72, #73 shall be in `package.json` and the lockfile. From #63, these are the minor and patch updates of electron-updater, marked, @milkdown/kit, @types/node, electron-builder, eslint, prettier and typescript-eslint. Those PRs shall be closed as included. Tag: `npm ls electron-updater marked @milkdown/kit electron-builder eslint prettier typescript-eslint dompurify fast-uri undici` prints the target versions. `gh pr list --author app/dependabot --state open` lists none of them.
- [ ] **F404** (A13 snap-p7t) `npm audit --omit=dev` shall report no high or critical advisory. Tag: `npm audit --omit=dev --audit-level=high` exits 0.
- [ ] **F405** (A12) The release built from this milestone shall be signed and pass Gatekeeper, as today. Tag: the Release workflow on `main` succeeds; `codesign --verify --deep --strict` and `spctl --assess` on the downloaded ZIP's app, run by the install step.

<details>
<summary>Verification</summary>

- F401 — CI on the milestone PR (Linux xvfb smoke) and the Release workflow (macOS smoke); locally `npm run smoke:background` once.
- F402 — `npm test` exits 0; `npx vitest --version` prints 5.
- F403 — the `npm ls` line above; Dependabot PRs closed with a comment naming the milestone PR.
- F404 — the audit command above.
- F405 — the install script's signature and Gatekeeper lines.

</details>

## Verification

- **Automated, per milestone:** `python3 scripts/verify_gate.py milestone 2026-10-25-finish-app` runs format, lint, typecheck, unit tests and `smoke:background`. CI runs smoke on the milestone PR, and the Release workflow runs it on macOS.
- **Validation, per milestone:** every fact and ask of the milestone gets a row in [validation.md](validation.md): expected, observed, evidence, verdict.
- **Manual, per milestone:** the checks CI cannot make (vibrancy, the panel window, full-screen Spaces, VoiceOver, the local network prompt). The owner does them on the installed release, and they are quoted in `validation.md`.

## Out of scope

- Licensing, payment, trial and the App Store (snap-bmr.7, snap-bmr.8, snap-bmr.13).
- An on-screen text tool (A11).

Milestone 2:

- Video recording, Entire Screen, a Clipboard target, a beautify option in the bar.
- The bar's options for ⌃⇧4 and ⌃⇧3.
- Changing global keys; taking macOS's own ⇧⌘3/4/5.
- A Licence tab.
- Removing the stock File, Edit and View items.
- A Keyboard Shortcuts row in the menu bar menu.

Milestone 3:

- A tiled clipboard: Copy Image gives the one image, since the macOS clipboard holds one image.
- A setting for part width or for turning parts off.
- A scrolling, readable large view of a tall screenshot in the session window.
- Parts in the Screenshots tab, the PDF or Discarded, and a number per part.
- Rewriting entries saved before this change, other than through Edit Again (F17).
- A message when a save fails (F049, validation L23.2): an existing gap, kept as today.
- The interaction guideline and glossary row for "part": the next `omr-ux:guidelines` round.
- Copy Prompt for AI: unchanged, because the parts line explains the parts in `session.md` itself.

## Open questions

Non-blocking, each with its default: [questions.md](questions.md).
