---
linear: none
type: facts
change: 2026-10-27-online-release-1
design: docs/designs/2026-10-27-snapmark-online.md
author: Claude (orchestrator)
status: draft
reviewed_by: null
approved_at: null
created: 2026-10-28
---

# Facts: Snapmark online, release 1 (local)

## Goal

A team points at running UI in Chrome or on the Mac and decides together in the web app. A coding agent picks the decision up through MCP. The agent reports its work, a person accepts it, and the database counts each full loop. Everything runs on the owner's machine; only captures live in Cloud Storage.

## Acceptance criteria

The system is Snapmark: `snapmark-kit`, `snapmark-web`, `snapmark-chrome` and `snapmark-desktop`. Every fact cites its asks and its screen from `spec/screens.md`.

Tags: each fact's test carries `@F<n>` beside `@2026-10-27-online-release-1` in its title. A milestone's run selects its tests with `--grep @2026-10-27-online-release-1`. The spec in `spec/` follows each recommended default in `spec/owner-decisions.md`.

Words: "member" means owner, admin or member; "guest" means guest. "Agent" is the coding assistant acting through MCP, shown as "{name} via {client}". "Prints" means the console mail provider writes the mail to the terminal.

### Milestone 1 — Foundations

#### Repos and CI

- [ ] **F1** (A2, A6) The repos `snapmark-kit`, `snapmark-web` and `snapmark-chrome` shall exist in the `pokbytes` organisation. Screen/state: none. Tag: `@F1`.
- [ ] **F2** (A10, A29) When a pull request opens in a new repo, CI shall run the format check, lint, typecheck, unit and end-to-end tests. Screen/state: none. Tag: `@F2`.
- [ ] **F3** (A29) Each new repo shall hold a `CLAUDE.md` importing `snapmark-context`, `sdlc.json`, `docs/sdlc.md` and a Beads tracker from `bd init`. Screen/state: none. Tag: `@F3`.
- [ ] **F4** (A2, A9) `snapmark-kit` shall publish `contracts`, `annotations`, `redaction`, `tokens` and `ui` to GitHub Packages. Screen/state: none. Tag: `@F4`.
- [ ] **F5** (A6, A21) `snapmark-chrome` shall build an MV3 extension with WXT that loads unpacked in Chrome. Screen/state: none. Tag: `@F5`.

#### Tokens, HeroUI wrappers and calm style

- [ ] **F6** (A9, A10) The `tokens` package shall turn `design-system-starter` plus the Snapmark overlay into CSS variables, a Tailwind theme and a HeroUI theme. Screen/state: none. Tag: `@F6`.
- [ ] **F7** (A9, A24) Web and extension screens shall use HeroUI only through `snapmark-kit/ui` wrappers. Screen/state: every screen. Tag: `@F7`.
- [ ] **F8** (A11) Brand blue `#2492FF` shall fill at most one primary button per region and colour nothing else. Screen/state: every screen. Tag: `@F8`.
- [ ] **F9** (A11) The focus ring shall show only on keyboard focus, in the neutral focus colour. Screen/state: every screen, after Tab. Tag: `@F9`.

#### Text, glossary and lasting UX docs

- [ ] **F10** (A10) `snapmark-web` shall use next-intl with English as the default and only locale, under `/[locale]/…`. Screen/state: none. Tag: `@F10`.
- [ ] **F11** (A10, A30) `snapmark-web/messages/en.json` shall hold every string of `spec/microcopy.md` under its key. Screen/state: none. Tag: `@F11`.
- [ ] **F12** (A10, A32) `snapmark-web/docs/ux/glossary.md` shall define every product term, with Agent as the label and Copilot as an alias. Screen/state: none. Tag: `@F12`.
- [ ] **F13** (A10) If `en.json` uses a product word missing from `glossary.md`, then the glossary check shall fail. Screen/state: none. Tag: `@F13`.
- [ ] **F14** (A29) `snapmark-web/docs/ux/interaction-guidelines.md` shall hold the Mac rules that apply to the web plus the approved WEB rules. Screen/state: none. Tag: `@F14`.
- [ ] **F15** (A29) `snapmark-web/docs/ux/sitemap.md` and `sitemap.json` shall list every route of `spec/sitemap.md`. Screen/state: none. Tag: `@F15`.
- [ ] **F16** (A29) `snapmark-web/docs/ux/setup.md` shall name the product, audience, design rules, screens and how to run the app. Screen/state: none. Tag: `@F16`.

#### Local run, database and storage

- [ ] **F17** (A19) `docker compose up` shall start Postgres, and `npm run dev` shall serve the web app on `localhost`. Screen/state: none. Tag: `@F17`.
- [ ] **F18** (A19) `npm run db:migrate` shall create every core table of design 8.2, each with a UUIDv7 `id`. Screen/state: none. Tag: `@F18`.
- [ ] **F19** (A19) `npm run db:seed` shall create one organisation, two workspaces, an owner, a member, a guest and feedback in every status. Screen/state: none. Tag: `@F19`.
- [ ] **F20** (A19) Terraform shall create a private captures bucket and a separate dev bucket in `europe-west3`, project `snapmark-ai`. Screen/state: none. Tag: `@F20`.
- [ ] **F21** (A19) The storage service shall be an interface, a factory and a `gcs` provider that hands out signed URLs only. Screen/state: none. Tag: `@F21`.

#### Sign-in and mail

- [ ] **F22** (A8) The mail service shall be an interface with a factory that picks the `console` or `resend` provider from settings. Screen/state: none. Tag: `@F22`.
- [ ] **F23** (A20) While the mail provider is `console`, the system shall print each mail's recipient, subject and link to the terminal. Screen/state: Emails. Tag: `@F23`.
- [ ] **F24** (A7, A20) When a person submits an email on Sign In, the system shall print a sign-in link. Screen/state: Sign in, Check your email. Tag: `@F24`.
- [ ] **F25** (A7) When the person opens a valid link, the system shall sign them in and open their last organisation. Screen/state: Verify. Tag: `@F25`.
- [ ] **F26** (A7) If a link is reused or older than 15 minutes, then the system shall refuse it and offer a new one. Screen/state: Verify, expired. Tag: `@F26`.
- [ ] **F27** (A7) Account › Sign-In Methods shall list Email and keep a slot for GitHub and Google with no button. Screen/state: Account, Sign-In Methods. Tag: `@F27`.

<details>
<summary>Verification</summary>

