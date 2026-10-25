---
linear: none
type: facts
change: 2026-10-25-tall-capture-tiles
design: docs/designs/2026-10-25-adr-tall-screenshots-saved-as-parts.md
author: Claude (orchestrator)
status: draft
reviewed_by: null
approved_at: null
created: 2026-10-25
---

# Facts: tall captures as tiles

## Goal

A tall screenshot reaches the agent in parts at up to 1280 px wide, so it reads the page as well as a normal screenshot. Everywhere else it stays one screenshot with one number. One change, because the parts and the one image are written and moved together.

## Acceptance criteria

The system is Snapmark. "Tall", "part", "parts line" and "one image" are defined in [spec/ia.md](spec/ia.md); the decision is in the [ADR](../../docs/designs/2026-10-25-adr-tall-screenshots-saved-as-parts.md). Every word is in [spec/microcopy.md](spec/microcopy.md). Unit facts are plain-Node assert blocks in `test/*.test.ts`, one block per fact. Smoke checks in `test/smoke.ts` are keyed strings; CI runs them headless on every PR, never locally.

### Parts for the agent

- [ ] **F1** (A1, A4) When the owner adds a tall screenshot, the system shall save its parts as `img/NNN/01.png` onward, linked in order. Screen/state: `session.md` entry, tall. Tag: `test/sessions.test.ts` › "F1 tall entry".
- [ ] **F2** (A1, A2) The system shall make every part the screenshot's width, at most 1280 px, within 1568 px and 1,150,000 pixels. Screen/state: `session.md` entry, tall. Tag: `test/parts.test.ts` › "F2 part size".
- [ ] **F3** (A1, A4) The system shall treat a screenshot as tall only when fitting it whole leaves it narrower than two-thirds of its part width. Screen/state: `session.md` entry, fits and tall. Tag: `test/parts.test.ts` › "F3 tall rule".
- [ ] **F4** (A1) Each part after the first shall begin max(40 px, part width ÷ 10) above the end of the part before. Screen/state: `session.md` entry, tall. Tag: `test/parts.test.ts` › "F4 overlap".
- [ ] **F5** (A1, A3) The overlap shall be taller than a numbered diamond, so every diamond shows whole in at least one part. Screen/state: `session.md` entry, tall. Tag: `test/parts.test.ts` › "F5 diamond whole".
- [ ] **F6** (A1) A tall entry shall show the parts line, naming its number of parts, before the first part. Screen/state: `session.md` entry, tall. Tag: `test/sessions.test.ts` › "F6 parts line".
- [ ] **F7** (A1) Each part's alt text shall read "Screenshot 7, part 1 of 11", with that entry's number and count. Screen/state: `session.md` entry, tall. Tag: `test/sessions.test.ts` › "F7 alt text".
- [ ] **F8** (A3) The system shall write a tall entry's comment, notes, cards and recognised text once, after the last part. Screen/state: `session.md` entry, tall and tall with no text. Tag: `test/sessions.test.ts` › "F8 text once".
- [ ] **F9** (A1, A3) The system shall cut parts from the flattened image, so Redact marks and auto-redact reach every part. Screen/state: `session.md` entry, tall. Tag: manual, verifier reads `editor:save` in `src/main.ts`.
- [ ] **F10** (A1, A2) When the owner saves a 1280 × 8000 capture, every image its entry links shall be at least 1000 px wide. Screen/state: `session.md` entry, tall. Tag: smoke `viewer['F10 a saved 1280×8000 capture links parts at least 1000 px wide']` and `test/parts.test.ts` › "F10 1280×8000".
- [ ] **F11** (A1, A3) While a screenshot is not tall, the system shall save its image and entry as today, byte for byte. Screen/state: `session.md` entry, fits. Tag: `test/sessions.test.ts` › "F11 fits unchanged".
- [ ] **N1** (A1) The system shall scale and cut a 2560 × 20 000 capture in under 1 second. Tag: smoke `viewer['N1 a 2560×20000 capture is cut in under 1 s']`.
- [ ] **N2** (A1) The system shall never make more than 99 parts of one screenshot. Tag: `test/parts.test.ts` › "N2 at most 99 parts".

<details>
<summary>Scenario — F3, where a normal screenshot must stay whole</summary>

