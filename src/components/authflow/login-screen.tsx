import { useAuthContext } from "../../hooks/useAuth";
import { Googlesigninbutton, Signoutbutton } from "./buttons";
import { Extract_button } from "./file_management/buttons";

export default function Login_screen() {
  const { isLoggedIn, session } = useAuthContext();
  console.log(isLoggedIn);
  console.log(session);
  return (
    <>
      <header className="flex 1 justify-center items-center">
        Welcome to Cloud extract
      </header>

      {isLoggedIn && session ?
        <div>
          <p>Inloggad som: {session.user.email}</p>
          <Signoutbutton />
        </div>
      : <div>
          <Googlesigninbutton />
          <Extract_button />
        </div>
      }
    </>
  );
}
