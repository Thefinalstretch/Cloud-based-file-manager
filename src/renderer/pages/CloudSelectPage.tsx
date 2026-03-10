
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { cloudSave } from "src/shared/types";
import HexGameCard from "../components/HexGameCard";
import { useAuthContext } from "../auth/useAuth";
import { GeneralisedbuttonSm } from "../components/buttons";
import { simulateItems, createHoneycombRows } from "../util/HoneyComb";
import { removeDuplicated } from "../util/saveHelpers";

/**
 * The game list page component, responsible for displaying the list of games with saves available for download.
 * Fetches cloud saves and then renders a honeycomb style layout of game cards buttons.
 * To be precise, the available saves are fetched, but only one save per game is rendered so only one entry per game is shown.
 * The available saves are passed on to the next page.
 * @returns {JSX.Element} The game cloud data selection interface.
 */
export default function CloudFileList() {

  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [saves, setSaves] = useState<cloudSave[]>([]);
  const [nr_saves, setNr_saves] = useState<cloudSave[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

  /**
   * Fetches the game from the supabase database, then removes duplicated games, 
   * leaving only one entry per game, while changing the state of saves and nr_saves, 
   * the first is used for rendering, the second is used to count the number of saves per game.
   * @returns {Promise<void>}
   */
    const fetchGames_from_supabase = async () => {
      try {
        setLoading(true);

        const response = await window.electron.fetchCloudSaves(user?.id);
        
        if (response) {
          // Removes files from the same games, leaving a single file for each wich becomes the entry point.
          setSaves(removeDuplicated(response.saves));
          setNr_saves(response.saves);
        }
      }
      catch (error) {
        console.error("Failed to fetch games:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames_from_supabase();
  }, []);
 // Simulates additional saves to fill the UI, to later be replaced with actual data from the database.
  const simulatedSaves = simulateItems(
    saves,
    40,
    (i) =>
      ({
        gameName: `Empty Slot`,
        appID: `Test Game ${i}`,
        lastUpdated: "10 GB",
        fileSize: "2024-01-01",
        isDummy: false, // Changing this to true removes additional rendering, for program showcase, keep false.
        storagePath: "1.0",
      } as cloudSave)
  );

  const honeycombRows = createHoneycombRows(simulatedSaves);

  if (loading) {
    return <div>Loading games...</div>;
  }

  return (
    <div>
      <div className="justify-center items-center flex-col flex">
        <h1 className="mb-10 text-5xl font-bold text-[#57463D] 
                       font-[Kodchasan-Semibold] pt-16">
          Select a Game to Download
        </h1>
        <div className="h-[550px] w-full overflow-y-auto scrollbar-hide 
                       [mask-image:linear-gradient(to_bottom,transparent,blue_25%,blue_75%,transparent)]">
          <div className="flex flex-col items-center pt-20">
            {honeycombRows.map((row, rowIndex) => (
              <div
                key={`row-${rowIndex}`}
                className={`flex justify-center gap-4 ${rowIndex > 0 ? "-mt-[25px]" : ""}`}>
                {row.map((game: cloudSave) => {
                  if (game.isDummy) {
                    return <div key={game.appID} className="w-[125px] "></div>;
                  }
                  const filesWithSameID = nr_saves.filter(x => x.appID === game.appID);
                  return (<button 
                           key={game.appID}
                           onClick={() => navigate("/cloudSave",
                    { state: { selectedFiles: game }, })} >
                    
                    <HexGameCard
                      key={game.fileName}
                      gameID={game.appID}
                      gameName={game.gameName}
                      gameSavesLength={filesWithSameID.length}
                    />
                  </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        <div className="fixed bottom-16 left-6">
          <GeneralisedbuttonSm buttonName="back" 
              onClick={() => navigate(-1)}/>
        </div>
      </div>
    </div>
  );
}

