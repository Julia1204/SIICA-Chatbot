import { useState } from "react";
import ShapeRenderer from "../../ShapeRenderer";

const TestScreen = ({
  trial,
  maxTrials,
  currentSymbol,
  shortcuts,
  colorScheme,
  shapes,
  isTutorialPhase,
  onNextClick,
  onShapeLetterSelect,
  onShortcutSelect,
  letters,
  testAreaRef,
  selectedLanguage,
}) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const renderMiniShape = (shapeId, color, size = 12) => {
    return <ShapeRenderer shapeId={shapeId} color={color} size={size} />;
  };

  return (
    <div
      className="cognitive-test-container"
      style={{
        backgroundColor: colorScheme.backgroundColor,
        color: colorScheme.textColor,
      }}
      ref={testAreaRef}
    >
      <div style={{ width: "100%", maxWidth: 950 }}>
        <div
          className="cognitive-test-shapes-bar"
          style={{ backgroundColor: colorScheme.backgroundColor }}
        >
          <div className="cognitive-test-shapes-container">
            {shapes.map((shape) => (
              <div key={shape.id} style={{ position: "relative" }}>
                <button
                  className="cognitive-test-shape-button"
                  onClick={() =>
                    setOpenDropdown((o) => (o === shape.id ? null : shape.id))
                  }
                >
                  <ShapeRenderer
                    shapeId={shape.id}
                    color={shape.color}
                    size={48}
                  />
                  <span
                    style={{
                      position: "absolute",
                      bottom: 2,
                      right: 4,
                      fontSize: "0.6rem",
                      color: "white",
                    }}
                  >
                    ▼
                  </span>
                </button>

                {openDropdown === shape.id && (
                  <div className="cognitive-test-letter-dropdown">
                    {letters.map((letter) => (
                      <button
                        key={letter}
                        className="cognitive-test-letter-option"
                        onClick={() => {
                          onShapeLetterSelect(shape, letter);
                          setOpenDropdown(null);
                        }}
                      >
                        {renderMiniShape(shape.id, shape.color)}
                        <span style={{ marginLeft: 4 }}>{letter}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="cognitive-test-shortcuts-container">
            <span style={{ marginRight: 6 }}>{selectedLanguage.shortcuts}</span>
            <div style={{ display: "flex", gap: 2 }}>
              {Array.from({ length: 6 }).map((_, i) => {
                const s = (shortcuts || [])[i];
                if (!s) {
                  return (
                    <div
                      key={i}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 4,
                        border: "1px solid rgba(0, 0, 0, 0.2)",
                        backgroundColor: "transparent",
                        color: "#555",
                        cursor: "default",
                      }}
                    />
                  );
                }

                return (
                  <button
                    key={i}
                    className="cognitive-test-shortcut-button"
                    onClick={() => onShortcutSelect(s)}
                  >
                    <ShapeRenderer
                      shapeId={s.id}
                      color={s.color}
                      size={28}
                      letter={s.letter}
                      fontSize={14}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="cognitive-test-centered">
          <h2 style={{ color: colorScheme.titleColor }}>
            {selectedLanguage.select}
          </h2>

          {currentSymbol ? (
            <div
              style={{
                width: 100,
                height: 100,
                position: "relative",
                margin: "1rem 0",
              }}
            >
              <ShapeRenderer
                shapeId={currentSymbol.id}
                color={currentSymbol.color}
                size={100}
                letter={currentSymbol.letter}
                fontSize={42}
              />
            </div>
          ) : (
            <p style={{ fontStyle: "italic", marginTop: 40 }}>
              {selectedLanguage.pressNext}
            </p>
          )}

          <p style={{ marginTop: 24 }}>
            {trial} / {maxTrials} {selectedLanguage.completed}
          </p>

          <button
            className="cognitive-test-button cognitive-test-button-large"
            onClick={onNextClick}
            disabled={
              isTutorialPhase
                ? false
                : currentSymbol !== null || trial >= maxTrials
            }
            style={{
              backgroundColor: colorScheme.buttonBackground,
              color: colorScheme.buttonTextColor,
              opacity: currentSymbol !== null || trial >= maxTrials ? 0.6 : 1,
            }}
          >
            {selectedLanguage.next}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestScreen;
