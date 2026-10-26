#!/bin/sh
# npm run smoke:background (macOS): runs the smoke test and stops it the moment Snapmark (Electron, in dev) becomes
# the frontmost app, so the owner can keep working in another app while agents run it. Polls every 200 ms.
front() { osascript -e 'tell application "System Events" to get name of first application process whose frontmost is true'; }
log=$(mktemp)
echo "smoke:background: frontmost at start: $(front)"
npm run smoke >"$log" 2>&1 &
pid=$!
while kill -0 "$pid" 2>/dev/null; do
  case "$(front)" in
    Electron | Snapmark)
      pkill -f 'dist/test/smoke.js'
      echo "smoke:background: FAILED, Snapmark took the front"
      exit 1
      ;;
  esac
  sleep 0.2
done
grep -E '^(✗|smoke:)' "$log"
# Judged by the smoke test's own verdict: on macOS the electron launcher can report SIGTERM after app.exit.
grep -q '^smoke: ok' "$log" && echo "smoke:background: ok, Snapmark never took the front"
