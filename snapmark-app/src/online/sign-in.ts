import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { CallbackRequest, CallbackResponse, Loopback } from './loopback';
import { onlineCopy } from './copy';

export interface OnlineSession {
  accessToken: string;
  refreshToken?: string;
  email: string;
  expiresAt: number;
}
export interface OnlineView {
  status: 'signed_out' | 'waiting' | 'signed_in' | 'error';
  message: string;
  email: string | null;
}
export interface AuthorizeParams {
  state: string;
  code_challenge: string;
  code_challenge_method: string;
  redirect_uri: string;
}
export interface ExchangeParams {
  code: string;
  verifier: string;
  redirectUri: string;
  signal: AbortSignal;
}
export interface SessionStore {
  load(): Promise<OnlineSession | null>;
  save(session: OnlineSession): Promise<void>;
  clear(): Promise<void>;
}
export interface SignInDependencies {
  listen(receive: (request: CallbackRequest) => Promise<CallbackResponse>): Promise<Loopback>;
  authorize(params: AuthorizeParams): Promise<string>;
  exchange(params: ExchangeParams): Promise<OnlineSession>;
  refresh?(session: OnlineSession): Promise<OnlineSession>;
  revoke?(session: OnlineSession): Promise<void>;
  openBrowser(url: string): Promise<void>;
  store: SessionStore;
  changed(): void;
  foreground(): void;
}
interface Flow {
  state: string;
  verifier: string;
  abort: AbortController;
  listener?: Loopback;
  url?: string;
  timer?: ReturnType<typeof setTimeout>;
  consumed: boolean;
}
export class SignInError extends Error {
  constructor(readonly reason: 'expired' | 'cancelled' | 'offline' | 'revoked') {
    super(reason);
  }
}
const same = (a: string, b: string) => {
  const left = Buffer.from(a),
    right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
};

