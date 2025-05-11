import React from "react";
import { saveAs } from "file-saver";
import { makePdfBlob } from "../../../common/GenerateReport";
import { useNavigate } from "react-router-dom";

const SummaryScreen = ({
  selectedLanguage,
  selectedColorScheme,
  score,
  step,
  reactionTimes,
  cursorCells,
  correctSides,
  selectedSides,
  finishedDate,
  state,
  resetTest,
}) => {
  const navigate = useNavigate();
  const totalTime = reactionTimes.reduce((sum, t) => sum + t, 0);
  const avgRT = totalTime / reactionTimes.length;

  const cellLabel = (c) =>
    c === 1
      ? selectedLanguage.left
      : c === 2
      ? selectedLanguage.middle
      : selectedLanguage.right;

  const sideLabel = (s) =>
    s === "left"
      ? selectedLanguage.left
      : s === "right"
      ? selectedLanguage.right
      : selectedLanguage.middle;

  const tableRows = cursorCells.map((cell, i) => ({
    nr: i + 1,
    cell: cellLabel(cell),
    select: sideLabel(selectedSides[i]),
    correct: sideLabel(correctSides[i]),
    rt: `${reactionTimes[i]} ms`,
  }));

  const headers = {
    nr: selectedLanguage.numberQuestion,
    cell: selectedLanguage.cell,
    select: selectedLanguage.selectedAnswer,
    correct: selectedLanguage.correctAnswer,
    rt: `${selectedLanguage.reactionTime} (ms)`,
  };

  const outer = {
    width: "100vw",
    minHeight: "100vh",
    backgroundColor: selectedColorScheme.backgroundColor,
    color: selectedColorScheme.textColor,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "2rem",
  };

  const card = {
    backgroundColor: selectedColorScheme.summaryBackgroundColor,
    borderRadius: 20,
    padding: "2rem 3rem",
    maxWidth: 600,
    width: "90%",
    boxShadow: "0 4px 8px rgba(0,0,0,.15)",
  };

  const statTable = {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "1.4rem",
  };

  const th = { textAlign: "left", padding: "0.3rem 0" };
  const td = { textAlign: "right", fontWeight: 700 };

  const detailWrap = {
    maxHeight: 260,
    overflowY: "auto",
    marginTop: 16,
    border: `1px solid ${selectedColorScheme.textColor}33`,
    borderRadius: 12,
  };

  const detailTable = {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "1rem",
  };

  const zebra = (i) => ({
    backgroundColor:
      i % 2 ? "transparent" : `${selectedColorScheme.textColor}0D`,
  });

  return (
    <div style={outer}>
      <h1 style={{ color: selectedColorScheme.titleColor }}>
        {selectedLanguage.summary}
      </h1>

      <div style={card}>
        <table style={statTable}>
          <tbody>
            <tr>
              <th style={th}>{selectedLanguage.rightAnswers}:</th>
              <td style={td}>
                {score} / {step}
              </td>
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

      <h2 style={{ marginTop: "2rem", color: selectedColorScheme.titleColor }}>
        {selectedLanguage.detailedResults}
      </h2>

      <div style={detailWrap}>
        <table style={detailTable}>
          <thead>
            <tr>
              <th style={{ padding: "0.4rem 0.6rem", textAlign: "left" }}>
                {selectedLanguage.numberQuestion}
              </th>
              <th style={{ padding: "0.4rem 0.6rem", textAlign: "left" }}>
                {selectedLanguage.cell}
              </th>
              <th style={{ padding: "0.4rem 0.6rem", textAlign: "left" }}>
                {selectedLanguage.selectedAnswer}
              </th>
              <th style={{ padding: "0.4rem 0.6rem", textAlign: "left" }}>
                {selectedLanguage.correctAnswer}
              </th>
              <th style={{ padding: "0.4rem 0.6rem", textAlign: "left" }}>
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
                <td>{sideLabel(correctSides[i])}</td>
                <td>{reactionTimes[i]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        style={{
          backgroundColor: selectedColorScheme.buttonBackground,
          color: selectedColorScheme.buttonTextColor,
          width: "15rem",
          height: "5rem",
          borderRadius: "20px",
          fontSize: "1.2rem",
          fontWeight: "bold",
          textTransform: "uppercase",
          border: "none",
          marginTop: "2rem",
          cursor: "pointer",
        }}
        onClick={async () => {
          try {
            const timestamp = finishedDate.getTime();
            const summary = {
              rightAnswers: `${score} / ${step}`,
              totalTime: `${(totalTime / 1000).toFixed(2)}s`,
              avgRT: `${avgRT.toFixed(0)}ms`,
            };
            const blob = await makePdfBlob({
              headers,
              rows: tableRows,
              title: `${selectedLanguage.report} ${
                state.player.name
              }: ${finishedDate.toLocaleDateString()}`,
              survey: state.survey,
              selectedLanguage: selectedLanguage,
              summary: summary,
            });
            saveAs(
              blob,
              `report_${state.player.name}_multitasking_${timestamp}.pdf`
            );
          } catch (e) {
            console.error("PDF error", e);
          }
        }}
      >
        ⬇️ {selectedLanguage.downloadPdf}
      </button>

      <div
        style={{
          marginTop: "2rem",
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          justifyContent: "center",
        }}
      >
        <button
          style={{
            backgroundColor: selectedColorScheme.buttonBackground,
            color: selectedColorScheme.buttonTextColor,
            width: "15rem",
            height: "4rem",
            borderRadius: "20px",
            fontSize: "1rem",
            fontWeight: "bold",
            border: "none",
            cursor: "pointer",
          }}
          onClick={() => navigate("/?step=1")}
        >
          👤 {selectedLanguage.backToUsername}
        </button>

        <button
          style={{
            backgroundColor: selectedColorScheme.buttonBackground,
            color: selectedColorScheme.buttonTextColor,
            width: "15rem",
            height: "4rem",
            borderRadius: "20px",
            fontSize: "1rem",
            fontWeight: "bold",
            border: "none",
            cursor: "pointer",
          }}
          onClick={() => navigate("/survey")}
        >
          🔁 {selectedLanguage.backToSurvey}
        </button>

        <button
          style={{
            backgroundColor: selectedColorScheme.buttonBackground,
            color: selectedColorScheme.buttonTextColor,
            width: "15rem",
            height: "4rem",
            borderRadius: "20px",
            fontSize: "1rem",
            fontWeight: "bold",
            border: "none",
            cursor: "pointer",
          }}
          onClick={() => navigate("/?step=4")}
        >
          🎮 {selectedLanguage.chooseAnotherTest}
        </button>
      </div>
    </div>
  );
};

export default SummaryScreen;
