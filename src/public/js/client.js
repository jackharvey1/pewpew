'use strict';

const PlayState = function () {
    return this;
};

const dimensions = {
    width: window.innerWidth,
    height: window.innerHeight
};

const game = new Phaser.Game(dimensions.width, dimensions.height, Phaser.AUTO);

let cursors,
    jumpButton,
    fireButton;

let facing,
    hasDoubleJumped = true;

const velocity = 500;
const playerWidth = 32;
const playerHeight = 48;

PlayState.prototype.preload = function () {
    this.game.load.spritesheet('player', 'assets/player.png', playerWidth, playerHeight);
    this.game.load.image('shot', 'assets/shot.png', 16, 16);
};

PlayState.prototype.create = function () {
    this.game.stage.backgroundColor = 0x4488CC;

    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = velocity * 2;

    this.player = game.add.sprite(dimensions.width - 50, dimensions.height - 50, 'player');
    this.player.animations.add('move', [0, 1], 10, true);
    game.physics.enable(this.player, Phaser.Physics.ARCADE);

    this.player.body.collideWorldBounds = true;
    this.player.body.setSize(32, 32, 5, 16);

    this.nextFireTime = 0;

    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.Z);
};

PlayState.prototype.update = function () {
    this.player.body.velocity.x = 0;

    if (cursors.left.isDown) {
        this.player.body.velocity.x = -velocity;
        this.player.animations.play('move');

        if (facing !== 'left') {
            this.player.scale.x = 1;
            this.player.x -= playerWidth;
            facing = 'left';
        }
    } else if (cursors.right.isDown) {
        this.player.body.velocity.x = velocity;
        this.player.animations.play('move');

        if (facing !== 'right') {
            this.player.scale.x = -1;
            this.player.x += playerWidth;
            facing = 'right';
        }
    } else {
        this.player.animations.frame = 0;
        this.player.animations.stop();
    }

    if (!this.player.body.onFloor()) {
        this.player.animations.stop();
    }

    if (jumpButton.justPressed()) {
        if (this.player.body.onFloor() || !hasDoubleJumped) {
            this.player.body.velocity.y -= velocity;
            hasDoubleJumped = !hasDoubleJumped;
        }
    }

    if (fireButton.isDown) {
        this.fire();
    }
};

PlayState.prototype.fire = function () {
    if (game.time.now > this.nextFireTime) {
        const bullet = game.add.sprite(playerWidth, playerHeight, 'shot');
        game.physics.enable(bullet, Phaser.Physics.ARCADE);

        bullet.body.setSize(16, 16, 5, 16);

        bullet.body.allowGravity = false;
        bullet.y = this.player.y + 12;

        if (facing === 'left') {
            bullet.x = this.player.x - (playerWidth / 2);
            bullet.body.velocity.x = -1000;
        } else {
            bullet.x = this.player.x;
            bullet.body.velocity.x = 1000;
        }

        this.nextFireTime = game.time.now + 100;
    }
};

game.state.add('game', PlayState, true);
