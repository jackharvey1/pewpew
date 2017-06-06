'use strict';

const game = require('./game');
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
    setInterval(() => {
        const player = game.state.getCurrentState().player;
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
        socket.emit('client-tick', msg);
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
        for (const id in data) {
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
            }
        }
    });

    socket.on('client-correction', (correctionData) => {
        for (const id in correctionData) {
            if (players[id]) {
                const xDiff = players[id].sprite.x - correctionData[id].x;
                const yDiff = players[id].sprite.y - correctionData[id].y;

                if (Math.abs(xDiff) > 5) {
                    players[id].sprite.x -= xDiff / 5;
                } else {
                    players[id].sprite.x = correctionData[id].x;
                }

                if (Math.abs(yDiff) > 5) {
                    players[id].sprite.y -= yDiff / 5;
                } else {
                    players[id].sprite.y = correctionData[id].y;
                }
            }
        }
    });
}
