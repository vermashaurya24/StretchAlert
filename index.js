const exp = require("constants");
const express = require("express");
const http = require("http");
const ws = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new ws.Server({ server });

app.use(express.static("./public"));

const port = 5000;

app.use(express.json());
wss.on("connection", (ws) => {
  console.log("WebSocket connection established");

  ws.on("message", (message) => {
    console.log(`Received: ${message}`);
    ws.send(`You sent: ${message}`);
  });

  ws.on("close", () => {
    console.log("WebSocket connection closed");
  });
});

server.listen(port, () => console.log(`Server running on port ${port}`));
