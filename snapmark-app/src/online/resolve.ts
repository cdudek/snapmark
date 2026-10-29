import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import { BridgeReply, isResolve } from './contract';

const exec = promisify(execFile);
async function command(file: string, args: string[]): Promise<string> {
  return (await exec(file, args, { timeout: 3000, maxBuffer: 1024 * 1024 })).stdout.trimEnd();
}

export async function resolveFolder(folder: string): Promise<BridgeReply> {
  const git = (...args: string[]) => command('/usr/bin/git', ['-c', 'core.fsmonitor=false', '-C', folder, ...args]);
  try {
    const worktree = await git('rev-parse', '--show-toplevel');
    const common = await git('rev-parse', '--path-format=absolute', '--git-common-dir');
    let repo: string;
    try {
      repo = await git('config', '--get', 'remote.origin.url');
    } catch {
      repo = path.dirname(common);
    }
    // Never send credentials embedded in an HTTPS remote to the browser.
    if (/^https?:\/\//.test(repo)) {
      const url = new URL(repo);
      url.username = '';
      url.password = '';
      repo = url.toString();
    }
    const branch = (await git('branch', '--show-current')) || null;
    let commit: string | null;
    try {
      commit = await git('rev-parse', '--verify', 'HEAD');
    } catch {
      commit = null;
    }
    const uncommitted = !!(await git('status', '--porcelain', '--untracked-files=normal'));
    return { status: 'ok', folder, repo, worktree, branch, commit, uncommitted };
  } catch {
    return { status: 'no_repo', folder };
  }
}

export async function resolvePort(port: number, inspect: typeof command = command): Promise<BridgeReply> {
  if (!isResolve({ type: 'resolve', port })) return { status: 'error' };
  try {
    const listeners = await inspect('/usr/sbin/lsof', ['-nP', '-a', `-iTCP:${port}`, '-sTCP:LISTEN', '-Fp']);
    const pids = [
      ...new Set(
        listeners
          .split('\n')
          .filter((s) => /^p\d+$/.test(s))
          .map((s) => s.slice(1)),
      ),
    ];
    const folders = new Set<string>();
    for (const pid of pids) {
      const cwd = await inspect('/usr/sbin/lsof', ['-a', '-p', pid, '-d', 'cwd', '-Fn']);
      for (const line of cwd.split('\n')) if (line.startsWith('n/')) folders.add(line.slice(1));
    }
    // Never guess when multiple processes serve a port from different checkouts.
    if (folders.size !== 1) return { status: 'no_repo', folder: null };
    return resolveFolder([...folders][0]);
  } catch {
    return { status: 'no_repo', folder: null };
  }
}
