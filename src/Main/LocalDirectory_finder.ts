//importera modul som identifierar operativsystemet
import { dialog, BaseWindow } from "electron";
import * as os from "os";
import path from "path";
import fs from "fs";
import regedit from "regedit";
import { promisify } from "util";
import {exec} from 'child_process'
import util from 'util'
import { error } from "console";


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
    worlds.forEach(element => console.log(element.name));
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

const vbsdirectory = path.join(process.cwd(), 'node_modules', 'regedit', 'vbs');
//process.cwd(): Betyder "Current Working Directory" – alltså mappen där ditt projekt körs ifrån.


regedit.setExternalVBSLocation(vbsdirectory);
//setExternalVBSLocation: Som vi märkte tidigare letar regedit på fel ställe efter sina skript när man kör med Vite. Dennna rad tvingar den att titta i din node_modules-mapp istället. Det är "fixen" för ditt error.

export async function find_steampath(): Promise<string | null> {


  try {
    const SteamRegistryKey = "HKCU\\Software\\Valve\\Steam";
    const result = await listkey([SteamRegistryKey]) as any;
    const steamPathData = result[SteamRegistryKey]?.values?.SteamPath?.value;
    if (steamPathData) {
      return path.normalize(steamPathData);
    }
  } catch (error) {
    console.error("Error reading Steam path from registry:", error);

  }
  return null ;
}
  
  
  
  
  
  
//   function find_steampath() {
//     try {
//       const hive = HKEY.HKEY_CURRENT_USER;
//       const SteamRegistryKey = "Software\\Valve\\Steam";
//       const steamroot = enumerateValues(hive, SteamRegistryKey).find(
//         (value) => value.name === "SteamPath",
//       );

//       if (steamroot && typeof steamroot.data === "string") {
//         return path.normalize(steamroot.data); //path.normalize hanterar städar upp filvägen så att den är korrekt formaterad för operativsystemet ex. inte innehåller "\\"
//       }
//     } catch (error) {
//       console.error(error);
//     }
//     return null;
//   }

//   const steampath = find_steampath();
//   if (steampath) {
//     const gamespath = path.join(steampath, "steamapps");
//     if (fs.existsSync(gamespath)) {
//       //tittar om denn gamepath faktiskt finns på appen
//     }
//     return null;
//   }
// }
