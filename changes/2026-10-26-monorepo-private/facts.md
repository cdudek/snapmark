---
linear: none
type: facts
change: 2026-10-26-monorepo-private
design: null
author: Claude (orchestrator)
status: approved
reviewed_by: Calvin Dudek
approved_at: 2026-10-26
created: 2026-10-26
---

# Facts: one private repo for the app, the Chrome extension and the website, with updates that keep working

## Goal

The Mac app moves into `snapmark-app/` beside `snapmark-chrome/` and `snapmark-web/`. Installed copies take their updates from a public Cloud Storage bucket instead of GitHub releases. Then the repo can go private without any Mac losing its updates.

## Acceptance criteria

Size `none`: no screen changes, so no fact names a screen. Every fact names the check that proves it.

### Layout

- [ ] **F1** (A1) The repository shall hold the Mac app's code, tests, assets and build config under `snapmark-app/`, beside `snapmark-chrome/` and `snapmark-web/` with a README each. Tag: `@F1`.
- [ ] **F2** (A1) When the repo's `verify` command runs at the repository root, it shall exit 0. Tag: `@F2`.
- [ ] **F3** (A1) The packaged app shall list the same files in `app.asar` as the v0.22.0 release, apart from `package.json`. Tag: `@F3`.
- [ ] **N1** (A1) Every installed dependency shall keep the version it had before the move. Tag: `@N1`.

<details>
<summary>Verification</summary>

- F1 — tag `@F1`: `changes/2026-10-26-monorepo-private/checks/layout.sh` exits 0.
- F2 — tag `@F2`: the root `verify` command exits 0.
- F3 — tag `@F3`: `checks/asar.sh` diffs `npx asar list` of a local `--mac dir` build against the v0.22.0 arm64 ZIP.
- N1 — tag `@N1`: `checks/deps.sh` diffs `npm ls --all --json` name@version sets from before and after.

</details>

### Updates

- [ ] **F4** (A2) The app built from this change shall read its updates from `https://storage.googleapis.com/snapmark-updates/mac/`. Tag: `@F4`.
- [ ] **F5** (A2) When a release is published, the release workflow shall upload its ZIPs, DMGs, blockmaps and `latest-mac.yml` to `gs://snapmark-updates/mac/`. Tag: `@F5`.
- [ ] **F6** (A2) The release workflow shall upload `latest-mac.yml` after every other file, with `Cache-Control: no-cache`. Tag: `@F6`.
- [ ] **F7** (A2, J3) When the bucket holds more than 5 versions, the release workflow shall delete the files of every version except the newest 5. Tag: `@F7`.
- [ ] **F8** (A2) Anyone shall be able to download from the bucket without signing in. Tag: `@F8`.
- [ ] **F9** (A2) Only the release workflow of `cdudek/snapmark` shall be able to write to the bucket, through Workload Identity Federation, with no service account key. Tag: `@F9`.

<details>
<summary>Verification</summary>

- F4 — tag `@F4`: `Contents/Resources/app-update.yml` of a local `--mac dir` build names `provider: generic` and that URL.
- F5 — tag `@F5`: the first release run's log, then `gcloud storage ls gs://snapmark-updates/mac/` lists that version's 8 files and `latest-mac.yml`.
- F6 — tag `@F6`: the upload step's order in `release.yml`, and `gcloud storage objects describe …/latest-mac.yml` shows `cacheControl: no-cache`.
- F7 — tag `@F7`: `snapmark-app/test/prune.test.sh` feeds 7 versions to `scripts/prune-releases.sh` and expects the oldest 2 versions' files.
- F8 — tag `@F8`: anonymous `curl -sI https://storage.googleapis.com/snapmark-updates/mac/latest-mac.yml` answers 200.
- F9 — tag `@F9`: the provider's condition names `cdudek/snapmark`. The uploader has no user-managed key. Only the uploader can write to the bucket.

</details>

### Going private

- [ ] **F10** (A1) When both of the owner's Macs run the first release built from this change, the repository shall be private. Tag: `@F10`.
- [ ] **F11** (A1) While the repository is private, `main`'s ruleset shall still require the `check` job. Tag: `@F11`.

<details>
<summary>Verification</summary>

- F10 — manual: the owner reads Snapmark ▸ About on both Macs; then `gh repo view --json visibility` says `PRIVATE`.
- F11 — tag `@F11`: `gh api repos/cdudek/snapmark/rulesets/<id>` lists `check` as required, and a test PR shows it pending before merge.

</details>

## Verification

What proves the whole change, beyond the per-fact checks.

- **Automated:** the root `verify` command exits 0. CI's `check` passes on the milestone PR.
- **Manual:** the owner installs nothing by hand; both Macs update themselves twice, once from GitHub to the new build, then from the bucket.

## Out of scope

- A2, "what will be the expected costs?" — answered in chat on 2026-10-26; the numbers are in `plan.md` › Costs.
- A3 — the dialog answers are recorded in `decisions.json`.
- Code in `snapmark-chrome/` and `snapmark-web/` — each starts as its own change.
- Release path filters, per-package versions and tags — needed only once a second package ships.
- A custom download domain such as `updates.<domain>` — comes with `snapmark-web`.

## Open questions

Nothing here blocks the gate except an unresolved marker.

- none
