const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const socketid = require('socket.io');

const publicPathDirectory = path.join(__dirname, "../public");
app.use(express.static(publicPathDirectory));

const server = http.createServer(app);
const io = socketid(server);

let count = 1;
const message = "hello everyone"

// listen event connection from server
io.on("connection", (socket) => {
    console.log("new client connected");

    // transmit count from server to client
    socket.emit("send count server to client", count);

    // get event from client
    socket.on("send increment from client to sever", () => {
        count++;
        // transmit count from server to client
        socket.emit("send count server to client", count);
    })

    //disconnect
    socket.on("disconnect", () => {
        console.log("client left server");
    })
});

const port = 8080;
server.listen(port, () => {
    console.log(`app running on http://localhost:${port}`);
});