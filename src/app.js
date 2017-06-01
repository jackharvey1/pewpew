'use strict';

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const morgan = require('morgan');
const path = require('path');
const _ = require('lodash');

app.use(morgan('combined'));
app.use(express.static(path.join(__dirname, 'public')));

const gameState = {};

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/main.html'));
});

server.listen(process.env.PORT || 3000, () => {
    console.log('Listening');
});

io.on('connection', (socket) => {
    socket.emit('player-id', socket.id);
    socket.broadcast.emit('player-connected', socket.id);
    socket.on('disconnect', () => {
        io.sockets.emit('player-disconnected', socket.id);
        delete gameState[socket.id];
    });

    socket.on('client-tick', (data) => {
        gameState[socket.id] = {
            facing: data.facing,
            coordinates: data.coordinates
        };
    });
});

setInterval(() => {
    const clientIds = Object.keys(io.sockets.sockets);
    clientIds.forEach((clientId) => {
        io.to(clientId).emit('tick', _.omit(gameState, clientId));
    });
}, 20);
