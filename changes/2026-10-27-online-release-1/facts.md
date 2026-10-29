---
linear: none
type: facts
change: 2026-10-27-online-release-1
design: docs/designs/2026-10-27-snapmark-online.md
author: Claude (orchestrator)
status: approved
reviewed_by: null
approved_at: null
created: 2026-10-27
updated: 2026-10-28
---

# Facts: HeyDiff, release 1

## Goal

A team comments on exact elements of running UI in Chrome or on the Mac, and decides together in the web app. A coding agent picks the comment up through MCP, reports a revision with its commit, and a member resolves it. Staging and production run on Cloud Run in Belgium from milestone 1, production at www.heydiff.com (A72, A81, A84).

## Acceptance criteria

The system is HeyDiff: `heydiff-kit`, `heydiff-web`, `heydiff-chrome`, `heydiff-desktop` and the infrastructure in `heydiff-terraform`. Screens and states are named as in `spec/screens.md`; the model is `spec/ia.md`.

Tags: each fact's test carries `@F<n>` beside `@2026-10-27-online-release-1` in its title. A milestone's run selects its tests with `--grep @2026-10-27-online-release-1`. The spec in `spec/` follows each recommended default in `spec/owner-decisions.md`.

Words: "member" means owner, admin or member; "guest" means guest. "Agent" is the coding assistant acting through MCP, shown as "{person} via {client}". "Prints" means the `console` mail provider writes the mail to the terminal, in development only.

Numbering: a fact that survived the A59 journey keeps its number, reworded where the model changed. Retired numbers are listed under "Retired facts". New facts start at F172 and N16.

### Milestone 1 — Foundations

#### Repos and SDLC

- [ ] **F1** (A2, A6, A38, A39) The repos `heydiff-kit`, `heydiff-web` and `heydiff-chrome` shall exist, private, in the `pokbytes` organisation. Screen/state: none. Tag: `@F1`.
- [ ] **F2** (A10, A29) When a pull request opens in one of the three repos, CI shall run format check, lint, typecheck, unit and end-to-end tests. Screen/state: none. Tag: `@F2`.
- [ ] **F3** (A29) `heydiff-kit` and `heydiff-chrome` shall each hold a `CLAUDE.md` importing `heydiff-context`, `sdlc.json`, `docs/sdlc.md` and a Beads tracker. Screen/state: none. Tag: `@F3`.
- [ ] **F4** (A2, A9) `heydiff-kit` shall publish `contracts`, `annotations`, `redaction`, `tokens` and `ui` to GitHub Packages. Screen/state: none. Tag: `@F4`.
- [ ] **F5** (A6, A21) `heydiff-chrome` shall build an MV3 extension with WXT that loads unpacked in Chrome. Screen/state: none. Tag: `@F5`.

#### Tokens, buttons, motion and calm style

- [ ] **F6** (A9, A10, A36, A37) The `tokens` package shall turn `design-system-starter` and the Clear Sky overlay into CSS variables, Tailwind and HeroUI themes. The overlay holds every light and dark value of `spec/colour.md`. Screen/state: none. Tag: `@F6`.
- [ ] **F7** (A9, A24) Web and extension screens shall use HeroUI only through `heydiff-kit/ui` wrappers. Screen/state: every screen. Tag: `@F7`.
- [ ] **F8** (A11, A37) The accent `#0F72DB` shall fill at most one Filled button per region and colour nothing else. Logo blue `#2492FF` colours only the logo. Screen/state: every screen. Tag: `@F8`.
- [ ] **F9** (A11, A37) The focus ring shall show only on keyboard focus, in the neutral Clear Sky `focus` slate, never blue. Screen/state: every screen, after Tab. Tag: `@F9`.
- [ ] **F171** (A24, A29) In every button row of `heydiff-kit/ui`, the Filled button shall be last, at the right, and More (…) first. Screen/state: every screen with a button row. Tag: `@F171`.
- [ ] **F172** (A60) The `heydiff-kit/ui` Button shall offer five types: Filled, Tonal, Outlined, Text and Danger. Screen/state: every screen with a button. Tag: `@F172`.
- [ ] **F173** (A60) When a Button is hovered or pressed, it shall show a Material state layer and a ripple from the press point. The ripple is rebuilt in `heydiff-kit/ui`, with no Material UI or Vuetify import. Screen/state: every screen with a button, hover and pressed. Tag: `@F173`.
- [ ] **F174** (A61) Every animation shall take its duration and curve from the motion tokens of `spec/motion.md`, with no literal duration in code. Screen/state: every animated surface. Tag: `@F174`.
- [ ] **F175** (A51, A53) Until the owner supplies the logo, every logo slot shall show the rounded-square S placeholder from one `LogoMark` component. Screen/state: Landing placeholder, auth cards, Extension toolbar. Tag: `@F175`.

#### Text, glossary and lasting UX docs

- [ ] **F10** (A10) `heydiff-web` shall use next-intl with English as the default and only locale, under `/[locale]/…`. Screen/state: none. Tag: `@F10`.
- [ ] **F11** (A10, A30) `heydiff-web/messages/en.json` shall hold every string of `spec/microcopy.md` under its key. Screen/state: none. Tag: `@F11`.
- [ ] **F12** (A10, A32) `heydiff-web/docs/ux/glossary.md` shall define every product term, with Agent as the label and Copilot as an alias. Screen/state: none. Tag: `@F12`.
- [ ] **F13** (A10) If `en.json` uses a product word missing from `glossary.md`, then the glossary check shall fail. Screen/state: none. Tag: `@F13`.
- [ ] **F14** (A29) `heydiff-web/docs/ux/interaction-guidelines.md` shall hold the Mac rules that apply to the web plus the approved WEB rules. Screen/state: none. Tag: `@F14`.
- [ ] **F15** (A29) `heydiff-web/docs/ux/sitemap.md` and `sitemap.json` shall list every route of `spec/sitemap.md`. Screen/state: none. Tag: `@F15`.
- [ ] **F16** (A29) `heydiff-web/docs/ux/setup.md` shall name the product, audience, design rules, screens and how to run the app. Screen/state: none. Tag: `@F16`.

#### The app skeleton and the deploy contract

- [ ] **F176** (A63, A72) `heydiff-web` shall build with Next.js 16 `output: 'standalone'` and listen on `PORT`, 8080 by default. Screen/state: none. Tag: `@F176`.
- [ ] **F177** (A63, A76) `GET /healthz` shall answer 200 while the process runs. Screen/state: none. Tag: `@F177`.
- [ ] **F178** (A63, A76) While the database answers, `GET /readyz` shall return 200 with `{"status":"ready","sha":"<GIT_SHA>"}`. Screen/state: none. Tag: `@F178`.
- [ ] **F179** (A63, A76) If the database does not answer, then `GET /readyz` shall return 503. Screen/state: none. Tag: `@F179`.
- [ ] **F180** (A63) `scripts/migrate.ts` shall apply the Drizzle migrations in `./drizzle/migrations`, bundled by esbuild into the migrate image. Screen/state: none. Tag: `@F180`.
- [ ] **F181** (A72, A76) When a pull request merges to `main`, the pipeline shall deploy staging, then production, with no manual promotion. Screen/state: none. Tag: `@F181`.
- [ ] **F182** (A72, A76) When that deploy finishes, production's `/readyz` shall return the merged commit's sha. Screen/state: none. Tag: `@F182`.

#### Where it runs

- [ ] **F183** (A72, A81) Staging shall stay on its private `run.app` address, reachable only by CI and allowed Google accounts. Screen/state: none. Tag: `@F183`.
- [ ] **F184** (A73, A74, A75, A81) Every Cloud Run service and job, Cloud SQL instance and Artifact Registry repository shall sit in `europe-west1`. Screen/state: none. Tag: `@F184`.
- [ ] **F185** (A74, A75) Every Cloud Storage bucket and BigQuery dataset shall sit in the EU multi-region, including ones added later. Screen/state: none. Tag: `@F185`.
- [ ] **F188** (A65, A78, A79, A80, A81) `heydiff-terraform` shall map `heydiff.com` and `www.heydiff.com` to Cloud Run `heydiff-web` with Cloud Run domain mapping. Screen/state: none. Tag: `@F188`.
- [ ] **F189** (A78) `heydiff-terraform` shall output every DNS record the owner enters in Route53: the domain mapping records and the Resend sending records. Screen/state: none. Tag: `@F189`.
- [ ] **F190** (A65, A81, A84) When a page request arrives for `heydiff.com`, the web app shall answer 308 to the same path on `https://www.heydiff.com`. Screen/state: none. Tag: `@F190`.

#### Development, database and storage