- F1 — manual: the owner opens `github.com/pokbytes` and sees the three repos.
- F2 — tag `@F2`: `snapmark-web/test/ci/workflow.test.ts › CI runs every check on pull requests` (one per repo).
- F3 — tag `@F3`: `snapmark-web/test/repo/sdlc.test.ts › repo carries CLAUDE.md, sdlc.json, docs/sdlc.md, .beads` (one per repo).
- F4 — tag `@F4`: `snapmark-kit/test/packages.test.ts › every package publishes to GitHub Packages`
- F5 — tag `@F5`: `snapmark-chrome/e2e/load.spec.ts › unpacked build loads in Chrome`
- F6 — tag `@F6`: `snapmark-kit/packages/tokens/test/build.test.ts › emits CSS variables, Tailwind and HeroUI themes`
- F7 — tag `@F7`: `snapmark-web/test/lint/heroui-imports.test.ts › no direct @heroui import outside snapmark-kit/ui`
- F8 — tag `@F8`: `snapmark-web/e2e/style.spec.ts › one filled primary per region, no other blue`
- F9 — tag `@F9`: `snapmark-web/e2e/style.spec.ts › focus ring on keyboard focus only`
- F10 — tag `@F10`: `snapmark-web/e2e/i18n.spec.ts › every route lives under /en`
- F11 — tag `@F11`: `snapmark-web/test/i18n/microcopy.test.ts › every microcopy key exists in en.json`
- F12 — tag `@F12`: `snapmark-web/test/docs/glossary.test.ts › glossary holds every term and the Agent alias`
- F13 — tag `@F13`: `snapmark-web/test/docs/glossary.test.ts › unknown product word fails the check`
- F14 — manual: the owner reads `interaction-guidelines.md` against `spec/interaction.md` at the plan gate.
- F15 — tag `@F15`: `snapmark-web/test/docs/sitemap.test.ts › sitemap.json matches the app routes`
- F16 — manual: the owner reads `setup.md` and starts the app from it.
- F17 — tag `@F17`: `snapmark-web/e2e/smoke.spec.ts › app answers on localhost`
- F18 — tag `@F18`: `snapmark-web/test/db/migrate.test.ts › migrations create the core tables`
- F19 — tag `@F19`: `snapmark-web/test/db/seed.test.ts › seed covers every role and status`
- F20 — tag `@F20`: `snapmark-web/infra/test/terraform.test.ts › plan creates two private buckets in europe-west3`
- F21 — tag `@F21`: `snapmark-web/test/server/storage.test.ts › factory returns gcs; reads are signed URLs`
- F22 — tag `@F22`: `snapmark-web/test/server/mail.test.ts › factory picks console or resend`
- F23 — tag `@F23`: `snapmark-web/test/server/mail.test.ts › console provider prints recipient, subject and link`
- F24 — tag `@F24`: `snapmark-web/e2e/sign-in.spec.ts › link prints to the terminal`
- F25 — tag `@F25`: `snapmark-web/e2e/sign-in.spec.ts › link signs in and opens the last organisation`
- F26 — tag `@F26`: `snapmark-web/e2e/sign-in.spec.ts › used or expired link is refused`
- F27 — tag `@F27`: `snapmark-web/e2e/account.spec.ts › sign-in methods list email, slot for later`

</details>

### Milestone 2 — Web app

#### Organisations, members and invitations

- [ ] **F28** (A17, A30) When a person with an unused waitlist invitation signs in, the system shall open Welcome. Screen/state: Welcome (first run). Tag: `@F28`.
- [ ] **F29** (A17) When they name the organisation and first workspace on Welcome, the system shall create both and open that workspace. Screen/state: Welcome (first run). Tag: `@F29`.
- [ ] **F30** (A20) When an admin invites an email with a role, the system shall print the invitation mail. Screen/state: Organisation settings, Members. Tag: `@F30`.
- [ ] **F31** (A17) If the role needs a seat and no seat is free, then Send shall be disabled with the seat count. Screen/state: Organisation settings, Members. Tag: `@F31`.
- [ ] **F32** (A7) When an invitee accepts at `/invite/[token]`, the system shall add them with the invited role. Screen/state: Invitation. Tag: `@F32`.
- [ ] **F33** (A31) While a person is a guest, the system shall show only the workspaces they are invited to. Screen/state: App shell. Tag: `@F33`.

#### Workspace setup

- [ ] **F34** (A16) Workspace Settings › Environments shall store a kind (local, preview, staging, production) and address patterns. Screen/state: Workspace settings, Environments. Tag: `@F34`.
- [ ] **F35** (A16) When a capture's address matches a pattern, the system shall stamp that environment, so `omr.ninja` reads Staging. Screen/state: Feedback view, Details. Tag: `@F35`.
- [ ] **F36** (A5, A15) When a capture's path matches a route rule, the system shall stamp that rule's repo. Screen/state: Workspace settings, Route Rules. Tag: `@F36`.
- [ ] **F37** (A13) Workspace Settings › Modules shall add, rename and delete a workspace's modules. Screen/state: Workspace settings, Modules. Tag: `@F37`.

#### Navigation

- [ ] **F38** (A27) Every app page shall show one left sidebar: organisation, Search, Inbox, My Work, each workspace's lists and Modules, Settings. Screen/state: App shell. Tag: `@F38`.
- [ ] **F39** (A29) Every filter, tab and version shall live in the URL, so reload and Back show the same view. Screen/state: Workspace lists, Feedback view. Tag: `@F39`.
- [ ] **F40** (A29) When a person presses ⌘K on any app page, the system shall open the command menu. Screen/state: App shell, command menu. Tag: `@F40`.

#### Feedback lists and view

- [ ] **F41** (A1, A3, A12) Open shall hold Open and In Progress items, Needs Decision flagged ones, In Review Implemented, Done Accepted. Screen/state: Workspace lists, Open. Tag: `@F41`.
- [ ] **F42** (A1) Each feedback shall get the next number in its workspace, at `/<org>/<workspace>/feedback/<n>`. Screen/state: Feedback view. Tag: `@F42`.
- [ ] **F43** (A1, A14) The feedback view shall show the screenshot with markers in the centre, version tabs above, and the thread on the right. Screen/state: Feedback view. Tag: `@F43`.
- [ ] **F44** (A13, A15, A22) Details shall list region, module, component, `file:line`, repo, branch and version stamp, or "Unknown" for each. Screen/state: Feedback view, Details. Tag: `@F44`.
- [ ] **F45** (A4) When a member or guest draws on the screenshot, the system shall store the shapes as vector data on a thread entry. Screen/state: Feedback view, Draw on Screenshot. Tag: `@F45`.
- [ ] **F46** (A1, A14) When someone sends a comment on a version, the entry shall appear in that version's thread. Screen/state: Feedback view, thread. Tag: `@F46`.
- [ ] **F47** (A12) When someone asks a question, the feedback shall carry Needs Answer until the question is answered. Screen/state: Feedback view, thread. Tag: `@F47`.
- [ ] **F48** (A12, A14) When a member posts a mockup or alternative, it shall become the next version tab. Screen/state: Post Version (dialog). Tag: `@F48`.
- [ ] **F49** (A14) When a person presses Compare, two versions shall show side by side with linked zoom and pan. Screen/state: Feedback view, Compare. Tag: `@F49`.
- [ ] **F50** (A28, A31) Every entry a guest wrote shall carry a Guest chip in the web app, phone view, session view and emails. Screen/state: Feedback view, thread. Tag: `@F50`.
- [ ] **F51** (A14, A32) An entry an agent wrote shall read "{name} via {client}". Screen/state: Feedback view, thread. Tag: `@F51`.

