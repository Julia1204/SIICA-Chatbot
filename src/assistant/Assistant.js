import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SettingsContext } from "../settings/SettingsContext";
import { useGame } from "../GameProvider";
import { fetchAll } from "../firebase/firebaseQueries";
import { AnimatePresence, motion } from "framer-motion";
import "./Assistant.css";

const Assistant = () => {
  const { selectedColorScheme, selectedLanguage } = useContext(SettingsContext);
  const { dispatch } = useGame();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(0);
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const [existingUser, setExistingUser] = useState(null);

  useEffect(() => {
    const stepFromUrl = searchParams.get("step");
    if (stepFromUrl !== null) {
      setStep(parseInt(stepFromUrl));
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await fetchAll("users");
      setUsers(data);
    };
    fetchUsers();
  }, []);

  const handleUsernameSubmit = () => {
    if (username.trim() === "") {
      setError(selectedLanguage.errorEnterUsername);
      return;
    }
    const foundUser = users.find(
      (u) => u.name.trim().toUpperCase() === username.trim().toUpperCase()
    );
    if (foundUser) {
      setExistingUser(foundUser);
      dispatch({ type: "SET_PLAYER", payload: { name: foundUser.name } });
      navigate("/?step=2");
    } else {
      setError("");
      setExistingUser(null);
      dispatch({ type: "SET_PLAYER", payload: { name: username.trim() } });
      navigate("/?step=3");
    }
  };

  const handleConfirmExistingUser = (confirm) => {
    if (confirm) {
      navigate("/?step=3");
    } else {
      setUsername("");
      setExistingUser(null);
      navigate("/?step=1");
    }
  };

  const handleSurveyChoice = (fill) => {
    if (fill) {
      navigate("/survey");
    } else {
      navigate("/?step=4");
    }
  };

  const handleGameSelect = (game) => {
    navigate("/" + game);
  };

  useEffect(() => {
    const eyeball = (e) => {
      const eyes = document.querySelectorAll(".eye");
      eyes.forEach((eye) => {
        let x = eye.getBoundingClientRect().left + eye.clientWidth / 2;
        let y = eye.getBoundingClientRect().top + eye.clientHeight / 2;
        let radian = Math.atan2(e.pageX - x, e.pageY - y);
        let rotate = radian * (180 / Math.PI) * -1 + 270;
        eye.style.transform = `rotate(${rotate}deg)`;
      });
    };
    document.body.addEventListener("mousemove", eyeball);
    return () => {
      document.body.removeEventListener("mousemove", eyeball);
    };
  }, []);

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <>
            <p>{selectedLanguage.welcomeAssistant}</p>
            <button className="next-btn" onClick={() => navigate("/?step=1")}>
              {selectedLanguage.next}
            </button>
          </>
        );
      case 1:
        return (
          <>
            <p>
              {selectedLanguage.enterUsername}{" "}
              <span className="required">*</span>
            </p>
            <input
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={selectedLanguage.usernamePlaceholder}
            />
            <button className="next-btn" onClick={handleUsernameSubmit}>
              {selectedLanguage.confirm}
            </button>
            {error && <p className="error">{error}</p>}
          </>
        );
      case 2:
        return (
          <>
            <p>
              {selectedLanguage.existingUsernameQuestion}{" "}
              <strong>{username}</strong>?
            </p>
            <div className="buttons-row">
              <button
                className="choice-btn"
                onClick={() => handleConfirmExistingUser(true)}
              >
                {selectedLanguage.yesContinue}
              </button>
              <button
                className="choice-btn"
                onClick={() => handleConfirmExistingUser(false)}
              >
                {selectedLanguage.noChange}
              </button>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <p>{selectedLanguage.fillSurveyQuestion}</p>
            <div className="buttons-row">
              <button
                className="choice-btn"
                onClick={() => handleSurveyChoice(true)}
              >
                {selectedLanguage.fillSurvey}
              </button>
              <button
                className="choice-btn"
                onClick={() => handleSurveyChoice(false)}
              >
                {selectedLanguage.skip}
              </button>
            </div>
          </>
        );
      case 4:
        return (
          <>
            <p>{selectedLanguage.chooseTestQuestion}</p>
            <div className="buttons-row">
              <div className="tooltip-wrapper">
                <button
                  className="choice-btn"
                  onClick={() => handleGameSelect("multitasking")}
                >
                  {selectedLanguage.multitaskingTest}
                </button>
                <span className="tooltip">
                  {selectedLanguage.multitaskingDescription}
                </span>
              </div>

              <div className="tooltip-wrapper">
                <button
                  className="choice-btn"
                  onClick={() => handleGameSelect("stop")}
                >
                  {selectedLanguage.stopTest}
                </button>
                <span className="tooltip">
                  {selectedLanguage.stopDescription}
                </span>
              </div>

              <div className="tooltip-wrapper">
                <button
                  className="choice-btn"
                  onClick={() => handleGameSelect("litw")}
                >
                  {selectedLanguage.litwTest}
                </button>
                <span className="tooltip">
                  {selectedLanguage.litwDescription}
                </span>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="assistant-wrapper"
      style={{
        backgroundColor: selectedColorScheme.backgroundColor,
        color: selectedColorScheme.textColor,
      }}
    >
      <div className="eyes-container">
        <div className="eye"></div>
        <div className="eye"></div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          className="chat-bubble"
          style={{
            backgroundColor: selectedColorScheme.buttonBackground,
            color: selectedColorScheme.buttonTextColor,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          {renderStepContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Assistant;
