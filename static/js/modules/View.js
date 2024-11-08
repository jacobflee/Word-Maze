import { config } from './config.js';
import { utils } from './utils.js';


export class View {
    constructor(model) {
        this.model = model;
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
        document.documentElement.style.setProperty('--score-color', config.COLOR.SCORE);
        document.documentElement.style.setProperty('--chart-color', config.COLOR.CHART);
        document.documentElement.style.setProperty('--letter-path-selected', config.COLOR.PATH.SELECTED);
        document.documentElement.style.setProperty('--primary-background-color', config.COLOR.BACKGROUND.PRIMARY);
        document.documentElement.style.setProperty('--secondary-background-color', config.COLOR.BACKGROUND.SECONDARY);
        document.documentElement.style.setProperty('--primary-highlight-color', config.COLOR.HIGHLIGHT.PRIMARY);
        document.documentElement.style.setProperty('--primary-text-color', config.COLOR.TEXT.PRIMARY);
        document.documentElement.style.setProperty('--secondary-text-color', config.COLOR.TEXT.SECONDARY);
        document.documentElement.style.setProperty('--error-color', config.COLOR.TEXT.ERROR);
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
        this.chartBars = this.createChartBars();
    }

    createChartBars() {
        const barFills = document.querySelectorAll('.bar-fill');
        const barCounts = document.querySelectorAll('.bar-count')
        return [...utils.iterator.zip(barFills, barCounts)]
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
            if (screen !== this.model.navigation.screen) {
                element.style.display = 'none';
            }
        }
    }

    updateScreenDisplay(display) {
        this.screens[this.model.navigation.screen].style.display = display;
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
        this.updateWordCount(0);
        this.currentScore.textContent = 0;
    }

    setButtonAsLoading() {
        const modeBtn = this.modeBtns[this.model.navigation.mode];
        modeBtn.children[0].style.display = 'none';
        modeBtn.children[1].style.display = 'none';
        const fragment = document.createDocumentFragment();
        fragment.appendChild(this.spooler.icon);
        fragment.appendChild(this.spooler.text);
        modeBtn.appendChild(fragment);
    }

    resetButton() {
        const modeBtn = this.modeBtns[this.model.navigation.mode];
        modeBtn.removeChild(this.spooler.icon);
        modeBtn.removeChild(this.spooler.text);
        modeBtn.children[0].style.display = '';
        modeBtn.children[1].style.display = '';
    }

    showInputError(form) {
        const inputBorder = this.inputBorders[form];
        inputBorder.style.setProperty("--input-border-color", config.COLOR.ERROR);
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
        const { score, words } = this.model.game;
        this.finalScore.textContent = score;
        this.longestWord.textContent = words.longest;
    }

    animateChart(words, frame = 1) {
        if (words.count === 0) {
            for (const [barFill, barCount] of this.chartBars) {
                this.updateChartBar(barFill, barCount, '0%', '0');
            }
            return
        }
        const frames = config.DURATION.ANIMATION.GRAPH;
        if (frame > frames) return
        const progress = utils.math.easeOutExponential(frame / frames);
        for (const [barFill, barCount, i] of this.chartBars) {
            const wordLengthCount = words.length[i + 3];
            const width = `${100 * progress * wordLengthCount / words.count}%`;
            const count = Math.round(progress * wordLengthCount);
            this.updateChartBar(barFill, barCount, width, count);
        }
        requestAnimationFrame(() => this.animateChart(words, frame + 1));
    }

    updateChartBar(barFill, barCount, width, count) {
        barFill.style.width = width;
        barCount.textContent = count;
    }

    updateTimer() {
        const time = this.model.game.time;
        this.countdownTimer.textContent = time.text;
        this.countdownTimer.style.color = time.color;
    }

    setLetters() {
        for (const [letter, cell] of utils.iterator.zip(this.letters, this.model.game.cells)) {
            letter.textContent = cell.letter
        }
    }

    /*................SELECTION................*/

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
        this.wordCounter.textContent = `Words: ${this.model.game.words.count}`;
    }

    resetLetterPathAndSelectedCells() {
        this.letterPath.innerHTML = '';
        for (const letter of utils.iterator.pluck(this.letters, this.model.selection.path.indices)) {
            this.setCellColor(letter, '')
        }
    }

    updateSelectedLetters() {
        const { word, path, cell } = this.model.selection;
        this.selectedLetters.textContent = word.textContent;
        this.selectedLetters.style.backgroundColor = word.backgroundColor;
        this.selectedLetters.style.color = word.color;
        this.selectedLetters.style.fontWeight = word.fontWeight;
        this.letterPath.style.fill = path.color;
        this.letterPath.style.stroke = path.color;
        for (const letter of utils.iterator.pluck(this.letters, path.targets)) {
            this.setCellColor(letter, cell.current.data.color)
        }
    }

    setCellColor(letter, color) {
        letter.style.borderColor = color;
        letter.style.color = color;
    }

    animateCellSelection(cell, frame = 1) {
        const frames = config.DURATION.ANIMATION.CELL;
        if (frame > frames) return
        const progress = frame / frames;
        cell.style.width = `${93 + 7 * progress}%`;
        cell.style.height = cell.style.width;
        cell.style.borderRadius = `${40 - 15 * progress}%`;
        cell.style.fontSize = `calc(${11.5 + 2 * progress} * var(--base-unit))`;
        requestAnimationFrame(() => this.animateCellSelection(cell, frame + 1));
    }

    animateWordFadeOut(frame = 1) {
        const frames = config.DURATION.ANIMATION.WORD;
        if (frame > frames) {
            this.selectedLetters.innerHTML = '&nbsp;';
            this.selectedLetters.style.cssText = '';
        } else {
            const progress = frame / frames;
            this.selectedLetters.style.opacity = 1 - progress;
            requestAnimationFrame(() => this.animateWordFadeOut(frame + 1));
        }
    }

    animateScoreIncrease(score, points, frame = 1) {
        const frames = config.DURATION.ANIMATION.SCORE;
        if (frame > frames) return
        const progress = utils.math.smoothStep(frame / frames);
        this.currentScore.textContent = score + Math.round(points * progress);
        requestAnimationFrame(() => this.animateScoreIncrease(score, points, frame + 1));
    }
}