import { initializeGrid } from './grid.js';
import { initializeWords, clearWords } from './wordsFound.js';
import { clearScore, hideScore, showScore } from './score.js';
import './input.js';

const svg = document.getElementById('svg');
const gameNumber = document.getElementById('game-number');
const gameNumberInput = document.getElementById('game-number-input');
const gameNumberInputBtn = document.getElementById('game-number-input-btn');
const invalidMessage = document.getElementById('invalid-message');
svg.onclick = () => exitChangeGameNumberScreen();
gameNumber.onclick = () => enterChangeGameNumberScreen();
gameNumber.onmouseenter = () => gameNumber.style.opacity = 0.5;
gameNumber.onmouseleave = () => gameNumber.style.opacity = '';
gameNumberInputBtn.onclick = () => submitGameNumberInput();
gameNumberInputBtn.onmouseenter = () => gameNumberInputBtn.style.opacity = 0.5;
gameNumberInputBtn.onmouseleave = () => gameNumberInputBtn.style.opacity = '';

function submitGameNumberInput() {
    const number = parseInt(gameNumberInput.value);
    if (number >= 1 && number <= 100) {
        initializeGameNumber(number);
        exitChangeGameNumberScreen();
        clearScore();
        clearWords();
    } else {
        invalidMessage.style.display = 'block';
        gameNumberInput.value = '';
    }
}

function enterChangeGameNumberScreen() {
    svg.style.backgroundColor = 'black';
    svg.style.zIndex = 3;
    svg.style.opacity = 0.75;
    gameNumber.style.display = 'none';
    gameNumberInput.style.display = 'block';
    gameNumberInputBtn.style.display = 'block';
    hideScore();
}

function exitChangeGameNumberScreen() {
    svg.style.backgroundColor = '';
    svg.style.zIndex = '';
    svg.style.opacity = '';
    gameNumber.style.display = '';
    gameNumberInput.style.display = '';
    gameNumberInputBtn.style.display = '';
    gameNumberInput.value = '';
    invalidMessage.style.display = '';
    showScore();
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