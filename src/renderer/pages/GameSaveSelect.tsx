import { useNavigate } from "react-router-dom";
import { supabase } from "../auth/supabaseClient";
import { useAuthContext } from "../auth/useAuth";
import { useSelectableList } from "../util/hooks/useSelectableList";

import { gameData, foundFile } from "src/shared/types";
import { useLocation } from "react-router-dom";
import { getGameImageSrc } from "../util/graphicHelper";
import { useState } from "react";
import { Generalisedbutton, GeneralisedbuttonSm } from "../components/buttons";

export default function Selector() {
  const back = useNavigate();
  const { user } = useAuthContext();
  const location = useLocation();

  const game = location.state?.selectedFiles as gameData;
  const {
  availableItems: availableFiles,
  selectedItems: selectedFiles,
  setAvailableItems: setAvailableFiles,
  setSelectedItems: setSelectedFiles,
  selectItem: selectSave,
  deselectItem: deselectSave,
  } = useSelectableList<foundFile>(game?.saves || []);

  const UploadSelected = async () => {
    const headfolder = game.gameName;
    if (selectedFiles.length === 0) {
      alert("Please select at least one save to upload.");
      return;
    }

    try {
      for (const save of selectedFiles) {
        
        const path = save.filePath;
        //Logik för att titta om relative path finns i databasen
        const uploadConfirm = window.confirm(
          `Are you sure you want to upload ${save.fileName}?`,
        );
        if (!uploadConfirm) {
          continue;
        }

        try{
          await terminateDupesAndUpload(0, save);
          alert(`Successfully uploaded: ${save.fileName}`);
        } catch(error) {
          alert(`Upload failed for: ${save.fileName} ${error}`);
        }
      }
     
    } catch (error) {
      console.error("Error uploading saves: ", error);
    }

  };

  async function Upload(index : number, save: foundFile) {
    setSelectedFiles((prev) => prev.filter((x) => x.relativePath !== save.relativePath));
    setAvailableFiles((prev) => [...prev, save])
    return window.electron.uploadsave_separate(save.filePath,
                                                user?.id as string,
                                                game.appID,
                                                game.gameName,
                                                save.fileName,
                                                save.relativePath,
                                                save.rootID,
                                                index);
    
  }

  async function terminateDupesAndUpload(index: number, save: foundFile) {
    let {data: dataExactFile, error: ErrorExactFile} = await supabase.from("game_saves").select("index").eq("relative_path", save.relativePath).eq("user_id", user?.id).eq("app_id", game.appID);
    let {data: dataBaseFileName, error: ErrorFileName} = await supabase.from("game_saves").select("id").eq("file_name", save.fileName).eq("user_id", user?.id).eq("app_id", game.appID).eq("index", index);

    if(ErrorExactFile){
      throw ErrorExactFile
    }

    if(ErrorFileName){
      throw ErrorFileName;
    }

    if (dataExactFile.length !== 0) {
      console.log("There is an exact file with index: ", dataExactFile[0].index);
      
      console.log("Uploading file to index: ", dataExactFile[0].index);

      return await Upload(dataExactFile[0].index, save);
    } else if (dataBaseFileName.length === 0) {

      console.log("Index:", index)

      return await Upload(index, save);
    }
    else {
      console.log("Index", index, "Data", dataExactFile);
      return await terminateDupesAndUpload(index + 1, save);
    }
  }
  const imgSrc = getGameImageSrc(game.appID);

  return (
    <div className="flex flex-col items-center pt-[40px]">
      <div className="bg-[#ffffff]/50 h-[651px] w-[643px] rounded-[20px] flex flex-col items-center pt-[40px]">
        <div className="w-[600px] h-[150px] bg-[#D9BBA1] rounded-[20px] flex">
          <div className="justify-center items-center flex ml-5">
            <img
              className="rounded-[20px] w-[300px] h-auto"
              src={imgSrc}
            />
          </div>
          <div className="mt-7 ml-10 flex flex-col font-kodchasan">
            <p className="text-2xl pb-2 ">{game.gameName}</p>
            <p>Size: {game.sizeOnDisk} GB</p>
            <p>Last Played: {game.lastPlayed}</p>
          </div>
        </div>

        <div className="flex flex-row">
          <div className="mt-4 h-[335px] w-[250px] overflow-auto scrollbar-hide mr-5">
            <h1 className="font-kodchasan">Local Saves</h1>
            {availableFiles.map((save) => (
              <div
                onClick={() => selectSave(save)}
                key={save.relativePath}
                className="bg-[#D9BBA1]/60 p-1 rounded mb-4"
              >
                <h3 className="text-md font-bold font-kodchasan">
                  Name: {save.fileName}
                </h3>
                <p className="text-sm font-kodchasan">
                  Size: {save.fileSize} MB
                </p>
              </div>
            ))}
          </div>

          <div className=" mt-4 h-[335px] w-[250px] overflow-auto scrollbar-hide">
            <h1 className="font-kodchasan">To Be Uploaded</h1>
            {selectedFiles.map((save) => (
              <div
                onClick={() => deselectSave(save)}
                key={save.relativePath}
                className="bg-[#D9BBA1]/60 p-1 rounded mb-4"
              >
                <h3 className="text-md font-bold font-kodchasan">
                  Name: {save.fileName}
                </h3>
                <p className="text-sm font-kodchasan">
                  Size: {save.fileSize} MB
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="pt-3 ">
          <GeneralisedbuttonSm
            buttonName="Upload"
            onClick={() => UploadSelected()}
          />
        </div>
      </div>
      <div className="fixed bottom-16 left-6">
        <GeneralisedbuttonSm buttonName="Back" onClick={() => back(-1)} />
      </div>
    </div>
  );
}
