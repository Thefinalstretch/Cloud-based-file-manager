import { Googlesigninbutton, Signoutbutton } from "./buttons";

export default function Login_screen() {
  return (
    <>
      <header className="flex 1 justify-center items-center">
        Welcome to Cloud extract
      </header>
      <Googlesigninbutton />
      <Signoutbutton />
    </>
  );
}
