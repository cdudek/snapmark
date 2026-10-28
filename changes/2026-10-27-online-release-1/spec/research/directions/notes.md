# Colour directions: notes and accent check

Three colour directions from `../calm-saas-colour.md`, drawn on the approved prototype (`spec/prototype/screens/feedback-view/shots/feedback-view--default.png`, `spec/prototype/screens/inbox/shots/inbox--populated.png`). Only colour, surfaces and depth change; layout and words are the prototype's. Coral `#E5484D` is unchanged in all 12.

## How the images were made

- Codex `codex exec -m gpt-6.1-sol` with `image_gen`, one run per image, run at the repo root. Prompts: `prompts/` (each `.ref` names the anchor image passed with `-i`).
- Light images are edits of the prototype anchor; each dark image is an edit of the same direction's light image, so light and dark share one layout.
- Every prompt quotes the direction's hex tokens for that mode and says where each one goes.
- Fixes: `prompts/fix-*.txt`, an `image_gen` edit followed by a PIL check. Codex reported using the PIL fallback on every fix: it recoloured only the faulty element's pixels and kept the anti-aliasing. It reported zero pixels changed outside those rectangles.

## Accent check

Method: the median colour in a fixed sample box per element, compared with the token by CIE76 dE. A pass is dE 6 or less; the old prototype drift `#0469F1` vs `#0F72DB` is dE 19.8. The feedback view has one filled accent, Approve v2. The inbox has no primary button, so its accent samples are the unread dots, the `All 6` chip (accent-subtle) and the selected nav row (sidebar-active). Canvas and sidebar are sampled as surface checks.

### A. Clear Sky

**`a-clear-sky/feedback-view--light.png`**: accent PASS. Drift: Approve v2 drawn #0066FD (dE 28.9), the known brighter-blue drift. Redone: #0F72DB.

- Approve v2 fill: #0f72db vs accent #0f72db, dE 0.0, pass
- canvas: #ebf1f7 vs canvas #f3f6fa, dE 2.4, pass
- sidebar: #ecf2f8 vs sidebar #eff3f8, dE 1.0, pass

**`a-clear-sky/feedback-view--dark.png`**: accent PASS. Drift: Approve v2 drawn #0970E4 (dE 6.9). Redone: #0F72DB.

- Approve v2 fill: #0f73db vs accent #0f72db, dE 0.8, pass
- canvas: #13181d vs canvas #0b1015, dE 3.6, pass
- sidebar: #080d13 vs sidebar #070b11, dE 0.7, pass

**`a-clear-sky/inbox--light.png`**: accent PASS. Drift: none.

- unread dot: #0974db vs accent #0f72db, dE 1.8, pass
- All 6 chip fill: #e5f1fe vs accent-subtle #e4f0ff, dE 1.1, pass
- sidebar-active: #e1e8f1 vs sidebar-active #e1e7ee, dE 1.1, pass
- sidebar: #edf3f8 vs sidebar #eff3f8, dE 0.7, pass

**`a-clear-sky/inbox--dark.png`**: accent PASS. Drift: Unread dots drawn #0872E9 (dE 8.4). Redone: #0F72DB.

- unread dot: #0e71db vs accent #0f72db, dE 0.8, pass
- All 6 chip fill: #0f2743 vs accent-subtle #152c48, dE 2.4, pass
- sidebar-active: #1c2229 vs sidebar-active #1d232c, dE 1.5, pass
- sidebar: #080b11 vs sidebar #070b11, dE 0.3, pass

### B. Paper and Ink

**`b-paper-and-ink/feedback-view--light.png`**: accent PASS. Drift: none.

- Approve v2 fill: #2b231a vs accent #25211d, dE 4.4, pass
- canvas: #f8f4ef vs canvas #f8f5f1, dE 0.7, pass
- sidebar: #f4f0e8 vs sidebar #f5f2ed, dE 1.7, pass

**`b-paper-and-ink/feedback-view--dark.png`**: accent PASS. Drift: none.

