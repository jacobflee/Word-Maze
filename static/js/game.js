import { secondsToMSS, smoothStep } from './helper.js'
import { displayResults } from './results.js'

// Constants
const POINT_THRESHOLDS = {
    3: 100,
    4: 400,
    5: 800,
    6: 1400,
    7: 2200,
    8: 3200,
    9: 4400,
    10: 5800,
    11: 7400,
    12: 9200,
    13: 11200,
    14: 13400,
    15: 15800
};
const CELL_COLORS = {
    DUPLICATE: 'rgb(220, 220, 40)',
    VALID: 'rgb(20, 180, 40)',
    SELECTED: 'rgb(40, 80, 240)'
};

// DOM Elements
const domElements = {
    wordCounter: document.getElementById('wordCounter'),
    currentWord: document.getElementById('currentWord'),
    gameScore: document.getElementById('gameScore'),
    gameBoard: document.getElementById('gameBoard'),
    gameSvg: document.getElementById('gameSvg'),
    gameTimer: document.getElementById('gameTimer')
};

// Game State
let gameState = null;

// Game Initialization
function init(gameData) {
    resetGameState();
    initializeGameData(gameData);
}

function setEventListeners() {
    window.addEventListener('touchcancel', endWordSelection);
    window.addEventListener('touchend', endWordSelection);
    window.addEventListener('mouseup', endWordSelection);
}

function initializeGameData(gameData) {
    for (const [length, words] of Object.entries(gameData.words)) gameState.validWords[length] = new Set(words);
    domElements.gameBoard.childNodes.forEach((cell, index) => {
        const row = Math.floor(index / 4);
        const col = index % 4;
        cell.firstChild.textContent = gameData.board[row][col];
    });
}

// Game Board Creation
function createGameBoard() {
    const fragment = document.createDocumentFragment();
    for (let index = 0; index < 16; index++) fragment.appendChild(createCell(index));
    domElements.gameBoard.appendChild(fragment);
}

function createCell(index) {
    const row = Math.floor(index / 4) + 1;
    const col = (index % 4) + 1;

    const cell = document.createElement('div');
    cell.className = 'boardCell';
    cell.style.gridArea = `${row} / ${col}`;

    const letter = document.createElement('div');
    letter.className = 'cellLetter';
    cell.appendChild(letter);

    cell.appendChild(createTouchArea(cell));

    return cell;
}

function createTouchArea(cell) {
    const touchArea = document.createElement('div');
    touchArea.className = 'cellTouchArea';
    touchArea.addEventListener('mousedown', () => selectCell(cell, true));
    touchArea.addEventListener('mousemove', () => selectCell(cell));
    touchArea.addEventListener('touchstart', () => selectCell(cell, true));
    touchArea.addEventListener('touchmove', selectTouchedCell);
    return touchArea;
}

function selectTouchedCell(event) {
    const cell = document.elementFromPoint(event.touches[0].clientX, event.touches[0].clientY);
    if (cell && cell.className === 'cellTouchArea') selectCell(cell.parentNode);
}

// Cell Selection
function selectCell(cell, startSelecting) {
    if (startSelecting) gameState.isSelecting = true;
    if (!gameState.isSelecting || !isValidCellSelection(cell)) return;
    animateCellSelection(cell.firstChild);
    drawCircle(cell);
    const lastCell = gameState.selectedCells.at(-1);
    if (gameState.lastSelectedRow > -1) drawLine(lastCell, cell);
    gameState.selectedCells.push(cell);
    gameState.currentWordString += cell.firstChild.textContent;
    updateWordAndCellColors(gameState.currentWordString, cell);
    updateLastSelectedPosition(cell);
}

function isValidCellSelection(cell) {
    if (cell.style.color !== '') return false;
    if (gameState.lastSelectedRow === -1) return true;
    const rowDiff = Math.abs(cell.style.gridRowStart - gameState.lastSelectedRow);
    const colDiff = Math.abs(cell.style.gridColumnStart - gameState.lastSelectedColumn);
    return rowDiff <= 1 && colDiff <= 1;
}

function updateWordAndCellColors(word, cell) {
    const words = gameState.validWords[word.length];
    const isValidWord = words && words.has(word);
    if (!isValidWord) {
        domElements.gameSvg.style.fill = '';
        domElements.gameSvg.style.stroke = '';
        setCellsColor(cell, CELL_COLORS.SELECTED);
        updateWordDisplay('', 0);
        return;
    }
    domElements.gameSvg.style.fill = domElements.gameSvg.style.stroke = 'white';
    if (gameState.foundWords[word.length].has(word)) {
        setCellsColor(cell, CELL_COLORS.DUPLICATE);
        updateWordDisplay(CELL_COLORS.DUPLICATE, 0);
    } else {
        setCellsColor(cell, CELL_COLORS.VALID);
        updateWordDisplay(CELL_COLORS.VALID, POINT_THRESHOLDS[gameState.selectedCells.length]);
    }
}

function setCellsColor(cell, color) {
    const firstCell = gameState.selectedCells[0];
    const cells = firstCell && firstCell.style.color === color ? [cell] : gameState.selectedCells;
    cells.forEach((cell) => {
        cell.firstChild.style.borderColor = color;
        cell.style.color = color;
    });
}

