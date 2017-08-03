'use strict';

const _ = require('lodash');
const logger = require('../common/logger');

const gameState = {};
const nextFireTimes = {};

module.exports.init = function (io) {
    io.on('connection', (socket) => {
        logger.log(`${socket.id} connected`);

        nextFireTimes[socket.id] = 0;
        socket.emit('player-id', socket.id);
        socket.emit('player-list', gameState);

        socket.broadcast.emit('player-connected', socket.id);

        socket.on('disconnect', () => {
            logger.log(`${socket.id} disconnected`);
            io.sockets.emit('player-disconnected', socket.id);
            delete gameState[socket.id];
        });

        socket.on('client-tick', (data) => {
            const currentUnixTime = +(new Date());
            gameState[socket.id] = {
                time: currentUnixTime,
                facing: data.facing,
                moving: data.moving,
                velocity: data.velocity,
                coordinates: data.coordinates
            };
        });

        socket.on('client-shot', (data) => {
            const currentUnixTime = +(new Date());
            if (nextFireTimes[socket.id] < currentUnixTime) {
                socket.broadcast.emit('player-shot', {
                    x: data.x,
                    y: data.y,
                    time: currentUnixTime,
                    direction: data.direction
                });

                nextFireTimes[socket.id] = currentUnixTime + 100;
            }
        });
    });

    setInterval(() => {
        _.forEach(gameState, (data, id) => {
            io.to(id).emit('tick', _.omit(gameState, id));
        });
    }, 10);

    setInterval(() => {
        _.forEach(gameState, (data, id) => {
            io.to(id).emit('client-correction', gameState);
        });
    }, 50);
};
