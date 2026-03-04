// See the Electron documentation for details on how to use preload scripts:

import { ipcRenderer, contextBridge } from "electron";
import { uploadGameSave_separate } from "./Main/save-handler-separate-files";

// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
contextBridge.exposeInMainWorld("electron", {
  selectFolder: () => ipcRenderer.invoke("dialog:openDirectory"),
  selectFile: () => ipcRenderer.invoke("dialog:openFile"),
  uploadSave: (path: string, userID: string, gameID: string) =>
    ipcRenderer.invoke("upload-save", path, userID, gameID),
  getMinecraftWorlds: () => ipcRenderer.invoke("get-minecraft-worlds"),
  find_steampath: () => ipcRenderer.invoke("find-steam-path"),
  getXboxGames: () => ipcRenderer.invoke("get-xbox-games"),
  getallgames: () => ipcRenderer.invoke("get-complete-game-save-data"),
  uploadsave_separate: (filePath: string, userID: string, appID: string, gameName: string, fileName: string, relativePath:string, rootID: string, ) =>
    ipcRenderer.invoke("uploadsave-separate", filePath, userID, appID, gameName, fileName, relativePath, rootID),
  fetchCloudSaves: (userID: string) => 
    ipcRenderer.invoke("fetchCloudSaves", userID),
  downloadSave: (signedUrl:string, targetFolder:string) => ipcRenderer.invoke("downloadSave", signedUrl, targetFolder),
  cloudMatcher: (appID:string, rootID:string, relativePath:string) => ipcRenderer.invoke("cloudMatcher", appID, rootID, relativePath),
  checkIfFileExists: (localDirectory:string) => ipcRenderer.invoke("checkIfFileExists", localDirectory),
});
