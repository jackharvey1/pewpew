const activeClass = 'Scoreboard--active';
let board;

module.exports.init = function () {
    board = document.getElementById('scoreboard');
};

module.exports.show = function () {
    board.className += ` ${activeClass}`;
};

module.exports.hide = function () {
    board.className = board.className.replace(` ${activeClass}`, '');
};

module.exports.addPlayer = function (id) {
    board.insertAdjacentHTML('beforeend', generateRow(id));
};

module.exports.removePlayer = function (id) {
    const row = document.getElementById(id);
    if (row) {
        row.parentNode.removeChild(row);
    }
};

module.exports.updatePlayerLatency = function (id, latency) {
    const row = document.getElementById(id);
    if (row) {
        const latencyElement = row.getElementsByClassName('Scoreboard-latency')[0];
        latencyElement.textContent = latency;
    }
};

module.exports.update = function (players) {
    Object.keys(players).forEach(playerId => {
        const player = players[playerId];
        const row = document.getElementById(playerId);
        row.innerHTML = generateCells(playerId, player.kills, player.deaths, player.latency);
    });
};

function generateRow(id) {
    return `<div id=${id} class="Scoreboard-row">
        ${generateCells(id, 0, 0, 0)}
    </div>`;
}

function generateCells(id, kills, deaths, latency) {
    return `<span>${id}</span>
        <span class="Scoreboard--right">${latency}</span>
        <span class="Scoreboard--right">${deaths}</span>
        <span class="Scoreboard--right">${kills}</span>`;
}
