'use strict';

const PlayState = function () {
    return this;
};

const game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO);

let cursors,
    jumpButton;

let facing = 'left',
    jumpTimer = 0;

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

    this.player = game.add.sprite(playerWidth, playerHeight, 'player');
    this.player.animations.add('move', [0, 1], 10, true);
    game.physics.enable(this.player, Phaser.Physics.ARCADE);

    this.player.body.collideWorldBounds = true;
    this.player.body.setSize(32, 32, 5, 16);

    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
};

PlayState.prototype.update = function () {
    this.player.body.velocity.x = 0;

    if (cursors.left.isDown) {
        this.player.body.velocity.x = -velocity;

        if (facing !== 'left') {
            this.player.scale.x = 1;
            this.player.x -= playerWidth;
            this.player.animations.play('move');
            facing = 'left';
        }
    } else if (cursors.right.isDown) {
        this.player.body.velocity.x = velocity;

        if (facing !== 'right') {
            this.player.scale.x = -1;
            this.player.x += playerWidth;
            this.player.animations.play('move');
            facing = 'right';
        }
    } else if (facing !== 'idle') {
        this.player.animations.stop();
        facing = 'idle';
    }

    if (jumpButton.isDown) {
        if (this.player.body.onFloor() && game.time.now > jumpTimer) {
            this.player.body.velocity.y = -velocity * 2;
            jumpTimer = game.time.now + 750;
        }
    }
};

game.state.add('game', PlayState, true);
