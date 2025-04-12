import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import "./MultitaskingTest.css";
import { SettingsContext } from "./settings/SettingsContext";

const MultitaskingTest = () => {
  const { selectedLanguage, selectedColorScheme } = useContext(SettingsContext);

  const [mode, setMode] = useState("");
  const [rule, setRule] = useState("");
  const [startTest, setStartTest] = useState(false);
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [highlight, setHighlight] = useState("");
  const [lastClick, setLastClick] = useState("");
  const [arrowSide, setArrowSide] = useState("left");
  const [arrowDirection, setArrowDirection] = useState("left");
  const [startTime, setStartTime] = useState(null);
  const [reactionTimes, setReactionTimes] = useState([]);
  const [trialStart, setTrialStart] = useState(null);
  const maxSteps = 15;
  const [endTest, setEndTest] = useState(false);
  const [testFinished, setTestFinished] = useState(false);
  const [endTime, setEndTime] = useState(null);

  const generateTrial = () => {
    if (mode === "multi") {
      setRule(Math.random() < 0.5 ? "side" : "direction");
    }
    setArrowSide(Math.random() < 0.5 ? "left" : "right");
    setArrowDirection(Math.random() < 0.5 ? "left" : "right");
    setTrialStart(Date.now());
  };

  useEffect(() => {
    if (startTest) {
      generateTrial();
    }
  }, [startTest]);

  const handleClick = (side) => {
    setLastClick(side);

    const reactionTime = Date.now() - trialStart;
    setReactionTimes((prev) => [...prev, reactionTime]);

    const correctAnswer = rule === "side" ? arrowSide : arrowDirection;

    if (side === correctAnswer) {
      setScore((prev) => prev + 1);
      setHighlight(side);
    } else {
      setHighlight("wrong-" + side);
    }

    const nextStep = step + 1;
    setStep(nextStep);

    setTimeout(() => {
      setHighlight("");

      if (nextStep >= maxSteps) {
        setEndTime(Date.now());
        setTestFinished(true);
      } else {
        generateTrial();
      }
    }, 400);
  };

  const resetTest = () => {
    setMode("");
    setRule("");
    setStartTest(false);
    setStep(0);
    setScore(0);
    setHighlight("");
    setLastClick("");
    setArrowSide("left");
    setArrowDirection("left");
    setStartTime(null);
    setReactionTimes([]);
    setTrialStart(null);
    setEndTest(false);
    setTestFinished(false);
    setEndTime(null);
  };

  const outerWrapperStyle = {
    width: "100vw",
    minHeight: "100vh",
    margin: "0",
    padding: "0",
    backgroundColor: selectedColorScheme.backgroundColor,
    color: selectedColorScheme.textColor,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    position: "relative",
  };

  const containerStyle = {
    maxWidth: "1200px",
    width: "100%",
    minHeight: "100vh",
    position: "relative",
    textAlign: "center",
    padding: "2rem 1rem",
    boxSizing: "border-box",
  };

  const baseButtonStyle = {
    backgroundColor: selectedColorScheme.buttonBackground,
    color: selectedColorScheme.buttonTextColor,
    width: "15rem",
    height: "5rem",
    borderRadius: "20px",
    fontSize: "1.2rem",
    fontWeight: "bold",
    textTransform: "uppercase",
    cursor: "pointer",
    transition: "all 0.3s ease",
    border: "none",
  };

  const leftRectanglePos = {
    position: "absolute",
    bottom: "10%",
    left: "15%",
  };
  const rightRectanglePos = {
    position: "absolute",
    bottom: "10%",
    right: "15%",
  };

  const getButtonStyle = (side) => {
    let style = { ...baseButtonStyle };
    if (side === "left") {
      style = { ...style, ...leftRectanglePos };
    } else {
      style = { ...style, ...rightRectanglePos };
    }

    if (highlight === side) {
      style.backgroundColor = selectedColorScheme.highlightColor;
      style.color = selectedColorScheme.highlightTextColor;
    } else if (highlight === "wrong-" + side) {
      style.backgroundColor = selectedColorScheme.wrongColor;
      style.color = selectedColorScheme.wrongTextColor;
    }
    return style;
  };

  const titleStyle = {
    color: selectedColorScheme.titleColor,
    fontSize: "4rem",
    marginBottom: "20px",
    marginTop: "2rem",
  };
  const stepStyle = {
    color: selectedColorScheme.titleColor,
    margin: "1.5rem",
  };

  if (testFinished) {
    const totalTime = endTime - startTime;
    const averageReactionTime = totalTime / step;

    const summaryContainerStyle = {
      ...outerWrapperStyle,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "2rem",
      height: "100vh",
    };

    const summaryStatsStyle = {
      fontSize: "1.5rem",
      lineHeight: "2.5rem",
      backgroundColor: selectedColorScheme.summaryBackgroundColor,
      padding: "2rem 3rem",
      borderRadius: "20px",
      marginTop: "1rem",
      maxWidth: "600px",
    };

    return (
      <div style={summaryContainerStyle}>
        <h1 style={{ color: selectedColorScheme.titleColor }}>
          {selectedLanguage.summary}
        </h1>
        <div style={summaryStatsStyle}>
          <p>
            <strong>{selectedLanguage.rightAnswers}:</strong> {score} / {step}
          </p>
          <p>
            <strong>{selectedLanguage.totalTime}:</strong>{" "}
            {(totalTime / 1000).toFixed(2)} s
          </p>
          <p>
            <strong>{selectedLanguage.averageReactionTime}:</strong>{" "}
            {averageReactionTime.toFixed(0)} ms
          </p>
        </div>
        <div style={{ marginTop: "2rem" }}>
          <button style={baseButtonStyle} onClick={resetTest}>
            {selectedLanguage.return}
          </button>
        </div>
      </div>
    );
  }

  if (!startTest) {
    return (
      <div style={outerWrapperStyle}>
        <div style={containerStyle}>
          <Link
            to="/settings"
            className="settings-icon"
            style={{ position: "absolute", top: "1rem", right: "1rem" }}
          >
            ⚙
          </Link>

          <h1 style={titleStyle}>{selectedLanguage.pickYourTestType}</h1>

          <p
            style={{ maxWidth: "600px", margin: "1rem auto", lineHeight: 1.5 }}
          >
            <strong>{selectedLanguage.multitaskingMode}</strong>{" "}
            {selectedLanguage.multitaskingModeExplanation}.
            <br />
            <strong>{selectedLanguage.singleMode}</strong>{" "}
            {selectedLanguage.singleModeExplanation}.
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
              style={baseButtonStyle}
              onClick={() => {
                setMode("multi");
                setStartTime(Date.now());
                setStartTest(true);
              }}
            >
              {selectedLanguage.multitaskingMode}
            </button>

            <button style={baseButtonStyle} onClick={() => setMode("single")}>
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
                  style={baseButtonStyle}
                  onClick={() => {
                    setRule("side");
                    setStartTime(Date.now());
                    setStartTest(true);
                  }}
                >
                  {selectedLanguage.side}
                </button>
                <button
                  style={baseButtonStyle}
                  onClick={() => {
                    setRule("direction");
                    setStartTime(Date.now());
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
  }

  return (
    <div style={outerWrapperStyle}>
      <div style={containerStyle}>
        <Link
          to="/settings"
          className="settings-icon"
          style={{ position: "absolute", top: "1rem", right: "1rem" }}
        >
          ⚙
        </Link>

        <h1 style={titleStyle}>
          {rule === "side"
            ? selectedLanguage.selectSide
            : selectedLanguage.selectDirection}
        </h1>
        <h2 style={stepStyle}>
          {selectedLanguage.step}: {step}
        </h2>

        <div
          style={{
            position: "relative",
            width: "100%",
            height: "200px",
            marginTop: "3rem",
            marginBottom: "3rem",
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

        <button
          style={getButtonStyle("left")}
          onClick={() => handleClick("left")}
        >
          {selectedLanguage.left}
        </button>

        <button
          style={getButtonStyle("right")}
          onClick={() => handleClick("right")}
        >
          {selectedLanguage.right}
        </button>
      </div>
    </div>
  );
};

export default MultitaskingTest;
