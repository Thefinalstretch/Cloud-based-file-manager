//importera modul som identifierar operativsystemet
import { dialog, BaseWindow } from "electron";
import * as os from "os";
import path from "path";
import fs from "fs";
import regedit from "regedit";
import { promisify } from "util";
import { exec } from "child_process";
import util from "util";
import { error } from "console";
import type { Foundfile, GameData, SteamGame, steamuser } from "src/types";

export function find_all_worlds() {
  function findMinecraftDirectory(): string | null {
    // vi kan möjligtvis också använda den här funktionen i downloadfunktionen, genom att vi laddar ner sparfilen
    // och sedan att appen läser localdirectory och unzippar filen i pathen.
    const platform = os.platform();
    const homedirectory = os.homedir();

    if (platform === "win32") {
      const appData = process.env.APPDATA;

      if (!appData) return null;

      return path.join(appData, ".minecraft", "saves");
    }
    if (platform === "darwin") {
      return path.join(
        homedirectory,
        "Library",
        "Application Support",
        "minecraft",
        "saves",
      ); // C:\\Users\User\Library\Application Support\minecraft\saves (bara ett exempel)
    }
    if (platform === "linux") {
      return path.join(homedirectory, ".minecraft", "saves");
    }

    return null;
  }
  const minecraftDirectory = findMinecraftDirectory();

  if (!minecraftDirectory || !fs.existsSync(minecraftDirectory)) {
    return [];
  }
  try {
    const items = fs.readdirSync(minecraftDirectory, { withFileTypes: true });

    const worlds = items
      .filter((item) => item.isDirectory())
      .map((item) => ({
        name: item.name,
        path: path.join(minecraftDirectory, item.name),
      }));

    console.log(`found ${worlds.length} worlds!`);
    worlds.forEach((element) => console.log(element.name));
    return worlds;
  } catch (err) {
    console.error("Error reading worlds:", err);
    return [];
  }
}

// const execPromise = util.promisify(exec);

const listkey = promisify(regedit.list);
//Genom att köra den genom promisify förvandlar vi den till en Promise. Det gör att vi kan skriva await, vilket gör koden mycket mer lättläst.
//regedit.list: Detta är huvudfunktionen. Den tar en lista på mappar i registret och hämtar allt som finns i dem.

//{
//   "HKCU\\Software\\Valve\\Steam": {
//     "exists": true,
//     "keys": ["ActiveProcess", "Apps", "Users"],
//     "values": {
//       "SteamPath": { "value": "C:/Program Files (x86)/Steam", "type": "REG_SZ" },
//       "Language": { "value": "swedish", "type": "REG_SZ" }
//     }
//   }
// }

const vbsdirectory = path.join(process.cwd(), "node_modules", "regedit", "vbs");
//process.cwd(): Betyder "Current Working Directory" – alltså mappen där ditt projekt körs ifrån.

regedit.setExternalVBSLocation(vbsdirectory);
//setExternalVBSLocation: Som vi märkte tidigare letar regedit på fel ställe efter sina skript när man kör med Vite. Dennna rad tvingar den att titta i din node_modules-mapp istället. Det är "fixen" för ditt error.

export async function find_steampath(): Promise<string | null> {
  try {
    const SteamRegistryKey = "HKCU\\Software\\Valve\\Steam";
    const result = (await listkey([SteamRegistryKey])) as any;
    const steamPathData = result[SteamRegistryKey]?.values?.SteamPath?.value;
    if (steamPathData) {
      return path.normalize(steamPathData);
    }
  } catch (error) {
    console.error("Error reading Steam path from registry:", error);
  }
  return null;
}

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

    const uniqueLibraryPaths = [...new Set(libraryPaths)];
    console.log("Found library paths:");
    uniqueLibraryPaths.forEach((Path) => {
      console.log(Path);
    });

    return uniqueLibraryPaths;
  } catch (error) {
    console.error("Error accessing libraryfolders.vdf:", error);
    return null;
  }
}

