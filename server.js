const express = require('express');
const app = express();
const server = app.listen(8000);
const io = require('socket.io')(server);
const path = require('path');

app.use(express.static(__dirname + "/public"));

app.get('/', function (req, res) {
    res.render('index');
});

messages = [];

class Message {
    constructor(username, messagebody) {
        this.username = username;
        this.messagebody = messagebody;
    }
}

io.on('connection', function (socket) {
    console.log('A user has connected.')

    // initialize messages
    socket.emit('initialize', messages);

    // send a message to alert others of a new user
    socket.on('username', function(username) {
        var username = username;
        var messagebody = (`${username} has joined the chat.`);
        var newMessage = new Message(username, messagebody);
        messages.push(newMessage);
        console.log(newMessage);
        socket.broadcast.emit('new_user', messages);
    });

    // a user submits a message
    socket.on('message_submit', function(newMessage) {
        var username = newMessage.username;
        var messagebody = newMessage.messagebody;
        var newMessage = new Message(username, messagebody);
        messages.push(newMessage);
        console.log(newMessage);
        io.emit('new_message', messages);
    });
});