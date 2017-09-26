const getIntersectionWithWorldEdge = require('../../../common/utils').getIntersectionWithWorldEdge;

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
                Ax: 1500,
                Ay: 800
            },
            B: {
                Bx: 2000,
                By: 1200
            },
            world
        },
        {
            case: 'Positive line gradient that intersects at the right',
            expected: {
                edgeX: 4096,
                edgeY: 1219.2
            },
            A: {
                Ax: 2000,
                Ay: 800
            },
            B: {
                Bx: 3000,
                By: 1000
            },
            world
        },
        {
            case: 'Positive line gradient that intersects at the bottom',
            expected: {
                edgeX: 1000,
                edgeY: 0
            },
            A: {
                Ax: 2200,
                Ay: 1200
            },
            B: {
                Bx: 1800,
                By: 800
            },
            world
        },
        {
            case: 'Positive line gradient that intersects at the left',
            expected: {
                edgeX: 0,
                edgeY: 600
            },
            A: {
                Ax: 2000,
                Ay: 1000
            },
            B: {
                Bx: 1000,
                By: 800
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
                Ax: 2000,
                Ay: 1000
            },
            B: {
                Bx: 1800,
                By: 1500
            },
            world
        },
        {
            case: 'Negative line gradient that intersects at the right',
            expected: {
                edgeX: 4096,
                edgeY: 1008.0000000000001
            },
            A: {
                Ax: 1800,
                Ay: 1500
            },
            B: {
                Bx: 3200,
                By: 1200
            },
            world
        },
        {
            case: 'Negative line gradient that intersects at the bottom',
            expected: {
                edgeX: 2250,
                edgeY: 0
            },
            A: {
                Ax: 1800,
                Ay: 1500
            },
            B: {
                Bx: 2100,
                By: 500
            },
            world
        },
        {
            case: 'Negative line gradient that intersects at the left',
            expected: {
                edgeX: 0,
                edgeY: 1400
            },
            A: {
                Ax: 2000,
                Ay: 1000
            },
            B: {
                Bx: 1000,
                By: 1200
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
                Ax: 2000,
                Ay: 1000
            },
            B: {
                Bx: 2000,
                By: 1500
            },
            world
        },
        {
            case: 'Flat horizontal line gradient that intersects at the right',
            expected: {
                edgeX: 4096,
                edgeY: 1000
            },
            A: {
                Ax: 2000,
                Ay: 1000
            },
            B: {
                Bx: 3000,
                By: 1000
            },
            world
        },
        {
            case: 'Flat vertical line gradient that intersects at the bottom',
            expected: {
                edgeX: 2000,
                edgeY: 0
            },
            A: {
                Ax: 2000,
                Ay: 1000
            },
            B: {
                Bx: 2000,
                By: 500
            },
            world
        },
        {
            case: 'Flat horizontal line gradient that intersects at the left',
            expected: {
                edgeX: 0,
                edgeY: 1000
            },
            A: {
                Ax: 2000,
                Ay: 1000
            },
            B: {
                Bx: 1000,
                By: 1000
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
            Ax: 2000,
            Ay: 1000
        },
        B: {
            Bx: 1000,
            By: 500
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
            Ax: 2000,
            Ay: 1000
        },
        B: {
            Bx: 3048,
            By: 500
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
            Ax: 2000,
            Ay: 1000
        },
        B: {
            Bx: 1000,
            By: 1580
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
            Ax: 2000,
            Ay: 1000
        },
        B: {
            Bx: 3048,
            By: 1580
        },
        world: {
            worldWidth: 4096,
            worldHeight: 2160
        }
    }];

    const allScenarios = [].concat(flatGradients,
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
