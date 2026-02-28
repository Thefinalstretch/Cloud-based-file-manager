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
  ) => Promise<any>;
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

interface HexGameCardProps {
  gameId: string;
  gameName: string;
  // onUpload: (id: string, name: string) => void;
}
export interface XboxGame {
  Name: string;
  PackageFamilyName: string;
  InstallLocation: string;
}
