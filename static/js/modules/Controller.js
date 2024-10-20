import { Model } from './Model.js'
import { View } from './View.js'
import { API } from './API.js'


export const Controller = (() => {
    function init() {
        setEventListeners();
    }

    function setEventListeners() {
        window.addEventListener('resize', View.setAppHeight);
        View.ELEMENTS.gameModeButtons.forEach((gameModeButton) => {
            gameModeButton.addEventListener('click', selectGameMode);
        });
        View.ELEMENTS.backButtons.forEach((backButton) => {
            backButton.addEventListener('click', View.returnToMainMenu);
        });
        View.ELEMENTS.usernameInput.addEventListener('input', View.setUsernameInputWidth);
        View.ELEMENTS.usernameForm.addEventListener('submit', updateUsername);
        View.ELEMENTS.cellTouchAreas.forEach((cellTouchArea) => {
            const cell = cellTouchArea.parentElement;
            cellTouchArea.addEventListener('mousedown', () => selectCell(cell, true));
            cellTouchArea.addEventListener('mousemove', () => selectCell(cell));
            cellTouchArea.addEventListener('touchstart', () => selectCell(cell, true));
            cellTouchArea.addEventListener('touchmove', selectTouchedCell);
        });
        window.addEventListener('touchcancel', endWordSelection);
        window.addEventListener('touchend', endWordSelection);
        window.addEventListener('mouseup', endWordSelection);
    }

    function updateUsername(event) {
        event.preventDefault();
        document.activeElement.blur();
        const formData = new FormData(event.target);
        const username = formData.get('username');
        localStorage.setItem('username', username);
    }

    async function selectGameMode(event) {
        const gameMode = event.currentTarget.dataset.gameMode;
        switch (gameMode) {
            case 'Timed':
                Model.resetGameState();
                initializeGameData();
                View.selectTimed();
                startTimer();
                break
            case 'Free Play':
                initializeGameData();
                View.selectFreePlay();
                break
            case 'VS Friend':
                break
            case 'VS Random':
                break
        }
    }

    async function initializeGameData() {
        const gameData = await API.getGameData();
        Model.updateValidWords(gameData.words);
        View.populateGameboard(gameData.board);

    }

    function startTimer() {
        Model.decrementSecondsRemaining();
        const gameState = Model.getGameState();
        View.updateTimer(gameState.secondsRemaining);
        if (gameState.secondsRemaining > 0) setTimeout(startTimer, 1000);
        else View.displayResults(
            gameState.score,
            gameState.longestWord,
            gameState.wordLengthDistribution,
            gameState.wordCount
        );
    }

    function selectTouchedCell(event) {
        const cell = View.getCellFromTouch(event.touches[0]);
        if (cell?.className === 'cell-touch-area') selectCell(cell.parentNode);
    }

    function selectCell(cell, startSelecting = false) {
        const gameState = Model.getGameState();
        if (startSelecting) Model.setIsSelecting(true);
        if (!gameState.isSelecting || !isValidCellSelection(cell)) return;
        View.animateCellSelection(cell.querySelector('.cell-letter'));
        View.drawCircle(cell);
        const lastCell = gameState.selectedCells.at(-1);
        if (gameState.lastSelectedRow > -1) View.drawLine(lastCell, cell);
        Model.addSelectedCell(cell);
        Model.addToCurrentWordString(cell.querySelector('.cell-letter').textContent);
        updateWordAndCellColors(cell);
        Model.updateLastSelectedPosition(cell);
    }

    function isValidCellSelection(cell) {
        const gameState = Model.getGameState();
        if (cell.style.color !== '') return false;
        if (gameState.lastSelectedRow === -1) return true;
        const rowDiff = Math.abs(cell.style.gridRowStart - gameState.lastSelectedRow);
        const colDiff = Math.abs(cell.style.gridColumnStart - gameState.lastSelectedColumn);
        return rowDiff <= 1 && colDiff <= 1;
    }

    function updateWordAndCellColors(cell) {
        const gameState = Model.getGameState();
        const word = gameState.currentWordString;
        const words = gameState.validWords[word.length];
        const isValidWord = words && words.has(word);
        if (!isValidWord) {
            View.setGameSvgColor('');
            View.setCellsColor(gameState.selectedCells, cell, Model.COLORS.SELECTED);
            View.updateWordDisplay(gameState.currentWordString, '', 0);
            return;
        }
        View.setGameSvgColor('white');
        if (gameState.foundWords[word.length].has(word)) {
            View.setCellsColor(gameState.selectedCells, cell, Model.COLORS.DUPLICATE);
            View.updateWordDisplay(gameState.currentWordString, Model.COLORS.DUPLICATE, 0);
        } else {
            View.setCellsColor(gameState.selectedCells, cell, Model.COLORS.VALID);
            View.updateWordDisplay(gameState.currentWordString, Model.COLORS.VALID, Model.POINTS[gameState.selectedCells.length]);
        }
    }

    function endWordSelection() {
        const gameState = Model.getGameState();
        if (!gameState.isSelecting) return;
        const firstCell = gameState.selectedCells[0];
        const isValidWord = firstCell?.style.color === Model.COLORS.VALID;
        if (isValidWord) {
            Model.incrementWordCount();
            Model.addFoundWord();
            if (gameState.currentWordString.length > gameState.longestWord.length) {
                Model.updateLongestWord();
            }
            View.updateWordCount(gameState.wordCount);
            const points = Model.POINTS[gameState.selectedCells.length];
            View.animateScoreIncrease(gameState.score, points);
            Model.increaseScore(points);
        }
        View.resetGameSvg();
        View.resetCellsStyle(gameState.selectedCells);
        View.animateWordFadeOut();
        Model.resetCellSelection();
    }

    return {
        init
    };
})();