# Findings: 2026-10-27-calm-style

## Milestone 1

From the screenshot review of the capture bar at `1e46df2`, listed in [validation.md](validation.md). Nothing is fixed yet: the owner decides each one.

| #   | Severity       | Source            | Finding                                                                                                                | Proposed                                                                                     | State               |
| --- | -------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ------------------- |
| 1   | High, blocking | F10, N1; shots    | The focus ring is orange `#e59700` in light (1.9:1 on the bar) and pale blue in dark. This Mac's focus colour is blue. | Take the ring colour from macOS's own accent, or use a token colour that reaches 3:1.        | open — owner review |
| 2   | High, blocking | N1; shots         | "To" before the session name is `#808080`: 3.2:1 in light, 4.3:1 in dark. Text needs 4.5:1.                            | Paint "To" in a grey that reaches 4.5:1, or in the normal text colour.                       | open — owner review |
| 3   | Medium         | A5, F12; shots    | The destination reads "To 2026-10-27 · Ledgerly…" and cuts the name. The mock reads "To Ledgerly Q4 review".           | Show the name without the date on the face. Keep the date in the pop-up's rows.              | open — owner review |
| 4   | Medium         | F11, Q4           | Keys live only in tooltips. Native tooltips may not show in this panel, so the keys could be undiscoverable.           | Hover each control on the owner's Mac. If no tooltip shows, the bar draws its own.           | open — owner review |
| 5   | Low            | owner rule; shots | Pressing 1–5 shows the focus ring on the chosen mode. The rule says a ring shows only after Tab.                       | Digits choose without the ring. Arrows and Tab keep it. Check that a mouse click shows none. | open — owner review |
| 6   | Low            | A5; shots         | With no session, or in One-Shot, a wide gap opens between the destination and Options. The mock keeps them together.   | Keep Options beside the destination, and let the spare room fall before them.                | open — owner review |
