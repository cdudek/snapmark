---
type: design-ia
change: 2026-10-25-mac-shortcuts
created: 2026-10-25
---

# Information architecture

Size M presets `ia` as skipped. This file exists for one reason: ⌃⇧5 is a new entry point. Nothing else in the IA changes.

## What does not change

- No new screen, window, route, object or name.
- The menu bar menu keeps its rows and order. Only the key shown on Capture Screenshot… changes, and Capture Options reads "(shortcut unavailable)" when ⌃⇧5 is taken.
- Back and close work as today in every window.
- The session window's views (Document, Screenshots grid, one screenshot, Discarded) and their order stay.

## Sitemap delta

`docs/ux/sitemap.md` is already stale on keys: it still shows ⌃⇧2 New Session and ⌃⇧1. The delta is written against the build as it is today.

| Place in `docs/ux/sitemap.md`  | Today (as built)                          | After                                                                                        |
| ------------------------------ | ----------------------------------------- | -------------------------------------------------------------------------------------------- |
| ENTRY POINTS, capture          | ⌃⇧1 Capture Screenshot                    | ⌃⇧4 Capture Screenshot (works in every app; "(shortcut unavailable)" if another app owns it) |
| ENTRY POINTS, new              | none                                      | ⌃⇧5 Capture Options ──► the four options as a menu at the menu bar icon                      |
| ENTRY POINTS, session          | ⌃⇧2 New Session (stale)                   | ⌃⇧N New Session                                                                              |
| ENTRY POINTS, last area        | ⌃⇧3 Capture Same Area                     | ⌃⇧3 Capture Last Area (unchanged key)                                                        |
| MENU, Capture Screenshot row   | Capture Screenshot ⌃⇧1                    | Capture Screenshot… ⌃⇧4                                                                      |
| Named or reachable two ways    | "The editor: ⌃⇧1, ⌃⇧3, …"                 | "The editor: ⌃⇧4, ⌃⇧3, ⌃⇧5 ▸ Capture Options, …"                                             |
| Session window, one screenshot | Edit Again, Remove from Session (pointer) | also ⌘O and ⌘⌫                                                                               |
| Session window, header         | click the name or the pencil to rename    | also ↩                                                                                       |

## New entry point

```
⌃⇧5 (anywhere) ──► popup menu at the menu bar icon
                    ├── Choose New Area…   ──► Area picker ──► captures ──► Editor
                    ├── Capture Window…    ──► macOS window capture ──► Editor
                    ├── Capture Scrolling… ──► Area picker (scroll) ──► Done ──► Editor
                    ├── ─────────
                    └── One-Shot Capture…  ──► macOS capture overlay ──► Editor (one-shot)
                    Esc or a click elsewhere ──► menu closes, nothing else
```

The popup holds the same four items as the menu's Capture Options submenu. Each leads where it leads from the menu today.
