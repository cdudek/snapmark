---
id: 2026-10-28-adr-kit-contracts-v1-frozen
title: 'Kit contracts v1 freeze at the end of M1; snapshot prereleases with additive changes only'
type: adr
status: proposed
created: 2026-10-28
supersedes: []
superseded_by: []
amended_by: []
tags: [online, kit, contracts, release]
---

# Kit contracts v1 freeze at the end of M1; snapshot prereleases with additive changes only

## Context

Design [8.1](2026-10-27-snapmark-online.md#81-repo-layout) puts shared code only in `snapmark-kit`. A contract change means a kit release, then a bump PR in up to three repos. Milestones 2 to 6 start together after milestone 1, so that loop would stall them.

## Decision

- **Freeze:** `contracts` v1 (REST, MCP, marks, anchor, version stamp) is frozen at the end of M1.
- **Delivery:** during release 1, the kit publishes Changesets snapshot prereleases (`0.x`) to GitHub Packages. Apps pin the exact snapshot.
- **Additive only:** a milestone may add a field, a type or a tool. It never renames or removes, so no bump breaks anyone.
- **Breaking change:** a new path version (`/api/v2`), as design 8.1 already says.
- **Versioning:** every `jsonb` payload carries `schemaVersion`. The server keeps adapters for the current and the previous version.
- **Clients** send `Snapmark-Client: extension/0.1.0`. A client older than the previous version gets `426` with a plain message.

## Rejected

- A full release and a bump PR for every change during parallel milestones: slow, and versions drift between repos.
- Copying schemas into each app: two sources for one fact.

## Consequences

- Contract design is front-loaded into M1, and M1 grows a little.
- A builder in M2 to M6 who needs a change adds a field and publishes a snapshot; nobody waits for a bump PR.

## Milestones

- [online-release-1](../../changes/2026-10-27-online-release-1/milestone.md): M1 (freeze), M2 to M7 (consume).
- Refines design [8.1](2026-10-27-snapmark-online.md#81-repo-layout).
