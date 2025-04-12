import React, { useContext } from "react";
import { SettingsContext } from "./SettingsContext";
import languages from "./languages.json";
import colorSchemes from "./colorSchemes.json";

const SettingsMenu = () => {
  const { languageKey, colorSchemeKey, switchLanguage, switchColorScheme } =
    useContext(SettingsContext);

  return (
    <div style={{ margin: "1rem" }}>
      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="language-select" style={{ marginRight: "0.5rem" }}>
          Language:
        </label>
        <select
          id="language-select"
          value={languageKey}
          onChange={(e) => switchLanguage(e.target.value)}
        >
          {Object.entries(languages).map(([langCode, langData]) => (
            <option key={langCode} value={langCode}>
              {langData.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="theme-select" style={{ marginRight: "0.5rem" }}>
          Theme:
        </label>
        <select
          id="theme-select"
          value={colorSchemeKey}
          onChange={(e) => switchColorScheme(e.target.value)}
        >
          {Object.entries(colorSchemes).map(([langCode, langData]) => (
            <option key={langCode} value={langCode}>
              {langData.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SettingsMenu;
