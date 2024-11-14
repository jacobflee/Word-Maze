import { utils } from './utils.js'
import { Model } from './Model.js'
import { View } from './View.js'


export class Controller {
    constructor() {
        this.model = new Model();
        this.view = new View(this.model);
        this.initializeEventHandlers();

        // this.view.modeBtns['friend'].click();
    }

    initializeEventHandlers() {
        /*................WINDOW................*/
        window.addEventListener(
            'resize',
            () => this.view.setAppHeight()
        );

        /*................BUTTONS................*/
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
        utils.dom.addEventListeners(
            Array.from(this.view.friends.children),
            'click',
            (event) => this.initiateFriendGame(event)
        );

        /*................INPUTS................*/
        utils.dom.addEventListeners(
            this.view.inputs,
            'input',
            (event) => this.handleInput(event)
        );
        utils.dom.addEventListeners(
            this.view.inputs,
            'invalid',
            (event) => this.handleInvalidInput(event)
        );
        utils.dom.addEventListeners(
            this.view.inputs,
            'blur',
            (event) => this.handleInputBlur(event)
        );

        /*................FORMS................*/
        this.view.userNameForm.addEventListener(
            'submit',
            (event) => this.submitUserNameForm(event)
        );
        this.view.searchForm.addEventListener(
            'submit',
            (event) => this.submitFriendForm(event)
        );

        /*................CELLS................*/
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


    /*................UI................*/

    switchScreen(screen) {
        this.view.updateScreenDisplay('none');
        this.model.setCurrentScreen(screen);
        this.view.updateScreenDisplay('');
    }

    async startMode(event) {
        if (this.model.ui.loading) return
        this.model.setMode(event.currentTarget.dataset.mode);
        this.view.setButtonAsLoading();
        switch (this.model.ui.mode) {
            case 'timed':
                await this.initializeGameData();
                this.view.selectTimedMode();
                this.startTimer();
                this.switchScreen('game');
                this.view.resetButton();
                this.model.resetLoading();
                break
            case 'free':
                await this.initializeGameData();
                this.view.selectFreePlayMode();
                this.switchScreen('game');
                this.view.resetButton();
                this.model.resetLoading();
                break
            case 'friend':
                if (!this.model.user.name) {
                    this.view.userNameInput.focus();
                    this.view.resetButton();
                    this.model.resetLoading();
                    return;
                }
                this.switchScreen('friend');
                this.view.resetButton();
                this.model.resetLoading();
                if (this.model.user.friends.ids.length === 0) {
                    this.view.searchForm['user-name'].focus();
                    return
                }
                break
            case 'random':
                this.view.resetButton();
                this.model.resetLoading();
                alert('unavailable');
                break
        }
    }


    /*................INPUTS................*/

    handleInput(event) {
        const form = event.currentTarget.dataset['form'];
        if (this.model.ui.message?.error) {
            this.resetInputMessage(form);
        }
        if (form === 'user') {
            this.view.setUserNameWidth();
        }
    }

    handleInvalidInput(event) {
        event.preventDefault();
        const form = event.currentTarget.dataset['form'];
        const userName = event.currentTarget.value;
        this.model.setFormError(userName);
        this.view.showInputMessage(form);
    }

    handleInputBlur(event) {
        const form = event.currentTarget.dataset['form'];
        if (this.model.ui.message?.error) {
            this.resetInputMessage(form);
        }
        if (form === 'user') {
            this.view.setUserName();
        } else if (form === 'friend') {
            this.view.resetFriendInput();
        }
    }

    resetInputMessage(form) {
        this.model.resetMessage();
        this.view.hideInputMessage(form);
    }

    async submitUserNameForm(event) {
        event.preventDefault();
        const userName = event.currentTarget['user-name'].value;
        await this.model.setUserName(userName);
        if (!this.model.ui.message) {
            document.activeElement.blur();
            return
        }
        if (this.model.ui.message.error) {
            this.view.showInputMessage('user');
        } else {
            document.activeElement.blur();
            this.view.showInputMessage('user');
            this.model.resetMessage();
            setTimeout(() => this.view.animateMessageFadeOut(), 2000);
        }
    }
    
    async submitFriendForm(event) {
        event.preventDefault();
        const userName = event.currentTarget['user-name'].value;
        await this.model.addFriend(userName);
        if (this.model.ui.message.error) {
            this.view.showInputMessage('friend');
        } else {
            this.view.injectFriendCards();
            document.activeElement.blur();
            this.view.showInputMessage('friend');
            this.model.resetMessage();
            setTimeout(() => this.view.animateMessageFadeOut(), 2000);
        }
    }

    initiateFriendGame(event) {
        const friendCard = event.currentTarget;
        const friendId = friendCard.dataset['userId'];
        const friendName = friendCard.dataset['userName'];
        alert(`initiate match with:\n      user-id:  ${friendId}\nuser-name:  ${friendName}`);
    }


    /*................GAME................*/

    async initializeGameData() {
        await this.model.initializeGameData();
        this.view.setLetters();
    }

    startTimer() {
        this.model.startTimer(() => this.updateTimer());
    }

    updateTimer() {
        this.view.updateTimerDisplay();
        if (this.model.game.time.remaining === 0) {
            this.displayResults();
        }
    }

    handleCellInteraction(event) {
        const start = ['mousedown', 'touchstart'].includes(event.type);
        if (start) {
            this.model.startSelection();
        }
        if (!this.model.game.selection.selecting) return
        if (event.type === 'touchmove') {
            var touchTarget = document.elementFromPoint(event.touches[0].clientX, event.touches[0].clientY);
            if (touchTarget?.className !== 'touch-target') return
        } else {
            var touchTarget = event.currentTarget;
        }
        const index = touchTarget.parentElement.dataset.index;
        this.model.updateTargetCell(index);
        if (!this.model.game.selection.cell.current.valid) return
        this.view.animateCellSelection(this.view.letters[index]);
        this.view.drawPath();
        this.model.addSelectedCell();
        this.view.updateSelectedLetters();
    }

    endSelection() {
        const { selecting, word } = this.model.game.selection;
        if (!selecting) return
        if (word.valid && !word.found) {
            this.view.animateScoreIncrease(this.model.game.score, word.points);
            this.model.addFoundWord();
            this.view.updateWordCount();
        }
        this.view.animateWordFadeOut();
        this.view.resetLetterPathAndCellColors();
        this.model.resetSelection();
    }


    /*................RESULTS................*/

    displayResults() {
        const { score, words } = this.model.game;
        this.view.updateGameRecap(score, words.longest);
        this.switchScreen('results');
        if (words.count === 0) {
            this.view.resetChart();
        } else {
            this.view.animateChart(words);
        }
    }
}