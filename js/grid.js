import { addLetter, clearWord, getWord } from './wordCurrent.js';
import { addWordFound, wordNotFound, isWord } from './wordsFound.js';
import { addPoints } from './score.js';

const gridElement = document.getElementById('grid');
const yellow = 'rgb(220, 220, 40)';
const green = 'rgb(20, 160, 20)';
const blue = 'rgb(40, 80, 240)';
const degrees = [
    [-45, 0, 45],
    [-90, 0, 90],
    [-135, 180, 135]
];
var pressedCells = [];
var prevGridRowStart = -1,
    prevGridColumnStart = -1;

function isValidTouch(touch) {
    return touch && touch.className === 'cell-touch';
}

function hasValidId(target) {
    return target.style.color === '' && (
        prevGridRowStart === -1 ||
        (Math.abs(target.style.gridRowStart - prevGridRowStart) <= 1 &&
            Math.abs(target.style.gridColumnStart - prevGridColumnStart) <= 1)
    );
}

function isValidWord() {
    return pressedCellsColorEquals(green);
}

function pressedCellsColorEquals(color) {
    return pressedCells[0] && pressedCells[0].style.color == color;
}

function evaluateDegrees(target) {
    const x = target.style.gridColumnStart - prevGridColumnStart;
    const y = prevGridRowStart - target.style.gridRowStart;
    return degrees[x + 1][y + 1];
}

function resetGrid() {
    if (pressedCells.length > 0) {
        pressedCells[pressedCells.length - 1].style.margin = '';
        pressedCells[pressedCells.length - 1].childNodes[0].childNodes[0].style.fontSize = '';
    }
    pressedCells.forEach(cell => setCellNotPressed(cell));
    pressedCells = [];
}

function setCellNotPressed(target) {
    target.childNodes[1].style.display = 'none';
    target.childNodes[2].style.display = 'none';
    setCellColor(target, '');
}

function setCellPressed(target) {
    target.style.margin = '1vmin';
    target.childNodes[0].childNodes[0].style.fontSize = '13vmin';
    target.childNodes[1].style.display = '';
    if (prevGridRowStart > -1) {
        pressedCells[pressedCells.length - 2].style.margin = '';
        pressedCells[pressedCells.length - 2].childNodes[0].childNodes[0].style.fontSize = '';
        target.childNodes[2].style.display = '';
        target.childNodes[2].className = 'cell-line short';
        target.childNodes[2].style.transform = 'rotate(' + evaluateDegrees(target) + 'deg)'
    }
}

function setCellColor(target, color) {
    target.childNodes[0].style.borderColor = color;
    target.style.color = color;
}

function setCellsColor(target, color) {
    if (!pressedCellsColorEquals(color))
        pressedCells.forEach(cell => setCellColor(cell, color));
    else
        setCellColor(target, color);
}

function updateCellsColor(word, target) {
    if (isWord(word))
        if (wordNotFound(word))
            setCellsColor(target, green);
        else
            setCellsColor(target, yellow);
    else
        setCellsColor(target, blue);
}

export function initializeGrid(board) {
    for (var x = 0; x < 4; x++)
        for (var y = 0; y < 4; y++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.style.gridRowStart = x + 1;
            cell.style.gridColumnStart = y + 1;
            cell.id = 4 * x + y;

            const letter = document.createElement('div');
            letter.className = 'cell-letter';
            cell.appendChild(letter);

            const text = document.createElement('p');
            text.className = 'cell-letter-text';
            text.innerHTML = board[x][y];
            letter.appendChild(text);

            const dot = document.createElement('div');
            dot.className = 'cell-line dot';
            dot.style.display = 'none';
            cell.appendChild(dot);

            const line = document.createElement('div');
            line.style.display = 'none';
            cell.appendChild(line);

            const touch = document.createElement('div');
            touch.className = 'cell-touch';
            cell.appendChild(touch);

            gridElement.appendChild(cell);
        }
}

export function press(e) {
    var touch;
    if (e.type === 'mousemove') touch = document.elementFromPoint(e.clientX, e.clientY);
    else if (e.type === 'touchmove') touch = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);
    else touch = e.target;
    if (isValidTouch(touch) && hasValidId(touch.parentNode)) {
        const target = touch.parentNode;
        pressedCells.push(target);
        addLetter(target.childNodes[0].childNodes[0].innerHTML);
        setCellPressed(target);
        updateCellsColor(getWord(), target);
        prevGridRowStart = target.style.gridRowStart;
        prevGridColumnStart = target.style.gridColumnStart;
    }
}

export function release() {
    if (isValidWord()) {
        addWordFound(getWord());
        addPoints(pressedCells.length);
    }
    clearWord();
    resetGrid();
    prevGridRowStart = -1;
    prevGridColumnStart = -1;
}