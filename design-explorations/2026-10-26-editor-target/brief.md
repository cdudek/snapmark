# Snapmark editor: where the screenshot goes

**The axis:** where the destination lives in the editor. A in the window title, B in the toolbar, C in a row directly above the commit button, D inside the commit button. Everything else in the editor stays as it is today. Pick one.

**What is being decided** (owner, 2026-10-26): in the editor, (a) Session vs One-Shot, and (b) which session: the current one, an older one, or a new one. Round 1's side-column tabs plus "Older Sessions… / New Session" buttons felt cluttered. The One-Shot panel itself (Beautify) stays as it is today.

**What the evidence says** (UX pattern library, Laws of UX, this repo's interaction guidelines):

- Two options that swap a panel are a segmented control, not tabs or a toggle (`tabs.md`, "When not to use").
- Choosing the target is rare, so it is a short menu whose face shows the current session (`selection-input.md`). The list follows the menu bar's own Switch Session: the 10 most recent, then Older Sessions….
- The capture bar ADR, decision 3, treats One-Shot as a destination, next to the sessions, like ⇧⌘5's Options ▸ Save to, which lists Clipboard beside folders.
- Fitts and Proximity put the destination next to the button that sends there. Common Region keeps the notes column for notes only. Von Restorff allows one blue element per region.
- Repo rules: KEY-1 (⌃⇧N is New Session everywhere); WIN-5 (Discard and Add sit bottom right); CAP-5 (the button names what it does: "Add to Session", or "Copy" in One-Shot); WIN-6 (⌘O already means Edit Again).

**Two images per direction (light):** the editor in Session, and the same editor with the destination menu open.
