import { Model } from '../model/Model.js'
import { View } from '../view/View.js'
import { Game } from './Game.js'
import { addEventListeners } from '../utils.js'


export class Controller {
    constructor() {
        this.model = new Model();
        this.view = new View(this.model);
        this.game = new Game(this.model, this.view);
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
            () => this.switchScreen('home')
        );
        addEventListeners(
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
        addEventListeners(
            this.view.touchTargets,
            ['mousedown', 'mousemove', 'touchstart', 'touchmove'],
            (event) => this.game.handleCellInteraction(event)
        );
        addEventListeners(
            window,
            ['touchcancel', 'touchend', 'mouseup'],
            () => this.game.endSelection()
        );
    }

    switchScreen(screen) {
        this.view.updateScreenDisplay('none');
        this.model.updateCurrentScreen(screen);
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
        if (this.model.loading) return
        this.model.setLoading(true);
        this.model.setMode(event.currentTarget.dataset.mode);
        this.view.setButtonAsLoading();
        this.model.game.reset();
        switch (this.model.mode) {
            case 'timed':
                await this.initializeGameData();
                this.view.selectTimedMode();
                this.game.startTimer();
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
        this.view.game.setLetters();
    }


    /*................FRIEND................*/

    searchFriend(event) {
        event.preventDefault();
        const userName = event.currentTarget['user-name'].value;
    }


    /*................RESULTS................*/

    displayResults() {
        const { game, words } = this.model.game;
        this.view.updateGameRecap(game.score, words.longest);
        this.switchScreen('results');
        this.view.animations.barGraph(words);
    }
}