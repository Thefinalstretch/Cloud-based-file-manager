export interface IElectronAPI {
  selectFolder: () => Promise<string | null>;
  selectFile: () => Promise<string | null>;
  uploadFolder: (
    filePath: string,
    userID: string,
    gameID: string,
  ) => Promise<any>;
  getMinecraftWorlds: () => Promise<any>;
  onLog: (callback: (message: string) => void) => void;
  find_steampath: () => Promise<any>;
  getallgames: () => Promise<gameData[]>;
  uploadsave_separate: (
    filePath: string,
    userID: string,
    gameID: string,
    fileID: string,
    fileName: string,
    relativePath: string,
    rootID: string,
    index: number
  ) => Promise<any>;
  fetchCloudSaves: (
    userID: string,
  ) => Promise<{ success: boolean; saves: cloudSave[] }>;
  downloadSave: (signedUrl: string, targetFolder: string, 
    removeThisFolder?: string) => Promise<{ success: boolean }>;
  cloudMatcher: (appID: string, rootID: string, relativePath: string) => 
    Promise<string>;
  checkIfFileExists: (localDirectory: string) => Promise<boolean>;
}
declare global {
  interface Window {
    electron: IElectronAPI;
  }
}

export interface steamGame {
  appID: string;
  gameName: string;
  installDir: string;
  libraryPath: string;
  lastPlayed: string;
  sizeOnDisk: string;
  versionID: string;
}

export interface steamUser {
  steamID64: string;
  accountID: string;
  accountName: string;
  personaName: string;
  userPathData: string;
}

export interface foundFile {
  filePath: string;
  fileName: string;
  fileSize?: string;
  relativePath: string;
  rootID: string;
}

export interface gameData {
  gameName: string;
  sizeOnDisk: string;
  lastPlayed: string;
  versionID: string;
  saves: foundFile[];
  appID: string;
  isDummy?: boolean;
}

export interface hexGameCardProps {
  gameID: string;
  gameName: string;
  gameSavesLength: number;
  // onUpload: (id: string, name: string) => void;
}
export interface xboxGame {
  name: string;
  packageFamilyName: string;
  installLocation: string;
}

export interface cloudSave {
  gameName: string,
  appID: string,
  fileName: string,
  relativePath: string,
  lastUpdated: string,
  fileSize: string,
  storagePath: string,
  isDummy?: boolean,
  rootID: string,
  index: number
}

export interface HoneycombItem {
  appID: string
  isDummy?: boolean
}
