import { useNavigate } from "react-router-dom";
import { SteamGamesList } from "./steamgameslist";

export default function DownloadSave() {
  const back = useNavigate();

  return (
    <div>
      <h1>Download Game Save</h1>
      <SteamGamesList />
      <button onClick={() => back(-1)}>Back</button>
    </div>
  );
}
