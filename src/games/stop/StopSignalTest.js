import { useContext, useState, useRef, useCallback, useEffect } from "react";
import { SettingsContext } from "../../settings/SettingsContext";
import { useGame } from "../../GameProvider";
import useMouseGrid from "../commonHooks/useMouseGrid";
import StartScreen from "./ui/components/StartScreen";
import ActiveScreen from "./ui/components/ActiveScreen";
import SummaryScreen from "./ui/components/SummaryScreen";
import TutorialScreen from "../common/TutorialScreen";
import PracticeWrapper from "../common/PracticeWrapper";
import SoundTestScreen from "./ui/components/SoundTestScreen";
import {COLLECTIONS} from "../../firebase/firebaseCollections";
import { addData, fetchWhere } from "../../firebase/firebaseQueries";


const MAIN_TRIALS = 15;
const TEST_TRIALS = 5;
const SSD_STEP = 50;
const MIN_SSD = 50;
const MAX_SSD = 800;
const STOP_PROBABILITY = 0.25;

const StopSignalTest = () => {
  const { selectedLanguage, selectedColorScheme, selectedSound } =
    useContext(SettingsContext);
  const beepRef = useRef(null);
  const { state } = useGame();

  const [phase, setPhase] = useState("soundTest");
  const [trial, setTrial] = useState(0);
  const [SSD, setSSD] = useState(250);
  const [results, setResults] = useState([]);

  const testAreaRef = useRef(null);
  const mouseGrid = useMouseGrid({ rows: 1, cols: 3, areaRef: testAreaRef });
  const [cursorCells, setCursorCells] = useState([]);

  useEffect(() => {
    const audio = new Audio(selectedSound.url);
    audio.volume = 1;
    audio.preload = "auto";
    audio.load();
    beepRef.current = audio;
  }, [selectedSound.url]);

  useEffect(() => {
    const saveResults = async () => {
      if (phase !== "summary") return;

      const users = await fetchWhere(
          COLLECTIONS.USERS,
          "name",
          "==",
          state.player.name
      );
      if (!users || users.length === 0) {
        console.error("Nie znaleziono użytkownika:", state.player.name);
        return;
      }

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
        const isStopTrial = r.wasStop;
        return {
          nr: i + 1,
          startCell: cellLabel(cellNum),
          chosen: r.clicked
              ? sideLabel(r.clicked)
              : isStopTrial
                  ? selectedLanguage.wait
                  : "",
          correct: isStopTrial ? selectedLanguage.wait : sideLabel(r.correctSide),
          rt: isStopTrial ? null : r.rt || null, // null = brak
        };
      });

      const payload = {
        userId: users[0].id,
        correctAnswers: correctCount,
        totalTrials: MAIN_TRIALS,
        totalTime,
        averageReactionTime: avgRT,
        SSD_START: 250,
        SSD_STEP,
        SSD_MIN: MIN_SSD,
        SSD_MAX: MAX_SSD,
        stopProbability: STOP_PROBABILITY,
        trials: rows, 
        createdAt: new Date(),
      };

      try {
        const id = await addData(COLLECTIONS.TEST_STOP_RESULTS, payload);
        console.log("Stop-Signal zapisany, id:", id);
      } catch (err) {
        console.error("Błąd zapisu Stop-Signal:", err);
      }
    };

    saveResults();
  }, [phase]);


  const handleBegin = () => {
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
        const next = t + 1;
        if (next > MAIN_TRIALS) {
          setPhase("summary");
          return t;
        }
        return next;
      });
    },
    [mouseGrid]
  );

  if (phase === "soundTest") {
    return (
      <SoundTestScreen
        selectedLanguage={selectedLanguage}
        selectedColorScheme={selectedColorScheme}
        selectedSound={selectedSound}
        onContinue={() => setPhase("tutorial")}
      />
    );
  }

  if (phase === "tutorial") {
    return (
      <TutorialScreen
        selectedLanguage={selectedLanguage}
        selectedColorScheme={selectedColorScheme}
        textKey="tutorialText_stop"
        onContinue={() => setPhase("practice")}
        onSkip={() => setPhase("start")}
      />
    );
  }

  if (phase === "practice") {
    return (
      <PracticeWrapper
        practiceCount={TEST_TRIALS}
        selectedLanguage={selectedLanguage}
        selectedColorScheme={selectedColorScheme}
        onComplete={() => setPhase("start")}
        renderTrial={({ trial: pTrial, onDone }) => (
          <ActiveScreen
            selectedLanguage={selectedLanguage}
            selectedColorScheme={selectedColorScheme}
            trialNumber={pTrial}
            totalTrials={TEST_TRIALS}
            isTestTrial={true}
            SSD={SSD}
            onDone={onDone}
            beep={playBeep}
            stopProbability={STOP_PROBABILITY}
            testAreaRef={testAreaRef}
          />
        )}
      />
    );
  }

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
      const isStopTrial = r.wasStop;
      return {
        nr: i + 1,
        cell: cellLabel(cellNum),
        select: r.clicked
          ? sideLabel(r.clicked)
          : isStopTrial
          ? selectedLanguage.wait
          : "",
        correct: isStopTrial ? selectedLanguage.wait : sideLabel(r.correctSide),
        rt: isStopTrial ? "—" : r.rt ? `${r.rt}` : "—",
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
      beep={playBeep}
      stopProbability={STOP_PROBABILITY}
      testAreaRef={testAreaRef}
    />
  );
};

export default StopSignalTest;
