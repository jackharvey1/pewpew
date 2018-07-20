const game = require('./game');
const config = require('../../common/config');
const utils = require('../../common/utils');
const Health = require('./health');

const Player = function (playerName, playerId, coordinates) {
    this.id = playerId;
    this.name = playerName;
    this.kills = 0;
    this.deaths = 0;
    this.latency = 999;
    this.facing = 'left';
    this.moving = '';
    this.hasDoubleJumped = true;

    this.create(coordinates);
};

Player.prototype.create = function (coordinates) {
    const sprite = game.add.sprite(config.player.startingX, config.player.startingY, 'player');

    sprite.animations.add('move', [0, 1], 10, true);

    game.physics.enable(sprite, Phaser.Physics.ARCADE);
    sprite.body.collideWorldBounds = true;
    sprite.body.setSize(config.player.width, config.player.height, 0, 0);

    sprite.anchor.setTo(0.5, 0.5);

    sprite.nextFireTime = 0;

    this.health = new Health(this.game.make.graphics());

    const nameTagX = -config.player.width / 2;
    const nameTagY = (-config.player.height / 2) - config.nameTag.padding;
    const nameTagWidth = config.player.width;
    this.nameTag = game.add.text(0, 0, this.name, config.nameTag.fontStyling);
    this.nameTag.setTextBounds(nameTagX, nameTagY, nameTagWidth);

    sprite.addChild(this.nameTag);
    sprite.addChild(this.health.bar);

    if (coordinates) {
        sprite.x = coordinates.x;
        sprite.y = coordinates.y;
    }

    this.sprite = sprite;
};

Player.prototype.respawn = function () {
    this.sprite.x = config.player.startingX;
    this.sprite.y = config.player.startingY;
    this.health.reset();
};

Player.prototype.faceLeft = function () {
    if (this.facing !== 'left') {
        this.sprite.scale.x = 1;
        this.health.bar.scale.x = 1;
        this.nameTag.scale.x = 1;

        this.facing = 'left';
    }
};

Player.prototype.faceRight = function () {
    if (this.facing !== 'right') {
        this.sprite.scale.x = -1;
        this.health.bar.scale.x = -1;
        this.nameTag.scale.x = -1;

        this.facing = 'right';
    }
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
    const currentUnixTime = utils.timestamp();
    if (currentUnixTime > this.sprite.nextFireTime) {
        game.state.getCurrentState().createShot(
            this.sprite.x,
            this.sprite.y,
            game.input.mousePointer.worldX,
            game.input.mousePointer.worldY
        );

        this.sprite.nextFireTime = currentUnixTime + config.shot.delay;
    }
};

module.exports = Player;
