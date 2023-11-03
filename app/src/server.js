const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const socketid = require('socket.io');
const Filter = require('bad-words');

const { createMessage } = require('./utils/create-message');
const { getUserList, addUser, removeUser, getUserById } = require('./utils/user')

const publicPathDirectory = path.join(__dirname, "../public");
app.use(express.static(publicPathDirectory));

const server = http.createServer(app);
const io = socketid(server);

// listen event connection from server
io.on("connection", (socket) => {
    socket.on("join room from client to server", ({ room, username }) => {
        socket.join(room);
        //send to client has joined to room
        socket.emit("send message from server to client", createMessage(`Welcome to room chat: ${room}`, "Admin"));
        //send to clients in room expect this client has joined
        socket.broadcast.to(room).emit("send message from server to client", createMessage(`${username} has joined room ${room}`, "Admin"));
        //chat
        socket.on("send message from client to server", (textMessage, callback) => {
            const filter = new Filter();
            if (filter.isProfane(textMessage)) {
                return callback("Your message contains bad words!!!")
            }
            const user = getUserById(socket.id);
            const messages = createMessage(textMessage, user.username);

            io.to(room).emit("send message from server to client", messages);
            callback();
        })

        //share position
        socket.on("share location from client to server", ({ latitude, longitude }) => {
            const linkLocation = `https://www.google.com/maps?q=${latitude},${longitude}`
            const user = getUserById(socket.id);
            const messages = createMessage(linkLocation, user.username);
            io.to(room).emit("share location from server to client", messages)
        })

        // get user list
        const newUser = {
            id: socket.id,
            username,
            room
        }
        addUser(newUser);
        io.to(room).emit("send user list from server to client", getUserList(room))


        //disconnect
        socket.on("disconnect", () => {
            removeUser(socket.id);
            io.to(room).emit("send user list from server to client", getUserList(room))
            console.log("client left server");
        })
    })
});

const port = 8080;
server.listen(port, () => {
    console.log(`app running on http://localhost:${port}`);
});