import { utils } from './utils.js'
import { Model } from './Model.js'
import { View } from './View.js'


export class Controller {
    constructor() {
        this.model = new Model();
        this.view = new View(this.model);
        this.initializeEventHandlers();
    }

    initializeEventHandlers() {
        // WINDOW
        window.addEventListener(
            'resize',
            () => this.view.setAppHeight()
        );

        // BUTTONS
        utils.dom.addEventListeners(
            this.view.homeBtns,
            'click',
            () => this.switchScreen('home')
        );
        utils.dom.addEventListeners(
            Object.values(this.view.modeBtns),
            'click',
            (event) => this.startMode(event)
        );
        this.view.resultsBtn.addEventListener(
            'click',
            () => this.displayResults()
        );

        // FORMS
        this.view.userNameForm.addEventListener(
            'submit',
            (event) => this.updateUserName(event)
        );
        this.view.searchForm.addEventListener(
            'submit',
            (event) => this.searchFriend(event)
        );

        // INPUTS
        this.view.userNameInput.addEventListener(
            'input',
            () => this.handleUserNameInput()
        );
        this.view.userNameInput.addEventListener(
            'blur',
            () => this.handleUserNameBlur()
        );
        this.view.userNameInput.addEventListener(
            'invalid',
            (event) => this.handleUserNameInvalid(event, 'user')
        );
        
        // CELLS
        utils.dom.addEventListeners(
            this.view.touchTargets,
            ['mousedown', 'mousemove', 'touchstart', 'touchmove'],
            (event) => this.handleCellInteraction(event)
        );
        utils.dom.addEventListeners(
            window,
            ['touchcancel', 'touchend', 'mouseup'],
            () => this.endSelection()
        );
    }

    switchScreen(screen) {
        this.view.updateScreenDisplay('none');
        this.model.setCurrentScreen(screen);
        this.view.updateScreenDisplay('');
    }


    /*................HOME................*/

    async updateUserName(event) {
        event.preventDefault();
        const userName = event.currentTarget['user-name'].value;
        await this.model.setUserName(userName);
        if (this.model.user.error) {
            this.view.showInputError('user');
        } else {
            this.view.blurActiveElement();
        }
    }

    handleUserNameInvalid(event, form) {
        event.preventDefault();
        const userName = event.currentTarget.value;
        this.model.setFormError(form, userName);
        this.view.showInputError('user');
    }

    handleUserNameInput() {
        this.resetInputError('user');
        this.view.setUserNameWidth();
    }

    handleUserNameBlur() {
        this.resetInputError('user');
        this.view.setUserName();
    }

    resetInputError(form) {
        if (!this.model[form].error) return
        this.model.setFormError(form, null);
        this.view.hideInputError(form);
    }

    async startMode(event) {
        if (this.model.navigation.loading) return
        this.model.setMode(event.currentTarget.dataset.mode);
        this.view.setButtonAsLoading();
        switch (this.model.navigation.mode) {
            case 'timed':
                await this.initializeGameData();
                this.view.selectTimedMode();
                this.startTimer();
                break
            case 'free':
                await this.initializeGameData();
                this.view.selectFreePlayMode();
                break
            case 'friend':
                if (this.model.user.name === '') {
                    this.view.userNameInput.focus();
                } else {
                    this.switchScreen('friend');
                }
                break
            case 'random':
                if (this.model.user.name === '') {
                    this.view.userNameInput.focus();
                } else {
                    this.view.selectVSRandomMode();
                }
                break
        }
        this.switchScreen('game');
        this.view.resetButton();
        this.model.setLoading(false);
    }

    async initializeGameData() {
        await this.model.initializeGameData();
        this.view.setLetters();
    }


    /*................FRIEND................*/

    searchFriend(event) {
        event.preventDefault();
        const userName = event.currentTarget['user-name'].value;
    }

    startTimer() {
        this.model.startTimer(() => this.updateTimer());
    }

    updateTimer() {
        this.view.updateTimer();
        if (this.model.game.time.remaining === 0) {
            this.displayResults();
        }
    }

    displayResults() {
        const { score, words } = this.model.game;
        this.view.updateGameRecap(score, words.longest);
        this.switchScreen('results');
        this.view.animateChart(words);
    }

    /*................SELECTION................*/

    handleCellInteraction(event) {
        const start = ['mousedown', 'touchstart'].includes(event.type);
        if (start) {
            this.model.startSelection();
        }
        if (!this.model.selection.selecting) return
        if (event.type === 'touchmove') {
            var touchTarget = this.view.getElementAtTouchPoint(event.touches[0]);
            if (touchTarget?.className !== 'touch-target') return
        } else {
            var touchTarget = event.currentTarget;
        }
        const index = touchTarget.parentElement.dataset.index;
        this.model.updateTargetCell(index);
        if (!this.model.selection.cell.current.valid) return
        this.view.animateCellSelection(this.view.letters[index]);
        this.drawPath();
        this.model.addSelectedCell();
        this.view.updateSelectedLetters();
    }

    drawPath() {
        this.drawSelectionCircle();
        if (this.model.selection.cell.previous.data) {
            this.drawConnectionLine();
        }
    }

    drawSelectionCircle() {
        const index = this.model.selection.cell.current.index;
        const cell = this.view.cells[index];
        const [cx, cy] = this.getCellCenter(cell);
        const r = cell.clientWidth / 14.5;
        this.view.createSelectionCircle(cx, cy, r);
    }

    drawConnectionLine() {
        const { current, previous } = this.model.selection.cell;
        const currentCell = this.view.cells[current.index];
        const previousCell = this.view.cells[previous.index];
        const strokeWidth = currentCell.clientWidth / 6.5;
        const [x1, y1] = this.getCellCenter(previousCell);
        const [x2, y2] = this.getCellCenter(currentCell);
        this.view.createConnectionLine(strokeWidth, x1, y1, x2, y2);
    }

    getCellCenter(cell) {
        const x = cell.offsetLeft + cell.clientWidth / 2;
        const y = cell.offsetTop + cell.clientHeight / 2;
        return [x, y]
    }

    endSelection() {
        const { selecting, word } = this.model.selection;
        if (!selecting) return
        if (word.valid && !word.found) {
            this.view.animateScoreIncrease(this.model.game.score, word.points);
            this.model.addFoundWord();
            this.view.updateWordCount();
        }
        this.view.animateWordFadeOut();
        this.view.resetLetterPathAndSelectedCells();
        this.model.resetSelection();
    }
}