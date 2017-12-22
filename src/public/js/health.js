const game = require('./game');
const config = require('../../config');

function Health() {
    this.points = 100;

    this.bar = game.make.graphics();
    this.bar.beginFill(this.calculateBarColour());
    this.bar.drawRect(
        config.healthBar.x,
        config.healthBar.y,
        config.healthBar.width,
        config.healthBar.height
    );
    this.bar.endFill();
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

module.exports = Health;
