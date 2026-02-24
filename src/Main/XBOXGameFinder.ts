import { exec } from "child_process";
import util from "util";
import path from "path";
import fs from "fs";
import { XboxGame } from "src/types";

const execPromise = util.promisify(exec);

export async function find_xbox_games(): Promise<XboxGame[]> {
  try {
    const psCommand = `
      $games = Get-ChildItem "$env:LOCALAPPDATA\\Packages" -Directory | Where-Object { Test-Path "$($_.FullName)\\SystemAppData\\wgs" };
      $result = Get-AppxPackage | Where-Object { $games.Name -contains $_.PackageFamilyName } | Select-Object Name, PackageFamilyName, InstallLocation;
      if ($result) { $result | ConvertTo-Json -Compress } else { "[]" }
    `;

    const { stdout } = await execPromise(psCommand, {
      shell: "powershell.exe",
    });

    let games = JSON.parse(stdout.trim());

    if (!Array.isArray(games)) {
      games = [games];
    }

    console.log(
      `found ${games.length} Xbox/Windows store game(s) with save files`,
    );
    return games;
  } catch (error) {
    console.error("Encountered Error while finding Xbox games:", error);
    return [];
  }
}

export async function get_xbox_save_path(
  packageFamilyName: string,
): Promise<string | null> {
  try {
    const localAppData = process.env.LOCALAPPDATA;

    if (!localAppData) {
      console.error("Could not find LOCALAPPDATA environment variable.");
      return null;
    }

    const saveFolder = path.join(
      localAppData,
      "Packages",
      packageFamilyName,
      "SystemAppData",
      "wgs",
    );

    if (fs.existsSync(saveFolder)) {
      console.log(`Found Xbox save folder for ${packageFamilyName}`);
      return saveFolder;
    } else {
      console.log(`No save folder found at ${saveFolder}`);
      return null;
    }
  } catch (error) {
    console.error(
      `Error finding Xbox save path for ${packageFamilyName}:`,
      error,
    );
    return null;
  }
}
