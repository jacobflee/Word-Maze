import { Animations } from "./Animations.js";


export class Presenter {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.animations = new Animations(view);
        this.setEventListeners();
        this.setUsername();
    }

    setEventListeners() {
        window.addEventListener('resize', () => this.view.setAppHeight());
        this.view.homeBtns.forEach((homeBtn) => {
            homeBtn.addEventListener('click', () => this.view.returnToHomeScreen());
        });

        this.view.usernameInput.addEventListener('input', () => this.view.setUsernameWidth());
        this.view.usernameForm.addEventListener('submit', (event) => this.updateUsername(event));
        this.view.modeSelectBtns.forEach((modeSelectBtn) => {
            modeSelectBtn.addEventListener('click', (event) => this.selectMode(event.currentTarget.dataset.mode));
        });

        this.view.touchTargets.forEach((touchTarget) => {
            touchTarget.addEventListener('mousedown', () => this.selectCell(touchTarget, true));
            touchTarget.addEventListener('mousemove', () => this.selectCell(touchTarget));
            touchTarget.addEventListener('touchstart', () => this.selectCell(touchTarget, true));
            touchTarget.addEventListener('touchmove', (event) => this.selectTouchedCell(event));
        });
        window.addEventListener('touchcancel', () => this.endWordSelection());
        window.addEventListener('touchend', () => this.endWordSelection());
        window.addEventListener('mouseup', () => this.endWordSelection());
        this.view.resultsBtn.addEventListener('click', () => this.displayResults());
    }

    setUsername() {
        const username = this.model.getUsername();
        this.view.setUsername(username);
        this.view.setUsernameWidth();
    }

    updateUsername(event) {
        event.preventDefault();
        this.view.blurActiveElement();
        const username = this.view.usernameInput.value;
        this.model.setUsername(username);
    }

    // TODO: do some sort of spooling animation when waiting for game data
    async selectMode(mode) {
        this.model.gameState.reset();
        await this.initializeGameData();
        this.view.setCurrentScore(0);
        this.view.updateWordCount(0);
        switch (mode) {
            case 'Timed':
                this.startTimer();
                this.view.selectTimedMode();
                break
            case 'Free Play':
                this.view.selectFreePlayMode();
                break
            case 'VS Friend':
                break
            case 'VS Random':
                break
        }
    }
    
    startTimer() {
        this.model.gameState.startTimer(() => this.updateTimer());
    }

    updateTimer() {
        const gameState = this.model.gameState;
        this.view.updateCountdownTimer(gameState.timeString, gameState.countdownTimerColor);
        if (gameState.secondsRemaining <= 0)
            this.displayResults();
    }

    async initializeGameData() {
        const gameboard = await this.model.getGameboard();
        for (let i = 0; i < 16; i++) {
            const row = Math.floor(i / 4);
            const col = i % 4;
            const text = gameboard[row][col]
            this.view.setLetterText(i, text);
        }
    }

    selectTouchedCell(event) {
        const [x, y] = [event.touches[0].clientX, event.touches[0].clientY];
        const touchTarget = document.elementFromPoint(x, y);
        if (touchTarget?.className === 'touch-target') this.selectCell(touchTarget);
    }

    selectCell(touchTarget, startSelecting = false) {
        const selectionState = this.model.selectionState;
        if (startSelecting) selectionState.setIsSelecting(true);
        if (!selectionState.isSelecting) return;
        const cell = touchTarget.parentElement;
        selectionState.updateTargetCell(cell);
        if (!selectionState.targetCellIsValid) return;
        this.animations.cellSelection(cell.firstElementChild);
        this.drawCircle(cell);
        if (selectionState.lastSelectedRow) this.drawLine(selectionState.lastSelectedCell, cell);
        this.model.addSelectedCell(cell);
        this.view.updateSelectedLetters(
            selectionState.wordDisplay,
            selectionState.wordDisplayBackgroundColor,
            selectionState.wordDisplayColor,
            selectionState.wordDisplayFontWeight,
            selectionState.currentPathColor,
            selectionState.cellsToColor,
            selectionState.currentCellColor
        );
    }

    drawCircle(cell) {
        const cx = cell.offsetLeft + cell.clientWidth / 2
        const cy = cell.offsetTop + cell.clientHeight / 2
        const r = cell.clientWidth / 14.5;
        this.view.drawCircle(cx, cy, r);
    }

    drawLine(startCell, endCell) {
        const strokeWidth = startCell.clientWidth / 6.5;
        const x1 = startCell.offsetLeft + startCell.clientWidth / 2;
        const y1 = startCell.offsetTop + startCell.clientHeight / 2;
        const x2 = endCell.offsetLeft + endCell.clientWidth / 2;
        const y2 = endCell.offsetTop + endCell.clientHeight / 2;
        this.view.drawLine(strokeWidth, x1, y1, x2, y2);
    }

    endWordSelection() {
        const selectionState = this.model.selectionState;
        if (!selectionState?.isSelecting) return;
        const gameState = this.model.gameState;
        if (selectionState.isValidWord) {
            this.animations.scoreIncrease(gameState.score, selectionState.currentWordPoints);
            this.model.addFoundWord();
            this.view.updateWordCount(gameState.wordCount);
        }
        this.animations.wordFadeOut();
        this.view.resetLetterPathAndSelectedCells(selectionState.selectedCells);
        this.model.selectionState.reset();
    }

    displayResults() {
        const gameState = this.model.gameState;
        this.view.displayResults(gameState.score, gameState.longestWord);
        this.animations.barGraph(gameState.wordLengthDistribution, gameState.wordCount);
    }
}