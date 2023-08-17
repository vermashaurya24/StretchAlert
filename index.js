const express = require("express");
const http = require("http");
const ws = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new ws.Server({ server });

app.use(express.static("./public"));

const userSubscriptions = new Map();
const userSockets = new Map();

const port = 5000;

wss.on("connection", (socket) => {
  let data;
  socket.on("message", (message) => {
    data = JSON.parse(message);
    console.log(data.type);
    if (data.type === "subscribe") {
      userSubscriptions.set(data.userId, data.interval);
      userSockets.set(data.userId, data.socket);
      console.log("User successfully added");
    }
  });

  socket.on("close", () => {
    userSubscriptions.delete(data.userId);
    userSockets.delete(data.userId);
    console.log("User successfully removed.");
  });
});

server.listen(port, () => console.log(`Server running on port ${port}`));
