# Snapmark sitemap

## As built

Snapmark has no pages or routes. It has these surfaces, reached as shown (from `src/main.ts` on `main`, v0.2.0):

```
Menu bar icon (corner and dot)
└── Menu
    ├── Session: <active session>                (label)
    ├── Capture region                ⌘⇧1  ──►  macOS capture overlay  ──►  Editor window
    ├── New session                   ⌘⇧2  ──►  notification "New session: <name>"
    ├── Switch session  ▸  <up to 20 sessions, newest first>
    ├── Open session.md                     ──►  the owner's default Markdown app
    ├── Show session folder                 ──►  Finder
    ├── Copy prompt for AI                  ──►  clipboard
    ├── Export session  ▸  ZIP · PDF        ──►  Finder, file selected
    ├── Sessions folder: <path>             (label)
    ├── Change sessions folder…             ──►  macOS open dialog
    ├── Open at login                       (checkbox, installed app only)
    ├── Snapmark <version>                  (label)
    ├── Check for updates…                  (installed app only)
    └── Quit

Editor window  (title "Snapmark — <session>")
├── Toolbar: 1 Mark · 2 Draw · 3 Remove · 4 Approve · 5 Note · 6 Highlight · 7 Move · V Select · colour · Undo · → <session>
├── Canvas: the capture with every mark as a movable object
└── Side panel: Comment · References (one note per numbered marker) · Discard ⌘W · Add to session ⌘↵
```

## Proposed

_Empty until an audit._
