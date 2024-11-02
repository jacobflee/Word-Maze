import { COLORS } from '../config.js';


export class View {
    constructor() {
        this.setAppHeight();
        this.setColorConfigs();
        this.setDOMReferences();
        this.hideInputErrors();
        this.createSpooler();
        this.switchToHomeScreen();
    }


    /*................GLOBAL................*/

    setAppHeight() {
        document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
    }

    setColorConfigs() {
        document.documentElement.style.setProperty('--score-color', COLORS.SCORE);
        document.documentElement.style.setProperty('--chart-bar-color', COLORS.CHART_BAR);
        document.documentElement.style.setProperty('--letter-path-selected', COLORS.LETTER_PATH_SELECTED);
        document.documentElement.style.setProperty('--primary-background-color', COLORS.BACKGROUND.PRIMARY);
        document.documentElement.style.setProperty('--secondary-background-color', COLORS.BACKGROUND.SECONDARY);
        document.documentElement.style.setProperty('--primary-highlight-color', COLORS.HIGHLIGHT.PRIMARY);
        document.documentElement.style.setProperty('--secondary-highlight-color', COLORS.HIGHLIGHT.SECONDARY);
        document.documentElement.style.setProperty('--primary-text-color', COLORS.TEXT.PRIMARY);
        document.documentElement.style.setProperty('--secondary-text-color', COLORS.TEXT.SECONDARY);
        document.documentElement.style.setProperty('--tertiary-text-color', COLORS.TEXT.TERTIARY);
    }

    setDOMReferences() {
        this.screens = document.querySelectorAll('.screen');
        this.homeBtns = document.querySelectorAll('.home-btn');
        this.inputBorders = document.querySelectorAll('.input-border');
        this.inputErrors = document.querySelectorAll('.input-error');

        this.homeScreen = document.getElementById('home-screen');
        this.usernameForm = document.getElementById('username-form');
        this.usernameInput = document.getElementById('username');
        this.modeSelectBtns = document.querySelectorAll('.mode-select-btn');

        this.friendScreen = document.getElementById('friend-screen');
        this.searchForm = document.getElementById('search-form');

        this.gameScreen = document.getElementById('game-screen');
        this.letterPath = document.getElementById('letter-path');
        this.navControls = document.getElementById('nav-controls');
        this.resultsBtn = document.getElementById('results-btn');
        this.countdownTimer = document.getElementById('countdown-timer');
        this.wordCounter = document.getElementById('word-counter');
        this.currentScore = document.getElementById('current-score');
        this.selectedLetters = document.getElementById('selected-letters');
        this.gameBoard = document.getElementById('game-board');
        this.letters = document.querySelectorAll('.letter');
        this.touchTargets = document.querySelectorAll('.touch-target');

        this.resultsScreen = document.getElementById('results-screen');
        this.finalScore = document.getElementById('final-score');
        this.longestWord = document.getElementById('longest-word');
        this.barFills = document.querySelectorAll('.bar-fill');
        this.barCounts = document.querySelectorAll('.bar-count');
    }

    createSpooler() {
        this.spooler = document.createElement("i");
        this.spooler.className = "icon-spooler";
    }

    switchScreen(screen) {
        this.screens.forEach((screen) => screen.style.display = 'none');
        screen.style.display = '';
    }

    switchToHomeScreen() {
        this.switchScreen(this.homeScreen);
    }

    blurActiveElement() {
        document.activeElement.blur();
    }

    getElementAtTouchPoint(touch) {
        return document.elementFromPoint(touch.clientX, touch.clientY);
    }

    setInputErrors(color, display) {
        this.inputBorders.forEach((inputBorder) => {
            inputBorder.style.setProperty("--input-border-color", color);
        });
        this.inputErrors.forEach((inputError) => {
            inputError.style.display = display;
        });
    }

    showInputErrors() {
        this.setInputErrors(COLORS.HIGHLIGHT.SECONDARY, '');
    }

    hideInputErrors() {
        this.setInputErrors('', 'none');
    }
    

    /*................HOME................*/

    setUsername(username) {
        this.usernameInput.value = username;
        this.setUsernameWidth();
    }

    setUsernameWidth() {
        this.usernameInput.style.width = `${this.usernameInput.value.length}ch`;
        this.hideInputErrors();
    }

    selectTimedMode() {
        this.navControls.style.display = 'none';
        this.countdownTimer.style.display = '';
        this.startMode();
    }

    selectFreePlayMode() {
        this.navControls.style.display = '';
        this.countdownTimer.style.display = 'none';
        this.startMode();
    }

    selectVSFriendMode() {
        this.switchScreen(this.friendScreen);
    }

    selectVSRandomMode() {
        // implement
    }

    startMode() {
        this.updateWordCount(0);
        this.setCurrentScore(0);
        this.switchScreen(this.gameScreen);
    }

    setButtonAsLoading(button) {
        const [icon, text] = button.children;
        button.insertBefore(this.spooler, icon);
        icon.style.display = 'none';
        text.textContent = '';
        text.className = 'loader';
    }

    resetButton(button) {
        button.removeChild(this.spooler);
        const [icon, text] = button.children;
        icon.style.display = '';
        text.className = '';
        text.textContent = button.dataset.mode;
    }


    /*................GAME................*/

    updateTimer(timeString, color) {
        this.countdownTimer.textContent = timeString;
        this.countdownTimer.style.color = color;
    }

    updateCellStyle(cell, side, radius, fontSize) {
        cell.style.width = side;
        cell.style.height = side;
        cell.style.borderRadius = radius;
        cell.style.fontSize = fontSize;
    }

    createSelectionCircle(cx, cy, r) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', cx);
        circle.setAttribute('cy', cy);
        circle.setAttribute('r', r);
        this.letterPath.appendChild(circle);
    }

    createConnectionLine(strokeWidth, x1, y1, x2, y2) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('stroke-width', strokeWidth);
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        this.letterPath.appendChild(line);
    }

    updateWordCount(wordCount) {
        this.wordCounter.textContent = `Words: ${wordCount}`;
    }

    setCurrentScore(score) {
        this.currentScore.textContent = score;
    }

    resetSelectedLetters() {
        this.selectedLetters.innerHTML = '&nbsp;';
        this.selectedLetters.style.cssText = '';
    }

    setSelectedLettersOpacity(opacity) {
        this.selectedLetters.style.opacity = opacity;
    }

    setLetterText(i, text) {
        this.letters[i].textContent = text;
    }

    resetLetterPathAndSelectedCells(selectedCells) {
        this.letterPath.innerHTML = '';
        selectedCells.forEach((cell) => this.setCellColor(cell, ''));
    }

    updateSelectedLetters(current) {
        const { word, path, cell } = current;
        this.selectedLetters.textContent = word.content;
        this.selectedLetters.style.backgroundColor = word.background;
        this.selectedLetters.style.color = word.color;
        this.selectedLetters.style.fontWeight = word.weight;
        this.letterPath.style.fill = path.color;
        this.letterPath.style.stroke = path.color;
        path.targets.forEach((target) => this.setCellColor(target, cell.color));
    }

    setCellColor(cell, color) {
        cell.firstElementChild.style.borderColor = color;
        cell.style.color = color;
    }


    /*................RESULTS................*/

    displayResults(currentScore, longestWord) {
        this.finalScore.textContent = currentScore;
        this.longestWord.textContent = longestWord;
        this.switchScreen(this.resultsScreen);
    }

    updateChartBar(i, width, count) {
        this.barFills[i].style.width = width;
        this.barCounts[i].textContent = count;
    }
}