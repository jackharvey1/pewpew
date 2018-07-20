const config = require('../../common/config');

function Health(bar) {
    this.points = config.health.startingHealth;

    this.bar = bar;
    this.updateHealthBar();
}

function calculateBarColour(points) {
    let redComponent = Math.round((100 - points) * 2.55);
    let greenComponent = Math.round(points * 2.55);
    redComponent = redComponent.toString(16);
    greenComponent = greenComponent.toString(16);
    redComponent = redComponent.toUpperCase();
    greenComponent = greenComponent.toUpperCase();
    console.log(redComponent);
    console.log(greenComponent);
    return parseInt(`${redComponent}${greenComponent}00`, 16);
}

Health.prototype.updateHealthBar = function () {
    const x = -config.player.width / 2;
    const y = (-config.player.height / 2) - config.health.padding;
    const width = config.health.width * (this.points / 100);
    const height = config.health.height;

    this.bar.clear();
    this.bar.beginFill(calculateBarColour(this.points));
    this.bar.drawRect(x, y, width, height);
    this.bar.endFill();
};

Health.prototype.reset = function () {
    this.points = 100;
    this.updateHealthBar();
};

module.exports = Health;
