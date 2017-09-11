const game = require('./game');
const config = require('../../config');
const utils = require('../../common/utils');
const client = require('./client');
const scoreboard = require('./scoreboard');
const Player = require('./player');

const PlayState = function () {
    this.shots = [];
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
    this.game.stage.backgroundColor = config.world.colour;

    setUpCameraFollow.call(this);
    client.init();
    createClouds.call(this);
    instantiatePhysics.call(this);
    setUpInputs.call(this);
};

function setUpCameraFollow() {
    this.game.camera.follow(this.player.sprite);
    this.game.camera.deadzone = new Phaser.Rectangle(
        200,
        0,
        window.innerWidth - 400,
        window.innerHeight - 200
    );
}

function createClouds() {
    for (let i = 0; i < 10; i++) {
        const x = Math.random() * this.game.world.bounds.width;
        const y = Math.random() * (this.game.world.bounds.height - 600);
        this.game.add.image(x, y, 'cloud');
    }
}

function instantiatePhysics() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = config.gravity;
}

function setUpInputs() {
    cursors = this.game.input.keyboard.createCursorKeys();
    jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    fireButton = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
    scoreboardButton = this.game.input.keyboard.addKey(Phaser.Keyboard.Q);
    scoreboardButton.onDown.add(scoreboard.show, this);
    scoreboardButton.onUp.add(scoreboard.hide, this);
}

PlayState.prototype.update = function () {
    this.fadeBeams();

    if (cursors.left.isDown) {
        this.player.moveLeft();
    } else if (cursors.right.isDown) {
        this.player.moveRight();
    } else {
        this.player.stop();
    }

    this.player.animateWalking();

    if (jumpButton.justPressed()) {
        this.player.jump();
    }

    if (fireButton.isDown) {
        this.player.fire();
    }
};

PlayState.prototype.addPlayer = function (playerId, coordinates) {
    const newPlayer = new Player(playerId);

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

PlayState.prototype.createShot = function (playerX, playerY, mouseX, mouseY) {
    const playerPoint = {
        centreX: playerX,
        centreY: playerY
    };
    const mousePoint = {
        pointX: mouseX,
        pointY: mouseY
    };

    const { circleX, circleY } = utils.getIntersectionWithCircle(
        playerPoint,
        mousePoint,
        config.player.height
    );

    const { edgeX, edgeY } = utils.getIntersectionWithWorldEdge(
        { centreX: circleX, centreY: circleY },
        mousePoint,
        {
            worldWidth: config.world.width,
            worldHeight: config.world.height
        }
    );

    this.drawShot(circleX, circleY, edgeX, edgeY);

    client.transmitShot(circleX, circleY, edgeX, edgeY);
};

PlayState.prototype.drawShot = function (circleX, circleY, edgeX, edgeY) {
    const laser = game.add.graphics(0, 0);

    laser.lineStyle(1, config.shot.colour, 1);
    laser.moveTo(circleX, circleY);
    laser.lineTo(edgeX, edgeY);

    this.shots.push(laser);
};

PlayState.prototype.fadeBeams = function () {
    this.shots.forEach(shot => {
        shot.alpha -= 0.1;
    });

    this.shots = this.shots.filter(shot => shot.alpha > 0);
};

module.exports = PlayState;
