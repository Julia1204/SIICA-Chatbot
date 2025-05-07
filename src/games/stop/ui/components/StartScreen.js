import React from "react";
import "../../StopSignalTest.css";

const StartScreen = ({ selectedLanguage, selectedColorScheme, onBegin }) => (
  <div
    className="stop-test-container"
    style={{
      backgroundColor: selectedColorScheme.backgroundColor,
      color: selectedColorScheme.textColor,
    }}
  >
    <div className="stop-test-centered-text">
      <h1 style={{ color: selectedColorScheme.titleColor }}>
        {selectedLanguage.stopTest}
      </h1>
      <p>{selectedLanguage.stopInstructions}</p>
      <button
        className="stop-button"
        style={{
          backgroundColor: selectedColorScheme.buttonBackground,
          color: selectedColorScheme.buttonTextColor,
        }}
        onClick={onBegin}
      >
        {selectedLanguage.startTest}
      </button>
    </div>
  </div>
);

export default StartScreen;
