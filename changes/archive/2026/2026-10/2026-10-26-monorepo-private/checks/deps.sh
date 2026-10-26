#!/bin/sh
# N1: every installed package keeps its version across the move into snapmark-app/.
# Usage: deps.sh snapshot   (writes deps-before.txt; run once on the old layout)
#        deps.sh            (compares the current tree with deps-before.txt)
set -e
here=$(cd "$(dirname "$0")" && pwd)
root=$(cd "$here/../../.." && pwd)
list() {
  (cd "$root" && npm ls --all --json 2>/dev/null) | python3 -c '
import json, sys
seen = set()
def walk(deps):
    for name, d in (deps or {}).items():
        # The workspace itself (snapmark-app, or the old root "snapmark") is not a dependency.
        if d.get("version") and not d.get("resolved", "").startswith("file:"):
            seen.add(name + "@" + d.get("version"))
        walk(d.get("dependencies"))
walk(json.load(sys.stdin).get("dependencies"))
print("\n".join(sorted(seen)))'
}
if [ "$1" = snapshot ]; then
  list > "$here/deps-before.txt"
  echo "N1 snapshot: $(wc -l < "$here/deps-before.txt") packages"
  exit 0
fi
list > "$here/deps-after.txt"
if diff -u "$here/deps-before.txt" "$here/deps-after.txt"; then
  echo "N1 PASS: $(wc -l < "$here/deps-after.txt") packages, no version moved"
  rm "$here/deps-after.txt"
else
  echo "N1 FAIL: versions differ (see the diff above)"
  exit 1
fi
