const isColliding = require('../../../lib/collisions');

describe('Collision detection', function () {
    const rectangle = {
        x: 0,
        y: 0,
        width: 20,
        height: 50
    };

    describe('collisions', function () {
        const scenarios = [
            {
                case: 'should detect a collision left to right',
                originX: -30,
                originY: 0,
                endX: 20,
                endY: 30
            }, {
                case: 'should detect a collision right to left',
                originX: 20,
                originY: 0,
                endX: -20,
                endY: 0
            }, {
                case: 'should detect a collision top to bottom',
                originX: 0,
                originY: 30,
                endX: 0,
                endY: -30
            }, {
                case: 'should detect a collision bottom to top',
                originX: 0,
                originY: -30,
                endX: 0,
                endY: 30
            }
        ];

        scenarios.forEach(scenario => {
            it(scenario.case, function () {
                expect(isColliding(rectangle, scenario)).to.be.true;
            });
        });
    });

    describe('non-collisions', function () {
        const scenarios = [
            {
                case: 'should not detect a collision past the left',
                originX: -30,
                originY: -30,
                endX: -30,
                endY: 30
            }, {
                case: 'should not detect a collision past the right',
                originX: 30,
                originY: -30,
                endX: 30,
                endY: 30
            }, {
                case: 'should not detect a collision over the top',
                originX: -30,
                originY: 50,
                endX: 30,
                endY: 50
            }, {
                case: 'should not detect a collision underneath',
                originX: -30,
                originY: -30,
                endX: 30,
                endY: -30
            }
        ];

        scenarios.forEach(scenario => {
            it(scenario.case, function () {
                expect(isColliding(rectangle, scenario)).to.be.false;
            });
        });
    });
});
