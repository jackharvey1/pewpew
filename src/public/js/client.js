'use strict';

const game = require('./game');
const utils = require('./utils');
let socket;

module.exports.init = function () {
    socket = io.connect('http://localhost:3000');
    const state = game.state.getCurrentState();

    socket.on('player-list', (gameState) => {
        Object.keys(gameState).forEach((playerId) => {
            state.addPlayer(playerId, gameState[playerId].coordinates);
        });
    });

    socket.on('player-id', (playerId) => {
        state.player.id = playerId;
        setupClientTick();
        receiveServerTick();
    });
};

function setupClientTick() {
    const player = game.state.getCurrentState().player;

    setInterval(() => {
        const currentUnixTime = +(new Date());
        const msg = {
            time: currentUnixTime,
            shots: player.shots,
            coordinates: {
                x: player.sprite.x,
                y: player.sprite.y
            },
            velocity: {
                x: player.sprite.body.velocity.x || 0,
                y: player.sprite.body.velocity.y || 0
            },
            facing: player.facing,
            moving: player.moving
        };

        socket.emit('client-tick', msg);
        player.shots = [];
    }, 10);
}

function receiveServerTick() {
    const state = game.state.getCurrentState();
    const players = state.players;

    socket.on('player-connected', (playerId) => {
        state.addPlayer(playerId);
    });

    socket.on('player-disconnected', (playerId) => {
        state.removePlayer(playerId);
    });

    socket.on('tick', (data) => {
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

            data[id].shots.forEach((shot) => {
                state.createShot(shot.x, shot.y, shot.time, shot.direction);
            });
        });
    });

    socket.on('client-correction', (correctionData) => {
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
    socket.emit('client-shot', { x, y, direction });
};
