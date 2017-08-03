'use strict';

const game = require('./game');
const utils = require('./utils');
const scoreboard = require('./scoreboard');
let socket;

module.exports.init = function () {
    socket = io.connect('http://localhost:3000');
    const state = game.state.getCurrentState();

    socket.on('server:player-list', (gameState) => {
        Object.keys(gameState).forEach((playerId) => {
            state.addPlayer(playerId, gameState[playerId].coordinates);
        });
    });

    socket.on('server:player-id', (playerId) => {
        state.player.id = playerId;
        scoreboard.addPlayer(playerId);
        setupClientTick();
        receiveServerTick();
    });
};

function setupClientTick() {
    const player = game.state.getCurrentState().player;

    setInterval(() => {
        const msg = {
            facing: player.facing,
            moving: player.moving,
            velocity: {
                x: player.sprite.body.velocity.x || 0,
                y: player.sprite.body.velocity.y || 0
            },
            coordinates: {
                x: player.sprite.x,
                y: player.sprite.y
            }
        };
        socket.emit('client:tick', msg);
    }, 10);
}

function receiveServerTick() {
    const state = game.state.getCurrentState();
    const players = state.players;

    socket.on('server:player-connected', (playerId) => {
        state.addPlayer(playerId);
    });

    socket.on('server:player-disconnected', (playerId) => {
        scoreboard.removePlayer(playerId);
        state.removePlayer(playerId);
    });

    socket.on('server:tick', (data) => {
        Object.keys(data).forEach((id) => {
            if (players[id]) {
                players[id].sprite.body.velocity.x = data[id].velocity.x;
                players[id].sprite.body.velocity.y = data[id].velocity.y;

                if (data[id].facing === 'left') {
                    players[id].faceLeft();
                } else if (data[id].facing === 'right') {
                    players[id].faceRight();
                }

                if (data[id].moving === 'left') {
                    players[id].moveLeft();
                } else if (data[id].moving === '') {
                    players[id].stop();
                } else if (data[id].moving === 'right') {
                    players[id].moveRight();
                }
            } else {
                state.removePlayer(id);
            }
        });
    });

    socket.on('server:shot', (data) => {
        state.createShot(data.x, data.y, data.time, data.direction);
    });

    socket.on('server:corrections', (correctionData) => {
        Object.keys(correctionData).forEach((id) => {
            if (players[id]) {
                const xDiff = players[id].sprite.x - correctionData[id].coordinates.x;
                const yDiff = players[id].sprite.y - correctionData[id].coordinates.y;
                const xDiffCritical = Math.abs(xDiff) > 10;
                const yDiffCritical = Math.abs(yDiff) > 10;

                if (xDiffCritical) {
                    players[id].sprite.x = utils.extrapolateOrdinate(
                        correctionData[id].coordinates.x,
                        correctionData[id].velocity.x,
                        correctionData[id].time
                    );
                } else {
                    players[id].sprite.x -= xDiff / 5;
                }

                if (yDiffCritical) {
                    players[id].sprite.y = utils.extrapolateOrdinate(
                        correctionData[id].coordinates.y,
                        correctionData[id].velocity.y,
                        correctionData[id].time
                    );
                } else {
                    players[id].sprite.y -= yDiff / 5;
                }
            }
        });
    });
}

module.exports.transmitShot = function (x, y, direction) {
    socket.emit('client:shot', { x, y, direction });
};
