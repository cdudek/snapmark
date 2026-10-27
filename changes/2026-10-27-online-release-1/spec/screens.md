---
type: design-screens
change: 2026-10-27-online-release-1
created: 2026-10-27
status: draft, for the Stage 2 gate
---

# Screens

**Scope: release-scoped.** The message keys seed `snapmark-web/messages/en.json` and the extension's messages in milestone 1; the component inventory seeds `snapmark-kit/ui`.

## How to read this file

- **Words.** Every visible string has a proposed message key, `<area>.<screen>.<part>`. Shared words live under `common.*` (`common.actions.cancel`). `{name}` marks a value. Case follows the brief's recommendation: Title Case for buttons, menus, tabs, sidebar items, chips and headings; sentence case for messages, placeholders and body text. Marketing and welcome copy follows A30 (outcomes, never a feature list).
- **Components.** HeroUI components behind `snapmark-kit/ui` wrappers (A9, A24). Status: **new variant** = a HeroUI component behind a thin Snapmark wrapper, styled by tokens only (none exists yet; built in milestone 1); **missing** = a Snapmark component composed from HeroUI parts, to be built; **have** = exists today in the Mac app.
- **Colour.** System neutrals for surfaces and text; the brand blue `#2492FF` (`accent`) only on the one filled primary per region; no blue borders, links, icons or labels. Links are underlined neutral text. Keyboard focus shows the `focus` ring only on keyboard focus (WEB-9). Remove red stays the picker outline and remove marks only.
- **Sizes.** Control heights 32 / 40 / 48, radius 8 (12 for dialogs), control text 16, from tokens (design-system owner decisions). Hit areas 32 pointer, 44 touch.
- **Layout zoom.** "100 %" is a 1440 px window. "150 %" equals a 960 CSS px viewport. The design system caps desktop zoom at 130 %; 150 % is checked anyway so nothing clips.
- **Keys** follow WEB-8 and WEB-19: ⌘ on a Mac, Ctrl elsewhere. "Tab ↩" means the control is reached by Tab and pressed with ↩ or Space, with no own shortcut.

## Shared component inventory

| Component                                                          | Built from (HeroUI)                                     | Status                                 | Used on                                |
| ------------------------------------------------------------------ | ------------------------------------------------------- | -------------------------------------- | -------------------------------------- |
| Button (primary, default, light, danger)                           | Button                                                  | new variant                            | everywhere                             |
| TextField, EmailField                                              | Input                                                   | new variant                            | forms                                  |
| Textarea                                                           | Textarea                                                | new variant                            | composer, notes                        |
| Select                                                             | Select                                                  | new variant                            | roles, kinds, workspace pickers        |
| Autocomplete (module picker, people picker)                        | Autocomplete                                            | new variant                            | compose, decision dialog               |
| TagInput (emails)                                                  | Input + Chip                                            | missing                                | Invite People                          |
| Switch, Checkbox, CheckboxGroup, RadioGroup                        | same                                                    | new variant                            | settings, dialogs, decision card       |
| DatePicker                                                         | DatePicker                                              | new variant                            | due date                               |
| NumberInput                                                        | NumberInput                                             | new variant                            | seats                                  |
| Tabs                                                               | Tabs                                                    | new variant                            | inbox kinds, settings, panel tabs      |
| Modal (dialog, confirm)                                            | Modal                                                   | new variant                            | dialogs                                |
| Drawer (phone sidebar, phone sheets)                               | Drawer                                                  | new variant                            | phone only                             |
| Popover (filters)                                                  | Popover                                                 | new variant                            | filter chips                           |
| Dropdown (More menus, switcher)                                    | Dropdown                                                | new variant                            | rows, headers                          |
| Tooltip                                                            | Tooltip                                                 | new variant                            | every icon control                     |
| Kbd                                                                | Kbd                                                     | new variant                            | ⌘K in sidebar, menus, shortcuts list   |
| Avatar, AvatarGroup                                                | Avatar                                                  | new variant                            | rows, thread                           |
| Chip (status, flag, kind, Guest, filter)                           | Chip                                                    | new variant                            | lists, header, thread                  |
| Table                                                              | Table                                                   | new variant                            | settings, operator, modules            |
| Listbox                                                            | Listbox                                                 | new variant                            | command menu results, sidebar          |
| Breadcrumbs                                                        | Breadcrumbs                                             | new variant                            | feedback view, settings                |
| Alert (callout)                                                    | Alert                                                   | new variant                            | errors, notices                        |
| Skeleton, Spinner, Progress                                        | same                                                    | new variant                            | loading                                |
| Toast                                                              | ToastProvider + addToast                                | new variant                            | WEB-4                                  |
| Link                                                               | Link                                                    | new variant (neutral, underlined)      | text links                             |
| AppShell (sidebar, rail, phone drawer)                             | Listbox, Dropdown, Drawer, ScrollShadow                 | missing                                | app                                    |
| CommandMenu                                                        | Modal + Input + Listbox                                 | missing                                | ⌘K                                     |
| ShortcutsDialog                                                    | Modal + Table + Kbd                                     | missing                                | `?`                                    |
| EmptyState                                                         | Card-less stack: icon, heading, text, Button            | missing                                | every list                             |
| FilterBar                                                          | Input + Chip + Popover + Select                         | missing                                | lists                                  |
| FeedbackRow                                                        | Avatar, Chip, Image                                     | missing                                | lists, My Work, modules                |
| InboxRow                                                           | Avatar, Chip, Image, Button                             | missing                                | Inbox                                  |
| ScreenshotCanvas (view, compare, draw)                             | Fabric renderer from `snapmark-kit/annotations` + Image | missing                                | feedback view, session view, extension |
| DrawingToolbar                                                     | Button group, Tooltip                                   | have (Mac editor), new variant for web | extension, feedback view               |
| VersionTabs                                                        | Tabs                                                    | missing (tab with kind, author, PR)    | feedback view                          |
| ThreadEntry (comment, question, answer, review, vote, system line) | Avatar, Chip, Dropdown                                  | missing                                | thread                                 |
| Composer                                                           | Textarea, Button, Chip                                  | missing                                | feedback view, phone                   |
| DecisionCard                                                       | RadioGroup, Progress, AvatarGroup, Button               | missing                                | thread                                 |
| AcceptanceLine                                                     | text + Chip                                             | missing                                | feedback view                          |
| AnchorDetails                                                      | description list, Button (copy)                         | missing                                | Details tab, compose "Where"           |
| ActionBar (phone)                                                  | Button group, safe-area padding                         | missing                                | phone feedback view                    |
| ConsentCard                                                        | Card, Switch, Button                                    | missing                                | device consent                         |
| SeatLine                                                           | text + Progress                                         | missing                                | members, operator                      |
| StatTile                                                           | Card                                                    | missing                                | operator usage                         |
| ExtensionPopup, PickerOverlay, ComposePanel, SentPanel             | the same wrappers in a shadow root                      | missing                                | extension                              |

---

# Public

## Landing

### Purpose

Make a product team want early access and join the waitlist in the first screen (J8, A17, A30).

### Header

| Title                        | Tabs | Actions                                             |
| ---------------------------- | ---- | --------------------------------------------------- |
| Snapmark logo (links to `/`) | none | Sign In (light Button) or, signed in, Open Snapmark |

### Sections

| Order | Section                                    | Purpose                                                                                            |
| ----- | ------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| 1     | Hero: headline, subhead, waitlist form     | The outcome and the one action (Goal-Gradient Effect: the goal is in view)                         |
| 2     | Hero image                                 | A calm product picture: a screenshot with one reference and a thread (show a moment, voice rule 6) |
| 3     | Four outcomes                              | What the team's week feels like after (A30)                                                        |
| 4     | How it works                               | Features second, smaller type, answering "how?" only                                               |
| 5     | Closing call to action with the form again | The end of the page asks once more (Serial Position Effect)                                        |
| 6     | Footer                                     | Privacy, Terms, Imprint, ©                                                                         |

### Layout

| Zoom  | Columns                                                              | Widths                                       | Notes                                            |
| ----- | -------------------------------------------------------------------- | -------------------------------------------- | ------------------------------------------------ |
| 100 % | hero 2 columns (text, image); outcomes 2 × 2; how-it-works 3         | content max 1120 px, reading text max 640 px | form inline: field 320 + button                  |
| 150 % | hero 1 column (text, then image); outcomes 1 × 4; how-it-works 1 × 3 | full width minus 24 px gutters               | form stacks: field above button, both full width |
| Phone | 1 column                                                             | 16 px gutters                                | button 48 high                                   |

### Lists

| List | Columns | Sort | Empty |
| ---- | ------- | ---- | ----- |
| none |         |      |       |

### Controls

| Control           | Component          | Label                         | Key            | Disabled reason    | State source |
| ----------------- | ------------------ | ----------------------------- | -------------- | ------------------ | ------------ |
| Work email        | EmailField (Input) | "Work email"                  | Tab, ↩ submits | none               | form         |
| Role (optional)   | Select             | "What do you do? (optional)"  | Tab, Space     | none               | form         |
| Join the Waitlist | Button primary     | "Join the Waitlist"           | ↩              | busy while joining | request      |
| Sign In           | Button light       | "Sign In"                     | Tab ↩          | none               | session      |
| Footer links      | Link               | "Privacy", "Terms", "Imprint" | Tab ↩          | none               |              |

### Filters

| Filter | Default | Options | Clear behaviour |
| ------ | ------- | ------- | --------------- |
| none   |         |         |                 |

### Words

| Where                | Text                                                                                                                                                    | Key                                         |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| Page title           | "Snapmark: ship what your team meant"                                                                                                                   | `public.landing.meta.title`                 |
| Hero headline        | "Ship what your team meant."                                                                                                                            | `public.landing.hero.headline`              |
| Hero subhead         | "Point at what's off in the running product, decide together, and let your coding agent build the right thing the first time."                          | `public.landing.hero.subhead`               |
| Email label          | "Work email"                                                                                                                                            | `public.waitlist.email.label`               |
| Email placeholder    | "you@company.com"                                                                                                                                       | `public.waitlist.email.placeholder`         |
| Role label           | "What do you do? (optional)"                                                                                                                            | `public.waitlist.role.label`                |
| Role options         | "Product manager", "Designer", "Engineer", "Founder", "Agency", "Something else"                                                                        | `public.waitlist.role.options.*`            |
| Button               | "Join the Waitlist"                                                                                                                                     | `public.waitlist.submit`                    |
| Button busy          | "Joining…"                                                                                                                                              | `public.waitlist.submitting`                |
| Under the form       | "We invite teams in small groups."                                                                                                                      | `public.waitlist.note`                      |
| Outcome 1 heading    | "No more screenshot ping-pong."                                                                                                                         | `public.landing.outcomes.pingpong.heading`  |
| Outcome 1 text       | "Feedback stays on the thing it's about, with everything your engineer and their agent need to act on it."                                              | `public.landing.outcomes.pingpong.text`     |
| Outcome 2 heading    | "Decisions that stick."                                                                                                                                 | `public.landing.outcomes.decisions.heading` |
| Outcome 2 text       | "Weigh the options side by side, vote, and settle it. Months later, anyone can see what was decided, by whom, and why."                                 | `public.landing.outcomes.decisions.text`    |
| Outcome 3 heading    | "Your agent builds the right thing."                                                                                                                    | `public.landing.outcomes.agent.heading`     |
| Outcome 3 text       | "When work starts, your engineer's agent already knows what was asked, where it lives in the code, and what the team agreed. It never decides for you." | `public.landing.outcomes.agent.text`        |
| Outcome 4 heading    | "Keep work moving from anywhere."                                                                                                                       | `public.landing.outcomes.phone.heading`     |
| Outcome 4 text       | "Answer a question or approve a change from your phone between meetings, so nothing waits on you."                                                      | `public.landing.outcomes.phone.text`        |
| How it works heading | "How it works"                                                                                                                                          | `public.landing.how.heading`                |
| Step 1               | "Point at it. Click anything in your product in Chrome, or on your Mac, and say what you expect."                                                       | `public.landing.how.point`                  |
| Step 2               | "Decide together. Comment, compare versions and approve in one place."                                                                                  | `public.landing.how.decide`                 |
| Step 3               | "Hand it to your agent. Your engineer's coding agent picks up what was agreed and reports back when it's done."                                         | `public.landing.how.handoff`                |
| Closing heading      | "Be one of the first teams."                                                                                                                            | `public.landing.closing.heading`            |
| Closing text         | "Bring your team and the product you're building. We'll do the rest together."                                                                          | `public.landing.closing.text`               |
| Error: email         | "Enter an email address like name@company.com."                                                                                                         | `public.waitlist.errors.email`              |
| Error: server        | "Couldn't add you to the waitlist: Snapmark didn't answer. Your email is still here. Try again."                                                        | `public.waitlist.errors.server`             |
| Header               | "Sign In" / "Open Snapmark"                                                                                                                             | `public.nav.signIn` / `public.nav.openApp`  |
| Footer               | "Privacy", "Terms", "Imprint", "© {year} Snapmark"                                                                                                      | `public.footer.*`                           |
| Hero image alt       | "A screenshot of a checkout page with one numbered reference and a short thread beside it."                                                             | `public.landing.hero.imageAlt`              |

### Components

| Region         | Component                                 | Status  | Notes                                          |
| -------------- | ----------------------------------------- | ------- | ---------------------------------------------- |
| Header, footer | PublicHeader, PublicFooter (Link, Button) | missing | no session cookie on public pages (design 8.0) |
| Form           | WaitlistForm (Input, Select, Button)      | missing | used twice on the page                         |
| Outcomes       | text blocks on the page grid              | missing | no cards, no icons in boxes (calm)             |

## Waitlist confirmation

### Purpose

Say they are on the list and what happens next (J8, A30).

### Header

| Title | Tabs | Actions |
| ----- | ---- | ------- |
| Logo  | none | none    |

### Sections

| Order | Section | Purpose                                   |
| ----- | ------- | ----------------------------------------- |
| 1     | Message | The end of the flow, calm (Peak-End Rule) |

### Layout

| Zoom  | Columns   | Widths                   | Notes |
| ----- | --------- | ------------------------ | ----- |
| 100 % | 1 centred | 560 px                   |       |
| 150 % | 1         | full width minus gutters |       |

### Lists

| List | Columns | Sort | Empty |
| ---- | ------- | ---- | ----- |
| none |         |      |       |

### Controls

| Control      | Component | Label          | Key   | Disabled reason | State source |
| ------------ | --------- | -------------- | ----- | --------------- | ------------ |
| Back to Home | Link      | "Back to Home" | Tab ↩ | none            |              |

### Filters

None.

### Words

| Where              | Text                                                                                                                | Key                                 |
| ------------------ | ------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| Heading            | "You're on the list."                                                                                               | `public.waitlistJoined.heading`     |
| Text with email    | "We invite teams in small groups, so each one gets our full attention. We'll write to {email} when it's your turn." | `public.waitlistJoined.text`        |
| Text without email | "We invite teams in small groups, so each one gets our full attention. We'll write to you when it's your turn."     | `public.waitlistJoined.textNoEmail` |
| Link               | "Back to Home"                                                                                                      | `public.waitlistJoined.back`        |

### Components

| Region  | Component  | Status  | Notes                                                |
| ------- | ---------- | ------- | ---------------------------------------------------- |
| Message | text stack | missing | no illustration, no confetti (voice: no celebration) |

## Privacy, Terms, Imprint

### Purpose

Plain legal pages the waitlist needs (checklist content 8; J8).

### Header

| Title                           | Tabs | Actions |
| ------------------------------- | ---- | ------- |
| "Privacy" / "Terms" / "Imprint" | none | none    |

### Sections

| Order | Section                | Purpose                               |
| ----- | ---------------------- | ------------------------------------- |
| 1     | MDX text with headings | The legal text, provided by the owner |

### Layout

| Zoom  | Columns | Widths                   | Notes |
| ----- | ------- | ------------------------ | ----- |
| 100 % | 1       | 720 px reading column    |       |
| 150 % | 1       | full width minus gutters |       |

### Lists, Controls, Filters

None beyond the public header and footer.

### Words

| Where        | Text                          | Key                                          |
| ------------ | ----------------------------- | -------------------------------------------- |
| Titles       | "Privacy", "Terms", "Imprint" | `public.legal.{privacy,terms,imprint}.title` |
| Body         | owner-provided MDX            | content files, not message keys              |
| Updated line | "Last updated {date}"         | `public.legal.updated`                       |

### Components

| Region | Component                         | Status  | Notes |
| ------ | --------------------------------- | ------- | ----- |
| Body   | Prose (MDX with token typography) | missing |       |

## Emails

### Purpose

The three emails release 1 prints to the terminal (A20), written at A30 level in the headline and plain in the facts.

### Words

| Where                                      | Text                                                                                                                                              | Key                                                     |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| Sign-in subject                            | "Your Snapmark sign-in link"                                                                                                                      | `email.signIn.subject`                                  |
| Sign-in headline                           | "Pick up where your team left off."                                                                                                               | `email.signIn.headline`                                 |
| Sign-in text                               | "Here's your link to sign in. It works once, for 15 minutes."                                                                                     | `email.signIn.text`                                     |
| Sign-in button                             | "Sign In to Snapmark"                                                                                                                             | `email.signIn.button`                                   |
| Sign-in footer                             | "Didn't ask for this? You can ignore this email; nobody can sign in without the link."                                                            | `email.signIn.footer`                                   |
| Unknown email text                         | "There's no Snapmark account for this email yet. Join the waitlist and we'll invite you."                                                         | `email.signIn.unknown`                                  |
| Invitation subject                         | "{inviter} invited you to {organisation} on Snapmark"                                                                                             | `email.invite.subject`                                  |
| Invitation headline                        | "Decide together, and ship what you meant."                                                                                                       | `email.invite.headline`                                 |
| Invitation text                            | "{inviter} wants you in {organisation} as a {role}. Point at what matters, weigh the options together, and see it built the way the team agreed." | `email.invite.text`                                     |
| Invitation button                          | "Join {organisation}"                                                                                                                             | `email.invite.button`                                   |
| Invitation expiry                          | "This invitation works for 7 days."                                                                                                               | `email.invite.expiry`                                   |
| Waitlist invitation subject                | "It's your turn on Snapmark"                                                                                                                      | `email.waitlistInvite.subject`                          |
| Waitlist invitation headline               | "Your team's spot is ready."                                                                                                                      | `email.waitlistInvite.headline`                         |
| Waitlist invitation text                   | "Bring your team, point at what matters in your product, and let your agent build the right thing the first time."                                | `email.waitlistInvite.text`                             |
| Waitlist invitation button                 | "Set Up Your Team"                                                                                                                                | `email.waitlistInvite.button`                           |
| Mention, decision, review, answer subjects | "{name} mentioned you on #{n}" · "{name} asked you to decide on #{n}" · "#{n} is ready for your review" · "{name} answered your question on #{n}" | `email.notify.{mention,decision,review,answer}.subject` |

