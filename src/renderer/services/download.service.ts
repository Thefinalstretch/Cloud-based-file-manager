import { supabase } from "../auth/supabaseClient";
import { cloudSave } from "src/shared/types";
import { buildCloudFilePath } from "./cloudSave.service";
import { removeEnd } from "../util/saveHelpers";

export async function createCloudSaveSignedUrl(
  userId: string,
  gameName: string,
  saveIndex: number,
  save: cloudSave) {
    
  const cloudFilePath = buildCloudFilePath(
    userId,
    gameName,
    saveIndex,
    save,
  );

  const { data, error } = await supabase
    .storage
    .from("Game-save")
    .createSignedUrl(cloudFilePath, 60);

  if (error || !data) {
    throw error ?? new Error("Failed to create signed URL");
  }

  return data.signedUrl;
}

export async function LocalSavePath(save: cloudSave): Promise<string> {
  if (save.appID === "1") {
    return save.relativePath;
  }

  return await window.electron.cloudMatcher(
    save.appID,
    save.rootID,
    save.relativePath,
  );
}

export async function downloadCloudSave( 
  signedUrl: string,
  save: cloudSave,
  localFilePath: string
) {

  const targetFolder = removeEnd(localFilePath);

  if (save.appID === "1") {
    await window.electron.downloadSave(signedUrl, targetFolder, localFilePath);
    return;
  }

  await window.electron.downloadSave(signedUrl, targetFolder);
}