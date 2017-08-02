'use strict';

const game = require('./game');
const config = require('../../common/config');

const Player = function (playerId) {
    this.create();

    this.id = playerId;
    this.shots = [];
    this.facing = 'left';
    this.moving = '';
    this.hasDoubleJumped = true;
};

Player.prototype.create = function () {
    const sprite = game.add.sprite(window.innerWidth - 200, window.innerHeight - config.player.height, 'player');
    sprite.animations.add('move', [0, 1], 10, true);

    game.physics.enable(sprite, Phaser.Physics.ARCADE);
    sprite.body.collideWorldBounds = true;
    sprite.body.setSize(32, 32, 5, 16);

    sprite.anchor.setTo(0.5, 0.5);

    sprite.nextFireTime = 0;

    this.sprite = sprite;
};

Player.prototype.moveLeft = function () {
    this.sprite.body.velocity.x = -config.player.velocity;

    this.animateWalking();

    this.faceLeft();
    this.moving = 'left';
};

Player.prototype.moveRight = function () {
    this.sprite.body.velocity.x = config.player.velocity;

    this.animateWalking();

    this.faceRight();
    this.moving = 'right';
};

Player.prototype.animateWalking = function () {
    if (this.sprite.body.onFloor()) {
        this.sprite.animations.play('move');
    } else {
        this.sprite.animations.stop();
        this.sprite.animations.frame = 0;
    }
};

Player.prototype.faceLeft = function () {
    if (this.facing !== 'left') {
        this.sprite.scale.x = 1;
        this.facing = 'left';
    }
};

Player.prototype.faceRight = function () {
    if (this.facing !== 'right') {
        this.sprite.scale.x = -1;
        this.facing = 'right';
    }
};

Player.prototype.jump = function () {
    if (this.sprite.body.onFloor() || !this.hasDoubleJumped) {
        this.sprite.body.velocity.y -= config.player.velocity;
        this.hasDoubleJumped = !this.hasDoubleJumped;
    }
};

Player.prototype.stop = function () {
    this.moving = '';
    this.sprite.body.velocity.x = 0;
    this.sprite.animations.frame = 0;
    this.sprite.animations.stop();
};

Player.prototype.fire = function () {
    const currentUnixTime = +(new Date());
    if (currentUnixTime > this.sprite.nextFireTime) {
        game.state.getCurrentState().createShot(this.sprite.x, this.sprite.y, currentUnixTime, this.facing);

        this.sprite.nextFireTime = currentUnixTime + config.shot.delay;

        this.shots.push({
            x: this.sprite.x,
            y: this.sprite.y,
            time: currentUnixTime,
            direction: this.facing
        });
    }
};

module.exports = Player;
