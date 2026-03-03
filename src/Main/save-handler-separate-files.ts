import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import os from "os";
import archiver from "archiver";
import { use } from "react";
import { Cloudsave } from "../types";
import extract from "extract-zip";
import { error } from "console";

// sätt in dessa i .env senare om det behövs

// samma url och key som frontend, men annan Client

// const supabase = createClient(
//   import.meta.env.VITE_SUPABASE_URL,
//   import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
// );
// const SUPABASE_URL = "https://gueunvtnebrpjgcpaixk.supabase.co";
// const SUPABASE_KEY = "sb_publishable_7gVhaErk-SgFFaDwzDs5Pw_qO4PH6iM";
const supabase = createClient(
  process.env.VITE_SUPABASE_URL as string,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY as string,
);
//helper, denna funktion skapar en zipfil av vald mapp

function zipSource(sourceDir: string, outPath: string): Promise<void> {
  const archive = archiver("zip", { zlib: { level: 6 } });
  const stream = fs.createWriteStream(outPath);

  return new Promise((resolve, reject) => {
    archive
      .on("error", (err) => reject(err))
      .pipe(stream);

    const stats = fs.statSync(sourceDir);
    if (stats.isDirectory()) {
      archive.directory(sourceDir, false);
    } else {
      archive.file(sourceDir, { name: path.basename(sourceDir) });
    }

    stream.on("close", () => resolve());
    archive.finalize();
  });
}
//denna funktion laddar upp en zipfil till supabase

export async function uploadGameSave_separate(
  filePath: string,
  userID: string,
  appID: string,
  gameName: string,
  fileName: string,
  relativePath: string,
  rootID: string,

) {
  console.log(`startar uppladdning för: '${filePath}`);
  //kolla om filen finns
  try {
    //skapar en temporär zipfilspath
    const zipName = `${gameName}-${Date.now()}.zip`;
    const tempZipPath = path.join(os.tmpdir(), zipName);

    //zippar valda mappen
    console.log(`Zippar till ${tempZipPath}`);
    await zipSource(filePath, tempZipPath);

    // Läser zipfilen, mappen har blivit en fil, så streams funkar nu!!!
    const fileStream = fs.createReadStream(tempZipPath);

    //ladda upp steget

    console.log(gameName, userID);
    const cloudPath = `${userID}/${gameName}/${fileName}`;
    console.log(`laddar upp till  ${cloudPath}`);

    const { data, error } = await supabase.storage
      .from("Game-save")
      .upload(cloudPath, fileStream, {
        contentType: "application/zip",
        upsert: true,
        cacheControl: "0",
        duplex: "half",
      });

    const filesize = fs.statSync(tempZipPath).size;
    const Size_MB = (filesize / (1024 * 1024)).toFixed(3);

    //cleanup, raderar tempfilen
    fs.unlinkSync(tempZipPath);

    if (error) throw error;

    // om uppladdningen lyckades, kan vi spara metadata i databasen, t.ex. en referens till filen i storage och vilken användare det tillhör
    console.log("Updating database record");
    const { error: dbError } = await supabase.from("game_saves").upsert([
      {
        user_id: userID,
        game_name: gameName,
        storage_path: cloudPath,
        file_name: fileName,
        file_size_mb: Size_MB,
        app_id: appID,
        relative_path: relativePath,
        root_id: rootID
      },
    ], { onConflict: "user_id,app_id,file_name" });

    if (dbError) throw dbError;

    console.log("uppladdningen slutförd", data);
    return { success: true, data };
  } catch (err) {
    console.log("uppladdningen misslyckades", err);

    return { success: false, error: err };
  }
}

export async function fetchCloudSaves(userID: string) {
  try {
    const { data, error } = await supabase
      .from("game_saves")
      .select("*")
      .eq("user_id", userID);
    if (data) {
      const gameObjects: Cloudsave[] = data.map((object) => ({
        gameName: object.game_name,
        appID: object.app_id,
        fileName: object.file_name,
        last_updated: object.last_updated,
        file_size: object.file_size_mb,
        storage_path: object.storage_path,
        relativePath: object.relative_path,
        rootID: object.root_id,
      }));
      return { success: true, saves: gameObjects };
    }

  } catch {
    console.log("hämtning av sparfiler misslyckades");
    return { success: false, saves: [] };
  }
}

export async function downloadSave(signedUrl: string, targetFolder: string) {
  const TempZipPath2 = path.join(targetFolder, "temp_download_file");
  try {
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }
    const response = await fetch(signedUrl);
    if (!response.ok) {
      throw new Error(`unexpected error${response.statusText} `);
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(TempZipPath2, buffer);

    await extract(TempZipPath2, { dir: targetFolder });

    fs.unlinkSync(TempZipPath2);

    return { success: true };
  } catch (error) {
    if (fs.existsSync(TempZipPath2)) {
      fs.unlinkSync(TempZipPath2);
    }
    console.error("download failed", error);

    throw error;
  }
}

export async function checkIfFileExists(Localdirectory: string): Promise<boolean> {
  try {
    await fs.promises.access(Localdirectory);
    return true;
} 
  catch (error)
     {
      console.log("koll av fil misslyckades (troligen finns filen inte)", error);
      return false;
    };
}