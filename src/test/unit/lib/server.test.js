const Server = require('../../../lib/server');
const config = require('../../../config');

describe('Server logic', function () {
    let server,
        shotData,
        socket,
        emitStub;

    beforeEach(function () {
        server = new Server(null);
        server.gameState.addPlayer('player');

        emitStub = sinon.stub(server.io.sockets, 'emit');

        shotData = {
            originX: 0,
            originY: 0,
            endX: 100,
            endY: 100,
            time: 86400
        };

        socket = {
            id: 'player',
            broadcast: {
                emit: () => {}
            }
        };
    });

    afterEach(function () {
        server = null;
        emitStub.restore();
    });

    describe('handling received shots', function () {
        let timestampStub;

        beforeEach(function () {
            timestampStub = sinon.useFakeTimers(0);
        });

        afterEach(function () {
            timestampStub.restore();
        });

        it('pushes a shot', function () {
            server.handleClientShot(shotData, socket);

            expect(server.gameState.players[socket.id].shots).to.have.length(1);
        });

        it('increments next fire time by configured amount', function () {
            server.handleClientShot(shotData, socket);

            expect(server.gameState.players[socket.id].nextFireTime).to.eql(config.shot.delay);
        });

        it('does not push a shot fired before nextFireTime is up', function () {
            timestampStub = sinon.useFakeTimers(-1);

            server.handleClientShot(shotData, socket);

            expect(server.gameState.players[socket.id].shots).to.have.length(0);
        });
    });

    describe('transmitting corrections', function () {
        it('transmits', function () {
            server.transmitTicks();
            expect(emitStub.calledOnce).to.be.true;
        });
    });

    describe('transmitting corrections', function () {
        it('transmits', function () {
            server.transmitCorrections();
            expect(emitStub.calledOnce).to.be.true;
        });

        it('does not transmit the player itself', function () {
            server.transmitCorrections();
            expect(emitStub.calledWithMatch(/\w+/, {})).to.be.true;
        });
    });

    describe('disconnecting players', function () {
        it('should delete the player', function () {
            server.handleSocketDisconnect({ id: 'player' });
            expect(server.gameState.players.player).to.be.undefined;
        });

        it('should broadcast', function () {
            server.handleSocketDisconnect('player');
            expect(emitStub.calledOnce).to.be.true;
        });
    });

    describe('broadcasting deaths', function () {
        it('should broadcast many deaths when passed', function () {
            server.broadcastDeaths(['fatality1', 'fatality2', 'fatality3']);
            expect(emitStub.calledThrice).to.be.true;
        });

        it('should broadcast no deaths when none passed', function () {
            server.broadcastDeaths([]);
            expect(emitStub.notCalled).to.be.true;
        });
    });

    describe('sending pings', function () {
        it('should broadcast ping when received', function () {
            server.sendPings();
            expect(emitStub.calledWithMatch(/\w+/, 0)).to.be.true;
        });
    });

    describe('Receiving pongs; broadcasting ping', function () {
        it('should broadcast ping when received', function () {
            server.broadcastPings(10, { id: 'player' });
            expect(emitStub.calledOnce).to.be.true;
        });
    });
});
