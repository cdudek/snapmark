# Screens

Only what changes. Layout, sections and components of every window stay as built; no window gains a control. Final words are in [microcopy.md](microcopy.md); the Words tables below use them. The rule for "tall" and the part sizes are in [ia.md](ia.md).

Example used below: entry 7, a 1280 × 8000 scrolling capture, 11 parts.

## `session.md` entry of a tall screenshot

### Purpose

The hand-off to the agent (setup.md: "The output is a Markdown document including the images, organised as sessions"; scene 1). J1, J2.

### Header

| Title                      | Tabs | Actions |
| -------------------------- | ---- | ------- |
| `## 007 · 14:32`, as today | none | none    |

### Sections

| Order | Section                          | Purpose                                                        |
| ----- | -------------------------------- | -------------------------------------------------------------- |
| 1     | heading                          | number and time, as today                                      |
| 2     | parts line, one paragraph        | tells the agent the parts are one image, in order, overlapping |
| 3     | parts 1 to n, one paragraph each | the page at 1280 px wide, top to bottom                        |
| 4     | comment, notes, cards, moves     | once, as today                                                 |
| 5     | "Text in the screenshot"         | once, as today, recognised on the whole capture                |

Each part is its own paragraph (a blank line between) so the Document tab's Markdown editor keeps every image line as it is, as it does for the one image today.

The whole entry, as written to `session.md`:

```markdown
## 007 · 14:32

This screenshot is tall, so it comes in 11 parts. Read them top to bottom as one image; each part repeats a strip from the bottom of the part before.

![Screenshot 7, part 1 of 11](img/007/01.png)

![Screenshot 7, part 2 of 11](img/007/02.png)

…

![Screenshot 7, part 11 of 11](img/007/11.png)

Pricing table overflows on the right.

1. Cut off here
2. Should be bold

<details><summary>Text in the screenshot</summary>
…
</details>
```

A screenshot that is not tall keeps today's entry, byte for byte: `![Screenshot 7](img/007.png)`.

### Layout

| Zoom  | Columns | Widths                                                                        | Notes                                                          |
| ----- | ------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------- |
| 100 % | 1       | parts 1280 px wide (narrower captures: their width), each at most 898 px high | within 1568 px and 1.15 MP, so Claude never shrinks them again |
| 150 % | 1       | n/a: a file                                                                   | —                                                              |

### Lists

| List  | Columns         | Sort                        | Empty                                        |
| ----- | --------------- | --------------------------- | -------------------------------------------- |
| parts | image, alt text | top to bottom, `01` to `nn` | never: a tall screenshot has 2 parts or more |

### Controls

| Control | Component | Label | Key | Disabled reason | State source |
| ------- | --------- | ----- | --- | --------------- | ------------ |
| none    |           |       |     |                 |              |

### Filters

| Filter | Default | Options | Clear behaviour |
| ------ | ------- | ------- | --------------- |
| none   |         |         |                 |

### Words

| Where         | Text                                                                                                                                                  |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| parts line    | This screenshot is tall, so it comes in 11 parts. Read them top to bottom as one image; each part repeats a strip from the bottom of the part before. |
| part alt text | Screenshot 7, part 1 of 11                                                                                                                            |
| part path     | img/007/01.png                                                                                                                                        |

### Components

| Region     | Component                                         | Status      | Notes                                                      |
| ---------- | ------------------------------------------------- | ----------- | ---------------------------------------------------------- |
| entry text | `entry()` in `src/sessions.ts`                    | new variant | takes the number of parts; writes the parts line and links |
| files      | `addShot()`, `replaceShot()` in `src/sessions.ts` | new variant | write `img/NNN/` beside `img/NNN.png`                      |
| image      | `fitForAI()` in `src/main.ts`                     | new variant | a tall image is scaled to the part width, not shrunk whole |
| parts      | part layout (sizes and offsets), pure function    | missing     | new; tested in plain Node like `src/stitch.ts`             |

## Session window, Document tab

### Purpose

Read and edit `session.md` (setup.md: Session window, "Document tab (session.md rendered and editable)"). J1, J3.

