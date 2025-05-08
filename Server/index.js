const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);

const io = socketIO(server, {
  cors: {
    origin: "http://localhost:5173", // adjust if needed
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.get("/status", (req, res) => {
  res.send("Welcome to the Tic Tac Toe Game Server");
});

const rooms = {};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("createRoom", (playerName) => {
    const roomId = Math.random().toString(36).substr(2, 5);
    socket.join(roomId);

    rooms[roomId] = {
      players: [{ id: socket.id, wantsRematch: false }],
      playerNames: { [socket.id]: playerName || "Player 1" },
      board: Array(9).fill(null),
      currentTurn: "X",
      playerSymbols: { [socket.id]: "X" }
    };

    socket.emit("roomCreated", roomId);
    console.log(`Room created: ${roomId} by player ${playerName} (${socket.id})`);
  });

  socket.on("joinRoom", (roomId, playerName) => {
    const room = rooms[roomId];
    if (room && room.players.length === 1) {
      const host = room.players[0];
      const hostName = room.playerNames[host.id];

      room.players.push({ id: socket.id, wantsRematch: false });
      room.playerNames[socket.id] = playerName || "Player 2";
      room.playerSymbols[socket.id] = "O";
      socket.join(roomId);

      io.to(roomId).emit("gameStart", roomId, room.board, room.currentTurn, playerName);
      io.to(host.id).emit("gameStart", roomId, room.board, room.currentTurn, playerName);
      io.to(socket.id).emit("gameStart", roomId, room.board, room.currentTurn, hostName);

      socket.emit("playerAssigned", "O");
      io.to(host.id).emit("playerAssigned", "X");

      console.log(`Player ${playerName} (${socket.id}) joined room ${roomId}`);
    } else {
      socket.emit("error", "Room is full or does not exist");
    }
  });

  socket.on("makeMove", (roomId, index) => {
    const room = rooms[roomId];
    if (!room) return socket.emit("error", "Room does not exist");

    const player = room.players.find(p => p.id === socket.id);
    if (!player) return socket.emit("error", "You are not part of this game");

    const symbol = room.playerSymbols[socket.id];
    if (room.currentTurn !== symbol) return socket.emit("error", "Not your turn");

    if (room.board[index] === null) {
      room.board[index] = symbol;
      room.currentTurn = symbol === "X" ? "O" : "X";
      io.to(roomId).emit("boardUpdate", room.board, room.currentTurn);

      const winner = checkWinner(room.board);
      if (winner) {
        io.to(roomId).emit("gameOver", winner);
      } else if (isBoardFull(room.board)) {
        io.to(roomId).emit("gameDraw");
      }
    }
  });

  socket.on("requestRematch", (roomId) => {
    const room = rooms[roomId];
    if (!room) return;

    const player = room.players.find(p => p.id === socket.id);
    if (player) {
      player.wantsRematch = true;
      socket.to(roomId).emit("rematchRequested");
    }

    const allWantRematch = room.players.length === 2 && room.players.every(p => p.wantsRematch);
    if (allWantRematch) {
      room.board = Array(9).fill(null);
      room.currentTurn = "X";
      room.players.forEach(p => p.wantsRematch = false);

      io.to(roomId).emit("rematchConfirmed", room.board, room.currentTurn);
    }
  });

  socket.on("acceptRematch", (roomId) => {
    const room = rooms[roomId];
    if (!room) return;

    room.board = Array(9).fill(null);
    room.currentTurn = "X";
    room.players.forEach(p => p.wantsRematch = false);

    io.to(roomId).emit("rematchConfirmed", room.board, room.currentTurn);
  });

  socket.on("leaveRoom", (roomId) => {
    const room = rooms[roomId];
    if (!room) return;

    socket.to(roomId).emit("opponentLeft");

    room.players = room.players.filter(p => p.id !== socket.id);
    delete room.playerNames[socket.id];
    delete room.playerSymbols[socket.id];

    if (room.players.length === 0) {
      delete rooms[roomId];
    }

    socket.leave(roomId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    for (const roomId in rooms) {
      const room = rooms[roomId];
      if (room.players.some(p => p.id === socket.id)) {
        socket.to(roomId).emit("opponentLeft");

        room.players = room.players.filter(p => p.id !== socket.id);
        delete room.playerNames[socket.id];
        delete room.playerSymbols[socket.id];

        if (room.players.length === 0) {
          delete rooms[roomId];
        }
        break;
      }
    }
  });
});

// Helper functions
function checkWinner(board) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (let [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

function isBoardFull(board) {
  return !board.includes(null);
}

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "..", "Client", "dist")));
const sendIndexHtml = (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "Client", "dist", "index.html"));
};

app.get("/", sendIndexHtml);
app.get("/game", sendIndexHtml);

server.listen(PORT, () => {
  console.log("Server started on port", PORT);
});
