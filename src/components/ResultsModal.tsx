import React from 'react';
import './ResultsModal.css';

interface ResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: string[];
  totalWords: number;
}

const ResultsModal: React.FC<ResultsModalProps> = ({ isOpen, onClose, results, totalWords }) => {
  if (!isOpen) return null;

  return (
    <div className="results-modal-overlay" onClick={onClose}>
      <div className="results-modal" onClick={(e) => e.stopPropagation()}>
        <div className="results-header">
          <h2>Search Results</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className="results-content">
          <p className="results-summary">
            Found <strong>{results.length}</strong> possible words from <strong>{totalWords}</strong> total words
          </p>
          
          {results.length > 0 ? (
            <div className="words-list">
              {results.map((word, index) => (
                <div key={index} className="word-item">
                  {word.toUpperCase()}
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <p>No words match your criteria.</p>
              <p>Try adjusting your word colors or check your spelling.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsModal;