- Approve v2 fill: #ede5db vs accent #ebe7e0, dE 2.2, pass
- canvas: #1c1a16 vs canvas #110f0d, dE 5.3, pass
- sidebar: #0e0c0a vs sidebar #0c0b08, dE 0.6, pass

**`b-paper-and-ink/inbox--light.png`**: accent PASS. Drift: Unread dots drawn brownish #301F15 (dE 8.8), and the generator turned the Snapmark app icon grey. Redone: dots #25211D, icon back in colour.

- unread dot: #25211d vs accent #25211d, dE 0.0, pass
- All 6 chip fill: #ebe6df vs accent-subtle #ede9e2, dE 1.0, pass
- sidebar-active: #e9e4dd vs sidebar-active #eae6de, dE 0.9, pass
- sidebar: #f5f1ec vs sidebar #f5f2ed, dE 0.5, pass

**`b-paper-and-ink/inbox--dark.png`**: accent PASS. Drift: App icon turned grey again. Redone: icon back in colour.

- unread dot: #f4f2f0 vs accent #ebe7e0, dE 4.7, pass
- All 6 chip fill: #332f2a vs accent-subtle #302d29, dE 1.3, pass
- sidebar-active: #201e1a vs sidebar-active #25221f, dE 2.3, pass
- sidebar: #0e0c08 vs sidebar #0c0b08, dE 0.7, pass

### C. Iris

**`c-iris/feedback-view--light.png`**: accent PASS. Drift: Approve v2 drawn #543FEC (dE 16.2); Implemented chip word drawn in ink, not #005F98. Redone: #584BDB, chip word #005F98.

- Approve v2 fill: #584bdb vs accent #584bdb, dE 0.0, pass
- canvas: #f4f4fb vs canvas #f5f5fb, dE 0.6, pass
- sidebar: #eaecfe vs sidebar #eaebff, dE 1.1, pass

**`c-iris/feedback-view--dark.png`**: accent PASS. Drift: Approve v2 drawn #5C53FB (dE 17.6); Implemented chip word drawn off-white, not #8DCCF9. Redone: #6558E0, chip word #8DCCF9.

- Approve v2 fill: #6658e0 vs accent #6558e0, dE 0.2, pass
- canvas: #171721 vs canvas #0e0e18, dE 4.1, pass
- sidebar: #14132b vs sidebar #131128, dE 1.3, pass

**`c-iris/inbox--light.png`**: accent PASS. Drift: none.

- unread dot: #5144cb vs accent #584bdb, dE 5.4, pass
- All 6 chip fill: #e3e5fd vs accent-subtle #eaebff, dE 3.0, pass
- sidebar-active: #dee0fd vs sidebar-active #e3e3ff, dE 1.5, pass
- sidebar: #e9ebfe vs sidebar #eaebff, dE 0.6, pass

**`c-iris/inbox--dark.png`**: accent PASS. Drift: Unread dots drawn #6B5CF0 (dE 6.6). Redone: #6558E0.

- unread dot: #6557e0 vs accent #6558e0, dE 0.7, pass
- All 6 chip fill: #272552 vs accent-subtle #2b2751, dE 2.4, pass
- sidebar-active: #211f43 vs sidebar-active #201e3e, dE 2.8, pass
- sidebar: #131328 vs sidebar #131128, dE 1.6, pass

## Known limits

- Inbox thumbnails: their micro-text is illegible at 48 px, same as in the prototype.
- Chip words (status, kind, agent) were checked by eye and match their tokens. Only the accent elements, canvas and sidebar were measured.
- In light mode the three directions differ quietly by design: tint of canvas and sidebar, colour of the primary button and of the selected row. Dark mode shows the difference best.
- B (Paper and Ink) has no brand hue in the chrome, but the Snapmark app icon keeps its colours: it is the logo, not chrome.

Visual-pass ledger: `../../visual/directions/visual.json` (visual-check PASS).
