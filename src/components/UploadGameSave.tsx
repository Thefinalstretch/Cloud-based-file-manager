import { useNavigate } from "react-router-dom";
import { supabase } from "./authflow/supabase-vite";
import { useEffect } from "react";
import { useAuthContext } from "../hooks/useAuth";
import { Profile_icon } from "./Profile_icon";
import { Extract_button, Extract_button_file } from "./authflow/file_management/buttons";
import Gamefinder from "./Gamefinder";

export default function UploadSave() {
  const back = useNavigate();
  const { user } = useAuthContext();

  return (
    <div className=" py-10">
      <h1>Upload Game Save</h1>
      <p>Logged in as:{user?.email}</p>
      {/* Här kan du lägga till UI-komponenter för att välja en spel och en knapp för att starta uppladdningen */}
      <Profile_icon />
      <Extract_button />
      <Extract_button_file />
      <Gamefinder />
      <button onClick={() => back(-1)}>Back</button>
    </div>
  );
}
