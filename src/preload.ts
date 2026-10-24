import { contextBridge, ipcRenderer } from 'electron';

const api: Window['snapmark'] = {
  init: () => ipcRenderer.invoke('editor:init'),
  save: (data) => ipcRenderer.invoke('editor:save', data),
  dirty: (value) => ipcRenderer.send('editor:dirty', value),
  stash: (state) => void ipcRenderer.sendSync('editor:stash', state),
  viewerInit: () => ipcRenderer.invoke('viewer:init'),
  viewerSave: (from, md) => ipcRenderer.invoke('viewer:save', from, md),
  viewerExternal: () => ipcRenderer.send('viewer:external'),
  viewerRemove: (n) => ipcRenderer.invoke('viewer:remove', n),
  viewerEdit: (n) => ipcRenderer.send('viewer:edit', n),
  viewerRename: (name) => ipcRenderer.invoke('viewer:rename', name),
  viewerReopen: (dir) => ipcRenderer.invoke('viewer:reopen', dir),
  onViewerReload: (cb) => void ipcRenderer.on('viewer:reload', (_e, data: ViewerInit) => cb(data)),
  areaDone: (area) => ipcRenderer.send('area:done', area),
  scrollDone: (ok) => ipcRenderer.send('scroll:done', ok),
  onScrollStatus: (cb) => void ipcRenderer.on('scroll:status', (_e, status: ScrollStatus) => cb(status)),
};

contextBridge.exposeInMainWorld('snapmark', api);
