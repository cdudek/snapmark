<p align="center"><img src="snapmark-app/assets/app-icon.svg" width="96" alt="HeyDiff icon"></p>

<h1 align="center">HeyDiff for Mac</h1>

<p align="center">Screenshot, mark it up, and collect it in one Markdown file you can hand to an AI.</p>

---

The HeyDiff Mac app. HeyDiff is team feedback for software built with AI; it was called Snapmark until 2026-10-28 ([decision](https://github.com/pokbytes/heydiff-context/blob/main/strategy/2026-10-28-name-heydiff.md)). Until the Mac app's new-ids change ships, the app still installs, runs and updates as Snapmark (`com.cdudek.snapmark`, the `snapmark-app/` folder, the `snapmark-updates` bucket).

Each HeyDiff product has its own repository:

| Repository                                                       | What it is                                                                                  | State       |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ----------- |
| `heydiff-desktop` (this one)                                     | The macOS menu bar app (Electron, TypeScript), in [`snapmark-app/`](snapmark-app/README.md) | shipping    |
| [`heydiff-web`](https://github.com/pokbytes/heydiff-web)         | The web app, landing page and MCP server                                                    | not started |
| [`heydiff-chrome`](https://github.com/pokbytes/heydiff-chrome)   | The Chrome extension                                                                        | not started |
| [`heydiff-context`](https://github.com/pokbytes/heydiff-context) | Strategy, audiences and decisions                                                           | live        |

Shared at the root: the SDLC chain (`sdlc.json`, `changes/`, `.claude/`, `scripts/`, `tests/sdlc.test.ts`), the docs (`docs/`), design explorations, CI and the release workflow.

## Develop

npm workspaces: one `npm ci` at the root installs every package. The root scripts run the app's.

```bash
npm ci
npm start
npm run format && npm run lint && npm run typecheck && npm test
```

## Releases and updates

Releases are manual: run **Actions › Release › Run workflow** on `main`. semantic-release picks the version from the Conventional Commit titles merged since the last release (`vX.Y.Z` tags); every merge shows the pending version in that workflow's run summary. The release workflow uploads the signed builds to the public bucket `gs://snapmark-updates/mac/`, where installed copies look for updates. The code itself stays private. Details: [snapmark-app/README.md](snapmark-app/README.md).
