import React from "react";
import "./App.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import { SettingsProvider } from "./settings/SettingsContext";
import { GameProvider } from "./GameProvider";
import Assistant from "./assistant/Assistant";
import SettingsPage from "./settings/SettingsPage";
import MultitaskingTest from "./games/multitasking/MultitaskingTest";
import Survey from "./survey/Survey";

function App() {
  return (
    <SettingsProvider>
      <GameProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Assistant />} />
            {/* Games */}
            <Route path="/multitasking" element={<MultitaskingTest />} />
            {/* Settings */}
            <Route path="/settings" element={<SettingsPage />} />
            {/* Survey */}
            <Route path="/survey" element={<Survey />} />
            {/* <Route path="/" element={<GameSelectionPage />} /> */}
          </Routes>
        </HashRouter>
      </GameProvider>
    </SettingsProvider>
  );
}

export default App;
