# Snapmark sitemap

## As built

Snapmark has no pages or routes. It has these surfaces, reached as shown (from the code on `main`,
v0.2.0, corrected by the audit of 2026-09-25). Paths marked "silent" give the reviewer no sign at all.

```
Menu bar icon (corner and dot; tooltip "Snapmark")
└── Menu  (rebuilt only when Snapmark changes its own state, so it can go stale)
    ├── Session: <active session, or —>        (disabled label, looks greyed out)
    ├── Capture region                ⌘⇧1  ──►  macOS capture overlay
    │                                            ├── drag a region / Space + click a window ──►  Editor window
    │                                            │     (no session yet: one is created silently, named by date and time)
    │                                            └── Esc, or a failed capture  ──►  nothing (silent; the two look the same)
    ├── New session                   ⌘⇧2  ──►  notification "New session: <date time>"
    ├── Switch session  ▸  the first 20 session folders in reverse name order (radio items)
    │                      newest first only while every name is a date; a renamed folder sorts to the top;
    │                      the 21st and older cannot be reached; disabled when there are no sessions
    ├── ──
    ├── Open session.md                     ──►  the default app for .md files (silent if the file is gone)
    ├── Show session folder                 ──►  Finder (silent if the folder is gone)
    ├── Copy prompt for AI                  ──►  clipboard, three lines with the path (silent)
    ├── Export session  ▸  ZIP · PDF        ──►  Finder with the file selected (replaces the previous export)
    │                                        └──  on failure: notification "Snapmark: ZIP/PDF export failed" with the raw error
    │   (Open, Show, Copy and Export act on the active session only, and are disabled before the first session)
    ├── ──
    ├── Sessions folder: <path>             (disabled label; cannot be opened)
    ├── Change sessions folder…             ──►  macOS open panel (its explanation is set as a title macOS does not show;
    │                                             button "Open") ──► existing sessions stay behind; the active session
    │                                             silently becomes the new folder's first one
    │                                             (disabled whenever a test folder is set)
    ├── ──
    ├── Open at login                       (checkbox, installed app only)
    ├── Snapmark <version>                  (label)
    ├── Check for updates…                  (installed app only) ──► updater notification only when an update is found;
    │                                             up to date, offline and failed are silent
    └── Quit                                ──►  closes every open editor; their screenshots are lost (no question)

At launch
├── No window and no Dock icon: only the menu bar icon (no first-run hint)
├── Background update check (installed app only)
└── Notification "CommandOrControl+Shift+1 is taken by another app" if a shortcut could not be registered
    (the menu keeps showing the shortcut anyway)

Editor window  (one per capture; opens centred at 1180–1600 × 600–1000 from the image size, no minimum size;
                a second editor opens exactly on top of the first; the title is created as "Snapmark — <session>"
                but the page replaces it with "Snapmark"; no Dock icon, not listed in the menu)
├── Toolbar: 1 Box · 2 Arrow · 3 Cross · 4 Tick · 5 Numbered · 6 Highlighter · 7 Cut & move · V Select
│            (each button shows its key and its current tool, with dots for the other tools in its group;
│             group names Mark · Draw · Remove · Approve · Note · Highlight · Move · Select appear only in tooltips;
│             pressing a key again cycles: 1 Box/Ellipse · 2 Arrow/Pen · 3 Cross/Crossed box/Remove area ·
│             4 Tick/Thumbs up · 5 Numbered/Card · 6 Highlighter/Spotlight/Redact)
│            · colour swatch ("Color") · Undo ⌘Z · → <session> (muted, far right, not clickable)
├── Canvas: the capture with every mark as a movable object (Select: move, resize, ⌫ delete; one mark at a time)
├── Side panel: Comment · References (one note per numbered marker; cards not listed) · Discard ⌘W · Add to session ⌘↵
│   (the whole panel scrolls, buttons included)
├── ⌘↵ / Add to session  ──►  entry appended to session.md, window closes (no confirmation; a second ⌘↵ adds a duplicate)
│                         └── on failure: window stays, button dead, no message
├── ⌘W (also inside a text field) / Discard / the window's close button  ──►  closes at once; the capture is deleted
└── Electron's stock application menu is assumed active (Reload ⌘R, developer tools); not checked

Session folder (Finder): session.md · img/NNN.png · <session>.zip · <session>.pdf
session.md: "# <session>", then per screenshot "## NNN · hh:mm", the image ("Screenshot N"), the comment
            unlabelled, numbered marker notes, "- Card: …" lines, one "Moved …" line
```

Dead ends and missing ways back:

- After "Add to session" there is nowhere to go and no sign of where the screenshot went.
- A saved screenshot cannot be reopened, corrected or removed in the app.
- Sessions after the 20th, and sessions left in a previous sessions folder, are reachable only from Finder.
- An editor behind other windows can only be found with Mission Control or the window list.
- The editor has no route to its session.md, folder or prompt.

Named two ways: "Show session folder" (one session) and "Sessions folder" (where all sessions live);
"Discard" and the window's close button do the same thing.

## Proposed

**A proposal, not decided.** This is the structure the proposed interaction guidelines and the audit
findings imply. Every item traces to a proposed rule; nothing here is accepted until the owner decides.
Items that depend on an open decision are marked _(decision)_.

