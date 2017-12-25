const flatten = require('lodash/flatten');
const utils = require('../common/utils');

function GameState() {
    this.players = {};
}

GameState.prototype.addPlayer = function (socketId, playerName) {
    this.players[socketId] = {
        id: socketId,
        name: playerName,
        shots: [],
        nextFireTime: 0,
        health: 100,
        kills: 0,
        deaths: 0
    };
};

GameState.prototype.handleHits = function (attackersAndTheirVictims) {
    const attackers = Object.keys(attackersAndTheirVictims);

    const fatalities = attackers.map(attackerId => {
        const victimIds = attackersAndTheirVictims[attackerId];

        return victimIds
            .map(victimId => {
                const victim = this.players[victimId];
                victim.health -= 10;

                if (victim.health <= 0) {
                    this.players[attackerId].kills += 1;
                    victim.deaths += 1;
                    victim.health = 100;
                    return victimId;
                }

                return null;
            })
            .filter(Boolean);
    });

    return flatten(fatalities);
};

GameState.prototype.updatePlayerPositionInfo = function (data, socketId) {
    const currentUnixTime = utils.timestamp();
    Object.assign(this.players[socketId], {
        time: currentUnixTime,
        facing: data.facing,
        moving: data.moving,
        velocity: data.velocity,
        coordinates: data.coordinates
    });
};

GameState.prototype.resetPlayerShots = function () {
    Object.keys(this.players)
        .forEach(player => {
            this.players[player].shots = [];
        });
};

module.exports = GameState;