#### Decisions, reviews and status

- [ ] **F52** (A12) When a member requests a decision, the system shall ask the named people to vote between versions, with an optional date. Screen/state: Decision request, dialog. Tag: `@F52`.
- [ ] **F53** (A12, A14) The decision card shall show the vote tally per version. Screen/state: Decision request, card. Tag: `@F53`.
- [ ] **F54** (A3) A version shall be accepted when it has at least one Approve and no open Request Changes. Screen/state: Feedback view. Tag: `@F54`.
- [ ] **F55** (A12, A14) When a mockup or alternative is accepted, the feedback shall be Decided and claimable, with its status unchanged. Screen/state: Feedback view. Tag: `@F55`.
- [ ] **F56** (A3) The status shall move only along Open, In Progress, Implemented, Accepted, or back to Open. Screen/state: Feedback view. Tag: `@F56`.
- [ ] **F57** (A3) When an implementation version is accepted, the feedback shall become Accepted and move to Done. Screen/state: Workspace lists, Done. Tag: `@F57`.
- [ ] **F58** (A3) When someone requests changes on an implementation, the feedback shall return to Open. Screen/state: Feedback view. Tag: `@F58`.
- [ ] **F59** (A3) When someone requests changes on an accepted version, the feedback shall reopen to Open. Screen/state: Feedback view. Tag: `@F59`.
- [ ] **F60** (A31) While the viewer is a guest, Approve and Request Changes shall be disabled with the reason. Comment, Draw on Screenshot and Vote stay. Screen/state: Feedback view, guest. Tag: `@F60`.
- [ ] **F61** (A33) When a member picks a status on the feedback view, the system shall change the chip and add a thread line. Screen/state: Feedback view, status control. Tag: `@F61`.
- [ ] **F62** (A33) When a member sets Implemented by hand, the system shall add an implementation version "marked by {name}" with no after-screenshot. Screen/state: Feedback view. Tag: `@F62`.
- [ ] **F63** (A33) When a member picks Change Status for selected rows, the system shall move each row to the new status. Screen/state: Workspace lists, selection bar. Tag: `@F63`.
- [ ] **F64** (A3) Every change of status, version, review or vote shall write one append-only `audit_events` row. Screen/state: none. Tag: `@F64`.

#### Inbox, My Work and live updates

- [ ] **F65** (A3, A12) Inbox shall list the decision requests, review requests, mentions and answers addressed to you, across workspaces. Screen/state: Inbox. Tag: `@F65`.
- [ ] **F66** (A3, A31) When an implementation is reported, review requests shall go to earlier approvers, voters and admins, never to a guest. Screen/state: Inbox. Tag: `@F66`.
- [ ] **F67** (A20) When you are mentioned or get a decision request, review request or answer, the system shall print a mail at once. Screen/state: Emails. Tag: `@F67`.
- [ ] **F68** (A3) My Work shall list what you asked for and what your agent claimed. Screen/state: My Work. Tag: `@F68`.
- [ ] **F69** (A3) When another person changes a feedback, its view shall show the change within 2 seconds without a reload. Screen/state: Feedback view. Tag: `@F69`.
- [ ] **F70** (A11) If the browser goes offline, then the system shall show a banner, block writes and keep drafts. Screen/state: App shell, offline. Tag: `@F70`.

#### Phone

- [ ] **F71** (A18) On a phone, the reply field and Approve, Request Changes and Vote shall stay on screen while the thread scrolls. Screen/state: Phone feedback view. Tag: `@F71`.
- [ ] **F72** (A18) On a phone, Inbox, item, Approve v{n} shall take three taps and name the version. Screen/state: Phone inbox, Phone feedback view. Tag: `@F72`.
- [ ] **F73** (A18) On a phone, settings, drawing, Post Version and the operator area shall show the desktop-only message. Screen/state: Desktop-only message. Tag: `@F73`.

<details>
<summary>Verification</summary>

