import React from "react";
import type { HexGameCardProps } from "src/types";

export default function HexGameCard({
  gameId,
  gameName,
  gameSavesLength
  // onUpload,
}: HexGameCardProps) {
  const steamImageUrl = `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${gameId}/header.jpg`;

  return (
    /* Hexagon containern */
    /* 'group' låter child elementet veta när användaren hovverar över parent elementet */
    <div className="bg-black group relative w-[125px] h-[140px] cursor-pointer transition-transform duration-300 hover:scale-90 hover:-translate-y-1 transform-gpu antialiased [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)] ">
      <img
        src={steamImageUrl}
        alt={gameName}
        className="absolute inset-0 z-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-5 text-center transition-all duration-300">
        <h3 className="mb-4 text-lg text-white drop-shadow-md">
          {gameName}
          <div className="mt-2 px-2 py-0.5 bg-[#000000]/20 border border-[#ffffff]/30 rounded-full">
                  <span className="text-white text-[8px] font-bold">
                    {gameSavesLength} DATA BLOCKS
                  </span>
          </div>
        </h3>
      </div>
    </div>
  );
}
