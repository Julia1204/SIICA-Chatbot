import React, {useState, useEffect, useContext, useRef} from "react";
import {Link} from "react-router-dom";
import "./MultitaskingTest.css";
import {SettingsContext} from "../../settings/SettingsContext";
import {COLLECTIONS} from '../../firebase/firebaseCollections';
import {addData} from '../../firebase/firebaseQueries';
import useMouseGrid from "../../hooks/useMouseGrid";
import {makePdfBlob} from "./GenerateReport";
import {saveAs} from "file-saver";
import {useGame} from "../../GameProvider";

const maxSteps = 15;

const MultitaskingTest = () => {
    const {selectedLanguage, selectedColorScheme} = useContext(SettingsContext);
    const {state, dispatch} = useGame();
    // example how to use
    // const x = state.player.name
    //console.log(state.player.name);          // read
    // dispatch({ type: "SET_PLAYER", payload: { name: "Anna" } }); // write

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
    const testAreaRef = useRef(null);
    const [correctSides, setCorrectSides] = useState([]);
    const [selectedSides, setSelectedSides] = useState([]);
    const [finishedDate, setFinishedDate] = useState(null)
    const mouseGrid = useMouseGrid({rows: 1, cols: 3, areaRef: testAreaRef});


    useEffect(() => {
        if (!startTest) return;
        setStep(1);
        setCursorCells([mouseGrid()]);
        if (mode === "multi") setRule(Math.random() < 0.5 ? "side" : "direction");
        setArrowSide(Math.random() < 0.5 ? "left" : "right");
        setArrowDirection(Math.random() < 0.5 ? "left" : "right");
        setTrialStart(Date.now());
    }, [startTest]);

    useEffect(() => {
        if (trialStart === null || step <= 1) return;
        setCursorCells(prev => [
            ...prev,
            mouseGrid()
        ]);
    }, [trialStart]);

    useEffect(() => {
        if (!testFinished) return;
        const totalTime = reactionTimes.reduce((sum, t) => sum + t, 0);
        const avgRT = totalTime / reactionTimes.length;
        setFinishedDate(new Date())
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
            createdAt: finishedDate,
        };
        addData(COLLECTIONS.TEST_RESULTS, result)
            .then(id => console.log("Zapisano:", id))
            .catch(console.error);
    }, [testFinished]);

    const handleClick = side => {
        if (isWaiting) return;
        setIsWaiting(true);

        const rt = Date.now() - trialStart;
        setReactionTimes(prev => [...prev, rt]);
        const correct = rule === "side" ? arrowSide : arrowDirection;
        setCorrectSides(prev => [...prev, correct]);
        setSelectedSides(prev => [...prev, side]);
        setScore(prev => prev + (side === correct ? 1 : 0));
        setHighlight(side === correct ? side : "wrong-" + side);

        const next = step + 1;
        setTimeout(() => {
            setHighlight("");
            if (next > maxSteps) {
                setTestFinished(true);
            } else {
                if (mode === "multi") setRule(Math.random() < 0.5 ? "side" : "direction");
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
    };

    const outer = {
        width: "100vw", minHeight: "100vh", margin: 0, padding: 0,
        backgroundColor: selectedColorScheme.backgroundColor,
        color: selectedColorScheme.textColor,
        display: "flex", justifyContent: "center",
        alignItems: startTest ? "flex-start" : "center",
        position: "relative"
    };
    const container = {
        width: "100vw", minHeight: "100vh",
        position: "relative", textAlign: "center",
        padding: "2rem 1rem", boxSizing: "border-box"
    };
    const baseBtn = {
        backgroundColor: selectedColorScheme.buttonBackground,
        color: selectedColorScheme.buttonTextColor,
        width: "15rem", height: "5rem", borderRadius: "20px",
        fontSize: "1.2rem", fontWeight: "bold", textTransform: "uppercase",
        cursor: isWaiting ? "not-allowed" : "pointer",
        opacity: isWaiting ? 0.6 : 1,
        transition: "all 0.3s ease", border: "none"
    };
    const posLeft = {position: "absolute", bottom: "10%", left: "15%"};
    const posRight = {position: "absolute", bottom: "10%", right: "15%"};
    const btnWidth = '25%';
    const sideGap = '8.3333%';

    const getBtn = side => {
        const s = {
            ...baseBtn,
            position: 'absolute',
            bottom: '2rem',


            width: btnWidth,
            left: side === 'left' ? sideGap
                : '66.6667%',
        };


        if (highlight === side) {
            s.backgroundColor = selectedColorScheme.highlightColor;
            s.color = selectedColorScheme.highlightTextColor;
        } else if (highlight === 'wrong-' + side) {
            s.backgroundColor = selectedColorScheme.wrongColor;
            s.color = selectedColorScheme.wrongTextColor;
        }

        return s;
    };
    const titleS = {color: selectedColorScheme.titleColor, fontSize: "4rem", margin: "2rem 0 1rem"};
    const stepS = {color: selectedColorScheme.titleColor, margin: "1.5rem"};
    const sumCont = {
        ...outer, flexDirection: "column", alignItems: "center",
        justifyContent: "center", textAlign: "center", padding: "2rem"
    };
    const sumStats = {
        fontSize: "1.5rem", lineHeight: "2.5rem",
        backgroundColor: selectedColorScheme.summaryBackgroundColor,
        padding: "2rem 3rem", borderRadius: "20px", marginTop: "1rem", maxWidth: "600px"
    };

    // ======== SUMMARY ========
    if (testFinished) {
        const totalTime = reactionTimes.reduce((sum, t) => sum + t, 0);
        const avgRT = totalTime / reactionTimes.length;

        /* ———  STYLE HELPERS  ——— */
        const card = {
            backgroundColor: selectedColorScheme.summaryBackgroundColor,
            borderRadius: 20,
            padding: "2rem 3rem",
            maxWidth: 600,
            width: "90%",
            boxShadow: "0 4px 8px rgba(0,0,0,.15)"
        };
        const statTable = {
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "1.4rem"
        };
        const th = {textAlign: "left", padding: "0.3rem 0"};
        const td = {textAlign: "right", fontWeight: 700};

        const detailWrap = {
            maxHeight: 260,
            overflowY: "auto",
            marginTop: 16,
            border: `1px solid ${selectedColorScheme.textColor}33`,
            borderRadius: 12
        };
        const detailTable = {
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "1rem"
        };
        const zebra = (i) =>
            ({backgroundColor: i % 2 ? "transparent" : `${selectedColorScheme.textColor}0D`});

        const cellLabel = c =>
            c === 1 ? selectedLanguage.left
                : c === 2 ? selectedLanguage.middle
                    : selectedLanguage.right;

        const sideLabel = s =>
            s === 'left' ? selectedLanguage.left
                : s === 'right' ? selectedLanguage.right
                    : selectedLanguage.middle;

        const tableRows = cursorCells.map((cell, i) => ({
            nr:      i + 1,
            cell:    cellLabel(cell),
            select:  sideLabel(selectedSides[i]),
            correct: sideLabel(correctSides[i]),
            rt:      reactionTimes[i] + ' ms',
        }));

        const headers = {
            nr:      selectedLanguage.numberQuestion,
            cell:    selectedLanguage.cell,
            select:  selectedLanguage.selectedAnswer,
            correct: selectedLanguage.correctAnswer,
            rt:      `${selectedLanguage.reactionTime} (ms)`,
        };

        return (
            <div style={sumCont}>
                <h1 style={{color: selectedColorScheme.titleColor}}>
                    {selectedLanguage.summary}
                </h1>

                {/* ——  STATS CARD —— */}
                <div style={card}>
                    <table style={statTable}>
                        <tbody>
                        <tr>
                            <th style={th}>{selectedLanguage.rightAnswers}:</th>
                            <td style={td}>{score} / {step}</td>
                        </tr>
                        <tr>
                            <th style={th}>{selectedLanguage.totalTime}:</th>
                            <td style={td}>{(totalTime / 1000).toFixed(2)} s</td>
                        </tr>
                        <tr>
                            <th style={th}>{selectedLanguage.averageReactionTime}:</th>
                            <td style={td}>{avgRT.toFixed(0)} ms</td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                {/* ——  DETAILS TABLE —— */}
                <h2 style={{marginTop: "2rem", color: selectedColorScheme.titleColor}}>
                    {selectedLanguage.detailedResults}
                </h2>

                <div style={detailWrap}>
                    <table style={detailTable}>
                        <thead>
                        <tr>
                            <th style={{
                                padding: "0.4rem 0.6rem", textAlign: "left"
                            }}>{selectedLanguage.numberQuestion}</th>
                            <th style={{padding: "0.4rem 0.6rem", textAlign: "left"}}>
                                {selectedLanguage.cell}
                            </th>
                            <th style={{padding: "0.4rem 0.6rem", textAlign: "left"}}>
                                {selectedLanguage.selectedAnswer}
                            </th>
                            <th style={{padding: "0.4rem 0.6rem", textAlign: "left"}}>
                                {selectedLanguage.correctAnswer}
                            </th>
                            <th style={{padding: "0.4rem 0.6rem", textAlign: "left"}}>
                                {selectedLanguage.reactionTime} (ms)
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {cursorCells.map((cell, i) => (
                            <tr key={i} style={zebra(i)}>
                                <td>{i + 1}</td>
                                <td>{cellLabel(cell)}</td>
                                <td>{sideLabel(selectedSides[i])}</td>
                                {/* 1/2/3 → text */}
                                <td>{sideLabel(correctSides[i])}</td>
                                {/* left/right → text */}
                                <td>{reactionTimes[i]}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <button
                    style={{...baseBtn, marginTop: "2rem"}}
                    onClick={async () => {
                        try {
                            const timestamp = finishedDate.getTime();
                            const blob = await makePdfBlob({headers, rows: tableRows, title: `${selectedLanguage.report} ${state.player.name}: ${finishedDate.toLocaleDateString()}`});
                            saveAs(blob, `report_${state.player.name}_${timestamp}.pdf`);
                        } catch (e) {
                            console.error("PDF error", e);
                        }
                    }}
                >
                    ⬇️ {selectedLanguage.downloadPdf}
                </button>
                <button style={{...baseBtn, marginTop: "2.5rem"}} onClick={resetTest}>
                    {selectedLanguage.return}
                </button>
            </div>
        );
    }

    // ======== START ========
    if (!startTest) {
        return (
            <div style={outer}>
                <div style={container} ref={testAreaRef}>>
                    <Link to="/settings" className="settings-icon"
                          style={{position: "absolute", top: "1rem", right: "1rem"}}>⚙</Link>
                    <h1 style={titleS}>{selectedLanguage.pickYourTestType}</h1>
                    <p style={{maxWidth: "600px", margin: "1rem auto", lineHeight: 1.5}}>
                        <strong>{selectedLanguage.multitaskingMode}</strong> {selectedLanguage.multitaskingModeExplanation}<br/>
                        <strong>{selectedLanguage.singleMode}</strong> {selectedLanguage.singleModeExplanation}
                    </p>
                    <div style={{display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center"}}>
                        <button
                            style={baseBtn}
                            onClick={() => {
                                setMode("multi");
                                setStartTest(true);
                            }}
                        >
                            {selectedLanguage.multitaskingMode}
                        </button>
                        <button
                            style={baseBtn}
                            onClick={() => setMode("single")}
                        >
                            {selectedLanguage.singleMode}
                        </button>
                        {mode === "single" && (
                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "1rem",
                                marginTop: "1rem",
                                alignItems: "center"
                            }}>
                                <h2 style={{color: selectedColorScheme.titleColor}}>{selectedLanguage.chooseRule}</h2>
                                <p style={{lineHeight: 1.4}}>{selectedLanguage.singleModeChoice}:</p>
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
    }

    // ======== ACTIVE TEST ========
    return (
        <div style={outer} ref={testAreaRef}>
            <div style={container}>
                <Link to="/settings" className="settings-icon"
                      style={{position: "absolute", top: "1rem", right: "1rem"}}>⚙</Link>
                <h1 style={titleS}>
                    {rule === "side" ? selectedLanguage.selectSide : selectedLanguage.selectDirection}
                </h1>
                <h2 style={stepS}>{selectedLanguage.step}: {step}</h2>
                <div style={{position: "relative", width: "100%", height: "200px", margin: "3rem 0"}}>
                    <img
                        style={{filter: selectedColorScheme.arrowFilter}}
                        className={arrowSide === "left" ? "left-arrow" : "right-arrow"}
                        src={arrowDirection === "left" ? "./assets/left_arrow.svg" : "./assets/right_arrow.svg"}
                        alt="arrow"
                    />
                </div>
                <button style={getBtn('left')} onClick={() => handleClick('left')}>
                    {selectedLanguage.left}
                </button>
                <button style={getBtn('right')} onClick={() => handleClick('right')}>
                    {selectedLanguage.right}
                </button>
            </div>
        </div>
    );
};

export default MultitaskingTest;
