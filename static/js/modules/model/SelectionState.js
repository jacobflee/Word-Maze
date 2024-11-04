import { COLORS, POINTS } from '../config.js';


export class SelectionState {
    constructor() {
        this.board = Array.from({ length: 16 }, () => ({}));
        this.reset();
    }

    reset() {
        this.selecting = false;

        this.word = {
            text: '',
            content: '',
            weight: '',
            background: '',
            color: '',
            points: 0,
            valid: false,
            found: false,
        };

        this.cell = {
            index: -1,
            valid: false,
            current: {
                element: null,
                row: 0,
                column: 0,
                color: '',
            },
            previous: {
                element: null,
                row: 0,
                column: 0,
                color: '',
            },
        };

        this.path = {
            elements: [],
            targets: [],
            color: '',
        };

        this.board.forEach((cell) => cell.color = '');
    }

    updateBoard(board) {
        for (let i = 0; i < 16; i++) {
            const row = Math.floor(i / 4);
            const column = i % 4;
            this.board[i] = {
                row: row + 1,
                column: column + 1,
                letter: board[row][column],
                color: '',
            }
        }
    }

    start() {
        this.selecting = true;
    }

    updateTargetCell(element, index) {
        this.cell.current = this.board[i];
        this.cell.current.element = element;
        this.cell.index = index;
        this.cell.valid = this.checkCellValidity();
    }

    checkCellValidity() {
        const { current, previous } = this.cell;
        if (current.color !== '') return false;
        if (previous.row === 0) return true;
        const rowDifference = Math.abs(current.row - previous.row);
        const columnDifferent = Math.abs(current.column - previous.column);
        return rowDifference <= 1 && columnDifferent <= 1;
    }

    updateSelectedCell() {
        this.path.elements.push(this.cell.current.element);
        this.word.text += this.cell.letter;
        this.cell.previous = { ...this.cell.current };
    }

    updateValidatedCell(valid, found) {
        const word = this.word;
        const cell = this.cell.current;
        const path = this.path;
        word.valid = valid;
        word.found = found;
        let cellColor;
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
            cellColor = color;
        } else {
            word.background = '';
            word.color = '';
            word.weight = '';
            word.content = word.text;
            cell.color = COLORS.SELECTED;
            path.color = '';
            cellColor = COLORS.SELECTED;
        }
        path.targets = this.cell.previous.color === cell.color
            ? [cell.element]
            : path.elements;
        path.targets.forEach((element) => {
            const i = element.dataset.index; // LMAO I thought we werent accessing element attrs in model mmm?
            this.board[i].color = cellColor;
        })
    }
}