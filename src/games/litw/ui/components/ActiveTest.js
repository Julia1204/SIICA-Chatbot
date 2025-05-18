import { useState } from "react";
import { LETTERS, renderShape } from "../../constants";

const ActiveTest = ({
  trial,
  maxTrials,
  currentSymbol,
  shortcuts,
  shapes,
  letters = LETTERS,
  onNext,
  onShapeLetter,
  onShortcut,
  selectedColorScheme,
  selectedLanguage,
}) => {
  const [open, setOpen] = useState(null);

  return (
    <div style={{ width: "100%", maxWidth: 950 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 0",
          borderBottom: "1px solid #0002",
          position: "sticky",
          top: 0,
          backgroundColor: selectedColorScheme.backgroundColor,
        }}
      >
        <div style={{ display: "flex", gap: 4 }}>
          {shapes.map((s) => (
            <div key={s.id} style={{ position: "relative" }}>
              <button
                onClick={() => setOpen((o) => (o === s.id ? null : s.id))}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 4,
                  border: "1px solid #0003",
                  background: "transparent",
                  cursor: "pointer",
                  padding: 0,
                  overflow: "hidden",
                }}
              >
                {renderShape(s.id, s.color, 48)}
                <span
                  style={{
                    position: "absolute",
                    bottom: 2,
                    right: 4,
                    fontSize: "0.6rem",
                    color: "#fff",
                  }}
                >
                  ▼
                </span>
              </button>
              {open === s.id && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    zIndex: 20,
                    background: "#fff",
                    border: "1px solid #0002",
                    borderRadius: 4,
                  }}
                >
                  {letters.map((l) => (
                    <button
                      key={l}
                      onClick={() => {
                        onShapeLetter(s, l);
                        setOpen(null);
                      }}
                      style={{
                        width: "100%",
                        padding: "0.4rem 0.5rem",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      {renderShape(s.id, s.color, 12)} {l}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ marginRight: 6 }}>{selectedLanguage.shortcut}:</span>
          <div style={{ display: "flex", gap: 2 }}>
            {Array.from({ length: 6 }).map((_, i) => {
              const sc = shortcuts[i];
              const style = {
                width: 28,
                height: 28,
                borderRadius: 4,
                border: "1px solid",
                overflow: "hidden",
              };
              return sc ? (
                <button
                  key={i}
                  onClick={() => onShortcut(sc)}
                  style={{
                    ...style,
                    cursor: "pointer",
                    position: "relative",
                    padding: 0,
                  }}
                >
                  {renderShape(sc.id, sc.color, 28, sc.letter, 14)}
                </button>
              ) : (
                <div key={i} style={{ ...style, background: "transparent" }} />
              );
            })}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "70vh",
          textAlign: "center",
        }}
      >
        <h2 style={{ color: selectedColorScheme.titleColor }}>
          {selectedLanguage.select}
        </h2>

        {currentSymbol ? (
          <div style={{ width: 100, height: 100, margin: "1rem 0" }}>
            {renderShape(
              currentSymbol.id,
              currentSymbol.color,
              100,
              currentSymbol.letter,
              42
            )}
          </div>
        ) : (
          <p style={{ fontStyle: "italic", marginTop: 40 }}>
            {selectedLanguage.pressNext}
          </p>
        )}

        <p style={{ marginTop: 24 }}>
          {trial} / {maxTrials} {selectedLanguage.step}
        </p>

        <button
          onClick={onNext}
          disabled={!!currentSymbol || trial >= maxTrials}
          style={{
            backgroundColor: selectedColorScheme.buttonBackground,
            color: selectedColorScheme.buttonTextColor,
            width: 200,
            height: 60,
            borderRadius: 20,
            fontSize: "1.1rem",
            fontWeight: "bold",
            border: "none",
            cursor: "pointer",
            opacity: !!currentSymbol || trial >= maxTrials ? 0.6 : 1,
          }}
        >
          {selectedLanguage.next}
        </button>
      </div>
    </div>
  );
};

export default ActiveTest;
