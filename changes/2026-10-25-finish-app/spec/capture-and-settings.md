# Spec: capture bar, Settings window, Keyboard Shortcuts window

> ⌃⇧5 opens a capture bar at the bottom of the screen, like macOS's ⇧⌘5. Settings becomes a window with three tabs. The Keyboard Shortcuts window gets the round-1 look, in its own file.

Facts are in [facts.md](../facts.md), build rows in [plan.md](../plan.md). Every word on screen is in the Words tables below; copy them exactly.

## Asks

| #   | Date       | Source                                                                                                                          | Words                                                       | Screen                    |
| --- | ---------- | ------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | ------------------------- |
| A5  | 2026-10-25 | owner, chat, with `asks/2026-10-25-chat/current-capture-menu.png`, `macos-capture-bar.png` and `macos-capture-bar-options.png`  | "Can we have it more like this, with a menu on the screen?" | capture bar               |
| A6  | 2026-10-25 | owner, chat                                                                                                                     | "...so we can have proper settings and everything."         | Settings window           |
| A7  | 2026-10-25 | owner, chat; round-1 design `design-explorations/2026-10-24-brand-refresh/brief.md` and `01-native/shots/shortcuts--window.png` | "I want the proper UI that we were promised"                | Keyboard Shortcuts window |

The image paths are written as code, not as Markdown image links, so `tests/sdlc.test.ts` does not read them as missing files.

## As built (what changes)

- ⌃⇧5 pops the Capture Options items as a menu at the menu bar icon: `popOptions()` in `src/main.ts:756-759`, items from `captureOptions()` in `src/menu.ts:80-91`.
- The menu bar menu's Capture Options row is a submenu with the same four items, `⌃⇧5` as its sublabel (`src/menu.ts:116-121`).
- Settings is a submenu: Open at Login, Sessions Folder…, Clear Sessions Older Than 60 Days…, Keyboard Shortcuts, Single-Key Tools, Check for Updates… (`src/menu.ts:171-196`).
- The Keyboard Shortcuts window is HTML built in a string and loaded as a `data:` URL, 520 × 640, titled "Keyboard shortcuts", Esc does nothing (`src/main.ts:825-849`, data URL at `:840-847`).
- No app menu is set, so Electron's stock menus show while an editor or session window is in front; there is no Settings… ⌘, (`docs/ux/sitemap.md:73-74`).
- Captures: `shoot()` runs `screencapture` (`src/main.ts:177-183`); Capture Screenshot is `-i`, One-Shot `-i` into a one-shot editor, Capture Window `-i -w -o` (`:190-196`); Capture Last Area and Choose New Area use Snapmark's own picker, then `-R` (`:200-256`); Capture Scrolling grabs `-R` frames and stitches (`:260-343`).
- One capture at a time: `busy()` is `picking || scrolling` (`src/main.ts:185-188`).
- Global keys: `SHORTCUTS` in `src/keys.ts:5-10`; registered in `src/main.ts:902-910`.

## Decisions

