# Snapmark brand refresh

**What:** a visual refresh of Snapmark's own windows — the screenshot editor, the session window and the Keyboard Shortcuts window — so the app looks modern and clearly belongs to its logo. Same screens, same controls, same words; new look.

**Owner's words (2026-10-24):** "make it overall appear and look nicer and more modern so it reflects the logo and brand identity palette and feel", "using codex and creating mockups".

**For whom:** a product person or developer reviewing what an AI agent built overnight. They capture dozens of screenshots on the fly with shortcuts, mark them up (numbered notes, boxes, arrows, text cards, cut-and-move, red remove / green approve), and hand the session to Claude Code as Markdown. Benchmarks they know: macOS Screenshot markup, Figma, Xnapper, CleanShot X.

**The brand:** the logo is a "beacon": four rounded viewfinder corners drawn with a cool gradient (#20F4EC cyan → #2492FF blue → #8B3DFF violet) around a rotated rounded square (a diamond) in a pink gradient (#FA6CFF → #EF28A7). The app icon sets it on a near-black tile (#2C2C31 → #0D0D10, hairline #3B3B42). Feel: precise, focused, a little electric — a viewfinder that marks one spot.

**Fixed, in every direction:**

- macOS app (Electron): native traffic lights, system font (SF Pro) unless the direction argues otherwise, follows light/dark mode.
- Remove marks are always red, approve marks always green; the brand colours must not be confused with them.
- The screenshot being marked up stays the hero; chrome must never compete with it.
- Everything is reachable by keyboard; ⌘1–⌘7 pick the seven tools, so the tool order stays.
- The words on the screens stay as they are today (see the reference screenshots).

**The axis the three directions differ on: how loudly the brand speaks.**

1. **Native** — reads as a first-class macOS app; the brand shows only in the accent and a few signature details.
2. **Branded** — the beacon's gradient and viewfinder corners become the app's visual language (selection, focus, active tool, headers), on a dark-tile base like the icon.
3. **Signature** — the brand is the experience: bold gradient surfaces, viewfinder framing of the screenshot, expressive type; the most distinctive, the most risk.
