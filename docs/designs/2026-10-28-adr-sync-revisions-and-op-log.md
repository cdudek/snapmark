---
id: 2026-10-28-adr-sync-revisions-and-op-log
title: 'Mac sync: server revisions, an idempotent operation log, last write wins with edited elsewhere'
type: adr
status: proposed
created: 2026-10-28
supersedes: []
superseded_by: []
amended_by: []
tags: [online, mac, sync, data-model]
---

# Mac sync: server revisions, an idempotent operation log, last write wins with edited elsewhere

## Context

Design [7](2026-10-27-snapmark-online.md#7-clients-and-where-code-context-comes-from) sets the rules for two-way Mac sync: the server is the source of truth, an offline operation log, revisions, last write wins with "edited elsewhere", 30-day tombstones. It leaves the mechanics to Claude. Design [8.2](2026-10-27-snapmark-online.md#82-data-model-postgres) also names `sessions` twice, once for sign-in and once for Mac sessions; Better Auth owns `session`.

## Decision

- **Table name:** online Mac sessions are `shared_sessions` (workspace, local_id, title, linked_device_id, revision, last_synced_at, stopped_reason).
- **Identity:** `local_id` is a UUID in the folder's `meta.json`, never the folder name, which the owner can rename.
- **Rows:** every synced row (feedback, thread entries, capture marks) has `revision bigint` and `deleted_at`.
- **Push:** `POST /sessions/{id}/ops` takes ops `{ opId, baseRevision, type, entityId, fields }`. `sync_operations.client_op_id` is unique per device, so a replayed log applies once. Each op returns applied, conflict or rejected.
- **Pull:** `GET /sessions/{id}/changes?since=<rev>` returns changes and tombstones, paged by revision.
- **Conflicts:** the last write to a field wins. The overwritten text becomes an `edited_elsewhere` thread entry.
- **Access:** each op is checked against the person's current access. A refusal becomes "Sync Stopped".
- **Deletes:** tombstones live 30 days, then a clean-up purges them.
- **Mac side:** merge logic is pure and tested in Node. Files and folders are named from ids, never from synced titles.

## Rejected

- CRDTs: more than release 1 needs. The fields are short, and `edited_elsewhere` keeps every overwritten word.
- The folder name as identity: renaming the folder would fork the session.
- Replaying ops with the access the person had when offline: it would apply changes they can no longer make.

## Consequences

- Nothing typed is lost, but there is no character-level merge of two edits.
- Synced titles never become file paths, closing S18.

## Milestones

- [online-release-1](../../changes/2026-10-27-online-release-1/milestone.md): M1 (schema), M7 (sync).
- Refines design [7](2026-10-27-snapmark-online.md#7-clients-and-where-code-context-comes-from) (session sync) and [8.2](2026-10-27-snapmark-online.md#82-data-model-postgres).