```gherkin
Scenario: the two-thirds rule — proves F3
  Given a 2560 × 4000 screenshot, which fits whole at 858 px wide
  And   a 2160 × 3840 screenshot, which fits whole at 804 px wide
  When  each is added to a session
  Then  the first is saved whole, because 858 ≥ 853 (two-thirds of 1280)
  And   the second is saved in 3 parts
```

</details>

<details>
<summary>Verification</summary>

- F1 — `test/sessions.test.ts`: `addShot` with 11 part buffers writes `img/007/01.png` to `img/007/11.png`; the entry links them in that order, one paragraph each.
- F2 — `test/parts.test.ts`: for every row of the spec/ia.md tables, `partWidth` ≤ 1280, part height ≤ 1568 and `partWidth × height` ≤ 1,150,000.
- F3 — `test/parts.test.ts`: every row of the two spec/ia.md tables; the scenario above.
- F4 — `test/parts.test.ts`: overlap 128 at 1280, 60 at 600, 40 at 300; parts one height; the last ends at the bottom edge.
- F5 — `test/parts.test.ts`: for capture widths 200 to 5120 px, the overlap beats `16 × unit` at the part width (`unit` from `src/editor.ts`).
- F6 — `test/sessions.test.ts`: the paragraph after the heading is the spec/microcopy.md parts line with "11"; with 2 parts it says "2".
- F7 — `test/sessions.test.ts`: alt texts read "Screenshot 7, part 1 of 11" to "Screenshot 7, part 11 of 11".
- F8 — `test/sessions.test.ts`: caption, notes, cards and "Text in the screenshot" each appear once, after the last part; `entries()` counts the notes only.
- F9 — manual: the verifier reads `editor:save`; parts come from the saved one image, which is the flattened PNG.
- F10 — smoke: a 1280 × 8000 PNG saved with ⌘S into its own session. Its entry links 11 images, each at least 1000 px wide. Unit: the layout of 1280 × 8000 is 11 parts of 1280 × 844.
- F11 — `test/sessions.test.ts`: `addShot` without parts writes today's entry exactly. Smoke keeps 'small image untouched' and 'large image shrunk'.
- N1 — smoke: `fitForAI` and `cutParts` on a 2560 × 20 000 PNG; the check prints the milliseconds.
- N2 — `test/parts.test.ts`: the layout of 1280 × `MAX_HEIGHT` has 26 parts; any layout with more than 99 throws.

</details>

### One screenshot

- [ ] **F12** (A3) The menu count and the editor label shall count a tall screenshot once. Screen/state: menu header, editor toolbar. Tag: `test/sessions.test.ts` › "F12 counted once".
- [ ] **F13** (A3) The system shall never give a tall screenshot's number to a new screenshot. Screen/state: `session.md`, numbering. Tag: `test/sessions.test.ts` › "F13 number kept".
- [ ] **F14** (A3) The system shall save a tall screenshot's one image as the whole page at the part width. Screen/state: Screenshots tab, large view, Discarded tab. Tag: smoke `viewer['F14 the one image is the whole page at 1280 px']`.
- [ ] **F15** (A3) When Edit Again saves a tall screenshot, the system shall replace its parts and entry, keeping none of the old parts. Screen/state: editor, Save changes. Tag: `test/sessions.test.ts` › "F15 Edit Again".
- [ ] **F16** (A3) If writing a part fails, then the system shall leave `session.md`, the one image and any old parts unchanged. Screen/state: editor, failed save. Tag: `test/sessions.test.ts` › "F16 failed write".
- [ ] **F17** (A3) When Edit Again saves an entry made before this change and now tall, the system shall write it with parts. Screen/state: editor, Save changes. Tag: `test/sessions.test.ts` › "F17 old entry".
- [ ] **F18** (A3) When the owner removes a tall screenshot, the system shall move its parts to Discarded with it. Screen/state: Screenshots tab, removed. Tag: `test/sessions.test.ts` › "F18 remove".
- [ ] **F19** (A3) When the owner reopens a tall screenshot under a new number, the system shall renumber every part file, link and alt text. Screen/state: Discarded tab, Reopen. Tag: `test/sessions.test.ts` › "F19 reopen renumbers".
- [ ] **F20** (A3) If the owner picks a removed screenshot's `parts` folder in Reopen Discarded…, then the system shall reopen that screenshot. Screen/state: Reopen Discarded… panel. Tag: manual, verifier reads `reopenDiscarded` in `src/main.ts`.
- [ ] **F21** (A3) When Edit Again saves a tall screenshot, the Document tab shall show the new parts, never cached old ones. Screen/state: Document tab, after Edit Again. Tag: manual, verifier reads the viewer's reload path.
- [ ] **F22** (A3) The PDF export shall show a tall screenshot as its one image, without its parts or the parts line. Screen/state: PDF export, tall and edited. Tag: `test/exporter.test.ts` › "F22 PDF one image".
- [ ] **F23** (A3) The ZIP export shall hold `session.md`, the one image and every part. Screen/state: ZIP export. Tag: `test/exporter.test.ts` › "F23 ZIP parts".
- [ ] **F24** (A3) In session mode, Save As… and Copy Image shall give the one image, not the parts. Screen/state: editor, session mode. Tag: manual, verifier reads `outImage` in `src/main.ts`.
- [ ] **F25** (A3) While the owner types in the Document tab, the system shall keep every part link as written. Screen/state: Document tab, typing. Tag: smoke `viewer['F25 typing keeps the part links']`.

