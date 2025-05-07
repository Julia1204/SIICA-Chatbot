import React, { useContext, useState, useRef, useCallback } from "react";
import { SettingsContext } from "../../settings/SettingsContext";
import { useGame } from "../../GameProvider";
import useMouseGrid from "../commonHooks/useMouseGrid";
import StartScreen from "./ui/components/StartScreen";
import ActiveScreen from "./ui/components/ActiveScreen";
import SummaryScreen from "./ui/components/SummaryScreen";

const MAIN_TRIALS = 15;
const SSD_STEP = 50;
const MIN_SSD = 50;
const MAX_SSD = 800;
const STOP_PROBABILITY = 0.25;

const StopSignalTest = () => {
  const { selectedLanguage, selectedColorScheme, selectedSound } =
    useContext(SettingsContext);
  const beepRef = useRef(null);
  const { state } = useGame();

  const [phase, setPhase] = useState("start");
  const [trial, setTrial] = useState(0);
  const [SSD, setSSD] = useState(250);
  const [results, setResults] = useState([]);

  const testAreaRef = useRef(null);
  const mouseGrid = useMouseGrid({ rows: 1, cols: 3, areaRef: testAreaRef });
  const [cursorCells, setCursorCells] = useState([]);

  const handleBegin = () => {
    const audio = new Audio(encodeURI(selectedSound.url));
    audio.volume = 1;
    beepRef.current = audio;
    setPhase("main");
    setTrial(1);
    setResults([]);
    setSSD(250);
    setCursorCells([2]);
  };

  const handleDone = useCallback(
    ({ clicked, correct, rt, wasStop, correctSide }) => {
      setCursorCells((prev) => [
        ...prev,
        [1, 2, 3].includes(mouseGrid()) ? mouseGrid() : 2,
      ]);
      setResults((prev) => [
        ...prev,
        { clicked, correct, rt, wasStop, correctSide },
      ]);

      if (wasStop) {
        setSSD((s) =>
          clicked
            ? Math.max(MIN_SSD, s - SSD_STEP)
            : Math.min(MAX_SSD, s + SSD_STEP)
        );
      }

      setTrial((t) => {
        const next = t < MAIN_TRIALS ? t + 1 : t;
        if (next >= MAIN_TRIALS) setPhase("summary");
        return next;
      });
    },
    [mouseGrid]
  );

  if (phase === "start") {
    return (
      <StartScreen
        selectedLanguage={selectedLanguage}
        selectedColorScheme={selectedColorScheme}
        onBegin={handleBegin}
      />
    );
  }

  if (phase === "summary") {
    const correctCount = results.filter((r) => r.correct).length;
    const goRTs = results
      .filter((r) => !r.wasStop && r.correct)
      .map((r) => r.rt || 0);
    const totalTime = goRTs.reduce((a, b) => a + b, 0);
    const avgRT = goRTs.length ? totalTime / goRTs.length : 0;

    const cellLabel = (c) =>
      c === 1
        ? selectedLanguage.left
        : c === 2
        ? selectedLanguage.middle
        : c === 3
        ? selectedLanguage.right
        : selectedLanguage.middle;
    const sideLabel = (s) =>
      s === "left"
        ? selectedLanguage.left
        : s === "right"
        ? selectedLanguage.right
        : "";

    const rows = results.map((r, i) => {
      const raw = cursorCells[i];
      const cellNum = [1, 2, 3].includes(raw) ? raw : 2;
      return {
        nr: i + 1,
        cell: cellLabel(cellNum),
        select: r.clicked ? sideLabel(r.clicked) : "",
        correct: r.wasStop ? "" : sideLabel(r.correctSide),
        rt: !r.rt || r.wasStop ? "" : `${r.rt}`,
      };
    });

    return (
      <SummaryScreen
        selectedLanguage={selectedLanguage}
        selectedColorScheme={selectedColorScheme}
        score={correctCount}
        total={MAIN_TRIALS}
        totalTime={totalTime}
        avgRT={avgRT}
        rows={rows}
        state={state}
      />
    );
  }

  return (
    <ActiveScreen
      selectedLanguage={selectedLanguage}
      selectedColorScheme={selectedColorScheme}
      trialNumber={trial}
      totalTrials={MAIN_TRIALS}
      SSD={SSD}
      onDone={handleDone}
      beep={beepRef.current}
      stopProbability={STOP_PROBABILITY}
      testAreaRef={testAreaRef}
    />
  );
};

export default StopSignalTest;