export async function getInstalledSteamGames(
  LibraryPaths: string[],
): Promise<SteamGame[]> {
  const installedgames: SteamGame[] = [];

  for (const librarypath of LibraryPaths) {
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

        //Använder regex för att plocka ut namn och AppID
        const nameMatch = filecontent.match(/"name"\s+"([^"]+)"/);
        const appidmatch = filecontent.match(/"appid"\s+"(\d+)"/);
        const installdirectorymatch = filecontent.match(
          /"installdir"\s+"([^"]+)"/,
        );
        const lastplayedmatch = filecontent.match(/"LastPlayed"\s+"(\d+)"/);
        const SizeOnDisk = filecontent.match(/"SizeOnDisk"\s+"(\d+)"/);
        const versionIDmatch = filecontent.match(/"buildid"\s+"(\d+)"/);

        if (nameMatch && appidmatch) {
          //konverterar unix-tid till ett läsbart datum
          let lastplayed = "Never Played";
          if (lastplayedmatch && lastplayedmatch[1] !== "0") {
            const unixtimestamp = parseInt(lastplayedmatch[1]);
            lastplayed = new Date(unixtimestamp * 1000).toLocaleDateString(
              "sv-SE",
            );
          }

          //konverterar storlek i byte till GB med 2 decimaler
          let sizeondiskformatted = "0 GB/Not installed";
          if (SizeOnDisk && SizeOnDisk[1] !== "0") {
            const bytes = BigInt(SizeOnDisk[1]);
            const gigabytes = Number(bytes) / 1024 ** 3;
            sizeondiskformatted = gigabytes.toFixed(2);
          }

          installedgames.push({
            name: nameMatch[1],
            appid: appidmatch[1],
            installDir: installdirectorymatch ? installdirectorymatch[1] : "",
            libraryPath: librarypath,
            lastplayed: lastplayed,
            SizeOnDisk: sizeondiskformatted,
            versionID: versionIDmatch ? versionIDmatch[1] : "",
          });
        }
      }
    } catch (error) {
      console.error(`Error reading steamapps in ${steamappsPath}:`, error);
    }
  }
  return installedgames;
}

export async function getLatestActiveSteamUser(
  steampath: string,
): Promise<steamuser | null> {
  //AccountID = SteamID64 - 76561197960265728
  const loginuserspath = path.join(steampath, "config", "loginusers.vdf");

  try {
    const loginuserscontent = await fs.promises.readFile(
      loginuserspath,
      "utf-8",
    );

    //Ger SteamID64 för den senaste användaren som loggat in, genom att leta efter "MostRecent" : "1" i loginusers.vdf
    const mostrecentuserregex =
      /"(765\d{14})"\s+\{([^}]*?"MostRecent"\s+"1"[^}]*?)\}/is;

    const latestusermatch = loginuserscontent.match(mostrecentuserregex);

    if (latestusermatch) {
      const SteamID64 = latestusermatch[1];

      const PersonaNameRegex = /"PersonaName"\s+"([^"]+)"/i;
      const AccountNameRegex = /"AccountName"\s+"([^"]+)"/i;
      const PersonaNameMatch = latestusermatch[2].match(PersonaNameRegex);
      const AccountNameMatch = latestusermatch[2].match(AccountNameRegex);

      const PersonaName = PersonaNameMatch ? PersonaNameMatch[1] : "Unknown";
      const AccountName = AccountNameMatch ? AccountNameMatch[1] : "Unknown";
      const accountid = (
        BigInt(SteamID64) - BigInt("76561197960265728")
      ).toString();
      const userpathdata = path.join(steampath, "userdata", accountid);
      return {
        SteamID64: SteamID64,
        AccountID: accountid,
        PersonaName: PersonaName,
        AccountName: AccountName,
        userpathdata: userpathdata,
      };
    }
  } catch (error) {
    console.error("Error reading loginusers.vdf:", error);
  }
  return null;
}

