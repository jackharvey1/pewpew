'use strict';

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const morgan = require('morgan');
const path = require('path');
const _ = require('lodash');

const gameState = {};

app.use(morgan('combined'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/main.html'));
});

server.listen(process.env.PORT || 3000, () => {
    console.log('Listening');
});

io.on('connection', (socket) => {
    socket.emit('player-id', socket.id);
    socket.emit('player-list', gameState);

    socket.broadcast.emit('player-connected', socket.id);

    socket.on('disconnect', () => {
        io.sockets.emit('player-disconnected', socket.id);
        delete gameState[socket.id];
    });

    socket.on('client-tick', (data) => {
        gameState[socket.id] = {
            facing: data.facing,
            moving: data.moving,
            coordinates: data.coordinates
        };
    });
});

(function () {
    setInterval(() => {
        const clientIds = Object.keys(io.sockets.sockets);
        clientIds.forEach((clientId) => {
            io.to(clientId).emit('tick', _.omit(gameState, clientId));
        });
    }, 20);

    setInterval(() => {
        const clientIds = Object.keys(io.sockets.sockets);
        clientIds.forEach((clientId) => {
            io.to(clientId).emit('client-correction', _.mapValues(gameState, 'coordinates'));
        });
    }, 50);
})();
