module.exports.world = {
    width: 4096,
    height: 2160,
    colour: 0x4488CC
};

module.exports.player = {
    width: 32,
    height: 48,
    velocity: 500,
    startingX: module.exports.world.width / 2,
    startingY: module.exports.world.height / 2
};

module.exports.shot = {
    delay: 350,
    colour: 0xFFFFFF
};

module.exports.cloud = {
    count: 10,
    width: 100,
    height: 60
};

module.exports.healthBar = {
    padding: 12,
    height: 3,
    width: module.exports.player.width
};

module.exports.nameTag = {
    padding: 22,
    fontStyling: {
        font: '9pt Tahoma',
        fill: 'white',
        boundsAlignH: 'center',
        boundsAlignV: 'middle'
    }
};

module.exports.server = {
    tickInterval: 10,
    correctionsInterval: 50,
    damageInterval: 100,
    pingInterval: 5000
};

module.exports.gravity = 1000;
