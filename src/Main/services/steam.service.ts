//importera modul som identifierar operativsystemet
import * as os from "os";
import path from "path";
import fs from "fs";
import regedit from "regedit";
import { promisify } from "util";
import type { foundFile, gameData, steamGame, steamUser } from "src/shared/types";

// const execPromise = util.promisify(exec);

const listkey = promisify(regedit.list);
//Genom att köra den genom promisify förvandlar vi den till en Promise. Det gör att vi kan skriva await, vilket gör koden mycket mer lättläst.
//regedit.list: Detta är huvudfunktionen. Den tar en lista på mappar i registret och hämtar allt som finns i dem.

const vbsdirectory = path.join(process.cwd(), "node_modules", "regedit", "vbs");
//process.cwd(): Betyder "Current Working Directory" – alltså mappen där ditt projekt körs ifrån.

regedit.setExternalVBSLocation(vbsdirectory);
//setExternalVBSLocation: Som vi märkte tidigare letar regedit på fel ställe efter sina skript när man kör med Vite. Dennna rad tvingar den att titta i din node_modules-mapp istället. Det är "fixen" för ditt error.

/**
 * Uses registry keys to find the installation path of Steam, regardless of where it is installed on the user's system.
 * @precondition The user must have Steam installed on their system, and the registry keys must be intact and accessible.
 * @complexity Theta(1) in the average case, as it involves a constant number of registry lookups, but can degrade to Theta(N) in the worst case if there are issues with the registry or if multiple lookups are needed due to errors.
 * @returns {Promise<string | null>} The normalized path to the Steam installation directory, or null if it cannot be found.
 */
export async function findSteamPath(): Promise<string | null> {
  try {
    const steamRegistryKey = "HKCU\\Software\\Valve\\Steam";
    const result = (await listkey([steamRegistryKey])) as any;
    const steamPathData = result[steamRegistryKey]?.values?.SteamPath?.value;
    if (steamPathData) {
      return path.normalize(steamPathData);
    }
  } catch (error) {
    console.error("Error reading Steam path from registry:", error);
  }
  return null;
}

/**
 * Retrieves the paths of all Steam library folders.
 * @param steampath The path to the Steam installation directory.
 * @precondition steampath must be a valid path to the Steam installation directory, and the user must have permission to access the libraryfolders.vdf file.
 * @complexity Theta(N) where N is the size of the libraryfolders.vdf file, due to the need to read and parse the entire file to extract library paths.
 * @returns {Promise<string[] | null>} An array of unique library paths or null if an error occurs.
 */
export async function getLibraryVdfPaths(
  steampath: string,
): Promise<string[] | null> {
  const libraryVdfPath = path.join(
    steampath,
    "steamapps",
    "libraryfolders.vdf",
  );

  try {
    await fs.promises.access(libraryVdfPath);

    const Vdfcontent = await fs.promises.readFile(libraryVdfPath, "utf-8");
    // Använd regex för att hitta alla sökvägar i VDF-filen
    const libraryPathsRegex = /"path"\s+"([^"]+)"/g;
    const libraryPaths: string[] = [];
    let match;
    while ((match = libraryPathsRegex.exec(Vdfcontent))) {
      libraryPaths.push(path.normalize(match[1]));
    }

    const uniquelibraryPaths = [...new Set(libraryPaths)];
    console.log("Found library paths:");
    uniquelibraryPaths.forEach((Path) => {
      console.log(Path);
    });
    console.log("HERE IT IS:",uniquelibraryPaths)
    return uniquelibraryPaths;
  } catch (error) {
    console.error("Error accessing libraryfolders.vdf:", error);
    return null;
  }
}

/**
 * Converts the library paths array from getLibraryVdfPaths into an array of steamGame objects, 
 * by reading the appmanifest files in each library path.
 * @param libraryPaths An array of paths to Steam library folders.
 * @precondition libraryPaths must be an array of valid paths to Steam library folders, and the user must have permission to access the appmanifest files within those folders.
 * @complexity Theta(M) where M is the total number of appmanifest files across all provided library paths, due to the need to read and parse each file to extract game information.
 * @returns {Promise<steamGame[]>} An array of steamGame objects representing the installed games.
 */
