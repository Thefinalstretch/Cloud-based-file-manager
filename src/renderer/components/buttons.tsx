import { supabase } from "../auth/supabaseClient";

/**
 * A button component for signing in with Google using Supabase authentication. 
 * When clicked, it initiates the OAuth flow for Google sign-in. 
 * Includes styling for a liquid glass effect and the Google logo.
 * @returns A styled button that triggers Google sign-in when clicked.
 */
export const Googlesigninbutton = () => {
  const SignInwithGoogle = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          skipBrowserRedirect: true,

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
    <button onClick={SignInwithGoogle}>
      <div className="flex w-[437px] h-[75px]  relative overflow-hidden  
                      hover:scale-105 transition-transform duration-200 
                      cursor-pointer liquid-glass-card transform-gpu will">

        <div className="flex-1 flex items-center pl-[15px] relative z-10">
          <img src="/devicon_google.svg" className="w-12 h-12" />
        </div>
        <span className="font-InterSemi text-[#EEDFD1] text-4xl 
                        items-center flex pr-[20px] relative z-10">
          Sign in using Google
        </span>
      </div>
    </button>
  );
};

/**
 * A button component for signing out the user using Supabase authentication.
 * @returns A button that triggers the sign-out process when clicked.
 */
export const SignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.log("Signoutfel:", error);
    }
  };

export const Signoutbutton = () => {
  return <button onClick={SignOut}>Logga ut</button>;
};

/**
 * A generalised button component that can be customised with a name and click handler.
 * @param props An object containing the button name and click handler.
 * @returns A styled button with the specified name and functionality.
 */
export const Generalisedbutton = 
  ({buttonName, onClick}: {buttonName:string, onClick: () => void} ) => {
  return (
     <button onClick={onClick}>
      <div className="flex w-[437px] h-[75px]  relative overflow-hidden  
                      hover:scale-105 transition-transform duration-200 
                      cursor-pointer liquid-glass-card 
                      transform-gpu will justify-center">

        <span className="font-InterSemi text-[#EEDFD1] 
                         text-4xl items-center flex pr-[20px] relative z-10">
          {buttonName}
        </span>
      </div>
    </button>
  ) 
}

// Smaller variant of generalised button.
export const GeneralisedbuttonSm = ({buttonName, onClick}: 
  {buttonName:string, onClick: () => void} ) => {
  return (
     <button onClick={onClick}>
      <div className="flex overflow-hidden hover:scale-105 pt-0
                      transition-transform duration-200 cursor-pointer 
                      liquid-glass-card-sm transform-gpu justify-center">

        <span className="font-InterSemi text-[#EEDFD1] text-xl 
                         items-center flex relative z-10">
          {buttonName}
        </span>
      </div>
    </button>
  ) 
}