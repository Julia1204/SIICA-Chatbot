import { useContext } from "react";
import { saveAs } from "file-saver";
import { makePdfBlob } from "../../../common/GenerateReport";
import { SettingsContext } from "../../../../settings/SettingsContext";

const SummaryScreen = ({
  colorScheme,
  correctAnswers,
  totalTrials,
  memoryString,
  recall,
  rtArr,
  selectedLanguage,
  state,
  navigate,
  selectedSymbols,
  correctSymbols,
  cursorCells,
}) => {
  const { showDetailedSummary } = useContext(SettingsContext);
  const totalTime = rtArr.reduce((a, b) => a + b, 0);
  const avgRT = rtArr.length ? totalTime / rtArr.length : 0;

  const memoryScore = [...memoryString].filter(
    (c, i) => c === recall[i]
  ).length;
  const memoryAccuracy = Math.round((memoryScore / memoryString.length) * 100);

  const cellLabel = (c) =>
    c === 1
      ? selectedLanguage.left
      : c === 2
      ? selectedLanguage.middle
      : selectedLanguage.right;

  const getSymbolDescription = (symbol) => {
    if (!symbol) return "";
    return `${symbol.id} ${symbol.letter}`;
  };

  const tableRows = selectedSymbols.map((symbol, i) => ({
    nr: i + 1,
    cell: cellLabel(cursorCells[i]),
    select: getSymbolDescription(symbol),
    correct: getSymbolDescription(correctSymbols[i]),
    rt: rtArr[i] ? `${rtArr[i]} ms` : "",
  }));

  const handleDownloadReport = async () => {
    try {
      const timestamp = new Date().getTime();
      const summary = {
        rightAnswers: `${correctAnswers} / ${totalTrials}`,
        totalTime: `${(totalTime / 1000).toFixed(2)}s`,
        avgRT: `${avgRT.toFixed(0)}ms`,
        memoryAccuracy: `${memoryAccuracy}%`,
      };

      const blob = await makePdfBlob({
        headers: {
          nr: selectedLanguage.numberQuestion,
          cell: selectedLanguage.cell,
          select: selectedLanguage.selectedAnswer,
          correct: selectedLanguage.correctAnswer,
          rt: `${selectedLanguage.reactionTime} (ms)`,
        },
        rows: tableRows,
        title: `${selectedLanguage.report} ${
          state.player.name
        }: ${new Date().toLocaleDateString()}`,
        survey: state.survey,
        selectedLanguage,
        summary,
      });

      saveAs(blob, `report_${state.player.name}_litw_${timestamp}.pdf`);
    } catch (e) {
      console.error("PDF error", e);
    }
  };

  return (
    <div
      className="cognitive-test-container"
      style={{
        backgroundColor: colorScheme.backgroundColor,
        color: colorScheme.textColor,
      }}
    >
      <h1
        className="cognitive-test-title"
        style={{ color: colorScheme.titleColor }}
      >
        {selectedLanguage.summary}
      </h1>

      <div
        className="cognitive-test-summary-card"
        style={{
          backgroundColor: colorScheme.summaryBackgroundColor,
        }}
      >
        <table style={{ width: "100%" }}>
          <tbody>
            <tr>
              <th style={{ textAlign: "left", padding: "0.25rem 0" }}>
                {selectedLanguage.rightAnswers}
              </th>
              <td style={{ textAlign: "right", fontWeight: 700 }}>
                {correctAnswers} / {totalTrials} (
                {Math.round((correctAnswers / totalTrials) * 100)}%)
              </td>
            </tr>
            <tr>
              <th style={{ textAlign: "left", padding: "0.25rem 0" }}>
                {selectedLanguage.totalTime}
              </th>
              <td style={{ textAlign: "right", fontWeight: 700 }}>
                {(totalTime / 1000).toFixed(2)} s
              </td>
            </tr>
            <tr>
              <th style={{ textAlign: "left", padding: "0.25rem 0" }}>
                {selectedLanguage.averageReactionTime}
              </th>
              <td style={{ textAlign: "right", fontWeight: 700 }}>
                {avgRT.toFixed(0)} ms
              </td>
            </tr>
            <tr>
              <th style={{ textAlign: "left", padding: "0.25rem 0" }}>
                {selectedLanguage.memoryRecall}
              </th>
              <td style={{ textAlign: "right", fontWeight: 700 }}>
                {memoryAccuracy}%
              </td>
            </tr>
            <tr>
              <td colSpan={2} style={{ height: 8 }} />
            </tr>
            <tr>
              <th style={{ textAlign: "left", padding: "0.25rem 0" }}>
                {selectedLanguage.originalSequence}
              </th>
              <td
                style={{
                  textAlign: "right",
                  fontWeight: 700,
                  fontFamily: "monospace",
                }}
              >
                {memoryString}
              </td>
            </tr>
            <tr>
              <th style={{ textAlign: "left", padding: "0.25rem 0" }}>
                {selectedLanguage.yourRecall}
              </th>
              <td
                style={{
                  textAlign: "right",
                  fontWeight: 700,
                  fontFamily: "monospace",
                }}
              >
                {recall || "(empty)"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {showDetailedSummary && (
        <>
          <h2 style={{ marginTop: "2rem", color: colorScheme.titleColor }}>
            {selectedLanguage.detailedResults}
          </h2>
          <div
            style={{
              maxHeight: 260,
              overflowY: "auto",
              marginTop: 16,
              border: `1px solid ${colorScheme.textColor}33`,
              borderRadius: 12,
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "1rem",
              }}
            >
              <thead>
                <tr>
                  <th>{selectedLanguage.numberQuestion}</th>
                  <th>{selectedLanguage.cell}</th>
                  <th>{selectedLanguage.selectedAnswer}</th>
                  <th>{selectedLanguage.correctAnswer}</th>
                  <th>{selectedLanguage.reactionTime} (ms)</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((r, i) => {
                  const isCorrect = r.select === r.correct;
                  return (
                    <tr
                      key={i}
                      style={{
                        backgroundColor: isCorrect
                          ? "rgba(0,128,0,.25)"
                          : "rgba(255,0,0,.25)",
                      }}
                    >
                      <td>{r.nr}</td>
                      <td>{r.cell}</td>
                      <td>{r.select}</td>
                      <td>{r.correct}</td>
                      <td>{r.rt}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      <button
        className="cognitive-test-button cognitive-test-button-large"
        style={{
          marginTop: "2rem",
          backgroundColor: colorScheme.buttonBackground,
          color: colorScheme.buttonTextColor,
        }}
        onClick={handleDownloadReport}
      >
        ⬇️ {selectedLanguage.downloadPdf}
      </button>

      <div className="cognitive-test-button-row">
        <button
          className="cognitive-test-button cognitive-test-button-large"
          style={{
            backgroundColor: colorScheme.buttonBackground,
            color: colorScheme.buttonTextColor,
          }}
          onClick={() => navigate("/?step=1")}
        >
          👤 {selectedLanguage.backToUsername}
        </button>

        <button
          className="cognitive-test-button cognitive-test-button-large"
          style={{
            backgroundColor: colorScheme.buttonBackground,
            color: colorScheme.buttonTextColor,
          }}
          onClick={() => navigate("/survey")}
        >
          🔁 {selectedLanguage.backToSurvey}
        </button>

        <button
          className="cognitive-test-button cognitive-test-button-large"
          style={{
            backgroundColor: colorScheme.buttonBackground,
            color: colorScheme.buttonTextColor,
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
