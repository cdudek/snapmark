# Questions: 2026-10-27-calm-style

Open questions met while building. Each has the default taken; the owner answers here.

## Q1 `data-surface="system"` on macOS only

- **Question:** F3 says every window sets `data-surface="system"`. Should Linux (CI's smoke run) set it too?
- **Default taken:** macOS only. `src/surface.ts` sets it when `navigator.platform` is a Mac, as `bar.ts` already decided vibrancy. Linux has no window material, so it keeps the tokens' web greys and the smoke test still renders.
- **Milestone:** 1
- **Answer:**
