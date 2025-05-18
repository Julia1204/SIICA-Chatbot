const StartScreen = ({
  mode,
  setMode,
  setRule,
  onBegin,
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

  const handleMulti = () => {
    setMode("multi");
    onBegin("multi");
  };

  const handleSinglePick = (chosenRule) => {
    setMode("single");
    setRule(chosenRule);
    onBegin("single");
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
          <button
            style={baseBtn}
            onClick={handleMulti}
            disabled={baseIsWaiting}
          >
            {selectedLanguage.multitaskingMode}
          </button>

          <button
            style={baseBtn}
            onClick={() => setMode("single")}
            disabled={baseIsWaiting}
          >
            {selectedLanguage.singleMode}
          </button>

          {/* show rule choices only after selecting single mode */}
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
                onClick={() => handleSinglePick("side")}
                disabled={baseIsWaiting}
              >
                {selectedLanguage.side}
              </button>

              <button
                style={baseBtn}
                onClick={() => handleSinglePick("direction")}
                disabled={baseIsWaiting}
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
