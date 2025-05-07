// src/Game.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

const Game = ({ gameMode }) => {
  const [roomId, setRoomId] = useState('');
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [player, setPlayer] = useState(null); // 'X' or 'O'
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (gameMode === 'multiplayer') {
      socket.on('roomCreated', (id) => {
        setRoomId(id);
      });

      socket.on('gameStart', (id, newBoard, currentTurn) => {
        setRoomId(id);
        setBoard(newBoard);
        setCurrentPlayer(currentTurn);
      });

      socket.on('boardUpdate', (newBoard, currentTurn) => {
        setBoard(newBoard);
        setCurrentPlayer(currentTurn);
      });

      socket.on('gameOver', (winner) => {
        setGameOver(true);
        alert(`${winner} wins!`);
      });

      socket.on('error', (message) => {
        alert(message);
      });
    }

    return () => {
      if (gameMode === 'multiplayer') {
        socket.off('roomCreated');
        socket.off('gameStart');
        socket.off('boardUpdate');
        socket.off('gameOver');
        socket.off('error');
      }
    };
  }, [gameMode]);

  const createRoom = () => {
    socket.emit('createRoom');
  };

  const joinRoom = () => {
    socket.emit('joinRoom', roomId);
  };

  const handleClick = (index) => {
    if (board[index] || gameOver) return; // Prevent clicking on already filled cells
    if (gameMode === 'multiplayer') {
      socket.emit('makeMove', roomId, index);
    } else {
      // Handle solo game move
      handleSoloMove(index);
    }
  };

  const handleSoloMove = (index) => {
    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    const winner = checkWinner(newBoard);
    if (winner) {
      setGameOver(true);
      alert(`${winner} wins!`);
      return;
    }

    // Switch to the other player and let the "AI" play
    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    setTimeout(() => {
      makeAIMove();
    }, 1000);
  };

  const makeAIMove = () => {
    // Basic AI: pick the first available empty spot
    const emptyIndices = board
      .map((value, index) => value === null ? index : null)
      .filter(index => index !== null);
    const randomMove = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    handleSoloMove(randomMove);
  };

  const checkWinner = (board) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6],             // diagonals
    ];
    for (let line of lines) {
      const [a, b, c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a]; // return 'X' or 'O'
      }
    }
    return null;
  };

  const renderCell = (index) => {
    return (
      <button className="cell" onClick={() => handleClick(index)}>
        {board[index]}
      </button>
    );
  };

  return (
    <div className="game">
      {gameMode === 'multiplayer' ? (
        !roomId ? (
          <>
            <button onClick={createRoom}>Create Room</button>
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter room ID"
            />
            <button onClick={joinRoom}>Join Room</button>
          </>
        ) : (
          <>
            <h2>Room ID: {roomId}</h2>
            <h3>Current Player: {currentPlayer}</h3>
            <div className="board">
              {board.map((_, index) => renderCell(index))}
            </div>
          </>
        )
      ) : (
        <>
          <h3>Current Player: {currentPlayer}</h3>
          <div className="board">
            {board.map((_, index) => renderCell(index))}
          </div>
        </>
      )}
    </div>
  );
};

export default Game;
