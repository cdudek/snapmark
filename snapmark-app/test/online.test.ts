import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createHash } from 'node:crypto';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { OnlineSignIn, OnlineSession, SignInDependencies, SignInError } from '../src/online/sign-in';
import { CallbackRequest, CallbackResponse, listenLoopback } from '../src/online/loopback';
import { OAuthClient } from '../src/online/oauth-client';
import { TokenVault } from '../src/online/token-vault';
import { onlineCopy, bridgeStatus } from '../src/online/copy';

const tag = '@2026-10-27-online-release-1';
const session: OnlineSession = {
  accessToken: 'private-access-token',
  refreshToken: 'private-refresh-token',
  email: 'member@example.invalid',
  expiresAt: Date.now() + 600000,
};
const tick = () => new Promise<void>((resolve) => setImmediate(resolve));
function harness(overrides: Partial<SignInDependencies> = {}, lifetime = 15 * 60 * 1000) {
  let receive!: (request: CallbackRequest) => Promise<CallbackResponse>;
  let closed = 0;
  const opened: string[] = [];
  const saved: OnlineSession[] = [];
  const exchanges: { code: string; verifier: string; redirectUri: string; signal: AbortSignal }[] = [];
  const auth = new OnlineSignIn(
    {
      listen: async (callback) => {
        receive = callback;
        return {
          redirectUri: 'http://127.0.0.1:49152/callback',
          close: () => {
            closed++;
          },
        };
      },
      authorize: async (params) => {
        const url = new URL('https://www.heydiff.com/authorize');
        for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
        return url.toString();
      },
      exchange: async (params) => {
        exchanges.push(params);
        return { ...session };
      },
      openBrowser: async (url) => {
        opened.push(url);
      },
      store: {
        load: async () => null,
        save: async (value) => {
          saved.push(value);
        },
        clear: async () => {},
      },
      changed: () => {},
      foreground: () => {},
      ...overrides,
    },
    lifetime,
  );
  return {
    auth,
    opened,
    saved,
    exchanges,
    closed: () => closed,
    callback: (query: string, extra: Partial<CallbackRequest> = {}) =>
      receive({ method: 'GET', host: '127.0.0.1:49152', url: `/callback?${query}`, ...extra }),
  };
}

test(`PKCE S256 loopback sign-in opens the browser and keeps tokens out of Settings @F129 ${tag}`, async () => {
  let foreground = 0;
  const h = harness({
    foreground: () => {
      foreground++;
    },
  });
  try {
    await h.auth.start();
    assert.equal(h.auth.view.status, 'waiting');
    assert.equal(h.auth.view.message, 'Finish signing in in your browser.');
    const url = new URL(h.opened[0]);
    assert.equal(url.searchParams.get('code_challenge_method'), 'S256');
    assert.equal(url.searchParams.get('redirect_uri'), 'http://127.0.0.1:49152/callback');
    assert.ok(url.searchParams.get('state')!.length >= 32);
    assert.equal(url.searchParams.has('code_verifier'), false);
    await h.auth.openBrowser();
    assert.equal(h.opened[0], h.opened[1]);
    const response = await h.callback(`state=${url.searchParams.get('state')}&code=one-use-code`);
    assert.equal(response.status, 200);
    assert.equal(response.body, 'HeyDiff is connected. You can close this tab.');
    assert.equal(h.exchanges[0].code, 'one-use-code');
    assert.equal(createHash('sha256').update(h.exchanges[0].verifier).digest('base64url'), url.searchParams.get('code_challenge'));
    assert.equal(h.auth.view.status, 'signed_in');
    assert.equal(h.auth.view.message, 'Signed in as member@example.invalid');
    assert.equal(JSON.stringify(h.auth.view).includes('token'), false);
    assert.deepEqual(h.saved, [session]);
    assert.equal(foreground, 1);
    assert.equal(h.closed(), 1);
    assert.equal((await h.callback(`state=${url.searchParams.get('state')}&code=one-use-code`)).status, 400);
    await h.auth.signOut();
    assert.equal(h.auth.view.status, 'signed_out');
  } finally {
    h.auth.dispose();
  }
});

test(`loopback rejects wrong state, Host, method and path without consuming the flow @F129 ${tag}`, async () => {
  const h = harness();
  try {
    await h.auth.start();
    for (const extra of [{}, { host: 'attacker.invalid' }, { method: 'POST' }, { url: '/other?state=bad&code=bad' }])
      assert.equal((await h.callback('state=bad&code=bad', extra)).status, 400);
    assert.equal(h.auth.view.status, 'waiting');
    assert.equal(h.exchanges.length, 0);
  } finally {
    h.auth.dispose();
  }
});

