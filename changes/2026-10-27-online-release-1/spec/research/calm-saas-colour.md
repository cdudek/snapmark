---
type: research
status: proposal
created: 2026-10-28
author: Claude, for the owner
project: online-release-1
answers: A36 ("the current design looks very grey in grey. also there is no dark mode version")
binding: A9 (HeroUI, minimal styling except colours, radius, theming), A10 (clear reusable tokens), A11 ("simple and effective ui, calm, productive"), annotations coral #E5484D (owner)
---

# Calm SaaS colour: research and three directions

## Why the prototype looks grey in grey

- The system's `ground` is neutral 200 (`#dde0e3`, OKLCH L 0.905). Every screen sits on that mid grey, with white panels on top. Two greys and white, and nothing else.
- The neutrals have no tint (chroma near 0). Pure grey reads flat next to a colourful screenshot.
- The only hue in the chrome is the blue button. Status, guest and agent have no colour of their own, so the screen has no quiet colour at all.
- Dark mode reuses the same untinted ramp, darkened. It reads as grey too.

## 1. Findings: what makes calm but not grey

1. **Fewer, smarter colour inputs.** Linear's 2024 redesign moved its themes from HSL to LCH and cut 98 theme variables down to three: base colour, accent colour and contrast. Light and dark come from the same generator, and less of the blue chrome feeds into the neutrals. https://linear.app/now/how-we-redesigned-the-linear-ui
2. **Warmer, less saturated greys. Navigation recedes.** Linear's March 2026 refresh moved its default greys "from a cool blue-tinted palette toward a warmer, less saturated gray". It made the sidebar "a few notches dimmer" so the work area leads. It also softened borders and separators and removed coloured team-icon backgrounds. https://linear.app/now/behind-the-latest-design-refresh
3. **Tinted greys match the accent.** Radix ships greys tinted towards a hue (slate, mauve, sage, olive, sand). Its advice: "choose the gray scale which is saturated with the hue closest to your accent hue". It warns against saturated greys on dark backgrounds. https://www.radix-ui.com/colors/docs/palette-composition/composing-a-palette
4. **Every step has a job.** In Radix, steps 1 and 2 are app and subtle backgrounds, 3 to 5 are component fills, 6 to 8 are borders, 9 and 10 are solids, and 11 and 12 are text. Calm comes from using each step only for its job. https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale
5. **One main background, a second used sparingly.** Vercel's Geist says to use Background 1 "in most instances, especially when color is being placed on top". Background 2 is for "subtle background differentiation" only. Steps 100 to 300 are component fills, 400 to 600 are borders, 900 and 1000 are text. https://vercel.com/geist/colors
6. **HeroUI v3's own default is lighter than ours.** Its `--background` is `oklch(0.9702 0 0)` with a white `--surface` in light mode. In dark mode `--background` is `oklch(12% 0.005 285.8)`, a faintly violet-tinted black. All its colours are OKLCH CSS variables (`--accent`, `--accent-foreground`, `--default`, `--surface`, `--overlay`, `--border`, `--muted`, `--focus`, `--success`, `--warning`, `--danger`). https://heroui.com/docs/react/getting-started/colors
7. **Perceptual spaces give even contrast across hues.** Stripe built its palette in CIELAB so that yellow and blue reach the same contrast at the same step. It found the lightest badge tints too hard to tell apart, so it moved badge backgrounds and text up one step. https://stripe.com/blog/accessible-color-systems
8. **Tailwind v4's palette is OKLCH and wide gamut.** Its default palette moved from RGB to OKLCH "to make the colors more vivid". OKLCH is the shared language of HeroUI v3 and Tailwind v4. https://tailwindcss.com/blog/tailwindcss-v4
9. **Dark mode is designed, not inverted.** Superhuman uses no pure black or white. Nearer layers are lighter ("the closer the layer is to the user, the lighter the surface"). Accents follow "preserve hue, reduce lightness, and increase saturation", and white text is dimmed to cut halation. https://blog.superhuman.com/how-to-design-delightful-dark-themes/
10. **Monochrome chrome is a credible calm choice.** Cal.com's brand is "intentionally grayscale" with colour used sparingly. The colour that remains then means something. https://cal.com/brand
11. **Warmth comes from the canvas, not the accent.** Third-party token extractions show Granola on a warm cream canvas (about `#f7f7f2`) with one olive accent. Notion's neutrals run warm (about `#f9f9f8` to `#494744`). Both are unofficial readings, so treat the values as approximate. https://www.shadcn.io/design/granola and https://open-design.ai/systems/notion/
12. **A tinted frame can make a product feel personal without shouting.** Arc lets each Space pick a colour or gradient that tints the window frame, while the content stays neutral. https://en.wikipedia.org/wiki/Arc_(web_browser)
13. **Status colour is a convention, not a rule.** Plane's states have groups (backlog, unstarted, started, completed, cancelled). Its suggested colours are grey for backlog, blue for unstarted, yellow for started and green for completed. https://docs.plane.so/core-concepts/issues/states
14. **The canvas behind a picture is its own colour.** Figma's canvas default follows the theme (community-reported as `#F5F5F5` in light and `#1E1E1E` in dark), separate from the panels around it. A screenshot needs a quiet stage of its own, not the panel colour. https://help.figma.com/hc/en-us/articles/360041064814
15. **The numbers to hit.** Text needs 4.5:1. UI parts and their states need "a contrast ratio of at least 3:1 against adjacent color(s)" (WCAG 2.2, SC 1.4.11). https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html

**Not found:** none of Attio, Height, Raycast, Things, Notion Calendar or Dia publish their colour tokens. Things' own post says only that its dark mode is "finely tuned" (https://culturedcode.com/things/blog/2018/09/night-and-day/). Those products shaped the directions below as references, not as sources of values.

## What all three directions share

- **A lighter canvas, white content.** `canvas` moves from L 0.905 to L 0.97 and gets a faint tint. Panels, the thread and lists are `surface-1` (white or near white). That one change does most of the "not grey" work (findings 5, 6).
- **Tinted neutrals.** Every grey carries a little of one hue (chroma 0.006 to 0.03). The tint is never strong enough to fight a screenshot (finding 3).
- **The screenshot stage is `canvas`.** The screenshot sits on it with a 1 px `border` and the `e1` shadow in light mode, and with a 1 px `border` in dark mode. The screenshot itself is never dimmed or tinted in dark mode, because it is evidence.
- **Coral `#E5484D` stays the annotation colour in all three.** It reads at 3.6:1 on every light canvas, 4.9:1 on every dark canvas and 3.9:1 on a white screenshot, so it clears 3:1 everywhere. `danger` (remove, destructive) moves to a deeper crimson in light mode so it stays apart from coral (CIE76 23 light, 21 dark).
- **Colour for meaning, always with a word or a shape.** Status chips are a tinted background, coloured text and a dot: Open is neutral, In Progress amber, Implemented violet (blue in direction C), Accepted green. Guest is a pink chip. Agent entries ("Ben via Claude") get a teal chip or avatar ring. Every colour sits next to a label, so colour is never the only signal.
- **Accent budget: one filled accent per region.** The primary button (Approve v2), the selected nav row as `sidebar-active` (neutral or tinted, never a blue outline), links in `accent-text`.
- **Dark is its own ladder.** Canvas L 0.17, surfaces 0.205, 0.25 and 0.275 (nearer is lighter), sidebar a notch darker than the canvas. Text is off-white (L 0.95), never pure white (finding 9).

