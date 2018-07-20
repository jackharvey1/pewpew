const extrapolateOrdinate = require('../../../../src/common/utils').extrapolateOrdinate;

describe('Extrapolating ordinates', function () {
    const scenarios = [
        {
            case: 'calculates the correct ordinate with positive speed',
            expected: 100,
            currentTime: 100,
            oldOrdinate: 0,
            ordinateVelocity: 1000,
            time: 0,
            direction: 'right'
        }, {
            case: 'calculates the correct ordinate with positive speed supplied but negative direction',
            expected: -100,
            currentTime: 100,
            oldOrdinate: 0,
            ordinateVelocity: 1000,
            time: 0,
            direction: 'left'
        }, {
            case: 'calculates the correct ordinate with negative speed supplied',
            expected: -100,
            currentTime: 100,
            oldOrdinate: 0,
            ordinateVelocity: -1000,
            time: 0
        }, {
            case: 'calculates the correct ordinate with no time having passed',
            expected: 0,
            currentTime: 0,
            oldOrdinate: 0,
            ordinateVelocity: 1000,
            time: 0
        }
    ];

    scenarios.forEach(scenario => {
        it(scenario.case, function () {
            const timestampStub = sinon.useFakeTimers(scenario.currentTime);

            expect(
                extrapolateOrdinate(
                    scenario.oldOrdinate,
                    scenario.ordinateVelocity,
                    scenario.time,
                    scenario.direction
                )
            ).to.eql(scenario.expected);

            timestampStub.restore();
        });
    });
});
