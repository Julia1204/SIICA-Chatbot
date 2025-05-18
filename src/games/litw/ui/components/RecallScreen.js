import React from "react";

const RecallScreen = ({
  colorScheme,
  recallInput,
  setRecallInput,
  onSubmit,
  length,
  selectedLanguage,
}) => {
  return (
    <div
      className="cognitive-test-container"
      style={{
        backgroundColor: colorScheme.backgroundColor,
        color: colorScheme.textColor,
      }}
    >
      <div className="cognitive-test-centered">
        <h1
          className="cognitive-test-title"
          style={{ color: colorScheme.titleColor }}
        >
          {selectedLanguage.enterSequence}
        </h1>

        <p>
          {selectedLanguage.enterSequenceInstructions1} {length}
          {selectedLanguage.enterSequenceInstructions2}
        </p>

        <input
          className="cognitive-test-recall-input"
          value={recallInput}
          onChange={(e) =>
            setRecallInput(e.target.value.toUpperCase().slice(0, length))
          }
          maxLength={length}
          placeholder="A1B2C3"
          style={{
            borderColor: colorScheme.textColor + "33",
          }}
        />

        <button
          className="cognitive-test-button cognitive-test-button-large"
          onClick={onSubmit}
          style={{
            backgroundColor: colorScheme.buttonBackground,
            color: colorScheme.buttonTextColor,
            marginTop: "2rem",
          }}
        >
          {selectedLanguage.submit}
        </button>
      </div>
    </div>
  );
};

export default RecallScreen;