## 2. The three directions

### A. Clear Sky (keeps the brand blue)

**Idea.** Cool slate neutrals with a breath of blue, white content, and the brand blue `#0F72DB` as the one filled accent.

**Echoes.** Linear before its 2026 refresh, Things, Vercel Geist, Height, Notion Calendar.

**On the feedback view.** The canvas and stage are a pale sky grey (`#f3f6fa`), the thread and toolbar white, the sidebar a notch cooler. Approve v2 is the only blue fill. In dark mode everything is a blue-black ladder from `#0b1015`, with the same `#0F72DB` button. The logo blue `#2492FF` stays for the logo only: white on it is 3.17:1.

| Token                     | Light hex | Light OKLCH              | Dark hex  | Dark OKLCH               |
| ------------------------- | --------- | ------------------------ | --------- | ------------------------ |
| `canvas`                  | `#f3f6fa` | `oklch(0.972 0.006 255)` | `#0b1015` | `oklch(0.170 0.013 249)` |
| `surface-1`               | `#ffffff` | `oklch(1.000 0 0)`       | `#13181e` | `oklch(0.207 0.014 253)` |
| `surface-2`               | `#ebeff5` | `oklch(0.951 0.009 258)` | `#1d2229` | `oklch(0.250 0.015 257)` |
| `surface-3`               | `#ffffff` | `oklch(1.000 0 0)`       | `#23282f` | `oklch(0.275 0.015 257)` |
| `sidebar`                 | `#eff3f8` | `oklch(0.963 0.008 254)` | `#070b11` | `oklch(0.148 0.015 257)` |
| `sidebar-active`          | `#e1e7ee` | `oklch(0.925 0.011 252)` | `#1d232c` | `oklch(0.254 0.019 258)` |
| `border`                  | `#dfe3e9` | `oklch(0.915 0.009 258)` | `#2a3037` | `oklch(0.306 0.015 252)` |
| `border-strong`           | `#80878f` | `oklch(0.620 0.015 252)` | `#686f79` | `oklch(0.539 0.018 257)` |
| `text-1`                  | `#151b23` | `oklch(0.220 0.018 256)` | `#eceff2` | `oklch(0.951 0.005 248)` |
| `text-2`                  | `#4f565f` | `oklch(0.450 0.017 255)` | `#b2b8c0` | `oklch(0.780 0.013 256)` |
| `text-3`                  | `#5e656f` | `oklch(0.504 0.018 257)` | `#999fa7` | `oklch(0.700 0.014 256)` |
| `accent`                  | `#0f72db` | `oklch(0.561 0.181 255)` | `#0f72db` | `oklch(0.561 0.181 255)` |
| `on-accent`               | `#ffffff` | `oklch(1.000 0 0)`       | `#ffffff` | `oklch(1.000 0 0)`       |
| `accent-subtle`           | `#e4f0ff` | `oklch(0.951 0.024 254)` | `#152c48` | `oklch(0.290 0.059 254)` |
| `accent-text`             | `#0f61c3` | `oklch(0.506 0.170 257)` | `#80bdfb` | `oklch(0.781 0.109 250)` |
| `focus`                   | `#2279dc` | `oklch(0.580 0.171 255)` | `#53a3f2` | `oklch(0.700 0.141 250)` |
| `success`                 | `#0e8c41` | `oklch(0.561 0.150 150)` | `#4ac06c` | `oklch(0.721 0.161 150)` |
| `success-subtle`          | `#e2f9e6` | `oklch(0.960 0.035 151)` | `#122d19` | `oklch(0.269 0.050 150)` |
| `success-text`            | `#0f6a31` | `oklch(0.461 0.120 150)` | `#83dc97` | `oklch(0.821 0.130 150)` |
| `warning`                 | `#c5770f` | `oklch(0.640 0.140 65)`  | `#f5ae39` | `oklch(0.800 0.150 75)`  |
| `warning-subtle`          | `#fff2d8` | `oklch(0.965 0.037 85)`  | `#382409` | `oklch(0.279 0.050 71)`  |
| `warning-text`            | `#864e18` | `oklch(0.480 0.100 60)`  | `#f7c56d` | `oklch(0.850 0.120 80)`  |
| `danger`                  | `#a70f3b` | `oklch(0.469 0.180 14)`  | `#f46a82` | `oklch(0.699 0.170 12)`  |
| `danger-subtle`           | `#ffedec` | `oklch(0.960 0.020 21)`  | `#421b1c` | `oklch(0.280 0.061 20)`  |
| `danger-text`             | `#a41b39` | `oklch(0.469 0.170 16)`  | `#fda1a0` | `oklch(0.801 0.110 20)`  |
| `info`                    | `#007cb7` | `oklch(0.559 0.128 240)` | `#55aee8` | `oklch(0.720 0.120 240)` |
| `info-subtle`             | `#e6f4ff` | `oklch(0.960 0.021 241)` | `#112b40` | `oklch(0.280 0.050 245)` |
| `info-text`               | `#005f98` | `oklch(0.469 0.119 245)` | `#8dccf9` | `oklch(0.819 0.091 240)` |
| `status-open-bg`          | `#eaeff6` | `oklch(0.950 0.011 257)` | `#252b32` | `oklch(0.286 0.015 252)` |
| `status-open-text`        | `#474e57` | `oklch(0.421 0.018 255)` | `#c5cbd4` | `oklch(0.840 0.014 258)` |
| `status-progress-bg`      | `#fff2d8` | `oklch(0.965 0.037 85)`  | `#382409` | `oklch(0.279 0.050 71)`  |
| `status-progress-text`    | `#864e18` | `oklch(0.480 0.100 60)`  | `#f7c56d` | `oklch(0.850 0.120 80)`  |
| `status-implemented-bg`   | `#f2edff` | `oklch(0.955 0.025 299)` | `#2e2142` | `oklch(0.280 0.061 301)` |
| `status-implemented-text` | `#6e3ead` | `oklch(0.480 0.170 300)` | `#ceb6fc` | `oklch(0.821 0.100 300)` |
| `status-accepted-bg`      | `#e2f9e6` | `oklch(0.960 0.035 151)` | `#122d19` | `oklch(0.269 0.050 150)` |
| `status-accepted-text`    | `#0f6a31` | `oklch(0.461 0.120 150)` | `#83dc97` | `oklch(0.821 0.130 150)` |
| `guest-bg`                | `#ffecf4` | `oklch(0.960 0.023 350)` | `#3e1b2d` | `oklch(0.279 0.060 350)` |
| `guest-text`              | `#a1286e` | `oklch(0.490 0.170 350)` | `#f6a9cd` | `oklch(0.819 0.101 350)` |
| `agent-bg`                | `#dcf8fa` | `oklch(0.960 0.029 202)` | `#042f32` | `oklch(0.279 0.045 202)` |
| `agent-text`              | `#00686c` | `oklch(0.470 0.080 199)` | `#83d4d8` | `oklch(0.820 0.080 200)` |

