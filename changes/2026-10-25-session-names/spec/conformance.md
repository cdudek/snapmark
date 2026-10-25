# Conformance

Spec mode, text-only: the prototype is skipped (`decisions.json` skips.prototype), so no image was judged and no visual pass ran.

Documents (step 0):

| Document                     | Found or missing            | Path                                             | What a missing one stopped                                            |
| ---------------------------- | --------------------------- | ------------------------------------------------ | --------------------------------------------------------------------- |
| Interaction guidelines       | found, all rules `proposed` | `docs/ux/interaction-guidelines.md`              | none; no rule is accepted, so every check below is against a proposal |
| Glossary                     | found as proposal           | `docs/ux/glossary-proposal.md`                   | none; a proposal, not decided                                         |
| Design system                | missing                     | setup.md: "none"                                 | no component or token check                                           |
| Voice and writing rules      | missing                     | setup.md: "none in the repo"                     | words checked against the shared `writing.md` only                    |
| Accepted decisions (ux ADRs) | found                       | `docs/designs/INDEX.md`, menu ADRs of 2026-09-26 | none                                                                  |
| Owner's words                | found                       | `docs/ux/owner-words.md`                         | none                                                                  |
| Screen goals                 | found                       | `docs/ux/setup.md` Screens and states            | none                                                                  |

## Interaction model

| Screen or state             | Rule                                                                                             | Result                 | Change or proposed rule                                                                                                       |
| --------------------------- | ------------------------------------------------------------------------------------------------ | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Menu, every label           | ADR "Menu labels name their object" (accepted): labels name their object                         | pass                   | "Older Sessions…" names its object                                                                                            |
| Menu, title case            | ADR "Menu rebuilt from the 2026-09-26 menu audit" (accepted): title case                         | pass                   | "Older Sessions…" is title case                                                                                               |
| Menu, native                | guideline A16 "Native first" (proposed)                                                          | pass                   | native menu, AppleScript dialog, macOS panel kept                                                                             |
| Switch Session count        | guideline "Search and find" (proposed): "twenty recent sessions plus "Other Session…" is enough" | departs                | owner's A4 and A3, 2026-10-25: 10 and "Older Sessions…"; listed below                                                         |
| Switch Session rows         | guideline "every row says what makes it different" (proposed): "Checkout review · 12 · 27 Sep"   | partly                 | rows now carry the date (J2); the count is not asked; listed below                                                            |
| Rename field                | guideline "rename in place" (proposed): ↩ saves, Esc cancels, checked inline                     | pass                   | unchanged; only the field's starting text and the hint change                                                                 |
| Rename                      | guideline line 283 (proposed): Rename has no undo                                                | pass                   | unchanged                                                                                                                     |
| Errors                      | `writing.md`: event · consequence · action                                                       | partly                 | "Enter a name." and "… already exists." stay as built; microcopy.md keeps them, the error rework is the glossary's next round |
| Navigation, Back            | ia.md move table                                                                                 | pass                   | every forward move has Cancel or Esc; no dead end                                                                             |
| Journeys vs frequency       | ia.md journeys                                                                                   | pass                   | the weekly J3 path (6 moves) is longer than the per-review J1 path (4)                                                        |
| Same element, other screens | session name shown in menu, session window, editor, notifications, PDF                           | pass after this change | one display rule everywhere; before it, the window showed the folder name and the menu "24 Oct 23.38"                         |

## Design system

No design system (setup.md). Not checked: tokens, type, spacing, surfaces. The spec adds no colour, size or surface; the hint reuses `#hint` and its existing error style.

| Area | Departure | Impact | Fix  |
| ---- | --------- | ------ | ---- |
| none | none      | none   | none |

## Component inventory

| Component                                | Status | Where the spec uses it                                   | Callers today                                                                                      | Implication for other screens                                    | Variant or new spec                                                                                                                         |
| ---------------------------------------- | ------ | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `sessions.shortName()` (display name)    | adapt  | menu header, Switch Session, notifications, Clear dialog | 13 references in 4 files: `src/main.ts`, `src/menu.ts`, `src/sessions.ts`, `test/sessions.test.ts` | every caller gets the year-first form at once; that is the point | new output: "2026-10-24, 23:38", "2026-10-24 · name"; legacy names unchanged                                                                |
| `sessions.rename()`                      | adapt  | session window field, Rename Session… dialog             | 3 files: `src/sessions.ts`, `src/main.ts` (`renameSession`), `test/sessions.test.ts`               | both rename routes keep the stamp                                | always keeps the stamp, with its " (2)" suffix; an empty name on a stamped session goes back to the bare stamp (validation fix, 2026-10-25) |
| name part of a folder name               | new    | rename field and dialog starting text                    | none                                                                                               | none                                                             | `sessions.namePart(folder)`: "" for unnamed, the name after the stamp, the whole folder name for legacy                                     |
| `sessions.saveAsName()`                  | adapt  | Save As… suggested name                                  | 2 files: `src/sessions.ts`, `src/main.ts`; tested in `test/sessions.test.ts`                       | Save As… uses the folder name: no colon in a file name           | folder name instead of the short name                                                                                                       |
| `sessions.whenLabel()`                   | adapt  | Discarded rows                                           | 2 files: `src/sessions.ts`, `src/main.ts` (`viewerData`); tested in `test/sessions.test.ts`        | Discarded rows only                                              | the 7-day branch reads "2026-10-18, 09:41"                                                                                                  |
| `menuTemplate()` / `MAX_LISTED`          | adapt  | Switch Session ▸                                         | `src/menu.ts`, `src/main.ts` (`popMenu`), `test/menu.test.ts`                                      | none outside the menu                                            | 10 rows, the current one always among them; "Older Sessions…" only when more than 10 exist; Switch Session greyed with no session           |
| `ViewerInit`                             | adapt  | session window title, header, rename field               | `src/shared.d.ts`, `src/main.ts` (`viewerData`), `src/viewer.ts`                                   | the session window only                                          | adds `label` (display name) and `name` (name part, field start)                                                                             |
| `'editor:session'` IPC and editor `init` | adapt  | editor toolbar label                                     | `src/main.ts` (`tellEditors`, editor init), `src/preload.ts`, `src/editor.ts`, `src/shared.d.ts`   | none                                                             | main sends the display name; editor code unchanged                                                                                          |
| `sessionHtml()`                          | adapt  | PDF first heading                                        | `src/exporter.ts`, `test/exporter.test.ts`                                                         | ZIP unchanged; `session.md` unchanged                            | the rendered first heading shows the display name                                                                                           |
| `renameFromMenu()` AppleScript dialog    | adapt  | Rename Session… dialog                                   | `src/main.ts` only                                                                                 | none                                                             | prompt text and default answer                                                                                                              |

