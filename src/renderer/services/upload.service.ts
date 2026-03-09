import { supabase } from "../auth/supabaseClient";
import { foundFile } from "src/shared/types";

/**
 * Passes game save file data and metadata to the Electron Main Process via an IPC bridge to handle the actual file upload.
 * @example 
 * results in a call to window.electron.uploadsave_separate
 * await uploadSave(currentFile, "user123", "app456", "Skyrim", 0);
 * @param save - The object containing the file's path, name, and relative path metadata
 * @param userId - The unique identifier of the authenticated user
 * @param appID - The unique identifier for the specific game
 * @param gameName - The title of the game
 * @param index - The conflict resolution index for the file
 * @precondition index is not negative. The window.electron object must be exposed via preload.
 * @complexity Theta(1), as the function merely passes arguments to the IPC bridge without iterating.
 * @returns {Promise<any>} Returns a promise that resolves when the Electron upload process completes.
 */
export async function uploadSave(
  save: foundFile,
  userId: string,
  appID: string,
  gameName: string,
  index: number,
) {
  return await window.electron.uploadsave_separate(
    save.filePath,
    userId,
    appID,
    gameName,
    save.fileName,
    save.relativePath,
    save.rootID,
    index,
  );
}

/**
 * Recursively queries the Supabase database to find the next available non-conflicting index for a file upload.
 * If a file with the exact same name but a different relative path already exists, it increases the index and tries again.
 * @example 
 * returns 0 if no files conflict, or a higher integer like 1 or 2 if conflicts exists
 * @param save - The file object being checked against the database 
 * @param userId - The unique identifier of the authenticated user
 * @param appID - The unique identifier for the specific game
 * @param index - The current index being tested for conflicts (defaults to 0)
 * @precondition index is not negative.
 * @complexity Theta(N), where N is the number of conflicting files in the database with the exact same file name.
 * @returns {Promise<number>} Returns the first available non-conflicting integer index.
 */

export async function findUploadIndex(
  save: foundFile,
  userId: string,
  appID: string,
  index: number = 0,
): Promise<number> {
  const { data: dataExactFile, error: errorExactFile } = await supabase
    .from("game_saves")
    .select("index")
    .eq("relative_path", save.relativePath)
    .eq("user_id", userId)
    .eq("app_id", appID);

  if (errorExactFile) {
    throw errorExactFile;
  }

  if (dataExactFile.length !== 0) {
    return dataExactFile[0].index;
  }

  const { data: dataBaseFileName, error: errorFileName } = await supabase
    .from("game_saves")
    .select("id")
    .eq("file_name", save.fileName)
    .eq("user_id", userId)
    .eq("app_id", appID)
    .eq("index", index);

  if (errorFileName) {
    throw errorFileName;
  }

  if (dataBaseFileName.length === 0) {
    return index;
  }
  // variant: N - index
  // Where N is the number of conflicting files.
  return await findUploadIndex(save, userId, appID, index + 1);
}

export async function uploadSaveWithDuplicateHandling(
  save: foundFile,
  userId: string,
  appID: string,
  gameName: string,
) {
  const index = await findUploadIndex(save, userId, appID, 0);
  return await uploadSave(save, userId, appID, gameName, index);
}