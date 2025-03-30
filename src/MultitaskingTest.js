import React, { useState, useEffect } from 'react';
import './MultitaskingTest.css';

const MultitaskingTest = () => {
  const [mode, setMode] = useState('');
  const [rule, setRule] = useState('');
  const [startTest, setStartTest] = useState(false);

  const [arrowSide, setArrowSide] = useState('left');
  const [arrowDirection, setArrowDirection] = useState('left');

  const generateTrial = () => {
    if (mode === 'multi') {
      setRule(Math.random() < 0.5 ? 'side' : 'direction');
    }
    setArrowSide(Math.random() < 0.5 ? 'left' : 'right');
    setArrowDirection(Math.random() < 0.5 ? 'left' : 'right');
  };

  useEffect(() => {
    if (startTest) {
      generateTrial();
    }
  }, [startTest]);

  const handleClick = () => {
    generateTrial();
  };

  if (!startTest) {
    return (
      <div className="header">
        <h1>Pick Your Test Type</h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button
            className="choice-button"
            onClick={() => {
              setMode('multi');
              setStartTest(true);
            }}
          >
            Multitasking Mode
          </button>

          <button
            className="choice-button"
            onClick={() => {
              setMode('single');
            }}
          >
            Single Mode
          </button>

          {mode === 'single' && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                marginTop: '1rem',
              }}
            >
              <h2>Choose a rule for single mode:</h2>
              <button
                className="choice-button"
                onClick={() => {
                  setRule('side');
                  setStartTest(true);
                }}
              >
                Side
              </button>
              <button
                className="choice-button"
                onClick={() => {
                  setRule('direction');
                  setStartTest(true);
                }}
              >
                Direction
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="header">
      <h1>{rule === 'side' ? 'Select SIDE' : 'Select DIRECTION'}</h1>

      <div className="arrows">
        <img
          className={arrowSide === 'left' ? 'left-arrow' : 'right-arrow'}
          src={
            arrowDirection === 'left'
              ? './assets/left_arrow.svg'
              : './assets/right_arrow.svg'
          }
          alt="arrow"
        />
      </div>

      <button
        className="white-rectangle left-rectangle"
        onClick={handleClick}
      >
        Left
      </button>

      <button
        className="white-rectangle right-rectangle"
        onClick={handleClick}
      >
        Right
      </button>
    </div>
  );
};

export default MultitaskingTest;
