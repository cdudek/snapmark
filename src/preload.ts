import { contextBridge, ipcRenderer } from 'electron';

const api: Window['snapmark'] = {
  init: () => ipcRenderer.invoke('editor:init'),
  save: (data) => ipcRenderer.invoke('editor:save', data),
};

contextBridge.exposeInMainWorld('snapmark', api);
