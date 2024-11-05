export class Board {
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    handleCellInteraction(event) {
        const selectionState = this.model.selectionState;
        const start = ['mousedown', 'touchstart'].includes(event.type);
        if (start) selectionState.start();
        if (!selectionState.selecting) return;
        if (event.type === 'touchmove') {
            var touchTarget = this.view.getElementAtTouchPoint(event.touches[0]);
            if (touchTarget?.className !== 'touch-target') return;
        } else
            var touchTarget = event.currentTarget;
        const index = touchTarget.parentElement.dataset.index;
        selectionState.updateTargetCell(index);
        if (!selectionState.cell.current.valid) return;
        const cell = this.view.cells[index].firstElementChild;
        this.view.animations.cellSelection(cell);
        this.drawPath();
        this.model.addSelectedCell();
        this.view.updateSelectedLetters();
    }

    drawPath() {
        this.drawSelectionCircle();
        if (this.model.selectionState.cell.previous.data) this.drawConnectionLine();
    }

    drawSelectionCircle() {
        const index = this.model.selectionState.cell.current.index;
        const cell = this.view.cells[index];
        const [cx, cy] = this.getCellCenter(cell);
        const r = cell.clientWidth / 14.5;
        this.view.createSelectionCircle(cx, cy, r);
    }

    drawConnectionLine() {
        const { current, previous } = this.model.selectionState.cell;
        const currentCell = this.view.cells[current.index];
        const previousCell = this.view.cells[previous.index];
        const strokeWidth = currentCell.clientWidth / 6.5;
        const [x1, y1] = this.getCellCenter(previousCell);
        const [x2, y2] = this.getCellCenter(currentCell);
        this.view.createConnectionLine(strokeWidth, x1, y1, x2, y2);
    }

    getCellCenter(cell) {
        const x = cell.offsetLeft + cell.clientWidth / 2;
        const y = cell.offsetTop + cell.clientHeight / 2;
        return [x, y];
    }

    endSelection() {
        const { selecting, word } = this.model.selectionState;
        if (!selecting) return;
        if (word.valid && !word.found) {
            this.view.animations.scoreIncrease(this.model.gameState.game.score, word.points);
            this.model.addFoundWord();
            this.view.updateWordCount();
        }
        this.view.animations.wordFadeOut();
        this.view.resetLetterPathAndSelectedCells();
        this.model.selectionState.reset();
    }
}