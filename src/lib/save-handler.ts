import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import {
  SupabaseKey,
  SupabaseURL,
} from "src/components/authflow/supabase-vite";

// sätt in dessa i .env senare om det behövs

// samma url och key som frontend, men annan Client

const supabase = createClient(SupabaseURL, SupabaseKey);

//denna funktion laddar upp en zipfil till supabase

export async function uploadGameSave(
  filePath: string,
  userId: string,
  gameId: string,
) {
  console.log("startar uppladdning för: ${filePath}");
  //kolla om filen finns
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error("Kunde inte hitta filen: ${filePath}");
    }

    // förbered streamen
    const fileStream = fs.createReadStream(filePath);
    // bestäm supabase cloud path
    const fileName = path.basename(filePath);
    const cloudPath = "${userId}/${gameId}/${fileName}";

    //ladda upp till SUPABASE
    const { data, error } = await supabase.storage
      .from("game-save")
      .upload(cloudPath, fileStream, {
        contentType: "application/zip",
        upsert: true,
        duplex: "half", // behövs för att strömmar ska knna funka i Node.js
      });

    if (error) {
      console.error("Supabase Error: ", error);
      throw error;
    }

    console.log("Uppladdning slutförd: ", data);
    return { success: true, data };
  } catch (err) {
    console.error("Uppladdningen misslyckades", err);
    return { success: false, error: err };
  }
}
