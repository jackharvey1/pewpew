'use strict';

const _ = require('lodash');
const logger = require('../common/logger');
const config = require('../common/config');

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
            const shots = cleanShots(data.shots);

            gameState[socket.id] = {
                time: data.time,
                shots: shots,
                facing: data.facing,
                moving: data.moving,
                velocity: data.velocity,
                coordinates: data.coordinates
            };
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

function cleanShots(shots) {
    let i = 0;
    shots.sort((x, y) => x < y ? -1 : 1);

    while (i < shots.length - 1) {
        if (shots[i + 1] - shots[i] < config.shot.delay) {
            shots.splice(i, 1);
        } else {
            i++;
        }
    }

    return shots;
}
