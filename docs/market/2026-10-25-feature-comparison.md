# Snapmark: feature comparison and licence obligations

Date: 2026-10-25. Not legal advice. Feature data comes from the vendors' own home pages fetched today (CleanShot X, Xnapper, Shottr) plus secondary sources where marked. Cells marked "not stated" mean the fetched page did not mention the feature, not that it is missing.

## Summary

1. Xnapper wins on one-shot beautifying (auto-redact, auto-balance, ratios, backgrounds, background removal). CleanShot X is the full suite (recording, cloud, backgrounds). Shottr is the lean annotator with OCR, scrolling capture, ruler and pin. None of the three has sessions or a Markdown output.
2. Snapmark already has the annotation set that matters for AI feedback (numbered notes, remove/approve marks, cut and move, text cards with pointer lines). It lacks nothing the three do for review work except scrolling capture, OCR and window capture.
3. Top additions: scrolling capture (session), window capture (both), copy/save as image (both), OCR (session, to paste text into the note), auto-redact (one-shot, optional for session).
4. Skip: speech bubbles (numbered notes with text cards already cover them), watermark, pin to screen, recording, cloud links, ratio presets in session mode.
5. Licence: EU/German consumers get a statutory right to updates for the period they can reasonably expect, which "1 year of updates" does not safely replace unless disclosed and agreed separately at checkout (BGB §327h). A merchant of record takes payment, tax and withdrawal handling, not your update duty. 14-day withdrawal can be waived for downloads with express consent at checkout.

## 1. Feature matrix

Versions: Xnapper 1.18.1 (2026-08-28), Shottr 1.9.3 (2026-09-24); CleanShot X has no version on the fetched page.

| Feature                                        | Shottr                                               | Xnapper                                                                   | CleanShot X                                          | Snapmark today                   |
| ---------------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------- | -------------------------------- |
| Region capture                                 | Yes                                                  | Yes                                                                       | Yes                                                  | Yes                              |
| Capture same area again                        | Not stated                                           | Not stated                                                                | Not stated                                           | Yes                              |
| Scrolling capture                              | Yes                                                  | Yes                                                                       | Yes                                                  | No                               |
| Window capture                                 | Not stated                                           | Yes (Space key)                                                           | Not on page (widely known: yes)                      | No                               |
| OCR / text recognition                         | Yes (also QR)                                        | Yes, on-device                                                            | Yes, on-device (also QR)                             | No                               |
| Speech bubbles / callouts                      | Not found in sources                                 | Not stated                                                                | Callouts                                             | Text cards with pointer lines    |
| Step counters                                  | Yes (counter tool)                                   | Not stated                                                                | Numbered steps                                       | Numbered note markers with notes |
| Blur / pixelate                                | Yes, plus a text mode                                | Blur                                                                      | Redaction                                            | Redact (pixelate)                |
| Auto-redact sensitive data                     | No (manual)                                          | Yes: emails, card numbers, IPs, API keys                                  | Not stated (manual redaction)                        | No                               |
| Beautify: backgrounds, padding, radius, shadow | Gradient backdrops, shadows, rounded corners         | Yes: auto-balance, padding, corners, shadow, gradients or images, presets | Yes: padding, shadow, 20 backgrounds, custom presets | No                               |
| Aspect ratio / size presets                    | Not stated                                           | Yes (social sizes and aspect ratios)                                      | Resize and crop                                      | No                               |
| Watermark text                                 | No                                                   | Free version is watermarked, paid removes it; no custom text stated       | Not stated                                           | No                               |
| Pin to screen                                  | Yes                                                  | Yes                                                                       | Yes                                                  | No                               |
| Quick-access overlay after capture             | Opens in editor                                      | Snap, Preview, Share                                                      | Yes (save, copy, drag out)                           | Opens in editor                  |
| Copy / save / save as / drag out               | Yes (save to folder); S3 upload                      | Copy and save                                                             | Save, copy, drag into any app                        | Sessions, PDF/ZIP, copy prompt   |
| Cloud upload / share link                      | S3-compatible only                                   | "Coming soon"                                                             | Yes, links, comments, custom domain                  | No                               |
| Screen recording / GIF                         | No                                                   | Recording                                                                 | MP4 and GIF, webcam, editor                          | No                               |
| Ruler and colour picker                        | Yes, both                                            | Not stated                                                                | Not stated                                           | No                               |
| Background removal                             | Remove objects, not backgrounds                      | Yes                                                                       | Not stated                                           | No                               |
| Keyboard tool switching                        | Not stated                                           | Not stated                                                                | Custom shortcuts for capture                         | Yes (Cmd+1 to Cmd+7)             |
| Highlighter, spotlight, pen, arrow, box        | Yes (highlight, spotlight, freehand, shapes, arrows) | Arrows, shapes, text                                                      | Markup, highlight, spotlight                         | Yes                              |
| Cut and move, remove-area marks                | Overlay and combine images                           | Not stated                                                                | Not stated                                           | Yes                              |
| Sessions in Markdown, copy prompt for AI       | No                                                   | No                                                                        | No                                                   | Yes                              |

