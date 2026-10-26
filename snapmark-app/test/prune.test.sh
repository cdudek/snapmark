#!/bin/sh
# F7: with 12 versions in the bucket, prune-releases.sh names the files of the oldest 2 and nothing else.
set -e
cd "$(dirname "$0")/.."
b=gs://snapmark-updates/mac
names=""
for v in 0.9.1 0.10.0 0.21.1 0.22.0 0.22.1 0.22.2 0.23.0 0.23.1 0.24.0 0.25.0 0.25.1 1.0.0; do
  for f in arm64.zip arm64.zip.blockmap arm64.dmg arm64.dmg.blockmap x64.zip x64.zip.blockmap x64.dmg x64.dmg.blockmap; do
    names="$names$b/Snapmark-$v-$f
"
  done
done
names="$names$b/latest-mac.yml"
got=$(printf '%s\n' "$names" | sh scripts/prune-releases.sh)
want=$(printf '%s\n' "$names" | grep -E 'Snapmark-(0\.9\.1|0\.10\.0)-')
if [ "$got" != "$want" ]; then
  echo "prune.test: expected the 16 files of 0.9.1 and 0.10.0 (newest 10 kept), got:" >&2
  printf '%s\n' "$got" >&2
  exit 1
fi
[ -z "$(printf '%s\n' "$names" | KEEP=12 sh scripts/prune-releases.sh)" ] || { echo "prune.test: KEEP=12 must delete nothing" >&2; exit 1; }
echo "prune.test: ok"
