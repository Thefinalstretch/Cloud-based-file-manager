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
import { Cloudsave } from "src/types";

export default function Selectors() {
  const back = useNavigate();
  const { user } = useAuthContext();
  const location = useLocation();

  const game = location.state?.selectedgame as Cloudsave;
  const [availableSaves, setAvailableSaves] = useState<Cloudsave[]>([]);
  const [selectedGame, setSelectedGame] = useState<Cloudsave[]>([]);

  useEffect(() => {
    const fetchSaves = async () => {
      try {
        const data = await window.electron.fetchCloudSaves(user.id)

        if (data) {
          const new_data = data.saves.filter((save) => save.appID === game.appID
          )
          setAvailableSaves(new_data);
        }
      } catch (error) {
        console.error("misslyckades att hämta saves", error);
      }

    }

    fetchSaves();

  }, [])


  const DownloadSelected = async () => {
    const headfolder = game.gameName;
    if (selectedGame.length === 0) {
      alert("Please select at least one save to download.");
      return;
    }

    try {
      for (const save of selectedGame) {
        
        const filePath = `${user.id}/${game.gameName}/${save.fileName}`;
        console.log("Attempting to download file from path: ", filePath);
        const { data, error } = await supabase
          .storage
          .from("Game-save")
          .createSignedUrl(filePath, 60);

        if (error || !data) {
          console.error("Error downloading file: ", error);
          continue; // Skip this file and move to the next one
        }
        try {
          await window.electron.downloadSave(data.signedUrl,"C:\\Users\\jonat\\Programmering\\code\\testDirectory")
          console.log(`File ${save.fileName} downloaded and extracted successfully.`);
        } catch (error) {
          console.error(`Error downloading or extracting file ${save.fileName}: `, error);
        }



      }
    } catch (error) {
      console.error("Error fetching saves: ", error);
    }
  }




  const SelectSave = (MoveToSelect: Cloudsave) => {
    //Steg A: Ta bort från tillgängliga saves
    //"Behåll alla filer vars namn vi inte klickat på"
    setAvailableSaves((prev) => prev.filter((save) => save.fileName !== MoveToSelect.fileName));
    setSelectedGame((prev) => [...prev, MoveToSelect])
  }


  const DeselectSave = (MoveToAvailable: Cloudsave) => {
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
              gameId={game.appID}
              gameName={game.gameName}
              gameSavesLength={0}
            />
          </header>
          {/* <p>{game.file_size} GB</p> */}
          {/* <p>{game.lastplayed}</p> */}

        </div>


        <div className="flex flex-row">

          <div className="mt-4 h-[335px] w-[250px] overflow-auto scrollbar-hide mr-5">
            <h1>Cloud Database</h1>
            {availableSaves.map((save) => (
              <div onClick={() => SelectSave(save)}
                key={save.fileName}
                className="bg-[#D9BBA1]/60 p-1 rounded mb-4">
                <h3 className="text-md font-bold">{save.fileName}</h3>
                <p className="text-sm">{save.file_size} MB</p>
                <p>{game.gameName}</p>
              </div>

            ))}
          </div>

          <div className=" mt-4 h-[335px] w-[250px] overflow-auto scrollbar-hide">
            <h1 className="">To Be Downloaded</h1>
            {selectedGame.map((save) => (
              <div onClick={() => DeselectSave(save)}
                key={save.fileName}
                className="bg-[#D9BBA1]/60 p-1 rounded mb-4">
                <h3 className="text-md font-bold">{save.fileName}</h3>
                <p className="text-sm">{save.file_size} MB</p>
              </div>

            ))}
          </div>
        </div>

        <button
          className="text-black z-10 text-xl py-5 px-20 mt-5 bg-[#fffbaa] text-center flex justify-center rounded-[20px]"
          onClick={() => DownloadSelected()}>

          Download
        </button>
      </div>
      <button className="bg-white" onClick={() => back(-1)}>
        Back
      </button>

    </div>
  );
}
