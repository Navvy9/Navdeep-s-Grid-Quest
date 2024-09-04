import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Box from './Box';
import Empty from './Empty';

function App() {
  const [grid, setGrid] = useState([
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 0]
  ]);
  const [timeLeft, setTimeLeft] = useState(0); // timeLeft in seconds
  const [isGameActive, setIsGameActive] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false); // New state to track if the game has started
  const audioRef = useRef(null); // Reference to the audio element

  const findEmpty = () => {
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j] === 0) {
          return [i, j];
        }
      }
    }
    return null;
  };

  const handleClick = (i, j) => {
    if (!isGameActive) return; // Prevent clicking when the game is not active
    const [emptyRow, emptyCol] = findEmpty();

    if (
      (i === emptyRow && Math.abs(j - emptyCol) === 1) ||
      (j === emptyCol && Math.abs(i - emptyRow) === 1)
    ) {
      const newGrid = grid.map(row => [...row]);
      newGrid[emptyRow][emptyCol] = grid[i][j];
      newGrid[i][j] = 0;

      setGrid(newGrid);
    }
  };

  const startGame = () => {
    setTimeLeft(300); // 5 minutes in seconds
    setIsGameActive(true);
    setIsGameStarted(true); // Set game as started
    if (audioRef.current) {
      audioRef.current.play(); // Start playing music
    }
  };

  useEffect(() => {
    const audioElement = audioRef.current;

    if (audioElement) {
      audioElement.onerror = () => {
        console.error('Error loading audio file.');
      };
    }

    if (timeLeft > 0 && isGameActive) {
      const timer = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0 && isGameStarted) {
      setIsGameActive(false);
      setIsGameStarted(false); // Reset game started state
      if (audioRef.current) {
        audioRef.current.pause(); // Stop the music
        audioRef.current.currentTime = 0; // Reset music to start
      }
      alert('Time is up!');
    }
  }, [timeLeft, isGameActive, isGameStarted]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="App">
      <h1>Navdeep's Grid Quest</h1>
      <div className="puzzle-container">
        <div className='grid'>
          {grid.map((row, i) => (
            row.map((value, j) => (
              value === 0 ?
                <Empty key={`${i}-${j}`} /> :
                <Box key={`${i}-${j}`} value={value} onClick={() => handleClick(i, j)} />
            ))
          ))}
        </div>
        <button className="start-button" onClick={startGame} disabled={isGameActive}>
          Test Your Brain
        </button>
        {isGameActive && <div className="timer">Time Left: {formatTime(timeLeft)}</div>}
      </div>
      <audio ref={audioRef} src="/assets/music.mp3" loop />
    </div>
  );
}

export default App;
