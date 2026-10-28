---
linear: none
type: plan
change: 2026-10-27-online-release-1
design: docs/designs/2026-10-27-snapmark-online.md
author: Claude (orchestrator)
status: draft
reviewed_by: null
approved_at: null
created: 2026-10-28
---

# Plan: Snapmark online, release 1 (local)

> Seven milestones in four repos: foundations first, then web app, extension, MCP, Mac bridge and landing in parallel, then two-way Mac sync.

A person with no context builds from this file alone. [intent](intent.md) and [facts](facts.md) are for the gate. The UX plan is in [spec/](spec/). It holds the screens in [screens.md](spec/screens.md), routes in [sitemap.md](spec/sitemap.md), components in [conformance.md](spec/conformance.md), words in [microcopy.md](spec/microcopy.md), the validation in [validation.md](spec/validation.md) and the prototype in [prototype/index.md](spec/prototype/index.md). The technical calls are in [tech-review.md](tech-review.md). The architecture is the design, sections 7, 8 and 11 to 14.

## What the gate approves

One gate covers `spec/`, `facts.md` and this plan. Four things need your eye most:

1. **[spec/owner-decisions.md](spec/owner-decisions.md):** 37 choices. The spec follows each recommended answer. Annotate only the ones you want changed.
2. **Numbers the facts set where nobody had:** live updates within 2 s (F69, F88) and Mac sync within 5 s (F151). API reads answer under 300 ms at p95 (N10), MCP tools under 500 ms (N11).
3. **Operator access** is a platform role on the user (F135). The design asked for Google sign-in, which arrives in release 2.
4. **The lock in the new repos** (below): copies of the approved facts, locked once per repo.

## How this is delivered (one go, four repos)

- One `/goal` runs every milestone. Milestone 1 is alone; then 2, 3, 4 and 5 build at once, 6 when a builder frees up, and 7 after 2.
- At most four builders run at once (owner, A25). Each builder works in its own worktree in its milestone's repo.
- Builders are `omr-dev:builder` agents on Sonnet 5.5, or Codex with `codex exec -m gpt-6.1-sol`. The milestone table names one per milestone.
- The supervisor plans, dispatches, judges and merges. It edits no code and runs no test suite.
- Per feature: write its tests, build, commit. No checks between features.
- Per milestone: that repo's milestone checks once, validation against the facts, one findings section, one fix round, one PR.
- **UX findings go to the owner and are never auto-fixed.** Correctness bugs and failing tests are fixed in the fix round.
- E2E (Playwright) runs only in the milestone checks and in CI, never per commit.

### Where each milestone's PR goes

| Milestone | Repo                                              | Branch                                 | PR into                                            | Builder                                       |
| --------- | ------------------------------------------------- | -------------------------------------- | -------------------------------------------------- | --------------------------------------------- |
| 1         | `snapmark-kit`, `snapmark-web`, `snapmark-chrome` | `milestone/online-release-1-1` in each | each repo's `main`                                 | Sonnet 5.5 (kit, docs), Codex Sol (db, auth)  |
| 2         | `snapmark-web`                                    | `milestone/online-release-1-2`         | `main`                                             | Sonnet 5.5                                    |
| 3         | `snapmark-chrome` (plus a kit release)            | `milestone/online-release-1-3`         | `main`                                             | Sonnet 5.5                                    |
| 4         | `snapmark-web`                                    | `milestone/online-release-1-4`         | `main`                                             | Codex Sol                                     |
| 5         | `snapmark-desktop`                                | `milestone/online-release-1-5`         | `project/online-release-1`                         | Codex Sol                                     |
| 6         | `snapmark-web`                                    | `milestone/online-release-1-6`         | `main`                                             | Sonnet 5.5                                    |
| 7         | `snapmark-desktop`, `snapmark-web`                | `milestone/online-release-1-7`         | `project/online-release-1` (desktop), `main` (web) | Codex Sol (sync engine), Sonnet 5.5 (screens) |