- [ ] **F17** (A19, A82) When a developer has run `make dev-db`, `npm run dev` shall serve the web app on `127.0.0.1:3000` against their database. Screen/state: none. Tag: `@F17`.
- [ ] **F18** (A19) `npm run db:migrate` shall create every release-1 table of `tech-review.md` Data model, each with a UUIDv7 `id`. Screen/state: none. Tag: `@F18`.
- [ ] **F186** (A82) When `make dev-db` runs for a developer listed in `terraform/developers.json`, `npm run db:migrate` shall migrate `dev-<first-last>` without a password. Screen/state: none. Tag: `@F186`.
- [ ] **F19** (A19) `npm run db:seed` shall create one organisation, two workspaces, an owner, a member and a guest. It also creates comments in all five statuses, a decision and a session. Screen/state: none. Tag: `@F19`.
- [ ] **F20** (A19, A39) `heydiff-terraform` shall hold a private captures bucket and a separate dev bucket in the EU multi-region, in project `heydiff`. Screen/state: none. Tag: `@F20`.
- [ ] **F21** (A19) The storage service shall be an interface, a factory and a `gcs` provider that hands out signed URLs only. Screen/state: none. Tag: `@F21`.
- [ ] **F162** (A18, A72) In development, `next dev` shall listen on `127.0.0.1` only; the phone test uses staging. Screen/state: none. Tag: `@F162`.
- [ ] **F164** (A1) The system shall take each comment number from its workspace's counter, inside the insert transaction, so two sends never share a number. Screen/state: none. Tag: `@F164`.
- [ ] **F165** (A26, A52) The database shall keep sign-in sessions in Better Auth's `session` table and review sessions in `review_sessions`. Screen/state: none. Tag: `@F165`.

#### Sign-in and mail

- [ ] **F22** (A8) The mail service shall be an interface with a factory that picks the `console` or `resend` provider from settings. Screen/state: none. Tag: `@F22`.
- [ ] **F23** (A20) While the mail provider is `console`, the system shall print each mail's recipient, subject and link to the terminal. Screen/state: Emails. Tag: `@F23`.
- [ ] **F187** (A8, A20) While the mail provider is `resend`, the system shall send every mail from `noreply@heydiff.com`. Screen/state: Emails. Tag: `@F187`.
- [ ] **F24** (A7, A20) When a person submits an email on Sign In, the system shall send a sign-in link. Screen/state: Sign in, Check your email. Tag: `@F24`.
- [ ] **F25** (A7) When the person opens a valid link, the system shall sign them in and open their last organisation. Screen/state: Verify. Tag: `@F25`.
- [ ] **F26** (A7) If a link is reused or older than 15 minutes, then the system shall refuse it and offer a new one. Screen/state: Verify, expired. Tag: `@F26`.
- [ ] **F27** (A7) Account › Sign-In Methods shall list Email and keep a slot for GitHub and Google with no button. Screen/state: Account, Sign-In Methods. Tag: `@F27`.
- [ ] **F163** (A7, A17) If an email has no invitation, waitlist invitation or membership, then sign-in shall create no account and send the waitlist mail. Screen/state: Check your email, Emails. Tag: `@F163`.

<details>
<summary>Verification</summary>

- F1 — manual: the owner opens `github.com/pokbytes` and sees the three repos.
- F2 — tag `@F2`: `<repo>/test/ci/workflow.test.ts › CI runs every check on pull requests` (one per repo).
- F3 — tag `@F3`: `<repo>/test/repo/sdlc.test.ts › repo carries CLAUDE.md, sdlc.json, docs/sdlc.md, .beads` (kit and chrome).
- F4 — tag `@F4`: `heydiff-kit/test/packages.test.ts › every package publishes to GitHub Packages`
- F5 — tag `@F5`: `heydiff-chrome/e2e/load.spec.ts › unpacked build loads in Chrome`
- F6 — tag `@F6`: `heydiff-kit/packages/tokens/test/build.test.ts › emits CSS variables, Tailwind and HeroUI themes with every Clear Sky value`
- F7 — tag `@F7`: `heydiff-web/test/lint/heroui-imports.test.ts › no direct @heroui import outside heydiff-kit/ui`
- F8 — tag `@F8`: `heydiff-web/e2e/style.spec.ts › one #0F72DB Filled button per region, no other blue`
- F9 — tag `@F9`: `heydiff-web/e2e/style.spec.ts › focus ring on keyboard focus only, in the focus colour`
- F171 — tag `@F171`: `heydiff-kit/packages/ui/test/button-group.test.tsx › Filled last, More first`
- F172 — tag `@F172`: `heydiff-kit/packages/ui/test/button.test.tsx › five types render with their tokens`
- F173 — tag `@F173`: `heydiff-kit/packages/ui/test/ripple.test.tsx › state layer on hover and press, ripple from the press point`
- F174 — tag `@F174`: `heydiff-kit/test/lint/motion.test.ts › a literal duration or curve fails`
- F175 — tag `@F175`: `heydiff-web/e2e/style.spec.ts › every logo slot renders LogoMark`
- F10 — tag `@F10`: `heydiff-web/e2e/i18n.spec.ts › every route lives under /en`
- F11 — tag `@F11`: `heydiff-web/test/i18n/microcopy.test.ts › every microcopy key exists in en.json`
- F12 — tag `@F12`: `heydiff-web/test/docs/glossary.test.ts › glossary holds every term and the Agent alias`
- F13 — tag `@F13`: `heydiff-web/test/docs/glossary.test.ts › unknown product word fails the check`
- F14 — manual: the owner reads `interaction-guidelines.md` against `spec/interaction.md` at the milestone 1 PR.
- F15 — tag `@F15`: `heydiff-web/test/docs/sitemap.test.ts › sitemap.json matches the app routes`
- F16 — manual: the owner reads `setup.md` and starts the app from it.
- F176 — tag `@F176`: `heydiff-web/test/deploy/contract.test.ts › standalone output, listens on PORT`
- F177 — tag `@F177`: `heydiff-web/test/deploy/contract.test.ts › healthz answers 200`
- F178 — tag `@F178`: `heydiff-web/test/deploy/contract.test.ts › readyz returns ready and the sha`
- F179 — tag `@F179`: `heydiff-web/test/deploy/contract.test.ts › readyz returns 503 without a database`
- F180 — tag `@F180`: `heydiff-web/test/deploy/migrate.test.ts › migrate script applies the migrations folder`
- F181 — tag `@F181`: `heydiff-web/test/ci/deploy-workflow.test.ts › merge to main deploys staging, then production`
- F182 — manual: after the milestone 1 merge, Claude reads production `/readyz` and compares the sha with `main`.
- F183 — tag `@F183`: `heydiff-terraform/policy/terraform/iam_test.rego › staging has no public invoker`
- F184 — tag `@F184`: `heydiff-terraform/policy/terraform/locations_test.rego › compute only in europe-west1`
- F185 — tag `@F185`: `heydiff-terraform/policy/terraform/locations_test.rego › buckets and datasets only in EU`
- F188 — tag `@F188`: `heydiff-terraform/policy/terraform/domain_test.rego › both hosts map to heydiff-web`
- F189 — tag `@F189`: `heydiff-terraform` `terraform plan` output lists `route53_records` with every host and the Resend records.
- F190 — tag `@F190`: `heydiff-web/test/server/proxy.test.ts › www redirects to the apex with 308`
- F17 — tag `@F17`: `heydiff-web/e2e/smoke.spec.ts › app answers on 127.0.0.1:3000`
- F18 — tag `@F18`: `heydiff-web/test/db/migrate.test.ts › migrations create the release-1 tables`
- F186 — manual: each developer runs `make dev-db` once; Claude reads the table list of `dev-calvin-dudek`.
- F19 — tag `@F19`: `heydiff-web/test/db/seed.test.ts › seed covers every role and status`
- F20 — tag `@F20`: `heydiff-terraform/policy/terraform/buckets_test.rego › captures and dev buckets private, EU`
- F21 — tag `@F21`: `heydiff-web/test/server/storage.test.ts › factory returns gcs; reads are signed URLs`
- F162 — tag `@F162`: `heydiff-web/test/infra/bind.test.ts › dev server binds to 127.0.0.1`
- F164 — tag `@F164`: `heydiff-web/test/db/numbering.test.ts › parallel inserts get distinct numbers`
- F165 — tag `@F165`: `heydiff-web/test/db/migrate.test.ts › session and review_sessions are separate tables`
- F22 — tag `@F22`: `heydiff-web/test/server/mail.test.ts › factory picks console or resend`
- F23 — tag `@F23`: `heydiff-web/test/server/mail.test.ts › console prints recipient, subject and link`
- F187 — tag `@F187`: `heydiff-web/test/server/mail.test.ts › resend sends from noreply@heydiff.com`
- F24 — tag `@F24`: `heydiff-web/e2e/sign-in.spec.ts › submitting an email sends a link`
- F25 — tag `@F25`: `heydiff-web/e2e/sign-in.spec.ts › link signs in and opens the last organisation`
- F26 — tag `@F26`: `heydiff-web/e2e/sign-in.spec.ts › used or expired link is refused`
- F27 — tag `@F27`: `heydiff-web/e2e/account.spec.ts › sign-in methods list email, slot for later`
- F163 — tag `@F163`: `heydiff-web/e2e/sign-in.spec.ts › uninvited email gets no account and the waitlist mail`

</details>

### Milestone 2 — Web app

#### Organisations, members and invitations

