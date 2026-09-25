#!/usr/bin/env bash
# PreToolUse hook on Edit|Write: the chain's gates, enforced where they can still change
# the outcome -- before the write, never as a test after the work is done.
#
# Until this existed, exactly one gate in the chain was wired to something the harness
# fires: PermissionRequest on ExitPlanMode, which hands plan.md to plannotator. The ticket
# decision, the intent interview, the facts review and the /goal handover were sentences in
# SKILL.md, and a skipped one left no trace anywhere -- not in the folder, not in the PR,
# not in the guardrail test, which reads `status` only from plan.md. Three of the four
# decisions in a change were the agent's, silently.
#
# Four refusals, in the order a change meets them:
#
#   1. anything under <changesDir>/<id>/  -- needs decisions.json (the step-0.5 dialog)
#   2. facts.md                           -- needs the intent interview, or a recorded skip
#   3. plan.md                            -- needs facts.md at `status: approved`
#   4. any path outside changes/ + docs/  -- needs an approved plan with a filled handover
#
# Rule 4 fires ONLY when the checked-out branch has a change folder. No folder, no opinion:
# a quick fix, a repo mid-adoption and the chain's own "never stop because there is no
# ticket" rule all keep working. Exit 2 blocks the call and sends stderr to Claude, which
# then tells the user the route. A block explains itself (playbook rule).
set -uo pipefail
. "$(dirname "$0")/sdlc-config.sh"

payload=$(cat)
file=$(sdlc_field "$payload" file_path)
[ -n "$file" ] || exit 0
changes=$(sdlc_get 'cfg["changesDir"]') || changes="changes"
designs=$(sdlc_get 'cfg["designsDir"]') || designs="docs/designs"
docs=$(sdlc_get 'cfg["docs"]') || docs="docs/sdlc.md"

case "$file" in /*) rel=${file#"$SDLC_ROOT"/} ;; *) rel=$file ;; esac
case "$rel" in /*) exit 0 ;; esac   # outside the repo entirely -- not ours to police

deny() {
  printf 'BLOCKED: %s\n(%s)\n' "$1" "$docs" >&2
  exit 2
}

# The value of one frontmatter key, or "" when the file or the key is missing.
fm() { [ -f "$1" ] && sed -n "s/^$2: *//p" "$1" | head -1; }

# Non-blank body of a `## <heading>` section, stopping at the next `## `.
section() {
  [ -f "$1" ] || return 0
  awk -v want="## $2" '
    $0 == want { inside = 1; next }
    inside && /^## / { exit }
    inside && NF { print }
  ' "$1"
}

# --- inside a change folder -----------------------------------------------------------
case "$rel" in
  "$changes"/archive/*) exit 0 ;;   # history is evidence, never a target
  "$changes"/*/*)
    id=${rel#"$changes"/}
    id=${id%%/*}
    dir="$SDLC_ROOT/$changes/$id"
    base=${rel##*/}

    # decisions.json is the dialog's own output, so it can never require itself.
    [ "$base" = "decisions.json" ] && exit 0
    [ -f "$dir/decisions.json" ] || deny "the step-0.5 dialog has not run for $id. Ask the three forks with AskUserQuestion -- ticket (search Linear first), intent, design -- and write the answers to $changes/$id/decisions.json before anything else in the folder."

    case "$base" in
      facts.md)
        intent=$(python3 -c 'import json,sys; print(json.load(open(sys.argv[1])).get("intent",""))' "$dir/decisions.json" 2>/dev/null || true)
        case "$intent" in
          skip*) ;;   # "skip -- the ticket states it": a recorded decision, not a silence
          "") deny "decisions.json for $id records no intent decision. It is either a skip with its reason, or an interview." ;;
          *) [ -f "$dir/interview-result.json" ] || deny "the intent interview has not run for $id. plannotator setup-goal interview $changes/$id/interview.json --json | tee $changes/$id/interview-result.json" ;;
        esac
        ;;
      plan.md)
        [ -f "$dir/facts.md" ] || deny "$changes/$id/facts.md does not exist yet. Facts come before a plan -- a plan against unreviewed facts is a plan against a guess."
        [ "$(fm "$dir/facts.md" status)" = "approved" ] || deny "$changes/$id/facts.md is not approved. Take it through plannotator setup-goal facts, then set status: approved. A draft fact sheet has never been reviewed by anyone."
        ;;
    esac
    exit 0
    ;;
esac

# --- outside a change folder ----------------------------------------------------------
# Documents are how the chain gets written in the first place, so they are never gated.
case "$rel" in
  docs/*|"$designs"/*|.claude/*|*.md) exit 0 ;;
esac

# symbolic-ref, not rev-parse: on a repo whose first commit is not made yet HEAD is
# unborn, rev-parse fails, and the gate would quietly open on exactly the repo most
# likely to be mid-adoption.
branch=$(git -C "$SDLC_ROOT" symbolic-ref --short -q HEAD 2>/dev/null) \
  || branch=$(git -C "$SDLC_ROOT" rev-parse --abbrev-ref HEAD 2>/dev/null) || exit 0
[ -n "$branch" ] || exit 0

# The change for this branch, by slug -- the same match status.sh --current uses.
for d in "$SDLC_ROOT/$changes"/*/; do
  [ -d "$d" ] || continue
  id=$(basename "$d")
  [ "$id" = "archive" ] && continue
  slug=${id#????-??-??-}
  case "$slug" in [A-Z]*-[0-9]*-*) slug=${slug#*-*-} ;; esac
  case "$branch" in *"$slug"*) ;; *) continue ;; esac

  [ -f "$d/plan.md" ] || deny "$changes/$id has no plan.md, and this branch is its branch. Write the plan and gate it: plannotator annotate $changes/$id/plan.md --gate"
  [ "$(fm "$d/plan.md" status)" = "approved" ] || deny "$changes/$id/plan.md is not approved. Gate it before you write code: plannotator annotate $changes/$id/plan.md --gate"
  [ -n "$(section "$d/plan.md" "Goal handover")" ] || deny "$changes/$id/plan.md has an empty ## Goal handover. Write the /goal there before building, or 'none -- <why>' when the artifact is the diff itself."
  exit 0
done
exit 0
