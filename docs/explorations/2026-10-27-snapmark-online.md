---
type: exploration
status: draft
created: 2026-10-27
author: Calvin Dudek
project: Snapmark
supersedes: none
---

# Snapmark online: team feedback on real UI, read by AI

**Short version.** One product, one shared unit (the session), three ways in: the Mac app captures anything on screen, a Chrome extension captures DOM elements with their code context, and a web app is where the team talks, requests changes and verifies them. An AI agent reads and updates the same sessions through a remote MCP server. Feedback anchors to a **screenshot** (what the reviewer saw, never changes) plus **code hints** (selector, component, file:line, repo, branch) that help the agent find the code. Storage is cheap: about $0.05 to $0.40 per active user per month. Postgres beats a document store for this data. The owner's decisions are in section 9. Specifications come later.

## 1. What the owner wants

- A team comments on real UI together: pick an element (like pressing 1 and annotating today), it is screenshotted, and a conversation hangs off it.
- Draw on it, comment, request a change.
- The AI reads the feedback through MCP (a link or a session), implements, and marks each request "implemented".
- A human (developer or reviewer) checks each implemented request and confirms or reopens it.
- Optional integrations: Linear and other trackers.
- Feedback references the code: a dev tool or package that knows the element, and on localhost which folder, branch or worktree is running.
- The local screenshot app stays: free or about $10 lifetime offline; the online service is a subscription of about $2 to $4 per person.

## 2. How the Mac app and the online service fit together

**The session is the shared unit.** Today a session is a local folder with `session.md` and screenshots. Online, the same session gets an id, a URL and members. Everything else hangs off it.

| Surface     | Captures                                                                                    | Works offline | Who uses it                |
| ----------- | ------------------------------------------------------------------------------------------- | ------------- | -------------------------- |
| Mac app     | Anything on screen (native apps, Figma, simulators, browsers)                               | Yes           | The owner, power users     |
| Chrome ext. | A DOM element or a region of a page, plus URL, selector, component, file:line, repo, branch | Local mode    | Whole team, any OS         |
| Web app     | Nothing new; review, discuss, request changes, verify                                       | No            | Whole team, PMs, clients   |
| MCP server  | Nothing; the agent lists, reads, replies, marks implemented                                 | No            | Claude Code, Codex, Cursor |

**Flows between them**

1. **Local stays local.** The Mac app works exactly as now, with no account. Sessions are folders the agent reads from disk.
2. **Share a session.** "Share" in the Mac app uploads it and returns a link. From then on the folder and the online session are the same session.
3. **Open an online session locally.** A `snapmark://session/<id>` link opens it in the Mac app and writes it into a local folder with `session.md`, so the offline agent workflow still works.
4. **Capture straight into an online session.** Both the Mac app and the extension can target "the current online session" instead of a local one.

**Recommendation:** build the online service around the Chrome extension and the web app first. That is where teams are, it works on Windows and Linux, and it is the only surface that can see the DOM. The Mac app becomes the power tool that can also publish. The roadmap's M1 to M6 stay as they are; this would be a separate project after them or in parallel.

## 3. Screenshot or code: what is the comment attached to?

Both, with different roles.

- **The screenshot is the record.** It is what the reviewer saw and it never changes. If the code changes or the element disappears, the comment still makes sense. This answers the owner's worry.
- **The anchor is a hint for the agent.** Stored as data next to the screenshot: page URL, CSS selector and DOM path, the element's text, bounding box, viewport size and device pixel ratio, and when available the component name and `file:line`, plus the repo, branch, commit and worktree.
- **Drawings are data, not pixels.** Arrows, boxes and numbered markers are stored as vector JSON on top of the original screenshot (as the editor already keeps in `.edit/NNN.json`). That keeps them editable by others and costs almost nothing in storage.
- **Verification uses a second screenshot.** When the agent marks a request implemented, it (or the reviewer, with one click) captures the same URL and element again. The web app shows before and after side by side, and the reviewer confirms or reopens.

## 4. Knowing which code is running

The browser cannot see the file system, so this needs help. Two ways, used together:

1. **The Mac app as a local bridge, no setup.** The extension asks the Mac app (Chrome native messaging) "who serves `localhost:5173`?" The Mac app finds the process listening on that port (`lsof -iTCP:5173 -sTCP:LISTEN`), its working directory, then `git rev-parse --show-toplevel`, the branch, the worktree and the remote. That gives repo, branch and worktree for any framework. Limits: a dev server inside Docker reports the Docker proxy, and staging or preview URLs are not local.
2. **A dev package for `file:line` precision.** A small Vite, Next.js or webpack plugin stamps `data-snapmark-src="src/Button.tsx:42"` on elements in development builds and adds a `<meta name="snapmark">` tag with repo, branch and commit. That also covers staging and preview deployments. React 19 removed the built-in source location (`_debugSource`), so a build plugin is the reliable way to get it. Existing tools (LocatorJS, Agentation, Vibe Annotations) do something similar.

Without either, the anchor still has URL, selector and text. That is enough for an agent to grep the code, just slower.

## 5. The change workflow

Each annotation with a request becomes a **change request** with a status:

`open` → `in progress` (agent claimed it) → `implemented` (agent, with commit SHA or PR URL and an after screenshot) → `verified` (human) or back to `open` (reopened, with a comment).

- Only a human can set `verified`.
- The agent replies in the thread like a team member ("Changed the padding to 16 px in `Card.tsx`, commit abc123").
- A session is done when every request is verified.

**MCP tools (first cut):** `list_sessions(repo?, branch?)`, `get_session(id_or_url)` (Markdown plus image URLs and anchors), `list_open_requests(repo, branch)`, `claim(request)`, `reply(thread, text)`, `mark_implemented(request, commit?, pr?, screenshot?)`. With `list_open_requests`, the agent needs no link: it reads the git remote and branch of its own folder and asks "what is open for this branch?"

**Linear:** not needed for the first version. The agent can already read Linear through Linear's own MCP. Later: "create Linear issue from this thread" and status sync both ways.

## 6. Pricing

**What the market charges** (from `docs/market/2026-10-25-pricing-research.md`): Jam.dev Team $14 per creator per month, Vynix Pro from $7 per seat, Annot $9 to $59 per month, Ruttl Pro $18 per user, Marker.io $39 for 3 seats, BugHerd $42 for 5 members. Local AI-feedback tools (Agentation, Vibe Annotations) are free.

**Conflict with the roadmap.** M6 currently says $12.99 one-off for the Mac app. A free app as the way into a paid team service is a different model. One of the two needs to be decided before M6.

**Payment fees decide the minimum price, not storage.** A merchant of record such as Paddle takes 5% plus $0.50 per transaction. On a single $2 seat billed monthly that is $0.60, so 30%. On a 5-seat workspace at $4 ($20 per month) it is 7.5%. On annual billing it is under 6%.

**Options**