- [ ] **F28** (A17, A30) When a person with an unused waitlist invitation signs in, the system shall open Welcome. Screen/state: Welcome. Tag: `@F28`.
- [ ] **F29** (A17) When they name the organisation and first workspace on Welcome, the system shall create both and open that workspace. Screen/state: Welcome. Tag: `@F29`.
- [ ] **F30** (A20) When an admin invites an email with a role, the system shall send the invitation mail. Screen/state: Organisation settings, Members. Tag: `@F30`.
- [ ] **F31** (A17) If the role needs a seat and no seat is free, then Send shall be disabled with the seat count. Screen/state: Organisation settings, Members. Tag: `@F31`.
- [ ] **F32** (A7) When an invitee accepts at `/invite/[token]`, the system shall add them with the invited role. Screen/state: Invitation. Tag: `@F32`.
- [ ] **F33** (A31) While a person is a guest, the system shall show only the workspaces they are invited to. Screen/state: App shell. Tag: `@F33`.
- [ ] **F192** (A17) While a new organisation has no comment, owners and admins shall see the three-step checklist on the empty Comments page. Screen/state: Comments, empty. Tag: `@F192`.

#### Workspace setup

- [ ] **F34** (A16) Workspace Settings › Environments shall store a kind (Local, Preview, Staging, Production), a name and address patterns. Screen/state: Workspace settings, Environments. Tag: `@F34`.
- [ ] **F35** (A16) When a comment's address matches a pattern, the system shall stamp that environment, so `omr.ninja` reads Staging. Screen/state: Comment, Context panel. Tag: `@F35`.
- [ ] **F36** (A5, A15) When a comment's path matches a route rule, the system shall stamp that rule's repo. Screen/state: Workspace settings, Route Rules. Tag: `@F36`.
- [ ] **F37** (A13) Workspace Settings › Modules shall add, rename and delete a workspace's modules. Screen/state: Workspace settings, Modules. Tag: `@F37`.

#### Navigation

- [ ] **F38** (A27) Every app page shall show one left sidebar: workspace switcher, Search, Inbox, My Work, Comments, Decisions, Revisions, Sessions and Settings. Screen/state: App shell. Tag: `@F38`.
- [ ] **F39** (A29) Every filter, tab and chosen revision shall live in the URL, so reload and Back show the same view. Screen/state: Comments, Comment. Tag: `@F39`.
- [ ] **F40** (A29) When a person presses ⌘K on any app page, the system shall open the command menu. Screen/state: App shell, command menu. Tag: `@F40`.

#### Comments and the Comment page

- [ ] **F193** (A43, A44) The Comments list shall group comments by page, each row with its screenshot, status and first lines. Screen/state: Comments. Tag: `@F193`.
- [ ] **F194** (A43, A52) The Comments filter bar shall filter by environment, branch, commit, status, people, session, module and page. Screen/state: Comments. Tag: `@F194`.
- [ ] **F42** (A1) Each comment shall get the next number in its workspace, at `/<org>/<workspace>/comments/<n>`. Screen/state: Comment. Tag: `@F42`.
- [ ] **F195** (A42) A comment shall have no title; lists show its first lines. Screen/state: Comments, Comment. Tag: `@F195`.
- [ ] **F196** (A44, A47, A59) The Comment page shall show the screenshot with the coral selection and the drawing, the Context panel and the thread. Screen/state: Comment. Tag: `@F196`.
- [ ] **F44** (A13, A15, A22, A48) The Context panel shall list component, `file:line`, page, selector, DOM path, region, module, repo, commit, environment and device. Screen/state: Comment, Context panel. Tag: `@F44`.
- [ ] **F197** (A43) A comment shall stay on the commit it was made on and never move to a later commit. Screen/state: Comment, Context panel. Tag: `@F197`.
- [ ] **F198** (A43) When a comment was made on uncommitted changes, the Context panel shall show the "Uncommitted changes" flag. Screen/state: Comment, Context panel. Tag: `@F198`.
- [ ] **F199** (A44) When someone sends a reply, the system shall add it to the end of the comment's thread. Screen/state: Comment, thread. Tag: `@F199`.
- [ ] **F45** (A4, A46) When a member or guest draws on a reply, the system shall store the marks as vector data on that reply. Screen/state: Comment, Reply field. Tag: `@F45`.
- [ ] **F200** (A54) While a comment has moves, the Comment page shall show Before and After and one row per change. Screen/state: Comment, Before / After. Tag: `@F200`.
- [ ] **F50** (A28, A31) Every entry a guest wrote shall carry a Guest chip in the web app, phone view, Session page and emails. Screen/state: Comment, thread. Tag: `@F50`.
- [ ] **F51** (A14, A32) An entry an agent wrote shall read "{person} via {client}", with the agent ring and the Agent chip. Screen/state: Comment, thread. Tag: `@F51`.

#### Status, resolve and reopen

- [ ] **F56** (A3, A44) The status shall move only along the transitions of `spec/ia.md` Comment status, between Open, Deciding, In Progress, Revised and Resolved. Screen/state: Comment. Tag: `@F56`.
- [ ] **F201** (A3, A44) When a member presses Resolve, the system shall set the comment to Resolved. Screen/state: Comment, header. Tag: `@F201`.
- [ ] **F202** (A44) When a member presses Reopen on a Resolved comment, the system shall set it to Open. Screen/state: Comment, header. Tag: `@F202`.
- [ ] **F203** (A70) When a member or guest replies to a Revised comment, the system shall set it back to Open. The reply box says so before sending. Screen/state: Comment, Reply field. Tag: `@F203`.
- [ ] **F60** (A31) While the viewer is a guest, Start a Decision, Decide, Resolve, Reopen and Change Status shall be disabled with the reason. Reply, Draw and Vote stay. Screen/state: Comment, guest. Tag: `@F60`.
- [ ] **F61** (A33) When a member picks a status in Change Status, the system shall change the chip and add a thread line. Screen/state: Comment, More menu. Tag: `@F61`.
- [ ] **F62** (A33) When a member changes the status to Revised by hand, the system shall add a revision "marked by {name}". Screen/state: Comment, More menu. Tag: `@F62`.
- [ ] **F64** (A3) Every change of status, decision, vote, revision or session shall write one append-only `audit_events` row. Screen/state: none. Tag: `@F64`.

#### Decisions

- [ ] **F204** (A12, A44) When a member presses Start a Decision on an Open comment, the dialog shall take options and named voters. Screen/state: Start a Decision dialog. Tag: `@F204`.
- [ ] **F205** (A12, A44) Each option shall be an uploaded mockup, a Figma link or a text option, lettered A, B, C in order. Screen/state: Start a Decision dialog, Decision. Tag: `@F205`.
- [ ] **F206** (A12, A14) While a decision is open, each voter shall hold one vote, changeable until the decision closes. Screen/state: Decision. Tag: `@F206`.
- [ ] **F207** (A12, A14) When someone comments on an option, the system shall show the comment under that option. Screen/state: Decision. Tag: `@F207`.
- [ ] **F53** (A12, A14) The Decision page shall show the vote tally per option. Screen/state: Decision. Tag: `@F53`.
- [ ] **F208** (A12, A44) When a member presses Decide on an option, the comment shall return to Open with the Decided card. Undo stays for 8 seconds. Screen/state: Comment, Decided card. Tag: `@F208`.
- [ ] **F209** (A12) While a decision is open, Resolve shall be disabled with the reason "Decide or cancel the decision first." Screen/state: Comment, Deciding. Tag: `@F209`.
- [ ] **F210** (A12) The Decisions page shall list every decision of the workspace, Deciding first. Screen/state: Decisions. Tag: `@F210`.

#### Revisions

- [ ] **F211** (A3, A44) When a revision is reported, the comment shall show "Revision {n} · {commit}" with Before and After. Screen/state: Comment, revision entry. Tag: `@F211`.
- [ ] **F212** (A44) The Revisions page shall list reported revisions newest first, each opening its comment at that revision. Screen/state: Revisions. Tag: `@F212`.

#### Sessions

- [ ] **F213** (A52) The Sessions page shall list every session of the workspace with its person, comment count and state. Screen/state: Sessions. Tag: `@F213`.
- [ ] **F214** (A52) The Session page shall show the session's comments across pages, grouped by page. Screen/state: Session. Tag: `@F214`.
- [ ] **F215** (A52) Share Session shall offer Copy Link, Copy Agent Prompt and sharing by email with people in the workspace. Screen/state: Share Session dialog. Tag: `@F215`.
- [ ] **F216** (A52) Sharing a session shall never change who can see its comments. Screen/state: Share Session dialog. Tag: `@F216`.

#### Inbox, My Work and live updates

- [ ] **F65** (A3, A12, A52) Inbox shall list the votes asked of you, revisions, mentions, replies and shared sessions, across workspaces. Screen/state: Inbox. Tag: `@F65`.
- [ ] **F217** (A44, A70) When a revision is reported, the author and everyone in the thread, guests included, shall get an Inbox item. Screen/state: Inbox. Tag: `@F217`.
- [ ] **F67** (A20) When an Inbox item is created, the system shall send its mail after the 8-second Undo window. An undone action sends nothing. Screen/state: Emails. Tag: `@F67`.
- [ ] **F68** (A3, A14) My Work shall list your comments and the comments your agent claimed. Screen/state: My Work. Tag: `@F68`.
- [ ] **F69** (A3) When another person changes a comment, its page shall show the change within 2 seconds without a reload. Screen/state: Comment. Tag: `@F69`.
- [ ] **F70** (A11) If the browser goes offline, then the system shall show a banner, block writes and keep drafts. Screen/state: App shell, offline. Tag: `@F70`.

#### Phone

