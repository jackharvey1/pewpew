const game = require('./game');
const config = require('../../config');

function Health() {
    this.points = 100;

    this.bar = game.make.graphics();
    this.updateHealthBar();
}

Health.prototype.calculateBarColour = function () {
    let redComponent = Math.round((100 - this.points) * 2.55);
    let greenComponent = Math.round(this.points * 2.55);
    redComponent = redComponent.toString(16);
    greenComponent = greenComponent.toString(16);
    redComponent = redComponent.toUpperCase();
    greenComponent = greenComponent.toUpperCase();
    return parseInt(`${redComponent}${greenComponent}00`, 16);
};

Health.prototype.updateHealthBar = function () {
    const x = -config.player.width / 2;
    const y = (-config.player.height / 2) - config.healthBar.padding;
    const width = config.healthBar.width * (this.points / 100);
    const height = config.healthBar.height;

    this.bar.clear();
    this.bar.beginFill(this.calculateBarColour());
    this.bar.drawRect(x, y, width, height);
    this.bar.endFill();
};

Health.prototype.reset = function () {
    this.points = 100;
    this.updateHealthBar();
};

module.exports = Health;
