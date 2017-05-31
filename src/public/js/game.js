'use strict';

const game = module.exports = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO);

const PlayState = require('./play-state');

game.state.add('play', PlayState, true);
