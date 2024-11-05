import { Model } from '../model/Model.js'
import { View } from '../view/View.js'
import { Board } from './Board.js'
import { addEventListeners } from '../utils.js'


export class Presenter {
    constructor() {
        this.model = new Model();
        this.view = new View(this.model);
        this.board = new Board(this.model, this.view);
        this.initializeEventHandlers();
    }

    initializeEventHandlers() {
        // WINDOW
        window.addEventListener(
            'resize',
            () => this.view.setAppHeight()
        );

        // BUTTONS
        addEventListeners(
            this.view.homeBtns,
            'click',
            () => this.switchScreen('home') // TODO: repaints uneccessary screens
        );
        addEventListeners(
            Object.entries(this.view.modeBtns).map(([_, element]) => element),
            'click',
            (event) => this.startMode(event) // TODO: implement compatibility with multiplayer
        );
        this.view.resultsBtn.addEventListener(
            'click',
            () => this.displayResults()
        );

        // INPUTS
        this.view.userNameInput.addEventListener(
            'input',
            () => this.view.setUserNameWidth() // TODO: repaints uneccessary errors
        );
        this.view.userNameForm.addEventListener(
            'submit',
            (event) => this.updateUserName(event) // TODO: implement
        );
        this.view.searchForm.addEventListener(
            'submit',
            (event) => this.searchFriend(event) // TODO: implement
        );
        addEventListeners(
            window,
            ['touchend', 'mouseup'],
            () => this.hideInputErrors() // TODO: repaints uneccessary errors
        );

        // CELLS
        addEventListeners(
            this.view.touchTargets,
            ['mousedown', 'mousemove', 'touchstart', 'touchmove'],
            (event) => this.board.handleCellInteraction(event)
        );
        addEventListeners(
            window,
            ['touchcancel', 'touchend', 'mouseup'],
            () => this.board.endSelection()
        );
    }


    /*................HOME................*/

    async updateUserName(event) { // TODO: implement
        event.preventDefault();
        const userName = event.currentTarget.userName.value;
        await this.model.setUserName(userName);
        console.log(this.model.userId, this.model.userNameValid);
        // if (userNameValid) {
        //     this.view.blurActiveElement();
        // } else {
        //     this.view.showInputErrors();
        // }
    }

    hideInputErrors() {
        this.view.hideInputErrors(); // TODO: hides uneccessary errors
    }

    async startMode(event) { // TODO: implement
        if (this.model.loading) return;
        this.model.setLoading(true);
        this.model.setMode(event.currentTarget.dataset.mode);
        this.view.setButtonAsLoading();
        this.model.gameState.reset();
        switch (this.model.mode) {
            case 'timed':
                await this.initializeGameData();
                this.view.selectTimedMode();
                this.startTimer();
                break;
            case 'free':
                await this.initializeGameData();
                this.view.selectFreePlayMode();
                break;
            case 'friend':
                if (this.model.username === '') {
                    this.view.userNameInput.focus();
                } else {
                    this.switchScreen('friend');
                }
                break;
            case 'random':
                if (this.model.username === '') {
                    this.view.userNameInput.focus();
                } else {
                    this.view.selectVSRandomMode();
                }
                break;
        }
        this.switchScreen('game');
        this.view.resetButton();
        this.model.setLoading(false);
    }

    switchScreen(screen) {
        this.view.updateScreenDisplay('none');
        this.model.updateCurrentScreen(screen);
        this.view.updateScreenDisplay('');
    }

    async initializeGameData() {
        await this.model.initializeGameData();
        this.view.setLetters();
    }


    /*................FRIEND................*/

    searchFriend(event) {
        event.preventDefault();
        const userName = event.currentTarget['user-name'].value;
        console.log(userName);
        // TODO: show either friend card with an add friend button or no friend found
    }


    /*................GAME................*/

    startTimer() {
        this.model.gameState.startTimer(() => this.updateTimer());
    }

    updateTimer() {
        this.view.updateTimer();
        if (this.model.gameState.time.seconds === 0) this.displayResults();
    }


    /*................RESULTS................*/

    displayResults() {
        const { game, words } = this.model.gameState;
        this.view.updateGameRecap(game.score, words.longest);
        this.switchScreen('results');
        this.view.animations.barGraph(words);
    }
}