function getBasePathFromRoot(
  rootId: string,
  steamPath: string,
  accountid: string,
  appid: string,
): string {
  const userProfile = process.env.USERPROFILE || os.homedir();
  const localAppData =
    process.env.LOCALAPPDATA || path.join(os.homedir(), "AppData", "Local");
  const roamingAppData =
    process.env.APPDATA || path.join(os.homedir(), "AppData", "Roaming");

  switch (rootId) {
    case "0":
      //om rootid är 0. (standard steam cloud i userdata)
      return path.join(steamPath, "userdata", accountid, appid, "remote");

    case "1":
      //om rootid är 1. (för vissa spel som inte använder steam cloud, utan istället sparar i själva spelmappen)
      return path.join(steamPath, "steamapps", "common");
    case "2":
      //om rootid är 2. (för spel som sparar i dokument-mappen)
      return path.join(userProfile, "Documents");
    case "3":
      //om rootid är 3 (/Appdata/Local)
      return localAppData;
    case "4":
      //om rootid är 4 (/Appdata/Roaming)
      return roamingAppData;
    case "9":
      //om rootid är 9 (/Appdata/LocalLow)
      return path.join(userProfile, "AppData", "LocalLow");
    case "12":
      //om rootid är 12 (/Appdata/LocalLow)
      return path.join(userProfile, "AppData", "LocalLow");
    default:
      //Default fallback ifall rootId inte matchar någon av de kända. Vi loggar en varning och återgår till root 0.
      console.warn(`Unknown root ID: ${rootId}. Defaulting to root 0.`);
      return path.join(steamPath, "userdata", accountid, appid, "remote");
  }
}

export async function getGameSavePath(
  user: steamuser,
  appID: string,
  steamPath: string,
): Promise<Foundfile[]> {
  const remotecachepath = path.join(
    steamPath,
    "userdata",
    user.AccountID,
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

    const foundfiles: Foundfile[] = [];
    let match;
    while ((match = rootIDRegex.exec(remotecachecontent))) {
      const relativepath = match[1];
      const rootId = match[2];

      const basepath = getBasePathFromRoot(
        rootId,
        steamPath,
        user.AccountID,
        appID,
      );
      const fullpathraw = path.join(basepath, relativepath);
      const fullpathnormalized = path.normalize(fullpathraw);
      //Har en try-catch inuti loopen för att vi vill fortsätta iterera igenom alla filer även om det skulle vara något fel med en specifik fil, exempelvis att den inte finns längre på datorn.
      try {
        const stats = await fs.promises.stat(fullpathnormalized);
        const filesize = stats.size;
        const megabytes = (filesize / (1024 * 1024)).toFixed(3);

        foundfiles.push({
          filePath: fullpathnormalized,
          filename: path.basename(relativepath),
          filesize: megabytes.toString(),
        });
      } catch (error) {
        console.warn(
          `Could not get file stats for ${fullpathnormalized}:`,
          error,
        );
      }
    }
    return foundfiles;
  } catch (error) {
    console.error(
      `Error accessing remotecache.vdf (cloudcache) for user ${user.AccountID} and app ${appID}. Maybe it was installed locally?`,
      error,
    );
    return [];
  }
}

export async function getCompleteGameSaveData(): Promise<GameData[]> {
  const steampath = await find_steampath();
  if (!steampath) {
    console.error("Steam path not found.");
    return [];
  }
  const user = await getLatestActiveSteamUser(steampath);
  if (!user) {
    console.error("No active user found.");
    return [];
  }
  const librarypaths = await getLibraryVdfPaths(steampath);
  if (!librarypaths) {
    console.error("No library paths found.");
    return [];
  }
  const installedgames = await getInstalledSteamGames(librarypaths);
  if (installedgames.length === 0) {
    console.error("No installed games found.");
    return [];
  }
  const gamewithsaves = await Promise.all(
    installedgames.map(async (game) => {
      const saves = await getGameSavePath(user, game.appid, steampath);
      return {
        Gamename: game.name,
        SizeOnDisk: game.SizeOnDisk,
        lastplayed: game.lastplayed,
        versionID: game.versionID,
        AppID: game.appid,
        Saves: saves,
      };
    }),
  );
  return gamewithsaves.filter((game) => game.Saves.length > 0);
}