- [ ] **F71** (A18) On a phone, the reply field and the Resolve or Vote action shall stay on screen while the thread scrolls. Screen/state: Phone Comment, Phone Decision. Tag: `@F71`.
- [ ] **F72** (A18) On a phone, Inbox, then the item, then Resolve shall take three taps. Screen/state: Phone Inbox, Phone Comment. Tag: `@F72`.
- [ ] **F73** (A18) On a phone, settings, drawing and the operator area shall show the desktop-only message. Screen/state: Desktop-only message. Tag: `@F73`.

#### Access and safe text

- [ ] **F166** (A2, A31) Routes, server actions and streams shall answer 403 or 404 to an outsider, a guest or another organisation's member without access. Screen/state: none. Tag: `@F166`.
- [ ] **F167** (A4, A31) The web app shall render people's text, names and marks as escaped text or the Markdown subset, never as raw HTML. Screen/state: Comment, thread. Tag: `@F167`.

<details>
<summary>Verification</summary>

- F28, F29 — tags `@F28`, `@F29`: `heydiff-web/e2e/welcome.spec.ts › waitlist invitation opens Welcome; Welcome creates organisation and workspace`
- F30, F31 — tags `@F30`, `@F31`: `heydiff-web/e2e/members.spec.ts › invite sends the mail; no free seat disables Send`
- F32 — tag `@F32`: `heydiff-web/e2e/invitation.spec.ts › accept adds the invited role`
- F33 — tag `@F33`: `heydiff-web/e2e/guest.spec.ts › guest sees invited workspaces only`
- F192 — tag `@F192`: `heydiff-web/e2e/welcome.spec.ts › empty Comments shows the checklist to owners and admins`
- F34, F37 — tags `@F34`, `@F37`: `heydiff-web/e2e/workspace-settings.spec.ts › environments and modules save`
- F35 — tag `@F35`: `heydiff-web/test/domain/environment.test.ts › omr.ninja resolves to Staging`
- F36 — tag `@F36`: `heydiff-web/test/domain/route-rules.test.ts › path resolves to the rule's repo`
- F38, F40 — tags `@F38`, `@F40`: `heydiff-web/e2e/app-shell.spec.ts › sidebar order; ⌘K opens the command menu`
- F39 — tag `@F39`: `heydiff-web/e2e/url-state.spec.ts › reload and Back keep filters, tab and revision`
- F193, F194, F195 — tags `@F193`, `@F194`, `@F195`: `heydiff-web/e2e/comments.spec.ts › grouped by page; every filter; no title`
- F42 — tag `@F42`: `heydiff-web/test/domain/numbering.test.ts › numbers count per workspace`
- F196, F44 — tags `@F196`, `@F44`: `heydiff-web/e2e/comment.spec.ts › canvas, Context panel, thread; context rows`
- F197, F198 — tags `@F197`, `@F198`: `heydiff-web/test/domain/commit.test.ts › comment keeps its commit; uncommitted flag shows`
- F199, F45 — tags `@F199`, `@F45`: `heydiff-web/e2e/comment.spec.ts › reply appends; reply drawing stores vector marks`
- F200 — tag `@F200`: `heydiff-web/e2e/comment.spec.ts › moves show Before, After and the change rows`
- F50, F60 — tags `@F50`, `@F60`: `heydiff-web/e2e/guest.spec.ts › Guest chip everywhere; member actions disabled with reason`
- F51 — tag `@F51`: `heydiff-web/e2e/comment.spec.ts › agent entry reads person via client`
- F56 — tag `@F56`: `heydiff-web/test/domain/status.test.ts › only the ia.md transitions`
- F201, F202, F203 — tags `@F201`, `@F202`, `@F203`: `heydiff-web/e2e/status.spec.ts › resolve; reopen; a reply reopens Revised`
- F61, F62 — tags `@F61`, `@F62`: `heydiff-web/e2e/manual-status.spec.ts › Change Status adds a thread line; Revised by hand adds a marked revision`
- F64 — tag `@F64`: `heydiff-web/test/server/audit.test.ts › every change writes one row`
- F204 to F210, F53 — tags `@F204` to `@F210`, `@F53`: `heydiff-web/e2e/decision.spec.ts › start, options, vote, option comments, tally, decide with Undo, Resolve blocked, list`
- F211, F212 — tags `@F211`, `@F212`: `heydiff-web/e2e/revisions.spec.ts › revision entry with Before and After; Revisions list`
- F213 to F216 — tags `@F213` to `@F216`: `heydiff-web/e2e/sessions.spec.ts › list, session view, share options, visibility unchanged`
- F65, F217 — tags `@F65`, `@F217`: `heydiff-web/e2e/inbox.spec.ts › Inbox kinds; revision reaches author and thread incl. guests`
- F67 — tag `@F67`: `heydiff-web/test/server/notify.test.ts › mail waits out Undo; undone sends nothing`
- F68 — tag `@F68`: `heydiff-web/e2e/my-work.spec.ts › mine and claimed`
- F69 — tag `@F69`: `heydiff-web/e2e/live.spec.ts › change shows within 2 s`
- F70 — tag `@F70`: `heydiff-web/e2e/offline.spec.ts › banner, blocked writes, kept draft`
- F71, F72, F73 — tags `@F71`, `@F72`, `@F73`: `heydiff-web/e2e/phone.spec.ts › action bar stays; resolve in three taps; desktop-only message`
- F166 — tag `@F166`: `heydiff-web/test/server/access-matrix.test.ts › every route, action and stream refuses outsider, guest and other organisation`
- F167 — tag `@F167`: `heydiff-web/e2e/xss.spec.ts › script and HTML in guest text render as text`

</details>

### Milestone 3 — Extension

#### Popup, sign-in and toolbar

- [ ] **F74** (A6) While signed out, the popup shall offer Sign In and no Comment control. Screen/state: Extension popup, signed out. Tag: `@F74`.
- [ ] **F75** (A6, A28) When a person presses Sign In, the extension shall sign in through the browser with OAuth and PKCE. Screen/state: App consent. Tag: `@F75`.
- [ ] **F76** (A16) The popup shall show "{host} · {environment}" from the workspace's address patterns. Screen/state: Extension popup. Tag: `@F76`.
- [ ] **F78** (A28) If the token is revoked, then the extension shall say the person was signed out, keep the draft and offer Sign In. Screen/state: Extension popup, signed out. Tag: `@F78`.
- [ ] **F218** (A43) The toolbar shall show the page's workspace, environment, branch and commit, or "Unknown" for each it cannot read. Screen/state: Extension toolbar. Tag: `@F218`.
- [ ] **F219** (A15, A43, A50) When a comment is sent, it shall record URL, environment, repo, branch, commit, Uncommitted changes, device, browser and viewport. Screen/state: none. Tag: `@F219`.
- [ ] **F220** (A71) When a person presses `C` or Comment, the extension shall start a new comment in pick mode. An open draft is parked first. Screen/state: Extension toolbar, Pick mode. Tag: `@F220`.
- [ ] **F168** (A6, A28) The extension shall keep its token in the background script, use `activeTab`, and render the composer in a `chrome-extension://` frame. Screen/state: Composer. Tag: `@F168`.

#### Pick mode and anchors

- [ ] **F79** (A47, A48) While picking, the hovered element shall get a coral `#E5484D` outline and a card with tag, size, component and `file:line`. Screen/state: Pick mode. Tag: `@F79`.
- [ ] **F221** (A57) When a person Shift-clicks an element in pick mode, the extension shall add it to the selection, or remove it. Screen/state: Pick mode, several elements. Tag: `@F221`.
- [ ] **F222** (A57) A comment on several elements shall hold one anchor per element and one screenshot covering them all. Screen/state: Composer. Tag: `@F222`.
- [ ] **F223** (A57) While pick mode is on, clicks and Shift-clicks shall never reach the page. Screen/state: Pick mode. Tag: `@F223`.
- [ ] **F80** (A13, A47) Each anchor shall hold URL, selector, DOM path, tag, size, text, box, viewport, landmark region and parent chain. Screen/state: none. Tag: `@F80`.
- [ ] **F81** (A13) When the element sits inside a `data-heydiff-module` attribute, the anchor shall carry that module. Screen/state: Pick mode. Tag: `@F81`.
- [ ] **F82** (A22) On a React or Next dev build, the anchor shall carry the component name and `file:line` from fibers, `_debugStack` and source maps. Screen/state: Pick mode. Tag: `@F82`.
- [ ] **F83** (A22) On a Vue or Nuxt dev build, the anchor shall carry the component name and its `__file`. Screen/state: Pick mode. Tag: `@F83`.
- [ ] **F84** (A22, A48) If no framework data is found, then the card shall show selector, DOM path, region, module and "No source location". Screen/state: Pick mode, Composer. Tag: `@F84`.

#### Composer, drafts and send

- [ ] **F224** (A42) The composer shall ask for text only, with optional Draw, Move and @mention, and no title. Screen/state: Composer. Tag: `@F224`.
- [ ] **F225** (A71) When a person presses Esc in the composer, the extension shall park the draft as a draft pin only its author sees. Screen/state: Composer, draft pin. Tag: `@F225`.
- [ ] **F90** (A1) Drafts shall survive a reload, a closed tab and a Chrome restart, kept per workspace and page address. Screen/state: Composer, Extension popup. Tag: `@F90`.
- [ ] **F87** (A1) When a person sends, the extension shall upload the screenshot as WebP with a 400 px thumbnail and create the comment. Screen/state: Sent confirmation. Tag: `@F87`.
- [ ] **F88** (A1) When the send succeeds, the comment shall appear in the workspace's Comments within 2 seconds. Screen/state: Comments. Tag: `@F88`.
- [ ] **F226** (A41) When a comment is sent, its pin shall appear on the first anchor as a bubble with the author's avatar. Screen/state: Sent confirmation, Pin. Tag: `@F226`.

