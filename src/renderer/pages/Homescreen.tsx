import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthContext } from "../auth/useAuth";
import { Profile_icon } from "../components/Profile_icon";
import { Generalisedbutton, SignOut } from "../components/buttons";

/**
 * The home screen page component.
 * Renderes the two choices of game handling and also log out.
 * @returns {JSX.Element} The home screen interface.
 */
export const Homescreen = () => {
  const { isLoggedIn, isLoading } = useAuthContext();
  const router = useNavigate();
  const {user} = useAuthContext();

  useEffect(() => {
    if (!isLoggedIn && !isLoading) {
      router("/");
    }
  }, [isLoggedIn, isLoading]);

  return (
    <div>  
      <div className="flex-1 flex flex-col items-center justify-center pt-[78px]">
      <p className="font-kodchasan text-5xl text-[#57463D]">NomadSync</p>

      <div className="flex items-center justify-center pt-44 gap-5">
        <Generalisedbutton buttonName="Upload Game-Save" 
            onClick={() => router("/GameSelectPage")
        }/>
        <Generalisedbutton buttonName="Download Game-Save" 
            onClick={() => router("/CloudSelectPage")}/>
      </div>
      <div className="pt-5">
        <Generalisedbutton
          buttonName="Sign Out"
          onClick={async () => {
          SignOut();
        }}/>
      </div>
    </div>
      <div className="position: fixed top-16 left-5 "> <Profile_icon/>
            <h1 className="position: fixed top-10 left-4 
                           font-[Kodchasan-SemiBold] text-[#57463D] text-sm">
                            Signed in as: {user?.email}</h1>      

    </div>
  </div>
  );
};
