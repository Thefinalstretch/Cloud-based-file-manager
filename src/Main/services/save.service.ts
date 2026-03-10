import fs from "fs";
import path from "path";
import os from "os";
import archiver from "archiver";
import { cloudSave } from "../../shared/types";
import extract from "extract-zip";
import { supabase } from "./supabase.client";


/**
 * Zips a source directory or file to the specified output path.
 * @param sourceDir The directory path 
 * @param outPath
 * @returns 
 */
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

/**
 * Uploads a folder and its contents to the cloud storage.
 * Has been adapted to only handle "Personal files". 
 * A such only uploads as if the files name is the gameID.
 * @param folderPath The path to the folder to upload. Such as "C:/Users/Username/Documents/MyGameSaves"
 * @param userID ID string for the user
 * @param gameID ID string for the game
 * @precondition The folderPath must exist and be a directory. userID and gameID must be valid identifiers.
 * @complexity Theta(N) where N is the number of files and subdirectories within the folder, due to zipping and uploading processes.
 * @returns {Promise<{ success: boolean; data: { id: string; path: string; fullPath: string }; error?: undefined }{ success: boolean; error: any; data?: undefined }>}
 */
export async function uploadFolder(
  folderPath: string,
  userID: string,
  gameID: string,
): Promise<{ success: boolean; data: { id: string; path: string; fullPath: string; }; error?: undefined; } | { success: boolean; error: any; data?: undefined; }> {
  console.log(`startar uppladdning för: '${folderPath}`);
  //kolla om filen finns
  try {
    //skapar en temporär zipfilspath
    const zipName = `${gameID}-${Date.now()}.zip`;
    const tempZipPath = path.join(os.tmpdir(), zipName);

    //zippar valda mappen
    console.log(`Zippar till ${tempZipPath}`);
    await zipDirectory(folderPath, tempZipPath);

    // Läser zipfilen, mappen har blivit en fil, så streams funkar nu!!!
    const fileStream = fs.createReadStream(tempZipPath);

    //ladda upp steget

    console.log(gameID, userID);
    const cloudPath = `${userID}/Personal Files/${gameID}.zip`;
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
      .eq("user_id", userID)
      .eq("app_id", "1")
      .eq("relative_path", folderPath)
      .maybeSingle();

    if (findError) throw findError;

    const row = {
      id: existing?.id, // include PK if found
      user_id: userID,
      game_name: "Personal Files",
      app_id: "1",
      file_name: gameID,
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

/**
 * Uploads a single game save file to the cloud storage.
 * Could have been better to just use foundFile and gameData
 * @param filePath The path to the file to upload.
 * @param userID ID string for the user
 * @param appID ID string for the application
 * @param gameName Name of the game
 * @param fileName Name of the file
 * @param relativePath Relative path of the file
 * @param rootID Root identifier. Upload to later identify the original file location when the file is downloaded again.
 * @param index An integer index to handle duplicate file names. This should be determined by the findUploadIndex function before calling this upload function.
 * @precondition The filePath must exist and be a file. userID, appID, gameName, fileName, relativePath, rootID must be valid identifiers. index must be a non-negative integer determined by findUploadIndex.
 * @complexity Theta(1) for the upload operation itself, but overall complexity depends on the size of the file being uploaded and network conditions.
 * @returns {Promise<{ success: boolean; data: { id: string; path: string; fullPath: string; }; error?: undefined; } | { success: boolean; error: any; data?: undefined; }>}
 */
export async function uploadGameSave_separate(
  filePath: string,
  userID: string,
  appID: string,
  gameName: string,
  fileName: string,
  relativePath: string,
  rootID: string,
  index: number

): Promise<{ success: boolean; data: { id: string; path: string; fullPath: string; }; 
          error?: undefined; } | { success: boolean; error: any; data?: undefined; }> {
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

/**
 * Simply fetches all cloud saves for a given user from the database.
 * @param userID ID string for the user
 * @precondition userID must be valid.
 * @complexity Theta(N) where N is the number of saves associated with the user in the database.
 * @returns {Promise<{ success: boolean; saves: cloudSave[] }>} An object containing a success flag and an array of cloudSave objects.
 */
export async function fetchCloudSaves(userID: string): Promise<{ success: boolean; saves: cloudSave[]; }> {
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
/**
 * Download a save file from coud storage using a signed URL.
 * In the event that the file being downloaded is a folder (A personal file.), 
 * we simply remove the existing target first, as there seems to be overwrite issues with folders.
 * The function also handles extraction of the zip file and cleanup of the temp file.
 * @param signedUrl The signed URL that initiates the download of the file. Using the PC browser instead of directly downloading from the application
 * @param targetFolder The local path where the downloaded file should be saved.
 * @param removeThisFolder Optional parameter. If provided, this folder will be removed before downloading the new file.
 * @precondition signedUrl must be a valid URL that points to a downloadable file. targetFolder must be a valid local path. If removeThisFolder is provided, it must be a valid local path that can be safely deleted.
 * @complexity Theta(N) where N is the size of the file being downloaded, due to the download and extraction processes.
 * @returns {promise<{ success: boolean }>} A promise indicating the sucess or failure of the download.
 */
export async function downloadSave(signedUrl: string, 
                                   targetFolder: string, 
                                   removeThisFolder?: string): Promise<{ success: boolean; }> {
  // If the file is a folder download, because of weird overrite issues, we can't overwrite and instead remove it beforehand.
  // If a remove folder path is given, remove it.
  if(removeThisFolder){
    fs.rmSync(removeThisFolder, { recursive: true, force: true });
  }
  
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

// A simple function to check if a file or directory exists at the given path.
// Returns true if it exists, false otherwise.
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
