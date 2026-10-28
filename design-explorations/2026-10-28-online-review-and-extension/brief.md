# Snapmark online: review panel and Chrome extension

**What:** the web app's feedback view with a GitHub-style review, and the Chrome extension: side panel, pins on the page, live-page annotation and version compare.
**For whom:** product people, designers and engineers reviewing UI changes their coding agents made. They review weekly, sometimes daily.
**The job:** see exactly what changed on the running page, talk about it in one thread, and give one verdict (Approve or Request changes) that decides whether a version is accepted.
**Source of truth:** `docs/designs/2026-10-27-snapmark-online.md` sections 4.2, 9.1 and 9.5.

**Axis the three directions differ on: where the review happens.**

- 01 Safe: the web app is home; the extension mirrors it in a side panel (GitHub's model).
- 02 Bold: the live page is home; pins and the before/after wipe dominate, the panel is thin.
- 03 Contrarian: review is a timeline of versions, not a thread with a button; the verdict is a step at the end of comparing.

**Fixed in all three (owner rules):**

- The primary button is ALWAYS the last button in its row, at the right. More (…) goes first. Two equal verdicts are no exception.
- One filled accent button per region; nothing else uses the accent.
- Accept rule: a version is accepted with at least one Approve and no open Request changes.
- Annotations sit on the live page, stuck to their element; every version keeps a capture (or a looping recording with filmstrip) so old and new can be compared.

**Content (real, from the owner's mock):** workspace "Kestrel Shop", feedback #42 "Total jumps when the coupon applies", status Implemented, versions v0 Original, v1 Mockup · Dana, v2 Implementation · PR #212 · Ben via Claude. Checkout page: Linen Overshirt, Sand, M €59.00; Canvas Tote €25.90; Subtotal €84.90; Coupon SPRING10 −€8.49; Shipping €4.90; Total €81.31; button "Pay €81.31". Thread: Ana Silva (on v0, 27 Oct): "The total jumps from €84.90 to €76.41 and back a second after the coupon applies. Keep the total steady and show the discount as its own line." Ben via Claude (Question): "Should the discount line show the code, like "SPRING10 −€8.49", or only "Discount"?" Ana Silva (Answer): "Show the code. Customers check it." Ben via Claude on v2, 10:42: "Posted v2. The discount is now its own line and the total renders once. PR #212."
