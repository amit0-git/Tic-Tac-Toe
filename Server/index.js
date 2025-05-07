const express = require("express")
const http = require("http")
const socketIO = require("socket.io")
const cors = require("cors")




const app = express()
app.use(cors({ origin: 'http://localhost:5173' }));

const server = http.createServer(app)


// Set up Socket.IO with CORS options
const io = socketIO(server, {
    cors: {
        origin: 'http://localhost:5173', // Allow only this origin
        methods: ['GET', 'POST'], // Allow specific methods
        allowedHeaders: ['Content-Type'], // Allow specific headers
    },
});







io.on('connection', (socket) => {
    console.log('A user connected: ', socket.id);
  
    // Create a new game room
    socket.on('createRoom', () => {
      const roomId = Math.random().toString(36).substr(2, 5);
      socket.join(roomId);
      rooms[roomId] = {
        players: [socket.id],
        board: Array(9).fill(null),
        currentPlayer: 'X',
      };
      socket.emit('roomCreated', roomId);
    });
  
    // Join an existing game room
    socket.on('joinRoom', (roomId) => {
      const room = rooms[roomId];
      if (room && room.players.length === 1) {
        room.players.push(socket.id);
        socket.join(roomId);
        io.to(roomId).emit('gameStart', roomId, room.board, room.currentPlayer);
      } else {
        socket.emit('error', 'Room is full or does not exist');
      }
    });
  
    // Handle player moves
    socket.on('makeMove', (roomId, index) => {
      const room = rooms[roomId];
      if (room && room.players.includes(socket.id)) {
        if (room.board[index] === null) {
          room.board[index] = room.currentPlayer;
          room.currentPlayer = room.currentPlayer === 'X' ? 'O' : 'X';
          io.to(roomId).emit('boardUpdate', room.board, room.currentPlayer);
          
          const winner = checkWinner(room.board);
          if (winner) {
            io.to(roomId).emit('gameOver', winner);
            delete rooms[roomId];
          }
        }
      }
    });
  
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('A user disconnected: ', socket.id);
      // Handle removal of user from rooms if necessary
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
  

const PORT = process.env.PORT || 3000

















//start the server
server.listen(PORT, () => {
    console.log("Server started on port", PORT)
})