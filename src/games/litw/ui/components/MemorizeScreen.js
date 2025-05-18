import { useState, useEffect } from "react";

const MemorizeScreen = ({
  colorScheme,
  memoryString,
  onContinue,
  selectedLanguage,
}) => {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (countdown <= 0) {
      onContinue();
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, onContinue]);

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
          {selectedLanguage.memorySequence}
        </h1>

        <p>
          {selectedLanguage.memoryCountdown} {countdown}{" "}
          {selectedLanguage.seconds} {selectedLanguage.toMemorize}
        </p>

        <div className="cognitive-test-memory-string">{memoryString}</div>

        <p>{selectedLanguage.memorizeInstruction1}</p>
        <p>{selectedLanguage.memorizeInstruction2}</p>

        <button
          className="cognitive-test-button cognitive-test-button-medium"
          onClick={onContinue}
          style={{
            backgroundColor: colorScheme.buttonBackground,
            color: colorScheme.buttonTextColor,
            marginTop: "1.5rem",
          }}
        >
          {selectedLanguage.skipTimer}
        </button>
      </div>
    </div>
  );
};

export default MemorizeScreen;
