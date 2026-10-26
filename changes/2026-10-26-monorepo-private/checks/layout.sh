#!/bin/sh
# F1: the app lives in snapmark-app/, beside snapmark-chrome/ and snapmark-web/ with a README each,
# and nothing of the app is left at the root.
set -e
root=$(cd "$(dirname "$0")/../../.." && pwd)
cd "$root"
fail=0
for p in snapmark-app/src/main.ts snapmark-app/test/smoke.ts snapmark-app/assets/trayTemplate.png \
  snapmark-app/build snapmark-app/package.json snapmark-app/tsconfig.json snapmark-app/eslint.config.mjs \
  snapmark-app/scripts/after-pack.cjs snapmark-app/scripts/prune-releases.sh snapmark-app/README.md \
  snapmark-chrome/README.md snapmark-web/README.md package.json package-lock.json; do
  [ -e "$p" ] || { echo "F1 FAIL: missing $p"; fail=1; }
done
for p in src test assets build tsconfig.json eslint.config.mjs scripts/after-pack.cjs; do
  [ ! -e "$p" ] || { echo "F1 FAIL: $p is still at the root"; fail=1; }
done
grep -q '"workspaces"' package.json || { echo "F1 FAIL: the root package.json has no workspaces"; fail=1; }
[ "$fail" = 0 ] && echo "F1 PASS: the app is in snapmark-app/, chrome and web have their READMEs"
exit "$fail"