**Contrast (WCAG 2.x ratio, computed).**

| Pair                            | Light | Dark  | Needs |
| ------------------------------- | ----- | ----- | ----- |
| text-1 on canvas                | 15.97 | 16.55 | 4.5:1 |
| text-1 on surface-1             | 17.31 | 15.46 | 4.5:1 |
| text-1 on surface-2             | 15.00 | 13.86 | 4.5:1 |
| text-1 on surface-3             | 17.31 | 12.85 | 4.5:1 |
| text-1 on sidebar               | 15.54 | 17.08 | 4.5:1 |
| text-1 on sidebar-active        | 13.91 | 13.69 | 4.5:1 |
| text-2 on canvas                | 6.85  | 9.56  | 4.5:1 |
| text-2 on surface-1             | 7.42  | 8.93  | 4.5:1 |
| text-2 on surface-2             | 6.43  | 8.00  | 4.5:1 |
| text-2 on surface-3             | 7.42  | 7.42  | 4.5:1 |
| text-2 on sidebar               | 6.66  | 9.87  | 4.5:1 |
| text-2 on sidebar-active        | 5.96  | 7.91  | 4.5:1 |
| text-3 on canvas                | 5.43  | 7.16  | 4.5:1 |
| text-3 on surface-1             | 5.89  | 6.69  | 4.5:1 |
| text-3 on surface-2             | 5.10  | 5.99  | 4.5:1 |
| text-3 on surface-3             | 5.89  | 5.56  | 4.5:1 |
| text-3 on sidebar               | 5.28  | 7.39  | 4.5:1 |
| text-3 on sidebar-active        | 4.73  | 5.92  | 4.5:1 |
| accent-text on canvas           | 5.51  | 9.63  | 4.5:1 |
| accent-text on surface-1        | 5.97  | 9.00  | 4.5:1 |
| accent-text on surface-2        | 5.17  | 8.06  | 4.5:1 |
| accent-text on surface-3        | 5.97  | 7.48  | 4.5:1 |
| accent-text on sidebar          | 5.36  | 9.94  | 4.5:1 |
| accent-text on sidebar-active   | 4.79  | 7.97  | 4.5:1 |
| on-accent on accent             | 4.72  | 4.72  | 4.5:1 |
| accent (fill edge) on canvas    | 4.35  | 4.05  | 3.0:1 |
| accent (fill edge) on surface-1 | 4.72  | 3.78  | 3.0:1 |
| accent (fill edge) on surface-2 | 4.09  | 3.39  | 3.0:1 |
| focus on canvas                 | 4.01  | 7.18  | 3.0:1 |
| focus on surface-1              | 4.34  | 6.70  | 3.0:1 |
| focus on surface-2              | 3.76  | 6.01  | 3.0:1 |
| focus on surface-3              | 4.34  | 5.57  | 3.0:1 |
| focus on sidebar                | 3.90  | 7.41  | 3.0:1 |
| focus on sidebar-active         | 3.49  | 5.94  | 3.0:1 |
| border-strong on canvas         | 3.35  | 3.77  | 3.0:1 |
| border-strong on surface-1      | 3.63  | 3.52  | 3.0:1 |
| border-strong on surface-2      | 3.15  | 3.15  | 3.0:1 |
| success (icon) on canvas        | 4.00  | 8.23  | 3.0:1 |
| success (icon) on surface-1     | 4.33  | 7.69  | 3.0:1 |
| success-text on success-subtle  | 6.05  | 8.94  | 4.5:1 |
| success-text on surface-1       | 6.72  | 10.75 | 4.5:1 |
| text-1 on success-subtle        | 15.60 | 12.86 | 4.5:1 |
| warning (icon) on canvas        | 3.22  | 10.00 | 3.0:1 |
| warning (icon) on surface-1     | 3.49  | 9.34  | 3.0:1 |
| warning-text on warning-subtle  | 6.08  | 9.24  | 4.5:1 |
| warning-text on surface-1       | 6.74  | 11.18 | 4.5:1 |
| text-1 on warning-subtle        | 15.62 | 12.77 | 4.5:1 |
| danger (icon) on canvas         | 6.98  | 6.58  | 3.0:1 |
| danger (icon) on surface-1      | 7.57  | 6.14  | 3.0:1 |
| danger-text on danger-subtle    | 6.65  | 7.67  | 4.5:1 |
| danger-text on surface-1        | 7.52  | 9.16  | 4.5:1 |
| text-1 on danger-subtle         | 15.32 | 12.95 | 4.5:1 |
| info (icon) on canvas           | 4.24  | 7.83  | 3.0:1 |
| info (icon) on surface-1        | 4.60  | 7.31  | 3.0:1 |
| info-text on info-subtle        | 6.07  | 8.41  | 4.5:1 |
| info-text on surface-1          | 6.80  | 10.31 | 4.5:1 |
| text-1 on info-subtle           | 15.46 | 12.61 | 4.5:1 |
| status open: text on bg         | 7.28  | 8.75  | 4.5:1 |
| status progress: text on bg     | 6.08  | 9.24  | 4.5:1 |
| status implemented: text on bg  | 6.20  | 8.30  | 4.5:1 |
| status accepted: text on bg     | 6.05  | 8.94  | 4.5:1 |
| guest: text on bg               | 6.10  | 8.20  | 4.5:1 |
| guest-text on surface-1         | 6.90  | 9.75  | 4.5:1 |
| agent: text on bg               | 5.90  | 8.49  | 4.5:1 |
| agent-text on surface-1         | 6.57  | 10.51 | 4.5:1 |
| text-1 on accent-subtle         | 15.01 | 12.25 | 4.5:1 |
| accent-text on accent-subtle    | 5.18  | 7.13  | 4.5:1 |
| coral #E5484D on canvas         | 3.61  | 4.88  | 3.0:1 |
| coral #E5484D on surface-1      | 3.91  | 4.56  | 3.0:1 |

**Hue distance (CIE76, need 20).**

