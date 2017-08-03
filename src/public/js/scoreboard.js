'use strict';

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
    row.parentNode.removeChild(row);
};

module.exports.updatePlayerLatency = function (id, latency) {
    const row = document.getElementById(id);
    const latencyElement = row.getElementsByClassName('Scoreboard-latency')[0];
    latencyElement.textContent = latency;
};

function generateRow(id) {
    return `<div id=${id} class="Scoreboard-row">
        <span>${id}</span>
        <span class="Scoreboard-latency"></span>
    </div>`;
}
