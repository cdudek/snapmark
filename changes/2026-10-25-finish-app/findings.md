---
type: findings
change: 2026-10-25-finish-app
---

# Findings

One section per milestone. Blocking items first, advisory after. One fix round per milestone (`docs/sdlc.md`, One go).

## Milestone 1 — Editor polish and leftovers

Review of `origin/main...milestone/finish-app-1`, code and UX lenses, plus the milestone gate. 0 Critical, 0 High, 2 Medium, 7 Low.

### Blocking

- [x] **M1-1** (Medium) `src/viewer.ts`: after Remove from a grid tile's menu, focus fell to the page, so the next ↩ started a rename (snap-c5c, guideline A4). Fixed: the grid focuses the tile that took the removed one's place, or the Screenshots tab when none is left.
- [x] **M1-2** (Medium) the branch was not Prettier-clean (12 files), so CI's `format:check` would fail. Fixed: formatted and committed.
- [x] **G1** (gate) `test/smoke.ts` declared `oneKept` twice, so `tsc` failed. Fixed: the F134 value is `oneSelected`.
- [x] **M1-3** (Low, trust boundary) `editor:color` stored whatever the page sent. Fixed: only `#rrggbb` is kept.

### Advisory

- **M1-4** (Low) the toolbar row renders 59 px, not the spec's 52.
- **M1-5** (Low) the header's `overflow-x: auto` cuts 1 px off the top of the tool buttons' focus ring.
- **M1-6** (Low) the session label is about 4.2:1 on hover, in light and dark.
- **M1-7** (Low) the selected tool icon is about 2.6:1 in light mode; it predates this milestone.
- **M1-8** (Low) in Edit Again and one-shot the session label is a disabled menu button, which screen readers call "dimmed"; the spec says plain text.
- **M1-9** (Low) if a rename fails after the folder moved, `tryRename` says "Couldn't rename" while the app still points at the old name.
- The colour panel writes `state.json` on every drag event (part of M1-3); harmless, a debounce would do.

### Owner asks during the milestone, and what the gates found in them

- [x] **A14** top bar spacing and stacked icons (42fe719); **A15–A18** hex field, Custom row, round swatch, one keycap style (5ddf377).
- [x] **G2** (gate) the toolbar smoke script declared `toolBefore` twice in one in-page script. Fixed.
- [x] **G3** (gate) the A15 check relied on `blur()`, which fires no event in a hidden smoke window. The check now dispatches it, as F127's does.
- [x] **M1 gaps** packaged LC_UUID proven on two local builds; audit findings F028, F041, F043 fixed and F025, F027 confirmed; multi-selection drag undone as one step (04e0fe0).
