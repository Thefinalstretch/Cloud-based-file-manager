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
import type { SteamGame } from "src/types";

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

        if (nameMatch && appidmatch) {
          installedgames.push({
            name: nameMatch[1],
            appid: appidmatch[1],
            installDir: installdirectorymatch ? installdirectorymatch[1] : "",
            libraryPath: librarypath,
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
): Promise<string | null> {
  //AccountID = SteamID64 - 76561197960265728
const loginuserspath = path.join(steampath, "config", "loginusers.vdf");

try{
  const loginuserscontent = await fs.promises.readFile(loginuserspath, "utf-8");

  //Ger SteamID64 för den senaste användaren som loggat in, genom att leta efter "MostRecent" : "1" i loginusers.vdf
  const mostrecentuserregex = /"(765\d{14})"\s+\{[^}]*?"MostRecent"\s+"1"/is
}
}
