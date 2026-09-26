<p align="center"><img src="assets/app-icon.svg" width="128" alt="Snapmark icon"></p>

<h1 align="center">Snapmark</h1>

<p align="center">Screenshot, mark it up, and collect it in one Markdown file you can hand to an AI.</p>

---

## What it is for

When you review a UI with an AI agent (Claude Code, Cursor, Codex), you spend a lot of words describing _where_ something is: "the second button in the header, the one next to…". A picture with a numbered reference says it faster and more precisely.

Snapmark is a macOS menu bar app for exactly that loop:

1. Press `⌘⇧1`, drag over the part of the screen you mean.
2. Mark it: a box, an arrow, a cross for "remove this", a freehand pen, references ① ② with a note each.
3. Press `⌘↵`. The annotated image and your notes are appended to the current session's `session.md`.
4. Point your agent at the session folder: _"Work through `~/Documents/Snapmark/2026-09-25 14.02/session.md`"_.

### Why it is token-efficient

- **Crops, not full screens.** You capture only the region that matters. Models shrink large images (Claude to about 1.15 megapixels), so on a full-screen capture small UI text becomes unreadable; on a crop it stays sharp, and the model does not spend attention on the rest of the screen.
- **Saved at the size the model uses.** Retina captures are 2× pixels. Snapmark stores every image within 1568 px on the long edge and about 1.15 megapixels, the limits above which Claude resizes anyway. Nothing is lost for the model, and uploads and sessions stay small.
- **Numbers instead of descriptions.** Note 2 refers to marker ② on the image. The model does not have to guess which element you mean, and you do not have to describe it.
- **One plain Markdown file per session.** No app, no account, no export step. Any agent that reads files can read it, and it diffs cleanly in git.

A session looks like this:

```markdown
# 2026-09-25 14.02

## 001 · 14:03

![Screenshot 1](img/001.png)

Checkout page on mobile width.

1. Button label is cut off, should wrap
2. Remove this promo banner entirely
```

## Install

