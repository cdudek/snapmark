import { AuthorizeParams, ExchangeParams, OnlineSession, SignInError } from './sign-in';
import { isSession } from './token-vault';

interface Metadata {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  userinfo_endpoint?: string;
  revocation_endpoint?: string;
}
type Fetch = (url: string, init?: RequestInit) => Promise<Response>;

// The public Mac client has no client secret. Endpoints come from the service's OAuth metadata, never the redirect.
export class OAuthClient {
  private metadata?: Metadata;
  constructor(
    private readonly origin = 'https://www.heydiff.com',
    private readonly clientId = 'heydiff-mac',
    private readonly fetcher: Fetch = fetch,
  ) {
    const url = new URL(origin);
    if (url.protocol !== 'https:' || url.origin !== origin || url.username || url.password) throw new Error('Invalid HeyDiff origin');
  }
  private endpoint(value: unknown): string {
    if (typeof value !== 'string') throw new Error('Missing OAuth endpoint');
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.origin !== this.origin || url.username || url.password || url.hash)
      throw new Error('Invalid OAuth endpoint');
    return url.toString();
  }
  private async metadataFor(): Promise<Metadata> {
    if (!this.metadata) {
      const response = await this.fetcher(`${this.origin}/.well-known/oauth-authorization-server`, {
        redirect: 'error',
        signal: AbortSignal.timeout(15000),
      });
      if (!response.ok) throw new SignInError('offline');
      const value = (await response.json()) as Metadata;
      this.endpoint(value.issuer);
      this.endpoint(value.authorization_endpoint);
      this.endpoint(value.token_endpoint);
      if (value.userinfo_endpoint) this.endpoint(value.userinfo_endpoint);
      if (value.revocation_endpoint) this.endpoint(value.revocation_endpoint);
      this.metadata = value;
    }
    return this.metadata;
  }
  async authorize(params: AuthorizeParams): Promise<string> {
    const metadata = await this.metadataFor();
    const url = new URL(metadata.authorization_endpoint);
    for (const [key, value] of Object.entries({
      ...params,
      client_id: this.clientId,
      response_type: 'code',
      scope: 'openid email offline_access',
      resource: `${this.origin}/api/v1`,
    }))
      url.searchParams.set(key, value);
    return url.toString();
  }
  private async token(params: Record<string, string>, signal: AbortSignal, previous?: OnlineSession): Promise<OnlineSession> {
    const metadata = await this.metadataFor();
    const response = await this.fetcher(metadata.token_endpoint, {
      method: 'POST',
      redirect: 'error',
      signal,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
      body: new URLSearchParams({ ...params, client_id: this.clientId, resource: `${this.origin}/api/v1` }).toString(),
    });
    if (!response.ok)
      throw new SignInError(response.status === 400 || response.status === 401 ? (previous ? 'revoked' : 'expired') : 'offline');
    const value = (await response.json()) as Record<string, unknown>;
    if (
      typeof value.access_token !== 'string' ||
      value.access_token.length > 16384 ||
      String(value.token_type).toLowerCase() !== 'bearer' ||
      typeof value.expires_in !== 'number' ||
      value.expires_in <= 0 ||
      value.expires_in > 86400
    )
      throw new SignInError('expired');
    const info = await this.fetcher(metadata.userinfo_endpoint ?? `${this.origin}/api/auth/oauth2/userinfo`, {
      redirect: 'error',
      signal,
      headers: { Authorization: `Bearer ${value.access_token}`, Accept: 'application/json' },
    });
    if (!info.ok) throw new SignInError(info.status === 401 ? 'revoked' : 'offline');
    const user = (await info.json()) as { email?: unknown };
    const session = {
      accessToken: value.access_token,
      refreshToken: value.refresh_token ?? previous?.refreshToken,
      expiresAt: Date.now() + value.expires_in * 1000,
      email: user.email,
    };
    if (!isSession(session)) throw new SignInError('expired');
    return session;
  }
  exchange(params: ExchangeParams): Promise<OnlineSession> {
    return this.token(
      { grant_type: 'authorization_code', code: params.code, code_verifier: params.verifier, redirect_uri: params.redirectUri },
      AbortSignal.any([params.signal, AbortSignal.timeout(15000)]),
    );
  }
  refresh(session: OnlineSession): Promise<OnlineSession> {
    if (!session.refreshToken) return Promise.reject(new SignInError('revoked'));
    return this.token({ grant_type: 'refresh_token', refresh_token: session.refreshToken }, AbortSignal.timeout(15000), session);
  }
  async revoke(session: OnlineSession): Promise<void> {
    const metadata = await this.metadataFor();
    if (!metadata.revocation_endpoint) return;
    await this.fetcher(metadata.revocation_endpoint, {
      method: 'POST',
      redirect: 'error',
      signal: AbortSignal.timeout(15000),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ token: session.refreshToken ?? session.accessToken, client_id: this.clientId }).toString(),
    });
  }
}
