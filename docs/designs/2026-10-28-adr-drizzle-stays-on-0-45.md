---
id: 2026-10-28-adr-drizzle-stays-on-0-45
title: 'Drizzle stays on 0.45 for release 1; 1.0 is its own change'
type: adr
status: proposed
created: 2026-10-28
supersedes: []
superseded_by: []
amended_by: []
tags: [online, web, dependencies, data-model]
---

# Drizzle stays on 0.45 for release 1; 1.0 is its own change

## Context

Design [14.2](2026-10-27-snapmark-online.md#142-key-libraries-versions-current-on-npm-on-2026-10-27) names Drizzle ORM 0.45. On 2026-10-28, 0.45.4 is current and 1.0 is at rc.5. Better Auth's peer range accepts both. Design 14.2 names no Postgres driver.

## Decision

- Pin `drizzle-orm` 0.45.4 and `drizzle-kit` 0.31.11 exactly.
- Use `postgres` 3.4.9 as the driver.
- Moving to Drizzle 1.0 is its own change, after 1.0 is final.

## Rejected

- Starting on the 1.0 release candidate: an rc can still change, under a schema that every milestone builds on.
- `pg` 8.23.1 as the driver: it works equally well; `postgres` is Claude's call.

## Consequences

- Dependabot leaves Drizzle 1.x alone until that change.
- The 1.0 move later gets its own plan and tests, not a surprise mid-release.

## Milestones

- [online-release-1](../../changes/2026-10-27-online-release-1/milestone.md): M1 (database).
- Refines design [14.2](2026-10-27-snapmark-online.md#142-key-libraries-versions-current-on-npm-on-2026-10-27).
