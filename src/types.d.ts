export interface IElectronAPI {
  selectFolder: () => Promise<string | null>;
  uploadSave: (
    filePath: string,
    userId: string,
    gameId: string,
  ) => Promise<any>;
  getMinecraftWorlds: () => Promise<any>;
  onLog: (callback: (message: string) => void) => void;
  find_steampath: () => Promise<any>;
}
declare global {
  interface Window {
    electron: IElectronAPI;
  }
}

export interface SteamGame {
  appid: string;
  name: string;
  installDir: string;
  libraryPath: string;
}

export interface steamuser {
  SteamID64: string;
  AccountID: string;
  PersonaName: string;
  userpathdata: string;
}
