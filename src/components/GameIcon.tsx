import React from "react";

interface GameIconProps {
  gameId: string; //Steam AppId, exempelvis "730" för CS
  gameName: string; // Spelets namn
}
export default function GameIcon({ gameId, gameName }: GameIconProps) {
  // steg 1 är att kolla om spelet är minecraft, eftersom minecraft inte finns på steam
  if (gameName.toLowerCase().includes("minecraft") || gameId === "Minecraft") {
    return (
      <div style={iconStyle}>
        {/*här kan vi lägga in en minecraft image path */}
      </div>
    );
  }
  //steam använder detta URL format för alla steamspel
  // vi kan använda /header.jpg , eller /library_600x900.jpg istället för /capsule_231x87.jpg
  const steamImageUrl = `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${gameId}/capsule_231x87.jpg`;
  return (
    <img
      src={steamImageUrl}
      alt={gameName}
      style={imageStyle}
      //om steam inte har bilden kommer den köra denna error funktion
      onError={(e) => {
        const target = e.target as HTMLImageElement;

        target.style.display = "none";
        target.parentElement?.setAttribute("data-failed", "true");
      }}
    />
  );
}

/** exempel på hur man importerar denna komponent till appen
  import GameIcon from './GameIcon';

Inside your component's return statement:
<div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
  
  { The Icon Component }
  <GameIcon gameId="872280" gameName="Freddy Fazbear's Pizzeria Simulator" />
  
  { The Game Info }
  <div>
    <h3>Freddy Fazbear's Pizzeria Simulator</h3>
    <button>Upload Save</button>
  </div>
  
</div>
 */