| Pair (CIE76)           | Light | Dark |
| ---------------------- | ----- | ---- |
| accent / success       | 111   | 116  |
| accent / warning       | 123   | 130  |
| accent / danger        | 91    | 86   |
| accent / info          | 30    | 39   |
| focus / success        | 107   | 95   |
| focus / warning        | 120   | 115  |
| focus / danger         | 90    | 82   |
| success / warning      | 79    | 76   |
| success / danger       | 109   | 108  |
| success / info         | 82    | 82   |
| warning / danger       | 59    | 67   |
| warning / info         | 105   | 107  |
| danger / info          | 87    | 82   |
| open / progress        | 51    | 56   |
| open / implemented     | 64    | 35   |
| open / accepted        | 50    | 51   |
| open / guest           | 56    | 34   |
| open / agent           | 24    | 24   |
| progress / implemented | 95    | 83   |
| progress / accepted    | 60    | 55   |
| progress / guest       | 62    | 63   |
| progress / agent       | 65    | 68   |
| implemented / accepted | 113   | 85   |
| implemented / guest    | 42    | 27   |
| implemented / agent    | 80    | 51   |
| accepted / guest       | 100   | 81   |
| accepted / agent       | 38    | 40   |
| guest / agent          | 78    | 57   |
| coral / danger         | 23    | 21   |

### B. Paper and Ink (warm, colour only for meaning)

**Idea.** Warm stone paper, near-black ink buttons, and no brand hue in the chrome. The only colours on screen are the annotations, the status chips and the people chips.

**Echoes.** Linear's 2026 warmer greys, Notion, Granola, Cal.com's grayscale brand, Superhuman.

**On the feedback view.** The canvas is warm paper (`#f8f5f1`), the panels a warm white, the primary button ink (`#25211d`) with paper text. In dark mode the ground is warm charcoal (`#110f0d`) and the primary button turns to paper (`#ebe7e0`) with ink text. Coral annotations are the loudest thing on screen. Blue survives only as `focus` and `info`.

**Trade-off.** This drops the owner's earlier "brand blue `#2492FF` only on primary buttons" (design section 11). Choosing B means replacing that decision on purpose.

| Token                     | Light hex | Light OKLCH              | Dark hex  | Dark OKLCH               |
| ------------------------- | --------- | ------------------------ | --------- | ------------------------ |
| `canvas`                  | `#f8f5f1` | `oklch(0.971 0.006 75)`  | `#110f0d` | `oklch(0.170 0.005 67)`  |
| `surface-1`               | `#fefefc` | `oklch(0.996 0.003 106)` | `#1a1815` | `oklch(0.210 0.007 78)`  |
| `surface-2`               | `#f2efe9` | `oklch(0.953 0.009 85)`  | `#23211e` | `oklch(0.249 0.006 78)`  |
| `surface-3`               | `#ffffff` | `oklch(1.000 0 0)`       | `#292724` | `oklch(0.274 0.006 78)`  |
| `sidebar`                 | `#f5f2ed` | `oklch(0.962 0.007 81)`  | `#0c0b08` | `oklch(0.150 0.007 92)`  |
| `sidebar-active`          | `#eae6de` | `oklch(0.926 0.012 85)`  | `#25221f` | `oklch(0.254 0.007 67)`  |
| `border`                  | `#e6e2dc` | `oklch(0.914 0.009 78)`  | `#312f2b` | `oklch(0.306 0.008 85)`  |
| `border-strong`           | `#8b857c` | `oklch(0.619 0.015 78)`  | `#716e6a` | `oklch(0.540 0.007 75)`  |
| `text-1`                  | `#1f1a11` | `oklch(0.221 0.018 82)`  | `#efeeed` | `oklch(0.950 0 0)`       |
| `text-2`                  | `#5b544a` | `oklch(0.450 0.018 77)`  | `#b9b7b3` | `oklch(0.780 0.006 85)`  |
| `text-3`                  | `#6a6459` | `oklch(0.505 0.019 83)`  | `#a09e9a` | `oklch(0.700 0.006 85)`  |
| `accent`                  | `#25211d` | `oklch(0.251 0.010 67)`  | `#ebe7e0` | `oklch(0.929 0.010 82)`  |
| `on-accent`               | `#fbfaf7` | `oklch(0.985 0.004 91)`  | `#181512` | `oklch(0.198 0.008 67)`  |
| `accent-subtle`           | `#ede9e2` | `oklch(0.935 0.010 82)`  | `#302d29` | `oklch(0.299 0.008 75)`  |
| `accent-text`             | `#25211d` | `oklch(0.251 0.010 67)`  | `#ebe7e0` | `oklch(0.929 0.010 82)`  |
| `focus`                   | `#2474cf` | `oklch(0.560 0.159 255)` | `#60aaf3` | `oklch(0.721 0.130 250)` |
| `success`                 | `#0e8c41` | `oklch(0.561 0.150 150)` | `#4ac06c` | `oklch(0.721 0.161 150)` |
| `success-subtle`          | `#e2f9e6` | `oklch(0.960 0.035 151)` | `#122d19` | `oklch(0.269 0.050 150)` |
| `success-text`            | `#0f6a31` | `oklch(0.461 0.120 150)` | `#83dc97` | `oklch(0.821 0.130 150)` |
| `warning`                 | `#c5770f` | `oklch(0.640 0.140 65)`  | `#f5ae39` | `oklch(0.800 0.150 75)`  |
| `warning-subtle`          | `#fff2d8` | `oklch(0.965 0.037 85)`  | `#382409` | `oklch(0.279 0.050 71)`  |
| `warning-text`            | `#864e18` | `oklch(0.480 0.100 60)`  | `#f7c56d` | `oklch(0.850 0.120 80)`  |
| `danger`                  | `#a70f3b` | `oklch(0.469 0.180 14)`  | `#f46a82` | `oklch(0.699 0.170 12)`  |
| `danger-subtle`           | `#ffedec` | `oklch(0.960 0.020 21)`  | `#421b1c` | `oklch(0.280 0.061 20)`  |
| `danger-text`             | `#a41b39` | `oklch(0.469 0.170 16)`  | `#fda1a0` | `oklch(0.801 0.110 20)`  |
| `info`                    | `#2d74ca` | `oklch(0.559 0.151 255)` | `#67aaed` | `oklch(0.721 0.120 250)` |
| `info-subtle`             | `#e6f4ff` | `oklch(0.960 0.021 241)` | `#112b40` | `oklch(0.280 0.050 245)` |
| `info-text`               | `#005f98` | `oklch(0.469 0.119 245)` | `#8dccf9` | `oklch(0.819 0.091 240)` |
| `status-open-bg`          | `#f2eee7` | `oklch(0.950 0.010 82)`  | `#2c2a26` | `oklch(0.286 0.008 85)`  |
| `status-open-text`        | `#524c42` | `oklch(0.419 0.018 81)`  | `#cccac6` | `oklch(0.839 0.006 85)`  |
| `status-progress-bg`      | `#fff2d8` | `oklch(0.965 0.037 85)`  | `#382409` | `oklch(0.279 0.050 71)`  |
| `status-progress-text`    | `#864e18` | `oklch(0.480 0.100 60)`  | `#f7c56d` | `oklch(0.850 0.120 80)`  |
| `status-implemented-bg`   | `#f2edff` | `oklch(0.955 0.025 299)` | `#2e2142` | `oklch(0.280 0.061 301)` |
| `status-implemented-text` | `#6e3ead` | `oklch(0.480 0.170 300)` | `#ceb6fc` | `oklch(0.821 0.100 300)` |
| `status-accepted-bg`      | `#e2f9e6` | `oklch(0.960 0.035 151)` | `#122d19` | `oklch(0.269 0.050 150)` |
| `status-accepted-text`    | `#0f6a31` | `oklch(0.461 0.120 150)` | `#83dc97` | `oklch(0.821 0.130 150)` |
| `guest-bg`                | `#ffecf4` | `oklch(0.960 0.023 350)` | `#3e1b2d` | `oklch(0.279 0.060 350)` |
| `guest-text`              | `#a1286e` | `oklch(0.490 0.170 350)` | `#f6a9cd` | `oklch(0.819 0.101 350)` |
| `agent-bg`                | `#dcf8fa` | `oklch(0.960 0.029 202)` | `#042f32` | `oklch(0.279 0.045 202)` |
| `agent-text`              | `#00686c` | `oklch(0.470 0.080 199)` | `#83d4d8` | `oklch(0.820 0.080 200)` |

