import { COLORS } from '../config.js';
import { Animations } from './Animations.js'
import { Game } from './Game.js'


export class View {
    constructor(model) {
        this.model = model;
        this.game = new Game(model);
        this.animations = new Animations(this);
        this.setAppHeight();
        this.setColorConfigs();
        this.setDOMReferences();
        this.setUserName();
        this.initializeScreens();
    }

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
        this.inputBorders = this.createDataSetObject('.input-border', 'form');
        this.userNameForm = document.getElementById('user-name-form');
        this.userNameInput = document.getElementById('user-name');
        this.modeBtns = this.createDataSetObject('.mode-btn', 'mode');
        this.searchForm = document.getElementById('search-form');
        this.letterPath = document.getElementById('letter-path');
        this.navControls = document.getElementById('nav-controls');
        this.resultsBtn = document.getElementById('results-btn');
        this.countdownTimer = document.getElementById('countdown-timer');
        this.wordCounter = document.getElementById('word-counter');
        this.currentScore = document.getElementById('current-score');
        this.selectedLetters = document.getElementById('selected-letters');
        this.cells = document.querySelectorAll('.cell');
        this.letters = document.querySelectorAll('.letter');
        this.touchTargets = document.querySelectorAll('.touch-target');
        this.finalScore = document.getElementById('final-score');
        this.longestWord = document.getElementById('longest-word');
        this.screens = this.createDataSetObject('.screen', 'screen');
        this.spooler = this.createSpooler();
        this.inputError = this.createInputError();
    }

    createSpooler() {
        const icon = document.createElement("i");
        icon.className = "icon-spooler";
        const text = document.createElement("span");
        text.className = "loading";
        return { icon, text }
    }

    createInputError() {
        const inputError = document.createElement("div");
        inputError.className = "input-error";
        const icon = document.createElement("i");
        icon.className = "icon-error";
        const text = document.createElement("span");
        inputError.appendChild(icon);
        inputError.appendChild(text);
        return inputError
    }

    createDataSetObject(query, attribute) {
        const elements = document.querySelectorAll(query);
        const map = (element) => [element.dataset[attribute], element];
        const entries = Array.from(elements, map);
        return Object.fromEntries(entries)
    }

    initializeScreens() {
        for (const [screen, element] of Object.entries(this.screens)) {
            if (screen !== this.model.screen) {
                element.style.display = 'none';
            }
        }
    }

    updateScreenDisplay(display) {
        this.screens[this.model.screen].style.display = display;
    }

    blurActiveElement() {
        document.activeElement.blur();
    }

    getElementAtTouchPoint(touch) {
        return document.elementFromPoint(touch.clientX, touch.clientY)
    }


    /*................HOME................*/

    setUserName() {
        this.userNameInput.value = this.model.user.name;
        this.setUserNameWidth();
    }

    setUserNameWidth() {
        this.userNameInput.style.width = `${this.userNameInput.value.length}ch`;
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
        this.game.updateWordCount(0);
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

    showInputError(form) {
        const inputBorder = this.inputBorders[form];
        inputBorder.style.setProperty("--input-border-color", COLORS.HIGHLIGHT.SECONDARY);
        this.inputError.children[1].innerHTML = this.model[form].error;
        inputBorder.after(this.inputError);
    }

    hideInputError(form) {
        const inputBorder = this.inputBorders[form];
        inputBorder.style.setProperty("--input-border-color", '');
        this.inputError.remove();
    }


    /*................RESULTS................*/

    updateGameRecap() {
        const { game, words } = this.model.game;
        this.finalScore.textContent = game.score;
        this.longestWord.textContent = words.longest;
    }
}