- F28 — tag `@F28`: `snapmark-web/e2e/welcome.spec.ts › waitlist invitation opens Welcome`
- F29 — tag `@F29`: `snapmark-web/e2e/welcome.spec.ts › Welcome creates organisation and workspace`
- F30 — tag `@F30`: `snapmark-web/e2e/members.spec.ts › invite prints the mail`
- F31 — tag `@F31`: `snapmark-web/e2e/members.spec.ts › no free seat disables Send`
- F32 — tag `@F32`: `snapmark-web/e2e/invitation.spec.ts › accept adds the invited role`
- F33 — tag `@F33`: `snapmark-web/e2e/guest.spec.ts › guest sees invited workspaces only`
- F34 — tag `@F34`: `snapmark-web/e2e/workspace-settings.spec.ts › environment kind and patterns save`
- F35 — tag `@F35`: `snapmark-web/test/domain/environment.test.ts › omr.ninja resolves to staging`
- F36 — tag `@F36`: `snapmark-web/test/domain/route-rules.test.ts › path resolves to the rule's repo`
- F37 — tag `@F37`: `snapmark-web/e2e/workspace-settings.spec.ts › add, rename, delete module`
- F38 — tag `@F38`: `snapmark-web/e2e/app-shell.spec.ts › sidebar order`
- F39 — tag `@F39`: `snapmark-web/e2e/url-state.spec.ts › reload and Back keep filters, tab and version`
- F40 — tag `@F40`: `snapmark-web/e2e/app-shell.spec.ts › ⌘K opens the command menu`
- F41 — tag `@F41`: `snapmark-web/e2e/lists.spec.ts › each list holds its statuses`
- F42 — tag `@F42`: `snapmark-web/test/domain/numbering.test.ts › numbers count per workspace`
- F43 — tag `@F43`: `snapmark-web/e2e/feedback-view.spec.ts › layout: screenshot, tabs, thread`
- F44 — tag `@F44`: `snapmark-web/e2e/feedback-view.spec.ts › Details lists the anchor and stamp, or Unknown`
- F45 — tag `@F45`: `snapmark-web/e2e/feedback-view.spec.ts › drawing stores vector shapes`
- F46 — tag `@F46`: `snapmark-web/e2e/feedback-view.spec.ts › comment lands on its version`
- F47 — tag `@F47`: `snapmark-web/e2e/feedback-view.spec.ts › question flags Needs Answer until answered`
- F48 — tag `@F48`: `snapmark-web/e2e/post-version.spec.ts › mockup becomes the next tab`
- F49 — tag `@F49`: `snapmark-web/e2e/feedback-view.spec.ts › Compare links zoom and pan`
- F50 — tag `@F50`: `snapmark-web/e2e/guest.spec.ts › Guest chip on every surface`
- F51 — tag `@F51`: `snapmark-web/e2e/feedback-view.spec.ts › agent entry reads name via client`
- F52 — tag `@F52`: `snapmark-web/e2e/decision.spec.ts › request a decision`
- F53 — tag `@F53`: `snapmark-web/e2e/decision.spec.ts › card shows the tally`
- F54 — tag `@F54`: `snapmark-web/test/domain/acceptance.test.ts › one Approve and no objection accepts`
- F55 — tag `@F55`: `snapmark-web/test/domain/acceptance.test.ts › accepted mockup marks Decided`
- F56 — tag `@F56`: `snapmark-web/test/domain/status.test.ts › only allowed transitions`
- F57 — tag `@F57`: `snapmark-web/e2e/review.spec.ts › accepted implementation moves to Done`
- F58 — tag `@F58`: `snapmark-web/e2e/review.spec.ts › Request Changes returns to Open`
- F59 — tag `@F59`: `snapmark-web/test/domain/status.test.ts › late objection reopens`
- F60 — tag `@F60`: `snapmark-web/e2e/guest.spec.ts › Approve disabled with reason; comment, draw, vote work`
- F61 — tag `@F61`: `snapmark-web/e2e/manual-status.spec.ts › status control adds a thread line`
- F62 — tag `@F62`: `snapmark-web/e2e/manual-status.spec.ts › Implemented by hand adds a marked version`
- F63 — tag `@F63`: `snapmark-web/e2e/manual-status.spec.ts › bulk Change Status`
- F64 — tag `@F64`: `snapmark-web/test/server/audit.test.ts › every change writes one row`
- F65 — tag `@F65`: `snapmark-web/e2e/inbox.spec.ts › Inbox lists what needs you`
- F66 — tag `@F66`: `snapmark-web/test/domain/review-request.test.ts › recipients exclude guests`
- F67 — tag `@F67`: `snapmark-web/test/server/notify.test.ts › immediate mails print`
- F68 — tag `@F68`: `snapmark-web/e2e/my-work.spec.ts › asked and claimed items`
- F69 — tag `@F69`: `snapmark-web/e2e/live.spec.ts › change shows within 2 s`
- F70 — tag `@F70`: `snapmark-web/e2e/offline.spec.ts › banner, blocked writes, kept draft`
- F71 — tag `@F71`: `snapmark-web/e2e/phone.spec.ts › action bar stays on screen`
- F72 — tag `@F72`: `snapmark-web/e2e/phone.spec.ts › approve in three taps`
- F73 — tag `@F73`: `snapmark-web/e2e/phone.spec.ts › desktop-only message`

</details>

### Milestone 3 — Extension

#### Popup and sign-in

- [ ] **F74** (A6) While signed out, the popup shall show "Sign in to point at what should change." and no Capture. Screen/state: Extension popup, signed out. Tag: `@F74`.
- [ ] **F75** (A6, A28) When a person presses Sign In, the extension shall sign in through the browser with OAuth and PKCE. Screen/state: Device consent. Tag: `@F75`.
- [ ] **F76** (A16) The popup shall show "{host} · {environment}" from the workspace's address patterns. Screen/state: Extension popup. Tag: `@F76`.
- [ ] **F77** (A31) While the person is a guest in the chosen workspace, the popup shall disable Capture with the reason. Screen/state: Extension popup, guest. Tag: `@F77`.
- [ ] **F78** (A28) If the device token is revoked, then the popup shall show "You were signed out. Sign in again to capture." Screen/state: Extension popup, revoked. Tag: `@F78`.

#### Picking and anchor

- [ ] **F79** (A1, A13) While picking, the hovered element shall get the red `x-picker-outline` and a chip with region, module, component and file. Screen/state: Extension picker overlay. Tag: `@F79`.
- [ ] **F80** (A1, A13) The anchor shall hold URL, selector, DOM path, text, bounding box, viewport and landmark region. Screen/state: none. Tag: `@F80`.
- [ ] **F81** (A13) When the element sits inside a `data-snapmark-module` attribute, the anchor shall carry that module. Screen/state: Extension drawing and compose. Tag: `@F81`.
- [ ] **F82** (A22) On a React or Next dev build, the anchor shall carry the component name and `file:line` from fibers, `_debugStack` and source maps. Screen/state: Extension picker overlay. Tag: `@F82`.
- [ ] **F83** (A22) On a Vue or Nuxt dev build, the anchor shall carry the component name and its `__file`. Screen/state: Extension picker overlay. Tag: `@F83`.
- [ ] **F84** (A22) If no framework data is found, then compose shall show the fallback anchor and "Unknown" for the file. Screen/state: Extension drawing and compose. Tag: `@F84`.

#### Drawing, compose and send

- [ ] **F85** (A4) The drawing toolbar shall offer the shared tools from `snapmark-kit/annotations`, stored as vector shapes. Screen/state: Extension drawing and compose. Tag: `@F85`.
- [ ] **F86** (A1, A3) Compose shall ask for a kind, Comment or Change Request, a module, a title and a description. Screen/state: Extension drawing and compose. Tag: `@F86`.
- [ ] **F87** (A1) When a person sends, the extension shall upload the capture as WebP with a 400 px thumbnail and create the feedback. Screen/state: Extension sent confirmation. Tag: `@F87`.
- [ ] **F88** (A1) After Send, the feedback shall appear in the workspace's Open list within 2 seconds. Screen/state: Workspace lists, Open. Tag: `@F88`.
- [ ] **F89** (A1) The sent confirmation shall link to the feedback and offer the next capture. Screen/state: Extension sent confirmation. Tag: `@F89`.
- [ ] **F90** (A1) If the page reloads at the same address, then compose shall reopen with the draft kept. Screen/state: Extension drawing and compose. Tag: `@F90`.

#### Localhost bridge, extension side

- [ ] **F91** (A5) While on localhost and the Mac app answers, the popup shall show "From your Mac: {repo} · {branch} · {worktree}". Screen/state: Extension popup, bridge connected. Tag: `@F91`.
- [ ] **F92** (A5) If the Mac app does not answer, then the popup shall say the Mac app isn't running. Screen/state: Extension popup, bridge not running. Tag: `@F92`.
- [ ] **F93** (A5) If the bridge is off, then the popup shall say where to turn it on. Screen/state: Extension popup, bridge off. Tag: `@F93`.
- [ ] **F94** (A5) If the Mac app found no repo for the host, then the popup shall say so and name Docker as a cause. Screen/state: Extension popup, bridge no repo. Tag: `@F94`.
- [ ] **F95** (A5, A15) When the bridge answers, the capture's version stamp shall carry its repo, branch, worktree and commit. Screen/state: Feedback view, Details. Tag: `@F95`.

