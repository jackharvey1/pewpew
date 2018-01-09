const config = require('../../config');

const game = module.exports = new Phaser.Game(
    Math.min(window.innerWidth, config.world.width),
    Math.min(window.innerHeight, config.world.height),
    Phaser.AUTO
);

const BootState = require('./states/boot-state');
const MenuState = require('./states/menu-state');
const PlayState = require('./states/play-state');

game.state.add('boot', BootState);
game.state.add('menu', MenuState);
game.state.add('play', PlayState);

game.state.start('boot');
