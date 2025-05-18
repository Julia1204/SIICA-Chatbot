import React, { useState, useCallback } from "react";

export default function PracticeWrapper({
  practiceCount = 5,
  selectedLanguage,
  selectedColorScheme,
  renderTrial,
  onComplete,
}) {
  const [trial, setTrial] = useState(1);

  const handleTrialDone = useCallback(() => {
    if (trial >= practiceCount) {
      onComplete();
    } else {
      setTrial((t) => t + 1);
    }
  }, [trial, practiceCount, onComplete]);

  return (
    <div
      style={{
        backgroundColor: selectedColorScheme.backgroundColor,
        color: selectedColorScheme.textColor,
        height: "25vh",
        position: "relative",
      }}
    >
      <div style={{ textAlign: "center", padding: "1rem" }}>
        <h1 style={{ color: selectedColorScheme.titleColor }}>
          {selectedLanguage.practiceTitle}
        </h1>
        <p>{selectedLanguage.practiceText}</p>
      </div>

      {renderTrial({ trial, onDone: handleTrialDone })}
    </div>
  );
}
