import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { gameData, cloudSave } from "src/shared/types";
import { GeneralisedbuttonSm} from "../components/buttons";
import { useAuthContext } from "../auth/useAuth";
import { supabase } from "../auth/supabaseClient";
import { removeEnd } from "../util/saveHelpers";
import { deleteCloudSave, buildCloudFilePath } from "../services/cloudSave.service";
import { useSelectableList } from "../util/hooks/useSelectableList";
import { getGameImageSrc } from "../util/graphicHelper";

export default function Selectors() {
  const back = useNavigate();
  const { user } = useAuthContext();
  const location = useLocation();

  const game = location.state?.selectedFiles as cloudSave;
  const {
  availableItems: availableFiles,
  selectedItems: selectedFiles,
  setAvailableItems: setAvailableFiles,
  setSelectedItems: setSelectedFiles,
  selectItem: selectSave,
  deselectItem: deselectSave,
  } = useSelectableList<cloudSave>([]);

  useEffect(() => {
    const fetchSaves = async () => {
      try {
        const data = await window.electron.fetchCloudSaves(user.id)

        if (data) {
          const new_data = data.saves.filter((save) => save.appID === game.appID
          )
          setAvailableFiles(new_data);
        }
      } catch (error) {
        console.error("misslyckades att hämta saves", error);
      }

    }

    fetchSaves();

  }, [])

  const DownloadSelected = async () => {
    if (selectedFiles.length === 0) {
      alert("Please select at least one save to download.");
      return;
    }

    try {
      for (const save of selectedFiles) {

        const cloudFilePath = buildCloudFilePath(user.id, game.gameName, save.index, save)

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
              await window.electron.downloadSave(data.signedUrl, removeEnd(localfilePath), localfilePath);
            } else {
              console.log(save.appID)
              await window.electron.downloadSave(data.signedUrl, removeEnd(localfilePath));
            }
            
            console.log(`File ${save.fileName} downloaded and extracted successfully.`);
            setSelectedFiles((prev) => prev.filter((x) => x.relativePath !== save.relativePath));
            setAvailableFiles((prev) => [...prev, save])
          } 
        } else {
           await window.electron.downloadSave(data.signedUrl, removeEnd(localfilePath));
           console.log(`File ${save.fileName} downloaded and extracted successfully.`);
           setSelectedFiles((prev) => prev.filter((x) => x.relativePath !== save.relativePath));
           setAvailableFiles((prev) => [...prev, save])
        } 



      } catch (error) {
          console.error(`Error downloading or extracting file ${save.fileName}: `, error);
        }}
    } catch (error) {
      console.error("Error fetching saves: ", error);
    }
  }

  const handleDeleteSelected = async () => {
  if (selectedFiles.length === 0) {
    alert("Please select at least one save to delete.");
    return;
  }

  for (const save of selectedFiles) {

    const deleteConfirm = window.confirm(
      `Are you sure you want to delete ${save.fileName}? This action cannot be undone.`
    );

    if (!deleteConfirm) {
      console.log(`Skipping deletion of ${save.fileName} as user chose not to delete.`);
      continue;
    }

    try {
      await deleteCloudSave({
        userId: user.id,
        gameName: game.gameName,
        gameAppId: game.appID,
        gameIndex: save.index,
        save,
      });

      alert(`File ${save.fileName} deleted successfully from Supabase.`);
      setSelectedFiles((prev) =>
        prev.filter((x) => x.relativePath !== save.relativePath)
      );
    } catch (error) {
      alert(`Error deleting file ${save.fileName}: ${error}`);
    }
  }
};

  const imgSrc = getGameImageSrc(game.appID);

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
            {availableFiles.map((save) => (
              <div onClick={() => selectSave(save)}
                key={save.relativePath}
                className="bg-[#D9BBA1]/60 p-1 rounded mb-4">
                <h3 className="text-md font-bold font-kodchasan">Name: {save.fileName}</h3>
                <p className="text-sm font-kodchasan">Size: {save.fileSize} MB</p>
                
              </div>

            ))}
          </div>

          <div className=" mt-4 h-[335px] w-[250px] overflow-auto scrollbar-hide">
            <h1 className="font-kodchasan">Selected File</h1>
            {selectedFiles.map((save) => (
              <div onClick={() => deselectSave(save)}
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
                  <GeneralisedbuttonSm buttonName="Delete" onClick={handleDeleteSelected}/>
                </div>
      </div>
      <div className="fixed bottom-16 left-6">
                <GeneralisedbuttonSm buttonName="Back" onClick={() => back(-1)}/>
        </div>

    </div>
  );
}
