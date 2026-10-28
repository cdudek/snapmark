---
id: 2026-10-28-adr-immutable-captures-mutable-marks
title: 'Captures never change; marks live beside them in capture_marks with a revision'
type: adr
status: proposed
created: 2026-10-28
supersedes: []
superseded_by: []
amended_by: []
tags: [online, data-model, sync, annotations]
---

# Captures never change; marks live beside them in capture_marks with a revision

## Context

Design [3](2026-10-27-snapmark-online.md#3-concepts-and-glossary) says a capture never changes. The Mac app lets people edit marks after capture, and those edits sync. Design [8.2](2026-10-27-snapmark-online.md#82-data-model-postgres) has no place for marks that change. Today the Mac app's marks are untyped (`items: unknown[]`), and the web view, the extension and Mac sync all read them.

## Decision

- **`captures` is immutable:** storage key, size, width, height, `sha256`, state, anchor and version stamp.
- **`capture_marks`:** one row per capture with marks `jsonb`, `schemaVersion` and `revision`. It changes and syncs.
- **Feedback from a reference** keeps `capture_id` and `reference_number`.
- **One schema:** the marks schema and renderer live in `snapmark-kit` from M1. The Mac app reads and writes marks through it in M1, loaded through esbuild as `md-notes.ts` already is.
- **Validation:** marks are checked against the kit schema, with no external image references (S7).

## Rejected

- Marks inside the immutable capture row: an edit would need a new capture, against design 3.
- Marks baked into the pixels: design [8.3](2026-10-27-snapmark-online.md#83-files) keeps drawings as data.
- Leaving the marks format for M3: M2, M3 and M7 would drift from each other.

## Consequences

- Image objects in storage are written once and never rewritten.
- The web app and the extension draw marks over the image with the kit renderer.
- Mac sync sends marks edits as `marks.set` ops against `capture_marks`, never against the capture.

## Milestones

- [online-release-1](../../changes/2026-10-27-online-release-1/milestone.md): M1 (schema, kit marks, Mac app on the kit), M2, M3 and M7.
- Refines design [3](2026-10-27-snapmark-online.md#3-concepts-and-glossary), [8.2](2026-10-27-snapmark-online.md#82-data-model-postgres) and [8.3](2026-10-27-snapmark-online.md#83-files).
