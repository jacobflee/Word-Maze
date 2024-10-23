import { COLORS, LAYOUT } from '../config.js';


export class View {
    constructor() {
        this.setAppHeight();
        // this.applyBaseStyles();
        this.setDomElements();
    }


    /*................................GLOBAL................................*/

    setAppHeight() {
        document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
    }

    // applyBaseStyles() {
    //     const root = document.documentElement;
    //     root.style.setProperty('--base-unit', 
    //         window.matchMedia('(orientation: portrait)').matches ? 
    //         LAYOUT.BASE_UNIT.PORTRAIT : 
    //         LAYOUT.BASE_UNIT.LANDSCAPE
    //     );
    //     document.body.style.background = COLORS.BACKGROUND.GRADIENT;
    // }

    setDomElements() {
        this.screens = document.querySelectorAll('.screen');
        this.homeBtns = document.querySelectorAll('.home-btn');

        this.homeScreen = document.getElementById('home-screen');
        this.usernameForm = document.getElementById('username-form');
        this.usernameInput = document.getElementById('username');
        this.modeSelectBtns = document.querySelectorAll('.mode-select-btn');

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

    changeScreen(screen) {
        this.screens.forEach((screen) => screen.style.display = 'none');
        screen.style.display = '';
    }

    blurActiveElement() {
        document.activeElement.blur();
    }


    /*................................HOME................................*/
    
    setUsername(username) {
        this.usernameInput.value = username;
    }

    setUsernameWidth() {
        const length = this.usernameInput.value.length;
        this.usernameInput.style.width = `${Math.max(length, 15)}ch`;
    }

    returnToHomeScreen() {
        this.changeScreen(this.homeScreen);
    }

    selectTimedMode() {
        this.navControls.style.display = 'none';
        this.countdownTimer.style.display = '';
        this.changeScreen(this.gameScreen);
    }
    
    selectFreePlayMode() {
        this.navControls.style.display = '';
        this.countdownTimer.style.display = 'none';
        this.changeScreen(this.gameScreen);
    }

    selectVSFriendMode() {
        // implement
    }

    selectVSRandomMode() {
        // implement
    }


    /*................................GAME................................*/

    updateCountdownTimer(timeString, color) {
        this.countdownTimer.textContent = timeString;
        this.countdownTimer.style.color = color;
    }

    setCellStyle(cell, side, radius, fontSize) {
        cell.style.width = side;
        cell.style.height = side;
        cell.style.borderRadius = radius;
        cell.style.fontSize = fontSize;
    }

    drawCircle(cx, cy, r) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', cx);
        circle.setAttribute('cy', cy);
        circle.setAttribute('r', r);
        this.letterPath.appendChild(circle);
    }

    drawLine(strokeWidth, x1, y1, x2, y2) {
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

    updateSelectedLetters(text, backgroundColor, color, fontWeight, value, cellsToColor, currentCellColor) {
        this.selectedLetters.textContent = text;
        this.selectedLetters.style.backgroundColor = backgroundColor;
        this.selectedLetters.style.color = color;
        this.selectedLetters.style.fontWeight = fontWeight;
        this.letterPath.style.fill = value;
        this.letterPath.style.stroke = value;
        cellsToColor.forEach((cell) => this.setCellColor(cell, currentCellColor));
    }

    setCellColor(cell, color) {
        cell.firstElementChild.style.borderColor = color;
        cell.style.color = color;
    }
    
    /*................................RESULTS................................*/

    displayResults(currentScore, longestWord) {
        this.finalScore.textContent = currentScore;
        this.longestWord.textContent = longestWord;
        this.changeScreen(this.resultsScreen);
    }

    updateChartBar(i, width, count) {
        this.barFills[i].style.width = width;
        this.barCounts[i].textContent = count;
    }
}