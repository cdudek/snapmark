---
type: findings
change: 2026-10-26-interaction-guide-polish
created: 2026-10-26
---

# Findings

One section per milestone. Blocking items first, advisory after. One fix round per milestone (`docs/sdlc.md`, One go).

## Milestone 1 — interaction guide, capture bar label and keys, General comment

Reviews on the milestone diff (`origin/main...milestone/interaction-guide-polish-1`), from code. The app was not launched, by the owner's rule.

- UX and accessibility review, against the accepted guide, the spec, WCAG 2.2 AA and the Laws of UX.
- Code review: logic, races, IPC trust, leaks, smoke checks that could pass while a fact is false.
- The gate: format, lint, typecheck, unit tests and `smoke:background`.

Neither review found a Critical or High.

### Blocking

- [x] **G1** (gate) `test/guide.test.ts` and `test/smoke.ts` were not formatted. Fixed: prettier.
- [x] **G2** (gate) `tests/sdlc.test.ts` requires `spec/validation.md` to read `ready` and `approved`. The one spec pass read `not-ready`; its blocking items had been fixed before the plan gate. Fixed: a Resolution section names each fix, and the frontmatter records the owner's approval at that gate.
- [x] **M1** (code, UX; Medium) `src/bar.ts`: `byKey` never reset, so a click on a mode after any key press showed the label again. That broke "gone on a click". Fixed: a mousedown resets it.
- [x] **M2** (code; Medium) `src/main.ts` `leaveTip` returned early while the first label was still loading. The label then stayed after the pointer had left. Fixed: it tests `tipNow`.
- [x] **M3** (UX; Medium) `src/keys.ts`: `1–4` and `← →` both read "Pick a mode". Fixed: `← →` reads "Move between modes".
- [x] **M4** (UX; Medium) `src/editor.html`: notes stood further apart than the groups did, and a heading was as far from its box as from the group above. Fixed: 4 px from a heading to its box, 20 px between the comment and References.

### Advisory

- [x] **L1** (code) the 300 ms timer survived a move onto padding. Fixed: each button's mouseleave clears it.
- [x] **L2** (code) the label closed asynchronously after the bar's `closed` event. Fixed: it is destroyed synchronously on the bar's `close`.
- [x] **L3** (UX) a label kept its old words when `bar:state` changed the Capture text. Fixed: `render()` redraws it.
- [x] **L4** (UX) nothing hid the label from VoiceOver. Fixed: `aria-hidden` on its body.
- [ ] **L5** (code, UX) when the words change width, the label shows for one frame at the old size, then re-centres. Left: a frame, inferred, not seen.
- [ ] **L6** (code) F8 cannot check that clicks pass through, because Electron has no getter for `setIgnoreMouseEvents`. The code sets it; the owner's check on install covers it.
- [ ] **L7** (UX) the editor writes Return as ↵ (`⌘↵`), the bar as ↩. Left: the editor's keycaps belong to an earlier change; guide WRD-6 now says ↩.
- [ ] **L8** (UX) the agent's prompt does not say what "General comment" means. Left: not asked; session.md already places the comment above the notes.
- [ ] **L9** (UX) Options' label repeats its visible word. Left: the spec's Words table gives every button a label.
