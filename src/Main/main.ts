import { app, BrowserWindow, ipcMain, dialog } from "electron";
import path from "node:path";
import started from "electron-squirrel-startup";
import { uploadGameSave } from "./save-handler";
import {
  find_all_worlds,
  find_steampath,
  getCompleteGameSaveData,
} from "./LocalDirectory_finder";
import { find_xbox_games } from "./XBOXGameFinder";

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string;
declare const MAIN_WINDOW_VITE_NAME: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1500,
    height: 1000,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // Detta tvingar Electron att faktiskt ladda Google-sidan istället för din app
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https://")) {
      return {
        action: "allow", // Tillåt det nya fönstret
        overrideBrowserWindowOptions: {
          width: 1500,
          height: 1000,
          autoHideMenuBar: true,
          // Detta lurar Google att inte blockera Electron
          userAgent: "Chrome/120.0.0.0 Safari/537.36",
        },
      };
    }
    return { action: "deny" };
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
ipcMain.handle("upload-save", async (event, filePath, userId, gameId) => {
  console.log("Main process recieved upload request for: ", filePath);

  //kallar på funktionen i save-handler.ts
  return await uploadGameSave(filePath, userId, gameId);
});

ipcMain.handle("dialog:openDirectory", async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ["openDirectory"],
  }); //
  if (canceled) {
    return null;
  } else {
    return filePaths[0];
  }
});

//Variant som väljer flera directories
ipcMain.handle("dialog:multiDirectory", async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ["openDirectory", "multiSelections"],
  }); //
  if (canceled) {
    return null;
  } else {
    return filePaths;
  }
});

ipcMain.handle("get-minecraft-worlds", () => {
  return find_all_worlds();
});

ipcMain.handle("find-steam-path", () => {
  return find_steampath();
});
ipcMain.handle("get-xbox-games", async () => {
  return await find_xbox_games();
});

ipcMain.handle("get-complete-game-save-data", async () => {
  return await getCompleteGameSaveData();
});
