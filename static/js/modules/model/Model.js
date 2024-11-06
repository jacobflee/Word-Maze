import { API } from './API.js'
import { Game } from './Game.js'
import { Selection } from './Selection.js'


export class Model {
    constructor() {
        this.api = new API(this);
        this.game = new Game();
        this.selection = new Selection();

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

    setFormError(form, userName) {
        switch (userName) {
            case null:
                this[form].error = null;
                break
            case '':
                this[form].error = 'username is empty';
                break
            default:
                this[form].error = 'username has outer spaces';
        }
    }


    /*................HOME................*/

    async setUserName(userName) {
        if (this.user.name === userName) return
        const apiCall = this.user.id
            ? this.api.updateUserName(userName)
            : this.api.createNewUser(userName);
        const data = await apiCall;
        this.user.error = data?.error;
        if (this.user.error) return
        if (!this.user.id) {
            this.user.id = data['user_id'];
            localStorage.setItem('userId', this.user.id);
        }
        this.user.name = userName;
        localStorage.setItem('userName', this.user.name);
    }



    async initializeGameData() {
        const { board, words } = await this.api.fetchNewGameData();
        this.game.updateValidWords(words);
        this.selection.updateBoard(board);
    }


    /*................GAME................*/

    addSelectedCell() {
        this.selection.updateSelectedCell();
        const word = this.selection.word.text;
        const [valid, found] = this.game.checkWordValidity(word);
        this.selection.updateValidatedCell(valid, found);
    }

    addFoundWord() {
        const word = this.selection.word.text;
        this.game.addFoundWord(word);
    }
}