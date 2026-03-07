import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuth";
import { Profile_icon } from "../Profile_icon";
import { Googlesigninbutton, Signoutbutton } from "./buttons";
import { useEffect } from "react";

import CustomGoogleButton from "../GoogleButton";

export default function Login_screen() {
  const { isLoggedIn, session } = useAuthContext();
  const router = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      router("/home");
    } else {
      router("/");
    }
  }, [isLoggedIn, session]);

  return (
    //styling
    <div className="flex-1 flex flex-col items-center justify-center pt-[78px]">
      <p className="font-kodchasan text-5xl text-[#57463D]">NomadSync</p>

      <div className="flex items-center justify-center pt-44">
        <Googlesigninbutton />
      </div>
    </div>
  );
}
