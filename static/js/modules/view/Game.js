import { zip, pluck } from '../utils.js'


export class Game {
    constructor(model) {
        this.model = model;
        
        this.letterPath = document.getElementById('letter-path');
        this.countdownTimer = document.getElementById('countdown-timer');
        this.wordCounter = document.getElementById('word-counter');
        this.selectedLetters = document.getElementById('selected-letters');
        this.cells = document.querySelectorAll('.cell');
        this.letters = document.querySelectorAll('.letter');
    }

    updateTimer() {
        const time = this.model.game.time;
        this.countdownTimer.textContent = time.text;
        this.countdownTimer.style.color = time.color;
    }

    createSelectionCircle(cx, cy, r) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', cx);
        circle.setAttribute('cy', cy);
        circle.setAttribute('r', r);
        this.letterPath.appendChild(circle);
    }

    createConnectionLine(strokeWidth, x1, y1, x2, y2) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('stroke-width', strokeWidth);
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        this.letterPath.appendChild(line);
    }

    updateWordCount() {
        this.wordCounter.textContent = `Words: ${this.model.game.words.count}`;
    }

    setLetters() {
        for (const [letter, cell] of zip(this.letters, this.model.selection.cells)) {
            letter.textContent = cell.letter
        }
    }

    resetLetterPathAndSelectedCells() {
        this.letterPath.innerHTML = '';
        for (const letter of pluck(this.letters, this.model.selection.path.indices)) {
            this.setCellColor(letter, '')
        }
    }

    updateSelectedLetters() {
        const { word, path, cell } = this.model.selection;
        this.selectedLetters.textContent = word.textContent;
        this.selectedLetters.style.backgroundColor = word.backgroundColor;
        this.selectedLetters.style.color = word.color;
        this.selectedLetters.style.fontWeight = word.fontWeight;
        this.letterPath.style.fill = path.color;
        this.letterPath.style.stroke = path.color;
        for (const letter of pluck(this.letters, path.targets)) {
            this.setCellColor(letter, cell.current.data.color)
        }
    }

    setCellColor(letter, color) {
        letter.style.borderColor = color;
        letter.style.color = color;
    }
}