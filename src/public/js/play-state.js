'use strict';

const game = require('./game');
const config = require('./config');
const client = require('./client');
const Player = require('./player');

const PlayState = function () {
    return this;
};

let cursors,
    jumpButton,
    fireButton;

PlayState.prototype.init = function () {
    game.stage.disableVisibilityChange = true;
};

PlayState.prototype.preload = function () {
    this.game.load.spritesheet('player', 'assets/player.png', config.player.width, config.player.height);
    this.game.load.image('shot', 'assets/shot.png', 16, 16);
};

PlayState.prototype.create = function () {
    this.player = new Player();
    window.players = this.players = {};
    client.init();

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
        this.player.stop();
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


PlayState.prototype.addPlayer = function (playerId, coordinates) {
    const newPlayer = new Player(playerId);
    newPlayer.create();

    if (coordinates) {
        newPlayer.sprite.x = coordinates.x;
        newPlayer.sprite.y = coordinates.y;
    }

    this.players[playerId] = newPlayer;
};

PlayState.prototype.removePlayer = function (playerId) {
    this.players[playerId].sprite.destroy();
    delete this.players[playerId];
};

PlayState.prototype.createShot = function (x, y, direction) {
    const bullet = game.add.sprite(0, 0, 'shot');
    bullet.y = y;
    bullet.x = x;

    game.physics.enable(bullet, Phaser.Physics.ARCADE);
    bullet.body.setSize(16, 16, 5, 16);

    bullet.body.allowGravity = false;

    if (direction === 'left') {
        bullet.body.velocity.x = -1000;
    } else if (direction === 'right') {
        bullet.body.velocity.x = 1000;
    }
};

module.exports = PlayState;
