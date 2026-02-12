import React, { useState } from "react";
import { supabase } from "../supabase-vite";

export const Extract_button = () => {
  const [selectedPath, setSelectedPath] = useState<string>("");
  const handleAddGame = async () => {
    const path = await window.electron.selectFolder();

    if (path) {
      console.log("selected: ", path);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      console.log(user);

      setSelectedPath(path);

      await window.electron.uploadSave(path, user?.id as string, "Minecraft");
    }
  };
  return (
    <div
      style={{
        marginTop: "50px",
        borderTop: "2px dashed red",
        padding: "20px",
      }}>
      <h3> Developer Test Zone </h3>
      <p>Selected Folder: {selectedPath || "None"}</p>

      <button
        onClick={handleAddGame}
        style={{ padding: "10px", fontSize: "16px" }}>
        Test Folder Picker
      </button>
    </div>
  );
};
