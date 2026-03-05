import {
  HashRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import Login_screen from "./authflow/login-screen";
import React, { useState } from "react";
import { Homescreen } from "./Homescreen";
import { uploadGameSave } from "src/Main/save-handler";


import { AuthContext } from "src/hooks/useAuth";
import AuthProvider from "./authflow/authProvider";

import CloudFileList from "./CloudSelectPage";
import GameList from "./GameSelectPage";
import { LiquidGlassProvider } from "@gracefullight/liquid-glass";
import TopBar from "./TopBar";
import Selector from "./GameSaveSelect";
import Selectors from "./CloudSave";

export const App = () => {
  return (
    <div>
      <TopBar />
      <AuthProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Login_screen />} />
            {/*Här ska man kanske sätta in någon form av guard???  */}
            <Route path="/home" element={<Homescreen />} />
            <Route path="/CloudSelectPage" element={<CloudFileList />} />
            <Route path="/CloudSave" element={<Selectors />} />
            <Route path="/GameSelectPage" element={<GameList />} />
            <Route path="/GameSaveSelect" element={<Selector />} />
          </Routes>
        </HashRouter>
      </AuthProvider>
    </div>
  );
};

{
  /* <div className="min-h-screen text-white bg-center bg-no-repeat bg-cover bg-fixed">
      <div
        className="w-full h-8"
        style={{ WebkitAppRegion: "drag" } as React.CSSProperties}>
        Nomadsync
      </div> */
}
