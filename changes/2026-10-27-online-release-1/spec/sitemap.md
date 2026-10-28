Lasting: moves to snapmark-web/docs/ux/sitemap.md in milestone 1.

# Snapmark online sitemap

Written by `omr-ux:sitemap-create proposed` (greenfield) on 2026-10-27 for change `2026-10-27-online-release-1`, from `spec/ia.md` (sitemap, screen inventory, move table), with page titles, tabs, header actions and states read from `spec/screens.md` and `spec/interaction.md`. Machine copy: `sitemap.json` beside this file. At the Stage 2 gate the product-level parts move to `snapmark-web/docs/ux/sitemap.md`.

## As built

None. `snapmark-web` has no routes yet (a README only), so there is no router to read and nothing is as built. Every route below is new and marked `proposed`. The Mac app's own sitemap stays in `docs/ux/sitemap.md` of this repo.

## Proposed

**Status: proposed, 2026-10-27.** Nothing here is accepted until a decision file in `docs/designs/` says so. Items marked **decide** are open choices; the alternative is named in one line. Labels are English only (the one locale of release 1). Roles: owner, admin, member, guest (inside an organisation), visitor (signed out), operator (a platform role, not an organisation role).

Locale rule: every route sits under `/[locale]` (next-intl), English is the default and only locale, and its prefix is hidden (`localePrefix: as-needed`). `/de/...` works later without moving a page. Release 1 serves everything from one local host; release 2 puts the public pages on the apex domain and everything else on `app.<domain>`, with the same paths. Pages below: 49 rows (44 pages built in release 1, 4 reserved routes that are not built, and the not-found page) and 6 surfaces outside the web router.

### The principles it rests on

