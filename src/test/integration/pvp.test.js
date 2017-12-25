const Server = require('../../lib/server');

describe('PVP integration tests', function () {
    let server,
        handleHitsSpy,
        broadcastDeathsSpy,
        resetPlayerShotsSpy;

    beforeEach(function () {
        server = new Server(null);
        handleHitsSpy = sinon.spy(server.gameState, 'handleHits');
        broadcastDeathsSpy = sinon.spy(server, 'broadcastDeaths');
        resetPlayerShotsSpy = sinon.spy(server.gameState, 'resetPlayerShots');
    });

    afterEach(function () {
        server = null;
        handleHitsSpy.restore();
        broadcastDeathsSpy.restore();
        resetPlayerShotsSpy.restore();
    });

    describe('calculating damage, handling it, broadcasting fatalities then reseting shots', function () {
        it('works with no players', function () {
            return server.handlePVP()
                .then(() => {
                    return expect(handleHitsSpy.calledWithExactly({})).to.be.true &&
                        expect(broadcastDeathsSpy.calledWithExactly([])).to.be.true &&
                        expect(resetPlayerShotsSpy.calledOnce).to.be.true;
                });
        });

        it('works with one player', function () {
            server.gameState.addPlayer('player');
            return server.handlePVP()
                .then(() => {
                    return expect(handleHitsSpy.calledWithExactly({
                        player: []
                    })).to.be.true &&
                        expect(broadcastDeathsSpy.calledWithExactly([])).to.be.true &&
                        expect(resetPlayerShotsSpy.calledOnce).to.be.true;
                });
        });

        it('works with three players', function () {
            server.gameState.addPlayer('player1');
            server.gameState.addPlayer('player2');
            server.gameState.addPlayer('player3');
            return server.handlePVP()
                .then(() => {
                    return expect(handleHitsSpy.calledWithExactly({
                        player1: [],
                        player2: [],
                        player3: []
                    })).to.be.true &&
                        expect(broadcastDeathsSpy.calledWithExactly([])).to.be.true &&
                        expect(resetPlayerShotsSpy.calledOnce).to.be.true;
                });
        });
    });
});
