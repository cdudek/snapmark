---
id: 2026-10-25-adr-tall-screenshots-saved-as-parts
title: 'Tall screenshots reach the agent as parts at up to 1280 px wide, and stay one screenshot everywhere else'
type: adr
status: accepted
created: 2026-10-25
supersedes: []
superseded_by: []
amended_by: []
tags: [ux, session, ai-handoff]
---

# Tall screenshots saved as parts

## Context

Every screenshot added to a session is shrunk as a whole to Claude's image limits: 1568 px on the long edge and about 1.15 megapixels (`fitForAI` in `src/main.ts`). A 1280 × 8000 scrolling capture therefore reaches the agent about 250 px wide, and the agent cannot read its text (beads snap-bmr.10, PR #61). The owner asked for tall captures as tiles (2026-10-25). The full UX plan is in the change folder `changes/2026-10-25-finish-app/spec/`.

## Decision

- **Which screenshots.** A screenshot is tall when fitting it whole would leave it narrower than two-thirds of its part width. Every other screenshot is saved exactly as today, byte for byte.
- **Part width.** The screenshot's width, at most 1280 px: a Retina page at its on-screen size, the scale a normal Retina screenshot gets today.
- **Part height.** At most 1568 px and at most 1,150,000 ÷ part width (898 px at 1280), so Claude never shrinks a part again.
- **Overlap.** Each part after the first repeats the last max(40 px, part width ÷ 10) of the part before: 128 px at 1280. That is taller than a numbered diamond, so every diamond is whole in at least one part.
- **Cut.** The fewest parts that cover the image, all one height, the last ending at the bottom edge. Parts are cut from the flattened, redacted image, so Redact marks and auto-redact reach every part.
- **Storage.** `img/NNN.png` is the one image: the whole page scaled to the part width, uncut. `img/NNN/01.png` onward are the parts, two-digit names. A tall screenshot has at least 2 and at most 99 parts; `MAX_HEIGHT` (20 000 px) caps a scrolling capture at 26.
- **`session.md` entry.** The heading as today; then one parts line, "This screenshot is tall, so it comes in 11 parts. Read them top to bottom as one image; each part repeats a strip from the bottom of the part before."; then one paragraph per part with alt text "Screenshot 7, part 1 of 11"; then the comment, notes, cards and recognised text once, as today.
- **Where the one image shows.** The Screenshots tab, its large view, the Discarded tab, the PDF export, Save As… and Copy Image in session mode. The menu count and the editor label count the screenshot once; its number is never reused.
- **Where the parts show.** `session.md`, the Document tab (it is `session.md` as the agent reads it) and the ZIP export.
- **Edit Again** writes the new parts to `img/NNN.new/`, then the one image and the entry, then swaps the folders, so nothing ever links to a missing part. An entry saved before this change gets parts the next time Edit Again saves it.
- **Remove and Reopen** move the parts folder with the screenshot (as `parts/` in its Discarded folder). Reopen under a new number renumbers every part link and alt text.

## Rejected

- **1568 px wide parts:** a little sharper, but about 60 % more parts and tokens (17 instead of 11 for a 2560 × 16 000 page).
- **Shrinking the whole image (today):** an 8000 px page arrives about 250 px wide and unreadable.
- **A grid of tiles:** a page scrolls one way; columns would cut lines of text in half. "Tile" also suggests a grid to the agent, so the word is "part".
- **Parts only, no one image:** the session window, the PDF, Save As… and Discarded need the whole page.
- **A new entry or number per part:** numbers tie entries, images, `.edit/` files and Discarded together; the owner works with one screenshot.
- **Parts in the PDF:** a person would see each overlap strip twice.
- **One image in the Document tab:** it needs a custom editor node and hides what the agent gets.
- **Cutting every image taller than 1568 px:** normal tall windows would be cut while they read fine whole; the two-thirds rule leaves them alone.
- **A setting for part width or for turning parts off:** nobody asked; one good default.
- **Cutting from the unredacted capture:** what is under a Redact mark must never reach `session.md`.

## Consequences

- A tall page costs the agent about 1,440 tokens per part: about 15,800 for an 8000 px page, up to about 39,600 at 20 000 px, against about 1,530 for a normal screenshot.
- The same pixels sit twice on disk and in the ZIP: the one image and its parts.
- Save As… and Copy Image in session mode give the whole page at 1280 px wide instead of the shrunk strip.
- Entries saved before this change stay as they are until Edit Again saves them.
- A session with several very tall screenshots holds many images. The Claude API allowed up to 100 images per request and claude.ai fewer when last checked; this was not re-verified.
- The interaction guidelines' token note (about 1,530 tokens per capture) no longer holds for tall screenshots; the guidelines and the glossary row "part" follow in the next `omr-ux:guidelines` round.

## Milestones

- `milestone/finish-app-3`: change `2026-10-25-finish-app`, milestone 3 of 4, beads snap-bmr.10.
