Lasting: becomes the Snapmark web overlay in snapmark-kit/packages/tokens in milestone 1.

# Colour: Clear Sky

The owner chose direction A, Clear Sky, on 2026-10-28 (ask A37, owner dialog). It answers A36 ("grey in grey", "no dark mode"). The research and the two other directions are in `research/calm-saas-colour.md`.

**Idea.** Cool slate neutrals with a breath of blue, white content, and the button blue `#0F72DB` as the one filled accent. Dark mode is its own blue-black ladder from `#0b1015`, with the same `#0F72DB` button.

## Tokens, light and dark

Copied unchanged from the research file. Hex and OKLCH are the same colour; OKLCH is what HeroUI 3 and Tailwind 4 read.

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
| `focus`                   | `#4f565f` | `oklch(0.450 0.017 255)` | `#b2b8c0` | `oklch(0.780 0.013 256)` |
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

## Contrast (WCAG 2.x ratio, computed)

Every pair below clears its need in both modes. The coral marker numeral is the one exception (Owner acceptances).

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
| focus on canvas                 | 6.85  | 9.56  | 3.0:1 |
| focus on surface-1              | 7.42  | 8.93  | 3.0:1 |
| focus on surface-2              | 6.43  | 8.00  | 3.0:1 |
| focus on surface-3              | 7.42  | 7.42  | 3.0:1 |
| focus on sidebar                | 6.66  | 9.87  | 3.0:1 |
| focus on sidebar-active         | 5.96  | 7.91  | 3.0:1 |
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

## Hue distance (CIE76, need 20)

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

**Single facts.** White on logo blue `#2492FF`: 3.17:1. White on button blue `#0F72DB`: 4.72:1. White numeral on coral `#E5484D`: 3.91:1. Coral on a white screenshot: 3.91:1. Near-black `#1A1A1A` numeral on coral: 4.45:1.

## Overlay on design-system-starter

The overlay holds values only, in the shape `snapmark-app/design/product.json` already uses: `role.color.<name>` with `$value` and `$extensions.mode.dark`. No system role is renamed. Roles the system lacks go under `x`.

**System roles whose values change:**

| Clear Sky token                                       | design-system-starter role                                     | HeroUI 3 slot                        |
| ----------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------ |
| `canvas`                                              | `ground`                                                       | `--background`                       |
| `surface-1`                                           | `panel`                                                        | `--surface`                          |
| `surface-2`                                           | `raise`                                                        | `--default`                          |
| `surface-3`                                           | `overlay`, `lift`                                              | `--overlay`                          |
| `border`                                              | `edge`                                                         | `--border`, `--separator`            |
| `border-strong`                                       | `edge-hi`                                                      |                                      |
| `text-1`, `text-2`, `text-3`                          | `ink`, `dim`, `faint`                                          | `--muted` is `text-3`                |
| `accent`, `on-accent`, `accent-subtle`, `accent-text` | `accent`, `on-accent`, `accent-wash`, `accent-text`            | `--accent`, `--accent-foreground`    |
| `focus`                                               | `focus`                                                        | `--focus`                            |
| `success`, `warning`, `danger`, `info`                | `keep`, `warn`, `error`, `info`, each with `-wash` and `-text` | `--success`, `--warning`, `--danger` |

**Unchanged:** `off` (disabled), the `pass` family, the elevation shadows, radius, type and motion.

**New `x` roles (Snapmark only):**

- `x.color.sidebar`, `x.color.sidebar-active`.
- `x.color.status-open`, `status-progress`, `status-implemented`, `status-accepted`, each with `-wash` and `-text`.
- `x.color.guest-wash`, `guest-text`, `agent-wash`, `agent-text`.
- `x.color.annotation`: `#E5484D` in both modes. `record` already exists under `x`.

The starter's `tokens/README.md` still maps roles to HeroUI v2 slots. Check that table and the `heroui-theme.json` output against HeroUI 3.2 before the build.

## Rules

### Accent and logo

- Blue `#0F72DB` (`accent`) is the only filled accent. White on it is 4.72:1.
- One filled accent button per region (WEB-20, F8). Nothing else is blue: no blue borders, links, icons or labels (brief No-Go).
- The primary is always the last button in its row, at the right. More (…) goes first. Two equal verdicts are no exception: one is the primary and it goes right. Source: design-system-starter `docs/components/button.md` §1, owner, 2026-10-28 (F171).
- The consent page keeps no filled button (WEB-20, C31). Allow sits right of Deny.
- Logo blue `#2492FF` is for the logo only. White on it is 3.17:1, so it never carries text.
- `accent-text`, `accent-subtle` and the `info` family are in the overlay. Release 1 screens use none of them. Links are underlined `text-1`.