export async function getInstalledsteamGames(
  libraryPaths: string[],
): Promise<steamGame[]> {
  const installedgames: steamGame[] = [];

  for (const librarypath of libraryPaths) {
    const steamappsPath = path.join(librarypath, "steamapps");
    try {
      const dirfiles = await fs.promises.readdir(steamappsPath);
      const appmanifestFiles = dirfiles.filter(
        (file) =>
          file.startsWith("appmanifest_") &&
          file.toLowerCase().endsWith(".acf"),
      );

      for (const file of appmanifestFiles) {
        const full_filepath = path.join(steamappsPath, file);
        const filecontent = await fs.promises.readFile(full_filepath, "utf-8");

        //Använder regex för att plocka ut namn och appID
        const nameMatch = filecontent.match(/"name"\s+"([^"]+)"/);
        const appIDMatch = filecontent.match(/"appid"\s+"(\d+)"/);
        const installdirectorymatch = filecontent.match(
          /"installdir"\s+"([^"]+)"/,
        );
        const lastPlayedMatch = filecontent.match(/"LastPlayed"\s+"(\d+)"/);
        const sizeOnDisk = filecontent.match(/"SizeOnDisk"\s+"(\d+)"/);
        const versionIDMatch = filecontent.match(/"buildid"\s+"(\d+)"/);

        if (nameMatch && appIDMatch) {
          //konverterar unix-tid till ett läsbart datum
          let lastPlayed = "Never Played";
          if (lastPlayedMatch && lastPlayedMatch[1] !== "0") {
            const unixtimestamp = parseInt(lastPlayedMatch[1]);
            lastPlayed = new Date(unixtimestamp * 1000).toLocaleDateString(
              "sv-SE",
            );
          }

          //konverterar storlek i byte till GB med 2 decimaler
          let sizeOnDiskformatted = "0 GB/Not installed";
          if (sizeOnDisk && sizeOnDisk[1] !== "0") {
            const bytes = BigInt(sizeOnDisk[1]);
            const gigabytes = Number(bytes) / 1024 ** 3;
            sizeOnDiskformatted = gigabytes.toFixed(2);
          }

          installedgames.push({
            gameName: nameMatch[1],
            appID: appIDMatch[1],
            installDir: installdirectorymatch ? installdirectorymatch[1] : "",
            libraryPath: librarypath,
            lastPlayed: lastPlayed,
            sizeOnDisk: sizeOnDiskformatted,
            versionID: versionIDMatch ? versionIDMatch[1] : "",
          });
        }
      }
    } catch (error) {
      console.error(`Error reading steamapps in ${steamappsPath}:`, error);
    }
  }
  return installedgames;
}

/**
 * Retrieves the latest active Steam user.
 * @param steamPath The path to the Steam installation directory.
 * @precondition steamPath must be a valid path to the Steam installation directory, and the user must have permission to access the loginusers.vdf file.
 * @complexity Theta(N) where N is the size of the loginusers.vdf file, due to parsing.
 * @returns {Promise<steamUser | null>} The latest active Steam user or null if an error occurs.
 */
