import React, { createContext, useReducer, useContext } from "react";

// to analise is it needed?
const initialState = {
    player: { name: "Test_User" },
    currentGame: null,
    results: {
        multitask: null,
        reaction: null,
        memory: null,
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

export const GameProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <GameContext.Provider value={{ state, dispatch }}>
            {children}
        </GameContext.Provider>
    );
}
