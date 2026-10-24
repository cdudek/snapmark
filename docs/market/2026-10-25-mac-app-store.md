# Snapmark on the Mac App Store vs selling direct

Researched 2026-10-25. Every claim carries a URL. Items marked **[unverified]** came from a search snippet or general knowledge and could not be confirmed on a primary page; test them before committing to a plan.

## Summary (5 lines)

1. The Mac App Store (MAS) can deliver all three asks: $12.99 one-off (non-consumable IAP), a 7-day trial (Apple's $0 "XX-day Trial" non-consumable IAP), and voucher codes (offer codes, which now cover non-consumables, but redeem in-app only on macOS 15+).
2. MAS forces the App Sandbox. That breaks or puts at risk `screencapture` as a child process, the user-chosen folder (needs security-scoped bookmarks), and electron-updater; global shortcuts and login items are likely fine but unconfirmed.
3. Electron's `inAppPurchase` is StoreKit 1 only (no JWS, no offer-code sheet), so IAP from Electron means app receipts plus your own code, and offer-code redemption through the App Store app is untested.
4. Direct (Lemon Squeezy or Paddle) costs 5% + 50 cents (about $1.15 on $12.99, net $11.84) vs Apple's 15% (about $1.95, net $11.04), needs no sandbox work, and has discount codes, but you build the trial yourself and Paddle Billing has no licence keys.
5. Recommendation: ship direct first with Lemon Squeezy (licence key + discount codes + local 7-day trial); treat MAS as a second, separate `mas` build only if you want the discovery channel.

---

## 1. Mac App Store for an Electron app

### What electron-builder's `mas` target needs

- A sandboxed build. "Only the MAS build of Electron works with it; the standard build fails to launch" under App Sandbox. Source: https://www.electronjs.org/docs/latest/tutorial/mac-app-store-submission-guide
- Certificates. Electron's guide says to submit with an "Apple Distribution" certificate; "Apple Development" apps cannot be submitted; Developer ID is for outside the store. Source: https://www.electronjs.org/docs/latest/tutorial/mac-app-store-submission-guide
- electron-builder's wording differs: a "Mac App Distribution" certificate for the app and a "Mac Installer Distribution" certificate for the PKG. Source: https://www.electron.build/docs/mas . The older names "3rd Party Mac Developer Application/Installer" appear only in a third-party mirror, so verify the identity names in your Keychain **[unverified]**: https://tessl.io/registry/tessl/npm-electron-builder/files/docs/macos-packaging.md
- Config lives under `mas`: `entitlements` (main), `entitlementsInherit` (helpers), `provisioningProfile`. `mas-dev` is the local-testing target and uses a Development certificate and profile. Source: https://www.electron.build/docs/mas
- Entitlements: sandbox key, application-groups entry, inherit entitlement for nested executables, `ElectronTeamID` in Info.plist; `@electron/osx-sign` adds the necessary ones. Add `network.client` for outgoing network and `files.user-selected.read-write` for save dialogs. Source: https://www.electronjs.org/docs/latest/tutorial/mac-app-store-submission-guide
- Upload with Apple Transporter after creating the app record. Source: same Electron guide.
- A forum report of an App Store rejection over a helper (Renderer) signed with the wrong certificate: https://developer.apple.com/forums/thread/747005 (one developer's report).

### What breaks under the sandbox, per capability

- **Auto-update:** MAS build disables `autoUpdater` and `crashReporter` (https://www.electronjs.org/docs/latest/tutorial/mac-app-store-submission-guide). App Review rule: "They must use the Mac App Store to distribute updates; other update mechanisms are not allowed" (guideline 2.4.5(vii), https://developer.apple.com/app-store/review/guidelines/). Remove electron-updater from the `mas` build.
- **Global shortcuts (`globalShortcut`):** Not named in Electron's MAS limitation list, and Electron's docs do not mention the sandbox (https://www.electronjs.org/docs/latest/api/global-shortcut). A 2012 observation says Carbon `RegisterEventHotKey` works in the sandbox (https://mjtsai.com/blog/2012/05/17/hotkeys-and-the-mac-app-store/). A modern MAS developer confirms the sandboxed Carbon API can register Cmd+key combinations (https://alinpanaitiu.com/blog/apps-outside-app-store). Verdict: likely works for normal modifier+key shortcuts, but **[unverified]** for Electron on MAS; needs a signed `mas-dev` test.
- **`screencapture` child process:** Risky. In 2016 a sandboxed app running `/usr/sbin/screencapture` interactively hit a sandbox denial on `com.apple.screencapture.interactive`; a temporary-exception entitlement was needed, and an undocumented one was rejected by App Review (ITMS-90285). Non-interactive calls ran without entitlements. Apple later made a temporary exception acceptable. Source: https://blog.eternalstorms.at/?p=874 (2016, may be outdated). Plan to test, and plan a fallback to `desktopCapturer`.
- **`desktopCapturer` / Screen Recording permission:** Capture needs user consent on macOS 10.15+, check with `systemPreferences.getMediaAccessStatus`; with no permission there is no error, the stream just never delivers. Source: https://www.electronjs.org/docs/latest/api/desktop-capturer . Electron's MAS guide also warns "video capture may fail on some machines" (https://www.electronjs.org/docs/latest/tutorial/mac-app-store-submission-guide).
- **TCC attribution for child processes:** A forum report says a plain executable launched from another app shows the parent app in the Screen Recording list. Source: https://developer.apple.com/forums/thread/794253 **[unverified, single report]**. Nobody documents how a sandboxed parent's grant applies to a spawned `screencapture`.
- **Writing to `~/Documents/Snapmark` (and a user-chosen folder):** In the sandbox, `Documents` resolves to the app container unless the user picks a folder. Keep access across launches with security-scoped bookmarks. Entitlements: `files.user-selected.read-write` and `files.bookmarks.app-scope`. Electron exposes `app.startAccessingSecurityScopedResource(bookmarkData)` for MAS builds ("may reach outside their sandbox to access files chosen by the user") at https://www.electronjs.org/docs/latest/api/app . The entitlement and bookmark mechanics are from general knowledge of https://developer.apple.com/documentation/security/app_sandbox/accessing_files_from_the_macos_app_sandbox **[unverified: page body not retrievable]**. Existing session folders in `~/Documents/Snapmark` would need a one-time folder-pick migration. Guideline 2.4.5(i) also requires proper sandboxing and following the File System documentation.
- **`shell.trashItem`:** Not documented either way **[unverified]**; expected to work only on files the app can access (inside a bookmarked folder).
- **Login items:** Electron's `setLoginItemSettings` supports `mainAppService` (SMAppService) on macOS and has no MAS caveat in the docs (https://www.electronjs.org/docs/latest/api/app). SMAppService.mainApp is the sandbox-compatible route, macOS 13+ **[unverified: page body not retrievable]** (https://developer.apple.com/documentation/servicemanagement/smappservice). Guideline 2.4.5(iii): no auto-launch "without consent" (https://developer.apple.com/app-store/review/guidelines/), so keep it opt-in.
- **Opening files in other apps:** `shell.openPath` / `openExternal` generally work; opening files outside the bookmarked folder needs access **[unverified]**.

### App Review risks for screen-capture apps

- Guideline 2.5.14: "Apps must request explicit user consent and provide a clear visual and/or audible indication when recording, logging, or otherwise making a record of user activity." Includes screen recordings. Source: https://developer.apple.com/app-store/review/guidelines/
- Guideline 5.1.1(iii): only request access relevant to core functionality. Same source. Write a precise Screen Recording purpose string and explain it in review notes.
- Guideline 2.4.5(vi): no licence screen at launch, no licence keys (same source). Your direct build's licence UI must not exist in the `mas` build.
- Private API use gets rejected (example: https://alinpanaitiu.com/blog/apps-outside-app-store).
- Features needing Accessibility or Input Monitoring are not possible sandboxed; CleanShot's single-window select needs Accessibility (same article). Snapmark's feature list as given does not need them.

### Real Electron apps on the Mac App Store

- Mattermost Desktop (an Electron wrapper) says macOS users can install it from the App Store (https://docs.mattermost.com/developers/contribute/more-info/desktop, from a search snippet **[unverified]**).
- Slack, Notion, Figma, Trello are Electron (https://electronjs.org/apps), but I could not confirm any of them is on the MAS. Do not cite them as proof.

---

## 2. One-off purchase + 7-day trial on the App Store

### Options in 2026

1. **Paid app:** no trial mechanism. The only free copy route is an app promo code (section 3).
2. **Free app + non-consumable unlock + $0 "trial" IAP (recommended on MAS).** Guideline 3.1.1, current text:

   > "Non-subscription apps may offer a free time-based trial period before presenting a full unlock option by setting up a Non-Consumable IAP item at Price Tier 0 that follows the naming convention: "XX-day Trial." Prior to the start of the trial, your app must clearly identify its duration, the content or services that will no longer be accessible when the trial ends, and any downstream charges the user would need to pay for full functionality."

   Also: "If you want to unlock features or functionality within your app (...unlocking a full version), you must use in-app purchase. Apps may not use their own mechanisms to unlock content or functionality, such as license keys..." and "you should make sure you have a restore mechanism for any restorable in-app purchases." Source: https://developer.apple.com/app-store/review/guidelines/
   Apple's text still says "Price Tier 0", the old term; create the item at a $0 price point **[unverified wording in App Store Connect]**. Developer experience: the trial UI, status tracking and post-trial limits are all yours, and starting the trial means "buying" a $0 IAP (https://alinpanaitiu.com/blog/apps-outside-app-store). Apple points to receipts and DeviceCheck for tracking trial duration (same guideline).

3. **Subscription with an introductory offer:** a subscription must "provide ongoing value" and last at least seven days (guideline 3.1.2(a), same URL). Wrong shape for a one-off price.

### Doing StoreKit from Electron

Electron's `inAppPurchase` module (main process, MAS only): https://www.electronjs.org/docs/latest/api/in-app-purchase

- `getProducts(ids)`, `purchaseProduct(id, {quantity, username})`, `canMakePayments()`, `restoreCompletedTransactions()`, `getReceiptURL()`, `finishAllTransactions()`, `finishTransactionByDate()`, event `transactions-updated`. Listen for `transactions-updated` before calling `purchaseProduct`.
- **StoreKit 1 only.** The source uses `SKProductsRequest` and `SKPaymentQueue` with no StoreKit 2 API: https://raw.githubusercontent.com/electron/electron/main/shell/browser/mac/in_app_purchase.mm . That means no `Transaction.currentEntitlements`, no `AppTransaction`, and no `presentOfferCodeRedeemSheet` (those are StoreKit 2 and Swift, https://developer.apple.com/documentation/storekit/supporting-offer-codes-in-your-app.md).
- **Validation:** `getReceiptURL()` gives the on-device app receipt; Apple deprecated the `verifyReceipt` endpoint on 5 June 2023 and steers to StoreKit 2 and the App Store Server API (https://developer.apple.com/forums/thread/714673, forum post). For a no-server app you would parse and verify the PKCS7 receipt locally (a library or small native module) **[unverified approach for a StoreKit-1-only wrapper]**. JWS transactions and the App Store Server Library (Swift, Java, Node, Python) apply only if you move to StoreKit 2, for example through a native helper (same forum thread).
- **Restore:** built in via `restoreCompletedTransactions()`; required by guideline 3.1.1.
- **Family Sharing:** supported only for non-consumables and auto-renewable subscriptions, enabled per product in App Store Connect; family members must tap Restore to get newly shared content. Sources: https://www.developer.apple.com/help/app-store-connect/configure-in-app-purchase-settings/turn-on-family-sharing-for-in-app-purchases and https://developer.apple.com/documentation/storekit/supporting-family-sharing-in-your-app.md . A vendor says it cannot be turned off once enabled (https://adapty.io/docs/apple-family-sharing, **[unverified]**), so decide before launch. Family Sharing would let one $12.99 purchase cover up to six people.
- Practical alternative: a small Swift helper using StoreKit 2, because Electron's module cannot present the offer-code sheet or verify JWS. That is the main extra engineering cost of MAS.

---

## 3. Voucher codes

### Apple

- **Offer codes (the current mechanism).** "Offer codes are available for all Apple In-App Purchase types: consumables, non-consumables, non-renewing subscriptions, and auto-renewable subscriptions." Types: one-time use, custom, sandbox. Up to 10 active offers at a time, 1,000,000 codes per app per quarter. Source: https://developer.apple.com/documentation/storekit/supporting-offer-codes-in-your-app.md
- Each offer is a "Paid Offer" (discount) or "Free Offer". One-time codes: batches of 500 to 25,000, expiry required up to 6 months. Custom codes: your own name, redemption limit up to 25,000. One code per customer per offer. Eligibility by purchase history (never purchased, etc.). Offers cannot be edited after creation. Sandbox: 10,000 test codes per quarter. Source: https://developer.apple.com/help/app-store-connect/manage-in-app-purchases/create-offer-codes-for-in-app-purchases
- **Redemption on macOS:** by redemption URL, or entering the code in the App Store; in-app sheet via AppKit `presentOfferCodeRedeemSheet`. Offer codes for non-consumables are available "starting in ... macOS 15.0" (same supporting-offer-codes page), so buyers on macOS 14 and earlier probably cannot use a non-consumable offer code **[inference; test]**. Electron cannot call the sheet (StoreKit 1), so link a redemption URL or tell people to redeem in the App Store.
- **Promo codes (old mechanism):** Apple retired IAP promo codes: "starting March 26, 2026, you'll no longer be able to create promo codes for In-App Purchases ... You can continue to use promo codes in order to provide people with a free download of your app." Source: https://developer.apple.com/news/?id=gf6mgrs6
- **App promo codes (still exist):** up to 100 per version per platform, valid four weeks, single use, free copy of the app, no rating. Source: https://developer.apple.com/help/app-store-connect/offer-promo-codes/request-and-manage-promo-codes . Not useful if the app is free with an IAP unlock; they apply to a paid-up-front app.
- **Codes you generate yourself:** not allowed to unlock functionality. Guideline 3.1.1: "Apps may not use their own mechanisms to unlock content or functionality, such as license keys..." and 2.4.5(vi) bars licence keys on the Mac App Store (https://developer.apple.com/app-store/review/guidelines/). Only Apple-issued offer codes are allowed on the MAS build.

### Direct

- **Lemon Squeezy:** "Generate unique coupon codes"; licence keys issued automatically after each sale; deactivate, re-issue, manage. 5% + 50 cents per transaction, merchant of record. Source: https://www.lemonsqueezy.com/pricing
- **Paddle:** discount codes you assign or Paddle generates, time-based or amount-based usage limits (amount limit is shared across all customers). Source: https://developer.paddle.com/build/products/offer-discounts-promotions-coupons . Fee 5% + 50 cents, merchant of record: https://www.paddle.com/pricing
- **Licence keys:** Lemon Squeezy has a License API (activate, validate, deactivate; key statuses inactive/active/expired/disabled; 60 requests per minute): https://docs.lemonsqueezy.com/api/license-api . Activation limit and "licence length" are per-product settings, and one-time products are supported (https://docs.lemonsqueezy.com/help/licensing/generating-license-keys). Paddle Billing deprecated licence key generation and activation, so you run your own licence server fed by webhooks (https://developer.paddle.com/migrate/paddle-classic/features).
- **Trial for a one-off product:** neither Lemon Squeezy's licence docs nor Paddle's describe a one-time-purchase trial (the Lemon Squeezy licence page does not cover free trials). Implement it locally (section 4).
- Lemon Squeezy was acquired by Stripe in 2024 (https://www.fintechfutures.com/fintech-start-ups/stripe-buys-us-paytech-start-up-lemon-squeezy); a 2026 blog reports Stripe Managed Payments in public preview with a migration path for Lemon Squeezy merchants (https://fungies.io/lemon-squeezy-stripe-acquisition-saas-founders-2026/). Check Lemon Squeezy's current roadmap before building on its licence API **[unverified: secondary source]**.

---

## 4. Direct sale with trial + vouchers

Typical shape for a direct-sold Electron app (a design pattern, not from a single authoritative source, so treat it as my recommendation):

1. Trial: on first run store a signed start timestamp (or an activation record on your server); after 7 days the app limits itself (read-only mode or a blocking screen). Local-only trials are easily bypassed; accept that at $12.99, or anchor the trial to a server record keyed by a device id.
2. Purchase: Lemon Squeezy checkout, with a discount code field. A licence key is emailed.
3. Activate: the app calls the License API `activate` with the key and an instance name, stores the result, and re-`validate`s occasionally. Allow offline grace (for example 14 to 30 days without a successful validate), given the 60 requests per minute limit and flaky networks. An activation limit of 2 or 3 covers multiple Macs.
4. Vouchers: Lemon Squeezy discount codes (percent or fixed, limits, expiry), or a 100% code for giveaways.

Fee difference per $12.99 sale (my arithmetic from the published rates):

- Lemon Squeezy / Paddle: 5% + 50 cents = $1.15, net $11.84. Merchant of record collects and remits VAT and sales tax. Sources: https://www.lemonsqueezy.com/pricing , https://www.paddle.com/pricing
- Apple Small Business Program: 15% = $1.95, net $11.04. Eligibility: up to $1 million in proceeds in the prior calendar year; you must enroll as Account Holder and accept the Paid Apps agreement. Source: https://developer.apple.com/app-store/small-business-program/ . Apple also acts as merchant of record.
- Direct is about $0.80 better per sale at this price. Lemon Squeezy's page says "some payments may incur extra charges", which narrows the gap slightly.

---

## 5. Both channels at once

- Two builds from one codebase is the normal route: a Developer ID ZIP/DMG with electron-updater, and a `mas` build with the sandbox, an Apple Distribution / Mac App Distribution signature and no updater. The two certificate types are separate (https://www.electronjs.org/docs/latest/tutorial/mac-app-store-submission-guide). Switch licence and updater code with a build-time flag (Electron sets `process.mas` in MAS builds **[unverified here]**).
- Licences do not carry across. MAS purchases are Apple transactions; direct purchases are Lemon Squeezy keys. A MAS build may not offer licence-key entry (2.4.5(vi), 3.1.1), so a direct buyer cannot be honoured in the MAS build, and a MAS buyer cannot be migrated for free. Any cross-channel entitlement needs your own policy.
- The MAS build may not point to direct purchase outside the US storefront: "In all other storefronts, except for the United States storefront, where this prohibition does not apply, apps and their metadata may not include buttons, external links, or other calls to action that direct customers to purchasing mechanisms other than in-app purchase" (3.1.1(a), https://developer.apple.com/app-store/review/guidelines/).
- Data location differs: a MAS install does not see `~/Documents/Snapmark` unless the user chooses the folder.
- What peers do (limited evidence):
  - CleanShot X: direct purchase ($35 one-time Basic with one year of updates; Pro subscription) and Setapp; its pricing page does not mention the Mac App Store and offers a 30-day money-back guarantee, not a trial. Source: https://cleanshot.com/pricing . A MAS developer says CleanShot-type features cannot be sandboxed because they need Accessibility permissions: https://alinpanaitiu.com/blog/apps-outside-app-store
  - Shottr: direct download only, free to use with a licence for extras, online activation. Source: https://shottr.cc/
  - Xnapper: direct from its site, free with a watermark, one-time payment removes it, licence manager. Source: https://xnapper.com/
  - None of the three pages mentions a Mac App Store version; I did not check the store listings, so do not assert absence **[unverified]**.

---

## 6. Recommendation

Simplest path to "$12.99 one-off, 7-day trial, voucher codes": **sell direct through Lemon Squeezy and keep the current Developer ID build.** All three asks are native to that stack except the trial (a small local check), and nothing in Snapmark's sandbox-hostile feature set (child-process `screencapture`, `~/Documents/Snapmark`, electron-updater) has to change. MAS is viable but is a second product with its own StoreKit 1 integration, sandbox rework and review risk.

Ordered steps (direct path):

1. Create the Lemon Squeezy store and a "Snapmark" product at $12.99 with licence keys on (activation limit 2 or 3, no expiry).
2. Add a licence module: trial start record, activate/validate against the License API, offline grace, a locked-state UI.
3. Add discount codes in Lemon Squeezy for vouchers; decide on percent-off codes and a 100% giveaway code.
4. Add "Buy" and "Enter licence key" menu items and a trial banner showing days left.
5. Ship through the existing GitHub Releases and electron-updater flow; verify the signed, notarized build with a real purchase.
6. Optional later, MAS as a second channel, in this order: (a) spike the `mas-dev` build and test `globalShortcut`, the `screencapture` child process and Screen Recording attribution; (b) choose between `desktopCapturer` and a temporary-exception entitlement; (c) add security-scoped bookmarks and a first-run folder pick; (d) build the unlock, the "7-day Trial" $0 non-consumable and restore, using a StoreKit 2 helper or `inAppPurchase` with receipt parsing; (e) create offer codes (custom plus one-time; macOS 15+ for in-app redemption); (f) strip electron-updater and licence-key UI from the `mas` build; (g) enrol in the Small Business Program and submit with review notes explaining Screen Recording.

Main risks:

- MAS: App Review rejecting the `screencapture` child process or the Screen Recording explanation; `globalShortcut` untested in the sandbox; Electron's StoreKit 1-only module and no in-app offer-code sheet; non-consumable offer codes need macOS 15+ for in-app redemption; receipt validation without a server.
- Direct: a local trial is bypassable; Lemon Squeezy's licence API future after the Stripe acquisition; Paddle needs your own licence server; you handle support and refunds beyond what the merchant of record covers.
- Both: Family Sharing and two-channel entitlement mismatch need a policy before launch.
