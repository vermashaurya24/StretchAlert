const express = require("express");
const http = require("http");
const ws = require("ws");
const schedule = require("node-schedule");

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
      userSockets.set(data.userId, socket);
      console.log("User successfully added");
      scheduleNotifications(data.userId);
    }
  });

  socket.on("close", () => {
    userSubscriptions.delete(data.userId);
    userSockets.delete(data.userId);
    console.log("User successfully removed.");
  });
});

const sendNotifications = (userId) => {
  const socket = userSockets.get(userId);
  const notificationMessage =
    "Remember to check your posture, stretch, and have some water!";
  socket.send(
    JSON.stringify({ type: "notification", message: notificationMessage })
  );
  console.log("sendNotifications() called");
};

const scheduleNotifications = (userId) => {
  const interval = userSubscriptions.get(userId);
  const job = schedule.scheduleJob(`*/${interval} * * * *`, () => {
    sendNotifications(userId);
  });
  console.log("scheduleNotifications() called");
};

server.listen(port, () => console.log(`Server running on port ${port}`));
