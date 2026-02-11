import { supabase } from "./supabase-vite";

export const Googlesigninbutton = () => {
  const SignInwithGoogle = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: "http://localhost:5173",
          queryParams: {
            access_type: "offline",
            prompt: "select_account",
          },
        },
      });
      if (error) throw error;

      console.log(data);
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.log("Inloggningsfel:", error);
    }
  };

  return (
    <button type="button" onClick={SignInwithGoogle}>
      Logga in med Google
    </button>
  );
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
