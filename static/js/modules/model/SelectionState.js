import { COLORS, POINTS } from '../config.js';


export class SelectionState {
    constructor() {
        this.reset();
    }

    reset() {
        this.selecting = false;

        this.current = {
            word: {
                text: '',
                content: '',
                weight: '',
                background: '',
                color: '',
                points: 0,
                valid: false,
                found: false,
            },
            cell: {
                element: null,
                color: '',
                letter: '',
                row: null,
                column: null,
                valid: false,
            },
            path: {
                elements: [],
                color: '',
                targets: [],
            }
        };

        this.previous = {
            cell: {
                element: null,
                color: '',
                row: null,
                column: null,
            }
        };
    }

    start() {
        this.selecting = true;
    }

    updateTargetCell(cell) {
        this.current.cell = {
            element: cell,
            color: cell.style.color,
            letter: cell.firstElementChild.textContent,
            row: cell.style.gridRowStart,
            column: cell.style.gridColumnStart,
        }
        this.current.cell.valid = this.checkCellValidity();
    }

    checkCellValidity() {
        if (this.current.cell.color !== '') return false;
        if (!this.previous.cell.row) return true;
        const rowDifference = Math.abs(this.current.cell.row - this.previous.cell.row);
        const columnDifferent = Math.abs(this.current.cell.column - this.previous.cell.column);
        return rowDifference <= 1 && columnDifferent <= 1;
    }

    updateSelectedCell() {
        const { word, cell, path } = this.current;
        path.elements.push(cell.element);
        word.text += cell.letter;
        this.previous.cell = { ...cell };
    }

    updateValidatedCell(valid, found) {
        const { word, cell, path } = this.current;
        word.valid = valid;
        word.found = found;
        if (valid) {
            const points = POINTS[word.text.length];
            const color = found
                ? COLORS.DUPLICATE
                : COLORS.VALID;
            word.points = points;
            word.background = color;
            word.color = COLORS.WORD_VALID;
            word.weight = 500;
            word.content = found
                ? word.text
                : `${word.text} (+${points})`;
            cell.color = color;
            path.color = COLORS.LETTER_PATH_VALID;
        } else {
            word.background = '';
            word.color = '';
            word.weight = '';
            word.content = word.text;
            cell.color = COLORS.SELECTED;
            path.color = '';
        }
        path.targets = this.previous.cell.color === cell.color
            ? [cell.element]
            : path.elements;
    }
}