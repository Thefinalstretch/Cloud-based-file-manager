import { supabase } from "../auth/supabaseClient";
import { foundFile } from "src/shared/types";

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