import React from "react";

const ActiveTest = ({
  rule,
  selectedLanguage,
  step,
  arrowSide,
  arrowDirection,
  selectedColorScheme,
  highlight,
  handleClick,
  isWaiting,
  testAreaRef,
  maxSteps,
  isTestTrial,
}) => {
  const outer = {
    width: "100vw",
    minHeight: isTestTrial ? "50vh" : "100vh",
    backgroundColor: selectedColorScheme.backgroundColor,
    color: selectedColorScheme.textColor,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    position: "relative",
  };

  const container = {
    width: "100vw",
    minHeight: isTestTrial ? "79vh" : "75vh",
    position: "relative",
    textAlign: "center",
    padding: "2rem 1rem",
    boxSizing: "border-box",
  };

  const baseBtn = {
    backgroundColor: selectedColorScheme.buttonBackground,
    color: selectedColorScheme.buttonTextColor,
    width: "25%",
    height: "5rem",
    borderRadius: "20px",
    fontSize: "1.2rem",
    fontWeight: "bold",
    textTransform: "uppercase",
    cursor: isWaiting ? "not-allowed" : "pointer",
    opacity: isWaiting ? 0.6 : 1,
    transition: "all 0.3s ease",
    border: "none",
    position: "absolute",
    bottom: "2rem",
  };

  const getBtn = (side) => {
    const style = {
      ...baseBtn,
      left: side === "left" ? "8.3333%" : "66.6667%",
    };

    if (highlight === side) {
      style.backgroundColor = selectedColorScheme.highlightColor;
      style.color = selectedColorScheme.highlightTextColor;
    } else if (highlight === `wrong-${side}`) {
      style.backgroundColor = selectedColorScheme.wrongColor;
      style.color = selectedColorScheme.wrongTextColor;
    }

    return style;
  };

  const titleS = {
    color: selectedColorScheme.titleColor,
    fontSize: "4rem",
    margin: "2rem 0 1rem",
  };
  const stepS = { color: selectedColorScheme.titleColor, margin: "1.5rem" };

  return (
    <div style={outer} ref={testAreaRef}>
      <div style={container}>
        <h1 style={titleS}>
          {rule === "side"
            ? selectedLanguage.selectSide
            : selectedLanguage.selectDirection}
        </h1>

        <h2 style={stepS}>
          {selectedLanguage.step}: {step} / {maxSteps}
        </h2>

        <div
          style={{
            position: "relative",
            width: "100%",
            height: "200px",
            margin: "3rem 0",
          }}
        >
          <img
            style={{ filter: selectedColorScheme.arrowFilter }}
            className={arrowSide === "left" ? "left-arrow" : "right-arrow"}
            src={
              arrowDirection === "left"
                ? "./assets/left_arrow.svg"
                : "./assets/right_arrow.svg"
            }
            alt="arrow"
          />
        </div>

        <button style={getBtn("left")} onClick={() => handleClick("left")}>
          {selectedLanguage.left}
        </button>
        <button style={getBtn("right")} onClick={() => handleClick("right")}>
          {selectedLanguage.right}
        </button>
      </div>
    </div>
  );
};

export default ActiveTest;
