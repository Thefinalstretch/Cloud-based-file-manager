import React, { useState } from "react";
import { useAuthContext } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Profile_icon } from "./Profile_icon";

export default function Gamefinder() {
  const back = useNavigate();
  const { user } = useAuthContext();
  const [worlds, setWorlds] = useState<any[]>([]);
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
  handleAutoFind();
  //   const handleUpload = async (worldPath: string, worldName: string) => {
  //     if (!user) {
  //       alert("You need to be logged in!");
  //       return;
  //     }
  //     setStatus(`Uploading `);

  //     try {
  //       const result = await window.electron.uploadSave(
  //         worldPath,
  //         user.id,
  //         worldName,
  //       );

  //       if (result.success) {
  //         setStatus(`${worldName} Uploaded successfully`);
  //       } else {
  //         setStatus(` Failed to upload ${worldName} :(`);
  //       }
  //     } catch (error) {
  //       console.error(error);
  //       setStatus("Error during upload: " + error);
  //     }
  //   };
  return <button onClick={Gamefinder}>Find Minecraft Worlds</button>;
}