What "ratio" does: Xnapper places the screenshot on a larger canvas and fills the rest with the background, so the output has a chosen aspect ratio (16:9 for slides, 1:1 for social posts, 4:5 for portrait feeds). It changes the canvas, not the screenshot. It matters for sharing to humans, not for an AI agent reading the image.

Sources:

- CleanShot X: https://cleanshot.com/
- Xnapper: https://xnapper.com/
- Shottr (v1.9.3, features): https://shottr.cc/ ; secondary for counters, text mode, scrolling and ruler: https://www.bitdoze.com/shottr-mac-screenshot-tool/ and https://www.stork.ai/en/shottr (search results, not fetched)

Gaps: shottr.cc/features.html and the knowledge base did not load, so Shottr window capture, ratios and watermark are "not stated". CleanShot window capture is from general knowledge, not the fetched page.

## 2. Verdicts for Snapmark

Judged against the main job: an AI agent reads a Markdown session of annotated images.

- **Scrolling capture: add to session mode.** Reviewing a long page or log is the main case where a region drag fails; the agent needs the whole page as one image. Highest value, hardest to build.
- **Window capture: add to both modes.** Cheap (one key while capturing), predictable crop, no stray desktop in the session image.
- **Copy image / save as: add to one-shot mode, and a plain "copy image" in session mode.** Needed for the second mode to exist at all. Keep it to copy, save, and drag out; no cloud.
- **OCR: add to session mode.** An agent often cannot read small text in a screenshot; pasting recognised text beside the image helps it. macOS Vision does it on-device. Keep optional per capture.
- **Auto-redact: add as one-shot mode only.** Useful when the output leaves the machine; for a session going to a local agent the owner chooses what to capture. Xnapper's pattern list (emails, cards, IPs, API keys) is the model; manual pixelate already exists.
- **Beautify (padding, rounded corners, shadow, background): add as one-shot mode only.** It makes images pretty for humans and wastes pixels and tokens for an agent. Offer one preset, no gallery.
- **Ratio presets: skip, or one-shot only if beautify ships.** It only changes the canvas for social or slides; no AI-feedback value.
- **Speech bubbles / callouts: skip.** Numbered markers with notes and text cards with pointer lines already do this, and the notes land in the Markdown.
- **Watermark text: skip.** Not a review feature, and Xnapper's watermark is a free-tier nag, not a need.
- **Pin to screen: skip.** Useful when comparing against a reference, but it is a separate floating-window feature and needs window management.
- **Recording, cloud links, background removal, ruler, colour picker: skip.** Each starts a second product. Ruler and colour picker are the cheapest if a designer audience matters later.

Top 5 to add: 1) scrolling capture (session), 2) window capture (both), 3) copy image and save as (one-shot, copy in session), 4) OCR (session), 5) auto-redact (one-shot).

## 3. Licence obligations for a one-off Mac app sold to EU consumers

Not legal advice. Statute text was read through a summarising fetch tool and the EUR-Lex text of Directive 2019/770 did not load, so Article 8 is cited from the German implementation; have a lawyer check before launch.

**What the law requires.**

