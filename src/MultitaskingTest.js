import "./MultitaskingTest.css";

import React from 'react'

const handleClick = (direction) => {
    const handleClick = (direction) => {
        alert(`Kliknąłeś przycisk: ${direction}`);
    };
};

const MultitaskingTest = () => {
    return (
        <div className="header">
            <h1>Direction</h1>
            <div className="arrows">
                <img src="/assets/left_arrow.svg"></img>
                <img src="/assets/right_arrow.svg"></img>
            </div>
            <button className="white-rectangle left-rectangle" onClick={() => handleClick("Left")}>Left</button>
            <button className="white-rectangle right-rectangle" onClick={() => handleClick("Right")}>Right</button>
        </div>

    )
}

export default MultitaskingTest
