# Prototype

## Form

skip -- the owner's picked mockups are the prototype (orchestrator, 2026-10-26). No new images were generated.

Codex image generation made these in three rounds on 2026-10-26. Chosen directions: capture workflow "02-bold, One clear next move" (shots 1–4), editor destination "02 Toolbar mode and scheme pop-up", recording review "03 Key frames".

Where an image and [screens.md](../screens.md) disagree, the spec wins. Each known difference is under Gaps Found.

## How To Open

| Gallery            | Command                                                             | Notes                      |
| ------------------ | ------------------------------------------------------------------- | -------------------------- |
| Capture workflow   | `open design-explorations/2026-10-26-capture-workflow/gallery.html` | Picked: 02-bold, shots 1–4 |
| Editor destination | `open design-explorations/2026-10-26-editor-target/gallery.html`    | Picked: 02-toolbar         |
| Recording review   | `open design-explorations/2026-10-26-recording-review/gallery.html` | Picked: 03-key-frames      |

## Screen State Matrix

Paths are relative to this file. "none" means no image; the spec's state table is the reference.

| Screen                     | State                             | 100 %                                                                                                                                        | 150 % | Notes                                                                                              |
| -------------------------- | --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ----- | -------------------------------------------------------------------------------------------------- |
| Capture bar                | default, Session, light           | [1-capture-bar--session](../../../../design-explorations/2026-10-26-capture-workflow/02-bold/shots/1-capture-bar--session.png)               | none  | Mode 2 label reads "Capture Area"; spec says "New Area"                                            |
| Capture bar                | Record chosen, Options open, dark | [2-capture-bar--record-options](../../../../design-explorations/2026-10-26-capture-workflow/02-bold/shots/2-capture-bar--record-options.png) | none  | Options shows "Save to"; spec drops it                                                             |
| Capture bar                | One-Shot chosen                   | none                                                                                                                                         | none  | Pop-up greyed, "Capture One-Shot ↩"                                                                |
| Capture bar                | Scrolling, manual                 | none                                                                                                                                         | none  | Hint only                                                                                          |
| Capture bar                | no area                           | none                                                                                                                                         | none  | Hint only                                                                                          |
| Countdown overlay          | 3, light                          | [3-countdown--3](../../../../design-explorations/2026-10-26-capture-workflow/02-bold/shots/3-countdown--3.png)                               | none  | Matches; menu bar shows the same digit (CAP-10)                                                    |
| Countdown overlay          | cancelled, Reduce Motion          | none                                                                                                                                         | none  | Nothing on screen / no animation                                                                   |
| Recording control          | recording, dark                   | [4-recording--running](../../../../design-explorations/2026-10-26-capture-workflow/02-bold/shots/4-recording--running.png)                   | none  | Stop square becomes a red dot (not a button)                                                       |
| Recording control          | near cap, processing              | none                                                                                                                                         | none  | Amber time; "Finding key frames…"                                                                  |
| Scrolling control          | auto, manual, fell back, lost     | none                                                                                                                                         | none  | Same panel as the recording control                                                                |
| Editor toolbar destination | Session, light                    | [1-editor--session](../../../../design-explorations/2026-10-26-editor-target/02-toolbar/shots/1-editor--session.png)                         | none  | Grey line under the pop-up dropped; Copy or Save stays                                             |
| Session pop-up             | open                              | [2-editor--destination-menu](../../../../design-explorations/2026-10-26-editor-target/02-toolbar/shots/2-editor--destination-menu.png)       | none  | Matches                                                                                            |
| Editor toolbar destination | One-Shot                          | none (today's one-shot editor for the Beautify panel)                                                                                        | none  | Beautify unchanged (A10)                                                                           |
| Editor toolbar destination | Edit Again                        | none                                                                                                                                         | none  | Both greyed; "Save Changes ⌘↩"                                                                     |
| Notes column               | spacing and hairline              | [1-editor--session](../../../../design-explorations/2026-10-26-editor-target/02-toolbar/shots/1-editor--session.png)                         | none  | Matches                                                                                            |
| Recording editor           | key frames                        | [1-editor--recording](../../../../design-explorations/2026-10-26-recording-review/03-key-frames/shots/1-editor--recording.png)               | none  | Captions, notes "Recording" block, Previous/Next dropped; toolbar destination missing in the image |
| Recording editor           | all frames, One-Shot              | none                                                                                                                                         | none  | State table only                                                                                   |
| Session window             | recording entry                   | [2-session--recording-entry](../../../../design-explorations/2026-10-26-recording-review/03-key-frames/shots/2-session--recording-entry.png) | none  | Tab keys ⌘1–⌘3 in the image are not in this spec                                                   |
| Session window             | 90 % first open                   | none                                                                                                                                         | none  | Size only                                                                                          |
| Hex fields                 | annotation, Beautify custom       | none                                                                                                                                         | none  | Text rule only                                                                                     |

Rejected, never used: [5-editor--session](../../../../design-explorations/2026-10-26-capture-workflow/02-bold/shots/5-editor--session.png) and [6-editor--one-shot](../../../../design-explorations/2026-10-26-capture-workflow/02-bold/shots/6-editor--one-shot.png) (A10).

## Moves

| Control                        | To screen                           | Type    |
| ------------------------------ | ----------------------------------- | ------- |
| ⌃⇧5                            | Capture bar (shot 1)                | forward |
| 1–6                            | Capture bar, mode chosen (shot 2)   | lateral |
| Options ⌥O                     | Options menu (shot 2)               | lateral |
| Capture ↩, Record              | Countdown (shot 3)                  | forward |
| after 1                        | Recording control (shot 4)          | forward |
| Done ↩                         | Recording editor (key frames 1)     | forward |
| Session pop-up                 | Destination menu (toolbar 2)        | lateral |
| Add to Session ⌘↩              | Session window entry (key frames 2) | forward |
| Esc on bar, countdown, control | nothing (no image)                  | back    |

## Gaps Found

| Gap                                                                                   | Spec file changed          | Status                                                                            |
| ------------------------------------------------------------------------------------- | -------------------------- | --------------------------------------------------------------------------------- |
| Mode 2 named "Capture Area" collides with ⌃⇧4's area                                  | screens.md, ia.md          | resolved: "New Area"                                                              |
| Options ▸ Save to duplicates the segmented control                                    | screens.md                 | resolved: dropped                                                                 |
| Stop square and Done do the same                                                      | screens.md                 | resolved: red dot                                                                 |
| Key frame captions cannot be known                                                    | brief.md No-Gos            | resolved: time only                                                               |
| Recording editor image lacks the toolbar destination                                  | screens.md                 | resolved: same toolbar as every editor                                            |
| Pop-up subtitle repeats the pop-up                                                    | screens.md                 | resolved: dropped                                                                 |
| No image for One-Shot, Edit Again, scrolling, errors                                  | interaction.md             | open: state tables are the reference; draw only if the owner asks                 |
| Bar modes in the picks are 1 Window … 5 Record; digits now match the global keys (Q8) | screens.md                 | resolved: 1 New Area, 2 Window, 3 Full Screen, 4 Last Area, 5 Scrolling, 6 Record |
| Recording control in the pick stops on ↩ and cancels on Esc                           | interaction.md, screens.md | resolved (Q9): ⓧ Cancel, Done, ⌃⇧5, menu bar icon; no plain key                   |
| Recording control in the pick shows area handles                                      | screens.md                 | resolved: outline only while recording                                            |
| Key-frames editor copies the GIF in One-Shot                                          | screens.md                 | resolved (Q10): Copy Filmstrip                                                    |
| Session entry labels "Filmstrip · for AI", "GIF · for people"                         | screens.md                 | kept as "Filmstrip · for the AI", "GIF · for people"                              |