- §327f(1) BGB: the seller must ensure the consumer receives updates needed to keep the digital product in conformity, including security updates, and must inform the consumer of them. For a contract to provide a product permanently, the period is the whole provision period; otherwise it is "the period the consumer can reasonably expect", judged by product type and purpose, the circumstances and the type of contract. Source: https://www.gesetze-im-internet.de/bgb/__327f.html
- §327f(3): if the consumer does not install an update within a reasonable time after being told what it fixes and the risk of skipping it, the seller is not liable for a defect caused only by that. Same source.
- Scope: consumer contracts where an entrepreneur provides digital content for a price (§327). Business buyers are outside it. Source: https://www.gesetze-im-internet.de/bgb/__327.html
- The conformity standard includes security, compatibility and continuity that is usual for such products, and that updates under §327f are provided (§327e(3)). Source: https://www.gesetze-im-internet.de/bgb/__327e.html
- Remedies for a defect: repair, termination, price reduction, damages (§327i). Source: https://www.gesetze-im-internet.de/bgb/__327i.html
- The directive behind this is Directive (EU) 2019/770, applicable from 2022-01-01; the official text is at https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32019L0770 (not retrieved).

**Interaction with "1 year of updates" licences.**

- §327s: a term that departs from this subtitle to the consumer's disadvantage cannot be relied on. Source: https://www.gesetze-im-internet.de/bgb/__327s.html
- §327h allows the parties to depart from §327f(1) only if the consumer is specifically told before buying that the product deviates, and the deviation is agreed expressly and separately in the contract. Source: https://www.gesetze-im-internet.de/bgb/__327h.html
- So a bare "1 year of updates" line in a product description does not clearly cap the security-update duty for German or EU consumers. If Snapmark wants the cap, it needs a clear notice before purchase and a separate tick box at checkout. Even then, the safer reading is: feature updates are time-boxed; security and compatibility fixes are owed for as long as a buyer could reasonably expect, which for a desktop utility is plausibly several years. I found no authoritative guidance giving a number of years; treat that as open.
- CleanShot X and Xnapper both use the time-boxed model (https://cleanshot.com/pricing, https://xnapper.com/pricing). I did not check how either word its terms for EU consumers.

**Does a merchant of record take that duty?** No. Paddle's consumer terms say Paddle is the authorised reseller, while the Supplier (you) provides the Product, including upgrades and support services, under the Supplier Agreement, and Paddle excludes liability for losses relating to the Product. Paddle does handle tax, invoicing, payment issues and the withdrawal refund. Source: https://www.paddle.com/legal/invoiced-consumer-terms. A search result for a third-party product's terms says the same split applies to Lemon Squeezy (https://framebird.io/refund-policy, secondary). Lemon Squeezy's own terms were not checked.

**Withdrawal and refunds for downloads.**

- The 14-day right of withdrawal for EU consumers ends for digital content not on a data carrier once the seller has started performance, if the consumer expressly agreed to that start before the period ended, confirmed they know the right is lost, and the seller sent the §312f confirmation (§356(6) BGB). Source: https://www.gesetze-im-internet.de/bgb/__356.html
- Paddle's terms give EU consumers 14 days, unless they have started using the product after agreeing to immediate availability. Source: https://www.paddle.com/legal/invoiced-consumer-terms
- A voluntary refund promise (CleanShot and Xnapper both advertise 30 days) is separate and stricter than the law needs. It also applies when the app is defective regardless of the waiver, because §327i remedies stay.

**What a solo developer realistically owes.**

- Security fixes for the Electron runtime and dependencies for as long as the product is sold and for a reasonable period afterwards, including the update-check mechanism that tells users about them (§327f informing duty).
- Compatibility with the current macOS and the previous one or two, since "compatibility" is part of customary quality (§327e). No source gives a figure.
- A way to receive updates: either a signed, notarised build with auto-update, or a clear notice per release. Mac distribution outside the store needs signing anyway.
- Feature updates, new modes and major versions can be time-boxed if disclosed per §327h.
- Keep: the checkout consent tick box for immediate download, a clear statement of the update promise, an imprint and terms for a German seller. I did not research the German imprint or terms rules.

## Caveats

- Shottr, Xnapper and CleanShot X pages are marketing pages; not-stated cells may be false negatives.
- The EUR-Lex directive text and Article 8 did not load; the "reasonable expectation" standard is quoted through BGB §327f.
- No authoritative source found for how many years count as reasonable for a desktop utility.
- Lemon Squeezy's own consumer terms were not read.
