'use strict';

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const morgan = require('morgan');
const path = require('path');
const logger = require('./lib/logger');
const _ = require('lodash');

const gameState = {};

app.use(morgan('combined'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/main.html'));
});

server.listen(process.env.PORT || 3000, () => {
    logger.log('Listening');
});

io.on('connection', (socket) => {
    logger.log(`${socket.id} connected`);

    socket.emit('player-id', socket.id);
    socket.emit('player-list', gameState);

    socket.broadcast.emit('player-connected', socket.id);

    socket.on('disconnect', () => {
        logger.log(`${socket.id} disconnected`);
        io.sockets.emit('player-disconnected', socket.id);
        delete gameState[socket.id];
    });

    socket.on('client-tick', (data) => {
        gameState[socket.id] = {
            facing: data.facing,
            moving: data.moving,
            velocity: data.velocity,
            coordinates: data.coordinates
        };
    });
});

(function () {
    setInterval(() => {
        _.forEach(gameState, (data, id) => {
            io.to(id).emit('tick', _.omit(gameState, id));
        });
    }, 10);

    setInterval(() => {
        _.forEach(gameState, (data, id) => {
            io.to(id).emit('client-correction', _.mapValues(gameState, 'coordinates'));
        });
    }, 50);
})();
