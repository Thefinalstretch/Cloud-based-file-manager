import { supabase } from "../auth/supabaseClient";
import { cloudSave } from "src/shared/types";
import { buildCloudFilePath } from "./cloudSave.service";
import { removeEnd } from "../util/saveHelpers";

/**
 * Creates a signed URL for downloading a cloud save.
 * @param userId The ID of the user whose save is to be downloaded.
 * @param gameName The name of the game for which to download the save.
 * @param saveIndex The index of the save within the database, used for constructing the file path.
 * @param save The cloud save object for which to create a signed URL.
 * @returns A promise resolving to the signed URL for the cloud save.
 */
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
/**
 * Determines the local path for a cloud save.
 * Handles the two cases between if the path is a game save or a "personal file" save.
 * @example 
 * //Results in "C:\Users\jonat\Programmering\code\homework8"
 * LocalSavePath(
 * gameName: Personal files,
 * appID: 1,
 * fileName: homework8.zip,
 * relativePath: C:\Users\jonat\Programmering\code\homework8)
 * @param save The cloud save object for which to determine the local path.
 * @returns {promise<string>} a promise string with the local path for the cloud save.
 */
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
/**
 * Downloads a cloud save from a signed URL.
 * @param signedUrl The signed URL for the cloud save.
 * @param save The cloud save object to download.
 * @param localFilePath The local file path where the cloud save should be downloaded.
 * @returns {promise<void>} A promise that resolves when the download is complete.
 */
export async function downloadCloudSave( 
  signedUrl: string,
  save: cloudSave,
  localFilePath: string
): Promise<void> {

  const targetFolder = removeEnd(localFilePath);

  if (save.appID === "1") {
    await window.electron.downloadSave(signedUrl, targetFolder, localFilePath);
    return;
  }

  await window.electron.downloadSave(signedUrl, targetFolder);
}