## Words

| String                                       | Where                                          | Result                                                              | Proposed word                                                           |
| -------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| "Other Session…"                             | Switch Session ▸                               | replaced (A3)                                                       | "Older Sessions…"                                                       |
| "24 Oct 23.38" (short name)                  | menu, notifications                            | replaced (A2)                                                       | "2026-10-24, 23:38"                                                     |
| "2026-10-24 23.38" (folder name)             | session window, editor title, "New session: …" | replaced (A2)                                                       | "2026-10-24, 23:38"                                                     |
| "28 Sep 14:32"                               | glossary proposal, session name (display)      | departs from the proposal                                           | "2026-10-24, 23:38" (owner, 2026-10-25)                                 |
| "Rename session"                             | AppleScript prompt                             | adapt                                                               | "Name this session. The date 2026-10-24 stays in front." (microcopy.md) |
| "Name this session"                          | rename field placeholder                       | new; placeholder is not the label (aria-label stays "Session name") | keep                                                                    |
| "The date stays · ↩ to save · Esc to cancel" | rename hint                                    | new                                                                 | keep                                                                    |
| "18 Oct, 09:41"                              | Discarded row, 7 days or older                 | replaced (A2)                                                       | "2026-10-18, 09:41"                                                     |

## Screen goals, audience, taxonomy

| Screen                  | Goal (setup.md)                         | Audience scene    | Object or control home               | Result |
| ----------------------- | --------------------------------------- | ----------------- | ------------------------------------ | ------ |
| Menu ▸ Switch Session ▸ | switch back to an older session (Flows) | 1 overnight build | session list under Session ▸         | pass   |
| Session window          | read, edit, rename one session          | 1                 | rename lives in the header, as built | pass   |
| Editor                  | where the screenshot goes               | 1, 3              | label in the toolbar, as built       | pass   |
| PDF export              | share with a person                     | 2                 | title on the first page              | pass   |

Taxonomy: one object (session), one attribute added to the display (date stamp kept on rename). No new object.

## Deliberate inconsistencies

| Rule                                                                                                         | Where                                        | Why                                                                                                             | Owner decision needed                                                        |
| ------------------------------------------------------------------------------------------------------------ | -------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| glossary proposal: session name shows "28 Sep 14:32"                                                         | every screen                                 | owner's A2 and date decision of 2026-10-25                                                                      | none: decided 2026-10-25; the proposal row is stale                          |
| guideline proposal: "twenty recent sessions plus "Other Session…""                                           | Switch Session ▸                             | owner's A3, A4                                                                                                  | none: decided 2026-10-25                                                     |
| one name, two forms: `session.md` heading and file names keep the folder name; screens show the display name | session.md, Save As…, PDF and ZIP file names | intent constraint ("the session.md heading follows the folder name as today"); a colon cannot be in a file name | yes: confirm at the plan gate that `session.md` keeps "# 2026-10-24 23.38 …" |
| named sessions drop the time from their display name                                                         | every screen                                 | the owner's own example "2026-10-24 · Ledgerly Q4 review"                                                       | none: from the intent                                                        |
| the Older Sessions… panel lists folder names ("2026-10-24 23.38 …"), not display names                       | macOS folder panel                           | a native panel shows the file system; a Snapmark-made list is a new screen nobody asked for                     | none: the panel message says "Session folders start with their date."        |

## Missing guidelines

| Proposed rule                                                                                             | Home document                                    | Why needed                                                        |
| --------------------------------------------------------------------------------------------------------- | ------------------------------------------------ | ----------------------------------------------------------------- |
| Voice and writing rules for Snapmark (none exist)                                                         | `docs/ux/setup.md` names the file                | words are checked only against the shared `writing.md`            |
| Dates: screens write dates year first, "2026-10-24, 23:38"; file and folder names keep "2026-10-24 23.38" | `docs/ux/interaction-guidelines.md` (Words)      | one date form everywhere; this change sets it, no rule records it |
| Session names: screens use the display name; files use the folder name                                    | `docs/ux/glossary-proposal.md`, session name row | the ADR of this change records it; the glossary should follow     |
