'use strict';

const _ = require('lodash');
const logger = require('./logger');

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
            gameState[socket.id] = {
                facing: data.facing,
                moving: data.moving,
                velocity: data.velocity,
                coordinates: data.coordinates
            };
        });

        socket.on('client-shot', (data) => {
            const unixTime = +(new Date());
            if (nextFireTimes[socket.id] < unixTime) {
                socket.broadcast.emit('player-shot', {
                    x: data.x,
                    y: data.y,
                    direction: data.direction
                });

                nextFireTimes[socket.id] = unixTime + 100;
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
            io.to(id).emit('client-correction', _.mapValues(gameState, 'coordinates'));
        });
    }, 50);
};