1. **(recommended)** Mac app and extension free for local use. Online **Team at $4 per seat per month billed annually** ($48 per year), $5 billed monthly, billed per workspace. **Free online tier:** one workspace, up to 3 members, 30 days of history. This is the cheapest paid seat in the field, and it competes with the free tools on the free tier.
2. Mac app $10 to $12.99 one-off for the extra features (the roadmap's beautify, OCR, scrolling capture), extension free, online $4 per seat. More revenue per solo user, but two things to sell.
3. $2 per seat. It undercuts everyone, but fees take a large share on monthly plans, and it signals a toy. Not recommended.

## 7. Storage cost

**Measured, not guessed.** 80 real screenshots from `~/Documents/Snapmark` (mostly region captures, average 1,413 px wide):

| Format                             | Average size |
| ---------------------------------- | ------------ |
| PNG as saved today                 | 282 KB       |
| WebP quality 80, full size         | 44 KB        |
| WebP quality 80, 1,440 px wide     | 39 KB        |
| WebP thumbnail, 400 px wide        | 5 KB         |
| Full Retina screen (2,880 px), PNG | 1,624 KB     |
| Full Retina screen, WebP full size | 230 KB       |
| Full Retina screen, WebP 1,440 px  | 120 KB       |

WebP shrinks UI screenshots to about one sixth of PNG. For the calculation I use **250 KB per screenshot** (full-size Retina WebP plus thumbnail plus the after-screenshot share), about five times the measured average, to stay on the safe side.

**Prices used** (Google Cloud Storage, europe-west3, Standard class; check the current price page before deciding): storage about $0.023 per GB per month, internet egress about $0.12 per GB, uploads about $0.005 per 1,000. Cloudflare R2 as an alternative: about $0.015 per GB per month and no egress fee.

| Per active user per month        | Typical         | Heavy           |
| -------------------------------- | --------------- | --------------- |
| Screenshots taken                | 200             | 1,000           |
| Added storage                    | 50 MB           | 250 MB          |
| Stored after 12 months           | 0.6 GB → $0.014 | 3 GB → $0.07    |
| Views (team plus agent, 10 each) | 0.5 GB → $0.06  | 2.5 GB → $0.30  |
| Upload operations                | under $0.01     | under $0.01     |
| **Total**                        | **about $0.08** | **about $0.38** |

For 1,000 paying users at typical use: about $80 a month against about $4,000 in revenue at $4 per seat. Egress is the larger part, so a CDN in front (or R2) roughly halves it. Storage grows forever, so add a retention rule: move sessions to Nearline after 90 days without activity, and delete free-tier sessions after 30 days.

**Fixed costs matter more at the start.** API and MCP server on Cloud Run scale to zero (free tier covers early use). The database is the fixed cost: Cloud SQL's smallest Postgres is roughly $10 to $30 per month, Neon or Supabase start free.

## 8. Database: relational or document store?

The Google Cloud equivalent of DynamoDB is **Firestore** (a document store with real-time listeners). DynamoDB itself is AWS.

**This data is relational:** workspace → members → projects (repos) → sessions → screenshots → annotations → threads → comments, plus status history and integration links. The questions asked of it are joins and filters: "every open request for repo X, branch Y", "everything Anna has to verify", "how many requests per status in this session", "who may see this".

**Postgres (recommended)**

- Pros: those queries are plain SQL; permissions in one place (row-level security); migrations; annotation shapes and anchors go in `jsonb`, so the flexible parts stay flexible; easy to export and to move between hosts.
- Cons: real time needs extra work (Postgres `LISTEN/NOTIFY`, Supabase Realtime or ElectricSQL); Cloud SQL never scales to zero.

**Firestore**

- Pros: real-time updates out of the box (good for live comments); scales to zero with a free tier; client SDKs with offline cache.
- Cons: the queries above need denormalised copies and composite indexes; security rules get complex with roles; you pay per document read, so listing a busy session with comments can cost more than it looks; harder to report on.

**Suggested stack:** Postgres (Cloud SQL in europe-west3, or Neon or Supabase to start at $0) for data, Cloud Storage for images in the existing `snapmark-ai` project, Cloud Run for the API and the MCP server, and Supabase Realtime or plain WebSockets for live comments.

## 9. Decisions (owner, 2026-10-27)

Taken in dialog from the options above; each line names what was chosen over what.

1. **Mac app: free.** Mac app and extension are free for local use; money comes from online seats. Over $12.99 one-off, free plus a paid Pro unlock, and $10 lifetime. Roadmap M6 ($12.99 one-off) needs rewriting.
2. **Seat price: $4 per seat per month billed yearly ($48), $5 monthly, billed per workspace.** Free tier: one workspace, up to 3 members, 30 days of history. Over $7 per seat, $2 per seat and a flat workspace price.
3. **First build: Chrome extension, web app and MCP server, with the Mac app as the localhost bridge from day one** (owner: "we need the mac app too, for the server and localhost"). Over Mac app Share first and web-only.
4. **Database: Postgres**, with annotation shapes and anchors in `jsonb`. Over Firestore and Supabase.
5. **Hosting: Neon (Frankfurt) now, Cloud SQL later** with `pg_dump` when it pays. Over Cloud SQL from day one and Supabase.
6. **Verify: any human member, never the agent.** The requester is notified. Over requester-only and a reviewer role.
7. **Guests: free.** Guests view, comment and draw; paid seats capture, verify, invite and use MCP. Needs a guest cap or abuse rule. Over every-member-pays and read-only links.
8. **Retention:** free tier deleted after 30 days (with warning and export); paid sessions move to Nearline after 90 idle days and are **deleted 365 days after their last activity**. Over keep-forever and delete-when-verified.
9. **Redaction: required before launch.** Emails, keys and tokens are detected and pixelated on the device before upload, with undo per item. Reuses roadmap M4; the extension needs its own detector. Over a manual tool first and no redaction.
10. **Extension without the Mac app: works, fewer hints.** Capture and comment work on any OS; repo and branch come from the dev package or stay empty. Over Mac-app-required and a separate cross-platform helper.
11. **Name: Snapmark everywhere** (app, extension, Snapmark Team). Domain still to check. Over a pok bytes umbrella and deciding later.

**Still open:** Linear and GitHub integrations (scope and timing), auth provider, how live comments reach the browser, the guest cap.