**Contrast (WCAG 2.x ratio, computed).**

| Pair                            | Light | Dark  | Needs |
| ------------------------------- | ----- | ----- | ----- |
| text-1 on canvas                | 15.91 | 16.51 | 4.5:1 |
| text-1 on surface-1             | 17.13 | 15.29 | 4.5:1 |
| text-1 on surface-2             | 15.07 | 13.86 | 4.5:1 |
| text-1 on surface-3             | 17.30 | 12.85 | 4.5:1 |
| text-1 on sidebar               | 15.49 | 16.98 | 4.5:1 |
| text-1 on sidebar-active        | 13.90 | 13.65 | 4.5:1 |
| text-2 on canvas                | 6.87  | 9.55  | 4.5:1 |
| text-2 on surface-1             | 7.40  | 8.85  | 4.5:1 |
| text-2 on surface-2             | 6.51  | 8.02  | 4.5:1 |
| text-2 on surface-3             | 7.47  | 7.44  | 4.5:1 |
| text-2 on sidebar               | 6.69  | 9.83  | 4.5:1 |
| text-2 on sidebar-active        | 6.00  | 7.90  | 4.5:1 |
| text-3 on canvas                | 5.40  | 7.15  | 4.5:1 |
| text-3 on surface-1             | 5.81  | 6.62  | 4.5:1 |
| text-3 on surface-2             | 5.11  | 6.00  | 4.5:1 |
| text-3 on surface-3             | 5.87  | 5.57  | 4.5:1 |
| text-3 on sidebar               | 5.25  | 7.36  | 4.5:1 |
| text-3 on sidebar-active        | 4.71  | 5.92  | 4.5:1 |
| accent-text on canvas           | 14.71 | 15.52 | 4.5:1 |
| accent-text on surface-1        | 15.83 | 14.37 | 4.5:1 |
| accent-text on surface-2        | 13.93 | 13.03 | 4.5:1 |
| accent-text on surface-3        | 15.98 | 12.08 | 4.5:1 |
| accent-text on sidebar          | 14.31 | 15.97 | 4.5:1 |
| accent-text on sidebar-active   | 12.84 | 12.84 | 4.5:1 |
| on-accent on accent             | 15.31 | 14.75 | 4.5:1 |
| accent (fill edge) on canvas    | 14.71 | 15.52 | 3.0:1 |
| accent (fill edge) on surface-1 | 15.83 | 14.37 | 3.0:1 |
| accent (fill edge) on surface-2 | 13.93 | 13.03 | 3.0:1 |
| focus on canvas                 | 4.32  | 7.78  | 3.0:1 |
| focus on surface-1              | 4.65  | 7.21  | 3.0:1 |
| focus on surface-2              | 4.09  | 6.53  | 3.0:1 |
| focus on surface-3              | 4.69  | 6.06  | 3.0:1 |
| focus on sidebar                | 4.20  | 8.01  | 3.0:1 |
| focus on sidebar-active         | 3.77  | 6.44  | 3.0:1 |
| border-strong on canvas         | 3.36  | 3.77  | 3.0:1 |
| border-strong on surface-1      | 3.62  | 3.49  | 3.0:1 |
| border-strong on surface-2      | 3.19  | 3.17  | 3.0:1 |
| success (icon) on canvas        | 3.99  | 8.24  | 3.0:1 |
| success (icon) on surface-1     | 4.29  | 7.63  | 3.0:1 |
| success-text on success-subtle  | 6.05  | 8.94  | 4.5:1 |
| success-text on surface-1       | 6.65  | 10.67 | 4.5:1 |
| text-1 on success-subtle        | 15.59 | 12.81 | 4.5:1 |
| warning (icon) on canvas        | 3.21  | 10.01 | 3.0:1 |
| warning (icon) on surface-1     | 3.45  | 9.28  | 3.0:1 |
| warning-text on warning-subtle  | 6.08  | 9.24  | 4.5:1 |
| warning-text on surface-1       | 6.67  | 11.10 | 4.5:1 |
| text-1 on warning-subtle        | 15.60 | 12.72 | 4.5:1 |
| danger (icon) on canvas         | 6.96  | 6.59  | 3.0:1 |
| danger (icon) on surface-1      | 7.50  | 6.10  | 3.0:1 |
| danger-text on danger-subtle    | 6.65  | 7.67  | 4.5:1 |
| danger-text on surface-1        | 7.44  | 9.10  | 4.5:1 |
| text-1 on danger-subtle         | 15.30 | 12.90 | 4.5:1 |
| info (icon) on canvas           | 4.33  | 7.79  | 3.0:1 |
| info (icon) on surface-1        | 4.66  | 7.21  | 3.0:1 |
| info-text on info-subtle        | 6.07  | 8.41  | 4.5:1 |
| info-text on surface-1          | 6.73  | 10.24 | 4.5:1 |
| text-1 on info-subtle           | 15.44 | 12.56 | 4.5:1 |
| status open: text on bg         | 7.35  | 8.75  | 4.5:1 |
| status progress: text on bg     | 6.08  | 9.24  | 4.5:1 |
| status implemented: text on bg  | 6.20  | 8.30  | 4.5:1 |
| status accepted: text on bg     | 6.05  | 8.94  | 4.5:1 |
| guest: text on bg               | 6.10  | 8.20  | 4.5:1 |
| guest-text on surface-1         | 6.83  | 9.68  | 4.5:1 |
| agent: text on bg               | 5.90  | 8.49  | 4.5:1 |
| agent-text on surface-1         | 6.51  | 10.44 | 4.5:1 |
| text-1 on accent-subtle         | 14.29 | 11.82 | 4.5:1 |
| accent-text on accent-subtle    | 13.21 | 11.11 | 4.5:1 |
| coral #E5484D on canvas         | 3.60  | 4.89  | 3.0:1 |
| coral #E5484D on surface-1      | 3.88  | 4.53  | 3.0:1 |

