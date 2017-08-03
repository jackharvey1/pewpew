'use strict';

const game = require('./game');
const utils = require('./utils');
const config = require('../../common/config');
const client = require('./client');
const scoreboard = require('./scoreboard');
const Player = require('./player');

const PlayState = function () {
    return this;
};

let cursors,
    jumpButton,
    fireButton,
    scoreboardButton;

PlayState.prototype.preload = function () {
    this.game.stage.disableVisibilityChange = true;
    this.game.world.setBounds(0, 0, config.world.width, config.world.height);
    this.game.load.spritesheet('player', 'assets/player.png', config.player.width, config.player.height);
    this.game.load.image('cloud', 'assets/cloud.png', 100, 60);
    this.game.load.image('shot', 'assets/shot.png', config.shot.diameter, config.shot.diameter);

    scoreboard.init();
};

PlayState.prototype.create = function () {
    this.player = new Player();
    this.players = {};

    this.game.camera.follow(this.player.sprite);
    this.game.camera.deadzone = new Phaser.Rectangle(
        200,
        0,
        window.innerWidth - 400,
        window.innerHeight - 200
    );

    client.init();

    this.game.stage.backgroundColor = 0x4488CC;

    for (let i = 0; i < 10; i++) {
        const x = Math.random() * this.game.world.bounds.width;
        const y = Math.random() * (this.game.world.bounds.height - 600);
        this.game.add.image(x, y, 'cloud');
    }

    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = config.gravity;

    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.Z);
    scoreboardButton = game.input.keyboard.addKey(Phaser.Keyboard.Q);
    scoreboardButton.onDown.add(scoreboard.show, this);
    scoreboardButton.onUp.add(scoreboard.hide, this);
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

    scoreboard.addPlayer(playerId);
};

PlayState.prototype.removePlayer = function (playerId) {
    this.players[playerId].sprite.destroy();
    delete this.players[playerId];
    scoreboard.removePlayer(playerId);
};

PlayState.prototype.createShot = function (x, y, time, direction) {
    const bullet = game.add.sprite(0, 0, 'shot');
    bullet.x = utils.extrapolateOrdinate(x, config.shot.velocity, time);
    bullet.y = utils.extrapolateOrdinate(y, 0, time);

    game.physics.enable(bullet, Phaser.Physics.ARCADE);
    bullet.anchor.setTo(0.5, 0.5);
    bullet.body.setSize(config.shot.diameter, config.shot.diameter);

    bullet.body.allowGravity = false;

    if (direction === 'left') {
        bullet.body.velocity.x = -config.shot.velocity;
    } else if (direction === 'right') {
        bullet.body.velocity.x = config.shot.velocity;
    }
};

module.exports = PlayState;
