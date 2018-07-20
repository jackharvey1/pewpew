module.exports = function (config) {
    config.set({
        basePath: '',

        frameworks: ['mocha', 'chai', 'sinon', 'sinon-chai', 'browserify'],

        files: [
            'test/public/**/*.test.js'
        ],

        client: {
            captureConsole: true
        },

        plugins: [
            'karma-mocha',
            'karma-sinon',
            'karma-chai',
            'karma-sinon-chai',
            'karma-browserify',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-coverage'
        ],

        exclude: [],

        preprocessors: {
            'src/public/**/*.test.js': ['browserify'],
            'src/public/**/*.js': ['coverage']
        },

        reporters: ['progress', 'coverage'],

        port: 9876,

        colors: true,

        /* level of logging, possible values:
         * config.LOG_DISABLE
         * config.LOG_ERROR
         * config.LOG_WARN
         * config.LOG_INFO
         * config.LOG_DEBUG
        */
        logLevel: config.LOG_WARN,

        autoWatch: false,

        browsers: ['Chrome', 'Firefox'],

        coverageReporter: {
            dir: 'coverage/',
            reporters: [
                { type: 'text', subdir: '.' },
                { type: 'text-summary', subdir: '.' },
                { type: 'lcov', subdir: '.' }
            ]
        },

        singleRun: true,

        concurrency: Infinity
    });
};
