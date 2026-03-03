export interface IElectronAPI {
  selectFolder: () => Promise<string | null>;
  selectFile: () => Promise<string | null>;
  uploadSave: (
    filePath: string,
    userId: string,
    gameId: string,
  ) => Promise<any>;
  getMinecraftWorlds: () => Promise<any>;
  onLog: (callback: (message: string) => void) => void;
  find_steampath: () => Promise<any>;
  getXboxGames: () => Promise<any[]>;
  getallgames: () => Promise<GameData[]>;
  uploadsave_separate: (
    filePath: string,
    userId: string,
    gameId: string,
    fileId: string,
    fileName: string,
    relativePath: string,
    rootID: string,
  ) => Promise<any>;
  fetchCloudSaves: (
    userID: string,
  ) => Promise<{ success: boolean; saves: Cloudsave[] }>;
  downloadSave: (signedUrl: string, targetFolder: string) => Promise<{ success: boolean }>;
  cloudMatcher: (appID: string, rootID: string, relativePath: string) => Promise<string>;
  checkIfFileExists: (localDirectory: string) => Promise<boolean>;
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
  lastplayed: string;
  SizeOnDisk: string;
  versionID: string;
}

export interface steamuser {
  SteamID64: string;
  AccountID: string;
  AccountName: string;
  PersonaName: string;
  userpathdata: string;
}

export interface Foundfile {
  filePath: string;
  filename: string;
  filesize?: string;
  relativePath: string;
  rootID: string;
}

export interface GameData {
  Gamename: string;
  SizeOnDisk: string;
  lastplayed: string;
  versionID: string;
  Saves: Foundfile[];
  AppID: string;
  isDummy?: boolean;
}

export interface HexGameCardProps {
  gameId: string;
  gameName: string;
  gameSavesLength: number;
  // onUpload: (id: string, name: string) => void;
}
export interface XboxGame {
  Name: string;
  PackageFamilyName: string;
  InstallLocation: string;
}

export interface Cloudsave {
  gameName: string,
  appID: string,
  fileName: string,
  relativePath: string,
  last_updated: string,
  file_size: string,
  storage_path: string,
  isDummy?: boolean,
  rootID: string,
}
