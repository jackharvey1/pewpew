const EventEmitter = require('events');
const Client = require('../../src/public/js/client');
const scoreboard = require('../../src/public/js/scoreboard');

describe.only('Client logic', function () {
    let game,
        client,
        clock,
        eventEmitter,
        stateAddStub,
        emitStub,
        scoreboardAddStub;

    const playerObject = {
        facing: 'left',
        moving: 'left',
        sprite: {
            x: -1,
            y: -1,
            body: {
                velocity: {
                    x: -1,
                    y: -1
                }
            }
        }
    };

    beforeEach(function () {
        clock = sinon.useFakeTimers();
        stateAddStub = sinon.stub();
        scoreboardAddStub = sinon.stub(scoreboard, 'addPlayer');
        eventEmitter = new EventEmitter();
        emitStub = sinon.stub();

        // eslint-disable-next-line no-undef
        io = {
            connect: () => ({
                on: (eventName, listener) => {
                    eventEmitter.addListener(eventName, listener);
                },
                emit: emitStub
            })
        };

        game = {
            state: {
                getCurrentState: () => ({
                    player: Object.assign({}, playerObject),
                    addPlayer: stateAddStub,
                    drawShot: () => {}
                })
            }
        };

        client = new Client(game, 'playerName');
    });

    afterEach(function () {
        clock.restore();
        scoreboardAddStub.restore();
    });

    describe('Receiving and handling the player list', function () {
        beforeEach(function () {
            eventEmitter.emit('server:player-list', {
                playerId: {
                    id: 'playerId',
                    name: 'playerName',
                    coordinates: {}
                }
            });
        });

        it('adds players to the state', function () {
            expect(stateAddStub).to.have.been.calledWith('playerId', 'playerName', {});
        });

        it('adds players to the scoreboard', function () {
            expect(scoreboardAddStub).to.have.been.calledWith('playerId', 'playerName');
        });
    });

    describe('Receiving the playerId', function () {
        beforeEach(function () {
            eventEmitter.emit('server:player-id', 'playerId');
        });

        it('assigns the player id', function () {
            expect(client.state.player.id).to.equal('playerId');
        });

        it('adds player to the scoreboard', function () {
            expect(scoreboardAddStub).to.have.been.calledWith('playerId', 'playerName');
        });

        it('begins the client tick', function () {
            clock.tick(10);
            expect(emitStub).to.have.been.called;
        });

        it('sends everything we expect in the client message', function () {
            clock.tick(10);
            expect(emitStub).to.have.been.calledWith('client:tick', {
                facing: 'left',
                moving: 'left',
                velocity: {
                    x: -1,
                    y: -1
                },
                coordinates: {
                    x: -1,
                    y: -1
                }
            });
        });
    });

    describe('receiving messages from the server', function () {

    });
});