#### Drawing, move and align

- [ ] **F85** (A4, A46) The drawing toolbar shall offer the Mac editor's tools, names and keys, saved as vector marks with the comment. Screen/state: Drawing. Tag: `@F85`.
- [ ] **F227** (A54) While Move is on, a person shall drag an element inside its parent, align it, or change its spacing or width. Screen/state: Arranging. Tag: `@F227`.
- [ ] **F228** (A54) Each move shall join the comment's change list as selector, action, target and values. Screen/state: Arranging, Composer. Tag: `@F228`.
- [ ] **F229** (A54) Moves shall apply only in the reviewer's browser; a reload or Reset shall restore the page. Screen/state: Arranging. Tag: `@F229`.

#### What shows on the page

- [ ] **F230** (A43, A55) The visibility menu shall offer Everyone, Only Mine, Hide Others, Not Resolved and Resolved. Its button is an eye, never a funnel. Screen/state: Visibility menu. Tag: `@F230`.
- [ ] **F231** (A55) While a choice other than the default hides comments, the eye shall show a neutral dot with the number hidden. Screen/state: Extension toolbar. Tag: `@F231`.
- [ ] **F232** (A43) Pins of earlier commits shall stay hidden until Show Earlier Commits is on. Screen/state: Visibility menu. Tag: `@F232`.
- [ ] **F233** (A43) If a comment's element is gone from the page, then the side panel shall list it under Outdated, with no pin. Screen/state: Side panel, This Page. Tag: `@F233`.
- [ ] **F234** (A44) When a revision reports this page's commit, the pin shall carry a "Rev {n}" badge. Screen/state: Pin. Tag: `@F234`.
- [ ] **F235** (A1, A44) When a person clicks a pin, the popover shall show the thread and offer Reply, plus Resolve to members. Screen/state: Pin popover. Tag: `@F235`.

#### Devices

- [ ] **F236** (A50) The device picker shall offer Responsive, MacBook Air 13", MacBook Pro 14" and 16", iPad Air, iPhone 16, iPhone 16 Pro Max, Custom. Screen/state: Device picker. Tag: `@F236`.
- [ ] **F237** (A50) When a MacBook or Custom size is picked, the extension shall resize the window so the page area matches. Screen/state: Device picker. Tag: `@F237`.
- [ ] **F238** (A50) When an iPad or iPhone is picked, the extension shall emulate it through `chrome.debugger`, with Chrome's debugging banner. Screen/state: Device picker. Tag: `@F238`.

#### Sessions and side panel

- [ ] **F239** (A52) When a person presses Start Session, their next comments in that workspace shall join the session until it ends. Screen/state: Session bar. Tag: `@F239`.
- [ ] **F240** (A52) When a person ends a session with drafts on the page, the extension shall ask to send or discard them. Screen/state: End Session dialog. Tag: `@F240`.
- [ ] **F241** (A47, A48) The side panel's This Page tab shall list this page's comments, each with its component and `file:line`. Screen/state: Side panel, This Page. Tag: `@F241`.
- [ ] **F242** (A18, A43) The side panel's Inbox tab shall list the same items as the web Inbox. Screen/state: Side panel, Inbox. Tag: `@F242`.

#### Localhost bridge, extension side

- [ ] **F91** (A5) While on localhost and the Mac app answers, the popup shall show "From your Mac: {repo} · {branch} · {worktree}". Screen/state: Extension popup, bridge connected. Tag: `@F91`.
- [ ] **F92** (A5) If the Mac app does not answer, then the popup shall say the Mac app isn't running. Screen/state: Extension popup, bridge not running. Tag: `@F92`.
- [ ] **F93** (A5) If the bridge is off, then the popup shall say where to turn it on. Screen/state: Extension popup, bridge off. Tag: `@F93`.
- [ ] **F94** (A5) If the Mac app found no repo for the host, then the popup shall say so and name Docker as a cause. Screen/state: Extension popup, bridge no repo. Tag: `@F94`.
- [ ] **F95** (A5, A15) When the bridge answers, the comment's context shall carry its repo, branch, worktree and commit. Screen/state: Comment, Context panel. Tag: `@F95`.

<details>
<summary>Verification</summary>

- F74, F76, F78 — tags `@F74`, `@F76`, `@F78`: `heydiff-chrome/e2e/popup.spec.ts › signed out; environment line; revoked token`
- F75 — tag `@F75`: `heydiff-chrome/e2e/popup.spec.ts › sign-in through the browser`
- F218, F220 — tags `@F218`, `@F220`: `heydiff-chrome/e2e/toolbar.spec.ts › context line; C starts a new comment and parks the draft`
- F219 — tag `@F219`: `heydiff-chrome/e2e/compose.spec.ts › sent comment records its context`
- F168 — tag `@F168`: `heydiff-chrome/test/manifest.test.ts › token in background only, activeTab, composer in extension frame`
- F79, F221, F223 — tags `@F79`, `@F221`, `@F223`: `heydiff-chrome/e2e/picker.spec.ts › outline and card; Shift-click adds and removes; page gets no click`
- F222 — tag `@F222`: `heydiff-chrome/e2e/compose.spec.ts › several elements, one screenshot`
- F80 — tag `@F80`: `heydiff-kit/packages/annotations/test/anchor.test.ts › anchor fields`
- F81 — tag `@F81`: `heydiff-chrome/e2e/picker.spec.ts › module attribute`
- F82, F83, F84 — tags `@F82`, `@F83`, `@F84`: `heydiff-chrome/e2e/code-location.spec.ts › next fixture; nuxt fixture; plain page says No source location`
- F224, F225, F90 — tags `@F224`, `@F225`, `@F90`: `heydiff-chrome/e2e/compose.spec.ts › text only; Esc parks a draft pin; draft survives restart`
- F87, F88, F226 — tags `@F87`, `@F88`, `@F226`: `heydiff-chrome/e2e/compose.spec.ts › WebP and thumbnail; in Comments within 2 s; avatar pin appears`
- F85 — tag `@F85`: `heydiff-chrome/e2e/drawing.spec.ts › Mac tools and keys store vector marks`
- F227, F228, F229 — tags `@F227` to `@F229`: `heydiff-chrome/e2e/arrange.spec.ts › drag and align; change list rows; reload restores`
- F230 to F235 — tags `@F230` to `@F235`: `heydiff-chrome/e2e/visibility.spec.ts › eye menu; count dot; earlier commits; Outdated; Rev badge; pin popover`
- F236, F237, F238 — tags `@F236` to `@F238`: `heydiff-chrome/e2e/devices.spec.ts › presets; window resize; debugger emulation`
- F239, F240 — tags `@F239`, `@F240`: `heydiff-chrome/e2e/sessions.spec.ts › comments join the session; End Session asks about drafts`
- F241, F242 — tags `@F241`, `@F242`: `heydiff-chrome/e2e/side-panel.spec.ts › This Page with code location; Inbox matches the web`
- F91 to F95 — tags `@F91` to `@F95`: `heydiff-chrome/e2e/bridge.spec.ts › connected, not running, off, no repo, context carries repo and branch (stub host)`

</details>

### Milestone 4 — MCP server

#### Connected apps and scopes

- [ ] **F96** (A2) The MCP endpoint at `/mcp` shall follow the MCP authorisation spec, with browser sign-in through OAuth and PKCE. Screen/state: App consent. Tag: `@F96`.
- [ ] **F97** (A28, A34) The consent page shall show the read line, the switches Reply in Threads and Report Revisions off, and equal Allow and Deny. Screen/state: App consent. Tag: `@F97`.
- [ ] **F98** (A28, A34) A new agent token shall be read-only until the person turns a scope on. `claim`, `unclaim` and `report_revision` need Report Revisions; `reply` needs Reply in Threads. Screen/state: App consent. Tag: `@F98`.
- [ ] **F99** (A28, A34) If a token without the scope calls `claim`, `unclaim`, `reply` or `report_revision`, then the server shall refuse and name the scope. Screen/state: none. Tag: `@F99`.
- [ ] **F100** (A28) Account › Connected Apps shall list each app with its kind, scopes and last use. Screen/state: Account, Connected Apps. Tag: `@F100`.
- [ ] **F101** (A18, A28) When a person revokes an app, its next call shall be refused, on a phone too. Screen/state: Account, Connected Apps. Tag: `@F101`.
- [ ] **F102** (A2, A34) Connect an Agent shall show the MCP address, the command to add it and the scopes it needs. Screen/state: Connect an Agent dialog. Tag: `@F102`.
- [ ] **F170** (A18, A28) Every `/api/v1` and `/mcp` call shall check the app's row, so a revoke or scope change applies to the next call. Screen/state: Account, Connected Apps. Tag: `@F170`.

#### Tools

