import assert from 'node:assert/strict';
import { test } from 'node:test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import * as sessions from '../src/sessions';

const tag = '@2026-10-27-online-release-1';
const read = (file: string) => fs.readFileSync(path.join(__dirname, '../..', file), 'utf8');

test(`Online is the last tab with native labelled controls and exact microcopy @F125 @F128 ${tag}`, () => {
  const html = read('src/settings.html');
  assert.deepEqual(
    [...html.matchAll(/role="tab" id="tab-([^"]+)"/g)].map((m) => m[1]),
    ['general', 'capture', 'shortcuts', 'online'],
  );
  assert.match(html, /type="checkbox" id="bridge" aria-describedby="bridge-help bridge-status"/);
  for (const copy of [
    'HeyDiff',
    'Sign In…',
    'Sign Out',
    'Open Browser',
    'Cancel',
    'Localhost Bridge',
    'Tells the Chrome extension which repo a localhost page comes from.',
  ])
    assert.ok(html.includes(copy), copy);
  assert.match(html, /id="online-status"[^>]*role="status"/);
  assert.match(html, /id="bridge-status"[^>]*role="status"/);
});

test(`renderer applies the checkbox immediately, renders online states and supports Return/Escape @F125 @F128 @F130 ${tag}`, async () => {
  // Run the real compiled classic script with a small DOM double. No browser or new DOM dependency is needed.
  interface FakeElement {
    id: string;
    hidden: boolean;
    value: string;
    checked: boolean;
    textContent: string;
    onchange(): void;
    setAttribute(): void;
    addEventListener(): void;
    replaceChildren(): void;
    focus(): void;
  }
  const elements = new Map<string, FakeElement>();
  const handlers: Record<string, (event: Record<string, unknown>) => void> = {};
  const element = (id: string): FakeElement => {
    if (!elements.has(id))
      elements.set(id, {
        id,
        hidden: false,
        value: '',
        checked: false,
        textContent: '',
        onchange() {},
        setAttribute() {},
        addEventListener() {},
        replaceChildren() {},
        focus() {},
      });
    return elements.get(id)!;
  };
  const tabs = ['general', 'capture', 'shortcuts', 'online'].map((id) => ({
    ...element(`tab-${id}`),
    textContent: id === 'online' ? 'Online' : id,
    getAttribute: () => id,
  }));
  const calls: unknown[][] = [];
  let settings: SettingsInit = {
    login: { enabled: false, checked: false, needsApproval: false },
    root: '/local',
    canChangeRoot: true,
    version: '0.4.0',
    canUpdate: false,
    singleKeys: true,
    keys: [],
    capture: { mode: 'area', oneShot: false, timer: 0, pointer: false },
    online: {
      bridgeEnabled: true,
      bridgeStatus: 'Extension not found',
      auth: { status: 'signed_out', message: 'Share sessions with your team, and let the Chrome extension find your repos.', email: null },
    },
  };
  let changed!: (s: SettingsInit) => void;
  const api = {
    settingsInit: async () => settings,
    settingsSet: async (...args: unknown[]) => {
      calls.push(args);
      return settings;
    },
    settingsRun: async (...args: unknown[]) => {
      calls.push(args);
      return settings;
    },
    onSettings: (callback: typeof changed) => {
      changed = callback;
    },
  };
  vm.runInNewContext(read('dist/src/settings.js'), {
    document: { getElementById: element, querySelectorAll: () => tabs, createElement: () => ({ append() {} }) },
    localStorage: { getItem: () => 'tab-online', setItem() {} },
    window: {
      snapmark: api,
      addEventListener: (event: string, callback: typeof changed) => {
        handlers[event] = callback as never;
      },
    },
  });
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(element('bridge').checked, true);
  element('bridge').checked = false;
  element('bridge').onchange();
  assert.deepEqual(calls[0], ['localhostBridge', false]);
  settings = {
    ...settings,
    online: {
      bridgeEnabled: false,
      bridgeStatus: 'Off',
      auth: { status: 'waiting', message: 'Finish signing in in your browser.', email: null },
    },
  };
  changed(settings);
  assert.equal(element('bridge-status').textContent, 'Off');
  assert.equal(element('online-status').textContent, 'Finish signing in in your browser.');
  assert.equal(element('sign-in').hidden, true);
  assert.equal(element('online-cancel').hidden, false);
  handlers.keydown({ key: 'Enter', preventDefault() {}, target: {} });
  handlers.keydown({ key: 'Escape', preventDefault() {}, target: {} });
  assert.deepEqual(calls.slice(-2), [['onlineBrowser'], ['onlineCancel']]);
  changed({ ...settings, online: { ...settings.online, auth: { status: 'error', message: 'Sign-in was cancelled.', email: null } } });
  assert.equal(element('sign-in').hidden, false);
  assert.equal(element('online-cancel').hidden, true);
});

test(`account-free local sessions and the existing Snapmark bundle id remain available @N14 ${tag}`, () => {
  const pkg = JSON.parse(read('package.json'));
  assert.equal(pkg.build.appId, 'com.cdudek.snapmark');
  assert.equal(pkg.build.productName, 'Snapmark');
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hd-local-'));
  try {
    const name = sessions.create(root, 'Local only');
    assert.ok(sessions.list(root).includes(name));
    assert.ok(fs.existsSync(path.join(root, name, 'session.md')));
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
