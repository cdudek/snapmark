# Screens

Fix pass 2026-10-26: the owner's answers (brief.md, Answers) are applied. Sizes are in points. "150 %" means Larger Text or a 1.5× zoom of the page.

## Tokens

No design system file exists; these go into the shared CSS of the bar, the editor and the capture panels.

| Token                | Light                         | Dark      | Use                                                                      | Contrast                                            |
| -------------------- | ----------------------------- | --------- | ------------------------------------------------------------------------ | --------------------------------------------------- |
| `--accent`           | `#2492FF`                     | `#2492FF` | Icons of the chosen mode; area outline                                   | icon only; selection is also shown by fill and text |
| `--accent-fill`      | `#0F72DB`                     | `#0F72DB` | The one blue filled button per panel (Capture, Done, the editor primary) | white text 4.7:1                                    |
| `--fill-selected`    | `#E5E5EA`                     | `#3A3A3C` | Chosen mode; selected segment                                            | —                                                   |
| `--accent-text`      | `#0A62C2`                     | `#6CB4FF` | Text of the chosen mode and selected segment; link buttons               | 4.7:1 on `#E5E5EA`; 5.2:1 on `#3A3A3C`              |
| `--rec-dot`          | `#FF3B30`                     | `#FF453A` | Recording dot (system red, not the Remove mark red)                      | —                                                   |
| `--warn`             | today's `scroll.html` `.warn` | same      | Clock near the cap; "Lost the place"                                     | —                                                   |
| `--hairline`         | the toolbar `.sep` colour     | same      | Notes column divider; bar row divider                                    | —                                                   |
| `--countdown-square` | 240                           | 240       | Countdown square side                                                    | —                                                   |
| `--countdown-digit`  | 160                           | 160       | Countdown digit size                                                     | —                                                   |
| `--panel-height`     | 64                            | 64        | Recording and scrolling panel                                            | —                                                   |

Marks never use blue (EDT-8). Blue for "chosen", "next move" and the area outline follows the macOS accent; accepted.

## Capture bar

### Purpose

Choose what to capture, where it goes and how, then capture with one blue button (setup: Capture bar; J1, J2, J5, J7).

### Header

| Title                                     | Tabs | Actions                             |
| ----------------------------------------- | ---- | ----------------------------------- |
| none (headline row shows the chosen mode) | none | Session \| One-Shot, session pop-up |

### Sections

| Order | Section      | Purpose                                                                      |
| ----- | ------------ | ---------------------------------------------------------------------------- |
| 1     | Headline row | Mode name (20 pt semibold), hint (13 pt secondary), destination at the right |
| 2     | Hairline     | Divides what you choose from how you go                                      |
| 3     | Control row  | Esc · modes 1–6 · Options · Capture                                          |

### Layout

| Zoom            | Columns                                                                                                              | Widths                                                                                              | Notes                                                                                                   |
| --------------- | -------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| 100 %           | Headline row: name, hint, gap, segmented control, pop-up. Control row: Esc, sep, 6 modes, sep, Options, sep, Capture | Bar 960 × 132. Modes 64 × 64. Segments 2 × 100. Pop-up max 260. Capture 160 × 48                    | Budget: headline row about 940, control row about 800. Bottom centre, 24 pt above the work area (WIN-3) |
| narrow or 150 % | Same                                                                                                                 | Segments 2 × 80, pop-up max 200. The hint wraps under the headline; the bar grows to about 152 high | Used when the work area is under 1000 pt wide, or at 150 %. The hint never hides. Nothing hides         |

### Lists

| List  | Columns         | Sort      | Empty |
| ----- | --------------- | --------- | ----- |
| Modes | icon, name, key | fixed 1–6 | —     |

### Controls

