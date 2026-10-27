---
type: design
status: draft
created: 2026-10-27
author: Calvin Dudek
project: Snapmark online
supersedes: none
---

# Snapmark online: design

**Short version.** Snapmark online lets a team give exact feedback on real, running UI, decide between alternatives, and hand the result to coding agents, with a paper trail of every decision. One account, many organisations; one paid plan per seat; the Chrome extension, the Mac app, a web app and an MCP server all work on the same feedback. Built as a long-lived product: Next.js, Tailwind, HeroUI and Motion on Cloud Run, Postgres on Cloud SQL, tokens from the owner's design system, i18n and a glossary from the first commit.

Strategy, pricing and the decision log live in `pokbytes/snapmark-context` (`strategy/2026-10-27-snapmark-online.md`, section 9; `audience/personas.md`). This document is the product and technical design. Where it says **owner**, the owner decided it in conversation on 2026-10-27; where it says **Claude's call**, the builder may revisit it with a reason.

## 1. Intent

- **Why (owner):** Snapmark turns agentic engineering and software factories from a single-player into a multiplayer game. It gives exact tools for exact feedback and leaves a paper trail of decisions.
- **For (owner):** primary audiences are product teams building with coding agents, and founders and solo builders; secondary are agencies and freelancers, QA and design QA specialists, and engineer-led agentic teams. When a choice serves the primary and hurts a secondary audience, the primary wins. Details: `snapmark-context/audience/audiences.md`, `jobs-to-be-done.md`, `personas.md`.
- **Lasting (owner):** not a disposable app. Clear reusable tokens, no inline or ad-hoc styling, a glossary, i18n from the start, structure that supports change and maintenance.
- **Feel (owner):** simple, effective, calm, productive.

## 2. Goals, non-goals, anti-goals

**Goals**

1. Feedback points at an exact element, inside a named region and module, on a known version of a known environment.
2. A coding agent, acting for the person driving the work, can fetch open feedback for its repo and branch, ask questions, propose versions, and report implementations, without copy-paste.
3. Teams decide between alternatives with versions, comments, votes and review actions; the outcome is recorded.
4. Every change has a trail: who asked, what was decided, which version, which PR, who approved.
5. Freelancers and agencies work across several organisations with one login.

**First release (owner): a closed release for the owner's own teams**, by waitlist and beta invitation only; there are no free self-serve accounts at first.

- **In:** a public landing page with waitlist, the operator area (section 8.0), sign-in, organisations, workspaces, invitations, extension capture, feedback, versions, reviews, decisions, MCP, the Mac app's localhost bridge and **two-way session sync** (owner), GitHub read-only, i18n, tokens, Cloud Run deploys.
- **Out until a later release:** Paddle billing (seats are granted by hand in the beta), company-domain claims, retention jobs, audit and decision export, the data processing agreement, a public Chrome Web Store listing (unlisted instead), the dev plugin.

**Non-goals for the first release**

