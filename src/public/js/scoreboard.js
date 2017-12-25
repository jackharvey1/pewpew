const activeClass = 'Modal--active';
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

module.exports.addPlayer = function (id, name) {
    board.insertAdjacentHTML('beforeend', generateRow(id, name));
};

module.exports.removePlayer = function (id) {
    const row = document.getElementById(id);
    if (row) {
        row.parentNode.removeChild(row);
    }
};

module.exports.update = function (players) {
    Object.values(players).forEach(({ id, name }) => {
        const player = players[id];
        const row = document.getElementById(id);
        row.innerHTML = generateCells(name, player.kills, player.deaths, player.latency);
    });
};

function generateRow(id, name) {
    return `<div id=${id} class="Modal-scoreboardRow">
        ${generateCells(name, 0, 0, 0)}
    </div>`;
}

function generateCells(name, kills, deaths, latency) {
    return `<span>${name}</span>
        <span class="Modal--right">${latency}</span>
        <span class="Modal--right">${deaths}</span>
        <span class="Modal--right">${kills}</span>`;
}
