// Local bridge v1 contract until heydiff-kit/contracts supplies it. Chrome uses HOST_NAME and this pinned id.
export const HOST_NAME = 'com.heydiff.bridge';
export const EXTENSION_ID = 'pgiiilhkollimekpinhmfjllamhlpkhb';
export const EXTENSION_ORIGIN = `chrome-extension://${EXTENSION_ID}/`;
export interface ResolveRequest {
  type: 'resolve';
  port: number;
}
export type BridgeReply =
  | { status: 'ok'; folder: string; repo: string; worktree: string; branch: string | null; commit: string | null; uncommitted: boolean }
  | { status: 'no_repo'; folder: string | null }
  | { status: 'off' | 'not_running' | 'error' };

export function isResolve(value: unknown): value is ResolveRequest {
  if (!value || typeof value !== 'object') return false;
  const r = value as Partial<ResolveRequest>;
  return r.type === 'resolve' && Number.isInteger(r.port) && r.port! > 0 && r.port! <= 65535;
}

// Chrome native messaging: 32-bit little-endian byte length, followed by UTF-8 JSON. The same framing is used on
// the private socket. Bounded frames and a per-connection request limit keep an ill-behaved client from filling RAM.
const MAX_FRAME = 64 * 1024;
export function frame(value: unknown): Buffer {
  const body = Buffer.from(JSON.stringify(value), 'utf8');
  if (body.length > MAX_FRAME) throw new Error('bridge frame too large');
  const header = Buffer.alloc(4);
  header.writeUInt32LE(body.length);
  return Buffer.concat([header, body]);
}
export class FrameReader {
  private pending = Buffer.alloc(0);
  constructor(private readonly receive: (value: unknown) => void) {}
  push(chunk: Buffer): void {
    this.pending = Buffer.concat([this.pending, chunk]);
    while (this.pending.length >= 4) {
      const length = this.pending.readUInt32LE(0);
      if (!length || length > MAX_FRAME) throw new Error('bridge frame too large or empty');
      if (this.pending.length < length + 4) return;
      const body = this.pending.subarray(4, 4 + length);
      this.pending = this.pending.subarray(4 + length);
      this.receive(JSON.parse(body.toString('utf8')));
    }
  }
}
