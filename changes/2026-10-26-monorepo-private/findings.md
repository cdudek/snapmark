# Findings: 2026-10-26-monorepo-private

## Milestone 1 — the one fix round

| #   | Severity | Source                                | Finding                                                                                                                                                 | Fix                                                                                                                                   | State |
| --- | -------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| 1   | High     | `npm run smoke:background` (gate)     | The editor threw `fabric is not defined` in development: `editor.html` loads `../../node_modules/fabric`, and workspaces hoist fabric to the repo root. | `snapmark-app/scripts/link-hoisted.cjs` links it into `snapmark-app/node_modules/` at build. The packaged app.asar is unchanged (F3). | fixed |
| 2   | Medium   | electron-builder from `snapmark-app/` | electron-builder refused to package: it read Electron's `^45.0.0` range because `electron` is hoisted.                                                  | `snapmark-app/scripts/electron-builder.sh` passes the installed version; `release.yml` and `npm run dist` use it.                     | fixed |
