
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { gameData } from "src/shared/types";
import HexGameCard from "../components/HexGameCard";
import { GeneralisedbuttonSm } from "../components/buttons";
import { supabase } from "../auth/supabaseClient";
import { simulateItems, createHoneycombRows } from "../util/HoneyComb";

export default function GameList() {
  const navigate = useNavigate();
  const [games, setGames] = useState<gameData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const data = await window.electron.getallgames();
        setGames(data);
      } catch (error) {
        console.error("Failed to fetch games:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  const handleManualUpload = async () => {
    try{
      const path = await window.electron.selectFolder();

      if (!path) return;

      console.log("selected:", path);

      const { data: { user } } = await supabase.auth.getUser();
      console.log(user);

      const ok = window.confirm(`Are you sure you want to upload ${path}?`);
      if (!ok) return;

      const splitPath = path.split("\\")
      const folderName = splitPath[splitPath.length-1]

      await window.electron.uploadFolder(path, user?.id, folderName);

      alert(`Successfully uploaded: ${folderName}`);
      
    } catch (error) {

      alert(`Failed to upload folder`);
      console.log(error);
    }
    
  };

  const simulatedGames = simulateItems(
    games,
    40,
    (i) =>
      ({
        appID: `sim-${i}`,
        gameName: "Empty Slot",
        sizeOnDisk: "",
        lastPlayed: "",
        versionID: "",
        isDummy: false, // Changing this to true removes additional rendering, for program showcase, keep false.
        saves: [],
      } as gameData)
  );

  const honeycombRows = createHoneycombRows(simulatedGames);

  if (loading) {
    return <div>Loading games...</div>;
  }

  return (
    <div>
      <div className="justify-center items-center flex-col flex">
        <h1 className="mb-10 text-5xl font-bold text-[#57463D] font-[Kodchasan-Semibold] pt-16">
          Select a Game to Upload
        </h1>
        <div className="h-[550px] w-full overflow-y-auto scrollbar-hide [mask-image:linear-gradient(to_bottom,transparent,blue_25%,blue_75%,transparent)]">
          <div className="flex flex-col items-center pt-20">
            {honeycombRows.map((row, rowIndex) => (
              <div
                key={`row-${rowIndex}`}
                className={`flex justify-center gap-4 ${rowIndex > 0 ? "-mt-[25px]" : ""}`}>
                {row.map((game: gameData) => {
                  if (game.isDummy) {
                    return <div key={game.appID} className="w-[125px] "></div>;
                  }

                  return (<button 
                           key={game.appID}
                           onClick={() => navigate("/GameSaveSelect", 
                    {state: { selectedgame: game },})} >
                      
                    <HexGameCard
                      gameID={game.appID}
                      gameName={game.gameName}
                      gameSavesLength={game.saves.length}
                    />
                  </button>
                  );
                })}
              </div >
            ))}
          </div>
        </div>
        <div className="fixed bottom-16 left-6">
          <GeneralisedbuttonSm buttonName="Back" onClick={() => navigate(-1)}/>
        </div>

        <div className="fixed bottom-16 right-6">
          <GeneralisedbuttonSm buttonName="Manual Upload" onClick={handleManualUpload}/>
        </div>
        
        
      </div>
    </div>
  );
}