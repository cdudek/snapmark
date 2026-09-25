---
type: ux-setup
updated: 2026-09-25
---

# UX setup: Snapmark

Every `ux:` skill reads this file first. Keep it short and true.

## The product

- **What it is:** a macOS menu bar app that captures a screen region, lets you mark it up, and appends it with your notes to a Markdown session an AI agent can read.
- **Platform:** desktop — Electron 44, macOS only. Menu bar app (no Dock icon).
- **Audience file:** none; the owner confirmed these scenes on 2026-09-25 ("I think this are the main use cases").
  1. **Reviewing an overnight build:** a complete UX/UI review of what an agent built overnight, with detailed feedback on many different elements, captured on the fly with shortcuts, then handed to Claude Code. The main scene.
  2. **Sharing with a person:** the same session as a PDF or ZIP for a teammate or stakeholder.
  3. **A quick verdict:** mark what should go and what should stay (red remove, green approve) on one screenshot.
- **Jobs to be done:** point at something on screen precisely; say what should change; collect it in one file per piece of work; hand it to an AI in a token-efficient way.
- **Products the audience already uses** (for pattern research, owner's answer 2026-09-25): macOS Screenshot (the built-in `⌘⇧4`/`⌘⇧5` markup), Figma, Ocra (as written), Xnapper.

## The rules it must follow

- **Design system:** none. The editor's colours are CSS tokens in `src/editor.html` (`--accent: #e11d48`); app and menu bar icons in `assets/`.
- **Glossary:** none yet — `docs/ux/glossary-proposal.md`.
- **Voice and writing rules:** none in the repo.
- **Hard rules** that override UX preferences (from the owner's words):
  - Everything must be doable on the fly with shortcuts.
  - The output is a Markdown document including the images, organised as sessions.
  - macOS first; Electron + TypeScript.
  - Remove marks are always red and approve marks always green.

## The owner's words

- **File:** `docs/ux/owner-words.md` — every request, verbatim, dated. Quote from it; never cite a request by number.

## Where the UX files live

| File                                                 | Path                                                                        |
| ---------------------------------------------------- | --------------------------------------------------------------------------- |
| Audits                                               | `docs/ux/audits/<YYYY-MM-DD>/` (briefing, evaluator notes, findings, shots) |
| Findings (latest)                                    | `docs/ux/audits/<YYYY-MM-DD>/findings.md`                                   |
| Decision lists (one per round, built by ux:decision) | `docs/ux/decisions-<YYYY-MM-DD>.md`                                         |
| Decision log (every answer, appended)                | `docs/ux/decisions.md`                                                      |
| Interaction guidelines                               | `docs/ux/interaction-guidelines.md`                                         |
| Target sitemap                                       | `docs/ux/sitemap.md`                                                        |
| Glossary proposal                                    | `docs/ux/glossary-proposal.md`                                              |
| Decision page (optional)                             | <none yet>                                                                  |

## Screens and states

| Screen                 | Route or entry                                    | States to capture                                                                                                                                                                                                                                                         |
| ---------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Menu bar menu          | the corner-and-dot icon in the menu bar           | no session yet · active session · Switch session list · Export submenu · development build (updates and Open at login disabled)                                                                                                                                           |
| Capture overlay        | `⌘⇧1`                                             | macOS's own `screencapture -i`: region · window (Space) · cancelled (Esc). Not Snapmark's UI, but part of the flow.                                                                                                                                                       |
| Editor window          | opens after a capture                             | empty · every tool of groups 1–7 and Select · marker added, note being typed · card being typed · card with a pointer line · object selected with handles · cut piece mid-move · spotlight · redact · minimum width (1180 px) · light and dark system appearance · saving |
| Notifications          | macOS notification centre                         | new session (`⌘⇧2`) · export failed · shortcut taken by another app                                                                                                                                                                                                       |
| Sessions folder dialog | menu → Change sessions folder…                    | the native open dialog                                                                                                                                                                                                                                                    |
| `session.md`           | menu → Open session.md (the owner's Markdown app) | one entry · many entries · entry with notes, cards and a move                                                                                                                                                                                                             |
| PDF export             | menu → Export session → PDF                       | one entry · several entries · tall images across pages                                                                                                                                                                                                                    |
| ZIP export             | menu → Export session → ZIP                       | Finder opens with the file selected                                                                                                                                                                                                                                       |
| First run              | installing the DMG, first launch, first capture   | Gatekeeper "Open Anyway" · Screen Recording permission not granted (wallpaper-only capture) · first capture with no session                                                                                                                                               |

App-wide parts: menu bar icon and menu, global shortcuts `⌘⇧1` and `⌘⇧2`, macOS notifications, Finder reveal, the auto-update notification.

## How to run it for an audit

- **Build and run:** `npm ci && npm run smoke`. It renders a mock app page, opens the real editor on it, uses every tool, saves, exports a PDF, and writes `editor.png` (the editor window) and `smoke/img/001.png` (the saved image) to a temp folder it prints as `root:`.
- **Scale check:** `npm run build && npx electron --force-device-scale-factor=1 dist/test/smoke.js` for a non-Retina screen.
- **Test data:** the mock page inside `test/smoke.ts`; `SNAPMARK_ROOT` points sessions at a temp folder. Never the owner's screen.
- **Screenshots go to:** `docs/ux/audits/<YYYY-MM-DD>/shots/`
- **Window sizes:** editor at its minimum 1180 × 600, and 1440 and 1920 wide; Retina (2×) and 1×.
- **Builds to audit:** `main`. No open pull requests.
- **Not scriptable:** the menu bar menu, the capture overlay, notifications and native dialogs. Capture those by hand or from code reading; say which in each finding.

## Safety

- **Never write to:** `~/Documents/Snapmark/` (the owner's real sessions), `~/Library/Application Support/snapmark/state.json` (the installed app's state), the owner's login items (the Open at login toggle), the owner's clipboard.
- **Read only:** the owner's sessions, if a real example is needed, and only with the owner's permission.
- **Never capture:** the owner's real screen. Use the mock page.
- **Writes only against:** temp folders via `SNAPMARK_ROOT`, and `~/Library/Application Support/Electron/` (where the smoke test keeps its state, because it runs without the app's package name).

## Flows for this product

Beyond the minimum in `rule-areas.md`:

- Capture, mark, save, capture the next one (scene 1).
- Start a new session and switch back to an older one (scene 1).
- Hand a session to an agent: Copy prompt for AI, paste (scene 1).
- Share with a person: export PDF or ZIP (scene 2).
- Move sessions into iCloud Drive or Google Drive (scene 2).
- Mark what goes and what stays on one screenshot (scene 3).
- Cut an element and move it where it should go (scene 1).
- Place a card that points at an element, then move the card (scene 1).
- Fix a mistake: undo, select, delete (all scenes).
- First launch up to the first saved screenshot (all scenes).
