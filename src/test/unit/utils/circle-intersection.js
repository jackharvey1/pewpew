const getIntersectionWithCircle = require('../../../common/utils').getIntersectionWithCircle;

describe('Finding intersection between circle center and external point', function () {
    const scenarios = [
        {
            case: 'Intersection through the top',
            expected: {
                circleX: 5,
                circleY: 15
            },
            A: {
                centreX: 5,
                centreY: 5
            },
            B: {
                pointX: 5,
                pointY: 30
            },
            radius: 10
        }, {
            case: 'Intersection through the top right',
            expected: {
                circleX: 0,
                circleY: 0
            },
            A: {
                centreX: 5,
                centreY: 5
            },
            B: {
                pointX: 25,
                pointY: 30
            },
            radius: 10
        }, {
            case: 'Intersection through the right',
            expected: {
                circleX: 15,
                circleY: 5
            },
            A: {
                centreX: 5,
                centreY: 5
            },
            B: {
                pointX: 25,
                pointY: 5
            },
            radius: 10
        }, {
            case: 'Intersection through bottom right',
            expected: {
                circleX: 0,
                circleY: 0
            },
            A: {
                centreX: 0,
                centreY: -10
            },
            B: {
                pointX: 20,
                pointY: -20
            },
            radius: 10
        }, {
            case: 'Intersection through bottom',
            expected: {
                circleX: 0,
                circleY: -20
            },
            A: {
                centreX: 0,
                centreY: -10
            },
            B: {
                pointX: 0,
                pointY: -25
            },
            radius: 10
        }, {
            case: 'Intersection through the bottom left',
            expected: {
                circleX: 0,
                circleY: 0
            },
            A: {
                centreX: 0,
                centreY: 0
            },
            B: {
                pointX: -20,
                pointY: -10
            },
            radius: 10
        }, {
            case: 'Intersection through the left',
            expected: {
                circleX: -15,
                circleY: 10
            },
            A: {
                centreX: -5,
                centreY: 10
            },
            B: {
                pointX: -20,
                pointY: 10
            },
            radius: 10
        }, {
            case: 'Intersection through the top left',
            expected: {
                circleX: -0,
                circleY: 0
            },
            A: {
                centreX: -5,
                centreY: 10
            },
            B: {
                pointX: -20,
                pointY: 25
            },
            radius: 10
        }
    ];

    scenarios.forEach((s) => {
        it(s.case, function () {
            expect(getIntersectionWithCircle(
                s.A,
                s.B,
                s.radius
            )).to.deep.eql(s.expected);
        });
    });
});
