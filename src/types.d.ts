export interface IElectronAPI {
  selectFolder: () => Promise<string | null>;
  uploadSave: (
    filePath: string,
    userId: string,
    gameId: string,
  ) => Promise<any>;
  getMinecraftWorlds: () => Promise<any>;
  onLog: (callback: (message: string) => void) => void;
  find_steampath: () => Promise<any>
}
declare global {
  interface Window {
    electron: IElectronAPI;
  }
}
