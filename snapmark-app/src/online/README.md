# Mac localhost bridge

The app registers `com.heydiff.bridge` for the pinned Chrome extension
`pgiiilhkollimekpinhmfjllamhlpkhb`. The generated executable launches the compiled
`native-host.js` with this app's Electron binary in Node mode, in both packaged
and source runs. It never launches the GUI. Native messaging stdout contains only
length-prefixed JSON; a missing app answers `not_running`.

Until `heydiff-kit/packages/contracts` provides a bridge schema, `contract.ts`
defines the local v1 wire contract. A persistent native messaging connection
accepts `{ "type": "resolve", "port": 3000 }` and returns one reply per request,
in order (no request id). Replies have these shapes:

- `{ status: 'ok', folder, repo, worktree, branch, commit, uncommitted }`.
  `folder` is the listener's cwd, `repo` is its origin URL (without HTTP credentials,
  falling back to the main checkout path), `worktree` is the checkout root.
  Detached branches and unborn commits are `null`.
- `{ status: 'no_repo', folder }`, with `folder: null` if the port cannot be
  attributed to exactly one serving folder.
- `{ status: 'off' }`, `{ status: 'not_running' }`, or `{ status: 'error' }`.

The shim relays the same Chrome framing (4-byte little-endian length, UTF-8 JSON)
over `/tmp/heydiff-<uid>/bridge.sock`, in a mode-0700 directory with a mode-0600
socket. There is no HTTP bridge, and sign-in is not required. A stale socket is
removed only after a refused connection; an active app's socket is preserved.

Tests: build, then `node --test snapmark-app/dist/test/bridge.test.js` from the
repo root. Socket integration tests report a skip if the execution sandbox denies
listeners with `EPERM`; they run normally outside that sandbox.
