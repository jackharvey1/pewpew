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
            moving: player.moving
        };
        socket.emit('client-tick', msg);
    }, 20);
}

function receiveServerTick() {
    const state = game.state.getCurrentState();
    socket.on('player-connected', (playerId) => {
        state.addPlayer(playerId);
    });

    socket.on('player-disconnected', (playerId) => {
        state.removePlayer(playerId);
    });

    socket.on('tick', (data) => {
        const players = game.state.getCurrentState().players;
        for (const id in data) {
            if (players[id]) {
                if (data[id].moving === 'left') {
                    players[id].moveLeft();
                } else if (data[id].moving === '') {
                    players[id].stop();
                } else if (data[id].moving === 'right') {
                    players[id].moveRight();
                }

                players[id].facing = data[id].facing;
            }
        }
    });
}
