const express = require("express");
const http = require("http");
const Socketio = require("socket.io");

// custom imports
const auth = require("./routes/auth");
const users = require("./routes/users");
const confirmation = require("./routes/confirmation");
const friends = require("./routes/friends");
const chats = require("./routes/chats");

const app = express();

const server = http.createServer(app);

const io = new Socketio.Server(server);

app.use(express.json());
app.use("/api/auth", auth);
app.use("/api/users", users);
app.use("/api/confirmation", confirmation);
app.use("/api/friends", friends);
app.use("/api/chats", chats);

io.on("connection", (socket) => {
  console.log(`Client connected and has id ${socket.id}`);

  socket.on("join", (room) => {
    console.log(`joined chat: ${room}`);
    socket.join(room);
  });

  socket.on("message", (data, room) => {
    console.log(`Client has sent us: ${data}`);

    if (room === "") {
      socket.broadcast.emit("message", data);
    } else {
      socket.to(room).emit("message", data);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(5000, () => {
  console.log("Listening on port 5000...");
});

// app.listen(5000, () => {
//   console.log("Listening on port 5000...");
// });
