import { COLORS } from '../config.js';
import { Animations } from "./Animations.js"


export class View {
    constructor(model) {
        this.model = model;
        this.animations = new Animations(this);
        this.setAppHeight();
        this.setColorConfigs();
        this.setDOMReferences();
        this.setUserName();
        this.initializeScreens();

        this.hideInputErrors(); // TODO: something fishy here
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
        this.homeBtns = document.querySelectorAll('.home-btn');
        this.inputBorders = document.querySelectorAll('.input-border');
        this.inputErrors = document.querySelectorAll('.input-error');

        this.userNameForm = document.getElementById('user-name-form');
        this.userNameInput = document.getElementById('user-name');

        this.modeBtns =  this.createDataSetObject('.mode-btn', 'mode');

        this.searchForm = document.getElementById('search-form');

        this.letterPath = document.getElementById('letter-path');
        this.navControls = document.getElementById('nav-controls');
        this.resultsBtn = document.getElementById('results-btn');
        this.countdownTimer = document.getElementById('countdown-timer');
        this.wordCounter = document.getElementById('word-counter');
        this.currentScore = document.getElementById('current-score');
        this.selectedLetters = document.getElementById('selected-letters');

        this.cells = document.querySelectorAll('.cell');
        this.touchTargets = document.querySelectorAll('.touch-target');

        this.finalScore = document.getElementById('final-score');
        this.longestWord = document.getElementById('longest-word');
        this.chartBars = document.querySelectorAll('.chart-bar');

        this.screens = this.createDataSetObject('.screen', 'screen');

        this.spooler = this.createSpooler();
    }

    createDataSetObject(query, attribute) {
        return Object.fromEntries(
            Array.from(document.querySelectorAll(query)).map(
                (element) => [element.dataset[attribute], element]
            )
        );
    }

    initializeScreens() {
        Object.entries(this.screens).map(([screen, element]) => {
            if (screen !== this.model.screen) element.style.display = 'none';
        });
    }

    updateScreenDisplay(display) {
        this.screens[this.model.screen].style.display = display;
    }

    createSpooler() {
        const icon = document.createElement("i");
        icon.className = "icon-spooler";
        const text = document.createElement("span");
        text.className = "loading";
        return { icon, text };
    }

    blurActiveElement() {
        document.activeElement.blur();
    }

    getElementAtTouchPoint(touch) {
        return document.elementFromPoint(touch.clientX, touch.clientY);
    }

    // TODO: does this accept model data?
    setInputErrors(color, display) {
        this.inputBorders.forEach((inputBorder) => {
            inputBorder.style.setProperty("--input-border-color", color);
        });
        this.inputErrors.forEach((inputError) => {
            inputError.style.display = display;
        });
    }

    // TODO: does this accept model data?
    showInputErrors() {
        this.setInputErrors(COLORS.HIGHLIGHT.SECONDARY, '');
    }

    // TODO: does this accept model data?
    hideInputErrors() {
        this.setInputErrors('', 'none');
    }


    /*................HOME................*/

    setUserName() {
        this.userNameInput.value = this.model.username;
        this.setUserNameWidth();
    }

    setUserNameWidth() {
        this.userNameInput.style.width = `${this.userNameInput.value.length}ch`;
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
        // implement
    }

    selectVSRandomMode() {
        // implement
    }

    startMode() {
        this.updateWordCount(0);
        this.currentScore.textContent = 0;
    }

    setButtonAsLoading() {
        const modeBtn = this.modeBtns[this.model.mode];
        modeBtn.children[0].style.display = 'none';
        modeBtn.children[1].style.display = 'none';
        const fragment = document.createDocumentFragment();
        fragment.appendChild(this.spooler.icon);
        fragment.appendChild(this.spooler.text);
        modeBtn.appendChild(fragment);
    }

    resetButton() {
        const modeBtn = this.modeBtns[this.model.mode];
        modeBtn.removeChild(this.spooler.icon);
        modeBtn.removeChild(this.spooler.text);
        modeBtn.children[0].style.display = '';
        modeBtn.children[1].style.display = '';
    }


    /*................GAME................*/

    updateTimer() {
        const time = this.model.gameState.time;
        this.countdownTimer.textContent = time.text;
        this.countdownTimer.style.color = time.color;
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

    updateWordCount() {
        this.wordCounter.textContent = `Words: ${this.model.gameState.words.count}`;
    }

    setLetters() {
        this.model.selectionState.cells.forEach((cell, i) => {
            this.cells[i].firstElementChild.textContent = cell.letter;
        });
    }

    resetLetterPathAndSelectedCells() {
        this.letterPath.innerHTML = '';
        this.model.selectionState.path.indices.forEach(
            (index) => this.setCellColor(index, '')
        );
    }

    updateSelectedLetters() {
        const { word, path, cell } = this.model.selectionState;
        this.selectedLetters.textContent = word.textContent;
        this.selectedLetters.style.backgroundColor = word.backgroundColor;
        this.selectedLetters.style.color = word.color;
        this.selectedLetters.style.fontWeight = word.fontWeight;
        this.letterPath.style.fill = path.color;
        this.letterPath.style.stroke = path.color;
        path.targets.forEach((index) => this.setCellColor(index, cell.current.data.color));
    }

    setCellColor(index, color) {
        const cell = this.cells[index];
        cell.firstElementChild.style.borderColor = color;
        cell.style.color = color;
    }


    /*................RESULTS................*/

    updateGameRecap() {
        const { game, words } = this.model.gameState;
        this.finalScore.textContent =  game.score;
        this.longestWord.textContent = words.longest;
    }
}