export async function getLatestActivesteamUser(
  steamPath: string,
): Promise<steamUser | null> {
  //accountID = SteamID64 - 76561197960265728
  const loginUsersPath = path.join(steamPath, "config", "loginusers.vdf");

  try {
    const loginUsersContent = await fs.promises.readFile(
      loginUsersPath,
      "utf-8",
    );

    //Ger SteamID64 för den senaste användaren som loggat in, genom att leta efter "MostRecent" : "1" i loginusers.vdf
    const mostRecentUserRegex =
      /"(765\d{14})"\s+\{([^}]*?"MostRecent"\s+"1"[^}]*?)\}/is;

    const latestusermatch = loginUsersContent.match(mostRecentUserRegex);

    if (latestusermatch) {
      const steamID64 = latestusermatch[1];

      const personaNameRegex = /"personaName"\s+"([^"]+)"/i;
      const accountNameRegex = /"accountName"\s+"([^"]+)"/i;
      const personaNameMatch = latestusermatch[2].match(personaNameRegex);
      const accountNameMatch = latestusermatch[2].match(accountNameRegex);

      const personaName = personaNameMatch ? personaNameMatch[1] : "Unknown";
      const accountName = accountNameMatch ? accountNameMatch[1] : "Unknown";
      const accountID = (

        BigInt(steamID64) - BigInt("76561197960265728")
      ).toString();
      const userpathdata = path.join(steamPath, "userdata", accountID);
      return {
        steamID64: steamID64,
        accountID: accountID,
        personaName: personaName,
        accountName: accountName,
        userPathData: userpathdata,
      };
    }
  } catch (error) {
    console.error("Error reading loginusers.vdf:", error);
  }
  return null;
}
/**
 * Takes the rootID and returns a path of the save file that is relative 
 * to that specific rootID case.
 * Used to handle the different save file structures that games use.
 * @example For rootID === "0",
 *          getBasePathFromRoot returns something like "C:\Program Files (x86)\Steam\userdata\123456789\123456\remote",
 * @param rootID A string derived from games remotecache.vdf that indicates which save file structure the game uses.
 * @param steamPath The path to the Steam installation directory.
 * @param accountID The Steam account ID of the user.
 * @param appID The app ID of the game.
 * @precondition rootID must be a valid root ID as defined in the Steam documentation, 
 *               steamPath must be a valid path to the Steam installation directory, 
 *               accountID must be a valid Steam account ID, 
 *               appID must be a valid Steam app ID.
 * @returns {string} The full base path to the save file corresponding to the provided rootID. 
 *                   Afterward additional paths are added to find the specific file
 */
function getBasePathFromRoot(
  rootID: string,
  steamPath: string,
  accountID: string,
  appID: string,
): string {
  const userProfile = process.env.USERPROFILE || os.homedir();
  const localAppData =
    process.env.LOCALAPPDATA || path.join(os.homedir(), "AppData", "Local");
  const roamingAppData =
    process.env.APPDATA || path.join(os.homedir(), "AppData", "Roaming");

  switch (rootID) {
    case "0":
      //om rootID är 0. (standard steam cloud i userdata)
      return path.join(steamPath, "userdata", accountID, appID, "remote");

    case "1":
      //om rootID är 1. (för vissa spel som inte använder steam cloud, utan istället sparar i själva spelmappen)
      return path.join(steamPath, "steamapps", "common");
    case "2":
      //om rootID är 2. (för spel som sparar i dokument-mappen)
      return path.join(userProfile, "Documents");
    case "3":
      //om rootID är 3 (/Appdata/Local)
      return localAppData;
    case "4":
      //om rootID är 4 (/Appdata/Roaming)
      return roamingAppData;
    case "9":
      //om rootID är 9 (/Appdata/LocalLow)
      return path.join(userProfile, "AppData", "LocalLow");
    case "12":
      //om rootID är 12 (/Appdata/LocalLow)
      return path.join(userProfile, "AppData", "LocalLow");
    default:
      //Default fallback ifall rootID inte matchar någon av de kända. Vi loggar en varning och återgår till root 0.
      console.warn(`Unknown root ID: ${rootID}. Defaulting to root 0.`);
      return path.join(steamPath, "userdata", accountID, appID, "remote");
  }
}

/**
 * Retrieves the paths of all save files for a specific game.
 * Uses the rootID to get base path and then adds the relative path to find the specific save file.
 * @param user The Steam user for whom to retrieve save paths.
 * @param appID The app ID of the game for which to retrieve save paths.
 * @param steamPath The path to the Steam installation directory.
 * @returns {Promise<foundFile[]>} An array of foundFile objects representing the save files.
 */
