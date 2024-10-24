import { COLORS, POINTS } from '../config.js';


export class SelectionState {
    constructor() {
        this.reset();
    }

    reset() {
        this.selectedLetters = '';
        this.isSelecting = false;
        this.isValidWord = false;
        this.isFoundWord = false;
        this.lastSelectedRow = null;
        this.lastSelectedColumn = null;
        this.selectedCells = [];
        this.currentCellColor = '';
        this.previousCellsColor = '';
        this.lastSelectedCell = null;
        this.currentPathColor = null;
        this.wordDisplay = '';
        this.wordDisplayBackgroundColor = null;
        this.wordDisplayColor = null;
        this.wordDisplayFontWeight = null;
        this.cellsToColor = [];
        this.currentWordPoints = 0;
        this.targetCell = null;
        this.targetCellIsValid = false;
    }

    updateTargetCell(targetCell) {
        this.targetCell = targetCell;
        this.targetCellIsValid = this.isTargetCellValid();
    }

    isTargetCellValid() {
        if (this.targetCell.style.color !== '') return false;
        if (!this.lastSelectedRow) return true;
        const rowDiff = Math.abs(this.targetCell.style.gridRowStart - this.lastSelectedRow);
        const colDiff = Math.abs(this.targetCell.style.gridColumnStart - this.lastSelectedColumn);
        return rowDiff <= 1 && colDiff <= 1;
    }

    setIsSelecting(value) {
        this.isSelecting = value;
    }

    updateValidity(isValidWord, isFoundWord) {
        this.isValidWord = isValidWord;
        this.isFoundWord = isFoundWord;
    }

    addCellBeforeValidation(cell) {
        this.selectedCells.push(cell);
        this.lastSelectedCell = cell;
        this.selectedLetters += cell.firstElementChild.textContent;
        this.lastSelectedRow = cell.style.gridRowStart;
        this.lastSelectedColumn = cell.style.gridColumnStart;
    }

    updateCellAfterValidation(cell) {
        this.previousCellsColor = this.currentCellColor;
        if (this.isValidWord) {
            const color = this.isFoundWord ? COLORS.DUPLICATE : COLORS.VALID;
            this.currentCellColor = color;
            this.currentPathColor = COLORS.LETTER_PATH_VALID;
            this.currentWordPoints = POINTS[this.selectedLetters.length];
            this.wordDisplayBackgroundColor = color;
            this.wordDisplay = `${this.selectedLetters} (+${this.currentWordPoints})`;
            this.wordDisplayColor = COLORS.WORD_VALID;
            this.wordDisplayFontWeight = 500;
        } else {
            this.currentCellColor = COLORS.SELECTED;
            this.currentPathColor = '';
            this.wordDisplay = this.selectedLetters;
            this.wordDisplayBackgroundColor = '';
            this.wordDisplayColor = '';
            this.wordDisplayFontWeight = '';
        }
        if (this.previousCellsColor === this.currentCellColor)
            this.cellsToColor = [cell];
        else
            this.cellsToColor = this.selectedCells;
    }
}