import fs from "fs";
import path from "path";
import os from "os";
import archiver from "archiver";
import { cloudSave } from "../../shared/types";
import extract from "extract-zip";
import { supabase } from "./supabase.client";

// sätt in dessa i .env senare om det behövs

// samma url och key som frontend, men annan Client

// const supabase = createClient(
//   import.meta.env.VITE_SUPABASE_URL,
//   import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
// );
// const SUPABASE_URL = "https://gueunvtnebrpjgcpaixk.supabase.co";
// const SUPABASE_KEY = "sb_publishable_7gVhaErk-SgFFaDwzDs5Pw_qO4PH6iM";
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

function zipDirectory(sourceDir: string, outPath: string): Promise<void> {
  const archive = archiver("zip", { zlib: { level: 6 } });
  const stream = fs.createWriteStream(outPath);

  return new Promise((resolve, reject) => {
    archive
      .directory(sourceDir, path.basename(sourceDir))
      .on("error", (err) => reject(err))
      .pipe(stream);

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
  index: number

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
    const cloudPath = `${userID}/${gameName}/${index}/${fileName}`;
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
    console.log("Given index:", index)
    const { error: dbError } = await supabase.from("game_saves").upsert([
      {
        user_id: userID,
        game_name: gameName,
        storage_path: cloudPath,
        file_name: fileName,
        file_size_mb: Size_MB,
        app_id: appID,
        relative_path: relativePath,
        root_id: rootID,
        index: index
      },
    ], { onConflict: "user_id,app_id,relative_path" });

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
      
      
      const gameObjects: cloudSave[] = data.map((object) => ({
        gameName: object.game_name,
        appID: object.app_id,
        fileName: object.file_name,
        lastUpdated: object.last_updated,
        fileSize: object.file_size_mb,
        storagePath: object.storage_path,
        relativePath: object.relative_path,
        rootID: object.root_id,
        index: object.index
      }));
      return { success: true, saves: gameObjects };
    }

  } catch {
    console.log("hämtning av sparfiler misslyckades");
    return { success: false, saves: [] };
  }
}

export async function downloadSave(signedUrl: string, 
                                   targetFolder: string, 
                                   removeThisFolder?: string) {
  // If the file is a folder download, because of weird overrite issues, we can't overwrite and instead remove it beforehand.
  // If a remove folder path is given, remove it.
  console.log("Just before removal:")
  if(removeThisFolder){
    console.log("Attemting to remove file")
    fs.rmSync(removeThisFolder, { recursive: true, force: true });
    console.log("Removed File")
  }
  
  const TempZipPath2 = path.join(targetFolder, "temp_download_file");
  console.log("Here is TempZipPath:", TempZipPath2);
  console.log("targetFolder:", JSON.stringify(targetFolder))
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
    console.log("Extraction happening")
    await extract(TempZipPath2, { dir: targetFolder });
    console.log("Extraction done")

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

export async function 
    checkIfFileExists(localDirectory: string): Promise<boolean> {
  try {
    await fs.promises.access(localDirectory);
    return true;
} 
  catch (error)
     {
      console.log("koll av fil misslyckades (troligen finns filen inte)", error);
      return false;
    };
}

export async function uploadFolder(
  folderPath: string,
  userId: string,
  gameId: string,
) {
  console.log(`startar uppladdning för: '${folderPath}`);
  //kolla om filen finns
  try {
    //skapar en temporär zipfilspath
    const zipName = `${gameId}-${Date.now()}.zip`;
    const tempZipPath = path.join(os.tmpdir(), zipName);

    //zippar valda mappen
    console.log(`Zippar till ${tempZipPath}`);
    await zipDirectory(folderPath, tempZipPath);

    // Läser zipfilen, mappen har blivit en fil, så streams funkar nu!!!
    const fileStream = fs.createReadStream(tempZipPath);

    //ladda upp steget

    console.log(gameId, userId);
    const cloudPath = `${userId}/Personal Files/${gameId}.zip`;
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
    const Size_MB = (filesize / (1024 * 1024)).toFixed(4);

    //cleanup, raderar tempfilen
    fs.unlinkSync(tempZipPath);

    if (error) throw error;

    // om uppladdningen lyckades, kan vi spara metadata i databasen, t.ex. en referens till filen i storage och vilken användare det tillhör
    console.log("Updating database record");
    const { data: existing, error: findError } = await supabase
      .from("game_saves")
      .select("id")
      .eq("user_id", userId)
      .eq("app_id", "1")
      .eq("relative_path", folderPath)
      .maybeSingle();

    if (findError) throw findError;

const row = {
  id: existing?.id, // include PK if found
  user_id: userId,
  game_name: "Personal Files",
  app_id: "1",
  file_name: gameId,
  relative_path: folderPath,
  storage_path: cloudPath,
  file_size_mb: Size_MB,
};

const { error: dbError } = await supabase
  .from("game_saves")
  .upsert(row, { onConflict: "user_id,app_id,relative_path" });

if (dbError) throw dbError;

    console.log("uppladdningen slutförd", data);
    return { success: true, data };
  } catch (err) {
    console.log("uppladdningen misslyckades", err);

    return { success: false, error: err };
  }
}
