import React from "react";

export default function TutorialScreen({
  selectedLanguage,
  selectedColorScheme,
  textKey,
  onContinue,
  onSkip,
}) {
  return (
    <div
      style={{
        backgroundColor: selectedColorScheme.backgroundColor,
        color: selectedColorScheme.textColor,
        height: "93vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <h1 style={{ color: selectedColorScheme.titleColor }}>
        {selectedLanguage.tutorialTitle}
      </h1>
      <p style={{ maxWidth: 600, textAlign: "center", margin: "1.5rem 0" }}>
        {selectedLanguage[textKey]}
      </p>
      <div style={{ display: "flex", gap: "1rem" }}>
        <button
          onClick={onContinue}
          style={{
            backgroundColor: selectedColorScheme.buttonBackground,
            color: selectedColorScheme.buttonTextColor,
            padding: "0.8rem 1.2rem",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
          }}
        >
          {selectedLanguage.tutorialContinue}
        </button>
        <button
          onClick={onSkip}
          style={{
            backgroundColor: selectedColorScheme.summaryBackgroundColor,
            color: selectedColorScheme.textColor,
            padding: "0.8rem 1.2rem",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
          }}
        >
          {selectedLanguage.tutorialSkip}
        </button>
      </div>
    </div>
  );
}