<details>
<summary>Verification</summary>

- F74 — tag `@F74`: `snapmark-chrome/e2e/popup.spec.ts › signed out shows no Capture`
- F75 — tag `@F75`: `snapmark-chrome/e2e/popup.spec.ts › sign-in through the browser`
- F76 — tag `@F76`: `snapmark-chrome/e2e/popup.spec.ts › environment line`
- F77 — tag `@F77`: `snapmark-chrome/e2e/popup.spec.ts › guest cannot capture`
- F78 — tag `@F78`: `snapmark-chrome/e2e/popup.spec.ts › revoked token signs out`
- F79 — tag `@F79`: `snapmark-chrome/e2e/picker.spec.ts › outline and chip`
- F80 — tag `@F80`: `snapmark-kit/packages/annotations/test/anchor.test.ts › anchor fields`
- F81 — tag `@F81`: `snapmark-chrome/e2e/picker.spec.ts › module attribute`
- F82 — tag `@F82`: `snapmark-chrome/e2e/code-location.spec.ts › next fixture gives file:line`
- F83 — tag `@F83`: `snapmark-chrome/e2e/code-location.spec.ts › nuxt fixture gives __file`
- F84 — tag `@F84`: `snapmark-chrome/e2e/code-location.spec.ts › plain page falls back`
- F85 — tag `@F85`: `snapmark-chrome/e2e/compose.spec.ts › tools store vector shapes`
- F86 — tag `@F86`: `snapmark-chrome/e2e/compose.spec.ts › compose fields`
- F87 — tag `@F87`: `snapmark-chrome/e2e/compose.spec.ts › send uploads WebP and thumbnail`
- F88 — tag `@F88`: `snapmark-chrome/e2e/compose.spec.ts › item in Open within 2 s`
- F89 — tag `@F89`: `snapmark-chrome/e2e/compose.spec.ts › confirmation links the feedback`
- F90 — tag `@F90`: `snapmark-chrome/e2e/compose.spec.ts › draft survives reload`
- F91 — tag `@F91`: `snapmark-chrome/e2e/bridge.spec.ts › connected line (stub host)`
- F92 — tag `@F92`: `snapmark-chrome/e2e/bridge.spec.ts › not running line`
- F93 — tag `@F93`: `snapmark-chrome/e2e/bridge.spec.ts › off line`
- F94 — tag `@F94`: `snapmark-chrome/e2e/bridge.spec.ts › no repo line`
- F95 — tag `@F95`: `snapmark-chrome/e2e/bridge.spec.ts › stamp carries repo and branch`

</details>

### Milestone 4 — MCP server

#### Devices and scopes

- [ ] **F96** (A2) The MCP endpoint at `/mcp` shall follow the MCP authorisation spec, with browser sign-in through OAuth and PKCE. Screen/state: Device consent. Tag: `@F96`.
- [ ] **F97** (A28) The consent page shall show the read line and the write scopes unticked, with Allow and Deny of equal weight. Screen/state: Device consent. Tag: `@F97`.
- [ ] **F98** (A28) A new device token shall be read-only unless the person ticked a write scope. Screen/state: Device consent. Tag: `@F98`.
- [ ] **F99** (A28) If a read-only token calls `reply`, `post_version` or `report_implementation`, then the server shall refuse and name the missing scope. Screen/state: none. Tag: `@F99`.
- [ ] **F100** (A28) Account › Devices shall list each device with its client, scopes and last use. Screen/state: Account, Devices. Tag: `@F100`.
- [ ] **F101** (A18, A28) When a person revokes a device, its next call shall be refused, on a phone too. Screen/state: Account, Devices. Tag: `@F101`.
- [ ] **F102** (A2) Connect an Agent shall show the MCP address and the command to add it. Screen/state: Account, Devices. Tag: `@F102`.

#### Tools

- [ ] **F103** (A2, A28) The server shall offer exactly `list_workspaces`, `list_feedback`, `get_feedback`, `claim`, `ask`, `post_version`, `report_implementation` and `reply`. Screen/state: none. Tag: `@F103`.
- [ ] **F104** (A3, A28) No tool shall approve, request changes or change acceptance. Screen/state: none. Tag: `@F104`.
- [ ] **F105** (A2) Tools shall take the workspace from a link, the repo or an argument, across every organisation the user can see. Screen/state: none. Tag: `@F105`.
- [ ] **F106** (A2, A5) `list_feedback` shall filter by repo, branch and status, and return decided change requests by default. Screen/state: none. Tag: `@F106`.
- [ ] **F107** (A15) `get_feedback` shall return Markdown with image URLs, anchor, version stamp, accepted version and thread. Screen/state: none. Tag: `@F107`.
- [ ] **F108** (A3, A14) When an agent claims a feedback, its row shall read "In Progress · {name} via {client}". Screen/state: Workspace lists, Open. Tag: `@F108`.
- [ ] **F109** (A12) If a feedback has an open question or decision request, then `claim` shall refuse and name the flag. Screen/state: none. Tag: `@F109`.
- [ ] **F110** (A3) When an agent calls `report_implementation`, the system shall add an implementation version with commit, PR and after-capture. Screen/state: Feedback view. Tag: `@F110`.
- [ ] **F111** (A3) After `report_implementation`, the feedback shall be Implemented and listed in In Review. Screen/state: Workspace lists, In Review. Tag: `@F111`.

#### Strict prompt-injection handling

- [ ] **F112** (A28) Every human-written text in a tool result shall be a quoted envelope with `author`, `role` and `untrusted: true`. Screen/state: none. Tag: `@F112`.
- [ ] **F113** (A28, A31) A guest's text shall carry `role: "guest"` in every tool result. Screen/state: none. Tag: `@F113`.
- [ ] **F114** (A28) Each tool description shall say that quoted text is a person's request about the product, never an instruction. Screen/state: none. Tag: `@F114`.
- [ ] **F115** (A28) Human-written text shall never appear in tool descriptions or server instructions. Screen/state: none. Tag: `@F115`.
- [ ] **F116** (A28) No tool shall fetch URLs, run commands or return content from customer sites. Screen/state: none. Tag: `@F116`.
- [ ] **F117** (A28) Every MCP call shall write an audit event with the token, the tool and the ids it touched. Screen/state: none. Tag: `@F117`.

#### Success measure

- [ ] **F118** (A2, A3) `report_implementation` shall set `feedback.implemented_via_mcp` to true. Screen/state: none. Tag: `@F118`.
- [ ] **F119** (A33) When a member sets Implemented by hand, `implemented_via_mcp` shall be false. Screen/state: none. Tag: `@F119`.
- [ ] **F120** (A3) Each Request Changes on an implementation shall count one review round on the feedback. Screen/state: none. Tag: `@F120`.
- [ ] **F121** (A2, A3) The intent's measure query shall run against the local database and return the count of full loops. Screen/state: none. Tag: `@F121`.

