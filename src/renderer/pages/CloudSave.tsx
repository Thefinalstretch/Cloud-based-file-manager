import { useNavigate } from "react-router-dom";
import { supabase } from "../auth/supabaseClient";
import { useEffect } from "react";
import { useAuthContext } from "../auth/useAuth";
import { Profile_icon } from "../components/Profile_icon";


import { gameData, foundFile } from "src/shared/types";
import { useLocation } from "react-router-dom";
import React, { useState } from "react";
import HexGameCard from "../components/HexGameCard";
import { cloudSave } from "src/shared/types";
import { GeneralisedbuttonSm, SignOut } from "../components/buttons";
import fs from "fs";


export default function Selectors() {
  const back = useNavigate();
  const { user } = useAuthContext();
  const location = useLocation();

  const game = location.state?.selectedgame as cloudSave;
  const [availableSaves, setAvailableSaves] = useState<cloudSave[]>([]);
  const [selectedGame, setSelectedGame] = useState<cloudSave[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [games, setGames] = useState<gameData[]>([]);

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

  function removeEnd(directory: string): string {
  // Förväntare fullynormalized directories
  const sliced = directory.split("\\");
  console.log("before pop",sliced);
  sliced.pop();
  console.log("we are doing sth with slice gangalicious", sliced);
  const remadePath = sliced.join("\\")
  console.log(`Remade path for matching: ${remadePath}`);

  return remadePath;
  }

  function splitFileName(file: string): string  {
    const split = file.split("elefantkraka");
    return split[0];
  }
 



  const DownloadSelected = async () => {
    const headfolder = game.gameName;
    if (selectedGame.length === 0) {
      alert("Please select at least one save to download.");
      return;
    }

    try {
      for (const save of selectedGame) {
        
        let cloudFilePath = "";
          if(save.appID === "1"){
            cloudFilePath = `${user.id}/${game.gameName}/${save.fileName}.zip`;
          } else {
            cloudFilePath = `${user.id}/${game.gameName}/${game.index}/${save.fileName}`;
          }
        console.log("Attempting to download file from path: ", cloudFilePath);
        const { data, error } = await supabase
          .storage
          .from("Game-save")
          .createSignedUrl(cloudFilePath, 60);

        if (error || !data) {
          console.error("Error downloading file: ", error);
          continue; // Skip this file and move to the next one
        }
        try {
        let localfilePath = "";
        if (save.appID === "1"){
          localfilePath = save.relativePath;
        } else {
          localfilePath = await window.electron.cloudMatcher(save.appID, save.rootID, save.relativePath);
        }

        console.log("Local file path determined: ", localfilePath);
        
        if(await window.electron.checkIfFileExists(localfilePath)) {
          const overrideselect = window.confirm(`${save.fileName} already exists at ${localfilePath}. Do you want to overwrite it?`)
          if(!overrideselect) { 
            console.log(`Skipping download of ${save.fileName} as it already exists and user chose not to overwrite.`);
          }
          else{
            if (save.appID === "1"){
              console.log("1:", localfilePath)
              console.log("2:", removeEnd(localfilePath))
              console.log("Going to remove the folder first")
              await window.electron.downloadSave(data.signedUrl, removeEnd(localfilePath), localfilePath);
            } else {
              console.log(save.appID)
              await window.electron.downloadSave(data.signedUrl, removeEnd(localfilePath));
            }
            
            console.log(`File ${save.fileName} downloaded and extracted successfully.`);
            setSelectedGame((prev) => prev.filter((x) => x.relativePath !== save.relativePath));
            setAvailableSaves((prev) => [...prev, save])
          } 
        } else {
           await window.electron.downloadSave(data.signedUrl, removeEnd(localfilePath));
           console.log(`File ${save.fileName} downloaded and extracted successfully.`);
           setSelectedGame((prev) => prev.filter((x) => x.relativePath !== save.relativePath));
           setAvailableSaves((prev) => [...prev, save])
        } 



      } catch (error) {
          console.error(`Error downloading or extracting file ${save.fileName}: `, error);
        }}
    } catch (error) {
      console.error("Error fetching saves: ", error);
    }
  }




  const SelectSave = (MoveToSelect: cloudSave) => {
    //Steg A: Ta bort från tillgängliga saves
    //"Behåll alla filer vars namn vi inte klickat på"
    setAvailableSaves((prev) => prev.filter((save) => save.relativePath !== MoveToSelect.relativePath));
    setSelectedGame((prev) => [...prev, MoveToSelect])
  }


  const DeselectSave = (MoveToAvailable: cloudSave) => {
    setSelectedGame((prev) => prev.filter((save) => save.relativePath !== MoveToAvailable.relativePath));
    setAvailableSaves((prev) => [...prev, MoveToAvailable])
  }

  const DeleteFromSupabase = async () => {
    if (selectedGame.length === 0) {
      alert("Please select at least one save to delete.");
      return;
    }
    try {
      for (const save of selectedGame) {
        const deleteConfirm = window.confirm(`Are you sure you want to delete ${save.fileName} This action cannot be undone.`);
        if(!deleteConfirm) {
          console.log(`Skipping deletion of ${save.fileName} as user chose not to delete.`);
          continue;
        }
        try {
          let cloudFilePath = "";
          if(save.appID === "1"){
            cloudFilePath = `${user.id}/${game.gameName}/${save.fileName}.zip`;
          } else {
            cloudFilePath = `${user.id}/${game.gameName}/${game.index}/${save.fileName}`;
          }
        
        const { error: storageError } = await supabase
          .storage
          .from("Game-save")
          .remove([cloudFilePath]);

        if (storageError) throw storageError;

        const { error: dbError } = await supabase
          .from("game_saves")
          .delete()
          .eq("user_id", user.id)
          .eq("app_id", game.appID)
          .eq("relative_path", save.relativePath);
          
        if (dbError) throw dbError;

        console.log(`File ${save.fileName} deleted successfully from Supabase.`);


        } catch (error) {
          console.error(`Error deleting file ${save.fileName}: `, error);
        }
        setSelectedGame((prev) => prev.filter((x) => x.relativePath !== save.relativePath));
      }
    } catch (error) {
      console.error("Error deleting file: ", error);
  }
  }

  let imgSrc = ""
  if (game.appID === "1"){
    imgSrc = "/wideFolder2.jpg";
  } else{
    imgSrc = `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${game.appID}/library_hero.jpg`;
  };


  return (
    <div className="flex flex-col items-center pt-[40px]">

      <div className="bg-[#ffffff]/50 h-[651px] w-[643px] rounded-[20px] flex flex-col items-center pt-[40px]">
        <div className="w-[600px] h-[150px] bg-[#D9BBA1] rounded-[20px] flex">
          <div className="justify-center items-center flex ml-5">
            <img className="rounded-[20px] w-[300px] h-auto" src={imgSrc}/>
          </div>
            <div className="justify-center ml-10 flex flex-col font-kodchasan">
              <p className="text-2xl pb-2">{game.gameName}</p>
              
            </div>

        </div>


        <div className="flex flex-row">

          <div className="mt-4 h-[335px] w-[250px] overflow-auto scrollbar-hide mr-5">
            <h1 className="font-kodchasan">Cloud Database</h1>
            {availableSaves.map((save) => (
              <div onClick={() => SelectSave(save)}
                key={save.relativePath}
                className="bg-[#D9BBA1]/60 p-1 rounded mb-4">
                <h3 className="text-md font-bold font-kodchasan">Name: {save.fileName}</h3>
                <p className="text-sm font-kodchasan">Size: {save.fileSize} MB</p>
                
              </div>

            ))}
          </div>

          <div className=" mt-4 h-[335px] w-[250px] overflow-auto scrollbar-hide">
            <h1 className="font-kodchasan">Selected File</h1>
            {selectedGame.map((save) => (
              <div onClick={() => DeselectSave(save)}
                key={save.relativePath}
                className="bg-[#D9BBA1]/60 p-1 rounded mb-4">
                <h3 className="text-md font-bold font-kodchasan">Name: {save.fileName}</h3>
                <p className="text-sm font-kodchasan">Size: {save.fileSize} MB</p>
              </div>

            ))}
          </div>
        </div>

        <div className="pt-3 flex flex-row gap-4">
                  <GeneralisedbuttonSm buttonName="Download" onClick={() => DownloadSelected()}/>
                  <GeneralisedbuttonSm buttonName="Delete" onClick={DeleteFromSupabase}/>
                </div>
      </div>
      <div className="position: fixed bottom-16 left-6">
                <GeneralisedbuttonSm buttonName="Back" onClick={() => back(-1)}/>
        </div>

    </div>
  );
}
