# Findings: 2026-10-27-calm-style

## Milestone 1

From the screenshot review of the capture bar at `1e46df2`, listed in [validation.md](validation.md). The owner chose a fix for each on 2026-10-27: "1+2 contrast, 3 name only, 5 + 6 small fixes, 4 drawn tooltips". The gate proves them.

| #   | Severity       | Source            | Finding                                                                                                                | Proposed                                                                                     | State                     |
| --- | -------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------- |
| 1   | High, blocking | F10, N1; shots    | The focus ring is orange `#e59700` in light (1.9:1 on the bar) and pale blue in dark. This Mac's focus colour is blue. | Take the ring colour from macOS's own accent, or use a token colour that reaches 3:1.        | fixed (owner, 2026-10-27) |
| 2   | High, blocking | N1; shots         | "To" before the session name is `#808080`: 3.2:1 in light, 4.3:1 in dark. Text needs 4.5:1.                            | Paint "To" in a grey that reaches 4.5:1, or in the normal text colour.                       | fixed (owner, 2026-10-27) |
| 3   | Medium         | A5, F12; shots    | The destination reads "To 2026-10-27 · Ledgerly…" and cuts the name. The mock reads "To Ledgerly Q4 review".           | Show the name without the date on the face. Keep the date in the pop-up's rows.              | fixed (owner, 2026-10-27) |
| 4   | Medium         | F11, Q4           | Keys live only in tooltips. Native tooltips may not show in this panel, so the keys could be undiscoverable.           | Hover each control on the owner's Mac. If no tooltip shows, the bar draws its own.           | fixed (owner, 2026-10-27) |
| 5   | Low            | owner rule; shots | Pressing 1–5 shows the focus ring on the chosen mode. The rule says a ring shows only after Tab.                       | Digits choose without the ring. Arrows and Tab keep it. Check that a mouse click shows none. | fixed (owner, 2026-10-27) |
| 6   | Low            | A5; shots         | With no session, or in One-Shot, a wide gap opens between the destination and Options. The mock keeps them together.   | Keep Options beside the destination, and let the spare room fall before them.                | fixed (owner, 2026-10-27) |

## Milestone 2

From the screenshot review of the panels and the bar with Record at `c0575fe`, listed in [validation.md](validation.md). No fixes yet: the owner decides.

| #   | Severity       | Source                 | Finding                                                                                                                                    | Proposed                                                                                                              | State               |
| --- | -------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- | ------------------- |
| 1   | High, blocking | N1; shots              | Dim text is GrayText `#808080`. "Esc cancels" is 3.95:1 on the countdown's white square. "⌃⇧5 stops" is about 3.2:1 light, 4.3:1 dark.     | Paint both in the normal text colour, as "To" in milestone 1. Or a dim token that reaches 4.5:1.                      | open — owner review |
| 2   | High           | A3; shots              | The scrolling control shows the recording dot and "0:00 of 0:30". `#status` outranks the rule that hides it. The before shots show it too. | Show the recording dot and clock only in the recording control. The status line then fits on one line.                | open — owner review |
| 3   | Medium         | A3; plan Revisions 2.2 | The bar's hint row is gone. So is "Snapmark scrolls the area for you", and Record's "up to 30 seconds · 10 fps".                           | Say it in the Scrolling and Record tooltips. Or open the scrolling control with "Snapmark scrolls this area for you". | open — owner review |
| 4   | Low            | A5, F12; shots         | With Scrolling chosen, "Start Scrolling" widens Capture. The face is cut to "To Ledgerly Q4 r…", at 100 % and 130 %.                       | Give the face its room before the label grows. Or label the button "Start".                                           | open — owner review |
| 5   | Low            | F18; shots             | At 130 %, the countdown's square covers a 300 × 200 area whole, so its white outline is hidden. At 150 % before, nearly so.                | Keep the square smaller than small areas, or place it beside them.                                                    | open — owner review |