1. **⌃⇧5 opens the capture bar.** It replaces the popup menu, as macOS's ⇧⌘5 opens its bar. No new key; ⌃⇧4, ⌃⇧3 and ⌃⇧N do exactly what they do today. This amends the ADR "Keys follow macOS" (its line "⌃⇧5 shows the capture options as a menu").
2. **The menu bar menu's Capture Options row opens the bar.** It becomes "Capture Options…" with ⌃⇧5 beside it, and loses its submenu. Choose New Area…, Capture Window…, Capture Scrolling… and One-Shot Capture… live in the bar. One way in, one place.
3. **Buttons choose what to capture; Options choose where it goes and how.** This is macOS's split. One-Shot moves from a menu item to Options ▸ Save to, so a window or a scrolling capture can be a one-shot too. The Capture button says "Capture One-Shot" while One-Shot is chosen, so the choice is never hidden.
4. **Options apply only to captures from the bar.** ⌃⇧4 and ⌃⇧3 keep working as today, so a one-shot left on never steals a session capture.
5. **Timer and Show Mouse Pointer work for areas only.** `screencapture -C` draws the pointer only in non-interactive modes (`man screencapture`), and a timer needs the area known first. Snapmark's own picker gives `-R`, so Choose New Area and Capture Last Area support both; Capture Window (`-i -w`) and Capture Scrolling (many frames) do not, and grey them.
6. **No recording, no Entire Screen, no Clipboard target.** Snapmark records no video. Entire Screen and "clipboard, no editor" were not asked for; macOS's own ⇧⌘3 and ⌃⇧⌘4 already do them. See Questions.
7. **Settings is a window with General, Capture and Shortcuts tabs.** Every Settings submenu item moves in. The menu keeps one row, "Settings…". Licence is out.
8. **Keyboard Shortcuts stays its own window, in its own file `src/shortcuts.html`.** Not folded into the Shortcuts tab. Why:
   - It is a reference sheet you keep open beside the editor; Settings is where you change things. The proposed interaction guideline "Keyboard and focus" rule 4 wants it "one key away (⌘/) from any Snapmark window", and rule 2 lists it as a transient window that closes on Esc.
   - The round-1 mock is a wide two-column sheet; a Settings window is narrow and fixed.
   - Settings still holds it, as the Help-menu ADR decided: the Shortcuts tab links to it.
9. **Snapmark sets its own app menu**, the smallest one that gives ⌘, and ⌘/: the Snapmark menu becomes About, Settings… ⌘,, Keyboard Shortcuts ⌘/, Services, Hide, Hide Others, Show All, Quit. File, Edit, View and Window stay Electron's stock roles, as today.
10. **No beautify option in the bar.** The one-shot editor already remembers its last Beautify settings (`src/main.ts:45`, `:401-405`).

## Capture bar

### Window

| Property              | Value                                                                                                                                                         | Why                                                                     |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| file                  | `src/bar.html` + `src/bar.ts` (classic script in an IIFE, like `src/scroll.ts`)                                                                               | house pattern for small windows                                         |
| size                  | 520 × 52 pt, not resizable, not movable                                                                                                                       | fits "Capture One-Shot"; macOS's bar is about 52 pt tall                |
| place                 | centred on the work area of the display with the pointer; bottom edge 24 pt above that work area's bottom                                                     | like ⇧⌘5; the work area leaves the Dock clear                           |
| frame                 | `frame: false`, `transparent: true`, `hasShadow: true`, `roundedCorners: true`, CSS radius 12 px                                                              | a floating panel, not a window                                          |
| material              | `vibrancy: 'popover'`, `visualEffectState: 'active'`; CSS `color-scheme: light dark` with an opaque fallback background where there is no vibrancy (Linux CI) | follows light and dark mode; `'hud'` is always dark, macOS's bar is not |
| type                  | `type: 'panel'` (macOS: non-activating panel, floats over full-screen apps)                                                                                   | takes keys without pulling the owner's app to the back                  |
| level                 | `setAlwaysOnTop(true, 'screen-saver')`; `setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true, skipTransformProcessType: true })`                      | same as the area picker (`src/main.ts:234-236`)                         |
| capture               | `setContentProtection(true)`                                                                                                                                  | belt and braces; closing it first is the real guard                     |
| focus                 | `show()` then `win.focus()`; never `app.focus({ steal: true })` unless keys do not arrive (see Risks in plan-rows.md)                                         | the panel takes keys without activating Snapmark                        |
| Dock                  | unchanged: `updateDock` counts editors and session windows only                                                                                               | a bar is not a document                                                 |
| instances             | one; ⌃⇧5 while it is open brings it forward                                                                                                                   |                                                                         |
| while a capture runs  | ⌃⇧5 does nothing (`busy()`)                                                                                                                                   | one capture at a time, as today                                         |
| while the bar is open | it counts as a capture running: `busy()` becomes `picking \|\| scrolling \|\| barOpen \|\| counting`, so ⌃⇧4 and ⌃⇧3 do nothing until it closes               | the bar would otherwise be in the macOS overlay's picture               |

