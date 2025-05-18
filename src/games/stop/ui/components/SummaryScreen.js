import { useContext } from "react";
import { saveAs } from "file-saver";
import { makePdfBlob } from "../../../common/GenerateReport";
import { useNavigate } from "react-router-dom";
import { SettingsContext } from "../../../../settings/SettingsContext";

const SummaryScreen = ({
  selectedLanguage,
  selectedColorScheme,
  score,
  total,
  totalTime,
  avgRT,
  rows,
  state,
}) => {
  const { showDetailedSummary } = useContext(SettingsContext);
  const navigate = useNavigate();

  return (
    <div
      className="stop-test-container"
      style={{
        backgroundColor: selectedColorScheme.backgroundColor,
        color: selectedColorScheme.textColor,
        flexDirection: "column",
      }}
    >
      <h1 style={{ color: selectedColorScheme.titleColor }}>
        {selectedLanguage.summary}
      </h1>
      <div
        className="summary-card"
        style={{ backgroundColor: selectedColorScheme.summaryBackgroundColor }}
      >
        <table className="summary-table">
          <tbody>
            <tr>
              <th>{selectedLanguage.rightAnswers}:</th>
              <td>
                {score} / {total}
              </td>
            </tr>
            <tr>
              <th>{selectedLanguage.totalTime}:</th>
              <td>{(totalTime / 1000).toFixed(2)} s</td>
            </tr>
            <tr>
              <th>{selectedLanguage.averageReactionTime}:</th>
              <td>{avgRT.toFixed(0)} ms</td>
            </tr>
          </tbody>
        </table>
      </div>
      {showDetailedSummary && (
        <h2
          style={{
            marginTop: "2rem",
            color: selectedColorScheme.titleColor,
          }}
        >
          {selectedLanguage.detailedResults}
        </h2>
      )}
      {showDetailedSummary && (
        <div
          className="summary-details"
          style={{
            border: `1px solid ${selectedColorScheme.textColor}33`,
          }}
        >
          <table className="summary-details-table">
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
              {rows.map((r, i) => {
                const isCorrect = r.select === r.correct;
                const rowStyle = {
                  backgroundColor: isCorrect
                    ? "rgba(0, 128, 0, 0.25)"
                    : "rgba(255, 0, 0, 0.25)",
                };
                return (
                  <tr key={i} style={rowStyle}>
                    <td>{r.nr}</td>
                    <td>{r.cell}</td>
                    <td>{r.select}</td>
                    <td>{r.correct}</td>
                    <td>{r.rt ? `${r.rt} ms` : ""}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <button
        className="stop-button"
        style={{
          backgroundColor: selectedColorScheme.buttonBackground,
          color: selectedColorScheme.buttonTextColor,
          marginTop: "2rem",
          width: "15rem",
        }}
        onClick={async () => {
          try {
            const summary = {
              rightAnswers: `${score} / ${total}`,
              totalTime: `${(totalTime / 1000).toFixed(2)}s`,
              avgRT: `${avgRT.toFixed(0)}ms`,
            };
            const blob = await makePdfBlob({
              headers: {
                nr: selectedLanguage.numberQuestion,
                cell: selectedLanguage.cell,
                select: selectedLanguage.selectedAnswer,
                correct: selectedLanguage.correctAnswer,
                rt: `${selectedLanguage.reactionTime} (ms)`,
              },
              rows,
              title: `${
                selectedLanguage.report
              }: ${new Date().toLocaleDateString()}`,
              survey: state.survey,
              selectedLanguage,
              summary,
            });
            saveAs(
              blob,
              `report_${state.player.name}_stop_signal_${Date.now()}.pdf`
            );
          } catch (e) {
            console.error(e);
          }
        }}
      >
        ⬇️ {selectedLanguage.downloadPdf}
      </button>
      <div
        style={{
          marginTop: "1.5rem",
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <button
          className="stop-button"
          style={{
            backgroundColor: selectedColorScheme.buttonBackground,
            color: selectedColorScheme.buttonTextColor,
            width: "15rem",
            height: "4rem",
          }}
          onClick={() => navigate("/?step=1")}
        >
          👤 {selectedLanguage.backToUsername}
        </button>
        <button
          className="stop-button"
          style={{
            backgroundColor: selectedColorScheme.buttonBackground,
            color: selectedColorScheme.buttonTextColor,
            width: "15rem",
            height: "4rem",
          }}
          onClick={() => navigate("/survey")}
        >
          🔁 {selectedLanguage.backToSurvey}
        </button>
        <button
          className="stop-button"
          style={{
            backgroundColor: selectedColorScheme.buttonBackground,
            color: selectedColorScheme.buttonTextColor,
            width: "15rem",
            height: "4rem",
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