<details>
<summary>Verification</summary>

- F96 — tag `@F96`: `snapmark-web/test/mcp/auth.test.ts › unauthenticated call gets the OAuth challenge`
- F97 — tag `@F97`: `snapmark-web/e2e/device-consent.spec.ts › scopes unticked, equal buttons`
- F98 — tag `@F98`: `snapmark-web/test/mcp/scopes.test.ts › new token is read-only`
- F99 — tag `@F99`: `snapmark-web/test/mcp/scopes.test.ts › write tool refused without scope`
- F100 — tag `@F100`: `snapmark-web/e2e/account.spec.ts › devices list scopes and last use`
- F101 — tag `@F101`: `snapmark-web/e2e/phone.spec.ts › revoke on a phone refuses the next call`
- F102 — tag `@F102`: `snapmark-web/e2e/account.spec.ts › Connect an Agent shows address and command`
- F103 — tag `@F103`: `snapmark-web/test/mcp/tools.test.ts › exact tool list`
- F104 — tag `@F104`: `snapmark-web/test/mcp/tools.test.ts › no approve tool`
- F105 — tag `@F105`: `snapmark-web/test/mcp/tools.test.ts › workspace from link, repo or argument`
- F106 — tag `@F106`: `snapmark-web/test/mcp/list-feedback.test.ts › filters and default`
- F107 — tag `@F107`: `snapmark-web/test/mcp/get-feedback.test.ts › result fields`
- F108 — tag `@F108`: `snapmark-web/e2e/mcp-loop.spec.ts › claim shows In Progress via client`
- F109 — tag `@F109`: `snapmark-web/test/mcp/claim.test.ts › flagged feedback refused`
- F110 — tag `@F110`: `snapmark-web/e2e/mcp-loop.spec.ts › report adds an implementation version`
- F111 — tag `@F111`: `snapmark-web/e2e/mcp-loop.spec.ts › report moves to In Review`
- F112 — tag `@F112`: `snapmark-web/test/mcp/untrusted.test.ts › every human text is enveloped`
- F113 — tag `@F113`: `snapmark-web/test/mcp/untrusted.test.ts › guest role marked`
- F114 — tag `@F114`: `snapmark-web/test/mcp/untrusted.test.ts › descriptions carry the data warning`
- F115 — tag `@F115`: `snapmark-web/test/mcp/untrusted.test.ts › injection text never reaches descriptions`
- F116 — tag `@F116`: `snapmark-web/test/mcp/tools.test.ts › no fetch or exec in tool handlers`
- F117 — tag `@F117`: `snapmark-web/test/mcp/audit.test.ts › one audit row per call`
- F118 — tag `@F118`: `snapmark-web/test/mcp/report.test.ts › sets implemented_via_mcp`
- F119 — tag `@F119`: `snapmark-web/test/domain/status.test.ts › manual Implemented is not via MCP`
- F120 — tag `@F120`: `snapmark-web/test/domain/review-rounds.test.ts › rounds count`
- F121 — tag `@F121`: `snapmark-web/test/db/measure.test.ts › measure query counts full loops on the seed`

</details>

### Milestone 5 — Mac localhost bridge

- [ ] **F122** (A5) The Mac app shall install a Chrome native messaging host manifest for the extension's id. Screen/state: none. Tag: `@F122`.
- [ ] **F123** (A5) When the extension asks about `localhost:<port>`, the Mac app shall answer with the serving folder, repo, branch, worktree and commit. Screen/state: none. Tag: `@F123`.
- [ ] **F124** (A5) If the serving process has no git folder, then the Mac app shall answer "no repo". Screen/state: none. Tag: `@F124`.
- [ ] **F125** (A26) Settings shall gain an Online tab as the last tab, with Sign In… and the Localhost Bridge checkbox. Screen/state: Settings › Online tab. Tag: `@F125`.
- [ ] **F126** (A5) The Localhost Bridge checkbox shall be on by default. Screen/state: Settings › Online tab. Tag: `@F126`.
- [ ] **F127** (A5) While the bridge is off, the Mac app shall answer "off" to every extension request. Screen/state: Settings › Online tab. Tag: `@F127`.
- [ ] **F128** (A5) The bridge status line shall read "Extension connected" or "Extension not found". Screen/state: Settings › Online tab. Tag: `@F128`.
- [ ] **F129** (A26, A28) When a person presses Sign In…, the Mac app shall open the browser and show the device code. Screen/state: Settings › Online tab, device code. Tag: `@F129`.
- [ ] **F130** (A26) If the device code expires, then the tab shall say "The code expired. Sign in again." Screen/state: Settings › Online tab, expired. Tag: `@F130`.

<details>
<summary>Verification</summary>

- F122 — tag `@F122`: `snapmark-desktop/snapmark-app/test/bridge.test.ts › host manifest names the extension id`
- F123 — tag `@F123`: `snapmark-desktop/snapmark-app/test/bridge.test.ts › port resolves to repo, branch, worktree, commit`
- F124 — tag `@F124`: `snapmark-desktop/snapmark-app/test/bridge.test.ts › no git folder answers no repo`
- F125 — tag `@F125`: `snapmark-desktop/snapmark-app/test/smoke.ts › Online tab is last`
- F126 — tag `@F126`: `snapmark-desktop/snapmark-app/test/bridge.test.ts › on by default`
- F127 — tag `@F127`: `snapmark-desktop/snapmark-app/test/bridge.test.ts › off answers off`
- F128 — tag `@F128`: `snapmark-desktop/snapmark-app/test/smoke.ts › bridge status line`
- F129 — tag `@F129`: `snapmark-desktop/snapmark-app/test/online.test.ts › device code flow`
- F130 — tag `@F130`: `snapmark-desktop/snapmark-app/test/online.test.ts › expired code`

</details>

### Milestone 6 — Public landing page and operator area

#### Public

- [ ] **F131** (A17) `/` shall show the landing page with one waitlist form, and set no session cookie. Screen/state: Landing. Tag: `@F131`.
- [ ] **F132** (A17, A20) When someone joins the waitlist, the system shall add one row, show the confirmation and print a mail. Screen/state: Waitlist confirmation. Tag: `@F132`.
- [ ] **F133** (A17) If the email is already on the waitlist, then the system shall show the same confirmation and add no row. Screen/state: Waitlist confirmation. Tag: `@F133`.
- [ ] **F134** (A30) Landing, waitlist, Welcome and email headlines shall name the outcome, never a feature list. Screen/state: Landing, Emails. Tag: `@F134`.

#### Operator

