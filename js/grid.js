import { addLetter, clearWord, getWord } from './wordCurrent.js';
import { addWordFound, wordNotFound, isWord } from './wordsFound.js';
import { addPoints } from './score.js';

const gridElement = document.getElementById('grid');
const yellow = 'rgb(200, 180, 0)';
const green = 'rgb(0, 220, 0)';
const blue = 'rgb(20, 0, 200)'
const degrees = [
    [-45, 0, 45],
    [-90, 0, 90],
    [-135, 180, 135]
];
var pressedCells = [];
var prevGridRowStart = -1,
    prevGridColumnStart = -1;

function isValidTouch(touch) {
    return touch && touch.className === 'touch';
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
    pressedCells.forEach(cell => setCellNotPressed(cell));
    pressedCells = [];
}

function setCellNotPressed(target) {
    target.childNodes[1].style.display = 'none';
    target.childNodes[2].style.display = 'none';
    setCellColor(target, '');
}

function setCellPressed(target) {
    target.childNodes[1].style.display = '';
    if (prevGridRowStart !== -1) {
        target.childNodes[2].style.display = '';
        target.childNodes[2].className = 'lineShort';
        target.childNodes[2].style.transform = 'rotate(' + evaluateDegrees(target) + 'deg)'
    }
}

function setCellColor(target, color) {
    target.style.borderColor = color;
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
    for (var x = 1; x <= 4; x++)
        for (var y = 1; y <= 4; y++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.style.gridRowStart = x;
            cell.style.gridColumnStart = y;
            cell.id = 4 * x + y - 5;

            const letter = document.createElement('div');
            letter.className = 'letter';
            letter.innerHTML = board[x - 1][y - 1];
            cell.appendChild(letter);

            const dot = document.createElement('div');
            dot.className = 'dot';
            dot.style.display = 'none';
            cell.appendChild(dot);

            const line = document.createElement('div');
            line.style.display = 'none';
            cell.appendChild(line);

            const touch = document.createElement('div');
            touch.className = 'touch';
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
        addLetter(target.childNodes[0].innerHTML);
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