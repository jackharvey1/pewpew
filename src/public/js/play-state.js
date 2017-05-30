'use strict';

const game = require('./game');
const config = require('./config');
const Player = require('./player');

const PlayState = function () {
    this.player = new Player();
};

let cursors,
    jumpButton,
    fireButton;

PlayState.prototype.preload = function () {
    this.game.load.spritesheet('player', 'assets/player.png', config.player.width, config.player.height);
    this.game.load.image('shot', 'assets/shot.png', 16, 16);
};

PlayState.prototype.create = function () {
    this.player.create();
    this.game.stage.backgroundColor = 0x4488CC;

    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = config.gravity;

    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.Z);
};

PlayState.prototype.update = function () {
    if (cursors.left.isDown) {
        this.player.moveLeft();
    } else if (cursors.right.isDown) {
        this.player.moveRight();
    } else {
        this.player.sprite.body.velocity.x = 0;
        this.player.sprite.animations.frame = 0;
        this.player.sprite.animations.stop();
    }

    if (!this.player.sprite.body.onFloor()) {
        this.player.sprite.animations.stop();
    }

    if (jumpButton.justPressed()) {
        this.player.jump();
    }

    if (fireButton.isDown) {
        this.player.fire();
    }
};

module.exports = PlayState;
