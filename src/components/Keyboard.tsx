import React from 'react';
import type { LetterState } from '../types/gameTypes';
import './Keyboard.css';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  letterStates: Record<string, LetterState>;
}

const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress }) => {
  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
  ];

  const getKeyClass = (key: string): string => {
    let classes = 'key';
    
    if (key === 'ENTER' || key === 'BACKSPACE') {
      classes += ' special-key';
    }
    
    return classes;
  };

  const getKeyLabel = (key: string): string => {
    if (key === 'BACKSPACE') return '⌫';
    if (key === 'ENTER') return '🔍';
    return key;
  };

  return (
    <div className="keyboard">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((key) => (
            <button
              key={key}
              className={getKeyClass(key)}
              onClick={() => onKeyPress(key)}
            >
              {getKeyLabel(key)}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
