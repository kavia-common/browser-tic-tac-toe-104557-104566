import React, { useEffect, useMemo, useState } from 'react';
import './App.css';

/**
 * Calculates the winner of a Tic Tac Toe board.
 * Returns "X" or "O" if there is a winner, "draw" if all squares filled without winner, or null otherwise.
 * @param {Array<string|null>} squares length 9 array of X/O/null
 * @returns {"X"|"O"|"draw"|null}
 */
function calculateGameStatus(squares) {
  const lines = [
    [0, 1, 2], // rows
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // cols
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // diagonals
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    const v = squares[a];
    if (v && v === squares[b] && v === squares[c]) {
      return v; // winner
    }
  }

  if (squares.every(Boolean)) {
    return 'draw';
  }

  return null;
}

/**
 * PUBLIC_INTERFACE
 * Square button for a single cell in the board.
 */
function Square({ value, onClick, disabled, highlight }) {
  /** Renders a single square of the board. */
  return (
    <button
      className={`ttt-square ${highlight ? 'highlight' : ''}`}
      onClick={onClick}
      disabled={disabled || Boolean(value)}
      aria-label={`Board square ${value ? value : 'empty'}`}
    >
      {value}
    </button>
  );
}

/**
 * PUBLIC_INTERFACE
 * The 3x3 Board component.
 */
function Board({ squares, onPlay, isXNext, winnerLine }) {
  /** Renders the 3x3 grid using Square components. */
  const renderSquare = (i) => {
    const isWinning = winnerLine?.includes(i);
    return (
      <Square
        key={i}
        value={squares[i]}
        onClick={() => onPlay(i)}
        disabled={Boolean(winnerLine)}
        highlight={isWinning}
      />
    );
  };

  return (
    <div className="ttt-board" role="grid" aria-label="Tic Tac Toe board">
      {[0, 1, 2].map((row) => (
        <div key={row} className="ttt-row" role="row">
          {[0, 1, 2].map((col) => {
            const idx = row * 3 + col;
            return renderSquare(idx);
          })}
        </div>
      ))}
    </div>
  );
}

/**
 * Determines the winner and the winning line indices if any.
 * @param {Array<string|null>} squares
 * @returns {{winner: "X"|"O"|null, line: number[]|null}}
 */
function getWinnerAndLine(squares) {
  const lines = [
    [0, 1, 2], // rows
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // cols
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // diagonals
    [2, 4, 6],
  ];
  for (const line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line };
    }
  }
  return { winner: null, line: null };
}

// PUBLIC_INTERFACE
function App() {
  /**
   * This is the main application for a browser-based Tic Tac Toe game.
   * It renders the game board, indicates the current player, shows results (win/draw),
   * and provides a restart button. Also includes a light/dark theme toggle.
   */
  const [theme, setTheme] = useState('light');
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);

  // Apply theme attribute on document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Determine winner and winning line for highlight
  const { winner, line: winnerLine } = useMemo(() => getWinnerAndLine(squares), [squares]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  /**
   * Handles a user move on a given index.
   * Ignores clicks if there is already a winner or square is filled.
   */
  const handlePlay = (index) => {
    if (squares[index] || winner) return;
    setSquares((prev) => {
      const next = [...prev];
      next[index] = isXNext ? 'X' : 'O';
      return next;
    });
    setIsXNext((prev) => !prev);
  };

  /**
   * PUBLIC_INTERFACE
   * Resets the game state to start a new match.
   */
  const resetGame = () => {
    setSquares(Array(9).fill(null));
    setIsXNext(true);
  };

  // Compute status message
  const status = useMemo(() => {
    if (winner) return `Winner: ${winner}`;
    const statusDraw = calculateGameStatus(squares) === 'draw';
    if (statusDraw) return "It's a draw!";
    return `Next player: ${isXNext ? 'X' : 'O'}`;
  }, [winner, squares, isXNext]);

  return (
    <div className="App">
      <header className="App-header">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>

        <h1 className="ttt-title">Tic Tac Toe</h1>
        <p className={`ttt-status ${winner ? 'won' : calculateGameStatus(squares) === 'draw' ? 'draw' : ''}`}>
          {status}
        </p>

        <Board
          squares={squares}
          onPlay={handlePlay}
          isXNext={isXNext}
          winnerLine={winnerLine}
        />

        <div className="ttt-controls">
          <button className="btn-reset" onClick={resetGame} aria-label="Restart game">
            ↻ Restart
          </button>
        </div>

        <footer className="ttt-footer">
          <span className="legend">
            X starts first. Click an empty square to place your mark.
          </span>
        </footer>
      </header>
    </div>
  );
}

export default App;