### Controls, left to right

| #   | Control           | Kind                         | Name (VoiceOver and tooltip)                                                      | Does                                     |
| --- | ----------------- | ---------------------------- | --------------------------------------------------------------------------------- | ---------------------------------------- |
| 1   | ✕                 | button                       | Close                                                                             | closes the bar                           |
| 2   | window icon       | radio, in group "Mode"       | Capture Window                                                                    | chooses the mode                         |
| 3   | dashed rectangle  | radio                        | Choose New Area                                                                   | chooses the mode                         |
| 4   | rectangle + dot   | radio                        | Capture Last Area · `<w> × <h>`, or Capture Last Area · First time: drag the area | chooses the mode                         |
| —   | divider           |                              |                                                                                   |                                          |
| 5   | rectangle + arrow | radio                        | Capture Scrolling                                                                 | chooses the mode                         |
| —   | divider           |                              |                                                                                   |                                          |
| 6   | "Options ⌄"       | button, `aria-haspopup=menu` | Options                                                                           | opens the native Options menu below it   |
| 7   | "Capture"         | default button               | Capture, or Capture One-Shot                                                      | hides the bar, then runs the chosen mode |

- The mode group is `role="radiogroup"` `aria-label="Mode"`; each mode `role="radio"` with `aria-checked`. The window is `aria-label="Capture Options"`.
- The chosen mode shows pressed, as in macOS (`macos-capture-bar.png`: grey rounded square behind the icon).
- Icons are inline SVG, 24 pt, stroke `currentColor`, drawn after the macOS glyphs in `macos-capture-bar.png`.

### Keys

| Key       | Where the focus is   | Does                                               |
| --------- | -------------------- | -------------------------------------------------- |
| ← →       | on a mode            | moves to the previous or next mode, wrapping       |
| Tab, ⇧Tab | anywhere             | Close → modes (the chosen one) → Options → Capture |
| ↩         | on a mode or Capture | captures                                           |
| ↩, Space  | on Close or Options  | presses that button                                |
| Space     | on a mode            | chooses it                                         |
| Esc       | anywhere             | closes the bar                                     |

On open, the focus is on the chosen mode. A click on a mode chooses it; it does not capture (macOS does the same for its area mode).

### Modes

| Mode              | Runs                                                                                  | Same as today                   | Timer, pointer |
| ----------------- | ------------------------------------------------------------------------------------- | ------------------------------- | -------------- |
| Capture Window    | `screencapture -i -w -o -x <tmp>`                                                     | Capture Window… (`main.ts:196`) | greyed         |
| Choose New Area   | Snapmark's picker, saves the area, then `screencapture [-C] -R <rect> -x <tmp>`       | Choose New Area… (`:200-214`)   | yes            |
| Capture Last Area | `-R` of the saved area; the first time, or when its display is gone, the picker first | ⌃⇧3 (`:200-214`)                | yes            |
| Capture Scrolling | the picker, then the scrolling loop                                                   | Capture Scrolling… (`:260-343`) | greyed         |

The arguments come from one pure function, `captureArgs(mode, pointer, area)` in `src/capture.ts`, so they are tested in plain Node.

### Options menu (native `Menu.popup` at the Options button)

```
Save to                                   (header)
◉ Current Session    <session label>      (radio; "A new session starts" when there is none)
○ One-Shot           Beautify, then copy or save
  New Session                    ⌃⇧N      (action, as ⌃⇧N; the bar stays open)
──
Timer                                     (header; "Timer (areas only)" while greyed)
◉ None
○ 5 Seconds
○ 10 Seconds
──
Options                                   (header)
☐ Show Mouse Pointer                      (sublabel "Areas only" while greyed)
```

Built by `barOptions(state, actions)` in `src/capture.ts`, data only, like `menuTemplate`.

### Behaviour

