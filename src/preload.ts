import { contextBridge, ipcRenderer } from 'electron';

const api: Window['snapmark'] = {
  init: () => ipcRenderer.invoke('editor:init'),
  save: (data) => ipcRenderer.invoke('editor:save', data),
  dirty: (value) => ipcRenderer.send('editor:dirty', value),
};

contextBridge.exposeInMainWorld('snapmark', api);
