import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SettingsProvider } from './settings/SettingsContext';
import SettingsPage from './settings/SettingsPage';
import MultitaskingTest from './MultitaskingTest';

function App() {
  return (
    <SettingsProvider>
      <BrowserRouter>
        <Routes>
          {/* Main test screen */}
          <Route path="/" element={<MultitaskingTest />} />

          {/* Settings page */}
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </BrowserRouter>
    </SettingsProvider>
  );
}

export default App;
