const utils = require('../../common/utils');
const scoreboard = require('./scoreboard');

function Client(game, playerName) {
    this.socket = io.connect(window.location.host, { query: { playerName } });

    this.playerName = playerName;
    this.state = game.state.getCurrentState();
    this.player = this.state.player;

    this.setUp();
}

Client.prototype.setUp = function () {
    this.socket.on('server:player-list', this.addAlreadyConnectedPlayer.bind(this));

    this.socket.on('server:player-id', this.setUpPlayer.bind(this));

    this.socket.on('server:player-latency', this.updateLatencies.bind(this));

    this.socket.on('ding', this.respondToPing.bind(this));
};

Client.prototype.addAlreadyConnectedPlayer = function (gameState) {
    Object.values(gameState).forEach(({ id, name, coordinates }) => {
        this.state.addPlayer(id, name, coordinates);
        scoreboard.addPlayer(id, name);
    });
};

Client.prototype.setUpPlayer = function (playerId) {
    this.state.player.id = playerId;
    scoreboard.addPlayer(playerId, this.playerName);
    beginClientTick();
    beginListeningToServer();
};

Client.prototype.updateLatencies = function ({ id, latency }) {
    const players = this.state.players;
    if (id === this.player.id) {
        this.player.latency = latency;
    } else if (players[id]) {
        players[id].latency = latency;
    }
};

Client.prototype.respondToPing = function (timeSent) {
    const currentUnixTime = utils.timestamp();
    this.socket.emit('dong', currentUnixTime - timeSent);
};

function beginClientTick() {
    setInterval(() => {
        const msg = {
            facing: this.player.facing,
            moving: this.player.moving,
            velocity: {
                x: this.player.sprite.body.velocity.x || 0,
                y: this.player.sprite.body.velocity.y || 0
            },
            coordinates: {
                x: this.player.sprite.x || 0,
                y: this.player.sprite.y || 0
            }
        };
        this.socket.emit('client:tick', msg);
    }, 10);
}

Client.prototype.beginListeningToServer = function () {
    this.socket.on('server:player-connected', ({ playerId, playerName }) => {
        this.state.addPlayer(playerId, playerName);
        scoreboard.addPlayer(playerId, playerName);
    });

    this.socket.on('server:player-disconnected', playerId => {
        this.state.removePlayer(playerId);
        scoreboard.removePlayer(playerId);
    });

    this.socket.on('server:tick', this.handleServerTick.bind(this));

    this.socket.on('server:shot', this.state.drawShot.bind(this));

    this.socket.on('server:corrections', this.handleCorrectionData.bind(this));

    this.socket.on('server:player-death', this.handlePlayerDeath.bind(this));
};

Client.prototype.handleServerTick = function (data) {
    const players = this.state.players;

    Object.keys(data).forEach(id => {
        if (this.player.id === id) {
            this.player.health.points = data[id].health;
            this.player.health.updateHealthBar();

            this.player.kills = data[id].kills;
            this.player.deaths = data[id].deaths;
        }

        if (players[id]) {
            players[id].sprite.body.velocity.x = data[id].velocity.x;
            players[id].sprite.body.velocity.y = data[id].velocity.y;

            players[id].kills = data[id].kills;
            players[id].deaths = data[id].deaths;

            players[id].health.points = data[id].health;
            players[id].health.updateHealthBar();

            if (data[id].facing === 'left') {
                players[id].faceLeft();
            } else if (data[id].facing === 'right') {
                players[id].faceRight();
            }

            if (data[id].moving === 'left') {
                players[id].moveLeft();
            } else if (data[id].moving === '') {
                players[id].stop();
            } else if (data[id].moving === 'right') {
                players[id].moveRight();
            }
        }
    });

    scoreboard.update(Object.assign({}, { [this.player.id]: this.player }, players));
};

Client.prototype.handleCorrectionData = function (data) {
    const players = this.state.players;

    Object.keys(data).forEach(id => {
        if (players[id]) {
            const xDiff = players[id].sprite.x - data[id].coordinates.x;
            const yDiff = players[id].sprite.y - data[id].coordinates.y;
            const xDiffCritical = Math.abs(xDiff) > 10;
            const yDiffCritical = Math.abs(yDiff) > 10;

            if (xDiffCritical) {
                players[id].sprite.x = utils.extrapolateOrdinate(
                    data[id].coordinates.x,
                    data[id].velocity.x,
                    data[id].time
                );
            } else {
                players[id].sprite.x -= xDiff / 5;
            }

            if (yDiffCritical) {
                players[id].sprite.y = utils.extrapolateOrdinate(
                    data[id].coordinates.y,
                    data[id].velocity.y,
                    data[id].time
                );
            } else {
                players[id].sprite.y -= yDiff / 5;
            }
        }
    });
};

Client.prototype.handlePlayerDeath = function (id) {
    const players = this.state.players;

    if (players[id]) {
        players[id].respawn();
    } else if (this.player.id === id) {
        this.player.respawn();
    }
};

Client.prototype.transmitShot = function ({ originX, originY, endX, endY }) {
    const time = utils.timestamp();
    this.socket.emit('client:shot', { originX, originY, endX, endY, time });
};

module.exports = Client;
