import React from "react";
import "./App.css";
import {HashRouter, Routes, Route} from "react-router-dom";
import {SettingsProvider} from "./settings/SettingsContext";
import {GameProvider} from "./GameProvider";
import SettingsPage from "./settings/SettingsPage";
import MultitaskingTest from "./games/multitasking/MultitaskingTest";
import GameSelectionPage from "./GameSelectionPage";

function App() {
    return (
        <SettingsProvider>
            <GameProvider>
                <HashRouter>
                    <Routes>
                        <Route path="/" element={<GameSelectionPage />} />
                        {/* Main test screen */}
                        <Route path="/multitasking-game" element={<MultitaskingTest/>}/>

                        {/* Settings page */}
                        <Route path="/settings" element={<SettingsPage/>}/>
                    </Routes>
                </HashRouter>
            </GameProvider>
        </SettingsProvider>
    );
}


export default App;
