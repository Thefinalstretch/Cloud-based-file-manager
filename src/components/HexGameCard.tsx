import React from "react";
import type { HexGameCardProps } from "src/types";

export default function HexGameCard({
  gameId,
  gameName,
  // onUpload,
}: HexGameCardProps) {
  const steamImageUrl = `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${gameId}/header.jpg`;

  return (
    /* Hexagon containern */
    /* 'group' låter child elementet veta när användaren hovverar över parent elementet */
    <div className="group relative w-[250px] h-[280px] cursor-pointer transition-transform duration-300 hover:scale-105 transform-gpu antialiased [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]">
      <img
        src={steamImageUrl}
        alt={gameName}
        className="absolute inset-0 z-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-5 text-center transition-all duration-300 bg-black/30 backdrop-blur-sm group-hover:bg-black/20 group-hover:backdrop-blur-none">
        <h3 className="mb-4 text-lg text-white drop-shadow-md">{gameName}</h3>

        <button className="px-5 py-2 text-sm text-white transition-colors border rounded-full bg-white/20 border-white/50 backdrop-blur-sm hover:bg-white/40">
          Upload
        </button>
      </div>
    </div>
  );
}
