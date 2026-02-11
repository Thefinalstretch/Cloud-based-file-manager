import { createClient } from "@supabase/supabase-js";

const SupabaseURL = import.meta.env.VITE_SUPABASE_URL as string;
const SupabaseKey = import.meta.env
  .VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY as string;

export const supabase = createClient(SupabaseURL, SupabaseKey, {
  auth: {
    autoRefreshToken: true, // Sparar sessionen i Electron
    persistSession: true, // Uppdaterar tokens automatiskt
    detectSessionInUrl: false, // VIKTIGT: Electron sköter inte URL-auth som webben
  },
});
