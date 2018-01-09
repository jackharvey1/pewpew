let menu, nameInput;
const activeClass = 'Modal--active';

// eslint-disable-next-line no-empty-function
function MenuState() { }

MenuState.prototype.preload = function () {
    menu = document.getElementById('menu');
    nameInput = document.getElementById('name');
    showMenu();

    const startButton = document.getElementById('start');
    startButton.addEventListener('click', this.startGame.bind(this));
    nameInput.addEventListener('keypress', filterInput);
    nameInput.addEventListener('paste', e => e.preventDefault());
};

function filterInput(event) {
    const charCode = event.which || event.keyCode;
    const char = String.fromCharCode(charCode);
    return /[A-z]/.test(char);
}

MenuState.prototype.startGame = function () {
    const name = nameInput.value;
    if (name !== '') {
        hideMenu();
        const shouldClearWorld = false;
        const shouldClearCache = false;
        this.game.state.start('play', shouldClearWorld, shouldClearCache, name);
    }
};

function showMenu() {
    menu.className += ` ${activeClass}`;
}

function hideMenu() {
    menu.className = menu.className.replace(` ${activeClass}`, '');
}

module.exports = MenuState;
