import React, {
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";
import { SettingsContext } from "../../settings/SettingsContext";
import { useGame } from "../../GameProvider";
import useMouseGrid from "../commonHooks/useMouseGrid";
import StartScreen from "./ui/components/StartScreen";
import ActiveTest from "./ui/components/ActiveTest";
import SummaryScreen from "./ui/components/SummaryScreen";
import TutorialScreen from "../common/TutorialScreen";
import PracticeWrapper from "../common/PracticeWrapper";
import { COLLECTIONS } from "../../firebase/firebaseCollections";
import { addData } from "../../firebase/firebaseQueries";
import "./MultitaskingTest.css";

const MAIN_TRIALS = 15;
const PRACTICE_TRIALS = 5;

const MultitaskingTest = () => {
  const { selectedLanguage, selectedColorScheme } = useContext(SettingsContext);
  const { state } = useGame();
  const testAreaRef = useRef(null);
  const mouseGrid = useMouseGrid({ rows: 1, cols: 3, areaRef: testAreaRef });

  const [phase, setPhase] = useState("tutorial");
  const [mode, setMode] = useState("multi");
  const [rule, setRule] = useState("");
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [highlight, setHighlight] = useState("");
  const [arrowSide, setArrowSide] = useState("left");
  const [arrowDirection, setArrowDirection] = useState("left");
  const [cursorCells, setCursorCells] = useState([]);
  const [reactionTimes, setReactionTimes] = useState([]);
  const [trialStart, setTrialStart] = useState(null);
  const [isWaiting, setIsWaiting] = useState(false);
  const [correctSides, setCorrectSides] = useState([]);
  const [selectedSides, setSelectedSides] = useState([]);
  const finishedDateRef = useRef(null);
  const [finishedDate, setFinishedDate] = useState(null);

  useEffect(() => {
    if (phase !== "summary") return;
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
      .then((id) => console.log("Saved result id", id))
      .catch(console.error);
  }, [phase]);

  const initializeTrial = useCallback(
    (startPhase) => {
      setPhase(startPhase);
      setScore(0);
      setReactionTimes([]);
      setCursorCells([]);
      setCorrectSides([]);
      setSelectedSides([]);
      setIsWaiting(false);
      setHighlight("");
      setStep(1);
      if (startPhase !== "start" && mode === "multi") {
        setRule(Math.random() < 0.5 ? "side" : "direction");
      }
      const nextArrowSide = Math.random() < 0.5 ? "left" : "right";
      const nextArrowDirection = Math.random() < 0.5 ? "left" : "right";
      setArrowSide(nextArrowSide);
      setArrowDirection(nextArrowDirection);
      setTrialStart(Date.now());
    },
    [mode, mouseGrid]
  );

  const handleClick = useCallback(
    (side) => {
      if (isWaiting || (phase !== "main" && phase !== "practice")) return;
      setIsWaiting(true);
      const rt = Date.now() - trialStart;
      setReactionTimes((prev) => [...prev, rt]);
      const correct = rule === "side" ? arrowSide : arrowDirection;
      setCorrectSides((prev) => [...prev, correct]);
      setSelectedSides((prev) => [...prev, side]);
      const isCorrect = side === correct;
      setScore((prev) => prev + (isCorrect ? 1 : 0));
      setHighlight(isCorrect ? side : `wrong-${side}`);

      setTimeout(() => {
        setHighlight("");
        setIsWaiting(false);
        if (mode === "multi")
          setRule(Math.random() < 0.5 ? "side" : "direction");
        const nextAS = Math.random() < 0.5 ? "left" : "right";
        const nextAD = Math.random() < 0.5 ? "left" : "right";
        setArrowSide(nextAS);
        setArrowDirection(nextAD);
        setCursorCells((prev) => [...prev, mouseGrid()]);
        if (phase === "main") {
          if (step >= MAIN_TRIALS) {
            setPhase("summary");
            return;
          }
          setStep((prev) => prev + 1);
          setTrialStart(Date.now());
        }
      }, 1000);
    },
    [
      isWaiting,
      phase,
      step,
      rule,
      arrowSide,
      arrowDirection,
      trialStart,
      mode,
      mouseGrid,
    ]
  );

  const resetTest = () => initializeTrial("tutorial");

  if (phase === "tutorial") {
    return (
      <TutorialScreen
        selectedLanguage={selectedLanguage}
        selectedColorScheme={selectedColorScheme}
        textKey="tutorialText_multi"
        onContinue={() => initializeTrial("practice")}
        onSkip={() => initializeTrial("start")}
      />
    );
  }

  if (phase === "practice") {
    return (
      <PracticeWrapper
        practiceCount={PRACTICE_TRIALS}
        selectedLanguage={selectedLanguage}
        selectedColorScheme={selectedColorScheme}
        onComplete={() => initializeTrial("start")}
        renderTrial={({ trial: pStep, onDone }) => (
          <ActiveTest
            rule={rule}
            maxSteps={PRACTICE_TRIALS}
            isTestTrial={true}
            selectedLanguage={selectedLanguage}
            step={pStep}
            arrowSide={arrowSide}
            arrowDirection={arrowDirection}
            selectedColorScheme={selectedColorScheme}
            highlight={highlight}
            handleClick={(side) => {
              handleClick(side);
              onDone();
            }}
            isWaiting={isWaiting}
            testAreaRef={testAreaRef}
          />
        )}
      />
    );
  }

  if (phase === "start") {
    return (
      <StartScreen
        mode={mode}
        setMode={setMode}
        setPhase={setPhase}
        setRule={setRule}
        baseIsWaiting={isWaiting}
        selectedLanguage={selectedLanguage}
        selectedColorScheme={selectedColorScheme}
        onBegin={() => initializeTrial("main")}
        testAreaRef={testAreaRef}
      />
    );
  }

  if (phase === "main") {
    return (
      <ActiveTest
        rule={rule}
        maxSteps={MAIN_TRIALS}
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
  }

  return (
    <SummaryScreen
      selectedLanguage={selectedLanguage}
      selectedColorScheme={selectedColorScheme}
      score={score}
      step={MAIN_TRIALS}
      reactionTimes={reactionTimes}
      cursorCells={cursorCells}
      correctSides={correctSides}
      selectedSides={selectedSides}
      finishedDate={finishedDate}
      state={state}
      resetTest={resetTest}
    />
  );
};

export default MultitaskingTest;
