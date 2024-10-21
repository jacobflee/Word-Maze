import { secondsToMSS, easeOutExponential, smoothStep } from './utils.js'


export class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.model.resetGameState();
        this.view.setAppHeight();
        this.view.returnToHomeScreen();
        this.setEventListeners();
        this.setUsername();
    }

    /*................................GLOBAL................................*/
    /*................................HOME SCREEN................................*/
    /*................................GAME SCREEN................................*/
    
    setUsername() {
        const username = this.model.getUsername();
        if (username) this.view.setUsername(username);
        this.view.setUsernameWidth();
    }

    setEventListeners() {
        window.addEventListener('resize', () => this.view.setAppHeight());
        this.view.usernameInput.addEventListener('input', () => this.view.setUsernameWidth());
        this.view.homeBtns.forEach((homeBtn) => {
            homeBtn.addEventListener('click', () => this.view.returnToHomeScreen());
        });
        this.view.modeSelectBtns.forEach((modeSelectBtn) => {
            modeSelectBtn.addEventListener('click', (event) => this.selectMode(event));
        });
        this.view.usernameForm.addEventListener('submit', (event) => this.updateUsername(event));
        this.view.touchTargets.forEach((touchTarget) => {
            const cell = touchTarget.parentElement;
            touchTarget.addEventListener('mousedown', () => this.selectCell(cell, true));
            touchTarget.addEventListener('mousemove', () => this.selectCell(cell));
            touchTarget.addEventListener('touchstart', () => this.selectCell(cell, true));
            touchTarget.addEventListener('touchmove', (event) => this.selectTouchedCell(event));
        });
        window.addEventListener('touchcancel', () => this.endWordSelection());
        window.addEventListener('touchend', () => this.endWordSelection());
        window.addEventListener('mouseup', () => this.endWordSelection());
    }

    updateUsername(event) {
        event.preventDefault();
        document.activeElement.blur();
        const formData = new FormData(event.target);
        const username = formData.get('username');
        this.model.setUsername(username);
    }

    async selectMode(event) {
        this.model.resetGameState();
        this.initializeGameData();
        this.view.setCurrentScore(0);
        this.view.updateWordCount(0);
        const mode = event.currentTarget.dataset.mode;
        switch (mode) {
            case 'Timed':
                this.view.selectTimedMode();
                this.startTimer();
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

    async initializeGameData() {
        const gameboard = await this.model.getGameboard();
        for (let i = 0; i < 16; i++) {
            const row = Math.floor(i / 4);
            const col = i % 4;
            const text = gameboard[row][col]
            this.view.setLetterText(i, text);
        }
    }

    startTimer() {
        this.model.decrementSecondsRemaining();
        const gameState = this.model.getGameState();
        const timeString = secondsToMSS(gameState.secondsRemaining);
        this.view.updateCountdownTimer(timeString);
        if (gameState.secondsRemaining > 0) setTimeout(() => this.startTimer(), 1000);
        else {
            this.view.displayResults(gameState.score, gameState.longestWord);
            this.animateBarGraph();
        }
    }

    animateBarGraph(frame = 0) {
        const gameState = this.model.getGameState();
        const frames = 120;
        if (frame > frames) return;
        const progress = easeOutExponential(frame / frames);
        for (let i = 0; i < 13; i++) {
            const wordLengthCount = gameState.wordLengthDistribution[i + 3];
            const width = `${100 * progress * wordLengthCount / gameState.wordCount}%`;
            const count = Math.round(progress * wordLengthCount);
            this.view.updateChartBar(i, width, count);
        }
        requestAnimationFrame(() => this.animateBarGraph(frame + 1));
    }

    selectTouchedCell(event) {
        const [x, y] = [event.touches[0].clientX, event.touches[0].clientY];
        const cell = document.elementFromPoint(x, y);
        if (cell?.className === 'cell-touch-area') this.selectCell(cell.parentNode);
    }

    selectCell(cell, startSelecting = false) {
        const gameState = this.model.getGameState();
        if (startSelecting) this.model.setIsSelecting(true);
        if (!gameState.isSelecting || !this.isValidCellSelection(cell)) return;
        this.animateCellSelection(cell.firstElementChild);
        this.drawCircle(cell);
        const lastCell = gameState.selectedCells.at(-1);
        if (gameState.lastSelectedRow > -1) this.drawLine(lastCell, cell);
        this.model.addSelectedCell(cell);
        this.model.addToSelectedLettersString(cell.firstElementChild.textContent);
        this.updateWordAndCellColors(cell);
        this.model.updateLastSelectedPosition(cell);
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

    animateCellSelection(cell, frame = 0) {
        const frames = 12;
        if (frame > frames) {
            this.view.setCellStyle(cell, '', '', '');
        } else {
            const progress = frame / frames;
            this.view.setCellStyle(cell, `${93 + 7 * progress}%`, `${40 - 15 * progress}%`, `calc(${11.5 + 2 * progress} * var(--base-unit))`);
            requestAnimationFrame(() => this.animateCellSelection(cell, frame + 1));
        }
    }

    isValidCellSelection(cell) {
        const gameState = this.model.getGameState();
        if (cell.style.color !== '') return false;
        if (gameState.lastSelectedRow === -1) return true;
        const rowDiff = Math.abs(cell.style.gridRowStart - gameState.lastSelectedRow);
        const colDiff = Math.abs(cell.style.gridColumnStart - gameState.lastSelectedColumn);
        return rowDiff <= 1 && colDiff <= 1;
    }

    updateWordAndCellColors(cell) {
        const gameState = this.model.getGameState();
        const word = gameState.selectedLetters;
        const words = gameState.validWords[word.length];
        const isValidWord = words && words.has(word);
        if (!isValidWord) {
            this.view.setLetterPathColor('');
            this.setCellsColor(gameState.selectedCells, cell, this.model.COLORS.SELECTED);
            this.updateWordDisplay(gameState.selectedLetters, '', 0);
            return;
        }
        this.view.setLetterPathColor('white');
        if (gameState.foundWords[word.length].has(word)) {
            this.setCellsColor(gameState.selectedCells, cell, this.model.COLORS.DUPLICATE);
            this.updateWordDisplay(gameState.selectedLetters, this.model.COLORS.DUPLICATE, 0);
        } else {
            this.setCellsColor(gameState.selectedCells, cell, this.model.COLORS.VALID);
            this.updateWordDisplay(gameState.selectedLetters, this.model.COLORS.VALID, this.model.POINTS[gameState.selectedCells.length]);
        }
    }

    setCellsColor(selectedCells, cell, color) {
        if (selectedCells[0]?.style.color === color) selectedCells = [cell];
        selectedCells.forEach((cell) => this.view.setCellColor(cell, color));
    }

    endWordSelection() {
        const gameState = this.model.getGameState();
        if (!gameState.isSelecting) return;
        const firstCell = gameState.selectedCells[0];
        const isValidWord = firstCell?.style.color === this.model.COLORS.VALID;
        if (isValidWord) {
            this.model.incrementWordCount();
            this.model.addFoundWord();
            if (gameState.selectedLetters.length > gameState.longestWord.length) {
                this.model.updateLongestWord();
            }
            this.view.updateWordCount(gameState.wordCount);
            const points = this.model.POINTS[gameState.selectedCells.length];
            this.animateScoreIncrease(gameState.score, points);
            this.model.increaseScore(points);
        }
        this.view.resetLetterPath();
        gameState.selectedCells.forEach((cell) => this.view.setCellColor(cell, ''));
        this.animateWordFadeOut();
        this.model.resetCellSelection();
    }



    animateScoreIncrease(score, points, frame = 0) {
        const frames = 28;
        if (frame > frames) {
            this.view.setCurrentScore(score + points);
        } else {
            const progress = smoothStep(frame / frames);
            this.view.setCurrentScore(score + Math.round(points * progress));
            requestAnimationFrame(() => this.animateScoreIncrease(score, points, frame + 1));
        }
    }

    animateWordFadeOut(frame = 0) {
        const frames = 12;
        if (frame > frames) {
            this.view.resetSelectedLetters();
        } else {
            const progress = smoothStep(frame / frames);
            this.view.setSelectedLettersOpacity(1 - progress);
            requestAnimationFrame(() => this.animateWordFadeOut(frame + 1));
        }
    }

    updateWordDisplay(selectedLetters, color, value) {
        if (color === '') {
            this.view.setSelectedLettersStyle('', '', '');
        } else {
            this.view.setSelectedLettersStyle(color, 'black', 500);
        }
        if (value <= 0) {
            this.view.setSelectedLettersText(selectedLetters);
        } else {
            this.view.setSelectedLettersText(`${selectedLetters} (+${value})`);
        }
    }

    /*................................RESULTS SCREEN................................*/

}