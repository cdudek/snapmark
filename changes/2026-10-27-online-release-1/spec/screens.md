---
type: design-screens
change: 2026-10-27-online-release-1
created: 2026-10-27
status: draft, for the Stage 2 gate
---

# Screens

**Scope: release-scoped.** The message keys seed `snapmark-web/messages/en.json` and the extension's messages in milestone 1; the component inventory seeds `snapmark-kit/ui`.

## How to read this file

- **Words.** Every visible string has a proposed message key, `<area>.<screen>.<part>`. Shared words live under `common.*` (`common.actions.cancel`). `{name}` marks a value. `microcopy.md` is the full catalogue and agrees with these tables (folded in 2026-10-28). A count written `{n} …` here is an ICU plural there. A busy button keeps its label and shows a spinner; the busy text ("Sending the feedback…") is only announced. Case: Title Case for buttons, menu items, tabs, sidebar items, chips, table headers, dialog and page titles and headings; sentence case for field labels, switch labels, placeholders, messages and body text; a headline written as a full sentence (landing, emails, empty states, Welcome) takes sentence case and a full stop. Marketing and welcome copy follows A30 (outcomes, never a feature list).
- **Glossary words.** "Screenshot" is the noun; "Capture" is only the verb and the button. Numbered circles are "references", anything drawn is a "mark". British spelling on the web ("organisation", "colour"); the Mac app keeps macOS's "Color". The generic error fallback is "Snapmark had a problem." (owner-decisions.md #20).
- **Menus.** Every Dropdown item has an icon before its label (ADR 2026-09-26 "Icons before menu items"); destructive items come last, after a separator.
- **Components.** HeroUI components behind `snapmark-kit/ui` wrappers (A9, A24). Status: **new variant** = a HeroUI component behind a thin Snapmark wrapper, styled by tokens only (none exists yet; built in milestone 1); **missing** = a Snapmark component composed from HeroUI parts, to be built; **have** = exists today in the Mac app.
- **Colour.** System neutrals for surfaces and text; the brand blue, named only by its token `accent` (never a hex: white on the old literal fails 4.5:1), only on the one filled primary per region; no blue borders, links, icons or labels. Links are underlined neutral text. Snapmark's `info` is neutral: the chosen tab, the current page and "is" chips use a neutral mark, never blue. Keyboard focus shows the `focus` ring only on keyboard focus (WEB-9, a proposed web exception to ACC-2; see interaction.md). Remove red stays the picker outline and remove marks only.
- **Sizes.** Control heights 32 / 40 / 48, radius 8 (12 for dialogs), control text 16, from tokens (design-system owner decisions). Hit areas 32 pointer, 44 touch.
- **Layout zoom.** "100 %" is a 1440 px window. "150 %" equals a 960 CSS px viewport. The design system caps desktop zoom at 130 %; 150 % is checked anyway so nothing clips.
- **Keys** follow WEB-8 and WEB-19: ⌘ on a Mac, Ctrl elsewhere. "Tab ↩" means the control is reached by Tab and pressed with ↩ or Space, with no own shortcut.

## Shared component inventory

