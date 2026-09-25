# Snapmark UX audit — common brief for every agent

You are one agent in an eight-agent UX audit of **Snapmark v0.2.0**, a macOS menu bar app that captures a
screen region, lets the user mark it up, and appends it with notes to a Markdown session for an AI agent.

## Read first (all read-only)

- The approved briefing: `/Users/calvindudek/orca/workspaces/ai-feedback-editor/kingfish/docs/ux/audits/2026-09-25/briefing.md` — scope, checks, team, format.
- Product setup: `/Users/calvindudek/orca/workspaces/ai-feedback-editor/kingfish/docs/ux/setup.md` — screens, states, scenes, safety.
- The owner's words: `/Users/calvindudek/orca/workspaces/ai-feedback-editor/kingfish/docs/ux/owner-words.md` — quote from it, verbatim, with the date. Never cite by number.
- Shared references: `/Users/calvindudek/.claude/calvin-kit/plugins/ux/references/finding-format.md` (how every finding is written — follow it exactly),
  `/Users/calvindudek/.claude/calvin-kit/plugins/ux/references/lenses.md`, `/Users/calvindudek/.claude/calvin-kit/plugins/ux/references/checklist.md`, `/Users/calvindudek/.claude/calvin-kit/plugins/ux/references/writing.md`, `/Users/calvindudek/.claude/calvin-kit/plugins/ux/references/rule-areas.md`.
- The code (for surfaces that cannot be scripted): `/Users/calvindudek/orca/workspaces/ai-feedback-editor/kingfish/src/main.ts` (menu bar menu, shortcuts, capture,
  notifications, dialogs, exports, updates), `/Users/calvindudek/orca/workspaces/ai-feedback-editor/kingfish/src/editor.ts` and `/Users/calvindudek/orca/workspaces/ai-feedback-editor/kingfish/src/editor.html` (the editor),
  `/Users/calvindudek/orca/workspaces/ai-feedback-editor/kingfish/src/sessions.ts` (session.md format), `/Users/calvindudek/orca/workspaces/ai-feedback-editor/kingfish/src/exporter.ts` (ZIP/PDF), `/Users/calvindudek/orca/workspaces/ai-feedback-editor/kingfish/README.md`.

## The build

Already built at `/Users/calvindudek/orca/workspaces/ai-feedback-editor/kingfish/dist/`. **Never run `npm install`, `npm ci`, `npm run build` or edit any file in the repo.**

## How to see the editor (the only way you capture screens)

The harness opens the REAL editor on a MOCK web page ("Acme Ops" orders dashboard) and screenshots the window:

    cd /Users/calvindudek/orca/workspaces/ai-feedback-editor/kingfish && SNAPMARK_ROOT=$(mktemp -d) OUT=/private/tmp/claude-502/-Users-calvindudek-orca-workspaces-ai-feedback-editor-kingfish/bb13d377-2e6f-41ac-bec6-569984e07826/scratchpad/audit/shots/<agent#>-<name>.png \
      W=1180 H=600 THEME=light STEPS=<your steps.js> SAVE=1 \
      npx electron [--force-device-scale-factor=1] /private/tmp/claude-502/-Users-calvindudek-orca-workspaces-ai-feedback-editor-kingfish/bb13d377-2e6f-41ac-bec6-569984e07826/scratchpad/audit/harness.js

- Read the header comment of `/private/tmp/claude-502/-Users-calvindudek-orca-workspaces-ai-feedback-editor-kingfish/bb13d377-2e6f-41ac-bec6-569984e07826/scratchpad/audit/harness.js`: STEPS is JS run inside the editor page with helpers
  `sleep, key, ev, drag, note, px` and the editor's globals (`canvas`, `GROUPS`, `tool()`, `markers()`,
  `cards()`, `links`, `undoStack`, `background`). `return {...}` prints `RESULT:`. SAVE=1 prints session.md.
- Options: `W`/`H` window size (minimum is 1180×600), `THEME=light|dark`, `MOCK=<html file>` for your own mock page,
  `--force-device-scale-factor=1` for a non-Retina screen, `SESSION=<name>`.
- Fabric listens to **mouse** events (the helpers already dispatch them). Keys go to `document`.
- `/Users/calvindudek/orca/workspaces/ai-feedback-editor/kingfish/test/smoke.ts` is a worked example of driving every tool.
- Look at every screenshot you cite (open the PNG). "Seen on screen" requires a screenshot you looked at.
- Always use your own fresh `SNAPMARK_ROOT=$(mktemp -d)`. Several agents run Electron at the same time.

## Safety — binding

- Never write to `~/Documents/Snapmark/`, `~/Library/Application Support/snapmark/`, login items, or the clipboard.
- Never capture the real screen (`screencapture`, global shortcuts ⌘⇧1/⌘⇧2). Never launch the app with `npm start`.
- Write ONLY to your own output file and to `/private/tmp/claude-502/-Users-calvindudek-orca-workspaces-ai-feedback-editor-kingfish/bb13d377-2e6f-41ac-bec6-569984e07826/scratchpad/audit/shots/` (file names prefixed with your agent number, e.g. `3-card-editing.png`).
- The menu bar menu, capture overlay, notifications, native dialogs, the DMG and first run cannot be scripted:
  evaluate them from the code and label those findings **Verified: read in the code**.

## Scenes (name the one a finding hurts)

1. **Reviewing an overnight build** — the main scene: many issues in a row, on the fly, handed to Claude Code.
2. **Sharing with a person** — PDF or ZIP for a teammate.
3. **A quick verdict** — mark what goes (red) and what stays (green).

## Output

- Your file: `/private/tmp/claude-502/-Users-calvindudek-orca-workspaces-ai-feedback-editor-kingfish/bb13d377-2e6f-41ac-bec6-569984e07826/scratchpad/audit/evaluators/e<agent#>.md`. Findings in the finding format, numbered `<agent#>-01` upward.
  No cap. One problem per entry. Split bundles. Evidence real. Codes and paths only in the supporting notes.
- Also the tables your checks produce (see the briefing's check list), in the same file, after the findings.
- End your file with a "Did not run" section: what you could not check and why.
- **Independence:** do not read `/private/tmp/claude-502/-Users-calvindudek-orca-workspaces-ai-feedback-editor-kingfish/bb13d377-2e6f-41ac-bec6-569984e07826/scratchpad/audit/evaluators/` files other than your own.