test(`expired, locally cancelled and browser denied sign-in offer Sign In again @F130 ${tag}`, async () => {
  const expired = harness({}, 10);
  await expired.auth.start();
  await new Promise((resolve) => setTimeout(resolve, 25));
  assert.equal(expired.auth.view.status, 'error');
  assert.equal(expired.auth.view.message, 'Sign-in expired. Sign in again.');
  assert.equal(expired.closed(), 1);
  expired.auth.dispose();
  const cancelled = harness();
  try {
    await cancelled.auth.start();
    const before = new URL(cancelled.opened[0]).searchParams.get('state');
    cancelled.auth.cancel();
    assert.equal(cancelled.auth.view.message, 'Sign-in was cancelled.');
    assert.equal(cancelled.closed(), 1);
    await cancelled.auth.start();
    const state = new URL(cancelled.opened.at(-1)!).searchParams.get('state');
    assert.notEqual(before, state);
    const result = await cancelled.callback(`state=${state}&error=access_denied`);
    assert.equal(result.body, 'HeyDiff was not connected. You can close this tab.');
    assert.equal(cancelled.auth.view.message, 'Sign-in was cancelled.');
    assert.equal(cancelled.exchanges.length, 0);
  } finally {
    cancelled.auth.dispose();
  }
});

test(`cancellation during token exchange discards the late token and closes the listener @F129 @F130 ${tag}`, async () => {
  let complete!: (session: OnlineSession) => void;
  const h = harness({
    exchange: () =>
      new Promise((resolve) => {
        complete = resolve;
      }),
  });
  try {
    await h.auth.start();
    const pending = h.callback(`state=${new URL(h.opened[0]).searchParams.get('state')}&code=code`);
    await tick();
    h.auth.cancel();
    complete(session);
    await pending;
    assert.deepEqual(h.saved, []);
    assert.equal(h.auth.view.message, 'Sign-in was cancelled.');
  } finally {
    h.auth.dispose();
  }
});

test(`cancel while the listener starts closes it when ready and never opens the browser @F130 ${tag}`, async () => {
  let ready!: (listener: Awaited<ReturnType<typeof listenLoopback>>) => void;
  let closed = false;
  const h = harness({
    listen: () =>
      new Promise((resolve) => {
        ready = resolve;
      }),
  });
  const starting = h.auth.start();
  h.auth.cancel();
  ready({
    redirectUri: 'http://127.0.0.1:49152/callback',
    close: () => {
      closed = true;
    },
  });
  await starting;
  assert.equal(closed, true);
  assert.equal(h.opened.length, 0);
  h.auth.dispose();
});

test(`OAuth discovers same-origin endpoints, exchanges PKCE by POST and reads the email with a bearer token @F129 ${tag}`, async () => {
  const requests: { url: string; init?: RequestInit }[] = [];
  const client = new OAuthClient('https://www.heydiff.com', 'heydiff-mac', async (url, init) => {
    requests.push({ url: String(url), init });
    if (String(url).includes('.well-known'))
      return Response.json({
        issuer: 'https://www.heydiff.com/api/auth',
        authorization_endpoint: 'https://www.heydiff.com/oauth/authorize',
        token_endpoint: 'https://www.heydiff.com/oauth/token',
        userinfo_endpoint: 'https://www.heydiff.com/oauth/userinfo',
      });
    if (String(url).endsWith('/token'))
      return Response.json({
        access_token: session.accessToken,
        refresh_token: session.refreshToken,
        token_type: 'Bearer',
        expires_in: 600,
      });
    return Response.json({ email: session.email });
  });
  const authorize = new URL(
    await client.authorize({
      state: 'state',
      code_challenge: 'challenge',
      code_challenge_method: 'S256',
      redirect_uri: 'http://127.0.0.1:49152/callback',
    }),
  );
  assert.equal(authorize.searchParams.get('response_type'), 'code');
  assert.equal(authorize.searchParams.get('client_id'), 'heydiff-mac');
  const got = await client.exchange({
    code: 'one-use-code',
    verifier: 'private-verifier',
    redirectUri: 'http://127.0.0.1:49152/callback',
    signal: new AbortController().signal,
  });
  assert.equal(got.email, session.email);
  const tokenRequest = requests.find((r) => r.url.endsWith('/token'))!;
  assert.equal(tokenRequest.init?.method, 'POST');
  const body = new URLSearchParams(String(tokenRequest.init?.body));
  assert.equal(body.get('code_verifier'), 'private-verifier');
  assert.equal(body.get('grant_type'), 'authorization_code');
  assert.equal(body.get('redirect_uri'), 'http://127.0.0.1:49152/callback');
  assert.equal(new Headers(requests.at(-1)!.init?.headers).get('Authorization'), `Bearer ${session.accessToken}`);
  assert.ok(requests.every((r) => !r.url.includes('private-')));
  const unsafe = new OAuthClient('https://www.heydiff.com', 'heydiff-mac', async () =>
    Response.json({
      issuer: 'https://www.heydiff.com',
      authorization_endpoint: 'https://evil.invalid/authorize',
      token_endpoint: 'https://evil.invalid/token',
    }),
  );
  await assert.rejects(
    unsafe.authorize({ state: 's', code_challenge: 'c', code_challenge_method: 'S256', redirect_uri: 'http://127.0.0.1:1/callback' }),
  );
});

