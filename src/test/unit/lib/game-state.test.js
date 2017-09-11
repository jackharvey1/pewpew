const GameState = require('../../../lib/game-state');

describe('Testing Gamestate prototype', function () {
    it('Adds blank template for a player', function () {
        const gameState = new GameState();
        gameState.addPlayer('player');

        expect(gameState.players.player.nextFireTime).to.not.be.null;
        expect(gameState.players.player).to.not.be.null;
    });

    it('resets shots when called', function () {
        const gameState = new GameState();
        gameState.addPlayer('attacker');
        gameState.players.attacker.shots = ['someShot'];

        gameState.resetPlayerShots();

        expect(gameState.players.attacker.shots).to.eql([]);
    });

    describe('handling hits', function () {
        it('decrements the health of a victim', function () {
            const gameState = new GameState();
            gameState.addPlayer('attacker');
            gameState.addPlayer('victim');

            const attackersAndTheirVictims = {
                'attacker': ['victim']
            };

            gameState.handleHits(attackersAndTheirVictims);

            expect(gameState.players.victim.health).to.eql(90);
        });

        it('increments kills for attacker on kill', function () {
            const gameState = new GameState();
            gameState.addPlayer('attacker');
            gameState.addPlayer('victim');
            gameState.players.victim.health = 10;

            const attackersAndTheirVictims = {
                'attacker': ['victim']
            };

            gameState.handleHits(attackersAndTheirVictims);

            expect(gameState.players.attacker.kills).to.eql(1);
        });

        it('increments the deaths of victim on kill', function () {
            const gameState = new GameState();
            gameState.addPlayer('attacker');
            gameState.addPlayer('victim');
            gameState.players.victim.health = 10;

            const attackersAndTheirVictims = {
                'attacker': ['victim']
            };

            gameState.handleHits(attackersAndTheirVictims);

            expect(gameState.players.victim.deaths).to.eql(1);
        });

        it('returns a fatality', function () {
            const gameState = new GameState();
            gameState.addPlayer('attacker');
            gameState.addPlayer('victim');
            gameState.players.victim.health = 10;

            const attackersAndTheirVictims = {
                'attacker': ['victim']
            };

            const fatalities = gameState.handleHits(attackersAndTheirVictims);

            expect(fatalities).to.eql(['victim']);
        });

        it('returns multiples fatalities', function () {
            const gameState = new GameState();
            gameState.addPlayer('attacker');
            gameState.addPlayer('victim1');
            gameState.addPlayer('victim2');
            gameState.players.victim1.health = 10;
            gameState.players.victim2.health = 10;

            const attackersAndTheirVictims = {
                'attacker': ['victim1', 'victim2']
            };

            const fatalities = gameState.handleHits(attackersAndTheirVictims);

            expect(fatalities).to.eql(['victim1', 'victim2']);
        });

        it('returns multiples fatalities from multiple attackers', function () {
            const gameState = new GameState();
            gameState.addPlayer('attacker1');
            gameState.addPlayer('attacker2');
            gameState.addPlayer('victim1');
            gameState.addPlayer('victim2');
            gameState.players.victim1.health = 10;
            gameState.players.victim2.health = 10;

            const attackersAndTheirVictims = {
                'attacker1': ['victim1'],
                'attacker2': ['victim2']
            };

            const fatalities = gameState.handleHits(attackersAndTheirVictims);

            expect(fatalities).to.eql(['victim1', 'victim2']);
        });

        it('does not return non-fatalities', function () {
            const gameState = new GameState();
            gameState.addPlayer('attacker');
            gameState.addPlayer('victim');

            const attackersAndTheirVictims = {};

            const fatalities = gameState.handleHits(attackersAndTheirVictims);

            expect(fatalities).to.eql([]);
        });

        it('returns empty for an empty game', function () {
            const gameState = new GameState();

            const attackersAndTheirVictims = {};

            const fatalities = gameState.handleHits(attackersAndTheirVictims);

            expect(fatalities).to.eql([]);
        });
    });

    describe('updating player position', function () {
        it('does not overwrite other properties', function () {
            const gameState = new GameState();
            gameState.addPlayer('player');
            gameState.updatePlayerPositionInfo({
                facing: 'up',
                moving: '',
                velocity: {},
                coordinates: {}
            }, 'player');

            expect(gameState.players.player.id).to.eql('player');
        });

        it('adds data to player information', function () {
            const gameState = new GameState();
            gameState.addPlayer('player');
            gameState.updatePlayerPositionInfo({
                facing: 'up',
                moving: '',
                velocity: {},
                coordinates: {
                    x: 500,
                    y: 500
                }
            }, 'player');

            expect(gameState.players.player.coordinates).to.eql({
                x: 500,
                y: 500
            });
        });
    });
});