| Component                                                                                                                   | Built from (HeroUI)                                                        | Status                                                                                           | Used on                                                                                                                                                                       |
| --------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Button (primary, secondary, ghost, outlined; tone neutral or `pass`; destructive = outlined + `pass`, never a red fill)     | Button                                                                     | new variant                                                                                      | everywhere                                                                                                                                                                    |
| TextField, EmailField                                                                                                       | Input                                                                      | new variant                                                                                      | forms                                                                                                                                                                         |
| Textarea                                                                                                                    | Textarea                                                                   | new variant                                                                                      | composer, notes                                                                                                                                                               |
| Select                                                                                                                      | Select                                                                     | new variant                                                                                      | roles, kinds, workspace pickers                                                                                                                                               |
| Autocomplete (module picker, people picker)                                                                                 | Autocomplete                                                               | new variant                                                                                      | compose, decision dialog                                                                                                                                                      |
| TagInput (emails)                                                                                                           | Input + Chip                                                               | missing                                                                                          | Invite People                                                                                                                                                                 |
| Switch, Checkbox, CheckboxGroup, RadioGroup                                                                                 | same                                                                       | new variant                                                                                      | settings, dialogs, decision card                                                                                                                                              |
| DatePicker                                                                                                                  | DatePicker                                                                 | new variant                                                                                      | due date                                                                                                                                                                      |
| NumberInput                                                                                                                 | NumberInput                                                                | new variant                                                                                      | seats                                                                                                                                                                         |
| Tabs (a screen's own sections only, never a filter or a value)                                                              | Tabs                                                                       | new variant                                                                                      | My Work, settings, account, panel tabs                                                                                                                                        |
| SegmentedControl (choose one value)                                                                                         | Tabs (segmented style) or ToggleButtonGroup                                | new variant                                                                                      | compose Kind, phone version choice                                                                                                                                            |
| Modal (dialog)                                                                                                              | Modal                                                                      | new variant                                                                                      | dialogs                                                                                                                                                                       |
| ConfirmDialog                                                                                                               | Modal                                                                      | new variant (Cancel default and focused, destructive outlined + `pass`, consequence in the body) | Delete Workspace, Leave Organisation, Remove Member, Revoke Device, Revoke Invitation, Stop Sharing, role changes up and to Guest, write scopes on, Feature Flag for everyone |
| ZoomViewer (phone)                                                                                                          | Modal (full screen)                                                        | new variant (pinch plus Zoom In, Zoom Out, Fit buttons at 44 px and double-tap; WCAG 2.5.1)      | phone feedback view                                                                                                                                                           |
| Drawer (phone sidebar, phone sheets)                                                                                        | Drawer                                                                     | new variant                                                                                      | phone only                                                                                                                                                                    |
| Popover (filters)                                                                                                           | Popover                                                                    | new variant                                                                                      | filter chips                                                                                                                                                                  |
| Dropdown (More menus, switcher)                                                                                             | Dropdown                                                                   | new variant                                                                                      | rows, headers                                                                                                                                                                 |
| Tooltip                                                                                                                     | Tooltip                                                                    | new variant                                                                                      | every icon control                                                                                                                                                            |
| Kbd                                                                                                                         | Kbd                                                                        | new variant                                                                                      | ⌘K in sidebar, menus, shortcuts list                                                                                                                                          |
| Avatar, AvatarGroup                                                                                                         | Avatar                                                                     | new variant                                                                                      | rows, thread                                                                                                                                                                  |
| Chip (filters and toggles only; clickable)                                                                                  | Chip                                                                       | new variant                                                                                      | filter bar, Inbox kinds, one module's status, operator status, invitation status and usage range                                                                              |
| Badge (status, flag, kind, Guest, role; inert, never a button)                                                              | Chip as a static span                                                      | new variant                                                                                      | rows, header, thread, members                                                                                                                                                 |
| Table                                                                                                                       | Table                                                                      | new variant                                                                                      | settings, operator, modules                                                                                                                                                   |
| Listbox                                                                                                                     | Listbox                                                                    | new variant                                                                                      | command menu results, sidebar                                                                                                                                                 |
| Breadcrumbs                                                                                                                 | Breadcrumbs                                                                | new variant                                                                                      | feedback view                                                                                                                                                                 |
| BackLink ("< {place}")                                                                                                      | Link                                                                       | new variant                                                                                      | phone top bar; desktop only if owner-decisions.md #13 picks it                                                                                                                |
| Alert (callout)                                                                                                             | Alert                                                                      | new variant                                                                                      | errors, notices                                                                                                                                                               |
| Skeleton, Spinner, Progress                                                                                                 | same                                                                       | new variant                                                                                      | loading                                                                                                                                                                       |
| Toast                                                                                                                       | ToastProvider + addToast                                                   | new variant                                                                                      | WEB-4                                                                                                                                                                         |
| Link                                                                                                                        | Link                                                                       | new variant (neutral, underlined)                                                                | text links                                                                                                                                                                    |
| AppShell (sidebar, rail, phone drawer)                                                                                      | Listbox, Dropdown, Drawer, ScrollShadow                                    | missing                                                                                          | app                                                                                                                                                                           |
| CommandMenu                                                                                                                 | Modal + Input + Listbox                                                    | missing                                                                                          | ⌘K                                                                                                                                                                            |
| ShortcutsDialog                                                                                                             | Modal + Table + Kbd                                                        | missing                                                                                          | `?`                                                                                                                                                                           |
| EmptyState                                                                                                                  | Card-less stack: icon, heading, text, Button                               | missing                                                                                          | every list                                                                                                                                                                    |
| FilterBar                                                                                                                   | Input + Chip + Popover + Select                                            | missing                                                                                          | lists                                                                                                                                                                         |
| SelectionBar ("{n} selected", one bulk action, Clear)                                                                       | Button, Dropdown                                                           | missing                                                                                          | workspace lists (Change Status, A33), operator waitlist (Invite)                                                                                                              |
| ConnectAgentDialog (MCP address, SegmentedControl, code block with Copy)                                                    | Modal, Input, Tabs (segmented), Button                                     | missing                                                                                          | Account › Devices, My Work, ⌘K                                                                                                                                                |
| FeedbackRow (a link, `<a href>` to the canonical URL, with buttons inside; checkbox where bulk applies)                     | Avatar, Badge, Image, Checkbox                                             | missing                                                                                          | lists, My Work, modules                                                                                                                                                       |
| InboxRow (a link, `<a href>` to the canonical URL, with buttons inside)                                                     | Avatar, Badge, Image, Button                                               | missing                                                                                          | Inbox                                                                                                                                                                         |
| ScreenshotCanvas (view, compare, draw)                                                                                      | Fabric renderer from `snapmark-kit/annotations` + Image                    | missing                                                                                          | feedback view, session view, extension                                                                                                                                        |
| DrawingToolbar                                                                                                              | React Aria Toolbar (one Tab stop, arrows inside), Button, Tooltip, Popover | have (Mac editor), new variant for web                                                           | extension, feedback view                                                                                                                                                      |
| VersionTabs                                                                                                                 | Tabs                                                                       | missing (tab with kind, author, PR)                                                              | feedback view                                                                                                                                                                 |
| ThreadEntry (comment, question, answer, review, vote, system line)                                                          | Avatar, Badge, Dropdown                                                    | missing                                                                                          | thread                                                                                                                                                                        |
| Composer (with ComposerContext: the line above the field that names the version and the mode, with × to go back to Comment) | Textarea, Button, Badge                                                    | missing                                                                                          | feedback view, phone                                                                                                                                                          |
| DecisionCard                                                                                                                | RadioGroup, Progress, AvatarGroup, Button                                  | missing                                                                                          | thread                                                                                                                                                                        |
| AcceptanceLine                                                                                                              | text + Badge; the acceptance rule as a line of text, never only a Tooltip  | missing                                                                                          | feedback view, phone Details sheet                                                                                                                                            |
| AnchorDetails                                                                                                               | description list, Button (copy)                                            | missing                                                                                          | Details tab, compose "Where"                                                                                                                                                  |
| ActionBar (phone)                                                                                                           | Button group, safe-area padding                                            | missing                                                                                          | phone feedback view                                                                                                                                                           |
| ConsentCard                                                                                                                 | Card, Switch, Button                                                       | missing                                                                                          | device consent (Allow and Deny equal weight, no filled primary)                                                                                                               |
| SeatLine                                                                                                                    | text + Progress                                                            | missing                                                                                          | members, operator                                                                                                                                                             |
| StatTile                                                                                                                    | Card                                                                       | missing                                                                                          | operator usage                                                                                                                                                                |
| ExtensionPopup, PickerOverlay, ComposePanel, SentPanel                                                                      | the same wrappers in a shadow root                                         | missing                                                                                          | extension                                                                                                                                                                     |

---

# Public

## Landing

### Purpose

Make a product team want early access and join the waitlist in the first screen (J8, A17, A30).

### Header

| Title                        | Tabs | Actions                                             |
| ---------------------------- | ---- | --------------------------------------------------- |
| Snapmark logo (links to `/`) | none | Sign In (ghost Button) or, signed in, Open Snapmark |

### Sections

| Order | Section                                    | Purpose                                                                                            |
| ----- | ------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| 1     | Hero: headline, subhead, waitlist form     | The outcome and the one action, first on the page (Serial Position Effect)                         |
| 2     | Hero image                                 | A calm product picture: a screenshot with one reference and a thread (show a moment, voice rule 6) |
| 3     | Four outcomes                              | What the team's week feels like after (A30)                                                        |
| 4     | How It Works                               | Features second, smaller type, answering "how?" only                                               |
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

| Control           | Component          | Label                                 | Key            | Disabled reason    | State source |
| ----------------- | ------------------ | ------------------------------------- | -------------- | ------------------ | ------------ |
| Work email        | EmailField (Input) | "Work email" (`autocomplete="email"`) | Tab, ↩ submits | none               | form         |
| Role (optional)   | Select             | "What do you do? (optional)"          | Tab, Space     | none               | form         |
| Join the Waitlist | Button primary     | "Join the Waitlist"                   | ↩              | busy while joining | request      |
| Sign In           | Button ghost       | "Sign In"                             | Tab ↩          | none               | session      |
| Footer links      | Link               | "Privacy", "Terms", "Imprint"         | Tab ↩          | none               |              |

### Filters

| Filter | Default | Options | Clear behaviour |
| ------ | ------- | ------- | --------------- |
| none   |         |         |                 |

### Words

| Where                | Text                                                                                                                                                   | Key                                         |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------- |
| Page title           | "Snapmark: ship what your team meant"                                                                                                                  | `public.landing.meta.title`                 |
| Hero headline        | "Ship what your team meant."                                                                                                                           | `public.landing.hero.headline`              |
| Hero subhead         | "Your team decides once. Your agent builds the right thing the first time."                                                                            | `public.landing.hero.subhead`               |
| Email label          | "Work email"                                                                                                                                           | `public.waitlist.email.label`               |
| Email placeholder    | "you@company.com"                                                                                                                                      | `public.waitlist.email.placeholder`         |
| Role label           | "What do you do? (optional)"                                                                                                                           | `public.waitlist.role.label`                |
| Role options         | "Product Manager", "Designer", "Engineer", "Founder", "Agency", "Something Else"                                                                       | `public.waitlist.role.options.*`            |
| Button               | "Join the Waitlist"                                                                                                                                    | `public.waitlist.submit`                    |
| Button busy          | "Joining the waitlist…"                                                                                                                                | `public.waitlist.submitting`                |
| Under the form       | "We invite teams in small groups."                                                                                                                     | `public.waitlist.note`                      |
| Outcome 1 heading    | "No more screenshot ping-pong."                                                                                                                        | `public.landing.outcomes.pingpong.heading`  |
| Outcome 1 text       | "Feedback stays on the thing it's about. Your engineer and their agent get everything they need to act on it."                                         | `public.landing.outcomes.pingpong.text`     |
| Outcome 2 heading    | "Decisions that stick."                                                                                                                                | `public.landing.outcomes.decisions.heading` |
| Outcome 2 text       | "Weigh the options side by side, vote, and settle it. Months later, anyone can see what was decided, by whom and why."                                 | `public.landing.outcomes.decisions.text`    |
| Outcome 3 heading    | "Your agent builds the right thing."                                                                                                                   | `public.landing.outcomes.agent.heading`     |
| Outcome 3 text       | "When work starts, your engineer's agent already knows what was asked, where it lives in the code and what the team agreed. It never decides for you." | `public.landing.outcomes.agent.text`        |
| Outcome 4 heading    | "Keep work moving from anywhere."                                                                                                                      | `public.landing.outcomes.phone.heading`     |
| Outcome 4 text       | "Answer a question or approve a change from your phone between meetings. Nothing waits on you."                                                        | `public.landing.outcomes.phone.text`        |
| How it works heading | "How It Works"                                                                                                                                         | `public.landing.how.heading`                |
| Step 1               | "Point at it. Click anything in your product in Chrome, or on your Mac, and say what you expect."                                                      | `public.landing.how.point`                  |
| Step 2               | "Decide together. Comment, compare versions and approve in one place."                                                                                 | `public.landing.how.decide`                 |
| Step 3               | "Hand it to your agent. Your engineer's coding agent picks up what was agreed and reports back when it's done."                                        | `public.landing.how.handoff`                |
| Closing heading      | "Be one of the first teams."                                                                                                                           | `public.landing.closing.heading`            |
| Closing text         | "Bring your team and the product you're building. We'll do the rest together."                                                                         | `public.landing.closing.text`               |
| Error: email         | "Enter an email address like name@company.com."                                                                                                        | `public.waitlist.errors.email`              |
| Error: server        | "Couldn't add you to the waitlist. Snapmark had a problem. Your email is still here. Try again."                                                       | `public.waitlist.errors.server`             |
| Header               | "Sign In" / "Open Snapmark"                                                                                                                            | `public.nav.signIn` / `public.nav.openApp`  |
| Footer               | "Privacy", "Terms", "Imprint", "© {year} Snapmark"                                                                                                     | `public.footer.*`                           |
| Hero image alt       | "A screenshot of a checkout page with one numbered reference and a short thread beside it."                                                            | `public.landing.hero.imageAlt`              |

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

| Where                                      | Text                                                                                                                                                                                                                                         | Key                                                     |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| Sign-in subject                            | "Your Snapmark sign-in link"                                                                                                                                                                                                                 | `email.signIn.subject`                                  |
| Sign-in headline                           | "Pick up where your team left off."                                                                                                                                                                                                          | `email.signIn.headline`                                 |
| Sign-in text                               | "Here's your link to sign in. It works once, for 15 minutes."                                                                                                                                                                                | `email.signIn.text`                                     |
| Sign-in button                             | "Sign In to Snapmark"                                                                                                                                                                                                                        | `email.signIn.button`                                   |
| Sign-in footer                             | "Didn't ask for this? You can ignore this email. Nobody can sign in without the link."                                                                                                                                                       | `email.signIn.footer`                                   |
| Unknown email text                         | "There's no Snapmark account for this email yet. Join the waitlist and we'll invite you." Goes to an email with no invitation, waitlist invitation or membership; no account is created (F163)                                               | `email.signIn.unknown.text`                             |
| Invitation subject                         | "{inviter} invited you to {organisation} on Snapmark"                                                                                                                                                                                        | `email.invitation.subject`                              |
| Invitation headline                        | "Decide together, and ship what you meant."                                                                                                                                                                                                  | `email.invitation.headline`                             |
| Invitation text                            | "{inviter} wants you in {organisation} as {role, select, owner {an owner} admin {an admin} member {a member} guest {a guest} other {a member}}. Point at what matters, weigh the options together and see it built the way the team agreed." | `email.invitation.text`                                 |
| Invitation button                          | "Join {organisation}"                                                                                                                                                                                                                        | `email.invitation.button`                               |
| Invitation expiry                          | "This invitation works for 7 days."                                                                                                                                                                                                          | `email.invitation.expiry`                               |
| Waitlist invitation subject                | "It's your turn on Snapmark"                                                                                                                                                                                                                 | `email.waitlistInvitation.subject`                      |
| Waitlist invitation headline               | "Your team's spot is ready."                                                                                                                                                                                                                 | `email.waitlistInvitation.headline`                     |
| Waitlist invitation text                   | "Bring your team and point at what matters in your product. Your agent builds the right thing the first time."                                                                                                                               | `email.waitlistInvitation.text`                         |
| Waitlist invitation button                 | "Set Up Your Team"                                                                                                                                                                                                                           | `email.waitlistInvitation.button`                       |
| Mention, decision, review, answer subjects | "{name} mentioned you on #{n}" · "{name} asked you to decide on #{n}" · "#{n} is ready for your review" · "{name} answered your question on #{n}"                                                                                            | `email.notify.{mention,decision,review,answer}.subject` |
| Bodies, question email, digest, footers    | as microcopy.md: the mention, decision, review, question and answer email bodies, the question email ("{name} asked a question on #{n}"), the daily digest, and the shared footer with "Notification Settings"                               | `email.notify.*`, `email.digest.*`, `email.common.*`    |

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

| Control           | Component                  | Label                            | Key                  | Disabled reason                                                              | State source |
| ----------------- | -------------------------- | -------------------------------- | -------------------- | ---------------------------------------------------------------------------- | ------------ |
| Email             | EmailField                 | "Email" (`autocomplete="email"`) | autofocus, ↩ submits | none                                                                         | form         |
| Send Sign-In Link | Button primary, full width | "Send Sign-In Link"              | ↩                    | busy while sending                                                           | request      |
| Use Another Email | Button secondary           | "Use Another Email"              | Tab ↩                | none                                                                         |              |
| Send Again        | Button ghost               | "Send Again"                     | Tab ↩                | stays visible and aria-disabled, label "Send Again in {seconds} s", for 30 s | timer        |

### Filters

None.

### Words

| Where             | Text                                                                                                                                                        | Key                                    |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| Title             | "Sign In to Snapmark"                                                                                                                                       | `auth.signIn.title`                    |
| Email label       | "Email"                                                                                                                                                     | `auth.signIn.email.label`              |
| Email placeholder | "you@company.com"                                                                                                                                           | `auth.signIn.email.placeholder`        |
| Button            | "Send Sign-In Link"                                                                                                                                         | `auth.signIn.submit`                   |
| Busy              | "Sending the sign-in link…"                                                                                                                                 | `auth.signIn.submitting`               |
| Not invited yet   | "New here? Join the waitlist." (link to `/`)                                                                                                                | `auth.signIn.waitlist`                 |
| Error: email      | "Enter an email address like name@company.com."                                                                                                             | `auth.signIn.errors.email`             |
| Error: expired    | "This sign-in link has expired. Links work for 15 minutes. Send a new one below."                                                                           | `auth.signIn.errors.expired`           |
| Error: used       | "This sign-in link was already used. Each link works once. Send a new one below."                                                                           | `auth.signIn.errors.used`              |
| Error: invalid    | "This sign-in link doesn't work. Send a new one below."                                                                                                     | `auth.signIn.errors.invalid`           |
| Error: rate       | "Too many links in a short time. Wait a minute, then send again."                                                                                           | `auth.signIn.errors.rate`              |
| Check title       | "Check Your Email"                                                                                                                                          | `auth.check.title`                     |
| Check text        | "We sent an email to {email}. Its sign-in link works once, for 15 minutes." (the same for an email with no invitation, so nobody learns who has an account) | `auth.check.text`                      |
| Local hint        | "Running locally: the link is in the terminal where Snapmark runs."                                                                                         | `auth.check.localHint`                 |
| Check buttons     | "Use Another Email", "Send Again", "Send Again in {seconds} s"                                                                                              | `auth.check.{another,resend,resendIn}` |
| Verifying         | "Signing you in…"                                                                                                                                           | `auth.verify.loading`                  |
| Session ended     | "You were signed out. Your draft is kept. Sign in to continue."                                                                                             | `auth.signIn.sessionEnded`             |

### Components

| Region | Component                       | Status  | Notes                                     |
| ------ | ------------------------------- | ------- | ----------------------------------------- |
| Form   | AuthCard (Input, Button, Alert) | missing | shared with Invitation and Device consent |

## Invitation

### Purpose

Join an organisation in one action (J10). The same address, `/invite/[token]`, has two variants: an organisation invitation (an admin invited you into an existing organisation) and a waitlist invitation (an operator invited you to set up your own team; there is no organisation yet). Sitemap F1.

### Header

| Variant      | Title                 | Tabs | Actions |
| ------------ | --------------------- | ---- | ------- |
| Organisation | "Join {organisation}" | none | none    |
| Waitlist     | "Set Up Your Team"    | none | none    |

The auth card's Snapmark logo links to `/` (signed out) or the Inbox (signed in), so no state is a dead end.

### Sections

| Order | Section                                                                                                                                       | Purpose                                       |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| 1     | Organisation: who invited you, the role, (guests) the workspaces. Waitlist: the line that you will name your organisation and first workspace | Confidence about what joining means           |
| 2     | Callout for the wrong account, expired, revoked, no seat, already a member, already has an organisation (waitlist)                            | Recovery; each callout has a way on           |
| 3     | Primary action                                                                                                                                | Join, Set Up Your Team or Continue with Email |

### Layout

| Zoom  | Columns   | Widths               | Notes                |
| ----- | --------- | -------------------- | -------------------- |
| 100 % | 1 centred | 440 px               | inviter Avatar 40 px |
| 150 % | 1         | 440 px or full width |                      |

### Controls

The primaries below are exclusive: one state shows one of them, never two.

| Control               | Component        | Label                   | Key   | Disabled reason | State source                                                          |
| --------------------- | ---------------- | ----------------------- | ----- | --------------- | --------------------------------------------------------------------- |
| Join                  | Button primary   | "Join {organisation}"   | ↩     | busy            | invitation, session                                                   |
| Set Up Your Team      | Button primary   | "Set Up Your Team"      | ↩     | busy            | waitlist invitation, session, no organisation yet; goes to `/welcome` |
| Continue with Email   | Button primary   | "Continue with Email"   | ↩     | busy            | invitation (signed out); after sign-in returns here                   |
| Sign Out and Continue | Button secondary | "Sign Out and Continue" | Tab ↩ | none            | session                                                               |
| Go to {organisation}  | Link             | "Go to {organisation}"  | Tab ↩ | none            | already a member, or already has an organisation                      |
| Go to Snapmark        | Link             | "Go to Snapmark"        | Tab ↩ | none            | expired, revoked (sitemap F12)                                        |

### Words

| Where                         | Text                                                                                                                                                                        | Key                                                        |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Title                         | "Join {organisation}"                                                                                                                                                       | `auth.invitation.title`                                    |
| Line                          | "{inviter} invited you to {organisation} as {role, select, owner {an owner} admin {an admin} member {a member} guest {a guest} other {a member}}."                          | `auth.invitation.line`                                     |
| Guest line                    | "You'll see {workspaces}."                                                                                                                                                  | `auth.invitation.guestWorkspaces`                          |
| Roles                         | "Owner", "Admin", "Member", "Guest"                                                                                                                                         | `common.roles.*`                                           |
| Waitlist title                | "Set Up Your Team"                                                                                                                                                          | `auth.invitation.waitlist.title`                           |
| Waitlist line                 | "Sign in with {email} to name your organisation and first workspace."                                                                                                       | `auth.invitation.waitlist.line`                            |
| Waitlist primary (signed in)  | "Set Up Your Team"                                                                                                                                                          | `auth.invitation.waitlist.continue`                        |
| Waitlist, has an organisation | "You already have an organisation, {organisation}. Setting up a second team comes later." · "Go to {organisation}" (the only action; no `/welcome`)                         | `auth.invitation.waitlist.already`, `auth.invitation.goTo` |
| Wrong account                 | "This invitation is for {email}. You're signed in as {current}."                                                                                                            | `auth.invitation.wrongAccount`                             |
| Already member                | "You're already in {organisation}." · "Go to {organisation}"                                                                                                                | `auth.invitation.already`, `auth.invitation.goTo`          |
| Expired                       | "This invitation has expired. Ask {inviter} to send a new one." · "Go to Snapmark"                                                                                          | `auth.invitation.expired`, `app.notFound.home`             |
| Revoked                       | "This invitation was withdrawn. Ask the person who sent it for a new one." · "Go to Snapmark"                                                                               | `auth.invitation.revoked`, `app.notFound.home`             |
| No seat                       | "{organisation} has no free seat for {role, select, owner {an owner} admin {an admin} other {a member}} right now. Ask {inviter} to free one, or to invite you as a guest." | `auth.invitation.noSeat`                                   |
| Invalid                       | "This invitation isn't valid any more. Ask the person who sent it for a new one."                                                                                           | `auth.invitation.invalid`                                  |
| Busy (announced)              | "Joining {organisation}…"                                                                                                                                                   | `auth.invitation.joining`                                  |
| Error                         | "Couldn't join {organisation}. Snapmark had a problem. You're not in yet. Try again."                                                                                       | `auth.invitation.errors.server`                            |

### Components

| Region | Component                     | Status  | Notes                  |
| ------ | ----------------------------- | ------- | ---------------------- |
| Card   | AuthCard, Avatar, Alert, Link | missing | one card, two variants |

## Welcome (first run)

### Purpose

Name the organisation and the first workspace, then land in it (J10, A30). Welcome opens only for a person holding an unused waitlist invitation. Anyone else signed in with no organisation (removed from their only one, a guest whose access ended) sees the No organisation state instead, so Welcome never bypasses the waitlist (J8).

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

| Control             | Component      | Label                                               | Key            | Disabled reason | State source |
| ------------------- | -------------- | --------------------------------------------------- | -------------- | --------------- | ------------ |
| Organisation name   | TextField      | "Organisation name" (`autocomplete="organization"`) | autofocus      | none            | form         |
| Workspace name      | TextField      | "First workspace"                                   | Tab, ↩ submits | none            | form         |
| Create Organisation | Button primary | "Create Organisation"                               | ↩              | busy            | request      |

### Words

| Where                                    | Text                                                                                                                                                                                              | Key                                                                                      |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Headline                                 | "A home for your team's decisions."                                                                                                                                                               | `onboarding.welcome.headline`                                                            |
| Line                                     | "Name your organisation and the first product you'll review. You can add more later."                                                                                                             | `onboarding.welcome.text`                                                                |
| Organisation label, placeholder          | "Organisation name", "Acme"                                                                                                                                                                       | `onboarding.welcome.organisation.label`, `.placeholder`                                  |
| Address preview                          | "Your address: {host}/{slug}"                                                                                                                                                                     | `onboarding.welcome.organisation.preview`                                                |
| Workspace label, placeholder             | "First workspace", "Web Shop"                                                                                                                                                                     | `onboarding.welcome.workspace.label`, `.placeholder`                                     |
| Workspace help                           | "A workspace is one product, like your web shop or your admin app."                                                                                                                               | `onboarding.welcome.workspace.help`                                                      |
| Button, busy                             | "Create Organisation", "Creating {name}…" (announced, never swapped into the button)                                                                                                              | `onboarding.welcome.submit`, `.submitting`                                               |
| Errors                                   | "Give your organisation a name." · "Give your workspace a name." · "{slug} is taken. Try {suggestion}." · "Couldn't create {name}. Snapmark had a problem. Your names are still here. Try again." | `onboarding.welcome.errors.*`                                                            |
| No organisation (no waitlist invitation) | "You're not in an organisation right now." · "Ask the person who invited you for a new invitation, or join the waitlist." · "Sign Out"                                                            | `onboarding.noOrganisation.heading`, `onboarding.noOrganisation.text`, `app.nav.signOut` |

### Components

| Region | Component       | Status  | Notes |
| ------ | --------------- | ------- | ----- |
| Form   | AuthCard, Input | missing |       |

## Device consent

### Purpose

Let a person allow the extension, the Mac app or an MCP client, read-only by default, with write scopes to opt into (A28, A34, J11, J9). Every client arrives at `/authorize` with OAuth PKCE; the Mac app uses a loopback redirect, with no device code (A35).

### Header

| Title                                          | Tabs | Actions |
| ---------------------------------------------- | ---- | ------- |
| "Allow {client} to use your Snapmark account?" | none | none    |

### Sections

| Order | Section                                                                                                  | Purpose                               |
| ----- | -------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| 1     | Client and device, what it can read                                                                      | Plain consequence                     |
| 2     | "It may also:" three Switches, off, each with a line saying what it allows (claim and ask included, A34) | Opt in to writes (design 10)          |
| 3     | Safety lines                                                                                             | Never approves; people's text is data |
| 4     | Deny, Allow (equal weight, side by side)                                                                 | Never recommend on consent (B12, C31) |

### Layout

| Zoom  | Columns   | Widths               | Notes             |
| ----- | --------- | -------------------- | ----------------- |
| 100 % | 1 centred | 480 px               | client icon 40 px |
| 150 % | 1         | 480 px or full width |                   |

### Controls

| Control                | Component                                                                              | Label                                                                                            | Key                                                | Disabled reason                                                                                                                                                                              | State source   |
| ---------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| Reply in threads       | Switch                                                                                 | "Reply in threads", with the line "Ask questions and reply."                                     | Space                                              | none                                                                                                                                                                                         | request scopes |
| Post versions          | Switch                                                                                 | "Post versions"                                                                                  | Space                                              | hidden for the extension and Mac app (they never post versions)                                                                                                                              | client kind    |
| Report implementations | Switch                                                                                 | "Report implementations", with the line "Claim feedback and hand finished work back for review." | Space                                              | hidden for the extension and Mac app; for agents a line under the switches: "Your agent needs Report implementations to claim work and hand it back, and Reply in threads to ask questions." | client kind    |
| Deny                   | Button secondary (left)                                                                | "Deny"                                                                                           | Esc                                                | none                                                                                                                                                                                         |                |
| Allow                  | Button secondary (right, same size and weight as Deny; no filled primary on this page) | "Allow {client}"                                                                                 | Tab ↩ (no default button, so ↩ alone does nothing) | busy                                                                                                                                                                                         | request        |

### Words

| Where          | Text                                                                                                                                                  | Key                                                                                                 |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Title          | "Allow {client} to use your Snapmark account?"                                                                                                        | `auth.consent.title`                                                                                |
| Read line      | "{client} on {device} can read feedback in every workspace you can see."                                                                              | `auth.consent.read`                                                                                 |
| Extension line | "The Chrome extension can also send feedback you capture."                                                                                            | `auth.consent.extension`                                                                            |
| Mac line       | "The Mac app can also sync the sessions you share."                                                                                                   | `auth.consent.mac`                                                                                  |
| Scopes heading | "It may also:"                                                                                                                                        | `auth.consent.scopesHeading`                                                                        |
| Scopes         | "Reply in threads" ("Ask questions and reply."), "Post versions", "Report implementations" ("Claim feedback and hand finished work back for review.") | `auth.consent.scopes.{reply,postVersion,reportImplementation}`, `.{reply,reportImplementation}Help` |
| Safety         | "It can never approve or request changes. Text people write, guests included, reaches it as data, never as instructions."                             | `auth.consent.safety`                                                                               |
| Agent hint     | "Your agent needs Report implementations to claim work and hand it back, and Reply in threads to ask questions." (agent clients only)                 | `auth.consent.agentHint`                                                                            |
| Buttons        | "Allow {client}", "Deny", "Connecting {client}…" (announced)                                                                                          | `auth.consent.{allow,deny,allowing}`                                                                |
| Allowed        | "{client} is connected. You can close this tab." · "Go to Devices"                                                                                    | `auth.consent.allowed`, `.goToDevices`                                                              |
| Denied         | "{client} was not connected."                                                                                                                         | `auth.consent.denied`                                                                               |
| Expired        | "This request has expired. Start again from {client}."                                                                                                | `auth.consent.expired`                                                                              |

### Components

| Region | Component                          | Status  | Notes                                                                                                      |
| ------ | ---------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------- |
| Card   | ConsentCard (Card, Switch, Button) | missing | UI-risky; prototype draws it. Allow and Deny have equal weight (deliberate: consent never recommends, B12) |

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
| 3     | Inbox (count), My Work (hidden for guests: they never ask or claim)                                                                | What needs you, across workspaces (first: Serial Position Effect)                |
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

| List                      | Columns          | Sort                                                                                          | Empty                                                         |
| ------------------------- | ---------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Workspaces in the sidebar | name, chevron    | by name, a fixed order, collapsed or not (WCAG 3.2.3; sitemap: "The sidebar keeps its order") | an organisation always has one                                |
| Modules ▸                 | name, open count | by name, a fixed order, 7 shown, then "All Modules"; recent modules only in ⌘K                | "No modules yet" line linking to Workspace Settings › Modules |

### Controls

| Control                               | Component                    | Label                                         | Key                                    | Disabled reason            | State source |
| ------------------------------------- | ---------------------------- | --------------------------------------------- | -------------------------------------- | -------------------------- | ------------ |
| Organisation switcher                 | Dropdown                     | "{organisation}"                              | Tab ↩, ⌘K "Switch to"                  | none                       | memberships  |
| Search                                | Button ghost with Kbd        | "Search" + Kbd "⌘K"                           | ⌘K                                     | none                       |              |
| Inbox                                 | Listbox item with count      | "Inbox"                                       | G I                                    | none                       | inbox count  |
| My Work                               | Listbox item                 | "My Work"                                     | G M                                    | hidden for guests          | role         |
| Workspace header                      | Button ghost + Dropdown More | "{workspace}"                                 | ← / → collapse                         | none                       |              |
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

| Where                    | Text                                                                                                                            | Key                                                                            |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Sidebar items            | "Search", "Inbox", "My Work", "Open", "Needs Decision", "In Review", "Done", "Modules", "All Modules", "Sessions", "Settings"   | `app.nav.*`                                                                    |
| Workspace More           | "Workspace Settings", "Copy Link"                                                                                               | `app.nav.workspaceMenu.*`                                                      |
| No modules               | "No modules yet"                                                                                                                | `app.nav.noModules`                                                            |
| Avatar menu              | "Profile", "Sign-In Methods", "Devices", "Notifications", "Keyboard Shortcuts", "Sign Out"                                      | `app.nav.account.*`                                                            |
| Collapse                 | "Collapse Sidebar", "Expand Sidebar"                                                                                            | `app.nav.{collapse,expand}`                                                    |
| Command menu placeholder | "Search or jump to…"                                                                                                            | `app.command.placeholder`                                                      |
| Command groups           | "Go To", "Feedback", "Actions on This Page", "Settings"; actions include "Connect an Agent" and, on a feedback, "Change Status" | `app.command.groups.*`, `app.command.connectAgent`, `app.command.changeStatus` |
| Command no result        | "Nothing matches \"{q}\". Search feedback by number, like #42."                                                                 | `app.command.empty`                                                            |
| Command error            | "Couldn't search. Snapmark had a problem. Try again."                                                                           | `app.command.error`                                                            |
| Shortcuts title, groups  | "Keyboard Shortcuts"; "Anywhere", "Lists", "Feedback", "Drawing"                                                                | `app.shortcuts.*`                                                              |
| Offline banner           | "Offline. You can read what's loaded. Replying and reviewing are off until you're back. Your drafts are kept."                  | `app.offline.banner`                                                           |
| 404                      | "This page doesn't exist, or you don't have access." · "Go to Inbox" · "Go to Snapmark"                                         | `app.notFound.{text,inbox,home}`                                               |
| Phone menu button        | "Menu" (aria-label)                                                                                                             | `app.nav.menu`                                                                 |

### Components

| Region                      | Component       | Status      | Notes                                                              |
| --------------------------- | --------------- | ----------- | ------------------------------------------------------------------ |
| Sidebar, rail, phone drawer | AppShell        | missing     | current page: bold label plus a 2 px neutral bar, not colour alone |
| Command menu                | CommandMenu     | missing     | uxpatterns `command-palette`; reads the one key table              |
| Shortcuts                   | ShortcutsDialog | missing     | KEY-6                                                              |
| Offline                     | Alert (Banner)  | new variant | `role="alert"`, announced once                                     |
| 404                         | EmptyState      | missing     |                                                                    |

## Inbox

### Purpose

Show everything that needs you across workspaces and let you empty it (J2, J4, J6; design 9.4).

### Header

| Title   | Tabs                                                                                                                                                                  | Actions                                       |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| "Inbox" | none; the kinds All · Decisions · Reviews · Questions · Mentions · Answers are chip toggles under the title (a filter, not a section), each with a count when above 0 | none (no primary: an empty Inbox is the goal) |

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

| Control    | Component                    | Label                                                              | Key        | Disabled reason | State source |
| ---------- | ---------------------------- | ------------------------------------------------------------------ | ---------- | --------------- | ------------ |
| Kind chips | Chip toggles (single choice) | see header                                                         | Tab, Space | none            | URL `kind`   |
| Row        | InboxRow                     | (reason line)                                                      | J/K, ↩     | none            |              |
| Dismiss    | Button icon + Tooltip        | "Dismiss (E)"                                                      | E          | none            |              |
| Row More   | Dropdown                     | "More"                                                             | Tab ↩      | none            |              |
| New pill   | Button ghost                 | "{n} new" (`role="status"`, announced politely, never moves focus) | .          | none            | live         |
| Load More  | Button secondary             | "Show {count} More"                                                | Tab ↩      | none            | paging       |

### Filters

| Filter      | Default | Options                                          | Clear behaviour |
| ----------- | ------- | ------------------------------------------------ | --------------- |
| Kind (tabs) | All     | Decisions, Reviews, Questions, Mentions, Answers | All             |

### Words

| Where           | Text                                                                                                                                                                                                                              | Key                                      |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| Title           | "Inbox"                                                                                                                                                                                                                           | `inbox.title`                            |
| Kind chips      | "All", "Decisions", "Reviews", "Questions", "Mentions", "Answers"                                                                                                                                                                 | `inbox.tabs.*`                           |
| Reason lines    | "{name} asked you to decide" · "{name} implemented this" · "{name} via {client} implemented this" · "{name} asked a question" · "{name} via {client} asked a question" · "{name} mentioned you" · "{name} answered your question" | `inbox.reasons.*`                        |
| Due             | "Due {date}" · "Overdue since {date}"                                                                                                                                                                                             | `inbox.due`, `inbox.overdue`             |
| Row More        | "Open in New Tab", "Dismiss"                                                                                                                                                                                                      | `inbox.rowMenu.*`                        |
| Dismissed toast | "Dismissed." · "Undo"                                                                                                                                                                                                             | `inbox.dismissed`, `common.actions.undo` |
| Empty           | "Nothing waits on you." · "Decisions, reviews and questions for you show up here."                                                                                                                                                | `inbox.empty.heading`, `.text`           |
| Empty kind      | "{kind, select, decisions {No decisions for you.} reviews {No reviews for you.} questions {No questions for you.} mentions {No mentions for you.} answers {No answers for you.} other {Nothing here for you.}}"                   | `inbox.empty.kind`                       |
| Error           | "Couldn't load your Inbox. Snapmark had a problem. Try again."                                                                                                                                                                    | `inbox.errors.load`                      |
| New pill        | "{count, plural, one {# new} other {# new}}"                                                                                                                                                                                      | `common.live.newCount`                   |

### Components

| Region     | Component     | Status      | Notes                        |
| ---------- | ------------- | ----------- | ---------------------------- |
| Kind chips | Chip (toggle) | new variant | a filter, so chips, not Tabs |
| Rows       | InboxRow      | missing     | UI-risky                     |
| Empty      | EmptyState    | missing     |                              |

## My Work

### Purpose

Follow what you asked for and what your agent claimed (J3, J4). Members and up only; guests do not see My Work (A31).

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

| Control       | Component      | Label                                                                                                  | Key       | Disabled reason           | State source    |
| ------------- | -------------- | ------------------------------------------------------------------------------------------------------ | --------- | ------------------------- | --------------- |
| Tabs          | Tabs           | "Asked by Me", "Claimed by My Agent"                                                                   | ←/→       | Claimed hidden for guests | URL `tab`, role |
| Status chips  | Chip toggles   | "Open", "In Progress", "Implemented", "Accepted"                                                       | Tab Space | none                      | URL `status`    |
| Rows          | FeedbackRow    |                                                                                                        | J/K, ↩    | none                      |                 |
| Empty actions | Button primary | "Set Up the Extension" / "Connect an Agent" (opens the Connect an Agent dialog, see Account › Devices) | ↩         | none                      |                 |

### Filters

| Filter | Default                              | Options       | Clear behaviour               |
| ------ | ------------------------------------ | ------------- | ----------------------------- |
| Status | Open and In Progress and Implemented | four statuses | "Clear" resets to the default |

### Words

| Where         | Text                                                                                                                   | Key                                                    |
| ------------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| Title, tabs   | "My Work", "Asked by Me", "Claimed by My Agent"                                                                        | `myWork.title`, `myWork.tabs.*`                        |
| Status chips  | "Open", "In Progress", "Implemented", "Accepted"                                                                       | `common.status.*`                                      |
| Empty asked   | "See what you asked for get built." · "Feedback you send from Chrome or your Mac shows up here, with where it stands." | `myWork.empty.asked.*`                                 |
| Empty claimed | "Hand agreed work to your agent." · "Connect Claude Code or another agent, then ask it to pick up open feedback."      | `myWork.empty.claimed.*`                               |
| Buttons       | "Set Up the Extension", "Connect an Agent"                                                                             | `common.actions.setUpExtension`, `myWork.connectAgent` |

### Components

| Region | Component   | Status  | Notes |
| ------ | ----------- | ------- | ----- |
| Rows   | FeedbackRow | missing |       |

## Workspace lists: Open, Needs Decision, In Review, Done

### Purpose

Scan and filter a workspace's feedback by what happens next (J1, J2, J4; owner's sidebar). Members change the status of several items at once (A33; J12).