- [ ] **F103** (A2, A28, A52) The server shall offer exactly eight tools: `list_workspaces`, `list_comments`, `get_comment`, `get_session`, `claim`, `unclaim`, `reply` and `report_revision`. Screen/state: none. Tag: `@F103`.
- [ ] **F104** (A3, A28) No tool shall resolve, reopen, decide or vote. Screen/state: none. Tag: `@F104`.
- [ ] **F105** (A2, A28) Tools shall take the workspace from a link, the repo or an argument. If a repo matches workspaces in several organisations, then the tool shall refuse and name the candidates. Screen/state: none. Tag: `@F105`.
- [ ] **F106** (A2, A5) `list_comments` shall filter by repo, branch, status and session, and return Open comments by default. Screen/state: none. Tag: `@F106`.
- [ ] **F107** (A15, A48, A54) `get_comment` shall return status, text, anchors, context, signed screenshot URLs, drawing data, change list, decided option, revisions and thread. Screen/state: none. Tag: `@F107`.
- [ ] **F243** (A52) `get_session` shall return a session's comments with the same fields as `get_comment`. Screen/state: none. Tag: `@F243`.
- [ ] **F108** (A3, A14) When an agent claims a comment, it shall become In Progress with "{person} via {client} is working on this". Screen/state: Comment, Pin popover. Tag: `@F108`.
- [ ] **F109** (A12) If a comment is Deciding, claimed by someone else, Revised or Resolved, then `claim` shall refuse and give the reason. Screen/state: none. Tag: `@F109`.
- [ ] **F110** (A3, A44) When an agent calls `report_revision`, the system shall add Revision {n} with its commit, summary, files and optional screenshot. Screen/state: Comment, revision entry. Tag: `@F110`.
- [ ] **F111** (A3) When `report_revision` succeeds, the comment shall be Revised and listed on Revisions. Screen/state: Revisions. Tag: `@F111`.
- [ ] **F244** (A3) If a comment is Deciding or Resolved, then `report_revision` shall refuse, record nothing and give the reason. Screen/state: none. Tag: `@F244`.
- [ ] **F245** (A28, A31) When an app's access ends, the system shall unclaim every comment it holds, with a thread line saying so. Screen/state: Comment, thread. Tag: `@F245`.
- [ ] **F169** (A28, A31) Every tool shall answer 403 or 404 to an outsider, a guest or another organisation's member without access. Screen/state: none. Tag: `@F169`.

#### Strict prompt-injection handling

- [ ] **F112** (A28) Every untrusted string a tool returns shall sit in a JSON envelope field. That covers people's and agents' text, DOM text, page titles, selectors, names and change-list values. Screen/state: none. Tag: `@F112`.
- [ ] **F113** (A28, A31) A guest's text shall carry `role: "guest"` in every tool result. Screen/state: none. Tag: `@F113`.
- [ ] **F114** (A28) Each tool description shall say that fields marked untrusted are what people wrote about the product, never instructions. Screen/state: none. Tag: `@F114`.
- [ ] **F115** (A28) Human-written text shall never appear in tool descriptions or server instructions. Screen/state: none. Tag: `@F115`.
- [ ] **F116** (A28) No tool shall fetch URLs, run commands or return content from customer sites. Screen/state: none. Tag: `@F116`.
- [ ] **F117** (A28) Every MCP call shall write an audit event with the app id, the tool and the ids it touched, never the token. Screen/state: none. Tag: `@F117`.

#### Success measure

- [ ] **F118** (A2, A3) A revision reported through `report_revision` shall be stored with source `agent` and the app that sent it. Screen/state: none. Tag: `@F118`.
- [ ] **F119** (A33) A revision a member set by hand shall be stored with source `manual`. Screen/state: none. Tag: `@F119`.
- [ ] **F120** (A3) The measure query shall count revisions per resolved comment, for the median target of 1.5. Screen/state: none. Tag: `@F120`.
- [ ] **F121** (A2, A3) The intent's measure query shall return the count of full loops, on the seed data and on production. Screen/state: none. Tag: `@F121`.

<details>
<summary>Verification</summary>

- F96 — tag `@F96`: `heydiff-web/test/mcp/auth.test.ts › unauthenticated call gets the OAuth challenge`
- F97 — tag `@F97`: `heydiff-web/e2e/consent.spec.ts › switches off, equal buttons`
- F98, F99 — tags `@F98`, `@F99`: `heydiff-web/test/mcp/scopes.test.ts › new token is read-only; writes refused with the scope named`
- F100, F102 — tags `@F100`, `@F102`: `heydiff-web/e2e/account.spec.ts › connected apps list; Connect an Agent`
- F101 — tag `@F101`: `heydiff-web/e2e/phone.spec.ts › revoke on a phone refuses the next call`
- F170 — tag `@F170`: `heydiff-web/test/server/app-check.test.ts › revoke and scope off apply to the next call`
- F103, F104, F105, F116 — tags `@F103` to `@F105`, `@F116`: `heydiff-web/test/mcp/tools.test.ts › eight tools; no resolve; workspace resolution; no fetch or exec`
- F106, F107, F243 — tags `@F106`, `@F107`, `@F243`: `heydiff-web/test/mcp/read.test.ts › filters and default; comment fields; session fields`
- F108, F110, F111 — tags `@F108`, `@F110`, `@F111`: `heydiff-web/e2e/mcp-loop.spec.ts › claim shows working on this; revision entry; Revised and listed`
- F109, F244 — tags `@F109`, `@F244`: `heydiff-web/test/mcp/status-rules.test.ts › claim and report refused by status`
- F245 — tag `@F245`: `heydiff-web/test/server/access-ends.test.ts › revoke unclaims with a thread line`
- F169 — tag `@F169`: `heydiff-web/test/mcp/access-matrix.test.ts › every tool refuses outsider, guest and other organisation`
- F112 to F115 — tags `@F112` to `@F115`: `heydiff-web/test/mcp/untrusted.test.ts › envelope and break-out corpus; guest role; description warning; no human text in descriptions`
- F117 — tag `@F117`: `heydiff-web/test/mcp/audit.test.ts › one audit row per call, no token`
- F118, F119 — tags `@F118`, `@F119`: `heydiff-web/test/domain/revision-source.test.ts › agent and manual sources`
- F120, F121 — tags `@F120`, `@F121`: `heydiff-web/test/db/measure.test.ts › revisions per resolved comment; full loops on the seed`

</details>

### Milestone 5 — Mac localhost bridge

- [ ] **F122** (A5) The Mac app shall install a Chrome native messaging host manifest for the extension's pinned id. Screen/state: none. Tag: `@F122`.
- [ ] **F123** (A5) When the extension asks about `localhost:<port>`, the Mac app shall answer with the serving folder, repo, branch, worktree and commit. Screen/state: none. Tag: `@F123`.
- [ ] **F124** (A5) If the serving process has no git folder, then the Mac app shall answer "no repo". Screen/state: none. Tag: `@F124`.
- [ ] **F125** (A26) Settings shall gain an Online tab as the last tab, with Sign In… and the Localhost Bridge checkbox. Screen/state: Mac app: Settings › Online. Tag: `@F125`.
- [ ] **F126** (A5) The Localhost Bridge checkbox shall be on by default. Screen/state: Mac app: Settings › Online. Tag: `@F126`.
- [ ] **F127** (A5) While the bridge is off, the Mac app shall answer "off" to every extension request. Screen/state: Mac app: Settings › Online. Tag: `@F127`.
- [ ] **F128** (A5) The bridge status line shall read "Extension connected" or "Extension not found". Screen/state: Mac app: Settings › Online. Tag: `@F128`.
- [ ] **F129** (A26, A28, A35) When Sign In… is pressed, the Mac app shall sign in through the browser with OAuth PKCE and a loopback redirect. Screen/state: Mac app: Settings › Online, waiting for browser. Tag: `@F129`.
- [ ] **F130** (A26, A35) If the browser sign-in expires or is cancelled, then the tab shall say so and offer Sign In… again. Screen/state: Mac app: Settings › Online, error. Tag: `@F130`.

<details>
<summary>Verification</summary>

- F122 to F124, F126, F127 — their tags: `heydiff-desktop/snapmark-app/test/bridge.test.ts › manifest names the pinned id; port resolves; no repo; on by default; off answers off`
- F125, F128 — tags `@F125`, `@F128`: `heydiff-desktop/snapmark-app/test/smoke.ts › Online tab is last; bridge status line`
- F129, F130 — tags `@F129`, `@F130`: `heydiff-desktop/snapmark-app/test/online.test.ts › PKCE loopback sign-in; expired or cancelled says so`

</details>

### Milestone 6 — Public pages, waitlist and operator area

#### Public pages and the domain

