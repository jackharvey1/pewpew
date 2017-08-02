'use strict';

module.exports.extrapolateOrdinate = function (oldOrdinate, ordinateVelocity, time) {
    const currentUnixTime = +(new Date());
    const timeDifference = (currentUnixTime - time) / 1000;
    return oldOrdinate + (ordinateVelocity * timeDifference);
};
