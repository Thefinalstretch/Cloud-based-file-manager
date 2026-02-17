import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuth";
import { Profile_icon } from "../Profile_icon";
import { Googlesigninbutton, Signoutbutton } from "./buttons";
import { Extract_button } from "./file_management/buttons";
import { useEffect } from "react";

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
    <div>
      <p>NomadSync</p>
      <Googlesigninbutton />
    </div>
  );
}