1. Download the DMG for your Mac from [Releases](https://github.com/cdudek/snapmark/releases/latest): `arm64` for Apple Silicon (M1 and later), `x64` for Intel.
2. Open it and drag **Snapmark** onto **Applications**.
3. First launch: the app is not yet signed with an Apple Developer ID, so macOS blocks it. Open **System Settings → Privacy & Security** and click **Open Anyway** under the Snapmark message.
4. On the first capture macOS asks for **Screen Recording** permission. Grant it, then quit Snapmark from the menu bar and start it again. Without it, captures show only the wallpaper.

Snapmark lives in the menu bar as the corner-and-dot icon. It shows a Dock icon only while an editor is open.

## Use

| Shortcut | Anywhere                                  |
| -------- | ----------------------------------------- |
| `⌘⇧1`    | Capture a region into the current session |
| `⌘⇧2`    | Start a new session                       |

In the editor, press a key to pick a tool. Press the same key again to cycle its tools; the top bar shows which one is active.

The toolbar shows one icon per key: the tool that is on, with its key underneath. Dots under a key mean it holds more than one tool (the filled dot is the one that is on): press the key again for the next, and the icon changes with it. Hover an icon for its name.

| Key   | Tools                                                                                    |
| ----- | ---------------------------------------------------------------------------------------- |
| `C`   | Select: move, resize or delete (`⌫`) any mark                                            |
| `1`   | Reference: click, then type its note in the panel → Card: a sticky note you type on      |
| `2`   | Box → Ellipse                                                                            |
| `3`   | Arrow                                                                                    |
| `4`   | Pen (freehand)                                                                           |
| `5`   | Cross → Remove area (hatched), always red                                                |
| `6`   | Highlighter → Spotlight (dims the rest)                                                  |
| `7`   | Cut & move: drag around an element, then drag it where it should go → Redact (pixelates) |
| `Esc` | Step back: out of the text, then deselect, then back to Select                           |
| `⌘Z`  | Undo                                                                                     |
| `⌘↵`  | Add to session                                                                           |
| `⌘W`  | Discard the screenshot                                                                   |

The side panel starts with a one-line comment field. References appear there once you add the first one, and every field grows with its text. The comment and reference notes take Markdown as you type, like Notion: `# ` makes a heading, `- ` a list, `**bold**` bold; `session.md` keeps it as Markdown. **Settings → Keyboard shortcuts…** in the menu lists all of this in the app. While an editor is open, Snapmark shows its icon in the Dock.

**Cards:** click to place one and start typing. To point at something, press on it and release where the card should sit; a line then follows the card wherever you move it. **Cut & move** leaves a dashed outline where the element is now and draws an arrow to where you dropped it. Cards and moves are also written into `session.md`, so an agent reads them as text.

Click the menu bar icon for the menu. It is built fresh each time it opens:

- **Capture region** (⇧⌘1) and **New session** (⇧⌘2). A shortcut another app already owns shows as "(shortcut unavailable)". While the current session has no screenshots, ⇧⌘2 keeps using it instead of making another empty one.
- **Current session: <name> · <n> screenshots**, then what you can do with it:
  - **Copy prompt for AI** puts a ready instruction on the clipboard: the path to `session.md` plus what the marks mean. Paste it into Claude Code or any agent.
  - **Copy file path** puts just the full path of `session.md` on the clipboard.
  - **Open feedback file** opens `session.md` in your Markdown app. **Show in Finder** opens the session folder.
  - **Rename session…** gives a session a name, like "Checkout review".
  - **Export** ▸ ZIP or PDF (see below).
- **Switch session** lists sessions by last use. Each has its own submenu (Make current, Copy prompt for AI, Export, Show in Finder), so you can export an old session without sending new captures there. **Other session…** reaches any session beyond the 20 shown.
- **Settings**: Open at login, the sessions folder (click to open it), Change where sessions are saved…, Keyboard shortcuts…, Check for updates…, and the version.
- **Quit Snapmark** asks first if an editor still has marks or text that are not in a session.

Copies confirm with a notification. A session moved or deleted in Finder is reported instead of silently doing nothing.

**Export → ZIP** packs `session.md` and `img/` into `<session>.zip`, for agents and developers. **Export → PDF** renders the session into `<session>.pdf`, for people who just want to read it. Both land in the session folder, and Finder opens with the file selected. Sessions are stored in `~/Documents/Snapmark/`. **Settings → Change where sessions are saved…** moves new sessions elsewhere; pick a folder inside iCloud Drive or Google Drive and your sessions sync and can be shared from there. The `SNAPMARK_ROOT` environment variable overrides the choice (used by the tests).

## Develop

Requires Node 22 and macOS.

```sh
npm install
npm start            # build and run from source
npm run format       # prettier
npm run lint         # eslint
npm run typecheck    # tsc --noEmit
npm test             # session and Markdown logic
npm run smoke        # drives the real editor window: draws every tool, saves, checks pixels and Markdown
npm run dist         # build DMG + ZIP into release/ (ad-hoc signed)
```

| Path                  | What                                                  |
| --------------------- | ----------------------------------------------------- |
| `src/main.ts`         | Menu bar, global shortcuts, capture, auto-update, IPC |
| `src/menu.ts`         | The menu bar menu as data, tested without Electron    |
| `src/editor.ts/.html` | Annotation editor window                              |
| `src/sessions.ts`     | Session folders and `session.md` writing              |
| `assets/`             | App icon, menu bar template icon                      |
| `build/`              | Packaging resources (icon, entitlements)              |

CI (`.github/workflows/ci.yml`) runs format check, lint, typecheck, unit test and the smoke test on every pull request.

## Release

Versions follow [semver](https://semver.org) and are chosen automatically by [semantic-release](https://semantic-release.gitbook.io) from the commit messages on `main`. Every pull request is squash-merged with its title as the commit, and CI rejects titles that are not [Conventional Commits](https://www.conventionalcommits.org):

| PR title starts with                              | Release              |
| ------------------------------------------------- | -------------------- |
| `fix:` or `perf:`                                 | patch: 0.4.0 → 0.4.1 |
| `feat:`                                           | minor: 0.4.1 → 0.5.0 |
| `feat!:`, `fix!:`, or a `BREAKING CHANGE:` footer | major: → 1.0.0       |
| `docs:`, `chore:`, `ci:`, `test:`, `refactor:`    | no release           |

The version lives in the release tag; `package.json` is not bumped in git.

`.github/workflows/release.yml` builds `arm64` and `x64` DMGs and ZIPs on macOS, signs and notarizes them, and publishes the GitHub release and its `vX.Y.Z` tag with generated notes.

The app checks GitHub Releases on start and from **Settings → Check for updates…** in the menu, downloads in the background, and installs on quit (`electron-updater`). Two conditions must hold for it to work:

1. **The app must be signed with a Developer ID.** macOS refuses to apply updates to ad-hoc signed apps. Add these repository secrets and the release workflow signs and notarizes automatically: `MAC_CERT_P12_BASE64`, `MAC_CERT_PASSWORD`, `APPLE_ID`, `APPLE_APP_SPECIFIC_PASSWORD`, `APPLE_TEAM_ID`.
2. **The app must be able to read the releases.** Releases of a private repository return 404 without a token, so updates only work once releases are public.