<details>
<summary>Scenario — F19, where a renumbered part could keep its old path</summary>

```gherkin
Scenario: a tall screenshot comes back under a new number — proves F19
  Given entry 7 has 11 parts and was removed
  And   a new screenshot took number 7
  When  the owner reopens the removed screenshot
  Then  it comes back as entry 12 with parts img/012/01.png to img/012/11.png
  And   its alt texts read "Screenshot 12, part 1 of 11" to "Screenshot 12, part 11 of 11"
```

</details>

<details>
<summary>Verification</summary>

- F12 — `test/sessions.test.ts`: a session with one fitting and one tall screenshot has `count()` 2.
- F13 — `test/sessions.test.ts`: with `img/007.png` deleted and `img/007/` kept, the next number is 8.
- F14 — smoke: after the F10 save, `img/NNN.png` is 1280 × 8000.
- F15 — `test/sessions.test.ts`: `replaceShot` with 3 new parts over 11 old ones leaves exactly `01.png` to `03.png`, the entry links 3, and no `img/007.new/` stays.
- F16 — `test/sessions.test.ts`: for `addShot` and `replaceShot`, a failed part write leaves `session.md`, `img/007.png` and the old parts byte for byte. No new part file stays.
- F17 — `test/sessions.test.ts`: an entry with only the one-image link gets the parts line and parts after `replaceShot` with parts.
- F18 — `test/sessions.test.ts`: after `removeShot`, `img/007/` is gone and the Discarded folder holds `parts/01.png` onward.
- F19 — `test/sessions.test.ts`: the scenario above; reopened under its own number, the paths stay; a leftover `img/007/` alone counts as taken.
- F20 — manual: the verifier reads `reopenDiscarded`; a pick named `parts` resolves to its parent folder.
- F21 — manual: the verifier reads `load()` in `src/viewer.ts`; the image cache is cleared before the Document tab mounts again.
- F22 — `test/exporter.test.ts`: `sessionHtml` of a tall entry has one image tag, for `img/001.png`, none for `img/001/`, and no parts line. The same holds after a hand edit.
- F23 — `test/exporter.test.ts`: the ZIP listing holds `img/001.png` and `img/001/01.png` onward.
- F24 — manual: the verifier reads `outImage`; session mode returns `fitForAI`, the one image.
- F25 — smoke: in the F10 session's window, typing at the end of the Document tab keeps all 11 part links in `session.md`.

</details>

## Verification

- **Automated:** `npm run format && npm run lint && npm run typecheck && npm test` exits 0. CI runs `npm run smoke` on every PR; the milestone runs `npm run smoke:background`.
- **Manual:** the owner saves a real scrolling capture and hands `session.md` to an agent (intent success measure).

## Out of scope

- A tiled clipboard: Copy Image gives the one image, since the macOS clipboard holds one image.
- A setting for part width or for turning parts off.
- A scrolling, readable large view of a tall screenshot in the session window.
- Parts in the Screenshots tab, the PDF or Discarded, and a number per part.
- Rewriting entries saved before this change, other than through Edit Again (F17).
- A message when a save fails (F049, validation L23.2): an existing gap, kept as today.
- The interaction guideline and glossary row for "part": the next `omr-ux:guidelines` round.
- Copy Prompt for AI: unchanged, because the parts line explains the parts in `session.md` itself.

## Open questions

None open. The three confirmations for the plan gate (part width, token cost, parts in the Document tab) carry recommended answers in [spec/validation.md](spec/validation.md).
