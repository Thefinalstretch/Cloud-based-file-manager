import { useNavigate } from "react-router-dom";
import { supabase } from "./authflow/supabase-vite";
import { useEffect } from "react";
import { useAuthContext } from "../hooks/useAuth";
import { Profile_icon } from "./Profile_icon";
import { Extract_button } from "./authflow/file_management/buttons";
import Gamefinder from "./Gamefinder";
import { gameData, foundFile } from "src/types";
import { useLocation } from "react-router-dom";
import React, { useState } from "react";
import HexGameCard from "./HexGameCard";

export default function Selector() {
  const back = useNavigate();
  const { user } = useAuthContext();
  const location = useLocation();

  const game = location.state?.selectedgame as gameData;
  const [availableSaves, setAvailableSaves] = useState<foundFile[]>(game?.saves || []);
  const [selectedGame, setSelectedGame] = useState<foundFile[]>([]);
  const [headfolder, setHeadfolder] = useState<string>(game.gameName);
  

  const UploadSelected = async () => {
  const headfolder = game.gameName;
    if (selectedGame.length === 0) {
      alert("Please select at least one save to upload.");
      return;
    }  

    try {
    for (const save of selectedGame) {
      const path = save.filePath;
      await window.electron.uploadsave_separate(save.filePath, 
                                                user?.id as string, 
                                                game.appID, 
                                                game.gameName.replace(/[^a-zA-Z0-9 ]/g, ""), 
                                                save.fileName,
                                                save.relativePath,
                                                save.rootID);
      
    }
    } catch (error) {
      console.error("Error uploading saves: ", error);
    }
    }
  



  const SelectSave = (MoveToSelect: foundFile) => {
    //Steg A: Ta bort från tillgängliga saves
    //"Behåll alla filer vars namn vi inte klickat på"
    setAvailableSaves((prev) => prev.filter((save) => save.fileName !== MoveToSelect.fileName));
    setSelectedGame((prev) => [...prev, MoveToSelect])
  }


  const DeselectSave = (MoveToAvailable: foundFile) =>{
    setSelectedGame((prev) => prev.filter((save) => save.fileName !== MoveToAvailable.fileName));
    setAvailableSaves((prev) => [...prev, MoveToAvailable])
  }




  return (
    <div className="flex flex-col items-center pt-[40px]">

      <div className="bg-[#ffffff]/50 h-[651px] w-[643px] rounded-[20px] flex flex-col items-center pt-[40px]">
        <div className="w-[600px] h-[150px] bg-[#D9BBA1] rounded-[20px] flex">
          <header>{game.gameName}
            <HexGameCard
              key={game.appID}
              gameID={game.appID}
              gameName={game.gameName}
              gameSavesLength={game.saves.length}
            />
          </header>
          <p>{game.sizeOnDisk} GB</p>
          <p>{game.lastPlayed}</p>

        </div>


        <div className="flex flex-row">

          <div className="mt-4 h-[335px] w-[250px] overflow-auto scrollbar-hide mr-5">
            <h1>Local Saves</h1>
            {availableSaves.map((save) => (
              <div onClick={() => SelectSave(save)}
                   key={save.fileName} 
                   className="bg-[#D9BBA1]/60 p-1 rounded mb-4">
                <h3 className="text-md font-bold">{save.fileName}</h3>
                <p className="text-sm">{save.fileSize} MB</p>
                <p>{game.gameName}</p>
              </div>

            ))}
          </div>

          <div className=" mt-4 h-[335px] w-[250px] overflow-auto scrollbar-hide">
            <h1 className="">To Be Uploaded</h1> 
            {selectedGame.map((save) => (
              <div onClick={() => DeselectSave(save)}
                   key={save.fileName} 
                   className="bg-[#D9BBA1]/60 p-1 rounded mb-4">
                <h3 className="text-md font-bold">{save.fileName}</h3>
                <p className="text-sm">{save.fileSize} MB</p>
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
