const config = require('../../config');

const game = module.exports = new Phaser.Game(
    Math.min(window.innerWidth, config.world.width),
    Math.min(window.innerHeight, config.world.height),
    Phaser.AUTO
);

const BootState = require('./boot-state');
const MenuState = require('./menu-state');
const PlayState = require('./play-state');

game.state.add('boot', BootState);
game.state.add('menu', MenuState);
game.state.add('play', PlayState);

game.state.start('boot');