| Control        | Component                            | Label                              | Key               | Disabled reason                                | State source          |
| -------------- | ------------------------------------ | ---------------------------------- | ----------------- | ---------------------------------------------- | --------------------- |
| Close          | icon button, ⓧ with "Esc" under      | "Esc" (aria "Close")               | Esc               | —                                              | —                     |
| New Area       | mode button                          | "New Area" · "1"                   | 1                 | —                                              | `captureOpts.mode`    |
| Window         | mode button                          | "Window" · "2"                     | 2                 | —                                              | same                  |
| Full Screen    | mode button                          | "Full Screen" · "3"                | 3                 | —                                              | same                  |
| Last Area      | mode button                          | "Last Area" · "4"                  | 4                 | —                                              | same                  |
| Scrolling      | mode button                          | "Scrolling" · "5"                  | 5                 | —                                              | same                  |
| Record         | mode button                          | "Record" · "6"                     | 6                 | —                                              | same                  |
| Destination    | segmented control (grey, 2 segments) | "Session", "One-Shot"              | ⇧⌘O; Tab then ← → | —                                              | `captureOpts.oneShot` |
| Session pop-up | pop-up button                        | "<session> (<n>)" + chevron        | ⇧⌘P               | One-Shot chosen: face reads "Not in a session" | current session       |
| Options        | pop-up button                        | "Options" with "⌥O" under          | ⌥O                | —                                              | —                     |
| Capture        | primary button, the only blue fill   | "Capture ↩" / "Capture One-Shot ↩" | ↩, ⌘↩             | never                                          | `captureOpts.oneShot` |

The digits match the global keys where they share a meaning: 1 New Area (⌃⇧1), 3 Full Screen (⌃⇧3), 4 Last Area (⌃⇧4) (Q8).

Chosen mode: `--fill-selected`, icon `--accent`, label `--accent-text`. Others: label colour. Only Capture is filled blue.

Session pop-up tooltip in the bar: "Current session: <name>" (Q13).

### Options menu (native)

| Group        | Items                                               | Greyed when               |
| ------------ | --------------------------------------------------- | ------------------------- |
| "Frame Rate" | 15 fps · 10 fps (✓ default) · 5 fps · 4 fps · 2 fps | the mode is not Record    |
| "Timer"      | None · 3 Seconds · 5 Seconds · 10 Seconds           | Window, Scrolling (CAP-6) |
| —            | Show Mouse Pointer                                  | Window, Scrolling (CAP-6) |

"Save to" leaves the menu; the segmented control replaces it.

### Headline and hint per mode

| Mode          | Headline              | Hint                                                                                           |
| ------------- | --------------------- | ---------------------------------------------------------------------------------------------- |
| 1 New Area    | "Capture New Area"    | "Drag to choose the area"                                                                      |
| 2 Window      | "Capture Window"      | "Click a window after Capture"                                                                 |
| 3 Full Screen | "Capture Full Screen" | "Every display, one screenshot each"                                                           |
| 4 Last Area   | "Capture Last Area"   | "1280 × 720" · no area: "No area yet: drag one after Capture"                                  |
| 5 Scrolling   | "Capture Scrolling"   | auto: "Snapmark scrolls the area for you" · manual: "Scroll the area yourself, then Done"      |
| 6 Record      | "Record"              | "1280 × 720 · up to 30 seconds · 10 fps" · no area: "Drag an area · up to 30 seconds · 10 fps" |

### Filters

None.

### Words

| Where                    | Text                                                                    |
| ------------------------ | ----------------------------------------------------------------------- |
| Close label              | "Esc"                                                                   |
| Mode labels              | "New Area", "Window", "Full Screen", "Last Area", "Scrolling", "Record" |
| Segments                 | "Session", "One-Shot"                                                   |
| Pop-up, One-Shot         | "Not in a session"                                                      |
| Pop-up, no session       | "No session yet"                                                        |
| Pop-up tooltip           | "Current session: <name>"                                               |
| Options                  | "Options", "⌥O"                                                         |
| Capture                  | "Capture", "Capture One-Shot", keycap "↩"                               |
| Options groups           | "Frame Rate", "Timer", "Show Mouse Pointer"                             |
| Window title (VoiceOver) | "Capture Options"                                                       |

### Components

