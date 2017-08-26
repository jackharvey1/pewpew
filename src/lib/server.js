'use strict';

const _ = require('lodash');
const logger = require('../common/logger');

const gameState = {};
const nextFireTimes = {};

module.exports.init = function (io) {
    io.on('connection', (socket) => {
        logger.log(`${socket.id} connected`);

        nextFireTimes[socket.id] = 0;
        socket.emit('server:player-id', socket.id);
        socket.emit('server:player-list', _.omit(gameState, socket.id));

        socket.broadcast.emit('server:player-connected', socket.id);

        socket.on('disconnect', () => {
            logger.log(`${socket.id} disconnected`);
            io.sockets.emit('server:player-disconnected', socket.id);
            delete gameState[socket.id];
        });

        socket.on('client:tick', (data) => {
            const currentUnixTime = +(new Date());
            gameState[socket.id] = {
                time: currentUnixTime,
                facing: data.facing,
                moving: data.moving,
                velocity: data.velocity,
                coordinates: data.coordinates
            };
        });

        socket.on('client:shot', (data) => {
            const currentUnixTime = +(new Date());
            if (nextFireTimes[socket.id] < currentUnixTime) {
                socket.broadcast.emit('server:shot', {
                    x: data.x,
                    y: data.y,
                    time: currentUnixTime,
                    direction: data.direction
                });

                nextFireTimes[socket.id] = currentUnixTime + 100;
            }
        });

        socket.on('dong', (latency) => {
            io.sockets.emit('server:player-latency', {
                id: socket.id,
                latency: latency
            });
        });
    });

    setInterval(() => {
        Object.keys(gameState).forEach((id) => {
            io.to(id).emit('server:tick', _.omit(gameState, id));
        });
    }, 10);

    setInterval(() => {
        Object.keys(gameState).forEach((id) => {
            io.to(id).emit('server:corrections', _.omit(gameState, id));
        });
    }, 50);

    setInterval(() => {
        const currentUnixTime = +(new Date());
        io.sockets.emit('ding', currentUnixTime);
    }, 5 * 1000);
};
