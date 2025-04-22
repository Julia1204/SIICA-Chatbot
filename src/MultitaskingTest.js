import React, {useState, useEffect, useContext, useRef} from "react";
import {Link} from "react-router-dom";
import "./MultitaskingTest.css";
import {SettingsContext} from "./settings/SettingsContext";
import {COLLECTIONS} from './firebase/firebaseCollections';
import {addData} from './firebase/firebaseQueries';

const MultitaskingTest = () => {
    const {selectedLanguage, selectedColorScheme} = useContext(SettingsContext);

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

    const mousePosRef = useRef({x: 0, y: 0});
    useEffect(() => {
        const handleMouseMove = e => {
            mousePosRef.current = {x: e.clientX, y: e.clientY};
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const mapToCell = ({x, y}) => {
        const cols = 5, rows = 5;
        const area = testAreaRef.current.getBoundingClientRect();
        const xRel = x - area.left;
        const yRel = y - area.top;
        const cellW = area.width / cols;
        const cellH = area.height / rows;
        const col = Math.min(cols - 1, Math.max(0, Math.floor(xRel / cellW)));
        const row = Math.min(rows - 1, Math.max(0, Math.floor(yRel / cellH)));
        return row * cols + col + 1;
    };

    const maxSteps = 15;

    useEffect(() => {
        if (!startTest) return;
        setStep(1);
        setCursorCells([mapToCell(mousePosRef.current)]);
        if (mode === "multi") setRule(Math.random() < 0.5 ? "side" : "direction");
        setArrowSide(Math.random() < 0.5 ? "left" : "right");
        setArrowDirection(Math.random() < 0.5 ? "left" : "right");
        setTrialStart(Date.now());
    }, [startTest]);

    useEffect(() => {
        if (trialStart === null || step <= 1) return;
        setCursorCells(prev => [
            ...prev,
            mapToCell(mousePosRef.current)
        ]);
    }, [trialStart]);

    useEffect(() => {
        if (!testFinished) return;
        const totalTime = reactionTimes.reduce((sum, t) => sum + t, 0);
        const avgRT = totalTime / reactionTimes.length;
        const result = {
            userId: "USER_ID",
            mode, rule, score,
            totalTime,
            averageReactionTime: avgRT,
            reactionTimes,
            cursorCells,
            createdAt: new Date()
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
        }, 2000);
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
        maxWidth: "1200px", width: "100%", minHeight: "100vh",
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
    const getBtn = side => {
        let s = {...baseBtn, ...(side === "left" ? posLeft : posRight)};
        if (highlight === side) {
            s.backgroundColor = selectedColorScheme.highlightColor;
            s.color = selectedColorScheme.highlightTextColor;
        } else if (highlight === "wrong-" + side) {
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
        return (
            <div style={sumCont}>
                <h1 style={{color: selectedColorScheme.titleColor}}>
                    {selectedLanguage.summary}
                </h1>
                <div style={sumStats}>
                    <p><strong>{selectedLanguage.rightAnswers}:</strong> {score} / {step}</p>
                    <p><strong>{selectedLanguage.totalTime}:</strong> {(totalTime / 1000).toFixed(2)} s</p>
                    <p><strong>{selectedLanguage.averageReactionTime}:</strong> {avgRT.toFixed(0)} ms</p>
                </div>
                <div style={{textAlign: "left", marginTop: "2rem", maxWidth: "600px"}}>
                    <h2>{selectedLanguage.detailedResults}</h2>
                    <ul>
                        {cursorCells.map((cell, i) => (
                            <li key={i}>
                                {selectedLanguage.question} {i + 1}: {selectedLanguage.cell} {cell}, {selectedLanguage.reactionTime}: {reactionTimes[i]} ms
                            </li>
                        ))}
                    </ul>
                </div>
                <button style={baseBtn} onClick={resetTest}>
                    {selectedLanguage.return}
                </button>
            </div>
        );
    }

    // ======== START ========
    if (!startTest) {
        return (
            <div style={outer}>
                <div style={container}>
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

export default MultitaskingTest;
