import { createClient } from "@supabase/supabase-js";
import { SupabaseKey, SupabaseURL } from "../../shared/supabase";

export const supabase = createClient(SupabaseURL, SupabaseKey, {
  auth: {
    autoRefreshToken: true, // Sparar sessionen i Electron
    persistSession: true, // Uppdaterar tokens automatiskt
    detectSessionInUrl: true, // VIKTIGT: Electron sköter inte URL-auth som webben
  },
});