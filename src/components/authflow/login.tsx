import { supabase } from "./supabase-vite";

export const SignInwithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {},
    });
    if (error) throw error;
  } catch {
    console.log("Inloggningsfel:", error);
  } finally {
  }
};
