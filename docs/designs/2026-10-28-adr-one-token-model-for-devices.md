---
id: 2026-10-28-adr-one-token-model-for-devices
title: 'One OAuth token model for the extension, the Mac app and agents; claim and ask need write'
type: adr
status: proposed
created: 2026-10-28
supersedes: []
superseded_by: []
amended_by: []
tags: [online, auth, mcp, security]
---

# One OAuth token model for the extension, the Mac app and agents; claim and ask need write

## Context

Design [6. Sign-in](2026-10-27-snapmark-online.md#6-sign-in) gives every device its own revocable token. Design [8.2](2026-10-27-snapmark-online.md#82-data-model-postgres) lists a `device_tokens` table, and design 14.2 names `@better-auth/oauth-provider` next to `@better-auth/mcp`. The tech review found three problems:

- `@better-auth/mcp` is itself the OAuth provider and needs the `jwt` plugin. Registering `oauthProvider()` beside it is wrong.
- Better Auth issues JWT access tokens, checked locally. A revoked device or a switched-off scope keeps working until the token expires, so F101 fails.
- `claim` and `ask` change state with a read-only token. A flood of `ask` calls blocks every claim (S5).

The owner decided on 2026-10-28 (A34): "Claim and ask need write".

## Decision

- **One provider:** `@better-auth/mcp` with `jwt()` issues tokens to the extension, the Mac app and MCP clients. `oauthProvider()` is not registered.
- **Clients:** the extension and the Mac app are first-party public clients, registered in advance, with fixed scopes `capture` and `sync`. MCP clients register themselves and can never hold `capture` or `sync`.
- **Audiences:** `…/api/v1` for the extension and the Mac app, `…/mcp` for agents. A token works for its own audience only.
- **Lifetimes:** access tokens live 10 minutes. Refresh tokens rotate, with reuse detection.
- **Devices table:** `devices` (user, OAuth client id, kind, name, scopes, last_used_at, revoked_at) replaces `device_tokens`. Every REST and MCP call looks up its device and refuses a revoked device or a missing scope. The audit event stores the device id, never the token.
- **Scopes (A34):** `read` is the default. `claim` and `unclaim` need `report_implementations`, as does `report_implementation`. `ask` and `reply` need `reply`. `post_version` needs `post_versions`. No scope can approve.

## Rejected

- Our own `device_tokens` table with hand-made tokens: a second token system beside the OAuth server that MCP needs anyway.
- Better Auth session tokens for devices: tied to the web session, with no audience and no scopes.
- JWT checks alone, without the device lookup: revoking and scope switches would lag by up to the token lifetime.
- `claim` and `ask` on the read scope: a read-only token could change status and block claims.

## Consequences

- One database read per call. In return, revoking and scope switches take effect on the next call (F101).
- F99 names every write tool, `claim`, `unclaim` and `ask` included. The device consent page lists them under write scopes.
- This ADR replaces design 14.2's `oauthProvider()` and device-authorisation lines; the device code is gone (see [Mac sign-in](2026-10-28-adr-mac-sign-in-browser-loopback.md)).
- If a later Better Auth release issues opaque tokens, the device lookup stays; only the lifetime may change.

## Milestones

- [online-release-1](../../changes/2026-10-27-online-release-1/milestone.md): M1 (`devices` table), M3 (extension sign-in), M4 (MCP scopes and revoking), M5 (Mac sign-in).
- Refines design [6](2026-10-27-snapmark-online.md#6-sign-in), [8.2](2026-10-27-snapmark-online.md#82-data-model-postgres) and [10](2026-10-27-snapmark-online.md#10-ai-safety-owner-strict).
