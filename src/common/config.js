module.exports.world = {
    width: 4096,
    height: 2160,
    colour: 0x4488CC
};

module.exports.shot = {
    delay: 200,
    fadeTime: 100,
    colour: 0xFFFFFF
};

module.exports.player = {
    width: 32,
    height: 48,
    velocity: 500
};

module.exports.healthBar = {
    padding: 12,
    height: 3,
    get x () {
        return -module.exports.player.width / 2;
    },
    get y () {
        return (-module.exports.player.height / 2) - this.padding;
    },
    get width () {
        return module.exports.player.width;
    }
};

module.exports.gravity = 1000;
