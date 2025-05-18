import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SettingsContext } from "../../settings/SettingsContext";
import { useGame } from "../../GameProvider";
import { addData } from "../../firebase/firebaseQueries";
import { COLLECTIONS } from "../../firebase/firebaseCollections";
import StartScreen from "./ui/components/StartScreen";
import MemorizeScreen from "./ui/components/MemorizeScreen";
import TestScreen from "./ui/components/TestScreen";
import RecallScreen from "./ui/components/RecallScreen";
import SummaryScreen from "./ui/components/SummaryScreen";
import TutorialScreen from "../common/TutorialScreen";
import PracticeWrapper from "../common/PracticeWrapper";
import useMouseGrid from "../commonHooks/useMouseGrid";
import "./LitwTest.css";

const MEMORY_STRING_LENGTH = 6;
const TOTAL_TRIALS = 20;
const PRACTICE_TRIALS = 5;

const SHAPES = [
  { id: "circle", color: "#4CAF50" },
  { id: "square", color: "#9E9D24" },
  { id: "triangle", color: "#2196F3" },
  { id: "diamond", color: "#D32F2F" },
  { id: "pentagon", color: "#9C27B0" },
];

const LETTERS = ["A", "B", "C", "D", "E", "F", "G"];

const LitwTest = () => {
  const { selectedLanguage, selectedColorScheme } = useContext(SettingsContext);
  const { state } = useGame();
  const navigate = useNavigate();
  const testAreaRef = useRef(null);
  const mouseGrid = useMouseGrid({ rows: 1, cols: 3, areaRef: testAreaRef });

  const [phase, setPhase] = useState("tutorial");

  const [trial, setTrial] = useState(0);
  const [currentSymbol, setCurrentSymbol] = useState(null);
  const [shortcuts, setShortcuts] = useState([]);
  const [memoryString, setMemoryString] = useState("");
  const [recallInput, setRecallInput] = useState("");
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [rtArr, setRtArr] = useState([]);
  const [selectedSymbols, setSelectedSymbols] = useState([]);
  const [correctSymbols, setCorrectSymbols] = useState([]);
  const [cursorCells, setCursorCells] = useState([]);

  const startTimeRef = useRef(null);
  const displayStartRef = useRef(null);
  const finishedDateRef = useRef(null);

  useEffect(() => {
    if (phase === "practice" && currentSymbol === null) {
      const sym = getRandomSymbol();
      setCurrentSymbol(sym);
      setCorrectSymbols((prev) => [...prev, sym]);
      displayStartRef.current = Date.now();
    }
  }, [phase, currentSymbol]);

  useEffect(() => {
    if (phase !== "summary") return;

    finishedDateRef.current = new Date();

    const results = {
      userId: state.player.name,
      correctAnswers,
      totalTrials: TOTAL_TRIALS,
      memoryString,
      recall: recallInput,
      memoryScore: calculateMemoryScore(),
      reactionTimes: rtArr,
      avgReactionTime: calculateAvgRT(),
      selectedSymbols,
      correctSymbols,
      cursorCells,
      createdAt: finishedDateRef.current,
    };

    addData(COLLECTIONS.TEST_RESULTS, results)
      .then((id) => console.log("Saved result id", id))
      .catch(console.error);
  }, [phase]);

  const generateMemoryString = () => {
    let str = "";
    for (let i = 0; i < MEMORY_STRING_LENGTH; i++) {
      if (Math.random() > 0.5) {
        str += LETTERS[Math.floor(Math.random() * LETTERS.length)];
      } else {
        str += (Math.floor(Math.random() * 9) + 1).toString();
      }
    }
    return str;
  };

  const getRandomSymbol = () => {
    const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    const letter = LETTERS[Math.floor(Math.random() * LETTERS.length)];
    return { id: shape.id, color: shape.color, letter };
  };

  const calculateMemoryScore = () => {
    const score = [...memoryString].filter(
      (c, i) => c === recallInput[i]
    ).length;
    return Math.round((score / memoryString.length) * 100);
  };

  const calculateAvgRT = () => {
    return rtArr.length ? rtArr.reduce((a, b) => a + b, 0) / rtArr.length : 0;
  };

  const beginMemorization = () => {
    setMemoryString(generateMemoryString());
    setPhase("memorize");
  };

  const startTest = () => {
    setPhase("test");
    setTrial(0);
    setCorrectAnswers(0);
    setRtArr([]);
    setShortcuts([]);
    setCurrentSymbol(null);
    setSelectedSymbols([]);
    setCorrectSymbols([]);
    setCursorCells([mouseGrid()]);
    startTimeRef.current = Date.now();
  };

  const handleNextClick = () => {
    if (trial >= TOTAL_TRIALS) return;
    const sym = getRandomSymbol();
    setCurrentSymbol(sym);
    setCorrectSymbols((prev) => [...prev, sym]);
    displayStartRef.current = Date.now();
  };

  const evaluateSelection = (symbol) => {
    if (!currentSymbol) return;

    const rt = Date.now() - displayStartRef.current;
    setRtArr((prev) => [...prev, rt]);

    const isCorrect =
      symbol.id === currentSymbol.id && symbol.letter === currentSymbol.letter;

    setSelectedSymbols((prev) => [...prev, symbol]);
    if (isCorrect) {
      setCorrectAnswers((c) => c + 1);
      setShortcuts((prev) => {
        const exists = prev.some(
          (s) =>
            s.id === symbol.id &&
            s.letter === symbol.letter &&
            s.color === symbol.color
        );
        return exists ? prev : [...prev, symbol].slice(-6);
      });
    }

    const nextTrial = trial + 1;
    setTrial(nextTrial);
    setCurrentSymbol(null);
    setCursorCells((prev) => [...prev, mouseGrid()]);

    if (phase === "test" && nextTrial >= TOTAL_TRIALS) {
      setTimeout(() => setPhase("recall"), 600);
    }
  };

  const handleShapeLetterSelect = (shape, letter) => {
    const symbol = { id: shape.id, color: shape.color, letter };
    evaluateSelection(symbol);
  };

  const handleShortcutSelect = (symbol) => {
    evaluateSelection(symbol);
  };

  const handleRecallSubmit = () => {
    setPhase("summary");
  };

  const resetTest = () => {
    setPhase("tutorial");
    setTrial(0);
    setCurrentSymbol(null);
    setShortcuts([]);
    setMemoryString("");
    setRecallInput("");
    setCorrectAnswers(0);
    setRtArr([]);
    setSelectedSymbols([]);
    setCorrectSymbols([]);
    setCursorCells([]);
  };

  const handlePracticeTrialDone = () => {
    setPhase("start");
  };

  if (phase === "tutorial") {
    return (
      <TutorialScreen
        selectedLanguage={selectedLanguage}
        selectedColorScheme={selectedColorScheme}
        textKey="tutorialText_litw"
        onContinue={() => setPhase("practice")}
        onSkip={() => setPhase("start")}
      />
    );
  }

  if (phase === "practice")
    return (
      <PracticeWrapper
        key="litw-practice"
        practiceCount={PRACTICE_TRIALS}
        selectedLanguage={selectedLanguage}
        selectedColorScheme={selectedColorScheme}
        onComplete={() => setPhase("start")}
        renderTrial={({ trial: pTrial, onDone }) => (
          <TestScreen
            trial={pTrial}
            isTutorialPhase={false}
            maxTrials={PRACTICE_TRIALS}
            currentSymbol={currentSymbol}
            shortcuts={shortcuts}
            colorScheme={selectedColorScheme}
            shapes={SHAPES}
            onNextClick={() => {}}
            onShapeLetterSelect={(shape, letter) => {
              handleShapeLetterSelect(shape, letter);
              onDone();
            }}
            onShortcutSelect={(symbol) => {
              handleShortcutSelect(symbol);
              onDone();
            }}
            letters={LETTERS}
            testAreaRef={testAreaRef}
            selectedLanguage={selectedLanguage}
          />
        )}
      />
    );

  if (phase === "start") {
    return (
      <StartScreen
        colorScheme={selectedColorScheme}
        onBegin={beginMemorization}
        selectedLanguage={selectedLanguage}
      />
    );
  }

  if (phase === "memorize") {
    return (
      <MemorizeScreen
        colorScheme={selectedColorScheme}
        memoryString={memoryString}
        onContinue={startTest}
        selectedLanguage={selectedLanguage}
      />
    );
  }

  if (phase === "test") {
    return (
      <TestScreen
        trial={trial}
        maxTrials={TOTAL_TRIALS}
        currentSymbol={currentSymbol}
        shortcuts={shortcuts}
        colorScheme={selectedColorScheme}
        shapes={SHAPES}
        onNextClick={handleNextClick}
        onShapeLetterSelect={handleShapeLetterSelect}
        onShortcutSelect={handleShortcutSelect}
        letters={LETTERS}
        testAreaRef={testAreaRef}
        selectedLanguage={selectedLanguage}
      />
    );
  }

  if (phase === "recall") {
    return (
      <RecallScreen
        colorScheme={selectedColorScheme}
        recallInput={recallInput}
        setRecallInput={setRecallInput}
        onSubmit={handleRecallSubmit}
        length={MEMORY_STRING_LENGTH}
        selectedLanguage={selectedLanguage}
      />
    );
  }

  if (phase === "summary") {
    return (
      <SummaryScreen
        colorScheme={selectedColorScheme}
        correctAnswers={correctAnswers}
        totalTrials={TOTAL_TRIALS}
        memoryString={memoryString}
        recall={recallInput}
        rtArr={rtArr}
        selectedLanguage={selectedLanguage}
        state={state}
        navigate={navigate}
        resetTest={resetTest}
        selectedSymbols={selectedSymbols}
        correctSymbols={correctSymbols}
        cursorCells={cursorCells}
      />
    );
  }

  return null;
};

export default LitwTest;
