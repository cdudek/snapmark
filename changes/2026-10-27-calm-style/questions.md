# Questions: 2026-10-27-calm-style

Open questions met while building. Each has the default taken; the owner answers here.

## Q1 `data-surface="system"` on macOS only

- **Question:** F3 says every window sets `data-surface="system"`. Should Linux (CI's smoke run) set it too?
- **Default taken:** macOS only. `src/surface.ts` sets it when `navigator.platform` is a Mac, as `bar.ts` already decided vibrancy. Linux has no window material, so it keeps the tokens' web greys and the smoke test still renders.
- **Milestone:** 1
- **Answer:**

## Q2 The destination's face with no session yet, and its count

- **Question:** F12 gives two faces, "To <session> ▾" and "One-Shot ▾". What does it read before any session exists, and does it keep the session's screenshot count?
- **Default taken:** "No session yet ▾", as v0.24.0 said, since One-Shot would claim a choice the owner did not make. The face drops the count, as the mock does; the pop-up's rows keep it.
- **Milestone:** 1
- **Answer:**

## Q3 Where ⇧⌘O lives in the bar

- **Question:** the destination's tooltip is "Destination (⇧⌘P)" (spec). ⇧⌘O has no control of its own any more. Where is it shown?
- **Default taken:** beside One-Shot in the pop-up (a menu accelerator) and in `aria-keyshortcuts` on the destination; the tooltip stays as the spec words it.
- **Milestone:** 1
- **Answer:**

## Q4 Native tooltips in the non-activating bar

- **Question:** the bar is a non-activating panel; v0.24.0 drew its key captions because native tooltips did not show there (WIN-2). Do `title` tooltips show now that the bar is the key window?
- **Default taken:** `title`, as the brief says. If they do not show, the bar draws its own tooltip (the starter's recorded exception) in a later change.
- **Milestone:** 1
- **Answer:** the bar draws its tooltips, in the bar itself (owner, 2026-10-27, finding 4). See Q6 for where.

## Q5 Keyboard Shortcuts' words for the bar

- **Question:** the Keyboard Shortcuts rows still say "Session or One-Shot" (⇧⌘O), "Switch Session" (⇧⌘P) and "Tab moves on to Options, Capture and Session or One-Shot". Tab now goes to the destination, Options and Capture.
- **Default taken:** words wait for the wording change (out of scope); the keys and what they do are unchanged.
- **Milestone:** 1
- **Answer:**

## Q6 Where the drawn tooltip sits

- **Question:** the owner allowed the tooltip inside the bar window, or a window that grows while it shows. Which one?
- **Default taken:** inside the bar, beside the control (after it, else before it), over its neighbours as a native tooltip would be. A growing window would grow the frosted material too, and jump the row.
- **Milestone:** 1
- **Answer:**

## Q7 Capture's label for Scrolling in One-Shot

- **Question:** Capture's label follows the mode ("Start Scrolling"), and reads "Capture One-Shot" in One-Shot. What does Scrolling in One-Shot read?
- **Default taken:** "Capture One-Shot", so a One-Shot left on is never hidden (CAP-5), as the owner asked to keep it.
- **Milestone:** 1
- **Answer:**

## Q8 The panels' dimming and their white line

- **Question:** the countdown and the area picker dim the display (20 % and 30 % black) and outline the area in white with a dark shadow (F18). The tokens have no see-through colour, and no role for white or black. Which tokens do they use?
- **Default taken:** the primitives `--ds-primitive-color-neutral-0` (the line) and `--ds-primitive-color-neutral-950` (its shadow, and the dimming as a layer at 20 % or 30 % opacity). No colour literal, and the look is as before. A `scrim` role in the system would replace them.
- **Milestone:** 2
- **Answer:**

## Q9 The recording dot's colour

- **Question:** the recording control's dot was `#ff3b30` (light) and `#ff453a` (dark). The tokens have no `record` role; examples/snapmark.md names one as a Snapmark extra under `x`. Which token?
- **Default taken:** `--ds-color-error`, the system's red in light and dark. Registering `x.color.record` in `design/product.json` and rebuilding the tokens would replace it.
- **Milestone:** 2
- **Answer:**

## Q10 The recording control's "⌃⇧5 stops"

- **Question:** the owner rule says no shortcut captions; keys go in tooltips. The recording control shows "⌃⇧5 stops", and picked-designs' @F63 checks it. The control never takes the focus, so its tooltips may not show. Keep it?
- **Default taken:** kept, as dim caption text, so the one key that stops a recording stays in view. Done's tooltip also reads "Done (⌃⇧5)".
- **Milestone:** 2
- **Answer:**

## Q11 The editor's key captions

- **Question:** the editor showed ⌘1… under each tool, ⌘Z and ⇧⌘Z under Undo and Redo, and ⌘W after Discard. The owner rejected captions in the bar (milestone 1, finding 4). Where do the editor's keys go?
- **Default taken:** into drawn tooltips, as the bar's: the toolbar's controls and Discard draw "<name> (<key>)" under the control after a moment, or at once on a keyboard focus, with the words they had as `title`. Only the main button keeps its key (⌘↩, or ⌘C in One-Shot). The colour dots and Beautify's backgrounds keep their native `title` (names, no keys), and Edit Again's reason stays the wrapper's native `title`.
- **Milestone:** 3
- **Answer:**

## Q12 Dim text in the editor, the session window, Settings and Keyboard Shortcuts

- **Question:** the dim text role is GrayText (#808080), under 4.5:1 in light; milestone 2's finding 1 waits for the owner. What colour is secondary text here: notes, counts, hints, headings, placeholders and the greyed session pop-up?
- **Default taken:** the text colour for everything that must be read, placeholders and the greyed pop-up included (the pop-up still loses its chevron). A dim token that reaches 4.5:1 would bring the hierarchy back.
- **Milestone:** 3
- **Answer:**

## Q13 The editor's More menu

- **Question:** at the editor's minimum size the tools that do not fit go into a More (⋯) menu at the toolbar's end. Which tools go first, and how does a chosen tool inside it show?
- **Default taken:** the session name and the segments shrink first, as before; then the tools leave from the last (Edit image) towards Select. More sits at the right end, after the destination, and wears the soft pill while it holds the chosen tool. Its rows show the tool's icon, name and the key that always works (C, ⌘1–⌘7). A click, Space, ↩ or ↓ opens it; the arrows walk it; Esc closes it.
- **Milestone:** 3
- **Answer:**

## Q14 Beautify's sliders and chosen background

- **Question:** the sliders were filled with the accent, and the chosen background ringed in it. The accent is for the main button and for checks that are on. Which colour?
- **Default taken:** the text colour, for the sliders' filled part and the chosen background's ring.
- **Milestone:** 3
- **Answer:**

## Q15 The title-row logo

- **Question:** the editor's and the session window's logo was inline SVG with its own colours. F30 allows no colour literal in a page but the annotation palette.
- **Default taken:** the logo is `src/logo.svg`, the same drawing, shown as an image. It looks as before.
- **Milestone:** 3
- **Answer:**

## Q16 Settings' radio buttons and Timer pop-up

- **Question:** the owner rule fills checks and switches that are on with the accent, and keeps chosen states off it. Save to's two radio buttons are both. And the Timer pop-up's system bezel is an edge at rest. How do they look?
- **Default taken:** a radio that is on takes the accent with a white dot, as a check does (macOS draws them alike). The pop-up is a soft-filled button with its chevron, no bezel. The Settings window is 560 pt wide at 100 %, as before, and as tall as the tab shown.
- **Milestone:** 3
- **Answer:**

## Q17 How a window fits 130 %

- **Question:** F29 asks every window to fit at 130 % with nothing outside it. At its least size a window has 23 % less room at 130 %. Does the layout give way, or does the window grow?
- **Default taken:** the editor gives way by its More menu (F26), Settings and the bar size themselves, and the session window and Keyboard Shortcuts grow: their least size is 720 × 480 and 560 × 400 points of page, so 936 × 624 and 728 × 520 at 130 %. The scrolling and recording controls are bigger by the zoom. The zoom steps stay Chromium's (110 %, 120 %), and the last one stops at 130 %.
- **Milestone:** 3
- **Answer:**
