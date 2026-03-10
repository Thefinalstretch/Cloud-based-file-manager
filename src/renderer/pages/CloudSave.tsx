import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { cloudSave } from "src/shared/types";
import { GeneralisedbuttonSm} from "../components/buttons";
import { useAuthContext } from "../auth/useAuth";
import { deleteCloudSave } from "../services/cloudSave.service";
import { useSelectableList } from "../util/hooks/useSelectableList";
import { getGameImageSrc } from "../util/graphicHelper";
import { createCloudSaveSignedUrl, 
         LocalSavePath, 
         downloadCloudSave} 
from "../services/download.service";


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
/**
 * Handles the download of selected cloud saves.
 * For each selected save, it creates a signed URL, checks if the file already exists locally.
 * Based on user input, it either overwrites the existing file or skips the download.
 * @returns {Promise<void>}
 */
const handleDownloadSelected = async () => {
  if (selectedFiles.length === 0) {
    alert("Please select at least one save to download.");
    return;
  }

  for (const save of selectedFiles) {
    try {
      console.log(game.gameName)
      console.log(save)
      const signedUrl = await createCloudSaveSignedUrl(
        user.id,
        game.gameName,
        save.index,
        save,
      );

      const localFilePath = await LocalSavePath(save);
      const alreadyExists = await window.electron
                                    .checkIfFileExists(localFilePath);

      if (alreadyExists) {
        const shouldOverwrite = window.confirm(
          `${save.fileName} already exists at ${localFilePath}. Do you want to overwrite it?`,
        );

        if (!shouldOverwrite) {
          console.log(`Skipping download of ${save.fileName}.`);
          continue;
        }
      }

      await downloadCloudSave(
        signedUrl,
        save,
        localFilePath
      );

      console.log(`File ${save.fileName} downloaded successfully.`);

      setSelectedFiles((prev) =>
        prev.filter((x) => x.relativePath !== save.relativePath),
      );
      setAvailableFiles((prev) => [...prev, save]);
    } catch (error) {
      console.error(`Error downloading ${save.fileName}:`, error);
      alert(`Error downloading ${save.fileName}`);
    }
  }
};

  async function handleDeleteSelected() {
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
        await deleteCloudSave(
          user.id,
          game.gameName,
          game.appID,
          save.index,
          save
        );

        alert(`File ${save.fileName} deleted successfully from Supabase.`);
        setSelectedFiles((prev) => prev.filter((x) => x.relativePath !== save.relativePath)
        );
      } catch (error) {
        alert(`Error deleting file ${save.fileName}: ${error}`);
      }
    }
  }

  const imgSrc = getGameImageSrc(game.appID);

  return (
    <div className="flex flex-col items-center pt-[40px]">

      <div className="bg-[#ffffff]/50 h-[651px] w-[643px] rounded-[20px] 
                     flex flex-col items-center pt-[40px]">
        <div className="w-[600px] h-[150px] bg-[#D9BBA1] rounded-[20px] flex">
          <div className="justify-center items-center flex ml-5">
            <img className="rounded-[20px] w-[300px] h-auto" src={imgSrc}/>
          </div>
            <div className="justify-center ml-10 flex flex-col font-kodchasan">
              <p className="text-2xl pb-2">{game.gameName}</p>
              
            </div>

        </div>


        <div className="flex flex-row">

          <div className="mt-4 h-[335px] w-[250px] overflow-auto 
                         scrollbar-hide mr-5">
            <h1 className="font-kodchasan">Cloud Database</h1>
            {availableFiles.map((save) => (
              <div onClick={() => selectSave(save)}
                key={save.relativePath}
                className="bg-[#D9BBA1]/60 p-1 rounded mb-4">
                <h3 className="text-md font-bold font-kodchasan">
                    Name: {save.fileName}</h3>
                <p className="text-sm font-kodchasan">
                    Size: {save.fileSize} MB</p>
                
              </div>

            ))}
          </div>

          <div className="mt-4 h-[335px] w-[250px] 
                          overflow-auto scrollbar-hide">
            <h1 className="font-kodchasan">Selected File</h1>
            {selectedFiles.map((save) => (
              <div onClick={() => deselectSave(save)}
                key={save.relativePath}
                className="bg-[#D9BBA1]/60 p-1 rounded mb-4">
                <h3 className="text-md font-bold font-kodchasan">
                    Name: {save.fileName}</h3>
                <p className="text-sm font-kodchasan">
                    Size: {save.fileSize} MB</p>
              </div>

            ))}
          </div>
        </div>

        <div className="pt-3 flex flex-row gap-4">
                  <GeneralisedbuttonSm buttonName="Download" 
                    onClick={handleDownloadSelected}/>
                  <GeneralisedbuttonSm buttonName="Delete" 
                    onClick={handleDeleteSelected}/>
                </div>
      </div>
      <div className="fixed bottom-16 left-6">
                <GeneralisedbuttonSm buttonName="Back" 
                  onClick={() => back(-1)}/>
        </div>

    </div>
  );
}
