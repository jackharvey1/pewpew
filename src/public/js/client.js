const game = require('./game');
const utils = require('../../common/utils');
const scoreboard = require('./scoreboard');
let socket;

module.exports.init = function () {
    socket = io.connect(window.location.host);
    const state = game.state.getCurrentState();
    const players = state.players;
    const player = state.player;

    socket.on('server:player-list', gameState => {
        Object.keys(gameState).forEach(playerId => {
            state.addPlayer(playerId, gameState[playerId].coordinates);
            scoreboard.addPlayer(playerId);
        });
    });

    socket.on('server:player-id', playerId => {
        state.player.id = playerId;
        scoreboard.addPlayer(playerId);
        beginClientTick();
        beginListeningToServer();
    });

    socket.on('server:player-latency', ({ id, latency }) => {
        if (id === player.id) {
            player.latency = latency;
        } else if (players[id]) {
            state.players[id].latency = latency;
        }
    });

    socket.on('ding', timeSent => {
        const currentUnixTime = utils.timestamp();
        socket.emit('dong', currentUnixTime - timeSent);
    });
};

function beginClientTick() {
    const player = game.state.getCurrentState().player;

    setInterval(() => {
        const msg = {
            facing: player.facing,
            moving: player.moving,
            velocity: {
                x: player.sprite.body.velocity.x || 0,
                y: player.sprite.body.velocity.y || 0
            },
            coordinates: {
                x: player.sprite.x || 0,
                y: player.sprite.y || 0
            }
        };
        socket.emit('client:tick', msg);
    }, 10);
}

function beginListeningToServer() {
    const state = game.state.getCurrentState();

    socket.on('server:player-connected', playerId => {
        state.addPlayer(playerId);
        scoreboard.addPlayer(playerId);
    });

    socket.on('server:player-disconnected', playerId => {
        state.removePlayer(playerId);
        scoreboard.removePlayer(playerId);
    });

    socket.on('server:tick', handleServerTick);

    socket.on('server:shot', data => {
        state.drawShot(data.originX, data.originY, data.endX, data.endY);
    });

    socket.on('server:corrections', handleCorrectionData);

    socket.on('server:player-death', handlePlayerDeath);
}

function handleServerTick(data) {
    const state = game.state.getCurrentState();
    const players = state.players;
    const player = state.player;

    Object.keys(data).forEach(id => {
        if (player.id === id) {
            player.health.points = data[id].health;
            player.health.updateHealthBar();

            player.kills = data[id].kills;
            player.deaths = data[id].deaths;
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

    scoreboard.update(Object.assign({}, { [player.id]: player }, players));
}

function handleCorrectionData(data) {
    const state = game.state.getCurrentState();
    const players = state.players;

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
}

function handlePlayerDeath(id) {
    const state = game.state.getCurrentState();
    const players = state.players;
    const player = state.player;

    if (players[id]) {
        players[id].respawn();
    } else if (player.id === id) {
        player.respawn();
    }
}

module.exports.transmitShot = function (originX, originY, endX, endY) {
    const time = utils.timestamp();
    socket.emit('client:shot', { originX, originY, endX, endY, time });
};
