import { useEffect, useRef } from "react";

const SoundTestScreen = ({
  selectedLanguage,
  selectedColorScheme,
  selectedSound,
  onContinue,
}) => {
  const localAudioRef = useRef(null);

  useEffect(() => {
    const audio = new Audio(selectedSound.url);
    audio.volume = 1;
    localAudioRef.current = audio;
  }, [selectedSound.url]);

  const handlePlaySound = () => {
    const audio = localAudioRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch((err) => {
        console.error("Audio playback error:", err);
      });
    }
  };

  return (
    <div
      style={{
        backgroundColor: selectedColorScheme.backgroundColor,
        color: selectedColorScheme.textColor,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "95vh",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <h1 style={{ color: selectedColorScheme.titleColor }}>
        {selectedLanguage.soundTestTitle}
      </h1>
      <p style={{ fontSize: "1.2rem", maxWidth: "500px" }}>
        {selectedLanguage.soundTestInstructions}
      </p>
      <button
        onClick={handlePlaySound}
        style={{
          marginTop: "2rem",
          backgroundColor: selectedColorScheme.buttonBackground,
          color: selectedColorScheme.buttonTextColor,
          width: "5rem",
          height: "5rem",
          borderRadius: "50%",
          fontSize: "2rem",
          border: "none",
          cursor: "pointer",
        }}
        aria-label="Play beep"
      >
        🔊
      </button>
      <button
        onClick={onContinue}
        style={{
          marginTop: "3rem",
          backgroundColor: selectedColorScheme.buttonBackground,
          color: selectedColorScheme.buttonTextColor,
          padding: "1rem 2rem",
          fontSize: "1rem",
          fontWeight: "bold",
          borderRadius: "12px",
          border: "none",
          cursor: "pointer",
        }}
      >
        {selectedLanguage.continue}
      </button>
    </div>
  );
};

export default SoundTestScreen;
