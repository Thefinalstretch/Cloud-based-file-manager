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
import DownloadSave from "./DownloadGameSave";
import UploadSave from "./UploadGameSave";
import { AuthContext } from "src/hooks/useAuth";
import AuthProvider from "./authflow/authProvider";
import Gamefinder from "./Gamefinder";
import UploadGameData from "./UploadGameData";
import { LiquidGlassProvider } from "@gracefullight/liquid-glass";

export const App = () => {
  return (
    <AuthProvider>
      <LiquidGlassProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Login_screen />} />
            {/*Här ska man kanske sätta in någon form av guard???  */}
            <Route path="/home" element={<Homescreen />} />
            <Route path="/UploadGameSave" element={<UploadSave />} />
            <Route path="/DownloadGameSave" element={<DownloadSave />} />
            <Route path="/UploadGameData" element={<UploadGameData />} />
          </Routes>
        </HashRouter>
      </LiquidGlassProvider>
    </AuthProvider>
  );
};
