---
id: 2026-10-28-adr-pinned-extension-id
title: 'The extension id is pinned with the manifest key from the first commit'
type: adr
status: proposed
created: 2026-10-28
supersedes: []
superseded_by: []
amended_by: []
tags: [online, extension, auth, bridge]
---

# The extension id is pinned with the manifest key from the first commit

## Context

Release 1 loads the extension unpacked (design [13](2026-10-27-snapmark-online.md#13-hosting-and-deploys)). An unpacked extension's id comes from its folder path, so it differs per checkout and per machine. Three things need one fixed id:

- the native messaging host's `allowed_origins`;
- the OAuth redirect of `chrome.identity.launchWebAuthFlow`;
- the REST API's CORS allow-list, `chrome-extension://<id>`.

## Decision

- Generate one key pair. The public key goes in the manifest `key` through the WXT config, in the first commit of `snapmark-chrome`.
- The private key is never committed.
- The id that key gives is written once into the host manifest, the extension's registered redirect and the CORS allow-list.

## Rejected

- A folder-derived id: it changes per checkout and breaks the host allow-list and the OAuth redirect.
- Wildcards in the allow-lists: any extension could then talk to the bridge and the API.

## Consequences

- Every checkout on every machine has the same id, so sign-in and the bridge work the first time.
- When the extension goes to the Chrome Web Store (release 2), the listing keeps this id, or the three allow-lists move once.

## Milestones

- [online-release-1](../../changes/2026-10-27-online-release-1/milestone.md): M1 (WXT scaffold), M3 (sign-in, CORS), M5 (host manifest).
- Refines design [7](2026-10-27-snapmark-online.md#7-clients-and-where-code-context-comes-from) and [8.1](2026-10-27-snapmark-online.md#81-repo-layout).
