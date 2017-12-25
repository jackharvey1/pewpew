const damage = require('../../../lib/damage');

describe('damage.js', function () {
    const attacker = {
        id: 'attacker',
        shots: [{
            id: 'shotId',
            originX: 0,
            originY: 20,
            endX: 300,
            endY: 20
        }],
        coordinates: {
            x: 0,
            y: 20
        }
    };

    describe('calculating all damage inflicted', function () {
        it('finds multiple victims of multiple attackers', function () {
            const gameState = {
                attacker1: {
                    id: 'attacker1',
                    shots: [
                        {
                            id: 'shot1',
                            originX: 0,
                            originY: 20,
                            endX: 300,
                            endY: 20
                        }
                    ],
                    coordinates: {
                        x: 0,
                        y: 20
                    }
                },
                attacker2: {
                    id: 'attacker2',
                    shots: [
                        {
                            id: 'shot2',
                            originX: 0,
                            originY: 300,
                            endX: 300,
                            endY: 300
                        }
                    ],
                    coordinates: {
                        x: 0,
                        y: 300
                    }
                },
                victim1: {
                    id: 'victim1',
                    coordinates: {
                        x: 200,
                        y: 20
                    },
                    shots: [],
                    health: 100
                },
                victim2: {
                    id: 'victim2',
                    coordinates: {
                        x: 100,
                        y: 300
                    },
                    shots: [],
                    health: 100
                }
            };

            return damage.calculate(gameState).then(victims =>
                expect(victims).to.eql(
                    {
                        'attacker1': ['victim1'],
                        'attacker2': ['victim2'],
                        'victim1': [],
                        'victim2': []
                    }
                )
            );
        });
    });

    describe('getting the victims of shots', function () {
        it('finds multiple victims of multiple shots', function () {
            const gameState = {
                attacker: {
                    id: 'attacker',
                    shots: [
                        {
                            id: 'shot1',
                            originX: 0,
                            originY: 20,
                            endX: 300,
                            endY: 20
                        }, {
                            id: 'shot2',
                            originX: 0,
                            originY: 0,
                            endX: 300,
                            endY: 300
                        }
                    ],
                    coordinates: {
                        x: 0,
                        y: 20
                    }
                },
                victim1: {
                    id: 'victim1',
                    coordinates: {
                        x: 200,
                        y: 20
                    },
                    shots: [],
                    health: 100
                },
                victim2: {
                    id: 'victim2',
                    coordinates: {
                        x: 150,
                        y: 150
                    },
                    shots: [],
                    health: 100
                }
            };

            expect(damage.getVictimsOfShots(
                gameState.attacker,
                Object.values(gameState)
            )).to.eql([
                'victim1',
                'victim2'
            ]);
        });

        it('filters out non-hits', function () {
            const gameState = {
                attacker: Object.assign({}, attacker),
                victim: {
                    id: 'victim',
                    coordinates: {
                        x: 200,
                        y: 200
                    },
                    shots: [],
                    health: 100
                }
            };

            expect(damage.getVictimsOfShots(
                gameState.attacker,
                Object.values(gameState),
                gameState.attacker.shots[0]
            )).to.eql([]);
        });
    });

    describe('getting the nearest victim of a shot', function () {
        it('does not return the attacker (returns null if only player)', function () {
            const gameState = {
                attacker: Object.assign({}, attacker)
            };

            expect(damage.getNearestVictimOfShot(
                gameState.attacker,
                Object.values(gameState),
                gameState.attacker.shots[0]
            )).to.eql(null);
        });

        it('returns player if in firing line', function () {
            const gameState = {
                attacker: Object.assign({}, attacker),
                victim: {
                    id: 'victim',
                    coordinates: {
                        x: 200,
                        y: 20
                    },
                    shots: [],
                    health: 100
                }
            };

            expect(damage.getNearestVictimOfShot(
                gameState.attacker,
                Object.values(gameState),
                gameState.attacker.shots[0]
            )).to.eql(gameState.victim);
        });

        it('returns null if no player in firing line', function () {
            const gameState = {
                attacker: Object.assign({}, attacker),
                victim: {
                    id: 'victim',
                    coordinates: {
                        x: 200,
                        y: 200
                    },
                    shots: [],
                    health: 100
                }
            };

            expect(damage.getNearestVictimOfShot(
                gameState.attacker,
                Object.values(gameState),
                gameState.attacker.shots[0]
            )).to.eql(null);
        });
    });

    describe('finding the nearest victim to attacker', function () {
        it('should return the only player is there is only 1 player', function () {
            const gameState = {
                attacker: Object.assign({}, attacker),
                victim: {
                    id: 'victim',
                    coordinates: {
                        x: 200,
                        y: 20
                    },
                    shots: [],
                    health: 100
                }
            };

            expect(damage.getNearestVictim(
                gameState.attacker,
                null,
                gameState.victim
            )).to.eql(gameState.victim);
        });

        it('should return the nearest player is there is 2 players', function () {
            const gameState = {
                attacker: Object.assign({}, attacker),
                victim: {
                    coordinates: {
                        x: 200,
                        y: 20
                    },
                    shots: [],
                    health: 100
                },
                bystander: {
                    coordinates: {
                        x: 200,
                        y: 20
                    },
                    shots: [],
                    health: 100
                }
            };

            expect(damage.getNearestVictim(
                gameState.attacker,
                gameState.victim,
                gameState.bystander
            )).to.eql(gameState.victim);
        });
    });
});
