
import { useNavigate } from "react-router-dom";
import { LiquidGlassFilters } from "@gracefullight/liquid-glass";
import { useEffect, useState } from "react";
import type { Cloudsave, GameData } from "src/types";
import HexGameCard from "./HexGameCard";
import { supabase } from "./authflow/supabase-vite";
import { useAuthContext } from "../hooks/useAuth";


export default function CloudFileList() {

  const back = useNavigate();
  const { user } = useAuthContext();

  const [Saves, setSaves] = useState<Cloudsave[]>([]);
  const [nr_saves, setNr_saves] = useState(0);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const fetchGames_from_supabase = async () => {
      try {
        setLoading(true);

        const response = await window.electron.fetchCloudSaves(user?.id);
        
        if (response) {
          setSaves(RemoveDuplicated(response.saves));
          setNr_saves(response.saves.length);
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


  function RemoveDuplicated (array: Cloudsave[]): Cloudsave[] {
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
  const simulatedGames: Cloudsave[] = [...Saves];

  for (let i = Saves.length; i < SIMULATION_COUNT; i++) {
    simulatedGames.push({
      gameName: `sim-${i}`,
      appID: `Test Game ${i}`,
      last_updated: "10 GB",
      file_size: "2024-01-01",
      storage_path: "1.0",
      // Vi sätter INTE isDummy: true här, för vi vill att HexGameCard ska renderas
    } as Cloudsave);
  }

  function createHoneycombRows(games: Cloudsave[]) {
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
          last_updated: "",
          file_size: "",
          storage_path: "",
          fileName:"",
          isDummy: true,
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
      <div className="">
        <h1 className="mb-10 text-3xl font-bold text-white">
          Select a Game to Upload
        </h1>
        <div className="h-[600px] w-full overflow-y-auto scrollbar-hide [mask-image:linear-gradient(to_bottom,transparent,blue_25%,blue_75%,transparent)]">
          <div className="flex flex-col items-center pt-20">
            {honeycombRows.map((row, rowIndex) => (
              <div
                key={`row-${rowIndex}`}
                className={`flex justify-center gap-4 ${rowIndex > 0 ? "-mt-[25px]" : ""}`}>
                {row.map((game: Cloudsave) => {

                                    return (<button onClick={() => back("/CloudSave",
                    { state: { selectedgame: game }, })} >
                    
                    <HexGameCard
                      key={game.appID}
                      gameId={game.appID}
                      gameName={game.gameName}
                      gameSavesLength={nr_saves}
                    />
                  </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        <button className="bg-gray-800" onClick={() => back(-1)}>
          Back
        </button>
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
