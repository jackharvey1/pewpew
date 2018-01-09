const EventEmitter = require('events');
const Client = require('../../../public/js/client');
const scoreboard = require('../../../public/js/scoreboard');

describe.only('Client logic', function () {
    let game,
        eventEmitter,
        stateAddSpy;

    beforeEach(function () {
        stateAddSpy = sinon.spy();
        eventEmitter = new EventEmitter();

        // eslint-disable-next-line no-undef
        io = {
            connect: () => ({
                on: (eventName, listener) => {
                    eventEmitter.addListener(eventName, listener);
                }
            })
        };

        game = {
            state: {
                getCurrentState: () => ({
                    player: {
                        id: null
                    },
                    addPlayer: stateAddSpy
                })
            }
        };
    });

    it('adds players to the state', function () {
        new Client(game, 'player');
        const scoreboardAddStub = sinon.stub(scoreboard, 'addPlayer');
        eventEmitter.emit('server:player-list', {
            player: {
                id: 'playerId',
                name: 'playerName',
                coordinates: {}
            }
        });

        expect(stateAddSpy.called).to.be.true;

        scoreboardAddStub.restore();
    });

    it('adds players to the scoreboard', function () {
        new Client(game, 'player');
        const scoreboardAddStub = sinon.stub(scoreboard, 'addPlayer');
        eventEmitter.emit('server:player-list', {
            player: {
                id: 'playerId',
                name: 'playerName',
                coordinates: {}
            }
        });

        expect(scoreboardAddStub.called).to.be.true;

        scoreboardAddStub.restore();
    });
});