| Region                    | Component                       | Status       | Notes                                            |
| ------------------------- | ------------------------------- | ------------ | ------------------------------------------------ |
| Bar panel                 | `bar.html` panel                | new variant  | Two rows; key window while open                  |
| Mode buttons              | `bar.html` radio buttons        | new variant  | Label and key under the icon; six modes          |
| Record, Full Screen icons | SVG                             | missing      | Record as the pick; Full Screen a screen outline |
| Segmented control         | —                               | missing      | Shared with the editor                           |
| Session pop-up            | `editorSessionMenu` (`menu.ts`) | new variant  | Counts, Older Sessions…                          |
| Capture button            | `bar.html` #capture             | new variant  | Blue fill, keycap                                |
| Hover label               | `tip.html`                      | retired (Q3) | Names and keys are on screen                     |

## Area picker

Unchanged except the hints and Record's start (interaction.md, Area picker).

| Where                         | Text                                                                 |
| ----------------------------- | -------------------------------------------------------------------- |
| ⌃⇧1, New Area, ⌃⇧4 first time | "Drag over the area to capture. ⌃⇧4 captures it again. Esc cancels." |
| ⌃⇧4 after New Session         | "New session: drag the area. ⌃⇧4 captures it again. Esc cancels."    |
| Record, area set              | "↩ records this area. Drag to choose another. Esc cancels."          |
| Record, no area               | "Drag over the area to record. Esc cancels."                         |

Record with an area set shows that area outlined with handles. ↩ keeps it; a new drag replaces it and becomes the last area.

## Countdown overlay

### Purpose

Give the owner time to set up what will move, and a way out (J5, A6).

### Sections

| Order | Section | Purpose                                 |
| ----- | ------- | --------------------------------------- |
| 1     | Outline | The area, dashed `--accent`, no handles |
| 2     | Square  | Digit and "Esc cancels"                 |

### Layout

| Zoom  | Columns | Widths                                                                                          | Notes                                             |
| ----- | ------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| 100 % | one     | `--countdown-square` 240, radius 24, frosted popover material; `--countdown-digit` 160 pt heavy | Centred on the area; outside the area dimmed 20 % |
| 150 % | one     | Square 300; digit 200 pt                                                                        | Never larger than the display                     |

### Controls

| Control | Component             | Label         | Key               | Disabled reason | State source |
| ------- | --------------------- | ------------- | ----------------- | --------------- | ------------ |
| Cancel  | key and menu bar icon | "Esc cancels" | Esc (global), ⌃⇧5 | —               | —            |

The square lets clicks pass through. The menu bar icon is the pointer route: a click cancels.

### Words

