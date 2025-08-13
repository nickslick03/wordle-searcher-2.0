import React from 'react';
import './HelpModal.css';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="help-modal-overlay" onClick={onClose}>
      <div className="help-modal" onClick={(e) => e.stopPropagation()}>
        <div className="help-header">
          <h2>How to Use Wordle Searcher</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className="help-content">
          <div className="help-section">
            <h3>🎯 What is Wordle Searcher?</h3>
            <p>
              Wordle Searcher is a reverse Wordle tool that helps you find possible solutions 
              based on the words you've already played and their color results.
            </p>
          </div>

          <div className="help-section">
            <h3>📝 Step 1: Input Your Words</h3>
            <p>
              Type the words you played in Wordle using the keyboard. Each word will 
              automatically advance to the next row when completed.
            </p>
          </div>

          <div className="help-section">
            <h3>🎨 Step 2: Set Letter Colors</h3>
            <p>
              Click on any letter tile to set its color:
            </p>
            <table className="color-table">
                <tbody>
                    <tr>
                        <td><span className="color-example gray">Gray</span></td>
                        <td>Letter is not in the word</td>
                    </tr>
                    <tr>
                        <td><span className="color-example yellow">Yellow</span></td>
                        <td>Letter is in the word but wrong position</td>
                    </tr>
                    <tr>
                        <td><span className="color-example green">Green</span></td>
                        <td>Letter is in the correct position</td>
                    </tr>    
                </tbody>                
            </table>
          </div>

          <div className="help-section">
            <h3>🔍 Step 3: Search for Solutions</h3>
            <p>
              Click the search button (⌕) to find all possible Wordle words that match 
              your criteria. The app will filter through the official Wordle word list 
              and show you the remaining possibilities.
            </p>
          </div>

          <div className="help-section">
            <h3>💡 Tips</h3>
            <ul>
              <li>You can input up to 6 words (your full Wordle game)</li>
              <li>Only complete words (5 letters) will be used in the search</li>
              <li>Use "Clear All" to start over</li>
              <li>The search is case-insensitive</li>
            </ul>
          </div>
           
        <a href="https://github.com/nickslick03/wordle-searcher-2.0" target="_blank" rel="noopener noreferrer">Source Code</a>
        <div>
        Vibe coded by <a href="https://www.linkedin.com/in/nicholas-epps-597b94295" target="_blank" rel="noopener noreferrer">Nicholas Epps</a>    
        </div>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
