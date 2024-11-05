import { COLORS, POINTS } from '../config.js';


export class SelectionState {
    constructor() {
        this.cells = Array.from({ length: 16 }, () => ({}));
        this.reset();
    }

    reset() {
        this.selecting = false;

        this.word = {
            text: '',
            points: 0,
            valid: false,
            found: false,
            textContent: '',
            fontWeight: '',
            backgroundColor: '',
            color: '',
        };

        this.cell = {
            current: {
                valid: false,
                index: -1,
                data: null,
            },
            previous: {
                index: -1,
                data: null,
            },
        };

        this.path = {
            indices: [],
            targets: [],
            color: '',
        };

        this.cells.forEach((cell) => cell.color = '');
    }

    updateBoard(board) {
        this.cells.forEach((cell, index) => {
            const row = Math.floor(index / 4);
            const column = index % 4;
            cell.row = row + 1;
            cell.column = column + 1;
            cell.letter = board[row][column];
        });
    }

    start() {
        this.selecting = true;
    }

    updateTargetCell(index) {
        const { cell, cells } = this;
        cell.current.index = index;
        cell.current.data = cells[index];
        cell.current.valid = this.checkCellValidity();
    }

    checkCellValidity() {
        const { current, previous } = this.cell;
        if (current.data.color !== '') return false; // cell is already selected
        if (!previous.data) return true; // cell is the first selected
        const rowDifference = Math.abs(current.data.row - previous.data.row);
        const columnDifferent = Math.abs(current.data.column - previous.data.column);
        return rowDifference <= 1 && columnDifferent <= 1; // cell is within one space of previous
    }

    updateSelectedCell() {
        const { word, cell, path } = this;
        path.indices.push(cell.current.index);
        word.text += cell.current.data.letter;
    }

    updateValidatedCell(valid, found) {
        const { word, cell, path, cells } = this;
        word.valid = valid;
        word.found = found;
        if (valid) {
            const points = POINTS[word.text.length];
            const color = found
                ? COLORS.DUPLICATE
                : COLORS.VALID;
            word.points = points;
            word.backgroundColor = color;
            word.color = COLORS.WORD_VALID;
            word.fontWeight = 500;
            word.textContent = found
                ? word.text
                : `${word.text} (+${points})`;
            cell.current.data.color = color;
            path.color = COLORS.LETTER_PATH_VALID;
        } else {
            word.backgroundColor = '';
            word.color = '';
            word.fontWeight = '';
            word.textContent = word.text;
            cell.current.data.color = COLORS.SELECTED;
            path.color = '';
        }
        if (cell.previous.data?.color === cell.current.data.color) {
            path.targets = [cell.current.index];
        } else {
            path.targets = path.indices;
            path.targets.forEach((index) => cells[index].color = cell.current.data.color);
        }
        cell.previous.index = cell.current.index;
        cell.previous.data = cell.current.data;
    }
}