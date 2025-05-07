import React, { useContext, useEffect, useRef, useState } from "react";
import { SettingsContext } from "../../settings/SettingsContext";
import { useGame } from "../../GameProvider";
import useMouseGrid from "../commonHooks/useMouseGrid";
import { COLLECTIONS } from "../../firebase/firebaseCollections";
import { addData } from "../../firebase/firebaseQueries";
import StartScreen from "./ui/components/StartScreen";
import ActiveTest from "./ui/components/ActiveTest";
import SummaryScreen from "./ui/components/SummaryScreen";
import "./MultitaskingTest.css";

const MAX_STEPS = 15;

const MultitaskingTest = () => {
  /* ==== CONTEXTS ==== */
  const { selectedLanguage, selectedColorScheme } = useContext(SettingsContext);
  const { state } = useGame();

  /* ==== STATE ==== */
  const [mode, setMode] = useState("");
  const [rule, setRule] = useState("");
  const [startTest, setStartTest] = useState(false);
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [highlight, setHighlight] = useState("");
  const [arrowSide, setArrowSide] = useState("left");
  const [arrowDirection, setArrowDirection] = useState("left");
  const [cursorCells, setCursorCells] = useState([]);
  const [reactionTimes, setReactionTimes] = useState([]);
  const [trialStart, setTrialStart] = useState(null);
  const [isWaiting, setIsWaiting] = useState(false);
  const [testFinished, setTestFinished] = useState(false);
  const [correctSides, setCorrectSides] = useState([]);
  const [selectedSides, setSelectedSides] = useState([]);
  const finishedDateRef = useRef(null);
  const [finishedDate, setFinishedDate] = useState(null);

  /* ==== REFS & HOOKS ==== */
  const testAreaRef = useRef(null);
  const mouseGrid = useMouseGrid({ rows: 1, cols: 3, areaRef: testAreaRef });

  /* =============================================================
   *                         EFFECTS
   * ===========================================================*/
  // prepare first trial when user clicks start
  useEffect(() => {
    if (!startTest) return;
    setStep(1);
    setCursorCells([mouseGrid()]);
    if (mode === "multi") setRule(Math.random() < 0.5 ? "side" : "direction");
    setArrowSide(Math.random() < 0.5 ? "left" : "right");
    setArrowDirection(Math.random() < 0.5 ? "left" : "right");
    setTrialStart(Date.now());
  }, [startTest]);

  // add cursor cell for every subsequent trial (for path drawing)
  useEffect(() => {
    if (trialStart === null || step <= 1) return;
    setCursorCells((prev) => [...prev, mouseGrid()]);
  }, [trialStart]);

  // when test ends – save data to Firestore
  useEffect(() => {
    if (!testFinished) return;

    const totalTime = reactionTimes.reduce((sum, t) => sum + t, 0);
    const avgRT = totalTime / reactionTimes.length;

    finishedDateRef.current = new Date();
    setFinishedDate(finishedDateRef.current);
    const result = {
      userId: state.player.name,
      mode,
      rule,
      score,
      correctSides,
      selectedSides,
      totalTime,
      averageReactionTime: avgRT,
      reactionTimes,
      cursorCells,
      createdAt: finishedDateRef,
    };

    addData(COLLECTIONS.TEST_RESULTS, result)
      .then((id) => console.log("Saved result with id:", id))
      .catch(console.error);
  }, [testFinished]);

  /* =============================================================
   *                         HANDLERS
   * ===========================================================*/
  const handleClick = (side) => {
    if (isWaiting) return;
    setIsWaiting(true);

    const rt = Date.now() - trialStart;
    setReactionTimes((prev) => [...prev, rt]);

    const correct = rule === "side" ? arrowSide : arrowDirection;
    setCorrectSides((prev) => [...prev, correct]);
    setSelectedSides((prev) => [...prev, side]);

    const isCorrect = side === correct;
    setScore((prev) => prev + (isCorrect ? 1 : 0));
    setHighlight(isCorrect ? side : `wrong-${side}`);

    const next = step + 1;

    setTimeout(() => {
      setHighlight("");

      if (next > MAX_STEPS) {
        setTestFinished(true);
      } else {
        if (mode === "multi")
          setRule(Math.random() < 0.5 ? "side" : "direction");
        setArrowSide(Math.random() < 0.5 ? "left" : "right");
        setArrowDirection(Math.random() < 0.5 ? "left" : "right");
        setTrialStart(Date.now());
        setStep(next);
      }

      setIsWaiting(false);
    }, 1000);
  };

  const resetTest = () => {
    setMode("");
    setRule("");
    setStartTest(false);
    setStep(0);
    setScore(0);
    setHighlight("");
    setArrowSide("left");
    setArrowDirection("left");
    setCursorCells([]);
    setReactionTimes([]);
    setTrialStart(null);
    setIsWaiting(false);
    setTestFinished(false);
    setCorrectSides([]);
    setSelectedSides([]);
    setFinishedDate(null);
    finishedDateRef.current = null;
  };

  /* =============================================================
   *                         RENDER
   * ===========================================================*/
  if (!startTest) {
    return (
      <StartScreen
        mode={mode}
        setMode={setMode}
        setStartTest={setStartTest}
        setRule={setRule}
        selectedLanguage={selectedLanguage}
        selectedColorScheme={selectedColorScheme}
        baseIsWaiting={isWaiting}
        testAreaRef={testAreaRef}
      />
    );
  }

  if (testFinished) {
    return (
      <SummaryScreen
        selectedLanguage={selectedLanguage}
        selectedColorScheme={selectedColorScheme}
        score={score}
        step={step}
        reactionTimes={reactionTimes}
        cursorCells={cursorCells}
        correctSides={correctSides}
        selectedSides={selectedSides}
        finishedDate={finishedDate}
        state={state}
        resetTest={resetTest}
      />
    );
  }

  // Active test running
  return (
    <ActiveTest
      rule={rule}
      selectedLanguage={selectedLanguage}
      step={step}
      arrowSide={arrowSide}
      arrowDirection={arrowDirection}
      selectedColorScheme={selectedColorScheme}
      highlight={highlight}
      handleClick={handleClick}
      isWaiting={isWaiting}
      testAreaRef={testAreaRef}
    />
  );
};

export default MultitaskingTest;
