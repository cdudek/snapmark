import fs from 'node:fs/promises';
import path from 'node:path';
import { OnlineSession, SessionStore } from './sign-in';

interface SafeStorage {
  isEncryptionAvailable(): boolean;
  encryptString(value: string): Buffer;
  decryptString(value: Buffer): string;
}
export function isSession(value: unknown): value is OnlineSession {
  if (!value || typeof value !== 'object') return false;
  const s = value as Partial<OnlineSession>;
  return (
    typeof s.accessToken === 'string' &&
    s.accessToken.length > 0 &&
    s.accessToken.length <= 16384 &&
    (s.refreshToken === undefined || (typeof s.refreshToken === 'string' && s.refreshToken.length > 0 && s.refreshToken.length <= 16384)) &&
    typeof s.email === 'string' &&
    s.email.length <= 500 &&
    /^[^\s@]+@[^\s@]+$/.test(s.email) &&
    typeof s.expiresAt === 'number' &&
    Number.isFinite(s.expiresAt)
  );
}

// Never put credentials in state.json, logs, or renderer IPC. If Keychain is unavailable, sign-in is memory-only.
export class TokenVault implements SessionStore {
  constructor(
    private readonly file: string,
    private readonly safe: SafeStorage,
  ) {}
  async load(): Promise<OnlineSession | null> {
    if (!this.safe.isEncryptionAvailable()) return null;
    try {
      const bytes = await fs.readFile(this.file);
      if (bytes.length > 128 * 1024) return null;
      const value: unknown = JSON.parse(this.safe.decryptString(bytes));
      return isSession(value) ? value : null;
    } catch {
      return null;
    }
  }
  async save(session: OnlineSession): Promise<void> {
    if (!this.safe.isEncryptionAvailable()) return;
    if (!isSession(session)) throw new Error('Invalid online session');
    await fs.mkdir(path.dirname(this.file), { recursive: true, mode: 0o700 });
    const temporary = `${this.file}.tmp`;
    await fs.writeFile(temporary, this.safe.encryptString(JSON.stringify(session)), { mode: 0o600 });
    await fs.rename(temporary, this.file);
  }
  async clear(): Promise<void> {
    await fs.rm(this.file, { force: true });
  }
}
