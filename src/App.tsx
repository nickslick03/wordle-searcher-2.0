import { useState, useEffect } from 'react';
import './App.css';
import WordleGrid from './components/WordleGrid';
import Keyboard from './components/Keyboard';
import ResultsModal from './components/ResultsModal';
import type { GameState, LetterState } from './types/gameTypes';
import { useWordList } from './hooks/useWordList';
import { word_filter } from './utils/wordFilter';

function App() {
  const { allWords, wordSet, isLoading } = useWordList();
  const [gameState, setGameState] = useState<GameState>({
    currentRow: 0,
    currentCol: 0,
    guesses: Array(6).fill('').map(() => Array(5).fill('')),
    gameOver: false,
    won: false,
    targetWord: 'REACT' // This won't be used in the searcher
  });
  const [validationError, setValidationError] = useState<string>('');
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [tileColors, setTileColors] = useState<(LetterState | null)[][]>(
    Array(6).fill(null).map(() => Array(5).fill(null))
  );

  const validateWords = (): { isValid: boolean; errorMessage: string } => {
    const completeWords: string[] = [];
    
    // Check if all words are complete
    for (let row = 0; row < 6; row++) {
      const word = gameState.guesses[row].join('');
      
      if (word.length > 0 && word.length < 5) {
        return {
          isValid: false,
          errorMessage: `Complete the word "${word.toUpperCase()}"`
        };
      }
      if (word.length === 5) {
        completeWords.push(word);
      }
    }

    // Check if all complete words are valid
    for (const word of completeWords) {
      if (!wordSet.has(word.toLowerCase())) {
        return {
          isValid: false,
          errorMessage: `"${word.toUpperCase()}" is not a valid word`
        };
      }
    }

    return { isValid: true, errorMessage: '' };
  };

  const performSearch = () => {
    const completeWords: string[] = [];
    const wordColors: number[][] = [];
    
    // Get all complete words and their colors
    for (let row = 0; row < 6; row++) {
      const word = gameState.guesses[row].join('');
      if (word.length === 5) {
        completeWords.push(word);
        // Get colors for this word from WordleGrid
        const colors = getWordColors(row);
        wordColors.push(colors);
      }
    }

    if (completeWords.length === 0) {
      setValidationError('Please enter at least one word');
      return;
    }

    // Filter words step by step
    let filteredWords = [...allWords];
    
    for (let i = 0; i < completeWords.length; i++) {
      const searchWord = completeWords[i].toLowerCase();
      const colors = wordColors[i];
      
      filteredWords = word_filter(filteredWords, searchWord, colors);
    }

    setSearchResults(filteredWords);
    setShowResults(true);
  };

  const getWordColors = (row: number): number[] => {
    const colors: number[] = [];
    for (let col = 0; col < 5; col++) {
      const color = tileColors[row][col];
      if (color === 'absent') colors.push(0);
      else if (color === 'present') colors.push(1);
      else if (color === 'correct') colors.push(2);
      else colors.push(0); // Default to gray if no color set
    }
    return colors;
  };

  const handleKeyPress = (key: string) => {
    // Clear validation error when user makes changes
    if (validationError) {
      setValidationError('');
    }

    if (key === 'ENTER') {
      // Always validate when search is pressed, regardless of current position
      const validation = validateWords();
      if (!validation.isValid) {
        setValidationError(validation.errorMessage);
        return;
      }
      performSearch();
    } else if (key === 'BACKSPACE') {
      if (gameState.currentCol > 0) {
        const newGuesses = [...gameState.guesses];
        newGuesses[gameState.currentRow][gameState.currentCol - 1] = '';
        setGameState(prev => ({
          ...prev,
          guesses: newGuesses,
          currentCol: prev.currentCol - 1
        }));
      } else if (gameState.currentRow > 0) {
        // If at beginning of current row, go back to previous row
        const prevRow = gameState.currentRow - 1;
        const prevRowGuesses = gameState.guesses[prevRow];
        const lastFilledCol = prevRowGuesses.findIndex(letter => letter === '');
        const targetCol = lastFilledCol === -1 ? 5 : lastFilledCol;
        
        setGameState(prev => ({
          ...prev,
          currentRow: prevRow,
          currentCol: targetCol
        }));
      }
    } else if (gameState.currentCol < 5 && /^[A-Z]$/.test(key)) {
      const newGuesses = [...gameState.guesses];
      newGuesses[gameState.currentRow][gameState.currentCol] = key;
      setGameState(prev => ({
        ...prev,
        guesses: newGuesses,
        currentCol: prev.currentCol + 1
      }));
      
      // Auto-advance to next row if word is complete
      if (gameState.currentCol === 4) {
        setTimeout(() => {
          if (gameState.currentRow < 5) {
            setGameState(prev => ({
              ...prev,
              currentRow: prev.currentRow + 1,
              currentCol: 0
            }));
          }
        }, 100);
      }
    }
  };

  useEffect(() => {
    const handlePhysicalKeyPress = (event: KeyboardEvent) => {
      const key = event.key.toUpperCase();
      if (key === 'ENTER' || key === 'BACKSPACE' || /^[A-Z]$/.test(key)) {
        event.preventDefault();
        handleKeyPress(key);
      }
    };

    window.addEventListener('keydown', handlePhysicalKeyPress);
    return () => window.removeEventListener('keydown', handlePhysicalKeyPress);
  }, [gameState, validationError]);

  const resetGame = () => {
    setGameState({
      currentRow: 0,
      currentCol: 0,
      guesses: Array(6).fill('').map(() => Array(5).fill('')),
      gameOver: false,
      won: false,
      targetWord: 'REACT'
    });
    setValidationError('');
    setShowResults(false);
    setSearchResults([]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Wordle Searcher</h1>
      </header>
      
      <main className="game-container">
        {isLoading && (
          <div className="loading">Loading word list...</div>
        )}
        
        <WordleGrid 
          guesses={gameState.guesses}
          currentRow={gameState.currentRow}
          currentCol={gameState.currentCol}
          targetWord={gameState.targetWord}
          onTileColorsChange={setTileColors}
        />
        
        {validationError && (
          <div className="validation-error">
            {validationError}
          </div>
        )}
        
        <div className="controls">
          <button onClick={resetGame} className="reset-button">
            Clear All
          </button>
        </div>
        
        <Keyboard 
          onKeyPress={handleKeyPress}
          letterStates={{}}
        />
      </main>

      <ResultsModal
        isOpen={showResults}
        onClose={() => setShowResults(false)}
        results={searchResults}
        totalWords={allWords.length}
      />
    </div>
  );
}

export default App;
