# Spec: capture bar label and keys, General comment and notes

> The capture bar names the icon under the pointer or the keyboard focus, with its key, in a label above the bar. Keys 1–4 pick a mode. The editor's notes column says which box is about the whole screenshot, and its notes stand apart.

Facts are in [facts.md](../facts.md), build rows in [plan.md](../plan.md). Every word on screen is in the Words tables below; copy them exactly. The rules these screens follow are in `docs/ux/interaction-guidelines.md` (this change's guide, A5).

## As built

- The bar's buttons carry `title` tooltips (`src/bar.html:105-139`, `src/bar.ts:21-24`). The owner never saw them (A1). The bar is a panel that never activates Snapmark, and macOS shows a `title` tooltip only in the active app. So a tooltip has to be drawn by Snapmark itself.
- Keys today: ← → ↑ ↓ move between modes, ↩ captures from a mode, Esc closes, Tab walks Close → mode → Options → Capture (`src/bar.ts:46-54`).
- The bar window is 56 pt high, bottom centre of the display with the pointer, 24 pt above the work area's bottom (`src/main.ts:327-330`). It draws the popover material over its whole rectangle.
- Editor: the top box has the placeholder "Add a comment…" and `aria-label="Comment"`, with no heading (`src/editor.html:726`, `src/editor.ts:1317`). Reference rows say "Note for 1" and sit with no gap between them, because `#refs` has no layout rule (`src/editor.ts:989`).

## Screen 1: capture bar label

A label in its own panel window, centred over the button it names, 8 pt above the bar's top edge. It shows for one button at a time.

| State                  | Trigger                                                                                        | Label shows                     |
| ---------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------- |
| hidden                 | the bar opens; the pointer is outside every button; a menu is open                             | nothing                         |
| pointer                | the pointer rests on a button for 300 ms                                                       | that button's label             |
| keyboard               | focus moves by a key (arrows, 1–4, Tab), not by the bar opening                                | the focused button's label      |
| moving between buttons | the pointer moves to the next button while a label shows                                       | the new label at once, no delay |
| stays                  | the pointer moves from the button onto the label, or across the 8 pt strip                     | the same label                  |
| gone                   | the pointer leaves the bar and the label, a click, Options opens, Esc, the bar closes, capture | nothing, at once                |

- Look: one line, 12 px system font, the name then the key as a keycap (the same keycap style as the Keyboard Shortcuts window). Padding 4 pt × 8 pt, radius 6 pt, popover material like the bar, a hairline border. Never wider than the display; it shifts sideways to stay on screen.
- It is part of the bar: it is excluded from every capture (content protection, closed before each capture), floats at the bar's level over full-screen apps, and never takes the focus.
- Hoverable (WCAG 1.4.13): clicks pass through it, but it still receives pointer moves (`setIgnoreMouseEvents(true, { forward: true })`), so the pointer can rest on it without it going. Esc dismisses it with the bar.
- Screen readers: each button keeps its `aria-label` as today, and gains `aria-keyshortcuts` with its key, the ARIA way to announce a key. The label window is not read; it repeats the name.

### Words

| Button            | Label                 | aria-keyshortcuts |
| ----------------- | --------------------- | ----------------- |
| Close             | Close `Esc`           | Escape            |
| Capture Window    | Capture Window `1`    | 1                 |
| Choose New Area   | Choose New Area `2`   | 2                 |
| Capture Last Area | Capture Last Area `3` | 3                 |
| Capture Scrolling | Capture Scrolling `4` | 4                 |
| Options           | Options               | none              |
| Capture           | Capture `↩`           | Enter             |

The Capture button keeps its own text from `barLabel` (`src/capture.ts:43`): "Capture", or "Capture One-Shot" when One-Shot is on. Its label repeats that text with `↩`. Capture Last Area's label adds the size or the first-time hint after a "·", as its `aria-label` does today: "Capture Last Area · 1280 × 800 `3`".

## Screen 1: capture bar keys

| Key     | Does                                                           | Today |
| ------- | -------------------------------------------------------------- | ----- |
| 1       | chooses Capture Window, moves focus there, shows its label     | new   |
| 2       | chooses Choose New Area                                        | new   |
| 3       | chooses Capture Last Area                                      | new   |
| 4       | chooses Capture Scrolling                                      | new   |
| ↩       | captures in the chosen mode, from a mode or the Capture button | same  |
| Esc     | closes the bar                                                 | same  |
| ← → ↑ ↓ | move between modes                                             | same  |

- A number only chooses; it never captures, as a click never does (macOS's ⇧⌘5 bar works the same way).
- The Keyboard Shortcuts window's "Capture bar" group lists `1–4  Pick a mode` (`src/keys.ts` KEY_GROUPS).

## Screen 2: editor notes column

```
General comment
┌──────────────────────────────┐
│ About the whole screenshot…  │
└──────────────────────────────┘

References
◆1 ┌──────────────────────────┐
   │ What about 1?            │
   └──────────────────────────┘
        12 pt
◆2 ┌──────────────────────────┐
   │ What about 2?            │
   └──────────────────────────┘
```

- "General comment" and "References" are both `<h2>` headings, looking as "References" does today (it is a `<label>` with no control now). "General comment" always shows in a session's editor and hides in one-shot mode, as the box does today.
- Names a screen reader hears: the comment's editable element (the Milkdown content inside `#caption`, not the wrapper) is `aria-labelledby` the "General comment" heading. Each reference note's editable gets the name "Note for reference 1" through a new `label` option of `MdNotes.mount`. The placeholder stays a visual hint only.
- 12 pt between reference rows. The 10 pt column gap between the comment, References and Beautify stays.
- Nothing saved changes: session.md still writes the comment and notes as today.

### Words

| Where                         | Today                    | New                               |
| ----------------------------- | ------------------------ | --------------------------------- |
| heading over the box          | none                     | General comment                   |
| the box's placeholder         | Add a comment…           | About the whole screenshot…       |
| the box's accessible name     | Comment (on the wrapper) | General comment (on the editable) |
| a reference's placeholder     | Note for 1               | What about 1?                     |
| a reference's accessible name | none                     | Note for reference 1              |

## Components

| Component                          | Status | Where                                                  |
| ---------------------------------- | ------ | ------------------------------------------------------ |
| Keycap                             | exists | `src/shortcuts.html` `kbd`, editor `keycap()`          |
| Capture bar panel                  | adapt  | `src/main.ts` `openCaptureBar`, `src/bar.*`            |
| Bar label window                   | new    | `src/main.ts` (window), `src/tip.html` + `src/tip.ts`  |
| Section heading (References style) | adapt  | `src/editor.html` `#refs-label`, becomes an `<h2>`     |
| Markdown note field                | adapt  | `src/md-notes.ts`: a `label` option names the editable |
