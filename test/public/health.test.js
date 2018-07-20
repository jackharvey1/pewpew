const Health = require('../../src/public/js/health');

xdescribe('Health class', function () {
    let health, barStub;

    beforeEach(function () {
        const beginFillStub = sinon.spy();
        barStub = {
            clear: () => {},
            beginFill: beginFillStub,
            drawRect: () => {},
            endFill: () => {}
        };
        health = new Health(barStub);
        beginFillStub.restore();
    });

    describe('calculating health bar colour', function () {
        it('calculates green for full health', function () {
            health.points = 100;
            expect(barStub.beginFill).to.have.been.calledWith(0x00FF00);
        });

        it('calculates red for no health', function () {
            health.points = 0;
            expect(barStub.beginFill).to.have.been.calledWith(0xFF0000);
        });

        it('calculates ??? for 50% health', function () {
            health.points = 50;
            expect(barStub.beginFill).to.have.been.calledWith(0x00);
        });
    });
});
