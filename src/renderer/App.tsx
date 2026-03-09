import {
  HashRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import Login_screen from "./pages/login-screen";
import React, { useState } from "react";
import { Homescreen } from "./pages/Homescreen";


import { AuthContext } from "src/renderer/auth/useAuth";
import AuthProvider from "./auth/authProvider";

import CloudFileList from "./pages/CloudSelectPage";
import GameList from "./pages/GameSelectPage";
import { LiquidGlassProvider } from "@gracefullight/liquid-glass";
import TopBar from "./components/TopBar";
import Selector from "./pages/GameSaveSelect";
import Selectors from "./pages/CloudSave";

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

