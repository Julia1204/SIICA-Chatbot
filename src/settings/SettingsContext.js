import React, { createContext, useState } from "react";
import languages from "./languages.json";
import colorSchemes from "./colorSchemes.json";

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [languageKey, setLanguageKey] = useState("pl");
  const [colorSchemeKey, setColorSchemeKey] = useState("dark");

  const selectedLanguage = languages[languageKey];
  const selectedColorScheme = colorSchemes[colorSchemeKey];

  const switchLanguage = (newLang) => {
    setLanguageKey(newLang);
  };

  const switchColorScheme = (newScheme) => {
    setColorSchemeKey(newScheme);
  };

  return (
    <SettingsContext.Provider
      value={{
        languageKey,
        colorSchemeKey,
        selectedLanguage,
        selectedColorScheme,
        switchLanguage,
        switchColorScheme,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
