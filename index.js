const express = require("express");
const http = require("http");
const ws = require("ws");
const schedule = require("node-schedule");

const app = express();
const server = http.createServer(app);
const wss = new ws.Server({ server });

app.use(express.static("./public"));

//Hash Maps to store respective data associated with each connected user
const userSubscriptions = new Map();
const userSockets = new Map();

const port = 5000;

//Websocket connection handler
wss.on("connection", (socket) => {
  socket.on("message", (message) => {
    const data = JSON.parse(message);
    if (data.type === "subscribe") {
      if (userSubscriptions.has(data.userId)) {
        throw new Error("User already exists. Try a new username");
      }
      userSubscriptions.set(data.userId, data.interval);
      userSockets.set(data.userId, socket);
      scheduleNotifications(data.userId);
    }
  });

  socket.on("close", () => {
    const userId = getUserBySocket(socket);
    userSubscriptions.delete(userId);
    userSockets.delete(userId);
  });
});

const getUserBySocket = (socket) => {
  for (const [userId, userSocket] of userSockets.entries()) {
    if (userSocket === socket) {
      return userId;
    }
  }
};

//Function to schedule and send notifications
const scheduleNotifications = (userId) => {
  const interval = userSubscriptions.get(userId);
  schedule.scheduleJob(`*/${interval} * * * *`, () => {
    const socket = userSockets.get(userId);
    const notificationMessage =
      "Remember to check your posture, stretch, and have some water!";
    socket.send(
      JSON.stringify({ type: "notification", message: notificationMessage })
    );
  });
};

//load homepage
app.get("/", (req, res) => {
  res.sendFile("./public/index.html");
});

server.listen(port, () => console.log(`Server running on port ${port}`));
