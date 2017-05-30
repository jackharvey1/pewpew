'use strict';

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const morgan = require('morgan');
const path = require('path');

app.use(morgan('combined'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/main.html'));
});

server.listen(process.env.PORT || 3000, () => {
    console.log('Listening');
});

io.on('connection', (socket) => {
    socket.broadcast.emit('player-connected');
});
