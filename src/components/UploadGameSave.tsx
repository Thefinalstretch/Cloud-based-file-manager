import { useNavigate } from "react-router-dom";

export default function UploadSave() {
  const back = useNavigate();

  return (
    <div>
      <h1>Upload Game Save</h1>
      {/* Här kan du lägga till UI-komponenter för att välja en spel och en knapp för att starta uppladdningen */}
      <button onClick={() => back(-1)}>Back</button>
    </div>
  );
}