- [ ] **F135** (A17) If a user without the operator platform role opens `/operator`, then the system shall answer 404. Screen/state: Operator shell and Waitlist. Tag: `@F135`.
- [ ] **F136** (A17, A20) When an operator invites selected waitlist rows, the system shall print one invitation each and mark the rows Invited. Screen/state: Operator shell and Waitlist. Tag: `@F136`.
- [ ] **F137** (A17) Operator Invitations shall resend or revoke an invitation. Screen/state: Operator: Invitations. Tag: `@F137`.
- [ ] **F138** (A17) Operator Organisations shall show organisations read-only and grant seats by hand. Screen/state: Operator: Organisations and one organisation. Tag: `@F138`.
- [ ] **F139** (A17) Operator Users shall show a person's organisations, roles, device count and last sign-in. Screen/state: Operator: Users and one user. Tag: `@F139`.
- [ ] **F140** (A17) Operator Feature Flags shall turn a flag on for everyone or per organisation. Screen/state: Operator: Feature Flags. Tag: `@F140`.
- [ ] **F141** (A17) Operator Usage shall show weekly active people, feedback created and full loops. Screen/state: Operator: Usage. Tag: `@F141`.
- [ ] **F142** (A17) Every operator action shall write an audit event. Screen/state: none. Tag: `@F142`.

<details>
<summary>Verification</summary>

- F131 — tag `@F131`: `snapmark-web/e2e/landing.spec.ts › landing has one form and no cookie`
- F132 — tag `@F132`: `snapmark-web/e2e/landing.spec.ts › join adds a row and prints a mail`
- F133 — tag `@F133`: `snapmark-web/e2e/landing.spec.ts › duplicate adds no row`
- F134 — manual: the owner reads the landing, Welcome and the three mails against A30.
- F135 — tag `@F135`: `snapmark-web/e2e/operator.spec.ts › non-operator gets 404`
- F136 — tag `@F136`: `snapmark-web/e2e/operator.spec.ts › invite selected rows`
- F137 — tag `@F137`: `snapmark-web/e2e/operator.spec.ts › resend and revoke`
- F138 — tag `@F138`: `snapmark-web/e2e/operator.spec.ts › grant seats by hand`
- F139 — tag `@F139`: `snapmark-web/e2e/operator.spec.ts › user lookup`
- F140 — tag `@F140`: `snapmark-web/e2e/operator.spec.ts › flag per organisation`
- F141 — tag `@F141`: `snapmark-web/e2e/operator.spec.ts › usage counts`
- F142 — tag `@F142`: `snapmark-web/test/server/audit.test.ts › operator actions audited`

</details>

### Milestone 7 — Two-way Mac sync

#### Sharing

- [ ] **F143** (A26) The Share to Workspace sheet shall name what leaves the Mac, the workspace and how many people see it. Screen/state: Share to Workspace sheet and sync status. Tag: `@F143`.
- [ ] **F144** (A26) When a person presses Share, the Mac app shall link the session folder to one online session. Screen/state: Share to Workspace sheet and sync status. Tag: `@F144`.
- [ ] **F145** (A26) Each numbered marker in a capture shall become one feedback; other shapes shall stay drawings. Screen/state: Sessions and Session view. Tag: `@F145`.
- [ ] **F146** (A26, A15) A Mac capture's anchor shall hold app name, window title, screen size, and the URL when the app is a browser. Screen/state: Feedback view, Details. Tag: `@F146`.
- [ ] **F147** (A26) The web Session view shall show the same screenshots and notes as the Mac session. Screen/state: Sessions and Session view. Tag: `@F147`.
- [ ] **F148** (A26) When a person confirms Stop Sharing, sync shall stop and the online copy shall stay. Screen/state: Share to Workspace sheet and sync status. Tag: `@F148`.

#### Sync engine

- [ ] **F149** (A26) The server shall be the source of truth, and every synced record shall carry a revision number. Screen/state: none. Tag: `@F149`.
- [ ] **F150** (A26) When the Mac app is back online, it shall replay its offline operation log in order, losing no change. Screen/state: none. Tag: `@F150`.
- [ ] **F151** (A26) While online, a change made on the web shall reach the Mac session within 5 seconds. Screen/state: none. Tag: `@F151`.
- [ ] **F152** (A26) If two edits hit the same field, then the last write shall win. Screen/state: none. Tag: `@F152`.
- [ ] **F153** (A26) The overwritten text shall be kept in the online thread as "Edited elsewhere". Screen/state: Feedback view, thread. Tag: `@F153`.
- [ ] **F154** (A26) The Mac editor shall show "Edited elsewhere. The other text is kept in the thread online." on that note. Screen/state: Share to Workspace sheet and sync status, Edited elsewhere. Tag: `@F154`.
- [ ] **F155** (A26) A delete shall sync as a tombstone kept 30 days, and undo shall restore it within that time. Screen/state: none. Tag: `@F155`.
- [ ] **F156** (A26) After 30 days, the system shall purge the tombstone and its record. Screen/state: none. Tag: `@F156`.
- [ ] **F157** (A26) After each sync, the Mac app shall rewrite `session.md` and the folder's files from the synced state. Screen/state: none. Tag: `@F157`.

#### Sync states

- [ ] **F158** (A26) The session footer shall read "Synced · {time}", "Syncing {n} Changes", "Offline · {n} Changes Waiting" or "Not Shared". Screen/state: Share to Workspace sheet and sync status. Tag: `@F158`.
- [ ] **F159** (A26, A28) If the device is signed out or revoked, then the footer shall say "Sync stopped" with Sign In…. Changes stay on the Mac. Screen/state: Share to Workspace sheet, sync stopped. Tag: `@F159`.
- [ ] **F160** (A26) If access to the workspace is lost, then the footer shall offer Share to Another Workspace… and Stop Sharing…. Screen/state: Share to Workspace sheet, sync stopped. Tag: `@F160`.
- [ ] **F161** (A26) If the server refuses for another reason, then the footer shall offer Try Again. Screen/state: Share to Workspace sheet, sync stopped. Tag: `@F161`.

<details>
<summary>Verification</summary>

