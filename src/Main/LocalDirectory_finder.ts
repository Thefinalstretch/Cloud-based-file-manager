//importera modul som identifierar operativsystemet
import { dialog, BaseWindow } from "electron";
import * as os from "os";
import { HKEY, enumerateValues } from "registry-js";
import path from "path";
import fs from "fs";

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
    return worlds;
  } catch (err) {
    console.error("Error reading worlds:", err);
    return [];
  }
}

export function find_all_steam_games() {
  function find_steampath() {
    try {
      const hive = HKEY.HKEY_CURRENT_USER;
      const SteamRegistryKey = "Software\\Valve\\Steam";
      const steamroot = enumerateValues(hive, SteamRegistryKey).find(
        (value) => value.name === "SteamPath",
      );

      if (steamroot && typeof steamroot.data === "string") {
        return path.normalize(steamroot.data); //path.normalize hanterar städar upp filvägen så att den är korrekt formaterad för operativsystemet ex. inte innehåller "\\"
      }
    } catch (error) {
      console.error(error);
    }
    return null;
  }

  const steampath = find_steampath();
  if (steampath) {
    const gamespath = path.join(steampath, "steamapps", "libraryfolders.vdf");
    if (fs.existsSync(gamespath)) {
      //Behöver titta i min libraryfolders.vdf fil för att hitta alla steam librarys, eftersom användare kan ha flera librarys på olika diskar, och sedan titta i varje librarys steamapps/appmanifest.acf mapp för att hitta spelmapparna
      const libraryFolders = fs.readFileSync(gamespath, "utf-8");
      const libraryPaths: string[] = [];
      const libraryRegex = /"path"\s+"([^"]+)"/g
      const appManifestIDRegex = /\s+"apps"\s+\{([\s\S]*?)\}/g
      let match: RegExpExecArray | null;

      while (match = libraryRegex.exec(libraryFolders)) {
        libraryPaths.push(match[1]);
      }


// // 1. Hitta varje bibliotek (0, 1, 2...)
// while ((folderMatch = libraryBlockRegex.exec(vdfContent)) !== null) {
//     // blockText är nu ALLT innehåll för ETT bibliotek (t.ex. bibliotek "0")
//     const blockText = folderMatch[1];

//     // 2. Hitta SÖKVÄGEN i just detta block
//     const pathMatch = /"path"\s+"([^"]+)"/.exec(blockText);
//     const currentPath = pathMatch ? pathMatch[1] : "Okänd sökväg";

//     console.log(`--- Skannar bibliotek: ${currentPath} ---`);

//     // 3. Hitta APPS-BLOCKET i just detta block
//     const appsBlockMatch = /"apps"\s*\{([\s\S]*?)\}/.exec(blockText);
    
//     if (appsBlockMatch) {
//         const appsInThisFolder = appsBlockMatch[1];
        
//         // 4. Hitta alla ID:n i just detta biblioteks apps-lista
//         const idRegex = /"(\d+)"\s+"\d+"/g;
//         let idMatch;
        
//         while ((idMatch = idRegex.exec(appsInThisFolder)) !== null) {
//             const appId = idMatch[1];
//             console.log(`Spelet ${appId} ligger på ${currentPath}`);
//             // Här kan du nu spara: { path: currentPath, appId: appId }
//         }
//     }
// }

    return libraryPaths;
  }
}
