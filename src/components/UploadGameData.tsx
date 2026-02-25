import { useNavigate } from "react-router-dom";
import { LiquidGlassFilters } from "@gracefullight/liquid-glass";
import { useEffect, useState } from "react";
import type { GameData } from "src/types";
import HexGameCard from "./HexGameCard";

export default function UploadGameData() {
  const back = useNavigate();
  const [games, setGames] = useState<GameData[]>([]);
  const [loading, setLoading] = useState(true);

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
  function createHoneycombRows(games: GameData[]) {
    const rows = [];
    let currentIndex = 0;
    let isThreeRow = true;

    while (currentIndex < games.length) {
      const chunkSize = isThreeRow ? 3 : 2;
      const chunk = games.slice(currentIndex, currentIndex + chunkSize);
      while (chunk.length < chunkSize) {
        chunk.push({
          isDummy: true,
          AppID: `dummy-${currentIndex}-${chunk.length}`,
          Gamename: "empty",
          SizeOnDisk: "",
          lastplayed: "",
          versionID: "",
          Saves: [],
        });
      }
      rows.push(chunk);
      currentIndex += chunkSize;
      isThreeRow = !isThreeRow;
    }
    return rows;
  }

  const honeycombRows = createHoneycombRows(games);

  return (
    <div className="bg-[#192B87]  bg-gradient-to-bl from-red-600/20 via-slate-500/20 to-red-800/20">
      <h1 className="mb-10 text-3xl font-bold text-white">
        Select a Game to Upload
      </h1>
      <div className="flex flex-col items-center">
        {honeycombRows.map((row, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className={`flex justify-center gap-4 ${rowIndex > 0 ? "-mt-[60px]" : ""}`}>
            {row.map((game: GameData) => {
              if (game.isDummy) {
                return <div key={game.AppID} className="w-[250px]"></div>;
              }

              return (
                <HexGameCard
                  key={game.AppID}
                  gameId={game.AppID}
                  gameName={game.Gamename}
                />
              );
            })}
          </div>
        ))}
      </div>
      <button className="bg-gray-800" onClick={() => back(-1)}>
        Back
      </button>
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
