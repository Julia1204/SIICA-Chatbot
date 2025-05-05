import React, {useState, useContext} from "react";
import {useNavigate} from "react-router-dom";
import {SettingsContext} from "../settings/SettingsContext";
import {AnimatePresence, motion} from "framer-motion";
import "./Survey.css";
import {db} from "../firebase/firebaseConfig";
import {collection, doc, setDoc} from "firebase/firestore";
import {useGame} from "../GameProvider";

const Survey = () => {
    const {selectedColorScheme, selectedLanguage} = useContext(SettingsContext);
    const navigate = useNavigate();
    const {dispatch} = useGame();

    const [form, setForm] = useState({
        age: "",
        gender: "",
        device: "",
        additionalInfo: "",
        takenBefore: "",
        frequency: "",
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const {name, value} = e.target;
        setForm((prev) => ({...prev, [name]: value}));
    };

    // const handleSubmit = async (e) => {
    //   e.preventDefault();
    //   const required = ["age", "gender", "device", "takenBefore", "frequency"];
    //   if (required.some((f) => !form[f])) {
    //     setError(selectedLanguage.errorRequired ?? "Uzupełnij wymagane pola");
    //     return;
    //   }
    //   try {
    //     navigate("/?step=4");
    //   } catch (err) {
    //     console.error(err);
    //     setError(selectedLanguage.errorSave ?? "Błąd zapisu, spróbuj ponownie");
    //   }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const required = ["age", "gender", "device", "takenBefore", "frequency"];
        if (required.some((f) => !form[f])) {
            setError(selectedLanguage.errorRequired);
            return;
        }
        try {
            const surveysCol = collection(db, "surveys");
            const surveyRef = doc(surveysCol);
            await setDoc(surveyRef, {
                id: surveyRef.id,
                userId: "julia",
                ...form,
            });
            dispatch({type: "SET_SURVEY", payload: form})
            navigate("/?step=4");
        } catch (err) {
            console.error(err);
            setError(selectedLanguage.errorSave);
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
            <AnimatePresence mode="wait">
                <motion.div
                    key="survey"
                    className="chat-bubble"
                    style={{
                        backgroundColor: selectedColorScheme.buttonBackground,
                        color: selectedColorScheme.buttonTextColor,
                    }}
                    initial={{opacity: 0, scale: 0.8}}
                    animate={{opacity: 1, scale: 1}}
                    exit={{opacity: 0, scale: 0.5}}
                    transition={{duration: 0.5}}
                >
                    <h2 className="survey-title">{selectedLanguage.surveyTitle}</h2>

                    <form className="survey-form" onSubmit={handleSubmit}>
                        <div className="survey-group">
                            <label htmlFor="age">
                                {selectedLanguage.ageLabel} <span className="required">*</span>
                            </label>
                            <input
                                className="input"
                                type="number"
                                id="age"
                                name="age"
                                value={form.age}
                                onChange={handleChange}
                                placeholder={selectedLanguage.ageLabel}
                                min="6"
                                max="120"
                            />
                        </div>

                        <div className="survey-group">
                            <label htmlFor="gender">
                                {selectedLanguage.genderLabel}{" "}
                                <span className="required">*</span>
                            </label>
                            <select
                                className="input"
                                id="gender"
                                name="gender"
                                value={form.gender}
                                onChange={handleChange}
                            >
                                <option value="">{selectedLanguage.select}</option>
                                <option value="female">{selectedLanguage.female}</option>
                                <option value="male">{selectedLanguage.male}</option>
                                <option value="na">{selectedLanguage.na}</option>
                            </select>
                        </div>

                        <div className="survey-group">
                            <label htmlFor="device">
                                {selectedLanguage.deviceLabel}{" "}
                                <span className="required">*</span>
                            </label>
                            <select
                                className="input"
                                id="device"
                                name="device"
                                value={form.device}
                                onChange={handleChange}
                            >
                                <option value="">{selectedLanguage.select}</option>
                                <option value="mouse">{selectedLanguage.mouse}</option>
                                <option value="touchpad">{selectedLanguage.touchpad}</option>
                                <option value="other">{selectedLanguage.other}</option>
                            </select>
                        </div>

                        <div className="survey-group">
                            <label htmlFor="additionalInfo">
                                {selectedLanguage.additionalInfoLabel}
                            </label>
                            <textarea
                                className="input"
                                id="additionalInfo"
                                name="additionalInfo"
                                value={form.additionalInfo}
                                rows={3}
                                onChange={handleChange}
                                placeholder={selectedLanguage.additionalInfoPlaceholder}
                            />
                        </div>

                        <div className="survey-group">
                            <label htmlFor="takenBefore">
                                {selectedLanguage.takenBeforeLabel}{" "}
                                <span className="required">*</span>
                            </label>
                            <select
                                className="input"
                                id="takenBefore"
                                name="takenBefore"
                                value={form.takenBefore}
                                onChange={handleChange}
                            >
                                <option value="">{selectedLanguage.select}</option>
                                <option value="yes">{selectedLanguage.yes}</option>
                                <option value="no">{selectedLanguage.no}</option>
                            </select>
                        </div>

                        <div className="survey-group">
                            <label htmlFor="frequency">
                                {selectedLanguage.frequencyLabel}{" "}
                                <span className="required">*</span>
                            </label>
                            <select
                                className="input"
                                id="frequency"
                                name="frequency"
                                value={form.frequency}
                                onChange={handleChange}
                            >
                                <option value="">{selectedLanguage.select}</option>
                                <option value="daily">{selectedLanguage.daily}</option>
                                <option value="few_times_week">
                                    {selectedLanguage.fewTimesWeek}
                                </option>
                                <option value="weekly">{selectedLanguage.weekly}</option>
                                <option value="rarely">{selectedLanguage.rarely}</option>
                            </select>
                        </div>

                        {error && <p className="error">{error}</p>}

                        <button type="submit" className="next-btn">
                            {selectedLanguage.submit}
                        </button>
                    </form>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default Survey;
