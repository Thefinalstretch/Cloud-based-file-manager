import { useNavigate } from "react-router-dom";
import { supabase } from "./authflow/supabase-vite";
import { useEffect } from "react";
import { useAuthContext } from "../hooks/useAuth";
import { Profile_icon } from "./Profile_icon";
import { Extract_button } from "./authflow/file_management/buttons";
import Gamefinder from "./Gamefinder";
import { GameData } from "src/types";
import { useLocation } from "react-router-dom";
import React, { useState } from "react";

export default function Selector() {
  const back = useNavigate();
  const { user } = useAuthContext();
  const location = useLocation();
  

  const game = location.state?.game as GameData;
  

  return (
   <div className="flex flex-col items-center pt-[40px]">
     
    <div className="bg-blue-400/50 h-[651px] w-[643px] rounded-[20px] z-9 pl-[20px] pt-[20px]">
     <div className="w-[246px] h-[150px] bg-[#D9BBA1] rounded-[20px] ">
      <header>{game.Gamename}</header> 
      <p>{game.SizeOnDisk} GB</p>
      <p>{game.lastplayed}</p>
      
      </div> 
        <p 
            className="text-black z-10 pl-[10px] text-xl">
                
        </p>
      </div>
      <button className="bg-gray-800" onClick={() => back(-1)}>
          Back
        </button>
   </div>
  
   
  );
}