### Header

As built: session name, count, [Document | Screenshots | Discarded], Open in Markdown App.

| Title    | Tabs                               | Actions              |
| -------- | ---------------------------------- | -------------------- |
| as built | Document · Screenshots · Discarded | Open in Markdown App |

### Sections

| Order | Section                | Purpose                                                 |
| ----- | ---------------------- | ------------------------------------------------------- |
| 1     | `session.md`, rendered | a tall entry shows the parts line and its parts stacked |

### Layout

| Zoom  | Columns | Widths                                            | Notes                                                                         |
| ----- | ------- | ------------------------------------------------- | ----------------------------------------------------------------------------- |
| 100 % | 1       | each part `max-width: 100%` (as `#doc img` today) | parts stack with paragraph spacing; each overlap strip shows twice, by design |
| 150 % | 1       | as 100 %                                          | as built                                                                      |

### Lists

| List | Columns | Sort | Empty |
| ---- | ------- | ---- | ----- |
| none |         |      |       |

### Controls

| Control  | Component | Label | Key | Disabled reason | State source |
| -------- | --------- | ----- | --- | --------------- | ------------ |
| none new |           |       |     |                 |              |

### Filters

| Filter | Default | Options | Clear behaviour |
| ------ | ------- | ------- | --------------- |
| none   |         |         |                 |

### Words

| Where      | Text                               |
| ---------- | ---------------------------------- |
| parts line | as in the `session.md` entry above |

### Components

| Region | Component                              | Status | Notes                                                              |
| ------ | -------------------------------------- | ------ | ------------------------------------------------------------------ |
| field  | `MdNotes.mount()` in `src/md-notes.ts` | have   | images in a subfolder resolve through the `<base>` the window sets |

## Session window, Screenshots and Discarded tabs

### Purpose

One screenshot at a time; put a removed one back (setup.md: Session window). J3.

### Header

| Title    | Tabs     | Actions  |
| -------- | -------- | -------- |
| as built | as built | as built |

### Sections

| Order | Section                          | Purpose                                     |
| ----- | -------------------------------- | ------------------------------------------- |
| 1     | grid, large view, Discarded rows | show `img/007.png`, the one image, as today |

### Layout

| Zoom  | Columns  | Widths   | Notes                                                                                          |
| ----- | -------- | -------- | ---------------------------------------------------------------------------------------------- |
| 100 % | as built | as built | same aspect as today, so nothing moves; the thumbnail (cover, top) is sharp instead of blurred |
| 150 % | as built | as built | as 100 %                                                                                       |

### Lists

| List           | Columns                   | Sort     | Empty    |
| -------------- | ------------------------- | -------- | -------- |
| grid           | thumbnail, heading, notes | as built | as built |
| Discarded rows | thumbnail, kind, when     | as built | as built |

### Controls

| Control             | Component | Label               | Key               | Disabled reason | State source |
| ------------------- | --------- | ------------------- | ----------------- | --------------- | ------------ |
| Edit Again          | as built  | Edit Again          | ⌘O                | as built        | as built     |
| Remove from Session | as built  | Remove from Session | ⌘⌫                | as built        | as built     |
| Reopen              | as built  | Reopen              | ⌘Z (last removed) | never           | as built     |

### Filters

| Filter | Default | Options | Clear behaviour |
| ------ | ------- | ------- | --------------- |
| none   |         |         |                 |

### Words

| Where | Text                                           |
| ----- | ---------------------------------------------- |
| all   | unchanged; a tall screenshot is "Screenshot 7" |

### Components

| Region           | Component                                | Status      | Notes                                                                                                       |
| ---------------- | ---------------------------------------- | ----------- | ----------------------------------------------------------------------------------------------------------- |
| grid, large view | `src/viewer.ts` `src(n)` → `img/NNN.png` | have        | unchanged                                                                                                   |
| Remove           | `removeShot()` in `src/sessions.ts`      | new variant | moves `img/NNN/` to the Discarded folder as `parts/`                                                        |
| Reopen           | `restoreShot()` in `src/sessions.ts`     | new variant | counts a leftover `img/<n>/` as taken; moves `parts/` back to `img/<n>/`; renumbers part links and alt text |
| count            | `count()` in `src/sessions.ts`           | have        | counts `img/*.png` only; the folder is not a PNG                                                            |
| number           | `nextNumber()` in `src/sessions.ts`      | have        | `readdirSync(img)` lists `007`, so 7 is never reused                                                        |

