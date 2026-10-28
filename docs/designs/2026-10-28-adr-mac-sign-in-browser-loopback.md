---
id: 2026-10-28-adr-mac-sign-in-browser-loopback
title: 'The Mac app signs in through the browser with a loopback redirect; no device code'
type: adr
status: proposed
created: 2026-10-28
supersedes: []
superseded_by: []
amended_by: []
tags: [online, auth, mac, security]
---

# The Mac app signs in through the browser with a loopback redirect; no device code

## Context

Design [6. Sign-in](2026-10-27-snapmark-online.md#6-sign-in) says devices sign in through the browser with OAuth and PKCE. The spec and facts F129 and F130 used a device code instead: the Mac app opens `/device` with the code filled in from the URL. The tech review (S6) found this phishable. A victim who clicks an attacker's `/device` link approves the attacker's code, and the attacker gets a token.

The owner decided on 2026-10-28 (A35): "Browser with loopback", no device code.

## Decision

- **Flow:** Sign In… opens the system browser on the authorise URL, with auth code, PKCE (S256) and `state`, as RFC 8252 describes for native apps.
- **Redirect:** the Mac app listens on `127.0.0.1` on a free port for that one redirect, `http://127.0.0.1:<port>/callback`, then closes the listener. It never binds to other interfaces.
- **Client:** the Mac app is the pre-registered public client from the [token model](2026-10-28-adr-one-token-model-for-devices.md). The provider accepts any port on `127.0.0.1` for it, and no other host.
- **Token:** the Mac app checks `state`, exchanges the code, and keeps the refresh token in Electron `safeStorage` (Keychain), never in `state.json`.
- **No device code:** the Better Auth `device-authorization` plugin is not installed, and `/device` does not exist.

## Rejected

- Device code filled in from the URL (F129 as drafted): phishable, as above.
- Device code without prefill and with a 10-minute expiry: safer, but still open to social engineering, and it adds a code screen and an expired-code state.
- A custom URL scheme redirect: another Mac app can claim the same scheme.
- Signing in inside an Electron window: the app could read the password, and RFC 8252 rules out embedded browsers.

## Consequences

- F129 and F130 (device code shown, code expired) are rewritten for the loopback flow. The Settings › Online tab loses its device-code state.
- One Better Auth plugin fewer, and the S6 threat is gone rather than reduced.
- Sync in M7 uses the same token.

## Milestones

- [online-release-1](../../changes/2026-10-27-online-release-1/milestone.md): M5 (Settings › Online tab, plan 5.2), used again by M7.
- Refines design [6. Sign-in](2026-10-27-snapmark-online.md#6-sign-in).
