import {
  HashRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import React, { useEffect, useState } from "react";
import DownloadSave from "./DownloadGameSave";
import UploadSave from "./UploadGameSave";
import { Signoutbutton } from "./authflow/buttons";
import { useAuthContext } from "../hooks/useAuth";
import { find_steampath } from "src/Main/LocalDirectory_finder";
// kanske måste lägga till lite grejer innan return statementet
export const Homescreen = () => {
  const { isLoggedIn, isLoading } = useAuthContext();
  const router = useNavigate();

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
      <h1>Welcome to the Home Screen!</h1>

      <button onClick={() => router("/UploadGameSave")}>
        Upload Game Save
      </button>

      <button onClick={() => router("/DownloadGameSave")}>
        Download Game Save
      </button>

      <button onClick={async () => {
        const steamPath = await window.electron.find_steampath();
        console.log("Steam Path:", steamPath);
      }} >
      find steam path
      </button>

      <Signoutbutton />
    </div>
  );
};
