import { useNavigate } from "react-router-dom";

export default function DownloadSave() {
  const back = useNavigate();

  return (
    <div>
      <h1>Download Game Save</h1>
      {/* Här kan du lägga till UI-komponenter för att visa nedladdade spel och en knapp för att starta nedladdningen */}
      <button onClick={() => back(-1)}>Back</button>
    </div>
  );
}