// All credentials and PKCE material stay in the main process. Settings gets only `view`.
export class OnlineSignIn {
  private state: OnlineView = { status: 'signed_out', message: onlineCopy.signedOut, email: null };
  private flow?: Flow;
  private session?: OnlineSession;
  private generation = 0;
  private writes = Promise.resolve();
  constructor(
    private readonly deps: SignInDependencies,
    private readonly lifetime = 15 * 60 * 1000,
  ) {}
  get view(): OnlineView {
    return { ...this.state };
  }
  private show(state: OnlineView): void {
    this.state = state;
    this.deps.changed();
  }
  private persist(action: () => Promise<void>): Promise<void> {
    const result = this.writes.then(action);
    this.writes = result.catch(() => {});
    return result;
  }
  private close(flow: Flow): void {
    clearTimeout(flow.timer);
    flow.abort.abort();
    flow.listener?.close();
    if (this.flow === flow) this.flow = undefined;
  }
  private fail(flow: Flow, reason: keyof Pick<typeof onlineCopy, 'cancelled' | 'expired' | 'offline' | 'revoked'>): void {
    if (this.flow !== flow) return;
    this.close(flow);
    this.show({ status: 'error', message: onlineCopy[reason], email: null });
  }
  async restore(): Promise<void> {
    const generation = this.generation;
    try {
      let session = await this.deps.store.load();
      if (!session || generation !== this.generation) return;
      if (session.expiresAt <= Date.now()) {
        if (!this.deps.refresh) throw new SignInError('revoked');
        session = await this.deps.refresh(session);
        if (generation !== this.generation) return;
        const refreshed = session;
        await this.persist(async () => {
          if (generation === this.generation) await this.deps.store.save(refreshed);
        });
      }
      if (generation !== this.generation) return;
      this.session = session;
      this.show({ status: 'signed_in', message: onlineCopy.signedIn(session.email), email: session.email });
    } catch (error) {
      if (generation !== this.generation) return;
      const reason = error instanceof SignInError ? error.reason : 'offline';
      if (reason === 'revoked') await this.persist(() => this.deps.store.clear());
      this.show({ status: 'error', message: onlineCopy[reason], email: null });
    }
  }
  async start(): Promise<void> {
    if (this.flow) return;
    this.generation++;
    const flow: Flow = {
      state: randomBytes(32).toString('base64url'),
      verifier: randomBytes(32).toString('base64url'),
      abort: new AbortController(),
      consumed: false,
    };
    this.flow = flow;
    this.show({ status: 'waiting', message: onlineCopy.waiting, email: null });
    flow.timer = setTimeout(() => this.fail(flow, 'expired'), this.lifetime);
    flow.timer.unref?.();
    try {
      flow.listener = await this.deps.listen((request) => this.callback(flow, request));
      if (this.flow !== flow) {
        flow.listener.close();
        return;
      }
      flow.url = await this.deps.authorize({
        state: flow.state,
        code_challenge: createHash('sha256').update(flow.verifier).digest('base64url'),
        code_challenge_method: 'S256',
        redirect_uri: flow.listener.redirectUri,
      });
      if (this.flow === flow) await this.deps.openBrowser(flow.url);
    } catch (error) {
      this.fail(flow, error instanceof SignInError ? error.reason : 'offline');
    }
  }
  async openBrowser(): Promise<void> {
    const flow = this.flow;
    if (flow?.url) {
      try {
        await this.deps.openBrowser(flow.url);
      } catch {
        this.fail(flow, 'offline');
      }
    }
  }
  cancel(): void {
    this.generation++;
    if (this.flow) this.fail(this.flow, 'cancelled');
  }
  async signOut(): Promise<void> {
    this.generation++;
    if (this.flow) this.close(this.flow);
    const session = this.session;
    this.session = undefined;
    this.show({ status: 'signed_out', message: onlineCopy.signedOut, email: null });
    await this.persist(() => this.deps.store.clear());
    if (session) {
      try {
        await this.deps.revoke?.(session);
      } catch {
        /* Local sign-out still succeeds offline. */
      }
    }
  }
  dispose(): void {
    this.generation++;
    if (this.flow) this.close(this.flow);
  }
  private async callback(flow: Flow, request: CallbackRequest): Promise<CallbackResponse> {
    const refused = { status: 400, body: onlineCopy.denied };
    if (this.flow !== flow || flow.consumed || !flow.listener) return refused;
    const redirect = new URL(flow.listener.redirectUri);
    if (request.method !== 'GET' || request.host !== redirect.host || request.url.length > 8192 || !request.url.startsWith('/callback?'))
      return refused;
    const url = new URL(request.url, redirect.origin);
    const states = url.searchParams.getAll('state');
    if (url.origin !== redirect.origin || url.pathname !== redirect.pathname || states.length !== 1 || !same(states[0], flow.state))
      return refused;
    if (url.searchParams.has('error')) {
      const error = url.searchParams.get('error');
      this.fail(flow, error === 'expired_token' || error === 'request_expired' ? 'expired' : 'cancelled');
      return { status: 200, body: onlineCopy.denied };
    }
    const codes = url.searchParams.getAll('code');
    if (codes.length !== 1 || !codes[0] || codes[0].length > 4096) return refused;
    flow.consumed = true;
    try {
      const session = await this.deps.exchange({
        code: codes[0],
        verifier: flow.verifier,
        redirectUri: flow.listener.redirectUri,
        signal: flow.abort.signal,
      });
      if (this.flow !== flow) return refused;
      await this.persist(async () => {
        if (this.flow === flow) await this.deps.store.save(session);
        if (this.flow !== flow) await this.deps.store.clear();
      });
      if (this.flow !== flow) return refused;
      this.session = session;
      this.close(flow);
      this.show({ status: 'signed_in', message: onlineCopy.signedIn(session.email), email: session.email });
      this.deps.foreground();
      return { status: 200, body: onlineCopy.allowed };
    } catch (error) {
      this.fail(flow, error instanceof SignInError ? error.reason : 'offline');
      return { status: 200, body: onlineCopy.denied };
    }
  }
}
