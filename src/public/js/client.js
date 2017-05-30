'use strict';

const game = require('./game');
const socket = io();

socket.on('player-connected', () => {
    console.log(game);
    game.state.getCurrentState().addPlayer();
});
