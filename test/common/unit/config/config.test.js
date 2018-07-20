const config = require('../../../../src/common/config');

describe('Config', function () {
    const oldEnv = process.env.NODE_ENV;

    afterEach(function () {
        process.env.NODE_ENV = oldEnv;
    });

    it('fetches the config for specified environment', function () {
        expect(config.test).to.eql(true);
    });

    it('subconfigs overwrite the parent config', function () {
        expect(config.world.width).to.eql(1);
    });
});
