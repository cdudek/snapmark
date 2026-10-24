---
linear: none
type: intent
change: 2026-10-25-editor-native-look
design: null
author: calvin.dudek@omr.com
status: approved
reviewed_by: calvin.dudek@omr.com (roadmap and mockups, 2026-10-25)
approved_at: 2026-10-25
created: 2026-10-25
archived_at: 2026-10-25
---

# Intent: the editor's Native look (roadmap M1a)

## Problem

The editor uses one colour, rose red `#e11d48`, for both the app's own controls ("Add to session", focus) and the
marks on the screenshot, so the owner cannot tell app from feedback. The colour picker is a bare system input with no
presets. References are circles, unlike the logo; cards look like sticky notes; and the editor does not say how many
screenshots the session already holds.

> "Well, my buttons, the application buttons and so on, should be in the colour palette of the application, but the
> annotations should obviously be in the colour that I select." — owner, 2026-10-25

## Proposed outcome

The editor looks like the Native mockup (`design-explorations/2026-10-25-native-round-2/01-editor/shots/editor--in-use.png`,
solid blue button): app controls in brand blue `#2492FF` with quiet macOS neutrals, annotations in a colour picked
from ten presets or Custom…, references as diamonds, cards as speech bubbles, and "<session> · N screenshots" on the right
of the toolbar. Light and dark mode.

## Affected users and systems

The owner, in the editor window. `src/editor.html`, `src/editor.ts`, `src/tools.ts`, `src/main.ts` (init data, prompt
wording), `src/shared.d.ts`, `test/smoke.ts`, `README.md`. The session window is a separate change.

## Constraints

- Two colour systems, never mixed; remove marks stay coral red `#E5484D`, highlights stay yellow.
- No new dependency; the custom colour is the macOS colour panel through `<input type="color">`.
- Keyboard reachable palette; Esc closes it before it steps back in the editor.

## Open questions

None.
