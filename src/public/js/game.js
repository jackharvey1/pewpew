'use strict';

const config = require('../../common/config');
const game = module.exports = new Phaser.Game(
    Math.min(window.innerWidth, config.world.width),
    Math.min(window.innerHeight, config.world.height),
    Phaser.AUTO
);

const PlayState = require('./play-state');

game.state.add('play', PlayState, true);
