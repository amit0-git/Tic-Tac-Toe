const express = require("express")
const http = require("http")
const socketIO = require("socket.io")
const path = require('path'); 
const app = express()


const server = http.createServer(app)

// Set up Socket.IO with CORS options
const io = socketIO(server);



// Basic route (optional, just to verify the server is working)
app.get('/status', (req, res) => {
  res.send('Welcome to the Tic Tac Toe Game Server');
});




// Store active game rooms
const rooms = {};

io.on('connection', (socket) => {
    console.log('A user connected: ', socket.id);
  
    // Create a new game room with player name
    socket.on('createRoom', (playerName) => {
      const roomId = Math.random().toString(36).substr(2, 5);
      socket.join(roomId);
      
      // Store player name along with other room data
      rooms[roomId] = {
        players: [socket.id],
        playerNames: { [socket.id]: playerName || 'Player 1' },
        board: Array(9).fill(null),
        currentPlayer: 'X',
        playerSymbols: { [socket.id]: 'X' }
      };
      
      socket.emit('roomCreated', roomId);
      console.log(`Room created: ${roomId} by player ${playerName} (${socket.id})`);
    });
  
    // Join an existing game room with player name
    socket.on('joinRoom', (roomId, playerName) => {
      const room = rooms[roomId];
      if (room && room.players.length === 1) {
        const hostId = room.players[0];
        const hostName = room.playerNames[hostId];
        
        room.players.push(socket.id);
        room.playerNames[socket.id] = playerName || 'Player 2';
        room.playerSymbols[socket.id] = 'O';
        socket.join(roomId);
        
        // Notify both players about the game start and send opponent names
        io.to(roomId).emit('gameStart', roomId, room.board, room.currentPlayer, playerName);
        io.to(hostId).emit('gameStart', roomId, room.board, room.currentPlayer, playerName);
        io.to(socket.id).emit('gameStart', roomId, room.board, room.currentPlayer, hostName);
        
        // Tell each player which symbol they are
        socket.emit('playerAssigned', 'O');
        io.to(hostId).emit('playerAssigned', 'X');
        
        console.log(`Player ${playerName} (${socket.id}) joined room ${roomId}`);
      } else {
        socket.emit('error', 'Room is full or does not exist');
      }
    });
  
    // Handle player moves
    socket.on('makeMove', (roomId, index) => {
      const room = rooms[roomId];
      if (!room) {
        socket.emit('error', 'Room does not exist');
        return;
      }
      
      if (!room.players.includes(socket.id)) {
        socket.emit('error', 'You are not part of this game');
        return;
      }
      
      const playerSymbol = room.playerSymbols[socket.id];
      
      // Ensure it's this player's turn
      if (room.currentPlayer !== playerSymbol) {
        socket.emit('error', 'Not your turn');
        return;
      }
      
      if (room.board[index] === null) {
        room.board[index] = playerSymbol;
        room.currentPlayer = playerSymbol === 'X' ? 'O' : 'X';
        io.to(roomId).emit('boardUpdate', room.board, room.currentPlayer);
        
        const winner = checkWinner(room.board);
        if (winner) {
          io.to(roomId).emit('gameOver', winner);
          delete rooms[roomId];
        } else if (isBoardFull(room.board)) {
          io.to(roomId).emit('gameDraw');
          delete rooms[roomId];
        }
      }
    });
  
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('A user disconnected: ', socket.id);
      
      // Find and clean up any rooms this player was in
      for (const roomId in rooms) {
        const room = rooms[roomId];
        if (room.players.includes(socket.id)) {
          // Notify the other player that their opponent left
          const otherPlayerId = room.players.find(id => id !== socket.id);
          if (otherPlayerId) {
            io.to(otherPlayerId).emit('opponentLeft');
          }
          delete rooms[roomId];
          break;
        }
      }
    });
  });
  
  // Helper function to check winner
  function checkWinner(board) {
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
  }
  
  // Helper function to check if board is full (draw)
  function isBoardFull(board) {
    return !board.includes(null);
  }

const PORT = process.env.PORT || 3000







app.use(express.static(path.join(__dirname, '..', 'Client', 'dist')));



const sendIndexHtml = (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'Client', 'dist', 'index.html'))
}

// Apply the index.html handler to common client-side routes your app might use
app.get('/', sendIndexHtml)
app.get('/game', sendIndexHtml)


//start the server
server.listen(PORT, () => {
    console.log("Server started on port", PORT)
})