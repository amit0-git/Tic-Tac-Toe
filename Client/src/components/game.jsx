import React, { useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';


let socket = null;

const Game = ({ mode, onResetGame }) => {

    
    const [roomId, setRoomId] = useState('');
    const [roomInput, setRoomInput] = useState('');
    const [playerName, setPlayerName] = useState('');
    const [opponentName, setOpponentName] = useState('');
    const [board, setBoard] = useState(Array(9).fill(null));
    const [currentPlayer, setCurrentPlayer] = useState('X');
    const [playerSymbol, setPlayerSymbol] = useState(mode === 'solo' ? 'X' : null);
    const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'won', 'draw'
    const [winner, setWinner] = useState(null);
    const [waiting, setWaiting] = useState(mode === 'multiplayer');
    const [statusMessage, setStatusMessage] = useState('');

    // Initialize socket connection for multiplayer mode
    useEffect(() => {
        // Only create a new socket if in multiplayer mode and no socket exists
        if (mode === 'multiplayer' && !socket) {
            try {
                // Connect to the server
                socket = io('http://localhost:3000');
                console.log('Socket connection initialized');
            } catch (error) {
                console.error('Failed to connect to socket server:', error);
                setStatusMessage('Failed to connect to game server');
            }

            // Cleanup function to disconnect socket when component unmounts
            return () => {
                if (socket) {
                    console.log('Disconnecting socket');
                    socket.disconnect();
                    socket = null;
                }
            };
        }
    }, [mode]);

    // Set up socket event listeners for multiplayer mode
    useEffect(() => {
        if (mode === 'multiplayer' && socket) {
            socket.on('roomCreated', (id) => {
                setRoomId(id);
                setStatusMessage(`Room created! Share code: ${id}`);
                setWaiting(true);
            });

            socket.on('gameStart', (id, newBoard, currentTurn, opponent) => {
                setRoomId(id);
                setBoard(newBoard);
                setCurrentPlayer(currentTurn);
                setWaiting(false);
                setOpponentName(opponent);
                setStatusMessage(`Game started against ${opponent}! ${currentTurn === playerSymbol ? 'Your' : `${opponent}'s`} turn`);
            });

            socket.on('playerAssigned', (symbol) => {
                setPlayerSymbol(symbol);
                setStatusMessage(`You are playing as ${symbol}`);
            });

            socket.on('boardUpdate', (newBoard, currentTurn) => {
                setBoard(newBoard);
                setCurrentPlayer(currentTurn);
                setStatusMessage(currentTurn === playerSymbol ?
                    `Your turn, ${playerName}` :
                    `${opponentName}'s turn`);
            });

            socket.on('gameOver', (winningPlayer) => {
                setWinner(winningPlayer);
                setGameStatus('won');
                setStatusMessage(winningPlayer === playerSymbol ?
                    `You won, ${playerName}!` :
                    `${opponentName} won!`);
            });

            socket.on('gameDraw', () => {
                setGameStatus('draw');
                setStatusMessage('Game ended in a draw!');
            });

            socket.on('opponentLeft', () => {
                setStatusMessage('Your opponent left the game');
                setGameStatus('over');
            });

            socket.on('error', (message) => {
                setStatusMessage(`Error: ${message}`);
            });

            // Store the current socket reference for cleanup
            const currentSocket = socket;

            return () => {
                // Only try to remove listeners if the socket still exists
                if (currentSocket) {
                    currentSocket.off('roomCreated');
                    currentSocket.off('gameStart');
                    currentSocket.off('playerAssigned');
                    currentSocket.off('boardUpdate');
                    currentSocket.off('gameOver');
                    currentSocket.off('gameDraw');
                    currentSocket.off('opponentLeft');
                    currentSocket.off('error');
                }
            };
        }
    }, [mode, playerSymbol]);

    // Check for winner in solo mode
    const checkWinner = useCallback((boardState) => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6],             // diagonals
        ];
        for (let line of lines) {
            const [a, b, c] = line;
            if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
                return boardState[a]; // return 'X' or 'O'
            }
        }
        return null;
    }, []);

    // Check for draw in solo mode
    const checkDraw = useCallback((boardState) => {
        return !boardState.includes(null);
    }, []);

    // Find winning move for a player (used by AI)
    const findWinningMove = useCallback((boardState, player) => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6],             // diagonals
        ];

        for (let line of lines) {
            const [a, b, c] = line;
            // Check if player can win in this line
            if (boardState[a] === player && boardState[b] === player && boardState[c] === null) return c;
            if (boardState[a] === player && boardState[c] === player && boardState[b] === null) return b;
            if (boardState[b] === player && boardState[c] === player && boardState[a] === null) return a;
        }

        return -1; // No winning move found
    }, []);

    // Make AI move in solo mode
    const makeAIMove = useCallback(() => {
        // Short delay to make it feel like the AI is "thinking"
        setTimeout(() => {
            // Don't make a move if the game is over
            if (gameStatus !== 'playing') return;

            const newBoard = [...board];

            // First, check if AI can win
            const winMove = findWinningMove(newBoard, 'O');
            if (winMove !== -1) {
                newBoard[winMove] = 'O';
                setBoard(newBoard);

                // Now properly check if this move caused a win
                const aiWinner = checkWinner([...newBoard]);
                if (aiWinner) {
                    setWinner(aiWinner);
                    setGameStatus('won');
                    return;
                }
            } else {
                // Second, block player's winning move
                const blockMove = findWinningMove(newBoard, 'X');
                if (blockMove !== -1) {
                    newBoard[blockMove] = 'O';
                } else {
                    // Try to take center if available
                    if (newBoard[4] === null) {
                        newBoard[4] = 'O';
                    } else {
                        // Otherwise, pick a random empty cell
                        const emptyIndices = newBoard
                            .map((value, index) => value === null ? index : null)
                            .filter(index => index !== null);

                        if (emptyIndices.length > 0) {
                            const randomMove = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
                            newBoard[randomMove] = 'O';
                        }
                    }
                }

                setBoard(newBoard);

                // Check if the AI won or caused a draw
                const aiWinner = checkWinner(newBoard);
                if (aiWinner) {
                    setWinner(aiWinner);
                    setGameStatus('won');
                    return;
                }
            }

            if (checkDraw(newBoard)) {
                setGameStatus('draw');
                return;
            }

            // Switch back to player's turn
            setCurrentPlayer('X');
        }, 600);
    }, [board, gameStatus, checkWinner, checkDraw, findWinningMove]);

    // Handle cell click for both modes
    const handleCellClick = (index) => {
        // Ignore clicks if cell is already filled or game is over
        if (board[index] !== null || gameStatus !== 'playing') {
            return;
        }

        if (mode === 'multiplayer') {
            // In multiplayer, only allow moves on player's turn
            if (currentPlayer !== playerSymbol) {
                setStatusMessage("It's not your turn");
                return;
            }

            // Send move to server
            socket.emit('makeMove', roomId, index);
        } else {
            // Solo mode
            const newBoard = [...board];
            newBoard[index] = 'X';
            setBoard(newBoard);

            // Check if player won or caused a draw
            const playerWinner = checkWinner(newBoard);
            if (playerWinner) {
                setWinner(playerWinner);
                setGameStatus('won');
                return;
            }

            if (checkDraw(newBoard)) {
                setGameStatus('draw');
                return;
            }

            // Switch to AI's turn
            setCurrentPlayer('O');
        }
    };

    // When AI's turn changes in solo mode, trigger AI move
    useEffect(() => {
        if (mode === 'solo' && currentPlayer === 'O' && gameStatus === 'playing') {
            makeAIMove();
        }
    }, [currentPlayer, mode, makeAIMove, gameStatus]);

    // Multiplayer room actions
    const createRoom = () => {
        if (socket && playerName.trim()) {
            socket.emit('createRoom', playerName.trim());
            setWaiting(true);
        } else if (!playerName.trim()) {
            setStatusMessage('Please enter your name first');
        }
    };

    const joinRoom = () => {
        if (socket && roomInput && playerName.trim()) {
            socket.emit('joinRoom', roomInput, playerName.trim());
            setWaiting(true);
        } else if (!playerName.trim()) {
            setStatusMessage('Please enter your name first');
        } else if (!roomInput) {
            setStatusMessage('Please enter a room code');
        }
    };

    // Reset the game
    const resetGame = () => {
        if (mode === 'solo') {
            setBoard(Array(9).fill(null));
            setCurrentPlayer('X');
            setGameStatus('playing');
            setWinner(null);
        } else {
            // For multiplayer, just go back to main menu
            if (onResetGame) onResetGame();
        }
    };

    return (
        <div className="game">
            {mode === 'multiplayer' && !roomId ? (
                <div className="multiplayer-controls">
                    <h2>Multiplayer Game</h2>

                    <div className="player-name-input">
                        <label htmlFor="player-name">Your Name:</label>
                        <input
                            id="player-name"
                            type="text"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            placeholder="Enter your name"
                        />
                    </div>

                    <button onClick={createRoom}>Create New Game</button>
                    <div>- OR -</div>
                    <input
                        className="room-input"
                        type="text"
                        value={roomInput}
                        onChange={(e) => setRoomInput(e.target.value)}
                        placeholder="Enter room code"
                    />
                    <button onClick={joinRoom}>Join Game</button>
                    {statusMessage && <div className="status-message">{statusMessage}</div>}
                    <button className="reset-button" onClick={onResetGame}>Back to Menu</button>
                </div>
            ) : (
                <>
                    {mode === 'multiplayer' && (
                        <div className="multiplayer-info">
                            <h3>Room Code: {roomId}</h3>
                            {waiting && <p>Waiting for opponent to join...</p>}
                            {playerSymbol && <p>You are playing as: {playerSymbol}</p>}
                        </div>
                    )}

                    <div className="status">
                        {gameStatus === 'playing' ? (
                            mode === 'multiplayer' ?
                                statusMessage :
                                `Current Turn: ${currentPlayer === 'X' ? 'You' : 'AI'}`
                        ) : gameStatus === 'won' ? (
                            <div className="winner">
                                {mode === 'solo' ?
                                    `${winner === 'X' ? 'You win!' : 'AI wins!'}` :
                                    `${winner === playerSymbol ? `${playerName} wins!` : `${opponentName} wins!`}`}
                            </div>
                        ) : (
                            <div className="draw">Game ended in a draw!</div>
                        )}
                    </div>

                    <div className="board">
                        {board.map((cell, index) => (
                            <button
                                key={index}
                                className={`cell ${cell}`}
                                onClick={() => handleCellClick(index)}
                                disabled={
                                    mode === 'multiplayer' &&
                                    (gameStatus !== 'playing' || currentPlayer !== playerSymbol || waiting)
                                }
                            >
                                {cell}
                            </button>
                        ))}
                    </div>

                    <button
                        className="reset-button"
                        onClick={resetGame}
                    >
                        {mode === 'solo' ? 'Reset Game' : 'Back to Menu'}
                    </button>
                </>
            )}
        </div>
    );
};

export default Game;