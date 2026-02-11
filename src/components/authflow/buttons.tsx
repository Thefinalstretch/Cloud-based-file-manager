import { supabase } from "./supabase-vite";

export const Googlesigninbutton = () => {
  const SignInwithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          skipBrowserRedirect: true,
          redirectTo: "http://localhost:5173/auth/callback",
        },
      });
      if (error) throw error;

      if (data?.url) {
        console.log("Redirecting to:", data.url);
        window.open(data.url, "_self");
      }
    } catch (error) {
      console.log("Inloggningsfel:", error);
    }
  };

  return <button onClick={SignInwithGoogle}>Logga in med Google</button>;
};

export const Signoutbutton = () => {
  const SignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.log("Signoutfel:", error);
    }
  };
  return <button onClick={SignOut}>Logga ut</button>;
};