| Where     | Text                                                                                 |
| --------- | ------------------------------------------------------------------------------------ |
| Digit     | "3", "2", "1" (or from the Timer's value)                                            |
| Line      | "Esc cancels"                                                                        |
| VoiceOver | "Recording starts in 3 seconds. Esc cancels." / "Capture in 3 seconds. Esc cancels." |

### Components

| Region  | Component                  | Status  | Notes                                        |
| ------- | -------------------------- | ------- | -------------------------------------------- |
| Overlay | new `countdown.html` panel | missing | Click-through, all Spaces, content-protected |

## Recording control

### Purpose

Show that recording runs and how long is left; stop or cancel without taking a key from the recorded app (J5, A8, Q9).

### Sections

| Order | Section | Purpose                               |
| ----- | ------- | ------------------------------------- |
| 1     | Cancel  | ⓧ, into Discarded                     |
| 2     | Status  | Red dot, clock of the cap, frame rate |
| 3     | Done    | Stop and keep                         |
| 4     | Hint    | "⌃⇧5 stops"                           |

### Layout

| Zoom  | Columns        | Widths                                                                  | Notes                                                                                                                   |
| ----- | -------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| 100 % | four, in a row | Panel about 600 × `--panel-height`, dark HUD material in light and dark | 16 pt below the area, centred. Else above it. Else at the display's bottom edge outside it. Else inside its bottom edge |
| 150 % | same           | Grows to fit                                                            | The clock never truncates                                                                                               |

The panel never takes focus. The area shows its outline only, no handles.

### Controls

| Control       | Component                 | Label                            | Key          | Disabled reason          | State source |
| ------------- | ------------------------- | -------------------------------- | ------------ | ------------------------ | ------------ |
| Cancel        | icon button ⓧ             | aria "Cancel recording"          | —            | never                    | —            |
| Done          | primary button, blue fill | "Done"                           | ⌃⇧5          | while finding key frames | recorder     |
| Menu bar icon | status item               | the clock "0:07" beside the icon | click = Done | —                        | recorder     |

The pick's grey stop square is dropped: Done already stops. A red dot (not a button) shows it records.

### Words

| Where      | Text                                               |
| ---------- | -------------------------------------------------- |
| Status     | "0:07 of 0:30 · 10 fps"                            |
| Processing | "Finding key frames…"                              |
| Hint       | "⌃⇧5 stops"                                        |
| VoiceOver  | "Recording, 10 seconds of 30"; "Recording stopped" |

### Components

| Region | Component             | Status      | Notes                          |
| ------ | --------------------- | ----------- | ------------------------------ |
| Panel  | `scroll.html` control | new variant | Shared by Scrolling and Record |

## Scrolling control

Same panel as the recording control.

### Controls

| Control       | Component                 | Label         | Key          | Disabled reason | State source |
| ------------- | ------------------------- | ------------- | ------------ | --------------- | ------------ |
| Cancel        | icon button ⓧ             | aria "Cancel" | Esc          | never           | —            |
| Done          | primary button, blue fill | "Done ↩"      | ↩, ⌃⇧5       | never           | scroller     |
| Menu bar icon | status item               | —             | click = Done | —               | scroller     |

### Words

| Where         | Text                                                                                            |
| ------------- | ----------------------------------------------------------------------------------------------- |
| Starting      | "Starting…"                                                                                     |
| Auto          | "Scrolling · 12 frames · 4,200 px tall"                                                         |
| Manual        | "Scroll down, then Done · 3 frames · 1,800 px tall"                                             |
| Fell back     | "This area did not scroll. Scroll it yourself, then Done."                                      |
| No permission | "Auto-scroll needs Accessibility. Turn it on in Snapmark Settings ▸ Capture." (once per launch) |
| Lost          | "Lost the place: scroll back up a little" (today)                                               |

## Settings ▸ Capture: Capture Scrolling row

One new row; the rest of Settings is unchanged (WIN-7).

| Control       | Component | Label                                                                                                               | Key | Disabled reason                                                                                                     | State source                   |
| ------------- | --------- | ------------------------------------------------------------------------------------------------------------------- | --- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| Status line   | text      | allowed: "Capture Scrolling scrolls by itself." · not: "Capture Scrolling needs Accessibility to scroll by itself." | —   | —                                                                                                                   | `isTrustedAccessibilityClient` |
| Open settings | button    | "Open Accessibility Settings…"                                                                                      | —   | hidden when allowed. App Store build: the line reads "This version cannot scroll for you." and the button is greyed | build, permission              |

## Editor toolbar destination

### Purpose

Show and change where this screenshot goes (J4, A5, A6, A12).

### Header

| Title                         | Tabs | Actions                                                                                   |
| ----------------------------- | ---- | ----------------------------------------------------------------------------------------- |
| "Snapmark" (title bar, today) | none | Right end after Undo, Redo and Copy or Save: Session \| One-Shot, then the session pop-up |

### Layout

| Zoom            | Columns                                                                                           | Widths                                                                                            | Notes                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| 100 %           | Tools, sep, colour, sep, Undo, Redo, Copy or Save, flexible gap, segmented control, 12 pt, pop-up | Segments 2 × 100; pop-up max 260                                                                  | Undo and Redo stay icons, as today. The window's minimum is 820 × 520 (F108 today) |
| narrow or 150 % | Same                                                                                              | Shrink order: the pop-up name down to 96 pt, then segments to 2 × 72, then tool key captions hide | One line at 820 pt, as F108 requires today. The build measures it                  |

The pick's grey line under the pop-up ("Ledgerly Q4 review · 6 screenshots") is dropped. It repeats the pop-up face.

### Controls

| Control                       | Component               | Label                              | Key                       | Disabled reason                                                            | State source         |
| ----------------------------- | ----------------------- | ---------------------------------- | ------------------------- | -------------------------------------------------------------------------- | -------------------- |
| Destination                   | segmented control, grey | "Session", "One-Shot"              | ⇧⌘O; Tab then ← →, Space  | Edit Again: tooltip on its wrapper "Edit Again saves back into <session>." | `oneShot`, `replace` |
| Session pop-up                | pop-up button           | "Ledgerly Q4 review (6)" + chevron | ⇧⌘P                       | One-Shot: face "Not in a session". Edit Again: the entry's session         | `session`, `count`   |
| Primary (Session)             | primary button          | "Add to Session ⌘↩"                | ⌘↩, ⌘S                    | —                                                                          | —                    |
| Primary (One-Shot)            | primary button          | "Copy Image ⌘C"                    | ⌘↩; ⌘C without text focus | —                                                                          | —                    |
| Primary (One-Shot, recording) | primary button          | "Copy Filmstrip ⌘C"                | ⌘↩; ⌘C without text focus | —                                                                          | —                    |
| Primary (Edit Again)          | primary button          | "Save Changes ⌘↩"                  | ⌘↩, ⌘S                    | —                                                                          | —                    |
| Move error                    | text under the pop-up   | see Words                          | —                         | —                                                                          | move result          |

Selected segment: `--fill-selected` with `--accent-text`. A click on a segment returns focus to the canvas. One blue fill per window: the primary button.

### Words

| Where                         | Text                                                                                     |
| ----------------------------- | ---------------------------------------------------------------------------------------- |
| Segments                      | "Session", "One-Shot"                                                                    |
| Pop-up face                   | "<session> (<n>)"; empty session: "<session>"                                            |
| Pop-up face, One-Shot         | "Not in a session"                                                                       |
| Pop-up tooltip                | "<full session name> · Switch Session"                                                   |
| Segmented tooltip, Edit Again | "Edit Again saves back into <session>."                                                  |
| One-Shot with notes           | "Notes stay with Session. They are not copied."                                          |
| Move error                    | "Couldn't move to <session>: its folder is gone. Choose another session or New Session." |
| Window title                  | "Snapmark — <session>" / "Snapmark — One-Shot"                                           |
| Primary buttons               | "Add to Session", "Copy Image", "Copy Filmstrip", "Save Changes"                         |
| Copy or Save menu, recording  | "Copy Filmstrip", "Copy GIF", "Save As…", "Save GIF As…"                                 |

In One-Shot, reference numbers are left out of the copied or saved image. They come back in Session.

### Components

| Region            | Component                   | Status      | Notes                           |
| ----------------- | --------------------------- | ----------- | ------------------------------- |
| Segmented control | —                           | missing     | Same as the bar's               |
| Session pop-up    | `#session` in `editor.html` | new variant | Count in brackets; greyed state |
| Primary button    | `#save` in `editor.html`    | have        | Label changes only              |
| Copy or Save menu | `copyMenu` in `menu.ts`     | new variant | Recording items                 |

## Session pop-up (destination menu)

Native menu, shared by the editor and the bar.

| Order | Item                                    | Key | Notes                                                          |
| ----- | --------------------------------------- | --- | -------------------------------------------------------------- |
| 1–10  | "<session> (<n>)", ✓ on the current one | —   | As the menu bar's Switch Session; empty sessions show no count |
| —     | separator                               |     |                                                                |
| 11    | "Older Sessions…"                       | —   | Always shown (Q6). Opens today's folder panel                  |
| 12    | "New Session"                           | ⌃⇧N | Shown, not registered in the menu. Forgets the area (Q2)       |

A pick moves this screenshot and makes that session current at once. Add saves into it.

## Recording editor (key frames)

### Purpose

Mark the moments that changed, so the AI reads motion from one image (J6, A8, A11).

### Header

Today's editor toolbar with the destination controls. No new header.

### Sections

| Order | Section      | Purpose                                                                        |
| ----- | ------------ | ------------------------------------------------------------------------------ |
| 1     | Facts line   | "Recording · 3.2 s · 10 fps · 4 key frames of 32", then Show All Frames, right |
| 2     | Frame grid   | Key frames and marked frames, up to 4 per row, each with its time above        |
| 3     | Notes column | General comment, References (each with its frame time), footer                 |

### Layout

| Zoom  | Columns                        | Widths                                                     | Notes                                                     |
| ----- | ------------------------------ | ---------------------------------------------------------- | --------------------------------------------------------- |
| 100 % | Canvas \| notes column (today) | 4 frames per row; 16 pt gutters; time label 15 pt semibold | More than 4: more rows; the canvas scrolls                |
| 150 % | same                           | 3 per row                                                  | Marks move with their frames. Labels never overlap frames |

The saved filmstrip is key frames plus marked frames, 4 per row, whatever the view.

### Lists

| List       | Columns           | Sort    | Empty                                 |
| ---------- | ----------------- | ------- | ------------------------------------- |
| Key frames | time label, frame | by time | never empty: at least the first frame |

### Controls

| Control             | Component                                        | Label                                 | Key | Disabled reason                                                             | State source |
| ------------------- | ------------------------------------------------ | ------------------------------------- | --- | --------------------------------------------------------------------------- | ------------ |
| Show All Frames     | link button, `--accent-text`, underline on hover | "Show All Frames" / "Show Key Frames" | ⇧⌘F | every frame is a key frame: "All 4 frames are key frames" (wrapper tooltip) | recording    |
| Beautify (One-Shot) | today's panel                                    | greyed                                | —   | "Beautify works on screenshots only."                                       | recording    |

The pick's captions ("Spinner appears"), its "Recording" block in the notes column and its Previous/Next frame links are dropped.

### Words

| Where             | Text                                              |
| ----------------- | ------------------------------------------------- |
| Facts line        | "Recording · 3.2 s · 10 fps · 4 key frames of 32" |
| Facts, slow       | "… · evenly spaced"                               |
| Frame label       | "0.0 s", "0.4 s", "2.4 s", "3.2 s"                |
| Reference time    | "0.4 s" above the note                            |
| Toggle            | "Show All Frames", "Show Key Frames"              |
| Copy notification | "Filmstrip copied." / "GIF copied."               |

### Components

| Region       | Component                  | Status      | Notes                                                 |
| ------------ | -------------------------- | ----------- | ----------------------------------------------------- |
| Canvas       | fabric canvas, `editor.ts` | new variant | Background is the frame grid; marks clipped per frame |
| Frame labels | drawn into the filmstrip   | missing     | Also in the saved PNG                                 |
| Facts line   | —                          | missing     | Above the canvas, outside the image                   |

## Editor notes column

| Item                          | Value                                                     |
| ----------------------------- | --------------------------------------------------------- |
| Space above "General comment" | 20 pt (today about 8)                                     |
| Space below each heading      | 8 pt                                                      |
| Hairline                      | 1 px `--hairline`, full column width less 16 pt each side |
| Hairline position             | 20 pt below the general comment, 20 pt above "References" |
| Hairline shown                | only with the References heading (NTE-8)                  |
| Gap between reference notes   | 12 pt (NTE-4)                                             |

## Hex fields

| Field                        | Where                                | Rule                                                                                               |
| ---------------------------- | ------------------------------------ | -------------------------------------------------------------------------------------------------- |
| Annotation colour hex        | palette (today)                      | `#` drawn before the field. A leading `#` typed or pasted is dropped at once. Lower case, as today |
| Beautify custom backdrop hex | Beautify ▸ Background, beside Custom | New. Same look and rules                                                                           |
| Both: when it applies        | —                                    | On paste, ↩ or blur; while typing, at 6 valid digits                                               |
| Both: error                  | —                                    | Only on ↩ or blur: "Use 3 or 6 hex digits, like e5484d." Cleared as soon as the value is valid     |

Beautify keeps its design (A10); the field sits on the Custom swatch's row.

## Session window

### Purpose

Read and fix a session, now with recordings (setup: Session window; J6, A9).

### Layout

| Zoom  | Columns | Widths                                                               | Notes                   |
| ----- | ------- | -------------------------------------------------------------------- | ----------------------- |
| 100 % | today   | First open: 90 % of the work area, centred. Then the remembered size | Minimum stays 720 × 480 |
| 150 % | today   | as 100 %                                                             | —                       |

### Recording entry (Screenshots tab)

| Item       | Text or control                                       | Key   |
| ---------- | ----------------------------------------------------- | ----- |
| Badge      | "Recording" (screenshots: "Screenshot")               | —     |
| Facts      | "3.2 s · 10 fps · 4 key frames of 32"                 | —     |
| Filmstrip  | "Filmstrip · for the AI", the saved PNG with marks    | —     |
| GIF        | "GIF · for people", first frame with "Play" / "Pause" | Space |
| Edit Again | today's button                                        | ⌘O    |

### Document tab and `session.md`

| Where      | Text                                                                           |
| ---------- | ------------------------------------------------------------------------------ |
| Entry line | "Recording 3.2 s at 10 fps. Key frames: 0.0 s, 0.4 s, 2.4 s, 3.2 s (4 of 32)." |
| Image      | the filmstrip PNG                                                              |
| GIF link   | "GIF: 007.gif"                                                                 |
| References | "1 (0.4 s): Use a skeleton here, not a spinner."                               |

### Export

PDF: the filmstrip, facts line and notes. ZIP: the same plus the GIF. Raw frames stay out.

## Menu bar menu: capture rows

| Order | Row                   | Key | Sublabel                                                                   |
| ----- | --------------------- | --- | -------------------------------------------------------------------------- |
| 1     | "Capture Last Area"   | ⌃⇧4 | "1280 × 720", "First time: drag the area", or "New session: drag the area" |
| 2     | "Capture New Area…"   | ⌃⇧1 | —                                                                          |
| 3     | "Capture Full Screen" | ⌃⇧3 | — (every display, at once)                                                 |
| 4     | "Capture One-Shot…"   | ⌃⇧2 | —                                                                          |
| 5     | "Capture Options…"    | ⌃⇧5 | —                                                                          |

"Capture Screenshot…" leaves; ⌃⇧2's overlay replaces it for one-shots (Q1).

While a recording or a scrolling capture runs, a click on the menu bar icon is Done; it shows no menu. During a countdown, a click cancels.

## Keyboard Shortcuts window: rows

| Keys    | Name                | What                                                        |
| ------- | ------------------- | ----------------------------------------------------------- |
| ⌃⇧4     | Capture Last Area   | the first time, or after New Session, drag the area         |
| ⌃⇧1     | Capture New Area    | drag an area, capture it, and keep it for ⌃⇧4               |
| ⌃⇧3     | Capture Full Screen | every display at once, one screenshot each                  |
| ⌃⇧2     | Capture One-Shot    | drag an area; not added to a session                        |
| ⌃⇧5     | Capture Options     | the capture bar; while recording or scrolling, Done         |
| ⌃⇧N     | New Session         | also forgets the area                                       |
| 1–6     | Pick a mode         | new area, window, full screen, last area, scrolling, record |
| ⌥O      | Options             | frame rate, timer, mouse pointer                            |
| ⇧⌘O     | Session or One-Shot | in the capture bar and the editor                           |
| ⇧⌘P     | Switch Session      | the session pop-up, in the capture bar and the editor       |
| ↩ / Esc | Done / Cancel       | while Capture Scrolling runs                                |
| ⇧⌘F     | Show All Frames     | in a recording, every frame or only key frames              |
| Space   | Play / Pause        | a recording's GIF, in the session window                    |
