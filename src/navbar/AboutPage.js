import React, { useContext } from "react";
import { SettingsContext } from "../settings/SettingsContext";
import "./AboutPage.css";

const AboutPage = () => {
  const { selectedColorScheme, selectedLanguage } = useContext(SettingsContext);

  return (
    <div
      className="about-wrapper"
      style={{
        backgroundColor: selectedColorScheme.backgroundColor,
        color: selectedColorScheme.textColor,
      }}
    >
      <h1
        className="about-title"
        style={{ color: selectedColorScheme.titleColor }}
      >
        {selectedLanguage.aboutTitle}
      </h1>

      <p className="about-text">{selectedLanguage.aboutProjectText}</p>

      <p className="about-section-title">{selectedLanguage.team}:</p>
      <p className="about-names">
        Julia Gościniak (259164) <br />
        Jakub Budziło (259069) <br />
        Katarzyna Hajduk (259189)
      </p>

      <p className="about-supervisor">
        {selectedLanguage.supervisor}: Dr inż. Jan Nikodem
      </p>

      <p className="about-details">
        {selectedLanguage.courseName}
        <br />
        {selectedLanguage.university}, 2025
        <br />
      </p>

      <p className="about-contact">
        {selectedLanguage.contact}:<br />
        <p className="about-names">
          259164@student.pwr.edu.pl <br />
          259069@student.pwr.edu.pl <br />
          259189@student.pwr.edu.pl <br />
        </p>
      </p>
    </div>
  );
};

export default AboutPage;
