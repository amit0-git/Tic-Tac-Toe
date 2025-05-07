import React, { useState } from 'react'
import Navbar from './components/navbar'
import Game from './components/game'
function App() {
  const [gameMode, setGameMode] = useState(null); // null, 'solo', or 'multiplayer'

  const startSoloGame = () => {
    setGameMode('solo');
  };

  const startMultiplayerGame = () => {
    setGameMode('multiplayer');
  };
  return (
    <>
      <Navbar></Navbar>


      <div className="App">

        {gameMode === null ? (
          <div>
            <button onClick={startSoloGame}>Solo Game</button>
            <button onClick={startMultiplayerGame}>Multiplayer Game</button>
          </div>
        ) : (
          <Game mode={gameMode} />
        )}
      </div>
    </>
  )
}

export default App