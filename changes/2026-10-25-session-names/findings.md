---
type: findings
change: 2026-10-25-session-names
milestone: session-names
pr: https://github.com/cdudek/snapmark/pull/81
reviewed_head: 4de448dc416213ff6a65495eb43182091c505ff6
created: 2026-10-25
---

# Milestone findings: session-names

One list for the milestone diff (`origin/project/launch...milestone/session-names`), from one round of each check. Blocking items are fixed in the one fix round; advisory items stay here and in beads, not in code.

## Checks that ran

- **UX review** (`omr-ux:review` on PR 81: documents, conformance, laws L1–L30 and B1–B14, WCAG 2.2 accessibility, responsive, ux-reviewer, heuristics, lenses, e2e coverage, sitemap, spec): Critical 0, High 5, Medium 11, Low 90, Design choice 4.
- **Code review** (`omr-dev:pr-review pr` + REVIEW.md): Critical 0, High 0, Medium 1, Low 1. REVIEW.md tally IMPORTANT 0, NITS 2.
- **Facts and job stories** (verifier + ac-auditor): 21 of 21 facts met; J1–J3 served; one neighbouring-flow break (B1 below).
- **Build against spec** (`omr-ux:validate build`, [spec/qa.md](spec/qa.md)): 26 of 27 strings match; 0 Critical, High or Medium; 6 Low.
- **E2E:** CI runs the full smoke suite on every push (xvfb). Locally, once, as `npm run smoke:background` inside the milestone gate.
- **Security review:** not run. The milestone touches no auth, money or consent.
- **Whole-app `omr-ux:audit` and `responsive-audit` matrix:** not run separately. The milestone changes two surfaces, both covered by the UX review's responsive and accessibility passes. The last whole-app audit is `docs/ux/audits/2026-09-25/`.

## Visual pass: BLOCKED

The owner forbids launching Electron windows, running `npm run smoke` outside the once-per-milestone background run, and capturing the screen. The menu bar menu, notifications, the osascript Rename dialog and the folder panel cannot be scripted anyway (`docs/ux/setup.md`). Every UX verdict is from code. Nothing here claims how a screen looks. The gate runs without `--visual-check` for that reason.

## Blocking (fixed in the one round)

| #   | Source                    | Impact        | Where                                             | Finding                                                                                                                              | Fix                                                                                   |
| --- | ------------------------- | ------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| 1   | UX WCAG-1.4.3             | High          | src/viewer.html `#rename`                         | "Name this session" placeholder is 3.1:1 in dark mode                                                                                | `#rename::placeholder { color: var(--muted) }`, about 5:1 in both themes              |
| 2   | UX WCAG-1.4.11            | High          | src/viewer.html, src/editor.html `:focus-visible` | Light-mode focus ring 2.96:1 on the header                                                                                           | New `--focus` token: #0f72db light, #2492ff dark                                      |
| 3   | UX WCAG-1.4.10            | High          | src/viewer.html `#rename`, `#hint`                | At 320 px the 240 px field and the never-wrapping hint do not fit                                                                    | Field shrinks (`min-width: 0`); hint wraps within the window                          |
| 4   | UX WCAG-2.4.2             | High          | src/exporter.ts `sessionHtml`                     | The PDF carries no title                                                                                                             | `<title>` with the display name; asserted in test/exporter.test.ts                    |
| 5   | UX WCAG-1.3.1             | High          | src/exporter.ts `exportPdf`                       | PDF untagged: headings and lists lose structure                                                                                      | `generateTaggedPDF: true`                                                             |
| 6   | Facts B1, UX QA-F19       | Medium (data) | src/sessions.ts `rename`                          | A rename overwrote the first `# ` line anywhere in session.md, so an owner's heading further down was silently replaced (breaks F19) | Only a heading on the first line is replaced; test in test/sessions.test.ts           |
| 7   | Code review               | Medium        | src/sessions.ts `rename`                          | A change of letter case only was refused as "already exists", naming the session itself                                              | A case-only change is not "taken"; test in test/sessions.test.ts                      |
| 8   | UX A11Y-focus-return, B13 | Medium        | src/viewer.ts                                     | After ↩ or Esc ends a rename, focus fell to the window                                                                               | ↩ (when saved) and Esc focus the title again; a click away leaves focus where it went |

## Advisory (not in code this round)

Ticketed before this milestone, in snap-bmr.14.3:

- An empty name in the menu's Rename Session… on an unstamped session closes silently (src/main.ts:777); the window says "Enter a name.".
- A taken name in the menu dialog shows only a notification after the dialog closed, so the typed text is lost (src/main.ts:779).
- Spec files still say session.md keeps `# <folder name>` (spec/microcopy.md:45,50, spec/screens.md:343) and disagree on the menu's taken-name wording (spec/interaction.md:100).

New, filed in beads as snap-ua7:

- **Header shrink order** (UX Medium, src/viewer.html:97): at 1100 px a name over about 32 characters makes "Open in Markdown App" wrap onto 2–3 lines. Fix: only `.name` shrinks.
- **"(n)" typed at the start of a name** (Low, three reviews, src/sessions.ts:38,56-61): read as the same-minute suffix ("(2) Ledgerly" shows "Ledgerly").
- **A failed rename is silent** (Low, src/main.ts:773-780, src/viewer.ts): a folder moved in Finder or a permissions error gives no message.
- **Docs still say "Other Session…" and "twenty recent sessions"** (Low): docs/ux/glossary-proposal.md:58, docs/ux/interaction-guidelines.md:176,488,506,579,586.
- **Smoke tags assert less than their facts** (Low): F3 checks no empty editor; F8 checks no window title; F13 has no test joining last-use order (src/main.ts:711) and the menu.
- **Plan bookkeeping** (Low): README.md, docs/ux/setup.md, .gitignore and src/editor.html changed outside the plan's file table (each explained in ## Revisions); the menu test fixtures still use the old labels (test/menu.test.ts:15-17).
- **Missing design documents** (UX Medium DOC-design-system, DOC-exceptions, DOC-glossary): no design system, exceptions register or accepted glossary. Owner's call; `omr-ux:init` drafts them.
- The remaining 80-odd UX Lows and 4 Design choices are in the run report (`omr-ux:review` round 1 of PR 81) and need no code now.

## Open blocking items

None. All eight are fixed at the head that the gate names.