- [ ] **F131** (A17, A58) `/` shall show the placeholder: the name, one line, the waitlist form and legal links, with no session cookie. Screen/state: Landing placeholder. Tag: `@F131`.
- [ ] **F132** (A17, A20) When someone joins the waitlist, the system shall add one Unconfirmed entry and send a confirm link valid for 7 days. Screen/state: Landing placeholder, joined. Tag: `@F132`.
- [ ] **F133** (A17) If the email is already on the waitlist, then the system shall show the same joined state and add no entry. Screen/state: Landing placeholder, joined. Tag: `@F133`.
- [ ] **F246** (A17) When someone opens a valid confirm link, the system shall set the entry to Waiting. Screen/state: Confirm your place. Tag: `@F246`.
- [ ] **F247** (A17) Every waitlist email and the joined state shall offer Leave the Waitlist, which deletes the email after one press. Screen/state: Leave the waitlist. Tag: `@F247`.
- [ ] **F248** (A17) If an entry stays unconfirmed for 7 days, then the system shall delete it. Screen/state: none. Tag: `@F248`.
- [ ] **F249** (A17) `/privacy`, `/terms` and `/imprint` shall show the legal pages with their fixed sections. Screen/state: Privacy, Terms, Imprint. Tag: `@F249`.
- [ ] **F250** (A17) While the owner's legal name and address are missing, the waitlist form on production shall stay off. Screen/state: Landing placeholder. Tag: `@F250`.
- [ ] **F134** (A30) Landing, waitlist, Welcome and email headlines shall name the outcome, never a feature list. Screen/state: Landing placeholder, Emails. Tag: `@F134`.
- [ ] **F191** (A65, A72, A81) When the owner has entered the Route53 records, `https://www.heydiff.com/readyz` shall return production's sha over HTTPS. Screen/state: none. Tag: `@F191`.

#### Operator

- [ ] **F135** (A17) If a user without the operator platform role opens `/operator`, then the system shall answer 404. Screen/state: Operator shell and Waitlist. Tag: `@F135`.
- [ ] **F136** (A17, A20) When an operator invites selected waitlist entries, the system shall send one invitation each and mark them Invited. Screen/state: Operator shell and Waitlist. Tag: `@F136`.
- [ ] **F137** (A17) Operator Invitations shall resend or revoke an invitation. Screen/state: Operator: Invitations. Tag: `@F137`.
- [ ] **F138** (A17) Operator Organisations shall show organisations read-only and grant seats by hand. Screen/state: Operator: Organisations and one organisation. Tag: `@F138`.
- [ ] **F139** (A17) Operator Users shall show a person's organisations, roles, connected app count and last sign-in. Screen/state: Operator: Users and one user. Tag: `@F139`.
- [ ] **F140** (A17) Operator Feature Flags shall turn a flag on for everyone or per organisation. Screen/state: Operator: Feature Flags. Tag: `@F140`.
- [ ] **F141** (A17) Operator Usage shall show weekly active people, comments created and full loops. Screen/state: Operator: Usage. Tag: `@F141`.
- [ ] **F142** (A17) Every operator action shall write an audit event. Screen/state: none. Tag: `@F142`.

<details>
<summary>Verification</summary>

- F131, F132, F133 — tags `@F131` to `@F133`: `heydiff-web/e2e/landing.spec.ts › placeholder, no cookie; join sends confirm link; duplicate adds nothing`
- F246, F247, F248 — tags `@F246` to `@F248`: `heydiff-web/e2e/waitlist.spec.ts › confirm sets Waiting; Leave deletes the email; unconfirmed purge`
- F249, F250 — tags `@F249`, `@F250`: `heydiff-web/e2e/legal.spec.ts › three legal pages; form off without legal details`
- F134 — manual: the owner reads the landing, Welcome and the mails against A30.
- F191 — manual: after the owner enters the records, Claude runs `curl -fsS https://www.heydiff.com/readyz` and compares the sha.
- F135 to F141 — tags `@F135` to `@F141`: `heydiff-web/e2e/operator.spec.ts › 404 for non-operators; invite; resend and revoke; seats; user lookup; flags; usage`
- F142 — tag `@F142`: `heydiff-web/test/server/audit.test.ts › operator actions audited`

</details>

### Milestone 7 — Two-way Mac sync

#### Sharing

- [ ] **F143** (A26) The Share to Workspace sheet shall name what leaves the Mac, the workspace and how many people see it. Screen/state: Mac app: Share to Workspace sheet. Tag: `@F143`.
- [ ] **F144** (A26, A52) When a person presses Share, the Mac app shall link the session folder to one Session online. Screen/state: Mac app: Share to Workspace sheet. Tag: `@F144`.
- [ ] **F145** (A26) Each Reference in a capture shall become one comment. The general comment, cards and other marks go into one more comment, "From HeyDiff for Mac". Screen/state: Session. Tag: `@F145`.
- [ ] **F146** (A15, A26) A Mac capture's anchor shall hold app name, window title, screen size, and the URL when the app is a browser. Screen/state: Comment, Context panel. Tag: `@F146`.
- [ ] **F147** (A26) The web Session page shall show the same screenshots and notes as the Mac session. Screen/state: Session. Tag: `@F147`.
- [ ] **F148** (A26) When a person confirms Stop Sharing, sync shall stop and the online copy shall stay. Screen/state: Mac app: sync status. Tag: `@F148`.
- [ ] **F251** (A26) Note text shall sync both ways; replies, status and decisions stay online, shown on the Mac as "{n} replies · {status}". Screen/state: Mac app: sync status. Tag: `@F251`.

#### Sync engine

- [ ] **F149** (A26) The server shall be the source of truth, and every synced record shall carry a revision number. Screen/state: none. Tag: `@F149`.
- [ ] **F150** (A26) When the Mac app is back online, it shall replay its offline operation log in order, losing no change. Screen/state: none. Tag: `@F150`.
- [ ] **F151** (A26) While online, a change made on the web shall reach the Mac session within 5 seconds. Screen/state: none. Tag: `@F151`.
- [ ] **F152** (A26) If two edits hit the same field, then the last write shall win. Screen/state: none. Tag: `@F152`.
- [ ] **F153** (A26) The overwritten text shall be kept online as an entry "Kept from an edit on {person}'s Mac". Screen/state: Comment, thread. Tag: `@F153`.
- [ ] **F154** (A26) The Mac editor shall show "Edited elsewhere. The other text is kept in the thread online." on that note. Screen/state: Mac app: sync status, Edited elsewhere. Tag: `@F154`.
- [ ] **F155** (A26) A delete shall sync as a tombstone kept 30 days, and undo shall restore it within that time. Screen/state: none. Tag: `@F155`.
- [ ] **F156** (A26) When a tombstone is 30 days old, the system shall purge it and its record. Screen/state: none. Tag: `@F156`.
- [ ] **F157** (A26) After each sync, the Mac app shall rewrite `session.md` and the folder's files from the synced state. Screen/state: none. Tag: `@F157`.

#### Sync states

- [ ] **F158** (A26) The session footer shall read "Synced · {time}", "Syncing {n} Changes", "Offline · {n} Changes Waiting" or "Not Shared". Screen/state: Mac app: sync status. Tag: `@F158`.
- [ ] **F159** (A26, A28) If the device is signed out or revoked, then the footer shall say "Sync stopped" with Sign In…. Changes stay on the Mac. Screen/state: Mac app: sync status, stopped. Tag: `@F159`.
- [ ] **F160** (A26) If access to the workspace is lost, then the footer shall offer Share to Another Workspace… and Stop Sharing…. Screen/state: Mac app: sync status, stopped. Tag: `@F160`.
- [ ] **F161** (A26) If the server refuses for another reason, then the footer shall offer Try Again. Screen/state: Mac app: sync status, stopped. Tag: `@F161`.

<details>
<summary>Verification</summary>

- F143, F154, F158 — tags `@F143`, `@F154`, `@F158`: `heydiff-desktop/snapmark-app/test/smoke.ts › share sheet line; Edited elsewhere callout; footer states`
- F144, F148, F150, F151, F157, F159, F160, F161 — their tags: `heydiff-desktop/snapmark-app/test/sync.test.ts`
- F145, F149, F152, F153, F155, F251 — their tags: `heydiff-web/test/server/sync.test.ts`
- F146 — tag `@F146`: `heydiff-kit/packages/annotations/test/anchor.test.ts › Mac anchor fields`
- F147 — tag `@F147`: `heydiff-web/e2e/session.spec.ts › same screenshots as the Mac`
- F156 — tag `@F156`: `heydiff-web/test/server/retention.test.ts › tombstone purged after 30 days`

</details>

### Milestone 8 — HeyDiff for Mac

- [ ] **F252** (A67, A69) The Mac app shall build as HeyDiff, bundle id `com.heydiff.mac`, with DMG and ZIP named `HeyDiff-<version>-<arch>`. Screen/state: none. Tag: `@F252`.
- [ ] **F253** (A67, A68) HeyDiff for Mac shall fetch updates from the public bucket `heydiff-updates` in project `heydiff`. Screen/state: none. Tag: `@F253`.
- [ ] **F254** (A67, A69) When HeyDiff for Mac first starts and finds Snapmark's `state.json`, it shall copy settings, keys, captured area and current session. Screen/state: Mac app, first launch. Tag: `@F254`.
- [ ] **F255** (A67) The migration shall never move or delete Snapmark's data folder. Screen/state: none. Tag: `@F255`.
- [ ] **F256** (A67) HeyDiff for Mac shall keep using the sessions folder Snapmark used until the person picks another. Screen/state: Mac app, first launch. Tag: `@F256`.
- [ ] **F257** (A67) If Snapmark opened at login, then HeyDiff for Mac shall open at login instead and remove Snapmark's login item. Screen/state: none. Tag: `@F257`.
- [ ] **F258** (A67) Keychain items and the `heydiff://` URL scheme shall exist only under `com.heydiff.mac`. Screen/state: none. Tag: `@F258`.
- [ ] **F259** (A67, A69) When the last Snapmark release runs, it shall download HeyDiff for Mac and move it to Applications. If the move fails, it shows a download notice. Screen/state: Snapmark, hand-over notice. Tag: `@F259`.
- [ ] **F260** (A67) The hand-over shall leave the Snapmark app in Applications for the person to remove. Screen/state: none. Tag: `@F260`.
- [ ] **F261** (A64, A67) Every string the Mac app shows shall say HeyDiff, never Snapmark. Screen/state: menu bar, Dock, windows, Login Items, notifications. Tag: `@F261`.
- [ ] **F262** (A67) `HEYDIFF_ROOT` shall set the sessions folder; `SNAPMARK_ROOT` is still read when it is set. Screen/state: none. Tag: `@F262`.
- [ ] **F263** (A83) Each built screen shall match its journey image from the plan's "Visual reference". Proof: a fresh screenshot in its theme and width, one `validation.md` row per image, verdict `met`. Screen/state: every screen in milestones 2 and 3. Tag: `@F263`.

