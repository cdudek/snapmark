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
