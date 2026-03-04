import {
  HashRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import React, { useEffect, useState } from "react";
import UploadSave from "./UploadGameSave";
import { SignOut, Signoutbutton } from "./authflow/buttons";
import { useAuthContext } from "../hooks/useAuth";
import { Profile_icon } from "./Profile_icon";
import { Googlesigninbutton, Generalisedbutton } from "./authflow/buttons";

// kanske måste lägga till lite grejer innan return statementet
export const Homescreen = () => {
  const { isLoggedIn, isLoading } = useAuthContext();
  const router = useNavigate();
  const {user} = useAuthContext();

  useEffect(() => {
    // vi har även en isLoading state i authContext som vi kan använda för att undvika att redirecta innan
    // vi vet om användaren är inloggad eller inte. Exempelvis tar det en stund för supabase att verifiera sessionen när appen startar,
    // och under den tiden vill vi inte redirecta användaren till login-skärmen.
    // Detta skulle kunna hända när man refreshar sidan, då appen startar om och authContext måste verifiera sessionen igen.
    // Utan isLoading skulle användaren då snabbt flasha in på login-skärmen innan de redirectas tillbaka till homescreen när sessionen verifierats.
    // Med isLoading kan vi undvika den flashen och bara redirecta till login-skärmen om vi vet att användaren inte
    // är inloggad efter att sessionen verifierats.
    if (!isLoggedIn && !isLoading) {
      router("/");
    }
  }, [isLoggedIn, isLoading]);

  return (
    
    
    <div>
      
      
      <div className="flex-1 flex flex-col items-center justify-center pt-[78px]">
      <p className="font-kodchasan text-5xl text-[#57463D]">NomadSync</p>

      <div className="flex items-center justify-center pt-44 gap-5">
        <Generalisedbutton buttonName="Upload Game-Save" onClick={() => router("/GameSelectPage")
        }/>
        <Generalisedbutton buttonName="Download Game-Save" onClick={() => router("/CloudSelectPage")}/>
      </div>
      <div className="pt-5">
        <Generalisedbutton buttonName="Sign Out" onClick={SignOut}/>
      </div>
    </div>
      <div className="position: fixed top-16 left-5 "> <Profile_icon/>
            <h1 className="position: fixed top-10 left-4 font-[Kodchasan-SemiBold] text-[#57463D] text-sm">Signed in as: {user.email}</h1>      

    </div>
  </div>
  );
};
