import { addLetter, clearWord, getWord, setWord } from './wordCurrent.js';
import { addWordFound, wordNotFound, isWord } from './wordsFound.js';
import { addPoints, getWordValue } from './score.js';

const svg = document.getElementById('svg');
const gridElement = document.getElementById('grid');
const yellow = 'rgb(220, 220, 40)';
const green = 'rgb(20, 180, 40)';
const blue = 'rgb(40, 80, 240)';
var isDown = false;
var pressedCells = [];
var prevGridRowStart = -1,
    prevGridColumnStart = -1;
new ResizeObserver(resizeSVG).observe(document.body);
declareGrid();

function resizeSVG() {
    svg.style.width = document.body.clientWidth;
    svg.style.height = document.body.clientHeight;
}

function getTouch(e) {
    if (e.type === 'mousemove') return document.elementFromPoint(e.clientX, e.clientY);
    else if (e.type === 'touchmove') return document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);
    else return e.target;
}

function setLineColor(color) {
    svg.style.fill = color;
    svg.style.stroke = color;
}

function lineColorEquals(color) {
    return svg.style.fill === color;
}

function hasValidId(target) {
    return target.style.color === '' && (
        prevGridRowStart === -1 ||
        (Math.abs(target.style.gridRowStart - prevGridRowStart) <= 1 &&
            Math.abs(target.style.gridColumnStart - prevGridColumnStart) <= 1)
    );
}

function pressedCellsColorEquals(color) {
    return pressedCells[0] && pressedCells[0].style.color === color;
}

function resetGrid() {
    pressedCells.forEach(cell => setCellColor(cell, ''));
    pressedCells = [];
    svg.innerHTML = '';
}

function setCellPressed(target) {
    setLetterPushedIn(target.childNodes[0]);
    setLetterPushedOut(target.childNodes[0], 0);
    addCircle(target);
    if (prevGridRowStart > -1) addLine(pressedCells[pressedCells.length - 2], target);
}

function setLetterPushedIn(target) {
    target.style.width = 0.93;
    target.style.height = 0.93;
    target.style.borderRadius = 0.4;
    target.childNodes[0].style.fontSize = '11.5vmin';
}

function setLetterPushedOut(target, count) {
    if (count < 1) {
        target.style.width = 93 + 7 * count + '%';
        target.style.height = target.style.width;
        target.style.borderRadius = 40 - 15 * count + '%';
        target.childNodes[0].style.fontSize = 11.5 + 2 * count + 'vmin';
        setTimeout(() => setLetterPushedOut(target, count + 0.03), 1);
    } else {
        target.style.width = '';
        target.style.height = '';
        target.style.borderRadius = '';
        target.childNodes[0].style.fontWeight = '';
        target.childNodes[0].style.fontSize = '';
    }
}

function setCellColor(target, color) {
    target.childNodes[0].style.borderColor = color;
    target.style.color = color;
}

function setCellsColor(target, color) {
    if (!pressedCellsColorEquals(color)) pressedCells.forEach(cell => setCellColor(cell, color));
    else setCellColor(target, color);
}

function setCellsANDWordColor(word, target) {
    if (isWord(word)) {
        if (lineColorEquals('')) setLineColor('white');
        if (wordNotFound(word)) {
            setCellsColor(target, green);
            setWord(green, getWordValue(pressedCells.length));
        } else {
            setCellsColor(target, yellow);
            setWord(yellow, 0);
        }
    } else {
        if (lineColorEquals('white')) setLineColor('');
        setCellsColor(target, blue);
        setWord('', 0);
    }
}

function addCircle(cell) {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', cell.offsetLeft + cell.clientWidth / 2);
    circle.setAttribute('cy', cell.offsetTop + cell.clientHeight / 2);
    circle.setAttribute('r', cell.clientWidth / 14.5);
    svg.appendChild(circle);
}

function addLine(cell1, cell2) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('stroke-width', cell1.clientWidth / 6.5);
    line.setAttribute('x1', cell1.offsetLeft + cell1.clientWidth / 2);
    line.setAttribute('y1', cell1.offsetTop + cell1.clientHeight / 2);
    line.setAttribute('x2', cell2.offsetLeft + cell2.clientWidth / 2);
    line.setAttribute('y2', cell2.offsetTop + cell2.clientHeight / 2);
    svg.appendChild(line);
}

function declareCell(x, y) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.style.gridRowStart = x + 1;
    cell.style.gridColumnStart = y + 1;
    cell.id = 4 * x + y;

    const letter = document.createElement('div');
    letter.className = 'cell-letter';
    cell.appendChild(letter);

    const text = document.createElement('div');
    text.className = 'cell-letter-text';
    letter.appendChild(text);

    const touch = document.createElement('div');
    touch.className = 'cell-touch';
    touch.onmousedown = () => pressCell(cell, isDown = true);
    touch.onmousemove = () => { if (isDown) pressCell(cell); }
    touch.ontouchstart = () => pressCell(cell);
    touch.ontouchmove = (e) => pressCellIfValidTouch(getTouch(e));
    cell.appendChild(touch);

    gridElement.appendChild(cell);
}

function declareGrid() {
    for (var x = 0; x < 4; x++)
        for (var y = 0; y < 4; y++)
            declareCell(x, y);
}

function initializeCell(cell, board) {
    cell.childNodes[0].childNodes[0].innerHTML = board[cell.style.gridRowStart - 1][cell.style.gridColumnStart - 1];
}

export function initializeGrid(board) {
    gridElement.childNodes.forEach(cell => initializeCell(cell, board));
}

function pressCellIfValidTouch(touch) {
    if (touch && touch.className === 'cell-touch') pressCell(touch.parentNode);
}

function pressCell(target) {
    if (hasValidId(target)) {
        pressedCells.push(target);
        setCellPressed(target);
        addLetter(target.childNodes[0].childNodes[0].innerHTML);
        setCellsANDWordColor(getWord(), target);
        prevGridRowStart = target.style.gridRowStart;
        prevGridColumnStart = target.style.gridColumnStart;
    }
}

export function releaseCells() {
    if (pressedCellsColorEquals(green)) {
        addWordFound(getWord());
        addPoints(getWordValue(pressedCells.length));
    }
    isDown = false;
    clearWord();
    resetGrid();
    prevGridRowStart = -1;
    prevGridColumnStart = -1;
}