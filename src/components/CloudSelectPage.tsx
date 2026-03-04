
import { useNavigate } from "react-router-dom";
import { LiquidGlassFilters } from "@gracefullight/liquid-glass";
import { useEffect, useState } from "react";
import type { cloudSave, gameData } from "src/types";
import HexGameCard from "./HexGameCard";
import { supabase } from "./authflow/supabase-vite";
import { useAuthContext } from "../hooks/useAuth";
import { randomInt } from "node:crypto";
import { GeneralisedbuttonSm } from "./authflow/buttons";


export default function CloudFileList() {

  const back = useNavigate();
  const { user } = useAuthContext();

  const [Saves, setSaves] = useState<cloudSave[]>([]);
  const [nr_saves, setNr_saves] = useState<cloudSave[]>([]);
  const [loading, setLoading] = useState(true);

  



  useEffect(() => {
    const fetchGames_from_supabase = async () => {
      try {
        setLoading(true);

        const response = await window.electron.fetchCloudSaves(user?.id);
        
        if (response) {
          setSaves(RemoveDuplicated(response.saves));
          setNr_saves(response.saves);
        }
      }
      catch (error) {
        console.error("Failed to fetch games:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames_from_supabase();
  }, []);


  if (loading) {
    return <div>Loading games...</div>;
  }


  function RemoveDuplicated (array: cloudSave[]): cloudSave[] {
    const seenAppIDs = new Set<string>();

    return array.filter((game) => {
      if (seenAppIDs.has(game.appID)){
        return false;
      }
      else {
      seenAppIDs.add(game.appID);
      return true;
      }
    });
   
  }
  const SIMULATION_COUNT = 40; // Totalt antal spel att simulera (inklusive riktiga spel)
  const simulatedGames: cloudSave[] = [...Saves];

  for (let i = Saves.length; i < SIMULATION_COUNT; i++) {
    simulatedGames.push({
      gameName: `sim-${i}`,
      appID: `Test Game ${i}`,
      lastUpdated: "10 GB",
      fileSize: "2024-01-01",
      storagePath: "1.0",
      // Vi sätter INTE isDummy: true här, för vi vill att HexGameCard ska renderas
    } as cloudSave);
  }

  function createHoneycombRows(games: cloudSave[]) {
    const rows = [];
    let currentIndex = 0;
    let isThreeRow = true;

    while (currentIndex < games.length) {
      const chunkSize = isThreeRow ? 3 : 2;
      const chunk = games.slice(currentIndex, currentIndex + chunkSize);
      while (chunk.length < chunkSize) {
        chunk.push({
          gameName: "empty",
          appID: `dummy-${currentIndex}-${chunk.length}`,
          lastUpdated: "",
          fileSize: "",
          storagePath: "",
          fileName:"",
          isDummy: true,
          rootID: "",
          relativePath: "",
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
          Select a Game to Download
        </h1>
        <div className="h-[550px] w-full overflow-y-auto scrollbar-hide [mask-image:linear-gradient(to_bottom,transparent,blue_25%,blue_75%,transparent)]">
          <div className="flex flex-col items-center pt-20">
            {honeycombRows.map((row, rowIndex) => (
              <div
                key={`row-${rowIndex}`}
                className={`flex justify-center gap-4 ${rowIndex > 0 ? "-mt-[25px]" : ""}`}>
                {row.map((game: cloudSave) => {
                  const filesWithSameID = nr_saves.filter(x => x.appID === game.appID);
                  return (<button 
                           key={game.appID}
                           onClick={() => back("/cloudSave",
                    { state: { selectedgame: game }, })} >
                    
                    <HexGameCard
                      key={game.fileName}
                      gameID={game.appID}
                      gameName={game.gameName}
                      gameSavesLength={filesWithSameID.length}
                    />
                  </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        <div className="position: fixed bottom-10 left-10">
          <GeneralisedbuttonSm buttonName="Back" onClick={() => back(-1)}/>
        </div>
        <div className="position: fixed bottom-10 right-10">
          <GeneralisedbuttonSm buttonName="Manual Download" onClick={() => back(-1)}/>
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
