---
linear: none
type: intent
change: 2026-10-26-settings-updates
design: docs/designs/2026-10-26-design-settings-window.md
author: Claude (orchestrator)
status: approved
reviewed_by: Calvin Dudek
approved_at: 2026-10-26
created: 2026-10-26
---

# Intent: a Settings window that opens cleanly, says what the updater is doing, and installs updates

> The owner opens Settings and it looks like a Mac window from the first frame. The words are clear, and a check for updates shows what is happening right there. Restart to Update installs the new version.

## Asks

Every request that this change answers, in the asker's own words. Never paraphrased.

| #   | Date       | Source                                     | Words                                                                                                                                                                                                                                                        | Screen              | Resources |
| --- | ---------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------- | --------- |
| A1  | 2026-10-26 | owner, chat                                | "doesnt work. also the design of the menu looks awful" / "it doesnt update itself" / "clicked on update"                                                                                                                                                     | Settings › General  | none      |
| A2  | 2026-10-26 | owner, chat, with a screenshot of Settings | "clicking doesnt do anything" / "ok i quit it"                                                                                                                                                                                                               | Settings › General  | none      |
| A3  | 2026-10-26 | owner, chat                                | "also can we fucking rethingk the ux writing and settings menu, it looks weird, loads with white background, then gets pitchblack. ux writing is shit too and confusing. no indication if it is looking for upates, found any or if its the latest version?" | Settings, all panes | none      |
| A4  | 2026-10-26 | owner, 1.1 dialog                          | "Widen snap-bmr.25 (Recommended)", "L, new Settings design file", "Bug fix, milestone of one (Recommended)"                                                                                                                                                  | none                | none      |

## Job stories

Drafted by the agent from the asks; the engineer confirms them. Label every story with its evidence: **observed** (seen in data or a session), **reported** (someone said it), or **assumed** (nobody has seen it yet).

| #   | When …                               | I want to …                                                                | So I can …                              | Evidence                                                                                                                            |
| --- | ------------------------------------ | -------------------------------------------------------------------------- | --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| J1  | I open Settings in dark mode         | see it in its final colours from the first frame, in the Mac's window grey | trust it as a real Mac app              | reported, A3. Observed: the window has no background colour and shows before its page paints; the page paints `Canvas`, near black. |
| J2  | I click Check for Updates            | see in the window that it is checking, then the result                     | know whether I am on the latest version | reported, A2, A3. Observed: the result goes only to a system notification, which can be off or missed.                              |
| J3  | an update is found                   | see it download, then a Restart to Update button in the same place         | install it when I am ready              | reported, A3. Observed: the pane never shows a download or a ready update.                                                          |
| J4  | I click Restart to Update            | have Snapmark quit, install, and open again on the new version             | not quit it by hand                     | reported, A1, A2. Observed: ShipIt waited at 20:18 until the owner quit at 20:32 (2026-10-26). The same happened on 2026-10-25.     |
| J5  | a check or download fails            | read what went wrong in plain words, and try again                         | not wonder whether anything happened    | assumed. Observed: updater errors are logged only.                                                                                  |
| J6  | I read any label or note in Settings | understand it at once                                                      | change a setting without guessing       | reported, A3                                                                                                                        |

## Success measure

How we know after release that it worked. One number, where it is read, and the target.

- **Measure:** the owner updates to the next release from Settings without quitting by hand. **Read in:** Settings › General shows each step; afterwards the version in Settings. **Target:** on the first try, for the first release after this one ships.

## Problem

- **What is wrong or missing:** the Settings window flashes white, then turns near black. A check for updates shows nothing in the window. Restart to Update does not install. Several words are unclear.
- **Who feels it:** the owner, and anyone who uses Snapmark.
- **Evidence:** `openSettings()` creates the window without `backgroundColor` and shows it at once. `checkForUpdatesNow()` reports only through `notify()`. ShipIt logs show the install waiting for a manual quit, twice. Owner screenshot of Settings › General, 2026-10-26.

## Proposed outcome

What is true when this is done. Write it in the user's words. Do not say how.

- Settings opens in its final colours, light or dark, with no flash.
- Settings › General always says which version is installed, and whether it is the latest.
- A check shows checking, then up to date, a download, a ready update, or an error, in the window.
- Restart to Update quits Snapmark, installs, and opens the new version.
- Every label and note in Settings reads plainly; the words match the menu bar menu.

## Affected users and systems

| Kind    | Name                        | How                                                        |
| ------- | --------------------------- | ---------------------------------------------------------- |
| users   | everyone with Snapmark      | a clearer Settings window; updates install from one click  |
| service | electron-updater and ShipIt | the install is triggered once the update is really ready   |
| screen  | Settings (all three panes)  | background, update states, words                           |
| screen  | menu bar menu               | its update item uses the same words and states as Settings |

## Constraints

- **Must not change:** the bundle id and the Developer ID signature. The daily update check and install on quit stay ([Updates](../../docs/designs/2026-09-26-adr-updates.md)). The three panes stay ([Settings as a window](../../docs/designs/2026-10-25-adr-capture-bar-and-settings-window.md)).
- **Deadline:** none.
- **Rules that apply:** macOS-native look; app UI in brand blue `#2492FF`. Release per milestone. Never commit `.env` files.

## Open questions

Only questions the originator must answer. Everything else is inferred.

None. Defaults taken: the menu bar menu's update item follows the same states, and copy follows the existing glossary.
