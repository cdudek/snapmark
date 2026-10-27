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
- **Answer:**

## Q5 Keyboard Shortcuts' words for the bar

- **Question:** the Keyboard Shortcuts rows still say "Session or One-Shot" (⇧⌘O), "Switch Session" (⇧⌘P) and "Tab moves on to Options, Capture and Session or One-Shot". Tab now goes to the destination, Options and Capture.
- **Default taken:** words wait for the wording change (out of scope); the keys and what they do are unchanged.
- **Milestone:** 1
- **Answer:**
