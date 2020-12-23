import { addLetter, clearWord, getWord } from './wordCurrent.js';
import { addWordFound, wordNotFound, isWord } from './wordsFound.js';
import { addPoints } from './score.js';

const svg = document.getElementById('svg');
const gridElement = document.getElementById('grid');
const yellow = 'rgb(220, 220, 40)';
const green = 'rgb(20, 180, 40)';
const blue = 'rgb(40, 80, 240)';
var pressedCells = [];
var prevGridRowStart = -1,
    prevGridColumnStart = -1;
new ResizeObserver(resizeSVG).observe(document.body);

function resizeSVG() {
    svg.setAttribute('width', document.body.clientWidth);
    svg.setAttribute('height', document.body.clientHeight);
}

function getTouch(e) {
    if (e.type === 'mousemove') return document.elementFromPoint(e.clientX, e.clientY);
    else if (e.type === 'touchmove') return document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);
    else return e.target;
}

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

function pressedCellsColorEquals(color) {
    return pressedCells[0] && pressedCells[0].style.color == color;
}

function resetGrid() {
    if (pressedCells.length > 0)
        setLetterPushedOut(pressedCells[pressedCells.length - 1].childNodes[0]);
    pressedCells.forEach(cell => setCellColor(cell, ''));
    pressedCells = [];
    svg.innerHTML = '';
}

function setCellPressed(target) {
    setLetterPushedIn(target.childNodes[0]);
    addCircle(target, 'white');
    if (prevGridRowStart > -1) {
        setLetterPushedOut(pressedCells[pressedCells.length - 2].childNodes[0]);
        addLine(pressedCells[pressedCells.length - 2], target, 'white');
    }
}

function setLetterPushedIn(target) {
    target.style.width = '93%';
    target.style.height = '93%';
    target.style.borderRadius = '30%';
    target.childNodes[0].style.fontSize = '13vmin';
}

function setLetterPushedOut(target) {
    target.style.width = '';
    target.style.height = '';
    target.style.borderRadius = '';
    target.childNodes[0].style.fontSize = '';
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

function addCircle(cell, color) {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    var x = cell.offsetLeft + cell.clientWidth / 2;
    var y = cell.offsetTop + cell.clientHeight / 2;
    circle.setAttribute('fill', color);
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', cell.clientWidth / 13);
    svg.appendChild(circle);
}

function addLine(cell1, cell2, color) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    var x1 = cell1.offsetLeft + cell1.clientWidth / 2;
    var y1 = cell1.offsetTop + cell1.clientHeight / 2;
    var x2 = cell2.offsetLeft + cell2.clientWidth / 2;
    var y2 = cell2.offsetTop + cell2.clientHeight / 2;
    line.setAttribute('stroke-width', cell1.clientWidth / 6.5);
    line.setAttribute('stroke', color);
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    svg.appendChild(line);
}

function addCell(x, y, letterText) {
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
    text.innerHTML = letterText;
    letter.appendChild(text);

    const touch = document.createElement('div');
    touch.className = 'cell-touch';
    cell.appendChild(touch);

    gridElement.appendChild(cell);
}

export function initializeGrid(board) {
    for (var x = 0; x < 4; x++)
        for (var y = 0; y < 4; y++)
            addCell(x, y, board[x][y]);
}

export function press(e) {
    var touch = getTouch(e);
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
    if (pressedCellsColorEquals(green)) {
        addWordFound(getWord());
        addPoints(pressedCells.length);
    }
    clearWord();
    resetGrid();
    prevGridRowStart = -1;
    prevGridColumnStart = -1;
}