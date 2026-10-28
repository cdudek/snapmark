---
id: 2026-10-28-adr-live-updates-over-sse
title: 'Live updates: server-sent events per workspace over Postgres LISTEN/NOTIFY'
type: adr
status: proposed
created: 2026-10-28
supersedes: []
superseded_by: []
amended_by: []
tags: [online, web, live-updates]
---

# Live updates: server-sent events per workspace over Postgres LISTEN/NOTIFY

## Context

Design [8.4](2026-10-27-snapmark-online.md#84-live-updates) left live updates open and suggested server-sent events. Release 1 needs them for "v{n} was just posted", inbox counts and sync status. It runs on `next dev`; release 2 runs on Cloud Run.

## Decision

- One server-sent events stream per workspace, served by the web app.
- Postgres `LISTEN/NOTIFY` behind it. Feature server functions notify after their transaction commits.
- Events carry ids and kinds. The client fetches what it shows through the normal, policy-checked paths.
- The stream takes the access context from the policy module, like every route (S2).

## Rejected

- WebSockets: no presence or shared drawing is planned, and they are more to run.
- Polling only: updates arrive late and cost more requests.

## Consequences

- Works the same in `next dev` and on Cloud Run.
- Clients reconnect when a stream drops; `EventSource` does that on its own.
- WebSockets stay possible if presence or shared drawing comes.

## Milestones

- [online-release-1](../../changes/2026-10-27-online-release-1/milestone.md): M2 (web app), M7 (sync status).
- Closes the open question in design [8.4](2026-10-27-snapmark-online.md#84-live-updates).
