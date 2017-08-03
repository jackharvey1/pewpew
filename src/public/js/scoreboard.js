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

function generateRow(id) {
    return `<div id=${id} class="Scoreboard-row">${id}</div>`;
}
