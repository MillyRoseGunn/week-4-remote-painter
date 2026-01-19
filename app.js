// Import Libraries and Setup

const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);//socket io needs an http server
const { Server } = require("socket.io");
const io = new Server(server);
const port = process.env.PORT || 3000;

// Tell our Node.js Server to host our P5.JS sketch from the public folder.
app.use(express.static("public"));

// Setup Our Node.js server to listen to connections from chrome, and open chrome when it is ready
server.listen(port, () => {
  console.log("listening on: "+port);
});

let printEveryMessage = false; 

const drawingHistory = [];  //server memory, session only.
const MAX_HISTORY = 5000;

// Callback function for what to do when our P5.JS sketch connects and sends us messages
io.on("connection", (socket) => {
  console.log("a user connected");

  socket.emit("history", drawingHistory); //when a new user connects, send them the history of drawings

  // Code to run every time we get a message from front-end P5.JS
  socket.on("drawing", (data) => {
drawingHistory.push(data); //saves incoming drawing events into memory array

if(drawingHistory > MAX_HISTORY){
  drawingHistory.shift(); //if over 5000, remove oldest item in the array
}

    //do something
    socket.broadcast.emit('drawing', data);//broadcast.emit means send to everyone but the sender

    // Print it to the Console
    if (printEveryMessage) {
      console.log(data);
    }
  });
});

