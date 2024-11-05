import { API } from './API.js'
import { GameState } from './GameState.js'
import { SelectionState } from './SelectionState.js'


export class Model {
    constructor() {
        this.api = new API(this);
        this.gameState = new GameState();
        this.selectionState = new SelectionState();

        this.loading = false;
        this.screen = 'home';
        this.mode = '';
        this.user = {
            name: localStorage.getItem('userName'),
            id: localStorage.getItem('userId'),
            error: null,
        }

        // localStorage.removeItem('userId')
        // localStorage.removeItem('userName')
    }


    /*................GLOBAL................*/

    setLoading(value) {
        this.loading = value;
    }

    updateCurrentScreen(screen) {
        this.screen = screen;
    }

    setMode(mode) {
        this.mode = mode;
    }

    resetFormError(form) {
        this[form].error = null;
    }

    setFormError(form, error) {
        this[form].error = error;
    }


    /*................HOME................*/

    async setUserName(userName) {
        if (this.user.name === userName) return;
        const apiCall = this.user.id
            ? this.api.updateUserName(userName)
            : this.api.createNewUser(userName);
        const data = await apiCall;
        this.user.error = data?.error;
        if (this.user.error) return;
        if (!this.user.id) {
            this.user.id = data['user_id'];
            localStorage.setItem('userId', this.user.id);
        }
        this.user.name = userName;
        localStorage.setItem('userName', this.user.name);
    }



    async initializeGameData() {
        const { board, words } = await this.api.fetchNewGameData();
        this.gameState.updateValidWords(words);
        this.selectionState.updateBoard(board);
    }


    /*................GAME................*/

    addSelectedCell() {
        this.selectionState.updateSelectedCell();
        const word = this.selectionState.word.text;
        const [valid, found] = this.gameState.checkWordValidity(word);
        this.selectionState.updateValidatedCell(valid, found);
    }

    addFoundWord() {
        const word = this.selectionState.word.text;
        this.gameState.addFoundWord(word);
    }
}