### Components

| Region    | Component                                                                 | Status  | Notes |
| --------- | ------------------------------------------------------------------------- | ------- | ----- |
| Templates | React Email with tokens, translated through the same messages (design 12) | missing |       |

---

# App: signing in and joining

## Sign in, Check your email, Verify

### Purpose

Send a sign-in link and say where it went (A7, A20).

### Header

| Title                                      | Tabs | Actions |
| ------------------------------------------ | ---- | ------- |
| "Sign In to Snapmark" / "Check Your Email" | none | none    |

### Sections

| Order | Section                       | Purpose                                                                                               |
| ----- | ----------------------------- | ----------------------------------------------------------------------------------------------------- |
| 1     | Callout (only with `?error=`) | Explain the bad link                                                                                  |
| 2     | Email field and button        | The one action                                                                                        |
| 3     | Release-2 slot                | Reserved space below the button for "Continue with Google / GitHub"; empty and not drawn in release 1 |

### Layout

| Zoom  | Columns   | Widths                             | Notes      |
| ----- | --------- | ---------------------------------- | ---------- |
| 100 % | 1 centred | 400 px                             | logo above |
| 150 % | 1         | 400 px or full width minus gutters |            |

### Lists

None.

### Controls

| Control           | Component                  | Label               | Key                  | Disabled reason                | State source |
| ----------------- | -------------------------- | ------------------- | -------------------- | ------------------------------ | ------------ |
| Email             | EmailField                 | "Email"             | autofocus, ↩ submits | none                           | form         |
| Send Sign-In Link | Button primary, full width | "Send Sign-In Link" | ↩                    | busy while sending             | request      |
| Use Another Email | Button default             | "Use Another Email" | Tab ↩                | none                           |              |
| Send Again        | Button light               | "Send Again"        | Tab ↩                | "Send again in {n} s" for 30 s | timer        |

### Filters

None.

### Words

| Where             | Text                                                                              | Key                                    |
| ----------------- | --------------------------------------------------------------------------------- | -------------------------------------- |
| Title             | "Sign In to Snapmark"                                                             | `auth.signIn.title`                    |
| Email label       | "Email"                                                                           | `auth.signIn.email.label`              |
| Email placeholder | "you@company.com"                                                                 | `auth.signIn.email.placeholder`        |
| Button            | "Send Sign-In Link"                                                               | `auth.signIn.submit`                   |
| Busy              | "Sending…"                                                                        | `auth.signIn.submitting`               |
| Not invited yet   | "New here? Join the waitlist." (link to `/`)                                      | `auth.signIn.waitlist`                 |
| Error: email      | "Enter an email address like name@company.com."                                   | `auth.signIn.errors.email`             |
| Error: expired    | "This sign-in link has expired. Links work for 15 minutes. Send a new one below." | `auth.signIn.errors.expired`           |
| Error: used       | "This sign-in link was already used. Each link works once. Send a new one below." | `auth.signIn.errors.used`              |
| Error: invalid    | "This sign-in link doesn't work. Send a new one below."                           | `auth.signIn.errors.invalid`           |
| Error: rate       | "Too many links in a short time. Wait a minute, then send again."                 | `auth.signIn.errors.rate`              |
| Check title       | "Check Your Email"                                                                | `auth.check.title`                     |
| Check text        | "We sent a sign-in link to {email}. It works once, for 15 minutes."               | `auth.check.text`                      |
| Local hint        | "Running locally: the link is in the terminal where Snapmark runs."               | `auth.check.localHint`                 |
| Check buttons     | "Use Another Email", "Send Again", "Send again in {n} s"                          | `auth.check.{another,resend,resendIn}` |
| Verifying         | "Signing you in…"                                                                 | `auth.verify.loading`                  |
| Session ended     | "Your session ended. Sign in to continue."                                        | `auth.signIn.sessionEnded`             |

### Components

| Region | Component                       | Status  | Notes                                     |
| ------ | ------------------------------- | ------- | ----------------------------------------- |
| Form   | AuthCard (Input, Button, Alert) | missing | shared with Invitation and Device consent |

## Invitation

### Purpose

Join an organisation in one action (J10).

### Header

| Title                 | Tabs | Actions |
| --------------------- | ---- | ------- |
| "Join {organisation}" | none | none    |

### Sections

| Order | Section                                            | Purpose                             |
| ----- | -------------------------------------------------- | ----------------------------------- |
| 1     | Who invited you, the role, (guests) the workspaces | Confidence about what joining means |
| 2     | Callout for the wrong account, expired, no seat    | Recovery                            |
| 3     | Primary action                                     | Join or Continue with Email         |

### Layout

| Zoom  | Columns   | Widths               | Notes                |
| ----- | --------- | -------------------- | -------------------- |
| 100 % | 1 centred | 440 px               | inviter Avatar 40 px |
| 150 % | 1         | 440 px or full width |                      |

### Controls

| Control               | Component      | Label                   | Key   | Disabled reason | State source        |
| --------------------- | -------------- | ----------------------- | ----- | --------------- | ------------------- |
| Join                  | Button primary | "Join {organisation}"   | ↩     | busy            | invitation, session |
| Continue with Email   | Button primary | "Continue with Email"   | ↩     | busy            | invitation          |
| Sign Out and Continue | Button default | "Sign Out and Continue" | Tab ↩ | none            | session             |

### Words

| Where          | Text                                                                                                              | Key                                       |
| -------------- | ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| Title          | "Join {organisation}"                                                                                             | `auth.invite.title`                       |
| Line           | "{inviter} invited you to {organisation} as a {role}."                                                            | `auth.invite.line`                        |
| Guest line     | "You'll see {workspaces}."                                                                                        | `auth.invite.guestWorkspaces`             |
| Roles          | "Owner", "Admin", "Member", "Guest"                                                                               | `common.roles.*`                          |
| Wrong account  | "This invitation is for {email}. You're signed in as {current}."                                                  | `auth.invite.wrongAccount`                |
| Already member | "You're already in {organisation}." · "Go to {organisation}"                                                      | `auth.invite.already`, `auth.invite.goTo` |
| Expired        | "This invitation has expired. Ask {inviter} to send a new one."                                                   | `auth.invite.expired`                     |
| No seat        | "{organisation} has no free seat for a {role} right now. Ask {inviter} to free one, or to invite you as a guest." | `auth.invite.noSeat`                      |
| Invalid        | "This invitation isn't valid any more."                                                                           | `auth.invite.invalid`                     |
| Busy           | "Joining…"                                                                                                        | `auth.invite.joining`                     |
| Error          | "Couldn't join {organisation}: Snapmark didn't answer. Try again."                                                | `auth.invite.errors.server`               |

### Components

| Region | Component               | Status  | Notes |
| ------ | ----------------------- | ------- | ----- |
| Card   | AuthCard, Avatar, Alert | missing |       |

## Welcome (first run)

### Purpose

Name the organisation and the first workspace, then land in it (J10, A30).

### Header

| Title                               | Tabs | Actions |
| ----------------------------------- | ---- | ------- |
| "A home for your team's decisions." | none | none    |

### Sections

| Order | Section                                           | Purpose                                                 |
| ----- | ------------------------------------------------- | ------------------------------------------------------- |
| 1     | Headline and one line                             | A30 welcome                                             |
| 2     | Organisation name, with the address preview       |                                                         |
| 3     | First workspace name, with a one-line explanation | Teach "workspace" in place (Paradox of the Active User) |
| 4     | Create Organisation                               | The one action                                          |

### Layout

| Zoom  | Columns                                                                          | Widths               | Notes                                                                      |
| ----- | -------------------------------------------------------------------------------- | -------------------- | -------------------------------------------------------------------------- |
| 100 % | 1 centred                                                                        | 480 px               |                                                                            |
| 150 % | 1                                                                                | 480 px or full width |                                                                            |
| Phone | Desktop-only message is **not** used here: Welcome works on a phone (two fields) |                      | exception to WEB-10, because a phone may be where the invitation is opened |

### Controls

| Control             | Component      | Label                 | Key            | Disabled reason | State source |
| ------------------- | -------------- | --------------------- | -------------- | --------------- | ------------ |
| Organisation name   | TextField      | "Organisation name"   | autofocus      | none            | form         |
| Workspace name      | TextField      | "First workspace"     | Tab, ↩ submits | none            | form         |
| Create Organisation | Button primary | "Create Organisation" | ↩              | busy            | request      |

### Words

| Where                           | Text                                                                                                                                                                                              | Key                                                  |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| Headline                        | "A home for your team's decisions."                                                                                                                                                               | `onboarding.welcome.headline`                        |
| Line                            | "Name your organisation and the first product you'll review. You can add more later."                                                                                                             | `onboarding.welcome.text`                            |
| Organisation label, placeholder | "Organisation name", "Acme"                                                                                                                                                                       | `onboarding.welcome.org.label`, `.placeholder`       |
| Address preview                 | "Your address: {host}/{slug}"                                                                                                                                                                     | `onboarding.welcome.org.preview`                     |
| Workspace label, placeholder    | "First workspace", "Web Shop"                                                                                                                                                                     | `onboarding.welcome.workspace.label`, `.placeholder` |
| Workspace help                  | "A workspace is one product, like your web shop or your admin app."                                                                                                                               | `onboarding.welcome.workspace.help`                  |
| Button, busy                    | "Create Organisation", "Creating…"                                                                                                                                                                | `onboarding.welcome.submit`, `.submitting`           |
| Errors                          | "Give your organisation a name." · "Give your workspace a name." · "{slug} is taken. Try {suggestion}." · "Couldn't create {name}: Snapmark didn't answer. Your names are still here. Try again." | `onboarding.welcome.errors.*`                        |

### Components

| Region | Component       | Status  | Notes |
| ------ | --------------- | ------- | ----- |
| Form   | AuthCard, Input | missing |       |

## Device consent

### Purpose

Let a person allow the extension, the Mac app or an MCP client, read-only by default, with write scopes to opt into (A28, J11, J9).

### Header

| Title                                          | Tabs | Actions |
| ---------------------------------------------- | ---- | ------- |
| "Allow {client} to use your Snapmark account?" | none | none    |

### Sections

| Order | Section                             | Purpose                               |
| ----- | ----------------------------------- | ------------------------------------- |
| 1     | (Mac device flow) Code to confirm   | Match the code on the Mac             |
| 2     | Client and device, what it can read | Plain consequence                     |
| 3     | "It may also:" three Switches, off  | Opt in to writes (design 10)          |
| 4     | Safety lines                        | Never approves; people's text is data |
| 5     | Allow, Deny                         |                                       |

### Layout

| Zoom  | Columns   | Widths               | Notes             |
| ----- | --------- | -------------------- | ----------------- |
| 100 % | 1 centred | 480 px               | client icon 40 px |
| 150 % | 1         | 480 px or full width |                   |

### Controls

| Control                | Component                        | Label                    | Key        | Disabled reason                                                 | State source   |
| ---------------------- | -------------------------------- | ------------------------ | ---------- | --------------------------------------------------------------- | -------------- |
| Code                   | TextField (monospace, prefilled) | "Code"                   | ↩ Continue | none                                                            | `user_code`    |
| Continue               | Button primary                   | "Continue"               | ↩          | none                                                            |                |
| Reply in threads       | Switch                           | "Reply in threads"       | Space      | none                                                            | request scopes |
| Post versions          | Switch                           | "Post versions"          | Space      | hidden for the extension and Mac app (they never post versions) | client kind    |
| Report implementations | Switch                           | "Report implementations" | Space      | hidden for the extension and Mac app                            | client kind    |
| Allow                  | Button primary                   | "Allow"                  | ↩          | busy                                                            | request        |
| Deny                   | Button default                   | "Deny"                   | Esc        | none                                                            |                |

### Words

| Where          | Text                                                                                                                      | Key                                                            |
| -------------- | ------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Code heading   | "Confirm the code shown on your Mac."                                                                                     | `auth.device.codeHeading`                                      |
| Title          | "Allow {client} to use your Snapmark account?"                                                                            | `auth.consent.title`                                           |
| Read line      | "{client} on {device} can read feedback in every workspace you can see."                                                  | `auth.consent.read`                                            |
| Extension line | "The Chrome extension can also send feedback you capture."                                                                | `auth.consent.extension`                                       |
| Mac line       | "The Mac app can also sync the sessions you share."                                                                       | `auth.consent.mac`                                             |
| Scopes heading | "It may also:"                                                                                                            | `auth.consent.scopesHeading`                                   |
| Scopes         | "Reply in threads", "Post versions", "Report implementations"                                                             | `auth.consent.scopes.{reply,postVersion,reportImplementation}` |
| Safety         | "It can never approve or request changes. Text people write, guests included, reaches it as data, never as instructions." | `auth.consent.safety`                                          |
| Buttons        | "Allow", "Deny", "Allowing…"                                                                                              | `auth.consent.{allow,deny,allowing}`                           |
| Allowed        | "{client} is connected. You can close this tab." · "Go to Devices"                                                        | `auth.consent.allowed`, `.goToDevices`                         |
| Denied         | "{client} was not connected."                                                                                             | `auth.consent.denied`                                          |
| Expired        | "This request has expired. Start again from {client}."                                                                    | `auth.consent.expired`                                         |
| Code mismatch  | "This code doesn't match any waiting device. Check the code on your Mac."                                                 | `auth.device.mismatch`                                         |

### Components

| Region | Component                          | Status  | Notes                        |
| ------ | ---------------------------------- | ------- | ---------------------------- |
| Card   | ConsentCard (Card, Switch, Button) | missing | UI-risky; prototype draws it |

---

# App

## App shell (sidebar, command menu, shortcuts, 404)

### Purpose

Move between Inbox, My Work, workspaces and settings in one place (A27). One sidebar for every app page.

### Header

