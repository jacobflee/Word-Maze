import { initializeGrid } from './grid.js';
import { initializeWords } from './wordsFound.js';

const svg = document.getElementById('svg');
const scoreElement = document.getElementById('score');
const gameNumber = document.getElementById('game-number');
const gameNumberInput = document.getElementById('game-number-input');
const gameNumberInputBtn = document.getElementById('game-number-input-btn');
const invalidMessage = document.getElementById('invalid-message');
svg.onclick = () => exitChangeGameNumberScreen();
gameNumber.onclick = () => enterChangeGameNumberScreen();
gameNumberInputBtn.onmousedown = () => pressGameNumberInputBtn();
gameNumberInputBtn.onmouseup = () => submitGameNumberInput();
gameNumberInputBtn.ontouchstart = () => pressGameNumberInputBtn();
gameNumberInputBtn.ontouchend = () => submitGameNumberInput();
gameNumberInputBtn.ontouchcancel = () => submitGameNumberInput();

function submitGameNumberInput() {
    const number = parseInt(gameNumberInput.value);
    if (number >= 1 && number <= 100) {
        initializeGameNumber(number);
        releaseGameNumberInputBtn();
        exitChangeGameNumberScreen();
        invalidMessage.style.display = '';
    } else {
        invalidMessage.style.display = 'block';
        gameNumberInput.value = '';
    }
    releaseGameNumberInputBtn();
}

function pressGameNumberInputBtn() {
    gameNumberInputBtn.style.opacity = 0.5;
    gameNumberInputBtn.style.height = '6.5vmin';
}

function releaseGameNumberInputBtn() {
    gameNumberInputBtn.style.opacity = '';
    gameNumberInputBtn.style.height = '';
}

function enterChangeGameNumberScreen() {
    svg.style.backgroundColor = 'black';
    svg.style.zIndex = 3;
    svg.style.opacity = 0.75;
    scoreElement.style.display = 'none';
    gameNumber.style.display = 'none';
    gameNumberInput.style.display = 'block';
    gameNumberInputBtn.style.display = 'block';
}

function exitChangeGameNumberScreen() {
    svg.style.backgroundColor = '';
    svg.style.zIndex = '';
    svg.style.opacity = '';
    scoreElement.style.display = '';
    gameNumber.style.display = '';
    gameNumberInput.style.display = '';
    gameNumberInputBtn.style.display = '';
    gameNumberInput.value = '';
}

export function initializeGameNumber(number) {
    fetch('./assets/jsons/' + number + '.json')
        .then(response => response.json())
        .then(data => {
            gameNumber.innerHTML = '#' + number;
            initializeGrid(data.board);
            initializeWords(data.words);
        });
}