**Hue distance (CIE76, need 20).**

| Pair (CIE76)           | Light | Dark |
| ---------------------- | ----- | ---- |
| accent / success       | 68    | 63   |
| accent / warning       | 76    | 66   |
| accent / danger        | 63    | 63   |
| accent / info          | 65    | 50   |
| focus / success        | 103   | 91   |
| focus / warning        | 116   | 112  |
| focus / danger         | 87    | 80   |
| success / warning      | 79    | 76   |
| success / danger       | 109   | 108  |
| success / info         | 100   | 88   |
| warning / danger       | 59    | 67   |
| warning / info         | 113   | 108  |
| danger / info          | 86    | 79   |
| open / progress        | 38    | 49   |
| open / implemented     | 73    | 40   |
| open / accepted        | 44    | 47   |
| open / guest           | 58    | 35   |
| open / agent           | 30    | 27   |
| progress / implemented | 95    | 83   |
| progress / accepted    | 60    | 55   |
| progress / guest       | 62    | 63   |
| progress / agent       | 65    | 68   |
| implemented / accepted | 113   | 85   |
| implemented / guest    | 42    | 27   |
| implemented / agent    | 80    | 51   |
| accepted / guest       | 100   | 81   |
| accepted / agent       | 38    | 40   |
| guest / agent          | 78    | 57   |
| coral / danger         | 23    | 21   |

### C. Iris (the bolder one)

**Idea.** Violet-tinted neutrals and a tinted sidebar, as in Arc. The iris accent `#584bdb` owns the primary button and the selected nav row.

**Echoes.** Linear's brand indigo, Arc's tinted frame, Raycast's dark depth, Attio.

**On the feedback view.** The sidebar is a soft lavender (`#eaebff`) in light mode and a deep indigo (`#131128`) in dark mode, so the app has a recognisable colour at a glance. Content stays white or near-black. Implemented moves to blue so a status chip never looks like a button.

**Trade-off.** This is a new brand hue next to a blue logo. The logo would need a violet companion or a neutral version. In dark mode the accent fill clears 3:1 against `surface-2` by only 3.09.

| Token                     | Light hex | Light OKLCH              | Dark hex  | Dark OKLCH               |
| ------------------------- | --------- | ------------------------ | --------- | ------------------------ |
| `canvas`                  | `#f5f5fb` | `oklch(0.972 0.008 286)` | `#0e0e18` | `oklch(0.169 0.021 284)` |
| `surface-1`               | `#ffffff` | `oklch(1.000 0 0)`       | `#161620` | `oklch(0.205 0.020 285)` |
| `surface-2`               | `#eeeef7` | `oklch(0.952 0.012 286)` | `#20202c` | `oklch(0.249 0.023 285)` |
| `surface-3`               | `#ffffff` | `oklch(1.000 0 0)`       | `#262632` | `oklch(0.274 0.022 285)` |
| `sidebar`                 | `#eaebff` | `oklch(0.945 0.027 284)` | `#131128` | `oklch(0.194 0.045 285)` |
| `sidebar-active`          | `#e3e3ff` | `oklch(0.924 0.038 286)` | `#201e3e` | `oklch(0.255 0.059 284)` |
| `border`                  | `#e2e2eb` | `oklch(0.915 0.012 286)` | `#2e2e3a` | `oklch(0.306 0.021 285)` |
| `border-strong`           | `#848592` | `oklch(0.620 0.019 282)` | `#6d6d7c` | `oklch(0.540 0.023 286)` |
| `text-1`                  | `#191925` | `oklch(0.219 0.023 284)` | `#eeeef4` | `oklch(0.951 0.008 286)` |
| `text-2`                  | `#545462` | `oklch(0.451 0.023 285)` | `#b6b6c4` | `oklch(0.781 0.020 286)` |
| `text-3`                  | `#636372` | `oklch(0.505 0.024 286)` | `#9d9dab` | `oklch(0.700 0.020 286)` |
| `accent`                  | `#584bdb` | `oklch(0.516 0.211 280)` | `#6558e0` | `oklch(0.550 0.199 282)` |
| `on-accent`               | `#ffffff` | `oklch(1.000 0 0)`       | `#ffffff` | `oklch(1.000 0 0)`       |
| `accent-subtle`           | `#eaebff` | `oklch(0.945 0.027 284)` | `#2b2751` | `oklch(0.300 0.074 285)` |
| `accent-text`             | `#4f42c9` | `oklch(0.479 0.200 280)` | `#b3b1ff` | `oklch(0.791 0.110 285)` |
| `focus`                   | `#5e56de` | `oklch(0.540 0.200 280)` | `#9c96f8` | `oklch(0.719 0.140 285)` |
| `success`                 | `#0e8c41` | `oklch(0.561 0.150 150)` | `#4ac06c` | `oklch(0.721 0.161 150)` |
| `success-subtle`          | `#e2f9e6` | `oklch(0.960 0.035 151)` | `#122d19` | `oklch(0.269 0.050 150)` |
| `success-text`            | `#0f6a31` | `oklch(0.461 0.120 150)` | `#83dc97` | `oklch(0.821 0.130 150)` |
| `warning`                 | `#c5770f` | `oklch(0.640 0.140 65)`  | `#f5ae39` | `oklch(0.800 0.150 75)`  |
| `warning-subtle`          | `#fff2d8` | `oklch(0.965 0.037 85)`  | `#382409` | `oklch(0.279 0.050 71)`  |
| `warning-text`            | `#864e18` | `oklch(0.480 0.100 60)`  | `#f7c56d` | `oklch(0.850 0.120 80)`  |
| `danger`                  | `#a70f3b` | `oklch(0.469 0.180 14)`  | `#f46a82` | `oklch(0.699 0.170 12)`  |
| `danger-subtle`           | `#ffedec` | `oklch(0.960 0.020 21)`  | `#421b1c` | `oklch(0.280 0.061 20)`  |
| `danger-text`             | `#a41b39` | `oklch(0.469 0.170 16)`  | `#fda1a0` | `oklch(0.801 0.110 20)`  |
| `info`                    | `#007cb7` | `oklch(0.559 0.128 240)` | `#55aee8` | `oklch(0.720 0.120 240)` |
| `info-subtle`             | `#e6f4ff` | `oklch(0.960 0.021 241)` | `#112b40` | `oklch(0.280 0.050 245)` |
| `info-text`               | `#005f98` | `oklch(0.469 0.119 245)` | `#8dccf9` | `oklch(0.819 0.091 240)` |
| `status-open-bg`          | `#ededf8` | `oklch(0.949 0.015 286)` | `#292936` | `oklch(0.287 0.024 285)` |
| `status-open-text`        | `#4b4b5a` | `oklch(0.419 0.025 285)` | `#c9c9d7` | `oklch(0.840 0.019 286)` |
| `status-progress-bg`      | `#fff2d8` | `oklch(0.965 0.037 85)`  | `#382409` | `oklch(0.279 0.050 71)`  |
| `status-progress-text`    | `#864e18` | `oklch(0.480 0.100 60)`  | `#f7c56d` | `oklch(0.850 0.120 80)`  |
| `status-implemented-bg`   | `#e6f4ff` | `oklch(0.960 0.021 241)` | `#112b40` | `oklch(0.280 0.050 245)` |
| `status-implemented-text` | `#005f98` | `oklch(0.469 0.119 245)` | `#8dccf9` | `oklch(0.819 0.091 240)` |
| `status-accepted-bg`      | `#e2f9e6` | `oklch(0.960 0.035 151)` | `#122d19` | `oklch(0.269 0.050 150)` |
| `status-accepted-text`    | `#0f6a31` | `oklch(0.461 0.120 150)` | `#83dc97` | `oklch(0.821 0.130 150)` |
| `guest-bg`                | `#ffecf4` | `oklch(0.960 0.023 350)` | `#3e1b2d` | `oklch(0.279 0.060 350)` |
| `guest-text`              | `#a1286e` | `oklch(0.490 0.170 350)` | `#f6a9cd` | `oklch(0.819 0.101 350)` |
| `agent-bg`                | `#dcf8fa` | `oklch(0.960 0.029 202)` | `#042f32` | `oklch(0.279 0.045 202)` |
| `agent-text`              | `#00686c` | `oklch(0.470 0.080 199)` | `#83d4d8` | `oklch(0.820 0.080 200)` |