### Header

| Title                                 | Tabs                              | Actions                                        |
| ------------------------------------- | --------------------------------- | ---------------------------------------------- |
| "{workspace} · {list}" with the count | none (the sidebar is the tab set) | More (Dropdown): Copy Link, Workspace Settings |

### Sections

| Order | Section                                                | Purpose                                                                                                     |
| ----- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| 1     | Filter bar                                             | Search, Module, Page, Kind, Author, Environment; Status on Open; Due on Needs Decision; Since on Done; Sort |
| 2     | Selection bar (members, desktop, once a row is ticked) | "{n} selected" · Change Status · Clear (A33)                                                                |
| 3     | "{n} new" pill                                         | live                                                                                                        |
| 4     | Rows                                                   |                                                                                                             |
| 5     | Show {count} More                                      | uxpatterns `load-more`                                                                                      |

### Layout

| Zoom  | Columns | Widths      | Notes                                                                                                                           |
| ----- | ------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------- |
| 100 % | 1 list  | max 1120 px | row 72 px: thumbnail 64 × 48 · title + chips · Module · Page · author Avatar · claimed line · thread count · environment · time |
| 150 % | 1 list  | full main   | environment and page hidden (in the row's Tooltip); filters wrap to two lines                                                   |
| Phone | 1 list  | full width  | thumbnail, title, status; filters in a "Filters" button opening a Drawer sheet                                                  |

### Lists

| List           | Columns                                                                                                                                                                                                            | Sort                      | Empty                                              |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------- | -------------------------------------------------- |
| Open           | thumbnail · title (#n) · status chip (Open, In Progress) · flags (Needs Answer, Needs Decision, Decided) · Module · Page · author (Guest chip) · "In Progress · Ben via Claude" · comments · environment · updated | updated, newest first     | first use: "Show your team exactly what you mean." |
| Needs Decision | same, plus due date                                                                                                                                                                                                | due first, overdue on top | "Nothing left to decide."                          |
| In Review      | same, status chip "Implemented", plus the PR                                                                                                                                                                       | implemented time          | "Nothing waiting for review."                      |
| Done           | same, status chip "Accepted", plus approved by                                                                                                                                                                     | accepted time             | "Your team's finished work lives here."            |

### Controls

| Control              | Component                                  | Label                                                 | Key                              | Disabled reason                                                                                | State source                                                                     |
| -------------------- | ------------------------------------------ | ----------------------------------------------------- | -------------------------------- | ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Search               | Input with icon                            | "Search feedback"                                     | /                                | none                                                                                           | URL `q`                                                                          |
| Module filter        | Chip + Popover (CheckboxGroup with search) | "Module"                                              | F then M                         | none                                                                                           | URL `module`                                                                     |
| Page filter          | Chip + Popover                             | "Page"                                                | F then P                         | none                                                                                           | URL `path` (the label stays "Page"; `page` would read as pagination, sitemap F8) |
| Kind filter          | Chip + Popover                             | "Kind"                                                | F then K                         | none                                                                                           | URL `kind`                                                                       |
| Author filter        | Chip + Popover (people)                    | "Author"                                              | F then A                         | none                                                                                           | URL `author`                                                                     |
| Environment filter   | Chip + Popover                             | "Environment"                                         | F then E                         | none                                                                                           | URL `env`                                                                        |
| Status filter (Open) | Chip + Popover                             | "Status"                                              | F then S                         | none                                                                                           | URL `status`                                                                     |
| Sort                 | Select                                     | "Sort"                                                | Tab Space                        | none                                                                                           | URL `sort`                                                                       |
| Clear Filters        | Button ghost                               | "Clear Filters"                                       | Tab ↩                            | shown only when a filter is set; absent otherwise                                              | URL                                                                              |
| Rows                 | FeedbackRow (a link to the feedback)       |                                                       | J/K, ↩                           | none                                                                                           |                                                                                  |
| Row checkbox (A33)   | Checkbox in the row                        | "Select #{n}"                                         | X, ⇧X range, ⌘A all on this page | shown on hover and focus, always once one is ticked; absent for guests and on a phone          | selection                                                                        |
| Change Status (bulk) | Dropdown in the selection bar              | "Change Status": "Open", "In Progress", "Implemented" | Tab ↩                            | accepted items are skipped with "{n} skipped: accepted feedback reopens with Request Changes." | selection                                                                        |
| Clear selection      | Button ghost                               | "Clear"                                               | Esc                              | none                                                                                           | selection                                                                        |
| Row More             | Dropdown                                   | "More"                                                | Tab ↩                            | none                                                                                           |                                                                                  |
| Empty primary        | Button primary                             | "Set Up the Extension"                                | ↩                                | absent for guests (they do not capture, A31)                                                   | role                                                                             |
| Empty secondary      | Button secondary                           | "Invite People"                                       | Tab ↩                            | hidden for non-admins                                                                          | role                                                                             |

### Filters

| Filter               | Default              | Options                            | Clear behaviour                         |
| -------------------- | -------------------- | ---------------------------------- | --------------------------------------- |
| Search               | empty                | title, body, number                | × in the field; Esc clears when focused |
| Module               | all                  | workspace modules + "No Module"    | chip ×, Clear Filters                   |
| Page                 | all                  | paths seen in this workspace       | same                                    |
| Kind                 | all                  | Change Request, Comment            | same                                    |
| Author               | all                  | members and guests                 | same                                    |
| Environment          | all                  | workspace environments + "Unknown" | same                                    |
| Status (Open only)   | Open and In Progress | Open, In Progress                  | same                                    |
| Due (Needs Decision) | all                  | Overdue                            | same                                    |
| Since (Done)         | all                  | Last 7 Days, Last 30 Days          | same                                    |
| Sort                 | Updated              | Updated, Newest, Oldest            | back to Updated                         |

### Words

| Where                  | Text                                                                                                                                                                                  | Key                                                                                                                              |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Titles                 | "Open", "Needs Decision", "In Review", "Done"                                                                                                                                         | `app.nav.*`                                                                                                                      |
| Count                  | "{count, plural, one {# feedback} other {# feedback}}"                                                                                                                                | `lists.count`                                                                                                                    |
| Search                 | "Search feedback"                                                                                                                                                                     | `lists.search.placeholder`                                                                                                       |
| Filter names           | "Module", "Page", "Kind", "Author", "Environment", "Status", "Due", "Since", "Sort"                                                                                                   | `lists.filters.*`                                                                                                                |
| Filter values          | "No Module", "Unknown", "Overdue", "Last 7 Days", "Last 30 Days", "Updated", "Newest", "Oldest"                                                                                       | `lists.filters.values.*`                                                                                                         |
| Kinds                  | "Change Request", "Comment"                                                                                                                                                           | `common.kind.*`                                                                                                                  |
| Status                 | "Open", "In Progress", "Implemented", "Accepted"                                                                                                                                      | `common.status.*`                                                                                                                |
| Flags                  | "Needs Answer", "Needs Decision", "Decided"                                                                                                                                           | `common.flags.*`                                                                                                                 |
| Guest chip             | "Guest"                                                                                                                                                                               | `common.roles.guestChip`                                                                                                         |
| Claimed line           | "In Progress · {name} via {client}"                                                                                                                                                   | `lists.row.claimed`                                                                                                              |
| Moved line             | "Moved to {list}" (`role="status"`)                                                                                                                                                   | `lists.row.moved`                                                                                                                |
| Clear                  | "Clear Filters"                                                                                                                                                                       | `lists.filters.clear`                                                                                                            |
| Row More               | "Copy Link", "Move to Module"                                                                                                                                                         | `lists.rowMenu.*`                                                                                                                |
| Empty first use        | "Show your team exactly what you mean." · "Open your product in Chrome, click the Snapmark icon and point at what should change."                                                     | `lists.empty.firstUse.*`                                                                                                         |
| Empty first use, guest | "Feedback your team sends shows up here." · "Comment, draw and vote on it." (no action)                                                                                               | `lists.empty.firstUse.guestHeading`, `.guestText`                                                                                |
| Selection bar (A33)    | "{count, plural, one {# selected} other {# selected}}" · "Change Status" · "Clear" · "Moved {n} to {list}." · "Undo" · "{n} skipped: accepted feedback reopens with Request Changes." | `lists.selection.count`, `.select`, `.selectAll`, `.changeStatus`, `.clear`, `.moved`, `.skippedAccepted`, `common.actions.undo` |
| Empty Needs Decision   | "Nothing left to decide." · "When the team weighs options, they collect here."                                                                                                        | `lists.empty.needsDecision.*`                                                                                                    |
| Empty In Review        | "Nothing waiting for review." · "When an agent reports a change, or a member marks one implemented, it lands here for approval."                                                      | `lists.empty.inReview.*`                                                                                                         |
| Empty Done             | "Your team's finished work lives here." · "Every accepted feedback keeps who asked, what was decided and who approved."                                                               | `lists.empty.done.*`                                                                                                             |
| Empty filtered         | "No feedback matches these filters."                                                                                                                                                  | `lists.empty.filtered`                                                                                                           |
| Load more              | "Show {count} More"                                                                                                                                                                   | `common.actions.showMore`                                                                                                        |
| Error                  | "Couldn't load {list}. Snapmark had a problem. Try again."                                                                                                                            | `lists.errors.load`                                                                                                              |

### Components

| Region     | Component              | Status  | Notes                                                                              |
| ---------- | ---------------------- | ------- | ---------------------------------------------------------------------------------- |
| Filter bar | FilterBar              | missing | uxpatterns `filter-panel` as inline chips (fewer than 8 filters)                   |
| Selection  | SelectionBar, Checkbox | missing | A33 bulk Change Status; one bar pattern with the operator Waitlist                 |
| Rows       | FeedbackRow            | missing | list, not table: rows mix a picture and text (uxpatterns `table-vs-list-vs-cards`) |
| Empty      | EmptyState             | missing |                                                                                    |

## Modules and one module

### Purpose

Find feedback by part of the product (A13, A27 first sub-level). Browse only: modules are added, renamed and deleted in one place, Workspace Settings › Modules (sitemap F3).

### Header

| Title                  | Tabs | Actions                                                                                                                  |
| ---------------------- | ---- | ------------------------------------------------------------------------------------------------------------------------ |
| "Modules" / "{module}" | none | Modules: "Manage Modules" (secondary, a link to Workspace Settings › Modules; hidden for guests); one module: none (F14) |

### Sections

| Order | Section                                                           | Purpose |
| ----- | ----------------------------------------------------------------- | ------- |
| 1     | Search (Modules), or status chips and the filter bar (one module) |         |
| 2     | Table (Modules) or rows (one module)                              |         |

### Layout

| Zoom  | Columns | Widths      | Notes                |
| ----- | ------- | ----------- | -------------------- |
| 100 % | 1       | max 1040 px | Table 5 columns      |
| 150 % | 1       | full        | Last Activity hidden |

### Lists

| List       | Columns                                                    | Sort               | Empty                                                                    |
| ---------- | ---------------------------------------------------------- | ------------------ | ------------------------------------------------------------------------ |
| Modules    | Module · Open · Needs Decision · In Review · Last Activity | Last Activity      | "Name the parts of your product." with "Manage Modules" (members and up) |
| One module | as Workspace lists                                         | as Workspace lists | "No {status} feedback in {module}."                                      |

### Controls

| Control        | Component                    | Label                                         | Key       | Disabled reason   | State source |
| -------------- | ---------------------------- | --------------------------------------------- | --------- | ----------------- | ------------ |
| Manage Modules | Button secondary (link)      | "Manage Modules"                              | Tab ↩     | hidden for guests | role         |
| Module row     | Table row                    |                                               | ↑/↓, ↩    | none              |              |
| Status chips   | Chip toggles (single choice) | "Open", "Needs Decision", "In Review", "Done" | Tab Space | none              | URL `status` |

The status is a filter of one list, so it is a chip toggle, not Tabs. None of the four has a header primary: the actions happen on the feedback (F14).

### Filters

As Workspace lists, on one module.

### Words

| Where            | Text                                                                                                   | Key                   |
| ---------------- | ------------------------------------------------------------------------------------------------------ | --------------------- |
| Title            | "Modules"                                                                                              | `modules.title`       |
| Columns          | "Module", "Open", "Needs Decision", "In Review", "Last Activity"                                       | `modules.columns.*`   |
| Manage           | "Manage Modules"                                                                                       | `modules.manage`      |
| Empty            | "Name the parts of your product." · "Modules group feedback by part, like Checkout Summary or Header." | `modules.empty.*`     |
| Empty one module | "No {status} feedback in {module}."                                                                    | `modules.emptyStatus` |

### Components

| Region       | Component     | Status      | Notes           |
| ------------ | ------------- | ----------- | --------------- |
| Table        | Table         | new variant |                 |
| Status chips | Chip (toggle) | new variant | one module only |

## Feedback view

### Purpose

Read, compare, discuss, decide and review one feedback, with the screenshot in the centre (owner, design 9.1; A1, A3, A4, A12, A14, A15; J1, J2, J4, J5, J9). A member also moves the feedback on by hand (A33, owner, 2026-10-28: "he changes the state of the specific comment/comments"; J12). The agent shows as "{name} via {client}"; labels say Agent (A32, owner, 2026-10-28: "Agent").

The version shown by default (no `version` in the URL): the implementation awaiting review, else the accepted one, else the newest (ia.md URL table).

**Approve per shown version (one rule, desktop and phone):**

| Shown version                             | Approve                                                                         |
| ----------------------------------------- | ------------------------------------------------------------------------------- |
| v0 Original of a Change Request           | not offered (nobody can ever approve it, WEB-15); the footer primary is Comment |
| v0 of a Comment-kind feedback             | "Approve v0"; accepts the feedback (owner-decisions.md #26)                     |
| Mockup or Alternative, no decision open   | "Approve v{n}"; accepted, the feedback gets Decided                             |
| Mockup or Alternative, a decision open    | "Approve v{n} and Close Decision"; accepted, Decided, the decision closes       |
| Implementation awaiting review            | "Approve v{n}", the primary                                                     |
| Older implementation (a newer one exists) | `aria-disabled`: "v{m} is newer. Review that one."                              |
| Already accepted                          | `aria-disabled`: "v{n} is already accepted."                                    |
| You approved it already                   | `aria-disabled`: "You approved v{n}. Withdraw it from your entry's More."       |
| Guest                                     | `aria-disabled` with the guest reason (A31)                                     |

Every Approve (button, A, ⌘K, phone) shows the toast "Approved v{n}." with Undo for 8 s. Undo removes the approval and all it caused (acceptance, Decided, the closed decision, the move to Done). After 8 s, Withdraw Approval in the entry's More does the same. In Compare the footer acts on the right pane, and the label always names the version.

### Header

| Title                                                                                                                                                                                  | Tabs                                                                                                      | Actions                                        |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| Breadcrumbs "{workspace} › {list} › #{n}", then the title (inline edit for author and members), status Chip (a Dropdown for members and up: Change Status, A33), flag Chips, kind Chip | Version tabs below the header: "v0 Original", "v1 Mockup · Dana", "v2 Implementation · PR #212", then "+" | Previous, Next (icon Buttons), More (Dropdown) |

### Sections

| Order | Section                                                                                                                                                                                                                          | Purpose                                                                  |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| 1     | Header                                                                                                                                                                                                                           | Where am I, what state (Cognitive Load)                                  |
| 2     | Version tabs                                                                                                                                                                                                                     | A14                                                                      |
| 3     | Canvas toolbar: Compare, Draw on Screenshot, zoom (−, fit, +)                                                                                                                                                                    |                                                                          |
| 4     | Screenshot canvas: the version's screenshot, the anchor outline, references, marks; in Compare two panes                                                                                                                         | The centre                                                               |
| 5     | Right panel, Tabs: Thread · Details                                                                                                                                                                                              |                                                                          |
| 5a    | Thread tab: acceptance line with the rule as a line of text under it, open decision card, entries oldest first                                                                                                                   |                                                                          |
| 5b    | Details tab: anchor and version stamp                                                                                                                                                                                            | J5, A15                                                                  |
| 6     | Panel footer: context line, Composer, then one row: the state's primary, one secondary (Request Changes where it applies), More. Vote is not in the footer (the card's Vote and key V stay). At 150 %: the primary and More only | One place to act (Law of Common Region); Occam's Razor: one Vote control |

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
| Version tabs   | "v{n} {Kind}" · author ("Ben via Claude", or "marked by {name}" for an implementation marked by hand, A33) · PR · accepted tick (implementation) or decided tick (mockup, alternative)                           | by number                                                                             | v0 always exists      |
| Thread entries | Avatar · name ("Ben via Claude", Guest chip) · kind Chip (Question, Answer, Approve, Request Changes, Vote) · version pointer "on v2" · time · body (Markdown subset) · marks preview · actions (Reply-to, More) | oldest first; system lines inline ("Status changed to Implemented by Ben via Claude") | "No comments yet."    |
| Details        | Region · Module · Component · File · Repo · Branch · Worktree · Environment · Commit · Deployment · PR · Captured at · Page URL · Selector · Viewport · Text                                                     | fixed order (rank 1, 2, 3)                                                            | per field "Not found" |

### Controls

| Control               | Component                                                        | Label                                                                                                                                | Key                                 | Disabled reason                                                                                                                                                                          | State source   |
| --------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| Breadcrumbs           | Breadcrumbs                                                      | "{workspace}", "{list}", "#{n}"                                                                                                      | Tab ↩                               | none                                                                                                                                                                                     | `from`         |
| Title                 | inline TextField                                                 | "Title"                                                                                                                              | Tab ↩ edits, ↩ commits, Esc reverts | read-only for guests                                                                                                                                                                     | role           |
| Status (A33)          | Dropdown on the status Chip + Tooltip                            | Tooltip "Change Status (S)"; options "Open", "In Progress", "Implemented"; "Accepted" shown disabled                                 | S, ↑/↓, ↩                           | "Accepted" option: "Accepted comes from an Approve on the implementation."; on an Accepted feedback the control: "Request changes on v{n} to reopen it."; guests: a read-only Chip (A31) | status, role   |
| Previous / Next       | Button icon + Tooltip                                            | "Previous (K)", "Next (J)"                                                                                                           | K, J                                | at the ends: "First in {list}", "Last in {list}"                                                                                                                                         | `from`         |
| More (header)         | Dropdown                                                         | "More"                                                                                                                               | Tab ↩                               | none                                                                                                                                                                                     |                |
| Version tab           | VersionTabs                                                      | "v{n} {Kind}"                                                                                                                        | [ ], ←/→                            | none                                                                                                                                                                                     | URL `version`  |
| Add version "+"       | Button icon + Tooltip                                            | "Post Version"                                                                                                                       | Tab ↩                               | hidden for guests                                                                                                                                                                        | role           |
| Compare               | Button toggle + Tooltip                                          | "Compare (C)"                                                                                                                        | C                                   | "Compare needs two versions." with v0 only                                                                                                                                               | versions       |
| Compare left / right  | Select                                                           | "Left", "Right"                                                                                                                      | Tab Space                           | none                                                                                                                                                                                     | URL `compare`  |
| Draw on Screenshot    | Button + Tooltip                                                 | "Draw on Screenshot (D)"                                                                                                             | D                                   | on touch: shows the Desktop-only message ("This works on a larger screen.") instead of hiding (WEB-10)                                                                                   | input type     |
| Drawing tools         | DrawingToolbar                                                   | Select, Reference/Card, Box/Ellipse, Arrow, Pen, Cross/Remove Area, Highlighter/Spotlight, Cut & Move/Redact (the shared tool names) | C, 1–7                              | Pen pointer only (EX-6)                                                                                                                                                                  |                |
| Zoom out / fit / in   | Button icons + Tooltips                                          | "Zoom Out (−)", "Fit (0)", "Zoom In (+)"                                                                                             | −, 0, +                             | at limits                                                                                                                                                                                |                |
| Panel tabs            | Tabs                                                             | "Thread", "Details"                                                                                                                  | T, I                                | none                                                                                                                                                                                     | URL `tab`      |
| Composer context line | ComposerContext (a line of text above the composer; × in a mode) | "On v{n} {kind}" · "Requesting changes on v{n}" · "Answering {name}'s question"; × Tooltip "Back to Comment"                         | Tab ↩ on ×                          | none                                                                                                                                                                                     | composer mode  |
| Composer              | Textarea (Composer)                                              | placeholder "Comment on v{n}…" (aria-label "Comment"; the context line is its visible label)                                         | R focuses, ⌘↩ sends                 | offline: "Offline. Your comment is kept here and can be sent when you're back."                                                                                                          | draft          |
| Comment               | Button (primary when no other next move)                         | "Comment"                                                                                                                            | ⌘↩                                  | "Write a comment first." when empty                                                                                                                                                      | composer       |
| Approve               | Button (primary when an implementation awaits review)            | "Approve v{n}"; "Approve v{n} and Close Decision" on a mockup or alternative while a decision is open                                | A                                   | per the Approve table above; guest: "Guests can comment, draw and vote. Approving and requesting changes need a member."                                                                 | role, version  |
| Request Changes       | Button secondary                                                 | "Request Changes" (switches the composer to Request Changes mode; at 150 % it moves to Footer More)                                  | ⇧R                                  | guest: the same reason (A31)                                                                                                                                                             | role           |
| Footer More           | Dropdown                                                         | "More"                                                                                                                               | Tab ↩                               | none                                                                                                                                                                                     |                |
| Entry Answer          | Button ghost                                                     | "Answer Question"                                                                                                                    | Tab ↩                               | none                                                                                                                                                                                     | question state |
| Entry More            | Dropdown                                                         | "More"                                                                                                                               | Tab ↩                               | none                                                                                                                                                                                     |                |
| Copy (Details rows)   | Button icon + Tooltip                                            | "Copy {field}"                                                                                                                       | Tab ↩                               | none                                                                                                                                                                                     |                |
| New entries pill      | Button ghost                                                     | "{n} new"                                                                                                                            | .                                   | none                                                                                                                                                                                     | live           |

Panel tab keys: T for Thread and I for Details (single keys, WEB-8; ⌥ letters are not used, KEY-7).

### Menus

| Menu             | Items                                                                                                                                                                                                                            |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Header More      | Copy Link (Y) · Move to Module · Change Kind · Change Status (members, A33) · Unclaim (claimer, admins; In Progress only) · Delete Feedback (author, admins; afterwards the page returns to the `from` list with the Undo toast) |
| Footer More      | Request Changes (when not in the row) · Ask a Question · Request a Decision · Post Version · Draw on Screenshot · Change Status (members, A33) (guests: Draw on Screenshot only, A31)                                            |
| Entry More       | Copy Link · Edit (own, 15 min) · Withdraw Approval / Withdraw Objection (own review) · Mark Not Answered (asker, on an answered question) · Delete (own)                                                                         |
| Version tab More | Copy Link · Delete Version (own, not v0, no reviews)                                                                                                                                                                             |

### Filters

None.

### Words

| Where                                                                                                            | Text                                                                                                                                                                                                                                                                                                                  | Key                                                                                                                                                       |
| ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Page title                                                                                                       | "#{n} {title} · {workspace}"                                                                                                                                                                                                                                                                                          | `feedback.meta.title`                                                                                                                                     |
| Version tab kinds                                                                                                | "Original", "Mockup", "Alternative", "Implementation"                                                                                                                                                                                                                                                                 | `common.versionKind.*`                                                                                                                                    |
| Version tab                                                                                                      | "v{n} {Kind}" · "PR #{pr}" · "{name} via {client}" · "marked by {name}" (implementation marked by hand, A33)                                                                                                                                                                                                          | `feedback.versions.tab`, `.pr`, `common.via`, `feedback.versions.markedBy`                                                                                |
| Hand-marked implementation (canvas line)                                                                         | "No after-screenshot. {name} marked this implemented by hand."                                                                                                                                                                                                                                                        | `feedback.versions.noAfterScreenshot`                                                                                                                     |
| Accepted and decided tick Tooltips                                                                               | "Accepted version" (implementation, v0 of a Comment) · "Decided version" (mockup, alternative)                                                                                                                                                                                                                        | `feedback.versions.accepted`, `feedback.versions.decided`                                                                                                 |
| Toolbar                                                                                                          | "Compare", "Draw on Screenshot", "Zoom Out", "Fit", "Zoom In", "Left", "Right"                                                                                                                                                                                                                                        | `feedback.toolbar.*`                                                                                                                                      |
| Compare disabled                                                                                                 | "Compare needs two versions."                                                                                                                                                                                                                                                                                         | `feedback.toolbar.compareDisabled`                                                                                                                        |
| Panel tabs                                                                                                       | "Thread", "Details"                                                                                                                                                                                                                                                                                                   | `feedback.panel.tabs.*`                                                                                                                                   |
| Acceptance line                                                                                                  | "Not reviewed yet" · "Approved by {names}" · "{n} objection open · {name}: “{text}”" · "Accepted · approved by {names}" (implementation) · "Decided · approved by {names}" (mockup, alternative)                                                                                                                      | `feedback.acceptance.*`, `feedback.acceptance.decided`                                                                                                    |
| Acceptance rule (a line of text under the acceptance line, and in the phone Details sheet; never only a Tooltip) | "Accepted when it has at least one Approve and no open objection."                                                                                                                                                                                                                                                    | `feedback.acceptance.rule`                                                                                                                                |
| Claimed line                                                                                                     | "In Progress · {name} via {client}" · "In Progress · {name}" (set by hand, A33)                                                                                                                                                                                                                                       | `feedback.claimed`, `feedback.claimedByPerson`                                                                                                            |
| Status control (A33)                                                                                             | "Change Status" · "Open", "In Progress", "Implemented" · "Accepted comes from an Approve on the implementation." · "Request changes on v{n} to reopen it."                                                                                                                                                            | `feedback.status.change`, `feedback.status.options.{open,inProgress,implemented}`, `feedback.status.disabled.accepted`, `feedback.status.disabled.reopen` |
| Status changed toast                                                                                             | "Moved #{n} to {list}." · "Undo"                                                                                                                                                                                                                                                                                      | `feedback.statusChanged`, `common.actions.undo`                                                                                                           |
| Approved toast                                                                                                   | "Approved v{n}." · "Undo"                                                                                                                                                                                                                                                                                             | `feedback.approved`, `common.actions.undo`                                                                                                                |
| System lines                                                                                                     | "{name} changed the status to {status}." · "{name} via {client} claimed this." · "{name} via {client} couldn't claim this: it needs an answer first." · "{name} via {client} couldn't claim this: a decision is open." · "Accepted · approved by {name}." · "Edited elsewhere: {text}"                                | `feedback.system.*`                                                                                                                                       |
| Entry kinds                                                                                                      | "Question", "Answer", "Approve", "Request Changes", "Vote"                                                                                                                                                                                                                                                            | `feedback.entryKind.*`                                                                                                                                    |
| Entry pointer                                                                                                    | "on v{version}"                                                                                                                                                                                                                                                                                                       | `feedback.entry.onVersion`                                                                                                                                |
| Empty thread                                                                                                     | "No comments yet."                                                                                                                                                                                                                                                                                                    | `feedback.thread.empty`                                                                                                                                   |
| Composer placeholders                                                                                            | "Comment on v{n}…" · "What should change in v{n}?" · "Answer {name}'s question…"                                                                                                                                                                                                                                      | `feedback.composer.*`                                                                                                                                     |
| Composer context line                                                                                            | "On v{n} {kind}" · "Requesting changes on v{n}" · "Answering {name}'s question" · × "Back to Comment"                                                                                                                                                                                                                 | `feedback.composer.context.{comment,requestingChanges,answering,cancel}`                                                                                  |
| Marks chip                                                                                                       | "{n} marks" · "Discard Marks"                                                                                                                                                                                                                                                                                         | `feedback.composer.marks`, `.discardMarks`                                                                                                                |
| Buttons                                                                                                          | "Comment", "Approve v{n}", "Approve v{n} and Close Decision", "Request Changes", "Answer Question"                                                                                                                                                                                                                    | `feedback.actions.{comment,approve,approveAndClose,requestChanges,answer}`                                                                                |
| Disabled reasons                                                                                                 | "Write a comment first." · "Guests can comment, draw and vote. Approving and requesting changes need a member." · "Offline. Your comment is kept here and can be sent when you're back." · "v{m} is newer. Review that one." · "v{n} is already accepted." · "You approved v{n}. Withdraw it from your entry's More." | `feedback.disabled.*`, `feedback.disabled.{newerImplementation,alreadyAccepted,alreadyApproved}`                                                          |
| Menus                                                                                                            | "Copy Link", "Move to Module", "Change Kind", "Unclaim", "Delete Feedback", "Request Changes", "Ask a Question", "Request a Decision", "Post Version", "Change Status", "Copy Link", "Edit", "Withdraw Approval", "Withdraw Objection", "Mark Not Answered", "Delete", "Copy Link", "Delete Version"                  | `feedback.menu.*`                                                                                                                                         |
| Previous/Next                                                                                                    | "Previous", "Next", "First in {list}", "Last in {list}"                                                                                                                                                                                                                                                               | `feedback.nav.*`                                                                                                                                          |
| Newer version note                                                                                               | "v{n} was just posted. Your comment will go on v{old}." · "Move to v{n}"                                                                                                                                                                                                                                              | `feedback.composer.newerVersion`, `.moveTo`                                                                                                               |
| Details labels                                                                                                   | "Region", "Module", "Component", "File", "Repo", "Branch", "Worktree", "Environment", "Commit", "Deployment", "PR", "Captured", "Page", "Selector", "Viewport", "Text", "Session"                                                                                                                                     | `feedback.details.*`                                                                                                                                      |
| Details unknown                                                                                                  | "Not found"                                                                                                                                                                                                                                                                                                           | `feedback.details.notFound`                                                                                                                               |
| Details no code                                                                                                  | "No code location found. The agent searches by page, selector and text."                                                                                                                                                                                                                                              | `feedback.details.noCode`                                                                                                                                 |
| Copied toast                                                                                                     | "Copied link to #{n}." · "Copied {value}."                                                                                                                                                                                                                                                                            | `common.copied.link`, `common.copied.value`                                                                                                               |
| Deleted toast                                                                                                    | "Deleted #{n}." · "Undo" (shown on the `from` list the page returns to)                                                                                                                                                                                                                                               | `feedback.deleted`                                                                                                                                        |
| Errors                                                                                                           | "Couldn't load the screenshot. The feedback and thread are fine. Try again." · "Couldn't post your comment. Snapmark had a problem. Your text is kept. Try again." · "Couldn't save your review. Snapmark had a problem. It isn't recorded yet. Try again."                                                           | `feedback.errors.*`                                                                                                                                       |
| Not found                                                                                                        | "This feedback doesn't exist, or you don't have access."                                                                                                                                                                                                                                                              | `feedback.notFound`                                                                                                                                       |

### Components

| Region       | Component                              | Status      | Notes                                                                                                            |
| ------------ | -------------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------- |
| Header       | Breadcrumbs, Chip, Dropdown, Button    | new variant |                                                                                                                  |
| Header       | Status Dropdown on the Chip            | new variant | Change Status (A33); a read-only Chip for guests                                                                 |
| Version tabs | VersionTabs                            | missing     | UI-risky                                                                                                         |
| Canvas       | ScreenshotCanvas (view, compare, draw) | missing     | same renderer as the Mac app and the extension; compare is side by side with linked zoom (owner: "side by side") |
| Thread       | ThreadEntry, AcceptanceLine            | missing     | copilot entries: person's Avatar with an agent badge (WEB-24)                                                    |
| Decision     | DecisionCard                           | missing     | see Decision request                                                                                             |
| Details      | AnchorDetails                          | missing     |                                                                                                                  |
| Footer       | ComposerContext, Composer, Button      | missing     | one accent button (WEB-20); one row: primary, one secondary, More; at 150 % primary and More only                |

## Decision request: dialog and card

### Purpose

Ask named people to vote between versions, show the tally, close it (A12, J2).

### Header

| Title                        | Tabs | Actions                            |
| ---------------------------- | ---- | ---------------------------------- |
| Dialog: "Request a Decision" | none | Request Decision (primary), Cancel |

### Sections

| Order  | Section                                                                                                                                 | Purpose                                          |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| 1      | Versions to compare (thumbnails with checkboxes)                                                                                        | at least two                                     |
| 2      | People to ask                                                                                                                           | members and invited guests                       |
| 3      | Due date (optional)                                                                                                                     |                                                  |
| 4      | Comment (optional)                                                                                                                      | what to weigh                                    |
| Card 1 | "{opener} asked {names} to decide · Due {date}"                                                                                         |                                                  |
| Card 2 | Version options with thumbnail, tally bar, voters' Avatars                                                                              |                                                  |
| Card 3 | Vote / Change Vote, card More; a line "To decide, approve the chosen version." (deciding is the footer's Approve on that version's tab) | J2: the tally and the way to decide in one place |

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

| Control          | Component                    | Label                  | Key          | Disabled reason                                                                                                                        | State source                |
| ---------------- | ---------------------------- | ---------------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| Versions         | CheckboxGroup                | "Versions to compare"  | Space        | none                                                                                                                                   | versions                    |
| People           | Autocomplete multi (people)  | "People to ask"        | type, ↩ adds | none                                                                                                                                   | members, guests with access |
| Due date         | DatePicker                   | "Due (optional)"       | Tab          | none                                                                                                                                   |                             |
| Comment          | Textarea                     | "Comment (optional)"   | Tab          | none                                                                                                                                   |                             |
| Request Decision | Button primary               | "Request Decision"     | ⌘↩           | "Choose at least two versions."                                                                                                        | form                        |
| Cancel           | Button secondary             | "Cancel"               | Esc          | none                                                                                                                                   |                             |
| Card options     | RadioGroup                   | "v{n} {Kind}"          | ↑/↓, Space   | none                                                                                                                                   |                             |
| Vote             | Button primary (in the card) | "Vote" / "Change Vote" | V, ↩         | "Choose a version first."                                                                                                              | vote                        |
| Show Votes       | Button ghost                 | "Show Votes"           | Tab ↩        | none (closed only)                                                                                                                     |                             |
| Card More        | Dropdown                     | "More"                 | Tab ↩        | Close Request: opener only; acts at once, then a toast "Closed the decision request." with Undo for 8 s that reopens it with its votes | role                        |

### Words

| Where            | Text                                                                                                                                                            | Key                                                                     |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Dialog title     | "Request a Decision"                                                                                                                                            | `decisionRequest.dialog.title`                                          |
| Labels           | "Versions to compare", "People to ask", "Due (optional)", "Comment (optional)"                                                                                  | `decisionRequest.dialog.labels.*`                                       |
| Note placeholder | "What should people weigh?"                                                                                                                                     | `decisionRequest.dialog.commentPlaceholder`                             |
| Buttons          | "Request Decision", "Requesting the decision…" (announced), "Cancel"                                                                                            | `decisionRequest.dialog.submit`, `.submitting`, `common.actions.cancel` |
| Disabled         | "Choose at least two versions." · "A decision is already open on this feedback."                                                                                | `decisionRequest.disabled.*`                                            |
| One version      | "A decision needs at least two versions. Post a mockup or alternative first." · "Post Version"                                                                  | `decisionRequest.dialog.oneVersion`, `feedback.menu.postVersion`        |
| Card heading     | "{opener} asked {names} to decide" · "Due {date}" · "Overdue since {date}"                                                                                      | `decisionRequest.card.*`                                                |
| Tally            | "{count, plural, one {# vote} other {# votes}}" (plural rules)                                                                                                  | `decisionRequest.card.tally`                                            |
| Voted            | "You voted for v{version}."                                                                                                                                     | `decisionRequest.card.voted`                                            |
| How to decide    | "To decide, approve the chosen version."                                                                                                                        | `decisionRequest.card.howToDecide`                                      |
| Buttons          | "Vote", "Change Vote", "Show Votes", "Close Request"                                                                                                            | `decisionRequest.card.actions.*`                                        |
| Closed toast     | "Closed the decision request." · "Undo"                                                                                                                         | `decisionRequest.card.closedToast`, `common.actions.undo`               |
| Closed           | "Decided: v{n}, approved by {name}. Votes: {tally}." · "Closed by {name} without a decision."                                                                   | `decisionRequest.card.closed.*`                                         |
| Thread line      | "{name} requested a decision between {versions}."                                                                                                               | `decisionRequest.thread.line`                                           |
| Errors           | "Couldn't request the decision. Snapmark had a problem. Your choices are kept. Try again." · "Couldn't save your vote. Your vote isn't counted yet. Try again." | `decisionRequest.errors.*`                                              |

### Components

| Region | Component                                                | Status      | Notes                                                                                                                                                                                                                                                |
| ------ | -------------------------------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dialog | Modal, CheckboxGroup, Autocomplete, DatePicker, Textarea | new variant | uxpatterns `modal`: a short focused form                                                                                                                                                                                                             |
| Card   | DecisionCard (RadioGroup, Progress, AvatarGroup)         | missing     | UI-risky; tally bars neutral grey, the voted option marked by a tick and weight, not colour alone. On a phone the card shows the tally without its own Vote button: the action bar's Vote opens the sheet (one Vote control per view, Occam's Razor) |

## Post Version (dialog)

### Purpose

Add a mockup or alternative as a version (A12, J2).

### Header

| Title          | Tabs | Actions                        |
| -------------- | ---- | ------------------------------ |
| "Post Version" | none | Post Version (primary), Cancel |

### Sections

| Order | Section                                                                                 | Purpose          |
| ----- | --------------------------------------------------------------------------------------- | ---------------- |
| 1     | Kind (RadioGroup: Mockup, Alternative; Mockup chosen), each with a one-line description |                  |
| 2     | Image drop zone (drop, paste ⌘V, Choose File)                                           |                  |
| 3     | Comment (optional)                                                                      | why this version |

### Layout

| Zoom  | Columns | Widths                              | Notes                     |
| ----- | ------- | ----------------------------------- | ------------------------- |
| 100 % | 1       | Modal 560 px; drop zone 200 px high | preview replaces the zone |
| 150 % | 1       | full width minus 48                 |                           |

### Controls

| Control      | Component              | Label                                                                                                            | Key                | Disabled reason       | State source |
| ------------ | ---------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------ | --------------------- | ------------ |
| Kind         | RadioGroup             | "Kind": "Mockup" ("A design of how it should look."), "Alternative" ("Another way to solve it."); default Mockup | ↑/↓                | none                  |              |
| Image        | file input + drop zone | "Image" · "Choose File"                                                                                          | ↩ opens, ⌘V pastes | none                  |              |
| Comment      | Textarea               | "Comment (optional)"                                                                                             | Tab                | none                  |              |
| Post Version | Button primary         | "Post Version"                                                                                                   | ⌘↩                 | "Add an image first." | form         |
| Cancel       | Button secondary       | "Cancel"                                                                                                         | Esc                | none                  |              |

### Words

| Where         | Text                                                                                      | Key                                              |
| ------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------ |
| Title, labels | "Post Version", "Kind", "Mockup", "Alternative", "Image", "Comment (optional)"            | `version.dialog.*`                               |
| Kind help     | "A design of how it should look." · "Another way to solve it."                            | `version.dialog.kindHelp.mockup`, `.alternative` |
| Drop zone     | "Drop an image, paste it, or choose a file." · "Choose File"                              | `version.dialog.drop`, `.choose`                 |
| Disabled      | "Add an image first."                                                                     | `version.dialog.disabled`                        |
| Uploading     | "Uploading… {percent} %"                                                                  | `version.dialog.uploading`                       |
| Refused       | "This file can't be used. Use a PNG, JPEG or WebP under 20 MB."                           | `version.dialog.refused`                         |
| Error         | "Couldn't upload the image. The connection dropped. The file is still chosen. Try again." | `version.dialog.error`                           |

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

| Order | Section                                | Purpose                                                                                                                                                           |
| ----- | -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1     | Three numbered steps                   | open `chrome://extensions`, turn on Developer mode, Load unpacked the build folder, whose path the dialog shows with Copy Path (Miller's Law: nothing to look up) |
| 2     | Then: pin the icon and Sign In from it |                                                                                                                                                                   |

### Layout

| Zoom  | Columns | Widths              | Notes |
| ----- | ------- | ------------------- | ----- |
| 100 % | 1       | Modal 560 px        |       |
| 150 % | 1       | full width minus 48 |       |

### Controls

| Control      | Component             | Label                                                            | Key    | Disabled reason | State source |
| ------------ | --------------------- | ---------------------------------------------------------------- | ------ | --------------- | ------------ |
| Copy address | Button icon + Tooltip | "Copy chrome://extensions"                                       | Tab ↩  | none            |              |
| Copy path    | Button + Tooltip      | "Copy Path" (beside the build folder path, from the local setup) | Tab ↩  | none            | local setup  |
| Done         | Button primary        | "Done"                                                           | ↩, Esc | none            |              |

### Words

| Where     | Text                                                                                                                                                                                                        | Key                                                    |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| Title     | "Set Up the Extension"                                                                                                                                                                                      | `extensionSetup.title`                                 |
| Steps     | "1. Open chrome://extensions in Chrome." · "2. Turn on Developer mode, top right." · "3. Choose Load unpacked and pick this folder: {path}" · "Then pin Snapmark to the toolbar and sign in from its icon." | `extensionSetup.steps.*`                               |
| Copy path | "Copy Path" · toast "Copied the folder path."                                                                                                                                                               | `extensionSetup.copyPath`, `extensionSetup.copiedPath` |
| Done      | "Done"                                                                                                                                                                                                      | `common.actions.done`                                  |

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

| Where           | Text                                                                                                                          | Key                     |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| Titles, columns | "Sessions", "Session", "Screenshots", "Feedback", "Shared By", "Last Sync"                                                    | `sessions.*`            |
| Header line     | "Shared from {device} by {name} · Last sync {time}"                                                                           | `sessions.view.meta`    |
| Stale           | "Last sync {date}. The Mac may be offline."                                                                                   | `sessions.view.stale`   |
| Stopped sharing | "Stopped sharing on {date}. This copy no longer updates." (instead of the stale line once the Mac stopped sharing on purpose) | `sessions.view.stopped` |
| Empty           | "No screenshots in this session yet." · "No references on this screenshot."                                                   | `sessions.view.empty*`  |

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
| Modules      | Module · Feedback · Created By · More (Rename, Delete: admins; the one place for both, sitemap F3)   | name                                           | "Name the parts of your product."                                                                               |

### Controls

| Control                           | Component                    | Label              | Key                     | Disabled reason                                                                    | State source     |
| --------------------------------- | ---------------------------- | ------------------ | ----------------------- | ---------------------------------------------------------------------------------- | ---------------- |
| Tabs                              | Tabs                         | see header         | ←/→                     | none                                                                               | route            |
| Workspace name                    | TextField                    | "Workspace name"   | ↩ commits               | members: "Only admins can change this."                                            | role             |
| Address (slug)                    | TextField                    | "Address"          | ↩ commits               | same                                                                               | role             |
| Delete Workspace                  | Button outlined, tone `pass` | "Delete Workspace" | Tab ↩                   | not owner: hidden; last workspace: "An organisation needs at least one workspace." | role, count      |
| Add {object}                      | Button primary               | "Add Repo" etc.    | Tab ↩                   | members: "Only admins can change this." (Modules: allowed)                         | role             |
| Row                               | Table row                    |                    | ↑/↓, ↩ edits, ⌫ deletes | read-only for members                                                              | role             |
| Row More                          | Dropdown                     | "More"             | Tab ↩                   | none                                                                               |                  |
| Try an address                    | TextField                    | "Try an address"   | type                    | none                                                                               | live result line |
| Add Environment dialog: Kind      | Select                       | "Kind"             | Space                   | none                                                                               |                  |
| Name                              | TextField                    | "Name"             | Tab                     | none                                                                               |                  |
| Address patterns                  | TagInput                     | "Address patterns" | ↩ adds                  | none                                                                               |                  |
| Add Repo dialog: Repo             | TextField                    | "Repo"             | Tab                     | none                                                                               |                  |
| Default branch                    | TextField                    | "Default branch"   | Tab                     | none                                                                               |                  |
| Add Route Rule dialog: Path, Repo | TextField, Select            | "Path", "Repo"     | Tab                     | "Add a repo first." when none                                                      | repos            |
| Save                              | Button primary               | "Save"             | ⌘↩                      | per field errors                                                                   | form             |

### Filters

None.

### Words

| Where                   | Text                                                                                                                                              | Key                                                     |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| Title, tabs             | "{workspace} Settings", "General", "Repos", "Environments", "Route Rules", "Modules"                                                              | `workspaceSettings.*`                                   |
| General labels          | "Workspace name", "Address", "Delete Workspace"                                                                                                   | `workspaceSettings.general.*`                           |
| Delete confirm          | "Delete {workspace}? Its feedback, versions and sessions are deleted. This can't be undone." · "Type {workspace} to confirm" · "Delete Workspace" | `workspaceSettings.general.delete.*`                    |
| Buttons                 | "Add Repo", "Add Environment", "Add Route Rule", "Add Module", "Save"                                                                             | `workspaceSettings.*.add`, `common.actions.save`        |
| Repo columns, labels    | "Repo", "Default Branch", "Local Folder Match", "Found by the Mac app", "Not seen yet", "Default branch"                                          | `workspaceSettings.repos.*`                             |
| Repo placeholder, error | "pokbytes/snapmark-web" · "Use owner/name, or paste the GitHub address."                                                                          | `workspaceSettings.repos.placeholder`, `.errors.format` |
| Environment kinds       | "Production", "Staging", "Preview", "Local"                                                                                                       | `common.environmentKind.*`                              |
| Environment labels      | "Name", "Kind", "Address patterns"                                                                                                                | `workspaceSettings.environments.*`                      |
| Pattern help            | "One per line, like omr.com or *.omr.ninja. Paths and https:// are fine."                                                                         | `workspaceSettings.environments.patternHelp`            |
| Try result              | "{address} is {environment}." · "{address} matches no environment."                                                                               | `workspaceSettings.environments.try.*`                  |
| Route labels, help      | "Path", "Repo" · "Use * for the rest of the path, like /reviews/*."                                                                               | `workspaceSettings.routes.*`                            |
| Empty states            | see Lists                                                                                                                                         | `workspaceSettings.*.empty.*`                           |
| Member line             | "Only admins can change this."                                                                                                                    | `common.disabled.adminOnly`                             |
| Saved                   | "Saved" (`role="status"`, beside the field for 2 s)                                                                                               | `common.saved`                                          |
| Deleted toast           | "Deleted {name}." · "Undo"                                                                                                                        | `common.deleted`                                        |

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

| List        | Columns                                                                                                                     | Sort         | Empty                                |
| ----------- | --------------------------------------------------------------------------------------------------------------------------- | ------------ | ------------------------------------ |
| Members     | Avatar + name + email · Role (Select) · Workspaces (guests) · Joined · More                                                 | name         | an organisation always has its owner |
| Invitations | Email · Role · Sent By · Sent · Status · More (Resend, Revoke)                                                              | sent, newest | "No open invitations."               |
| Workspaces  | Workspace (the name links to that workspace's settings, General tab; sitemap F2) · Feedback · Members with Access · Created | name         | never empty                          |

### Controls

| Control                    | Component                    | Label                                                                                                                       | Key             | Disabled reason                                                                                                                                                                                                                                                                            | State source |
| -------------------------- | ---------------------------- | --------------------------------------------------------------------------------------------------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------ |
| Invite People              | Button primary               | "Invite People"                                                                                                             | Tab ↩, ⌘K       | members: hidden; Free plan never applies in release 1                                                                                                                                                                                                                                      | role         |
| Invite dialog: Emails      | TagInput                     | "Emails"                                                                                                                    | ↩ or comma adds | none                                                                                                                                                                                                                                                                                       |              |
| Role                       | Select                       | "Role": options in the order Guest, Member, Admin, Owner; default Member (Guest when no seat is free), never Owner or Admin | Space           | Member/Admin: "No free seat. Guests need none."; Guest: "Guest limit reached: 5 per seat."                                                                                                                                                                                                 | seats        |
| Workspaces (guests)        | CheckboxGroup                | "Workspaces"                                                                                                                | Space           | shown only for Guest                                                                                                                                                                                                                                                                       | role choice  |
| Send Invitations           | Button primary               | "Send Invitations"                                                                                                          | ⌘↩              | "Add at least one email."                                                                                                                                                                                                                                                                  | form         |
| Members tabs               | Tabs                         | "Members", "Invitations"                                                                                                    | ←/→             | none                                                                                                                                                                                                                                                                                       | URL `tab`    |
| Search                     | Input                        | "Search people"                                                                                                             | /               | none                                                                                                                                                                                                                                                                                       | URL `q`      |
| Role filter                | Chip + Popover               | "Role"                                                                                                                      | F then R        | none                                                                                                                                                                                                                                                                                       | URL `role`   |
| Row role                   | Select                       | "{role}"                                                                                                                    | Space           | last owner: "Every organisation needs an owner. Make someone else an owner first."; members viewing: read-only. Promoting to Owner or Admin, any change to Guest (with a Workspaces CheckboxGroup) and any change of your own role ask first; other changes act at once with an Undo toast | role         |
| Row More                   | Dropdown                     | "More"                                                                                                                      | Tab ↩           | none                                                                                                                                                                                                                                                                                       |              |
| Organisation name, address | TextField                    | "Organisation name", "Address"                                                                                              | ↩ commits       | non-admins: read-only                                                                                                                                                                                                                                                                      | role         |
| Leave Organisation         | Button outlined, tone `pass` | "Leave Organisation"                                                                                                        | Tab ↩           | last owner: "Make someone else an owner first."                                                                                                                                                                                                                                            | role         |
| New Workspace              | Button primary               | "New Workspace"                                                                                                             | Tab ↩           | non-admins: hidden                                                                                                                                                                                                                                                                         | role         |

### Filters

| Filter | Default | Options                     | Clear behaviour |
| ------ | ------- | --------------------------- | --------------- |
| Role   | all     | Owner, Admin, Member, Guest | chip ×          |
| Search | empty   | name, email                 | ×               |

### Words

| Where                      | Text                                                                                                                                                                       | Key                                                                                     |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Title, tabs                | "{organisation} Settings", "General", "Members", "Workspaces", "Invitations"                                                                                               | `organisationSettings.*`                                                                |
| Seat line                  | "{used} of {total, plural, one {# seat} other {# seats}} used · {guests} of {guestLimit, plural, one {# guest} other {# guests}}"                                          | `organisationSettings.members.seats`                                                    |
| Seat note                  | "Seats are granted by Snapmark during the beta."                                                                                                                           | `organisationSettings.members.seatNote`                                                 |
| Invite dialog              | "Invite People", "Emails", "Role", "Workspaces", "Send Invitations", "Sending the invitations…" (announced)                                                                | `organisationSettings.invite.*`                                                         |
| Emails placeholder         | "name@company.com, another@company.com"                                                                                                                                    | `organisationSettings.invite.emailsPlaceholder`                                         |
| Role help                  | "Members and admins use a seat. Guests comment, draw and vote in the workspaces you choose, and need no seat."                                                             | `organisationSettings.invite.roleHelp`                                                  |
| Disabled                   | "No free seat. Guests need none." · "Guest limit reached: 5 per seat." · "Add at least one email."                                                                         | `organisationSettings.invite.disabled.*`                                                |
| Bad email                  | "{text} isn't an email address. Use one like name@company.com."                                                                                                            | `organisationSettings.invite.errors.email`                                              |
| Member columns             | "Name", "Role", "Workspaces", "Joined"                                                                                                                                     | `organisationSettings.members.columns.*`                                                |
| Invitation columns, status | "Email", "Role", "Sent By", "Sent", "Status", "Sent", "Accepted", "Expired", "Revoked"                                                                                     | `organisationSettings.invitations.*`, `common.invitationStatus.*`                       |
| Row menus                  | "Remove from Organisation", "Resend", "Revoke"                                                                                                                             | `organisationSettings.*.menu.*`                                                         |
| Remove confirm             | "Remove {name} from {organisation}? They lose access at once. You can invite them again." · "Remove"                                                                       | `organisationSettings.members.remove.*`                                                 |
| Role confirm (owner)       | "Make {name} an owner? Owners can change anyone's role and delete workspaces." · "Make Owner" · "Cancel"                                                                   | `organisationSettings.members.roleConfirm.owner`, `.makeOwner`, `common.actions.cancel` |
| Role confirm (admin)       | "Make {name} an admin? Admins can invite people and change settings." · "Make Admin"                                                                                       | `organisationSettings.members.roleConfirm.admin`, `.makeAdmin`                          |
| Role confirm (guest)       | "Make {name} a guest? {name} keeps access only to the workspaces you choose, and frees a seat." · "Workspaces" · "Make Guest" · disabled: "Choose at least one workspace." | `organisationSettings.members.roleConfirm.guest`, `.makeGuest`, `.chooseWorkspace`      |
| Role confirm (yourself)    | "Change your own role to {role}? You can't change it back yourself." · "Change My Role"                                                                                    | `organisationSettings.members.roleConfirm.self`, `.changeMyRole`                        |
| Role changed toast         | "{name} is now {role, select, owner {an owner} admin {an admin} member {a member} guest {a guest} other {a member}}." · "Undo"                                             | `organisationSettings.members.roleChanged`, `common.actions.undo`                       |
| Last owner                 | "Every organisation needs an owner." · "Make someone else an owner first."                                                                                                 | `organisationSettings.disabled.lastOwner*`                                              |
| Invitations empty          | "No open invitations."                                                                                                                                                     | `organisationSettings.invitations.empty`                                                |
| Non-admin                  | "Only admins can invite people."                                                                                                                                           | `organisationSettings.members.adminOnly`                                                |
| General                    | "Organisation name", "Address", "Leave Organisation"                                                                                                                       | `organisationSettings.general.*`                                                        |
| Leave confirm              | "Leave {organisation}? You lose access to its workspaces at once." · "Leave"                                                                                               | `organisationSettings.general.leave.*`                                                  |
| Workspaces columns         | "Workspace", "Feedback", "Members with Access", "Created", "New Workspace"                                                                                                 | `organisationSettings.workspaces.*`                                                     |
| New workspace dialog       | "New Workspace", "Workspace name", "Create Workspace"                                                                                                                      | `organisationSettings.workspaces.dialog.*`                                              |

### Components

| Region        | Component                               | Status                | Notes                                                                                         |
| ------------- | --------------------------------------- | --------------------- | --------------------------------------------------------------------------------------------- |
| Seat line     | SeatLine                                | missing               |                                                                                               |
| Tables        | Table                                   | new variant           |                                                                                               |
| Invite dialog | Modal, TagInput, Select, CheckboxGroup  | new variant / missing | Role defaults to Member; options from least to most access (Cognitive Bias: the safe default) |
| Role confirm  | ConfirmDialog, CheckboxGroup (to Guest) | new variant           | access changes ask first even though they can be changed back (C11, R3 over FBK-4)            |

## Account: Profile, Sign-In Methods, Devices, Notifications

### Purpose

Manage yourself and what each device may do (J11, A28, A7, design 9.4).

### Header

| Title     | Tabs                                                | Actions                                                                                             |
| --------- | --------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| "Account" | Profile · Sign-In Methods · Devices · Notifications | Devices: Connect an Agent (primary; the extension and the Mac app are added from their own Sign In) |

### Sections

| Order           | Section                                                       | Purpose      |
| --------------- | ------------------------------------------------------------- | ------------ |
| Profile         | Name, Avatar, Email (read-only), Keyboard shortcuts switch    |              |
| Sign-in methods | List of methods; release-2 rows absent                        | A7           |
| Devices         | Table with scope Switches and Revoke; Connect an Agent dialog | A28, J3, J11 |
| Notifications   | "Emails at once" Switches; "Daily digest" Switch              |              |

### Layout

| Zoom  | Columns                                                                                                                                                                                                                                                                              | Widths     | Notes                                     |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- | ----------------------------------------- |
| 100 % | 1                                                                                                                                                                                                                                                                                    | max 880 px |                                           |
| 150 % | 1                                                                                                                                                                                                                                                                                    | full       | Devices: scopes move into a row expansion |
| Phone | Profile, Notifications and Devices work on a phone. Devices is a row list (Device, Kind, scopes as text, Last Used) with Revoke Device, so a lost laptop is contained from the phone (J11, A18). Changing scopes, Connect an Agent and Sign-In Methods show the Desktop-only message |            |                                           |

### Lists

| List            | Columns                                                                                                                                                                                              | Sort      | Empty                                                       |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ----------------------------------------------------------- |
| Sign-in methods | Method · Detail · Added                                                                                                                                                                              | added     | never empty                                                 |
| Devices         | Device (name, e.g. "Claude Code on Ben's MacBook") · Kind (Extension, Mac App, Agent) · Reply · Post Versions · Report Implementations (Switches; the last two only for agents) · Last Used · Revoke | last used | "Connect your browser, Mac or agent." with Connect an Agent |

### Controls

| Control               | Component                                                           | Label                                                                                                                                               | Key       | Disabled reason                                                                                                                                                | State source |
| --------------------- | ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| Name                  | TextField                                                           | "Name" (`autocomplete="name"`)                                                                                                                      | ↩ commits | none                                                                                                                                                           | user         |
| Avatar                | Button + file input                                                 | "Change Picture"                                                                                                                                    | Tab ↩     | none                                                                                                                                                           |              |
| Email                 | TextField read-only                                                 | "Email"                                                                                                                                             | none      | "Changing your email comes later."                                                                                                                             | release      |
| Keyboard shortcuts    | Switch                                                              | "Single-key shortcuts"                                                                                                                              | Space     | none                                                                                                                                                           | per user     |
| Scope switches        | Switch                                                              | "Reply in Threads", "Post Versions", "Report Implementations"                                                                                       | Space     | on a phone: scopes show as text with "Change scopes on your computer." Turning one on asks first (ConfirmDialog, Allow · Cancel); turning one off acts at once | device       |
| Revoke                | Button secondary                                                    | "Revoke Device"                                                                                                                                     | Tab ↩     | none; works on a phone too                                                                                                                                     |              |
| Connect an Agent      | Button primary (Devices header, empty state); ⌘K "Connect an Agent" | "Connect an Agent"                                                                                                                                  | Tab ↩     | on a phone: the Desktop-only message (task "connect an agent")                                                                                                 |              |
| Notification switches | Switch                                                              | "Mentions", "Decision requests", "Review requests", "Questions on my feedback", "Answers to my questions" (all on by default), "Daily digest" (off) | Space     | none                                                                                                                                                           | user         |

### Words

| Where                   | Text                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Key                                                                                                                                                                                                        |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Title, tabs             | "Account", "Profile", "Sign-In Methods", "Devices", "Notifications"                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | `account.*`                                                                                                                                                                                                |
| Profile                 | "Name", "Change Picture", "Email", "Changing your email comes later.", "Single-key shortcuts", "Use J, K, R, A and other single keys. They never fire while you type."                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | `account.profile.*`                                                                                                                                                                                        |
| Methods                 | "Email link", "{email}", "Your only sign-in method can't be removed."                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | `account.methods.*`                                                                                                                                                                                        |
| Device columns          | "Device", "Kind", "Reply in Threads", "Post Versions", "Report Implementations", "Last Used", "Revoke"                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | `account.devices.columns.*`                                                                                                                                                                                |
| Device kinds            | "Extension", "Mac App", "Agent"                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | `account.devices.kinds.*`                                                                                                                                                                                  |
| Read note               | "Every device can read the workspaces you can see."                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | `account.devices.readNote`                                                                                                                                                                                 |
| Revoke confirm          | "Revoke {device}? It stops working at once and must sign in again." · "Revoke Device"                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | `account.devices.revoke.*`                                                                                                                                                                                 |
| Empty                   | "Connect your browser, Mac or agent." · "The Chrome extension and the Mac app sign in from their own Sign In button. Connect an agent here." · "Connect an Agent"                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | `account.devices.empty.*`, `account.devices.connectAgent.title`                                                                                                                                            |
| Phone scopes            | "Change scopes on your computer."                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | `account.devices.phoneScopes`                                                                                                                                                                              |
| Scope confirm           | "Let {device} {scope, select, reply {reply in threads} postVersions {post versions} reportImplementations {report implementations} other {do more}}? It acts for you, as “{name} via {client}”." · "Allow" · "Cancel"                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | `account.devices.scopeConfirm.*`                                                                                                                                                                           |
| Connect an Agent dialog | Title "Connect an Agent" · "Your agent reads the team's feedback through Snapmark's MCP server." · label "MCP address" (`http://localhost:3000/mcp`, read-only) · "Copy Address" · "Claude Code", "Other MCP Client" · "Run this in your terminal" (`claude mcp add --transport http snapmark http://localhost:3000/mcp`) · "Copy Command" · "Add this to your MCP client's settings" (`{"mcpServers": {"snapmark": {"type": "http", "url": "http://localhost:3000/mcp"}}}`) · "Copy Settings" · "Then ask your agent to list your Snapmark feedback. Its first call opens a page in your browser where you allow it." · "It can only read until you allow more. To claim work and hand it back for review, allow Report implementations. To ask questions, allow Reply in threads." · "Snapmark runs on this computer in release 1, so the address starts with localhost." · "Done" · toasts "Copied the address.", "Copied the command.", "Copied the settings." | `account.devices.connectAgent.{title,intro,address,copyAddress,commandLabel,copyCommand,configLabel,copyConfig,next,scopes,local,done}`, `.clients.{claudeCode,other}`, `.copied.{address,command,config}` |
| Stale                   | "Last used {date}"                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | `account.devices.lastUsed`                                                                                                                                                                                 |
| Notifications           | "Emails at once", "Mentions", "Decision requests", "Review requests", "Questions on my feedback", "Answers to my questions", "Daily digest", "One email each morning with what changed."                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | `account.notifications.*`                                                                                                                                                                                  |

### Components

| Region                 | Component                                                                               | Status      | Notes                                                                                                                                                                               |
| ---------------------- | --------------------------------------------------------------------------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tabs, Tables, Switches | Tabs, Table, Switch                                                                     | new variant |                                                                                                                                                                                     |
| Connect an Agent       | ConnectAgentDialog (Modal, read-only Input, SegmentedControl, code block, Copy Buttons) | missing     | the twin of Set Up the Extension (J3, A2); no route of its own (WEB-1); the address comes from the server's config. The new device row appears live once the consent page allows it |

---

# Phone

## Phone inbox

### Purpose

The phone's home: what needs you (A18, J6).

### Header

| Title                        | Tabs                                               | Actions |
| ---------------------------- | -------------------------------------------------- | ------- |
| Top bar: Menu, "Inbox", none | none; kind chips scroll horizontally under the bar | none    |

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

Answer and approve with the thumb (A18, J6). Opened with no `version` in the URL (or from a review Inbox item) it shows the implementation awaiting review, else the accepted version, else the newest. Approve follows the Feedback view's Approve table and Undo toast.

### Header

| Title                       | Tabs                                                   | Actions                                                                                                          |
| --------------------------- | ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| Top bar: Back, "#{n}", More | version Chips scroll horizontally under the screenshot | More: Copy Link, Details, Change Status (members, A33: opens a bottom sheet with Open, In Progress, Implemented) |

### Sections

| Order | Section                                                                                          | Purpose                                                |
| ----- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------ |
| 1     | Screenshot, full width, tap to zoom                                                              | the centre stays on top (owner, design 9.2)            |
| 2     | Title, status, flags, acceptance line                                                            |                                                        |
| 3     | Version Chips                                                                                    |                                                        |
| 4     | Decision card (when open): the tally, no Vote button of its own (the bar's Vote opens the sheet) |                                                        |
| 5     | Thread; each open question entry has Answer Question (44 px)                                     | J6: answer, not only comment                           |
| 6     | Context line and reply field                                                                     | above the bar; the line names the version and the mode |
| 7     | Action bar, fixed at the bottom above the safe area: Approve v{n} · Request Changes · Vote       |                                                        |

### Layout

| Zoom                | Columns | Widths                                     | Notes                                                                        |
| ------------------- | ------- | ------------------------------------------ | ---------------------------------------------------------------------------- |
| Phone 390 px        | 1       | full width                                 | action bar 64 px + safe area; buttons share the width, each at least 44 high |
| Phone at 200 % text | 1       | bar buttons wrap to two rows; never hidden |                                                                              |

### Controls

| Control                            | Component                                                        | Label                                                                                                        | Key                                                          | Disabled reason                                                                                                                                              | State source   |
| ---------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------- |
| Back                               | Button icon                                                      | "Back"                                                                                                       | tap, system back                                             | none                                                                                                                                                         | history        |
| Screenshot                         | Image (tap opens the ZoomViewer)                                 | "Zoom screenshot"                                                                                            | tap                                                          | none                                                                                                                                                         |                |
| Version chips                      | SegmentedControl (scrolls horizontally)                          | "v{n} {Kind}"                                                                                                | tap                                                          | none                                                                                                                                                         | URL `version`  |
| Context line                       | ComposerContext                                                  | "On v{n} {kind}" · "Requesting changes on v{n}" · "Answering {name}'s question"; × "Back to Comment" (44 px) | tap                                                          | none                                                                                                                                                         | composer mode  |
| Reply field                        | Textarea (Composer)                                              | placeholder "Comment…" ("What should change?" or "Answer {name}'s question…" in a mode)                      | tap                                                          | offline reason                                                                                                                                               | draft          |
| Send                               | Button in the field, its label follows the mode                  | "Send" · "Request Changes" · "Answer Question"                                                               | tap                                                          | "Write a comment first."                                                                                                                                     | composer       |
| Answer Question                    | Button ghost on each open question entry, 44 px                  | "Answer Question"                                                                                            | tap                                                          | none                                                                                                                                                         | question state |
| Approve                            | Button (primary when awaiting review)                            | "Approve v{n}"; "Approve v{n} and Close Decision" while a decision is open; wraps to two lines at 200 % text | tap                                                          | absent on v0 of a Change Request; other reasons as the Feedback view's Approve table; guest: shown, aria-disabled, the guest line beside the bar (A31, W-15) | role, version  |
| Request Changes                    | Button secondary                                                 | "Request Changes"                                                                                            | tap                                                          | guest: shown, aria-disabled (A31, W-15)                                                                                                                      | role           |
| Vote                               | Button secondary (opens a Drawer sheet with RadioGroup and Vote) | "Vote"                                                                                                       | tap                                                          | shown only while a decision is open; the only Vote control on the phone                                                                                      | decision       |
| Details                            | Dropdown item → Drawer sheet                                     | "Details"                                                                                                    | tap                                                          | none                                                                                                                                                         |                |
| ZoomViewer: Zoom In, Zoom Out, Fit | Button icons, 44 px, with aria-labels                            | "Zoom In", "Zoom Out", "Fit"                                                                                 | tap; double-tap on the image zooms in, double-tap again fits | at the limits                                                                                                                                                | zoom           |
| ZoomViewer: Close                  | Button icon, 44 px                                               | "Close"                                                                                                      | tap, system back                                             | none                                                                                                                                                         |                |

The zoom viewer never depends on pinch alone: every zoom step has a single-pointer route (WCAG 2.5.1, Level A). Pinch still works.

### Words

| Where                  | Text                                                                                                                                                 | Key                                                                                                                   |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Comment placeholder    | "Comment…"                                                                                                                                           | `phone.feedback.commentPlaceholder`                                                                                   |
| Request Changes prompt | "What should change?"                                                                                                                                | `phone.feedback.requestChangesPrompt`                                                                                 |
| Buttons                | "Approve v{n}", "Approve v{n} and Close Decision", "Request Changes", "Vote", "Send", "Answer Question", "Change Status", "Back", "Details", "Close" | `phone.feedback.actions.*` (`approve` = "Approve v{n}", `answer`, `changeStatus`), `feedback.actions.approveAndClose` |
| Context line           | as Feedback view                                                                                                                                     | `feedback.composer.context.*`                                                                                         |
| Zoom viewer            | "Zoom In", "Zoom Out", "Fit", "Close"                                                                                                                | `phone.feedback.zoomIn`, `.zoomOut`, `.fit`, `phone.feedback.actions.close`                                           |
| Guest line             | "Guests can comment and vote here. Approving and requesting changes need a member."                                                                  | `phone.feedback.guestLine`                                                                                            |
| Others                 | as Feedback view                                                                                                                                     |                                                                                                                       |

### Components

| Region      | Component                                                                                 | Status      | Notes                                                   |
| ----------- | ----------------------------------------------------------------------------------------- | ----------- | ------------------------------------------------------- |
| Action bar  | ActionBar                                                                                 | missing     | UI-risky; uxpatterns sticky bottom actions; Fitts's Law |
| Zoom viewer | ZoomViewer: Modal (full screen), pinch plus Zoom In, Zoom Out, Fit (44 px) and double-tap | new variant | WCAG 2.5.1                                              |
| Sheets      | Drawer (bottom)                                                                           | new variant | phone only (WEB-21)                                     |

## Desktop-only message

### Purpose

Say plainly that this works on a larger screen (A18). Used for organisation and workspace settings, Account › Sign-In Methods, changing device scopes, Connect an Agent, Draw on Screenshot, Post Version and `/operator`. Welcome, Account › Profile, Notifications and Devices (list and Revoke) work on a phone.

### Words

| Where   | Text                                                                                                                                                                                            | Key                                                   |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| Heading | "This works on a larger screen."                                                                                                                                                                | `phone.desktopOnly.heading`                           |
| Text    | "Open this page on your computer to {task}." (tasks: "change settings", "change what a device may do", "connect an agent", "draw on the screenshot", "post a version", "use the operator area") | `phone.desktopOnly.text`, `phone.desktopOnly.tasks.*` |
| Button  | "Back"                                                                                                                                                                                          | `common.actions.back`                                 |

### Components

| Region  | Component  | Status  | Notes |
| ------- | ---------- | ------- | ----- |
| Message | EmptyState | missing |       |

---

# Chrome extension

All extension surfaces use the same `snapmark-kit/ui` wrappers and tokens. On-page surfaces live in a shadow root (WEB-30) and follow the page's light or dark preference only for their own chrome. The compose panel is a `chrome-extension://` iframe inside that root, so the page cannot read what you type; it looks the same (F168).

## Extension popup

### Purpose

Sign in, pick the workspace, start a capture; show where the page comes from (A6, A5, A16, J1, J11).

### Header

| Title                                              | Tabs | Actions           |
| -------------------------------------------------- | ---- | ----------------- |
| Snapmark logo, the organisation › workspace Select | none | Capture (primary) |

### Sections

| Order | Section                                                                       | Purpose                                                                                      |
| ----- | ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| 0     | Unsent feedback line (only when a draft from another page in this tab exists) | "Unsent feedback on {page}." with Resume Feedback and Discard (principle 5: nothing is lost) |
| 1     | Workspace Select                                                              | where feedback goes                                                                          |
| 2     | Environment line                                                              | "omr.ninja · Staging" (A16)                                                                  |
| 3     | Bridge line (localhost only)                                                  | repo, branch, worktree from the Mac app (A5)                                                 |
| 4     | Capture                                                                       | the one action                                                                               |
| 5     | Recently Sent (up to 5; hidden when none)                                     | the sent links stay reachable (FBK-7)                                                        |
| 6     | Footer: avatar menu (Open Snapmark, Sign Out)                                 |                                                                                              |

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

| Control              | Component                                                          | Label                                                                            | Key       | Disabled reason                                                                                                                                                | State source                            |
| -------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| Resume Feedback      | Button primary (while a draft is shown; Capture is then secondary) | "Resume Feedback"                                                                | ↩         | none                                                                                                                                                           | extension storage (per tab and address) |
| Discard draft        | Button ghost                                                       | "Discard"                                                                        | Tab ↩     | none; acts at once with the page toast and Undo                                                                                                                | draft                                   |
| Sign In (signed out) | Button primary                                                     | "Sign In"                                                                        | ↩         | none                                                                                                                                                           | token                                   |
| Workspace            | Select (grouped by organisation)                                   | "Workspace"                                                                      | Tab Space | none                                                                                                                                                           | memberships; remembered per site        |
| Add Environment link | Link                                                               | "Add Environment"                                                                | Tab ↩     | shown only when nothing matches; admins only                                                                                                                   | patterns, role                          |
| Capture              | Button primary                                                     | "Capture" (Tooltip "Capture ({shortcut})": ⌘⇧K on a Mac, Ctrl+Shift+K elsewhere) | ↩, ⌘⇧K    | guest: "Guests can comment, draw and vote. Ask an admin to make you a member to capture."; restricted page: "Chrome doesn't let extensions capture this page." | role, tab URL                           |
| Recent row           | Listbox item                                                       | "#{n} {title}"                                                                   | ↑/↓, ↩    | none                                                                                                                                                           | local list                              |
| Account menu         | Dropdown                                                           | "{name}"                                                                         | Tab ↩     | none                                                                                                                                                           |                                         |
| Try Again            | Button secondary                                                   | "Try Again"                                                                      | ↩         | none                                                                                                                                                           | error                                   |

### Filters

None.

### Words

| Where                | Text                                                                                                                                    | Key                                                             |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Signed out           | "Sign in to point at what should change." · "Sign In"                                                                                   | `extension.popup.signedOut.text`, `.signIn`                     |
| Workspace label      | "Workspace"                                                                                                                             | `extension.popup.workspace`                                     |
| Environment line     | "{host} · {environment}"                                                                                                                | `extension.popup.env.match`                                     |
| No environment       | "{host} matches no environment in {workspace}." · "Add Environment"                                                                     | `extension.popup.env.none`, `.add`                              |
| Bridge connected     | "From your Mac: {repo} · {branch} · {worktree}"                                                                                         | `extension.popup.bridge.connected`                              |
| Bridge not running   | "The Mac app isn't running. Open Snapmark on your Mac to add the repo and branch."                                                      | `extension.popup.bridge.notRunning`                             |
| Bridge off           | "The localhost bridge is off. Turn it on in the Mac app under Settings › Online."                                                       | `extension.popup.bridge.off`                                    |
| Bridge no repo       | "Your Mac found no repo serving {host}. A dev server in Docker can't be traced."                                                        | `extension.popup.bridge.noRepo`                                 |
| Capture              | "Capture" · Tooltip "Capture ({shortcut})"                                                                                              | `extension.popup.capture`, `.captureTooltip`                    |
| Disabled reasons     | "Guests can comment, draw and vote. Ask an admin to make you a member to capture." · "Chrome doesn't let extensions capture this page." | `extension.popup.disabled.*`                                    |
| Recent heading       | "Recently Sent"                                                                                                                         | `extension.popup.recent`                                        |
| Account menu         | "Open Snapmark", "Sign Out"                                                                                                             | `extension.popup.menu.*`                                        |
| Unsent draft         | "Unsent feedback on {page}." · "Resume Feedback" · "Discard"                                                                            | `extension.popup.draft`, `.resumeDraft`, `.discardDraft`        |
| Unreachable          | "Can't reach Snapmark at {address}. Start Snapmark, then try again." · "Try Again"                                                      | `extension.popup.errors.unreachable`, `common.actions.tryAgain` |
| Signed out by revoke | "You were signed out. Sign in again to capture."                                                                                        | `extension.popup.signedOutRevoked`                              |

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

| Order | Section                      | Purpose                                                                                                                                                                                                                                        |
| ----- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1     | Hint bar                     | what to do, Esc to cancel                                                                                                                                                                                                                      |
| 2     | Hover outline on the element | 2 px in the remove-red role with a light wash (red is the feedback signal, owner 2026-10-25), drawn from a named token `x-picker-outline` (proposed for `examples/snapmark.md`; whether it may share the remove red is owner-decisions.md #11) |
| 3     | Chip beside the element      | region › module › component · file:line                                                                                                                                                                                                        |
| 4     | Area mode                    | drag outline with the live size                                                                                                                                                                                                                |

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
| Cancel  | Button ghost in the hint bar | "Cancel" | Esc                                     | none                                          |                     |

### Words

| Where             | Text                                                                    | Key                           |
| ----------------- | ----------------------------------------------------------------------- | ----------------------------- |
| Hint              | "Click an element, or drag an area. ↑ selects the parent. Esc cancels." | `extension.picker.hint`       |
| Chip with code    | "{region} › {module} › {component} · {file}:{line}"                     | `extension.picker.chip.code`  |
| Chip without code | "{region} › {selector}"                                                 | `extension.picker.chip.plain` |
| Frame             | "Inside a frame. Snapmark points at the frame."                         | `extension.picker.frame`      |
| Area size         | "{width} × {height}"                                                    | `extension.picker.size`       |
| Cancel            | "Cancel"                                                                | `common.actions.cancel`       |

### Components

| Region  | Component     | Status  | Notes                                                  |
| ------- | ------------- | ------- | ------------------------------------------------------ |
| Overlay | PickerOverlay | missing | UI-risky; shadow root; never in the screenshot (CAP-2) |

## Extension drawing and compose

### Purpose

Mark up the screenshot and say what you expect, with the code location visible (A1, A4, A13, A15, A22, J1). The draft (screenshot, anchor, marks, kind, module, title, description, notes) is kept in extension storage per tab and page address until it is sent or discarded, so a dev-server reload never loses it (principle 5; resumption of interrupted tasks). A reload of the same address reopens the panel on the draft; after navigating elsewhere the popup offers Resume Feedback.

### Header

| Title                                                                                       | Tabs | Actions                                   |
| ------------------------------------------------------------------------------------------- | ---- | ----------------------------------------- |
| Drawing toolbar on top of the screenshot; compose panel title "New Feedback in {workspace}" | none | Send Feedback (primary), Discard Feedback |

### Sections

| Order | Section                                                                                                                                                                                | Purpose                                           |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| 1     | Drawing toolbar: Select (C), Reference/Card (1), Box/Ellipse (2), Arrow (3), Pen (4), Cross/Remove Area (5), Highlighter/Spotlight (6), Cut & Move/Redact (7), mark colour, Undo, Redo | the Mac editor's groups and keys (EDT-1 to EDT-8) |
| 2     | Screenshot of the viewport with the picked element outlined                                                                                                                            |                                                   |
| 3     | Compose panel: kind (Change Request, Comment)                                                                                                                                          |                                                   |
| 4     | Title, Description                                                                                                                                                                     | what you expect (job "Explain")                   |
| 5     | Reference notes (once a reference exists)                                                                                                                                              | "What about 1?" (NTE-3)                           |
| 6     | Module                                                                                                                                                                                 | A13                                               |
| 7     | "Where": region, module, component, file, repo, branch, environment, version                                                                                                           | A15, A22, J5                                      |
| 8     | Footer: Discard Feedback, Send Feedback                                                                                                                                                | WIN-5 binding: primary bottom right               |

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

| Control           | Component               | Label                                                                                                                                                | Key                                         | Disabled reason                                     | State source  |
| ----------------- | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- | --------------------------------------------------- | ------------- |
| Tools             | DrawingToolbar          | the shared `annotations.tools.*` names: Select, Reference/Card, Box/Ellipse, Arrow, Pen, Cross/Remove Area, Highlighter/Spotlight, Cut & Move/Redact | C, 1–7 (not while typing; KEY-3)            | Pen pointer only (EX-6)                             |               |
| Mark colour       | Popover with swatches   | "Mark Colour"                                                                                                                                        | Tab ↩                                       | Remove and Highlight ignore it (EX-1)               |               |
| Undo, Redo        | Button icons + Tooltips | "Undo (⌘Z)", "Redo (⇧⌘Z)"                                                                                                                            | ⌘Z, ⇧⌘Z                                     | nothing to undo                                     | history       |
| Kind              | SegmentedControl        | "Change Request", "Comment"                                                                                                                          | ←/→                                         | none                                                |               |
| Title             | TextField               | "Title" (`autocomplete="off"`)                                                                                                                       | Tab                                         | none                                                |               |
| Description       | Textarea                | "Description" (`autocomplete="off"`)                                                                                                                 | Tab                                         | none                                                |               |
| Reference note    | Textarea                | "Note for {n}" (label), placeholder "What about {n}?"                                                                                                | Tab; placing a reference focuses it (NTE-2) | none                                                |               |
| Module            | Autocomplete            | "Module"                                                                                                                                             | type, ↩                                     | create option for members only                      | modules, role |
| Copy (Where rows) | Button icon + Tooltip   | "Copy {field}"                                                                                                                                       | Tab ↩                                       | none                                                |               |
| Show All          | Button ghost            | "Show All"                                                                                                                                           | Tab ↩                                       | 150 % only                                          |               |
| Discard           | Button secondary        | "Discard Feedback" (closes the panel and the overlay at once; a toast on the page "Discarded the feedback." with Undo for 8 s)                       | Esc at the last step (KEY-5) does the same  | none                                                |               |
| Send Feedback     | Button primary          | "Send Feedback"                                                                                                                                      | ⌘↩                                          | "Write what you expect, or draw on the screenshot." | form, marks   |

### Filters

None.

### Words

| Where                          | Text                                                                                                                                                                       | Key                                                             |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Panel title                    | "New Feedback in {workspace}"                                                                                                                                              | `extension.compose.title`                                       |
| Kind                           | "Change Request", "Comment"                                                                                                                                                | `extension.compose.kind.*`                                      |
| Title label, placeholder       | "Title", "Total should be bold"                                                                                                                                            | `extension.compose.titleLabel`, `.titlePlaceholder`             |
| Description label, placeholder | "Description", "What should it look like instead?"                                                                                                                         | `extension.compose.descriptionLabel`, `.descriptionPlaceholder` |
| References heading             | "References"                                                                                                                                                               | `extension.compose.references`                                  |
| Reference note                 | "Note for {n}" · "What about {n}?"                                                                                                                                         | `extension.compose.refLabel`, `.refPlaceholder`                 |
| Module                         | "Module", "Choose or type a module", "Add module “{name}”"                                                                                                                 | `extension.compose.module.*`                                    |
| Where heading                  | "Where"                                                                                                                                                                    | `extension.compose.where.heading`                               |
| Where labels                   | "Region", "Module", "Component", "File", "Repo", "Branch", "Environment", "Version"                                                                                        | `feedback.details.*` (shared)                                   |
| Not found                      | "Not found"                                                                                                                                                                | `feedback.details.notFound`                                     |
| No code                        | "No code location found. The agent searches by page, selector and text."                                                                                                   | `extension.compose.where.noCode`                                |
| Repo unknown on localhost      | "Unknown. Open the Mac app to add it."                                                                                                                                     | `extension.compose.where.repoUnknown`                           |
| Show all                       | "Show All"                                                                                                                                                                 | `common.actions.showAll`                                        |
| Tool names                     | "Select", "Reference", "Card", "Box", "Ellipse", "Arrow", "Pen", "Cross", "Remove Area", "Highlighter", "Spotlight", "Cut & Move", "Redact", "Mark Colour", "Undo", "Redo" | `annotations.tools.*` (shared with the Mac app's names)         |
| Tool tooltip                   | "{tool} ({key}) · press again for {next}"                                                                                                                                  | `annotations.tooltip`                                           |
| Buttons                        | "Discard Feedback", "Send Feedback", "Sending the feedback…", "Sending the feedback… {percent} %" (both announced)                                                         | `extension.compose.actions.*`                                   |
| Disabled                       | "Write what you expect, or draw on the screenshot."                                                                                                                        | `extension.compose.disabled`                                    |
| Error                          | "Couldn't send the feedback. Snapmark had a problem. Your marks and text are kept. Try again." · "Try Again"                                                               | `extension.compose.errors.send`                                 |
| Restored line                  | "Restored after the page reloaded." (`role="status"`; the draft is kept per tab and address until sent or discarded)                                                       | `extension.compose.restored`                                    |
| Discarded toast                | "Discarded the feedback." · "Undo"                                                                                                                                         | `extension.compose.discarded`, `common.actions.undo`            |

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
| Open Feedback   | Button secondary      | "Open Feedback"   | ↩   | none            |              |
| Capture Another | Button primary        | "Capture Another" | ⌘⇧K | none            |              |
| Close           | Button icon + Tooltip | "Close (Esc)"     | Esc | none            |              |

### Words

| Where   | Text                                        | Key                   |
| ------- | ------------------------------------------- | --------------------- |
| Line    | "Sent to {workspace} as #{n}."              | `extension.sent.line` |
| Buttons | "Open Feedback", "Capture Another", "Close" | `extension.sent.*`    |

### Components

| Region | Component                      | Status  | Notes |
| ------ | ------------------------------ | ------- | ----- |
| Panel  | SentPanel (polite live region) | missing | ACC-6 |

---

# Mac app (minimal new surfaces)

The Mac app keeps its own rules: macOS words, sentence case for messages (WRD-1) with Title Case only on menu items, buttons and status lines as macOS does, native controls, its Settings window and session window. Nothing here changes the local workflow without an account (intent "Must not change").

## Settings › Online tab

### Purpose

Sign in to Snapmark Online through the browser, and turn the localhost bridge on or off (A26, A5, A35, J7, J11). Sign In… opens the consent page in the default browser (OAuth PKCE); after Allow, the browser returns to a loopback address on this Mac and the app comes to the front. There is no code to compare.

### Header

| Title           | Tabs                                                   | Actions                                                                                                                                                      |
| --------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Settings window | General · Capture · Shortcuts · **Online** (new, last) | none. WIN-7 and ADR 2026-10-25 decision 7 are amended to name four tabs; Online's Sign In… is a flow, not a setting, and the bridge checkbox applies at once |

### Sections

| Order | Section                                                                         | Purpose |
| ----- | ------------------------------------------------------------------------------- | ------- |
| 1     | Snapmark Online: signed out (one line, Sign In…) or signed in (email, Sign Out) |         |
| 2     | Waiting line while the person finishes in the browser                           | A35     |
| 3     | Localhost Bridge: checkbox with its status line                                 | A5      |

### Layout

| Zoom  | Columns                           | Widths            | Notes |
| ----- | --------------------------------- | ----------------- | ----- |
| 100 % | the Settings window's form layout | as the other tabs |       |
| 150 % | n/a (macOS)                       |                   |       |

### Controls

| Control          | Component                                                                               | Label              | Key       | Disabled reason | State source                |
| ---------------- | --------------------------------------------------------------------------------------- | ------------------ | --------- | --------------- | --------------------------- |
| Sign In…         | native button                                                                           | "Sign In…"         | ↩         | none            | token                       |
| Open Browser     | native button (default), shown while waiting; reopens the consent page                  | "Open Browser"     | ↩         | none            | sign-in flow                |
| Cancel           | native button                                                                           | "Cancel"           | Esc       | none            |                             |
| Sign Out         | native button                                                                           | "Sign Out"         | Tab Space | none            |                             |
| Localhost Bridge | native checkbox (the Settings window's existing pattern, like "Open Snapmark at login") | "Localhost Bridge" | Space     | none            | Mac setting (on by default) |

### Words

| Where           | Text                                                                                                                                            | Key                                            |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| Tab             | "Online"                                                                                                                                        | `mac.settings.online.tab`                      |
| Heading         | "Snapmark Online"                                                                                                                               | `mac.settings.online.heading`                  |
| Signed out line | "Share sessions with your team, and let the Chrome extension find your repos."                                                                  | `mac.settings.online.signedOut`                |
| Buttons         | "Sign In…", "Sign Out", "Open Browser", "Cancel"                                                                                                | `mac.settings.online.*`                        |
| Waiting         | "Finish signing in in your browser."                                                                                                            | `mac.settings.online.waiting`                  |
| Browser page    | "Snapmark is connected. You can close this tab." · "Snapmark was not connected. You can close this tab." (the loopback page the Mac app serves) | `mac.settings.online.browser.{allowed,denied}` |
| Signed in       | "Signed in as {email}"                                                                                                                          | `mac.settings.online.signedIn`                 |
| Expired         | "Sign-in expired. Sign in again."                                                                                                               | `mac.settings.online.expired`                  |
| Cancelled       | "Sign-in was cancelled." (Deny in the browser)                                                                                                  | `mac.settings.online.cancelled`                |
| Bridge          | "Localhost Bridge" · "Tells the Chrome extension which repo a localhost page comes from." · "Extension connected" · "Extension not found"       | `mac.settings.bridge.*`                        |

### Components

| Region | Component           | Status                                      | Notes                                                               |
| ------ | ------------------- | ------------------------------------------- | ------------------------------------------------------------------- |
| Tab    | Settings window tab | have (General, Capture, Shortcuts); new tab | WIN-7 amended: four tabs; settings apply at once, sign-in is a flow |

## Share to Workspace sheet and sync status

### Purpose

Link a session to a workspace and see its sync at a glance (A26, J7). When the server refuses the sync (device signed out or revoked, access lost because the person left the organisation or the workspace or session was deleted, or another refusal), the footer and menu bar say "Sync Stopped" with the reason and one way on; changes stay on the Mac (J11).

### Header

| Title                                     | Tabs | Actions                                                          |
| ----------------------------------------- | ---- | ---------------------------------------------------------------- |
| Sheet: "Share “{session}” to a Workspace" | none | Share (the one primary), Cancel (has focus when the sheet opens) |

### Sections

| Order | Section                                                                                                                                                                  | Purpose                                                                                                       |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| 1     | Workspace pop-up (Organisation › Workspace)                                                                                                                              |                                                                                                               |
| 1a    | What leaves the Mac: one line naming the screenshots, notes and marks, the workspace and how many people can see them; and that after Stop Sharing the online copy stays | external write: review before it leaves (DS `external-write.md`); screenshots can hold private screen content |
| 2     | Session window footer: sync status, including Sync Stopped with its reason and one way on                                                                                | a refused sync never reads as Synced or Offline (J7, J11)                                                     |
| 3     | Menu bar menu header suffix: "· Synced", "· Offline" or "· Sync Stopped"                                                                                                 | where the eye already is (Selective Attention)                                                                |
| 4     | Session menu: Share to Workspace…, View Online, Stop Sharing                                                                                                             | WIN-9: names its object                                                                                       |
| 5     | Editor note callout: Edited elsewhere                                                                                                                                    | design 7                                                                                                      |

### Layout

| Zoom  | Columns      | Widths | Notes |
| ----- | ------------ | ------ | ----- |
| 100 % | native sheet | 420 pt |       |

### Controls

| Control              | Component                                 | Label                                                                                                                 | Key          | Disabled reason                                                                         | State source               |
| -------------------- | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------ | --------------------------------------------------------------------------------------- | -------------------------- |
| Share to Workspace…  | toolbar button and Session menu item      | "Share to Workspace…"                                                                                                 | Session menu | not signed in: the sheet explains                                                       | token                      |
| Workspace            | native pop-up                             | "Workspace"                                                                                                           | Space        | none                                                                                    | memberships                |
| Share                | native default button                     | "Share"                                                                                                               | ↩            | not signed in: not shown (the sheet shows only Open Settings…, the default, and Cancel) | token                      |
| Cancel               | native button                             | "Cancel"                                                                                                              | Esc          | none                                                                                    |                            |
| Manifest line        | static text under the pop-up              | see Words                                                                                                             | none         | none                                                                                    | session, workspace members |
| View Online          | menu item, footer link                    | "View Online"                                                                                                         | Session menu | not shared: hidden                                                                      | link                       |
| Stop Sharing         | menu item                                 | "Stop Sharing…"                                                                                                       | Session menu | not shared: hidden                                                                      | link                       |
| Open Settings…       | sheet button (default when not signed in) | "Open Settings…"                                                                                                      | ↩            | none                                                                                    |                            |
| Sync Stopped actions | footer buttons                            | "Sign In…" (signed out) · "Share to Another Workspace…" and "Stop Sharing…" (no access) · "Try Again" (other refusal) | Tab Space    | none                                                                                    | sync state                 |

### Words

| Where            | Text                                                                                                                                                                                                                                                                                                           | Key                                                                                              |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Sheet title      | "Share “{session}” to a Workspace"                                                                                                                                                                                                                                                                             | `mac.share.title`                                                                                |
| Manifest         | "{count, plural, one {# screenshot} other {# screenshots}} and their notes from “{session}” go to {organisation} › {workspace}, where {people, plural, one {# person} other {# people}} can see them."                                                                                                         | `mac.share.manifest`                                                                             |
| Stays line       | "After Stop Sharing, the online copy stays in {workspace}."                                                                                                                                                                                                                                                    | `mac.share.stays`                                                                                |
| Not signed in    | "Sign in to Snapmark Online first." · "Open Settings…"                                                                                                                                                                                                                                                         | `mac.share.signIn`                                                                               |
| Buttons          | "Share", "Cancel", "View Online", "Stop Sharing…"                                                                                                                                                                                                                                                              | `mac.share.*`                                                                                    |
| Footer status    | "Synced · {time}", "Syncing {n} Changes", "Offline · {n} Changes Waiting", "Not Shared"                                                                                                                                                                                                                        | `mac.sync.*`                                                                                     |
| Sync stopped     | "Sync stopped. Signed out of Snapmark Online. Your changes stay on this Mac." · "Sign In…" · "Sync stopped. No access to {workspace}. Your changes stay on this Mac." · "Share to Another Workspace…" · "Stop Sharing…" · "Sync stopped. Snapmark had a problem. Your changes stay on this Mac." · "Try Again" | `mac.sync.stopped.signedOut`, `.signIn`, `.noAccess`, `.shareElsewhere`, `.problem`, `.tryAgain` |
| Menu suffix      | "· Synced", "· Offline", "· Sync Stopped"                                                                                                                                                                                                                                                                      | `mac.sync.menuSuffix.*` (`.stopped`)                                                             |
| Edited elsewhere | "Edited elsewhere. The other text is kept in the thread online."                                                                                                                                                                                                                                               | `mac.sync.editedElsewhere`                                                                       |
| Stop confirm     | "Stop sharing “{session}”? The online copy stays in {workspace}. New changes stay on this Mac." · "Stop Sharing" · "Cancel"                                                                                                                                                                                    | `mac.share.stop.*`                                                                               |

### Components

| Region              | Component                                                   | Status                                                                                                                                                       | Notes |
| ------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----- |
| Sheet, footer, menu | native AppKit-like Electron surfaces in the Mac app's style | the sheet and the "Edited elsewhere" callout are new Mac surfaces (today the app has only `dialog.showMessageBox`); session window and menu: have, new items |       |

---

# Operator area

A separate layout under `/operator` (design 8.0, A17): its own sidebar (Waitlist, Invitations, Organisations, Users, Feature Flags, Usage), a header label "Operator" in neutral text so staff always know where they are, and "Back to App". Desktop only.

## Operator shell and Waitlist

### Purpose

Invite people from the waitlist in batches (J8, A17).

### Header

| Title                                | Tabs                                                                                                                            | Actions                                     |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| "Waitlist" (header label "Operator") | none; status chips All · Waiting · Invited · Joined under the title (a filter, not a section; "All" first as on every chip set) | Invite {n} (primary, only with a selection) |

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

| List     | Columns                                                                                                | Sort                                 | Empty                |
| -------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------ | -------------------- |
| Waitlist | checkbox · Email · Role · Requested (date) · Source (`ref`) · Status (Waiting, Invited, Joined) · More | Requested, oldest first (fair queue) | "No one is waiting." |

### Controls

| Control      | Component                    | Label                                 | Key                                           | Disabled reason                                                                           | State source |
| ------------ | ---------------------------- | ------------------------------------- | --------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------ |
| Status chips | Chip toggles (single choice) | "All", "Waiting", "Invited", "Joined" | Tab Space                                     | none                                                                                      | URL `status` |
| Search       | Input                        | "Search emails"                       | /                                             | none                                                                                      | URL `q`      |
| Role filter  | Chip + Popover               | "Role"                                | F then R                                      | none                                                                                      | URL `role`   |
| Sort         | Select                       | "Sort"                                | Tab Space                                     | none                                                                                      | URL `sort`   |
| Row checkbox | Checkbox                     | "Select {email}"                      | X, ⇧X range, ⌘A "Select All {n} on This Page" | Joined rows: "Already joined."; Invited rows: "Already invited. Resend from Invitations." | row status   |
| Invite {n}   | Button primary               | "Invite {n}"                          | ⌘↩                                            | no selection: hidden                                                                      | selection    |
| Clear        | Button ghost                 | "Clear Selection"                     | Esc                                           | none                                                                                      |              |
| Row More     | Dropdown                     | "Invite", "Remove from Waitlist"      | Tab ↩                                         | none                                                                                      |              |
| Confirm      | Modal                        | "Send Invitations", "Cancel"          | ↩, Esc                                        | none                                                                                      |              |
| Back to App  | Link                         | "Back to App"                         | Tab ↩                                         | none                                                                                      |              |

### Filters

| Filter | Default                 | Options                            | Clear behaviour |
| ------ | ----------------------- | ---------------------------------- | --------------- |
| Status | Waiting                 | All, Waiting, Invited, Joined      | chip            |
| Role   | all                     | the landing's roles                | chip ×          |
| Sort   | Requested, oldest first | Requested oldest, Requested newest | Select          |

### Words

| Where               | Text                                                                                                                       | Key                                                             |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Operator label, nav | "Operator", "Waitlist", "Invitations", "Organisations", "Users", "Feature Flags", "Usage", "Back to App"                   | `operator.nav.*`                                                |
| Status chips        | "All", "Waiting", "Invited", "Joined"                                                                                      | `operator.waitlist.tabs.*`                                      |
| Columns             | "Email", "Role", "Requested", "Source", "Status"                                                                           | `operator.waitlist.columns.*`                                   |
| Selection           | "{n} selected", "Invite {n}", "Clear Selection", "Select All {n} on This Page"                                             | `operator.waitlist.selection.*`, `operator.waitlist.selectAll`  |
| Confirm             | "Invite {n} people? Each gets an email to set up their team. Invitations can be revoked, not unsent." · "Send Invitations" | `operator.waitlist.confirm.*`                                   |
| Row menu            | "Invite", "Remove from Waitlist"                                                                                           | `operator.waitlist.menu.*`                                      |
| Empty               | "No one is waiting."                                                                                                       | `operator.waitlist.empty`                                       |
| Disabled            | "Already joined." · "Already invited. Resend from Invitations."                                                            | `operator.waitlist.joined`, `operator.waitlist.invitedDisabled` |

### Components

| Region | Component                        | Status      | Notes                        |
| ------ | -------------------------------- | ----------- | ---------------------------- |
| Shell  | OperatorShell (AppShell variant) | missing     |                              |
| Table  | Table with selection             | new variant | UI-risky; uxpatterns `table` |

## Operator: Invitations

### Purpose

Track, resend and revoke invitations (J8).

### Header

| Title         | Tabs                                                                                                                  | Actions |
| ------------- | --------------------------------------------------------------------------------------------------------------------- | ------- |
| "Invitations" | none; status chip toggles All · Sent · Accepted · Expired · Revoked under the title (a filter, not a section; WEB-21) | none    |

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

| Control      | Component                    | Label              | Key       | Disabled reason               | State source |
| ------------ | ---------------------------- | ------------------ | --------- | ----------------------------- | ------------ |
| Status chips | Chip toggles (single choice) | see header         | Tab Space | none                          | URL `status` |
| Search       | Input                        | "Search emails"    | /         | none                          | URL `q`      |
| Row More     | Dropdown                     | "Resend", "Revoke" | Tab ↩     | Accepted: "Already accepted." | status       |

### Filters

Status chips and search.

### Words

| Where                 | Text                                                                                                                             | Key                                                                     |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Title, chips, columns | "Invitations", "All", "Sent", "Accepted", "Expired", "Revoked", "Email", "Kind", "Waitlist", "Organisation", "Sent By", "Status" | `operator.invitations.*` (chip keys stay `operator.invitations.tabs.*`) |
| Menu                  | "Resend", "Revoke"                                                                                                               | `operator.invitations.menu.*`                                           |
| Revoke confirm        | "Revoke the invitation to {email}? The link stops working." · "Revoke"                                                           | `operator.invitations.revoke.*`                                         |
| Empty                 | "No invitations here."                                                                                                           | `operator.invitations.empty`                                            |

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

| Where           | Text                                                                                                                 | Key                                      |
| --------------- | -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| Titles, columns | "Organisations", "Organisation", "Owner", "Members", "Guests", "Seats", "Workspaces", "Created", "Last Activity"     | `operator.organisations.*`               |
| Seats cell      | "{used} of {total}"                                                                                                  | `operator.organisations.seatsCell`       |
| Read-only note  | "Read-only. Every view is logged."                                                                                   | `operator.readOnly`                      |
| Change seats    | "Change Seats", "Seats for {organisation}", "Seats", "Reason (kept in the audit log)", "Save", "Give a reason."      | `operator.organisations.seats.*`         |
| Below used      | "{used, plural, one {# seat is in use.} other {# seats are in use.}} Remove members first, or keep at least {used}." | `operator.organisations.seats.belowUsed` |
| Empty           | "No organisations yet."                                                                                              | `operator.organisations.empty`           |

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

| Where           | Text                                                                                             | Key                     |
| --------------- | ------------------------------------------------------------------------------------------------ | ----------------------- |
| Titles, columns | "Users", "Name", "Email", "Organisations", "Last Sign-In", "Joined", "Role", "Kind", "Last Used" | `operator.users.*`      |
| Empty           | "No users yet." · "No devices."                                                                  | `operator.users.empty*` |
| Read-only note  | "Read-only. Every view is logged."                                                               | `operator.readOnly`     |

### Components

| Region | Component | Status      | Notes |
| ------ | --------- | ----------- | ----- |
| Tables | Table     | new variant |       |

## Operator: Feature Flags

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

| Control            | Component                                    | Label                                                                                                 | Key   | Disabled reason | State source |
| ------------------ | -------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ----- | --------------- | ------------ |
| Everyone           | Switch                                       | "On for everyone" (asks first: a ConfirmDialog naming the reach, with a reason kept in the audit log) | Space | none            | flag         |
| Edit organisations | Button ghost → Modal with Autocomplete multi | "Edit" / "Organisations with {flag}"                                                                  | Tab ↩ | none            |              |
| Save               | Button primary                               | "Save"                                                                                                | ⌘↩    | none            |              |

### Words

| Where            | Text                                                                                                                                              | Key                                                                                                |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Title, columns   | "Feature Flags", "Flag", "Description", "Everyone", "Organisations"                                                                               | `operator.flags.*`                                                                                 |
| Switch, edit     | "On for everyone", "Edit", "Organisations with {flag}", "Save"                                                                                    | `operator.flags.*`                                                                                 |
| Everyone confirm | "Turn {state, select, on {on} other {off}} {flag} for every organisation?" · "Reason (kept in the audit log)" · "Turn On" / "Turn Off" · "Cancel" | `operator.flags.everyoneConfirm.text`, `.submit`, `operator.flags.reason`, `common.actions.cancel` |
| Empty            | "No feature flags."                                                                                                                               | `operator.flags.empty`                                                                             |

### Components

| Region | Component                    | Status      | Notes                                                                                                              |
| ------ | ---------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------ |
| Table  | Table, Switch, ConfirmDialog | new variant | the Everyone switch changes the product for every organisation, so it asks first, like Change Seats keeps a reason |

## Operator: Usage

### Purpose

See whether the beta is used (J8; intent success measure).

### Header

| Title   | Tabs                                                                                                  | Actions |
| ------- | ----------------------------------------------------------------------------------------------------- | ------- |
| "Usage" | none; range chip toggles Last 7 Days · Last 30 Days under the title (a filter, not a section; WEB-21) | none    |

### Sections

| Order | Section                                                                                    | Purpose                   |
| ----- | ------------------------------------------------------------------------------------------ | ------------------------- |
| 1     | Four tiles: Organisations, Active Users, Feedback Accepted Through MCP, Screenshots Stored | the success measure first |
| 2     | Daily table: Date, New Feedback, Accepted, MCP Calls, Active Users                         |                           |

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

| Control | Component                    | Label                         | Key       | Disabled reason | State source |
| ------- | ---------------------------- | ----------------------------- | --------- | --------------- | ------------ |
| Range   | Chip toggles (single choice) | "Last 7 Days", "Last 30 Days" | Tab Space | none            | URL `range`  |

### Words

| Where        | Text                                                                                   | Key                                                         |
| ------------ | -------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Title, chips | "Usage", "Last 7 Days", "Last 30 Days"                                                 | `operator.usage.*` (chip keys stay `operator.usage.tabs.*`) |
| Tiles        | "Organisations", "Active Users", "Feedback Accepted Through MCP", "Screenshots Stored" | `operator.usage.tiles.*`                                    |
| Columns      | "Date", "New Feedback", "Accepted", "MCP Calls", "Active Users"                        | `operator.usage.columns.*`                                  |
| Empty        | "No activity in this range."                                                           | `operator.usage.empty`                                      |

### Components

| Region | Component | Status      | Notes                                                         |
| ------ | --------- | ----------- | ------------------------------------------------------------- |
| Tiles  | StatTile  | missing     | uxpatterns `statistics`; numbers only, no charts in release 1 |
| Table  | Table     | new variant |                                                               |

---

## Layout checks

- At 150 % no persistent control hides: the sidebar becomes a rail with Tooltips; the feedback footer and the phone action bar stay fixed; tables drop rank-3 columns into a row dialog (on touch never a Tooltip, which touch cannot open), never the primary action.
- **Rail at 56 px:** organisation switcher (avatar), Search, Inbox (count dot), My Work, then per workspace one icon button for the workspace that opens a menu with Open, Needs Decision, In Review, Done, Modules and Sessions (counts beside them), then Settings and the avatar menu. Every icon has a Tooltip and an aria-label; ⌘\ opens the full sidebar.
- **Reflow (WCAG 1.4.10).** At 200 % zoom (720 CSS px) every desktop screen uses its "Under 900 CSS px" layout, or one column where it gives none: the rail, then main content full width; the feedback view stacks the canvas over the panel. At 320 CSS px every app screen uses its phone layout (the drawer sidebar, one column, tables become row lists with a row dialog), and the public and auth pages are one column. No screen scrolls sideways at any width, except the screenshot canvas and Compare, which pan inside their own box.
- **Facts on touch.** A fact that sits in a Tooltip on desktop (version tab kind, author, date, PR; a table's rank-3 columns) shows on touch as a line in the row dialog or the Details sheet.
- Every list has an empty state with words; every screen names its one primary, or says why it has none (Inbox, lists with rows, Sessions, operator Users, and Device consent, where Allow and Deny have equal weight on purpose: consent never recommends).
- Every action in interaction.md's Action Behaviour table appears above as a control or a menu item.
