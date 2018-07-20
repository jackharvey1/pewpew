const defaultConfig = require('./default');

const environment = process.env.NODE_ENV;
const envConfig = environment ? require(`./${environment}`) : {};

module.exports = Object.assign(defaultConfig, envConfig);
