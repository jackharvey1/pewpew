module.exports.world = {
    width: 4096,
    height: 2160,
    colour: 0x4488CC
};

module.exports.shot = {
    delay: 100,
    colour: 0xFFFFFF
};

module.exports.player = {
    width: 32,
    height: 48,
    velocity: 500,
    startingX: module.exports.world.width / 2,
    startingY: module.exports.world.height / 2
};

module.exports.healthBar = {
    padding: 12,
    height: 3,
    width: module.exports.player.width
};

module.exports.server = {
    tickInterval: 10,
    correctionsInterval: 50,
    damageInterval: 100,
    pingInterval: 5000
};

module.exports.gravity = 1000;
