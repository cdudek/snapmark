import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, readFile, mkdir, rm, stat, writeFile, realpath } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { execFile, spawn } from 'node:child_process';
import { promisify } from 'node:util';
import net from 'node:net';
import { installHost } from '../src/online/install';
import { EXTENSION_ID, HOST_NAME, frame, FrameReader } from '../src/online/contract';
import { Bridge, startBridge } from '../src/online/bridge';
import { resolvePort, resolveFolder } from '../src/online/resolve';

const exec = promisify(execFile);
const tag = '@2026-10-27-online-release-1';
const temp = () => mkdtemp(path.join(os.tmpdir(), 'hd-'));

test(`manifest installs an executable shim for only the pinned extension @F122 ${tag}`, async () => {
  const dir = await temp();
  try {
    const manifestPath = await installHost({
      home: dir,
      data: path.join(dir, "Mac app's data"),
      executable: process.execPath,
      shim: path.resolve(__dirname, '../src/online/native-host.js'),
      socket: path.join(dir, 'bridge.sock'),
    });
    const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
    assert.equal(EXTENSION_ID, 'pgiiilhkollimekpinhmfjllamhlpkhb');
    assert.equal(manifest.name, HOST_NAME);
    assert.equal(manifest.type, 'stdio');
    assert.deepEqual(manifest.allowed_origins, [`chrome-extension://${EXTENSION_ID}/`]);
    assert.equal((await stat(manifest.path)).mode & 0o777, 0o700);
    const child = spawn(manifest.path, [`chrome-extension://${EXTENSION_ID}/`]);
    const result = new Promise<unknown>((resolve) => {
      const reader = new FrameReader(resolve);
      child.stdout.on('data', (b) => reader.push(b));
    });
    child.stdin.write(frame({ type: 'resolve', port: 3000 }));
    assert.deepEqual(await result, { status: 'not_running' });
    child.stdin.end();
    await new Promise((resolve) => child.on('exit', resolve));
    const refused = spawn(manifest.path, ['chrome-extension://aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/']);
    const chunks: Buffer[] = [];
    refused.stdout.on('data', (b) => chunks.push(b));
    await new Promise((resolve) => refused.on('exit', resolve));
    assert.equal(Buffer.concat(chunks).length, 0);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test(`port resolves the serving folder, origin repo, worktree, branch and commit @F123 ${tag}`, async () => {
  const dir = await temp();
  try {
    await exec('git', ['init', '-b', 'main', dir]);
    await exec('git', [
      '-C',
      dir,
      '-c',
      'user.name=Bridge test',
      '-c',
      'user.email=test@example.invalid',
      'commit',
      '--allow-empty',
      '-m',
      'initial',
    ]);
    await exec('git', ['-C', dir, 'remote', 'add', 'origin', 'https://github.com/example/project.git']);
    const worktree = path.join(dir, 'checkout');
    await exec('git', ['-C', dir, 'worktree', 'add', '-b', 'feature/bridge', worktree]);
    const folder = path.join(worktree, 'web');
    await mkdir(folder);
    const inspect = async (file: string, args: string[]) => {
      assert.equal(file, '/usr/sbin/lsof');
      if (args.includes('-Fp')) {
        assert.deepEqual(args, ['-nP', '-a', '-iTCP:3000', '-sTCP:LISTEN', '-Fp']);
        return 'p1234\np1234';
      }
      assert.deepEqual(args, ['-a', '-p', '1234', '-d', 'cwd', '-Fn']);
      return `p1234\nfcwd\nn${folder}`;
    };
    const result = await resolvePort(3000, inspect);
    assert.equal(result.status, 'ok');
    if (result.status !== 'ok') throw new Error('listener was not resolved');
    assert.equal(await realpath(result.folder), await realpath(folder));
    assert.equal(result.repo, 'https://github.com/example/project.git');
    assert.equal(path.basename(result.worktree), 'checkout');
    assert.equal(result.branch, 'feature/bridge');
    assert.equal(result.commit, (await exec('git', ['-C', worktree, 'rev-parse', 'HEAD'])).stdout.trim());
    assert.equal(result.uncommitted, false);
    await writeFile(path.join(folder, 'new.txt'), 'changed');
    assert.equal((await resolveFolder(folder)).status, 'ok');
    const dirty = await resolvePort(3000, inspect);
    assert.ok(dirty.status === 'ok' && dirty.uncommitted);
    assert.deepEqual(await resolvePort(-1), { status: 'error' });
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test(`a serving folder outside Git answers no repo @F124 ${tag}`, async () => {
  const dir = await temp();
  try {
    assert.deepEqual(await resolveFolder(dir), { status: 'no_repo', folder: dir });
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test(`bridge is on by default and off answers off for every request without resolving @F126 @F127 ${tag}`, async () => {
  let calls = 0;
  const bridge = new Bridge(async () => {
    calls++;
    return { status: 'no_repo', folder: null };
  });
  assert.equal(bridge.enabled, true);
  assert.deepEqual(await bridge.request({ type: 'resolve', port: 3000 }), { status: 'no_repo', folder: null });
  bridge.enabled = false;
  for (const value of [{ type: 'resolve', port: 3000 }, {}, null, { type: 'resolve', port: 'bad' }])
    assert.deepEqual(await bridge.request(value), { status: 'off' });
  assert.equal(calls, 1);
});

test(`shim relays fragmented and consecutive native messages over a private socket @F122 @F123 @F127 ${tag}`, async (t) => {
  const dir = await temp();
  const socket = path.join(dir, 'bridge.sock');
  const bridge = new Bridge(async () => ({ status: 'no_repo', folder: '/a folder' }));
  let server: Awaited<ReturnType<typeof startBridge>>;
  try {
    server = await startBridge(socket, bridge);
  } catch (error) {
    await rm(dir, { recursive: true, force: true });
    if ((error as NodeJS.ErrnoException).code !== 'EPERM') throw error;
    t.skip('sandbox blocks Unix socket listeners (EPERM)');
    return;
  }
  const child = spawn(process.execPath, [
    path.resolve(__dirname, '../src/online/native-host.js'),
    socket,
    `chrome-extension://${EXTENSION_ID}/`,
  ]);
  try {
    assert.equal((await stat(socket)).mode & 0o777, 0o600);
    const replies: unknown[] = [];
    let next: (() => void) | undefined;
    const reader = new FrameReader((reply) => {
      replies.push(reply);
      next?.();
    });
    child.stdout.on('data', (b) => reader.push(b));
    const waitFor = async (n: number) => {
      while (replies.length < n)
        await new Promise<void>((resolve) => {
          next = resolve;
        });
    };
    const packet = frame({ type: 'resolve', port: 3000 });
    child.stdin.write(packet.subarray(0, 2));
    child.stdin.write(packet.subarray(2));
    await waitFor(1);
    assert.deepEqual(replies[0], { status: 'no_repo', folder: '/a folder' });
    assert.equal(bridge.connected, true);
    bridge.enabled = false;
    child.stdin.write(Buffer.concat([packet, packet]));
    await waitFor(3);
    assert.deepEqual(replies.slice(1), [{ status: 'off' }, { status: 'off' }]);
    child.stdin.end();
    await new Promise((resolve) => child.on('exit', resolve));
    assert.equal(bridge.connected, false);
  } finally {
    child.kill();
    await server.close();
    await rm(dir, { recursive: true, force: true });
  }
});

test(`socket startup preserves an already running app and rejects malformed frames @F122 ${tag}`, async (t) => {
  const dir = await temp();
  const socket = path.join(dir, 'bridge.sock');
  let server: Awaited<ReturnType<typeof startBridge>>;
  try {
    server = await startBridge(socket, new Bridge());
  } catch (error) {
    await rm(dir, { recursive: true, force: true });
    if ((error as NodeJS.ErrnoException).code !== 'EPERM') throw error;
    t.skip('sandbox blocks Unix socket listeners (EPERM)');
    return;
  }
  try {
    await assert.rejects(startBridge(socket, new Bridge()), /running/);
    const client = net.connect(socket);
    await new Promise((resolve) => client.once('connect', resolve));
    client.write(Buffer.from([255, 255, 255, 127]));
    await new Promise((resolve) => client.once('close', resolve));
    assert.throws(() => new FrameReader(() => {}).push(Buffer.from([255, 255, 255, 127])), /large/);
  } finally {
    await server.close();
    await rm(dir, { recursive: true, force: true });
  }
});

test(`framing handles split UTF-8, consecutive requests and rejects oversized or invalid JSON @F122 ${tag}`, () => {
  const received: unknown[] = [];
  const reader = new FrameReader((value) => received.push(value));
  const first = frame({ folder: '/café' });
  for (const byte of first) reader.push(Buffer.from([byte]));
  reader.push(Buffer.concat([frame({ type: 'resolve', port: 1 }), frame({ type: 'resolve', port: 2 })]));
  assert.deepEqual(received, [{ folder: '/café' }, { type: 'resolve', port: 1 }, { type: 'resolve', port: 2 }]);
  assert.throws(() => reader.push(Buffer.from([255, 255, 255, 127])), /large/);
  assert.throws(() => new FrameReader(() => {}).push(Buffer.from([1, 0, 0, 0, 123])), SyntaxError);
});

test(`turning the bridge off also suppresses a pending resolution @F127 ${tag}`, async () => {
  let finish!: (reply: { status: 'no_repo'; folder: string }) => void;
  const bridge = new Bridge(
    () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  );
  const pending = bridge.request({ type: 'resolve', port: 3000 });
  bridge.enabled = false;
  finish({ status: 'no_repo', folder: '/private/local/folder' });
  assert.deepEqual(await pending, { status: 'off' });
});