| Principle                                                                                                                                                                 | What it forces here                                                                                                                                                                                                                                         |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| One address per object, in the form tenant, product, thing (`/[org]/[ws]/feedback/[n]`), as GitHub and Linear do (Jakob's Law)                                            | Two nesting levels where route convention RC-8 allows one. Written once here as a deliberate departure (finding F16)                                                                                                                                        |
| The sidebar is the tab set for a workspace's lists                                                                                                                        | The four status lists are path segments (`/open`, `/needs-decision`, `/in-review`, `/done`), not a `view` query. Convention RC-9 would put a named view in the query. Same reason, same finding F16                                                         |
| Tabs: a tab that is a place with its own title and primary action is a path segment; a tab that filters one list is a query param; a tab that switches a panel is `?tab=` | Settings and account tabs are paths. Inbox (`kind`), module and operator tabs (`status`), My Work and Members (`tab`) are queries. Panel tabs on the feedback view are `?tab=`. Switching any query tab replaces the history entry, so Back leaves the page |
| A list's search, filters, sort and named view live in the URL (nuqs); defaults are omitted                                                                                | A link, a reload and Back show the same list. `from` is the list's path and query; Load More stays out of the URL on purpose (F6, F8: fixed in spec)                                                                                                        |
| One canonical address per object; thread entries, decision requests and settings rows are fragments, never pages                                                          | `#entry-<id>`, `#decision-<id>`, `#member-<id>`, `#device-<id>`, `#<kind>-<id>`                                                                                                                                                                             |
| Create is a dialog without an address; the one create page is `/welcome`                                                                                                  | `/new` is reserved and unused in release 1; the dialogs Request a Decision, Post Version, Invite People and New Workspace add no history entry                                                                                                              |
| No access and not found look the same (404)                                                                                                                               | A link never reveals what exists; non-operators get 404 on `/operator/*`, guests get 404 on settings                                                                                                                                                        |
| Redirects are additive; a renamed slug keeps redirecting                                                                                                                  | Reserved slugs per level, old slugs reserved for good, and two parent redirects (F4, F5, F7: fixed in spec)                                                                                                                                                 |
| The sidebar keeps its order; new items join under Settings, never between Inbox and the workspaces                                                                        | Release 2 rows (billing, integrations, pages sub-navigation) have a place already                                                                                                                                                                           |
| A label is the route's word, except protocol endpoints                                                                                                                    | `/authorize` and `/device` keep OAuth names; the label is "Devices", the route's word (F9: fixed in spec)                                                                                                                                                   |

### Reserved first segments

`blog`, `privacy`, `terms`, `imprint`, `waitlist`, `sign-in`, `sign-out`, `invite`, `authorize`, `device`, `welcome`, `account`, `operator`, `api`, `mcp`, `internal`, `help`, `settings`, `new`, `.well-known` and every locale code (`en`, `de`). No organisation may take them as its slug. Reserved workspace slugs (second segment): `inbox`, `my-work`, `settings`, plus `billing`, `integrations`, `new`. A released organisation, workspace or module slug stays reserved to its first holder and redirects (F4, F5: fixed in spec).

### Public navigation

| #   | Item (en)               | Group  | Badge | Why here                                                   |
| --- | ----------------------- | ------ | ----- | ---------------------------------------------------------- |
| 1   | Sign In (header)        | head   | none  | Returning people go straight in (J8 leaves the form first) |
| 2   | Privacy, Terms, Imprint | footer | none  | Trust for the waitlist; lateral moves                      |

### App navigation (one sidebar for every app page)

| #   | Item (en)                                                                                   | Group                                                 | Badge                     | Why here                                                                   |
| --- | ------------------------------------------------------------------------------------------- | ----------------------------------------------------- | ------------------------- | -------------------------------------------------------------------------- |
| 1   | Organisation switcher                                                                       | top                                                   | none                      | One login, many organisations (freelancers, design 5)                      |
| 2   | Search (⌘K)                                                                                 | top                                                   | none                      | The command menu reaches every page below                                  |
| 3   | Inbox                                                                                       | none                                                  | count of new              | What needs me, first (Serial Position Effect); G I                         |
| 4   | My Work                                                                                     | none                                                  | none                      | What I asked for, what my copilot claimed; G M                             |
| 5   | Open, Needs Decision, In Review, Done                                                       | per workspace                                         | counts on the first three | The owner's sidebar: lists say what the team does next; G O, G D, G R, G X |
| 6   | Modules (expands in place; up to 7 by name in a fixed order, then All Modules)              | per workspace                                         | none                      | First sub-navigation level (A27)                                           |
| 7   | Sessions                                                                                    | per workspace, shown once the workspace has a session | none                      | Mac sessions (J7)                                                          |
| 8   | Settings                                                                                    | foot                                                  | none                      | Organisation settings; hidden for guests; G S                              |
| 9   | Avatar menu: Profile, Sign-In Methods, Devices, Notifications, Keyboard Shortcuts, Sign Out | foot                                                  | none                      | Account is per user, outside any organisation                              |

Narrow screens: the sidebar becomes a 56 px rail under 1100 CSS px (⌘\ toggles) and a drawer on a phone (top bar: Menu, page title).

**Command menu (⌘K):** every page above, feedback by number (`#42`), settings pages, switching organisation and actions on the current page.

**Gone from the navigation, and why:**

- Workspace settings: not in the sidebar. Ways in: the workspace name in Organisation Settings › Workspaces (visible), Modules › Manage Modules, a workspace's More menu and ⌘K (F2: fixed in spec).
- Sessions: hidden until a workspace has one, so an empty item never teases a feature.
- Billing and integrations: reserved routes, release 2.
- Audit events: data only, read through the thread and the operator pages.
- Agent (alias Copilot, A32): not an object, so no list or page; it appears as "via" on entries and under Devices.
- Blog: reserved, 404 until release 2.

### Operator navigation (own layout and sidebar, desktop only)

| #   | Item (en)            | Group | Badge | Why here                                                                     |
| --- | -------------------- | ----- | ----- | ---------------------------------------------------------------------------- |
| 1   | Waitlist             | none  | none  | The job (J8): invite in batches; the area's landing                          |
| 2   | Invitations          | none  | none  | Track, resend, revoke                                                        |
| 3   | Organisations        | none  | none  | Read-only; grant seats by hand                                               |
| 4   | Users                | none  | none  | Look a person up                                                             |
| 5   | Feature Flags        | none  | none  | Per-organisation switches; same label as the page title (F15: fixed in spec) |
| 6   | Usage                | none  | none  | Is the beta used                                                             |
| 7   | Back to App (header) | head  | none  | Returns to the last organisation's Inbox                                     |

### Settings

| #   | Entry (en)                | Route                               | What it holds                                                                   | Header primary                                                      |
| --- | ------------------------- | ----------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| 1   | Organisation > General    | `/[org]/settings/general`           | name, address, Leave Organisation                                               | none                                                                |
| 2   | Organisation > Members    | `/[org]/settings/members`           | seats, members, invitations                                                     | Invite People                                                       |
| 3   | Organisation > Workspaces | `/[org]/settings/workspaces`        | workspaces and their counts                                                     | New Workspace                                                       |
| 4   | Workspace > General       | `/[org]/[ws]/settings/general`      | name, address, Delete Workspace (owner)                                         | none                                                                |
| 5   | Workspace > Repos         | `/[org]/[ws]/settings/repos`        | linked GitHub repositories                                                      | Add Repo                                                            |
| 6   | Workspace > Environments  | `/[org]/[ws]/settings/environments` | kind, name, address patterns                                                    | Add Environment                                                     |
| 7   | Workspace > Route Rules   | `/[org]/[ws]/settings/route-rules`  | path to repo for microfrontends                                                 | Add Route Rule                                                      |
| 8   | Workspace > Modules       | `/[org]/[ws]/settings/modules`      | named parts of the product                                                      | Add Module                                                          |
| 9   | Account > Profile         | `/account/profile`                  | name, avatar, email                                                             | none                                                                |
| 10  | Account > Sign-In Methods | `/account/sign-in-methods`          | Email link only in release 1                                                    | none                                                                |
| 11  | Account > Devices         | `/account/devices`                  | devices, scopes, last use, Revoke Device; works on a phone except scope changes | Connect an Agent (dialog: MCP address, command, consent next; VF-6) |
| 12  | Account > Notifications   | `/account/notifications`            | email at once, daily digest                                                     | none                                                                |

### Public routes

| Route              | Label (en)         | Type   | Tabs -> header primary | Reached from                                                                                                                             | Serves                                                                                                                                                 |
| ------------------ | ------------------ | ------ | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/`                | Snapmark           | public | - -> Join the Waitlist | external: search, a shared link; /waitlist/joined: Back to Home; every public page: logo; 404 and invitation error pages: Go to Snapmark | J8, A17, A30: the waitlist form sits in the first screen (Goal-Gradient Effect).                                                                       |
| `/waitlist/joined` | You're on the list | public | - -> none              | /: Join the Waitlist                                                                                                                     | J8: confirm and set expectations (Peak-End Rule).                                                                                                      |
| `/privacy`         | Privacy            | public | - -> none              | footer of every public page: Privacy                                                                                                     | J8: trust; the waitlist needs legal pages.                                                                                                             |
| `/terms`           | Terms              | public | - -> none              | footer of every public page: Terms                                                                                                       | J8: trust; the waitlist needs legal pages.                                                                                                             |
| `/imprint`         | Imprint            | public | - -> none              | footer of every public page: Imprint                                                                                                     | J8: trust; the waitlist needs legal pages.                                                                                                             |
| `/blog`            | Blog               | public | - -> none              | none (reserved)                                                                                                                          | Design 9.3 first cut; reserved so no organisation can take the address. **decide:** Release 2. 404 until then; no navigation points here in release 1. |
| `/blog/[slug]`     | {title}            | public | - -> none              | none (reserved)                                                                                                                          | As /blog. **decide:** Release 2. 404 until then.                                                                                                       |

### Signing in and joining routes

| Route             | Label (en)                                   | Type   | Tabs -> header primary                                                                     | Reached from                                                                                                                                                                                                       | Serves                                                                                                                                                                                                                                                      |
| ----------------- | -------------------------------------------- | ------ | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/sign-in`        | Sign In to Snapmark                          | auth   | - -> Send Sign-In Link                                                                     | /: Sign In (header); any app link when signed out: with ?next=; external: extension and Mac app Sign In via consent; /sign-in/verify: failure with ?error=; /sign-out: Sign Out; /sign-in/check: Use Another Email | A7, A20: one account, email link in release 1.                                                                                                                                                                                                              |
| `/sign-in/check`  | Check Your Email                             | auth   | - -> none                                                                                  | /sign-in: Send Sign-In Link; /invite/[token]: Continue with Email                                                                                                                                                  | A20: release 1 prints the link to the terminal; reload keeps the state.                                                                                                                                                                                     |
| `/sign-in/verify` | Verifying the link                           | auth   | - -> none                                                                                  | email: sign-in link; external: terminal print in release 1                                                                                                                                                         | A7, A20: no UI beyond a spinner.                                                                                                                                                                                                                            |
| `/invite/[token]` | Join {organisation} / Set Up Your Team       | auth   | - -> Join {organisation} or Set Up Your Team (signed in), Continue with Email (signed out) | email: invitation email; email: waitlist invitation email                                                                                                                                                          | J10: join with the right role. Two variants: organisation invitation and waitlist invitation ("Set Up Your Team", then /welcome), each with its own states: default, expired, revoked, already a member or already has an organisation (F1: fixed in spec). |
| `/authorize`      | Allow {client} to use your Snapmark account? | auth   | - -> Allow                                                                                 | external: extension Sign In; external: MCP client                                                                                                                                                                  | J11, J9, A28: scopes chosen at consent, Read only by default.                                                                                                                                                                                               |
| `/device`         | Allow {client} to use your Snapmark account? | auth   | - -> Allow                                                                                 | external: Mac app Settings > Online > Sign In                                                                                                                                                                      | J7, J11: device flow for the Mac app.                                                                                                                                                                                                                       |
| `/welcome`        | A home for your team's decisions.            | create | - -> Create Organisation                                                                   | /sign-in/verify: first sign-in of a waitlist invitee with an unused invitation, no organisation (anyone else with no organisation sees "You're not in an organisation right now.")                                 | J10, A30: first run.                                                                                                                                                                                                                                        |
| `/sign-out`       | Sign Out                                     | auth   | - -> none                                                                                  | avatar menu: Sign Out; command-menu: Actions                                                                                                                                                                       | A7: one Sign In / Sign Out pair everywhere. **decide:** What a GET visit does is not specified. Recommended: redirect to /sign-in without ending the session (a link must not sign people out).                                                             |

### App routes (organisation and workspace)

| Route                               | Label (en)                          | Type     | Tabs -> header primary                                                                                                        | Reached from                                                                                                                                                                                                                                                                                       | Serves                                                                                                                                                                                                                                                                                                                       |
| ----------------------------------- | ----------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/[org]/inbox`                      | Inbox                               | list     | - -> none (kind chips All, Decisions, Reviews, Questions, Mentions, Answers filter the list, URL `kind`)                      | sidebar: Inbox (count, G I); email: notification and digest mails; /[org]: 308; /sign-in/verify: sign-in; /invite/[token]: Join; 404 page: Go to Inbox; /operator/*: Back to App; command-menu: Go To                                                                                              | J2, J4, J6, design 9.4: what needs me, empty it (no primary: an empty Inbox is the goal).                                                                                                                                                                                                                                    |
| `/[org]/my-work`                    | My Work                             | list     | Asked by Me -> none; Claimed by My Agent -> none                                                                              | sidebar: My Work (G M); command-menu: Go To                                                                                                                                                                                                                                                        | J3, J4: asked and claimed in one place.                                                                                                                                                                                                                                                                                      |
| `/[org]/[ws]/open`                  | Open                                | list     | - -> none                                                                                                                     | sidebar workspace block: Open (count); command-menu: Go To; /[org]/[ws]/feedback/[n]: list segment of the feedback view breadcrumb; /[org]/[ws]: 308 from the workspace address; /welcome: Create Organisation lands here, empty                                                                   | J1, J2, J4: the default list; holds Open and In Progress with flags as chips.                                                                                                                                                                                                                                                |
| `/[org]/[ws]/needs-decision`        | Needs Decision                      | list     | - -> none                                                                                                                     | sidebar workspace block: Needs Decision (count); command-menu: Go To; /[org]/[ws]/feedback/[n]: list segment of the feedback view breadcrumb                                                                                                                                                       | J2: feedback with an open decision request.                                                                                                                                                                                                                                                                                  |
| `/[org]/[ws]/in-review`             | In Review                           | list     | - -> none                                                                                                                     | sidebar workspace block: In Review (count); command-menu: Go To; /[org]/[ws]/feedback/[n]: list segment of the feedback view breadcrumb                                                                                                                                                            | J4: implementations awaiting review.                                                                                                                                                                                                                                                                                         |
| `/[org]/[ws]/done`                  | Done                                | list     | - -> none                                                                                                                     | sidebar workspace block: Done (count); command-menu: Go To; /[org]/[ws]/feedback/[n]: list segment of the feedback view breadcrumb                                                                                                                                                                 | J1, J4: accepted feedback keeps who asked, decided and approved.                                                                                                                                                                                                                                                             |
| `/[org]/[ws]/modules`               | Modules                             | list     | - -> none (a Manage Modules link to /settings/modules)                                                                        | sidebar workspace block: Modules > All Modules; command-menu: Go To                                                                                                                                                                                                                                | A13, A27: the first sub-navigation level; browse only. Adding, renaming and deleting live at /settings/modules (F3: fixed in spec).                                                                                                                                                                                          |
| `/[org]/[ws]/modules/[module]`      | {module}                            | list     | - -> none (status chips Open, Needs Decision, In Review, Done filter the list, URL `status`)                                  | sidebar Modules: up to 7 modules by name; /modules: row; /[org]/[ws]/feedback/[n]: module chip; command-menu: Go To                                                                                                                                                                                | A13, A27. No header primary on any status: the actions happen on the feedback (F14: fixed in spec).                                                                                                                                                                                                                          |
| `/[org]/[ws]/feedback/[n]`          | {title}                             | record   | Thread -> none; Details -> none (the panel footer acts: Approve v{n} when an implementation awaits review, else Comment)      | every workspace list, Inbox, My Work, Session view: row click or Enter; email: mention, decision, review, answer mails; external: extension 'Open' (new tab), MCP links; /[org]/[ws]/feedback/[n]: Previous and Next (J and K) within the list in from; command-menu: feedback by number, like #42 | J1, J2, J4, J5, J9: the product's centre; one canonical address per feedback. `from` carries the list's path and query string, encoded; Copy Link drops it; with no `from`, the breadcrumb uses the list that matches the status (F6: fixed in spec). Header primary = none by decision: one place to act, the panel footer. |
| `/[org]/[ws]/sessions`              | Sessions                            | list     | - -> none                                                                                                                     | sidebar workspace block: Sessions (only with 1+ session); command-menu: Go To                                                                                                                                                                                                                      | J7, A26: see a Mac session as the team sees it.                                                                                                                                                                                                                                                                              |
| `/[org]/[ws]/sessions/[id]`         | {session}                           | record   | - -> none                                                                                                                     | /sessions: session row; /[org]/[ws]/feedback/[n]: session link in Details; external: Mac app: View Online                                                                                                                                                                                          | J7, A26.                                                                                                                                                                                                                                                                                                                     |
| `/[org]/[ws]/settings/general`      | {workspace} Settings: General       | settings | General -> none; Repos -> Add Repo; Environments -> Add Environment; Route Rules -> Add Route Rule; Modules -> Add Module     | sidebar workspace header More: Workspace Settings; workspace list header More: Workspace Settings; sibling settings tab: General; command-menu: Settings; /[org]/[ws]/settings: to general                                                                                                         | J10. Visible way in: the workspace name in Organisation Settings › Workspaces (F2: fixed in spec).                                                                                                                                                                                                                           |
| `/[org]/[ws]/settings/repos`        | {workspace} Settings: Repos         | settings | General -> none; Repos -> Add Repo; Environments -> Add Environment; Route Rules -> Add Route Rule; Modules -> Add Module     | sidebar workspace header More: Workspace Settings; workspace list header More: Workspace Settings; sibling settings tab: Repos; command-menu: Settings                                                                                                                                             | J10, J5: the repo behind a capture.                                                                                                                                                                                                                                                                                          |
| `/[org]/[ws]/settings/environments` | {workspace} Settings: Environments  | settings | General -> none; Repos -> Add Repo; Environments -> Add Environment; Route Rules -> Add Route Rule; Modules -> Add Module     | sidebar workspace header More: Workspace Settings; workspace list header More: Workspace Settings; sibling settings tab: Environments; command-menu: Settings                                                                                                                                      | A16, J5.                                                                                                                                                                                                                                                                                                                     |
| `/[org]/[ws]/settings/route-rules`  | {workspace} Settings: Route Rules   | settings | General -> none; Repos -> Add Repo; Environments -> Add Environment; Route Rules -> Add Route Rule; Modules -> Add Module     | sidebar workspace header More: Workspace Settings; workspace list header More: Workspace Settings; sibling settings tab: Route Rules; command-menu: Settings                                                                                                                                       | J5.                                                                                                                                                                                                                                                                                                                          |
| `/[org]/[ws]/settings/modules`      | {workspace} Settings: Modules       | settings | General -> none; Repos -> Add Repo; Environments -> Add Environment; Route Rules -> Add Route Rule; Modules -> Add Module     | sidebar workspace header More: Workspace Settings; workspace list header More: Workspace Settings; sibling settings tab: Modules; command-menu: Settings; sidebar 'No modules yet' line: Workspace Settings > Modules                                                                              | A13. The one place that adds, renames and deletes modules; reached also from Modules › Manage Modules (F3: fixed in spec).                                                                                                                                                                                                   |
| `/[org]/settings/general`           | {organisation} Settings: General    | settings | General -> none; Members -> Invite People; Workspaces -> New Workspace                                                        | sidebar: Settings (G S); sibling tab: General; command-menu: Settings; /[org]/settings: to general                                                                                                                                                                                                 | J10.                                                                                                                                                                                                                                                                                                                         |
| `/[org]/settings/members`           | {organisation} Settings: Members    | settings | General -> none; Members -> Invite People; Workspaces -> New Workspace (sub-tabs Members and Invitations share Invite People) | sibling tab: Members; sidebar: Settings; command-menu: Settings, Invite People; workspace empty state: Invite People                                                                                                                                                                               | J10, design 5: roles and seats.                                                                                                                                                                                                                                                                                              |
| `/[org]/settings/workspaces`        | {organisation} Settings: Workspaces | settings | General -> none; Members -> Invite People; Workspaces -> New Workspace                                                        | sibling tab: Workspaces; command-menu: Settings                                                                                                                                                                                                                                                    | J10. Each workspace name links to its settings (F2: fixed in spec).                                                                                                                                                                                                                                                          |
| `/[org]/settings/billing`           | Billing                             | settings | - -> none                                                                                                                     | none (reserved)                                                                                                                                                                                                                                                                                    | Design 5: billing is release 2. **decide:** Release 2. Not in the release-1 navigation.                                                                                                                                                                                                                                      |
| `/[org]/settings/integrations`      | Integrations                        | settings | - -> none                                                                                                                     | none (reserved)                                                                                                                                                                                                                                                                                    | Release 2. **decide:** Release 2. Not in the release-1 navigation.                                                                                                                                                                                                                                                           |

### Account routes

| Route                      | Label (en)      | Type    | Tabs -> header primary                                                                                          | Reached from                                                                                                                                                                  | Serves                                                               |
| -------------------------- | --------------- | ------- | --------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `/account/profile`         | Profile         | account | Profile -> none; Sign-In Methods -> none; Devices -> none; Notifications -> none                                | avatar menu: Profile; sibling tab: Profile; command-menu: Settings; /account: to profile                                                                                      | J6.                                                                  |
| `/account/sign-in-methods` | Sign-In Methods | account | Profile -> none; Sign-In Methods -> none; Devices -> none; Notifications -> none                                | avatar menu: Sign-In Methods; sibling tab: Sign-In Methods; command-menu: Settings                                                                                            | A7.                                                                  |
| `/account/devices`         | Devices         | account | Profile -> none; Sign-In Methods -> none; Devices -> Connect an Agent (dialog, no route); Notifications -> none | avatar menu: Devices; sibling tab: Devices; command-menu: Settings; My Work Claimed empty state: Connect an Agent (opens the dialog in place); command-menu: Connect an Agent | J11, A28. Label "Devices", as the glossary says (F9: fixed in spec). |
| `/account/notifications`   | Notifications   | account | Profile -> none; Sign-In Methods -> none; Devices -> none; Notifications -> none                                | avatar menu: Notifications; sibling tab: Notifications; command-menu: Settings                                                                                                | design 9.4.                                                          |

### Operator routes

| Route                          | Label (en)     | Type   | Tabs -> header primary                                                                                                               | Reached from                                                                    | Serves                                                                                    |
| ------------------------------ | -------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `/operator/waitlist`           | Waitlist       | list   | - -> Invite {n} (only with a selection); status chips All, Waiting, Invited, Joined (default Waiting) filter the list (URL `status`) | operator sidebar: Waitlist; /operator: to waitlist; /operator/invitations: none | J8, A17: invitations go out in batches.                                                   |
| `/operator/invitations`        | Invitations    | list   | Sent -> none; Accepted -> none; Expired -> none; Revoked -> none; All -> none                                                        | operator sidebar: Invitations                                                   | J8. One way in, accepted for a staff area (F13: left for owner, owner-decisions.md #28).  |
| `/operator/organisations`      | Organisations  | list   | - -> none                                                                                                                            | operator sidebar: Organisations; /operator/users/[id]: organisation link        | J10, J8.                                                                                  |
| `/operator/organisations/[id]` | {organisation} | record | - -> Change Seats                                                                                                                    | /operator/organisations: row; /operator/users/[id]: organisation link           | J10: seats granted by hand (design 2).                                                    |
| `/operator/users`              | Users          | list   | - -> none                                                                                                                            | operator sidebar: Users                                                         | J8. One way in, accepted for a staff area (F13: left for owner, owner-decisions.md #28).  |
| `/operator/users/[id]`         | {name}         | record | - -> none                                                                                                                            | /operator/users: row; /operator/organisations/[id]: member row                  | J8.                                                                                       |
| `/operator/flags`              | Feature Flags  | list   | - -> none                                                                                                                            | operator sidebar: Feature Flags                                                 | A17. One way in, accepted for a staff area (F13: left for owner, owner-decisions.md #28). |
| `/operator/usage`              | Usage          | list   | Last 7 Days -> none; Last 30 Days -> none                                                                                            | operator sidebar: Usage                                                         | J8. One way in, accepted for a staff area (F13: left for owner, owner-decisions.md #28).  |

### Not found

| Route | Label (en) | Type  | Tabs -> header primary             | Reached from                        | Serves                                                                                                                                                                                              |
| ----- | ---------- | ----- | ---------------------------------- | ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `*`   | Not found  | error | - -> Go to Inbox or Go to Snapmark | any unknown route or no access: 404 | Safety: a link never reveals what exists; checklist 'helpful not-found'. Rendered inside the shell of the area the person may see (app, operator), else the plain public page (F11: fixed in spec). |

### Surfaces outside the web router

The extension and the Mac app have screens, not addresses. They are listed so the journeys close; state tables are in `sitemap.json` under `surfaces`.

| Surface                                        | Purpose                                        | Reached from                  | Goes to                                    |
| ---------------------------------------------- | ---------------------------------------------- | ----------------------------- | ------------------------------------------ |
| Extension popup (extension)                    | Sign in, pick the workspace, start a capture   | Chrome toolbar icon; shortcut | extension.picker; /authorize               |
| Picker overlay (extension)                     | Point at an element or an area                 | popup Capture; shortcut ⌘⇧K   | extension.compose                          |
| Drawing and compose (extension)                | Mark up and say what you expect                | picker                        | extension.sent                             |
| Sent confirmation (extension)                  | Confirm with a link                            | compose                       | /[org]/[ws]/feedback/[n]; extension.picker |
| Settings > Online (mac)                        | Sign in to Snapmark online; bridge on or off   | Mac menu > Settings           | /device                                    |
| Share to Workspace sheet and sync status (mac) | Link a session to a workspace and see its sync | session window; menu bar menu | /[org]/[ws]/sessions/[id]                  |

### Pages whose content changes

None as built. The pages below changed in the spec on 2026-10-28 (fold-in of these findings).

| Page                                          | Change                                                            | Why |
| --------------------------------------------- | ----------------------------------------------------------------- | --- |
| `/invite/[token]`                             | add a waitlist variant "Set Up Your Team"                         | F1  |
| `/[org]/settings/workspaces`                  | each row links to that workspace's settings                       | F2  |
| `/[org]/[ws]/modules` and `/settings/modules` | `/modules` browses; `/settings/modules` adds, renames and deletes | F3  |
| `/[org]/[ws]/feedback/[n]`                    | `from` carries the list's query string; Copy Link drops it        | F6  |
| `/[org]/[ws]/modules/[module]`                | state the header primary (none)                                   | F14 |

### Redirects

Additive only: every old address keeps working, existing redirects stay, a chain is flattened to point straight at the final address (RC-12). Everything is new, so these are the redirects the design needs from day one.

| Old address                        | New address                    | Carries                                                                            |
| ---------------------------------- | ------------------------------ | ---------------------------------------------------------------------------------- |
| `/[org]`                           | `/[org]/inbox`                 | org; 308                                                                           |
| `/[org]/[ws]`                      | `/[org]/[ws]/open`             | org, ws; 308                                                                       |
| `/[org]/settings`                  | `/[org]/settings/general`      | org; 308                                                                           |
| `/[org]/[ws]/settings`             | `/[org]/[ws]/settings/general` | org, ws; 308                                                                       |
| `/account`                         | `/account/profile`             | nothing; 308                                                                       |
| `/operator`                        | `/operator/waitlist`           | nothing; 308                                                                       |
| `/[old-org]/[...rest]`             | `/[org]/[...rest]`             | rest, query; 308; a renamed organisation slug keeps redirecting                    |
| `/[org]/[old-ws]/[...rest]`        | `/[org]/[ws]/[...rest]`        | rest, query; 308; a renamed workspace slug keeps redirecting                       |
| `/[org]/[ws]/modules/[old-module]` | `/[org]/[ws]/modules/[module]` | query; 308; a renamed module slug keeps redirecting                                |
| `/[org]/[ws]/feedback`             | `/[org]/[ws]/open`             | org, ws; 308; proposed here, closes the missing parent of the feedback record (F7) |
| `/waitlist`                        | `/`                            | nothing; 308; proposed here, closes the missing parent of /waitlist/joined (F7)    |

Not redirects but listed for completeness: `/sign-in` for a signed-in visitor goes to `next` or the last organisation's Inbox; `/sign-in/verify` goes to `next`, `/welcome` or the Inbox, and on failure to `/sign-in?error=`; `/welcome` with an organisation goes to the Inbox; `/sign-out` goes to `/sign-in`.

### Mail and external links

Mail targets never change without a redirect that outlives every mail already sent (RC-13). The sign-in and invitation links are the two that carry a token.

| Mail or link                                   | Leads to (proposed)                      | Note                                                                          |
| ---------------------------------------------- | ---------------------------------------- | ----------------------------------------------------------------------------- |
| sign-in link (email)                           | `/sign-in/verify?token=`                 | Valid once, 15 minutes                                                        |
| invitation (organisation) (email)              | `/invite/[token]`                        | 7 days                                                                        |
| waitlist invitation (Set Up Your Team) (email) | `/invite/[token]`                        | 7 days; lands on the waitlist variant, "Set Up Your Team" (F1: fixed in spec) |
| mention (email)                                | `/[org]/[ws]/feedback/[n]#entry-[id]`    | -                                                                             |
| decision request (email)                       | `/[org]/[ws]/feedback/[n]#decision-[id]` | -                                                                             |
| review request (email)                         | `/[org]/[ws]/feedback/[n]?version=[v]`   | -                                                                             |
| answer (email)                                 | `/[org]/[ws]/feedback/[n]#entry-[id]`    | -                                                                             |
| daily digest (email)                           | `/[org]/inbox`                           | -                                                                             |
| extension sent confirmation: Open (external)   | `/[org]/[ws]/feedback/[n]`               | New tab                                                                       |
| extension Sign In (external)                   | `/authorize`                             | OAuth with PKCE                                                               |
| Mac app Sign In (external)                     | `/device?user_code=`                     | -                                                                             |
| Mac app: View Online (external)                | `/[org]/[ws]/sessions/[id]`              | -                                                                             |
| MCP responses (external)                       | `/[org]/[ws]/feedback/[n]`               | Links in agent output                                                         |

## Changes from as built

Everything is new. One row per area, with why.

| #   | Change                                                                            | Why (job story, law, owner's words, finding) | Findings             |
| --- | --------------------------------------------------------------------------------- | -------------------------------------------- | -------------------- |
| 1   | Public: landing with waitlist, confirmation, legal pages, reserved blog           | J8, A17, A30; Goal-Gradient Effect           | F7                   |
| 2   | Signing in and joining: email-link sign-in, invitation, first run, device consent | J10, J11, A7, A20, A28                       | F1, F12              |
| 3   | App: Inbox, My Work, four status lists, modules, feedback view, sessions          | J1, J2, J4, J6, J7, A13, A27                 | F3, F6, F8, F10, F14 |
| 4   | Settings: organisation (3 pages), workspace (5), account (4)                      | J10, J11, J5, A16, A28                       | F2, F9               |
| 5   | Operator: waitlist, invitations, organisations, users, flags, usage               | J8, A17                                      | F13, F15             |
| 6   | Redirects, reserved segments and slug rules                                       | RC-7, RC-12, RC-13                           | F4, F5, F7           |

## Checks

Run on all 49 page rows and 6 surfaces. Pages in `status: proposed` only; no router exists. Counts by impact: **High 1, Medium 5, Low 9, Design choice 1** (16 findings). After the fold-in on 2026-10-28, 13 are fixed in the spec and 3 are left for the owner (F10, F13, F16).

| Check                                                                 | Result                                                                                                                                                                                                            |
| --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SM-1 dead end                                                         | F12 (one assumption); every other page has a way on and a way back                                                                                                                                                |
| SM-2 orphan                                                           | pass. Exempt: `/blog`, `/blog/[slug]`, `/[org]/settings/billing`, `/[org]/settings/integrations` (reserved, not built); `/sign-in/verify`, `/authorize`, `/device` (entered from a mail or another app by design) |
| SM-3 fewer than two ways in, or none visible                          | F2, F13                                                                                                                                                                                                           |
| SM-4 one object at two addresses, one place named two ways            | F3, F9, F10                                                                                                                                                                                                       |
| SM-5 deeper than three levels below its area                          | pass: the deepest are `/[org]/[ws]/feedback/[n]`, `/modules/[module]`, `/sessions/[id]` and `/settings/<page>`, all three below the organisation                                                                  |
| SM-6 record without one canonical address                             | F3 (modules); every other record has one                                                                                                                                                                          |
| SM-7 label differs between navigation, breadcrumb, title              | F9, F15                                                                                                                                                                                                           |
| SM-8 tab with no decision on its header primary                       | F14                                                                                                                                                                                                               |
| SM-9 list state not in the URL                                        | F6, F8                                                                                                                                                                                                            |
| SM-10 breaks a route convention                                       | F4, F7, F8, F11, F16 (RC-1, RC-2, RC-3, RC-5, RC-7, RC-8, RC-9, RC-11, RC-14)                                                                                                                                     |
| SM-11 moved or removed address with no redirect, or a chain           | F5                                                                                                                                                                                                                |
| SM-12 mail or external link lands on a page other than its words name | F1                                                                                                                                                                                                                |

The same facts hold for every finding below: **Verified:** read in the spec (`spec/ia.md`, `spec/screens.md`, `spec/interaction.md`); no built UI exists, so nothing was seen on screen. **Owner's words:** no earlier request found, unless stated.

## Findings for the spec

Problems found in `spec/ia.md`; each carries the recommended fix. Folded into the spec on 2026-10-28: 13 fixed in spec, 3 left for owner (F10, F13, F16). Each finding says which.

### F1: The waitlist invitation mail leads to a page that says "Join {organisation}"

**Status: fixed in spec.** Waitlist variant of `/invite/[token]` with its own states: `screens.md` Invitation, `interaction.md` Invitation, `ia.md` Sitemap, Screen Inventory and Move Table, `microcopy.md` `auth.invitation.waitlist.*`.

- **Impact:** High. A prospect the operator invites lands on a page written for someone joining an existing organisation, on the single mail that turns a waitlist entry into a team (raised one level: a mail action).
- **Current experience:** The email button reads "Set Up Your Team" and the journey says invitation email, Sign In, Welcome. Its link is `/invite/[token]`. That page is titled "Join {organisation}" with the line "{inviter} invited you to {organisation} as a {role}", and its state table has no row for an invitation that has no organisation yet.
- **Visual:** Wording before: "Join {organisation}". Proposal: for a waitlist invitation the title reads "Set Up Your Team", the line "Sign in with {email} to name your organisation and first workspace.", the primary "Continue with Email" (signed out) or "Set Up Your Team" (signed in), then `/welcome`.
- **Recommendation:** Add a waitlist variant of `/invite/[token]` with its own states (default, expired, revoked, already has an organisation), and keep the route. Journey J10 already assumes it.
- **Tradeoff:** One more state table to design and test; the alternative, a second address such as `/join/[token]`, breaks the rule of one address per object.
- **Decision needed:** Is the waitlist invitation a variant of `/invite/[token]` (recommended) or its own address?
- **Verified:** read in the spec.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: `/invite/[token]`; email "Set Up Your Team"
- Broken: SM-12; B2B escalation (mail)
- Code: none yet. Spec: `screens.md` Invitation and Emails; `interaction.md` Invitation state table; `ia.md` Objects (Invitation) and Journeys (J10)
- Seen by: sitemap-create

</details>

### F2: Workspace settings has no visible way in

**Status: fixed in spec.** The workspace name in Organisation Settings › Workspaces links to its settings; Modules › Manage Modules is a second visible way in: `screens.md` Organisation settings, Modules; `ia.md` Screen Inventory, Move Table.

- **Impact:** Medium. Repos, Environments, Route Rules and the environment names the first capture depends on sit behind a menu, so an owner finishing first-run setup (J10) may never find them.
- **Current experience:** The ways in are the workspace header's More menu in the sidebar, the same menu in each list header, and ⌘K. Nothing visible on a page links there except the "No modules yet" line, and the Workspaces tab of the organisation settings lists workspaces with Feedback, Members with Access and Created columns but no link to each one's settings.
- **Visual:** Not applicable (no build). Proposal: in `/[org]/settings/workspaces` each workspace name links to `/[org]/[ws]/settings/general`.
- **Recommendation:** Make the workspace name in that table a link. No new sidebar item, so the sidebar order rule holds. The Open list's first-use empty state could also link to Environments once.
- **Tradeoff:** Two settings areas still exist; the link only makes the second findable.
- **Decision needed:** Link workspace rows to their settings (recommended), or add Workspace Settings to the sidebar?
- **Verified:** read in the spec.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: `/[org]/[ws]/settings/*`, `/[org]/settings/workspaces`
- Broken: SM-3 (a menu item and the command menu are not visible ways in)
- Code: none yet. Spec: `ia.md` Screen Inventory (workspace settings row); `screens.md` App shell Controls and Organisation settings Lists
- Law: Recognition rather than recall

</details>

### F3: Modules are listed and managed on two pages

**Status: fixed in spec, the other way round.** The IA already leaned to settings: `/[org]/[ws]/settings/modules` is the one place that adds, renames and deletes; `/[org]/[ws]/modules` is the browse list with a Manage Modules link. No redirect is needed. `screens.md` Modules and Workspace settings; `interaction.md` Modules (list); `ia.md` Sitemap.

- **Impact:** Medium. People can add a module at `/[org]/[ws]/modules` and at `/[org]/[ws]/settings/modules`, with the same primary button, so there is no single place to rename or delete one.
- **Current experience:** `/modules` has Add Module (primary, members) and a one-module page with More, Rename and Delete (admins). `/settings/modules` is a tab with Add Module, where members add and admins rename and delete. One list of objects, two addresses and two sets of rules.
- **Visual:** Not applicable. Proposal: `/modules` is the one list and the one place that adds, renames and deletes; the settings tab goes, and `/settings/modules` redirects there.
- **Recommendation:** Keep `/modules` as canonical and give its rows a More menu. Add `/[org]/[ws]/settings/modules` to `/[org]/[ws]/modules` as a redirect (listed under Redirects, marked decide). The "No modules yet" line links straight to `/modules`.
- **Tradeoff:** The settings tabs lose Modules; the owner designed it as part of workspace set-up (A13), so the rule that modules grow from use ("members may add") would need to be said on `/modules`.
- **Decision needed:** Keep one modules page (recommended) or keep both with one named canonical?
- **Verified:** read in the spec.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: `/[org]/[ws]/modules`, `/[org]/[ws]/settings/modules`
- Broken: SM-4, SM-6, RC-7
- Code: none yet. Spec: `ia.md` Sitemap rows for `modules` and `settings/modules`; `screens.md` Modules and Workspace settings

</details>

### F4: A workspace, locale or system name can collide with a fixed address

**Status: fixed in spec.** `ia.md` Sitemap conventions: `.well-known` and every locale code reserved as first segments; `inbox`, `my-work`, `settings` (and release-2 names) reserved as workspace slugs.

- **Impact:** Medium. An organisation that names a workspace "Inbox", "My Work" or "Settings" would shadow `/[org]/inbox`, `/[org]/my-work` or `/[org]/settings`, and an organisation slug "de" or "en" would shadow the locale prefix.
- **Current experience:** The reserved list covers only first segments (`blog`, `settings`, `new` and so on). Under `/[org]/` the second segment is either a fixed page or a workspace slug, and nothing reserves the fixed ones. `de` and `en` are not reserved although `/de/...` is planned. `.well-known` (OAuth and MCP discovery) is not reserved either.
- **Visual:** Not applicable. Proposal: add `inbox`, `my-work`, `settings` as reserved workspace slugs and `en`, `de` (every locale code) and `.well-known` as reserved first segments.
- **Recommendation:** Keep one reserved list per level and check it when a slug is typed (the Welcome error "{slug} is taken. Try {suggestion}." already exists).
- **Tradeoff:** A handful of names are unavailable.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the spec.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: slug fields in Welcome, Workspace settings General, Organisation settings
- Broken: SM-10 (RC-5, RC-7)
- Code: none yet. Spec: `ia.md` Sitemap conventions (reserved first segments)

</details>

### F5: A renamed slug can be taken by someone else, and old mail links then land in the wrong place

**Status: fixed in spec.** `ia.md` Sitemap conventions: an old slug stays reserved to its first holder for good and redirects with path and query.

- **Impact:** Medium. The design says an old slug keeps redirecting, but nothing stops another organisation or workspace taking the old slug afterwards, so a mail or MCP link sent earlier would open a different tenant's page (a 404 for a stranger, a wrong feedback for a member of both).
- **Current experience:** Mails carry `/[org]/[ws]/feedback/[n]`; MCP responses and the extension's confirmation do too. Those links outlive a rename only while the old slug stays reserved.
- **Visual:** Not applicable. Proposal: a released slug stays reserved to its first holder for good and redirects to the current one.
- **Recommendation:** Store old slugs with their object, refuse them in every slug check, and redirect with the rest of the path and the query (the Redirects table has the three rules).
- **Tradeoff:** Names are never freed.
- **Decision needed:** Reserve old slugs forever (recommended), or for a fixed period?
- **Verified:** read in the spec.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: `/[old-org]/...`, `/[org]/[old-ws]/...`, `/[org]/[ws]/modules/[old-module]`
- Broken: SM-11, RC-12, RC-13; B2B escalation (links sent in mail)
- Code: none yet. Spec: `ia.md` Sitemap conventions ("A renamed organisation, workspace or module slug keeps redirecting")

</details>

### F6: The list a feedback was opened from is not defined well enough to restore it

**Status: fixed in spec.** `ia.md` Sitemap (feedback query), Move Table and What Back restores: `from` is the list's encoded path and query; Copy Link drops it; with none, the list that matches the status.

- **Impact:** Medium. Previous and Next (J and K), the breadcrumb and Back are meant to return to the same filtered, sorted list, which only works if `?from=` carries that list's query string; as written it is "the list it was opened from".
- **Current experience:** The move table says the breadcrumb restores "filters from `from`" and J and K step "in `from`". If `from` is a name such as `open`, a reload or a shared link loses the filters and the order. A link copied from the page also carries `from`, so one feedback has many addresses. With no `from` (a mail link) the breadcrumb list is not defined.
- **Visual:** Not applicable. Proposal: `from` is the list's path plus its query string, percent-encoded (`?from=%2Facme%2Fweb%2Fopen%3Fmodule%3Dcheckout`); Copy Link and the Details link copy the address without it; with none, the breadcrumb uses the list that matches the status.
- **Recommendation:** Define `from` that way and say that it never changes what the page shows, only Back and Previous/Next.
- **Tradeoff:** Longer addresses on the feedback view; the sequence is still only stable while the list's data is.
- **Decision needed:** Is `from` the list's own query string (recommended) or a name with the filters held in history state only?
- **Verified:** read in the spec.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: `/[org]/[ws]/feedback/[n]?from=`
- Broken: SM-9, RC-7, RC-9
- Code: none yet. Spec: `ia.md` Move Table (rows "list > row click", "J / K", "breadcrumb List") and "What Back restores"

</details>

### F7: Two addresses have no parent page

**Status: fixed in spec.** Both redirects are in `ia.md` Sitemap and in the Redirects table above.

- **Impact:** Low. `/[org]/[ws]/feedback/[n]` has no list at `/[org]/[ws]/feedback`, and `/waitlist/joined` has none at `/waitlist`, so someone trimming the address gets a 404.
- **Current experience:** Records follow "list plus id" (RC-2) but the feedback list lives at four other addresses (`/open`, `/needs-decision`, `/in-review`, `/done`).
- **Visual:** Not applicable. Proposal: `/[org]/[ws]/feedback` redirects to `/[org]/[ws]/open`; `/waitlist` redirects to `/`.
- **Recommendation:** Add both redirects (they are in the Redirects table).
- **Tradeoff:** None worth naming.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the spec.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: `/[org]/[ws]/feedback`, `/waitlist`
- Broken: SM-10 (RC-1, RC-2)
- Code: none yet. Spec: `ia.md` Sitemap tables

</details>

### F8: A list filter is named `page`, and Load More has no place in the URL

**Status: fixed in spec.** The URL parameter is `path` (label "Page"); Load More stays out of the URL, written in `ia.md` What Back restores and `interaction.md` workspace lists.

- **Impact:** Low. In the kit's vocabulary a `page` query is pagination; here it filters by the address a screenshot was taken on, and the "Show 50 More" state is held in history only, so a reload shows the first 50 rows.
- **Current experience:** The workspace lists carry `module`, `page`, `kind`, `author`, `env`. The workspace lists and the Inbox load 50 rows, then "Show 50 More".
- **Visual:** Not applicable. Proposal: name the filter `path` in the URL (the label stays "Page"); keep Load More out of the URL and say so (a reload starts at the top, as the Back rule already restores scroll).
- **Recommendation:** Rename the parameter; record the Load More decision once under "What Back restores".
- **Tradeoff:** The URL word and the label differ for one filter.
- **Decision needed:** Rename the filter `path` (recommended), or keep `page`?
- **Verified:** read in the spec.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: `/[org]/[ws]/open` and the three other lists; Inbox
- Broken: SM-9, SM-10 (RC-9)
- Code: none yet. Spec: `ia.md` Sitemap query columns; `interaction.md` workspace lists, Partial state

</details>

### F9: The account page is called "Devices and Tokens" in the menu and "Devices" in the glossary and the address

**Status: fixed in spec.** "Devices" everywhere: `screens.md`, `ia.md`, `interaction.md`, `brief.md`, `microcopy.md`.

- **Impact:** Low. One place is named two ways, and the word the glossary rejects ("Token") is the one in the avatar menu, the tab, the empty state and the Revoke journey.
- **Current experience:** The alias table says "Device" is canonical and "Token" is rejected ("people see devices"). The route is `/account/devices`. The avatar menu, the tab and the My Work empty-state button read "Devices and Tokens"; the brief's visible success reads "Account > Devices".
- **Visual:** Wording before: "Devices and Tokens". After: "Devices".
- **Recommendation:** Rename the menu item, the tab and the button to "Devices"; keep the route.
- **Tradeoff:** Someone who looks for API tokens sees "Devices" first; the page's empty state explains it.
- **Decision needed:** Routine fix: no individual decision needed (the glossary already decided).
- **Verified:** read in the spec.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: avatar menu, `/account/devices` tab, My Work Claimed empty state
- Broken: SM-4, SM-7, glossary alias "Device / Token"
- Code: none yet. Spec: `ia.md` Alias Table; `screens.md` App shell Words and Account

</details>

### F10: One feature is "Copilot" in the glossary and "Agent" on three labels

**Status: left for owner** (`owner-decisions.md` #17). The spec keeps "Agent" on labels, the recommended default, and the alias table says so.

- **Impact:** Low. My Work's tab "Claimed by My Agent", its empty-state button "Connect an Agent" and its line "Your agent hasn't claimed anything yet." use the word the glossary keeps for running text only.
- **Current experience:** The alias table makes "Copilot" canonical, shown as "Ben via Claude", and allows "Agent" in running text only. Tab and button labels are not running text.
- **Visual:** Wording before: "Claimed by My Agent". After (if Copilot): "Claimed by My Copilot".
- **Recommendation:** Pick one word for labels. The owner's own sentence in the brief is "coding agent", so this may be a case for changing the glossary instead.
- **Tradeoff:** "Copilot" is a product name for other vendors; "Agent" matches how engineers talk.
- **Decision needed:** Is the label word "Copilot" (glossary) or "Agent" (current labels and the owner's phrasing)?
- **Resolved 2026-10-28:** A32 (owner: "Agent"). Labels say Agent; the thread says "{name} via {client}"; Copilot is an alias in the glossary (owner-decisions.md #17).
- **Verified:** read in the spec.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: `/[org]/my-work` tabs, empty state
- Broken: SM-4, glossary alias "Copilot"
- Code: none yet. Spec: `ia.md` Alias Table; `interaction.md` My Work

</details>

### F11: Which shell shows the 404 page is not defined per area

**Status: fixed in spec.** `interaction.md` 404 page: app and operator shells, else the plain page.

- **Impact:** Low. A signed-in organisation page that does not exist, an unknown operator page and a public page that does not exist should keep their own area and way back; one centred message with "Go to Inbox" does not.
- **Current experience:** One 404 with "Go to Inbox" (signed in) or "Go to Snapmark" (signed out). A non-operator must get an area-less 404 on `/operator/*`, so that case is right; an operator on an unknown operator page should stay in the operator shell with "Back to Waitlist".
- **Visual:** Not applicable.
- **Recommendation:** Render 404 inside each area's shell when the person may see that area; otherwise the plain page.
- **Tradeoff:** Three variants of a small page.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the spec.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: any unknown address
- Broken: SM-10 (RC-14)
- Code: none yet. Spec: `interaction.md` 404 page

</details>

### F12: An expired invitation has no stated way out

**Status: fixed in spec.** The Expired and Revoked callouts carry "Go to Snapmark", and the auth card's logo links home: `screens.md` and `interaction.md` Invitation.

- **Impact:** Low. The Expired state shows "This invitation has expired. Ask {inviter} to send a new one." with no action, and the page's header is not specified, so the person may be left on a page with no way on.
- **Current experience:** Revoked or invalid shows the 404 page ("Go to Snapmark"); Expired is a callout with "none" under actions.
- **Visual:** Not applicable. Proposal: a "Go to Snapmark" link in the callout.
- **Recommendation:** Add the link, or confirm that the auth card's logo links home.
- **Tradeoff:** None worth naming.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** assumption, not checked (the auth card's header is not specified).
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: `/invite/[token]`, state Expired
- Broken: SM-1 (assumption)
- Code: none yet. Spec: `interaction.md` Invitation state table

</details>

### F13: Four operator pages have one way in each

**Status: left for owner** (`owner-decisions.md` #28). The spec keeps one way in, the recommended default.

- **Impact:** Low. The Invitations, Users, Flags and Usage pages are reached only from the operator sidebar (a user's record is also reached from an organisation, but the Users list is not). For staff tools that is acceptable, and it is named so it stays a choice.
- **Current experience:** The operator layout has its own sidebar; whether it has the command menu is not specified.
- **Visual:** Not applicable.
- **Recommendation:** Say that the operator layout has ⌘K as the second way, or accept one way in for staff pages.
- **Tradeoff:** More to build for a staff area used by few people.
- **Decision needed:** Accept one way in for operator pages (recommended) or add ⌘K to the operator layout?
- **Verified:** read in the spec.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: `/operator/invitations`, `/operator/users`, `/operator/flags`, `/operator/usage`
- Broken: SM-3
- Code: none yet. Spec: `screens.md` Operator shell

</details>

### F14: One module's tabs have no stated header primary action

**Status: fixed in spec.** One module's header has no primary on any status; the statuses are chip filters: `screens.md` Modules and one module.

- **Impact:** Low. A module page has the tabs Open, Needs Decision, In Review and Done, and its header says only "More, Rename, Delete (admins)", so whether there is a primary action is undecided.
- **Current experience:** Every other tab set names its primary or "none" (Inbox none, Settings tabs one each, Account none). Modules (list) names Add Module.
- **Visual:** Not applicable.
- **Recommendation:** Write "none" for all four tabs: the actions happen on the feedback, and Add Module lives on the Modules list.
- **Tradeoff:** None.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the spec.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: `/[org]/[ws]/modules/[module]`
- Broken: SM-8
- Code: none yet. Spec: `screens.md` Modules and one module, Header

</details>

### F15: The operator navigation says "Flags" and its page title says "Feature Flags"

**Status: fixed in spec.** "Feature Flags" in the operator sidebar and the title: `screens.md` Operator shell, `ia.md` Navigation Tree, `microcopy.md` `operator.nav.flags`.

- **Impact:** Low. The sidebar label and the page title differ for the same place.
- **Current experience:** `operator.nav.*` reads "Flags"; the page header reads "Feature Flags"; the glossary object is "Feature flag".
- **Visual:** Wording before: "Flags" (menu) and "Feature Flags" (title). After: "Feature Flags" in both.
- **Recommendation:** Use the longer name in both; the sidebar has room.
- **Tradeoff:** One longer sidebar label.
- **Decision needed:** Routine fix: no individual decision needed.
- **Verified:** read in the spec.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: `/operator/flags`
- Broken: SM-7
- Code: none yet. Spec: `screens.md` Operator shell Words and Operator: Flags

</details>

### F16: Departures from the route conventions, recorded once

**Status: left for owner** (`owner-decisions.md` #29). The spec keeps all five departures, the recommended default.

- **Impact:** Design choice. No demonstrated problem; five rules in the route conventions are deliberately not followed, and each has a reason.
- **Current experience:** (1) RC-8: `/[org]/[ws]/feedback/[n]` nests two levels deep (tenant, workspace, record). (2) RC-9 and the tab rule: the four status lists are path segments, because the sidebar is the tab set. (3) RC-3: the first organisation is created at `/welcome`, not at `/new`. (4) RC-5: `/authorize` and `/device` use OAuth names while their titles say "Allow {client}…". (5) RC-11: the breadcrumb and the phone top bar show `#42`, a number people search for, next to or without the title.
- **Visual:** Not applicable.
- **Recommendation:** Keep all five and record them in `snapmark-web/docs/ux/sitemap.md` with the reasons in "The principles it rests on". Show the title beside `#{n}` in the phone top bar if there is room.
- **Tradeoff:** A reader of the conventions must read the exceptions.
- **Decision needed:** Accept the five departures (recommended), or name the ones to change?
- **Verified:** read in the spec.
- **Owner's words:** no earlier request found.

<details><summary>Supporting notes</summary>

- Where: whole app
- Broken: SM-10 (RC-3, RC-5, RC-8, RC-9, RC-11), named as departures
- Code: none yet. Spec: `ia.md` Sitemap conventions; `screens.md` Feedback view, Phone feedback view
- Other products: GitHub `/<org>/<repo>/issues/<n>`, Linear `/<team>/issue/<id>`: tenant first, number per container

</details>
