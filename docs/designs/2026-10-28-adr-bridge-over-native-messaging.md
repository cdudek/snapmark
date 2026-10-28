---
id: 2026-10-28-adr-bridge-over-native-messaging
title: 'The localhost bridge runs over Chrome native messaging, relayed to the running Mac app on a Unix socket'
type: adr
status: proposed
created: 2026-10-28
supersedes: []
superseded_by: []
amended_by: []
tags: [online, mac, extension, bridge, security]
---

# The localhost bridge runs over Chrome native messaging, relayed to the running Mac app on a Unix socket

## Context

Design [7](2026-10-27-snapmark-online.md#7-clients-and-where-code-context-comes-from) has the extension ask the Mac app, through Chrome native messaging, which process serves `localhost:<port>`. The tech review found a gap: Chrome starts the native host as a new process for each connection. The host is not the running app, so it cannot see the bridge setting or answer for it.

## Decision

- **Host shim:** a small script inside the app bundle, run by the app's own Electron binary with `ELECTRON_RUN_AS_NODE=1`.
- **Relay:** the shim forwards each request to the running app over a Unix socket in the app's support folder, mode 0600. Never TCP.
- **States:** no socket means "Mac app not running". The bridge setting off means the app answers "off" (F127).
- **Allow-list:** the host manifest's `allowed_origins` lists only the [pinned extension id](2026-10-28-adr-pinned-extension-id.md).
- **Input:** the host accepts only `{ port: 1–65535 }`. The extension asks only about the active tab's own port.
- **Lookup:** the app answers only for listeners on 127.0.0.1, with `lsof` and `git` called through `execFile`, never a shell. It strips credentials from the remote URL and sends the worktree name, never the absolute path.
- **Source runs:** a dev host manifest points at the source checkout.

## Rejected

- A localhost HTTP server in the Mac app: any website can call it, and DNS rebinding reaches it.
- A shim that does the lookup itself: it would run with the app closed and ignore the bridge setting.
- TCP between shim and app: any local process could connect.

## Consequences

- Tests cover all four bridge states, from source and from the bundle.
- The Docker limit from design 7 stays: a dev server in Docker reports the Docker proxy.
- The bridge depends on the pinned extension id from the first commit.

## Milestones

- [online-release-1](../../changes/2026-10-27-online-release-1/milestone.md): M5 (bridge), M3 (extension bridge states).
- Refines design [7](2026-10-27-snapmark-online.md#7-clients-and-where-code-context-comes-from), source 2 "Mac app bridge".
