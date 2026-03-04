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

      alert(`Are you sure you want to upload ${path}?`);

      await window.electron.uploadSave(path, user?.id as string, "Personal Files");
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


export const Extract_button_file = () => {
  const [selectedPath, setSelectedPath] = useState<string>("");
  const handleAddGame = async () => {
    const path = await window.electron.selectFile();

    if (path) {
      console.log("selected: ", path);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      console.log(user);

      setSelectedPath(path);

      alert(`Are you sure you want to upload ${path}?`);

      await window.electron.uploadsave_separate(path, user?.id as string);
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
      <p>Selected File: {selectedPath || "None"}</p>

      <button
        onClick={handleAddGame}
        style={{ padding: "10px", fontSize: "16px" }}>
        Test File Picker
      </button>
    </div>
  );
};
export function CustomCoolButton() {
  return (
    <div className="flex w-[437px] h-[75px]  relative overflow-hidden  hover:scale-105 transition-transform duration-200 cursor-pointer liquid-glass-card transform-gpu will">
      <div className="flex-1 flex items-center pl-[15px] relative z-10">
        
      </div>
      <span className="font-InterSemi text-[#EEDFD1] text-4xl items-center flex pr-[20px] relative z-10">
        Sign in using Google
      </span>
    </div>
  );
}

