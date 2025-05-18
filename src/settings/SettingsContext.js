import React, { createContext, useState } from "react";
import languages from "./languages.json";
import colorSchemes from "./colorSchemes.json";
import soundOptions from "./soundOptions.json";

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [languageKey, setLanguageKey] = useState("pl");
  const [colorSchemeKey, setColorSchemeKey] = useState("dark");
  const [soundKey, setSoundKey] = useState("default");
  const [showDetailedSummary, setShowDetailedSummary] = useState(true);

  const selectedLanguage = languages[languageKey];
  const selectedColorScheme = colorSchemes[colorSchemeKey];
  const selectedSound = soundOptions[soundKey];

  return (
    <SettingsContext.Provider
      value={{
        languageKey,
        colorSchemeKey,
        soundKey,
        selectedLanguage,
        selectedColorScheme,
        selectedSound,
        showDetailedSummary,
        switchLanguage: setLanguageKey,
        switchColorScheme: setColorSchemeKey,
        switchSound: setSoundKey,
        switchSummary: setShowDetailedSummary,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