- F143 — tag `@F143`: `snapmark-desktop/snapmark-app/test/smoke.ts › share sheet manifest line`
- F144 — tag `@F144`: `snapmark-desktop/snapmark-app/test/sync.test.ts › share links the folder`
- F145 — tag `@F145`: `snapmark-web/test/server/sync.test.ts › markers become feedback`
- F146 — tag `@F146`: `snapmark-kit/packages/annotations/test/anchor.test.ts › Mac anchor fields`
- F147 — tag `@F147`: `snapmark-web/e2e/session-view.spec.ts › same screenshots as the Mac`
- F148 — tag `@F148`: `snapmark-desktop/snapmark-app/test/sync.test.ts › stop sharing keeps the online copy`
- F149 — tag `@F149`: `snapmark-web/test/server/sync.test.ts › stale revision is rejected`
- F150 — tag `@F150`: `snapmark-desktop/snapmark-app/test/sync.test.ts › replay loses nothing`
- F151 — tag `@F151`: `snapmark-desktop/snapmark-app/test/sync.test.ts › web change arrives within 5 s`
- F152 — tag `@F152`: `snapmark-web/test/server/sync.test.ts › last write wins`
- F153 — tag `@F153`: `snapmark-web/test/server/sync.test.ts › overwritten text kept in thread`
- F154 — tag `@F154`: `snapmark-desktop/snapmark-app/test/smoke.ts › Edited elsewhere callout`
- F155 — tag `@F155`: `snapmark-web/test/server/sync.test.ts › tombstone syncs and undoes`
- F156 — tag `@F156`: `snapmark-web/test/server/retention.test.ts › tombstone purged after 30 days`
- F157 — tag `@F157`: `snapmark-desktop/snapmark-app/test/sync.test.ts › session.md rewritten`
- F158 — tag `@F158`: `snapmark-desktop/snapmark-app/test/smoke.ts › footer states`
- F159 — tag `@F159`: `snapmark-desktop/snapmark-app/test/sync.test.ts › revoked device stops sync`
- F160 — tag `@F160`: `snapmark-desktop/snapmark-app/test/sync.test.ts › lost access offers two ways on`
- F161 — tag `@F161`: `snapmark-desktop/snapmark-app/test/sync.test.ts › other refusal offers Try Again`

</details>

### Non-functional

- [ ] **N1** (A9, A10) If a component uses a raw colour, an arbitrary value or a visual inline style, then the tokens lint shall fail CI. Tag: `@N1`.
- [ ] **N2** (A10) If a component holds a literal UI string, then the i18n lint shall fail CI. Tag: `@N2`.
- [ ] **N3** (A10, A29) If `src/domain` imports I/O or `src/server` imports `src/app`, then dependency-cruiser shall fail CI. Tag: `@N3`.
- [ ] **N4** (A2) If an app imports another app instead of `snapmark-kit`, then dependency-cruiser shall fail CI. Tag: `@N4`.
- [ ] **N5** (A29) Every web and extension screen shall meet WCAG 2.2 AA, with full keyboard use. Tag: `@N5`.
- [ ] **N6** (A11) Text shall meet 4.5:1 and the focus ring 3:1 contrast, in light and dark. Tag: `@N6`.
- [ ] **N7** (A11) The web app shall follow the system's light or dark setting by default, from tokens. Tag: `@N7`.
- [ ] **N8** (A11) While the system asks for reduced motion, the web app and extension shall play no movement animation. Tag: `@N8`.
- [ ] **N9** (A11) An action shall show no progress under 400 ms and shall show progress from 1 second. Tag: `@N9`.
- [ ] **N10** (A11) On the seed data, API reads shall answer in under 300 ms at p95 on the owner's Mac. Tag: `@N10`.
- [ ] **N11** (A2) On the seed data, every MCP tool shall answer in under 500 ms at p95. Tag: `@N11`.
- [ ] **N12** (A18) Every web page shall fit 360 px and 1280 px wide without horizontal scroll. Tag: `@N12`.
- [ ] **N13** (A11) Live updates shall keep layout shift under 0.1. Tag: `@N13`.
- [ ] **N14** (A26) The Mac app's local workflow without an account and its bundle id `com.cdudek.snapmark` shall not change. Tag: `@N14`.
- [ ] **N15** (A19) No repo shall hold a secret; `.env.local` stays local. Tag: `@N15`.

<details>
<summary>Verification</summary>

- N1 — tag `@N1`: `snapmark-web/test/lint/tokens.test.ts › raw colour, arbitrary value, inline style fail` (also `snapmark-chrome`, `snapmark-kit`).
- N2 — tag `@N2`: `snapmark-web/test/lint/i18n.test.ts › literal string fails` (also `snapmark-chrome`).
- N3 — tag `@N3`: `snapmark-web/test/lint/boundaries.test.ts › domain and server rules`
- N4 — tag `@N4`: `snapmark-web/test/lint/boundaries.test.ts › apps import only snapmark-kit`
- N5 — manual: Claude walks every screen by keyboard only, and the owner spot-checks with VoiceOver.
- N6 — tag `@N6`: `snapmark-web/e2e/style.spec.ts › contrast light and dark`
- N7 — tag `@N7`: `snapmark-web/e2e/style.spec.ts › follows the system theme`
- N8 — tag `@N8`: `snapmark-web/e2e/style.spec.ts › reduced motion plays no movement`
- N9 — tag `@N9`: `snapmark-web/e2e/feedback-view.spec.ts › progress timing`
- N10 — tag `@N10`: `snapmark-web/test/perf/api.test.ts › reads under 300 ms p95`
- N11 — tag `@N11`: `snapmark-web/test/perf/mcp.test.ts › tools under 500 ms p95`
- N12 — tag `@N12`: `snapmark-web/e2e/responsive.spec.ts › no horizontal scroll at 360 and 1280`
- N13 — tag `@N13`: `snapmark-web/e2e/live.spec.ts › layout shift under 0.1`
- N14 — tag `@N14`: `snapmark-desktop/snapmark-app/test/smoke.ts › every v0.24.0 check still passes`
- N15 — manual: Claude runs a secret scan on each repo before each milestone PR.

</details>

## Verification

What proves the whole change, beyond the per-fact checks.

- **Automated:** in each repo, `npm run format && npm run lint && npm run typecheck && npm test` exits 0. `python3 scripts/verify_gate.py milestone 2026-10-27-online-release-1` ends `VERIFY PASS milestone` per milestone.
- **Core loop:** `snapmark-web/e2e/core-loop.spec.ts › capture, decide, implement through MCP, accept` runs the whole loop on the seed data.
- **Manual:** the owner dogfoods on his Mac in light and dark, at 100 % and 150 %. He tests J6 on his phone over the LAN address.

## Out of scope

- GitHub and Google sign-in and account linking (part of A7) — release 2, design 6; the Sign-In Methods slot stays (F27).
- Resend templates and key (part of A8 and A20) — release 2; the provider pattern ships now (F22).
- Deployment to Cloud Run and Cloud SQL (part of A19) — release 2; release 1 runs locally (F17).
- Chrome Web Store listing (part of A21) — release 2; the extension loads unpacked (F5).
- Billing, Slack, GitHub deployments, the dev plugin and the blog — release 2, per the brief's No-Gos.
- A23 — a process ask: parallel milestones are the plan's order of work, not a product behaviour.
- A25 — a process ask: which models build is the plan's builder choice, not a product behaviour.

## Open questions

None. The name and domain stay open in `intent.md`; "Snapmark" and `localhost` hold until then.
