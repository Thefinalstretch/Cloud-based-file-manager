
import { useNavigate } from "react-router-dom";
import { LiquidGlassFilters } from "@gracefullight/liquid-glass";
import { useEffect, useState } from "react";
import type { gameData } from "src/types";
import HexGameCard from "./HexGameCard";

export default function GameList() {
  const back = useNavigate();
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

  if (loading) {
    return <div>Loading games...</div>;
  }
  const SIMULATION_COUNT = 40; // Totalt antal spel att simulera (inklusive riktiga spel)
  const simulatedGames: gameData[] = [...games];
  for (let i = games.length; i < SIMULATION_COUNT; i++) {
    simulatedGames.push({
      appID: `sim-${i}`,
      gameName: `Test Game ${i}`,
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
                {row.map((game: gameData) => {
                  if (game.isDummy) {
                    return <div key={game.appID} className="w-[125px]"></div>;
                  }

                  return (<button onClick={() => back("/GameSaveSelect", 
                    {state: { selectedgame: game },})} >
                    <HexGameCard
                      key={game.appID}
                      gameId={game.appID}
                      gameName={game.gameName}
                      gameSavesLength={game.saves.length}
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
