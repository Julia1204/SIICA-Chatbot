import React from "react";
import "./App.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import { SettingsProvider } from "./settings/SettingsContext";
import SettingsPage from "./settings/SettingsPage";
import MultitaskingTest from "./MultitaskingTest";

function App() {
  return (
    <SettingsProvider>
      <HashRouter>
        <Routes>
          {/* Main test screen */}
          <Route path="/" element={<MultitaskingTest />} />

          {/* Settings page */}
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </HashRouter>
    </SettingsProvider>
  );
}

export default App;
