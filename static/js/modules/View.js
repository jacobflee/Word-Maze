import { Utils } from './Utils.js'


export const View = (() => {
    const ELEMENTS = {
        screens: document.querySelectorAll('.screen'),
        backButtons: document.querySelectorAll('.back-button'),

        mainMenuScreen: document.getElementById('main-menu-screen'),
        usernameForm: document.getElementById('username-form'),
        usernameInput: document.querySelector('#username-form input'),
        gameModeButtons: document.querySelectorAll('.game-mode-button'),

        gameScreen: document.getElementById('game-screen'),
        gameSvg: document.getElementById('game-svg'),
        gameTimer: document.getElementById('game-timer'),
        wordCounter: document.getElementById('word-counter'),
        gameScore: document.getElementById('game-score'),
        currentWord: document.getElementById('current-word'),
        gameBoard: document.getElementById('game-board'),
        cellLetters: document.querySelectorAll('.cell-letter'),
        cellTouchAreas: document.querySelectorAll('.cell-touch-area'),

        resultsScreen: document.getElementById('results-screen'),
        finalScore: document.getElementById('final-score'),
        longestWord: document.getElementById('longest-word'),
        barFills: document.querySelectorAll('.bar-fill'),
        barValues: document.querySelectorAll('.bar-value'),
    };

    function init() {
        setAppHeight();
        setUsername();
        setUsernameInputWidth();
        returnToMainMenu();
    }

    function setAppHeight() {
        document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
    }

    function setUsername() {
        ELEMENTS.usernameInput.value = localStorage.getItem('username');
    }

    function setUsernameInputWidth() {
        ELEMENTS.usernameInput.style.width = `${Math.max(ELEMENTS.usernameInput.value.length, 15)}ch`;
    }

    function returnToMainMenu() {
        changeScreen(ELEMENTS.mainMenuScreen);
    }

    function changeScreen(screen) {
        ELEMENTS.screens.forEach((screen) => screen.style.display = 'none');
        screen.style.display = '';
    }

    function selectTimed() {
        ELEMENTS.backButtons.forEach((backButton) => backButton.style.display = 'none');
        ELEMENTS.gameTimer.style.display = '';
        changeScreen(ELEMENTS.gameScreen);
    }

    function selectFreePlay() {
        ELEMENTS.backButtons.forEach((backButton) => backButton.style.display = '');
        ELEMENTS.gameTimer.style.display = 'none';
        changeScreen(ELEMENTS.gameScreen);
    }

    function selectVSFriend() {
        // implement
    }

    function selectVSRandom() {
        // implement
    }

    function updateTimer(secondsRemaining) {
        ELEMENTS.gameTimer.textContent = Utils.secondsToMSS(secondsRemaining);
    }

    function displayResults(gameScore, longestWord, wordLengthDistribution, wordCount) {
        console.log(gameScore);
        console.log(longestWord);
        console.log(wordLengthDistribution);
        console.log(wordCount);
        ELEMENTS.backButtons.forEach((backButton) => backButton.style.display = '');
        ELEMENTS.finalScore.textContent = gameScore;
        ELEMENTS.longestWord.textContent = longestWord;
        animateBarGraph(wordLengthDistribution, wordCount);
        changeScreen(ELEMENTS.resultsScreen);
    }

    function animateBarGraph(wordLengthDistribution, wordCount, frame = 0) {
        const frames = 80;
        if (frame > frames) return;
        const progress = Utils.easeOutQuadratic(frame / frames);
        for (let i = 0; i < 13; i++) {
            const barFill = ELEMENTS.barFills[i];
            const barValue = ELEMENTS.barValues[i];
            const wordLengthCount = wordLengthDistribution[i + 3];
            barFill.style.width = `${100 * progress * wordLengthCount / wordCount}%`;
            barValue.textContent = Math.round(progress * wordLengthCount);
        }
        requestAnimationFrame(() => animateBarGraph(wordLengthDistribution, wordCount, frame + 1));
    }

    function animateCellSelection(cell, frame = 0) {
        const frames = 12;
        if (frame > frames) {
            cell.style.width = '';
            cell.style.height = '';
            cell.style.borderRadius = '';
            cell.style.fontSize = '';
        } else {
            const progress = frame / frames;
            cell.style.width = `${93 + 7 * progress}%`;
            cell.style.height = cell.style.width;
            cell.style.borderRadius = `${40 - 15 * progress}%`;
            cell.style.fontSize = `calc(${11.5 + 2 * progress} * var(--base-unit))`;
            requestAnimationFrame(() => animateCellSelection(cell, frame + 1));
        }
    }

    function getCellFromTouch(touch) {
        return document.elementFromPoint(touch.clientX, touch.clientY);
    }

    function populateGameboard(gameboard) {
        ELEMENTS.cellLetters.forEach((cellLetter, index) => {
            const row = Math.floor(index / 4);
            const col = index % 4;
            cellLetter.textContent = gameboard[row][col];
        });
    }

    function drawCircle(cell) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', cell.offsetLeft + cell.clientWidth / 2);
        circle.setAttribute('cy', cell.offsetTop + cell.clientHeight / 2);
        circle.setAttribute('r', cell.clientWidth / 14.5);
        ELEMENTS.gameSvg.appendChild(circle);
    }
    
    function drawLine(startCell, endCell) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('stroke-width', startCell.clientWidth / 6.5);
        line.setAttribute('x1', startCell.offsetLeft + startCell.clientWidth / 2);
        line.setAttribute('y1', startCell.offsetTop + startCell.clientHeight / 2);
        line.setAttribute('x2', endCell.offsetLeft + endCell.clientWidth / 2);
        line.setAttribute('y2', endCell.offsetTop + endCell.clientHeight / 2);
        ELEMENTS.gameSvg.appendChild(line);
    }

    function resetGameSvg() {
        ELEMENTS.gameSvg.innerHTML = '';
    }

    function setGameSvgColor(value) {
        ELEMENTS.gameSvg.style.fill = value;
        ELEMENTS.gameSvg.style.stroke = value;
    }

    function setCellsColor(selectedCells, cell, color) {
        const firstCell = selectedCells[0];
        const cells = firstCell?.style.color === color ? [cell] : selectedCells;
        cells.forEach((cell) => {
            cell.querySelector('.cell-letter').style.borderColor = color;
            cell.style.color = color;
        });
    }

    function updateWordDisplay(currentWordString, color, value) {
        if (color === '') {
            ELEMENTS.currentWord.style.backgroundColor = '';
            ELEMENTS.currentWord.style.color = '';
            ELEMENTS.currentWord.style.fontWeight = '';
        } else {
            ELEMENTS.currentWord.style.backgroundColor = color;
            ELEMENTS.currentWord.style.color = 'black';
            ELEMENTS.currentWord.style.fontWeight = 500;
        }
        if (value <= 0) {
            ELEMENTS.currentWord.textContent = currentWordString;
        } else {
            ELEMENTS.currentWord.textContent = `${currentWordString} (+${value})`;
        }
    }

    function updateWordCount(wordCount) {
        ELEMENTS.wordCounter.textContent = `Words: ${wordCount}`;
    }

    function animateScoreIncrease(score, points, frame = 0) {
        const frames = 28;
        if (frame > frames) {
            ELEMENTS.gameScore.textContent = score + points;
        } else {
            const progress = Utils.smoothStep(frame / frames);
            ELEMENTS.gameScore.textContent = score + Math.floor(points * progress);
            requestAnimationFrame(() => animateScoreIncrease(score, points, frame + 1));
        }
    }

    function resetCellsStyle(selectedCells) {
        selectedCells.forEach((selectedCell) => {
            selectedCell.querySelector('.cell-letter').style.borderColor = '';
            selectedCell.style.color = '';
        });
    }

    function animateWordFadeOut(frame = 0) {
        const frames = 12;
        if (frame > frames) {
            ELEMENTS.currentWord.innerHTML = '<br>';
            ELEMENTS.currentWord.style.backgroundColor = '';
            ELEMENTS.currentWord.style.color = '';
            ELEMENTS.currentWord.style.opacity = '';
        } else {
            const progress = Utils.smoothStep(frame / frames);
            ELEMENTS.currentWord.style.opacity = 1 - progress;
            requestAnimationFrame(() => animateWordFadeOut(frame + 1));
        }
    }

    return {
        ELEMENTS,
        init,
        setAppHeight,
        setUsernameInputWidth,
        returnToMainMenu,
        selectTimed,
        selectFreePlay,
        selectVSFriend,
        selectVSRandom,
        updateTimer,
        displayResults,
        populateGameboard,
        animateCellSelection,
        getCellFromTouch,
        drawCircle,
        drawLine,
        setGameSvgColor,
        setCellsColor,
        updateWordDisplay,
        updateWordCount,
        animateScoreIncrease,
        resetGameSvg,
        resetCellsStyle,
        animateWordFadeOut,
    };
})();