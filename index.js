const express = require("express");
const http = require("http");
const delay = require("delay");

const app = express();
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

const FAKE_BITCOIN_PRICE = 33333;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("Connected");
  socket.on("on-chat", (data) => {
    io.emit("user-chat", data);
  });
});

server.listen(3000, () => {
  console.log("listening on port 3000");
});

const broadcastBitcoinPrice = async () => {
  while (true) {
    const price = parseFloat(
      (FAKE_BITCOIN_PRICE + Math.random() * 400).toFixed(2)
    );
    io.emit("bitcoin-price", {
      price: price,
    });
    await delay(1000);
  }
};

broadcastBitcoinPrice()