#!/bin/sh
# Prints the update files of every version except the newest $KEEP (default 5), one per line.
# Reads object names (gs:// URLs or plain names) on stdin, as `gcloud storage ls` prints them.
# Only names like Snapmark-<version>-<arch>.<ext> count; latest-mac.yml is never printed.
keep=${KEEP:-5}
names=$(cat)
old=$(printf '%s\n' "$names" | sed -n 's/.*Snapmark-\([0-9][0-9.]*\)-.*/\1/p' | sort -uV | awk -v k="$keep" '{ v[NR] = $0 } END { for (i = 1; i <= NR - k; i++) print v[i] }')
for v in $old; do
  printf '%s\n' "$names" | grep -F "Snapmark-$v-"
done
