import { createClient } from "@supabase/supabase-js";

console.log(import.meta.env.VITE_SUPABASE_URL as string);
export const SupabaseURL = "https://gueunvtnebrpjgcpaixk.supabase.co/" as string;
export const SupabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1ZXVudnRuZWJycGpnY3BhaXhrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDE0NjgyMiwiZXhwIjoyMDg1NzIyODIyfQ.CL0za2IWOPrdvBks2vB1ZdWz5H3oEPOYb7oMzKwPhwg" as string;
// export const SupabaseKey = "sb_publishable_7gVhaErk-SgFFaDwzDs5Pw_qO4PH6iM"


export const supabase = createClient(SupabaseURL, SupabaseKey, {
  auth: {
    autoRefreshToken: true, // Sparar sessionen i Electron
    persistSession: true, // Uppdaterar tokens automatiskt
    detectSessionInUrl: true, // VIKTIGT: Electron sköter inte URL-auth som webben
  },
});
