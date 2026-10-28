---
id: 2026-10-28-adr-two-step-signed-uploads
title: 'Captures upload in two steps: a signed PUT, then complete with a server check and re-encode'
type: adr
status: proposed
created: 2026-10-28
supersedes: []
superseded_by: []
amended_by: []
tags: [online, storage, security]
---

# Captures upload in two steps: a signed PUT, then complete with a server check and re-encode

## Context

Design [8.3](2026-10-27-snapmark-online.md#83-files) stores captures as WebP in a private Cloud Storage bucket with signed URLs, plus a 400 px thumbnail. In release 1 the bucket is real, while everything else runs locally. The tech review (S14, S15) found that the design does not say who picks the object key, how large an upload may be, or whether the server trusts the bytes.

## Decision

- **Start:** `POST /captures` returns a signed PUT. The server sets the key, `<org>/<ws>/<captureId>.webp`. The URL is signed with the content type and `x-goog-content-length-range` (at most 10 MB) and lives 5 minutes.
- **Upload:** the client PUTs straight to Cloud Storage. The Mac app converts PNG to WebP in the main process first.
- **Complete:** `POST /captures/{id}/complete` checks size, magic bytes (raster only, no SVG) and `sha256`, re-encodes with `sharp`, makes the thumbnail, and sets `state = ready`.
- **Read:** `GET /captures/{id}/image` answers `302` to a signed GET that lives 15 minutes. It is signed per call, never stored or logged.
- **Signing:** through an impersonated signer service account via gcloud ADC. No key file.
- **Bucket:** uniform access, public access prevention, CORS only for the app and extension origins. Dev objects are deleted after 90 days.

## Rejected

- Uploading through the Next server: every byte through the app, with body limits and memory on Cloud Run later.
- Trusting the client's bytes: polyglot files and wrong types would reach people's browsers.
- A service-account key file on disk: a secret to leak.

## Consequences

- New packages `@google-cloud/storage` and `sharp`.
- The thumbnail runs as an inline job in release 1, through the jobs provider.

## Milestones

- [online-release-1](../../changes/2026-10-27-online-release-1/milestone.md): M1 (bucket, storage provider), M3 (extension), M7 (Mac).
- Refines design [8.3](2026-10-27-snapmark-online.md#83-files).