export async function getGameSavePath(
  user: steamUser,
  appID: string,
  steamPath: string,
): Promise<foundFile[]> {
  const remotecachepath = path.join(
    steamPath,
    "userdata",
    user.accountID,
    appID,
    "remotecache.vdf",
  );
  try {
    await fs.promises.access(remotecachepath);
    const remotecachecontent = await fs.promises.readFile(
      remotecachepath,
      "utf-8",
    );

    const rootIDRegex = /"([^"]+)"\s+\{[^}]*?"root"\s+"(\d+)"/gi;

    const foundFiles: foundFile[] = [];
    let match;
    while ((match = rootIDRegex.exec(remotecachecontent))) {
      const relativepath = match[1];
      const rootID = match[2];

      const basepath = getBasePathFromRoot(
        rootID,
        steamPath,
        user.accountID,
        appID,
      );
      const fullpathraw = path.join(basepath, relativepath);
      const fullpathnormalized = path.normalize(fullpathraw);
      //Har en try-catch inuti loopen för att vi vill fortsätta iterera igenom alla filer även om det skulle vara något fel med en specifik fil, exempelvis att den inte finns längre på datorn.
      try {
        const stats = await fs.promises.stat(fullpathnormalized);
        const filesize = stats.size;
        const megabytes = (filesize / (1024 * 1024)).toFixed(3);

        foundFiles.push({
          filePath: fullpathnormalized,
          fileName: path.basename(relativepath),
          fileSize: megabytes.toString(),
          relativePath: relativepath,
          rootID: rootID,
        });
      } catch (error) {
        console.warn(
          `Could not get file stats for ${fullpathnormalized}:`,
          error,
        );
      }
    }
    return foundFiles;
  } catch (error) {
    console.error(
      `Error accessing remotecache.vdf (cloudcache) for user ${user.accountID} and app ${appID}. Maybe it was installed locally?`,
      error,
    );
    return [];
  }
}
/**
 * Uses the getGameSavePath function to effectively convert all the found files
 * into gameData types. Converting into gameData helps manage the games and upload them later.
 * @returns {Promise<gameData[]>} An array of gameData objects representing the installed games save files.
 */
export async function getCompleteGameSaveData(): Promise<gameData[]> {
  const steampath = await findSteamPath();
  if (!steampath) {
    console.error("Steam path not found.");
    return [];
  }
  const user = await getLatestActivesteamUser(steampath);
  if (!user) {
    console.error("No active user found.");
    return [];
  }
  const libraryPaths = await getLibraryVdfPaths(steampath);
  if (!libraryPaths) {
    console.error("No library paths found.");
    return [];
  }
  const installedgames = await getInstalledsteamGames(libraryPaths);
  if (installedgames.length === 0) {
    console.error("No installed games found.");
    return [];
  }
  const gamewithsaves = await Promise.all(
    installedgames.map(async (game) => {
      const saves = await getGameSavePath(user, game.appID, steampath);
      return {
        gameName: game.gameName.replace(/[^a-zA-Z0-9 ]/g, ""),
        sizeOnDisk: game.sizeOnDisk,
        lastPlayed: game.lastPlayed,
        versionID: game.versionID,
        appID: game.appID,
        saves: saves,
      };
    }),
  );
  return gamewithsaves.filter((game) => game.saves.length > 0);
}

/**
 * Takes the rootID and relative path of a file and sticks them together giving you a full path to the file.
 * While not necessarily needed, this intends to be used with cloudSaves, 
 * deriving the rootID and relative path from the database and using it to get
 * the file path target.
 * @param appID The app ID of the game.
 * @param rootID The root ID of the save file.
 * @param relativePath The relative path of the save file. Found in the database.
 * @precondition appID must be a valid Steam app ID, 
 *               rootID must be a valid root ID as defined in the Steam documentation, 
 *               relativePath must be a valid relative path as defined in the Steam remotecache.vdf.
 * @returns {Promise<string>} The full path to the file corresponding to the provided rootID and relative path.
 */
export async function cloudMatcher(appID: string, rootID: string, relativePath: string): Promise<string> {
  console.log("We are using cloudmatcher!")
  try {
    const steampath = await findSteamPath();
    if (!steampath) {
      throw new Error("Steam path not found.");
    }
    const user = await getLatestActivesteamUser(steampath);
    if (!user) {
      throw new Error("No active user found.");
    }
    const filedir = getBasePathFromRoot(rootID, steampath, user.accountID, appID);
    const fullpathnormalized = path.normalize(path.join(filedir, relativePath));
    console.log(`Attempting to match cloud save path: ${fullpathnormalized}`);
    

    return fullpathnormalized;
  }

  catch (error) {
    console.error("Error in cloudMatcher:", error);
  }
  return "";
}
