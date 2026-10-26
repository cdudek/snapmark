---
linear: none
type: plan
change: 2026-10-26-monorepo-private
design: null
author: Claude (orchestrator)
status: approved
reviewed_by: Calvin Dudek
approved_at: 2026-10-26
created: 2026-10-26
archived_at: 2026-10-26
---

# Plan: one private repo for the app, the Chrome extension and the website, with updates that keep working

> Updates move to a public Cloud Storage bucket, the app moves into `snapmark-app/`, and once both of the owner's Macs run that build, the repo goes private.

A person with no context builds from this file alone. [intent](intent.md) and [facts](facts.md) are for the gate, not for the build.

## Approach

- **What changes:** electron-updater reads a generic feed in `gs://snapmark-updates/mac/`. The release workflow uploads there through Workload Identity Federation. The app's files move into `snapmark-app/`, an npm workspace of a private root package.
- **What stays the same:** the app's code and behaviour, bundle id `com.cdudek.snapmark`, the Developer ID signing, semantic-release versions, `v<x.y.z>` tags and the GitHub release record.
- **Why this way:** the bucket is the owner's pick (A2). A feed outside GitHub is the only way installed copies keep updating once the code is private. Workspaces keep one lockfile and let the SDLC chain at the root use the app's prettier and vitest.
- **Rejected:**
  - A public releases-only GitHub repo: the owner picked Cloud Storage.
  - Cloudflare R2: no download fees, but the owner picked GCS. Revisit at about 500 users.
  - A standalone `snapmark-app/` with its own lockfile: the root tooling (prettier, the guardrail test) would then need its own dependencies.
  - Release path filters: nothing else ships yet.

## Costs

Answers A2. Standard class in europe-west3, list prices from memory (about $0.023/GB-month stored, $0.12/GB downloaded); check them in the calculator.

- **Storage:** 0.55 GB per release; keeping 5 is 2.7 GB, about $0.06 a month.
- **Downloads:** one update is the 124 MB arm64 ZIP, about $0.015 per Mac.
  - **The owner on 2 Macs, at about 30 releases a month:** about $1.
  - **100 users, 4 updates each:** about $6.
  - **1,000 users:** about $60.
- **Update checks:** one small file per launch, a fraction of a cent.
- **GitHub, private:** Pro is in place. 3,000 Actions minutes; a release is 8–13 macOS minutes, counted 10×. About 30 releases a month fills that allowance; releasing per milestone stays well inside it.

## Design changes

None in an existing design. New ADR `docs/designs/2026-10-26-adr-private-monorepo-updates-from-gcs.md`: the layout, the update feed and the reasons; then `python3 scripts/design_index.py write`.

## Where things go

| New file or kind                           | Folder                                        |
| ------------------------------------------ | --------------------------------------------- |
| The app's code, tests, assets, app scripts | `snapmark-app/` (moved with `git mv`)         |
| Root workspace package, root README        | `/`                                           |
| Placeholder READMEs                        | `snapmark-chrome/`, `snapmark-web/`           |
| Prune script and its test                  | `snapmark-app/scripts/`, `snapmark-app/test/` |
| One-off checks for F1, F3, N1              | `changes/2026-10-26-monorepo-private/checks/` |
| The ADR                                    | `docs/designs/`                               |

## Feature PRs

One go: each row is a commit on `milestone/monorepo-private-1`, with no checks between rows.

### Milestone 1 — the app updates from the bucket and lives in `snapmark-app/`

| #   | Feature                                                                        | Facts          | Branch                         | State        |
| --- | ------------------------------------------------------------------------------ | -------------- | ------------------------------ | ------------ |
| 0   | Owner: a billing account linked to `snapmark-ai` (all four are closed)         | F8             | none (console)                 | done         |
| 1   | GCP: the bucket, public read, WIF pool, provider and uploader account          | F8, F9         | none (gcloud)                  | done         |
| 2   | The app reads updates from the bucket; the release workflow uploads and prunes | F4, F5, F6, F7 | `milestone/monorepo-private-1` | done bf4d120 |
| 3   | The app moves into `snapmark-app/`; root workspace; CI runs from the root      | F1, F2, F3, N1 | `milestone/monorepo-private-1` | done 76857cf |
| 4   | The ADR and the design index                                                   | none           | `milestone/monorepo-private-1` | done 9bd5f90 |

