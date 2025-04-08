import React, { useState, useEffect } from 'react';
import './MultitaskingTest.css';

const MultitaskingTest = () => {
  const [mode, setMode] = useState('');
  const [rule, setRule] = useState('');
  const [startTest, setStartTest] = useState(false);
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [highlight, setHighlight] = useState('');
  const [lastClick, setLastClick] = useState('');


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

  const handleClick = (side) => {
    setLastClick(side);
    setStep(prev => prev + 1);

    const correctAnswer =
      rule === 'side' ? arrowSide : arrowDirection;

    if (side === correctAnswer) {
      setScore(prev => prev + 1);
      setHighlight(side);
    } else {
      setHighlight('wrong-' + side);
    }

    setTimeout(() => {
      setHighlight('');
      generateTrial();
    }, 400);
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
      <h2 className='step-counter'> Step: {step}</h2>
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
        className={`white-rectangle left-rectangle ${highlight === 'left' ? 'highlight' : highlight === 'wrong-left' ? 'wrong-left' : ''
          }`}
        onClick={() => handleClick('left')}
      >
        Left
      </button>

      <button
        className={`white-rectangle right-rectangle ${highlight === 'right' ? 'highlight' : highlight === 'wrong-right' ? 'wrong-right' : ''
          }`}
        onClick={() => handleClick('right')}
      >
        Right
      </button>

    </div>
  );
};

export default MultitaskingTest;
