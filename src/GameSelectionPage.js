import React from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "./GameProvider";
import "./GameSelectionPage.css";


const GAMES = [
    { id: "multitask", path: "/multitasking-game", labelKey: "multitaskBtn" },
    { id: "2 game",  path: "/",  labelKey: "reactionBtn"  },
    { id: "3 game",    path: "/",    labelKey: "memoryBtn"    },
];
const GameSelectionPage = () => {
    const navigate = useNavigate();
    const { dispatch, state } = useGame();

    const handleSelect = ({ id, path }) => {
        dispatch({ type: "START_GAME", payload: id });
        navigate(path);
    };
// // do analizy gdzie język będzie wybierany !!!!!
    return (
        <div className="gsp-wrapper">
            <h1 className="gsp-title">Select game</h1>

            <div className="gsp-buttons">
                {GAMES.map((game) => (
                    <button
                        key={game.id}
                        className="gsp-btn"
                        onClick={() => handleSelect(game)}
                    >
                        {game.id} {}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default GameSelectionPage;