| Title                                         | Tabs | Actions |
| --------------------------------------------- | ---- | ------- |
| none (the sidebar and each page's own header) | none | none    |

### Sections

| Order | Section                                                                                                                            | Purpose                                                                          |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| 1     | Organisation switcher                                                                                                              | Many organisations, one login (design 5)                                         |
| 2     | Search ⌘K                                                                                                                          | The command menu                                                                 |
| 3     | Inbox (count), My Work                                                                                                             | What needs you, across workspaces (first: Serial Position Effect)                |
| 4     | One collapsible block per workspace: Open (count), Needs Decision (count), In Review (count), Done, Modules ▸, Sessions (when any) | The status lists (owner's sidebar)                                               |
| 5     | Settings                                                                                                                           | Organisation settings (owner and admins; members see it read-only; guests never) |
| 6     | Avatar menu                                                                                                                        | Account and Sign Out                                                             |

### Layout

| Zoom  | Columns        | Widths                                   | Notes                                            |
| ----- | -------------- | ---------------------------------------- | ------------------------------------------------ |
| 100 % | sidebar + main | sidebar 248 px, main fluid               | sidebar scrolls on its own; counts right-aligned |
| 150 % | rail + main    | rail 56 px (icons, Tooltips), main fluid | auto-collapses under 1100 CSS px; ⌘\ toggles     |
| Phone | top bar + main | top bar 56 px: menu button, page title   | sidebar as a Drawer, 300 px                      |

### Lists

| List                      | Columns          | Sort                                          | Empty                                                         |
| ------------------------- | ---------------- | --------------------------------------------- | ------------------------------------------------------------- |
| Workspaces in the sidebar | name, chevron    | by name; the one in use first when collapsed  | an organisation always has one                                |
| Modules ▸                 | name, open count | by last activity, 7 shown, then "All Modules" | "No modules yet" line linking to Workspace Settings › Modules |

### Controls

| Control                               | Component                    | Label                                         | Key                                    | Disabled reason            | State source |
| ------------------------------------- | ---------------------------- | --------------------------------------------- | -------------------------------------- | -------------------------- | ------------ |
| Organisation switcher                 | Dropdown                     | "{organisation}"                              | Tab ↩, ⌘K "Switch to"                  | none                       | memberships  |
| Search                                | Button light with Kbd        | "Search" + Kbd "⌘K"                           | ⌘K                                     | none                       |              |
| Inbox                                 | Listbox item with count      | "Inbox"                                       | G I                                    | none                       | inbox count  |
| My Work                               | Listbox item                 | "My Work"                                     | G M                                    | none                       |              |
| Workspace header                      | Button light + Dropdown More | "{workspace}"                                 | ← / → collapse                         | none                       |              |
| Open, Needs Decision, In Review, Done | Listbox items with counts    | "Open", "Needs Decision", "In Review", "Done" | G O, G D, G R, G X (current workspace) | none                       | counts       |
| Modules                               | Listbox item, expandable     | "Modules"                                     | → expands                              | none                       | modules      |
| Sessions                              | Listbox item                 | "Sessions"                                    | Tab ↩                                  | shown only with 1+ session | sessions     |
| Settings                              | Listbox item                 | "Settings"                                    | G S                                    | hidden for guests          | role         |
| Avatar menu                           | Dropdown                     | "{name}"                                      | Tab ↩                                  | none                       | user         |
| Collapse sidebar                      | Button icon + Tooltip        | "Collapse Sidebar (⌘\)"                       | ⌘\                                     | none                       | per user     |
| Command menu field                    | Input in Modal               | "Search or jump to…"                          | ⌘K, ↑/↓, ↩, Esc                        | none                       |              |
| Shortcuts                             | Modal                        | "Keyboard Shortcuts"                          | `?`, ⌘/                                | none                       |              |

### Filters

None.

### Words

| Where                    | Text                                                                                                                          | Key                              |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| Sidebar items            | "Search", "Inbox", "My Work", "Open", "Needs Decision", "In Review", "Done", "Modules", "All Modules", "Sessions", "Settings" | `app.nav.*`                      |
| Workspace More           | "Workspace Settings", "Copy Link"                                                                                             | `app.nav.workspaceMenu.*`        |
| No modules               | "No modules yet"                                                                                                              | `app.nav.noModules`              |
| Avatar menu              | "Profile", "Sign-In Methods", "Devices and Tokens", "Notifications", "Keyboard Shortcuts", "Sign Out"                         | `app.nav.account.*`              |
| Collapse                 | "Collapse Sidebar", "Expand Sidebar"                                                                                          | `app.nav.{collapse,expand}`      |
| Command menu placeholder | "Search or jump to…"                                                                                                          | `app.command.placeholder`        |
| Command groups           | "Go To", "Feedback", "Actions on This Page", "Settings"                                                                       | `app.command.groups.*`           |
| Command no result        | "Nothing matches \"{q}\". Search feedback by number, like #42."                                                               | `app.command.empty`              |
| Command error            | "Couldn't search: Snapmark didn't answer. Try again."                                                                         | `app.command.error`              |
| Shortcuts title, groups  | "Keyboard Shortcuts"; "Anywhere", "Lists", "Feedback", "Drawing"                                                              | `app.shortcuts.*`                |
| Offline banner           | "Offline. You can read what's loaded. Replies and reviews wait until you're back."                                            | `app.offline.banner`             |
| 404                      | "This page doesn't exist, or you don't have access." · "Go to Inbox" · "Go to Snapmark"                                       | `app.notFound.{text,inbox,home}` |
| Phone menu button        | "Menu" (aria-label)                                                                                                           | `app.nav.menu`                   |

### Components

| Region                      | Component       | Status      | Notes                                                              |
| --------------------------- | --------------- | ----------- | ------------------------------------------------------------------ |
| Sidebar, rail, phone drawer | AppShell        | missing     | current page: bold label plus a 2 px neutral bar, not colour alone |
| Command menu                | CommandMenu     | missing     | uxpatterns `command-palette`; reads the one key table              |
| Shortcuts                   | ShortcutsDialog | missing     | KEY-6                                                              |
| Offline                     | Alert (Banner)  | new variant |                                                                    |
| 404                         | EmptyState      | missing     |                                                                    |

## Inbox

### Purpose

Show everything that needs you across workspaces and let you empty it (J2, J4, J6; design 9.4).

### Header

| Title   | Tabs                                                                                        | Actions                                       |
| ------- | ------------------------------------------------------------------------------------------- | --------------------------------------------- |
| "Inbox" | All · Decisions · Reviews · Questions · Mentions · Answers (each with a count when above 0) | none (no primary: an empty Inbox is the goal) |

### Sections

| Order | Section               | Purpose                       |
| ----- | --------------------- | ----------------------------- |
| 1     | "{n} new" pill (live) | New items without moving rows |
| 2     | Rows, newest first    |                               |
| 3     | Load More             |                               |

### Layout

| Zoom  | Columns | Widths                           | Notes                                                                                                        |
| ----- | ------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| 100 % | 1 list  | max 880 px, left-aligned in main | row 64 px: dot, kind icon, thumbnail 48 px, reason line, title, workspace, due, time, Dismiss on hover/focus |
| 150 % | 1 list  | full main width                  | workspace moves under the title; time stays                                                                  |
| Phone | 1 list  | full width                       | row 72 px; swipe left = Dismiss (also in More)                                                               |

### Lists

| List        | Columns                                                                                                                                                | Sort                                          | Empty                                                                              |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------- | ---------------------------------------------------------------------------------- |
| Inbox items | New dot · kind icon · thumbnail · reason line ("Dana asked you to decide") · feedback title and #n · workspace · due date (decisions) · time · Dismiss | newest first; overdue decisions pinned on top | "Nothing waits on you." / "Decisions, reviews and questions for you show up here." |

### Controls

| Control   | Component             | Label          | Key              | Disabled reason | State source |
| --------- | --------------------- | -------------- | ---------------- | --------------- | ------------ |
| Kind tabs | Tabs                  | see header     | ←/→ when focused | none            | URL `kind`   |
| Row       | InboxRow              | (reason line)  | J/K, ↩           | none            |              |
| Dismiss   | Button icon + Tooltip | "Dismiss (E)"  | E                | none            |              |
| Row More  | Dropdown              | "More"         | Tab ↩            | none            |              |
| New pill  | Button light          | "{n} new"      | .                | none            | live         |
| Load More | Button default        | "Show 50 More" | Tab ↩            | none            | paging       |

### Filters

| Filter      | Default | Options                                          | Clear behaviour |
| ----------- | ------- | ------------------------------------------------ | --------------- |
| Kind (tabs) | All     | Decisions, Reviews, Questions, Mentions, Answers | All             |

### Words

| Where           | Text                                                                                                                                                                                                                              | Key                                      |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| Title           | "Inbox"                                                                                                                                                                                                                           | `inbox.title`                            |
| Tabs            | "All", "Decisions", "Reviews", "Questions", "Mentions", "Answers"                                                                                                                                                                 | `inbox.tabs.*`                           |
| Reason lines    | "{name} asked you to decide" · "{name} implemented this" · "{name} via {client} implemented this" · "{name} asked a question" · "{name} via {client} asked a question" · "{name} mentioned you" · "{name} answered your question" | `inbox.reasons.*`                        |
| Due             | "Due {date}" · "Overdue since {date}"                                                                                                                                                                                             | `inbox.due`, `inbox.overdue`             |
| Row More        | "Open in New Tab", "Dismiss"                                                                                                                                                                                                      | `inbox.rowMenu.*`                        |
| Dismissed toast | "Dismissed." · "Undo"                                                                                                                                                                                                             | `inbox.dismissed`, `common.actions.undo` |
| Empty           | "Nothing waits on you." · "Decisions, reviews and questions for you show up here."                                                                                                                                                | `inbox.empty.heading`, `.text`           |
| Empty kind      | "No {kind} for you."                                                                                                                                                                                                              | `inbox.empty.kind`                       |
| Error           | "Couldn't load your Inbox: Snapmark didn't answer. Try again."                                                                                                                                                                    | `inbox.errors.load`                      |
| New pill        | "{n} new"                                                                                                                                                                                                                         | `common.live.newCount`                   |

### Components

| Region | Component  | Status      | Notes    |
| ------ | ---------- | ----------- | -------- |
| Tabs   | Tabs       | new variant |          |
| Rows   | InboxRow   | missing     | UI-risky |
| Empty  | EmptyState | missing     |          |

## My Work

### Purpose

Follow what you asked for and what your copilot claimed (J3, J4).

### Header

| Title     | Tabs                              | Actions |
| --------- | --------------------------------- | ------- |
| "My Work" | Asked by Me · Claimed by My Agent | none    |

### Sections

| Order | Section                   | Purpose                                  |
| ----- | ------------------------- | ---------------------------------------- |
| 1     | Status filter chips       | Open, In Progress, Implemented, Accepted |
| 2     | Rows grouped by workspace | Context (Law of Common Region)           |

### Layout

| Zoom  | Columns | Widths      | Notes                                     |
| ----- | ------- | ----------- | ----------------------------------------- |
| 100 % | 1 list  | max 1040 px | FeedbackRow with workspace group headings |
| 150 % | 1 list  | full width  | environment column hidden                 |

### Lists

| List        | Columns            | Sort          | Empty           |
| ----------- | ------------------ | ------------- | --------------- |
| My feedback | as Workspace lists | last activity | per tab (Words) |

### Controls

| Control       | Component      | Label                                            | Key       | Disabled reason           | State source    |
| ------------- | -------------- | ------------------------------------------------ | --------- | ------------------------- | --------------- |
| Tabs          | Tabs           | "Asked by Me", "Claimed by My Agent"             | ←/→       | Claimed hidden for guests | URL `tab`, role |
| Status chips  | Chip toggles   | "Open", "In Progress", "Implemented", "Accepted" | Tab Space | none                      | URL `status`    |
| Rows          | FeedbackRow    |                                                  | J/K, ↩    | none                      |                 |
| Empty actions | Button primary | "Set Up the Extension" / "Connect an Agent"      | ↩         | none                      |                 |

### Filters

| Filter | Default                              | Options       | Clear behaviour               |
| ------ | ------------------------------------ | ------------- | ----------------------------- |
| Status | Open and In Progress and Implemented | four statuses | "Clear" resets to the default |

### Words

| Where         | Text                                                                                                                       | Key                                                    |
| ------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| Title, tabs   | "My Work", "Asked by Me", "Claimed by My Agent"                                                                            | `myWork.title`, `myWork.tabs.*`                        |
| Status chips  | "Open", "In Progress", "Implemented", "Accepted"                                                                           | `common.status.*`                                      |
| Empty asked   | "Everything you ask for, in one place." · "Feedback you send from Chrome or your Mac shows up here, with where it stands." | `myWork.empty.asked.*`                                 |
| Empty claimed | "Your agent hasn't claimed anything yet." · "Connect Claude Code or another agent, then ask it to pick up open feedback."  | `myWork.empty.claimed.*`                               |
| Buttons       | "Set Up the Extension", "Connect an Agent"                                                                                 | `common.actions.setUpExtension`, `myWork.connectAgent` |

### Components

| Region | Component   | Status  | Notes |
| ------ | ----------- | ------- | ----- |
| Rows   | FeedbackRow | missing |       |

## Workspace lists: Open, Needs Decision, In Review, Done

### Purpose

Scan and filter a workspace's feedback by what happens next (J1, J2, J4; owner's sidebar).

### Header

| Title                                 | Tabs                              | Actions                                        |
| ------------------------------------- | --------------------------------- | ---------------------------------------------- |
| "{workspace} · {list}" with the count | none (the sidebar is the tab set) | More (Dropdown): Copy Link, Workspace Settings |

### Sections

| Order | Section        | Purpose                                                                                                     |
| ----- | -------------- | ----------------------------------------------------------------------------------------------------------- |
| 1     | Filter bar     | Search, Module, Page, Kind, Author, Environment; Status on Open; Due on Needs Decision; Since on Done; Sort |
| 2     | "{n} new" pill | live                                                                                                        |
| 3     | Rows           |                                                                                                             |
| 4     | Show 50 More   | uxpatterns `load-more`                                                                                      |

### Layout

| Zoom  | Columns | Widths      | Notes                                                                                                                           |
| ----- | ------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------- |
| 100 % | 1 list  | max 1120 px | row 72 px: thumbnail 64 × 48 · title + chips · Module · Page · author Avatar · claimed line · thread count · environment · time |
| 150 % | 1 list  | full main   | environment and page hidden (in the row's Tooltip); filters wrap to two lines                                                   |
| Phone | 1 list  | full width  | thumbnail, title, status; filters in a "Filters" button opening a Drawer sheet                                                  |

### Lists

| List           | Columns                                                                                                                                                                                                            | Sort                      | Empty                                               |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------- | --------------------------------------------------- |
| Open           | thumbnail · title (#n) · status chip (Open, In Progress) · flags (Needs Answer, Needs Decision, Decided) · Module · Page · author (Guest chip) · "In Progress · Ben via Claude" · comments · environment · updated | updated, newest first     | first use: "Your first feedback is one click away." |
| Needs Decision | same, plus due date                                                                                                                                                                                                | due first, overdue on top | "No open decisions."                                |
| In Review      | same, status chip "Implemented", plus the PR                                                                                                                                                                       | implemented time          | "Nothing waiting for review."                       |
| Done           | same, status chip "Accepted", plus approved by                                                                                                                                                                     | accepted time             | "Finished work shows up here."                      |

### Controls

| Control              | Component                                  | Label                  | Key       | Disabled reason            | State source |
| -------------------- | ------------------------------------------ | ---------------------- | --------- | -------------------------- | ------------ |
| Search               | Input with icon                            | "Search feedback"      | /         | none                       | URL `q`      |
| Module filter        | Chip + Popover (CheckboxGroup with search) | "Module"               | F then M  | none                       | URL `module` |
| Page filter          | Chip + Popover                             | "Page"                 | F then P  | none                       | URL `page`   |
| Kind filter          | Chip + Popover                             | "Kind"                 | F then K  | none                       | URL `kind`   |
| Author filter        | Chip + Popover (people)                    | "Author"               | F then A  | none                       | URL `author` |
| Environment filter   | Chip + Popover                             | "Environment"          | F then E  | none                       | URL `env`    |
| Status filter (Open) | Chip + Popover                             | "Status"               | F then S  | none                       | URL `status` |
| Sort                 | Select                                     | "Sort"                 | Tab Space | none                       | URL `sort`   |
| Clear Filters        | Button light                               | "Clear Filters"        | Tab ↩     | shown only with filters on | URL          |
| Rows                 | FeedbackRow                                |                        | J/K, ↩    | none                       |              |
| Row More             | Dropdown                                   | "More"                 | Tab ↩     | none                       |              |
| Empty primary        | Button primary                             | "Set Up the Extension" | ↩         | none                       |              |
| Empty secondary      | Button default                             | "Invite People"        | Tab ↩     | hidden for non-admins      | role         |

### Filters

| Filter               | Default              | Options                            | Clear behaviour                         |
| -------------------- | -------------------- | ---------------------------------- | --------------------------------------- |
| Search               | empty                | title, body, number                | × in the field; Esc clears when focused |
| Module               | all                  | workspace modules + "No module"    | chip ×, Clear Filters                   |
| Page                 | all                  | paths seen in this workspace       | same                                    |
| Kind                 | all                  | Change Request, Comment            | same                                    |
| Author               | all                  | members and guests                 | same                                    |
| Environment          | all                  | workspace environments + "Unknown" | same                                    |
| Status (Open only)   | Open and In Progress | Open, In Progress                  | same                                    |
| Due (Needs Decision) | all                  | Overdue                            | same                                    |
| Since (Done)         | all                  | Last 7 days, Last 30 days          | same                                    |
| Sort                 | Updated              | Updated, Newest, Oldest            | back to Updated                         |

### Words

| Where                | Text                                                                                                                               | Key                           |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| Titles               | "Open", "Needs Decision", "In Review", "Done"                                                                                      | `app.nav.*`                   |
| Count                | "{n} feedback"                                                                                                                     | `lists.count`                 |
| Search               | "Search feedback"                                                                                                                  | `lists.search.placeholder`    |
| Filter names         | "Module", "Page", "Kind", "Author", "Environment", "Status", "Due", "Since", "Sort"                                                | `lists.filters.*`             |
| Filter values        | "No module", "Unknown", "Overdue", "Last 7 days", "Last 30 days", "Updated", "Newest", "Oldest"                                    | `lists.filters.values.*`      |
| Kinds                | "Change Request", "Comment"                                                                                                        | `common.kind.*`               |
| Status               | "Open", "In Progress", "Implemented", "Accepted"                                                                                   | `common.status.*`             |
| Flags                | "Needs Answer", "Needs Decision", "Decided"                                                                                        | `common.flags.*`              |
| Guest chip           | "Guest"                                                                                                                            | `common.roles.guestChip`      |
| Claimed line         | "In Progress · {name} via {client}"                                                                                                | `lists.row.claimed`           |
| Moved line           | "Moved to {list}"                                                                                                                  | `lists.row.moved`             |
| Clear                | "Clear Filters"                                                                                                                    | `lists.filters.clear`         |
| Row More             | "Copy Link", "Move to Module"                                                                                                      | `lists.rowMenu.*`             |
| Empty first use      | "Your first feedback is one click away." · "Open your product in Chrome, click the Snapmark icon and point at what should change." | `lists.empty.firstUse.*`      |
| Empty Needs Decision | "No open decisions." · "When the team weighs options, they collect here."                                                          | `lists.empty.needsDecision.*` |
| Empty In Review      | "Nothing waiting for review." · "When an agent reports a change, it lands here for approval."                                      | `lists.empty.inReview.*`      |
| Empty Done           | "Finished work shows up here." · "Each item keeps who asked, what was decided and who approved."                                   | `lists.empty.done.*`          |
| Empty filtered       | "No feedback matches these filters."                                                                                               | `lists.empty.filtered`        |
| Load more            | "Show 50 More"                                                                                                                     | `common.actions.showMore`     |
| Error                | "Couldn't load {list}: Snapmark didn't answer. Try again."                                                                         | `lists.errors.load`           |

### Components

| Region     | Component   | Status  | Notes                                                                              |
| ---------- | ----------- | ------- | ---------------------------------------------------------------------------------- |
| Filter bar | FilterBar   | missing | uxpatterns `filter-panel` as inline chips (fewer than 8 filters)                   |
| Rows       | FeedbackRow | missing | list, not table: rows mix a picture and text (uxpatterns `table-vs-list-vs-cards`) |
| Empty      | EmptyState  | missing |                                                                                    |

## Modules and one module

### Purpose

Find feedback by part of the product (A13, A27 first sub-level).

### Header

| Title                  | Tabs                                                 | Actions                                                                            |
| ---------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------- |
| "Modules" / "{module}" | one module: Open · Needs Decision · In Review · Done | Modules: Add Module (primary, members); one module: More › Rename, Delete (admins) |

### Sections

| Order | Section                                     | Purpose |
| ----- | ------------------------------------------- | ------- |
| 1     | Search (Modules) or filter bar (one module) |         |
| 2     | Table (Modules) or rows (one module)        |         |

### Layout

| Zoom  | Columns | Widths      | Notes                |
| ----- | ------- | ----------- | -------------------- |
| 100 % | 1       | max 1040 px | Table 5 columns      |
| 150 % | 1       | full        | Last Activity hidden |

### Lists

| List       | Columns                                                    | Sort               | Empty                               |
| ---------- | ---------------------------------------------------------- | ------------------ | ----------------------------------- |
| Modules    | Module · Open · Needs Decision · In Review · Last Activity | Last Activity      | "Name the parts of your product."   |
| One module | as Workspace lists                                         | as Workspace lists | "No {status} feedback in {module}." |

### Controls

| Control     | Component      | Label                                         | Key    | Disabled reason   | State source |
| ----------- | -------------- | --------------------------------------------- | ------ | ----------------- | ------------ |
| Add Module  | Button primary | "Add Module"                                  | Tab ↩  | hidden for guests | role         |
| Module row  | Table row      |                                               | ↑/↓, ↩ | none              |              |
| Status tabs | Tabs           | "Open", "Needs Decision", "In Review", "Done" | ←/→    | none              | URL `status` |

### Filters

As Workspace lists, on one module.

### Words

| Where            | Text                                                                                                   | Key                   |
| ---------------- | ------------------------------------------------------------------------------------------------------ | --------------------- |
| Title            | "Modules"                                                                                              | `modules.title`       |
| Columns          | "Module", "Open", "Needs Decision", "In Review", "Last Activity"                                       | `modules.columns.*`   |
| Add              | "Add Module"                                                                                           | `modules.add`         |
| Empty            | "Name the parts of your product." · "Modules group feedback by part, like Checkout Summary or Header." | `modules.empty.*`     |
| Empty one module | "No {status} feedback in {module}."                                                                    | `modules.emptyStatus` |

### Components

| Region            | Component     | Status      | Notes                                       |
| ----------------- | ------------- | ----------- | ------------------------------------------- |
| Table             | Table         | new variant |                                             |
| Add Module dialog | Modal + Input | new variant | same dialog as Workspace Settings › Modules |

## Feedback view

### Purpose

Read, compare, discuss, decide and review one feedback, with the screenshot in the centre (owner, design 9.1; A1, A3, A4, A12, A14, A15; J1, J2, J4, J5, J9).

### Header

| Title                                                                                                                              | Tabs                                                                                                      | Actions                                        |
| ---------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| Breadcrumbs "{workspace} › {list} › #{n}", then the title (inline edit for author and members), status Chip, flag Chips, kind Chip | Version tabs below the header: "v0 Original", "v1 Mockup · Dana", "v2 Implementation · PR #212", then "+" | Previous, Next (icon Buttons), More (Dropdown) |

### Sections

| Order | Section                                                                                                  | Purpose                                 |
| ----- | -------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| 1     | Header                                                                                                   | Where am I, what state (Cognitive Load) |
| 2     | Version tabs                                                                                             | A14                                     |
| 3     | Canvas toolbar: Compare, Draw on Screenshot, zoom (−, fit, +)                                            |                                         |
| 4     | Screenshot canvas: the version's screenshot, the anchor outline, references, marks; in Compare two panes | The centre                              |
| 5     | Right panel, Tabs: Thread · Details                                                                      |                                         |
| 5a    | Thread tab: acceptance line, open decision card, entries oldest first                                    |                                         |
| 5b    | Details tab: anchor and version stamp                                                                    | J5, A15                                 |
| 6     | Panel footer: Composer and review buttons                                                                | One place to act (Law of Common Region) |

### Layout

| Zoom             | Columns                  | Widths                         | Notes                                                                                       |
| ---------------- | ------------------------ | ------------------------------ | ------------------------------------------------------------------------------------------- |
| 100 %            | sidebar · canvas · panel | 248 · fluid (min 560) · 400 px | canvas fits the image; panel footer fixed; thread scrolls                                   |
| 150 %            | rail · canvas · panel    | 56 · fluid (min 480) · 360 px  | toolbar labels become icons with Tooltips; version tabs scroll horizontally with fade edges |
| Under 900 CSS px | rail · canvas over panel | canvas full width, panel below | Compare stacks the two panes vertically                                                     |
| Phone            | see Phone feedback view  |                                |                                                                                             |

### Lists

| List           | Columns                                                                                                                                                                                                          | Sort                                                                                  | Empty                 |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | --------------------- |
| Version tabs   | "v{n} {Kind}" · author ("Ben via Claude") · PR · accepted tick                                                                                                                                                   | by number                                                                             | v0 always exists      |
| Thread entries | Avatar · name ("Ben via Claude", Guest chip) · kind Chip (Question, Answer, Approve, Request Changes, Vote) · version pointer "on v2" · time · body (Markdown subset) · marks preview · actions (Reply-to, More) | oldest first; system lines inline ("Status changed to Implemented by Ben via Claude") | "No comments yet."    |
| Details        | Region · Module · Component · File · Repo · Branch · Worktree · Environment · Commit · Deployment · PR · Captured at · Page URL · Selector · Viewport · Text                                                     | fixed order (rank 1, 2, 3)                                                            | per field "Not found" |

### Controls

| Control              | Component                                             | Label                                                                     | Key                                 | Disabled reason                                                                                                                             | State source   |
| -------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| Breadcrumbs          | Breadcrumbs                                           | "{workspace}", "{list}", "#{n}"                                           | Tab ↩                               | none                                                                                                                                        | `from`         |
| Title                | inline TextField                                      | "Title"                                                                   | Tab ↩ edits, ↩ commits, Esc reverts | read-only for guests                                                                                                                        | role           |
| Previous / Next      | Button icon + Tooltip                                 | "Previous (K)", "Next (J)"                                                | K, J                                | at the ends: "First in {list}", "Last in {list}"                                                                                            | `from`         |
| More (header)        | Dropdown                                              | "More"                                                                    | Tab ↩                               | none                                                                                                                                        |                |
| Version tab          | VersionTabs                                           | "v{n} {Kind}"                                                             | [ ], ←/→                            | none                                                                                                                                        | URL `version`  |
| Add version "+"      | Button icon + Tooltip                                 | "Post Version"                                                            | Tab ↩                               | hidden for guests                                                                                                                           | role           |
| Compare              | Button toggle + Tooltip                               | "Compare (C)"                                                             | C                                   | "Compare needs two versions." with v0 only                                                                                                  | versions       |
| Compare left / right | Select                                                | "Left", "Right"                                                           | Tab Space                           | none                                                                                                                                        | URL `compare`  |
| Draw on Screenshot   | Button + Tooltip                                      | "Draw on Screenshot (D)"                                                  | D                                   | hidden on touch                                                                                                                             | input type     |
| Drawing tools        | DrawingToolbar                                        | Select, Reference, Box/Ellipse, Arrow, Pen, Remove, Highlight, Edit Image | C, 1–7                              | Pen pointer only (EX-6)                                                                                                                     |                |
| Zoom out / fit / in  | Button icons + Tooltips                               | "Zoom Out (−)", "Fit (0)", "Zoom In (+)"                                  | −, 0, +                             | at limits                                                                                                                                   |                |
| Panel tabs           | Tabs                                                  | "Thread", "Details"                                                       | T, I                     | none                                                                                                                                        | URL `tab`      |
| Composer             | Textarea (Composer)                                   | placeholder "Comment on v{n}…" (aria-label "Comment")                     | R focuses, ⌘↩ sends                 | offline: "Offline. Your comment is kept here and can be sent when you're back."                                                             | draft          |
| Comment              | Button (primary when no other next move)              | "Comment"                                                                 | ⌘↩                                  | "Write a comment first." when empty                                                                                                         | composer       |
| Approve              | Button (primary when an implementation awaits review) | "Approve v{n}"                                                            | A                                   | guest: "Guests can comment and vote. Approving needs a member." | role, version  |
| Request Changes      | Button default                                        | "Request Changes"                                                         | ⇧R                                  | guest: same reason                                                                                                                          | role           |
| Vote                 | Button default (focuses the decision card)            | "Vote"                                                                    | V                                   | shown only while a decision is open                                                                                                         | decision       |
| Footer More          | Dropdown                                              | "More"                                                                    | Tab ↩                               | none                                                                                                                                        |                |
| Entry Answer         | Button light                                          | "Answer"                                                                  | Tab ↩                               | none                                                                                                                                        | question state |
| Entry More           | Dropdown                                              | "More"                                                                    | Tab ↩                               | none                                                                                                                                        |                |
| Copy (Details rows)  | Button icon + Tooltip                                 | "Copy {field}"                                                            | Tab ↩                               | none                                                                                                                                        |                |
| New entries pill     | Button light                                          | "{n} new"                                                                 | .                                   | none                                                                                                                                        | live           |

Panel tab keys: T for Thread and I for Details (single keys, WEB-8; ⌥ letters are not used, KEY-7).

### Menus

| Menu             | Items                                                                                                                                                             |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Header More      | Copy Link (⌘⇧C) · Move to Module · Change Kind · Unclaim (claimer, admins; In Progress only) · Delete Feedback (author, admins)                                   |
| Footer More      | Ask a Question · Request a Decision · Post Version · Draw on Screenshot                                                                                           |
| Entry More       | Copy Link to Entry · Edit (own, 15 min) · Withdraw Approval / Withdraw Objection (own review) · Mark Not Answered (asker, on an answered question) · Delete (own) |
| Version tab More | Copy Link to Version · Delete Version (own, not v0, no reviews)                                                                                                   |

### Filters

None.

### Words

| Where                     | Text                                                                                                                                                                                                                                                                                   | Key                                                             |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Page title                | "#{n} {title} · {workspace}"                                                                                                                                                                                                                                                           | `feedback.meta.title`                                           |
| Version tab kinds         | "Original", "Mockup", "Alternative", "Implementation"                                                                                                                                                                                                                                  | `common.versionKind.*`                                          |
| Version tab               | "v{n} {Kind}" · "PR #{pr}" · "{name} via {client}"                                                                                                                                                                                                                                     | `feedback.versions.tab`, `.pr`, `common.via`                    |
| Accepted tick Tooltip     | "Accepted version"                                                                                                                                                                                                                                                                     | `feedback.versions.accepted`                                    |
| Toolbar                   | "Compare", "Draw on Screenshot", "Zoom Out", "Fit", "Zoom In", "Left", "Right"                                                                                                                                                                                                         | `feedback.toolbar.*`                                            |
| Compare disabled          | "Compare needs two versions."                                                                                                                                                                                                                                                          | `feedback.toolbar.compareDisabled`                              |
| Panel tabs                | "Thread", "Details"                                                                                                                                                                                                                                                                    | `feedback.panel.tabs.*`                                         |
| Acceptance line           | "Not reviewed yet" · "Approved by {names}" · "{n} objection open · {name}: “{text}”" · "Accepted · approved by {names}"                                                                                                                                                                | `feedback.acceptance.*`                                         |
| Acceptance help (Tooltip) | "Accepted when it has at least one Approve and no open objection."                                                                                                                                                                                                                     | `feedback.acceptance.rule`                                      |
| Claimed line              | "In Progress · {name} via {client}"                                                                                                                                                                                                                                                    | `feedback.claimed`                                              |
| System lines              | "{name} changed the status to {status}." · "{name} via {client} claimed this." · "{name} via {client} couldn't claim this: it needs an answer first." · "{name} via {client} couldn't claim this: a decision is open." · "Accepted · approved by {name}." · "Edited elsewhere: {text}" | `feedback.system.*`                                             |
| Entry kinds               | "Question", "Answer", "Approve", "Request Changes", "Vote"                                                                                                                                                                                                                             | `feedback.entryKind.*`                                          |
| Entry pointer             | "on v{n}"                                                                                                                                                                                                                                                                              | `feedback.entry.onVersion`                                      |
| Empty thread              | "No comments yet."                                                                                                                                                                                                                                                                     | `feedback.thread.empty`                                         |
| Composer placeholders     | "Comment on v{n}…" · "What should change in v{n}?" · "Answer {name}'s question…"                                                                                                                                                                                                       | `feedback.composer.*`                                           |
| Marks chip                | "{n} marks" · "Discard Marks"                                                                                                                                                                                                                                                          | `feedback.composer.marks`, `.discardMarks`                      |
| Buttons                   | "Comment", "Approve v{n}", "Request Changes", "Vote", "Answer"                                                                                                                                                                                                                         | `feedback.actions.{comment,approve,requestChanges,vote,answer}` |
| Disabled reasons          | "Write a comment first." · "Guests can comment and vote. Approving needs a member." · "Offline. Your comment is kept here and can be sent when you're back."                                                                              | `feedback.disabled.*`                                           |
| Menus                     | "Copy Link", "Move to Module", "Change Kind", "Unclaim", "Delete Feedback", "Ask a Question", "Request a Decision", "Post Version", "Copy Link to Entry", "Edit", "Withdraw Approval", "Withdraw Objection", "Mark Not Answered", "Delete", "Copy Link to Version", "Delete Version"   | `feedback.menu.*`                                               |
| Previous/Next             | "Previous", "Next", "First in {list}", "Last in {list}"                                                                                                                                                                                                                                | `feedback.nav.*`                                                |
| Newer version note        | "v{n} was just posted. Your comment will go on v{old}." · "Move to v{n}"                                                                                                                                                                                                               | `feedback.composer.newerVersion`, `.moveTo`                     |
| Details labels            | "Region", "Module", "Component", "File", "Repo", "Branch", "Worktree", "Environment", "Commit", "Deployment", "PR", "Captured", "Page", "Selector", "Viewport", "Text", "Session"                                                                                                      | `feedback.details.*`                                            |
| Details unknown           | "Not found"                                                                                                                                                                                                                                                                            | `feedback.details.notFound`                                     |
| Details no code           | "No code location found. The agent searches by page, selector and text."                                                                                                                                                                                                               | `feedback.details.noCode`                                       |
| Copied toast              | "Copied link to #{n}" · "Copied {value}"                                                                                                                                                                                                                                               | `common.copied.link`, `common.copied.value`                     |
| Deleted toast             | "Deleted #{n}." · "Undo"                                                                                                                                                                                                                                                               | `feedback.deleted`                                              |
| Errors                    | "Couldn't load the screenshot. The feedback and thread are fine. Try again." · "Couldn't post your comment: Snapmark didn't answer. Your text is kept. Try again." · "Couldn't save your review: Snapmark didn't answer. Try again."                                                   | `feedback.errors.*`                                             |
| Not found                 | "This feedback doesn't exist, or you don't have access."                                                                                                                                                                                                                               | `feedback.notFound`                                             |

### Components

| Region       | Component                              | Status      | Notes                                                                                                            |
| ------------ | -------------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------- |
| Header       | Breadcrumbs, Chip, Dropdown, Button    | new variant |                                                                                                                  |
| Version tabs | VersionTabs                            | missing     | UI-risky                                                                                                         |
| Canvas       | ScreenshotCanvas (view, compare, draw) | missing     | same renderer as the Mac app and the extension; compare is side by side with linked zoom (owner: "side by side") |
| Thread       | ThreadEntry, AcceptanceLine            | missing     | copilot entries: person's Avatar with an agent badge (WEB-24)                                                    |
| Decision     | DecisionCard                           | missing     | see Decision request                                                                                             |
| Details      | AnchorDetails                          | missing     |                                                                                                                  |
| Footer       | Composer, Button                       | missing     | one accent button (WEB-20)                                                                                       |

## Decision request: dialog and card

### Purpose

Ask named people to vote between versions, show the tally, close it (A12, J2).

### Header

| Title                        | Tabs | Actions                            |
| ---------------------------- | ---- | ---------------------------------- |
| Dialog: "Request a Decision" | none | Request Decision (primary), Cancel |

### Sections

| Order  | Section                                                    | Purpose                    |
| ------ | ---------------------------------------------------------- | -------------------------- |
| 1      | Versions to compare (thumbnails with checkboxes)           | at least two               |
| 2      | People to ask                                              | members and invited guests |
| 3      | Due date (optional)                                        |                            |
| 4      | Note (optional)                                            | what to weigh              |
| Card 1 | "{opener} asked {names} to decide · Due {date}"            |                            |
| Card 2 | Version options with thumbnail, tally bar, voters' Avatars |                            |
| Card 3 | Vote / Change Vote, card More                              |                            |

### Layout

| Zoom  | Columns         | Widths                                             | Notes                            |
| ----- | --------------- | -------------------------------------------------- | -------------------------------- |
| 100 % | dialog 1 column | Modal 560 px; version thumbnails 2 per row, 120 px | card fills the panel width (400) |
| 150 % | dialog 1 column | Modal full width minus 48                          | thumbnails 1 per row             |

### Lists

| List                   | Columns                                                        | Sort      | Empty                                                                         |
| ---------------------- | -------------------------------------------------------------- | --------- | ----------------------------------------------------------------------------- |
| Versions in the dialog | checkbox · thumbnail · "v{n} {Kind}" · author                  | by number | "A decision needs at least two versions. Post a mockup or alternative first." |
| Options in the card    | radio · thumbnail · "v{n} {Kind}" · tally ("3 votes") · voters | by number |                                                                               |

### Controls

| Control          | Component                    | Label                  | Key          | Disabled reason                 | State source                |
| ---------------- | ---------------------------- | ---------------------- | ------------ | ------------------------------- | --------------------------- |
| Versions         | CheckboxGroup                | "Versions to compare"  | Space        | none                            | versions                    |
| People           | Autocomplete multi (people)  | "People to ask"        | type, ↩ adds | none                            | members, guests with access |
| Due date         | DatePicker                   | "Due (optional)"       | Tab          | none                            |                             |
| Note             | Textarea                     | "Note (optional)"      | Tab          | none                            |                             |
| Request Decision | Button primary               | "Request Decision"     | ⌘↩           | "Choose at least two versions." | form                        |
| Cancel           | Button default               | "Cancel"               | Esc          | none                            |                             |
| Card options     | RadioGroup                   | "v{n} {Kind}"          | ↑/↓, Space   | none                            |                             |
| Vote             | Button primary (in the card) | "Vote" / "Change Vote" | V, ↩         | "Choose a version first."       | vote                        |
| Show Votes       | Button light                 | "Show Votes"           | Tab ↩        | none (closed only)              |                             |
| Card More        | Dropdown                     | "More"                 | Tab ↩        | Close Request: opener only      | role                        |

### Words

| Where            | Text                                                                                                                               | Key                                                              |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Dialog title     | "Request a Decision"                                                                                                               | `decision.dialog.title`                                          |
| Labels           | "Versions to compare", "People to ask", "Due (optional)", "Note (optional)"                                                        | `decision.dialog.labels.*`                                       |
| Note placeholder | "What should people weigh?"                                                                                                        | `decision.dialog.notePlaceholder`                                |
| Buttons          | "Request Decision", "Requesting…", "Cancel"                                                                                        | `decision.dialog.submit`, `.submitting`, `common.actions.cancel` |
| Disabled         | "Choose at least two versions." · "A decision is already open on this feedback."                                                   | `decision.disabled.*`                                            |
| One version      | "A decision needs at least two versions. Post a mockup or alternative first." · "Post Version"                                     | `decision.dialog.oneVersion`, `feedback.menu.postVersion`        |
| Card heading     | "{opener} asked {names} to decide" · "Due {date}" · "Overdue since {date}"                                                         | `decision.card.*`                                                |
| Tally            | "{n} votes" (plural rules)                                                                                                         | `decision.card.tally`                                            |
| Voted            | "You voted for v{n}."                                                                                                              | `decision.card.voted`                                            |
| Buttons          | "Vote", "Change Vote", "Show Votes", "Close Request"                                                                               | `decision.card.actions.*`                                        |
| Closed           | "Decided: v{n}, approved by {name}. Votes: {tally}." · "Closed by {name} without a decision."                                      | `decision.card.closed.*`                                         |
| Thread line      | "{name} requested a decision between {versions}."                                                                                  | `decision.thread.line`                                           |
| Errors           | "Couldn't request the decision: Snapmark didn't answer. Your choices are kept. Try again." · "Couldn't save your vote. Try again." | `decision.errors.*`                                              |

### Components

| Region | Component                                                | Status      | Notes                                                                                             |
| ------ | -------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------- |
| Dialog | Modal, CheckboxGroup, Autocomplete, DatePicker, Textarea | new variant | uxpatterns `modal`: a short focused form                                                          |
| Card   | DecisionCard (RadioGroup, Progress, AvatarGroup)         | missing     | UI-risky; tally bars neutral grey, the voted option marked by a tick and weight, not colour alone |

## Post Version (dialog)

### Purpose

Add a mockup or alternative as a version (A12, J2).

### Header

| Title          | Tabs | Actions                        |
| -------------- | ---- | ------------------------------ |
| "Post Version" | none | Post Version (primary), Cancel |

### Sections

| Order | Section                                       | Purpose          |
| ----- | --------------------------------------------- | ---------------- |
| 1     | Kind (RadioGroup: Mockup, Alternative)        |                  |
| 2     | Image drop zone (drop, paste ⌘V, Choose File) |                  |
| 3     | Note                                          | why this version |

### Layout

| Zoom  | Columns | Widths                              | Notes                     |
| ----- | ------- | ----------------------------------- | ------------------------- |
| 100 % | 1       | Modal 560 px; drop zone 200 px high | preview replaces the zone |
| 150 % | 1       | full width minus 48                 |                           |

### Controls

| Control      | Component              | Label                   | Key                | Disabled reason       | State source |
| ------------ | ---------------------- | ----------------------- | ------------------ | --------------------- | ------------ |
| Kind         | RadioGroup             | "Kind"                  | ↑/↓                | none                  |              |
| Image        | file input + drop zone | "Image" · "Choose File" | ↩ opens, ⌘V pastes | none                  |              |
| Note         | Textarea               | "Note (optional)"       | Tab                | none                  |              |
| Post Version | Button primary         | "Post Version"          | ⌘↩                 | "Add an image first." | form         |
| Cancel       | Button default         | "Cancel"                | Esc                | none                  |              |

### Words

| Where         | Text                                                                        | Key                              |
| ------------- | --------------------------------------------------------------------------- | -------------------------------- |
| Title, labels | "Post Version", "Kind", "Mockup", "Alternative", "Image", "Note (optional)" | `version.dialog.*`               |
| Drop zone     | "Drop an image, paste it, or choose a file." · "Choose File"                | `version.dialog.drop`, `.choose` |
| Disabled      | "Add an image first."                                                       | `version.dialog.disabled`        |
| Uploading     | "Uploading… {percent} %"                                                    | `version.dialog.uploading`       |
| Refused       | "This file can't be used. Use a PNG, JPEG or WebP under 20 MB."             | `version.dialog.refused`         |
| Error         | "Couldn't upload the image: the connection dropped. Try again."             | `version.dialog.error`           |

### Components

| Region    | Component                             | Status      | Notes                   |
| --------- | ------------------------------------- | ----------- | ----------------------- |
| Dialog    | Modal, RadioGroup, Textarea, Progress | new variant |                         |
| Drop zone | ImageDrop                             | missing     | uxpatterns `file-input` |

## Set Up the Extension (dialog)

### Purpose

Get the unpacked extension loaded in release 1 (A21, J1). Release 2 replaces the steps with a Web Store link.

### Header

| Title                  | Tabs | Actions        |
| ---------------------- | ---- | -------------- |
| "Set Up the Extension" | none | Done (primary) |

### Sections

| Order | Section                                | Purpose                                                                            |
| ----- | -------------------------------------- | ---------------------------------------------------------------------------------- |
| 1     | Three numbered steps                   | open `chrome://extensions`, turn on Developer mode, Load unpacked the built folder |
| 2     | Then: pin the icon and Sign In from it |                                                                                    |

### Layout

| Zoom  | Columns | Widths              | Notes |
| ----- | ------- | ------------------- | ----- |
| 100 % | 1       | Modal 560 px        |       |
| 150 % | 1       | full width minus 48 |       |

### Controls

| Control      | Component             | Label                      | Key    | Disabled reason | State source |
| ------------ | --------------------- | -------------------------- | ------ | --------------- | ------------ |
| Copy address | Button icon + Tooltip | "Copy chrome://extensions" | Tab ↩  | none            |              |
| Done         | Button primary        | "Done"                     | ↩, Esc | none            |              |

### Words

| Where | Text                                                                                                                                                                                                                  | Key                      |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| Title | "Set Up the Extension"                                                                                                                                                                                                | `extensionSetup.title`   |
| Steps | "1. Open chrome://extensions in Chrome." · "2. Turn on Developer mode, top right." · "3. Choose Load unpacked and pick the extension's build folder." · "Then pin Snapmark to the toolbar and sign in from its icon." | `extensionSetup.steps.*` |
| Done  | "Done"                                                                                                                                                                                                                | `common.actions.done`    |

### Components

| Region | Component | Status      | Notes |
| ------ | --------- | ----------- | ----- |
| Dialog | Modal     | new variant |       |

## Sessions and Session view

### Purpose

See a Mac session as the team sees it (A26, J7).

### Header

| Title                                                                             | Tabs | Actions                               |
| --------------------------------------------------------------------------------- | ---- | ------------------------------------- |
| "Sessions" / "{session}" with "Shared from {device} by {name} · Last sync {time}" | none | none (sessions are edited on the Mac) |

### Sections

| Order | Section                                                                  | Purpose                      |
| ----- | ------------------------------------------------------------------------ | ---------------------------- |
| 1     | Table of sessions (list)                                                 |                              |
| 2     | Per screenshot: the image with references, then its feedback rows (view) | each reference is a feedback |

### Layout

| Zoom  | Columns | Widths                        | Notes |
| ----- | ------- | ----------------------------- | ----- |
| 100 % | 1       | max 1040 px; image max 960 px |       |
| 150 % | 1       | full                          |       |

### Lists

| List                        | Columns                                                  | Sort                | Empty                                           |
| --------------------------- | -------------------------------------------------------- | ------------------- | ----------------------------------------------- |
| Sessions                    | Session · Screenshots · Feedback · Shared By · Last Sync | Last Sync           | the sidebar item is hidden while there are none |
| Feedback under a screenshot | reference number · title · status · flags                | by reference number | "No references on this screenshot."             |

### Controls

| Control          | Component               | Label            | Key    | Disabled reason | State source     |
| ---------------- | ----------------------- | ---------------- | ------ | --------------- | ---------------- |
| Session row      | Table row               |                  | ↑/↓, ↩ | none            |                  |
| Screenshot block | ScreenshotCanvas (view) | "Screenshot {n}" | J/K    | none            | URL `screenshot` |
| Feedback row     | FeedbackRow (compact)   |                  | ↩      | none            |                  |

### Words

| Where           | Text                                                                        | Key                    |
| --------------- | --------------------------------------------------------------------------- | ---------------------- |
| Titles, columns | "Sessions", "Session", "Screenshots", "Feedback", "Shared By", "Last Sync"  | `sessions.*`           |
| Header line     | "Shared from {device} by {name} · Last sync {time}"                         | `sessions.view.meta`   |
| Stale           | "Last sync {date}. The Mac may be offline."                                 | `sessions.view.stale`  |
| Empty           | "No screenshots in this session yet." · "No references on this screenshot." | `sessions.view.empty*` |

### Components

| Region | Component                     | Status      | Notes |
| ------ | ----------------------------- | ----------- | ----- |
| Table  | Table                         | new variant |       |
| Blocks | ScreenshotCanvas, FeedbackRow | missing     |       |

## Workspace settings: General, Repos, Environments, Route Rules, Modules

### Purpose

Tell Snapmark where the product runs and what it is made of, so captures get the right environment, repo and module (A16, J10, J5).

### Header

| Title                  | Tabs                                                   | Actions                                                                                       |
| ---------------------- | ------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| "{workspace} Settings" | General · Repos · Environments · Route Rules · Modules | one primary per tab: Add Repo / Add Environment / Add Route Rule / Add Module (General: none) |

### Sections

| Order | Section                                              | Purpose                                |
| ----- | ---------------------------------------------------- | -------------------------------------- |
| 1     | Tab content: General fields, or a Table              |                                        |
| 2     | Environments: "Try an address" field under the table | check the patterns (Postel's Law)      |
| 3     | General: Danger zone with Delete Workspace (owner)   | kept last and apart (Law of Proximity) |

### Layout

| Zoom  | Columns              | Widths     | Notes                                                      |
| ----- | -------------------- | ---------- | ---------------------------------------------------------- |
| 100 % | 1                    | max 880 px |                                                            |
| 150 % | 1                    | full       | tables keep 3 columns max; others in the row's edit dialog |
| Phone | Desktop-only message |            |                                                            |

### Lists

| List         | Columns                                                                                              | Sort                                           | Empty                                                                                                           |
| ------------ | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Repos        | Repo (`owner/name`) · Default Branch · Local Folder Match ("Found by the Mac app" or "Not seen yet") | name                                           | "Link the repos this product is built from." / "The agent uses them to find the code behind feedback."          |
| Environments | Name · Kind · Address Patterns                                                                       | kind order Production, Staging, Preview, Local | "Tell Snapmark where your product runs." / "For example omr.com is Production and omr.ninja is Staging."        |
| Route Rules  | Path · Repo                                                                                          | path                                           | "Only needed when one site is built from several repos." / "For example /reviews/* comes from omr-reviews-web." |
| Modules      | Module · Feedback · Created By                                                                       | name                                           | "Name the parts of your product."                                                                               |

### Controls

| Control                           | Component         | Label              | Key                     | Disabled reason                                                                    | State source     |
| --------------------------------- | ----------------- | ------------------ | ----------------------- | ---------------------------------------------------------------------------------- | ---------------- |
| Tabs                              | Tabs              | see header         | ←/→                     | none                                                                               | route            |
| Workspace name                    | TextField         | "Workspace name"   | ↩ commits               | members: "Only admins can change this."                                            | role             |
| Address (slug)                    | TextField         | "Address"          | ↩ commits               | same                                                                               | role             |
| Delete Workspace                  | Button danger     | "Delete Workspace" | Tab ↩                   | not owner: hidden; last workspace: "An organisation needs at least one workspace." | role, count      |
| Add {object}                      | Button primary    | "Add Repo" etc.    | Tab ↩                   | members: "Only admins can change this." (Modules: allowed)                         | role             |
| Row                               | Table row         |                    | ↑/↓, ↩ edits, ⌫ deletes | read-only for members                                                              | role             |
| Row More                          | Dropdown          | "More"             | Tab ↩                   | none                                                                               |                  |
| Try an address                    | TextField         | "Try an address"   | type                    | none                                                                               | live result line |
| Add Environment dialog: Kind      | Select            | "Kind"             | Space                   | none                                                                               |                  |
| Name                              | TextField         | "Name"             | Tab                     | none                                                                               |                  |
| Address patterns                  | TagInput          | "Address patterns" | ↩ adds                  | none                                                                               |                  |
| Add Repo dialog: Repo             | TextField         | "Repo"             | Tab                     | none                                                                               |                  |
| Default branch                    | TextField         | "Default branch"   | Tab                     | none                                                                               |                  |
| Add Route Rule dialog: Path, Repo | TextField, Select | "Path", "Repo"     | Tab                     | "Add a repo first." when none                                                      | repos            |
| Save                              | Button primary    | "Save"             | ⌘↩                      | per field errors                                                                   | form             |

### Filters

None.

### Words

| Where                   | Text                                                                                                                                              | Key                                              |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| Title, tabs             | "{workspace} Settings", "General", "Repos", "Environments", "Route Rules", "Modules"                                                              | `wsSettings.*`                                   |
| General labels          | "Workspace name", "Address", "Delete Workspace"                                                                                                   | `wsSettings.general.*`                           |
| Delete confirm          | "Delete {workspace}? Its feedback, versions and sessions are deleted. This can't be undone." · "Type {workspace} to confirm" · "Delete Workspace" | `wsSettings.general.delete.*`                    |
| Buttons                 | "Add Repo", "Add Environment", "Add Route Rule", "Add Module", "Save"                                                                             | `wsSettings.*.add`, `common.actions.save`        |
| Repo columns, labels    | "Repo", "Default Branch", "Local Folder Match", "Found by the Mac app", "Not seen yet", "Default branch"                                          | `wsSettings.repos.*`                             |
| Repo placeholder, error | "pokbytes/snapmark-web" · "Use owner/name, or paste the GitHub address."                                                                          | `wsSettings.repos.placeholder`, `.errors.format` |
| Environment kinds       | "Production", "Staging", "Preview", "Local"                                                                                                       | `common.envKind.*`                               |
| Environment labels      | "Name", "Kind", "Address patterns"                                                                                                                | `wsSettings.environments.*`                      |
| Pattern help            | "One per line, like omr.com or *.omr.ninja. Paths and https:// are fine."                                                                         | `wsSettings.environments.patternHelp`            |
| Try result              | "{address} is {environment}." · "{address} matches no environment."                                                                               | `wsSettings.environments.try.*`                  |
| Route labels, help      | "Path", "Repo" · "Use * for the rest of the path, like /reviews/*."                                                                               | `wsSettings.routes.*`                            |
| Empty states            | see Lists                                                                                                                                         | `wsSettings.*.empty.*`                           |
| Member line             | "Only admins can change this."                                                                                                                    | `common.disabled.adminOnly`                      |
| Saved                   | "Saved"                                                                                                                                           | `common.saved`                                   |
| Deleted toast           | "Deleted {name}." · "Undo"                                                                                                                        | `common.deleted`                                 |

### Components

| Region  | Component                      | Status                           | Notes |
| ------- | ------------------------------ | -------------------------------- | ----- |
| Tabs    | Tabs                           | new variant                      |       |
| Tables  | Table                          | new variant                      |       |
| Dialogs | Modal, Input, Select, TagInput | new variant / missing (TagInput) |       |
| Delete  | Modal with typed confirm       | new variant                      | FBK-5 |

## Organisation settings: General, Members, Workspaces

### Purpose

Invite people with the right role, see seats, add workspaces (J10).

### Header

| Title                     | Tabs                           | Actions                                                                              |
| ------------------------- | ------------------------------ | ------------------------------------------------------------------------------------ |
| "{organisation} Settings" | General · Members · Workspaces | Members: Invite People (primary); Workspaces: New Workspace (primary); General: none |

### Sections

| Order | Section                                                         | Purpose           |
| ----- | --------------------------------------------------------------- | ----------------- |
| 1     | Members: seat line                                              | Seats at a glance |
| 2     | Members: Tabs Members · Invitations, search, role filter, Table |                   |
| 3     | General: name, address, Leave Organisation                      |                   |
| 4     | Workspaces: Table                                               |                   |

### Layout

| Zoom  | Columns              | Widths     | Notes                |
| ----- | -------------------- | ---------- | -------------------- |
| 100 % | 1                    | max 960 px |                      |
| 150 % | 1                    | full       | Joined column hidden |
| Phone | Desktop-only message |            |                      |

### Lists

| List        | Columns                                                                     | Sort         | Empty                                |
| ----------- | --------------------------------------------------------------------------- | ------------ | ------------------------------------ |
| Members     | Avatar + name + email · Role (Select) · Workspaces (guests) · Joined · More | name         | an organisation always has its owner |
| Invitations | Email · Role · Sent By · Sent · Status · More (Resend, Revoke)              | sent, newest | "No open invitations."               |
| Workspaces  | Workspace · Feedback · Members with Access · Created                        | name         | never empty                          |

### Controls

| Control                    | Component      | Label                          | Key             | Disabled reason                                                                            | State source |
| -------------------------- | -------------- | ------------------------------ | --------------- | ------------------------------------------------------------------------------------------ | ------------ |
| Invite People              | Button primary | "Invite People"                | Tab ↩, ⌘K       | members: hidden; Free plan never applies in release 1                                      | role         |
| Invite dialog: Emails      | TagInput       | "Emails"                       | ↩ or comma adds | none                                                                                       |              |
| Role                       | Select         | "Role"                         | Space           | Member/Admin: "No free seat. Guests need none."; Guest: "Guest limit reached: 5 per seat." | seats        |
| Workspaces (guests)        | CheckboxGroup  | "Workspaces"                   | Space           | shown only for Guest                                                                       | role choice  |
| Send Invitations           | Button primary | "Send Invitations"             | ⌘↩              | "Add at least one email."                                                                  | form         |
| Members tabs               | Tabs           | "Members", "Invitations"       | ←/→             | none                                                                                       | URL `tab`    |
| Search                     | Input          | "Search people"                | /               | none                                                                                       | URL `q`      |
| Role filter                | Chip + Popover | "Role"                         | F then R        | none                                                                                       | URL `role`   |
| Row role                   | Select         | "{role}"                       | Space           | last owner: "Every organisation needs an owner."; members viewing: read-only               | role         |
| Row More                   | Dropdown       | "More"                         | Tab ↩           | none                                                                                       |              |
| Organisation name, address | TextField      | "Organisation name", "Address" | ↩ commits       | non-admins: read-only                                                                      | role         |
| Leave Organisation         | Button danger  | "Leave Organisation"           | Tab ↩           | last owner: "Make someone else an owner first."                                            | role         |
| New Workspace              | Button primary | "New Workspace"                | Tab ↩           | non-admins: hidden                                                                         | role         |

### Filters

| Filter | Default | Options                     | Clear behaviour |
| ------ | ------- | --------------------------- | --------------- |
| Role   | all     | Owner, Admin, Member, Guest | chip ×          |
| Search | empty   | name, email                 | ×               |

### Words

| Where                      | Text                                                                                                     | Key                                                      |
| -------------------------- | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| Title, tabs                | "{organisation} Settings", "General", "Members", "Workspaces", "Invitations"                             | `orgSettings.*`                                          |
| Seat line                  | "{used} of {total} seats used · {guests} of {guestLimit} guests"                                         | `orgSettings.members.seats`                              |
| Seat note                  | "Seats are granted by Snapmark during the beta."                                                         | `orgSettings.members.seatNote`                           |
| Invite dialog              | "Invite People", "Emails", "Role", "Workspaces", "Send Invitations", "Sending…"                          | `orgSettings.invite.*`                                   |
| Emails placeholder         | "name@company.com, another@company.com"                                                                  | `orgSettings.invite.emailsPlaceholder`                   |
| Role help                  | "Members and admins use a seat. Guests comment and vote in the workspaces you choose, and need no seat." | `orgSettings.invite.roleHelp`                            |
| Disabled                   | "No free seat. Guests need none." · "Guest limit reached: 5 per seat." · "Add at least one email."       | `orgSettings.invite.disabled.*`                          |
| Bad email                  | "{text} isn't an email address."                                                                         | `orgSettings.invite.errors.email`                        |
| Member columns             | "Name", "Role", "Workspaces", "Joined"                                                                   | `orgSettings.members.columns.*`                          |
| Invitation columns, status | "Email", "Role", "Sent By", "Sent", "Status", "Sent", "Accepted", "Expired", "Revoked"                   | `orgSettings.invitations.*`, `common.invitationStatus.*` |
| Row menus                  | "Remove from Organisation", "Resend", "Revoke"                                                           | `orgSettings.*.menu.*`                                   |
| Remove confirm             | "Remove {name} from {organisation}? They lose access at once. You can invite them again." · "Remove"     | `orgSettings.members.remove.*`                           |
| Last owner                 | "Every organisation needs an owner." · "Make someone else an owner first."                               | `orgSettings.disabled.lastOwner*`                        |
| Invitations empty          | "No open invitations."                                                                                   | `orgSettings.invitations.empty`                          |
| Non-admin                  | "Only admins can invite people."                                                                         | `orgSettings.members.adminOnly`                          |
| General                    | "Organisation name", "Address", "Leave Organisation"                                                     | `orgSettings.general.*`                                  |
| Leave confirm              | "Leave {organisation}? You lose access to its workspaces at once." · "Leave"                             | `orgSettings.general.leave.*`                            |
| Workspaces columns         | "Workspace", "Feedback", "Members with Access", "Created", "New Workspace"                               | `orgSettings.workspaces.*`                               |
| New workspace dialog       | "New Workspace", "Workspace name", "Create Workspace"                                                    | `orgSettings.workspaces.dialog.*`                        |

### Components

| Region        | Component                              | Status                | Notes |
| ------------- | -------------------------------------- | --------------------- | ----- |
| Seat line     | SeatLine                               | missing               |       |
| Tables        | Table                                  | new variant           |       |
| Invite dialog | Modal, TagInput, Select, CheckboxGroup | new variant / missing |       |

## Account: Profile, Sign-In Methods, Devices and Tokens, Notifications

### Purpose

Manage yourself and what each device may do (J11, A28, A7, design 9.4).

### Header

| Title     | Tabs                                                           | Actions                                  |
| --------- | -------------------------------------------------------------- | ---------------------------------------- |
| "Account" | Profile · Sign-In Methods · Devices and Tokens · Notifications | none (devices are added from the device) |

### Sections

| Order           | Section                                                    | Purpose |
| --------------- | ---------------------------------------------------------- | ------- |
| Profile         | Name, Avatar, Email (read-only), Keyboard shortcuts switch |         |
| Sign-in methods | List of methods; release-2 rows absent                     | A7      |
| Devices         | Table with scope Switches and Revoke                       | A28     |
| Notifications   | "Emails at once" Switches; "Daily digest" Switch           |         |

### Layout

| Zoom  | Columns                                                                                              | Widths     | Notes                                     |
| ----- | ---------------------------------------------------------------------------------------------------- | ---------- | ----------------------------------------- |
| 100 % | 1                                                                                                    | max 880 px |                                           |
| 150 % | 1                                                                                                    | full       | Devices: scopes move into a row expansion |
| Phone | Notifications and Profile work on a phone; Devices and Sign-In Methods show the desktop-only message |            |                                           |

### Lists

| List            | Columns                                                                                                                                                                                              | Sort      | Empty                                 |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ------------------------------------- |
| Sign-in methods | Method · Detail · Added                                                                                                                                                                              | added     | never empty                           |
| Devices         | Device (name, e.g. "Claude Code on Ben's MacBook") · Kind (Extension, Mac App, Agent) · Reply · Post Versions · Report Implementations (Switches; the last two only for agents) · Last Used · Revoke | last used | "Connect your browser, Mac or agent." |

### Controls

| Control               | Component           | Label                                                                                         | Key       | Disabled reason                    | State source |
| --------------------- | ------------------- | --------------------------------------------------------------------------------------------- | --------- | ---------------------------------- | ------------ |
| Name                  | TextField           | "Name"                                                                                        | ↩ commits | none                               | user         |
| Avatar                | Button + file input | "Change Picture"                                                                              | Tab ↩     | none                               |              |
| Email                 | TextField read-only | "Email"                                                                                       | none      | "Changing your email comes later." | release      |
| Keyboard shortcuts    | Switch              | "Single-key shortcuts"                                                                        | Space     | none                               | per user     |
| Scope switches        | Switch              | "Reply", "Post Versions", "Report Implementations"                                            | Space     | none                               | device       |
| Revoke                | Button default      | "Revoke"                                                                                      | Tab ↩     | none                               |              |
| Notification switches | Switch              | "Mentions", "Decision requests", "Review requests", "Answers to my questions", "Daily digest" | Space     | none                               | user         |

### Words

| Where          | Text                                                                                                                                                                   | Key                         |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| Title, tabs    | "Account", "Profile", "Sign-In Methods", "Devices and Tokens", "Notifications"                                                                                         | `account.*`                 |
| Profile        | "Name", "Change Picture", "Email", "Changing your email comes later.", "Single-key shortcuts", "Use J, K, R, A and other single keys. They never fire while you type." | `account.profile.*`         |
| Methods        | "Email link", "{email}", "Your only sign-in method can't be removed."                                                                                                  | `account.methods.*`         |
| Device columns | "Device", "Kind", "Reply", "Post Versions", "Report Implementations", "Last Used", "Revoke"                                                                            | `account.devices.columns.*` |
| Device kinds   | "Extension", "Mac App", "Agent"                                                                                                                                        | `account.devices.kinds.*`   |
| Read note      | "Every device can read the workspaces you can see."                                                                                                                    | `account.devices.readNote`  |
| Revoke confirm | "Revoke {device}? It stops working at once and must sign in again." · "Revoke"                                                                                         | `account.devices.revoke.*`  |
| Empty          | "Connect your browser, Mac or agent." · "The Chrome extension, the Mac app and agents like Claude Code sign in from their own Sign In button."                         | `account.devices.empty.*`   |
| Stale          | "Last used {date}"                                                                                                                                                     | `account.devices.lastUsed`  |
| Notifications  | "Emails at once", "Mentions", "Decision requests", "Review requests", "Answers to my questions", "Daily digest", "One email each morning with what changed."           | `account.notifications.*`   |

### Components

| Region                 | Component           | Status      | Notes |
| ---------------------- | ------------------- | ----------- | ----- |
| Tabs, Tables, Switches | Tabs, Table, Switch | new variant |       |

---

# Phone

## Phone inbox

### Purpose

The phone's home: what needs you (A18, J6).

### Header

| Title                        | Tabs                          | Actions |
| ---------------------------- | ----------------------------- | ------- |
| Top bar: Menu, "Inbox", none | kind Tabs scroll horizontally | none    |

### Sections

| Order | Section | Purpose |
| ----- | ------- | ------- |
| 1     | Tabs    |         |
| 2     | Rows    |         |

### Layout

| Zoom                | Columns | Widths                                       | Notes                                 |
| ------------------- | ------- | -------------------------------------------- | ------------------------------------- |
| Phone 390 px        | 1       | full width, 16 px gutters                    | row 72 px, hit area full row; text 16 |
| Phone at 200 % text | 1       | rows grow; nothing truncates the reason line |                                       |

### Lists

As Inbox; thumbnail 48 px; Dismiss by swipe left or the row's More.

### Controls

| Control  | Component   | Label  | Key | Disabled reason | State source |
| -------- | ----------- | ------ | --- | --------------- | ------------ |
| Menu     | Button icon | "Menu" | tap | none            |              |
| Row      | InboxRow    |        | tap | none            |              |
| Row More | Dropdown    | "More" | tap | none            |              |

### Words

As Inbox.

### Components

| Region          | Component        | Status  | Notes    |
| --------------- | ---------------- | ------- | -------- |
| Top bar, drawer | AppShell (phone) | missing | UI-risky |

## Phone feedback view

### Purpose

Answer and approve with the thumb (A18, J6).

### Header

| Title                       | Tabs                                                   | Actions                  |
| --------------------------- | ------------------------------------------------------ | ------------------------ |
| Top bar: Back, "#{n}", More | version Chips scroll horizontally under the screenshot | More: Copy Link, Details |

### Sections

| Order | Section                                                                               | Purpose                                     |
| ----- | ------------------------------------------------------------------------------------- | ------------------------------------------- |
| 1     | Screenshot, full width, tap to zoom                                                   | the centre stays on top (owner, design 9.2) |
| 2     | Title, status, flags, acceptance line                                                 |                                             |
| 3     | Version Chips                                                                         |                                             |
| 4     | Decision card (when open)                                                             |                                             |
| 5     | Thread                                                                                |                                             |
| 6     | Reply field                                                                           | above the bar                               |
| 7     | Action bar, fixed at the bottom above the safe area: Approve · Request Changes · Vote |                                             |

### Layout

| Zoom                | Columns | Widths                                     | Notes                                                                        |
| ------------------- | ------- | ------------------------------------------ | ---------------------------------------------------------------------------- |
| Phone 390 px        | 1       | full width                                 | action bar 64 px + safe area; buttons share the width, each at least 44 high |
| Phone at 200 % text | 1       | bar buttons wrap to two rows; never hidden |                                                                              |

### Controls

| Control         | Component                                                      | Label                | Key              | Disabled reason                     | State source  |
| --------------- | -------------------------------------------------------------- | -------------------- | ---------------- | ----------------------------------- | ------------- |
| Back            | Button icon                                                    | "Back"               | tap, system back | none                                | history       |
| Screenshot      | Image (tap opens a full-screen Modal with pinch zoom)          | "Zoom screenshot"    | tap              | none                                |               |
| Version chips   | Chip group (single select)                                     | "v{n} {Kind}"        | tap              | none                                | URL `version` |
| Reply field     | Textarea (Composer)                                            | placeholder "Reply…" | tap              | offline reason                      | draft         |
| Send            | Button icon in the field                                       | "Send"               | tap              | "Write a reply first."              | composer      |
| Approve         | Button (primary when awaiting review)                          | "Approve"            | tap              | guest: absent, line shown           | role          |
| Request Changes | Button default                                                 | "Request Changes"    | tap              | guest: absent                       | role          |
| Vote            | Button default (opens a Drawer sheet with RadioGroup and Vote) | "Vote"               | tap              | shown only while a decision is open | decision      |
| Details         | Dropdown item → Drawer sheet                                   | "Details"            | tap              | none                                |               |

### Words

| Where                  | Text                                                                     | Key                                   |
| ---------------------- | ------------------------------------------------------------------------ | ------------------------------------- |
| Reply placeholder      | "Reply…"                                                                 | `phone.feedback.replyPlaceholder`     |
| Request Changes prompt | "What should change?"                                                    | `phone.feedback.requestChangesPrompt` |
| Buttons                | "Approve", "Request Changes", "Vote", "Send", "Back", "Details", "Close" | `phone.feedback.actions.*`            |
| Guest line             | "Guests can comment and vote."                                           | `phone.feedback.guestLine`            |
| Others                 | as Feedback view                                                         |                                       |

### Components

| Region      | Component                   | Status      | Notes                                                   |
| ----------- | --------------------------- | ----------- | ------------------------------------------------------- |
| Action bar  | ActionBar                   | missing     | UI-risky; uxpatterns sticky bottom actions; Fitts's Law |
| Zoom viewer | Modal (full screen) + pinch | new variant |                                                         |
| Sheets      | Drawer (bottom)             | new variant | phone only (WEB-21)                                     |

## Desktop-only message

### Purpose

Say plainly that this works on a larger screen (A18).

### Words

| Where   | Text                                                                                                                                                           | Key                                                   |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| Heading | "This works on a larger screen."                                                                                                                               | `phone.desktopOnly.heading`                           |
| Text    | "Open this page on your computer to {task}." (tasks: "change settings", "manage devices", "draw on the screenshot", "post a version", "use the operator area") | `phone.desktopOnly.text`, `phone.desktopOnly.tasks.*` |
| Button  | "Back"                                                                                                                                                         | `common.actions.back`                                 |

### Components

| Region  | Component  | Status  | Notes |
| ------- | ---------- | ------- | ----- |
| Message | EmptyState | missing |       |
---

# Chrome extension

All extension surfaces use the same `snapmark-kit/ui` wrappers and tokens. On-page surfaces live in a shadow root (WEB-30) and follow the page's light or dark preference only for their own chrome.

## Extension popup

### Purpose

Sign in, pick the workspace, start a capture; show where the page comes from (A6, A5, A16, J1, J11).

### Header

| Title                                              | Tabs | Actions           |
| -------------------------------------------------- | ---- | ----------------- |
| Snapmark logo, the organisation › workspace Select | none | Capture (primary) |

### Sections

| Order | Section                                       | Purpose                                      |
| ----- | --------------------------------------------- | -------------------------------------------- |
| 1     | Workspace Select                              | where feedback goes                          |
| 2     | Environment line                              | "omr.ninja · Staging" (A16)                  |
| 3     | Bridge line (localhost only)                  | repo, branch, worktree from the Mac app (A5) |
| 4     | Capture                                       | the one action                               |
| 5     | Recently Sent (up to 5; hidden when none)     | the sent links stay reachable (FBK-7)        |
| 6     | Footer: avatar menu (Open Snapmark, Sign Out) |                                              |

### Layout

| Zoom  | Columns | Widths                                                  | Notes                       |
| ----- | ------- | ------------------------------------------------------- | --------------------------- |
| 100 % | 1       | popup 360 px, height to content (max 520)               | Capture full width, 40 high |
| 150 % | 1       | 360 px (Chrome scales the popup); Recently Sent scrolls | nothing clips; rows wrap    |

### Lists

| List          | Columns               | Sort   | Empty                  |
| ------------- | --------------------- | ------ | ---------------------- |
| Recently Sent | "#{n} {title}" · time | newest | hidden (NTE-8 binding) |

### Controls

| Control              | Component                        | Label                               | Key       | Disabled reason                                                                                                                                          | State source                     |
| -------------------- | -------------------------------- | ----------------------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| Sign In (signed out) | Button primary                   | "Sign In"                           | ↩         | none                                                                                                                                                     | token                            |
| Workspace            | Select (grouped by organisation) | "Workspace"                         | Tab Space | none                                                                                                                                                     | memberships; remembered per site |
| Add Environment link | Link                             | "Add Environment"                   | Tab ↩     | shown only when nothing matches; admins only                                                                                                             | patterns, role                   |
| Capture              | Button primary                   | "Capture" (Tooltip "Capture (⌘⇧K)") | ↩, ⌘⇧K    | guest: "Guests can comment and vote. Ask an admin to make you a member to capture."; restricted page: "Chrome doesn't let extensions capture this page." | role, tab URL                    |
| Recent row           | Listbox item                     | "#{n} {title}"                      | ↑/↓, ↩    | none                                                                                                                                                     | local list                       |
| Account menu         | Dropdown                         | "{name}"                            | Tab ↩     | none                                                                                                                                                     |                                  |
| Try Again            | Button default                   | "Try Again"                         | ↩         | none                                                                                                                                                     | error                            |

### Filters

None.

### Words

| Where                | Text                                                                                                                              | Key                                                       |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| Signed out           | "Sign in to point at what should change." · "Sign In"                                                                             | `ext.popup.signedOut.text`, `.signIn`                     |
| Workspace label      | "Workspace"                                                                                                                       | `ext.popup.workspace`                                     |
| Environment line     | "{host} · {environment}"                                                                                                          | `ext.popup.env.match`                                     |
| No environment       | "{host} matches no environment in {workspace}." · "Add Environment"                                                               | `ext.popup.env.none`, `.add`                              |
| Bridge connected     | "From your Mac: {repo} · {branch} · {worktree}"                                                                                   | `ext.popup.bridge.connected`                              |
| Bridge not running   | "Mac app not running. Open Snapmark on your Mac to add the repo and branch."                                                      | `ext.popup.bridge.notRunning`                             |
| Bridge off           | "Localhost bridge is off in the Mac app's settings."                                                                              | `ext.popup.bridge.off`                                    |
| Bridge no repo       | "Your Mac found no repo serving {host}. A dev server in Docker can't be traced."                                                  | `ext.popup.bridge.noRepo`                                 |
| Capture              | "Capture" · Tooltip "Capture (⌘⇧K)"                                                                                               | `ext.popup.capture`, `.captureTooltip`                    |
| Disabled reasons     | "Guests can comment and vote. Ask an admin to make you a member to capture." · "Chrome doesn't let extensions capture this page." | `ext.popup.disabled.*`                                    |
| Recent heading       | "Recently Sent"                                                                                                                   | `ext.popup.recent`                                        |
| Account menu         | "Open Snapmark", "Sign Out"                                                                                                       | `ext.popup.menu.*`                                        |
| Unreachable          | "Can't reach Snapmark. Is it running on {address}?" · "Try Again"                                                                 | `ext.popup.errors.unreachable`, `common.actions.tryAgain` |
| Signed out by revoke | "You were signed out."                                                                                                            | `ext.popup.signedOutRevoked`                              |

### Components

| Region | Component                                          | Status  | Notes                          |
| ------ | -------------------------------------------------- | ------- | ------------------------------ |
| Popup  | ExtensionPopup (Select, Button, Listbox, Dropdown) | missing | UI-risky; WIN-9 binding: short |

## Extension picker overlay

### Purpose

Point at an element or an area on the running page, seeing region, module, component and file before choosing (A1, A13, A22, J1, J5).

### Header

| Title                | Tabs | Actions      |
| -------------------- | ---- | ------------ |
| Hint bar, top centre | none | Cancel (Esc) |

### Sections

| Order | Section                      | Purpose                                                                                      |
| ----- | ---------------------------- | -------------------------------------------------------------------------------------------- |
| 1     | Hint bar                     | what to do, Esc to cancel                                                                    |
| 2     | Hover outline on the element | 2 px in the remove-red role with a light wash (red is the feedback signal, owner 2026-10-25) |
| 3     | Chip beside the element      | region › module › component · file:line                                                      |
| 4     | Area mode                    | drag outline with the live size                                                              |

### Layout

| Zoom  | Columns               | Widths                                                    | Notes                            |
| ----- | --------------------- | --------------------------------------------------------- | -------------------------------- |
| 100 % | overlay over the page | hint bar max 560 px; chip max 480 px, flips side at edges | never covers the hovered element |
| 150 % | same                  | chip text wraps to two lines                              |                                  |

### Lists

None.

### Controls

| Control | Component                    | Label    | Key                                     | Disabled reason                               | State source        |
| ------- | ---------------------------- | -------- | --------------------------------------- | --------------------------------------------- | ------------------- |
| Element | outline + chip               |          | click, ↩ picks; ↑ parent; ↓ first child | none                                          | DOM, framework data |
| Area    | drag outline                 |          | drag; Esc cancels the drag              | a click or sliver starts over (CAP-8 binding) | pointer             |
| Cancel  | Button light in the hint bar | "Cancel" | Esc                                     | none                                          |                     |

### Words

| Where             | Text                                                                    | Key                     |
| ----------------- | ----------------------------------------------------------------------- | ----------------------- |
| Hint              | "Click an element, or drag an area. ↑ selects the parent. Esc cancels." | `ext.picker.hint`       |
| Chip with code    | "{region} › {module} › {component} · {file}:{line}"                     | `ext.picker.chip.code`  |
| Chip without code | "{region} › {selector}"                                                 | `ext.picker.chip.plain` |
| Frame             | "Inside a frame. Snapmark points at the frame."                         | `ext.picker.frame`      |
| Area size         | "{w} × {h}"                                                             | `ext.picker.size`       |
| Cancel            | "Cancel"                                                                | `common.actions.cancel` |

### Components

| Region  | Component     | Status  | Notes                                                  |
| ------- | ------------- | ------- | ------------------------------------------------------ |
| Overlay | PickerOverlay | missing | UI-risky; shadow root; never in the screenshot (CAP-2) |

## Extension drawing and compose

### Purpose

Mark up the screenshot and say what you expect, with the code location visible (A1, A4, A13, A15, A22, J1).

### Header

| Title                                                                                       | Tabs | Actions                          |
| ------------------------------------------------------------------------------------------- | ---- | -------------------------------- |
| Drawing toolbar on top of the screenshot; compose panel title "New Feedback in {workspace}" | none | Send Feedback (primary), Discard |

### Sections

| Order | Section                                                                                                                                                                                 | Purpose                                           |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| 1     | Drawing toolbar: Select (C), Reference/Card (1), Box/Ellipse (2), Arrow (3), Pen (4), Cross/Hatched Area (5), Highlighter/Spotlight (6), Cut & Move/Redact (7), mark colour, Undo, Redo | the Mac editor's groups and keys (EDT-1 to EDT-8) |
| 2     | Screenshot of the viewport with the picked element outlined                                                                                                                             |                                                   |
| 3     | Compose panel: kind (Request a Change, Comment)                                                                                                                                         |                                                   |
| 4     | Title, Details                                                                                                                                                                          | what you expect (job "Explain")                   |
| 5     | Reference notes (once a reference exists)                                                                                                                                               | "What about 1?" (NTE-3)                           |
| 6     | Module                                                                                                                                                                                  | A13                                               |
| 7     | "Where": region, module, component, file, repo, branch, environment, version                                                                                                            | A15, A22, J5                                      |
| 8     | Footer: Discard, Send Feedback                                                                                                                                                          | WIN-5 binding: primary bottom right               |

### Layout

| Zoom  | Columns            | Widths         | Notes                                                                                            |
| ----- | ------------------ | -------------- | ------------------------------------------------------------------------------------------------ |
| 100 % | screenshot · panel | fluid · 360 px | overlay covers the viewport; toolbar 40 high, centred over the screenshot                        |
| 150 % | screenshot · panel | fluid · 320 px | toolbar icons only, names in Tooltips; "Where" collapses to its first three rows with "Show All" |

### Lists

| List            | Columns                   | Sort        | Empty                                                                                      |
| --------------- | ------------------------- | ----------- | ------------------------------------------------------------------------------------------ |
| Reference notes | number diamond · Textarea | by number   | heading hidden until a reference exists (NTE-8)                                            |
| Where           | label · value · Copy      | fixed order | per field "Not found"; the whole block falls back to one line when no code location exists |

### Controls

| Control           | Component               | Label                                                             | Key                                         | Disabled reason                                     | State source  |
| ----------------- | ----------------------- | ----------------------------------------------------------------- | ------------------------------------------- | --------------------------------------------------- | ------------- |
| Tools             | DrawingToolbar          | Select, Reference, Box, Arrow, Pen, Remove, Highlight, Edit Image | C, 1–7 (not while typing; KEY-3)            | Pen pointer only (EX-6)                             |               |
| Mark colour       | Popover with swatches   | "Mark Colour"                                                     | Tab ↩                                       | Remove and Highlight ignore it (EX-1)               |               |
| Undo, Redo        | Button icons + Tooltips | "Undo (⌘Z)", "Redo (⇧⌘Z)"                                         | ⌘Z, ⇧⌘Z                                     | nothing to undo                                     | history       |
| Kind              | Tabs (segmented)        | "Request a Change", "Comment"                                     | ←/→                                         | none                                                |               |
| Title             | TextField               | "Title"                                                           | Tab                                         | none                                                |               |
| Details           | Textarea                | "Details"                                                         | Tab                                         | none                                                |               |
| Reference note    | Textarea                | "Note for {n}" (label), placeholder "What about {n}?"             | Tab; placing a reference focuses it (NTE-2) | none                                                |               |
| Module            | Autocomplete            | "Module"                                                          | type, ↩                                     | create option for members only                      | modules, role |
| Copy (Where rows) | Button icon + Tooltip   | "Copy {field}"                                                    | Tab ↩                                       | none                                                |               |
| Show All          | Button light            | "Show All"                                                        | Tab ↩                                       | 150 % only                                          |               |
| Discard           | Button default          | "Discard"                                                         | Esc at the last step (KEY-5)                | none                                                |               |
| Send Feedback     | Button primary          | "Send Feedback"                                                   | ⌘↩                                          | "Write what you expect, or draw on the screenshot." | form, marks   |

### Filters

None.

### Words

| Where                      | Text                                                                                                                                                                        | Key                                                     |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| Panel title                | "New Feedback in {workspace}"                                                                                                                                               | `ext.compose.title`                                     |
| Kind                       | "Request a Change", "Comment"                                                                                                                                               | `ext.compose.kind.*`                                    |
| Title label, placeholder   | "Title", "Total should be bold"                                                                                                                                             | `ext.compose.titleLabel`, `.titlePlaceholder`           |
| Details label, placeholder | "Details", "What should it look like instead?"                                                                                                                              | `ext.compose.detailsLabel`, `.detailsPlaceholder`       |
| References heading         | "References"                                                                                                                                                                | `ext.compose.references`                                |
| Reference note             | "Note for {n}" · "What about {n}?"                                                                                                                                          | `ext.compose.refLabel`, `.refPlaceholder`               |
| Module                     | "Module", "Choose or type a module", "Add module “{name}”"                                                                                                                  | `ext.compose.module.*`                                  |
| Where heading              | "Where"                                                                                                                                                                     | `ext.compose.where.heading`                             |
| Where labels               | "Region", "Module", "Component", "File", "Repo", "Branch", "Environment", "Version"                                                                                         | `feedback.details.*` (shared)                           |
| Not found                  | "Not found"                                                                                                                                                                 | `feedback.details.notFound`                             |
| No code                    | "No code location found. The agent will search by page, selector and text."                                                                                                 | `ext.compose.where.noCode`                              |
| Repo unknown on localhost  | "Unknown. Open the Mac app to add it."                                                                                                                                      | `ext.compose.where.repoUnknown`                         |
| Show all                   | "Show All"                                                                                                                                                                  | `common.actions.showAll`                                |
| Tool names                 | "Select", "Reference", "Card", "Box", "Ellipse", "Arrow", "Pen", "Cross", "Hatched Area", "Highlighter", "Spotlight", "Cut & Move", "Redact", "Mark Colour", "Undo", "Redo" | `annotations.tools.*` (shared with the Mac app's names) |
| Tool tooltip               | "{tool} ({key}) · press again for {next}"                                                                                                                                   | `annotations.tooltip`                                   |
| Buttons                    | "Discard", "Send Feedback", "Sending…", "Sending… {percent} %"                                                                                                              | `ext.compose.actions.*`                                 |
| Disabled                   | "Write what you expect, or draw on the screenshot."                                                                                                                         | `ext.compose.disabled`                                  |
| Error                      | "Couldn't send the feedback: Snapmark didn't answer. Your marks and text are kept. Try again." · "Try Again"                                                                | `ext.compose.errors.send`                               |

### Components

| Region  | Component                                                                 | Status                                            | Notes                                                         |
| ------- | ------------------------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------- |
| Toolbar | DrawingToolbar                                                            | have (Mac editor) → new variant for the extension | same groups, keys and colours from `snapmark-kit/annotations` |
| Canvas  | ScreenshotCanvas (draw)                                                   | missing                                           |                                                               |
| Panel   | ComposePanel (Tabs, Input, Textarea, Autocomplete, AnchorDetails, Button) | missing                                           | UI-risky                                                      |

## Extension sent confirmation

### Purpose

Confirm with a link and offer the next capture (J1; Peak-End Rule).

### Header

| Title                          | Tabs | Actions                      |
| ------------------------------ | ---- | ---------------------------- |
| "Sent to {workspace} as #{n}." | none | Open, Capture Another, Close |

### Sections

| Order | Section                                            | Purpose |
| ----- | -------------------------------------------------- | ------- |
| 1     | One line and two buttons, bottom right of the page |         |

### Layout

| Zoom  | Columns | Widths                        | Notes                               |
| ----- | ------- | ----------------------------- | ----------------------------------- |
| 100 % | 1       | 360 px, 16 px from the corner | stays 6 s; pauses on hover or focus |
| 150 % | 1       | 320 px                        | buttons stack                       |

### Controls

| Control         | Component             | Label             | Key | Disabled reason | State source |
| --------------- | --------------------- | ----------------- | --- | --------------- | ------------ |
| Open            | Button default        | "Open"            | ↩   | none            |              |
| Capture Another | Button primary        | "Capture Another" | ⌘⇧K | none            |              |
| Close           | Button icon + Tooltip | "Close (Esc)"     | Esc | none            |              |

### Words

| Where   | Text                               | Key             |
| ------- | ---------------------------------- | --------------- |
| Line    | "Sent to {workspace} as #{n}."     | `ext.sent.line` |
| Buttons | "Open", "Capture Another", "Close" | `ext.sent.*`    |

### Components

| Region | Component                      | Status  | Notes |
| ------ | ------------------------------ | ------- | ----- |
| Panel  | SentPanel (polite live region) | missing | ACC-6 |

---

# Mac app (minimal new surfaces)

The Mac app keeps its own rules: macOS words, Title Case (WRD-1), native controls, its Settings window and session window. Nothing here changes the local workflow without an account (intent "Must not change").

## Settings › Online tab

### Purpose

Sign in to Snapmark online through the browser, and turn the localhost bridge on or off (A26, A5, J7, J11).

### Header

| Title           | Tabs                                                   | Actions |
| --------------- | ------------------------------------------------------ | ------- |
| Settings window | General · Capture · Shortcuts · **Online** (new, last) | none    |

### Sections

| Order | Section                                                                         | Purpose |
| ----- | ------------------------------------------------------------------------------- | ------- |
| 1     | Snapmark Online: signed out (one line, Sign In…) or signed in (email, Sign Out) |         |
| 2     | Device code panel while waiting for the browser                                 |         |
| 3     | Localhost Bridge: Switch with its status line                                   | A5      |

### Layout

| Zoom  | Columns                           | Widths            | Notes |
| ----- | --------------------------------- | ----------------- | ----- |
| 100 % | the Settings window's form layout | as the other tabs |       |
| 150 % | n/a (macOS)                       |                   |       |

### Controls

| Control          | Component               | Label              | Key       | Disabled reason | State source                |
| ---------------- | ----------------------- | ------------------ | --------- | --------------- | --------------------------- |
| Sign In…         | native button           | "Sign In…"         | ↩         | none            | token                       |
| Open Browser     | native button (default) | "Open Browser"     | ↩         | none            | device flow                 |
| Cancel           | native button           | "Cancel"           | Esc       | none            |                             |
| Sign Out         | native button           | "Sign Out"         | Tab Space | none            |                             |
| Localhost Bridge | native switch           | "Localhost Bridge" | Space     | none            | Mac setting (on by default) |

### Words

| Where           | Text                                                                                                                                      | Key                             |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| Tab             | "Online"                                                                                                                                  | `mac.settings.online.tab`       |
| Heading         | "Snapmark Online"                                                                                                                         | `mac.settings.online.heading`   |
| Signed out line | "Share sessions with your team, and let the Chrome extension find your repos."                                                            | `mac.settings.online.signedOut` |
| Buttons         | "Sign In…", "Sign Out", "Open Browser", "Cancel"                                                                                          | `mac.settings.online.*`         |
| Code            | "Enter This Code in Your Browser: {code}"                                                                                                 | `mac.settings.online.code`      |
| Signed in       | "Signed In as {email}"                                                                                                                    | `mac.settings.online.signedIn`  |
| Expired         | "The code expired. Sign in again."                                                                                                        | `mac.settings.online.expired`   |
| Bridge          | "Localhost Bridge" · "Tells the Chrome extension which repo a localhost page comes from." · "Extension connected" · "Extension not found" | `mac.settings.bridge.*`         |

### Components

| Region | Component           | Status                                      | Notes                  |
| ------ | ------------------- | ------------------------------------------- | ---------------------- |
| Tab    | Settings window tab | have (General, Capture, Shortcuts); new tab | WIN-7: applies at once |

## Share to Workspace sheet and sync status

### Purpose

Link a session to a workspace and see its sync at a glance (A26, J7).

### Header

| Title                                     | Tabs | Actions                        |
| ----------------------------------------- | ---- | ------------------------------ |
| Sheet: "Share “{session}” to a Workspace" | none | Share (default button), Cancel |

### Sections

| Order | Section                                                      | Purpose                                        |
| ----- | ------------------------------------------------------------ | ---------------------------------------------- |
| 1     | Workspace pop-up (Organisation › Workspace)                  |                                                |
| 2     | Session window footer: sync status                           |                                                |
| 3     | Menu bar menu header suffix: "· Synced" or "· Offline"       | where the eye already is (Selective Attention) |
| 4     | Session menu: Share to Workspace…, View Online, Stop Sharing | WIN-9: names its object                        |
| 5     | Editor note callout: Edited elsewhere                        | design 7                                       |

### Layout

| Zoom  | Columns      | Widths | Notes |
| ----- | ------------ | ------ | ----- |
| 100 % | native sheet | 420 pt |       |

### Controls

| Control             | Component                            | Label                 | Key          | Disabled reason                   | State source |
| ------------------- | ------------------------------------ | --------------------- | ------------ | --------------------------------- | ------------ |
| Share to Workspace… | toolbar button and Session menu item | "Share to Workspace…" | Session menu | not signed in: the sheet explains | token        |
| Workspace           | native pop-up                        | "Workspace"           | Space        | none                              | memberships  |
| Share               | native default button                | "Share"               | ↩            | none                              |              |
| Cancel              | native button                        | "Cancel"              | Esc          | none                              |              |
| View Online         | menu item, footer link               | "View Online"         | Session menu | not shared: hidden                | link         |
| Stop Sharing        | menu item                            | "Stop Sharing…"       | Session menu | not shared: hidden                | link         |
| Open Settings…      | sheet button                         | "Open Settings…"      | ↩            | none                              |              |

### Words

| Where            | Text                                                                                                                        | Key                        |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| Sheet title      | "Share “{session}” to a Workspace"                                                                                          | `mac.share.title`          |
| Not signed in    | "Sign in to Snapmark online first." · "Open Settings…"                                                                      | `mac.share.signIn`         |
| Buttons          | "Share", "Cancel", "View Online", "Stop Sharing…"                                                                           | `mac.share.*`              |
| Footer status    | "Synced · {time}", "Syncing {n} Changes", "Offline · {n} Changes Waiting", "Not Shared"                                     | `mac.sync.*`               |
| Menu suffix      | "· Synced", "· Offline"                                                                                                     | `mac.sync.menuSuffix.*`    |
| Edited elsewhere | "Edited elsewhere. The other text is kept in the thread online."                                                            | `mac.sync.editedElsewhere` |
| Stop confirm     | "Stop Sharing “{session}”? The online copy stays in {workspace}; new changes stay on this Mac." · "Stop Sharing" · "Cancel" | `mac.share.stop.*`         |

### Components

| Region              | Component                                                   | Status                                 | Notes |
| ------------------- | ----------------------------------------------------------- | -------------------------------------- | ----- |
| Sheet, footer, menu | native AppKit-like Electron surfaces in the Mac app's style | have (session window, menu); new items |       |

---

# Operator area

A separate layout under `/operator` (design 8.0, A17): its own sidebar (Waitlist, Invitations, Organisations, Users, Flags, Usage), a header label "Operator" in neutral text so staff always know where they are, and "Back to App". Desktop only.

## Operator shell and Waitlist

### Purpose

Invite people from the waitlist in batches (J8, A17).

### Header

| Title                                | Tabs                             | Actions                                     |
| ------------------------------------ | -------------------------------- | ------------------------------------------- |
| "Waitlist" (header label "Operator") | Waiting · Invited · Joined · All | Invite {n} (primary, only with a selection) |

### Sections

| Order | Section                                           | Purpose |
| ----- | ------------------------------------------------- | ------- |
| 1     | Search, Role filter, Sort                         |         |
| 2     | Selection bar ("{n} selected", Invite {n}, Clear) |         |
| 3     | Table                                             |         |

### Layout

| Zoom  | Columns                 | Widths                       | Notes                |
| ----- | ----------------------- | ---------------------------- | -------------------- |
| 100 % | operator sidebar · main | 220 · fluid (table max 1200) |                      |
| 150 % | rail · main             | 56 · fluid                   | Source column hidden |

### Lists

| List     | Columns                                                                                             | Sort                              | Empty                |
| -------- | --------------------------------------------------------------------------------------------------- | --------------------------------- | -------------------- |
| Waitlist | checkbox · Email · Role · Joined (date) · Source (`ref`) · Status (Waiting, Invited, Joined) · More | Joined, oldest first (fair queue) | "No one is waiting." |

### Controls

| Control      | Component      | Label                                 | Key                 | Disabled reason                | State source |
| ------------ | -------------- | ------------------------------------- | ------------------- | ------------------------------ | ------------ |
| Status tabs  | Tabs           | "Waiting", "Invited", "Joined", "All" | ←/→                 | none                           | URL `status` |
| Search       | Input          | "Search emails"                       | /                   | none                           | URL `q`      |
| Role filter  | Chip + Popover | "Role"                                | F then R            | none                           | URL `role`   |
| Sort         | Select         | "Sort"                                | Tab Space           | none                           | URL `sort`   |
| Row checkbox | Checkbox       | "Select {email}"                      | X, ⇧X range, ⌘A all | Joined rows: "Already joined." | row status   |
| Invite {n}   | Button primary | "Invite {n}"                          | ⌘↩                  | no selection: hidden           | selection    |
| Clear        | Button light   | "Clear Selection"                     | Esc                 | none                           |              |
| Row More     | Dropdown       | "Invite", "Remove from Waitlist"      | Tab ↩               | none                           |              |
| Confirm      | Modal          | "Send Invitations", "Cancel"          | ↩, Esc              | none                           |              |
| Back to App  | Link           | "Back to App"                         | Tab ↩               | none                           |              |

### Filters

| Filter | Default              | Options                       | Clear behaviour |
| ------ | -------------------- | ----------------------------- | --------------- |
| Status | Waiting              | Waiting, Invited, Joined, All | tab             |
| Role   | all                  | the landing's roles           | chip ×          |
| Sort   | Joined, oldest first | Joined oldest, Joined newest  | Select          |

### Words

| Where               | Text                                                                                                                       | Key                             |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| Operator label, nav | "Operator", "Waitlist", "Invitations", "Organisations", "Users", "Flags", "Usage", "Back to App"                           | `operator.nav.*`                |
| Tabs                | "Waiting", "Invited", "Joined", "All"                                                                                      | `operator.waitlist.tabs.*`      |
| Columns             | "Email", "Role", "Joined", "Source", "Status"                                                                              | `operator.waitlist.columns.*`   |
| Selection           | "{n} selected", "Invite {n}", "Clear Selection"                                                                            | `operator.waitlist.selection.*` |
| Confirm             | "Invite {n} people? Each gets an email to set up their team. Invitations can be revoked, not unsent." · "Send Invitations" | `operator.waitlist.confirm.*`   |
| Row menu            | "Invite", "Remove from Waitlist"                                                                                           | `operator.waitlist.menu.*`      |
| Empty               | "No one is waiting."                                                                                                       | `operator.waitlist.empty`       |
| Disabled            | "Already joined."                                                                                                          | `operator.waitlist.joined`      |

### Components

| Region | Component                        | Status      | Notes                        |
| ------ | -------------------------------- | ----------- | ---------------------------- |
| Shell  | OperatorShell (AppShell variant) | missing     |                              |
| Table  | Table with selection             | new variant | UI-risky; uxpatterns `table` |

## Operator: Invitations

### Purpose

Track, resend and revoke invitations (J8).

### Header

| Title         | Tabs                                      | Actions |
| ------------- | ----------------------------------------- | ------- |
| "Invitations" | Sent · Accepted · Expired · Revoked · All | none    |

### Lists

| List        | Columns                                                                                                | Sort         | Empty                  |
| ----------- | ------------------------------------------------------------------------------------------------------ | ------------ | ---------------------- |
| Invitations | Email · Kind (Waitlist, Organisation) · Organisation · Sent By · Sent · Status · More (Resend, Revoke) | Sent, newest | "No invitations here." |

### Layout

| Zoom  | Columns         | Widths      | Notes               |
| ----- | --------------- | ----------- | ------------------- |
| 100 % | sidebar · table | 220 · fluid |                     |
| 150 % | rail · table    |             | Organisation hidden |

### Controls

| Control  | Component | Label              | Key   | Disabled reason               | State source |
| -------- | --------- | ------------------ | ----- | ----------------------------- | ------------ |
| Tabs     | Tabs      | see header         | ←/→   | none                          | URL `status` |
| Search   | Input     | "Search emails"    | /     | none                          | URL `q`      |
| Row More | Dropdown  | "Resend", "Revoke" | Tab ↩ | Accepted: "Already accepted." | status       |

### Filters

Status tabs and search.

### Words

| Where                | Text                                                                                                                             | Key                             |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| Title, tabs, columns | "Invitations", "Sent", "Accepted", "Expired", "Revoked", "All", "Email", "Kind", "Waitlist", "Organisation", "Sent By", "Status" | `operator.invitations.*`        |
| Menu                 | "Resend", "Revoke"                                                                                                               | `operator.invitations.menu.*`   |
| Revoke confirm       | "Revoke the invitation to {email}? The link stops working." · "Revoke"                                                           | `operator.invitations.revoke.*` |
| Empty                | "No invitations here."                                                                                                           | `operator.invitations.empty`    |

### Components

| Region | Component | Status      | Notes |
| ------ | --------- | ----------- | ----- |
| Table  | Table     | new variant |       |

## Operator: Organisations and one organisation

### Purpose

See organisations read-only and grant seats by hand (J10, J8; design 2 "seats granted by hand").

### Header

| Title                              | Tabs | Actions                                  |
| ---------------------------------- | ---- | ---------------------------------------- |
| "Organisations" / "{organisation}" | none | one organisation: Change Seats (primary) |

### Sections

| Order | Section                                                                                                                               | Purpose |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| 1     | List: search, Table                                                                                                                   |         |
| 2     | One organisation: facts (created, owner, seat line), Members table (read-only), Workspaces table (read-only), feature flags on for it |         |

### Layout

| Zoom  | Columns        | Widths         | Notes                                  |
| ----- | -------------- | -------------- | -------------------------------------- |
| 100 % | sidebar · main | 220 · max 1040 | facts as a two-column description list |
| 150 % | rail · main    |                | facts one column                       |

### Lists

| List                 | Columns                                                                                                | Sort          | Empty                   |
| -------------------- | ------------------------------------------------------------------------------------------------------ | ------------- | ----------------------- |
| Organisations        | Organisation · Owner · Members · Guests · Seats (used of total) · Workspaces · Created · Last Activity | Last Activity | "No organisations yet." |
| Members (one org)    | Name · Email · Role · Joined                                                                           | role, name    |                         |
| Workspaces (one org) | Workspace · Feedback · Created                                                                         | name          |                         |

### Controls

| Control      | Component              | Label                            | Key    | Disabled reason             | State source |
| ------------ | ---------------------- | -------------------------------- | ------ | --------------------------- | ------------ |
| Search       | Input                  | "Search organisations"           | /      | none                        | URL `q`      |
| Row          | Table row              |                                  | ↑/↓, ↩ | none                        |              |
| Change Seats | Button primary         | "Change Seats"                   | Tab ↩  | none                        |              |
| Seats        | NumberInput (in Modal) | "Seats"                          | ↑/↓    | below used: inline error    |              |
| Reason       | Textarea               | "Reason (kept in the audit log)" | Tab    | none                        |              |
| Save         | Button primary         | "Save"                           | ⌘↩     | "Give a reason." when empty | form         |
| User link    | Link                   | "{name}"                         | Tab ↩  | none                        |              |

### Words

| Where           | Text                                                                                                             | Key                             |
| --------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| Titles, columns | "Organisations", "Organisation", "Owner", "Members", "Guests", "Seats", "Workspaces", "Created", "Last Activity" | `operator.orgs.*`               |
| Seats cell      | "{used} of {total}"                                                                                              | `operator.orgs.seatsCell`       |
| Read-only note  | "Read-only. Every view is logged."                                                                               | `operator.orgs.readOnly`        |
| Change seats    | "Change Seats", "Seats for {organisation}", "Seats", "Reason (kept in the audit log)", "Save", "Give a reason."  | `operator.orgs.seats.*`         |
| Below used      | "{used} seats are in use. Remove members first, or keep at least {used}."                                        | `operator.orgs.seats.belowUsed` |
| Empty           | "No organisations yet."                                                                                          | `operator.orgs.empty`           |

### Components

| Region       | Component                    | Status      | Notes                                           |
| ------------ | ---------------------------- | ----------- | ----------------------------------------------- |
| Tables       | Table                        | new variant |                                                 |
| Seats dialog | Modal, NumberInput, Textarea | new variant | every change writes an audit event (design 8.0) |

## Operator: Users and one user

### Purpose

Look a person up: organisations, roles, devices count, last sign-in (J8).

### Header

| Title              | Tabs | Actions          |
| ------------------ | ---- | ---------------- |
| "Users" / "{name}" | none | none (read-only) |

### Lists

| List                  | Columns                                              | Sort         | Empty           |
| --------------------- | ---------------------------------------------------- | ------------ | --------------- |
| Users                 | Name · Email · Organisations · Last Sign-In · Joined | Last Sign-In | "No users yet." |
| One user: memberships | Organisation · Role                                  | name         |                 |
| One user: devices     | Kind · Last Used                                     | last used    | "No devices."   |

### Layout

| Zoom  | Columns        | Widths         | Notes |
| ----- | -------------- | -------------- | ----- |
| 100 % | sidebar · main | 220 · max 1040 |       |
| 150 % | rail · main    |                |       |

### Controls

| Control           | Component | Label            | Key    | Disabled reason | State source |
| ----------------- | --------- | ---------------- | ------ | --------------- | ------------ |
| Search            | Input     | "Search users"   | /      | none            | URL `q`      |
| Row               | Table row |                  | ↑/↓, ↩ | none            |              |
| Organisation link | Link      | "{organisation}" | Tab ↩  | none            |              |

### Words

| Where           | Text                                                                                             | Key                      |
| --------------- | ------------------------------------------------------------------------------------------------ | ------------------------ |
| Titles, columns | "Users", "Name", "Email", "Organisations", "Last Sign-In", "Joined", "Role", "Kind", "Last Used" | `operator.users.*`       |
| Empty           | "No users yet." · "No devices."                                                                  | `operator.users.empty*`  |
| Read-only note  | "Read-only. Every view is logged."                                                               | `operator.orgs.readOnly` |

### Components

| Region | Component | Status      | Notes |
| ------ | --------- | ----------- | ----- |
| Tables | Table     | new variant |       |

## Operator: Flags

### Purpose

Turn a feature on for everyone or per organisation (A17).

### Header

| Title           | Tabs | Actions                           |
| --------------- | ---- | --------------------------------- |
| "Feature Flags" | none | none (flags are declared in code) |

### Lists

| List  | Columns                                                              | Sort | Empty               |
| ----- | -------------------------------------------------------------------- | ---- | ------------------- |
| Flags | Flag · Description · Everyone (Switch) · Organisations (count, Edit) | name | "No feature flags." |

### Layout

| Zoom  | Columns        | Widths        | Notes             |
| ----- | -------------- | ------------- | ----------------- |
| 100 % | sidebar · main | 220 · max 960 |                   |
| 150 % | rail · main    |               | Description wraps |

### Controls

| Control            | Component                                    | Label                                | Key   | Disabled reason | State source |
| ------------------ | -------------------------------------------- | ------------------------------------ | ----- | --------------- | ------------ |
| Everyone           | Switch                                       | "On for everyone"                    | Space | none            | flag         |
| Edit organisations | Button light → Modal with Autocomplete multi | "Edit" / "Organisations with {flag}" | Tab ↩ | none            |              |
| Save               | Button primary                               | "Save"                               | ⌘↩    | none            |              |

### Words

| Where          | Text                                                                | Key                    |
| -------------- | ------------------------------------------------------------------- | ---------------------- |
| Title, columns | "Feature Flags", "Flag", "Description", "Everyone", "Organisations" | `operator.flags.*`     |
| Switch, edit   | "On for everyone", "Edit", "Organisations with {flag}", "Save"      | `operator.flags.*`     |
| Empty          | "No feature flags."                                                 | `operator.flags.empty` |

### Components

| Region | Component     | Status      | Notes |
| ------ | ------------- | ----------- | ----- |
| Table  | Table, Switch | new variant |       |

## Operator: Usage

### Purpose

See whether the beta is used (J8; intent success measure).

### Header

| Title   | Tabs                       | Actions |
| ------- | -------------------------- | ------- |
| "Usage" | Last 7 Days · Last 30 Days | none    |

### Sections

| Order | Section                                                                                 | Purpose                   |
| ----- | --------------------------------------------------------------------------------------- | ------------------------- |
| 1     | Four tiles: Organisations, Active Users, Feedback Accepted Through MCP, Captures Stored | the success measure first |
| 2     | Daily table: Date, New Feedback, Accepted, MCP Calls, Active Users                      |                           |

### Layout

| Zoom  | Columns             | Widths   | Notes |
| ----- | ------------------- | -------- | ----- |
| 100 % | 4 tiles, then table | max 1040 |       |
| 150 % | 2 × 2 tiles         |          |       |

### Lists

| List  | Columns                                                   | Sort         | Empty                        |
| ----- | --------------------------------------------------------- | ------------ | ---------------------------- |
| Daily | Date · New Feedback · Accepted · MCP Calls · Active Users | date, newest | "No activity in this range." |

### Controls

| Control | Component | Label                         | Key | Disabled reason | State source |
| ------- | --------- | ----------------------------- | --- | --------------- | ------------ |
| Range   | Tabs      | "Last 7 Days", "Last 30 Days" | ←/→ | none            | URL `range`  |

### Words

| Where       | Text                                                                                | Key                        |
| ----------- | ----------------------------------------------------------------------------------- | -------------------------- |
| Title, tabs | "Usage", "Last 7 Days", "Last 30 Days"                                              | `operator.usage.*`         |
| Tiles       | "Organisations", "Active Users", "Feedback Accepted Through MCP", "Captures Stored" | `operator.usage.tiles.*`   |
| Columns     | "Date", "New Feedback", "Accepted", "MCP Calls", "Active Users"                     | `operator.usage.columns.*` |
| Empty       | "No activity in this range."                                                        | `operator.usage.empty`     |

### Components

| Region | Component | Status      | Notes                                                         |
| ------ | --------- | ----------- | ------------------------------------------------------------- |
| Tiles  | StatTile  | missing     | uxpatterns `statistics`; numbers only, no charts in release 1 |
| Table  | Table     | new variant |                                                               |

---

## Layout checks

- At 150 % no persistent control hides: the sidebar becomes a rail with Tooltips; the feedback footer and the phone action bar stay fixed; tables drop rank-3 columns into Tooltips or row dialogs, never the primary action.
- Every list has an empty state with words; every screen names its one primary, or says why it has none (Inbox, lists with rows, Sessions, operator Users).
- Every action in interaction.md's Action Behaviour table appears above as a control or a menu item.
