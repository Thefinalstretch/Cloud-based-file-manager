import { supabase } from "../auth/supabaseClient";
import { cloudSave } from "src/shared/types";

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