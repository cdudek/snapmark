---
linear: none
type: plan
change: 2026-09-25-adopt-sdlc
design: null
author: calvindudek@googlemail.com
status: draft
reviewed_by: null
approved_at: null
created: 2026-09-25
---

# Plan: Adopt the AI-native SDLC in kingfish

> One sentence. What this change does.

A person with no context builds from this file alone. [intent](intent.md) and
[facts](facts.md) are for the gate, not for the build.

## Approach

- **What changes:** <one sentence>
- **What stays the same:** <one sentence>
- **Why this way:** <one sentence>
- **Rejected:** <option> — <why not, one clause>

## Design changes

<Which sections of `design:` this change edits, or "none". Edit them in the same PR.>

## Files that change

| File   | Change     |
| ------ | ---------- |
| `path` | <one line> |

## Order of work

Each step has a proof. The proof is a command, a file, or a fact.

- [ ] 1. <step> — proof: `<command>` exits 0
- [ ] 2. <step> — proof: `<file>` exists
- [ ] 3. <step> — proof: F<n> passes

## Risks

| Risk               | What we do   | Where it lands                          |
| ------------------ | ------------ | --------------------------------------- |
| <what could break> | <the action> | <step number, test name, or "accepted"> |

## Out of scope

- <what this change does not do, on purpose>

## Done

The `/goal` condition. Every line is something the transcript can show.

- `npm run format && npm run lint && npm run typecheck && npm test` exits 0.
- <file> exists / contains `<string>`.
- F1 to F<n> pass by their named check.
- Nothing outside `## Files that change` is edited.
- Stop and report as soon as a step cannot proceed. Never work around a blocker.
- Stop after 40 turns if not met. Report what is missing.

## Goal handover

The `/goal` given to the user at step 6, verbatim, so the handover is committed
rather than living in one chat message. Fill it when the gate returns approved.

The guardrail test fails an approved plan whose section is empty. Write `none —
<why>` rather than leaving it blank: an empty section is a skip, a section that
names itself empty is a decision. The usual reason is a document-shaped change,
where the artifact is this PR's diff and there was never a build to hand over.

```
/goal Build 2026-09-25-adopt-sdlc/plan.md in its order of work; every outcome in facts.md
must hold; tick tasks as they land; log departures under ## Revisions.

Done:
<the Done section above, verbatim>
```

## Revisions

Only after approval. One line per change: `YYYY-MM-DD — what changed, and why`.
