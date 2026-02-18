// See the Electron documentation for details on how to use preload scripts:

import { ipcRenderer, contextBridge } from "electron";

// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
contextBridge.exposeInMainWorld("electron", {
  selectFolder: () => ipcRenderer.invoke("dialog:openDirectory"),
  uploadSave: (path: string, userId: string, gameId: string) =>
    ipcRenderer.invoke("upload-save", path, userId, gameId),
  getMinecraftWorlds: () => ipcRenderer.invoke("get-minecraft-worlds"),
  find_steampath: () => ipcRenderer.invoke("find-steam-path")
});