**Contrast (WCAG 2.x ratio, computed).**

| Pair                            | Light | Dark  | Needs |
| ------------------------------- | ----- | ----- | ----- |
| text-1 on canvas                | 16.02 | 16.60 | 4.5:1 |
| text-1 on surface-1             | 17.40 | 15.53 | 4.5:1 |
| text-1 on surface-2             | 15.08 | 13.93 | 4.5:1 |
| text-1 on surface-3             | 17.40 | 12.93 | 4.5:1 |
| text-1 on sidebar               | 14.77 | 15.96 | 4.5:1 |
| text-1 on sidebar-active        | 13.83 | 13.80 | 4.5:1 |
| text-2 on canvas                | 6.85  | 9.57  | 4.5:1 |
| text-2 on surface-1             | 7.44  | 8.96  | 4.5:1 |
| text-2 on surface-2             | 6.45  | 8.03  | 4.5:1 |
| text-2 on surface-3             | 7.44  | 7.45  | 4.5:1 |
| text-2 on sidebar               | 6.32  | 9.20  | 4.5:1 |
| text-2 on sidebar-active        | 5.92  | 7.96  | 4.5:1 |
| text-3 on canvas                | 5.43  | 7.17  | 4.5:1 |
| text-3 on surface-1             | 5.90  | 6.71  | 4.5:1 |
| text-3 on surface-2             | 5.12  | 6.01  | 4.5:1 |
| text-3 on surface-3             | 5.90  | 5.58  | 4.5:1 |
| text-3 on sidebar               | 5.01  | 6.89  | 4.5:1 |
| text-3 on sidebar-active        | 4.69  | 5.96  | 4.5:1 |
| accent-text on canvas           | 6.54  | 9.73  | 4.5:1 |
| accent-text on surface-1        | 7.11  | 9.10  | 4.5:1 |
| accent-text on surface-2        | 6.16  | 8.16  | 4.5:1 |
| accent-text on surface-3        | 7.11  | 7.58  | 4.5:1 |
| accent-text on sidebar          | 6.03  | 9.35  | 4.5:1 |
| accent-text on sidebar-active   | 5.65  | 8.09  | 4.5:1 |
| on-accent on accent             | 6.10  | 5.22  | 4.5:1 |
| accent (fill edge) on canvas    | 5.61  | 3.68  | 3.0:1 |
| accent (fill edge) on surface-1 | 6.10  | 3.44  | 3.0:1 |
| accent (fill edge) on surface-2 | 5.29  | 3.09  | 3.0:1 |
| focus on canvas                 | 5.01  | 7.43  | 3.0:1 |
| focus on surface-1              | 5.44  | 6.95  | 3.0:1 |
| focus on surface-2              | 4.71  | 6.23  | 3.0:1 |
| focus on surface-3              | 5.44  | 5.78  | 3.0:1 |
| focus on sidebar                | 4.62  | 7.14  | 3.0:1 |
| focus on sidebar-active         | 4.32  | 6.18  | 3.0:1 |
| border-strong on canvas         | 3.36  | 3.77  | 3.0:1 |
| border-strong on surface-1      | 3.65  | 3.53  | 3.0:1 |
| border-strong on surface-2      | 3.17  | 3.17  | 3.0:1 |
| success (icon) on canvas        | 3.99  | 8.27  | 3.0:1 |
| success (icon) on surface-1     | 4.33  | 7.73  | 3.0:1 |
| success-text on success-subtle  | 6.05  | 8.94  | 4.5:1 |
| success-text on surface-1       | 6.72  | 10.81 | 4.5:1 |
| text-1 on success-subtle        | 15.68 | 12.84 | 4.5:1 |
| warning (icon) on canvas        | 3.21  | 10.04 | 3.0:1 |
| warning (icon) on surface-1     | 3.49  | 9.40  | 3.0:1 |
| warning-text on warning-subtle  | 6.08  | 9.24  | 4.5:1 |
| warning-text on surface-1       | 6.74  | 11.25 | 4.5:1 |
| text-1 on warning-subtle        | 15.69 | 12.76 | 4.5:1 |
| danger (icon) on canvas         | 6.97  | 6.61  | 3.0:1 |
| danger (icon) on surface-1      | 7.57  | 6.18  | 3.0:1 |
| danger-text on danger-subtle    | 6.65  | 7.67  | 4.5:1 |
| danger-text on surface-1        | 7.52  | 9.22  | 4.5:1 |
| text-1 on danger-subtle         | 15.39 | 12.93 | 4.5:1 |
| info (icon) on canvas           | 4.23  | 7.86  | 3.0:1 |
| info (icon) on surface-1        | 4.60  | 7.36  | 3.0:1 |
| info-text on info-subtle        | 6.07  | 8.41  | 4.5:1 |
| info-text on surface-1          | 6.80  | 10.38 | 4.5:1 |
| text-1 on info-subtle           | 15.53 | 12.59 | 4.5:1 |
| status open: text on bg         | 7.37  | 8.75  | 4.5:1 |
| status progress: text on bg     | 6.08  | 9.24  | 4.5:1 |
| status implemented: text on bg  | 6.07  | 8.41  | 4.5:1 |
| status accepted: text on bg     | 6.05  | 8.94  | 4.5:1 |
| guest: text on bg               | 6.10  | 8.20  | 4.5:1 |
| guest-text on surface-1         | 6.90  | 9.81  | 4.5:1 |
| agent: text on bg               | 5.90  | 8.49  | 4.5:1 |
| agent-text on surface-1         | 6.57  | 10.58 | 4.5:1 |
| text-1 on accent-subtle         | 14.77 | 12.02 | 4.5:1 |
| accent-text on accent-subtle    | 6.03  | 7.04  | 4.5:1 |
| coral #E5484D on canvas         | 3.60  | 4.90  | 3.0:1 |
| coral #E5484D on surface-1      | 3.91  | 4.59  | 3.0:1 |

