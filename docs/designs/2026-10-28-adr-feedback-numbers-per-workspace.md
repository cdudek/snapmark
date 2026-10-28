---
id: 2026-10-28-adr-feedback-numbers-per-workspace
title: 'Feedback numbers come from a counter on the workspace row'
type: adr
status: proposed
created: 2026-10-28
supersedes: []
superseded_by: []
amended_by: []
tags: [online, data-model]
---

# Feedback numbers come from a counter on the workspace row

## Context

Owner decision 31 gives every feedback a number per workspace, and its canonical URL is `/feedback/<n>`. Design [8.2](2026-10-27-snapmark-online.md#82-data-model-postgres) has no number column. Feedback arrives from the web app, the extension, MCP and Mac sync, so two items can be created in one workspace at the same moment.

## Decision

- `workspaces.next_feedback_number` holds the next number.
- The feedback insert transaction takes it with `UPDATE workspaces SET next_feedback_number = next_feedback_number + 1 … RETURNING`.
- `feedback (workspace_id, number)` is unique.
- Numbers are never reused. A deleted feedback keeps its number as a tombstone.
- Feedback is looked up by `(workspace_id, number)` only after the policy module's access check.

## Rejected

- A Postgres sequence per workspace: one schema object per workspace, created by DDL, and a rolled-back insert leaves a gap.
- Global numbers: they leak volume across organisations and do not match `/feedback/<n>` inside a workspace.
- `max(number) + 1`: two inserts at once get the same number.

## Consequences

- The row lock serialises feedback creation within one workspace. That is fine at release 1 volume.
- A rolled-back insert rolls the counter back too, so there are no gaps.

## Milestones

- [online-release-1](../../changes/2026-10-27-online-release-1/milestone.md): M1 (schema), M2 (web), M3 (`POST /feedback`), M4 and M7.
- Refines design [8.2](2026-10-27-snapmark-online.md#82-data-model-postgres).