## Editor

### Purpose

Mark up one screenshot (setup.md: Editor window). No visible change. J3.

### Header

| Title    | Tabs | Actions  |
| -------- | ---- | -------- |
| as built | none | as built |

### Sections

| Order | Section  | Purpose  |
| ----- | -------- | -------- |
| 1     | as built | as built |

### Layout

| Zoom  | Columns  | Widths   | Notes                                         |
| ----- | -------- | -------- | --------------------------------------------- |
| 100 % | as built | as built | a tall image still fits the width and scrolls |
| 150 % | as built | as built | as built                                      |

### Lists

| List | Columns | Sort | Empty |
| ---- | ------- | ---- | ----- |
| none |         |      |       |

### Controls

| Control    | Component | Label      | Key | Disabled reason | State source |
| ---------- | --------- | ---------- | --- | --------------- | ------------ |
| Save As…   | as built  | Save As…   | ⇧⌘S | as built        | as built     |
| Copy Image | as built  | Copy Image | ⇧⌘C | as built        | as built     |

### Filters

| Filter | Default | Options | Clear behaviour |
| ------ | ------- | ------- | --------------- |
| none   |         |         |                 |

### Words

| Where                         | Text                                                                                                       |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Save As… / Copy notifications | unchanged ("Saved <file>. It is not in the session.", "Marked-up image copied. It is not in the session.") |

### Components

| Region         | Component                     | Status | Notes                                                                          |
| -------------- | ----------------------------- | ------ | ------------------------------------------------------------------------------ |
| Save As…, Copy | `outImage()` in `src/main.ts` | have   | calls `fitForAI()`, so a tall image comes out at the part width, the one image |

## PDF export

### Purpose

Hand the session to a person (setup.md: PDF and ZIP export, scene 2). J3.

### Header

| Title            | Tabs | Actions |
| ---------------- | ---- | ------- |
| as built (`# …`) | none | none    |

### Sections

| Order | Section | Purpose                                                       |
| ----- | ------- | ------------------------------------------------------------- |
| 1     | entry   | heading, the one image (`img/007.png`), comment, notes, cards |

### Layout

| Zoom  | Columns | Widths                  | Notes                                                                          |
| ----- | ------- | ----------------------- | ------------------------------------------------------------------------------ |
| A4    | 1       | image `max-width: 100%` | a tall image runs across pages as today ("tall images across pages", setup.md) |
| 150 % | n/a     | a PDF                   | —                                                                              |

### Lists

| List | Columns | Sort | Empty |
| ---- | ------- | ---- | ----- |
| none |         |      |       |

### Controls

| Control | Component | Label | Key | Disabled reason | State source |
| ------- | --------- | ----- | --- | --------------- | ------------ |
| none    |           |       |     |                 |              |

### Filters

| Filter | Default | Options | Clear behaviour |
| ------ | ------- | ------- | --------------- |
| none   |         |         |                 |

### Words

| Where      | Text                           |
| ---------- | ------------------------------ |
| image alt  | Screenshot 7                   |
| parts line | left out (it is for the agent) |

### Components

| Region | Component                            | Status      | Notes                                                                                                                                                                                                  |
| ------ | ------------------------------------ | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| body   | `sessionHtml()` in `src/exporter.ts` | new variant | before `marked`, swaps the part links of each screenshot for `![Screenshot 7](img/007.png)` and drops the parts line, keyed on the links so an entry edited in the Document tab still prints one image |

## ZIP export

| Where   | What                                                                   |
| ------- | ---------------------------------------------------------------------- |
| content | `session.md` and `img/` as today; `zip -r` already includes `img/007/` |
| code    | `exportZip()` unchanged                                                |
