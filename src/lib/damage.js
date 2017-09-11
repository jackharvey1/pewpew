const isColliding = require('../lib/collisions');
const config = require('../config');
const utils = require('../common/utils');

const sizeData = {
    width: config.player.width,
    height: config.player.height
};

const calculate = gameState =>
    new Promise(resolve => {
        const attackersAndTheirVictims = Object.values(gameState)
            .reduce((attackerVictimsMap, attackerUnderTest, i, playersArray) => {
                const victims = getVictimsOfShots(attackerUnderTest, playersArray);
                attackerVictimsMap[attackerUnderTest.id] = victims;
                return attackerVictimsMap;
            }, {});

        resolve(attackersAndTheirVictims);
    });

const getVictimsOfShots = (attacker, playersArray) =>
    attacker.shots
        .map(shot => getNearestVictimOfShot(attacker, playersArray, shot))
        .filter(Boolean)
        .map(victim => victim.id);

const getNearestVictimOfShot = (attacker, playersArray, shot) =>
    playersArray.reduce((nearestVictim, playerUnderTest) => {
        const fullPlayerData = Object.assign({}, playerUnderTest.coordinates, sizeData);

        if (attacker.id === playerUnderTest.id) {
            return nearestVictim;
        } else if (isColliding(fullPlayerData, shot)) {
            return getNearestVictim(attacker, nearestVictim, playerUnderTest);
        }

        return nearestVictim;
    }, null);


function getNearestVictim(attacker, oldVictim, newVictim) {
    if (!oldVictim) {
        return newVictim;
    }

    const newVictimDistance = utils.getLengthOfLine(
        attacker.coordinates.x,
        attacker.coordinates.y,
        newVictim.coordinates.x,
        newVictim.coordinates.y
    );

    const oldVictimDistance = utils.getLengthOfLine(
        attacker.coordinates.x,
        attacker.coordinates.y,
        oldVictim.coordinates.x,
        oldVictim.coordinates.y
    );

    return newVictimDistance < oldVictimDistance ? newVictim : oldVictim;
}

module.exports = {
    calculate,
    getVictimsOfShots,
    getNearestVictimOfShot,
    getNearestVictim
};