test(`refresh credentials persist encrypted, never in state.json or Settings, and Sign Out removes them @F129 @N14 ${tag}`, async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'hd-online-'));
  const file = path.join(dir, 'online', 'session.enc');
  const encrypt = (s: string) => Buffer.from([...Buffer.from(s)].map((byte) => byte ^ 0x55));
  const vault = new TokenVault(file, {
    isEncryptionAvailable: () => true,
    encryptString: encrypt,
    decryptString: (b) => Buffer.from([...b].map((byte) => byte ^ 0x55)).toString(),
  });
  try {
    await vault.save(session);
    assert.equal((await readFile(file)).includes(Buffer.from(session.refreshToken!)), false);
    assert.deepEqual(await vault.load(), session);
    const h = harness({ store: vault });
    await h.auth.restore();
    assert.equal(h.auth.view.message, `Signed in as ${session.email}`);
    await h.auth.signOut();
    assert.equal(await vault.load(), null);
    h.auth.dispose();
    const unavailable = new TokenVault(file, {
      isEncryptionAvailable: () => false,
      encryptString: () => {
        throw new Error('unavailable');
      },
      decryptString: () => {
        throw new Error('unavailable');
      },
    });
    await unavailable.save(session);
    await assert.rejects(readFile(file), { code: 'ENOENT' });
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test(`bridge status matches its connected, missing and off copy @F128 ${tag}`, () => {
  assert.equal(bridgeStatus(true, true), 'Extension connected');
  assert.equal(bridgeStatus(true, false), 'Extension not found');
  assert.equal(bridgeStatus(false, true), 'Off');
  assert.equal(onlineCopy.offline, 'You’re offline. Sign in when you’re back.');
});

test(`real loopback binds only IPv4 localhost and serves the fixed callback page @F129 ${tag}`, async (t) => {
  let loopback: Awaited<ReturnType<typeof listenLoopback>>;
  try {
    loopback = await listenLoopback(async () => ({ status: 200, body: onlineCopy.allowed }));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'EPERM') throw error;
    t.skip('sandbox blocks TCP listeners (EPERM)');
    return;
  }
  try {
    assert.equal(new URL(loopback.redirectUri).hostname, '127.0.0.1');
    const response = await fetch(`${loopback.redirectUri}?state=state&code=code`);
    assert.equal(await response.text(), onlineCopy.allowed);
    assert.equal(response.headers.get('Referrer-Policy'), 'no-referrer');
  } finally {
    loopback.close();
  }
});

test(`restoring refreshes expired credentials and a revoked refresh clears the local sign-in @F129 ${tag}`, async () => {
  const saved: OnlineSession[] = [];
  let cleared = 0;
  const expired = { ...session, expiresAt: 0 };
  const store = {
    load: async () => expired,
    save: async (value: OnlineSession) => {
      saved.push(value);
    },
    clear: async () => {
      cleared++;
    },
  };
  const restored = harness({
    store,
    refresh: async (previous) => {
      assert.equal(previous.refreshToken, session.refreshToken);
      return session;
    },
  });
  await restored.auth.restore();
  assert.equal(restored.auth.view.status, 'signed_in');
  assert.deepEqual(saved, [session]);
  restored.auth.dispose();
  const revoked = harness({
    store,
    refresh: async () => {
      throw new SignInError('revoked');
    },
  });
  await revoked.auth.restore();
  assert.equal(revoked.auth.view.message, 'You were signed out. Sign in again.');
  assert.equal(cleared, 1);
  revoked.auth.dispose();
});

test(`browser failures return to a retryable offline state without affecting the bridge @F130 @N14 ${tag}`, async () => {
  const h = harness({
    openBrowser: async () => {
      throw new Error('browser unavailable');
    },
  });
  await h.auth.start();
  assert.equal(h.auth.view.status, 'error');
  assert.equal(h.auth.view.message, 'You’re offline. Sign in when you’re back.');
  assert.equal(h.closed(), 1);
  h.auth.dispose();
});
