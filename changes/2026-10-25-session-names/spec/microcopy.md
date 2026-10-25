# Microcopy

Made with `omr-dev:microcopy-write`. Language: en only (`sdlc.json` `languages`). Strings are inline in the code (no message catalogue), so each row names its file. No voice file exists (setup.md); the menu ADRs (title case, labels name their object) and the shared `writing.md` apply. Snapmark is the owner's own tool, so OMR's external tone of voice does not apply.

Placeholders below: `<date>` is "2026-10-24", `<time>` is "23:38", `<name>` is the owner's name for the session, `<display>` is the display name.

## Display name, one rule for every screen

| Folder name                   | Display name            | Why                                                                    |
| ----------------------------- | ----------------------- | ---------------------------------------------------------------------- |
| `2026-10-24 23.38`            | `2026-10-24, 23:38`     | owner's decision 2026-10-25: year first, four-digit year, colon time   |
| `2026-10-24 23.38 (2)`        | `2026-10-24, 23:38 (2)` | keeps the tell-apart suffix of two sessions made in one minute         |
| `2026-10-24 23.38 <name>`     | `2026-10-24 · <name>`   | owner's example; the middle dot is the separator the menu already uses |
| `2026-10-24 23.38 (2) <name>` | `2026-10-24 · <name>`   | the suffix stays in the folder, so the folder stays unique             |
| `<name>` with no stamp        | `<name>`                | renamed before this change; no date is invented                        |

## Strings

| Where (file)                                                     | Before                                                         | After                                                                       | Note                                                                                    |
| ---------------------------------------------------------------- | -------------------------------------------------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Switch Session ▸ last item (`src/menu.ts`)                       | Other Session…                                                 | Older Sessions…                                                             | A3; owner chose it 2026-10-25; ellipsis: it opens a panel                               |
| menu grey line (`src/menu.ts` via `label`)                       | 24 Oct 23.38 · 3 screenshots                                   | `<display>` · 3 screenshots                                                 | label comes from `shortName()`                                                          |
| Session ▸ Current Session line                                   | 24 Oct 23.38                                                   | `<display>`                                                                 |                                                                                         |
| Switch Session ▸ row                                             | 24 Oct 23.38                                                   | `<display>`                                                                 |                                                                                         |
| session window title bar (`src/main.ts` `openViewer`)            | 2026-10-24 23.38 — Snapmark                                    | `<display>` — Snapmark                                                      |                                                                                         |
| session window header (`src/viewer.ts`)                          | 2026-10-24 23.38                                               | `<display>`                                                                 |                                                                                         |
| rename field placeholder (`src/viewer.html`)                     | none                                                           | Name this session                                                           | shown when the field is empty; `aria-label` "Session name" stays the label              |
| rename hint, stamped session (`src/viewer.ts`)                   | ↩ to save · Esc to cancel                                      | The date stays · ↩ to save · Esc to cancel                                  | says up front that typing will not lose the date (A1)                                   |
| rename hint, no stamp                                            | ↩ to save · Esc to cancel                                      | unchanged                                                                   |                                                                                         |
| rename error, empty (`src/main.ts` `viewer:rename`)              | Enter a name.                                                  | unchanged, now only for a session with no stamp                             | an empty field on a stamped session removes the name                                    |
| Older Sessions… panel message (`otherSession`)                   | none                                                           | Session folders start with their date.                                      | the panel lists folder names; tells how to read them                                    |
| rename error, taken (`src/main.ts` `viewer:rename`)              | A session named `<name>` already exists.                       | `<display of the taken folder>` already exists. Choose another name.        | names the clash as the menu shows it, adds the next step; smoke checks "already exists" |
| Rename Session… prompt, stamped (`src/main.ts` `renameFromMenu`) | Rename session                                                 | Name this session. The date `<date>` stays in front.                        | the dialog has no hint line, so the prompt carries it                                   |
| Rename Session… prompt, no stamp                                 | Rename session                                                 | unchanged                                                                   |                                                                                         |
| Rename Session… default answer                                   | the folder name                                                | `<name>`, or empty for an unnamed session                                   |                                                                                         |
| rename refused, notification (`renameFromMenu`)                  | A session named `<name>` already exists.                       | `<display>` keeps its name: `<display of the taken folder>` already exists. | the dialog is gone; say which session and that nothing changed                          |
| editor window title (`src/main.ts`)                              | Snapmark — 2026-10-24 23.38                                    | Snapmark — `<display>`                                                      |                                                                                         |
| editor toolbar label (`src/editor.ts` `shotsLabel`)              | 2026-10-24 23.38 · 12 screenshots                              | `<display>` · 12 screenshots                                                | main sends `<display>`                                                                  |
| notification, New Session (`src/main.ts`)                        | New session: 2026-10-24 23.38                                  | New session: `<display>`                                                    |                                                                                         |
| notification, still empty                                        | 24 Oct 23.38 is still empty, so new captures keep going there. | `<display>` is still empty, so new captures keep going there.               |                                                                                         |
| notification, reopened screenshot                                | Screenshot 3 is back in 24 Oct 23.38.                          | Screenshot 3 is back in `<display>`.                                        |                                                                                         |
| notification, session missing                                    | 24 Oct 23.38 is no longer in ~/Documents/Snapmark              | `<display>` is no longer in ~/Documents/Snapmark                            | wording unchanged otherwise                                                             |
| Clear Sessions Older Than 60 Days… list                          | 24 Oct 23.38 (one per line)                                    | `<display>` (one per line)                                                  |                                                                                         |
| Discarded row, 7 days or older (`whenLabel`)                     | 18 Oct, 09:41                                                  | 2026-10-18, 09:41                                                           | Today, Yesterday and weekday labels stay                                                |
| PDF first heading (`src/exporter.ts`)                            | 2026-10-24 23.38                                               | `<display>`                                                                 | `session.md` itself keeps `# <folder name>`                                             |
| Save As… suggested name (`saveAsName`)                           | 24 Oct 23.38 013.png                                           | 2026-10-24 23.38 013.png (folder name)                                      | no colon in a file name                                                                 |

## Not changed, on purpose

- `session.md` first line `# <folder name>`: the intent's constraint.
- PDF and ZIP file names: the folder name already, and a colon cannot go in a file name.
- Older Sessions… panel: its title "Choose a session" is not shown by macOS; the button stays "Open"; only the message is added.
- Discarded folder names in Finder ("2026-09-26 13.05.12 · <folder> · screenshot 2"): file names, not screens.
