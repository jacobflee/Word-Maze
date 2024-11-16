import { config } from './config.js';
import { utils } from './utils.js';


export class View {
    constructor(model) {
        this.model = model;
        this.setAppHeight();
        this.setColorConfigs();
        this.setDOMReferences();
        this.setUserName();
        this.injectFriendCards();
        this.initializeScreens();
    }


    /*................CSS................*/

    setAppHeight() {
        document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
    }

    setColorConfigs() {
        document.documentElement.style.setProperty('--score-color', config.COLOR.SCORE);
        document.documentElement.style.setProperty('--chart-color', config.COLOR.CHART);
        document.documentElement.style.setProperty('--path-selected-color', config.COLOR.PATH.SELECTED);
        document.documentElement.style.setProperty('--primary-background-color', config.COLOR.BACKGROUND.PRIMARY);
        document.documentElement.style.setProperty('--secondary-background-color', config.COLOR.BACKGROUND.SECONDARY);
        document.documentElement.style.setProperty('--primary-highlight-color', config.COLOR.HIGHLIGHT.PRIMARY);
        document.documentElement.style.setProperty('--primary-text-color', config.COLOR.TEXT.PRIMARY);
        document.documentElement.style.setProperty('--secondary-text-color', config.COLOR.TEXT.SECONDARY);
        document.documentElement.style.setProperty('--success-color', config.COLOR.SUCCESS);
        document.documentElement.style.setProperty('--warning-color', config.COLOR.WARNING);
        document.documentElement.style.setProperty('--error-color', config.COLOR.ERROR);
    }


    /*................DOM................*/

    setDOMReferences() {
        // UI
        this.screens = utils.dom.createDataSetObject('.screen', 'screen');
        this.modeBtns = utils.dom.createDataSetObject('.mode-btn', 'mode');
        this.homeBtns = document.querySelectorAll('.home-btn');
        this.resultsBtn = document.getElementById('results-btn');
        this.spooler = this.createSpooler();

        // INPUTS
        this.forms = utils.dom.createDataSetObject('form', 'form');
        this.inputMessage = this.createInputMessage();

        // FRIENDS
        this.friends = document.getElementById('friends');

        // GAME
        this.countdownTimer = document.getElementById('countdown-timer');
        this.wordCounter = document.getElementById('word-counter');
        this.currentScore = document.getElementById('current-score');
        this.selectedLetters = document.getElementById('selected-letters');
        this.letterPath = document.getElementById('letter-path');
        this.cells = document.querySelectorAll('.cell');
        this.letters = document.querySelectorAll('.letter');

        // RESULTS
        this.finalScore = document.getElementById('final-score');
        this.longestWord = document.getElementById('longest-word');
        this.chartBars = this.createChartBars();
    }

    createChartBars() {
        const barFills = document.querySelectorAll('.bar-fill');
        const barCounts = document.querySelectorAll('.bar-count')
        return [...utils.iterator.zip(barFills, barCounts)]
    }

    createSpooler() {
        const icon = document.createElement('i');
        icon.className = 'icon-spooler';
        const text = document.createElement('span');
        text.className = 'loading';
        return { icon, text }
    }

    createInputMessage() {
        const inputMessage = document.createElement('div')
        inputMessage.className = 'input-message';
        const icon = document.createElement('i');
        const text = document.createElement('span');
        inputMessage.append(icon, text);
        return inputMessage
    }


    /*................UI................*/

    initializeScreens() {
        for (const [name, screen] of Object.entries(this.screens)) {
            if (name !== this.model.ui.screen) {
                screen.style.display = 'none';
            }
        }
    }

    updateScreenDisplay(display) {
        this.screens[this.model.ui.screen].style.display = display;
    }

    selectTimedMode() {
        this.resultsBtn.style.display = 'none';
        this.countdownTimer.style.display = '';
        this.currentScore.textContent = 0;
        this.updateWordCount();
    }

    selectFreePlayMode() {
        this.resultsBtn.style.display = '';
        this.countdownTimer.style.display = 'none';
        this.currentScore.textContent = 0;
        this.updateWordCount();
    }

    selectVSFriendMode() {
        // implement
    }

    selectVSRandomMode() {
        // implement
    }

    setButtonAsLoading() {
        const modeBtn = this.modeBtns[this.model.ui.mode];
        modeBtn.children[0].style.display = 'none';
        modeBtn.children[1].style.display = 'none';
        const fragment = document.createDocumentFragment();
        fragment.appendChild(this.spooler.icon);
        fragment.appendChild(this.spooler.text);
        modeBtn.appendChild(fragment);
    }

    resetButton() {
        const modeBtn = this.modeBtns[this.model.ui.mode];
        modeBtn.removeChild(this.spooler.icon);
        modeBtn.removeChild(this.spooler.text);
        modeBtn.children[0].style.display = '';
        modeBtn.children[1].style.display = '';
    }


    /*................INPUTS................*/

