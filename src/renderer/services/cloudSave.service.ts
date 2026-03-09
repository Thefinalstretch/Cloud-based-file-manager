import { supabase } from "../auth/supabaseClient";
import { cloudSave } from "src/shared/types";

// Builds the file path for a cloud save based on the user ID, game name, save index, and save details.
export function buildCloudFilePath(
  userId: string,
  gameName: string,
  saveIndex: number,
  save: cloudSave
): string {
  if (save.appID === "1") { // Personal Files case
    return `${userId}/${gameName}/${save.fileName}.zip`;
  }
  return `${userId}/${gameName}/${saveIndex}/${save.fileName}`;
}

// Deletes a cloud save by removing the file from storage and deleting the corresponding database entry.
export async function deleteCloudSave(
  userId: string,
  gameName: string,
  gameAppId: string,
  saveIndex: number,
  save: cloudSave) {

  const cloudFilePath = buildCloudFilePath(userId, gameName, saveIndex, save);

  const { error: storageError } = await supabase
    .storage
    .from("Game-save")
    .remove([cloudFilePath]);

  if (storageError) throw storageError;

  const { error: dbError } = await supabase
    .from("game_saves")
    .delete()
    .eq("user_id", userId)
    .eq("app_id", gameAppId)
    .eq("relative_path", save.relativePath);

  if (dbError) throw dbError;
}