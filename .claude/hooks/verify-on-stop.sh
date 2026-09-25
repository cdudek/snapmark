#!/usr/bin/env bash
# Stop hook: "done" means verify passed. If the session is about to stop with uncommitted
# source changes (sdlc.json `verifyDirty` globs), run exactly what CI runs (`verify`);
# on failure, block the stop and hand the tail back to Claude so it fixes the code
# before reporting.
#
# Cheap by construction: nothing dirty -> exit 0 in well under a second. Honours
# stop_hook_active so a failing verify can never loop the session forever.
set -uo pipefail
set -f # verifyDirty globs go to git as patterns, never expanded against cwd
. "$(dirname "$0")/sdlc-config.sh"

payload=$(cat)
[ "$(sdlc_field "$payload" stop_hook_active)" = "true" ] && exit 0

cd "$SDLC_ROOT" || exit 0
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || exit 0
verify=$(sdlc_get 'cfg["verify"]') || exit 0
globs=$(sdlc_get '" ".join(cfg["verifyDirty"])') || exit 0

dirty=""
for g in $globs; do
  dirty=$(git status --porcelain -- "$g" 2>/dev/null | head -1)
  [ -n "$dirty" ] && break
done
[ -z "$dirty" ] && exit 0

out=$(eval "$verify" 2>&1) && exit 0
{
  echo "verify FAILED (\`$verify\`) with uncommitted source changes -- fix the code, not the test, then stop again:"
  printf '%s\n' "$out" | tail -40
} >&2
exit 2
