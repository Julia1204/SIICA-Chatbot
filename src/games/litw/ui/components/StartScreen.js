const StartScreen = ({ colorScheme, onBegin, selectedLanguage }) => {
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
          {selectedLanguage.litwTest}
        </h1>

        <p className="cognitive-test-paragraph">
          {selectedLanguage.litwDescription}
        </p>

        <button
          className="cognitive-test-button cognitive-test-button-large"
          onClick={onBegin}
          style={{
            backgroundColor: colorScheme.buttonBackground,
            color: colorScheme.buttonTextColor,
          }}
        >
          {selectedLanguage.startTest}
        </button>
      </div>
    </div>
  );
};

export default StartScreen;
