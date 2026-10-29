import net from 'node:net';
import fs from 'node:fs/promises';
import path from 'node:path';
import { BridgeReply, FrameReader, frame, isResolve } from './contract';
import { resolvePort } from './resolve';

export const bridgeSocket = () => `/tmp/heydiff-${process.getuid!()}/bridge.sock`;

export class Bridge {
  enabled = true;
  private clients = 0;
  get connected(): boolean {
    return this.clients > 0;
  }
  constructor(
    private readonly resolve: (port: number) => Promise<BridgeReply> = resolvePort,
    private readonly changed: () => void = () => {},
  ) {}
  attach(): void {
    this.clients++;
    this.changed();
  }
  detach(): void {
    this.clients--;
    this.changed();
  }
  async request(value: unknown): Promise<BridgeReply> {
    if (!this.enabled) return { status: 'off' };
    if (!isResolve(value)) return { status: 'error' };
    try {
      const result = await this.resolve(value.port);
      return this.enabled ? result : { status: 'off' };
    } catch {
      return this.enabled ? { status: 'error' } : { status: 'off' };
    }
  }
}

export async function startBridge(socketPath: string, bridge: Bridge): Promise<{ close(): Promise<void> }> {
  const dir = path.dirname(socketPath);
  await fs.mkdir(dir, { recursive: true, mode: 0o700 });
  const info = await fs.lstat(dir);
  if (!info.isDirectory() || info.uid !== process.getuid!()) throw new Error('Unsafe bridge socket directory');
  await fs.chmod(dir, 0o700);
  try {
    const existing = await fs.lstat(socketPath);
    if (!existing.isSocket() || existing.uid !== process.getuid!()) throw new Error('Unsafe bridge socket');
    const live = await new Promise<boolean>((resolve, reject) => {
      const probe = net.connect(socketPath);
      probe.once('connect', () => {
        probe.destroy();
        resolve(true);
      });
      probe.once('error', (e: NodeJS.ErrnoException) => {
        if (e.code === 'ECONNREFUSED' || e.code === 'ENOENT') resolve(false);
        else reject(e);
      });
    });
    if (live) throw new Error('Bridge app already running');
    await fs.unlink(socketPath);
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code !== 'ENOENT') throw e;
  }
  const clients = new Set<net.Socket>();
  const server = net.createServer((socket) => {
    clients.add(socket);
    let attached = false;
    let queued = 0;
    let chain = Promise.resolve();
    const reader = new FrameReader((request) => {
      if (++queued > 32) {
        socket.destroy();
        return;
      }
      // Only a valid extension request counts as a connection, not a startup probe.
      if (!attached && isResolve(request)) {
        attached = true;
        bridge.attach();
      }
      chain = chain
        .then(async () => {
          if (!socket.destroyed) socket.write(frame(await bridge.request(request)));
        })
        .catch(() => {
          socket.destroy();
        })
        .finally(() => {
          queued--;
        });
    });
    socket.on('data', (data) => {
      try {
        reader.push(data);
      } catch {
        socket.destroy();
      }
    });
    socket.on('error', () => socket.destroy());
    socket.on('close', () => {
      clients.delete(socket);
      if (attached) bridge.detach();
    });
  });
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(socketPath, resolve);
  });
  await fs.chmod(socketPath, 0o600);
  return {
    close: () =>
      new Promise<void>((resolve, reject) => {
        for (const client of clients) client.destroy();
        server.close((error) => (error ? reject(error) : resolve()));
      }),
  };
}
