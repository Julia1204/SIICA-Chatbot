import React, { useState, useRef, useEffect } from "react";
import "../../StopSignalTest.css";

const MIN_DELAY = 500;
const MAX_DELAY = 1500;
const AUTO_MARK_DELAY = 2000;

const ActiveScreen = ({
  selectedLanguage,
  selectedColorScheme,
  trialNumber,
  totalTrials,
  SSD,
  onDone,
  beep,
  stopProbability,
  testAreaRef,
}) => {
  const [arrowDir, setArrowDir] = useState("left");
  const [isStop, setIsStop] = useState(false);
  const [showArrow, setShowArrow] = useState(false);
  const [displayTime, setDisplayTime] = useState(0);
  const [highlight, setHighlight] = useState("");
  const beepTimerRef = useRef(null);
  const autoTimerRef = useRef(null);

  useEffect(() => {
    setShowArrow(false);
    setHighlight("");
    clearTimeout(beepTimerRef.current);
    clearTimeout(autoTimerRef.current);

    const stopFlag = Math.random() < stopProbability;
    setIsStop(stopFlag);
    const baseDelay = Math.random() * (MAX_DELAY - MIN_DELAY) + MIN_DELAY;

    beepTimerRef.current = setTimeout(() => {
      if (stopFlag && beep) {
        beep.currentTime = 0;
        beep.play().catch(console.error);
        autoTimerRef.current = setTimeout(() => {
          onDone({
            clicked: false,
            correct: true,
            rt: null,
            wasStop: true,
            correctSide: null,
          });
        }, AUTO_MARK_DELAY);
      }
      setArrowDir(Math.random() < 0.5 ? "left" : "right");
      setShowArrow(true);
      setDisplayTime(Date.now());
    }, baseDelay);

    return () => {
      clearTimeout(beepTimerRef.current);
      clearTimeout(autoTimerRef.current);
    };
  }, [trialNumber, SSD, beep, stopProbability, onDone]);

  const handleClick = (side) => {
    if (!showArrow || highlight) return;
    const rt = Date.now() - displayTime;
    const correct = !isStop && side === arrowDir;
    setHighlight(correct ? side : `wrong-${side}`);
    clearTimeout(autoTimerRef.current);
    setTimeout(
      () =>
        onDone({
          clicked: side,
          correct,
          rt,
          wasStop: isStop,
          correctSide: isStop ? null : arrowDir,
        }),
      800
    );
  };

  const outer = {
    width: "100vw",
    minHeight: "100vh",
    backgroundColor: selectedColorScheme.backgroundColor,
    color: selectedColorScheme.textColor,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    position: "relative",
  };

  return (
    <div style={outer} ref={testAreaRef}>
      <div className="stop-test-container">
        <div style={{ textAlign: "center", width: "100%", padding: "2rem" }}>
          <h2
            style={{ color: selectedColorScheme.titleColor, margin: "1.5rem" }}
          >
            {selectedLanguage.step}: {trialNumber} / {totalTrials}
          </h2>
          <div
            style={{
              position: "relative",
              width: "100%",
              height: 200,
              margin: "3rem 0",
            }}
          >
            {showArrow && (
              <img
                src={`/assets/${arrowDir}_arrow.svg`}
                alt="arrow"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%,-50%)",
                  filter: selectedColorScheme.arrowFilter,
                }}
              />
            )}
          </div>

          {/* buttons with green/red inline styles */}
          {(() => {
            const base = {
              width: "25%",
              height: "5rem",
              borderRadius: "20px",
              fontSize: "1.2rem",
              fontWeight: "bold",
              textTransform: "uppercase",
              transition: "all 0.3s ease",
              border: "none",
              position: "absolute",
              bottom: "2rem",
              cursor: showArrow && !highlight ? "pointer" : "default",
              opacity: showArrow && !highlight ? 1 : 0.6,
            };

            const leftStyle = {
              ...base,
              left: "8.3%",
              backgroundColor:
                highlight === "left"
                  ? selectedColorScheme.highlightColor
                  : highlight === "wrong-left"
                  ? selectedColorScheme.wrongColor
                  : selectedColorScheme.buttonBackground,
              color:
                highlight === "left"
                  ? selectedColorScheme.highlightTextColor
                  : highlight === "wrong-left"
                  ? selectedColorScheme.wrongTextColor
                  : selectedColorScheme.buttonTextColor,
            };

            const rightStyle = {
              ...base,
              right: "8.3%",
              backgroundColor:
                highlight === "right"
                  ? selectedColorScheme.highlightColor
                  : highlight === "wrong-right"
                  ? selectedColorScheme.wrongColor
                  : selectedColorScheme.buttonBackground,
              color:
                highlight === "right"
                  ? selectedColorScheme.highlightTextColor
                  : highlight === "wrong-right"
                  ? selectedColorScheme.wrongTextColor
                  : selectedColorScheme.buttonTextColor,
            };

            return (
              <>
                <button
                  style={leftStyle}
                  disabled={!showArrow || Boolean(highlight)}
                  onClick={() => handleClick("left")}
                >
                  {selectedLanguage.left}
                </button>
                <button
                  style={rightStyle}
                  disabled={!showArrow || Boolean(highlight)}
                  onClick={() => handleClick("right")}
                >
                  {selectedLanguage.right}
                </button>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default ActiveScreen;