### After the merge (Stage 7, with the owner)

| #   | Step                                                                                        | Facts    |
| --- | ------------------------------------------------------------------------------------------- | -------- |
| 5   | The merge releases the next patch; its files land in GitHub releases and the bucket         | F5, F6   |
| 6   | The owner confirms both Macs run it; then `gh repo edit --visibility private`, after asking | F10, F11 |
| 7   | The next release arrives from the bucket on both Macs: the success measure                  | intent   |

## Files that change

| File                                                                                                 | Change                                                                                                                                                                                                                                                                                    |
| ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/`, `test/`, `assets/`, `scripts/after-pack.cjs` → `snapmark-app/`                               | `git mv`; content unchanged                                                                                                                                                                                                                                                               |
| `package.json` → `snapmark-app/package.json`                                                         | `git mv`; `build.publish` becomes `{ "provider": "generic", "url": "https://storage.googleapis.com/snapmark-updates/mac" }`; `test` drops the vitest call                                                                                                                                 |
| `tsconfig.json`, `eslint.config.mjs` → `snapmark-app/`                                               | `git mv`                                                                                                                                                                                                                                                                                  |
| `README.md` → `snapmark-app/README.md`                                                               | `git mv`; relative links fixed (`docs/` → `../docs/`)                                                                                                                                                                                                                                     |
| `package.json` (new, root)                                                                           | `private`, `workspaces: ["snapmark-app"]`; scripts `format`, `format:check` at the root; `lint`, `typecheck`, `build`, `start`, `smoke`, `smoke:background` run `-w snapmark-app`; `test` runs the app's tests, then `vitest run tests/sdlc.test.ts`; `sdlc:tools` moves here             |
| `package-lock.json`                                                                                  | regenerated by a plain `npm install` as a workspace lockfile; N1 proves no version moved                                                                                                                                                                                                  |
| `README.md` (new, root)                                                                              | what lives where, how to run each                                                                                                                                                                                                                                                         |
| `snapmark-chrome/README.md`, `snapmark-web/README.md`                                                | one paragraph each: what it will be, "not started"                                                                                                                                                                                                                                        |
| `snapmark-app/scripts/prune-releases.sh`                                                             | reads object names on stdin, prints the files of every version older than the newest 5 (`sort -V`); never a `latest-mac.yml`                                                                                                                                                              |
| `snapmark-app/test/prune.test.sh`                                                                    | 7 versions in, the oldest 2 versions' files out; run from the app's `test` script                                                                                                                                                                                                         |
| `.github/workflows/release.yml`                                                                      | `id-token: write`; `npm version -w snapmark-app`; build with `working-directory: snapmark-app`; `google-github-actions/auth@v2` + `setup-gcloud@v2`; upload binaries, then `latest-mac.yml` with `Cache-Control: no-cache`; prune; then `gh release create` with `snapmark-app/release/*` |
| `.gitignore`                                                                                         | ignore `.vitest/`, the guardrail test's JSON report                                                                                                                                                                                                                                       |
| `.github/workflows/ci.yml`                                                                           | unchanged commands; they now run the root scripts                                                                                                                                                                                                                                         |
| `sdlc.json`, `CLAUDE.md`, `AGENTS.md`, `docs/sdlc.md` (repo tail), `docs/ux/setup.md`                | paths and run commands that named the old layout                                                                                                                                                                                                                                          |
| `docs/designs/2026-10-26-adr-private-monorepo-updates-from-gcs.md`, `docs/designs/INDEX.md`          | the new ADR; the regenerated index                                                                                                                                                                                                                                                        |
| `.claude/settings.json`, `docs/sdlc.md`, `scripts/sdlc_status.py`, `sdlc.json`, `tests/sdlc.test.ts` | the kit refresh (`adopt`, 1.0), committed first                                                                                                                                                                                                                                           |

## Order of work

Each step has a proof. The proof is a command, a file, or a fact.

- [x] 0. Owner links a billing account to `snapmark-ai` in the console — proof: `gcloud billing projects describe snapmark-ai` says `billingEnabled: true`.
- [x] 1. With the owner's account `calvindudek@googlemail.com`: enable `iamcredentials`, `sts` and `iam`. Create the bucket `snapmark-updates`: europe-west3, Standard, uniform access, public access prevention off. Grant `allUsers` `roles/storage.objectViewer`. Create pool `github`, provider `snapmark` (issuer `https://token.actions.githubusercontent.com`, condition `assertion.repository=='cdudek/snapmark'`). Create service account `release-uploader`, bind `roles/storage.objectAdmin` on the bucket only and `roles/iam.workloadIdentityUser` for the repo's principal set. Record every command in the ADR — proof: F8 and F9 checks.
- [x] 2. Record N1's baseline: `npm ls --all --json` into `checks/deps-before.json` — proof: the file exists.
- [x] 3. `publish` → generic; `release.yml` upload, prune and `id-token`; prune script and test — proof: `sh snapmark-app/test/prune.test.sh` exits 0 (F7).
- [x] 4. Move the app into `snapmark-app/` and add the root `package.json`. Run a plain `npm install`. Fix paths in the listed docs — proof: `checks/layout.sh` (F1) and `checks/deps.sh` (N1) exit 0.
- [x] 5. `npx electron-builder --mac dir --publish never -c.mac.identity=-` in `snapmark-app/` — proof: `checks/asar.sh` (F3) exits 0, and `app-update.yml` names the bucket (F4).
- [x] 6. The ADR, `python3 scripts/design_index.py write` — proof: `INDEX.md` lists it.
- [x] 7. Milestone checks: `python3 scripts/verify_gate.py milestone 2026-10-26-monorepo-private` — proof: `VERIFY PASS milestone` (F2).
- [x] 8. PR `milestone/monorepo-private-1` → `main`, titled `fix(updates): …` so it releases a patch; auto-merge armed after asking (workflow and lockfile change) — proof: CI `check` green.
- [x] 9. After the merge: the release run uploads to the bucket — proof: F5, F6 checks.
- [x] 10. The owner confirms both Macs; ask, then make the repo private — proof: F10, F11.

## Risks

| Risk                                                                                   | What we do                                                                                                                        | Where it lands |
| -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| The repo goes private before a Mac runs the bucket build; that Mac never updates again | Private only after the owner confirms both Macs (F10). Older copies elsewhere (the download counts show a handful) reinstall once | step 10        |
| Google's edge cache serves an old `latest-mac.yml` for up to an hour                   | Upload it with `Cache-Control: no-cache`                                                                                          | F6, step 3     |
| `latest-mac.yml` points at a ZIP that has not uploaded yet                             | Binaries first, `latest-mac.yml` last                                                                                             | F6, step 3     |
| Pruning deletes the version clients are being sent                                     | Keep the newest 5 by `sort -V`; never touch `latest-mac.yml`; tested with 7 versions                                              | F7, step 3     |
| electron-builder misses hoisted workspace modules and ships a broken app               | Diff `app.asar` against v0.22.0 before the PR                                                                                     | F3, step 5     |
| The lockfile rewrite moves a version (dependency changes are Ask-tier)                 | Plain `npm install`, no package names; diff every name@version                                                                    | N1, step 4     |
| The bucket is a public, writable target                                                | Write only through WIF from `cdudek/snapmark`; no keys; `objectAdmin` on this bucket only                                         | F9, step 1     |
| Billing stays off; nothing can be created                                              | Step 0 is the owner's; the goal stops at step 1 with `VERIFY BLOCKED reason=env` until it is done                                 | step 0         |
| A release from a `chore:` title publishes nothing, so no Mac moves to the bucket build | Title the PR `fix(updates): …`                                                                                                    | step 8         |
| A stale hook in another worktree points at old paths                                   | Hooks resolve the checkout from the session's cwd (#80); start sessions in the worktree                                           | accepted       |

## Out of scope

- Code in `snapmark-chrome/` and `snapmark-web/`.
- Per-package versions, tags and release path filters.
- A custom download domain, a CDN, Cloudflare R2.
- The four other open change folders in `changes/`; they are untouched.

## Done

What must hold, as data in [done.json](done.json). The goal below ends on the verify sentinel, so every line here is proven by a check, not by a claim.

- `python3 scripts/verify_gate.py milestone 2026-10-26-monorepo-private` ends `VERIFY PASS` once, on the milestone.
- `checks/layout.sh`, `checks/deps.sh`, `checks/asar.sh` and `snapmark-app/test/prune.test.sh` exit 0 (F1, N1, F3, F7).
- `snapmark-app/release/mac-arm64/Snapmark.app/Contents/Resources/app-update.yml` contains `provider: generic` and `snapmark-updates/mac` (F4).
- Anonymous `curl -sI` of the bucket's `latest-mac.yml` path answers 200 or 404, never 401/403 (F8; 404 before the first release).
- F9's three checks pass.
- Nothing outside `## Files that change` is edited.
- Stop and report as soon as a step cannot proceed. Never work around a blocker.
- Stop after 200 turns if not met. Report what is missing.

F5, F6's object check, F10 and F11 are proven after the merge, in Stage 7.

## Goal handover

```
/goal Deliver change 2026-10-26-monorepo-private in one go per changes/2026-10-26-monorepo-private/plan.md and facts.md: every milestone in ## Milestones, in order, each on its own branch milestone/monorepo-private-<n> cut from the previous one (the first from origin/main), so building never waits for a merge. Per feature: write the tests for its facts, build in the plan's folders, commit; run no checks, no lint and no tests between features, and start the next feature at once. An open question never stops the build: write it to changes/2026-10-26-monorepo-private/questions.md with the default you took, tell the engineer in one line, and carry on; an answer that arrives becomes an ask of the next milestone. Per milestone, once its features are committed: run `python3 scripts/verify_gate.py milestone 2026-10-26-monorepo-private` and the Stage 6 checks once on the milestone diff, then validate every fact and ask of that milestone against the built app into changes/2026-10-26-monorepo-private/validation.md (expected, observed, evidence, verdict), one findings.md section, one fix round, rerun the gate and paste its full output, open the PR milestone/monorepo-private-<n> -> main and arm auto-merge (ask first when a Critical or High is deferred); a later milestone opens its PR once the previous one has merged, after `git rebase --onto origin/main milestone/monorepo-private-<n-1>`, and keeps building meanwhile. Met only when every milestone's PR is merged or open with auto-merge armed, the last gate line is `VERIFY PASS milestone 2026-10-26-monorepo-private <sha>` with <sha> equal to `git rev-parse HEAD`, validation.md has no `not met` row and findings.md no open blocking item. Also met, as a stop-and-ask, on `VERIFY BLOCKED`: summarize changes/2026-10-26-monorepo-private/verify/report.md for the engineer. Never edit protected paths (facts.md, done.json, lock.json, baselines, allowlists, sdlc.json checks) or accept baselines. Tick plan tasks as they land; log departures under ## Revisions. Stop after 200 turns and report.
```

## Revisions

Only after approval. One line per change: `YYYY-MM-DD — what changed, and why`.

- 2026-10-26 — Steps 2–6 ran before step 1: billing on `snapmark-ai` is still off, and the code features do not need the bucket.
- 2026-10-26 — `build/` (entitlements) moved into `snapmark-app/` too; the table missed it.
- 2026-10-26 — Public read is `roles/storage.legacyObjectReader`, not `objectViewer`: electron-updater only gets files, and nobody needs to list the bucket.
- 2026-10-26 — New `snapmark-app/scripts/electron-builder.sh`: workspaces hoist `electron`, and electron-builder refuses the `^45.0.0` range without the installed version.
- 2026-10-26 — `snapmark-app/test/guide.test.ts` and `keys.test.ts` read `docs/` from the repo root, one folder further up.
- 2026-10-26 — New `snapmark-app/scripts/link-hoisted.cjs`, run by `build`: the editor loads Fabric from `../../node_modules`, which workspaces moved to the root in development.
- 2026-10-26 — F7 keeps the newest 10 versions, not 5 (owner: "can we make sure that we only keeping the last 10 versions around?"; `decisions.json` › `protectedEdit`). Storage is then about 5.5 GB, $0.13 a month.
- 2026-10-26 — "Both Macs" in F10, the success measure and steps 6, 7 and 10 was the orchestrator's assumption; the owner has one Mac ("which other mac?"). F10 is validated on that Mac; facts.md keeps its locked wording.
- 2026-10-26 — Restart to Update did not quit Snapmark, and Settings shows no update state; the owner quit by hand to install 0.22.1. Filed as snap-bmr.25.