- This change folder stays in `snapmark-desktop`. It is the record for every milestone: `validation.md`, `findings.md` and `questions.md` hold one section per milestone.
- The new repos have no history to protect, so their milestone PRs go straight to `main` (`decisions.json` `milestoneNote`).
- `project/online-release-1` reaches `main` here once milestones 5 and 7 have merged (Stage 6p).
- Milestones 2, 4 and 6 share `snapmark-web`. Each branches from `main` after milestone 1 merges, and rebases on `main` after every merge there.

### The gate in the new repos

- Milestone 1 runs `sdlc-run adopt --preset node` and `bd init` in each new repo.
- Each new repo gets `changes/2026-10-27-online-release-1/` with byte-identical copies of `facts.md` and `done.json`, and a link back here.
- `verify_gate.py approve` runs once there, on those copies. The fact hashes then match this lock; only the checks differ per repo.
- `verify_gate.py milestone 2026-10-27-online-release-1` runs in the repo that owns the milestone.

## Milestones

### Milestone 1 — Foundations: three repos, tokens and wrappers, text, database, sign-in

- [ ] 1.1 Create `snapmark-kit`, `snapmark-web` and `snapmark-chrome` in `pokbytes` (private). CI runs format, lint, typecheck, unit and E2E jobs, with `check` as the required summary. Rulesets; semantic-release, Changesets in the kit; `CLAUDE.md` importing `snapmark-context`; `sdlc-run adopt`; `bd init`. F1, F2, F3.
- [ ] 1.2 `snapmark-kit`: `contracts` (zod, API v1 and MCP payloads), `annotations` (the versioned marks schema and the Mac app's shape renderer) and `redaction` (from `redact.ts`). All are published to GitHub Packages. F4.
- [ ] 1.3 `snapmark-kit/tokens` from `design-system-starter` plus the Snapmark overlay, and `snapmark-kit/ui` with every HeroUI wrapper of `spec/conformance.md`. Tokens lint. F6, F7, F8, F9, N1, N6, N7, N8.
- [ ] 1.4 `snapmark-web` skeleton: Next.js 16 with `(public)`, `(app)` and `(operator)` route groups under `[locale]`, next-intl, `messages/en.json` from `spec/microcopy.md`, i18n lint, dependency-cruiser boundaries. F10, F11, N2, N3, N4.
- [ ] 1.5 Lasting UX docs move into `snapmark-web/docs/ux/` (owner, 2026-10-27: "this is what I would expect"). They are `glossary.md`, `interaction-guidelines.md`, `sitemap.md`, `sitemap.json`, `setup.md` (through `omr-ux:init`), and the glossary check. F12, F13, F14, F15, F16.
- [ ] 1.6 Local run and data: Docker Compose Postgres, Drizzle schema for design 8.2 plus the tech review's additions, migrations, seed. F17, F18, F19.
- [ ] 1.7 `src/domain`: status machine, acceptance rule, entitlements and anchor resolution, pure and unit-tested. Milestones 2, 4 and 6 build on it. Part of F54 to F59 (their screens land in milestone 2).
- [ ] 1.8 Storage: Terraform for the captures and dev buckets in `snapmark-ai`, `europe-west3`, with state in a Cloud Storage backend. The storage provider hands out signed URLs. REST `POST /api/v1/captures` and `POST /api/v1/feedback`, so milestone 3 has a server. F20, F21.
- [ ] 1.9 Mail and sign-in: mail provider (`console`, `resend` stub), Better Auth magic link, Sign In and its states, Sign-In Methods with the release-2 slot. F22 to F27.
- [ ] 1.10 `snapmark-chrome` skeleton: WXT MV3, loads unpacked, the popup on `snapmark-kit/ui`. F5.

### Milestone 2 — Web app: teams, feedback, decisions, inbox, phone

- [ ] 2.1 Welcome, organisations, members, invitations, seats, guests. F28 to F33.
- [ ] 2.2 Workspace settings: environments, route rules, modules, repos. F34 to F37.
- [ ] 2.3 App shell: sidebar, ⌘K, URL state. F38, F39, F40.
- [ ] 2.4 Lists and numbering. F41, F42.
- [ ] 2.5 Feedback view: screenshot, versions, Compare, Details, drawing, thread, questions, guest and agent entries. F43 to F51.
- [ ] 2.6 Decisions, reviews and status, including the manual status change (A33). F52 to F64.
- [ ] 2.7 Inbox, My Work, mail notifications, live updates (server-sent events on Postgres `LISTEN/NOTIFY`), offline banner. F65 to F70, N13.
- [ ] 2.8 Phone layouts. F71, F72, F73, N12.

### Milestone 3 — Extension: capture, draw, locate the code

- [ ] 3.1 Popup and browser sign-in (OAuth with PKCE), environment line, guest and revoked states. F74 to F78.
- [ ] 3.2 Picker, anchor and code location: landmark region, `data-snapmark-module`, React and Next fibers with `_debugStack` and source maps, Vue and Nuxt `__file`, fallback. F79 to F84.
- [ ] 3.3 Drawing, compose, upload (WebP and a 400 px thumbnail), sent state, draft kept over a reload. F85 to F90.
- [ ] 3.4 Localhost bridge client over native messaging, with its four states. F91 to F95.

### Milestone 4 — MCP server, strict about untrusted text

- [ ] 4.1 MCP authorisation: OAuth server, consent page, device tokens, scopes, Devices, Connect an Agent. F96 to F102.
- [ ] 4.2 The nine tools. F103 to F111, N11.
- [ ] 4.3 Strict prompt-injection handling and the audit trail. F112 to F117.
- [ ] 4.4 Success measure: `implemented_via_mcp`, review rounds, the measure query. F118 to F121, N10.

### Milestone 5 — Mac localhost bridge

- [ ] 5.1 Native messaging host: manifest install, port to process to folder, repo, branch, worktree and commit. F122, F123, F124.
- [ ] 5.2 Settings › Online tab: bridge checkbox and status, Sign In… with the device code. F125 to F130, N14.

### Milestone 6 — Landing page and operator area

- [ ] 6.1 Landing page and waitlist, written at the outcome level (A30). F131 to F134.
- [ ] 6.2 Operator area: platform role, waitlist invites, invitations, organisations and seats, users, feature flags, usage, audit. F135 to F142.

### Milestone 7 — Two-way Mac sync

- [ ] 7.1 Share to Workspace, Stop Sharing, the web Session view, Mac anchors. F143 to F148.
- [ ] 7.2 Sync engine: revisions, operation log, last write wins with "Edited elsewhere", tombstones, `session.md` rewrite. F149 to F157.
- [ ] 7.3 Sync states in the session footer. F158 to F161.

Non-functional facts land where their first screen does. N1 to N4, N6 to N8 and N15 land in milestone 1. N5 and N9 apply to every milestone with screens; N10 to N14 sit where listed above.

## Approach

- **What changes:** three new repos, and two new surfaces of the Mac app: the localhost bridge and session sync.
- **What stays the same:** the Mac app works without an account, with its bundle id and its manual release (N14).
- **Why this way:** the design's one-repo-per-app layout, with shared code only in `snapmark-kit` (design 8.1).
- **Rejected:** one monorepo, which the owner replaced on 2026-10-27; a dev build plugin, which the owner ruled out for release 1 (`decisions.json` `codeLocation`).
- **Rejected:** building the REST API inside milestone 2. Milestone 3 would wait for it, so the capture endpoints move to 1.8.
- **Rejected:** the status logic inside milestone 2. Milestones 4 and 6 need it at the same time, so it moves to 1.7.

## Design changes

This planning PR edits three sections of the design in place:

- Section 3: "Agent" is the label and "Copilot" an alias (A32).
- Section 4.4: a member may change the status by hand (A33).
- Section 5: guests comment, draw and vote, and never approve (A31).

## Where things go

| New file or kind                            | Folder                                                   |
| ------------------------------------------- | -------------------------------------------------------- |
| Shared schemas and types                    | `snapmark-kit/packages/contracts/src/`                   |
| Marks schema and shape renderer             | `snapmark-kit/packages/annotations/src/`                 |
| Redaction                                   | `snapmark-kit/packages/redaction/src/`                   |
| Tokens build and output                     | `snapmark-kit/packages/tokens/`                          |
| HeroUI wrappers, Snapmark components        | `snapmark-kit/packages/ui/src/`                          |
| Web pages                                   | `snapmark-web/src/app/[locale]/(public\|app\|operator)/` |
| REST API                                    | `snapmark-web/src/app/api/v1/`                           |
| MCP endpoint                                | `snapmark-web/src/app/mcp/`                              |
| Feature code (components, actions, queries) | `snapmark-web/src/features/<feature>/`                   |
| Pure logic                                  | `snapmark-web/src/domain/`                               |
| Database, auth, mail, storage               | `snapmark-web/src/server/(db\|auth\|mail\|storage)/`     |
| UI text                                     | `snapmark-web/messages/en.json`                          |
| Lasting UX docs                             | `snapmark-web/docs/ux/`                                  |
| Terraform                                   | `snapmark-web/infra/terraform/`                          |
| Web E2E                                     | `snapmark-web/e2e/`                                      |
| Extension entry points                      | `snapmark-chrome/src/entrypoints/`                       |
| Extension E2E                               | `snapmark-chrome/e2e/`                                   |
| Mac bridge and sync                         | `snapmark-desktop/snapmark-app/src/online/`              |
| Mac tests                                   | `snapmark-desktop/snapmark-app/test/`                    |
| Per-repo change copy                        | `<repo>/changes/2026-10-27-online-release-1/`            |

## Feature PRs

none — one go. Each row under Milestones is a commit on its milestone branch. Each milestone has one PR, into the parent the table names.

## Files that change

In `snapmark-desktop` only. The three new repos are created whole.

| File                                                  | Change                                                       |
| ----------------------------------------------------- | ------------------------------------------------------------ |
| `snapmark-app/src/online/**`                          | new: bridge host, device sign-in, sync engine                |
| `snapmark-app/src/settings*`                          | the Online tab                                               |
| `snapmark-app/src/session*`, `editor*`                | sync footer, "Edited elsewhere" line, Share to Workspace     |
| `snapmark-app/src/tools.ts`, `redact.ts`, `editor.ts` | shapes and redaction import from `snapmark-kit`              |
| `snapmark-app/package.json`                           | `@snapmark/annotations` and `@snapmark/redaction` (Ask tier) |
| `docs/designs/2026-10-27-snapmark-online.md`          | sections 3, 4.4 and 5 (Design changes)                       |
| `changes/2026-10-27-online-release-1/**`              | validation, findings, questions, milestone rows              |

## Order of work

- [ ] 1. Milestone 1 rows in order, with 1.2 to 1.5 and 1.10 as parallel builders. Proof: `verify_gate.py milestone` ends `VERIFY PASS` in each new repo.
- [ ] 2. Milestones 2, 3, 4 and 5 at once — proof: each repo's milestone gate passes, and `validation.md` has no `not met` row for them.
- [ ] 3. Milestone 6 when a builder frees up — proof: the same.
- [ ] 4. Milestone 7 after milestone 2 merges — proof: the same, in both repos.
- [ ] 5. Stage 6p: `project/online-release-1` into `main` here — proof: the PR is open with auto-merge armed or merged.
- [ ] 6. The success measure query runs on the local database — proof: F121.

## Risks

| Risk                                                       | What we do                                                                                                   | Where it lands                |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ----------------------------- |
| Milestones 2, 4 and 6 edit the same web repo at once       | Shared code (domain, schema, shell) lands in milestone 1; each milestone rebases on `main` after every merge | 1.6, 1.7, 2.3                 |
| Creating repos and a real bucket cannot be undone silently | Both are approved at this gate; Terraform plans first and applies once                                       | 1.1, 1.8                      |
| Kit releases and app bumps drift                           | Apps pin kit versions; contracts change only by a new API version                                            | 1.2                           |
| React 19 dev data changes between versions                 | Fallback anchor always works; adapters are tested on pinned framework versions                               | 3.2, F84                      |
| A guest's text steers an agent (A28)                       | Quoted envelope, no approve tool, read-only tokens, audit per call                                           | 4.3                           |
| The Mac app's local workflow breaks                        | Online code lives in `src/online/`; N14 runs in the Mac smoke                                                | 5.1, 7.2                      |
| Sync loses typed text                                      | Last write wins keeps the loser in the thread; replay is tested offline                                      | F150, F153                    |
| Open validation findings, severity 2 (6) and 1 (9)         | Built as `spec/validation.md` lists them, reviewed at each milestone                                         | `spec/validation.md` Findings |
| The prototype images miss a spec detail                    | `spec/prototype/known-image-faults.md` lists them; the spec wins                                             | milestone reviews             |

## Out of scope

- Everything the design lists for release 2: deployment, Google and GitHub sign-in, the GitHub integration and Slack. Also Resend with templates, extension redaction, the Chrome Web Store and the closed beta.
- Billing with Paddle, company domains, retention jobs, audit export, the dev build plugin.

## Done

What must hold, as data in [done.json](done.json) (176 facts with tags and milestones, 44 pages, widths).

- `python3 scripts/verify_gate.py milestone 2026-10-27-online-release-1` ends `VERIFY PASS` once per milestone, in the repo that owns it.
- F1 to F161 and N1 to N15 pass by their named check in `facts.md`.
- `validation.md` has no `not met` row, and `findings.md` no open blocking item, for every milestone.
- Every milestone PR is merged or open with auto-merge armed; `project/online-release-1` has its PR to `main`.
- Nothing outside `## Where things go` and `## Files that change` is edited.
- Stop and report as soon as a step cannot proceed. Never work around a blocker.
- Stop after 200 turns if not met. Report what is missing.

## Goal handover

```
/goal Deliver change 2026-10-27-online-release-1 in one go per changes/2026-10-27-online-release-1/plan.md and facts.md: every milestone in ## Milestones, in the order and parallelism ## Order of work gives, each on its own branch milestone/online-release-1-<n> in the repo the milestone table names, cut from that repo's origin/main (snapmark-desktop milestones from origin/project/online-release-1), so building never waits for a merge it does not need. Milestone 1 first creates the three repos, adopts the SDLC there and copies facts.md and done.json into each, then runs verify_gate.py approve there once. Per feature: write the tests for its facts, build in the plan's folders, commit; run no checks, no lint and no tests between features (inside a feature, only the test files you touched), and start the next feature at once. Builders are omr-dev:builder agents on Sonnet 5.5 or Codex (codex exec -m gpt-6.1-sol) as the milestone table says, at most four at once, each in its own worktree. An open question never stops the build: write it to changes/2026-10-27-online-release-1/questions.md with the default you took, tell the engineer in one line, and carry on. Per milestone, once its features are committed: run `python3 scripts/verify_gate.py milestone 2026-10-27-online-release-1` in that repo and the Stage 6 checks once on the milestone diff, the full E2E suite once, ×3 only for changed and flaky specs per e2e/flaky-specs.txt. Then validate every fact and ask of that milestone against the built app into changes/2026-10-27-online-release-1/validation.md (expected, observed, evidence, verdict), one findings.md section, one fix round (UX findings go to the owner, never auto-fixed), rerun the gate and paste its full output, open the milestone PR into the parent the milestone table names and arm auto-merge (ask first when a Critical or High is deferred). Met only when every milestone's PR is merged or open with auto-merge armed, each repo's last gate line is `VERIFY PASS milestone 2026-10-27-online-release-1 <sha>` with <sha> equal to that repo's `git rev-parse HEAD`, validation.md has no `not met` row and findings.md no open blocking item. Also met, as a stop-and-ask, on `VERIFY BLOCKED`: summarize the repo's changes/2026-10-27-online-release-1/verify/report.md for the engineer. Never edit protected paths (facts.md, done.json, lock.json, baselines, allowlists, sdlc.json checks) or accept baselines. Tick plan tasks as they land; log departures under ## Revisions. Stop after 200 turns and report.
```

## Revisions

Only after approval. One line per change: `YYYY-MM-DD — what changed, and why`.
