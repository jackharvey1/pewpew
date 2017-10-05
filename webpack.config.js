const path = require('path');
const ProgressPlugin = require('progress-bar-webpack-plugin');

module.exports = {
    entry: [
        './src/public/js/game.js',
        './src/public/js/client.js',
        './src/public/js/play-state.js',
        './src/public/js/player.js'
    ],
    output: {
        path: path.resolve(__dirname, './src/public/js/'),
        filename: `main.min.js`,
        sourceMapFilename: `[name].map.js`
    },
    devtool: process.execArgv.indexOf('--debug') ? 'source-map' : '',
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader'
            }
        ]
    },
    plugins: [
        new ProgressPlugin()
    ]
};