<details>
<summary>Verification</summary>

- F252, F253 — tags `@F252`, `@F253`: `heydiff-desktop/heydiff-app/test/build-config.test.ts › appId, product name, artifact names, publish URL`
- F254, F255, F256, F262 — their tags: `heydiff-desktop/heydiff-app/test/migrate-from-snapmark.test.ts › copies state, leaves the old folder, keeps the sessions folder, honours both variables`
- F257, F258 — tags `@F257`, `@F258`: `heydiff-desktop/heydiff-app/test/identity.test.ts › login item moves; nothing under the old id`
- F259, F260 — manual: the owner installs the last Snapmark release on his Mac and watches the hand-over.
- F261 — tag `@F261`: `heydiff-desktop/heydiff-app/test/strings.test.ts › no Snapmark in any shown string`

</details>

### Non-functional

- [ ] **N1** (A9, A10) If a component uses a raw colour, an arbitrary value or a visual inline style, then the tokens lint shall fail CI. Tag: `@N1`.
- [ ] **N2** (A10) If a component holds a literal UI string, then the i18n lint shall fail CI. Tag: `@N2`.
- [ ] **N3** (A10, A29) If `src/domain` imports I/O or `src/server` imports `src/app`, then dependency-cruiser shall fail CI. Tag: `@N3`.
- [ ] **N4** (A2) If an app imports another app instead of `heydiff-kit`, then dependency-cruiser shall fail CI. Tag: `@N4`.
- [ ] **N5** (A29) Every web and extension screen shall meet WCAG 2.2 AA, with full keyboard use. Tag: `@N5`.
- [ ] **N6** (A11) Text shall meet 4.5:1 and the focus ring 3:1 contrast, in light and dark. Tag: `@N6`.
- [ ] **N7** (A36, A37, A45) The web app and extension shall follow the system's light or dark setting, with Clear Sky dark when none is set. Tag: `@N7`.
- [ ] **N8** (A11, A61) While the system asks for reduced motion, the web app and extension shall play no movement animation. Tag: `@N8`.
- [ ] **N9** (A11) An action shall show no progress under 400 ms and shall show progress from 1 second. Tag: `@N9`.
- [ ] **N10** (A11) On the seed data, API reads shall answer in under 300 ms at p95 in development. Tag: `@N10`.
- [ ] **N11** (A2) On the seed data, every MCP tool shall answer in under 500 ms at p95 in development. Tag: `@N11`.
- [ ] **N12** (A18) Every web page shall fit 360 px and 1280 px wide without horizontal scroll. Tag: `@N12`.
- [ ] **N13** (A11) Live updates shall keep layout shift under 0.1. Tag: `@N13`.
- [ ] **N14** (A26, A67) Until milestone 8, the Mac app's local workflow without an account and its bundle id `com.cdudek.snapmark` shall not change. Tag: `@N14`.
- [ ] **N15** (A19) No repo shall hold a secret; `.env.local` stays local. Tag: `@N15`.
- [ ] **N16** (A66) Production and staging shall keep a minimum of zero instances, with no warm instance. Tag: `@N16`.
- [ ] **N17** (A63) Every web image shall run as uid 65532 on a read-only root filesystem, with no shell. Tag: `@N17`.

<details>
<summary>Verification</summary>

- N1 — tag `@N1`: `heydiff-web/test/lint/tokens.test.ts › raw colour, arbitrary value, inline style fail` (also in `heydiff-chrome`, `heydiff-kit`).
- N2 — tag `@N2`: `heydiff-web/test/lint/i18n.test.ts › literal string fails` (also in `heydiff-chrome`).
- N3, N4 — tags `@N3`, `@N4`: `heydiff-web/test/lint/boundaries.test.ts › domain, server and app rules`
- N5 — manual: Claude walks every screen by keyboard only; the owner spot-checks with VoiceOver.
- N6, N7, N8 — tags `@N6` to `@N8`: `heydiff-web/e2e/style.spec.ts › contrast; theme follows the system, dark when none; reduced motion`
- N9 — tag `@N9`: `heydiff-web/e2e/comment.spec.ts › progress timing`
- N10, N11 — tags `@N10`, `@N11`: `heydiff-web/test/perf/api.test.ts`, `heydiff-web/test/perf/mcp.test.ts`
- N12 — tag `@N12`: `heydiff-web/e2e/responsive.spec.ts › no horizontal scroll at 360 and 1280`
- N13 — tag `@N13`: `heydiff-web/e2e/live.spec.ts › layout shift under 0.1`
- N14 — tag `@N14`: `heydiff-desktop/snapmark-app/test/smoke.ts › every v0.24.0 check still passes`
- N15 — manual: gitleaks in CI, and Claude runs it before each milestone PR.
- N16 — tag `@N16`: `heydiff-terraform/policy/terraform/foundation_test.rego › min instances 0`
- N17 — tag `@N17`: `heydiff-web` CI job `image-smoke` runs `scripts/docker-smoke.sh`.

</details>

## Verification

What proves the whole change, beyond the per-fact checks.

- **Automated:** in each repo, `npm run format && npm run lint && npm run typecheck && npm test` exits 0. `python3 scripts/verify_gate.py milestone 2026-10-27-online-release-1` ends `VERIFY PASS milestone` per milestone.
- **Core loop:** `heydiff-web/e2e/core-loop.spec.ts › comment, decide, claim and revise through MCP, resolve` runs the whole loop on the seed data.
- **Manual:** the owner dogfoods on his Mac in light and dark, at 100 % and 150 %. He tests J6 on his phone against staging.

## Retired facts

Each number below stays unused. The A59 journey (approved 2026-10-28) replaced the model they described.

| Fact | Was                                            | Why retired                                                              |
| ---- | ---------------------------------------------- | ------------------------------------------------------------------------ |
| F41  | Open, Needs Decision, In Review and Done lists | one Comments list with a Status filter (F193, F194)                      |
| F43  | Feedback view with version tabs                | the Comment page (F196)                                                  |
| F46  | A comment lands on a version's thread          | versions are gone; replies (F199)                                        |
| F47  | Questions flag Needs Answer                    | dropped; a question is a reply with a mention (`spec/ia.md`)             |
| F48  | Post Version                                   | options inside a decision (F205), revisions from the agent (F110)        |
| F49  | Compare two versions                           | Before and After on a revised comment (F211)                             |
| F52  | Decision request between versions              | Start a Decision with options (F204)                                     |
| F54  | Acceptance by Approve with no Request Changes  | a member resolves (F201)                                                 |
| F55  | Accepted mockup marks Decided                  | Decide on an option (F208)                                               |
| F57  | Accepted implementation moves to Done          | Resolve (F201)                                                           |
| F58  | Request Changes returns to Open                | any reply reopens a Revised comment (F203, A70)                          |
| F59  | A late objection reopens                       | Reopen by a member (F202)                                                |
| F63  | Bulk Change Status from a selection bar        | Change Status lives on one comment (F61); no bulk change in the A59 spec |
| F66  | Review requests to approvers, never guests     | revision items reach the thread, guests included (F217)                  |
| F77  | Guests cannot capture                          | guests comment, draw and vote (A31)                                      |
| F86  | Composer with kind, module and title           | text only, no title (F224, A42)                                          |
| F89  | Sent panel with a link and Next Capture        | the pin itself is the confirmation (F226)                                |

## Out of scope

- GitHub and Google sign-in and account linking (part of A7) — release 2; the Sign-In Methods slot stays (F27).
- Designed mail templates (part of A8 and A20) — release 2; plain mails go out through `resend` on staging and production (F187).
- Chrome Web Store listing (part of A21) — release 2; the extension loads unpacked (F5).
- Billing, Slack, GitHub deployments, the dev build plugin, the blog and text search — release 2.
- Moves across containers and client comment links — release 2 (journey defaults 10 and 14).
- Device-code sign-in for the Mac app — dropped for the browser and a loopback redirect (A35, F129).
- A23, A25, A77 — process asks: parallel milestones, the builder models and the one `/goal` are the plan's order of work.
- A40, A62 — process asks: the plan moved to `heydiff-web`, and the technical plan followed the approved journey.
- A49 — corrected by A51, then replaced by A53: the owner supplies the logo (F175).
- A56 — replaced by A58: release 1 ships the placeholder only (F131).

## Open questions

None. Every gap took a default the gate can overturn: `spec/owner-decisions.md` sections 3 to 9.
