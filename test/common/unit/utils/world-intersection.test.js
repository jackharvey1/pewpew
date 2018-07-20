const getIntersectionWithWorldEdge = require('../../../../src/common/utils').getIntersectionWithWorldEdge;

describe('Finding line intersection with world', function () {
    const world = {
        worldWidth: 4096,
        worldHeight: 2160
    };

    const positiveGradients = [
        {
            case: 'Positive line gradient that intersects at the top',
            expected: {
                edgeX: 3200,
                edgeY: 2160
            },
            A: {
                centreX: 1500,
                centreY: 800
            },
            B: {
                pointX: 2000,
                pointY: 1200
            },
            world
        }, {
            case: 'Positive line gradient that intersects at the right',
            expected: {
                edgeX: 4096,
                edgeY: 1219.2
            },
            A: {
                centreX: 2000,
                centreY: 800
            },
            B: {
                pointX: 3000,
                pointY: 1000
            },
            world
        }, {
            case: 'Positive line gradient that intersects at the bottom',
            expected: {
                edgeX: 1000,
                edgeY: 0
            },
            A: {
                centreX: 2200,
                centreY: 1200
            },
            B: {
                pointX: 1800,
                pointY: 800
            },
            world
        }, {
            case: 'Positive line gradient that intersects at the left',
            expected: {
                edgeX: 0,
                edgeY: 600
            },
            A: {
                centreX: 2000,
                centreY: 1000
            },
            B: {
                pointX: 1000,
                pointY: 800
            },
            world
        }
    ];

    const negativeGradients = [
        {
            case: 'Negative line gradient that intersects at the top',
            expected: {
                edgeX: 1536,
                edgeY: 2160
            },
            A: {
                centreX: 2000,
                centreY: 1000
            },
            B: {
                pointX: 1800,
                pointY: 1500
            },
            world
        }, {
            case: 'Negative line gradient that intersects at the right',
            expected: {
                edgeX: 4096,
                edgeY: 1008.0000000000001
            },
            A: {
                centreX: 1800,
                centreY: 1500
            },
            B: {
                pointX: 3200,
                pointY: 1200
            },
            world
        }, {
            case: 'Negative line gradient that intersects at the bottom',
            expected: {
                edgeX: 2250,
                edgeY: 0
            },
            A: {
                centreX: 1800,
                centreY: 1500
            },
            B: {
                pointX: 2100,
                pointY: 500
            },
            world
        }, {
            case: 'Negative line gradient that intersects at the left',
            expected: {
                edgeX: 0,
                edgeY: 1400
            },
            A: {
                centreX: 2000,
                centreY: 1000
            },
            B: {
                pointX: 1000,
                pointY: 1200
            },
            world
        }
    ];

    const flatGradients = [
        {
            case: 'Flat vertical line gradient that intersects at the top',
            expected: {
                edgeX: 2000,
                edgeY: 2160
            },
            A: {
                centreX: 2000,
                centreY: 1000
            },
            B: {
                pointX: 2000,
                pointY: 1500
            },
            world
        }, {
            case: 'Flat horizontal line gradient that intersects at the right',
            expected: {
                edgeX: 4096,
                edgeY: 1000
            },
            A: {
                centreX: 2000,
                centreY: 1000
            },
            B: {
                pointX: 3000,
                pointY: 1000
            },
            world
        }, {
            case: 'Flat vertical line gradient that intersects at the bottom',
            expected: {
                edgeX: 2000,
                edgeY: 0
            },
            A: {
                centreX: 2000,
                centreY: 1000
            },
            B: {
                pointX: 2000,
                pointY: 500
            },
            world
        }, {
            case: 'Flat horizontal line gradient that intersects at the left',
            expected: {
                edgeX: 0,
                edgeY: 1000
            },
            A: {
                centreX: 2000,
                centreY: 1000
            },
            B: {
                pointX: 1000,
                pointY: 1000
            },
            world
        }
    ];

    const cornerHits = [{
        case: 'Hits the corner (0, 0)',
        expected: {
            edgeX: 0,
            edgeY: 0
        },
        A: {
            centreX: 2000,
            centreY: 1000
        },
        B: {
            pointX: 1000,
            pointY: 500
        },
        world: {
            worldWidth: 4096,
            worldHeight: 2160
        }
    }, {
        case: 'Hits the corner (4096, 0)',
        expected: {
            edgeX: 4096,
            edgeY: 0
        },
        A: {
            centreX: 2000,
            centreY: 1000
        },
        B: {
            pointX: 3048,
            pointY: 500
        },
        world: {
            worldWidth: 4096,
            worldHeight: 2160
        }
    }, {
        case: 'Hits the corner (0, 2160)',
        expected: {
            edgeX: 0,
            edgeY: 2160
        },
        A: {
            centreX: 2000,
            centreY: 1000
        },
        B: {
            pointX: 1000,
            pointY: 1580
        },
        world: {
            worldWidth: 4096,
            worldHeight: 2160
        }
    }, {
        case: 'Hits the corner (4096, 2160)',
        expected: {
            edgeX: 4096,
            edgeY: 2160
        },
        A: {
            centreX: 2000,
            centreY: 1000
        },
        B: {
            pointX: 3048,
            pointY: 1580
        },
        world: {
            worldWidth: 4096,
            worldHeight: 2160
        }
    }];

    const allScenarios = [].concat(
        flatGradients,
        positiveGradients,
        negativeGradients,
        cornerHits
    );

    allScenarios.forEach(scenario => {
        it(scenario.case, function () {
            expect(getIntersectionWithWorldEdge(
                scenario.A,
                scenario.B,
                scenario.world
            )).to.deep.eql(scenario.expected);
        });
    });
});
