import React from "react";

const StartScreen = ({
  mode,
  setMode,
  setStartTest,
  setRule,
  selectedLanguage,
  selectedColorScheme,
  baseIsWaiting,
  testAreaRef,
}) => {
  const outer = {
    width: "100vw",
    minHeight: "100vh",
    backgroundColor: selectedColorScheme.backgroundColor,
    color: selectedColorScheme.textColor,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  };

  const container = {
    width: "100vw",
    minHeight: "100vh",
    position: "relative",
    textAlign: "center",
    padding: "2rem 1rem",
    boxSizing: "border-box",
  };

  const baseBtn = {
    backgroundColor: selectedColorScheme.buttonBackground,
    color: selectedColorScheme.buttonTextColor,
    width: "15rem",
    height: "5rem",
    borderRadius: "20px",
    fontSize: "1.2rem",
    fontWeight: "bold",
    textTransform: "uppercase",
    cursor: baseIsWaiting ? "not-allowed" : "pointer",
    opacity: baseIsWaiting ? 0.6 : 1,
    transition: "all 0.3s ease",
    border: "none",
  };

  return (
    <div style={outer}>
      <div style={container} ref={testAreaRef}>
        <h1
          style={{
            color: selectedColorScheme.titleColor,
            fontSize: "4rem",
            margin: "2rem 0 1rem",
          }}
        >
          {selectedLanguage.pickYourTestType}
        </h1>

        <p style={{ maxWidth: "600px", margin: "1rem auto", lineHeight: 1.5 }}>
          <strong>{selectedLanguage.multitaskingMode}</strong>{" "}
          {selectedLanguage.multitaskingModeExplanation}
          <br />
          <strong>{selectedLanguage.singleMode}</strong>{" "}
          {selectedLanguage.singleModeExplanation}
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          {/* MULTI MODE */}
          <button
            style={baseBtn}
            onClick={() => {
              setMode("multi");
              setStartTest(true);
            }}
          >
            {selectedLanguage.multitaskingMode}
          </button>

          {/* SINGLE MODE SELECTION */}
          <button style={baseBtn} onClick={() => setMode("single")}>
            {selectedLanguage.singleMode}
          </button>

          {mode === "single" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                marginTop: "1rem",
                alignItems: "center",
              }}
            >
              <h2 style={{ color: selectedColorScheme.titleColor }}>
                {selectedLanguage.chooseRule}
              </h2>
              <p style={{ lineHeight: 1.4 }}>
                {selectedLanguage.singleModeChoice}:
              </p>

              <button
                style={baseBtn}
                onClick={() => {
                  setRule("side");
                  setStartTest(true);
                }}
              >
                {selectedLanguage.side}
              </button>

              <button
                style={baseBtn}
                onClick={() => {
                  setRule("direction");
                  setStartTest(true);
                }}
              >
                {selectedLanguage.direction}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StartScreen;
