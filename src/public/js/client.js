'use strict';

const game = require('./game');
let socket;

module.exports.init = function () {
    socket = io.connect('http://localhost:3000');
    socket.on('player-id', () => {
        setupClientTick();
        receiveServerTick();
    });
};

function setupClientTick() {
    setInterval(() => {
        const player = game.state.getCurrentState().player;
        const msg = {
            facing: player.facing,
            coordinates: {
                x: player.sprite.x,
                y: player.sprite.y
            }
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
                if (data[id].facing === 'left') {
                    players[id].faceLeft();
                } else if (data[id].facing === 'right') {
                    players[id].faceRight();
                }

                players[id].facing = data[id].facing;
                players[id].sprite.x = data[id].coordinates.x;
                players[id].sprite.y = data[id].coordinates.y;
            }
        }
    });
}
