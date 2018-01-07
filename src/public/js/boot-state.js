const config = require('../../config');

// eslint-disable-next-line no-empty-function
function BootState() { }

BootState.prototype.preload = function () {
    this.game.stage.disableVisibilityChange = true;

    this.game.stage.backgroundColor = config.world.colour;

    this.game.world.setBounds(0, 0, config.world.width, config.world.height);
    this.game.load.spritesheet('player', 'assets/player.png', config.player.width, config.player.height);
    this.game.load.image('cloud', 'assets/cloud.png', 100, 60);

    this.game.input.mouse.capture = true;
};

BootState.prototype.create = function () {
    this.setUpCameraFollow();
    this.createClouds();
    this.instantiatePhysics();

    const shouldClearWorld = false;
    this.game.state.start('menu', shouldClearWorld);
};

BootState.prototype.setUpCameraFollow = function () {
    this.game.camera.deadzone = new Phaser.Rectangle(
        200,
        0,
        window.innerWidth - 400,
        window.innerHeight - 200
    );
};

BootState.prototype.createClouds = function () {
    for (let i = 0; i < 10; i++) {
        const x = Math.random() * this.game.world.bounds.width;
        const y = Math.random() * (this.game.world.bounds.height - 600);
        this.game.add.image(x, y, 'cloud');
    }
};

BootState.prototype.instantiatePhysics = function () {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = config.gravity;
};

module.exports = BootState;
