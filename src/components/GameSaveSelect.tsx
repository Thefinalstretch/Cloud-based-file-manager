import { useNavigate } from "react-router-dom";
import { supabase } from "./authflow/supabase-vite";
import { useEffect } from "react";
import { useAuthContext } from "../hooks/useAuth";
import { Profile_icon } from "./Profile_icon";
import { Extract_button } from "./authflow/file_management/buttons";
import Gamefinder from "./Gamefinder";
import { GameData, Foundfile } from "src/types";
import { useLocation } from "react-router-dom";
import React, { useState } from "react";
import HexGameCard from "./HexGameCard";

export default function Selector() {
  const back = useNavigate();
  const { user } = useAuthContext();
  const location = useLocation();

  const game = location.state?.selectedgame as GameData;
  const [availableSaves, setAvailableSaves] = useState<Foundfile[]>(game?.Saves || []);
  const [selectedGame, setSelectedGame] = useState<Foundfile[]>([]);
  const [headfolder, setHeadfolder] = useState<string>(game.Gamename);
  

  const UploadSelected = async () => {
  const headfolder = game.Gamename;
    if (selectedGame.length === 0) {
      alert("Please select at least one save to upload.");
      return;
    }  

    try {
    for (const save of selectedGame) {
      const path = save.filePath;
      await window.electron.uploadsave_separate(save.filePath, 
                                                user?.id as string, 
                                                game.AppID, 
                                                game.Gamename.replace(/[^a-zA-Z0-9 ]/g, ""), 
                                                save.filename,
                                                save.relativePath,
                                                save.rootID);
      
    }
    } catch (error) {
      console.error("Error uploading saves: ", error);
    }
    }
  



  const SelectSave = (MoveToSelect: Foundfile) => {
    //Steg A: Ta bort från tillgängliga saves
    //"Behåll alla filer vars namn vi inte klickat på"
    setAvailableSaves((prev) => prev.filter((save) => save.filename !== MoveToSelect.filename));
    setSelectedGame((prev) => [...prev, MoveToSelect])
  }


  const DeselectSave = (MoveToAvailable: Foundfile) =>{
    setSelectedGame((prev) => prev.filter((save) => save.filename !== MoveToAvailable.filename));
    setAvailableSaves((prev) => [...prev, MoveToAvailable])
  }




  return (
    <div className="flex flex-col items-center pt-[40px]">

      <div className="bg-[#ffffff]/50 h-[651px] w-[643px] rounded-[20px] flex flex-col items-center pt-[40px]">
        <div className="w-[600px] h-[150px] bg-[#D9BBA1] rounded-[20px] flex">
          <header>{game.Gamename}
            <HexGameCard
              key={game.AppID}
              gameId={game.AppID}
              gameName={game.Gamename}
              gameSavesLength={game.Saves.length}
            />
          </header>
          <p>{game.SizeOnDisk} GB</p>
          <p>{game.lastplayed}</p>

        </div>


        <div className="flex flex-row">

          <div className="mt-4 h-[335px] w-[250px] overflow-auto scrollbar-hide mr-5">
            <h1>Local Saves</h1>
            {availableSaves.map((save) => (
              <div onClick={() => SelectSave(save)}
                   key={save.filename} 
                   className="bg-[#D9BBA1]/60 p-1 rounded mb-4">
                <h3 className="text-md font-bold">{save.filename}</h3>
                <p className="text-sm">{save.filesize} MB</p>
                <p>{game.Gamename}</p>
              </div>

            ))}
          </div>

          <div className=" mt-4 h-[335px] w-[250px] overflow-auto scrollbar-hide">
            <h1 className="">To Be Uploaded</h1> 
            {selectedGame.map((save) => (
              <div onClick={() => DeselectSave(save)}
                   key={save.filename} 
                   className="bg-[#D9BBA1]/60 p-1 rounded mb-4">
                <h3 className="text-md font-bold">{save.filename}</h3>
                <p className="text-sm">{save.filesize} MB</p>
              </div>

            ))}
          </div>
        </div>

        <button 
            className="text-black z-10 text-xl py-5 px-20 mt-5 bg-[#fffbaa] text-center flex justify-center rounded-[20px]" 
            onClick={() => UploadSelected()}>

            Upload
        </button>
      </div>
      <button className="bg-white" onClick={() => back(-1)}>
        Back
      </button>

    </div>
  );
}
