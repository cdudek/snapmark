---
type: prototype
change: 2026-10-27-online-release-1
created: 2026-10-28
status: draft, for the owner's review
---

# Prototype

## Form

Codex image generation (`codex exec -m gpt-6.1-sol`, built-in `image_gen`), drawn only from the validated spec (`../validation.md`, verdict ready). One anchor per screen; every other state is an edit of its anchor. Chosen direction: the calm Mac style (references: the approved calm capture bar and editor, `refs/ref-mac-*.png`, and the app icon). Only the 9 UI-risky screens from `../brief.md` are drawn. Light mode; dark only for the feedback view.

Design system: design-system-starter tokens as pinned in `snapmark-app/src/tokens.css`, the Snapmark rules in `examples/snapmark.md`, and screens.md "How to read this file": system neutrals, the token `accent` only on the one filled primary per region, no blue outlines, links or icons, coral red `#E5484D` for references, remove marks and the picker outline. Content: Kestrel Shop's web shop team (Ana, PM; Ben, engineer, "Ben via Claude"; Chris, guest client; Dana, designer), feedback #42 "Total jumps when the coupon applies" in module Checkout summary.

## How To Open

| Gallery        | Command                                                                                                                        | Notes                                                                   |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| `gallery.html` | `open changes/2026-10-27-online-release-1/spec/prototype/gallery.html`                                                         | offline, one section per screen, a feedback box each, Copy all feedback |
| Visual ledger  | `python3 <omr-ux>/skills/review/scripts/visual-check.py changes/2026-10-27-online-release-1/spec/visual/spec/round-2 --repo .` | round-2 PASS (20 images); round-1 kept at `../visual/spec/round-1/`     |
| Known faults   | `known-image-faults.md`                                                                                                        | 7 entries, 1 a spec gap                                                 |

## Screen State Matrix

| Screen              | State                                | 100 %                                                                        | 150 %     | Notes                           |
| ------------------- | ------------------------------------ | ---------------------------------------------------------------------------- | --------- | ------------------------------- |
| App shell           | ⌘K command menu open                 | [img](screens/app-shell/shots/app-shell--command-menu.png)                   | not drawn | edit of the Inbox anchor        |
| Inbox               | populated                            | [img](screens/inbox/shots/inbox--populated.png)                              | not drawn | anchor; no primary by spec      |
| Feedback view       | default with thread                  | [img](screens/feedback-view/shots/feedback-view--default.png)                | not drawn | anchor; Approve v2 primary      |
| Feedback view       | Compare side by side                 | [img](screens/feedback-view/shots/feedback-view--compare.png)                | not drawn | v0 left, v2 right               |
| Feedback view       | Details tab                          | [img](screens/feedback-view/shots/feedback-view--details.png)                | not drawn | three rank groups               |
| Feedback view       | guest viewing                        | [img](screens/feedback-view/shots/feedback-view--guest.png)                  | not drawn | faults 2, 3                     |
| Feedback view       | default, dark                        | [img](screens/feedback-view/shots/feedback-view--default-dark.png)           | not drawn |                                 |
| Decision request    | Request a Decision dialog            | [img](screens/decision-request/shots/decision-request--dialog.png)           | not drawn | fault 4; fixed in round 2       |
| Decision request    | card open with tally                 | [img](screens/decision-request/shots/decision-request--card-open.png)        | not drawn | Vote is the one accent (WEB-20) |
| Phone inbox         | populated, 390 pt                    | [img](screens/phone-inbox/shots/phone-inbox--populated.png)                  | n/a       |                                 |
| Phone feedback view | fixed action bar, 390 pt             | [img](screens/phone-feedback-view/shots/phone-feedback-view--action-bar.png) | n/a       | anchor; fault 6                 |
| Extension           | popup signed in                      | [img](screens/extension/shots/extension--popup-signed-in.png)                | not drawn | localhost, Mac bridge connected |
| Extension           | picker overlay with chip             | [img](screens/extension/shots/extension--picker-chip.png)                    | not drawn |                                 |
| Extension           | drawing toolbar on a page            | [img](screens/extension/shots/extension--drawing-toolbar.png)                | not drawn | Box tooltip; fixed in round 2   |
| Extension           | compose, code location found         | [img](screens/extension/shots/extension--compose-code-found.png)             | not drawn | anchor                          |
| Extension           | compose, Mac app not running         | [img](screens/extension/shots/extension--compose-mac-not-running.png)        | not drawn | fault 7                         |
| Device consent      | default (write scopes off)           | [img](screens/device-consent/shots/device-consent--default.png)              | not drawn | Allow and Deny equal weight     |
| Operator waitlist   | rows selected, bulk invite           | [img](screens/operator-waitlist/shots/operator-waitlist--selection.png)      | not drawn |                                 |
| Landing             | hero with waitlist form              | [img](screens/landing/shots/landing--hero.png)                               | not drawn | anchor; A30 copy                |
| Landing             | outcomes, How It Works, closing form | [img](screens/landing/shots/landing--outcomes-closing.png)                   | not drawn | A30 copy                        |

The 150 % column and the other states of each state table (loading, empty, error, extension signed out, guest, sent confirmation, code not found) were not in this run's scope (about 20 images, the states named by the caller).

## Moves

| Control                          | To screen                   | Type                                                                                                     |
| -------------------------------- | --------------------------- | -------------------------------------------------------------------------------------------------------- |
| ⌘K, sidebar Search               | App shell › command menu    | [app-shell--command-menu](screens/app-shell/shots/app-shell--command-menu.png)                           |
| Inbox row (#42)                  | Feedback view               | [feedback-view--default](screens/feedback-view/shots/feedback-view--default.png)                         |
| Compare (C)                      | Feedback view › Compare     | [feedback-view--compare](screens/feedback-view/shots/feedback-view--compare.png)                         |
| Details tab (I)                  | Feedback view › Details     | [feedback-view--details](screens/feedback-view/shots/feedback-view--details.png)                         |
| Footer More › Request a Decision | Request a Decision dialog   | [decision-request--dialog](screens/decision-request/shots/decision-request--dialog.png)                  |
| Request Decision                 | Decision card in the thread | [decision-request--card-open](screens/decision-request/shots/decision-request--card-open.png)            |
| Phone Inbox row                  | Phone feedback view         | [phone-feedback-view--action-bar](screens/phone-feedback-view/shots/phone-feedback-view--action-bar.png) |
| Extension icon                   | Extension popup             | [extension--popup-signed-in](screens/extension/shots/extension--popup-signed-in.png)                     |
| Capture (⌘⇧K)                    | Picker overlay              | [extension--picker-chip](screens/extension/shots/extension--picker-chip.png)                             |
| Click the element                | Drawing and compose         | [extension--drawing-toolbar](screens/extension/shots/extension--drawing-toolbar.png)                     |
| Agent sign-in (`/authorize`)     | Device consent              | [device-consent--default](screens/device-consent/shots/device-consent--default.png)                      |

## Gaps Found

| Gap                                                                              | Spec file changed                         | Status                                          |
| -------------------------------------------------------------------------------- | ----------------------------------------- | ----------------------------------------------- |
| Guest footer row does not fit four controls in 400 px (known-image-faults.md #3) | none (this run writes only the prototype) | open, for the owner and the validation re-check |

## Files

- `prompts/` every Codex prompt (`common.txt` holds the design system in words); `logs/` the Codex runs.
- `refs/` the reference shots and one `anchor-<screen>.png` per screen.