```
Menu bar icon
└── Menu  (rebuilt every time it opens)
    ├── Checkout review · 7 screenshots               ──►  opens session.md
    │     before the first session: "No session yet: press ⌘⇧1 to capture and start one"
    ├── Capture region                ⌘⇧1  (shows "(shortcut unavailable)" when not registered)
    ├── Capture front window          <shortcut>  (no pointer needed)
    ├── Capture screen                <shortcut>  (no pointer needed)
    ├── Mark up clipboard image                    ──►  Editor window on the clipboard image
    ├── ──
    ├── Copy prompt for AI            <optional global shortcut> (decision) ──► notification "Prompt for Checkout review copied"
    ├── Copy path to session.md                    ──►  notification "Path to session.md copied"
    ├── Open editors (2)  ▸  15:20 · 15:24         ──►  brings that editor forward
    ├── Edit last screenshot · Remove last screenshot  (decision)
    ├── Reopen last screenshot                     (after a discard, until Snapmark quits)
    ├── ──
    ├── New session…                  ⌘⇧2  ──►  optional name, date and time filled in; Return keeps it
    ├── Rename session…
    ├── Switch session  ▸  recent sessions by last use
    │     ├── <each session>  ▸  Make active · Open session.md · Copy prompt for AI · Copy path to session.md · Export ▸
    │     ├── Other session… (14 more)             ──►  chooser in the sessions folder
    │     └── Show all sessions in Finder
    ├── Open session.md · Preview session (decision) · Show in Finder   (a missing file or folder says so and offers
    │                                                                    another session)
    ├── Export session  ▸  ZIP · PDF  ──►  "Exporting PDF…" (disabled) ──► "PDF exported · Show in Finder"
    │                                      (disabled while the session is empty; says whether it replaced an earlier export)
    ├── ──
    ├── Sessions are saved in ~/Documents/Snapmark ──►  Finder
    ├── Change where sessions are saved…  ──►  folder dialog with a message and "Use this folder"
    │                                        ──►  "Move your 12 sessions there too? [Move] [Leave them]"
    │                                        ──►  "Sessions are now saved in … Active: …"
    ├── Shortcuts…                                 ──►  a small window to change the two global shortcuts
    ├── Keyboard shortcuts…  ·  Help (README)
    ├── ──
    ├── Open at login
    ├── Snapmark <version>  ·  Restart to install <version> / Updates: download from GitHub… (until signed)
    └── Quit Snapmark      ⌘Q  ──►  if editors hold work: "2 screenshots are not in a session yet. [Review] [Quit anyway]"

First launch  ──►  one notification: "Snapmark is in your menu bar. Press ⌘⇧1 to capture a region."
Capture without Screen Recording permission  ──►  guide: [Open System Settings] then [Restart Snapmark]
Failed capture  ──►  "Capture failed. No screenshot was taken."  (Esc stays silent)

Editor window  (title "Snapmark — <session>"; minimum 1180 × 600; new editors cascade; opens with Select active;
                its own application menu: Edit · View (zoom, key list) · Window (Close) · Quit; no Reload)
├── Toolbar: group meaning + current tool per button, fixed widths ("1 Shape · Box", "3 Remove · Cross",
│            "4 Approve · Tick", "5 Note · Marker" …), Shift+number cycles, the group's tools visible without cycling
│            · colour control (neutral palette; disabled and showing red/green/yellow for fixed groups)
│            · Undo ⌘Z · Redo ⇧⌘Z · zoom [−] [100%] [+] [Fit] · ?  ──►  key list
├── Canvas: focusable; keyboard crosshair; Tab through marks; multi-select; right-click Delete · Duplicate ·
│           Bring to front · Send to back; dropped images become pieces; never navigates away
├── Side panel
│   ├── Notes: marker notes · cards (A, B…) · moves (M1…) · "Remove 1 · Approve 2"; each row linked to its mark,
│   │          with a remove control; only this list scrolls
│   ├── Comment (grows with its text)
│   ├── Hint for the active tool (always true)
│   └── pinned foot: Session: Checkout review ▾ · will be 008
│                    [Discard screenshot]            [Add to session ⌘↵]
│                    (session menu: Open session.md · Show in Finder · Copy prompt for AI ·
│                     Add to another session ▸ · New session…)
│                    failure area: "Couldn't add to … [Try again] [Add to another session…]"
├── ⌘↵ ──►  "Adding…" ──►  window closes; notification "Added 008 to Checkout review · Open session.md"
└── ⌘W / Discard screenshot / close button / Quit  ──►  with work: sheet "Discard this screenshot? … [Keep editing] [Discard]"
                                                      without work: closes at once

session.md: "# <session>", one line explaining the marks, then per screenshot
            "## 004 · <first line of the comment>", the image with descriptive alt text,
            "Remove: … · Approve: …", numbered notes, lettered cards with what they point at,
            labelled moves, the labelled comment
PDF: the same key first; titled, English, tagged
```

Open decisions that change this structure: whether repeat key presses cycle (Shift) or keep the tool;
whether an open editor follows a session switch; whether saved screenshots become editable or only the
last one can be removed; whether exports replace or keep each version; whether the Dock icon shows while
an editor is open; whether "Copy prompt for AI" gets a global shortcut.