    injectFriendCards() {
        const documentFragment = document.createDocumentFragment();
        const friends = this.model.user.friends.order.slice(0, 8);
        friends.forEach((friend) => {
            const friendCard = this.createFriendCard(friend);
            documentFragment.append(friendCard);
        });
        this.friends.replaceChildren(documentFragment);
    }

    createFriendCard(friend) {
        const friendCard = document.createElement('button');
        friendCard.className = 'friend';
        friendCard.setAttribute('data-id', friend.id);
        friendCard.setAttribute('data-name', friend.name);
        const friendCardBorder = document.createElement('div');
        const friendCardName = document.createElement('span');
        friendCardName.textContent = friend.name;
        friendCard.appendChild(friendCardBorder);
        friendCard.appendChild(friendCardName);
        return friendCard
    }

    setUserName() {
        this.forms.user.name.value = this.model.user.name;
        this.setUserNameWidth();
    }

    setUserNameWidth() {
        const userNameInput = this.forms.user.name;
        userNameInput.style.width = `${userNameInput.value.length + 2}ch`;
    }

    showInputMessage(form) {
        const message = this.model.ui.message;
        const inputBorder = this.forms[form].name.nextElementSibling;
        inputBorder.style.setProperty('--input-border-color', message.borderColor);
        const [icon, text] = this.inputMessage.children;
        icon.className = message.class;
        text.innerHTML = message.text;
        text.style.color = message.color;
        inputBorder.after(this.inputMessage);
    }

    hideInputMessage(form) {
        const inputBorder = this.forms[form].name.nextElementSibling;
        inputBorder.style.setProperty('--input-border-color', '');
        this.inputMessage.remove();
    }

    resetFriendInput() {
        this.forms.friend.name.value = '';
    }

    animateMessageFadeOut(inputBorder, frame = 1) {
        const frames = config.DURATION.ANIMATION.MESSAGE;
        if (frame > frames) {
            this.inputMessage.remove();
            this.inputMessage.style.opacity = 1;
            inputBorder.classList.remove('success-border');
            inputBorder.style.opacity = '';
        } else {
            const progress = frame / frames;
            const opacity = 1 - progress;
            this.inputMessage.style.opacity = opacity;
            inputBorder.style.opacity = opacity;
            requestAnimationFrame(() => this.animateMessageFadeOut(inputBorder, frame + 1));
        }
    }


    /*................GAME................*/

    setLetters() {
        for (const [letter, cell] of utils.iterator.zip(this.letters, this.model.game.cells)) {
            letter.textContent = cell.letter
        }
    }

    updateTimerDisplay() {
        const time = this.model.game.time;
        this.countdownTimer.textContent = time.text;
        this.countdownTimer.style.color = time.color;
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

    drawPath() {
        this.drawSelectionCircle();
        if (this.model.game.selection.cell.previous.data) {
            this.drawConnectionLine();
        }
    }

    drawSelectionCircle() {
        const index = this.model.game.selection.cell.current.index;
        const cell = this.cells[index];
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', cell.offsetLeft + cell.clientWidth / 2);
        circle.setAttribute('cy', cell.offsetTop + cell.clientHeight / 2);
        circle.setAttribute('r', cell.clientWidth / 14.5);
        this.letterPath.appendChild(circle);
    }

    drawConnectionLine() {
        const { current, previous } = this.model.game.selection.cell;
        const currentCell = this.cells[current.index];
        const previousCell = this.cells[previous.index];
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('stroke-width', currentCell.clientWidth / 6.5);
        line.setAttribute('x1', previousCell.offsetLeft + previousCell.clientWidth / 2);
        line.setAttribute('y1', previousCell.offsetTop + previousCell.clientHeight / 2);
        line.setAttribute('x2', currentCell.offsetLeft + currentCell.clientWidth / 2);
        line.setAttribute('y2', currentCell.offsetTop + currentCell.clientHeight / 2);
        this.letterPath.appendChild(line);
    }

    updateSelectedLetters() {
        const { word, path, cell } = this.model.game.selection;
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

    animateScoreIncrease(score, points, frame = 1) {
        const frames = config.DURATION.ANIMATION.SCORE;
        if (frame > frames) return
        const progress = utils.math.smoothStep(frame / frames);
        this.currentScore.textContent = score + Math.round(points * progress);
        requestAnimationFrame(() => this.animateScoreIncrease(score, points, frame + 1));
    }

    updateWordCount() {
        this.wordCounter.textContent = `Words: ${this.model.game.words.count}`;
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

    resetLetterPathAndCellColors() {
        this.letterPath.innerHTML = '';
        for (const letter of utils.iterator.pluck(this.letters, this.model.game.selection.path.indices)) {
            this.setCellColor(letter, '')
        }
    }


    /*................RESULTS................*/

    updateGameRecap() {
        const { score, words } = this.model.game;
        this.finalScore.textContent = score;
        this.longestWord.textContent = words.longest;
    }

    resetChart() {
        for (const [barFill, barCount] of this.chartBars) {
            this.updateChartBar(barFill, barCount, '0%', '0');
        }
    }

    animateChart(words, frame = 1) {
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
}