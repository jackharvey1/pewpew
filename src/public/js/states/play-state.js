const config = require('../../../config');
const utils = require('../../../common/utils');
const client = require('../client');
const scoreboard = require('../scoreboard');
const Player = require('../player');

let playerName,
    arrows,
    wasd,
    jumpButton,
    scoreboardButton;

const PlayState = function () {
    this.shots = [];
};

PlayState.prototype.init = function (name) {
    playerName = name;
};

PlayState.prototype.create = function () {
    this.player = new Player(playerName);
    this.players = {};
    this.game.camera.follow(this.player.sprite);
    this.setUpInputs();

    client.init(playerName);
    scoreboard.init();
};

PlayState.prototype.update = function () {
    this.fadeBeams();

    if (arrows.left.isDown || wasd.left.isDown) {
        this.player.moveLeft();
    } else if (arrows.right.isDown || wasd.right.isDown) {
        this.player.moveRight();
    } else {
        this.player.stop();
    }

    this.player.animateWalking();

    if (
        jumpButton.justPressed() ||
        arrows.up.justPressed() ||
        wasd.up.justPressed()
    ) {
        this.player.jump();
    }

    if (this.game.input.activePointer.leftButton.isDown) {
        this.player.fire();
    }
};

PlayState.prototype.setUpInputs = function () {
    arrows = this.game.input.keyboard.createCursorKeys();
    wasd = {
        up: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
        down: this.game.input.keyboard.addKey(Phaser.Keyboard.S),
        left: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
        right: this.game.input.keyboard.addKey(Phaser.Keyboard.D)
    };
    jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    scoreboardButton = this.game.input.keyboard.addKey(Phaser.Keyboard.Q);
    scoreboardButton.onDown.add(scoreboard.show, this);
    scoreboardButton.onUp.add(scoreboard.hide, this);
};

PlayState.prototype.addPlayer = function (playerId, playerName, coordinates) {
    const newPlayer = new Player(playerName, playerId, coordinates);

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
    const laser = this.game.add.graphics(0, 0);

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
