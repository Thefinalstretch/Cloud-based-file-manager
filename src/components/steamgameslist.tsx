import { useEffect, useState } from "react";
import type { GameData } from "src/types";

export function SteamGamesList() {
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

  return (
    <div className="w-full py-12 bg-[#050505] overflow-hidden">
      {/* Horisontell container */}
      <div className="flex gap-6 overflow-x-auto px-12 py-8 no-scrollbar scroll-smooth snap-x snap-mandatory">
        {games.map((game) => (
          <div
            key={game.AppID}
            className="relative min-w-[180px] h-[210px] group snap-center transition-all duration-500 hover:scale-110 hover:-translate-y-3 cursor-pointer">
            {/* Hexagon Clip-path Wrapper */}
            <div className="absolute inset-0 [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)] overflow-hidden bg-white/5">
              {/* Liquid-lagret (Roterande gradient bakom glaset) */}
              <div className="absolute -inset-[50%] bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 opacity-40 blur-xl animate-[spin_10s_linear_infinite] group-hover:animate-[spin_4s_linear_infinite] z-0"></div>

              {/* Glass-lagret */}
              <div className="absolute inset-[2px] [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)] bg-white/10 backdrop-blur-2xl border border-white/20 z-10 flex flex-col items-center justify-center p-4 text-center">
                {/* Spelnamn */}
                <span className="text-white font-black text-[10px] leading-tight uppercase tracking-tighter drop-shadow-md">
                  {game.Gamename}
                </span>

                {/* Info-badge */}
                <div className="mt-2 px-2 py-0.5 bg-cyan-500/20 border border-cyan-400/30 rounded-full">
                  <span className="text-cyan-400 text-[8px] font-bold">
                    {game.Saves.length} DATA BLOCKS
                  </span>
                </div>
              </div>

              {/* Ljussken vid hover */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Tailwind Custom Styles för att gömma scrollbar */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
