import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SettingsContext } from "./SettingsContext";
import SettingsMenu from "./SettingsMenu";

const SettingsPage = () => {
  const { selectedColorScheme, selectedLanguage } = useContext(SettingsContext);
  const navigate = useNavigate();

  const containerStyle = {
    backgroundColor: selectedColorScheme.backgroundColor,
    color: selectedColorScheme.textColor,
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    transition: "background-color 0.3s",
    padding: "2rem",
  };

  const buttonStyle = {
    backgroundColor: selectedColorScheme.buttonBackground,
    color: selectedColorScheme.buttonTextColor,
    padding: "1rem 2rem",
    borderRadius: "10px",
    cursor: "pointer",
    border: "none",
    marginTop: "2rem",
  };

  const handleConfirm = () => {
    navigate("/");
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ color: selectedColorScheme.titleColor }}>
        {selectedLanguage.settings}
      </h1>

      <SettingsMenu />

      <button style={buttonStyle} onClick={handleConfirm}>
        {selectedLanguage.confirm}
      </button>
    </div>
  );
};

export default SettingsPage;
