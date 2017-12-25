const uuid = require('uuid/v4');
const socketIo = require('socket.io');
const omit = require('lodash/omit');
const utils = require('../common/utils');
const config = require('../config');
const logger = require('../lib/logger');
const damage = require('./damage');
const GameState = require('./game-state');

function Server(httpServer) {
    this.gameState = new GameState();
    this.io = this.setUp(httpServer);
}

Server.prototype.setUp = function (httpServer) {
    const io = socketIo(httpServer);

    io.on('connection', socket => {
        logger.log(`${socket.id} connected`);

        this.gameState.addPlayer(socket.id);

        socket.emit('server:player-id', socket.id);
        socket.emit('server:player-list', omit(this.gameState.players, socket.id));

        socket.broadcast.emit('server:player-connected', socket.id);

        socket.on('disconnect', () => this.handleSocketDisconnect(socket));

        socket.on('client:tick', data => this.gameState.updatePlayerPositionInfo(data, socket.id));

        socket.on('client:shot', shotData => this.handleClientShot(shotData, socket));

        socket.on('dong', latency => this.broadcastPings(latency, socket));
    });

    setInterval(this.transmitTicks.bind(this), config.server.tickInterval);

    setInterval(this.transmitCorrections.bind(this), config.server.correctionsInterval);

    setInterval(this.handlePVP.bind(this), config.server.damageInterval);

    setInterval(this.sendPings.bind(this), config.server.pingInterval);

    return io;
};

Server.prototype.handlePVP = function () {
    return damage.calculate(this.gameState.players)
        .then(damageInfo => this.gameState.handleHits(damageInfo))
        .then(this.broadcastDeaths.bind(this))
        .then(this.gameState.resetPlayerShots.bind(this.gameState));
};

Server.prototype.transmitTicks = function () {
    Object.keys(this.gameState.players).forEach(id => {
        this.io.to(id)
            .emit('server:tick', this.gameState.players);
    });
};

Server.prototype.transmitCorrections = function () {
    Object.keys(this.gameState.players).forEach(id => {
        this.io.to(id)
            .emit('server:corrections', omit(this.gameState.players, id));
    });
};

Server.prototype.handleClientShot = function (data, socket) {
    const player = this.gameState.players[socket.id];
    const currentUnixTime = utils.timestamp();

    if (player.nextFireTime <= currentUnixTime) {
        const shotData = {
            id: uuid(),
            originX: data.originX,
            originY: data.originY,
            endX: data.endX,
            endY: data.endY,
            time: data.time
        };

        socket.broadcast.emit('server:shot', shotData);

        player.shots.push(shotData);

        player.nextFireTime = currentUnixTime + config.shot.delay;
    }
};

Server.prototype.handleSocketDisconnect = function (socket) {
    logger.log(`${socket.id} disconnected`);
    delete this.gameState.players[socket.id];
    this.io.sockets
        .emit('server:player-disconnected', socket.id);
};

Server.prototype.broadcastDeaths = function (deaths) {
    deaths.forEach(deathId => {
        this.io.sockets
            .emit('server:player-death', deathId);
    });
};

Server.prototype.sendPings = function () {
    const currentUnixTime = utils.timestamp();
    this.io.sockets
        .emit('ding', currentUnixTime);
};

Server.prototype.broadcastPings = function (latency, socket) {
    this.io.sockets
        .emit('server:player-latency', {
            id: socket.id,
            latency: latency
        });
};

module.exports = Server;
