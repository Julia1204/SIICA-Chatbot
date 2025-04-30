import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { SettingsContext } from "../settings/SettingsContext";
import "./Navbar.css";

const Navbar = () => {
  const { selectedColorScheme, selectedLanguage } = useContext(SettingsContext);
  const location = useLocation();

  return (
    <nav
      className="navbar"
      style={{
        backgroundColor: selectedColorScheme.summaryBackgroundColor,
        color: selectedColorScheme.textColor,
      }}
    >
      <Link
        to="/"
        className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
        style={{ color: selectedColorScheme.textColor }}
      >
        {selectedLanguage.home || "Home"}
      </Link>
      <Link
        to="/about"
        className={`nav-link ${location.pathname === "/about" ? "active" : ""}`}
        style={{ color: selectedColorScheme.textColor }}
      >
        {selectedLanguage.about || "About"}
      </Link>
      <Link
        to="/settings"
        className={`nav-link ${
          location.pathname === "/settings" ? "active" : ""
        }`}
        style={{ color: selectedColorScheme.textColor }}
      >
        {selectedLanguage.settings}
      </Link>
    </nav>
  );
};

export default Navbar;
