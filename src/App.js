import React from "react";
import "./App.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import { SettingsProvider } from "./settings/SettingsContext";
import { GameProvider } from "./GameProvider";
import Assistant from "./assistant/Assistant";
import SettingsPage from "./settings/SettingsPage";
import MultitaskingTest from "./games/multitasking/MultitaskingTest";
import StopSignalTest from "./games/stop/StopSignalTest";
import Survey from "./survey/Survey";
import Navbar from "./navbar/Navbar";
import AboutPage from "./navbar/AboutPage";

function App() {
  return (
    <SettingsProvider>
      <GameProvider>
        <HashRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Assistant />} />
            {/* Games */}
            <Route path="/multitasking" element={<MultitaskingTest />} />
            <Route path="/stop" element={<StopSignalTest />} />
            {/* Settings */}
            <Route path="/settings" element={<SettingsPage />} />
            {/* Survey */}
            <Route path="/survey" element={<Survey />} />
            {/* About */}
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </HashRouter>
      </GameProvider>
    </SettingsProvider>
  );
}

export default App;
