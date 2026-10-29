// This entry point runs in Electron's Node mode, never starts the GUI, and never logs to stdout.
import net from 'node:net';
import { EXTENSION_ORIGIN, FrameReader, frame } from './contract';

export function runHost(socketPath: string): void {
  let socket: net.Socket | undefined;
  let reply: ((value: unknown) => void) | undefined;
  let chain = Promise.resolve();
  let queued = 0;
  let ended = false;
  let aborted = false;
  const disconnect = () => {
    socket?.destroy();
    socket = undefined;
    reply?.({ status: 'not_running' });
    reply = undefined;
  };
  const stop = () => {
    aborted = true;
    ended = true;
    process.stdin.destroy();
    disconnect();
  };
  const request = (value: unknown) =>
    new Promise<unknown>((resolve) => {
      reply = resolve;
      if (!socket) {
        const connection = (socket = net.connect(socketPath));
        const reader = new FrameReader((response) => {
          connection.setTimeout(0);
          const done = reply;
          reply = undefined;
          done?.(response);
        });
        connection.on('data', (data) => {
          try {
            reader.push(data);
          } catch {
            disconnect();
          }
        });
        connection.on('error', disconnect);
        connection.on('close', () => {
          if (socket === connection) disconnect();
        });
        connection.on('timeout', disconnect);
      }
      socket.setTimeout(15000);
      socket.write(frame(value));
    });
  const reader = new FrameReader((value) => {
    if (aborted) return;
    if (queued >= 32) {
      stop();
      return;
    }
    queued++;
    chain = chain
      .then(async () => {
        if (aborted) return;
        process.stdout.write(frame(await request(value)));
      })
      .finally(() => {
        queued--;
        if (ended && !queued) disconnect();
      });
  });
  process.stdin.on('data', (data: Buffer) => {
    try {
      reader.push(data);
    } catch {
      stop();
    }
  });
  process.stdin.on('end', () => {
    ended = true;
    if (!queued) disconnect();
  });
  process.stdout.on('error', () => {
    stop();
  });
  process.stdin.on('error', stop);
}

if (require.main === module) {
  const [socketPath, origin] = process.argv.slice(2);
  if (socketPath && origin === EXTENSION_ORIGIN) runHost(socketPath);
  else process.exitCode = 1;
}
