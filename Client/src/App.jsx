import React, { useState } from 'react';
import Navbar from './components/navbar';
import Game from './components/game';
import './App.css';

function App() {
  const [gameMode, setGameMode] = useState(null); // null, 'solo', or 'multiplayer'

  const startSoloGame = () => {
    setGameMode('solo');
  };

  const startMultiplayerGame = () => {
    setGameMode('multiplayer');
  };

  const resetGame = () => {
    setGameMode(null);
  };

  return (
    <>
      <Navbar />

      <div className="App">
        {gameMode === null ? (
          <div className="game-select">
            <h2>Choose Game Mode</h2>
            <button onClick={startSoloGame}>Play Against AI</button>
            <button onClick={startMultiplayerGame}>Play With Friend</button>
          </div>
        ) : (
          <Game mode={gameMode} onResetGame={resetGame} />
        )}
      </div>
    </>
  );
}

export default App;