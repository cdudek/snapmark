# Microcopy

Made with `omr-dev:microcopy-write`. Language: en only (`sdlc.json` `languages`). Strings are inline in the code (no message catalogue), so each row names its file. No voice file exists (setup.md); the glossary proposal (`docs/ux/glossary-proposal.md`) and the shared `writing.md` apply. Snapmark is the owner's own tool, so OMR's external tone of voice does not apply.

Every new word in this change is read by the agent in `session.md`, and by the owner in the Document tab. No button, menu item, notification or dialog changes.

Placeholders: `<n>` is the screenshot's number without leading zeros ("7"), `<NNN>` with them ("007"), `<i>` the part's position from 1, `<total>` the number of parts (always 2 or more), `<ii>` the position with two digits ("01").

## Strings

| Where (file)                                                  | Before           | After                                                                                                                                                        | Note                                                                                                                                                                                                                                                                                                           |
| ------------------------------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| parts line, tall entry (`src/sessions.ts` `entry()`)          | none             | This screenshot is tall, so it comes in `<total>` parts. Read them top to bottom as one image; each part repeats a strip from the bottom of the part before. | J1, J2. Says what (one image), the order, and the overlap, so the agent neither counts a mark twice nor reads the parts as separate screenshots. "This screenshot", not "Screenshot 7": Reopen with a new number never has to rewrite it. Never starts with "1. ", so `entries()` does not count it as a note. |
| part alt text (`src/sessions.ts` `entry()`)                   | none             | Screenshot `<n>`, part `<i>` of `<total>`                                                                                                                    | extends the as-built "Screenshot `<n>`"; each part says where it sits on its own, so a part quoted out of context still places itself                                                                                                                                                                          |
| part path (`src/sessions.ts` `entry()`)                       | none             | img/`<NNN>`/`<ii>`.png                                                                                                                                       | a file path, not a word; listed because the agent reads it and `restoreShot()` rewrites it                                                                                                                                                                                                                     |
| PDF image alt, tall entry (`src/exporter.ts` `sessionHtml()`) | Screenshot `<n>` | Screenshot `<n>` (unchanged)                                                                                                                                 | the PDF shows the one image; the parts line is left out, it is for the agent                                                                                                                                                                                                                                   |

### Examples

- 11 parts: "This screenshot is tall, so it comes in 11 parts. Read them top to bottom as one image; each part repeats a strip from the bottom of the part before."
- 2 parts: "This screenshot is tall, so it comes in 2 parts. Read them top to bottom as one image; each part repeats a strip from the bottom of the part before."
- Alt text: "Screenshot 7, part 1 of 11" … "Screenshot 7, part 11 of 11".

## Alternatives considered for the parts line

| Option                                                                                                        | Why not                                                                                             |
| ------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| "Screenshot 7 is split into 11 tiles."                                                                        | "tiles" suggests a grid; says nothing about order or overlap                                        |
| "Parts 1–11 are one screenshot, top to bottom."                                                               | an en dash range reads badly aloud; no overlap; starts with a word the agent must map to the images |
| "This screenshot is tall, so it comes in 11 parts. Each part begins with the last 128 px of the part before." | a pixel count the agent cannot use and the part width would change it                               |
| no line, alt text only                                                                                        | the agent may read 11 images as 11 screenshots; the overlap would show marks twice without a reason |

## Not changed, on purpose

- Copy Prompt for AI (`src/main.ts` `promptFor()`): the parts line in each tall entry explains the parts, so `session.md` read without the prompt still explains itself. One home for the explanation.
- Every notification and status: "Screenshot 7 moved to Discarded. ⌘Z puts it back.", "Screenshot 7 is back in …", "· 7 screenshots", "7 of 7", "Saved <file>. It is not in the session.", "Marked-up image copied. It is not in the session.": a tall screenshot is one screenshot.
- "Text in the screenshot" (`sessions.TEXT_SUMMARY`): once per entry, after the last part.
- The "Moved an element: the dashed outline is where it is now, the arrow shows where it should go." sentence: unchanged; it still refers to the whole image the parts make.
- Folder name `img/007/` and the Discarded subfolder `parts/`: file names, not screens.
