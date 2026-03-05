
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { gameData } from "src/types";
import HexGameCard from "./HexGameCard";
import { Generalisedbutton, GeneralisedbuttonSm } from "./authflow/buttons";
import { uploadGameSave } from "src/Main/save-handler";
import { useAuthContext } from "../hooks/useAuth";
import { supabase } from "./authflow/supabase-vite";

export default function GameList() {
  const back = useNavigate();
  const [games, setGames] = useState<gameData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const {user} = useAuthContext();
  const [selectedPath, setSelectedPath] = useState("");

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

  const handleAddGame = async () => {
    const path = await window.electron.selectFolder();

    if (!path) return;

    console.log("selected:", path);

    const { data: { user } } = await supabase.auth.getUser();
    console.log(user);

    setSelectedPath(path);

    const ok = window.confirm(`Are you sure you want to upload ${path}?`);
    if (!ok) return;

    const splitPath = path.split("\\")
    const folderName = splitPath[splitPath.length-1]

    await window.electron.uploadSave(path, user?.id, folderName);
  };


  if (loading) {
    return <div>Loading games...</div>;
  }
  const SIMULATION_COUNT = 40; // Totalt antal spel att simulera (inklusive riktiga spel)
  const simulatedGames: gameData[] = [...games];
  for (let i = games.length; i < SIMULATION_COUNT; i++) {
    simulatedGames.push({
      appID: `sim-${i}`,
      gameName: `Empty Slot`,
      sizeOnDisk: "10 GB",
      lastPlayed: "2024-01-01",
      versionID: "1.0",
      saves: [],
      // Vi sätter INTE isDummy: true här, för vi vill att HexGameCard ska renderas
    } as gameData);
  }

  function createHoneycombRows(games: gameData[]) {
    const rows = [];
    let currentIndex = 0;
    let isThreeRow = true;

    while (currentIndex < games.length) {
      const chunkSize = isThreeRow ? 3 : 2;
      const chunk = games.slice(currentIndex, currentIndex + chunkSize);
      while (chunk.length < chunkSize) {
        chunk.push({
          isDummy: true,
          appID: `dummy-${currentIndex}-${chunk.length}`,
          gameName: "empty",
          sizeOnDisk: "",
          lastPlayed: "",
          versionID: "",
          saves: [],
        });
      }
      rows.push(chunk);
      currentIndex += chunkSize;
      isThreeRow = !isThreeRow;
    }
    return rows;
  }

  const honeycombRows = createHoneycombRows(simulatedGames);

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
                           onClick={() => back("/GameSaveSelect", 
                    {state: { selectedgame: game },})} >
                    <HexGameCard
                      key={game.appID}
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
        <div className="position: fixed bottom-16 left-6">
          <GeneralisedbuttonSm buttonName="Back" onClick={() => back(-1)}/>
        </div>

        <div className="position: fixed bottom-16 right-6">
          <GeneralisedbuttonSm buttonName="Manual Upload" onClick={handleAddGame}/>
        </div>
        
        
      </div>
    </div>
  );
}

// export default function HoneycombGrid() {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen p-10 bg-gray-950">

//       {/* TOP ROW: 3 Hexagons */}
//       <div className="flex gap-4">
//         <LiquidHexagon label="STEAM" onClick={() => console.log("Steam clicked")} />
//         <LiquidHexagon label="XBOX" onClick={() => console.log("Xbox clicked")} />
//         <LiquidHexagon label="MINECRAFT" onClick={() => console.log("Minecraft clicked")} />
//       </div>

//       {/* BOTTOM ROW: 2 Hexagons */}
//       {/* -mt-[60px] pulls this row up so it slots perfectly between the top hexagons */}
//       <div className="flex gap-4 -mt-[60px]">
//         <LiquidHexagon label="UPLOAD" onClick={() => console.log("Upload clicked")} />
//         <LiquidHexagon label="DOWNLOAD" onClick={() => console.log("Download clicked")} />
//       </div>

//     </div>
//   );
// }
