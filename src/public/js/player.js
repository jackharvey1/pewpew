'use strict';

const game = require('./game');
const config = require('./config');

const Player = function (playerId) {
    this.id = playerId;
    this.facing = 'left';
    this.moving = '';
    this.hasDoubleJumped = true;
};

Player.prototype.create = function () {
    const player = game.add.sprite(window.innerWidth - 200, window.innerHeight - 200, 'player');
    player.animations.add('move', [0, 1], 10, true);

    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.collideWorldBounds = true;
    player.body.setSize(32, 32, 5, 16);

    player.nextFireTime = 0;

    this.sprite = player;
};

Player.prototype.moveLeft = function () {
    this.sprite.body.velocity.x = -config.player.velocity;

    if (this.sprite.body.onFloor()) {
        this.sprite.animations.play('move');
    }

    this.faceLeft();
    this.moving = 'left';
};

Player.prototype.moveRight = function () {
    this.sprite.body.velocity.x = config.player.velocity;

    if (this.sprite.body.onFloor()) {
        this.sprite.animations.play('move');
    }

    this.faceRight();
    this.moving = 'right';
};

Player.prototype.faceLeft = function () {
    if (this.facing !== 'left') {
        this.sprite.scale.x = 1;
        this.sprite.x -= config.player.width;
        this.facing = 'left';
    }
};

Player.prototype.faceRight = function () {
    if (this.facing !== 'right') {
        this.sprite.scale.x = -1;
        this.sprite.x += config.player.width;
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
    if (game.time.now > this.sprite.nextFireTime) {
        const bullet = game.add.sprite(0, 0, 'shot');
        game.physics.enable(bullet, Phaser.Physics.ARCADE);

        bullet.body.setSize(16, 16, 5, 16);

        bullet.body.allowGravity = false;
        bullet.y = this.sprite.y + 12;

        if (this.facing === 'left') {
            bullet.x = this.sprite.x - (config.player.width / 2);
            bullet.body.velocity.x = -1000;
        } else {
            bullet.x = this.sprite.x;
            bullet.body.velocity.x = 1000;
        }

        this.sprite.nextFireTime = game.time.now + 100;
    }
};

module.exports = Player;