1. Capture: the bar closes, waits for `closed` plus 200 ms (the area picker's wait, `src/main.ts:252-253`), then runs the mode with the options. It is never in the screenshot.
2. Timer: after the area is known, the menu bar icon shows the seconds left as its title ("5", "4", …). Esc cancels: a global Esc is registered for the countdown only and released after. Nothing is captured on cancel, and no message shows.
3. Save to One-Shot: the capture opens in one-shot mode (`openEditor(…, { oneShot: true })`); `scrollCapture` gains the same option.
4. Save to Current Session: as today; with no session, the first save starts one (`src/main.ts:353`).
5. The bar remembers mode, Save to, Timer and Show Mouse Pointer in `state.json` under `capture`. First time: Choose New Area, Current Session, None, off.
6. The options apply only to captures started from the bar.

### Words

| Where                                | Before                                                                                         | After                                                                                                                                                                                                            |
| ------------------------------------ | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| menu bar menu row (`src/menu.ts`)    | Capture Options ▸ (sublabel ⌃⇧5)                                                               | Capture Options… ⌃⇧5; without the key: "Capture Options… (shortcut unavailable)"                                                                                                                                 |
| bar window name                      | none                                                                                           | Capture Options                                                                                                                                                                                                  |
| bar controls                         | none                                                                                           | Close · Capture Window · Choose New Area · Capture Last Area · Capture Scrolling · Options · Capture / Capture One-Shot                                                                                          |
| Last Area tooltip suffix             | menu sublabel "1280 × 720" / "First time: drag the area"                                       | " · 1280 × 720" / " · First time: drag the area" (same words)                                                                                                                                                    |
| Options menu                         | none                                                                                           | Save to · Current Session · A new session starts · One-Shot · Beautify, then copy or save · New Session · Timer · Timer (areas only) · None · 5 Seconds · 10 Seconds · Options · Show Mouse Pointer · Areas only |
| key list row ⌃⇧5 (`src/keys.ts`)     | Capture options · a menu under the menu bar icon: …                                            | Capture options · the capture bar: window, new area, last area, scrolling, and where it goes                                                                                                                     |
| key list row ↩ / Esc (`src/keys.ts`) | Capture Scrolling · Done or cancel, while it grabs the area you scroll (menu: Capture Options) | Capture Scrolling · Done or cancel, while it grabs the area you scroll (capture bar, ⌃⇧5)                                                                                                                        |
| key list group (`src/keys.ts`)       | none                                                                                           | "Capture bar": ← → Pick a mode · ↩ Capture · Esc Close                                                                                                                                                           |

## Settings window

### Window

| Property  | Value                                                                                                                                               |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| file      | `src/settings.html` + `src/settings.ts`                                                                                                             |
| size      | 560 × 420 pt content, fixed; not resizable, minimizable or full-screen                                                                              |
| title bar | native; the title names the tab shown ("General", "Capture", "Shortcuts"), as macOS Settings windows do                                             |
| toolbar   | under the title bar: three buttons, icon over label, the chosen one on a grey rounded background; `role="tablist"`, ← → move                        |
| opens on  | the tab last shown (page `localStorage`, read in try/catch; General if none)                                                                        |
| from      | menu bar menu "Settings…"; ⌘, in any Snapmark window (app menu); one window, brought forward if open                                                |
| refresh   | reads its data again on `focus`, so login approval in System Settings or a change from the bar shows                                                |
| Dock      | unchanged                                                                                                                                           |
| layout    | a two-column form: right-aligned labels ending in a colon, controls on the left edge of the second column, a grey note under a control where needed |

### Tabs

**General**

| Label            | Control                                              | Note                                                                                                                                                                  | Was                                |
| ---------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| Startup:         | ☐ Open Snapmark at login                             | while approval waits: "Waiting for your approval in System Settings." and button "Open Login Items Settings"; development build: greyed, "Only in the installed app." | Open at Login (+ sublabel)         |
| Sessions folder: | the path, `~`-shortened · button "Change…"           | with `SNAPMARK_ROOT` set: Change… greyed, "Set by SNAPMARK_ROOT."                                                                                                     | Sessions Folder…                   |
| Old sessions:    | button "Clear Sessions Older Than 60 Days…"          | "Moves them to the Trash. The current session and open ones stay."                                                                                                    | Clear Sessions Older Than 60 Days… |
| Updates:         | "Snapmark `<version>`" · button "Check for Updates…" | development build: greyed, "Only in the installed app."                                                                                                               | Check for Updates…                 |

"Open Login Items Settings" opens `x-apple.systempreferences:com.apple.LoginItems-Settings.extension` with `shell.openExternal`.

**Capture** — the bar's options, the same state as its Options menu

| Label    | Control                             | Note                                       |
| -------- | ----------------------------------- | ------------------------------------------ |
| Save to: | ◉ Current Session ○ One-Shot        | "For captures from the capture bar (⌃⇧5)." |
| Timer:   | pop-up: None, 5 Seconds, 10 Seconds | "Areas only."                              |
| Pointer: | ☐ Show mouse pointer                | "Areas only."                              |

**Shortcuts**

| Label     | Control                                                                                                             | Note                                                               | Was                                  |
| --------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------ |
| Editor:   | ☐ Pick tools with single keys                                                                                       | "Off: only ⌘1–⌘7 pick tools."                                      | Single-Key Tools                     |
| Anywhere: | four rows, keycap then name: ⌃⇧4 Capture Screenshot · ⌃⇧3 Capture Last Area · ⌃⇧5 Capture Options · ⌃⇧N New Session | a key another app owns reads "Taken by another app" after its name | "(shortcut unavailable)" in the menu |
|           | button "Show All Shortcuts" with ⌘/ beside it                                                                       |                                                                    | Keyboard Shortcuts                   |

### IPC

- `settings:init` → `SettingsInit`: `login` (from `loginState`), `root` (`~`-shortened), `canChangeRoot`, `version`, `canUpdate`, `singleKeys`, `taken` (keys not registered), `capture` (Save to, Timer, Pointer).
- `settings:set` (`key`, `value`) for `login`, `singleKeys`, `oneShot`, `timer`, `pointer`. `singleKeys` goes through today's `setSingleKeys()` (`src/main.ts:105-109`), so open editors hear it.
- `settings:run` (`chooseRoot` | `clearOld` | `checkUpdates` | `loginItems` | `shortcuts`) calls today's functions: `chooseRoot()`, `clearOldSessions()`, `checkForUpdatesNow()`, `shell.openExternal(…)`, `showShortcuts()`.

## Keyboard Shortcuts window

### Window

| Property | Value                                                                                                                                                             |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| file     | `src/shortcuts.html` + `src/shortcuts.ts`; loads `tools.js` before its script, as `src/editor.html:545` does (the comment at `src/tools.ts:2` already expects it) |
| data     | `shortcuts:init` returns `KEY_GROUPS`; the tool rows come from `GROUPS` in `tools.js`                                                                             |
| title    | Keyboard Shortcuts (Title Case; today "Keyboard shortcuts")                                                                                                       |
| size     | 980 × 680 pt, resizable, minimum 560 × 400                                                                                                                        |
| from     | ⌘/ in any Snapmark window (app menu); Settings ▸ Shortcuts ▸ Show All Shortcuts; one window, brought forward if open                                              |
| closes   | Esc, ⌘W, the close button                                                                                                                                         |
| CSP      | `default-src 'self'; style-src 'self' 'unsafe-inline'`, as `src/area.html`                                                                                        |

### Layout, after `01-native/shots/shortcuts--window.png`

- Two columns, a hairline between: left "Other keys", right "Editor tools". Below 760 pt wide they stack, Other keys first.
- **Other keys**: one heading per `KEY_GROUPS` group (Anywhere, Capture bar, Snapmark windows, Editor, Session window); each row: keycap, name in semibold, what it does in secondary text.
- **Editor tools**: one row per tool, in toolbar order: keycap (the group's key, upper case), "again" in secondary text for a group's second tool, the tool's icon (`ToolDef.icon`), name in semibold, `tip ?? means` in secondary text.
- **Keycap**: system font 12 px, medium; padding 3 × 8 px; 1 px border in the separator colour, 6 px radius, a 1 px bottom shadow; several keys in one cap ("⌘S / ⌘↵" stays one row, each chord its own cap).
- Rows are separated by hairlines. Colours from the round-1 Native palette (`01-native/notes.md`): text `#1D1D1F`, secondary `#76767C`, separators `#D8D9DD`, background `#FFFFFF`; dark mode uses the system dark colours through `color-scheme: light dark`.
- Words come from `KEY_GROUPS` and `tools.ts` only. The mock's "⌃⇧1 Capture region" and ⌘ before the tool digits are out of date and are not copied.

### `KEY_GROUPS` after M2

Rows as `[key, name, what]`, in this order:

- **Anywhere:** unchanged, except the ⌃⇧5 row: `['⌃⇧5', 'Capture options', 'the capture bar: window, new area, last area or scrolling, and where it goes']`.
- **Capture bar** (new): `['← →', 'Pick a mode', 'Tab moves on to Options and Capture']`, `['↩', 'Capture', '']`, `['Esc', 'Close', '']`.
- **Snapmark windows** (new): `['⌘,', 'Settings', '']`, `['⌘/', 'Keyboard Shortcuts', '']`.
- **Editor**, **Session window:** unchanged.

## Menus

### Menu bar menu (`src/menu.ts` `menuTemplate`)

- Row "Capture Options" ▸ becomes "Capture Options…" with accelerator `Control+Shift+5` (the `shortcut()` helper, `src/menu.ts:73-75`), icon `choose`, click `a.captureBar()`. No submenu, so the key shows beside it; the sublabel workaround (`:117-118`) goes.
- Row "Settings" ▸ becomes "Settings…" with accelerator `Command+,`, icon `settings`, click `a.settings()`.
- `captureOptions()` is deleted. `MenuState` loses `login`, `root`, `canChangeRoot`, `version`, `canUpdate`, `singleKeys`; `MenuActions` loses `chooseArea`, `captureWindow`, `captureScrolling`, `oneShot`, `chooseRoot`, `clearOldSessions`, `setLogin`, `setSingleKeys`, `keyboardShortcuts`, `checkUpdates`, and gains `captureBar`, `settings`. `loginState()` stays (Settings uses it).
- Every other row, its order and its icons are unchanged.

### App menu (new, `appMenu(a)` in `src/menu.ts`)

```
Snapmark: About Snapmark · ── · Settings… ⌘, · Keyboard Shortcuts ⌘/ · ── · Services ▸ · ── · Hide Snapmark ⌘H · Hide Others ⌥⌘H · Show All · ── · Quit Snapmark ⌘Q
{ role: 'fileMenu' } · { role: 'editMenu' } · { role: 'viewMenu' } · { role: 'windowMenu' }
```

Set once with `Menu.setApplicationMenu` in `app.whenReady`, before the quiet return, so the smoke test has it too. It shows while an editor or session window is in front, as today's stock menu does.

## Sitemap delta (for `docs/ux/sitemap.md`, As built)

```
ENTRY POINTS
├── ⌃⇧5  Capture Options        ──► CAPTURE BAR
MENU
├── Capture Options…  ⌃⇧5        ──► CAPTURE BAR            (was: Capture Options ▸ four items)
├── Settings…  ⌘,                 ──► SETTINGS WINDOW       (was: Settings ▸ six items)
CAPTURE BAR    bottom centre of the pointer's display, every Space, full screen too; Close · Capture Window · Choose New Area ·
               Capture Last Area · Capture Scrolling · Options ▾ (Save to · Timer · Show Mouse Pointer) · Capture
               ↩ ──► bar closes ──► the mode ──► Editor (session or one-shot) · Esc ──► nothing
SETTINGS WINDOW   General · Capture · Shortcuts; Shortcuts ▸ Show All Shortcuts ──► KEYBOARD SHORTCUTS WINDOW
KEYBOARD SHORTCUTS WINDOW   "Keyboard Shortcuts", src/shortcuts.html, two columns, Esc closes; ⌘/ from any Snapmark window
EDITOR, SESSION WINDOW   Mac menu bar: Snapmark (About, Settings… ⌘,, Keyboard Shortcuts ⌘/, Services, Hide, Quit) · File · Edit · View · Window
```

## Conformance with the proposed guidelines

| Rule                                                                 | M2                                                                                                                        |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Keyboard 1: global keys capture only                                 | kept; no new global key                                                                                                   |
| Keyboard 2: transient windows close on Esc                           | the bar and Keyboard Shortcuts close on Esc (fixes F165)                                                                  |
| Keyboard 4: one key list, grouped by where keys work, one key away   | `KEY_GROUPS` stays the one source; ⌘/ from any Snapmark window                                                            |
| Platform 1: own app menu with Settings… ⌘, and Keyboard Shortcuts ⌘/ | met for the Snapmark menu; File, Edit, View stay stock (departure, Questions 9)                                           |
| Platform 2: Title Case for titles and buttons                        | "Keyboard Shortcuts", "Show All Shortcuts", "Capture One-Shot"                                                            |
| Platform 5: ellipsis only when more input follows                    | "Capture Options…", "Settings…", "Change…", "Clear Sessions … Days…", "Check for Updates…"; "Show All Shortcuts" has none |
| Dialogs and menus: menu short and fixed                              | two submenus fewer; the top level keeps its row count                                                                     |
| Dialogs and menus: Keyboard Shortcuts top level in the menu          | departure: reached by ⌘/ and Settings (Questions 7)                                                                       |
| Accessibility: every control named; keyboard reaches everything      | bar and Settings: named controls, radio group, tab list, Tab order                                                        |

## What CI can and cannot check

Smoke runs headless on Linux with xvfb on every PR, and on macOS in the release workflow. Never locally.

| Check                                                                               | Linux CI (every PR)             | macOS release | Else                                                           |
| ----------------------------------------------------------------------------------- | ------------------------------- | ------------- | -------------------------------------------------------------- |
| bar position, controls, names, radio group, keys, Esc, ↩, one instance              | yes                             | yes           |                                                                |
| bar closed before the mode runs (swapped runner)                                    | yes                             | yes           |                                                                |
| `isAlwaysOnTop()`, `isVisibleOnAllWorkspaces()`                                     | yes                             | yes           |                                                                |
| vibrancy, `type: 'panel'`, over a full-screen app, no Space switch, no focus pulled | no                              | no            | owner at the milestone; verifier reads `openCaptureBar`        |
| the native Options menu                                                             | no (cannot click a native menu) | no            | unit test of `barOptions` in plain Node                        |
| `screencapture` arguments, `-C`                                                     | no (never run)                  | no            | unit test of `captureArgs`                                     |
| timer countdown in the menu bar, global Esc                                         | no (no tray in quiet mode)      | no            | verifier reads `runCapture`                                    |
| VoiceOver speech                                                                    | no                              | no            | smoke checks the names VoiceOver reads; owner at the milestone |
| Settings tabs, controls, labels, Single-Key Tools reaching an editor                | yes                             | yes           |                                                                |
| Open at Login, approval line                                                        | no (unpackaged)                 | no            | `loginState` unit tests; verifier                              |
| Keyboard Shortcuts file, two columns, keycaps, rows, Esc, dark mode                 | yes                             | yes           |                                                                |
| app menu items and keys                                                             | data only                       | data only     | unit test of `appMenu`                                         |

## Out of scope

- Video recording; Entire Screen; a Clipboard target; a beautify option in the bar.
- Changing global keys, or taking ⇧⌘3/4/5 (ADR "Keys follow macOS", Rejected).
- Licence tab.
- Removing the stock File, Edit and View items (Reload ⌘R, Developer Tools).
- The bar's options for ⌃⇧4 and ⌃⇧3.
- Moving the Settings window's look to the round-1 Native palette beyond the Keyboard Shortcuts window.

Open questions with their defaults: [questions.md](../questions.md).
