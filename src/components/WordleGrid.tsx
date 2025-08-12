import React, { useState, useEffect } from 'react';
import type { LetterState } from '../types/gameTypes';
import './WordleGrid.css';

interface WordleGridProps {
  guesses: string[][];
  currentRow: number;
  currentCol: number;
  targetWord: string;
  onTileColorsChange: (tileColors: (LetterState | null)[][]) => void;
}

const WordleGrid: React.FC<WordleGridProps> = ({ 
  guesses, 
  currentRow, 
  currentCol, 
  targetWord,
  onTileColorsChange
}) => {
  const [tileColors, setTileColors] = useState<(LetterState | null)[][]>(
    Array(6).fill(null).map(() => Array(5).fill(null))
  );
  const [showModal, setShowModal] = useState(false);
  const [selectedTile, setSelectedTile] = useState<{row: number, col: number} | null>(null);

  // Notify parent when tile colors change
  useEffect(() => {
    onTileColorsChange(tileColors);
  }, [tileColors, onTileColorsChange]);

  const handleTileClick = (row: number, col: number) => {
    if (guesses[row][col]) {
      setSelectedTile({ row, col });
      setShowModal(true);
    }
  };

  const selectColor = (color: LetterState) => {
    if (selectedTile) {
      const newTileColors = [...tileColors];
      newTileColors[selectedTile.row][selectedTile.col] = color;
      setTileColors(newTileColors);
      setShowModal(false);
      setSelectedTile(null);
    }
  };

  const getTileClass = (row: number, col: number): string => {
    const color = tileColors[row][col];
    const hasLetter = guesses[row][col];
    
    let classes = 'tile';
    
    // Only show color if there's a letter AND a color is selected
    if (hasLetter && color) {
      classes += ` ${color}`;
    } else if (hasLetter && !color) {
      // Default gray for tiles with letters but no color selected
      classes += ' absent';
    }
    
    return classes;
  };

  return (
    <>
      <div className="wordle-grid">
        {Array.from({ length: 6 }, (_, row) => (
          <div key={row} className="grid-row">
            {Array.from({ length: 5 }, (_, col) => (
              <div 
                key={col} 
                className={getTileClass(row, col)}
                onClick={() => handleTileClick(row, col)}
                style={{ cursor: guesses[row][col] ? 'pointer' : 'default' }}
              >
                {guesses[row][col] || ''}
              </div>
            ))}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="color-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="color-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Select Color</h3>
            <div className="color-options">
              <button 
                className="color-option gray" 
                onClick={() => selectColor('absent')}
              >
                Gray
              </button>
              <button 
                className="color-option yellow" 
                onClick={() => selectColor('present')}
              >
                Yellow
              </button>
              <button 
                className="color-option green" 
                onClick={() => selectColor('correct')}
              >
                Green
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WordleGrid;
