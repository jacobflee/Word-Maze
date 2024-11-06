export class Game {
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    startTimer() {
        this.model.game.startTimer(() => this.updateTimer());
    }

    updateTimer() {
        this.view.game.updateTimer();
        if (this.model.game.time.seconds === 0) {
            this.displayResults();
        }
    }

    handleCellInteraction(event) {
        const selection = this.model.selection;
        const start = ['mousedown', 'touchstart'].includes(event.type);
        if (start) {
            selection.start();
        }
        if (!selection.selecting) return
        if (event.type === 'touchmove') {
            var touchTarget = this.view.getElementAtTouchPoint(event.touches[0]);
            if (touchTarget?.className !== 'touch-target') return
        } else {
            var touchTarget = event.currentTarget;
        }
        const index = touchTarget.parentElement.dataset.index;
        selection.updateTargetCell(index);
        if (!selection.cell.current.valid) return
        this.view.animations.cellSelection(this.view.game.letters[index]);
        this.drawPath();
        this.model.addSelectedCell();
        this.view.game.updateSelectedLetters();
    }

    drawPath() {
        this.drawSelectionCircle();
        if (this.model.selection.cell.previous.data) {
            this.drawConnectionLine();
        }
    }

    drawSelectionCircle() {
        const index = this.model.selection.cell.current.index;
        const cell = this.view.game.cells[index];
        const [cx, cy] = this.getCellCenter(cell);
        const r = cell.clientWidth / 14.5;
        this.view.game.createSelectionCircle(cx, cy, r);
    }

    drawConnectionLine() {
        const { current, previous } = this.model.selection.cell;
        const currentCell = this.view.game.cells[current.index];
        const previousCell = this.view.game.cells[previous.index];
        const strokeWidth = currentCell.clientWidth / 6.5;
        const [x1, y1] = this.getCellCenter(previousCell);
        const [x2, y2] = this.getCellCenter(currentCell);
        this.view.game.createConnectionLine(strokeWidth, x1, y1, x2, y2);
    }

    getCellCenter(cell) {
        const x = cell.offsetLeft + cell.clientWidth / 2;
        const y = cell.offsetTop + cell.clientHeight / 2;
        return [x, y]
    }

    endSelection() {
        const { selecting, word } = this.model.selection;
        if (!selecting) return
        if (word.valid && !word.found) {
            this.view.animations.scoreIncrease(this.model.game.game.score, word.points);
            this.model.addFoundWord();
            this.view.game.updateWordCount();
        }
        this.view.animations.wordFadeOut();
        this.view.game.resetLetterPathAndSelectedCells();
        this.model.selection.reset();
    }
}