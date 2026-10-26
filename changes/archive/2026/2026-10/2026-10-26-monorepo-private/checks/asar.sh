#!/bin/sh
# F3: a packaged build from snapmark-app/ holds the same app.asar files as the v0.22.0 release, apart from package.json.
# F4: its app-update.yml reads updates from the bucket.
# Usage: asar.sh <folder for the downloaded v0.22.0 ZIP>   (needs `npm run dist`-style output in snapmark-app/release/)
set -e
root=$(cd "$(dirname "$0")/../../.." && pwd)
ref=${1:?folder for the v0.22.0 download}
mkdir -p "$ref"
[ -f "$ref/Snapmark-0.22.0-arm64.zip" ] || curl -sSLo "$ref/Snapmark-0.22.0-arm64.zip" \
  https://github.com/cdudek/snapmark/releases/download/v0.22.0/Snapmark-0.22.0-arm64.zip
[ -d "$ref/Snapmark.app" ] || ditto -x -k "$ref/Snapmark-0.22.0-arm64.zip" "$ref"
built="$root/snapmark-app/release/mac-arm64/Snapmark.app/Contents/Resources"
asar() { (cd "$root" && npx --no-install @electron/asar list "$1") | grep -v '^/package.json$' | sort; }
asar "$ref/Snapmark.app/Contents/Resources/app.asar" > "$ref/before.txt"
asar "$built/app.asar" > "$ref/after.txt"
if diff -u "$ref/before.txt" "$ref/after.txt"; then
  echo "F3 PASS: $(wc -l < "$ref/after.txt") files in app.asar, same as v0.22.0"
else
  echo "F3 FAIL: app.asar differs from v0.22.0 (see the diff above)"
  exit 1
fi
if grep -q 'provider: generic' "$built/app-update.yml" && grep -q 'storage.googleapis.com/snapmark-updates/mac' "$built/app-update.yml"; then
  echo "F4 PASS: $(tr '\n' ' ' < "$built/app-update.yml")"
else
  echo "F4 FAIL: app-update.yml is"; cat "$built/app-update.yml"; exit 1
fi
