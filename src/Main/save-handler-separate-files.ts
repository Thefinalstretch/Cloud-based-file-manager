import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import os from "os";
import archiver from "archiver";
import { use } from "react";

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
    await zipSource(folderPath, tempZipPath);

    // Läser zipfilen, mappen har blivit en fil, så streams funkar nu!!!
    const fileStream = fs.createReadStream(tempZipPath);

    //ladda upp steget

    console.log(gameId, userId);
    const cloudPath = `${userId}/${gameId}/saveF.zip`;
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
    const { error: dbError } = await supabase.from("game_saves").insert([
      {
        user_id: userId,
        game_name: gameId,
        storage_path: cloudPath,
        file_size_mb: Size_MB,
      },
    ]);

    if (dbError) throw dbError;

    console.log("uppladdningen slutförd", data);
    return { success: true, data };
  } catch (err) {
    console.log("uppladdningen misslyckades", err);

    return { success: false, error: err };
  }
}
