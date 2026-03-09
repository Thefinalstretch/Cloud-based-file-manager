import type { hexGameCardProps } from "src/shared/types";

/**
 * A React component that renders a hexagonal game card with an image, game name, and the number of saves.
 * @param gameID The unique identifier for the game, used to fetch the appropriate image.
 * @param gameName The name of the game to be displayed on the card.
 * @param gameSavesLength The number of saves associated with the game, displayed on the card.
 * @returns A hexagonal game card component.
 */
export default function HexGameCard({
  gameID,
  gameName,
  gameSavesLength
  // onUpload,
}: hexGameCardProps) {
  let steamImageUrl = "";
  if (gameID === "1")
  {
    steamImageUrl = "/folder.jpg";
  } else {
    steamImageUrl = `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${gameID}/header.jpg`;
  }
  

  return (
    /* Hexagon containern */
    /* 'group' låter child elementet veta när användaren hovverar över parent elementet */
    <div className="bg-black group relative w-[125px] h-[140px] 
                    cursor-pointer transition-transform duration-300 
                    hover:scale-90 hover:-translate-y-1 transform-gpu 
                    antialiased 
        [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)] ">
      <img
        src={steamImageUrl}
        alt={gameName}
        className="absolute inset-0 z-0 w-full h-full opacity-50 object-cover"
      />

      <div className="inset-0 z-10 flex flex-col items-center justify-center 
                      pt-5 px-2 text-center transition-all duration-300">

        <h3 className="absolute top-[30px] px-1 text-sm 
                    text-white drop-shadow-md line-clamp-2 
                      font-[Kodchasan-Semibold]">
          {gameName}
          
        </h3>
        <div className="absolute top-[80px] bg-[#000000]/20 border 
                      border-[#ffffff]/30 rounded-full justify-center 
                       items-center flex">
                        
                  <span className="font-[Kodchasan-Semibold]
                                  text-white text-[8px] font-bold 
                                   px-2 py-2 justify-center items-center ">

                    {gameSavesLength} Saves
                  </span>
          </div>
      </div>
    </div>
  );
}