- Linear (bidirectional, to be designed separately), Jira or Asana sync. GitHub is read-only: deployments, pull requests and commits fill the version stamp and link implementations; no issue creation, no PR comments, no status checks yet (Claude's call).
- A Business or Enterprise plan (kept possible through entitlements; SAML, SCIM later).
- Languages other than English (the i18n machinery exists; only `en` ships).
- Video capture, native mobile apps, a Windows or Linux desktop app.

**Anti-goals (would be a failure even if it works)**

- Feedback that loses its context when the code changes: the screenshot is the record, the code anchor is a hint.
- The agent deciding or approving on anyone's behalf.
- One-off styling or hard-coded UI text that drifts from the design system and glossary.
- A tool that needs a meeting to understand: every screen has one obvious next action.

## 3. Concepts and glossary

These words are the product's vocabulary: UI text, API names, table names and docs use them and nothing else. The UI glossary lives in `docs/ux/glossary.md` (built from the existing `glossary-proposal.md`) and each term below gets an entry.

| Term                 | Meaning                                                                                                                                      |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **User**             | A person. One account, any number of sign-in methods.                                                                                        |
| **Sign-in method**   | Email link, GitHub or Google, linked to one user.                                                                                            |
| **Organisation**     | Pays, holds seats, domains and settings, owns everything inside it. A user can belong to many.                                               |
| **Member / Guest**   | Role of a user in an organisation: owner, admin, member (paid seat) or guest (free, only invited workspaces).                                |
| **Workspace**        | A product inside an organisation, e.g. "Web shop". Holds repos, environments, modules and feedback.                                          |
| **Repo**             | A GitHub repository linked to a workspace.                                                                                                   |
| **Environment**      | Where the product runs: kind (local, preview, staging, production) and address patterns, e.g. `omr.com` → production, `omr.ninja` → staging. |
| **Route rule**       | Maps an address path to a repo, for microfrontends: `/reviews/*` → `omr-reviews-web`.                                                        |
| **Module**           | A named part of the product, e.g. "Checkout summary", kept as a list per workspace.                                                          |
| **Region**           | Where on the page: a landmark such as `main-content-area`.                                                                                   |
| **Capture**          | A screenshot plus its anchor and its version stamp. Never changes once taken.                                                                |
| **Anchor**           | What the capture points at: URL, selector, DOM path, text, bounding box, viewport, region, module, component, `file:line`.                   |
| **Version stamp**    | Environment, commit, deployment, release tag and PR known at capture time.                                                                   |
| **Feedback**         | One request about one anchored thing. Has a thread, versions and a status.                                                                   |
| **Version**          | One state of the thing a feedback is about: v0 is the original capture; later versions are mockups, alternatives or implementations.         |
| **Thread**           | The conversation on a feedback: comments, questions, review actions, votes.                                                                  |
| **Question**         | A thread entry that blocks work until answered.                                                                                              |
| **Review**           | Approve, Request changes or Comment, on a version.                                                                                           |
| **Decision request** | Asks named people to vote between versions, optionally by a date.                                                                            |
| **Copilot**          | The coding agent acting for a person through MCP, shown as "Ben via Claude". Not a member.                                                   |
| **Operator**         | Snapmark staff using the operator area. Not an organisation role; "admin" always means an organisation's admin.                              |
| **Session**          | A Mac app session: a local folder of captures and `session.md`. Can be shared to a workspace.                                                |

## 4. Workflows

### 4.1 Give feedback

1. A member or guest captures an element (extension) or a screen area (Mac app) on any environment.
2. The capture gets its anchor and version stamp automatically (section 7).
3. They draw (shapes stored as vector data on top of the capture), write, and choose: comment, or request a change.
4. The feedback lands in the workspace, grouped by module and page.

### 4.2 Decide

- Anyone in the thread can ask a question, post a version (mockup, alternative), or open a decision request.
- People comment and vote per version.
- **Rule (owner):** a version is accepted when it has at least one Approve and no open Request changes. Anyone can approve; anyone else can object, and the objection holds until resolved.
- The same rule settles a design choice before building and checks an implementation after.

### 4.3 Implement and verify

1. The engineer's copilot lists open feedback for the repo and branch (MCP), reads the accepted version and the anchor, and implements.
2. It reports the implementation as a new version: commit, PR, and an after-capture of the same anchor (from the PR preview when there is one).
3. A human reviews it with the same rule. Accepted means done.

**Details of the rule (Claude's calls, owner asked to keep it simple):**

- Votes are signals, not the rule: a decision request shows the tally, but acceptance still follows Approve / Request changes. An Approve given while a decision request is open is allowed; the tally stays visible next to it.
- A decision request closes when one of its versions is accepted, or when the person who opened it closes it.
- One version per feedback is accepted at a time; accepting another replaces it, and both stay in the trail.
- An objection is cleared when its author withdraws it or approves, or when a newer version is posted (the objection then applies to the old version only).
- Accepting a mockup or alternative marks the feedback "decided" and makes it claimable; it does not change the status, which only moves through implementation.

### 4.4 Status

`open` → `in progress` (copilot claimed it) → `implemented` → `accepted`, or back to `open` when changes are requested. "Needs answer" and "Needs decision" are shown as flags, not states: a feedback with an open question or decision request cannot be claimed.

### 4.5 Journey across environments (later, but the data exists from day one)

Feedback given on production v1.4 → fixed in PR #212 → accepted on its preview → on staging → live in production when a production deployment contains the fix commit.

## 5. Accounts, organisations and plans

- **Owner:** a user can be in many organisations (freelancers and agencies are real users). Switching organisations needs no new login; the extension, MCP and links take the organisation from context.
- **Roles:** owner, admin, member (paid seat), guest (free, only workspaces they are invited to). Up to 5 guests per paid seat (owner). Guests view, comment, draw and vote; members also capture into shared workspaces, request decisions, approve, invite and use MCP.
- **Plans (owner):** Free is solo with no invites at all, not even guests; it includes capture, own feedback, MCP and the GitHub link, and every use needs an account (the extension does not work signed out). Paid is $4 per seat per month billed yearly ($48), $6 monthly, per organisation, with everything included. At least one paying person is behind every shared space. Free accounts open after the closed release.
- **Seats (owner):** admins buy a number of seats first. Inviting someone means picking their role: a guest needs no seat; a member or admin needs a free seat, and the invite cannot be sent without one. People joining through a claimed company domain join as guests (Claude's call, so no one is billed unasked); an admin can make them members if a seat is free.
- **Entitlements (owner):** code checks what a plan allows (`can_invite`, `can_export_audit`, `max_history_days`), never plan names, so a Business plan later is a mapping, not a code change.
- **Company domain:** an organisation can claim `acme.com` (DNS record, or an admin signing in with Google for that domain). People signing in with that domain join automatically as member or guest; the organisation chooses.
- **Retention (owner):** free tier data deleted after 30 days (warning and export first); paid data moves to cold storage after 90 idle days and is deleted 365 days after a session's last activity.
- **Billing:** Paddle as merchant of record, behind a billing interface (Claude's call; Stripe is the alternative).

## 6. Sign-in

- **Methods (owner):** email magic link, GitHub, Google (including Google Workspace).
- **Linking (owner):** automatic when the provider confirms the email is verified and it matches an existing user; otherwise by hand under Settings › Sign-in methods. The last method cannot be removed.
- **Library (Claude's call):** Better Auth on our Postgres: magic link, GitHub, Google, account linking, organisations with invitations, and acting as the OAuth server for MCP. The builder verifies these features against its current docs before committing to it; the fallback is Auth.js plus our own organisation tables.
- **Devices:** the extension, the Mac app and MCP clients sign in through the browser (OAuth with PKCE) and get their own revocable token per device. MCP follows the MCP authorisation spec.
- **Sessions:** HTTP-only, secure, same-site cookies for the web app; short-lived access tokens with refresh for devices.

## 7. Clients and where code context comes from

| Client                                    | Does                                                                                                                        |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **Web app** (`snapmark-web`)              | Workspaces, feedback, threads, versions, reviews, decisions, settings, billing.                                             |
| **Chrome extension** (`snapmark-chrome`)  | Picks an element or area on any page, captures it with anchor and version stamp, posts feedback. Works without the Mac app. |
| **Mac app** (`snapmark-app`, today's app) | Captures anything on screen; keeps sessions in two-way sync with a workspace; the **localhost bridge** for the extension.   |
| **MCP server** (route of the web app)     | The copilot's door: list, read, ask, post versions, report implementations.                                                 |
| **Dev package** (new, optional)           | Build plugin that stamps repo, `file:line`, region and module onto elements and writes the version stamp into the page.     |

**Anchor and version, most reliable first:**

1. **Dev package:** `data-snapmark-src="src/Card.tsx:42"`, `data-snapmark-repo`, `data-snapmark-module`, `data-snapmark-region` on elements in non-production builds; a `<meta name="snapmark">` with repo, commit, version and build time in every build. Microfrontends stamp their own repo, so one page assembled from several apps still resolves per element. React 19 removed the built-in source location, so the build plugin is the reliable way.
2. **Mac app bridge (localhost):** the extension asks the Mac app via Chrome native messaging which process serves `localhost:<port>`; the app resolves its folder, repo, branch, worktree and commit. Limit: a dev server inside Docker reports the Docker proxy.
3. **Workspace rules:** environment address patterns and route rules map the URL to environment and repo.
4. **GitHub deployments:** match address and time to a deployment, commit and PR (previews from Vercel and similar report there).
5. **Fallback:** URL, selector, landmark region and text only. Enough for an agent to search the code.

**Mac app session sync (owner: two-way, in the first release; the details are Claude's calls).** This is the largest single item in the first release.

- A local session folder links to one online **session** in a workspace. Each numbered marker in a capture becomes one feedback; other shapes are drawings on that capture.
- Mac captures have no DOM anchor. Their anchor holds the app name, window title, screen size, and the URL when the front app is a browser; the version stamp is filled when the localhost bridge knows the repo.
- The server is the source of truth. The Mac app keeps an operation log while offline and replays it when back online. Every record carries a revision number.
- Conflicting edits to the same field: the last write wins, and the overwritten text is kept in the thread as "edited elsewhere", so nothing typed is lost.
- Deletes are tombstones kept for 30 days, so they sync and can be undone.
- `session.md` and the files in the folder are rewritten from the synced state, so agents reading the folder keep working offline.

**MCP tools (first cut):** `list_workspaces`, `list_feedback(repo?, branch?, status?)`, `get_feedback(id_or_url)` (Markdown plus image URLs, anchor, version stamp, accepted version, thread), `claim`, `ask(question)`, `post_version(mockup | alternative)`, `report_implementation(commit, pr?, capture?)`, `reply`. No approve tool exists. The server serves every organisation and workspace the signed-in user can see; tools take the workspace from the link, the repo, or an argument, never from a login switch (owner: switching projects in Linear's MCP is a pain).

## 8. Architecture

### 8.0 Three areas (owner)

| Area         | For                                 | First release                                                                                    |
| ------------ | ----------------------------------- | ------------------------------------------------------------------------------------------------ |
| **Public**   | Marketing, landing pages, blog      | Landing page with waitlist sign-up; blog later                                                   |
| **App**      | Organisations, workspaces, feedback | Yes                                                                                              |
| **Operator** | Snapmark staff                      | Waitlist, beta invitations, organisations and users, seats granted by hand, feature flags, usage |

**Claude's calls:**

- One Next.js app with three route groups and separate layouts (`(public)`, `(app)`, `(operator)`), served by one Cloud Run service. Shared tokens, UI kit, i18n and auth; public pages are static or cached. Split into separate services only when one area's load or release pace differs.
- Hosts: public on the apex domain, the app on `app.`, the operator area under `app.<domain>/operator`. Cookies are scoped to `app.`, so public pages carry no session.
- Operator access is a platform role on the user, separate from organisation roles, and requires Google sign-in. Every operator action writes an audit event. Viewing an organisation as its users see it is read-only and logged.
- Blog posts are MDX files in the repo, with the same tokens and components as the rest.

### 8.1 Repo layout

**One repo per app (owner, 2026-10-27; replaces the monorepo).** All repos live in the `pokbytes` GitHub organisation. Repo names follow the working name and change with the final product name.

| Repo                  | Holds                                                                                                        |
| --------------------- | ------------------------------------------------------------------------------------------------------------ |
| `snapmark-context`    | Strategy, audiences, decisions, design-system pointers (exists)                                              |
| `snapmark`            | The Mac app (today's repo, moved to `pokbytes`; the empty `snapmark-chrome/` and `snapmark-web/` folders go) |
| `snapmark-web`        | Next.js: public, app and operator areas, REST API, MCP server                                                |
| `snapmark-chrome`     | The Chrome extension (MV3)                                                                                   |
| `snapmark-kit`        | Shared packages, published to GitHub Packages (private npm)                                                  |
| `snapmark-dev-plugin` | The optional build plugin, published to public npm (later)                                                   |

**`snapmark-kit` (Claude's call; the one place code shared across apps lives):**

```
snapmark-kit/
├── packages/
│   ├── contracts/     # zod schemas and types for every API and MCP payload
│   ├── annotations/   # shape and anchor format (Mac app, extension, web)
│   ├── redaction/     # secret and email detection (Mac app, extension)
│   ├── tokens/        # design system → CSS variables, Tailwind theme, HeroUI theme
│   └── ui/            # HeroUI wrappers and Snapmark components (web, extension pop-up)
└── .changeset/        # one changeset per change → semver release per package
```

**`snapmark-web` inside (Claude's call):**

```
snapmark-web/
├── src/app/[locale]/
│   ├── (public)/          # landing, waitlist, blog (MDX)
│   ├── (app)/             # organisations, workspaces, feedback
│   └── (operator)/        # Snapmark staff: waitlist, invites, seats, flags
├── src/app/api/v1/        # REST API for extension, Mac app and integrations
├── src/app/mcp/           # MCP endpoint
├── src/features/<name>/   # one folder per feature: components, server actions, queries
├── src/domain/            # pure logic: status, acceptance rule, entitlements, anchor resolution. No I/O.
├── src/server/
│   ├── db/                # Drizzle schema, migrations, queries
│   ├── auth/              # Better Auth, the one permission policy module
│   ├── mail/              # base.ts, factory.ts, providers/resend.ts; React Email templates
│   ├── storage/           # base.ts, factory.ts, providers/gcs.ts
│   └── billing/           # base.ts, factory.ts, providers/paddle.ts
├── messages/en.json       # UI text, keys follow the glossary
└── docs/                  # designs, ADRs, UX docs (glossary, guidelines, sitemap)
```

**Rules**

- Shared code lives only in `snapmark-kit`; apps never copy from each other. Each app pins kit versions; Dependabot opens the bump PRs.
- A change to `contracts` that breaks clients is a new API version (`/api/v2`), never an edit in place. The server supports the current and the previous version, because the extension and the Mac app update later than the server.
- Each repo has its own CI, rulesets, semantic-release and `CLAUDE.md`, all importing `snapmark-context`.
- `src/domain` imports nothing that does I/O; `src/server/*` never imports from `src/app`.
- Swappable services use the provider pattern: an interface (`base.ts`), a factory that picks the provider from settings (`factory.ts`), one file per provider. Resend is the first mail provider (owner).
- Every permission check goes through the auth policy module; no route decides on its own.
- **Cost of separate repos, accepted:** a change to a shared format is a kit release plus a bump PR per app, and versions can drift; Dependabot and the two-version API rule keep that in check.

### 8.2 Data model (Postgres)

Core tables, all with `id` (UUIDv7), `created_at`, `updated_at`; soft delete only where retention needs it.

- `users`, `accounts` (sign-in methods), `sessions`, `device_tokens`
- `organisations`, `memberships` (user, organisation, role), `invitations`, `domains` (claimed, verified, join role)
- `subscriptions` (organisation, provider ids, seats, period), `entitlements` (plan → capability mapping)
- `workspaces`, `workspace_access` (guest → workspace)
- `repos`, `environments` (kind, address patterns), `route_rules`, `modules`
- `sessions` (workspace, title, created by, local folder id, revision) and `sync_operations` (device, session, operation, revision, applied at)
- `captures` (session?, storage key, size, width, height, `anchor jsonb`, `version_stamp jsonb`, redaction log)
- `feedback` (workspace, capture, kind, status, module, region, page, created by, acting via copilot or not)
- `versions` (feedback, number, kind: original | mockup | alternative | implementation, capture or image, commit, PR, created by)
- `thread_entries` (feedback, version?, kind: comment | question | answer | review | decision_request | vote, body, `shapes jsonb`, author, via copilot)
- `audit_events` (organisation, actor, action, subject, data): the paper trail, append-only
- `integrations` (GitHub installation per organisation)

Shapes, anchors and version stamps are `jsonb` with a version field, validated by `contracts`.

### 8.3 Files

Captures are stored as WebP in Cloud Storage (europe-west3, private bucket, signed URLs), originals plus a 400 px thumbnail. Measured: UI captures average 44 KB as WebP against 282 KB as PNG; a full Retina screen is about 230 KB. Drawings are data, not pixels. Redaction runs on the device before upload (owner: required before launch).

### 8.4 Live updates

Open question. Claude's suggestion: server-sent events from the web app for thread and status changes, with Postgres `LISTEN/NOTIFY` behind it; WebSockets only if presence or collaborative drawing comes.

## 9. UI system

- **Stack (owner):** Next.js (App Router), Tailwind, HeroUI, Motion. TypeScript strict.
- **Design system (owner):** the owner's `design-system-starter` (`system.tokens.json` plus a Snapmark overlay, rules in `examples/snapmark.md`), adjusted for the web app.
- **Tokens:** `snapmark-kit`'s `tokens` package turns the design system into CSS variables, Tailwind's theme and HeroUI's theme (colours, radius, typography, spacing, motion durations). Components use tokens only. A lint rule blocks raw colours and arbitrary values (`#fff`, `p-[13px]`, inline `style` for visual properties).
- **HeroUI (owner):** minimal styling on top of its base: colours, border radius and general theming, defined in tokens where needed.
- **Calm (owner, from the Mac app's style):** system-like, brand blue `#2492FF` only on primary buttons, no blue outlines, one obvious next action per screen.
- **Motion:** short, purposeful, from motion tokens; respects reduced motion.
- **Accessibility:** WCAG 2.2 AA, full keyboard use, visible focus, ⌘K command menu.
- **Dark mode:** from tokens, following the system setting by default.

## 10. Text and language

- **i18n (owner):** next-intl from the first commit, English default and only locale. Locale in the route (`/[locale]/…`) so adding German later is translation, not refactoring.
- **Keys:** typed; a lint rule blocks literal UI strings in components.
- **Glossary (owner):** `docs/ux/glossary.md` is the source for every UI word; the message file uses glossary terms; a review check flags words outside it.
- **Email:** React Email templates, translated through the same messages.

## 11. Hosting and deploys

- **Where (owner):** Cloud Run with one warm instance (1 vCPU, 1 GB) and Cloud SQL Postgres Micro, europe-west3, project `snapmark-ai`. About $25 to $30 a month at list price before VAT, without any commitment discount (owner: no commitment for now; Cloud SQL Micro has none anyway).
- **Zero-downtime deploys (owner):**
  1. GitHub Actions builds the container and authenticates to Google Cloud through Workload Identity Federation (no keys).
  2. Database migrations follow expand and contract: a release only adds (columns, tables); removals ship in a later release once no running version uses them. Old and new app versions can always run against the same schema.
  3. The new revision deploys with no traffic, must pass a startup and a health probe, then receives 100% of traffic. The old revision keeps serving until the switch.
  4. Rollback is routing traffic back to the previous revision with one command; migrations never block it because of step 2.
- **Previews:** each PR deploys a tagged revision with its own address (`pr-<n>---…run.app`), no production traffic, against the shared staging database. Snapmark uses its own previews to verify feedback.
- **Environments:** local, preview, staging, production; production deploys from `main` only.
- **Secrets:** Secret Manager; nothing in the repo.
- **Domain:** to check whether Cloud Run domain mapping works in europe-west3; otherwise Firebase Hosting in front (not a load balancer at about $18 a month).

## 12. Quality and operations

- **Checks:** format, lint, typecheck, Vitest unit tests, Playwright end-to-end for the core flows (capture → feedback → decision → implementation → accept), run in CI on every PR.
- **Errors and analytics:** Sentry for errors; PostHog (EU) for product analytics, without session recordings of customer screens.
- **Audit:** every state change writes an `audit_events` row; organisations can export decisions per workspace (PDF and Markdown).
- **Security:** CSP and security headers, signed URLs for images, rate limits per user and per token, no customer URLs fetched server-side without an allow-list.
- **Privacy:** EU hosting, on-device redaction, export and deletion per user and per organisation, a data processing agreement template.
- **Decisions:** ADRs in `docs/designs/` as today.
- **Tracker:** GitHub Projects in the `pokbytes` organisation (owner), replacing Beads once set up.

## 13. Decided, left to the builder, open

**Decided by the owner:** sections 1, the first release (closed, waitlist and beta invites, two-way Mac sync), 4.2 rule, 5 (multi-organisation, roles, plans, seats bought first, guests need no seat, entitlements, retention), 6 methods and automatic linking, the stack in 9, i18n and glossary in 10, hosting without commitment and zero-downtime deploys in 11, GitHub Projects, Resend behind a provider interface.

**Claude's calls (revisit with a reason):** Better Auth, Drizzle, next-intl, Paddle, SSE for live updates, the package split, the MCP tool list, the details of the acceptance rule (4.2), GitHub read-only in the first release, domain joiners as guests, the session sync mechanics (7), PostHog and Sentry, Firebase Hosting for the domain.

**Open:**

1. **Name and domain** (owner is brainstorming), before the first deploy: moving to a new address later invalidates extension tokens, sign-in callbacks and MCP links. Until then, "Snapmark" is the working name.
2. **Linear:** not planned yet; the owner wants it bidirectional and more involved than creating tickets, to discuss as its own topic.
3. The order of work inside the first release (agreed in the plan).
