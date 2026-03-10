import { supabase } from "../auth/supabaseClient";
import { cloudSave } from "src/shared/types";

// Builds the file path for a cloud save based on the user ID, game name, save index, and save details.
export function buildCloudFilePath(
  userID: string,
  gameName: string,
  index: number,
  save: cloudSave
): string {
  if (save.appID === "1") { // Personal Files case
    return `${userID}/${gameName}/${save.fileName}.zip`;
  }
  return `${userID}/${gameName}/${index}/${save.fileName}`;
}

// Deletes a cloud save by removing the file from storage and deleting the corresponding database entry.
export async function deleteCloudSave(
  userID: string,
  gameName: string,
  appID: string,
  index: number,
  save: cloudSave) {

  const cloudFilePath = buildCloudFilePath(userID, gameName, index, save);

  const { error: storageError } = await supabase
    .storage
    .from("Game-save")
    .remove([cloudFilePath]);

  if (storageError) throw storageError;

  const { error: dbError } = await supabase
    .from("game_saves")
    .delete()
    .eq("user_id", userID)
    .eq("app_id", appID)
    .eq("relative_path", save.relativePath);

  if (dbError) throw dbError;
}