**Hue distance (CIE76, need 20).**

| Pair (CIE76)           | Light | Dark |
| ---------------------- | ----- | ---- |
| accent / success       | 140   | 139  |
| accent / warning       | 136   | 140  |
| accent / danger        | 91    | 84   |
| accent / info          | 63    | 64   |
| focus / success        | 134   | 111  |
| focus / warning        | 132   | 115  |
| focus / danger         | 88    | 69   |
| success / warning      | 79    | 76   |
| success / danger       | 109   | 108  |
| success / info         | 82    | 82   |
| warning / danger       | 59    | 67   |
| warning / info         | 105   | 107  |
| danger / info          | 87    | 82   |
| open / progress        | 52    | 58   |
| open / implemented     | 30    | 24   |
| open / accepted        | 55    | 55   |
| open / guest           | 52    | 31   |
| open / agent           | 28    | 27   |
| progress / implemented | 80    | 81   |
| progress / accepted    | 60    | 55   |
| progress / guest       | 62    | 63   |
| progress / agent       | 65    | 68   |
| implemented / accepted | 73    | 63   |
| implemented / guest    | 62    | 47   |
| implemented / agent    | 36    | 24   |
| accepted / guest       | 100   | 81   |
| accepted / agent       | 38    | 40   |
| guest / agent          | 78    | 57   |
| coral / danger         | 23    | 21   |

### Facts used above

- white on logo blue #2492FF: 3.17:1
- white on button blue #0F72DB: 4.72:1
- white numeral on coral #E5484D: 3.91:1
- coral on white screenshot: 3.91:1
- near-black #1A1A1A numeral on coral: 4.45:1
- coral OKLCH: oklch(0.626 0.193 23); logo blue oklch(0.657 0.187 253); button blue oklch(0.561 0.181 255)

## 3. Mapping onto design-system-starter as a product overlay

The overlay stays values only, in the shape `snapmark-app/design/product.json` already uses (`role.color.<name>` with `$value` and `$extensions.mode.dark`). No system role is renamed. The roles Snapmark needs and the system lacks go under `x`.

**System roles whose values change (all three directions):**

- `canvas` → `ground`
- `surface-1` → `panel`
- `surface-2` → `raise` (fields, secondary buttons, hover and selected fills)
- `surface-3` → `overlay` and `lift` (menus, popovers, dialogs; white plus shadow in light mode)
- `border` → `edge`
- `border-strong` → `edge-hi`
- `text-1`, `text-2`, `text-3` → `ink`, `dim`, `faint`
- `accent`, `on-accent`, `accent-subtle`, `accent-text` → `accent`, `on-accent`, `accent-wash`, `accent-text`
- `focus` → `focus`
- `success`, `warning`, `danger`, `info` → `keep`, `warn`, `error`, `info`, each with its `-wash` (our `-subtle`) and `-text`

**Unchanged:** `off` (disabled), the `pass` family, the elevation shadows, radius, type and motion.

**New `x` roles (Snapmark only):**

- `x.color.sidebar`, `x.color.sidebar-active`
- `x.color.status-open`, `status-progress`, `status-implemented`, `status-accepted`, each with `-wash` and `-text`
- `x.color.guest-wash`, `guest-text`, `agent-wash`, `agent-text`
- `x.color.annotation`: `#E5484D` in both modes. `record` already exists under `x`.

**HeroUI v3 slots.** The directions use HeroUI 3.2's own names: `canvas` is `--background`, `surface-1` is `--surface`, `surface-2` is `--default`, `surface-3` is `--overlay`, `border` is `--border` and `--separator`, `text-3` is `--muted`, plus `--accent`, `--accent-foreground`, `--focus`, `--success`, `--warning` and `--danger` (finding 6). The starter's `tokens/README.md` still maps roles to HeroUI v2 slots (`content1` to `content4`, `primary`, `secondary`, `heroui({ themes })`). Check that table and the `heroui-theme.json` output against 3.2 before the build.

**Two tunings to record (governance, owner acceptance needed):**

1. **The surface ladder moves.** `docs/tokens/rebrand.md` says to tint the neutrals but keep the lightness steps (`ground` at L 0.905). All three directions raise `ground` to about L 0.97. That fixed step is the root of the grey-in-grey look.
2. **In light mode `raise` is darker than `panel`.** The system puts a control one step lighter than its surface. On a white panel nothing is lighter, so controls take a tinted fill instead (Radix steps 3 to 5, Geist 100 to 300, HeroUI `--default`). In dark mode the ladder keeps the system's order.

**Example overlay shape** (direction A, three roles and one extra; the full values are in the tables above):

```json
{
  "role": {
    "color": {
      "ground": {
        "$value": "#f3f6fa",
        "$extensions": { "mode": { "dark": "#0b1015" } }
      },
      "panel": {
        "$value": "#ffffff",
        "$extensions": { "mode": { "dark": "#13181e" } }
      },
      "accent": {
        "$value": "#0f72db",
        "$extensions": { "mode": { "dark": "#0f72db" } }
      }
    }
  },
  "x": {
    "color": {
      "$type": "color",
      "annotation": {
        "$value": "#e5484d",
        "$extensions": { "mode": { "dark": "#e5484d" } }
      }
    }
  }
}
```

**Checks this file did not run.** It did not run the starter's colour-blind distance check (protanopia, deuteranopia, tritanopia, need 8) or its `npm run validate`. Both run once the chosen overlay is written.

## 4. Recommendation

**Direction A, Clear Sky.** It fixes the two things the owner named: the lighter tinted canvas, coloured status and people chips and a real tinted dark ladder end the grey in grey, and dark mode gets its own designed values. It keeps every earlier owner decision (brand blue only on the primary button, coral annotations, HeroUI with colour-only theming), so it is the smallest overlay change with the fewest reversals. If the owner wants warmth over brand colour, B is the one to put next to it in the prototype.

## Known limit outside these tokens

The white numeral inside a coral reference marker is 3.91:1, and a near-black numeral is 4.45:1. Neither reaches 4.5:1. The numeral passes only as large text (bold at 18.7 px or more). The marker is drawn by the shared annotation renderer, and the coral is the owner's, so this needs an owner call: a larger bold numeral, or a dark outline on the marker.
