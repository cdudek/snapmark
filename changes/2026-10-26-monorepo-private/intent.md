---
linear: none
type: intent
change: 2026-10-26-monorepo-private
design: null
author: Claude (orchestrator)
status: approved
reviewed_by: Calvin Dudek
approved_at: 2026-10-26
created: 2026-10-26
---

# Intent: one private repo for the app, the Chrome extension and the website, with updates that keep working

> Snapmark's code lives in one private repo, with the Mac app in `snapmark-app/` beside `snapmark-chrome/` and `snapmark-web/`, and every installed copy still finds and installs new versions.

## Asks

Every request that this change answers, in the asker's own words. Never paraphrased.

| #   | Date       | Source                                                     | Words                                                                                                                                                     | Screen | Resources |
| --- | ---------- | ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | --------- |
| A1  | 2026-10-26 | owner, chat                                                | "can we change this to a monorepo, that is not public. / /snapmark-app/<current-project> /snapmark-chrome /snapmark-web"                                  | none   | none      |
| A2  | 2026-10-26 | owner, chat, after hearing that private breaks auto-update | "ok lets do that then https://console.cloud.google.com/storage/overview;tab=overview?project=snapmark-ai cloud storage. what will be the expected costs?" | none   | none      |
| A3  | 2026-10-26 | owner, 1.1 dialog                                          | "New bead (Recommended)", "none (Recommended)", "chore (Recommended)", "Milestone of one (Recommended)"                                                   | none   | none      |

## Job stories

Drafted by the agent from the asks; the engineer confirms them. Label every story with its evidence: **observed** (seen in data or a session), **reported** (someone said it), or **assumed** (nobody has seen it yet).

| #   | When …                                                   | I want to …                                                    | So I can …                                                    | Evidence     |
| --- | -------------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------- | ------------ |
| J1  | I start the Chrome extension and the website             | keep them in one repo beside the Mac app, not public           | share code and changes across the three without exposing them | reported, A1 |
| J2  | a new Snapmark version ships after the repo went private | have every installed copy find and install it as it does today | not reinstall by hand on any Mac                              | reported, A2 |
| J3  | Snapmark has more users                                  | know what update downloads cost and keep that cost small       | price the app without surprises                               | reported, A2 |

## Success measure

How we know after release that it worked. One number, where it is read, and the target.

- **Measure:** the owner's Snapmark updates itself to the first version released after the repo went private. **Read in:** Snapmark ▸ About and the bucket's object list. **Target:** within one day, on both of the owner's Macs.

## Problem

- **What is wrong or missing:** the repo is public only so that auto-update can read its releases. The Chrome extension and the website have no home yet.
- **Who feels it:** the owner, and anyone with Snapmark installed once the repo goes private.
- **Evidence:** `package.json` `build.publish` names GitHub releases of `cdudek/snapmark`. The project memory says the repo went public on 2026-09-26 "so auto-update can read releases".

## Proposed outcome

What is true when this is done. Write it in the user's words. Do not say how.

- The Mac app's code sits in `snapmark-app/`; `snapmark-chrome/` and `snapmark-web/` exist beside it.
- Nobody outside can read the code.
- Installed copies keep updating themselves, from Snapmark's own cloud storage.
- The owner knows the expected monthly cost.

## Affected users and systems

| Kind    | Name                                   | How                                                                 |
| ------- | -------------------------------------- | ------------------------------------------------------------------- |
| users   | everyone with Snapmark installed       | updates come from a new address; nothing changes on screen          |
| service | GitHub repo `cdudek/snapmark`          | becomes private; files move under `snapmark-app/`                   |
| service | GitHub Actions `ci.yml`, `release.yml` | run inside `snapmark-app/`; the release uploads to the bucket       |
| service | GCP project `snapmark-ai`              | gains a public-read bucket for update files and a key-free CI login |
| data    | releases                               | new versions live in the bucket; the last 5 are kept                |

## Constraints

- **Must not change:** the app's behaviour, bundle id and Developer ID signature. A new signature costs a new Screen Recording grant. Versions and `v<x.y.z>` tags still come from semantic-release.
- **Deadline:** none.
- **Rules that apply:** never commit `.env` files; never hardcode credentials. Prefer WIF over service account keys. Release per milestone. Dependency changes are Ask-tier (`sdlc.json` `blocked`).

## Open questions

Only questions the originator must answer. Everything else is inferred.

1. Is the GitHub account on Pro? Answered 2026-10-26: "Already on Pro".