function updateWordDisplay(color, value) {
    if (color === '') {
        domElements.currentWord.style.backgroundColor = '';
        domElements.currentWord.style.color = '';
        domElements.currentWord.style.fontWeight = '';
    } else {
        domElements.currentWord.style.backgroundColor = color;
        domElements.currentWord.style.color = 'black';
        domElements.currentWord.style.fontWeight = 500;
    }
    domElements.currentWord.textContent = value <= 0 ? gameState.currentWordString : `${gameState.currentWordString} (+${value})`;
}

function updateLastSelectedPosition(cell) {
    gameState.lastSelectedRow = cell.style.gridRowStart;
    gameState.lastSelectedColumn = cell.style.gridColumnStart;
}

// SVG Draw
function drawCircle(cell) {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', cell.offsetLeft + cell.clientWidth / 2);
    circle.setAttribute('cy', cell.offsetTop + cell.clientHeight / 2);
    circle.setAttribute('r', cell.clientWidth / 14.5);
    domElements.gameSvg.appendChild(circle);
}

function drawLine(startCell, endCell) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('stroke-width', startCell.clientWidth / 6.5);
    line.setAttribute('x1', startCell.offsetLeft + startCell.clientWidth / 2);
    line.setAttribute('y1', startCell.offsetTop + startCell.clientHeight / 2);
    line.setAttribute('x2', endCell.offsetLeft + endCell.clientWidth / 2);
    line.setAttribute('y2', endCell.offsetTop + endCell.clientHeight / 2);
    domElements.gameSvg.appendChild(line);
}

// Cell Selection End
function endWordSelection() {
    if (!gameState) return;
    const firstCell = gameState.selectedCells[0];
    const isValidWord = firstCell && firstCell.style.color === CELL_COLORS.VALID;
    if (isValidWord) {
        gameState.wordCount += 1;
        gameState.foundWords[gameState.currentWordString.length].add(gameState.currentWordString);
        domElements.wordCounter.textContent = `Words: ${gameState.wordCount}`;
        const points = POINT_THRESHOLDS[gameState.selectedCells.length];
        animateScoreIncrease(points);
    }
    domElements.gameSvg.textContent = '';
    gameState.selectedCells.forEach(resetCellStyle);
    animateWordFadeOut();
    gameState.currentWordString = '';
    gameState.isSelecting = false;
    gameState.lastSelectedColumn = -1;
    gameState.lastSelectedRow = -1;
    gameState.selectedCells = [];
}

function resetGameState() {
    gameState = {
        currentWordString: '',
        isSelecting: false,
        lastSelectedColumn: -1,
        lastSelectedRow: -1,
        selectedCells: [],
        wordCount: 0,
        foundWords: Object.fromEntries(Array.from({ length: 13 }, (_, i) => [i + 3, new Set()])),
        score: 0,
        validWords: {},
        secondsRemaining: 91
    };
}

function resetCellStyle(cell) {
    cell.firstChild.style.borderColor = '';
    cell.style.color = '';
}

// Animation Functions
function animateCellSelection(targetElement, frame = 0) {
    const total = 12;
    if (frame > total) {
        targetElement.style.width = '';
        targetElement.style.height = '';
        targetElement.style.borderRadius = '';
        targetElement.style.fontSize = '';
    } else {
        const progress = frame / total;
        targetElement.style.width = `${93 + 7 * progress}%`;
        targetElement.style.height = targetElement.style.width;
        targetElement.style.borderRadius = `${40 - 15 * progress}%`;
        targetElement.style.fontSize = `calc(${11.5 + 2 * progress} * var(--base-unit))`;
        requestAnimationFrame(() => animateCellSelection(targetElement, frame + 1));
    }
}

function animateWordFadeOut(frame = 0) {
    const total = 12;
    if (frame > total) {
        domElements.currentWord.innerHTML = '<br>';
        domElements.currentWord.style.backgroundColor = '';
        domElements.currentWord.style.color = '';
        domElements.currentWord.style.opacity = '';
    } else {
        const progress = smoothStep(frame / total);
        domElements.currentWord.style.opacity = 1 - progress;
        requestAnimationFrame(() => animateWordFadeOut(frame + 1));
    }
}

function animateScoreIncrease(points, frame = 0) {
    const total = 28;
    if (frame > total) {
        gameState.score += points;
        domElements.gameScore.textContent = gameState.score;
    } else {
        const progress = smoothStep(frame / total);
        domElements.gameScore.textContent = gameState.score + Math.floor(points * progress);
        requestAnimationFrame(() => animateScoreIncrease(points, frame + 1));
    }
}

// Game Start
export function startGame(withTimer, gameData) {
    init(gameData);
    if (withTimer) startTimer();
}

function getLargestLengthWord() {
    const maxLength = Math.max(...Object.entries(gameState.foundWords)
        .filter(([, set]) => set.size > 0)
        .map(([length]) => parseInt(length)));
    if (maxLength === parseFloat("-Infinity")) return '';
    const largestWords = Array.from(gameState.foundWords[maxLength]);
    const randomIndex = Math.floor(Math.random() * largestWords.length);
    const longestWord = largestWords[randomIndex];
    return longestWord
}

function startTimer() {
    gameState.secondsRemaining -= 1;
    domElements.gameTimer.textContent = secondsToMSS(gameState.secondsRemaining);
    if (gameState.secondsRemaining > 0) {
        setTimeout(() => startTimer(), 1000);
        return;
    }
    const wordLengthDistribution = Object.entries(gameState.foundWords).map(([length, set]) => [length, set.size]);
    const longestWord = getLargestLengthWord();
    displayResults(gameState.score, longestWord, wordLengthDistribution);
}

setEventListeners();
createGameBoard();