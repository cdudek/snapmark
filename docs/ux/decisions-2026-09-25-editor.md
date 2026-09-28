---
status: superseded
---

> Superseded by the audit of 2026-09-28: [findings](audits/2026-09-28/findings.md)

# Editor window: decisions

The owner's comments on the editor, 2026-09-25, are in [owner-words.md](owner-words.md#editor-window).
This file covers only what those comments raise. The rest of the audit waits for the full decision round.

## Group 1: the toolbar

The toolbar comes first: its shape decides where every tool sits and what each key does.

### Icons instead of words, every tool visible

**Decided 2026-09-25 by the owner:** "Accept (Recommended)"

- **Today:** eight word buttons: "1 Box ··", "2 Arrow ·", "3 Cross ··", "4 Tick ·", "5 Numbered ·",
  "6 Highlighter ··", "7 Cut & move", "V Select". Most tools (Ellipse, Pen, Crossed box, Remove
  area, Thumbs up, Card, Spotlight, Redact) only appear after pressing a key again. The toolbar fills
  its 1180 px minimum.
- **Recommended:** one small icon per tool, all visible, grouped by key; the key under each group; the
  name and key in a tooltip. Pressing a number still steps through that group's tools. The pen gets
  its own icon next to the arrow. Select is the pointer, with the tooltip "Select: click a mark to
  move, resize or delete it (⌫)".

  ```
   ↖ │ ❶ ▤ │ ▭ ◯ │ ↗ ✎ │ ✕ ⊠ ▨ │ ✓ 👍 │ ▰ ◐ │ ✂ ▦ │ ●  ↶
   V │  1  │  2  │  3  │   4   │  5   │  6  │  7  │ colour undo
  ```

- **Why it helps you:** you see every tool at once, and the bar takes about half its width today.
- **Downside:** icons must be learned; the tooltip carries the name.
- **Question:** Use an icon toolbar with every tool visible?
- **You said:** "Instead of having these named boxes at the top, it would be nice to see the actual tiny icons for what they actually do instead of the text." and "Maybe having Bow should also be a free drawing tool or something." — 2026-09-25

<details><summary>Supporting notes</summary>F113, F025, F024 (its "show the group name" recommendation is replaced by this), F078, F092, F089. The owner's "Bow" is read as "Box": a free drawing tool near the box. The pen exists as the second tool on 2.</details>

### "Reference" instead of "Numbered"

**Decided 2026-09-25 by the owner:** "Confirm (Recommended)"

- **Today:** the toolbar says "Numbered", the sidebar "References", the hint "numbered marker".
- **Recommended:** "Reference" everywhere: toolbar tooltip, sidebar, hint, README, copied prompt and session.md.
- **Question:** You asked for this already. Confirm "Reference" for the numbered circle, everywhere?
- **You said:** "Instead of numbered, it should be reference not numbered. This doesn't make any sense." — 2026-09-25

<details><summary>Supporting notes</summary>F185, F184, F187.</details>

### References first

**Decided 2026-09-25 by the owner:** "Accept (Recommended)"

- **Today:** the note group (Numbered → Card) is key 5, fifth of eight.
- **Recommended:** it becomes key 1; the others move down one: 2 Mark, 3 Draw, 4 Remove, 5 Approve,
  6 Highlight, 7 Edit image.
- **Downside:** every number you learned shifts once.
- **Question:** Move references and cards to key 1?
- **You said:** "I think Numbered should be further in the front." — 2026-09-25

<details><summary>Supporting notes</summary>F194.</details>

### Esc leaves a tool

**Decided 2026-09-25 by the owner:** "Accept (Recommended)"

- **Today:** with Card active every click makes another card. Esc only leaves a text field or
  deselects; the tool stays on.
- **Recommended:** Esc steps back one level: first out of the text, then deselect, then back to Select.
- **Alternative:** Esc goes straight back to Select, whatever is happening.
- **Question:** Esc steps back one level at a time?
- **You said:** "I should be getting out of this mode by pressing Escape or something." — 2026-09-25

<details><summary>Supporting notes</summary>F195, F086, F008, F022.</details>

## Group 2: the tools and the sidebar

### Redact

**Decided 2026-09-25 by the owner:** "Accept (Recommended)"

- **Today:** Redact is the third tool under Highlight. It pixelates the area you drag over.
- **Recommended:** Redact moves next to Cut & move, under 7 "Edit image", with the tooltip "Redact:
  pixelate to hide private details".
- **Question:** Move Redact next to Cut & move?
- **You said:** "What does Redact do?" — 2026-09-25

<details><summary>Supporting notes</summary>F026, F104.</details>

### A Dock icon while an editor is open

**Decided 2026-09-25 by the owner:** "Accept (Recommended)"

- **Today:** Snapmark never shows a Dock icon, so an editor behind other windows can only be found
  by moving other windows out of the way.
- **Recommended:** the Dock icon appears while any editor is open and goes away when the last closes.
- **Alternative:** no Dock icon; open editors listed in the menu bar menu.
- **Question:** Show the Dock icon while an editor is open?
- **You said:** "when the window is open there's no icon or anything at the bottom to show that it's open." — 2026-09-25

<details><summary>Supporting notes</summary>F181, F177.</details>

### Notes take the space they need

**Decided 2026-09-25 by the owner:** "Confirm (Recommended)"

- **Today:** each reference note is two lines high and cuts off longer text; the sidebar scrolls as a whole, buttons included.
- **Recommended:** each note grows with its text, the sidebar scrolls, and Discard and "Add to session" stay in a footer.
- **Question:** You asked for this already. Confirm the notes grow and the buttons sit in a footer?
- **You said:** "Our footer notes in the sidebar should actually take as much space as they need." — 2026-09-25

<details><summary>Supporting notes</summary>F196, F039, F040.</details>

### Sections only when used

**Decided 2026-09-25 by the owner:** "Accept (Recommended)"

- **Today:** an empty four-line Comment box and a References heading with a hint are always shown.
- **Recommended:** References appears with the first reference. The comment is a one-line "Add a comment…" field that grows as you type.
- **Alternative:** the comment is hidden behind a "+ Comment" button.
- **Question:** Show References only once one exists, and shrink the comment to one growing line?
- **You said:** "commenting and references only exist if I actually add them" — 2026-09-25

<details><summary>Supporting notes</summary>F197, F102, F023.</details>
