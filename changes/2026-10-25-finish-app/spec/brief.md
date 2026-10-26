# Brief

Change `2026-10-25-finish-app`, size M. Asks from [intent.md](../intent.md).

## Owner Asks

| Ask | Source                                     | Words                                                                                                                                | Answered by                                         |
| --- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------- |
| A1  | beads snap-bmr.10 (M3 build agent)         | "A 1280x8000 page arrives ~250px wide after the 1568px downscale. Split into tiles in session.md."                                   | J1; parts in session.md                             |
| A2  | PR #61 body, limits (M3 scrolling capture) | "a very tall page is shrunk to 1568 px for the AI like every screenshot, so it arrives narrow (tiles would be a follow-up)."         | J1; parts at 1280 px wide                           |
| A3  | owner, docs/ux/owner-words.md, 2026-09-28  | "take a screenshot while scrolling down the area so we easily take a whole screenshot of everything and then concatenate it somehow" | J1, J2, J3; one screenshot, read whole by the agent |
| A4  | owner, chat, 2026-10-25                    | "Tall captures as tiles"                                                                                                             | J1                                                  |

Earlier briefs on the same screens, found in `docs/ux/` (all `proposed`, none accepted):

- interaction guidelines, "`session.md` explains itself": "Almost every Retina capture costs the agent about 1,530 tokens (F207)" and "The image size stays within the model's limits; a smaller default (1,000 px long edge) is the owner's choice". Parts stay within the limits one by one; their total cost is the price of reading a tall page (No-Gos, Risks).
- interaction guidelines, "Edit a thing where it is shown, and give every piece of text one home": the Document tab and Edit Again write the same entry. Parts links are made by Snapmark, like the image link today; Edit Again writes them again.
- sitemap (as built), Finder: "session folder = session.md · img/NNN.png · .edit/". This change adds `img/NNN/` for tall screenshots (ia.md, Sitemap).

## Job Stories

| Job                                                                                                                                                                                                                     | Audience scene                 | Asks answered  | Visible success                                                                                          |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ | -------------- | -------------------------------------------------------------------------------------------------------- |
| J1 When I save a scrolling capture of a long page into a session, I want the agent to read the whole page at the width it was captured, so I can get feedback on small text and layout.                                 | 1 Reviewing an overnight build | A1, A2, A3, A4 | a 1280×8000 capture's entry links 11 images, each 1280 px wide, top to bottom                            |
| J2 When I mark and note things far down a tall page, I want every numbered diamond to show whole next to what it marks, and every other mark to read across the cut, so I can trust the agent to act on the right spot. | 1 Reviewing an overnight build | A1, A3         | a diamond drawn across a cut line shows whole in one of the two parts; the notes are listed once         |
| J3 When I open the session window, Edit Again, export or remove a tall capture, I want it to stay one screenshot with one number, so I can work with the session as I always did.                                       | 1, and 2 Sharing with a person | A3             | "· 7 screenshots" counts it once; the Screenshots tab, the PDF and Discarded show one image, sharper now |

## Appetite

Size: M

## No-Gos

| No-go                                                                       | Source                                                 | Reason                                                                           |
| --------------------------------------------------------------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------- |
| Changing how a screenshot that fits is saved                                | intent.md Constraints ("Must not change")              | every normal screenshot stays byte for byte as today                             |
| Parts in the Screenshots tab, the PDF, Discarded, or as separate numbers    | intent.md Proposed outcome; J3                         | the owner works with one screenshot; parts are for the agent                     |
| Reusing an entry number, or a new number per part                           | intent.md Constraints                                  | numbers tie entries, images, .edit files and Discarded together                  |
| Recognised text, notes or cards once per part                               | intent.md Constraints ("stored once per entry")        | the agent would read them many times                                             |
| A setting for part width or for turning parts off                           | not asked; setup.md hard rules (shortcuts, on the fly) | one good default; a setting is a decision the owner never asked to make          |
| Cutting parts from the unredacted capture                                   | intent.md Constraints ("Must hold")                    | what is under a Redact mark must never reach session.md                          |
| A scrolling, readable large view of a tall screenshot in the session window | not asked                                              | the large view shows the whole page, as today; a follow-up if the owner wants it |
| Tiling the clipboard (Copy Image)                                           | macOS clipboard holds one image                        | Copy Image gives the one image; parts exist only in the session                  |

## Visible Success

The owner captures a long page with Capture Scrolling, marks a few spots far down, and adds it to the session. The menu says "· 7 screenshots": one more, as for any screenshot. In the session window the Screenshots tab shows one new thumbnail, sharp now; the Document tab shows the entry with one line saying it is a tall page in parts, then the parts, top to bottom, each the full width of the capture. The agent reading `session.md` quotes text from near the bottom of the page and names the note numbers in the right parts. The PDF shows the page as one image.

Cost, for the plan gate: a tall page costs the agent about 1,440 tokens per part, so about 15,800 tokens for an 8000 px page (11 parts) and up to about 39,600 for the tallest a scrolling capture makes (1280 × 20 000, 26 parts), against about 1,530 for a normal screenshot today. Boxes, arrows, cards, spotlights and move outlines that cross a cut continue in the next part's repeated strip; only the numbered diamond is guaranteed whole in one part, and card text is in the "- Card:" lines anyway.

## Ask Map

| Ask | Status   | Where answered                                                        | Reason if set aside |
| --- | -------- | --------------------------------------------------------------------- | ------------------- |
| A1  | answered | screens.md: session.md entry; interaction.md: Save; facts (Stage 2.8) |                     |
| A2  | answered | screens.md: session.md entry (part width); ia.md: part object         |                     |
| A3  | answered | screens.md: session window, PDF; interaction.md: J3 flows             |                     |
| A4  | answered | ia.md: part object; screens.md: session.md entry                      |                     |

## Open Questions

None that only the owner can answer. Each choice below has a recommended answer the plan gate can change.

| Question                                           | Recommended answer                                                                                                                           | Why it matters                                                                                                                             |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| How wide is a part?                                | the capture's width, at most 1280 px: a Retina page at its on-screen size up to 1280 points, the scale a normal Retina screenshot gets today | 1568 px reads a little sharper but costs about 60 % more parts and tokens per page (17 parts instead of 11 for a 2560 × 16 000 page; F207) |
| Which screenshots are cut into parts?              | only those that fitting whole would leave less than two-thirds as wide as their parts                                                        | below that gain, parts cost more tokens than they buy in reading; normal screenshots never qualify                                         |
| Does the Document tab show the parts or one image? | the parts: the Document tab is `session.md` as the agent reads it                                                                            | showing one image there needs a custom editor node and hides what the agent gets                                                           |