### Annotations

- Annotation coral `#E5484D` is unchanged, in light and dark (`x.color.annotation`). It reads 3.61:1 on `canvas` and 3.91:1 on a white screenshot.
- `danger` moves to a deeper crimson (`#a70f3b` light, `#f46a82` dark), so it stays apart from coral (CIE76 23 light, 21 dark).
- `danger` is for error text and icons. A destructive button is never a red fill (`pass` tone, conformance.md).

### Surfaces

- `canvas`: the page behind everything, and the stage behind a screenshot.
- `surface-1`: panels, the thread, lists and tables.
- `surface-2`: fields, secondary buttons, hover ("soft fill") and selected fills, a toggle that is on, flag and kind chips.
- `surface-3`: menus, popovers and dialogs. In light mode it is white plus the shadow.
- The screenshot sits on `canvas` with a 1 px `border`, plus the `e1` shadow in light mode. It is never dimmed or tinted in dark mode, because it is evidence.
- `border` draws separators and the stage edge. `border-strong` is for a part that must reach 3:1 against its neighbour (WCAG 1.4.11).
- Text: `text-1` for body and titles, `text-2` for secondary lines, `text-3` for meta and placeholders.

### Sidebar

- The sidebar is `sidebar`: a notch cooler than `canvas` in light mode, a notch darker in dark mode. The work area leads.
- The current page is a `sidebar-active` fill, a bold label and a 2 px `text-2` bar. It is never `info` and never colour alone.
- Hover on a sidebar item is the `surface-2` soft fill.

### Status chips

A status chip is a tinted background, coloured text and a dot, always with its word.

| Status      | Background              | Text                      |
| ----------- | ----------------------- | ------------------------- |
| Open        | `status-open-bg`        | `status-open-text`        |
| In Progress | `status-progress-bg`    | `status-progress-text`    |
| Implemented | `status-implemented-bg` | `status-implemented-text` |
| Accepted    | `status-accepted-bg`    | `status-accepted-text`    |

Flags (Needs Answer, Needs Decision, Decided) and kind chips stay neutral: `surface-2` with `text-2`.

### Guest and agent

- Guest: a chip in `guest-bg` with `guest-text`, reading "Guest", wherever a guest's text shows (WEB-25).
- Agent: an entry by "{name} via {client}" carries the agent badge (WEB-24). The badge is a chip in `agent-bg` with `agent-text`, or a 2 px avatar ring in `agent-text`.
- Colour is never the only signal: the word "Guest" and the "via {client}" line always show.

### Tally, focus and filters

- Tally bars: a `text-3` fill on a `surface-2` track. The voted option is marked by a tick and weight.
- Focus: a 2 px ring in `focus`, on keyboard focus only (WEB-9). `focus` is a neutral slate, not Clear Sky's research blue, because the owner's rule is no blue outlines (memory rule, 2026-10-25 style; kept on 2026-10-28).
- The chosen tab, an "is" filter chip and a segmented choice use a neutral mark: `surface-2` fill and weight, never `info`.

### Dark mode

- Dark mode follows the system setting. The product has no theme switch (WEB-28, N7).
- Dark is designed, not inverted. `canvas` is L 0.170; nearer layers are lighter: `surface-1` 0.207, `surface-2` 0.250, `surface-3` 0.275. The sidebar is darker, at 0.148.
- Text is off-white (`text-1` at L 0.951), never pure white.
- The accent stays `#0F72DB`. Status, guest and agent colours take their dark values from the table.

## Owner acceptances (A37)

1. **The surface ladder moves.** `docs/tokens/rebrand.md` says to tint the neutrals but keep the lightness steps, with `ground` at L 0.905. Clear Sky raises `ground` to L 0.972. In light mode `raise` (`surface-2`) is darker than `panel`, because nothing is lighter than a white panel. In dark mode the ladder keeps the system's order. The owner accepted this by choosing A (A37, 2026-10-28).
2. **The coral marker numeral.** A white numeral on coral is 3.91:1, under 4.5:1 for normal text. Rule: the numeral inside a coral reference marker is bold and at least 19 px, so it counts as large text (bold from 18.7 px) and needs 3:1. The marker grows to fit it. The shared annotation renderer in `snapmark-kit/packages/annotations` draws it. The owner accepted this with A37.

## Checks still to run

The starter's colour-blind distance check (protanopia, deuteranopia, tritanopia, need 8) and its `npm run validate`. Both run in milestone 1, once the overlay is written (F6).
