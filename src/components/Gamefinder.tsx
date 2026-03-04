import React, { useState } from "react";
import { useAuthContext } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Profile_icon } from "./Profile_icon";
import HexGameCard from "./HexGameCard";
import { xboxGame } from "../types";

export default function Gamefinder() {
  const back = useNavigate();
  const { user } = useAuthContext();

  const [worlds, setWorlds] = useState<any[]>([]);
  const [xboxGames, setXboxGames] = useState<XboxGame[]>([]);

  const [status, setStatus] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  const handleAutoFind = async () => {
    setIsScanning(true);
    setStatus("Scanning minecraft worlds");

    try {
      const foundWorlds = await window.electron.getMinecraftWorlds();

      if (foundWorlds && foundWorlds.length > 0) {
        console.log("Found worlds:", foundWorlds);
        setWorlds(foundWorlds);
        setStatus(`Found ${foundWorlds.length} worlds!`);
      } else {
        setStatus("No minecraft worlds found :(");
      }
    } catch (err) {
      console.error(err);
      setStatus("Error scanning: " + err);
    }
    setIsScanning(false);
  };

  const handleScanXbox = async () => {
    setIsScanning(true);
    setStatus("scanning for xbox games");
    try {
      const games = await window.electron.getXboxGames();
      setXboxGames(games);
      setStatus(`Found ${games.length} Xbox games`);
    } catch (err) {
      console.error(err);
      setStatus("failed to fetch Xbox games");
    }
    setIsScanning(false);
  };

  // const handleUpload = async (worldPath: string, worldName: string) => {
  //   if (!user) {
  //     alert("You need to be logged in!");
  //     return;
  //   }
  //   setStatus(`Uploading `);

  //   try {
  //     const result = await window.electron.uploadSave(
  //       worldPath,
  //       user.id,
  //       worldName,
  //     );

  //     if (result.success) {
  //       setStatus(`${worldName} Uploaded successfully`);
  //     } else {
  //       setStatus(` Failed to upload ${worldName} :(`);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     setStatus("Error during upload: " + error);
  //   }
  // };
  return (
    <div className="p-8">
      <h2 className="mb-6 text-2xl font-bols text-white">Game Scanner </h2>
      {status && <p className="mb-4 text-gray-300">{status}</p>}

      <div className="flex gap-4 mb-8">
        <button
          onClick={handleAutoFind}
          disabled={isScanning}
          className="px-6 py-2 text-white transition-colors bg-green-600 rounded-full hover:bg-green-500 disabled:opacity-50">
          {isScanning ? "Scanning" : "Find Minecraft Worlds"}
        </button>

        <button
          onClick={handleScanXbox}
          disabled={isScanning}
          className="px-6 py-2 text-white transition-colors bg-blue-600 rounded-full hover:bg-blue-500 disabled:opacity-50">
          {isScanning ? "Scanning for Xbox games" : "Scan Xbox games"}
        </button>

        <div className="flex flex-wrap gap-4 mt-8">
          {xboxGames.map((game, index) => (
            <HexGameCard
              key={`xbox-${index}`}
              gameId={game.PackageFamilyName}
              gameName={game.Name}
              onUpload={(id, name) => {
                console.log(
                  "Preparing to upload save for:",
                  name,
                  "at ID:",
                  id,
                );
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
