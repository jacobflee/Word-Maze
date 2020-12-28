import { initializeGrid } from './grid.js';
import { initializeWords, clearWords } from './wordsFound.js';
import { clearScore, hideScore, showScore } from './score.js';
import './input.js';

const svgElement = document.getElementById('svg');
const headerContentElement = document.getElementById('header-content');
const titleElement = document.getElementById('title');
const optionsElement = document.getElementById('options');
const gameNumberElement = document.getElementById('game-number');
const gameNumberInputElement = document.getElementById('game-number-input');
const gameNumberInputBtnElement = document.getElementById('game-number-input-btn');
const invalidMessageElement = document.getElementById('game-number-invalid-message');
const bodyContentElement = document.getElementById('body-content');

svgElement.onclick = () => hideGameNumberInputANDOptions();
gameNumberElement.onclick = () => showONLYGameNumberInput();
gameNumberElement.onmouseenter = () => gameNumberElement.style.opacity = 0.5;
gameNumberElement.onmouseleave = () => gameNumberElement.style.opacity = '';
gameNumberInputBtnElement.onclick = () => submitGameNumberInput();
gameNumberInputBtnElement.onmouseenter = () => gameNumberInputBtnElement.style.opacity = 0.5;
gameNumberInputBtnElement.onmouseleave = () => gameNumberInputBtnElement.style.opacity = '';
titleElement.onclick = () => showONLYOptions();
titleElement.onmouseenter = () => titleElement.style.opacity = 0.5;
titleElement.onmouseleave = () => titleElement.style.opacity = '';

new ResizeObserver(resize).observe(document.body);

function resize() {
    svgElement.style.width = document.body.clientWidth;
    svgElement.style.height = document.body.clientHeight;
    bodyContentElement.style.marginTop = headerContentElement.clientHeight + 'px';
    optionsElement.style.width = titleElement.clientWidth + 'px';
}

function showONLYOptions() {
    if (!svgIsFadedANDBroughtUp()) fadeANDBringUpSVG();
    if (gameNumberInputIsShown()) hideGameNumberInput();
    if (!optionsAreShown()) optionsElement.style.display = 'block';
}

function showONLYGameNumberInput() {
    if (!svgIsFadedANDBroughtUp()) fadeANDBringUpSVG();
    if (optionsAreShown()) hideOptions();
    if (!gameNumberInputIsShown()) {
        showGameNumberInput();
        hideScore();
    }
}

function hideGameNumberInputANDOptions() {
    if (gameNumberInputIsShown()) hideGameNumberInput();
    if (optionsAreShown()) hideOptions();
    if (svgIsFadedANDBroughtUp()) unfadeANDBringDownSVG();
}

function svgIsFadedANDBroughtUp() {
    return svgElement.style.backgroundColor === 'black';
}

function gameNumberInputIsShown() {
    return gameNumberInputElement.style.display === 'block';
}

function optionsAreShown() {
    return optionsElement.style.display === 'block';
}

function hideOptions() {
    optionsElement.style.display = '';
}

function showGameNumberInput() {
    gameNumberElement.style.display = 'none';
    gameNumberInputElement.style.display = 'block';
    gameNumberInputBtnElement.style.display = 'block';
}

function hideGameNumberInput() {
    gameNumberElement.style.display = '';
    gameNumberInputElement.style.display = '';
    gameNumberInputBtnElement.style.display = '';
    gameNumberInputElement.value = '';
    invalidMessageElement.style.display = '';
    showScore();
}

function fadeANDBringUpSVG() {
    svgElement.style.backgroundColor = 'black';
    svgElement.style.zIndex = 3;
    svgElement.style.opacity = 0.75;
}

function unfadeANDBringDownSVG() {
    svgElement.style.backgroundColor = '';
    svgElement.style.zIndex = '';
    svgElement.style.opacity = '';
}

function submitGameNumberInput() {
    if (isValidGameNumber(gameNumberInputElement.value)) {
        initializeGameNumber(gameNumberInputElement.value);
        hideGameNumberInput();
        clearScore();
        clearWords();
    } else {
        invalidMessageElement.style.display = 'block';
        gameNumberInputElement.value = '';
    }
}

function isValidGameNumber(number) {
    return number >= 1 && number <= 100;
}

export function initializeGameNumber(number) {
    fetch('./assets/jsons/' + number + '.json')
        .then(response => response.json())
        .then(data => {
            gameNumberElement.innerHTML = '#' + number;
            initializeGrid(data.board);
            initializeWords(data.words);
        });
}