import React, { createContext, useReducer, useContext } from "react";

// do analizy czy jest potrzebny
const initialState = {
    player: { name: "", age: null },
    currentGame: null,
    results: {
        multitask: null,
        reaction: null,
        memory: null,
    },
    test: {
        running: false,
        finished: false,
        grid: { rows: 5, cols: 5 },
        mode: null,
        rule: null,
        step: 0,
        score: 0,
        startTime: null,
        endTime: null,
        trialStart: null,
        arrowSide: null,
        arrowDirection: null,
        reactionTimes: [],
        cursorCells: [],
    },
};

function reducer(state, action) {
    switch (action.type) {
        case "SET_PLAYER":
            return { ...state, player: action.payload };
        case "SAVE_RESULT":
            return {
                ...state,
                results: {
                    ...state.results,
                    [action.game]: action.payload,
                },
                currentGame: null,
            };

        default:
            return state;
    }
}

const GameContext = createContext();
export const useGame = () => useContext(GameContext);

export function GameProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <GameContext.Provider value={{ state, dispatch }}>
            {children}
        </GameContext.Provider>
    );
}
