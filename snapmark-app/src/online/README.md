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

## Browser sign-in

The Online tab uses a public OAuth client, PKCE S256 and a random state value.
Only the ephemeral `127.0.0.1` callback is served over HTTP. It checks the exact
Host, path, method and state; callbacks are consumed once. Cancel, timeout and
quit close the listener. Sign-in expires after 15 minutes (interaction.md and
S152 supersede the screen file's older 10-minute line).

Until a shared Mac OAuth client configuration is published, the defaults are:

- Service: `https://www.heydiff.com`; public client id: `heydiff-mac`.
- Metadata: `/.well-known/oauth-authorization-server`; issuer and all endpoints
  must be HTTPS on the service origin.
- Scopes: `openid email offline_access`; resource: `https://www.heydiff.com/api/v1`.
- Account email: the metadata's userinfo endpoint, falling back to
  `/api/auth/oauth2/userinfo`.
- Redirect: `http://127.0.0.1:<ephemeral-port>/callback`. The provider needs to
  register this loopback redirect for the public client, allowing dynamic ports.

These values are constructor arguments in `OAuthClient` for integration with the
provider. No client secret is needed. Credentials are main-process-only, encrypted
with Electron `safeStorage` in `userData/online/session.enc` (tech review S15),
and removed on Sign Out. An expired saved session refreshes on launch; a refused
refresh returns to signed out. If encryption is unavailable, the current session
stays in memory and no plaintext fallback is written. The app keeps
`com.cdudek.snapmark` and its local workflows; there is no custom URL scheme.

Focused sign-in and Settings tests: after building, run
`node --test snapmark-app/dist/test/online.test.js snapmark-app/dist/test/online-settings.test.js`.
`test/smoke.ts` also contains the real-window Online checks for the milestone's
E2E run, alongside the existing local workflow checks.
