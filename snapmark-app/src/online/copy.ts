// spec/microcopy.md, mac.settings.*. The renderer receives only these messages and the account email.
export const onlineCopy = {
  signedOut: 'Share sessions with your team, and let the Chrome extension find your repos.',
  waiting: 'Finish signing in in your browser.',
  signedIn: (email: string) => `Signed in as ${email}`,
  expired: 'Sign-in expired. Sign in again.',
  cancelled: 'Sign-in was cancelled.',
  offline: 'You’re offline. Sign in when you’re back.',
  revoked: 'You were signed out. Sign in again.',
  allowed: 'HeyDiff is connected. You can close this tab.',
  denied: 'HeyDiff was not connected. You can close this tab.',
} as const;

export function bridgeStatus(enabled: boolean, connected: boolean): string {
  return !enabled ? 'Off' : connected ? 'Extension connected' : 'Extension not found';
}
