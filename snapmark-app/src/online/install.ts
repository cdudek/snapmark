import fs from 'node:fs/promises';
import path from 'node:path';
import { EXTENSION_ORIGIN, HOST_NAME } from './contract';

interface HostInstall {
  home: string;
  data: string;
  executable: string;
  shim: string;
  socket: string;
}
const quote = (value: string) => `'${value.replace(/'/g, "'\\''")}'`;

// Both source and packaged runs point Chrome at the exact Electron binary and compiled shim for this app.
export async function installHost(options: HostInstall): Promise<string> {
  const hostDir = path.join(options.data, 'online');
  await fs.mkdir(hostDir, { recursive: true, mode: 0o700 });
  const launcher = path.join(hostDir, 'native-host');
  await fs.writeFile(
    launcher,
    `#!/bin/sh\nexec env ELECTRON_RUN_AS_NODE=1 ${quote(options.executable)} ${quote(options.shim)} ${quote(options.socket)} "$@"\n`,
    { mode: 0o700 },
  );
  await fs.chmod(launcher, 0o700);
  const directory = path.join(options.home, 'Library/Application Support/Google/Chrome/NativeMessagingHosts');
  await fs.mkdir(directory, { recursive: true });
  const manifest = path.join(directory, `${HOST_NAME}.json`);
  await fs.writeFile(
    manifest,
    JSON.stringify(
      { name: HOST_NAME, description: 'HeyDiff localhost bridge', path: launcher, type: 'stdio', allowed_origins: [EXTENSION_ORIGIN] },
      null,
      2,
    ),
    { mode: 0o600 },
  );
  return manifest;
}
